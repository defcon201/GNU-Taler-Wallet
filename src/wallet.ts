/*
 This file is part of GNU Taler
 (C) 2015-2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */

/**
 * High-level wallet operations that should be indepentent from the underlying
 * browser extension interface.
 */

/**
 * Imports.
 */
import { CryptoApi, CryptoWorkerFactory } from "./crypto/workers/cryptoApi";
import { HttpRequestLibrary } from "./util/http";
import {
  oneShotPut,
  oneShotGet,
  runWithWriteTransaction,
  oneShotIter,
  oneShotIterIndex,
} from "./util/query";

import { AmountJson } from "./util/amounts";
import * as Amounts from "./util/amounts";

import {
  acceptWithdrawal,
  getWithdrawalInfo,
  getWithdrawDetailsForUri,
  getWithdrawDetailsForAmount,
} from "./wallet-impl/withdraw";

import {
  abortFailedPayment,
  preparePay,
  confirmPay,
  processDownloadProposal,
  applyRefund,
  getFullRefundFees,
  processPurchasePay,
  processPurchaseQueryRefund,
  processPurchaseApplyRefund,
} from "./wallet-impl/pay";

import {
  CoinRecord,
  CoinStatus,
  CurrencyRecord,
  DenominationRecord,
  ExchangeRecord,
  ProposalRecord,
  PurchaseRecord,
  ReserveRecord,
  Stores,
  ReserveRecordStatus,
} from "./dbTypes";
import { MerchantRefundPermission } from "./talerTypes";
import {
  BenchmarkResult,
  ConfirmPayResult,
  ConfirmReserveRequest,
  CreateReserveRequest,
  CreateReserveResponse,
  HistoryEvent,
  ReturnCoinsRequest,
  SenderWireInfos,
  TipStatus,
  WalletBalance,
  PreparePayResult,
  DownloadedWithdrawInfo,
  WithdrawDetails,
  AcceptWithdrawalResponse,
  PurchaseDetails,
  PendingOperationInfo,
  PendingOperationsResponse,
  HistoryQuery,
  WalletNotification,
  NotificationType,
} from "./walletTypes";
import { Logger } from "./util/logging";

import { assertUnreachable } from "./util/assertUnreachable";

import {
  updateExchangeFromUrl,
  getExchangeTrust,
  getExchangePaytoUri,
} from "./wallet-impl/exchanges";
import { processReserve } from "./wallet-impl/reserves";

import { InternalWalletState } from "./wallet-impl/state";
import { createReserve, confirmReserve } from "./wallet-impl/reserves";
import { processRefreshSession, refresh } from "./wallet-impl/refresh";
import { processWithdrawSession } from "./wallet-impl/withdraw";
import { getHistory } from "./wallet-impl/history";
import { getPendingOperations } from "./wallet-impl/pending";
import { getBalances } from "./wallet-impl/balance";
import { acceptTip, getTipStatus, processTip } from "./wallet-impl/tip";
import { returnCoins } from "./wallet-impl/return";
import { payback } from "./wallet-impl/payback";
import { TimerGroup } from "./util/timer";
import { AsyncCondition } from "./util/promiseUtils";
import { AsyncOpMemoSingle } from "./util/asyncMemo";

/**
 * Wallet protocol version spoken with the exchange
 * and merchant.
 *
 * Uses libtool's current:revision:age versioning.
 */
export const WALLET_PROTOCOL_VERSION = "3:0:0";

export const WALLET_CACHE_BREAKER_CLIENT_VERSION = "3";

const builtinCurrencies: CurrencyRecord[] = [
  {
    auditors: [
      {
        auditorPub: "BW9DC48PHQY4NH011SHHX36DZZ3Q22Y6X7FZ1VD1CMZ2PTFZ6PN0",
        baseUrl: "https://auditor.demo.taler.net/",
        expirationStamp: new Date(2027, 1).getTime(),
      },
    ],
    exchanges: [],
    fractionalDigits: 2,
    name: "KUDOS",
  },
];

const logger = new Logger("wallet.ts");

/**
 * The platform-independent wallet implementation.
 */
export class Wallet {
  private ws: InternalWalletState;
  private timerGroup: TimerGroup = new TimerGroup();
  private latch = new AsyncCondition();
  private stopped: boolean = false;
  private memoRunRetryLoop = new AsyncOpMemoSingle<void>();

