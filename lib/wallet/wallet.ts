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
 TALER; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */

/**
 * High-level wallet operations that should be indepentent from the underlying
 * browser extension interface.
 * @module Wallet
 * @author Florian Dold
 */

import {
  AmountJson,
  CreateReserveResponse,
  IExchangeInfo,
  Denomination,
  Notifier,
  WireInfo, RefreshSession, ReserveRecord, CoinPaySig
} from "./types";
import {HttpResponse, RequestException} from "./http";
import {QueryRoot} from "./query";
import {Checkable} from "./checkable";
import {canonicalizeBaseUrl} from "./helpers";
import {ReserveCreationInfo, Amounts} from "./types";
import {PreCoin} from "./types";
import {CryptoApi} from "./cryptoApi";
import {Coin} from "./types";
import {PayCoinInfo} from "./types";
import {CheckRepurchaseResult} from "./types";
import {Contract} from "./types";
import {ExchangeHandle} from "./types";

"use strict";

export interface CoinWithDenom {
  coin: Coin;
  denom: Denomination;
}


@Checkable.Class
export class KeysJson {
  @Checkable.List(Checkable.Value(Denomination))
  denoms: Denomination[];

  @Checkable.String
  master_public_key: string;

  @Checkable.Any
  auditors: any[];

  @Checkable.String
  list_issue_date: string;

  @Checkable.Any
  signkeys: any;

  @Checkable.String
  eddsa_pub: string;

  @Checkable.String
  eddsa_sig: string;

  static checked: (obj: any) => KeysJson;
}


@Checkable.Class
export class CreateReserveRequest {
  /**
   * The initial amount for the reserve.
   */
  @Checkable.Value(AmountJson)
  amount: AmountJson;

  /**
   * Exchange URL where the bank should create the reserve.
   */
  @Checkable.String
  exchange: string;

  static checked: (obj: any) => CreateReserveRequest;
}


@Checkable.Class
export class ConfirmReserveRequest {
  /**
   * Public key of then reserve that should be marked
   * as confirmed.
   */
  @Checkable.String
  reservePub: string;

  static checked: (obj: any) => ConfirmReserveRequest;
}


@Checkable.Class
export class Offer {
  @Checkable.Value(Contract)
  contract: Contract;

  @Checkable.String
  merchant_sig: string;

  @Checkable.String
  H_contract: string;

  static checked: (obj: any) => Offer;
}

export interface HistoryRecord {
  type: string;
  timestamp: number;
  subjectId?: string;
  detail: any;
  level: HistoryLevel;
}


interface ExchangeCoins {
  [exchangeUrl: string]: CoinWithDenom[];
}

interface PayReq {
  amount: AmountJson;
  coins: CoinPaySig[];
  H_contract: string;
  max_fee: AmountJson;
  merchant_sig: string;
  exchange: string;
  refund_deadline: string;
  timestamp: string;
  transaction_id: number;
}

interface Transaction {
  contractHash: string;
  contract: Contract;
  payReq: PayReq;
  merchantSig: string;
}

export enum HistoryLevel {
  Trace = 1,
  Developer = 2,
  Expert = 3,
  User = 4,
}


export interface Badge {
  setText(s: string): void;
  setColor(c: string): void;
  startBusy(): void;
  stopBusy(): void;
}

export function canonicalJson(obj: any): string {
  // Check for cycles, etc.
  JSON.stringify(obj);
  if (typeof obj == "string" || typeof obj == "number" || obj === null) {
    return JSON.stringify(obj)
  }
  if (Array.isArray(obj)) {
    let objs: string[] = obj.map((e) => canonicalJson(e));
    return `[${objs.join(',')}]`;
  }
  let keys: string[] = [];
  for (let key in obj) {
    keys.push(key);
  }
  keys.sort();
  let s = "{";
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    s += JSON.stringify(key) + ":" + canonicalJson(obj[key]);
    if (i != keys.length - 1) {
      s += ",";
    }
  }
  return s + "}";
}


function deepEquals(x: any, y: any): boolean {
  if (x === y) {
    return true;
  }

  if (Array.isArray(x) && x.length !== y.length) {
    return false;
  }

  var p = Object.keys(x);
  return Object.keys(y).every((i) => p.indexOf(i) !== -1) &&
    p.every((i) => deepEquals(x[i], y[i]));
}


function flatMap<T, U>(xs: T[], f: (x: T) => U[]): U[] {
  return xs.reduce((acc: U[], next: T) => [...f(next), ...acc], []);
}


function getTalerStampSec(stamp: string): number | null {
  const m = stamp.match(/\/?Date\(([0-9]*)\)\/?/);
  if (!m) {
    return null;
  }
  return parseInt(m[1]);
}


function setTimeout(f: any, t: number) {
  return chrome.extension.getBackgroundPage().setTimeout(f, t);
}


function isWithdrawableDenom(d: Denomination) {
  const now_sec = (new Date).getTime() / 1000;
  const stamp_withdraw_sec = getTalerStampSec(d.stamp_expire_withdraw);
  // Withdraw if still possible to withdraw within a minute
  if (stamp_withdraw_sec + 60 > now_sec) {
    return true;
  }
  return false;
}


