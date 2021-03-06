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

/**
 * Imports.
 */
import { GlobalTestState, MerchantPrivateApi } from "./harness";
import {
  createSimpleTestkudosEnvironment,
  withdrawViaBank,
  applyTimeTravel,
} from "./helpers";
import {
  durationFromSpec,
  timestampAddDuration,
  getTimestampNow,
  timestampTruncateToSecond,
} from "@gnu-taler/taler-util";

/**
 * Run test for basic, bank-integrated withdrawal.
 */
export async function runRefundGoneTest(t: GlobalTestState) {
  // Set up test environment

  const {
    wallet,
    bank,
    exchange,
    merchant,
  } = await createSimpleTestkudosEnvironment(t);

  // Withdraw digital cash into the wallet.

  await withdrawViaBank(t, { wallet, bank, exchange, amount: "TESTKUDOS:20" });

  // Set up order.

  const orderResp = await MerchantPrivateApi.createOrder(merchant, "default", {
    order: {
      summary: "Buy me!",
      amount: "TESTKUDOS:5",
      fulfillment_url: "taler://fulfillment-success/thx",
      pay_deadline: timestampTruncateToSecond(
        timestampAddDuration(
          getTimestampNow(),
          durationFromSpec({
            minutes: 10,
          }),
        ),
      ),
    },
    refund_delay: durationFromSpec({ minutes: 1 }),
  });

  let orderStatus = await MerchantPrivateApi.queryPrivateOrderStatus(merchant, {
    orderId: orderResp.order_id,
  });

  t.assertTrue(orderStatus.order_status === "unpaid");

  // Make wallet pay for the order

  const r1 = await wallet.apiRequest("preparePay", {
    talerPayUri: orderStatus.taler_pay_uri,
  });
  t.assertTrue(r1.type === "response");

  const r2 = await wallet.apiRequest("confirmPay", {
    // FIXME: should be validated, don't cast!
    proposalId: (r1.result as any).proposalId,
  });
  t.assertTrue(r2.type === "response");

  // Check if payment was successful.

  orderStatus = await MerchantPrivateApi.queryPrivateOrderStatus(merchant, {
    orderId: orderResp.order_id,
  });

  t.assertTrue(orderStatus.order_status === "paid");

  console.log(orderStatus);

  await applyTimeTravel(durationFromSpec({ hours: 1 }), { exchange, wallet });

  await exchange.runAggregatorOnce();

  const ref = await MerchantPrivateApi.giveRefund(merchant, {
    amount: "TESTKUDOS:5",
    instance: "default",
    justification: "foo",
    orderId: orderResp.order_id,
  });

  console.log(ref);

  let rr = await wallet.applyRefund({
    talerRefundUri: ref.talerRefundUri,
  });

  t.assertAmountEquals(rr.amountRefundGone, "TESTKUDOS:5");
  console.log(rr);

  await wallet.runUntilDone();

  let r = await wallet.apiRequest("getBalances", {});
  console.log(JSON.stringify(r, undefined, 2));

  r = await wallet.apiRequest("getTransactions", {});
  console.log(JSON.stringify(r, undefined, 2));

  await t.shutdown();
}
