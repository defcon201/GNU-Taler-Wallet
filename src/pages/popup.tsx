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


"use strict";

import {substituteFulfillmentUrl} from "../helpers";
import BrowserClickedEvent = chrome.browserAction.BrowserClickedEvent;
import {HistoryRecord, HistoryLevel} from "../wallet";
import {
  AmountJson, WalletBalance, Amounts,
  WalletBalanceEntry
} from "../types";
import {abbrev, prettyAmount} from "../renderHtml";
import * as i18n from "../i18n";
import * as React from "react";
import * as ReactDOM from "react-dom";
import URI = require("urijs");

function onUpdateNotification(f: () => void): () => void {
  let port = chrome.runtime.connect({name: "notifications"});
  let listener = (msg: any, port: any) => {
    f();
  };
  port.onMessage.addListener(listener);
  return () => {
    port.onMessage.removeListener(listener);
  }
}


class Router extends React.Component<any,any> {
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
      let i = Router.routeHandlers.indexOf(f);
      this.routeHandlers = this.routeHandlers.splice(i, 1);
    }
  }

  static routeHandlers: any[] = [];

  componentWillMount() {
    console.log("router mounted");
    window.onhashchange = () => {
      this.setState({});
      for (let f of Router.routeHandlers) {
        f();
      }
    }
  }

  componentWillUnmount() {
    console.log("router unmounted");
  }


  render(): JSX.Element {
    let route = window.location.hash.substring(1);
    console.log("rendering route", route);
    let defaultChild: React.ReactChild|null = null;
    let foundChild: React.ReactChild|null = null;
    React.Children.forEach(this.props.children, (child) => {
      let childProps: any = (child as any).props;
      if (!childProps) {
        return;
      }
      if (childProps["default"]) {
        defaultChild = child;
      }
      if (childProps["route"] == route) {
        foundChild = child;
      }
    })
    let child: React.ReactChild | null = foundChild || defaultChild;
    if (!child) {
      throw Error("unknown route");
    }
    Router.setRoute((child as any).props["route"]);
    return <div>{child}</div>;
  }
}


interface TabProps {
  target: string;
  children?: React.ReactNode;
}

function Tab(props: TabProps) {
  let cssClass = "";
  if (props.target == Router.getRoute()) {
    cssClass = "active";
  }
  let onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    Router.setRoute(props.target);
    e.preventDefault();
  };
  return (
    <a onClick={onClick} href={props.target} className={cssClass}>
      {props.children}
    </a>
  );
}


class WalletNavBar extends React.Component<any,any> {
  cancelSubscription: any;

  componentWillMount() {
    this.cancelSubscription = Router.onRoute(() => {
      this.setState({});
    });
  }

  componentWillUnmount() {
    if (this.cancelSubscription) {
      this.cancelSubscription();
    }
  }

  render() {
    console.log("rendering nav bar");
    return (
      <div className="nav" id="header">
        <Tab target="/balance">
          {i18n.str`Balance`}
        </Tab>
        <Tab target="/history">
          {i18n.str`History`}
        </Tab>
        <Tab target="/debug">
          {i18n.str`Debug`}
        </Tab>
      </div>);
  }
}


function ExtensionLink(props: any) {
  let onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    chrome.tabs.create({
                         "url": chrome.extension.getURL(props.target)
                       });
    e.preventDefault();
  };
  return (
    <a onClick={onClick} href={props.target}>
      {props.children}
    </a>)
}


export function bigAmount(amount: AmountJson): JSX.Element {
  let v = amount.value + amount.fraction / Amounts.fractionalBase;
  return (
    <span>
      <span style={{fontSize: "300%"}}>{v}</span>
      {" "}
      <span>{amount.currency}</span>
      </span>
  );
}

class WalletBalanceView extends React.Component<any, any> {
  balance: WalletBalance;
  gotError = false;
  canceler: (() => void) | undefined = undefined;
  unmount = false;

  componentWillMount() {
    this.canceler = onUpdateNotification(() => this.updateBalance());
    this.updateBalance();
  }

  componentWillUnmount() {
    console.log("component WalletBalanceView will unmount");
    if (this.canceler) {
      this.canceler();
    }
    this.unmount = true;
  }

  updateBalance() {
    chrome.runtime.sendMessage({type: "balances"}, (resp) => {
      if (this.unmount) {
        return;
      }
      if (resp.error) {
        this.gotError = true;
        console.error("could not retrieve balances", resp);
        this.setState({});
        return;
      }
      this.gotError = false;
      console.log("got wallet", resp);
      this.balance = resp;
      this.setState({});
    });
  }

