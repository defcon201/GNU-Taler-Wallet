/*
 This file is part of TALER
 (C) 2016 GNUnet e.V.

 TALER is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 TALER is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 TALER; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */

/**
 * API to access the Taler crypto worker thread.
 * @author Florian Dold
 */

/**
 * Imports.
 */
import { AmountJson } from "../../util/amounts";

import {
  CoinRecord,
  DenominationRecord,
  RefreshSessionRecord,
  TipPlanchet,
  WireFee,
} from "../../types/dbTypes";

import { CryptoWorker } from "./cryptoWorker";

import {
  RecoupRequest,
  CoinDepositPermission,
  RecoupConfirmation,
  ExchangeSignKeyJson,
  EddsaPublicKeyString,
} from "../../types/talerTypes";

import {
  BenchmarkResult,
  PlanchetCreationResult,
  PlanchetCreationRequest,
  DepositInfo,
} from "../../types/walletTypes";

import * as timer from "../../util/timer";

/**
 * State of a crypto worker.
 */
interface WorkerState {
  /**
   * The actual worker thread.
   */
  w: CryptoWorker | null;

  /**
   * Work we're currently executing or null if not busy.
   */
  currentWorkItem: WorkItem | null;

  /**
   * Timer to terminate the worker if it's not busy enough.
   */
  terminationTimerHandle: timer.TimerHandle | null;
}

interface WorkItem {
  operation: string;
  args: any[];
  resolve: any;
  reject: any;

  /**
   * Serial id to identify a matching response.
   */
  rpcId: number;

  /**
   * Time when the work was submitted to a (non-busy) worker thread.
   */
  startTime: number;
}

/**
 * Number of different priorities. Each priority p
 * must be 0 <= p < NUM_PRIO.
 */
const NUM_PRIO = 5;

export interface CryptoWorkerFactory {
  /**
   * Start a new worker.
   */
  startWorker(): CryptoWorker;

  /**
   * Query the number of workers that should be
   * run at the same time.
   */
  getConcurrency(): number;
}

export class BrowserCryptoWorkerFactory implements CryptoWorkerFactory {
  startWorker(): CryptoWorker {
    const workerCtor = Worker;
    const workerPath = "/dist/cryptoWorker-bundle.js";
    return new workerCtor(workerPath) as CryptoWorker;
  }

  getConcurrency(): number {
    let concurrency = 2;
    try {
      // only works in the browser
      // tslint:disable-next-line:no-string-literal
      concurrency = (navigator as any)["hardwareConcurrency"];
      concurrency = Math.max(1, Math.ceil(concurrency / 2));
    } catch (e) {
      concurrency = 2;
    }
    return concurrency;
  }
}

/**
 * Crypto API that interfaces manages a background crypto thread
 * for the execution of expensive operations.
 */
export class CryptoApi {
  private nextRpcId: number = 1;
  private workers: WorkerState[];
  private workQueues: WorkItem[][];

  private workerFactory: CryptoWorkerFactory;

  /**
   * Number of busy workers.
   */
  private numBusy: number = 0;

  /**
   * Did we stop accepting new requests?
   */
  private stopped: boolean = false;

  static enableTracing = false;

  /**
   * Terminate all worker threads.
   */
  terminateWorkers() {
    for (let worker of this.workers) {
      if (worker.w) {
        CryptoApi.enableTracing && console.log("terminating worker");
        worker.w.terminate();
        if (worker.terminationTimerHandle) {
          worker.terminationTimerHandle.clear();
          worker.terminationTimerHandle = null;
        }
        if (worker.currentWorkItem) {
          worker.currentWorkItem.reject(Error("explicitly terminated"));
          worker.currentWorkItem = null;
        }
        worker.w = null;
      }
    }
  }

  stop() {
    this.terminateWorkers();
    this.stopped = true;
  }

