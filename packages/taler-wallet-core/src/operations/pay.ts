/*
 This file is part of GNU Taler
 (C) 2019 Taler Systems S.A.

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
 * Implementation of the payment operation, including downloading and
 * claiming of proposals.
 *
 * @author Florian Dold
 */

/**
 * Imports.
 */
import {
  AmountJson,
  Amounts,
  timestampIsBetween,
  getTimestampNow,
  isTimestampExpired,
  Timestamp,
  RefreshReason,
  CoinDepositPermission,
  NotificationType,
  TalerErrorDetails,
  Duration,
  durationMax,
  durationMin,
  durationMul,
  ContractTerms,
  codecForProposal,
  TalerErrorCode,
  codecForContractTerms,
  timestampAddDuration,
  ConfirmPayResult,
  ConfirmPayResultType,
  codecForMerchantPayResponse,
  PreparePayResult,
  PreparePayResultType,
  parsePayUri,
} from "@gnu-taler/taler-util";
import { encodeCrock, getRandomBytes } from "../crypto/talerCrypto";
import {
  AbortStatus,
  AllowedAuditorInfo,
  AllowedExchangeInfo,
  CoinRecord,
  CoinStatus,
  DenominationRecord,
  getHttpResponseErrorDetails,
  guardOperationException,
  HttpResponseStatus,
  Logger,
  makeErrorDetails,
  OperationFailedAndReportedError,
  OperationFailedError,
  ProposalRecord,
  ProposalStatus,
  PurchaseRecord,
  readSuccessResponseJsonOrErrorCode,
  readSuccessResponseJsonOrThrow,
  readTalerErrorResponse,
  Stores,
  throwUnexpectedRequestError,
  TransactionHandle,
  URL,
  WalletContractData,
} from "../index.js";
import {
  PayCoinSelection,
  CoinCandidateSelection,
  AvailableCoinInfo,
  selectPayCoins,
} from "../util/coinSelection.js";
import { canonicalJson } from "../util/helpers.js";
import {
  initRetryInfo,
  updateRetryInfoTimeout,
  getRetryDuration,
} from "../util/retries.js";
import { getTotalRefreshCost, createRefreshGroup } from "./refresh.js";
import { InternalWalletState, EXCHANGE_COINS_LOCK } from "./state.js";

/**
 * Logger.
 */
const logger = new Logger("pay.ts");

/**
 * Compute the total cost of a payment to the customer.
 *
 * This includes the amount taken by the merchant, fees (wire/deposit) contributed
 * by the customer, refreshing fees, fees for withdraw-after-refresh and "trimmings"
 * of coins that are too small to spend.
 */
export async function getTotalPaymentCost(
  ws: InternalWalletState,
  pcs: PayCoinSelection,
): Promise<AmountJson> {
  const costs = [];
  for (let i = 0; i < pcs.coinPubs.length; i++) {
    const coin = await ws.db.get(Stores.coins, pcs.coinPubs[i]);
    if (!coin) {
      throw Error("can't calculate payment cost, coin not found");
    }
    const denom = await ws.db.get(Stores.denominations, [
      coin.exchangeBaseUrl,
      coin.denomPubHash,
    ]);
    if (!denom) {
      throw Error(
        "can't calculate payment cost, denomination for coin not found",
      );
    }
    const allDenoms = await ws.db
      .iterIndex(
        Stores.denominations.exchangeBaseUrlIndex,
        coin.exchangeBaseUrl,
      )
      .toArray();
    const amountLeft = Amounts.sub(denom.value, pcs.coinContributions[i])
      .amount;
    const refreshCost = getTotalRefreshCost(allDenoms, denom, amountLeft);
    costs.push(pcs.coinContributions[i]);
    costs.push(refreshCost);
  }
  return Amounts.sum(costs).amount;
}

/**
 * Get the amount that will be deposited on the merchant's bank
 * account, not considering aggregation.
 */
export async function getEffectiveDepositAmount(
  ws: InternalWalletState,
  wireType: string,
  pcs: PayCoinSelection,
): Promise<AmountJson> {
  const amt: AmountJson[] = [];
  const fees: AmountJson[] = [];
  const exchangeSet: Set<string> = new Set();
  for (let i = 0; i < pcs.coinPubs.length; i++) {
    const coin = await ws.db.get(Stores.coins, pcs.coinPubs[i]);
    if (!coin) {
      throw Error("can't calculate deposit amountt, coin not found");
    }
    const denom = await ws.db.get(Stores.denominations, [
      coin.exchangeBaseUrl,
      coin.denomPubHash,
    ]);
    if (!denom) {
      throw Error("can't find denomination to calculate deposit amount");
    }
    amt.push(pcs.coinContributions[i]);
    fees.push(denom.feeDeposit);
    exchangeSet.add(coin.exchangeBaseUrl);
  }
  for (const exchangeUrl of exchangeSet.values()) {
    const exchange = await ws.db.get(Stores.exchanges, exchangeUrl);
    if (!exchange?.wireInfo) {
      continue;
    }
    const fee = exchange.wireInfo.feesForType[wireType].find((x) => {
      return timestampIsBetween(getTimestampNow(), x.startStamp, x.endStamp);
    })?.wireFee;
    if (fee) {
      fees.push(fee);
    }
  }
  return Amounts.sub(Amounts.sum(amt).amount, Amounts.sum(fees).amount).amount;
}

export function isSpendableCoin(
  coin: CoinRecord,
  denom: DenominationRecord,
): boolean {
  if (coin.suspended) {
    return false;
  }
  if (coin.status !== CoinStatus.Fresh) {
    return false;
  }
  if (isTimestampExpired(denom.stampExpireDeposit)) {
    return false;
  }
  return true;
}

