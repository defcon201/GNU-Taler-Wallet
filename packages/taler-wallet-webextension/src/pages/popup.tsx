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

/**
 * Popup shown to the user when they click
 * the Taler browser action button.
 *
 * @author Florian Dold
 */

/**
 * Imports.
 */
import * as i18n from "../i18n";

import {
  AmountJson,
  Amounts,
  BalancesResponse,
  Balance,
  classifyTalerUri,
  TalerUriType,
  TransactionsResponse,
  Transaction,
  TransactionType,
  AmountString,
  Timestamp,
  amountFractionalBase,
} from "@gnu-taler/taler-util";

import { abbrev, renderAmount, PageLink } from "../renderHtml";
import * as wxApi from "../wxApi";

import React, { Fragment, useState, useEffect } from "react";

import moment from "moment";
import { PermissionsCheckbox } from "./welcome";

// FIXME: move to newer react functions
/* eslint-disable react/no-deprecated */

class Router extends React.Component<any, any> {
  static setRoute(s: string): void {
    window.location.hash = s;
  }

  static getRoute(): string {
    // Omit the '#' at the beginning
    return window.location.hash.substring(1);
  }

  static onRoute(f: any): () => void {
    Router.routeHandlers.push(f);
    return () => {
      const i = Router.routeHandlers.indexOf(f);
      this.routeHandlers = this.routeHandlers.splice(i, 1);
    };
  }

  private static routeHandlers: any[] = [];

  componentWillMount(): void {
    console.log("router mounted");
    window.onhashchange = () => {
      this.setState({});
      for (const f of Router.routeHandlers) {
        f();
      }
    };
  }

  render(): JSX.Element {
    const route = window.location.hash.substring(1);
    console.log("rendering route", route);
    let defaultChild: React.ReactChild | null = null;
    let foundChild: React.ReactChild | null = null;
    React.Children.forEach(this.props.children, (child) => {
      const childProps: any = (child as any).props;
      if (!childProps) {
        return;
      }
      if (childProps.default) {
        defaultChild = child as React.ReactChild;
      }
      if (childProps.route === route) {
        foundChild = child as React.ReactChild;
      }
    });
    const c: React.ReactChild | null = foundChild || defaultChild;
    if (!c) {
      throw Error("unknown route");
    }
    Router.setRoute((c as any).props.route);
    return <div>{c}</div>;
  }
}

interface TabProps {
  target: string;
  children?: React.ReactNode;
}

function Tab(props: TabProps): JSX.Element {
  let cssClass = "";
  if (props.target === Router.getRoute()) {
    cssClass = "active";
  }
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    Router.setRoute(props.target);
    e.preventDefault();
  };
  return (
    <a onClick={onClick} href={props.target} className={cssClass}>
      {props.children}
    </a>
  );
}

class WalletNavBar extends React.Component<any, any> {
  private cancelSubscription: any;

  componentWillMount(): void {
    this.cancelSubscription = Router.onRoute(() => {
      this.setState({});
    });
  }

  componentWillUnmount(): void {
    if (this.cancelSubscription) {
      this.cancelSubscription();
    }
  }

  render(): JSX.Element {
    console.log("rendering nav bar");
    return (
      <div className="nav" id="header">
        <Tab target="/balance">{i18n.str`Balance`}</Tab>
        <Tab target="/history">{i18n.str`History`}</Tab>
        <Tab target="/settings">{i18n.str`Settings`}</Tab>
        <Tab target="/debug">{i18n.str`Debug`}</Tab>
      </div>
    );
  }
}

/**
 * Render an amount as a large number with a small currency symbol.
 */
function bigAmount(amount: AmountJson): JSX.Element {
  const v = amount.value + amount.fraction / amountFractionalBase;
  return (
    <span>
      <span style={{ fontSize: "5em", display: "block" }}>{v}</span>{" "}
      <span>{amount.currency}</span>
    </span>
  );
}

function EmptyBalanceView(): JSX.Element {
  return (
    <i18n.Translate wrap="p">
      You have no balance to show. Need some{" "}
      <PageLink pageName="welcome.html">help</PageLink> getting started?
    </i18n.Translate>
  );
}

