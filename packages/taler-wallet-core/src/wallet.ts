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
import { BackupRecovery, codecForAny, TalerErrorCode } from "@gnu-taler/taler-util";
import { CryptoWorkerFactory } from "./crypto/workers/cryptoApi";
import {
  addBackupProvider,
  AddBackupProviderRequest,
  BackupInfo,
  codecForAddBackupProviderRequest,
  exportBackupEncrypted,
  getBackupInfo,
  getBackupRecovery,
  importBackupEncrypted,
  importBackupPlain,
  loadBackupRecovery,
  runBackupCycle,
} from "./operations/backup";
import { exportBackup } from "./operations/backup/export";
import { getBalances } from "./operations/balance";
import {
  createDepositGroup,
  processDepositGroup,
  trackDepositGroup,
} from "./operations/deposits";
import {
  makeErrorDetails,
  OperationFailedAndReportedError,
  OperationFailedError,
} from "./operations/errors";
import {
  acceptExchangeTermsOfService,
  getExchangePaytoUri,
  getExchangeTrust,
  updateExchangeFromUrl,
} from "./operations/exchanges";
import {
  confirmPay,
  preparePayForUri,
  processDownloadProposal,
  processPurchasePay,
  refuseProposal,
} from "./operations/pay";
import { getPendingOperations } from "./operations/pending";
import { processRecoupGroup } from "./operations/recoup";
import {
  autoRefresh,
  createRefreshGroup,
  processRefreshGroup,
} from "./operations/refresh";
import {
  abortFailedPayWithRefund,
  applyRefund,
  processPurchaseQueryRefund,
} from "./operations/refund";
import {
  createReserve,
  createTalerWithdrawReserve,
  forceQueryReserve,
  getFundingPaytoUris,
  processReserve,
} from "./operations/reserves";
import { InternalWalletState } from "./operations/state";
import {
  runIntegrationTest,
  testPay,
  withdrawTestBalance,
} from "./operations/testing";
import { acceptTip, prepareTip, processTip } from "./operations/tip";
import { getTransactions } from "./operations/transactions";
import {
  getExchangeWithdrawalInfo,
  getWithdrawalDetailsForUri,
  processWithdrawGroup,
} from "./operations/withdraw";
import {
  CoinRecord,
  CoinSourceType,
  CurrencyRecord,
  DenominationRecord,
  ExchangeRecord,
  PurchaseRecord,
  RefundState,
  ReserveRecord,
  ReserveRecordStatus,
  Stores,
} from "./db.js";
import { NotificationType, WalletNotification } from "@gnu-taler/taler-util";
import {
  PendingOperationInfo,
  PendingOperationsResponse,
  PendingOperationType,
} from "./pending-types.js";
import { CoinDumpJson } from "@gnu-taler/taler-util";
import {
  codecForTransactionsRequest,
  TransactionsRequest,
  TransactionsResponse,
} from "@gnu-taler/taler-util";
import {
  AcceptManualWithdrawalResult,
  AcceptWithdrawalResponse,
  ApplyRefundResponse,
  BalancesResponse,
  BenchmarkResult,
  codecForAbortPayWithRefundRequest,
  codecForAcceptBankIntegratedWithdrawalRequest,
  codecForAcceptExchangeTosRequest,
  codecForAcceptManualWithdrawalRequet,
  codecForAcceptTipRequest,
  codecForAddExchangeRequest,
  codecForApplyRefundRequest,
  codecForConfirmPayRequest,
  codecForCreateDepositGroupRequest,
  codecForForceExchangeUpdateRequest,
  codecForForceRefreshRequest,
  codecForGetExchangeTosRequest,
  codecForGetWithdrawalDetailsForAmountRequest,
  codecForGetWithdrawalDetailsForUri,
  codecForIntegrationTestArgs,
  codecForPreparePayRequest,
  codecForPrepareTipRequest,
  codecForSetCoinSuspendedRequest,
  codecForTestPayArgs,
  codecForTrackDepositGroupRequest,
  codecForWithdrawTestBalance,
  ConfirmPayResult,
  CoreApiResponse,
  CreateDepositGroupRequest,
  CreateDepositGroupResponse,
  ExchangeListItem,
  ExchangesListRespose,
  GetExchangeTosResult,
  IntegrationTestArgs,
  ManualWithdrawalDetails,
  PreparePayResult,
  PrepareTipResult,
  PurchaseDetails,
  RecoveryLoadRequest,
  RefreshReason,
  ReturnCoinsRequest,
  TestPayArgs,
  TrackDepositGroupRequest,
  TrackDepositGroupResponse,
  WithdrawTestBalanceRequest,
  WithdrawUriInfoResponse,
} from "@gnu-taler/taler-util";
import { AmountJson, Amounts } from "@gnu-taler/taler-util";
import { assertUnreachable } from "./util/assertUnreachable";
import { AsyncOpMemoSingle } from "./util/asyncMemo";
import { HttpRequestLibrary } from "./util/http";
import { Logger } from "./util/logging";
import { AsyncCondition } from "./util/promiseUtils";
import { Database } from "./util/query";
import { Duration, durationMin } from "@gnu-taler/taler-util";
import { TimerGroup } from "./util/timer";

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
  private stopped = false;
  private memoRunRetryLoop = new AsyncOpMemoSingle<void>();

  get db(): Database<typeof Stores> {
    return this.ws.db;
  }

  constructor(
    db: Database<typeof Stores>,
    http: HttpRequestLibrary,
    cryptoWorkerFactory: CryptoWorkerFactory,
  ) {
    this.ws = new InternalWalletState(db, http, cryptoWorkerFactory);
  }

  getExchangePaytoUri(
    exchangeBaseUrl: string,
    supportedTargetTypes: string[],
  ): Promise<string> {
    return getExchangePaytoUri(this.ws, exchangeBaseUrl, supportedTargetTypes);
  }

  async getWithdrawalDetailsForAmount(
    exchangeBaseUrl: string,
    amount: AmountJson,
  ): Promise<ManualWithdrawalDetails> {
    const wi = await getExchangeWithdrawalInfo(
      this.ws,
      exchangeBaseUrl,
      amount,
    );
    const paytoUris = wi.exchangeInfo.wireInfo?.accounts.map(
      (x) => x.payto_uri,
    );
    if (!paytoUris) {
      throw Error("exchange is in invalid state");
    }
    return {
      amountRaw: Amounts.stringify(amount),
      amountEffective: Amounts.stringify(wi.selectedDenoms.totalCoinValue),
      paytoUris,
      tosAccepted: wi.termsOfServiceAccepted,
    };
  }

  addNotificationListener(f: (n: WalletNotification) => void): void {
    this.ws.addNotificationListener(f);
  }

  /**
   * Execute one operation based on the pending operation info record.
   */
  async processOnePendingOperation(
    pending: PendingOperationInfo,
    forceNow = false,
  ): Promise<void> {
    logger.trace(`running pending ${JSON.stringify(pending, undefined, 2)}`);
    switch (pending.type) {
      case PendingOperationType.Bug:
        // Nothing to do, will just be displayed to the user
        return;
      case PendingOperationType.ExchangeUpdate:
        await updateExchangeFromUrl(this.ws, pending.exchangeBaseUrl, forceNow);
        break;
      case PendingOperationType.Refresh:
        await processRefreshGroup(this.ws, pending.refreshGroupId, forceNow);
        break;
      case PendingOperationType.Reserve:
        await processReserve(this.ws, pending.reservePub, forceNow);
        break;
      case PendingOperationType.Withdraw:
        await processWithdrawGroup(
          this.ws,
          pending.withdrawalGroupId,
          forceNow,
        );
        break;
      case PendingOperationType.ProposalChoice:
        // Nothing to do, user needs to accept/reject
        break;
      case PendingOperationType.ProposalDownload:
        await processDownloadProposal(this.ws, pending.proposalId, forceNow);
        break;
      case PendingOperationType.TipChoice:
        // Nothing to do, user needs to accept/reject
        break;
      case PendingOperationType.TipPickup:
        await processTip(this.ws, pending.tipId, forceNow);
        break;
      case PendingOperationType.Pay:
        await processPurchasePay(this.ws, pending.proposalId, forceNow);
        break;
      case PendingOperationType.RefundQuery:
        await processPurchaseQueryRefund(this.ws, pending.proposalId, forceNow);
        break;
      case PendingOperationType.Recoup:
        await processRecoupGroup(this.ws, pending.recoupGroupId, forceNow);
        break;
      case PendingOperationType.ExchangeCheckRefresh:
        await autoRefresh(this.ws, pending.exchangeBaseUrl);
        break;
      case PendingOperationType.Deposit:
        await processDepositGroup(this.ws, pending.depositGroupId);
        break;
      default:
        assertUnreachable(pending);
    }
  }

  /**
   * Process pending operations.
   */
  public async runPending(forceNow = false): Promise<void> {
    const onlyDue = !forceNow;
    const pendingOpsResponse = await this.getPendingOperations({ onlyDue });
    for (const p of pendingOpsResponse.pendingOperations) {
      try {
        await this.processOnePendingOperation(p, forceNow);
      } catch (e) {
        if (e instanceof OperationFailedAndReportedError) {
          console.error(
            "Operation failed:",
            JSON.stringify(e.operationError, undefined, 2),
          );
        } else {
          console.error(e);
        }
      }
    }
  }

  /**
   * Run the wallet until there are no more pending operations that give
   * liveness left.  The wallet will be in a stopped state when this function
   * returns without resolving to an exception.
   */
  public async runUntilDone(
    req: {
      maxRetries?: number;
    } = {},
  ): Promise<void> {
    let done = false;
    const p = new Promise<void>((resolve, reject) => {
      // Monitor for conditions that means we're done or we
      // should quit with an error (due to exceeded retries).
      this.addNotificationListener((n) => {
        if (done) {
          return;
        }
        if (
          n.type === NotificationType.WaitingForRetry &&
          n.numGivingLiveness == 0
        ) {
          done = true;
          logger.trace("no liveness-giving operations left");
          resolve();
        }
        const maxRetries = req.maxRetries;
        if (!maxRetries) {
          return;
        }
        this.getPendingOperations({ onlyDue: false })
          .then((pending) => {
            for (const p of pending.pendingOperations) {
              if (p.retryInfo && p.retryInfo.retryCounter > maxRetries) {
                console.warn(
                  `stopping, as ${maxRetries} retries are exceeded in an operation of type ${p.type}`,
                );
                this.stop();
                done = true;
                resolve();
              }
            }
          })
          .catch((e) => {
            logger.error(e);
            reject(e);
          });
      });
      // Run this asynchronously
      this.runRetryLoop().catch((e) => {
        logger.error("exception in wallet retry loop");
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
    let iteration = 0;
    for (; !this.stopped; iteration++) {
      const pending = await this.getPendingOperations({ onlyDue: true });
      let numDueAndLive = 0;
      for (const p of pending.pendingOperations) {
        if (p.givesLifeness) {
          numDueAndLive++;
        }
      }
      // Make sure that we run tasks that don't give lifeness at least
      // one time.
      if (iteration !== 0 && numDueAndLive === 0) {
        const allPending = await this.getPendingOperations({ onlyDue: false });
        let numPending = 0;
        let numGivingLiveness = 0;
        for (const p of allPending.pendingOperations) {
          numPending++;
          if (p.givesLifeness) {
            numGivingLiveness++;
          }
        }
        let dt: Duration;
        if (
          allPending.pendingOperations.length === 0 ||
          allPending.nextRetryDelay.d_ms === Number.MAX_SAFE_INTEGER
        ) {
          // Wait for 5 seconds
          dt = { d_ms: 5000 };
        } else {
          dt = durationMin({ d_ms: 5000 }, allPending.nextRetryDelay);
        }
        const timeout = this.timerGroup.resolveAfter(dt);
        this.ws.notify({
          type: NotificationType.WaitingForRetry,
          numGivingLiveness,
          numPending,
        });
        await Promise.race([timeout, this.latch.wait()]);
      } else {
        // FIXME: maybe be a bit smarter about executing these
        // operations in parallel?
        logger.trace(
          `running ${pending.pendingOperations.length} pending operations`,
        );
        for (const p of pending.pendingOperations) {
          try {
            await this.processOnePendingOperation(p);
          } catch (e) {
            if (e instanceof OperationFailedAndReportedError) {
              logger.warn("operation processed resulted in reported error");
            } else {
              logger.error("Uncaught exception", e);
              this.ws.notify({
                type: NotificationType.InternalError,
                message: "uncaught exception",
                exception: e,
              });
            }
          }
          this.ws.notify({
            type: NotificationType.PendingOperationProcessed,
          });
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
  async fillDefaults(): Promise<void> {
    await this.db.runWithWriteTransaction(
      [Stores.config, Stores.currencies],
      async (tx) => {
        let applied = false;
        await tx.iter(Stores.config).forEach((x) => {
          if (x.key == "currencyDefaultsApplied" && x.value == true) {
            applied = true;
          }
        });
        if (!applied) {
          for (const c of builtinCurrencies) {
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
  async preparePayForUri(talerPayUri: string): Promise<PreparePayResult> {
    return preparePayForUri(this.ws, talerPayUri);
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
  async acceptManualWithdrawal(
    exchangeBaseUrl: string,
    amount: AmountJson,
  ): Promise<AcceptManualWithdrawalResult> {
    try {
      const resp = await createReserve(this.ws, {
        amount,
        exchange: exchangeBaseUrl,
      });
      const exchangePaytoUris = await this.db.runWithReadTransaction(
        [Stores.exchanges, Stores.reserves],
        (tx) => getFundingPaytoUris(tx, resp.reservePub),
      );
      return {
        reservePub: resp.reservePub,
        exchangePaytoUris,
      };
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

  async getWithdrawalDetailsForUri(
    talerWithdrawUri: string,
  ): Promise<WithdrawUriInfoResponse> {
    return getWithdrawalDetailsForUri(this.ws, talerWithdrawUri);
  }

  /**
   * Update or add exchange DB entry by fetching the /keys and /wire information.
   * Optionally link the reserve entry to the new or existing
   * exchange entry in then DB.
   */
  async updateExchangeFromUrl(
    baseUrl: string,
    force = false,
  ): Promise<ExchangeRecord> {
    try {
      return updateExchangeFromUrl(this.ws, baseUrl, force);
    } finally {
      this.latch.trigger();
    }
  }

  async getExchangeTos(exchangeBaseUrl: string): Promise<GetExchangeTosResult> {
    const exchange = await this.updateExchangeFromUrl(exchangeBaseUrl);
    const tos = exchange.termsOfServiceText;
    const currentEtag = exchange.termsOfServiceLastEtag;
    if (!tos || !currentEtag) {
      throw Error("exchange is in invalid state");
    }
    return {
      acceptedEtag: exchange.termsOfServiceAcceptedEtag,
      currentEtag,
      tos,
    };
  }

  /**
   * Get detailed balance information, sliced by exchange and by currency.
   */
  async getBalances(): Promise<BalancesResponse> {
    return this.ws.memoGetBalance.memo(() => getBalances(this.ws));
  }

  async refresh(oldCoinPub: string): Promise<void> {
    try {
      const refreshGroupId = await this.db.runWithWriteTransaction(
        [Stores.refreshGroups, Stores.denominations, Stores.coins],
        async (tx) => {
          return await createRefreshGroup(
            this.ws,
            tx,
            [{ coinPub: oldCoinPub }],
            RefreshReason.Manual,
          );
        },
      );
      await processRefreshGroup(this.ws, refreshGroupId.refreshGroupId);
    } catch (e) {
      this.latch.trigger();
    }
  }

  async findExchange(
    exchangeBaseUrl: string,
  ): Promise<ExchangeRecord | undefined> {
    return await this.db.get(Stores.exchanges, exchangeBaseUrl);
  }

  async getPendingOperations({
    onlyDue = false,
  } = {}): Promise<PendingOperationsResponse> {
    return this.ws.memoGetPending.memo(() =>
      getPendingOperations(this.ws, { onlyDue }),
    );
  }

  async acceptExchangeTermsOfService(
    exchangeBaseUrl: string,
    etag: string | undefined,
  ): Promise<void> {
    return acceptExchangeTermsOfService(this.ws, exchangeBaseUrl, etag);
  }

  async getDenoms(exchangeUrl: string): Promise<DenominationRecord[]> {
    const denoms = await this.db
      .iterIndex(Stores.denominations.exchangeBaseUrlIndex, exchangeUrl)
      .toArray();
    return denoms;
  }

  /**
   * Get all exchanges known to the exchange.
   *
   * @deprecated Use getExchanges instead
   */
  async getExchangeRecords(): Promise<ExchangeRecord[]> {
    return await this.db.iter(Stores.exchanges).toArray();
  }

  async getExchanges(): Promise<ExchangesListRespose> {
    const exchanges: (ExchangeListItem | undefined)[] = await this.db
      .iter(Stores.exchanges)
      .map((x) => {
        const details = x.details;
        if (!details) {
          return undefined;
        }
        if (!x.addComplete) {
          return undefined;
        }
        if (!x.wireInfo) {
          return undefined;
        }
        return {
          exchangeBaseUrl: x.baseUrl,
          currency: details.currency,
          paytoUris: x.wireInfo.accounts.map((x) => x.payto_uri),
        };
      });
    return {
      exchanges: exchanges.filter((x) => !!x) as ExchangeListItem[],
    };
  }

  async getCurrencies(): Promise<CurrencyRecord[]> {
    return await this.db.iter(Stores.currencies).toArray();
  }

  async updateCurrency(currencyRecord: CurrencyRecord): Promise<void> {
    logger.trace("updating currency to", currencyRecord);
    await this.db.put(Stores.currencies, currencyRecord);
  }

  async getReserves(exchangeBaseUrl?: string): Promise<ReserveRecord[]> {
    if (exchangeBaseUrl) {
      return await this.db
        .iter(Stores.reserves)
        .filter((r) => r.exchangeBaseUrl === exchangeBaseUrl);
    } else {
      return await this.db.iter(Stores.reserves).toArray();
    }
  }

  async getCoinsForExchange(exchangeBaseUrl: string): Promise<CoinRecord[]> {
    return await this.db
      .iter(Stores.coins)
      .filter((c) => c.exchangeBaseUrl === exchangeBaseUrl);
  }

  async getCoins(): Promise<CoinRecord[]> {
    return await this.db.iter(Stores.coins).toArray();
  }

  /**
   * Stop ongoing processing.
   */
  stop(): void {
    this.stopped = true;
    this.timerGroup.stopCurrentAndFutureTimers();
    this.ws.cryptoApi.stop();
  }

  /**
   * Trigger paying coins back into the user's account.
   */
  async returnCoins(req: ReturnCoinsRequest): Promise<void> {
    throw Error("not implemented");
  }

  /**
   * Accept a refund, return the contract hash for the contract
   * that was involved in the refund.
   */
  async applyRefund(talerRefundUri: string): Promise<ApplyRefundResponse> {
    return applyRefund(this.ws, talerRefundUri);
  }

  async getPurchase(
    contractTermsHash: string,
  ): Promise<PurchaseRecord | undefined> {
    return this.db.get(Stores.purchases, contractTermsHash);
  }

  async acceptTip(talerTipUri: string): Promise<void> {
    try {
      return acceptTip(this.ws, talerTipUri);
    } catch (e) {
      this.latch.trigger();
    }
  }

  async prepareTip(talerTipUri: string): Promise<PrepareTipResult> {
    return prepareTip(this.ws, talerTipUri);
  }

  async abortFailedPayWithRefund(proposalId: string): Promise<void> {
    return abortFailedPayWithRefund(this.ws, proposalId);
  }

  /**
   * Inform the wallet that the status of a reserve has changed (e.g. due to a
   * confirmation from the bank.).
   */
  public async handleNotifyReserve(): Promise<void> {
    const reserves = await this.db.iter(Stores.reserves).toArray();
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
  async collectGarbage(): Promise<void> {
    // FIXME(#5845)
    // We currently do not garbage-collect the wallet database.  This might change
    // after the feature has been properly re-designed, and we have come up with a
    // strategy to test it.
  }

  async acceptWithdrawal(
    talerWithdrawUri: string,
    selectedExchange: string,
  ): Promise<AcceptWithdrawalResponse> {
    try {
      return createTalerWithdrawReserve(
        this.ws,
        talerWithdrawUri,
        selectedExchange,
      );
    } finally {
      this.latch.trigger();
    }
  }

  async updateReserve(reservePub: string): Promise<ReserveRecord | undefined> {
    await forceQueryReserve(this.ws, reservePub);
    return await this.ws.db.get(Stores.reserves, reservePub);
  }

  async getReserve(reservePub: string): Promise<ReserveRecord | undefined> {
    return await this.ws.db.get(Stores.reserves, reservePub);
  }

  async refuseProposal(proposalId: string): Promise<void> {
    return refuseProposal(this.ws, proposalId);
  }

  async getPurchaseDetails(proposalId: string): Promise<PurchaseDetails> {
    const purchase = await this.db.get(Stores.purchases, proposalId);
    if (!purchase) {
      throw Error("unknown purchase");
    }
    const refundsDoneAmounts = Object.values(purchase.refunds)
      .filter((x) => x.type === RefundState.Applied)
      .map((x) => x.refundAmount);

    const refundsPendingAmounts = Object.values(purchase.refunds)
      .filter((x) => x.type === RefundState.Pending)
      .map((x) => x.refundAmount);
    const totalRefundAmount = Amounts.sum([
      ...refundsDoneAmounts,
      ...refundsPendingAmounts,
    ]).amount;
    const refundsDoneFees = Object.values(purchase.refunds)
      .filter((x) => x.type === RefundState.Applied)
      .map((x) => x.refundFee);
    const refundsPendingFees = Object.values(purchase.refunds)
      .filter((x) => x.type === RefundState.Pending)
      .map((x) => x.refundFee);
    const totalRefundFees = Amounts.sum([
      ...refundsDoneFees,
      ...refundsPendingFees,
    ]).amount;
    const totalFees = totalRefundFees;
    return {
      contractTerms: JSON.parse(purchase.download.contractTermsRaw),
      hasRefund: purchase.timestampLastRefundStatus !== undefined,
      totalRefundAmount: totalRefundAmount,
      totalRefundAndRefreshFees: totalFees,
    };
  }

  benchmarkCrypto(repetitions: number): Promise<BenchmarkResult> {
    return this.ws.cryptoApi.benchmark(repetitions);
  }

  async setCoinSuspended(coinPub: string, suspended: boolean): Promise<void> {
    await this.db.runWithWriteTransaction([Stores.coins], async (tx) => {
      const c = await tx.get(Stores.coins, coinPub);
      if (!c) {
        logger.warn(`coin ${coinPub} not found, won't suspend`);
        return;
      }
      c.suspended = suspended;
      await tx.put(Stores.coins, c);
    });
  }

  /**
   * Dump the public information of coins we have in an easy-to-process format.
   */
  async dumpCoins(): Promise<CoinDumpJson> {
    const coins = await this.db.iter(Stores.coins).toArray();
    const coinsJson: CoinDumpJson = { coins: [] };
    for (const c of coins) {
      const denom = await this.db.get(Stores.denominations, [
        c.exchangeBaseUrl,
        c.denomPubHash,
      ]);
      if (!denom) {
        console.error("no denom session found for coin");
        continue;
      }
      const cs = c.coinSource;
      let refreshParentCoinPub: string | undefined;
      if (cs.type == CoinSourceType.Refresh) {
        refreshParentCoinPub = cs.oldCoinPub;
      }
      let withdrawalReservePub: string | undefined;
      if (cs.type == CoinSourceType.Withdraw) {
        const ws = await this.db.get(
          Stores.withdrawalGroups,
          cs.withdrawalGroupId,
        );
        if (!ws) {
          console.error("no withdrawal session found for coin");
          continue;
        }
        withdrawalReservePub = ws.reservePub;
      }
      coinsJson.coins.push({
        coin_pub: c.coinPub,
        denom_pub: c.denomPub,
        denom_pub_hash: c.denomPubHash,
        denom_value: Amounts.stringify(denom.value),
        exchange_base_url: c.exchangeBaseUrl,
        refresh_parent_coin_pub: refreshParentCoinPub,
        remaining_value: Amounts.stringify(c.currentAmount),
        withdrawal_reserve_pub: withdrawalReservePub,
        coin_suspended: c.suspended,
      });
    }
    return coinsJson;
  }

  async getTransactions(
    request: TransactionsRequest,
  ): Promise<TransactionsResponse> {
    return getTransactions(this.ws, request);
  }

  async withdrawTestBalance(req: WithdrawTestBalanceRequest): Promise<void> {
    await withdrawTestBalance(
      this.ws,
      req.amount,
      req.bankBaseUrl,
      req.exchangeBaseUrl,
    );
  }

  async runIntegrationtest(args: IntegrationTestArgs): Promise<void> {
    return runIntegrationTest(this.ws.http, this, args);
  }

  async testPay(args: TestPayArgs) {
    return testPay(this.ws.http, this, args);
  }

  async exportBackupPlain() {
    return exportBackup(this.ws);
  }

  async importBackupPlain(backup: any) {
    return importBackupPlain(this.ws, backup);
  }

  async exportBackupEncrypted() {
    return exportBackupEncrypted(this.ws);
  }

  async importBackupEncrypted(backup: Uint8Array) {
    return importBackupEncrypted(this.ws, backup);
  }

  async getBackupRecovery(): Promise<BackupRecovery> {
    return getBackupRecovery(this.ws);
  }

  async loadBackupRecovery(req: RecoveryLoadRequest): Promise<void> {
    return loadBackupRecovery(this.ws, req);
  }

  async addBackupProvider(req: AddBackupProviderRequest): Promise<void> {
    return addBackupProvider(this.ws, req);
  }

  async createDepositGroup(
    req: CreateDepositGroupRequest,
  ): Promise<CreateDepositGroupResponse> {
    return createDepositGroup(this.ws, req);
  }

  async runBackupCycle(): Promise<void> {
    return runBackupCycle(this.ws);
  }

  async getBackupStatus(): Promise<BackupInfo> {
    return getBackupInfo(this.ws);
  }

  async trackDepositGroup(
    req: TrackDepositGroupRequest,
  ): Promise<TrackDepositGroupResponse> {
    return trackDepositGroup(this.ws, req);
  }

  /**
   * Implementation of the "wallet-core" API.
   */
  private async dispatchRequestInternal(
    operation: string,
    payload: unknown,
  ): Promise<Record<string, any>> {
    switch (operation) {
      case "withdrawTestkudos": {
        await this.withdrawTestBalance({
          amount: "TESTKUDOS:10",
          bankBaseUrl: "https://bank.test.taler.net/",
          exchangeBaseUrl: "https://exchange.test.taler.net/",
        });
        return {};
      }
      case "withdrawTestBalance": {
        const req = codecForWithdrawTestBalance().decode(payload);
        await this.withdrawTestBalance(req);
        return {};
      }
      case "runIntegrationTest": {
        const req = codecForIntegrationTestArgs().decode(payload);
        await this.runIntegrationtest(req);
        return {};
      }
      case "testPay": {
        const req = codecForTestPayArgs().decode(payload);
        await this.testPay(req);
        return {};
      }
      case "getTransactions": {
        const req = codecForTransactionsRequest().decode(payload);
        return await this.getTransactions(req);
      }
      case "addExchange": {
        const req = codecForAddExchangeRequest().decode(payload);
        await this.updateExchangeFromUrl(req.exchangeBaseUrl);
        return {};
      }
      case "forceUpdateExchange": {
        const req = codecForForceExchangeUpdateRequest().decode(payload);
        await this.updateExchangeFromUrl(req.exchangeBaseUrl, true);
        return {};
      }
      case "listExchanges": {
        return await this.getExchanges();
      }
      case "getWithdrawalDetailsForUri": {
        const req = codecForGetWithdrawalDetailsForUri().decode(payload);
        return await this.getWithdrawalDetailsForUri(req.talerWithdrawUri);
      }
      case "acceptManualWithdrawal": {
        const req = codecForAcceptManualWithdrawalRequet().decode(payload);
        const res = await this.acceptManualWithdrawal(
          req.exchangeBaseUrl,
          Amounts.parseOrThrow(req.amount),
        );
        return res;
      }
      case "getWithdrawalDetailsForAmount": {
        const req = codecForGetWithdrawalDetailsForAmountRequest().decode(
          payload,
        );
        return await this.getWithdrawalDetailsForAmount(
          req.exchangeBaseUrl,
          Amounts.parseOrThrow(req.amount),
        );
      }
      case "getBalances": {
        return await this.getBalances();
      }
      case "getPendingOperations": {
        return await this.getPendingOperations();
      }
      case "setExchangeTosAccepted": {
        const req = codecForAcceptExchangeTosRequest().decode(payload);
        await this.acceptExchangeTermsOfService(req.exchangeBaseUrl, req.etag);
        return {};
      }
      case "applyRefund": {
        const req = codecForApplyRefundRequest().decode(payload);
        return await this.applyRefund(req.talerRefundUri);
      }
      case "acceptBankIntegratedWithdrawal": {
        const req = codecForAcceptBankIntegratedWithdrawalRequest().decode(
          payload,
        );
        return await this.acceptWithdrawal(
          req.talerWithdrawUri,
          req.exchangeBaseUrl,
        );
      }
      case "getExchangeTos": {
        const req = codecForGetExchangeTosRequest().decode(payload);
        return this.getExchangeTos(req.exchangeBaseUrl);
      }
      case "retryPendingNow": {
        await this.runPending(true);
        return {};
      }
      case "preparePay": {
        const req = codecForPreparePayRequest().decode(payload);
        return await this.preparePayForUri(req.talerPayUri);
      }
      case "confirmPay": {
        const req = codecForConfirmPayRequest().decode(payload);
        return await this.confirmPay(req.proposalId, req.sessionId);
      }
      case "abortFailedPayWithRefund": {
        const req = codecForAbortPayWithRefundRequest().decode(payload);
        await this.abortFailedPayWithRefund(req.proposalId);
        return {};
      }
      case "dumpCoins": {
        return await this.dumpCoins();
      }
      case "setCoinSuspended": {
        const req = codecForSetCoinSuspendedRequest().decode(payload);
        await this.setCoinSuspended(req.coinPub, req.suspended);
        return {};
      }
      case "forceRefresh": {
        const req = codecForForceRefreshRequest().decode(payload);
        const coinPubs = req.coinPubList.map((x) => ({ coinPub: x }));
        const refreshGroupId = await this.db.runWithWriteTransaction(
          [Stores.refreshGroups, Stores.denominations, Stores.coins],
          async (tx) => {
            return await createRefreshGroup(
              this.ws,
              tx,
              coinPubs,
              RefreshReason.Manual,
            );
          },
        );
        return {
          refreshGroupId,
        };
      }
      case "prepareTip": {
        const req = codecForPrepareTipRequest().decode(payload);
        return await this.prepareTip(req.talerTipUri);
      }
      case "acceptTip": {
        const req = codecForAcceptTipRequest().decode(payload);
        await this.acceptTip(req.walletTipId);
        return {};
      }
      case "exportBackup": {
        return exportBackup(this.ws);
      }
      case "addBackupProvider": {
        const req = codecForAddBackupProviderRequest().decode(payload);
        await addBackupProvider(this.ws, req);
        return {};
      }
      case "runBackupCycle": {
        await runBackupCycle(this.ws);
        return {};
      }
      case "exportBackupRecovery": {
        const resp = await getBackupRecovery(this.ws);
        return resp;
      }
      case "importBackupRecovery": {
        const req = codecForAny().decode(payload);
        await loadBackupRecovery(this.ws, req);
        return {};
      }
      case "getBackupInfo": {
        const resp = await getBackupInfo(this.ws);
        return resp;
      }
      case "createDepositGroup": {
        const req = codecForCreateDepositGroupRequest().decode(payload);
        return await createDepositGroup(this.ws, req);
      }
      case "trackDepositGroup":
        const req = codecForTrackDepositGroupRequest().decode(payload);
        return trackDepositGroup(this.ws, req);
    }
    throw OperationFailedError.fromCode(
      TalerErrorCode.WALLET_CORE_API_OPERATION_UNKNOWN,
      "unknown operation",
      {
        operation,
      },
    );
  }

  /**
   * Handle a request to the wallet-core API.
   */
  async handleCoreApiRequest(
    operation: string,
    id: string,
    payload: unknown,
  ): Promise<CoreApiResponse> {
    try {
      const result = await this.dispatchRequestInternal(operation, payload);
      return {
        type: "response",
        operation,
        id,
        result,
      };
    } catch (e) {
      if (
        e instanceof OperationFailedError ||
        e instanceof OperationFailedAndReportedError
      ) {
        return {
          type: "error",
          operation,
          id,
          error: e.operationError,
        };
      } else {
        return {
          type: "error",
          operation,
          id,
          error: makeErrorDetails(
            TalerErrorCode.WALLET_UNEXPECTED_EXCEPTION,
            `unexpected exception: ${e}`,
            {},
          ),
        };
      }
    }
  }
}