export interface CoinSelectionRequest {
  amount: AmountJson;

  allowedAuditors: AllowedAuditorInfo[];
  allowedExchanges: AllowedExchangeInfo[];

  /**
   * Timestamp of the contract.
   */
  timestamp: Timestamp;

  wireMethod: string;

  wireFeeAmortization: number;

  maxWireFee: AmountJson;

  maxDepositFee: AmountJson;
}

/**
 * Get candidate coins.  From these candidate coins,
 * the actual contributions will be computed later.
 *
 * The resulting candidate coin list is sorted deterministically.
 *
 * TODO: Exclude more coins:
 * - when we already have a coin with more remaining amount than
 *   the payment amount, coins with even higher amounts can be skipped.
 */
export async function getCandidatePayCoins(
  ws: InternalWalletState,
  req: CoinSelectionRequest,
): Promise<CoinCandidateSelection> {
  const candidateCoins: AvailableCoinInfo[] = [];
  const wireFeesPerExchange: Record<string, AmountJson> = {};

  const exchanges = await ws.db.iter(Stores.exchanges).toArray();
  for (const exchange of exchanges) {
    let isOkay = false;
    const exchangeDetails = exchange.details;
    if (!exchangeDetails) {
      continue;
    }
    const exchangeFees = exchange.wireInfo;
    if (!exchangeFees) {
      continue;
    }

    // is the exchange explicitly allowed?
    for (const allowedExchange of req.allowedExchanges) {
      if (allowedExchange.exchangePub === exchangeDetails.masterPublicKey) {
        isOkay = true;
        break;
      }
    }

    // is the exchange allowed because of one of its auditors?
    if (!isOkay) {
      for (const allowedAuditor of req.allowedAuditors) {
        for (const auditor of exchangeDetails.auditors) {
          if (auditor.auditor_pub === allowedAuditor.auditorPub) {
            isOkay = true;
            break;
          }
        }
        if (isOkay) {
          break;
        }
      }
    }

    if (!isOkay) {
      continue;
    }

    const coins = await ws.db
      .iterIndex(Stores.coins.exchangeBaseUrlIndex, exchange.baseUrl)
      .toArray();

    if (!coins || coins.length === 0) {
      continue;
    }

    // Denomination of the first coin, we assume that all other
    // coins have the same currency
    const firstDenom = await ws.db.get(Stores.denominations, [
      exchange.baseUrl,
      coins[0].denomPubHash,
    ]);
    if (!firstDenom) {
      throw Error("db inconsistent");
    }
    const currency = firstDenom.value.currency;
    for (const coin of coins) {
      const denom = await ws.db.get(Stores.denominations, [
        exchange.baseUrl,
        coin.denomPubHash,
      ]);
      if (!denom) {
        throw Error("db inconsistent");
      }
      if (denom.value.currency !== currency) {
        logger.warn(
          `same pubkey for different currencies at exchange ${exchange.baseUrl}`,
        );
        continue;
      }
      if (!isSpendableCoin(coin, denom)) {
        continue;
      }
      candidateCoins.push({
        availableAmount: coin.currentAmount,
        coinPub: coin.coinPub,
        denomPub: coin.denomPub,
        feeDeposit: denom.feeDeposit,
        exchangeBaseUrl: denom.exchangeBaseUrl,
      });
    }

    let wireFee: AmountJson | undefined;
    for (const fee of exchangeFees.feesForType[req.wireMethod] || []) {
      if (fee.startStamp <= req.timestamp && fee.endStamp >= req.timestamp) {
        wireFee = fee.wireFee;
        break;
      }
    }
    if (wireFee) {
      wireFeesPerExchange[exchange.baseUrl] = wireFee;
    }
  }

  return {
    candidateCoins,
    wireFeesPerExchange,
  };
}

export async function applyCoinSpend(
  ws: InternalWalletState,
  tx: TransactionHandle<
    | typeof Stores.coins
    | typeof Stores.refreshGroups
    | typeof Stores.denominations
  >,
  coinSelection: PayCoinSelection,
) {
  for (let i = 0; i < coinSelection.coinPubs.length; i++) {
    const coin = await tx.get(Stores.coins, coinSelection.coinPubs[i]);
    if (!coin) {
      throw Error("coin allocated for payment doesn't exist anymore");
    }
    coin.status = CoinStatus.Dormant;
    const remaining = Amounts.sub(
      coin.currentAmount,
      coinSelection.coinContributions[i],
    );
    if (remaining.saturated) {
      throw Error("not enough remaining balance on coin for payment");
    }
    coin.currentAmount = remaining.amount;
    await tx.put(Stores.coins, coin);
  }
  const refreshCoinPubs = coinSelection.coinPubs.map((x) => ({
    coinPub: x,
  }));
  await createRefreshGroup(ws, tx, refreshCoinPubs, RefreshReason.Pay);
}

/**
 * Record all information that is necessary to
 * pay for a proposal in the wallet's database.
 */
