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
 * Test harness for various GNU Taler components.
 * Also provides a fault-injection proxy.
 *
 * @author Florian Dold <dold@taler.net>
 */

/**
 * Imports
 */
import * as util from "util";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as http from "http";
import { ChildProcess, spawn } from "child_process";
import {
  Configuration,
  walletCoreApi,
  codec,
  AmountJson,
  Amounts,
} from "taler-wallet-core";
import { URL } from "url";
import axios from "axios";
import { talerCrypto, time } from "taler-wallet-core";
import {
  codecForMerchantOrderPrivateStatusResponse,
  codecForPostOrderResponse,
  PostOrderRequest,
  PostOrderResponse,
} from "./merchantApiTypes";
import { EddsaKeyPair } from "taler-wallet-core/lib/crypto/talerCrypto";

const exec = util.promisify(require("child_process").exec);

export async function delayMs(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}

interface WaitResult {
  code: number | null;
  signal: NodeJS.Signals | null;
}

/**
 * Run a shell command, return stdout.
 */
export async function sh(
  t: GlobalTestState,
  logName: string,
  command: string,
): Promise<string> {
  console.log("runing command", command);
  return new Promise((resolve, reject) => {
    const stdoutChunks: Buffer[] = [];
    const proc = spawn(command, {
      stdio: ["inherit", "pipe", "pipe"],
      shell: true,
    });
    proc.stdout.on("data", (x) => {
      if (x instanceof Buffer) {
        stdoutChunks.push(x);
      } else {
        throw Error("unexpected data chunk type");
      }
    });
    const stderrLogFileName = path.join(t.testDir, `${logName}-stderr.log`);
    const stderrLog = fs.createWriteStream(stderrLogFileName, {
      flags: "a",
    });
    proc.stderr.pipe(stderrLog);
    proc.on("exit", (code, signal) => {
      console.log(`child process exited (${code} / ${signal})`);
      if (code != 0) {
        reject(Error(`Unexpected exit code ${code} for '${command}'`));
        return;
      }
      const b = Buffer.concat(stdoutChunks).toString("utf-8");
      resolve(b);
    });
    proc.on("error", () => {
      reject(Error("Child process had error"));
    });
  });
}

export class ProcessWrapper {
  private waitPromise: Promise<WaitResult>;
  constructor(public proc: ChildProcess) {
    this.waitPromise = new Promise((resolve, reject) => {
      proc.on("exit", (code, signal) => {
        resolve({ code, signal });
      });
      proc.on("error", (err) => {
        reject(err);
      });
    });
  }

  wait(): Promise<WaitResult> {
    return this.waitPromise;
  }
}

interface CoinConfig {
  name: string;
  value: string;
  durationWithdraw: string;
  durationSpend: string;
  durationLegal: string;
  feeWithdraw: string;
  feeDeposit: string;
  feeRefresh: string;
  feeRefund: string;
  rsaKeySize: number;
}

const coinCommon = {
  durationLegal: "3 years",
  durationSpend: "2 years",
  durationWithdraw: "7 days",
  rsaKeySize: 1024,
};

export const coin_ct1 = (curr: string): CoinConfig => ({
  ...coinCommon,
  name: `${curr}_ct1`,
  value: `${curr}:0.01`,
  feeDeposit: `${curr}:0.00`,
  feeRefresh: `${curr}:0.01`,
  feeRefund: `${curr}:0.00`,
  feeWithdraw: `${curr}:0.01`,
});

export const coin_ct10 = (curr: string): CoinConfig => ({
  ...coinCommon,
  name: `${curr}_ct10`,
  value: `${curr}:0.10`,
  feeDeposit: `${curr}:0.01`,
  feeRefresh: `${curr}:0.01`,
  feeRefund: `${curr}:0.00`,
  feeWithdraw: `${curr}:0.01`,
});

export const coin_u1 = (curr: string): CoinConfig => ({
  ...coinCommon,
  name: `${curr}_u1`,
  value: `${curr}:1`,
  feeDeposit: `${curr}:0.02`,
  feeRefresh: `${curr}:0.02`,
  feeRefund: `${curr}:0.02`,
  feeWithdraw: `${curr}:0.02`,
});