interface HttpRequestLibrary {
  req(method: string,
      url: string | uri.URI,
      options?: any): Promise<HttpResponse>;

  get(url: string | uri.URI): Promise<HttpResponse>;

  postJson(url: string | uri.URI, body: any): Promise<HttpResponse>;

  postForm(url: string | uri.URI, form: any): Promise<HttpResponse>;
}


function copy(o: any) {
  return JSON.parse(JSON.stringify(o));
}

/**
 * Result of updating exisiting information
 * about an exchange with a new '/keys' response.
 */
interface KeyUpdateInfo {
  updatedExchangeInfo: IExchangeInfo;
  addedDenominations: Denomination[];
  removedDenominations: Denomination[];
}


/**
 * Get a list of denominations (with repetitions possible)
 * whose total value is as close as possible to the available
 * amount, but never larger.
 */
function getWithdrawDenomList(amountAvailable: AmountJson,
                              denoms: Denomination[]): Denomination[] {
  let remaining = Amounts.copy(amountAvailable);
  const ds: Denomination[] = [];

  denoms = denoms.filter(isWithdrawableDenom);
  denoms.sort((d1, d2) => Amounts.cmp(d2.value, d1.value));

  // This is an arbitrary number of coins
  // we can withdraw in one go.  It's not clear if this limit
  // is useful ...
  for (let i = 0; i < 1000; i++) {
    let found = false;
    for (let d of denoms) {
      let cost = Amounts.add(d.value, d.fee_withdraw).amount;
      if (Amounts.cmp(remaining, cost) < 0) {
        continue;
      }
      found = true;
      remaining = Amounts.sub(remaining, cost).amount;
      ds.push(d);
      break;
    }
    if (!found) {
      break;
    }
  }
  return ds;
}


export class Wallet {
  private db: IDBDatabase;
  private http: HttpRequestLibrary;
  private badge: Badge;
  private notifier: Notifier;
  public cryptoApi: CryptoApi;

  /**
   * Set of identifiers for running operations.
   */
  private runningOperations: Set<string> = new Set();

  q(): QueryRoot {
    return new QueryRoot(this.db);
  }

  constructor(db: IDBDatabase,
              http: HttpRequestLibrary,
              badge: Badge,
              notifier: Notifier) {
    this.db = db;
    this.http = http;
    this.badge = badge;
    this.notifier = notifier;
    this.cryptoApi = new CryptoApi();

    this.resumePendingFromDb();
  }


  private startOperation(operationId: string) {
    this.runningOperations.add(operationId);
    this.badge.startBusy();
  }

  private stopOperation(operationId: string) {
    this.runningOperations.delete(operationId);
    if (this.runningOperations.size == 0) {
      this.badge.stopBusy();
    }
  }

  updateExchanges(): void {
    console.log("updating exchanges");

    this.q()
        .iter("exchanges")
        .reduce((exchange: IExchangeInfo) => {
          this.updateExchangeFromUrl(exchange.baseUrl)
              .catch((e) => {
                console.error("updating exchange failed", e);
              });
        });
  }

  /**
   * Resume various pending operations that are pending
   * by looking at the database.
   */
  private resumePendingFromDb(): void {
    console.log("resuming pending operations from db");

    this.q()
        .iter("reserves")
        .reduce((reserve: any) => {
          console.log("resuming reserve", reserve.reserve_pub);
          this.processReserve(reserve);
        });

    this.q()
        .iter("precoins")
        .reduce((preCoin: any) => {
          console.log("resuming precoin");
          this.processPreCoin(preCoin);
        });

    this.q()
        .iter("refresh")
        .reduce((r: RefreshSession) => {
          this.continueRefreshSession(r);
        });

    // FIXME: optimize via index
    this.q()
        .iter("coins")
        .reduce((c: Coin) => {
          if (c.dirty && !c.transactionPending) {
            this.refresh(c.coinPub);
          }
        });
  }