async function recordConfirmPay(
  ws: InternalWalletState,
  proposal: ProposalRecord,
  coinSelection: PayCoinSelection,
  coinDepositPermissions: CoinDepositPermission[],
  sessionIdOverride: string | undefined,
): Promise<PurchaseRecord> {
  const d = proposal.download;
  if (!d) {
    throw Error("proposal is in invalid state");
  }
  let sessionId;
  if (sessionIdOverride) {
    sessionId = sessionIdOverride;
  } else {
    sessionId = proposal.downloadSessionId;
  }
  logger.trace(
    `recording payment on ${proposal.orderId} with session ID ${sessionId}`,
  );
  const payCostInfo = await getTotalPaymentCost(ws, coinSelection);
  const t: PurchaseRecord = {
    abortStatus: AbortStatus.None,
    download: d,
    lastSessionId: sessionId,
    payCoinSelection: coinSelection,
    totalPayCost: payCostInfo,
    coinDepositPermissions,
    timestampAccept: getTimestampNow(),
    timestampLastRefundStatus: undefined,
    proposalId: proposal.proposalId,
    lastPayError: undefined,
    lastRefundStatusError: undefined,
    payRetryInfo: initRetryInfo(),
    refundStatusRetryInfo: initRetryInfo(),
    refundQueryRequested: false,
    timestampFirstSuccessfulPay: undefined,
    autoRefundDeadline: undefined,
    paymentSubmitPending: true,
    refunds: {},
    merchantPaySig: undefined,
    noncePriv: proposal.noncePriv,
    noncePub: proposal.noncePub,
  };

  await ws.db.runWithWriteTransaction(
    [
      Stores.coins,
      Stores.purchases,
      Stores.proposals,
      Stores.refreshGroups,
      Stores.denominations,
    ],
    async (tx) => {
      const p = await tx.get(Stores.proposals, proposal.proposalId);
      if (p) {
        p.proposalStatus = ProposalStatus.ACCEPTED;
        p.lastError = undefined;
        p.retryInfo = initRetryInfo(false);
        await tx.put(Stores.proposals, p);
      }
      await tx.put(Stores.purchases, t);
      await applyCoinSpend(ws, tx, coinSelection);
    },
  );

  ws.notify({
    type: NotificationType.ProposalAccepted,
    proposalId: proposal.proposalId,
  });
  return t;
}

async function incrementProposalRetry(
  ws: InternalWalletState,
  proposalId: string,
  err: TalerErrorDetails | undefined,
): Promise<void> {
  await ws.db.runWithWriteTransaction([Stores.proposals], async (tx) => {
    const pr = await tx.get(Stores.proposals, proposalId);
    if (!pr) {
      return;
    }
    if (!pr.retryInfo) {
      return;
    }
    pr.retryInfo.retryCounter++;
    updateRetryInfoTimeout(pr.retryInfo);
    pr.lastError = err;
    await tx.put(Stores.proposals, pr);
  });
  if (err) {
    ws.notify({ type: NotificationType.ProposalOperationError, error: err });
  }
}

async function incrementPurchasePayRetry(
  ws: InternalWalletState,
  proposalId: string,
  err: TalerErrorDetails | undefined,
): Promise<void> {
  logger.warn("incrementing purchase pay retry with error", err);
  await ws.db.runWithWriteTransaction([Stores.purchases], async (tx) => {
    const pr = await tx.get(Stores.purchases, proposalId);
    if (!pr) {
      return;
    }
    if (!pr.payRetryInfo) {
      return;
    }
    pr.payRetryInfo.retryCounter++;
    updateRetryInfoTimeout(pr.payRetryInfo);
    pr.lastPayError = err;
    await tx.put(Stores.purchases, pr);
  });
  if (err) {
    ws.notify({ type: NotificationType.PayOperationError, error: err });
  }
}

export async function processDownloadProposal(
  ws: InternalWalletState,
  proposalId: string,
  forceNow = false,
): Promise<void> {
  const onOpErr = (err: TalerErrorDetails): Promise<void> =>
    incrementProposalRetry(ws, proposalId, err);
  await guardOperationException(
    () => processDownloadProposalImpl(ws, proposalId, forceNow),
    onOpErr,
  );
}

async function resetDownloadProposalRetry(
  ws: InternalWalletState,
  proposalId: string,
): Promise<void> {
  await ws.db.mutate(Stores.proposals, proposalId, (x) => {
    if (x.retryInfo.active) {
      x.retryInfo = initRetryInfo();
    }
    return x;
  });
}

async function failProposalPermanently(
  ws: InternalWalletState,
  proposalId: string,
  err: TalerErrorDetails,
): Promise<void> {
  await ws.db.mutate(Stores.proposals, proposalId, (x) => {
    x.retryInfo.active = false;
    x.lastError = err;
    x.proposalStatus = ProposalStatus.PERMANENTLY_FAILED;
    return x;
  });
}

function getProposalRequestTimeout(proposal: ProposalRecord): Duration {
  return durationMax(
    { d_ms: 60000 },
    durationMin({ d_ms: 5000 }, getRetryDuration(proposal.retryInfo)),
  );
}

function getPayRequestTimeout(purchase: PurchaseRecord): Duration {
  return durationMul(
    { d_ms: 15000 },
    1 + purchase.payCoinSelection.coinPubs.length / 5,
  );
}