export const coin_u2 = (curr: string): CoinConfig => ({
  ...coinCommon,
  name: `${curr}_u2`,
  value: `${curr}:2`,
  feeDeposit: `${curr}:0.02`,
  feeRefresh: `${curr}:0.02`,
  feeRefund: `${curr}:0.02`,
  feeWithdraw: `${curr}:0.02`,
});

export const coin_u4 = (curr: string): CoinConfig => ({
  ...coinCommon,
  name: `${curr}_u4`,
  value: `${curr}:4`,
  feeDeposit: `${curr}:0.02`,
  feeRefresh: `${curr}:0.02`,
  feeRefund: `${curr}:0.02`,
  feeWithdraw: `${curr}:0.02`,
});

export const coin_u8 = (curr: string): CoinConfig => ({
  ...coinCommon,
  name: `${curr}_u8`,
  value: `${curr}:8`,
  feeDeposit: `${curr}:0.16`,
  feeRefresh: `${curr}:0.16`,
  feeRefund: `${curr}:0.16`,
  feeWithdraw: `${curr}:0.16`,
});

const coin_u10 = (curr: string): CoinConfig => ({
  ...coinCommon,
  name: `${curr}_u10`,
  value: `${curr}:10`,
  feeDeposit: `${curr}:0.2`,
  feeRefresh: `${curr}:0.2`,
  feeRefund: `${curr}:0.2`,
  feeWithdraw: `${curr}:0.2`,
});

export class GlobalTestParams {
  testDir: string;
}

export class GlobalTestState {
  testDir: string;
  procs: ProcessWrapper[];
  servers: http.Server[];
  inShutdown: boolean = false;
  constructor(params: GlobalTestParams) {
    this.testDir = params.testDir;
    this.procs = [];
    this.servers = [];

    process.on("SIGINT", () => this.shutdownSync());
    process.on("SIGTERM", () => this.shutdownSync());
    process.on("unhandledRejection", () => this.shutdownSync());
    process.on("uncaughtException", () => this.shutdownSync());
  }

  assertTrue(b: boolean): asserts b {
    if (!b) {
      throw Error("test assertion failed");
    }
  }

  assertAmountEquals(
    amtExpected: string | AmountJson,
    amtActual: string | AmountJson,
  ): void {
    let ja1: AmountJson;
    let ja2: AmountJson;
    if (typeof amtExpected === "string") {
      ja1 = Amounts.parseOrThrow(amtExpected);
    } else {
      ja1 = amtExpected;
    }
    if (typeof amtActual === "string") {
      ja2 = Amounts.parseOrThrow(amtActual);
    } else {
      ja2 = amtActual;
    }

    if (Amounts.cmp(ja1, ja2) != 0) {
      throw Error(
        `test assertion failed: expected ${Amounts.stringify(
          ja1,
        )} but got ${Amounts.stringify(ja2)}`,
      );
    }
  }

  private shutdownSync(): void {
    for (const s of this.servers) {
      s.close();
      s.removeAllListeners();
    }
    for (const p of this.procs) {
      if (p.proc.exitCode == null) {
        p.proc.kill("SIGTERM");
      } else {
      }
    }
    console.log("*** test harness interrupted");
    console.log("*** test state can be found under", this.testDir);
    process.exit(1);
  }

  spawnService(
    command: string,
    args: string[],
    logName: string,
  ): ProcessWrapper {
    console.log(`spawning process (${command})`);
    const proc = spawn(command, args, {
      stdio: ["inherit", "pipe", "pipe"],
    });
    console.log(`spawned process (${logName}) with pid ${proc.pid}`);
    proc.on("error", (err) => {
      console.log(`could not start process (${command})`, err);
    });
    proc.on("exit", (code, signal) => {
      console.log(`process ${logName} exited`);
    });
    const stderrLogFileName = this.testDir + `/${logName}-stderr.log`;
    const stderrLog = fs.createWriteStream(stderrLogFileName, {
      flags: "a",
    });
    proc.stderr.pipe(stderrLog);
    const stdoutLogFileName = this.testDir + `/${logName}-stdout.log`;
    const stdoutLog = fs.createWriteStream(stdoutLogFileName, {
      flags: "a",
    });
    proc.stdout.pipe(stdoutLog);
    const procWrap = new ProcessWrapper(proc);
    this.procs.push(procWrap);
    return procWrap;
  }

