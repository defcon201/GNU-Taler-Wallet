/*
 This file is part of TALER
 (C) 2015 GNUnet e.V.

 TALER is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 TALER is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 TALER; see the file COPYING.  If not, If not, see <http://www.gnu.org/licenses/>
 */

// Script that is injected into pages in order to allow merchants pages to
// query the availability of Taler.

/// <reference path="../lib/decl/chrome/chrome.d.ts" />

"use strict";

console.log("Taler injected");

document.addEventListener("taler-probe", function(e) {
  let evt = new Event("taler-wallet-present");
  document.dispatchEvent(evt);
  console.log("handshake done");
});

document.addEventListener("taler-create-reserve", function(e: CustomEvent) {
  let $ = (x) => document.getElementById(x);
  console.log("taler-create-reserve with " + JSON.stringify(e.detail));
  let form_uri = (<HTMLFormElement>$(e.detail.form_id)).action;
  // TODO: validate event fields
  // TODO: also send extra bank-defined form fields
  let params = {
    post_url: URI(form_uri).absoluteTo(document.location.href).href(),
    // TODO: This should change in the future, we should not deal with the
    // amount as a bank-specific string here.
    amount_str: (<HTMLInputElement>$(e.detail.input_amount)).value,
    // TODO:  This double indirection is way too much ...
    field_amount: (<HTMLInputElement>$(e.detail.input_amount)).name,
    field_reserve_pub: (<HTMLInputElement>$(e.detail.input_pub)).name,
    field_mint: (<HTMLInputElement>$(e.detail.mint_rcv)).name,
  };
  let uri = URI(chrome.extension.getURL("pages/confirm-create-reserve.html"));
  document.location.href = uri.query(params).href();
});

document.addEventListener("taler-contract", function(e: CustomEvent) {
  // XXX: the merchant should just give us the parsed data ...
  let offer = JSON.parse(e.detail);
  let uri = URI(chrome.extension.getURL("pages/confirm-contract.html"));
  let params = {
    offer: JSON.stringify(offer),
    merchantPageUrl: document.location.href,
    cookie: document.cookie,
  };
  document.location.href = uri.query(params).href();
});


document.addEventListener('taler-execute-payment', function(e: CustomEvent) {
  console.log("got taler-execute-payment in content page");
  let msg = {
    type: "execute-payment",
    detail: {
      H_contract: e.detail.H_contract
    },
  };
  chrome.runtime.sendMessage(msg, (resp) => {
    if (!resp.success) {
      console.log("failure!");
      return;
    }
    console.log("Making request to ", resp.payUrl);
    let r = new XMLHttpRequest();
    r.open('post', resp.payUrl);
    r.send(JSON.stringify(resp.payReq));
    let detail: any = {};
    r.onload = (e) => {
      switch (r.status) {
        case 200:
          detail.success = true;
          // Not supported by some browsers ...
          detail.fulfillmentUrl = (<any>r).responseURL;
          break;
        case 301:
          detail.success = true;
          console.log("Headers:", r.getAllResponseHeaders());
          detail.fulfillmentUrl = r.getResponseHeader('Location');
          break;
        default:
          detail.success = false;
          break;
      }
      detail.status = r.status;
      detail.responseText = r.responseText;
      document.dispatchEvent(new CustomEvent("taler-payment-result", {detail: detail}));
    };
  });
});