export function extractContractData(
  parsedContractTerms: ContractTerms,
  contractTermsHash: string,
  merchantSig: string,
): WalletContractData {
  const amount = Amounts.parseOrThrow(parsedContractTerms.amount);
  let maxWireFee: AmountJson;
  if (parsedContractTerms.max_wire_fee) {
    maxWireFee = Amounts.parseOrThrow(parsedContractTerms.max_wire_fee);
  } else {
    maxWireFee = Amounts.getZero(amount.currency);
  }
  return {
    amount,
    contractTermsHash: contractTermsHash,
    fulfillmentUrl: parsedContractTerms.fulfillment_url ?? "",
    merchantBaseUrl: parsedContractTerms.merchant_base_url,
    merchantPub: parsedContractTerms.merchant_pub,
    merchantSig,
    orderId: parsedContractTerms.order_id,
    summary: parsedContractTerms.summary,
    autoRefund: parsedContractTerms.auto_refund,
    maxWireFee,
    payDeadline: parsedContractTerms.pay_deadline,
    refundDeadline: parsedContractTerms.refund_deadline,
    wireFeeAmortization: parsedContractTerms.wire_fee_amortization || 1,
    allowedAuditors: parsedContractTerms.auditors.map((x) => ({
      auditorBaseUrl: x.url,
      auditorPub: x.auditor_pub,
    })),
    allowedExchanges: parsedContractTerms.exchanges.map((x) => ({
      exchangeBaseUrl: x.url,
      exchangePub: x.master_pub,
    })),
    timestamp: parsedContractTerms.timestamp,
    wireMethod: parsedContractTerms.wire_method,
    wireInfoHash: parsedContractTerms.h_wire,
    maxDepositFee: Amounts.parseOrThrow(parsedContractTerms.max_fee),
    merchant: parsedContractTerms.merchant,
    products: parsedContractTerms.products,
    summaryI18n: parsedContractTerms.summary_i18n,
  };
}

async function processDownloadProposalImpl(
  ws: InternalWalletState,
  proposalId: string,
  forceNow: boolean,
): Promise<void> {
  if (forceNow) {
    await resetDownloadProposalRetry(ws, proposalId);
  }
  const proposal = await ws.db.get(Stores.proposals, proposalId);
  if (!proposal) {
    return;
  }
  if (proposal.proposalStatus != ProposalStatus.DOWNLOADING) {
    return;
  }

  const orderClaimUrl = new URL(
    `orders/${proposal.orderId}/claim`,
    proposal.merchantBaseUrl,
  ).href;
  logger.trace("downloading contract from '" + orderClaimUrl + "'");

  const requestBody: {
    nonce: string;
    token?: string;
  } = {
    nonce: proposal.noncePub,
  };
  if (proposal.claimToken) {
    requestBody.token = proposal.claimToken;
  }

  const httpResponse = await ws.http.postJson(orderClaimUrl, requestBody, {
    timeout: getProposalRequestTimeout(proposal),
  });
  const r = await readSuccessResponseJsonOrErrorCode(
    httpResponse,
    codecForProposal(),
  );
  if (r.isError) {
    switch (r.talerErrorResponse.code) {
      case TalerErrorCode.MERCHANT_POST_ORDERS_ID_CLAIM_ALREADY_CLAIMED:
        throw OperationFailedError.fromCode(
          TalerErrorCode.WALLET_ORDER_ALREADY_CLAIMED,
          "order already claimed (likely by other wallet)",
          {
            orderId: proposal.orderId,
            claimUrl: orderClaimUrl,
          },
        );
      default:
        throwUnexpectedRequestError(httpResponse, r.talerErrorResponse);
    }
  }
  const proposalResp = r.response;

  // The proposalResp contains the contract terms as raw JSON,
  // as the coded to parse them doesn't necessarily round-trip.
  // We need this raw JSON to compute the contract terms hash.

  const contractTermsHash = await ws.cryptoApi.hashString(
    canonicalJson(proposalResp.contract_terms),
  );

  const parsedContractTerms = codecForContractTerms().decode(
    proposalResp.contract_terms,
  );

  const sigValid = await ws.cryptoApi.isValidContractTermsSignature(
    contractTermsHash,
    proposalResp.sig,
    parsedContractTerms.merchant_pub,
  );

  if (!sigValid) {
    const err = makeErrorDetails(
      TalerErrorCode.WALLET_CONTRACT_TERMS_SIGNATURE_INVALID,
      "merchant's signature on contract terms is invalid",
      {
        merchantPub: parsedContractTerms.merchant_pub,
        orderId: parsedContractTerms.order_id,
      },
    );
    await failProposalPermanently(ws, proposalId, err);
    throw new OperationFailedAndReportedError(err);
  }

  const fulfillmentUrl = parsedContractTerms.fulfillment_url;

  const baseUrlForDownload = proposal.merchantBaseUrl;
  const baseUrlFromContractTerms = parsedContractTerms.merchant_base_url;

  if (baseUrlForDownload !== baseUrlFromContractTerms) {
    const err = makeErrorDetails(
      TalerErrorCode.WALLET_CONTRACT_TERMS_BASE_URL_MISMATCH,
      "merchant base URL mismatch",
      {
        baseUrlForDownload,
        baseUrlFromContractTerms,
      },
    );
    await failProposalPermanently(ws, proposalId, err);
    throw new OperationFailedAndReportedError(err);
  }

  const contractData = extractContractData(
    parsedContractTerms,
    contractTermsHash,
    proposalResp.sig,
  );

  await ws.db.runWithWriteTransaction(
    [Stores.proposals, Stores.purchases],
    async (tx) => {
      const p = await tx.get(Stores.proposals, proposalId);
      if (!p) {
        return;
      }
      if (p.proposalStatus !== ProposalStatus.DOWNLOADING) {
        return;
      }
      p.download = {
        contractData,
        contractTermsRaw: proposalResp.contract_terms,
      };
      if (
        fulfillmentUrl &&
        (fulfillmentUrl.startsWith("http://") ||
          fulfillmentUrl.startsWith("https://"))
      ) {
        const differentPurchase = await tx.getIndexed(
          Stores.purchases.fulfillmentUrlIndex,
          fulfillmentUrl,
        );
        if (differentPurchase) {
          logger.warn("repurchase detected");
          p.proposalStatus = ProposalStatus.REPURCHASE;
          p.repurchaseProposalId = differentPurchase.proposalId;
          await tx.put(Stores.proposals, p);
          return;
        }
      }
      p.proposalStatus = ProposalStatus.PROPOSED;
      await tx.put(Stores.proposals, p);
    },
  );

  ws.notify({
    type: NotificationType.ProposalDownloaded,
    proposalId: proposal.proposalId,
  });
}