  get db(): IDBDatabase {
    return this.ws.db;
  }

  constructor(
    db: IDBDatabase,
    http: HttpRequestLibrary,
    cryptoWorkerFactory: CryptoWorkerFactory,
  ) {
    this.ws = new InternalWalletState(db, http, cryptoWorkerFactory);
  }

  getExchangePaytoUri(exchangeBaseUrl: string, supportedTargetTypes: string[]) {
    return getExchangePaytoUri(this.ws, exchangeBaseUrl, supportedTargetTypes);
  }

  getWithdrawDetailsForAmount(baseUrl: any, amount: AmountJson): any {
    return getWithdrawDetailsForAmount(this.ws, baseUrl, amount);
  }

  addNotificationListener(f: (n: WalletNotification) => void): void {
    this.ws.addNotificationListener(f);
  }

  /**
   * Execute one operation based on the pending operation info record.
   */
  async processOnePendingOperation(
    pending: PendingOperationInfo,
    forceNow: boolean = false,
  ): Promise<void> {
    console.log("running pending", pending);
    switch (pending.type) {
      case "bug":
        // Nothing to do, will just be displayed to the user
        return;
      case "dirty-coin":
        await refresh(this.ws, pending.coinPub);
        break;
      case "exchange-update":
        await updateExchangeFromUrl(this.ws, pending.exchangeBaseUrl);
        break;
      case "refresh":
        await processRefreshSession(this.ws, pending.refreshSessionId);
        break;
      case "reserve":
        await processReserve(this.ws, pending.reservePub, forceNow);
        break;
      case "withdraw":
        await processWithdrawSession(this.ws, pending.withdrawSessionId);
        break;
      case "proposal-choice":
        // Nothing to do, user needs to accept/reject
        break;
      case "proposal-download":
        await processDownloadProposal(this.ws, pending.proposalId);
        break;
      case "tip":
        await processTip(this.ws, pending.tipId);
        break;
      case "pay":
        await processPurchasePay(this.ws, pending.proposalId);
        break;
      case "refund-query":
        await processPurchaseQueryRefund(this.ws, pending.proposalId);
        break;
      case "refund-apply":
        await processPurchaseApplyRefund(this.ws, pending.proposalId);
        break;
      default:
        assertUnreachable(pending);
    }
  }

  /**
   * Process pending operations.
   */
  public async runPending(forceNow: boolean = false): Promise<void> {
    const onlyDue = !forceNow;
    const pendingOpsResponse = await this.getPendingOperations(onlyDue);
    for (const p of pendingOpsResponse.pendingOperations) {
      try {
        await this.processOnePendingOperation(p, forceNow);
      } catch (e) {
        console.error(e);
      }
    }
  }

  /**
   * Run the wallet until there are no more pending operations that give
   * liveness left.  The wallet will be in a stopped state when this function
   * returns without resolving to an exception.
   */
  public async runUntilDone(): Promise<void> {
    const p = new Promise((resolve, reject) => {
      // Run this asynchronously
      this.addNotificationListener(n => {
        if (
          n.type === NotificationType.WaitingForRetry &&
          n.numGivingLiveness == 0
        ) {
          logger.trace("no liveness-giving operations left, stopping");
          this.stop();
        }
      });
      this.runRetryLoop().catch(e => {
        console.log("exception in wallet retry loop");
        reject(e);
      });
    });
    await p;
  }

  /**
   * Process pending operations and wait for scheduled operations in
   * a loop until the wallet is stopped explicitly.
   */
  public async runRetryLoop(): Promise<void> {
    // Make sure we only run one main loop at a time.
    return this.memoRunRetryLoop.memo(async () => {
      try {
        await this.runRetryLoopImpl();
      } catch (e) {
        console.error("error during retry loop execution", e);
        throw e;
      }
    });
  }