  /**
   * Start a worker (if not started) and set as busy.
   */
  wake(ws: WorkerState, work: WorkItem): void {
    if (this.stopped) {
      console.log("cryptoApi is stopped");
      CryptoApi.enableTracing &&
        console.log("not waking, as cryptoApi is stopped");
      return;
    }
    if (ws.currentWorkItem !== null) {
      throw Error("assertion failed");
    }
    ws.currentWorkItem = work;
    this.numBusy++;
    if (!ws.w) {
      const w = this.workerFactory.startWorker();
      w.onmessage = (m: MessageEvent) => this.handleWorkerMessage(ws, m);
      w.onerror = (e: ErrorEvent) => this.handleWorkerError(ws, e);
      ws.w = w;
    }

    const msg: any = {
      args: work.args,
      id: work.rpcId,
      operation: work.operation,
    };
    this.resetWorkerTimeout(ws);
    work.startTime = timer.performanceNow();
    setImmediate(() => ws.w!.postMessage(msg));
  }

  resetWorkerTimeout(ws: WorkerState) {
    if (ws.terminationTimerHandle !== null) {
      ws.terminationTimerHandle.clear();
      ws.terminationTimerHandle = null;
    }
    const destroy = () => {
      // terminate worker if it's idle
      if (ws.w && ws.currentWorkItem === null) {
        ws.w!.terminate();
        ws.w = null;
      }
    };
    ws.terminationTimerHandle = timer.after(15 * 1000, destroy);
  }

  handleWorkerError(ws: WorkerState, e: ErrorEvent) {
    if (ws.currentWorkItem) {
      console.error(
        `error in worker during ${ws.currentWorkItem!.operation}`,
        e,
      );
    } else {
      console.error("error in worker", e);
    }
    console.error(e.message);
    try {
      ws.w!.terminate();
      ws.w = null;
    } catch (e) {
      console.error(e);
    }
    if (ws.currentWorkItem !== null) {
      ws.currentWorkItem.reject(e);
      ws.currentWorkItem = null;
      this.numBusy--;
    }
    this.findWork(ws);
  }

  private findWork(ws: WorkerState) {
    // try to find more work for this worker
    for (let i = 0; i < NUM_PRIO; i++) {
      const q = this.workQueues[NUM_PRIO - i - 1];
      if (q.length !== 0) {
        const work: WorkItem = q.shift()!;
        this.wake(ws, work);
        return;
      }
    }
  }

  handleWorkerMessage(ws: WorkerState, msg: MessageEvent) {
    const id = msg.data.id;
    if (typeof id !== "number") {
      console.error("rpc id must be number");
      return;
    }
    const currentWorkItem = ws.currentWorkItem;
    ws.currentWorkItem = null;
    this.numBusy--;
    this.findWork(ws);
    if (!currentWorkItem) {
      console.error("unsolicited response from worker");
      return;
    }
    if (id !== currentWorkItem.rpcId) {
      console.error(`RPC with id ${id} has no registry entry`);
      return;
    }

    CryptoApi.enableTracing &&
      console.log(
        `rpc ${currentWorkItem.operation} took ${timer.performanceNow() -
          currentWorkItem.startTime}ms`,
      );
    currentWorkItem.resolve(msg.data.result);
  }

  constructor(workerFactory: CryptoWorkerFactory) {
    this.workerFactory = workerFactory;
    this.workers = new Array<WorkerState>(workerFactory.getConcurrency());

    for (let i = 0; i < this.workers.length; i++) {
      this.workers[i] = {
        currentWorkItem: null,
        terminationTimerHandle: null,
        w: null,
      };
    }

    this.workQueues = [];
    for (let i = 0; i < NUM_PRIO; i++) {
      this.workQueues.push([]);
    }
  }

