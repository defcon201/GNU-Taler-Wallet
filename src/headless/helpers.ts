/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

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
 * Helpers to create headless wallets.
 */

/**
 * Imports.
 */
import { Wallet, OperationFailedAndReportedError } from "../wallet";
import { Notifier, Badge } from "../walletTypes";
import { MemoryBackend, BridgeIDBFactory, shimIndexedDB } from "idb-bridge";
import { SynchronousCryptoWorkerFactory } from "../crypto/synchronousWorker";
import { openTalerDb } from "../db";
import Axios from "axios";
import querystring = require("querystring");
import { HttpRequestLibrary } from "../http";
import * as amounts from "../amounts";
import { Bank } from "./bank";

import fs = require("fs");

const enableTracing = false;

class ConsoleBadge implements Badge {
  startBusy(): void {
    enableTracing && console.log("NOTIFICATION: busy");
  }
  stopBusy(): void {
    enableTracing && console.log("NOTIFICATION: busy end");
  }
  showNotification(): void {
    enableTracing && console.log("NOTIFICATION: show");
  }
  clearNotification(): void {
    enableTracing && console.log("NOTIFICATION: cleared");
  }
}

export class NodeHttpLib implements HttpRequestLibrary {
  async get(url: string): Promise<import("../http").HttpResponse> {
    enableTracing && console.log("making GET request to", url);
    try {
      const resp = await Axios({
        method: "get",
        url: url,
        responseType: "json",
      });
      enableTracing && console.log("got response", resp.data);
      enableTracing && console.log("resp type", typeof resp.data);
      return {
        responseJson: resp.data,
        status: resp.status,
      };
    } catch (e) {
      throw e;
    }
  }

  async postJson(
    url: string,
    body: any,
  ): Promise<import("../http").HttpResponse> {
    enableTracing && console.log("making POST request to", url);
    try {
      const resp = await Axios({
        method: "post",
        url: url,
        responseType: "json",
        data: body,
      });
      enableTracing && console.log("got response", resp.data);
      enableTracing && console.log("resp type", typeof resp.data);
      return {
        responseJson: resp.data,
        status: resp.status,
      };
    } catch (e) {
      throw e;
    }
  }
}

export interface DefaultNodeWalletArgs {
  /**
   * Location of the wallet database.
   *
   * If not specified, the wallet starts out with an empty database and
   * the wallet database is stored only in memory.
   */
  persistentStoragePath?: string;


  /**
   * Handler for asynchronous notifications from the wallet.
   */
  notifyHandler?: (reason: string) => void;

  /**
   * If specified, use this as HTTP request library instead
   * of the default one.
   */
  httpLib?: HttpRequestLibrary;
}

/**
 * Get a wallet instance with default settings for node.
 */
export async function getDefaultNodeWallet(
  args: DefaultNodeWalletArgs = {},
): Promise<Wallet> {
  const myNotifier: Notifier = {
    notify() {
      if (args.notifyHandler) {
        args.notifyHandler("");
      }
    }
  }

  const myBadge = new ConsoleBadge();

  BridgeIDBFactory.enableTracing = false;
  const myBackend = new MemoryBackend();
  myBackend.enableTracing = false;

  const storagePath = args.persistentStoragePath;
  if (storagePath) {
    try {
      const dbContentStr: string = fs.readFileSync(storagePath, { encoding: "utf-8" });
      const dbContent = JSON.parse(dbContentStr);
      myBackend.importDump(dbContent);
    } catch (e) {
      console.error("could not read wallet file");
    }

    myBackend.afterCommitCallback = async () => {
      console.log("DATABASE COMMITTED");
      // Allow caller to stop persisting the wallet.
      if (args.persistentStoragePath === undefined) {
        return;
      }
      const dbContent = myBackend.exportDump();
      fs.writeFileSync(storagePath, JSON.stringify(dbContent, undefined, 2), { encoding: "utf-8" });
    };
  }

  BridgeIDBFactory.enableTracing = false;

  const myBridgeIdbFactory = new BridgeIDBFactory(myBackend);
  const myIdbFactory: IDBFactory = (myBridgeIdbFactory as any) as IDBFactory;

  let myHttpLib;
  if (args.httpLib) {
    myHttpLib = args.httpLib;
  } else {
    myHttpLib = new NodeHttpLib();
  }

  const myVersionChange = () => {
    console.error("version change requested, should not happen");
    throw Error();
  };

  const myUnsupportedUpgrade = () => {
    console.error("unsupported database migration");
    throw Error();
  };

  shimIndexedDB(myBridgeIdbFactory);

  const myDb = await openTalerDb(
    myIdbFactory,
    myVersionChange,
    myUnsupportedUpgrade,
  );

  return new Wallet(
    myDb,
    myHttpLib,
    myBadge,
    myNotifier,
    new SynchronousCryptoWorkerFactory(),
  );
  //const myWallet = new Wallet(myDb, myHttpLib, myBadge, myNotifier, new NodeCryptoWorkerFactory());
}

export async function withdrawTestBalance(
  myWallet: Wallet,
  amount: string = "TESTKUDOS:10",
  bankBaseUrl: string = "https://bank.test.taler.net/",
  exchangeBaseUrl: string = "https://exchange.test.taler.net/",
) {
  const reserveResponse = await myWallet.createReserve({
    amount: amounts.parseOrThrow(amount),
    exchange: exchangeBaseUrl,
    exchangeWire: "payto://unknown",
  });

  const reservePub = reserveResponse.reservePub;

  const bank = new Bank(bankBaseUrl);

  const bankUser = await bank.registerRandomUser();

  console.log("bank user", bankUser);

  const exchangePaytoUri = await myWallet.getExchangePaytoUri(
    exchangeBaseUrl,
    ["x-taler-bank"],
  );

  await bank.createReserve(
    bankUser,
    amount,
    reservePub,
    exchangePaytoUri,
  );

  await myWallet.confirmReserve({ reservePub: reserveResponse.reservePub });

  await myWallet.runUntilReserveDepleted(reservePub);
}