  /**
   * Get exchanges and associated coins that are still spendable,
   * but only if the sum the coins' remaining value exceeds the payment amount.
   */
  private async getPossibleExchangeCoins(paymentAmount: AmountJson,
                                         depositFeeLimit: AmountJson,
                                         allowedExchanges: ExchangeHandle[]): Promise<ExchangeCoins> {
    // Mapping from exchange base URL to list of coins together with their
    // denomination
    let m: ExchangeCoins = {};

    let x: number;

    function storeExchangeCoin(mc: any, url: string) {
      let exchange: IExchangeInfo = mc[0];
      console.log("got coin for exchange", url);
      let coin: Coin = mc[1];
      if (coin.suspended) {
        console.log("skipping suspended coin",
                    coin.denomPub,
                    "from exchange",
                    exchange.baseUrl);
        return;
      }
      let denom = exchange.active_denoms.find((e) => e.denom_pub === coin.denomPub);
      if (!denom) {
        console.warn("denom not found (database inconsistent)");
        return;
      }
      if (denom.value.currency !== paymentAmount.currency) {
        console.warn("same pubkey for different currencies");
        return;
      }
      let cd = {coin, denom};
      let x = m[url];
      if (!x) {
        m[url] = [cd];
      } else {
        x.push(cd);
      }
    }

    // Make sure that we don't look up coins
    // for the same URL twice ...
    let handledExchanges = new Set();

    let ps = flatMap(allowedExchanges, (info: ExchangeHandle) => {
      if (handledExchanges.has(info.url)) {
        return [];
      }
      handledExchanges.add(info.url);
      console.log("Checking for merchant's exchange", JSON.stringify(info));
      return [
        this.q()
            .iter("exchanges", {indexName: "pubKey", only: info.master_pub})
            .indexJoin("coins",
                       "exchangeBaseUrl",
                       (exchange) => exchange.baseUrl)
            .reduce((x) => storeExchangeCoin(x, info.url))
      ];
    });

    await Promise.all(ps);

    let ret: ExchangeCoins = {};

    if (Object.keys(m).length == 0) {
      console.log("not suitable exchanges found");
    }

    console.dir(m);

    // We try to find the first exchange where we have
    // enough coins to cover the paymentAmount with fees
    // under depositFeeLimit

    nextExchange:
      for (let key in m) {
        let coins = m[key];
        // Sort by ascending deposit fee
        coins.sort((o1, o2) => Amounts.cmp(o1.denom.fee_deposit,
                                           o2.denom.fee_deposit));
        let maxFee = Amounts.copy(depositFeeLimit);
        let minAmount = Amounts.copy(paymentAmount);
        let accFee = Amounts.copy(coins[0].denom.fee_deposit);
        let accAmount = Amounts.getZero(coins[0].coin.currentAmount.currency);
        let usableCoins: CoinWithDenom[] = [];
        nextCoin:
          for (let i = 0; i < coins.length; i++) {
            let coinAmount = Amounts.copy(coins[i].coin.currentAmount);
            let coinFee = coins[i].denom.fee_deposit;
            if (Amounts.cmp(coinAmount, coinFee) <= 0) {
              continue nextCoin;
            }
            accFee = Amounts.add(accFee, coinFee).amount;
            accAmount = Amounts.add(accAmount, coinAmount).amount;
            if (Amounts.cmp(accFee, maxFee) >= 0) {
              // FIXME: if the fees are too high, we have
              // to cover them ourselves ....
              console.log("too much fees");
              continue nextExchange;
            }
            usableCoins.push(coins[i]);
            if (Amounts.cmp(accAmount, minAmount) >= 0) {
              ret[key] = usableCoins;
              continue nextExchange;
            }
          }
      }
    return ret;
  }


  /**
   * Record all information that is necessary to
   * pay for a contract in the wallet's database.
   */
  private async recordConfirmPay(offer: Offer,
                                 payCoinInfo: PayCoinInfo,
                                 chosenExchange: string): Promise<void> {
    let payReq: PayReq = {
      amount: offer.contract.amount,
      coins: payCoinInfo.map((x) => x.sig),
      H_contract: offer.H_contract,
      max_fee: offer.contract.max_fee,
      merchant_sig: offer.merchant_sig,
      exchange: URI(chosenExchange).href(),
      refund_deadline: offer.contract.refund_deadline,
      timestamp: offer.contract.timestamp,
      transaction_id: offer.contract.transaction_id,
    };
    let t: Transaction = {
      contractHash: offer.H_contract,
      contract: offer.contract,
      payReq: payReq,
      merchantSig: offer.merchant_sig,
    };

    let historyEntry = {
      type: "pay",
      timestamp: (new Date).getTime(),
      subjectId: `contract-${offer.H_contract}`,
      detail: {
        merchantName: offer.contract.merchant.name,
        amount: offer.contract.amount,
        contractHash: offer.H_contract,
        fulfillmentUrl: offer.contract.fulfillment_url,
      }
    };

    await this.q()
              .put("transactions", t)
              .put("history", historyEntry)
              .putAll("coins", payCoinInfo.map((pci) => pci.updatedCoin))
              .finish();

    this.notifier.notify();
  }


  async putHistory(historyEntry: HistoryRecord): Promise<void> {
    await this.q().put("history", historyEntry).finish();
    this.notifier.notify();
  }


  /**
   * Add a contract to the wallet and sign coins,
   * but do not send them yet.
   */
  async confirmPay(offer: Offer): Promise<any> {
    console.log("executing confirmPay");

    let transaction = await this.q().get("transactions", offer.H_contract);

    if (transaction) {
      // Already payed ...
      return {};
    }

    let mcs = await this.getPossibleExchangeCoins(offer.contract.amount,
                                                  offer.contract.max_fee,
                                                  offer.contract.exchanges);

    if (Object.keys(mcs).length == 0) {
      console.log("not confirming payment, insufficient coins");
      return {
        error: "coins-insufficient",
      };
    }
    let exchangeUrl = Object.keys(mcs)[0];

    let ds = await this.cryptoApi.signDeposit(offer, mcs[exchangeUrl]);
    await this.recordConfirmPay(offer,
                                ds,
                                exchangeUrl);
    return {};
  }