class WalletBalanceView extends React.Component<any, any> {
  private balance?: BalancesResponse;
  private gotError = false;
  private canceler: (() => void) | undefined = undefined;
  private unmount = false;
  private updateBalanceRunning = false;

  componentWillMount(): void {
    this.canceler = wxApi.onUpdateNotification(() => this.updateBalance());
    this.updateBalance();
  }

  componentWillUnmount(): void {
    console.log("component WalletBalanceView will unmount");
    if (this.canceler) {
      this.canceler();
    }
    this.unmount = true;
  }

  async updateBalance(): Promise<void> {
    if (this.updateBalanceRunning) {
      return;
    }
    this.updateBalanceRunning = true;
    let balance: BalancesResponse;
    try {
      balance = await wxApi.getBalance();
    } catch (e) {
      if (this.unmount) {
        return;
      }
      this.gotError = true;
      console.error("could not retrieve balances", e);
      this.setState({});
      return;
    } finally {
      this.updateBalanceRunning = false;
    }
    if (this.unmount) {
      return;
    }
    this.gotError = false;
    console.log("got balance", balance);
    this.balance = balance;
    this.setState({});
  }

  formatPending(entry: Balance): JSX.Element {
    let incoming: JSX.Element | undefined;
    let payment: JSX.Element | undefined;

    const available = Amounts.parseOrThrow(entry.available);
    const pendingIncoming = Amounts.parseOrThrow(entry.pendingIncoming);
    const pendingOutgoing = Amounts.parseOrThrow(entry.pendingOutgoing);

    console.log(
      "available: ",
      entry.pendingIncoming ? renderAmount(entry.available) : null,
    );
    console.log(
      "incoming: ",
      entry.pendingIncoming ? renderAmount(entry.pendingIncoming) : null,
    );

    if (!Amounts.isZero(pendingIncoming)) {
      incoming = (
        <i18n.Translate wrap="span">
          <span style={{ color: "darkgreen" }}>
            {"+"}
            {renderAmount(entry.pendingIncoming)}
          </span>{" "}
          incoming
        </i18n.Translate>
      );
    }

    const l = [incoming, payment].filter((x) => x !== undefined);
    if (l.length === 0) {
      return <span />;
    }

    if (l.length === 1) {
      return <span>({l})</span>;
    }
    return (
      <span>
        ({l[0]}, {l[1]})
      </span>
    );
  }

  render(): JSX.Element {
    const wallet = this.balance;
    if (this.gotError) {
      return (
        <div className="balance">
          <p>{i18n.str`Error: could not retrieve balance information.`}</p>
          <p>
            Click <PageLink pageName="welcome.html">here</PageLink> for help and
            diagnostics.
          </p>
        </div>
      );
    }
    if (!wallet) {
      return <span></span>;
    }
    console.log(wallet);
    const listing = wallet.balances.map((entry) => {
      const av = Amounts.parseOrThrow(entry.available);
      return (
        <p key={av.currency}>
          {bigAmount(av)} {this.formatPending(entry)}
        </p>
      );
    });
    return listing.length > 0 ? (
      <div className="balance">{listing}</div>
    ) : (
      <EmptyBalanceView />
    );
  }
}

interface TransactionAmountProps {
  debitCreditIndicator: "debit" | "credit" | "unknown";
  amount: AmountString | "unknown";
  pending: boolean;
}

function TransactionAmount(props: TransactionAmountProps): JSX.Element {
  const [currency, amount] = props.amount.split(":");
  let sign: string;
  switch (props.debitCreditIndicator) {
    case "credit":
      sign = "+";
      break;
    case "debit":
      sign = "-";
      break;
    case "unknown":
      sign = "";
  }
  const style: React.CSSProperties = {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center"
  };
  if (props.pending) {
    style.color = "gray";
  }
  return (
    <div style={{ ...style }}>
      <div style={{ fontSize: "x-large" }}>
        {sign}
        {amount}
      </div>
      <div>{currency}</div>
    </div>
  );
}

interface TransactionLayoutProps {
  debitCreditIndicator: "debit" | "credit" | "unknown";
  amount: AmountString | "unknown";
  timestamp: Timestamp;
  title: string;
  subtitle: string;
  iconPath: string;
  pending: boolean;
}