  renderEmpty(): JSX.Element {
    let helpLink = (
      <ExtensionLink target="/src/pages/help/empty-wallet.html">
        {i18n.str`help`}
      </ExtensionLink>
    );
    return (
      <div>
        <i18n.Translate wrap="p">
        You have no balance to show. Need some
          {" "}<span>{helpLink}</span>{" "}
          getting started?
        </i18n.Translate>
      </div>
    );
  }

  formatPending(entry: WalletBalanceEntry): JSX.Element {
    let incoming: JSX.Element | undefined;
    let payment: JSX.Element | undefined;

    console.log("available: ", entry.pendingIncoming ? prettyAmount(entry.available) : null);
    console.log("incoming: ", entry.pendingIncoming ? prettyAmount(entry.pendingIncoming) : null);

    if (Amounts.isNonZero(entry.pendingIncoming)) {
      incoming = (
        <i18n.Translate wrap="span">
          <span style={{color: "darkgreen"}}>
            {"+"}
            {prettyAmount(entry.pendingIncoming)}
          </span>
          {" "}
          incoming
      </i18n.Translate>
      );
    }

    if (Amounts.isNonZero(entry.pendingPayment)) {
      payment = (
        <i18n.Translate wrap="span">
          <span style={{color: "darkblue"}}>
            {prettyAmount(entry.pendingPayment)}
          </span>
          {" "}
          being spent
        </i18n.Translate>
      );
    }

    let l = [incoming, payment].filter((x) => x !== undefined);
    if (l.length == 0) {
      return <span />;
    }

    if (l.length == 1) {
      return <span>({l})</span>
    }
    return <span>({l[0]}, {l[1]})</span>;

  }

  render(): JSX.Element {
    let wallet = this.balance;
    if (this.gotError) {
      return i18n.str`Error: could not retrieve balance information.`;
    }
    if (!wallet) {
      return <span></span>;
    }
    console.log(wallet);
    let paybackAvailable = false;
    let listing = Object.keys(wallet).map((key) => {
      let entry: WalletBalanceEntry = wallet[key];
      if (entry.paybackAmount.value != 0 || entry.paybackAmount.fraction != 0) {
        paybackAvailable = true;
      }
      return (
        <p>
          {bigAmount(entry.available)}
          {" "}
          {this.formatPending(entry)}
        </p>
      );
    });
    let link = chrome.extension.getURL("/src/pages/auditors.html");
    let linkElem = <a className="actionLink" href={link} target="_blank">Trusted Auditors and Exchanges</a>;
    let paybackLink = chrome.extension.getURL("/src/pages/payback.html");
    let paybackLinkElem = <a className="actionLink" href={link} target="_blank">Trusted Auditors and Exchanges</a>;
    return (
      <div>
        {listing.length > 0 ? listing : this.renderEmpty()}
        {paybackAvailable && paybackLinkElem}
        {linkElem}
      </div>
    );
  }
}


function formatHistoryItem(historyItem: HistoryRecord) {
  const d = historyItem.detail;
  const t = historyItem.timestamp;
  console.log("hist item", historyItem);
  switch (historyItem.type) {
    case "create-reserve":
      return (
        <i18n.Translate wrap="p">
          Bank requested reserve (<span>{abbrev(d.reservePub)}</span>) for <span>{prettyAmount(d.requestedAmount)}</span>.
        </i18n.Translate>
      );
    case "confirm-reserve": {
      // FIXME: eventually remove compat fix
      let exchange = d.exchangeBaseUrl ? (new URI(d.exchangeBaseUrl)).host() : "??";
      let pub = abbrev(d.reservePub);
      return (
        <i18n.Translate wrap="p">
          Started to withdraw
          {" "}{prettyAmount(d.requestedAmount)}{" "}
          from <span>{exchange}</span> (<span>{pub}</span>).
        </i18n.Translate>
      );
    }
    case "offer-contract": {
      let link = chrome.extension.getURL("view-contract.html");
      let linkElem = <a href={link}>{abbrev(d.contractHash)}</a>;
      let merchantElem = <em>{abbrev(d.merchantName, 15)}</em>;
      return (
        <i18n.Translate wrap="p">
          Merchant <em>{abbrev(d.merchantName, 15)}</em> offered contract <a href={link}>{abbrev(d.contractHash)}</a>;
        </i18n.Translate>
      );
    }
    case "depleted-reserve": {
      let exchange = d.exchangeBaseUrl ? (new URI(d.exchangeBaseUrl)).host() : "??";
      let amount = prettyAmount(d.requestedAmount);
      let pub = abbrev(d.reservePub);
      return (
        <i18n.Translate wrap="p">
          Withdrew <span>{amount}</span> from <span>{exchange}</span> (<span>{pub}</span>).
        </i18n.Translate>
      );
    }
    case "pay": {
      let url = substituteFulfillmentUrl(d.fulfillmentUrl,
                                         {H_contract: d.contractHash});
      let merchantElem = <em>{abbrev(d.merchantName, 15)}</em>;
      let fulfillmentLinkElem = <a href={url} onClick={openTab(url)}>view product</a>;
      return (
        <i18n.Translate wrap="p">
          Paid <span>{prettyAmount(d.amount)}</span> to merchant <span>{merchantElem}</span>.  (<span>{fulfillmentLinkElem}</span>)
        </i18n.Translate>
      );
    }
    default:
      return (<p>{i18n.str`Unknown event (${historyItem.type})`}</p>);
  }
}