/**
 * Download a proposal and store it in the database.
 * Returns an id for it to retrieve it later.
 *
 * @param sessionId Current session ID, if the proposal is being
 *  downloaded in the context of a session ID.
 */
async function startDownloadProposal(
  ws: InternalWalletState,
  merchantBaseUrl: string,
  orderId: string,
  sessionId: string | undefined,
  claimToken: string | undefined,
): Promise<string> {
  const oldProposal = await ws.db.getIndexed(
    Stores.proposals.urlAndOrderIdIndex,
    [merchantBaseUrl, orderId],
  );
  if (oldProposal) {
    await processDownloadProposal(ws, oldProposal.proposalId);
    return oldProposal.proposalId;
  }

  const { priv, pub } = await ws.cryptoApi.createEddsaKeypair();
  const proposalId = encodeCrock(getRandomBytes(32));

  const proposalRecord: ProposalRecord = {
    download: undefined,
    noncePriv: priv,
    noncePub: pub,
    claimToken,
    timestamp: getTimestampNow(),
    merchantBaseUrl,
    orderId,
    proposalId: proposalId,
    proposalStatus: ProposalStatus.DOWNLOADING,
    repurchaseProposalId: undefined,
    retryInfo: initRetryInfo(),
    lastError: undefined,
    downloadSessionId: sessionId,
  };

  await ws.db.runWithWriteTransaction([Stores.proposals], async (tx) => {
    const existingRecord = await tx.getIndexed(
      Stores.proposals.urlAndOrderIdIndex,
      [merchantBaseUrl, orderId],
    );
    if (existingRecord) {
      // Created concurrently
      return;
    }
    await tx.put(Stores.proposals, proposalRecord);
  });

  await processDownloadProposal(ws, proposalId);
  return proposalId;
}

async function storeFirstPaySuccess(
  ws: InternalWalletState,
  proposalId: string,
  sessionId: string | undefined,
  paySig: string,
): Promise<void> {
  const now = getTimestampNow();
  await ws.db.runWithWriteTransaction([Stores.purchases], async (tx) => {
    const purchase = await tx.get(Stores.purchases, proposalId);

    if (!purchase) {
      logger.warn("purchase does not exist anymore");
      return;
    }
    const isFirst = purchase.timestampFirstSuccessfulPay === undefined;
    if (!isFirst) {
      logger.warn("payment success already stored");
      return;
    }
    purchase.timestampFirstSuccessfulPay = now;
    purchase.paymentSubmitPending = false;
    purchase.lastPayError = undefined;
    purchase.lastSessionId = sessionId;
    purchase.payRetryInfo = initRetryInfo(false);
    purchase.merchantPaySig = paySig;
    if (isFirst) {
      const ar = purchase.download.contractData.autoRefund;
      if (ar) {
        logger.info("auto_refund present");
        purchase.refundQueryRequested = true;
        purchase.refundStatusRetryInfo = initRetryInfo();
        purchase.lastRefundStatusError = undefined;
        purchase.autoRefundDeadline = timestampAddDuration(now, ar);
      }
    }

    await tx.put(Stores.purchases, purchase);
  });
}

async function storePayReplaySuccess(
  ws: InternalWalletState,
  proposalId: string,
  sessionId: string | undefined,
): Promise<void> {
  await ws.db.runWithWriteTransaction([Stores.purchases], async (tx) => {
    const purchase = await tx.get(Stores.purchases, proposalId);

    if (!purchase) {
      logger.warn("purchase does not exist anymore");
      return;
    }
    const isFirst = purchase.timestampFirstSuccessfulPay === undefined;
    if (isFirst) {
      throw Error("invalid payment state");
    }
    purchase.paymentSubmitPending = false;
    purchase.lastPayError = undefined;
    purchase.payRetryInfo = initRetryInfo(false);
    purchase.lastSessionId = sessionId;
    await tx.put(Stores.purchases, purchase);
  });
}

/**
 * Handle a 409 Conflict response from the merchant.
 *
 * We do this by going through the coin history provided by the exchange and
 * (1) verifying the signatures from the exchange
 * (2) adjusting the remaining coin value
 * (3) re-do coin selection with the bad coin removed
 */
async function handleInsufficientFunds(
  ws: InternalWalletState,
  proposalId: string,
  err: TalerErrorDetails,
): Promise<void> {
  const proposal = await ws.db.get(Stores.purchases, proposalId);
  if (!proposal) {
    return;
  }

  throw Error("payment re-denomination not implemented yet");
}

/**
 * Submit a payment to the merchant.
 *
 * If the wallet has previously paid, it just transmits the merchant's
 * own signature certifying that the wallet has previously paid.
 */