  /**
   * Add a contract to the wallet and sign coins,
   * but do not send them yet.
   */
  async checkPay(offer: Offer): Promise<any> {
    // First check if we already payed for it.
    let transaction = await this.q().get("transactions", offer.H_contract);
    if (transaction) {
      return {isPayed: true};
    }

    // If not already payed, check if we could pay for it.
    let mcs = await this.getPossibleExchangeCoins(offer.contract.amount,
                                                  offer.contract.max_fee,
                                                  offer.contract.exchanges);

    if (Object.keys(mcs).length == 0) {
      console.log("not confirming payment, insufficient coins");
      return {
        error: "coins-insufficient",
      };
    }
    return {isPayed: false};
  }


  /**
   * Retrieve all necessary information for looking up the contract
   * with the given hash.
   */
  async executePayment(H_contract: string): Promise<any> {
    let t = await this.q().get<Transaction>("transactions", H_contract);
    if (!t) {
      return {
        success: false,
        contractFound: false,
      }
    }
    let resp = {
      success: true,
      payReq: t.payReq,
      contract: t.contract,
    };
    return resp;
  }


  /**
   * First fetch information requred to withdraw from the reserve,
   * then deplete the reserve, withdrawing coins until it is empty.
   */
  private async processReserve(reserveRecord: ReserveRecord,
                               retryDelayMs: number = 250): Promise<void> {
    const opId = "reserve-" + reserveRecord.reserve_pub;
    this.startOperation(opId);

    try {
      let exchange = await this.updateExchangeFromUrl(reserveRecord.exchange_base_url);
      let reserve = await this.updateReserve(reserveRecord.reserve_pub,
                                             exchange);
      let n = await this.depleteReserve(reserve, exchange);

      if (n != 0) {
        let depleted = {
          type: "depleted-reserve",
          subjectId: `reserve-progress-${reserveRecord.reserve_pub}`,
          timestamp: (new Date).getTime(),
          detail: {
            exchangeBaseUrl: reserveRecord.exchange_base_url,
            reservePub: reserveRecord.reserve_pub,
            requestedAmount: reserveRecord.requested_amount,
            currentAmount: reserveRecord.current_amount,
          }
        };
        await this.q().put("history", depleted).finish();
      }
    } catch (e) {
      // random, exponential backoff truncated at 3 minutes
      let nextDelay = Math.min(2 * retryDelayMs + retryDelayMs * Math.random(),
                               3000 * 60);
      console.warn(`Failed to deplete reserve, trying again in ${retryDelayMs} ms`);
      setTimeout(() => this.processReserve(reserveRecord, nextDelay),
                 retryDelayMs);
    } finally {
      this.stopOperation(opId);
    }
  }


  private async processPreCoin(preCoin: PreCoin,
                               retryDelayMs = 100): Promise<void> {
    try {
      const coin = await this.withdrawExecute(preCoin);
      this.storeCoin(coin);
    } catch (e) {
      console.error("Failed to withdraw coin from precoin, retrying in",
                    retryDelayMs,
                    "ms", e);
      // exponential backoff truncated at one minute
      let nextRetryDelayMs = Math.min(retryDelayMs * 2, 1000 * 60);
      setTimeout(() => this.processPreCoin(preCoin, nextRetryDelayMs),
                 retryDelayMs);
    }
  }


  /**
   * Create a reserve, but do not flag it as confirmed yet.
   */
  async createReserve(req: CreateReserveRequest): Promise<CreateReserveResponse> {
    let keypair = await this.cryptoApi.createEddsaKeypair();
    const now = (new Date).getTime();
    const canonExchange = canonicalizeBaseUrl(req.exchange);

    const reserveRecord: ReserveRecord = {
      reserve_pub: keypair.pub,
      reserve_priv: keypair.priv,
      exchange_base_url: canonExchange,
      created: now,
      last_query: null,
      current_amount: null,
      requested_amount: req.amount,
      confirmed: false,
      withdrawn_amount: Amounts.getZero(req.amount.currency)
    };

    const historyEntry = {
      type: "create-reserve",
      level: HistoryLevel.Expert,
      timestamp: now,
      subjectId: `reserve-progress-${reserveRecord.reserve_pub}`,
      detail: {
        requestedAmount: req.amount,
        reservePub: reserveRecord.reserve_pub,
      }
    };

    await this.q()
              .put("reserves", reserveRecord)
              .put("history", historyEntry)
              .finish();

    let r: CreateReserveResponse = {
      exchange: canonExchange,
      reservePub: keypair.pub,
    };
    return r;
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
    const now = (new Date).getTime();
    let reserve: ReserveRecord|undefined = await (
      this.q().get<ReserveRecord>("reserves",
                                  req.reservePub));
    if (!reserve) {
      console.error("Unable to confirm reserve, not found in DB");
      return;
    }
    console.log("reserve confirmed");
    const historyEntry = {
      type: "confirm-reserve",
      timestamp: now,
      subjectId: `reserve-progress-${reserve.reserve_pub}`,
      detail: {
        exchangeBaseUrl: reserve.exchange_base_url,
        reservePub: req.reservePub,
        requestedAmount: reserve.requested_amount,
      }
    };
    reserve.confirmed = true;
    await this.q()
              .put("reserves", reserve)
              .put("history", historyEntry)
              .finish();

    this.processReserve(reserve);
  }