class WalletHistory extends React.Component<any, any> {
  myHistory: any[];
  gotError = false;
  unmounted = false;

  componentWillMount() {
    this.update();
    onUpdateNotification(() => this.update());
  }

  componentWillUnmount() {
    console.log("history component unmounted");
    this.unmounted = true;
  }

  update() {
    chrome.runtime.sendMessage({type: "get-history"}, (resp) => {
      if (this.unmounted) {
        return;
      }
      console.log("got history response");
      if (resp.error) {
        this.gotError = true;
        console.error("could not retrieve history", resp);
        this.setState({});
        return;
      }
      this.gotError = false;
      console.log("got history", resp.history);
      this.myHistory = resp.history;
      this.setState({});
    });
  }

  render(): JSX.Element {
    console.log("rendering history");
    let history: HistoryRecord[] = this.myHistory;
    if (this.gotError) {
      return i18n.str`Error: could not retrieve event history`;
    }

    if (!history) {
      // We're not ready yet
      return <span />;
    }

    let subjectMemo: {[s: string]: boolean} = {};
    let listing: any[] = [];
    for (let record of history.reverse()) {
      if (record.subjectId && subjectMemo[record.subjectId]) {
        continue;
      }
      if (record.level != undefined && record.level < HistoryLevel.User) {
        continue;
      }
      subjectMemo[record.subjectId as string] = true;

      let item = (
        <div className="historyItem">
          <div className="historyDate">
            {(new Date(record.timestamp)).toString()}
          </div>
          {formatHistoryItem(record)}
        </div>
      );

      listing.push(item);
    }

    if (listing.length > 0) {
      return <div className="container">{listing}</div>;
    }
    return <p>{i18n.str`Your wallet has no events recorded.`}</p>
  }

}


function reload() {
  try {
    chrome.runtime.reload();
    window.close();
  } catch (e) {
    // Functionality missing in firefox, ignore!
  }
}

function confirmReset() {
  if (confirm("Do you want to IRREVOCABLY DESTROY everything inside your" +
              " wallet and LOSE ALL YOUR COINS?")) {
    chrome.runtime.sendMessage({type: "reset"});
    window.close();
  }
}


function WalletDebug(props: any) {
  return (<div>
    <p>Debug tools:</p>
    <button onClick={openExtensionPage("/src/pages/popup.html")}>
      wallet tab
    </button>
    <button onClick={openExtensionPage("/src/pages/show-db.html")}>
      show db
    </button>
    <button onClick={openExtensionPage("/src/pages/tree.html")}>
      show tree
    </button>
    <button onClick={openExtensionPage("/src/pages/logs.html")}>
      show logs
    </button>
    <br />
    <button onClick={confirmReset}>
      reset
    </button>
    <button onClick={reload}>
      reload chrome extension
    </button>
  </div>);
}


function openExtensionPage(page: string) {
  return function() {
    chrome.tabs.create({
      "url": chrome.extension.getURL(page)
    });
  }
}


function openTab(page: string) {
  return function() {
    chrome.tabs.create({
      "url": page
    });
  }
}


let el = (
  <div>
    <WalletNavBar />
    <div style={{margin: "1em"}}>
      <Router>
        <WalletBalanceView route="/balance" default/>
        <WalletHistory route="/history"/>
        <WalletDebug route="/debug"/>
      </Router>
    </div>
  </div>
);

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(el, document.getElementById("content")!);
})