  async shutdown(): Promise<void> {
    if (this.inShutdown) {
      return;
    }
    this.inShutdown = true;
    console.log("shutting down");
    if (shouldLingerAlways()) {
      console.log("*** test finished, but requested to linger");
      console.log("*** test state can be found under", this.testDir);
      return;
    }
    for (const s of this.servers) {
      s.close();
      s.removeAllListeners();
    }
    for (const p of this.procs) {
      if (p.proc.exitCode == null) {
        console.log("killing process", p.proc.pid);
        p.proc.kill("SIGTERM");
        await p.wait();
      }
    }
  }
}

export interface TalerConfigSection {
  options: Record<string, string | undefined>;
}

export interface TalerConfig {
  sections: Record<string, TalerConfigSection>;
}

export interface DbInfo {
  connStr: string;
  dbname: string;
}

export async function setupDb(gc: GlobalTestState): Promise<DbInfo> {
  const dbname = "taler-integrationtest";
  await exec(`dropdb "${dbname}" || true`);
  await exec(`createdb "${dbname}"`);
  return {
    connStr: `postgres:///${dbname}`,
    dbname,
  };
}

export interface BankConfig {
  currency: string;
  httpPort: number;
  database: string;
  allowRegistrations: boolean;
}

function setPaths(config: Configuration, home: string) {
  config.setString("paths", "taler_home", home);
  config.setString(
    "paths",
    "taler_data_home",
    "$TALER_HOME/.local/share/taler/",
  );
  config.setString("paths", "taler_config_home", "$TALER_HOME/.config/taler/");
  config.setString("paths", "taler_cache_home", "$TALER_HOME/.config/taler/");
  config.setString(
    "paths",
    "taler_runtime_dir",
    "${TMPDIR:-${TMP:-/tmp}}/taler-system-runtime/",
  );
}

function setCoin(config: Configuration, c: CoinConfig) {
  const s = `coin_${c.name}`;
  config.setString(s, "value", c.value);
  config.setString(s, "duration_withdraw", c.durationWithdraw);
  config.setString(s, "duration_spend", c.durationSpend);
  config.setString(s, "duration_legal", c.durationLegal);
  config.setString(s, "fee_deposit", c.feeDeposit);
  config.setString(s, "fee_withdraw", c.feeWithdraw);
  config.setString(s, "fee_refresh", c.feeRefresh);
  config.setString(s, "fee_refund", c.feeRefund);
  config.setString(s, "rsa_keysize", `${c.rsaKeySize}`);
}

async function pingProc(
  proc: ProcessWrapper | undefined,
  url: string,
  serviceName: string,
): Promise<void> {
  if (!proc || proc.proc.exitCode !== null) {
    throw Error(`service process ${serviceName} not started, can't ping`);
  }
  while (true) {
    try {
      console.log(`pinging ${serviceName}`);
      const resp = await axios.get(url);
      console.log(`service ${serviceName} available`);
      return;
    } catch (e) {
      console.log(`service ${serviceName} not ready:`, e.toString());
      await delayMs(1000);
    }
    if (!proc || proc.proc.exitCode !== null) {
      throw Error(`service process ${serviceName} stopped unexpectedly`);
    }
  }
}

export interface ExchangeBankAccount {
  accountName: string;
  accountPassword: string;
  accountPaytoUri: string;
  wireGatewayApiBaseUrl: string;
}

export class BankService {
  proc: ProcessWrapper | undefined;

  static fromExistingConfig(gc: GlobalTestState): BankService {
    const cfgFilename = gc.testDir + "/bank.conf";
    console.log("reading bank config from", cfgFilename);
    const config = Configuration.load(cfgFilename);
    const bc: BankConfig = {
      allowRegistrations: config
        .getYesNo("bank", "allow_registrations")
        .required(),
      currency: config.getString("taler", "currency").required(),
      database: config.getString("bank", "database").required(),
      httpPort: config.getNumber("bank", "http_port").required(),
    };
    return new BankService(gc, bc, cfgFilename);
  }