  private async withdrawExecute(pc: PreCoin): Promise<Coin> {
    let reserve = await this.q().get<ReserveRecord>("reserves", pc.reservePub);

    if (!reserve) {
      throw Error("db inconsistent");
    }

    let wd: any = {};
    wd.denom_pub = pc.denomPub;
    wd.reserve_pub = pc.reservePub;
    wd.reserve_sig = pc.withdrawSig;
    wd.coin_ev = pc.coinEv;
    let reqUrl = URI("reserve/withdraw").absoluteTo(reserve.exchange_base_url);
    let resp = await this.http.postJson(reqUrl, wd);


    if (resp.status != 200) {
      throw new RequestException({
        hint: "Withdrawal failed",
        status: resp.status
      });
    }
    let r = JSON.parse(resp.responseText);
    let denomSig = await this.cryptoApi.rsaUnblind(r.ev_sig,
                                                   pc.blindingKey,
                                                   pc.denomPub);
    let coin: Coin = {
      coinPub: pc.coinPub,
      coinPriv: pc.coinPriv,
      denomPub: pc.denomPub,
      denomSig: denomSig,
      currentAmount: pc.coinValue,
      exchangeBaseUrl: pc.exchangeBaseUrl,
      dirty: false,
      transactionPending: false,
    };
    return coin;
  }

  async storeCoin(coin: Coin): Promise<void> {
    let historyEntry: HistoryRecord = {
      type: "withdraw",
      timestamp: (new Date).getTime(),
      level: HistoryLevel.Expert,
      detail: {
        coinPub: coin.coinPub,
      }
    };
    await this.q()
              .delete("precoins", coin.coinPub)
              .add("coins", coin)
              .add("history", historyEntry)
              .finish();
    this.notifier.notify();
  }


  /**
   * Withdraw one coin of the given denomination from the given reserve.
   */
  private async withdraw(denom: Denomination,
                         reserve: ReserveRecord): Promise<void> {
    console.log("creating pre coin at", new Date());
    let preCoin = await this.cryptoApi
                            .createPreCoin(denom, reserve);
    await this.q()
              .put("precoins", preCoin)
              .finish();
    await this.processPreCoin(preCoin);
  }


  /**
   * Withdraw coins from a reserve until it is empty.
   */
  private async depleteReserve(reserve: any,
                               exchange: IExchangeInfo): Promise<number> {
    let denomsAvailable: Denomination[] = copy(exchange.active_denoms);
    let denomsForWithdraw = getWithdrawDenomList(reserve.current_amount,
                                                 denomsAvailable);

    let ps = denomsForWithdraw.map((denom) => this.withdraw(denom, reserve));
    await Promise.all(ps);
    return ps.length;
  }


  /**
   * Update the information about a reserve that is stored in the wallet
   * by quering the reserve's exchange.
   */
  private async updateReserve(reservePub: string,
                              exchange: IExchangeInfo): Promise<ReserveRecord> {
    let reserve = await this.q()
                            .get<ReserveRecord>("reserves", reservePub);
    if (!reserve) {
      throw Error("reserve not in db");
    }
    let reqUrl = URI("reserve/status").absoluteTo(exchange.baseUrl);
    reqUrl.query({'reserve_pub': reservePub});
    let resp = await this.http.get(reqUrl);
    if (resp.status != 200) {
      throw Error();
    }
    let reserveInfo = JSON.parse(resp.responseText);
    if (!reserveInfo) {
      throw Error();
    }
    let oldAmount = reserve.current_amount;
    let newAmount = reserveInfo.balance;
    reserve.current_amount = reserveInfo.balance;
    let historyEntry = {
      type: "reserve-update",
      timestamp: (new Date).getTime(),
      subjectId: `reserve-progress-${reserve.reserve_pub}`,
      detail: {
        reservePub,
        requestedAmount: reserve.requested_amount,
        oldAmount,
        newAmount
      }
    };
    await this.q()
              .put("reserves", reserve)
              .finish();
    return reserve;
  }


  /**
   * Get the wire information for the exchange with the given base URL.
   */
  async getWireInfo(exchangeBaseUrl: string): Promise<WireInfo> {
    exchangeBaseUrl = canonicalizeBaseUrl(exchangeBaseUrl);
    let reqUrl = URI("wire").absoluteTo(exchangeBaseUrl);
    let resp = await this.http.get(reqUrl);

    if (resp.status != 200) {
      throw Error("/wire request failed");
    }

    let wiJson = JSON.parse(resp.responseText);
    if (!wiJson) {
      throw Error("/wire response malformed")
    }
    return wiJson;
  }