  private async runRetryLoopImpl(): Promise<void> {
    while (!this.stopped) {
      console.log("running wallet retry loop iteration");
      let pending = await this.getPendingOperations(true);
      if (pending.pendingOperations.length === 0) {
        const allPending = await this.getPendingOperations(false);
        let numPending = 0;
        let numGivingLiveness = 0;
        for (const p of allPending.pendingOperations) {
          numPending++;
          if (p.givesLifeness) {
            numGivingLiveness++;
          }
        }
        let timeout;
        if (
          allPending.pendingOperations.length === 0 ||
          allPending.nextRetryDelay.d_ms === Number.MAX_SAFE_INTEGER
        ) {
          // Wait forever
          timeout = new Promise(() => {});
          console.log("waiting forever");
        } else {
          console.log("waiting for timeout", pending.nextRetryDelay);
          timeout = this.timerGroup.resolveAfter(
            allPending.nextRetryDelay.d_ms,
          );
        }
        this.ws.notify({
          type: NotificationType.WaitingForRetry,
          numGivingLiveness,
          numPending,
        });
        await Promise.race([timeout, this.latch.wait()]);
        console.log("timeout done");
      } else {
        logger.trace("running pending operations that are due");
        // FIXME: maybe be a bit smarter about executing these
        // opeations in parallel?
        for (const p of pending.pendingOperations) {
          try {
            console.log("running", p);
            await this.processOnePendingOperation(p);
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
    logger.trace("exiting wallet retry loop");
  }

  /**
   * Insert the hard-coded defaults for exchanges, coins and
   * auditors into the database, unless these defaults have
   * already been applied.
   */
  async fillDefaults() {
    await runWithWriteTransaction(
      this.db,
      [Stores.config, Stores.currencies],
      async tx => {
        let applied = false;
        await tx.iter(Stores.config).forEach(x => {
          if (x.key == "currencyDefaultsApplied" && x.value == true) {
            applied = true;
          }
        });
        if (!applied) {
          for (let c of builtinCurrencies) {
            await tx.put(Stores.currencies, c);
          }
        }
      },
    );
  }

  /**
   * Check if a payment for the given taler://pay/ URI is possible.
   *
   * If the payment is possible, the signature are already generated but not
   * yet send to the merchant.
   */
  async preparePay(talerPayUri: string): Promise<PreparePayResult> {
    return preparePay(this.ws, talerPayUri);
  }

  /**
   * Refresh all dirty coins.
   * The returned promise resolves only after all refresh
   * operations have completed.
   */
  async refreshDirtyCoins(): Promise<{ numRefreshed: number }> {
    let n = 0;
    const coins = await oneShotIter(this.db, Stores.coins).toArray();
    for (let coin of coins) {
      if (coin.status == CoinStatus.Dirty) {
        try {
          await this.refresh(coin.coinPub);
        } catch (e) {
          console.log("error during refresh");
        }

        n += 1;
      }
    }
    return { numRefreshed: n };
  }

  /**
   * Add a contract to the wallet and sign coins, and send them.
   */
  async confirmPay(
    proposalId: string,
    sessionIdOverride: string | undefined,
  ): Promise<ConfirmPayResult> {
    try {
      return await confirmPay(this.ws, proposalId, sessionIdOverride);
    } finally {
      this.latch.trigger();
    }
  }

  /**
   * First fetch information requred to withdraw from the reserve,
   * then deplete the reserve, withdrawing coins until it is empty.
   *
   * The returned promise resolves once the reserve is set to the
   * state DORMANT.
   */
  async processReserve(reservePub: string): Promise<void> {
    try {
      return await processReserve(this.ws, reservePub);
    } finally {
      this.latch.trigger();
    }
  }

  /**
   * Create a reserve, but do not flag it as confirmed yet.
   *
   * Adds the corresponding exchange as a trusted exchange if it is neither
   * audited nor trusted already.
   */
  async createReserve(
    req: CreateReserveRequest,
  ): Promise<CreateReserveResponse> {
    try {
      return createReserve(this.ws, req);
    } finally {
      this.latch.trigger();
    }
  }

  /**
   * Mark an existing reserve as confirmed.  The wallet will start trying
   * to withdraw from that reserve.  This may not immediately succeed,
   * since the exchange might not know about the reserve yet, even though the
   * bank confirmed its creation.
   *
   * A confirmed reserve should be shown to the user in the UI, while
   * an unconfirmed reserve should be hidden.
   */
  async confirmReserve(req: ConfirmReserveRequest): Promise<void> {
    try {
      return confirmReserve(this.ws, req);
    } finally {
      this.latch.trigger();
    }
  }

  /**
   * Check if and how an exchange is trusted and/or audited.
   */
  async getExchangeTrust(
    exchangeInfo: ExchangeRecord,
  ): Promise<{ isTrusted: boolean; isAudited: boolean }> {
    return getExchangeTrust(this.ws, exchangeInfo);
  }

  async getWithdrawDetailsForUri(
    talerWithdrawUri: string,
    maybeSelectedExchange?: string,
  ): Promise<WithdrawDetails> {
    return getWithdrawDetailsForUri(
      this.ws,
      talerWithdrawUri,
      maybeSelectedExchange,
    );
  }

  /**
   * Update or add exchange DB entry by fetching the /keys and /wire information.
   * Optionally link the reserve entry to the new or existing
   * exchange entry in then DB.
   */
  async updateExchangeFromUrl(
    baseUrl: string,
    force: boolean = false,
  ): Promise<ExchangeRecord> {
    return updateExchangeFromUrl(this.ws, baseUrl, force);
  }

  /**
   * Get detailed balance information, sliced by exchange and by currency.
   */
  async getBalances(): Promise<WalletBalance> {
    return this.ws.memoGetBalance.memo(() => getBalances(this.ws));
  }

  async refresh(oldCoinPub: string, force: boolean = false): Promise<void> {
    return refresh(this.ws, oldCoinPub, force);
  }

  async findExchange(
    exchangeBaseUrl: string,
  ): Promise<ExchangeRecord | undefined> {
    return await oneShotGet(this.db, Stores.exchanges, exchangeBaseUrl);
  }

  /**
   * Retrive the full event history for this wallet.
   */
  async getHistory(
    historyQuery?: HistoryQuery,
  ): Promise<{ history: HistoryEvent[] }> {
    return getHistory(this.ws, historyQuery);
  }

  async getPendingOperations(
    onlyDue: boolean = false,
  ): Promise<PendingOperationsResponse> {
    return this.ws.memoGetPending.memo(() =>
      getPendingOperations(this.ws, onlyDue),
    );
  }

  async getDenoms(exchangeUrl: string): Promise<DenominationRecord[]> {
    const denoms = await oneShotIterIndex(
      this.db,
      Stores.denominations.exchangeBaseUrlIndex,
      exchangeUrl,
    ).toArray();
    return denoms;
  }

  async getProposal(proposalId: string): Promise<ProposalRecord | undefined> {
    const proposal = await oneShotGet(this.db, Stores.proposals, proposalId);
    return proposal;
  }

  async getExchanges(): Promise<ExchangeRecord[]> {
    return await oneShotIter(this.db, Stores.exchanges).toArray();
  }

  async getCurrencies(): Promise<CurrencyRecord[]> {
    return await oneShotIter(this.db, Stores.currencies).toArray();
  }

  async updateCurrency(currencyRecord: CurrencyRecord): Promise<void> {
    logger.trace("updating currency to", currencyRecord);
    await oneShotPut(this.db, Stores.currencies, currencyRecord);
  }

  async getReserves(exchangeBaseUrl: string): Promise<ReserveRecord[]> {
    return await oneShotIter(this.db, Stores.reserves).filter(
      r => r.exchangeBaseUrl === exchangeBaseUrl,
    );
  }

  async getCoinsForExchange(exchangeBaseUrl: string): Promise<CoinRecord[]> {
    return await oneShotIter(this.db, Stores.coins).filter(
      c => c.exchangeBaseUrl === exchangeBaseUrl,
    );
  }

  async getCoins(): Promise<CoinRecord[]> {
    return await oneShotIter(this.db, Stores.coins).toArray();
  }

  async payback(coinPub: string): Promise<void> {
    return payback(this.ws, coinPub);
  }

  async getPaybackReserves(): Promise<ReserveRecord[]> {
    return await oneShotIter(this.db, Stores.reserves).filter(
      r => r.hasPayback,
    );
  }

  /**
   * Stop ongoing processing.
   */
  stop() {
    this.stopped = true;
    this.timerGroup.stopCurrentAndFutureTimers();
    this.ws.cryptoApi.stop();
  }

  async getSenderWireInfos(): Promise<SenderWireInfos> {
    const m: { [url: string]: Set<string> } = {};

    await oneShotIter(this.db, Stores.exchanges).forEach(x => {
      const wi = x.wireInfo;
      if (!wi) {
        return;
      }
      const s = (m[x.baseUrl] = m[x.baseUrl] || new Set());
      Object.keys(wi.feesForType).map(k => s.add(k));
    });

    const exchangeWireTypes: { [url: string]: string[] } = {};
    Object.keys(m).map(e => {
      exchangeWireTypes[e] = Array.from(m[e]);
    });

    const senderWiresSet: Set<string> = new Set();
    await oneShotIter(this.db, Stores.senderWires).forEach(x => {
      senderWiresSet.add(x.paytoUri);
    });

    const senderWires: string[] = Array.from(senderWiresSet);

    return {
      exchangeWireTypes,
      senderWires,
    };
  }

  /**
   * Trigger paying coins back into the user's account.
   */
  async returnCoins(req: ReturnCoinsRequest): Promise<void> {
    return returnCoins(this.ws, req);
  }

  /**
   * Accept a refund, return the contract hash for the contract
   * that was involved in the refund.
   */
  async applyRefund(talerRefundUri: string): Promise<string> {
    return applyRefund(this.ws, talerRefundUri);
  }

  async getPurchase(
    contractTermsHash: string,
  ): Promise<PurchaseRecord | undefined> {
    return oneShotGet(this.db, Stores.purchases, contractTermsHash);
  }

  async getFullRefundFees(
    refundPermissions: MerchantRefundPermission[],
  ): Promise<AmountJson> {
    return getFullRefundFees(this.ws, refundPermissions);
  }

  async acceptTip(talerTipUri: string): Promise<void> {
    return acceptTip(this.ws, talerTipUri);
  }

  async getTipStatus(talerTipUri: string): Promise<TipStatus> {
    return getTipStatus(this.ws, talerTipUri);
  }

  async abortFailedPayment(contractTermsHash: string): Promise<void> {
    return abortFailedPayment(this.ws, contractTermsHash);
  }

  public async handleNotifyReserve() {
    const reserves = await oneShotIter(this.db, Stores.reserves).toArray();
    for (const r of reserves) {
      if (r.reserveStatus === ReserveRecordStatus.WAIT_CONFIRM_BANK) {
        try {
          this.processReserve(r.reservePub);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  /**
   * Remove unreferenced / expired data from the wallet's database
   * based on the current system time.
   */
  async collectGarbage() {
    // FIXME(#5845)
    // We currently do not garbage-collect the wallet database.  This might change
    // after the feature has been properly re-designed, and we have come up with a
    // strategy to test it.
  }

  /**
   * Get information about a withdrawal from
   * a taler://withdraw URI.
   */
  async getWithdrawalInfo(
    talerWithdrawUri: string,
  ): Promise<DownloadedWithdrawInfo> {
    return getWithdrawalInfo(this.ws, talerWithdrawUri);
  }

  async acceptWithdrawal(
    talerWithdrawUri: string,
    selectedExchange: string,
  ): Promise<AcceptWithdrawalResponse> {
    return acceptWithdrawal(this.ws, talerWithdrawUri, selectedExchange);
  }

  async getPurchaseDetails(hc: string): Promise<PurchaseDetails> {
    const purchase = await oneShotGet(this.db, Stores.purchases, hc);
    if (!purchase) {
      throw Error("unknown purchase");
    }
    const refundsDoneAmounts = Object.values(purchase.refundsDone).map(x =>
      Amounts.parseOrThrow(x.refund_amount),
    );
    const refundsPendingAmounts = Object.values(
      purchase.refundsPending,
    ).map(x => Amounts.parseOrThrow(x.refund_amount));
    const totalRefundAmount = Amounts.sum([
      ...refundsDoneAmounts,
      ...refundsPendingAmounts,
    ]).amount;
    const refundsDoneFees = Object.values(purchase.refundsDone).map(x =>
      Amounts.parseOrThrow(x.refund_amount),
    );
    const refundsPendingFees = Object.values(purchase.refundsPending).map(x =>
      Amounts.parseOrThrow(x.refund_amount),
    );
    const totalRefundFees = Amounts.sum([
      ...refundsDoneFees,
      ...refundsPendingFees,
    ]).amount;
    const totalFees = totalRefundFees;
    return {
      contractTerms: purchase.contractTerms,
      hasRefund: purchase.lastRefundStatusTimestamp !== undefined,
      totalRefundAmount: totalRefundAmount,
      totalRefundAndRefreshFees: totalFees,
    };
  }

  benchmarkCrypto(repetitions: number): Promise<BenchmarkResult> {
    return this.ws.cryptoApi.benchmark(repetitions);
  }
}
