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

 SPDX-License-Identifier: AGPL3.0-or-later
*/

/**
 * Imports.
 */
import {
  Headers,
  HttpRequestLibrary,
  HttpRequestOptions,
  HttpResponse,
} from "../util/http";
import { RequestThrottler } from "../util/RequestThrottler";
import Axios, { AxiosResponse } from "axios";
import { OperationFailedError, makeErrorDetails } from "../operations/errors";
import { TalerErrorCode } from "../TalerErrorCode";
import { URL } from "../util/url";
import { Logger } from "../util/logging";

const logger = new Logger("NodeHttpLib.ts");

/**
 * Implementation of the HTTP request library interface for node.
 */
export class NodeHttpLib implements HttpRequestLibrary {
  private throttle = new RequestThrottler();
  private throttlingEnabled = true;

  /**
   * Set whether requests should be throttled.
   */
  setThrottling(enabled: boolean): void {
    this.throttlingEnabled = enabled;
  }

  private async req(
    method: "POST" | "GET",
    url: string,
    body: any,
    opt?: HttpRequestOptions,
  ): Promise<HttpResponse> {
    const parsedUrl = new URL(url);
    if (this.throttlingEnabled && this.throttle.applyThrottle(url)) {
      throw OperationFailedError.fromCode(
        TalerErrorCode.WALLET_HTTP_REQUEST_THROTTLED,
        `request to origin ${parsedUrl.origin} was throttled`,
        {
          requestMethod: method,
          requestUrl: url,
          throttleStats: this.throttle.getThrottleStats(url),
        },
      );
    }
    let timeout: number | undefined;
    if (typeof opt?.timeout?.d_ms === "number") {
      timeout = opt.timeout.d_ms;
    }
    let resp: AxiosResponse;
    try {
      resp = await Axios({
        method,
        url: url,
        responseType: "text",
        headers: opt?.headers,
        validateStatus: () => true,
        transformResponse: (x) => x,
        data: body,
        timeout,
      });
    } catch (e) {
      throw OperationFailedError.fromCode(
        TalerErrorCode.WALLET_NETWORK_ERROR,
        `${e.message}`,
        {
          requestUrl: url,
          requestMethod: method,
        },
      );
    }

    const respText = resp.data;
    if (typeof respText !== "string") {
      throw new OperationFailedError(
        makeErrorDetails(
          TalerErrorCode.WALLET_RECEIVED_MALFORMED_RESPONSE,
          "unexpected response type",
          {
            httpStatusCode: resp.status,
            requestUrl: url,
            requestMethod: method,
          },
        ),
      );
    }
    const makeJson = async (): Promise<any> => {
      let responseJson;
      try {
        responseJson = JSON.parse(respText);
      } catch (e) {
        logger.trace(`invalid json: '${respText}'`);
        throw new OperationFailedError(
          makeErrorDetails(
            TalerErrorCode.WALLET_RECEIVED_MALFORMED_RESPONSE,
            "invalid JSON",
            {
              httpStatusCode: resp.status,
              requestUrl: url,
              requestMethod: method,
            },
          ),
        );
      }
      if (responseJson === null || typeof responseJson !== "object") {
        logger.trace(`invalid json (not an object): '${respText}'`);
        throw new OperationFailedError(
          makeErrorDetails(
            TalerErrorCode.WALLET_RECEIVED_MALFORMED_RESPONSE,
            "invalid JSON",
            {
              httpStatusCode: resp.status,
              requestUrl: url,
              requestMethod: method,
            },
          ),
        );
      }
      return responseJson;
    };
    const headers = new Headers();
    for (const hn of Object.keys(resp.headers)) {
      headers.set(hn, resp.headers[hn]);
    }
    return {
      requestUrl: url,
      requestMethod: method,
      headers,
      status: resp.status,
      text: async () => resp.data,
      json: makeJson,
    };
  }

  async get(url: string, opt?: HttpRequestOptions): Promise<HttpResponse> {
    return this.req("GET", url, undefined, opt);
  }

  async postJson(
    url: string,
    body: any,
    opt?: HttpRequestOptions,
  ): Promise<HttpResponse> {
    return this.req("POST", url, body, opt);
  }
}