'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var crypto = _interopDefault(require('crypto'));
var http$1 = _interopDefault(require('http'));
var https = _interopDefault(require('https'));
var url = _interopDefault(require('url'));
var assert = _interopDefault(require('assert'));
var stream = _interopDefault(require('stream'));
var tty = _interopDefault(require('tty'));
var util = _interopDefault(require('util'));
var os = _interopDefault(require('os'));
var zlib = _interopDefault(require('zlib'));
var fs = _interopDefault(require('fs'));
var worker_threads = _interopDefault(require('worker_threads'));

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}
function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}
function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

var tslib_es6 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	__extends: __extends,
	get __assign () { return __assign; },
	__rest: __rest,
	__decorate: __decorate,
	__param: __param,
	__metadata: __metadata,
	__awaiter: __awaiter,
	__generator: __generator,
	__exportStar: __exportStar,
	__values: __values,
	__read: __read,
	__spread: __spread,
	__spreadArrays: __spreadArrays,
	__await: __await,
	__asyncGenerator: __asyncGenerator,
	__asyncDelegator: __asyncDelegator,
	__asyncValues: __asyncValues,
	__makeTemplateObject: __makeTemplateObject,
	__importStar: __importStar,
	__importDefault: __importDefault,
	__classPrivateFieldGet: __classPrivateFieldGet,
	__classPrivateFieldSet: __classPrivateFieldSet
});

var codec = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Type-safe codecs for converting from/to JSON.
 */
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
exports.DecodingError = DecodingError;
function renderContext(c) {
    const p = c === null || c === void 0 ? void 0 : c.path;
    if (p) {
        return p.join(".");
    }
    else {
        return "(unknown)";
    }
}
exports.renderContext = renderContext;
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
exports.UnionCodecPreBuilder = UnionCodecPreBuilder;
/**
 * Return a builder for a codec that decodes an object with properties.
 */
function makeCodecForObject() {
    return new ObjectCodecBuilder();
}
exports.makeCodecForObject = makeCodecForObject;
function makeCodecForUnion() {
    return new UnionCodecPreBuilder();
}
exports.makeCodecForUnion = makeCodecForUnion;
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
exports.makeCodecForMap = makeCodecForMap;
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
exports.makeCodecForList = makeCodecForList;
/**
 * Return a codec for a value that must be a number.
 */
exports.codecForNumber = {
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
exports.codecForBoolean = {
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
exports.codecForString = {
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
exports.codecForAny = {
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
exports.makeCodecForConstString = makeCodecForConstString;
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
exports.makeCodecOptional = makeCodecOptional;

});

unwrapExports(codec);
var codec_1 = codec.DecodingError;
var codec_2 = codec.renderContext;
var codec_3 = codec.UnionCodecPreBuilder;
var codec_4 = codec.makeCodecForObject;
var codec_5 = codec.makeCodecForUnion;
var codec_6 = codec.makeCodecForMap;
var codec_7 = codec.makeCodecForList;
var codec_8 = codec.codecForNumber;
var codec_9 = codec.codecForBoolean;
var codec_10 = codec.codecForString;
var codec_11 = codec.codecForAny;
var codec_12 = codec.makeCodecForConstString;
var codec_13 = codec.makeCodecOptional;

var amounts = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Types and helper functions for dealing with Taler amounts.
 */
/**
 * Imports.
 */

/**
 * Number of fractional units that one value unit represents.
 */
exports.fractionalBase = 1e8;
/**
 * How many digits behind the comma are required to represent the
 * fractional value in human readable decimal format?  Must match
 * lg(fractionalBase)
 */
exports.fractionalLength = 8;
/**
 * Maximum allowed value field of an amount.
 */
exports.maxAmountValue = Math.pow(2, 52);
exports.codecForAmountJson = () => codec.makeCodecForObject()
    .property("currency", codec.codecForString)
    .property("value", codec.codecForNumber)
    .property("fraction", codec.codecForNumber)
    .build("AmountJson");
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
exports.getZero = getZero;
function sum(amounts) {
    if (amounts.length <= 0) {
        throw Error("can't sum zero amounts");
    }
    return add(amounts[0], ...amounts.slice(1));
}
exports.sum = sum;
/**
 * Add two amounts.  Return the result and whether
 * the addition overflowed.  The overflow is always handled
 * by saturating and never by wrapping.
 *
 * Throws when currencies don't match.
 */
function add(first, ...rest) {
    const currency = first.currency;
    let value = first.value + Math.floor(first.fraction / exports.fractionalBase);
    if (value > exports.maxAmountValue) {
        return {
            amount: { currency, value: exports.maxAmountValue, fraction: exports.fractionalBase - 1 },
            saturated: true,
        };
    }
    let fraction = first.fraction % exports.fractionalBase;
    for (const x of rest) {
        if (x.currency !== currency) {
            throw Error(`Mismatched currency: ${x.currency} and ${currency}`);
        }
        value =
            value + x.value + Math.floor((fraction + x.fraction) / exports.fractionalBase);
        fraction = Math.floor((fraction + x.fraction) % exports.fractionalBase);
        if (value > exports.maxAmountValue) {
            return {
                amount: {
                    currency,
                    value: exports.maxAmountValue,
                    fraction: exports.fractionalBase - 1,
                },
                saturated: true,
            };
        }
    }
    return { amount: { currency, value, fraction }, saturated: false };
}
exports.add = add;
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
            fraction += exports.fractionalBase;
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
exports.sub = sub;
/**
 * Compare two amounts.  Returns 0 when equal, -1 when a < b
 * and +1 when a > b.  Throws when currencies don't match.
 */
function cmp(a, b) {
    if (a.currency !== b.currency) {
        throw Error(`Mismatched currency: ${a.currency} and ${b.currency}`);
    }
    const av = a.value + Math.floor(a.fraction / exports.fractionalBase);
    const af = a.fraction % exports.fractionalBase;
    const bv = b.value + Math.floor(b.fraction / exports.fractionalBase);
    const bf = b.fraction % exports.fractionalBase;
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
exports.cmp = cmp;
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
exports.copy = copy;
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
        fraction: Math.floor((r * exports.fractionalBase + a.fraction) / n),
        value: Math.floor(a.value / n),
    };
}
exports.divide = divide;
/**
 * Check if an amount is non-zero.
 */
function isNonZero(a) {
    return a.value > 0 || a.fraction > 0;
}
exports.isNonZero = isNonZero;
function isZero(a) {
    return a.value === 0 && a.fraction === 0;
}
exports.isZero = isZero;
/**
 * Parse an amount like 'EUR:20.5' for 20 Euros and 50 ct.
 */
function parse(s) {
    const res = s.match(/^([a-zA-Z0-9_*-]+):([0-9]+)([.][0-9]+)?$/);
    if (!res) {
        return undefined;
    }
    const tail = res[3] || ".0";
    if (tail.length > exports.fractionalLength + 1) {
        return undefined;
    }
    const value = Number.parseInt(res[2]);
    if (value > exports.maxAmountValue) {
        return undefined;
    }
    return {
        currency: res[1],
        fraction: Math.round(exports.fractionalBase * Number.parseFloat(tail)),
        value,
    };
}
exports.parse = parse;
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
exports.parseOrThrow = parseOrThrow;
/**
 * Convert a float to a Taler amount.
 * Loss of precision possible.
 */
function fromFloat(floatVal, currency) {
    return {
        currency,
        fraction: Math.floor((floatVal - Math.floor(floatVal)) * exports.fractionalBase),
        value: Math.floor(floatVal),
    };
}
exports.fromFloat = fromFloat;
/**
 * Convert to standard human-readable string representation that's
 * also used in JSON formats.
 */
function stringify(a) {
    const av = a.value + Math.floor(a.fraction / exports.fractionalBase);
    const af = a.fraction % exports.fractionalBase;
    let s = av.toString();
    if (af) {
        s = s + ".";
        let n = af;
        for (let i = 0; i < exports.fractionalLength; i++) {
            if (!n) {
                break;
            }
            s = s + Math.floor((n / exports.fractionalBase) * 10).toString();
            n = (n * 10) % exports.fractionalBase;
        }
    }
    return `${a.currency}:${s}`;
}
exports.stringify = stringify;
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
    let acc = Object.assign({}, a);
    while (n > 1) {
        let r;
        if (n % 2 == 0) {
            n = n / 2;
            r = add(acc, acc);
        }
        else {
            n = n - 1;
            r = add(acc, a);
        }
        if (r.saturated) {
            return r;
        }
        acc = r.amount;
    }
    return { amount: acc, saturated: false };
}
// Export all amount-related functions here for better IDE experience.
exports.Amounts = {
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
    maxAmountValue: exports.maxAmountValue,
    fromFloat: fromFloat,
    copy: copy,
};

});

unwrapExports(amounts);
var amounts_1 = amounts.fractionalBase;
var amounts_2 = amounts.fractionalLength;
var amounts_3 = amounts.maxAmountValue;
var amounts_4 = amounts.codecForAmountJson;
var amounts_5 = amounts.getZero;
var amounts_6 = amounts.sum;
var amounts_7 = amounts.add;
var amounts_8 = amounts.sub;
var amounts_9 = amounts.cmp;
var amounts_10 = amounts.copy;
var amounts_11 = amounts.divide;
var amounts_12 = amounts.isNonZero;
var amounts_13 = amounts.isZero;
var amounts_14 = amounts.parse;
var amounts_15 = amounts.parseOrThrow;
var amounts_16 = amounts.fromFloat;
var amounts_17 = amounts.stringify;
var amounts_18 = amounts.Amounts;

var promiseUtils = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.openPromise = openPromise;
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
exports.AsyncCondition = AsyncCondition;

});

unwrapExports(promiseUtils);
var promiseUtils_1 = promiseUtils.openPromise;
var promiseUtils_2 = promiseUtils.AsyncCondition;

var tslib_1 = getCjsExportFromNamespace(tslib_es6);

var query = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Database query abstractions.
 * @module Query
 * @author Florian Dold
 */
/**
 * Imports.
 */

/**
 * Exception that should be thrown by client code to abort a transaction.
 */
exports.TransactionAbort = Symbol("transaction_abort");
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
exports.Store = Store;
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
            reject(exports.TransactionAbort);
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
        let p = promiseUtils.openPromise();
        this.currentPromise = p.promise;
        req.onsuccess = () => {
            if (!this.awaitingResult) {
                throw Error("BUG: invariant violated");
            }
            const cursor = req.result;
            if (cursor) {
                this.awaitingResult = false;
                p.resolve();
                p = promiseUtils.openPromise();
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
exports.TransactionHandle = TransactionHandle;
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
            reject(exports.TransactionAbort);
        };
        const th = new TransactionHandle(tx);
        const resP = Promise.resolve().then(() => f(th));
        resP
            .then((result) => {
            gotFunResult = true;
            funResult = result;
        })
            .catch((e) => {
            if (e == exports.TransactionAbort) {
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
exports.Index = Index;
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
exports.openDatabase = openDatabase;
class Database {
    constructor(db) {
        this.db = db;
    }
    static deleteDatabase(idbFactory, dbName) {
        idbFactory.deleteDatabase(dbName);
    }
    exportDatabase() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const tx = this.db.transaction([store.name], "readonly");
            const req = tx.objectStore(store.name).get(key);
            const v = yield requestToPromise(req);
            yield transactionToPromise(tx);
            return v;
        });
    }
    getIndexed(index, key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const tx = this.db.transaction([index.storeName], "readonly");
            const req = tx.objectStore(index.storeName).index(index.indexName).get(key);
            const v = yield requestToPromise(req);
            yield transactionToPromise(tx);
            return v;
        });
    }
    put(store, value, key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const tx = this.db.transaction([store.name], "readwrite");
            const req = tx.objectStore(store.name).put(value, key);
            const v = yield requestToPromise(req);
            yield transactionToPromise(tx);
            return v;
        });
    }
    mutate(store, key, f) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return runWithTransaction(this.db, stores, f, "readonly");
        });
    }
    runWithWriteTransaction(stores, f) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return runWithTransaction(this.db, stores, f, "readwrite");
        });
    }
}
exports.Database = Database;

});

unwrapExports(query);
var query_1 = query.TransactionAbort;
var query_2 = query.Store;
var query_3 = query.TransactionHandle;
var query_4 = query.Index;
var query_5 = query.openDatabase;
var query_6 = query.Database;

var time = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

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
/**
 * Helpers for relative and absolute time.
 */
class Timestamp {
}
exports.Timestamp = Timestamp;
let timeshift = 0;
function setDangerousTimetravel(dt) {
    timeshift = dt;
}
exports.setDangerousTimetravel = setDangerousTimetravel;
function getTimestampNow() {
    return {
        t_ms: new Date().getTime() + timeshift,
    };
}
exports.getTimestampNow = getTimestampNow;
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
exports.getDurationRemaining = getDurationRemaining;
function timestampMin(t1, t2) {
    if (t1.t_ms === "never") {
        return { t_ms: t2.t_ms };
    }
    if (t2.t_ms === "never") {
        return { t_ms: t2.t_ms };
    }
    return { t_ms: Math.min(t1.t_ms, t2.t_ms) };
}
exports.timestampMin = timestampMin;
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
exports.timestampTruncateToSecond = timestampTruncateToSecond;
function durationMin(d1, d2) {
    if (d1.d_ms === "forever") {
        return { d_ms: d2.d_ms };
    }
    if (d2.d_ms === "forever") {
        return { d_ms: d2.d_ms };
    }
    return { d_ms: Math.min(d1.d_ms, d2.d_ms) };
}
exports.durationMin = durationMin;
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
exports.timestampCmp = timestampCmp;
function timestampAddDuration(t1, d) {
    if (t1.t_ms === "never" || d.d_ms === "forever") {
        return { t_ms: "never" };
    }
    return { t_ms: t1.t_ms + d.d_ms };
}
exports.timestampAddDuration = timestampAddDuration;
function timestampSubtractDuraction(t1, d) {
    if (t1.t_ms === "never") {
        return { t_ms: "never" };
    }
    if (d.d_ms === "forever") {
        return { t_ms: 0 };
    }
    return { t_ms: Math.max(0, t1.t_ms - d.d_ms) };
}
exports.timestampSubtractDuraction = timestampSubtractDuraction;
function stringifyTimestamp(t) {
    if (t.t_ms === "never") {
        return "never";
    }
    return new Date(t.t_ms).toISOString();
}
exports.stringifyTimestamp = stringifyTimestamp;
function timestampDifference(t1, t2) {
    if (t1.t_ms === "never") {
        return { d_ms: "forever" };
    }
    if (t2.t_ms === "never") {
        return { d_ms: "forever" };
    }
    return { d_ms: Math.abs(t1.t_ms - t2.t_ms) };
}
exports.timestampDifference = timestampDifference;
function timestampIsBetween(t, start, end) {
    if (timestampCmp(t, start) < 0) {
        return false;
    }
    if (timestampCmp(t, end) > 0) {
        return false;
    }
    return true;
}
exports.timestampIsBetween = timestampIsBetween;
exports.codecForTimestamp = {
    decode(x, c) {
        const t_ms = x.t_ms;
        if (typeof t_ms === "string") {
            if (t_ms === "never") {
                return { t_ms: "never" };
            }
            throw Error(`expected timestamp at ${codec.renderContext(c)}`);
        }
        if (typeof t_ms === "number") {
            return { t_ms };
        }
        throw Error(`expected timestamp at ${codec.renderContext(c)}`);
    },
};
exports.codecForDuration = {
    decode(x, c) {
        const d_ms = x.d_ms;
        if (typeof d_ms === "string") {
            if (d_ms === "forever") {
                return { d_ms: "forever" };
            }
            throw Error(`expected duration at ${codec.renderContext(c)}`);
        }
        if (typeof d_ms === "number") {
            return { d_ms };
        }
        throw Error(`expected duration at ${codec.renderContext(c)}`);
    },
};

});

unwrapExports(time);
var time_1 = time.Timestamp;
var time_2 = time.setDangerousTimetravel;
var time_3 = time.getTimestampNow;
var time_4 = time.getDurationRemaining;
var time_5 = time.timestampMin;
var time_6 = time.timestampTruncateToSecond;
var time_7 = time.durationMin;
var time_8 = time.timestampCmp;
var time_9 = time.timestampAddDuration;
var time_10 = time.timestampSubtractDuraction;
var time_11 = time.stringifyTimestamp;
var time_12 = time.timestampDifference;
var time_13 = time.timestampIsBetween;
var time_14 = time.codecForTimestamp;
var time_15 = time.codecForDuration;

var dbTypes = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });


var ReserveRecordStatus;
(function (ReserveRecordStatus) {
    /**
     * Waiting for manual confirmation.
     */
    ReserveRecordStatus["UNCONFIRMED"] = "unconfirmed";
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
})(ReserveRecordStatus = exports.ReserveRecordStatus || (exports.ReserveRecordStatus = {}));
const defaultRetryPolicy = {
    backoffBase: 1.5,
    backoffDelta: { d_ms: 200 },
};
function updateRetryInfoTimeout(r, p = defaultRetryPolicy) {
    const now = time.getTimestampNow();
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
exports.updateRetryInfoTimeout = updateRetryInfoTimeout;
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
        firstTry: time.getTimestampNow(),
        active: true,
        nextRetry: { t_ms: 0 },
        retryCounter: 0,
    };
    updateRetryInfoTimeout(info, p);
    return info;
}
exports.initRetryInfo = initRetryInfo;
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
})(DenominationStatus = exports.DenominationStatus || (exports.DenominationStatus = {}));
/**
 * Record to keep track of data imported into the wallet.
 */
class WalletImportRecord {
}
exports.WalletImportRecord = WalletImportRecord;
/* tslint:disable:completed-docs */
/**
 * The stores and indices for the wallet database.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
var Stores;
(function (Stores) {
    class ExchangesStore extends query.Store {
        constructor() {
            super("exchanges", { keyPath: "baseUrl" });
        }
    }
    class CoinsStore extends query.Store {
        constructor() {
            super("coins", { keyPath: "coinPub" });
            this.exchangeBaseUrlIndex = new query.Index(this, "exchangeBaseUrl", "exchangeBaseUrl");
            this.denomPubIndex = new query.Index(this, "denomPubIndex", "denomPub");
            this.denomPubHashIndex = new query.Index(this, "denomPubHashIndex", "denomPubHash");
        }
    }
    class ProposalsStore extends query.Store {
        constructor() {
            super("proposals", { keyPath: "proposalId" });
            this.urlAndOrderIdIndex = new query.Index(this, "urlIndex", [
                "merchantBaseUrl",
                "orderId",
            ]);
        }
    }
    class PurchasesStore extends query.Store {
        constructor() {
            super("purchases", { keyPath: "proposalId" });
            this.fulfillmentUrlIndex = new query.Index(this, "fulfillmentUrlIndex", "contractData.fulfillmentUrl");
            this.orderIdIndex = new query.Index(this, "orderIdIndex", [
                "contractData.merchantBaseUrl",
                "contractData.orderId",
            ]);
        }
    }
    class DenominationsStore extends query.Store {
        constructor() {
            // cast needed because of bug in type annotations
            super("denominations", {
                keyPath: ["exchangeBaseUrl", "denomPub"],
            });
            this.denomPubHashIndex = new query.Index(this, "denomPubHashIndex", "denomPubHash");
            this.exchangeBaseUrlIndex = new query.Index(this, "exchangeBaseUrlIndex", "exchangeBaseUrl");
            this.denomPubIndex = new query.Index(this, "denomPubIndex", "denomPub");
        }
    }
    class CurrenciesStore extends query.Store {
        constructor() {
            super("currencies", { keyPath: "name" });
        }
    }
    class ConfigStore extends query.Store {
        constructor() {
            super("config", { keyPath: "key" });
        }
    }
    class ReservesStore extends query.Store {
        constructor() {
            super("reserves", { keyPath: "reservePub" });
        }
    }
    class ReserveHistoryStore extends query.Store {
        constructor() {
            super("reserveHistory", { keyPath: "reservePub" });
        }
    }
    class TipsStore extends query.Store {
        constructor() {
            super("tips", { keyPath: "tipId" });
        }
    }
    class SenderWiresStore extends query.Store {
        constructor() {
            super("senderWires", { keyPath: "paytoUri" });
        }
    }
    class WithdrawalGroupsStore extends query.Store {
        constructor() {
            super("withdrawals", { keyPath: "withdrawalGroupId" });
        }
    }
    class PlanchetsStore extends query.Store {
        constructor() {
            super("planchets", { keyPath: "coinPub" });
            this.byGroupAndIndex = new query.Index(this, "withdrawalGroupAndCoinIdxIndex", ["withdrawalGroupId", "coinIdx"]);
            this.byGroup = new query.Index(this, "withdrawalGroupIndex", "withdrawalGroupId");
        }
    }
    class RefundEventsStore extends query.Store {
        constructor() {
            super("refundEvents", { keyPath: "refundGroupId" });
        }
    }
    class PayEventsStore extends query.Store {
        constructor() {
            super("payEvents", { keyPath: "proposalId" });
        }
    }
    class ExchangeUpdatedEventsStore extends query.Store {
        constructor() {
            super("exchangeUpdatedEvents", { keyPath: "exchangeBaseUrl" });
        }
    }
    class ReserveUpdatedEventsStore extends query.Store {
        constructor() {
            super("reserveUpdatedEvents", { keyPath: "reservePub" });
        }
    }
    class BankWithdrawUrisStore extends query.Store {
        constructor() {
            super("bankWithdrawUris", { keyPath: "talerWithdrawUri" });
        }
    }
    class WalletImportsStore extends query.Store {
        constructor() {
            super("walletImports", { keyPath: "walletImportId" });
        }
    }
    Stores.coins = new CoinsStore();
    Stores.coinsReturns = new query.Store("coinsReturns", {
        keyPath: "contractTermsHash",
    });
    Stores.config = new ConfigStore();
    Stores.currencies = new CurrenciesStore();
    Stores.denominations = new DenominationsStore();
    Stores.exchanges = new ExchangesStore();
    Stores.proposals = new ProposalsStore();
    Stores.refreshGroups = new query.Store("refreshGroups", {
        keyPath: "refreshGroupId",
    });
    Stores.recoupGroups = new query.Store("recoupGroups", {
        keyPath: "recoupGroupId",
    });
    Stores.reserves = new ReservesStore();
    Stores.reserveHistory = new ReserveHistoryStore();
    Stores.purchases = new PurchasesStore();
    Stores.tips = new TipsStore();
    Stores.senderWires = new SenderWiresStore();
    Stores.withdrawalGroups = new WithdrawalGroupsStore();
    Stores.planchets = new PlanchetsStore();
    Stores.bankWithdrawUris = new BankWithdrawUrisStore();
    Stores.refundEvents = new RefundEventsStore();
    Stores.payEvents = new PayEventsStore();
    Stores.reserveUpdatedEvents = new ReserveUpdatedEventsStore();
    Stores.exchangeUpdatedEvents = new ExchangeUpdatedEventsStore();
    Stores.walletImports = new WalletImportsStore();
})(Stores = exports.Stores || (exports.Stores = {}));
/* tslint:enable:completed-docs */

});

unwrapExports(dbTypes);
var dbTypes_1 = dbTypes.ReserveRecordStatus;
var dbTypes_2 = dbTypes.updateRetryInfoTimeout;
var dbTypes_3 = dbTypes.initRetryInfo;
var dbTypes_4 = dbTypes.DenominationStatus;
var dbTypes_5 = dbTypes.WalletImportRecord;
var dbTypes_6 = dbTypes.Stores;

var talerTypes = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Type and schema definitions and helpers for the core GNU Taler protocol.
 *
 * All types here should be "@Checkable".
 *
 * Even though the rest of the wallet uses camelCase for fields, use snake_case
 * here, since that's the convention for the Taler JSON+HTTP API.
 */
/**
 * Imports.
 */


/**
 * Denomination as found in the /keys response from the exchange.
 */
class Denomination {
}
exports.Denomination = Denomination;
/**
 * Signature by the auditor that a particular denomination key is audited.
 */
class AuditorDenomSig {
}
exports.AuditorDenomSig = AuditorDenomSig;
/**
 * Auditor information as given by the exchange in /keys.
 */
class Auditor {
}
exports.Auditor = Auditor;
/**
 * Response that we get from the exchange for a payback request.
 */
class RecoupConfirmation {
}
exports.RecoupConfirmation = RecoupConfirmation;
/**
 * Information about an exchange as stored inside a
 * merchant's contract terms.
 */
class ExchangeHandle {
}
exports.ExchangeHandle = ExchangeHandle;
class AuditorHandle {
}
exports.AuditorHandle = AuditorHandle;
/**
 * Contract terms from a merchant.
 */
class ContractTerms {
}
exports.ContractTerms = ContractTerms;
/**
 * Refund permission in the format that the merchant gives it to us.
 */
class MerchantRefundDetails {
}
exports.MerchantRefundDetails = MerchantRefundDetails;
/**
 * Response for a refund pickup or a /pay in abort mode.
 */
class MerchantRefundResponse {
}
exports.MerchantRefundResponse = MerchantRefundResponse;
/**
 * Reserve signature, defined as separate class to facilitate
 * schema validation with "@Checkable".
 */
class ReserveSigSingleton {
}
exports.ReserveSigSingleton = ReserveSigSingleton;
/**
 * Response of the merchant
 * to the TipPickupRequest.
 */
class TipResponse {
}
exports.TipResponse = TipResponse;
/**
 * Element of the payback list that the
 * exchange gives us in /keys.
 */
class Recoup {
}
exports.Recoup = Recoup;
/**
 * Structure of one exchange signing key in the /keys response.
 */
class ExchangeSignKeyJson {
}
exports.ExchangeSignKeyJson = ExchangeSignKeyJson;
/**
 * Structure that the exchange gives us in /keys.
 */
class ExchangeKeysJson {
}
exports.ExchangeKeysJson = ExchangeKeysJson;
/**
 * Wire fees as anounced by the exchange.
 */
class WireFeesJson {
}
exports.WireFeesJson = WireFeesJson;
class AccountInfo {
}
exports.AccountInfo = AccountInfo;
class ExchangeWireJson {
}
exports.ExchangeWireJson = ExchangeWireJson;
/**
 * Proposal returned from the contract URL.
 */
class Proposal {
}
exports.Proposal = Proposal;
/**
 * Response from the internal merchant API.
 */
class CheckPaymentResponse {
}
exports.CheckPaymentResponse = CheckPaymentResponse;
/**
 * Response from the bank.
 */
class WithdrawOperationStatusResponse {
}
exports.WithdrawOperationStatusResponse = WithdrawOperationStatusResponse;
/**
 * Response from the merchant.
 */
class TipPickupGetResponse {
}
exports.TipPickupGetResponse = TipPickupGetResponse;
class WithdrawResponse {
}
exports.WithdrawResponse = WithdrawResponse;
exports.codecForDenomination = () => codec.makeCodecForObject()
    .property("value", codec.codecForString)
    .property("denom_pub", codec.codecForString)
    .property("fee_withdraw", codec.codecForString)
    .property("fee_deposit", codec.codecForString)
    .property("fee_refresh", codec.codecForString)
    .property("fee_refund", codec.codecForString)
    .property("stamp_start", time.codecForTimestamp)
    .property("stamp_expire_withdraw", time.codecForTimestamp)
    .property("stamp_expire_legal", time.codecForTimestamp)
    .property("stamp_expire_deposit", time.codecForTimestamp)
    .property("master_sig", codec.codecForString)
    .build("Denomination");
exports.codecForAuditorDenomSig = () => codec.makeCodecForObject()
    .property("denom_pub_h", codec.codecForString)
    .property("auditor_sig", codec.codecForString)
    .build("AuditorDenomSig");
exports.codecForAuditor = () => codec.makeCodecForObject()
    .property("auditor_pub", codec.codecForString)
    .property("auditor_url", codec.codecForString)
    .property("denomination_keys", codec.makeCodecForList(exports.codecForAuditorDenomSig()))
    .build("Auditor");
exports.codecForExchangeHandle = () => codec.makeCodecForObject()
    .property("master_pub", codec.codecForString)
    .property("url", codec.codecForString)
    .build("ExchangeHandle");
exports.codecForAuditorHandle = () => codec.makeCodecForObject()
    .property("name", codec.codecForString)
    .property("master_pub", codec.codecForString)
    .property("url", codec.codecForString)
    .build("AuditorHandle");
exports.codecForContractTerms = () => codec.makeCodecForObject()
    .property("order_id", codec.codecForString)
    .property("fulfillment_url", codec.codecForString)
    .property("merchant_base_url", codec.codecForString)
    .property("h_wire", codec.codecForString)
    .property("auto_refund", codec.makeCodecOptional(time.codecForDuration))
    .property("wire_method", codec.codecForString)
    .property("summary", codec.codecForString)
    .property("nonce", codec.codecForString)
    .property("amount", codec.codecForString)
    .property("auditors", codec.makeCodecForList(exports.codecForAuditorHandle()))
    .property("pay_deadline", time.codecForTimestamp)
    .property("refund_deadline", time.codecForTimestamp)
    .property("wire_transfer_deadline", time.codecForTimestamp)
    .property("timestamp", time.codecForTimestamp)
    .property("locations", codec.codecForAny)
    .property("max_fee", codec.codecForString)
    .property("max_wire_fee", codec.makeCodecOptional(codec.codecForString))
    .property("merchant", codec.codecForAny)
    .property("merchant_pub", codec.codecForString)
    .property("exchanges", codec.makeCodecForList(exports.codecForExchangeHandle()))
    .property("products", codec.makeCodecOptional(codec.makeCodecForList(codec.codecForAny)))
    .property("extra", codec.codecForAny)
    .build("ContractTerms");
exports.codecForMerchantRefundPermission = () => codec.makeCodecForObject()
    .property("refund_amount", codec.codecForString)
    .property("refund_fee", codec.codecForString)
    .property("coin_pub", codec.codecForString)
    .property("rtransaction_id", codec.codecForNumber)
    .property("exchange_http_status", codec.codecForNumber)
    .property("exchange_code", codec.makeCodecOptional(codec.codecForNumber))
    .property("exchange_reply", codec.makeCodecOptional(codec.codecForAny))
    .property("exchange_sig", codec.makeCodecOptional(codec.codecForString))
    .property("exchange_pub", codec.makeCodecOptional(codec.codecForString))
    .build("MerchantRefundPermission");
exports.codecForMerchantRefundResponse = () => codec.makeCodecForObject()
    .property("merchant_pub", codec.codecForString)
    .property("h_contract_terms", codec.codecForString)
    .property("refunds", codec.makeCodecForList(exports.codecForMerchantRefundPermission()))
    .build("MerchantRefundResponse");
exports.codecForReserveSigSingleton = () => codec.makeCodecForObject()
    .property("reserve_sig", codec.codecForString)
    .build("ReserveSigSingleton");
exports.codecForTipResponse = () => codec.makeCodecForObject()
    .property("reserve_pub", codec.codecForString)
    .property("reserve_sigs", codec.makeCodecForList(exports.codecForReserveSigSingleton()))
    .build("TipResponse");
exports.codecForRecoup = () => codec.makeCodecForObject()
    .property("h_denom_pub", codec.codecForString)
    .build("Recoup");
exports.codecForExchangeSigningKey = () => codec.makeCodecForObject()
    .property("key", codec.codecForString)
    .property("master_sig", codec.codecForString)
    .property("stamp_end", time.codecForTimestamp)
    .property("stamp_start", time.codecForTimestamp)
    .property("stamp_expire", time.codecForTimestamp)
    .build("ExchangeSignKeyJson");
exports.codecForExchangeKeysJson = () => codec.makeCodecForObject()
    .property("denoms", codec.makeCodecForList(exports.codecForDenomination()))
    .property("master_public_key", codec.codecForString)
    .property("auditors", codec.makeCodecForList(exports.codecForAuditor()))
    .property("list_issue_date", time.codecForTimestamp)
    .property("recoup", codec.makeCodecOptional(codec.makeCodecForList(exports.codecForRecoup())))
    .property("signkeys", codec.makeCodecForList(exports.codecForExchangeSigningKey()))
    .property("version", codec.codecForString)
    .build("KeysJson");
exports.codecForWireFeesJson = () => codec.makeCodecForObject()
    .property("wire_fee", codec.codecForString)
    .property("closing_fee", codec.codecForString)
    .property("sig", codec.codecForString)
    .property("start_date", time.codecForTimestamp)
    .property("end_date", time.codecForTimestamp)
    .build("WireFeesJson");
exports.codecForAccountInfo = () => codec.makeCodecForObject()
    .property("payto_uri", codec.codecForString)
    .property("master_sig", codec.codecForString)
    .build("AccountInfo");
exports.codecForExchangeWireJson = () => codec.makeCodecForObject()
    .property("accounts", codec.makeCodecForList(exports.codecForAccountInfo()))
    .property("fees", codec.makeCodecForMap(codec.makeCodecForList(exports.codecForWireFeesJson())))
    .build("ExchangeWireJson");
exports.codecForProposal = () => codec.makeCodecForObject()
    .property("contract_terms", codec.codecForAny)
    .property("sig", codec.codecForString)
    .build("Proposal");
exports.codecForCheckPaymentResponse = () => codec.makeCodecForObject()
    .property("paid", codec.codecForBoolean)
    .property("refunded", codec.makeCodecOptional(codec.codecForBoolean))
    .property("refunded_amount", codec.makeCodecOptional(codec.codecForString))
    .property("contract_terms", codec.makeCodecOptional(codec.codecForAny))
    .property("taler_pay_uri", codec.makeCodecOptional(codec.codecForString))
    .property("contract_url", codec.makeCodecOptional(codec.codecForString))
    .build("CheckPaymentResponse");
exports.codecForWithdrawOperationStatusResponse = () => codec.makeCodecForObject()
    .property("selection_done", codec.codecForBoolean)
    .property("transfer_done", codec.codecForBoolean)
    .property("amount", codec.codecForString)
    .property("sender_wire", codec.makeCodecOptional(codec.codecForString))
    .property("suggested_exchange", codec.makeCodecOptional(codec.codecForString))
    .property("confirm_transfer_url", codec.makeCodecOptional(codec.codecForString))
    .property("wire_types", codec.makeCodecForList(codec.codecForString))
    .build("WithdrawOperationStatusResponse");
exports.codecForTipPickupGetResponse = () => codec.makeCodecForObject()
    .property("extra", codec.codecForAny)
    .property("amount", codec.codecForString)
    .property("amount_left", codec.codecForString)
    .property("exchange_url", codec.codecForString)
    .property("stamp_expire", time.codecForTimestamp)
    .property("stamp_created", time.codecForTimestamp)
    .build("TipPickupGetResponse");
exports.codecForRecoupConfirmation = () => codec.makeCodecForObject()
    .property("reserve_pub", codec.makeCodecOptional(codec.codecForString))
    .property("old_coin_pub", codec.makeCodecOptional(codec.codecForString))
    .build("RecoupConfirmation");
exports.codecForWithdrawResponse = () => codec.makeCodecForObject()
    .property("ev_sig", codec.codecForString)
    .build("WithdrawResponse");

});

unwrapExports(talerTypes);
var talerTypes_1 = talerTypes.Denomination;
var talerTypes_2 = talerTypes.AuditorDenomSig;
var talerTypes_3 = talerTypes.Auditor;
var talerTypes_4 = talerTypes.RecoupConfirmation;
var talerTypes_5 = talerTypes.ExchangeHandle;
var talerTypes_6 = talerTypes.AuditorHandle;
var talerTypes_7 = talerTypes.ContractTerms;
var talerTypes_8 = talerTypes.MerchantRefundDetails;
var talerTypes_9 = talerTypes.MerchantRefundResponse;
var talerTypes_10 = talerTypes.ReserveSigSingleton;
var talerTypes_11 = talerTypes.TipResponse;
var talerTypes_12 = talerTypes.Recoup;
var talerTypes_13 = talerTypes.ExchangeSignKeyJson;
var talerTypes_14 = talerTypes.ExchangeKeysJson;
var talerTypes_15 = talerTypes.WireFeesJson;
var talerTypes_16 = talerTypes.AccountInfo;
var talerTypes_17 = talerTypes.ExchangeWireJson;
var talerTypes_18 = talerTypes.Proposal;
var talerTypes_19 = talerTypes.CheckPaymentResponse;
var talerTypes_20 = talerTypes.WithdrawOperationStatusResponse;
var talerTypes_21 = talerTypes.TipPickupGetResponse;
var talerTypes_22 = talerTypes.WithdrawResponse;
var talerTypes_23 = talerTypes.codecForDenomination;
var talerTypes_24 = talerTypes.codecForAuditorDenomSig;
var talerTypes_25 = talerTypes.codecForAuditor;
var talerTypes_26 = talerTypes.codecForExchangeHandle;
var talerTypes_27 = talerTypes.codecForAuditorHandle;
var talerTypes_28 = talerTypes.codecForContractTerms;
var talerTypes_29 = talerTypes.codecForMerchantRefundPermission;
var talerTypes_30 = talerTypes.codecForMerchantRefundResponse;
var talerTypes_31 = talerTypes.codecForReserveSigSingleton;
var talerTypes_32 = talerTypes.codecForTipResponse;
var talerTypes_33 = talerTypes.codecForRecoup;
var talerTypes_34 = talerTypes.codecForExchangeSigningKey;
var talerTypes_35 = talerTypes.codecForExchangeKeysJson;
var talerTypes_36 = talerTypes.codecForWireFeesJson;
var talerTypes_37 = talerTypes.codecForAccountInfo;
var talerTypes_38 = talerTypes.codecForExchangeWireJson;
var talerTypes_39 = talerTypes.codecForProposal;
var talerTypes_40 = talerTypes.codecForCheckPaymentResponse;
var talerTypes_41 = talerTypes.codecForWithdrawOperationStatusResponse;
var talerTypes_42 = talerTypes.codecForTipPickupGetResponse;
var talerTypes_43 = talerTypes.codecForRecoupConfirmation;
var talerTypes_44 = talerTypes.codecForWithdrawResponse;

var taleruri = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
function parseWithdrawUri(s) {
    const pfx = "taler://withdraw/";
    if (!s.toLowerCase().startsWith(pfx)) {
        return undefined;
    }
    const rest = s.substring(pfx.length);
    let [host, path, withdrawId] = rest.split("/");
    if (!host) {
        return undefined;
    }
    host = host.toLowerCase();
    if (!path) {
        return undefined;
    }
    if (!withdrawId) {
        return undefined;
    }
    if (path === "-") {
        path = "api/withdraw-operation";
    }
    return {
        statusUrl: `https://${host}/${path}/${withdrawId}`,
    };
}
exports.parseWithdrawUri = parseWithdrawUri;
function classifyTalerUri(s) {
    const sl = s.toLowerCase();
    if (sl.startsWith("taler://pay/")) {
        return "taler-pay" /* TalerPay */;
    }
    if (sl.startsWith("taler://tip/")) {
        return "taler-tip" /* TalerTip */;
    }
    if (sl.startsWith("taler://refund/")) {
        return "taler-refund" /* TalerRefund */;
    }
    if (sl.startsWith("taler://withdraw/")) {
        return "taler-withdraw" /* TalerWithdraw */;
    }
    if (sl.startsWith("taler://notify-reserve/")) {
        return "taler-notify-reserve" /* TalerNotifyReserve */;
    }
    return "unknown" /* Unknown */;
}
exports.classifyTalerUri = classifyTalerUri;
function getOrderDownloadUrl(merchantBaseUrl, orderId) {
    const u = new URL("proposal", merchantBaseUrl);
    u.searchParams.set("order_id", orderId);
    return u.href;
}
exports.getOrderDownloadUrl = getOrderDownloadUrl;
function parsePayUri(s) {
    const pfx = "taler://pay/";
    if (!s.toLowerCase().startsWith(pfx)) {
        return undefined;
    }
    const [path, search] = s.slice(pfx.length).split("?");
    let [host, maybePath, maybeInstance, orderId, maybeSessionid] = path.split("/");
    if (!host) {
        return undefined;
    }
    host = host.toLowerCase();
    if (!maybePath) {
        return undefined;
    }
    if (!orderId) {
        return undefined;
    }
    if (maybePath === "-") {
        maybePath = "public/";
    }
    else {
        maybePath = decodeURIComponent(maybePath) + "/";
    }
    let maybeInstancePath = "";
    if (maybeInstance !== "-") {
        maybeInstancePath = `instances/${maybeInstance}/`;
    }
    let protocol = "https";
    const searchParams = new URLSearchParams(search);
    if (searchParams.get("insecure") === "1") {
        protocol = "http";
    }
    const merchantBaseUrl = `${protocol}://${host}/` +
        decodeURIComponent(maybePath) +
        maybeInstancePath;
    return {
        merchantBaseUrl,
        orderId,
        sessionId: maybeSessionid,
    };
}
exports.parsePayUri = parsePayUri;
function parseTipUri(s) {
    const pfx = "taler://tip/";
    if (!s.toLowerCase().startsWith(pfx)) {
        return undefined;
    }
    const path = s.slice(pfx.length);
    let [host, maybePath, maybeInstance, tipId] = path.split("/");
    if (!host) {
        return undefined;
    }
    host = host.toLowerCase();
    if (!maybePath) {
        return undefined;
    }
    if (!tipId) {
        return undefined;
    }
    if (maybePath === "-") {
        maybePath = "public/";
    }
    else {
        maybePath = decodeURIComponent(maybePath) + "/";
    }
    let maybeInstancePath = "";
    if (maybeInstance !== "-") {
        maybeInstancePath = `instances/${maybeInstance}/`;
    }
    const merchantBaseUrl = `https://${host}/${maybePath}${maybeInstancePath}`;
    return {
        merchantTipId: tipId,
        merchantOrigin: new URL(merchantBaseUrl).origin,
        merchantBaseUrl,
    };
}
exports.parseTipUri = parseTipUri;
function parseRefundUri(s) {
    const pfx = "taler://refund/";
    if (!s.toLowerCase().startsWith(pfx)) {
        return undefined;
    }
    const [path, search] = s.slice(pfx.length).split("?");
    let [host, maybePath, maybeInstance, orderId] = path.split("/");
    if (!host) {
        return undefined;
    }
    host = host.toLowerCase();
    if (!maybePath) {
        return undefined;
    }
    if (!orderId) {
        return undefined;
    }
    if (maybePath === "-") {
        maybePath = "public/";
    }
    else {
        maybePath = decodeURIComponent(maybePath) + "/";
    }
    let maybeInstancePath = "";
    if (maybeInstance !== "-") {
        maybeInstancePath = `instances/${maybeInstance}/`;
    }
    let protocol = "https";
    const searchParams = new URLSearchParams(search);
    if (searchParams.get("insecure") === "1") {
        protocol = "http";
    }
    const merchantBaseUrl = `${protocol}://${host}/` + maybePath + maybeInstancePath;
    return {
        merchantBaseUrl,
        orderId,
    };
}
exports.parseRefundUri = parseRefundUri;

});

unwrapExports(taleruri);
var taleruri_1 = taleruri.parseWithdrawUri;
var taleruri_2 = taleruri.classifyTalerUri;
var taleruri_3 = taleruri.getOrderDownloadUrl;
var taleruri_4 = taleruri.parsePayUri;
var taleruri_5 = taleruri.parseTipUri;
var taleruri_6 = taleruri.parseRefundUri;

var compat = createCommonjsModule(function (module, exports) {
/*
 This file is part of TALER
 (C) 2017 INRIA

 TALER is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 TALER is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 TALER; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compatibility helpers needed for browsers that don't implement
 * WebExtension APIs consistently.
 */
function isFirefox() {
    const rt = chrome.runtime;
    if (typeof rt.getBrowserInfo === "function") {
        return true;
    }
    return false;
}
exports.isFirefox = isFirefox;
/**
 * Check if we are running under nodejs.
 */
function isNode() {
    return typeof process !== "undefined" && process.release.name === "node";
}
exports.isNode = isNode;

});

unwrapExports(compat);
var compat_1 = compat.isFirefox;
var compat_2 = compat.isNode;

var logging = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Imports.
 */

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
        if (compat.isNode()) {
            writeNodeLog(message, this.tag, "INFO", args);
        }
        else {
            console.info(`${new Date().toISOString()} ${this.tag} INFO ` + message, ...args);
        }
    }
    warn(message, ...args) {
        if (compat.isNode()) {
            writeNodeLog(message, this.tag, "WARN", args);
        }
        else {
            console.warn(`${new Date().toISOString()} ${this.tag} INFO ` + message, ...args);
        }
    }
    error(message, ...args) {
        if (compat.isNode()) {
            writeNodeLog(message, this.tag, "ERROR", args);
        }
        else {
            console.info(`${new Date().toISOString()} ${this.tag} ERROR ` + message, ...args);
        }
    }
    trace(message, ...args) {
        if (compat.isNode()) {
            writeNodeLog(message, this.tag, "TRACE", args);
        }
        else {
            console.info(`${new Date().toISOString()} ${this.tag} TRACE ` + message, ...args);
        }
    }
}
exports.Logger = Logger;

});

unwrapExports(logging);
var logging_1 = logging.Logger;

var helpers = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

const Amounts = tslib_1.__importStar(amounts);
/**
 * Show an amount in a form suitable for the user.
 * FIXME:  In the future, this should consider currency-specific
 * settings such as significant digits or currency symbols.
 */
function amountToPretty(amount) {
    const x = amount.value + amount.fraction / Amounts.fractionalBase;
    return `${x} ${amount.currency}`;
}
exports.amountToPretty = amountToPretty;
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
exports.canonicalizeBaseUrl = canonicalizeBaseUrl;
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
exports.canonicalJson = canonicalJson;
/**
 * Check for deep equality of two objects.
 * Only arrays, objects and primitives are supported.
 */
function deepEquals(x, y) {
    if (x === y) {
        return true;
    }
    if (Array.isArray(x) && x.length !== y.length) {
        return false;
    }
    const p = Object.keys(x);
    return (Object.keys(y).every((i) => p.indexOf(i) !== -1) &&
        p.every((i) => deepEquals(x[i], y[i])));
}
exports.deepEquals = deepEquals;
function deepCopy(x) {
    // FIXME: this has many issues ...
    return JSON.parse(JSON.stringify(x));
}
exports.deepCopy = deepCopy;
/**
 * Map from a collection to a list or results and then
 * concatenate the results.
 */
function flatMap(xs, f) {
    return xs.reduce((acc, next) => [...f(next), ...acc], []);
}
exports.flatMap = flatMap;
/**
 * Compute the hash function of a JSON object.
 */
function hash(val) {
    const str = canonicalJson(val);
    // https://github.com/darkskyapp/string-hash
    let h = 5381;
    let i = str.length;
    while (i) {
        h = (h * 33) ^ str.charCodeAt(--i);
    }
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return h >>> 0;
}
exports.hash = hash;
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
exports.strcmp = strcmp;

});

unwrapExports(helpers);
var helpers_1 = helpers.amountToPretty;
var helpers_2 = helpers.canonicalizeBaseUrl;
var helpers_3 = helpers.canonicalJson;
var helpers_4 = helpers.deepEquals;
var helpers_5 = helpers.deepCopy;
var helpers_6 = helpers.flatMap;
var helpers_7 = helpers.hash;
var helpers_8 = helpers.strcmp;

var payto = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
function parsePaytoUri(s) {
    const pfx = "payto://";
    if (!s.startsWith(pfx)) {
        return undefined;
    }
    const [acct, search] = s.slice(pfx.length).split("?");
    const firstSlashPos = acct.indexOf("/");
    if (firstSlashPos === -1) {
        return undefined;
    }
    const targetType = acct.slice(0, firstSlashPos);
    const targetPath = acct.slice(firstSlashPos + 1);
    const params = {};
    const searchParams = new URLSearchParams(search || "");
    searchParams.forEach((v, k) => {
        params[v] = k;
    });
    return {
        targetPath,
        targetType,
        params,
    };
}
exports.parsePaytoUri = parsePaytoUri;

});

unwrapExports(payto);
var payto_1 = payto.parsePaytoUri;

var errors = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

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
exports.OperationFailedAndReportedError = OperationFailedAndReportedError;
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
}
exports.OperationFailedError = OperationFailedError;
/**
 * Process an HTTP response that we expect to contain Taler-specific JSON.
 *
 * Depending on the status code, we throw an exception.  This function
 * will try to extract Taler-specific error information from the HTTP response
 * if possible.
 */
function scrutinizeTalerJsonResponse(resp, codec) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // FIXME: We should distinguish between different types of error status
        // to react differently (throttle, report permanent failure)
        // FIXME: Make sure that when we receive an error message,
        // it looks like a Taler error message
        if (resp.status !== 200) {
            let exc = undefined;
            try {
                const errorJson = yield resp.json();
                const m = `received error response (status ${resp.status})`;
                exc = new OperationFailedError({
                    type: "protocol",
                    message: m,
                    details: {
                        httpStatusCode: resp.status,
                        errorResponse: errorJson,
                    },
                });
            }
            catch (e) {
                const m = "could not parse response JSON";
                exc = new OperationFailedError({
                    type: "network",
                    message: m,
                    details: {
                        status: resp.status,
                    },
                });
            }
            throw exc;
        }
        let json;
        try {
            json = yield resp.json();
        }
        catch (e) {
            const m = "could not parse response JSON";
            throw new OperationFailedError({
                type: "network",
                message: m,
                details: {
                    status: resp.status,
                },
            });
        }
        return codec.decode(json);
    });
}
exports.scrutinizeTalerJsonResponse = scrutinizeTalerJsonResponse;
/**
 * Run an operation and call the onOpError callback
 * when there was an exception or operation error that must be reported.
 * The cause will be re-thrown to the caller.
 */
function guardOperationException(op, onOpError) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            return yield op();
        }
        catch (e) {
            console.log("guard: caught exception");
            if (e instanceof OperationFailedAndReportedError) {
                throw e;
            }
            if (e instanceof OperationFailedError) {
                yield onOpError(e.operationError);
                throw new OperationFailedAndReportedError(e.operationError);
            }
            if (e instanceof Error) {
                console.log("guard: caught Error");
                const opErr = {
                    type: "exception",
                    message: e.message,
                    details: {},
                };
                yield onOpError(opErr);
                throw new OperationFailedAndReportedError(opErr);
            }
            console.log("guard: caught something else");
            const opErr = {
                type: "exception",
                message: "unexpected exception thrown",
                details: {
                    value: e.toString(),
                },
            };
            yield onOpError(opErr);
            throw new OperationFailedAndReportedError(opErr);
        }
    });
}
exports.guardOperationException = guardOperationException;

});

unwrapExports(errors);
var errors_1 = errors.OperationFailedAndReportedError;
var errors_2 = errors.OperationFailedError;
var errors_3 = errors.scrutinizeTalerJsonResponse;
var errors_4 = errors.guardOperationException;

var versions = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Protocol version spoken with the exchange.
 *
 * Uses libtool's current:revision:age versioning.
 */
exports.WALLET_EXCHANGE_PROTOCOL_VERSION = "7:0:0";
/**
 * Protocol version spoken with the merchant.
 *
 * Uses libtool's current:revision:age versioning.
 */
exports.WALLET_MERCHANT_PROTOCOL_VERSION = "0:0:0";
/**
 * Cache breaker that is appended to queries such as /keys and /wire
 * to break through caching, if it has been accidentally/badly configured
 * by the exchange.
 *
 * This is only a temporary measure.
 */
exports.WALLET_CACHE_BREAKER_CLIENT_VERSION = "3";

});

unwrapExports(versions);
var versions_1 = versions.WALLET_EXCHANGE_PROTOCOL_VERSION;
var versions_2 = versions.WALLET_MERCHANT_PROTOCOL_VERSION;
var versions_3 = versions.WALLET_CACHE_BREAKER_CLIENT_VERSION;

var libtoolVersion = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.compare = compare;
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

});

unwrapExports(libtoolVersion);
var libtoolVersion_1 = libtoolVersion.compare;

var assertUnreachable_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
function assertUnreachable(x) {
    throw new Error("Didn't expect to get here");
}
exports.assertUnreachable = assertUnreachable;

});

unwrapExports(assertUnreachable_1);
var assertUnreachable_2 = assertUnreachable_1.assertUnreachable;

var naclFast = createCommonjsModule(function (module, exports) {
// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
// TypeScript port in 2019 by Florian Dold.
// Public domain.
//
// Implementation derived from TweetNaCl version 20140427.
// See for details: http://tweetnacl.cr.yp.to/
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.HashState = HashState;
function add(p, q) {
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
        add(q, p);
        add(p, p);
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
    add(p, q);
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
exports.randomBytes = randomBytes;
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
exports.scalarMult = scalarMult;
function scalarMult_base(n) {
    checkArrayTypes(n);
    if (n.length !== crypto_scalarmult_SCALARBYTES)
        throw new Error("bad n size");
    const q = new Uint8Array(crypto_scalarmult_BYTES);
    crypto_scalarmult_base(q, n);
    return q;
}
exports.scalarMult_base = scalarMult_base;
exports.scalarMult_scalarLength = crypto_scalarmult_SCALARBYTES;
exports.scalarMult_groupElementLength = crypto_scalarmult_BYTES;
function sign(msg, secretKey) {
    checkArrayTypes(msg, secretKey);
    if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
        throw new Error("bad secret key size");
    const signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
    crypto_sign(signedMsg, msg, msg.length, secretKey);
    return signedMsg;
}
exports.sign = sign;
function sign_open(signedMsg, publicKey) {
    checkArrayTypes(signedMsg, publicKey);
    if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
        throw new Error("bad public key size");
    const tmp = new Uint8Array(signedMsg.length);
    const mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
    if (mlen < 0)
        return null;
    const m = new Uint8Array(mlen);
    for (let i = 0; i < m.length; i++)
        m[i] = tmp[i];
    return m;
}
exports.sign_open = sign_open;
function sign_detached(msg, secretKey) {
    const signedMsg = sign(msg, secretKey);
    const sig = new Uint8Array(crypto_sign_BYTES);
    for (let i = 0; i < sig.length; i++)
        sig[i] = signedMsg[i];
    return sig;
}
exports.sign_detached = sign_detached;
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
exports.sign_detached_verify = sign_detached_verify;
function sign_keyPair() {
    const pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
    const sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
    crypto_sign_keypair(pk, sk, false);
    return { publicKey: pk, secretKey: sk };
}
exports.sign_keyPair = sign_keyPair;
function x25519_edwards_keyPair_fromSecretKey(secretKey) {
    const p = [gf(), gf(), gf(), gf()];
    const pk = new Uint8Array(32);
    const d = new Uint8Array(64);
    if (secretKey.length != 32) {
        throw new Error("bad secret key size");
    }
    d.set(secretKey, 0);
    //crypto_hash(d, secretKey, 32);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    scalarbase(p, d);
    pack(pk, p);
    return pk;
}
exports.x25519_edwards_keyPair_fromSecretKey = x25519_edwards_keyPair_fromSecretKey;
function sign_keyPair_fromSecretKey(secretKey) {
    checkArrayTypes(secretKey);
    if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
        throw new Error("bad secret key size");
    const pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
    for (let i = 0; i < pk.length; i++)
        pk[i] = secretKey[32 + i];
    return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
}
exports.sign_keyPair_fromSecretKey = sign_keyPair_fromSecretKey;
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
exports.sign_keyPair_fromSeed = sign_keyPair_fromSeed;
exports.sign_publicKeyLength = crypto_sign_PUBLICKEYBYTES;
exports.sign_secretKeyLength = crypto_sign_SECRETKEYBYTES;
exports.sign_seedLength = crypto_sign_SEEDBYTES;
exports.sign_signatureLength = crypto_sign_BYTES;
function hash(msg) {
    checkArrayTypes(msg);
    const h = new Uint8Array(crypto_hash_BYTES);
    crypto_hash(h, msg, msg.length);
    return h;
}
exports.hash = hash;
exports.hash_hashLength = crypto_hash_BYTES;
function verify(x, y) {
    checkArrayTypes(x, y);
    // Zero length arguments are considered not equal.
    if (x.length === 0 || y.length === 0)
        return false;
    if (x.length !== y.length)
        return false;
    return vn(x, 0, y, 0, x.length) === 0 ? true : false;
}
exports.verify = verify;
function setPRNG(fn) {
    randombytes = fn;
}
exports.setPRNG = setPRNG;
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
exports.sign_ed25519_pk_to_curve25519 = sign_ed25519_pk_to_curve25519;
(function () {
    // Initialize PRNG if environment provides CSPRNG.
    // If not, methods calling randombytes will throw.
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
        const cr = crypto;
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

});

unwrapExports(naclFast);
var naclFast_1 = naclFast.HashState;
var naclFast_2 = naclFast.randomBytes;
var naclFast_3 = naclFast.scalarMult;
var naclFast_4 = naclFast.scalarMult_base;
var naclFast_5 = naclFast.scalarMult_scalarLength;
var naclFast_6 = naclFast.scalarMult_groupElementLength;
var naclFast_7 = naclFast.sign;
var naclFast_8 = naclFast.sign_open;
var naclFast_9 = naclFast.sign_detached;
var naclFast_10 = naclFast.sign_detached_verify;
var naclFast_11 = naclFast.sign_keyPair;
var naclFast_12 = naclFast.x25519_edwards_keyPair_fromSecretKey;
var naclFast_13 = naclFast.sign_keyPair_fromSecretKey;
var naclFast_14 = naclFast.sign_keyPair_fromSeed;
var naclFast_15 = naclFast.sign_publicKeyLength;
var naclFast_16 = naclFast.sign_secretKeyLength;
var naclFast_17 = naclFast.sign_seedLength;
var naclFast_18 = naclFast.sign_signatureLength;
var naclFast_19 = naclFast.hash;
var naclFast_20 = naclFast.hash_hashLength;
var naclFast_21 = naclFast.verify;
var naclFast_22 = naclFast.setPRNG;
var naclFast_23 = naclFast.sign_ed25519_pk_to_curve25519;

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

var sha256_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.digestLength = 32;
exports.blockSize = 64;
// SHA-256 constants
const K = new Uint32Array([
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
                    ((h + ((K[i] + w[i]) | 0)) | 0)) |
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
        this.digestLength = exports.digestLength;
        this.blockSize = exports.blockSize;
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
exports.HashSha256 = HashSha256;
// HMAC implements HMAC-SHA256 message authentication algorithm.
class HMAC {
    constructor(key) {
        this.inner = new HashSha256();
        this.outer = new HashSha256();
        this.blockSize = this.inner.blockSize;
        this.digestLength = this.inner.digestLength;
        const pad = new Uint8Array(this.blockSize);
        if (key.length > this.blockSize) {
            new HashSha256().update(key).finish(pad).clean();
        }
        else {
            for (let i = 0; i < key.length; i++) {
                pad[i] = key[i];
            }
        }
        for (let i = 0; i < pad.length; i++) {
            pad[i] ^= 0x36;
        }
        this.inner.update(pad);
        for (let i = 0; i < pad.length; i++) {
            pad[i] ^= 0x36 ^ 0x5c;
        }
        this.outer.update(pad);
        this.istate = new Uint32Array(8);
        this.ostate = new Uint32Array(8);
        this.inner._saveState(this.istate);
        this.outer._saveState(this.ostate);
        for (let i = 0; i < pad.length; i++) {
            pad[i] = 0;
        }
    }
    // Returns HMAC state to the state initialized with key
    // to make it possible to run HMAC over the other data with the same
    // key without creating a new instance.
    reset() {
        this.inner._restoreState(this.istate, this.inner.blockSize);
        this.outer._restoreState(this.ostate, this.outer.blockSize);
        return this;
    }
    // Cleans HMAC state.
    clean() {
        for (let i = 0; i < this.istate.length; i++) {
            this.ostate[i] = this.istate[i] = 0;
        }
        this.inner.clean();
        this.outer.clean();
    }
    // Updates state with provided data.
    update(data) {
        this.inner.update(data);
        return this;
    }
    // Finalizes HMAC and puts the result in out.
    finish(out) {
        if (this.outer.finished) {
            this.outer.finish(out);
        }
        else {
            this.inner.finish(out);
            this.outer.update(out, this.digestLength).finish(out);
        }
        return this;
    }
    // Returns message authentication code.
    digest() {
        const out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
    }
}
exports.HMAC = HMAC;
// Returns SHA256 hash of data.
function sha256(data) {
    const h = new HashSha256().update(data);
    const digest = h.digest();
    h.clean();
    return digest;
}
exports.sha256 = sha256;
// Returns HMAC-SHA256 of data under the key.
function hmacSha256(key, data) {
    const h = new HMAC(key).update(data);
    const digest = h.digest();
    h.clean();
    return digest;
}
exports.hmacSha256 = hmacSha256;

});

unwrapExports(sha256_1);
var sha256_2 = sha256_1.digestLength;
var sha256_3 = sha256_1.blockSize;
var sha256_4 = sha256_1.HashSha256;
var sha256_5 = sha256_1.HMAC;
var sha256_6 = sha256_1.sha256;
var sha256_7 = sha256_1.hmacSha256;

var kdf_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

const nacl = tslib_1.__importStar(naclFast);

function sha512(data) {
    return nacl.hash(data);
}
exports.sha512 = sha512;
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
exports.hmac = hmac;
function hmacSha512(key, message) {
    return hmac(sha512, 128, key, message);
}
exports.hmacSha512 = hmacSha512;
function hmacSha256(key, message) {
    return hmac(sha256_1.sha256, 64, key, message);
}
exports.hmacSha256 = hmacSha256;
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
exports.kdf = kdf;

});

unwrapExports(kdf_1);
var kdf_2 = kdf_1.sha512;
var kdf_3 = kdf_1.hmac;
var kdf_4 = kdf_1.hmacSha512;
var kdf_5 = kdf_1.hmacSha256;
var kdf_6 = kdf_1.kdf;

var talerCrypto = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Native implementation of GNU Taler crypto.
 */
const nacl = tslib_1.__importStar(naclFast);
const big_integer_1 = tslib_1.__importDefault(BigInteger);

function getRandomBytes(n) {
    return nacl.randomBytes(n);
}
exports.getRandomBytes = getRandomBytes;
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
exports.encodeCrock = encodeCrock;
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
exports.decodeCrock = decodeCrock;
function eddsaGetPublic(eddsaPriv) {
    const pair = nacl.sign_keyPair_fromSeed(eddsaPriv);
    return pair.publicKey;
}
exports.eddsaGetPublic = eddsaGetPublic;
function ecdheGetPublic(ecdhePriv) {
    return nacl.scalarMult_base(ecdhePriv);
}
exports.ecdheGetPublic = ecdheGetPublic;
function keyExchangeEddsaEcdhe(eddsaPriv, ecdhePub) {
    const ph = nacl.hash(eddsaPriv);
    const a = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        a[i] = ph[i];
    }
    const x = nacl.scalarMult(a, ecdhePub);
    return nacl.hash(x);
}
exports.keyExchangeEddsaEcdhe = keyExchangeEddsaEcdhe;
function keyExchangeEcdheEddsa(ecdhePriv, eddsaPub) {
    const curve25519Pub = nacl.sign_ed25519_pk_to_curve25519(eddsaPub);
    const x = nacl.scalarMult(ecdhePriv, curve25519Pub);
    return nacl.hash(x);
}
exports.keyExchangeEcdheEddsa = keyExchangeEcdheEddsa;
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
        const buf = kdf_1.kdf(buflen, ikm, salt, ctx);
        const arr = Array.from(buf);
        arr[0] = arr[0] & mask;
        const r = big_integer_1.default.fromArray(arr, 256, false);
        if (r.lt(n)) {
            return r;
        }
        counter++;
    }
}
function stringToBytes(s) {
    const te = new TextEncoder();
    return te.encode(s);
}
exports.stringToBytes = stringToBytes;
function loadBigInt(arr) {
    return big_integer_1.default.fromArray(Array.from(arr), 256, false);
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
    const t = big_integer_1.default.gcd(r, n);
    if (!t.equals(big_integer_1.default.one)) {
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
exports.rsaBlind = rsaBlind;
function rsaUnblind(sig, rsaPubEnc, bks) {
    const rsaPub = rsaPubDecode(rsaPubEnc);
    const blinded_s = loadBigInt(sig);
    const r = rsaBlindingKeyDerive(rsaPub, bks);
    const r_inv = r.modInv(rsaPub.N);
    const s = blinded_s.multiply(r_inv).mod(rsaPub.N);
    return new Uint8Array(s.toArray(256).value);
}
exports.rsaUnblind = rsaUnblind;
function rsaVerify(hm, rsaSig, rsaPubEnc) {
    const rsaPub = rsaPubDecode(rsaPubEnc);
    const d = rsaFullDomainHash(hm, rsaPub);
    const sig = loadBigInt(rsaSig);
    const sig_e = sig.modPow(rsaPub.e, rsaPub.N);
    return sig_e.equals(d);
}
exports.rsaVerify = rsaVerify;
function createEddsaKeyPair() {
    const eddsaPriv = nacl.randomBytes(32);
    const eddsaPub = eddsaGetPublic(eddsaPriv);
    return { eddsaPriv, eddsaPub };
}
exports.createEddsaKeyPair = createEddsaKeyPair;
function createEcdheKeyPair() {
    const ecdhePriv = nacl.randomBytes(32);
    const ecdhePub = ecdheGetPublic(ecdhePriv);
    return { ecdhePriv, ecdhePub };
}
exports.createEcdheKeyPair = createEcdheKeyPair;
function createBlindingKeySecret() {
    return nacl.randomBytes(32);
}
exports.createBlindingKeySecret = createBlindingKeySecret;
function hash(d) {
    return nacl.hash(d);
}
exports.hash = hash;
function eddsaSign(msg, eddsaPriv) {
    const pair = nacl.sign_keyPair_fromSeed(eddsaPriv);
    return nacl.sign_detached(msg, pair.secretKey);
}
exports.eddsaSign = eddsaSign;
function eddsaVerify(msg, sig, eddsaPub) {
    return nacl.sign_detached_verify(msg, sig, eddsaPub);
}
exports.eddsaVerify = eddsaVerify;
function createHashContext() {
    return new nacl.HashState();
}
exports.createHashContext = createHashContext;
function setupRefreshPlanchet(secretSeed, coinNumber) {
    const info = stringToBytes("taler-coin-derivation");
    const saltArrBuf = new ArrayBuffer(4);
    const salt = new Uint8Array(saltArrBuf);
    const saltDataView = new DataView(saltArrBuf);
    saltDataView.setUint32(0, coinNumber);
    const out = kdf_1.kdf(64, secretSeed, salt, info);
    const coinPriv = out.slice(0, 32);
    const bks = out.slice(32, 64);
    return {
        bks,
        coinPriv,
        coinPub: eddsaGetPublic(coinPriv),
    };
}
exports.setupRefreshPlanchet = setupRefreshPlanchet;

});

unwrapExports(talerCrypto);
var talerCrypto_1 = talerCrypto.getRandomBytes;
var talerCrypto_2 = talerCrypto.encodeCrock;
var talerCrypto_3 = talerCrypto.decodeCrock;
var talerCrypto_4 = talerCrypto.eddsaGetPublic;
var talerCrypto_5 = talerCrypto.ecdheGetPublic;
var talerCrypto_6 = talerCrypto.keyExchangeEddsaEcdhe;
var talerCrypto_7 = talerCrypto.keyExchangeEcdheEddsa;
var talerCrypto_8 = talerCrypto.stringToBytes;
var talerCrypto_9 = talerCrypto.rsaBlind;
var talerCrypto_10 = talerCrypto.rsaUnblind;
var talerCrypto_11 = talerCrypto.rsaVerify;
var talerCrypto_12 = talerCrypto.createEddsaKeyPair;
var talerCrypto_13 = talerCrypto.createEcdheKeyPair;
var talerCrypto_14 = talerCrypto.createBlindingKeySecret;
var talerCrypto_15 = talerCrypto.hash;
var talerCrypto_16 = talerCrypto.eddsaSign;
var talerCrypto_17 = talerCrypto.eddsaVerify;
var talerCrypto_18 = talerCrypto.createHashContext;
var talerCrypto_19 = talerCrypto.setupRefreshPlanchet;

var ReserveTransaction = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Florian Dold <dold@taler.net>
 */
/**
 * Imports.
 */


exports.codecForReserveWithdrawTransaction = () => codec.makeCodecForObject()
    .property("amount", codec.codecForString)
    .property("h_coin_envelope", codec.codecForString)
    .property("h_denom_pub", codec.codecForString)
    .property("reserve_sig", codec.codecForString)
    .property("type", codec.makeCodecForConstString("WITHDRAW" /* Withdraw */))
    .property("withdraw_fee", codec.codecForString)
    .build("ReserveWithdrawTransaction");
exports.codecForReserveCreditTransaction = () => codec.makeCodecForObject()
    .property("amount", codec.codecForString)
    .property("sender_account_url", codec.codecForString)
    .property("timestamp", time.codecForTimestamp)
    .property("wire_reference", codec.codecForString)
    .property("type", codec.makeCodecForConstString("CREDIT" /* Credit */))
    .build("ReserveCreditTransaction");
exports.codecForReserveClosingTransaction = () => codec.makeCodecForObject()
    .property("amount", codec.codecForString)
    .property("closing_fee", codec.codecForString)
    .property("exchange_pub", codec.codecForString)
    .property("exchange_sig", codec.codecForString)
    .property("h_wire", codec.codecForString)
    .property("timestamp", time.codecForTimestamp)
    .property("type", codec.makeCodecForConstString("CLOSING" /* Closing */))
    .property("wtid", codec.codecForString)
    .build("ReserveClosingTransaction");
exports.codecForReserveRecoupTransaction = () => codec.makeCodecForObject()
    .property("amount", codec.codecForString)
    .property("coin_pub", codec.codecForString)
    .property("exchange_pub", codec.codecForString)
    .property("exchange_sig", codec.codecForString)
    .property("timestamp", time.codecForTimestamp)
    .property("type", codec.makeCodecForConstString("RECOUP" /* Recoup */))
    .build("ReserveRecoupTransaction");
exports.codecForReserveTransaction = () => codec.makeCodecForUnion()
    .discriminateOn("type")
    .alternative("WITHDRAW" /* Withdraw */, exports.codecForReserveWithdrawTransaction())
    .alternative("CLOSING" /* Closing */, exports.codecForReserveClosingTransaction())
    .alternative("RECOUP" /* Recoup */, exports.codecForReserveRecoupTransaction())
    .alternative("CREDIT" /* Credit */, exports.codecForReserveCreditTransaction())
    .build("ReserveTransaction");

});

unwrapExports(ReserveTransaction);
var ReserveTransaction_1 = ReserveTransaction.codecForReserveWithdrawTransaction;
var ReserveTransaction_2 = ReserveTransaction.codecForReserveCreditTransaction;
var ReserveTransaction_3 = ReserveTransaction.codecForReserveClosingTransaction;
var ReserveTransaction_4 = ReserveTransaction.codecForReserveRecoupTransaction;
var ReserveTransaction_5 = ReserveTransaction.codecForReserveTransaction;

var ReserveStatus = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Florian Dold <dold@taler.net>
 */
/**
 * Imports.
 */


exports.codecForReserveStatus = () => codec.makeCodecForObject()
    .property("balance", codec.codecForString)
    .property("history", codec.makeCodecForList(ReserveTransaction.codecForReserveTransaction()))
    .build("ReserveStatus");

});

unwrapExports(ReserveStatus);
var ReserveStatus_1 = ReserveStatus.codecForReserveStatus;

var reserveHistoryUtil = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

const Amounts = tslib_1.__importStar(amounts);


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
                time.timestampCmp(t1.timestamp, t2.timestamp) === 0);
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
                Amounts.cmp(t1.expectedAmount, Amounts.parseOrThrow(t2.amount)) === 0);
        }
        case "withdraw" /* Withdraw */:
            return (t2.type === "WITHDRAW" /* Withdraw */ &&
                !!t1.expectedAmount &&
                Amounts.cmp(t1.expectedAmount, Amounts.parseOrThrow(t2.amount)) === 0);
        case "recoup" /* Recoup */: {
            return (t2.type === "RECOUP" /* Recoup */ &&
                !!t1.expectedAmount &&
                Amounts.cmp(t1.expectedAmount, Amounts.parseOrThrow(t2.amount)) === 0);
        }
    }
    return false;
}
exports.isLocalRemoteHistoryMatch = isLocalRemoteHistoryMatch;
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
                    posAmounts.push(Amounts.parseOrThrow(item.matchedExchangeTransaction.amount));
                }
                else if (item.expectedAmount) {
                    expectedPosAmounts.push(item.expectedAmount);
                }
                break;
            case "recoup" /* Recoup */:
                if (item.matchedExchangeTransaction) {
                    if (item.matchedExchangeTransaction) {
                        posAmounts.push(Amounts.parseOrThrow(item.matchedExchangeTransaction.amount));
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
                    negAmounts.push(Amounts.parseOrThrow(item.matchedExchangeTransaction.amount));
                }
                else {
                    throw Error("invariant failed");
                }
                break;
            case "withdraw" /* Withdraw */:
                if (item.matchedExchangeTransaction) {
                    negAmounts.push(Amounts.parseOrThrow(item.matchedExchangeTransaction.amount));
                    withdrawnAmounts.push(Amounts.parseOrThrow(item.matchedExchangeTransaction.amount));
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
    const z = Amounts.getZero(currency);
    const computedBalance = Amounts.sub(Amounts.add(z, ...posAmounts).amount, ...negAmounts).amount;
    const unclaimedReserveAmount = Amounts.sub(Amounts.add(z, ...posAmounts).amount, ...negAmounts, ...expectedNegAmounts).amount;
    const awaitedReserveAmount = Amounts.sub(Amounts.add(z, ...expectedPosAmounts).amount, ...expectedNegAmounts).amount;
    const withdrawnAmount = Amounts.add(z, ...withdrawnAmounts).amount;
    return {
        computedReserveBalance: computedBalance,
        unclaimedReserveAmount: unclaimedReserveAmount,
        awaitedReserveAmount: awaitedReserveAmount,
        withdrawnAmount,
    };
}
exports.summarizeReserveHistory = summarizeReserveHistory;
/**
 * Reconcile the wallet's local model of the reserve history
 * with the reserve history of the exchange.
 */
function reconcileReserveHistory(localHistory, remoteHistory) {
    const updatedLocalHistory = helpers.deepCopy(localHistory);
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
exports.reconcileReserveHistory = reconcileReserveHistory;

});

unwrapExports(reserveHistoryUtil);
var reserveHistoryUtil_1 = reserveHistoryUtil.isLocalRemoteHistoryMatch;
var reserveHistoryUtil_2 = reserveHistoryUtil.summarizeReserveHistory;
var reserveHistoryUtil_3 = reserveHistoryUtil.reconcileReserveHistory;

var reserves = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });















const logger = new logging.Logger("reserves.ts");
function resetReserveRetry(ws, reservePub) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(dbTypes.Stores.reserves, reservePub, (x) => {
            if (x.retryInfo.active) {
                x.retryInfo = dbTypes.initRetryInfo();
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const keypair = yield ws.cryptoApi.createEddsaKeypair();
        const now = time.getTimestampNow();
        const canonExchange = helpers.canonicalizeBaseUrl(req.exchange);
        let reserveStatus;
        if (req.bankWithdrawStatusUrl) {
            reserveStatus = dbTypes.ReserveRecordStatus.REGISTERING_BANK;
        }
        else {
            reserveStatus = dbTypes.ReserveRecordStatus.UNCONFIRMED;
        }
        const reserveRecord = {
            timestampCreated: now,
            exchangeBaseUrl: canonExchange,
            reservePriv: keypair.priv,
            reservePub: keypair.pub,
            senderWire: req.senderWire,
            timestampConfirmed: undefined,
            timestampReserveInfoPosted: undefined,
            bankInfo: req.bankWithdrawStatusUrl
                ? {
                    statusUrl: req.bankWithdrawStatusUrl,
                    amount: req.amount,
                    bankWithdrawalGroupId: talerCrypto.encodeCrock(talerCrypto.getRandomBytes(32)),
                    withdrawalStarted: false,
                }
                : undefined,
            exchangeWire: req.exchangeWire,
            reserveStatus,
            lastSuccessfulStatusQuery: undefined,
            retryInfo: dbTypes.initRetryInfo(),
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
            yield ws.db.put(dbTypes.Stores.senderWires, rec);
        }
        const exchangeInfo = yield exchanges.updateExchangeFromUrl(ws, req.exchange);
        const exchangeDetails = exchangeInfo.details;
        if (!exchangeDetails) {
            console.log(exchangeDetails);
            throw Error("exchange not updated");
        }
        const { isAudited, isTrusted } = yield exchanges.getExchangeTrust(ws, exchangeInfo);
        let currencyRecord = yield ws.db.get(dbTypes.Stores.currencies, exchangeDetails.currency);
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
            dbTypes.Stores.currencies,
            dbTypes.Stores.reserves,
            dbTypes.Stores.reserveHistory,
            dbTypes.Stores.bankWithdrawUris,
        ], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            // Check if we have already created a reserve for that bankWithdrawStatusUrl
            if ((_a = reserveRecord.bankInfo) === null || _a === void 0 ? void 0 : _a.statusUrl) {
                const bwi = yield tx.get(dbTypes.Stores.bankWithdrawUris, reserveRecord.bankInfo.statusUrl);
                if (bwi) {
                    const otherReserve = yield tx.get(dbTypes.Stores.reserves, bwi.reservePub);
                    if (otherReserve) {
                        logger.trace("returning existing reserve for bankWithdrawStatusUri");
                        return {
                            exchange: otherReserve.exchangeBaseUrl,
                            reservePub: otherReserve.reservePub,
                        };
                    }
                }
                yield tx.put(dbTypes.Stores.bankWithdrawUris, {
                    reservePub: reserveRecord.reservePub,
                    talerWithdrawUri: reserveRecord.bankInfo.statusUrl,
                });
            }
            yield tx.put(dbTypes.Stores.currencies, cr);
            yield tx.put(dbTypes.Stores.reserves, reserveRecord);
            yield tx.put(dbTypes.Stores.reserveHistory, reserveHistoryRecord);
            const r = {
                exchange: canonExchange,
                reservePub: keypair.pub,
            };
            return r;
        }));
        ws.notify({ type: "reserve-created" /* ReserveCreated */ });
        // Asynchronously process the reserve, but return
        // to the caller already.
        processReserve(ws, resp.reservePub, true).catch((e) => {
            console.error("Processing reserve (after createReserve) failed:", e);
        });
        return resp;
    });
}
exports.createReserve = createReserve;
/**
 * Re-query the status of a reserve.
 */
function forceQueryReserve(ws, reservePub) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.reserves], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const reserve = yield tx.get(dbTypes.Stores.reserves, reservePub);
            if (!reserve) {
                return;
            }
            // Only force status query where it makes sense
            switch (reserve.reserveStatus) {
                case dbTypes.ReserveRecordStatus.DORMANT:
                case dbTypes.ReserveRecordStatus.WITHDRAWING:
                case dbTypes.ReserveRecordStatus.QUERYING_STATUS:
                    break;
                default:
                    return;
            }
            reserve.reserveStatus = dbTypes.ReserveRecordStatus.QUERYING_STATUS;
            reserve.retryInfo = dbTypes.initRetryInfo();
            yield tx.put(dbTypes.Stores.reserves, reserve);
        }));
        yield processReserve(ws, reservePub, true);
    });
}
exports.forceQueryReserve = forceQueryReserve;
/**
 * First fetch information requred to withdraw from the reserve,
 * then deplete the reserve, withdrawing coins until it is empty.
 *
 * The returned promise resolves once the reserve is set to the
 * state DORMANT.
 */
function processReserve(ws, reservePub, forceNow = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return ws.memoProcessReserve.memo(reservePub, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const onOpError = (err) => incrementReserveRetry(ws, reservePub, err);
            yield errors.guardOperationException(() => processReserveImpl(ws, reservePub, forceNow), onOpError);
        }));
    });
}
exports.processReserve = processReserve;
function registerReserveWithBank(ws, reservePub) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const reserve = yield ws.db.get(dbTypes.Stores.reserves, reservePub);
        switch (reserve === null || reserve === void 0 ? void 0 : reserve.reserveStatus) {
            case dbTypes.ReserveRecordStatus.WAIT_CONFIRM_BANK:
            case dbTypes.ReserveRecordStatus.REGISTERING_BANK:
                break;
            default:
                return;
        }
        const bankStatusUrl = (_a = reserve.bankInfo) === null || _a === void 0 ? void 0 : _a.statusUrl;
        if (!bankStatusUrl) {
            return;
        }
        console.log("making selection");
        if (reserve.timestampReserveInfoPosted) {
            throw Error("bank claims that reserve info selection is not done");
        }
        // FIXME: parse bank response
        yield ws.http.postJson(bankStatusUrl, {
            reserve_pub: reservePub,
            selected_exchange: reserve.exchangeWire,
        });
        yield ws.db.mutate(dbTypes.Stores.reserves, reservePub, (r) => {
            switch (r.reserveStatus) {
                case dbTypes.ReserveRecordStatus.REGISTERING_BANK:
                case dbTypes.ReserveRecordStatus.WAIT_CONFIRM_BANK:
                    break;
                default:
                    return;
            }
            r.timestampReserveInfoPosted = time.getTimestampNow();
            r.reserveStatus = dbTypes.ReserveRecordStatus.WAIT_CONFIRM_BANK;
            r.retryInfo = dbTypes.initRetryInfo();
            return r;
        });
        ws.notify({ type: "wildcard" /* Wildcard */ });
        return processReserveBankStatus(ws, reservePub);
    });
}
function processReserveBankStatus(ws, reservePub) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const onOpError = (err) => incrementReserveRetry(ws, reservePub, err);
        yield errors.guardOperationException(() => processReserveBankStatusImpl(ws, reservePub), onOpError);
    });
}
exports.processReserveBankStatus = processReserveBankStatus;
function processReserveBankStatusImpl(ws, reservePub) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const reserve = yield ws.db.get(dbTypes.Stores.reserves, reservePub);
        switch (reserve === null || reserve === void 0 ? void 0 : reserve.reserveStatus) {
            case dbTypes.ReserveRecordStatus.WAIT_CONFIRM_BANK:
            case dbTypes.ReserveRecordStatus.REGISTERING_BANK:
                break;
            default:
                return;
        }
        const bankStatusUrl = (_a = reserve.bankInfo) === null || _a === void 0 ? void 0 : _a.statusUrl;
        if (!bankStatusUrl) {
            return;
        }
        const statusResp = yield ws.http.get(bankStatusUrl);
        if (statusResp.status !== 200) {
            throw Error(`unexpected status ${statusResp.status} for bank status query`);
        }
        const status = talerTypes.codecForWithdrawOperationStatusResponse().decode(yield statusResp.json());
        ws.notify({ type: "wildcard" /* Wildcard */ });
        if (status.selection_done) {
            if (reserve.reserveStatus === dbTypes.ReserveRecordStatus.REGISTERING_BANK) {
                yield registerReserveWithBank(ws, reservePub);
                return yield processReserveBankStatus(ws, reservePub);
            }
        }
        else {
            yield registerReserveWithBank(ws, reservePub);
            return yield processReserveBankStatus(ws, reservePub);
        }
        if (status.transfer_done) {
            yield ws.db.mutate(dbTypes.Stores.reserves, reservePub, (r) => {
                switch (r.reserveStatus) {
                    case dbTypes.ReserveRecordStatus.REGISTERING_BANK:
                    case dbTypes.ReserveRecordStatus.WAIT_CONFIRM_BANK:
                        break;
                    default:
                        return;
                }
                const now = time.getTimestampNow();
                r.timestampConfirmed = now;
                r.reserveStatus = dbTypes.ReserveRecordStatus.QUERYING_STATUS;
                r.retryInfo = dbTypes.initRetryInfo();
                return r;
            });
            yield processReserveImpl(ws, reservePub, true);
        }
        else {
            yield ws.db.mutate(dbTypes.Stores.reserves, reservePub, (r) => {
                switch (r.reserveStatus) {
                    case dbTypes.ReserveRecordStatus.WAIT_CONFIRM_BANK:
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
        ws.notify({ type: "wildcard" /* Wildcard */ });
    });
}
function incrementReserveRetry(ws, reservePub, err) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.reserves], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(dbTypes.Stores.reserves, reservePub);
            if (!r) {
                return;
            }
            if (!r.retryInfo) {
                return;
            }
            console.log("updating retry info");
            console.log("before", r.retryInfo);
            r.retryInfo.retryCounter++;
            dbTypes.updateRetryInfoTimeout(r.retryInfo);
            console.log("after", r.retryInfo);
            r.lastError = err;
            yield tx.put(dbTypes.Stores.reserves, r);
        }));
        if (err) {
            ws.notify({
                type: "reserve-error" /* ReserveOperationError */,
                operationError: err,
            });
        }
    });
}
/**
 * Update the information about a reserve that is stored in the wallet
 * by quering the reserve's exchange.
 */
function updateReserve(ws, reservePub) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const reserve = yield ws.db.get(dbTypes.Stores.reserves, reservePub);
        if (!reserve) {
            throw Error("reserve not in db");
        }
        if (reserve.timestampConfirmed === undefined) {
            throw Error("reserve not confirmed yet");
        }
        if (reserve.reserveStatus !== dbTypes.ReserveRecordStatus.QUERYING_STATUS) {
            return;
        }
        const reqUrl = new URL(`reserves/${reservePub}`, reserve.exchangeBaseUrl);
        let resp;
        try {
            resp = yield ws.http.get(reqUrl.href);
            console.log("got reserves/${RESERVE_PUB} response", yield resp.json());
            if (resp.status === 404) {
                const m = "reserve not known to the exchange yet";
                throw new errors.OperationFailedError({
                    type: "waiting",
                    message: m,
                    details: {},
                });
            }
            if (resp.status !== 200) {
                throw Error(`unexpected status code ${resp.status} for reserve/status`);
            }
        }
        catch (e) {
            logger.trace("caught exception for reserve/status");
            const m = e.message;
            const opErr = {
                type: "network",
                details: {},
                message: m,
            };
            yield incrementReserveRetry(ws, reservePub, opErr);
            throw new errors.OperationFailedAndReportedError(opErr);
        }
        const respJson = yield resp.json();
        const reserveInfo = ReserveStatus.codecForReserveStatus().decode(respJson);
        const balance = amounts.Amounts.parseOrThrow(reserveInfo.balance);
        const currency = balance.currency;
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.reserves, dbTypes.Stores.reserveUpdatedEvents, dbTypes.Stores.reserveHistory], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(dbTypes.Stores.reserves, reservePub);
            if (!r) {
                return;
            }
            if (r.reserveStatus !== dbTypes.ReserveRecordStatus.QUERYING_STATUS) {
                return;
            }
            const hist = yield tx.get(dbTypes.Stores.reserveHistory, reservePub);
            if (!hist) {
                throw Error("inconsistent database");
            }
            const newHistoryTransactions = reserveInfo.history.slice(hist.reserveTransactions.length);
            const reserveUpdateId = talerCrypto.encodeCrock(talerCrypto.getRandomBytes(32));
            const reconciled = reserveHistoryUtil.reconcileReserveHistory(hist.reserveTransactions, reserveInfo.history);
            console.log("reconciled history:", JSON.stringify(reconciled, undefined, 2));
            const summary = reserveHistoryUtil.summarizeReserveHistory(reconciled.updatedLocalHistory, currency);
            console.log("summary", summary);
            if (reconciled.newAddedItems.length + reconciled.newMatchedItems.length !=
                0) {
                const reserveUpdate = {
                    reservePub: r.reservePub,
                    timestamp: time.getTimestampNow(),
                    amountReserveBalance: amounts.Amounts.stringify(balance),
                    amountExpected: amounts.Amounts.stringify(summary.awaitedReserveAmount),
                    newHistoryTransactions,
                    reserveUpdateId,
                };
                yield tx.put(dbTypes.Stores.reserveUpdatedEvents, reserveUpdate);
                r.reserveStatus = dbTypes.ReserveRecordStatus.WITHDRAWING;
                r.retryInfo = dbTypes.initRetryInfo();
            }
            else {
                r.reserveStatus = dbTypes.ReserveRecordStatus.DORMANT;
                r.retryInfo = dbTypes.initRetryInfo(false);
            }
            r.lastSuccessfulStatusQuery = time.getTimestampNow();
            hist.reserveTransactions = reconciled.updatedLocalHistory;
            r.lastError = undefined;
            yield tx.put(dbTypes.Stores.reserves, r);
            yield tx.put(dbTypes.Stores.reserveHistory, hist);
        }));
        ws.notify({ type: "reserve-updated" /* ReserveUpdated */ });
    });
}
function processReserveImpl(ws, reservePub, forceNow = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const reserve = yield ws.db.get(dbTypes.Stores.reserves, reservePub);
        if (!reserve) {
            console.log("not processing reserve: reserve does not exist");
            return;
        }
        if (!forceNow) {
            const now = time.getTimestampNow();
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
            case dbTypes.ReserveRecordStatus.UNCONFIRMED:
                // nothing to do
                break;
            case dbTypes.ReserveRecordStatus.REGISTERING_BANK:
                yield processReserveBankStatus(ws, reservePub);
                return yield processReserveImpl(ws, reservePub, true);
            case dbTypes.ReserveRecordStatus.QUERYING_STATUS:
                yield updateReserve(ws, reservePub);
                return yield processReserveImpl(ws, reservePub, true);
            case dbTypes.ReserveRecordStatus.WITHDRAWING:
                yield depleteReserve(ws, reservePub);
                break;
            case dbTypes.ReserveRecordStatus.DORMANT:
                // nothing to do
                break;
            case dbTypes.ReserveRecordStatus.WAIT_CONFIRM_BANK:
                yield processReserveBankStatus(ws, reservePub);
                break;
            default:
                console.warn("unknown reserve record status:", reserve.reserveStatus);
                assertUnreachable_1.assertUnreachable(reserve.reserveStatus);
                break;
        }
    });
}
function confirmReserve(ws, req) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const now = time.getTimestampNow();
        yield ws.db.mutate(dbTypes.Stores.reserves, req.reservePub, (reserve) => {
            if (reserve.reserveStatus !== dbTypes.ReserveRecordStatus.UNCONFIRMED) {
                return;
            }
            reserve.timestampConfirmed = now;
            reserve.reserveStatus = dbTypes.ReserveRecordStatus.QUERYING_STATUS;
            reserve.retryInfo = dbTypes.initRetryInfo();
            return reserve;
        });
        ws.notify({ type: "reserve-updated" /* ReserveUpdated */ });
        processReserve(ws, req.reservePub, true).catch((e) => {
            console.log("processing reserve (after confirmReserve) failed:", e);
        });
    });
}
exports.confirmReserve = confirmReserve;
/**
 * Withdraw coins from a reserve until it is empty.
 *
 * When finished, marks the reserve as depleted by setting
 * the depleted timestamp.
 */
function depleteReserve(ws, reservePub) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let reserve;
        let hist;
        yield ws.db.runWithReadTransaction([dbTypes.Stores.reserves, dbTypes.Stores.reserveHistory], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            reserve = yield tx.get(dbTypes.Stores.reserves, reservePub);
            hist = yield tx.get(dbTypes.Stores.reserveHistory, reservePub);
        }));
        if (!reserve) {
            return;
        }
        if (!hist) {
            throw Error("inconsistent database");
        }
        if (reserve.reserveStatus !== dbTypes.ReserveRecordStatus.WITHDRAWING) {
            return;
        }
        logger.trace(`depleting reserve ${reservePub}`);
        const summary = reserveHistoryUtil.summarizeReserveHistory(hist.reserveTransactions, reserve.currency);
        const withdrawAmount = summary.unclaimedReserveAmount;
        logger.trace(`getting denom list`);
        const denomsForWithdraw = yield withdraw.getVerifiedWithdrawDenomList(ws, reserve.exchangeBaseUrl, withdrawAmount);
        logger.trace(`got denom list`);
        if (!denomsForWithdraw) {
            // Only complain about inability to withdraw if we
            // didn't withdraw before.
            if (amounts.Amounts.isZero(summary.withdrawnAmount)) {
                const m = `Unable to withdraw from reserve, no denominations are available to withdraw.`;
                const opErr = {
                    type: "internal",
                    message: m,
                    details: {},
                };
                yield incrementReserveRetry(ws, reserve.reservePub, opErr);
                console.log(m);
                throw new errors.OperationFailedAndReportedError(opErr);
            }
            return;
        }
        logger.trace("selected denominations");
        const newWithdrawalGroup = yield ws.db.runWithWriteTransaction([
            dbTypes.Stores.withdrawalGroups,
            dbTypes.Stores.reserves,
            dbTypes.Stores.reserveHistory,
            dbTypes.Stores.planchets,
        ], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const newReserve = yield tx.get(dbTypes.Stores.reserves, reservePub);
            if (!newReserve) {
                return false;
            }
            if (newReserve.reserveStatus !== dbTypes.ReserveRecordStatus.WITHDRAWING) {
                return false;
            }
            const newHist = yield tx.get(dbTypes.Stores.reserveHistory, reservePub);
            if (!newHist) {
                throw Error("inconsistent database");
            }
            const newSummary = reserveHistoryUtil.summarizeReserveHistory(newHist.reserveTransactions, newReserve.currency);
            if (amounts.Amounts.cmp(newSummary.unclaimedReserveAmount, denomsForWithdraw.totalWithdrawCost) < 0) {
                // Something must have happened concurrently!
                logger.error("aborting withdrawal session, likely concurrent withdrawal happened");
                return false;
            }
            for (let i = 0; i < denomsForWithdraw.selectedDenoms.length; i++) {
                const sd = denomsForWithdraw.selectedDenoms[i];
                for (let j = 0; j < sd.count; j++) {
                    const amt = amounts.Amounts.add(sd.denom.value, sd.denom.feeWithdraw).amount;
                    newHist.reserveTransactions.push({
                        type: "withdraw" /* Withdraw */,
                        expectedAmount: amt,
                    });
                }
            }
            newReserve.reserveStatus = dbTypes.ReserveRecordStatus.DORMANT;
            newReserve.retryInfo = dbTypes.initRetryInfo(false);
            let withdrawalGroupId;
            const bankInfo = newReserve.bankInfo;
            if (bankInfo && !bankInfo.withdrawalStarted) {
                withdrawalGroupId = bankInfo.bankWithdrawalGroupId;
                bankInfo.withdrawalStarted = true;
            }
            else {
                withdrawalGroupId = talerCrypto.encodeCrock(naclFast.randomBytes(32));
            }
            const withdrawalRecord = {
                withdrawalGroupId: withdrawalGroupId,
                exchangeBaseUrl: newReserve.exchangeBaseUrl,
                source: {
                    type: "reserve" /* Reserve */,
                    reservePub: newReserve.reservePub,
                },
                rawWithdrawalAmount: withdrawAmount,
                timestampStart: time.getTimestampNow(),
                retryInfo: dbTypes.initRetryInfo(),
                lastErrorPerCoin: {},
                lastError: undefined,
                denomsSel: {
                    totalCoinValue: denomsForWithdraw.totalCoinValue,
                    totalWithdrawCost: denomsForWithdraw.totalWithdrawCost,
                    selectedDenoms: denomsForWithdraw.selectedDenoms.map((x) => {
                        return {
                            count: x.count,
                            denomPubHash: x.denom.denomPubHash,
                        };
                    }),
                },
            };
            yield tx.put(dbTypes.Stores.reserves, newReserve);
            yield tx.put(dbTypes.Stores.reserveHistory, newHist);
            yield tx.put(dbTypes.Stores.withdrawalGroups, withdrawalRecord);
            return withdrawalRecord;
        }));
        if (newWithdrawalGroup) {
            console.log("processing new withdraw group");
            ws.notify({
                type: "withdraw-group-created" /* WithdrawGroupCreated */,
                withdrawalGroupId: newWithdrawalGroup.withdrawalGroupId,
            });
            yield withdraw.processWithdrawGroup(ws, newWithdrawalGroup.withdrawalGroupId);
        }
        else {
            console.trace("withdraw session already existed");
        }
    });
}
function createTalerWithdrawReserve(ws, talerWithdrawUri, selectedExchange) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const withdrawInfo = yield withdraw.getBankWithdrawalInfo(ws, talerWithdrawUri);
        const exchangeWire = yield exchanges.getExchangePaytoUri(ws, selectedExchange, withdrawInfo.wireTypes);
        const reserve = yield createReserve(ws, {
            amount: withdrawInfo.amount,
            bankWithdrawStatusUrl: withdrawInfo.extractedStatusUrl,
            exchange: selectedExchange,
            senderWire: withdrawInfo.senderWire,
            exchangeWire: exchangeWire,
        });
        // We do this here, as the reserve should be registered before we return,
        // so that we can redirect the user to the bank's status page.
        yield processReserveBankStatus(ws, reserve.reservePub);
        console.log("acceptWithdrawal: returning");
        return {
            reservePub: reserve.reservePub,
            confirmTransferUrl: withdrawInfo.confirmTransferUrl,
        };
    });
}
exports.createTalerWithdrawReserve = createTalerWithdrawReserve;

});

unwrapExports(reserves);
var reserves_1 = reserves.createReserve;
var reserves_2 = reserves.forceQueryReserve;
var reserves_3 = reserves.processReserve;
var reserves_4 = reserves.processReserveBankStatus;
var reserves_5 = reserves.confirmReserve;
var reserves_6 = reserves.createTalerWithdrawReserve;

var refresh = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });










const logger = new logging.Logger("refresh.ts");
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
    const withdrawAmount = amounts.Amounts.sub(amountLeft, refreshedDenom.feeRefresh)
        .amount;
    const withdrawDenoms = withdraw.getWithdrawDenomList(withdrawAmount, denoms);
    const resultingAmount = amounts.Amounts.add(amounts.Amounts.getZero(withdrawAmount.currency), ...withdrawDenoms.selectedDenoms.map((d) => amounts.Amounts.mult(d.denom.value, d.count).amount)).amount;
    const totalCost = amounts.Amounts.sub(amountLeft, resultingAmount).amount;
    logger.trace("total refresh cost for", helpers.amountToPretty(amountLeft), "is", helpers.amountToPretty(totalCost));
    return totalCost;
}
exports.getTotalRefreshCost = getTotalRefreshCost;
/**
 * Create a refresh session inside a refresh group.
 */
function refreshCreateSession(ws, refreshGroupId, coinIndex) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        logger.trace(`creating refresh session for coin ${coinIndex} in refresh group ${refreshGroupId}`);
        const refreshGroup = yield ws.db.get(dbTypes.Stores.refreshGroups, refreshGroupId);
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
        const coin = yield ws.db.get(dbTypes.Stores.coins, oldCoinPub);
        if (!coin) {
            throw Error("Can't refresh, coin not found");
        }
        const exchange = yield exchanges.updateExchangeFromUrl(ws, coin.exchangeBaseUrl);
        if (!exchange) {
            throw Error("db inconsistent: exchange of coin not found");
        }
        const oldDenom = yield ws.db.get(dbTypes.Stores.denominations, [
            exchange.baseUrl,
            coin.denomPub,
        ]);
        if (!oldDenom) {
            throw Error("db inconsistent: denomination for coin not found");
        }
        const availableDenoms = yield ws.db
            .iterIndex(dbTypes.Stores.denominations.exchangeBaseUrlIndex, exchange.baseUrl)
            .toArray();
        const availableAmount = amounts.Amounts.sub(coin.currentAmount, oldDenom.feeRefresh)
            .amount;
        const newCoinDenoms = withdraw.getWithdrawDenomList(availableAmount, availableDenoms);
        if (newCoinDenoms.selectedDenoms.length === 0) {
            logger.trace(`not refreshing, available amount ${helpers.amountToPretty(availableAmount)} too small`);
            yield ws.db.runWithWriteTransaction([dbTypes.Stores.coins, dbTypes.Stores.refreshGroups], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const rg = yield tx.get(dbTypes.Stores.refreshGroups, refreshGroupId);
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
                    rg.timestampFinished = time.getTimestampNow();
                    rg.retryInfo = dbTypes.initRetryInfo(false);
                }
                yield tx.put(dbTypes.Stores.refreshGroups, rg);
            }));
            ws.notify({ type: "refresh-unwarranted" /* RefreshUnwarranted */ });
            return;
        }
        const refreshSession = yield ws.cryptoApi.createRefreshSession(exchange.baseUrl, 3, coin, newCoinDenoms, oldDenom.feeRefresh);
        // Store refresh session and subtract refreshed amount from
        // coin in the same transaction.
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.refreshGroups, dbTypes.Stores.coins], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const c = yield tx.get(dbTypes.Stores.coins, coin.coinPub);
            if (!c) {
                throw Error("coin not found, but marked for refresh");
            }
            const r = amounts.Amounts.sub(c.currentAmount, refreshSession.amountRefreshInput);
            if (r.saturated) {
                console.log("can't refresh coin, no amount left");
                return;
            }
            c.currentAmount = r.amount;
            c.status = "dormant" /* Dormant */;
            const rg = yield tx.get(dbTypes.Stores.refreshGroups, refreshGroupId);
            if (!rg) {
                return;
            }
            if (rg.refreshSessionPerCoin[coinIndex]) {
                return;
            }
            rg.refreshSessionPerCoin[coinIndex] = refreshSession;
            yield tx.put(dbTypes.Stores.refreshGroups, rg);
            yield tx.put(dbTypes.Stores.coins, c);
        }));
        logger.info(`created refresh session for coin #${coinIndex} in ${refreshGroupId}`);
        ws.notify({ type: "refresh-started" /* RefreshStarted */ });
    });
}
function refreshMelt(ws, refreshGroupId, coinIndex) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const refreshGroup = yield ws.db.get(dbTypes.Stores.refreshGroups, refreshGroupId);
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
        const coin = yield ws.db.get(dbTypes.Stores.coins, refreshSession.meltCoinPub);
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
            value_with_fee: amounts.Amounts.stringify(refreshSession.amountRefreshInput),
        };
        logger.trace(`melt request for coin:`, meltReq);
        const resp = yield ws.http.postJson(reqUrl.href, meltReq);
        if (resp.status !== 200) {
            console.log(`got status ${resp.status} for refresh/melt`);
            try {
                const respJson = yield resp.json();
                console.log(`body of refresh/melt error response:`, JSON.stringify(respJson, undefined, 2));
            }
            catch (e) {
                console.log(`body of refresh/melt error response is not JSON`);
            }
            throw Error(`unexpected status code ${resp.status} for refresh/melt`);
        }
        const respJson = yield resp.json();
        logger.trace("melt response:", respJson);
        if (resp.status !== 200) {
            console.error(respJson);
            throw Error("refresh failed");
        }
        const norevealIndex = respJson.noreveal_index;
        if (typeof norevealIndex !== "number") {
            throw Error("invalid response");
        }
        refreshSession.norevealIndex = norevealIndex;
        yield ws.db.mutate(dbTypes.Stores.refreshGroups, refreshGroupId, (rg) => {
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const refreshGroup = yield ws.db.get(dbTypes.Stores.refreshGroups, refreshGroupId);
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
        const meltCoinRecord = yield ws.db.get(dbTypes.Stores.coins, refreshSession.meltCoinPub);
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
        let resp;
        try {
            resp = yield ws.http.postJson(reqUrl.href, req);
        }
        catch (e) {
            console.error("got error during /refresh/reveal request");
            console.error(e);
            return;
        }
        if (resp.status !== 200) {
            console.error("error: /refresh/reveal returned status " + resp.status);
            return;
        }
        const respJson = yield resp.json();
        if (!respJson.ev_sigs || !Array.isArray(respJson.ev_sigs)) {
            console.error("/refresh/reveal did not contain ev_sigs");
            return;
        }
        const coins = [];
        for (let i = 0; i < respJson.ev_sigs.length; i++) {
            const denom = yield ws.db.get(dbTypes.Stores.denominations, [
                refreshSession.exchangeBaseUrl,
                refreshSession.newDenoms[i],
            ]);
            if (!denom) {
                console.error("denom not found");
                continue;
            }
            const pc = refreshSession.planchetsForGammas[norevealIndex][i];
            const denomSig = yield ws.cryptoApi.rsaUnblind(respJson.ev_sigs[i].ev_sig, pc.blindingKey, denom.denomPub);
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
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.coins, dbTypes.Stores.refreshGroups], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rg = yield tx.get(dbTypes.Stores.refreshGroups, refreshGroupId);
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
            rs.finishedTimestamp = time.getTimestampNow();
            rg.finishedPerCoin[coinIndex] = true;
            let allDone = true;
            for (const f of rg.finishedPerCoin) {
                if (!f) {
                    allDone = false;
                    break;
                }
            }
            if (allDone) {
                rg.timestampFinished = time.getTimestampNow();
                rg.retryInfo = dbTypes.initRetryInfo(false);
            }
            for (const coin of coins) {
                yield tx.put(dbTypes.Stores.coins, coin);
            }
            yield tx.put(dbTypes.Stores.refreshGroups, rg);
        }));
        console.log("refresh finished (end of reveal)");
        ws.notify({
            type: "refresh-revealed" /* RefreshRevealed */,
        });
    });
}
function incrementRefreshRetry(ws, refreshGroupId, err) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.refreshGroups], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(dbTypes.Stores.refreshGroups, refreshGroupId);
            if (!r) {
                return;
            }
            if (!r.retryInfo) {
                return;
            }
            r.retryInfo.retryCounter++;
            dbTypes.updateRetryInfoTimeout(r.retryInfo);
            r.lastError = err;
            yield tx.put(dbTypes.Stores.refreshGroups, r);
        }));
        ws.notify({ type: "refresh-operation-error" /* RefreshOperationError */ });
    });
}
function processRefreshGroup(ws, refreshGroupId, forceNow = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.memoProcessRefresh.memo(refreshGroupId, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const onOpErr = (e) => incrementRefreshRetry(ws, refreshGroupId, e);
            return yield errors.guardOperationException(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield processRefreshGroupImpl(ws, refreshGroupId, forceNow); }), onOpErr);
        }));
    });
}
exports.processRefreshGroup = processRefreshGroup;
function resetRefreshGroupRetry(ws, refreshSessionId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(dbTypes.Stores.refreshGroups, refreshSessionId, (x) => {
            if (x.retryInfo.active) {
                x.retryInfo = dbTypes.initRetryInfo();
            }
            return x;
        });
    });
}
function processRefreshGroupImpl(ws, refreshGroupId, forceNow) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (forceNow) {
            yield resetRefreshGroupRetry(ws, refreshGroupId);
        }
        const refreshGroup = yield ws.db.get(dbTypes.Stores.refreshGroups, refreshGroupId);
        if (!refreshGroup) {
            return;
        }
        if (refreshGroup.timestampFinished) {
            return;
        }
        const ps = refreshGroup.oldCoinPubs.map((x, i) => processRefreshSession(ws, refreshGroupId, i));
        yield Promise.all(ps);
        logger.trace("refresh finished");
    });
}
function processRefreshSession(ws, refreshGroupId, coinIndex) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        logger.trace(`processing refresh session for coin ${coinIndex} of group ${refreshGroupId}`);
        let refreshGroup = yield ws.db.get(dbTypes.Stores.refreshGroups, refreshGroupId);
        if (!refreshGroup) {
            return;
        }
        if (refreshGroup.finishedPerCoin[coinIndex]) {
            return;
        }
        if (!refreshGroup.refreshSessionPerCoin[coinIndex]) {
            yield refreshCreateSession(ws, refreshGroupId, coinIndex);
            refreshGroup = yield ws.db.get(dbTypes.Stores.refreshGroups, refreshGroupId);
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
function createRefreshGroup(tx, oldCoinPubs, reason) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const refreshGroupId = talerCrypto.encodeCrock(talerCrypto.getRandomBytes(32));
        const refreshGroup = {
            timestampFinished: undefined,
            finishedPerCoin: oldCoinPubs.map((x) => false),
            lastError: undefined,
            lastErrorPerCoin: {},
            oldCoinPubs: oldCoinPubs.map((x) => x.coinPub),
            reason,
            refreshGroupId,
            refreshSessionPerCoin: oldCoinPubs.map((x) => undefined),
            retryInfo: dbTypes.initRetryInfo(),
        };
        yield tx.put(dbTypes.Stores.refreshGroups, refreshGroup);
        return {
            refreshGroupId,
        };
    });
}
exports.createRefreshGroup = createRefreshGroup;

});

unwrapExports(refresh);
var refresh_1 = refresh.getTotalRefreshCost;
var refresh_2 = refresh.processRefreshGroup;
var refresh_3 = refresh.createRefreshGroup;

var recoup = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });









function incrementRecoupRetry(ws, recoupGroupId, err) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.recoupGroups], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(dbTypes.Stores.recoupGroups, recoupGroupId);
            if (!r) {
                return;
            }
            if (!r.retryInfo) {
                return;
            }
            r.retryInfo.retryCounter++;
            dbTypes.updateRetryInfoTimeout(r.retryInfo);
            r.lastError = err;
            yield tx.put(dbTypes.Stores.recoupGroups, r);
        }));
        ws.notify({ type: "recoup-operation-error" /* RecoupOperationError */ });
    });
}
function putGroupAsFinished(ws, tx, recoupGroup, coinIdx) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            recoupGroup.timestampFinished = time.getTimestampNow();
            recoupGroup.retryInfo = dbTypes.initRetryInfo(false);
            recoupGroup.lastError = undefined;
            if (recoupGroup.scheduleRefreshCoins.length > 0) {
                const refreshGroupId = yield refresh.createRefreshGroup(tx, recoupGroup.scheduleRefreshCoins.map((x) => ({ coinPub: x })), "recoup" /* Recoup */);
                refresh.processRefreshGroup(ws, refreshGroupId.refreshGroupId).then((e) => {
                    console.error("error while refreshing after recoup", e);
                });
            }
        }
        yield tx.put(dbTypes.Stores.recoupGroups, recoupGroup);
    });
}
function recoupTipCoin(ws, recoupGroupId, coinIdx, coin) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // We can't really recoup a coin we got via tipping.
        // Thus we just put the coin to sleep.
        // FIXME: somehow report this to the user
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.recoupGroups], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const recoupGroup = yield tx.get(dbTypes.Stores.recoupGroups, recoupGroupId);
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const reservePub = cs.reservePub;
        const reserve = yield ws.db.get(dbTypes.Stores.reserves, reservePub);
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
        const recoupConfirmation = yield errors.scrutinizeTalerJsonResponse(resp, talerTypes.codecForRecoupConfirmation());
        if (recoupConfirmation.reserve_pub !== reservePub) {
            throw Error(`Coin's reserve doesn't match reserve on recoup`);
        }
        const exchange = yield ws.db.get(dbTypes.Stores.exchanges, coin.exchangeBaseUrl);
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
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.coins, dbTypes.Stores.reserves, dbTypes.Stores.recoupGroups], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const recoupGroup = yield tx.get(dbTypes.Stores.recoupGroups, recoupGroupId);
            if (!recoupGroup) {
                return;
            }
            if (recoupGroup.recoupFinishedPerCoin[coinIdx]) {
                return;
            }
            const updatedCoin = yield tx.get(dbTypes.Stores.coins, coin.coinPub);
            if (!updatedCoin) {
                return;
            }
            const updatedReserve = yield tx.get(dbTypes.Stores.reserves, reserve.reservePub);
            if (!updatedReserve) {
                return;
            }
            updatedCoin.status = "dormant" /* Dormant */;
            const currency = updatedCoin.currentAmount.currency;
            updatedCoin.currentAmount = amounts.Amounts.getZero(currency);
            updatedReserve.reserveStatus = dbTypes.ReserveRecordStatus.QUERYING_STATUS;
            yield tx.put(dbTypes.Stores.coins, updatedCoin);
            yield tx.put(dbTypes.Stores.reserves, updatedReserve);
            yield putGroupAsFinished(ws, tx, recoupGroup, coinIdx);
        }));
        ws.notify({
            type: "recoup-finished" /* RecoupFinished */,
        });
        reserves.forceQueryReserve(ws, reserve.reservePub).catch((e) => {
            console.log("re-querying reserve after recoup failed:", e);
        });
    });
}
function recoupRefreshCoin(ws, recoupGroupId, coinIdx, coin, cs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        ws.notify({
            type: "recoup-started" /* RecoupStarted */,
        });
        const recoupRequest = yield ws.cryptoApi.createRecoupRequest(coin);
        const reqUrl = new URL(`/coins/${coin.coinPub}/recoup`, coin.exchangeBaseUrl);
        console.log("making recoup request");
        const resp = yield ws.http.postJson(reqUrl.href, recoupRequest);
        const recoupConfirmation = yield errors.scrutinizeTalerJsonResponse(resp, talerTypes.codecForRecoupConfirmation());
        if (recoupConfirmation.old_coin_pub != cs.oldCoinPub) {
            throw Error(`Coin's oldCoinPub doesn't match reserve on recoup`);
        }
        const exchange = yield ws.db.get(dbTypes.Stores.exchanges, coin.exchangeBaseUrl);
        if (!exchange) {
            // FIXME: report inconsistency?
            return;
        }
        const exchangeDetails = exchange.details;
        if (!exchangeDetails) {
            // FIXME: report inconsistency?
            return;
        }
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.coins, dbTypes.Stores.reserves, dbTypes.Stores.recoupGroups, dbTypes.Stores.refreshGroups], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const recoupGroup = yield tx.get(dbTypes.Stores.recoupGroups, recoupGroupId);
            if (!recoupGroup) {
                return;
            }
            if (recoupGroup.recoupFinishedPerCoin[coinIdx]) {
                return;
            }
            const oldCoin = yield tx.get(dbTypes.Stores.coins, cs.oldCoinPub);
            const revokedCoin = yield tx.get(dbTypes.Stores.coins, coin.coinPub);
            if (!revokedCoin) {
                return;
            }
            if (!oldCoin) {
                return;
            }
            revokedCoin.status = "dormant" /* Dormant */;
            oldCoin.currentAmount = amounts.Amounts.add(oldCoin.currentAmount, recoupGroup.oldAmountPerCoin[coinIdx]).amount;
            console.log("recoup: setting old coin amount to", amounts.Amounts.stringify(oldCoin.currentAmount));
            recoupGroup.scheduleRefreshCoins.push(oldCoin.coinPub);
            yield tx.put(dbTypes.Stores.coins, revokedCoin);
            yield tx.put(dbTypes.Stores.coins, oldCoin);
            yield putGroupAsFinished(ws, tx, recoupGroup, coinIdx);
        }));
    });
}
function resetRecoupGroupRetry(ws, recoupGroupId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(dbTypes.Stores.recoupGroups, recoupGroupId, (x) => {
            if (x.retryInfo.active) {
                x.retryInfo = dbTypes.initRetryInfo();
            }
            return x;
        });
    });
}
function processRecoupGroup(ws, recoupGroupId, forceNow = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.memoProcessRecoup.memo(recoupGroupId, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const onOpErr = (e) => incrementRecoupRetry(ws, recoupGroupId, e);
            return yield errors.guardOperationException(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield processRecoupGroupImpl(ws, recoupGroupId, forceNow); }), onOpErr);
        }));
    });
}
exports.processRecoupGroup = processRecoupGroup;
function processRecoupGroupImpl(ws, recoupGroupId, forceNow = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (forceNow) {
            yield resetRecoupGroupRetry(ws, recoupGroupId);
        }
        console.log("in processRecoupGroupImpl");
        const recoupGroup = yield ws.db.get(dbTypes.Stores.recoupGroups, recoupGroupId);
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const recoupGroupId = talerCrypto.encodeCrock(talerCrypto.getRandomBytes(32));
        const recoupGroup = {
            recoupGroupId,
            coinPubs: coinPubs,
            lastError: undefined,
            timestampFinished: undefined,
            timestampStarted: time.getTimestampNow(),
            retryInfo: dbTypes.initRetryInfo(),
            recoupFinishedPerCoin: coinPubs.map(() => false),
            // Will be populated later
            oldAmountPerCoin: [],
            scheduleRefreshCoins: [],
        };
        for (let coinIdx = 0; coinIdx < coinPubs.length; coinIdx++) {
            const coinPub = coinPubs[coinIdx];
            const coin = yield tx.get(dbTypes.Stores.coins, coinPub);
            if (!coin) {
                yield putGroupAsFinished(ws, tx, recoupGroup, coinIdx);
                continue;
            }
            if (amounts.Amounts.isZero(coin.currentAmount)) {
                yield putGroupAsFinished(ws, tx, recoupGroup, coinIdx);
                continue;
            }
            recoupGroup.oldAmountPerCoin[coinIdx] = coin.currentAmount;
            coin.currentAmount = amounts.Amounts.getZero(coin.currentAmount.currency);
            yield tx.put(dbTypes.Stores.coins, coin);
        }
        yield tx.put(dbTypes.Stores.recoupGroups, recoupGroup);
        return recoupGroupId;
    });
}
exports.createRecoupGroup = createRecoupGroup;
function processRecoup(ws, recoupGroupId, coinIdx) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const recoupGroup = yield ws.db.get(dbTypes.Stores.recoupGroups, recoupGroupId);
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
        const coin = yield ws.db.get(dbTypes.Stores.coins, coinPub);
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

});

unwrapExports(recoup);
var recoup_1 = recoup.processRecoupGroup;
var recoup_2 = recoup.createRecoupGroup;

var exchanges = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });




const Amounts = tslib_1.__importStar(amounts);






function denominationRecordFromKeys(ws, exchangeBaseUrl, denomIn) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const denomPubHash = yield ws.cryptoApi.hashEncoded(denomIn.denom_pub);
        const d = {
            denomPub: denomIn.denom_pub,
            denomPubHash,
            exchangeBaseUrl,
            feeDeposit: Amounts.parseOrThrow(denomIn.fee_deposit),
            feeRefresh: Amounts.parseOrThrow(denomIn.fee_refresh),
            feeRefund: Amounts.parseOrThrow(denomIn.fee_refund),
            feeWithdraw: Amounts.parseOrThrow(denomIn.fee_withdraw),
            isOffered: true,
            isRevoked: false,
            masterSig: denomIn.master_sig,
            stampExpireDeposit: denomIn.stamp_expire_deposit,
            stampExpireLegal: denomIn.stamp_expire_legal,
            stampExpireWithdraw: denomIn.stamp_expire_withdraw,
            stampStart: denomIn.stamp_start,
            status: dbTypes.DenominationStatus.Unverified,
            value: Amounts.parseOrThrow(denomIn.value),
        };
        return d;
    });
}
function setExchangeError(ws, baseUrl, err) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log(`last error for exchange ${baseUrl}:`, err);
        const mut = (exchange) => {
            exchange.lastError = err;
            return exchange;
        };
        yield ws.db.mutate(dbTypes.Stores.exchanges, baseUrl, mut);
    });
}
/**
 * Fetch the exchange's /keys and update our database accordingly.
 *
 * Exceptions thrown in this method must be caught and reported
 * in the pending operations.
 */
function updateExchangeWithKeys(ws, baseUrl) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const existingExchangeRecord = yield ws.db.get(dbTypes.Stores.exchanges, baseUrl);
        if ((existingExchangeRecord === null || existingExchangeRecord === void 0 ? void 0 : existingExchangeRecord.updateStatus) != "fetch-keys" /* FetchKeys */) {
            return;
        }
        const keysUrl = new URL("keys", baseUrl);
        keysUrl.searchParams.set("cacheBreaker", versions.WALLET_CACHE_BREAKER_CLIENT_VERSION);
        let keysResp;
        try {
            const r = yield ws.http.get(keysUrl.href);
            if (r.status !== 200) {
                throw Error(`unexpected status for keys: ${r.status}`);
            }
            keysResp = yield r.json();
        }
        catch (e) {
            const m = `Fetching keys failed: ${e.message}`;
            const opErr = {
                type: "network",
                details: {
                    requestUrl: (_a = e.config) === null || _a === void 0 ? void 0 : _a.url,
                },
                message: m,
            };
            yield setExchangeError(ws, baseUrl, opErr);
            throw new errors.OperationFailedAndReportedError(opErr);
        }
        let exchangeKeysJson;
        try {
            exchangeKeysJson = talerTypes.codecForExchangeKeysJson().decode(keysResp);
        }
        catch (e) {
            const m = `Parsing /keys response failed: ${e.message}`;
            const opErr = {
                type: "protocol-violation",
                details: {},
                message: m,
            };
            yield setExchangeError(ws, baseUrl, opErr);
            throw new errors.OperationFailedAndReportedError(opErr);
        }
        const lastUpdateTimestamp = exchangeKeysJson.list_issue_date;
        if (!lastUpdateTimestamp) {
            const m = `Parsing /keys response failed: invalid list_issue_date.`;
            const opErr = {
                type: "protocol-violation",
                details: {},
                message: m,
            };
            yield setExchangeError(ws, baseUrl, opErr);
            throw new errors.OperationFailedAndReportedError(opErr);
        }
        if (exchangeKeysJson.denoms.length === 0) {
            const m = "exchange doesn't offer any denominations";
            const opErr = {
                type: "protocol-violation",
                details: {},
                message: m,
            };
            yield setExchangeError(ws, baseUrl, opErr);
            throw new errors.OperationFailedAndReportedError(opErr);
        }
        const protocolVersion = exchangeKeysJson.version;
        if (!protocolVersion) {
            const m = "outdate exchange, no version in /keys response";
            const opErr = {
                type: "protocol-violation",
                details: {},
                message: m,
            };
            yield setExchangeError(ws, baseUrl, opErr);
            throw new errors.OperationFailedAndReportedError(opErr);
        }
        const versionRes = libtoolVersion.compare(versions.WALLET_EXCHANGE_PROTOCOL_VERSION, protocolVersion);
        if ((versionRes === null || versionRes === void 0 ? void 0 : versionRes.compatible) != true) {
            const m = "exchange protocol version not compatible with wallet";
            const opErr = {
                type: "protocol-incompatible",
                details: {
                    exchangeProtocolVersion: protocolVersion,
                    walletProtocolVersion: versions.WALLET_EXCHANGE_PROTOCOL_VERSION,
                },
                message: m,
            };
            yield setExchangeError(ws, baseUrl, opErr);
            throw new errors.OperationFailedAndReportedError(opErr);
        }
        const currency = Amounts.parseOrThrow(exchangeKeysJson.denoms[0].value)
            .currency;
        const newDenominations = yield Promise.all(exchangeKeysJson.denoms.map((d) => denominationRecordFromKeys(ws, baseUrl, d)));
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.exchanges, dbTypes.Stores.denominations, dbTypes.Stores.recoupGroups, dbTypes.Stores.coins], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _b;
            const r = yield tx.get(dbTypes.Stores.exchanges, baseUrl);
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
            yield tx.put(dbTypes.Stores.exchanges, r);
            for (const newDenom of newDenominations) {
                const oldDenom = yield tx.get(dbTypes.Stores.denominations, [
                    baseUrl,
                    newDenom.denomPub,
                ]);
                if (oldDenom) ;
                else {
                    yield tx.put(dbTypes.Stores.denominations, newDenom);
                }
            }
            // Handle recoup
            const recoupDenomList = (_b = exchangeKeysJson.recoup) !== null && _b !== void 0 ? _b : [];
            const newlyRevokedCoinPubs = [];
            console.log("recoup list from exchange", recoupDenomList);
            for (const recoupInfo of recoupDenomList) {
                const oldDenom = yield tx.getIndexed(dbTypes.Stores.denominations.denomPubHashIndex, recoupInfo.h_denom_pub);
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
                yield tx.put(dbTypes.Stores.denominations, oldDenom);
                const affectedCoins = yield tx
                    .iterIndexed(dbTypes.Stores.coins.denomPubHashIndex, recoupInfo.h_denom_pub)
                    .toArray();
                for (const ac of affectedCoins) {
                    newlyRevokedCoinPubs.push(ac.coinPub);
                }
            }
            if (newlyRevokedCoinPubs.length != 0) {
                console.log("recouping coins", newlyRevokedCoinPubs);
                yield recoup.createRecoupGroup(ws, tx, newlyRevokedCoinPubs);
            }
        }));
    });
}
function updateExchangeFinalize(ws, exchangeBaseUrl) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const exchange = yield ws.db.get(dbTypes.Stores.exchanges, exchangeBaseUrl);
        if (!exchange) {
            return;
        }
        if (exchange.updateStatus != "finalize-update" /* FinalizeUpdate */) {
            return;
        }
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.exchanges, dbTypes.Stores.exchangeUpdatedEvents], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(dbTypes.Stores.exchanges, exchangeBaseUrl);
            if (!r) {
                return;
            }
            if (r.updateStatus != "finalize-update" /* FinalizeUpdate */) {
                return;
            }
            r.updateStatus = "finished" /* Finished */;
            yield tx.put(dbTypes.Stores.exchanges, r);
            const updateEvent = {
                exchangeBaseUrl: exchange.baseUrl,
                timestamp: time.getTimestampNow(),
            };
            yield tx.put(dbTypes.Stores.exchangeUpdatedEvents, updateEvent);
        }));
    });
}
function updateExchangeWithTermsOfService(ws, exchangeBaseUrl) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const exchange = yield ws.db.get(dbTypes.Stores.exchanges, exchangeBaseUrl);
        if (!exchange) {
            return;
        }
        if (exchange.updateStatus != "fetch-terms" /* FetchTerms */) {
            return;
        }
        const reqUrl = new URL("terms", exchangeBaseUrl);
        reqUrl.searchParams.set("cacheBreaker", versions.WALLET_CACHE_BREAKER_CLIENT_VERSION);
        const headers = {
            Accept: "text/plain",
        };
        const resp = yield ws.http.get(reqUrl.href, { headers });
        if (resp.status !== 200) {
            throw Error(`/terms response has unexpected status code (${resp.status})`);
        }
        const tosText = yield resp.text();
        const tosEtag = resp.headers.get("etag") || undefined;
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.exchanges], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(dbTypes.Stores.exchanges, exchangeBaseUrl);
            if (!r) {
                return;
            }
            if (r.updateStatus != "fetch-terms" /* FetchTerms */) {
                return;
            }
            r.termsOfServiceText = tosText;
            r.termsOfServiceLastEtag = tosEtag;
            r.updateStatus = "finalize-update" /* FinalizeUpdate */;
            yield tx.put(dbTypes.Stores.exchanges, r);
        }));
    });
}
function acceptExchangeTermsOfService(ws, exchangeBaseUrl, etag) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.exchanges], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(dbTypes.Stores.exchanges, exchangeBaseUrl);
            if (!r) {
                return;
            }
            r.termsOfServiceAcceptedEtag = etag;
            r.termsOfServiceAcceptedTimestamp = time.getTimestampNow();
            yield tx.put(dbTypes.Stores.exchanges, r);
        }));
    });
}
exports.acceptExchangeTermsOfService = acceptExchangeTermsOfService;
/**
 * Fetch wire information for an exchange and store it in the database.
 *
 * @param exchangeBaseUrl Exchange base URL, assumed to be already normalized.
 */
function updateExchangeWithWireInfo(ws, exchangeBaseUrl) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const exchange = yield ws.db.get(dbTypes.Stores.exchanges, exchangeBaseUrl);
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
        reqUrl.searchParams.set("cacheBreaker", versions.WALLET_CACHE_BREAKER_CLIENT_VERSION);
        const resp = yield ws.http.get(reqUrl.href);
        if (resp.status !== 200) {
            throw Error(`/wire response has unexpected status code (${resp.status})`);
        }
        const wiJson = yield resp.json();
        if (!wiJson) {
            throw Error("/wire response malformed");
        }
        const wireInfo = talerTypes.codecForExchangeWireJson().decode(wiJson);
        for (const a of wireInfo.accounts) {
            console.log("validating exchange acct");
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
                    closingFee: Amounts.parseOrThrow(x.closing_fee),
                    endStamp,
                    sig: x.sig,
                    startStamp,
                    wireFee: Amounts.parseOrThrow(x.wire_fee),
                };
                const isValid = yield ws.cryptoApi.isValidWireFee(wireMethod, fee, details.masterPublicKey);
                if (!isValid) {
                    throw Error("exchange wire fee signature invalid");
                }
                feeList.push(fee);
            }
            feesForType[wireMethod] = feeList;
        }
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.exchanges], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const r = yield tx.get(dbTypes.Stores.exchanges, exchangeBaseUrl);
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
            yield tx.put(dbTypes.Stores.exchanges, r);
        }));
    });
}
function updateExchangeFromUrl(ws, baseUrl, forceNow = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const onOpErr = (e) => setExchangeError(ws, baseUrl, e);
        return yield errors.guardOperationException(() => updateExchangeFromUrlImpl(ws, baseUrl, forceNow), onOpErr);
    });
}
exports.updateExchangeFromUrl = updateExchangeFromUrl;
/**
 * Update or add exchange DB entry by fetching the /keys and /wire information.
 * Optionally link the reserve entry to the new or existing
 * exchange entry in then DB.
 */
function updateExchangeFromUrlImpl(ws, baseUrl, forceNow = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const now = time.getTimestampNow();
        baseUrl = helpers.canonicalizeBaseUrl(baseUrl);
        const r = yield ws.db.get(dbTypes.Stores.exchanges, baseUrl);
        if (!r) {
            const newExchangeRecord = {
                builtIn: false,
                baseUrl: baseUrl,
                details: undefined,
                wireInfo: undefined,
                updateStatus: "fetch-keys" /* FetchKeys */,
                updateStarted: now,
                updateReason: "initial" /* Initial */,
                timestampAdded: time.getTimestampNow(),
                termsOfServiceAcceptedEtag: undefined,
                termsOfServiceAcceptedTimestamp: undefined,
                termsOfServiceLastEtag: undefined,
                termsOfServiceText: undefined,
                updateDiff: undefined,
            };
            yield ws.db.put(dbTypes.Stores.exchanges, newExchangeRecord);
        }
        else {
            yield ws.db.runWithWriteTransaction([dbTypes.Stores.exchanges], (t) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const rec = yield t.get(dbTypes.Stores.exchanges, baseUrl);
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
                t.put(dbTypes.Stores.exchanges, rec);
            }));
        }
        yield updateExchangeWithKeys(ws, baseUrl);
        yield updateExchangeWithWireInfo(ws, baseUrl);
        yield updateExchangeWithTermsOfService(ws, baseUrl);
        yield updateExchangeFinalize(ws, baseUrl);
        const updatedExchange = yield ws.db.get(dbTypes.Stores.exchanges, baseUrl);
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let isTrusted = false;
        let isAudited = false;
        const exchangeDetails = exchangeInfo.details;
        if (!exchangeDetails) {
            throw Error(`exchange ${exchangeInfo.baseUrl} details not available`);
        }
        const currencyRecord = yield ws.db.get(dbTypes.Stores.currencies, exchangeDetails.currency);
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
exports.getExchangeTrust = getExchangeTrust;
function getExchangePaytoUri(ws, exchangeBaseUrl, supportedTargetTypes) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            const res = payto.parsePaytoUri(account.payto_uri);
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
exports.getExchangePaytoUri = getExchangePaytoUri;

});

unwrapExports(exchanges);
var exchanges_1 = exchanges.acceptExchangeTermsOfService;
var exchanges_2 = exchanges.updateExchangeFromUrl;
var exchanges_3 = exchanges.getExchangeTrust;
var exchanges_4 = exchanges.getExchangePaytoUri;

var withdraw = createCommonjsModule(function (module, exports) {
/*
 This file is part of GNU Taler
 (C) 2019-2029 Taler Systems SA

 GNU Taler is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 GNU Taler is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 GNU Taler; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */
Object.defineProperty(exports, "__esModule", { value: true });








const LibtoolVersion = tslib_1.__importStar(libtoolVersion);


const logger = new logging.Logger("withdraw.ts");
function isWithdrawableDenom(d) {
    const now = time.getTimestampNow();
    const started = time.timestampCmp(now, d.stampStart) >= 0;
    const lastPossibleWithdraw = time.timestampSubtractDuraction(d.stampExpireWithdraw, { d_ms: 50 * 1000 });
    const remaining = time.getDurationRemaining(lastPossibleWithdraw, now);
    const stillOkay = remaining.d_ms !== 0;
    return started && stillOkay && !d.isRevoked;
}
/**
 * Get a list of denominations (with repetitions possible)
 * whose total value is as close as possible to the available
 * amount, but never larger.
 */
function getWithdrawDenomList(amountAvailable, denoms) {
    let remaining = amounts.Amounts.copy(amountAvailable);
    const selectedDenoms = [];
    let totalCoinValue = amounts.Amounts.getZero(amountAvailable.currency);
    let totalWithdrawCost = amounts.Amounts.getZero(amountAvailable.currency);
    denoms = denoms.filter(isWithdrawableDenom);
    denoms.sort((d1, d2) => amounts.Amounts.cmp(d2.value, d1.value));
    for (const d of denoms) {
        let count = 0;
        const cost = amounts.Amounts.add(d.value, d.feeWithdraw).amount;
        for (;;) {
            if (amounts.Amounts.cmp(remaining, cost) < 0) {
                break;
            }
            remaining = amounts.Amounts.sub(remaining, cost).amount;
            count++;
        }
        if (count > 0) {
            totalCoinValue = amounts.Amounts.add(totalCoinValue, amounts.Amounts.mult(d.value, count).amount).amount;
            totalWithdrawCost = amounts.Amounts.add(totalWithdrawCost, amounts.Amounts.mult(cost, count).amount).amount;
            selectedDenoms.push({
                count,
                denom: d,
            });
        }
        if (amounts.Amounts.isZero(remaining)) {
            break;
        }
    }
    return {
        selectedDenoms,
        totalCoinValue,
        totalWithdrawCost,
    };
}
exports.getWithdrawDenomList = getWithdrawDenomList;
/**
 * Get information about a withdrawal from
 * a taler://withdraw URI by asking the bank.
 */
function getBankWithdrawalInfo(ws, talerWithdrawUri) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const uriResult = taleruri.parseWithdrawUri(talerWithdrawUri);
        if (!uriResult) {
            throw Error(`can't parse URL ${talerWithdrawUri}`);
        }
        const resp = yield ws.http.get(uriResult.statusUrl);
        if (resp.status !== 200) {
            throw Error(`unexpected status (${resp.status}) from bank for ${uriResult.statusUrl}`);
        }
        const respJson = yield resp.json();
        console.log("resp:", respJson);
        const status = talerTypes.codecForWithdrawOperationStatusResponse().decode(respJson);
        return {
            amount: amounts.Amounts.parseOrThrow(status.amount),
            confirmTransferUrl: status.confirm_transfer_url,
            extractedStatusUrl: uriResult.statusUrl,
            selectionDone: status.selection_done,
            senderWire: status.sender_wire,
            suggestedExchange: status.suggested_exchange,
            transferDone: status.transfer_done,
            wireTypes: status.wire_types,
        };
    });
}
exports.getBankWithdrawalInfo = getBankWithdrawalInfo;
function getPossibleDenoms(ws, exchangeBaseUrl) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return yield ws.db
            .iterIndex(dbTypes.Stores.denominations.exchangeBaseUrlIndex, exchangeBaseUrl)
            .filter((d) => {
            return ((d.status === dbTypes.DenominationStatus.Unverified ||
                d.status === dbTypes.DenominationStatus.VerifiedGood) &&
                !d.isRevoked);
        });
    });
}
/**
 * Given a planchet, withdraw a coin from the exchange.
 */
function processPlanchet(ws, withdrawalGroupId, coinIdx) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const withdrawalGroup = yield ws.db.get(dbTypes.Stores.withdrawalGroups, withdrawalGroupId);
        if (!withdrawalGroup) {
            return;
        }
        let planchet = yield ws.db.getIndexed(dbTypes.Stores.planchets.byGroupAndIndex, [
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
            const denom = yield ws.db.getIndexed(dbTypes.Stores.denominations.denomPubHashIndex, denomPubHash);
            if (!denom) {
                throw Error("invariant violated");
            }
            if (withdrawalGroup.source.type != "reserve" /* Reserve */) {
                throw Error("invariant violated");
            }
            const reserve = yield ws.db.get(dbTypes.Stores.reserves, withdrawalGroup.source.reservePub);
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
            yield ws.db.runWithWriteTransaction([dbTypes.Stores.planchets], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const p = yield tx.getIndexed(dbTypes.Stores.planchets.byGroupAndIndex, [
                    withdrawalGroupId,
                    coinIdx,
                ]);
                if (p) {
                    planchet = p;
                    return;
                }
                yield tx.put(dbTypes.Stores.planchets, newPlanchet);
                planchet = newPlanchet;
            }));
        }
        if (!planchet) {
            throw Error("invariant violated");
        }
        if (planchet.withdrawalDone) {
            console.log("processPlanchet: planchet already withdrawn");
            return;
        }
        const exchange = yield ws.db.get(dbTypes.Stores.exchanges, withdrawalGroup.exchangeBaseUrl);
        if (!exchange) {
            console.error("db inconsistent: exchange for planchet not found");
            return;
        }
        const denom = yield ws.db.get(dbTypes.Stores.denominations, [
            withdrawalGroup.exchangeBaseUrl,
            planchet.denomPub,
        ]);
        if (!denom) {
            console.error("db inconsistent: denom for planchet not found");
            return;
        }
        logger.trace(`processing planchet #${coinIdx} in withdrawal ${withdrawalGroupId}`);
        const wd = {};
        wd.denom_pub_hash = planchet.denomPubHash;
        wd.reserve_pub = planchet.reservePub;
        wd.reserve_sig = planchet.withdrawSig;
        wd.coin_ev = planchet.coinEv;
        const reqUrl = new URL(`reserves/${planchet.reservePub}/withdraw`, exchange.baseUrl).href;
        const resp = yield ws.http.postJson(reqUrl, wd);
        const r = yield errors.scrutinizeTalerJsonResponse(resp, talerTypes.codecForWithdrawResponse());
        logger.trace(`got response for /withdraw`);
        const denomSig = yield ws.cryptoApi.rsaUnblind(r.ev_sig, planchet.blindingKey, planchet.denomPub);
        const isValid = yield ws.cryptoApi.rsaVerify(planchet.coinPub, denomSig, planchet.denomPub);
        if (!isValid) {
            throw Error("invalid RSA signature by the exchange");
        }
        logger.trace(`unblinded and verified`);
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
        const success = yield ws.db.runWithWriteTransaction([dbTypes.Stores.coins, dbTypes.Stores.withdrawalGroups, dbTypes.Stores.reserves, dbTypes.Stores.planchets], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ws = yield tx.get(dbTypes.Stores.withdrawalGroups, withdrawalGroupId);
            if (!ws) {
                return false;
            }
            const p = yield tx.get(dbTypes.Stores.planchets, planchetCoinPub);
            if (!p) {
                return false;
            }
            if (p.withdrawalDone) {
                // Already withdrawn
                return false;
            }
            p.withdrawalDone = true;
            yield tx.put(dbTypes.Stores.planchets, p);
            let numTotal = 0;
            for (const ds of ws.denomsSel.selectedDenoms) {
                numTotal += ds.count;
            }
            let numDone = 0;
            yield tx
                .iterIndexed(dbTypes.Stores.planchets.byGroup, withdrawalGroupId)
                .forEach((x) => {
                if (x.withdrawalDone) {
                    numDone++;
                }
            });
            if (numDone > numTotal) {
                throw Error("invariant violated (created more planchets than expected)");
            }
            if (numDone == numTotal) {
                ws.timestampFinish = time.getTimestampNow();
                ws.lastError = undefined;
                ws.retryInfo = dbTypes.initRetryInfo(false);
                withdrawalGroupFinished = true;
            }
            yield tx.put(dbTypes.Stores.withdrawalGroups, ws);
            yield tx.add(dbTypes.Stores.coins, coin);
            return true;
        }));
        logger.trace(`withdrawal result stored in DB`);
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
/**
 * Get a list of denominations to withdraw from the given exchange for the
 * given amount, making sure that all denominations' signatures are verified.
 *
 * Writes to the DB in order to record the result from verifying
 * denominations.
 */
function getVerifiedWithdrawDenomList(ws, exchangeBaseUrl, amount) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const exchange = yield ws.db.get(dbTypes.Stores.exchanges, exchangeBaseUrl);
        if (!exchange) {
            console.log("exchange not found");
            throw Error(`exchange ${exchangeBaseUrl} not found`);
        }
        const exchangeDetails = exchange.details;
        if (!exchangeDetails) {
            console.log("exchange details not available");
            throw Error(`exchange ${exchangeBaseUrl} details not available`);
        }
        console.log("getting possible denoms");
        const possibleDenoms = yield getPossibleDenoms(ws, exchange.baseUrl);
        console.log("got possible denoms");
        let allValid = false;
        let selectedDenoms;
        do {
            allValid = true;
            selectedDenoms = getWithdrawDenomList(amount, possibleDenoms);
            console.log("got withdraw denom list");
            for (const denomSel of selectedDenoms.selectedDenoms) {
                const denom = denomSel.denom;
                if (denom.status === dbTypes.DenominationStatus.Unverified) {
                    const valid = yield ws.cryptoApi.isValidDenom(denom, exchangeDetails.masterPublicKey);
                    if (!valid) {
                        denom.status = dbTypes.DenominationStatus.VerifiedBad;
                        allValid = false;
                    }
                    else {
                        denom.status = dbTypes.DenominationStatus.VerifiedGood;
                    }
                    yield ws.db.put(dbTypes.Stores.denominations, denom);
                }
            }
        } while (selectedDenoms.selectedDenoms.length > 0 && !allValid);
        console.log("returning denoms");
        return selectedDenoms;
    });
}
exports.getVerifiedWithdrawDenomList = getVerifiedWithdrawDenomList;
function incrementWithdrawalRetry(ws, withdrawalGroupId, err) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.withdrawalGroups], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const wsr = yield tx.get(dbTypes.Stores.withdrawalGroups, withdrawalGroupId);
            if (!wsr) {
                return;
            }
            if (!wsr.retryInfo) {
                return;
            }
            wsr.retryInfo.retryCounter++;
            dbTypes.updateRetryInfoTimeout(wsr.retryInfo);
            wsr.lastError = err;
            yield tx.put(dbTypes.Stores.withdrawalGroups, wsr);
        }));
        ws.notify({ type: "withdraw-error" /* WithdrawOperationError */ });
    });
}
function processWithdrawGroup(ws, withdrawalGroupId, forceNow = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const onOpErr = (e) => incrementWithdrawalRetry(ws, withdrawalGroupId, e);
        yield errors.guardOperationException(() => processWithdrawGroupImpl(ws, withdrawalGroupId, forceNow), onOpErr);
    });
}
exports.processWithdrawGroup = processWithdrawGroup;
function resetWithdrawalGroupRetry(ws, withdrawalGroupId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(dbTypes.Stores.withdrawalGroups, withdrawalGroupId, (x) => {
            if (x.retryInfo.active) {
                x.retryInfo = dbTypes.initRetryInfo();
            }
            return x;
        });
    });
}
function processInBatches(workGen, batchSize) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            logger.trace(`processing withdrawal batch of ${batch.length} elements`);
            yield Promise.all(batch);
        }
    });
}
function processWithdrawGroupImpl(ws, withdrawalGroupId, forceNow) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        logger.trace("processing withdraw group", withdrawalGroupId);
        if (forceNow) {
            yield resetWithdrawalGroupRetry(ws, withdrawalGroupId);
        }
        const withdrawalGroup = yield ws.db.get(dbTypes.Stores.withdrawalGroups, withdrawalGroupId);
        if (!withdrawalGroup) {
            logger.trace("withdraw session doesn't exist");
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const exchangeInfo = yield exchanges.updateExchangeFromUrl(ws, baseUrl);
        const exchangeDetails = exchangeInfo.details;
        if (!exchangeDetails) {
            throw Error(`exchange ${exchangeInfo.baseUrl} details not available`);
        }
        const exchangeWireInfo = exchangeInfo.wireInfo;
        if (!exchangeWireInfo) {
            throw Error(`exchange ${exchangeInfo.baseUrl} wire details not available`);
        }
        const selectedDenoms = yield getVerifiedWithdrawDenomList(ws, baseUrl, amount);
        const exchangeWireAccounts = [];
        for (const account of exchangeWireInfo.accounts) {
            exchangeWireAccounts.push(account.payto_uri);
        }
        const { isTrusted, isAudited } = yield exchanges.getExchangeTrust(ws, exchangeInfo);
        let earliestDepositExpiration = selectedDenoms.selectedDenoms[0].denom.stampExpireDeposit;
        for (let i = 1; i < selectedDenoms.selectedDenoms.length; i++) {
            const expireDeposit = selectedDenoms.selectedDenoms[i].denom.stampExpireDeposit;
            if (expireDeposit.t_ms < earliestDepositExpiration.t_ms) {
                earliestDepositExpiration = expireDeposit;
            }
        }
        const possibleDenoms = yield ws.db
            .iterIndex(dbTypes.Stores.denominations.exchangeBaseUrlIndex, baseUrl)
            .filter((d) => d.isOffered);
        const trustedAuditorPubs = [];
        const currencyRecord = yield ws.db.get(dbTypes.Stores.currencies, amount.currency);
        if (currencyRecord) {
            trustedAuditorPubs.push(...currencyRecord.auditors.map((a) => a.auditorPub));
        }
        let versionMatch;
        if (exchangeDetails.protocolVersion) {
            versionMatch = LibtoolVersion.compare(versions.WALLET_EXCHANGE_PROTOCOL_VERSION, exchangeDetails.protocolVersion);
            if (versionMatch &&
                !versionMatch.compatible &&
                versionMatch.currentCmp === -1) {
                console.warn(`wallet's support for exchange protocol version ${versions.WALLET_EXCHANGE_PROTOCOL_VERSION} might be outdated ` +
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
        const withdrawFee = amounts.Amounts.sub(selectedDenoms.totalWithdrawCost, selectedDenoms.totalCoinValue).amount;
        const ret = {
            earliestDepositExpiration,
            exchangeInfo,
            exchangeWireAccounts,
            exchangeVersion: exchangeDetails.protocolVersion || "unknown",
            isAudited,
            isTrusted,
            numOfferedDenoms: possibleDenoms.length,
            overhead: amounts.Amounts.sub(amount, selectedDenoms.totalWithdrawCost).amount,
            selectedDenoms,
            trustedAuditorPubs,
            versionMatch,
            walletVersion: versions.WALLET_EXCHANGE_PROTOCOL_VERSION,
            wireFees: exchangeWireInfo,
            withdrawFee,
            termsOfServiceAccepted: tosAccepted,
        };
        return ret;
    });
}
exports.getExchangeWithdrawalInfo = getExchangeWithdrawalInfo;
function getWithdrawDetailsForUri(ws, talerWithdrawUri, maybeSelectedExchange) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const info = yield getBankWithdrawalInfo(ws, talerWithdrawUri);
        let rci = undefined;
        if (maybeSelectedExchange) {
            rci = yield getExchangeWithdrawalInfo(ws, maybeSelectedExchange, info.amount);
        }
        return {
            bankWithdrawDetails: info,
            exchangeWithdrawDetails: rci,
        };
    });
}
exports.getWithdrawDetailsForUri = getWithdrawDetailsForUri;

});

unwrapExports(withdraw);
var withdraw_1 = withdraw.getWithdrawDenomList;
var withdraw_2 = withdraw.getBankWithdrawalInfo;
var withdraw_3 = withdraw.getVerifiedWithdrawDenomList;
var withdraw_4 = withdraw.processWithdrawGroup;
var withdraw_5 = withdraw.getExchangeWithdrawalInfo;
var withdraw_6 = withdraw.getWithdrawDetailsForUri;

var pay = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Implementation of the payment operation, including downloading and
 * claiming of proposals.
 *
 * @author Florian Dold
 */
/**
 * Imports.
 */



const Amounts = tslib_1.__importStar(amounts);






/**
 * Logger.
 */
const logger = new logging.Logger("pay.ts");
/**
 * Compute the total cost of a payment to the customer.
 *
 * This includes the amount taken by the merchant, fees (wire/deposit) contributed
 * by the customer, refreshing fees, fees for withdraw-after-refresh and "trimmings"
 * of coins that are too small to spend.
 */
function getTotalPaymentCost(ws, pcs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const costs = [
            pcs.paymentAmount,
            pcs.customerDepositFees,
            pcs.customerWireFees,
        ];
        for (let i = 0; i < pcs.coinPubs.length; i++) {
            const coin = yield ws.db.get(dbTypes.Stores.coins, pcs.coinPubs[i]);
            if (!coin) {
                throw Error("can't calculate payment cost, coin not found");
            }
            const denom = yield ws.db.get(dbTypes.Stores.denominations, [
                coin.exchangeBaseUrl,
                coin.denomPub,
            ]);
            if (!denom) {
                throw Error("can't calculate payment cost, denomination for coin not found");
            }
            const allDenoms = yield ws.db
                .iterIndex(dbTypes.Stores.denominations.exchangeBaseUrlIndex, coin.exchangeBaseUrl)
                .toArray();
            const amountLeft = Amounts.sub(denom.value, pcs.coinContributions[i])
                .amount;
            const refreshCost = refresh.getTotalRefreshCost(allDenoms, denom, amountLeft);
            costs.push(refreshCost);
        }
        return {
            totalCost: Amounts.sum(costs).amount
        };
    });
}
exports.getTotalPaymentCost = getTotalPaymentCost;
/**
 * Given a list of available coins, select coins to spend under the merchant's
 * constraints.
 *
 * This function is only exported for the sake of unit tests.
 */
function selectPayCoins(acis, paymentAmount, depositFeeLimit) {
    if (acis.length === 0) {
        return undefined;
    }
    const coinPubs = [];
    const coinContributions = [];
    // Sort by available amount (descending),  deposit fee (ascending) and
    // denomPub (ascending) if deposit fee is the same
    // (to guarantee deterministic results)
    acis.sort((o1, o2) => -Amounts.cmp(o1.availableAmount, o2.availableAmount) ||
        Amounts.cmp(o1.feeDeposit, o2.feeDeposit) ||
        helpers.strcmp(o1.denomPub, o2.denomPub));
    const currency = paymentAmount.currency;
    let totalFees = Amounts.getZero(currency);
    let amountPayRemaining = paymentAmount;
    let amountDepositFeeLimitRemaining = depositFeeLimit;
    const customerWireFees = Amounts.getZero(currency);
    const customerDepositFees = Amounts.getZero(currency);
    for (const aci of acis) {
        // Don't use this coin if depositing it is more expensive than
        // the amount it would give the merchant.
        if (Amounts.cmp(aci.feeDeposit, aci.availableAmount) >= 0) {
            continue;
        }
        if (amountPayRemaining.value === 0 && amountPayRemaining.fraction === 0) {
            // We have spent enough!
            break;
        }
        // How much does the user spend on deposit fees for this coin?
        const depositFeeSpend = Amounts.sub(aci.feeDeposit, amountDepositFeeLimitRemaining).amount;
        if (Amounts.isZero(depositFeeSpend)) {
            // Fees are still covered by the merchant.
            amountDepositFeeLimitRemaining = Amounts.sub(amountDepositFeeLimitRemaining, aci.feeDeposit).amount;
        }
        else {
            amountDepositFeeLimitRemaining = Amounts.getZero(currency);
        }
        let coinSpend;
        const amountActualAvailable = Amounts.sub(aci.availableAmount, depositFeeSpend).amount;
        if (Amounts.cmp(amountActualAvailable, amountPayRemaining) > 0) {
            // Partial spending, as the coin is worth more than the remaining
            // amount to pay.
            coinSpend = Amounts.add(amountPayRemaining, depositFeeSpend).amount;
            // Make sure we contribute at least the deposit fee, otherwise
            // contributing this coin would cause a loss for the merchant.
            if (Amounts.cmp(coinSpend, aci.feeDeposit) < 0) {
                coinSpend = aci.feeDeposit;
            }
            amountPayRemaining = Amounts.getZero(currency);
        }
        else {
            // Spend the full remaining amount on the coin
            coinSpend = aci.availableAmount;
            amountPayRemaining = Amounts.add(amountPayRemaining, depositFeeSpend)
                .amount;
            amountPayRemaining = Amounts.sub(amountPayRemaining, aci.availableAmount)
                .amount;
        }
        coinPubs.push(aci.coinPub);
        coinContributions.push(coinSpend);
        totalFees = Amounts.add(totalFees, depositFeeSpend).amount;
    }
    if (Amounts.isZero(amountPayRemaining)) {
        return {
            paymentAmount,
            coinContributions,
            coinPubs,
            customerDepositFees,
            customerWireFees,
        };
    }
    return undefined;
}
exports.selectPayCoins = selectPayCoins;
/**
 * Select coins from the wallet's database that can be used
 * to pay for the given contract.
 *
 * If payment is impossible, undefined is returned.
 */
function getCoinsForPayment(ws, contractData) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let remainingAmount = contractData.amount;
        const exchanges = yield ws.db.iter(dbTypes.Stores.exchanges).toArray();
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
                .iterIndex(dbTypes.Stores.coins.exchangeBaseUrlIndex, exchange.baseUrl)
                .toArray();
            if (!coins || coins.length === 0) {
                continue;
            }
            // Denomination of the first coin, we assume that all other
            // coins have the same currency
            const firstDenom = yield ws.db.get(dbTypes.Stores.denominations, [
                exchange.baseUrl,
                coins[0].denomPub,
            ]);
            if (!firstDenom) {
                throw Error("db inconsistent");
            }
            const currency = firstDenom.value.currency;
            const acis = [];
            for (const coin of coins) {
                const denom = yield ws.db.get(dbTypes.Stores.denominations, [
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
            let totalFees = Amounts.getZero(currency);
            let wireFee;
            for (const fee of exchangeFees.feesForType[contractData.wireMethod] || []) {
                if (fee.startStamp <= contractData.timestamp &&
                    fee.endStamp >= contractData.timestamp) {
                    wireFee = fee.wireFee;
                    break;
                }
            }
            if (wireFee) {
                const amortizedWireFee = Amounts.divide(wireFee, contractData.wireFeeAmortization);
                if (Amounts.cmp(contractData.maxWireFee, amortizedWireFee) < 0) {
                    totalFees = Amounts.add(amortizedWireFee, totalFees).amount;
                    remainingAmount = Amounts.add(amortizedWireFee, remainingAmount).amount;
                }
            }
            // Try if paying using this exchange works
            const res = selectPayCoins(acis, remainingAmount, contractData.maxDepositFee);
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        logger.trace(`recording payment with session ID ${sessionId}`);
        const payReq = {
            coins: coinDepositPermissions,
            merchant_pub: d.contractData.merchantPub,
            mode: "pay",
            order_id: d.contractData.orderId,
        };
        const payCostInfo = yield getTotalPaymentCost(ws, coinSelection);
        const t = {
            abortDone: false,
            abortRequested: false,
            contractTermsRaw: d.contractTermsRaw,
            contractData: d.contractData,
            lastSessionId: sessionId,
            payCoinSelection: coinSelection,
            payReq,
            payCostInfo,
            timestampAccept: time.getTimestampNow(),
            timestampLastRefundStatus: undefined,
            proposalId: proposal.proposalId,
            lastPayError: undefined,
            lastRefundStatusError: undefined,
            payRetryInfo: dbTypes.initRetryInfo(),
            refundStatusRetryInfo: dbTypes.initRetryInfo(),
            refundStatusRequested: false,
            timestampFirstSuccessfulPay: undefined,
            autoRefundDeadline: undefined,
            paymentSubmitPending: true,
            refundGroups: [],
            refundsDone: {},
            refundsFailed: {},
            refundsPending: {},
        };
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.coins, dbTypes.Stores.purchases, dbTypes.Stores.proposals, dbTypes.Stores.refreshGroups], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const p = yield tx.get(dbTypes.Stores.proposals, proposal.proposalId);
            if (p) {
                p.proposalStatus = "accepted" /* ACCEPTED */;
                p.lastError = undefined;
                p.retryInfo = dbTypes.initRetryInfo(false);
                yield tx.put(dbTypes.Stores.proposals, p);
            }
            yield tx.put(dbTypes.Stores.purchases, t);
            for (let i = 0; i < coinSelection.coinPubs.length; i++) {
                const coin = yield tx.get(dbTypes.Stores.coins, coinSelection.coinPubs[i]);
                if (!coin) {
                    throw Error("coin allocated for payment doesn't exist anymore");
                }
                coin.status = "dormant" /* Dormant */;
                const remaining = Amounts.sub(coin.currentAmount, coinSelection.coinContributions[i]);
                if (remaining.saturated) {
                    throw Error("not enough remaining balance on coin for payment");
                }
                coin.currentAmount = remaining.amount;
                yield tx.put(dbTypes.Stores.coins, coin);
            }
            const refreshCoinPubs = coinSelection.coinPubs.map((x) => ({
                coinPub: x,
            }));
            yield refresh.createRefreshGroup(tx, refreshCoinPubs, "pay" /* Pay */);
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.proposals], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const pr = yield tx.get(dbTypes.Stores.proposals, proposalId);
            if (!pr) {
                return;
            }
            if (!pr.retryInfo) {
                return;
            }
            pr.retryInfo.retryCounter++;
            dbTypes.updateRetryInfoTimeout(pr.retryInfo);
            pr.lastError = err;
            yield tx.put(dbTypes.Stores.proposals, pr);
        }));
        ws.notify({ type: "proposal-error" /* ProposalOperationError */ });
    });
}
function incrementPurchasePayRetry(ws, proposalId, err) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log("incrementing purchase pay retry with error", err);
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.purchases], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const pr = yield tx.get(dbTypes.Stores.purchases, proposalId);
            if (!pr) {
                return;
            }
            if (!pr.payRetryInfo) {
                return;
            }
            pr.payRetryInfo.retryCounter++;
            dbTypes.updateRetryInfoTimeout(pr.payRetryInfo);
            pr.lastPayError = err;
            yield tx.put(dbTypes.Stores.purchases, pr);
        }));
        ws.notify({ type: "pay-error" /* PayOperationError */ });
    });
}
function processDownloadProposal(ws, proposalId, forceNow = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const onOpErr = (err) => incrementProposalRetry(ws, proposalId, err);
        yield errors.guardOperationException(() => processDownloadProposalImpl(ws, proposalId, forceNow), onOpErr);
    });
}
exports.processDownloadProposal = processDownloadProposal;
function resetDownloadProposalRetry(ws, proposalId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(dbTypes.Stores.proposals, proposalId, (x) => {
            if (x.retryInfo.active) {
                x.retryInfo = dbTypes.initRetryInfo();
            }
            return x;
        });
    });
}
function processDownloadProposalImpl(ws, proposalId, forceNow) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (forceNow) {
            yield resetDownloadProposalRetry(ws, proposalId);
        }
        const proposal = yield ws.db.get(dbTypes.Stores.proposals, proposalId);
        if (!proposal) {
            return;
        }
        if (proposal.proposalStatus != "downloading" /* DOWNLOADING */) {
            return;
        }
        const parsedUrl = new URL(taleruri.getOrderDownloadUrl(proposal.merchantBaseUrl, proposal.orderId));
        parsedUrl.searchParams.set("nonce", proposal.noncePub);
        const urlWithNonce = parsedUrl.href;
        console.log("downloading contract from '" + urlWithNonce + "'");
        let resp;
        try {
            resp = yield ws.http.get(urlWithNonce);
        }
        catch (e) {
            console.log("contract download failed", e);
            throw e;
        }
        if (resp.status !== 200) {
            throw Error(`contract download failed with status ${resp.status}`);
        }
        const proposalResp = talerTypes.codecForProposal().decode(yield resp.json());
        const contractTermsHash = yield ws.cryptoApi.hashString(helpers.canonicalJson(proposalResp.contract_terms));
        const parsedContractTerms = talerTypes.codecForContractTerms().decode(proposalResp.contract_terms);
        const fulfillmentUrl = parsedContractTerms.fulfillment_url;
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.proposals, dbTypes.Stores.purchases], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const p = yield tx.get(dbTypes.Stores.proposals, proposalId);
            if (!p) {
                return;
            }
            if (p.proposalStatus !== "downloading" /* DOWNLOADING */) {
                return;
            }
            const amount = Amounts.parseOrThrow(parsedContractTerms.amount);
            let maxWireFee;
            if (parsedContractTerms.max_wire_fee) {
                maxWireFee = Amounts.parseOrThrow(parsedContractTerms.max_wire_fee);
            }
            else {
                maxWireFee = Amounts.getZero(amount.currency);
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
                    maxDepositFee: Amounts.parseOrThrow(parsedContractTerms.max_fee),
                },
                contractTermsRaw: JSON.stringify(proposalResp.contract_terms),
            };
            if (fulfillmentUrl.startsWith("http://") ||
                fulfillmentUrl.startsWith("https://")) {
                const differentPurchase = yield tx.getIndexed(dbTypes.Stores.purchases.fulfillmentUrlIndex, fulfillmentUrl);
                if (differentPurchase) {
                    console.log("repurchase detected");
                    p.proposalStatus = "repurchase" /* REPURCHASE */;
                    p.repurchaseProposalId = differentPurchase.proposalId;
                    yield tx.put(dbTypes.Stores.proposals, p);
                    return;
                }
            }
            p.proposalStatus = "proposed" /* PROPOSED */;
            yield tx.put(dbTypes.Stores.proposals, p);
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
function startDownloadProposal(ws, merchantBaseUrl, orderId, sessionId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const oldProposal = yield ws.db.getIndexed(dbTypes.Stores.proposals.urlAndOrderIdIndex, [merchantBaseUrl, orderId]);
        if (oldProposal) {
            yield processDownloadProposal(ws, oldProposal.proposalId);
            return oldProposal.proposalId;
        }
        const { priv, pub } = yield ws.cryptoApi.createEddsaKeypair();
        const proposalId = talerCrypto.encodeCrock(talerCrypto.getRandomBytes(32));
        const proposalRecord = {
            download: undefined,
            noncePriv: priv,
            noncePub: pub,
            timestamp: time.getTimestampNow(),
            merchantBaseUrl,
            orderId,
            proposalId: proposalId,
            proposalStatus: "downloading" /* DOWNLOADING */,
            repurchaseProposalId: undefined,
            retryInfo: dbTypes.initRetryInfo(),
            lastError: undefined,
            downloadSessionId: sessionId,
        };
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.proposals], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const existingRecord = yield tx.getIndexed(dbTypes.Stores.proposals.urlAndOrderIdIndex, [merchantBaseUrl, orderId]);
            if (existingRecord) {
                // Created concurrently
                return;
            }
            yield tx.put(dbTypes.Stores.proposals, proposalRecord);
        }));
        yield processDownloadProposal(ws, proposalId);
        return proposalId;
    });
}
function submitPay(ws, proposalId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const purchase = yield ws.db.get(dbTypes.Stores.purchases, proposalId);
        if (!purchase) {
            throw Error("Purchase not found: " + proposalId);
        }
        if (purchase.abortRequested) {
            throw Error("not submitting payment for aborted purchase");
        }
        const sessionId = purchase.lastSessionId;
        let resp;
        const payReq = Object.assign(Object.assign({}, purchase.payReq), { session_id: sessionId });
        console.log("paying with session ID", sessionId);
        const payUrl = new URL("pay", purchase.contractData.merchantBaseUrl).href;
        try {
            console.log("pay req", payReq);
            resp = yield ws.http.postJson(payUrl, payReq);
        }
        catch (e) {
            // Gives the user the option to retry / abort and refresh
            console.log("payment failed", e);
            throw e;
        }
        if (resp.status !== 200) {
            console.log(yield resp.json());
            throw Error(`unexpected status (${resp.status}) for /pay`);
        }
        const merchantResp = yield resp.json();
        console.log("got success from pay URL", merchantResp);
        const now = time.getTimestampNow();
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
        purchase.payRetryInfo = dbTypes.initRetryInfo(false);
        if (isFirst) {
            const ar = purchase.contractData.autoRefund;
            if (ar) {
                console.log("auto_refund present");
                purchase.refundStatusRequested = true;
                purchase.refundStatusRetryInfo = dbTypes.initRetryInfo();
                purchase.lastRefundStatusError = undefined;
                purchase.autoRefundDeadline = time.timestampAddDuration(now, ar);
            }
        }
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.purchases, dbTypes.Stores.payEvents], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield tx.put(dbTypes.Stores.purchases, purchase);
            const payEvent = {
                proposalId,
                sessionId,
                timestamp: now,
                isReplay: !isFirst,
            };
            yield tx.put(dbTypes.Stores.payEvents, payEvent);
        }));
        const nextUrl = getNextUrl(purchase.contractData);
        ws.cachedNextUrl[purchase.contractData.fulfillmentUrl] = {
            nextUrl,
            lastSessionId: sessionId,
        };
        return { nextUrl };
    });
}
exports.submitPay = submitPay;
/**
 * Check if a payment for the given taler://pay/ URI is possible.
 *
 * If the payment is possible, the signature are already generated but not
 * yet send to the merchant.
 */
function preparePayForUri(ws, talerPayUri) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const uriResult = taleruri.parsePayUri(talerPayUri);
        if (!uriResult) {
            return {
                status: "error",
                error: "URI not supported",
            };
        }
        let proposalId = yield startDownloadProposal(ws, uriResult.merchantBaseUrl, uriResult.orderId, uriResult.sessionId);
        let proposal = yield ws.db.get(dbTypes.Stores.proposals, proposalId);
        if (!proposal) {
            throw Error(`could not get proposal ${proposalId}`);
        }
        if (proposal.proposalStatus === "repurchase" /* REPURCHASE */) {
            const existingProposalId = proposal.repurchaseProposalId;
            if (!existingProposalId) {
                throw Error("invalid proposal state");
            }
            console.log("using existing purchase for same product");
            proposal = yield ws.db.get(dbTypes.Stores.proposals, existingProposalId);
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
        const purchase = yield ws.db.get(dbTypes.Stores.purchases, proposalId);
        if (!purchase) {
            // If not already paid, check if we could pay for it.
            const res = yield getCoinsForPayment(ws, contractData);
            if (!res) {
                console.log("not confirming payment, insufficient coins");
                return {
                    status: "insufficient-balance",
                    contractTermsRaw: d.contractTermsRaw,
                    proposalId: proposal.proposalId,
                };
            }
            const costInfo = yield getTotalPaymentCost(ws, res);
            const totalFees = Amounts.sub(costInfo.totalCost, res.paymentAmount).amount;
            return {
                status: "payment-possible",
                contractTermsRaw: d.contractTermsRaw,
                proposalId: proposal.proposalId,
                totalFees,
            };
        }
        if (uriResult.sessionId && purchase.lastSessionId !== uriResult.sessionId) {
            console.log("automatically re-submitting payment with different session ID");
            yield ws.db.runWithWriteTransaction([dbTypes.Stores.purchases], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const p = yield tx.get(dbTypes.Stores.purchases, proposalId);
                if (!p) {
                    return;
                }
                p.lastSessionId = uriResult.sessionId;
                yield tx.put(dbTypes.Stores.purchases, p);
            }));
            yield submitPay(ws, proposalId);
        }
        return {
            status: "paid",
            contractTermsRaw: purchase.contractTermsRaw,
            nextUrl: getNextUrl(purchase.contractData),
        };
    });
}
exports.preparePayForUri = preparePayForUri;
/**
 * Add a contract to the wallet and sign coins, and send them.
 */
function confirmPay(ws, proposalId, sessionIdOverride) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        logger.trace(`executing confirmPay with proposalId ${proposalId} and sessionIdOverride ${sessionIdOverride}`);
        const proposal = yield ws.db.get(dbTypes.Stores.proposals, proposalId);
        if (!proposal) {
            throw Error(`proposal with id ${proposalId} not found`);
        }
        const d = proposal.download;
        if (!d) {
            throw Error("proposal is in invalid state");
        }
        let purchase = yield ws.db.get(dbTypes.Stores.purchases, d.contractData.contractTermsHash);
        if (purchase) {
            if (sessionIdOverride !== undefined &&
                sessionIdOverride != purchase.lastSessionId) {
                logger.trace(`changing session ID to ${sessionIdOverride}`);
                yield ws.db.mutate(dbTypes.Stores.purchases, purchase.proposalId, (x) => {
                    x.lastSessionId = sessionIdOverride;
                    x.paymentSubmitPending = true;
                    return x;
                });
            }
            logger.trace("confirmPay: submitting payment for existing purchase");
            return submitPay(ws, proposalId);
        }
        logger.trace("confirmPay: purchase record does not exist yet");
        const res = yield getCoinsForPayment(ws, d.contractData);
        logger.trace("coin selection result", res);
        if (!res) {
            // Should not happen, since checkPay should be called first
            console.log("not confirming payment, insufficient coins");
            throw Error("insufficient balance");
        }
        const depositPermissions = [];
        for (let i = 0; i < res.coinPubs.length; i++) {
            const coin = yield ws.db.get(dbTypes.Stores.coins, res.coinPubs[i]);
            if (!coin) {
                throw Error("can't pay, allocated coin not found anymore");
            }
            const denom = yield ws.db.get(dbTypes.Stores.denominations, [
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
                denomPub: coin.denomPub,
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
        logger.trace("confirmPay: submitting payment after creating purchase record");
        logger.trace("purchaseRecord:", purchase);
        return submitPay(ws, proposalId);
    });
}
exports.confirmPay = confirmPay;
function processPurchasePay(ws, proposalId, forceNow = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const onOpErr = (e) => incrementPurchasePayRetry(ws, proposalId, e);
        yield errors.guardOperationException(() => processPurchasePayImpl(ws, proposalId, forceNow), onOpErr);
    });
}
exports.processPurchasePay = processPurchasePay;
function resetPurchasePayRetry(ws, proposalId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(dbTypes.Stores.purchases, proposalId, (x) => {
            if (x.payRetryInfo.active) {
                x.payRetryInfo = dbTypes.initRetryInfo();
            }
            return x;
        });
    });
}
function processPurchasePayImpl(ws, proposalId, forceNow) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (forceNow) {
            yield resetPurchasePayRetry(ws, proposalId);
        }
        const purchase = yield ws.db.get(dbTypes.Stores.purchases, proposalId);
        if (!purchase) {
            return;
        }
        if (!purchase.paymentSubmitPending) {
            return;
        }
        logger.trace(`processing purchase pay ${proposalId}`);
        yield submitPay(ws, proposalId);
    });
}
function refuseProposal(ws, proposalId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const success = yield ws.db.runWithWriteTransaction([dbTypes.Stores.proposals], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const proposal = yield tx.get(dbTypes.Stores.proposals, proposalId);
            if (!proposal) {
                logger.trace(`proposal ${proposalId} not found, won't refuse proposal`);
                return false;
            }
            if (proposal.proposalStatus !== "proposed" /* PROPOSED */) {
                return false;
            }
            proposal.proposalStatus = "refused" /* REFUSED */;
            yield tx.put(dbTypes.Stores.proposals, proposal);
            return true;
        }));
        if (success) {
            ws.notify({
                type: "wildcard" /* Wildcard */,
            });
        }
    });
}
exports.refuseProposal = refuseProposal;

});

unwrapExports(pay);
var pay_1 = pay.getTotalPaymentCost;
var pay_2 = pay.selectPayCoins;
var pay_3 = pay.processDownloadProposal;
var pay_4 = pay.submitPay;
var pay_5 = pay.preparePayForUri;
var pay_6 = pay.confirmPay;
var pay_7 = pay.processPurchasePay;
var pay_8 = pay.refuseProposal;

var timer = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
class IntervalHandle {
    constructor(h) {
        this.h = h;
    }
    clear() {
        clearInterval(this.h);
    }
}
class TimeoutHandle {
    constructor(h) {
        this.h = h;
    }
    clear() {
        clearTimeout(this.h);
    }
}
/**
 * Get a performance counter in milliseconds.
 */
exports.performanceNow = (() => {
    if (typeof process !== "undefined" && process.hrtime) {
        return () => {
            const t = process.hrtime();
            return t[0] * 1e9 + t[1];
        };
    }
    else if (typeof performance !== "undefined") {
        return () => performance.now();
    }
    else {
        return () => 0;
    }
})();
/**
 * Call a function every time the delay given in milliseconds passes.
 */
function every(delayMs, callback) {
    return new IntervalHandle(setInterval(callback, delayMs));
}
exports.every = every;
/**
 * Call a function after the delay given in milliseconds passes.
 */
function after(delayMs, callback) {
    return new TimeoutHandle(setTimeout(callback, delayMs));
}
exports.after = after;
const nullTimerHandle = {
    clear() {
        // do nothing
        return;
    },
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
            console.warn("dropping timer since timer group is stopped");
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
        };
    }
    every(delayMs, callback) {
        if (this.stopped) {
            console.warn("dropping timer since timer group is stopped");
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
        };
    }
}
exports.TimerGroup = TimerGroup;

});

unwrapExports(timer);
var timer_1 = timer.performanceNow;
var timer_2 = timer.every;
var timer_3 = timer.after;
var timer_4 = timer.TimerGroup;

var cryptoApi = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

const timer$1 = tslib_1.__importStar(timer);
/**
 * Number of different priorities. Each priority p
 * must be 0 <= p < NUM_PRIO.
 */
const NUM_PRIO = 5;
class BrowserCryptoWorkerFactory {
    startWorker() {
        const workerCtor = Worker;
        const workerPath = "/browserWorkerEntry.js";
        return new workerCtor(workerPath);
    }
    getConcurrency() {
        let concurrency = 2;
        try {
            // only works in the browser
            // tslint:disable-next-line:no-string-literal
            concurrency = navigator["hardwareConcurrency"];
            concurrency = Math.max(1, Math.ceil(concurrency / 2));
        }
        catch (e) {
            concurrency = 2;
        }
        return concurrency;
    }
}
exports.BrowserCryptoWorkerFactory = BrowserCryptoWorkerFactory;
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
                CryptoApi.enableTracing && console.log("terminating worker");
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
            console.log("cryptoApi is stopped");
            CryptoApi.enableTracing &&
                console.log("not waking, as cryptoApi is stopped");
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
        work.startTime = timer$1.performanceNow();
        setTimeout(() => worker.postMessage(msg), 0);
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
        ws.terminationTimerHandle = timer$1.after(15 * 1000, destroy);
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
        CryptoApi.enableTracing &&
            console.log(`rpc ${currentWorkItem.operation} took ${timer$1.performanceNow() - currentWorkItem.startTime}ms`);
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
exports.CryptoApi = CryptoApi;
CryptoApi.enableTracing = false;

});

unwrapExports(cryptoApi);
var cryptoApi_1 = cryptoApi.BrowserCryptoWorkerFactory;
var cryptoApi_2 = cryptoApi.CryptoApi;

var asyncMemo = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.AsyncOpMemoMap = AsyncOpMemoMap;
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
exports.AsyncOpMemoSingle = AsyncOpMemoSingle;

});

unwrapExports(asyncMemo);
var asyncMemo_1 = asyncMemo.AsyncOpMemoMap;
var asyncMemo_2 = asyncMemo.AsyncOpMemoSingle;

var state = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });



const logger = new logging.Logger("state.ts");
class InternalWalletState {
    constructor(db, http, cryptoWorkerFactory) {
        this.db = db;
        this.http = http;
        this.cachedNextUrl = {};
        this.memoProcessReserve = new asyncMemo.AsyncOpMemoMap();
        this.memoMakePlanchet = new asyncMemo.AsyncOpMemoMap();
        this.memoGetPending = new asyncMemo.AsyncOpMemoSingle();
        this.memoGetBalance = new asyncMemo.AsyncOpMemoSingle();
        this.memoProcessRefresh = new asyncMemo.AsyncOpMemoMap();
        this.memoProcessRecoup = new asyncMemo.AsyncOpMemoMap();
        this.listeners = [];
        this.cryptoApi = new cryptoApi.CryptoApi(cryptoWorkerFactory);
    }
    notify(n) {
        logger.trace("Notification", n);
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
exports.InternalWalletState = InternalWalletState;

});

unwrapExports(state);
var state_1 = state.InternalWalletState;

var history = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });






/**
 * Create an event ID from the type and the primary key for the event.
 */
function makeEventId(type, ...args) {
    return type + ";" + args.map((x) => encodeURIComponent(x)).join(";");
}
function getOrderShortInfo(proposal) {
    const download = proposal.download;
    if (!download) {
        return undefined;
    }
    return {
        amount: amounts.Amounts.stringify(download.contractData.amount),
        fulfillmentUrl: download.contractData.fulfillmentUrl,
        orderId: download.contractData.orderId,
        merchantBaseUrl: download.contractData.merchantBaseUrl,
        proposalId: proposal.proposalId,
        summary: download.contractData.summary,
    };
}
function collectProposalHistory(tx, history, historyQuery) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        tx.iter(dbTypes.Stores.proposals).forEachAsync((proposal) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const status = proposal.proposalStatus;
            switch (status) {
                case "accepted" /* ACCEPTED */:
                    {
                        const shortInfo = getOrderShortInfo(proposal);
                        if (!shortInfo) {
                            break;
                        }
                        history.push({
                            type: "order-accepted" /* OrderAccepted */,
                            eventId: makeEventId("order-accepted" /* OrderAccepted */, proposal.proposalId),
                            orderShortInfo: shortInfo,
                            timestamp: proposal.timestamp,
                        });
                    }
                    break;
                case "downloading" /* DOWNLOADING */:
                case "proposed" /* PROPOSED */:
                    // no history event needed
                    break;
                case "refused" /* REFUSED */:
                    {
                        const shortInfo = getOrderShortInfo(proposal);
                        if (!shortInfo) {
                            break;
                        }
                        history.push({
                            type: "order-refused" /* OrderRefused */,
                            eventId: makeEventId("order-refused" /* OrderRefused */, proposal.proposalId),
                            orderShortInfo: shortInfo,
                            timestamp: proposal.timestamp,
                        });
                    }
                    break;
                case "repurchase" /* REPURCHASE */:
                    {
                        const alreadyPaidProposal = yield tx.get(dbTypes.Stores.proposals, proposal.repurchaseProposalId);
                        if (!alreadyPaidProposal) {
                            break;
                        }
                        const alreadyPaidOrderShortInfo = getOrderShortInfo(alreadyPaidProposal);
                        if (!alreadyPaidOrderShortInfo) {
                            break;
                        }
                        const newOrderShortInfo = getOrderShortInfo(proposal);
                        if (!newOrderShortInfo) {
                            break;
                        }
                        history.push({
                            type: "order-redirected" /* OrderRedirected */,
                            eventId: makeEventId("order-redirected" /* OrderRedirected */, proposal.proposalId),
                            alreadyPaidOrderShortInfo,
                            newOrderShortInfo,
                            timestamp: proposal.timestamp,
                        });
                    }
                    break;
                default:
                    assertUnreachable_1.assertUnreachable(status);
            }
        }));
    });
}
/**
 * Retrive the full event history for this wallet.
 */
function getHistory(ws, historyQuery) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const history = [];
        // FIXME: do pagination instead of generating the full history
        // We uniquely identify history rows via their timestamp.
        // This works as timestamps are guaranteed to be monotonically
        // increasing even
        yield ws.db.runWithReadTransaction([
            dbTypes.Stores.currencies,
            dbTypes.Stores.coins,
            dbTypes.Stores.denominations,
            dbTypes.Stores.exchanges,
            dbTypes.Stores.exchangeUpdatedEvents,
            dbTypes.Stores.proposals,
            dbTypes.Stores.purchases,
            dbTypes.Stores.refreshGroups,
            dbTypes.Stores.reserves,
            dbTypes.Stores.reserveHistory,
            dbTypes.Stores.tips,
            dbTypes.Stores.withdrawalGroups,
            dbTypes.Stores.payEvents,
            dbTypes.Stores.planchets,
            dbTypes.Stores.refundEvents,
            dbTypes.Stores.reserveUpdatedEvents,
            dbTypes.Stores.recoupGroups,
        ], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            tx.iter(dbTypes.Stores.exchanges).forEach((exchange) => {
                history.push({
                    type: "exchange-added" /* ExchangeAdded */,
                    builtIn: false,
                    eventId: makeEventId("exchange-added" /* ExchangeAdded */, exchange.baseUrl),
                    exchangeBaseUrl: exchange.baseUrl,
                    timestamp: exchange.timestampAdded,
                });
            });
            tx.iter(dbTypes.Stores.exchangeUpdatedEvents).forEach((eu) => {
                history.push({
                    type: "exchange-updated" /* ExchangeUpdated */,
                    eventId: makeEventId("exchange-updated" /* ExchangeUpdated */, eu.exchangeBaseUrl),
                    exchangeBaseUrl: eu.exchangeBaseUrl,
                    timestamp: eu.timestamp,
                });
            });
            tx.iter(dbTypes.Stores.withdrawalGroups).forEach((wsr) => {
                if (wsr.timestampFinish) {
                    history.push({
                        type: "withdrawn" /* Withdrawn */,
                        withdrawalGroupId: wsr.withdrawalGroupId,
                        eventId: makeEventId("withdrawn" /* Withdrawn */, wsr.withdrawalGroupId),
                        amountWithdrawnEffective: amounts.Amounts.stringify(wsr.denomsSel.totalCoinValue),
                        amountWithdrawnRaw: amounts.Amounts.stringify(wsr.rawWithdrawalAmount),
                        exchangeBaseUrl: wsr.exchangeBaseUrl,
                        timestamp: wsr.timestampFinish,
                        withdrawalSource: wsr.source,
                        verboseDetails: undefined,
                    });
                }
            });
            yield collectProposalHistory(tx, history);
            yield tx.iter(dbTypes.Stores.payEvents).forEachAsync((pe) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const proposal = yield tx.get(dbTypes.Stores.proposals, pe.proposalId);
                if (!proposal) {
                    return;
                }
                const purchase = yield tx.get(dbTypes.Stores.purchases, pe.proposalId);
                if (!purchase) {
                    return;
                }
                const orderShortInfo = getOrderShortInfo(proposal);
                if (!orderShortInfo) {
                    return;
                }
                let verboseDetails = undefined;
                if (historyQuery === null || historyQuery === void 0 ? void 0 : historyQuery.extraDebug) {
                    const coins = [];
                    for (const x of purchase.payReq.coins) {
                        const c = yield tx.get(dbTypes.Stores.coins, x.coin_pub);
                        if (!c) {
                            // FIXME: what to do here??
                            continue;
                        }
                        const d = yield tx.get(dbTypes.Stores.denominations, [
                            c.exchangeBaseUrl,
                            c.denomPub,
                        ]);
                        if (!d) {
                            // FIXME: what to do here??
                            continue;
                        }
                        coins.push({
                            contribution: x.contribution,
                            denomPub: c.denomPub,
                            value: amounts.Amounts.stringify(d.value),
                        });
                    }
                    verboseDetails = { coins };
                }
                const amountPaidWithFees = amounts.Amounts.sum(purchase.payReq.coins.map((x) => amounts.Amounts.parseOrThrow(x.contribution))).amount;
                history.push({
                    type: "payment-sent" /* PaymentSent */,
                    eventId: makeEventId("payment-sent" /* PaymentSent */, pe.proposalId),
                    orderShortInfo,
                    replay: pe.isReplay,
                    sessionId: pe.sessionId,
                    timestamp: pe.timestamp,
                    numCoins: purchase.payReq.coins.length,
                    amountPaidWithFees: amounts.Amounts.stringify(amountPaidWithFees),
                    verboseDetails,
                });
            }));
            yield tx.iter(dbTypes.Stores.refreshGroups).forEachAsync((rg) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!rg.timestampFinished) {
                    return;
                }
                let numInputCoins = 0;
                let numRefreshedInputCoins = 0;
                let numOutputCoins = 0;
                const amountsRaw = [];
                const amountsEffective = [];
                for (let i = 0; i < rg.refreshSessionPerCoin.length; i++) {
                    const session = rg.refreshSessionPerCoin[i];
                    numInputCoins++;
                    const c = yield tx.get(dbTypes.Stores.coins, rg.oldCoinPubs[i]);
                    if (!c) {
                        continue;
                    }
                    if (session) {
                        numRefreshedInputCoins++;
                        amountsRaw.push(session.amountRefreshInput);
                        amountsRaw.push(c.currentAmount);
                        amountsEffective.push(session.amountRefreshOutput);
                        numOutputCoins += session.newDenoms.length;
                    }
                    else {
                        amountsRaw.push(c.currentAmount);
                    }
                }
                const amountRefreshedRaw = amounts.Amounts.sum(amountsRaw).amount;
                let amountRefreshedEffective;
                if (amountsEffective.length == 0) {
                    amountRefreshedEffective = amounts.Amounts.getZero(amountRefreshedRaw.currency);
                }
                else {
                    amountRefreshedEffective = amounts.Amounts.sum(amountsEffective).amount;
                }
                let verboseDetails = undefined;
                if (historyQuery === null || historyQuery === void 0 ? void 0 : historyQuery.extraDebug) {
                    const outputCoins = [];
                    for (const rs of rg.refreshSessionPerCoin) {
                        if (!rs) {
                            continue;
                        }
                        for (const nd of rs.newDenoms) {
                            if (!nd) {
                                continue;
                            }
                            const d = yield tx.get(dbTypes.Stores.denominations, [
                                rs.exchangeBaseUrl,
                                nd,
                            ]);
                            if (!d) {
                                continue;
                            }
                            outputCoins.push({
                                denomPub: d.denomPub,
                                value: amounts.Amounts.stringify(d.value),
                            });
                        }
                    }
                    verboseDetails = {
                        outputCoins: outputCoins,
                    };
                }
                history.push({
                    type: "refreshed" /* Refreshed */,
                    refreshGroupId: rg.refreshGroupId,
                    eventId: makeEventId("refreshed" /* Refreshed */, rg.refreshGroupId),
                    timestamp: rg.timestampFinished,
                    refreshReason: rg.reason,
                    amountRefreshedEffective: amounts.Amounts.stringify(amountRefreshedEffective),
                    amountRefreshedRaw: amounts.Amounts.stringify(amountRefreshedRaw),
                    numInputCoins,
                    numOutputCoins,
                    numRefreshedInputCoins,
                    verboseDetails,
                });
            }));
            tx.iter(dbTypes.Stores.reserveUpdatedEvents).forEachAsync((ru) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const reserve = yield tx.get(dbTypes.Stores.reserves, ru.reservePub);
                if (!reserve) {
                    return;
                }
                let reserveCreationDetail;
                if (reserve.bankInfo) {
                    reserveCreationDetail = {
                        type: "taler-bank-withdraw" /* TalerBankWithdraw */,
                        bankUrl: reserve.bankInfo.statusUrl,
                    };
                }
                else {
                    reserveCreationDetail = {
                        type: "manual" /* Manual */,
                    };
                }
                const hist = yield tx.get(dbTypes.Stores.reserveHistory, reserve.reservePub);
                if (!hist) {
                    throw Error("inconsistent database");
                }
                const s = reserveHistoryUtil.summarizeReserveHistory(hist.reserveTransactions, reserve.currency);
                history.push({
                    type: "reserve-balance-updated" /* ReserveBalanceUpdated */,
                    eventId: makeEventId("reserve-balance-updated" /* ReserveBalanceUpdated */, ru.reserveUpdateId),
                    timestamp: ru.timestamp,
                    reserveShortInfo: {
                        exchangeBaseUrl: reserve.exchangeBaseUrl,
                        reserveCreationDetail,
                        reservePub: reserve.reservePub,
                    },
                    reserveAwaitedAmount: amounts.Amounts.stringify(s.awaitedReserveAmount),
                    reserveBalance: amounts.Amounts.stringify(s.computedReserveBalance),
                    reserveUnclaimedAmount: amounts.Amounts.stringify(s.unclaimedReserveAmount),
                });
            }));
            tx.iter(dbTypes.Stores.tips).forEach((tip) => {
                if (tip.acceptedTimestamp) {
                    history.push({
                        type: "tip-accepted" /* TipAccepted */,
                        eventId: makeEventId("tip-accepted" /* TipAccepted */, tip.tipId),
                        timestamp: tip.acceptedTimestamp,
                        tipId: tip.tipId,
                        tipAmountRaw: amounts.Amounts.stringify(tip.amount),
                    });
                }
            });
            tx.iter(dbTypes.Stores.refundEvents).forEachAsync((re) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const proposal = yield tx.get(dbTypes.Stores.proposals, re.proposalId);
                if (!proposal) {
                    return;
                }
                const purchase = yield tx.get(dbTypes.Stores.purchases, re.proposalId);
                if (!purchase) {
                    return;
                }
                const orderShortInfo = getOrderShortInfo(proposal);
                if (!orderShortInfo) {
                    return;
                }
                const purchaseAmount = purchase.contractData.amount;
                let amountRefundedRaw = amounts.Amounts.getZero(purchaseAmount.currency);
                let amountRefundedInvalid = amounts.Amounts.getZero(purchaseAmount.currency);
                let amountRefundedEffective = amounts.Amounts.getZero(purchaseAmount.currency);
                Object.keys(purchase.refundsDone).forEach((x, i) => {
                    const r = purchase.refundsDone[x];
                    if (r.refundGroupId !== re.refundGroupId) {
                        return;
                    }
                    const refundAmount = amounts.Amounts.parseOrThrow(r.perm.refund_amount);
                    const refundFee = amounts.Amounts.parseOrThrow(r.perm.refund_fee);
                    amountRefundedRaw = amounts.Amounts.add(amountRefundedRaw, refundAmount)
                        .amount;
                    amountRefundedEffective = amounts.Amounts.add(amountRefundedEffective, refundAmount).amount;
                    amountRefundedEffective = amounts.Amounts.sub(amountRefundedEffective, refundFee).amount;
                });
                Object.keys(purchase.refundsFailed).forEach((x, i) => {
                    const r = purchase.refundsFailed[x];
                    if (r.refundGroupId !== re.refundGroupId) {
                        return;
                    }
                    const ra = amounts.Amounts.parseOrThrow(r.perm.refund_amount);
                    const refundFee = amounts.Amounts.parseOrThrow(r.perm.refund_fee);
                    amountRefundedRaw = amounts.Amounts.add(amountRefundedRaw, ra).amount;
                    amountRefundedInvalid = amounts.Amounts.add(amountRefundedInvalid, ra).amount;
                    amountRefundedEffective = amounts.Amounts.sub(amountRefundedEffective, refundFee).amount;
                });
                history.push({
                    type: "refund" /* Refund */,
                    eventId: makeEventId("refund" /* Refund */, re.refundGroupId),
                    refundGroupId: re.refundGroupId,
                    orderShortInfo,
                    timestamp: re.timestamp,
                    amountRefundedEffective: amounts.Amounts.stringify(amountRefundedEffective),
                    amountRefundedRaw: amounts.Amounts.stringify(amountRefundedRaw),
                    amountRefundedInvalid: amounts.Amounts.stringify(amountRefundedInvalid),
                });
            }));
            tx.iter(dbTypes.Stores.recoupGroups).forEach((rg) => {
                if (rg.timestampFinished) {
                    let verboseDetails = undefined;
                    if (historyQuery === null || historyQuery === void 0 ? void 0 : historyQuery.extraDebug) {
                        verboseDetails = {
                            oldAmountPerCoin: rg.oldAmountPerCoin.map(amounts.Amounts.stringify),
                        };
                    }
                    history.push({
                        type: "funds-recouped" /* FundsRecouped */,
                        timestamp: rg.timestampFinished,
                        eventId: makeEventId("funds-recouped" /* FundsRecouped */, rg.recoupGroupId),
                        numCoinsRecouped: rg.coinPubs.length,
                        verboseDetails,
                    });
                }
            });
        }));
        history.sort((h1, h2) => time.timestampCmp(h1.timestamp, h2.timestamp));
        return { history };
    });
}
exports.getHistory = getHistory;

});

unwrapExports(history);
var history_1 = history.getHistory;

var balance = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });


const Amounts = tslib_1.__importStar(amounts);

const logger = new logging.Logger("withdraw.ts");
/**
 * Get balance information.
 */
function getBalancesInsideTransaction(ws, tx) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        /**
         * Add amount to a balance field, both for
         * the slicing by exchange and currency.
         */
        function addTo(balance, field, amount, exchange) {
            const z = Amounts.getZero(amount.currency);
            const balanceIdentity = {
                available: z,
                paybackAmount: z,
                pendingIncoming: z,
                pendingPayment: z,
                pendingIncomingDirty: z,
                pendingIncomingRefresh: z,
                pendingIncomingWithdraw: z,
            };
            let entryCurr = balance.byCurrency[amount.currency];
            if (!entryCurr) {
                balance.byCurrency[amount.currency] = entryCurr = Object.assign({}, balanceIdentity);
            }
            let entryEx = balance.byExchange[exchange];
            if (!entryEx) {
                balance.byExchange[exchange] = entryEx = Object.assign({}, balanceIdentity);
            }
            entryCurr[field] = Amounts.add(entryCurr[field], amount).amount;
            entryEx[field] = Amounts.add(entryEx[field], amount).amount;
        }
        const balanceStore = {
            byCurrency: {},
            byExchange: {},
        };
        yield tx.iter(dbTypes.Stores.coins).forEach((c) => {
            if (c.suspended) {
                return;
            }
            if (c.status === "fresh" /* Fresh */) {
                addTo(balanceStore, "available", c.currentAmount, c.exchangeBaseUrl);
            }
        });
        yield tx.iter(dbTypes.Stores.refreshGroups).forEach((r) => {
            // Don't count finished refreshes, since the refresh already resulted
            // in coins being added to the wallet.
            if (r.timestampFinished) {
                return;
            }
            for (let i = 0; i < r.oldCoinPubs.length; i++) {
                const session = r.refreshSessionPerCoin[i];
                if (session) {
                    addTo(balanceStore, "pendingIncoming", session.amountRefreshOutput, session.exchangeBaseUrl);
                    addTo(balanceStore, "pendingIncomingRefresh", session.amountRefreshOutput, session.exchangeBaseUrl);
                }
            }
        });
        // FIXME: re-implement
        // await tx.iter(Stores.withdrawalGroups).forEach((wds) => {
        //   let w = wds.totalCoinValue;
        //   for (let i = 0; i < wds.planchets.length; i++) {
        //     if (wds.withdrawn[i]) {
        //       const p = wds.planchets[i];
        //       if (p) {
        //         w = Amounts.sub(w, p.coinValue).amount;
        //       }
        //     }
        //   }
        //   addTo(balanceStore, "pendingIncoming", w, wds.exchangeBaseUrl);
        // });
        yield tx.iter(dbTypes.Stores.purchases).forEach((t) => {
            if (t.timestampFirstSuccessfulPay) {
                return;
            }
            for (const c of t.payReq.coins) {
                addTo(balanceStore, "pendingPayment", Amounts.parseOrThrow(c.contribution), c.exchange_url);
            }
        });
        return balanceStore;
    });
}
exports.getBalancesInsideTransaction = getBalancesInsideTransaction;
/**
 * Get detailed balance information, sliced by exchange and by currency.
 */
function getBalances(ws) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        logger.trace("starting to compute balance");
        const wbal = yield ws.db.runWithReadTransaction([
            dbTypes.Stores.coins,
            dbTypes.Stores.refreshGroups,
            dbTypes.Stores.reserves,
            dbTypes.Stores.purchases,
            dbTypes.Stores.withdrawalGroups,
        ], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return getBalancesInsideTransaction(ws, tx);
        }));
        logger.trace("finished computing wallet balance");
        return wbal;
    });
}
exports.getBalances = getBalances;

});

unwrapExports(balance);
var balance_1 = balance.getBalancesInsideTransaction;
var balance_2 = balance.getBalances;

var pending = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Imports.
 */



function updateRetryDelay(oldDelay, now, retryTimestamp) {
    const remaining = time.getDurationRemaining(retryTimestamp, now);
    const nextDelay = time.durationMin(oldDelay, remaining);
    return nextDelay;
}
function gatherExchangePending(tx, now, resp, onlyDue = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (onlyDue) {
            // FIXME: exchanges should also be updated regularly
            return;
        }
        yield tx.iter(dbTypes.Stores.exchanges).forEach((e) => {
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // FIXME: this should be optimized by using an index for "onlyDue==true".
        yield tx.iter(dbTypes.Stores.reserves).forEach((reserve) => {
            const reserveType = reserve.bankInfo
                ? "taler-bank-withdraw" /* TalerBankWithdraw */
                : "manual" /* Manual */;
            if (!reserve.retryInfo.active) {
                return;
            }
            switch (reserve.reserveStatus) {
                case dbTypes.ReserveRecordStatus.DORMANT:
                    // nothing to report as pending
                    break;
                case dbTypes.ReserveRecordStatus.UNCONFIRMED:
                    if (onlyDue) {
                        break;
                    }
                    resp.pendingOperations.push({
                        type: "reserve" /* Reserve */,
                        givesLifeness: false,
                        stage: reserve.reserveStatus,
                        timestampCreated: reserve.timestampCreated,
                        reserveType,
                        reservePub: reserve.reservePub,
                        retryInfo: reserve.retryInfo,
                    });
                    break;
                case dbTypes.ReserveRecordStatus.WAIT_CONFIRM_BANK:
                case dbTypes.ReserveRecordStatus.WITHDRAWING:
                case dbTypes.ReserveRecordStatus.QUERYING_STATUS:
                case dbTypes.ReserveRecordStatus.REGISTERING_BANK:
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield tx.iter(dbTypes.Stores.refreshGroups).forEach((r) => {
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield tx.iter(dbTypes.Stores.withdrawalGroups).forEachAsync((wsr) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (wsr.timestampFinish) {
                return;
            }
            resp.nextRetryDelay = updateRetryDelay(resp.nextRetryDelay, now, wsr.retryInfo.nextRetry);
            if (onlyDue && wsr.retryInfo.nextRetry.t_ms > now.t_ms) {
                return;
            }
            let numCoinsWithdrawn = 0;
            let numCoinsTotal = 0;
            yield tx.iterIndexed(dbTypes.Stores.planchets.byGroup, wsr.withdrawalGroupId).forEach((x) => {
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield tx.iter(dbTypes.Stores.proposals).forEach((proposal) => {
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield tx.iter(dbTypes.Stores.tips).forEach((tip) => {
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield tx.iter(dbTypes.Stores.purchases).forEach((pr) => {
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield tx.iter(dbTypes.Stores.recoupGroups).forEach((rg) => {
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const now = time.getTimestampNow();
        return yield ws.db.runWithReadTransaction([
            dbTypes.Stores.exchanges,
            dbTypes.Stores.reserves,
            dbTypes.Stores.refreshGroups,
            dbTypes.Stores.coins,
            dbTypes.Stores.withdrawalGroups,
            dbTypes.Stores.proposals,
            dbTypes.Stores.tips,
            dbTypes.Stores.purchases,
            dbTypes.Stores.recoupGroups,
            dbTypes.Stores.planchets,
        ], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const walletBalance = yield balance.getBalancesInsideTransaction(ws, tx);
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
exports.getPendingOperations = getPendingOperations;

});

unwrapExports(pending);
var pending_1 = pending.getPendingOperations;

var tip = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });



const Amounts = tslib_1.__importStar(amounts);






function getTipStatus(ws, talerTipUri) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const res = taleruri.parseTipUri(talerTipUri);
        if (!res) {
            throw Error("invalid taler://tip URI");
        }
        const tipStatusUrl = new URL("tip-pickup", res.merchantBaseUrl);
        tipStatusUrl.searchParams.set("tip_id", res.merchantTipId);
        console.log("checking tip status from", tipStatusUrl.href);
        const merchantResp = yield ws.http.get(tipStatusUrl.href);
        if (merchantResp.status !== 200) {
            throw Error(`unexpected status ${merchantResp.status} for tip-pickup`);
        }
        const respJson = yield merchantResp.json();
        console.log("resp:", respJson);
        const tipPickupStatus = talerTypes.codecForTipPickupGetResponse().decode(respJson);
        console.log("status", tipPickupStatus);
        const amount = Amounts.parseOrThrow(tipPickupStatus.amount);
        let tipRecord = yield ws.db.get(dbTypes.Stores.tips, [
            res.merchantTipId,
            res.merchantOrigin,
        ]);
        if (!tipRecord) {
            yield exchanges.updateExchangeFromUrl(ws, tipPickupStatus.exchange_url);
            const withdrawDetails = yield withdraw.getExchangeWithdrawalInfo(ws, tipPickupStatus.exchange_url, amount);
            const tipId = talerCrypto.encodeCrock(talerCrypto.getRandomBytes(32));
            const selectedDenoms = yield withdraw.getVerifiedWithdrawDenomList(ws, tipPickupStatus.exchange_url, amount);
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
                createdTimestamp: time.getTimestampNow(),
                merchantTipId: res.merchantTipId,
                totalFees: Amounts.add(withdrawDetails.overhead, withdrawDetails.withdrawFee).amount,
                retryInfo: dbTypes.initRetryInfo(),
                lastError: undefined,
                denomsSel: {
                    totalCoinValue: selectedDenoms.totalCoinValue,
                    totalWithdrawCost: selectedDenoms.totalWithdrawCost,
                    selectedDenoms: selectedDenoms.selectedDenoms.map((x) => {
                        return {
                            count: x.count,
                            denomPubHash: x.denom.denomPubHash,
                        };
                    }),
                },
            };
            yield ws.db.put(dbTypes.Stores.tips, tipRecord);
        }
        const tipStatus = {
            accepted: !!tipRecord && !!tipRecord.acceptedTimestamp,
            amount: Amounts.parseOrThrow(tipPickupStatus.amount),
            amountLeft: Amounts.parseOrThrow(tipPickupStatus.amount_left),
            exchangeUrl: tipPickupStatus.exchange_url,
            nextUrl: tipPickupStatus.extra.next_url,
            merchantOrigin: res.merchantOrigin,
            merchantTipId: res.merchantTipId,
            expirationTimestamp: tipPickupStatus.stamp_expire,
            timestamp: tipPickupStatus.stamp_created,
            totalFees: tipRecord.totalFees,
            tipId: tipRecord.tipId,
        };
        return tipStatus;
    });
}
exports.getTipStatus = getTipStatus;
function incrementTipRetry(ws, refreshSessionId, err) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.tips], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const t = yield tx.get(dbTypes.Stores.tips, refreshSessionId);
            if (!t) {
                return;
            }
            if (!t.retryInfo) {
                return;
            }
            t.retryInfo.retryCounter++;
            dbTypes.updateRetryInfoTimeout(t.retryInfo);
            t.lastError = err;
            yield tx.put(dbTypes.Stores.tips, t);
        }));
        ws.notify({ type: "tip-error" /* TipOperationError */ });
    });
}
function processTip(ws, tipId, forceNow = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const onOpErr = (e) => incrementTipRetry(ws, tipId, e);
        yield errors.guardOperationException(() => processTipImpl(ws, tipId, forceNow), onOpErr);
    });
}
exports.processTip = processTip;
function resetTipRetry(ws, tipId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(dbTypes.Stores.tips, tipId, (x) => {
            if (x.retryInfo.active) {
                x.retryInfo = dbTypes.initRetryInfo();
            }
            return x;
        });
    });
}
function processTipImpl(ws, tipId, forceNow) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (forceNow) {
            yield resetTipRetry(ws, tipId);
        }
        let tipRecord = yield ws.db.get(dbTypes.Stores.tips, tipId);
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
                const denom = yield ws.db.getIndexed(dbTypes.Stores.denominations.denomPubHashIndex, sd.denomPubHash);
                if (!denom) {
                    throw Error("denom does not exist anymore");
                }
                for (let i = 0; i < sd.count; i++) {
                    const r = yield ws.cryptoApi.createTipPlanchet(denom);
                    planchets.push(r);
                }
            }
            yield ws.db.mutate(dbTypes.Stores.tips, tipId, (r) => {
                if (!r.planchets) {
                    r.planchets = planchets;
                }
                return r;
            });
        }
        tipRecord = yield ws.db.get(dbTypes.Stores.tips, tipId);
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
        const response = talerTypes.codecForTipResponse().decode(yield merchantResp.json());
        if (response.reserve_sigs.length !== tipRecord.planchets.length) {
            throw Error("number of tip responses does not match requested planchets");
        }
        const withdrawalGroupId = talerCrypto.encodeCrock(talerCrypto.getRandomBytes(32));
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
            timestampStart: time.getTimestampNow(),
            withdrawalGroupId: withdrawalGroupId,
            rawWithdrawalAmount: tipRecord.amount,
            lastErrorPerCoin: {},
            retryInfo: dbTypes.initRetryInfo(),
            timestampFinish: undefined,
            lastError: undefined,
            denomsSel: tipRecord.denomsSel,
        };
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.tips, dbTypes.Stores.withdrawalGroups], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const tr = yield tx.get(dbTypes.Stores.tips, tipId);
            if (!tr) {
                return;
            }
            if (tr.pickedUp) {
                return;
            }
            tr.pickedUp = true;
            tr.retryInfo = dbTypes.initRetryInfo(false);
            yield tx.put(dbTypes.Stores.tips, tr);
            yield tx.put(dbTypes.Stores.withdrawalGroups, withdrawalGroup);
            for (const p of planchets) {
                yield tx.put(dbTypes.Stores.planchets, p);
            }
        }));
        yield withdraw.processWithdrawGroup(ws, withdrawalGroupId);
    });
}
function acceptTip(ws, tipId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tipRecord = yield ws.db.get(dbTypes.Stores.tips, tipId);
        if (!tipRecord) {
            console.log("tip not found");
            return;
        }
        tipRecord.acceptedTimestamp = time.getTimestampNow();
        yield ws.db.put(dbTypes.Stores.tips, tipRecord);
        yield processTip(ws, tipId);
        return;
    });
}
exports.acceptTip = acceptTip;

});

unwrapExports(tip);
var tip_1 = tip.getTipStatus;
var tip_2 = tip.processTip;
var tip_3 = tip.acceptTip;

var refund = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });











const logger = new logging.Logger("refund.ts");
function incrementPurchaseQueryRefundRetry(ws, proposalId, err) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log("incrementing purchase refund query retry with error", err);
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.purchases], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const pr = yield tx.get(dbTypes.Stores.purchases, proposalId);
            if (!pr) {
                return;
            }
            if (!pr.refundStatusRetryInfo) {
                return;
            }
            pr.refundStatusRetryInfo.retryCounter++;
            dbTypes.updateRetryInfoTimeout(pr.refundStatusRetryInfo);
            pr.lastRefundStatusError = err;
            yield tx.put(dbTypes.Stores.purchases, pr);
        }));
        ws.notify({ type: "refund-status-error" /* RefundStatusOperationError */ });
    });
}
function getFullRefundFees(ws, refundPermissions) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (refundPermissions.length === 0) {
            throw Error("no refunds given");
        }
        const coin0 = yield ws.db.get(dbTypes.Stores.coins, refundPermissions[0].coin_pub);
        if (!coin0) {
            throw Error("coin not found");
        }
        let feeAcc = amounts.Amounts.getZero(amounts.Amounts.parseOrThrow(refundPermissions[0].refund_amount).currency);
        const denoms = yield ws.db
            .iterIndex(dbTypes.Stores.denominations.exchangeBaseUrlIndex, coin0.exchangeBaseUrl)
            .toArray();
        for (const rp of refundPermissions) {
            const coin = yield ws.db.get(dbTypes.Stores.coins, rp.coin_pub);
            if (!coin) {
                throw Error("coin not found");
            }
            const denom = yield ws.db.get(dbTypes.Stores.denominations, [
                coin0.exchangeBaseUrl,
                coin.denomPub,
            ]);
            if (!denom) {
                throw Error(`denom not found (${coin.denomPub})`);
            }
            // FIXME:  this assumes that the refund already happened.
            // When it hasn't, the refresh cost is inaccurate.  To fix this,
            // we need introduce a flag to tell if a coin was refunded or
            // refreshed normally (and what about incremental refunds?)
            const refundAmount = amounts.Amounts.parseOrThrow(rp.refund_amount);
            const refundFee = amounts.Amounts.parseOrThrow(rp.refund_fee);
            const refreshCost = refresh.getTotalRefreshCost(denoms, denom, amounts.Amounts.sub(refundAmount, refundFee).amount);
            feeAcc = amounts.Amounts.add(feeAcc, refreshCost, refundFee).amount;
        }
        return feeAcc;
    });
}
exports.getFullRefundFees = getFullRefundFees;
function getRefundKey(d) {
    return `{d.coin_pub}-{d.rtransaction_id}`;
}
function acceptRefundResponse(ws, proposalId, refundResponse, reason) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const refunds = refundResponse.refunds;
        const refundGroupId = talerCrypto.encodeCrock(naclFast.randomBytes(32));
        let numNewRefunds = 0;
        const finishedRefunds = [];
        const unfinishedRefunds = [];
        const failedRefunds = [];
        for (const rd of refunds) {
            if (rd.exchange_http_status === 200) {
                // FIXME: also verify signature if necessary.
                finishedRefunds.push(rd);
            }
            else if (rd.exchange_http_status >= 400 &&
                rd.exchange_http_status < 400) {
                failedRefunds.push(rd);
            }
            else {
                unfinishedRefunds.push(rd);
            }
        }
        const now = time.getTimestampNow();
        yield ws.db.runWithWriteTransaction([dbTypes.Stores.purchases, dbTypes.Stores.coins, dbTypes.Stores.refreshGroups, dbTypes.Stores.refundEvents], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const p = yield tx.get(dbTypes.Stores.purchases, proposalId);
            if (!p) {
                console.error("purchase not found, not adding refunds");
                return;
            }
            // Groups that newly failed/succeeded
            const changedGroups = {};
            for (const rd of failedRefunds) {
                const refundKey = getRefundKey();
                if (p.refundsFailed[refundKey]) {
                    continue;
                }
                if (!p.refundsFailed[refundKey]) {
                    p.refundsFailed[refundKey] = {
                        perm: rd,
                        refundGroupId,
                    };
                    numNewRefunds++;
                    changedGroups[refundGroupId] = true;
                }
                const oldPending = p.refundsPending[refundKey];
                if (oldPending) {
                    delete p.refundsPending[refundKey];
                    changedGroups[oldPending.refundGroupId] = true;
                }
            }
            for (const rd of unfinishedRefunds) {
                const refundKey = getRefundKey();
                if (!p.refundsPending[refundKey]) {
                    p.refundsPending[refundKey] = {
                        perm: rd,
                        refundGroupId,
                    };
                    numNewRefunds++;
                }
            }
            // Avoid duplicates
            const refreshCoinsMap = {};
            for (const rd of finishedRefunds) {
                const refundKey = getRefundKey();
                if (p.refundsDone[refundKey]) {
                    continue;
                }
                p.refundsDone[refundKey] = {
                    perm: rd,
                    refundGroupId,
                };
                const oldPending = p.refundsPending[refundKey];
                if (oldPending) {
                    delete p.refundsPending[refundKey];
                    changedGroups[oldPending.refundGroupId] = true;
                }
                else {
                    numNewRefunds++;
                }
                const c = yield tx.get(dbTypes.Stores.coins, rd.coin_pub);
                if (!c) {
                    console.warn("coin not found, can't apply refund");
                    return;
                }
                refreshCoinsMap[c.coinPub] = { coinPub: c.coinPub };
                logger.trace(`commiting refund ${refundKey} to coin ${c.coinPub}`);
                logger.trace(`coin amount before is ${amounts.Amounts.stringify(c.currentAmount)}`);
                logger.trace(`refund amount (via merchant) is ${refundKey}`);
                logger.trace(`refund fee (via merchant) is ${refundKey}`);
                const refundAmount = amounts.Amounts.parseOrThrow(rd.refund_amount);
                const refundFee = amounts.Amounts.parseOrThrow(rd.refund_fee);
                c.status = "dormant" /* Dormant */;
                c.currentAmount = amounts.Amounts.add(c.currentAmount, refundAmount).amount;
                c.currentAmount = amounts.Amounts.sub(c.currentAmount, refundFee).amount;
                logger.trace(`coin amount after is ${amounts.Amounts.stringify(c.currentAmount)}`);
                yield tx.put(dbTypes.Stores.coins, c);
            }
            // Are we done with querying yet, or do we need to do another round
            // after a retry delay?
            let queryDone = true;
            if (numNewRefunds === 0) {
                if (p.autoRefundDeadline &&
                    p.autoRefundDeadline.t_ms > now.t_ms) {
                    queryDone = false;
                }
            }
            else {
                p.refundGroups.push({
                    reason: "normal-refund" /* NormalRefund */,
                    refundGroupId,
                    timestampQueried: time.getTimestampNow(),
                });
            }
            if (Object.keys(unfinishedRefunds).length != 0) {
                queryDone = false;
            }
            if (queryDone) {
                p.timestampLastRefundStatus = now;
                p.lastRefundStatusError = undefined;
                p.refundStatusRetryInfo = dbTypes.initRetryInfo(false);
                p.refundStatusRequested = false;
                console.log("refund query done");
            }
            else {
                // No error, but we need to try again!
                p.timestampLastRefundStatus = now;
                p.refundStatusRetryInfo.retryCounter++;
                dbTypes.updateRetryInfoTimeout(p.refundStatusRetryInfo);
                p.lastRefundStatusError = undefined;
                console.log("refund query not done");
            }
            yield tx.put(dbTypes.Stores.purchases, p);
            const coinsPubsToBeRefreshed = Object.values(refreshCoinsMap);
            if (coinsPubsToBeRefreshed.length > 0) {
                yield refresh.createRefreshGroup(tx, coinsPubsToBeRefreshed, "refund" /* Refund */);
            }
            // Check if any of the refund groups are done, and we
            // can emit an corresponding event.
            for (const g of Object.keys(changedGroups)) {
                let groupDone = true;
                for (const pk of Object.keys(p.refundsPending)) {
                    const r = p.refundsPending[pk];
                    if (r.refundGroupId == g) {
                        groupDone = false;
                    }
                }
                if (groupDone) {
                    const refundEvent = {
                        proposalId,
                        refundGroupId: g,
                        timestamp: now,
                    };
                    yield tx.put(dbTypes.Stores.refundEvents, refundEvent);
                }
            }
        }));
        ws.notify({
            type: "refund-queried" /* RefundQueried */,
        });
    });
}
function startRefundQuery(ws, proposalId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const success = yield ws.db.runWithWriteTransaction([dbTypes.Stores.purchases], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const p = yield tx.get(dbTypes.Stores.purchases, proposalId);
            if (!p) {
                console.log("no purchase found for refund URL");
                return false;
            }
            p.refundStatusRequested = true;
            p.lastRefundStatusError = undefined;
            p.refundStatusRetryInfo = dbTypes.initRetryInfo();
            yield tx.put(dbTypes.Stores.purchases, p);
            return true;
        }));
        if (!success) {
            return;
        }
        ws.notify({
            type: "refund-started" /* RefundStarted */,
        });
        yield processPurchaseQueryRefund(ws, proposalId);
    });
}
/**
 * Accept a refund, return the contract hash for the contract
 * that was involved in the refund.
 */
function applyRefund(ws, talerRefundUri) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const parseResult = taleruri.parseRefundUri(talerRefundUri);
        console.log("applying refund", parseResult);
        if (!parseResult) {
            throw Error("invalid refund URI");
        }
        const purchase = yield ws.db.getIndexed(dbTypes.Stores.purchases.orderIdIndex, [
            parseResult.merchantBaseUrl,
            parseResult.orderId,
        ]);
        if (!purchase) {
            throw Error(`no purchase for the taler://refund/ URI (${talerRefundUri}) was found`);
        }
        logger.info("processing purchase for refund");
        yield startRefundQuery(ws, purchase.proposalId);
        return { contractTermsHash: purchase.contractData.contractTermsHash };
    });
}
exports.applyRefund = applyRefund;
function processPurchaseQueryRefund(ws, proposalId, forceNow = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const onOpErr = (e) => incrementPurchaseQueryRefundRetry(ws, proposalId, e);
        yield errors.guardOperationException(() => processPurchaseQueryRefundImpl(ws, proposalId, forceNow), onOpErr);
    });
}
exports.processPurchaseQueryRefund = processPurchaseQueryRefund;
function resetPurchaseQueryRefundRetry(ws, proposalId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield ws.db.mutate(dbTypes.Stores.purchases, proposalId, (x) => {
            if (x.refundStatusRetryInfo.active) {
                x.refundStatusRetryInfo = dbTypes.initRetryInfo();
            }
            return x;
        });
    });
}
function processPurchaseQueryRefundImpl(ws, proposalId, forceNow) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (forceNow) {
            yield resetPurchaseQueryRefundRetry(ws, proposalId);
        }
        const purchase = yield ws.db.get(dbTypes.Stores.purchases, proposalId);
        if (!purchase) {
            return;
        }
        if (!purchase.refundStatusRequested) {
            return;
        }
        const refundUrlObj = new URL("refund", purchase.contractData.merchantBaseUrl);
        refundUrlObj.searchParams.set("order_id", purchase.contractData.orderId);
        const refundUrl = refundUrlObj.href;
        let resp;
        try {
            resp = yield ws.http.get(refundUrl);
        }
        catch (e) {
            console.error("error downloading refund permission", e);
            throw e;
        }
        if (resp.status !== 200) {
            throw Error(`unexpected status code (${resp.status}) for /refund`);
        }
        const refundResponse = talerTypes.codecForMerchantRefundResponse().decode(yield resp.json());
        yield acceptRefundResponse(ws, proposalId, refundResponse);
    });
}

});

unwrapExports(refund);
var refund_1 = refund.getFullRefundFees;
var refund_2 = refund.applyRefund;
var refund_3 = refund.processPurchaseQueryRefund;

var transactions = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });




/**
 * Create an event ID from the type and the primary key for the event.
 */
function makeEventId(type, ...args) {
    return type + ";" + args.map((x) => encodeURIComponent(x)).join(";");
}
function getRefundStats(pr, refundGroupId) {
    let amountEffective = amounts.Amounts.getZero(pr.contractData.amount.currency);
    let amountInvalid = amounts.Amounts.getZero(pr.contractData.amount.currency);
    let amountRaw = amounts.Amounts.getZero(pr.contractData.amount.currency);
    for (const rk of Object.keys(pr.refundsDone)) {
        const perm = pr.refundsDone[rk].perm;
        if (pr.refundsDone[rk].refundGroupId !== refundGroupId) {
            continue;
        }
        amountEffective = amounts.Amounts.add(amountEffective, amounts.Amounts.parseOrThrow(perm.refund_amount)).amount;
        amountRaw = amounts.Amounts.add(amountRaw, amounts.Amounts.parseOrThrow(perm.refund_amount))
            .amount;
    }
    for (const rk of Object.keys(pr.refundsDone)) {
        const perm = pr.refundsDone[rk].perm;
        if (pr.refundsDone[rk].refundGroupId !== refundGroupId) {
            continue;
        }
        amountEffective = amounts.Amounts.sub(amountEffective, amounts.Amounts.parseOrThrow(perm.refund_fee)).amount;
    }
    for (const rk of Object.keys(pr.refundsFailed)) {
        const perm = pr.refundsDone[rk].perm;
        if (pr.refundsDone[rk].refundGroupId !== refundGroupId) {
            continue;
        }
        amountInvalid = amounts.Amounts.add(amountInvalid, amounts.Amounts.parseOrThrow(perm.refund_fee)).amount;
    }
    return {
        amountEffective,
        amountInvalid,
        amountRaw,
    };
}
/**
 * Retrive the full event history for this wallet.
 */
function getTransactions(ws, transactionsRequest) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const transactions = [];
        yield ws.db.runWithReadTransaction([
            dbTypes.Stores.currencies,
            dbTypes.Stores.coins,
            dbTypes.Stores.denominations,
            dbTypes.Stores.proposals,
            dbTypes.Stores.purchases,
            dbTypes.Stores.refreshGroups,
            dbTypes.Stores.reserves,
            dbTypes.Stores.reserveHistory,
            dbTypes.Stores.tips,
            dbTypes.Stores.withdrawalGroups,
            dbTypes.Stores.payEvents,
            dbTypes.Stores.planchets,
            dbTypes.Stores.refundEvents,
            dbTypes.Stores.reserveUpdatedEvents,
            dbTypes.Stores.recoupGroups,
        ], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            tx.iter(dbTypes.Stores.withdrawalGroups).forEach((wsr) => {
                if ((transactionsRequest === null || transactionsRequest === void 0 ? void 0 : transactionsRequest.currency) &&
                    wsr.rawWithdrawalAmount.currency != transactionsRequest.currency) {
                    return;
                }
                if (wsr.rawWithdrawalAmount.currency)
                    if (wsr.timestampFinish) {
                        transactions.push({
                            type: "withdrawal" /* Withdrawal */,
                            amountEffective: amounts.Amounts.stringify(wsr.denomsSel.totalWithdrawCost),
                            amountRaw: amounts.Amounts.stringify(wsr.denomsSel.totalCoinValue),
                            confirmed: true,
                            exchangeBaseUrl: wsr.exchangeBaseUrl,
                            pending: !wsr.timestampFinish,
                            timestamp: wsr.timestampStart,
                            transactionId: makeEventId("withdrawal" /* Withdrawal */, wsr.withdrawalGroupId),
                        });
                    }
            });
            tx.iter(dbTypes.Stores.reserves).forEach((r) => {
                if ((transactionsRequest === null || transactionsRequest === void 0 ? void 0 : transactionsRequest.currency) &&
                    r.currency != transactionsRequest.currency) {
                    return;
                }
                if (r.reserveStatus !== dbTypes.ReserveRecordStatus.WAIT_CONFIRM_BANK) {
                    return;
                }
                if (!r.bankInfo) {
                    return;
                }
                transactions.push({
                    type: "withdrawal" /* Withdrawal */,
                    confirmed: false,
                    amountRaw: amounts.Amounts.stringify(r.bankInfo.amount),
                    amountEffective: undefined,
                    exchangeBaseUrl: undefined,
                    pending: true,
                    timestamp: r.timestampCreated,
                    bankConfirmationUrl: r.bankInfo.confirmUrl,
                    transactionId: makeEventId("withdrawal" /* Withdrawal */, r.bankInfo.bankWithdrawalGroupId),
                });
            });
            tx.iter(dbTypes.Stores.proposals).forEachAsync((proposal) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!proposal.download) {
                    return;
                }
                if (proposal.proposalStatus !== "proposed" /* PROPOSED */) {
                    return;
                }
                const dl = proposal.download;
                const purchase = yield tx.get(dbTypes.Stores.purchases, proposal.proposalId);
                if (purchase) {
                    return;
                }
                transactions.push({
                    type: "payment" /* Payment */,
                    amountRaw: amounts.Amounts.stringify(dl.contractData.amount),
                    amountEffective: undefined,
                    status: "offered" /* Offered */,
                    pending: true,
                    timestamp: proposal.timestamp,
                    transactionId: makeEventId("payment" /* Payment */, proposal.proposalId),
                    info: {
                        fulfillmentUrl: dl.contractData.fulfillmentUrl,
                        merchant: {},
                        orderId: dl.contractData.orderId,
                        products: [],
                        summary: dl.contractData.summary,
                        summary_i18n: {},
                    },
                });
            }));
            tx.iter(dbTypes.Stores.purchases).forEachAsync((pr) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if ((transactionsRequest === null || transactionsRequest === void 0 ? void 0 : transactionsRequest.currency) &&
                    pr.contractData.amount.currency != transactionsRequest.currency) {
                    return;
                }
                const proposal = yield tx.get(dbTypes.Stores.proposals, pr.proposalId);
                if (!proposal) {
                    return;
                }
                transactions.push({
                    type: "payment" /* Payment */,
                    amountRaw: amounts.Amounts.stringify(pr.contractData.amount),
                    amountEffective: amounts.Amounts.stringify(pr.payCostInfo.totalCost),
                    status: pr.timestampFirstSuccessfulPay
                        ? "paid" /* Paid */
                        : "accepted" /* Accepted */,
                    pending: !pr.timestampFirstSuccessfulPay,
                    timestamp: pr.timestampAccept,
                    transactionId: makeEventId("payment" /* Payment */, pr.proposalId),
                    info: {
                        fulfillmentUrl: pr.contractData.fulfillmentUrl,
                        merchant: {},
                        orderId: pr.contractData.orderId,
                        products: [],
                        summary: pr.contractData.summary,
                        summary_i18n: {},
                    },
                });
                for (const rg of pr.refundGroups) {
                    const pending = Object.keys(pr.refundsDone).length > 0;
                    const stats = getRefundStats(pr, rg.refundGroupId);
                    transactions.push({
                        type: "refund" /* Refund */,
                        pending,
                        info: {
                            fulfillmentUrl: pr.contractData.fulfillmentUrl,
                            merchant: {},
                            orderId: pr.contractData.orderId,
                            products: [],
                            summary: pr.contractData.summary,
                            summary_i18n: {},
                        },
                        timestamp: rg.timestampQueried,
                        transactionId: makeEventId("refund" /* Refund */, `{rg.timestampQueried.t_ms}`),
                        refundedTransactionId: makeEventId("payment" /* Payment */, pr.proposalId),
                        amountEffective: amounts.Amounts.stringify(stats.amountEffective),
                        amountInvalid: amounts.Amounts.stringify(stats.amountInvalid),
                        amountRaw: amounts.Amounts.stringify(stats.amountRaw),
                    });
                }
            }));
        }));
        transactions.sort((h1, h2) => time.timestampCmp(h1.timestamp, h2.timestamp));
        return { transactions };
    });
}
exports.getTransactions = getTransactions;

});

unwrapExports(transactions);
var transactions_1 = transactions.getTransactions;

var wallet = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });










const reserves_2 = reserves;

const withdraw_2 = withdraw;












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
const logger = new logging.Logger("wallet.ts");
/**
 * The platform-independent wallet implementation.
 */
class Wallet {
    constructor(db, http, cryptoWorkerFactory) {
        this.timerGroup = new timer.TimerGroup();
        this.latch = new promiseUtils.AsyncCondition();
        this.stopped = false;
        this.memoRunRetryLoop = new asyncMemo.AsyncOpMemoSingle();
        this.ws = new state.InternalWalletState(db, http, cryptoWorkerFactory);
    }
    get db() {
        return this.ws.db;
    }
    getExchangePaytoUri(exchangeBaseUrl, supportedTargetTypes) {
        return exchanges.getExchangePaytoUri(this.ws, exchangeBaseUrl, supportedTargetTypes);
    }
    getWithdrawDetailsForAmount(exchangeBaseUrl, amount) {
        return withdraw.getExchangeWithdrawalInfo(this.ws, exchangeBaseUrl, amount);
    }
    addNotificationListener(f) {
        this.ws.addNotificationListener(f);
    }
    /**
     * Execute one operation based on the pending operation info record.
     */
    processOnePendingOperation(pending, forceNow = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("running pending", pending);
            switch (pending.type) {
                case "bug" /* Bug */:
                    // Nothing to do, will just be displayed to the user
                    return;
                case "exchange-update" /* ExchangeUpdate */:
                    yield exchanges.updateExchangeFromUrl(this.ws, pending.exchangeBaseUrl, forceNow);
                    break;
                case "refresh" /* Refresh */:
                    yield refresh.processRefreshGroup(this.ws, pending.refreshGroupId, forceNow);
                    break;
                case "reserve" /* Reserve */:
                    yield reserves.processReserve(this.ws, pending.reservePub, forceNow);
                    break;
                case "withdraw" /* Withdraw */:
                    yield withdraw_2.processWithdrawGroup(this.ws, pending.withdrawalGroupId, forceNow);
                    break;
                case "proposal-choice" /* ProposalChoice */:
                    // Nothing to do, user needs to accept/reject
                    break;
                case "proposal-download" /* ProposalDownload */:
                    yield pay.processDownloadProposal(this.ws, pending.proposalId, forceNow);
                    break;
                case "tip-choice" /* TipChoice */:
                    // Nothing to do, user needs to accept/reject
                    break;
                case "tip-pickup" /* TipPickup */:
                    yield tip.processTip(this.ws, pending.tipId, forceNow);
                    break;
                case "pay" /* Pay */:
                    yield pay.processPurchasePay(this.ws, pending.proposalId, forceNow);
                    break;
                case "refund-query" /* RefundQuery */:
                    yield refund.processPurchaseQueryRefund(this.ws, pending.proposalId, forceNow);
                    break;
                case "recoup" /* Recoup */:
                    yield recoup.processRecoupGroup(this.ws, pending.recoupGroupId, forceNow);
                    break;
                default:
                    assertUnreachable_1.assertUnreachable(pending);
            }
        });
    }
    /**
     * Process pending operations.
     */
    runPending(forceNow = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const onlyDue = !forceNow;
            const pendingOpsResponse = yield this.getPendingOperations({ onlyDue });
            for (const p of pendingOpsResponse.pendingOperations) {
                try {
                    yield this.processOnePendingOperation(p, forceNow);
                }
                catch (e) {
                    if (e instanceof errors.OperationFailedAndReportedError) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
                        logger.trace("no liveness-giving operations left");
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.runUntilDone();
            logger.trace("stopping after liveness-giving operations done");
            this.stop();
        });
    }
    /**
     * Process pending operations and wait for scheduled operations in
     * a loop until the wallet is stopped explicitly.
     */
    runRetryLoop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Make sure we only run one main loop at a time.
            return this.memoRunRetryLoop.memo(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
                        dt = time.durationMin({ d_ms: 5000 }, allPending.nextRetryDelay);
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
                            console.error(e);
                        }
                        this.ws.notify({ type: "wildcard" /* Wildcard */ });
                    }
                }
            }
            logger.trace("exiting wallet retry loop");
        });
    }
    /**
     * Insert the hard-coded defaults for exchanges, coins and
     * auditors into the database, unless these defaults have
     * already been applied.
     */
    fillDefaults() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.db.runWithWriteTransaction([dbTypes.Stores.config, dbTypes.Stores.currencies], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let applied = false;
                yield tx.iter(dbTypes.Stores.config).forEach((x) => {
                    if (x.key == "currencyDefaultsApplied" && x.value == true) {
                        applied = true;
                    }
                });
                if (!applied) {
                    for (const c of builtinCurrencies) {
                        yield tx.put(dbTypes.Stores.currencies, c);
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return pay.preparePayForUri(this.ws, talerPayUri);
        });
    }
    /**
     * Add a contract to the wallet and sign coins, and send them.
     */
    confirmPay(proposalId, sessionIdOverride) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return yield pay.confirmPay(this.ws, proposalId, sessionIdOverride);
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return yield reserves.processReserve(this.ws, reservePub);
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
    createReserve(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return reserves_2.createReserve(this.ws, req);
            }
            finally {
                this.latch.trigger();
            }
        });
    }
    /**
     * Mark an existing reserve as confirmed.  The wallet will start trying
     * to withdraw from that reserve.  This may not immediately succeed,
     * since the exchange might not know about the reserve yet, even though the
     * bank confirmed its creation.
     *
     * A confirmed reserve should be shown to the user in the UI, while
     * an unconfirmed reserve should be hidden.
     */
    confirmReserve(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return reserves_2.confirmReserve(this.ws, req);
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return exchanges.getExchangeTrust(this.ws, exchangeInfo);
        });
    }
    getWithdrawDetailsForUri(talerWithdrawUri, maybeSelectedExchange) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return withdraw.getWithdrawDetailsForUri(this.ws, talerWithdrawUri, maybeSelectedExchange);
        });
    }
    /**
     * Update or add exchange DB entry by fetching the /keys and /wire information.
     * Optionally link the reserve entry to the new or existing
     * exchange entry in then DB.
     */
    updateExchangeFromUrl(baseUrl, force = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return exchanges.updateExchangeFromUrl(this.ws, baseUrl, force);
            }
            finally {
                this.latch.trigger();
            }
        });
    }
    /**
     * Get detailed balance information, sliced by exchange and by currency.
     */
    getBalances() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.ws.memoGetBalance.memo(() => balance.getBalances(this.ws));
        });
    }
    refresh(oldCoinPub) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const refreshGroupId = yield this.db.runWithWriteTransaction([dbTypes.Stores.refreshGroups], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return yield refresh.createRefreshGroup(tx, [{ coinPub: oldCoinPub }], "manual" /* Manual */);
                }));
                yield refresh.processRefreshGroup(this.ws, refreshGroupId.refreshGroupId);
            }
            catch (e) {
                this.latch.trigger();
            }
        });
    }
    findExchange(exchangeBaseUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.db.get(dbTypes.Stores.exchanges, exchangeBaseUrl);
        });
    }
    /**
     * Retrive the full event history for this wallet.
     */
    getHistory(historyQuery) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return history.getHistory(this.ws, historyQuery);
        });
    }
    getPendingOperations({ onlyDue = false } = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.ws.memoGetPending.memo(() => pending.getPendingOperations(this.ws, { onlyDue }));
        });
    }
    acceptExchangeTermsOfService(exchangeBaseUrl, etag) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return exchanges.acceptExchangeTermsOfService(this.ws, exchangeBaseUrl, etag);
        });
    }
    getDenoms(exchangeUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const denoms = yield this.db
                .iterIndex(dbTypes.Stores.denominations.exchangeBaseUrlIndex, exchangeUrl)
                .toArray();
            return denoms;
        });
    }
    getExchanges() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.db.iter(dbTypes.Stores.exchanges).toArray();
        });
    }
    getCurrencies() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.db.iter(dbTypes.Stores.currencies).toArray();
        });
    }
    updateCurrency(currencyRecord) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            logger.trace("updating currency to", currencyRecord);
            yield this.db.put(dbTypes.Stores.currencies, currencyRecord);
        });
    }
    getReserves(exchangeBaseUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (exchangeBaseUrl) {
                return yield this.db
                    .iter(dbTypes.Stores.reserves)
                    .filter((r) => r.exchangeBaseUrl === exchangeBaseUrl);
            }
            else {
                return yield this.db.iter(dbTypes.Stores.reserves).toArray();
            }
        });
    }
    getCoinsForExchange(exchangeBaseUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .iter(dbTypes.Stores.coins)
                .filter((c) => c.exchangeBaseUrl === exchangeBaseUrl);
        });
    }
    getCoins() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.db.iter(dbTypes.Stores.coins).toArray();
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const m = {};
            yield this.db.iter(dbTypes.Stores.exchanges).forEach((x) => {
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
            yield this.db.iter(dbTypes.Stores.senderWires).forEach((x) => {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw Error("not implemented");
        });
    }
    /**
     * Accept a refund, return the contract hash for the contract
     * that was involved in the refund.
     */
    applyRefund(talerRefundUri) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return refund.applyRefund(this.ws, talerRefundUri);
        });
    }
    getPurchase(contractTermsHash) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.db.get(dbTypes.Stores.purchases, contractTermsHash);
        });
    }
    getFullRefundFees(refundPermissions) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return refund.getFullRefundFees(this.ws, refundPermissions);
        });
    }
    acceptTip(talerTipUri) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return tip.acceptTip(this.ws, talerTipUri);
            }
            catch (e) {
                this.latch.trigger();
            }
        });
    }
    getTipStatus(talerTipUri) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return tip.getTipStatus(this.ws, talerTipUri);
        });
    }
    abortFailedPayment(contractTermsHash) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw Error("not implemented");
        });
    }
    /**
     * Inform the wallet that the status of a reserve has changed (e.g. due to a
     * confirmation from the bank.).
     */
    handleNotifyReserve() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const reserves = yield this.db.iter(dbTypes.Stores.reserves).toArray();
            for (const r of reserves) {
                if (r.reserveStatus === dbTypes.ReserveRecordStatus.WAIT_CONFIRM_BANK) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // FIXME(#5845)
            // We currently do not garbage-collect the wallet database.  This might change
            // after the feature has been properly re-designed, and we have come up with a
            // strategy to test it.
        });
    }
    acceptWithdrawal(talerWithdrawUri, selectedExchange) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return reserves.createTalerWithdrawReserve(this.ws, talerWithdrawUri, selectedExchange);
            }
            finally {
                this.latch.trigger();
            }
        });
    }
    updateReserve(reservePub) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield reserves.forceQueryReserve(this.ws, reservePub);
            return yield this.ws.db.get(dbTypes.Stores.reserves, reservePub);
        });
    }
    getReserve(reservePub) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.ws.db.get(dbTypes.Stores.reserves, reservePub);
        });
    }
    refuseProposal(proposalId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return pay.refuseProposal(this.ws, proposalId);
        });
    }
    getPurchaseDetails(hc) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const purchase = yield this.db.get(dbTypes.Stores.purchases, hc);
            if (!purchase) {
                throw Error("unknown purchase");
            }
            const refundsDoneAmounts = Object.values(purchase.refundsDone).map((x) => amounts.Amounts.parseOrThrow(x.perm.refund_amount));
            const refundsPendingAmounts = Object.values(purchase.refundsPending).map((x) => amounts.Amounts.parseOrThrow(x.perm.refund_amount));
            const totalRefundAmount = amounts.Amounts.sum([
                ...refundsDoneAmounts,
                ...refundsPendingAmounts,
            ]).amount;
            const refundsDoneFees = Object.values(purchase.refundsDone).map((x) => amounts.Amounts.parseOrThrow(x.perm.refund_amount));
            const refundsPendingFees = Object.values(purchase.refundsPending).map((x) => amounts.Amounts.parseOrThrow(x.perm.refund_amount));
            const totalRefundFees = amounts.Amounts.sum([
                ...refundsDoneFees,
                ...refundsPendingFees,
            ]).amount;
            const totalFees = totalRefundFees;
            return {
                contractTerms: purchase.contractTermsRaw,
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.db.runWithWriteTransaction([dbTypes.Stores.coins], (tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const c = yield tx.get(dbTypes.Stores.coins, coinPub);
                if (!c) {
                    logger.warn(`coin ${coinPub} not found, won't suspend`);
                    return;
                }
                c.suspended = suspended;
                yield tx.put(dbTypes.Stores.coins, c);
            }));
        });
    }
    /**
     * Dump the public information of coins we have in an easy-to-process format.
     */
    dumpCoins() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const coins = yield this.db.iter(dbTypes.Stores.coins).toArray();
            const coinsJson = { coins: [] };
            for (const c of coins) {
                const denom = yield this.db.get(dbTypes.Stores.denominations, [
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
                    const ws = yield this.db.get(dbTypes.Stores.withdrawalGroups, cs.withdrawalGroupId);
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
                    denom_value: amounts.Amounts.stringify(denom.value),
                    exchange_base_url: c.exchangeBaseUrl,
                    refresh_parent_coin_pub: refreshParentCoinPub,
                    remaining_value: amounts.Amounts.stringify(c.currentAmount),
                    withdrawal_reserve_pub: withdrawalReservePub,
                    coin_suspended: c.suspended,
                });
            }
            return coinsJson;
        });
    }
    getTransactions(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return transactions.getTransactions(this.ws, request);
        });
    }
}
exports.Wallet = Wallet;

});

unwrapExports(wallet);
var wallet_1 = wallet.Wallet;

var errors$1 = createCommonjsModule(function (module, exports) {
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
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable: max-classes-per-file max-line-length */
var messages = {
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
var AbortError = /** @class */ (function (_super) {
    __extends(AbortError, _super);
    function AbortError(message) {
        if (message === void 0) { message = messages.AbortError; }
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, ConstraintError.prototype);
        _this.name = "AbortError";
        _this.message = message;
        return _this;
    }
    return AbortError;
}(Error));
exports.AbortError = AbortError;
var ConstraintError = /** @class */ (function (_super) {
    __extends(ConstraintError, _super);
    function ConstraintError(message) {
        if (message === void 0) { message = messages.ConstraintError; }
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, ConstraintError.prototype);
        _this.name = "ConstraintError";
        _this.message = message;
        return _this;
    }
    return ConstraintError;
}(Error));
exports.ConstraintError = ConstraintError;
var DataCloneError = /** @class */ (function (_super) {
    __extends(DataCloneError, _super);
    function DataCloneError(message) {
        if (message === void 0) { message = messages.DataCloneError; }
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, DataCloneError.prototype);
        _this.name = "DataCloneError";
        _this.message = message;
        return _this;
    }
    return DataCloneError;
}(Error));
exports.DataCloneError = DataCloneError;
var DataError = /** @class */ (function (_super) {
    __extends(DataError, _super);
    function DataError(message) {
        if (message === void 0) { message = messages.DataError; }
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, DataError.prototype);
        _this.name = "DataError";
        _this.message = message;
        return _this;
    }
    return DataError;
}(Error));
exports.DataError = DataError;
var InvalidAccessError = /** @class */ (function (_super) {
    __extends(InvalidAccessError, _super);
    function InvalidAccessError(message) {
        if (message === void 0) { message = messages.InvalidAccessError; }
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, InvalidAccessError.prototype);
        _this.name = "InvalidAccessError";
        _this.message = message;
        return _this;
    }
    return InvalidAccessError;
}(Error));
exports.InvalidAccessError = InvalidAccessError;
var InvalidStateError = /** @class */ (function (_super) {
    __extends(InvalidStateError, _super);
    function InvalidStateError(message) {
        if (message === void 0) { message = messages.InvalidStateError; }
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, InvalidStateError.prototype);
        _this.name = "InvalidStateError";
        _this.message = message;
        return _this;
    }
    return InvalidStateError;
}(Error));
exports.InvalidStateError = InvalidStateError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        if (message === void 0) { message = messages.NotFoundError; }
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, NotFoundError.prototype);
        _this.name = "NotFoundError";
        _this.message = message;
        return _this;
    }
    return NotFoundError;
}(Error));
exports.NotFoundError = NotFoundError;
var ReadOnlyError = /** @class */ (function (_super) {
    __extends(ReadOnlyError, _super);
    function ReadOnlyError(message) {
        if (message === void 0) { message = messages.ReadOnlyError; }
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, ReadOnlyError.prototype);
        _this.name = "ReadOnlyError";
        _this.message = message;
        return _this;
    }
    return ReadOnlyError;
}(Error));
exports.ReadOnlyError = ReadOnlyError;
var TransactionInactiveError = /** @class */ (function (_super) {
    __extends(TransactionInactiveError, _super);
    function TransactionInactiveError(message) {
        if (message === void 0) { message = messages.TransactionInactiveError; }
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, TransactionInactiveError.prototype);
        _this.name = "TransactionInactiveError";
        _this.message = message;
        return _this;
    }
    return TransactionInactiveError;
}(Error));
exports.TransactionInactiveError = TransactionInactiveError;
var VersionError = /** @class */ (function (_super) {
    __extends(VersionError, _super);
    function VersionError(message) {
        if (message === void 0) { message = messages.VersionError; }
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, VersionError.prototype);
        _this.name = "VersionError";
        _this.message = message;
        return _this;
    }
    return VersionError;
}(Error));
exports.VersionError = VersionError;

});

unwrapExports(errors$1);
var errors_1$1 = errors$1.AbortError;
var errors_2$1 = errors$1.ConstraintError;
var errors_3$1 = errors$1.DataCloneError;
var errors_4$1 = errors$1.DataError;
var errors_5 = errors$1.InvalidAccessError;
var errors_6 = errors$1.InvalidStateError;
var errors_7 = errors$1.NotFoundError;
var errors_8 = errors$1.ReadOnlyError;
var errors_9 = errors$1.TransactionInactiveError;
var errors_10 = errors$1.VersionError;

var valueToKey_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

// https://w3c.github.io/IndexedDB/#convert-a-value-to-a-input
function valueToKey(input, seen) {
    if (typeof input === "number") {
        if (isNaN(input)) {
            throw new errors$1.DataError();
        }
        return input;
    }
    else if (input instanceof Date) {
        var ms = input.valueOf();
        if (isNaN(ms)) {
            throw new errors$1.DataError();
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
            throw new errors$1.DataError();
        }
        seen.add(input);
        var keys = [];
        for (var i = 0; i < input.length; i++) {
            var hop = input.hasOwnProperty(i);
            if (!hop) {
                throw new errors$1.DataError();
            }
            var entry = input[i];
            var key = valueToKey(entry, seen);
            keys.push(key);
        }
        return keys;
    }
    else {
        throw new errors$1.DataError();
    }
}
exports.default = valueToKey;

});

unwrapExports(valueToKey_1);

var cmp = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });


var getType = function (x) {
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
    throw new errors$1.DataError();
};
// https://w3c.github.io/IndexedDB/#compare-two-keys
var compareKeys = function (first, second) {
    if (second === undefined) {
        throw new TypeError();
    }
    first = valueToKey_1.default(first);
    second = valueToKey_1.default(second);
    var t1 = getType(first);
    var t2 = getType(second);
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
        var length = Math.min(first.length, second.length);
        for (var i = 0; i < length; i++) {
            var result = compareKeys(first[i], second[i]);
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
exports.default = compareKeys;

});

unwrapExports(cmp);

var BridgeIDBKeyRange_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });



// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#range-concept
var BridgeIDBKeyRange = /** @class */ (function () {
    function BridgeIDBKeyRange(lower, upper, lowerOpen, upperOpen) {
        this.lower = lower;
        this.upper = upper;
        this.lowerOpen = lowerOpen;
        this.upperOpen = upperOpen;
    }
    BridgeIDBKeyRange.only = function (value) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        value = valueToKey_1.default(value);
        return new BridgeIDBKeyRange(value, value, false, false);
    };
    BridgeIDBKeyRange.lowerBound = function (lower, open) {
        if (open === void 0) { open = false; }
        if (arguments.length === 0) {
            throw new TypeError();
        }
        lower = valueToKey_1.default(lower);
        return new BridgeIDBKeyRange(lower, undefined, open, true);
    };
    BridgeIDBKeyRange.upperBound = function (upper, open) {
        if (open === void 0) { open = false; }
        if (arguments.length === 0) {
            throw new TypeError();
        }
        upper = valueToKey_1.default(upper);
        return new BridgeIDBKeyRange(undefined, upper, true, open);
    };
    BridgeIDBKeyRange.bound = function (lower, upper, lowerOpen, upperOpen) {
        if (lowerOpen === void 0) { lowerOpen = false; }
        if (upperOpen === void 0) { upperOpen = false; }
        if (arguments.length < 2) {
            throw new TypeError();
        }
        var cmpResult = cmp.default(lower, upper);
        if (cmpResult === 1 || (cmpResult === 0 && (lowerOpen || upperOpen))) {
            throw new errors$1.DataError();
        }
        lower = valueToKey_1.default(lower);
        upper = valueToKey_1.default(upper);
        return new BridgeIDBKeyRange(lower, upper, lowerOpen, upperOpen);
    };
    // https://w3c.github.io/IndexedDB/#dom-idbkeyrange-includes
    BridgeIDBKeyRange.prototype.includes = function (key) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        key = valueToKey_1.default(key);
        if (this.lower !== undefined) {
            var cmpResult = cmp.default(this.lower, key);
            if (cmpResult === 1 || (cmpResult === 0 && this.lowerOpen)) {
                return false;
            }
        }
        if (this.upper !== undefined) {
            var cmpResult = cmp.default(this.upper, key);
            if (cmpResult === -1 || (cmpResult === 0 && this.upperOpen)) {
                return false;
            }
        }
        return true;
    };
    BridgeIDBKeyRange.prototype.toString = function () {
        return "[object IDBKeyRange]";
    };
    BridgeIDBKeyRange._valueToKeyRange = function (value, nullDisallowedFlag) {
        if (nullDisallowedFlag === void 0) { nullDisallowedFlag = false; }
        if (value instanceof BridgeIDBKeyRange) {
            return value;
        }
        if (value === null || value === undefined) {
            if (nullDisallowedFlag) {
                throw new errors$1.DataError();
            }
            return new BridgeIDBKeyRange(undefined, undefined, false, false);
        }
        var key = valueToKey_1.default(value);
        return BridgeIDBKeyRange.only(key);
    };
    return BridgeIDBKeyRange;
}());
exports.default = BridgeIDBKeyRange;

});

unwrapExports(BridgeIDBKeyRange_1);

var structuredClone_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.structuredClone = structuredClone;
exports.default = structuredClone;

});

unwrapExports(structuredClone_1);
var structuredClone_2 = structuredClone_1.structuredClone;

var backendInterface = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
var ResultLevel;
(function (ResultLevel) {
    ResultLevel[ResultLevel["OnlyCount"] = 0] = "OnlyCount";
    ResultLevel[ResultLevel["OnlyKeys"] = 1] = "OnlyKeys";
    ResultLevel[ResultLevel["Full"] = 2] = "Full";
})(ResultLevel = exports.ResultLevel || (exports.ResultLevel = {}));
var StoreLevel;
(function (StoreLevel) {
    StoreLevel[StoreLevel["NoOverwrite"] = 0] = "NoOverwrite";
    StoreLevel[StoreLevel["AllowOverwrite"] = 1] = "AllowOverwrite";
    StoreLevel[StoreLevel["UpdateExisting"] = 2] = "UpdateExisting";
})(StoreLevel = exports.StoreLevel || (exports.StoreLevel = {}));

});

unwrapExports(backendInterface);
var backendInterface_1 = backendInterface.ResultLevel;
var backendInterface_2 = backendInterface.StoreLevel;

var BridgeIDBCursor_1 = createCommonjsModule(function (module, exports) {
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
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });








/**
 * http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#cursor
 */
var BridgeIDBCursor = /** @class */ (function () {
    function BridgeIDBCursor(source, objectStoreName, indexName, range, direction, request, keyOnly) {
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
    Object.defineProperty(BridgeIDBCursor.prototype, "_effectiveObjectStore", {
        get: function () {
            if (this.source instanceof BridgeIDBObjectStore_1.default) {
                return this.source;
            }
            return this.source.objectStore;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBCursor.prototype, "_backend", {
        get: function () {
            return this._source._backend;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBCursor.prototype, "source", {
        // Read only properties
        get: function () {
            return this._source;
        },
        set: function (val) {
            /* For babel */
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBCursor.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        set: function (val) {
            /* For babel */
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBCursor.prototype, "key", {
        get: function () {
            return this._key;
        },
        set: function (val) {
            /* For babel */
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBCursor.prototype, "primaryKey", {
        get: function () {
            return this._primaryKey;
        },
        set: function (val) {
            /* For babel */
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBCursor.prototype, "_isValueCursor", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * https://w3c.github.io/IndexedDB/#iterate-a-cursor
     */
    BridgeIDBCursor.prototype._iterate = function (key, primaryKey) {
        return __awaiter(this, void 0, void 0, function () {
            var recordGetRequest, btx, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        BridgeIDBFactory_1.default.enableTracing &&
                            console.log("iterating cursor os=" + this._objectStoreName + ",idx=" + this._indexName);
                        BridgeIDBFactory_1.default.enableTracing && console.log("cursor type ", this.toString());
                        recordGetRequest = {
                            direction: this.direction,
                            indexName: this._indexName,
                            lastIndexPosition: this._indexPosition,
                            lastObjectStorePosition: this._objectStorePosition,
                            limit: 1,
                            range: this._range,
                            objectStoreName: this._objectStoreName,
                            advanceIndexKey: key,
                            advancePrimaryKey: primaryKey,
                            resultLevel: this._keyOnly ? backendInterface.ResultLevel.OnlyKeys : backendInterface.ResultLevel.Full,
                        };
                        btx = this.source._confirmActiveTransaction().btx;
                        return [4 /*yield*/, this._backend.getRecords(btx, recordGetRequest)];
                    case 1:
                        response = _a.sent();
                        if (response.count === 0) {
                            if (BridgeIDBFactory_1.default.enableTracing) {
                                console.log("cursor is returning empty result");
                            }
                            this._gotValue = false;
                            return [2 /*return*/, null];
                        }
                        if (response.count !== 1) {
                            throw Error("invariant failed");
                        }
                        if (BridgeIDBFactory_1.default.enableTracing) {
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
                        this._objectStorePosition = structuredClone_1.default(response.primaryKeys[0]);
                        if (response.indexKeys !== undefined && response.indexKeys.length > 0) {
                            this._indexPosition = structuredClone_1.default(response.indexKeys[0]);
                        }
                        return [2 /*return*/, this];
                }
            });
        });
    };
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-update-IDBRequest-any-value
    BridgeIDBCursor.prototype.update = function (value) {
        var _this = this;
        if (value === undefined) {
            throw new TypeError();
        }
        var transaction = this._effectiveObjectStore.transaction;
        if (transaction._state !== "active") {
            throw new errors$1.TransactionInactiveError();
        }
        if (transaction.mode === "readonly") {
            throw new errors$1.ReadOnlyError();
        }
        if (this._effectiveObjectStore._deleted) {
            throw new errors$1.InvalidStateError();
        }
        if (!(this.source instanceof BridgeIDBObjectStore_1.default) &&
            this.source._deleted) {
            throw new errors$1.InvalidStateError();
        }
        if (!this._gotValue || !this._isValueCursor) {
            throw new errors$1.InvalidStateError();
        }
        var storeReq = {
            key: this._primaryKey,
            value: value,
            objectStoreName: this._objectStoreName,
            storeLevel: backendInterface.StoreLevel.UpdateExisting,
        };
        var operation = function () { return __awaiter(_this, void 0, void 0, function () {
            var btx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (BridgeIDBFactory_1.default.enableTracing) {
                            console.log("updating at cursor");
                        }
                        btx = this.source._confirmActiveTransaction().btx;
                        return [4 /*yield*/, this._backend.storeRecord(btx, storeReq)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        return transaction._execRequestAsync({
            operation: operation,
            source: this,
        });
    };
    /**
     * http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-advance-void-unsigned-long-count
     */
    BridgeIDBCursor.prototype.advance = function (count) {
        throw Error("not implemented");
    };
    /**
     * http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-continue-void-any-key
     */
    BridgeIDBCursor.prototype.continue = function (key) {
        var _this = this;
        var transaction = this._effectiveObjectStore.transaction;
        if (transaction._state !== "active") {
            throw new errors$1.TransactionInactiveError();
        }
        if (this._effectiveObjectStore._deleted) {
            throw new errors$1.InvalidStateError();
        }
        if (!(this.source instanceof BridgeIDBObjectStore_1.default) &&
            this.source._deleted) {
            throw new errors$1.InvalidStateError();
        }
        if (!this._gotValue) {
            throw new errors$1.InvalidStateError();
        }
        if (key !== undefined) {
            key = valueToKey_1.default(key);
            var lastKey = this._indexName === undefined
                ? this._objectStorePosition
                : this._indexPosition;
            var cmpResult = cmp.default(key, lastKey);
            if ((cmpResult <= 0 &&
                (this.direction === "next" || this.direction === "nextunique")) ||
                (cmpResult >= 0 &&
                    (this.direction === "prev" || this.direction === "prevunique"))) {
                throw new errors$1.DataError();
            }
        }
        if (this._request) {
            this._request.readyState = "pending";
        }
        var operation = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._iterate(key)];
            });
        }); };
        transaction._execRequestAsync({
            operation: operation,
            request: this._request,
            source: this.source,
        });
        this._gotValue = false;
    };
    // https://w3c.github.io/IndexedDB/#dom-idbcursor-continueprimarykey
    BridgeIDBCursor.prototype.continuePrimaryKey = function (key, primaryKey) {
        throw Error("not implemented");
    };
    BridgeIDBCursor.prototype.delete = function () {
        var _this = this;
        var transaction = this._effectiveObjectStore.transaction;
        if (transaction._state !== "active") {
            throw new errors$1.TransactionInactiveError();
        }
        if (transaction.mode === "readonly") {
            throw new errors$1.ReadOnlyError();
        }
        if (this._effectiveObjectStore._deleted) {
            throw new errors$1.InvalidStateError();
        }
        if (!(this.source instanceof BridgeIDBObjectStore_1.default) &&
            this.source._deleted) {
            throw new errors$1.InvalidStateError();
        }
        if (!this._gotValue || !this._isValueCursor) {
            throw new errors$1.InvalidStateError();
        }
        var operation = function () { return __awaiter(_this, void 0, void 0, function () {
            var btx;
            return __generator(this, function (_a) {
                btx = this.source._confirmActiveTransaction().btx;
                this._backend.deleteRecord(btx, this._objectStoreName, BridgeIDBKeyRange_1.default._valueToKeyRange(this._primaryKey));
                return [2 /*return*/];
            });
        }); };
        return transaction._execRequestAsync({
            operation: operation,
            source: this,
        });
    };
    BridgeIDBCursor.prototype.toString = function () {
        return "[object IDBCursor]";
    };
    return BridgeIDBCursor;
}());
exports.BridgeIDBCursor = BridgeIDBCursor;
exports.default = BridgeIDBCursor;

});

unwrapExports(BridgeIDBCursor_1);
var BridgeIDBCursor_2 = BridgeIDBCursor_1.BridgeIDBCursor;

var BridgeIDBCursorWithValue_1 = createCommonjsModule(function (module, exports) {
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
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });

var BridgeIDBCursorWithValue = /** @class */ (function (_super) {
    __extends(BridgeIDBCursorWithValue, _super);
    function BridgeIDBCursorWithValue(source, objectStoreName, indexName, range, direction, request) {
        return _super.call(this, source, objectStoreName, indexName, range, direction, request, false) || this;
    }
    Object.defineProperty(BridgeIDBCursorWithValue.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBCursorWithValue.prototype, "_isValueCursor", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    BridgeIDBCursorWithValue.prototype.toString = function () {
        return "[object IDBCursorWithValue]";
    };
    return BridgeIDBCursorWithValue;
}(BridgeIDBCursor_1.default));
exports.default = BridgeIDBCursorWithValue;

});

unwrapExports(BridgeIDBCursorWithValue_1);

var FakeEventTarget_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

var stopped = function (event, listener) {
    return (event.immediatePropagationStopped ||
        (event.eventPhase === event.CAPTURING_PHASE &&
            listener.capture === false) ||
        (event.eventPhase === event.BUBBLING_PHASE && listener.capture === true));
};
// http://www.w3.org/TR/dom/#concept-event-listener-invoke
var invokeEventListeners = function (event, obj) {
    event.currentTarget = obj;
    // The callback might cause obj.listeners to mutate as we traverse it.
    // Take a copy of the array so that nothing sneaks in and we don't lose
    // our place.
    for (var _i = 0, _a = obj.listeners.slice(); _i < _a.length; _i++) {
        var listener = _a[_i];
        if (event.type !== listener.type || stopped(event, listener)) {
            continue;
        }
        // @ts-ignore
        listener.callback.call(event.currentTarget, event);
    }
    var typeToProp = {
        abort: "onabort",
        blocked: "onblocked",
        complete: "oncomplete",
        error: "onerror",
        success: "onsuccess",
        upgradeneeded: "onupgradeneeded",
        versionchange: "onversionchange",
    };
    var prop = typeToProp[event.type];
    if (prop === undefined) {
        throw new Error("Unknown event type: \"" + event.type + "\"");
    }
    var callback = event.currentTarget[prop];
    if (callback) {
        var listener = {
            callback: callback,
            capture: false,
            type: event.type,
        };
        if (!stopped(event, listener)) {
            // @ts-ignore
            listener.callback.call(event.currentTarget, event);
        }
    }
};
var FakeEventTarget = /** @class */ (function () {
    function FakeEventTarget() {
        this.listeners = [];
    }
    FakeEventTarget.prototype.addEventListener = function (type, callback, capture) {
        if (capture === void 0) { capture = false; }
        this.listeners.push({
            callback: callback,
            capture: capture,
            type: type,
        });
    };
    FakeEventTarget.prototype.removeEventListener = function (type, callback, capture) {
        if (capture === void 0) { capture = false; }
        var i = this.listeners.findIndex(function (listener) {
            return (listener.type === type &&
                listener.callback === callback &&
                listener.capture === capture);
        });
        this.listeners.splice(i, 1);
    };
    // http://www.w3.org/TR/dom/#dispatching-events
    FakeEventTarget.prototype.dispatchEvent = function (event) {
        if (event.dispatched || !event.initialized) {
            throw new errors$1.InvalidStateError("The object is in an invalid state.");
        }
        event.isTrusted = false;
        event.dispatched = true;
        event.target = this;
        // NOT SURE WHEN THIS SHOULD BE SET        event.eventPath = [];
        event.eventPhase = event.CAPTURING_PHASE;
        if (FakeEventTarget.enableTracing) {
            console.log("dispatching '" + event.type + "' event along path with " + event.eventPath.length + " elements");
        }
        for (var _i = 0, _a = event.eventPath; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (!event.propagationStopped) {
                invokeEventListeners(event, obj);
            }
        }
        event.eventPhase = event.AT_TARGET;
        if (!event.propagationStopped) {
            invokeEventListeners(event, event.target);
        }
        if (event.bubbles) {
            event.eventPath.reverse();
            event.eventPhase = event.BUBBLING_PHASE;
            if (event.eventPath.length === 0 && event.type === "error") {
                console.error("Unhandled error event: ", event.target);
            }
            for (var _b = 0, _c = event.eventPath; _b < _c.length; _b++) {
                var obj = _c[_b];
                if (!event.propagationStopped) {
                    invokeEventListeners(event, obj);
                }
            }
        }
        event.dispatched = false;
        event.eventPhase = event.NONE;
        event.currentTarget = null;
        if (event.canceled) {
            return false;
        }
        return true;
    };
    FakeEventTarget.enableTracing = false;
    return FakeEventTarget;
}());
exports.default = FakeEventTarget;

});

unwrapExports(FakeEventTarget_1);

var FakeEvent = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
var Event = /** @class */ (function () {
    function Event(type, eventInitDict) {
        if (eventInitDict === void 0) { eventInitDict = {}; }
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
        this.type = type;
        this.bubbles =
            eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
        this.cancelable =
            eventInitDict.cancelable !== undefined
                ? eventInitDict.cancelable
                : false;
    }
    Event.prototype.preventDefault = function () {
        if (this.cancelable) {
            this.canceled = true;
        }
    };
    Event.prototype.stopPropagation = function () {
        this.propagationStopped = true;
    };
    Event.prototype.stopImmediatePropagation = function () {
        this.propagationStopped = true;
        this.immediatePropagationStopped = true;
    };
    return Event;
}());
exports.Event = Event;
exports.default = Event;

});

unwrapExports(FakeEvent);
var FakeEvent_1 = FakeEvent.Event;

var BridgeIDBRequest_1 = createCommonjsModule(function (module, exports) {
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
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });



var BridgeIDBRequest = /** @class */ (function (_super) {
    __extends(BridgeIDBRequest, _super);
    function BridgeIDBRequest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._result = null;
        _this._error = null;
        _this.source = null;
        _this.transaction = null;
        _this.readyState = "pending";
        _this.onsuccess = null;
        _this.onerror = null;
        return _this;
    }
    Object.defineProperty(BridgeIDBRequest.prototype, "error", {
        get: function () {
            if (this.readyState === "pending") {
                throw new errors$1.InvalidStateError();
            }
            return this._error;
        },
        set: function (value) {
            this._error = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBRequest.prototype, "result", {
        get: function () {
            if (this.readyState === "pending") {
                throw new errors$1.InvalidStateError();
            }
            return this._result;
        },
        set: function (value) {
            this._result = value;
        },
        enumerable: true,
        configurable: true
    });
    BridgeIDBRequest.prototype.toString = function () {
        return "[object IDBRequest]";
    };
    BridgeIDBRequest.prototype._finishWithError = function (err) {
        this.result = undefined;
        this.readyState = "done";
        this.error = new Error(err.message);
        this.error.name = err.name;
        var event = new FakeEvent.default("error", {
            bubbles: true,
            cancelable: true,
        });
        event.eventPath = [];
        this.dispatchEvent(event);
    };
    BridgeIDBRequest.prototype._finishWithResult = function (result) {
        this.result = result;
        this.readyState = "done";
        var event = new FakeEvent.default("success");
        event.eventPath = [];
        this.dispatchEvent(event);
    };
    return BridgeIDBRequest;
}(FakeEventTarget_1.default));
exports.default = BridgeIDBRequest;

});

unwrapExports(BridgeIDBRequest_1);

var BridgeIDBIndex_1 = createCommonjsModule(function (module, exports) {
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
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });







var confirmActiveTransaction = function (index) {
    if (index._deleted || index.objectStore._deleted) {
        throw new errors$1.InvalidStateError();
    }
    if (index.objectStore.transaction._state !== "active") {
        throw new errors$1.TransactionInactiveError();
    }
    return index.objectStore.transaction;
};
// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#idl-def-IDBIndex
var BridgeIDBIndex = /** @class */ (function () {
    function BridgeIDBIndex(objectStore, name) {
        this._deleted = false;
        this._name = name;
        this.objectStore = objectStore;
    }
    Object.defineProperty(BridgeIDBIndex.prototype, "_schema", {
        get: function () {
            return this.objectStore.transaction.db._schema;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBIndex.prototype, "keyPath", {
        get: function () {
            return this._schema.objectStores[this.objectStore.name].indexes[this._name].keyPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBIndex.prototype, "multiEntry", {
        get: function () {
            return this._schema.objectStores[this.objectStore.name].indexes[this._name].multiEntry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBIndex.prototype, "unique", {
        get: function () {
            return this._schema.objectStores[this.objectStore.name].indexes[this._name].unique;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBIndex.prototype, "_backend", {
        get: function () {
            return this.objectStore._backend;
        },
        enumerable: true,
        configurable: true
    });
    BridgeIDBIndex.prototype._confirmActiveTransaction = function () {
        return this.objectStore._confirmActiveTransaction();
    };
    Object.defineProperty(BridgeIDBIndex.prototype, "name", {
        get: function () {
            return this._name;
        },
        // https://w3c.github.io/IndexedDB/#dom-idbindex-name
        set: function (name) {
            var transaction = this.objectStore.transaction;
            if (!transaction.db._runningVersionchangeTransaction) {
                throw new errors$1.InvalidStateError();
            }
            if (transaction._state !== "active") {
                throw new errors$1.TransactionInactiveError();
            }
            var btx = this._confirmActiveTransaction().btx;
            var oldName = this._name;
            var newName = String(name);
            if (newName === oldName) {
                return;
            }
            this._backend.renameIndex(btx, this.objectStore.name, oldName, newName);
            if (this.objectStore.indexNames.indexOf(name) >= 0) {
                throw new errors$1.ConstraintError();
            }
        },
        enumerable: true,
        configurable: true
    });
    // tslint:disable-next-line max-line-length
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-openCursor-IDBRequest-any-range-IDBCursorDirection-direction
    BridgeIDBIndex.prototype.openCursor = function (range, direction) {
        var _this = this;
        if (direction === void 0) { direction = "next"; }
        confirmActiveTransaction(this);
        if (range === null) {
            range = undefined;
        }
        if (range !== undefined && !(range instanceof BridgeIDBKeyRange_1.default)) {
            range = BridgeIDBKeyRange_1.default.only(valueToKey_1.default(range));
        }
        var request = new BridgeIDBRequest_1.default();
        request.source = this;
        request.transaction = this.objectStore.transaction;
        var cursor = new BridgeIDBCursorWithValue_1.default(this, this.objectStore.name, this._name, range, direction, request);
        var operation = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, cursor._iterate()];
            });
        }); };
        return this.objectStore.transaction._execRequestAsync({
            operation: operation,
            request: request,
            source: this,
        });
    };
    // tslint:disable-next-line max-line-length
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-openKeyCursor-IDBRequest-any-range-IDBCursorDirection-direction
    BridgeIDBIndex.prototype.openKeyCursor = function (range, direction) {
        if (direction === void 0) { direction = "next"; }
        confirmActiveTransaction(this);
        if (range === null) {
            range = undefined;
        }
        if (range !== undefined && !(range instanceof BridgeIDBKeyRange_1.default)) {
            range = BridgeIDBKeyRange_1.default.only(valueToKey_1.default(range));
        }
        var request = new BridgeIDBRequest_1.default();
        request.source = this;
        request.transaction = this.objectStore.transaction;
        var cursor = new BridgeIDBCursor_1.default(this, this.objectStore.name, this._name, range, direction, request, true);
        return this.objectStore.transaction._execRequestAsync({
            operation: cursor._iterate.bind(cursor),
            request: request,
            source: this,
        });
    };
    BridgeIDBIndex.prototype.get = function (key) {
        var _this = this;
        confirmActiveTransaction(this);
        if (!(key instanceof BridgeIDBKeyRange_1.default)) {
            key = BridgeIDBKeyRange_1.default._valueToKeyRange(key);
        }
        var getReq = {
            direction: "next",
            indexName: this._name,
            limit: 1,
            range: key,
            objectStoreName: this.objectStore._name,
            resultLevel: backendInterface.ResultLevel.Full,
        };
        var operation = function () { return __awaiter(_this, void 0, void 0, function () {
            var btx, result, values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        btx = this._confirmActiveTransaction().btx;
                        return [4 /*yield*/, this._backend.getRecords(btx, getReq)];
                    case 1:
                        result = _a.sent();
                        if (result.count == 0) {
                            return [2 /*return*/, undefined];
                        }
                        values = result.values;
                        if (!values) {
                            throw Error("invariant violated");
                        }
                        return [2 /*return*/, values[0]];
                }
            });
        }); };
        return this.objectStore.transaction._execRequestAsync({
            operation: operation,
            source: this,
        });
    };
    // http://w3c.github.io/IndexedDB/#dom-idbindex-getall
    BridgeIDBIndex.prototype.getAll = function (query, count) {
        throw Error("not implemented");
    };
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-getKey-IDBRequest-any-key
    BridgeIDBIndex.prototype.getKey = function (key) {
        var _this = this;
        confirmActiveTransaction(this);
        if (!(key instanceof BridgeIDBKeyRange_1.default)) {
            key = BridgeIDBKeyRange_1.default._valueToKeyRange(key);
        }
        var getReq = {
            direction: "next",
            indexName: this._name,
            limit: 1,
            range: key,
            objectStoreName: this.objectStore._name,
            resultLevel: backendInterface.ResultLevel.OnlyKeys,
        };
        var operation = function () { return __awaiter(_this, void 0, void 0, function () {
            var btx, result, primaryKeys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        btx = this._confirmActiveTransaction().btx;
                        return [4 /*yield*/, this._backend.getRecords(btx, getReq)];
                    case 1:
                        result = _a.sent();
                        if (result.count == 0) {
                            return [2 /*return*/, undefined];
                        }
                        primaryKeys = result.primaryKeys;
                        if (!primaryKeys) {
                            throw Error("invariant violated");
                        }
                        return [2 /*return*/, primaryKeys[0]];
                }
            });
        }); };
        return this.objectStore.transaction._execRequestAsync({
            operation: operation,
            source: this,
        });
    };
    // http://w3c.github.io/IndexedDB/#dom-idbindex-getallkeys
    BridgeIDBIndex.prototype.getAllKeys = function (query, count) {
        throw Error("not implemented");
    };
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-count-IDBRequest-any-key
    BridgeIDBIndex.prototype.count = function (key) {
        var _this = this;
        confirmActiveTransaction(this);
        if (key === null) {
            key = undefined;
        }
        if (key !== undefined && !(key instanceof BridgeIDBKeyRange_1.default)) {
            key = BridgeIDBKeyRange_1.default.only(valueToKey_1.default(key));
        }
        var getReq = {
            direction: "next",
            indexName: this._name,
            limit: 1,
            range: key,
            objectStoreName: this.objectStore._name,
            resultLevel: backendInterface.ResultLevel.OnlyCount,
        };
        var operation = function () { return __awaiter(_this, void 0, void 0, function () {
            var btx, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        btx = this._confirmActiveTransaction().btx;
                        return [4 /*yield*/, this._backend.getRecords(btx, getReq)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.count];
                }
            });
        }); };
        return this.objectStore.transaction._execRequestAsync({
            operation: operation,
            source: this,
        });
    };
    BridgeIDBIndex.prototype.toString = function () {
        return "[object IDBIndex]";
    };
    return BridgeIDBIndex;
}());
exports.BridgeIDBIndex = BridgeIDBIndex;
exports.default = BridgeIDBIndex;

});

unwrapExports(BridgeIDBIndex_1);
var BridgeIDBIndex_2 = BridgeIDBIndex_1.BridgeIDBIndex;

var fakeDOMStringList_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
// Would be nicer to sublcass Array, but I'd have to sacrifice Node 4 support to do that.
var fakeDOMStringList = function (arr) {
    var arr2 = arr.slice();
    Object.defineProperty(arr2, "contains", {
        // tslint:disable-next-line object-literal-shorthand
        value: function (value) { return arr2.indexOf(value) >= 0; },
    });
    Object.defineProperty(arr2, "item", {
        // tslint:disable-next-line object-literal-shorthand
        value: function (i) { return arr2[i]; },
    });
    return arr2;
};
exports.default = fakeDOMStringList;

});

unwrapExports(fakeDOMStringList_1);

var validateKeyPath_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-valid-key-path
var validateKeyPath = function (keyPath, parent) {
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
            var validIdentifierRegex = /^(?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])(?:[\$0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])*$/;
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
        for (var _i = 0, keyPath_1 = keyPath; _i < keyPath_1.length; _i++) {
            var part = keyPath_1[_i];
            validateKeyPath(part, "array");
        }
        return;
    }
    else if (typeof keyPath === "string" && keyPath.indexOf(".") >= 0) {
        keyPath = keyPath.split(".");
        for (var _a = 0, keyPath_2 = keyPath; _a < keyPath_2.length; _a++) {
            var part = keyPath_2[_a];
            validateKeyPath(part, "string");
        }
        return;
    }
    throw new SyntaxError();
};
exports.default = validateKeyPath;

});

unwrapExports(validateKeyPath_1);

var BridgeIDBObjectStore_1 = createCommonjsModule(function (module, exports) {
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
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });











// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#object-store
var BridgeIDBObjectStore = /** @class */ (function () {
    function BridgeIDBObjectStore(transaction, name) {
        this._indexesCache = new Map();
        this._deleted = false;
        this._name = name;
        this.transaction = transaction;
    }
    Object.defineProperty(BridgeIDBObjectStore.prototype, "autoIncrement", {
        get: function () {
            return this._schema.objectStores[this._name].autoIncrement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBObjectStore.prototype, "indexNames", {
        get: function () {
            return fakeDOMStringList_1.default(Object.keys(this._schema.objectStores[this._name].indexes)).sort();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBObjectStore.prototype, "keyPath", {
        get: function () {
            return this._schema.objectStores[this._name].keyPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBObjectStore.prototype, "_schema", {
        get: function () {
            return this.transaction.db._schema;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBObjectStore.prototype, "name", {
        get: function () {
            return this._name;
        },
        // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-name
        set: function (newName) {
            var transaction = this.transaction;
            if (!transaction.db._runningVersionchangeTransaction) {
                throw new errors$1.InvalidStateError();
            }
            var btx = this._confirmActiveTransaction().btx;
            newName = String(newName);
            var oldName = this._name;
            if (newName === oldName) {
                return;
            }
            this._backend.renameObjectStore(btx, oldName, newName);
            this.transaction.db._schema = this._backend.getSchema(this._backendConnection);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBObjectStore.prototype, "_backend", {
        get: function () {
            return this.transaction.db._backend;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBObjectStore.prototype, "_backendConnection", {
        get: function () {
            return this.transaction.db._backendConnection;
        },
        enumerable: true,
        configurable: true
    });
    BridgeIDBObjectStore.prototype._confirmActiveTransaction = function () {
        var btx = this.transaction._backendTransaction;
        if (!btx) {
            throw new errors$1.InvalidStateError();
        }
        return { btx: btx };
    };
    BridgeIDBObjectStore.prototype._store = function (value, key, overwrite) {
        var _this = this;
        if (BridgeIDBFactory_1.default.enableTracing) {
            console.log("TRACE: IDBObjectStore._store");
        }
        if (this.transaction.mode === "readonly") {
            throw new errors$1.ReadOnlyError();
        }
        var operation = function () { return __awaiter(_this, void 0, void 0, function () {
            var btx, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        btx = this._confirmActiveTransaction().btx;
                        return [4 /*yield*/, this._backend.storeRecord(btx, {
                                objectStoreName: this._name,
                                key: key,
                                value: value,
                                storeLevel: overwrite
                                    ? backendInterface.StoreLevel.AllowOverwrite
                                    : backendInterface.StoreLevel.NoOverwrite,
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.key];
                }
            });
        }); };
        return this.transaction._execRequestAsync({ operation: operation, source: this });
    };
    BridgeIDBObjectStore.prototype.put = function (value, key) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        return this._store(value, key, true);
    };
    BridgeIDBObjectStore.prototype.add = function (value, key) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        return this._store(value, key, false);
    };
    BridgeIDBObjectStore.prototype.delete = function (key) {
        var _this = this;
        if (arguments.length === 0) {
            throw new TypeError();
        }
        if (this.transaction.mode === "readonly") {
            throw new errors$1.ReadOnlyError();
        }
        var keyRange;
        if (key instanceof BridgeIDBKeyRange_1.default) {
            keyRange = key;
        }
        else {
            keyRange = BridgeIDBKeyRange_1.default.only(valueToKey_1.default(key));
        }
        var operation = function () { return __awaiter(_this, void 0, void 0, function () {
            var btx;
            return __generator(this, function (_a) {
                btx = this._confirmActiveTransaction().btx;
                return [2 /*return*/, this._backend.deleteRecord(btx, this._name, keyRange)];
            });
        }); };
        return this.transaction._execRequestAsync({
            operation: operation,
            source: this,
        });
    };
    BridgeIDBObjectStore.prototype.get = function (key) {
        var _this = this;
        if (BridgeIDBFactory_1.default.enableTracing) {
            console.log("getting from object store " + this._name + " key " + key);
        }
        if (arguments.length === 0) {
            throw new TypeError();
        }
        var keyRange;
        if (key instanceof BridgeIDBKeyRange_1.default) {
            keyRange = key;
        }
        else {
            keyRange = BridgeIDBKeyRange_1.default.only(valueToKey_1.default(key));
        }
        var recordRequest = {
            objectStoreName: this._name,
            indexName: undefined,
            lastIndexPosition: undefined,
            lastObjectStorePosition: undefined,
            direction: "next",
            limit: 1,
            resultLevel: backendInterface.ResultLevel.Full,
            range: keyRange,
        };
        var operation = function () { return __awaiter(_this, void 0, void 0, function () {
            var btx, result, values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (BridgeIDBFactory_1.default.enableTracing) {
                            console.log("running get operation:", recordRequest);
                        }
                        btx = this._confirmActiveTransaction().btx;
                        return [4 /*yield*/, this._backend.getRecords(btx, recordRequest)];
                    case 1:
                        result = _a.sent();
                        if (BridgeIDBFactory_1.default.enableTracing) {
                            console.log("get operation result count:", result.count);
                        }
                        if (result.count === 0) {
                            return [2 /*return*/, undefined];
                        }
                        values = result.values;
                        if (!values) {
                            throw Error("invariant violated");
                        }
                        return [2 /*return*/, values[0]];
                }
            });
        }); };
        return this.transaction._execRequestAsync({
            operation: operation,
            source: this,
        });
    };
    // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-getall
    BridgeIDBObjectStore.prototype.getAll = function (query, count) {
        throw Error("not implemented");
    };
    // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-getkey
    BridgeIDBObjectStore.prototype.getKey = function (key) {
        throw Error("not implemented");
    };
    // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-getallkeys
    BridgeIDBObjectStore.prototype.getAllKeys = function (query, count) {
        throw Error("not implemented");
    };
    BridgeIDBObjectStore.prototype.clear = function () {
        throw Error("not implemented");
    };
    BridgeIDBObjectStore.prototype.openCursor = function (range, direction) {
        if (direction === void 0) { direction = "next"; }
        if (range === null) {
            range = undefined;
        }
        if (range !== undefined && !(range instanceof BridgeIDBKeyRange_1.default)) {
            range = BridgeIDBKeyRange_1.default.only(valueToKey_1.default(range));
        }
        var request = new BridgeIDBRequest_1.default();
        request.source = this;
        request.transaction = this.transaction;
        var cursor = new BridgeIDBCursorWithValue_1.default(this, this._name, undefined, range, direction, request);
        return this.transaction._execRequestAsync({
            operation: function () { return cursor._iterate(); },
            request: request,
            source: this,
        });
    };
    BridgeIDBObjectStore.prototype.openKeyCursor = function (range, direction) {
        if (range === null) {
            range = undefined;
        }
        if (range !== undefined && !(range instanceof BridgeIDBKeyRange_1.default)) {
            range = BridgeIDBKeyRange_1.default.only(valueToKey_1.default(range));
        }
        if (!direction) {
            direction = "next";
        }
        var request = new BridgeIDBRequest_1.default();
        request.source = this;
        request.transaction = this.transaction;
        var cursor = new BridgeIDBCursor_1.default(this, this._name, undefined, range, direction, request, true);
        return this.transaction._execRequestAsync({
            operation: cursor._iterate.bind(cursor),
            request: request,
            source: this,
        });
    };
    // tslint:disable-next-line max-line-length
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBObjectStore-createIndex-IDBIndex-DOMString-name-DOMString-sequence-DOMString--keyPath-IDBIndexParameters-optionalParameters
    BridgeIDBObjectStore.prototype.createIndex = function (indexName, keyPath, optionalParameters) {
        if (optionalParameters === void 0) { optionalParameters = {}; }
        if (arguments.length < 2) {
            throw new TypeError();
        }
        if (!this.transaction.db._runningVersionchangeTransaction) {
            throw new errors$1.InvalidStateError();
        }
        var btx = this._confirmActiveTransaction().btx;
        var multiEntry = optionalParameters.multiEntry !== undefined
            ? optionalParameters.multiEntry
            : false;
        var unique = optionalParameters.unique !== undefined
            ? optionalParameters.unique
            : false;
        if (this.transaction.mode !== "versionchange") {
            throw new errors$1.InvalidStateError();
        }
        if (this.indexNames.indexOf(indexName) >= 0) {
            throw new errors$1.ConstraintError();
        }
        validateKeyPath_1.default(keyPath);
        if (Array.isArray(keyPath) && multiEntry) {
            throw new errors$1.InvalidAccessError();
        }
        this._backend.createIndex(btx, indexName, this._name, keyPath, multiEntry, unique);
        return new BridgeIDBIndex_1.default(this, indexName);
    };
    // https://w3c.github.io/IndexedDB/#dom-idbobjectstore-index
    BridgeIDBObjectStore.prototype.index = function (name) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        if (this.transaction._state === "finished") {
            throw new errors$1.InvalidStateError();
        }
        var index = this._indexesCache.get(name);
        if (index !== undefined) {
            return index;
        }
        return new BridgeIDBIndex_1.default(this, name);
    };
    BridgeIDBObjectStore.prototype.deleteIndex = function (indexName) {
        if (arguments.length === 0) {
            throw new TypeError();
        }
        if (this.transaction.mode !== "versionchange") {
            throw new errors$1.InvalidStateError();
        }
        if (!this.transaction.db._runningVersionchangeTransaction) {
            throw new errors$1.InvalidStateError();
        }
        var btx = this._confirmActiveTransaction().btx;
        var index = this._indexesCache.get(indexName);
        if (index !== undefined) {
            index._deleted = true;
        }
        this._backend.deleteIndex(btx, this._name, indexName);
    };
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBObjectStore-count-IDBRequest-any-key
    BridgeIDBObjectStore.prototype.count = function (key) {
        var _this = this;
        if (key === null) {
            key = undefined;
        }
        if (key !== undefined && !(key instanceof BridgeIDBKeyRange_1.default)) {
            key = BridgeIDBKeyRange_1.default.only(valueToKey_1.default(key));
        }
        var recordGetRequest = {
            direction: "next",
            indexName: undefined,
            lastIndexPosition: undefined,
            limit: -1,
            objectStoreName: this._name,
            lastObjectStorePosition: undefined,
            range: key,
            resultLevel: backendInterface.ResultLevel.OnlyCount,
        };
        var operation = function () { return __awaiter(_this, void 0, void 0, function () {
            var btx, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        btx = this._confirmActiveTransaction().btx;
                        return [4 /*yield*/, this._backend.getRecords(btx, recordGetRequest)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.count];
                }
            });
        }); };
        return this.transaction._execRequestAsync({ operation: operation, source: this });
    };
    BridgeIDBObjectStore.prototype.toString = function () {
        return "[object IDBObjectStore]";
    };
    return BridgeIDBObjectStore;
}());
exports.default = BridgeIDBObjectStore;

});

unwrapExports(BridgeIDBObjectStore_1);

var queueTask_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
function queueTask(fn) {
    setImmediate(fn);
}
exports.queueTask = queueTask;
exports.default = queueTask;

});

unwrapExports(queueTask_1);
var queueTask_2 = queueTask_1.queueTask;

var openPromise_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
function openPromise() {
    var resolve;
    var reject;
    var promise = new Promise(function (resolve2, reject2) {
        resolve = resolve2;
        reject = reject2;
    });
    if (!resolve) {
        throw Error("broken invariant");
    }
    if (!reject) {
        throw Error("broken invariant");
    }
    return { promise: promise, resolve: resolve, reject: reject };
}
exports.default = openPromise;

});

unwrapExports(openPromise_1);

var BridgeIDBTransaction_1 = createCommonjsModule(function (module, exports) {
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });









// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#transaction
var BridgeIDBTransaction = /** @class */ (function (_super) {
    __extends(BridgeIDBTransaction, _super);
    function BridgeIDBTransaction(storeNames, mode, db, backendTransaction) {
        var _this = _super.call(this) || this;
        _this._state = "active";
        _this._started = false;
        _this._objectStoresCache = new Map();
        _this.error = null;
        _this.onabort = null;
        _this.oncomplete = null;
        _this.onerror = null;
        _this._requests = [];
        var myOpenPromise = openPromise_1.default();
        _this._waitPromise = myOpenPromise.promise;
        _this._resolveWait = myOpenPromise.resolve;
        _this._scope = new Set(storeNames);
        _this._backendTransaction = backendTransaction;
        _this.mode = mode;
        _this.db = db;
        _this.objectStoreNames = fakeDOMStringList_1.default(Array.from(_this._scope).sort());
        _this.db._transactions.push(_this);
        return _this;
    }
    Object.defineProperty(BridgeIDBTransaction.prototype, "_backend", {
        get: function () {
            return this.db._backend;
        },
        enumerable: true,
        configurable: true
    });
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-aborting-a-transaction
    BridgeIDBTransaction.prototype._abort = function (errName) {
        return __awaiter(this, void 0, void 0, function () {
            var e, _i, _a, request, event, maybeBtx;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._state = "finished";
                        if (errName !== null) {
                            e = new Error();
                            e.name = errName;
                            this.error = e;
                        }
                        // Should this directly remove from _requests?
                        for (_i = 0, _a = this._requests; _i < _a.length; _i++) {
                            request = _a[_i].request;
                            if (request.readyState !== "done") {
                                request.readyState = "done"; // This will cancel execution of this request's operation
                                if (request.source) {
                                    request.result = undefined;
                                    request.error = new errors$1.AbortError();
                                    event = new FakeEvent.default("error", {
                                        bubbles: true,
                                        cancelable: true,
                                    });
                                    event.eventPath = [this.db, this];
                                    request.dispatchEvent(event);
                                }
                            }
                        }
                        maybeBtx = this._backendTransaction;
                        if (!maybeBtx) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._backend.rollback(maybeBtx)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        queueTask_1.default(function () {
                            var event = new FakeEvent.default("abort", {
                                bubbles: true,
                                cancelable: false,
                            });
                            event.eventPath = [_this.db];
                            _this.dispatchEvent(event);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    BridgeIDBTransaction.prototype.abort = function () {
        if (this._state === "committing" || this._state === "finished") {
            throw new errors$1.InvalidStateError();
        }
        this._state = "active";
        this._abort(null);
    };
    // http://w3c.github.io/IndexedDB/#dom-idbtransaction-objectstore
    BridgeIDBTransaction.prototype.objectStore = function (name) {
        if (this._state !== "active") {
            throw new errors$1.InvalidStateError();
        }
        var objectStore = this._objectStoresCache.get(name);
        if (objectStore !== undefined) {
            return objectStore;
        }
        return new BridgeIDBObjectStore_1.default(this, name);
    };
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-asynchronously-executing-a-request
    BridgeIDBTransaction.prototype._execRequestAsync = function (obj) {
        var source = obj.source;
        var operation = obj.operation;
        var request = obj.hasOwnProperty("request") ? obj.request : null;
        if (this._state !== "active") {
            throw new errors$1.TransactionInactiveError();
        }
        // Request should only be passed for cursors
        if (!request) {
            if (!source) {
                // Special requests like indexes that just need to run some code
                request = new BridgeIDBRequest_1.default();
            }
            else {
                request = new BridgeIDBRequest_1.default();
                request.source = source;
                request.transaction = source.transaction;
            }
        }
        this._requests.push({
            operation: operation,
            request: request,
        });
        return request;
    };
    /**
     * Actually execute the scheduled work for this transaction.
     */
    BridgeIDBTransaction.prototype._start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, operation, request, r, event, result, err_1, event, idx;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (BridgeIDBFactory_1.default.enableTracing) {
                            console.log("TRACE: IDBTransaction._start, " + this._requests.length + " queued");
                        }
                        this._started = true;
                        if (!!this._backendTransaction) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this._backend.beginTransaction(this.db._backendConnection, Array.from(this._scope), this.mode)];
                    case 1:
                        _a._backendTransaction = _b.sent();
                        _b.label = 2;
                    case 2:
                        while (this._requests.length > 0) {
                            r = this._requests.shift();
                            // This should only be false if transaction was aborted
                            if (r && r.request.readyState !== "done") {
                                request = r.request;
                                operation = r.operation;
                                break;
                            }
                        }
                        if (!(request && operation)) return [3 /*break*/, 9];
                        if (!!request.source) return [3 /*break*/, 4];
                        // Special requests like indexes that just need to run some code, with error handling already built into
                        // operation
                        return [4 /*yield*/, operation()];
                    case 3:
                        // Special requests like indexes that just need to run some code, with error handling already built into
                        // operation
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        event = void 0;
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 7, , 8]);
                        BridgeIDBFactory_1.default.enableTracing &&
                            console.log("TRACE: running operation in transaction");
                        return [4 /*yield*/, operation()];
                    case 6:
                        result = _b.sent();
                        BridgeIDBFactory_1.default.enableTracing &&
                            console.log("TRACE: operation in transaction finished with success");
                        request.readyState = "done";
                        request.result = result;
                        request.error = undefined;
                        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-fire-a-success-event
                        if (this._state === "inactive") {
                            this._state = "active";
                        }
                        event = new FakeEvent.default("success", {
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
                        return [3 /*break*/, 8];
                    case 7:
                        err_1 = _b.sent();
                        if (BridgeIDBFactory_1.default.enableTracing) {
                            console.log("TRACING: error during operation: ", err_1);
                        }
                        request.readyState = "done";
                        request.result = undefined;
                        request.error = err_1;
                        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-fire-an-error-event
                        if (this._state === "inactive") {
                            this._state = "active";
                        }
                        event = new FakeEvent.default("error", {
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
                            this._abort(err_1.name);
                        }
                        return [3 /*break*/, 8];
                    case 8:
                        // On to the next one
                        if (this._requests.length > 0) {
                            this._start();
                        }
                        else {
                            // Give it another chance for new handlers to be set before finishing
                            queueTask_1.default(function () { return _this._start(); });
                        }
                        return [2 /*return*/];
                    case 9:
                        if (!(this._state !== "finished" && this._state !== "committing")) return [3 /*break*/, 11];
                        if (BridgeIDBFactory_1.default.enableTracing) {
                            console.log("finishing transaction");
                        }
                        this._state = "committing";
                        return [4 /*yield*/, this._backend.commit(this._backendTransaction)];
                    case 10:
                        _b.sent();
                        this._state = "finished";
                        if (!this.error) {
                            if (BridgeIDBFactory_1.default.enableTracing) {
                                console.log("dispatching 'complete' event on transaction");
                            }
                            event = new FakeEvent.default("complete");
                            event.eventPath = [this, this.db];
                            this.dispatchEvent(event);
                        }
                        idx = this.db._transactions.indexOf(this);
                        if (idx < 0) {
                            throw Error("invariant failed");
                        }
                        this.db._transactions.splice(idx, 1);
                        this._resolveWait();
                        _b.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    BridgeIDBTransaction.prototype.commit = function () {
        if (this._state !== "active") {
            throw new errors$1.InvalidStateError();
        }
        this._state = "committing";
        // We now just wait for auto-commit ...
    };
    BridgeIDBTransaction.prototype.toString = function () {
        return "[object IDBRequest]";
    };
    BridgeIDBTransaction.prototype._waitDone = function () {
        return this._waitPromise;
    };
    return BridgeIDBTransaction;
}(FakeEventTarget_1.default));
exports.default = BridgeIDBTransaction;

});

unwrapExports(BridgeIDBTransaction_1);

var BridgeIDBDatabase_1 = createCommonjsModule(function (module, exports) {
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
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });






/**
 * Ensure that an active version change transaction is currently running.
 */
var confirmActiveVersionchangeTransaction = function (database) {
    if (!database._runningVersionchangeTransaction) {
        throw new errors$1.InvalidStateError();
    }
    // Find the latest versionchange transaction
    var transactions = database._transactions.filter(function (tx) {
        return tx.mode === "versionchange";
    });
    var transaction = transactions[transactions.length - 1];
    if (!transaction || transaction._state === "finished") {
        throw new errors$1.InvalidStateError();
    }
    if (transaction._state !== "active") {
        throw new errors$1.TransactionInactiveError();
    }
    return transaction;
};
// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#database-interface
var BridgeIDBDatabase = /** @class */ (function (_super) {
    __extends(BridgeIDBDatabase, _super);
    function BridgeIDBDatabase(backend, backendConnection) {
        var _this = _super.call(this) || this;
        _this._closePending = false;
        _this._closed = false;
        _this._runningVersionchangeTransaction = false;
        _this._transactions = [];
        _this._schema = backend.getSchema(backendConnection);
        _this._backend = backend;
        _this._backendConnection = backendConnection;
        return _this;
    }
    Object.defineProperty(BridgeIDBDatabase.prototype, "name", {
        get: function () {
            return this._schema.databaseName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBDatabase.prototype, "version", {
        get: function () {
            return this._schema.databaseVersion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeIDBDatabase.prototype, "objectStoreNames", {
        get: function () {
            return fakeDOMStringList_1.default(Object.keys(this._schema.objectStores)).sort();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#database-closing-steps
     */
    BridgeIDBDatabase.prototype._closeConnection = function () {
        var _this = this;
        this._closePending = true;
        var transactionsComplete = this._transactions.every(function (transaction) {
            return transaction._state === "finished";
        });
        if (transactionsComplete) {
            this._closed = true;
            this._backend.close(this._backendConnection);
        }
        else {
            queueTask_1.default(function () {
                _this._closeConnection();
            });
        }
    };
    // http://w3c.github.io/IndexedDB/#dom-idbdatabase-createobjectstore
    BridgeIDBDatabase.prototype.createObjectStore = function (name, options) {
        if (options === void 0) { options = {}; }
        if (name === undefined) {
            throw new TypeError();
        }
        var transaction = confirmActiveVersionchangeTransaction(this);
        var backendTx = transaction._backendTransaction;
        if (!backendTx) {
            throw Error("invariant violated");
        }
        var keyPath = options !== null && options.keyPath !== undefined
            ? options.keyPath
            : null;
        var autoIncrement = options !== null && options.autoIncrement !== undefined
            ? options.autoIncrement
            : false;
        if (keyPath !== null) {
            validateKeyPath_1.default(keyPath);
        }
        if (Object.keys(this._schema.objectStores).includes(name)) {
            throw new errors$1.ConstraintError();
        }
        if (autoIncrement && (keyPath === "" || Array.isArray(keyPath))) {
            throw new errors$1.InvalidAccessError();
        }
        transaction._backend.createObjectStore(backendTx, name, keyPath, autoIncrement);
        this._schema = this._backend.getSchema(this._backendConnection);
        return transaction.objectStore(name);
    };
    BridgeIDBDatabase.prototype.deleteObjectStore = function (name) {
        if (name === undefined) {
            throw new TypeError();
        }
        var transaction = confirmActiveVersionchangeTransaction(this);
        transaction._objectStoresCache.delete(name);
    };
    BridgeIDBDatabase.prototype._internalTransaction = function (storeNames, mode, backendTransaction) {
        var _this = this;
        mode = mode !== undefined ? mode : "readonly";
        if (mode !== "readonly" &&
            mode !== "readwrite" &&
            mode !== "versionchange") {
            throw new TypeError("Invalid mode: " + mode);
        }
        var hasActiveVersionchange = this._transactions.some(function (transaction) {
            return (transaction._state === "active" &&
                transaction.mode === "versionchange" &&
                transaction.db === _this);
        });
        if (hasActiveVersionchange) {
            throw new errors$1.InvalidStateError();
        }
        if (this._closePending) {
            throw new errors$1.InvalidStateError();
        }
        if (!Array.isArray(storeNames)) {
            storeNames = [storeNames];
        }
        if (storeNames.length === 0 && mode !== "versionchange") {
            throw new errors$1.InvalidAccessError();
        }
        for (var _i = 0, storeNames_1 = storeNames; _i < storeNames_1.length; _i++) {
            var storeName = storeNames_1[_i];
            if (this.objectStoreNames.indexOf(storeName) < 0) {
                throw new errors$1.NotFoundError("No objectStore named " + storeName + " in this database");
            }
        }
        var tx = new BridgeIDBTransaction_1.default(storeNames, mode, this, backendTransaction);
        this._transactions.push(tx);
        queueTask_1.default(function () { return tx._start(); });
        return tx;
    };
    BridgeIDBDatabase.prototype.transaction = function (storeNames, mode) {
        if (mode === "versionchange") {
            throw new TypeError("Invalid mode: " + mode);
        }
        return this._internalTransaction(storeNames, mode);
    };
    BridgeIDBDatabase.prototype.close = function () {
        this._closeConnection();
    };
    BridgeIDBDatabase.prototype.toString = function () {
        return "[object IDBDatabase]";
    };
    return BridgeIDBDatabase;
}(FakeEventTarget_1.default));
exports.default = BridgeIDBDatabase;

});

unwrapExports(BridgeIDBDatabase_1);

var BridgeIDBOpenDBRequest_1 = createCommonjsModule(function (module, exports) {
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
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });

var BridgeIDBOpenDBRequest = /** @class */ (function (_super) {
    __extends(BridgeIDBOpenDBRequest, _super);
    function BridgeIDBOpenDBRequest() {
        var _this = _super.call(this) || this;
        _this.onupgradeneeded = null;
        _this.onblocked = null;
        // https://www.w3.org/TR/IndexedDB/#open-requests
        _this.source = null;
        return _this;
    }
    BridgeIDBOpenDBRequest.prototype.toString = function () {
        return "[object IDBOpenDBRequest]";
    };
    return BridgeIDBOpenDBRequest;
}(BridgeIDBRequest_1.default));
exports.default = BridgeIDBOpenDBRequest;

});

unwrapExports(BridgeIDBOpenDBRequest_1);

var BridgeIDBVersionChangeEvent_1 = createCommonjsModule(function (module, exports) {
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
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });

var BridgeIDBVersionChangeEvent = /** @class */ (function (_super) {
    __extends(BridgeIDBVersionChangeEvent, _super);
    function BridgeIDBVersionChangeEvent(type, parameters) {
        if (parameters === void 0) { parameters = {}; }
        var _this = _super.call(this, type) || this;
        _this.newVersion =
            parameters.newVersion !== undefined ? parameters.newVersion : null;
        _this.oldVersion =
            parameters.oldVersion !== undefined ? parameters.oldVersion : 0;
        return _this;
    }
    BridgeIDBVersionChangeEvent.prototype.toString = function () {
        return "[object IDBVersionChangeEvent]";
    };
    return BridgeIDBVersionChangeEvent;
}(FakeEvent.default));
exports.default = BridgeIDBVersionChangeEvent;

});

unwrapExports(BridgeIDBVersionChangeEvent_1);

var enforceRange_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
// https://heycam.github.io/webidl/#EnforceRange
var enforceRange = function (num, type) {
    var min = 0;
    var max = type === "unsigned long" ? 4294967295 : 9007199254740991;
    if (isNaN(num) || num < min || num > max) {
        throw new TypeError();
    }
    if (num >= 0) {
        return Math.floor(num);
    }
};
exports.default = enforceRange;

});

unwrapExports(enforceRange_1);

var BridgeIDBFactory_1 = createCommonjsModule(function (module, exports) {
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
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });








var BridgeIDBFactory = /** @class */ (function () {
    function BridgeIDBFactory(backend) {
        this.cmp = cmp.default;
        this.connections = [];
        this.backend = backend;
    }
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBFactory-deleteDatabase-IDBOpenDBRequest-DOMString-name
    BridgeIDBFactory.prototype.deleteDatabase = function (name) {
        var _this = this;
        var request = new BridgeIDBOpenDBRequest_1.default();
        request.source = null;
        queueTask_1.default(function () { return __awaiter(_this, void 0, void 0, function () {
            var databases, dbInfo, event, oldVersion, dbconn, backendTransaction, event2, err_1, event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.backend.getDatabases()];
                    case 1:
                        databases = _a.sent();
                        dbInfo = databases.find(function (x) { return x.name == name; });
                        if (!dbInfo) {
                            event = new BridgeIDBVersionChangeEvent_1.default("success", {
                                newVersion: null,
                                oldVersion: 0,
                            });
                            request.dispatchEvent(event);
                            return [2 /*return*/];
                        }
                        oldVersion = dbInfo.version;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, this.backend.connectDatabase(name)];
                    case 3:
                        dbconn = _a.sent();
                        return [4 /*yield*/, this.backend.enterVersionChange(dbconn, 0)];
                    case 4:
                        backendTransaction = _a.sent();
                        return [4 /*yield*/, this.backend.deleteDatabase(backendTransaction, name)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.backend.commit(backendTransaction)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.backend.close(dbconn)];
                    case 7:
                        _a.sent();
                        request.result = undefined;
                        request.readyState = "done";
                        event2 = new BridgeIDBVersionChangeEvent_1.default("success", {
                            newVersion: null,
                            oldVersion: oldVersion,
                        });
                        request.dispatchEvent(event2);
                        return [3 /*break*/, 9];
                    case 8:
                        err_1 = _a.sent();
                        request.error = new Error();
                        request.error.name = err_1.name;
                        request.readyState = "done";
                        event = new FakeEvent.default("error", {
                            bubbles: true,
                            cancelable: true,
                        });
                        event.eventPath = [];
                        request.dispatchEvent(event);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
        return request;
    };
    // tslint:disable-next-line max-line-length
    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBFactory-open-IDBOpenDBRequest-DOMString-name-unsigned-long-long-version
    BridgeIDBFactory.prototype.open = function (name, version) {
        var _this = this;
        if (arguments.length > 1 && version !== undefined) {
            // Based on spec, not sure why "MAX_SAFE_INTEGER" instead of "unsigned long long", but it's needed to pass
            // tests
            version = enforceRange_1.default(version, "MAX_SAFE_INTEGER");
        }
        if (version === 0) {
            throw new TypeError();
        }
        var request = new BridgeIDBOpenDBRequest_1.default();
        queueTask_1.default(function () { return __awaiter(_this, void 0, void 0, function () {
            var dbconn, err_2, schema, existingVersion, requestedVersion, db, event2, _i, _a, otherConn, event_1, event_2, backendTransaction, transaction, event, event2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.backend.connectDatabase(name)];
                    case 1:
                        dbconn = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _b.sent();
                        request._finishWithError(err_2);
                        return [2 /*return*/];
                    case 3:
                        schema = this.backend.getSchema(dbconn);
                        existingVersion = schema.databaseVersion;
                        if (version === undefined) {
                            version = existingVersion !== 0 ? existingVersion : 1;
                        }
                        requestedVersion = version;
                        BridgeIDBFactory.enableTracing &&
                            console.log("TRACE: existing version " + existingVersion + ", requested version " + requestedVersion);
                        if (existingVersion > requestedVersion) {
                            request._finishWithError(new errors$1.VersionError());
                            return [2 /*return*/];
                        }
                        db = new BridgeIDBDatabase_1.default(this.backend, dbconn);
                        if (existingVersion == requestedVersion) {
                            request.result = db;
                            request.readyState = "done";
                            event2 = new FakeEvent.default("success", {
                                bubbles: false,
                                cancelable: false,
                            });
                            event2.eventPath = [request];
                            request.dispatchEvent(event2);
                        }
                        if (!(existingVersion < requestedVersion)) return [3 /*break*/, 6];
                        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-running-a-versionchange-transaction
                        for (_i = 0, _a = this.connections; _i < _a.length; _i++) {
                            otherConn = _a[_i];
                            event_1 = new BridgeIDBVersionChangeEvent_1.default("versionchange", {
                                newVersion: version,
                                oldVersion: existingVersion,
                            });
                            otherConn.dispatchEvent(event_1);
                        }
                        if (this._anyOpen()) {
                            event_2 = new BridgeIDBVersionChangeEvent_1.default("blocked", {
                                newVersion: version,
                                oldVersion: existingVersion,
                            });
                            request.dispatchEvent(event_2);
                        }
                        return [4 /*yield*/, this.backend.enterVersionChange(dbconn, requestedVersion)];
                    case 4:
                        backendTransaction = _b.sent();
                        db._runningVersionchangeTransaction = true;
                        transaction = db._internalTransaction([], "versionchange", backendTransaction);
                        event = new BridgeIDBVersionChangeEvent_1.default("upgradeneeded", {
                            newVersion: version,
                            oldVersion: existingVersion,
                        });
                        request.result = db;
                        request.readyState = "done";
                        request.transaction = transaction;
                        request.dispatchEvent(event);
                        return [4 /*yield*/, transaction._waitDone()];
                    case 5:
                        _b.sent();
                        // We don't explicitly exit the versionchange transaction,
                        // since this is already done by the BridgeIDBTransaction.
                        db._runningVersionchangeTransaction = false;
                        event2 = new FakeEvent.default("success", {
                            bubbles: false,
                            cancelable: false,
                        });
                        event2.eventPath = [request];
                        request.dispatchEvent(event2);
                        _b.label = 6;
                    case 6:
                        this.connections.push(db);
                        return [2 /*return*/, db];
                }
            });
        }); });
        return request;
    };
    // https://w3c.github.io/IndexedDB/#dom-idbfactory-databases
    BridgeIDBFactory.prototype.databases = function () {
        return this.backend.getDatabases();
    };
    BridgeIDBFactory.prototype.toString = function () {
        return "[object IDBFactory]";
    };
    BridgeIDBFactory.prototype._anyOpen = function () {
        return this.connections.some(function (c) { return !c._closed && !c._closePending; });
    };
    BridgeIDBFactory.enableTracing = false;
    return BridgeIDBFactory;
}());
exports.BridgeIDBFactory = BridgeIDBFactory;
exports.default = BridgeIDBFactory;

});

unwrapExports(BridgeIDBFactory_1);
var BridgeIDBFactory_2 = BridgeIDBFactory_1.BridgeIDBFactory;

var b_tree = createCommonjsModule(function (module, exports) {
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
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.defaultComparator = defaultComparator;
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
var BTree = /** @class */ (function () {
    /**
     * Initializes an empty B+ tree.
     * @param compare Custom function to compare pairs of elements in the tree.
     *   This is not required for numbers, strings and arrays of numbers/strings.
     * @param entries A set of key-value pairs to initialize the tree
     * @param maxNodeSize Branching factor (maximum items or children per node)
     *   Must be in range 4..256. If undefined or <4 then default is used; if >256 then 256.
     */
    function BTree(entries, compare, maxNodeSize) {
        this._root = EmptyLeaf;
        this._size = 0;
        this._maxNodeSize = maxNodeSize >= 4 ? Math.min(maxNodeSize, 256) : 32;
        this._compare = compare || defaultComparator;
        if (entries)
            this.setPairs(entries);
    }
    Object.defineProperty(BTree.prototype, "size", {
        // ES6 Map<K,V> methods ///////////////////////////////////////////////////
        /** Gets the number of key-value pairs in the tree. */
        get: function () { return this._size; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BTree.prototype, "length", {
        /** Gets the number of key-value pairs in the tree. */
        get: function () { return this._size; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BTree.prototype, "isEmpty", {
        /** Returns true iff the tree contains no key-value pairs. */
        get: function () { return this._size === 0; },
        enumerable: true,
        configurable: true
    });
    /** Releases the tree so that its size is 0. */
    BTree.prototype.clear = function () {
        this._root = EmptyLeaf;
        this._size = 0;
    };
    /** Runs a function for each key-value pair, in order from smallest to
     *  largest key. For compatibility with ES6 Map, the argument order to
     *  the callback is backwards: value first, then key. Call forEachPair
     *  instead to receive the key as the first argument.
     * @param thisArg If provided, this parameter is assigned as the `this`
     *        value for each callback.
     * @returns the number of values that were sent to the callback,
     *        or the R value if the callback returned {break:R}. */
    BTree.prototype.forEach = function (callback, thisArg) {
        var _this = this;
        if (thisArg !== undefined)
            callback = callback.bind(thisArg);
        return this.forEachPair(function (k, v) { return callback(v, k, _this); });
    };
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
    BTree.prototype.forEachPair = function (callback, initialCounter) {
        var low = this.minKey(), high = this.maxKey();
        return this.forRange(low, high, true, callback, initialCounter);
    };
    /**
     * Finds a pair in the tree and returns the associated value.
     * @param defaultValue a value to return if the key was not found.
     * @returns the value, or defaultValue if the key was not found.
     * @description Computational complexity: O(log size)
     */
    BTree.prototype.get = function (key, defaultValue) {
        return this._root.get(key, defaultValue, this);
    };
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
    BTree.prototype.set = function (key, value, overwrite) {
        if (this._root.isShared)
            this._root = this._root.clone();
        var result = this._root.set(key, value, overwrite, this);
        if (result === true || result === false)
            return result;
        // Root node has split, so create a new root node.
        this._root = new BNodeInternal([this._root, result]);
        return true;
    };
    /**
     * Returns true if the key exists in the B+ tree, false if not.
     * Use get() for best performance; use has() if you need to
     * distinguish between "undefined value" and "key not present".
     * @param key Key to detect
     * @description Computational complexity: O(log size)
     */
    BTree.prototype.has = function (key) {
        return this.forRange(key, key, true, undefined) !== 0;
    };
    /**
     * Removes a single key-value pair from the B+ tree.
     * @param key Key to find
     * @returns true if a pair was found and removed, false otherwise.
     * @description Computational complexity: O(log size)
     */
    BTree.prototype.delete = function (key) {
        return this.editRange(key, key, true, DeleteRange) !== 0;
    };
    BTree.prototype.with = function (key, value, overwrite) {
        var nu = this.clone();
        return nu.set(key, value, overwrite) || overwrite ? nu : this;
    };
    /** Returns a copy of the tree with the specified key-value pairs set. */
    BTree.prototype.withPairs = function (pairs, overwrite) {
        var nu = this.clone();
        return nu.setPairs(pairs, overwrite) !== 0 || overwrite ? nu : this;
    };
    /** Returns a copy of the tree with the specified keys present.
     *  @param keys The keys to add. If a key is already present in the tree,
     *         neither the existing key nor the existing value is modified.
     *  @param returnThisIfUnchanged if true, returns this if all keys already
     *  existed. Performance note: due to the architecture of this class, all
     *  node(s) leading to existing keys are cloned even if the collection is
     *  ultimately unchanged.
    */
    BTree.prototype.withKeys = function (keys, returnThisIfUnchanged) {
        var nu = this.clone(), changed = false;
        for (var i = 0; i < keys.length; i++)
            changed = nu.set(keys[i], undefined, false) || changed;
        return returnThisIfUnchanged && !changed ? this : nu;
    };
    /** Returns a copy of the tree with the specified key removed.
     * @param returnThisIfUnchanged if true, returns this if the key didn't exist.
     *  Performance note: due to the architecture of this class, node(s) leading
     *  to where the key would have been stored are cloned even when the key
     *  turns out not to exist and the collection is unchanged.
     */
    BTree.prototype.without = function (key, returnThisIfUnchanged) {
        return this.withoutRange(key, key, true, returnThisIfUnchanged);
    };
    /** Returns a copy of the tree with the specified keys removed.
     * @param returnThisIfUnchanged if true, returns this if none of the keys
     *  existed. Performance note: due to the architecture of this class,
     *  node(s) leading to where the key would have been stored are cloned
     *  even when the key turns out not to exist.
     */
    BTree.prototype.withoutKeys = function (keys, returnThisIfUnchanged) {
        var nu = this.clone();
        return nu.deleteKeys(keys) || !returnThisIfUnchanged ? nu : this;
    };
    /** Returns a copy of the tree with the specified range of keys removed. */
    BTree.prototype.withoutRange = function (low, high, includeHigh, returnThisIfUnchanged) {
        var nu = this.clone();
        if (nu.deleteRange(low, high, includeHigh) === 0 && returnThisIfUnchanged)
            return this;
        return nu;
    };
    /** Returns a copy of the tree with pairs removed whenever the callback
     *  function returns false. `where()` is a synonym for this method. */
    BTree.prototype.filter = function (callback, returnThisIfUnchanged) {
        var nu = this.greedyClone();
        var del;
        nu.editAll(function (k, v, i) {
            if (!callback(k, v, i))
                return del = Delete;
        });
        if (!del && returnThisIfUnchanged)
            return this;
        return nu;
    };
    /** Returns a copy of the tree with all values altered by a callback function. */
    BTree.prototype.mapValues = function (callback) {
        var tmp = {};
        var nu = this.greedyClone();
        nu.editAll(function (k, v, i) {
            return tmp.value = callback(v, k, i), tmp;
        });
        return nu;
    };
    BTree.prototype.reduce = function (callback, initialValue) {
        var i = 0, p = initialValue;
        var it = this.entries(this.minKey(), ReusedArray), next;
        while (!(next = it.next()).done)
            p = callback(p, next.value, i++, this);
        return p;
    };
    // Iterator methods ///////////////////////////////////////////////////////
    /** Returns an iterator that provides items in order (ascending order if
     *  the collection's comparator uses ascending order, as is the default.)
     *  @param lowestKey First key to be iterated, or undefined to start at
     *         minKey(). If the specified key doesn't exist then iteration
     *         starts at the next higher key (according to the comparator).
     *  @param reusedArray Optional array used repeatedly to store key-value
     *         pairs, to avoid creating a new array on every iteration.
     */
    BTree.prototype.entries = function (lowestKey, reusedArray) {
        var info = this.findPath(lowestKey);
        if (info === undefined)
            return iterator();
        var nodequeue = info.nodequeue, nodeindex = info.nodeindex, leaf = info.leaf;
        var state = reusedArray !== undefined ? 1 : 0;
        var i = (lowestKey === undefined ? -1 : leaf.indexOf(lowestKey, 0, this._compare) - 1);
        return iterator(function () {
            jump: for (;;) {
                switch (state) {
                    case 0:
                        if (++i < leaf.keys.length)
                            return { done: false, value: [leaf.keys[i], leaf.values[i]] };
                        state = 2;
                        continue;
                    case 1:
                        if (++i < leaf.keys.length) {
                            reusedArray[0] = leaf.keys[i], reusedArray[1] = leaf.values[i];
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
    };
    /** Returns an iterator that provides items in reversed order.
     *  @param highestKey Key at which to start iterating, or undefined to
     *         start at minKey(). If the specified key doesn't exist then iteration
     *         starts at the next lower key (according to the comparator).
     *  @param reusedArray Optional array used repeatedly to store key-value
     *         pairs, to avoid creating a new array on every iteration.
     *  @param skipHighest Iff this flag is true and the highestKey exists in the
     *         collection, the pair matching highestKey is skipped, not iterated.
     */
    BTree.prototype.entriesReversed = function (highestKey, reusedArray, skipHighest) {
        if ((highestKey = highestKey || this.maxKey()) === undefined)
            return iterator(); // collection is empty
        var _a = this.findPath(highestKey) || this.findPath(this.maxKey()), nodequeue = _a.nodequeue, nodeindex = _a.nodeindex, leaf = _a.leaf;
        check(!nodequeue[0] || leaf === nodequeue[0][nodeindex[0]], "wat!");
        var i = leaf.indexOf(highestKey, 0, this._compare);
        if (!(skipHighest || this._compare(leaf.keys[i], highestKey) > 0))
            i++;
        var state = reusedArray !== undefined ? 1 : 0;
        return iterator(function () {
            jump: for (;;) {
                switch (state) {
                    case 0:
                        if (--i >= 0)
                            return { done: false, value: [leaf.keys[i], leaf.values[i]] };
                        state = 2;
                        continue;
                    case 1:
                        if (--i >= 0) {
                            reusedArray[0] = leaf.keys[i], reusedArray[1] = leaf.values[i];
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
    };
    /* Used by entries() and entriesReversed() to prepare to start iterating.
     * It develops a "node queue" for each non-leaf level of the tree.
     * Levels are numbered "bottom-up" so that level 0 is a list of leaf
     * nodes from a low-level non-leaf node. The queue at a given level L
     * consists of nodequeue[L] which is the children of a BNodeInternal,
     * and nodeindex[L], the current index within that child list, such
     * such that nodequeue[L-1] === nodequeue[L][nodeindex[L]].children.
     * (However inside this function the order is reversed.)
     */
    BTree.prototype.findPath = function (key) {
        var nextnode = this._root;
        var nodequeue, nodeindex;
        if (nextnode.isLeaf) {
            nodequeue = EmptyArray, nodeindex = EmptyArray; // avoid allocations
        }
        else {
            nodequeue = [], nodeindex = [];
            for (var d = 0; !nextnode.isLeaf; d++) {
                nodequeue[d] = nextnode.children;
                nodeindex[d] = key === undefined ? 0 : nextnode.indexOf(key, 0, this._compare);
                if (nodeindex[d] >= nodequeue[d].length)
                    return; // first key > maxKey()
                nextnode = nodequeue[d][nodeindex[d]];
            }
            nodequeue.reverse();
            nodeindex.reverse();
        }
        return { nodequeue: nodequeue, nodeindex: nodeindex, leaf: nextnode };
    };
    /** Returns a new iterator for iterating the keys of each pair in ascending order.
     *  @param firstKey: Minimum key to include in the output. */
    BTree.prototype.keys = function (firstKey) {
        var it = this.entries(firstKey, ReusedArray);
        return iterator(function () {
            var n = it.next();
            if (n.value)
                n.value = n.value[0];
            return n;
        });
    };
    /** Returns a new iterator for iterating the values of each pair in order by key.
     *  @param firstKey: Minimum key whose associated value is included in the output. */
    BTree.prototype.values = function (firstKey) {
        var it = this.entries(firstKey, ReusedArray);
        return iterator(function () {
            var n = it.next();
            if (n.value)
                n.value = n.value[1];
            return n;
        });
    };
    Object.defineProperty(BTree.prototype, "maxNodeSize", {
        // Additional methods /////////////////////////////////////////////////////
        /** Returns the maximum number of children/values before nodes will split. */
        get: function () {
            return this._maxNodeSize;
        },
        enumerable: true,
        configurable: true
    });
    /** Gets the lowest key in the tree. Complexity: O(log size) */
    BTree.prototype.minKey = function () { return this._root.minKey(); };
    /** Gets the highest key in the tree. Complexity: O(1) */
    BTree.prototype.maxKey = function () { return this._root.maxKey(); };
    /** Quickly clones the tree by marking the root node as shared.
     *  Both copies remain editable. When you modify either copy, any
     *  nodes that are shared (or potentially shared) between the two
     *  copies are cloned so that the changes do not affect other copies.
     *  This is known as copy-on-write behavior, or "lazy copying". */
    BTree.prototype.clone = function () {
        this._root.isShared = true;
        var result = new BTree(undefined, this._compare, this._maxNodeSize);
        result._root = this._root;
        result._size = this._size;
        return result;
    };
    /** Performs a greedy clone, immediately duplicating any nodes that are
     *  not currently marked as shared, in order to avoid marking any nodes
     *  as shared.
     *  @param force Clone all nodes, even shared ones.
     */
    BTree.prototype.greedyClone = function (force) {
        var result = new BTree(undefined, this._compare, this._maxNodeSize);
        result._root = this._root.greedyClone(force);
        result._size = this._size;
        return result;
    };
    /** Gets an array filled with the contents of the tree, sorted by key */
    BTree.prototype.toArray = function (maxLength) {
        if (maxLength === void 0) { maxLength = 0x7FFFFFFF; }
        var min = this.minKey(), max = this.maxKey();
        if (min !== undefined)
            return this.getRange(min, max, true, maxLength);
        return [];
    };
    /** Gets an array of all keys, sorted */
    BTree.prototype.keysArray = function () {
        var results = [];
        this._root.forRange(this.minKey(), this.maxKey(), true, false, this, 0, function (k, v) { results.push(k); });
        return results;
    };
    /** Gets an array of all values, sorted by key */
    BTree.prototype.valuesArray = function () {
        var results = [];
        this._root.forRange(this.minKey(), this.maxKey(), true, false, this, 0, function (k, v) { results.push(v); });
        return results;
    };
    /** Gets a string representing the tree's data based on toArray(). */
    BTree.prototype.toString = function () {
        return this.toArray().toString();
    };
    /** Stores a key-value pair only if the key doesn't already exist in the tree.
     * @returns true if a new key was added
    */
    BTree.prototype.setIfNotPresent = function (key, value) {
        return this.set(key, value, false);
    };
    /** Returns the next pair whose key is larger than the specified key (or undefined if there is none) */
    BTree.prototype.nextHigherPair = function (key) {
        var it = this.entries(key, ReusedArray);
        var r = it.next();
        if (!r.done && this._compare(r.value[0], key) <= 0)
            r = it.next();
        return r.value;
    };
    /** Returns the next key larger than the specified key (or undefined if there is none) */
    BTree.prototype.nextHigherKey = function (key) {
        var p = this.nextHigherPair(key);
        return p ? p[0] : p;
    };
    /** Returns the next pair whose key is smaller than the specified key (or undefined if there is none) */
    BTree.prototype.nextLowerPair = function (key) {
        var it = this.entriesReversed(key, ReusedArray, true);
        return it.next().value;
    };
    /** Returns the next key smaller than the specified key (or undefined if there is none) */
    BTree.prototype.nextLowerKey = function (key) {
        var p = this.nextLowerPair(key);
        return p ? p[0] : p;
    };
    /** Edits the value associated with a key in the tree, if it already exists.
     * @returns true if the key existed, false if not.
    */
    BTree.prototype.changeIfPresent = function (key, value) {
        return this.editRange(key, key, true, function (k, v) { return ({ value: value }); }) !== 0;
    };
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
    BTree.prototype.getRange = function (low, high, includeHigh, maxLength) {
        if (maxLength === void 0) { maxLength = 0x3FFFFFF; }
        var results = [];
        this._root.forRange(low, high, includeHigh, false, this, 0, function (k, v) {
            results.push([k, v]);
            return results.length > maxLength ? Break : undefined;
        });
        return results;
    };
    /** Adds all pairs from a list of key-value pairs.
     * @param pairs Pairs to add to this tree. If there are duplicate keys,
     *        later pairs currently overwrite earlier ones (e.g. [[0,1],[0,7]]
     *        associates 0 with 7.)
     * @param overwrite Whether to overwrite pairs that already exist (if false,
     *        pairs[i] is ignored when the key pairs[i][0] already exists.)
     * @returns The number of pairs added to the collection.
     * @description Computational complexity: O(pairs.length * log(size + pairs.length))
     */
    BTree.prototype.setPairs = function (pairs, overwrite) {
        var added = 0;
        for (var i = 0; i < pairs.length; i++)
            if (this.set(pairs[i][0], pairs[i][1], overwrite))
                added++;
        return added;
    };
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
    BTree.prototype.forRange = function (low, high, includeHigh, onFound, initialCounter) {
        var r = this._root.forRange(low, high, includeHigh, false, this, initialCounter || 0, onFound);
        return typeof r === "number" ? r : r.break;
    };
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
    BTree.prototype.editRange = function (low, high, includeHigh, onFound, initialCounter) {
        var root = this._root;
        if (root.isShared)
            this._root = root = root.clone();
        try {
            var r = root.forRange(low, high, includeHigh, true, this, initialCounter || 0, onFound);
            return typeof r === "number" ? r : r.break;
        }
        finally {
            while (root.keys.length <= 1 && !root.isLeaf)
                this._root = root = root.keys.length === 0 ? EmptyLeaf :
                    root.children[0];
        }
    };
    /** Same as `editRange` except that the callback is called for all pairs. */
    BTree.prototype.editAll = function (onFound, initialCounter) {
        return this.editRange(this.minKey(), this.maxKey(), true, onFound, initialCounter);
    };
    /**
     * Removes a range of key-value pairs from the B+ tree.
     * @param low The first key scanned will be greater than or equal to `low`.
     * @param high Scanning stops when a key larger than this is reached.
     * @param includeHigh Specifies whether the `high` key, if present, is deleted.
     * @returns The number of key-value pairs that were deleted.
     * @description Computational complexity: O(log size + number of items deleted)
     */
    BTree.prototype.deleteRange = function (low, high, includeHigh) {
        return this.editRange(low, high, includeHigh, DeleteRange);
    };
    /** Deletes a series of keys from the collection. */
    BTree.prototype.deleteKeys = function (keys) {
        for (var i = 0, r = 0; i < keys.length; i++)
            if (this.delete(keys[i]))
                r++;
        return r;
    };
    Object.defineProperty(BTree.prototype, "height", {
        /** Gets the height of the tree: the number of internal nodes between the
         *  BTree object and its leaf nodes (zero if there are no internal nodes). */
        get: function () {
            for (var node = this._root, h = -1; node != null; h++)
                node = node.children;
            return h;
        },
        enumerable: true,
        configurable: true
    });
    /** Makes the object read-only to ensure it is not accidentally modified.
     *  Freezing does not have to be permanent; unfreeze() reverses the effect.
     *  This is accomplished by replacing mutator functions with a function
     *  that throws an Error. Compared to using a property (e.g. this.isFrozen)
     *  this implementation gives better performance in non-frozen BTrees.
     */
    BTree.prototype.freeze = function () {
        var t = this;
        // Note: all other mutators ultimately call set() or editRange() 
        //       so we don't need to override those others.
        t.clear = t.set = t.editRange = function () {
            throw new Error("Attempted to modify a frozen BTree");
        };
    };
    /** Ensures mutations are allowed, reversing the effect of freeze(). */
    BTree.prototype.unfreeze = function () {
        delete this.clear;
        delete this.set;
        delete this.editRange;
    };
    Object.defineProperty(BTree.prototype, "isFrozen", {
        /** Returns true if the tree appears to be frozen. */
        get: function () {
            return this.hasOwnProperty('editRange');
        },
        enumerable: true,
        configurable: true
    });
    /** Scans the tree for signs of serious bugs (e.g. this.size doesn't match
     *  number of elements, internal nodes not caching max element properly...)
     *  Computational complexity: O(number of nodes), i.e. O(size). This method
     *  skips the most expensive test - whether all keys are sorted - but it
     *  does check that maxKey() of the children of internal nodes are sorted. */
    BTree.prototype.checkValid = function () {
        var size = this._root.checkValid(0, this);
        check(size === this.size, "size mismatch: counted ", size, "but stored", this.size);
    };
    return BTree;
}());
exports.default = BTree;
if (Symbol && Symbol.iterator) // iterator is equivalent to entries()
    BTree.prototype[Symbol.iterator] = BTree.prototype.entries;
BTree.prototype.where = BTree.prototype.filter;
BTree.prototype.setRange = BTree.prototype.setPairs;
BTree.prototype.add = BTree.prototype.set;
function iterator(next) {
    if (next === void 0) { next = (function () { return ({ done: true, value: undefined }); }); }
    var result = { next: next };
    if (Symbol && Symbol.iterator)
        result[Symbol.iterator] = function () { return this; };
    return result;
}
/** Leaf node / base class. **************************************************/
var BNode = /** @class */ (function () {
    function BNode(keys, values) {
        if (keys === void 0) { keys = []; }
        this.keys = keys;
        this.values = values || undefVals;
        this.isShared = undefined;
    }
    Object.defineProperty(BNode.prototype, "isLeaf", {
        get: function () { return this.children === undefined; },
        enumerable: true,
        configurable: true
    });
    // Shared methods /////////////////////////////////////////////////////////
    BNode.prototype.maxKey = function () {
        return this.keys[this.keys.length - 1];
    };
    // If key not found, returns i^failXor where i is the insertion index.
    // Callers that don't care whether there was a match will set failXor=0.
    BNode.prototype.indexOf = function (key, failXor, cmp) {
        // TODO: benchmark multiple search strategies
        var keys = this.keys;
        var lo = 0, hi = keys.length, mid = hi >> 1;
        while (lo < hi) {
            var c = cmp(keys[mid], key);
            if (c < 0)
                lo = mid + 1;
            else if (c > 0) // key < keys[mid]
                hi = mid;
            else if (c === 0)
                return mid;
            else {
                // c is NaN or otherwise invalid
                if (key === key) // at least the search key is not NaN
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
    };
    // Leaf Node: misc //////////////////////////////////////////////////////////
    BNode.prototype.minKey = function () {
        return this.keys[0];
    };
    BNode.prototype.clone = function () {
        var v = this.values;
        return new BNode(this.keys.slice(0), v === undefVals ? v : v.slice(0));
    };
    BNode.prototype.greedyClone = function (force) {
        return this.isShared && !force ? this : this.clone();
    };
    BNode.prototype.get = function (key, defaultValue, tree) {
        var i = this.indexOf(key, -1, tree._compare);
        return i < 0 ? defaultValue : this.values[i];
    };
    BNode.prototype.checkValid = function (depth, tree) {
        var kL = this.keys.length, vL = this.values.length;
        check(this.values === undefVals ? kL <= vL : kL === vL, "keys/values length mismatch: depth", depth, "with lengths", kL, vL);
        // Note: we don't check for "node too small" because sometimes a node
        // can legitimately have size 1. This occurs if there is a batch 
        // deletion, leaving a node of size 1, and the siblings are full so
        // it can't be merged with adjacent nodes. However, the parent will
        // verify that the average node size is at least half of the maximum.
        check(depth == 0 || kL > 0, "empty leaf at depth", depth);
        return kL;
    };
    // Leaf Node: set & node splitting //////////////////////////////////////////
    BNode.prototype.set = function (key, value, overwrite, tree) {
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
    };
    BNode.prototype.reifyValues = function () {
        if (this.values === undefVals)
            return this.values = this.values.slice(0, this.keys.length);
        return this.values;
    };
    BNode.prototype.insertInLeaf = function (i, key, value, tree) {
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
    };
    BNode.prototype.takeFromRight = function (rhs) {
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
    };
    BNode.prototype.takeFromLeft = function (lhs) {
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
    };
    BNode.prototype.splitOffRightSide = function () {
        // Reminder: parent node must update its copy of key for this node
        var half = this.keys.length >> 1, keys = this.keys.splice(half);
        var values = this.values === undefVals ? undefVals : this.values.splice(half);
        return new BNode(keys, values);
    };
    // Leaf Node: scanning & deletions //////////////////////////////////////////
    BNode.prototype.forRange = function (low, high, includeHigh, editMode, tree, count, onFound) {
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
                        else if (result.hasOwnProperty('value')) {
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
    };
    /** Adds entire contents of right-hand sibling (rhs is left unchanged) */
    BNode.prototype.mergeSibling = function (rhs, _) {
        this.keys.push.apply(this.keys, rhs.keys);
        if (this.values === undefVals) {
            if (rhs.values === undefVals)
                return;
            this.values = this.values.slice(0, this.keys.length);
        }
        this.values.push.apply(this.values, rhs.reifyValues());
    };
    return BNode;
}());
/** Internal node (non-leaf node) ********************************************/
var BNodeInternal = /** @class */ (function (_super) {
    __extends(BNodeInternal, _super);
    function BNodeInternal(children, keys) {
        var _this = this;
        if (!keys) {
            keys = [];
            for (var i = 0; i < children.length; i++)
                keys[i] = children[i].maxKey();
        }
        _this = _super.call(this, keys) || this;
        _this.children = children;
        return _this;
    }
    BNodeInternal.prototype.clone = function () {
        var children = this.children.slice(0);
        for (var i = 0; i < children.length; i++)
            children[i].isShared = true;
        return new BNodeInternal(children, this.keys.slice(0));
    };
    BNodeInternal.prototype.greedyClone = function (force) {
        if (this.isShared && !force)
            return this;
        var nu = new BNodeInternal(this.children.slice(0), this.keys.slice(0));
        for (var i = 0; i < nu.children.length; i++)
            nu.children[i] = nu.children[i].greedyClone();
        return nu;
    };
    BNodeInternal.prototype.minKey = function () {
        return this.children[0].minKey();
    };
    BNodeInternal.prototype.get = function (key, defaultValue, tree) {
        var i = this.indexOf(key, 0, tree._compare), children = this.children;
        return i < children.length ? children[i].get(key, defaultValue, tree) : undefined;
    };
    BNodeInternal.prototype.checkValid = function (depth, tree) {
        var kL = this.keys.length, cL = this.children.length;
        check(kL === cL, "keys/children length mismatch: depth", depth, "lengths", kL, cL);
        check(kL > 1, "internal node has length", kL, "at depth", depth);
        var size = 0, c = this.children, k = this.keys, childSize = 0;
        for (var i = 0; i < cL; i++) {
            size += c[i].checkValid(depth + 1, tree);
            childSize += c[i].keys.length;
            check(size >= childSize, "wtf"); // no way this will ever fail
            check(i === 0 || c[i - 1].constructor === c[i].constructor, "type mismatch");
            if (c[i].maxKey() != k[i])
                check(false, "keys[", i, "] =", k[i], "is wrong, should be ", c[i].maxKey(), "at depth", depth);
            if (!(i === 0 || tree._compare(k[i - 1], k[i]) < 0))
                check(false, "sort violation at depth", depth, "index", i, "keys", k[i - 1], k[i]);
        }
        var toofew = childSize < (tree.maxNodeSize >> 1) * cL;
        if (toofew || childSize > tree.maxNodeSize * cL)
            check(false, toofew ? "too few" : "too many", "children (", childSize, size, ") at depth", depth, ", maxNodeSize:", tree.maxNodeSize, "children.length:", cL);
        return size;
    };
    // Internal Node: set & node splitting //////////////////////////////////////
    BNodeInternal.prototype.set = function (key, value, overwrite, tree) {
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
            if (i > 0 && (other = c[i - 1]).keys.length < max && cmp(child.keys[0], key) < 0) {
                if (other.isShared)
                    c[i - 1] = other = other.clone();
                other.takeFromRight(child);
                this.keys[i - 1] = other.maxKey();
            }
            else if ((other = c[i + 1]) !== undefined && other.keys.length < max && cmp(child.maxKey(), key) < 0) {
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
        if (this.keys.length < max) { // yes
            this.insert(i + 1, result);
            return true;
        }
        else { // no, we must split also
            var newRightSibling = this.splitOffRightSide(), target = this;
            if (cmp(result.maxKey(), this.maxKey()) > 0) {
                target = newRightSibling;
                i -= this.keys.length;
            }
            target.insert(i + 1, result);
            return newRightSibling;
        }
    };
    BNodeInternal.prototype.insert = function (i, child) {
        this.children.splice(i, 0, child);
        this.keys.splice(i, 0, child.maxKey());
    };
    BNodeInternal.prototype.splitOffRightSide = function () {
        var half = this.children.length >> 1;
        return new BNodeInternal(this.children.splice(half), this.keys.splice(half));
    };
    BNodeInternal.prototype.takeFromRight = function (rhs) {
        // Reminder: parent node must update its copy of key for this node
        // assert: neither node is shared
        // assert rhs.keys.length > (maxNodeSize/2 && this.keys.length<maxNodeSize)
        this.keys.push(rhs.keys.shift());
        this.children.push(rhs.children.shift());
    };
    BNodeInternal.prototype.takeFromLeft = function (lhs) {
        // Reminder: parent node must update its copy of key for this node
        // assert: neither node is shared
        // assert rhs.keys.length > (maxNodeSize/2 && this.keys.length<maxNodeSize)
        this.keys.unshift(lhs.keys.pop());
        this.children.unshift(lhs.children.pop());
    };
    // Internal Node: scanning & deletions //////////////////////////////////////
    BNodeInternal.prototype.forRange = function (low, high, includeHigh, editMode, tree, count, onFound) {
        var cmp = tree._compare;
        var iLow = this.indexOf(low, 0, cmp), i = iLow;
        var iHigh = Math.min(high === low ? iLow : this.indexOf(high, 0, cmp), this.keys.length - 1);
        var keys = this.keys, children = this.children;
        if (!editMode) {
            // Simple case
            for (; i <= iHigh; i++) {
                var result = children[i].forRange(low, high, includeHigh, editMode, tree, count, onFound);
                if (typeof result !== 'number')
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
                    if (typeof result !== 'number')
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
                    check(children.length === 1 && keys.length === 1, "emptiness bug");
                    children.shift();
                    keys.shift();
                }
            }
        }
        return count;
    };
    /** Merges child i with child i+1 if their combined size is not too large */
    BNodeInternal.prototype.tryMerge = function (i, maxSize) {
        var children = this.children;
        if (i >= 0 && i + 1 < children.length) {
            if (children[i].keys.length + children[i + 1].keys.length <= maxSize) {
                if (children[i].isShared) // cloned already UNLESS i is outside scan range
                    children[i] = children[i].clone();
                children[i].mergeSibling(children[i + 1], maxSize);
                children.splice(i + 1, 1);
                this.keys.splice(i + 1, 1);
                this.keys[i] = children[i].maxKey();
                return true;
            }
        }
        return false;
    };
    BNodeInternal.prototype.mergeSibling = function (rhs, maxNodeSize) {
        // assert !this.isShared;
        var oldLength = this.keys.length;
        this.keys.push.apply(this.keys, rhs.keys);
        this.children.push.apply(this.children, rhs.children);
        // If our children are themselves almost empty due to a mass-delete,
        // they may need to be merged too (but only the oldLength-1 and its
        // right sibling should need this).
        this.tryMerge(oldLength - 1, maxNodeSize);
    };
    return BNodeInternal;
}(BNode));
// Optimization: this array of `undefined`s is used instead of a normal
// array of values in nodes where `undefined` is the only value.
// Its length is extended to max node size on first use; since it can
// be shared between trees with different maximums, its length can only
// increase, never decrease. Its type should be undefined[] but strangely
// TypeScript won't allow the comparison V[] === undefined[]. To prevent
// users from making this array too large, BTree has a maximum node size.
var undefVals = [];
var Delete = { delete: true }, DeleteRange = function () { return Delete; };
var Break = { break: true };
var EmptyLeaf = (function () {
    var n = new BNode();
    n.isShared = true;
    return n;
})();
var EmptyArray = [];
var ReusedArray = []; // assumed thread-local
function check(fact) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (!fact) {
        args.unshift('B+ tree '); // at beginning of message
        throw new Error(args.join(' '));
    }
}
/** A BTree frozen in the empty state. */
exports.EmptyBTree = (function () { var t = new BTree(); t.freeze(); return t; })();

});

unwrapExports(b_tree);
var b_tree_1 = b_tree.defaultComparator;
var b_tree_2 = b_tree.EmptyBTree;

var extractKey_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-extracting-a-key-from-a-value-using-a-key-path
var extractKey = function (keyPath, value) {
    if (Array.isArray(keyPath)) {
        var result = [];
        for (var _i = 0, keyPath_1 = keyPath; _i < keyPath_1.length; _i++) {
            var item = keyPath_1[_i];
            // This doesn't make sense to me based on the spec, but it is needed to pass the W3C KeyPath tests (see same
            // comment in validateKeyPath)
            if (item !== undefined &&
                item !== null &&
                typeof item !== "string" &&
                item.toString) {
                item = item.toString();
            }
            result.push(valueToKey_1.default(extractKey(item, value)));
        }
        return result;
    }
    if (keyPath === "") {
        return value;
    }
    var remainingKeyPath = keyPath;
    var object = value;
    while (remainingKeyPath !== null) {
        var identifier = void 0;
        var i = remainingKeyPath.indexOf(".");
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
exports.default = extractKey;

});

unwrapExports(extractKey_1);

var injectKey_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

function injectKey(keyPath, value, key) {
    if (Array.isArray(keyPath)) {
        // tslint:disable-next-line max-line-length
        throw new Error("The key paths used in this section are always strings and never sequences, since it is not possible to create a object store which has a key generator and also has a key path that is a sequence.");
    }
    var identifiers = keyPath.split(".");
    if (identifiers.length === 0) {
        throw new Error("Assert: identifiers is not empty");
    }
    var lastIdentifier = identifiers.pop();
    if (lastIdentifier === null || lastIdentifier === undefined) {
        throw Error();
    }
    for (var _i = 0, identifiers_1 = identifiers; _i < identifiers_1.length; _i++) {
        var identifier = identifiers_1[_i];
        if (typeof value !== "object" && !Array.isArray(value)) {
            return false;
        }
        var hop = value.hasOwnProperty(identifier);
        if (!hop) {
            return true;
        }
        value = value[identifier];
    }
    if (!(typeof value === "object" || Array.isArray(value))) {
        throw new Error("can't inject key");
    }
    var newValue = structuredClone_1.default(value);
    newValue[lastIdentifier] = structuredClone_1.default(key);
    return newValue;
}
exports.injectKey = injectKey;
exports.default = injectKey;

});

unwrapExports(injectKey_1);
var injectKey_2 = injectKey_1.injectKey;

var makeStoreKeyValue_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });





function makeStoreKeyValue(value, key, currentKeyGenerator, autoIncrement, keyPath) {
    var haveKey = key !== null && key !== undefined;
    var haveKeyPath = keyPath !== null && keyPath !== undefined;
    // This models a decision table on (haveKey, haveKeyPath, autoIncrement)
    value = structuredClone_1.default(value);
    if (haveKey) {
        if (haveKeyPath) {
            // (yes, yes, no)
            // (yes, yes, yes)
            throw new errors$1.DataError();
        }
        else {
            if (autoIncrement) {
                // (yes, no, yes)
                key = valueToKey_1.default(key);
                var updatedKeyGenerator = void 0;
                if (typeof key !== "number") {
                    updatedKeyGenerator = currentKeyGenerator;
                }
                else {
                    updatedKeyGenerator = key;
                }
                return {
                    key: key,
                    value: value,
                    updatedKeyGenerator: updatedKeyGenerator,
                };
            }
            else {
                // (yes, no, no)
                throw new errors$1.DataError();
            }
        }
    }
    else {
        if (haveKeyPath) {
            if (autoIncrement) {
                // (no, yes, yes)
                var updatedKeyGenerator = void 0;
                var maybeInlineKey = extractKey_1.default(keyPath, value);
                if (maybeInlineKey === undefined) {
                    value = injectKey_1.default(keyPath, value, currentKeyGenerator);
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
                    updatedKeyGenerator: updatedKeyGenerator,
                };
            }
            else {
                // (no, yes, no)
                key = extractKey_1.default(keyPath, value);
                key = valueToKey_1.default(key);
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
                throw new errors$1.DataError();
            }
        }
    }
}
exports.makeStoreKeyValue = makeStoreKeyValue;

});

unwrapExports(makeStoreKeyValue_1);
var makeStoreKeyValue_2 = makeStoreKeyValue_1.makeStoreKeyValue;

var getIndexKeys_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });


function getIndexKeys(value, keyPath, multiEntry) {
    if (multiEntry && Array.isArray(keyPath)) {
        var keys = [];
        for (var _i = 0, keyPath_1 = keyPath; _i < keyPath_1.length; _i++) {
            var subkeyPath = keyPath_1[_i];
            var key = extractKey_1.default(subkeyPath, value);
            try {
                var k = valueToKey_1.default(key);
                keys.push(k);
            }
            catch (_a) {
                // Ignore invalid subkeys
            }
        }
        return keys;
    }
    else {
        var key = extractKey_1.default(keyPath, value);
        return [valueToKey_1.default(key)];
    }
}
exports.getIndexKeys = getIndexKeys;
exports.default = getIndexKeys;

});

unwrapExports(getIndexKeys_1);
var getIndexKeys_2 = getIndexKeys_1.getIndexKeys;

var MemoryBackend_1 = createCommonjsModule(function (module, exports) {
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
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (commonjsGlobal && commonjsGlobal.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });









var TransactionLevel;
(function (TransactionLevel) {
    TransactionLevel[TransactionLevel["Disconnected"] = 0] = "Disconnected";
    TransactionLevel[TransactionLevel["Connected"] = 1] = "Connected";
    TransactionLevel[TransactionLevel["Read"] = 2] = "Read";
    TransactionLevel[TransactionLevel["Write"] = 3] = "Write";
    TransactionLevel[TransactionLevel["VersionChange"] = 4] = "VersionChange";
})(TransactionLevel || (TransactionLevel = {}));
var AsyncCondition = /** @class */ (function () {
    function AsyncCondition() {
        var op = openPromise_1.default();
        this._waitPromise = op.promise;
        this._resolveWaitPromise = op.resolve;
    }
    AsyncCondition.prototype.wait = function () {
        return this._waitPromise;
    };
    AsyncCondition.prototype.trigger = function () {
        this._resolveWaitPromise();
        var op = openPromise_1.default();
        this._waitPromise = op.promise;
        this._resolveWaitPromise = op.resolve;
    };
    return AsyncCondition;
}());
function nextStoreKey(forward, data, k) {
    if (k === undefined || k === null) {
        return undefined;
    }
    var res = forward ? data.nextHigherPair(k) : data.nextLowerPair(k);
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
    var cmpResult = cmp.default(key1, key2);
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
 */
var MemoryBackend = /** @class */ (function () {
    function MemoryBackend() {
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
        this.disconnectCond = new AsyncCondition();
        /**
         * Conditation that is triggered whenever a transaction finishes.
         */
        this.transactionDoneCond = new AsyncCondition();
        this.enableTracing = false;
    }
    /**
     * Load the data in this IndexedDB backend from a dump in JSON format.
     *
     * Must be called before any connections to the database backend have
     * been made.
     */
    MemoryBackend.prototype.importDump = function (data) {
        if (this.enableTracing) {
            console.log("importing dump (a)");
        }
        if (this.transactionIdCounter != 1 || this.connectionIdCounter != 1) {
            throw Error("data must be imported before first transaction or connection");
        }
        this.databases = {};
        for (var _i = 0, _a = Object.keys(data.databases); _i < _a.length; _i++) {
            var dbName = _a[_i];
            var schema = data.databases[dbName].schema;
            if (typeof schema !== "object") {
                throw Error("DB dump corrupt");
            }
            var objectStores = {};
            for (var _b = 0, _c = Object.keys(data.databases[dbName].objectStores); _b < _c.length; _b++) {
                var objectStoreName = _c[_b];
                var dumpedObjectStore = data.databases[dbName].objectStores[objectStoreName];
                var indexes = {};
                for (var _d = 0, _e = Object.keys(dumpedObjectStore.indexes); _d < _e.length; _d++) {
                    var indexName = _e[_d];
                    var dumpedIndex = dumpedObjectStore.indexes[indexName];
                    var pairs_1 = dumpedIndex.records.map(function (r) {
                        return structuredClone_1.default([r.indexKey, r]);
                    });
                    var indexData = new b_tree.default(pairs_1, cmp.default);
                    var index = {
                        deleted: false,
                        modifiedData: undefined,
                        modifiedName: undefined,
                        originalName: indexName,
                        originalData: indexData,
                    };
                    indexes[indexName] = index;
                }
                var pairs = dumpedObjectStore.records.map(function (r) {
                    return structuredClone_1.default([r.primaryKey, r]);
                });
                var objectStoreData = new b_tree.default(pairs, cmp.default);
                var objectStore = {
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
            var db = {
                deleted: false,
                committedObjectStores: objectStores,
                committedSchema: structuredClone_1.default(schema),
                connectionCookie: undefined,
                modifiedObjectStores: {},
                txLevel: TransactionLevel.Disconnected,
                txRestrictObjectStores: undefined,
            };
            this.databases[dbName] = db;
        }
    };
    MemoryBackend.prototype.makeObjectStoreMap = function (database) {
        var map = {};
        for (var objectStoreName in database.committedObjectStores) {
            var store = database.committedObjectStores[objectStoreName];
            var entry = {
                store: store,
                indexMap: Object.assign({}, store.committedIndexes),
            };
            map[objectStoreName] = entry;
        }
        return map;
    };
    /**
     * Export the contents of the database to JSON.
     *
     * Only exports data that has been committed.
     */
    MemoryBackend.prototype.exportDump = function () {
        this.enableTracing && console.log("exporting dump");
        var dbDumps = {};
        for (var _i = 0, _a = Object.keys(this.databases); _i < _a.length; _i++) {
            var dbName = _a[_i];
            var db = this.databases[dbName];
            var objectStores = {};
            var _loop_1 = function (objectStoreName) {
                var objectStore = db.committedObjectStores[objectStoreName];
                var indexes = {};
                var _loop_2 = function (indexName) {
                    var index = objectStore.committedIndexes[indexName];
                    var indexRecords = [];
                    index.originalData.forEach(function (v) {
                        indexRecords.push(structuredClone_1.default(v));
                    });
                    indexes[indexName] = { name: indexName, records: indexRecords };
                };
                for (var _i = 0, _a = Object.keys(objectStore.committedIndexes); _i < _a.length; _i++) {
                    var indexName = _a[_i];
                    _loop_2(indexName);
                }
                var objectStoreRecords = [];
                objectStore.originalData.forEach(function (v) {
                    objectStoreRecords.push(structuredClone_1.default(v));
                });
                objectStores[objectStoreName] = {
                    name: objectStoreName,
                    records: objectStoreRecords,
                    keyGenerator: objectStore.originalKeyGenerator,
                    indexes: indexes,
                };
            };
            for (var _b = 0, _c = Object.keys(db.committedObjectStores); _b < _c.length; _b++) {
                var objectStoreName = _c[_b];
                _loop_1(objectStoreName);
            }
            var dbDump = {
                objectStores: objectStores,
                schema: structuredClone_1.default(this.databases[dbName].committedSchema),
            };
            dbDumps[dbName] = dbDump;
        }
        return { databases: dbDumps };
    };
    MemoryBackend.prototype.getDatabases = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dbList, name;
            return __generator(this, function (_a) {
                if (this.enableTracing) {
                    console.log("TRACING: getDatabase");
                }
                dbList = [];
                for (name in this.databases) {
                    dbList.push({
                        name: name,
                        version: this.databases[name].committedSchema.databaseVersion,
                    });
                }
                return [2 /*return*/, dbList];
            });
        });
    };
    MemoryBackend.prototype.deleteDatabase = function (tx, name) {
        return __awaiter(this, void 0, void 0, function () {
            var myConn, myDb;
            return __generator(this, function (_a) {
                if (this.enableTracing) {
                    console.log("TRACING: deleteDatabase");
                }
                myConn = this.connectionsByTransaction[tx.transactionCookie];
                if (!myConn) {
                    throw Error("no connection associated with transaction");
                }
                myDb = this.databases[name];
                if (!myDb) {
                    throw Error("db not found");
                }
                if (myDb.committedSchema.databaseName !== name) {
                    throw Error("name does not match");
                }
                if (myDb.txLevel < TransactionLevel.VersionChange) {
                    throw new errors$1.InvalidStateError();
                }
                if (myDb.connectionCookie !== tx.transactionCookie) {
                    throw new errors$1.InvalidAccessError();
                }
                myDb.deleted = true;
                return [2 /*return*/];
            });
        });
    };
    MemoryBackend.prototype.connectDatabase = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var connectionId, connectionCookie, database, schema, myConn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.enableTracing) {
                            console.log("TRACING: connectDatabase(" + name + ")");
                        }
                        connectionId = this.connectionIdCounter++;
                        connectionCookie = "connection-" + connectionId;
                        database = this.databases[name];
                        if (!database) {
                            schema = {
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
                        _a.label = 1;
                    case 1:
                        if (!(database.txLevel !== TransactionLevel.Disconnected)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.disconnectCond.wait()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        database.txLevel = TransactionLevel.Connected;
                        database.txRestrictObjectStores = undefined;
                        database.connectionCookie = connectionCookie;
                        myConn = {
                            dbName: name,
                            deleted: false,
                            objectStoreMap: this.makeObjectStoreMap(database),
                            modifiedSchema: structuredClone_1.default(database.committedSchema),
                        };
                        this.connections[connectionCookie] = myConn;
                        return [2 /*return*/, { connectionCookie: connectionCookie }];
                }
            });
        });
    };
    MemoryBackend.prototype.beginTransaction = function (conn, objectStores, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var transactionCookie, myConn, myDb;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.enableTracing) {
                            console.log("TRACING: beginTransaction");
                        }
                        transactionCookie = "tx-" + this.transactionIdCounter++;
                        myConn = this.connections[conn.connectionCookie];
                        if (!myConn) {
                            throw Error("connection not found");
                        }
                        myDb = this.databases[myConn.dbName];
                        if (!myDb) {
                            throw Error("db not found");
                        }
                        _a.label = 1;
                    case 1:
                        if (!(myDb.txLevel !== TransactionLevel.Connected)) return [3 /*break*/, 3];
                        if (this.enableTracing) {
                            console.log("TRACING: beginTransaction -- waiting for others to close");
                        }
                        return [4 /*yield*/, this.transactionDoneCond.wait()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        if (mode === "readonly") {
                            myDb.txLevel = TransactionLevel.Read;
                        }
                        else if (mode === "readwrite") {
                            myDb.txLevel = TransactionLevel.Write;
                        }
                        else {
                            throw Error("unsupported transaction mode");
                        }
                        myDb.txRestrictObjectStores = __spreadArrays(objectStores);
                        this.connectionsByTransaction[transactionCookie] = myConn;
                        return [2 /*return*/, { transactionCookie: transactionCookie }];
                }
            });
        });
    };
    MemoryBackend.prototype.enterVersionChange = function (conn, newVersion) {
        return __awaiter(this, void 0, void 0, function () {
            var transactionCookie, myConn, myDb;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.enableTracing) {
                            console.log("TRACING: enterVersionChange");
                        }
                        transactionCookie = "tx-vc-" + this.transactionIdCounter++;
                        myConn = this.connections[conn.connectionCookie];
                        if (!myConn) {
                            throw Error("connection not found");
                        }
                        myDb = this.databases[myConn.dbName];
                        if (!myDb) {
                            throw Error("db not found");
                        }
                        _a.label = 1;
                    case 1:
                        if (!(myDb.txLevel !== TransactionLevel.Connected)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.transactionDoneCond.wait()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        myDb.txLevel = TransactionLevel.VersionChange;
                        myDb.txRestrictObjectStores = undefined;
                        this.connectionsByTransaction[transactionCookie] = myConn;
                        myConn.modifiedSchema.databaseVersion = newVersion;
                        return [2 /*return*/, { transactionCookie: transactionCookie }];
                }
            });
        });
    };
    MemoryBackend.prototype.close = function (conn) {
        return __awaiter(this, void 0, void 0, function () {
            var myConn, myDb;
            return __generator(this, function (_a) {
                if (this.enableTracing) {
                    console.log("TRACING: close");
                }
                myConn = this.connections[conn.connectionCookie];
                if (!myConn) {
                    throw Error("connection not found - already closed?");
                }
                if (!myConn.deleted) {
                    myDb = this.databases[myConn.dbName];
                    if (myDb.txLevel != TransactionLevel.Connected) {
                        throw Error("invalid state");
                    }
                    myDb.txLevel = TransactionLevel.Disconnected;
                    myDb.txRestrictObjectStores = undefined;
                }
                delete this.connections[conn.connectionCookie];
                this.disconnectCond.trigger();
                return [2 /*return*/];
            });
        });
    };
    MemoryBackend.prototype.getSchema = function (dbConn) {
        if (this.enableTracing) {
            console.log("TRACING: getSchema");
        }
        var myConn = this.connections[dbConn.connectionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        var db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        return myConn.modifiedSchema;
    };
    MemoryBackend.prototype.renameIndex = function (btx, objectStoreName, oldName, newName) {
        if (this.enableTracing) {
            console.log("TRACING: renameIndex(?, " + oldName + ", " + newName + ")");
        }
        var myConn = this.connectionsByTransaction[btx.transactionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        var db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        if (db.txLevel < TransactionLevel.VersionChange) {
            throw Error("only allowed in versionchange transaction");
        }
        var schema = myConn.modifiedSchema;
        if (!schema) {
            throw Error();
        }
        var indexesSchema = schema.objectStores[objectStoreName].indexes;
        if (indexesSchema[newName]) {
            throw new Error("new index name already used");
        }
        if (!indexesSchema) {
            throw new Error("new index name already used");
        }
        var index = myConn.objectStoreMap[objectStoreName].indexMap[oldName];
        if (!index) {
            throw Error("old index missing in connection's index map");
        }
        indexesSchema[newName] = indexesSchema[newName];
        delete indexesSchema[oldName];
        myConn.objectStoreMap[objectStoreName].indexMap[newName] = index;
        delete myConn.objectStoreMap[objectStoreName].indexMap[oldName];
        index.modifiedName = newName;
    };
    MemoryBackend.prototype.deleteIndex = function (btx, objectStoreName, indexName) {
        if (this.enableTracing) {
            console.log("TRACING: deleteIndex(" + indexName + ")");
        }
        var myConn = this.connections[btx.transactionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        var db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        if (db.txLevel < TransactionLevel.VersionChange) {
            throw Error("only allowed in versionchange transaction");
        }
        var schema = myConn.modifiedSchema;
        if (!schema) {
            throw Error();
        }
        if (!schema.objectStores[objectStoreName].indexes[indexName]) {
            throw new Error("index does not exist");
        }
        var index = myConn.objectStoreMap[objectStoreName].indexMap[indexName];
        if (!index) {
            throw Error("old index missing in connection's index map");
        }
        index.deleted = true;
        delete schema.objectStores[objectStoreName].indexes[indexName];
        delete myConn.objectStoreMap[objectStoreName].indexMap[indexName];
    };
    MemoryBackend.prototype.deleteObjectStore = function (btx, name) {
        if (this.enableTracing) {
            console.log("TRACING: deleteObjectStore(" + name + ")");
        }
        var myConn = this.connections[btx.transactionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        var db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        if (db.txLevel < TransactionLevel.VersionChange) {
            throw Error("only allowed in versionchange transaction");
        }
        var schema = myConn.modifiedSchema;
        if (!schema) {
            throw Error();
        }
        var objectStoreProperties = schema.objectStores[name];
        if (!objectStoreProperties) {
            throw Error("object store not found");
        }
        var objectStoreMapEntry = myConn.objectStoreMap[name];
        if (!objectStoreMapEntry) {
            throw Error("object store not found in map");
        }
        var indexNames = Object.keys(objectStoreProperties.indexes);
        for (var _i = 0, indexNames_1 = indexNames; _i < indexNames_1.length; _i++) {
            var indexName = indexNames_1[_i];
            this.deleteIndex(btx, name, indexName);
        }
        objectStoreMapEntry.store.deleted = true;
        delete myConn.objectStoreMap[name];
        delete schema.objectStores[name];
    };
    MemoryBackend.prototype.renameObjectStore = function (btx, oldName, newName) {
        if (this.enableTracing) {
            console.log("TRACING: renameObjectStore(?, " + oldName + ", " + newName + ")");
        }
        var myConn = this.connections[btx.transactionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        var db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        if (db.txLevel < TransactionLevel.VersionChange) {
            throw Error("only allowed in versionchange transaction");
        }
        var schema = myConn.modifiedSchema;
        if (!schema) {
            throw Error();
        }
        if (!schema.objectStores[oldName]) {
            throw Error("object store not found");
        }
        if (schema.objectStores[newName]) {
            throw Error("new object store already exists");
        }
        var objectStoreMapEntry = myConn.objectStoreMap[oldName];
        if (!objectStoreMapEntry) {
            throw Error("object store not found in map");
        }
        objectStoreMapEntry.store.modifiedName = newName;
        schema.objectStores[newName] = schema.objectStores[oldName];
        delete schema.objectStores[oldName];
        delete myConn.objectStoreMap[oldName];
        myConn.objectStoreMap[newName] = objectStoreMapEntry;
    };
    MemoryBackend.prototype.createObjectStore = function (btx, name, keyPath, autoIncrement) {
        if (this.enableTracing) {
            console.log("TRACING: createObjectStore(" + btx.transactionCookie + ", " + name + ")");
        }
        var myConn = this.connectionsByTransaction[btx.transactionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        var db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        if (db.txLevel < TransactionLevel.VersionChange) {
            throw Error("only allowed in versionchange transaction");
        }
        var newObjectStore = {
            deleted: false,
            modifiedName: undefined,
            originalName: name,
            modifiedData: undefined,
            originalData: new b_tree.default([], cmp.default),
            modifiedKeyGenerator: undefined,
            originalKeyGenerator: 1,
            committedIndexes: {},
            modifiedIndexes: {},
        };
        var schema = myConn.modifiedSchema;
        if (!schema) {
            throw Error("no schema for versionchange tx");
        }
        schema.objectStores[name] = {
            autoIncrement: autoIncrement,
            keyPath: keyPath,
            indexes: {},
        };
        myConn.objectStoreMap[name] = { store: newObjectStore, indexMap: {} };
        db.modifiedObjectStores[name] = newObjectStore;
    };
    MemoryBackend.prototype.createIndex = function (btx, indexName, objectStoreName, keyPath, multiEntry, unique) {
        var _this = this;
        if (this.enableTracing) {
            console.log("TRACING: createIndex(" + indexName + ")");
        }
        var myConn = this.connectionsByTransaction[btx.transactionCookie];
        if (!myConn) {
            throw Error("unknown connection");
        }
        var db = this.databases[myConn.dbName];
        if (!db) {
            throw Error("db not found");
        }
        if (db.txLevel < TransactionLevel.VersionChange) {
            throw Error("only allowed in versionchange transaction");
        }
        var indexProperties = {
            keyPath: keyPath,
            multiEntry: multiEntry,
            unique: unique,
        };
        var newIndex = {
            deleted: false,
            modifiedData: undefined,
            modifiedName: undefined,
            originalData: new b_tree.default([], cmp.default),
            originalName: indexName,
        };
        myConn.objectStoreMap[objectStoreName].indexMap[indexName] = newIndex;
        db.modifiedObjectStores[objectStoreName].modifiedIndexes[indexName] = newIndex;
        var schema = myConn.modifiedSchema;
        if (!schema) {
            throw Error("no schema in versionchange tx");
        }
        var objectStoreProperties = schema.objectStores[objectStoreName];
        if (!objectStoreProperties) {
            throw Error("object store not found");
        }
        objectStoreProperties.indexes[indexName] = indexProperties;
        var objectStoreMapEntry = myConn.objectStoreMap[objectStoreName];
        if (!objectStoreMapEntry) {
            throw Error("object store does not exist");
        }
        var storeData = objectStoreMapEntry.store.modifiedData ||
            objectStoreMapEntry.store.originalData;
        storeData.forEach(function (v, k) {
            _this.insertIntoIndex(newIndex, k, v.value, indexProperties);
        });
    };
    MemoryBackend.prototype.deleteRecord = function (btx, objectStoreName, range) {
        return __awaiter(this, void 0, void 0, function () {
            var myConn, db, schema, objectStoreMapEntry, modifiedData, currKey, firstValue, storeEntry, _i, _a, indexName, index, indexProperties;
            return __generator(this, function (_b) {
                if (this.enableTracing) {
                    console.log("TRACING: deleteRecord from store " + objectStoreName);
                }
                myConn = this.connectionsByTransaction[btx.transactionCookie];
                if (!myConn) {
                    throw Error("unknown connection");
                }
                db = this.databases[myConn.dbName];
                if (!db) {
                    throw Error("db not found");
                }
                if (db.txLevel < TransactionLevel.Write) {
                    throw Error("only allowed in write transaction");
                }
                if (db.txRestrictObjectStores &&
                    !db.txRestrictObjectStores.includes(objectStoreName)) {
                    throw Error("Not allowed to access store '" + objectStoreName + "', transaction is over " + JSON.stringify(db.txRestrictObjectStores));
                }
                if (typeof range !== "object") {
                    throw Error("deleteRecord got invalid range (must be object)");
                }
                if (!("lowerOpen" in range)) {
                    throw Error("deleteRecord got invalid range (sanity check failed, 'lowerOpen' missing)");
                }
                schema = myConn.modifiedSchema;
                objectStoreMapEntry = myConn.objectStoreMap[objectStoreName];
                if (!objectStoreMapEntry.store.modifiedData) {
                    objectStoreMapEntry.store.modifiedData =
                        objectStoreMapEntry.store.originalData;
                }
                modifiedData = objectStoreMapEntry.store.modifiedData;
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
                firstValue = modifiedData.get(currKey);
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
                        if (range.upperOpen && cmp.default(currKey, range.upper) === 0) {
                            // We have a range that's upperOpen, so stop before we delete the upper bound.
                            break;
                        }
                        if (!range.upperOpen && cmp.default(currKey, range.upper) > 0) {
                            // The upper range is inclusive, only stop if we're after the upper range.
                            break;
                        }
                    }
                    storeEntry = modifiedData.get(currKey);
                    if (!storeEntry) {
                        throw Error("assertion failed");
                    }
                    for (_i = 0, _a = Object.keys(schema.objectStores[objectStoreName].indexes); _i < _a.length; _i++) {
                        indexName = _a[_i];
                        index = myConn.objectStoreMap[objectStoreName].indexMap[indexName];
                        if (!index) {
                            throw Error("index referenced by object store does not exist");
                        }
                        this.enableTracing &&
                            console.log("deleting from index " + indexName + " for object store " + objectStoreName);
                        indexProperties = schema.objectStores[objectStoreName].indexes[indexName];
                        this.deleteFromIndex(index, storeEntry.primaryKey, storeEntry.value, indexProperties);
                    }
                    modifiedData = modifiedData.without(currKey);
                    currKey = modifiedData.nextHigherKey(currKey);
                }
                objectStoreMapEntry.store.modifiedData = modifiedData;
                return [2 /*return*/];
            });
        });
    };
    MemoryBackend.prototype.deleteFromIndex = function (index, primaryKey, value, indexProperties) {
        if (this.enableTracing) {
            console.log("deleteFromIndex(" + (index.modifiedName || index.originalName) + ")");
        }
        if (value === undefined || value === null) {
            throw Error("cannot delete null/undefined value from index");
        }
        var indexData = index.modifiedData || index.originalData;
        var indexKeys = getIndexKeys_1.default(value, indexProperties.keyPath, indexProperties.multiEntry);
        for (var _i = 0, indexKeys_1 = indexKeys; _i < indexKeys_1.length; _i++) {
            var indexKey = indexKeys_1[_i];
            var existingRecord = indexData.get(indexKey);
            if (!existingRecord) {
                throw Error("db inconsistent: expected index entry missing");
            }
            var newPrimaryKeys = existingRecord.primaryKeys.filter(function (x) { return cmp.default(x, primaryKey) !== 0; });
            if (newPrimaryKeys.length === 0) {
                index.modifiedData = indexData.without(indexKey);
            }
            else {
                var newIndexRecord = {
                    indexKey: indexKey,
                    primaryKeys: newPrimaryKeys,
                };
                index.modifiedData = indexData.with(indexKey, newIndexRecord, true);
            }
        }
    };
    MemoryBackend.prototype.getRecords = function (btx, req) {
        return __awaiter(this, void 0, void 0, function () {
            var myConn, db, objectStoreMapEntry, range, numResults, indexKeys, primaryKeys, values, forward, unique, storeData, haveIndex, index, indexData, indexPos, primaryPos, compareResult, primCompareResult, indexEntry, res, primkeySubPos, pos, cmpResult, cmpResult, res, skip, i, result, storePos, storeEntry, res;
            return __generator(this, function (_a) {
                if (this.enableTracing) {
                    console.log("TRACING: getRecords");
                    console.log("query", req);
                }
                myConn = this.connectionsByTransaction[btx.transactionCookie];
                if (!myConn) {
                    throw Error("unknown connection");
                }
                db = this.databases[myConn.dbName];
                if (!db) {
                    throw Error("db not found");
                }
                if (db.txLevel < TransactionLevel.Read) {
                    throw Error("only allowed while running a transaction");
                }
                if (db.txRestrictObjectStores &&
                    !db.txRestrictObjectStores.includes(req.objectStoreName)) {
                    throw Error("Not allowed to access store '" + req.objectStoreName + "', transaction is over " + JSON.stringify(db.txRestrictObjectStores));
                }
                objectStoreMapEntry = myConn.objectStoreMap[req.objectStoreName];
                if (!objectStoreMapEntry) {
                    throw Error("object store not found");
                }
                if (req.range == null || req.range === undefined) {
                    range = new BridgeIDBKeyRange_1.default(undefined, undefined, true, true);
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
                numResults = 0;
                indexKeys = [];
                primaryKeys = [];
                values = [];
                forward = req.direction === "next" || req.direction === "nextunique";
                unique = req.direction === "prevunique" || req.direction === "nextunique";
                storeData = objectStoreMapEntry.store.modifiedData ||
                    objectStoreMapEntry.store.originalData;
                haveIndex = req.indexName !== undefined;
                if (haveIndex) {
                    index = myConn.objectStoreMap[req.objectStoreName].indexMap[req.indexName];
                    indexData = index.modifiedData || index.originalData;
                    indexPos = req.lastIndexPosition;
                    if (indexPos === undefined) {
                        // First time we iterate!  So start at the beginning (lower/upper)
                        // of our allowed range.
                        indexPos = forward ? range.lower : range.upper;
                    }
                    primaryPos = req.lastObjectStorePosition;
                    // We might have to advance the index key further!
                    if (req.advanceIndexKey !== undefined) {
                        compareResult = cmp.default(req.advanceIndexKey, indexPos);
                        if ((forward && compareResult > 0) || (!forward && compareResult > 0)) {
                            indexPos = req.advanceIndexKey;
                        }
                        else if (compareResult == 0 && req.advancePrimaryKey !== undefined) {
                            // index keys are the same, so advance the primary key
                            if (primaryPos === undefined) {
                                primaryPos = req.advancePrimaryKey;
                            }
                            else {
                                primCompareResult = cmp.default(req.advancePrimaryKey, primaryPos);
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
                    indexEntry = void 0;
                    indexEntry = indexData.get(indexPos);
                    if (!indexEntry) {
                        res = indexData.nextHigherPair(indexPos);
                        if (res) {
                            indexEntry = res[1];
                            indexPos = indexEntry.indexKey;
                        }
                    }
                    primkeySubPos = 0;
                    // Sort out the case where the index key is the same, so we have
                    // to get the prev/next primary key
                    if (indexEntry !== undefined &&
                        req.lastIndexPosition !== undefined &&
                        cmp.default(indexEntry.indexKey, req.lastIndexPosition) === 0) {
                        pos = forward ? 0 : indexEntry.primaryKeys.length - 1;
                        this.enableTracing &&
                            console.log("number of primary keys", indexEntry.primaryKeys.length);
                        this.enableTracing && console.log("start pos is", pos);
                        // Advance past the lastObjectStorePosition
                        do {
                            cmpResult = cmp.default(req.lastObjectStorePosition, indexEntry.primaryKeys[pos]);
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
                            cmpResult = cmp.default(primaryPos, indexEntry.primaryKeys[pos]);
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
                            res = forward
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
                        skip = false;
                        if (unique) {
                            if (indexKeys.length > 0 &&
                                cmp.default(indexEntry.indexKey, indexKeys[indexKeys.length - 1]) === 0) {
                                skip = true;
                            }
                            if (req.lastIndexPosition !== undefined &&
                                cmp.default(indexPos, req.lastIndexPosition) === 0) {
                                skip = true;
                            }
                        }
                        if (!skip) {
                            if (this.enableTracing) {
                                console.log("not skipping!, subPos=" + primkeySubPos);
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
                    if (req.resultLevel === backendInterface.ResultLevel.Full) {
                        for (i = 0; i < numResults; i++) {
                            result = storeData.get(primaryKeys[i]);
                            if (!result) {
                                console.error("invariant violated during read");
                                console.error("request was", req);
                                throw Error("invariant violated during read");
                            }
                            values.push(structuredClone_1.default(result.value));
                        }
                    }
                }
                else {
                    storePos = req.lastObjectStorePosition;
                    if (storePos === undefined) {
                        storePos = forward ? range.lower : range.upper;
                    }
                    if (req.advanceIndexKey !== undefined) {
                        throw Error("unsupported request");
                    }
                    storePos = furthestKey(forward, req.advancePrimaryKey, storePos);
                    if (storePos !== null && storePos !== undefined) {
                        storeEntry = storeData.get(storePos);
                        if (this.enableTracing) {
                            console.log("store entry:", storeEntry);
                        }
                        if (!storeEntry ||
                            (req.lastObjectStorePosition !== undefined &&
                                cmp.default(req.lastObjectStorePosition, storePos) === 0)) {
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
                        res = storeData.get(storePos);
                        if (res === undefined) {
                            break;
                        }
                        if (req.resultLevel >= backendInterface.ResultLevel.OnlyKeys) {
                            primaryKeys.push(structuredClone_1.default(storePos));
                        }
                        if (req.resultLevel >= backendInterface.ResultLevel.Full) {
                            values.push(structuredClone_1.default(res.value));
                        }
                        numResults++;
                        storePos = nextStoreKey(forward, storeData, storePos);
                    }
                }
                if (this.enableTracing) {
                    console.log("TRACING: getRecords got " + numResults + " results");
                }
                return [2 /*return*/, {
                        count: numResults,
                        indexKeys: req.resultLevel >= backendInterface.ResultLevel.OnlyKeys && haveIndex
                            ? indexKeys
                            : undefined,
                        primaryKeys: req.resultLevel >= backendInterface.ResultLevel.OnlyKeys ? primaryKeys : undefined,
                        values: req.resultLevel >= backendInterface.ResultLevel.Full ? values : undefined,
                    }];
            });
        });
    };
    MemoryBackend.prototype.storeRecord = function (btx, storeReq) {
        return __awaiter(this, void 0, void 0, function () {
            var myConn, db, schema, objectStoreMapEntry, modifiedData, key, value, keygen, autoIncrement, keyPath, storeKeyResult, kp, n, m, hasKey, objectStoreRecord, _i, _a, indexName, index, indexProperties;
            return __generator(this, function (_b) {
                if (this.enableTracing) {
                    console.log("TRACING: storeRecord");
                }
                myConn = this.connectionsByTransaction[btx.transactionCookie];
                if (!myConn) {
                    throw Error("unknown connection");
                }
                db = this.databases[myConn.dbName];
                if (!db) {
                    throw Error("db not found");
                }
                if (db.txLevel < TransactionLevel.Write) {
                    throw Error("only allowed while running a transaction");
                }
                if (db.txRestrictObjectStores &&
                    !db.txRestrictObjectStores.includes(storeReq.objectStoreName)) {
                    throw Error("Not allowed to access store '" + storeReq.objectStoreName + "', transaction is over " + JSON.stringify(db.txRestrictObjectStores));
                }
                schema = myConn.modifiedSchema;
                objectStoreMapEntry = myConn.objectStoreMap[storeReq.objectStoreName];
                if (!objectStoreMapEntry.store.modifiedData) {
                    objectStoreMapEntry.store.modifiedData =
                        objectStoreMapEntry.store.originalData;
                }
                modifiedData = objectStoreMapEntry.store.modifiedData;
                if (storeReq.storeLevel === backendInterface.StoreLevel.UpdateExisting) {
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
                    keygen = objectStoreMapEntry.store.modifiedKeyGenerator ||
                        objectStoreMapEntry.store.originalKeyGenerator;
                    autoIncrement = schema.objectStores[storeReq.objectStoreName].autoIncrement;
                    keyPath = schema.objectStores[storeReq.objectStoreName].keyPath;
                    storeKeyResult = void 0;
                    try {
                        storeKeyResult = makeStoreKeyValue_1.makeStoreKeyValue(storeReq.value, storeReq.key, keygen, autoIncrement, keyPath);
                    }
                    catch (e) {
                        if (e instanceof errors$1.DataError) {
                            kp = JSON.stringify(keyPath);
                            n = storeReq.objectStoreName;
                            m = "Could not extract key from value, objectStore=" + n + ", keyPath=" + kp;
                            if (this.enableTracing) {
                                console.error(e);
                                console.error("value was:", storeReq.value);
                                console.error("key was:", storeReq.key);
                            }
                            throw new errors$1.DataError(m);
                        }
                        else {
                            throw e;
                        }
                    }
                    key = storeKeyResult.key;
                    value = storeKeyResult.value;
                    objectStoreMapEntry.store.modifiedKeyGenerator =
                        storeKeyResult.updatedKeyGenerator;
                    hasKey = modifiedData.has(key);
                    if (hasKey && storeReq.storeLevel !== backendInterface.StoreLevel.AllowOverwrite) {
                        throw Error("refusing to overwrite");
                    }
                }
                objectStoreRecord = {
                    primaryKey: structuredClone_1.default(key),
                    value: structuredClone_1.default(value),
                };
                objectStoreMapEntry.store.modifiedData = modifiedData.with(key, objectStoreRecord, true);
                for (_i = 0, _a = Object.keys(schema.objectStores[storeReq.objectStoreName].indexes); _i < _a.length; _i++) {
                    indexName = _a[_i];
                    index = myConn.objectStoreMap[storeReq.objectStoreName].indexMap[indexName];
                    if (!index) {
                        throw Error("index referenced by object store does not exist");
                    }
                    indexProperties = schema.objectStores[storeReq.objectStoreName].indexes[indexName];
                    this.insertIntoIndex(index, key, value, indexProperties);
                }
                return [2 /*return*/, { key: key }];
            });
        });
    };
    MemoryBackend.prototype.insertIntoIndex = function (index, primaryKey, value, indexProperties) {
        if (this.enableTracing) {
            console.log("insertIntoIndex(" + (index.modifiedName || index.originalName) + ")");
        }
        var indexData = index.modifiedData || index.originalData;
        var indexKeys;
        try {
            indexKeys = getIndexKeys_1.default(value, indexProperties.keyPath, indexProperties.multiEntry);
        }
        catch (e) {
            if (e instanceof errors$1.DataError) {
                var n = index.modifiedName || index.originalName;
                var p = JSON.stringify(indexProperties.keyPath);
                var m = "Failed to extract index keys from index " + n + " for keyPath " + p + ".";
                if (this.enableTracing) {
                    console.error(m);
                    console.error("value was", value);
                }
                throw new errors$1.DataError(m);
            }
            else {
                throw e;
            }
        }
        for (var _i = 0, indexKeys_2 = indexKeys; _i < indexKeys_2.length; _i++) {
            var indexKey = indexKeys_2[_i];
            var existingRecord = indexData.get(indexKey);
            if (existingRecord) {
                if (indexProperties.unique) {
                    throw new errors$1.ConstraintError();
                }
                else {
                    var pred = function (x) { return cmp.default(x, primaryKey) === 0; };
                    if (existingRecord.primaryKeys.findIndex(pred) === -1) {
                        var newIndexRecord = {
                            indexKey: indexKey,
                            primaryKeys: __spreadArrays(existingRecord.primaryKeys, [primaryKey]).sort(cmp.default),
                        };
                        index.modifiedData = indexData.with(indexKey, newIndexRecord, true);
                    }
                }
            }
            else {
                var newIndexRecord = {
                    indexKey: indexKey,
                    primaryKeys: [primaryKey],
                };
                index.modifiedData = indexData.with(indexKey, newIndexRecord, true);
            }
        }
    };
    MemoryBackend.prototype.rollback = function (btx) {
        return __awaiter(this, void 0, void 0, function () {
            var myConn, db, objectStoreName, objectStore, _i, _a, indexName, index;
            return __generator(this, function (_b) {
                if (this.enableTracing) {
                    console.log("TRACING: rollback");
                }
                myConn = this.connectionsByTransaction[btx.transactionCookie];
                if (!myConn) {
                    throw Error("unknown connection");
                }
                db = this.databases[myConn.dbName];
                if (!db) {
                    throw Error("db not found");
                }
                if (db.txLevel < TransactionLevel.Read) {
                    throw Error("only allowed while running a transaction");
                }
                db.modifiedObjectStores = {};
                db.txLevel = TransactionLevel.Connected;
                db.txRestrictObjectStores = undefined;
                myConn.modifiedSchema = structuredClone_1.default(db.committedSchema);
                myConn.objectStoreMap = this.makeObjectStoreMap(db);
                for (objectStoreName in db.committedObjectStores) {
                    objectStore = db.committedObjectStores[objectStoreName];
                    objectStore.deleted = false;
                    objectStore.modifiedData = undefined;
                    objectStore.modifiedName = undefined;
                    objectStore.modifiedKeyGenerator = undefined;
                    objectStore.modifiedIndexes = {};
                    for (_i = 0, _a = Object.keys(db.committedSchema.objectStores[objectStoreName].indexes); _i < _a.length; _i++) {
                        indexName = _a[_i];
                        index = objectStore.committedIndexes[indexName];
                        index.deleted = false;
                        index.modifiedData = undefined;
                        index.modifiedName = undefined;
                    }
                }
                delete this.connectionsByTransaction[btx.transactionCookie];
                this.transactionDoneCond.trigger();
                return [2 /*return*/];
            });
        });
    };
    MemoryBackend.prototype.commit = function (btx) {
        return __awaiter(this, void 0, void 0, function () {
            var myConn, db, txLevel, objectStoreName, objectStoreMapEntry, store, indexName, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.enableTracing) {
                            console.log("TRACING: commit");
                        }
                        myConn = this.connectionsByTransaction[btx.transactionCookie];
                        if (!myConn) {
                            throw Error("unknown connection");
                        }
                        db = this.databases[myConn.dbName];
                        if (!db) {
                            throw Error("db not found");
                        }
                        txLevel = db.txLevel;
                        if (txLevel < TransactionLevel.Read) {
                            throw Error("only allowed while running a transaction");
                        }
                        db.committedSchema = structuredClone_1.default(myConn.modifiedSchema);
                        db.txLevel = TransactionLevel.Connected;
                        db.txRestrictObjectStores = undefined;
                        db.committedObjectStores = {};
                        db.committedObjectStores = {};
                        for (objectStoreName in myConn.objectStoreMap) {
                            objectStoreMapEntry = myConn.objectStoreMap[objectStoreName];
                            store = objectStoreMapEntry.store;
                            store.deleted = false;
                            store.originalData = store.modifiedData || store.originalData;
                            store.originalName = store.modifiedName || store.originalName;
                            store.modifiedIndexes = {};
                            if (store.modifiedKeyGenerator !== undefined) {
                                store.originalKeyGenerator = store.modifiedKeyGenerator;
                            }
                            db.committedObjectStores[objectStoreName] = store;
                            for (indexName in objectStoreMapEntry.indexMap) {
                                index = objectStoreMapEntry.indexMap[indexName];
                                index.deleted = false;
                                index.originalData = index.modifiedData || index.originalData;
                                index.originalName = index.modifiedName || index.originalName;
                                store.committedIndexes[indexName] = index;
                            }
                        }
                        myConn.objectStoreMap = this.makeObjectStoreMap(db);
                        delete this.connectionsByTransaction[btx.transactionCookie];
                        this.transactionDoneCond.trigger();
                        if (!(this.afterCommitCallback && txLevel >= TransactionLevel.Write)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.afterCommitCallback()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return MemoryBackend;
}());
exports.MemoryBackend = MemoryBackend;
exports.default = MemoryBackend;

});

unwrapExports(MemoryBackend_1);
var MemoryBackend_2 = MemoryBackend_1.MemoryBackend;

var build = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

exports.BridgeIDBFactory = BridgeIDBFactory_1.BridgeIDBFactory;

exports.BridgeIDBCursor = BridgeIDBCursor_1.BridgeIDBCursor;









exports.MemoryBackend = MemoryBackend_1.MemoryBackend;
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
 */
function shimIndexedDB(factory) {
    // @ts-ignore: shimming
    globalThis.indexedDB = factory;
    // @ts-ignore: shimming
    globalThis.IDBCursor = BridgeIDBCursor_1.BridgeIDBCursor;
    // @ts-ignore: shimming
    globalThis.IDBKeyRange = BridgeIDBKeyRange_1.default;
    // @ts-ignore: shimming
    globalThis.IDBDatabase = BridgeIDBDatabase_1.default;
    // @ts-ignore: shimming
    globalThis.IDBFactory = BridgeIDBFactory_1.BridgeIDBFactory;
    // @ts-ignore: shimming
    globalThis.IDBIndex = BridgeIDBIndex_1.BridgeIDBIndex;
    // @ts-ignore: shimming
    globalThis.IDBKeyRange = BridgeIDBKeyRange_1.default;
    // @ts-ignore: shimming
    globalThis.IDBObjectStore = BridgeIDBObjectStore_1.default;
    // @ts-ignore: shimming
    globalThis.IDBOpenDBRequest = BridgeIDBOpenDBRequest_1.default;
    // @ts-ignore: shimming
    globalThis.IDBRequest = BridgeIDBRequest_1.default;
    // @ts-ignore: shimming
    globalThis.IDBTransaction = BridgeIDBTransaction_1.default;
    // @ts-ignore: shimming
    globalThis.IDBVersionChangeEvent = BridgeIDBVersionChangeEvent_1.default;
}
exports.shimIndexedDB = shimIndexedDB;

});

unwrapExports(build);
var build_1 = build.BridgeIDBFactory;
var build_2 = build.BridgeIDBCursor;
var build_3 = build.MemoryBackend;
var build_4 = build.shimIndexedDB;

var db = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


/**
 * Name of the Taler database.  The name includes the
 * major version of the DB schema.  The version should be incremented
 * with each major change.  When incrementing the major version,
 * the wallet should import data from the previous version.
 */
const TALER_DB_NAME = "taler-walletdb-v3";
/**
 * Current database minor version, should be incremented
 * each time we do minor schema changes on the database.
 * A change is considered minor when fields are added in a
 * backwards-compatible way or object stores and indices
 * are added.
 */
exports.WALLET_DB_VERSION = 1;
/**
 * Return a promise that resolves
 * to the taler wallet db.
 */
function openTalerDatabase(idbFactory, onVersionChange) {
    const onUpgradeNeeded = (db, oldVersion, newVersion) => {
        switch (oldVersion) {
            case 0: // DB does not exist yet
                for (const n in dbTypes.Stores) {
                    if (dbTypes.Stores[n] instanceof query.Store) {
                        const si = dbTypes.Stores[n];
                        const s = db.createObjectStore(si.name, si.storeParams);
                        for (const indexName in si) {
                            if (si[indexName] instanceof query.Index) {
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
    return query.openDatabase(idbFactory, TALER_DB_NAME, exports.WALLET_DB_VERSION, onVersionChange, onUpgradeNeeded);
}
exports.openTalerDatabase = openTalerDatabase;
function deleteTalerDatabase(idbFactory) {
    query.Database.deleteDatabase(idbFactory, TALER_DB_NAME);
}
exports.deleteTalerDatabase = deleteTalerDatabase;

});

unwrapExports(db);
var db_1 = db.WALLET_DB_VERSION;
var db_2 = db.openTalerDatabase;
var db_3 = db.deleteTalerDatabase;

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
    return parse(val);
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

function parse(str) {
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
var debug_1 = debug.coerce;
var debug_2 = debug.disable;
var debug_3 = debug.enable;
var debug_4 = debug.enabled;
var debug_5 = debug.humanize;
var debug_6 = debug.instances;
var debug_7 = debug.names;
var debug_8 = debug.skips;
var debug_9 = debug.formatters;

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
var browser_1 = browser.log;
var browser_2 = browser.formatArgs;
var browser_3 = browser.save;
var browser_4 = browser.load;
var browser_5 = browser.useColors;
var browser_6 = browser.storage;
var browser_7 = browser.colors;

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
var node_1 = node.init;
var node_2 = node.log;
var node_3 = node.formatArgs;
var node_4 = node.save;
var node_5 = node.load;
var node_6 = node.useColors;
var node_7 = node.colors;
var node_8 = node.inspectOpts;

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
var followRedirects = wrap({ http: http$1, https: https });
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
      transport = isHttpsProxy ? https : http$1;
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
var default_1 = axios;
axios_1.default = default_1;

var axios$1 = axios_1;

var bank = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Helper functions to deal with the GNU Taler demo bank.
 *
 * Mostly useful for automated tests.
 */
/**
 * Imports.
 */
const axios_1 = tslib_1.__importDefault(axios$1);
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
/**
 * Client for the Taler bank access API.
 */
class Bank {
    constructor(bankBaseUrl) {
        this.bankBaseUrl = bankBaseUrl;
    }
    generateWithdrawUri(bankUser, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const body = {
                amount,
            };
            const reqUrl = new URL("api/withdraw-headless-uri", this.bankBaseUrl).href;
            const resp = yield axios_1.default({
                method: "post",
                url: reqUrl,
                data: body,
                responseType: "json",
                headers: {
                    Authorization: makeAuth(bankUser.username, bankUser.password),
                },
            });
            if (resp.status != 200) {
                throw Error("failed to create bank reserve");
            }
            const withdrawUri = resp.data["taler_withdraw_uri"];
            if (!withdrawUri) {
                throw Error("Bank's response did not include withdraw URI");
            }
            return withdrawUri;
        });
    }
    createReserve(bankUser, amount, reservePub, exchangePaytoUri) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const reqUrl = new URL("testing/withdraw", this.bankBaseUrl).href;
            const body = {
                username: bankUser,
                amount,
                reserve_pub: reservePub,
                exchange_payto_uri: exchangePaytoUri,
            };
            const resp = yield axios_1.default({
                method: "post",
                url: reqUrl,
                data: body,
                responseType: "json",
                headers: {
                    Authorization: makeAuth(bankUser.username, bankUser.password),
                },
            });
            if (resp.status != 200) {
                throw Error("failed to create bank reserve");
            }
        });
    }
    registerRandomUser() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const reqUrl = new URL("testing/register", this.bankBaseUrl).href;
            const randId = makeId(8);
            const bankUser = {
                username: `testuser-${randId}`,
                password: `testpw-${randId}`,
            };
            const resp = yield axios_1.default({
                method: "post",
                url: reqUrl,
                data: bankUser,
                responseType: "json",
            });
            if (resp.status != 200) {
                throw Error("could not register bank user");
            }
            return bankUser;
        });
    }
}
exports.Bank = Bank;

});

unwrapExports(bank);
var bank_1 = bank.Bank;

var cryptoImplementation = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });


const timer$1 = tslib_1.__importStar(timer);




var SignaturePurpose;
(function (SignaturePurpose) {
    SignaturePurpose[SignaturePurpose["RESERVE_WITHDRAW"] = 1200] = "RESERVE_WITHDRAW";
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
    const te = new TextEncoder();
    const curr = te.encode(amount.currency);
    dvbuf.setBigUint64(0, BigInt(amount.value));
    dvbuf.setUint32(8, amount.fraction);
    u8buf.set(curr, 8 + 4);
    return u8buf;
}
function timestampRoundedToBuffer(ts) {
    const b = new ArrayBuffer(8);
    const v = new DataView(b);
    const tsRounded = time.timestampTruncateToSecond(ts);
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
        const reservePub = talerCrypto.decodeCrock(req.reservePub);
        const reservePriv = talerCrypto.decodeCrock(req.reservePriv);
        const denomPub = talerCrypto.decodeCrock(req.denomPub);
        const coinKeyPair = talerCrypto.createEddsaKeyPair();
        const blindingFactor = talerCrypto.createBlindingKeySecret();
        const coinPubHash = talerCrypto.hash(coinKeyPair.eddsaPub);
        const ev = talerCrypto.rsaBlind(coinPubHash, blindingFactor, denomPub);
        const amountWithFee = amounts.Amounts.add(req.value, req.feeWithdraw).amount;
        const denomPubHash = talerCrypto.hash(denomPub);
        const evHash = talerCrypto.hash(ev);
        const withdrawRequest = buildSigPS(SignaturePurpose.RESERVE_WITHDRAW)
            .put(reservePub)
            .put(amountToBuffer(amountWithFee))
            .put(amountToBuffer(req.feeWithdraw))
            .put(denomPubHash)
            .put(evHash)
            .build();
        const sig = talerCrypto.eddsaSign(withdrawRequest, reservePriv);
        const planchet = {
            blindingKey: talerCrypto.encodeCrock(blindingFactor),
            coinEv: talerCrypto.encodeCrock(ev),
            coinPriv: talerCrypto.encodeCrock(coinKeyPair.eddsaPriv),
            coinPub: talerCrypto.encodeCrock(coinKeyPair.eddsaPub),
            coinValue: req.value,
            denomPub: talerCrypto.encodeCrock(denomPub),
            denomPubHash: talerCrypto.encodeCrock(denomPubHash),
            reservePub: talerCrypto.encodeCrock(reservePub),
            withdrawSig: talerCrypto.encodeCrock(sig),
            coinEvHash: talerCrypto.encodeCrock(evHash),
        };
        return planchet;
    }
    /**
     * Create a planchet used for tipping, including the private keys.
     */
    createTipPlanchet(denom) {
        const denomPub = talerCrypto.decodeCrock(denom.denomPub);
        const coinKeyPair = talerCrypto.createEddsaKeyPair();
        const blindingFactor = talerCrypto.createBlindingKeySecret();
        const coinPubHash = talerCrypto.hash(coinKeyPair.eddsaPub);
        const ev = talerCrypto.rsaBlind(coinPubHash, blindingFactor, denomPub);
        const tipPlanchet = {
            blindingKey: talerCrypto.encodeCrock(blindingFactor),
            coinEv: talerCrypto.encodeCrock(ev),
            coinPriv: talerCrypto.encodeCrock(coinKeyPair.eddsaPriv),
            coinPub: talerCrypto.encodeCrock(coinKeyPair.eddsaPub),
            coinValue: denom.value,
            denomPub: talerCrypto.encodeCrock(denomPub),
            denomPubHash: talerCrypto.encodeCrock(talerCrypto.hash(denomPub)),
        };
        return tipPlanchet;
    }
    /**
     * Create and sign a message to recoup a coin.
     */
    createRecoupRequest(coin) {
        const p = buildSigPS(SignaturePurpose.WALLET_COIN_RECOUP)
            .put(talerCrypto.decodeCrock(coin.coinPub))
            .put(talerCrypto.decodeCrock(coin.denomPubHash))
            .put(talerCrypto.decodeCrock(coin.blindingKey))
            .build();
        const coinPriv = talerCrypto.decodeCrock(coin.coinPriv);
        const coinSig = talerCrypto.eddsaSign(p, coinPriv);
        const paybackRequest = {
            coin_blind_key_secret: coin.blindingKey,
            coin_pub: coin.coinPub,
            coin_sig: talerCrypto.encodeCrock(coinSig),
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
            .put(talerCrypto.decodeCrock(contractHash))
            .build();
        const sigBytes = talerCrypto.decodeCrock(sig);
        const pubBytes = talerCrypto.decodeCrock(merchantPub);
        return talerCrypto.eddsaVerify(p, sigBytes, pubBytes);
    }
    /**
     * Check if a wire fee is correctly signed.
     */
    isValidWireFee(type, wf, masterPub) {
        const p = buildSigPS(SignaturePurpose.MASTER_WIRE_FEES)
            .put(talerCrypto.hash(talerCrypto.stringToBytes(type + "\0")))
            .put(timestampRoundedToBuffer(wf.startStamp))
            .put(timestampRoundedToBuffer(wf.endStamp))
            .put(amountToBuffer(wf.wireFee))
            .put(amountToBuffer(wf.closingFee))
            .build();
        const sig = talerCrypto.decodeCrock(wf.sig);
        const pub = talerCrypto.decodeCrock(masterPub);
        return talerCrypto.eddsaVerify(p, sig, pub);
    }
    /**
     * Check if the signature of a denomination is valid.
     */
    isValidDenom(denom, masterPub) {
        const p = buildSigPS(SignaturePurpose.MASTER_DENOMINATION_KEY_VALIDITY)
            .put(talerCrypto.decodeCrock(masterPub))
            .put(timestampRoundedToBuffer(denom.stampStart))
            .put(timestampRoundedToBuffer(denom.stampExpireWithdraw))
            .put(timestampRoundedToBuffer(denom.stampExpireDeposit))
            .put(timestampRoundedToBuffer(denom.stampExpireLegal))
            .put(amountToBuffer(denom.value))
            .put(amountToBuffer(denom.feeWithdraw))
            .put(amountToBuffer(denom.feeDeposit))
            .put(amountToBuffer(denom.feeRefresh))
            .put(amountToBuffer(denom.feeRefund))
            .put(talerCrypto.decodeCrock(denom.denomPubHash))
            .build();
        const sig = talerCrypto.decodeCrock(denom.masterSig);
        const pub = talerCrypto.decodeCrock(masterPub);
        return talerCrypto.eddsaVerify(p, sig, pub);
    }
    isValidWireAccount(paytoUri, sig, masterPub) {
        const h = kdf_1.kdf(64, talerCrypto.stringToBytes("exchange-wire-signature"), talerCrypto.stringToBytes(paytoUri + "\0"), new Uint8Array(0));
        const p = buildSigPS(SignaturePurpose.MASTER_WIRE_DETAILS).put(h).build();
        return talerCrypto.eddsaVerify(p, talerCrypto.decodeCrock(sig), talerCrypto.decodeCrock(masterPub));
    }
    /**
     * Create a new EdDSA key pair.
     */
    createEddsaKeypair() {
        const pair = talerCrypto.createEddsaKeyPair();
        return {
            priv: talerCrypto.encodeCrock(pair.eddsaPriv),
            pub: talerCrypto.encodeCrock(pair.eddsaPub),
        };
    }
    /**
     * Unblind a blindly signed value.
     */
    rsaUnblind(blindedSig, bk, pk) {
        const denomSig = talerCrypto.rsaUnblind(talerCrypto.decodeCrock(blindedSig), talerCrypto.decodeCrock(pk), talerCrypto.decodeCrock(bk));
        return talerCrypto.encodeCrock(denomSig);
    }
    /**
     * Unblind a blindly signed value.
     */
    rsaVerify(hm, sig, pk) {
        return talerCrypto.rsaVerify(talerCrypto.hash(talerCrypto.decodeCrock(hm)), talerCrypto.decodeCrock(sig), talerCrypto.decodeCrock(pk));
    }
    /**
     * Generate updated coins (to store in the database)
     * and deposit permissions for each given coin.
     */
    signDepositPermission(depositInfo) {
        const d = buildSigPS(SignaturePurpose.WALLET_COIN_DEPOSIT)
            .put(talerCrypto.decodeCrock(depositInfo.contractTermsHash))
            .put(talerCrypto.decodeCrock(depositInfo.wireInfoHash))
            .put(timestampRoundedToBuffer(depositInfo.timestamp))
            .put(timestampRoundedToBuffer(depositInfo.refundDeadline))
            .put(amountToBuffer(depositInfo.spendAmount))
            .put(amountToBuffer(depositInfo.feeDeposit))
            .put(talerCrypto.decodeCrock(depositInfo.merchantPub))
            .put(talerCrypto.decodeCrock(depositInfo.coinPub))
            .build();
        const coinSig = talerCrypto.eddsaSign(d, talerCrypto.decodeCrock(depositInfo.coinPriv));
        const s = {
            coin_pub: depositInfo.coinPub,
            coin_sig: talerCrypto.encodeCrock(coinSig),
            contribution: amounts.Amounts.stringify(depositInfo.spendAmount),
            denom_pub: depositInfo.denomPub,
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
        let valueWithFee = amounts.Amounts.getZero(currency);
        for (const ncd of newCoinDenoms.selectedDenoms) {
            const t = amounts.Amounts.add(ncd.denom.value, ncd.denom.feeWithdraw).amount;
            valueWithFee = amounts.Amounts.add(valueWithFee, amounts.Amounts.mult(t, ncd.count).amount).amount;
        }
        // melt fee
        valueWithFee = amounts.Amounts.add(valueWithFee, meltFee).amount;
        const sessionHc = talerCrypto.createHashContext();
        const transferPubs = [];
        const transferPrivs = [];
        const planchetsForGammas = [];
        for (let i = 0; i < kappa; i++) {
            const transferKeyPair = talerCrypto.createEcdheKeyPair();
            sessionHc.update(transferKeyPair.ecdhePub);
            transferPrivs.push(talerCrypto.encodeCrock(transferKeyPair.ecdhePriv));
            transferPubs.push(talerCrypto.encodeCrock(transferKeyPair.ecdhePub));
        }
        for (const denomSel of newCoinDenoms.selectedDenoms) {
            for (let i = 0; i < denomSel.count; i++) {
                const r = talerCrypto.decodeCrock(denomSel.denom.denomPub);
                sessionHc.update(r);
            }
        }
        sessionHc.update(talerCrypto.decodeCrock(meltCoin.coinPub));
        sessionHc.update(amountToBuffer(valueWithFee));
        for (let i = 0; i < kappa; i++) {
            const planchets = [];
            for (let j = 0; j < newCoinDenoms.selectedDenoms.length; j++) {
                const denomSel = newCoinDenoms.selectedDenoms[j];
                for (let k = 0; k < denomSel.count; k++) {
                    const coinNumber = planchets.length;
                    const transferPriv = talerCrypto.decodeCrock(transferPrivs[i]);
                    const oldCoinPub = talerCrypto.decodeCrock(meltCoin.coinPub);
                    const transferSecret = talerCrypto.keyExchangeEcdheEddsa(transferPriv, oldCoinPub);
                    const fresh = talerCrypto.setupRefreshPlanchet(transferSecret, coinNumber);
                    const coinPriv = fresh.coinPriv;
                    const coinPub = fresh.coinPub;
                    const blindingFactor = fresh.bks;
                    const pubHash = talerCrypto.hash(coinPub);
                    const denomPub = talerCrypto.decodeCrock(denomSel.denom.denomPub);
                    const ev = talerCrypto.rsaBlind(pubHash, blindingFactor, denomPub);
                    const planchet = {
                        blindingKey: talerCrypto.encodeCrock(blindingFactor),
                        coinEv: talerCrypto.encodeCrock(ev),
                        privateKey: talerCrypto.encodeCrock(coinPriv),
                        publicKey: talerCrypto.encodeCrock(coinPub),
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
            .put(amountToBuffer(valueWithFee))
            .put(amountToBuffer(meltFee))
            .put(talerCrypto.decodeCrock(meltCoin.coinPub))
            .build();
        const confirmSig = talerCrypto.eddsaSign(confirmData, talerCrypto.decodeCrock(meltCoin.coinPriv));
        let valueOutput = amounts.Amounts.getZero(currency);
        for (const denomSel of newCoinDenoms.selectedDenoms) {
            const denom = denomSel.denom;
            for (let i = 0; i < denomSel.count; i++) {
                valueOutput = amounts.Amounts.add(valueOutput, denom.value).amount;
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
            confirmSig: talerCrypto.encodeCrock(confirmSig),
            exchangeBaseUrl,
            hash: talerCrypto.encodeCrock(sessionHash),
            meltCoinPub: meltCoin.coinPub,
            newDenomHashes,
            newDenoms,
            norevealIndex: undefined,
            planchetsForGammas: planchetsForGammas,
            transferPrivs,
            transferPubs,
            amountRefreshOutput: valueOutput,
            amountRefreshInput: valueWithFee,
            timestampCreated: time.getTimestampNow(),
            finishedTimestamp: undefined,
            lastError: undefined,
        };
        return refreshSession;
    }
    /**
     * Hash a string including the zero terminator.
     */
    hashString(str) {
        const ts = new TextEncoder();
        const b = ts.encode(str + "\0");
        return talerCrypto.encodeCrock(talerCrypto.hash(b));
    }
    /**
     * Hash a crockford encoded value.
     */
    hashEncoded(encodedBytes) {
        return talerCrypto.encodeCrock(talerCrypto.hash(talerCrypto.decodeCrock(encodedBytes)));
    }
    signCoinLink(oldCoinPriv, newDenomHash, oldCoinPub, transferPub, coinEv) {
        const coinEvHash = talerCrypto.hash(talerCrypto.decodeCrock(coinEv));
        const coinLink = buildSigPS(SignaturePurpose.WALLET_COIN_LINK)
            .put(talerCrypto.decodeCrock(newDenomHash))
            .put(talerCrypto.decodeCrock(oldCoinPub))
            .put(talerCrypto.decodeCrock(transferPub))
            .put(coinEvHash)
            .build();
        const coinPriv = talerCrypto.decodeCrock(oldCoinPriv);
        const sig = talerCrypto.eddsaSign(coinLink, coinPriv);
        return talerCrypto.encodeCrock(sig);
    }
    benchmark(repetitions) {
        let time_hash = 0;
        for (let i = 0; i < repetitions; i++) {
            const start = timer$1.performanceNow();
            this.hashString("hello world");
            time_hash += timer$1.performanceNow() - start;
        }
        let time_hash_big = 0;
        for (let i = 0; i < repetitions; i++) {
            const ba = naclFast.randomBytes(4096);
            const start = timer$1.performanceNow();
            talerCrypto.hash(ba);
            time_hash_big += timer$1.performanceNow() - start;
        }
        let time_eddsa_create = 0;
        for (let i = 0; i < repetitions; i++) {
            const start = timer$1.performanceNow();
            talerCrypto.createEddsaKeyPair();
            time_eddsa_create += timer$1.performanceNow() - start;
        }
        let time_eddsa_sign = 0;
        const p = naclFast.randomBytes(4096);
        const pair = talerCrypto.createEddsaKeyPair();
        for (let i = 0; i < repetitions; i++) {
            const start = timer$1.performanceNow();
            talerCrypto.eddsaSign(p, pair.eddsaPriv);
            time_eddsa_sign += timer$1.performanceNow() - start;
        }
        const sig = talerCrypto.eddsaSign(p, pair.eddsaPriv);
        let time_eddsa_verify = 0;
        for (let i = 0; i < repetitions; i++) {
            const start = timer$1.performanceNow();
            talerCrypto.eddsaVerify(p, sig, pair.eddsaPub);
            time_eddsa_verify += timer$1.performanceNow() - start;
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
exports.CryptoImplementation = CryptoImplementation;
CryptoImplementation.enableTracing = false;

});

unwrapExports(cryptoImplementation);
var cryptoImplementation_1 = cryptoImplementation.CryptoImplementation;

var nodeThreadWorker = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

const os_1 = tslib_1.__importDefault(os);

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
    console.log("could not load from ${f}");
  }
  if (!tw) {
    try {
      tw = require("taler-wallet-android");
    } catch (e) {
      console.log("could not load taler-wallet-android either");
      throw e;
    }
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
    const handleRequest = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        const impl = new cryptoImplementation.CryptoImplementation();
        if (!(operation in impl)) {
            console.error(`crypto operation '${operation}' not found`);
            return;
        }
        try {
            const result = impl[operation](...args);
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const worker_threads$1 = worker_threads;
            const p = worker_threads$1.parentPort;
            (_a = worker_threads$1.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage;
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
exports.handleWorkerMessage = handleWorkerMessage;
function handleWorkerError(e) {
    console.log("got error from worker", e);
}
exports.handleWorkerError = handleWorkerError;
class NodeThreadCryptoWorkerFactory {
    startWorker() {
        if (typeof require === "undefined") {
            throw Error("cannot make worker, require(...) not defined");
        }
        return new NodeThreadCryptoWorker();
    }
    getConcurrency() {
        return Math.max(1, os_1.default.cpus().length - 1);
    }
}
exports.NodeThreadCryptoWorkerFactory = NodeThreadCryptoWorkerFactory;
/**
 * Worker implementation that uses node subprocesses.
 */
class NodeThreadCryptoWorker {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const worker_threads$1 = worker_threads;
        this.nodeWorker = new worker_threads$1.Worker(workerCode, { eval: true });
        this.nodeWorker.on("error", (err) => {
            console.error("error in node worker:", err);
            if (this.onerror) {
                this.onerror(err);
            }
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

});

unwrapExports(nodeThreadWorker);
var nodeThreadWorker_1 = nodeThreadWorker.handleWorkerMessage;
var nodeThreadWorker_2 = nodeThreadWorker.handleWorkerError;
var nodeThreadWorker_3 = nodeThreadWorker.NodeThreadCryptoWorkerFactory;

var http = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

var HttpResponseStatus;
(function (HttpResponseStatus) {
    HttpResponseStatus[HttpResponseStatus["Ok"] = 200] = "Ok";
    HttpResponseStatus[HttpResponseStatus["Gone"] = 210] = "Gone";
})(HttpResponseStatus = exports.HttpResponseStatus || (exports.HttpResponseStatus = {}));
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
exports.Headers = Headers;
/**
 * An implementation of the [[HttpRequestLibrary]] using the
 * browser's XMLHttpRequest.
 */
class BrowserHttpLib {
    req(method, url, requestBody, options) {
        return new Promise((resolve, reject) => {
            const myRequest = new XMLHttpRequest();
            myRequest.open(method, url);
            if (options === null || options === void 0 ? void 0 : options.headers) {
                for (const headerName in options.headers) {
                    myRequest.setRequestHeader(headerName, options.headers[headerName]);
                }
            }
            if (requestBody) {
                myRequest.send(requestBody);
            }
            else {
                myRequest.send();
            }
            myRequest.onerror = (e) => {
                console.error("http request error");
                reject(Error("could not make XMLHttpRequest"));
            };
            myRequest.addEventListener("readystatechange", (e) => {
                if (myRequest.readyState === XMLHttpRequest.DONE) {
                    if (myRequest.status === 0) {
                        reject(Error("HTTP Request failed (status code 0, maybe URI scheme is wrong?)"));
                        return;
                    }
                    const makeJson = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        let responseJson;
                        try {
                            responseJson = JSON.parse(myRequest.responseText);
                        }
                        catch (e) {
                            throw Error("Invalid JSON from HTTP response");
                        }
                        if (responseJson === null || typeof responseJson !== "object") {
                            throw Error("Invalid JSON from HTTP response");
                        }
                        return responseJson;
                    });
                    const headers = myRequest.getAllResponseHeaders();
                    const arr = headers.trim().split(/[\r\n]+/);
                    // Create a map of header names to values
                    const headerMap = new Headers();
                    arr.forEach(function (line) {
                        const parts = line.split(": ");
                        const headerName = parts.shift();
                        if (!headerName) {
                            console.error("invalid header");
                            return;
                        }
                        const value = parts.join(": ");
                        headerMap.set(headerName, value);
                    });
                    const resp = {
                        status: myRequest.status,
                        headers: headerMap,
                        json: makeJson,
                        text: () => tslib_1.__awaiter(this, void 0, void 0, function* () { return myRequest.responseText; }),
                    };
                    resolve(resp);
                }
            });
        });
    }
    get(url, opt) {
        return this.req("get", url, undefined, opt);
    }
    postJson(url, body, opt) {
        return this.req("post", url, JSON.stringify(body), opt);
    }
    stop() {
        // Nothing to do
    }
}
exports.BrowserHttpLib = BrowserHttpLib;

});

unwrapExports(http);
var http_1$1 = http.HttpResponseStatus;
var http_2 = http.Headers;
var http_3 = http.BrowserHttpLib;

var RequestThrottler_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Implementation of token bucket throttling.
 */
/**
 * Imports.
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
        this.lastUpdate = time.getTimestampNow();
    }
    refill() {
        const now = time.getTimestampNow();
        const d = time.timestampDifference(now, this.lastUpdate);
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
exports.RequestThrottler = RequestThrottler;

});

unwrapExports(RequestThrottler_1);
var RequestThrottler_2 = RequestThrottler_1.RequestThrottler;

var NodeHttpLib_1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Imports.
 */


const axios_1 = tslib_1.__importDefault(axios$1);
/**
 * Implementation of the HTTP request library interface for node.
 */
class NodeHttpLib {
    constructor() {
        this.throttle = new RequestThrottler_1.RequestThrottler();
        this.throttlingEnabled = true;
    }
    /**
     * Set whether requests should be throttled.
     */
    setThrottling(enabled) {
        this.throttlingEnabled = enabled;
    }
    req(method, url, body, opt) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.throttlingEnabled && this.throttle.applyThrottle(url)) {
                throw Error("request throttled");
            }
            const resp = yield axios_1.default({
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
                throw Error("unexpected response type");
            }
            const makeJson = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let responseJson;
                try {
                    responseJson = JSON.parse(respText);
                }
                catch (e) {
                    throw Error("Invalid JSON from HTTP response");
                }
                if (responseJson === null || typeof responseJson !== "object") {
                    throw Error("Invalid JSON from HTTP response");
                }
                return responseJson;
            });
            const headers = new http.Headers();
            for (const hn of Object.keys(resp.headers)) {
                headers.set(hn, resp.headers[hn]);
            }
            return {
                headers,
                status: resp.status,
                text: () => tslib_1.__awaiter(this, void 0, void 0, function* () { return resp.data; }),
                json: makeJson,
            };
        });
    }
    get(url, opt) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.req("get", url, undefined, opt);
        });
    }
    postJson(url, body, opt) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.req("post", url, body, opt);
        });
    }
}
exports.NodeHttpLib = NodeHttpLib;

});

unwrapExports(NodeHttpLib_1);
var NodeHttpLib_2 = NodeHttpLib_1.NodeHttpLib;

var synchronousWorker = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });


/**
 * The synchronous crypto worker produced by this factory doesn't run in the
 * background, but actually blocks the caller until the operation is done.
 */
class SynchronousCryptoWorkerFactory {
    startWorker() {
        if (typeof require === "undefined") {
            throw Error("cannot make worker, require(...) not defined");
        }
        const workerCtor = synchronousWorker.SynchronousCryptoWorker;
        return new workerCtor();
    }
    getConcurrency() {
        return 1;
    }
}
exports.SynchronousCryptoWorkerFactory = SynchronousCryptoWorkerFactory;
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const impl = new cryptoImplementation.CryptoImplementation();
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
exports.SynchronousCryptoWorker = SynchronousCryptoWorker;

});

unwrapExports(synchronousWorker);
var synchronousWorker_1 = synchronousWorker.SynchronousCryptoWorkerFactory;
var synchronousWorker_2 = synchronousWorker.SynchronousCryptoWorker;

var helpers$1 = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Helpers to create headless wallets.
 * @author Florian Dold <dold@taler.net>
 */
/**
 * Imports.
 */



const amounts$1 = tslib_1.__importStar(amounts);

const fs_1 = tslib_1.__importDefault(fs);





const logger = new logging.Logger("helpers.ts");
/**
 * Get a wallet instance with default settings for node.
 */
function getDefaultNodeWallet(args = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        build.BridgeIDBFactory.enableTracing = false;
        const myBackend = new build.MemoryBackend();
        myBackend.enableTracing = false;
        const storagePath = args.persistentStoragePath;
        if (storagePath) {
            try {
                const dbContentStr = fs_1.default.readFileSync(storagePath, {
                    encoding: "utf-8",
                });
                const dbContent = JSON.parse(dbContentStr);
                myBackend.importDump(dbContent);
            }
            catch (e) {
                console.error("could not read wallet file");
            }
            myBackend.afterCommitCallback = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                // Allow caller to stop persisting the wallet.
                if (args.persistentStoragePath === undefined) {
                    return;
                }
                const dbContent = myBackend.exportDump();
                fs_1.default.writeFileSync(storagePath, JSON.stringify(dbContent, undefined, 2), {
                    encoding: "utf-8",
                });
            });
        }
        build.BridgeIDBFactory.enableTracing = false;
        const myBridgeIdbFactory = new build.BridgeIDBFactory(myBackend);
        const myIdbFactory = myBridgeIdbFactory;
        let myHttpLib;
        if (args.httpLib) {
            myHttpLib = args.httpLib;
        }
        else {
            myHttpLib = new NodeHttpLib_1.NodeHttpLib();
        }
        const myVersionChange = () => {
            console.error("version change requested, should not happen");
            throw Error();
        };
        build.shimIndexedDB(myBridgeIdbFactory);
        const myDb = yield db.openTalerDatabase(myIdbFactory, myVersionChange);
        let workerFactory;
        try {
            // Try if we have worker threads available, fails in older node versions.
            
            workerFactory = new nodeThreadWorker.NodeThreadCryptoWorkerFactory();
        }
        catch (e) {
            console.log("worker threads not available, falling back to synchronous workers");
            workerFactory = new synchronousWorker.SynchronousCryptoWorkerFactory();
        }
        const dbWrap = new query.Database(myDb);
        const w = new wallet.Wallet(dbWrap, myHttpLib, workerFactory);
        if (args.notifyHandler) {
            w.addNotificationListener(args.notifyHandler);
        }
        return w;
    });
}
exports.getDefaultNodeWallet = getDefaultNodeWallet;
function withdrawTestBalance(myWallet, amount = "TESTKUDOS:10", bankBaseUrl = "https://bank.test.taler.net/", exchangeBaseUrl = "https://exchange.test.taler.net/") {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const reserveResponse = yield myWallet.createReserve({
            amount: amounts$1.parseOrThrow(amount),
            exchange: exchangeBaseUrl,
            exchangeWire: "payto://unknown",
        });
        const reservePub = reserveResponse.reservePub;
        const bank$1 = new bank.Bank(bankBaseUrl);
        const bankUser = yield bank$1.registerRandomUser();
        logger.trace(`Registered bank user ${JSON.stringify(bankUser)}`);
        const exchangePaytoUri = yield myWallet.getExchangePaytoUri(exchangeBaseUrl, [
            "x-taler-bank",
        ]);
        const donePromise = new Promise((resolve, reject) => {
            myWallet.runRetryLoop().catch((x) => {
                reject(x);
            });
            myWallet.addNotificationListener((n) => {
                if (n.type === "withdraw-group-finished" /* WithdrawGroupFinished */ &&
                    n.withdrawalSource.type === "reserve" /* Reserve */ &&
                    n.withdrawalSource.reservePub === reservePub) {
                    resolve();
                }
            });
        });
        yield bank$1.createReserve(bankUser, amount, reservePub, exchangePaytoUri);
        yield myWallet.confirmReserve({ reservePub: reserveResponse.reservePub });
        yield donePromise;
    });
}
exports.withdrawTestBalance = withdrawTestBalance;

});

unwrapExports(helpers$1);
var helpers_1$1 = helpers$1.getDefaultNodeWallet;
var helpers_2$1 = helpers$1.withdrawTestBalance;

var android = createCommonjsModule(function (module, exports) {
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
Object.defineProperty(exports, "__esModule", { value: true });



const fs_1 = tslib_1.__importDefault(fs);



// @ts-ignore: special built-in module
//import akono = require("akono");

exports.handleWorkerError = nodeThreadWorker.handleWorkerError;
exports.handleWorkerMessage = nodeThreadWorker.handleWorkerMessage;
class AndroidHttpLib {
    constructor(sendMessage) {
        this.sendMessage = sendMessage;
        this.useNfcTunnel = false;
        this.nodeHttpLib = new NodeHttpLib_1.NodeHttpLib();
        this.requestId = 1;
        this.requestMap = {};
    }
    get(url, opt) {
        if (this.useNfcTunnel) {
            const myId = this.requestId++;
            const p = promiseUtils.openPromise();
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
            const p = promiseUtils.openPromise();
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
        const headers = new http.Headers();
        if (msg.status != 0) {
            const resp = {
                headers,
                status: msg.status,
                json: () => tslib_1.__awaiter(this, void 0, void 0, function* () { return JSON.parse(msg.responseText); }),
                text: () => tslib_1.__awaiter(this, void 0, void 0, function* () { return msg.responseText; }),
            };
            p.resolve(resp);
        }
        else {
            p.reject(new Error(`unexpected HTTP status code ${msg.status}`));
        }
        delete this.requestMap[myId];
    }
}
exports.AndroidHttpLib = AndroidHttpLib;
function sendAkonoMessage(m) {
    // @ts-ignore
    globalThis.__akono_sendMessage(m);
}
class AndroidWalletMessageHandler {
    constructor() {
        this.wp = promiseUtils.openPromise();
        this.httpLib = new NodeHttpLib_1.NodeHttpLib();
    }
    /**
     * Handle a request from the Android wallet.
     */
    handleMessage(operation, id, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (operation) {
                case "init": {
                    this.walletArgs = {
                        notifyHandler: (notification) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            sendAkonoMessage(JSON.stringify({ type: "notification", payload: notification }));
                        }),
                        persistentStoragePath: args.persistentStoragePath,
                        httpLib: this.httpLib,
                    };
                    const w = yield helpers$1.getDefaultNodeWallet(this.walletArgs);
                    this.maybeWallet = w;
                    w.runRetryLoop().catch((e) => {
                        console.error("Error during wallet retry loop", e);
                    });
                    this.wp.resolve(w);
                    return {
                        supported_protocol_versions: {
                            exchange: versions.WALLET_EXCHANGE_PROTOCOL_VERSION,
                            merchant: versions.WALLET_MERCHANT_PROTOCOL_VERSION,
                        }
                    };
                }
                case "getTransactions": {
                    const wallet = yield this.wp.promise;
                    return yield wallet.getTransactions(args);
                }
                case "abortProposal": {
                    const wallet = yield this.wp.promise;
                    if (typeof args.proposalId !== "string") {
                        throw Error("propsalId must be a string");
                    }
                    return yield wallet.refuseProposal(args.proposalId);
                }
                case "getBalances": {
                    const wallet = yield this.wp.promise;
                    return yield wallet.getBalances();
                }
                case "getPendingOperations": {
                    const wallet = yield this.wp.promise;
                    return yield wallet.getPendingOperations();
                }
                case "withdrawTestkudos": {
                    const wallet = yield this.wp.promise;
                    try {
                        yield helpers$1.withdrawTestBalance(wallet);
                    }
                    catch (e) {
                        console.log("error during withdrawTestBalance", e);
                    }
                    return {};
                }
                case "getHistory": {
                    const wallet = yield this.wp.promise;
                    return yield wallet.getHistory();
                }
                case "retryPendingNow": {
                    const wallet = yield this.wp.promise;
                    yield wallet.runPending(true);
                    return {};
                }
                case "preparePay": {
                    const wallet = yield this.wp.promise;
                    return yield wallet.preparePayForUri(args.url);
                }
                case "confirmPay": {
                    const wallet = yield this.wp.promise;
                    return yield wallet.confirmPay(args.proposalId, args.sessionId);
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
                case "getWithdrawDetailsForUri": {
                    const wallet = yield this.wp.promise;
                    return yield wallet.getWithdrawDetailsForUri(args.talerWithdrawUri, args.selectedExchange);
                }
                case "applyRefund": {
                    const wallet = yield this.wp.promise;
                    return yield wallet.applyRefund(args.talerRefundUri);
                }
                case "acceptExchangeTermsOfService": {
                    const wallet = yield this.wp.promise;
                    return yield wallet.acceptExchangeTermsOfService(args.exchangeBaseUrl, args.etag);
                }
                case "acceptWithdrawal": {
                    const wallet = yield this.wp.promise;
                    return yield wallet.acceptWithdrawal(args.talerWithdrawUri, args.selectedExchange);
                }
                case "reset": {
                    const oldArgs = this.walletArgs;
                    this.walletArgs = Object.assign({}, oldArgs);
                    if (oldArgs && oldArgs.persistentStoragePath) {
                        try {
                            fs_1.default.unlinkSync(oldArgs.persistentStoragePath);
                        }
                        catch (e) {
                            console.error("Error while deleting the wallet db:", e);
                        }
                        // Prevent further storage!
                        this.walletArgs.persistentStoragePath = undefined;
                    }
                    const wallet = yield this.wp.promise;
                    wallet.stop();
                    this.wp = promiseUtils.openPromise();
                    this.maybeWallet = undefined;
                    const w = yield helpers$1.getDefaultNodeWallet(this.walletArgs);
                    this.maybeWallet = w;
                    w.runRetryLoop().catch((e) => {
                        console.error("Error during wallet retry loop", e);
                    });
                    this.wp.resolve(w);
                    return {};
                }
                default:
                    throw Error(`operation "${operation}" not understood`);
            }
        });
    }
}
function installAndroidWalletListener() {
    // @ts-ignore
    const sendMessage = globalThis.__akono_sendMessage;
    if (typeof sendMessage !== "function") {
        const errMsg = "FATAL: cannot install android wallet listener: akono functions missing";
        console.error(errMsg);
        throw new Error(errMsg);
    }
    const handler = new AndroidWalletMessageHandler();
    const onMessage = (msgStr) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            const result = yield handler.handleMessage(operation, id, msg.args);
            console.log(`android listener: sending success response for ${operation} (${id})`);
            const respMsg = {
                type: "response",
                id,
                operation,
                isError: false,
                result,
            };
            sendMessage(JSON.stringify(respMsg));
        }
        catch (e) {
            const respMsg = {
                type: "response",
                id,
                operation,
                isError: true,
                result: { message: e.toString() },
            };
            sendMessage(JSON.stringify(respMsg));
            return;
        }
    });
    // @ts-ignore
    globalThis.__akono_onMessage = onMessage;
    console.log("android wallet listener installed");
}
exports.installAndroidWalletListener = installAndroidWalletListener;

});

var index = unwrapExports(android);
var android_1 = android.handleWorkerError;
var android_2 = android.handleWorkerMessage;
var android_3 = android.AndroidHttpLib;
var android_4 = android.installAndroidWalletListener;

exports.AndroidHttpLib = android_3;
exports.default = index;
exports.handleWorkerError = android_1;
exports.handleWorkerMessage = android_2;
exports.installAndroidWalletListener = android_4;