async function submitPay(
  ws: InternalWalletState,
  proposalId: string,
): Promise<ConfirmPayResult> {
  const purchase = await ws.db.get(Stores.purchases, proposalId);
  if (!purchase) {
    throw Error("Purchase not found: " + proposalId);
  }
  if (purchase.abortStatus !== AbortStatus.None) {
    throw Error("not submitting payment for aborted purchase");
  }
  const sessionId = purchase.lastSessionId;

  logger.trace("paying with session ID", sessionId);

  if (!purchase.merchantPaySig) {
    const payUrl = new URL(
      `orders/${purchase.download.contractData.orderId}/pay`,
      purchase.download.contractData.merchantBaseUrl,
    ).href;

    let depositPermissions: CoinDepositPermission[];

    if (purchase.coinDepositPermissions) {
      depositPermissions = purchase.coinDepositPermissions;
    } else {
      // FIXME: also cache!
      depositPermissions = await generateDepositPermissions(
        ws,
        purchase.payCoinSelection,
        purchase.download.contractData,
      );
    }

    const reqBody = {
      coins: depositPermissions,
      session_id: purchase.lastSessionId,
    };

    logger.trace(
      "making pay request ... ",
      JSON.stringify(reqBody, undefined, 2),
    );

    const resp = await ws.runSequentialized([EXCHANGE_COINS_LOCK], () =>
      ws.http.postJson(payUrl, reqBody, {
        timeout: getPayRequestTimeout(purchase),
      }),
    );

    logger.trace(`got resp ${JSON.stringify(resp)}`);

    // Hide transient errors.
    if (
      purchase.payRetryInfo.retryCounter <= 5 &&
      resp.status >= 500 &&
      resp.status <= 599
    ) {
      logger.trace("treating /pay error as transient");
      const err = makeErrorDetails(
        TalerErrorCode.WALLET_UNEXPECTED_REQUEST_ERROR,
        "/pay failed",
        getHttpResponseErrorDetails(resp),
      );
      incrementPurchasePayRetry(ws, proposalId, undefined);
      return {
        type: ConfirmPayResultType.Pending,
        lastError: err,
      };
    }

    if (resp.status === HttpResponseStatus.Conflict) {
      const err = await readTalerErrorResponse(resp);
      if (
        err.code ===
        TalerErrorCode.MERCHANT_POST_ORDERS_ID_PAY_INSUFFICIENT_FUNDS
      ) {
        // Do this in the background, as it might take some time
        handleInsufficientFunds(ws, proposalId, err).catch(async (e) => {
          await incrementProposalRetry(ws, proposalId, {
            code: TalerErrorCode.WALLET_UNEXPECTED_EXCEPTION,
            message: "unexpected exception",
            hint: "unexpected exception",
            details: {
              exception: e,
            },
          });
        });

        return {
          type: ConfirmPayResultType.Pending,
          // FIXME: should we return something better here?
          lastError: err,
        };
      }
    }

    const merchantResp = await readSuccessResponseJsonOrThrow(
      resp,
      codecForMerchantPayResponse(),
    );

    logger.trace("got success from pay URL", merchantResp);

    const merchantPub = purchase.download.contractData.merchantPub;
    const valid: boolean = await ws.cryptoApi.isValidPaymentSignature(
      merchantResp.sig,
      purchase.download.contractData.contractTermsHash,
      merchantPub,
    );

    if (!valid) {
      logger.error("merchant payment signature invalid");
      // FIXME: properly display error
      throw Error("merchant payment signature invalid");
    }

    await storeFirstPaySuccess(ws, proposalId, sessionId, merchantResp.sig);
  } else {
    const payAgainUrl = new URL(
      `orders/${purchase.download.contractData.orderId}/paid`,
      purchase.download.contractData.merchantBaseUrl,
    ).href;
    const reqBody = {
      sig: purchase.merchantPaySig,
      h_contract: purchase.download.contractData.contractTermsHash,
      session_id: sessionId ?? "",
    };
    const resp = await ws.runSequentialized([EXCHANGE_COINS_LOCK], () =>
      ws.http.postJson(payAgainUrl, reqBody),
    );
    // Hide transient errors.
    if (
      purchase.payRetryInfo.retryCounter <= 5 &&
      resp.status >= 500 &&
      resp.status <= 599
    ) {
      const err = makeErrorDetails(
        TalerErrorCode.WALLET_UNEXPECTED_REQUEST_ERROR,
        "/paid failed",
        getHttpResponseErrorDetails(resp),
      );
      incrementPurchasePayRetry(ws, proposalId, undefined);
      return {
        type: ConfirmPayResultType.Pending,
        lastError: err,
      };
    }
    if (resp.status !== 204) {
      throw OperationFailedError.fromCode(
        TalerErrorCode.WALLET_UNEXPECTED_REQUEST_ERROR,
        "/paid failed",
        getHttpResponseErrorDetails(resp),
      );
    }
    await storePayReplaySuccess(ws, proposalId, sessionId);
  }

  ws.notify({
    type: NotificationType.PayOperationSuccess,
    proposalId: purchase.proposalId,
  });

  return {
    type: ConfirmPayResultType.Done,
    contractTerms: purchase.download.contractTermsRaw,
  };
}