  async getReserveCreationInfo(baseUrl: string,
                               amount: AmountJson): Promise<ReserveCreationInfo> {
    let exchangeInfo = await this.updateExchangeFromUrl(baseUrl);

    let selectedDenoms = getWithdrawDenomList(amount,
                                              exchangeInfo.active_denoms);
    let acc = Amounts.getZero(amount.currency);
    for (let d of selectedDenoms) {
      acc = Amounts.add(acc, d.fee_withdraw).amount;
    }
    let actualCoinCost = selectedDenoms
      .map((d: Denomination) => Amounts.add(d.value,
                                            d.fee_withdraw).amount)
      .reduce((a, b) => Amounts.add(a, b).amount);

    let wireInfo = await this.getWireInfo(baseUrl);

    let ret: ReserveCreationInfo = {
      exchangeInfo,
      selectedDenoms,
      wireInfo,
      withdrawFee: acc,
      overhead: Amounts.sub(amount, actualCoinCost).amount,
    };
    return ret;
  }


  /**
   * Update or add exchange DB entry by fetching the /keys information.
   * Optionally link the reserve entry to the new or existing
   * exchange entry in then DB.
   */
  async updateExchangeFromUrl(baseUrl: string): Promise<IExchangeInfo> {
    baseUrl = canonicalizeBaseUrl(baseUrl);
    let reqUrl = URI("keys").absoluteTo(baseUrl);
    let resp = await this.http.get(reqUrl);
    if (resp.status != 200) {
      throw Error("/keys request failed");
    }
    let exchangeKeysJson = KeysJson.checked(JSON.parse(resp.responseText));
    return this.updateExchangeFromJson(baseUrl, exchangeKeysJson);
  }

  private async suspendCoins(exchangeInfo: IExchangeInfo): Promise<void> {
    let suspendedCoins = await (
      this.q()
          .iter("coins",
                {indexName: "exchangeBaseUrl", only: exchangeInfo.baseUrl})
          .reduce((coin: Coin, suspendedCoins: Coin[]) => {
            if (!exchangeInfo.active_denoms.find((c) => c.denom_pub == coin.denomPub)) {
              return Array.prototype.concat(suspendedCoins, [coin]);
            }
            return Array.prototype.concat(suspendedCoins);
          }, []));

    let q = this.q();
    suspendedCoins.map((c) => {
      console.log("suspending coin", c);
      c.suspended = true;
      q.put("coins", c);
    });
    await q.finish();
  }


  private async updateExchangeFromJson(baseUrl: string,
                                       exchangeKeysJson: KeysJson): Promise<IExchangeInfo> {
    const updateTimeSec = getTalerStampSec(exchangeKeysJson.list_issue_date);
    if (updateTimeSec === null) {
      throw Error("invalid update time");
    }

    let r = await this.q().get<IExchangeInfo>("exchanges", baseUrl);

    let exchangeInfo: IExchangeInfo;

    if (!r) {
      exchangeInfo = {
        baseUrl,
        all_denoms: [],
        active_denoms: [],
        last_update_time: updateTimeSec,
        masterPublicKey: exchangeKeysJson.master_public_key,
      };
      console.log("making fresh exchange");
    } else {
      if (updateTimeSec < r.last_update_time) {
        console.log("outdated /keys, not updating");
        return r
      }
      exchangeInfo = r;
      console.log("updating old exchange");
    }

    let updatedExchangeInfo = await this.updateExchangeInfo(exchangeInfo,
                                                            exchangeKeysJson);
    await this.suspendCoins(updatedExchangeInfo);

    await this.q()
              .put("exchanges", updatedExchangeInfo)
              .finish();

    return updatedExchangeInfo;
  }


  private async updateExchangeInfo(exchangeInfo: IExchangeInfo,
                                   newKeys: KeysJson): Promise<IExchangeInfo> {
    if (exchangeInfo.masterPublicKey != newKeys.master_public_key) {
      throw Error("public keys do not match");
    }

    exchangeInfo.active_denoms = [];

    let denomsToCheck = newKeys.denoms.filter((newDenom) => {
      // did we find the new denom in the list of all (old) denoms?
      let found = false;
      for (let oldDenom of exchangeInfo.all_denoms) {
        if (oldDenom.denom_pub === newDenom.denom_pub) {
          let a: any = Object.assign({}, oldDenom);
          let b: any = Object.assign({}, newDenom);
          // pub hash is only there for convenience in the wallet
          delete a["pub_hash"];
          delete b["pub_hash"];
          if (!deepEquals(a, b)) {
            console.error("denomination parameters were modified, old/new:");
            console.dir(a);
            console.dir(b);
            // FIXME: report to auditors
          }
          found = true;
          break;
        }
      }

      if (found) {
        exchangeInfo.active_denoms.push(newDenom);
        // No need to check signatures
        return false;
      }
      return true;
    });

    let ps = denomsToCheck.map(async(denom) => {
      let valid = await this.cryptoApi
                            .isValidDenom(denom,
                                          exchangeInfo.masterPublicKey);
      if (!valid) {
        console.error("invalid denomination",
                      denom,
                      "with key",
                      exchangeInfo.masterPublicKey);
        // FIXME: report to auditors
      }
      exchangeInfo.active_denoms.push(denom);
      exchangeInfo.all_denoms.push(denom);
    });

    await Promise.all(ps);

    return exchangeInfo;
  }


