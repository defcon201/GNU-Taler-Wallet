/*
 This file is part of GNU Taler
 (C) 2020 Taler Systems S.A.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */

import { Logger } from "../util/logging";
import {
  HttpRequestLibrary,
  readSuccessResponseJsonOrThrow,
  checkSuccessResponseOrThrow,
} from "../util/http";
import { codecForAny } from "../util/codec";
import {
  AmountString,
  CheckPaymentResponse,
  codecForCheckPaymentResponse,
} from "../types/talerTypes";
import { InternalWalletState } from "./state";
import { createTalerWithdrawReserve } from "./reserves";
import { URL } from "../util/url";
import { Wallet } from "../wallet";
import { Amounts } from "../util/amounts";
import { NodeHttpLib } from "../headless/NodeHttpLib";
import { getDefaultNodeWallet } from "../headless/helpers";
import {
  TestPayArgs,
  PreparePayResultType,
  IntegrationTestArgs,
} from "../types/walletTypes";

const logger = new Logger("operations/testing.ts");

interface BankUser {
  username: string;
  password: string;
}

interface BankWithdrawalResponse {
  taler_withdraw_uri: string;
  withdrawal_id: string;
}

interface MerchantBackendInfo {
  baseUrl: string;
  apikey: string;
}

/**
 * Generate a random alphanumeric ID.  Does *not* use cryptographically
 * secure randomness.
 */
