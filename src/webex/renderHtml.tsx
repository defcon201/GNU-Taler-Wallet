/*
 This file is part of TALER
 (C) 2016 INRIA

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
 * Helpers functions to render Taler-related data structures to HTML.
 *
 * @author Florian Dold
 */


/**
 * Imports.
 */
import {
  AmountJson,
  Amounts,
} from "../types";

import * as React from "react";


/**
 * Render amount as HTML, which non-breaking space between
 * decimal value and currency.
 */
export function renderAmount(amount: AmountJson) {
  const x = amount.value + amount.fraction / Amounts.fractionalBase;
  return <span>{x}&nbsp;{amount.currency}</span>;
}

export const AmountDisplay = ({amount}: {amount: AmountJson}) => renderAmount(amount);


/**
 * Abbreviate a string to a given length, and show the full
 * string on hover as a tooltip.
 */
export function abbrev(s: string, n: number = 5) {
  let sAbbrev = s;
  if (s.length > n) {
    sAbbrev = s.slice(0, n) + "..";
  }
  return (
    <span className="abbrev" title={s}>
      {sAbbrev}
    </span>
  );
}



interface CollapsibleState {
  collapsed: boolean;
}

interface CollapsibleProps {
  initiallyCollapsed: boolean;
  title: string;
}

export class Collapsible extends React.Component<CollapsibleProps, CollapsibleState> {
  constructor(props: CollapsibleProps) {
    super(props);
    this.state = { collapsed: props.initiallyCollapsed };
  }
  render() {
    const doOpen = (e: any) => {
      this.setState({collapsed: false});
      e.preventDefault();
    };
    const doClose = (e: any) => {
      this.setState({collapsed: true});
      e.preventDefault();
    };
    if (this.state.collapsed) {
      return <h2><a className="opener opener-collapsed" href="#" onClick={doOpen}>{this.props.title}</a></h2>;
    }
    return (
      <div>
        <h2><a className="opener opener-open" href="#" onClick={doClose}>{this.props.title}</a></h2>
        {this.props.children}
      </div>
    );
  }
}
