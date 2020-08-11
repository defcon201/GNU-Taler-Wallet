'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var os = _interopDefault(require('os'));
var http = _interopDefault(require('http'));
var https = _interopDefault(require('https'));
var url = _interopDefault(require('url'));
var assert = _interopDefault(require('assert'));
var stream = _interopDefault(require('stream'));
var tty = _interopDefault(require('tty'));
var util = _interopDefault(require('util'));
var zlib = _interopDefault(require('zlib'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/*
 This file is part of GNU Taler
 (C) 2018-2019 GNUnet e.V.

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
 * Type-safe codecs for converting from/to JSON.
 */
/* eslint-disable @typescript-eslint/ban-types */
/**
 * Error thrown when decoding fails.
 */
class DecodingError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, DecodingError.prototype);
        this.name = "DecodingError";
    }
}
function renderContext(c) {
    const p = c === null || c === void 0 ? void 0 : c.path;
    if (p) {
        return p.join(".");
    }
    else {
        return "(unknown)";
    }
}
function joinContext(c, part) {
    var _a;
    const path = (_a = c === null || c === void 0 ? void 0 : c.path) !== null && _a !== void 0 ? _a : [];
    return {
        path: path.concat([part]),
    };
}
class ObjectCodecBuilder {
    constructor() {
        this.propList = [];
    }
    /**
     * Define a property for the object.
     */
    property(x, codec) {
        if (!codec) {
            throw Error("inner codec must be defined");
        }
        this.propList.push({ name: x, codec: codec });
        return this;
    }
    /**
     * Return the built codec.
     *
     * @param objectDisplayName name of the object that this codec operates on,
     *   used in error messages.
     */
    build(objectDisplayName) {
        const propList = this.propList;
        return {
            decode(x, c) {
                if (!c) {
                    c = {
                        path: [`(${objectDisplayName})`],
                    };
                }
                if (typeof x !== "object") {
                    throw new DecodingError(`expected object for ${objectDisplayName} at ${renderContext(c)} but got ${typeof x}`);
                }
                const obj = {};
                for (const prop of propList) {
                    const propRawVal = x[prop.name];
                    const propVal = prop.codec.decode(propRawVal, joinContext(c, prop.name));
                    obj[prop.name] = propVal;
                }
                return obj;
            },
        };
    }
}
class UnionCodecBuilder {
    constructor(discriminator, baseCodec) {
        this.discriminator = discriminator;
        this.baseCodec = baseCodec;
        this.alternatives = new Map();
    }
    /**
     * Define a property for the object.
     */
    alternative(tagValue, codec) {
        if (!codec) {
            throw Error("inner codec must be defined");
        }
        this.alternatives.set(tagValue, { codec, tagValue });
        return this;
    }
    /**
     * Return the built codec.
     *
     * @param objectDisplayName name of the object that this codec operates on,
     *   used in error messages.
     */
    build(objectDisplayName) {
        const alternatives = this.alternatives;
        const discriminator = this.discriminator;
        const baseCodec = this.baseCodec;
        return {
            decode(x, c) {
                if (!c) {
                    c = {
                        path: [`(${objectDisplayName})`],
                    };
                }
                const d = x[discriminator];
                if (d === undefined) {
                    throw new DecodingError(`expected tag for ${objectDisplayName} at ${renderContext(c)}.${discriminator}`);
                }
                const alt = alternatives.get(d);
                if (!alt) {
                    throw new DecodingError(`unknown tag for ${objectDisplayName} ${d} at ${renderContext(c)}.${discriminator}`);
                }
                const altDecoded = alt.codec.decode(x);
                if (baseCodec) {
                    const baseDecoded = baseCodec.decode(x, c);
                    return Object.assign(Object.assign({}, baseDecoded), altDecoded);
                }
                else {
                    return altDecoded;
                }
            },
        };
    }
}
class UnionCodecPreBuilder {
    discriminateOn(discriminator, baseCodec) {
        return new UnionCodecBuilder(discriminator, baseCodec);
    }
}
/**
 * Return a builder for a codec that decodes an object with properties.
 */
function makeCodecForObject() {
    return new ObjectCodecBuilder();
}
function makeCodecForUnion() {
    return new UnionCodecPreBuilder();
}
/**
 * Return a codec for a mapping from a string to values described by the inner codec.
 */
function makeCodecForMap(innerCodec) {
    if (!innerCodec) {
        throw Error("inner codec must be defined");
    }
    return {
        decode(x, c) {
            const map = {};
            if (typeof x !== "object") {
                throw new DecodingError(`expected object at ${renderContext(c)}`);
            }
            for (const i in x) {
                map[i] = innerCodec.decode(x[i], joinContext(c, `[${i}]`));
            }
            return map;
        },
    };
}
/**
 * Return a codec for a list, containing values described by the inner codec.
 */
function makeCodecForList(innerCodec) {
    if (!innerCodec) {
        throw Error("inner codec must be defined");
    }
    return {
        decode(x, c) {
            const arr = [];
            if (!Array.isArray(x)) {
                throw new DecodingError(`expected array at ${renderContext(c)}`);
            }
            for (const i in x) {
                arr.push(innerCodec.decode(x[i], joinContext(c, `[${i}]`)));
            }
            return arr;
        },
    };
}
/**
 * Return a codec for a value that must be a number.
 */
const codecForNumber = {
    decode(x, c) {
        if (typeof x === "number") {
            return x;
        }
        throw new DecodingError(`expected number at ${renderContext(c)} but got ${typeof x}`);
    },
};
/**
 * Return a codec for a value that must be a number.
 */
const codecForBoolean = {
    decode(x, c) {
        if (typeof x === "boolean") {
            return x;
        }
        throw new DecodingError(`expected boolean at ${renderContext(c)} but got ${typeof x}`);
    },
};
/**
 * Return a codec for a value that must be a string.
 */
const codecForString = {
    decode(x, c) {
        if (typeof x === "string") {
            return x;
        }
        throw new DecodingError(`expected string at ${renderContext(c)} but got ${typeof x}`);
    },
};
/**
 * Codec that allows any value.
 */
const codecForAny = {
    decode(x, c) {
        return x;
    },
};
/**
 * Return a codec for a value that must be a string.
 */
function makeCodecForConstString(s) {
    return {
        decode(x, c) {
            if (x === s) {
                return x;
            }
            throw new DecodingError(`expected string constant "${s}" at ${renderContext(c)}  but got ${typeof x}`);
        },
    };
}
/**
 * Return a codec for a value that must be a constant number.
 */
function makeCodecForConstNumber(n) {
    return {
        decode(x, c) {
            if (x === n) {
                return x;
            }
            throw new DecodingError(`expected number constant "${n}" at ${renderContext(c)}  but got ${typeof x}`);
        },
    };
}
function makeCodecOptional(innerCodec) {
    return {
        decode(x, c) {
            if (x === undefined || x === null) {
                return undefined;
            }
            return innerCodec.decode(x, c);
        },
    };
}

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
 * Number of fractional units that one value unit represents.
 */
const fractionalBase = 1e8;
/**
 * How many digits behind the comma are required to represent the
 * fractional value in human readable decimal format?  Must match
 * lg(fractionalBase)
 */
const fractionalLength = 8;
/**
 * Maximum allowed value field of an amount.
 */
const maxAmountValue = Math.pow(2, 52);
/**
 * Get an amount that represents zero units of a currency.
 */
function getZero(currency) {
    return {
        currency,
        fraction: 0,
        value: 0,
    };
}
function sum(amounts) {
    if (amounts.length <= 0) {
        throw Error("can't sum zero amounts");
    }
    return add(amounts[0], ...amounts.slice(1));
}
/**
 * Add two amounts.  Return the result and whether
 * the addition overflowed.  The overflow is always handled
 * by saturating and never by wrapping.
 *
 * Throws when currencies don't match.
 */
function add(first, ...rest) {
    const currency = first.currency;
    let value = first.value + Math.floor(first.fraction / fractionalBase);
    if (value > maxAmountValue) {
        return {
            amount: { currency, value: maxAmountValue, fraction: fractionalBase - 1 },
            saturated: true,
        };
    }
    let fraction = first.fraction % fractionalBase;
    for (const x of rest) {
        if (x.currency !== currency) {
            throw Error(`Mismatched currency: ${x.currency} and ${currency}`);
        }
        value =
            value + x.value + Math.floor((fraction + x.fraction) / fractionalBase);
        fraction = Math.floor((fraction + x.fraction) % fractionalBase);
        if (value > maxAmountValue) {
            return {
                amount: {
                    currency,
                    value: maxAmountValue,
                    fraction: fractionalBase - 1,
                },
                saturated: true,
            };
        }
    }
    return { amount: { currency, value, fraction }, saturated: false };
}
/**
 * Subtract two amounts.  Return the result and whether
 * the subtraction overflowed.  The overflow is always handled
 * by saturating and never by wrapping.
 *
 * Throws when currencies don't match.
 */
function sub(a, ...rest) {
    const currency = a.currency;
    let value = a.value;
    let fraction = a.fraction;
    for (const b of rest) {
        if (b.currency !== currency) {
            throw Error(`Mismatched currency: ${b.currency} and ${currency}`);
        }
        if (fraction < b.fraction) {
            if (value < 1) {
                return { amount: { currency, value: 0, fraction: 0 }, saturated: true };
            }
            value--;
            fraction += fractionalBase;
        }
        console.assert(fraction >= b.fraction);
        fraction -= b.fraction;
        if (value < b.value) {
            return { amount: { currency, value: 0, fraction: 0 }, saturated: true };
        }
        value -= b.value;
    }
    return { amount: { currency, value, fraction }, saturated: false };
}
/**
 * Compare two amounts.  Returns 0 when equal, -1 when a < b
 * and +1 when a > b.  Throws when currencies don't match.
 */
function cmp(a, b) {
    if (a.currency !== b.currency) {
        throw Error(`Mismatched currency: ${a.currency} and ${b.currency}`);
    }
    const av = a.value + Math.floor(a.fraction / fractionalBase);
    const af = a.fraction % fractionalBase;
    const bv = b.value + Math.floor(b.fraction / fractionalBase);
    const bf = b.fraction % fractionalBase;
    switch (true) {
        case av < bv:
            return -1;
        case av > bv:
            return 1;
        case af < bf:
            return -1;
        case af > bf:
            return 1;
        case af === bf:
            return 0;
        default:
            throw Error("assertion failed");
    }
}
/**
 * Create a copy of an amount.
 */
function copy(a) {
    return {
        currency: a.currency,
        fraction: a.fraction,
        value: a.value,
    };
}
/**
 * Divide an amount.  Throws on division by zero.
 */
function divide(a, n) {
    if (n === 0) {
        throw Error(`Division by 0`);
    }
    if (n === 1) {
        return { value: a.value, fraction: a.fraction, currency: a.currency };
    }
    const r = a.value % n;
    return {
        currency: a.currency,
        fraction: Math.floor((r * fractionalBase + a.fraction) / n),
        value: Math.floor(a.value / n),
    };
}
function isZero(a) {
    return a.value === 0 && a.fraction === 0;
}
/**
 * Parse an amount like 'EUR:20.5' for 20 Euros and 50 ct.
 */
function parse(s) {
    const res = s.match(/^([a-zA-Z0-9_*-]+):([0-9]+)([.][0-9]+)?$/);
    if (!res) {
        return undefined;
    }
    const tail = res[3] || ".0";
    if (tail.length > fractionalLength + 1) {
        return undefined;
    }
    const value = Number.parseInt(res[2]);
    if (value > maxAmountValue) {
        return undefined;
    }
    return {
        currency: res[1],
        fraction: Math.round(fractionalBase * Number.parseFloat(tail)),
        value,
    };
}
/**
 * Parse amount in standard string form (like 'EUR:20.5'),
 * throw if the input is not a valid amount.
 */
function parseOrThrow(s) {
    const res = parse(s);
    if (!res) {
        throw Error(`Can't parse amount: "${s}"`);
    }
    return res;
}
/**
 * Convert a float to a Taler amount.
 * Loss of precision possible.
 */
function fromFloat(floatVal, currency) {
    return {
        currency,
        fraction: Math.floor((floatVal - Math.floor(floatVal)) * fractionalBase),
        value: Math.floor(floatVal),
    };
}
/**
 * Convert to standard human-readable string representation that's
 * also used in JSON formats.
 */
function stringify(a) {
    const av = a.value + Math.floor(a.fraction / fractionalBase);
    const af = a.fraction % fractionalBase;
    let s = av.toString();
    if (af) {
        s = s + ".";
        let n = af;
        for (let i = 0; i < fractionalLength; i++) {
            if (!n) {
                break;
            }
            s = s + Math.floor((n / fractionalBase) * 10).toString();
            n = (n * 10) % fractionalBase;
        }
    }
    return `${a.currency}:${s}`;
}
/**
 * Check if the argument is a valid amount in string form.
 */
function check(a) {
    if (typeof a !== "string") {
        return false;
    }
    try {
        const parsedAmount = parse(a);
        return !!parsedAmount;
    }
    catch (_a) {
        return false;
    }
}
function mult(a, n) {
    if (!Number.isInteger(n)) {
        throw Error("amount can only be multipied by an integer");
    }
    if (n < 0) {
        throw Error("amount can only be multiplied by a positive integer");
    }
    if (n == 0) {
        return { amount: getZero(a.currency), saturated: false };
    }
    let x = a;
    let acc = getZero(a.currency);
    while (n > 1) {
        if (n % 2 == 0) {
            n = n / 2;
        }
        else {
            n = (n - 1) / 2;
            const r2 = add(acc, x);
            if (r2.saturated) {
                return r2;
            }
            acc = r2.amount;
        }
        const r2 = add(x, x);
        if (r2.saturated) {
            return r2;
        }
        x = r2.amount;
    }
    return add(acc, x);
}
// Export all amount-related functions here for better IDE experience.
const Amounts = {
    stringify: stringify,
    parse: parse,
    parseOrThrow: parseOrThrow,
    cmp: cmp,
    add: add,
    sum: sum,
    sub: sub,
    mult: mult,
    check: check,
    getZero: getZero,
    isZero: isZero,
    maxAmountValue: maxAmountValue,
    fromFloat: fromFloat,
    copy: copy,
    fractionalBase: fractionalBase,
};

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

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
 * Get an unresolved promise together with its extracted resolve / reject
 * function.
 */
function openPromise() {
    let resolve = null;
    let reject = null;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    if (!(resolve && reject)) {
        // Never happens, unless JS implementation is broken
        throw Error();
    }
    return { resolve, reject, promise };
}
class AsyncCondition {
    constructor() {
        const op = openPromise();
        this._waitPromise = op.promise;
        this._resolveWaitPromise = op.resolve;
    }
    wait() {
        return this._waitPromise;
    }
    trigger() {
        this._resolveWaitPromise();
        const op = openPromise();
        this._waitPromise = op.promise;
        this._resolveWaitPromise = op.resolve;
    }
}

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
 * Exception that should be thrown by client code to abort a transaction.
 */
const TransactionAbort = Symbol("transaction_abort");
/**
 * Definition of an object store.
 */
class Store {
    constructor(name, storeParams, validator) {
        this.name = name;
        this.storeParams = storeParams;
        this.validator = validator;
    }
}
function requestToPromise(req) {
    const stack = Error("Failed request was started here.");
    return new Promise((resolve, reject) => {
        req.onsuccess = () => {
            resolve(req.result);
        };
        req.onerror = () => {
            console.log("error in DB request", req.error);
            reject(req.error);
            console.log("Request failed:", stack);
        };
    });
}
function transactionToPromise(tx) {
    const stack = Error("Failed transaction was started here.");
    return new Promise((resolve, reject) => {
        tx.onabort = () => {
            reject(TransactionAbort);
        };
        tx.oncomplete = () => {
            resolve();
        };
        tx.onerror = () => {
            console.error("Transaction failed:", stack);
            reject(tx.error);
        };
    });
}
function applyMutation(req, f) {
    return new Promise((resolve, reject) => {
        req.onsuccess = () => {
            const cursor = req.result;
            if (cursor) {
                const val = cursor.value;
                const modVal = f(val);
                if (modVal !== undefined && modVal !== null) {
                    const req2 = cursor.update(modVal);
                    req2.onerror = () => {
                        reject(req2.error);
                    };
                    req2.onsuccess = () => {
                        cursor.continue();
                    };
                }
                else {
                    cursor.continue();
                }
            }
            else {
                resolve();
            }
        };
        req.onerror = () => {
            reject(req.error);
        };
    });
}
class ResultStream {
    constructor(req) {
        this.req = req;
        this.gotCursorEnd = false;
        this.awaitingResult = false;
        this.awaitingResult = true;
        let p = openPromise();
        this.currentPromise = p.promise;
        req.onsuccess = () => {
            if (!this.awaitingResult) {
                throw Error("BUG: invariant violated");
            }
            const cursor = req.result;
            if (cursor) {
                this.awaitingResult = false;
                p.resolve();
                p = openPromise();
                this.currentPromise = p.promise;
            }
            else {
                this.gotCursorEnd = true;
                p.resolve();
            }
        };
        req.onerror = () => {
            p.reject(req.error);
        };
    }
    toArray() {
        return __awaiter(this, void 0, void 0, function* () {
            const arr = [];
            while (true) {
                const x = yield this.next();
                if (x.hasValue) {
                    arr.push(x.value);
                }
                else {
                    break;
                }
            }
            return arr;
        });
    }
    map(f) {
        return __awaiter(this, void 0, void 0, function* () {
            const arr = [];
            while (true) {
                const x = yield this.next();
                if (x.hasValue) {
                    arr.push(f(x.value));
                }
                else {
                    break;
                }
            }
            return arr;
        });
    }
    forEachAsync(f) {
        return __awaiter(this, void 0, void 0, function* () {
            while (true) {
                const x = yield this.next();
                if (x.hasValue) {
                    yield f(x.value);
                }
                else {
                    break;
                }
            }
        });
    }
    forEach(f) {
        return __awaiter(this, void 0, void 0, function* () {
            while (true) {
                const x = yield this.next();
                if (x.hasValue) {
                    f(x.value);
                }
                else {
                    break;
                }
            }
        });
    }
    filter(f) {
        return __awaiter(this, void 0, void 0, function* () {
            const arr = [];
            while (true) {
                const x = yield this.next();
                if (x.hasValue) {
                    if (f(x.value)) {
                        arr.push(x.value);
                    }
                }
                else {
                    break;
                }
            }
            return arr;
        });
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.gotCursorEnd) {
                return { hasValue: false };
            }
            if (!this.awaitingResult) {
                const cursor = this.req.result;
                if (!cursor) {
                    throw Error("assertion failed");
                }
                this.awaitingResult = true;
                cursor.continue();
            }
            yield this.currentPromise;
            if (this.gotCursorEnd) {
                return { hasValue: false };
            }
            const cursor = this.req.result;
            if (!cursor) {
                throw Error("assertion failed");
            }
            return { hasValue: true, value: cursor.value };
        });
    }
}
class TransactionHandle {
    constructor(tx) {
        this.tx = tx;
    }
    put(store, value, key) {
        const req = this.tx.objectStore(store.name).put(value, key);
        return requestToPromise(req);
    }
    add(store, value, key) {
        const req = this.tx.objectStore(store.name).add(value, key);
        return requestToPromise(req);
    }
    get(store, key) {
        const req = this.tx.objectStore(store.name).get(key);
        return requestToPromise(req);
    }
    getIndexed(index, key) {
        const req = this.tx
            .objectStore(index.storeName)
            .index(index.indexName)
            .get(key);
        return requestToPromise(req);
    }
    iter(store, key) {
        const req = this.tx.objectStore(store.name).openCursor(key);
        return new ResultStream(req);
    }
    iterIndexed(index, key) {
        const req = this.tx
            .objectStore(index.storeName)
            .index(index.indexName)
            .openCursor(key);
        return new ResultStream(req);
    }
    delete(store, key) {
        const req = this.tx.objectStore(store.name).delete(key);
        return requestToPromise(req);
    }
    mutate(store, key, f) {
        const req = this.tx.objectStore(store.name).openCursor(key);
        return applyMutation(req, f);
    }
}
function runWithTransaction(db, stores, f, mode) {
    const stack = Error("Failed transaction was started here.");
    return new Promise((resolve, reject) => {
        const storeName = stores.map((x) => x.name);
        const tx = db.transaction(storeName, mode);
        let funResult = undefined;
        let gotFunResult = false;
        tx.oncomplete = () => {
            // This is a fatal error: The transaction completed *before*
            // the transaction function returned.  Likely, the transaction
            // function waited on a promise that is *not* resolved in the
            // microtask queue, thus triggering the auto-commit behavior.
            // Unfortunately, the auto-commit behavior of IDB can't be switched
            // of.  There are some proposals to add this functionality in the future.
            if (!gotFunResult) {
                const msg = "BUG: transaction closed before transaction function returned";
                console.error(msg);
                reject(Error(msg));
            }
            resolve(funResult);
        };
        tx.onerror = () => {
            console.error("error in transaction");
            console.error(stack);
        };
        tx.onabort = () => {
            if (tx.error) {
                console.error("Transaction aborted with error:", tx.error);
            }
            else {
                console.log("Trasaction aborted (no error)");
            }
            reject(TransactionAbort);
        };
        const th = new TransactionHandle(tx);
        const resP = Promise.resolve().then(() => f(th));
        resP
            .then((result) => {
            gotFunResult = true;
            funResult = result;
        })
            .catch((e) => {
            if (e == TransactionAbort) {
                console.info("aborting transaction");
            }
            else {
                console.error("Transaction failed:", e);
                console.error(stack);
                tx.abort();
            }
        })
            .catch((e) => {
            console.error("fatal: aborting transaction failed", e);
        });
    });
}
/**
 * Definition of an index.
 */
class Index {
    constructor(s, indexName, keyPath, options) {
        this.indexName = indexName;
        this.keyPath = keyPath;
        const defaultOptions = {
            multiEntry: false,
        };
        this.options = Object.assign(Object.assign({}, defaultOptions), (options || {}));
        this.storeName = s.name;
    }
}
/**
 * Return a promise that resolves
 * to the taler wallet db.
 */
function openDatabase(idbFactory, databaseName, databaseVersion, onVersionChange, onUpgradeNeeded) {
    return new Promise((resolve, reject) => {
        const req = idbFactory.open(databaseName, databaseVersion);
        req.onerror = (e) => {
            console.log("taler database error", e);
            reject(new Error("database error"));
        };
        req.onsuccess = (e) => {
            req.result.onversionchange = (evt) => {
                console.log(`handling live db version change from ${evt.oldVersion} to ${evt.newVersion}`);
                req.result.close();
                onVersionChange();
            };
            resolve(req.result);
        };
        req.onupgradeneeded = (e) => {
            const db = req.result;
            const newVersion = e.newVersion;
            if (!newVersion) {
                throw Error("upgrade needed, but new version unknown");
            }
            onUpgradeNeeded(db, e.oldVersion, newVersion);
        };
    });
}
class Database {
    constructor(db) {
        this.db = db;
    }
    static deleteDatabase(idbFactory, dbName) {
        idbFactory.deleteDatabase(dbName);
    }
    exportDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.db;
            const dump = {
                name: db.name,
                stores: {},
                version: db.version,
            };
            return new Promise((resolve, reject) => {
                const tx = db.transaction(Array.from(db.objectStoreNames));
                tx.addEventListener("complete", () => {
                    resolve(dump);
                });
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < db.objectStoreNames.length; i++) {
                    const name = db.objectStoreNames[i];
                    const storeDump = {};
                    dump.stores[name] = storeDump;
                    tx.objectStore(name)
                        .openCursor()
                        .addEventListener("success", (e) => {
                        const cursor = e.target.result;
                        if (cursor) {
                            storeDump[cursor.key] = cursor.value;
                            cursor.continue();
                        }
                    });
                }
            });
        });
    }
    importDatabase(dump) {
        const db = this.db;
        console.log("importing db", dump);
        return new Promise((resolve, reject) => {
            const tx = db.transaction(Array.from(db.objectStoreNames), "readwrite");
            if (dump.stores) {
                for (const storeName in dump.stores) {
                    const objects = [];
                    const dumpStore = dump.stores[storeName];
                    for (const key in dumpStore) {
                        objects.push(dumpStore[key]);
                    }
                    console.log(`importing ${objects.length} records into ${storeName}`);
                    const store = tx.objectStore(storeName);
                    for (const obj of objects) {
                        store.put(obj);
                    }
                }
            }
            tx.addEventListener("complete", () => {
                resolve();
            });
        });
    }
    get(store, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = this.db.transaction([store.name], "readonly");
            const req = tx.objectStore(store.name).get(key);
            const v = yield requestToPromise(req);
            yield transactionToPromise(tx);
            return v;
        });
    }
    getIndexed(index, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = this.db.transaction([index.storeName], "readonly");
            const req = tx.objectStore(index.storeName).index(index.indexName).get(key);
            const v = yield requestToPromise(req);
            yield transactionToPromise(tx);
            return v;
        });
    }
    put(store, value, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = this.db.transaction([store.name], "readwrite");
            const req = tx.objectStore(store.name).put(value, key);
            const v = yield requestToPromise(req);
            yield transactionToPromise(tx);
            return v;
        });
    }
    mutate(store, key, f) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = this.db.transaction([store.name], "readwrite");
            const req = tx.objectStore(store.name).openCursor(key);
            yield applyMutation(req, f);
            yield transactionToPromise(tx);
        });
    }
    iter(store) {
        const tx = this.db.transaction([store.name], "readonly");
        const req = tx.objectStore(store.name).openCursor();
        return new ResultStream(req);
    }
    iterIndex(index, query) {
        const tx = this.db.transaction([index.storeName], "readonly");
        const req = tx
            .objectStore(index.storeName)
            .index(index.indexName)
            .openCursor(query);
        return new ResultStream(req);
    }
    runWithReadTransaction(stores, f) {
        return __awaiter(this, void 0, void 0, function* () {
            return runWithTransaction(this.db, stores, f, "readonly");
        });
    }
    runWithWriteTransaction(stores, f) {
        return __awaiter(this, void 0, void 0, function* () {
            return runWithTransaction(this.db, stores, f, "readwrite");
        });
    }
}

let timeshift = 0;
function getTimestampNow() {
    return {
        t_ms: new Date().getTime() + timeshift,
    };
}
function getDurationRemaining(deadline, now = getTimestampNow()) {
    if (deadline.t_ms === "never") {
        return { d_ms: "forever" };
    }
    if (now.t_ms === "never") {
        throw Error("invalid argument for 'now'");
    }
    if (deadline.t_ms < now.t_ms) {
        return { d_ms: 0 };
    }
    return { d_ms: deadline.t_ms - now.t_ms };
}
/**
 * Truncate a timestamp so that that it represents a multiple
 * of seconds.  The timestamp is always rounded down.
 */
function timestampTruncateToSecond(t1) {
    if (t1.t_ms === "never") {
        return { t_ms: "never" };
    }
    return {
        t_ms: Math.floor(t1.t_ms / 1000) * 1000,
    };
}
function durationMin(d1, d2) {
    if (d1.d_ms === "forever") {
        return { d_ms: d2.d_ms };
    }
    if (d2.d_ms === "forever") {
        return { d_ms: d2.d_ms };
    }
    return { d_ms: Math.min(d1.d_ms, d2.d_ms) };
}
function timestampCmp(t1, t2) {
    if (t1.t_ms === "never") {
        if (t2.t_ms === "never") {
            return 0;
        }
        return 1;
    }
    if (t2.t_ms === "never") {
        return -1;
    }
    if (t1.t_ms == t2.t_ms) {
        return 0;
    }
    if (t1.t_ms > t2.t_ms) {
        return 1;
    }
    return -1;
}
function timestampAddDuration(t1, d) {
    if (t1.t_ms === "never" || d.d_ms === "forever") {
        return { t_ms: "never" };
    }
    return { t_ms: t1.t_ms + d.d_ms };
}
function timestampSubtractDuraction(t1, d) {
    if (t1.t_ms === "never") {
        return { t_ms: "never" };
    }
    if (d.d_ms === "forever") {
        return { t_ms: 0 };
    }
    return { t_ms: Math.max(0, t1.t_ms - d.d_ms) };
}
function timestampDifference(t1, t2) {
    if (t1.t_ms === "never") {
        return { d_ms: "forever" };
    }
    if (t2.t_ms === "never") {
        return { d_ms: "forever" };
    }
    return { d_ms: Math.abs(t1.t_ms - t2.t_ms) };
}
const codecForTimestamp = {
    decode(x, c) {
        const t_ms = x.t_ms;
        if (typeof t_ms === "string") {
            if (t_ms === "never") {
                return { t_ms: "never" };
            }
            throw Error(`expected timestamp at ${renderContext(c)}`);
        }
        if (typeof t_ms === "number") {
            return { t_ms };
        }
        throw Error(`expected timestamp at ${renderContext(c)}`);
    },
};
const codecForDuration = {
    decode(x, c) {
        const d_ms = x.d_ms;
        if (typeof d_ms === "string") {
            if (d_ms === "forever") {
                return { d_ms: "forever" };
            }
            throw Error(`expected duration at ${renderContext(c)}`);
        }
        if (typeof d_ms === "number") {
            return { d_ms };
        }
        throw Error(`expected duration at ${renderContext(c)}`);
    },
};

/*
 This file is part of GNU Taler
 (C) 2018-2020 Taler Systems S.A.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
var ReserveRecordStatus;
(function (ReserveRecordStatus) {
    /**
     * Reserve must be registered with the bank.
     */
    ReserveRecordStatus["REGISTERING_BANK"] = "registering-bank";
    /**
     * We've registered reserve's information with the bank
     * and are now waiting for the user to confirm the withdraw
     * with the bank (typically 2nd factor auth).
     */
    ReserveRecordStatus["WAIT_CONFIRM_BANK"] = "wait-confirm-bank";
    /**
     * Querying reserve status with the exchange.
     */
    ReserveRecordStatus["QUERYING_STATUS"] = "querying-status";
    /**
     * Status is queried, the wallet must now select coins
     * and start withdrawing.
     */
    ReserveRecordStatus["WITHDRAWING"] = "withdrawing";
    /**
     * The corresponding withdraw record has been created.
     * No further processing is done, unless explicitly requested
     * by the user.
     */
    ReserveRecordStatus["DORMANT"] = "dormant";
})(ReserveRecordStatus || (ReserveRecordStatus = {}));
const defaultRetryPolicy = {
    backoffBase: 1.5,
    backoffDelta: { d_ms: 200 },
};
function updateRetryInfoTimeout(r, p = defaultRetryPolicy) {
    const now = getTimestampNow();
    if (now.t_ms === "never") {
        throw Error("assertion failed");
    }
    if (p.backoffDelta.d_ms === "forever") {
        r.nextRetry = { t_ms: "never" };
        return;
    }
    const t = now.t_ms + p.backoffDelta.d_ms * Math.pow(p.backoffBase, r.retryCounter);
    r.nextRetry = { t_ms: t };
}
function initRetryInfo(active = true, p = defaultRetryPolicy) {
    if (!active) {
        return {
            active: false,
            firstTry: { t_ms: Number.MAX_SAFE_INTEGER },
            nextRetry: { t_ms: Number.MAX_SAFE_INTEGER },
            retryCounter: 0,
        };
    }
    const info = {
        firstTry: getTimestampNow(),
        active: true,
        nextRetry: { t_ms: 0 },
        retryCounter: 0,
    };
    updateRetryInfoTimeout(info, p);
    return info;
}
/**
 * Status of a denomination.
 */
var DenominationStatus;
(function (DenominationStatus) {
    /**
     * Verification was delayed.
     */
    DenominationStatus[DenominationStatus["Unverified"] = 0] = "Unverified";
    /**
     * Verified as valid.
     */
    DenominationStatus[DenominationStatus["VerifiedGood"] = 1] = "VerifiedGood";
    /**
     * Verified as invalid.
     */
    DenominationStatus[DenominationStatus["VerifiedBad"] = 2] = "VerifiedBad";
})(DenominationStatus || (DenominationStatus = {}));
/* tslint:disable:completed-docs */
class ExchangesStore extends Store {
    constructor() {
        super("exchanges", { keyPath: "baseUrl" });
    }
}
class CoinsStore extends Store {
    constructor() {
        super("coins", { keyPath: "coinPub" });
        this.exchangeBaseUrlIndex = new Index(this, "exchangeBaseUrl", "exchangeBaseUrl");
        this.denomPubIndex = new Index(this, "denomPubIndex", "denomPub");
        this.denomPubHashIndex = new Index(this, "denomPubHashIndex", "denomPubHash");
    }
}
class ProposalsStore extends Store {
    constructor() {
        super("proposals", { keyPath: "proposalId" });
        this.urlAndOrderIdIndex = new Index(this, "urlIndex", [
            "merchantBaseUrl",
            "orderId",
        ]);
    }
}
class PurchasesStore extends Store {
    constructor() {
        super("purchases", { keyPath: "proposalId" });
        this.fulfillmentUrlIndex = new Index(this, "fulfillmentUrlIndex", "contractData.fulfillmentUrl");
        this.orderIdIndex = new Index(this, "orderIdIndex", [
            "contractData.merchantBaseUrl",
            "contractData.orderId",
        ]);
    }
}
class DenominationsStore extends Store {
    constructor() {
        // cast needed because of bug in type annotations
        super("denominations", {
            keyPath: ["exchangeBaseUrl", "denomPub"],
        });
        this.denomPubHashIndex = new Index(this, "denomPubHashIndex", "denomPubHash");
        this.exchangeBaseUrlIndex = new Index(this, "exchangeBaseUrlIndex", "exchangeBaseUrl");
        this.denomPubIndex = new Index(this, "denomPubIndex", "denomPub");
    }
}
class CurrenciesStore extends Store {
    constructor() {
        super("currencies", { keyPath: "name" });
    }
}
class ConfigStore extends Store {
    constructor() {
        super("config", { keyPath: "key" });
    }
}
class ReservesStore extends Store {
    constructor() {
        super("reserves", { keyPath: "reservePub" });
    }
}
class ReserveHistoryStore extends Store {
    constructor() {
        super("reserveHistory", { keyPath: "reservePub" });
    }
}
class TipsStore extends Store {
    constructor() {
        super("tips", { keyPath: "tipId" });
    }
}
class SenderWiresStore extends Store {
    constructor() {
        super("senderWires", { keyPath: "paytoUri" });
    }
}
class WithdrawalGroupsStore extends Store {
    constructor() {
        super("withdrawals", { keyPath: "withdrawalGroupId" });
    }
}
class PlanchetsStore extends Store {
    constructor() {
        super("planchets", { keyPath: "coinPub" });
        this.byGroupAndIndex = new Index(this, "withdrawalGroupAndCoinIdxIndex", ["withdrawalGroupId", "coinIdx"]);
        this.byGroup = new Index(this, "withdrawalGroupIndex", "withdrawalGroupId");
    }
}
class RefundEventsStore extends Store {
    constructor() {
        super("refundEvents", { keyPath: "refundGroupId" });
    }
}
class PayEventsStore extends Store {
    constructor() {
        super("payEvents", { keyPath: "proposalId" });
    }
}
class ExchangeUpdatedEventsStore extends Store {
    constructor() {
        super("exchangeUpdatedEvents", { keyPath: "exchangeBaseUrl" });
    }
}
class ReserveUpdatedEventsStore extends Store {
    constructor() {
        super("reserveUpdatedEvents", { keyPath: "reservePub" });
    }
}
class BankWithdrawUrisStore extends Store {
    constructor() {
        super("bankWithdrawUris", { keyPath: "talerWithdrawUri" });
    }
}
class WalletImportsStore extends Store {
    constructor() {
        super("walletImports", { keyPath: "walletImportId" });
    }
}
/**
 * The stores and indices for the wallet database.
 */
const Stores = {
    coins: new CoinsStore(),
    coinsReturns: new Store("coinsReturns", {
        keyPath: "contractTermsHash",
    }),
    config: new ConfigStore(),
    currencies: new CurrenciesStore(),
    denominations: new DenominationsStore(),
    exchanges: new ExchangesStore(),
    proposals: new ProposalsStore(),
    refreshGroups: new Store("refreshGroups", {
        keyPath: "refreshGroupId",
    }),
    recoupGroups: new Store("recoupGroups", {
        keyPath: "recoupGroupId",
    }),
    reserves: new ReservesStore(),
    reserveHistory: new ReserveHistoryStore(),
    purchases: new PurchasesStore(),
    tips: new TipsStore(),
    senderWires: new SenderWiresStore(),
    withdrawalGroups: new WithdrawalGroupsStore(),
    planchets: new PlanchetsStore(),
    bankWithdrawUris: new BankWithdrawUrisStore(),
    refundEvents: new RefundEventsStore(),
    payEvents: new PayEventsStore(),
    reserveUpdatedEvents: new ReserveUpdatedEventsStore(),
    exchangeUpdatedEvents: new ExchangeUpdatedEventsStore(),
    walletImports: new WalletImportsStore(),
};
/* tslint:enable:completed-docs */

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
const codecForBankWithdrawalOperationPostResponse = () => makeCodecForObject()
    .property("transfer_done", codecForBoolean)
    .build("BankWithdrawalOperationPostResponse");
const codecForDenomination = () => makeCodecForObject()
    .property("value", codecForString)
    .property("denom_pub", codecForString)
    .property("fee_withdraw", codecForString)
    .property("fee_deposit", codecForString)
    .property("fee_refresh", codecForString)
    .property("fee_refund", codecForString)
    .property("stamp_start", codecForTimestamp)
    .property("stamp_expire_withdraw", codecForTimestamp)
    .property("stamp_expire_legal", codecForTimestamp)
    .property("stamp_expire_deposit", codecForTimestamp)
    .property("master_sig", codecForString)
    .build("Denomination");
const codecForAuditorDenomSig = () => makeCodecForObject()
    .property("denom_pub_h", codecForString)
    .property("auditor_sig", codecForString)
    .build("AuditorDenomSig");
const codecForAuditor = () => makeCodecForObject()
    .property("auditor_pub", codecForString)
    .property("auditor_url", codecForString)
    .property("denomination_keys", makeCodecForList(codecForAuditorDenomSig()))
    .build("Auditor");
const codecForExchangeHandle = () => makeCodecForObject()
    .property("master_pub", codecForString)
    .property("url", codecForString)
    .build("ExchangeHandle");
const codecForAuditorHandle = () => makeCodecForObject()
    .property("name", codecForString)
    .property("master_pub", codecForString)
    .property("url", codecForString)
    .build("AuditorHandle");
const codecForMerchantInfo = () => makeCodecForObject()
    .property("name", codecForString)
    .property("address", makeCodecOptional(codecForString))
    .property("jurisdiction", makeCodecOptional(codecForString))
    .build("MerchantInfo");
const codecForI18n = () => makeCodecForMap(codecForString);
const codecForProduct = () => makeCodecForObject()
    .property("product_id", makeCodecOptional(codecForString))
    .property("description", codecForString)
    .property("description_i18n", makeCodecOptional(codecForI18n()))
    .property("quantity", makeCodecOptional(codecForNumber))
    .property("unit", makeCodecOptional(codecForString))
    .property("price", makeCodecOptional(codecForString))
    .property("delivery_date", makeCodecOptional(codecForTimestamp))
    .property("delivery_location", makeCodecOptional(codecForString))
    .build("Tax");
const codecForContractTerms = () => makeCodecForObject()
    .property("order_id", codecForString)
    .property("fulfillment_url", codecForString)
    .property("merchant_base_url", codecForString)
    .property("h_wire", codecForString)
    .property("auto_refund", makeCodecOptional(codecForDuration))
    .property("wire_method", codecForString)
    .property("summary", codecForString)
    .property("summary_i18n", makeCodecOptional(codecForI18n()))
    .property("nonce", codecForString)
    .property("amount", codecForString)
    .property("auditors", makeCodecForList(codecForAuditorHandle()))
    .property("pay_deadline", codecForTimestamp)
    .property("refund_deadline", codecForTimestamp)
    .property("wire_transfer_deadline", codecForTimestamp)
    .property("timestamp", codecForTimestamp)
    .property("locations", codecForAny)
    .property("max_fee", codecForString)
    .property("max_wire_fee", makeCodecOptional(codecForString))
    .property("merchant", codecForMerchantInfo())
    .property("merchant_pub", codecForString)
    .property("exchanges", makeCodecForList(codecForExchangeHandle()))
    .property("products", makeCodecOptional(makeCodecForList(codecForProduct())))
    .property("extra", codecForAny)
    .build("ContractTerms");
const codecForReserveSigSingleton = () => makeCodecForObject()
    .property("reserve_sig", codecForString)
    .build("ReserveSigSingleton");
const codecForTipResponse = () => makeCodecForObject()
    .property("reserve_pub", codecForString)
    .property("reserve_sigs", makeCodecForList(codecForReserveSigSingleton()))
    .build("TipResponse");
const codecForRecoup = () => makeCodecForObject()
    .property("h_denom_pub", codecForString)
    .build("Recoup");
const codecForExchangeSigningKey = () => makeCodecForObject()
    .property("key", codecForString)
    .property("master_sig", codecForString)
    .property("stamp_end", codecForTimestamp)
    .property("stamp_start", codecForTimestamp)
    .property("stamp_expire", codecForTimestamp)
    .build("ExchangeSignKeyJson");
const codecForExchangeKeysJson = () => makeCodecForObject()
    .property("denoms", makeCodecForList(codecForDenomination()))
    .property("master_public_key", codecForString)
    .property("auditors", makeCodecForList(codecForAuditor()))
    .property("list_issue_date", codecForTimestamp)
    .property("recoup", makeCodecOptional(makeCodecForList(codecForRecoup())))
    .property("signkeys", makeCodecForList(codecForExchangeSigningKey()))
    .property("version", codecForString)
    .build("KeysJson");
const codecForWireFeesJson = () => makeCodecForObject()
    .property("wire_fee", codecForString)
    .property("closing_fee", codecForString)
    .property("sig", codecForString)
    .property("start_date", codecForTimestamp)
    .property("end_date", codecForTimestamp)
    .build("WireFeesJson");
const codecForAccountInfo = () => makeCodecForObject()
    .property("payto_uri", codecForString)
    .property("master_sig", codecForString)
    .build("AccountInfo");
const codecForExchangeWireJson = () => makeCodecForObject()
    .property("accounts", makeCodecForList(codecForAccountInfo()))
    .property("fees", makeCodecForMap(makeCodecForList(codecForWireFeesJson())))
    .build("ExchangeWireJson");
const codecForProposal = () => makeCodecForObject()
    .property("contract_terms", codecForAny)
    .property("sig", codecForString)
    .build("Proposal");
const codecForWithdrawOperationStatusResponse = () => makeCodecForObject()
    .property("selection_done", codecForBoolean)
    .property("transfer_done", codecForBoolean)
    .property("amount", codecForString)
    .property("sender_wire", makeCodecOptional(codecForString))
    .property("suggested_exchange", makeCodecOptional(codecForString))
    .property("confirm_transfer_url", makeCodecOptional(codecForString))
    .property("wire_types", makeCodecForList(codecForString))
    .build("WithdrawOperationStatusResponse");
const codecForTipPickupGetResponse = () => makeCodecForObject()
    .property("extra", codecForAny)
    .property("amount", codecForString)
    .property("amount_left", codecForString)
    .property("exchange_url", codecForString)
    .property("stamp_expire", codecForTimestamp)
    .property("stamp_created", codecForTimestamp)
    .build("TipPickupGetResponse");
const codecForRecoupConfirmation = () => makeCodecForObject()
    .property("reserve_pub", makeCodecOptional(codecForString))
    .property("old_coin_pub", makeCodecOptional(codecForString))
    .build("RecoupConfirmation");
const codecForWithdrawResponse = () => makeCodecForObject()
    .property("ev_sig", codecForString)
    .build("WithdrawResponse");
const codecForMerchantPayResponse = () => makeCodecForObject()
    .property("sig", codecForString)
    .build("MerchantPayResponse");
const codecForExchangeMeltResponse = () => makeCodecForObject()
    .property("exchange_pub", codecForString)
    .property("exchange_sig", codecForString)
    .property("noreveal_index", codecForNumber)
    .property("refresh_base_url", makeCodecOptional(codecForString))
    .build("ExchangeMeltResponse");
const codecForExchangeRevealItem = () => makeCodecForObject()
    .property("ev_sig", codecForString)
    .build("ExchangeRevealItem");
const codecForExchangeRevealResponse = () => makeCodecForObject()
    .property("ev_sigs", makeCodecForList(codecForExchangeRevealItem()))
    .build("ExchangeRevealResponse");
const codecForMerchantCoinRefundSuccessStatus = () => makeCodecForObject()
    .property("type", makeCodecForConstString("success"))
    .property("coin_pub", codecForString)
    .property("exchange_status", makeCodecForConstNumber(200))
    .property("exchange_sig", codecForString)
    .property("rtransaction_id", codecForNumber)
    .property("refund_amount", codecForString)
    .property("exchange_pub", codecForString)
    .property("execution_time", codecForTimestamp)
    .build("MerchantCoinRefundSuccessStatus");
const codecForMerchantCoinRefundFailureStatus = () => makeCodecForObject()
    .property("type", makeCodecForConstString("failure"))
    .property("coin_pub", codecForString)
    .property("exchange_status", makeCodecForConstNumber(200))
    .property("rtransaction_id", codecForNumber)
    .property("refund_amount", codecForString)
    .property("exchange_code", makeCodecOptional(codecForNumber))
    .property("exchange_reply", makeCodecOptional(codecForAny))
    .property("execution_time", codecForTimestamp)
    .build("MerchantCoinRefundSuccessStatus");
const codecForMerchantCoinRefundStatus = () => makeCodecForUnion()
    .discriminateOn("type")
    .alternative("success", codecForMerchantCoinRefundSuccessStatus())
    .alternative("failure", codecForMerchantCoinRefundFailureStatus())
    .build("MerchantCoinRefundStatus");
const codecForMerchantOrderStatusPaid = () => makeCodecForObject()
    .property("merchant_pub", codecForString)
    .property("refund_amount", codecForString)
    .property("refunded", codecForBoolean)
    .property("refunds", makeCodecForList(codecForMerchantCoinRefundStatus()))
    .build("MerchantOrderStatusPaid");

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
// @ts-ignore
const _URL = globalThis.URL;
if (!_URL) {
    throw Error("FATAL: URL not available");
}
const URL = _URL;
// @ts-ignore
const _URLSearchParams = globalThis.URLSearchParams;
if (!_URLSearchParams) {
    throw Error("FATAL: URLSearchParams not available");
}
const URLSearchParams$1 = _URLSearchParams;

/*
 This file is part of GNU Taler
 (C) 2019-2020 Taler Systems S.A.

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
 * Parse a taler[+http]://withdraw URI.
 * Return undefined if not passed a valid URI.
 */
function parseWithdrawUri(s) {
    const pi = parseProtoInfo(s, "withdraw");
    if (!pi) {
        return undefined;
    }
    const parts = pi.rest.split("/");
    if (parts.length < 2) {
        return undefined;
    }
    const host = parts[0].toLowerCase();
    const pathSegments = parts.slice(1, parts.length - 1);
    const withdrawId = parts[parts.length - 1];
    const p = [host, ...pathSegments].join("/");
    return {
        bankIntegrationApiBaseUrl: `${pi.innerProto}://${p}/`,
        withdrawalOperationId: withdrawId,
    };
}
function parseProtoInfo(s, action) {
    const pfxPlain = `taler://${action}/`;
    const pfxHttp = `taler+http://${action}/`;
    if (s.toLowerCase().startsWith(pfxPlain)) {
        return {
            innerProto: "https",
            rest: s.substring(pfxPlain.length),
        };
    }
    else if (s.toLowerCase().startsWith(pfxHttp)) {
        return {
            innerProto: "http",
            rest: s.substring(pfxHttp.length),
        };
    }
    else {
        return undefined;
    }
}
/**
 * Parse a taler[+http]://pay URI.
 * Return undefined if not passed a valid URI.
 */
function parsePayUri(s) {
    var _a, _b;
    const pi = parseProtoInfo(s, "pay");
    if (!pi) {
        return undefined;
    }
    const c = pi === null || pi === void 0 ? void 0 : pi.rest.split("?");
    const q = new URLSearchParams$1((_a = c[1]) !== null && _a !== void 0 ? _a : "");
    const claimToken = (_b = q.get("c")) !== null && _b !== void 0 ? _b : undefined;
    const parts = c[0].split("/");
    if (parts.length < 3) {
        return undefined;
    }
    const host = parts[0].toLowerCase();
    const sessionId = parts[parts.length - 1];
    const orderId = parts[parts.length - 2];
    const pathSegments = parts.slice(1, parts.length - 2);
    const p = [host, ...pathSegments].join("/");
    const merchantBaseUrl = `${pi.innerProto}://${p}/`;
    return {
        merchantBaseUrl,
        orderId,
        sessionId: sessionId,
        claimToken,
    };
}
/**
 * Parse a taler[+http]://tip URI.
 * Return undefined if not passed a valid URI.
 */
function parseTipUri(s) {
    const pi = parseProtoInfo(s, "tip");
    if (!pi) {
        return undefined;
    }
    const c = pi === null || pi === void 0 ? void 0 : pi.rest.split("?");
    const parts = c[0].split("/");
    if (parts.length < 2) {
        return undefined;
    }
    const host = parts[0].toLowerCase();
    const tipId = parts[parts.length - 1];
    const pathSegments = parts.slice(1, parts.length - 1);
    const p = [host, ...pathSegments].join("/");
    const merchantBaseUrl = `${pi.innerProto}://${p}/`;
    return {
        merchantBaseUrl,
        merchantTipId: tipId,
    };
}
/**
 * Parse a taler[+http]://refund URI.
 * Return undefined if not passed a valid URI.
 */
function parseRefundUri(s) {
    const pi = parseProtoInfo(s, "refund");
    if (!pi) {
        return undefined;
    }
    const c = pi === null || pi === void 0 ? void 0 : pi.rest.split("?");
    const parts = c[0].split("/");
    if (parts.length < 2) {
        return undefined;
    }
    const host = parts[0].toLowerCase();
    const orderId = parts[parts.length - 1];
    const pathSegments = parts.slice(1, parts.length - 1);
    const p = [host, ...pathSegments].join("/");
    const merchantBaseUrl = `${pi.innerProto}://${p}/`;
    return {
        merchantBaseUrl,
        orderId,
    };
}

/*
 This file is part of TALER
 (C) 2019 GNUnet e.V.

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
 * Check if we are running under nodejs.
 */
const isNode = typeof process !== "undefined" && process.release.name === "node";
function writeNodeLog(message, tag, level, args) {
    process.stderr.write(`${new Date().toISOString()} ${tag} ${level} `);
    process.stderr.write(message);
    if (args.length != 0) {
        process.stderr.write(" ");
        process.stderr.write(JSON.stringify(args, undefined, 2));
    }
    process.stderr.write("\n");
}
/**
 * Logger that writes to stderr when running under node,
 * and uses the corresponding console.* method to log in the browser.
 */
class Logger {
    constructor(tag) {
        this.tag = tag;
    }
    info(message, ...args) {
        if (isNode) {
            writeNodeLog(message, this.tag, "INFO", args);
        }
        else {
            console.info(`${new Date().toISOString()} ${this.tag} INFO ` + message, ...args);
        }
    }
    warn(message, ...args) {
        if (isNode) {
            writeNodeLog(message, this.tag, "WARN", args);
        }
        else {
            console.warn(`${new Date().toISOString()} ${this.tag} INFO ` + message, ...args);
        }
    }
    error(message, ...args) {
        if (isNode) {
            writeNodeLog(message, this.tag, "ERROR", args);
        }
        else {
            console.info(`${new Date().toISOString()} ${this.tag} ERROR ` + message, ...args);
        }
    }
    trace(message, ...args) {
        if (isNode) {
            writeNodeLog(message, this.tag, "TRACE", args);
        }
        else {
            console.info(`${new Date().toISOString()} ${this.tag} TRACE ` + message, ...args);
        }
    }
}

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
 * Show an amount in a form suitable for the user.
 * FIXME:  In the future, this should consider currency-specific
 * settings such as significant digits or currency symbols.
 */
function amountToPretty(amount) {
    const x = amount.value + amount.fraction / fractionalBase;
    return `${x} ${amount.currency}`;
}
/**
 * Canonicalize a base url, typically for the exchange.
 *
 * See http://api.taler.net/wallet.html#general
 */
function canonicalizeBaseUrl(url) {
    if (!url.startsWith("http") && !url.startsWith("https")) {
        url = "https://" + url;
    }
    const x = new URL(url);
    if (!x.pathname.endsWith("/")) {
        x.pathname = x.pathname + "/";
    }
    x.search = "";
    x.hash = "";
    return x.href;
}
/**
 * Convert object to JSON with canonical ordering of keys
 * and whitespace omitted.
 */
function canonicalJson(obj) {
    // Check for cycles, etc.
    JSON.stringify(obj);
    if (typeof obj === "string" || typeof obj === "number" || obj === null) {
        return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
        const objs = obj.map((e) => canonicalJson(e));
        return `[${objs.join(",")}]`;
    }
    const keys = [];
    for (const key in obj) {
        keys.push(key);
    }
    keys.sort();
    let s = "{";
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        s += JSON.stringify(key) + ":" + canonicalJson(obj[key]);
        if (i !== keys.length - 1) {
            s += ",";
        }
    }
    return s + "}";
}
function deepCopy(x) {
    // FIXME: this has many issues ...
    return JSON.parse(JSON.stringify(x));
}
/**
 * Lexically compare two strings.
 */
function strcmp(s1, s2) {
    if (s1 < s2) {
        return -1;
    }
    if (s1 > s2) {
        return 1;
    }
    return 0;
}

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
const paytoPfx = "payto://";
/**
 * Add query parameters to a payto URI
 */
function addPaytoQueryParams(s, params) {
    const [acct, search] = s.slice(paytoPfx.length).split("?");
    const searchParams = new URLSearchParams$1(search || "");
    for (const k of Object.keys(params)) {
        searchParams.set(k, params[k]);
    }
    return paytoPfx + acct + "?" + searchParams.toString();
}
function parsePaytoUri(s) {
    if (!s.startsWith(paytoPfx)) {
        return undefined;
    }
    const [acct, search] = s.slice(paytoPfx.length).split("?");
    const firstSlashPos = acct.indexOf("/");
    if (firstSlashPos === -1) {
        return undefined;
    }
    const targetType = acct.slice(0, firstSlashPos);
    const targetPath = acct.slice(firstSlashPos + 1);
    const params = {};
    const searchParams = new URLSearchParams$1(search || "");
    searchParams.forEach((v, k) => {
        params[v] = k;
    });
    return {
        targetPath,
        targetType,
        params,
    };
}

/*
  This file is part of GNU Taler
  Copyright (C) 2012-2020 Taler Systems SA

  GNU Taler is free software: you can redistribute it and/or modify it
  under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License,
  or (at your option) any later version.

  GNU Taler is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.

  SPDX-License-Identifier: LGPL3.0-or-later

  Note: the LGPL does not apply to all components of GNU Taler,
  but it does apply to this file.
 */
var TalerErrorCode;
(function (TalerErrorCode) {
    /**
     * Special code to indicate no error (or no "code" present).
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["NONE"] = 0] = "NONE";
    /**
     * Special code to indicate that a non-integer error code was returned in the JSON response.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["INVALID"] = 1] = "INVALID";
    /**
     * The response we got from the server was not even in JSON format.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["INVALID_RESPONSE"] = 2] = "INVALID_RESPONSE";
    /**
     * Generic implementation error: this function was not yet implemented.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["NOT_IMPLEMENTED"] = 3] = "NOT_IMPLEMENTED";
    /**
     * Exchange is badly configured and thus cannot operate.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["EXCHANGE_BAD_CONFIGURATION"] = 4] = "EXCHANGE_BAD_CONFIGURATION";
    /**
     * Internal assertion error.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["INTERNAL_INVARIANT_FAILURE"] = 5] = "INTERNAL_INVARIANT_FAILURE";
    /**
     * Operation timed out.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIMEOUT"] = 6] = "TIMEOUT";
    /**
     * Exchange failed to allocate memory for building JSON reply.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["JSON_ALLOCATION_FAILURE"] = 7] = "JSON_ALLOCATION_FAILURE";
    /**
     * HTTP method invalid for this URL.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["METHOD_INVALID"] = 8] = "METHOD_INVALID";
    /**
     * Operation specified invalid for this URL (resulting in a "NOT FOUND" for the overall response).
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["OPERATION_INVALID"] = 9] = "OPERATION_INVALID";
    /**
     * There is no endpoint defined for the URL provided by the client.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ENDPOINT_UNKNOWN"] = 10] = "ENDPOINT_UNKNOWN";
    /**
     * The URI is longer than the longest URI the HTTP server is willing to parse.
     * Returned with an HTTP status code of #MHD_HTTP_URI_TOO_LONG (414).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["URI_TOO_LONG"] = 11] = "URI_TOO_LONG";
    /**
     * The number of segments included in the URI does not match the number of segments expected by the endpoint.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WRONG_NUMBER_OF_SEGMENTS"] = 12] = "WRONG_NUMBER_OF_SEGMENTS";
    /**
     * The start and end-times in the wire fee structure leave a hole. This is not allowed. Generated as an error on the client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["HOLE_IN_WIRE_FEE_STRUCTURE"] = 13] = "HOLE_IN_WIRE_FEE_STRUCTURE";
    /**
     * The version string given does not follow the expected CURRENT:REVISION:AGE Format.  Generated as an error on the client side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["VERSION_MALFORMED"] = 14] = "VERSION_MALFORMED";
    /**
     * The client-side experienced an internal failure. Generated as an error on the client side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["CLIENT_INTERNAL_FAILURE"] = 15] = "CLIENT_INTERNAL_FAILURE";
    /**
     * The body is too large to be permissible for the endpoint.
     * Returned with an HTTP status code of #MHD_HTTP_PAYLOAD_TOO_LARGE (413).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["UPLOAD_EXCEEDS_LIMIT"] = 16] = "UPLOAD_EXCEEDS_LIMIT";
    /**
     * The payto:// URI we got is malformed.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAYTO_MALFORMED"] = 17] = "PAYTO_MALFORMED";
    /**
     * The exchange failed to even just initialize its connection to the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DB_SETUP_FAILED"] = 1001] = "DB_SETUP_FAILED";
    /**
     * The exchange encountered an error event to just start the database transaction.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DB_START_FAILED"] = 1002] = "DB_START_FAILED";
    /**
     * The exchange encountered an error event to commit the database transaction (hard, unrecoverable error).
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DB_COMMIT_FAILED_HARD"] = 1003] = "DB_COMMIT_FAILED_HARD";
    /**
     * The exchange encountered an error event to commit the database transaction, even after repeatedly retrying it there was always a conflicting transaction. (This indicates a repeated serialization error; should only happen if some client maliciously tries to create conflicting concurrent transactions.)
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DB_COMMIT_FAILED_ON_RETRY"] = 1004] = "DB_COMMIT_FAILED_ON_RETRY";
    /**
     * The exchange had insufficient memory to parse the request.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PARSER_OUT_OF_MEMORY"] = 1005] = "PARSER_OUT_OF_MEMORY";
    /**
     * The JSON in the client's request to the exchange was malformed. (Generic parse error).
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["JSON_INVALID"] = 1006] = "JSON_INVALID";
    /**
     * The JSON in the client's request to the exchange was malformed. Details about the location of the parse error are provided.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["JSON_INVALID_WITH_DETAILS"] = 1007] = "JSON_INVALID_WITH_DETAILS";
    /**
     * A required parameter in the request to the exchange was missing.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PARAMETER_MISSING"] = 1008] = "PARAMETER_MISSING";
    /**
     * A parameter in the request to the exchange was malformed.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PARAMETER_MALFORMED"] = 1009] = "PARAMETER_MALFORMED";
    /**
     * The exchange failed to obtain the transaction history of the given coin from the database while generating an insufficient funds errors. This can happen during /deposit or /recoup requests.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["COIN_HISTORY_DB_ERROR_INSUFFICIENT_FUNDS"] = 1010] = "COIN_HISTORY_DB_ERROR_INSUFFICIENT_FUNDS";
    /**
     * Internal logic error.  Some server-side function failed that really should not.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["INTERNAL_LOGIC_ERROR"] = 1011] = "INTERNAL_LOGIC_ERROR";
    /**
     * The method specified in a payto:// URI is not one we expected.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAYTO_WRONG_METHOD"] = 1012] = "PAYTO_WRONG_METHOD";
    /**
     * The same coin was already used with a different denomination previously.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["COIN_CONFLICTING_DENOMINATION_KEY"] = 1013] = "COIN_CONFLICTING_DENOMINATION_KEY";
    /**
     * We failed to update the database of known coins.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DB_COIN_HISTORY_STORE_ERROR"] = 1014] = "DB_COIN_HISTORY_STORE_ERROR";
    /**
     * The public key of given to a /coins/ handler was malformed.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["COINS_INVALID_COIN_PUB"] = 1050] = "COINS_INVALID_COIN_PUB";
    /**
     * The reserve key of given to a /reserves/ handler was malformed.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RESERVES_INVALID_RESERVE_PUB"] = 1051] = "RESERVES_INVALID_RESERVE_PUB";
    /**
     * The public key of given to a /transfers/ handler was malformed.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRANSFERS_INVALID_WTID"] = 1052] = "TRANSFERS_INVALID_WTID";
    /**
     * The wire hash of given to a /deposits/ handler was malformed.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSITS_INVALID_H_WIRE"] = 1053] = "DEPOSITS_INVALID_H_WIRE";
    /**
     * The merchant key of given to a /deposits/ handler was malformed.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSITS_INVALID_MERCHANT_PUB"] = 1054] = "DEPOSITS_INVALID_MERCHANT_PUB";
    /**
     * The hash of the contract terms given to a /deposits/ handler was malformed.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSITS_INVALID_H_CONTRACT_TERMS"] = 1055] = "DEPOSITS_INVALID_H_CONTRACT_TERMS";
    /**
     * The coin public key of given to a /deposits/ handler was malformed.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSITS_INVALID_COIN_PUB"] = 1056] = "DEPOSITS_INVALID_COIN_PUB";
    /**
     * The body returned by the exchange for a /deposits/ request was malformed. Error created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSITS_INVALID_BODY_BY_EXCHANGE"] = 1057] = "DEPOSITS_INVALID_BODY_BY_EXCHANGE";
    /**
     * The signature returned by the exchange in a /deposits/ request was malformed. Error created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSITS_INVALID_SIGNATURE_BY_EXCHANGE"] = 1058] = "DEPOSITS_INVALID_SIGNATURE_BY_EXCHANGE";
    /**
     * The given reserve does not have sufficient funds to admit the requested withdraw operation at this time.  The response includes the current "balance" of the reserve as well as the transaction "history" that lead to this balance.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_INSUFFICIENT_FUNDS"] = 1100] = "WITHDRAW_INSUFFICIENT_FUNDS";
    /**
     * The exchange has no information about the "reserve_pub" that was given.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_RESERVE_UNKNOWN"] = 1101] = "WITHDRAW_RESERVE_UNKNOWN";
    /**
     * The amount to withdraw together with the fee exceeds the numeric range for Taler amounts.  This is not a client failure, as the coin value and fees come from the exchange's configuration.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_AMOUNT_FEE_OVERFLOW"] = 1102] = "WITHDRAW_AMOUNT_FEE_OVERFLOW";
    /**
     * All of the deposited amounts into this reserve total up to a value that is too big for the numeric range for Taler amounts. This is not a client failure, as the transaction history comes from the exchange's configuration.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["AMOUNT_DEPOSITS_OVERFLOW"] = 1103] = "AMOUNT_DEPOSITS_OVERFLOW";
    /**
     * For one of the historic withdrawals from this reserve, the exchange could not find the denomination key. This is not a client failure, as the transaction history comes from the exchange's configuration.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_HISTORIC_DENOMINATION_KEY_NOT_FOUND"] = 1104] = "WITHDRAW_HISTORIC_DENOMINATION_KEY_NOT_FOUND";
    /**
     * All of the withdrawals from reserve total up to a value that is too big for the numeric range for Taler amounts. This is not a client failure, as the transaction history comes from the exchange's configuration.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_AMOUNT_WITHDRAWALS_OVERFLOW"] = 1105] = "WITHDRAW_AMOUNT_WITHDRAWALS_OVERFLOW";
    /**
     * The exchange somehow knows about this reserve, but there seem to have been no wire transfers made.  This is not a client failure, as this is a database consistency issue of the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_RESERVE_WITHOUT_WIRE_TRANSFER"] = 1106] = "WITHDRAW_RESERVE_WITHOUT_WIRE_TRANSFER";
    /**
     * The exchange failed to create the signature using the denomination key.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_SIGNATURE_FAILED"] = 1107] = "WITHDRAW_SIGNATURE_FAILED";
    /**
     * The exchange failed to store the withdraw operation in its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_DB_STORE_ERROR"] = 1108] = "WITHDRAW_DB_STORE_ERROR";
    /**
     * The exchange failed to check against historic withdraw data from database (as part of ensuring the idempotency of the operation).
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_DB_FETCH_ERROR"] = 1109] = "WITHDRAW_DB_FETCH_ERROR";
    /**
     * The exchange is not aware of the denomination key the wallet requested for the withdrawal.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_DENOMINATION_KEY_NOT_FOUND"] = 1110] = "WITHDRAW_DENOMINATION_KEY_NOT_FOUND";
    /**
     * The signature of the reserve is not valid.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_RESERVE_SIGNATURE_INVALID"] = 1111] = "WITHDRAW_RESERVE_SIGNATURE_INVALID";
    /**
     * When computing the reserve history, we ended up with a negative overall balance, which should be impossible.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_HISTORY_DB_ERROR_INSUFFICIENT_FUNDS"] = 1112] = "WITHDRAW_HISTORY_DB_ERROR_INSUFFICIENT_FUNDS";
    /**
     * When computing the reserve history, we ended up with a negative overall balance, which should be impossible.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_RESERVE_HISTORY_IMPOSSIBLE"] = 1113] = "WITHDRAW_RESERVE_HISTORY_IMPOSSIBLE";
    /**
     * Validity period of the coin to be withdrawn is in the future.
     * Returned with an HTTP status code of #MHD_HTTP_PRECONDITION_FAILED (412).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_VALIDITY_IN_FUTURE"] = 1114] = "WITHDRAW_VALIDITY_IN_FUTURE";
    /**
     * Withdraw period of the coin to be withdrawn is in the past.
     * Returned with an HTTP status code of #MHD_HTTP_GONE (410).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_VALIDITY_IN_PAST"] = 1115] = "WITHDRAW_VALIDITY_IN_PAST";
    /**
     * Withdraw period of the coin to be withdrawn is in the past.
     * Returned with an HTTP status code of #MHD_HTTP_GONE (410).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DENOMINATION_KEY_LOST"] = 1116] = "DENOMINATION_KEY_LOST";
    /**
     * The exchange's database entry with the reserve balance summary is inconsistent with its own history of the reserve.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_RESERVE_BALANCE_CORRUPT"] = 1117] = "WITHDRAW_RESERVE_BALANCE_CORRUPT";
    /**
     * The exchange responded with a reply that did not satsify the protocol. This error is not used in the protocol but created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_REPLY_MALFORMED"] = 1118] = "WITHDRAW_REPLY_MALFORMED";
    /**
     * The client failed to unblind the blind signature. This error is not used in the protocol but created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WITHDRAW_UNBLIND_FAILURE"] = 1119] = "WITHDRAW_UNBLIND_FAILURE";
    /**
     * The exchange failed to obtain the transaction history of the given reserve from the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RESERVE_STATUS_DB_ERROR"] = 1150] = "RESERVE_STATUS_DB_ERROR";
    /**
     * The reserve status was requested using a unknown key, to be returned with 404 Not Found.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RESERVE_STATUS_UNKNOWN"] = 1151] = "RESERVE_STATUS_UNKNOWN";
    /**
     * The exchange responded with a reply that did not satsify the protocol. This error is not used in the protocol but created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RESERVE_STATUS_REPLY_MALFORMED"] = 1152] = "RESERVE_STATUS_REPLY_MALFORMED";
    /**
     * The respective coin did not have sufficient residual value for the /deposit operation (i.e. due to double spending). The "history" in the response provides the transaction history of the coin proving this fact.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_INSUFFICIENT_FUNDS"] = 1200] = "DEPOSIT_INSUFFICIENT_FUNDS";
    /**
     * The exchange failed to obtain the transaction history of the given coin from the database (this does not happen merely because the coin is seen by the exchange for the first time).
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_HISTORY_DB_ERROR"] = 1201] = "DEPOSIT_HISTORY_DB_ERROR";
    /**
     * The exchange failed to store the /depost information in the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_STORE_DB_ERROR"] = 1202] = "DEPOSIT_STORE_DB_ERROR";
    /**
     * The exchange database is unaware of the denomination key that signed the coin (however, the exchange process is; this is not supposed to happen; it can happen if someone decides to purge the DB behind the back of the exchange process).  Hence the deposit is being refused.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_DB_DENOMINATION_KEY_UNKNOWN"] = 1203] = "DEPOSIT_DB_DENOMINATION_KEY_UNKNOWN";
    /**
     * The exchange was trying to lookup the denomination key for the purpose of a DEPOSIT operation. However, the denomination key is unavailable for that purpose. This can be because it is entirely unknown to the exchange or not in the validity period for the deposit operation. Hence the deposit is being refused.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_DENOMINATION_KEY_UNKNOWN"] = 1204] = "DEPOSIT_DENOMINATION_KEY_UNKNOWN";
    /**
     * The signature made by the coin over the deposit permission is not valid.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_COIN_SIGNATURE_INVALID"] = 1205] = "DEPOSIT_COIN_SIGNATURE_INVALID";
    /**
     * The signature of the denomination key over the coin is not valid.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_DENOMINATION_SIGNATURE_INVALID"] = 1206] = "DEPOSIT_DENOMINATION_SIGNATURE_INVALID";
    /**
     * The stated value of the coin after the deposit fee is subtracted would be negative.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_NEGATIVE_VALUE_AFTER_FEE"] = 1207] = "DEPOSIT_NEGATIVE_VALUE_AFTER_FEE";
    /**
     * The stated refund deadline is after the wire deadline.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_REFUND_DEADLINE_AFTER_WIRE_DEADLINE"] = 1208] = "DEPOSIT_REFUND_DEADLINE_AFTER_WIRE_DEADLINE";
    /**
     * The exchange does not recognize the validity of or support the given wire format type.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_INVALID_WIRE_FORMAT_TYPE"] = 1209] = "DEPOSIT_INVALID_WIRE_FORMAT_TYPE";
    /**
     * The exchange failed to canonicalize and hash the given wire format. For example, the merchant failed to provide the "salt" or a valid payto:// URI in the wire details.  Note that while the exchange will do some basic sanity checking on the wire details, it cannot warrant that the banking system will ultimately be able to route to the specified address, even if this check passed.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_INVALID_WIRE_FORMAT_JSON"] = 1210] = "DEPOSIT_INVALID_WIRE_FORMAT_JSON";
    /**
     * The hash of the given wire address does not match the wire hash specified in the proposal data.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_INVALID_WIRE_FORMAT_CONTRACT_HASH_CONFLICT"] = 1211] = "DEPOSIT_INVALID_WIRE_FORMAT_CONTRACT_HASH_CONFLICT";
    /**
     * The exchange detected that the given account number is invalid for the selected wire format type.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_INVALID_WIRE_FORMAT_ACCOUNT_NUMBER"] = 1213] = "DEPOSIT_INVALID_WIRE_FORMAT_ACCOUNT_NUMBER";
    /**
     * Timestamp included in deposit permission is intolerably far off with respect to the clock of the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_INVALID_TIMESTAMP"] = 1218] = "DEPOSIT_INVALID_TIMESTAMP";
    /**
     * Validity period of the denomination key is in the future.
     * Returned with an HTTP status code of #MHD_HTTP_PRECONDITION_FAILED (412).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_DENOMINATION_VALIDITY_IN_FUTURE"] = 1219] = "DEPOSIT_DENOMINATION_VALIDITY_IN_FUTURE";
    /**
     * Denomination key of the coin is past the deposit deadline.
     * Returned with an HTTP status code of #MHD_HTTP_GONE (410).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_DENOMINATION_EXPIRED"] = 1220] = "DEPOSIT_DENOMINATION_EXPIRED";
    /**
     * The signature provided by the exchange is not valid. Error created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_INVALID_SIGNATURE_BY_EXCHANGE"] = 1221] = "DEPOSIT_INVALID_SIGNATURE_BY_EXCHANGE";
    /**
     * The currency specified for the deposit is different from the currency of the coin.
     * Returned with an HTTP status code of #MHD_HTTP_PRECONDITION_FAILED (412).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_CURRENCY_MISMATCH"] = 1222] = "DEPOSIT_CURRENCY_MISMATCH";
    /**
     * The respective coin did not have sufficient residual value for the /refresh/melt operation.  The "history" in this response provdes the "residual_value" of the coin, which may be less than its "original_value".
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MELT_INSUFFICIENT_FUNDS"] = 1300] = "MELT_INSUFFICIENT_FUNDS";
    /**
     * The respective coin did not have sufficient residual value for the /refresh/melt operation.  The "history" in this response provdes the "residual_value" of the coin, which may be less than its "original_value".
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MELT_DENOMINATION_KEY_NOT_FOUND"] = 1301] = "MELT_DENOMINATION_KEY_NOT_FOUND";
    /**
     * The exchange had an internal error reconstructing the transaction history of the coin that was being melted.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MELT_COIN_HISTORY_COMPUTATION_FAILED"] = 1302] = "MELT_COIN_HISTORY_COMPUTATION_FAILED";
    /**
     * The exchange failed to check against historic melt data from database (as part of ensuring the idempotency of the operation).
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MELT_DB_FETCH_ERROR"] = 1303] = "MELT_DB_FETCH_ERROR";
    /**
     * The exchange failed to store session data in the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MELT_DB_STORE_SESSION_ERROR"] = 1304] = "MELT_DB_STORE_SESSION_ERROR";
    /**
     * The exchange encountered melt fees exceeding the melted coin's contribution.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MELT_FEES_EXCEED_CONTRIBUTION"] = 1305] = "MELT_FEES_EXCEED_CONTRIBUTION";
    /**
     * The denomination key signature on the melted coin is invalid.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MELT_DENOMINATION_SIGNATURE_INVALID"] = 1306] = "MELT_DENOMINATION_SIGNATURE_INVALID";
    /**
     * The signature made with the coin to be melted is invalid.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MELT_COIN_SIGNATURE_INVALID"] = 1307] = "MELT_COIN_SIGNATURE_INVALID";
    /**
     * The exchange failed to obtain the transaction history of the given coin from the database while generating an insufficient funds errors.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MELT_HISTORY_DB_ERROR_INSUFFICIENT_FUNDS"] = 1308] = "MELT_HISTORY_DB_ERROR_INSUFFICIENT_FUNDS";
    /**
     * The denomination of the given coin has past its expiration date and it is also not a valid zombie (that is, was not refreshed with the fresh coin being subjected to recoup).
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MELT_COIN_EXPIRED_NO_ZOMBIE"] = 1309] = "MELT_COIN_EXPIRED_NO_ZOMBIE";
    /**
     * The signature returned by the exchange in a melt request was malformed. Error created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MELT_INVALID_SIGNATURE_BY_EXCHANGE"] = 1310] = "MELT_INVALID_SIGNATURE_BY_EXCHANGE";
    /**
     * The currency specified for the melt amount is different from the currency of the coin.
     * Returned with an HTTP status code of #MHD_HTTP_PRECONDITION_FAILED (412).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MELT_CURRENCY_MISMATCH"] = 1311] = "MELT_CURRENCY_MISMATCH";
    /**
     * The exchange is unaware of the denomination key that was used to sign the melted zombie coin.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFRESH_RECOUP_DENOMINATION_KEY_NOT_FOUND"] = 1351] = "REFRESH_RECOUP_DENOMINATION_KEY_NOT_FOUND";
    /**
     * Validity period of the denomination key is in the future.
     * Returned with an HTTP status code of #MHD_HTTP_PRECONDITION_FAILED (412).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFRESH_RECOUP_DENOMINATION_VALIDITY_IN_FUTURE"] = 1352] = "REFRESH_RECOUP_DENOMINATION_VALIDITY_IN_FUTURE";
    /**
     * Denomination key of the coin is past the deposit deadline.
     * Returned with an HTTP status code of #MHD_HTTP_GONE (410).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFRESH_RECOUP_DENOMINATION_EXPIRED"] = 1353] = "REFRESH_RECOUP_DENOMINATION_EXPIRED";
    /**
     * Denomination key of the coin is past the deposit deadline.
     * Returned with an HTTP status code of #MHD_HTTP_GONE (410).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFRESH_ZOMBIE_DENOMINATION_EXPIRED"] = 1354] = "REFRESH_ZOMBIE_DENOMINATION_EXPIRED";
    /**
     * The provided transfer keys do not match up with the original commitment.  Information about the original commitment is included in the response.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_COMMITMENT_VIOLATION"] = 1370] = "REVEAL_COMMITMENT_VIOLATION";
    /**
     * Failed to produce the blinded signatures over the coins to be returned.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_SIGNING_ERROR"] = 1371] = "REVEAL_SIGNING_ERROR";
    /**
     * The exchange is unaware of the refresh session specified in the request.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_SESSION_UNKNOWN"] = 1372] = "REVEAL_SESSION_UNKNOWN";
    /**
     * The exchange failed to retrieve valid session data from the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_DB_FETCH_SESSION_ERROR"] = 1373] = "REVEAL_DB_FETCH_SESSION_ERROR";
    /**
     * The exchange failed to retrieve previously revealed data from the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_DB_FETCH_REVEAL_ERROR"] = 1374] = "REVEAL_DB_FETCH_REVEAL_ERROR";
    /**
     * The exchange failed to retrieve commitment data from the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_DB_COMMIT_ERROR"] = 1375] = "REVEAL_DB_COMMIT_ERROR";
    /**
     * The size of the cut-and-choose dimension of the private transfer keys request does not match #TALER_CNC_KAPPA - 1.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_CNC_TRANSFER_ARRAY_SIZE_INVALID"] = 1376] = "REVEAL_CNC_TRANSFER_ARRAY_SIZE_INVALID";
    /**
     * The number of coins to be created in refresh exceeds the limits of the exchange. private transfer keys request does not match #TALER_CNC_KAPPA - 1.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_NEW_DENOMS_ARRAY_SIZE_EXCESSIVE"] = 1377] = "REVEAL_NEW_DENOMS_ARRAY_SIZE_EXCESSIVE";
    /**
     * The number of envelopes given does not match the number of denomination keys given.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_NEW_DENOMS_ARRAY_SIZE_MISMATCH"] = 1378] = "REVEAL_NEW_DENOMS_ARRAY_SIZE_MISMATCH";
    /**
     * The exchange encountered a numeric overflow totaling up the cost for the refresh operation.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_COST_CALCULATION_OVERFLOW"] = 1379] = "REVEAL_COST_CALCULATION_OVERFLOW";
    /**
     * The exchange's cost calculation shows that the melt amount is below the costs of the transaction.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_AMOUNT_INSUFFICIENT"] = 1380] = "REVEAL_AMOUNT_INSUFFICIENT";
    /**
     * The exchange is unaware of the denomination key that was requested for one of the fresh coins.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_FRESH_DENOMINATION_KEY_NOT_FOUND"] = 1381] = "REVEAL_FRESH_DENOMINATION_KEY_NOT_FOUND";
    /**
     * The signature made with the coin over the link data is invalid.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_LINK_SIGNATURE_INVALID"] = 1382] = "REVEAL_LINK_SIGNATURE_INVALID";
    /**
     * The exchange failed to generate the signature as it could not find the signing key for the denomination.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_KEYS_MISSING"] = 1383] = "REVEAL_KEYS_MISSING";
    /**
     * The refresh session hash given to a /refreshes/ handler was malformed.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_INVALID_RCH"] = 1384] = "REVEAL_INVALID_RCH";
    /**
     * The exchange responded with a reply that did not satsify the protocol. This error is not used in the protocol but created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REVEAL_REPLY_MALFORMED"] = 1385] = "REVEAL_REPLY_MALFORMED";
    /**
     * The coin specified in the link request is unknown to the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["LINK_COIN_UNKNOWN"] = 1400] = "LINK_COIN_UNKNOWN";
    /**
     * The exchange responded with a reply that did not satsify the protocol. This error is not used in the protocol but created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["LINK_REPLY_MALFORMED"] = 1401] = "LINK_REPLY_MALFORMED";
    /**
     * The exchange knows literally nothing about the coin we were asked to refund. But without a transaction history, we cannot issue a refund. This is kind-of OK, the owner should just refresh it directly without executing the refund.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_COIN_NOT_FOUND"] = 1500] = "REFUND_COIN_NOT_FOUND";
    /**
     * We could not process the refund request as the coin's transaction history does not permit the requested refund at this time.  The "history" in the response proves this.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_CONFLICT"] = 1501] = "REFUND_CONFLICT";
    /**
     * The exchange knows about the coin we were asked to refund, but not about the specific /deposit operation.  Hence, we cannot issue a refund (as we do not know if this merchant public key is authorized to do a refund).
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_DEPOSIT_NOT_FOUND"] = 1503] = "REFUND_DEPOSIT_NOT_FOUND";
    /**
     * The currency specified for the refund is different from the currency of the coin.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_CURRENCY_MISMATCH"] = 1504] = "REFUND_CURRENCY_MISMATCH";
    /**
     * When we tried to check if we already paid out the coin, the exchange's database suddenly disagreed with data it previously provided (internal inconsistency).
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_DB_INCONSISTENT"] = 1505] = "REFUND_DB_INCONSISTENT";
    /**
     * The exchange can no longer refund the customer/coin as the money was already transferred (paid out) to the merchant. (It should be past the refund deadline.)
     * Returned with an HTTP status code of #MHD_HTTP_GONE (410).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_MERCHANT_ALREADY_PAID"] = 1506] = "REFUND_MERCHANT_ALREADY_PAID";
    /**
     * The amount the exchange was asked to refund exceeds (with fees) the total amount of the deposit (including fees).
     * Returned with an HTTP status code of #MHD_HTTP_PRECONDITION_FAILED (412).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_INSUFFICIENT_FUNDS"] = 1507] = "REFUND_INSUFFICIENT_FUNDS";
    /**
     * The exchange failed to recover information about the denomination key of the refunded coin (even though it recognizes the key).  Hence it could not check the fee structure.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_DENOMINATION_KEY_NOT_FOUND"] = 1508] = "REFUND_DENOMINATION_KEY_NOT_FOUND";
    /**
     * The refund fee specified for the request is lower than the refund fee charged by the exchange for the given denomination key of the refunded coin.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_FEE_TOO_LOW"] = 1509] = "REFUND_FEE_TOO_LOW";
    /**
     * The exchange failed to store the refund information to its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_STORE_DB_ERROR"] = 1510] = "REFUND_STORE_DB_ERROR";
    /**
     * The refund fee is specified in a different currency than the refund amount.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_FEE_CURRENCY_MISMATCH"] = 1511] = "REFUND_FEE_CURRENCY_MISMATCH";
    /**
     * The refunded amount is smaller than the refund fee, which would result in a negative refund.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_FEE_ABOVE_AMOUNT"] = 1512] = "REFUND_FEE_ABOVE_AMOUNT";
    /**
     * The signature of the merchant is invalid.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_MERCHANT_SIGNATURE_INVALID"] = 1513] = "REFUND_MERCHANT_SIGNATURE_INVALID";
    /**
     * Merchant backend failed to create the refund confirmation signature.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_MERCHANT_SIGNING_FAILED"] = 1514] = "REFUND_MERCHANT_SIGNING_FAILED";
    /**
     * The signature returned by the exchange in a refund request was malformed. Error created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_INVALID_SIGNATURE_BY_EXCHANGE"] = 1515] = "REFUND_INVALID_SIGNATURE_BY_EXCHANGE";
    /**
     * The wire format specified in the "sender_account_details" is not understood or not supported by this exchange.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ADMIN_ADD_INCOMING_WIREFORMAT_UNSUPPORTED"] = 1600] = "ADMIN_ADD_INCOMING_WIREFORMAT_UNSUPPORTED";
    /**
     * The currency specified in the "amount" parameter is not supported by this exhange.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ADMIN_ADD_INCOMING_CURRENCY_UNSUPPORTED"] = 1601] = "ADMIN_ADD_INCOMING_CURRENCY_UNSUPPORTED";
    /**
     * The exchange failed to store information about the incoming transfer in its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ADMIN_ADD_INCOMING_DB_STORE"] = 1602] = "ADMIN_ADD_INCOMING_DB_STORE";
    /**
     * The exchange encountered an error (that is not about not finding the wire transfer) trying to lookup a wire transfer identifier in the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRANSFERS_GET_DB_FETCH_FAILED"] = 1700] = "TRANSFERS_GET_DB_FETCH_FAILED";
    /**
     * The exchange found internally inconsistent data when resolving a wire transfer identifier in the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRANSFERS_GET_DB_INCONSISTENT"] = 1701] = "TRANSFERS_GET_DB_INCONSISTENT";
    /**
     * The exchange did not find information about the specified wire transfer identifier in the database.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRANSFERS_GET_WTID_NOT_FOUND"] = 1702] = "TRANSFERS_GET_WTID_NOT_FOUND";
    /**
     * The exchange did not find information about the wire transfer fees it charged.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRANSFERS_GET_WIRE_FEE_NOT_FOUND"] = 1703] = "TRANSFERS_GET_WIRE_FEE_NOT_FOUND";
    /**
     * The exchange found a wire fee that was above the total transfer value (and thus could not have been charged).
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRANSFERS_GET_WIRE_FEE_INCONSISTENT"] = 1704] = "TRANSFERS_GET_WIRE_FEE_INCONSISTENT";
    /**
     * The exchange responded with a reply that did not satsify the protocol. This error is not used in the protocol but created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRANSFERS_GET_REPLY_MALFORMED"] = 1705] = "TRANSFERS_GET_REPLY_MALFORMED";
    /**
     * The exchange found internally inconsistent fee data when resolving a transaction in the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSITS_GET_DB_FEE_INCONSISTENT"] = 1800] = "DEPOSITS_GET_DB_FEE_INCONSISTENT";
    /**
     * The exchange encountered an error (that is not about not finding the transaction) trying to lookup a transaction in the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSITS_GET_DB_FETCH_FAILED"] = 1801] = "DEPOSITS_GET_DB_FETCH_FAILED";
    /**
     * The exchange did not find information about the specified transaction in the database.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSITS_GET_NOT_FOUND"] = 1802] = "DEPOSITS_GET_NOT_FOUND";
    /**
     * The exchange failed to identify the wire transfer of the transaction (or information about the plan that it was supposed to still happen in the future).
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSITS_GET_WTID_RESOLUTION_ERROR"] = 1803] = "DEPOSITS_GET_WTID_RESOLUTION_ERROR";
    /**
     * The signature of the merchant is invalid.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSITS_GET_MERCHANT_SIGNATURE_INVALID"] = 1804] = "DEPOSITS_GET_MERCHANT_SIGNATURE_INVALID";
    /**
     * The given denomination key is not in the "recoup" set of the exchange right now.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RECOUP_DENOMINATION_KEY_UNKNOWN"] = 1850] = "RECOUP_DENOMINATION_KEY_UNKNOWN";
    /**
     * The given coin signature is invalid for the request.
     * Returned with an HTTP status code of #MHD_HTTP_FORBIDDEN (403).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RECOUP_SIGNATURE_INVALID"] = 1851] = "RECOUP_SIGNATURE_INVALID";
    /**
     * The signature of the denomination key over the coin is not valid.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RECOUP_DENOMINATION_SIGNATURE_INVALID"] = 1852] = "RECOUP_DENOMINATION_SIGNATURE_INVALID";
    /**
     * The exchange failed to access its own database about reserves.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RECOUP_DB_FETCH_FAILED"] = 1853] = "RECOUP_DB_FETCH_FAILED";
    /**
     * The exchange could not find the corresponding withdraw operation. The request is denied.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RECOUP_WITHDRAW_NOT_FOUND"] = 1854] = "RECOUP_WITHDRAW_NOT_FOUND";
    /**
     * The exchange obtained an internally inconsistent transaction history for the given coin.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RECOUP_HISTORY_DB_ERROR"] = 1855] = "RECOUP_HISTORY_DB_ERROR";
    /**
     * The exchange failed to store information about the recoup to be performed in the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RECOUP_DB_PUT_FAILED"] = 1856] = "RECOUP_DB_PUT_FAILED";
    /**
     * The coin's remaining balance is zero.  The request is denied.
     * Returned with an HTTP status code of #MHD_HTTP_FORBIDDEN (403).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RECOUP_COIN_BALANCE_ZERO"] = 1857] = "RECOUP_COIN_BALANCE_ZERO";
    /**
     * The exchange failed to reproduce the coin's blinding.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RECOUP_BLINDING_FAILED"] = 1858] = "RECOUP_BLINDING_FAILED";
    /**
     * The coin's remaining balance is zero.  The request is denied.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RECOUP_COIN_BALANCE_NEGATIVE"] = 1859] = "RECOUP_COIN_BALANCE_NEGATIVE";
    /**
     * Validity period of the denomination key is in the future.
     * Returned with an HTTP status code of #MHD_HTTP_PRECONDITION_FAILED (412).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RECOUP_DENOMINATION_VALIDITY_IN_FUTURE"] = 1860] = "RECOUP_DENOMINATION_VALIDITY_IN_FUTURE";
    /**
     * The exchange responded with a reply that did not satsify the protocol. This error is not used in the protocol but created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RECOUP_REPLY_MALFORMED"] = 1861] = "RECOUP_REPLY_MALFORMED";
    /**
     * The "have" parameter was not a natural number.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["KEYS_HAVE_NOT_NUMERIC"] = 1900] = "KEYS_HAVE_NOT_NUMERIC";
    /**
     * We currently cannot find any keys.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["KEYS_MISSING"] = 1901] = "KEYS_MISSING";
    /**
     * This exchange does not allow clients to request /keys for times other than the current (exchange) time.
     * Returned with an HTTP status code of #MHD_HTTP_FORBIDDEN (403).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["KEYS_TIMETRAVEL_FORBIDDEN"] = 1902] = "KEYS_TIMETRAVEL_FORBIDDEN";
    /**
     * The keys response was malformed. This error is generated client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["KEYS_INVALID"] = 1903] = "KEYS_INVALID";
    /**
     * The backend could not find the merchant instance specified in the request.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["INSTANCE_UNKNOWN"] = 2000] = "INSTANCE_UNKNOWN";
    /**
     * The backend lacks a wire transfer method configuration option for the given instance.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PROPOSAL_INSTANCE_CONFIGURATION_LACKS_WIRE"] = 2002] = "PROPOSAL_INSTANCE_CONFIGURATION_LACKS_WIRE";
    /**
     * The merchant failed to provide a meaningful response to a /pay request.  This error is created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_MERCHANT_INVALID_RESPONSE"] = 2100] = "PAY_MERCHANT_INVALID_RESPONSE";
    /**
     * The exchange responded saying that funds were insufficient (for example, due to double-spending).
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_INSUFFICIENT_FUNDS"] = 2101] = "PAY_INSUFFICIENT_FUNDS";
    /**
     * The merchant failed to commit the exchanges' response to a /deposit request to its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_DB_STORE_PAY_ERROR"] = 2102] = "PAY_DB_STORE_PAY_ERROR";
    /**
     * The specified exchange is not supported/trusted by this merchant.
     * Returned with an HTTP status code of #MHD_HTTP_PRECONDITION_FAILED (412).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_EXCHANGE_REJECTED"] = 2103] = "PAY_EXCHANGE_REJECTED";
    /**
     * The denomination key used for payment is not listed among the denomination keys of the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_DENOMINATION_KEY_NOT_FOUND"] = 2104] = "PAY_DENOMINATION_KEY_NOT_FOUND";
    /**
     * The denomination key used for payment is not audited by an auditor approved by the merchant.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_DENOMINATION_KEY_AUDITOR_FAILURE"] = 2105] = "PAY_DENOMINATION_KEY_AUDITOR_FAILURE";
    /**
     * There was an integer overflow totaling up the amounts or deposit fees in the payment.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_AMOUNT_OVERFLOW"] = 2106] = "PAY_AMOUNT_OVERFLOW";
    /**
     * The deposit fees exceed the total value of the payment.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_FEES_EXCEED_PAYMENT"] = 2107] = "PAY_FEES_EXCEED_PAYMENT";
    /**
     * After considering deposit and wire fees, the payment is insufficient to satisfy the required amount for the contract.  The client should revisit the logic used to calculate fees it must cover.
     * Returned with an HTTP status code of #MHD_HTTP_ACCEPTED (202).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_PAYMENT_INSUFFICIENT_DUE_TO_FEES"] = 2108] = "PAY_PAYMENT_INSUFFICIENT_DUE_TO_FEES";
    /**
     * Even if we do not consider deposit and wire fees, the payment is insufficient to satisfy the required amount for the contract.
     * Returned with an HTTP status code of #MHD_HTTP_ACCEPTED (202).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_PAYMENT_INSUFFICIENT"] = 2109] = "PAY_PAYMENT_INSUFFICIENT";
    /**
     * The signature over the contract of one of the coins was invalid.
     * Returned with an HTTP status code of #MHD_HTTP_FORBIDDEN (403).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_COIN_SIGNATURE_INVALID"] = 2110] = "PAY_COIN_SIGNATURE_INVALID";
    /**
     * We failed to contact the exchange for the /pay request.
     * Returned with an HTTP status code of #MHD_HTTP_REQUEST_TIMEOUT (408).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_EXCHANGE_TIMEOUT"] = 2111] = "PAY_EXCHANGE_TIMEOUT";
    /**
     * When we tried to find information about the exchange to issue the deposit, we failed.  This usually only happens if the merchant backend is somehow unable to get its own HTTP client logic to work.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_EXCHANGE_LOOKUP_FAILED"] = 2112] = "PAY_EXCHANGE_LOOKUP_FAILED";
    /**
     * The refund deadline in the contract is after the transfer deadline.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_REFUND_DEADLINE_PAST_WIRE_TRANSFER_DEADLINE"] = 2114] = "PAY_REFUND_DEADLINE_PAST_WIRE_TRANSFER_DEADLINE";
    /**
     * The request fails to provide coins for the payment.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_COINS_ARRAY_EMPTY"] = 2115] = "PAY_COINS_ARRAY_EMPTY";
    /**
     * The merchant failed to fetch the contract terms from the merchant's database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_DB_FETCH_PAY_ERROR"] = 2116] = "PAY_DB_FETCH_PAY_ERROR";
    /**
     * The merchant failed to fetch the merchant's previous state with respect to transactions from its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_DB_FETCH_TRANSACTION_ERROR"] = 2117] = "PAY_DB_FETCH_TRANSACTION_ERROR";
    /**
     * The merchant failed to store the merchant's state with respect to the transaction in its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_DB_STORE_TRANSACTION_ERROR"] = 2119] = "PAY_DB_STORE_TRANSACTION_ERROR";
    /**
     * The exchange failed to provide a valid response to the merchant's /keys request.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_EXCHANGE_KEYS_FAILURE"] = 2120] = "PAY_EXCHANGE_KEYS_FAILURE";
    /**
     * The payment is too late, the offer has expired.
     * Returned with an HTTP status code of #MHD_HTTP_GONE (410).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_OFFER_EXPIRED"] = 2121] = "PAY_OFFER_EXPIRED";
    /**
     * The "merchant" field is missing in the proposal data.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_MERCHANT_FIELD_MISSING"] = 2122] = "PAY_MERCHANT_FIELD_MISSING";
    /**
     * Failed computing a hash code (likely server out-of-memory).
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_FAILED_COMPUTE_PROPOSAL_HASH"] = 2123] = "PAY_FAILED_COMPUTE_PROPOSAL_HASH";
    /**
     * Failed to locate merchant's account information matching the wire hash given in the proposal.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_WIRE_HASH_UNKNOWN"] = 2124] = "PAY_WIRE_HASH_UNKNOWN";
    /**
     * We got different currencies for the wire fee and the maximum wire fee.
     * Returned with an HTTP status code of #MHD_HTTP_PRECONDITION_FAILED (412).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_WIRE_FEE_CURRENCY_MISMATCH"] = 2125] = "PAY_WIRE_FEE_CURRENCY_MISMATCH";
    /**
     * The exchange had a failure when trying to process the request, returning a malformed response.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_EXCHANGE_REPLY_MALFORMED"] = 2126] = "PAY_EXCHANGE_REPLY_MALFORMED";
    /**
     * A unknown merchant public key was included in the payment.  That happens typically when the wallet sends the payment to the wrong merchant instance.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_WRONG_INSTANCE"] = 2127] = "PAY_WRONG_INSTANCE";
    /**
     * The exchange failed to give us a response when we asked for /keys.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_EXCHANGE_HAS_NO_KEYS"] = 2128] = "PAY_EXCHANGE_HAS_NO_KEYS";
    /**
     * The deposit time for the denomination has expired.
     * Returned with an HTTP status code of #MHD_HTTP_GONE (410).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_DENOMINATION_DEPOSIT_EXPIRED"] = 2129] = "PAY_DENOMINATION_DEPOSIT_EXPIRED";
    /**
     * The proposal is not known to the backend.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_PROPOSAL_NOT_FOUND"] = 2130] = "PAY_PROPOSAL_NOT_FOUND";
    /**
     * The exchange of the deposited coin charges a wire fee that could not be added to the total (total amount too high).
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_EXCHANGE_WIRE_FEE_ADDITION_FAILED"] = 2131] = "PAY_EXCHANGE_WIRE_FEE_ADDITION_FAILED";
    /**
     * The contract was not fully paid because of refunds. Note that clients MAY treat this as paid if, for example, contracts must be executed despite of refunds.
     * Returned with an HTTP status code of #MHD_HTTP_PAYMENT_REQUIRED (402).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_REFUNDED"] = 2132] = "PAY_REFUNDED";
    /**
     * According to our database, we have refunded more than we were paid (which should not be possible).
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_REFUNDS_EXCEED_PAYMENTS"] = 2133] = "PAY_REFUNDS_EXCEED_PAYMENTS";
    /**
     * Legacy stuff. Remove me with protocol v1.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_ABORT_REFUND_REFUSED_PAYMENT_COMPLETE"] = 2134] = "PAY_ABORT_REFUND_REFUSED_PAYMENT_COMPLETE";
    /**
     * The payment failed at the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_EXCHANGE_FAILED"] = 2135] = "PAY_EXCHANGE_FAILED";
    /**
     * The merchant backend couldn't verify the order payment because of a database failure.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAID_DB_ERROR"] = 2146] = "PAID_DB_ERROR";
    /**
     * The order is not known.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAID_ORDER_UNKNOWN"] = 2147] = "PAID_ORDER_UNKNOWN";
    /**
     * The contract hash does not match the given order ID.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAID_CONTRACT_HASH_MISMATCH"] = 2148] = "PAID_CONTRACT_HASH_MISMATCH";
    /**
     * The signature of the merchant is not valid for the given contract hash.
     * Returned with an HTTP status code of #MHD_HTTP_FORBIDDEN (403).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAID_COIN_SIGNATURE_INVALID"] = 2149] = "PAID_COIN_SIGNATURE_INVALID";
    /**
     * The merchant failed to contact the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ABORT_EXCHANGE_KEYS_FAILURE"] = 2150] = "ABORT_EXCHANGE_KEYS_FAILURE";
    /**
     * The merchant failed to send the exchange the refund request.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ABORT_EXCHANGE_REFUND_FAILED"] = 2151] = "ABORT_EXCHANGE_REFUND_FAILED";
    /**
     * The merchant failed to find the exchange to process the lookup.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ABORT_EXCHANGE_LOOKUP_FAILED"] = 2152] = "ABORT_EXCHANGE_LOOKUP_FAILED";
    /**
     * The merchant failed to store the abort request in its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ABORT_DB_STORE_ABORT_ERROR"] = 2153] = "ABORT_DB_STORE_ABORT_ERROR";
    /**
     * The merchant failed to repeatedly serialize the transaction.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ABORT_DB_STORE_TRANSACTION_ERROR"] = 2154] = "ABORT_DB_STORE_TRANSACTION_ERROR";
    /**
     * The merchant failed in the lookup part of the transaction.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ABORT_DB_FETCH_TRANSACTION_ERROR"] = 2155] = "ABORT_DB_FETCH_TRANSACTION_ERROR";
    /**
     * The merchant could not find the contract.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ABORT_CONTRACT_NOT_FOUND"] = 2156] = "ABORT_CONTRACT_NOT_FOUND";
    /**
     * The payment was already completed and thus cannot be aborted anymore.
     * Returned with an HTTP status code of #MHD_HTTP_PRECONDITION_FAILED (412).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ABORT_REFUND_REFUSED_PAYMENT_COMPLETE"] = 2157] = "ABORT_REFUND_REFUSED_PAYMENT_COMPLETE";
    /**
     * The hash provided by the wallet does not match the order.
     * Returned with an HTTP status code of #MHD_HTTP_FORBIDDEN (403).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ABORT_CONTRACT_HASH_MISSMATCH"] = 2158] = "ABORT_CONTRACT_HASH_MISSMATCH";
    /**
     * The array of coins cannot be empty.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ABORT_COINS_ARRAY_EMPTY"] = 2159] = "ABORT_COINS_ARRAY_EMPTY";
    /**
     * The merchant experienced a timeout processing the request.
     * Returned with an HTTP status code of #MHD_HTTP_REQUEST_TIMEOUT (408).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ABORT_EXCHANGE_TIMEOUT"] = 2160] = "ABORT_EXCHANGE_TIMEOUT";
    /**
     * The merchant could not find the order.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["FORGET_ORDER_NOT_FOUND"] = 2180] = "FORGET_ORDER_NOT_FOUND";
    /**
     * One of the paths to forget is malformed.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["FORGET_PATH_SYNTAX_INCORRECT"] = 2181] = "FORGET_PATH_SYNTAX_INCORRECT";
    /**
     * One of the paths to forget was not marked as forgettable.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["FORGET_PATH_NOT_FORGETTABLE"] = 2182] = "FORGET_PATH_NOT_FORGETTABLE";
    /**
     * Integer overflow with specified timestamp argument detected.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["HISTORY_TIMESTAMP_OVERFLOW"] = 2200] = "HISTORY_TIMESTAMP_OVERFLOW";
    /**
     * Failed to retrieve history from merchant database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["HISTORY_DB_FETCH_ERROR"] = 2201] = "HISTORY_DB_FETCH_ERROR";
    /**
     * The backend could not find the contract specified in the request.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POLL_PAYMENT_CONTRACT_NOT_FOUND"] = 2250] = "POLL_PAYMENT_CONTRACT_NOT_FOUND";
    /**
     * The response provided by the merchant backend was malformed. This error is created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POLL_PAYMENT_REPLY_MALFORMED"] = 2251] = "POLL_PAYMENT_REPLY_MALFORMED";
    /**
     * We failed to contact the exchange for the /track/transaction request.
     * Returned with an HTTP status code of #MHD_HTTP_SERVICE_UNAVAILABLE (503).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRACK_TRANSACTION_EXCHANGE_TIMEOUT"] = 2300] = "TRACK_TRANSACTION_EXCHANGE_TIMEOUT";
    /**
     * We failed to get a valid /keys response from the exchange for the /track/transaction request.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRACK_TRANSACTION_EXCHANGE_KEYS_FAILURE"] = 2301] = "TRACK_TRANSACTION_EXCHANGE_KEYS_FAILURE";
    /**
     * The backend could not find the transaction specified in the request.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRACK_TRANSACTION_TRANSACTION_UNKNOWN"] = 2302] = "TRACK_TRANSACTION_TRANSACTION_UNKNOWN";
    /**
     * The backend had a database access error trying to retrieve transaction data from its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRACK_TRANSACTION_DB_FETCH_TRANSACTION_ERROR"] = 2303] = "TRACK_TRANSACTION_DB_FETCH_TRANSACTION_ERROR";
    /**
     * The backend had a database access error trying to retrieve payment data from its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRACK_TRANSACTION_DB_FETCH_PAYMENT_ERROR"] = 2304] = "TRACK_TRANSACTION_DB_FETCH_PAYMENT_ERROR";
    /**
     * The backend found no applicable deposits in the database. This is odd, as we know about the transaction, but not about deposits we made for the transaction.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRACK_TRANSACTION_DB_NO_DEPOSITS_ERROR"] = 2305] = "TRACK_TRANSACTION_DB_NO_DEPOSITS_ERROR";
    /**
     * We failed to obtain a wire transfer identifier for one of the coins in the transaction.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRACK_TRANSACTION_COIN_TRACE_ERROR"] = 2306] = "TRACK_TRANSACTION_COIN_TRACE_ERROR";
    /**
     * We failed to obtain the full wire transfer identifier for the transfer one of the coins was aggregated into.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRACK_TRANSACTION_WIRE_TRANSFER_TRACE_ERROR"] = 2307] = "TRACK_TRANSACTION_WIRE_TRANSFER_TRACE_ERROR";
    /**
     * We got conflicting reports from the exhange with respect to which transfers are included in which aggregate.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TRACK_TRANSACTION_CONFLICTING_REPORTS"] = 2308] = "TRACK_TRANSACTION_CONFLICTING_REPORTS";
    /**
     * We did failed to retrieve information from our database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_TRANSFERS_DB_FETCH_ERROR"] = 2350] = "GET_TRANSFERS_DB_FETCH_ERROR";
    /**
     * We failed to contact the exchange for the /track/transfer request.
     * Returned with an HTTP status code of #MHD_HTTP_SERVICE_UNAVAILABLE (503).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_EXCHANGE_TIMEOUT"] = 2400] = "POST_TRANSFERS_EXCHANGE_TIMEOUT";
    /**
     * We failed to obtain an acceptable /keys response from the exchange for the /track/transfer request.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_EXCHANGE_KEYS_FAILURE"] = 2401] = "POST_TRANSFERS_EXCHANGE_KEYS_FAILURE";
    /**
     * We failed to persist coin wire transfer information in our merchant database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_DB_STORE_COIN_ERROR"] = 2402] = "POST_TRANSFERS_DB_STORE_COIN_ERROR";
    /**
     * We internally failed to execute the /track/transfer request.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_REQUEST_ERROR"] = 2403] = "POST_TRANSFERS_REQUEST_ERROR";
    /**
     * We failed to persist wire transfer information in our merchant database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_DB_STORE_TRANSFER_ERROR"] = 2404] = "POST_TRANSFERS_DB_STORE_TRANSFER_ERROR";
    /**
     * The exchange returned an error from /track/transfer.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_EXCHANGE_ERROR"] = 2405] = "POST_TRANSFERS_EXCHANGE_ERROR";
    /**
     * We failed to fetch deposit information from our merchant database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_DB_FETCH_DEPOSIT_ERROR"] = 2406] = "POST_TRANSFERS_DB_FETCH_DEPOSIT_ERROR";
    /**
     * We encountered an internal logic error.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_DB_INTERNAL_LOGIC_ERROR"] = 2407] = "POST_TRANSFERS_DB_INTERNAL_LOGIC_ERROR";
    /**
     * The exchange gave conflicting information about a coin which has been wire transferred.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_CONFLICTING_REPORTS"] = 2408] = "POST_TRANSFERS_CONFLICTING_REPORTS";
    /**
     * The merchant backend had problems in creating the JSON response.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_JSON_RESPONSE_ERROR"] = 2409] = "POST_TRANSFERS_JSON_RESPONSE_ERROR";
    /**
     * The exchange charged a different wire fee than what it originally advertised, and it is higher.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_JSON_BAD_WIRE_FEE"] = 2410] = "POST_TRANSFERS_JSON_BAD_WIRE_FEE";
    /**
     * We did not find the account that the transfer was made to.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_ACCOUNT_NOT_FOUND"] = 2411] = "POST_TRANSFERS_ACCOUNT_NOT_FOUND";
    /**
     * We did failed to store information in our database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_DB_STORE_ERROR"] = 2412] = "POST_TRANSFERS_DB_STORE_ERROR";
    /**
     * We did failed to retrieve information from our database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_TRANSFERS_DB_LOOKUP_ERROR"] = 2413] = "POST_TRANSFERS_DB_LOOKUP_ERROR";
    /**
     * The merchant backend cannot create an instance under the given identifier as one already exists. Use PATCH to modify the existing entry.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_INSTANCES_ALREADY_EXISTS"] = 2450] = "POST_INSTANCES_ALREADY_EXISTS";
    /**
     * The merchant backend cannot create an instance because the specified bank accounts are somehow invalid.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_INSTANCES_BAD_PAYTO_URIS"] = 2451] = "POST_INSTANCES_BAD_PAYTO_URIS";
    /**
     * The merchant backend cannot create an instance because it failed to start the database transaction.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_INSTANCES_DB_START_ERROR"] = 2452] = "POST_INSTANCES_DB_START_ERROR";
    /**
     * The merchant backend cannot create an instance because it failed to commit the database transaction.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["POST_INSTANCES_DB_COMMIT_ERROR"] = 2453] = "POST_INSTANCES_DB_COMMIT_ERROR";
    /**
     * The merchant backend cannot delete an instance because it failed to commit the database transaction.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DELETE_INSTANCES_ID_DB_HARD_FAILURE"] = 2454] = "DELETE_INSTANCES_ID_DB_HARD_FAILURE";
    /**
     * The merchant backend cannot delete the data because it already does not exist.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DELETE_INSTANCES_ID_NO_SUCH_INSTANCE"] = 2455] = "DELETE_INSTANCES_ID_NO_SUCH_INSTANCE";
    /**
     * The merchant backend cannot update an instance because the specified bank accounts are somehow invalid.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PATCH_INSTANCES_BAD_PAYTO_URIS"] = 2456] = "PATCH_INSTANCES_BAD_PAYTO_URIS";
    /**
     * The merchant backend cannot patch an instance because it failed to start the database transaction.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PATCH_INSTANCES_DB_START_ERROR"] = 2457] = "PATCH_INSTANCES_DB_START_ERROR";
    /**
     * The merchant backend cannot patch an instance because it failed to commit the database transaction.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PATCH_INSTANCES_DB_COMMIT_ERROR"] = 2458] = "PATCH_INSTANCES_DB_COMMIT_ERROR";
    /**
     * The hash provided in the request of /map/in does not match the contract sent alongside in the same request.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MAP_IN_UNMATCHED_HASH"] = 2500] = "MAP_IN_UNMATCHED_HASH";
    /**
     * The backend encountered an error while trying to store the h_contract_terms into the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PROPOSAL_STORE_DB_ERROR"] = 2501] = "PROPOSAL_STORE_DB_ERROR";
    /**
     * The backend encountered an error while trying to retrieve the proposal data from database.  Likely to be an internal error.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PROPOSAL_LOOKUP_DB_ERROR"] = 2502] = "PROPOSAL_LOOKUP_DB_ERROR";
    /**
     * The proposal being looked up is not found on this merchant.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PROPOSAL_LOOKUP_NOT_FOUND"] = 2503] = "PROPOSAL_LOOKUP_NOT_FOUND";
    /**
     * The proposal had no timestamp and the backend failed to obtain the local time. Likely to be an internal error.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PROPOSAL_NO_LOCALTIME"] = 2504] = "PROPOSAL_NO_LOCALTIME";
    /**
     * The order provided to the backend could not be parsed, some required fields were missing or ill-formed.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PROPOSAL_ORDER_PARSE_ERROR"] = 2505] = "PROPOSAL_ORDER_PARSE_ERROR";
    /**
     * The backend encountered an error while trying to find the existing proposal in the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PROPOSAL_STORE_DB_ERROR_HARD"] = 2506] = "PROPOSAL_STORE_DB_ERROR_HARD";
    /**
     * The backend encountered an error while trying to find the existing proposal in the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PROPOSAL_STORE_DB_ERROR_SOFT"] = 2507] = "PROPOSAL_STORE_DB_ERROR_SOFT";
    /**
     * The backend encountered an error: the proposal already exists.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PROPOSAL_STORE_DB_ERROR_ALREADY_EXISTS"] = 2508] = "PROPOSAL_STORE_DB_ERROR_ALREADY_EXISTS";
    /**
     * The order provided to the backend uses an amount in a currency that does not match the backend's configuration.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PROPOSAL_ORDER_BAD_CURRENCY"] = 2509] = "PROPOSAL_ORDER_BAD_CURRENCY";
    /**
     * The response provided by the merchant backend was malformed. This error is created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PROPOSAL_REPLY_MALFORMED"] = 2510] = "PROPOSAL_REPLY_MALFORMED";
    /**
     * The order provided to the backend could not be deleted, it is not known.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ORDERS_DELETE_NO_SUCH_ORDER"] = 2511] = "ORDERS_DELETE_NO_SUCH_ORDER";
    /**
     * The order provided to the backend could not be deleted, our offer is still valid and awaiting payment.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ORDERS_DELETE_AWAITING_PAYMENT"] = 2512] = "ORDERS_DELETE_AWAITING_PAYMENT";
    /**
     * The order provided to the backend could not be deleted, due to a database error.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ORDERS_DELETE_DB_HARD_FAILURE"] = 2513] = "ORDERS_DELETE_DB_HARD_FAILURE";
    /**
     * The order provided to the backend could not be completed, due to a database error trying to fetch product inventory data.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ORDERS_LOOKUP_PRODUCT_DB_HARD_FAILURE"] = 2514] = "ORDERS_LOOKUP_PRODUCT_DB_HARD_FAILURE";
    /**
     * The order provided to the backend could not be completed, due to a database serialization error (which should be impossible) trying to fetch product inventory data.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ORDERS_LOOKUP_PRODUCT_DB_SOFT_FAILURE"] = 2515] = "ORDERS_LOOKUP_PRODUCT_DB_SOFT_FAILURE";
    /**
     * The order provided to the backend could not be completed, because a product to be completed via inventory data is not actually in our inventory.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ORDERS_LOOKUP_PRODUCT_NOT_FOUND"] = 2516] = "ORDERS_LOOKUP_PRODUCT_NOT_FOUND";
    /**
     * We could not obtain a list of all orders because of a database failure.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ORDERS_GET_DB_LOOKUP_ERROR"] = 2517] = "ORDERS_GET_DB_LOOKUP_ERROR";
    /**
     * We could not claim the order because of a database failure.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ORDERS_CLAIM_HARD_DB_ERROR"] = 2518] = "ORDERS_CLAIM_HARD_DB_ERROR";
    /**
     * We could not claim the order because of a database serialization failure.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ORDERS_CLAIM_SOFT_DB_ERROR"] = 2519] = "ORDERS_CLAIM_SOFT_DB_ERROR";
    /**
     * We could not claim the order because the backend is unaware of it.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ORDERS_CLAIM_NOT_FOUND"] = 2520] = "ORDERS_CLAIM_NOT_FOUND";
    /**
     * We could not claim the order because someone else claimed it first.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["ORDERS_ALREADY_CLAIMED"] = 2521] = "ORDERS_ALREADY_CLAIMED";
    /**
     * The merchant backend failed to lookup the products.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_PRODUCTS_DB_LOOKUP_ERROR"] = 2550] = "GET_PRODUCTS_DB_LOOKUP_ERROR";
    /**
     * The merchant backend failed to start the transaction.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_POST_DB_START_ERROR"] = 2551] = "PRODUCTS_POST_DB_START_ERROR";
    /**
     * The product ID exists.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_POST_CONFLICT_PRODUCT_EXISTS"] = 2552] = "PRODUCTS_POST_CONFLICT_PRODUCT_EXISTS";
    /**
     * The merchant backend failed to serialize the transaction.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_POST_DB_COMMIT_SOFT_ERROR"] = 2553] = "PRODUCTS_POST_DB_COMMIT_SOFT_ERROR";
    /**
     * The merchant backend failed to commit the transaction.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_POST_DB_COMMIT_HARD_ERROR"] = 2554] = "PRODUCTS_POST_DB_COMMIT_HARD_ERROR";
    /**
     * The merchant backend failed to commit the transaction.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_PATCH_DB_COMMIT_HARD_ERROR"] = 2555] = "PRODUCTS_PATCH_DB_COMMIT_HARD_ERROR";
    /**
     * The merchant backend did not find the product to be updated.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_PATCH_UNKNOWN_PRODUCT"] = 2556] = "PRODUCTS_PATCH_UNKNOWN_PRODUCT";
    /**
     * The update would have reduced the total amount of product lost, which is not allowed.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_PATCH_TOTAL_LOST_REDUCED"] = 2557] = "PRODUCTS_PATCH_TOTAL_LOST_REDUCED";
    /**
     * The update would have mean that more stocks were lost than what remains from total inventory after sales, which is not allowed.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_PATCH_TOTAL_LOST_EXCEEDS_STOCKS"] = 2558] = "PRODUCTS_PATCH_TOTAL_LOST_EXCEEDS_STOCKS";
    /**
     * The update would have reduced the total amount of product in stock, which is not allowed.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_PATCH_TOTAL_STOCKED_REDUCED"] = 2559] = "PRODUCTS_PATCH_TOTAL_STOCKED_REDUCED";
    /**
     * The lock request is for more products than we have left (unlocked) in stock.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_LOCK_INSUFFICIENT_STOCKS"] = 2560] = "PRODUCTS_LOCK_INSUFFICIENT_STOCKS";
    /**
     * The lock request is for an unknown product.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_LOCK_UNKNOWN_PRODUCT"] = 2561] = "PRODUCTS_LOCK_UNKNOWN_PRODUCT";
    /**
     * The deletion request resulted in a hard database error.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_DELETE_DB_HARD_FAILURE"] = 2562] = "PRODUCTS_DELETE_DB_HARD_FAILURE";
    /**
     * The deletion request was for a product unknown to the backend.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_DELETE_NO_SUCH_PRODUCT"] = 2563] = "PRODUCTS_DELETE_NO_SUCH_PRODUCT";
    /**
     * The deletion request is for a product that is locked.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PRODUCTS_DELETE_CONFLICTING_LOCK"] = 2564] = "PRODUCTS_DELETE_CONFLICTING_LOCK";
    /**
     * The merchant returned a malformed response. Error created client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_LOOKUP_INVALID_RESPONSE"] = 2600] = "REFUND_LOOKUP_INVALID_RESPONSE";
    /**
     * The frontend gave an unknown order id to issue the refund to.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_ORDER_ID_UNKNOWN"] = 2601] = "REFUND_ORDER_ID_UNKNOWN";
    /**
     * The amount to be refunded is inconsistent: either is lower than the previous amount being awarded, or it is too big to be paid back. In this second case, the fault stays on the business dept. side.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_INCONSISTENT_AMOUNT"] = 2602] = "REFUND_INCONSISTENT_AMOUNT";
    /**
     * The backend encountered an error while trying to retrieve the payment data from database.  Likely to be an internal error.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_LOOKUP_DB_ERROR"] = 2603] = "REFUND_LOOKUP_DB_ERROR";
    /**
     * The backend encountered an error while trying to retrieve the payment data from database.  Likely to be an internal error.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_MERCHANT_DB_COMMIT_ERROR"] = 2604] = "REFUND_MERCHANT_DB_COMMIT_ERROR";
    /**
     * Payments are stored in a single db transaction; this error indicates that one db operation within that transaction failed.  This might involve storing of coins or other related db operations, like starting/committing the db transaction or marking a contract as paid.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_DB_STORE_PAYMENTS_ERROR"] = 2605] = "PAY_DB_STORE_PAYMENTS_ERROR";
    /**
     * The backend failed to sign the refund request.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["PAY_REFUND_SIGNATURE_FAILED"] = 2606] = "PAY_REFUND_SIGNATURE_FAILED";
    /**
     * The merchant backend is not available of any applicable refund(s) for this order.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_LOOKUP_NO_REFUND"] = 2607] = "REFUND_LOOKUP_NO_REFUND";
    /**
     * The frontend gave an unpaid order id to issue the refund to.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["REFUND_ORDER_ID_UNPAID"] = 2608] = "REFUND_ORDER_ID_UNPAID";
    /**
     * The requested wire method is not supported by the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RESERVES_POST_UNSUPPORTED_WIRE_METHOD"] = 2650] = "RESERVES_POST_UNSUPPORTED_WIRE_METHOD";
    /**
     * The backend failed to commit the result to the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RESERVES_POST_DB_COMMIT_HARD_ERROR"] = 2651] = "RESERVES_POST_DB_COMMIT_HARD_ERROR";
    /**
     * The backend failed to fetch the requested information from the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_RESERVES_DB_LOOKUP_ERROR"] = 2652] = "GET_RESERVES_DB_LOOKUP_ERROR";
    /**
     * The backend knows the instance that was supposed to support the tip, but it was not configured for tipping (i.e. has no exchange associated with it).  Likely to be a configuration error.
     * Returned with an HTTP status code of #MHD_HTTP_PRECONDITION_FAILED (412).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_AUTHORIZE_INSTANCE_DOES_NOT_TIP"] = 2701] = "TIP_AUTHORIZE_INSTANCE_DOES_NOT_TIP";
    /**
     * The reserve that was used to fund the tips has expired.
     * Returned with an HTTP status code of #MHD_HTTP_GONE (410).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_AUTHORIZE_RESERVE_EXPIRED"] = 2702] = "TIP_AUTHORIZE_RESERVE_EXPIRED";
    /**
     * The reserve that was used to fund the tips was not found in the DB.
     * Returned with an HTTP status code of #MHD_HTTP_SERVICE_UNAVAILABLE (503).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_AUTHORIZE_RESERVE_UNKNOWN"] = 2703] = "TIP_AUTHORIZE_RESERVE_UNKNOWN";
    /**
     * The backend knows the instance that was supposed to support the tip, and it was configured for tipping. However, the funds remaining are insufficient to cover the tip, and the merchant should top up the reserve.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_AUTHORIZE_INSUFFICIENT_FUNDS"] = 2704] = "TIP_AUTHORIZE_INSUFFICIENT_FUNDS";
    /**
     * The backend had trouble accessing the database to persist information about the tip authorization. Returned with an HTTP status code of internal error.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_AUTHORIZE_DB_HARD_ERROR"] = 2705] = "TIP_AUTHORIZE_DB_HARD_ERROR";
    /**
     * The backend had trouble accessing the database to persist information about the tip authorization. The problem might be fixable by repeating the transaction.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_AUTHORIZE_DB_SOFT_ERROR"] = 2706] = "TIP_AUTHORIZE_DB_SOFT_ERROR";
    /**
     * The backend failed to obtain a reserve status from the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_RESERVE_STATUS_FAILED_EXCHANGE_DOWN"] = 2707] = "TIP_QUERY_RESERVE_STATUS_FAILED_EXCHANGE_DOWN";
    /**
     * The backend got an empty (!) reserve history from the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_RESERVE_HISTORY_FAILED_EMPTY"] = 2708] = "TIP_QUERY_RESERVE_HISTORY_FAILED_EMPTY";
    /**
     * The backend got an invalid reserve history (fails to start with a deposit) from the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_RESERVE_HISTORY_INVALID_NO_DEPOSIT"] = 2709] = "TIP_QUERY_RESERVE_HISTORY_INVALID_NO_DEPOSIT";
    /**
     * The backend got an 404 response from the exchange when it inquired about the reserve history.
     * Returned with an HTTP status code of #MHD_HTTP_SERVICE_UNAVAILABLE (503).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_RESERVE_UNKNOWN_TO_EXCHANGE"] = 2710] = "TIP_QUERY_RESERVE_UNKNOWN_TO_EXCHANGE";
    /**
     * The backend got a reserve with a currency that does not match the backend's currency.
     * Returned with an HTTP status code of #MHD_HTTP_SERVICE_UNAVAILABLE (503).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_RESERVE_CURRENCY_MISMATCH"] = 2711] = "TIP_QUERY_RESERVE_CURRENCY_MISMATCH";
    /**
     * The backend got a reserve history with amounts it cannot process (addition failure in deposits).
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_RESERVE_HISTORY_ARITHMETIC_ISSUE_DEPOSIT"] = 2712] = "TIP_QUERY_RESERVE_HISTORY_ARITHMETIC_ISSUE_DEPOSIT";
    /**
     * The backend got a reserve history with amounts it cannot process (addition failure in withdraw amounts).
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_RESERVE_HISTORY_ARITHMETIC_ISSUE_WITHDRAW"] = 2713] = "TIP_QUERY_RESERVE_HISTORY_ARITHMETIC_ISSUE_WITHDRAW";
    /**
     * The backend got a reserve history with amounts it cannot process (addition failure in closing amounts).
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_RESERVE_HISTORY_ARITHMETIC_ISSUE_CLOSED"] = 2714] = "TIP_QUERY_RESERVE_HISTORY_ARITHMETIC_ISSUE_CLOSED";
    /**
     * The backend got a reserve history with inconsistent amounts.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_RESERVE_HISTORY_ARITHMETIC_ISSUE_INCONSISTENT"] = 2715] = "TIP_QUERY_RESERVE_HISTORY_ARITHMETIC_ISSUE_INCONSISTENT";
    /**
     * The backend encountered a database error querying tipping reserves.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_DB_ERROR"] = 2716] = "TIP_QUERY_DB_ERROR";
    /**
     * The backend got an unexpected resever history reply from the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_RESERVE_HISTORY_FAILED"] = 2717] = "TIP_QUERY_RESERVE_HISTORY_FAILED";
    /**
     * The backend got a reserve history with amounts it cannot process (addition failure in withdraw amounts).
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_RESERVE_HISTORY_ARITHMETIC_ISSUE_RECOUP"] = 2718] = "TIP_QUERY_RESERVE_HISTORY_ARITHMETIC_ISSUE_RECOUP";
    /**
     * The backend knows the instance that was supposed to support the tip, but it was not configured for tipping (i.e. has no exchange associated with it).  Likely to be a configuration error.
     * Returned with an HTTP status code of #MHD_HTTP_PRECONDITION_FAILED (412).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_INSTANCE_DOES_NOT_TIP"] = 2719] = "TIP_QUERY_INSTANCE_DOES_NOT_TIP";
    /**
     * The tip id is unknown.  This could happen if the tip id is wrong or the tip authorization expired.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_QUERY_TIP_ID_UNKNOWN"] = 2720] = "TIP_QUERY_TIP_ID_UNKNOWN";
    /**
     * The reserve could not be deleted due to a database failure.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RESERVES_DELETE_DB_HARD_FAILURE"] = 2721] = "RESERVES_DELETE_DB_HARD_FAILURE";
    /**
     * The reserve could not be deleted because it is unknown.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["RESERVES_DELETE_NO_SUCH_RESERVE"] = 2722] = "RESERVES_DELETE_NO_SUCH_RESERVE";
    /**
     * The backend got an unexpected error trying to lookup reserve details from the backend.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_LOOKUP_RESERVE_DB_FAILURE"] = 2723] = "TIP_LOOKUP_RESERVE_DB_FAILURE";
    /**
     * The backend repeatedly failed to serialize the transaction to authorize the tip.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_AUTHORIZE_DB_SERIALIZATION_FAILURE"] = 2724] = "TIP_AUTHORIZE_DB_SERIALIZATION_FAILURE";
    /**
     * The backend failed to start the transaction to authorize the tip.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_AUTHORIZE_DB_START_FAILURE"] = 2725] = "TIP_AUTHORIZE_DB_START_FAILURE";
    /**
     * The backend failed looking up the reserve needed to authorize the tip.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_AUTHORIZE_DB_LOOKUP_RESERVE_FAILURE"] = 2726] = "TIP_AUTHORIZE_DB_LOOKUP_RESERVE_FAILURE";
    /**
     * The backend failed to find a reserve needed to authorize the tip.
     * Returned with an HTTP status code of #MHD_HTTP_SERVICE_UNAVAILABLE (503).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_AUTHORIZE_DB_RESERVE_NOT_FOUND"] = 2727] = "TIP_AUTHORIZE_DB_RESERVE_NOT_FOUND";
    /**
     * The backend encountered an internal invariant violation.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_AUTHORIZE_DB_RESERVE_INVARIANT_FAILURE"] = 2728] = "TIP_AUTHORIZE_DB_RESERVE_INVARIANT_FAILURE";
    /**
     * The selected exchange expired.
     * Returned with an HTTP status code of #MHD_HTTP_GONE (410).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_AUTHORIZE_DB_RESERVE_EXPIRED"] = 2729] = "TIP_AUTHORIZE_DB_RESERVE_EXPIRED";
    /**
     * The backend failed updating the reserve needed to authorize the tip.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_AUTHORIZE_DB_UPDATE_RESERVE_FAILURE"] = 2730] = "TIP_AUTHORIZE_DB_UPDATE_RESERVE_FAILURE";
    /**
     * The backend had trouble accessing the database to persist information about enabling tips. Returned with an HTTP status code of internal error.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_ENABLE_DB_TRANSACTION_ERROR"] = 2750] = "TIP_ENABLE_DB_TRANSACTION_ERROR";
    /**
     * The tip ID is unknown.  This could happen if the tip has expired.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_TIP_ID_UNKNOWN"] = 2800] = "TIP_PICKUP_TIP_ID_UNKNOWN";
    /**
     * The amount requested exceeds the remaining tipping balance for this tip ID. Returned with an HTTP status code of "Conflict" (as it conflicts with a previous pickup operation).
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_NO_FUNDS"] = 2801] = "TIP_PICKUP_NO_FUNDS";
    /**
     * We encountered a DB error, repeating the request may work.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_DB_ERROR_SOFT"] = 2802] = "TIP_PICKUP_DB_ERROR_SOFT";
    /**
     * We encountered a DB error, repeating the request will not help. This is an internal server error.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_DB_ERROR_HARD"] = 2803] = "TIP_PICKUP_DB_ERROR_HARD";
    /**
     * The same pickup ID was already used for picking up a different amount. This points to a very strange internal error as the pickup ID is derived from the denomination key which is tied to a particular amount. Hence this should also be an internal server error.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_AMOUNT_CHANGED"] = 2804] = "TIP_PICKUP_AMOUNT_CHANGED";
    /**
     * We failed to contact the exchange to obtain the denomination keys.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_EXCHANGE_DOWN"] = 2805] = "TIP_PICKUP_EXCHANGE_DOWN";
    /**
     * We contacted the exchange to obtain any denomination keys, but got no valid keys.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_EXCHANGE_LACKED_KEYS"] = 2806] = "TIP_PICKUP_EXCHANGE_LACKED_KEYS";
    /**
     * We contacted the exchange to obtain at least one of the denomination keys specified in the request. Returned with a response code "not found" (404).
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_EXCHANGE_LACKED_KEY"] = 2807] = "TIP_PICKUP_EXCHANGE_LACKED_KEY";
    /**
     * We encountered an arithmetic issue totaling up the amount to withdraw.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_EXCHANGE_AMOUNT_OVERFLOW"] = 2808] = "TIP_PICKUP_EXCHANGE_AMOUNT_OVERFLOW";
    /**
     * The number of planchets specified exceeded the limit.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_EXCHANGE_TOO_MANY_PLANCHETS"] = 2809] = "TIP_PICKUP_EXCHANGE_TOO_MANY_PLANCHETS";
    /**
     * The merchant failed to initialize the withdraw operation.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_WITHDRAW_FAILED"] = 2810] = "TIP_PICKUP_WITHDRAW_FAILED";
    /**
     * The merchant failed to initialize the withdraw operation.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_WITHDRAW_FAILED_AT_EXCHANGE"] = 2811] = "TIP_PICKUP_WITHDRAW_FAILED_AT_EXCHANGE";
    /**
     * The client failed to unblind the signature returned by the merchant. Generated client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_UNBLIND_FAILURE"] = 2812] = "TIP_PICKUP_UNBLIND_FAILURE";
    /**
     * Merchant failed to access its database to lookup the tip.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_TIPS_DB_LOOKUP_ERROR"] = 2813] = "GET_TIPS_DB_LOOKUP_ERROR";
    /**
     * Merchant failed find the tip in its database.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_TIPS_ID_UNKNOWN"] = 2814] = "GET_TIPS_ID_UNKNOWN";
    /**
     * The merchant failed to contact the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_CONTACT_EXCHANGE_ERROR"] = 2815] = "TIP_PICKUP_CONTACT_EXCHANGE_ERROR";
    /**
     * The merchant failed to obtain keys from the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_EXCHANGE_KEYS_ERROR"] = 2816] = "TIP_PICKUP_EXCHANGE_KEYS_ERROR";
    /**
     * The merchant failed to store data in its own database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_DB_STORE_HARD_ERROR"] = 2817] = "TIP_PICKUP_DB_STORE_HARD_ERROR";
    /**
     * The merchant failed to get a timely response from the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_REQUEST_TIMEOUT (408).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_EXCHANGE_TIMEOUT"] = 2818] = "TIP_PICKUP_EXCHANGE_TIMEOUT";
    /**
     * The exchange returned a failure code for the withdraw operation.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_EXCHANGE_ERROR"] = 2819] = "TIP_PICKUP_EXCHANGE_ERROR";
    /**
     * The merchant failed to add up the amounts to compute the pick up value.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_SUMMATION_FAILED"] = 2820] = "TIP_PICKUP_SUMMATION_FAILED";
    /**
     * The tip expired.
     * Returned with an HTTP status code of #MHD_HTTP_GONE (410).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_HAS_EXPIRED"] = 2821] = "TIP_PICKUP_HAS_EXPIRED";
    /**
     * The requested withdraw amount exceeds the amount remaining to be picked up.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_AMOUNT_EXCEEDS_TIP_REMAINING"] = 2822] = "TIP_PICKUP_AMOUNT_EXCEEDS_TIP_REMAINING";
    /**
     * The merchant failed to store data in its own database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_DB_STORE_SOFT_ERROR"] = 2823] = "TIP_PICKUP_DB_STORE_SOFT_ERROR";
    /**
     * The merchant did not find the specified denomination key in the exchange's key set.
     * Returned with an HTTP status code of #MHD_HTTP_CONFLICT (409).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TIP_PICKUP_DENOMINATION_UNKNOWN"] = 2824] = "TIP_PICKUP_DENOMINATION_UNKNOWN";
    /**
     * We failed to fetch contract terms from our merchant database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_DB_LOOKUP_ERROR"] = 2900] = "GET_ORDERS_DB_LOOKUP_ERROR";
    /**
     * We failed to find the contract terms from our merchant database.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_ID_UNKNOWN"] = 2901] = "GET_ORDERS_ID_UNKNOWN";
    /**
     * The merchant had a timeout contacting the exchange, thus not providing wire details in the response.
     * Returned with an HTTP status code of #MHD_HTTP_REQUEST_TIMEOUT (408).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_EXCHANGE_TIMEOUT"] = 2902] = "GET_ORDERS_EXCHANGE_TIMEOUT";
    /**
     * The exchange failed to provide a valid answer to the tracking request, thus those details are not in the response.
     * Returned with an HTTP status code of #MHD_HTTP_OK (200).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_EXCHANGE_TRACKING_FAILURE"] = 2903] = "GET_ORDERS_EXCHANGE_TRACKING_FAILURE";
    /**
     * The merchant backend failed to persist tracking details in its database, thus those details are not in the response.
     * Returned with an HTTP status code of #MHD_HTTP_OK (200).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_DB_STORE_TRACKING_FAILURE"] = 2904] = "GET_ORDERS_DB_STORE_TRACKING_FAILURE";
    /**
     * The merchant backend encountered a failure in computing the deposit total.
     * Returned with an HTTP status code of #MHD_HTTP_OK (200).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_AMOUNT_ARITHMETIC_FAILURE"] = 2905] = "GET_ORDERS_AMOUNT_ARITHMETIC_FAILURE";
    /**
     * The merchant backend failed trying to contact the exchange for tracking details, thus those details are not in the response.
     * Returned with an HTTP status code of #MHD_HTTP_FAILED_DEPENDENCY (424).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_EXCHANGE_LOOKUP_FAILURE"] = 2906] = "GET_ORDERS_EXCHANGE_LOOKUP_FAILURE";
    /**
     * The merchant backend failed to construct the request for tracking to the exchange, thus tracking details are not in the response.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_EXCHANGE_REQUEST_FAILURE"] = 2907] = "GET_ORDERS_EXCHANGE_REQUEST_FAILURE";
    /**
     * The merchant backend had a database failure trying to find information about the contract of the order.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_DB_FETCH_CONTRACT_TERMS_ERROR"] = 2908] = "GET_ORDERS_DB_FETCH_CONTRACT_TERMS_ERROR";
    /**
     * The merchant backend could not find an order with the given identifier.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_ORDER_NOT_FOUND"] = 2909] = "GET_ORDERS_ORDER_NOT_FOUND";
    /**
     * The merchant backend could not compute the hash of the proposal.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_FAILED_COMPUTE_PROPOSAL_HASH"] = 2910] = "GET_ORDERS_FAILED_COMPUTE_PROPOSAL_HASH";
    /**
     * The merchant backend could not fetch the payment status from its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_DB_FETCH_PAYMENT_STATUS"] = 2911] = "GET_ORDERS_DB_FETCH_PAYMENT_STATUS";
    /**
     * The merchant backend had an error looking up information in its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_DB_FETCH_TRANSACTION_ERROR"] = 2912] = "GET_ORDERS_DB_FETCH_TRANSACTION_ERROR";
    /**
     * The contract obtained from the merchant backend was malformed.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_CONTRACT_CONTENT_INVALID"] = 2913] = "GET_ORDERS_CONTRACT_CONTENT_INVALID";
    /**
     * We failed to contract terms from our merchant database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["CHECK_PAYMENT_DB_FETCH_CONTRACT_TERMS_ERROR"] = 2914] = "CHECK_PAYMENT_DB_FETCH_CONTRACT_TERMS_ERROR";
    /**
     * We failed to contract terms from our merchant database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["CHECK_PAYMENT_DB_FETCH_ORDER_ERROR"] = 2915] = "CHECK_PAYMENT_DB_FETCH_ORDER_ERROR";
    /**
     * The order id we're checking is unknown, likely the frontend did not create the order first.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["CHECK_PAYMENT_ORDER_ID_UNKNOWN"] = 2916] = "CHECK_PAYMENT_ORDER_ID_UNKNOWN";
    /**
     * Failed computing a hash code (likely server out-of-memory).
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["CHECK_PAYMENT_FAILED_COMPUTE_PROPOSAL_HASH"] = 2917] = "CHECK_PAYMENT_FAILED_COMPUTE_PROPOSAL_HASH";
    /**
     * Signature "session_sig" failed to verify.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["CHECK_PAYMENT_SESSION_SIGNATURE_INVALID"] = 2918] = "CHECK_PAYMENT_SESSION_SIGNATURE_INVALID";
    /**
     * The order we found does not match the provided contract hash.
     * Returned with an HTTP status code of #MHD_HTTP_FORBIDDEN (403).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDER_WRONG_CONTRACT"] = 2919] = "GET_ORDER_WRONG_CONTRACT";
    /**
     * The response we received from the merchant is malformed. This error is generated client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["CHECK_PAYMENT_RESPONSE_MALFORMED"] = 2920] = "CHECK_PAYMENT_RESPONSE_MALFORMED";
    /**
     * The merchant backend failed trying to contact the exchange for tracking details, thus those details are not in the response.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["GET_ORDERS_EXCHANGE_LOOKUP_START_FAILURE"] = 2921] = "GET_ORDERS_EXCHANGE_LOOKUP_START_FAILURE";
    /**
     * The response we received from the merchant is malformed. This error is generated client-side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MERCHANT_ORDER_GET_REPLY_MALFORMED"] = 2922] = "MERCHANT_ORDER_GET_REPLY_MALFORMED";
    /**
     * The token used to authenticate the client is invalid for this order.
     * Returned with an HTTP status code of #MHD_HTTP_FORBIDDEN (403).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["MERCHANT_GET_ORDER_INVALID_TOKEN"] = 2923] = "MERCHANT_GET_ORDER_INVALID_TOKEN";
    /**
     * The signature from the exchange on the deposit confirmation is invalid.  Returned with a "400 Bad Request" status code.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_CONFIRMATION_SIGNATURE_INVALID"] = 3000] = "DEPOSIT_CONFIRMATION_SIGNATURE_INVALID";
    /**
     * The auditor had trouble storing the deposit confirmation in its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["DEPOSIT_CONFIRMATION_STORE_DB_ERROR"] = 3001] = "DEPOSIT_CONFIRMATION_STORE_DB_ERROR";
    /**
     * The auditor had trouble retrieving the exchange list from its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["LIST_EXCHANGES_DB_ERROR"] = 3002] = "LIST_EXCHANGES_DB_ERROR";
    /**
     * The auditor had trouble storing an exchange in its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["AUDITOR_EXCHANGE_STORE_DB_ERROR"] = 3003] = "AUDITOR_EXCHANGE_STORE_DB_ERROR";
    /**
     * The auditor (!) responded with a reply that did not satsify the protocol. This error is not used in the protocol but created client- side.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["AUDITOR_EXCHANGES_REPLY_MALFORMED"] = 3004] = "AUDITOR_EXCHANGES_REPLY_MALFORMED";
    /**
     * The exchange failed to compute ECDH.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TEST_ECDH_ERROR"] = 4000] = "TEST_ECDH_ERROR";
    /**
     * The EdDSA test signature is invalid.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TEST_EDDSA_INVALID"] = 4001] = "TEST_EDDSA_INVALID";
    /**
     * The exchange failed to compute the EdDSA test signature.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TEST_EDDSA_ERROR"] = 4002] = "TEST_EDDSA_ERROR";
    /**
     * The exchange failed to generate an RSA key.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TEST_RSA_GEN_ERROR"] = 4003] = "TEST_RSA_GEN_ERROR";
    /**
     * The exchange failed to compute the public RSA key.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TEST_RSA_PUB_ERROR"] = 4004] = "TEST_RSA_PUB_ERROR";
    /**
     * The exchange failed to compute the RSA signature.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["TEST_RSA_SIGN_ERROR"] = 4005] = "TEST_RSA_SIGN_ERROR";
    /**
     * The JSON in the server's response was malformed.  This response is provided with HTTP status code of 0.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SERVER_JSON_INVALID"] = 5000] = "SERVER_JSON_INVALID";
    /**
     * A signature in the server's response was malformed.  This response is provided with HTTP status code of 0.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SERVER_SIGNATURE_INVALID"] = 5001] = "SERVER_SIGNATURE_INVALID";
    /**
     * Wire transfer attempted with credit and debit party being the same bank account.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_SAME_ACCOUNT"] = 5102] = "BANK_SAME_ACCOUNT";
    /**
     * Wire transfer impossible, due to financial limitation of the party that attempted the payment.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_UNALLOWED_DEBIT"] = 5103] = "BANK_UNALLOWED_DEBIT";
    /**
     * Arithmetic operation between two amounts of different currency was attempted.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_CURRENCY_MISMATCH"] = 5104] = "BANK_CURRENCY_MISMATCH";
    /**
     * At least one GET parameter was either missing or invalid for the requested operation.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_PARAMETER_MISSING_OR_INVALID"] = 5105] = "BANK_PARAMETER_MISSING_OR_INVALID";
    /**
     * JSON body sent was invalid for the requested operation.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_JSON_INVALID"] = 5106] = "BANK_JSON_INVALID";
    /**
     * Negative number was used (as value and/or fraction) to initiate a Amount object.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_NEGATIVE_NUMBER_AMOUNT"] = 5107] = "BANK_NEGATIVE_NUMBER_AMOUNT";
    /**
     * A number too big was used (as value and/or fraction) to initiate a amount object.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_NUMBER_TOO_BIG"] = 5108] = "BANK_NUMBER_TOO_BIG";
    /**
     * Could not login for the requested operation.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_LOGIN_FAILED"] = 5109] = "BANK_LOGIN_FAILED";
    /**
     * The bank account referenced in the requested operation was not found. Returned along "400 Not found".
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_UNKNOWN_ACCOUNT"] = 5110] = "BANK_UNKNOWN_ACCOUNT";
    /**
     * The transaction referenced in the requested operation (typically a reject operation), was not found.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_TRANSACTION_NOT_FOUND"] = 5111] = "BANK_TRANSACTION_NOT_FOUND";
    /**
     * Bank received a malformed amount string.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_BAD_FORMAT_AMOUNT"] = 5112] = "BANK_BAD_FORMAT_AMOUNT";
    /**
     * The client does not own the account credited by the transaction which is to be rejected, so it has no rights do reject it.  To be returned along HTTP 403 Forbidden.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_REJECT_NO_RIGHTS"] = 5200] = "BANK_REJECT_NO_RIGHTS";
    /**
     * This error code is returned when no known exception types captured the exception, and comes along with a 500 Internal Server Error.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_UNMANAGED_EXCEPTION"] = 5300] = "BANK_UNMANAGED_EXCEPTION";
    /**
     * This error code is used for all those exceptions that do not really need a specific error code to return to the client, but need to signal the middleware that the bank is not responding with 500 Internal Server Error.  Used for example when a client is trying to register with a unavailable username.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_SOFT_EXCEPTION"] = 5400] = "BANK_SOFT_EXCEPTION";
    /**
     * The request UID for a request to transfer funds has already been used, but with different details for the transfer.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["BANK_TRANSFER_REQUEST_UID_REUSED"] = 5500] = "BANK_TRANSFER_REQUEST_UID_REUSED";
    /**
     * The sync service failed to access its database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_DB_FETCH_ERROR"] = 6000] = "SYNC_DB_FETCH_ERROR";
    /**
     * The sync service failed find the record in its database.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_BACKUP_UNKNOWN"] = 6001] = "SYNC_BACKUP_UNKNOWN";
    /**
     * The sync service failed find the account in its database.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_ACCOUNT_UNKNOWN"] = 6002] = "SYNC_ACCOUNT_UNKNOWN";
    /**
     * The SHA-512 hash provided in the If-None-Match header is malformed.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_BAD_IF_NONE_MATCH"] = 6003] = "SYNC_BAD_IF_NONE_MATCH";
    /**
     * The SHA-512 hash provided in the If-Match header is malformed or missing.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_BAD_IF_MATCH"] = 6004] = "SYNC_BAD_IF_MATCH";
    /**
     * The signature provided in the "Sync-Signature" header is malformed or missing.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_BAD_SYNC_SIGNATURE"] = 6005] = "SYNC_BAD_SYNC_SIGNATURE";
    /**
     * The signature provided in the "Sync-Signature" header does not match the account, old or new Etags.
     * Returned with an HTTP status code of #MHD_HTTP_FORBIDDEN (403).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_INVALID_SIGNATURE"] = 6007] = "SYNC_INVALID_SIGNATURE";
    /**
     * The "Content-length" field for the upload is either not a number, or too big, or missing.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_BAD_CONTENT_LENGTH"] = 6008] = "SYNC_BAD_CONTENT_LENGTH";
    /**
     * The "Content-length" field for the upload is too big based on the server's terms of service.
     * Returned with an HTTP status code of #MHD_HTTP_PAYLOAD_TOO_LARGE (413).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_EXCESSIVE_CONTENT_LENGTH"] = 6009] = "SYNC_EXCESSIVE_CONTENT_LENGTH";
    /**
     * The server is out of memory to handle the upload. Trying again later may succeed.
     * Returned with an HTTP status code of #MHD_HTTP_PAYLOAD_TOO_LARGE (413).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_OUT_OF_MEMORY_ON_CONTENT_LENGTH"] = 6010] = "SYNC_OUT_OF_MEMORY_ON_CONTENT_LENGTH";
    /**
     * The uploaded data does not match the Etag.
     * Returned with an HTTP status code of #MHD_HTTP_BAD_REQUEST (400).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_INVALID_UPLOAD"] = 6011] = "SYNC_INVALID_UPLOAD";
    /**
     * We failed to check for existing upload data in the database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_DATABASE_FETCH_ERROR"] = 6012] = "SYNC_DATABASE_FETCH_ERROR";
    /**
     * HTTP server was being shutdown while this operation was pending.
     * Returned with an HTTP status code of #MHD_HTTP_SERVICE_UNAVAILABLE (503).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_SHUTDOWN"] = 6013] = "SYNC_SHUTDOWN";
    /**
     * HTTP server experienced a timeout while awaiting promised payment.
     * Returned with an HTTP status code of #MHD_HTTP_REQUEST_TIMEOUT (408).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_PAYMENT_TIMEOUT"] = 6014] = "SYNC_PAYMENT_TIMEOUT";
    /**
     * Sync could not store order data in its own database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_PAYMENT_CREATE_DB_ERROR"] = 6015] = "SYNC_PAYMENT_CREATE_DB_ERROR";
    /**
     * Sync could not store payment confirmation in its own database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_PAYMENT_CONFIRM_DB_ERROR"] = 6016] = "SYNC_PAYMENT_CONFIRM_DB_ERROR";
    /**
     * Sync could not fetch information about possible existing orders from its own database.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_PAYMENT_CHECK_ORDER_DB_ERROR"] = 6017] = "SYNC_PAYMENT_CHECK_ORDER_DB_ERROR";
    /**
     * Sync could not setup the payment request with its own backend.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_PAYMENT_CREATE_BACKEND_ERROR"] = 6018] = "SYNC_PAYMENT_CREATE_BACKEND_ERROR";
    /**
     * The sync service failed find the backup to be updated in its database.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["SYNC_PREVIOUS_BACKUP_UNKNOWN"] = 6019] = "SYNC_PREVIOUS_BACKUP_UNKNOWN";
    /**
     * The wallet does not implement a version of the exchange protocol that is compatible with the protocol version of the exchange.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_IMPLEMENTED (501).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WALLET_EXCHANGE_PROTOCOL_VERSION_INCOMPATIBLE"] = 7000] = "WALLET_EXCHANGE_PROTOCOL_VERSION_INCOMPATIBLE";
    /**
     * The wallet encountered an unexpected exception.  This is likely a bug in the wallet implementation.
     * Returned with an HTTP status code of #MHD_HTTP_INTERNAL_SERVER_ERROR (500).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WALLET_UNEXPECTED_EXCEPTION"] = 7001] = "WALLET_UNEXPECTED_EXCEPTION";
    /**
     * The wallet received a response from a server, but the response can't be parsed.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WALLET_RECEIVED_MALFORMED_RESPONSE"] = 7002] = "WALLET_RECEIVED_MALFORMED_RESPONSE";
    /**
     * The wallet tried to make a network request, but it received no response.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WALLET_NETWORK_ERROR"] = 7003] = "WALLET_NETWORK_ERROR";
    /**
     * The wallet tried to make a network request, but it was throttled.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WALLET_HTTP_REQUEST_THROTTLED"] = 7004] = "WALLET_HTTP_REQUEST_THROTTLED";
    /**
     * The wallet made a request to a service, but received an error response it does not know how to handle.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WALLET_UNEXPECTED_REQUEST_ERROR"] = 7005] = "WALLET_UNEXPECTED_REQUEST_ERROR";
    /**
     * The denominations offered by the exchange are insufficient.  Likely the exchange is badly configured or not maintained.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WALLET_EXCHANGE_DENOMINATIONS_INSUFFICIENT"] = 7006] = "WALLET_EXCHANGE_DENOMINATIONS_INSUFFICIENT";
    /**
     * The wallet does not support the operation requested by a client.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WALLET_CORE_API_OPERATION_UNKNOWN"] = 7007] = "WALLET_CORE_API_OPERATION_UNKNOWN";
    /**
     * The given taler://pay URI is invalid.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WALLET_INVALID_TALER_PAY_URI"] = 7008] = "WALLET_INVALID_TALER_PAY_URI";
    /**
     * The exchange does not know about the reserve (yet), and thus withdrawal can't progress.
     * Returned with an HTTP status code of #MHD_HTTP_NOT_FOUND (404).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["WALLET_WITHDRAW_RESERVE_UNKNOWN_AT_EXCHANGE"] = 7010] = "WALLET_WITHDRAW_RESERVE_UNKNOWN_AT_EXCHANGE";
    /**
     * End of error code range.
     * Returned with an HTTP status code of #MHD_HTTP_UNINITIALIZED (0).
     * (A value of 0 indicates that the error is generated client-side).
     */
    TalerErrorCode[TalerErrorCode["END"] = 9999] = "END";
})(TalerErrorCode || (TalerErrorCode = {}));

/*
 This file is part of GNU Taler
 (C) 2019-2020 Taler Systems SA

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
 * This exception is there to let the caller know that an error happened,
 * but the error has already been reported by writing it to the database.
 */
class OperationFailedAndReportedError extends Error {
    constructor(operationError) {
        super(operationError.message);
        this.operationError = operationError;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, OperationFailedAndReportedError.prototype);
    }
}
/**
 * This exception is thrown when an error occured and the caller is
 * responsible for recording the failure in the database.
 */
class OperationFailedError extends Error {
    constructor(operationError) {
        super(operationError.message);
        this.operationError = operationError;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, OperationFailedError.prototype);
    }
    static fromCode(ec, message, details) {
        return new OperationFailedError(makeErrorDetails(ec, message, details));
    }
}
function makeErrorDetails(ec, message, details) {
    return {
        talerErrorCode: ec,
        talerErrorHint: `Error: ${TalerErrorCode[ec]}`,
        details: details,
        message,
    };
}
/**
 * Run an operation and call the onOpError callback
 * when there was an exception or operation error that must be reported.
 * The cause will be re-thrown to the caller.
 */
function guardOperationException(op, onOpError) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield op();
        }
        catch (e) {
            if (e instanceof OperationFailedAndReportedError) {
                throw e;
            }
            if (e instanceof OperationFailedError) {
                yield onOpError(e.operationError);
                throw new OperationFailedAndReportedError(e.operationError);
            }
            if (e instanceof Error) {
                const opErr = makeErrorDetails(TalerErrorCode.WALLET_UNEXPECTED_EXCEPTION, `unexpected exception (message: ${e.message})`, {});
                yield onOpError(opErr);
                throw new OperationFailedAndReportedError(opErr);
            }
            // Something was thrown that is not even an exception!
            // Try to stringify it.
            let excString;
            try {
                excString = e.toString();
            }
            catch (e) {
                // Something went horribly wrong.
                excString = "can't stringify exception";
            }
            const opErr = makeErrorDetails(TalerErrorCode.WALLET_UNEXPECTED_EXCEPTION, `unexpected exception (not an exception, ${excString})`, {});
            yield onOpError(opErr);
            throw new OperationFailedAndReportedError(opErr);
        }
    });
}

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
 * Protocol version spoken with the exchange.
 *
 * Uses libtool's current:revision:age versioning.
 */
const WALLET_EXCHANGE_PROTOCOL_VERSION = "8:0:0";
/**
 * Protocol version spoken with the merchant.
 *
 * Uses libtool's current:revision:age versioning.
 */
const WALLET_MERCHANT_PROTOCOL_VERSION = "1:0:0";
/**
 * Cache breaker that is appended to queries such as /keys and /wire
 * to break through caching, if it has been accidentally/badly configured
 * by the exchange.
 *
 * This is only a temporary measure.
 */
const WALLET_CACHE_BREAKER_CLIENT_VERSION = "3";

/*
 This file is part of TALER
 (C) 2017 GNUnet e.V.

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
 * Compare two libtool-style version strings.
 */
function compare(me, other) {
    const meVer = parseVersion(me);
    const otherVer = parseVersion(other);
    if (!(meVer && otherVer)) {
        return undefined;
    }
    const compatible = meVer.current - meVer.age <= otherVer.current &&
        meVer.current >= otherVer.current - otherVer.age;
    const currentCmp = Math.sign(meVer.current - otherVer.current);
    return { compatible, currentCmp };
}
function parseVersion(v) {
    const [currentStr, revisionStr, ageStr, ...rest] = v.split(":");
    if (rest.length !== 0) {
        return undefined;
    }
    const current = Number.parseInt(currentStr);
    const revision = Number.parseInt(revisionStr);
    const age = Number.parseInt(ageStr);
    if (Number.isNaN(current)) {
        return undefined;
    }
    if (Number.isNaN(revision)) {
        return undefined;
    }
    if (Number.isNaN(age)) {
        return undefined;
    }
    return { current, revision, age };
}

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
function assertUnreachable(x) {
    throw new Error("Didn't expect to get here");
}

// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
// TypeScript port in 2019 by Florian Dold.
// Public domain.
//
// Implementation derived from TweetNaCl version 20140427.
// See for details: http://tweetnacl.cr.yp.to/
const gf = function (init = []) {
    const r = new Float64Array(16);
    if (init)
        for (let i = 0; i < init.length; i++)
            r[i] = init[i];
    return r;
};
//  Pluggable, initialized in high-level API below.
let randombytes = function (x, n) {
    throw new Error("no PRNG");
};
const _9 = new Uint8Array(32);
_9[0] = 9;
// prettier-ignore
const gf0 = gf();
const gf1 = gf([1]);
const _121665 = gf([0xdb41, 1]);
const D = gf([
    0x78a3,
    0x1359,
    0x4dca,
    0x75eb,
    0xd8ab,
    0x4141,
    0x0a4d,
    0x0070,
    0xe898,
    0x7779,
    0x4079,
    0x8cc7,
    0xfe73,
    0x2b6f,
    0x6cee,
    0x5203,
]);
const D2 = gf([
    0xf159,
    0x26b2,
    0x9b94,
    0xebd6,
    0xb156,
    0x8283,
    0x149a,
    0x00e0,
    0xd130,
    0xeef3,
    0x80f2,
    0x198e,
    0xfce7,
    0x56df,
    0xd9dc,
    0x2406,
]);
const X = gf([
    0xd51a,
    0x8f25,
    0x2d60,
    0xc956,
    0xa7b2,
    0x9525,
    0xc760,
    0x692c,
    0xdc5c,
    0xfdd6,
    0xe231,
    0xc0a4,
    0x53fe,
    0xcd6e,
    0x36d3,
    0x2169,
]);
const Y = gf([
    0x6658,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
]);
const I = gf([
    0xa0b0,
    0x4a0e,
    0x1b27,
    0xc4ee,
    0xe478,
    0xad2f,
    0x1806,
    0x2f43,
    0xd7a7,
    0x3dfb,
    0x0099,
    0x2b4d,
    0xdf0b,
    0x4fc1,
    0x2480,
    0x2b83,
]);
function ts64(x, i, h, l) {
    x[i] = (h >> 24) & 0xff;
    x[i + 1] = (h >> 16) & 0xff;
    x[i + 2] = (h >> 8) & 0xff;
    x[i + 3] = h & 0xff;
    x[i + 4] = (l >> 24) & 0xff;
    x[i + 5] = (l >> 16) & 0xff;
    x[i + 6] = (l >> 8) & 0xff;
    x[i + 7] = l & 0xff;
}
function vn(x, xi, y, yi, n) {
    let i, d = 0;
    for (i = 0; i < n; i++)
        d |= x[xi + i] ^ y[yi + i];
    return (1 & ((d - 1) >>> 8)) - 1;
}
function crypto_verify_32(x, xi, y, yi) {
    return vn(x, xi, y, yi, 32);
}
function set25519(r, a) {
    let i;
    for (i = 0; i < 16; i++)
        r[i] = a[i] | 0;
}
function car25519(o) {
    let i, v, c = 1;
    for (i = 0; i < 16; i++) {
        v = o[i] + c + 65535;
        c = Math.floor(v / 65536);
        o[i] = v - c * 65536;
    }
    o[0] += c - 1 + 37 * (c - 1);
}
function sel25519(p, q, b) {
    let t;
    const c = ~(b - 1);
    for (let i = 0; i < 16; i++) {
        t = c & (p[i] ^ q[i]);
        p[i] ^= t;
        q[i] ^= t;
    }
}
function pack25519(o, n) {
    let i, j, b;
    const m = gf(), t = gf();
    for (i = 0; i < 16; i++)
        t[i] = n[i];
    car25519(t);
    car25519(t);
    car25519(t);
    for (j = 0; j < 2; j++) {
        m[0] = t[0] - 0xffed;
        for (i = 1; i < 15; i++) {
            m[i] = t[i] - 0xffff - ((m[i - 1] >> 16) & 1);
            m[i - 1] &= 0xffff;
        }
        m[15] = t[15] - 0x7fff - ((m[14] >> 16) & 1);
        b = (m[15] >> 16) & 1;
        m[14] &= 0xffff;
        sel25519(t, m, 1 - b);
    }
    for (i = 0; i < 16; i++) {
        o[2 * i] = t[i] & 0xff;
        o[2 * i + 1] = t[i] >> 8;
    }
}
function neq25519(a, b) {
    const c = new Uint8Array(32), d = new Uint8Array(32);
    pack25519(c, a);
    pack25519(d, b);
    return crypto_verify_32(c, 0, d, 0);
}
function par25519(a) {
    const d = new Uint8Array(32);
    pack25519(d, a);
    return d[0] & 1;
}
function unpack25519(o, n) {
    let i;
    for (i = 0; i < 16; i++)
        o[i] = n[2 * i] + (n[2 * i + 1] << 8);
    o[15] &= 0x7fff;
}
function A(o, a, b) {
    for (let i = 0; i < 16; i++)
        o[i] = a[i] + b[i];
}
function Z(o, a, b) {
    for (let i = 0; i < 16; i++)
        o[i] = a[i] - b[i];
}
function M(o, a, b) {
    let v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0;
    const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    v = a[0];
    t0 += v * b0;
    t1 += v * b1;
    t2 += v * b2;
    t3 += v * b3;
    t4 += v * b4;
    t5 += v * b5;
    t6 += v * b6;
    t7 += v * b7;
    t8 += v * b8;
    t9 += v * b9;
    t10 += v * b10;
    t11 += v * b11;
    t12 += v * b12;
    t13 += v * b13;
    t14 += v * b14;
    t15 += v * b15;
    v = a[1];
    t1 += v * b0;
    t2 += v * b1;
    t3 += v * b2;
    t4 += v * b3;
    t5 += v * b4;
    t6 += v * b5;
    t7 += v * b6;
    t8 += v * b7;
    t9 += v * b8;
    t10 += v * b9;
    t11 += v * b10;
    t12 += v * b11;
    t13 += v * b12;
    t14 += v * b13;
    t15 += v * b14;
    t16 += v * b15;
    v = a[2];
    t2 += v * b0;
    t3 += v * b1;
    t4 += v * b2;
    t5 += v * b3;
    t6 += v * b4;
    t7 += v * b5;
    t8 += v * b6;
    t9 += v * b7;
    t10 += v * b8;
    t11 += v * b9;
    t12 += v * b10;
    t13 += v * b11;
    t14 += v * b12;
    t15 += v * b13;
    t16 += v * b14;
    t17 += v * b15;
    v = a[3];
    t3 += v * b0;
    t4 += v * b1;
    t5 += v * b2;
    t6 += v * b3;
    t7 += v * b4;
    t8 += v * b5;
    t9 += v * b6;
    t10 += v * b7;
    t11 += v * b8;
    t12 += v * b9;
    t13 += v * b10;
    t14 += v * b11;
    t15 += v * b12;
    t16 += v * b13;
    t17 += v * b14;
    t18 += v * b15;
    v = a[4];
    t4 += v * b0;
    t5 += v * b1;
    t6 += v * b2;
    t7 += v * b3;
    t8 += v * b4;
    t9 += v * b5;
    t10 += v * b6;
    t11 += v * b7;
    t12 += v * b8;
    t13 += v * b9;
    t14 += v * b10;
    t15 += v * b11;
    t16 += v * b12;
    t17 += v * b13;
    t18 += v * b14;
    t19 += v * b15;
    v = a[5];
    t5 += v * b0;
    t6 += v * b1;
    t7 += v * b2;
    t8 += v * b3;
    t9 += v * b4;
    t10 += v * b5;
    t11 += v * b6;
    t12 += v * b7;
    t13 += v * b8;
    t14 += v * b9;
    t15 += v * b10;
    t16 += v * b11;
    t17 += v * b12;
    t18 += v * b13;
    t19 += v * b14;
    t20 += v * b15;
    v = a[6];
    t6 += v * b0;
    t7 += v * b1;
    t8 += v * b2;
    t9 += v * b3;
    t10 += v * b4;
    t11 += v * b5;
    t12 += v * b6;
    t13 += v * b7;
    t14 += v * b8;
    t15 += v * b9;
    t16 += v * b10;
    t17 += v * b11;
    t18 += v * b12;
    t19 += v * b13;
    t20 += v * b14;
    t21 += v * b15;
    v = a[7];
    t7 += v * b0;
    t8 += v * b1;
    t9 += v * b2;
    t10 += v * b3;
    t11 += v * b4;
    t12 += v * b5;
    t13 += v * b6;
    t14 += v * b7;
    t15 += v * b8;
    t16 += v * b9;
    t17 += v * b10;
    t18 += v * b11;
    t19 += v * b12;
    t20 += v * b13;
    t21 += v * b14;
    t22 += v * b15;
    v = a[8];
    t8 += v * b0;
    t9 += v * b1;
    t10 += v * b2;
    t11 += v * b3;
    t12 += v * b4;
    t13 += v * b5;
    t14 += v * b6;
    t15 += v * b7;
    t16 += v * b8;
    t17 += v * b9;
    t18 += v * b10;
    t19 += v * b11;
    t20 += v * b12;
    t21 += v * b13;
    t22 += v * b14;
    t23 += v * b15;
    v = a[9];
    t9 += v * b0;
    t10 += v * b1;
    t11 += v * b2;
    t12 += v * b3;
    t13 += v * b4;
    t14 += v * b5;
    t15 += v * b6;
    t16 += v * b7;
    t17 += v * b8;
    t18 += v * b9;
    t19 += v * b10;
    t20 += v * b11;
    t21 += v * b12;
    t22 += v * b13;
    t23 += v * b14;
    t24 += v * b15;
    v = a[10];
    t10 += v * b0;
    t11 += v * b1;
    t12 += v * b2;
    t13 += v * b3;
    t14 += v * b4;
    t15 += v * b5;
    t16 += v * b6;
    t17 += v * b7;
    t18 += v * b8;
    t19 += v * b9;
    t20 += v * b10;
    t21 += v * b11;
    t22 += v * b12;
    t23 += v * b13;
    t24 += v * b14;
    t25 += v * b15;
    v = a[11];
    t11 += v * b0;
    t12 += v * b1;
    t13 += v * b2;
    t14 += v * b3;
    t15 += v * b4;
    t16 += v * b5;
    t17 += v * b6;
    t18 += v * b7;
    t19 += v * b8;
    t20 += v * b9;
    t21 += v * b10;
    t22 += v * b11;
    t23 += v * b12;
    t24 += v * b13;
    t25 += v * b14;
    t26 += v * b15;
    v = a[12];
    t12 += v * b0;
    t13 += v * b1;
    t14 += v * b2;
    t15 += v * b3;
    t16 += v * b4;
    t17 += v * b5;
    t18 += v * b6;
    t19 += v * b7;
    t20 += v * b8;
    t21 += v * b9;
    t22 += v * b10;
    t23 += v * b11;
    t24 += v * b12;
    t25 += v * b13;
    t26 += v * b14;
    t27 += v * b15;
    v = a[13];
    t13 += v * b0;
    t14 += v * b1;
    t15 += v * b2;
    t16 += v * b3;
    t17 += v * b4;
    t18 += v * b5;
    t19 += v * b6;
    t20 += v * b7;
    t21 += v * b8;
    t22 += v * b9;
    t23 += v * b10;
    t24 += v * b11;
    t25 += v * b12;
    t26 += v * b13;
    t27 += v * b14;
    t28 += v * b15;
    v = a[14];
    t14 += v * b0;
    t15 += v * b1;
    t16 += v * b2;
    t17 += v * b3;
    t18 += v * b4;
    t19 += v * b5;
    t20 += v * b6;
    t21 += v * b7;
    t22 += v * b8;
    t23 += v * b9;
    t24 += v * b10;
    t25 += v * b11;
    t26 += v * b12;
    t27 += v * b13;
    t28 += v * b14;
    t29 += v * b15;
    v = a[15];
    t15 += v * b0;
    t16 += v * b1;
    t17 += v * b2;
    t18 += v * b3;
    t19 += v * b4;
    t20 += v * b5;
    t21 += v * b6;
    t22 += v * b7;
    t23 += v * b8;
    t24 += v * b9;
    t25 += v * b10;
    t26 += v * b11;
    t27 += v * b12;
    t28 += v * b13;
    t29 += v * b14;
    t30 += v * b15;
    t0 += 38 * t16;
    t1 += 38 * t17;
    t2 += 38 * t18;
    t3 += 38 * t19;
    t4 += 38 * t20;
    t5 += 38 * t21;
    t6 += 38 * t22;
    t7 += 38 * t23;
    t8 += 38 * t24;
    t9 += 38 * t25;
    t10 += 38 * t26;
    t11 += 38 * t27;
    t12 += 38 * t28;
    t13 += 38 * t29;
    t14 += 38 * t30;
    // t15 left as is
    // first car
    c = 1;
    v = t0 + c + 65535;
    c = Math.floor(v / 65536);
    t0 = v - c * 65536;
    v = t1 + c + 65535;
    c = Math.floor(v / 65536);
    t1 = v - c * 65536;
    v = t2 + c + 65535;
    c = Math.floor(v / 65536);
    t2 = v - c * 65536;
    v = t3 + c + 65535;
    c = Math.floor(v / 65536);
    t3 = v - c * 65536;
    v = t4 + c + 65535;
    c = Math.floor(v / 65536);
    t4 = v - c * 65536;
    v = t5 + c + 65535;
    c = Math.floor(v / 65536);
    t5 = v - c * 65536;
    v = t6 + c + 65535;
    c = Math.floor(v / 65536);
    t6 = v - c * 65536;
    v = t7 + c + 65535;
    c = Math.floor(v / 65536);
    t7 = v - c * 65536;
    v = t8 + c + 65535;
    c = Math.floor(v / 65536);
    t8 = v - c * 65536;
    v = t9 + c + 65535;
    c = Math.floor(v / 65536);
    t9 = v - c * 65536;
    v = t10 + c + 65535;
    c = Math.floor(v / 65536);
    t10 = v - c * 65536;
    v = t11 + c + 65535;
    c = Math.floor(v / 65536);
    t11 = v - c * 65536;
    v = t12 + c + 65535;
    c = Math.floor(v / 65536);
    t12 = v - c * 65536;
    v = t13 + c + 65535;
    c = Math.floor(v / 65536);
    t13 = v - c * 65536;
    v = t14 + c + 65535;
    c = Math.floor(v / 65536);
    t14 = v - c * 65536;
    v = t15 + c + 65535;
    c = Math.floor(v / 65536);
    t15 = v - c * 65536;
    t0 += c - 1 + 37 * (c - 1);
    // second car
    c = 1;
    v = t0 + c + 65535;
    c = Math.floor(v / 65536);
    t0 = v - c * 65536;
    v = t1 + c + 65535;
    c = Math.floor(v / 65536);
    t1 = v - c * 65536;
    v = t2 + c + 65535;
    c = Math.floor(v / 65536);
    t2 = v - c * 65536;
    v = t3 + c + 65535;
    c = Math.floor(v / 65536);
    t3 = v - c * 65536;
    v = t4 + c + 65535;
    c = Math.floor(v / 65536);
    t4 = v - c * 65536;
    v = t5 + c + 65535;
    c = Math.floor(v / 65536);
    t5 = v - c * 65536;
    v = t6 + c + 65535;
    c = Math.floor(v / 65536);
    t6 = v - c * 65536;
    v = t7 + c + 65535;
    c = Math.floor(v / 65536);
    t7 = v - c * 65536;
    v = t8 + c + 65535;
    c = Math.floor(v / 65536);
    t8 = v - c * 65536;
    v = t9 + c + 65535;
    c = Math.floor(v / 65536);
    t9 = v - c * 65536;
    v = t10 + c + 65535;
    c = Math.floor(v / 65536);
    t10 = v - c * 65536;
    v = t11 + c + 65535;
    c = Math.floor(v / 65536);
    t11 = v - c * 65536;
    v = t12 + c + 65535;
    c = Math.floor(v / 65536);
    t12 = v - c * 65536;
    v = t13 + c + 65535;
    c = Math.floor(v / 65536);
    t13 = v - c * 65536;
    v = t14 + c + 65535;
    c = Math.floor(v / 65536);
    t14 = v - c * 65536;
    v = t15 + c + 65535;
    c = Math.floor(v / 65536);
    t15 = v - c * 65536;
    t0 += c - 1 + 37 * (c - 1);
    o[0] = t0;
    o[1] = t1;
    o[2] = t2;
    o[3] = t3;
    o[4] = t4;
    o[5] = t5;
    o[6] = t6;
    o[7] = t7;
    o[8] = t8;
    o[9] = t9;
    o[10] = t10;
    o[11] = t11;
    o[12] = t12;
    o[13] = t13;
    o[14] = t14;
    o[15] = t15;
}
function S(o, a) {
    M(o, a, a);
}
function inv25519(o, i) {
    const c = gf();
    let a;
    for (a = 0; a < 16; a++)
        c[a] = i[a];
    for (a = 253; a >= 0; a--) {
        S(c, c);
        if (a !== 2 && a !== 4)
            M(c, c, i);
    }
    for (a = 0; a < 16; a++)
        o[a] = c[a];
}
function pow2523(o, i) {
    const c = gf();
    let a;
    for (a = 0; a < 16; a++)
        c[a] = i[a];
    for (a = 250; a >= 0; a--) {
        S(c, c);
        if (a !== 1)
            M(c, c, i);
    }
    for (a = 0; a < 16; a++)
        o[a] = c[a];
}
function crypto_scalarmult(q, n, p) {
    const z = new Uint8Array(32);
    const x = new Float64Array(80);
    let r;
    let i;
    const a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
    for (i = 0; i < 31; i++)
        z[i] = n[i];
    z[31] = (n[31] & 127) | 64;
    z[0] &= 248;
    unpack25519(x, p);
    for (i = 0; i < 16; i++) {
        b[i] = x[i];
        d[i] = a[i] = c[i] = 0;
    }
    a[0] = d[0] = 1;
    for (i = 254; i >= 0; --i) {
        r = (z[i >>> 3] >>> (i & 7)) & 1;
        sel25519(a, b, r);
        sel25519(c, d, r);
        A(e, a, c);
        Z(a, a, c);
        A(c, b, d);
        Z(b, b, d);
        S(d, e);
        S(f, a);
        M(a, c, a);
        M(c, b, e);
        A(e, a, c);
        Z(a, a, c);
        S(b, a);
        Z(c, d, f);
        M(a, c, _121665);
        A(a, a, d);
        M(c, c, a);
        M(a, d, f);
        M(d, b, x);
        S(b, e);
        sel25519(a, b, r);
        sel25519(c, d, r);
    }
    for (i = 0; i < 16; i++) {
        x[i + 16] = a[i];
        x[i + 32] = c[i];
        x[i + 48] = b[i];
        x[i + 64] = d[i];
    }
    const x32 = x.subarray(32);
    const x16 = x.subarray(16);
    inv25519(x32, x32);
    M(x16, x16, x32);
    pack25519(q, x16);
    return 0;
}
function crypto_scalarmult_base(q, n) {
    return crypto_scalarmult(q, n, _9);
}
// prettier-ignore
const K = [
    0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
    0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
    0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
    0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
    0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
    0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
    0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
    0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
    0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
    0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
    0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
    0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
    0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
    0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
    0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
    0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
    0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
    0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
    0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
    0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
    0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
    0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
    0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
    0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
    0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
    0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
    0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
    0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
    0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
    0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
    0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
    0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
    0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
    0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
    0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
    0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
    0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
    0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
    0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
    0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];
function crypto_hashblocks_hl(hh, hl, m, n) {
    const wh = new Int32Array(16), wl = new Int32Array(16);
    let bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
    let ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
    let pos = 0;
    while (n >= 128) {
        for (i = 0; i < 16; i++) {
            j = 8 * i + pos;
            wh[i] = (m[j + 0] << 24) | (m[j + 1] << 16) | (m[j + 2] << 8) | m[j + 3];
            wl[i] = (m[j + 4] << 24) | (m[j + 5] << 16) | (m[j + 6] << 8) | m[j + 7];
        }
        for (i = 0; i < 80; i++) {
            bh0 = ah0;
            bh1 = ah1;
            bh2 = ah2;
            bh3 = ah3;
            bh4 = ah4;
            bh5 = ah5;
            bh6 = ah6;
            bh7 = ah7;
            bl0 = al0;
            bl1 = al1;
            bl2 = al2;
            bl3 = al3;
            bl4 = al4;
            bl5 = al5;
            bl6 = al6;
            bl7 = al7;
            // add
            h = ah7;
            l = al7;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            // Sigma1
            h =
                ((ah4 >>> 14) | (al4 << (32 - 14))) ^
                    ((ah4 >>> 18) | (al4 << (32 - 18))) ^
                    ((al4 >>> (41 - 32)) | (ah4 << (32 - (41 - 32))));
            l =
                ((al4 >>> 14) | (ah4 << (32 - 14))) ^
                    ((al4 >>> 18) | (ah4 << (32 - 18))) ^
                    ((ah4 >>> (41 - 32)) | (al4 << (32 - (41 - 32))));
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            // Ch
            h = (ah4 & ah5) ^ (~ah4 & ah6);
            l = (al4 & al5) ^ (~al4 & al6);
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            // K
            h = K[i * 2];
            l = K[i * 2 + 1];
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            // w
            h = wh[i % 16];
            l = wl[i % 16];
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            th = (c & 0xffff) | (d << 16);
            tl = (a & 0xffff) | (b << 16);
            // add
            h = th;
            l = tl;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            // Sigma0
            h =
                ((ah0 >>> 28) | (al0 << (32 - 28))) ^
                    ((al0 >>> (34 - 32)) | (ah0 << (32 - (34 - 32)))) ^
                    ((al0 >>> (39 - 32)) | (ah0 << (32 - (39 - 32))));
            l =
                ((al0 >>> 28) | (ah0 << (32 - 28))) ^
                    ((ah0 >>> (34 - 32)) | (al0 << (32 - (34 - 32)))) ^
                    ((ah0 >>> (39 - 32)) | (al0 << (32 - (39 - 32))));
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            // Maj
            h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
            l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh7 = (c & 0xffff) | (d << 16);
            bl7 = (a & 0xffff) | (b << 16);
            // add
            h = bh3;
            l = bl3;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            h = th;
            l = tl;
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh3 = (c & 0xffff) | (d << 16);
            bl3 = (a & 0xffff) | (b << 16);
            ah1 = bh0;
            ah2 = bh1;
            ah3 = bh2;
            ah4 = bh3;
            ah5 = bh4;
            ah6 = bh5;
            ah7 = bh6;
            ah0 = bh7;
            al1 = bl0;
            al2 = bl1;
            al3 = bl2;
            al4 = bl3;
            al5 = bl4;
            al6 = bl5;
            al7 = bl6;
            al0 = bl7;
            if (i % 16 === 15) {
                for (j = 0; j < 16; j++) {
                    // add
                    h = wh[j];
                    l = wl[j];
                    a = l & 0xffff;
                    b = l >>> 16;
                    c = h & 0xffff;
                    d = h >>> 16;
                    h = wh[(j + 9) % 16];
                    l = wl[(j + 9) % 16];
                    a += l & 0xffff;
                    b += l >>> 16;
                    c += h & 0xffff;
                    d += h >>> 16;
                    // sigma0
                    th = wh[(j + 1) % 16];
                    tl = wl[(j + 1) % 16];
                    h =
                        ((th >>> 1) | (tl << (32 - 1))) ^
                            ((th >>> 8) | (tl << (32 - 8))) ^
                            (th >>> 7);
                    l =
                        ((tl >>> 1) | (th << (32 - 1))) ^
                            ((tl >>> 8) | (th << (32 - 8))) ^
                            ((tl >>> 7) | (th << (32 - 7)));
                    a += l & 0xffff;
                    b += l >>> 16;
                    c += h & 0xffff;
                    d += h >>> 16;
                    // sigma1
                    th = wh[(j + 14) % 16];
                    tl = wl[(j + 14) % 16];
                    h =
                        ((th >>> 19) | (tl << (32 - 19))) ^
                            ((tl >>> (61 - 32)) | (th << (32 - (61 - 32)))) ^
                            (th >>> 6);
                    l =
                        ((tl >>> 19) | (th << (32 - 19))) ^
                            ((th >>> (61 - 32)) | (tl << (32 - (61 - 32)))) ^
                            ((tl >>> 6) | (th << (32 - 6)));
                    a += l & 0xffff;
                    b += l >>> 16;
                    c += h & 0xffff;
                    d += h >>> 16;
                    b += a >>> 16;
                    c += b >>> 16;
                    d += c >>> 16;
                    wh[j] = (c & 0xffff) | (d << 16);
                    wl[j] = (a & 0xffff) | (b << 16);
                }
            }
        }
        // add
        h = ah0;
        l = al0;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[0];
        l = hl[0];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[0] = ah0 = (c & 0xffff) | (d << 16);
        hl[0] = al0 = (a & 0xffff) | (b << 16);
        h = ah1;
        l = al1;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[1];
        l = hl[1];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[1] = ah1 = (c & 0xffff) | (d << 16);
        hl[1] = al1 = (a & 0xffff) | (b << 16);
        h = ah2;
        l = al2;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[2];
        l = hl[2];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[2] = ah2 = (c & 0xffff) | (d << 16);
        hl[2] = al2 = (a & 0xffff) | (b << 16);
        h = ah3;
        l = al3;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[3];
        l = hl[3];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[3] = ah3 = (c & 0xffff) | (d << 16);
        hl[3] = al3 = (a & 0xffff) | (b << 16);
        h = ah4;
        l = al4;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[4];
        l = hl[4];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[4] = ah4 = (c & 0xffff) | (d << 16);
        hl[4] = al4 = (a & 0xffff) | (b << 16);
        h = ah5;
        l = al5;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[5];
        l = hl[5];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[5] = ah5 = (c & 0xffff) | (d << 16);
        hl[5] = al5 = (a & 0xffff) | (b << 16);
        h = ah6;
        l = al6;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[6];
        l = hl[6];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[6] = ah6 = (c & 0xffff) | (d << 16);
        hl[6] = al6 = (a & 0xffff) | (b << 16);
        h = ah7;
        l = al7;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[7];
        l = hl[7];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[7] = ah7 = (c & 0xffff) | (d << 16);
        hl[7] = al7 = (a & 0xffff) | (b << 16);
        pos += 128;
        n -= 128;
    }
    return n;
}
function crypto_hash(out, m, n) {
    const hh = new Int32Array(8);
    const hl = new Int32Array(8);
    const x = new Uint8Array(256);
    const b = n;
    hh[0] = 0x6a09e667;
    hh[1] = 0xbb67ae85;
    hh[2] = 0x3c6ef372;
    hh[3] = 0xa54ff53a;
    hh[4] = 0x510e527f;
    hh[5] = 0x9b05688c;
    hh[6] = 0x1f83d9ab;
    hh[7] = 0x5be0cd19;
    hl[0] = 0xf3bcc908;
    hl[1] = 0x84caa73b;
    hl[2] = 0xfe94f82b;
    hl[3] = 0x5f1d36f1;
    hl[4] = 0xade682d1;
    hl[5] = 0x2b3e6c1f;
    hl[6] = 0xfb41bd6b;
    hl[7] = 0x137e2179;
    crypto_hashblocks_hl(hh, hl, m, n);
    n %= 128;
    for (let i = 0; i < n; i++)
        x[i] = m[b - n + i];
    x[n] = 128;
    n = 256 - 128 * (n < 112 ? 1 : 0);
    x[n - 9] = 0;
    ts64(x, n - 8, (b / 0x20000000) | 0, b << 3);
    crypto_hashblocks_hl(hh, hl, x, n);
    for (let i = 0; i < 8; i++)
        ts64(out, 8 * i, hh[i], hl[i]);
    return 0;
}
/**
 * Incremental version of crypto_hash.
 */
class HashState {
    constructor() {
        this.hh = new Int32Array(8);
        this.hl = new Int32Array(8);
        this.next = new Uint8Array(128);
        this.p = 0;
        this.total = 0;
        this.hh[0] = 0x6a09e667;
        this.hh[1] = 0xbb67ae85;
        this.hh[2] = 0x3c6ef372;
        this.hh[3] = 0xa54ff53a;
        this.hh[4] = 0x510e527f;
        this.hh[5] = 0x9b05688c;
        this.hh[6] = 0x1f83d9ab;
        this.hh[7] = 0x5be0cd19;
        this.hl[0] = 0xf3bcc908;
        this.hl[1] = 0x84caa73b;
        this.hl[2] = 0xfe94f82b;
        this.hl[3] = 0x5f1d36f1;
        this.hl[4] = 0xade682d1;
        this.hl[5] = 0x2b3e6c1f;
        this.hl[6] = 0xfb41bd6b;
        this.hl[7] = 0x137e2179;
    }
    update(data) {
        this.total += data.length;
        let i = 0;
        while (i < data.length) {
            const r = 128 - this.p;
            if (r > data.length - i) {
                for (let j = 0; i + j < data.length; j++) {
                    this.next[this.p + j] = data[i + j];
                }
                this.p += data.length - i;
                break;
            }
            else {
                for (let j = 0; this.p + j < 128; j++) {
                    this.next[this.p + j] = data[i + j];
                }
                crypto_hashblocks_hl(this.hh, this.hl, this.next, 128);
                i += 128 - this.p;
                this.p = 0;
            }
        }
        return this;
    }
    finish() {
        const out = new Uint8Array(64);
        let n = this.p;
        const x = new Uint8Array(256);
        const b = this.total;
        for (let i = 0; i < n; i++)
            x[i] = this.next[i];
        x[n] = 128;
        n = 256 - 128 * (n < 112 ? 1 : 0);
        x[n - 9] = 0;
        ts64(x, n - 8, (b / 0x20000000) | 0, b << 3);
        crypto_hashblocks_hl(this.hh, this.hl, x, n);
        for (let i = 0; i < 8; i++)
            ts64(out, 8 * i, this.hh[i], this.hl[i]);
        return out;
    }
}
function add$1(p, q) {
    const a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
    Z(a, p[1], p[0]);
    Z(t, q[1], q[0]);
    M(a, a, t);
    A(b, p[0], p[1]);
    A(t, q[0], q[1]);
    M(b, b, t);
    M(c, p[3], q[3]);
    M(c, c, D2);
    M(d, p[2], q[2]);
    A(d, d, d);
    Z(e, b, a);
    Z(f, d, c);
    A(g, d, c);
    A(h, b, a);
    M(p[0], e, f);
    M(p[1], h, g);
    M(p[2], g, f);
    M(p[3], e, h);
}
function cswap(p, q, b) {
    let i;
    for (i = 0; i < 4; i++) {
        sel25519(p[i], q[i], b);
    }
}
function pack(r, p) {
    const tx = gf(), ty = gf(), zi = gf();
    inv25519(zi, p[2]);
    M(tx, p[0], zi);
    M(ty, p[1], zi);
    pack25519(r, ty);
    r[31] ^= par25519(tx) << 7;
}
function scalarmult(p, q, s) {
    let b, i;
    set25519(p[0], gf0);
    set25519(p[1], gf1);
    set25519(p[2], gf1);
    set25519(p[3], gf0);
    for (i = 255; i >= 0; --i) {
        b = (s[(i / 8) | 0] >> (i & 7)) & 1;
        cswap(p, q, b);
        add$1(q, p);
        add$1(p, p);
        cswap(p, q, b);
    }
}
function scalarbase(p, s) {
    const q = [gf(), gf(), gf(), gf()];
    set25519(q[0], X);
    set25519(q[1], Y);
    set25519(q[2], gf1);
    M(q[3], X, Y);
    scalarmult(p, q, s);
}
function crypto_sign_keypair(pk, sk, seeded) {
    const d = new Uint8Array(64);
    const p = [gf(), gf(), gf(), gf()];
    if (!seeded)
        randombytes(sk, 32);
    crypto_hash(d, sk, 32);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    scalarbase(p, d);
    pack(pk, p);
    for (let i = 0; i < 32; i++)
        sk[i + 32] = pk[i];
    return 0;
}
const L = new Float64Array([
    0xed,
    0xd3,
    0xf5,
    0x5c,
    0x1a,
    0x63,
    0x12,
    0x58,
    0xd6,
    0x9c,
    0xf7,
    0xa2,
    0xde,
    0xf9,
    0xde,
    0x14,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0x10,
]);
function modL(r, x) {
    let carry, i, j, k;
    for (i = 63; i >= 32; --i) {
        carry = 0;
        for (j = i - 32, k = i - 12; j < k; ++j) {
            x[j] += carry - 16 * x[i] * L[j - (i - 32)];
            carry = (x[j] + 128) >> 8;
            x[j] -= carry * 256;
        }
        x[j] += carry;
        x[i] = 0;
    }
    carry = 0;
    for (j = 0; j < 32; j++) {
        x[j] += carry - (x[31] >> 4) * L[j];
        carry = x[j] >> 8;
        x[j] &= 255;
    }
    for (j = 0; j < 32; j++)
        x[j] -= carry * L[j];
    for (i = 0; i < 32; i++) {
        x[i + 1] += x[i] >> 8;
        r[i] = x[i] & 255;
    }
}
function reduce(r) {
    const x = new Float64Array(64);
    for (let i = 0; i < 64; i++)
        x[i] = r[i];
    for (let i = 0; i < 64; i++)
        r[i] = 0;
    modL(r, x);
}
// Note: difference from C - smlen returned, not passed as argument.
function crypto_sign(sm, m, n, sk) {
    const d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
    let i, j;
    const x = new Float64Array(64);
    const p = [gf(), gf(), gf(), gf()];
    crypto_hash(d, sk, 32);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    const smlen = n + 64;
    for (i = 0; i < n; i++)
        sm[64 + i] = m[i];
    for (i = 0; i < 32; i++)
        sm[32 + i] = d[32 + i];
    crypto_hash(r, sm.subarray(32), n + 32);
    reduce(r);
    scalarbase(p, r);
    pack(sm, p);
    for (i = 32; i < 64; i++)
        sm[i] = sk[i];
    crypto_hash(h, sm, n + 64);
    reduce(h);
    for (i = 0; i < 64; i++)
        x[i] = 0;
    for (i = 0; i < 32; i++)
        x[i] = r[i];
    for (i = 0; i < 32; i++) {
        for (j = 0; j < 32; j++) {
            x[i + j] += h[i] * d[j];
        }
    }
    modL(sm.subarray(32), x);
    return smlen;
}
function unpackneg(r, p) {
    const t = gf();
    const chk = gf();
    const num = gf();
    const den = gf();
    const den2 = gf();
    const den4 = gf();
    const den6 = gf();
    set25519(r[2], gf1);
    unpack25519(r[1], p);
    S(num, r[1]);
    M(den, num, D);
    Z(num, num, r[2]);
    A(den, r[2], den);
    S(den2, den);
    S(den4, den2);
    M(den6, den4, den2);
    M(t, den6, num);
    M(t, t, den);
    pow2523(t, t);
    M(t, t, num);
    M(t, t, den);
    M(t, t, den);
    M(r[0], t, den);
    S(chk, r[0]);
    M(chk, chk, den);
    if (neq25519(chk, num))
        M(r[0], r[0], I);
    S(chk, r[0]);
    M(chk, chk, den);
    if (neq25519(chk, num))
        return -1;
    if (par25519(r[0]) === p[31] >> 7)
        Z(r[0], gf0, r[0]);
    M(r[3], r[0], r[1]);
    return 0;
}
function crypto_sign_open(m, sm, n, pk) {
    let i, mlen;
    const t = new Uint8Array(32), h = new Uint8Array(64);
    const p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
    mlen = -1;
    if (n < 64)
        return -1;
    if (unpackneg(q, pk))
        return -1;
    for (i = 0; i < n; i++)
        m[i] = sm[i];
    for (i = 0; i < 32; i++)
        m[i + 32] = pk[i];
    crypto_hash(h, m, n);
    reduce(h);
    scalarmult(p, q, h);
    scalarbase(q, sm.subarray(32));
    add$1(p, q);
    pack(t, p);
    n -= 64;
    if (crypto_verify_32(sm, 0, t, 0)) {
        for (i = 0; i < n; i++)
            m[i] = 0;
        return -1;
    }
    for (i = 0; i < n; i++)
        m[i] = sm[i + 64];
    mlen = n;
    return mlen;
}
const crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
/* High-level API */
function checkArrayTypes(...args) {
    for (let i = 0; i < args.length; i++) {
        if (!(args[i] instanceof Uint8Array))
            throw new TypeError("unexpected type, use Uint8Array");
    }
}
function cleanup(arr) {
    for (let i = 0; i < arr.length; i++)
        arr[i] = 0;
}
function randomBytes(n) {
    const b = new Uint8Array(n);
    randombytes(b, n);
    return b;
}
function scalarMult(n, p) {
    checkArrayTypes(n, p);
    if (n.length !== crypto_scalarmult_SCALARBYTES)
        throw new Error("bad n size");
    if (p.length !== crypto_scalarmult_BYTES)
        throw new Error("bad p size");
    const q = new Uint8Array(crypto_scalarmult_BYTES);
    crypto_scalarmult(q, n, p);
    return q;
}
function scalarMult_base(n) {
    checkArrayTypes(n);
    if (n.length !== crypto_scalarmult_SCALARBYTES)
        throw new Error("bad n size");
    const q = new Uint8Array(crypto_scalarmult_BYTES);
    crypto_scalarmult_base(q, n);
    return q;
}
function sign(msg, secretKey) {
    checkArrayTypes(msg, secretKey);
    if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
        throw new Error("bad secret key size");
    const signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
    crypto_sign(signedMsg, msg, msg.length, secretKey);
    return signedMsg;
}
function sign_detached(msg, secretKey) {
    const signedMsg = sign(msg, secretKey);
    const sig = new Uint8Array(crypto_sign_BYTES);
    for (let i = 0; i < sig.length; i++)
        sig[i] = signedMsg[i];
    return sig;
}
function sign_detached_verify(msg, sig, publicKey) {
    checkArrayTypes(msg, sig, publicKey);
    if (sig.length !== crypto_sign_BYTES)
        throw new Error("bad signature size");
    if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
        throw new Error("bad public key size");
    const sm = new Uint8Array(crypto_sign_BYTES + msg.length);
    const m = new Uint8Array(crypto_sign_BYTES + msg.length);
    let i;
    for (i = 0; i < crypto_sign_BYTES; i++)
        sm[i] = sig[i];
    for (i = 0; i < msg.length; i++)
        sm[i + crypto_sign_BYTES] = msg[i];
    return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
}
function sign_keyPair_fromSeed(seed) {
    checkArrayTypes(seed);
    if (seed.length !== crypto_sign_SEEDBYTES)
        throw new Error("bad seed size");
    const pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
    const sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
    for (let i = 0; i < 32; i++)
        sk[i] = seed[i];
    crypto_sign_keypair(pk, sk, true);
    return { publicKey: pk, secretKey: sk };
}
function hash(msg) {
    checkArrayTypes(msg);
    const h = new Uint8Array(crypto_hash_BYTES);
    crypto_hash(h, msg, msg.length);
    return h;
}
function setPRNG(fn) {
    randombytes = fn;
}
function sign_ed25519_pk_to_curve25519(ed25519_pk) {
    const ge_a = [gf(), gf(), gf(), gf()];
    const x = gf();
    const one_minus_y = gf();
    const x25519_pk = new Uint8Array(32);
    if (unpackneg(ge_a, ed25519_pk)) {
        throw Error("invalid public key");
    }
    set25519(one_minus_y, gf1);
    Z(one_minus_y, one_minus_y, ge_a[1]);
    set25519(x, gf1);
    A(x, x, ge_a[1]);
    inv25519(one_minus_y, one_minus_y);
    M(x, x, one_minus_y);
    pack25519(x25519_pk, x);
    return x25519_pk;
}
(function () {
    // Initialize PRNG if environment provides CSPRNG.
    // If not, methods calling randombytes will throw.
    // @ts-ignore-error
    const cr = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
    if (cr && cr.getRandomValues) {
        // Browsers.
        const QUOTA = 65536;
        setPRNG(function (x, n) {
            let i;
            const v = new Uint8Array(n);
            for (i = 0; i < n; i += QUOTA) {
                cr.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
            }
            for (i = 0; i < n; i++)
                x[i] = v[i];
            cleanup(v);
        });
    }
    else if (typeof require !== "undefined") {
        // Node.js.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const cr = require("crypto");
        if (cr && cr.randomBytes) {
            setPRNG(function (x, n) {
                const v = cr.randomBytes(n);
                for (let i = 0; i < n; i++)
                    x[i] = v[i];
                cleanup(v);
            });
        }
    }
})();

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var BigInteger = createCommonjsModule(function (module) {
var bigInt = (function (undefined$1) {

    var BASE = 1e7,
        LOG_BASE = 7,
        MAX_INT = 9007199254740992,
        MAX_INT_ARR = smallToArray(MAX_INT),
        DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

    var supportsNativeBigInt = typeof BigInt === "function";

    function Integer(v, radix, alphabet, caseSensitive) {
        if (typeof v === "undefined") return Integer[0];
        if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
        return parseValue(v);
    }

    function BigInteger(value, sign) {
        this.value = value;
        this.sign = sign;
        this.isSmall = false;
    }
    BigInteger.prototype = Object.create(Integer.prototype);

    function SmallInteger(value) {
        this.value = value;
        this.sign = value < 0;
        this.isSmall = true;
    }
    SmallInteger.prototype = Object.create(Integer.prototype);

    function NativeBigInt(value) {
        this.value = value;
    }
    NativeBigInt.prototype = Object.create(Integer.prototype);

    function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
    }

    function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
        if (n < 1e7)
            return [n];
        if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
    }

    function arrayToSmall(arr) { // If BASE changes this function may need to change
        trim(arr);
        var length = arr.length;
        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length) {
                case 0: return 0;
                case 1: return arr[0];
                case 2: return arr[0] + arr[1] * BASE;
                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
        }
        return arr;
    }

    function trim(v) {
        var i = v.length;
        while (v[--i] === 0);
        v.length = i + 1;
    }

    function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
        var x = new Array(length);
        var i = -1;
        while (++i < length) {
            x[i] = 0;
        }
        return x;
    }

    function truncate(n) {
        if (n > 0) return Math.floor(n);
        return Math.ceil(n);
    }

    function add(a, b) { // assumes a and b are arrays with a.length >= b.length
        var l_a = a.length,
            l_b = b.length,
            r = new Array(l_a),
            carry = 0,
            base = BASE,
            sum, i;
        for (i = 0; i < l_b; i++) {
            sum = a[i] + b[i] + carry;
            carry = sum >= base ? 1 : 0;
            r[i] = sum - carry * base;
        }
        while (i < l_a) {
            sum = a[i] + carry;
            carry = sum === base ? 1 : 0;
            r[i++] = sum - carry * base;
        }
        if (carry > 0) r.push(carry);
        return r;
    }

    function addAny(a, b) {
        if (a.length >= b.length) return add(a, b);
        return add(b, a);
    }

    function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
        var l = a.length,
            r = new Array(l),
            base = BASE,
            sum, i;
        for (i = 0; i < l; i++) {
            sum = a[i] - base + carry;
            carry = Math.floor(sum / base);
            r[i] = sum - carry * base;
            carry += 1;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    BigInteger.prototype.add = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.subtract(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall) {
            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
        }
        return new BigInteger(addAny(a, b), this.sign);
    };
    BigInteger.prototype.plus = BigInteger.prototype.add;

    SmallInteger.prototype.add = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.subtract(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            if (isPrecise(a + b)) return new SmallInteger(a + b);
            b = smallToArray(Math.abs(b));
        }
        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
    };
    SmallInteger.prototype.plus = SmallInteger.prototype.add;

    NativeBigInt.prototype.add = function (v) {
        return new NativeBigInt(this.value + parseValue(v).value);
    };
    NativeBigInt.prototype.plus = NativeBigInt.prototype.add;

    function subtract(a, b) { // assumes a and b are arrays with a >= b
        var a_l = a.length,
            b_l = b.length,
            r = new Array(a_l),
            borrow = 0,
            base = BASE,
            i, difference;
        for (i = 0; i < b_l; i++) {
            difference = a[i] - borrow - b[i];
            if (difference < 0) {
                difference += base;
                borrow = 1;
            } else borrow = 0;
            r[i] = difference;
        }
        for (i = b_l; i < a_l; i++) {
            difference = a[i] - borrow;
            if (difference < 0) difference += base;
            else {
                r[i++] = difference;
                break;
            }
            r[i] = difference;
        }
        for (; i < a_l; i++) {
            r[i] = a[i];
        }
        trim(r);
        return r;
    }

    function subtractAny(a, b, sign) {
        var value;
        if (compareAbs(a, b) >= 0) {
            value = subtract(a, b);
        } else {
            value = subtract(b, a);
            sign = !sign;
        }
        value = arrayToSmall(value);
        if (typeof value === "number") {
            if (sign) value = -value;
            return new SmallInteger(value);
        }
        return new BigInteger(value, sign);
    }

    function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
        var l = a.length,
            r = new Array(l),
            carry = -b,
            base = BASE,
            i, difference;
        for (i = 0; i < l; i++) {
            difference = a[i] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            r[i] = difference < 0 ? difference + base : difference;
        }
        r = arrayToSmall(r);
        if (typeof r === "number") {
            if (sign) r = -r;
            return new SmallInteger(r);
        } return new BigInteger(r, sign);
    }

    BigInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.add(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall)
            return subtractSmall(a, Math.abs(b), this.sign);
        return subtractAny(a, b, this.sign);
    };
    BigInteger.prototype.minus = BigInteger.prototype.subtract;

    SmallInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.add(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            return new SmallInteger(a - b);
        }
        return subtractSmall(b, Math.abs(a), a >= 0);
    };
    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

    NativeBigInt.prototype.subtract = function (v) {
        return new NativeBigInt(this.value - parseValue(v).value);
    };
    NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;

    BigInteger.prototype.negate = function () {
        return new BigInteger(this.value, !this.sign);
    };
    SmallInteger.prototype.negate = function () {
        var sign = this.sign;
        var small = new SmallInteger(-this.value);
        small.sign = !sign;
        return small;
    };
    NativeBigInt.prototype.negate = function () {
        return new NativeBigInt(-this.value);
    };

    BigInteger.prototype.abs = function () {
        return new BigInteger(this.value, false);
    };
    SmallInteger.prototype.abs = function () {
        return new SmallInteger(Math.abs(this.value));
    };
    NativeBigInt.prototype.abs = function () {
        return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
    };


    function multiplyLong(a, b) {
        var a_l = a.length,
            b_l = b.length,
            l = a_l + b_l,
            r = createArray(l),
            base = BASE,
            product, carry, i, a_i, b_j;
        for (i = 0; i < a_l; ++i) {
            a_i = a[i];
            for (var j = 0; j < b_l; ++j) {
                b_j = b[j];
                product = a_i * b_j + r[i + j];
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
                r[i + j + 1] += carry;
            }
        }
        trim(r);
        return r;
    }

    function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
        var l = a.length,
            r = new Array(l),
            base = BASE,
            carry = 0,
            product, i;
        for (i = 0; i < l; i++) {
            product = a[i] * b + carry;
            carry = Math.floor(product / base);
            r[i] = product - carry * base;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    function shiftLeft(x, n) {
        var r = [];
        while (n-- > 0) r.push(0);
        return r.concat(x);
    }

    function multiplyKaratsuba(x, y) {
        var n = Math.max(x.length, y.length);

        if (n <= 30) return multiplyLong(x, y);
        n = Math.ceil(n / 2);

        var b = x.slice(n),
            a = x.slice(0, n),
            d = y.slice(n),
            c = y.slice(0, n);

        var ac = multiplyKaratsuba(a, c),
            bd = multiplyKaratsuba(b, d),
            abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim(product);
        return product;
    }

    // The following function is derived from a surface fit of a graph plotting the performance difference
    // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
    function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
    }

    BigInteger.prototype.multiply = function (v) {
        var n = parseValue(v),
            a = this.value, b = n.value,
            sign = this.sign !== n.sign,
            abs;
        if (n.isSmall) {
            if (b === 0) return Integer[0];
            if (b === 1) return this;
            if (b === -1) return this.negate();
            abs = Math.abs(b);
            if (abs < BASE) {
                return new BigInteger(multiplySmall(a, abs), sign);
            }
            b = smallToArray(abs);
        }
        if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
            return new BigInteger(multiplyKaratsuba(a, b), sign);
        return new BigInteger(multiplyLong(a, b), sign);
    };

    BigInteger.prototype.times = BigInteger.prototype.multiply;

    function multiplySmallAndArray(a, b, sign) { // a >= 0
        if (a < BASE) {
            return new BigInteger(multiplySmall(b, a), sign);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
    }
    SmallInteger.prototype._multiplyBySmall = function (a) {
        if (isPrecise(a.value * this.value)) {
            return new SmallInteger(a.value * this.value);
        }
        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
    };
    BigInteger.prototype._multiplyBySmall = function (a) {
        if (a.value === 0) return Integer[0];
        if (a.value === 1) return this;
        if (a.value === -1) return this.negate();
        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
    };
    SmallInteger.prototype.multiply = function (v) {
        return parseValue(v)._multiplyBySmall(this);
    };
    SmallInteger.prototype.times = SmallInteger.prototype.multiply;

    NativeBigInt.prototype.multiply = function (v) {
        return new NativeBigInt(this.value * parseValue(v).value);
    };
    NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;

    function square(a) {
        //console.assert(2 * BASE * BASE < MAX_INT);
        var l = a.length,
            r = createArray(l + l),
            base = BASE,
            product, carry, i, a_i, a_j;
        for (i = 0; i < l; i++) {
            a_i = a[i];
            carry = 0 - a_i * a_i;
            for (var j = i; j < l; j++) {
                a_j = a[j];
                product = 2 * (a_i * a_j) + r[i + j] + carry;
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
            }
            r[i + l] = carry;
        }
        trim(r);
        return r;
    }

    BigInteger.prototype.square = function () {
        return new BigInteger(square(this.value), false);
    };

    SmallInteger.prototype.square = function () {
        var value = this.value * this.value;
        if (isPrecise(value)) return new SmallInteger(value);
        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
    };

    NativeBigInt.prototype.square = function (v) {
        return new NativeBigInt(this.value * this.value);
    };

    function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
        var a_l = a.length,
            b_l = b.length,
            base = BASE,
            result = createArray(b.length),
            divisorMostSignificantDigit = b[b_l - 1],
            // normalization
            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
            remainder = multiplySmall(a, lambda),
            divisor = multiplySmall(b, lambda),
            quotientDigit, shift, carry, borrow, i, l, q;
        if (remainder.length <= a_l) remainder.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base - 1;
            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
                quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            // quotientDigit <= base - 1
            carry = 0;
            borrow = 0;
            l = divisor.length;
            for (i = 0; i < l; i++) {
                carry += quotientDigit * divisor[i];
                q = Math.floor(carry / base);
                borrow += remainder[shift + i] - (carry - q * base);
                carry = q;
                if (borrow < 0) {
                    remainder[shift + i] = borrow + base;
                    borrow = -1;
                } else {
                    remainder[shift + i] = borrow;
                    borrow = 0;
                }
            }
            while (borrow !== 0) {
                quotientDigit -= 1;
                carry = 0;
                for (i = 0; i < l; i++) {
                    carry += remainder[shift + i] - base + divisor[i];
                    if (carry < 0) {
                        remainder[shift + i] = carry + base;
                        carry = 0;
                    } else {
                        remainder[shift + i] = carry;
                        carry = 1;
                    }
                }
                borrow += carry;
            }
            result[shift] = quotientDigit;
        }
        // denormalization
        remainder = divModSmall(remainder, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder)];
    }

    function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
        // Performs faster than divMod1 on larger input sizes.
        var a_l = a.length,
            b_l = b.length,
            result = [],
            part = [],
            base = BASE,
            guess, xlen, highx, highy, check;
        while (a_l) {
            part.unshift(a[--a_l]);
            trim(part);
            if (compareAbs(part, b) < 0) {
                result.push(0);
                continue;
            }
            xlen = part.length;
            highx = part[xlen - 1] * base + part[xlen - 2];
            highy = b[b_l - 1] * base + b[b_l - 2];
            if (xlen > b_l) {
                highx = (highx + 1) * base;
            }
            guess = Math.ceil(highx / highy);
            do {
                check = multiplySmall(b, guess);
                if (compareAbs(check, part) <= 0) break;
                guess--;
            } while (guess);
            result.push(guess);
            part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
    }

    function divModSmall(value, lambda) {
        var length = value.length,
            quotient = createArray(length),
            base = BASE,
            i, q, remainder, divisor;
        remainder = 0;
        for (i = length - 1; i >= 0; --i) {
            divisor = remainder * base + value[i];
            q = truncate(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i] = q | 0;
        }
        return [quotient, remainder | 0];
    }

    function divModAny(self, v) {
        var value, n = parseValue(v);
        if (supportsNativeBigInt) {
            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
        }
        var a = self.value, b = n.value;
        var quotient;
        if (b === 0) throw new Error("Cannot divide by zero");
        if (self.isSmall) {
            if (n.isSmall) {
                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [Integer[0], self];
        }
        if (n.isSmall) {
            if (b === 1) return [self, Integer[0]];
            if (b == -1) return [self.negate(), Integer[0]];
            var abs = Math.abs(b);
            if (abs < BASE) {
                value = divModSmall(a, abs);
                quotient = arrayToSmall(value[0]);
                var remainder = value[1];
                if (self.sign) remainder = -remainder;
                if (typeof quotient === "number") {
                    if (self.sign !== n.sign) quotient = -quotient;
                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
                }
                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs);
        }
        var comparison = compareAbs(a, b);
        if (comparison === -1) return [Integer[0], self];
        if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

        // divMod1 is faster on smaller input sizes
        if (a.length + b.length <= 200)
            value = divMod1(a, b);
        else value = divMod2(a, b);

        quotient = value[0];
        var qSign = self.sign !== n.sign,
            mod = value[1],
            mSign = self.sign;
        if (typeof quotient === "number") {
            if (qSign) quotient = -quotient;
            quotient = new SmallInteger(quotient);
        } else quotient = new BigInteger(quotient, qSign);
        if (typeof mod === "number") {
            if (mSign) mod = -mod;
            mod = new SmallInteger(mod);
        } else mod = new BigInteger(mod, mSign);
        return [quotient, mod];
    }

    BigInteger.prototype.divmod = function (v) {
        var result = divModAny(this, v);
        return {
            quotient: result[0],
            remainder: result[1]
        };
    };
    NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;


    BigInteger.prototype.divide = function (v) {
        return divModAny(this, v)[0];
    };
    NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function (v) {
        return new NativeBigInt(this.value / parseValue(v).value);
    };
    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

    BigInteger.prototype.mod = function (v) {
        return divModAny(this, v)[1];
    };
    NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function (v) {
        return new NativeBigInt(this.value % parseValue(v).value);
    };
    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

    BigInteger.prototype.pow = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value,
            value, x, y;
        if (b === 0) return Integer[1];
        if (a === 0) return Integer[0];
        if (a === 1) return Integer[1];
        if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.sign) {
            return Integer[0];
        }
        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
        if (this.isSmall) {
            if (isPrecise(value = Math.pow(a, b)))
                return new SmallInteger(truncate(value));
        }
        x = this;
        y = Integer[1];
        while (true) {
            if (b & 1 === 1) {
                y = y.times(x);
                --b;
            }
            if (b === 0) break;
            b /= 2;
            x = x.square();
        }
        return y;
    };
    SmallInteger.prototype.pow = BigInteger.prototype.pow;

    NativeBigInt.prototype.pow = function (v) {
        var n = parseValue(v);
        var a = this.value, b = n.value;
        var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
        if (b === _0) return Integer[1];
        if (a === _0) return Integer[0];
        if (a === _1) return Integer[1];
        if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.isNegative()) return new NativeBigInt(_0);
        var x = this;
        var y = Integer[1];
        while (true) {
            if ((b & _1) === _1) {
                y = y.times(x);
                --b;
            }
            if (b === _0) break;
            b /= _2;
            x = x.square();
        }
        return y;
    };

    BigInteger.prototype.modPow = function (exp, mod) {
        exp = parseValue(exp);
        mod = parseValue(mod);
        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
        var r = Integer[1],
            base = this.mod(mod);
        if (exp.isNegative()) {
            exp = exp.multiply(Integer[-1]);
            base = base.modInv(mod);
        }
        while (exp.isPositive()) {
            if (base.isZero()) return Integer[0];
            if (exp.isOdd()) r = r.multiply(base).mod(mod);
            exp = exp.divide(2);
            base = base.square().mod(mod);
        }
        return r;
    };
    NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

    function compareAbs(a, b) {
        if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
        }
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    }

    BigInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) return 1;
        return compareAbs(a, b);
    };
    SmallInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = Math.abs(this.value),
            b = n.value;
        if (n.isSmall) {
            b = Math.abs(b);
            return a === b ? 0 : a > b ? 1 : -1;
        }
        return -1;
    };
    NativeBigInt.prototype.compareAbs = function (v) {
        var a = this.value;
        var b = parseValue(v).value;
        a = a >= 0 ? a : -a;
        b = b >= 0 ? b : -b;
        return a === b ? 0 : a > b ? 1 : -1;
    };

    BigInteger.prototype.compare = function (v) {
        // See discussion about comparison with Infinity:
        // https://github.com/peterolson/BigInteger.js/issues/61
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (this.sign !== n.sign) {
            return n.sign ? 1 : -1;
        }
        if (n.isSmall) {
            return this.sign ? -1 : 1;
        }
        return compareAbs(a, b) * (this.sign ? -1 : 1);
    };
    BigInteger.prototype.compareTo = BigInteger.prototype.compare;

    SmallInteger.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) {
            return a == b ? 0 : a > b ? 1 : -1;
        }
        if (a < 0 !== n.sign) {
            return a < 0 ? -1 : 1;
        }
        return a < 0 ? 1 : -1;
    };
    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

    NativeBigInt.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }
        var a = this.value;
        var b = parseValue(v).value;
        return a === b ? 0 : a > b ? 1 : -1;
    };
    NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;

    BigInteger.prototype.equals = function (v) {
        return this.compare(v) === 0;
    };
    NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

    BigInteger.prototype.notEquals = function (v) {
        return this.compare(v) !== 0;
    };
    NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

    BigInteger.prototype.greater = function (v) {
        return this.compare(v) > 0;
    };
    NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

    BigInteger.prototype.lesser = function (v) {
        return this.compare(v) < 0;
    };
    NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

    BigInteger.prototype.greaterOrEquals = function (v) {
        return this.compare(v) >= 0;
    };
    NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

    BigInteger.prototype.lesserOrEquals = function (v) {
        return this.compare(v) <= 0;
    };
    NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

    BigInteger.prototype.isEven = function () {
        return (this.value[0] & 1) === 0;
    };
    SmallInteger.prototype.isEven = function () {
        return (this.value & 1) === 0;
    };
    NativeBigInt.prototype.isEven = function () {
        return (this.value & BigInt(1)) === BigInt(0);
    };

    BigInteger.prototype.isOdd = function () {
        return (this.value[0] & 1) === 1;
    };
    SmallInteger.prototype.isOdd = function () {
        return (this.value & 1) === 1;
    };
    NativeBigInt.prototype.isOdd = function () {
        return (this.value & BigInt(1)) === BigInt(1);
    };

    BigInteger.prototype.isPositive = function () {
        return !this.sign;
    };
    SmallInteger.prototype.isPositive = function () {
        return this.value > 0;
    };
    NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;

    BigInteger.prototype.isNegative = function () {
        return this.sign;
    };
    SmallInteger.prototype.isNegative = function () {
        return this.value < 0;
    };
    NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;

    BigInteger.prototype.isUnit = function () {
        return false;
    };
    SmallInteger.prototype.isUnit = function () {
        return Math.abs(this.value) === 1;
    };
    NativeBigInt.prototype.isUnit = function () {
        return this.abs().value === BigInt(1);
    };

    BigInteger.prototype.isZero = function () {
        return false;
    };
    SmallInteger.prototype.isZero = function () {
        return this.value === 0;
    };
    NativeBigInt.prototype.isZero = function () {
        return this.value === BigInt(0);
    };

    BigInteger.prototype.isDivisibleBy = function (v) {
        var n = parseValue(v);
        if (n.isZero()) return false;
        if (n.isUnit()) return true;
        if (n.compareAbs(2) === 0) return this.isEven();
        return this.mod(n).isZero();
    };
    NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

    function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit()) return false;
        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
        if (n.lesser(49)) return true;
        // we don't know if it's prime: let the other functions figure it out
    }

    function millerRabinTest(n, a) {
        var nPrev = n.prev(),
            b = nPrev,
            r = 0,
            d, i, x;
        while (b.isEven()) b = b.divide(2), r++;
        next: for (i = 0; i < a.length; i++) {
            if (n.lesser(a[i])) continue;
            x = bigInt(a[i]).modPow(b, n);
            if (x.isUnit() || x.equals(nPrev)) continue;
            for (d = r - 1; d != 0; d--) {
                x = x.square().mod(n);
                if (x.isUnit()) return false;
                if (x.equals(nPrev)) continue next;
            }
            return false;
        }
        return true;
    }

    // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
    BigInteger.prototype.isPrime = function (strict) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined$1) return isPrime;
        var n = this.abs();
        var bits = n.bitLength();
        if (bits <= 64)
            return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
        var logN = Math.log(2) * bits.toJSNumber();
        var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt(i + 2));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

    BigInteger.prototype.isProbablePrime = function (iterations, rng) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined$1) return isPrime;
        var n = this.abs();
        var t = iterations === undefined$1 ? 5 : iterations;
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt.randBetween(2, n.minus(2), rng));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

    BigInteger.prototype.modInv = function (n) {
        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.isZero()) {
            q = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q.multiply(newT));
            newR = lastR.subtract(q.multiply(newR));
        }
        if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t.compare(0) === -1) {
            t = t.add(n);
        }
        if (this.isNegative()) {
            return t.negate();
        }
        return t;
    };

    NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

    BigInteger.prototype.next = function () {
        var value = this.value;
        if (this.sign) {
            return subtractSmall(value, 1, this.sign);
        }
        return new BigInteger(addSmall(value, 1), this.sign);
    };
    SmallInteger.prototype.next = function () {
        var value = this.value;
        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
        return new BigInteger(MAX_INT_ARR, false);
    };
    NativeBigInt.prototype.next = function () {
        return new NativeBigInt(this.value + BigInt(1));
    };

    BigInteger.prototype.prev = function () {
        var value = this.value;
        if (this.sign) {
            return new BigInteger(addSmall(value, 1), true);
        }
        return subtractSmall(value, 1, this.sign);
    };
    SmallInteger.prototype.prev = function () {
        var value = this.value;
        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
        return new BigInteger(MAX_INT_ARR, true);
    };
    NativeBigInt.prototype.prev = function () {
        return new NativeBigInt(this.value - BigInt(1));
    };

    var powersOfTwo = [1];
    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

    function shift_isSmall(n) {
        return Math.abs(n) <= BASE;
    }

    BigInteger.prototype.shiftLeft = function (v) {
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftRight(-n);
        var result = this;
        if (result.isZero()) return result;
        while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
    };
    NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

    BigInteger.prototype.shiftRight = function (v) {
        var remQuo;
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
            if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
    };
    NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

    function bitwise(x, y, fn) {
        y = parseValue(y);
        var xSign = x.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x.not() : x,
            yRem = ySign ? y.not() : y;
        var xDigit = 0, yDigit = 0;
        var xDivMod = null, yDivMod = null;
        var result = [];
        while (!xRem.isZero() || !yRem.isZero()) {
            xDivMod = divModAny(xRem, highestPower2);
            xDigit = xDivMod[1].toJSNumber();
            if (xSign) {
                xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
            }

            yDivMod = divModAny(yRem, highestPower2);
            yDigit = yDivMod[1].toJSNumber();
            if (ySign) {
                yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
            }

            xRem = xDivMod[0];
            yRem = yDivMod[0];
            result.push(fn(xDigit, yDigit));
        }
        var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
        for (var i = result.length - 1; i >= 0; i -= 1) {
            sum = sum.multiply(highestPower2).add(bigInt(result[i]));
        }
        return sum;
    }

    BigInteger.prototype.not = function () {
        return this.negate().prev();
    };
    NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;

    BigInteger.prototype.and = function (n) {
        return bitwise(this, n, function (a, b) { return a & b; });
    };
    NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;

    BigInteger.prototype.or = function (n) {
        return bitwise(this, n, function (a, b) { return a | b; });
    };
    NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;

    BigInteger.prototype.xor = function (n) {
        return bitwise(this, n, function (a, b) { return a ^ b; });
    };
    NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;

    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
    function roughLOB(n) { // get lowestOneBit (rough)
        // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
        // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
        var v = n.value,
            x = typeof v === "number" ? v | LOBMASK_I :
                typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
                    v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
    }

    function integerLogarithm(value, base) {
        if (base.compareTo(value) <= 0) {
            var tmp = integerLogarithm(value, base.square(base));
            var p = tmp.p;
            var e = tmp.e;
            var t = p.multiply(base);
            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
        }
        return { p: bigInt(1), e: 0 };
    }

    BigInteger.prototype.bitLength = function () {
        var n = this;
        if (n.compareTo(bigInt(0)) < 0) {
            n = n.negate().subtract(bigInt(1));
        }
        if (n.compareTo(bigInt(0)) === 0) {
            return bigInt(0);
        }
        return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
    };
    NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

    function max(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
    }
    function min(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
    }
    function gcd(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b)) return a;
        if (a.isZero()) return b;
        if (b.isZero()) return a;
        var c = Integer[1], d, t;
        while (a.isEven() && b.isEven()) {
            d = min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
        }
        while (a.isEven()) {
            a = a.divide(roughLOB(a));
        }
        do {
            while (b.isEven()) {
                b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
                t = b; b = a; a = t;
            }
            b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
    }
    function lcm(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
    }
    function randBetween(a, b, rng) {
        a = parseValue(a);
        b = parseValue(b);
        var usedRNG = rng || Math.random;
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low).add(1);
        if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
        var digits = toBase(range, BASE).value;
        var result = [], restricted = true;
        for (var i = 0; i < digits.length; i++) {
            var top = restricted ? digits[i] : BASE;
            var digit = truncate(usedRNG() * top);
            result.push(digit);
            if (digit < top) restricted = false;
        }
        return low.add(Integer.fromArray(result, BASE, false));
    }

    var parseBase = function (text, base, alphabet, caseSensitive) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        text = String(text);
        if (!caseSensitive) {
            text = text.toLowerCase();
            alphabet = alphabet.toLowerCase();
        }
        var length = text.length;
        var i;
        var absBase = Math.abs(base);
        var alphabetValues = {};
        for (i = 0; i < alphabet.length; i++) {
            alphabetValues[alphabet[i]] = i;
        }
        for (i = 0; i < length; i++) {
            var c = text[i];
            if (c === "-") continue;
            if (c in alphabetValues) {
                if (alphabetValues[c] >= absBase) {
                    if (c === "1" && absBase === 1) continue;
                    throw new Error(c + " is not a valid digit in base " + base + ".");
                }
            }
        }
        base = parseValue(base);
        var digits = [];
        var isNegative = text[0] === "-";
        for (i = isNegative ? 1 : 0; i < text.length; i++) {
            var c = text[i];
            if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
            else if (c === "<") {
                var start = i;
                do { i++; } while (text[i] !== ">" && i < text.length);
                digits.push(parseValue(text.slice(start + 1, i)));
            }
            else throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
    };

    function parseBaseFromArray(digits, base, isNegative) {
        var val = Integer[0], pow = Integer[1], i;
        for (i = digits.length - 1; i >= 0; i--) {
            val = val.add(digits[i].times(pow));
            pow = pow.times(base);
        }
        return isNegative ? val.negate() : val;
    }

    function stringify(digit, alphabet) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        if (digit < alphabet.length) {
            return alphabet[digit];
        }
        return "<" + digit + ">";
    }

    function toBase(n, base) {
        base = bigInt(base);
        if (base.isZero()) {
            if (n.isZero()) return { value: [0], isNegative: false };
            throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
            if (n.isZero()) return { value: [0], isNegative: false };
            if (n.isNegative())
                return {
                    value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
                        .map(Array.prototype.valueOf, [1, 0])
                    ),
                    isNegative: false
                };

            var arr = Array.apply(null, Array(n.toJSNumber() - 1))
                .map(Array.prototype.valueOf, [0, 1]);
            arr.unshift([1]);
            return {
                value: [].concat.apply([], arr),
                isNegative: false
            };
        }

        var neg = false;
        if (n.isNegative() && base.isPositive()) {
            neg = true;
            n = n.abs();
        }
        if (base.isUnit()) {
            if (n.isZero()) return { value: [0], isNegative: false };

            return {
                value: Array.apply(null, Array(n.toJSNumber()))
                    .map(Number.prototype.valueOf, 1),
                isNegative: neg
            };
        }
        var out = [];
        var left = n, divmod;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
            divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
                digit = base.minus(digit).abs();
                left = left.next();
            }
            out.push(digit.toJSNumber());
        }
        out.push(left.toJSNumber());
        return { value: out.reverse(), isNegative: neg };
    }

    function toBaseString(n, base, alphabet) {
        var arr = toBase(n, base);
        return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
            return stringify(x, alphabet);
        }).join('');
    }

    BigInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    SmallInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    NativeBigInt.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    BigInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined$1) radix = 10;
        if (radix !== 10) return toBaseString(this, radix, alphabet);
        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
        while (--l >= 0) {
            digit = String(v[l]);
            str += zeros.slice(digit.length) + digit;
        }
        var sign = this.sign ? "-" : "";
        return sign + str;
    };

    SmallInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined$1) radix = 10;
        if (radix != 10) return toBaseString(this, radix, alphabet);
        return String(this.value);
    };

    NativeBigInt.prototype.toString = SmallInteger.prototype.toString;

    NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); };

    BigInteger.prototype.valueOf = function () {
        return parseInt(this.toString(), 10);
    };
    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

    SmallInteger.prototype.valueOf = function () {
        return this.value;
    };
    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
    NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function () {
        return parseInt(this.toString(), 10);
    };

    function parseStringValue(v) {
        if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
                return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
            throw new Error("Invalid integer: " + v);
        }
        var sign = v[0] === "-";
        if (sign) v = v.slice(1);
        var split = v.split(/e/i);
        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
            var exp = split[1];
            if (exp[0] === "+") exp = exp.slice(1);
            exp = +exp;
            if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            var text = split[0];
            var decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
                exp -= text.length - decimalPlace - 1;
                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
            text += (new Array(exp + 1)).join("0");
            v = text;
        }
        var isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid) throw new Error("Invalid integer: " + v);
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(sign ? "-" + v : v));
        }
        var r = [], max = v.length, l = LOG_BASE, min = max - l;
        while (max > 0) {
            r.push(+v.slice(min, max));
            min -= l;
            if (min < 0) min = 0;
            max -= l;
        }
        trim(r);
        return new BigInteger(r, sign);
    }

    function parseNumberValue(v) {
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(v));
        }
        if (isPrecise(v)) {
            if (v !== truncate(v)) throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
    }

    function parseValue(v) {
        if (typeof v === "number") {
            return parseNumberValue(v);
        }
        if (typeof v === "string") {
            return parseStringValue(v);
        }
        if (typeof v === "bigint") {
            return new NativeBigInt(v);
        }
        return v;
    }
    // Pre-define numbers in range [-999,999]
    for (var i = 0; i < 1000; i++) {
        Integer[i] = parseValue(i);
        if (i > 0) Integer[-i] = parseValue(-i);
    }
    // Backwards compatibility
    Integer.one = Integer[1];
    Integer.zero = Integer[0];
    Integer.minusOne = Integer[-1];
    Integer.max = max;
    Integer.min = min;
    Integer.gcd = gcd;
    Integer.lcm = lcm;
    Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt; };
    Integer.randBetween = randBetween;

    Integer.fromArray = function (digits, base, isNegative) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
    };

    return Integer;
})();

// Node.js check
if ( module.hasOwnProperty("exports")) {
    module.exports = bigInt;
}
});

// SHA-256 for JavaScript.
//
// Written in 2014-2016 by Dmitry Chestnykh.
// Public domain, no warranty.
//
// Functions (accept and return Uint8Arrays):
//
//   sha256(message) -> hash
//   sha256.hmac(key, message) -> mac
//
//  Classes:
//
//   new sha256.Hash()
const digestLength = 32;
const blockSize = 64;
// SHA-256 constants
const K$1 = new Uint32Array([
    0x428a2f98,
    0x71374491,
    0xb5c0fbcf,
    0xe9b5dba5,
    0x3956c25b,
    0x59f111f1,
    0x923f82a4,
    0xab1c5ed5,
    0xd807aa98,
    0x12835b01,
    0x243185be,
    0x550c7dc3,
    0x72be5d74,
    0x80deb1fe,
    0x9bdc06a7,
    0xc19bf174,
    0xe49b69c1,
    0xefbe4786,
    0x0fc19dc6,
    0x240ca1cc,
    0x2de92c6f,
    0x4a7484aa,
    0x5cb0a9dc,
    0x76f988da,
    0x983e5152,
    0xa831c66d,
    0xb00327c8,
    0xbf597fc7,
    0xc6e00bf3,
    0xd5a79147,
    0x06ca6351,
    0x14292967,
    0x27b70a85,
    0x2e1b2138,
    0x4d2c6dfc,
    0x53380d13,
    0x650a7354,
    0x766a0abb,
    0x81c2c92e,
    0x92722c85,
    0xa2bfe8a1,
    0xa81a664b,
    0xc24b8b70,
    0xc76c51a3,
    0xd192e819,
    0xd6990624,
    0xf40e3585,
    0x106aa070,
    0x19a4c116,
    0x1e376c08,
    0x2748774c,
    0x34b0bcb5,
    0x391c0cb3,
    0x4ed8aa4a,
    0x5b9cca4f,
    0x682e6ff3,
    0x748f82ee,
    0x78a5636f,
    0x84c87814,
    0x8cc70208,
    0x90befffa,
    0xa4506ceb,
    0xbef9a3f7,
    0xc67178f2,
]);
function hashBlocks(w, v, p, pos, len) {
    let a, b, c, d, e, f, g, h, u, i, j, t1, t2;
    while (len >= 64) {
        a = v[0];
        b = v[1];
        c = v[2];
        d = v[3];
        e = v[4];
        f = v[5];
        g = v[6];
        h = v[7];
        for (i = 0; i < 16; i++) {
            j = pos + i * 4;
            w[i] =
                ((p[j] & 0xff) << 24) |
                    ((p[j + 1] & 0xff) << 16) |
                    ((p[j + 2] & 0xff) << 8) |
                    (p[j + 3] & 0xff);
        }
        for (i = 16; i < 64; i++) {
            u = w[i - 2];
            t1 =
                ((u >>> 17) | (u << (32 - 17))) ^
                    ((u >>> 19) | (u << (32 - 19))) ^
                    (u >>> 10);
            u = w[i - 15];
            t2 =
                ((u >>> 7) | (u << (32 - 7))) ^
                    ((u >>> 18) | (u << (32 - 18))) ^
                    (u >>> 3);
            w[i] = ((t1 + w[i - 7]) | 0) + ((t2 + w[i - 16]) | 0);
        }
        for (i = 0; i < 64; i++) {
            t1 =
                ((((((e >>> 6) | (e << (32 - 6))) ^
                    ((e >>> 11) | (e << (32 - 11))) ^
                    ((e >>> 25) | (e << (32 - 25)))) +
                    ((e & f) ^ (~e & g))) |
                    0) +
                    ((h + ((K$1[i] + w[i]) | 0)) | 0)) |
                    0;
            t2 =
                ((((a >>> 2) | (a << (32 - 2))) ^
                    ((a >>> 13) | (a << (32 - 13))) ^
                    ((a >>> 22) | (a << (32 - 22)))) +
                    ((a & b) ^ (a & c) ^ (b & c))) |
                    0;
            h = g;
            g = f;
            f = e;
            e = (d + t1) | 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) | 0;
        }
        v[0] += a;
        v[1] += b;
        v[2] += c;
        v[3] += d;
        v[4] += e;
        v[5] += f;
        v[6] += g;
        v[7] += h;
        pos += 64;
        len -= 64;
    }
    return pos;
}
// Hash implements SHA256 hash algorithm.
class HashSha256 {
    constructor() {
        this.digestLength = digestLength;
        this.blockSize = blockSize;
        // Note: Int32Array is used instead of Uint32Array for performance reasons.
        this.state = new Int32Array(8); // hash state
        this.temp = new Int32Array(64); // temporary state
        this.buffer = new Uint8Array(128); // buffer for data to hash
        this.bufferLength = 0; // number of bytes in buffer
        this.bytesHashed = 0; // number of total bytes hashed
        this.finished = false; // indicates whether the hash was finalized
        this.reset();
    }
    // Resets hash state making it possible
    // to re-use this instance to hash other data.
    reset() {
        this.state[0] = 0x6a09e667;
        this.state[1] = 0xbb67ae85;
        this.state[2] = 0x3c6ef372;
        this.state[3] = 0xa54ff53a;
        this.state[4] = 0x510e527f;
        this.state[5] = 0x9b05688c;
        this.state[6] = 0x1f83d9ab;
        this.state[7] = 0x5be0cd19;
        this.bufferLength = 0;
        this.bytesHashed = 0;
        this.finished = false;
        return this;
    }
    // Cleans internal buffers and re-initializes hash state.
    clean() {
        for (let i = 0; i < this.buffer.length; i++) {
            this.buffer[i] = 0;
        }
        for (let i = 0; i < this.temp.length; i++) {
            this.temp[i] = 0;
        }
        this.reset();
    }
    // Updates hash state with the given data.
    //
    // Optionally, length of the data can be specified to hash
    // fewer bytes than data.length.
    //
    // Throws error when trying to update already finalized hash:
    // instance must be reset to use it again.
    update(data, dataLength = data.length) {
        if (this.finished) {
            throw new Error("SHA256: can't update because hash was finished.");
        }
        let dataPos = 0;
        this.bytesHashed += dataLength;
        if (this.bufferLength > 0) {
            while (this.bufferLength < 64 && dataLength > 0) {
                this.buffer[this.bufferLength++] = data[dataPos++];
                dataLength--;
            }
            if (this.bufferLength === 64) {
                hashBlocks(this.temp, this.state, this.buffer, 0, 64);
                this.bufferLength = 0;
            }
        }
        if (dataLength >= 64) {
            dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
            dataLength %= 64;
        }
        while (dataLength > 0) {
            this.buffer[this.bufferLength++] = data[dataPos++];
            dataLength--;
        }
        return this;
    }
    // Finalizes hash state and puts hash into out.
    //
    // If hash was already finalized, puts the same value.
    finish(out) {
        if (!this.finished) {
            const bytesHashed = this.bytesHashed;
            const left = this.bufferLength;
            const bitLenHi = (bytesHashed / 0x20000000) | 0;
            const bitLenLo = bytesHashed << 3;
            const padLength = bytesHashed % 64 < 56 ? 64 : 128;
            this.buffer[left] = 0x80;
            for (let i = left + 1; i < padLength - 8; i++) {
                this.buffer[i] = 0;
            }
            this.buffer[padLength - 8] = (bitLenHi >>> 24) & 0xff;
            this.buffer[padLength - 7] = (bitLenHi >>> 16) & 0xff;
            this.buffer[padLength - 6] = (bitLenHi >>> 8) & 0xff;
            this.buffer[padLength - 5] = (bitLenHi >>> 0) & 0xff;
            this.buffer[padLength - 4] = (bitLenLo >>> 24) & 0xff;
            this.buffer[padLength - 3] = (bitLenLo >>> 16) & 0xff;
            this.buffer[padLength - 2] = (bitLenLo >>> 8) & 0xff;
            this.buffer[padLength - 1] = (bitLenLo >>> 0) & 0xff;
            hashBlocks(this.temp, this.state, this.buffer, 0, padLength);
            this.finished = true;
        }
        for (let i = 0; i < 8; i++) {
            out[i * 4 + 0] = (this.state[i] >>> 24) & 0xff;
            out[i * 4 + 1] = (this.state[i] >>> 16) & 0xff;
            out[i * 4 + 2] = (this.state[i] >>> 8) & 0xff;
            out[i * 4 + 3] = (this.state[i] >>> 0) & 0xff;
        }
        return this;
    }
    // Returns the final hash digest.
    digest() {
        const out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
    }
    // Internal function for use in HMAC for optimization.
    _saveState(out) {
        for (let i = 0; i < this.state.length; i++) {
            out[i] = this.state[i];
        }
    }
    // Internal function for use in HMAC for optimization.
    _restoreState(from, bytesHashed) {
        for (let i = 0; i < this.state.length; i++) {
            this.state[i] = from[i];
        }
        this.bytesHashed = bytesHashed;
        this.finished = false;
        this.bufferLength = 0;
    }
}
// Returns SHA256 hash of data.
function sha256(data) {
    const h = new HashSha256().update(data);
    const digest = h.digest();
    h.clean();
    return digest;
}

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
function sha512(data) {
    return hash(data);
}
function hmac(digest, blockSize, key, message) {
    if (key.byteLength > blockSize) {
        key = digest(key);
    }
    if (key.byteLength < blockSize) {
        const k = key;
        key = new Uint8Array(blockSize);
        key.set(k, 0);
    }
    const okp = new Uint8Array(blockSize);
    const ikp = new Uint8Array(blockSize);
    for (let i = 0; i < blockSize; i++) {
        ikp[i] = key[i] ^ 0x36;
        okp[i] = key[i] ^ 0x5c;
    }
    const b1 = new Uint8Array(blockSize + message.byteLength);
    b1.set(ikp, 0);
    b1.set(message, blockSize);
    const h0 = digest(b1);
    const b2 = new Uint8Array(blockSize + h0.length);
    b2.set(okp, 0);
    b2.set(h0, blockSize);
    return digest(b2);
}
function hmacSha512(key, message) {
    return hmac(sha512, 128, key, message);
}
function hmacSha256(key, message) {
    return hmac(sha256, 64, key, message);
}
function kdf(outputLength, ikm, salt, info) {
    // extract
    const prk = hmacSha512(salt, ikm);
    // expand
    const N = Math.ceil(outputLength / 32);
    const output = new Uint8Array(N * 32);
    for (let i = 0; i < N; i++) {
        let buf;
        if (i == 0) {
            buf = new Uint8Array(info.byteLength + 1);
            buf.set(info, 0);
        }
        else {
            buf = new Uint8Array(info.byteLength + 1 + 32);
            for (let j = 0; j < 32; j++) {
                buf[j] = output[(i - 1) * 32 + j];
            }
            buf.set(info, 32);
        }
        buf[buf.length - 1] = i + 1;
        const chunk = hmacSha256(prk, buf);
        output.set(chunk, i * 32);
    }
    return output.slice(0, outputLength);
}

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
// @ts-ignore
const decoder = new TextDecoder();
if (typeof decoder !== "object") {
    throw Error("FATAL: TextDecoder not available");
}
// @ts-ignore
const encoder = new TextEncoder();
if (typeof encoder !== "object") {
    throw Error("FATAL: TextEncoder not available");
}
function getRandomBytes(n) {
    return randomBytes(n);
}
const encTable = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
class EncodingError extends Error {
    constructor() {
        super("Encoding error");
        Object.setPrototypeOf(this, EncodingError.prototype);
    }
}
function getValue(chr) {
    let a = chr;
    switch (chr) {
        case "O":
        case "o":
            a = "0;";
            break;
        case "i":
        case "I":
        case "l":
        case "L":
            a = "1";
            break;
        case "u":
        case "U":
            a = "V";
    }
    if (a >= "0" && a <= "9") {
        return a.charCodeAt(0) - "0".charCodeAt(0);
    }
    if (a >= "a" && a <= "z")
        a = a.toUpperCase();
    let dec = 0;
    if (a >= "A" && a <= "Z") {
        if ("I" < a)
            dec++;
        if ("L" < a)
            dec++;
        if ("O" < a)
            dec++;
        if ("U" < a)
            dec++;
        return a.charCodeAt(0) - "A".charCodeAt(0) + 10 - dec;
    }
    throw new EncodingError();
}
function encodeCrock(data) {
    const dataBytes = new Uint8Array(data);
    let sb = "";
    const size = data.byteLength;
    let bitBuf = 0;
    let numBits = 0;
    let pos = 0;
    while (pos < size || numBits > 0) {
        if (pos < size && numBits < 5) {
            const d = dataBytes[pos++];
            bitBuf = (bitBuf << 8) | d;
            numBits += 8;
        }
        if (numBits < 5) {
            // zero-padding
            bitBuf = bitBuf << (5 - numBits);
            numBits = 5;
        }
        const v = (bitBuf >>> (numBits - 5)) & 31;
        sb += encTable[v];
        numBits -= 5;
    }
    return sb;
}
function decodeCrock(encoded) {
    const size = encoded.length;
    let bitpos = 0;
    let bitbuf = 0;
    let readPosition = 0;
    const outLen = Math.floor((size * 5) / 8);
    const out = new Uint8Array(outLen);
    let outPos = 0;
    while (readPosition < size || bitpos > 0) {
        if (readPosition < size) {
            const v = getValue(encoded[readPosition++]);
            bitbuf = (bitbuf << 5) | v;
            bitpos += 5;
        }
        while (bitpos >= 8) {
            const d = (bitbuf >>> (bitpos - 8)) & 0xff;
            out[outPos++] = d;
            bitpos -= 8;
        }
        if (readPosition == size && bitpos > 0) {
            bitbuf = (bitbuf << (8 - bitpos)) & 0xff;
            bitpos = bitbuf == 0 ? 0 : 8;
        }
    }
    return out;
}
function eddsaGetPublic(eddsaPriv) {
    const pair = sign_keyPair_fromSeed(eddsaPriv);
    return pair.publicKey;
}
function ecdheGetPublic(ecdhePriv) {
    return scalarMult_base(ecdhePriv);
}
function keyExchangeEcdheEddsa(ecdhePriv, eddsaPub) {
    const curve25519Pub = sign_ed25519_pk_to_curve25519(eddsaPub);
    const x = scalarMult(ecdhePriv, curve25519Pub);
    return hash(x);
}
/**
 * KDF modulo a big integer.
 */
function kdfMod(n, ikm, salt, info) {
    const nbits = n.bitLength().toJSNumber();
    const buflen = Math.floor((nbits - 1) / 8 + 1);
    const mask = (1 << (8 - (buflen * 8 - nbits))) - 1;
    let counter = 0;
    while (true) {
        const ctx = new Uint8Array(info.byteLength + 2);
        ctx.set(info, 0);
        ctx[ctx.length - 2] = (counter >>> 8) & 0xff;
        ctx[ctx.length - 1] = counter & 0xff;
        const buf = kdf(buflen, ikm, salt, ctx);
        const arr = Array.from(buf);
        arr[0] = arr[0] & mask;
        const r = BigInteger.fromArray(arr, 256, false);
        if (r.lt(n)) {
            return r;
        }
        counter++;
    }
}
function stringToBytes(s) {
    return encoder.encode(s);
}
function loadBigInt(arr) {
    return BigInteger.fromArray(Array.from(arr), 256, false);
}
function rsaBlindingKeyDerive(rsaPub, bks) {
    const salt = stringToBytes("Blinding KDF extrator HMAC key");
    const info = stringToBytes("Blinding KDF");
    return kdfMod(rsaPub.N, bks, salt, info);
}
/*
 * Test for malicious RSA key.
 *
 * Assuming n is an RSA modulous and r is generated using a call to
 * GNUNET_CRYPTO_kdf_mod_mpi, if gcd(r,n) != 1 then n must be a
 * malicious RSA key designed to deanomize the user.
 *
 * @param r KDF result
 * @param n RSA modulus of the public key
 */
function rsaGcdValidate(r, n) {
    const t = BigInteger.gcd(r, n);
    if (!t.equals(BigInteger.one)) {
        throw Error("malicious RSA public key");
    }
}
function rsaFullDomainHash(hm, rsaPub) {
    const info = stringToBytes("RSA-FDA FTpsW!");
    const salt = rsaPubEncode(rsaPub);
    const r = kdfMod(rsaPub.N, hm, salt, info);
    rsaGcdValidate(r, rsaPub.N);
    return r;
}
function rsaPubDecode(rsaPub) {
    const modulusLength = (rsaPub[0] << 8) | rsaPub[1];
    const exponentLength = (rsaPub[2] << 8) | rsaPub[3];
    if (4 + exponentLength + modulusLength != rsaPub.length) {
        throw Error("invalid RSA public key (format wrong)");
    }
    const modulus = rsaPub.slice(4, 4 + modulusLength);
    const exponent = rsaPub.slice(4 + modulusLength, 4 + modulusLength + exponentLength);
    const res = {
        N: loadBigInt(modulus),
        e: loadBigInt(exponent),
    };
    return res;
}
function rsaPubEncode(rsaPub) {
    const mb = rsaPub.N.toArray(256).value;
    const eb = rsaPub.e.toArray(256).value;
    const out = new Uint8Array(4 + mb.length + eb.length);
    out[0] = (mb.length >>> 8) & 0xff;
    out[1] = mb.length & 0xff;
    out[2] = (eb.length >>> 8) & 0xff;
    out[3] = eb.length & 0xff;
    out.set(mb, 4);
    out.set(eb, 4 + mb.length);
    return out;
}
function rsaBlind(hm, bks, rsaPubEnc) {
    const rsaPub = rsaPubDecode(rsaPubEnc);
    const data = rsaFullDomainHash(hm, rsaPub);
    const r = rsaBlindingKeyDerive(rsaPub, bks);
    const r_e = r.modPow(rsaPub.e, rsaPub.N);
    const bm = r_e.multiply(data).mod(rsaPub.N);
    return new Uint8Array(bm.toArray(256).value);
}
function rsaUnblind(sig, rsaPubEnc, bks) {
    const rsaPub = rsaPubDecode(rsaPubEnc);
    const blinded_s = loadBigInt(sig);
    const r = rsaBlindingKeyDerive(rsaPub, bks);
    const r_inv = r.modInv(rsaPub.N);
    const s = blinded_s.multiply(r_inv).mod(rsaPub.N);
    return new Uint8Array(s.toArray(256).value);
}
function rsaVerify(hm, rsaSig, rsaPubEnc) {
    const rsaPub = rsaPubDecode(rsaPubEnc);
    const d = rsaFullDomainHash(hm, rsaPub);
    const sig = loadBigInt(rsaSig);
    const sig_e = sig.modPow(rsaPub.e, rsaPub.N);
    return sig_e.equals(d);
}
function createEddsaKeyPair() {
    const eddsaPriv = randomBytes(32);
    const eddsaPub = eddsaGetPublic(eddsaPriv);
    return { eddsaPriv, eddsaPub };
}
function createEcdheKeyPair() {
    const ecdhePriv = randomBytes(32);
    const ecdhePub = ecdheGetPublic(ecdhePriv);
    return { ecdhePriv, ecdhePub };
}
function createBlindingKeySecret() {
    return randomBytes(32);
}
function hash$1(d) {
    return hash(d);
}
function eddsaSign(msg, eddsaPriv) {
    const pair = sign_keyPair_fromSeed(eddsaPriv);
    return sign_detached(msg, pair.secretKey);
}
function eddsaVerify(msg, sig, eddsaPub) {
    return sign_detached_verify(msg, sig, eddsaPub);
}
function createHashContext() {
    return new HashState();
}
function setupRefreshPlanchet(secretSeed, coinNumber) {
    const info = stringToBytes("taler-coin-derivation");
    const saltArrBuf = new ArrayBuffer(4);
    const salt = new Uint8Array(saltArrBuf);
    const saltDataView = new DataView(saltArrBuf);
    saltDataView.setUint32(0, coinNumber);
    const out = kdf(64, secretSeed, salt, info);
    const coinPriv = out.slice(0, 32);
    const bks = out.slice(32, 64);
    return {
        bks,
        coinPriv,
        coinPub: eddsaGetPublic(coinPriv),
    };
}

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
const codecForReserveWithdrawTransaction = () => makeCodecForObject()
    .property("amount", codecForString)
    .property("h_coin_envelope", codecForString)
    .property("h_denom_pub", codecForString)
    .property("reserve_sig", codecForString)
    .property("type", makeCodecForConstString("WITHDRAW" /* Withdraw */))
    .property("withdraw_fee", codecForString)
    .build("ReserveWithdrawTransaction");
const codecForReserveCreditTransaction = () => makeCodecForObject()
    .property("amount", codecForString)
    .property("sender_account_url", codecForString)
    .property("timestamp", codecForTimestamp)
    .property("wire_reference", codecForString)
    .property("type", makeCodecForConstString("CREDIT" /* Credit */))
    .build("ReserveCreditTransaction");
const codecForReserveClosingTransaction = () => makeCodecForObject()
    .property("amount", codecForString)
    .property("closing_fee", codecForString)
    .property("exchange_pub", codecForString)
    .property("exchange_sig", codecForString)
    .property("h_wire", codecForString)
    .property("timestamp", codecForTimestamp)
    .property("type", makeCodecForConstString("CLOSING" /* Closing */))
    .property("wtid", codecForString)
    .build("ReserveClosingTransaction");
const codecForReserveRecoupTransaction = () => makeCodecForObject()
    .property("amount", codecForString)
    .property("coin_pub", codecForString)
    .property("exchange_pub", codecForString)
    .property("exchange_sig", codecForString)
    .property("timestamp", codecForTimestamp)
    .property("type", makeCodecForConstString("RECOUP" /* Recoup */))
    .build("ReserveRecoupTransaction");
const codecForReserveTransaction = () => makeCodecForUnion()
    .discriminateOn("type")
    .alternative("WITHDRAW" /* Withdraw */, codecForReserveWithdrawTransaction())
    .alternative("CLOSING" /* Closing */, codecForReserveClosingTransaction())
    .alternative("RECOUP" /* Recoup */, codecForReserveRecoupTransaction())
    .alternative("CREDIT" /* Credit */, codecForReserveCreditTransaction())
    .build("ReserveTransaction");

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
const codecForReserveStatus = () => makeCodecForObject()
    .property("balance", codecForString)
    .property("history", makeCodecForList(codecForReserveTransaction()))
    .build("ReserveStatus");

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
 * Check if two reserve history items (exchange's version) match.
 */
function isRemoteHistoryMatch(t1, t2) {
    switch (t1.type) {
        case "CLOSING" /* Closing */: {
            return t1.type === t2.type && t1.wtid == t2.wtid;
        }
        case "CREDIT" /* Credit */: {
            return t1.type === t2.type && t1.wire_reference === t2.wire_reference;
        }
        case "RECOUP" /* Recoup */: {
            return (t1.type === t2.type &&
                t1.coin_pub === t2.coin_pub &&
                timestampCmp(t1.timestamp, t2.timestamp) === 0);
        }
        case "WITHDRAW" /* Withdraw */: {
            return t1.type === t2.type && t1.h_coin_envelope === t2.h_coin_envelope;
        }
    }
}
/**
 * Check a local reserve history item and a remote history item are a match.
 */
function isLocalRemoteHistoryMatch(t1, t2) {
    switch (t1.type) {
        case "credit" /* Credit */: {
            return (t2.type === "CREDIT" /* Credit */ &&
                !!t1.expectedAmount &&
                cmp(t1.expectedAmount, parseOrThrow(t2.amount)) === 0);
        }
        case "withdraw" /* Withdraw */:
            return (t2.type === "WITHDRAW" /* Withdraw */ &&
                !!t1.expectedAmount &&
                cmp(t1.expectedAmount, parseOrThrow(t2.amount)) === 0);
        case "recoup" /* Recoup */: {
            return (t2.type === "RECOUP" /* Recoup */ &&
                !!t1.expectedAmount &&
                cmp(t1.expectedAmount, parseOrThrow(t2.amount)) === 0);
        }
    }
    return false;
}
/**
 * Compute totals for the wallet's view of the reserve history.
 */
function summarizeReserveHistory(localHistory, currency) {
    const posAmounts = [];
    const negAmounts = [];
    const expectedPosAmounts = [];
    const expectedNegAmounts = [];
    const withdrawnAmounts = [];
    for (const item of localHistory) {
        switch (item.type) {
            case "credit" /* Credit */:
                if (item.matchedExchangeTransaction) {
                    posAmounts.push(parseOrThrow(item.matchedExchangeTransaction.amount));
                }
                else if (item.expectedAmount) {
                    expectedPosAmounts.push(item.expectedAmount);
                }
                break;
            case "recoup" /* Recoup */:
                if (item.matchedExchangeTransaction) {
                    if (item.matchedExchangeTransaction) {
                        posAmounts.push(parseOrThrow(item.matchedExchangeTransaction.amount));
                    }
                    else if (item.expectedAmount) {
                        expectedPosAmounts.push(item.expectedAmount);
                    }
                    else {
                        throw Error("invariant failed");
                    }
                }
                break;
            case "closing" /* Closing */:
                if (item.matchedExchangeTransaction) {
                    negAmounts.push(parseOrThrow(item.matchedExchangeTransaction.amount));
                }
                else {
                    throw Error("invariant failed");
                }
                break;
            case "withdraw" /* Withdraw */:
                if (item.matchedExchangeTransaction) {
                    negAmounts.push(parseOrThrow(item.matchedExchangeTransaction.amount));
                    withdrawnAmounts.push(parseOrThrow(item.matchedExchangeTransaction.amount));
                }
                else if (item.expectedAmount) {
                    expectedNegAmounts.push(item.expectedAmount);
                }
                else {
                    throw Error("invariant failed");
                }
                break;
        }
    }
    const z = getZero(currency);
    const computedBalance = sub(add(z, ...posAmounts).amount, ...negAmounts).amount;
    const unclaimedReserveAmount = sub(add(z, ...posAmounts).amount, ...negAmounts, ...expectedNegAmounts).amount;
    const awaitedReserveAmount = sub(add(z, ...expectedPosAmounts).amount, ...expectedNegAmounts).amount;
    const withdrawnAmount = add(z, ...withdrawnAmounts).amount;
    return {
        computedReserveBalance: computedBalance,
        unclaimedReserveAmount: unclaimedReserveAmount,
        awaitedReserveAmount: awaitedReserveAmount,
        withdrawnAmount,
    };
}
/**
 * Reconcile the wallet's local model of the reserve history
 * with the reserve history of the exchange.
 */
function reconcileReserveHistory(localHistory, remoteHistory) {
    const updatedLocalHistory = deepCopy(localHistory);
    const newMatchedItems = [];
    const newAddedItems = [];
    const remoteMatched = remoteHistory.map(() => false);
    const localMatched = localHistory.map(() => false);
    // Take care of deposits
    // First, see which pairs are already a definite match.
    for (let remoteIndex = 0; remoteIndex < remoteHistory.length; remoteIndex++) {
        const rhi = remoteHistory[remoteIndex];
        for (let localIndex = 0; localIndex < localHistory.length; localIndex++) {
            if (localMatched[localIndex]) {
                continue;
            }
            const lhi = localHistory[localIndex];
            if (!lhi.matchedExchangeTransaction) {
                continue;
            }
            if (isRemoteHistoryMatch(rhi, lhi.matchedExchangeTransaction)) {
                localMatched[localIndex] = true;
                remoteMatched[remoteIndex] = true;
                break;
            }
        }
    }
    // Check that all previously matched items are still matched
    for (let localIndex = 0; localIndex < localHistory.length; localIndex++) {
        if (localMatched[localIndex]) {
            continue;
        }
        const lhi = localHistory[localIndex];
        if (lhi.matchedExchangeTransaction) {
            // Don't use for further matching
            localMatched[localIndex] = true;
            // FIXME: emit some error here!
            throw Error("previously matched reserve history item now unmatched");
        }
    }
    // Next, find out if there are any exact new matches between local and remote
    // history items
    for (let localIndex = 0; localIndex < localHistory.length; localIndex++) {
        if (localMatched[localIndex]) {
            continue;
        }
        const lhi = localHistory[localIndex];
        for (let remoteIndex = 0; remoteIndex < remoteHistory.length; remoteIndex++) {
            const rhi = remoteHistory[remoteIndex];
            if (remoteMatched[remoteIndex]) {
                continue;
            }
            if (isLocalRemoteHistoryMatch(lhi, rhi)) {
                localMatched[localIndex] = true;
                remoteMatched[remoteIndex] = true;
                updatedLocalHistory[localIndex].matchedExchangeTransaction = rhi;
                newMatchedItems.push(lhi);
                break;
            }
        }
    }
    // Finally we add new history items
    for (let remoteIndex = 0; remoteIndex < remoteHistory.length; remoteIndex++) {
        if (remoteMatched[remoteIndex]) {
            continue;
        }
        const rhi = remoteHistory[remoteIndex];
        let newItem;
        switch (rhi.type) {
            case "CLOSING" /* Closing */: {
                newItem = {
                    type: "closing" /* Closing */,
                    matchedExchangeTransaction: rhi,
                };
                break;
            }
            case "CREDIT" /* Credit */: {
                newItem = {
                    type: "credit" /* Credit */,
                    matchedExchangeTransaction: rhi,
                };
                break;
            }
            case "RECOUP" /* Recoup */: {
                newItem = {
                    type: "recoup" /* Recoup */,
                    matchedExchangeTransaction: rhi,
                };
                break;
            }
            case "WITHDRAW" /* Withdraw */: {
                newItem = {
                    type: "withdraw" /* Withdraw */,
                    matchedExchangeTransaction: rhi,
                };
                break;
            }
        }
        updatedLocalHistory.push(newItem);
        newAddedItems.push(newItem);
    }
    return {
        updatedLocalHistory,
        newAddedItems,
        newMatchedItems,
    };
}

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
var HttpResponseStatus;
(function (HttpResponseStatus) {
    HttpResponseStatus[HttpResponseStatus["Ok"] = 200] = "Ok";
    HttpResponseStatus[HttpResponseStatus["Gone"] = 210] = "Gone";
})(HttpResponseStatus || (HttpResponseStatus = {}));
/**
 * Headers, roughly modeled after the fetch API's headers object.
 */
class Headers {
    constructor() {
        this.headerMap = new Map();
    }
    get(name) {
        const r = this.headerMap.get(name.toLowerCase());
        if (r) {
            return r;
        }
        return null;
    }
    set(name, value) {
        const normalizedName = name.toLowerCase();
        const existing = this.headerMap.get(normalizedName);
        if (existing !== undefined) {
            this.headerMap.set(normalizedName, existing + "," + value);
        }
        else {
            this.headerMap.set(normalizedName, value);
        }
    }
}
function readSuccessResponseJsonOrErrorCode(httpResponse, codec) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(httpResponse.status >= 200 && httpResponse.status < 300)) {
            const errJson = yield httpResponse.json();
            const talerErrorCode = errJson.code;
            if (typeof talerErrorCode !== "number") {
                throw new OperationFailedError(makeErrorDetails(TalerErrorCode.WALLET_RECEIVED_MALFORMED_RESPONSE, "Error response did not contain error code", {
                    requestUrl: httpResponse.requestUrl,
                    requestMethod: httpResponse.requestMethod,
                    httpStatusCode: httpResponse.status,
                }));
            }
            return {
                isError: true,
                talerErrorResponse: errJson,
            };
        }
        const respJson = yield httpResponse.json();
        let parsedResponse;
        try {
            parsedResponse = codec.decode(respJson);
        }
        catch (e) {
            throw OperationFailedError.fromCode(TalerErrorCode.WALLET_RECEIVED_MALFORMED_RESPONSE, "Response invalid", {
                requestUrl: httpResponse.requestUrl,
                httpStatusCode: httpResponse.status,
                validationError: e.toString(),
            });
        }
        return {
            isError: false,
            response: parsedResponse,
        };
    });
}
function throwUnexpectedRequestError(httpResponse, talerErrorResponse) {
    throw new OperationFailedError(makeErrorDetails(TalerErrorCode.WALLET_UNEXPECTED_REQUEST_ERROR, "Unexpected error code in response", {
        requestUrl: httpResponse.requestUrl,
        httpStatusCode: httpResponse.status,
        errorResponse: talerErrorResponse,
    }));
}
function readSuccessResponseJsonOrThrow(httpResponse, codec) {
    return __awaiter(this, void 0, void 0, function* () {
        const r = yield readSuccessResponseJsonOrErrorCode(httpResponse, codec);
        if (!r.isError) {
            return r.response;
        }
        throwUnexpectedRequestError(httpResponse, r.talerErrorResponse);
    });
}
function readSuccessResponseTextOrErrorCode(httpResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(httpResponse.status >= 200 && httpResponse.status < 300)) {
            const errJson = yield httpResponse.json();
            const talerErrorCode = errJson.code;
            if (typeof talerErrorCode !== "number") {
                throw new OperationFailedError(makeErrorDetails(TalerErrorCode.WALLET_RECEIVED_MALFORMED_RESPONSE, "Error response did not contain error code", {
                    httpStatusCode: httpResponse.status,
                    requestUrl: httpResponse.requestUrl,
                    requestMethod: httpResponse.requestMethod,
                }));
            }
            return {
                isError: true,
                talerErrorResponse: errJson,
            };
        }
        const respJson = yield httpResponse.text();
        return {
            isError: false,
            response: respJson,
        };
    });
}
function checkSuccessResponseOrThrow(httpResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(httpResponse.status >= 200 && httpResponse.status < 300)) {
            const errJson = yield httpResponse.json();
            const talerErrorCode = errJson.code;
            if (typeof talerErrorCode !== "number") {
                throw new OperationFailedError(makeErrorDetails(TalerErrorCode.WALLET_RECEIVED_MALFORMED_RESPONSE, "Error response did not contain error code", {
                    httpStatusCode: httpResponse.status,
                    requestUrl: httpResponse.requestUrl,
                    requestMethod: httpResponse.requestMethod,
                }));
            }
            throwUnexpectedRequestError(httpResponse, errJson);
        }
    });
}
function readSuccessResponseTextOrThrow(httpResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        const r = yield readSuccessResponseTextOrErrorCode(httpResponse);
        if (!r.isError) {
            return r.response;
        }
        throwUnexpectedRequestError(httpResponse, r.talerErrorResponse);
    });
}

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
const logger = new Logger("reserves.ts");
function resetReserveRetry(ws, reservePub) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(Stores.reserves, reservePub, (x) => {
            if (x.retryInfo.active) {
                x.retryInfo = initRetryInfo();
            }
            return x;
        });
    });
}
/**
 * Create a reserve, but do not flag it as confirmed yet.
 *
 * Adds the corresponding exchange as a trusted exchange if it is neither
 * audited nor trusted already.
 */
function createReserve(ws, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const keypair = yield ws.cryptoApi.createEddsaKeypair();
        const now = getTimestampNow();
        const canonExchange = canonicalizeBaseUrl(req.exchange);
        let reserveStatus;
        if (req.bankWithdrawStatusUrl) {
            reserveStatus = ReserveRecordStatus.REGISTERING_BANK;
        }
        else {
            reserveStatus = ReserveRecordStatus.QUERYING_STATUS;
        }
        let bankInfo;
        if (req.bankWithdrawStatusUrl) {
            if (!req.exchangePaytoUri) {
                throw Error("Exchange payto URI must be specified for a bank-integrated withdrawal");
            }
            bankInfo = {
                statusUrl: req.bankWithdrawStatusUrl,
                exchangePaytoUri: req.exchangePaytoUri,
            };
        }
        const initialWithdrawalGroupId = encodeCrock(getRandomBytes(32));
        const denomSelInfo = yield selectWithdrawalDenoms(ws, canonExchange, req.amount);
        const initialDenomSel = denomSelectionInfoToState(denomSelInfo);
        const reserveRecord = {
            instructedAmount: req.amount,
            initialWithdrawalGroupId,
            initialDenomSel,
            initialWithdrawalStarted: false,
            timestampCreated: now,
            exchangeBaseUrl: canonExchange,
            reservePriv: keypair.priv,
            reservePub: keypair.pub,
            senderWire: req.senderWire,
            timestampBankConfirmed: undefined,
            timestampReserveInfoPosted: undefined,
            bankInfo,
            reserveStatus,
            lastSuccessfulStatusQuery: undefined,
            retryInfo: initRetryInfo(),
            lastError: undefined,
            currency: req.amount.currency,
        };
        const reserveHistoryRecord = {
            reservePub: keypair.pub,
            reserveTransactions: [],
        };
        reserveHistoryRecord.reserveTransactions.push({
            type: "credit" /* Credit */,
            expectedAmount: req.amount,
        });
        const senderWire = req.senderWire;
        if (senderWire) {
            const rec = {
                paytoUri: senderWire,
            };
            yield ws.db.put(Stores.senderWires, rec);
        }
        const exchangeInfo = yield updateExchangeFromUrl(ws, req.exchange);
        const exchangeDetails = exchangeInfo.details;
        if (!exchangeDetails) {
            console.log(exchangeDetails);
            throw Error("exchange not updated");
        }
        const { isAudited, isTrusted } = yield getExchangeTrust(ws, exchangeInfo);
        let currencyRecord = yield ws.db.get(Stores.currencies, exchangeDetails.currency);
        if (!currencyRecord) {
            currencyRecord = {
                auditors: [],
                exchanges: [],
                fractionalDigits: 2,
                name: exchangeDetails.currency,
            };
        }
        if (!isAudited && !isTrusted) {
            currencyRecord.exchanges.push({
                baseUrl: req.exchange,
                exchangePub: exchangeDetails.masterPublicKey,
            });
        }
        const cr = currencyRecord;
        const resp = yield ws.db.runWithWriteTransaction([
            Stores.currencies,
            Stores.reserves,
            Stores.reserveHistory,
            Stores.bankWithdrawUris,
        ], (tx) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Check if we have already created a reserve for that bankWithdrawStatusUrl
            if ((_a = reserveRecord.bankInfo) === null || _a === void 0 ? void 0 : _a.statusUrl) {
                const bwi = yield tx.get(Stores.bankWithdrawUris, reserveRecord.bankInfo.statusUrl);
                if (bwi) {
                    const otherReserve = yield tx.get(Stores.reserves, bwi.reservePub);
                    if (otherReserve) {
                        logger.trace("returning existing reserve for bankWithdrawStatusUri");
                        return {
                            exchange: otherReserve.exchangeBaseUrl,
                            reservePub: otherReserve.reservePub,
                        };
                    }
                }
                yield tx.put(Stores.bankWithdrawUris, {
                    reservePub: reserveRecord.reservePub,
                    talerWithdrawUri: reserveRecord.bankInfo.statusUrl,
                });
            }
            yield tx.put(Stores.currencies, cr);
            yield tx.put(Stores.reserves, reserveRecord);
            yield tx.put(Stores.reserveHistory, reserveHistoryRecord);
            const r = {
                exchange: canonExchange,
                reservePub: keypair.pub,
            };
            return r;
        }));
        if (reserveRecord.reservePub === resp.reservePub) {
            // Only emit notification when a new reserve was created.
            ws.notify({
                type: "reserve-created" /* ReserveCreated */,
                reservePub: reserveRecord.reservePub,
            });
        }
        // Asynchronously process the reserve, but return
        // to the caller already.
        processReserve(ws, resp.reservePub, true).catch((e) => {
            logger.error("Processing reserve (after createReserve) failed:", e);
        });
        return resp;
    });
}
/**
 * Re-query the status of a reserve.
 */
function forceQueryReserve(ws, reservePub) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([Stores.reserves], (tx) => __awaiter(this, void 0, void 0, function* () {
            const reserve = yield tx.get(Stores.reserves, reservePub);
            if (!reserve) {
                return;
            }
            // Only force status query where it makes sense
            switch (reserve.reserveStatus) {
                case ReserveRecordStatus.DORMANT:
                case ReserveRecordStatus.WITHDRAWING:
                case ReserveRecordStatus.QUERYING_STATUS:
                    break;
                default:
                    return;
            }
            reserve.reserveStatus = ReserveRecordStatus.QUERYING_STATUS;
            reserve.retryInfo = initRetryInfo();
            yield tx.put(Stores.reserves, reserve);
        }));
        yield processReserve(ws, reservePub, true);
    });
}
/**
 * First fetch information requred to withdraw from the reserve,
 * then deplete the reserve, withdrawing coins until it is empty.
 *
 * The returned promise resolves once the reserve is set to the
 * state DORMANT.
 */
function processReserve(ws, reservePub, forceNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        return ws.memoProcessReserve.memo(reservePub, () => __awaiter(this, void 0, void 0, function* () {
            const onOpError = (err) => incrementReserveRetry(ws, reservePub, err);
            yield guardOperationException(() => processReserveImpl(ws, reservePub, forceNow), onOpError);
        }));
    });
}
function registerReserveWithBank(ws, reservePub) {
    return __awaiter(this, void 0, void 0, function* () {
        const reserve = yield ws.db.get(Stores.reserves, reservePub);
        switch (reserve === null || reserve === void 0 ? void 0 : reserve.reserveStatus) {
            case ReserveRecordStatus.WAIT_CONFIRM_BANK:
            case ReserveRecordStatus.REGISTERING_BANK:
                break;
            default:
                return;
        }
        const bankInfo = reserve.bankInfo;
        if (!bankInfo) {
            return;
        }
        const bankStatusUrl = bankInfo.statusUrl;
        const httpResp = yield ws.http.postJson(bankStatusUrl, {
            reserve_pub: reservePub,
            selected_exchange: bankInfo.exchangePaytoUri,
        });
        yield readSuccessResponseJsonOrThrow(httpResp, codecForBankWithdrawalOperationPostResponse());
        yield ws.db.mutate(Stores.reserves, reservePub, (r) => {
            switch (r.reserveStatus) {
                case ReserveRecordStatus.REGISTERING_BANK:
                case ReserveRecordStatus.WAIT_CONFIRM_BANK:
                    break;
                default:
                    return;
            }
            r.timestampReserveInfoPosted = getTimestampNow();
            r.reserveStatus = ReserveRecordStatus.WAIT_CONFIRM_BANK;
            if (!r.bankInfo) {
                throw Error("invariant failed");
            }
            r.retryInfo = initRetryInfo();
            return r;
        });
        ws.notify({ type: "reserve-registered-with-bank" /* ReserveRegisteredWithBank */ });
        return processReserveBankStatus(ws, reservePub);
    });
}
function processReserveBankStatus(ws, reservePub) {
    return __awaiter(this, void 0, void 0, function* () {
        const onOpError = (err) => incrementReserveRetry(ws, reservePub, err);
        yield guardOperationException(() => processReserveBankStatusImpl(ws, reservePub), onOpError);
    });
}
function processReserveBankStatusImpl(ws, reservePub) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const reserve = yield ws.db.get(Stores.reserves, reservePub);
        switch (reserve === null || reserve === void 0 ? void 0 : reserve.reserveStatus) {
            case ReserveRecordStatus.WAIT_CONFIRM_BANK:
            case ReserveRecordStatus.REGISTERING_BANK:
                break;
            default:
                return;
        }
        const bankStatusUrl = (_a = reserve.bankInfo) === null || _a === void 0 ? void 0 : _a.statusUrl;
        if (!bankStatusUrl) {
            return;
        }
        const statusResp = yield ws.http.get(bankStatusUrl);
        const status = yield readSuccessResponseJsonOrThrow(statusResp, codecForWithdrawOperationStatusResponse());
        if (status.selection_done) {
            if (reserve.reserveStatus === ReserveRecordStatus.REGISTERING_BANK) {
                yield registerReserveWithBank(ws, reservePub);
                return yield processReserveBankStatus(ws, reservePub);
            }
        }
        else {
            yield registerReserveWithBank(ws, reservePub);
            return yield processReserveBankStatus(ws, reservePub);
        }
        if (status.transfer_done) {
            yield ws.db.mutate(Stores.reserves, reservePub, (r) => {
                switch (r.reserveStatus) {
                    case ReserveRecordStatus.REGISTERING_BANK:
                    case ReserveRecordStatus.WAIT_CONFIRM_BANK:
                        break;
                    default:
                        return;
                }
                const now = getTimestampNow();
                r.timestampBankConfirmed = now;
                r.reserveStatus = ReserveRecordStatus.QUERYING_STATUS;
                r.retryInfo = initRetryInfo();
                return r;
            });
            yield processReserveImpl(ws, reservePub, true);
        }
        else {
            yield ws.db.mutate(Stores.reserves, reservePub, (r) => {
                switch (r.reserveStatus) {
                    case ReserveRecordStatus.WAIT_CONFIRM_BANK:
                        break;
                    default:
                        return;
                }
                if (r.bankInfo) {
                    r.bankInfo.confirmUrl = status.confirm_transfer_url;
                }
                return r;
            });
            yield incrementReserveRetry(ws, reservePub, undefined);
        }
    });
}
function incrementReserveRetry(ws, reservePub, err) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([Stores.reserves], (tx) => __awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(Stores.reserves, reservePub);
            if (!r) {
                return;
            }
            if (!r.retryInfo) {
                return;
            }
            r.retryInfo.retryCounter++;
            updateRetryInfoTimeout(r.retryInfo);
            r.lastError = err;
            yield tx.put(Stores.reserves, r);
        }));
        if (err) {
            ws.notify({
                type: "reserve-error" /* ReserveOperationError */,
                error: err,
            });
        }
    });
}
/**
 * Update the information about a reserve that is stored in the wallet
 * by quering the reserve's exchange.
 */
function updateReserve(ws, reservePub) {
    return __awaiter(this, void 0, void 0, function* () {
        const reserve = yield ws.db.get(Stores.reserves, reservePub);
        if (!reserve) {
            throw Error("reserve not in db");
        }
        if (reserve.reserveStatus !== ReserveRecordStatus.QUERYING_STATUS) {
            return { ready: true };
        }
        const resp = yield ws.http.get(new URL(`reserves/${reservePub}`, reserve.exchangeBaseUrl).href);
        const result = yield readSuccessResponseJsonOrErrorCode(resp, codecForReserveStatus());
        if (result.isError) {
            if (resp.status === 404 &&
                result.talerErrorResponse.code === TalerErrorCode.RESERVE_STATUS_UNKNOWN) {
                ws.notify({
                    type: "reserve-not-yet-found" /* ReserveNotYetFound */,
                    reservePub,
                });
                yield incrementReserveRetry(ws, reservePub, undefined);
                return { ready: false };
            }
            else {
                throwUnexpectedRequestError(resp, result.talerErrorResponse);
            }
        }
        const reserveInfo = result.response;
        const balance = Amounts.parseOrThrow(reserveInfo.balance);
        const currency = balance.currency;
        yield ws.db.runWithWriteTransaction([Stores.reserves, Stores.reserveUpdatedEvents, Stores.reserveHistory], (tx) => __awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(Stores.reserves, reservePub);
            if (!r) {
                return;
            }
            if (r.reserveStatus !== ReserveRecordStatus.QUERYING_STATUS) {
                return;
            }
            const hist = yield tx.get(Stores.reserveHistory, reservePub);
            if (!hist) {
                throw Error("inconsistent database");
            }
            const newHistoryTransactions = reserveInfo.history.slice(hist.reserveTransactions.length);
            const reserveUpdateId = encodeCrock(getRandomBytes(32));
            const reconciled = reconcileReserveHistory(hist.reserveTransactions, reserveInfo.history);
            const summary = summarizeReserveHistory(reconciled.updatedLocalHistory, currency);
            if (reconciled.newAddedItems.length + reconciled.newMatchedItems.length !=
                0) {
                const reserveUpdate = {
                    reservePub: r.reservePub,
                    timestamp: getTimestampNow(),
                    amountReserveBalance: Amounts.stringify(balance),
                    amountExpected: Amounts.stringify(summary.awaitedReserveAmount),
                    newHistoryTransactions,
                    reserveUpdateId,
                };
                yield tx.put(Stores.reserveUpdatedEvents, reserveUpdate);
                r.reserveStatus = ReserveRecordStatus.WITHDRAWING;
                r.retryInfo = initRetryInfo();
            }
            else {
                r.reserveStatus = ReserveRecordStatus.DORMANT;
                r.retryInfo = initRetryInfo(false);
            }
            r.lastSuccessfulStatusQuery = getTimestampNow();
            hist.reserveTransactions = reconciled.updatedLocalHistory;
            r.lastError = undefined;
            yield tx.put(Stores.reserves, r);
            yield tx.put(Stores.reserveHistory, hist);
        }));
        ws.notify({ type: "reserve-updated" /* ReserveUpdated */ });
        return { ready: true };
    });
}
function processReserveImpl(ws, reservePub, forceNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const reserve = yield ws.db.get(Stores.reserves, reservePub);
        if (!reserve) {
            console.log("not processing reserve: reserve does not exist");
            return;
        }
        if (!forceNow) {
            const now = getTimestampNow();
            if (reserve.retryInfo.nextRetry.t_ms > now.t_ms) {
                logger.trace("processReserve retry not due yet");
                return;
            }
        }
        else {
            yield resetReserveRetry(ws, reservePub);
        }
        logger.trace(`Processing reserve ${reservePub} with status ${reserve.reserveStatus}`);
        switch (reserve.reserveStatus) {
            case ReserveRecordStatus.REGISTERING_BANK:
                yield processReserveBankStatus(ws, reservePub);
                return yield processReserveImpl(ws, reservePub, true);
            case ReserveRecordStatus.QUERYING_STATUS: {
                const res = yield updateReserve(ws, reservePub);
                if (res.ready) {
                    return yield processReserveImpl(ws, reservePub, true);
                }
                else {
                    break;
                }
            }
            case ReserveRecordStatus.WITHDRAWING:
                yield depleteReserve(ws, reservePub);
                break;
            case ReserveRecordStatus.DORMANT:
                // nothing to do
                break;
            case ReserveRecordStatus.WAIT_CONFIRM_BANK:
                yield processReserveBankStatus(ws, reservePub);
                break;
            default:
                console.warn("unknown reserve record status:", reserve.reserveStatus);
                assertUnreachable(reserve.reserveStatus);
                break;
        }
    });
}
/**
 * Withdraw coins from a reserve until it is empty.
 *
 * When finished, marks the reserve as depleted by setting
 * the depleted timestamp.
 */
function depleteReserve(ws, reservePub) {
    return __awaiter(this, void 0, void 0, function* () {
        let reserve;
        let hist;
        yield ws.db.runWithReadTransaction([Stores.reserves, Stores.reserveHistory], (tx) => __awaiter(this, void 0, void 0, function* () {
            reserve = yield tx.get(Stores.reserves, reservePub);
            hist = yield tx.get(Stores.reserveHistory, reservePub);
        }));
        if (!reserve) {
            return;
        }
        if (!hist) {
            throw Error("inconsistent database");
        }
        if (reserve.reserveStatus !== ReserveRecordStatus.WITHDRAWING) {
            return;
        }
        logger.trace(`depleting reserve ${reservePub}`);
        const summary = summarizeReserveHistory(hist.reserveTransactions, reserve.currency);
        const withdrawAmount = summary.unclaimedReserveAmount;
        const denomsForWithdraw = yield selectWithdrawalDenoms(ws, reserve.exchangeBaseUrl, withdrawAmount);
        if (!denomsForWithdraw) {
            // Only complain about inability to withdraw if we
            // didn't withdraw before.
            if (Amounts.isZero(summary.withdrawnAmount)) {
                const opErr = makeErrorDetails(TalerErrorCode.WALLET_EXCHANGE_DENOMINATIONS_INSUFFICIENT, `Unable to withdraw from reserve, no denominations are available to withdraw.`, {});
                yield incrementReserveRetry(ws, reserve.reservePub, opErr);
                throw new OperationFailedAndReportedError(opErr);
            }
            return;
        }
        logger.trace(`Selected coins total cost ${Amounts.stringify(denomsForWithdraw.totalWithdrawCost)} for withdrawal of ${Amounts.stringify(withdrawAmount)}`);
        logger.trace("selected denominations");
        const newWithdrawalGroup = yield ws.db.runWithWriteTransaction([
            Stores.withdrawalGroups,
            Stores.reserves,
            Stores.reserveHistory,
            Stores.planchets,
        ], (tx) => __awaiter(this, void 0, void 0, function* () {
            const newReserve = yield tx.get(Stores.reserves, reservePub);
            if (!newReserve) {
                return false;
            }
            if (newReserve.reserveStatus !== ReserveRecordStatus.WITHDRAWING) {
                return false;
            }
            const newHist = yield tx.get(Stores.reserveHistory, reservePub);
            if (!newHist) {
                throw Error("inconsistent database");
            }
            const newSummary = summarizeReserveHistory(newHist.reserveTransactions, newReserve.currency);
            if (Amounts.cmp(newSummary.unclaimedReserveAmount, denomsForWithdraw.totalWithdrawCost) < 0) {
                // Something must have happened concurrently!
                logger.error("aborting withdrawal session, likely concurrent withdrawal happened");
                logger.error(`unclaimed reserve amount is ${newSummary.unclaimedReserveAmount}`);
                logger.error(`withdrawal cost is ${denomsForWithdraw.totalWithdrawCost}`);
                return false;
            }
            for (let i = 0; i < denomsForWithdraw.selectedDenoms.length; i++) {
                const sd = denomsForWithdraw.selectedDenoms[i];
                for (let j = 0; j < sd.count; j++) {
                    const amt = Amounts.add(sd.denom.value, sd.denom.feeWithdraw).amount;
                    newHist.reserveTransactions.push({
                        type: "withdraw" /* Withdraw */,
                        expectedAmount: amt,
                    });
                }
            }
            newReserve.reserveStatus = ReserveRecordStatus.DORMANT;
            newReserve.retryInfo = initRetryInfo(false);
            let withdrawalGroupId;
            if (!newReserve.initialWithdrawalStarted) {
                withdrawalGroupId = newReserve.initialWithdrawalGroupId;
                newReserve.initialWithdrawalStarted = true;
            }
            else {
                withdrawalGroupId = encodeCrock(randomBytes(32));
            }
            const withdrawalRecord = {
                withdrawalGroupId: withdrawalGroupId,
                exchangeBaseUrl: newReserve.exchangeBaseUrl,
                source: {
                    type: "reserve" /* Reserve */,
                    reservePub: newReserve.reservePub,
                },
                rawWithdrawalAmount: withdrawAmount,
                timestampStart: getTimestampNow(),
                retryInfo: initRetryInfo(),
                lastErrorPerCoin: {},
                lastError: undefined,
                denomsSel: denomSelectionInfoToState(denomsForWithdraw),
            };
            yield tx.put(Stores.reserves, newReserve);
            yield tx.put(Stores.reserveHistory, newHist);
            yield tx.put(Stores.withdrawalGroups, withdrawalRecord);
            return withdrawalRecord;
        }));
        if (newWithdrawalGroup) {
            logger.trace("processing new withdraw group");
            ws.notify({
                type: "withdraw-group-created" /* WithdrawGroupCreated */,
                withdrawalGroupId: newWithdrawalGroup.withdrawalGroupId,
            });
            yield processWithdrawGroup(ws, newWithdrawalGroup.withdrawalGroupId);
        }
        else {
            console.trace("withdraw session already existed");
        }
    });
}
function createTalerWithdrawReserve(ws, talerWithdrawUri, selectedExchange) {
    return __awaiter(this, void 0, void 0, function* () {
        const withdrawInfo = yield getBankWithdrawalInfo(ws, talerWithdrawUri);
        const exchangeWire = yield getExchangePaytoUri(ws, selectedExchange, withdrawInfo.wireTypes);
        const reserve = yield createReserve(ws, {
            amount: withdrawInfo.amount,
            bankWithdrawStatusUrl: withdrawInfo.extractedStatusUrl,
            exchange: selectedExchange,
            senderWire: withdrawInfo.senderWire,
            exchangePaytoUri: exchangeWire,
        });
        // We do this here, as the reserve should be registered before we return,
        // so that we can redirect the user to the bank's status page.
        yield processReserveBankStatus(ws, reserve.reservePub);
        return {
            reservePub: reserve.reservePub,
            confirmTransferUrl: withdrawInfo.confirmTransferUrl,
        };
    });
}
/**
 * Get payto URIs needed to fund a reserve.
 */
function getFundingPaytoUris(tx, reservePub) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const r = yield tx.get(Stores.reserves, reservePub);
        if (!r) {
            logger.error(`reserve ${reservePub} not found (DB corrupted?)`);
            return [];
        }
        const exchange = yield tx.get(Stores.exchanges, r.exchangeBaseUrl);
        if (!exchange) {
            logger.error(`exchange ${r.exchangeBaseUrl} not found (DB corrupted?)`);
            return [];
        }
        const plainPaytoUris = (_b = (_a = exchange.wireInfo) === null || _a === void 0 ? void 0 : _a.accounts.map((x) => x.payto_uri)) !== null && _b !== void 0 ? _b : [];
        if (!plainPaytoUris) {
            logger.error(`exchange ${r.exchangeBaseUrl} has no wire info`);
            return [];
        }
        return plainPaytoUris.map((x) => addPaytoQueryParams(x, {
            amount: Amounts.stringify(r.instructedAmount),
            message: `Taler Withdrawal ${r.reservePub}`,
        }));
    });
}

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
const logger$1 = new Logger("refresh.ts");
/**
 * Get the amount that we lose when refreshing a coin of the given denomination
 * with a certain amount left.
 *
 * If the amount left is zero, then the refresh cost
 * is also considered to be zero.  If a refresh isn't possible (e.g. due to lack of
 * the right denominations), then the cost is the full amount left.
 *
 * Considers refresh fees, withdrawal fees after refresh and amounts too small
 * to refresh.
 */
function getTotalRefreshCost(denoms, refreshedDenom, amountLeft) {
    const withdrawAmount = Amounts.sub(amountLeft, refreshedDenom.feeRefresh)
        .amount;
    const withdrawDenoms = getWithdrawDenomList(withdrawAmount, denoms);
    const resultingAmount = Amounts.add(Amounts.getZero(withdrawAmount.currency), ...withdrawDenoms.selectedDenoms.map((d) => Amounts.mult(d.denom.value, d.count).amount)).amount;
    const totalCost = Amounts.sub(amountLeft, resultingAmount).amount;
    logger$1.trace(`total refresh cost for ${amountToPretty(amountLeft)} is ${amountToPretty(totalCost)}`);
    return totalCost;
}
/**
 * Create a refresh session inside a refresh group.
 */
function refreshCreateSession(ws, refreshGroupId, coinIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        logger$1.trace(`creating refresh session for coin ${coinIndex} in refresh group ${refreshGroupId}`);
        const refreshGroup = yield ws.db.get(Stores.refreshGroups, refreshGroupId);
        if (!refreshGroup) {
            return;
        }
        if (refreshGroup.finishedPerCoin[coinIndex]) {
            return;
        }
        const existingRefreshSession = refreshGroup.refreshSessionPerCoin[coinIndex];
        if (existingRefreshSession) {
            return;
        }
        const oldCoinPub = refreshGroup.oldCoinPubs[coinIndex];
        const coin = yield ws.db.get(Stores.coins, oldCoinPub);
        if (!coin) {
            throw Error("Can't refresh, coin not found");
        }
        const exchange = yield updateExchangeFromUrl(ws, coin.exchangeBaseUrl);
        if (!exchange) {
            throw Error("db inconsistent: exchange of coin not found");
        }
        const oldDenom = yield ws.db.get(Stores.denominations, [
            exchange.baseUrl,
            coin.denomPub,
        ]);
        if (!oldDenom) {
            throw Error("db inconsistent: denomination for coin not found");
        }
        const availableDenoms = yield ws.db
            .iterIndex(Stores.denominations.exchangeBaseUrlIndex, exchange.baseUrl)
            .toArray();
        const availableAmount = Amounts.sub(coin.currentAmount, oldDenom.feeRefresh)
            .amount;
        const newCoinDenoms = getWithdrawDenomList(availableAmount, availableDenoms);
        if (newCoinDenoms.selectedDenoms.length === 0) {
            logger$1.trace(`not refreshing, available amount ${amountToPretty(availableAmount)} too small`);
            yield ws.db.runWithWriteTransaction([Stores.coins, Stores.refreshGroups], (tx) => __awaiter(this, void 0, void 0, function* () {
                const rg = yield tx.get(Stores.refreshGroups, refreshGroupId);
                if (!rg) {
                    return;
                }
                rg.finishedPerCoin[coinIndex] = true;
                let allDone = true;
                for (const f of rg.finishedPerCoin) {
                    if (!f) {
                        allDone = false;
                        break;
                    }
                }
                if (allDone) {
                    rg.timestampFinished = getTimestampNow();
                    rg.retryInfo = initRetryInfo(false);
                }
                yield tx.put(Stores.refreshGroups, rg);
            }));
            ws.notify({ type: "refresh-unwarranted" /* RefreshUnwarranted */ });
            return;
        }
        const refreshSession = yield ws.cryptoApi.createRefreshSession(exchange.baseUrl, 3, coin, newCoinDenoms, oldDenom.feeRefresh);
        // Store refresh session and subtract refreshed amount from
        // coin in the same transaction.
        yield ws.db.runWithWriteTransaction([Stores.refreshGroups, Stores.coins], (tx) => __awaiter(this, void 0, void 0, function* () {
            const c = yield tx.get(Stores.coins, coin.coinPub);
            if (!c) {
                throw Error("coin not found, but marked for refresh");
            }
            const r = Amounts.sub(c.currentAmount, refreshSession.amountRefreshInput);
            if (r.saturated) {
                console.log("can't refresh coin, no amount left");
                return;
            }
            c.currentAmount = r.amount;
            c.status = "dormant" /* Dormant */;
            const rg = yield tx.get(Stores.refreshGroups, refreshGroupId);
            if (!rg) {
                return;
            }
            if (rg.refreshSessionPerCoin[coinIndex]) {
                return;
            }
            rg.refreshSessionPerCoin[coinIndex] = refreshSession;
            yield tx.put(Stores.refreshGroups, rg);
            yield tx.put(Stores.coins, c);
        }));
        logger$1.info(`created refresh session for coin #${coinIndex} in ${refreshGroupId}`);
        ws.notify({ type: "refresh-started" /* RefreshStarted */ });
    });
}
function refreshMelt(ws, refreshGroupId, coinIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshGroup = yield ws.db.get(Stores.refreshGroups, refreshGroupId);
        if (!refreshGroup) {
            return;
        }
        const refreshSession = refreshGroup.refreshSessionPerCoin[coinIndex];
        if (!refreshSession) {
            return;
        }
        if (refreshSession.norevealIndex !== undefined) {
            return;
        }
        const coin = yield ws.db.get(Stores.coins, refreshSession.meltCoinPub);
        if (!coin) {
            console.error("can't melt coin, it does not exist");
            return;
        }
        const reqUrl = new URL(`coins/${coin.coinPub}/melt`, refreshSession.exchangeBaseUrl);
        const meltReq = {
            coin_pub: coin.coinPub,
            confirm_sig: refreshSession.confirmSig,
            denom_pub_hash: coin.denomPubHash,
            denom_sig: coin.denomSig,
            rc: refreshSession.hash,
            value_with_fee: Amounts.stringify(refreshSession.amountRefreshInput),
        };
        logger$1.trace(`melt request for coin:`, meltReq);
        const resp = yield ws.http.postJson(reqUrl.href, meltReq);
        const meltResponse = yield readSuccessResponseJsonOrThrow(resp, codecForExchangeMeltResponse());
        const norevealIndex = meltResponse.noreveal_index;
        refreshSession.norevealIndex = norevealIndex;
        yield ws.db.mutate(Stores.refreshGroups, refreshGroupId, (rg) => {
            const rs = rg.refreshSessionPerCoin[coinIndex];
            if (!rs) {
                return;
            }
            if (rs.norevealIndex !== undefined) {
                return;
            }
            if (rs.finishedTimestamp) {
                return;
            }
            rs.norevealIndex = norevealIndex;
            return rg;
        });
        ws.notify({
            type: "refresh-melted" /* RefreshMelted */,
        });
    });
}
function refreshReveal(ws, refreshGroupId, coinIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshGroup = yield ws.db.get(Stores.refreshGroups, refreshGroupId);
        if (!refreshGroup) {
            return;
        }
        const refreshSession = refreshGroup.refreshSessionPerCoin[coinIndex];
        if (!refreshSession) {
            return;
        }
        const norevealIndex = refreshSession.norevealIndex;
        if (norevealIndex === undefined) {
            throw Error("can't reveal without melting first");
        }
        const privs = Array.from(refreshSession.transferPrivs);
        privs.splice(norevealIndex, 1);
        const planchets = refreshSession.planchetsForGammas[norevealIndex];
        if (!planchets) {
            throw Error("refresh index error");
        }
        const meltCoinRecord = yield ws.db.get(Stores.coins, refreshSession.meltCoinPub);
        if (!meltCoinRecord) {
            throw Error("inconsistent database");
        }
        const evs = planchets.map((x) => x.coinEv);
        const linkSigs = [];
        for (let i = 0; i < refreshSession.newDenoms.length; i++) {
            const linkSig = yield ws.cryptoApi.signCoinLink(meltCoinRecord.coinPriv, refreshSession.newDenomHashes[i], refreshSession.meltCoinPub, refreshSession.transferPubs[norevealIndex], planchets[i].coinEv);
            linkSigs.push(linkSig);
        }
        const req = {
            coin_evs: evs,
            new_denoms_h: refreshSession.newDenomHashes,
            rc: refreshSession.hash,
            transfer_privs: privs,
            transfer_pub: refreshSession.transferPubs[norevealIndex],
            link_sigs: linkSigs,
        };
        const reqUrl = new URL(`refreshes/${refreshSession.hash}/reveal`, refreshSession.exchangeBaseUrl);
        const resp = yield ws.http.postJson(reqUrl.href, req);
        const reveal = yield readSuccessResponseJsonOrThrow(resp, codecForExchangeRevealResponse());
        const coins = [];
        for (let i = 0; i < reveal.ev_sigs.length; i++) {
            const denom = yield ws.db.get(Stores.denominations, [
                refreshSession.exchangeBaseUrl,
                refreshSession.newDenoms[i],
            ]);
            if (!denom) {
                console.error("denom not found");
                continue;
            }
            const pc = refreshSession.planchetsForGammas[norevealIndex][i];
            const denomSig = yield ws.cryptoApi.rsaUnblind(reveal.ev_sigs[i].ev_sig, pc.blindingKey, denom.denomPub);
            const coin = {
                blindingKey: pc.blindingKey,
                coinPriv: pc.privateKey,
                coinPub: pc.publicKey,
                currentAmount: denom.value,
                denomPub: denom.denomPub,
                denomPubHash: denom.denomPubHash,
                denomSig,
                exchangeBaseUrl: refreshSession.exchangeBaseUrl,
                status: "fresh" /* Fresh */,
                coinSource: {
                    type: "refresh" /* Refresh */,
                    oldCoinPub: refreshSession.meltCoinPub,
                },
                suspended: false,
            };
            coins.push(coin);
        }
        yield ws.db.runWithWriteTransaction([Stores.coins, Stores.refreshGroups], (tx) => __awaiter(this, void 0, void 0, function* () {
            const rg = yield tx.get(Stores.refreshGroups, refreshGroupId);
            if (!rg) {
                console.log("no refresh session found");
                return;
            }
            const rs = rg.refreshSessionPerCoin[coinIndex];
            if (!rs) {
                return;
            }
            if (rs.finishedTimestamp) {
                console.log("refresh session already finished");
                return;
            }
            rs.finishedTimestamp = getTimestampNow();
            rg.finishedPerCoin[coinIndex] = true;
            let allDone = true;
            for (const f of rg.finishedPerCoin) {
                if (!f) {
                    allDone = false;
                    break;
                }
            }
            if (allDone) {
                rg.timestampFinished = getTimestampNow();
                rg.retryInfo = initRetryInfo(false);
            }
            for (const coin of coins) {
                yield tx.put(Stores.coins, coin);
            }
            yield tx.put(Stores.refreshGroups, rg);
        }));
        console.log("refresh finished (end of reveal)");
        ws.notify({
            type: "refresh-revealed" /* RefreshRevealed */,
        });
    });
}
function incrementRefreshRetry(ws, refreshGroupId, err) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([Stores.refreshGroups], (tx) => __awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(Stores.refreshGroups, refreshGroupId);
            if (!r) {
                return;
            }
            if (!r.retryInfo) {
                return;
            }
            r.retryInfo.retryCounter++;
            updateRetryInfoTimeout(r.retryInfo);
            r.lastError = err;
            yield tx.put(Stores.refreshGroups, r);
        }));
        if (err) {
            ws.notify({ type: "refresh-operation-error" /* RefreshOperationError */, error: err });
        }
    });
}
function processRefreshGroup(ws, refreshGroupId, forceNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.memoProcessRefresh.memo(refreshGroupId, () => __awaiter(this, void 0, void 0, function* () {
            const onOpErr = (e) => incrementRefreshRetry(ws, refreshGroupId, e);
            return yield guardOperationException(() => __awaiter(this, void 0, void 0, function* () { return yield processRefreshGroupImpl(ws, refreshGroupId, forceNow); }), onOpErr);
        }));
    });
}
function resetRefreshGroupRetry(ws, refreshSessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(Stores.refreshGroups, refreshSessionId, (x) => {
            if (x.retryInfo.active) {
                x.retryInfo = initRetryInfo();
            }
            return x;
        });
    });
}
function processRefreshGroupImpl(ws, refreshGroupId, forceNow) {
    return __awaiter(this, void 0, void 0, function* () {
        if (forceNow) {
            yield resetRefreshGroupRetry(ws, refreshGroupId);
        }
        const refreshGroup = yield ws.db.get(Stores.refreshGroups, refreshGroupId);
        if (!refreshGroup) {
            return;
        }
        if (refreshGroup.timestampFinished) {
            return;
        }
        const ps = refreshGroup.oldCoinPubs.map((x, i) => processRefreshSession(ws, refreshGroupId, i));
        yield Promise.all(ps);
        logger$1.trace("refresh finished");
    });
}
function processRefreshSession(ws, refreshGroupId, coinIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        logger$1.trace(`processing refresh session for coin ${coinIndex} of group ${refreshGroupId}`);
        let refreshGroup = yield ws.db.get(Stores.refreshGroups, refreshGroupId);
        if (!refreshGroup) {
            return;
        }
        if (refreshGroup.finishedPerCoin[coinIndex]) {
            return;
        }
        if (!refreshGroup.refreshSessionPerCoin[coinIndex]) {
            yield refreshCreateSession(ws, refreshGroupId, coinIndex);
            refreshGroup = yield ws.db.get(Stores.refreshGroups, refreshGroupId);
            if (!refreshGroup) {
                return;
            }
        }
        const refreshSession = refreshGroup.refreshSessionPerCoin[coinIndex];
        if (!refreshSession) {
            if (!refreshGroup.finishedPerCoin[coinIndex]) {
                throw Error("BUG: refresh session was not created and coin not marked as finished");
            }
            return;
        }
        if (refreshSession.norevealIndex === undefined) {
            yield refreshMelt(ws, refreshGroupId, coinIndex);
        }
        yield refreshReveal(ws, refreshGroupId, coinIndex);
    });
}
/**
 * Create a refresh group for a list of coins.
 */
function createRefreshGroup(ws, tx, oldCoinPubs, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshGroupId = encodeCrock(getRandomBytes(32));
        const refreshGroup = {
            timestampFinished: undefined,
            finishedPerCoin: oldCoinPubs.map((x) => false),
            lastError: undefined,
            lastErrorPerCoin: {},
            oldCoinPubs: oldCoinPubs.map((x) => x.coinPub),
            reason,
            refreshGroupId,
            refreshSessionPerCoin: oldCoinPubs.map((x) => undefined),
            retryInfo: initRetryInfo(),
        };
        yield tx.put(Stores.refreshGroups, refreshGroup);
        const processAsync = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield processRefreshGroup(ws, refreshGroupId);
            }
            catch (e) {
                logger$1.trace(`Error during refresh: ${e}`);
            }
        });
        processAsync();
        return {
            refreshGroupId,
        };
    });
}

/*
 This file is part of GNU Taler
 (C) 2019-2020 Taler Systems SA

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
function incrementRecoupRetry(ws, recoupGroupId, err) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([Stores.recoupGroups], (tx) => __awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(Stores.recoupGroups, recoupGroupId);
            if (!r) {
                return;
            }
            if (!r.retryInfo) {
                return;
            }
            r.retryInfo.retryCounter++;
            updateRetryInfoTimeout(r.retryInfo);
            r.lastError = err;
            yield tx.put(Stores.recoupGroups, r);
        }));
        if (err) {
            ws.notify({ type: "recoup-operation-error" /* RecoupOperationError */, error: err });
        }
    });
}
function putGroupAsFinished(ws, tx, recoupGroup, coinIdx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (recoupGroup.timestampFinished) {
            return;
        }
        recoupGroup.recoupFinishedPerCoin[coinIdx] = true;
        let allFinished = true;
        for (const b of recoupGroup.recoupFinishedPerCoin) {
            if (!b) {
                allFinished = false;
            }
        }
        if (allFinished) {
            recoupGroup.timestampFinished = getTimestampNow();
            recoupGroup.retryInfo = initRetryInfo(false);
            recoupGroup.lastError = undefined;
            if (recoupGroup.scheduleRefreshCoins.length > 0) {
                const refreshGroupId = yield createRefreshGroup(ws, tx, recoupGroup.scheduleRefreshCoins.map((x) => ({ coinPub: x })), "recoup" /* Recoup */);
                processRefreshGroup(ws, refreshGroupId.refreshGroupId).then((e) => {
                    console.error("error while refreshing after recoup", e);
                });
            }
        }
        yield tx.put(Stores.recoupGroups, recoupGroup);
    });
}
function recoupTipCoin(ws, recoupGroupId, coinIdx, coin) {
    return __awaiter(this, void 0, void 0, function* () {
        // We can't really recoup a coin we got via tipping.
        // Thus we just put the coin to sleep.
        // FIXME: somehow report this to the user
        yield ws.db.runWithWriteTransaction([Stores.recoupGroups], (tx) => __awaiter(this, void 0, void 0, function* () {
            const recoupGroup = yield tx.get(Stores.recoupGroups, recoupGroupId);
            if (!recoupGroup) {
                return;
            }
            if (recoupGroup.recoupFinishedPerCoin[coinIdx]) {
                return;
            }
            yield putGroupAsFinished(ws, tx, recoupGroup, coinIdx);
        }));
    });
}
function recoupWithdrawCoin(ws, recoupGroupId, coinIdx, coin, cs) {
    return __awaiter(this, void 0, void 0, function* () {
        const reservePub = cs.reservePub;
        const reserve = yield ws.db.get(Stores.reserves, reservePub);
        if (!reserve) {
            // FIXME:  We should at least emit some pending operation / warning for this?
            return;
        }
        ws.notify({
            type: "recoup-started" /* RecoupStarted */,
        });
        const recoupRequest = yield ws.cryptoApi.createRecoupRequest(coin);
        const reqUrl = new URL(`/coins/${coin.coinPub}/recoup`, coin.exchangeBaseUrl);
        const resp = yield ws.http.postJson(reqUrl.href, recoupRequest);
        const recoupConfirmation = yield readSuccessResponseJsonOrThrow(resp, codecForRecoupConfirmation());
        if (recoupConfirmation.reserve_pub !== reservePub) {
            throw Error(`Coin's reserve doesn't match reserve on recoup`);
        }
        const exchange = yield ws.db.get(Stores.exchanges, coin.exchangeBaseUrl);
        if (!exchange) {
            // FIXME: report inconsistency?
            return;
        }
        const exchangeDetails = exchange.details;
        if (!exchangeDetails) {
            // FIXME: report inconsistency?
            return;
        }
        // FIXME: verify that our expectations about the amount match
        yield ws.db.runWithWriteTransaction([Stores.coins, Stores.reserves, Stores.recoupGroups], (tx) => __awaiter(this, void 0, void 0, function* () {
            const recoupGroup = yield tx.get(Stores.recoupGroups, recoupGroupId);
            if (!recoupGroup) {
                return;
            }
            if (recoupGroup.recoupFinishedPerCoin[coinIdx]) {
                return;
            }
            const updatedCoin = yield tx.get(Stores.coins, coin.coinPub);
            if (!updatedCoin) {
                return;
            }
            const updatedReserve = yield tx.get(Stores.reserves, reserve.reservePub);
            if (!updatedReserve) {
                return;
            }
            updatedCoin.status = "dormant" /* Dormant */;
            const currency = updatedCoin.currentAmount.currency;
            updatedCoin.currentAmount = Amounts.getZero(currency);
            updatedReserve.reserveStatus = ReserveRecordStatus.QUERYING_STATUS;
            yield tx.put(Stores.coins, updatedCoin);
            yield tx.put(Stores.reserves, updatedReserve);
            yield putGroupAsFinished(ws, tx, recoupGroup, coinIdx);
        }));
        ws.notify({
            type: "recoup-finished" /* RecoupFinished */,
        });
        forceQueryReserve(ws, reserve.reservePub).catch((e) => {
            console.log("re-querying reserve after recoup failed:", e);
        });
    });
}
function recoupRefreshCoin(ws, recoupGroupId, coinIdx, coin, cs) {
    return __awaiter(this, void 0, void 0, function* () {
        ws.notify({
            type: "recoup-started" /* RecoupStarted */,
        });
        const recoupRequest = yield ws.cryptoApi.createRecoupRequest(coin);
        const reqUrl = new URL(`/coins/${coin.coinPub}/recoup`, coin.exchangeBaseUrl);
        console.log("making recoup request");
        const resp = yield ws.http.postJson(reqUrl.href, recoupRequest);
        const recoupConfirmation = yield readSuccessResponseJsonOrThrow(resp, codecForRecoupConfirmation());
        if (recoupConfirmation.old_coin_pub != cs.oldCoinPub) {
            throw Error(`Coin's oldCoinPub doesn't match reserve on recoup`);
        }
        const exchange = yield ws.db.get(Stores.exchanges, coin.exchangeBaseUrl);
        if (!exchange) {
            // FIXME: report inconsistency?
            return;
        }
        const exchangeDetails = exchange.details;
        if (!exchangeDetails) {
            // FIXME: report inconsistency?
            return;
        }
        yield ws.db.runWithWriteTransaction([Stores.coins, Stores.reserves, Stores.recoupGroups, Stores.refreshGroups], (tx) => __awaiter(this, void 0, void 0, function* () {
            const recoupGroup = yield tx.get(Stores.recoupGroups, recoupGroupId);
            if (!recoupGroup) {
                return;
            }
            if (recoupGroup.recoupFinishedPerCoin[coinIdx]) {
                return;
            }
            const oldCoin = yield tx.get(Stores.coins, cs.oldCoinPub);
            const revokedCoin = yield tx.get(Stores.coins, coin.coinPub);
            if (!revokedCoin) {
                return;
            }
            if (!oldCoin) {
                return;
            }
            revokedCoin.status = "dormant" /* Dormant */;
            oldCoin.currentAmount = Amounts.add(oldCoin.currentAmount, recoupGroup.oldAmountPerCoin[coinIdx]).amount;
            console.log("recoup: setting old coin amount to", Amounts.stringify(oldCoin.currentAmount));
            recoupGroup.scheduleRefreshCoins.push(oldCoin.coinPub);
            yield tx.put(Stores.coins, revokedCoin);
            yield tx.put(Stores.coins, oldCoin);
            yield putGroupAsFinished(ws, tx, recoupGroup, coinIdx);
        }));
    });
}
function resetRecoupGroupRetry(ws, recoupGroupId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(Stores.recoupGroups, recoupGroupId, (x) => {
            if (x.retryInfo.active) {
                x.retryInfo = initRetryInfo();
            }
            return x;
        });
    });
}
function processRecoupGroup(ws, recoupGroupId, forceNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.memoProcessRecoup.memo(recoupGroupId, () => __awaiter(this, void 0, void 0, function* () {
            const onOpErr = (e) => incrementRecoupRetry(ws, recoupGroupId, e);
            return yield guardOperationException(() => __awaiter(this, void 0, void 0, function* () { return yield processRecoupGroupImpl(ws, recoupGroupId, forceNow); }), onOpErr);
        }));
    });
}
function processRecoupGroupImpl(ws, recoupGroupId, forceNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (forceNow) {
            yield resetRecoupGroupRetry(ws, recoupGroupId);
        }
        console.log("in processRecoupGroupImpl");
        const recoupGroup = yield ws.db.get(Stores.recoupGroups, recoupGroupId);
        if (!recoupGroup) {
            return;
        }
        console.log(recoupGroup);
        if (recoupGroup.timestampFinished) {
            console.log("recoup group finished");
            return;
        }
        const ps = recoupGroup.coinPubs.map((x, i) => processRecoup(ws, recoupGroupId, i));
        yield Promise.all(ps);
    });
}
function createRecoupGroup(ws, tx, coinPubs) {
    return __awaiter(this, void 0, void 0, function* () {
        const recoupGroupId = encodeCrock(getRandomBytes(32));
        const recoupGroup = {
            recoupGroupId,
            coinPubs: coinPubs,
            lastError: undefined,
            timestampFinished: undefined,
            timestampStarted: getTimestampNow(),
            retryInfo: initRetryInfo(),
            recoupFinishedPerCoin: coinPubs.map(() => false),
            // Will be populated later
            oldAmountPerCoin: [],
            scheduleRefreshCoins: [],
        };
        for (let coinIdx = 0; coinIdx < coinPubs.length; coinIdx++) {
            const coinPub = coinPubs[coinIdx];
            const coin = yield tx.get(Stores.coins, coinPub);
            if (!coin) {
                yield putGroupAsFinished(ws, tx, recoupGroup, coinIdx);
                continue;
            }
            if (Amounts.isZero(coin.currentAmount)) {
                yield putGroupAsFinished(ws, tx, recoupGroup, coinIdx);
                continue;
            }
            recoupGroup.oldAmountPerCoin[coinIdx] = coin.currentAmount;
            coin.currentAmount = Amounts.getZero(coin.currentAmount.currency);
            yield tx.put(Stores.coins, coin);
        }
        yield tx.put(Stores.recoupGroups, recoupGroup);
        return recoupGroupId;
    });
}
function processRecoup(ws, recoupGroupId, coinIdx) {
    return __awaiter(this, void 0, void 0, function* () {
        const recoupGroup = yield ws.db.get(Stores.recoupGroups, recoupGroupId);
        if (!recoupGroup) {
            return;
        }
        if (recoupGroup.timestampFinished) {
            return;
        }
        if (recoupGroup.recoupFinishedPerCoin[coinIdx]) {
            return;
        }
        const coinPub = recoupGroup.coinPubs[coinIdx];
        const coin = yield ws.db.get(Stores.coins, coinPub);
        if (!coin) {
            throw Error(`Coin ${coinPub} not found, can't request payback`);
        }
        const cs = coin.coinSource;
        switch (cs.type) {
            case "tip" /* Tip */:
                return recoupTipCoin(ws, recoupGroupId, coinIdx);
            case "refresh" /* Refresh */:
                return recoupRefreshCoin(ws, recoupGroupId, coinIdx, coin, cs);
            case "withdraw" /* Withdraw */:
                return recoupWithdrawCoin(ws, recoupGroupId, coinIdx, coin, cs);
            default:
                throw Error("unknown coin source type");
        }
    });
}

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
const logger$2 = new Logger("exchanges.ts");
function denominationRecordFromKeys(ws, exchangeBaseUrl, denomIn) {
    return __awaiter(this, void 0, void 0, function* () {
        const denomPubHash = yield ws.cryptoApi.hashEncoded(denomIn.denom_pub);
        const d = {
            denomPub: denomIn.denom_pub,
            denomPubHash,
            exchangeBaseUrl,
            feeDeposit: parseOrThrow(denomIn.fee_deposit),
            feeRefresh: parseOrThrow(denomIn.fee_refresh),
            feeRefund: parseOrThrow(denomIn.fee_refund),
            feeWithdraw: parseOrThrow(denomIn.fee_withdraw),
            isOffered: true,
            isRevoked: false,
            masterSig: denomIn.master_sig,
            stampExpireDeposit: denomIn.stamp_expire_deposit,
            stampExpireLegal: denomIn.stamp_expire_legal,
            stampExpireWithdraw: denomIn.stamp_expire_withdraw,
            stampStart: denomIn.stamp_start,
            status: DenominationStatus.Unverified,
            value: parseOrThrow(denomIn.value),
        };
        return d;
    });
}
function setExchangeError(ws, baseUrl, err) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`last error for exchange ${baseUrl}:`, err);
        const mut = (exchange) => {
            exchange.lastError = err;
            return exchange;
        };
        yield ws.db.mutate(Stores.exchanges, baseUrl, mut);
    });
}
/**
 * Fetch the exchange's /keys and update our database accordingly.
 *
 * Exceptions thrown in this method must be caught and reported
 * in the pending operations.
 */
function updateExchangeWithKeys(ws, baseUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingExchangeRecord = yield ws.db.get(Stores.exchanges, baseUrl);
        if ((existingExchangeRecord === null || existingExchangeRecord === void 0 ? void 0 : existingExchangeRecord.updateStatus) != "fetch-keys" /* FetchKeys */) {
            return;
        }
        logger$2.info("updating exchange /keys info");
        const keysUrl = new URL("keys", baseUrl);
        keysUrl.searchParams.set("cacheBreaker", WALLET_CACHE_BREAKER_CLIENT_VERSION);
        const resp = yield ws.http.get(keysUrl.href);
        const exchangeKeysJson = yield readSuccessResponseJsonOrThrow(resp, codecForExchangeKeysJson());
        logger$2.info("received /keys response");
        if (exchangeKeysJson.denoms.length === 0) {
            const opErr = makeErrorDetails(TalerErrorCode.WALLET_EXCHANGE_DENOMINATIONS_INSUFFICIENT, "exchange doesn't offer any denominations", {
                exchangeBaseUrl: baseUrl,
            });
            yield setExchangeError(ws, baseUrl, opErr);
            throw new OperationFailedAndReportedError(opErr);
        }
        const protocolVersion = exchangeKeysJson.version;
        const versionRes = compare(WALLET_EXCHANGE_PROTOCOL_VERSION, protocolVersion);
        if ((versionRes === null || versionRes === void 0 ? void 0 : versionRes.compatible) != true) {
            const opErr = makeErrorDetails(TalerErrorCode.WALLET_EXCHANGE_PROTOCOL_VERSION_INCOMPATIBLE, "exchange protocol version not compatible with wallet", {
                exchangeProtocolVersion: protocolVersion,
                walletProtocolVersion: WALLET_EXCHANGE_PROTOCOL_VERSION,
            });
            yield setExchangeError(ws, baseUrl, opErr);
            throw new OperationFailedAndReportedError(opErr);
        }
        const currency = parseOrThrow(exchangeKeysJson.denoms[0].value)
            .currency;
        logger$2.trace("processing denominations");
        const newDenominations = yield Promise.all(exchangeKeysJson.denoms.map((d) => denominationRecordFromKeys(ws, baseUrl, d)));
        logger$2.trace("done with processing denominations");
        const lastUpdateTimestamp = getTimestampNow();
        yield ws.db.runWithWriteTransaction([Stores.exchanges, Stores.denominations, Stores.recoupGroups, Stores.coins], (tx) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const r = yield tx.get(Stores.exchanges, baseUrl);
            if (!r) {
                console.warn(`exchange ${baseUrl} no longer present`);
                return;
            }
            if (r.details) ;
            // FIXME: validate signing keys and merge with old set
            r.details = {
                auditors: exchangeKeysJson.auditors,
                currency: currency,
                lastUpdateTime: lastUpdateTimestamp,
                masterPublicKey: exchangeKeysJson.master_public_key,
                protocolVersion: protocolVersion,
                signingKeys: exchangeKeysJson.signkeys,
            };
            r.updateStatus = "fetch-wire" /* FetchWire */;
            r.lastError = undefined;
            yield tx.put(Stores.exchanges, r);
            for (const newDenom of newDenominations) {
                const oldDenom = yield tx.get(Stores.denominations, [
                    baseUrl,
                    newDenom.denomPub,
                ]);
                if (oldDenom) ;
                else {
                    yield tx.put(Stores.denominations, newDenom);
                }
            }
            // Handle recoup
            const recoupDenomList = (_a = exchangeKeysJson.recoup) !== null && _a !== void 0 ? _a : [];
            const newlyRevokedCoinPubs = [];
            logger$2.trace("recoup list from exchange", recoupDenomList);
            for (const recoupInfo of recoupDenomList) {
                const oldDenom = yield tx.getIndexed(Stores.denominations.denomPubHashIndex, recoupInfo.h_denom_pub);
                if (!oldDenom) {
                    // We never even knew about the revoked denomination, all good.
                    continue;
                }
                if (oldDenom.isRevoked) {
                    // We already marked the denomination as revoked,
                    // this implies we revoked all coins
                    console.log("denom already revoked");
                    continue;
                }
                console.log("revoking denom", recoupInfo.h_denom_pub);
                oldDenom.isRevoked = true;
                yield tx.put(Stores.denominations, oldDenom);
                const affectedCoins = yield tx
                    .iterIndexed(Stores.coins.denomPubHashIndex, recoupInfo.h_denom_pub)
                    .toArray();
                for (const ac of affectedCoins) {
                    newlyRevokedCoinPubs.push(ac.coinPub);
                }
            }
            if (newlyRevokedCoinPubs.length != 0) {
                console.log("recouping coins", newlyRevokedCoinPubs);
                yield createRecoupGroup(ws, tx, newlyRevokedCoinPubs);
            }
        }));
        logger$2.trace("done updating exchange /keys");
    });
}
function updateExchangeFinalize(ws, exchangeBaseUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const exchange = yield ws.db.get(Stores.exchanges, exchangeBaseUrl);
        if (!exchange) {
            return;
        }
        if (exchange.updateStatus != "finalize-update" /* FinalizeUpdate */) {
            return;
        }
        yield ws.db.runWithWriteTransaction([Stores.exchanges, Stores.exchangeUpdatedEvents], (tx) => __awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(Stores.exchanges, exchangeBaseUrl);
            if (!r) {
                return;
            }
            if (r.updateStatus != "finalize-update" /* FinalizeUpdate */) {
                return;
            }
            r.addComplete = true;
            r.updateStatus = "finished" /* Finished */;
            yield tx.put(Stores.exchanges, r);
            const updateEvent = {
                exchangeBaseUrl: exchange.baseUrl,
                timestamp: getTimestampNow(),
            };
            yield tx.put(Stores.exchangeUpdatedEvents, updateEvent);
        }));
    });
}
function updateExchangeWithTermsOfService(ws, exchangeBaseUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const exchange = yield ws.db.get(Stores.exchanges, exchangeBaseUrl);
        if (!exchange) {
            return;
        }
        if (exchange.updateStatus != "fetch-terms" /* FetchTerms */) {
            return;
        }
        const reqUrl = new URL("terms", exchangeBaseUrl);
        reqUrl.searchParams.set("cacheBreaker", WALLET_CACHE_BREAKER_CLIENT_VERSION);
        const headers = {
            Accept: "text/plain",
        };
        const resp = yield ws.http.get(reqUrl.href, { headers });
        const tosText = yield readSuccessResponseTextOrThrow(resp);
        const tosEtag = resp.headers.get("etag") || undefined;
        yield ws.db.runWithWriteTransaction([Stores.exchanges], (tx) => __awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(Stores.exchanges, exchangeBaseUrl);
            if (!r) {
                return;
            }
            if (r.updateStatus != "fetch-terms" /* FetchTerms */) {
                return;
            }
            r.termsOfServiceText = tosText;
            r.termsOfServiceLastEtag = tosEtag;
            r.updateStatus = "finalize-update" /* FinalizeUpdate */;
            yield tx.put(Stores.exchanges, r);
        }));
    });
}
function acceptExchangeTermsOfService(ws, exchangeBaseUrl, etag) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([Stores.exchanges], (tx) => __awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(Stores.exchanges, exchangeBaseUrl);
            if (!r) {
                return;
            }
            r.termsOfServiceAcceptedEtag = etag;
            r.termsOfServiceAcceptedTimestamp = getTimestampNow();
            yield tx.put(Stores.exchanges, r);
        }));
    });
}
/**
 * Fetch wire information for an exchange and store it in the database.
 *
 * @param exchangeBaseUrl Exchange base URL, assumed to be already normalized.
 */
function updateExchangeWithWireInfo(ws, exchangeBaseUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const exchange = yield ws.db.get(Stores.exchanges, exchangeBaseUrl);
        if (!exchange) {
            return;
        }
        if (exchange.updateStatus != "fetch-wire" /* FetchWire */) {
            return;
        }
        const details = exchange.details;
        if (!details) {
            throw Error("invalid exchange state");
        }
        const reqUrl = new URL("wire", exchangeBaseUrl);
        reqUrl.searchParams.set("cacheBreaker", WALLET_CACHE_BREAKER_CLIENT_VERSION);
        const resp = yield ws.http.get(reqUrl.href);
        const wireInfo = yield readSuccessResponseJsonOrThrow(resp, codecForExchangeWireJson());
        for (const a of wireInfo.accounts) {
            logger$2.trace("validating exchange acct");
            const isValid = yield ws.cryptoApi.isValidWireAccount(a.payto_uri, a.master_sig, details.masterPublicKey);
            if (!isValid) {
                throw Error("exchange acct signature invalid");
            }
        }
        const feesForType = {};
        for (const wireMethod of Object.keys(wireInfo.fees)) {
            const feeList = [];
            for (const x of wireInfo.fees[wireMethod]) {
                const startStamp = x.start_date;
                const endStamp = x.end_date;
                const fee = {
                    closingFee: parseOrThrow(x.closing_fee),
                    endStamp,
                    sig: x.sig,
                    startStamp,
                    wireFee: parseOrThrow(x.wire_fee),
                };
                const isValid = yield ws.cryptoApi.isValidWireFee(wireMethod, fee, details.masterPublicKey);
                if (!isValid) {
                    throw Error("exchange wire fee signature invalid");
                }
                feeList.push(fee);
            }
            feesForType[wireMethod] = feeList;
        }
        yield ws.db.runWithWriteTransaction([Stores.exchanges], (tx) => __awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(Stores.exchanges, exchangeBaseUrl);
            if (!r) {
                return;
            }
            if (r.updateStatus != "fetch-wire" /* FetchWire */) {
                return;
            }
            r.wireInfo = {
                accounts: wireInfo.accounts,
                feesForType: feesForType,
            };
            r.updateStatus = "fetch-terms" /* FetchTerms */;
            r.lastError = undefined;
            yield tx.put(Stores.exchanges, r);
        }));
    });
}
function updateExchangeFromUrl(ws, baseUrl, forceNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const onOpErr = (e) => setExchangeError(ws, baseUrl, e);
        return yield guardOperationException(() => updateExchangeFromUrlImpl(ws, baseUrl, forceNow), onOpErr);
    });
}
/**
 * Update or add exchange DB entry by fetching the /keys and /wire information.
 * Optionally link the reserve entry to the new or existing
 * exchange entry in then DB.
 */
function updateExchangeFromUrlImpl(ws, baseUrl, forceNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = getTimestampNow();
        baseUrl = canonicalizeBaseUrl(baseUrl);
        const r = yield ws.db.get(Stores.exchanges, baseUrl);
        if (!r) {
            const newExchangeRecord = {
                builtIn: false,
                addComplete: false,
                permanent: true,
                baseUrl: baseUrl,
                details: undefined,
                wireInfo: undefined,
                updateStatus: "fetch-keys" /* FetchKeys */,
                updateStarted: now,
                updateReason: "initial" /* Initial */,
                timestampAdded: getTimestampNow(),
                termsOfServiceAcceptedEtag: undefined,
                termsOfServiceAcceptedTimestamp: undefined,
                termsOfServiceLastEtag: undefined,
                termsOfServiceText: undefined,
                updateDiff: undefined,
            };
            yield ws.db.put(Stores.exchanges, newExchangeRecord);
        }
        else {
            yield ws.db.runWithWriteTransaction([Stores.exchanges], (t) => __awaiter(this, void 0, void 0, function* () {
                const rec = yield t.get(Stores.exchanges, baseUrl);
                if (!rec) {
                    return;
                }
                if (rec.updateStatus != "fetch-keys" /* FetchKeys */ && !forceNow) {
                    return;
                }
                if (rec.updateStatus != "fetch-keys" /* FetchKeys */ && forceNow) {
                    rec.updateReason = "forced" /* Forced */;
                }
                rec.updateStarted = now;
                rec.updateStatus = "fetch-keys" /* FetchKeys */;
                rec.lastError = undefined;
                t.put(Stores.exchanges, rec);
            }));
        }
        yield updateExchangeWithKeys(ws, baseUrl);
        yield updateExchangeWithWireInfo(ws, baseUrl);
        yield updateExchangeWithTermsOfService(ws, baseUrl);
        yield updateExchangeFinalize(ws, baseUrl);
        const updatedExchange = yield ws.db.get(Stores.exchanges, baseUrl);
        if (!updatedExchange) {
            // This should practically never happen
            throw Error("exchange not found");
        }
        return updatedExchange;
    });
}
/**
 * Check if and how an exchange is trusted and/or audited.
 */
function getExchangeTrust(ws, exchangeInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        let isTrusted = false;
        let isAudited = false;
        const exchangeDetails = exchangeInfo.details;
        if (!exchangeDetails) {
            throw Error(`exchange ${exchangeInfo.baseUrl} details not available`);
        }
        const currencyRecord = yield ws.db.get(Stores.currencies, exchangeDetails.currency);
        if (currencyRecord) {
            for (const trustedExchange of currencyRecord.exchanges) {
                if (trustedExchange.exchangePub === exchangeDetails.masterPublicKey) {
                    isTrusted = true;
                    break;
                }
            }
            for (const trustedAuditor of currencyRecord.auditors) {
                for (const exchangeAuditor of exchangeDetails.auditors) {
                    if (trustedAuditor.auditorPub === exchangeAuditor.auditor_pub) {
                        isAudited = true;
                        break;
                    }
                }
            }
        }
        return { isTrusted, isAudited };
    });
}
function getExchangePaytoUri(ws, exchangeBaseUrl, supportedTargetTypes) {
    return __awaiter(this, void 0, void 0, function* () {
        // We do the update here, since the exchange might not even exist
        // yet in our database.
        const exchangeRecord = yield updateExchangeFromUrl(ws, exchangeBaseUrl);
        if (!exchangeRecord) {
            throw Error(`Exchange '${exchangeBaseUrl}' not found.`);
        }
        const exchangeWireInfo = exchangeRecord.wireInfo;
        if (!exchangeWireInfo) {
            throw Error(`Exchange wire info for '${exchangeBaseUrl}' not found.`);
        }
        for (const account of exchangeWireInfo.accounts) {
            const res = parsePaytoUri(account.payto_uri);
            if (!res) {
                continue;
            }
            if (supportedTargetTypes.includes(res.targetType)) {
                return account.payto_uri;
            }
        }
        throw Error("no matching exchange account found");
    });
}

/*
 This file is part of GNU Taler
 (C) 2019-2020 Taler Systems SA

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
const logger$3 = new Logger("withdraw.ts");
function isWithdrawableDenom(d) {
    const now = getTimestampNow();
    const started = timestampCmp(now, d.stampStart) >= 0;
    const lastPossibleWithdraw = timestampSubtractDuraction(d.stampExpireWithdraw, { d_ms: 50 * 1000 });
    const remaining = getDurationRemaining(lastPossibleWithdraw, now);
    const stillOkay = remaining.d_ms !== 0;
    return started && stillOkay && !d.isRevoked;
}
/**
 * Get a list of denominations (with repetitions possible)
 * whose total value is as close as possible to the available
 * amount, but never larger.
 */
function getWithdrawDenomList(amountAvailable, denoms) {
    let remaining = Amounts.copy(amountAvailable);
    const selectedDenoms = [];
    let totalCoinValue = Amounts.getZero(amountAvailable.currency);
    let totalWithdrawCost = Amounts.getZero(amountAvailable.currency);
    denoms = denoms.filter(isWithdrawableDenom);
    denoms.sort((d1, d2) => Amounts.cmp(d2.value, d1.value));
    for (const d of denoms) {
        let count = 0;
        const cost = Amounts.add(d.value, d.feeWithdraw).amount;
        for (;;) {
            if (Amounts.cmp(remaining, cost) < 0) {
                break;
            }
            remaining = Amounts.sub(remaining, cost).amount;
            count++;
        }
        if (count > 0) {
            totalCoinValue = Amounts.add(totalCoinValue, Amounts.mult(d.value, count).amount).amount;
            totalWithdrawCost = Amounts.add(totalWithdrawCost, Amounts.mult(cost, count).amount).amount;
            selectedDenoms.push({
                count,
                denom: d,
            });
        }
        if (Amounts.isZero(remaining)) {
            break;
        }
    }
    return {
        selectedDenoms,
        totalCoinValue,
        totalWithdrawCost,
    };
}
/**
 * Get information about a withdrawal from
 * a taler://withdraw URI by asking the bank.
 */
function getBankWithdrawalInfo(ws, talerWithdrawUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const uriResult = parseWithdrawUri(talerWithdrawUri);
        if (!uriResult) {
            throw Error(`can't parse URL ${talerWithdrawUri}`);
        }
        const reqUrl = new URL(`api/withdraw-operation/${uriResult.withdrawalOperationId}`, uriResult.bankIntegrationApiBaseUrl);
        const resp = yield ws.http.get(reqUrl.href);
        const status = yield readSuccessResponseJsonOrThrow(resp, codecForWithdrawOperationStatusResponse());
        return {
            amount: Amounts.parseOrThrow(status.amount),
            confirmTransferUrl: status.confirm_transfer_url,
            extractedStatusUrl: reqUrl.href,
            selectionDone: status.selection_done,
            senderWire: status.sender_wire,
            suggestedExchange: status.suggested_exchange,
            transferDone: status.transfer_done,
            wireTypes: status.wire_types,
        };
    });
}
/**
 * Return denominations that can potentially used for a withdrawal.
 */
function getPossibleDenoms(ws, exchangeBaseUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield ws.db
            .iterIndex(Stores.denominations.exchangeBaseUrlIndex, exchangeBaseUrl)
            .filter((d) => {
            return ((d.status === DenominationStatus.Unverified ||
                d.status === DenominationStatus.VerifiedGood) &&
                !d.isRevoked);
        });
    });
}
/**
 * Given a planchet, withdraw a coin from the exchange.
 */
function processPlanchet(ws, withdrawalGroupId, coinIdx) {
    return __awaiter(this, void 0, void 0, function* () {
        const withdrawalGroup = yield ws.db.get(Stores.withdrawalGroups, withdrawalGroupId);
        if (!withdrawalGroup) {
            return;
        }
        let planchet = yield ws.db.getIndexed(Stores.planchets.byGroupAndIndex, [
            withdrawalGroupId,
            coinIdx,
        ]);
        if (!planchet) {
            let ci = 0;
            let denomPubHash;
            for (let di = 0; di < withdrawalGroup.denomsSel.selectedDenoms.length; di++) {
                const d = withdrawalGroup.denomsSel.selectedDenoms[di];
                if (coinIdx >= ci && coinIdx < ci + d.count) {
                    denomPubHash = d.denomPubHash;
                    break;
                }
                ci += d.count;
            }
            if (!denomPubHash) {
                throw Error("invariant violated");
            }
            const denom = yield ws.db.getIndexed(Stores.denominations.denomPubHashIndex, denomPubHash);
            if (!denom) {
                throw Error("invariant violated");
            }
            if (withdrawalGroup.source.type != "reserve" /* Reserve */) {
                throw Error("invariant violated");
            }
            const reserve = yield ws.db.get(Stores.reserves, withdrawalGroup.source.reservePub);
            if (!reserve) {
                throw Error("invariant violated");
            }
            const r = yield ws.cryptoApi.createPlanchet({
                denomPub: denom.denomPub,
                feeWithdraw: denom.feeWithdraw,
                reservePriv: reserve.reservePriv,
                reservePub: reserve.reservePub,
                value: denom.value,
            });
            const newPlanchet = {
                blindingKey: r.blindingKey,
                coinEv: r.coinEv,
                coinEvHash: r.coinEvHash,
                coinIdx,
                coinPriv: r.coinPriv,
                coinPub: r.coinPub,
                coinValue: r.coinValue,
                denomPub: r.denomPub,
                denomPubHash: r.denomPubHash,
                isFromTip: false,
                reservePub: r.reservePub,
                withdrawalDone: false,
                withdrawSig: r.withdrawSig,
                withdrawalGroupId: withdrawalGroupId,
            };
            yield ws.db.runWithWriteTransaction([Stores.planchets], (tx) => __awaiter(this, void 0, void 0, function* () {
                const p = yield tx.getIndexed(Stores.planchets.byGroupAndIndex, [
                    withdrawalGroupId,
                    coinIdx,
                ]);
                if (p) {
                    planchet = p;
                    return;
                }
                yield tx.put(Stores.planchets, newPlanchet);
                planchet = newPlanchet;
            }));
        }
        if (!planchet) {
            throw Error("invariant violated");
        }
        if (planchet.withdrawalDone) {
            logger$3.warn("processPlanchet: planchet already withdrawn");
            return;
        }
        const exchange = yield ws.db.get(Stores.exchanges, withdrawalGroup.exchangeBaseUrl);
        if (!exchange) {
            logger$3.error("db inconsistent: exchange for planchet not found");
            return;
        }
        const denom = yield ws.db.get(Stores.denominations, [
            withdrawalGroup.exchangeBaseUrl,
            planchet.denomPub,
        ]);
        if (!denom) {
            console.error("db inconsistent: denom for planchet not found");
            return;
        }
        logger$3.trace(`processing planchet #${coinIdx} in withdrawal ${withdrawalGroupId}`);
        const wd = {};
        wd.denom_pub_hash = planchet.denomPubHash;
        wd.reserve_pub = planchet.reservePub;
        wd.reserve_sig = planchet.withdrawSig;
        wd.coin_ev = planchet.coinEv;
        const reqUrl = new URL(`reserves/${planchet.reservePub}/withdraw`, exchange.baseUrl).href;
        const resp = yield ws.http.postJson(reqUrl, wd);
        const r = yield readSuccessResponseJsonOrThrow(resp, codecForWithdrawResponse());
        logger$3.trace(`got response for /withdraw`);
        const denomSig = yield ws.cryptoApi.rsaUnblind(r.ev_sig, planchet.blindingKey, planchet.denomPub);
        const isValid = yield ws.cryptoApi.rsaVerify(planchet.coinPub, denomSig, planchet.denomPub);
        if (!isValid) {
            throw Error("invalid RSA signature by the exchange");
        }
        logger$3.trace(`unblinded and verified`);
        const coin = {
            blindingKey: planchet.blindingKey,
            coinPriv: planchet.coinPriv,
            coinPub: planchet.coinPub,
            currentAmount: planchet.coinValue,
            denomPub: planchet.denomPub,
            denomPubHash: planchet.denomPubHash,
            denomSig,
            exchangeBaseUrl: withdrawalGroup.exchangeBaseUrl,
            status: "fresh" /* Fresh */,
            coinSource: {
                type: "withdraw" /* Withdraw */,
                coinIndex: coinIdx,
                reservePub: planchet.reservePub,
                withdrawalGroupId: withdrawalGroupId,
            },
            suspended: false,
        };
        let withdrawalGroupFinished = false;
        const planchetCoinPub = planchet.coinPub;
        const success = yield ws.db.runWithWriteTransaction([Stores.coins, Stores.withdrawalGroups, Stores.reserves, Stores.planchets], (tx) => __awaiter(this, void 0, void 0, function* () {
            const ws = yield tx.get(Stores.withdrawalGroups, withdrawalGroupId);
            if (!ws) {
                return false;
            }
            const p = yield tx.get(Stores.planchets, planchetCoinPub);
            if (!p) {
                return false;
            }
            if (p.withdrawalDone) {
                // Already withdrawn
                return false;
            }
            p.withdrawalDone = true;
            yield tx.put(Stores.planchets, p);
            let numTotal = 0;
            for (const ds of ws.denomsSel.selectedDenoms) {
                numTotal += ds.count;
            }
            let numDone = 0;
            yield tx
                .iterIndexed(Stores.planchets.byGroup, withdrawalGroupId)
                .forEach((x) => {
                if (x.withdrawalDone) {
                    numDone++;
                }
            });
            if (numDone > numTotal) {
                throw Error("invariant violated (created more planchets than expected)");
            }
            if (numDone == numTotal) {
                ws.timestampFinish = getTimestampNow();
                ws.lastError = undefined;
                ws.retryInfo = initRetryInfo(false);
                withdrawalGroupFinished = true;
            }
            yield tx.put(Stores.withdrawalGroups, ws);
            yield tx.add(Stores.coins, coin);
            return true;
        }));
        logger$3.trace(`withdrawal result stored in DB`);
        if (success) {
            ws.notify({
                type: "coin-withdrawn" /* CoinWithdrawn */,
            });
        }
        if (withdrawalGroupFinished) {
            ws.notify({
                type: "withdraw-group-finished" /* WithdrawGroupFinished */,
                withdrawalSource: withdrawalGroup.source,
            });
        }
    });
}
function denomSelectionInfoToState(dsi) {
    return {
        selectedDenoms: dsi.selectedDenoms.map((x) => {
            return {
                count: x.count,
                denomPubHash: x.denom.denomPubHash,
            };
        }),
        totalCoinValue: dsi.totalCoinValue,
        totalWithdrawCost: dsi.totalWithdrawCost,
    };
}
/**
 * Get a list of denominations to withdraw from the given exchange for the
 * given amount, making sure that all denominations' signatures are verified.
 *
 * Writes to the DB in order to record the result from verifying
 * denominations.
 */
function selectWithdrawalDenoms(ws, exchangeBaseUrl, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const exchange = yield ws.db.get(Stores.exchanges, exchangeBaseUrl);
        if (!exchange) {
            logger$3.error("exchange not found");
            throw Error(`exchange ${exchangeBaseUrl} not found`);
        }
        const exchangeDetails = exchange.details;
        if (!exchangeDetails) {
            logger$3.error("exchange details not available");
            throw Error(`exchange ${exchangeBaseUrl} details not available`);
        }
        let allValid = false;
        let selectedDenoms;
        // Find a denomination selection for the requested amount.
        // If a selected denomination has not been validated yet
        // and turns our to be invalid, we try again with the
        // reduced set of denominations.
        do {
            allValid = true;
            const nextPossibleDenoms = yield getPossibleDenoms(ws, exchange.baseUrl);
            selectedDenoms = getWithdrawDenomList(amount, nextPossibleDenoms);
            for (const denomSel of selectedDenoms.selectedDenoms) {
                const denom = denomSel.denom;
                if (denom.status === DenominationStatus.Unverified) {
                    const valid = yield ws.cryptoApi.isValidDenom(denom, exchangeDetails.masterPublicKey);
                    if (!valid) {
                        denom.status = DenominationStatus.VerifiedBad;
                        allValid = false;
                    }
                    else {
                        denom.status = DenominationStatus.VerifiedGood;
                    }
                    yield ws.db.put(Stores.denominations, denom);
                }
            }
        } while (selectedDenoms.selectedDenoms.length > 0 && !allValid);
        if (Amounts.cmp(selectedDenoms.totalWithdrawCost, amount) > 0) {
            throw Error("Bug: withdrawal coin selection is wrong");
        }
        return selectedDenoms;
    });
}
function incrementWithdrawalRetry(ws, withdrawalGroupId, err) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([Stores.withdrawalGroups], (tx) => __awaiter(this, void 0, void 0, function* () {
            const wsr = yield tx.get(Stores.withdrawalGroups, withdrawalGroupId);
            if (!wsr) {
                return;
            }
            if (!wsr.retryInfo) {
                return;
            }
            wsr.retryInfo.retryCounter++;
            updateRetryInfoTimeout(wsr.retryInfo);
            wsr.lastError = err;
            yield tx.put(Stores.withdrawalGroups, wsr);
        }));
        if (err) {
            ws.notify({ type: "withdraw-error" /* WithdrawOperationError */, error: err });
        }
    });
}
function processWithdrawGroup(ws, withdrawalGroupId, forceNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const onOpErr = (e) => incrementWithdrawalRetry(ws, withdrawalGroupId, e);
        yield guardOperationException(() => processWithdrawGroupImpl(ws, withdrawalGroupId, forceNow), onOpErr);
    });
}
function resetWithdrawalGroupRetry(ws, withdrawalGroupId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(Stores.withdrawalGroups, withdrawalGroupId, (x) => {
            if (x.retryInfo.active) {
                x.retryInfo = initRetryInfo();
            }
            return x;
        });
    });
}
function processInBatches(workGen, batchSize) {
    return __awaiter(this, void 0, void 0, function* () {
        for (;;) {
            const batch = [];
            for (let i = 0; i < batchSize; i++) {
                const wn = workGen.next();
                if (wn.done) {
                    break;
                }
                batch.push(wn.value);
            }
            if (batch.length == 0) {
                break;
            }
            logger$3.trace(`processing withdrawal batch of ${batch.length} elements`);
            yield Promise.all(batch);
        }
    });
}
function processWithdrawGroupImpl(ws, withdrawalGroupId, forceNow) {
    return __awaiter(this, void 0, void 0, function* () {
        logger$3.trace("processing withdraw group", withdrawalGroupId);
        if (forceNow) {
            yield resetWithdrawalGroupRetry(ws, withdrawalGroupId);
        }
        const withdrawalGroup = yield ws.db.get(Stores.withdrawalGroups, withdrawalGroupId);
        if (!withdrawalGroup) {
            logger$3.trace("withdraw session doesn't exist");
            return;
        }
        const numDenoms = withdrawalGroup.denomsSel.selectedDenoms.length;
        const genWork = function* () {
            let coinIdx = 0;
            for (let i = 0; i < numDenoms; i++) {
                const count = withdrawalGroup.denomsSel.selectedDenoms[i].count;
                for (let j = 0; j < count; j++) {
                    yield processPlanchet(ws, withdrawalGroupId, coinIdx);
                    coinIdx++;
                }
            }
        };
        // Withdraw coins in batches.
        // The batch size is relatively large
        yield processInBatches(genWork(), 10);
    });
}
function getExchangeWithdrawalInfo(ws, baseUrl, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const exchangeInfo = yield updateExchangeFromUrl(ws, baseUrl);
        const exchangeDetails = exchangeInfo.details;
        if (!exchangeDetails) {
            throw Error(`exchange ${exchangeInfo.baseUrl} details not available`);
        }
        const exchangeWireInfo = exchangeInfo.wireInfo;
        if (!exchangeWireInfo) {
            throw Error(`exchange ${exchangeInfo.baseUrl} wire details not available`);
        }
        const selectedDenoms = yield selectWithdrawalDenoms(ws, baseUrl, amount);
        const exchangeWireAccounts = [];
        for (const account of exchangeWireInfo.accounts) {
            exchangeWireAccounts.push(account.payto_uri);
        }
        const { isTrusted, isAudited } = yield getExchangeTrust(ws, exchangeInfo);
        let earliestDepositExpiration = selectedDenoms.selectedDenoms[0].denom.stampExpireDeposit;
        for (let i = 1; i < selectedDenoms.selectedDenoms.length; i++) {
            const expireDeposit = selectedDenoms.selectedDenoms[i].denom.stampExpireDeposit;
            if (expireDeposit.t_ms < earliestDepositExpiration.t_ms) {
                earliestDepositExpiration = expireDeposit;
            }
        }
        const possibleDenoms = yield ws.db
            .iterIndex(Stores.denominations.exchangeBaseUrlIndex, baseUrl)
            .filter((d) => d.isOffered);
        const trustedAuditorPubs = [];
        const currencyRecord = yield ws.db.get(Stores.currencies, amount.currency);
        if (currencyRecord) {
            trustedAuditorPubs.push(...currencyRecord.auditors.map((a) => a.auditorPub));
        }
        let versionMatch;
        if (exchangeDetails.protocolVersion) {
            versionMatch = compare(WALLET_EXCHANGE_PROTOCOL_VERSION, exchangeDetails.protocolVersion);
            if (versionMatch &&
                !versionMatch.compatible &&
                versionMatch.currentCmp === -1) {
                console.warn(`wallet's support for exchange protocol version ${WALLET_EXCHANGE_PROTOCOL_VERSION} might be outdated ` +
                    `(exchange has ${exchangeDetails.protocolVersion}), checking for updates`);
            }
        }
        let tosAccepted = false;
        if (exchangeInfo.termsOfServiceAcceptedTimestamp) {
            if (exchangeInfo.termsOfServiceAcceptedEtag ==
                exchangeInfo.termsOfServiceLastEtag) {
                tosAccepted = true;
            }
        }
        const withdrawFee = Amounts.sub(selectedDenoms.totalWithdrawCost, selectedDenoms.totalCoinValue).amount;
        const ret = {
            earliestDepositExpiration,
            exchangeInfo,
            exchangeWireAccounts,
            exchangeVersion: exchangeDetails.protocolVersion || "unknown",
            isAudited,
            isTrusted,
            numOfferedDenoms: possibleDenoms.length,
            overhead: Amounts.sub(amount, selectedDenoms.totalWithdrawCost).amount,
            selectedDenoms,
            trustedAuditorPubs,
            versionMatch,
            walletVersion: WALLET_EXCHANGE_PROTOCOL_VERSION,
            wireFees: exchangeWireInfo,
            withdrawFee,
            termsOfServiceAccepted: tosAccepted,
        };
        return ret;
    });
}
function getWithdrawalDetailsForUri(ws, talerWithdrawUri) {
    return __awaiter(this, void 0, void 0, function* () {
        logger$3.trace(`getting withdrawal details for URI ${talerWithdrawUri}`);
        const info = yield getBankWithdrawalInfo(ws, talerWithdrawUri);
        logger$3.trace(`got bank info`);
        if (info.suggestedExchange) {
            // FIXME: right now the exchange gets permanently added,
            // we might want to only temporarily add it.
            try {
                yield updateExchangeFromUrl(ws, info.suggestedExchange);
            }
            catch (e) {
                // We still continued if it failed, as other exchanges might be available.
                // We don't want to fail if the bank-suggested exchange is broken/offline.
                logger$3.trace(`querying bank-suggested exchange (${info.suggestedExchange}) failed`);
            }
        }
        const exchangesRes = yield ws.db
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
            if (details.currency !== info.amount.currency) {
                return undefined;
            }
            return {
                exchangeBaseUrl: x.baseUrl,
                currency: details.currency,
                paytoUris: x.wireInfo.accounts.map((x) => x.payto_uri),
            };
        });
        const exchanges = exchangesRes.filter((x) => !!x);
        return {
            amount: Amounts.stringify(info.amount),
            defaultExchangeBaseUrl: info.suggestedExchange,
            possibleExchanges: exchanges,
        };
    });
}

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
 * Logger.
 */
const logger$4 = new Logger("pay.ts");
/**
 * Compute the total cost of a payment to the customer.
 *
 * This includes the amount taken by the merchant, fees (wire/deposit) contributed
 * by the customer, refreshing fees, fees for withdraw-after-refresh and "trimmings"
 * of coins that are too small to spend.
 */
function getTotalPaymentCost(ws, pcs) {
    return __awaiter(this, void 0, void 0, function* () {
        const costs = [];
        for (let i = 0; i < pcs.coinPubs.length; i++) {
            const coin = yield ws.db.get(Stores.coins, pcs.coinPubs[i]);
            if (!coin) {
                throw Error("can't calculate payment cost, coin not found");
            }
            const denom = yield ws.db.get(Stores.denominations, [
                coin.exchangeBaseUrl,
                coin.denomPub,
            ]);
            if (!denom) {
                throw Error("can't calculate payment cost, denomination for coin not found");
            }
            const allDenoms = yield ws.db
                .iterIndex(Stores.denominations.exchangeBaseUrlIndex, coin.exchangeBaseUrl)
                .toArray();
            const amountLeft = sub(denom.value, pcs.coinContributions[i])
                .amount;
            const refreshCost = getTotalRefreshCost(allDenoms, denom, amountLeft);
            costs.push(pcs.coinContributions[i]);
            costs.push(refreshCost);
        }
        return {
            totalCost: sum(costs).amount,
        };
    });
}
/**
 * Given a list of available coins, select coins to spend under the merchant's
 * constraints.
 *
 * This function is only exported for the sake of unit tests.
 */
function selectPayCoins(acis, contractTermsAmount, customerWireFees, depositFeeLimit) {
    if (acis.length === 0) {
        return undefined;
    }
    const coinPubs = [];
    const coinContributions = [];
    // Sort by available amount (descending),  deposit fee (ascending) and
    // denomPub (ascending) if deposit fee is the same
    // (to guarantee deterministic results)
    acis.sort((o1, o2) => -cmp(o1.availableAmount, o2.availableAmount) ||
        cmp(o1.feeDeposit, o2.feeDeposit) ||
        strcmp(o1.denomPub, o2.denomPub));
    const paymentAmount = add(contractTermsAmount, customerWireFees)
        .amount;
    const currency = paymentAmount.currency;
    let amountPayRemaining = paymentAmount;
    let amountDepositFeeLimitRemaining = depositFeeLimit;
    const customerDepositFees = getZero(currency);
    for (const aci of acis) {
        // Don't use this coin if depositing it is more expensive than
        // the amount it would give the merchant.
        if (cmp(aci.feeDeposit, aci.availableAmount) >= 0) {
            continue;
        }
        if (amountPayRemaining.value === 0 && amountPayRemaining.fraction === 0) {
            // We have spent enough!
            break;
        }
        // How much does the user spend on deposit fees for this coin?
        const depositFeeSpend = sub(aci.feeDeposit, amountDepositFeeLimitRemaining).amount;
        if (isZero(depositFeeSpend)) {
            // Fees are still covered by the merchant.
            amountDepositFeeLimitRemaining = sub(amountDepositFeeLimitRemaining, aci.feeDeposit).amount;
        }
        else {
            amountDepositFeeLimitRemaining = getZero(currency);
        }
        let coinSpend;
        const amountActualAvailable = sub(aci.availableAmount, depositFeeSpend).amount;
        if (cmp(amountActualAvailable, amountPayRemaining) > 0) {
            // Partial spending, as the coin is worth more than the remaining
            // amount to pay.
            coinSpend = add(amountPayRemaining, depositFeeSpend).amount;
            // Make sure we contribute at least the deposit fee, otherwise
            // contributing this coin would cause a loss for the merchant.
            if (cmp(coinSpend, aci.feeDeposit) < 0) {
                coinSpend = aci.feeDeposit;
            }
            amountPayRemaining = getZero(currency);
        }
        else {
            // Spend the full remaining amount on the coin
            coinSpend = aci.availableAmount;
            amountPayRemaining = add(amountPayRemaining, depositFeeSpend)
                .amount;
            amountPayRemaining = sub(amountPayRemaining, aci.availableAmount)
                .amount;
        }
        coinPubs.push(aci.coinPub);
        coinContributions.push(coinSpend);
    }
    if (isZero(amountPayRemaining)) {
        return {
            paymentAmount: contractTermsAmount,
            coinContributions,
            coinPubs,
            customerDepositFees,
            customerWireFees,
        };
    }
    return undefined;
}
/**
 * Select coins from the wallet's database that can be used
 * to pay for the given contract.
 *
 * If payment is impossible, undefined is returned.
 */
function getCoinsForPayment(ws, contractData) {
    return __awaiter(this, void 0, void 0, function* () {
        const remainingAmount = contractData.amount;
        const exchanges = yield ws.db.iter(Stores.exchanges).toArray();
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
            for (const allowedExchange of contractData.allowedExchanges) {
                if (allowedExchange.exchangePub === exchangeDetails.masterPublicKey) {
                    isOkay = true;
                    break;
                }
            }
            // is the exchange allowed because of one of its auditors?
            if (!isOkay) {
                for (const allowedAuditor of contractData.allowedAuditors) {
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
            const coins = yield ws.db
                .iterIndex(Stores.coins.exchangeBaseUrlIndex, exchange.baseUrl)
                .toArray();
            if (!coins || coins.length === 0) {
                continue;
            }
            // Denomination of the first coin, we assume that all other
            // coins have the same currency
            const firstDenom = yield ws.db.get(Stores.denominations, [
                exchange.baseUrl,
                coins[0].denomPub,
            ]);
            if (!firstDenom) {
                throw Error("db inconsistent");
            }
            const currency = firstDenom.value.currency;
            const acis = [];
            for (const coin of coins) {
                const denom = yield ws.db.get(Stores.denominations, [
                    exchange.baseUrl,
                    coin.denomPub,
                ]);
                if (!denom) {
                    throw Error("db inconsistent");
                }
                if (denom.value.currency !== currency) {
                    console.warn(`same pubkey for different currencies at exchange ${exchange.baseUrl}`);
                    continue;
                }
                if (coin.suspended) {
                    continue;
                }
                if (coin.status !== "fresh" /* Fresh */) {
                    continue;
                }
                acis.push({
                    availableAmount: coin.currentAmount,
                    coinPub: coin.coinPub,
                    denomPub: coin.denomPub,
                    feeDeposit: denom.feeDeposit,
                });
            }
            let wireFee;
            for (const fee of exchangeFees.feesForType[contractData.wireMethod] || []) {
                if (fee.startStamp <= contractData.timestamp &&
                    fee.endStamp >= contractData.timestamp) {
                    wireFee = fee.wireFee;
                    break;
                }
            }
            let customerWireFee;
            if (wireFee) {
                const amortizedWireFee = divide(wireFee, contractData.wireFeeAmortization);
                if (cmp(contractData.maxWireFee, amortizedWireFee) < 0) {
                    customerWireFee = amortizedWireFee;
                }
                else {
                    customerWireFee = getZero(currency);
                }
            }
            else {
                customerWireFee = getZero(currency);
            }
            // Try if paying using this exchange works
            const res = selectPayCoins(acis, remainingAmount, customerWireFee, contractData.maxDepositFee);
            if (res) {
                return res;
            }
        }
        return undefined;
    });
}
/**
 * Record all information that is necessary to
 * pay for a proposal in the wallet's database.
 */
function recordConfirmPay(ws, proposal, coinSelection, coinDepositPermissions, sessionIdOverride) {
    return __awaiter(this, void 0, void 0, function* () {
        const d = proposal.download;
        if (!d) {
            throw Error("proposal is in invalid state");
        }
        let sessionId;
        if (sessionIdOverride) {
            sessionId = sessionIdOverride;
        }
        else {
            sessionId = proposal.downloadSessionId;
        }
        logger$4.trace(`recording payment with session ID ${sessionId}`);
        const payCostInfo = yield getTotalPaymentCost(ws, coinSelection);
        const t = {
            abortDone: false,
            abortRequested: false,
            contractTermsRaw: d.contractTermsRaw,
            contractData: d.contractData,
            lastSessionId: sessionId,
            payCoinSelection: coinSelection,
            payCostInfo,
            coinDepositPermissions,
            timestampAccept: getTimestampNow(),
            timestampLastRefundStatus: undefined,
            proposalId: proposal.proposalId,
            lastPayError: undefined,
            lastRefundStatusError: undefined,
            payRetryInfo: initRetryInfo(),
            refundStatusRetryInfo: initRetryInfo(),
            refundStatusRequested: false,
            timestampFirstSuccessfulPay: undefined,
            autoRefundDeadline: undefined,
            paymentSubmitPending: true,
            refunds: {},
        };
        yield ws.db.runWithWriteTransaction([Stores.coins, Stores.purchases, Stores.proposals, Stores.refreshGroups], (tx) => __awaiter(this, void 0, void 0, function* () {
            const p = yield tx.get(Stores.proposals, proposal.proposalId);
            if (p) {
                p.proposalStatus = "accepted" /* ACCEPTED */;
                p.lastError = undefined;
                p.retryInfo = initRetryInfo(false);
                yield tx.put(Stores.proposals, p);
            }
            yield tx.put(Stores.purchases, t);
            for (let i = 0; i < coinSelection.coinPubs.length; i++) {
                const coin = yield tx.get(Stores.coins, coinSelection.coinPubs[i]);
                if (!coin) {
                    throw Error("coin allocated for payment doesn't exist anymore");
                }
                coin.status = "dormant" /* Dormant */;
                const remaining = sub(coin.currentAmount, coinSelection.coinContributions[i]);
                if (remaining.saturated) {
                    throw Error("not enough remaining balance on coin for payment");
                }
                coin.currentAmount = remaining.amount;
                yield tx.put(Stores.coins, coin);
            }
            const refreshCoinPubs = coinSelection.coinPubs.map((x) => ({
                coinPub: x,
            }));
            yield createRefreshGroup(ws, tx, refreshCoinPubs, "pay" /* Pay */);
        }));
        ws.notify({
            type: "proposal-accepted" /* ProposalAccepted */,
            proposalId: proposal.proposalId,
        });
        return t;
    });
}
function getNextUrl(contractData) {
    const f = contractData.fulfillmentUrl;
    if (f.startsWith("http://") || f.startsWith("https://")) {
        const fu = new URL(contractData.fulfillmentUrl);
        fu.searchParams.set("order_id", contractData.orderId);
        return fu.href;
    }
    else {
        return f;
    }
}
function incrementProposalRetry(ws, proposalId, err) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([Stores.proposals], (tx) => __awaiter(this, void 0, void 0, function* () {
            const pr = yield tx.get(Stores.proposals, proposalId);
            if (!pr) {
                return;
            }
            if (!pr.retryInfo) {
                return;
            }
            pr.retryInfo.retryCounter++;
            updateRetryInfoTimeout(pr.retryInfo);
            pr.lastError = err;
            yield tx.put(Stores.proposals, pr);
        }));
        if (err) {
            ws.notify({ type: "proposal-error" /* ProposalOperationError */, error: err });
        }
    });
}
function incrementPurchasePayRetry(ws, proposalId, err) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("incrementing purchase pay retry with error", err);
        yield ws.db.runWithWriteTransaction([Stores.purchases], (tx) => __awaiter(this, void 0, void 0, function* () {
            const pr = yield tx.get(Stores.purchases, proposalId);
            if (!pr) {
                return;
            }
            if (!pr.payRetryInfo) {
                return;
            }
            pr.payRetryInfo.retryCounter++;
            updateRetryInfoTimeout(pr.payRetryInfo);
            pr.lastPayError = err;
            yield tx.put(Stores.purchases, pr);
        }));
        if (err) {
            ws.notify({ type: "pay-error" /* PayOperationError */, error: err });
        }
    });
}
function processDownloadProposal(ws, proposalId, forceNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const onOpErr = (err) => incrementProposalRetry(ws, proposalId, err);
        yield guardOperationException(() => processDownloadProposalImpl(ws, proposalId, forceNow), onOpErr);
    });
}
function resetDownloadProposalRetry(ws, proposalId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(Stores.proposals, proposalId, (x) => {
            if (x.retryInfo.active) {
                x.retryInfo = initRetryInfo();
            }
            return x;
        });
    });
}
function processDownloadProposalImpl(ws, proposalId, forceNow) {
    return __awaiter(this, void 0, void 0, function* () {
        if (forceNow) {
            yield resetDownloadProposalRetry(ws, proposalId);
        }
        const proposal = yield ws.db.get(Stores.proposals, proposalId);
        if (!proposal) {
            return;
        }
        if (proposal.proposalStatus != "downloading" /* DOWNLOADING */) {
            return;
        }
        const orderClaimUrl = new URL(`orders/${proposal.orderId}/claim`, proposal.merchantBaseUrl).href;
        logger$4.trace("downloading contract from '" + orderClaimUrl + "'");
        const requestBody = {
            nonce: proposal.noncePub,
        };
        if (proposal.claimToken) {
            requestBody.token = proposal.claimToken;
        }
        const resp = yield ws.http.postJson(orderClaimUrl, requestBody);
        const proposalResp = yield readSuccessResponseJsonOrThrow(resp, codecForProposal());
        // The proposalResp contains the contract terms as raw JSON,
        // as the coded to parse them doesn't necessarily round-trip.
        // We need this raw JSON to compute the contract terms hash.
        const contractTermsHash = yield ws.cryptoApi.hashString(canonicalJson(proposalResp.contract_terms));
        const parsedContractTerms = codecForContractTerms().decode(proposalResp.contract_terms);
        const fulfillmentUrl = parsedContractTerms.fulfillment_url;
        yield ws.db.runWithWriteTransaction([Stores.proposals, Stores.purchases], (tx) => __awaiter(this, void 0, void 0, function* () {
            const p = yield tx.get(Stores.proposals, proposalId);
            if (!p) {
                return;
            }
            if (p.proposalStatus !== "downloading" /* DOWNLOADING */) {
                return;
            }
            const amount = parseOrThrow(parsedContractTerms.amount);
            let maxWireFee;
            if (parsedContractTerms.max_wire_fee) {
                maxWireFee = parseOrThrow(parsedContractTerms.max_wire_fee);
            }
            else {
                maxWireFee = getZero(amount.currency);
            }
            p.download = {
                contractData: {
                    amount,
                    contractTermsHash: contractTermsHash,
                    fulfillmentUrl: parsedContractTerms.fulfillment_url,
                    merchantBaseUrl: parsedContractTerms.merchant_base_url,
                    merchantPub: parsedContractTerms.merchant_pub,
                    merchantSig: proposalResp.sig,
                    orderId: parsedContractTerms.order_id,
                    summary: parsedContractTerms.summary,
                    autoRefund: parsedContractTerms.auto_refund,
                    maxWireFee,
                    payDeadline: parsedContractTerms.pay_deadline,
                    refundDeadline: parsedContractTerms.refund_deadline,
                    wireFeeAmortization: parsedContractTerms.wire_fee_amortization || 1,
                    allowedAuditors: parsedContractTerms.auditors.map((x) => ({
                        auditorBaseUrl: x.url,
                        auditorPub: x.master_pub,
                    })),
                    allowedExchanges: parsedContractTerms.exchanges.map((x) => ({
                        exchangeBaseUrl: x.url,
                        exchangePub: x.master_pub,
                    })),
                    timestamp: parsedContractTerms.timestamp,
                    wireMethod: parsedContractTerms.wire_method,
                    wireInfoHash: parsedContractTerms.h_wire,
                    maxDepositFee: parseOrThrow(parsedContractTerms.max_fee),
                    merchant: parsedContractTerms.merchant,
                    products: parsedContractTerms.products,
                    summaryI18n: parsedContractTerms.summary_i18n,
                },
                contractTermsRaw: JSON.stringify(proposalResp.contract_terms),
            };
            if (fulfillmentUrl.startsWith("http://") ||
                fulfillmentUrl.startsWith("https://")) {
                const differentPurchase = yield tx.getIndexed(Stores.purchases.fulfillmentUrlIndex, fulfillmentUrl);
                if (differentPurchase) {
                    console.log("repurchase detected");
                    p.proposalStatus = "repurchase" /* REPURCHASE */;
                    p.repurchaseProposalId = differentPurchase.proposalId;
                    yield tx.put(Stores.proposals, p);
                    return;
                }
            }
            p.proposalStatus = "proposed" /* PROPOSED */;
            yield tx.put(Stores.proposals, p);
        }));
        ws.notify({
            type: "proposal-downloaded" /* ProposalDownloaded */,
            proposalId: proposal.proposalId,
        });
    });
}
/**
 * Download a proposal and store it in the database.
 * Returns an id for it to retrieve it later.
 *
 * @param sessionId Current session ID, if the proposal is being
 *  downloaded in the context of a session ID.
 */
function startDownloadProposal(ws, merchantBaseUrl, orderId, sessionId, claimToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const oldProposal = yield ws.db.getIndexed(Stores.proposals.urlAndOrderIdIndex, [merchantBaseUrl, orderId]);
        if (oldProposal) {
            yield processDownloadProposal(ws, oldProposal.proposalId);
            return oldProposal.proposalId;
        }
        const { priv, pub } = yield ws.cryptoApi.createEddsaKeypair();
        const proposalId = encodeCrock(getRandomBytes(32));
        const proposalRecord = {
            download: undefined,
            noncePriv: priv,
            noncePub: pub,
            claimToken,
            timestamp: getTimestampNow(),
            merchantBaseUrl,
            orderId,
            proposalId: proposalId,
            proposalStatus: "downloading" /* DOWNLOADING */,
            repurchaseProposalId: undefined,
            retryInfo: initRetryInfo(),
            lastError: undefined,
            downloadSessionId: sessionId,
        };
        yield ws.db.runWithWriteTransaction([Stores.proposals], (tx) => __awaiter(this, void 0, void 0, function* () {
            const existingRecord = yield tx.getIndexed(Stores.proposals.urlAndOrderIdIndex, [merchantBaseUrl, orderId]);
            if (existingRecord) {
                // Created concurrently
                return;
            }
            yield tx.put(Stores.proposals, proposalRecord);
        }));
        yield processDownloadProposal(ws, proposalId);
        return proposalId;
    });
}
function submitPay(ws, proposalId) {
    return __awaiter(this, void 0, void 0, function* () {
        const purchase = yield ws.db.get(Stores.purchases, proposalId);
        if (!purchase) {
            throw Error("Purchase not found: " + proposalId);
        }
        if (purchase.abortRequested) {
            throw Error("not submitting payment for aborted purchase");
        }
        const sessionId = purchase.lastSessionId;
        logger$4.trace("paying with session ID", sessionId);
        const payUrl = new URL(`orders/${purchase.contractData.orderId}/pay`, purchase.contractData.merchantBaseUrl).href;
        const reqBody = {
            coins: purchase.coinDepositPermissions,
            session_id: purchase.lastSessionId,
        };
        logger$4.trace("making pay request", JSON.stringify(reqBody, undefined, 2));
        const resp = yield ws.http.postJson(payUrl, reqBody);
        const merchantResp = yield readSuccessResponseJsonOrThrow(resp, codecForMerchantPayResponse());
        logger$4.trace("got success from pay URL", merchantResp);
        const now = getTimestampNow();
        const merchantPub = purchase.contractData.merchantPub;
        const valid = yield ws.cryptoApi.isValidPaymentSignature(merchantResp.sig, purchase.contractData.contractTermsHash, merchantPub);
        if (!valid) {
            console.error("merchant payment signature invalid");
            // FIXME: properly display error
            throw Error("merchant payment signature invalid");
        }
        const isFirst = purchase.timestampFirstSuccessfulPay === undefined;
        purchase.timestampFirstSuccessfulPay = now;
        purchase.paymentSubmitPending = false;
        purchase.lastPayError = undefined;
        purchase.payRetryInfo = initRetryInfo(false);
        if (isFirst) {
            const ar = purchase.contractData.autoRefund;
            if (ar) {
                console.log("auto_refund present");
                purchase.refundStatusRequested = true;
                purchase.refundStatusRetryInfo = initRetryInfo();
                purchase.lastRefundStatusError = undefined;
                purchase.autoRefundDeadline = timestampAddDuration(now, ar);
            }
        }
        yield ws.db.runWithWriteTransaction([Stores.purchases, Stores.payEvents], (tx) => __awaiter(this, void 0, void 0, function* () {
            yield tx.put(Stores.purchases, purchase);
            const payEvent = {
                proposalId,
                sessionId,
                timestamp: now,
                isReplay: !isFirst,
            };
            yield tx.put(Stores.payEvents, payEvent);
        }));
        const nextUrl = getNextUrl(purchase.contractData);
        ws.cachedNextUrl[purchase.contractData.fulfillmentUrl] = {
            nextUrl,
            lastSessionId: sessionId,
        };
        return {
            type: "done" /* Done */,
            nextUrl,
        };
    });
}
/**
 * Check if a payment for the given taler://pay/ URI is possible.
 *
 * If the payment is possible, the signature are already generated but not
 * yet send to the merchant.
 */
function preparePayForUri(ws, talerPayUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const uriResult = parsePayUri(talerPayUri);
        if (!uriResult) {
            throw OperationFailedError.fromCode(TalerErrorCode.WALLET_INVALID_TALER_PAY_URI, `invalid taler://pay URI (${talerPayUri})`, {
                talerPayUri,
            });
        }
        let proposalId = yield startDownloadProposal(ws, uriResult.merchantBaseUrl, uriResult.orderId, uriResult.sessionId, uriResult.claimToken);
        let proposal = yield ws.db.get(Stores.proposals, proposalId);
        if (!proposal) {
            throw Error(`could not get proposal ${proposalId}`);
        }
        if (proposal.proposalStatus === "repurchase" /* REPURCHASE */) {
            const existingProposalId = proposal.repurchaseProposalId;
            if (!existingProposalId) {
                throw Error("invalid proposal state");
            }
            console.log("using existing purchase for same product");
            proposal = yield ws.db.get(Stores.proposals, existingProposalId);
            if (!proposal) {
                throw Error("existing proposal is in wrong state");
            }
        }
        const d = proposal.download;
        if (!d) {
            console.error("bad proposal", proposal);
            throw Error("proposal is in invalid state");
        }
        const contractData = d.contractData;
        const merchantSig = d.contractData.merchantSig;
        if (!merchantSig) {
            throw Error("BUG: proposal is in invalid state");
        }
        proposalId = proposal.proposalId;
        // First check if we already payed for it.
        const purchase = yield ws.db.get(Stores.purchases, proposalId);
        if (!purchase) {
            // If not already paid, check if we could pay for it.
            const res = yield getCoinsForPayment(ws, contractData);
            if (!res) {
                logger$4.info("not confirming payment, insufficient coins");
                return {
                    status: "insufficient-balance" /* InsufficientBalance */,
                    contractTerms: JSON.parse(d.contractTermsRaw),
                    proposalId: proposal.proposalId,
                    amountRaw: stringify(d.contractData.amount),
                };
            }
            const costInfo = yield getTotalPaymentCost(ws, res);
            logger$4.trace("costInfo", costInfo);
            logger$4.trace("coinsForPayment", res);
            return {
                status: "payment-possible" /* PaymentPossible */,
                contractTerms: JSON.parse(d.contractTermsRaw),
                proposalId: proposal.proposalId,
                amountEffective: stringify(costInfo.totalCost),
                amountRaw: stringify(res.paymentAmount),
            };
        }
        if (purchase.lastSessionId !== uriResult.sessionId) {
            logger$4.trace("automatically re-submitting payment with different session ID");
            yield ws.db.runWithWriteTransaction([Stores.purchases], (tx) => __awaiter(this, void 0, void 0, function* () {
                const p = yield tx.get(Stores.purchases, proposalId);
                if (!p) {
                    return;
                }
                p.lastSessionId = uriResult.sessionId;
                yield tx.put(Stores.purchases, p);
            }));
            const r = yield submitPay(ws, proposalId);
            if (r.type !== "done" /* Done */) {
                throw Error("submitting pay failed");
            }
            return {
                status: "already-confirmed" /* AlreadyConfirmed */,
                contractTerms: JSON.parse(purchase.contractTermsRaw),
                paid: true,
                nextUrl: r.nextUrl,
                amountRaw: stringify(purchase.contractData.amount),
                amountEffective: stringify(purchase.payCostInfo.totalCost),
            };
        }
        else if (!purchase.timestampFirstSuccessfulPay) {
            return {
                status: "already-confirmed" /* AlreadyConfirmed */,
                contractTerms: JSON.parse(purchase.contractTermsRaw),
                paid: false,
                amountRaw: stringify(purchase.contractData.amount),
                amountEffective: stringify(purchase.payCostInfo.totalCost),
            };
        }
        else if (purchase.paymentSubmitPending) {
            return {
                status: "already-confirmed" /* AlreadyConfirmed */,
                contractTerms: JSON.parse(purchase.contractTermsRaw),
                paid: false,
                amountRaw: stringify(purchase.contractData.amount),
                amountEffective: stringify(purchase.payCostInfo.totalCost),
            };
        }
        // FIXME: we don't handle aborted payments correctly here.
        throw Error("BUG: invariant violation (purchase status)");
    });
}
/**
 * Add a contract to the wallet and sign coins, and send them.
 */
function confirmPay(ws, proposalId, sessionIdOverride) {
    return __awaiter(this, void 0, void 0, function* () {
        logger$4.trace(`executing confirmPay with proposalId ${proposalId} and sessionIdOverride ${sessionIdOverride}`);
        const proposal = yield ws.db.get(Stores.proposals, proposalId);
        if (!proposal) {
            throw Error(`proposal with id ${proposalId} not found`);
        }
        const d = proposal.download;
        if (!d) {
            throw Error("proposal is in invalid state");
        }
        let purchase = yield ws.db.get(Stores.purchases, d.contractData.contractTermsHash);
        if (purchase) {
            if (sessionIdOverride !== undefined &&
                sessionIdOverride != purchase.lastSessionId) {
                logger$4.trace(`changing session ID to ${sessionIdOverride}`);
                yield ws.db.mutate(Stores.purchases, purchase.proposalId, (x) => {
                    x.lastSessionId = sessionIdOverride;
                    x.paymentSubmitPending = true;
                    return x;
                });
            }
            logger$4.trace("confirmPay: submitting payment for existing purchase");
            return submitPay(ws, proposalId);
        }
        logger$4.trace("confirmPay: purchase record does not exist yet");
        const res = yield getCoinsForPayment(ws, d.contractData);
        logger$4.trace("coin selection result", res);
        if (!res) {
            // Should not happen, since checkPay should be called first
            logger$4.warn("not confirming payment, insufficient coins");
            throw Error("insufficient balance");
        }
        const depositPermissions = [];
        for (let i = 0; i < res.coinPubs.length; i++) {
            const coin = yield ws.db.get(Stores.coins, res.coinPubs[i]);
            if (!coin) {
                throw Error("can't pay, allocated coin not found anymore");
            }
            const denom = yield ws.db.get(Stores.denominations, [
                coin.exchangeBaseUrl,
                coin.denomPub,
            ]);
            if (!denom) {
                throw Error("can't pay, denomination of allocated coin not found anymore");
            }
            const dp = yield ws.cryptoApi.signDepositPermission({
                coinPriv: coin.coinPriv,
                coinPub: coin.coinPub,
                contractTermsHash: d.contractData.contractTermsHash,
                denomPubHash: coin.denomPubHash,
                denomSig: coin.denomSig,
                exchangeBaseUrl: coin.exchangeBaseUrl,
                feeDeposit: denom.feeDeposit,
                merchantPub: d.contractData.merchantPub,
                refundDeadline: d.contractData.refundDeadline,
                spendAmount: res.coinContributions[i],
                timestamp: d.contractData.timestamp,
                wireInfoHash: d.contractData.wireInfoHash,
            });
            depositPermissions.push(dp);
        }
        purchase = yield recordConfirmPay(ws, proposal, res, depositPermissions, sessionIdOverride);
        return submitPay(ws, proposalId);
    });
}
function processPurchasePay(ws, proposalId, forceNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const onOpErr = (e) => incrementPurchasePayRetry(ws, proposalId, e);
        yield guardOperationException(() => processPurchasePayImpl(ws, proposalId, forceNow), onOpErr);
    });
}
function resetPurchasePayRetry(ws, proposalId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(Stores.purchases, proposalId, (x) => {
            if (x.payRetryInfo.active) {
                x.payRetryInfo = initRetryInfo();
            }
            return x;
        });
    });
}
function processPurchasePayImpl(ws, proposalId, forceNow) {
    return __awaiter(this, void 0, void 0, function* () {
        if (forceNow) {
            yield resetPurchasePayRetry(ws, proposalId);
        }
        const purchase = yield ws.db.get(Stores.purchases, proposalId);
        if (!purchase) {
            return;
        }
        if (!purchase.paymentSubmitPending) {
            return;
        }
        logger$4.trace(`processing purchase pay ${proposalId}`);
        yield submitPay(ws, proposalId);
    });
}
function refuseProposal(ws, proposalId) {
    return __awaiter(this, void 0, void 0, function* () {
        const success = yield ws.db.runWithWriteTransaction([Stores.proposals], (tx) => __awaiter(this, void 0, void 0, function* () {
            const proposal = yield tx.get(Stores.proposals, proposalId);
            if (!proposal) {
                logger$4.trace(`proposal ${proposalId} not found, won't refuse proposal`);
                return false;
            }
            if (proposal.proposalStatus !== "proposed" /* PROPOSED */) {
                return false;
            }
            proposal.proposalStatus = "refused" /* REFUSED */;
            yield tx.put(Stores.proposals, proposal);
            return true;
        }));
        if (success) {
            ws.notify({
                type: "proposal-refused" /* ProposalRefused */,
            });
        }
    });
}

/*
 This file is part of GNU Taler
 (C) 2017-2019 Taler Systems S.A.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
const logger$5 = new Logger("timer.ts");
class IntervalHandle {
    constructor(h) {
        this.h = h;
    }
    clear() {
        clearInterval(this.h);
    }
    /**
     * Make sure the event loop exits when the timer is the
     * only event left.  Has no effect in the browser.
     */
    unref() {
        if (typeof this.h === "object") {
            this.h.unref();
        }
    }
}
class TimeoutHandle {
    constructor(h) {
        this.h = h;
    }
    clear() {
        clearTimeout(this.h);
    }
    /**
     * Make sure the event loop exits when the timer is the
     * only event left.  Has no effect in the browser.
     */
    unref() {
        if (typeof this.h === "object") {
            this.h.unref();
        }
    }
}
/**
 * Get a performance counter in milliseconds.
 */
const performanceNow = (() => {
    // @ts-ignore
    if (typeof process !== "undefined" && process.hrtime) {
        return () => {
            const t = process.hrtime();
            return t[0] * 1e9 + t[1];
        };
    }
    // @ts-ignore
    if (typeof performance !== "undefined") {
        // @ts-ignore
        return () => performance.now();
    }
    return () => 0;
})();
/**
 * Call a function every time the delay given in milliseconds passes.
 */
function every(delayMs, callback) {
    return new IntervalHandle(setInterval(callback, delayMs));
}
/**
 * Call a function after the delay given in milliseconds passes.
 */
function after(delayMs, callback) {
    return new TimeoutHandle(setTimeout(callback, delayMs));
}
const nullTimerHandle = {
    clear() {
        // do nothing
        return;
    },
    unref() {
        // do nothing
        return;
    }
};
/**
 * Group of timers that can be destroyed at once.
 */
class TimerGroup {
    constructor() {
        this.stopped = false;
        this.timerMap = {};
        this.idGen = 1;
    }
    stopCurrentAndFutureTimers() {
        this.stopped = true;
        for (const x in this.timerMap) {
            if (!this.timerMap.hasOwnProperty(x)) {
                continue;
            }
            this.timerMap[x].clear();
            delete this.timerMap[x];
        }
    }
    resolveAfter(delayMs) {
        return new Promise((resolve, reject) => {
            if (delayMs.d_ms !== "forever") {
                this.after(delayMs.d_ms, () => {
                    resolve();
                });
            }
        });
    }
    after(delayMs, callback) {
        if (this.stopped) {
            logger$5.warn("dropping timer since timer group is stopped");
            return nullTimerHandle;
        }
        const h = after(delayMs, callback);
        const myId = this.idGen++;
        this.timerMap[myId] = h;
        const tm = this.timerMap;
        return {
            clear() {
                h.clear();
                delete tm[myId];
            },
            unref() {
                h.unref();
            }
        };
    }
    every(delayMs, callback) {
        if (this.stopped) {
            logger$5.warn("dropping timer since timer group is stopped");
            return nullTimerHandle;
        }
        const h = every(delayMs, callback);
        const myId = this.idGen++;
        this.timerMap[myId] = h;
        const tm = this.timerMap;
        return {
            clear() {
                h.clear();
                delete tm[myId];
            },
            unref() {
                h.unref();
            }
        };
    }
}

/*
 This file is part of GNU Taler
 (C) 2016 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
const logger$6 = new Logger("cryptoApi.ts");
/**
 * Number of different priorities. Each priority p
 * must be 0 <= p < NUM_PRIO.
 */
const NUM_PRIO = 5;
/**
 * Crypto API that interfaces manages a background crypto thread
 * for the execution of expensive operations.
 */
class CryptoApi {
    constructor(workerFactory) {
        this.nextRpcId = 1;
        /**
         * Number of busy workers.
         */
        this.numBusy = 0;
        /**
         * Did we stop accepting new requests?
         */
        this.stopped = false;
        this.workerFactory = workerFactory;
        this.workers = new Array(workerFactory.getConcurrency());
        for (let i = 0; i < this.workers.length; i++) {
            this.workers[i] = {
                currentWorkItem: null,
                terminationTimerHandle: null,
                w: null,
            };
        }
        this.workQueues = [];
        for (let i = 0; i < NUM_PRIO; i++) {
            this.workQueues.push([]);
        }
    }
    /**
     * Terminate all worker threads.
     */
    terminateWorkers() {
        for (const worker of this.workers) {
            if (worker.w) {
                logger$6.trace("terminating worker");
                worker.w.terminate();
                if (worker.terminationTimerHandle) {
                    worker.terminationTimerHandle.clear();
                    worker.terminationTimerHandle = null;
                }
                if (worker.currentWorkItem) {
                    worker.currentWorkItem.reject(Error("explicitly terminated"));
                    worker.currentWorkItem = null;
                }
                worker.w = null;
            }
        }
    }
    stop() {
        this.terminateWorkers();
        this.stopped = true;
    }
    /**
     * Start a worker (if not started) and set as busy.
     */
    wake(ws, work) {
        if (this.stopped) {
            logger$6.trace("cryptoApi is stopped");
            return;
        }
        if (ws.currentWorkItem !== null) {
            throw Error("assertion failed");
        }
        ws.currentWorkItem = work;
        this.numBusy++;
        let worker;
        if (!ws.w) {
            worker = this.workerFactory.startWorker();
            worker.onmessage = (m) => this.handleWorkerMessage(ws, m);
            worker.onerror = (e) => this.handleWorkerError(ws, e);
            ws.w = worker;
        }
        else {
            worker = ws.w;
        }
        const msg = {
            args: work.args,
            id: work.rpcId,
            operation: work.operation,
        };
        this.resetWorkerTimeout(ws);
        work.startTime = performanceNow();
        after(0, () => worker.postMessage(msg));
    }
    resetWorkerTimeout(ws) {
        if (ws.terminationTimerHandle !== null) {
            ws.terminationTimerHandle.clear();
            ws.terminationTimerHandle = null;
        }
        const destroy = () => {
            // terminate worker if it's idle
            if (ws.w && ws.currentWorkItem === null) {
                ws.w.terminate();
                ws.w = null;
            }
        };
        ws.terminationTimerHandle = after(15 * 1000, destroy);
        //ws.terminationTimerHandle.unref();
    }
    handleWorkerError(ws, e) {
        if (ws.currentWorkItem) {
            console.error(`error in worker during ${ws.currentWorkItem.operation}`, e);
        }
        else {
            console.error("error in worker", e);
        }
        console.error(e.message);
        try {
            if (ws.w) {
                ws.w.terminate();
                ws.w = null;
            }
        }
        catch (e) {
            console.error(e);
        }
        if (ws.currentWorkItem !== null) {
            ws.currentWorkItem.reject(e);
            ws.currentWorkItem = null;
            this.numBusy--;
        }
        this.findWork(ws);
    }
    findWork(ws) {
        // try to find more work for this worker
        for (let i = 0; i < NUM_PRIO; i++) {
            const q = this.workQueues[NUM_PRIO - i - 1];
            if (q.length !== 0) {
                const work = q.shift();
                if (!work) {
                    continue;
                }
                this.wake(ws, work);
                return;
            }
        }
    }
    handleWorkerMessage(ws, msg) {
        const id = msg.data.id;
        if (typeof id !== "number") {
            console.error("rpc id must be number");
            return;
        }
        const currentWorkItem = ws.currentWorkItem;
        ws.currentWorkItem = null;
        this.numBusy--;
        this.findWork(ws);
        if (!currentWorkItem) {
            console.error("unsolicited response from worker");
            return;
        }
        if (id !== currentWorkItem.rpcId) {
            console.error(`RPC with id ${id} has no registry entry`);
            return;
        }
        currentWorkItem.resolve(msg.data.result);
    }
    doRpc(operation, priority, ...args) {
        const p = new Promise((resolve, reject) => {
            const rpcId = this.nextRpcId++;
            const workItem = {
                operation,
                args,
                resolve,
                reject,
                rpcId,
                startTime: 0,
            };
            if (this.numBusy === this.workers.length) {
                const q = this.workQueues[priority];
                if (!q) {
                    throw Error("assertion failed");
                }
                this.workQueues[priority].push(workItem);
                return;
            }
            for (const ws of this.workers) {
                if (ws.currentWorkItem !== null) {
                    continue;
                }
                this.wake(ws, workItem);
                return;
            }
            throw Error("assertion failed");
        });
        return p;
    }
    createPlanchet(req) {
        return this.doRpc("createPlanchet", 1, req);
    }
    createTipPlanchet(denom) {
        return this.doRpc("createTipPlanchet", 1, denom);
    }
    hashString(str) {
        return this.doRpc("hashString", 1, str);
    }
    hashEncoded(encodedBytes) {
        return this.doRpc("hashEncoded", 1, encodedBytes);
    }
    isValidDenom(denom, masterPub) {
        return this.doRpc("isValidDenom", 2, denom, masterPub);
    }
    isValidWireFee(type, wf, masterPub) {
        return this.doRpc("isValidWireFee", 2, type, wf, masterPub);
    }
    isValidPaymentSignature(sig, contractHash, merchantPub) {
        return this.doRpc("isValidPaymentSignature", 1, sig, contractHash, merchantPub);
    }
    signDepositPermission(depositInfo) {
        return this.doRpc("signDepositPermission", 3, depositInfo);
    }
    createEddsaKeypair() {
        return this.doRpc("createEddsaKeypair", 1);
    }
    rsaUnblind(sig, bk, pk) {
        return this.doRpc("rsaUnblind", 4, sig, bk, pk);
    }
    rsaVerify(hm, sig, pk) {
        return this.doRpc("rsaVerify", 4, hm, sig, pk);
    }
    isValidWireAccount(paytoUri, sig, masterPub) {
        return this.doRpc("isValidWireAccount", 4, paytoUri, sig, masterPub);
    }
    createRecoupRequest(coin) {
        return this.doRpc("createRecoupRequest", 1, coin);
    }
    createRefreshSession(exchangeBaseUrl, kappa, meltCoin, newCoinDenoms, meltFee) {
        return this.doRpc("createRefreshSession", 4, exchangeBaseUrl, kappa, meltCoin, newCoinDenoms, meltFee);
    }
    signCoinLink(oldCoinPriv, newDenomHash, oldCoinPub, transferPub, coinEv) {
        return this.doRpc("signCoinLink", 4, oldCoinPriv, newDenomHash, oldCoinPub, transferPub, coinEv);
    }
    benchmark(repetitions) {
        return this.doRpc("benchmark", 1, repetitions);
    }
}

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
class AsyncOpMemoMap {
    constructor() {
        this.n = 0;
        this.memoMap = {};
    }
    cleanUp(key, n) {
        const r = this.memoMap[key];
        if (r && r.n === n) {
            delete this.memoMap[key];
        }
    }
    memo(key, pg) {
        const res = this.memoMap[key];
        if (res) {
            return res.p;
        }
        const n = this.n++;
        // Wrap the operation in case it immediately throws
        const p = Promise.resolve().then(() => pg());
        this.memoMap[key] = {
            p,
            n,
            t: new Date().getTime(),
        };
        return p.finally(() => {
            this.cleanUp(key, n);
        });
    }
    clear() {
        this.memoMap = {};
    }
}
class AsyncOpMemoSingle {
    constructor() {
        this.n = 0;
    }
    cleanUp(n) {
        if (this.memoEntry && this.memoEntry.n === n) {
            this.memoEntry = undefined;
        }
    }
    memo(pg) {
        const res = this.memoEntry;
        if (res) {
            return res.p;
        }
        const n = this.n++;
        // Wrap the operation in case it immediately throws
        const p = Promise.resolve().then(() => pg());
        p.finally(() => {
            this.cleanUp(n);
        });
        this.memoEntry = {
            p,
            n,
            t: new Date().getTime(),
        };
        return p;
    }
    clear() {
        this.memoEntry = undefined;
    }
}

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
const logger$7 = new Logger("state.ts");
class InternalWalletState {
    constructor(db, http, cryptoWorkerFactory) {
        this.db = db;
        this.http = http;
        this.cachedNextUrl = {};
        this.memoProcessReserve = new AsyncOpMemoMap();
        this.memoMakePlanchet = new AsyncOpMemoMap();
        this.memoGetPending = new AsyncOpMemoSingle();
        this.memoGetBalance = new AsyncOpMemoSingle();
        this.memoProcessRefresh = new AsyncOpMemoMap();
        this.memoProcessRecoup = new AsyncOpMemoMap();
        this.listeners = [];
        this.cryptoApi = new CryptoApi(cryptoWorkerFactory);
    }
    notify(n) {
        logger$7.trace("Notification", n);
        for (const l of this.listeners) {
            const nc = JSON.parse(JSON.stringify(n));
            setTimeout(() => {
                l(nc);
            }, 0);
        }
    }
    addNotificationListener(f) {
        this.listeners.push(f);
    }
}

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
const logger$8 = new Logger("withdraw.ts");
/**
 * Get balance information.
 */
function getBalancesInsideTransaction(ws, tx) {
    return __awaiter(this, void 0, void 0, function* () {
        const balanceStore = {};
        /**
         * Add amount to a balance field, both for
         * the slicing by exchange and currency.
         */
        const initBalance = (currency) => {
            const b = balanceStore[currency];
            if (!b) {
                balanceStore[currency] = {
                    available: getZero(currency),
                    pendingIncoming: getZero(currency),
                    pendingOutgoing: getZero(currency),
                };
            }
            return balanceStore[currency];
        };
        // Initialize balance to zero, even if we didn't start withdrawing yet.
        yield tx.iter(Stores.reserves).forEach((r) => {
            const b = initBalance(r.currency);
            if (!r.initialWithdrawalStarted) {
                b.pendingIncoming = add(b.pendingIncoming, r.initialDenomSel.totalCoinValue).amount;
            }
        });
        yield tx.iter(Stores.coins).forEach((c) => {
            // Only count fresh coins, as dormant coins will
            // already be in a refresh session.
            if (c.status === "fresh" /* Fresh */) {
                const b = initBalance(c.currentAmount.currency);
                b.available = add(b.available, c.currentAmount).amount;
            }
        });
        yield tx.iter(Stores.refreshGroups).forEach((r) => {
            // Don't count finished refreshes, since the refresh already resulted
            // in coins being added to the wallet.
            if (r.timestampFinished) {
                return;
            }
            for (let i = 0; i < r.oldCoinPubs.length; i++) {
                const session = r.refreshSessionPerCoin[i];
                if (session) {
                    const b = initBalance(session.amountRefreshOutput.currency);
                    // We are always assuming the refresh will succeed, thus we
                    // report the output as available balance.
                    b.available = add(session.amountRefreshOutput).amount;
                }
            }
        });
        yield tx.iter(Stores.withdrawalGroups).forEach((wds) => {
            if (wds.timestampFinish) {
                return;
            }
            const b = initBalance(wds.denomsSel.totalWithdrawCost.currency);
            b.pendingIncoming = add(b.pendingIncoming, wds.denomsSel.totalCoinValue).amount;
        });
        const balancesResponse = {
            balances: [],
        };
        Object.keys(balanceStore)
            .sort()
            .forEach((c) => {
            const v = balanceStore[c];
            balancesResponse.balances.push({
                available: stringify(v.available),
                pendingIncoming: stringify(v.pendingIncoming),
                pendingOutgoing: stringify(v.pendingOutgoing),
                hasPendingTransactions: false,
                requiresUserInput: false,
            });
        });
        return balancesResponse;
    });
}
/**
 * Get detailed balance information, sliced by exchange and by currency.
 */
function getBalances(ws) {
    return __awaiter(this, void 0, void 0, function* () {
        logger$8.trace("starting to compute balance");
        const wbal = yield ws.db.runWithReadTransaction([
            Stores.coins,
            Stores.refreshGroups,
            Stores.reserves,
            Stores.purchases,
            Stores.withdrawalGroups,
        ], (tx) => __awaiter(this, void 0, void 0, function* () {
            return getBalancesInsideTransaction(ws, tx);
        }));
        logger$8.trace("finished computing wallet balance");
        return wbal;
    });
}

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
function updateRetryDelay(oldDelay, now, retryTimestamp) {
    const remaining = getDurationRemaining(retryTimestamp, now);
    const nextDelay = durationMin(oldDelay, remaining);
    return nextDelay;
}
function gatherExchangePending(tx, now, resp, onlyDue = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (onlyDue) {
            // FIXME: exchanges should also be updated regularly
            return;
        }
        yield tx.iter(Stores.exchanges).forEach((e) => {
            switch (e.updateStatus) {
                case "finished" /* Finished */:
                    if (e.lastError) {
                        resp.pendingOperations.push({
                            type: "bug" /* Bug */,
                            givesLifeness: false,
                            message: "Exchange record is in FINISHED state but has lastError set",
                            details: {
                                exchangeBaseUrl: e.baseUrl,
                            },
                        });
                    }
                    if (!e.details) {
                        resp.pendingOperations.push({
                            type: "bug" /* Bug */,
                            givesLifeness: false,
                            message: "Exchange record does not have details, but no update in progress.",
                            details: {
                                exchangeBaseUrl: e.baseUrl,
                            },
                        });
                    }
                    if (!e.wireInfo) {
                        resp.pendingOperations.push({
                            type: "bug" /* Bug */,
                            givesLifeness: false,
                            message: "Exchange record does not have wire info, but no update in progress.",
                            details: {
                                exchangeBaseUrl: e.baseUrl,
                            },
                        });
                    }
                    break;
                case "fetch-keys" /* FetchKeys */:
                    resp.pendingOperations.push({
                        type: "exchange-update" /* ExchangeUpdate */,
                        givesLifeness: false,
                        stage: "fetch-keys" /* FetchKeys */,
                        exchangeBaseUrl: e.baseUrl,
                        lastError: e.lastError,
                        reason: e.updateReason || "unknown",
                    });
                    break;
                case "fetch-wire" /* FetchWire */:
                    resp.pendingOperations.push({
                        type: "exchange-update" /* ExchangeUpdate */,
                        givesLifeness: false,
                        stage: "fetch-wire" /* FetchWire */,
                        exchangeBaseUrl: e.baseUrl,
                        lastError: e.lastError,
                        reason: e.updateReason || "unknown",
                    });
                    break;
                case "finalize-update" /* FinalizeUpdate */:
                    resp.pendingOperations.push({
                        type: "exchange-update" /* ExchangeUpdate */,
                        givesLifeness: false,
                        stage: "finalize-update" /* FinalizeUpdate */,
                        exchangeBaseUrl: e.baseUrl,
                        lastError: e.lastError,
                        reason: e.updateReason || "unknown",
                    });
                    break;
                default:
                    resp.pendingOperations.push({
                        type: "bug" /* Bug */,
                        givesLifeness: false,
                        message: "Unknown exchangeUpdateStatus",
                        details: {
                            exchangeBaseUrl: e.baseUrl,
                            exchangeUpdateStatus: e.updateStatus,
                        },
                    });
                    break;
            }
        });
    });
}
function gatherReservePending(tx, now, resp, onlyDue = false) {
    return __awaiter(this, void 0, void 0, function* () {
        // FIXME: this should be optimized by using an index for "onlyDue==true".
        yield tx.iter(Stores.reserves).forEach((reserve) => {
            const reserveType = reserve.bankInfo
                ? "taler-bank-withdraw" /* TalerBankWithdraw */
                : "manual" /* Manual */;
            if (!reserve.retryInfo.active) {
                return;
            }
            switch (reserve.reserveStatus) {
                case ReserveRecordStatus.DORMANT:
                    // nothing to report as pending
                    break;
                case ReserveRecordStatus.WAIT_CONFIRM_BANK:
                case ReserveRecordStatus.WITHDRAWING:
                case ReserveRecordStatus.QUERYING_STATUS:
                case ReserveRecordStatus.REGISTERING_BANK:
                    resp.nextRetryDelay = updateRetryDelay(resp.nextRetryDelay, now, reserve.retryInfo.nextRetry);
                    if (onlyDue && reserve.retryInfo.nextRetry.t_ms > now.t_ms) {
                        return;
                    }
                    resp.pendingOperations.push({
                        type: "reserve" /* Reserve */,
                        givesLifeness: true,
                        stage: reserve.reserveStatus,
                        timestampCreated: reserve.timestampCreated,
                        reserveType,
                        reservePub: reserve.reservePub,
                        retryInfo: reserve.retryInfo,
                    });
                    break;
                default:
                    resp.pendingOperations.push({
                        type: "bug" /* Bug */,
                        givesLifeness: false,
                        message: "Unknown reserve record status",
                        details: {
                            reservePub: reserve.reservePub,
                            reserveStatus: reserve.reserveStatus,
                        },
                    });
                    break;
            }
        });
    });
}
function gatherRefreshPending(tx, now, resp, onlyDue = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield tx.iter(Stores.refreshGroups).forEach((r) => {
            if (r.timestampFinished) {
                return;
            }
            resp.nextRetryDelay = updateRetryDelay(resp.nextRetryDelay, now, r.retryInfo.nextRetry);
            if (onlyDue && r.retryInfo.nextRetry.t_ms > now.t_ms) {
                return;
            }
            resp.pendingOperations.push({
                type: "refresh" /* Refresh */,
                givesLifeness: true,
                refreshGroupId: r.refreshGroupId,
                finishedPerCoin: r.finishedPerCoin,
                retryInfo: r.retryInfo,
            });
        });
    });
}
function gatherWithdrawalPending(tx, now, resp, onlyDue = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield tx.iter(Stores.withdrawalGroups).forEachAsync((wsr) => __awaiter(this, void 0, void 0, function* () {
            if (wsr.timestampFinish) {
                return;
            }
            resp.nextRetryDelay = updateRetryDelay(resp.nextRetryDelay, now, wsr.retryInfo.nextRetry);
            if (onlyDue && wsr.retryInfo.nextRetry.t_ms > now.t_ms) {
                return;
            }
            let numCoinsWithdrawn = 0;
            let numCoinsTotal = 0;
            yield tx
                .iterIndexed(Stores.planchets.byGroup, wsr.withdrawalGroupId)
                .forEach((x) => {
                numCoinsTotal++;
                if (x.withdrawalDone) {
                    numCoinsWithdrawn++;
                }
            });
            resp.pendingOperations.push({
                type: "withdraw" /* Withdraw */,
                givesLifeness: true,
                numCoinsTotal,
                numCoinsWithdrawn,
                source: wsr.source,
                withdrawalGroupId: wsr.withdrawalGroupId,
                lastError: wsr.lastError,
            });
        }));
    });
}
function gatherProposalPending(tx, now, resp, onlyDue = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield tx.iter(Stores.proposals).forEach((proposal) => {
            if (proposal.proposalStatus == "proposed" /* PROPOSED */) {
                if (onlyDue) {
                    return;
                }
                const dl = proposal.download;
                if (!dl) {
                    resp.pendingOperations.push({
                        type: "bug" /* Bug */,
                        message: "proposal is in invalid state",
                        details: {},
                        givesLifeness: false,
                    });
                }
                else {
                    resp.pendingOperations.push({
                        type: "proposal-choice" /* ProposalChoice */,
                        givesLifeness: false,
                        merchantBaseUrl: dl.contractData.merchantBaseUrl,
                        proposalId: proposal.proposalId,
                        proposalTimestamp: proposal.timestamp,
                    });
                }
            }
            else if (proposal.proposalStatus == "downloading" /* DOWNLOADING */) {
                resp.nextRetryDelay = updateRetryDelay(resp.nextRetryDelay, now, proposal.retryInfo.nextRetry);
                if (onlyDue && proposal.retryInfo.nextRetry.t_ms > now.t_ms) {
                    return;
                }
                resp.pendingOperations.push({
                    type: "proposal-download" /* ProposalDownload */,
                    givesLifeness: true,
                    merchantBaseUrl: proposal.merchantBaseUrl,
                    orderId: proposal.orderId,
                    proposalId: proposal.proposalId,
                    proposalTimestamp: proposal.timestamp,
                    lastError: proposal.lastError,
                    retryInfo: proposal.retryInfo,
                });
            }
        });
    });
}
function gatherTipPending(tx, now, resp, onlyDue = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield tx.iter(Stores.tips).forEach((tip) => {
            if (tip.pickedUp) {
                return;
            }
            resp.nextRetryDelay = updateRetryDelay(resp.nextRetryDelay, now, tip.retryInfo.nextRetry);
            if (onlyDue && tip.retryInfo.nextRetry.t_ms > now.t_ms) {
                return;
            }
            if (tip.acceptedTimestamp) {
                resp.pendingOperations.push({
                    type: "tip-pickup" /* TipPickup */,
                    givesLifeness: true,
                    merchantBaseUrl: tip.merchantBaseUrl,
                    tipId: tip.tipId,
                    merchantTipId: tip.merchantTipId,
                });
            }
        });
    });
}
function gatherPurchasePending(tx, now, resp, onlyDue = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield tx.iter(Stores.purchases).forEach((pr) => {
            if (pr.paymentSubmitPending) {
                resp.nextRetryDelay = updateRetryDelay(resp.nextRetryDelay, now, pr.payRetryInfo.nextRetry);
                if (!onlyDue || pr.payRetryInfo.nextRetry.t_ms <= now.t_ms) {
                    resp.pendingOperations.push({
                        type: "pay" /* Pay */,
                        givesLifeness: true,
                        isReplay: false,
                        proposalId: pr.proposalId,
                        retryInfo: pr.payRetryInfo,
                        lastError: pr.lastPayError,
                    });
                }
            }
            if (pr.refundStatusRequested) {
                resp.nextRetryDelay = updateRetryDelay(resp.nextRetryDelay, now, pr.refundStatusRetryInfo.nextRetry);
                if (!onlyDue || pr.refundStatusRetryInfo.nextRetry.t_ms <= now.t_ms) {
                    resp.pendingOperations.push({
                        type: "refund-query" /* RefundQuery */,
                        givesLifeness: true,
                        proposalId: pr.proposalId,
                        retryInfo: pr.refundStatusRetryInfo,
                        lastError: pr.lastRefundStatusError,
                    });
                }
            }
        });
    });
}
function gatherRecoupPending(tx, now, resp, onlyDue = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield tx.iter(Stores.recoupGroups).forEach((rg) => {
            if (rg.timestampFinished) {
                return;
            }
            resp.nextRetryDelay = updateRetryDelay(resp.nextRetryDelay, now, rg.retryInfo.nextRetry);
            if (onlyDue && rg.retryInfo.nextRetry.t_ms > now.t_ms) {
                return;
            }
            resp.pendingOperations.push({
                type: "recoup" /* Recoup */,
                givesLifeness: true,
                recoupGroupId: rg.recoupGroupId,
                retryInfo: rg.retryInfo,
                lastError: rg.lastError,
            });
        });
    });
}
function getPendingOperations(ws, { onlyDue = false } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = getTimestampNow();
        return yield ws.db.runWithReadTransaction([
            Stores.exchanges,
            Stores.reserves,
            Stores.refreshGroups,
            Stores.coins,
            Stores.withdrawalGroups,
            Stores.proposals,
            Stores.tips,
            Stores.purchases,
            Stores.recoupGroups,
            Stores.planchets,
        ], (tx) => __awaiter(this, void 0, void 0, function* () {
            const walletBalance = yield getBalancesInsideTransaction(ws, tx);
            const resp = {
                nextRetryDelay: { d_ms: Number.MAX_SAFE_INTEGER },
                onlyDue: onlyDue,
                walletBalance,
                pendingOperations: [],
            };
            yield gatherExchangePending(tx, now, resp, onlyDue);
            yield gatherReservePending(tx, now, resp, onlyDue);
            yield gatherRefreshPending(tx, now, resp, onlyDue);
            yield gatherWithdrawalPending(tx, now, resp, onlyDue);
            yield gatherProposalPending(tx, now, resp, onlyDue);
            yield gatherTipPending(tx, now, resp, onlyDue);
            yield gatherPurchasePending(tx, now, resp, onlyDue);
            yield gatherRecoupPending(tx, now, resp, onlyDue);
            return resp;
        }));
    });
}

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
function getTipStatus(ws, talerTipUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = parseTipUri(talerTipUri);
        if (!res) {
            throw Error("invalid taler://tip URI");
        }
        const tipStatusUrl = new URL("tip-pickup", res.merchantBaseUrl);
        tipStatusUrl.searchParams.set("tip_id", res.merchantTipId);
        console.log("checking tip status from", tipStatusUrl.href);
        const merchantResp = yield ws.http.get(tipStatusUrl.href);
        const tipPickupStatus = yield readSuccessResponseJsonOrThrow(merchantResp, codecForTipPickupGetResponse());
        console.log("status", tipPickupStatus);
        const amount = parseOrThrow(tipPickupStatus.amount);
        const merchantOrigin = new URL(res.merchantBaseUrl).origin;
        let tipRecord = yield ws.db.get(Stores.tips, [
            res.merchantTipId,
            merchantOrigin,
        ]);
        if (!tipRecord) {
            yield updateExchangeFromUrl(ws, tipPickupStatus.exchange_url);
            const withdrawDetails = yield getExchangeWithdrawalInfo(ws, tipPickupStatus.exchange_url, amount);
            const tipId = encodeCrock(getRandomBytes(32));
            const selectedDenoms = yield selectWithdrawalDenoms(ws, tipPickupStatus.exchange_url, amount);
            tipRecord = {
                tipId,
                acceptedTimestamp: undefined,
                rejectedTimestamp: undefined,
                amount,
                deadline: tipPickupStatus.stamp_expire,
                exchangeUrl: tipPickupStatus.exchange_url,
                merchantBaseUrl: res.merchantBaseUrl,
                nextUrl: undefined,
                pickedUp: false,
                planchets: undefined,
                response: undefined,
                createdTimestamp: getTimestampNow(),
                merchantTipId: res.merchantTipId,
                totalFees: add(withdrawDetails.overhead, withdrawDetails.withdrawFee).amount,
                retryInfo: initRetryInfo(),
                lastError: undefined,
                denomsSel: denomSelectionInfoToState(selectedDenoms),
            };
            yield ws.db.put(Stores.tips, tipRecord);
        }
        const tipStatus = {
            accepted: !!tipRecord && !!tipRecord.acceptedTimestamp,
            amount: parseOrThrow(tipPickupStatus.amount),
            amountLeft: parseOrThrow(tipPickupStatus.amount_left),
            exchangeUrl: tipPickupStatus.exchange_url,
            nextUrl: tipPickupStatus.extra.next_url,
            merchantOrigin: merchantOrigin,
            merchantTipId: res.merchantTipId,
            expirationTimestamp: tipPickupStatus.stamp_expire,
            timestamp: tipPickupStatus.stamp_created,
            totalFees: tipRecord.totalFees,
            tipId: tipRecord.tipId,
        };
        return tipStatus;
    });
}
function incrementTipRetry(ws, refreshSessionId, err) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([Stores.tips], (tx) => __awaiter(this, void 0, void 0, function* () {
            const t = yield tx.get(Stores.tips, refreshSessionId);
            if (!t) {
                return;
            }
            if (!t.retryInfo) {
                return;
            }
            t.retryInfo.retryCounter++;
            updateRetryInfoTimeout(t.retryInfo);
            t.lastError = err;
            yield tx.put(Stores.tips, t);
        }));
        ws.notify({ type: "tip-error" /* TipOperationError */ });
    });
}
function processTip(ws, tipId, forceNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const onOpErr = (e) => incrementTipRetry(ws, tipId, e);
        yield guardOperationException(() => processTipImpl(ws, tipId, forceNow), onOpErr);
    });
}
function resetTipRetry(ws, tipId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(Stores.tips, tipId, (x) => {
            if (x.retryInfo.active) {
                x.retryInfo = initRetryInfo();
            }
            return x;
        });
    });
}
function processTipImpl(ws, tipId, forceNow) {
    return __awaiter(this, void 0, void 0, function* () {
        if (forceNow) {
            yield resetTipRetry(ws, tipId);
        }
        let tipRecord = yield ws.db.get(Stores.tips, tipId);
        if (!tipRecord) {
            return;
        }
        if (tipRecord.pickedUp) {
            console.log("tip already picked up");
            return;
        }
        const denomsForWithdraw = tipRecord.denomsSel;
        if (!tipRecord.planchets) {
            const planchets = [];
            for (const sd of denomsForWithdraw.selectedDenoms) {
                const denom = yield ws.db.getIndexed(Stores.denominations.denomPubHashIndex, sd.denomPubHash);
                if (!denom) {
                    throw Error("denom does not exist anymore");
                }
                for (let i = 0; i < sd.count; i++) {
                    const r = yield ws.cryptoApi.createTipPlanchet(denom);
                    planchets.push(r);
                }
            }
            yield ws.db.mutate(Stores.tips, tipId, (r) => {
                if (!r.planchets) {
                    r.planchets = planchets;
                }
                return r;
            });
        }
        tipRecord = yield ws.db.get(Stores.tips, tipId);
        if (!tipRecord) {
            throw Error("tip not in database");
        }
        if (!tipRecord.planchets) {
            throw Error("invariant violated");
        }
        console.log("got planchets for tip!");
        // Planchets in the form that the merchant expects
        const planchetsDetail = tipRecord.planchets.map((p) => ({
            coin_ev: p.coinEv,
            denom_pub_hash: p.denomPubHash,
        }));
        let merchantResp;
        const tipStatusUrl = new URL("tip-pickup", tipRecord.merchantBaseUrl);
        try {
            const req = { planchets: planchetsDetail, tip_id: tipRecord.merchantTipId };
            merchantResp = yield ws.http.postJson(tipStatusUrl.href, req);
            if (merchantResp.status !== 200) {
                throw Error(`unexpected status ${merchantResp.status} for tip-pickup`);
            }
            console.log("got merchant resp:", merchantResp);
        }
        catch (e) {
            console.log("tipping failed", e);
            throw e;
        }
        const response = codecForTipResponse().decode(yield merchantResp.json());
        if (response.reserve_sigs.length !== tipRecord.planchets.length) {
            throw Error("number of tip responses does not match requested planchets");
        }
        const withdrawalGroupId = encodeCrock(getRandomBytes(32));
        const planchets = [];
        for (let i = 0; i < tipRecord.planchets.length; i++) {
            const tipPlanchet = tipRecord.planchets[i];
            const coinEvHash = yield ws.cryptoApi.hashEncoded(tipPlanchet.coinEv);
            const planchet = {
                blindingKey: tipPlanchet.blindingKey,
                coinEv: tipPlanchet.coinEv,
                coinPriv: tipPlanchet.coinPriv,
                coinPub: tipPlanchet.coinPub,
                coinValue: tipPlanchet.coinValue,
                denomPub: tipPlanchet.denomPub,
                denomPubHash: tipPlanchet.denomPubHash,
                reservePub: response.reserve_pub,
                withdrawSig: response.reserve_sigs[i].reserve_sig,
                isFromTip: true,
                coinEvHash,
                coinIdx: i,
                withdrawalDone: false,
                withdrawalGroupId: withdrawalGroupId,
            };
            planchets.push(planchet);
        }
        const withdrawalGroup = {
            exchangeBaseUrl: tipRecord.exchangeUrl,
            source: {
                type: "tip" /* Tip */,
                tipId: tipRecord.tipId,
            },
            timestampStart: getTimestampNow(),
            withdrawalGroupId: withdrawalGroupId,
            rawWithdrawalAmount: tipRecord.amount,
            lastErrorPerCoin: {},
            retryInfo: initRetryInfo(),
            timestampFinish: undefined,
            lastError: undefined,
            denomsSel: tipRecord.denomsSel,
        };
        yield ws.db.runWithWriteTransaction([Stores.tips, Stores.withdrawalGroups], (tx) => __awaiter(this, void 0, void 0, function* () {
            const tr = yield tx.get(Stores.tips, tipId);
            if (!tr) {
                return;
            }
            if (tr.pickedUp) {
                return;
            }
            tr.pickedUp = true;
            tr.retryInfo = initRetryInfo(false);
            yield tx.put(Stores.tips, tr);
            yield tx.put(Stores.withdrawalGroups, withdrawalGroup);
            for (const p of planchets) {
                yield tx.put(Stores.planchets, p);
            }
        }));
        yield processWithdrawGroup(ws, withdrawalGroupId);
    });
}
function acceptTip(ws, tipId) {
    return __awaiter(this, void 0, void 0, function* () {
        const tipRecord = yield ws.db.get(Stores.tips, tipId);
        if (!tipRecord) {
            console.log("tip not found");
            return;
        }
        tipRecord.acceptedTimestamp = getTimestampNow();
        yield ws.db.put(Stores.tips, tipRecord);
        yield processTip(ws, tipId);
        return;
    });
}

/*
 This file is part of GNU Taler
 (C) 2019-2019 Taler Systems S.A.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
const logger$9 = new Logger("refund.ts");
/**
 * Retry querying and applying refunds for an order later.
 */
function incrementPurchaseQueryRefundRetry(ws, proposalId, err) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([Stores.purchases], (tx) => __awaiter(this, void 0, void 0, function* () {
            const pr = yield tx.get(Stores.purchases, proposalId);
            if (!pr) {
                return;
            }
            if (!pr.refundStatusRetryInfo) {
                return;
            }
            pr.refundStatusRetryInfo.retryCounter++;
            updateRetryInfoTimeout(pr.refundStatusRetryInfo);
            pr.lastRefundStatusError = err;
            yield tx.put(Stores.purchases, pr);
        }));
        if (err) {
            ws.notify({
                type: "refund-status-error" /* RefundStatusOperationError */,
                error: err,
            });
        }
    });
}
function getRefundKey(d) {
    return `${d.coin_pub}-${d.rtransaction_id}`;
}
function applySuccessfulRefund(tx, p, refreshCoinsMap, r) {
    return __awaiter(this, void 0, void 0, function* () {
        // FIXME: check signature before storing it as valid!
        const refundKey = getRefundKey(r);
        const coin = yield tx.get(Stores.coins, r.coin_pub);
        if (!coin) {
            console.warn("coin not found, can't apply refund");
            return;
        }
        const denom = yield tx.getIndexed(Stores.denominations.denomPubHashIndex, coin.denomPubHash);
        if (!denom) {
            throw Error("inconsistent database");
        }
        refreshCoinsMap[coin.coinPub] = { coinPub: coin.coinPub };
        const refundAmount = Amounts.parseOrThrow(r.refund_amount);
        const refundFee = denom.feeRefund;
        coin.status = "dormant" /* Dormant */;
        coin.currentAmount = Amounts.add(coin.currentAmount, refundAmount).amount;
        coin.currentAmount = Amounts.sub(coin.currentAmount, refundFee).amount;
        logger$9.trace(`coin amount after is ${Amounts.stringify(coin.currentAmount)}`);
        yield tx.put(Stores.coins, coin);
        const allDenoms = yield tx
            .iterIndexed(Stores.denominations.exchangeBaseUrlIndex, coin.exchangeBaseUrl)
            .toArray();
        const amountLeft = Amounts.sub(Amounts.add(coin.currentAmount, Amounts.parseOrThrow(r.refund_amount))
            .amount, denom.feeRefund).amount;
        const totalRefreshCostBound = getTotalRefreshCost(allDenoms, denom, amountLeft);
        p.refunds[refundKey] = {
            type: "applied" /* Applied */,
            executionTime: r.execution_time,
            refundAmount: Amounts.parseOrThrow(r.refund_amount),
            refundFee: denom.feeRefund,
            totalRefreshCostBound,
        };
    });
}
function storePendingRefund(tx, p, r) {
    return __awaiter(this, void 0, void 0, function* () {
        const refundKey = getRefundKey(r);
        const coin = yield tx.get(Stores.coins, r.coin_pub);
        if (!coin) {
            console.warn("coin not found, can't apply refund");
            return;
        }
        const denom = yield tx.getIndexed(Stores.denominations.denomPubHashIndex, coin.denomPubHash);
        if (!denom) {
            throw Error("inconsistent database");
        }
        const allDenoms = yield tx
            .iterIndexed(Stores.denominations.exchangeBaseUrlIndex, coin.exchangeBaseUrl)
            .toArray();
        const amountLeft = Amounts.sub(Amounts.add(coin.currentAmount, Amounts.parseOrThrow(r.refund_amount))
            .amount, denom.feeRefund).amount;
        const totalRefreshCostBound = getTotalRefreshCost(allDenoms, denom, amountLeft);
        p.refunds[refundKey] = {
            type: "pending" /* Pending */,
            executionTime: r.execution_time,
            refundAmount: Amounts.parseOrThrow(r.refund_amount),
            refundFee: denom.feeRefund,
            totalRefreshCostBound,
        };
    });
}
function acceptRefunds(ws, proposalId, refunds, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        logger$9.trace("handling refunds", refunds);
        const now = getTimestampNow();
        yield ws.db.runWithWriteTransaction([
            Stores.purchases,
            Stores.coins,
            Stores.denominations,
            Stores.refreshGroups,
            Stores.refundEvents,
        ], (tx) => __awaiter(this, void 0, void 0, function* () {
            const p = yield tx.get(Stores.purchases, proposalId);
            if (!p) {
                console.error("purchase not found, not adding refunds");
                return;
            }
            const refreshCoinsMap = {};
            for (const refundStatus of refunds) {
                const refundKey = getRefundKey(refundStatus);
                const existingRefundInfo = p.refunds[refundKey];
                // Already failed.
                if ((existingRefundInfo === null || existingRefundInfo === void 0 ? void 0 : existingRefundInfo.type) === "failed" /* Failed */) {
                    continue;
                }
                // Already applied.
                if ((existingRefundInfo === null || existingRefundInfo === void 0 ? void 0 : existingRefundInfo.type) === "applied" /* Applied */) {
                    continue;
                }
                // Still pending.
                if (refundStatus.type === "failure" &&
                    (existingRefundInfo === null || existingRefundInfo === void 0 ? void 0 : existingRefundInfo.type) === "pending" /* Pending */) {
                    continue;
                }
                // Invariant: (!existingRefundInfo) || (existingRefundInfo === Pending)
                if (refundStatus.type === "success") {
                    yield applySuccessfulRefund(tx, p, refreshCoinsMap, refundStatus);
                }
                else {
                    yield storePendingRefund(tx, p, refundStatus);
                }
            }
            const refreshCoinsPubs = Object.values(refreshCoinsMap);
            yield createRefreshGroup(ws, tx, refreshCoinsPubs, "refund" /* Refund */);
            // Are we done with querying yet, or do we need to do another round
            // after a retry delay?
            let queryDone = true;
            if (p.autoRefundDeadline && p.autoRefundDeadline.t_ms > now.t_ms) {
                queryDone = false;
            }
            let numPendingRefunds = 0;
            for (const ri of Object.values(p.refunds)) {
                switch (ri.type) {
                    case "pending" /* Pending */:
                        numPendingRefunds++;
                        break;
                }
            }
            if (numPendingRefunds > 0) {
                queryDone = false;
            }
            if (queryDone) {
                p.timestampLastRefundStatus = now;
                p.lastRefundStatusError = undefined;
                p.refundStatusRetryInfo = initRetryInfo(false);
                p.refundStatusRequested = false;
                logger$9.trace("refund query done");
            }
            else {
                // No error, but we need to try again!
                p.timestampLastRefundStatus = now;
                p.refundStatusRetryInfo.retryCounter++;
                updateRetryInfoTimeout(p.refundStatusRetryInfo);
                p.lastRefundStatusError = undefined;
                logger$9.trace("refund query not done");
            }
            yield tx.put(Stores.purchases, p);
        }));
        ws.notify({
            type: "refund-queried" /* RefundQueried */,
        });
    });
}
/**
 * Accept a refund, return the contract hash for the contract
 * that was involved in the refund.
 */
function applyRefund(ws, talerRefundUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const parseResult = parseRefundUri(talerRefundUri);
        logger$9.trace("applying refund", parseResult);
        if (!parseResult) {
            throw Error("invalid refund URI");
        }
        let purchase = yield ws.db.getIndexed(Stores.purchases.orderIdIndex, [
            parseResult.merchantBaseUrl,
            parseResult.orderId,
        ]);
        if (!purchase) {
            throw Error(`no purchase for the taler://refund/ URI (${talerRefundUri}) was found`);
        }
        const proposalId = purchase.proposalId;
        logger$9.info("processing purchase for refund");
        const success = yield ws.db.runWithWriteTransaction([Stores.purchases], (tx) => __awaiter(this, void 0, void 0, function* () {
            const p = yield tx.get(Stores.purchases, proposalId);
            if (!p) {
                logger$9.error("no purchase found for refund URL");
                return false;
            }
            p.refundStatusRequested = true;
            p.lastRefundStatusError = undefined;
            p.refundStatusRetryInfo = initRetryInfo();
            yield tx.put(Stores.purchases, p);
            return true;
        }));
        if (success) {
            ws.notify({
                type: "refund-started" /* RefundStarted */,
            });
            yield processPurchaseQueryRefund(ws, proposalId);
        }
        purchase = yield ws.db.get(Stores.purchases, proposalId);
        if (!purchase) {
            throw Error("purchase no longer exists");
        }
        const p = purchase;
        let amountRefundGranted = Amounts.getZero(purchase.contractData.amount.currency);
        let amountRefundGone = Amounts.getZero(purchase.contractData.amount.currency);
        let pendingAtExchange = false;
        Object.keys(purchase.refunds).forEach((rk) => {
            const refund = p.refunds[rk];
            if (refund.type === "pending" /* Pending */) {
                pendingAtExchange = true;
            }
            if (refund.type === "applied" /* Applied */ ||
                refund.type === "pending" /* Pending */) {
                amountRefundGranted = Amounts.add(amountRefundGranted, Amounts.sub(refund.refundAmount, refund.refundFee, refund.totalRefreshCostBound).amount).amount;
            }
            else {
                amountRefundGone = Amounts.add(amountRefundGone, refund.refundAmount).amount;
            }
        });
        return {
            contractTermsHash: purchase.contractData.contractTermsHash,
            proposalId: purchase.proposalId,
            amountEffectivePaid: Amounts.stringify(purchase.payCostInfo.totalCost),
            amountRefundGone: Amounts.stringify(amountRefundGone),
            amountRefundGranted: Amounts.stringify(amountRefundGranted),
            pendingAtExchange,
        };
    });
}
function processPurchaseQueryRefund(ws, proposalId, forceNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const onOpErr = (e) => incrementPurchaseQueryRefundRetry(ws, proposalId, e);
        yield guardOperationException(() => processPurchaseQueryRefundImpl(ws, proposalId, forceNow), onOpErr);
    });
}
function resetPurchaseQueryRefundRetry(ws, proposalId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(Stores.purchases, proposalId, (x) => {
            if (x.refundStatusRetryInfo.active) {
                x.refundStatusRetryInfo = initRetryInfo();
            }
            return x;
        });
    });
}
function processPurchaseQueryRefundImpl(ws, proposalId, forceNow) {
    return __awaiter(this, void 0, void 0, function* () {
        if (forceNow) {
            yield resetPurchaseQueryRefundRetry(ws, proposalId);
        }
        const purchase = yield ws.db.get(Stores.purchases, proposalId);
        if (!purchase) {
            return;
        }
        if (!purchase.refundStatusRequested) {
            return;
        }
        const requestUrl = new URL(`orders/${purchase.contractData.orderId}`, purchase.contractData.merchantBaseUrl);
        requestUrl.searchParams.set("h_contract", purchase.contractData.contractTermsHash);
        const request = yield ws.http.get(requestUrl.href);
        logger$9.trace("got json", JSON.stringify(yield request.json(), undefined, 2));
        const refundResponse = yield readSuccessResponseJsonOrThrow(request, codecForMerchantOrderStatusPaid());
        yield acceptRefunds(ws, proposalId, refundResponse.refunds);
    });
}

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
 * Create an event ID from the type and the primary key for the event.
 */
function makeEventId(type, ...args) {
    return type + ";" + args.map((x) => encodeURIComponent(x)).join(";");
}
function shouldSkipCurrency(transactionsRequest, currency) {
    if (!(transactionsRequest === null || transactionsRequest === void 0 ? void 0 : transactionsRequest.currency)) {
        return false;
    }
    return transactionsRequest.currency.toLowerCase() !== currency.toLowerCase();
}
function shouldSkipSearch(transactionsRequest, fields) {
    if (!(transactionsRequest === null || transactionsRequest === void 0 ? void 0 : transactionsRequest.search)) {
        return false;
    }
    const needle = transactionsRequest.search.trim();
    for (const f of fields) {
        if (f.indexOf(needle) >= 0) {
            return false;
        }
    }
    return true;
}
/**
 * Retrive the full event history for this wallet.
 */
function getTransactions(ws, transactionsRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        const transactions = [];
        yield ws.db.runWithReadTransaction([
            Stores.currencies,
            Stores.coins,
            Stores.denominations,
            Stores.exchanges,
            Stores.proposals,
            Stores.purchases,
            Stores.refreshGroups,
            Stores.reserves,
            Stores.reserveHistory,
            Stores.tips,
            Stores.withdrawalGroups,
            Stores.payEvents,
            Stores.planchets,
            Stores.refundEvents,
            Stores.reserveUpdatedEvents,
            Stores.recoupGroups,
        ], 
        // Report withdrawals that are currently in progress.
        (tx) => __awaiter(this, void 0, void 0, function* () {
            tx.iter(Stores.withdrawalGroups).forEachAsync((wsr) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                if (shouldSkipCurrency(transactionsRequest, wsr.rawWithdrawalAmount.currency)) {
                    return;
                }
                if (shouldSkipSearch(transactionsRequest, [])) {
                    return;
                }
                switch (wsr.source.type) {
                    case "reserve" /* Reserve */:
                        {
                            const r = yield tx.get(Stores.reserves, wsr.source.reservePub);
                            if (!r) {
                                break;
                            }
                            let amountRaw = undefined;
                            if (wsr.withdrawalGroupId === r.initialWithdrawalGroupId) {
                                amountRaw = r.instructedAmount;
                            }
                            else {
                                amountRaw = wsr.denomsSel.totalWithdrawCost;
                            }
                            let withdrawalDetails;
                            if (r.bankInfo) {
                                withdrawalDetails = {
                                    type: "taler-bank-integration-api" /* TalerBankIntegrationApi */,
                                    confirmed: true,
                                    bankConfirmationUrl: r.bankInfo.confirmUrl,
                                };
                            }
                            else {
                                const exchange = yield tx.get(Stores.exchanges, r.exchangeBaseUrl);
                                if (!exchange) {
                                    // FIXME: report somehow
                                    break;
                                }
                                withdrawalDetails = {
                                    type: "manual-transfer" /* ManualTransfer */,
                                    exchangePaytoUris: (_b = (_a = exchange.wireInfo) === null || _a === void 0 ? void 0 : _a.accounts.map((x) => x.payto_uri)) !== null && _b !== void 0 ? _b : [],
                                };
                            }
                            transactions.push({
                                type: "withdrawal" /* Withdrawal */,
                                amountEffective: Amounts.stringify(wsr.denomsSel.totalCoinValue),
                                amountRaw: Amounts.stringify(amountRaw),
                                withdrawalDetails,
                                exchangeBaseUrl: wsr.exchangeBaseUrl,
                                pending: !wsr.timestampFinish,
                                timestamp: wsr.timestampStart,
                                transactionId: makeEventId("withdrawal" /* Withdrawal */, wsr.withdrawalGroupId),
                            });
                        }
                        break;
                }
            }));
            // Report pending withdrawals based on reserves that
            // were created, but where the actual withdrawal group has
            // not started yet.
            tx.iter(Stores.reserves).forEachAsync((r) => __awaiter(this, void 0, void 0, function* () {
                if (shouldSkipCurrency(transactionsRequest, r.currency)) {
                    return;
                }
                if (shouldSkipSearch(transactionsRequest, [])) {
                    return;
                }
                if (r.initialWithdrawalStarted) {
                    return;
                }
                let withdrawalDetails;
                if (r.bankInfo) {
                    withdrawalDetails = {
                        type: "taler-bank-integration-api" /* TalerBankIntegrationApi */,
                        confirmed: false,
                        bankConfirmationUrl: r.bankInfo.confirmUrl,
                    };
                }
                else {
                    withdrawalDetails = {
                        type: "manual-transfer" /* ManualTransfer */,
                        exchangePaytoUris: yield getFundingPaytoUris(tx, r.reservePub),
                    };
                }
                transactions.push({
                    type: "withdrawal" /* Withdrawal */,
                    amountRaw: Amounts.stringify(r.instructedAmount),
                    amountEffective: Amounts.stringify(r.initialDenomSel.totalCoinValue),
                    exchangeBaseUrl: r.exchangeBaseUrl,
                    pending: true,
                    timestamp: r.timestampCreated,
                    withdrawalDetails: withdrawalDetails,
                    transactionId: makeEventId("withdrawal" /* Withdrawal */, r.initialWithdrawalGroupId),
                });
            }));
            tx.iter(Stores.purchases).forEachAsync((pr) => __awaiter(this, void 0, void 0, function* () {
                if (shouldSkipCurrency(transactionsRequest, pr.contractData.amount.currency)) {
                    return;
                }
                if (shouldSkipSearch(transactionsRequest, [pr.contractData.summary])) {
                    return;
                }
                const proposal = yield tx.get(Stores.proposals, pr.proposalId);
                if (!proposal) {
                    return;
                }
                const info = {
                    fulfillmentUrl: pr.contractData.fulfillmentUrl,
                    merchant: pr.contractData.merchant,
                    orderId: pr.contractData.orderId,
                    products: pr.contractData.products,
                    summary: pr.contractData.summary,
                    summary_i18n: pr.contractData.summaryI18n,
                };
                const paymentTransactionId = makeEventId("payment" /* Payment */, pr.proposalId);
                transactions.push({
                    type: "payment" /* Payment */,
                    amountRaw: Amounts.stringify(pr.contractData.amount),
                    amountEffective: Amounts.stringify(pr.payCostInfo.totalCost),
                    status: pr.timestampFirstSuccessfulPay
                        ? "paid" /* Paid */
                        : "accepted" /* Accepted */,
                    pending: !pr.timestampFirstSuccessfulPay,
                    timestamp: pr.timestampAccept,
                    transactionId: paymentTransactionId,
                    info: info,
                });
                const refundGroupKeys = new Set();
                for (const rk of Object.keys(pr.refunds)) {
                    const refund = pr.refunds[rk];
                    const groupKey = `${refund.executionTime.t_ms}`;
                    refundGroupKeys.add(groupKey);
                }
                refundGroupKeys.forEach((groupKey) => {
                    const refundTransactionId = makeEventId("payment" /* Payment */, pr.proposalId, groupKey);
                    let r0;
                    let amountEffective = Amounts.getZero(pr.contractData.amount.currency);
                    let amountRaw = Amounts.getZero(pr.contractData.amount.currency);
                    for (const rk of Object.keys(pr.refunds)) {
                        const refund = pr.refunds[rk];
                        if (!r0) {
                            r0 = refund;
                        }
                        if (refund.type === "applied" /* Applied */) {
                            amountEffective = Amounts.add(amountEffective, refund.refundAmount).amount;
                            amountRaw = Amounts.add(amountRaw, Amounts.sub(refund.refundAmount, refund.refundFee, refund.totalRefreshCostBound).amount).amount;
                        }
                    }
                    if (!r0) {
                        throw Error("invariant violated");
                    }
                    transactions.push({
                        type: "refund" /* Refund */,
                        info,
                        refundedTransactionId: paymentTransactionId,
                        transactionId: refundTransactionId,
                        timestamp: r0.executionTime,
                        amountEffective: Amounts.stringify(amountEffective),
                        amountRaw: Amounts.stringify(amountRaw),
                        pending: false,
                    });
                });
                // for (const rg of pr.refundGroups) {
                //   const pending = Object.keys(pr.refundsPending).length > 0;
                //   const stats = getRefundStats(pr, rg.refundGroupId);
                //   transactions.push({
                //     type: TransactionType.Refund,
                //     pending,
                //     info: {
                //       fulfillmentUrl: pr.contractData.fulfillmentUrl,
                //       merchant: pr.contractData.merchant,
                //       orderId: pr.contractData.orderId,
                //       products: pr.contractData.products,
                //       summary: pr.contractData.summary,
                //       summary_i18n: pr.contractData.summaryI18n,
                //     },
                //     timestamp: rg.timestampQueried,
                //     transactionId: makeEventId(
                //       TransactionType.Refund,
                //       pr.proposalId,
                //       `${rg.timestampQueried.t_ms}`,
                //     ),
                //     refundedTransactionId: makeEventId(
                //       TransactionType.Payment,
                //       pr.proposalId,
                //     ),
                //     amountEffective: Amounts.stringify(stats.amountEffective),
                //     amountInvalid: Amounts.stringify(stats.amountInvalid),
                //     amountRaw: Amounts.stringify(stats.amountRaw),
                //   });
                // }
            }));
        }));
        const txPending = transactions.filter((x) => x.pending);
        const txNotPending = transactions.filter((x) => !x.pending);
        txPending.sort((h1, h2) => timestampCmp(h1.timestamp, h2.timestamp));
        txNotPending.sort((h1, h2) => timestampCmp(h1.timestamp, h2.timestamp));
        return { transactions: [...txPending, ...txNotPending] };
    });
}

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
const logger$a = new Logger("operations/testing.ts");
/**
 * Generate a random alphanumeric ID.  Does *not* use cryptographically
 * secure randomness.
 */
function makeId(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
/**
 * Helper function to generate the "Authorization" HTTP header.
 */
function makeAuth(username, password) {
    const auth = `${username}:${password}`;
    const authEncoded = Buffer.from(auth).toString("base64");
    return `Basic ${authEncoded}`;
}
function withdrawTestBalance(ws, amount = "TESTKUDOS:10", bankBaseUrl = "https://bank.test.taler.net/", exchangeBaseUrl = "https://exchange.test.taler.net/") {
    return __awaiter(this, void 0, void 0, function* () {
        const bankUser = yield registerRandomBankUser(ws.http, bankBaseUrl);
        logger$a.trace(`Registered bank user ${JSON.stringify(bankUser)}`);
        const wresp = yield createBankWithdrawalUri(ws.http, bankBaseUrl, bankUser, amount);
        yield createTalerWithdrawReserve(ws, wresp.taler_withdraw_uri, exchangeBaseUrl);
        yield confirmBankWithdrawalUri(ws.http, bankBaseUrl, bankUser, wresp.withdrawal_id);
    });
}
function createBankWithdrawalUri(http, bankBaseUrl, bankUser, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqUrl = new URL(`accounts/${bankUser.username}/withdrawals`, bankBaseUrl).href;
        const resp = yield http.postJson(reqUrl, {
            amount,
        }, {
            headers: {
                Authorization: makeAuth(bankUser.username, bankUser.password),
            },
        });
        const respJson = yield readSuccessResponseJsonOrThrow(resp, codecForAny);
        return respJson;
    });
}
function confirmBankWithdrawalUri(http, bankBaseUrl, bankUser, withdrawalId) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqUrl = new URL(`accounts/${bankUser.username}/withdrawals/${withdrawalId}/confirm`, bankBaseUrl).href;
        const resp = yield http.postJson(reqUrl, {}, {
            headers: {
                Authorization: makeAuth(bankUser.username, bankUser.password),
            },
        });
        yield readSuccessResponseJsonOrThrow(resp, codecForAny);
        return;
    });
}
function registerRandomBankUser(http, bankBaseUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqUrl = new URL("testing/register", bankBaseUrl).href;
        const randId = makeId(8);
        const bankUser = {
            username: `testuser-${randId}`,
            password: `testpw-${randId}`,
        };
        const resp = yield http.postJson(reqUrl, bankUser);
        yield checkSuccessResponseOrThrow(resp);
        return bankUser;
    });
}

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
const builtinCurrencies = [
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
const logger$b = new Logger("wallet.ts");
/**
 * The platform-independent wallet implementation.
 */
class Wallet {
    constructor(db, http, cryptoWorkerFactory) {
        this.timerGroup = new TimerGroup();
        this.latch = new AsyncCondition();
        this.stopped = false;
        this.memoRunRetryLoop = new AsyncOpMemoSingle();
        this.ws = new InternalWalletState(db, http, cryptoWorkerFactory);
    }
    get db() {
        return this.ws.db;
    }
    getExchangePaytoUri(exchangeBaseUrl, supportedTargetTypes) {
        return getExchangePaytoUri(this.ws, exchangeBaseUrl, supportedTargetTypes);
    }
    getWithdrawalDetailsForAmount(exchangeBaseUrl, amount) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const wi = yield getExchangeWithdrawalInfo(this.ws, exchangeBaseUrl, amount);
            const paytoUris = (_a = wi.exchangeInfo.wireInfo) === null || _a === void 0 ? void 0 : _a.accounts.map((x) => x.payto_uri);
            if (!paytoUris) {
                throw Error("exchange is in invalid state");
            }
            return {
                amountRaw: Amounts.stringify(amount),
                amountEffective: Amounts.stringify(wi.selectedDenoms.totalCoinValue),
                paytoUris,
                tosAccepted: wi.termsOfServiceAccepted,
            };
        });
    }
    addNotificationListener(f) {
        this.ws.addNotificationListener(f);
    }
    /**
     * Execute one operation based on the pending operation info record.
     */
    processOnePendingOperation(pending, forceNow = false) {
        return __awaiter(this, void 0, void 0, function* () {
            logger$b.trace(`running pending ${JSON.stringify(pending, undefined, 2)}`);
            switch (pending.type) {
                case "bug" /* Bug */:
                    // Nothing to do, will just be displayed to the user
                    return;
                case "exchange-update" /* ExchangeUpdate */:
                    yield updateExchangeFromUrl(this.ws, pending.exchangeBaseUrl, forceNow);
                    break;
                case "refresh" /* Refresh */:
                    yield processRefreshGroup(this.ws, pending.refreshGroupId, forceNow);
                    break;
                case "reserve" /* Reserve */:
                    yield processReserve(this.ws, pending.reservePub, forceNow);
                    break;
                case "withdraw" /* Withdraw */:
                    yield processWithdrawGroup(this.ws, pending.withdrawalGroupId, forceNow);
                    break;
                case "proposal-choice" /* ProposalChoice */:
                    // Nothing to do, user needs to accept/reject
                    break;
                case "proposal-download" /* ProposalDownload */:
                    yield processDownloadProposal(this.ws, pending.proposalId, forceNow);
                    break;
                case "tip-choice" /* TipChoice */:
                    // Nothing to do, user needs to accept/reject
                    break;
                case "tip-pickup" /* TipPickup */:
                    yield processTip(this.ws, pending.tipId, forceNow);
                    break;
                case "pay" /* Pay */:
                    yield processPurchasePay(this.ws, pending.proposalId, forceNow);
                    break;
                case "refund-query" /* RefundQuery */:
                    yield processPurchaseQueryRefund(this.ws, pending.proposalId, forceNow);
                    break;
                case "recoup" /* Recoup */:
                    yield processRecoupGroup(this.ws, pending.recoupGroupId, forceNow);
                    break;
                default:
                    assertUnreachable();
            }
        });
    }
    /**
     * Process pending operations.
     */
    runPending(forceNow = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const onlyDue = !forceNow;
            const pendingOpsResponse = yield this.getPendingOperations({ onlyDue });
            for (const p of pendingOpsResponse.pendingOperations) {
                try {
                    yield this.processOnePendingOperation(p, forceNow);
                }
                catch (e) {
                    if (e instanceof OperationFailedAndReportedError) {
                        console.error("Operation failed:", JSON.stringify(e.operationError, undefined, 2));
                    }
                    else {
                        console.error(e);
                    }
                }
            }
        });
    }
    /**
     * Run the wallet until there are no more pending operations that give
     * liveness left.  The wallet will be in a stopped state when this function
     * returns without resolving to an exception.
     */
    runUntilDone() {
        return __awaiter(this, void 0, void 0, function* () {
            let done = false;
            const p = new Promise((resolve, reject) => {
                // Run this asynchronously
                this.addNotificationListener((n) => {
                    if (done) {
                        return;
                    }
                    if (n.type === "waiting-for-retry" /* WaitingForRetry */ &&
                        n.numGivingLiveness == 0) {
                        done = true;
                        logger$b.trace("no liveness-giving operations left");
                        resolve();
                    }
                });
                this.runRetryLoop().catch((e) => {
                    console.log("exception in wallet retry loop");
                    reject(e);
                });
            });
            yield p;
        });
    }
    /**
     * Run the wallet until there are no more pending operations that give
     * liveness left.  The wallet will be in a stopped state when this function
     * returns without resolving to an exception.
     */
    runUntilDoneAndStop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.runUntilDone();
            logger$b.trace("stopping after liveness-giving operations done");
            this.stop();
        });
    }
    /**
     * Process pending operations and wait for scheduled operations in
     * a loop until the wallet is stopped explicitly.
     */
    runRetryLoop() {
        return __awaiter(this, void 0, void 0, function* () {
            // Make sure we only run one main loop at a time.
            return this.memoRunRetryLoop.memo(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.runRetryLoopImpl();
                }
                catch (e) {
                    console.error("error during retry loop execution", e);
                    throw e;
                }
            }));
        });
    }
    runRetryLoopImpl() {
        return __awaiter(this, void 0, void 0, function* () {
            while (!this.stopped) {
                const pending = yield this.getPendingOperations({ onlyDue: true });
                if (pending.pendingOperations.length === 0) {
                    const allPending = yield this.getPendingOperations({ onlyDue: false });
                    let numPending = 0;
                    let numGivingLiveness = 0;
                    for (const p of allPending.pendingOperations) {
                        numPending++;
                        if (p.givesLifeness) {
                            numGivingLiveness++;
                        }
                    }
                    let dt;
                    if (allPending.pendingOperations.length === 0 ||
                        allPending.nextRetryDelay.d_ms === Number.MAX_SAFE_INTEGER) {
                        // Wait for 5 seconds
                        dt = { d_ms: 5000 };
                    }
                    else {
                        dt = durationMin({ d_ms: 5000 }, allPending.nextRetryDelay);
                    }
                    const timeout = this.timerGroup.resolveAfter(dt);
                    this.ws.notify({
                        type: "waiting-for-retry" /* WaitingForRetry */,
                        numGivingLiveness,
                        numPending,
                    });
                    yield Promise.race([timeout, this.latch.wait()]);
                    console.log("timeout done");
                }
                else {
                    // FIXME: maybe be a bit smarter about executing these
                    // operations in parallel?
                    for (const p of pending.pendingOperations) {
                        try {
                            yield this.processOnePendingOperation(p);
                        }
                        catch (e) {
                            if (e instanceof OperationFailedAndReportedError) {
                                logger$b.warn("operation processed resulted in reported error");
                            }
                            else {
                                console.error("Uncaught exception", e);
                                this.ws.notify({
                                    type: "internal-error" /* InternalError */,
                                    message: "uncaught exception",
                                    exception: e,
                                });
                            }
                        }
                        this.ws.notify({
                            type: "pending-operation-processed" /* PendingOperationProcessed */,
                        });
                    }
                }
            }
            logger$b.trace("exiting wallet retry loop");
        });
    }
    /**
     * Insert the hard-coded defaults for exchanges, coins and
     * auditors into the database, unless these defaults have
     * already been applied.
     */
    fillDefaults() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.runWithWriteTransaction([Stores.config, Stores.currencies], (tx) => __awaiter(this, void 0, void 0, function* () {
                let applied = false;
                yield tx.iter(Stores.config).forEach((x) => {
                    if (x.key == "currencyDefaultsApplied" && x.value == true) {
                        applied = true;
                    }
                });
                if (!applied) {
                    for (const c of builtinCurrencies) {
                        yield tx.put(Stores.currencies, c);
                    }
                }
            }));
        });
    }
    /**
     * Check if a payment for the given taler://pay/ URI is possible.
     *
     * If the payment is possible, the signature are already generated but not
     * yet send to the merchant.
     */
    preparePayForUri(talerPayUri) {
        return __awaiter(this, void 0, void 0, function* () {
            return preparePayForUri(this.ws, talerPayUri);
        });
    }
    /**
     * Add a contract to the wallet and sign coins, and send them.
     */
    confirmPay(proposalId, sessionIdOverride) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield confirmPay(this.ws, proposalId, sessionIdOverride);
            }
            finally {
                this.latch.trigger();
            }
        });
    }
    /**
     * First fetch information requred to withdraw from the reserve,
     * then deplete the reserve, withdrawing coins until it is empty.
     *
     * The returned promise resolves once the reserve is set to the
     * state DORMANT.
     */
    processReserve(reservePub) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield processReserve(this.ws, reservePub);
            }
            finally {
                this.latch.trigger();
            }
        });
    }
    /**
     * Create a reserve, but do not flag it as confirmed yet.
     *
     * Adds the corresponding exchange as a trusted exchange if it is neither
     * audited nor trusted already.
     */
    acceptManualWithdrawal(exchangeBaseUrl, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield createReserve(this.ws, {
                    amount,
                    exchange: exchangeBaseUrl,
                });
                const exchangePaytoUris = yield this.db.runWithReadTransaction([Stores.exchanges, Stores.reserves], (tx) => getFundingPaytoUris(tx, resp.reservePub));
                return {
                    reservePub: resp.reservePub,
                    exchangePaytoUris,
                };
            }
            finally {
                this.latch.trigger();
            }
        });
    }
    /**
     * Check if and how an exchange is trusted and/or audited.
     */
    getExchangeTrust(exchangeInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return getExchangeTrust(this.ws, exchangeInfo);
        });
    }
    getWithdrawalDetailsForUri(talerWithdrawUri) {
        return __awaiter(this, void 0, void 0, function* () {
            return getWithdrawalDetailsForUri(this.ws, talerWithdrawUri);
        });
    }
    /**
     * Update or add exchange DB entry by fetching the /keys and /wire information.
     * Optionally link the reserve entry to the new or existing
     * exchange entry in then DB.
     */
    updateExchangeFromUrl(baseUrl, force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return updateExchangeFromUrl(this.ws, baseUrl, force);
            }
            finally {
                this.latch.trigger();
            }
        });
    }
    getExchangeTos(exchangeBaseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const exchange = yield this.updateExchangeFromUrl(exchangeBaseUrl);
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
        });
    }
    /**
     * Get detailed balance information, sliced by exchange and by currency.
     */
    getBalances() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ws.memoGetBalance.memo(() => getBalances(this.ws));
        });
    }
    refresh(oldCoinPub) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshGroupId = yield this.db.runWithWriteTransaction([Stores.refreshGroups], (tx) => __awaiter(this, void 0, void 0, function* () {
                    return yield createRefreshGroup(this.ws, tx, [{ coinPub: oldCoinPub }], "manual" /* Manual */);
                }));
                yield processRefreshGroup(this.ws, refreshGroupId.refreshGroupId);
            }
            catch (e) {
                this.latch.trigger();
            }
        });
    }
    findExchange(exchangeBaseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.get(Stores.exchanges, exchangeBaseUrl);
        });
    }
    getPendingOperations({ onlyDue = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ws.memoGetPending.memo(() => getPendingOperations(this.ws, { onlyDue }));
        });
    }
    acceptExchangeTermsOfService(exchangeBaseUrl, etag) {
        return __awaiter(this, void 0, void 0, function* () {
            return acceptExchangeTermsOfService(this.ws, exchangeBaseUrl, etag);
        });
    }
    getDenoms(exchangeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const denoms = yield this.db
                .iterIndex(Stores.denominations.exchangeBaseUrlIndex, exchangeUrl)
                .toArray();
            return denoms;
        });
    }
    /**
     * Get all exchanges known to the exchange.
     *
     * @deprecated Use getExchanges instead
     */
    getExchangeRecords() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.iter(Stores.exchanges).toArray();
        });
    }
    getExchanges() {
        return __awaiter(this, void 0, void 0, function* () {
            const exchanges = yield this.db
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
                exchanges: exchanges.filter((x) => !!x),
            };
        });
    }
    getCurrencies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.iter(Stores.currencies).toArray();
        });
    }
    updateCurrency(currencyRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            logger$b.trace("updating currency to", currencyRecord);
            yield this.db.put(Stores.currencies, currencyRecord);
        });
    }
    getReserves(exchangeBaseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (exchangeBaseUrl) {
                return yield this.db
                    .iter(Stores.reserves)
                    .filter((r) => r.exchangeBaseUrl === exchangeBaseUrl);
            }
            else {
                return yield this.db.iter(Stores.reserves).toArray();
            }
        });
    }
    getCoinsForExchange(exchangeBaseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .iter(Stores.coins)
                .filter((c) => c.exchangeBaseUrl === exchangeBaseUrl);
        });
    }
    getCoins() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.iter(Stores.coins).toArray();
        });
    }
    /**
     * Stop ongoing processing.
     */
    stop() {
        this.stopped = true;
        this.timerGroup.stopCurrentAndFutureTimers();
        this.ws.cryptoApi.stop();
    }
    getSenderWireInfos() {
        return __awaiter(this, void 0, void 0, function* () {
            const m = {};
            yield this.db.iter(Stores.exchanges).forEach((x) => {
                const wi = x.wireInfo;
                if (!wi) {
                    return;
                }
                const s = (m[x.baseUrl] = m[x.baseUrl] || new Set());
                Object.keys(wi.feesForType).map((k) => s.add(k));
            });
            const exchangeWireTypes = {};
            Object.keys(m).map((e) => {
                exchangeWireTypes[e] = Array.from(m[e]);
            });
            const senderWiresSet = new Set();
            yield this.db.iter(Stores.senderWires).forEach((x) => {
                senderWiresSet.add(x.paytoUri);
            });
            const senderWires = Array.from(senderWiresSet);
            return {
                exchangeWireTypes,
                senderWires,
            };
        });
    }
    /**
     * Trigger paying coins back into the user's account.
     */
    returnCoins(req) {
        return __awaiter(this, void 0, void 0, function* () {
            throw Error("not implemented");
        });
    }
    /**
     * Accept a refund, return the contract hash for the contract
     * that was involved in the refund.
     */
    applyRefund(talerRefundUri) {
        return __awaiter(this, void 0, void 0, function* () {
            return applyRefund(this.ws, talerRefundUri);
        });
    }
    getPurchase(contractTermsHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.get(Stores.purchases, contractTermsHash);
        });
    }
    acceptTip(talerTipUri) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return acceptTip(this.ws, talerTipUri);
            }
            catch (e) {
                this.latch.trigger();
            }
        });
    }
    getTipStatus(talerTipUri) {
        return __awaiter(this, void 0, void 0, function* () {
            return getTipStatus(this.ws, talerTipUri);
        });
    }
    abortFailedPayment(contractTermsHash) {
        return __awaiter(this, void 0, void 0, function* () {
            throw Error("not implemented");
        });
    }
    /**
     * Inform the wallet that the status of a reserve has changed (e.g. due to a
     * confirmation from the bank.).
     */
    handleNotifyReserve() {
        return __awaiter(this, void 0, void 0, function* () {
            const reserves = yield this.db.iter(Stores.reserves).toArray();
            for (const r of reserves) {
                if (r.reserveStatus === ReserveRecordStatus.WAIT_CONFIRM_BANK) {
                    try {
                        this.processReserve(r.reservePub);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
        });
    }
    /**
     * Remove unreferenced / expired data from the wallet's database
     * based on the current system time.
     */
    collectGarbage() {
        return __awaiter(this, void 0, void 0, function* () {
            // FIXME(#5845)
            // We currently do not garbage-collect the wallet database.  This might change
            // after the feature has been properly re-designed, and we have come up with a
            // strategy to test it.
        });
    }
    acceptWithdrawal(talerWithdrawUri, selectedExchange) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return createTalerWithdrawReserve(this.ws, talerWithdrawUri, selectedExchange);
            }
            finally {
                this.latch.trigger();
            }
        });
    }
    updateReserve(reservePub) {
        return __awaiter(this, void 0, void 0, function* () {
            yield forceQueryReserve(this.ws, reservePub);
            return yield this.ws.db.get(Stores.reserves, reservePub);
        });
    }
    getReserve(reservePub) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ws.db.get(Stores.reserves, reservePub);
        });
    }
    refuseProposal(proposalId) {
        return __awaiter(this, void 0, void 0, function* () {
            return refuseProposal(this.ws, proposalId);
        });
    }
    getPurchaseDetails(proposalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchase = yield this.db.get(Stores.purchases, proposalId);
            if (!purchase) {
                throw Error("unknown purchase");
            }
            const refundsDoneAmounts = Object.values(purchase.refunds)
                .filter((x) => x.type === "applied" /* Applied */)
                .map((x) => x.refundAmount);
            const refundsPendingAmounts = Object.values(purchase.refunds)
                .filter((x) => x.type === "pending" /* Pending */)
                .map((x) => x.refundAmount);
            const totalRefundAmount = Amounts.sum([
                ...refundsDoneAmounts,
                ...refundsPendingAmounts,
            ]).amount;
            const refundsDoneFees = Object.values(purchase.refunds)
                .filter((x) => x.type === "applied" /* Applied */)
                .map((x) => x.refundFee);
            const refundsPendingFees = Object.values(purchase.refunds)
                .filter((x) => x.type === "pending" /* Pending */)
                .map((x) => x.refundFee);
            const totalRefundFees = Amounts.sum([
                ...refundsDoneFees,
                ...refundsPendingFees,
            ]).amount;
            const totalFees = totalRefundFees;
            return {
                contractTerms: JSON.parse(purchase.contractTermsRaw),
                hasRefund: purchase.timestampLastRefundStatus !== undefined,
                totalRefundAmount: totalRefundAmount,
                totalRefundAndRefreshFees: totalFees,
            };
        });
    }
    benchmarkCrypto(repetitions) {
        return this.ws.cryptoApi.benchmark(repetitions);
    }
    setCoinSuspended(coinPub, suspended) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.runWithWriteTransaction([Stores.coins], (tx) => __awaiter(this, void 0, void 0, function* () {
                const c = yield tx.get(Stores.coins, coinPub);
                if (!c) {
                    logger$b.warn(`coin ${coinPub} not found, won't suspend`);
                    return;
                }
                c.suspended = suspended;
                yield tx.put(Stores.coins, c);
            }));
        });
    }
    /**
     * Dump the public information of coins we have in an easy-to-process format.
     */
    dumpCoins() {
        return __awaiter(this, void 0, void 0, function* () {
            const coins = yield this.db.iter(Stores.coins).toArray();
            const coinsJson = { coins: [] };
            for (const c of coins) {
                const denom = yield this.db.get(Stores.denominations, [
                    c.exchangeBaseUrl,
                    c.denomPub,
                ]);
                if (!denom) {
                    console.error("no denom session found for coin");
                    continue;
                }
                const cs = c.coinSource;
                let refreshParentCoinPub;
                if (cs.type == "refresh" /* Refresh */) {
                    refreshParentCoinPub = cs.oldCoinPub;
                }
                let withdrawalReservePub;
                if (cs.type == "withdraw" /* Withdraw */) {
                    const ws = yield this.db.get(Stores.withdrawalGroups, cs.withdrawalGroupId);
                    if (!ws) {
                        console.error("no withdrawal session found for coin");
                        continue;
                    }
                    if (ws.source.type == "reserve") {
                        withdrawalReservePub = ws.source.reservePub;
                    }
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
        });
    }
    getTransactions(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return getTransactions(this.ws, request);
        });
    }
    withdrawTestBalance(amount = "TESTKUDOS:10", bankBaseUrl = "https://bank.test.taler.net/", exchangeBaseUrl = "https://exchange.test.taler.net/") {
        return __awaiter(this, void 0, void 0, function* () {
            yield withdrawTestBalance(this.ws, amount, bankBaseUrl, exchangeBaseUrl);
        });
    }
}

/*
 Copyright 2017 Jeremy Scheff

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */
/* tslint:disable: max-classes-per-file max-line-length */
const messages = {
    AbortError: "A request was aborted, for example through a call to IDBTransaction.abort.",
    ConstraintError: "A mutation operation in the transaction failed because a constraint was not satisfied. For example, an object such as an object store or index already exists and a request attempted to create a new one.",
    DataCloneError: "The data being stored could not be cloned by the internal structured cloning algorithm.",
    DataError: "Data provided to an operation does not meet requirements.",
    InvalidAccessError: "An invalid operation was performed on an object. For example transaction creation attempt was made, but an empty scope was provided.",
    InvalidStateError: "An operation was called on an object on which it is not allowed or at a time when it is not allowed. Also occurs if a request is made on a source object that has been deleted or removed. Use TransactionInactiveError or ReadOnlyError when possible, as they are more specific variations of InvalidStateError.",
    NotFoundError: "The operation failed because the requested database object could not be found. For example, an object store did not exist but was being opened.",
    ReadOnlyError: 'The mutating operation was attempted in a "readonly" transaction.',
    TransactionInactiveError: "A request was placed against a transaction which is currently not active, or which is finished.",
    VersionError: "An attempt was made to open a database using a lower version than the existing version.",
};
class AbortError extends Error {
    constructor(message = messages.AbortError) {
        super();
        Object.setPrototypeOf(this, ConstraintError.prototype);
        this.name = "AbortError";
        this.message = message;
    }
}
class ConstraintError extends Error {
    constructor(message = messages.ConstraintError) {
        super();
        Object.setPrototypeOf(this, ConstraintError.prototype);
        this.name = "ConstraintError";
        this.message = message;
    }
}
class DataError extends Error {
    constructor(message = messages.DataError) {
        super();
        Object.setPrototypeOf(this, DataError.prototype);
        this.name = "DataError";
        this.message = message;
    }
}
class InvalidAccessError extends Error {
    constructor(message = messages.InvalidAccessError) {
        super();
        Object.setPrototypeOf(this, InvalidAccessError.prototype);
        this.name = "InvalidAccessError";
        this.message = message;
    }
}
class InvalidStateError extends Error {
    constructor(message = messages.InvalidStateError) {
        super();
        Object.setPrototypeOf(this, InvalidStateError.prototype);
        this.name = "InvalidStateError";
        this.message = message;
    }
}
class NotFoundError extends Error {
    constructor(message = messages.NotFoundError) {
        super();
        Object.setPrototypeOf(this, NotFoundError.prototype);
        this.name = "NotFoundError";
        this.message = message;
    }
}
class ReadOnlyError extends Error {
    constructor(message = messages.ReadOnlyError) {
        super();
        Object.setPrototypeOf(this, ReadOnlyError.prototype);
        this.name = "ReadOnlyError";
        this.message = message;
    }
}
class TransactionInactiveError extends Error {
    constructor(message = messages.TransactionInactiveError) {
        super();
        Object.setPrototypeOf(this, TransactionInactiveError.prototype);
        this.name = "TransactionInactiveError";
        this.message = message;
    }
}
class VersionError extends Error {
    constructor(message = messages.VersionError) {
        super();
        Object.setPrototypeOf(this, VersionError.prototype);
        this.name = "VersionError";
        this.message = message;
    }
}

/*
 Copyright 2017 Jeremy Scheff

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */
// https://w3c.github.io/IndexedDB/#convert-a-value-to-a-input
function valueToKey(input, seen) {
    if (typeof input === "number") {
        if (isNaN(input)) {
            throw new DataError();
        }
        return input;
    }
    else if (input instanceof Date) {
        const ms = input.valueOf();
        if (isNaN(ms)) {
            throw new DataError();
        }
        return new Date(ms);
    }
    else if (typeof input === "string") {
        return input;
    }
    else if (input instanceof ArrayBuffer ||
        (typeof ArrayBuffer !== "undefined" &&
            ArrayBuffer.isView &&
            ArrayBuffer.isView(input))) {
        if (input instanceof ArrayBuffer) {
            return new Uint8Array(input).buffer;
        }
        return new Uint8Array(input.buffer).buffer;
    }
    else if (Array.isArray(input)) {
        if (seen === undefined) {
            seen = new Set();
        }
        else if (seen.has(input)) {
            throw new DataError();
        }
        seen.add(input);
        const keys = [];
        for (let i = 0; i < input.length; i++) {
            const hop = input.hasOwnProperty(i);
            if (!hop) {
                throw new DataError();
            }
            const entry = input[i];
            const key = valueToKey(entry, seen);
            keys.push(key);
        }
        return keys;
    }
    else {
        throw new DataError();
    }
}

/*
 Copyright 2017 Jeremy Scheff

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */
const getType = (x) => {
    if (typeof x === "number") {
        return "Number";
    }
    if (x instanceof Date) {
        return "Date";
    }
    if (Array.isArray(x)) {
        return "Array";
    }
    if (typeof x === "string") {
        return "String";
    }
    if (x instanceof ArrayBuffer) {
        return "Binary";
    }
    throw new DataError();
};
// https://w3c.github.io/IndexedDB/#compare-two-keys
const compareKeys = (first, second) => {
    if (second === undefined) {
        throw new TypeError();
    }
    first = valueToKey(first);
    second = valueToKey(second);
    const t1 = getType(first);
    const t2 = getType(second);
    if (t1 !== t2) {
        if (t1 === "Array") {
            return 1;
        }
        if (t1 === "Binary" &&
            (t2 === "String" || t2 === "Date" || t2 === "Number")) {
            return 1;
        }
        if (t1 === "String" && (t2 === "Date" || t2 === "Number")) {
            return 1;
        }
        if (t1 === "Date" && t2 === "Number") {
            return 1;
        }
        return -1;
    }
    if (t1 === "Binary") {
        first = new Uint8Array(first);
        second = new Uint8Array(second);
    }
    if (t1 === "Array" || t1 === "Binary") {
        const length = Math.min(first.length, second.length);
        for (let i = 0; i < length; i++) {
            const result = compareKeys(first[i], second[i]);
            if (result !== 0) {
                return result;
            }
        }
        if (first.length > second.length) {
            return 1;
        }
        if (first.length < second.length) {
            return -1;
        }
        return 0;
    }
    if (t1 === "Date") {
        if (first.getTime() === second.getTime()) {
            return 0;
        }
    }
    else {
        if (first === second) {
            return 0;
        }
    }
    return first > second ? 1 : -1;
};

/*
  Copyright 2019 Florian Dold
  Copyright 2017 Jeremy Scheff

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
  or implied. See the License for the specific language governing
  permissions and limitations under the License.
 */
// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#range-concept
/** @public */
class BridgeIDBKeyRange {
    constructor(lower, upper, lowerOpen, upperOpen) {
        this.lower = lower;
        this.upper = upper;
        this.lowerOpen = lowerOpen;
        this.upperOpen = upperOpen;
    }
    static only(value) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        value = valueToKey(value);
        return new BridgeIDBKeyRange(value, value, false, false);
    }
    static lowerBound(lower, open = false) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        lower = valueToKey(lower);
        return new BridgeIDBKeyRange(lower, undefined, open, true);
    }
    static upperBound(upper, open = false) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        upper = valueToKey(upper);
        return new BridgeIDBKeyRange(undefined, upper, true, open);
    }
    static bound(lower, upper, lowerOpen = false, upperOpen = false) {
        if (arguments.length < 2) {
            throw new TypeError();
        }
        const cmpResult = compareKeys(lower, upper);
        if (cmpResult === 1 || (cmpResult === 0 && (lowerOpen || upperOpen))) {
            throw new DataError();
        }
        lower = valueToKey(lower);
        upper = valueToKey(upper);
        return new BridgeIDBKeyRange(lower, upper, lowerOpen, upperOpen);
    }
    // https://w3c.github.io/IndexedDB/#dom-idbkeyrange-includes
    includes(key) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        key = valueToKey(key);
        if (this.lower !== undefined) {
            const cmpResult = compareKeys(this.lower, key);
            if (cmpResult === 1 || (cmpResult === 0 && this.lowerOpen)) {
                return false;
            }
        }
        if (this.upper !== undefined) {
            const cmpResult = compareKeys(this.upper, key);
            if (cmpResult === -1 || (cmpResult === 0 && this.upperOpen)) {
                return false;
            }
        }
        return true;
    }
    toString() {
        return "[object IDBKeyRange]";
    }
    static _valueToKeyRange(value, nullDisallowedFlag = false) {
        if (value instanceof BridgeIDBKeyRange) {
            return value;
        }
        if (value === null || value === undefined) {
            if (nullDisallowedFlag) {
                throw new DataError();
            }
            return new BridgeIDBKeyRange(undefined, undefined, false, false);
        }
        const key = valueToKey(value);
        return BridgeIDBKeyRange.only(key);
    }
}

/*
 Copyright 2019 Florian Dold

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
*/
function structuredCloneImpl(val, visited) {
    // FIXME: replace with real implementation!
    return JSON.parse(JSON.stringify(val));
}
/**
 * Structured clone for IndexedDB.
 */
function structuredClone(val) {
    return structuredCloneImpl(val);
}

/*
 Copyright 2019 Florian Dold

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */
/** @public */
var ResultLevel;
(function (ResultLevel) {
    ResultLevel[ResultLevel["OnlyCount"] = 0] = "OnlyCount";
    ResultLevel[ResultLevel["OnlyKeys"] = 1] = "OnlyKeys";
    ResultLevel[ResultLevel["Full"] = 2] = "Full";
})(ResultLevel || (ResultLevel = {}));
/** @public */
var StoreLevel;
(function (StoreLevel) {
    StoreLevel[StoreLevel["NoOverwrite"] = 0] = "NoOverwrite";
    StoreLevel[StoreLevel["AllowOverwrite"] = 1] = "AllowOverwrite";
    StoreLevel[StoreLevel["UpdateExisting"] = 2] = "UpdateExisting";
})(StoreLevel || (StoreLevel = {}));

/*

 Copyright 2017 Jeremy Scheff
 Copyright 2019 Florian Dold

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */
/**
 * http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#cursor
 *
 * @public
 */
class BridgeIDBCursor {
    constructor(source, objectStoreName, indexName, range, direction, request, keyOnly) {
        this._gotValue = false;
        this._indexPosition = undefined; // Key of previously returned record
        this._objectStorePosition = undefined;
        this._key = undefined;
        this._primaryKey = undefined;
        this._value = undefined;
        this._indexName = indexName;
        this._objectStoreName = objectStoreName;
        this._range = range;
        this._source = source;
        this._direction = direction;
        this._request = request;
        this._keyOnly = keyOnly;
    }
    get _effectiveObjectStore() {
        if (this.source instanceof BridgeIDBObjectStore) {
            return this.source;
        }
        return this.source.objectStore;
    }
    get _backend() {
        return this._source._backend;
    }
    // Read only properties
    get source() {
        return this._source;
    }
    set source(val) {
        /* For babel */
    }
    get direction() {
        return this._direction;
    }
    set direction(val) {
        /* For babel */
    }
    get key() {
        return this._key;
    }
    set key(val) {
        /* For babel */
    }
    get primaryKey() {
        return this._primaryKey;
    }
    set primaryKey(val) {
        /* For babel */
    }
    get _isValueCursor() {
        return false;
    }
    /**
     * https://w3c.github.io/IndexedDB/#iterate-a-cursor
     */
    _iterate(key, primaryKey) {
        return __awaiter(this, void 0, void 0, function* () {
            BridgeIDBFactory.enableTracing &&
                console.log(`iterating cursor os=${this._objectStoreName},idx=${this._indexName}`);
            BridgeIDBFactory.enableTracing &&
                console.log("cursor type ", this.toString());
            const recordGetRequest = {
                direction: this.direction,
                indexName: this._indexName,
                lastIndexPosition: this._indexPosition,
                lastObjectStorePosition: this._objectStorePosition,
                limit: 1,
                range: this._range,
                objectStoreName: this._objectStoreName,
                advanceIndexKey: key,
                advancePrimaryKey: primaryKey,
                resultLevel: this._keyOnly ? ResultLevel.OnlyKeys : ResultLevel.Full,
            };
            const { btx } = this.source._confirmActiveTransaction();
            let response = yield this._backend.getRecords(btx, recordGetRequest);
            if (response.count === 0) {
                if (BridgeIDBFactory.enableTracing) {
                    console.log("cursor is returning empty result");
                }
                this._gotValue = false;
                return null;
            }
            if (response.count !== 1) {
                throw Error("invariant failed");
            }
            if (BridgeIDBFactory.enableTracing) {
                console.log("request is:", JSON.stringify(recordGetRequest));
                console.log("get response is:", JSON.stringify(response));
            }
            if (this._indexName !== undefined) {
                this._key = response.indexKeys[0];
            }
            else {
                this._key = response.primaryKeys[0];
            }
            this._primaryKey = response.primaryKeys[0];
            if (!this._keyOnly) {
                this._value = response.values[0];
            }
            this._gotValue = true;
            this._objectStorePosition = structuredClone(response.primaryKeys[0]);
            if (response.indexKeys !== undefined && response.indexKeys.length > 0) {
                this._indexPosition = structuredClone(response.indexKeys[0]);
            }
            return this;
        });
    }
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-update-IDBRequest-any-value
    update(value) {
        if (value === undefined) {
            throw new TypeError();
        }
        const transaction = this._effectiveObjectStore.transaction;
        if (transaction._state !== "active") {
            throw new TransactionInactiveError();
        }
        if (transaction.mode === "readonly") {
            throw new ReadOnlyError();
        }
        if (this._effectiveObjectStore._deleted) {
            throw new InvalidStateError();
        }
        if (!(this.source instanceof BridgeIDBObjectStore) &&
            this.source._deleted) {
            throw new InvalidStateError();
        }
        if (!this._gotValue || !this._isValueCursor) {
            throw new InvalidStateError();
        }
        const storeReq = {
            key: this._primaryKey,
            value: value,
            objectStoreName: this._objectStoreName,
            storeLevel: StoreLevel.UpdateExisting,
        };
        const operation = () => __awaiter(this, void 0, void 0, function* () {
            if (BridgeIDBFactory.enableTracing) {
                console.log("updating at cursor");
            }
            const { btx } = this.source._confirmActiveTransaction();
            yield this._backend.storeRecord(btx, storeReq);
        });
        return transaction._execRequestAsync({
            operation,
            source: this,
        });
    }
    /**
     * http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-advance-void-unsigned-long-count
     */
    advance(count) {
        throw Error("not implemented");
    }
    /**
     * http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-continue-void-any-key
     */
    continue(key) {
        const transaction = this._effectiveObjectStore.transaction;
        if (transaction._state !== "active") {
            throw new TransactionInactiveError();
        }
        if (this._effectiveObjectStore._deleted) {
            throw new InvalidStateError();
        }
        if (!(this.source instanceof BridgeIDBObjectStore) &&
            this.source._deleted) {
            throw new InvalidStateError();
        }
        if (!this._gotValue) {
            throw new InvalidStateError();
        }
        if (key !== undefined) {
            key = valueToKey(key);
            let lastKey = this._indexName === undefined
                ? this._objectStorePosition
                : this._indexPosition;
            const cmpResult = compareKeys(key, lastKey);
            if ((cmpResult <= 0 &&
                (this.direction === "next" || this.direction === "nextunique")) ||
                (cmpResult >= 0 &&
                    (this.direction === "prev" || this.direction === "prevunique"))) {
                throw new DataError();
            }
        }
        if (this._request) {
            this._request.readyState = "pending";
        }
        const operation = () => __awaiter(this, void 0, void 0, function* () {
            return this._iterate(key);
        });
        transaction._execRequestAsync({
            operation,
            request: this._request,
            source: this.source,
        });
        this._gotValue = false;
    }
    // https://w3c.github.io/IndexedDB/#dom-idbcursor-continueprimarykey
    continuePrimaryKey(key, primaryKey) {
        throw Error("not implemented");
    }
    delete() {
        const transaction = this._effectiveObjectStore.transaction;
        if (transaction._state !== "active") {
            throw new TransactionInactiveError();
        }
        if (transaction.mode === "readonly") {
            throw new ReadOnlyError();
        }
        if (this._effectiveObjectStore._deleted) {
            throw new InvalidStateError();
        }
        if (!(this.source instanceof BridgeIDBObjectStore) &&
            this.source._deleted) {
            throw new InvalidStateError();
        }
        if (!this._gotValue || !this._isValueCursor) {
            throw new InvalidStateError();
        }
        const operation = () => __awaiter(this, void 0, void 0, function* () {
            const { btx } = this.source._confirmActiveTransaction();
            this._backend.deleteRecord(btx, this._objectStoreName, BridgeIDBKeyRange._valueToKeyRange(this._primaryKey));
        });
        return transaction._execRequestAsync({
            operation,
            source: this,
        });
    }
    toString() {
        return "[object IDBCursor]";
    }
}

/*
 Copyright 2017 Jeremy Scheff

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */
class BridgeIDBCursorWithValue extends BridgeIDBCursor {
    get value() {
        return this._value;
    }
    get _isValueCursor() {
        return true;
    }
    constructor(source, objectStoreName, indexName, range, direction, request) {
        super(source, objectStoreName, indexName, range, direction, request, false);
    }
    toString() {
        return "[object IDBCursorWithValue]";
    }
}

/*
 Copyright 2017 Jeremy Scheff

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
*/
class FakeEvent {
    constructor(type, eventInitDict = {}) {
        this.eventPath = [];
        this.NONE = 0;
        this.CAPTURING_PHASE = 1;
        this.AT_TARGET = 2;
        this.BUBBLING_PHASE = 3;
        // Flags
        this.propagationStopped = false;
        this.immediatePropagationStopped = false;
        this.canceled = false;
        this.initialized = true;
        this.dispatched = false;
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = 0;
        this.defaultPrevented = false;
        this.isTrusted = false;
        this.timeStamp = Date.now();
        this.cancelBubble = false;
        this.composed = false;
        this.returnValue = false;
        this.type = type;
        this.bubbles =
            eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
        this.cancelable =
            eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;
    }
    get srcElement() {
        return this.target;
    }
    composedPath() {
        throw new Error("Method not implemented.");
    }
    initEvent(type, bubbles, cancelable) {
        throw new Error("Method not implemented.");
    }
    preventDefault() {
        if (this.cancelable) {
            this.canceled = true;
        }
    }
    stopPropagation() {
        this.propagationStopped = true;
    }
    stopImmediatePropagation() {
        this.propagationStopped = true;
        this.immediatePropagationStopped = true;
    }
}

/*
 Copyright 2017 Jeremy Scheff

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */
const stopped = (event, listener) => {
    return (event.immediatePropagationStopped ||
        (event.eventPhase === event.CAPTURING_PHASE &&
            listener.capture === false) ||
        (event.eventPhase === event.BUBBLING_PHASE && listener.capture === true));
};
// http://www.w3.org/TR/dom/#concept-event-listener-invoke
const invokeEventListeners = (event, obj) => {
    event.currentTarget = obj;
    // The callback might cause obj.listeners to mutate as we traverse it.
    // Take a copy of the array so that nothing sneaks in and we don't lose
    // our place.
    for (const listener of obj.listeners.slice()) {
        if (event.type !== listener.type || stopped(event, listener)) {
            continue;
        }
        // @ts-ignore
        listener.callback.call(event.currentTarget, event);
    }
    const typeToProp = {
        abort: "onabort",
        blocked: "onblocked",
        complete: "oncomplete",
        error: "onerror",
        success: "onsuccess",
        upgradeneeded: "onupgradeneeded",
        versionchange: "onversionchange",
    };
    const prop = typeToProp[event.type];
    if (prop === undefined) {
        throw new Error(`Unknown event type: "${event.type}"`);
    }
    const callback = event.currentTarget[prop];
    if (callback) {
        const listener = {
            callback,
            capture: false,
            type: event.type,
        };
        if (!stopped(event, listener)) {
            // @ts-ignore
            listener.callback.call(event.currentTarget, event);
        }
    }
};
/** @public */
class FakeEventTarget {
    constructor() {
        this.listeners = [];
    }
    addEventListener(type, listener, capture = false) {
        if (typeof listener === "function") {
            this.listeners.push({
                callback: listener,
                capture,
                type,
            });
        }
        else if (typeof listener === "object" && listener != null) {
            this.listeners.push({
                callback: (e) => listener.handleEvent(e),
                capture,
                type,
            });
        }
    }
    removeEventListener(type, callback, capture = false) {
        const i = this.listeners.findIndex((listener) => {
            return (listener.type === type &&
                listener.callback === callback &&
                listener.capture === capture);
        });
        this.listeners.splice(i, 1);
    }
    // http://www.w3.org/TR/dom/#dispatching-events
    dispatchEvent(event) {
        if (!(event instanceof FakeEvent)) {
            throw Error("dispatchEvent only works with FakeEvent");
        }
        const fe = event;
        if (event.dispatched || !event.initialized) {
            throw new InvalidStateError("The object is in an invalid state.");
        }
        fe.isTrusted = false;
        fe.dispatched = true;
        fe.target = this;
        // NOT SURE WHEN THIS SHOULD BE SET        event.eventPath = [];
        fe.eventPhase = event.CAPTURING_PHASE;
        if (FakeEventTarget.enableTracing) {
            console.log(`dispatching '${event.type}' event along path with ${event.eventPath.length} elements`);
        }
        for (const obj of event.eventPath) {
            if (!event.propagationStopped) {
                invokeEventListeners(event, obj);
            }
        }
        fe.eventPhase = event.AT_TARGET;
        if (!event.propagationStopped) {
            invokeEventListeners(event, fe.target);
        }
        if (event.bubbles) {
            fe.eventPath.reverse();
            fe.eventPhase = event.BUBBLING_PHASE;
            if (fe.eventPath.length === 0 && event.type === "error") {
                console.error("Unhandled error event: ", event.target);
            }
            for (const obj of event.eventPath) {
                if (!event.propagationStopped) {
                    invokeEventListeners(event, obj);
                }
            }
        }
        fe.dispatched = false;
        fe.eventPhase = event.NONE;
        fe.currentTarget = null;
        if (event.canceled) {
            return false;
        }
        return true;
    }
}
FakeEventTarget.enableTracing = false;

/*
 * Copyright 2017 Jeremy Scheff
 * Copyright 2019 Florian Dold
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
/** @public */
class BridgeIDBRequest extends FakeEventTarget {
    constructor() {
        super(...arguments);
        this._result = null;
        this._error = null;
        this.source = null;
        this.transaction = null;
        this.readyState = "pending";
        this.onsuccess = null;
        this.onerror = null;
    }
    get error() {
        if (this.readyState === "pending") {
            throw new InvalidStateError();
        }
        return this._error;
    }
    set error(value) {
        this._error = value;
    }
    get result() {
        if (this.readyState === "pending") {
            throw new InvalidStateError();
        }
        return this._result;
    }
    set result(value) {
        this._result = value;
    }
    toString() {
        return "[object IDBRequest]";
    }
    _finishWithError(err) {
        this.result = undefined;
        this.readyState = "done";
        this.error = new Error(err.message);
        this.error.name = err.name;
        const event = new FakeEvent("error", {
            bubbles: true,
            cancelable: true,
        });
        event.eventPath = [];
        this.dispatchEvent(event);
    }
    _finishWithResult(result) {
        this.result = result;
        this.readyState = "done";
        const event = new FakeEvent("success");
        event.eventPath = [];
        this.dispatchEvent(event);
    }
}

/*
 Copyright 2017 Jeremy Scheff
 Copyright 2019 Florian Dold

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */
const confirmActiveTransaction = (index) => {
    if (index._deleted || index.objectStore._deleted) {
        throw new InvalidStateError();
    }
    if (index.objectStore.transaction._state !== "active") {
        throw new TransactionInactiveError();
    }
    return index.objectStore.transaction;
};
// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#idl-def-IDBIndex
/** @public */
class BridgeIDBIndex {
    constructor(objectStore, name) {
        this._deleted = false;
        this._name = name;
        this.objectStore = objectStore;
    }
    get _schema() {
        return this.objectStore.transaction.db._schema;
    }
    get keyPath() {
        return this._schema.objectStores[this.objectStore.name].indexes[this._name]
            .keyPath;
    }
    get multiEntry() {
        return this._schema.objectStores[this.objectStore.name].indexes[this._name]
            .multiEntry;
    }
    get unique() {
        return this._schema.objectStores[this.objectStore.name].indexes[this._name]
            .unique;
    }
    get _backend() {
        return this.objectStore._backend;
    }
    _confirmActiveTransaction() {
        return this.objectStore._confirmActiveTransaction();
    }
    get name() {
        return this._name;
    }
    // https://w3c.github.io/IndexedDB/#dom-idbindex-name
    set name(name) {
        const transaction = this.objectStore.transaction;
        if (!transaction.db._runningVersionchangeTransaction) {
            throw new InvalidStateError();
        }
        if (transaction._state !== "active") {
            throw new TransactionInactiveError();
        }
        const { btx } = this._confirmActiveTransaction();
        const oldName = this._name;
        const newName = String(name);
        if (newName === oldName) {
            return;
        }
        this._backend.renameIndex(btx, this.objectStore.name, oldName, newName);
        if (this.objectStore.indexNames.indexOf(name) >= 0) {
            throw new ConstraintError();
        }
    }
    // tslint:disable-next-line max-line-length
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-openCursor-IDBRequest-any-range-IDBCursorDirection-direction
    openCursor(range, direction = "next") {
        confirmActiveTransaction(this);
        if (range === null) {
            range = undefined;
        }
        if (range !== undefined && !(range instanceof BridgeIDBKeyRange)) {
            range = BridgeIDBKeyRange.only(valueToKey(range));
        }
        const request = new BridgeIDBRequest();
        request.source = this;
        request.transaction = this.objectStore.transaction;
        const cursor = new BridgeIDBCursorWithValue(this, this.objectStore.name, this._name, range, direction, request);
        const operation = () => __awaiter(this, void 0, void 0, function* () {
            return cursor._iterate();
        });
        return this.objectStore.transaction._execRequestAsync({
            operation,
            request,
            source: this,
        });
    }
    // tslint:disable-next-line max-line-length
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-openKeyCursor-IDBRequest-any-range-IDBCursorDirection-direction
    openKeyCursor(range, direction = "next") {
        confirmActiveTransaction(this);
        if (range === null) {
            range = undefined;
        }
        if (range !== undefined && !(range instanceof BridgeIDBKeyRange)) {
            range = BridgeIDBKeyRange.only(valueToKey(range));
        }
        const request = new BridgeIDBRequest();
        request.source = this;
        request.transaction = this.objectStore.transaction;
        const cursor = new BridgeIDBCursor(this, this.objectStore.name, this._name, range, direction, request, true);
        return this.objectStore.transaction._execRequestAsync({
            operation: cursor._iterate.bind(cursor),
            request,
            source: this,
        });
    }
    get(key) {
        confirmActiveTransaction(this);
        if (!(key instanceof BridgeIDBKeyRange)) {
            key = BridgeIDBKeyRange._valueToKeyRange(key);
        }
        const getReq = {
            direction: "next",
            indexName: this._name,
            limit: 1,
            range: key,
            objectStoreName: this.objectStore._name,
            resultLevel: ResultLevel.Full,
        };
        const operation = () => __awaiter(this, void 0, void 0, function* () {
            const { btx } = this._confirmActiveTransaction();
            const result = yield this._backend.getRecords(btx, getReq);
            if (result.count == 0) {
                return undefined;
            }
            const values = result.values;
            if (!values) {
                throw Error("invariant violated");
            }
            return values[0];
        });
        return this.objectStore.transaction._execRequestAsync({
            operation,
            source: this,
        });
    }
    // http://w3c.github.io/IndexedDB/#dom-idbindex-getall
    getAll(query, count) {
        throw Error("not implemented");
    }
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-getKey-IDBRequest-any-key
    getKey(key) {
        confirmActiveTransaction(this);
        if (!(key instanceof BridgeIDBKeyRange)) {
            key = BridgeIDBKeyRange._valueToKeyRange(key);
        }
        const getReq = {
            direction: "next",
            indexName: this._name,
            limit: 1,
            range: key,
            objectStoreName: this.objectStore._name,
            resultLevel: ResultLevel.OnlyKeys,
        };
        const operation = () => __awaiter(this, void 0, void 0, function* () {
            const { btx } = this._confirmActiveTransaction();
            const result = yield this._backend.getRecords(btx, getReq);
            if (result.count == 0) {
                return undefined;
            }
            const primaryKeys = result.primaryKeys;
            if (!primaryKeys) {
                throw Error("invariant violated");
            }
            return primaryKeys[0];
        });
        return this.objectStore.transaction._execRequestAsync({
            operation,
            source: this,
        });
    }
    // http://w3c.github.io/IndexedDB/#dom-idbindex-getallkeys
    getAllKeys(query, count) {
        throw Error("not implemented");
    }
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-count-IDBRequest-any-key
    count(key) {
        confirmActiveTransaction(this);
        if (key === null) {
            key = undefined;
        }
        if (key !== undefined && !(key instanceof BridgeIDBKeyRange)) {
            key = BridgeIDBKeyRange.only(valueToKey(key));
        }
        const getReq = {
            direction: "next",
            indexName: this._name,
            limit: 1,
            range: key,
            objectStoreName: this.objectStore._name,
            resultLevel: ResultLevel.OnlyCount,
        };
        const operation = () => __awaiter(this, void 0, void 0, function* () {
            const { btx } = this._confirmActiveTransaction();
            const result = yield this._backend.getRecords(btx, getReq);
            return result.count;
        });
        return this.objectStore.transaction._execRequestAsync({
            operation,
            source: this,
        });
    }
    toString() {
        return "[object IDBIndex]";
    }
}

/*
 * Copyright 2017 Jeremy Scheff
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
// Would be nicer to sublcass Array, but I'd have to sacrifice Node 4 support to do that.
const fakeDOMStringList = (arr) => {
    const arr2 = arr.slice();
    Object.defineProperty(arr2, "contains", {
        // tslint:disable-next-line object-literal-shorthand
        value: (value) => arr2.indexOf(value) >= 0,
    });
    Object.defineProperty(arr2, "item", {
        // tslint:disable-next-line object-literal-shorthand
        value: (i) => arr2[i],
    });
    return arr2;
};

/*
 Copyright 2017 Jeremy Scheff

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
*/
// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-valid-key-path
const validateKeyPath = (keyPath, parent) => {
    // This doesn't make sense to me based on the spec, but it is needed to pass the W3C KeyPath tests (see same
    // comment in extractKey)
    if (keyPath !== undefined &&
        keyPath !== null &&
        typeof keyPath !== "string" &&
        keyPath.toString &&
        (parent === "array" || !Array.isArray(keyPath))) {
        keyPath = keyPath.toString();
    }
    if (typeof keyPath === "string") {
        if (keyPath === "" && parent !== "string") {
            return;
        }
        try {
            // https://mathiasbynens.be/demo/javascript-identifier-regex for ECMAScript 5.1 / Unicode v7.0.0, with
            // reserved words at beginning removed
            // tslint:disable-next-line max-line-length
            const validIdentifierRegex = /^(?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])(?:[\$0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])*$/;
            if (keyPath.length >= 1 && validIdentifierRegex.test(keyPath)) {
                return;
            }
        }
        catch (err) {
            throw new SyntaxError(err.message);
        }
        if (keyPath.indexOf(" ") >= 0) {
            throw new SyntaxError("The keypath argument contains an invalid key path (no spaces allowed).");
        }
    }
    if (Array.isArray(keyPath) && keyPath.length > 0) {
        if (parent) {
            // No nested arrays
            throw new SyntaxError("The keypath argument contains an invalid key path (nested arrays).");
        }
        for (const part of keyPath) {
            validateKeyPath(part, "array");
        }
        return;
    }
    else if (typeof keyPath === "string" && keyPath.indexOf(".") >= 0) {
        keyPath = keyPath.split(".");
        for (const part of keyPath) {
            validateKeyPath(part, "string");
        }
        return;
    }
    throw new SyntaxError();
};

/*
 Copyright 2019 Florian Dold
 Copyright 2017 Jeremy Scheff

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */
// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#object-store
/** @public */
class BridgeIDBObjectStore {
    constructor(transaction, name) {
        this._indexesCache = new Map();
        this._deleted = false;
        this._name = name;
        this.transaction = transaction;
    }
    get autoIncrement() {
        return this._schema.objectStores[this._name].autoIncrement;
    }
    get indexNames() {
        return fakeDOMStringList(Object.keys(this._schema.objectStores[this._name].indexes)).sort();
    }
    get keyPath() {
        return this._schema.objectStores[this._name].keyPath;
    }
    get _schema() {
        return this.transaction.db._schema;
    }
    get name() {
        return this._name;
    }
    get _backend() {
        return this.transaction.db._backend;
    }
    get _backendConnection() {
        return this.transaction.db._backendConnection;
    }
    _confirmActiveTransaction() {
        const btx = this.transaction._backendTransaction;
        if (!btx) {
            throw new InvalidStateError();
        }
        return { btx };
    }
    // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-name
    set name(newName) {
        const transaction = this.transaction;
        if (!transaction.db._runningVersionchangeTransaction) {
            throw new InvalidStateError();
        }
        let { btx } = this._confirmActiveTransaction();
        newName = String(newName);
        const oldName = this._name;
        if (newName === oldName) {
            return;
        }
        this._backend.renameObjectStore(btx, oldName, newName);
        this.transaction.db._schema = this._backend.getSchema(this._backendConnection);
    }
    _store(value, key, overwrite) {
        if (BridgeIDBFactory.enableTracing) {
            console.log(`TRACE: IDBObjectStore._store`);
        }
        if (this.transaction.mode === "readonly") {
            throw new ReadOnlyError();
        }
        const operation = () => __awaiter(this, void 0, void 0, function* () {
            const { btx } = this._confirmActiveTransaction();
            const result = yield this._backend.storeRecord(btx, {
                objectStoreName: this._name,
                key: key,
                value: value,
                storeLevel: overwrite
                    ? StoreLevel.AllowOverwrite
                    : StoreLevel.NoOverwrite,
            });
            return result.key;
        });
        return this.transaction._execRequestAsync({ operation, source: this });
    }
    put(value, key) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        return this._store(value, key, true);
    }
    add(value, key) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        return this._store(value, key, false);
    }
    delete(key) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        if (this.transaction.mode === "readonly") {
            throw new ReadOnlyError();
        }
        let keyRange;
        if (key instanceof BridgeIDBKeyRange) {
            keyRange = key;
        }
        else {
            keyRange = BridgeIDBKeyRange.only(valueToKey(key));
        }
        const operation = () => __awaiter(this, void 0, void 0, function* () {
            const { btx } = this._confirmActiveTransaction();
            return this._backend.deleteRecord(btx, this._name, keyRange);
        });
        return this.transaction._execRequestAsync({
            operation,
            source: this,
        });
    }
    get(key) {
        if (BridgeIDBFactory.enableTracing) {
            console.log(`getting from object store ${this._name} key ${key}`);
        }
        if (arguments.length === 0) {
            throw new TypeError();
        }
        let keyRange;
        if (key instanceof BridgeIDBKeyRange) {
            keyRange = key;
        }
        else {
            keyRange = BridgeIDBKeyRange.only(valueToKey(key));
        }
        const recordRequest = {
            objectStoreName: this._name,
            indexName: undefined,
            lastIndexPosition: undefined,
            lastObjectStorePosition: undefined,
            direction: "next",
            limit: 1,
            resultLevel: ResultLevel.Full,
            range: keyRange,
        };
        const operation = () => __awaiter(this, void 0, void 0, function* () {
            if (BridgeIDBFactory.enableTracing) {
                console.log("running get operation:", recordRequest);
            }
            const { btx } = this._confirmActiveTransaction();
            const result = yield this._backend.getRecords(btx, recordRequest);
            if (BridgeIDBFactory.enableTracing) {
                console.log("get operation result count:", result.count);
            }
            if (result.count === 0) {
                return undefined;
            }
            const values = result.values;
            if (!values) {
                throw Error("invariant violated");
            }
            return values[0];
        });
        return this.transaction._execRequestAsync({
            operation,
            source: this,
        });
    }
    // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-getall
    getAll(query, count) {
        throw Error("not implemented");
    }
    // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-getkey
    getKey(key) {
        throw Error("not implemented");
    }
    // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-getallkeys
    getAllKeys(query, count) {
        throw Error("not implemented");
    }
    clear() {
        throw Error("not implemented");
    }
    openCursor(range, direction = "next") {
        if (range === null) {
            range = undefined;
        }
        if (range !== undefined && !(range instanceof BridgeIDBKeyRange)) {
            range = BridgeIDBKeyRange.only(valueToKey(range));
        }
        const request = new BridgeIDBRequest();
        request.source = this;
        request.transaction = this.transaction;
        const cursor = new BridgeIDBCursorWithValue(this, this._name, undefined, range, direction, request);
        return this.transaction._execRequestAsync({
            operation: () => cursor._iterate(),
            request,
            source: this,
        });
    }
    openKeyCursor(range, direction) {
        if (range === null) {
            range = undefined;
        }
        if (range !== undefined && !(range instanceof BridgeIDBKeyRange)) {
            range = BridgeIDBKeyRange.only(valueToKey(range));
        }
        if (!direction) {
            direction = "next";
        }
        const request = new BridgeIDBRequest();
        request.source = this;
        request.transaction = this.transaction;
        const cursor = new BridgeIDBCursor(this, this._name, undefined, range, direction, request, true);
        return this.transaction._execRequestAsync({
            operation: cursor._iterate.bind(cursor),
            request,
            source: this,
        });
    }
    // tslint:disable-next-line max-line-length
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBObjectStore-createIndex-IDBIndex-DOMString-name-DOMString-sequence-DOMString--keyPath-IDBIndexParameters-optionalParameters
    createIndex(indexName, keyPath, optionalParameters = {}) {
        if (arguments.length < 2) {
            throw new TypeError();
        }
        if (!this.transaction.db._runningVersionchangeTransaction) {
            throw new InvalidStateError();
        }
        const { btx } = this._confirmActiveTransaction();
        const multiEntry = optionalParameters.multiEntry !== undefined
            ? optionalParameters.multiEntry
            : false;
        const unique = optionalParameters.unique !== undefined
            ? optionalParameters.unique
            : false;
        if (this.transaction.mode !== "versionchange") {
            throw new InvalidStateError();
        }
        if (this.indexNames.indexOf(indexName) >= 0) {
            throw new ConstraintError();
        }
        validateKeyPath(keyPath);
        if (Array.isArray(keyPath) && multiEntry) {
            throw new InvalidAccessError();
        }
        this._backend.createIndex(btx, indexName, this._name, keyPath, multiEntry, unique);
        return new BridgeIDBIndex(this, indexName);
    }
    // https://w3c.github.io/IndexedDB/#dom-idbobjectstore-index
    index(name) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        if (this.transaction._state === "finished") {
            throw new InvalidStateError();
        }
        const index = this._indexesCache.get(name);
        if (index !== undefined) {
            return index;
        }
        return new BridgeIDBIndex(this, name);
    }
    deleteIndex(indexName) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        if (this.transaction.mode !== "versionchange") {
            throw new InvalidStateError();
        }
        if (!this.transaction.db._runningVersionchangeTransaction) {
            throw new InvalidStateError();
        }
        const { btx } = this._confirmActiveTransaction();
        const index = this._indexesCache.get(indexName);
        if (index !== undefined) {
            index._deleted = true;
        }
        this._backend.deleteIndex(btx, this._name, indexName);
    }
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBObjectStore-count-IDBRequest-any-key
    count(key) {
        if (key === null) {
            key = undefined;
        }
        if (key !== undefined && !(key instanceof BridgeIDBKeyRange)) {
            key = BridgeIDBKeyRange.only(valueToKey(key));
        }
        const recordGetRequest = {
            direction: "next",
            indexName: undefined,
            lastIndexPosition: undefined,
            limit: -1,
            objectStoreName: this._name,
            lastObjectStorePosition: undefined,
            range: key,
            resultLevel: ResultLevel.OnlyCount,
        };
        const operation = () => __awaiter(this, void 0, void 0, function* () {
            const { btx } = this._confirmActiveTransaction();
            const result = yield this._backend.getRecords(btx, recordGetRequest);
            return result.count;
        });
        return this.transaction._execRequestAsync({ operation, source: this });
    }
    toString() {
        return "[object IDBObjectStore]";
    }
}

/*
  Copyright 2019 Florian Dold

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
  or implied. See the License for the specific language governing
  permissions and limitations under the License.
 */
function queueTask(fn) {
    setImmediate(fn);
}

/*
 Copyright 2019 Florian Dold

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
*/
function openPromise$1() {
    let resolve;
    let reject;
    const promise = new Promise((resolve2, reject2) => {
        resolve = resolve2;
        reject = reject2;
    });
    if (!resolve) {
        throw Error("broken invariant");
    }
    if (!reject) {
        throw Error("broken invariant");
    }
    return { promise, resolve, reject };
}

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#transaction
/** @public */
class BridgeIDBTransaction extends FakeEventTarget {
    constructor(storeNames, mode, db, backendTransaction) {
        super();
        this._state = "active";
        this._started = false;
        this._objectStoresCache = new Map();
        this.error = null;
        this.onabort = null;
        this.oncomplete = null;
        this.onerror = null;
        this._requests = [];
        const myOpenPromise = openPromise$1();
        this._waitPromise = myOpenPromise.promise;
        this._resolveWait = myOpenPromise.resolve;
        this._scope = new Set(storeNames);
        this._backendTransaction = backendTransaction;
        this.mode = mode;
        this.db = db;
        this.objectStoreNames = fakeDOMStringList(Array.from(this._scope).sort());
        this.db._transactions.push(this);
    }
    get _backend() {
        return this.db._backend;
    }
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-aborting-a-transaction
    _abort(errName) {
        return __awaiter(this, void 0, void 0, function* () {
            this._state = "finished";
            if (errName !== null) {
                const e = new Error();
                e.name = errName;
                this.error = e;
            }
            // Should this directly remove from _requests?
            for (const { request } of this._requests) {
                if (request.readyState !== "done") {
                    request.readyState = "done"; // This will cancel execution of this request's operation
                    if (request.source) {
                        request.result = undefined;
                        request.error = new AbortError();
                        const event = new FakeEvent("error", {
                            bubbles: true,
                            cancelable: true,
                        });
                        event.eventPath = [this.db, this];
                        request.dispatchEvent(event);
                    }
                }
            }
            // Only roll back if we actually executed the scheduled operations.
            const maybeBtx = this._backendTransaction;
            if (maybeBtx) {
                yield this._backend.rollback(maybeBtx);
            }
            queueTask(() => {
                const event = new FakeEvent("abort", {
                    bubbles: true,
                    cancelable: false,
                });
                event.eventPath = [this.db];
                this.dispatchEvent(event);
            });
        });
    }
    abort() {
        if (this._state === "committing" || this._state === "finished") {
            throw new InvalidStateError();
        }
        this._state = "active";
        this._abort(null);
    }
    // http://w3c.github.io/IndexedDB/#dom-idbtransaction-objectstore
    objectStore(name) {
        if (this._state !== "active") {
            throw new InvalidStateError();
        }
        const objectStore = this._objectStoresCache.get(name);
        if (objectStore !== undefined) {
            return objectStore;
        }
        return new BridgeIDBObjectStore(this, name);
    }
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-asynchronously-executing-a-request
    _execRequestAsync(obj) {
        const source = obj.source;
        const operation = obj.operation;
        let request = obj.hasOwnProperty("request") ? obj.request : null;
        if (this._state !== "active") {
            throw new TransactionInactiveError();
        }
        // Request should only be passed for cursors
        if (!request) {
            if (!source) {
                // Special requests like indexes that just need to run some code
                request = new BridgeIDBRequest();
            }
            else {
                request = new BridgeIDBRequest();
                request.source = source;
                request.transaction = source.transaction;
            }
        }
        this._requests.push({
            operation,
            request,
        });
        return request;
    }
    /**
     * Actually execute the scheduled work for this transaction.
     */
    _start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (BridgeIDBFactory.enableTracing) {
                console.log(`TRACE: IDBTransaction._start, ${this._requests.length} queued`);
            }
            this._started = true;
            if (!this._backendTransaction) {
                this._backendTransaction = yield this._backend.beginTransaction(this.db._backendConnection, Array.from(this._scope), this.mode);
            }
            // Remove from request queue - cursor ones will be added back if necessary by cursor.continue and such
            let operation;
            let request;
            while (this._requests.length > 0) {
                const r = this._requests.shift();
                // This should only be false if transaction was aborted
                if (r && r.request.readyState !== "done") {
                    request = r.request;
                    operation = r.operation;
                    break;
                }
            }
            if (request && operation) {
                if (!request.source) {
                    // Special requests like indexes that just need to run some code, with error handling already built into
                    // operation
                    yield operation();
                }
                else {
                    let event;
                    try {
                        BridgeIDBFactory.enableTracing &&
                            console.log("TRACE: running operation in transaction");
                        const result = yield operation();
                        BridgeIDBFactory.enableTracing &&
                            console.log("TRACE: operation in transaction finished with success");
                        request.readyState = "done";
                        request.result = result;
                        request.error = undefined;
                        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-fire-a-success-event
                        if (this._state === "inactive") {
                            this._state = "active";
                        }
                        event = new FakeEvent("success", {
                            bubbles: false,
                            cancelable: false,
                        });
                        try {
                            event.eventPath = [request, this, this.db];
                            request.dispatchEvent(event);
                        }
                        catch (err) {
                            if (this._state !== "committing") {
                                this._abort("AbortError");
                            }
                            throw err;
                        }
                    }
                    catch (err) {
                        if (BridgeIDBFactory.enableTracing) {
                            console.log("TRACING: error during operation: ", err);
                        }
                        request.readyState = "done";
                        request.result = undefined;
                        request.error = err;
                        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-fire-an-error-event
                        if (this._state === "inactive") {
                            this._state = "active";
                        }
                        event = new FakeEvent("error", {
                            bubbles: true,
                            cancelable: true,
                        });
                        try {
                            event.eventPath = [this.db, this];
                            request.dispatchEvent(event);
                        }
                        catch (err) {
                            if (this._state !== "committing") {
                                this._abort("AbortError");
                            }
                            throw err;
                        }
                        if (!event.canceled) {
                            this._abort(err.name);
                        }
                    }
                }
                // On to the next one
                if (this._requests.length > 0) {
                    this._start();
                }
                else {
                    // Give it another chance for new handlers to be set before finishing
                    queueTask(() => this._start());
                }
                return;
            }
            if (this._state !== "finished" && this._state !== "committing") {
                if (BridgeIDBFactory.enableTracing) {
                    console.log("finishing transaction");
                }
                this._state = "committing";
                yield this._backend.commit(this._backendTransaction);
                this._state = "finished";
                if (!this.error) {
                    if (BridgeIDBFactory.enableTracing) {
                        console.log("dispatching 'complete' event on transaction");
                    }
                    const event = new FakeEvent("complete");
                    event.eventPath = [this, this.db];
                    this.dispatchEvent(event);
                }
                const idx = this.db._transactions.indexOf(this);
                if (idx < 0) {
                    throw Error("invariant failed");
                }
                this.db._transactions.splice(idx, 1);
                this._resolveWait();
            }
        });
    }
    commit() {
        if (this._state !== "active") {
            throw new InvalidStateError();
        }
        this._state = "committing";
        // We now just wait for auto-commit ...
    }
    toString() {
        return "[object IDBRequest]";
    }
    _waitDone() {
        return this._waitPromise;
    }
}

/*
 * Copyright 2017 Jeremy Scheff
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
/**
 * Ensure that an active version change transaction is currently running.
 */
const confirmActiveVersionchangeTransaction = (database) => {
    if (!database._runningVersionchangeTransaction) {
        throw new InvalidStateError();
    }
    // Find the latest versionchange transaction
    const transactions = database._transactions.filter((tx) => {
        return tx.mode === "versionchange";
    });
    const transaction = transactions[transactions.length - 1];
    if (!transaction || transaction._state === "finished") {
        throw new InvalidStateError();
    }
    if (transaction._state !== "active") {
        throw new TransactionInactiveError();
    }
    return transaction;
};
// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#database-interface
/** @public */
class BridgeIDBDatabase extends FakeEventTarget {
    constructor(backend, backendConnection) {
        super();
        this._closePending = false;
        this._closed = false;
        this._runningVersionchangeTransaction = false;
        this._transactions = [];
        this._schema = backend.getSchema(backendConnection);
        this._backend = backend;
        this._backendConnection = backendConnection;
    }
    get name() {
        return this._schema.databaseName;
    }
    get version() {
        return this._schema.databaseVersion;
    }
    get objectStoreNames() {
        return fakeDOMStringList(Object.keys(this._schema.objectStores)).sort();
    }
    /**
     * http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#database-closing-steps
     */
    _closeConnection() {
        this._closePending = true;
        const transactionsComplete = this._transactions.every((transaction) => {
            return transaction._state === "finished";
        });
        if (transactionsComplete) {
            this._closed = true;
            this._backend.close(this._backendConnection);
        }
        else {
            queueTask(() => {
                this._closeConnection();
            });
        }
    }
    // http://w3c.github.io/IndexedDB/#dom-idbdatabase-createobjectstore
    createObjectStore(name, options = {}) {
        if (name === undefined) {
            throw new TypeError();
        }
        const transaction = confirmActiveVersionchangeTransaction(this);
        const backendTx = transaction._backendTransaction;
        if (!backendTx) {
            throw Error("invariant violated");
        }
        const keyPath = options !== null && options.keyPath !== undefined
            ? options.keyPath
            : null;
        const autoIncrement = options !== null && options.autoIncrement !== undefined
            ? options.autoIncrement
            : false;
        if (keyPath !== null) {
            validateKeyPath(keyPath);
        }
        if (Object.keys(this._schema.objectStores).includes(name)) {
            throw new ConstraintError();
        }
        if (autoIncrement && (keyPath === "" || Array.isArray(keyPath))) {
            throw new InvalidAccessError();
        }
        transaction._backend.createObjectStore(backendTx, name, keyPath, autoIncrement);
        this._schema = this._backend.getSchema(this._backendConnection);
        return transaction.objectStore(name);
    }
    deleteObjectStore(name) {
        if (name === undefined) {
            throw new TypeError();
        }
        const transaction = confirmActiveVersionchangeTransaction(this);
        transaction._objectStoresCache.delete(name);
    }
    _internalTransaction(storeNames, mode, backendTransaction) {
        mode = mode !== undefined ? mode : "readonly";
        if (mode !== "readonly" &&
            mode !== "readwrite" &&
            mode !== "versionchange") {
            throw new TypeError("Invalid mode: " + mode);
        }
        const hasActiveVersionchange = this._transactions.some((transaction) => {
            return (transaction._state === "active" &&
                transaction.mode === "versionchange" &&
                transaction.db === this);
        });
        if (hasActiveVersionchange) {
            throw new InvalidStateError();
        }
        if (this._closePending) {
            throw new InvalidStateError();
        }
        if (!Array.isArray(storeNames)) {
            storeNames = [storeNames];
        }
        if (storeNames.length === 0 && mode !== "versionchange") {
            throw new InvalidAccessError();
        }
        for (const storeName of storeNames) {
            if (this.objectStoreNames.indexOf(storeName) < 0) {
                throw new NotFoundError("No objectStore named " + storeName + " in this database");
            }
        }
        const tx = new BridgeIDBTransaction(storeNames, mode, this, backendTransaction);
        this._transactions.push(tx);
        queueTask(() => tx._start());
        return tx;
    }
    transaction(storeNames, mode) {
        if (mode === "versionchange") {
            throw new TypeError("Invalid mode: " + mode);
        }
        return this._internalTransaction(storeNames, mode);
    }
    close() {
        this._closeConnection();
    }
    toString() {
        return "[object IDBDatabase]";
    }
}

/*
  Copyright 2019 Florian Dold
  Copyright 2017 Jeremy Scheff

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
  or implied. See the License for the specific language governing
  permissions and limitations under the License.
*/
/** @public */
class BridgeIDBOpenDBRequest extends BridgeIDBRequest {
    constructor() {
        super();
        this.onupgradeneeded = null;
        this.onblocked = null;
        // https://www.w3.org/TR/IndexedDB/#open-requests
        this.source = null;
    }
    toString() {
        return "[object IDBOpenDBRequest]";
    }
}

/*
  Copyright 2019 Florian Dold
  Copyright 2017 Jeremy Scheff

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
  or implied. See the License for the specific language governing
  permissions and limitations under the License.
 */
class BridgeIDBVersionChangeEvent extends FakeEvent {
    constructor(type, parameters = {}) {
        super(type);
        this.newVersion =
            parameters.newVersion !== undefined ? parameters.newVersion : null;
        this.oldVersion =
            parameters.oldVersion !== undefined ? parameters.oldVersion : 0;
    }
    toString() {
        return "[object IDBVersionChangeEvent]";
    }
}

/*
 Copyright 2017 Jeremy Scheff
 Copyright 2019 Florian Dold

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
*/
// https://heycam.github.io/webidl/#EnforceRange
const enforceRange = (num, type) => {
    const min = 0;
    const max = type === "unsigned long" ? 4294967295 : 9007199254740991;
    if (isNaN(num) || num < min || num > max) {
        throw new TypeError();
    }
    if (num >= 0) {
        return Math.floor(num);
    }
};

/*
 * Copyright 2017 Jeremy Scheff
 * Copyright 2019 Florian Dold
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
/** @public */
class BridgeIDBFactory {
    constructor(backend) {
        this.cmp = compareKeys;
        this.connections = [];
        this.backend = backend;
    }
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBFactory-deleteDatabase-IDBOpenDBRequest-DOMString-name
    deleteDatabase(name) {
        const request = new BridgeIDBOpenDBRequest();
        request.source = null;
        queueTask(() => __awaiter(this, void 0, void 0, function* () {
            const databases = yield this.backend.getDatabases();
            const dbInfo = databases.find((x) => x.name == name);
            if (!dbInfo) {
                // Database already doesn't exist, success!
                const event = new BridgeIDBVersionChangeEvent("success", {
                    newVersion: null,
                    oldVersion: 0,
                });
                request.dispatchEvent(event);
                return;
            }
            const oldVersion = dbInfo.version;
            try {
                const dbconn = yield this.backend.connectDatabase(name);
                const backendTransaction = yield this.backend.enterVersionChange(dbconn, 0);
                yield this.backend.deleteDatabase(backendTransaction, name);
                yield this.backend.commit(backendTransaction);
                yield this.backend.close(dbconn);
                request.result = undefined;
                request.readyState = "done";
                const event2 = new BridgeIDBVersionChangeEvent("success", {
                    newVersion: null,
                    oldVersion,
                });
                request.dispatchEvent(event2);
            }
            catch (err) {
                request.error = new Error();
                request.error.name = err.name;
                request.readyState = "done";
                const event = new FakeEvent("error", {
                    bubbles: true,
                    cancelable: true,
                });
                event.eventPath = [];
                request.dispatchEvent(event);
            }
        }));
        return request;
    }
    // tslint:disable-next-line max-line-length
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBFactory-open-IDBOpenDBRequest-DOMString-name-unsigned-long-long-version
    open(name, version) {
        if (arguments.length > 1 && version !== undefined) {
            // Based on spec, not sure why "MAX_SAFE_INTEGER" instead of "unsigned long long", but it's needed to pass
            // tests
            version = enforceRange(version, "MAX_SAFE_INTEGER");
        }
        if (version === 0) {
            throw new TypeError();
        }
        const request = new BridgeIDBOpenDBRequest();
        queueTask(() => __awaiter(this, void 0, void 0, function* () {
            let dbconn;
            try {
                dbconn = yield this.backend.connectDatabase(name);
            }
            catch (err) {
                request._finishWithError(err);
                return;
            }
            const schema = this.backend.getSchema(dbconn);
            const existingVersion = schema.databaseVersion;
            if (version === undefined) {
                version = existingVersion !== 0 ? existingVersion : 1;
            }
            const requestedVersion = version;
            BridgeIDBFactory.enableTracing &&
                console.log(`TRACE: existing version ${existingVersion}, requested version ${requestedVersion}`);
            if (existingVersion > requestedVersion) {
                request._finishWithError(new VersionError());
                return;
            }
            const db = new BridgeIDBDatabase(this.backend, dbconn);
            if (existingVersion == requestedVersion) {
                request.result = db;
                request.readyState = "done";
                const event2 = new FakeEvent("success", {
                    bubbles: false,
                    cancelable: false,
                });
                event2.eventPath = [request];
                request.dispatchEvent(event2);
            }
            if (existingVersion < requestedVersion) {
                // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-running-a-versionchange-transaction
                for (const otherConn of this.connections) {
                    const event = new BridgeIDBVersionChangeEvent("versionchange", {
                        newVersion: version,
                        oldVersion: existingVersion,
                    });
                    otherConn.dispatchEvent(event);
                }
                if (this._anyOpen()) {
                    const event = new BridgeIDBVersionChangeEvent("blocked", {
                        newVersion: version,
                        oldVersion: existingVersion,
                    });
                    request.dispatchEvent(event);
                }
                const backendTransaction = yield this.backend.enterVersionChange(dbconn, requestedVersion);
                db._runningVersionchangeTransaction = true;
                const transaction = db._internalTransaction([], "versionchange", backendTransaction);
                const event = new BridgeIDBVersionChangeEvent("upgradeneeded", {
                    newVersion: version,
                    oldVersion: existingVersion,
                });
                request.result = db;
                request.readyState = "done";
                request.transaction = transaction;
                request.dispatchEvent(event);
                yield transaction._waitDone();
                // We don't explicitly exit the versionchange transaction,
                // since this is already done by the BridgeIDBTransaction.
                db._runningVersionchangeTransaction = false;
                const event2 = new FakeEvent("success", {
                    bubbles: false,
                    cancelable: false,
                });
                event2.eventPath = [request];
                request.dispatchEvent(event2);
            }
            this.connections.push(db);
            return db;
        }));
        return request;
    }
    // https://w3c.github.io/IndexedDB/#dom-idbfactory-databases
    databases() {
        return this.backend.getDatabases();
    }
    toString() {
        return "[object IDBFactory]";
    }
    _anyOpen() {
        return this.connections.some((c) => !c._closed && !c._closePending);
    }
}
BridgeIDBFactory.enableTracing = false;

/*
Copyright (c) 2018 David Piepgrass

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

SPDX-License-Identifier: MIT
*/
// Informative microbenchmarks & stuff:
// http://www.jayconrod.com/posts/52/a-tour-of-v8-object-representation (very educational)
// https://blog.mozilla.org/luke/2012/10/02/optimizing-javascript-variable-access/ (local vars are faster than properties)
// http://benediktmeurer.de/2017/12/13/an-introduction-to-speculative-optimization-in-v8/ (other stuff)
// https://jsperf.com/js-in-operator-vs-alternatives (avoid 'in' operator; `.p!==undefined` faster than `hasOwnProperty('p')` in all browsers)
// https://jsperf.com/instanceof-vs-typeof-vs-constructor-vs-member (speed of type tests varies wildly across browsers)
// https://jsperf.com/detecting-arrays-new (a.constructor===Array is best across browsers, assuming a is an object)
// https://jsperf.com/shallow-cloning-methods (a constructor is faster than Object.create; hand-written clone faster than Object.assign)
// https://jsperf.com/ways-to-fill-an-array (slice-and-replace is fastest)
// https://jsperf.com/math-min-max-vs-ternary-vs-if (Math.min/max is slow on Edge)
// https://jsperf.com/array-vs-property-access-speed (v.x/v.y is faster than a[0]/a[1] in major browsers IF hidden class is constant)
// https://jsperf.com/detect-not-null-or-undefined (`x==null` slightly slower than `x===null||x===undefined` on all browsers)
// Overall, microbenchmarks suggest Firefox is the fastest browser for JavaScript and Edge is the slowest.
// Lessons from https://v8project.blogspot.com/2017/09/elements-kinds-in-v8.html:
//   - Avoid holes in arrays. Avoid `new Array(N)`, it will be "holey" permanently.
//   - Don't read outside bounds of an array (it scans prototype chain).
//   - Small integer arrays are stored differently from doubles
//   - Adding non-numbers to an array deoptimizes it permanently into a general array
//   - Objects can be used like arrays (e.g. have length property) but are slower
//   - V8 source (NewElementsCapacity in src/objects.h): arrays grow by 50% + 16 elements
/** Compares two numbers, strings, arrays of numbers/strings, Dates,
 *  or objects that have a valueOf() method returning a number or string.
 *  Optimized for numbers. Returns 1 if a>b, -1 if a<b, and 0 if a===b.
 */
function defaultComparator(a, b) {
    var c = a - b;
    if (c === c)
        return c; // a & b are number
    // General case (c is NaN): string / arrays / Date / incomparable things
    if (a)
        a = a.valueOf();
    if (b)
        b = b.valueOf();
    return a < b ? -1 : a > b ? 1 : a == b ? 0 : c;
}
/**
 * A reasonably fast collection of key-value pairs with a powerful API.
 * Largely compatible with the standard Map. BTree is a B+ tree data structure,
 * so the collection is sorted by key.
 *
 * B+ trees tend to use memory more efficiently than hashtables such as the
 * standard Map, especially when the collection contains a large number of
 * items. However, maintaining the sort order makes them modestly slower:
 * O(log size) rather than O(1). This B+ tree implementation supports O(1)
 * fast cloning. It also supports freeze(), which can be used to ensure that
 * a BTree is not changed accidentally.
 *
 * Confusingly, the ES6 Map.forEach(c) method calls c(value,key) instead of
 * c(key,value), in contrast to other methods such as set() and entries()
 * which put the key first. I can only assume that the order was reversed on
 * the theory that users would usually want to examine values and ignore keys.
 * BTree's forEach() therefore works the same way, but a second method
 * `.forEachPair((key,value)=>{...})` is provided which sends you the key
 * first and the value second; this method is slightly faster because it is
 * the "native" for-each method for this class.
 *
 * Out of the box, BTree supports keys that are numbers, strings, arrays of
 * numbers/strings, Date, and objects that have a valueOf() method returning a
 * number or string. Other data types, such as arrays of Date or custom
 * objects, require a custom comparator, which you must pass as the second
 * argument to the constructor (the first argument is an optional list of
 * initial items). Symbols cannot be used as keys because they are unordered
 * (one Symbol is never "greater" or "less" than another).
 *
 * @example
 * Given a {name: string, age: number} object, you can create a tree sorted by
 * name and then by age like this:
 *
 *     var tree = new BTree(undefined, (a, b) => {
 *       if (a.name > b.name)
 *         return 1; // Return a number >0 when a > b
 *       else if (a.name < b.name)
 *         return -1; // Return a number <0 when a < b
 *       else // names are equal (or incomparable)
 *         return a.age - b.age; // Return >0 when a.age > b.age
 *     });
 *
 *     tree.set({name:"Bill", age:17}, "happy");
 *     tree.set({name:"Fran", age:40}, "busy & stressed");
 *     tree.set({name:"Bill", age:55}, "recently laid off");
 *     tree.forEachPair((k, v) => {
 *       console.log(`Name: ${k.name} Age: ${k.age} Status: ${v}`);
 *     });
 *
 * @description
 * The "range" methods (`forEach, forRange, editRange`) will return the number
 * of elements that were scanned. In addition, the callback can return {break:R}
 * to stop early and return R from the outer function.
 *
 * - TODO: Test performance of preallocating values array at max size
 * - TODO: Add fast initialization when a sorted array is provided to constructor
 *
 * For more documentation see https://github.com/qwertie/btree-typescript
 *
 * Are you a C# developer? You might like the similar data structures I made for C#:
 * BDictionary, BList, etc. See http://core.loyc.net/collections/
 *
 * @author David Piepgrass
 */
class BTree {
    /**
     * Initializes an empty B+ tree.
     * @param compare Custom function to compare pairs of elements in the tree.
     *   This is not required for numbers, strings and arrays of numbers/strings.
     * @param entries A set of key-value pairs to initialize the tree
     * @param maxNodeSize Branching factor (maximum items or children per node)
     *   Must be in range 4..256. If undefined or <4 then default is used; if >256 then 256.
     */
    constructor(entries, compare, maxNodeSize) {
        this._root = EmptyLeaf;
        this._size = 0;
        this._maxNodeSize = maxNodeSize >= 4 ? Math.min(maxNodeSize, 256) : 32;
        this._compare = compare || defaultComparator;
        if (entries)
            this.setPairs(entries);
    }
    // ES6 Map<K,V> methods ///////////////////////////////////////////////////
    /** Gets the number of key-value pairs in the tree. */
    get size() {
        return this._size;
    }
    /** Gets the number of key-value pairs in the tree. */
    get length() {
        return this._size;
    }
    /** Returns true iff the tree contains no key-value pairs. */
    get isEmpty() {
        return this._size === 0;
    }
    /** Releases the tree so that its size is 0. */
    clear() {
        this._root = EmptyLeaf;
        this._size = 0;
    }
    /** Runs a function for each key-value pair, in order from smallest to
     *  largest key. For compatibility with ES6 Map, the argument order to
     *  the callback is backwards: value first, then key. Call forEachPair
     *  instead to receive the key as the first argument.
     * @param thisArg If provided, this parameter is assigned as the `this`
     *        value for each callback.
     * @returns the number of values that were sent to the callback,
     *        or the R value if the callback returned {break:R}. */
    forEach(callback, thisArg) {
        if (thisArg !== undefined)
            callback = callback.bind(thisArg);
        return this.forEachPair((k, v) => callback(v, k, this));
    }
    /** Runs a function for each key-value pair, in order from smallest to
     *  largest key. The callback can return {break:R} (where R is any value
     *  except undefined) to stop immediately and return R from forEachPair.
     * @param onFound A function that is called for each key-value pair. This
     *        function can return {break:R} to stop early with result R.
     *        The reason that you must return {break:R} instead of simply R
     *        itself is for consistency with editRange(), which allows
     *        multiple actions, not just breaking.
     * @param initialCounter This is the value of the third argument of
     *        `onFound` the first time it is called. The counter increases
     *        by one each time `onFound` is called. Default value: 0
     * @returns the number of pairs sent to the callback (plus initialCounter,
     *        if you provided one). If the callback returned {break:R} then
     *        the R value is returned instead. */
    forEachPair(callback, initialCounter) {
        var low = this.minKey(), high = this.maxKey();
        return this.forRange(low, high, true, callback, initialCounter);
    }
    /**
     * Finds a pair in the tree and returns the associated value.
     * @param defaultValue a value to return if the key was not found.
     * @returns the value, or defaultValue if the key was not found.
     * @description Computational complexity: O(log size)
     */
    get(key, defaultValue) {
        return this._root.get(key, defaultValue, this);
    }
    /**
     * Adds or overwrites a key-value pair in the B+ tree.
     * @param key the key is used to determine the sort order of
     *        data in the tree.
     * @param value data to associate with the key (optional)
     * @param overwrite Whether to overwrite an existing key-value pair
     *        (default: true). If this is false and there is an existing
     *        key-value pair then this method has no effect.
     * @returns true if a new key-value pair was added.
     * @description Computational complexity: O(log size)
     * Note: when overwriting a previous entry, the key is updated
     * as well as the value. This has no effect unless the new key
     * has data that does not affect its sort order.
     */
    set(key, value, overwrite) {
        if (this._root.isShared)
            this._root = this._root.clone();
        var result = this._root.set(key, value, overwrite, this);
        if (result === true || result === false)
            return result;
        // Root node has split, so create a new root node.
        this._root = new BNodeInternal([this._root, result]);
        return true;
    }
    /**
     * Returns true if the key exists in the B+ tree, false if not.
     * Use get() for best performance; use has() if you need to
     * distinguish between "undefined value" and "key not present".
     * @param key Key to detect
     * @description Computational complexity: O(log size)
     */
    has(key) {
        return this.forRange(key, key, true, undefined) !== 0;
    }
    /**
     * Removes a single key-value pair from the B+ tree.
     * @param key Key to find
     * @returns true if a pair was found and removed, false otherwise.
     * @description Computational complexity: O(log size)
     */
    delete(key) {
        return this.editRange(key, key, true, DeleteRange) !== 0;
    }
    with(key, value, overwrite) {
        let nu = this.clone();
        return nu.set(key, value, overwrite) || overwrite ? nu : this;
    }
    /** Returns a copy of the tree with the specified key-value pairs set. */
    withPairs(pairs, overwrite) {
        let nu = this.clone();
        return nu.setPairs(pairs, overwrite) !== 0 || overwrite ? nu : this;
    }
    /** Returns a copy of the tree with the specified keys present.
     *  @param keys The keys to add. If a key is already present in the tree,
     *         neither the existing key nor the existing value is modified.
     *  @param returnThisIfUnchanged if true, returns this if all keys already
     *  existed. Performance note: due to the architecture of this class, all
     *  node(s) leading to existing keys are cloned even if the collection is
     *  ultimately unchanged.
     */
    withKeys(keys, returnThisIfUnchanged) {
        let nu = this.clone(), changed = false;
        for (var i = 0; i < keys.length; i++)
            changed = nu.set(keys[i], undefined, false) || changed;
        return returnThisIfUnchanged && !changed ? this : nu;
    }
    /** Returns a copy of the tree with the specified key removed.
     * @param returnThisIfUnchanged if true, returns this if the key didn't exist.
     *  Performance note: due to the architecture of this class, node(s) leading
     *  to where the key would have been stored are cloned even when the key
     *  turns out not to exist and the collection is unchanged.
     */
    without(key, returnThisIfUnchanged) {
        return this.withoutRange(key, key, true, returnThisIfUnchanged);
    }
    /** Returns a copy of the tree with the specified keys removed.
     * @param returnThisIfUnchanged if true, returns this if none of the keys
     *  existed. Performance note: due to the architecture of this class,
     *  node(s) leading to where the key would have been stored are cloned
     *  even when the key turns out not to exist.
     */
    withoutKeys(keys, returnThisIfUnchanged) {
        let nu = this.clone();
        return nu.deleteKeys(keys) || !returnThisIfUnchanged ? nu : this;
    }
    /** Returns a copy of the tree with the specified range of keys removed. */
    withoutRange(low, high, includeHigh, returnThisIfUnchanged) {
        let nu = this.clone();
        if (nu.deleteRange(low, high, includeHigh) === 0 && returnThisIfUnchanged)
            return this;
        return nu;
    }
    /** Returns a copy of the tree with pairs removed whenever the callback
     *  function returns false. `where()` is a synonym for this method. */
    filter(callback, returnThisIfUnchanged) {
        var nu = this.greedyClone();
        var del;
        nu.editAll((k, v, i) => {
            if (!callback(k, v, i))
                return (del = Delete);
        });
        if (!del && returnThisIfUnchanged)
            return this;
        return nu;
    }
    /** Returns a copy of the tree with all values altered by a callback function. */
    mapValues(callback) {
        var tmp = {};
        var nu = this.greedyClone();
        nu.editAll((k, v, i) => {
            return (tmp.value = callback(v, k, i)), tmp;
        });
        return nu;
    }
    reduce(callback, initialValue) {
        let i = 0, p = initialValue;
        var it = this.entries(this.minKey(), ReusedArray), next;
        while (!(next = it.next()).done)
            p = callback(p, next.value, i++, this);
        return p;
    }
    // Iterator methods ///////////////////////////////////////////////////////
    /** Returns an iterator that provides items in order (ascending order if
     *  the collection's comparator uses ascending order, as is the default.)
     *  @param lowestKey First key to be iterated, or undefined to start at
     *         minKey(). If the specified key doesn't exist then iteration
     *         starts at the next higher key (according to the comparator).
     *  @param reusedArray Optional array used repeatedly to store key-value
     *         pairs, to avoid creating a new array on every iteration.
     */
    entries(lowestKey, reusedArray) {
        var info = this.findPath(lowestKey);
        if (info === undefined)
            return iterator();
        var { nodequeue, nodeindex, leaf } = info;
        var state = reusedArray !== undefined ? 1 : 0;
        var i = lowestKey === undefined
            ? -1
            : leaf.indexOf(lowestKey, 0, this._compare) - 1;
        return iterator(() => {
            jump: for (;;) {
                switch (state) {
                    case 0:
                        if (++i < leaf.keys.length)
                            return { done: false, value: [leaf.keys[i], leaf.values[i]] };
                        state = 2;
                        continue;
                    case 1:
                        if (++i < leaf.keys.length) {
                            (reusedArray[0] = leaf.keys[i]),
                                (reusedArray[1] = leaf.values[i]);
                            return { done: false, value: reusedArray };
                        }
                        state = 2;
                    case 2:
                        // Advance to the next leaf node
                        for (var level = -1;;) {
                            if (++level >= nodequeue.length) {
                                state = 3;
                                continue jump;
                            }
                            if (++nodeindex[level] < nodequeue[level].length)
                                break;
                        }
                        for (; level > 0; level--) {
                            nodequeue[level - 1] = nodequeue[level][nodeindex[level]].children;
                            nodeindex[level - 1] = 0;
                        }
                        leaf = nodequeue[0][nodeindex[0]];
                        i = -1;
                        state = reusedArray !== undefined ? 1 : 0;
                        continue;
                    case 3:
                        return { done: true, value: undefined };
                }
            }
        });
    }
    /** Returns an iterator that provides items in reversed order.
     *  @param highestKey Key at which to start iterating, or undefined to
     *         start at minKey(). If the specified key doesn't exist then iteration
     *         starts at the next lower key (according to the comparator).
     *  @param reusedArray Optional array used repeatedly to store key-value
     *         pairs, to avoid creating a new array on every iteration.
     *  @param skipHighest Iff this flag is true and the highestKey exists in the
     *         collection, the pair matching highestKey is skipped, not iterated.
     */
    entriesReversed(highestKey, reusedArray, skipHighest) {
        if ((highestKey = highestKey || this.maxKey()) === undefined)
            return iterator(); // collection is empty
        var { nodequeue, nodeindex, leaf } = this.findPath(highestKey) || this.findPath(this.maxKey());
        check$1(!nodequeue[0] || leaf === nodequeue[0][nodeindex[0]], "wat!");
        var i = leaf.indexOf(highestKey, 0, this._compare);
        if (!(skipHighest || this._compare(leaf.keys[i], highestKey) > 0))
            i++;
        var state = reusedArray !== undefined ? 1 : 0;
        return iterator(() => {
            jump: for (;;) {
                switch (state) {
                    case 0:
                        if (--i >= 0)
                            return { done: false, value: [leaf.keys[i], leaf.values[i]] };
                        state = 2;
                        continue;
                    case 1:
                        if (--i >= 0) {
                            (reusedArray[0] = leaf.keys[i]),
                                (reusedArray[1] = leaf.values[i]);
                            return { done: false, value: reusedArray };
                        }
                        state = 2;
                    case 2:
                        // Advance to the next leaf node
                        for (var level = -1;;) {
                            if (++level >= nodequeue.length) {
                                state = 3;
                                continue jump;
                            }
                            if (--nodeindex[level] >= 0)
                                break;
                        }
                        for (; level > 0; level--) {
                            nodequeue[level - 1] = nodequeue[level][nodeindex[level]].children;
                            nodeindex[level - 1] = nodequeue[level - 1].length - 1;
                        }
                        leaf = nodequeue[0][nodeindex[0]];
                        i = leaf.keys.length;
                        state = reusedArray !== undefined ? 1 : 0;
                        continue;
                    case 3:
                        return { done: true, value: undefined };
                }
            }
        });
    }
    /* Used by entries() and entriesReversed() to prepare to start iterating.
     * It develops a "node queue" for each non-leaf level of the tree.
     * Levels are numbered "bottom-up" so that level 0 is a list of leaf
     * nodes from a low-level non-leaf node. The queue at a given level L
     * consists of nodequeue[L] which is the children of a BNodeInternal,
     * and nodeindex[L], the current index within that child list, such
     * such that nodequeue[L-1] === nodequeue[L][nodeindex[L]].children.
     * (However inside this function the order is reversed.)
     */
    findPath(key) {
        var nextnode = this._root;
        var nodequeue, nodeindex;
        if (nextnode.isLeaf) {
            (nodequeue = EmptyArray), (nodeindex = EmptyArray); // avoid allocations
        }
        else {
            (nodequeue = []), (nodeindex = []);
            for (var d = 0; !nextnode.isLeaf; d++) {
                nodequeue[d] = nextnode.children;
                nodeindex[d] =
                    key === undefined ? 0 : nextnode.indexOf(key, 0, this._compare);
                if (nodeindex[d] >= nodequeue[d].length)
                    return; // first key > maxKey()
                nextnode = nodequeue[d][nodeindex[d]];
            }
            nodequeue.reverse();
            nodeindex.reverse();
        }
        return { nodequeue, nodeindex, leaf: nextnode };
    }
    /** Returns a new iterator for iterating the keys of each pair in ascending order.
     *  @param firstKey: Minimum key to include in the output. */
    keys(firstKey) {
        var it = this.entries(firstKey, ReusedArray);
        return iterator(() => {
            var n = it.next();
            if (n.value)
                n.value = n.value[0];
            return n;
        });
    }
    /** Returns a new iterator for iterating the values of each pair in order by key.
     *  @param firstKey: Minimum key whose associated value is included in the output. */
    values(firstKey) {
        var it = this.entries(firstKey, ReusedArray);
        return iterator(() => {
            var n = it.next();
            if (n.value)
                n.value = n.value[1];
            return n;
        });
    }
    // Additional methods /////////////////////////////////////////////////////
    /** Returns the maximum number of children/values before nodes will split. */
    get maxNodeSize() {
        return this._maxNodeSize;
    }
    /** Gets the lowest key in the tree. Complexity: O(log size) */
    minKey() {
        return this._root.minKey();
    }
    /** Gets the highest key in the tree. Complexity: O(1) */
    maxKey() {
        return this._root.maxKey();
    }
    /** Quickly clones the tree by marking the root node as shared.
     *  Both copies remain editable. When you modify either copy, any
     *  nodes that are shared (or potentially shared) between the two
     *  copies are cloned so that the changes do not affect other copies.
     *  This is known as copy-on-write behavior, or "lazy copying". */
    clone() {
        this._root.isShared = true;
        var result = new BTree(undefined, this._compare, this._maxNodeSize);
        result._root = this._root;
        result._size = this._size;
        return result;
    }
    /** Performs a greedy clone, immediately duplicating any nodes that are
     *  not currently marked as shared, in order to avoid marking any nodes
     *  as shared.
     *  @param force Clone all nodes, even shared ones.
     */
    greedyClone(force) {
        var result = new BTree(undefined, this._compare, this._maxNodeSize);
        result._root = this._root.greedyClone(force);
        result._size = this._size;
        return result;
    }
    /** Gets an array filled with the contents of the tree, sorted by key */
    toArray(maxLength = 0x7fffffff) {
        let min = this.minKey(), max = this.maxKey();
        if (min !== undefined)
            return this.getRange(min, max, true, maxLength);
        return [];
    }
    /** Gets an array of all keys, sorted */
    keysArray() {
        var results = [];
        this._root.forRange(this.minKey(), this.maxKey(), true, false, this, 0, (k, v) => {
            results.push(k);
        });
        return results;
    }
    /** Gets an array of all values, sorted by key */
    valuesArray() {
        var results = [];
        this._root.forRange(this.minKey(), this.maxKey(), true, false, this, 0, (k, v) => {
            results.push(v);
        });
        return results;
    }
    /** Gets a string representing the tree's data based on toArray(). */
    toString() {
        return this.toArray().toString();
    }
    /** Stores a key-value pair only if the key doesn't already exist in the tree.
     * @returns true if a new key was added
     */
    setIfNotPresent(key, value) {
        return this.set(key, value, false);
    }
    /** Returns the next pair whose key is larger than the specified key (or undefined if there is none) */
    nextHigherPair(key) {
        var it = this.entries(key, ReusedArray);
        var r = it.next();
        if (!r.done && this._compare(r.value[0], key) <= 0)
            r = it.next();
        return r.value;
    }
    /** Returns the next key larger than the specified key (or undefined if there is none) */
    nextHigherKey(key) {
        var p = this.nextHigherPair(key);
        return p ? p[0] : p;
    }
    /** Returns the next pair whose key is smaller than the specified key (or undefined if there is none) */
    nextLowerPair(key) {
        var it = this.entriesReversed(key, ReusedArray, true);
        return it.next().value;
    }
    /** Returns the next key smaller than the specified key (or undefined if there is none) */
    nextLowerKey(key) {
        var p = this.nextLowerPair(key);
        return p ? p[0] : p;
    }
    /** Edits the value associated with a key in the tree, if it already exists.
     * @returns true if the key existed, false if not.
     */
    changeIfPresent(key, value) {
        return this.editRange(key, key, true, (k, v) => ({ value })) !== 0;
    }
    /**
     * Builds an array of pairs from the specified range of keys, sorted by key.
     * Each returned pair is also an array: pair[0] is the key, pair[1] is the value.
     * @param low The first key in the array will be greater than or equal to `low`.
     * @param high This method returns when a key larger than this is reached.
     * @param includeHigh If the `high` key is present, its pair will be included
     *        in the output if and only if this parameter is true. Note: if the
     *        `low` key is present, it is always included in the output.
     * @param maxLength Length limit. getRange will stop scanning the tree when
     *                  the array reaches this size.
     * @description Computational complexity: O(result.length + log size)
     */
    getRange(low, high, includeHigh, maxLength = 0x3ffffff) {
        var results = [];
        this._root.forRange(low, high, includeHigh, false, this, 0, (k, v) => {
            results.push([k, v]);
            return results.length > maxLength ? Break : undefined;
        });
        return results;
    }
    /** Adds all pairs from a list of key-value pairs.
     * @param pairs Pairs to add to this tree. If there are duplicate keys,
     *        later pairs currently overwrite earlier ones (e.g. [[0,1],[0,7]]
     *        associates 0 with 7.)
     * @param overwrite Whether to overwrite pairs that already exist (if false,
     *        pairs[i] is ignored when the key pairs[i][0] already exists.)
     * @returns The number of pairs added to the collection.
     * @description Computational complexity: O(pairs.length * log(size + pairs.length))
     */
    setPairs(pairs, overwrite) {
        var added = 0;
        for (var i = 0; i < pairs.length; i++)
            if (this.set(pairs[i][0], pairs[i][1], overwrite))
                added++;
        return added;
    }
    /**
     * Scans the specified range of keys, in ascending order by key.
     * Note: the callback `onFound` must not insert or remove items in the
     * collection. Doing so may cause incorrect data to be sent to the
     * callback afterward.
     * @param low The first key scanned will be greater than or equal to `low`.
     * @param high Scanning stops when a key larger than this is reached.
     * @param includeHigh If the `high` key is present, `onFound` is called for
     *        that final pair if and only if this parameter is true.
     * @param onFound A function that is called for each key-value pair. This
     *        function can return {break:R} to stop early with result R.
     * @param initialCounter Initial third argument of onFound. This value
     *        increases by one each time `onFound` is called. Default: 0
     * @returns The number of values found, or R if the callback returned
     *        `{break:R}` to stop early.
     * @description Computational complexity: O(number of items scanned + log size)
     */
    forRange(low, high, includeHigh, onFound, initialCounter) {
        var r = this._root.forRange(low, high, includeHigh, false, this, initialCounter || 0, onFound);
        return typeof r === "number" ? r : r.break;
    }
    /**
     * Scans and potentially modifies values for a subsequence of keys.
     * Note: the callback `onFound` should ideally be a pure function.
     *   Specfically, it must not insert items, call clone(), or change
     *   the collection except via return value; out-of-band editing may
     *   cause an exception or may cause incorrect data to be sent to
     *   the callback (duplicate or missed items). It must not cause a
     *   clone() of the collection, otherwise the clone could be modified
     *   by changes requested by the callback.
     * @param low The first key scanned will be greater than or equal to `low`.
     * @param high Scanning stops when a key larger than this is reached.
     * @param includeHigh If the `high` key is present, `onFound` is called for
     *        that final pair if and only if this parameter is true.
     * @param onFound A function that is called for each key-value pair. This
     *        function can return `{value:v}` to change the value associated
     *        with the current key, `{delete:true}` to delete the current pair,
     *        `{break:R}` to stop early with result R, or it can return nothing
     *        (undefined or {}) to cause no effect and continue iterating.
     *        `{break:R}` can be combined with one of the other two commands.
     *        The third argument `counter` is the number of items iterated
     *        previously; it equals 0 when `onFound` is called the first time.
     * @returns The number of values scanned, or R if the callback returned
     *        `{break:R}` to stop early.
     * @description
     *   Computational complexity: O(number of items scanned + log size)
     *   Note: if the tree has been cloned with clone(), any shared
     *   nodes are copied before `onFound` is called. This takes O(n) time
     *   where n is proportional to the amount of shared data scanned.
     */
    editRange(low, high, includeHigh, onFound, initialCounter) {
        var root = this._root;
        if (root.isShared)
            this._root = root = root.clone();
        try {
            var r = root.forRange(low, high, includeHigh, true, this, initialCounter || 0, onFound);
            return typeof r === "number" ? r : r.break;
        }
        finally {
            while (root.keys.length <= 1 && !root.isLeaf)
                this._root = root =
                    root.keys.length === 0
                        ? EmptyLeaf
                        : root.children[0];
        }
    }
    /** Same as `editRange` except that the callback is called for all pairs. */
    editAll(onFound, initialCounter) {
        return this.editRange(this.minKey(), this.maxKey(), true, onFound, initialCounter);
    }
    /**
     * Removes a range of key-value pairs from the B+ tree.
     * @param low The first key scanned will be greater than or equal to `low`.
     * @param high Scanning stops when a key larger than this is reached.
     * @param includeHigh Specifies whether the `high` key, if present, is deleted.
     * @returns The number of key-value pairs that were deleted.
     * @description Computational complexity: O(log size + number of items deleted)
     */
    deleteRange(low, high, includeHigh) {
        return this.editRange(low, high, includeHigh, DeleteRange);
    }
    /** Deletes a series of keys from the collection. */
    deleteKeys(keys) {
        for (var i = 0, r = 0; i < keys.length; i++)
            if (this.delete(keys[i]))
                r++;
        return r;
    }
    /** Gets the height of the tree: the number of internal nodes between the
     *  BTree object and its leaf nodes (zero if there are no internal nodes). */
    get height() {
        for (var node = this._root, h = -1; node != null; h++)
            node = node.children;
        return h;
    }
    /** Makes the object read-only to ensure it is not accidentally modified.
     *  Freezing does not have to be permanent; unfreeze() reverses the effect.
     *  This is accomplished by replacing mutator functions with a function
     *  that throws an Error. Compared to using a property (e.g. this.isFrozen)
     *  this implementation gives better performance in non-frozen BTrees.
     */
    freeze() {
        var t = this;
        // Note: all other mutators ultimately call set() or editRange()
        //       so we don't need to override those others.
        t.clear = t.set = t.editRange = function () {
            throw new Error("Attempted to modify a frozen BTree");
        };
    }
    /** Ensures mutations are allowed, reversing the effect of freeze(). */
    unfreeze() {
        delete this.clear;
        delete this.set;
        delete this.editRange;
    }
    /** Returns true if the tree appears to be frozen. */
    get isFrozen() {
        return this.hasOwnProperty("editRange");
    }
    /** Scans the tree for signs of serious bugs (e.g. this.size doesn't match
     *  number of elements, internal nodes not caching max element properly...)
     *  Computational complexity: O(number of nodes), i.e. O(size). This method
     *  skips the most expensive test - whether all keys are sorted - but it
     *  does check that maxKey() of the children of internal nodes are sorted. */
    checkValid() {
        var size = this._root.checkValid(0, this);
        check$1(size === this.size, "size mismatch: counted ", size, "but stored", this.size);
    }
}
if (Symbol && Symbol.iterator)
    // iterator is equivalent to entries()
    BTree.prototype[Symbol.iterator] = BTree.prototype.entries;
BTree.prototype.where = BTree.prototype.filter;
BTree.prototype.setRange = BTree.prototype.setPairs;
BTree.prototype.add = BTree.prototype.set;
function iterator(next = () => ({
    done: true,
    value: undefined,
})) {
    var result = { next };
    if (Symbol && Symbol.iterator)
        result[Symbol.iterator] = function () {
            return this;
        };
    return result;
}
/** Leaf node / base class. **************************************************/
class BNode {
    constructor(keys = [], values) {
        this.keys = keys;
        this.values = values || undefVals;
        this.isShared = undefined;
    }
    get isLeaf() {
        return this.children === undefined;
    }
    // Shared methods /////////////////////////////////////////////////////////
    maxKey() {
        return this.keys[this.keys.length - 1];
    }
    // If key not found, returns i^failXor where i is the insertion index.
    // Callers that don't care whether there was a match will set failXor=0.
    indexOf(key, failXor, cmp) {
        // TODO: benchmark multiple search strategies
        const keys = this.keys;
        var lo = 0, hi = keys.length, mid = hi >> 1;
        while (lo < hi) {
            var c = cmp(keys[mid], key);
            if (c < 0)
                lo = mid + 1;
            else if (c > 0)
                // key < keys[mid]
                hi = mid;
            else if (c === 0)
                return mid;
            else {
                // c is NaN or otherwise invalid
                if (key === key)
                    // at least the search key is not NaN
                    return keys.length;
                else
                    throw new Error("BTree: NaN was used as a key");
            }
            mid = (lo + hi) >> 1;
        }
        return mid ^ failXor;
        // Unrolled version: benchmarks show same speed, not worth using
        /*var i = 1, c: number = 0, sum = 0;
        if (keys.length >= 4) {
          i = 3;
          if (keys.length >= 8) {
            i = 7;
            if (keys.length >= 16) {
              i = 15;
              if (keys.length >= 32) {
                i = 31;
                if (keys.length >= 64) {
                  i = 127;
                  i += (c = i < keys.length ? cmp(keys[i], key) : 1) < 0 ? 64 : -64;
                  sum += c;
                  i += (c = i < keys.length ? cmp(keys[i], key) : 1) < 0 ? 32 : -32;
                  sum += c;
                }
                i += (c = i < keys.length ? cmp(keys[i], key) : 1) < 0 ? 16 : -16;
                sum += c;
              }
              i += (c = i < keys.length ? cmp(keys[i], key) : 1) < 0 ? 8 : -8;
              sum += c;
            }
            i += (c = i < keys.length ? cmp(keys[i], key) : 1) < 0 ? 4 : -4;
            sum += c;
          }
          i += (c = i < keys.length ? cmp(keys[i], key) : 1) < 0 ? 2 : -2;
          sum += c;
        }
        i += (c = i < keys.length ? cmp(keys[i], key) : 1) < 0 ? 1 : -1;
        c = i < keys.length ? cmp(keys[i], key) : 1;
        sum += c;
        if (c < 0) {
          ++i;
          c = i < keys.length ? cmp(keys[i], key) : 1;
          sum += c;
        }
        if (sum !== sum) {
          if (key === key) // at least the search key is not NaN
            return keys.length ^ failXor;
          else
            throw new Error("BTree: NaN was used as a key");
        }
        return c === 0 ? i : i ^ failXor;*/
    }
    // Leaf Node: misc //////////////////////////////////////////////////////////
    minKey() {
        return this.keys[0];
    }
    clone() {
        var v = this.values;
        return new BNode(this.keys.slice(0), v === undefVals ? v : v.slice(0));
    }
    greedyClone(force) {
        return this.isShared && !force ? this : this.clone();
    }
    get(key, defaultValue, tree) {
        var i = this.indexOf(key, -1, tree._compare);
        return i < 0 ? defaultValue : this.values[i];
    }
    checkValid(depth, tree) {
        var kL = this.keys.length, vL = this.values.length;
        check$1(this.values === undefVals ? kL <= vL : kL === vL, "keys/values length mismatch: depth", depth, "with lengths", kL, vL);
        // Note: we don't check for "node too small" because sometimes a node
        // can legitimately have size 1. This occurs if there is a batch
        // deletion, leaving a node of size 1, and the siblings are full so
        // it can't be merged with adjacent nodes. However, the parent will
        // verify that the average node size is at least half of the maximum.
        check$1(depth == 0 || kL > 0, "empty leaf at depth", depth);
        return kL;
    }
    // Leaf Node: set & node splitting //////////////////////////////////////////
    set(key, value, overwrite, tree) {
        var i = this.indexOf(key, -1, tree._compare);
        if (i < 0) {
            // key does not exist yet
            i = ~i;
            tree._size++;
            if (this.keys.length < tree._maxNodeSize) {
                return this.insertInLeaf(i, key, value, tree);
            }
            else {
                // This leaf node is full and must split
                var newRightSibling = this.splitOffRightSide(), target = this;
                if (i > this.keys.length) {
                    i -= this.keys.length;
                    target = newRightSibling;
                }
                target.insertInLeaf(i, key, value, tree);
                return newRightSibling;
            }
        }
        else {
            // Key already exists
            if (overwrite !== false) {
                if (value !== undefined)
                    this.reifyValues();
                // usually this is a no-op, but some users may wish to edit the key
                this.keys[i] = key;
                this.values[i] = value;
            }
            return false;
        }
    }
    reifyValues() {
        if (this.values === undefVals)
            return (this.values = this.values.slice(0, this.keys.length));
        return this.values;
    }
    insertInLeaf(i, key, value, tree) {
        this.keys.splice(i, 0, key);
        if (this.values === undefVals) {
            while (undefVals.length < tree._maxNodeSize)
                undefVals.push(undefined);
            if (value === undefined) {
                return true;
            }
            else {
                this.values = undefVals.slice(0, this.keys.length - 1);
            }
        }
        this.values.splice(i, 0, value);
        return true;
    }
    takeFromRight(rhs) {
        // Reminder: parent node must update its copy of key for this node
        // assert: neither node is shared
        // assert rhs.keys.length > (maxNodeSize/2 && this.keys.length<maxNodeSize)
        var v = this.values;
        if (rhs.values === undefVals) {
            if (v !== undefVals)
                v.push(undefined);
        }
        else {
            v = this.reifyValues();
            v.push(rhs.values.shift());
        }
        this.keys.push(rhs.keys.shift());
    }
    takeFromLeft(lhs) {
        // Reminder: parent node must update its copy of key for this node
        // assert: neither node is shared
        // assert rhs.keys.length > (maxNodeSize/2 && this.keys.length<maxNodeSize)
        var v = this.values;
        if (lhs.values === undefVals) {
            if (v !== undefVals)
                v.unshift(undefined);
        }
        else {
            v = this.reifyValues();
            v.unshift(lhs.values.pop());
        }
        this.keys.unshift(lhs.keys.pop());
    }
    splitOffRightSide() {
        // Reminder: parent node must update its copy of key for this node
        var half = this.keys.length >> 1, keys = this.keys.splice(half);
        var values = this.values === undefVals ? undefVals : this.values.splice(half);
        return new BNode(keys, values);
    }
    // Leaf Node: scanning & deletions //////////////////////////////////////////
    forRange(low, high, includeHigh, editMode, tree, count, onFound) {
        var cmp = tree._compare;
        var iLow, iHigh;
        if (high === low) {
            if (!includeHigh)
                return count;
            iHigh = (iLow = this.indexOf(low, -1, cmp)) + 1;
            if (iLow < 0)
                return count;
        }
        else {
            iLow = this.indexOf(low, 0, cmp);
            iHigh = this.indexOf(high, -1, cmp);
            if (iHigh < 0)
                iHigh = ~iHigh;
            else if (includeHigh === true)
                iHigh++;
        }
        var keys = this.keys, values = this.values;
        if (onFound !== undefined) {
            for (var i = iLow; i < iHigh; i++) {
                var key = keys[i];
                var result = onFound(key, values[i], count++);
                if (result !== undefined) {
                    if (editMode === true) {
                        if (key !== keys[i] || this.isShared === true)
                            throw new Error("BTree illegally changed or cloned in editRange");
                        if (result.delete) {
                            this.keys.splice(i, 1);
                            if (this.values !== undefVals)
                                this.values.splice(i, 1);
                            tree._size--;
                            i--;
                            iHigh--;
                        }
                        else if (result.hasOwnProperty("value")) {
                            values[i] = result.value;
                        }
                    }
                    if (result.break !== undefined)
                        return result;
                }
            }
        }
        else
            count += iHigh - iLow;
        return count;
    }
    /** Adds entire contents of right-hand sibling (rhs is left unchanged) */
    mergeSibling(rhs, _) {
        this.keys.push.apply(this.keys, rhs.keys);
        if (this.values === undefVals) {
            if (rhs.values === undefVals)
                return;
            this.values = this.values.slice(0, this.keys.length);
        }
        this.values.push.apply(this.values, rhs.reifyValues());
    }
}
/** Internal node (non-leaf node) ********************************************/
class BNodeInternal extends BNode {
    constructor(children, keys) {
        if (!keys) {
            keys = [];
            for (var i = 0; i < children.length; i++)
                keys[i] = children[i].maxKey();
        }
        super(keys);
        this.children = children;
    }
    clone() {
        var children = this.children.slice(0);
        for (var i = 0; i < children.length; i++)
            children[i].isShared = true;
        return new BNodeInternal(children, this.keys.slice(0));
    }
    greedyClone(force) {
        if (this.isShared && !force)
            return this;
        var nu = new BNodeInternal(this.children.slice(0), this.keys.slice(0));
        for (var i = 0; i < nu.children.length; i++)
            nu.children[i] = nu.children[i].greedyClone();
        return nu;
    }
    minKey() {
        return this.children[0].minKey();
    }
    get(key, defaultValue, tree) {
        var i = this.indexOf(key, 0, tree._compare), children = this.children;
        return i < children.length
            ? children[i].get(key, defaultValue, tree)
            : undefined;
    }
    checkValid(depth, tree) {
        var kL = this.keys.length, cL = this.children.length;
        check$1(kL === cL, "keys/children length mismatch: depth", depth, "lengths", kL, cL);
        check$1(kL > 1, "internal node has length", kL, "at depth", depth);
        var size = 0, c = this.children, k = this.keys, childSize = 0;
        for (var i = 0; i < cL; i++) {
            size += c[i].checkValid(depth + 1, tree);
            childSize += c[i].keys.length;
            check$1(size >= childSize, "wtf"); // no way this will ever fail
            check$1(i === 0 || c[i - 1].constructor === c[i].constructor, "type mismatch");
            if (c[i].maxKey() != k[i])
                check$1(false, "keys[", i, "] =", k[i], "is wrong, should be ", c[i].maxKey(), "at depth", depth);
            if (!(i === 0 || tree._compare(k[i - 1], k[i]) < 0))
                check$1(false, "sort violation at depth", depth, "index", i, "keys", k[i - 1], k[i]);
        }
        var toofew = childSize < (tree.maxNodeSize >> 1) * cL;
        if (toofew || childSize > tree.maxNodeSize * cL)
            check$1(false, toofew ? "too few" : "too many", "children (", childSize, size, ") at depth", depth, ", maxNodeSize:", tree.maxNodeSize, "children.length:", cL);
        return size;
    }
    // Internal Node: set & node splitting //////////////////////////////////////
    set(key, value, overwrite, tree) {
        var c = this.children, max = tree._maxNodeSize, cmp = tree._compare;
        var i = Math.min(this.indexOf(key, 0, cmp), c.length - 1), child = c[i];
        if (child.isShared)
            c[i] = child = child.clone();
        if (child.keys.length >= max) {
            // child is full; inserting anything else will cause a split.
            // Shifting an item to the left or right sibling may avoid a split.
            // We can do a shift if the adjacent node is not full and if the
            // current key can still be placed in the same node after the shift.
            var other;
            if (i > 0 &&
                (other = c[i - 1]).keys.length < max &&
                cmp(child.keys[0], key) < 0) {
                if (other.isShared)
                    c[i - 1] = other = other.clone();
                other.takeFromRight(child);
                this.keys[i - 1] = other.maxKey();
            }
            else if ((other = c[i + 1]) !== undefined &&
                other.keys.length < max &&
                cmp(child.maxKey(), key) < 0) {
                if (other.isShared)
                    c[i + 1] = other = other.clone();
                other.takeFromLeft(child);
                this.keys[i] = c[i].maxKey();
            }
        }
        var result = child.set(key, value, overwrite, tree);
        if (result === false)
            return false;
        this.keys[i] = child.maxKey();
        if (result === true)
            return true;
        // The child has split and `result` is a new right child... does it fit?
        if (this.keys.length < max) {
            // yes
            this.insert(i + 1, result);
            return true;
        }
        else {
            // no, we must split also
            var newRightSibling = this.splitOffRightSide(), target = this;
            if (cmp(result.maxKey(), this.maxKey()) > 0) {
                target = newRightSibling;
                i -= this.keys.length;
            }
            target.insert(i + 1, result);
            return newRightSibling;
        }
    }
    insert(i, child) {
        this.children.splice(i, 0, child);
        this.keys.splice(i, 0, child.maxKey());
    }
    splitOffRightSide() {
        var half = this.children.length >> 1;
        return new BNodeInternal(this.children.splice(half), this.keys.splice(half));
    }
    takeFromRight(rhs) {
        // Reminder: parent node must update its copy of key for this node
        // assert: neither node is shared
        // assert rhs.keys.length > (maxNodeSize/2 && this.keys.length<maxNodeSize)
        this.keys.push(rhs.keys.shift());
        this.children.push(rhs.children.shift());
    }
    takeFromLeft(lhs) {
        // Reminder: parent node must update its copy of key for this node
        // assert: neither node is shared
        // assert rhs.keys.length > (maxNodeSize/2 && this.keys.length<maxNodeSize)
        this.keys.unshift(lhs.keys.pop());
        this.children.unshift(lhs.children.pop());
    }
    // Internal Node: scanning & deletions //////////////////////////////////////
    forRange(low, high, includeHigh, editMode, tree, count, onFound) {
        var cmp = tree._compare;
        var iLow = this.indexOf(low, 0, cmp), i = iLow;
        var iHigh = Math.min(high === low ? iLow : this.indexOf(high, 0, cmp), this.keys.length - 1);
        var keys = this.keys, children = this.children;
        if (!editMode) {
            // Simple case
            for (; i <= iHigh; i++) {
                var result = children[i].forRange(low, high, includeHigh, editMode, tree, count, onFound);
                if (typeof result !== "number")
                    return result;
                count = result;
            }
        }
        else if (i <= iHigh) {
            try {
                for (; i <= iHigh; i++) {
                    if (children[i].isShared)
                        children[i] = children[i].clone();
                    var result = children[i].forRange(low, high, includeHigh, editMode, tree, count, onFound);
                    keys[i] = children[i].maxKey();
                    if (typeof result !== "number")
                        return result;
                    count = result;
                }
            }
            finally {
                // Deletions may have occurred, so look for opportunities to merge nodes.
                var half = tree._maxNodeSize >> 1;
                if (iLow > 0)
                    iLow--;
                for (i = iHigh; i >= iLow; i--) {
                    if (children[i].keys.length <= half)
                        this.tryMerge(i, tree._maxNodeSize);
                }
                // Are we completely empty?
                if (children[0].keys.length === 0) {
                    check$1(children.length === 1 && keys.length === 1, "emptiness bug");
                    children.shift();
                    keys.shift();
                }
            }
        }
        return count;
    }
    /** Merges child i with child i+1 if their combined size is not too large */
    tryMerge(i, maxSize) {
        var children = this.children;
        if (i >= 0 && i + 1 < children.length) {
            if (children[i].keys.length + children[i + 1].keys.length <= maxSize) {
                if (children[i].isShared)
                    // cloned already UNLESS i is outside scan range
                    children[i] = children[i].clone();
                children[i].mergeSibling(children[i + 1], maxSize);
                children.splice(i + 1, 1);
                this.keys.splice(i + 1, 1);
                this.keys[i] = children[i].maxKey();
                return true;
            }
        }
        return false;
    }
    mergeSibling(rhs, maxNodeSize) {
        // assert !this.isShared;
        var oldLength = this.keys.length;
        this.keys.push.apply(this.keys, rhs.keys);
        this.children.push.apply(this.children, rhs.children);
        // If our children are themselves almost empty due to a mass-delete,
        // they may need to be merged too (but only the oldLength-1 and its
        // right sibling should need this).
        this.tryMerge(oldLength - 1, maxNodeSize);
    }
}
// Optimization: this array of `undefined`s is used instead of a normal
// array of values in nodes where `undefined` is the only value.
// Its length is extended to max node size on first use; since it can
// be shared between trees with different maximums, its length can only
// increase, never decrease. Its type should be undefined[] but strangely
// TypeScript won't allow the comparison V[] === undefined[]. To prevent
// users from making this array too large, BTree has a maximum node size.
var undefVals = [];
const Delete = { delete: true }, DeleteRange = () => Delete;
const Break = { break: true };
const EmptyLeaf = (function () {
    var n = new BNode();
    n.isShared = true;
    return n;
})();
const EmptyArray = [];
const ReusedArray = []; // assumed thread-local
function check$1(fact, ...args) {
    if (!fact) {
        args.unshift("B+ tree "); // at beginning of message
        throw new Error(args.join(" "));
    }
}
/** A BTree frozen in the empty state. */
const EmptyBTree = (() => {
    let t = new BTree();
    t.freeze();
    return t;
})();

/*
 Copyright 2017 Jeremy Scheff
 Copyright 2019 Florian Dold

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
*/
// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-extracting-a-key-from-a-value-using-a-key-path
const extractKey = (keyPath, value) => {
    if (Array.isArray(keyPath)) {
        const result = [];
        for (let item of keyPath) {
            // This doesn't make sense to me based on the spec, but it is needed to pass the W3C KeyPath tests (see same
            // comment in validateKeyPath)
            if (item !== undefined &&
                item !== null &&
                typeof item !== "string" &&
                item.toString) {
                item = item.toString();
            }
            result.push(valueToKey(extractKey(item, value)));
        }
        return result;
    }
    if (keyPath === "") {
        return value;
    }
    let remainingKeyPath = keyPath;
    let object = value;
    while (remainingKeyPath !== null) {
        let identifier;
        const i = remainingKeyPath.indexOf(".");
        if (i >= 0) {
            identifier = remainingKeyPath.slice(0, i);
            remainingKeyPath = remainingKeyPath.slice(i + 1);
        }
        else {
            identifier = remainingKeyPath;
            remainingKeyPath = null;
        }
        if (!object.hasOwnProperty(identifier)) {
            return;
        }
        object = object[identifier];
    }
    return object;
};

/*
 Copyright 2017 Jeremy Scheff
 Copyright 2019 Florian Dold

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
*/
function injectKey(keyPath, value, key) {
    if (Array.isArray(keyPath)) {
        // tslint:disable-next-line max-line-length
        throw new Error("The key paths used in this section are always strings and never sequences, since it is not possible to create a object store which has a key generator and also has a key path that is a sequence.");
    }
    const identifiers = keyPath.split(".");
    if (identifiers.length === 0) {
        throw new Error("Assert: identifiers is not empty");
    }
    const lastIdentifier = identifiers.pop();
    if (lastIdentifier === null || lastIdentifier === undefined) {
        throw Error();
    }
    for (const identifier of identifiers) {
        if (typeof value !== "object" && !Array.isArray(value)) {
            return false;
        }
        const hop = value.hasOwnProperty(identifier);
        if (!hop) {
            return true;
        }
        value = value[identifier];
    }
    if (!(typeof value === "object" || Array.isArray(value))) {
        throw new Error("can't inject key");
    }
    const newValue = structuredClone(value);
    newValue[lastIdentifier] = structuredClone(key);
    return newValue;
}

/*
 Copyright 2019 Florian Dold

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
*/
function makeStoreKeyValue(value, key, currentKeyGenerator, autoIncrement, keyPath) {
    const haveKey = key !== null && key !== undefined;
    const haveKeyPath = keyPath !== null && keyPath !== undefined;
    // This models a decision table on (haveKey, haveKeyPath, autoIncrement)
    value = structuredClone(value);
    if (haveKey) {
        if (haveKeyPath) {
            // (yes, yes, no)
            // (yes, yes, yes)
            throw new DataError();
        }
        else {
            if (autoIncrement) {
                // (yes, no, yes)
                key = valueToKey(key);
                let updatedKeyGenerator;
                if (typeof key !== "number") {
                    updatedKeyGenerator = currentKeyGenerator;
                }
                else {
                    updatedKeyGenerator = key;
                }
                return {
                    key: key,
                    value: value,
                    updatedKeyGenerator,
                };
            }
            else {
                // (yes, no, no)
                throw new DataError();
            }
        }
    }
    else {
        if (haveKeyPath) {
            if (autoIncrement) {
                // (no, yes, yes)
                let updatedKeyGenerator;
                const maybeInlineKey = extractKey(keyPath, value);
                if (maybeInlineKey === undefined) {
                    value = injectKey(keyPath, value, currentKeyGenerator);
                    key = currentKeyGenerator;
                    updatedKeyGenerator = currentKeyGenerator + 1;
                }
                else if (typeof maybeInlineKey === "number") {
                    key = maybeInlineKey;
                    if (maybeInlineKey >= currentKeyGenerator) {
                        updatedKeyGenerator = maybeInlineKey + 1;
                    }
                    else {
                        updatedKeyGenerator = currentKeyGenerator;
                    }
                }
                else {
                    key = maybeInlineKey;
                    updatedKeyGenerator = currentKeyGenerator;
                }
                return {
                    key: key,
                    value: value,
                    updatedKeyGenerator,
                };
            }
            else {
                // (no, yes, no)
                key = extractKey(keyPath, value);
                key = valueToKey(key);
                return {
                    key: key,
                    value: value,
                    updatedKeyGenerator: currentKeyGenerator,
                };
            }
        }
        else {
            if (autoIncrement) {
                // (no, no, yes)
                return {
                    key: currentKeyGenerator,
                    value: value,
                    updatedKeyGenerator: currentKeyGenerator + 1,
                };
            }
            else {
                // (no, no, no)
                throw new DataError();
            }
        }
    }
}

/*
 Copyright 2017 Jeremy Scheff
 Copyright 2019 Florian Dold

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
*/
function getIndexKeys(value, keyPath, multiEntry) {
    if (multiEntry && Array.isArray(keyPath)) {
        const keys = [];
        for (const subkeyPath of keyPath) {
            const key = extractKey(subkeyPath, value);
            try {
                const k = valueToKey(key);
                keys.push(k);
            }
            catch (_a) {
                // Ignore invalid subkeys
            }
        }
        return keys;
    }
    else {
        let key = extractKey(keyPath, value);
        return [valueToKey(key)];
    }
}

/*
 Copyright 2019 Florian Dold

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */
var TransactionLevel;
(function (TransactionLevel) {
    TransactionLevel[TransactionLevel["Disconnected"] = 0] = "Disconnected";
    TransactionLevel[TransactionLevel["Connected"] = 1] = "Connected";
    TransactionLevel[TransactionLevel["Read"] = 2] = "Read";
    TransactionLevel[TransactionLevel["Write"] = 3] = "Write";
    TransactionLevel[TransactionLevel["VersionChange"] = 4] = "VersionChange";
})(TransactionLevel || (TransactionLevel = {}));
class AsyncCondition$1 {
    constructor() {
        const op = openPromise$1();
        this._waitPromise = op.promise;
        this._resolveWaitPromise = op.resolve;
    }
    wait() {
        return this._waitPromise;
    }
    trigger() {
        this._resolveWaitPromise();
        const op = openPromise$1();
        this._waitPromise = op.promise;
        this._resolveWaitPromise = op.resolve;
    }
}
function nextStoreKey(forward, data, k) {
    if (k === undefined || k === null) {
        return undefined;
    }
    const res = forward ? data.nextHigherPair(k) : data.nextLowerPair(k);
    if (!res) {
        return undefined;
    }
    return res[1].primaryKey;
}
function furthestKey(forward, key1, key2) {
    if (key1 === undefined) {
        return key2;
    }
    if (key2 === undefined) {
        return key1;
    }
    const cmpResult = compareKeys(key1, key2);
    if (cmpResult === 0) {
        // Same result
        return key1;
    }
    if (forward && cmpResult === 1) {
        return key1;
    }
    if (forward && cmpResult === -1) {
        return key2;
    }
    if (!forward && cmpResult === 1) {
        return key2;
    }
    if (!forward && cmpResult === -1) {
        return key1;
    }
}
/**
 * Primitive in-memory backend.
 *
 * @public
 */
class MemoryBackend {
    constructor() {
        this.databases = {};
        this.connectionIdCounter = 1;
        this.transactionIdCounter = 1;
        /**
         * Connections by connection cookie.
         */
        this.connections = {};
        /**
         * Connections by transaction (!!) cookie.  In this implementation,
         * at most one transaction can run at the same time per connection.
         */
        this.connectionsByTransaction = {};
        /**
         * Condition that is triggered whenever a client disconnects.
         */
        this.disconnectCond = new AsyncCondition$1();
        /**
         * Conditation that is triggered whenever a transaction finishes.
         */
        this.transactionDoneCond = new AsyncCondition$1();
        this.enableTracing = false;
    }
    /**
     * Load the data in this IndexedDB backend from a dump in JSON format.
     *
     * Must be called before any connections to the database backend have
     * been made.
     */
    importDump(data) {
        if (this.enableTracing) {
            console.log("importing dump (a)");
        }
        if (this.transactionIdCounter != 1 || this.connectionIdCounter != 1) {
            throw Error("data must be imported before first transaction or connection");
        }
        this.databases = {};
        for (const dbName of Object.keys(data.databases)) {
            const schema = data.databases[dbName].schema;
            if (typeof schema !== "object") {
                throw Error("DB dump corrupt");
            }
            const objectStores = {};
            for (const objectStoreName of Object.keys(data.databases[dbName].objectStores)) {
                const dumpedObjectStore = data.databases[dbName].objectStores[objectStoreName];
                const indexes = {};
                for (const indexName of Object.keys(dumpedObjectStore.indexes)) {
                    const dumpedIndex = dumpedObjectStore.indexes[indexName];
                    const pairs = dumpedIndex.records.map((r) => {
                        return structuredClone([r.indexKey, r]);
                    });
                    const indexData = new BTree(pairs, compareKeys);
                    const index = {
                        deleted: false,
                        modifiedData: undefined,
                        modifiedName: undefined,
                        originalName: indexName,
                        originalData: indexData,
                    };
                    indexes[indexName] = index;
                }
                const pairs = dumpedObjectStore.records.map((r) => {
                    return structuredClone([r.primaryKey, r]);
                });
                const objectStoreData = new BTree(pairs, compareKeys);
                const objectStore = {
                    deleted: false,
                    modifiedData: undefined,
                    modifiedName: undefined,
                    modifiedKeyGenerator: undefined,
                    originalData: objectStoreData,
                    originalName: objectStoreName,
                    originalKeyGenerator: dumpedObjectStore.keyGenerator,
                    committedIndexes: indexes,
                    modifiedIndexes: {},
                };
                objectStores[objectStoreName] = objectStore;
            }
            const db = {
                deleted: false,
                committedObjectStores: objectStores,
                committedSchema: structuredClone(schema),
                connectionCookie: undefined,
                modifiedObjectStores: {},
                txLevel: TransactionLevel.Disconnected,
                txRestrictObjectStores: undefined,
            };
            this.databases[dbName] = db;
        }
    }
    makeObjectStoreMap(database) {
        let map = {};
        for (let objectStoreName in database.committedObjectStores) {
            const store = database.committedObjectStores[objectStoreName];
            const entry = {
                store,
                indexMap: Object.assign({}, store.committedIndexes),
            };
            map[objectStoreName] = entry;
        }
        return map;
    }
    /**
     * Export the contents of the database to JSON.
     *
     * Only exports data that has been committed.
     */
    exportDump() {
        this.enableTracing && console.log("exporting dump");
        const dbDumps = {};
        for (const dbName of Object.keys(this.databases)) {
            const db = this.databases[dbName];
            const objectStores = {};
            for (const objectStoreName of Object.keys(db.committedObjectStores)) {
                const objectStore = db.committedObjectStores[objectStoreName];
                const indexes = {};
                for (const indexName of Object.keys(objectStore.committedIndexes)) {
                    const index = objectStore.committedIndexes[indexName];
                    const indexRecords = [];
                    index.originalData.forEach((v) => {
                        indexRecords.push(structuredClone(v));
                    });
                    indexes[indexName] = { name: indexName, records: indexRecords };
                }
                const objectStoreRecords = [];
                objectStore.originalData.forEach((v) => {
                    objectStoreRecords.push(structuredClone(v));
                });
                objectStores[objectStoreName] = {
                    name: objectStoreName,
                    records: objectStoreRecords,
                    keyGenerator: objectStore.originalKeyGenerator,
                    indexes: indexes,
                };
            }
            const dbDump = {
                objectStores,
                schema: structuredClone(this.databases[dbName].committedSchema),
            };
            dbDumps[dbName] = dbDump;
        }
        return { databases: dbDumps };
    }
    getDatabases() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.enableTracing) {
                console.log("TRACING: getDatabase");
            }
            const dbList = [];
            for (const name in this.databases) {
                dbList.push({
                    name,
                    version: this.databases[name].committedSchema.databaseVersion,
                });
            }
            return dbList;
        });
    }
    deleteDatabase(tx, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.enableTracing) {
                console.log("TRACING: deleteDatabase");
            }
            const myConn = this.connectionsByTransaction[tx.transactionCookie];
            if (!myConn) {
                throw Error("no connection associated with transaction");
            }
            const myDb = this.databases[name];
            if (!myDb) {
                throw Error("db not found");
            }
            if (myDb.committedSchema.databaseName !== name) {
                throw Error("name does not match");
            }
            if (myDb.txLevel < TransactionLevel.VersionChange) {
                throw new InvalidStateError();
            }
            if (myDb.connectionCookie !== tx.transactionCookie) {
                throw new InvalidAccessError();
            }
            myDb.deleted = true;
        });
    }
    connectDatabase(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.enableTracing) {
                console.log(`TRACING: connectDatabase(${name})`);
            }
            const connectionId = this.connectionIdCounter++;
            const connectionCookie = `connection-${connectionId}`;
            let database = this.databases[name];
            if (!database) {
                const schema = {
                    databaseName: name,
                    databaseVersion: 0,
                    objectStores: {},
                };
                database = {
                    committedSchema: schema,
                    deleted: false,
                    committedObjectStores: {},
                    modifiedObjectStores: {},
                    txLevel: TransactionLevel.Disconnected,
                    connectionCookie: undefined,
                    txRestrictObjectStores: undefined,
                };
                this.databases[name] = database;
            }
            while (database.txLevel !== TransactionLevel.Disconnected) {
                yield this.disconnectCond.wait();
            }
            database.txLevel = TransactionLevel.Connected;
            database.txRestrictObjectStores = undefined;
            database.connectionCookie = connectionCookie;
            const myConn = {
                dbName: name,
                deleted: false,
                objectStoreMap: this.makeObjectStoreMap(database),
                modifiedSchema: structuredClone(database.committedSchema),
            };
            this.connections[connectionCookie] = myConn;
            return { connectionCookie };
        });
    }
    beginTransaction(conn, objectStores, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.enableTracing) {
                console.log(`TRACING: beginTransaction`);
            }
            const transactionCookie = `tx-${this.transactionIdCounter++}`;
            const myConn = this.connections[conn.connectionCookie];
            if (!myConn) {
                throw Error("connection not found");
            }
            const myDb = this.databases[myConn.dbName];
            if (!myDb) {
                throw Error("db not found");
            }
            while (myDb.txLevel !== TransactionLevel.Connected) {
                if (this.enableTracing) {
                    console.log(`TRACING: beginTransaction -- waiting for others to close`);
                }
                yield this.transactionDoneCond.wait();
            }
            if (mode === "readonly") {
                myDb.txLevel = TransactionLevel.Read;
            }
            else if (mode === "readwrite") {
                myDb.txLevel = TransactionLevel.Write;
            }
            else {
                throw Error("unsupported transaction mode");
            }
            myDb.txRestrictObjectStores = [...objectStores];
            this.connectionsByTransaction[transactionCookie] = myConn;
            return { transactionCookie };
        });
    }
    enterVersionChange(conn, newVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.enableTracing) {
                console.log(`TRACING: enterVersionChange`);
            }
            const transactionCookie = `tx-vc-${this.transactionIdCounter++}`;
            const myConn = this.connections[conn.connectionCookie];
            if (!myConn) {
                throw Error("connection not found");
            }
            const myDb = this.databases[myConn.dbName];
            if (!myDb) {
                throw Error("db not found");
            }
            while (myDb.txLevel !== TransactionLevel.Connected) {
                yield this.transactionDoneCond.wait();
            }
            myDb.txLevel = TransactionLevel.VersionChange;
            myDb.txRestrictObjectStores = undefined;
            this.connectionsByTransaction[transactionCookie] = myConn;
            myConn.modifiedSchema.databaseVersion = newVersion;
            return { transactionCookie };
        });
    }
    close(conn) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.enableTracing) {
                console.log(`TRACING: close`);
            }
            const myConn = this.connections[conn.connectionCookie];
            if (!myConn) {
                throw Error("connection not found - already closed?");
            }
            if (!myConn.deleted) {
                const myDb = this.databases[myConn.dbName];
                if (myDb.txLevel != TransactionLevel.Connected) {
                    throw Error("invalid state");
                }
                myDb.txLevel = TransactionLevel.Disconnected;
                myDb.txRestrictObjectStores = undefined;
            }
            delete this.connections[conn.connectionCookie];
            this.disconnectCond.trigger();
        });
    }
    getSchema(dbConn) {
        if (this.enableTracing) {
            console.log(`TRACING: getSchema`);
        }
        const myConn = this.connections[dbConn.connectionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        const db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        return myConn.modifiedSchema;
    }
    renameIndex(btx, objectStoreName, oldName, newName) {
        if (this.enableTracing) {
            console.log(`TRACING: renameIndex(?, ${oldName}, ${newName})`);
        }
        const myConn = this.connectionsByTransaction[btx.transactionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        const db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        if (db.txLevel < TransactionLevel.VersionChange) {
            throw Error("only allowed in versionchange transaction");
        }
        let schema = myConn.modifiedSchema;
        if (!schema) {
            throw Error();
        }
        const indexesSchema = schema.objectStores[objectStoreName].indexes;
        if (indexesSchema[newName]) {
            throw new Error("new index name already used");
        }
        if (!indexesSchema) {
            throw new Error("new index name already used");
        }
        const index = myConn.objectStoreMap[objectStoreName].indexMap[oldName];
        if (!index) {
            throw Error("old index missing in connection's index map");
        }
        indexesSchema[newName] = indexesSchema[newName];
        delete indexesSchema[oldName];
        myConn.objectStoreMap[objectStoreName].indexMap[newName] = index;
        delete myConn.objectStoreMap[objectStoreName].indexMap[oldName];
        index.modifiedName = newName;
    }
    deleteIndex(btx, objectStoreName, indexName) {
        if (this.enableTracing) {
            console.log(`TRACING: deleteIndex(${indexName})`);
        }
        const myConn = this.connections[btx.transactionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        const db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        if (db.txLevel < TransactionLevel.VersionChange) {
            throw Error("only allowed in versionchange transaction");
        }
        let schema = myConn.modifiedSchema;
        if (!schema) {
            throw Error();
        }
        if (!schema.objectStores[objectStoreName].indexes[indexName]) {
            throw new Error("index does not exist");
        }
        const index = myConn.objectStoreMap[objectStoreName].indexMap[indexName];
        if (!index) {
            throw Error("old index missing in connection's index map");
        }
        index.deleted = true;
        delete schema.objectStores[objectStoreName].indexes[indexName];
        delete myConn.objectStoreMap[objectStoreName].indexMap[indexName];
    }
    deleteObjectStore(btx, name) {
        if (this.enableTracing) {
            console.log(`TRACING: deleteObjectStore(${name})`);
        }
        const myConn = this.connections[btx.transactionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        const db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        if (db.txLevel < TransactionLevel.VersionChange) {
            throw Error("only allowed in versionchange transaction");
        }
        const schema = myConn.modifiedSchema;
        if (!schema) {
            throw Error();
        }
        const objectStoreProperties = schema.objectStores[name];
        if (!objectStoreProperties) {
            throw Error("object store not found");
        }
        const objectStoreMapEntry = myConn.objectStoreMap[name];
        if (!objectStoreMapEntry) {
            throw Error("object store not found in map");
        }
        const indexNames = Object.keys(objectStoreProperties.indexes);
        for (const indexName of indexNames) {
            this.deleteIndex(btx, name, indexName);
        }
        objectStoreMapEntry.store.deleted = true;
        delete myConn.objectStoreMap[name];
        delete schema.objectStores[name];
    }
    renameObjectStore(btx, oldName, newName) {
        if (this.enableTracing) {
            console.log(`TRACING: renameObjectStore(?, ${oldName}, ${newName})`);
        }
        const myConn = this.connections[btx.transactionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        const db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        if (db.txLevel < TransactionLevel.VersionChange) {
            throw Error("only allowed in versionchange transaction");
        }
        const schema = myConn.modifiedSchema;
        if (!schema) {
            throw Error();
        }
        if (!schema.objectStores[oldName]) {
            throw Error("object store not found");
        }
        if (schema.objectStores[newName]) {
            throw Error("new object store already exists");
        }
        const objectStoreMapEntry = myConn.objectStoreMap[oldName];
        if (!objectStoreMapEntry) {
            throw Error("object store not found in map");
        }
        objectStoreMapEntry.store.modifiedName = newName;
        schema.objectStores[newName] = schema.objectStores[oldName];
        delete schema.objectStores[oldName];
        delete myConn.objectStoreMap[oldName];
        myConn.objectStoreMap[newName] = objectStoreMapEntry;
    }
    createObjectStore(btx, name, keyPath, autoIncrement) {
        if (this.enableTracing) {
            console.log(`TRACING: createObjectStore(${btx.transactionCookie}, ${name})`);
        }
        const myConn = this.connectionsByTransaction[btx.transactionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        const db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        if (db.txLevel < TransactionLevel.VersionChange) {
            throw Error("only allowed in versionchange transaction");
        }
        const newObjectStore = {
            deleted: false,
            modifiedName: undefined,
            originalName: name,
            modifiedData: undefined,
            originalData: new BTree([], compareKeys),
            modifiedKeyGenerator: undefined,
            originalKeyGenerator: 1,
            committedIndexes: {},
            modifiedIndexes: {},
        };
        const schema = myConn.modifiedSchema;
        if (!schema) {
            throw Error("no schema for versionchange tx");
        }
        schema.objectStores[name] = {
            autoIncrement,
            keyPath,
            indexes: {},
        };
        myConn.objectStoreMap[name] = { store: newObjectStore, indexMap: {} };
        db.modifiedObjectStores[name] = newObjectStore;
    }
    createIndex(btx, indexName, objectStoreName, keyPath, multiEntry, unique) {
        if (this.enableTracing) {
            console.log(`TRACING: createIndex(${indexName})`);
        }
        const myConn = this.connectionsByTransaction[btx.transactionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        const db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        if (db.txLevel < TransactionLevel.VersionChange) {
            throw Error("only allowed in versionchange transaction");
        }
        const indexProperties = {
            keyPath,
            multiEntry,
            unique,
        };
        const newIndex = {
            deleted: false,
            modifiedData: undefined,
            modifiedName: undefined,
            originalData: new BTree([], compareKeys),
            originalName: indexName,
        };
        myConn.objectStoreMap[objectStoreName].indexMap[indexName] = newIndex;
        db.modifiedObjectStores[objectStoreName].modifiedIndexes[indexName] = newIndex;
        const schema = myConn.modifiedSchema;
        if (!schema) {
            throw Error("no schema in versionchange tx");
        }
        const objectStoreProperties = schema.objectStores[objectStoreName];
        if (!objectStoreProperties) {
            throw Error("object store not found");
        }
        objectStoreProperties.indexes[indexName] = indexProperties;
        const objectStoreMapEntry = myConn.objectStoreMap[objectStoreName];
        if (!objectStoreMapEntry) {
            throw Error("object store does not exist");
        }
        const storeData = objectStoreMapEntry.store.modifiedData ||
            objectStoreMapEntry.store.originalData;
        storeData.forEach((v, k) => {
            this.insertIntoIndex(newIndex, k, v.value, indexProperties);
        });
    }
    deleteRecord(btx, objectStoreName, range) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.enableTracing) {
                console.log(`TRACING: deleteRecord from store ${objectStoreName}`);
            }
            const myConn = this.connectionsByTransaction[btx.transactionCookie];
            if (!myConn) {
                throw Error("unknown connection");
            }
            const db = this.databases[myConn.dbName];
            if (!db) {
                throw Error("db not found");
            }
            if (db.txLevel < TransactionLevel.Write) {
                throw Error("only allowed in write transaction");
            }
            if (db.txRestrictObjectStores &&
                !db.txRestrictObjectStores.includes(objectStoreName)) {
                throw Error(`Not allowed to access store '${objectStoreName}', transaction is over ${JSON.stringify(db.txRestrictObjectStores)}`);
            }
            if (typeof range !== "object") {
                throw Error("deleteRecord got invalid range (must be object)");
            }
            if (!("lowerOpen" in range)) {
                throw Error("deleteRecord got invalid range (sanity check failed, 'lowerOpen' missing)");
            }
            const schema = myConn.modifiedSchema;
            const objectStoreMapEntry = myConn.objectStoreMap[objectStoreName];
            if (!objectStoreMapEntry.store.modifiedData) {
                objectStoreMapEntry.store.modifiedData =
                    objectStoreMapEntry.store.originalData;
            }
            let modifiedData = objectStoreMapEntry.store.modifiedData;
            let currKey;
            if (range.lower === undefined || range.lower === null) {
                currKey = modifiedData.minKey();
            }
            else {
                currKey = range.lower;
                // We have a range with an lowerOpen lower bound, so don't start
                // deleting the lower bound.  Instead start with the next higher key.
                if (range.lowerOpen && currKey !== undefined) {
                    currKey = modifiedData.nextHigherKey(currKey);
                }
            }
            // make sure that currKey is either undefined or pointing to an
            // existing object.
            let firstValue = modifiedData.get(currKey);
            if (!firstValue) {
                if (currKey !== undefined) {
                    currKey = modifiedData.nextHigherKey(currKey);
                }
            }
            // loop invariant: (currKey is undefined) or (currKey is a valid key)
            while (true) {
                if (currKey === undefined) {
                    // nothing more to delete!
                    break;
                }
                if (range.upper !== null && range.upper !== undefined) {
                    if (range.upperOpen && compareKeys(currKey, range.upper) === 0) {
                        // We have a range that's upperOpen, so stop before we delete the upper bound.
                        break;
                    }
                    if (!range.upperOpen && compareKeys(currKey, range.upper) > 0) {
                        // The upper range is inclusive, only stop if we're after the upper range.
                        break;
                    }
                }
                const storeEntry = modifiedData.get(currKey);
                if (!storeEntry) {
                    throw Error("assertion failed");
                }
                for (const indexName of Object.keys(schema.objectStores[objectStoreName].indexes)) {
                    const index = myConn.objectStoreMap[objectStoreName].indexMap[indexName];
                    if (!index) {
                        throw Error("index referenced by object store does not exist");
                    }
                    this.enableTracing &&
                        console.log(`deleting from index ${indexName} for object store ${objectStoreName}`);
                    const indexProperties = schema.objectStores[objectStoreName].indexes[indexName];
                    this.deleteFromIndex(index, storeEntry.primaryKey, storeEntry.value, indexProperties);
                }
                modifiedData = modifiedData.without(currKey);
                currKey = modifiedData.nextHigherKey(currKey);
            }
            objectStoreMapEntry.store.modifiedData = modifiedData;
        });
    }
    deleteFromIndex(index, primaryKey, value, indexProperties) {
        if (this.enableTracing) {
            console.log(`deleteFromIndex(${index.modifiedName || index.originalName})`);
        }
        if (value === undefined || value === null) {
            throw Error("cannot delete null/undefined value from index");
        }
        let indexData = index.modifiedData || index.originalData;
        const indexKeys = getIndexKeys(value, indexProperties.keyPath, indexProperties.multiEntry);
        for (const indexKey of indexKeys) {
            const existingRecord = indexData.get(indexKey);
            if (!existingRecord) {
                throw Error("db inconsistent: expected index entry missing");
            }
            const newPrimaryKeys = existingRecord.primaryKeys.filter((x) => compareKeys(x, primaryKey) !== 0);
            if (newPrimaryKeys.length === 0) {
                index.modifiedData = indexData.without(indexKey);
            }
            else {
                const newIndexRecord = {
                    indexKey,
                    primaryKeys: newPrimaryKeys,
                };
                index.modifiedData = indexData.with(indexKey, newIndexRecord, true);
            }
        }
    }
    getRecords(btx, req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.enableTracing) {
                console.log(`TRACING: getRecords`);
                console.log("query", req);
            }
            const myConn = this.connectionsByTransaction[btx.transactionCookie];
            if (!myConn) {
                throw Error("unknown connection");
            }
            const db = this.databases[myConn.dbName];
            if (!db) {
                throw Error("db not found");
            }
            if (db.txLevel < TransactionLevel.Read) {
                throw Error("only allowed while running a transaction");
            }
            if (db.txRestrictObjectStores &&
                !db.txRestrictObjectStores.includes(req.objectStoreName)) {
                throw Error(`Not allowed to access store '${req.objectStoreName}', transaction is over ${JSON.stringify(db.txRestrictObjectStores)}`);
            }
            const objectStoreMapEntry = myConn.objectStoreMap[req.objectStoreName];
            if (!objectStoreMapEntry) {
                throw Error("object store not found");
            }
            let range;
            if (req.range == null || req.range === undefined) {
                range = new BridgeIDBKeyRange(undefined, undefined, true, true);
            }
            else {
                range = req.range;
            }
            if (typeof range !== "object") {
                throw Error("getRecords was given an invalid range (sanity check failed, not an object)");
            }
            if (!("lowerOpen" in range)) {
                throw Error("getRecords was given an invalid range (sanity check failed, lowerOpen missing)");
            }
            let numResults = 0;
            let indexKeys = [];
            let primaryKeys = [];
            let values = [];
            const forward = req.direction === "next" || req.direction === "nextunique";
            const unique = req.direction === "prevunique" || req.direction === "nextunique";
            const storeData = objectStoreMapEntry.store.modifiedData ||
                objectStoreMapEntry.store.originalData;
            const haveIndex = req.indexName !== undefined;
            if (haveIndex) {
                const index = myConn.objectStoreMap[req.objectStoreName].indexMap[req.indexName];
                const indexData = index.modifiedData || index.originalData;
                let indexPos = req.lastIndexPosition;
                if (indexPos === undefined) {
                    // First time we iterate!  So start at the beginning (lower/upper)
                    // of our allowed range.
                    indexPos = forward ? range.lower : range.upper;
                }
                let primaryPos = req.lastObjectStorePosition;
                // We might have to advance the index key further!
                if (req.advanceIndexKey !== undefined) {
                    const compareResult = compareKeys(req.advanceIndexKey, indexPos);
                    if ((forward && compareResult > 0) || (!forward && compareResult > 0)) {
                        indexPos = req.advanceIndexKey;
                    }
                    else if (compareResult == 0 && req.advancePrimaryKey !== undefined) {
                        // index keys are the same, so advance the primary key
                        if (primaryPos === undefined) {
                            primaryPos = req.advancePrimaryKey;
                        }
                        else {
                            const primCompareResult = compareKeys(req.advancePrimaryKey, primaryPos);
                            if ((forward && primCompareResult > 0) ||
                                (!forward && primCompareResult < 0)) {
                                primaryPos = req.advancePrimaryKey;
                            }
                        }
                    }
                }
                if (indexPos === undefined || indexPos === null) {
                    indexPos = forward ? indexData.minKey() : indexData.maxKey();
                }
                let indexEntry;
                indexEntry = indexData.get(indexPos);
                if (!indexEntry) {
                    const res = indexData.nextHigherPair(indexPos);
                    if (res) {
                        indexEntry = res[1];
                        indexPos = indexEntry.indexKey;
                    }
                }
                let primkeySubPos = 0;
                // Sort out the case where the index key is the same, so we have
                // to get the prev/next primary key
                if (indexEntry !== undefined &&
                    req.lastIndexPosition !== undefined &&
                    compareKeys(indexEntry.indexKey, req.lastIndexPosition) === 0) {
                    let pos = forward ? 0 : indexEntry.primaryKeys.length - 1;
                    this.enableTracing &&
                        console.log("number of primary keys", indexEntry.primaryKeys.length);
                    this.enableTracing && console.log("start pos is", pos);
                    // Advance past the lastObjectStorePosition
                    do {
                        const cmpResult = compareKeys(req.lastObjectStorePosition, indexEntry.primaryKeys[pos]);
                        this.enableTracing && console.log("cmp result is", cmpResult);
                        if ((forward && cmpResult < 0) || (!forward && cmpResult > 0)) {
                            break;
                        }
                        pos += forward ? 1 : -1;
                        this.enableTracing && console.log("now pos is", pos);
                    } while (pos >= 0 && pos < indexEntry.primaryKeys.length);
                    // Make sure we're at least at advancedPrimaryPos
                    while (primaryPos !== undefined &&
                        pos >= 0 &&
                        pos < indexEntry.primaryKeys.length) {
                        const cmpResult = compareKeys(primaryPos, indexEntry.primaryKeys[pos]);
                        if ((forward && cmpResult <= 0) || (!forward && cmpResult >= 0)) {
                            break;
                        }
                        pos += forward ? 1 : -1;
                    }
                    primkeySubPos = pos;
                }
                else if (indexEntry !== undefined) {
                    primkeySubPos = forward ? 0 : indexEntry.primaryKeys.length - 1;
                }
                if (this.enableTracing) {
                    console.log("subPos=", primkeySubPos);
                    console.log("indexPos=", indexPos);
                }
                while (1) {
                    if (req.limit != 0 && numResults == req.limit) {
                        break;
                    }
                    if (indexPos === undefined) {
                        break;
                    }
                    if (!range.includes(indexPos)) {
                        break;
                    }
                    if (indexEntry === undefined) {
                        break;
                    }
                    if (primkeySubPos < 0 ||
                        primkeySubPos >= indexEntry.primaryKeys.length) {
                        const res = forward
                            ? indexData.nextHigherPair(indexPos)
                            : indexData.nextLowerPair(indexPos);
                        if (res) {
                            indexPos = res[1].indexKey;
                            indexEntry = res[1];
                            primkeySubPos = forward ? 0 : indexEntry.primaryKeys.length - 1;
                            continue;
                        }
                        else {
                            break;
                        }
                    }
                    // Skip repeated index keys if unique results are requested.
                    let skip = false;
                    if (unique) {
                        if (indexKeys.length > 0 &&
                            compareKeys(indexEntry.indexKey, indexKeys[indexKeys.length - 1]) === 0) {
                            skip = true;
                        }
                        if (req.lastIndexPosition !== undefined &&
                            compareKeys(indexPos, req.lastIndexPosition) === 0) {
                            skip = true;
                        }
                    }
                    if (!skip) {
                        if (this.enableTracing) {
                            console.log(`not skipping!, subPos=${primkeySubPos}`);
                        }
                        indexKeys.push(indexEntry.indexKey);
                        primaryKeys.push(indexEntry.primaryKeys[primkeySubPos]);
                        numResults++;
                    }
                    else {
                        if (this.enableTracing) {
                            console.log("skipping!");
                        }
                    }
                    primkeySubPos += forward ? 1 : -1;
                }
                // Now we can collect the values based on the primary keys,
                // if requested.
                if (req.resultLevel === ResultLevel.Full) {
                    for (let i = 0; i < numResults; i++) {
                        const result = storeData.get(primaryKeys[i]);
                        if (!result) {
                            console.error("invariant violated during read");
                            console.error("request was", req);
                            throw Error("invariant violated during read");
                        }
                        values.push(structuredClone(result.value));
                    }
                }
            }
            else {
                // only based on object store, no index involved, phew!
                let storePos = req.lastObjectStorePosition;
                if (storePos === undefined) {
                    storePos = forward ? range.lower : range.upper;
                }
                if (req.advanceIndexKey !== undefined) {
                    throw Error("unsupported request");
                }
                storePos = furthestKey(forward, req.advancePrimaryKey, storePos);
                if (storePos !== null && storePos !== undefined) {
                    // Advance store position if we are either still at the last returned
                    // store key, or if we are currently not on a key.
                    const storeEntry = storeData.get(storePos);
                    if (this.enableTracing) {
                        console.log("store entry:", storeEntry);
                    }
                    if (!storeEntry ||
                        (req.lastObjectStorePosition !== undefined &&
                            compareKeys(req.lastObjectStorePosition, storePos) === 0)) {
                        storePos = storeData.nextHigherKey(storePos);
                    }
                }
                else {
                    storePos = forward ? storeData.minKey() : storeData.maxKey();
                    if (this.enableTracing) {
                        console.log("setting starting store pos to", storePos);
                    }
                }
                while (1) {
                    if (req.limit != 0 && numResults == req.limit) {
                        break;
                    }
                    if (storePos === null || storePos === undefined) {
                        break;
                    }
                    if (!range.includes(storePos)) {
                        break;
                    }
                    const res = storeData.get(storePos);
                    if (res === undefined) {
                        break;
                    }
                    if (req.resultLevel >= ResultLevel.OnlyKeys) {
                        primaryKeys.push(structuredClone(storePos));
                    }
                    if (req.resultLevel >= ResultLevel.Full) {
                        values.push(structuredClone(res.value));
                    }
                    numResults++;
                    storePos = nextStoreKey(forward, storeData, storePos);
                }
            }
            if (this.enableTracing) {
                console.log(`TRACING: getRecords got ${numResults} results`);
            }
            return {
                count: numResults,
                indexKeys: req.resultLevel >= ResultLevel.OnlyKeys && haveIndex
                    ? indexKeys
                    : undefined,
                primaryKeys: req.resultLevel >= ResultLevel.OnlyKeys ? primaryKeys : undefined,
                values: req.resultLevel >= ResultLevel.Full ? values : undefined,
            };
        });
    }
    storeRecord(btx, storeReq) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.enableTracing) {
                console.log(`TRACING: storeRecord`);
            }
            const myConn = this.connectionsByTransaction[btx.transactionCookie];
            if (!myConn) {
                throw Error("unknown connection");
            }
            const db = this.databases[myConn.dbName];
            if (!db) {
                throw Error("db not found");
            }
            if (db.txLevel < TransactionLevel.Write) {
                throw Error("only allowed while running a transaction");
            }
            if (db.txRestrictObjectStores &&
                !db.txRestrictObjectStores.includes(storeReq.objectStoreName)) {
                throw Error(`Not allowed to access store '${storeReq.objectStoreName}', transaction is over ${JSON.stringify(db.txRestrictObjectStores)}`);
            }
            const schema = myConn.modifiedSchema;
            const objectStoreMapEntry = myConn.objectStoreMap[storeReq.objectStoreName];
            if (!objectStoreMapEntry.store.modifiedData) {
                objectStoreMapEntry.store.modifiedData =
                    objectStoreMapEntry.store.originalData;
            }
            const modifiedData = objectStoreMapEntry.store.modifiedData;
            let key;
            let value;
            if (storeReq.storeLevel === StoreLevel.UpdateExisting) {
                if (storeReq.key === null || storeReq.key === undefined) {
                    throw Error("invalid update request (key not given)");
                }
                if (!objectStoreMapEntry.store.modifiedData.has(storeReq.key)) {
                    throw Error("invalid update request (record does not exist)");
                }
                key = storeReq.key;
                value = storeReq.value;
            }
            else {
                const keygen = objectStoreMapEntry.store.modifiedKeyGenerator ||
                    objectStoreMapEntry.store.originalKeyGenerator;
                const autoIncrement = schema.objectStores[storeReq.objectStoreName].autoIncrement;
                const keyPath = schema.objectStores[storeReq.objectStoreName].keyPath;
                let storeKeyResult;
                try {
                    storeKeyResult = makeStoreKeyValue(storeReq.value, storeReq.key, keygen, autoIncrement, keyPath);
                }
                catch (e) {
                    if (e instanceof DataError) {
                        const kp = JSON.stringify(keyPath);
                        const n = storeReq.objectStoreName;
                        const m = `Could not extract key from value, objectStore=${n}, keyPath=${kp}`;
                        if (this.enableTracing) {
                            console.error(e);
                            console.error("value was:", storeReq.value);
                            console.error("key was:", storeReq.key);
                        }
                        throw new DataError(m);
                    }
                    else {
                        throw e;
                    }
                }
                key = storeKeyResult.key;
                value = storeKeyResult.value;
                objectStoreMapEntry.store.modifiedKeyGenerator =
                    storeKeyResult.updatedKeyGenerator;
                const hasKey = modifiedData.has(key);
                if (hasKey && storeReq.storeLevel !== StoreLevel.AllowOverwrite) {
                    throw Error("refusing to overwrite");
                }
            }
            const objectStoreRecord = {
                primaryKey: structuredClone(key),
                value: structuredClone(value),
            };
            objectStoreMapEntry.store.modifiedData = modifiedData.with(key, objectStoreRecord, true);
            for (const indexName of Object.keys(schema.objectStores[storeReq.objectStoreName].indexes)) {
                const index = myConn.objectStoreMap[storeReq.objectStoreName].indexMap[indexName];
                if (!index) {
                    throw Error("index referenced by object store does not exist");
                }
                const indexProperties = schema.objectStores[storeReq.objectStoreName].indexes[indexName];
                this.insertIntoIndex(index, key, value, indexProperties);
            }
            return { key };
        });
    }
    insertIntoIndex(index, primaryKey, value, indexProperties) {
        if (this.enableTracing) {
            console.log(`insertIntoIndex(${index.modifiedName || index.originalName})`);
        }
        let indexData = index.modifiedData || index.originalData;
        let indexKeys;
        try {
            indexKeys = getIndexKeys(value, indexProperties.keyPath, indexProperties.multiEntry);
        }
        catch (e) {
            if (e instanceof DataError) {
                const n = index.modifiedName || index.originalName;
                const p = JSON.stringify(indexProperties.keyPath);
                const m = `Failed to extract index keys from index ${n} for keyPath ${p}.`;
                if (this.enableTracing) {
                    console.error(m);
                    console.error("value was", value);
                }
                throw new DataError(m);
            }
            else {
                throw e;
            }
        }
        for (const indexKey of indexKeys) {
            const existingRecord = indexData.get(indexKey);
            if (existingRecord) {
                if (indexProperties.unique) {
                    throw new ConstraintError();
                }
                else {
                    const pred = (x) => compareKeys(x, primaryKey) === 0;
                    if (existingRecord.primaryKeys.findIndex(pred) === -1) {
                        const newIndexRecord = {
                            indexKey: indexKey,
                            primaryKeys: [...existingRecord.primaryKeys, primaryKey].sort(compareKeys),
                        };
                        index.modifiedData = indexData.with(indexKey, newIndexRecord, true);
                    }
                }
            }
            else {
                const newIndexRecord = {
                    indexKey: indexKey,
                    primaryKeys: [primaryKey],
                };
                index.modifiedData = indexData.with(indexKey, newIndexRecord, true);
            }
        }
    }
    rollback(btx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.enableTracing) {
                console.log(`TRACING: rollback`);
            }
            const myConn = this.connectionsByTransaction[btx.transactionCookie];
            if (!myConn) {
                throw Error("unknown connection");
            }
            const db = this.databases[myConn.dbName];
            if (!db) {
                throw Error("db not found");
            }
            if (db.txLevel < TransactionLevel.Read) {
                throw Error("only allowed while running a transaction");
            }
            db.modifiedObjectStores = {};
            db.txLevel = TransactionLevel.Connected;
            db.txRestrictObjectStores = undefined;
            myConn.modifiedSchema = structuredClone(db.committedSchema);
            myConn.objectStoreMap = this.makeObjectStoreMap(db);
            for (const objectStoreName in db.committedObjectStores) {
                const objectStore = db.committedObjectStores[objectStoreName];
                objectStore.deleted = false;
                objectStore.modifiedData = undefined;
                objectStore.modifiedName = undefined;
                objectStore.modifiedKeyGenerator = undefined;
                objectStore.modifiedIndexes = {};
                for (const indexName of Object.keys(db.committedSchema.objectStores[objectStoreName].indexes)) {
                    const index = objectStore.committedIndexes[indexName];
                    index.deleted = false;
                    index.modifiedData = undefined;
                    index.modifiedName = undefined;
                }
            }
            delete this.connectionsByTransaction[btx.transactionCookie];
            this.transactionDoneCond.trigger();
        });
    }
    commit(btx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.enableTracing) {
                console.log(`TRACING: commit`);
            }
            const myConn = this.connectionsByTransaction[btx.transactionCookie];
            if (!myConn) {
                throw Error("unknown connection");
            }
            const db = this.databases[myConn.dbName];
            if (!db) {
                throw Error("db not found");
            }
            const txLevel = db.txLevel;
            if (txLevel < TransactionLevel.Read) {
                throw Error("only allowed while running a transaction");
            }
            db.committedSchema = structuredClone(myConn.modifiedSchema);
            db.txLevel = TransactionLevel.Connected;
            db.txRestrictObjectStores = undefined;
            db.committedObjectStores = {};
            db.committedObjectStores = {};
            for (const objectStoreName in myConn.objectStoreMap) {
                const objectStoreMapEntry = myConn.objectStoreMap[objectStoreName];
                const store = objectStoreMapEntry.store;
                store.deleted = false;
                store.originalData = store.modifiedData || store.originalData;
                store.originalName = store.modifiedName || store.originalName;
                store.modifiedIndexes = {};
                if (store.modifiedKeyGenerator !== undefined) {
                    store.originalKeyGenerator = store.modifiedKeyGenerator;
                }
                db.committedObjectStores[objectStoreName] = store;
                for (const indexName in objectStoreMapEntry.indexMap) {
                    const index = objectStoreMapEntry.indexMap[indexName];
                    index.deleted = false;
                    index.originalData = index.modifiedData || index.originalData;
                    index.originalName = index.modifiedName || index.originalName;
                    store.committedIndexes[indexName] = index;
                }
            }
            myConn.objectStoreMap = this.makeObjectStoreMap(db);
            delete this.connectionsByTransaction[btx.transactionCookie];
            this.transactionDoneCond.trigger();
            if (this.afterCommitCallback && txLevel >= TransactionLevel.Write) {
                yield this.afterCommitCallback();
            }
        });
    }
}

// globalThis polyfill, see https://mathiasbynens.be/notes/globalthis
(function () {
    if (typeof globalThis === "object")
        return;
    Object.defineProperty(Object.prototype, "__magic__", {
        get: function () {
            return this;
        },
        configurable: true,
    });
    // @ts-ignore: polyfill magic
    __magic__.globalThis = __magic__; // lolwat
    // @ts-ignore: polyfill magic
    delete Object.prototype.__magic__;
})();
/**
 * Populate the global name space such that the given IndexedDB factory is made
 * available globally.
 *
 * @public
 */
function shimIndexedDB(factory) {
    // @ts-ignore: shimming
    globalThis.indexedDB = factory;
    // @ts-ignore: shimming
    globalThis.IDBCursor = BridgeIDBCursor;
    // @ts-ignore: shimming
    globalThis.IDBKeyRange = BridgeIDBKeyRange;
    // @ts-ignore: shimming
    globalThis.IDBDatabase = BridgeIDBDatabase;
    // @ts-ignore: shimming
    globalThis.IDBFactory = BridgeIDBFactory;
    // @ts-ignore: shimming
    globalThis.IDBIndex = BridgeIDBIndex;
    // @ts-ignore: shimming
    globalThis.IDBKeyRange = BridgeIDBKeyRange;
    // @ts-ignore: shimming
    globalThis.IDBObjectStore = BridgeIDBObjectStore;
    // @ts-ignore: shimming
    globalThis.IDBOpenDBRequest = BridgeIDBOpenDBRequest;
    // @ts-ignore: shimming
    globalThis.IDBRequest = BridgeIDBRequest;
    // @ts-ignore: shimming
    globalThis.IDBTransaction = BridgeIDBTransaction;
    // @ts-ignore: shimming
    globalThis.IDBVersionChangeEvent = BridgeIDBVersionChangeEvent;
}

/**
 * Name of the Taler database.  The name includes the
 * major version of the DB schema.  The version should be incremented
 * with each major change.  When incrementing the major version,
 * the wallet should import data from the previous version.
 */
const TALER_DB_NAME = "taler-walletdb-v7";
/**
 * Current database minor version, should be incremented
 * each time we do minor schema changes on the database.
 * A change is considered minor when fields are added in a
 * backwards-compatible way or object stores and indices
 * are added.
 */
const WALLET_DB_MINOR_VERSION = 1;
/**
 * Return a promise that resolves
 * to the taler wallet db.
 */
function openTalerDatabase(idbFactory, onVersionChange) {
    const onUpgradeNeeded = (db, oldVersion, newVersion) => {
        switch (oldVersion) {
            case 0: // DB does not exist yet
                for (const n in Stores) {
                    if (Stores[n] instanceof Store) {
                        const si = Stores[n];
                        const s = db.createObjectStore(si.name, si.storeParams);
                        for (const indexName in si) {
                            if (si[indexName] instanceof Index) {
                                const ii = si[indexName];
                                s.createIndex(ii.indexName, ii.keyPath, ii.options);
                            }
                        }
                    }
                }
                break;
            default:
                throw Error("unsupported existig DB version");
        }
    };
    return openDatabase(idbFactory, TALER_DB_NAME, WALLET_DB_MINOR_VERSION, onVersionChange, onUpgradeNeeded);
}

/*
 This file is part of GNU Taler
 (C) 2019-2020 Taler Systems SA

 TALER is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 TALER is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 TALER; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
var SignaturePurpose;
(function (SignaturePurpose) {
    SignaturePurpose[SignaturePurpose["WALLET_RESERVE_WITHDRAW"] = 1200] = "WALLET_RESERVE_WITHDRAW";
    SignaturePurpose[SignaturePurpose["WALLET_COIN_DEPOSIT"] = 1201] = "WALLET_COIN_DEPOSIT";
    SignaturePurpose[SignaturePurpose["MASTER_DENOMINATION_KEY_VALIDITY"] = 1025] = "MASTER_DENOMINATION_KEY_VALIDITY";
    SignaturePurpose[SignaturePurpose["MASTER_WIRE_FEES"] = 1028] = "MASTER_WIRE_FEES";
    SignaturePurpose[SignaturePurpose["MASTER_WIRE_DETAILS"] = 1030] = "MASTER_WIRE_DETAILS";
    SignaturePurpose[SignaturePurpose["WALLET_COIN_MELT"] = 1202] = "WALLET_COIN_MELT";
    SignaturePurpose[SignaturePurpose["TEST"] = 4242] = "TEST";
    SignaturePurpose[SignaturePurpose["MERCHANT_PAYMENT_OK"] = 1104] = "MERCHANT_PAYMENT_OK";
    SignaturePurpose[SignaturePurpose["WALLET_COIN_RECOUP"] = 1203] = "WALLET_COIN_RECOUP";
    SignaturePurpose[SignaturePurpose["WALLET_COIN_LINK"] = 1204] = "WALLET_COIN_LINK";
    SignaturePurpose[SignaturePurpose["EXCHANGE_CONFIRM_RECOUP"] = 1039] = "EXCHANGE_CONFIRM_RECOUP";
    SignaturePurpose[SignaturePurpose["EXCHANGE_CONFIRM_RECOUP_REFRESH"] = 1041] = "EXCHANGE_CONFIRM_RECOUP_REFRESH";
})(SignaturePurpose || (SignaturePurpose = {}));
function amountToBuffer(amount) {
    const buffer = new ArrayBuffer(8 + 4 + 12);
    const dvbuf = new DataView(buffer);
    const u8buf = new Uint8Array(buffer);
    const curr = stringToBytes(amount.currency);
    dvbuf.setBigUint64(0, BigInt(amount.value));
    dvbuf.setUint32(8, amount.fraction);
    u8buf.set(curr, 8 + 4);
    return u8buf;
}
function timestampRoundedToBuffer(ts) {
    const b = new ArrayBuffer(8);
    const v = new DataView(b);
    const tsRounded = timestampTruncateToSecond(ts);
    const s = BigInt(tsRounded.t_ms) * BigInt(1000);
    v.setBigUint64(0, s);
    return new Uint8Array(b);
}
class SignaturePurposeBuilder {
    constructor(purposeNum) {
        this.purposeNum = purposeNum;
        this.chunks = [];
    }
    put(bytes) {
        this.chunks.push(Uint8Array.from(bytes));
        return this;
    }
    build() {
        let payloadLen = 0;
        for (const c of this.chunks) {
            payloadLen += c.byteLength;
        }
        const buf = new ArrayBuffer(4 + 4 + payloadLen);
        const u8buf = new Uint8Array(buf);
        let p = 8;
        for (const c of this.chunks) {
            u8buf.set(c, p);
            p += c.byteLength;
        }
        const dvbuf = new DataView(buf);
        dvbuf.setUint32(0, payloadLen + 4 + 4);
        dvbuf.setUint32(4, this.purposeNum);
        return u8buf;
    }
}
function buildSigPS(purposeNum) {
    return new SignaturePurposeBuilder(purposeNum);
}
class CryptoImplementation {
    /**
     * Create a pre-coin of the given denomination to be withdrawn from then given
     * reserve.
     */
    createPlanchet(req) {
        const reservePub = decodeCrock(req.reservePub);
        const reservePriv = decodeCrock(req.reservePriv);
        const denomPub = decodeCrock(req.denomPub);
        const coinKeyPair = createEddsaKeyPair();
        const blindingFactor = createBlindingKeySecret();
        const coinPubHash = hash$1(coinKeyPair.eddsaPub);
        const ev = rsaBlind(coinPubHash, blindingFactor, denomPub);
        const amountWithFee = Amounts.add(req.value, req.feeWithdraw).amount;
        const denomPubHash = hash$1(denomPub);
        const evHash = hash$1(ev);
        const withdrawRequest = buildSigPS(SignaturePurpose.WALLET_RESERVE_WITHDRAW)
            .put(reservePub)
            .put(amountToBuffer(amountWithFee))
            .put(denomPubHash)
            .put(evHash)
            .build();
        const sig = eddsaSign(withdrawRequest, reservePriv);
        const planchet = {
            blindingKey: encodeCrock(blindingFactor),
            coinEv: encodeCrock(ev),
            coinPriv: encodeCrock(coinKeyPair.eddsaPriv),
            coinPub: encodeCrock(coinKeyPair.eddsaPub),
            coinValue: req.value,
            denomPub: encodeCrock(denomPub),
            denomPubHash: encodeCrock(denomPubHash),
            reservePub: encodeCrock(reservePub),
            withdrawSig: encodeCrock(sig),
            coinEvHash: encodeCrock(evHash),
        };
        return planchet;
    }
    /**
     * Create a planchet used for tipping, including the private keys.
     */
    createTipPlanchet(denom) {
        const denomPub = decodeCrock(denom.denomPub);
        const coinKeyPair = createEddsaKeyPair();
        const blindingFactor = createBlindingKeySecret();
        const coinPubHash = hash$1(coinKeyPair.eddsaPub);
        const ev = rsaBlind(coinPubHash, blindingFactor, denomPub);
        const tipPlanchet = {
            blindingKey: encodeCrock(blindingFactor),
            coinEv: encodeCrock(ev),
            coinPriv: encodeCrock(coinKeyPair.eddsaPriv),
            coinPub: encodeCrock(coinKeyPair.eddsaPub),
            coinValue: denom.value,
            denomPub: encodeCrock(denomPub),
            denomPubHash: encodeCrock(hash$1(denomPub)),
        };
        return tipPlanchet;
    }
    /**
     * Create and sign a message to recoup a coin.
     */
    createRecoupRequest(coin) {
        const p = buildSigPS(SignaturePurpose.WALLET_COIN_RECOUP)
            .put(decodeCrock(coin.coinPub))
            .put(decodeCrock(coin.denomPubHash))
            .put(decodeCrock(coin.blindingKey))
            .build();
        const coinPriv = decodeCrock(coin.coinPriv);
        const coinSig = eddsaSign(p, coinPriv);
        const paybackRequest = {
            coin_blind_key_secret: coin.blindingKey,
            coin_pub: coin.coinPub,
            coin_sig: encodeCrock(coinSig),
            denom_pub_hash: coin.denomPubHash,
            denom_sig: coin.denomSig,
            refreshed: coin.coinSource.type === "refresh" /* Refresh */,
        };
        return paybackRequest;
    }
    /**
     * Check if a payment signature is valid.
     */
    isValidPaymentSignature(sig, contractHash, merchantPub) {
        const p = buildSigPS(SignaturePurpose.MERCHANT_PAYMENT_OK)
            .put(decodeCrock(contractHash))
            .build();
        const sigBytes = decodeCrock(sig);
        const pubBytes = decodeCrock(merchantPub);
        return eddsaVerify(p, sigBytes, pubBytes);
    }
    /**
     * Check if a wire fee is correctly signed.
     */
    isValidWireFee(type, wf, masterPub) {
        const p = buildSigPS(SignaturePurpose.MASTER_WIRE_FEES)
            .put(hash$1(stringToBytes(type + "\0")))
            .put(timestampRoundedToBuffer(wf.startStamp))
            .put(timestampRoundedToBuffer(wf.endStamp))
            .put(amountToBuffer(wf.wireFee))
            .put(amountToBuffer(wf.closingFee))
            .build();
        const sig = decodeCrock(wf.sig);
        const pub = decodeCrock(masterPub);
        return eddsaVerify(p, sig, pub);
    }
    /**
     * Check if the signature of a denomination is valid.
     */
    isValidDenom(denom, masterPub) {
        const p = buildSigPS(SignaturePurpose.MASTER_DENOMINATION_KEY_VALIDITY)
            .put(decodeCrock(masterPub))
            .put(timestampRoundedToBuffer(denom.stampStart))
            .put(timestampRoundedToBuffer(denom.stampExpireWithdraw))
            .put(timestampRoundedToBuffer(denom.stampExpireDeposit))
            .put(timestampRoundedToBuffer(denom.stampExpireLegal))
            .put(amountToBuffer(denom.value))
            .put(amountToBuffer(denom.feeWithdraw))
            .put(amountToBuffer(denom.feeDeposit))
            .put(amountToBuffer(denom.feeRefresh))
            .put(amountToBuffer(denom.feeRefund))
            .put(decodeCrock(denom.denomPubHash))
            .build();
        const sig = decodeCrock(denom.masterSig);
        const pub = decodeCrock(masterPub);
        return eddsaVerify(p, sig, pub);
    }
    isValidWireAccount(paytoUri, sig, masterPub) {
        const h = kdf(64, stringToBytes("exchange-wire-signature"), stringToBytes(paytoUri + "\0"), new Uint8Array(0));
        const p = buildSigPS(SignaturePurpose.MASTER_WIRE_DETAILS).put(h).build();
        return eddsaVerify(p, decodeCrock(sig), decodeCrock(masterPub));
    }
    /**
     * Create a new EdDSA key pair.
     */
    createEddsaKeypair() {
        const pair = createEddsaKeyPair();
        return {
            priv: encodeCrock(pair.eddsaPriv),
            pub: encodeCrock(pair.eddsaPub),
        };
    }
    /**
     * Unblind a blindly signed value.
     */
    rsaUnblind(blindedSig, bk, pk) {
        const denomSig = rsaUnblind(decodeCrock(blindedSig), decodeCrock(pk), decodeCrock(bk));
        return encodeCrock(denomSig);
    }
    /**
     * Unblind a blindly signed value.
     */
    rsaVerify(hm, sig, pk) {
        return rsaVerify(hash$1(decodeCrock(hm)), decodeCrock(sig), decodeCrock(pk));
    }
    /**
     * Generate updated coins (to store in the database)
     * and deposit permissions for each given coin.
     */
    signDepositPermission(depositInfo) {
        const d = buildSigPS(SignaturePurpose.WALLET_COIN_DEPOSIT)
            .put(decodeCrock(depositInfo.contractTermsHash))
            .put(decodeCrock(depositInfo.wireInfoHash))
            .put(decodeCrock(depositInfo.denomPubHash))
            .put(timestampRoundedToBuffer(depositInfo.timestamp))
            .put(timestampRoundedToBuffer(depositInfo.refundDeadline))
            .put(amountToBuffer(depositInfo.spendAmount))
            .put(amountToBuffer(depositInfo.feeDeposit))
            .put(decodeCrock(depositInfo.merchantPub))
            .put(decodeCrock(depositInfo.coinPub))
            .build();
        const coinSig = eddsaSign(d, decodeCrock(depositInfo.coinPriv));
        const s = {
            coin_pub: depositInfo.coinPub,
            coin_sig: encodeCrock(coinSig),
            contribution: Amounts.stringify(depositInfo.spendAmount),
            h_denom: depositInfo.denomPubHash,
            exchange_url: depositInfo.exchangeBaseUrl,
            ub_sig: depositInfo.denomSig,
        };
        return s;
    }
    /**
     * Create a new refresh session.
     */
    createRefreshSession(exchangeBaseUrl, kappa, meltCoin, newCoinDenoms, meltFee) {
        const currency = newCoinDenoms.selectedDenoms[0].denom.value.currency;
        let valueWithFee = Amounts.getZero(currency);
        for (const ncd of newCoinDenoms.selectedDenoms) {
            const t = Amounts.add(ncd.denom.value, ncd.denom.feeWithdraw).amount;
            valueWithFee = Amounts.add(valueWithFee, Amounts.mult(t, ncd.count).amount).amount;
        }
        // melt fee
        valueWithFee = Amounts.add(valueWithFee, meltFee).amount;
        const sessionHc = createHashContext();
        const transferPubs = [];
        const transferPrivs = [];
        const planchetsForGammas = [];
        for (let i = 0; i < kappa; i++) {
            const transferKeyPair = createEcdheKeyPair();
            sessionHc.update(transferKeyPair.ecdhePub);
            transferPrivs.push(encodeCrock(transferKeyPair.ecdhePriv));
            transferPubs.push(encodeCrock(transferKeyPair.ecdhePub));
        }
        for (const denomSel of newCoinDenoms.selectedDenoms) {
            for (let i = 0; i < denomSel.count; i++) {
                const r = decodeCrock(denomSel.denom.denomPub);
                sessionHc.update(r);
            }
        }
        sessionHc.update(decodeCrock(meltCoin.coinPub));
        sessionHc.update(amountToBuffer(valueWithFee));
        for (let i = 0; i < kappa; i++) {
            const planchets = [];
            for (let j = 0; j < newCoinDenoms.selectedDenoms.length; j++) {
                const denomSel = newCoinDenoms.selectedDenoms[j];
                for (let k = 0; k < denomSel.count; k++) {
                    const coinNumber = planchets.length;
                    const transferPriv = decodeCrock(transferPrivs[i]);
                    const oldCoinPub = decodeCrock(meltCoin.coinPub);
                    const transferSecret = keyExchangeEcdheEddsa(transferPriv, oldCoinPub);
                    const fresh = setupRefreshPlanchet(transferSecret, coinNumber);
                    const coinPriv = fresh.coinPriv;
                    const coinPub = fresh.coinPub;
                    const blindingFactor = fresh.bks;
                    const pubHash = hash$1(coinPub);
                    const denomPub = decodeCrock(denomSel.denom.denomPub);
                    const ev = rsaBlind(pubHash, blindingFactor, denomPub);
                    const planchet = {
                        blindingKey: encodeCrock(blindingFactor),
                        coinEv: encodeCrock(ev),
                        privateKey: encodeCrock(coinPriv),
                        publicKey: encodeCrock(coinPub),
                    };
                    planchets.push(planchet);
                    sessionHc.update(ev);
                }
            }
            planchetsForGammas.push(planchets);
        }
        const sessionHash = sessionHc.finish();
        const confirmData = buildSigPS(SignaturePurpose.WALLET_COIN_MELT)
            .put(sessionHash)
            .put(decodeCrock(meltCoin.denomPubHash))
            .put(amountToBuffer(valueWithFee))
            .put(amountToBuffer(meltFee))
            .put(decodeCrock(meltCoin.coinPub))
            .build();
        const confirmSig = eddsaSign(confirmData, decodeCrock(meltCoin.coinPriv));
        let valueOutput = Amounts.getZero(currency);
        for (const denomSel of newCoinDenoms.selectedDenoms) {
            const denom = denomSel.denom;
            for (let i = 0; i < denomSel.count; i++) {
                valueOutput = Amounts.add(valueOutput, denom.value).amount;
            }
        }
        const newDenoms = [];
        const newDenomHashes = [];
        for (const denomSel of newCoinDenoms.selectedDenoms) {
            const denom = denomSel.denom;
            for (let i = 0; i < denomSel.count; i++) {
                newDenoms.push(denom.denomPub);
                newDenomHashes.push(denom.denomPubHash);
            }
        }
        const refreshSession = {
            confirmSig: encodeCrock(confirmSig),
            exchangeBaseUrl,
            hash: encodeCrock(sessionHash),
            meltCoinPub: meltCoin.coinPub,
            newDenomHashes,
            newDenoms,
            norevealIndex: undefined,
            planchetsForGammas: planchetsForGammas,
            transferPrivs,
            transferPubs,
            amountRefreshOutput: valueOutput,
            amountRefreshInput: valueWithFee,
            timestampCreated: getTimestampNow(),
            finishedTimestamp: undefined,
            lastError: undefined,
        };
        return refreshSession;
    }
    /**
     * Hash a string including the zero terminator.
     */
    hashString(str) {
        const b = stringToBytes(str + "\0");
        return encodeCrock(hash$1(b));
    }
    /**
     * Hash a crockford encoded value.
     */
    hashEncoded(encodedBytes) {
        return encodeCrock(hash$1(decodeCrock(encodedBytes)));
    }
    signCoinLink(oldCoinPriv, newDenomHash, oldCoinPub, transferPub, coinEv) {
        const coinEvHash = hash$1(decodeCrock(coinEv));
        const coinLink = buildSigPS(SignaturePurpose.WALLET_COIN_LINK)
            .put(decodeCrock(newDenomHash))
            .put(decodeCrock(oldCoinPub))
            .put(decodeCrock(transferPub))
            .put(coinEvHash)
            .build();
        const coinPriv = decodeCrock(oldCoinPriv);
        const sig = eddsaSign(coinLink, coinPriv);
        return encodeCrock(sig);
    }
    benchmark(repetitions) {
        let time_hash = 0;
        for (let i = 0; i < repetitions; i++) {
            const start = performanceNow();
            this.hashString("hello world");
            time_hash += performanceNow() - start;
        }
        let time_hash_big = 0;
        for (let i = 0; i < repetitions; i++) {
            const ba = randomBytes(4096);
            const start = performanceNow();
            hash$1(ba);
            time_hash_big += performanceNow() - start;
        }
        let time_eddsa_create = 0;
        for (let i = 0; i < repetitions; i++) {
            const start = performanceNow();
            createEddsaKeyPair();
            time_eddsa_create += performanceNow() - start;
        }
        let time_eddsa_sign = 0;
        const p = randomBytes(4096);
        const pair = createEddsaKeyPair();
        for (let i = 0; i < repetitions; i++) {
            const start = performanceNow();
            eddsaSign(p, pair.eddsaPriv);
            time_eddsa_sign += performanceNow() - start;
        }
        const sig = eddsaSign(p, pair.eddsaPriv);
        let time_eddsa_verify = 0;
        for (let i = 0; i < repetitions; i++) {
            const start = performanceNow();
            eddsaVerify(p, sig, pair.eddsaPub);
            time_eddsa_verify += performanceNow() - start;
        }
        return {
            repetitions,
            time: {
                hash_small: time_hash,
                hash_big: time_hash_big,
                eddsa_create: time_eddsa_create,
                eddsa_sign: time_eddsa_sign,
                eddsa_verify: time_eddsa_verify,
            },
        };
    }
}
CryptoImplementation.enableTracing = false;

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
const logger$c = new Logger("nodeThreadWorker.ts");
const f = __filename;
const workerCode = `
  // Try loading the glue library for Android
  try {
    require("akono");
  } catch (e) {
    // Probably we're not on Android ...
  }
  const worker_threads = require('worker_threads');
  const parentPort = worker_threads.parentPort;
  let tw;
  try {
    tw = require("${f}");
  } catch (e) {
    console.warn("could not load from ${f}");
  }
  if (!tw) {
    try {
      tw = require("taler-wallet-android");
    } catch (e) {
      console.warn("could not load taler-wallet-android either");
      throw e;
    }
  }
  if (typeof tw.handleWorkerMessage !== "function") {
    throw Error("module loaded for crypto worker lacks handleWorkerMessage");
  }
  if (typeof tw.handleWorkerError !== "function") {
    throw Error("module loaded for crypto worker lacks handleWorkerError");
  }
  parentPort.on("message", tw.handleWorkerMessage);
  parentPort.on("error", tw.handleWorkerError);
`;
/**
 * This function is executed in the worker thread to handle
 * a message.
 */
function handleWorkerMessage(msg) {
    const args = msg.args;
    if (!Array.isArray(args)) {
        console.error("args must be array");
        return;
    }
    const id = msg.id;
    if (typeof id !== "number") {
        console.error("RPC id must be number");
        return;
    }
    const operation = msg.operation;
    if (typeof operation !== "string") {
        console.error("RPC operation must be string");
        return;
    }
    const handleRequest = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const impl = new CryptoImplementation();
        if (!(operation in impl)) {
            console.error(`crypto operation '${operation}' not found`);
            return;
        }
        try {
            const result = impl[operation](...args);
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const worker_threads = require("worker_threads");
            const p = worker_threads.parentPort;
            (_a = worker_threads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage;
            if (p) {
                p.postMessage({ data: { result, id } });
            }
            else {
                console.error("parent port not available (not running in thread?");
            }
        }
        catch (e) {
            console.error("error during operation", e);
            return;
        }
    });
    handleRequest().catch((e) => {
        console.error("error in node worker", e);
    });
}
function handleWorkerError(e) {
    console.log("got error from worker", e);
}
class NodeThreadCryptoWorkerFactory {
    startWorker() {
        if (typeof require === "undefined") {
            throw Error("cannot make worker, require(...) not defined");
        }
        return new NodeThreadCryptoWorker();
    }
    getConcurrency() {
        return Math.max(1, os.cpus().length - 1);
    }
}
/**
 * Worker implementation that uses node subprocesses.
 */
class NodeThreadCryptoWorker {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const worker_threads = require("worker_threads");
        logger$c.trace("starting node crypto worker");
        this.nodeWorker = new worker_threads.Worker(workerCode, { eval: true });
        this.nodeWorker.on("error", (err) => {
            console.error("error in node worker:", err);
            if (this.onerror) {
                this.onerror(err);
            }
        });
        this.nodeWorker.on("exit", (err) => {
            logger$c.trace(`worker exited with code ${err}`);
        });
        this.nodeWorker.on("message", (v) => {
            if (this.onmessage) {
                this.onmessage(v);
            }
        });
        this.nodeWorker.unref();
    }
    /**
     * Add an event listener for either an "error" or "message" event.
     */
    addEventListener(event, fn) {
        switch (event) {
            case "message":
                this.onmessage = fn;
                break;
            case "error":
                this.onerror = fn;
                break;
        }
    }
    /**
     * Send a message to the worker thread.
     */
    postMessage(msg) {
        this.nodeWorker.postMessage(msg);
    }
    /**
     * Forcibly terminate the worker thread.
     */
    terminate() {
        this.nodeWorker.terminate();
    }
}

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 TALER is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
/**
 * Maximum request per second, per origin.
 */
const MAX_PER_SECOND = 50;
/**
 * Maximum request per minute, per origin.
 */
const MAX_PER_MINUTE = 100;
/**
 * Maximum request per hour, per origin.
 */
const MAX_PER_HOUR = 1000;
/**
 * Throttling state for one origin.
 */
class OriginState {
    constructor() {
        this.tokensSecond = MAX_PER_SECOND;
        this.tokensMinute = MAX_PER_MINUTE;
        this.tokensHour = MAX_PER_HOUR;
        this.lastUpdate = getTimestampNow();
    }
    refill() {
        const now = getTimestampNow();
        const d = timestampDifference(now, this.lastUpdate);
        if (d.d_ms === "forever") {
            throw Error("assertion failed");
        }
        const d_s = d.d_ms / 1000;
        this.tokensSecond = Math.min(MAX_PER_SECOND, this.tokensSecond + d_s / 1000);
        this.tokensMinute = Math.min(MAX_PER_MINUTE, this.tokensMinute + (d_s / 1000) * 60);
        this.tokensHour = Math.min(MAX_PER_HOUR, this.tokensHour + (d_s / 1000) * 60 * 60);
        this.lastUpdate = now;
    }
    /**
     * Return true if the request for this origin should be throttled.
     * Otherwise, take a token out of the respective buckets.
     */
    applyThrottle() {
        this.refill();
        if (this.tokensSecond < 1) {
            console.log("request throttled (per second limit exceeded)");
            return true;
        }
        if (this.tokensMinute < 1) {
            console.log("request throttled (per minute limit exceeded)");
            return true;
        }
        if (this.tokensHour < 1) {
            console.log("request throttled (per hour limit exceeded)");
            return true;
        }
        this.tokensSecond--;
        this.tokensMinute--;
        this.tokensHour--;
        return false;
    }
}
/**
 * Request throttler, used as a "last layer of defense" when some
 * other part of the re-try logic is broken and we're sending too
 * many requests to the same exchange/bank/merchant.
 */
class RequestThrottler {
    constructor() {
        this.perOriginInfo = {};
    }
    /**
     * Get the throttling state for an origin, or
     * initialize if no state is associated with the
     * origin yet.
     */
    getState(origin) {
        const s = this.perOriginInfo[origin];
        if (s) {
            return s;
        }
        const ns = (this.perOriginInfo[origin] = new OriginState());
        return ns;
    }
    /**
     * Apply throttling to a request.
     *
     * @returns whether the request should be throttled.
     */
    applyThrottle(requestUrl) {
        const origin = new URL(requestUrl).origin;
        return this.getState(origin).applyThrottle();
    }
}

var bind = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

var utils = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
var buildURL = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

var InterceptorManager_1 = InterceptorManager;

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
var transformData = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

var isCancel = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
var enhanceError = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
var createError = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
var settle = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
var isAbsoluteURL = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
var combineURLs = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
var buildFullPath = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

var isURLSameOrigin = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

var cookies = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies$1 = cookies;

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies$1.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse$1(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse$1(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

var debug = createCommonjsModule(function (module, exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = ms;

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}
});

var browser = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
});

var hasFlag = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if ('GITHUB_ACTIONS' in env) {
		return 1;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

var supportsColor_1 = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};

var node = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [ 6, 2, 3, 4, 5, 1 ];

try {
  var supportsColor = supportsColor_1;
  if (supportsColor && supportsColor.level >= 2) {
    exports.colors = [
      20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
      69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
      135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
      172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
      205, 206, 207, 208, 209, 214, 215, 220, 221
    ];
  }
} catch (err) {
  // swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(process.stderr.fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = '\u001b[3' + (c < 8 ? c : '8;5;' + c);
    var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  } else {
    return new Date().toISOString() + ' ';
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());
});

var src = createCommonjsModule(function (module) {
/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer') {
  module.exports = browser;
} else {
  module.exports = node;
}
});

var Writable = stream.Writable;
var debug$1 = src("follow-redirects");

// RFC7231§4.2.1: Of the request methods defined by this specification,
// the GET, HEAD, OPTIONS, and TRACE methods are defined to be safe.
var SAFE_METHODS = { GET: true, HEAD: true, OPTIONS: true, TRACE: true };

// Create handlers that pass events from native requests
var eventHandlers = Object.create(null);
["abort", "aborted", "error", "socket", "timeout"].forEach(function (event) {
  eventHandlers[event] = function (arg) {
    this._redirectable.emit(event, arg);
  };
});

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  options.headers = options.headers || {};
  this._options = options;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Validate input and shift parameters if necessary
  if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
    throw new Error("data should be a string, Buffer or Uint8Array");
  }
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new Error("Request body larger than maxBodyLength limit"));
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (typeof data === "function") {
    callback = data;
    data = encoding = null;
  }
  else if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Write data and end
  var currentRequest = this._currentRequest;
  this.write(data || "", encoding, function () {
    currentRequest.end(null, null, callback);
  });
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Proxy all other public ClientRequest methods
[
  "abort", "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive", "setTimeout",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new Error("Unsupported protocol " + protocol));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.substr(0, protocol.length - 1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  this._currentUrl = url.format(this._options);

  // Set up event handlers
  request._redirectable = this;
  for (var event in eventHandlers) {
    /* istanbul ignore else */
    if (event) {
      request.on(event, eventHandlers[event]);
    }
  }

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end.
    var i = 0;
    var buffers = this._requestBodyBuffers;
    (function writeNext() {
      if (i < buffers.length) {
        var buffer = buffers[i++];
        request.write(buffer.data, buffer.encoding, writeNext);
      }
      else {
        request.end();
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: response.statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.
  var location = response.headers.location;
  if (location && this._options.followRedirects !== false &&
      response.statusCode >= 300 && response.statusCode < 400) {
    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
      this.emit("error", new Error("Max redirects exceeded."));
      return;
    }

    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe […],
    // since the user might not wish to redirect an unsafe request.
    // RFC7231§6.4.7: The 307 (Temporary Redirect) status code indicates
    // that the target resource resides temporarily under a different URI
    // and the user agent MUST NOT change the request method
    // if it performs an automatic redirection to that URI.
    var header;
    var headers = this._options.headers;
    if (response.statusCode !== 307 && !(this._options.method in SAFE_METHODS)) {
      this._options.method = "GET";
      // Drop a possible entity and headers related to it
      this._requestBodyBuffers = [];
      for (header in headers) {
        if (/^content-/i.test(header)) {
          delete headers[header];
        }
      }
    }

    // Drop the Host header, as the redirect might lead to a different host
    if (!this._isRedirect) {
      for (header in headers) {
        if (/^host$/i.test(header)) {
          delete headers[header];
        }
      }
    }

    // Perform the redirected request
    var redirectUrl = url.resolve(this._currentUrl, location);
    debug$1("redirecting to", redirectUrl);
    Object.assign(this._options, url.parse(redirectUrl));
    this._isRedirect = true;
    this._performRequest();

    // Discard the remainder of the response to avoid waiting for data
    response.destroy();
  }
  else {
    // The response is not a redirect; return it as-is
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    wrappedProtocol.request = function (options, callback) {
      if (typeof options === "string") {
        options = url.parse(options);
        options.maxRedirects = exports.maxRedirects;
      }
      else {
        options = Object.assign({
          protocol: protocol,
          maxRedirects: exports.maxRedirects,
          maxBodyLength: exports.maxBodyLength,
        }, options);
      }
      options.nativeProtocols = nativeProtocols;
      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug$1("options", options);
      return new RedirectableRequest(options, callback);
    };

    // Executes a GET request, following redirects
    wrappedProtocol.get = function (options, callback) {
      var request = wrappedProtocol.request(options, callback);
      request.end();
      return request;
    };
  });
  return exports;
}

// Exports
var followRedirects = wrap({ http: http, https: https });
var wrap_1 = wrap;
followRedirects.wrap = wrap_1;

var name = "axios";
var version = "0.19.2";
var description = "Promise based HTTP client for the browser and node.js";
var main = "index.js";
var scripts = {
	test: "grunt test && bundlesize",
	start: "node ./sandbox/server.js",
	build: "NODE_ENV=production grunt build",
	preversion: "npm test",
	version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
	postversion: "git push && git push --tags",
	examples: "node ./examples/server.js",
	coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
	fix: "eslint --fix lib/**/*.js"
};
var repository = {
	type: "git",
	url: "https://github.com/axios/axios.git"
};
var keywords = [
	"xhr",
	"http",
	"ajax",
	"promise",
	"node"
];
var author = "Matt Zabriskie";
var license = "MIT";
var bugs = {
	url: "https://github.com/axios/axios/issues"
};
var homepage = "https://github.com/axios/axios";
var devDependencies = {
	bundlesize: "^0.17.0",
	coveralls: "^3.0.0",
	"es6-promise": "^4.2.4",
	grunt: "^1.0.2",
	"grunt-banner": "^0.6.0",
	"grunt-cli": "^1.2.0",
	"grunt-contrib-clean": "^1.1.0",
	"grunt-contrib-watch": "^1.0.0",
	"grunt-eslint": "^20.1.0",
	"grunt-karma": "^2.0.0",
	"grunt-mocha-test": "^0.13.3",
	"grunt-ts": "^6.0.0-beta.19",
	"grunt-webpack": "^1.0.18",
	"istanbul-instrumenter-loader": "^1.0.0",
	"jasmine-core": "^2.4.1",
	karma: "^1.3.0",
	"karma-chrome-launcher": "^2.2.0",
	"karma-coverage": "^1.1.1",
	"karma-firefox-launcher": "^1.1.0",
	"karma-jasmine": "^1.1.1",
	"karma-jasmine-ajax": "^0.1.13",
	"karma-opera-launcher": "^1.0.0",
	"karma-safari-launcher": "^1.0.0",
	"karma-sauce-launcher": "^1.2.0",
	"karma-sinon": "^1.0.5",
	"karma-sourcemap-loader": "^0.3.7",
	"karma-webpack": "^1.7.0",
	"load-grunt-tasks": "^3.5.2",
	minimist: "^1.2.0",
	mocha: "^5.2.0",
	sinon: "^4.5.0",
	typescript: "^2.8.1",
	"url-search-params": "^0.10.0",
	webpack: "^1.13.1",
	"webpack-dev-server": "^1.14.1"
};
var browser$1 = {
	"./lib/adapters/http.js": "./lib/adapters/xhr.js"
};
var typings = "./index.d.ts";
var dependencies = {
	"follow-redirects": "1.5.10"
};
var bundlesize = [
	{
		path: "./dist/axios.min.js",
		threshold: "5kB"
	}
];
var _package = {
	name: name,
	version: version,
	description: description,
	main: main,
	scripts: scripts,
	repository: repository,
	keywords: keywords,
	author: author,
	license: license,
	bugs: bugs,
	homepage: homepage,
	devDependencies: devDependencies,
	browser: browser$1,
	typings: typings,
	dependencies: dependencies,
	bundlesize: bundlesize
};

var _package$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name,
    version: version,
    description: description,
    main: main,
    scripts: scripts,
    repository: repository,
    keywords: keywords,
    author: author,
    license: license,
    bugs: bugs,
    homepage: homepage,
    devDependencies: devDependencies,
    browser: browser$1,
    typings: typings,
    dependencies: dependencies,
    bundlesize: bundlesize,
    'default': _package
});

var pkg = getCjsExportFromNamespace(_package$1);

var httpFollow = followRedirects.http;
var httpsFollow = followRedirects.https;






var isHttps = /https:?/;

/*eslint consistent-return:0*/
var http_1 = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var resolve = function resolve(value) {
      resolvePromise(value);
    };
    var reject = function reject(value) {
      rejectPromise(value);
    };
    var data = config.data;
    var headers = config.headers;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) ; else if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var fullPath = buildFullPath(config.baseURL, config.url);
    var parsed = url.parse(fullPath);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttpsRequest = isHttps.test(protocol);
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            if (proxyElement === '*') {
              return true;
            }
            if (proxyElement[0] === '.' &&
                parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }


        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      options.port = proxy.port;
      options.path = protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path;

      // Basic proxy authorization
      if (proxy.auth) {
        var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }
    }

    var transport;
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsProxy ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (config.maxContentLength && config.maxContentLength > -1) {
      options.maxBodyLength = config.maxContentLength;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // uncompress the response body transparently if required
      var stream = res;
      switch (res.headers['content-encoding']) {
      /*eslint default-case:0*/
      case 'gzip':
      case 'compress':
      case 'deflate':
        // add the unzipper to the body stream processing pipeline
        stream = (res.statusCode === 204) ? stream : stream.pipe(zlib.createUnzip());

        // remove the content-encoding in order to not confuse downstream operations
        delete res.headers['content-encoding'];
        break;
      }

      // return the last request in case of redirects
      var lastRequest = res.req || req;

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted) return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout) {
      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devoring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(config.timeout, function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
      });
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(cancel);
      });
    }

    // Send the request
    if (utils.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = xhr;
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = http_1;
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

var defaults_1 = defaults;

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
var dispatchRequest = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults_1.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
var mergeConfig = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
  var defaultToConfig2Keys = [
    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath'
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  var otherKeys = Object
    .keys(config2)
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager_1(),
    response: new InterceptorManager_1()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

var Axios_1 = Axios;

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

var Cancel_1 = Cancel;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel_1(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

var CancelToken_1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
var spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios_1(defaultConfig);
  var instance = bind(Axios_1.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios_1.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults_1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios_1;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = Cancel_1;
axios.CancelToken = CancelToken_1;
axios.isCancel = isCancel;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;

var axios_1 = axios;

// Allow use of default import syntax in TypeScript
var _default = axios;
axios_1.default = _default;

var axios$1 = axios_1;

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
 * Implementation of the HTTP request library interface for node.
 */
class NodeHttpLib {
    constructor() {
        this.throttle = new RequestThrottler();
        this.throttlingEnabled = true;
    }
    /**
     * Set whether requests should be throttled.
     */
    setThrottling(enabled) {
        this.throttlingEnabled = enabled;
    }
    req(method, url, body, opt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.throttlingEnabled && this.throttle.applyThrottle(url)) {
                throw Error("request throttled");
            }
            const resp = yield axios$1({
                method,
                url: url,
                responseType: "text",
                headers: opt === null || opt === void 0 ? void 0 : opt.headers,
                validateStatus: () => true,
                transformResponse: (x) => x,
                data: body,
            });
            const respText = resp.data;
            if (typeof respText !== "string") {
                throw new OperationFailedError(makeErrorDetails(TalerErrorCode.WALLET_RECEIVED_MALFORMED_RESPONSE, "unexpected response type", {
                    httpStatusCode: resp.status,
                    requestUrl: url,
                    requestMethod: method,
                }));
            }
            const makeJson = () => __awaiter(this, void 0, void 0, function* () {
                let responseJson;
                try {
                    responseJson = JSON.parse(respText);
                }
                catch (e) {
                    throw new OperationFailedError(makeErrorDetails(TalerErrorCode.WALLET_RECEIVED_MALFORMED_RESPONSE, "invalid JSON", {
                        httpStatusCode: resp.status,
                        requestUrl: url,
                        requestMethod: method,
                    }));
                }
                if (responseJson === null || typeof responseJson !== "object") {
                    throw new OperationFailedError(makeErrorDetails(TalerErrorCode.WALLET_RECEIVED_MALFORMED_RESPONSE, "invalid JSON", {
                        httpStatusCode: resp.status,
                        requestUrl: url,
                        requestMethod: method,
                    }));
                }
                return responseJson;
            });
            const headers = new Headers();
            for (const hn of Object.keys(resp.headers)) {
                headers.set(hn, resp.headers[hn]);
            }
            return {
                requestUrl: url,
                requestMethod: method,
                headers,
                status: resp.status,
                text: () => __awaiter(this, void 0, void 0, function* () { return resp.data; }),
                json: makeJson,
            };
        });
    }
    get(url, opt) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.req("GET", url, undefined, opt);
        });
    }
    postJson(url, body, opt) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.req("POST", url, body, opt);
        });
    }
}

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

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
 * The synchronous crypto worker produced by this factory doesn't run in the
 * background, but actually blocks the caller until the operation is done.
 */
class SynchronousCryptoWorkerFactory {
    startWorker() {
        if (typeof require === "undefined") {
            throw Error("cannot make worker, require(...) not defined");
        }
        return new SynchronousCryptoWorker();
    }
    getConcurrency() {
        return 1;
    }
}
/**
 * Worker implementation that uses node subprocesses.
 */
class SynchronousCryptoWorker {
    constructor() {
        this.onerror = undefined;
        this.onmessage = undefined;
    }
    /**
     * Add an event listener for either an "error" or "message" event.
     */
    addEventListener(event, fn) {
        switch (event) {
            case "message":
                this.onmessage = fn;
                break;
            case "error":
                this.onerror = fn;
                break;
        }
    }
    dispatchMessage(msg) {
        if (this.onmessage) {
            this.onmessage({ data: msg });
        }
    }
    handleRequest(operation, id, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const impl = new CryptoImplementation();
            if (!(operation in impl)) {
                console.error(`crypto operation '${operation}' not found`);
                return;
            }
            let result;
            try {
                result = impl[operation](...args);
            }
            catch (e) {
                console.log("error during operation", e);
                return;
            }
            try {
                setTimeout(() => this.dispatchMessage({ result, id }), 0);
            }
            catch (e) {
                console.log("got error during dispatch", e);
            }
        });
    }
    /**
     * Send a message to the worker thread.
     */
    postMessage(msg) {
        const args = msg.args;
        if (!Array.isArray(args)) {
            console.error("args must be array");
            return;
        }
        const id = msg.id;
        if (typeof id !== "number") {
            console.error("RPC id must be number");
            return;
        }
        const operation = msg.operation;
        if (typeof operation !== "string") {
            console.error("RPC operation must be string");
            return;
        }
        this.handleRequest(operation, id, args).catch((e) => {
            console.error("Error while handling crypto request:", e);
        });
    }
    /**
     * Forcibly terminate the worker thread.
     */
    terminate() {
        // This is a no-op.
    }
}

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
const logger$d = new Logger("headless/helpers.ts");
/**
 * Get a wallet instance with default settings for node.
 */
function getDefaultNodeWallet(args = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        BridgeIDBFactory.enableTracing = false;
        const myBackend = new MemoryBackend();
        myBackend.enableTracing = false;
        const storagePath = args.persistentStoragePath;
        if (storagePath) {
            try {
                const dbContentStr = fs.readFileSync(storagePath, {
                    encoding: "utf-8",
                });
                const dbContent = JSON.parse(dbContentStr);
                myBackend.importDump(dbContent);
            }
            catch (e) {
                logger$d.warn("could not read wallet file");
            }
            myBackend.afterCommitCallback = () => __awaiter(this, void 0, void 0, function* () {
                // Allow caller to stop persisting the wallet.
                if (args.persistentStoragePath === undefined) {
                    return;
                }
                const dbContent = myBackend.exportDump();
                fs.writeFileSync(storagePath, JSON.stringify(dbContent, undefined, 2), {
                    encoding: "utf-8",
                });
            });
        }
        BridgeIDBFactory.enableTracing = false;
        const myBridgeIdbFactory = new BridgeIDBFactory(myBackend);
        const myIdbFactory = myBridgeIdbFactory;
        let myHttpLib;
        if (args.httpLib) {
            myHttpLib = args.httpLib;
        }
        else {
            myHttpLib = new NodeHttpLib();
        }
        const myVersionChange = () => {
            console.error("version change requested, should not happen");
            throw Error();
        };
        shimIndexedDB(myBridgeIdbFactory);
        const myDb = yield openTalerDatabase(myIdbFactory, myVersionChange);
        let workerFactory;
        try {
            // Try if we have worker threads available, fails in older node versions.
            require("worker_threads");
            workerFactory = new NodeThreadCryptoWorkerFactory();
        }
        catch (e) {
            console.log("worker threads not available, falling back to synchronous workers");
            workerFactory = new SynchronousCryptoWorkerFactory();
        }
        const dbWrap = new Database(myDb);
        const w = new Wallet(dbWrap, myHttpLib, workerFactory);
        if (args.notifyHandler) {
            w.addNotificationListener(args.notifyHandler);
        }
        return w;
    });
}

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
const codecForTransactionsRequest = () => makeCodecForObject()
    .property("currency", makeCodecOptional(codecForString))
    .property("search", makeCodecOptional(codecForString))
    .build("TransactionsRequest");

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
const codecForAddExchangeRequest = () => makeCodecForObject()
    .property("exchangeBaseUrl", codecForString)
    .build("AddExchangeRequest");
const codecForGetExchangeTosRequest = () => makeCodecForObject()
    .property("exchangeBaseUrl", codecForString)
    .build("GetExchangeTosRequest");
const codecForAcceptManualWithdrawalRequet = () => makeCodecForObject()
    .property("exchangeBaseUrl", codecForString)
    .property("amount", codecForString)
    .build("AcceptManualWithdrawalRequest");
const codecForAcceptBankIntegratedWithdrawalRequest = () => makeCodecForObject()
    .property("exchangeBaseUrl", codecForString)
    .property("talerWithdrawUri", codecForString)
    .build("AcceptBankIntegratedWithdrawalRequest");
const codecForGetWithdrawalDetailsForAmountRequest = () => makeCodecForObject()
    .property("exchangeBaseUrl", codecForString)
    .property("amount", codecForString)
    .build("GetWithdrawalDetailsForAmountRequest");
const codecForAcceptExchangeTosRequest = () => makeCodecForObject()
    .property("exchangeBaseUrl", codecForString)
    .property("etag", codecForString)
    .build("AcceptExchangeTosRequest");
const codecForApplyRefundRequest = () => makeCodecForObject()
    .property("talerRefundUri", codecForString)
    .build("ApplyRefundRequest");
const codecForGetWithdrawalDetailsForUri = () => makeCodecForObject()
    .property("talerWithdrawUri", codecForString)
    .build("GetWithdrawalDetailsForUriRequest");
const codecForAbortProposalRequest = () => makeCodecForObject()
    .property("proposalId", codecForString)
    .build("AbortProposalRequest");
const codecForPreparePayRequest = () => makeCodecForObject()
    .property("talerPayUri", codecForString)
    .build("PreparePay");
const codecForConfirmPayRequest = () => makeCodecForObject()
    .property("proposalId", codecForString)
    .property("sessionId", makeCodecOptional(codecForString))
    .build("ConfirmPay");
/**
 * Implementation of the "wallet-core" API.
 */
function dispatchRequestInternal(wallet, operation, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (operation) {
            case "withdrawTestkudos":
                yield wallet.withdrawTestBalance();
                return {};
            case "getTransactions": {
                const req = codecForTransactionsRequest().decode(payload);
                return yield wallet.getTransactions(req);
            }
            case "addExchange": {
                const req = codecForAddExchangeRequest().decode(payload);
                yield wallet.updateExchangeFromUrl(req.exchangeBaseUrl);
                return {};
            }
            case "listExchanges": {
                return yield wallet.getExchanges();
            }
            case "getWithdrawalDetailsForUri": {
                const req = codecForGetWithdrawalDetailsForUri().decode(payload);
                return yield wallet.getWithdrawalDetailsForUri(req.talerWithdrawUri);
            }
            case "acceptManualWithdrawal": {
                const req = codecForAcceptManualWithdrawalRequet().decode(payload);
                const res = yield wallet.acceptManualWithdrawal(req.exchangeBaseUrl, Amounts.parseOrThrow(req.amount));
                return res;
            }
            case "getWithdrawalDetailsForAmount": {
                const req = codecForGetWithdrawalDetailsForAmountRequest().decode(payload);
                return yield wallet.getWithdrawalDetailsForAmount(req.exchangeBaseUrl, Amounts.parseOrThrow(req.amount));
            }
            case "getBalances": {
                return yield wallet.getBalances();
            }
            case "getPendingOperations": {
                return yield wallet.getPendingOperations();
            }
            case "setExchangeTosAccepted": {
                const req = codecForAcceptExchangeTosRequest().decode(payload);
                yield wallet.acceptExchangeTermsOfService(req.exchangeBaseUrl, req.etag);
                return {};
            }
            case "applyRefund": {
                const req = codecForApplyRefundRequest().decode(payload);
                return yield wallet.applyRefund(req.talerRefundUri);
            }
            case "acceptBankIntegratedWithdrawal": {
                const req = codecForAcceptBankIntegratedWithdrawalRequest().decode(payload);
                return yield wallet.acceptWithdrawal(req.talerWithdrawUri, req.exchangeBaseUrl);
            }
            case "getExchangeTos": {
                const req = codecForGetExchangeTosRequest().decode(payload);
                return wallet.getExchangeTos(req.exchangeBaseUrl);
            }
            case "abortProposal": {
                const req = codecForAbortProposalRequest().decode(payload);
                yield wallet.refuseProposal(req.proposalId);
                return {};
            }
            case "retryPendingNow": {
                yield wallet.runPending(true);
                return {};
            }
            case "preparePay": {
                const req = codecForPreparePayRequest().decode(payload);
                return yield wallet.preparePayForUri(req.talerPayUri);
            }
            case "confirmPay": {
                const req = codecForConfirmPayRequest().decode(payload);
                return yield wallet.confirmPay(req.proposalId, req.sessionId);
            }
        }
        throw OperationFailedError.fromCode(TalerErrorCode.WALLET_CORE_API_OPERATION_UNKNOWN, "unknown operation", {
            operation,
        });
    });
}
/**
 * Handle a request to the wallet-core API.
 */
function handleCoreApiRequest(w, operation, id, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield dispatchRequestInternal(w, operation, payload);
            return {
                type: "response",
                operation,
                id,
                result,
            };
        }
        catch (e) {
            if (e instanceof OperationFailedError ||
                e instanceof OperationFailedAndReportedError) {
                return {
                    type: "error",
                    operation,
                    id,
                    error: e.operationError,
                };
            }
            else {
                return {
                    type: "error",
                    operation,
                    id,
                    error: makeErrorDetails(TalerErrorCode.WALLET_UNEXPECTED_EXCEPTION, `unexpected exception: ${e}`, {}),
                };
            }
        }
    });
}

var jed = createCommonjsModule(function (module, exports) {
/**
 * @preserve jed.js https://github.com/SlexAxton/Jed
 */
/*
-----------
A gettext compatible i18n library for modern JavaScript Applications

by Alex Sexton - AlexSexton [at] gmail - @SlexAxton

MIT License

A jQuery Foundation project - requires CLA to contribute -
https://contribute.jquery.org/CLA/



Jed offers the entire applicable GNU gettext spec'd set of
functions, but also offers some nicer wrappers around them.
The api for gettext was written for a language with no function
overloading, so Jed allows a little more of that.

Many thanks to Joshua I. Miller - unrtst@cpan.org - who wrote
gettext.js back in 2008. I was able to vet a lot of my ideas
against his. I also made sure Jed passed against his tests
in order to offer easy upgrades -- jsgettext.berlios.de
*/
(function (root, undef) {

  // Set up some underscore-style functions, if you already have
  // underscore, feel free to delete this section, and use it
  // directly, however, the amount of functions used doesn't
  // warrant having underscore as a full dependency.
  // Underscore 1.3.0 was used to port and is licensed
  // under the MIT License by Jeremy Ashkenas.
  var ArrayProto    = Array.prototype,
      ObjProto      = Object.prototype,
      slice         = ArrayProto.slice,
      hasOwnProp    = ObjProto.hasOwnProperty,
      nativeForEach = ArrayProto.forEach,
      breaker       = {};

  // We're not using the OOP style _ so we don't need the
  // extra level of indirection. This still means that you
  // sub out for real `_` though.
  var _ = {
    forEach : function( obj, iterator, context ) {
      var i, l, key;
      if ( obj === null ) {
        return;
      }

      if ( nativeForEach && obj.forEach === nativeForEach ) {
        obj.forEach( iterator, context );
      }
      else if ( obj.length === +obj.length ) {
        for ( i = 0, l = obj.length; i < l; i++ ) {
          if ( i in obj && iterator.call( context, obj[i], i, obj ) === breaker ) {
            return;
          }
        }
      }
      else {
        for ( key in obj) {
          if ( hasOwnProp.call( obj, key ) ) {
            if ( iterator.call (context, obj[key], key, obj ) === breaker ) {
              return;
            }
          }
        }
      }
    },
    extend : function( obj ) {
      this.forEach( slice.call( arguments, 1 ), function ( source ) {
        for ( var prop in source ) {
          obj[prop] = source[prop];
        }
      });
      return obj;
    }
  };
  // END Miniature underscore impl

  // Jed is a constructor function
  var Jed = function ( options ) {
    // Some minimal defaults
    this.defaults = {
      "locale_data" : {
        "messages" : {
          "" : {
            "domain"       : "messages",
            "lang"         : "en",
            "plural_forms" : "nplurals=2; plural=(n != 1);"
          }
          // There are no default keys, though
        }
      },
      // The default domain if one is missing
      "domain" : "messages",
      // enable debug mode to log untranslated strings to the console
      "debug" : false
    };

    // Mix in the sent options with the default options
    this.options = _.extend( {}, this.defaults, options );
    this.textdomain( this.options.domain );

    if ( options.domain && ! this.options.locale_data[ this.options.domain ] ) {
      throw new Error('Text domain set to non-existent domain: `' + options.domain + '`');
    }
  };

  // The gettext spec sets this character as the default
  // delimiter for context lookups.
  // e.g.: context\u0004key
  // If your translation company uses something different,
  // just change this at any time and it will use that instead.
  Jed.context_delimiter = String.fromCharCode( 4 );

  function getPluralFormFunc ( plural_form_string ) {
    return Jed.PF.compile( plural_form_string || "nplurals=2; plural=(n != 1);");
  }

  function Chain( key, i18n ){
    this._key = key;
    this._i18n = i18n;
  }

  // Create a chainable api for adding args prettily
  _.extend( Chain.prototype, {
    onDomain : function ( domain ) {
      this._domain = domain;
      return this;
    },
    withContext : function ( context ) {
      this._context = context;
      return this;
    },
    ifPlural : function ( num, pkey ) {
      this._val = num;
      this._pkey = pkey;
      return this;
    },
    fetch : function ( sArr ) {
      if ( {}.toString.call( sArr ) != '[object Array]' ) {
        sArr = [].slice.call(arguments, 0);
      }
      return ( sArr && sArr.length ? Jed.sprintf : function(x){ return x; } )(
        this._i18n.dcnpgettext(this._domain, this._context, this._key, this._pkey, this._val),
        sArr
      );
    }
  });

  // Add functions to the Jed prototype.
  // These will be the functions on the object that's returned
  // from creating a `new Jed()`
  // These seem redundant, but they gzip pretty well.
  _.extend( Jed.prototype, {
    // The sexier api start point
    translate : function ( key ) {
      return new Chain( key, this );
    },

    textdomain : function ( domain ) {
      if ( ! domain ) {
        return this._textdomain;
      }
      this._textdomain = domain;
    },

    gettext : function ( key ) {
      return this.dcnpgettext.call( this, undef, undef, key );
    },

    dgettext : function ( domain, key ) {
     return this.dcnpgettext.call( this, domain, undef, key );
    },

    dcgettext : function ( domain , key /*, category */ ) {
      // Ignores the category anyways
      return this.dcnpgettext.call( this, domain, undef, key );
    },

    ngettext : function ( skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, undef, skey, pkey, val );
    },

    dngettext : function ( domain, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    dcngettext : function ( domain, skey, pkey, val/*, category */) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    pgettext : function ( context, key ) {
      return this.dcnpgettext.call( this, undef, context, key );
    },

    dpgettext : function ( domain, context, key ) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    dcpgettext : function ( domain, context, key/*, category */) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    npgettext : function ( context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, context, skey, pkey, val );
    },

    dnpgettext : function ( domain, context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, context, skey, pkey, val );
    },

    // The most fully qualified gettext function. It has every option.
    // Since it has every option, we can use it from every other method.
    // This is the bread and butter.
    // Technically there should be one more argument in this function for 'Category',
    // but since we never use it, we might as well not waste the bytes to define it.
    dcnpgettext : function ( domain, context, singular_key, plural_key, val ) {
      // Set some defaults

      plural_key = plural_key || singular_key;

      // Use the global domain default if one
      // isn't explicitly passed in
      domain = domain || this._textdomain;

      var fallback;

      // Handle special cases

      // No options found
      if ( ! this.options ) {
        // There's likely something wrong, but we'll return the correct key for english
        // We do this by instantiating a brand new Jed instance with the default set
        // for everything that could be broken.
        fallback = new Jed();
        return fallback.dcnpgettext.call( fallback, undefined, undefined, singular_key, plural_key, val );
      }

      // No translation data provided
      if ( ! this.options.locale_data ) {
        throw new Error('No locale data provided.');
      }

      if ( ! this.options.locale_data[ domain ] ) {
        throw new Error('Domain `' + domain + '` was not found.');
      }

      if ( ! this.options.locale_data[ domain ][ "" ] ) {
        throw new Error('No locale meta information provided.');
      }

      // Make sure we have a truthy key. Otherwise we might start looking
      // into the empty string key, which is the options for the locale
      // data.
      if ( ! singular_key ) {
        throw new Error('No translation key found.');
      }

      var key  = context ? context + Jed.context_delimiter + singular_key : singular_key,
          locale_data = this.options.locale_data,
          dict = locale_data[ domain ],
          defaultConf = (locale_data.messages || this.defaults.locale_data.messages)[""],
          pluralForms = dict[""].plural_forms || dict[""]["Plural-Forms"] || dict[""]["plural-forms"] || defaultConf.plural_forms || defaultConf["Plural-Forms"] || defaultConf["plural-forms"],
          val_list,
          res;

      var val_idx;
      if (val === undefined) {
        // No value passed in; assume singular key lookup.
        val_idx = 0;

      } else {
        // Value has been passed in; use plural-forms calculations.

        // Handle invalid numbers, but try casting strings for good measure
        if ( typeof val != 'number' ) {
          val = parseInt( val, 10 );

          if ( isNaN( val ) ) {
            throw new Error('The number that was passed in is not a number.');
          }
        }

        val_idx = getPluralFormFunc(pluralForms)(val);
      }

      // Throw an error if a domain isn't found
      if ( ! dict ) {
        throw new Error('No domain named `' + domain + '` could be found.');
      }

      val_list = dict[ key ];

      // If there is no match, then revert back to
      // english style singular/plural with the keys passed in.
      if ( ! val_list || val_idx > val_list.length ) {
        if (this.options.missing_key_callback) {
          this.options.missing_key_callback(key, domain);
        }
        res = [ singular_key, plural_key ];

        // collect untranslated strings
        if (this.options.debug===true) {
          console.log(res[ getPluralFormFunc(pluralForms)( val ) ]);
        }
        return res[ getPluralFormFunc()( val ) ];
      }

      res = val_list[ val_idx ];

      // This includes empty strings on purpose
      if ( ! res  ) {
        res = [ singular_key, plural_key ];
        return res[ getPluralFormFunc()( val ) ];
      }
      return res;
    }
  });


  // We add in sprintf capabilities for post translation value interolation
  // This is not internally used, so you can remove it if you have this
  // available somewhere else, or want to use a different system.

  // We _slightly_ modify the normal sprintf behavior to more gracefully handle
  // undefined values.

  /**
   sprintf() for JavaScript 0.7-beta1
   http://www.diveintojavascript.com/projects/javascript-sprintf

   Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:
       * Redistributions of source code must retain the above copyright
         notice, this list of conditions and the following disclaimer.
       * Redistributions in binary form must reproduce the above copyright
         notice, this list of conditions and the following disclaimer in the
         documentation and/or other materials provided with the distribution.
       * Neither the name of sprintf() for JavaScript nor the
         names of its contributors may be used to endorse or promote products
         derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
   DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
   ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */
  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }
    function str_repeat(input, multiplier) {
      for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
      return output.join('');
    }

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          }
          else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
          }

          // Jed EDIT
          if ( typeof arg == 'undefined' || arg === null ) {
            arg = '';
          }
          // Jed EDIT

          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw('[sprintf] huh?');
                }
              }
            }
            else {
              throw('[sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw('[sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();

  var vsprintf = function(fmt, argv) {
    argv.unshift(fmt);
    return sprintf.apply(null, argv);
  };

  Jed.parse_plural = function ( plural_forms, n ) {
    plural_forms = plural_forms.replace(/n/g, n);
    return Jed.parse_expression(plural_forms);
  };

  Jed.sprintf = function ( fmt, args ) {
    if ( {}.toString.call( args ) == '[object Array]' ) {
      return vsprintf( fmt, [].slice.call(args) );
    }
    return sprintf.apply(this, [].slice.call(arguments) );
  };

  Jed.prototype.sprintf = function () {
    return Jed.sprintf.apply(this, arguments);
  };
  // END sprintf Implementation

  // Start the Plural forms section
  // This is a full plural form expression parser. It is used to avoid
  // running 'eval' or 'new Function' directly against the plural
  // forms.
  //
  // This can be important if you get translations done through a 3rd
  // party vendor. I encourage you to use this instead, however, I
  // also will provide a 'precompiler' that you can use at build time
  // to output valid/safe function representations of the plural form
  // expressions. This means you can build this code out for the most
  // part.
  Jed.PF = {};

  Jed.PF.parse = function ( p ) {
    var plural_str = Jed.PF.extractPluralExpr( p );
    return Jed.PF.parser.parse.call(Jed.PF.parser, plural_str);
  };

  Jed.PF.compile = function ( p ) {
    // Handle trues and falses as 0 and 1
    function imply( val ) {
      return (val === true ? 1 : val ? val : 0);
    }

    var ast = Jed.PF.parse( p );
    return function ( n ) {
      return imply( Jed.PF.interpreter( ast )( n ) );
    };
  };

  Jed.PF.interpreter = function ( ast ) {
    return function ( n ) {
      switch ( ast.type ) {
        case 'GROUP':
          return Jed.PF.interpreter( ast.expr )( n );
        case 'TERNARY':
          if ( Jed.PF.interpreter( ast.expr )( n ) ) {
            return Jed.PF.interpreter( ast.truthy )( n );
          }
          return Jed.PF.interpreter( ast.falsey )( n );
        case 'OR':
          return Jed.PF.interpreter( ast.left )( n ) || Jed.PF.interpreter( ast.right )( n );
        case 'AND':
          return Jed.PF.interpreter( ast.left )( n ) && Jed.PF.interpreter( ast.right )( n );
        case 'LT':
          return Jed.PF.interpreter( ast.left )( n ) < Jed.PF.interpreter( ast.right )( n );
        case 'GT':
          return Jed.PF.interpreter( ast.left )( n ) > Jed.PF.interpreter( ast.right )( n );
        case 'LTE':
          return Jed.PF.interpreter( ast.left )( n ) <= Jed.PF.interpreter( ast.right )( n );
        case 'GTE':
          return Jed.PF.interpreter( ast.left )( n ) >= Jed.PF.interpreter( ast.right )( n );
        case 'EQ':
          return Jed.PF.interpreter( ast.left )( n ) == Jed.PF.interpreter( ast.right )( n );
        case 'NEQ':
          return Jed.PF.interpreter( ast.left )( n ) != Jed.PF.interpreter( ast.right )( n );
        case 'MOD':
          return Jed.PF.interpreter( ast.left )( n ) % Jed.PF.interpreter( ast.right )( n );
        case 'VAR':
          return n;
        case 'NUM':
          return ast.val;
        default:
          throw new Error("Invalid Token found.");
      }
    };
  };

  Jed.PF.extractPluralExpr = function ( p ) {
    // trim first
    p = p.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

    if (! /;\s*$/.test(p)) {
      p = p.concat(';');
    }

    var nplurals_re = /nplurals\=(\d+);/,
        plural_re = /plural\=(.*);/,
        nplurals_matches = p.match( nplurals_re ),
        res = {},
        plural_matches;

    // Find the nplurals number
    if ( nplurals_matches.length > 1 ) {
      res.nplurals = nplurals_matches[1];
    }
    else {
      throw new Error('nplurals not found in plural_forms string: ' + p );
    }

    // remove that data to get to the formula
    p = p.replace( nplurals_re, "" );
    plural_matches = p.match( plural_re );

    if (!( plural_matches && plural_matches.length > 1 ) ) {
      throw new Error('`plural` expression not found: ' + p);
    }
    return plural_matches[ 1 ];
  };

  /* Jison generated parser */
  Jed.PF.parser = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"e":4,"EOF":5,"?":6,":":7,"||":8,"&&":9,"<":10,"<=":11,">":12,">=":13,"!=":14,"==":15,"%":16,"(":17,")":18,"n":19,"NUMBER":20,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"?",7:":",8:"||",9:"&&",10:"<",11:"<=",12:">",13:">=",14:"!=",15:"==",16:"%",17:"(",18:")",19:"n",20:"NUMBER"},
productions_: [0,[3,2],[4,5],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,1],[4,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return { type : 'GROUP', expr: $$[$0-1] };
case 2:this.$ = { type: 'TERNARY', expr: $$[$0-4], truthy : $$[$0-2], falsey: $$[$0] };
break;
case 3:this.$ = { type: "OR", left: $$[$0-2], right: $$[$0] };
break;
case 4:this.$ = { type: "AND", left: $$[$0-2], right: $$[$0] };
break;
case 5:this.$ = { type: 'LT', left: $$[$0-2], right: $$[$0] };
break;
case 6:this.$ = { type: 'LTE', left: $$[$0-2], right: $$[$0] };
break;
case 7:this.$ = { type: 'GT', left: $$[$0-2], right: $$[$0] };
break;
case 8:this.$ = { type: 'GTE', left: $$[$0-2], right: $$[$0] };
break;
case 9:this.$ = { type: 'NEQ', left: $$[$0-2], right: $$[$0] };
break;
case 10:this.$ = { type: 'EQ', left: $$[$0-2], right: $$[$0] };
break;
case 11:this.$ = { type: 'MOD', left: $$[$0-2], right: $$[$0] };
break;
case 12:this.$ = { type: 'GROUP', expr: $$[$0-1] };
break;
case 13:this.$ = { type: 'VAR' };
break;
case 14:this.$ = { type: 'NUM', val: Number(yytext) };
break;
}
},
table: [{3:1,4:2,17:[1,3],19:[1,4],20:[1,5]},{1:[3]},{5:[1,6],6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{4:17,17:[1,3],19:[1,4],20:[1,5]},{5:[2,13],6:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],11:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],18:[2,13]},{5:[2,14],6:[2,14],7:[2,14],8:[2,14],9:[2,14],10:[2,14],11:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],18:[2,14]},{1:[2,1]},{4:18,17:[1,3],19:[1,4],20:[1,5]},{4:19,17:[1,3],19:[1,4],20:[1,5]},{4:20,17:[1,3],19:[1,4],20:[1,5]},{4:21,17:[1,3],19:[1,4],20:[1,5]},{4:22,17:[1,3],19:[1,4],20:[1,5]},{4:23,17:[1,3],19:[1,4],20:[1,5]},{4:24,17:[1,3],19:[1,4],20:[1,5]},{4:25,17:[1,3],19:[1,4],20:[1,5]},{4:26,17:[1,3],19:[1,4],20:[1,5]},{4:27,17:[1,3],19:[1,4],20:[1,5]},{6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[1,28]},{6:[1,7],7:[1,29],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{5:[2,3],6:[2,3],7:[2,3],8:[2,3],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,3]},{5:[2,4],6:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,4]},{5:[2,5],6:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],11:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[1,16],18:[2,5]},{5:[2,6],6:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],11:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[1,16],18:[2,6]},{5:[2,7],6:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],11:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[1,16],18:[2,7]},{5:[2,8],6:[2,8],7:[2,8],8:[2,8],9:[2,8],10:[2,8],11:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[1,16],18:[2,8]},{5:[2,9],6:[2,9],7:[2,9],8:[2,9],9:[2,9],10:[2,9],11:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[1,16],18:[2,9]},{5:[2,10],6:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],11:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[1,16],18:[2,10]},{5:[2,11],6:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],11:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],18:[2,11]},{5:[2,12],6:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],11:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],18:[2,12]},{4:30,17:[1,3],19:[1,4],20:[1,5]},{5:[2,2],6:[1,7],7:[2,2],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,2]}],
defaultActions: {6:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + this.terminals_[symbol]+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length};
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 20
case 2:return 19
case 3:return 8
case 4:return 9
case 5:return 6
case 6:return 7
case 7:return 11
case 8:return 13
case 9:return 10
case 10:return 12
case 11:return 14
case 12:return 15
case 13:return 16
case 14:return 17
case 15:return 18
case 16:return 5
case 17:return 'INVALID'
}
};
lexer.rules = [/^\s+/,/^[0-9]+(\.[0-9]+)?\b/,/^n\b/,/^\|\|/,/^&&/,/^\?/,/^:/,/^<=/,/^>=/,/^</,/^>/,/^!=/,/^==/,/^%/,/^\(/,/^\)/,/^$/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":true}};return lexer;})();
parser.lexer = lexer;
return parser;
})();
// End parser

  // Handle node, amd, and global systems
  {
    if ( module.exports) {
      exports = module.exports = Jed;
    }
    exports.Jed = Jed;
  }

})();
});

/*
 This file is part of GNU Taler
 (C) 2019 GNUnet e.V.

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
const handleWorkerError$1 = handleWorkerError;
const handleWorkerMessage$1 = handleWorkerMessage;
class AndroidHttpLib {
    constructor(sendMessage) {
        this.sendMessage = sendMessage;
        this.useNfcTunnel = false;
        this.nodeHttpLib = new NodeHttpLib();
        this.requestId = 1;
        this.requestMap = {};
    }
    get(url, opt) {
        if (this.useNfcTunnel) {
            const myId = this.requestId++;
            const p = openPromise();
            this.requestMap[myId] = p;
            const request = {
                method: "get",
                url,
            };
            this.sendMessage(JSON.stringify({
                type: "tunnelHttp",
                request,
                id: myId,
            }));
            return p.promise;
        }
        else {
            return this.nodeHttpLib.get(url, opt);
        }
    }
    postJson(url, body, opt) {
        if (this.useNfcTunnel) {
            const myId = this.requestId++;
            const p = openPromise();
            this.requestMap[myId] = p;
            const request = {
                method: "postJson",
                url,
                body,
            };
            this.sendMessage(JSON.stringify({ type: "tunnelHttp", request, id: myId }));
            return p.promise;
        }
        else {
            return this.nodeHttpLib.postJson(url, body, opt);
        }
    }
    handleTunnelResponse(msg) {
        const myId = msg.id;
        const p = this.requestMap[myId];
        if (!p) {
            console.error(`no matching request for tunneled HTTP response, id=${myId}`);
        }
        const headers = new Headers();
        if (msg.status != 0) {
            const resp = {
                // FIXME: pass through this URL
                requestUrl: "",
                headers,
                status: msg.status,
                requestMethod: "FIXME",
                json: () => __awaiter(this, void 0, void 0, function* () { return JSON.parse(msg.responseText); }),
                text: () => __awaiter(this, void 0, void 0, function* () { return msg.responseText; }),
            };
            p.resolve(resp);
        }
        else {
            p.reject(new Error(`unexpected HTTP status code ${msg.status}`));
        }
        delete this.requestMap[myId];
    }
}
function sendAkonoMessage(ev) {
    // @ts-ignore
    const sendMessage = globalThis.__akono_sendMessage;
    if (typeof sendMessage !== "function") {
        const errMsg = "FATAL: cannot install android wallet listener: akono functions missing";
        console.error(errMsg);
        throw new Error(errMsg);
    }
    const m = JSON.stringify(ev);
    // @ts-ignore
    sendMessage(m);
}
class AndroidWalletMessageHandler {
    constructor() {
        this.wp = openPromise();
        this.httpLib = new NodeHttpLib();
    }
    /**
     * Handle a request from the Android wallet.
     */
    handleMessage(operation, id, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const wrapResponse = (result) => {
                return {
                    type: "response",
                    id,
                    operation,
                    result,
                };
            };
            switch (operation) {
                case "init": {
                    this.walletArgs = {
                        notifyHandler: (notification) => __awaiter(this, void 0, void 0, function* () {
                            sendAkonoMessage({ type: "notification", payload: notification });
                        }),
                        persistentStoragePath: args.persistentStoragePath,
                        httpLib: this.httpLib,
                    };
                    const w = yield getDefaultNodeWallet(this.walletArgs);
                    this.maybeWallet = w;
                    w.runRetryLoop().catch((e) => {
                        console.error("Error during wallet retry loop", e);
                    });
                    this.wp.resolve(w);
                    return wrapResponse({
                        supported_protocol_versions: {
                            exchange: WALLET_EXCHANGE_PROTOCOL_VERSION,
                            merchant: WALLET_MERCHANT_PROTOCOL_VERSION,
                        },
                    });
                }
                case "getHistory": {
                    return wrapResponse({ history: [] });
                }
                case "startTunnel": {
                    // this.httpLib.useNfcTunnel = true;
                    throw Error("not implemented");
                }
                case "stopTunnel": {
                    // this.httpLib.useNfcTunnel = false;
                    throw Error("not implemented");
                }
                case "tunnelResponse": {
                    // httpLib.handleTunnelResponse(msg.args);
                    throw Error("not implemented");
                }
                case "reset": {
                    const oldArgs = this.walletArgs;
                    this.walletArgs = Object.assign({}, oldArgs);
                    if (oldArgs && oldArgs.persistentStoragePath) {
                        try {
                            fs.unlinkSync(oldArgs.persistentStoragePath);
                        }
                        catch (e) {
                            console.error("Error while deleting the wallet db:", e);
                        }
                        // Prevent further storage!
                        this.walletArgs.persistentStoragePath = undefined;
                    }
                    const wallet = yield this.wp.promise;
                    wallet.stop();
                    this.wp = openPromise();
                    this.maybeWallet = undefined;
                    const w = yield getDefaultNodeWallet(this.walletArgs);
                    this.maybeWallet = w;
                    w.runRetryLoop().catch((e) => {
                        console.error("Error during wallet retry loop", e);
                    });
                    this.wp.resolve(w);
                    return wrapResponse({});
                }
                default: {
                    const wallet = yield this.wp.promise;
                    return yield handleCoreApiRequest(wallet, operation, id, args);
                }
            }
        });
    }
}
function installAndroidWalletListener() {
    const handler = new AndroidWalletMessageHandler();
    const onMessage = (msgStr) => __awaiter(this, void 0, void 0, function* () {
        if (typeof msgStr !== "string") {
            console.error("expected string as message");
            return;
        }
        const msg = JSON.parse(msgStr);
        const operation = msg.operation;
        if (typeof operation !== "string") {
            console.error("message to android wallet helper must contain operation of type string");
            return;
        }
        const id = msg.id;
        console.log(`android listener: got request for ${operation} (${id})`);
        try {
            const respMsg = yield handler.handleMessage(operation, id, msg.args);
            console.log(`android listener: sending success response for ${operation} (${id})`);
            sendAkonoMessage(respMsg);
        }
        catch (e) {
            const respMsg = {
                type: "error",
                id,
                operation,
                error: makeErrorDetails(TalerErrorCode.WALLET_UNEXPECTED_EXCEPTION, "unexpected exception", {}),
            };
            sendAkonoMessage(respMsg);
            return;
        }
    });
    // @ts-ignore
    globalThis.__akono_onMessage = onMessage;
    console.log("android wallet listener installed");
}

exports.AndroidHttpLib = AndroidHttpLib;
exports.handleWorkerError = handleWorkerError$1;
exports.handleWorkerMessage = handleWorkerMessage$1;
exports.installAndroidWalletListener = installAndroidWalletListener;