  static async create(
    gc: GlobalTestState,
    bc: BankConfig,
  ): Promise<BankService> {
    const config = new Configuration();
    setPaths(config, gc.testDir + "/talerhome");
    config.setString("taler", "currency", bc.currency);
    config.setString("bank", "database", bc.database);
    config.setString("bank", "http_port", `${bc.httpPort}`);
    config.setString("bank", "max_debt_bank", `${bc.currency}:999999`);
    config.setString(
      "bank",
      "allow_registrations",
      bc.allowRegistrations ? "yes" : "no",
    );
    const cfgFilename = gc.testDir + "/bank.conf";
    config.write(cfgFilename);

    await sh(
      gc,
      "taler-bank-manage_django",
      `taler-bank-manage -c '${cfgFilename}' django migrate`,
    );
    await sh(
      gc,
      "taler-bank-manage_django",
      `taler-bank-manage -c '${cfgFilename}' django provide_accounts`,
    );

    return new BankService(gc, bc, cfgFilename);
  }

  setSuggestedExchange(e: ExchangeService, exchangePayto: string) {
    const config = Configuration.load(this.configFile);
    config.setString("bank", "suggested_exchange", e.baseUrl);
    config.setString("bank", "suggested_exchange_payto", exchangePayto);
  }

  async createExchangeAccount(
    accountName: string,
    password: string,
  ): Promise<ExchangeBankAccount> {
    await sh(
      this.globalTestState,
      "taler-bank-manage_django",
      `taler-bank-manage -c '${this.configFile}' django add_bank_account ${accountName}`,
    );
    await sh(
      this.globalTestState,
      "taler-bank-manage_django",
      `taler-bank-manage -c '${this.configFile}' django changepassword_unsafe ${accountName} ${password}`,
    );
    await sh(
      this.globalTestState,
      "taler-bank-manage_django",
      `taler-bank-manage -c '${this.configFile}' django top_up ${accountName} ${this.bankConfig.currency}:100000`,
    );
    return {
      accountName: accountName,
      accountPassword: password,
      accountPaytoUri: `payto://x-taler-bank/${accountName}`,
      wireGatewayApiBaseUrl: `http://localhost:${this.bankConfig.httpPort}/taler-wire-gateway/${accountName}/`,
    };
  }

  get port() {
    return this.bankConfig.httpPort;
  }

  private constructor(
    private globalTestState: GlobalTestState,
    private bankConfig: BankConfig,
    private configFile: string,
  ) {}

  async start(): Promise<void> {
    this.proc = this.globalTestState.spawnService(
      "taler-bank-manage",
      ["-c", this.configFile, "serve-http"],
      "bank",
    );
  }

  async pingUntilAvailable(): Promise<void> {
    const url = `http://localhost:${this.bankConfig.httpPort}/config`;
    await pingProc(this.proc, url, "bank");
  }

  async createAccount(username: string, password: string): Promise<void> {
    const url = `http://localhost:${this.bankConfig.httpPort}/testing/register`;
    await axios.post(url, {
      username,
      password,
    });
  }

  async createRandomBankUser(): Promise<BankUser> {
    const username =
      "user-" + talerCrypto.encodeCrock(talerCrypto.getRandomBytes(10));
    const bankUser: BankUser = {
      username,
      password: "pw-" + talerCrypto.encodeCrock(talerCrypto.getRandomBytes(10)),
      accountPaytoUri: `payto://x-taler-bank/localhost/${username}`,
    };
    await this.createAccount(bankUser.username, bankUser.password);
    return bankUser;
  }

  async createWithdrawalOperation(
    bankUser: BankUser,
    amount: string,
  ): Promise<WithdrawalOperationInfo> {
    const url = `http://localhost:${this.bankConfig.httpPort}/accounts/${bankUser.username}/withdrawals`;
    const resp = await axios.post(
      url,
      {
        amount,
      },
      {
        auth: bankUser,
      },
    );
    return codecForWithdrawalOperationInfo().decode(resp.data);
  }

  async adminAddIncoming(params: {
    exchangeBankAccount: ExchangeBankAccount;
    amount: string;
    reservePub: string;
    debitAccountPayto: string;
  }) {
    const url = `http://localhost:${this.bankConfig.httpPort}/taler-wire-gateway/${params.exchangeBankAccount.accountName}/admin/add-incoming`;
    await axios.post(
      url,
      {
        amount: params.amount,
        reserve_pub: params.reservePub,
        debit_account: params.debitAccountPayto,
      },
      {
        auth: {
          username: params.exchangeBankAccount.accountName,
          password: params.exchangeBankAccount.accountPassword,
        },
      },
    );
  }