  private doRpc<T>(
    operation: string,
    priority: number,
    ...args: any[]
  ): Promise<T> {
    const p: Promise<T> = new Promise<T>((resolve, reject) => {
      const rpcId = this.nextRpcId++;
      const workItem: WorkItem = {
        operation,
        args,
        resolve,
        reject,
        rpcId,
        startTime: 0,
      };

      if (this.numBusy === this.workers.length) {
        const q = this.workQueues[priority];
        if (!q) {
          throw Error("assertion failed");
        }
        this.workQueues[priority].push(workItem);
        return;
      }

      for (const ws of this.workers) {
        if (ws.currentWorkItem !== null) {
          continue;
        }
        this.wake(ws, workItem);
        return;
      }

      throw Error("assertion failed");
    });

    return p;
  }

  createPlanchet(
    req: PlanchetCreationRequest,
  ): Promise<PlanchetCreationResult> {
    return this.doRpc<PlanchetCreationResult>("createPlanchet", 1, req);
  }

  createTipPlanchet(denom: DenominationRecord): Promise<TipPlanchet> {
    return this.doRpc<TipPlanchet>("createTipPlanchet", 1, denom);
  }

  hashString(str: string): Promise<string> {
    return this.doRpc<string>("hashString", 1, str);
  }

  hashDenomPub(denomPub: string): Promise<string> {
    return this.doRpc<string>("hashDenomPub", 1, denomPub);
  }

  isValidDenom(denom: DenominationRecord, masterPub: string): Promise<boolean> {
    return this.doRpc<boolean>("isValidDenom", 2, denom, masterPub);
  }

  isValidWireFee(
    type: string,
    wf: WireFee,
    masterPub: string,
  ): Promise<boolean> {
    return this.doRpc<boolean>("isValidWireFee", 2, type, wf, masterPub);
  }

  isValidPaymentSignature(
    sig: string,
    contractHash: string,
    merchantPub: string,
  ): Promise<boolean> {
    return this.doRpc<boolean>(
      "isValidPaymentSignature",
      1,
      sig,
      contractHash,
      merchantPub,
    );
  }

  signDepositPermission(
    depositInfo: DepositInfo,
  ): Promise<CoinDepositPermission> {
    return this.doRpc<CoinDepositPermission>(
      "signDepositPermission",
      3,
      depositInfo,
    );
  }

  createEddsaKeypair(): Promise<{ priv: string; pub: string }> {
    return this.doRpc<{ priv: string; pub: string }>("createEddsaKeypair", 1);
  }

  rsaUnblind(sig: string, bk: string, pk: string): Promise<string> {
    return this.doRpc<string>("rsaUnblind", 4, sig, bk, pk);
  }

  rsaVerify(hm: string, sig: string, pk: string): Promise<boolean> {
    return this.doRpc<boolean>("rsaVerify", 4, hm, sig, pk);
  }

  isValidWireAccount(
    paytoUri: string,
    sig: string,
    masterPub: string,
  ): Promise<boolean> {
    return this.doRpc<boolean>(
      "isValidWireAccount",
      4,
      paytoUri,
      sig,
      masterPub,
    );
  }

  createRecoupRequest(coin: CoinRecord): Promise<RecoupRequest> {
    return this.doRpc<RecoupRequest>("createRecoupRequest", 1, coin);
  }

  createRefreshSession(
    exchangeBaseUrl: string,
    kappa: number,
    meltCoin: CoinRecord,
    newCoinDenoms: DenominationRecord[],
    meltFee: AmountJson,
  ): Promise<RefreshSessionRecord> {
    return this.doRpc<RefreshSessionRecord>(
      "createRefreshSession",
      4,
      exchangeBaseUrl,
      kappa,
      meltCoin,
      newCoinDenoms,
      meltFee,
    );
  }

  signCoinLink(
    oldCoinPriv: string,
    newDenomHash: string,
    oldCoinPub: string,
    transferPub: string,
    coinEv: string,
  ): Promise<string> {
    return this.doRpc<string>(
      "signCoinLink",
      4,
      oldCoinPriv,
      newDenomHash,
      oldCoinPub,
      transferPub,
      coinEv,
    );
  }

  benchmark(repetitions: number): Promise<BenchmarkResult> {
    return this.doRpc<BenchmarkResult>("benchmark", 1, repetitions);
  }
}
