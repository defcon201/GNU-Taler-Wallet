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
import { runTest, GlobalTestState, delayMs } from "./harness";
import { createSimpleTestkudosEnvironment, withdrawViaBank } from "./helpers";

/**
 * Run test for basic, bank-integrated withdrawal.
 */
runTest(async (t: GlobalTestState) => {
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

  const orderResp = await merchant.createOrder("default", {
    order: {
      summary: "Buy me!",
      amount: "TESTKUDOS:5",
      fulfillment_url: "taler://fulfillment-success/thx",
    },
  });

  let orderStatus = await merchant.queryPrivateOrderStatus({
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

  orderStatus = await merchant.queryPrivateOrderStatus({
    orderId: orderResp.order_id,
  });

  t.assertTrue(orderStatus.order_status === "paid");

  let ref = await merchant.giveRefund({
    amount: "TESTKUDOS:2.5",
    instance: "default",
    justification: "foo",
    orderId: orderResp.order_id,
  });

  console.log("first refund increase response", ref);

  // Wait at least a second, because otherwise the increased
  // refund will be grouped with the previous one.
  await delayMs(1.2);

  ref = await merchant.giveRefund({
    amount: "TESTKUDOS:5",
    instance: "default",
    justification: "bar",
    orderId: orderResp.order_id,
  });

  console.log("second refund increase response", ref);

  let r = await wallet.apiRequest("applyRefund", {
    talerRefundUri: ref.talerRefundUri,
  });
  console.log(r);

  orderStatus = await merchant.queryPrivateOrderStatus({
    orderId: orderResp.order_id,
  });

  t.assertTrue(orderStatus.order_status === "paid");

  t.assertAmountEquals(orderStatus.refund_amount, "TESTKUDOS:5");

  console.log(JSON.stringify(orderStatus, undefined, 2));

  await wallet.runUntilDone();

  r = await wallet.apiRequest("getBalances", {});
  console.log(JSON.stringify(r, undefined, 2));

  r = await wallet.apiRequest("getTransactions", {});
  console.log(JSON.stringify(r, undefined, 2));

  await t.shutdown();
});