  async confirmWithdrawalOperation(
    bankUser: BankUser,
    wopi: WithdrawalOperationInfo,
  ): Promise<void> {
    const url = `http://localhost:${this.bankConfig.httpPort}/accounts/${bankUser.username}/withdrawals/${wopi.withdrawal_id}/confirm`;
    await axios.post(
      url,
      {},
      {
        auth: bankUser,
      },
    );
  }
}

export interface BankUser {
  username: string;
  password: string;
  accountPaytoUri: string;
}

export interface WithdrawalOperationInfo {
  withdrawal_id: string;
  taler_withdraw_uri: string;
}

const codecForWithdrawalOperationInfo = (): codec.Codec<
  WithdrawalOperationInfo
> =>
  codec
    .makeCodecForObject<WithdrawalOperationInfo>()
    .property("withdrawal_id", codec.codecForString)
    .property("taler_withdraw_uri", codec.codecForString)
    .build("WithdrawalOperationInfo");

export const defaultCoinConfig = [
  coin_ct1,
  coin_ct10,
  coin_u1,
  coin_u10,
  coin_u2,
  coin_u4,
  coin_u8,
];

export interface ExchangeConfig {
  name: string;
  currency: string;
  roundUnit?: string;
  httpPort: number;
  database: string;
}

export interface ExchangeServiceInterface {
  readonly baseUrl: string;
  readonly port: number;
  readonly name: string;
  readonly masterPub: string;
}

export class ExchangeService implements ExchangeServiceInterface {
  static fromExistingConfig(gc: GlobalTestState, exchangeName: string) {
    const cfgFilename = gc.testDir + `/exchange-${exchangeName}.conf`;
    const config = Configuration.load(cfgFilename);
    const ec: ExchangeConfig = {
      currency: config.getString("taler", "currency").required(),
      database: config.getString("exchangedb-postgres", "config").required(),
      httpPort: config.getNumber("exchange", "port").required(),
      name: exchangeName,
      roundUnit: config.getString("taler", "currency_round_unit").required(),
    };
    const privFile = config.getPath("exchange", "master_priv_file").required();
    const eddsaPriv = fs.readFileSync(privFile);
    const keyPair: EddsaKeyPair = {
      eddsaPriv,
      eddsaPub: talerCrypto.eddsaGetPublic(eddsaPriv),
    };
    return new ExchangeService(gc, ec, cfgFilename, keyPair);
  }

  async runWirewatchOnce() {
    await sh(
      this.globalState,
      "wirewatch-test",
      `taler-exchange-wirewatch -c '${this.configFilename}' -t`,
    );
  }

  static create(gc: GlobalTestState, e: ExchangeConfig) {
    const config = new Configuration();
    config.setString("taler", "currency", e.currency);
    config.setString(
      "taler",
      "currency_round_unit",
      e.roundUnit ?? `${e.currency}:0.01`,
    );
    setPaths(config, gc.testDir + "/talerhome");

    config.setString(
      "exchange",
      "keydir",
      "${TALER_DATA_HOME}/exchange/live-keys/",
    );
    config.setString(
      "exchage",
      "revocation_dir",
      "${TALER_DATA_HOME}/exchange/revocations",
    );
    config.setString("exchange", "max_keys_caching", "forever");
    config.setString("exchange", "db", "postgres");
    config.setString(
      "exchange",
      "master_priv_file",
      "${TALER_DATA_HOME}/exchange/offline-keys/master.priv",
    );
    config.setString("exchange", "serve", "tcp");
    config.setString("exchange", "port", `${e.httpPort}`);
    config.setString("exchange", "signkey_duration", "4 weeks");
    config.setString("exchange", "legal_duraction", "2 years");
    config.setString("exchange", "lookahead_sign", "32 weeks 1 day");
    config.setString("exchange", "lookahead_provide", "4 weeks 1 day");

    for (let i = 2020; i < 2029; i++) {
      config.setString(
        "fees-x-taler-bank",
        `wire-fee-${i}`,
        `${e.currency}:0.01`,
      );
      config.setString(
        "fees-x-taler-bank",
        `closing-fee-${i}`,
        `${e.currency}:0.01`,
      );
    }

    config.setString("exchangedb-postgres", "config", e.database);

    const exchangeMasterKey = talerCrypto.createEddsaKeyPair();

    config.setString(
      "exchange",
      "master_public_key",
      talerCrypto.encodeCrock(exchangeMasterKey.eddsaPub),
    );

    const masterPrivFile = config
      .getPath("exchange", "master_priv_file")
      .required();

    fs.mkdirSync(path.dirname(masterPrivFile), { recursive: true });

    fs.writeFileSync(masterPrivFile, Buffer.from(exchangeMasterKey.eddsaPriv));

    const cfgFilename = gc.testDir + `/exchange-${e.name}.conf`;
    config.write(cfgFilename);
    return new ExchangeService(gc, e, cfgFilename, exchangeMasterKey);
  }

