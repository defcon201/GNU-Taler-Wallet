/*
 This file is part of TALER
 (C) 2017 Inria

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
 * View and edit auditors.
 *
 * @author Florian Dold
 */


import { ExchangeRecord, DenominationRecord } from "src/types";
import { AuditorRecord, CurrencyRecord, ReserveRecord, CoinRecord, PreCoinRecord, Denomination } from "src/types";
import { ImplicitStateComponent, StateHolder } from "src/components";
import {
  getCurrencies,
  updateCurrency,
} from "src/wxApi";
import { prettyAmount } from "src/renderHtml";
import { getTalerStampDate } from "src/helpers";

interface ConfirmAuditorProps {
  url: string;
  currency: string;
  auditorPub: string;
  expirationStamp: number;
}

class ConfirmAuditor extends ImplicitStateComponent<ConfirmAuditorProps> {
  addDone: StateHolder<boolean> = this.makeState(false);
  constructor() {
    super();
  }

  async add() {
    let currencies = await getCurrencies();
    let currency: CurrencyRecord|undefined = undefined;

    for (let c of currencies) {
      if (c.name == this.props.currency) {
        currency = c;
      }
    }

    if (!currency) {
      currency = { name: this.props.currency, auditors: [], fractionalDigits: 2 };
    }

    let newAuditor = { auditorPub: this.props.auditorPub, baseUrl: this.props.url, expirationStamp: this.props.expirationStamp };

    let auditorFound = false;
    for (let idx in currency.auditors) {
      let a = currency.auditors[idx];
      if (a.baseUrl == this.props.url) {
        auditorFound = true;
        // Update auditor if already found by URL.
        currency.auditors[idx] = newAuditor;
      }
    }

    if (!auditorFound) {
      currency.auditors.push(newAuditor);
    }

    await updateCurrency(currency);

    this.addDone(true);
  }

  back() {
    window.history.back();
  }

  render(): JSX.Element {
    return (
      <div id="main">
        <p>Do you want to let <strong>{this.props.auditorPub}</strong> audit the currency "{this.props.currency}"?</p>
        {this.addDone() ? 
          (<div>Auditor was added! You can also <a href={chrome.extension.getURL("/src/pages/auditors.html")}>view and edit</a> auditors.</div>)
          : 
          (<div>
            <button onClick={() => this.add()} className="pure-button pure-button-primary">Yes</button>
            <button onClick={() => this.back()} className="pure-button">No</button>
          </div>)
        }
      </div>
    );
  }
}

export function main() {
  const walletPageUrl = URI(document.location.href);
  const query: any = JSON.parse((URI.parseQuery(walletPageUrl.query()) as any)["req"]);
  const url = query.url;
  const currency: string = query.currency;
  const auditorPub: string = query.auditorPub;
  const expirationStamp = Number.parseInt(query.expirationStamp);
  const args = { url, currency, auditorPub, expirationStamp };
  ReactDOM.render(<ConfirmAuditor {...args} />, document.getElementById("container")!);
}
