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


import {
  Wallet,
  OfferRecord,
  Badge,
  ConfirmReserveRequest,
  CreateReserveRequest
} from "./wallet";
import { BrowserHttpLib } from "./http";
import { Checkable } from "./checkable";
import { AmountJson } from "./types";
import Port = chrome.runtime.Port;
import { Notifier } from "./types";
import { Contract } from "./types";
import MessageSender = chrome.runtime.MessageSender;
import { ChromeBadge } from "./chromeBadge";

"use strict";

const DB_NAME = "taler";
const DB_VERSION = 12;

import {Stores} from "./wallet";
import {Store, Index} from "./query";

/**
 * Messaging for the WebExtensions wallet.  Should contain
 * parts that are specific for WebExtensions, but as little business
 * logic as possible.
 *
 * @author Florian Dold
 */


type Handler = (detail: any, sender: MessageSender) => Promise<any>;

function makeHandlers(db: IDBDatabase,
  wallet: Wallet): { [msg: string]: Handler } {
  return {
    ["balances"]: function (detail, sender) {
      return wallet.getBalances();
    },
    ["dump-db"]: function (detail, sender) {
      return exportDb(db);
    },
    ["get-tab-cookie"]: function (detail, sender) {
      if (!sender || !sender.tab || !sender.tab.id) {
        return Promise.resolve();
      }
      let id: number = sender.tab.id;
      let info: any = <any>paymentRequestCookies[id];
      delete paymentRequestCookies[id];
      return Promise.resolve(info);
    },
    ["ping"]: function (detail, sender) {
      return Promise.resolve();
    },
    ["reset"]: function (detail, sender) {
      if (db) {
        let tx = db.transaction(Array.from(db.objectStoreNames), 'readwrite');
        for (let i = 0; i < db.objectStoreNames.length; i++) {
          tx.objectStore(db.objectStoreNames[i]).clear();
        }
      }
      deleteDb();

      chrome.browserAction.setBadgeText({ text: "" });
      console.log("reset done");
      // Response is synchronous
      return Promise.resolve({});
    },
    ["create-reserve"]: function (detail, sender) {
      const d = {
        exchange: detail.exchange,
        amount: detail.amount,
      };
      const req = CreateReserveRequest.checked(d);
      return wallet.createReserve(req);
    },
    ["confirm-reserve"]: function (detail, sender) {
      // TODO: make it a checkable
      const d = {
        reservePub: detail.reservePub
      };
      const req = ConfirmReserveRequest.checked(d);
      return wallet.confirmReserve(req);
    },
    ["confirm-pay"]: function (detail, sender) {
      let offer: OfferRecord;
      try {
        offer = OfferRecord.checked(detail.offer);
      } catch (e) {
        if (e instanceof Checkable.SchemaError) {
          console.error("schema error:", e.message);
          return Promise.resolve({
            error: "invalid contract",
            hint: e.message,
            detail: detail
          });
        } else {
          throw e;
        }
      }

      return wallet.confirmPay(offer);
    },
    ["check-pay"]: function (detail, sender) {
      let offer: OfferRecord;
      try {
        offer = OfferRecord.checked(detail.offer);
      } catch (e) {
        if (e instanceof Checkable.SchemaError) {
          console.error("schema error:", e.message);
          return Promise.resolve({
            error: "invalid contract",
            hint: e.message,
            detail: detail
          });
        } else {
          throw e;
        }
      }
      return wallet.checkPay(offer);
    },
    ["execute-payment"]: function (detail: any, sender: MessageSender) {
      if (sender.tab && sender.tab.id) {
        rateLimitCache[sender.tab.id]++;
        if (rateLimitCache[sender.tab.id] > 10) {
          console.warn("rate limit for execute payment exceeded");
          let msg = {
            error: "rate limit exceeded for execute-payment",
            rateLimitExceeded: true,
            hint: "Check for redirect loops",
          };
          return Promise.resolve(msg);
        }
      }
      return wallet.executePayment(detail.H_contract);
    },
    ["exchange-info"]: function (detail) {
      if (!detail.baseUrl) {
        return Promise.resolve({ error: "bad url" });
      }
      return wallet.updateExchangeFromUrl(detail.baseUrl);
    },
    ["hash-contract"]: function (detail) {
      if (!detail.contract) {
        return Promise.resolve({ error: "contract missing" });
      }
      return wallet.hashContract(detail.contract).then((hash) => {
        return { hash };
      });
    },
    ["put-history-entry"]: function (detail: any) {
      if (!detail.historyEntry) {
        return Promise.resolve({ error: "historyEntry missing" });
      }
      return wallet.putHistory(detail.historyEntry);
    },
    ["save-offer"]: function (detail: any) {
      let offer = detail.offer;
      if (!offer) {
        return Promise.resolve({ error: "offer missing" });
      }
      console.log("handling safe-offer");
      return wallet.saveOffer(offer);
    },
    ["reserve-creation-info"]: function (detail, sender) {
      if (!detail.baseUrl || typeof detail.baseUrl !== "string") {
        return Promise.resolve({ error: "bad url" });
      }
      let amount = AmountJson.checked(detail.amount);
      return wallet.getReserveCreationInfo(detail.baseUrl, amount);
    },
    ["check-repurchase"]: function (detail, sender) {
      let contract = Contract.checked(detail.contract);
      return wallet.checkRepurchase(contract);
    },
    ["get-history"]: function (detail, sender) {
      // TODO: limit history length
      return wallet.getHistory();
    },
    ["get-offer"]: function (detail, sender) {
      return wallet.getOffer(detail.offerId);
    },
    ["get-exchanges"]: function (detail, sender) {
      return wallet.getExchanges();
    },
    ["get-reserves"]: function (detail, sender) {
      if (typeof detail.exchangeBaseUrl !== "string") {
        return Promise.reject(Error("exchangeBaseUrl missing"));
      }
      return wallet.getReserves(detail.exchangeBaseUrl);
    },
    ["get-coins"]: function (detail, sender) {
      if (typeof detail.exchangeBaseUrl !== "string") {
        return Promise.reject(Error("exchangBaseUrl missing"));
      }
      return wallet.getCoins(detail.exchangeBaseUrl);
    },
    ["get-precoins"]: function (detail, sender) {
      if (typeof detail.exchangeBaseUrl !== "string") {
        return Promise.reject(Error("exchangBaseUrl missing"));
      }
      return wallet.getPreCoins(detail.exchangeBaseUrl);
    },
    ["get-denoms"]: function (detail, sender) {
      if (typeof detail.exchangeBaseUrl !== "string") {
        return Promise.reject(Error("exchangBaseUrl missing"));
      }
      return wallet.getDenoms(detail.exchangeBaseUrl);
    },
    ["refresh-coin"]: function (detail, sender) {
      if (typeof detail.coinPub !== "string") {
        return Promise.reject(Error("coinPub missing"));
      }
      return wallet.refresh(detail.coinPub);
    },
    ["payment-failed"]: function (detail, sender) {
      // For now we just update exchanges (maybe the exchange did something
      // wrong and the keys were messed up).
      // FIXME: in the future we should look at what actually went wrong.
      console.error("payment reported as failed");
      wallet.updateExchanges();
      return Promise.resolve();
    },
    ["payment-succeeded"]: function (detail, sender) {
      let contractHash = detail.contractHash;
      if (!contractHash) {
        return Promise.reject(Error("contractHash missing"));
      }
      return wallet.paymentSucceeded(contractHash);
    },
  };
}