function TransactionLayout(props: TransactionLayoutProps): JSX.Element {
  const date = new Date(props.timestamp.t_ms);
  const dateStr = date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  } as any);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        border: "1px solid gray",
        borderRadius: "0.5em",
        margin: "0.5em 0",
        justifyContent: "space-between",
        padding: "0.5em",
      }}
    >
      <img src={props.iconPath} />
      <div
        style={{ display: "flex", flexDirection: "column", marginLeft: "1em" }}
      >
        <div style={{ fontSize: "small", color: "gray" }}>{dateStr}</div>
        <div style={{ fontVariant: "small-caps", fontSize: "x-large" }}>
          <span>{props.title}</span>
          {props.pending ? (
            <span style={{ color: "darkblue" }}> (Pending)</span>
          ) : null}
        </div>

        <div>{props.subtitle}</div>
      </div>
      <TransactionAmount
        pending={props.pending}
        amount={props.amount}
        debitCreditIndicator={props.debitCreditIndicator}
      />
    </div>
  );
}

function TransactionItem(props: { tx: Transaction }): JSX.Element {
  const tx = props.tx;
  switch (tx.type) {
    case TransactionType.Withdrawal:
      return (
        <TransactionLayout
          amount={tx.amountEffective}
          debitCreditIndicator={"credit"}
          title="Withdrawal"
          subtitle={`via ${tx.exchangeBaseUrl}`}
          timestamp={tx.timestamp}
          iconPath="/static/img/ri-bank-line.svg"
          pending={tx.pending}
        ></TransactionLayout>
      );
    case TransactionType.Payment:
      return (
        <TransactionLayout
          amount={tx.amountEffective}
          debitCreditIndicator={"debit"}
          title="Payment"
          subtitle={tx.info.summary}
          timestamp={tx.timestamp}
          iconPath="/static/img/ri-shopping-cart-line.svg"
          pending={tx.pending}
        ></TransactionLayout>
      );
    case TransactionType.Refund:
      return (
        <TransactionLayout
          amount={tx.amountEffective}
          debitCreditIndicator={"credit"}
          title="Refund"
          subtitle={tx.info.summary}
          timestamp={tx.timestamp}
          iconPath="/static/img/ri-refund-2-line.svg"
          pending={tx.pending}
        ></TransactionLayout>
      );
    case TransactionType.Tip:
      return (
        <TransactionLayout
          amount={tx.amountEffective}
          debitCreditIndicator={"credit"}
          title="Tip"
          subtitle={`from ${new URL(tx.merchantBaseUrl).hostname}`}
          timestamp={tx.timestamp}
          iconPath="/static/img/ri-hand-heart-line.svg"
          pending={tx.pending}
        ></TransactionLayout>
      );
    case TransactionType.Refresh:
      return (
        <TransactionLayout
          amount={tx.amountEffective}
          debitCreditIndicator={"credit"}
          title="Refresh"
          subtitle={`via exchange ${tx.exchangeBaseUrl}`}
          timestamp={tx.timestamp}
          iconPath="/static/img/ri-refresh-line.svg"
          pending={tx.pending}
        ></TransactionLayout>
      );
    case TransactionType.Deposit:
      return (
        <TransactionLayout
          amount={tx.amountEffective}
          debitCreditIndicator={"debit"}
          title="Refresh"
          subtitle={`to ${tx.targetPaytoUri}`}
          timestamp={tx.timestamp}
          iconPath="/static/img/ri-refresh-line.svg"
          pending={tx.pending}
        ></TransactionLayout>
      );
  }
}

function WalletHistory(props: any): JSX.Element {
  const [transactions, setTransactions] = useState<
    TransactionsResponse | undefined
  >();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const res = await wxApi.getTransactions();
      setTransactions(res);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!transactions) {
    return <div>Loading ...</div>;
  }

  const txs = [...transactions.transactions].reverse();

  return (
    <div>
      {txs.map((tx) => (
        <TransactionItem tx={tx} />
      ))}
    </div>
  );
}

class WalletSettings extends React.Component<any, any> {
  render(): JSX.Element {
    return (
      <div>
        <h2>Permissions</h2>
        <PermissionsCheckbox />
      </div>
    );
  }
}