  /**
   * Retrieve a mapping from currency name to the amount
   * that is currenctly available for spending in the wallet.
   */
  async getBalances(): Promise<any> {
    function collectBalances(c: Coin, byCurrency: any) {
      if (c.suspended) {
        return byCurrency;
      }
      let acc: AmountJson = byCurrency[c.currentAmount.currency];
      if (!acc) {
        acc = Amounts.getZero(c.currentAmount.currency);
      }
      byCurrency[c.currentAmount.currency] = Amounts.add(c.currentAmount,
                                                         acc).amount;
      return byCurrency;
    }

    let byCurrency = await (
      this.q()
          .iter("coins")
          .reduce(collectBalances, {}));

    return {balances: byCurrency};
  }


  async createRefreshSession(oldCoinPub: string): Promise<RefreshSession|undefined> {

    // FIXME: this is not running in a transaction.

    let coin = await this.q().get<Coin>("coins", oldCoinPub);

    if (!coin) {
      throw Error("coin not found");
    }

    let exchange = await this.q().get<IExchangeInfo>("exchanges",
                                                     coin.exchangeBaseUrl);
    if (!exchange) {
      throw Error("db inconsistent");
    }

    let oldDenom = exchange.all_denoms.find((d) => d.denom_pub == coin!.denomPub);

    if (!oldDenom) {
      throw Error("db inconsistent");
    }

    let availableDenoms: Denomination[] = exchange.active_denoms;

    let availableAmount = Amounts.sub(coin.currentAmount,
                                      oldDenom.fee_refresh).amount;

    let newCoinDenoms = getWithdrawDenomList(availableAmount,
                                             availableDenoms);

    console.log("refreshing into", newCoinDenoms);

    if (newCoinDenoms.length == 0) {
      console.log("not refreshing, value too small");
      return undefined;
    }


    let refreshSession: RefreshSession = await (
      this.cryptoApi.createRefreshSession(exchange.baseUrl,
                                          3,
                                          coin,
                                          newCoinDenoms,
                                          oldDenom.fee_refresh));

    coin.currentAmount = Amounts.sub(coin.currentAmount,
                                     refreshSession.valueWithFee).amount;

    // FIXME:  we should check whether the amount still matches!
    await this.q()
              .put("refresh", refreshSession)
              .put("coins", coin)
              .finish();

    return refreshSession;
  }


  async refresh(oldCoinPub: string): Promise<void> {
    let refreshSession: RefreshSession|undefined;
    let oldSession = await this.q().get<RefreshSession>("refresh", oldCoinPub);
    if (oldSession) {
      refreshSession = oldSession;
    } else {
      refreshSession = await this.q().get<RefreshSession>("refresh",
                                                          oldCoinPub);
    }
    if (!refreshSession) {
      // refreshing not necessary
      return;
    }
    this.continueRefreshSession(refreshSession);
  }

  async continueRefreshSession(refreshSession: RefreshSession) {
    if (refreshSession.finished) {
      return;
    }
    if (typeof refreshSession.norevealIndex !== "number") {
      let coinPub = refreshSession.meltCoinPub;
      await this.refreshMelt(refreshSession);
      let r = await this.q().get<RefreshSession>("refresh", coinPub);
      if (!r) {
        throw Error("refresh session does not exist anymore");
      }
      refreshSession = r;
    }

    await this.refreshReveal(refreshSession);
  }


  async refreshMelt(refreshSession: RefreshSession): Promise<void> {
    if (refreshSession.norevealIndex != undefined) {
      console.error("won't melt again");
      return;
    }

    let coin = await this.q().get<Coin>("coins", refreshSession.meltCoinPub);
    if (!coin) {
      console.error("can't melt coin, it does not exist");
      return;
    }

    let reqUrl = URI("refresh/melt").absoluteTo(refreshSession.exchangeBaseUrl);
    let meltCoin = {
      coin_pub: coin.coinPub,
      denom_pub: coin.denomPub,
      denom_sig: coin.denomSig,
      confirm_sig: refreshSession.confirmSig,
      value_with_fee: refreshSession.valueWithFee,
    };
    let coinEvs = refreshSession.preCoinsForGammas.map((x) => x.map((y) => y.coinEv));
    let req = {
      "new_denoms": refreshSession.newDenoms,
      "melt_coin": meltCoin,
      "transfer_pubs": refreshSession.transferPubs,
      "coin_evs": coinEvs,
    };
    console.log("melt request:", req);
    let resp = await this.http.postJson(reqUrl, req);

    console.log("melt request:", req);
    console.log("melt response:", resp.responseText);

    if (resp.status != 200) {
      console.error(resp.responseText);
      throw Error("refresh failed");
    }

    let respJson = JSON.parse(resp.responseText);

    if (!respJson) {
      throw Error("exchange responded with garbage");
    }

    let norevealIndex = respJson.noreveal_index;

    if (typeof norevealIndex != "number") {
      throw Error("invalid response");
    }

    refreshSession.norevealIndex = norevealIndex;

    await this.q().put("refresh", refreshSession).finish();
  }