export async function checkPaymentByProposalId(
  ws: InternalWalletState,
  proposalId: string,
  sessionId?: string,
): Promise<PreparePayResult> {
  let proposal = await ws.db.get(Stores.proposals, proposalId);
  if (!proposal) {
    throw Error(`could not get proposal ${proposalId}`);
  }
  if (proposal.proposalStatus === ProposalStatus.REPURCHASE) {
    const existingProposalId = proposal.repurchaseProposalId;
    if (!existingProposalId) {
      throw Error("invalid proposal state");
    }
    logger.trace("using existing purchase for same product");
    proposal = await ws.db.get(Stores.proposals, existingProposalId);
    if (!proposal) {
      throw Error("existing proposal is in wrong state");
    }
  }
  const d = proposal.download;
  if (!d) {
    logger.error("bad proposal", proposal);
    throw Error("proposal is in invalid state");
  }
  const contractData = d.contractData;
  const merchantSig = d.contractData.merchantSig;
  if (!merchantSig) {
    throw Error("BUG: proposal is in invalid state");
  }

  proposalId = proposal.proposalId;

  // First check if we already payed for it.
  const purchase = await ws.db.get(Stores.purchases, proposalId);

  if (!purchase) {
    // If not already paid, check if we could pay for it.
    const candidates = await getCandidatePayCoins(ws, {
      allowedAuditors: contractData.allowedAuditors,
      allowedExchanges: contractData.allowedExchanges,
      amount: contractData.amount,
      maxDepositFee: contractData.maxDepositFee,
      maxWireFee: contractData.maxWireFee,
      timestamp: contractData.timestamp,
      wireFeeAmortization: contractData.wireFeeAmortization,
      wireMethod: contractData.wireMethod,
    });
    const res = selectPayCoins({
      candidates,
      contractTermsAmount: contractData.amount,
      depositFeeLimit: contractData.maxDepositFee,
      wireFeeAmortization: contractData.wireFeeAmortization ?? 1,
      wireFeeLimit: contractData.maxWireFee,
      prevPayCoins: [],
    });

    if (!res) {
      logger.info("not confirming payment, insufficient coins");
      return {
        status: PreparePayResultType.InsufficientBalance,
        contractTerms: d.contractTermsRaw,
        proposalId: proposal.proposalId,
        amountRaw: Amounts.stringify(d.contractData.amount),
      };
    }

    const totalCost = await getTotalPaymentCost(ws, res);
    logger.trace("costInfo", totalCost);
    logger.trace("coinsForPayment", res);

    return {
      status: PreparePayResultType.PaymentPossible,
      contractTerms: d.contractTermsRaw,
      proposalId: proposal.proposalId,
      amountEffective: Amounts.stringify(totalCost),
      amountRaw: Amounts.stringify(res.paymentAmount),
    };
  }

  if (purchase.lastSessionId !== sessionId) {
    logger.trace(
      "automatically re-submitting payment with different session ID",
    );
    await ws.db.runWithWriteTransaction([Stores.purchases], async (tx) => {
      const p = await tx.get(Stores.purchases, proposalId);
      if (!p) {
        return;
      }
      p.lastSessionId = sessionId;
      await tx.put(Stores.purchases, p);
    });
    const r = await guardOperationException(
      () => submitPay(ws, proposalId),
      (e: TalerErrorDetails): Promise<void> =>
        incrementPurchasePayRetry(ws, proposalId, e),
    );
    if (r.type !== ConfirmPayResultType.Done) {
      throw Error("submitting pay failed");
    }
    return {
      status: PreparePayResultType.AlreadyConfirmed,
      contractTerms: purchase.download.contractTermsRaw,
      contractTermsHash: purchase.download.contractData.contractTermsHash,
      paid: true,
      amountRaw: Amounts.stringify(purchase.download.contractData.amount),
      amountEffective: Amounts.stringify(purchase.totalPayCost),
      proposalId,
    };
  } else if (!purchase.timestampFirstSuccessfulPay) {
    return {
      status: PreparePayResultType.AlreadyConfirmed,
      contractTerms: purchase.download.contractTermsRaw,
      contractTermsHash: purchase.download.contractData.contractTermsHash,
      paid: false,
      amountRaw: Amounts.stringify(purchase.download.contractData.amount),
      amountEffective: Amounts.stringify(purchase.totalPayCost),
      proposalId,
    };
  } else {
    const paid = !purchase.paymentSubmitPending;
    return {
      status: PreparePayResultType.AlreadyConfirmed,
      contractTerms: purchase.download.contractTermsRaw,
      contractTermsHash: purchase.download.contractData.contractTermsHash,
      paid,
      amountRaw: Amounts.stringify(purchase.download.contractData.amount),
      amountEffective: Amounts.stringify(purchase.totalPayCost),
      ...(paid ? { nextUrl: purchase.download.contractData.orderId } : {}),
      proposalId,
    };
  }
}

/**
 * Check if a payment for the given taler://pay/ URI is possible.
 *
 * If the payment is possible, the signature are already generated but not
 * yet send to the merchant.
 */
export async function preparePayForUri(
  ws: InternalWalletState,
  talerPayUri: string,
): Promise<PreparePayResult> {
  const uriResult = parsePayUri(talerPayUri);

  if (!uriResult) {
    throw OperationFailedError.fromCode(
      TalerErrorCode.WALLET_INVALID_TALER_PAY_URI,
      `invalid taler://pay URI (${talerPayUri})`,
      {
        talerPayUri,
      },
    );
  }

  let proposalId = await startDownloadProposal(
    ws,
    uriResult.merchantBaseUrl,
    uriResult.orderId,
    uriResult.sessionId,
    uriResult.claimToken,
  );

  return checkPaymentByProposalId(ws, proposalId, uriResult.sessionId);
}

/**
 * Generate deposit permissions for a purchase.
 *
 * Accesses the database and the crypto worker.
 */
export async function generateDepositPermissions(
  ws: InternalWalletState,
  payCoinSel: PayCoinSelection,
  contractData: WalletContractData,
): Promise<CoinDepositPermission[]> {
  const depositPermissions: CoinDepositPermission[] = [];
  for (let i = 0; i < payCoinSel.coinPubs.length; i++) {
    const coin = await ws.db.get(Stores.coins, payCoinSel.coinPubs[i]);
    if (!coin) {
      throw Error("can't pay, allocated coin not found anymore");
    }
    const denom = await ws.db.get(Stores.denominations, [
      coin.exchangeBaseUrl,
      coin.denomPubHash,
    ]);
    if (!denom) {
      throw Error(
        "can't pay, denomination of allocated coin not found anymore",
      );
    }
    const dp = await ws.cryptoApi.signDepositPermission({
      coinPriv: coin.coinPriv,
      coinPub: coin.coinPub,
      contractTermsHash: contractData.contractTermsHash,
      denomPubHash: coin.denomPubHash,
      denomSig: coin.denomSig,
      exchangeBaseUrl: coin.exchangeBaseUrl,
      feeDeposit: denom.feeDeposit,
      merchantPub: contractData.merchantPub,
      refundDeadline: contractData.refundDeadline,
      spendAmount: payCoinSel.coinContributions[i],
      timestamp: contractData.timestamp,
      wireInfoHash: contractData.wireInfoHash,
    });
    depositPermissions.push(dp);
  }
  return depositPermissions;
}