  addOfferedCoins(offeredCoins: ((curr: string) => CoinConfig)[]) {
    const config = Configuration.load(this.configFilename);
    offeredCoins.forEach((cc) =>
      setCoin(config, cc(this.exchangeConfig.currency)),
    );
    config.write(this.configFilename);
  }

  get masterPub() {
    return talerCrypto.encodeCrock(this.keyPair.eddsaPub);
  }

  get port() {
    return this.exchangeConfig.httpPort;
  }

  async addBankAccount(
    localName: string,
    exchangeBankAccount: ExchangeBankAccount,
  ): Promise<void> {
    const config = Configuration.load(this.configFilename);
    config.setString(
      `exchange-account-${localName}`,
      "wire_response",
      `\${TALER_DATA_HOME}/exchange/account-${localName}.json`,
    );
    config.setString(
      `exchange-account-${localName}`,
      "payto_uri",
      exchangeBankAccount.accountPaytoUri,
    );
    config.setString(`exchange-account-${localName}`, "enable_credit", "yes");
    config.setString(`exchange-account-${localName}`, "enable_debit", "yes");
    config.setString(
      `exchange-account-${localName}`,
      "wire_gateway_url",
      exchangeBankAccount.wireGatewayApiBaseUrl,
    );
    config.setString(
      `exchange-account-${localName}`,
      "wire_gateway_auth_method",
      "basic",
    );
    config.setString(
      `exchange-account-${localName}`,
      "username",
      exchangeBankAccount.accountName,
    );
    config.setString(
      `exchange-account-${localName}`,
      "password",
      exchangeBankAccount.accountPassword,
    );
    config.write(this.configFilename);
  }

  exchangeHttpProc: ProcessWrapper | undefined;
  exchangeWirewatchProc: ProcessWrapper | undefined;

  constructor(
    private globalState: GlobalTestState,
    private exchangeConfig: ExchangeConfig,
    private configFilename: string,
    private keyPair: talerCrypto.EddsaKeyPair,
  ) {}

  get name() {
    return this.exchangeConfig.name;
  }

  get baseUrl() {
    return `http://localhost:${this.exchangeConfig.httpPort}/`;
  }

  async start(): Promise<void> {
    await exec(`taler-exchange-dbinit -c "${this.configFilename}"`);
    await exec(`taler-exchange-wire -c "${this.configFilename}"`);
    await exec(`taler-exchange-keyup -c "${this.configFilename}"`);

    this.exchangeWirewatchProc = this.globalState.spawnService(
      "taler-exchange-wirewatch",
      ["-c", this.configFilename],
      `exchange-wirewatch-${this.name}`,
    );

    this.exchangeHttpProc = this.globalState.spawnService(
      "taler-exchange-httpd",
      ["-c", this.configFilename],
      `exchange-httpd-${this.name}`,
    );
  }

  async pingUntilAvailable(): Promise<void> {
    const url = `http://localhost:${this.exchangeConfig.httpPort}/keys`;
    await pingProc(this.exchangeHttpProc, url, `exchange (${this.name})`);
  }
}

export interface MerchantConfig {
  name: string;
  currency: string;
  httpPort: number;
  database: string;
}

export class MerchantService {
  static fromExistingConfig(gc: GlobalTestState, name: string) {
    const cfgFilename = gc.testDir + `/merchant-${name}.conf`;
    const config = Configuration.load(cfgFilename);
    const mc: MerchantConfig = {
      currency: config.getString("taler", "currency").required(),
      database: config.getString("merchantdb-postgres", "config").required(),
      httpPort: config.getNumber("merchant", "port").required(),
      name,
    };
    return new MerchantService(gc, mc, cfgFilename);
  }