function dispatch(handlers: any, req: any, sender: any, sendResponse: any) {
  if (req.type in handlers) {
    Promise
      .resolve()
      .then(() => {
        const p = handlers[req.type](req.detail, sender);

        return p.then((r: any) => {
          try {
            sendResponse(r);
          } catch (e) {
            // might fail if tab disconnected
          }
        })
      })
      .catch((e) => {
        console.log(`exception during wallet handler for '${req.type}'`);
        console.log("request", req);
        console.error(e);
        try {
          sendResponse({
            error: "exception",
            hint: e.message,
            stack: e.stack.toString()
          });

        } catch (e) {
          // might fail if tab disconnected
        }
      });
    // The sendResponse call is async
    return true;
  } else {
    console.error(`Request type ${JSON.stringify(req)} unknown, req ${req.type}`);
    try {
      sendResponse({ error: "request unknown" });
    } catch (e) {
      // might fail if tab disconnected
    }

    // The sendResponse call is sync
    return false;
  }
}

class ChromeNotifier implements Notifier {
  ports: Port[] = [];

  constructor() {
    chrome.runtime.onConnect.addListener((port) => {
      console.log("got connect!");
      this.ports.push(port);
      port.onDisconnect.addListener(() => {
        let i = this.ports.indexOf(port);
        if (i >= 0) {
          this.ports.splice(i, 1);
        } else {
          console.error("port already removed");
        }
      });
    });
  }