/**
 * Add a contract to the wallet and sign coins, and send them.
 */
export async function confirmPay(
  ws: InternalWalletState,
  proposalId: string,
  sessionIdOverride?: string,
): Promise<ConfirmPayResult> {
  logger.trace(
    `executing confirmPay with proposalId ${proposalId} and sessionIdOverride ${sessionIdOverride}`,
  );
  const proposal = await ws.db.get(Stores.proposals, proposalId);

  if (!proposal) {
    throw Error(`proposal with id ${proposalId} not found`);
  }

  const d = proposal.download;
  if (!d) {
    throw Error("proposal is in invalid state");
  }

  let purchase = await ws.db.get(Stores.purchases, proposalId);

  if (purchase) {
    if (
      sessionIdOverride !== undefined &&
      sessionIdOverride != purchase.lastSessionId
    ) {
      logger.trace(`changing session ID to ${sessionIdOverride}`);
      await ws.db.mutate(Stores.purchases, purchase.proposalId, (x) => {
        x.lastSessionId = sessionIdOverride;
        x.paymentSubmitPending = true;
        return x;
      });
    }
    logger.trace("confirmPay: submitting payment for existing purchase");
    return await guardOperationException(
      () => submitPay(ws, proposalId),
      (e: TalerErrorDetails): Promise<void> =>
        incrementPurchasePayRetry(ws, proposalId, e),
    );
  }

  logger.trace("confirmPay: purchase record does not exist yet");

  const contractData = d.contractData;

  const candidates = await getCandidatePayCoins(ws, {
    allowedAuditors: contractData.allowedAuditors,
    allowedExchanges: contractData.allowedExchanges,
    amount: contractData.amount,
    maxDepositFee: contractData.maxDepositFee,
    maxWireFee: contractData.maxWireFee,
    timestamp: contractData.timestamp,
    wireFeeAmortization: contractData.wireFeeAmortization,
    wireMethod: contractData.wireMethod,
  });

  const res = selectPayCoins({
    candidates,
    contractTermsAmount: contractData.amount,
    depositFeeLimit: contractData.maxDepositFee,
    wireFeeAmortization: contractData.wireFeeAmortization ?? 1,
    wireFeeLimit: contractData.maxWireFee,
    prevPayCoins: [],
  });

  logger.trace("coin selection result", res);

  if (!res) {
    // Should not happen, since checkPay should be called first
    // FIXME: Actually, this should be handled gracefully,
    // and the status should be stored in the DB.
    logger.warn("not confirming payment, insufficient coins");
    throw Error("insufficient balance");
  }

  const depositPermissions = await generateDepositPermissions(
    ws,
    res,
    d.contractData,
  );
  purchase = await recordConfirmPay(
    ws,
    proposal,
    res,
    depositPermissions,
    sessionIdOverride,
  );

  return await guardOperationException(
    () => submitPay(ws, proposalId),
    (e: TalerErrorDetails): Promise<void> =>
      incrementPurchasePayRetry(ws, proposalId, e),
  );
}

export async function processPurchasePay(
  ws: InternalWalletState,
  proposalId: string,
  forceNow = false,
): Promise<void> {
  const onOpErr = (e: TalerErrorDetails): Promise<void> =>
    incrementPurchasePayRetry(ws, proposalId, e);
  await guardOperationException(
    () => processPurchasePayImpl(ws, proposalId, forceNow),
    onOpErr,
  );
}

async function resetPurchasePayRetry(
  ws: InternalWalletState,
  proposalId: string,
): Promise<void> {
  await ws.db.mutate(Stores.purchases, proposalId, (x) => {
    if (x.payRetryInfo.active) {
      x.payRetryInfo = initRetryInfo();
    }
    return x;
  });
}

async function processPurchasePayImpl(
  ws: InternalWalletState,
  proposalId: string,
  forceNow: boolean,
): Promise<void> {
  if (forceNow) {
    await resetPurchasePayRetry(ws, proposalId);
  }
  const purchase = await ws.db.get(Stores.purchases, proposalId);
  if (!purchase) {
    return;
  }
  if (!purchase.paymentSubmitPending) {
    return;
  }
  logger.trace(`processing purchase pay ${proposalId}`);
  await submitPay(ws, proposalId);
}

export async function refuseProposal(
  ws: InternalWalletState,
  proposalId: string,
): Promise<void> {
  const success = await ws.db.runWithWriteTransaction(
    [Stores.proposals],
    async (tx) => {
      const proposal = await tx.get(Stores.proposals, proposalId);
      if (!proposal) {
        logger.trace(`proposal ${proposalId} not found, won't refuse proposal`);
        return false;
      }
      if (proposal.proposalStatus !== ProposalStatus.PROPOSED) {
        return false;
      }
      proposal.proposalStatus = ProposalStatus.REFUSED;
      await tx.put(Stores.proposals, proposal);
      return true;
    },
  );
  if (success) {
    ws.notify({
      type: NotificationType.ProposalRefused,
    });
  }
}