function makeId(length: number): string {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Helper function to generate the "Authorization" HTTP header.
 */
function makeAuth(username: string, password: string): string {
  const auth = `${username}:${password}`;
  const authEncoded: string = Buffer.from(auth).toString("base64");
  return `Basic ${authEncoded}`;
}

export async function withdrawTestBalance(
  ws: InternalWalletState,
  amount = "TESTKUDOS:10",
  bankBaseUrl = "https://bank.test.taler.net/",
  exchangeBaseUrl = "https://exchange.test.taler.net/",
): Promise<void> {
  const bankUser = await registerRandomBankUser(ws.http, bankBaseUrl);
  logger.trace(`Registered bank user ${JSON.stringify(bankUser)}`);

  const wresp = await createBankWithdrawalUri(
    ws.http,
    bankBaseUrl,
    bankUser,
    amount,
  );

  await createTalerWithdrawReserve(
    ws,
    wresp.taler_withdraw_uri,
    exchangeBaseUrl,
  );

  await confirmBankWithdrawalUri(
    ws.http,
    bankBaseUrl,
    bankUser,
    wresp.withdrawal_id,
  );
}

async function createBankWithdrawalUri(
  http: HttpRequestLibrary,
  bankBaseUrl: string,
  bankUser: BankUser,
  amount: AmountString,
): Promise<BankWithdrawalResponse> {
  const reqUrl = new URL(
    `accounts/${bankUser.username}/withdrawals`,
    bankBaseUrl,
  ).href;
  const resp = await http.postJson(
    reqUrl,
    {
      amount,
    },
    {
      headers: {
        Authorization: makeAuth(bankUser.username, bankUser.password),
      },
    },
  );
  const respJson = await readSuccessResponseJsonOrThrow(resp, codecForAny());
  return respJson;
}

async function confirmBankWithdrawalUri(
  http: HttpRequestLibrary,
  bankBaseUrl: string,
  bankUser: BankUser,
  withdrawalId: string,
): Promise<void> {
  const reqUrl = new URL(
    `accounts/${bankUser.username}/withdrawals/${withdrawalId}/confirm`,
    bankBaseUrl,
  ).href;
  const resp = await http.postJson(
    reqUrl,
    {},
    {
      headers: {
        Authorization: makeAuth(bankUser.username, bankUser.password),
      },
    },
  );
  await readSuccessResponseJsonOrThrow(resp, codecForAny());
  return;
}

async function registerRandomBankUser(
  http: HttpRequestLibrary,
  bankBaseUrl: string,
): Promise<BankUser> {
  const reqUrl = new URL("testing/register", bankBaseUrl).href;
  const randId = makeId(8);
  const bankUser: BankUser = {
    username: `testuser-${randId}`,
    password: `testpw-${randId}`,
  };

  const resp = await http.postJson(reqUrl, bankUser);
  await checkSuccessResponseOrThrow(resp);
  return bankUser;
}

async function refund(
  http: HttpRequestLibrary,
  merchantBackend: MerchantBackendInfo,
  orderId: string,
  reason: string,
  refundAmount: string,
): Promise<string> {
  const reqUrl = new URL(
    `private/orders/${orderId}/refund`,
    merchantBackend.baseUrl,
  );
  const refundReq = {
    order_id: orderId,
    reason,
    refund: refundAmount,
  };
  const resp = await http.postJson(reqUrl.href, refundReq, {
    headers: {
      Authorization: `ApiKey ${merchantBackend.apikey}`,
    },
  });
  const r = await readSuccessResponseJsonOrThrow(resp, codecForAny());
  const refundUri = r.taler_refund_uri;
  if (!refundUri) {
    throw Error("no refund URI in response");
  }
  return refundUri;
}

async function createOrder(
  http: HttpRequestLibrary,
  merchantBackend: MerchantBackendInfo,
  amount: string,
  summary: string,
  fulfillmentUrl: string,
): Promise<{ orderId: string }> {
  const t = Math.floor(new Date().getTime() / 1000) + 15 * 60;
  const reqUrl = new URL("private/orders", merchantBackend.baseUrl).href;
  const orderReq = {
    order: {
      amount,
      summary,
      fulfillment_url: fulfillmentUrl,
      refund_deadline: { t_ms: t * 1000 },
      wire_transfer_deadline: { t_ms: t * 1000 },
    },
  };
  const resp = await http.postJson(reqUrl, orderReq, {
    headers: {
      Authorization: `ApiKey ${merchantBackend.apikey}`,
    },
  });
  const r = await readSuccessResponseJsonOrThrow(resp, codecForAny());
  const orderId = r.order_id;
  if (!orderId) {
    throw Error("no order id in response");
  }
  return { orderId };
}

async function checkPayment(
  http: HttpRequestLibrary,
  merchantBackend: MerchantBackendInfo,
  orderId: string,
): Promise<CheckPaymentResponse> {
  const reqUrl = new URL(`/private/orders/${orderId}`, merchantBackend.baseUrl);
  reqUrl.searchParams.set("order_id", orderId);
  const resp = await http.get(reqUrl.href, {
    headers: {
      Authorization: `ApiKey ${merchantBackend.apikey}`,
    },
  });
  return readSuccessResponseJsonOrThrow(resp, codecForCheckPaymentResponse());
}

interface BankUser {
  username: string;
  password: string;
}

interface BankWithdrawalResponse {
  taler_withdraw_uri: string;
  withdrawal_id: string;
}

async function makePayment(
  http: HttpRequestLibrary,
  wallet: Wallet,
  merchant: MerchantBackendInfo,
  amount: string,
  summary: string,
): Promise<{ orderId: string }> {
  const orderResp = await createOrder(
    http,
    merchant,
    amount,
    summary,
    "taler://fulfillment-success/thx",
  );

  logger.trace("created order with orderId", orderResp.orderId);

  let paymentStatus = await checkPayment(http, merchant, orderResp.orderId);

  logger.trace("payment status", paymentStatus);

  const talerPayUri = paymentStatus.taler_pay_uri;
  if (!talerPayUri) {
    throw Error("no taler://pay/ URI in payment response");
  }

  const preparePayResult = await wallet.preparePayForUri(talerPayUri);

  logger.trace("prepare pay result", preparePayResult);

  if (preparePayResult.status != "payment-possible") {
    throw Error("payment not possible");
  }

  const confirmPayResult = await wallet.confirmPay(
    preparePayResult.proposalId,
    undefined,
  );

  logger.trace("confirmPayResult", confirmPayResult);

  paymentStatus = await checkPayment(http, merchant, orderResp.orderId);

  logger.trace("payment status after wallet payment:", paymentStatus);

  if (paymentStatus.order_status !== "paid") {
    throw Error("payment did not succeed");
  }

  return {
    orderId: orderResp.orderId,
  };
}

export async function runIntegrationTest(
  http: HttpRequestLibrary,
  wallet: Wallet,
  args: IntegrationTestArgs,
): Promise<void> {
  logger.info("running test with arguments", args);

  const parsedSpendAmount = Amounts.parseOrThrow(args.amountToSpend);
  const currency = parsedSpendAmount.currency;

  logger.info("withdrawing test balance");
  await wallet.withdrawTestBalance({
    amount: args.amountToWithdraw,
    bankBaseUrl: args.bankBaseUrl,
    exchangeBaseUrl: args.exchangeBaseUrl,
  });
  await wallet.runUntilDone();
  logger.info("done withdrawing test balance");

  const balance = await wallet.getBalances();

  logger.trace(JSON.stringify(balance, null, 2));

  const myMerchant: MerchantBackendInfo = {
    baseUrl: args.merchantBaseUrl,
    apikey: args.merchantApiKey,
  };

  await makePayment(
    http,
    wallet,
    myMerchant,
    args.amountToSpend,
    "hello world",
  );

  // Wait until the refresh is done
  await wallet.runUntilDone();

  logger.trace("withdrawing test balance for refund");
  const withdrawAmountTwo = Amounts.parseOrThrow(`${currency}:18`);
  const spendAmountTwo = Amounts.parseOrThrow(`${currency}:7`);
  const refundAmount = Amounts.parseOrThrow(`${currency}:6`);
  const spendAmountThree = Amounts.parseOrThrow(`${currency}:3`);

  await wallet.withdrawTestBalance({
    amount: Amounts.stringify(withdrawAmountTwo),
    bankBaseUrl: args.bankBaseUrl,
    exchangeBaseUrl: args.exchangeBaseUrl,
  });

  // Wait until the withdraw is done
  await wallet.runUntilDone();

  const { orderId: refundOrderId } = await makePayment(
    http,
    wallet,
    myMerchant,
    Amounts.stringify(spendAmountTwo),
    "order that will be refunded",
  );

  const refundUri = await refund(
    http,
    myMerchant,
    refundOrderId,
    "test refund",
    Amounts.stringify(refundAmount),
  );

  logger.trace("refund URI", refundUri);

  await wallet.applyRefund(refundUri);

  logger.trace("integration test: applied refund");

  // Wait until the refund is done
  await wallet.runUntilDone();

  logger.trace("integration test: making payment after refund");

  await makePayment(
    http,
    wallet,
    myMerchant,
    Amounts.stringify(spendAmountThree),
    "payment after refund",
  );

  logger.trace("integration test: make payment done");

  await wallet.runUntilDone();

  logger.trace("integration test: all done!");
}

export async function testPay(
  http: HttpRequestLibrary,
  wallet: Wallet,
  args: TestPayArgs,
) {
  logger.trace("creating order");
  const merchant = {
    apikey: args.merchantApiKey,
    baseUrl: args.merchantBaseUrl,
  };
  const orderResp = await createOrder(
    http,
    merchant,
    args.amount,
    args.summary,
    "taler://fulfillment-success/thank+you",
  );
  logger.trace("created new order with order ID", orderResp.orderId);
  const checkPayResp = await checkPayment(http, merchant, orderResp.orderId);
  const talerPayUri = checkPayResp.taler_pay_uri;
  if (!talerPayUri) {
    console.error("fatal: no taler pay URI received from backend");
    process.exit(1);
    return;
  }
  logger.trace("taler pay URI:", talerPayUri);
  const result = await wallet.preparePayForUri(talerPayUri);
  if (result.status !== PreparePayResultType.PaymentPossible) {
    throw Error(`unexpected prepare pay status: ${result.status}`);
  }
  await wallet.confirmPay(result.proposalId, undefined);
}