  notify() {
    for (let p of this.ports) {
      p.postMessage({ notify: true });
    }
  }
}


/**
 * Mapping from tab ID to payment information (if any).
 */
let paymentRequestCookies: { [n: number]: any } = {};

function handleHttpPayment(headerList: chrome.webRequest.HttpHeader[],
  url: string, tabId: number): any {
  const headers: { [s: string]: string } = {};
  for (let kv of headerList) {
    if (kv.value) {
      headers[kv.name.toLowerCase()] = kv.value;
    }
  }

  const contractUrl = headers["x-taler-contract-url"];
  if (contractUrl !== undefined) {
    paymentRequestCookies[tabId] = { type: "fetch", contractUrl };
    return;
  }

  const contractHash = headers["x-taler-contract-hash"];

  if (contractHash !== undefined) {
    const payUrl = headers["x-taler-pay-url"];
    if (payUrl === undefined) {
      console.log("malformed 402, X-Taler-Pay-Url missing");
      return;
    }

    // Offer URL is optional
    const offerUrl = headers["x-taler-offer-url"];
    paymentRequestCookies[tabId] = {
      type: "execute",
      offerUrl,
      payUrl,
      contractHash
    };
    return;
  }

  // looks like it's not a taler request, it might be
  // for a different payment system (or the shop is buggy)
  console.log("ignoring non-taler 402 response");
}


function handleBankRequest(wallet: Wallet, headerList: chrome.webRequest.HttpHeader[],
  url: string, tabId: number): any {
  const headers: { [s: string]: string } = {};
  for (let kv of headerList) {
    if (kv.value) {
      headers[kv.name.toLowerCase()] = kv.value;
    }
  }

  const reservePub = headers["x-taler-reserve-pub"];
  if (reservePub !== undefined) {
    console.log(`confirming reserve ${reservePub} via 201`);
    wallet.confirmReserve({reservePub});
    return;
  }

  const amount = headers["x-taler-amount"];
  if (amount) {
    let callbackUrl = headers["x-taler-callback-url"];
    if (!callbackUrl) {
      console.log("201 not understood (X-Taler-Callback-Url missing)");
      return;
    }
    let wtTypes = headers["x-taler-wt-types"];
    if (!wtTypes) {
      console.log("201 not understood (X-Taler-Wt-Types missing)");
      return;
    }
    let params = {
      amount: amount,
      callback_url: URI(callbackUrl)
        .absoluteTo(url),
      bank_url: url,
      wt_types: wtTypes,
    };
    let uri = URI(chrome.extension.getURL("/src/pages/confirm-create-reserve.html"));
    let redirectUrl = uri.query(params).href();
    return {redirectUrl};
  }
  console.log("201 not understood");
}

// Useful for debugging ...
export let wallet: Wallet | undefined = undefined;
export let badge: ChromeBadge | undefined = undefined;

// Rate limit cache for executePayment operations, to break redirect loops
let rateLimitCache: { [n: number]: number } = {};

function clearRateLimitCache() {
  rateLimitCache = {};
}