  async refreshReveal(refreshSession: RefreshSession): Promise<void> {
    let norevealIndex = refreshSession.norevealIndex;
    if (norevealIndex == undefined) {
      throw Error("can't reveal without melting first");
    }
    let privs = Array.from(refreshSession.transferPrivs);
    privs.splice(norevealIndex, 1);

    let req = {
      "session_hash": refreshSession.hash,
      "transfer_privs": privs,
    };

    let reqUrl = URI("refresh/reveal")
      .absoluteTo(refreshSession.exchangeBaseUrl);
    console.log("reveal request:", req);
    let resp = await this.http.postJson(reqUrl, req);

    console.log("session:", refreshSession);
    console.log("reveal response:", resp);

    if (resp.status != 200) {
      console.log("error:  /refresh/reveal returned status " + resp.status);
      return;
    }

    let respJson = JSON.parse(resp.responseText);

    if (!respJson.ev_sigs || !Array.isArray(respJson.ev_sigs)) {
      console.log("/refresh/reveal did not contain ev_sigs");
    }

    let exchange = await this.q().get<IExchangeInfo>("exchanges",
                                                     refreshSession.exchangeBaseUrl);
    if (!exchange) {
      console.error(`exchange ${refreshSession.exchangeBaseUrl} not found`);
      return;
    }

    let coins: Coin[] = [];

    for (let i = 0; i < respJson.ev_sigs.length; i++) {
      let denom = exchange.all_denoms.find((d) => d.denom_pub == refreshSession.newDenoms[i]);
      if (!denom) {
        console.error("denom not found");
        continue;
      }
      let pc = refreshSession.preCoinsForGammas[refreshSession.norevealIndex!][i];
      let denomSig = await this.cryptoApi.rsaUnblind(respJson.ev_sigs[i].ev_sig,
                                                     pc.blindingKey,
                                                     denom.denom_pub);
      let coin: Coin = {
        coinPub: pc.publicKey,
        coinPriv: pc.privateKey,
        denomPub: denom.denom_pub,
        denomSig: denomSig,
        currentAmount: denom.value,
        exchangeBaseUrl: refreshSession.exchangeBaseUrl,
        dirty: false,
        transactionPending: false,
      };

      coins.push(coin);
    }

    refreshSession.finished = true;

    await this.q()
              .putAll("coins", coins)
              .put("refresh", refreshSession)
              .finish();
  }


  /**
   * Retrive the full event history for this wallet.
   */
  async getHistory(): Promise<any> {
    function collect(x: any, acc: any) {
      acc.push(x);
      return acc;
    }

    let history = await (
      this.q()
          .iter("history", {indexName: "timestamp"})
          .reduce(collect, []));

    return {history};
  }

  async getExchanges(): Promise<IExchangeInfo[]> {
    return this.q()
               .iter<IExchangeInfo>("exchanges")
               .flatMap((e) => [e])
               .toArray();
  }

  async getReserves(exchangeBaseUrl: string): Promise<ReserveRecord[]> {
    return this.q()
               .iter<ReserveRecord>("reserves")
               .filter((r: ReserveRecord) => r.exchange_base_url === exchangeBaseUrl)
               .toArray();
  }

  async getCoins(exchangeBaseUrl: string): Promise<Coin[]> {
    return this.q()
               .iter<Coin>("coins")
               .filter((c: Coin) => c.exchangeBaseUrl === exchangeBaseUrl)
               .toArray();
  }

  async getPreCoins(exchangeBaseUrl: string): Promise<PreCoin[]> {
    return this.q()
               .iter<PreCoin>("precoins")
               .filter((c: PreCoin) => c.exchangeBaseUrl === exchangeBaseUrl)
               .toArray();
  }


  async hashContract(contract: any): Promise<string> {
    return this.cryptoApi.hashString(canonicalJson(contract));
  }

  /**
   * Check if there's an equivalent contract we've already purchased.
   */
  async checkRepurchase(contract: Contract): Promise<CheckRepurchaseResult> {
    if (!contract.repurchase_correlation_id) {
      console.log("no repurchase: no correlation id");
      return {isRepurchase: false};
    }
    let result: Transaction = await (
      this.q()
          .getIndexed("transactions",
                      "repurchase",
                      [
                        contract.merchant_pub,
                        contract.repurchase_correlation_id
                      ]));

    if (result) {
      console.assert(result.contract.repurchase_correlation_id == contract.repurchase_correlation_id);
      return {
        isRepurchase: true,
        existingContractHash: result.contractHash,
        existingFulfillmentUrl: result.contract.fulfillment_url,
      };
    } else {
      return {isRepurchase: false};
    }
  }


  async paymentSucceeded(contractHash: string): Promise<any> {
    const doPaymentSucceeded = async() => {
      let t = await this.q().get<Transaction>("transactions", contractHash);
      if (!t) {
        console.error("contract not found");
        return;
      }
      for (let pc of t.payReq.coins) {
        let c = await this.q().get<Coin>("coins", pc.coin_pub);
        if (!c) {
          console.error("coin not found");
          return;
        }
        c.transactionPending = false;
        await this.q().put("coins", c).finish();
      }
      for (let c of t.payReq.coins) {
        this.refresh(c.coin_pub);
      }
    };
    doPaymentSucceeded();
    return;
  }
}