  proc: ProcessWrapper | undefined;

  constructor(
    private globalState: GlobalTestState,
    private merchantConfig: MerchantConfig,
    private configFilename: string,
  ) {}

  async start(): Promise<void> {
    await exec(`taler-merchant-dbinit -c "${this.configFilename}"`);

    this.proc = this.globalState.spawnService(
      "taler-merchant-httpd",
      ["-LINFO", "-c", this.configFilename],
      `merchant-${this.merchantConfig.name}`,
    );
  }

  static async create(
    gc: GlobalTestState,
    mc: MerchantConfig,
  ): Promise<MerchantService> {
    const config = new Configuration();
    config.setString("taler", "currency", mc.currency);

    const cfgFilename = gc.testDir + `/merchant-${mc.name}.conf`;
    setPaths(config, gc.testDir + "/talerhome");
    config.setString("merchant", "serve", "tcp");
    config.setString("merchant", "port", `${mc.httpPort}`);
    config.setString(
      "merchant",
      "keyfile",
      "${TALER_DATA_HOME}/merchant/merchant.priv",
    );
    config.setString("merchantdb-postgres", "config", mc.database);
    config.write(cfgFilename);

    return new MerchantService(gc, mc, cfgFilename);
  }

  addExchange(e: ExchangeServiceInterface): void {
    const config = Configuration.load(this.configFilename);
    config.setString(
      `merchant-exchange-${e.name}`,
      "exchange_base_url",
      e.baseUrl,
    );
    config.setString(
      `merchant-exchange-${e.name}`,
      "currency",
      this.merchantConfig.currency,
    );
    config.setString(`merchant-exchange-${e.name}`, "master_key", e.masterPub);
    config.write(this.configFilename);
  }

  async addInstance(instanceConfig: MerchantInstanceConfig): Promise<void> {
    if (!this.proc) {
      throw Error("merchant must be running to add instance");
    }
    console.log("adding instance");
    const url = `http://localhost:${this.merchantConfig.httpPort}/private/instances`;
    await axios.post(url, {
      payto_uris: instanceConfig.paytoUris,
      id: instanceConfig.id,
      name: instanceConfig.name,
      address: instanceConfig.address ?? {},
      jurisdiction: instanceConfig.jurisdiction ?? {},
      default_max_wire_fee:
        instanceConfig.defaultMaxWireFee ??
        `${this.merchantConfig.currency}:1.0`,
      default_wire_fee_amortization:
        instanceConfig.defaultWireFeeAmortization ?? 3,
      default_max_deposit_fee:
        instanceConfig.defaultMaxDepositFee ??
        `${this.merchantConfig.currency}:1.0`,
      default_wire_transfer_delay: instanceConfig.defaultWireTransferDelay ?? {
        d_ms: "forever",
      },
      default_pay_delay: instanceConfig.defaultPayDelay ?? { d_ms: "forever" },
    });
  }

  async queryPrivateOrderStatus(instanceName: string, orderId: string) {
    const reqUrl = new URL(
      `private/orders/${orderId}`,
      this.makeInstanceBaseUrl(instanceName),
    );
    const resp = await axios.get(reqUrl.href);
    return codecForMerchantOrderPrivateStatusResponse().decode(resp.data);
  }

  makeInstanceBaseUrl(instanceName: string): string {
    if (instanceName === "default") {
      return `http://localhost:${this.merchantConfig.httpPort}/`;
    } else {
      return `http://localhost:${this.merchantConfig.httpPort}/instances/${instanceName}/`;
    }
  }

  async giveRefund(r: {
    instance: string;
    orderId: string;
    amount: string;
    justification: string;
  }): Promise<{ talerRefundUri: string }> {
    const reqUrl = new URL(
      `private/orders/${r.orderId}/refund`,
      this.makeInstanceBaseUrl(r.instance),
    );
    const resp = await axios.post(reqUrl.href, {
      refund: r.amount,
      reason: r.justification,
    });
    return {
      talerRefundUri: resp.data.taler_refund_uri,
    }
  }