export function wxMain() {
  chrome.browserAction.setBadgeText({ text: "" });
  badge = new ChromeBadge();

  chrome.tabs.query({}, function (tabs) {
    for (let tab of tabs) {
      if (!tab.url || !tab.id) {
        return;
      }
      let uri = URI(tab.url);
      if (uri.protocol() == "http" || uri.protocol() == "https") {
        console.log("injecting into existing tab", tab.id);
        chrome.tabs.executeScript(tab.id, { file: "/src/vendor/URI.js" });
        chrome.tabs.executeScript(tab.id, { file: "/src/taler-wallet-lib.js" });
        chrome.tabs.executeScript(tab.id, { file: "/src/content_scripts/notify.js" });
      }
    }
  });

  chrome.extension.getBackgroundPage().setInterval(clearRateLimitCache, 5000);

  Promise.resolve()
    .then(() => {
      return openTalerDb();
    })
    .catch((e) => {
      console.error("could not open database");
      console.error(e);
    })
    .then((db: IDBDatabase) => {
      let http = new BrowserHttpLib();
      let notifier = new ChromeNotifier();
      console.log("setting wallet");
      wallet = new Wallet(db, http, badge!, notifier);

      // Handlers for messages coming directly from the content
      // script on the page
      let handlers = makeHandlers(db, wallet!);
      chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
        try {
          return dispatch(handlers, req, sender, sendResponse)
        } catch (e) {
          console.log(`exception during wallet handler (dispatch)`);
          console.log("request", req);
          console.error(e);
          sendResponse({
            error: "exception",
            hint: e.message,
            stack: e.stack.toString()
          });
          return false;
        }
      });

      // Handlers for catching HTTP requests
      chrome.webRequest.onHeadersReceived.addListener((details) => {
        if (details.statusCode == 402) {
          console.log(`got 402 from ${details.url}`);
          return handleHttpPayment(details.responseHeaders || [],
            details.url,
            details.tabId);
        } else if (details.statusCode == 202) {
          return handleBankRequest(wallet!, details.responseHeaders || [],
            details.url,
            details.tabId);
        }
      }, { urls: ["<all_urls>"] }, ["responseHeaders", "blocking"]);
    })
    .catch((e) => {
      console.error("could not initialize wallet messaging");
      console.error(e);
    });
}



/**
 * Return a promise that resolves
 * to the taler wallet db.
 */
function openTalerDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = (e) => {
      reject(e);
    };
    req.onsuccess = (e) => {
      resolve(req.result);
    };
    req.onupgradeneeded = (e) => {
      const db = req.result;
      console.log("DB: upgrade needed: oldVersion = " + e.oldVersion);
      switch (e.oldVersion) {
        case 0: // DB does not exist yet

          for (let n in Stores) {
            if ((Stores as any)[n] instanceof Store) {
              let si: Store<any> = (Stores as any)[n];
              const s = db.createObjectStore(si.name, si.storeParams);
              for (let indexName in (si as any)) {
                if ((si as any)[indexName] instanceof Index) {
                  let ii: Index<any,any> = (si as any)[indexName];
                  s.createIndex(ii.indexName, ii.keyPath);
                }
              }
            }
          }
          break;
        default:
          if (e.oldVersion != DB_VERSION) {
            window.alert("Incompatible wallet dababase version, please reset" +
                         " db.");
            chrome.browserAction.setBadgeText({text: "err"});
            chrome.browserAction.setBadgeBackgroundColor({color: "#F00"});
            throw Error("incompatible DB");
          }
          break;
      }
    };
  });
}


function exportDb(db: IDBDatabase): Promise<any> {
  let dump = {
    name: db.name,
    version: db.version,
    stores: {} as {[s: string]: any},
  };

  return new Promise((resolve, reject) => {

    let tx = db.transaction(Array.from(db.objectStoreNames));
    tx.addEventListener("complete", () => {
      resolve(dump);
    });
    for (let i = 0; i < db.objectStoreNames.length; i++) {
      let name = db.objectStoreNames[i];
      let storeDump = {} as {[s: string]: any};
      dump.stores[name] = storeDump;
      let store = tx.objectStore(name)
                    .openCursor()
                    .addEventListener("success", (e: Event) => {
                      let cursor = (e.target as any).result;
                      if (cursor) {
                        storeDump[cursor.key] = cursor.value;
                        cursor.continue();
                      }
                    });
    }
  });
}

function deleteDb() {
  indexedDB.deleteDatabase(DB_NAME);
}