function reload(): void {
  try {
    chrome.runtime.reload();
    window.close();
  } catch (e) {
    // Functionality missing in firefox, ignore!
  }
}

function confirmReset(): void {
  if (
    confirm(
      "Do you want to IRREVOCABLY DESTROY everything inside your" +
        " wallet and LOSE ALL YOUR COINS?",
    )
  ) {
    wxApi.resetDb();
    window.close();
  }
}

function WalletDebug(props: any): JSX.Element {
  return (
    <div>
      <p>Debug tools:</p>
      <button onClick={openExtensionPage("/static/popup.html")}>wallet tab</button>
      <br />
      <button onClick={confirmReset}>reset</button>
      <button onClick={reload}>reload chrome extension</button>
    </div>
  );
}

function openExtensionPage(page: string) {
  return () => {
    chrome.tabs.create({
      url: chrome.extension.getURL(page),
    });
  };
}

function openTab(page: string) {
  return (evt: React.SyntheticEvent<any>) => {
    evt.preventDefault();
    chrome.tabs.create({
      url: page,
    });
  };
}

function makeExtensionUrlWithParams(
  url: string,
  params?: { [name: string]: string | undefined },
): string {
  const innerUrl = new URL(chrome.extension.getURL("/" + url));
  if (params) {
    for (const key in params) {
      const p = params[key];
      if (p) {
        innerUrl.searchParams.set(key, p);
      }
    }
  }
  return innerUrl.href;
}

function actionForTalerUri(talerUri: string): string | undefined {
  const uriType = classifyTalerUri(talerUri);
  switch (uriType) {
    case TalerUriType.TalerWithdraw:
      return makeExtensionUrlWithParams("static/withdraw.html", {
        talerWithdrawUri: talerUri,
      });
    case TalerUriType.TalerPay:
      return makeExtensionUrlWithParams("static/pay.html", {
        talerPayUri: talerUri,
      });
    case TalerUriType.TalerTip:
      return makeExtensionUrlWithParams("static/tip.html", {
        talerTipUri: talerUri,
      });
    case TalerUriType.TalerRefund:
      return makeExtensionUrlWithParams("static/refund.html", {
        talerRefundUri: talerUri,
      });
    case TalerUriType.TalerNotifyReserve:
      // FIXME: implement
      break;
    default:
      console.warn(
        "Response with HTTP 402 has Taler header, but header value is not a taler:// URI.",
      );
      break;
  }
  return undefined;
}

async function findTalerUriInActiveTab(): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    chrome.tabs.executeScript(
      {
        code: `
        (() => {
          let x = document.querySelector("a[href^='taler://'");
          return x ? x.href.toString() : null;
        })();
      `,
        allFrames: false,
      },
      (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          resolve(undefined);
          return;
        }
        console.log("got result", result);
        resolve(result[0]);
      },
    );
  });
}

function WalletPopup(): JSX.Element {
  const [talerActionUrl, setTalerActionUrl] = useState<string | undefined>(
    undefined,
  );
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    async function check(): Promise<void> {
      const talerUri = await findTalerUriInActiveTab();
      if (talerUri) {
        const actionUrl = actionForTalerUri(talerUri);
        setTalerActionUrl(actionUrl);
      }
    }
    check();
  });
  if (talerActionUrl && !dismissed) {
    return (
      <div style={{ padding: "1em" }}>
        <h1>Taler Action</h1>
        <p>This page has a Taler action. </p>
        <p>
          <button
            onClick={() => {
              window.open(talerActionUrl, "_blank");
            }}
          >
            Open
          </button>
        </p>
        <p>
          <button onClick={() => setDismissed(true)}>Dismiss</button>
        </p>
      </div>
    );
  }
  return (
    <div>
      <WalletNavBar />
      <div style={{ margin: "1em" }}>
        <Router>
          <WalletBalanceView route="/balance" default />
          <WalletSettings route="/settings" />
          <WalletDebug route="/debug" />
          <WalletHistory route="/history" />
        </Router>
      </div>
    </div>
  );
}

export function createPopup(): JSX.Element {
  return <WalletPopup />;
}