  async createOrder(
    instanceName: string,
    req: PostOrderRequest,
  ): Promise<PostOrderResponse> {
    let url;
    if (instanceName === "default") {
      url = `http://localhost:${this.merchantConfig.httpPort}/private/orders`;
    } else {
      url = `http://localhost:${this.merchantConfig.httpPort}/instances/${instanceName}/private/orders`;
    }
    const resp = await axios.post(url, req);
    return codecForPostOrderResponse().decode(resp.data);
  }

  async pingUntilAvailable(): Promise<void> {
    const url = `http://localhost:${this.merchantConfig.httpPort}/config`;
    await pingProc(this.proc, url, `merchant (${this.merchantConfig.name})`);
  }
}

export interface MerchantInstanceConfig {
  id: string;
  name: string;
  paytoUris: string[];
  address?: unknown;
  jurisdiction?: unknown;
  defaultMaxWireFee?: string;
  defaultMaxDepositFee?: string;
  defaultWireFeeAmortization?: number;
  defaultWireTransferDelay?: time.Duration;
  defaultPayDelay?: time.Duration;
}

/**
 * Check if the test should hang around after it failed.
 */
function shouldLinger(): boolean {
  return (
    process.env["TALER_TEST_LINGER"] == "1" ||
    process.env["TALER_TEST_LINGER_ALWAYS"] == "1"
  );
}

/**
 * Check if the test should hang around even after it finished
 * successfully.
 */
function shouldLingerAlways(): boolean {
  return process.env["TALER_TEST_LINGER_ALWAYS"] == "1";
}

function updateCurrentSymlink(testDir: string): void {
  const currLink = path.join(os.tmpdir(), "taler-integrationtest-current");
  try {
    fs.unlinkSync(currLink);
  } catch (e) {
    // Ignore
  }
  try {
    fs.symlinkSync(testDir, currLink);
  } catch (e) {
    console.log(e);
    // Ignore
  }
}

export function runTestWithState(
  gc: GlobalTestState,
  testMain: (t: GlobalTestState) => Promise<void>,
) {
  const main = async () => {
    let ret = 0;
    try {
      updateCurrentSymlink(gc.testDir);
      console.log("running test in directory", gc.testDir);
      await testMain(gc);
    } catch (e) {
      console.error("FATAL: test failed with exception", e);
      ret = 1;
    } finally {
      if (gc) {
        if (shouldLinger()) {
          console.log("test logs and config can be found under", gc.testDir);
          console.log("keeping test environment running");
        } else {
          await gc.shutdown();
          console.log("test logs and config can be found under", gc.testDir);
          process.exit(ret);
        }
      }
    }
  };

  main();
}

export function runTest(
  testMain: (gc: GlobalTestState) => Promise<void>,
): void {
  const gc = new GlobalTestState({
    testDir: fs.mkdtempSync(path.join(os.tmpdir(), "taler-integrationtest-")),
  });
  runTestWithState(gc, testMain);
}

function shellWrap(s: string) {
  return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'";
}

export class WalletCli {
  constructor(private globalTestState: GlobalTestState) {}

  deleteDatabase() {
    const wdb = this.globalTestState.testDir + "/walletdb.json";
    fs.unlinkSync(wdb);
  }

  async apiRequest(
    request: string,
    payload: Record<string, unknown>,
  ): Promise<walletCoreApi.CoreApiResponse> {
    const wdb = this.globalTestState.testDir + "/walletdb.json";
    const resp = await sh(
      this.globalTestState,
      "wallet",
      `taler-wallet-cli --no-throttle --wallet-db '${wdb}' api '${request}' ${shellWrap(
        JSON.stringify(payload),
      )}`,
    );
    console.log(resp);
    return JSON.parse(resp) as walletCoreApi.CoreApiResponse;
  }

  async runUntilDone(): Promise<void> {
    const wdb = this.globalTestState.testDir + "/walletdb.json";
    await sh(
      this.globalTestState,
      "wallet",
      `taler-wallet-cli --no-throttle --wallet-db ${wdb} run-until-done`,
    );
  }

  async runPending(): Promise<void> {
    const wdb = this.globalTestState.testDir + "/walletdb.json";
    await sh(
      this.globalTestState,
      "wallet",
      `taler-wallet-cli --no-throttle --wallet-db ${wdb} run-pending`,
    );
  }
}