/*
 This file is part of TALER
 (C) 2015 GNUnet e.V.

 TALER is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 TALER is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 TALER; see the file COPYING.  If not, If not, see <http://www.gnu.org/licenses/>
 */

"use strict";

/**
 * Declarations and helpers for
 * things that are stored in the wallet's
 * database.
 */


namespace Db {
  export interface Mint {
    baseUrl: string;
    keys: Keys
  }

  export interface CoinWithDenom {
    coin: Coin;
    denom: Denomination;
  }

  export interface Keys {
    denoms: Denomination[];
  }

  export interface Denomination {
    value: AmountJson;
    denom_pub: string;
    fee_withdraw: AmountJson;
    fee_deposit: AmountJson;
  }

  export interface PreCoin {
    coinPub: string;
    coinPriv: string;
    reservePub: string;
    denomPub: string;
    blindingKey: string;
    withdrawSig: string;
    coinEv: string;
    mintBaseUrl: string;
    coinValue: AmountJson;
  }
  
  export interface Coin {
    coinPub: string;
    coinPriv: string;
    denomPub: string;
    denomSig: string;
    currentAmount: AmountJson;
    mintBaseUrl: string;
  }


}


const DB_NAME = "taler";
const DB_VERSION = 1;

/**
 * Return a promise that resolves
 * to the taler wallet db.
 */
function openTalerDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = (e) => {
      reject(e);
    };
    req.onsuccess = (e) => {
      resolve(req.result);
    };
    req.onupgradeneeded = (e) => {
      let db = req.result;
      console.log ("DB: upgrade needed: oldVersion = " + e.oldVersion);
      switch (e.oldVersion) {
        case 0: // DB does not exist yet
          let mints = db.createObjectStore("mints", { keyPath: "baseUrl" });
          mints.createIndex("pubKey", "keys.master_public_key");
          db.createObjectStore("reserves", { keyPath: "reserve_pub"});
          db.createObjectStore("denoms", { keyPath: "denomPub" });
          let coins = db.createObjectStore("coins", { keyPath: "coinPub" });
          coins.createIndex("mintBaseUrl", "mintBaseUrl");
          db.createObjectStore("transactions", { keyPath: "contractHash" });
          db.createObjectStore("precoins", { keyPath: "coinPub", autoIncrement: true });
          break;
      }
    };
  });
}
