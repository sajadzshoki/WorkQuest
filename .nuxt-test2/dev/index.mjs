import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import * as node_os from 'node:os';
import { tmpdir } from 'node:os';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, createError, sendRedirect, proxyRequest, setResponseStatus, send, getRequestURL, getRequestHeader, getResponseHeader, getRequestHeaders, setResponseHeaders, setResponseHeader, getResponseStatus, readBody, getQuery as getQuery$1, getCookie, setCookie, deleteCookie, getRequestIP, getHeader, sanitizeStatusCode, removeResponseHeader, appendResponseHeader, getRouterParam, getRequestWebStream, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatusText } from 'file:///home/user/WorkQuest/node_modules/h3/dist/index.mjs';
import { Server } from 'node:http';
import * as node_path from 'node:path';
import { resolve, dirname, join } from 'node:path';
import * as node_crypto from 'node:crypto';
import node_crypto__default, { randomInt, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import viteNodeEntry_mjs from 'file:///home/user/WorkQuest/node_modules/@nuxt/vite-builder/dist/vite-node-entry.mjs';
import { viteNodeFetch } from 'file:///home/user/WorkQuest/node_modules/@nuxt/vite-builder/dist/vite-node.mjs';
import { z } from 'file:///home/user/WorkQuest/node_modules/zod/index.js';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, joinRelativeURL, withTrailingSlash, withoutTrailingSlash, parsePath, withLeadingSlash, decodePath, parseQuery, encodePath } from 'file:///home/user/WorkQuest/node_modules/ufo/dist/index.mjs';
import destr, { destr as destr$1 } from 'file:///home/user/WorkQuest/node_modules/destr/dist/index.mjs';
import { createHooks } from 'file:///home/user/WorkQuest/node_modules/nitropack/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file:///home/user/WorkQuest/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file:///home/user/WorkQuest/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file:///home/user/WorkQuest/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file:///home/user/WorkQuest/node_modules/unstorage/drivers/fs.mjs';
import { digest, hash as hash$1 } from 'file:///home/user/WorkQuest/node_modules/ohash/dist/index.mjs';
import { klona } from 'file:///home/user/WorkQuest/node_modules/klona/dist/index.mjs';
import defu, { defuFn, createDefu } from 'file:///home/user/WorkQuest/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file:///home/user/WorkQuest/node_modules/scule/dist/index.mjs';
import * as node_async_hooks from 'node:async_hooks';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file:///home/user/WorkQuest/node_modules/nitropack/node_modules/unctx/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file:///home/user/WorkQuest/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file:///home/user/WorkQuest/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file:///home/user/WorkQuest/node_modules/youch-core/build/index.js';
import { Youch } from 'file:///home/user/WorkQuest/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file:///home/user/WorkQuest/node_modules/nitropack/node_modules/source-map/source-map.js';
import { createRouterMatcher } from 'file:///home/user/WorkQuest/node_modules/vue-router/vue-router.node.mjs';
import { defineDiagnostics, createConsoleReporter } from 'file:///home/user/WorkQuest/node_modules/nostics/dist/index.mjs';
import { ansiFormatter } from 'file:///home/user/WorkQuest/node_modules/nostics/dist/formatters/ansi.mjs';
import { stringify, uneval } from 'file:///home/user/WorkQuest/node_modules/devalue/index.js';
import { getContext as getContext$1 } from 'file:///home/user/WorkQuest/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file:///home/user/WorkQuest/node_modules/errx/dist/index.mjs';
import { isVNode, isRef, toValue } from 'file:///home/user/WorkQuest/node_modules/vue/index.mjs';
import _wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw from 'file:///home/user/WorkQuest/node_modules/@nuxt/vite-builder/dist/fix-stacktrace.mjs';
import * as node_fs from 'node:fs';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file:///home/user/WorkQuest/node_modules/pathe/dist/index.mjs';
import { PrismaPg } from 'file:///home/user/WorkQuest/node_modules/@prisma/adapter-pg/dist/index.mjs';
import * as dist from 'file:///home/user/WorkQuest/node_modules/@prisma/client-runtime-utils/dist/index.mjs';
import * as node_events from 'node:events';
import { jwtVerify, SignJWT } from 'file:///home/user/WorkQuest/node_modules/jose/dist/webapi/index.js';
import { getIcons } from 'file:///home/user/WorkQuest/node_modules/@iconify/utils/lib/index.js';
import { collections } from 'file:///home/user/WorkQuest/.nuxt-test2/nuxt-icon-server-bundle.mjs';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file:///home/user/WorkQuest/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { renderToString } from 'file:///home/user/WorkQuest/node_modules/vue/server-renderer/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file:///home/user/WorkQuest/node_modules/unhead/dist/server.mjs';
import { walkResolver } from 'file:///home/user/WorkQuest/node_modules/unhead/dist/utils.mjs';
import { DeprecationsPlugin } from 'file:///home/user/WorkQuest/node_modules/unhead/dist/legacy.mjs';
import { PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file:///home/user/WorkQuest/node_modules/unhead/dist/plugins.mjs';

const serverAssets = [{"baseName":"server","dir":"/home/user/WorkQuest/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage$1 = createStorage({});

storage$1.mount('/assets', assets$1);

storage$1.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/home/user/WorkQuest","watchOptions":{"ignored":[null]}}));
storage$1.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/home/user/WorkQuest/server","watchOptions":{"ignored":[null]}}));
storage$1.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/home/user/WorkQuest/.nuxt-test2"}));
storage$1.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/home/user/WorkQuest/.nuxt-test2/cache"}));
storage$1.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"/home/user/WorkQuest/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage$1, base) : storage$1;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/": {
        "prerender": false
      },
      "/api/**": {
        "cors": false,
        "headers": {
          "cache-control": "no-store",
          "x-content-type-options": "nosniff"
        }
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "appName": "ورک‌کوئست",
    "appUrl": "http://localhost:3000",
    "appVersion": "0.1.0",
    "defaultLocale": "fa",
    "supportEmail": "support@workquest.local",
    "i18n": {
      "baseUrl": "",
      "defaultLocale": "fa",
      "rootRedirect": "",
      "redirectStatusCode": 302,
      "skipSettingLocaleOnNavigate": false,
      "locales": [
        {
          "code": "fa",
          "language": "fa-IR",
          "name": "فارسی",
          "dir": "rtl",
          "domains": [],
          "defaultForDomains": []
        },
        {
          "code": "en",
          "language": "en-US",
          "name": "English",
          "dir": "ltr",
          "domains": [],
          "defaultForDomains": []
        }
      ],
      "detectBrowserLanguage": {
        "alwaysRedirect": false,
        "cookieCrossOrigin": false,
        "cookieDomain": "",
        "cookieKey": "workquest_locale",
        "cookieSecure": false,
        "fallbackLocale": "fa",
        "redirectOn": "root",
        "useCookie": true
      },
      "experimental": {
        "localeDetector": "",
        "typedPages": true,
        "typedOptionsAndMessages": false,
        "alternateLinkCanonicalQueries": true,
        "devCache": false,
        "cacheLifetime": "",
        "stripMessagesPayload": false,
        "preload": false,
        "strictSeo": false,
        "nitroContextDetection": true,
        "httpCacheDuration": 10,
        "compactRoutes": false,
        "prerenderMessages": false,
        "optimizeMessageBundling": true
      },
      "domainLocales": {
        "fa": {
          "domain": ""
        },
        "en": {
          "domain": ""
        }
      }
    }
  },
  "databaseUrl": "",
  "sessionSecret": "",
  "sessionCookieName": "workquest_session",
  "sessionIssuer": "workquest",
  "sessionMaxAgeSeconds": 604800,
  "sessionRenewThresholdSeconds": 86400,
  "secureCookies": true,
  "otpProvider": "console",
  "otpCodeLength": 6,
  "otpTtlSeconds": 120,
  "otpMaxAttempts": 5,
  "otpResendCooldownSeconds": 90,
  "otpMaxRequestsPerIpPerHour": 30,
  "otpHttpUrl": "",
  "otpHttpApiKey": "",
  "otpHttpTemplate": "",
  "onboardingTicketTtlSeconds": 900,
  "bootstrapAdminPhone": "",
  "icon": {
    "serverKnownCssClasses": []
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const nitroAsyncContext = getContext("nitro-app", {
  asyncContext: true,
  AsyncLocalStorage: AsyncLocalStorage 
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config$1 = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config$1.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function errorHandler$2(error, event) {
  var _a, _b, _c, _d;
  const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
  const data = (_a = error.data) != null ? _a : {};
  const code = (_c = (_b = data.code) != null ? _b : error.statusMessage) != null ? _c : statusCode >= 500 ? "INTERNAL_ERROR" : "ERROR";
  const message = (_d = data.message) != null ? _d : statusCode >= 500 ? "\u062E\u0637\u0627\u06CC \u063A\u06CC\u0631\u0645\u0646\u062A\u0638\u0631\u0647 \u062F\u0631 \u0633\u0631\u0648\u0631 \u0631\u062E \u062F\u0627\u062F" : error.message || "\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F";
  if (statusCode >= 500) {
    console.error(`[workquest] ${event.method} ${event.path} failed`, error);
  }
  const body = {
    statusCode,
    code,
    message,
    ...data.issues ? { issues: data.issues } : {}
  };
  setResponseStatus(event, statusCode);
  return send(event, JSON.stringify(body), "application/json; charset=utf-8");
}

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json ?? !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$2, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script$1 = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _g38J_PZTdlVRc3hHqdKruKdHJca90h4oXiwheBlNWA = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script$1}<\/script>`);
  });
});

/*!
  * shared v11.4.10
  * (c) 2026 kazuya kawaguchi
  * Released under the MIT License.
  */
/**
 * Original Utilities
 * written by kazuya kawaguchi
 */
const _create = Object.create;
const create = (obj = null) => _create(obj);
/* eslint-enable */
/**
 * Useful Utilities By Evan you
 * Modified by kazuya kawaguchi
 * MIT License
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/index.ts
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/codeframe.ts
 */
const isArray = Array.isArray;
const isFunction = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObject = (val) => val !== null && typeof val === 'object';
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);

const isNotObjectOrIsArray = (val) => !isObject(val) || isArray(val);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepCopy(src, des) {
    // src and des should both be objects, and none of them can be a array
    if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
        throw new Error('Invalid value');
    }
    const stack = [{ src, des }];
    while (stack.length) {
        const { src, des } = stack.pop();
        // using `Object.keys` which skips prototype properties
        Object.keys(src).forEach(key => {
            if (key === '__proto__') {
                return;
            }
            const value = src[key];
            if (isArray(value)) {
                // replace arrays instead of merging them, without retaining source references
                const copied = [];
                copied.length = value.length;
                des[key] = copied;
                stack.push({ src: value, des: copied });
            }
            else if (isObject(value)) {
                if (!isObject(des[key]) || isArray(des[key])) {
                    des[key] = create();
                }
                stack.push({ src: value, des: des[key] });
            }
            else {
                des[key] = value;
            }
        });
    }
}

const __nuxtMock = { runWithContext: async (fn) => await fn() };
function cloneDeep(value) {
  if (value == null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(cloneDeep);
  }
  const out = create(null);
  for (const key of Object.keys(value)) {
    out[key] = cloneDeep(value[key]);
  }
  return out;
}
function hasMessageFunction(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (isFunction(value)) {
    return true;
  }
  if (value == null || typeof value !== "object") {
    return false;
  }
  if (seen.has(value)) {
    return false;
  }
  seen.add(value);
  return Object.values(value).some((x) => hasMessageFunction(x, seen));
}
function warnMissedMessageFunctions(locale, messages) {
  const undeliverable = [];
  if (undeliverable.includes(locale) || !hasMessageFunction(messages)) {
    return;
  }
  console.warn(
    `[nuxt-i18n] Messages for locale "${locale}" contain message functions the build did not detect - they are dropped when messages are delivered as JSON. Write message functions literally in a locale file to make them detectable.`
  );
}
const merger = createDefu((obj, key, value) => {
  if (key === "messages" || key === "datetimeFormats" || key === "numberFormats") {
    obj[key] ??= create(null);
    deepCopy(value, obj[key]);
    return true;
  }
});
async function loadVueI18nOptions(vueI18nConfigs) {
  const nuxtApp = __nuxtMock;
  let vueI18nOptions = { messages: create(null) };
  for (const configFile of vueI18nConfigs) {
    const resolver = await configFile().then((x) => isModule(x) ? x.default : x);
    const resolved = isFunction(resolver) ? await nuxtApp.runWithContext(() => resolver()) : resolver;
    vueI18nOptions = merger(create(null), resolved, vueI18nOptions);
  }
  vueI18nOptions.fallbackLocale ??= false;
  return vueI18nOptions;
}
const isModule = (val) => toTypeString(val) === "[object Module]";
async function getLocaleMessages(locale, loader) {
  const nuxtApp = __nuxtMock;
  try {
    const getter = await nuxtApp.runWithContext(loader.load).then((x) => isModule(x) ? x.default : x);
    return isFunction(getter) ? await nuxtApp.runWithContext(() => getter(locale)) : getter;
  } catch (e) {
    throw new Error(`Failed loading locale (${locale}): ` + e.message, { cause: e });
  }
}
async function getLocaleMessagesMerged(locale, loaders = []) {
  const nuxtApp = __nuxtMock;
  const messages = await Promise.all(
    loaders.map((loader) => nuxtApp.runWithContext(() => getLocaleMessages(locale, loader)))
  );
  const merged = {};
  for (const message of messages) {
    deepCopy(message, merged);
  }
  return merged;
}

const locale_fa_46json_899a022e = /* @__PURE__ */ JSON.parse("{\"app\":{\"name\":\"ورک‌کوئست\",\"shortName\":\"ورک‌کوئست\",\"tagline\":\"مدیریت عملکرد کارکنان، با چاشنی بازی\",\"description\":\"ورک‌کوئست کار روزمره تیم‌ها را به مسیری شفاف از تسک، بازخورد و پاداش تبدیل می‌کند.\"},\"common\":{\"loading\":\"در حال بارگذاری…\",\"save\":\"ذخیره\",\"saving\":\"در حال ذخیره…\",\"cancel\":\"انصراف\",\"delete\":\"حذف\",\"edit\":\"ویرایش\",\"search\":\"جست‌وجو\",\"searchPlaceholder\":\"جست‌وجو کنید…\",\"filter\":\"فیلتر\",\"back\":\"بازگشت\",\"next\":\"ادامه\",\"previous\":\"قبلی\",\"confirm\":\"تأیید\",\"close\":\"بستن\",\"retry\":\"تلاش دوباره\",\"optional\":\"اختیاری\",\"required\":\"الزامی\",\"all\":\"همه\",\"status\":\"وضعیت\",\"actions\":\"عملیات\",\"viewAll\":\"مشاهده همه\",\"comingSoon\":\"به‌زودی\",\"empty\":\"موردی وجود ندارد\",\"yes\":\"بله\",\"no\":\"خیر\",\"of\":\"از\",\"items\":\"مورد\",\"page\":\"صفحه\",\"language\":\"زبان\",\"theme\":\"پوسته\",\"light\":\"روشن\",\"dark\":\"تیره\",\"system\":\"خودکار\",\"today\":\"امروز\",\"yesterday\":\"دیروز\",\"days\":\"روز\",\"logout\":\"خروج از حساب\",\"copy\":\"کپی\",\"copied\":\"کپی شد\"},\"nav\":{\"dashboard\":\"داشبورد\",\"tasks\":\"تسک‌ها\",\"team\":\"تیم من\",\"leaderboard\":\"جدول امتیازها\",\"achievements\":\"دستاوردها\",\"rewards\":\"پاداش‌ها\",\"notifications\":\"اعلان‌ها\",\"settings\":\"تنظیمات\",\"main\":\"منوی اصلی\",\"account\":\"حساب کاربری\",\"collapse\":\"بستن منو\",\"expand\":\"باز کردن منو\",\"members\":\"کارکنان\",\"invitations\":\"دعوت‌نامه‌ها\"},\"auth\":{\"loginTitle\":\"ورود به ورک‌کوئست\",\"loginSubtitle\":\"شماره موبایل سازمانی خود را وارد کنید تا کد ورود برایتان ارسال شود.\",\"phoneLabel\":\"شماره موبایل\",\"phonePlaceholder\":\"۰۹۱۲ ۱۲۳ ۴۵۶۷\",\"sendCode\":\"ارسال کد ورود\",\"sending\":\"در حال ارسال…\",\"codeTitle\":\"کد ورود را وارد کنید\",\"codeSubtitle\":\"کد {length} رقمی ارسال‌شده به {phone} را وارد کنید.\",\"codeLabel\":\"کد ورود\",\"verifyCode\":\"ورود به حساب\",\"verifying\":\"در حال بررسی…\",\"resendCode\":\"ارسال دوباره کد\",\"resendIn\":\"ارسال دوباره تا {seconds} ثانیه دیگر\",\"changePhone\":\"تغییر شماره موبایل\",\"expiresIn\":\"اعتبار کد تا {seconds} ثانیه\",\"codeSent\":\"کد ورود ارسال شد\",\"welcomeBack\":\"خوش آمدید، {name}\",\"signedOut\":\"با موفقیت خارج شدید\",\"devHint\":\"در محیط توسعه، کد ورود در گزارش سرور چاپ می‌شود.\",\"errors\":{\"invalidPhone\":\"شماره موبایل معتبر نیست\",\"invalidCode\":\"کد وارد شده نادرست است\",\"expiredCode\":\"کد منقضی شده است؛ کد جدید درخواست دهید\",\"userNotFound\":\"حسابی با این شماره یافت نشد. با مدیر سازمان تماس بگیرید.\",\"rateLimited\":\"کمی بعد دوباره تلاش کنید\",\"generic\":\"ورود ناموفق بود\"},\"orDivider\":\"یا\",\"registerTitle\":\"سازمان شما هنوز عضو نیست؟\",\"registerSubtitle\":\"شرکت خود را ثبت کنید و تیمتان را به ورک‌کوئست بیاورید. شماره موبایل بالا برای ساخت حساب مدیر ارشد استفاده می‌شود.\",\"registerCompany\":\"ثبت شرکت جدید\",\"codeTitleRegister\":\"کد تأیید را وارد کنید\",\"codeSentDetail\":\"از طریق درگاه {provider} ارسال شد\",\"securityNote\":\"کد ورود هرگز به‌صورت متن ساده ذخیره نمی‌شود و تنها چند دقیقه اعتبار دارد.\",\"otpSecurityNote\":\"این کد یک‌بار مصرف است و پس از چند تلاش ناموفق باطل می‌شود.\"},\"onboarding\":{\"stepsLabel\":\"مراحل ثبت‌نام\",\"steps\":{\"verify\":\"تأیید موبایل\",\"profile\":\"پروفایل شما\",\"company\":\"شرکت شما\"},\"verifySuccess\":\"شماره موبایل تأیید شد\",\"verifySuccessDetail\":\"حالا حساب و شرکت خود را بسازید\",\"profileTitle\":\"خودتان را معرفی کنید\",\"profileSubtitle\":\"شماره {phone} تأیید شد. این اطلاعات در پروفایل شما به همکارانتان نمایش داده می‌شود.\",\"fullNameLabel\":\"نام و نام خانوادگی\",\"fullNamePlaceholder\":\"مثلاً ساینا رستمی\",\"fullNameHint\":\"حداقل ۳ حرف\",\"jobTitleLabel\":\"عنوان شغلی\",\"jobTitlePlaceholder\":\"مثلاً مدیرعامل\",\"companyTitle\":\"شرکت خود را بسازید\",\"companySubtitle\":\"این شرکت فضای کاری تیم شماست و تمام داده‌ها در آن جدا از سایر سازمان‌ها نگهداری می‌شود.\",\"companyNameLabel\":\"نام شرکت\",\"companyNamePlaceholder\":\"مثلاً نواندیشان پایا\",\"slugLabel\":\"آدرس شرکت\",\"slugHint\":\"فقط حروف کوچک انگلیسی، عدد و خط تیره\",\"slugTaken\":\"این آدرس گرفته شده است.\",\"slugUseSuggestion\":\"پیشنهاد ما: {slug}\",\"industryLabel\":\"حوزه فعالیت\",\"industryPlaceholder\":\"مثلاً فناوری اطلاعات\",\"timezoneLabel\":\"منطقه زمانی\",\"advanced\":\"تنظیمات پیشرفته\",\"logoUrlLabel\":\"آدرس لوگو\",\"continue\":\"ادامه\",\"back\":\"مرحله قبل\",\"createCompany\":\"ساخت شرکت و ورود\",\"creating\":\"در حال ساخت شرکت…\",\"creatingDetail\":\"فضای کاری شما در حال آماده‌سازی است؛ سطح‌بندی و امتیازهای اولیه ساخته می‌شوند.\",\"successTitle\":\"«{company}» ساخته شد\",\"ticketNotice\":\"این نشست ثبت‌نام تا {seconds} ثانیه دیگر معتبر است. اگر زمان تمام شد، دوباره کد ورود بگیرید.\",\"errors\":{\"fullName\":\"نام و نام خانوادگی را کامل وارد کنید\",\"companyName\":\"نام شرکت را وارد کنید\",\"generic\":\"ساخت شرکت ناموفق بود\"}},\"dashboard\":{\"greeting\":\"سلام {name}\",\"subtitle\":\"وضعیت امروز شما در یک نگاه\",\"yourProgress\":\"پیشرفت شما\",\"level\":\"سطح {level}\",\"xpToNext\":\"{current} از {needed} امتیاز تا سطح بعد\",\"weeklySummary\":\"خلاصه این هفته\",\"openTasks\":\"تسک‌های باز\",\"completedTasks\":\"تسک‌های انجام‌شده\",\"pendingReview\":\"در انتظار بازبینی\",\"overdue\":\"گذشته از سررسید\",\"myTasks\":\"تسک‌های من\",\"noOpenTasks\":\"تسک بازی ندارید. آفرین!\",\"topPerformers\":\"پیشروهای سازمان\",\"recentRecognition\":\"تقدیرهای اخیر\",\"noRecognition\":\"هنوز تقدیری دریافت نکرده‌اید\",\"activeChallenge\":\"چالش فعال\",\"challengeGoal\":\"هدف: {goal}\",\"endsIn\":\"تا پایان {days} روز\",\"myRank\":\"رتبه من\",\"rankValue\":\"{rank} از {total}\",\"todaysTasks\":\"تسک‌های امروز\",\"activeTasks\":\"تسک‌های فعال\",\"pendingSubmissions\":\"در انتظار بازبینی\",\"completedTasksTitle\":\"تسک‌های انجام‌شده\",\"upcomingDeadlines\":\"سررسیدهای پیش‌رو\",\"managerView\":\"نمای مدیریتی\",\"employeeView\":\"کارهای من\",\"pendingReviews\":\"بازبینی‌های در انتظار\",\"overdueTasks\":\"تسک‌های تأخیردار\",\"teamCompletion\":\"نرخ تکمیل تیم‌ها\",\"completionRate\":\"نرخ تکمیل\",\"noTasksToday\":\"برای امروز تسکی ندارید\",\"noPendingReviews\":\"بازبینی در انتظاری نیست\",\"noOverdue\":\"هیچ تسکی تأخیر ندارد\",\"noUpcoming\":\"سررسید نزدیکی ندارید\",\"noActiveTasks\":\"تسک فعالی ندارید\",\"noSubmissions\":\"تسکی در انتظار بازبینی ندارید\",\"noCompleted\":\"هنوز تسکی تأیید نشده است\",\"noTeams\":\"هنوز داده‌ای برای تیم‌ها نیست\",\"reviewNow\":\"بازبینی\",\"viewAll\":\"مشاهدهٔ همه\"},\"tasks\":{\"title\":\"تسک‌ها\",\"subtitle\":\"کارهای محول‌شده به شما و تیم‌تان\",\"scope\":{\"mine\":\"تسک‌های من\",\"team\":\"تیم من\",\"all\":\"همه تسک‌ها\"},\"assignee\":\"انجام‌دهنده\",\"team\":\"تیم\",\"dueDate\":\"سررسید\",\"dueIn\":\"{days} روز مانده\",\"dueToday\":\"سررسید امروز\",\"overdue\":\"{days} روز تأخیر\",\"noDueDate\":\"بدون سررسید\",\"rewards\":\"پاداش\",\"xp\":\"{value} امتیاز\",\"coins\":\"{value} سکه\",\"empty\":\"تسکی با این فیلترها پیدا نشد\",\"total\":\"{count} تسک\",\"dueTomorrow\":\"سررسید فردا\",\"progress\":\"پیشرفت\",\"progressValue\":\"{value}٪\",\"estimate\":\"برآورد زمان\",\"estimateHours\":\"{hours} ساعت\",\"revisionCount\":\"{count} بار بازگشت برای اصلاح\",\"comments\":\"یادداشت‌ها\",\"attachments\":\"پیوست‌ها\",\"history\":\"تاریخچه\",\"reviews\":\"بازبینی‌ها\",\"noComments\":\"هنوز یادداشتی ثبت نشده است\",\"noAttachments\":\"پیوستی وجود ندارد\",\"addComment\":\"ثبت یادداشت\",\"commentPlaceholder\":\"یادداشت خود را بنویسید…\",\"addAttachment\":\"افزودن پیوست\",\"fileName\":\"نام فایل\",\"fileUrl\":\"آدرس فایل\",\"create\":\"تسک جدید\",\"createTitle\":\"ساخت تسک جدید\",\"edit\":\"ویرایش تسک\",\"save\":\"ذخیره\",\"created\":\"تسک ساخته شد\",\"updated\":\"تسک به‌روزرسانی شد\",\"detailTitle\":\"جزئیات تسک\",\"backToList\":\"بازگشت به فهرست\",\"filters\":\"فیلترها\",\"search\":\"جست‌وجو در تسک‌ها\",\"sort\":\"ترتیب\",\"sortBy\":{\"dueDate\":\"سررسید\",\"priority\":\"اولویت\",\"createdAt\":\"جدیدترین\",\"status\":\"وضعیت\"},\"onlyOverdue\":\"فقط تأخیردار\",\"reward\":\"پاداش\",\"assignedBy\":\"محول‌شده توسط {name}\",\"unassigned\":\"بدون انجام‌دهنده\",\"actions\":{\"start\":\"شروع تسک\",\"submit\":\"ارسال برای بازبینی\",\"approve\":\"تأیید تسک\",\"request_revision\":\"درخواست اصلاح\",\"reopen\":\"بازگرداندن به صف\"},\"actionDone\":{\"start\":\"تسک شروع شد\",\"submit\":\"تسک برای بازبینی ارسال شد\",\"approve\":\"تسک تأیید شد\",\"request_revision\":\"درخواست اصلاح ثبت شد\",\"reopen\":\"تسک به صف بازگشت\"},\"review\":{\"title\":\"بازبینی تسک\",\"score\":\"امتیاز کیفیت\",\"feedback\":\"بازخورد\",\"feedbackPlaceholder\":\"توضیح دهید چه چیزی باید اصلاح شود…\",\"feedbackRequired\":\"برای درخواست اصلاح، توضیح بنویسید\",\"approveHint\":\"با تأیید، پاداش تسک به انجام‌دهنده پرداخت می‌شود\",\"selfReview\":\"نمی‌توانید تسک خودتان را بازبینی کنید\"},\"form\":{\"title\":\"عنوان\",\"titlePlaceholder\":\"مثلاً: بازطراحی صفحه ورود\",\"description\":\"شرح\",\"descriptionPlaceholder\":\"خروجی مورد انتظار و معیار پذیرش…\",\"assignee\":\"انجام‌دهنده\",\"selectAssignee\":\"یک نفر را انتخاب کنید\",\"team\":\"تیم\",\"selectTeam\":\"انتخاب تیم (اختیاری)\",\"priority\":\"اولویت\",\"dueDate\":\"سررسید\",\"estimatedHours\":\"برآورد زمان (ساعت)\",\"xpReward\":\"امتیاز تجربه\",\"coinReward\":\"سکه\",\"attachments\":\"پیوست‌ها (اختیاری)\",\"submit\":\"ساخت تسک\"},\"events\":{\"task.created\":\"تسک ساخته شد\",\"task.start\":\"تسک شروع شد\",\"task.submit\":\"برای بازبینی ارسال شد\",\"task.approve\":\"تأیید شد\",\"task.request_revision\":\"درخواست اصلاح شد\",\"task.reopen\":\"به صف بازگشت\",\"task.updated\":\"ویرایش شد\",\"task.reassigned\":\"انجام‌دهنده تغییر کرد\",\"task.attachment_added\":\"پیوست اضافه شد\"}},\"status\":{\"task\":{\"TODO\":\"در صف انجام\",\"IN_PROGRESS\":\"در حال انجام\",\"SUBMITTED\":\"ارسال‌شده\",\"NEEDS_REVISION\":\"نیازمند اصلاح\",\"APPROVED\":\"تأیید شده\"},\"redemption\":{\"REQUESTED\":\"درخواست شده\",\"APPROVED\":\"تأیید شده\",\"REJECTED\":\"رد شده\",\"FULFILLED\":\"تحویل شده\",\"CANCELLED\":\"لغو شده\"},\"user\":{\"ACTIVE\":\"فعال\",\"SUSPENDED\":\"معلق\",\"DEACTIVATED\":\"غیرفعال\",\"INVITED\":\"دعوت‌شده\"},\"invitation\":{\"PENDING\":\"در انتظار\",\"ACCEPTED\":\"پذیرفته‌شده\",\"REVOKED\":\"لغو شده\",\"EXPIRED\":\"منقضی شده\"}},\"priority\":{\"LOW\":\"کم\",\"MEDIUM\":\"متوسط\",\"HIGH\":\"زیاد\"},\"gamification\":{\"xp\":\"امتیاز تجربه\",\"coins\":\"سکه\",\"level\":\"سطح\",\"streak\":\"روزهای پیاپی\",\"currentStreak\":\"رکورد جاری\",\"longestStreak\":\"بیشترین رکورد\",\"rank\":\"رتبه\",\"achievement\":\"دستاوردها\",\"badge\":\"نشان‌ها\",\"unlocked\":\"کسب شده\",\"locked\":\"قفل\",\"unlockedOn\":\"کسب‌شده در {date}\",\"progress\":\"{current} از {total}\",\"noAchievements\":\"هنوز دستاوردی باز نشده است\"},\"team\":{\"title\":\"تیم من\",\"subtitle\":\"همکاران، مدیر مستقیم و وضعیت تیم‌ها\",\"members\":\"اعضا\",\"memberCount\":\"{count} عضو\",\"taskCount\":\"{count} تسک فعال\",\"lead\":\"سرپرست تیم\",\"manager\":\"مدیر مستقیم\",\"noTeams\":\"شما عضو هیچ تیمی نیستید\",\"noMembers\":\"عضوی ثبت نشده است\",\"create\":\"تیم جدید\",\"createTitle\":\"ساخت تیم\",\"createSubtitle\":\"پس از ساخت، می‌توانید سرپرست و اعضا را تعیین کنید.\",\"createSuccess\":\"تیم ساخته شد\",\"nameLabel\":\"نام تیم\",\"namePlaceholder\":\"مثلاً تیم محصول\",\"descriptionLabel\":\"توضیحات\",\"descriptionPlaceholder\":\"این تیم چه کاری انجام می‌دهد؟\",\"openTeam\":\"جزئیات تیم\",\"notFound\":\"این تیم پیدا نشد یا دسترسی مشاهده آن را ندارید\",\"aboutTitle\":\"درباره تیم\",\"noLead\":\"سرپرست تعیین نشده\",\"noManager\":\"بدون مدیر مستقیم\",\"createdAt\":\"تاریخ ساخت\",\"delete\":\"حذف تیم\",\"deleteConfirm\":\"تیم «{name}» حذف شود؟ اعضا در شرکت می‌مانند ولی عضویت تیمی آن‌ها حذف می‌شود.\",\"deleteSuccess\":\"تیم حذف شد\",\"editTitle\":\"ویرایش تیم\",\"editSuccess\":\"تغییرات تیم ذخیره شد\",\"addMember\":\"افزودن عضو\",\"addMemberTitle\":\"افزودن عضو به تیم\",\"addMemberSubtitle\":\"فقط کسانی که هنوز عضو تیمی نیستند در این فهرست هستند.\",\"addSuccess\":\"عضو به تیم اضافه شد\",\"removeMember\":\"حذف\",\"removeMemberConfirm\":\"«{name}» از این تیم حذف شود؟\",\"candidateLabel\":\"عضو\",\"noCandidates\":\"کسی برای افزودن نیست\",\"noCandidatesHint\":\"همه اعضای شرکت در تیم دیگری عضو هستند.\",\"errors\":{\"generic\":\"انجام این کار ناموفق بود\"},\"leadNeedsManager\":\"ابتدا نقش او را به «مدیر تیم» ارتقا دهید\"},\"leaderboard\":{\"title\":\"جدول امتیازها\",\"subtitle\":\"رقابت سالم میان همکاران\",\"range\":{\"week\":\"این هفته\",\"month\":\"این ماه\",\"all\":\"همه زمان‌ها\"},\"yourPosition\":\"جایگاه شما\",\"points\":\"امتیاز\",\"noData\":\"داده‌ای برای نمایش وجود ندارد\"},\"achievements\":{\"title\":\"دستاوردها و نشان‌ها\",\"subtitle\":\"مسیر رشد شما در ورک‌کوئست\",\"unlockedCount\":\"{count} دستاورد کسب شده\",\"badgeCount\":\"{count} نشان\",\"rewards\":\"پاداش دستاورد\"},\"rewards\":{\"title\":\"فروشگاه پاداش\",\"subtitle\":\"سکه‌هایتان را خرج چیزهای خوب کنید\",\"balance\":\"موجودی سکه\",\"cost\":\"{value} سکه\",\"stock\":\"{count} عدد باقی‌مانده\",\"outOfStock\":\"ناموجود\",\"notAffordable\":\"سکه کافی ندارید\",\"redeem\":\"درخواست\",\"myRedemptions\":\"درخواست‌های من\",\"noRewards\":\"پاداشی ثبت نشده است\",\"noRedemptions\":\"هنوز درخواستی ثبت نکرده‌اید\",\"type\":{\"PHYSICAL\":\"کالای فیزیکی\",\"VOUCHER\":\"کارت هدیه\",\"TIME_OFF\":\"مرخصی تشویقی\",\"DONATION\":\"خیریه\",\"CUSTOM\":\"پاداش ویژه\"}},\"notifications\":{\"title\":\"اعلان‌ها\",\"subtitle\":\"رویدادهای مهم مربوط به شما\",\"unreadCount\":\"{count} خوانده‌نشده\",\"markAllRead\":\"خواندن همه\",\"empty\":\"اعلان جدیدی ندارید\",\"type\":{\"TASK_ASSIGNED\":\"تسک جدید\",\"TASK_REVIEWED\":\"بازبینی تسک\",\"ACHIEVEMENT_UNLOCKED\":\"دستاورد تازه\",\"LEVEL_UP\":\"ارتقای سطح\",\"REWARD_AVAILABLE\":\"پاداش تازه\",\"REDEMPTION_UPDATE\":\"وضعیت درخواست\",\"RECOGNITION_RECEIVED\":\"تقدیر\",\"CHALLENGE_UPDATE\":\"چالش\",\"SYSTEM\":\"سیستم\"}},\"settings\":{\"title\":\"تنظیمات\",\"subtitle\":\"حساب کاربری و ترجیحات نمایش\",\"profile\":\"پروفایل\",\"preferences\":\"ترجیحات\",\"company\":\"سازمان\",\"fullName\":\"نام و نام خانوادگی\",\"jobTitle\":\"عنوان شغلی\",\"email\":\"رایانامه\",\"phone\":\"شماره موبایل\",\"role\":\"نقش\",\"languageLabel\":\"زبان رابط کاربری\",\"themeLabel\":\"پوسته\",\"saved\":\"تغییرات ذخیره شد\",\"companyInfo\":\"اطلاعات سازمان\",\"timezone\":\"منطقه زمانی\"},\"roles\":{\"OWNER\":\"مالک\",\"ADMIN\":\"مدیر سازمان\",\"MANAGER\":\"مدیر تیم\",\"EMPLOYEE\":\"کارمند\"},\"errors\":{\"notFound\":\"صفحه مورد نظر پیدا نشد\",\"notFoundHint\":\"ممکن است نشانی را اشتباه وارد کرده باشید.\",\"forbidden\":\"دسترسی لازم را ندارید\",\"unauthorized\":\"برای ادامه وارد شوید\",\"serverError\":\"خطای غیرمنتظره در سرور\",\"networkError\":\"اتصال برقرار نشد\",\"backHome\":\"بازگشت به خانه\",\"statusCode\":\"کد خطا\",\"generic\":\"خطای غیرمنتظره‌ای رخ داد\"},\"landing\":{\"hero\":{\"badge\":\"نسخه پایه — فاز صفر\",\"title\":\"کار خوب باید دیده شود\",\"subtitle\":\"ورک‌کوئست تسک‌ها، بازخوردها و پاداش‌ها را در یک مسیر روشن به هم وصل می‌کند؛ با امتیاز، سطح و نشان، بدون آنکه از جدیت کار کم شود.\",\"cta\":\"ورود به سازمان\",\"secondary\":\"دیدن امکانات\"},\"features\":{\"title\":\"یک حلقه ساده، یک تیم پرانرژی\",\"tasks\":{\"title\":\"تسک و بازبینی\",\"body\":\"تسک محول می‌شود، انجام می‌شود و مدیر آن را با امتیاز و بازخورد مشخص می‌بندد.\"},\"xp\":{\"title\":\"امتیاز و سطح\",\"body\":\"هر بازخورد مثبت به امتیاز تجربه و پیشرفت در نردبان سطح تبدیل می‌شود.\"},\"rewards\":{\"title\":\"سکه و پاداش\",\"body\":\"سکه‌ها در فروشگاه داخلی سازمان خرج می‌شوند؛ از مرخصی تشویقی تا کارت هدیه.\"},\"teams\":{\"title\":\"چندسازمانی و امن\",\"body\":\"داده‌ی هر سازمان کاملاً جدا می‌ماند؛ دسترسی‌ها سمت سرور بررسی می‌شوند.\"}},\"footer\":\"ساخته‌شده برای تیم‌های ایرانی\"},\"members\":{\"title\":\"کارکنان\",\"subtitle\":\"افزودن، ویرایش و مدیریت اعضای شرکت\",\"searchPlaceholder\":\"جست‌وجو بر اساس نام، عنوان شغلی یا شماره موبایل\",\"total\":\"{count} نفر\",\"you\":\"شما\",\"noJobTitle\":\"بدون عنوان شغلی\",\"noTeam\":\"بدون تیم\",\"memberCount\":\"{count} عضو\",\"backToList\":\"بازگشت به فهرست کارکنان\",\"notFound\":\"این کاربر پیدا نشد یا دسترسی مشاهده آن را ندارید\",\"removeConfirm\":\"«{name}» از شرکت حذف شود؟ دسترسی او بلافاصله قطع می‌شود.\",\"empty\":{\"title\":\"هنوز عضوی ثبت نشده است\",\"description\":\"اولین همکار خود را با شماره موبایل دعوت کنید.\",\"descriptionReadOnly\":\"شما هنوز عضو هیچ تیمی نیستید.\"},\"filters\":{\"team\":\"همه تیم‌ها\",\"role\":\"همه نقش‌ها\"},\"actions\":{\"view\":\"مشاهده پروفایل\",\"remove\":\"حذف از شرکت\"},\"invite\":{\"cta\":\"دعوت همکار\",\"title\":\"دعوت همکار جدید\",\"subtitle\":\"همکار شما با کد ورود پیامکی به شرکت می‌پیوندد؛ نیازی به رمز عبور نیست.\",\"phoneLabel\":\"شماره موبایل\",\"phoneHint\":\"مثال: ۰۹۱۲۱۲۳۴۵۶۷\",\"nameLabel\":\"نام و نام خانوادگی\",\"namePlaceholder\":\"مثلاً سارا محمدی\",\"jobTitleLabel\":\"عنوان شغلی\",\"jobTitlePlaceholder\":\"مثلاً توسعه‌دهنده ارشد\",\"teamLabel\":\"تیم\",\"roleLabel\":\"نقش\",\"expiryLabel\":\"اعتبار دعوت‌نامه\",\"expiryOption\":\"{count} روز\",\"noTeam\":\"بدون تیم\",\"noticeTitle\":\"همکار شما چه می‌بیند؟\",\"noticeDetail\":\"پس از ورود با کد پیامکی، این دعوت‌نامه را می‌بیند و با یک کلیک می‌پذیرد.\",\"submit\":\"ارسال دعوت‌نامه\",\"sending\":\"در حال ارسال…\",\"successTitle\":\"دعوت‌نامه ارسال شد\",\"successDetail\":\"{name} می‌تواند با شماره موبایل خود وارد شود.\",\"errors\":{\"generic\":\"ارسال دعوت‌نامه ناموفق بود\"}},\"detail\":{\"profile\":\"شناسنامه\",\"role\":\"نقش سازمانی\",\"status\":\"وضعیت\",\"team\":\"تیم\",\"lastLogin\":\"آخرین ورود\",\"neverLoggedIn\":\"هنوز وارد نشده است\",\"subordinates\":\"زیردستان\",\"gamification\":\"امتیازها و عملکرد\",\"performance\":\"خلاصه عملکرد\",\"overdue\":\"عقب‌افتاده\",\"achievements\":\"دستاوردها\",\"noAchievements\":\"هنوز دستاوردی کسب نکرده است\"},\"edit\":{\"title\":\"ویرایش عضو\",\"success\":\"تغییرات ذخیره شد\",\"managerNotice\":\"به‌عنوان مدیر تیم می‌توانید عنوان شغلی و تیم را تغییر دهید؛ تغییر نقش در اختیار مدیران شرکت است.\",\"errors\":{\"generic\":\"ذخیره تغییرات ناموفق بود\"}}},\"invitations\":{\"title\":\"دعوت‌نامه‌ها\",\"subtitle\":\"دعوت‌نامه‌های ارسال‌شده و وضعیت پذیرش آن‌ها\",\"empty\":\"دعوت‌نامه‌ای در این وضعیت نیست\",\"emptyHint\":\"با دکمه «دعوت همکار» اولین دعوت‌نامه را بسازید.\",\"expires\":\"اعتبار\",\"daysLeft\":\"{count} روز باقی‌مانده\",\"revoke\":\"لغو\",\"revokeConfirm\":\"دعوت‌نامه «{name}» لغو شود؟\",\"revoked\":\"دعوت‌نامه لغو شد\",\"noJobTitle\":\"بدون عنوان شغلی\",\"teamLabel\":\"تیم\",\"errors\":{\"generic\":\"انجام این کار ناموفق بود\"},\"verifySuccess\":\"کد تأیید شد\",\"verifySuccessDetail\":\"یک دعوت‌نامه در انتظار شماست.\",\"joinTitle\":\"دعوت‌نامه شما\",\"joinSubtitle\":\"شرکت زیر شما را دعوت کرده است. با پذیرش، حساب شما در همان شرکت ساخته می‌شود.\",\"nonePending\":\"دعوت‌نامه معتبری برای این شماره وجود ندارد\",\"acceptButton\":\"پذیرش دعوت‌نامه و ورود\",\"acceptNotice\":\"نقش و تیم شما را مدیر شرکت تعیین کرده است و پس از ورود قابل مشاهده است.\",\"joinAs\":\"پیوستن به‌عنوان {name}\",\"joinAsDetail\":\"نقش شما در این شرکت: {role}\",\"joinedTitle\":\"خوش آمدید\",\"joinedDetail\":\"به «{company}» پیوستید.\"}}");

const locale_en_46json_35b0d567 = /* @__PURE__ */ JSON.parse("{\"app\":{\"name\":\"WorkQuest\",\"shortName\":\"WorkQuest\",\"tagline\":\"Employee performance management, gamified\",\"description\":\"WorkQuest turns everyday team work into a clear loop of tasks, feedback and rewards.\"},\"common\":{\"loading\":\"Loading…\",\"save\":\"Save\",\"saving\":\"Saving…\",\"cancel\":\"Cancel\",\"delete\":\"Delete\",\"edit\":\"Edit\",\"search\":\"Search\",\"searchPlaceholder\":\"Search…\",\"filter\":\"Filter\",\"back\":\"Back\",\"next\":\"Next\",\"previous\":\"Previous\",\"confirm\":\"Confirm\",\"close\":\"Close\",\"retry\":\"Retry\",\"optional\":\"Optional\",\"required\":\"Required\",\"all\":\"All\",\"status\":\"Status\",\"actions\":\"Actions\",\"viewAll\":\"View all\",\"comingSoon\":\"Coming soon\",\"empty\":\"Nothing here yet\",\"yes\":\"Yes\",\"no\":\"No\",\"of\":\"of\",\"items\":\"items\",\"page\":\"Page\",\"language\":\"Language\",\"theme\":\"Theme\",\"light\":\"Light\",\"dark\":\"Dark\",\"system\":\"System\",\"today\":\"Today\",\"yesterday\":\"Yesterday\",\"days\":\"days\",\"logout\":\"Sign out\",\"copy\":\"Copy\",\"copied\":\"Copied\"},\"nav\":{\"dashboard\":\"Dashboard\",\"tasks\":\"Tasks\",\"team\":\"My team\",\"leaderboard\":\"Leaderboard\",\"achievements\":\"Achievements\",\"rewards\":\"Rewards\",\"notifications\":\"Notifications\",\"settings\":\"Settings\",\"main\":\"Main navigation\",\"account\":\"Account\",\"collapse\":\"Collapse menu\",\"expand\":\"Expand menu\",\"members\":\"Employees\",\"invitations\":\"Invitations\"},\"auth\":{\"loginTitle\":\"Sign in to WorkQuest\",\"loginSubtitle\":\"Enter your work mobile number and we will send you a sign-in code.\",\"phoneLabel\":\"Mobile number\",\"phonePlaceholder\":\"+98 912 123 4567\",\"sendCode\":\"Send code\",\"sending\":\"Sending…\",\"codeTitle\":\"Enter the code\",\"codeSubtitle\":\"Enter the {length}-digit code sent to {phone}.\",\"codeLabel\":\"Sign-in code\",\"verifyCode\":\"Sign in\",\"verifying\":\"Verifying…\",\"resendCode\":\"Resend code\",\"resendIn\":\"Resend in {seconds}s\",\"changePhone\":\"Change number\",\"expiresIn\":\"Code expires in {seconds}s\",\"codeSent\":\"Code sent\",\"welcomeBack\":\"Welcome back, {name}\",\"signedOut\":\"You have been signed out\",\"devHint\":\"In development the code is printed to the server log.\",\"errors\":{\"invalidPhone\":\"That mobile number does not look right\",\"invalidCode\":\"The code is incorrect\",\"expiredCode\":\"That code expired — request a new one\",\"userNotFound\":\"No account for this number. Ask your company admin.\",\"rateLimited\":\"Please wait a moment and try again\",\"generic\":\"Sign-in failed\"},\"orDivider\":\"or\",\"registerTitle\":\"Your organisation is not here yet?\",\"registerSubtitle\":\"Register your company and bring your team to WorkQuest. The phone number above becomes the owner account.\",\"registerCompany\":\"Register a new company\",\"codeTitleRegister\":\"Enter the verification code\",\"codeSentDetail\":\"Delivered through the {provider} provider\",\"securityNote\":\"Codes are never stored in plain text and expire after a few minutes.\",\"otpSecurityNote\":\"This code is single-use and is burned after a few wrong attempts.\"},\"onboarding\":{\"stepsLabel\":\"Registration steps\",\"steps\":{\"verify\":\"Verify phone\",\"profile\":\"Your profile\",\"company\":\"Your company\"},\"verifySuccess\":\"Phone number verified\",\"verifySuccessDetail\":\"Now create your account and company\",\"profileTitle\":\"Tell us about yourself\",\"profileSubtitle\":\"{phone} is verified. Your teammates will see this on your profile.\",\"fullNameLabel\":\"Full name\",\"fullNamePlaceholder\":\"e.g. Saina Rostami\",\"fullNameHint\":\"At least 3 characters\",\"jobTitleLabel\":\"Job title\",\"jobTitlePlaceholder\":\"e.g. Chief Executive Officer\",\"companyTitle\":\"Create your company\",\"companySubtitle\":\"This is your team's workspace. Its data is kept separate from every other organisation.\",\"companyNameLabel\":\"Company name\",\"companyNamePlaceholder\":\"e.g. Navandishan Paya\",\"slugLabel\":\"Company address\",\"slugHint\":\"Lowercase letters, digits and dashes only\",\"slugTaken\":\"This address is taken.\",\"slugUseSuggestion\":\"Our suggestion: {slug}\",\"industryLabel\":\"Industry\",\"industryPlaceholder\":\"e.g. Information technology\",\"timezoneLabel\":\"Timezone\",\"advanced\":\"Advanced\",\"logoUrlLabel\":\"Logo URL\",\"continue\":\"Continue\",\"back\":\"Back\",\"createCompany\":\"Create company and continue\",\"creating\":\"Creating your company…\",\"creatingDetail\":\"Your workspace is being prepared; levels and starting points are set up now.\",\"successTitle\":\"“{company}” was created\",\"ticketNotice\":\"This registration session is valid for {seconds} more seconds. If it expires, request a new code.\",\"errors\":{\"fullName\":\"Please enter your full name\",\"companyName\":\"Please enter the company name\",\"generic\":\"Could not create the company\"}},\"dashboard\":{\"greeting\":\"Hello {name}\",\"subtitle\":\"Your day at a glance\",\"yourProgress\":\"Your progress\",\"level\":\"Level {level}\",\"xpToNext\":\"{current} of {needed} XP to the next level\",\"weeklySummary\":\"This week\",\"openTasks\":\"Open tasks\",\"completedTasks\":\"Completed\",\"pendingReview\":\"Awaiting review\",\"overdue\":\"Overdue\",\"myTasks\":\"My tasks\",\"noOpenTasks\":\"No open tasks. Nice work!\",\"topPerformers\":\"Top performers\",\"recentRecognition\":\"Recent recognition\",\"noRecognition\":\"No recognition yet\",\"activeChallenge\":\"Active challenge\",\"challengeGoal\":\"Goal: {goal}\",\"endsIn\":\"{days} days left\",\"myRank\":\"My rank\",\"rankValue\":\"{rank} of {total}\",\"todaysTasks\":\"Today’s tasks\",\"activeTasks\":\"Active tasks\",\"pendingSubmissions\":\"Pending submissions\",\"completedTasksTitle\":\"Completed tasks\",\"upcomingDeadlines\":\"Upcoming deadlines\",\"managerView\":\"Manager view\",\"employeeView\":\"My work\",\"pendingReviews\":\"Pending reviews\",\"overdueTasks\":\"Overdue tasks\",\"teamCompletion\":\"Team completion rate\",\"completionRate\":\"Completion rate\",\"noTasksToday\":\"Nothing due today\",\"noPendingReviews\":\"No reviews waiting\",\"noOverdue\":\"Nothing is overdue\",\"noUpcoming\":\"No deadlines coming up\",\"noActiveTasks\":\"No active tasks\",\"noSubmissions\":\"Nothing awaiting review\",\"noCompleted\":\"No approved tasks yet\",\"noTeams\":\"No team data yet\",\"reviewNow\":\"Review\",\"viewAll\":\"View all\"},\"tasks\":{\"title\":\"Tasks\",\"subtitle\":\"Work assigned to you and your team\",\"scope\":{\"mine\":\"My tasks\",\"team\":\"My team\",\"all\":\"All tasks\"},\"assignee\":\"Assignee\",\"team\":\"Team\",\"dueDate\":\"Due date\",\"dueIn\":\"{days} days left\",\"dueToday\":\"Due today\",\"overdue\":\"{days} days late\",\"noDueDate\":\"No due date\",\"rewards\":\"Reward\",\"xp\":\"{value} XP\",\"coins\":\"{value} coins\",\"empty\":\"No tasks match these filters\",\"total\":\"{count} tasks\",\"dueTomorrow\":\"Due tomorrow\",\"progress\":\"Progress\",\"progressValue\":\"{value}%\",\"estimate\":\"Estimate\",\"estimateHours\":\"{hours} h\",\"revisionCount\":\"Sent back {count} times\",\"comments\":\"Comments\",\"attachments\":\"Attachments\",\"history\":\"History\",\"reviews\":\"Reviews\",\"noComments\":\"No comments yet\",\"noAttachments\":\"No attachments\",\"addComment\":\"Add comment\",\"commentPlaceholder\":\"Write a comment…\",\"addAttachment\":\"Add attachment\",\"fileName\":\"File name\",\"fileUrl\":\"File URL\",\"create\":\"New task\",\"createTitle\":\"Create a task\",\"edit\":\"Edit task\",\"save\":\"Save\",\"created\":\"Task created\",\"updated\":\"Task updated\",\"detailTitle\":\"Task details\",\"backToList\":\"Back to tasks\",\"filters\":\"Filters\",\"search\":\"Search tasks\",\"sort\":\"Sort\",\"sortBy\":{\"dueDate\":\"Due date\",\"priority\":\"Priority\",\"createdAt\":\"Newest\",\"status\":\"Status\"},\"onlyOverdue\":\"Overdue only\",\"reward\":\"Reward\",\"assignedBy\":\"Assigned by {name}\",\"unassigned\":\"Unassigned\",\"actions\":{\"start\":\"Start task\",\"submit\":\"Submit for review\",\"approve\":\"Approve\",\"request_revision\":\"Request revision\",\"reopen\":\"Send back to queue\"},\"actionDone\":{\"start\":\"Task started\",\"submit\":\"Task submitted for review\",\"approve\":\"Task approved\",\"request_revision\":\"Revision requested\",\"reopen\":\"Task reopened\"},\"review\":{\"title\":\"Review task\",\"score\":\"Quality score\",\"feedback\":\"Feedback\",\"feedbackPlaceholder\":\"Explain what needs to change…\",\"feedbackRequired\":\"Please explain what needs revision\",\"approveHint\":\"Approving pays the task reward to the assignee\",\"selfReview\":\"You cannot review your own task\"},\"form\":{\"title\":\"Title\",\"titlePlaceholder\":\"e.g. Redesign the sign-in page\",\"description\":\"Description\",\"descriptionPlaceholder\":\"Expected output and acceptance criteria…\",\"assignee\":\"Assignee\",\"selectAssignee\":\"Pick someone\",\"team\":\"Team\",\"selectTeam\":\"Pick a team (optional)\",\"priority\":\"Priority\",\"dueDate\":\"Due date\",\"estimatedHours\":\"Estimated effort (hours)\",\"xpReward\":\"XP reward\",\"coinReward\":\"Coins\",\"attachments\":\"Attachments (optional)\",\"submit\":\"Create task\"},\"events\":{\"task.created\":\"Task created\",\"task.start\":\"Task started\",\"task.submit\":\"Submitted for review\",\"task.approve\":\"Approved\",\"task.request_revision\":\"Revision requested\",\"task.reopen\":\"Reopened\",\"task.updated\":\"Edited\",\"task.reassigned\":\"Assignee changed\",\"task.attachment_added\":\"Attachment added\"}},\"status\":{\"task\":{\"TODO\":\"To do\",\"IN_PROGRESS\":\"In progress\",\"SUBMITTED\":\"Submitted\",\"NEEDS_REVISION\":\"Needs revision\",\"APPROVED\":\"Approved\"},\"redemption\":{\"REQUESTED\":\"Requested\",\"APPROVED\":\"Approved\",\"REJECTED\":\"Rejected\",\"FULFILLED\":\"Fulfilled\",\"CANCELLED\":\"Cancelled\"},\"user\":{\"ACTIVE\":\"Active\",\"SUSPENDED\":\"Suspended\",\"DEACTIVATED\":\"Deactivated\",\"INVITED\":\"Invited\"},\"invitation\":{\"PENDING\":\"Pending\",\"ACCEPTED\":\"Accepted\",\"REVOKED\":\"Revoked\",\"EXPIRED\":\"Expired\"}},\"priority\":{\"LOW\":\"Low\",\"MEDIUM\":\"Medium\",\"HIGH\":\"High\"},\"gamification\":{\"xp\":\"Experience\",\"coins\":\"Coins\",\"level\":\"Level\",\"streak\":\"Day streak\",\"currentStreak\":\"Current streak\",\"longestStreak\":\"Longest streak\",\"rank\":\"Rank\",\"achievement\":\"Achievements\",\"badge\":\"Badges\",\"unlocked\":\"Unlocked\",\"locked\":\"Locked\",\"unlockedOn\":\"Unlocked on {date}\",\"progress\":\"{current} of {total}\",\"noAchievements\":\"No achievements unlocked yet\"},\"team\":{\"title\":\"My team\",\"subtitle\":\"Colleagues, direct managers and team status\",\"members\":\"Members\",\"memberCount\":\"{count} members\",\"taskCount\":\"{count} active tasks\",\"lead\":\"Team lead\",\"manager\":\"Direct manager\",\"noTeams\":\"You are not in a team yet\",\"noMembers\":\"No members yet\",\"create\":\"New team\",\"createTitle\":\"Create a team\",\"createSubtitle\":\"You can set the lead and members right after creating it.\",\"createSuccess\":\"Team created\",\"nameLabel\":\"Team name\",\"namePlaceholder\":\"e.g. Product team\",\"descriptionLabel\":\"Description\",\"descriptionPlaceholder\":\"What does this team do?\",\"openTeam\":\"Team details\",\"notFound\":\"This team was not found, or you may not view it\",\"aboutTitle\":\"About this team\",\"noLead\":\"No lead assigned\",\"noManager\":\"No direct manager\",\"createdAt\":\"Created\",\"delete\":\"Delete team\",\"deleteConfirm\":\"Delete the team “{name}”? Members stay in the company but lose this membership.\",\"deleteSuccess\":\"Team deleted\",\"editTitle\":\"Edit team\",\"editSuccess\":\"Team updated\",\"addMember\":\"Add member\",\"addMemberTitle\":\"Add a member to the team\",\"addMemberSubtitle\":\"Only people who are not in a team yet appear here.\",\"addSuccess\":\"Member added to the team\",\"removeMember\":\"Remove\",\"removeMemberConfirm\":\"Remove “{name}” from this team?\",\"candidateLabel\":\"Member\",\"noCandidates\":\"Nobody left to add\",\"noCandidatesHint\":\"Everyone in the company already belongs to a team.\",\"errors\":{\"generic\":\"That did not work\"},\"leadNeedsManager\":\"promote them to Team manager first\"},\"leaderboard\":{\"title\":\"Leaderboard\",\"subtitle\":\"A little friendly competition\",\"range\":{\"week\":\"This week\",\"month\":\"This month\",\"all\":\"All time\"},\"yourPosition\":\"Your position\",\"points\":\"Points\",\"noData\":\"Nothing to show yet\"},\"achievements\":{\"title\":\"Achievements & badges\",\"subtitle\":\"Your growth path in WorkQuest\",\"unlockedCount\":\"{count} unlocked\",\"badgeCount\":\"{count} badges\",\"rewards\":\"Achievement reward\"},\"rewards\":{\"title\":\"Reward store\",\"subtitle\":\"Spend your coins on something good\",\"balance\":\"Coin balance\",\"cost\":\"{value} coins\",\"stock\":\"{count} left\",\"outOfStock\":\"Out of stock\",\"notAffordable\":\"Not enough coins\",\"redeem\":\"Redeem\",\"myRedemptions\":\"My requests\",\"noRewards\":\"No rewards published yet\",\"noRedemptions\":\"You have not requested anything yet\",\"type\":{\"PHYSICAL\":\"Physical\",\"VOUCHER\":\"Voucher\",\"TIME_OFF\":\"Time off\",\"DONATION\":\"Donation\",\"CUSTOM\":\"Custom\"}},\"notifications\":{\"title\":\"Notifications\",\"subtitle\":\"Things worth your attention\",\"unreadCount\":\"{count} unread\",\"markAllRead\":\"Mark all read\",\"empty\":\"You are all caught up\",\"type\":{\"TASK_ASSIGNED\":\"New task\",\"TASK_REVIEWED\":\"Task reviewed\",\"ACHIEVEMENT_UNLOCKED\":\"Achievement\",\"LEVEL_UP\":\"Level up\",\"REWARD_AVAILABLE\":\"New reward\",\"REDEMPTION_UPDATE\":\"Request update\",\"RECOGNITION_RECEIVED\":\"Recognition\",\"CHALLENGE_UPDATE\":\"Challenge\",\"SYSTEM\":\"System\"}},\"settings\":{\"title\":\"Settings\",\"subtitle\":\"Your account and display preferences\",\"profile\":\"Profile\",\"preferences\":\"Preferences\",\"company\":\"Company\",\"fullName\":\"Full name\",\"jobTitle\":\"Job title\",\"email\":\"Email\",\"phone\":\"Mobile number\",\"role\":\"Role\",\"languageLabel\":\"Interface language\",\"themeLabel\":\"Theme\",\"saved\":\"Changes saved\",\"companyInfo\":\"Company details\",\"timezone\":\"Timezone\"},\"roles\":{\"OWNER\":\"Owner\",\"ADMIN\":\"Company admin\",\"MANAGER\":\"Team manager\",\"EMPLOYEE\":\"Employee\"},\"errors\":{\"notFound\":\"Page not found\",\"notFoundHint\":\"The address may be wrong.\",\"forbidden\":\"You do not have access\",\"unauthorized\":\"Sign in to continue\",\"serverError\":\"Unexpected server error\",\"networkError\":\"Connection failed\",\"backHome\":\"Back home\",\"statusCode\":\"Status code\",\"generic\":\"Something went wrong\"},\"landing\":{\"hero\":{\"badge\":\"Foundation build — phase zero\",\"title\":\"Good work deserves to be seen\",\"subtitle\":\"WorkQuest connects tasks, feedback and rewards into one clear path — with XP, levels and badges, without turning work into a toy.\",\"cta\":\"Sign in\",\"secondary\":\"See features\"},\"features\":{\"title\":\"One simple loop, one energetic team\",\"tasks\":{\"title\":\"Tasks & reviews\",\"body\":\"A task is assigned, delivered, and closed by a manager with a score and real feedback.\"},\"xp\":{\"title\":\"XP & levels\",\"body\":\"Every positive review turns into experience and progress up the level ladder.\"},\"rewards\":{\"title\":\"Coins & rewards\",\"body\":\"Coins are spent in your company store — from time off to gift cards.\"},\"teams\":{\"title\":\"Multi-tenant & secure\",\"body\":\"Every company's data stays isolated, and permissions are checked server-side.\"}},\"footer\":\"Built for Iranian teams\"},\"members\":{\"title\":\"Employees\",\"subtitle\":\"Add, edit and manage the people in your company\",\"searchPlaceholder\":\"Search by name, job title or phone number\",\"total\":\"{count} people\",\"you\":\"You\",\"noJobTitle\":\"No job title\",\"noTeam\":\"No team\",\"memberCount\":\"{count} members\",\"backToList\":\"Back to employees\",\"notFound\":\"This person was not found, or you may not view their profile\",\"removeConfirm\":\"Remove “{name}” from the company? Their access is revoked immediately.\",\"empty\":{\"title\":\"No employees yet\",\"description\":\"Invite your first colleague with their phone number.\",\"descriptionReadOnly\":\"You are not a member of any team yet.\"},\"filters\":{\"team\":\"All teams\",\"role\":\"All roles\"},\"actions\":{\"view\":\"View profile\",\"remove\":\"Remove from company\"},\"invite\":{\"cta\":\"Invite colleague\",\"title\":\"Invite a colleague\",\"subtitle\":\"They join with an SMS code — there are no passwords in WorkQuest.\",\"phoneLabel\":\"Phone number\",\"phoneHint\":\"e.g. +989121234567\",\"nameLabel\":\"Full name\",\"namePlaceholder\":\"e.g. Sara Mohammadi\",\"jobTitleLabel\":\"Job title\",\"jobTitlePlaceholder\":\"e.g. Senior developer\",\"teamLabel\":\"Team\",\"roleLabel\":\"Role\",\"expiryLabel\":\"Invitation validity\",\"expiryOption\":\"{count} days\",\"noTeam\":\"No team\",\"noticeTitle\":\"What will they see?\",\"noticeDetail\":\"After signing in with their SMS code they see this invitation and accept it in one tap.\",\"submit\":\"Send invitation\",\"sending\":\"Sending…\",\"successTitle\":\"Invitation sent\",\"successDetail\":\"{name} can now sign in with their phone number.\",\"errors\":{\"generic\":\"Could not send the invitation\"}},\"detail\":{\"profile\":\"Profile\",\"role\":\"Company role\",\"status\":\"Status\",\"team\":\"Team\",\"lastLogin\":\"Last sign-in\",\"neverLoggedIn\":\"Has not signed in yet\",\"subordinates\":\"Direct reports\",\"gamification\":\"Points and performance\",\"performance\":\"Performance summary\",\"overdue\":\"Overdue\",\"achievements\":\"Achievements\",\"noAchievements\":\"No achievements unlocked yet\"},\"edit\":{\"title\":\"Edit member\",\"success\":\"Changes saved\",\"managerNotice\":\"As a team manager you can change the job title and team; role changes belong to company admins.\",\"errors\":{\"generic\":\"Could not save the changes\"}}},\"invitations\":{\"title\":\"Invitations\",\"subtitle\":\"Invitations you sent and whether they were accepted\",\"empty\":\"No invitations in this state\",\"emptyHint\":\"Use “Invite colleague” to send the first one.\",\"expires\":\"Validity\",\"daysLeft\":\"{count} days left\",\"revoke\":\"Revoke\",\"revokeConfirm\":\"Revoke the invitation for “{name}”?\",\"revoked\":\"Invitation revoked\",\"noJobTitle\":\"No job title\",\"teamLabel\":\"Team\",\"errors\":{\"generic\":\"That did not work\"},\"verifySuccess\":\"Code verified\",\"verifySuccessDetail\":\"You have an invitation waiting.\",\"joinTitle\":\"Your invitation\",\"joinSubtitle\":\"The company below invited you. Accepting creates your account inside it.\",\"nonePending\":\"There is no valid invitation for this number\",\"acceptButton\":\"Accept and sign in\",\"acceptNotice\":\"Your role and team were set by the company and are visible once you sign in.\",\"joinAs\":\"Join as {name}\",\"joinAsDetail\":\"Your role in this company: {role}\",\"joinedTitle\":\"Welcome\",\"joinedDetail\":\"You joined “{company}”.\"}}");

// @ts-nocheck
const localeCodes =  [
  "fa",
  "en"
];
const localeLoaders = {
  fa: [
    {
      key: "locale_fa_46json_899a022e",
      load: () => Promise.resolve(locale_fa_46json_899a022e),
      cache: true
    }
  ],
  en: [
    {
      key: "locale_en_46json_35b0d567",
      load: () => Promise.resolve(locale_en_46json_35b0d567),
      cache: true
    }
  ]
};
const vueI18nConfigs = [];
const normalizedLocales = [
  {
    code: "fa",
    language: "fa-IR",
    name: "فارسی",
    dir: "rtl",
    domains: [],
    defaultForDomains: []
  },
  {
    code: "en",
    language: "en-US",
    name: "English",
    dir: "ltr",
    domains: [],
    defaultForDomains: []
  }
];

const setupVueI18nOptions = async (defaultLocale) => {
  const options = await loadVueI18nOptions(vueI18nConfigs);
  options.locale = defaultLocale || options.locale || "en-US";
  options.defaultLocale = defaultLocale;
  options.fallbackLocale ??= false;
  options.messages ??= {};
  for (const locale of localeCodes) {
    options.messages[locale] ??= {};
  }
  return options;
};

function defineNitroPlugin(def) {
  return def;
}

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

function buildAssetsDir() {
	return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
	return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
	const app = useRuntimeConfig().app;
	const publicBase = app.cdnURL || app.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

function parseAcceptLanguage(value) {
  return value.split(",").map((tag) => tag.split(";")[0]).filter(
    (tag) => !(tag === "*" || tag === "")
  );
}
function createPathIndexLanguageParser(index = 0) {
  return (path) => {
    const rawPath = typeof path === "string" ? path : path.pathname;
    const normalizedPath = rawPath.split("?")[0];
    const parts = normalizedPath.split("/");
    if (parts[0] === "") {
      parts.shift();
    }
    return parts.length > index ? parts[index] || "" : "";
  };
}

function normalizeIranianPhone(input) {
  const trimmed = input.replace(/[\s\-()]/g, "");
  const match = /^(?:(\+98)|0)(9\d{9})$/.exec(trimmed);
  if (!match) return /^\+989\d{9}$/.test(trimmed) ? trimmed : null;
  return `+98${match[2]}`;
}
const TRANSLITERATION = {
  \u0622: "a",
  \u0623: "a",
  \u0625: "e",
  \u0627: "a",
  \u0628: "b",
  \u067E: "p",
  \u062A: "t",
  \u062B: "s",
  \u062C: "j",
  \u0686: "ch",
  \u062D: "h",
  \u062E: "kh",
  \u062F: "d",
  \u0630: "z",
  \u0631: "r",
  \u0632: "z",
  \u0698: "zh",
  \u0633: "s",
  \u0634: "sh",
  \u0635: "s",
  \u0636: "z",
  \u0637: "t",
  \u0638: "z",
  \u0639: "a",
  \u063A: "gh",
  \u0641: "f",
  \u0642: "gh",
  \u06A9: "k",
  \u0643: "k",
  \u06AF: "g",
  \u0644: "l",
  \u0645: "m",
  \u0646: "n",
  \u0647: "h",
  \u0629: "h"
};
const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;
const LATIN_VOWELS = "aeiou";
const DIGRAPHS = ["ch", "sh", "gh", "kh", "zh"];
function toLatinDigits(input) {
  return input.replace(/[۰-۹]/g, (d) => String("\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9".indexOf(d))).replace(/[٠-٩]/g, (d) => String("\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669".indexOf(d)));
}
function tokenize(word) {
  const tokens = [];
  let index = 0;
  while (index < word.length) {
    const digraph = word.slice(index, index + 2);
    if (DIGRAPHS.includes(digraph)) {
      tokens.push(digraph);
      index += 2;
      continue;
    }
    tokens.push(word[index]);
    index += 1;
  }
  return tokens;
}
function breakUpClusters(word) {
  const tokens = tokenize(word);
  const out = [];
  let run = [];
  const flush = () => {
    if (run.length >= 3) {
      run.forEach((token, position) => {
        out.push(token);
        if (position < run.length - 1) out.push("a");
      });
    } else {
      out.push(...run);
    }
    run = [];
  };
  for (const token of tokens) {
    if (/[a-z]/.test(token) && !LATIN_VOWELS.includes(token)) {
      run.push(token);
      continue;
    }
    flush();
    out.push(token);
  }
  flush();
  return out.join("").replace(/([aeiou])\1+/g, "$1");
}
function slugify(input) {
  const cleaned = toLatinDigits(input.replace(ZERO_WIDTH, " ")).trim();
  const words = cleaned.split(/\s+/).map((word) => {
    const letters = [...word];
    const latin = [];
    letters.forEach((char, position) => {
      var _a;
      const next = letters[position + 1];
      const previousLatin = latin.join("");
      const previousIsConsonant = previousLatin.length > 0 && !LATIN_VOWELS.includes(previousLatin.at(-1));
      if (char === "\u0648") {
        const nextIsConsonantLetter = next !== void 0 && next !== "\u0627" && next !== "\u0622" && next !== "\u06CC" && next !== "\u0648";
        latin.push(previousIsConsonant && nextIsConsonantLetter ? "o" : "v");
        return;
      }
      if (char === "\u06CC" || char === "\u064A" || char === "\u0626") {
        const atWordEnd = next === void 0;
        const nextIsConsonantLetter = next !== void 0 && !["\u0627", "\u0622", "\u0648", "\u06CC"].includes(next);
        latin.push(previousIsConsonant && (atWordEnd || nextIsConsonantLetter) ? "i" : "y");
        return;
      }
      if (char === "\u0621") return;
      if (char === "\u0624") {
        latin.push("o");
        return;
      }
      latin.push((_a = TRANSLITERATION[char]) != null ? _a : char);
    });
    return breakUpClusters(latin.join("").toLowerCase().replace(/[^a-z0-9]+/g, " "));
  });
  return words.join(" ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-").slice(0, 60);
}

const ROLES = ["OWNER", "ADMIN", "MANAGER", "EMPLOYEE"];
const ROLE_RANK = {
  OWNER: 40,
  ADMIN: 30,
  MANAGER: 20,
  EMPLOYEE: 10
};
const MATRIX = {
  OWNER: "*",
  ADMIN: "*",
  MANAGER: [
    "company:read",
    "member:read",
    "member:invite",
    "team:read",
    "team:manage:assigned",
    "task:read:own",
    "task:read:team",
    "task:assign",
    "task:review",
    "achievement:read",
    "reward:read",
    "challenge:read",
    "recognition:create",
    "leaderboard:read"
  ],
  EMPLOYEE: [
    "company:read",
    // Scoped by the handler to the teams the employee actually belongs to.
    "team:read",
    "task:read:own",
    "achievement:read",
    "reward:read",
    "reward:redeem",
    "challenge:read",
    "recognition:create",
    "leaderboard:read"
  ]
};
function isRole(value) {
  return typeof value === "string" && ROLES.includes(value);
}
function can(role, permission) {
  if (!isRole(role)) return false;
  const granted = MATRIX[role];
  if (granted === "*") return true;
  return granted.includes(permission);
}

function visibleMemberScope(subject, managedUserIds) {
  if (can(subject.role, "member:manage")) return null;
  if (can(subject.role, "member:read")) {
    return [.../* @__PURE__ */ new Set([subject.userId, ...managedUserIds])];
  }
  return [subject.userId];
}
function memberPermissions(subject, target, managedUserIds) {
  const isSelf = target.id === subject.userId;
  if (can(subject.role, "member:manage")) {
    return {
      canEdit: !isSelf,
      canChangeRole: !isSelf && target.role !== "OWNER",
      canRemove: !isSelf && target.role !== "OWNER"
    };
  }
  if (can(subject.role, "member:read") && managedUserIds.includes(target.id)) {
    return { canEdit: true, canChangeRole: false, canRemove: false };
  }
  return { canEdit: false, canChangeRole: false, canRemove: false };
}
function canEditTeam(subject, teamId, ledTeamIds2) {
  if (can(subject.role, "team:manage")) return true;
  if (can(subject.role, "team:manage:assigned")) return ledTeamIds2.includes(teamId);
  return false;
}
function maxAssignableRole(role) {
  if (role === "OWNER" || role === "ADMIN") return "ADMIN";
  return "EMPLOYEE";
}
function roleAtMost(role, max) {
  return ROLE_RANK[role] <= ROLE_RANK[max];
}
function canLeadRole(role) {
  return role === "OWNER" || role === "ADMIN" || role === "MANAGER";
}

const TASK_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "SUBMITTED",
  "NEEDS_REVISION",
  "APPROVED"
];
const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const ACTIVE_TASK_STATUSES = ["IN_PROGRESS", "NEEDS_REVISION"];
const CLOSED_TASK_STATUSES = ["APPROVED"];
const TASK_ACTIONS = [
  "start",
  "submit",
  "approve",
  "request_revision",
  "reopen"
];
const TASK_TRANSITIONS = [
  // The employee picks the task up, or picks it back up after a revision request.
  { action: "start", from: ["TODO", "NEEDS_REVISION"], to: "IN_PROGRESS", actor: "assignee" },
  // …and hands it in.
  { action: "submit", from: ["IN_PROGRESS"], to: "SUBMITTED", actor: "assignee" },
  // A reviewer accepts…
  { action: "approve", from: ["SUBMITTED"], to: "APPROVED", actor: "reviewer" },
  // …or sends it back with feedback.
  { action: "request_revision", from: ["SUBMITTED"], to: "NEEDS_REVISION", actor: "reviewer" },
  // A reviewer can pull a submission back to the board (mis-assignment, scope change).
  { action: "reopen", from: ["SUBMITTED", "NEEDS_REVISION"], to: "TODO", actor: "reviewer" }
];
function findTransition(action) {
  return TASK_TRANSITIONS.find((transition) => transition.action === action);
}
function nextStatus(status, action) {
  const transition = findTransition(action);
  if (!transition || !transition.from.includes(status)) return void 0;
  return transition.to;
}
function checkTransition(status, action, actor) {
  const transition = findTransition(action);
  if (!transition) return { allowed: false, reason: "UNKNOWN_ACTION" };
  if (!transition.from.includes(status)) return { allowed: false, reason: "INVALID_TRANSITION" };
  if (transition.actor === "assignee") {
    return actor.isAssignee ? { allowed: true } : { allowed: false, reason: "NOT_ASSIGNEE" };
  }
  if (!actor.canReview) return { allowed: false, reason: "NOT_REVIEWER" };
  if (actor.isAssignee) return { allowed: false, reason: "SELF_REVIEW" };
  return { allowed: true };
}
function isOverdue(task, now = /* @__PURE__ */ new Date()) {
  if (!task.dueDate) return false;
  if (CLOSED_TASK_STATUSES.includes(task.status)) return false;
  return new Date(task.dueDate).getTime() < now.getTime();
}
function completionRate(approved, total) {
  if (total <= 0) return 0;
  return Math.round(approved / total * 100);
}

function defaultMinXp(level) {
  return Math.max(0, level - 1) * 500;
}
function resolveLevel(xp, boundaries) {
  var _a;
  if (boundaries.length === 0) return Math.floor(xp / 500) + 1;
  let current = boundaries[0];
  for (const boundary of boundaries) {
    if (xp >= boundary.minXp) current = boundary;
    else break;
  }
  return (_a = current == null ? void 0 : current.level) != null ? _a : 1;
}
function computeLevelProgress(xp, boundaries) {
  var _a, _b, _c;
  const sorted = [...boundaries].sort((a, b) => a.minXp - b.minXp);
  const level = resolveLevel(xp, sorted);
  const current = sorted.find((b) => b.level === level);
  const next = sorted.find((b) => b.level === level + 1);
  const floor = (_a = current == null ? void 0 : current.minXp) != null ? _a : defaultMinXp(level);
  const ceiling = (_b = next == null ? void 0 : next.minXp) != null ? _b : floor + 500;
  const span = Math.max(1, ceiling - floor);
  const into = Math.max(0, xp - floor);
  return {
    level,
    currentXp: Math.min(into, span),
    neededXp: span,
    percent: Math.min(100, Math.round(into / span * 100)),
    title: (_c = current == null ? void 0 : current.title) != null ? _c : null
  };
}

function apiError(statusCode, code, message, data) {
  return createError({
    statusCode,
    statusMessage: code,
    message,
    data: { code, ...data }
  });
}
const errors = {
  unauthorized: (message = "\u0628\u0631\u0627\u06CC \u0627\u062F\u0627\u0645\u0647 \u0628\u0627\u06CC\u062F \u0648\u0627\u0631\u062F \u0634\u0648\u06CC\u062F") => apiError(401, "AUTH_REQUIRED", message),
  forbidden: (message = "\u062F\u0633\u062A\u0631\u0633\u06CC \u0644\u0627\u0632\u0645 \u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u0628\u062E\u0634 \u0631\u0627 \u0646\u062F\u0627\u0631\u06CC\u062F") => apiError(403, "FORBIDDEN", message),
  notFound: (message = "\u0645\u0648\u0631\u062F \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u06CC \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F") => apiError(404, "NOT_FOUND", message),
  conflict: (message = "\u0627\u06CC\u0646 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0628\u0627 \u0648\u0636\u0639\u06CC\u062A \u0641\u0639\u0644\u06CC \u0633\u0627\u0632\u06AF\u0627\u0631 \u0646\u06CC\u0633\u062A") => apiError(409, "CONFLICT", message),
  tooManyRequests: (message = "\u06A9\u0645\u06CC \u0628\u0639\u062F \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F") => apiError(429, "RATE_LIMITED", message),
  serviceUnavailable: (message = "\u0633\u0631\u0648\u06CC\u0633 \u0645\u0648\u0642\u062A\u0627 \u062F\u0631 \u062F\u0633\u062A\u0631\u0633 \u0646\u06CC\u0633\u062A") => apiError(503, "SERVICE_UNAVAILABLE", message),
  badRequest: (code, message) => apiError(400, code, message)
};
async function readValidated(event, schema) {
  const body = await readBody(event).catch(() => ({}));
  return parseWithSchema(body, schema);
}
function readValidatedQuery(event, schema) {
  return parseWithSchema(getQuery$1(event), schema);
}
function parseWithSchema(input, schema) {
  const result = schema.safeParse(input);
  if (result.success) return result.data;
  const issues = result.error.issues.map((issue) => ({
    path: issue.path.join(".") || "_",
    message: issue.message
  }));
  throw apiError(422, "VALIDATION_FAILED", "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A", { issues });
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : "undefined" !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

const require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(dist);

const require$$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_path);

const require$$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_fs);

const require$$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_async_hooks);

const require$$4 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_events);

const require$$5 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_os);

const require$$6 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_crypto);

var pu=Object.create;var xr=Object.defineProperty;var du=Object.getOwnPropertyDescriptor;var mu=Object.getOwnPropertyNames;var fu=Object.getPrototypeOf,gu=Object.prototype.hasOwnProperty;var eo=(e,t)=>()=>(e&&(t=e(e=0)),t);var at=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),lt=(e,t)=>{for(var r in t)xr(e,r,{get:t[r],enumerable:true});},to=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of mu(t))!gu.call(e,i)&&i!==r&&xr(e,i,{get:()=>t[i],enumerable:!(n=du(t,i))||n.enumerable});return e};var Pe=(e,t,r)=>(r=e!=null?pu(fu(e)):{},to(t||!e||!e.__esModule?xr(r,"default",{value:e,enumerable:true}):r,e)),yu=e=>to(xr({},"__esModule",{value:true}),e);var ho=at((Rf,Lu)=>{Lu.exports={name:"@prisma/engines-version",version:"7.10.0-4.0edf323efd1d98336f3f0a68684b56f689b900d3",main:"index.js",types:"index.d.ts",license:"Apache-2.0",author:"Tim Suchanek <suchanek@prisma.io>",prisma:{enginesVersion:"0edf323efd1d98336f3f0a68684b56f689b900d3"},repository:{type:"git",url:"https://github.com/prisma/engines-wrapper.git",directory:"packages/engines-version"},devDependencies:{"@types/node":"18.19.76",typescript:"4.9.5"},files:["index.js","index.d.ts"],scripts:{build:"tsc -d"}};});var wo=at(Pr=>{Object.defineProperty(Pr,"__esModule",{value:true});Pr.enginesVersion=void 0;Pr.enginesVersion=ho().prisma.enginesVersion;});var bo=at((If,xo)=>{xo.exports=e=>{let t=e.match(/^[ \t]*(?=\S)/gm);return t?t.reduce((r,n)=>Math.min(r,n.length),1/0):0};});var So=at((Nf,vo)=>{vo.exports=(e,t=1,r)=>{if(r={indent:" ",includeEmptyLines:false,...r},typeof e!="string")throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof e}\``);if(typeof t!="number")throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof t}\``);if(typeof r.indent!="string")throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof r.indent}\``);if(t===0)return e;let n=r.includeEmptyLines?/^/gm:/^(?!\s*$)/gm;return e.replace(n,r.indent.repeat(t))};});var Ro=at((Lf,Tr)=>{Tr.exports=(e={})=>{let t;if(e.repoUrl)t=e.repoUrl;else if(e.user&&e.repo)t=`https://github.com/${e.user}/${e.repo}`;else throw new Error("You need to specify either the `repoUrl` option or both the `user` and `repo` options");let r=new URL(`${t}/issues/new`),n=["body","title","labels","template","milestone","assignee","projects"];for(let i of n){let o=e[i];if(o!==void 0){if(i==="labels"||i==="projects"){if(!Array.isArray(o))throw new TypeError(`The \`${i}\` option should be an array`);o=o.join(",");}r.searchParams.set(i,o);}}return r.toString()};Tr.exports.default=Tr.exports;});var qn=at((Ig,Fo)=>{Fo.exports=function(){function e(t,r,n,i,o){return t<r||n<r?t>n?n+1:t+1:i===o?r:r+1}return function(t,r){if(t===r)return 0;if(t.length>r.length){var n=t;t=r,r=n;}for(var i=t.length,o=r.length;i>0&&t.charCodeAt(i-1)===r.charCodeAt(o-1);)i--,o--;for(var s=0;s<i&&t.charCodeAt(s)===r.charCodeAt(s);)s++;if(i-=s,o-=s,i===0||o<3)return o;var a=0,u,m,P,T,S,I,A,M,L,q,E,D,H=[];for(u=0;u<i;u++)H.push(u+1),H.push(t.charCodeAt(s+u));for(var ce=H.length-1;a<o-3;)for(L=r.charCodeAt(s+(m=a)),q=r.charCodeAt(s+(P=a+1)),E=r.charCodeAt(s+(T=a+2)),D=r.charCodeAt(s+(S=a+3)),I=a+=4,u=0;u<ce;u+=2)A=H[u],M=H[u+1],m=e(A,m,P,L,M),P=e(m,P,T,q,M),T=e(P,T,S,E,M),I=e(T,S,I,D,M),H[u]=I,S=T,T=P,P=m,m=A;for(;a<o;)for(L=r.charCodeAt(s+(m=a)),I=++a,u=0;u<ce;u+=2)A=H[u],H[u]=I=e(A,m,I,L,H[u+1]),m=A;return I}}();});var qo=eo(()=>{});var Uo=eo(()=>{});var Hm={};lt(Hm,{AnyNull:()=>ee.AnyNull,DMMF:()=>Qt,DbNull:()=>ee.DbNull,Debug:()=>K,Decimal:()=>cu.Decimal,Extensions:()=>Rn,JsonNull:()=>ee.JsonNull,NullTypes:()=>ee.NullTypes,ObjectEnumValue:()=>ee.ObjectEnumValue,PrismaClientInitializationError:()=>_.PrismaClientInitializationError,PrismaClientKnownRequestError:()=>_.PrismaClientKnownRequestError,PrismaClientRustPanicError:()=>_.PrismaClientRustPanicError,PrismaClientUnknownRequestError:()=>_.PrismaClientUnknownRequestError,PrismaClientValidationError:()=>_.PrismaClientValidationError,Public:()=>Cn,Sql:()=>Fe.Sql,createParam:()=>os,defineDmmfProperty:()=>ps,deserializeJsonObject:()=>Ae,deserializeRawResult:()=>Tn,dmmfToRuntimeDataModel:()=>so,empty:()=>Fe.empty,getPrismaClient:()=>au,getRuntime:()=>uu,isAnyNull:()=>ee.isAnyNull,isDbNull:()=>ee.isDbNull,isJsonNull:()=>ee.isJsonNull,isObjectEnumValue:()=>ee.isObjectEnumValue,join:()=>Fe.join,makeStrictEnum:()=>lu,makeTypedQueryFactory:()=>ds,raw:()=>Fe.raw,serializeJsonQuery:()=>Vr,skip:()=>Lr,sqltag:()=>Fe.sql,warnOnce:()=>Vn});var client=yu(Hm);var Rn={};lt(Rn,{defineExtension:()=>ro,getExtensionContext:()=>no});function ro(e){return typeof e=="function"?e:t=>t.$extends(e)}function no(e){return e}var Cn={};lt(Cn,{validator:()=>io});function io(...e){return t=>t}var Ie=class{_map=new Map;get(t){return this._map.get(t)?.value}set(t,r){this._map.set(t,{value:r});}getOrCreate(t,r){let n=this._map.get(t);if(n)return n.value;let i=r();return this.set(t,i),i}};function qe(e){return e.substring(0,1).toLowerCase()+e.substring(1)}function oo(e,t){let r={};for(let n of e){let i=n[t];r[i]=n;}return r}function Nt(e){let t;return {get(){return t||(t={value:e()}),t.value}}}function so(e){return {models:In(e.models),enums:In(e.enums),types:In(e.types)}}function In(e){let t={};for(let{name:r,...n}of e)t[r]=n;return t}var as=require$$0;var br={};lt(br,{$:()=>po,bgBlack:()=>Au,bgBlue:()=>ku,bgCyan:()=>Nu,bgGreen:()=>Cu,bgMagenta:()=>Ou,bgRed:()=>Ru,bgWhite:()=>Du,bgYellow:()=>Iu,black:()=>Eu,blue:()=>He,bold:()=>Ee,cyan:()=>_e,dim:()=>Dt,gray:()=>$t,green:()=>Ft,grey:()=>Su,hidden:()=>bu,inverse:()=>xu,italic:()=>wu,magenta:()=>Tu,red:()=>ze,reset:()=>hu,strikethrough:()=>Pu,underline:()=>Mt,white:()=>vu,yellow:()=>_t});var kn,ao,lo,uo,co=true;typeof process<"u"&&({FORCE_COLOR:kn,NODE_DISABLE_COLORS:ao,NO_COLOR:lo,TERM:uo}=process.env||{},co=process.stdout&&process.stdout.isTTY);var po={enabled:!ao&&lo==null&&uo!=="dumb"&&(kn!=null&&kn!=="0"||co)};function B(e,t){let r=new RegExp(`\\x1b\\[${t}m`,"g"),n=`\x1B[${e}m`,i=`\x1B[${t}m`;return function(o){return !po.enabled||o==null?o:n+(~(""+o).indexOf(i)?o.replace(r,i+n):o)+i}}var hu=B(0,0),Ee=B(1,22),Dt=B(2,22),wu=B(3,23),Mt=B(4,24),xu=B(7,27),bu=B(8,28),Pu=B(9,29),Eu=B(30,39),ze=B(31,39),Ft=B(32,39),_t=B(33,39),He=B(34,39),Tu=B(35,39),_e=B(36,39),vu=B(37,39),$t=B(90,39),Su=B(90,39),Au=B(40,49),Ru=B(41,49),Cu=B(42,49),Iu=B(43,49),ku=B(44,49),Ou=B(45,49),Nu=B(46,49),Du=B(47,49);var Mu=100,mo=["green","yellow","blue","magenta","cyan","red"],Lt=[],fo=Date.now(),Fu=0,On=typeof process<"u"?process.env:{};globalThis.DEBUG??=On.DEBUG??"";globalThis.DEBUG_COLORS??=On.DEBUG_COLORS?On.DEBUG_COLORS==="true":true;var Vt={enable(e){typeof e=="string"&&(globalThis.DEBUG=e);},disable(){let e=globalThis.DEBUG;return globalThis.DEBUG="",e},enabled(e){let t=globalThis.DEBUG.split(",").map(i=>i.replace(/[.+?^${}()|[\]\\]/g,"\\$&")),r=t.some(i=>i===""||i[0]==="-"?false:e.match(RegExp(i.split("*").join(".*")+"$"))),n=t.some(i=>i===""||i[0]!=="-"?false:e.match(RegExp(i.slice(1).split("*").join(".*")+"$")));return r&&!n},log:(...e)=>{let[t,r,...n]=e;(console.warn??console.log)(`${t} ${r}`,...n);},formatters:{}};function _u(e){let t={color:mo[Fu++%mo.length],enabled:Vt.enabled(e),namespace:e,log:Vt.log,extend:()=>{}},r=(...n)=>{let{enabled:i,namespace:o,color:s,log:a}=t;if(n.length!==0&&Lt.push([o,...n]),Lt.length>Mu&&Lt.shift(),Vt.enabled(o)||i){let u=n.map(P=>typeof P=="string"?P:$u(P)),m=`+${Date.now()-fo}ms`;fo=Date.now(),globalThis.DEBUG_COLORS?a(br[s](Ee(o)),...u,br[s](m)):a(o,...u,m);}};return new Proxy(r,{get:(n,i)=>t[i],set:(n,i,o)=>t[i]=o})}var K=new Proxy(_u,{get:(e,t)=>Vt[t],set:(e,t,r)=>Vt[t]=r});function $u(e,t=2){let r=new Set;return JSON.stringify(e,(n,i)=>{if(typeof i=="object"&&i!==null){if(r.has(i))return "[Circular *]";r.add(i);}else if(typeof i=="bigint")return i.toString();return i},t)}function go(e=7500){let t=Lt.map(([r,...n])=>`${r} ${n.map(i=>typeof i=="string"?i:JSON.stringify(i)).join(" ")}`).join(`
`);return t.length<e?t:t.slice(-e)}function yo(){Lt.length=0;}function $e(e,t){throw new Error(t)}var Po=Pe(bo(),1);function Nn(e){let t=(0, Po.default)(e);if(t===0)return e;let r=new RegExp(`^[ \\t]{${t}}`,"gm");return e.replace(r,"")}var Eo="prisma+postgres",Er=`${Eo}:`;function To(e){return e?.toString().startsWith(`${Er}//`)??false}function Dn(e){if(!To(e))return  false;let{host:t}=new URL(e);return t.includes("localhost")||t.includes("127.0.0.1")||t.includes("[::1]")}var Ut={};lt(Ut,{error:()=>Uu,info:()=>qu,log:()=>Vu,query:()=>ju,should:()=>Ao,tags:()=>qt,warn:()=>Mn});var qt={error:ze("prisma:error"),warn:_t("prisma:warn"),info:_e("prisma:info"),query:He("prisma:query")},Ao={warn:()=>!process.env.PRISMA_DISABLE_WARNINGS};function Vu(...e){console.log(...e);}function Mn(e,...t){Ao.warn()&&console.warn(`${qt.warn} ${e}`,...t);}function qu(e,...t){console.info(`${qt.info} ${e}`,...t);}function Uu(e,...t){console.error(`${qt.error} ${e}`,...t);}function ju(e,...t){console.log(`${qt.query} ${e}`,...t);}function Fn({onlyFirst:e=false}={}){let r=["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))","(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");return new RegExp(r,e?void 0:"g")}var Bu=Fn();function ut(e){if(typeof e!="string")throw new TypeError(`Expected a \`string\`, got \`${typeof e}\``);return e.replace(Bu,"")}var jt=Pe(require$$1);function _n(e){return jt.default.sep===jt.default.posix.sep?e:e.split(jt.default.sep).join(jt.default.posix.sep)}function $n(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function vr(e,t){let r={};for(let n of Object.keys(e))r[n]=t(e[n],n);return r}function Ln(e,t){if(e.length===0)return;let r=e[0];for(let n=1;n<e.length;n++)t(r,e[n])<0&&(r=e[n]);return r}function Bt(e,t){Object.defineProperty(e,"name",{value:t,configurable:true});}var Co=new Set,Vn=(e,t,...r)=>{Co.has(e)||(Co.add(e),Mn(t,...r));};function ct(e){return e instanceof Date||Object.prototype.toString.call(e)==="[object Date]"}function pt(e){return e.toString()!=="Invalid Date"}var Io=require$$0;function dt(e){return Io.Decimal.isDecimal(e)?true:e!==null&&typeof e=="object"&&typeof e.s=="number"&&typeof e.e=="number"&&typeof e.toFixed=="function"&&Array.isArray(e.d)}var Yo=require$$0;var Qt={};lt(Qt,{ModelAction:()=>mt,datamodelEnumToSchemaEnum:()=>Qu});function Qu(e){return {name:e.name,values:e.values.map(t=>t.name)}}var mt=(D=>(D.findUnique="findUnique",D.findUniqueOrThrow="findUniqueOrThrow",D.findFirst="findFirst",D.findFirstOrThrow="findFirstOrThrow",D.findMany="findMany",D.create="create",D.createMany="createMany",D.createManyAndReturn="createManyAndReturn",D.update="update",D.updateMany="updateMany",D.updateManyAndReturn="updateManyAndReturn",D.upsert="upsert",D.delete="delete",D.deleteMany="deleteMany",D.groupBy="groupBy",D.count="count",D.aggregate="aggregate",D.findRaw="findRaw",D.aggregateRaw="aggregateRaw",D))(mt||{});var Mo=Pe(So());var Do=Pe(require$$2);var ko={keyword:_e,entity:_e,value:e=>Ee(He(e)),punctuation:He,directive:_e,function:_e,variable:e=>Ee(He(e)),string:e=>Ee(Ft(e)),boolean:_t,number:_e,comment:$t};var Ju=e=>e,Sr={},Gu=0,O={manual:Sr.Prism&&Sr.Prism.manual,disableWorkerMessageHandler:Sr.Prism&&Sr.Prism.disableWorkerMessageHandler,util:{encode:function(e){if(e instanceof Te){let t=e;return new Te(t.type,O.util.encode(t.content),t.alias)}else return Array.isArray(e)?e.map(O.util.encode):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++Gu}),e.__id},clone:function e(t,r){let n,i,o=O.util.type(t);switch(r=r||{},o){case "Object":if(i=O.util.objId(t),r[i])return r[i];n={},r[i]=n;for(let s in t)t.hasOwnProperty(s)&&(n[s]=e(t[s],r));return n;case "Array":return i=O.util.objId(t),r[i]?r[i]:(n=[],r[i]=n,t.forEach(function(s,a){n[a]=e(s,r);}),n);default:return t}}},languages:{extend:function(e,t){let r=O.util.clone(O.languages[e]);for(let n in t)r[n]=t[n];return r},insertBefore:function(e,t,r,n){n=n||O.languages;let i=n[e],o={};for(let a in i)if(i.hasOwnProperty(a)){if(a==t)for(let u in r)r.hasOwnProperty(u)&&(o[u]=r[u]);r.hasOwnProperty(a)||(o[a]=i[a]);}let s=n[e];return n[e]=o,O.languages.DFS(O.languages,function(a,u){u===s&&a!=e&&(this[a]=o);}),o},DFS:function e(t,r,n,i){i=i||{};let o=O.util.objId;for(let s in t)if(t.hasOwnProperty(s)){r.call(t,s,t[s],n||s);let a=t[s],u=O.util.type(a);u==="Object"&&!i[o(a)]?(i[o(a)]=true,e(a,r,null,i)):u==="Array"&&!i[o(a)]&&(i[o(a)]=true,e(a,r,s,i));}}},plugins:{},highlight:function(e,t,r){let n={code:e,grammar:t,language:r};return O.hooks.run("before-tokenize",n),n.tokens=O.tokenize(n.code,n.grammar),O.hooks.run("after-tokenize",n),Te.stringify(O.util.encode(n.tokens),n.language)},matchGrammar:function(e,t,r,n,i,o,s){for(let M in r){if(!r.hasOwnProperty(M)||!r[M])continue;if(M==s)return;let L=r[M];L=O.util.type(L)==="Array"?L:[L];for(let q=0;q<L.length;++q){let E=L[q],D=E.inside,H=!!E.lookbehind,ce=!!E.greedy,ie=0,be=E.alias;if(ce&&!E.pattern.global){let l=E.pattern.toString().match(/[imuy]*$/)[0];E.pattern=RegExp(E.pattern.source,l+"g");}E=E.pattern||E;for(let l=n,c=i;l<t.length;c+=t[l].length,++l){let p=t[l];if(t.length>e.length)return;if(p instanceof Te)continue;if(ce&&l!=t.length-1){E.lastIndex=c;var T=E.exec(e);if(!T)break;var P=T.index+(H?T[1].length:0),S=T.index+T[0].length,a=l,u=c;for(let g=t.length;a<g&&(u<S||!t[a].type&&!t[a-1].greedy);++a)u+=t[a].length,P>=u&&(++l,c=u);if(t[l]instanceof Te)continue;m=a-l,p=e.slice(c,u),T.index-=c;}else {E.lastIndex=0;var T=E.exec(p),m=1;}if(!T){if(o)break;continue}H&&(ie=T[1]?T[1].length:0);var P=T.index+ie,T=T[0].slice(ie),S=P+T.length,I=p.slice(0,P),A=p.slice(S);let h=[l,m];I&&(++l,c+=I.length,h.push(I));let f=new Te(M,D?O.tokenize(T,D):T,be,T,ce);if(h.push(f),A&&h.push(A),Array.prototype.splice.apply(t,h),m!=1&&O.matchGrammar(e,t,r,l,c,true,M),o)break}}}},tokenize:function(e,t){let r=[e],n=t.rest;if(n){for(let i in n)t[i]=n[i];delete t.rest;}return O.matchGrammar(e,r,t,0,0,false),r},hooks:{all:{},add:function(e,t){let r=O.hooks.all;r[e]=r[e]||[],r[e].push(t);},run:function(e,t){let r=O.hooks.all[e];if(!(!r||!r.length))for(var n=0,i;i=r[n++];)i(t);}},Token:Te};O.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:true},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:true,greedy:true}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:true},"class-name":{pattern:/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,lookbehind:true,inside:{punctuation:/[.\\]/}},keyword:/\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,boolean:/\b(?:true|false)\b/,function:/\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,punctuation:/[{}[\];(),.:]/};O.languages.javascript=O.languages.extend("clike",{"class-name":[O.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,lookbehind:true}],keyword:[{pattern:/((?:^|})\s*)(?:catch|finally)\b/,lookbehind:true},{pattern:/(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:true}],number:/\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,function:/[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,operator:/-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/});O.languages.javascript["class-name"][0].pattern=/(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;O.languages.insertBefore("javascript","keyword",{regex:{pattern:/((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,lookbehind:true,greedy:true},"function-variable":{pattern:/[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,lookbehind:true,inside:O.languages.javascript},{pattern:/[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,inside:O.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,lookbehind:true,inside:O.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,lookbehind:true,inside:O.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/});O.languages.markup&&O.languages.markup.tag.addInlined("script","javascript");O.languages.js=O.languages.javascript;O.languages.typescript=O.languages.extend("javascript",{keyword:/\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,builtin:/\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/});O.languages.ts=O.languages.typescript;function Te(e,t,r,n,i){this.type=e,this.content=t,this.alias=r,this.length=(n||"").length|0,this.greedy=!!i;}Te.stringify=function(e,t){return typeof e=="string"?e:Array.isArray(e)?e.map(function(r){return Te.stringify(r,t)}).join(""):zu(e.type)(e.content)};function zu(e){return ko[e]||Ju}function Oo(e){return Hu(e,O.languages.javascript)}function Hu(e,t){return O.tokenize(e,t).map(n=>Te.stringify(n)).join("")}function No(e){return Nn(e)}var Ar=class e{firstLineNumber;lines;static read(t){let r;try{r=Do.default.readFileSync(t,"utf-8");}catch{return null}return e.fromContent(r)}static fromContent(t){let r=t.split(/\r?\n/);return new e(1,r)}constructor(t,r){this.firstLineNumber=t,this.lines=r;}get lastLineNumber(){return this.firstLineNumber+this.lines.length-1}mapLineAt(t,r){if(t<this.firstLineNumber||t>this.lastLineNumber)return this;let n=t-this.firstLineNumber,i=[...this.lines];return i[n]=r(i[n]),new e(this.firstLineNumber,i)}mapLines(t){return new e(this.firstLineNumber,this.lines.map((r,n)=>t(r,this.firstLineNumber+n)))}lineAt(t){return this.lines[t-this.firstLineNumber]}prependSymbolAt(t,r){return this.mapLines((n,i)=>i===t?`${r} ${n}`:`  ${n}`)}slice(t,r){let n=Math.max(t,this.firstLineNumber),i=Math.min(r,this.lastLineNumber);if(n>i)return new e(t,[]);let o=this.lines.slice(n-this.firstLineNumber,i-this.firstLineNumber+1).join(`
`);return new e(n,No(o).split(`
`))}highlight(){let t=Oo(this.toString());return new e(this.firstLineNumber,t.split(`
`))}toString(){return this.lines.join(`
`)}};var Wu={red:ze,gray:$t,dim:Dt,bold:Ee,underline:Mt,highlightSource:e=>e.highlight()},Ku={red:e=>e,gray:e=>e,dim:e=>e,bold:e=>e,underline:e=>e,highlightSource:e=>e};function Zu({message:e,originalMethod:t,isPanic:r,callArguments:n}){return {functionName:`prisma.${t}()`,message:e,isPanic:r??false,callArguments:n}}function Xu({callsite:e,message:t,originalMethod:r,isPanic:n,callArguments:i},o){let s=Zu({message:t,originalMethod:r,isPanic:n,callArguments:i});if(!e||"undefined"<"u"||"development"==="production")return s;let a=e.getLocation();if(!a||!a.lineNumber||!a.columnNumber)return s;let u=Math.max(1,a.lineNumber-3),m=Ar.read(a.fileName)?.slice(u,a.lineNumber),P=m?.lineAt(a.lineNumber);if(m&&P){let T=ec(P),S=Yu(P);if(!S)return s;s.functionName=`${S.code})`,s.location=a,n||(m=m.mapLineAt(a.lineNumber,A=>A.slice(0,S.openingBraceIndex))),m=o.highlightSource(m);let I=String(m.lastLineNumber).length;if(s.contextLines=m.mapLines((A,M)=>o.gray(String(M).padStart(I))+" "+A).mapLines(A=>o.dim(A)).prependSymbolAt(a.lineNumber,o.bold(o.red("\u2192"))),i){let A=T+I+1;A+=2,s.callArguments=(0, Mo.default)(i,A).slice(A);}}return s}function Yu(e){let t=Object.keys(mt).join("|"),n=new RegExp(String.raw`\.(${t})\(`).exec(e);if(n){let i=n.index+n[0].length,o=e.lastIndexOf(" ",n.index)+1;return {code:e.slice(o,i),openingBraceIndex:i}}return null}function ec(e){let t=0;for(let r=0;r<e.length;r++){if(e.charAt(r)!==" ")return t;t++;}return t}function tc({functionName:e,location:t,message:r,isPanic:n,contextLines:i,callArguments:o},s){let a=[""],u=t?" in":":";if(n?(a.push(s.red(`Oops, an unknown error occurred! This is ${s.bold("on us")}, you did nothing wrong.`)),a.push(s.red(`It occurred in the ${s.bold(`\`${e}\``)} invocation${u}`))):a.push(s.red(`Invalid ${s.bold(`\`${e}\``)} invocation${u}`)),t&&a.push(s.underline(rc(t))),i){a.push("");let m=[i.toString()];o&&(m.push(o),m.push(s.dim(")"))),a.push(m.join("")),o&&a.push("");}else a.push(""),o&&a.push(o),a.push("");return a.push(r),a.join(`
`)}function rc(e){let t=[e.fileName];return e.lineNumber&&t.push(String(e.lineNumber)),e.columnNumber&&t.push(String(e.columnNumber)),t.join(":")}function Rr(e){let t=e.showColors?Wu:Ku,r;return r=Xu(e,t),tc(r,t)}var Bo=Pe(qn());function Lo(e,t,r){let n=Vo(e),i=nc(n),o=oc(i);o?Cr(o,t,r):t.addErrorMessage(()=>"Unknown error");}function Vo(e){return e.errors.flatMap(t=>t.kind==="Union"?Vo(t):[t])}function nc(e){let t=new Map,r=[];for(let n of e){if(n.kind!=="InvalidArgumentType"){r.push(n);continue}let i=`${n.selectionPath.join(".")}:${n.argumentPath.join(".")}`,o=t.get(i);o?t.set(i,{...n,argument:{...n.argument,typeNames:ic(o.argument.typeNames,n.argument.typeNames)}}):t.set(i,n);}return r.push(...t.values()),r}function ic(e,t){return [...new Set(e.concat(t))]}function oc(e){return Ln(e,(t,r)=>{let n=_o(t),i=_o(r);return n!==i?n-i:$o(t)-$o(r)})}function _o(e){let t=0;return Array.isArray(e.selectionPath)&&(t+=e.selectionPath.length),Array.isArray(e.argumentPath)&&(t+=e.argumentPath.length),t}function $o(e){switch(e.kind){case "InvalidArgumentValue":case "ValueTooLarge":return 20;case "InvalidArgumentType":return 10;case "RequiredArgumentMissing":return  -10;default:return 0}}var pe=class{constructor(t,r){this.name=t;this.value=r;}isRequired=false;makeRequired(){return this.isRequired=true,this}write(t){let{colors:{green:r}}=t.context;t.addMarginSymbol(r(this.isRequired?"+":"?")),t.write(r(this.name)),this.isRequired||t.write(r("?")),t.write(r(": ")),typeof this.value=="string"?t.write(r(this.value)):t.write(this.value);}};Uo();var ft=class{constructor(t=0,r){this.context=r;this.currentIndent=t;}lines=[];currentLine="";currentIndent=0;marginSymbol;afterNextNewLineCallback;write(t){return typeof t=="string"?this.currentLine+=t:t.write(this),this}writeJoined(t,r,n=(i,o)=>o.write(i)){let i=r.length-1;for(let o=0;o<r.length;o++)n(r[o],this),o!==i&&this.write(t);return this}writeLine(t){return this.write(t).newLine()}newLine(){this.lines.push(this.indentedCurrentLine()),this.currentLine="",this.marginSymbol=void 0;let t=this.afterNextNewLineCallback;return this.afterNextNewLineCallback=void 0,t?.(),this}withIndent(t){return this.indent(),t(this),this.unindent(),this}afterNextNewline(t){return this.afterNextNewLineCallback=t,this}indent(){return this.currentIndent++,this}unindent(){return this.currentIndent>0&&this.currentIndent--,this}addMarginSymbol(t){return this.marginSymbol=t,this}toString(){return this.lines.concat(this.indentedCurrentLine()).join(`
`)}getCurrentLineLength(){return this.currentLine.length}indentedCurrentLine(){let t=this.currentLine.padStart(this.currentLine.length+2*this.currentIndent);return this.marginSymbol?this.marginSymbol+t.slice(1):t}};qo();var Ir=class{constructor(t){this.value=t;}write(t){t.write(this.value);}markAsError(){this.value.markAsError();}};var kr=e=>e,Or={bold:kr,red:kr,green:kr,dim:kr,enabled:false},jo={bold:Ee,red:ze,green:Ft,dim:Dt,enabled:true},gt={write(e){e.writeLine(",");}};var ke=class{constructor(t){this.contents=t;}isUnderlined=false;color=t=>t;underline(){return this.isUnderlined=true,this}setColor(t){return this.color=t,this}write(t){let r=t.getCurrentLineLength();t.write(this.color(this.contents)),this.isUnderlined&&t.afterNextNewline(()=>{t.write(" ".repeat(r)).writeLine(this.color("~".repeat(this.contents.length)));});}};var Ue=class{hasError=false;markAsError(){return this.hasError=true,this}};var yt=class extends Ue{items=[];addItem(t){return this.items.push(new Ir(t)),this}getField(t){return this.items[t]}getPrintWidth(){return this.items.length===0?2:Math.max(...this.items.map(r=>r.value.getPrintWidth()))+2}write(t){if(this.items.length===0){this.writeEmpty(t);return}this.writeWithItems(t);}writeEmpty(t){let r=new ke("[]");this.hasError&&r.setColor(t.context.colors.red).underline(),t.write(r);}writeWithItems(t){let{colors:r}=t.context;t.writeLine("[").withIndent(()=>t.writeJoined(gt,this.items).newLine()).write("]"),this.hasError&&t.afterNextNewline(()=>{t.writeLine(r.red("~".repeat(this.getPrintWidth())));});}asObject(){}};var ht=class e extends Ue{fields={};suggestions=[];addField(t){this.fields[t.name]=t;}addSuggestion(t){this.suggestions.push(t);}getField(t){return this.fields[t]}getDeepField(t){let[r,...n]=t,i=this.getField(r);if(!i)return;let o=i;for(let s of n){let a;if(o.value instanceof e?a=o.value.getField(s):o.value instanceof yt&&(a=o.value.getField(Number(s))),!a)return;o=a;}return o}getDeepFieldValue(t){return t.length===0?this:this.getDeepField(t)?.value}hasField(t){return !!this.getField(t)}removeAllFields(){this.fields={};}removeField(t){delete this.fields[t];}getFields(){return this.fields}isEmpty(){return Object.keys(this.fields).length===0}getFieldValue(t){return this.getField(t)?.value}getDeepSubSelectionValue(t){let r=this;for(let n of t){if(!(r instanceof e))return;let i=r.getSubSelectionValue(n);if(!i)return;r=i;}return r}getDeepSelectionParent(t){let r=this.getSelectionParent();if(!r)return;let n=r;for(let i of t){let o=n.value.getFieldValue(i);if(!o||!(o instanceof e))return;let s=o.getSelectionParent();if(!s)return;n=s;}return n}getSelectionParent(){let t=this.getField("select")?.value.asObject();if(t)return {kind:"select",value:t};let r=this.getField("include")?.value.asObject();if(r)return {kind:"include",value:r}}getSubSelectionValue(t){return this.getSelectionParent()?.value.fields[t].value}getPrintWidth(){let t=Object.values(this.fields);return t.length==0?2:Math.max(...t.map(n=>n.getPrintWidth()))+2}write(t){let r=Object.values(this.fields);if(r.length===0&&this.suggestions.length===0){this.writeEmpty(t);return}this.writeWithContents(t,r);}asObject(){return this}writeEmpty(t){let r=new ke("{}");this.hasError&&r.setColor(t.context.colors.red).underline(),t.write(r);}writeWithContents(t,r){t.writeLine("{").withIndent(()=>{t.writeJoined(gt,[...r,...this.suggestions]).newLine();}),t.write("}"),this.hasError&&t.afterNextNewline(()=>{t.writeLine(t.context.colors.red("~".repeat(this.getPrintWidth())));});}};var Z=class extends Ue{constructor(r){super();this.text=r;}getPrintWidth(){return this.text.length}write(r){let n=new ke(this.text);this.hasError&&n.underline().setColor(r.context.colors.red),r.write(n);}asObject(){}};var Jt=class{fields=[];addField(t,r){return this.fields.push({write(n){let{green:i,dim:o}=n.context.colors;n.write(i(o(`${t}: ${r}`))).addMarginSymbol(i(o("+")));}}),this}write(t){let{colors:{green:r}}=t.context;t.writeLine(r("{")).withIndent(()=>{t.writeJoined(gt,this.fields).newLine();}).write(r("}")).addMarginSymbol(r("+"));}};function Cr(e,t,r){switch(e.kind){case "MutuallyExclusiveFields":sc(e,t);break;case "IncludeOnScalar":ac(e,t);break;case "EmptySelection":lc(e,t,r);break;case "UnknownSelectionField":dc(e,t);break;case "InvalidSelectionValue":mc(e,t);break;case "UnknownArgument":fc(e,t);break;case "UnknownInputField":gc(e,t);break;case "RequiredArgumentMissing":yc(e,t);break;case "InvalidArgumentType":hc(e,t);break;case "InvalidArgumentValue":wc(e,t);break;case "ValueTooLarge":xc(e,t);break;case "SomeFieldsMissing":bc(e,t);break;case "TooManyFieldsGiven":Pc(e,t);break;case "Union":Lo(e,t,r);break;default:throw new Error("not implemented: "+e.kind)}}function sc(e,t){let r=t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();r&&(r.getField(e.firstField)?.markAsError(),r.getField(e.secondField)?.markAsError()),t.addErrorMessage(n=>`Please ${n.bold("either")} use ${n.green(`\`${e.firstField}\``)} or ${n.green(`\`${e.secondField}\``)}, but ${n.red("not both")} at the same time.`);}function ac(e,t){let[r,n]=wt(e.selectionPath),i=e.outputType,o=t.arguments.getDeepSelectionParent(r)?.value;if(o&&(o.getField(n)?.markAsError(),i))for(let s of i.fields)s.isRelation&&o.addSuggestion(new pe(s.name,"true"));t.addErrorMessage(s=>{let a=`Invalid scalar field ${s.red(`\`${n}\``)} for ${s.bold("include")} statement`;return i?a+=` on model ${s.bold(i.name)}. ${Gt(s)}`:a+=".",a+=`
Note that ${s.bold("include")} statements only accept relation fields.`,a});}function lc(e,t,r){let n=t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();if(n){let i=n.getField("omit")?.value.asObject();if(i){uc(e,t,i);return}if(n.hasField("select")){cc(e,t);return}}if(r?.[qe(e.outputType.name)]){pc(e,t);return}t.addErrorMessage(()=>`Unknown field at "${e.selectionPath.join(".")} selection"`);}function uc(e,t,r){r.removeAllFields();for(let n of e.outputType.fields)r.addSuggestion(new pe(n.name,"false"));t.addErrorMessage(n=>`The ${n.red("omit")} statement includes every field of the model ${n.bold(e.outputType.name)}. At least one field must be included in the result`);}function cc(e,t){let r=e.outputType,n=t.arguments.getDeepSelectionParent(e.selectionPath)?.value,i=n?.isEmpty()??false;n&&(n.removeAllFields(),Go(n,r)),t.addErrorMessage(o=>i?`The ${o.red("`select`")} statement for type ${o.bold(r.name)} must not be empty. ${Gt(o)}`:`The ${o.red("`select`")} statement for type ${o.bold(r.name)} needs ${o.bold("at least one truthy value")}.`);}function pc(e,t){let r=new Jt;for(let i of e.outputType.fields)i.isRelation||r.addField(i.name,"false");let n=new pe("omit",r).makeRequired();if(e.selectionPath.length===0)t.arguments.addSuggestion(n);else {let[i,o]=wt(e.selectionPath),a=t.arguments.getDeepSelectionParent(i)?.value.asObject()?.getField(o);if(a){let u=a?.value.asObject()??new ht;u.addSuggestion(n),a.value=u;}}t.addErrorMessage(i=>`The global ${i.red("omit")} configuration excludes every field of the model ${i.bold(e.outputType.name)}. At least one field must be included in the result`);}function dc(e,t){let r=zo(e.selectionPath,t);if(r.parentKind!=="unknown"){r.field.markAsError();let n=r.parent;switch(r.parentKind){case "select":Go(n,e.outputType);break;case "include":Ec(n,e.outputType);break;case "omit":Tc(n,e.outputType);break}}t.addErrorMessage(n=>{let i=[`Unknown field ${n.red(`\`${r.fieldName}\``)}`];return r.parentKind!=="unknown"&&i.push(`for ${n.bold(r.parentKind)} statement`),i.push(`on model ${n.bold(`\`${e.outputType.name}\``)}.`),i.push(Gt(n)),i.join(" ")});}function mc(e,t){let r=zo(e.selectionPath,t);r.parentKind!=="unknown"&&r.field.value.markAsError(),t.addErrorMessage(n=>`Invalid value for selection field \`${n.red(r.fieldName)}\`: ${e.underlyingError}`);}function fc(e,t){let r=e.argumentPath[0],n=t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();n&&(n.getField(r)?.markAsError(),vc(n,e.arguments)),t.addErrorMessage(i=>Qo(i,r,e.arguments.map(o=>o.name)));}function gc(e,t){let[r,n]=wt(e.argumentPath),i=t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();if(i){i.getDeepField(e.argumentPath)?.markAsError();let o=i.getDeepFieldValue(r)?.asObject();o&&Ho(o,e.inputType);}t.addErrorMessage(o=>Qo(o,n,e.inputType.fields.map(s=>s.name)));}function Qo(e,t,r){let n=[`Unknown argument \`${e.red(t)}\`.`],i=Ac(t,r);return i&&n.push(`Did you mean \`${e.green(i)}\`?`),r.length>0&&n.push(Gt(e)),n.join(" ")}function yc(e,t){let r;t.addErrorMessage(u=>r?.value instanceof Z&&r.value.text==="null"?`Argument \`${u.green(o)}\` must not be ${u.red("null")}.`:`Argument \`${u.green(o)}\` is missing.`);let n=t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();if(!n)return;let[i,o]=wt(e.argumentPath),s=new Jt,a=n.getDeepFieldValue(i)?.asObject();if(a){if(r=a.getField(o),r&&a.removeField(o),e.inputTypes.length===1&&e.inputTypes[0].kind==="object"){for(let u of e.inputTypes[0].fields)s.addField(u.name,u.typeNames.join(" | "));a.addSuggestion(new pe(o,s).makeRequired());}else {let u=e.inputTypes.map(Jo).join(" | ");a.addSuggestion(new pe(o,u).makeRequired());}if(e.dependentArgumentPath){n.getDeepField(e.dependentArgumentPath)?.markAsError();let[,u]=wt(e.dependentArgumentPath);t.addErrorMessage(m=>`Argument \`${m.green(o)}\` is required because argument \`${m.green(u)}\` was provided.`);}}}function Jo(e){return e.kind==="list"?`${Jo(e.elementType)}[]`:e.name}function hc(e,t){let r=e.argument.name,n=t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();n&&n.getDeepFieldValue(e.argumentPath)?.markAsError(),t.addErrorMessage(i=>{let o=Nr("or",e.argument.typeNames.map(s=>i.green(s)));return `Argument \`${i.bold(r)}\`: Invalid value provided. Expected ${o}, provided ${i.red(e.inferredType)}.`});}function wc(e,t){let r=e.argument.name,n=t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();n&&n.getDeepFieldValue(e.argumentPath)?.markAsError(),t.addErrorMessage(i=>{let o=[`Invalid value for argument \`${i.bold(r)}\``];if(e.underlyingError&&o.push(`: ${e.underlyingError}`),o.push("."),e.argument.typeNames.length>0){let s=Nr("or",e.argument.typeNames.map(a=>i.green(a)));o.push(` Expected ${s}.`);}return o.join("")});}function xc(e,t){let r=e.argument.name,n=t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(),i;if(n){let s=n.getDeepField(e.argumentPath)?.value;s?.markAsError(),s instanceof Z&&(i=s.text);}t.addErrorMessage(o=>{let s=["Unable to fit value"];return i&&s.push(o.red(i)),s.push(`into a 64-bit signed integer for field \`${o.bold(r)}\``),s.join(" ")});}function bc(e,t){let r=e.argumentPath[e.argumentPath.length-1],n=t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();if(n){let i=n.getDeepFieldValue(e.argumentPath)?.asObject();i&&Ho(i,e.inputType);}t.addErrorMessage(i=>{let o=[`Argument \`${i.bold(r)}\` of type ${i.bold(e.inputType.name)} needs`];return e.constraints.minFieldCount===1?e.constraints.requiredFields?o.push(`${i.green("at least one of")} ${Nr("or",e.constraints.requiredFields.map(s=>`\`${i.bold(s)}\``))} arguments.`):o.push(`${i.green("at least one")} argument.`):o.push(`${i.green(`at least ${e.constraints.minFieldCount}`)} arguments.`),o.push(Gt(i)),o.join(" ")});}function Pc(e,t){let r=e.argumentPath[e.argumentPath.length-1],n=t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(),i=[];if(n){let o=n.getDeepFieldValue(e.argumentPath)?.asObject();o&&(o.markAsError(),i=Object.keys(o.getFields()));}t.addErrorMessage(o=>{let s=[`Argument \`${o.bold(r)}\` of type ${o.bold(e.inputType.name)} needs`];return e.constraints.minFieldCount===1&&e.constraints.maxFieldCount==1?s.push(`${o.green("exactly one")} argument,`):e.constraints.maxFieldCount==1?s.push(`${o.green("at most one")} argument,`):s.push(`${o.green(`at most ${e.constraints.maxFieldCount}`)} arguments,`),s.push(`but you provided ${Nr("and",i.map(a=>o.red(a)))}. Please choose`),e.constraints.maxFieldCount===1?s.push("one."):s.push(`${e.constraints.maxFieldCount}.`),s.join(" ")});}function Go(e,t){for(let r of t.fields)e.hasField(r.name)||e.addSuggestion(new pe(r.name,"true"));}function Ec(e,t){for(let r of t.fields)r.isRelation&&!e.hasField(r.name)&&e.addSuggestion(new pe(r.name,"true"));}function Tc(e,t){for(let r of t.fields)!e.hasField(r.name)&&!r.isRelation&&e.addSuggestion(new pe(r.name,"true"));}function vc(e,t){for(let r of t)e.hasField(r.name)||e.addSuggestion(new pe(r.name,r.typeNames.join(" | ")));}function zo(e,t){let[r,n]=wt(e),i=t.arguments.getDeepSubSelectionValue(r)?.asObject();if(!i)return {parentKind:"unknown",fieldName:n};let o=i.getFieldValue("select")?.asObject(),s=i.getFieldValue("include")?.asObject(),a=i.getFieldValue("omit")?.asObject(),u=o?.getField(n);return o&&u?{parentKind:"select",parent:o,field:u,fieldName:n}:(u=s?.getField(n),s&&u?{parentKind:"include",field:u,parent:s,fieldName:n}:(u=a?.getField(n),a&&u?{parentKind:"omit",field:u,parent:a,fieldName:n}:{parentKind:"unknown",fieldName:n}))}function Ho(e,t){if(t.kind==="object")for(let r of t.fields)e.hasField(r.name)||e.addSuggestion(new pe(r.name,r.typeNames.join(" | ")));}function wt(e){let t=[...e],r=t.pop();if(!r)throw new Error("unexpected empty path");return [t,r]}function Gt({green:e,enabled:t}){return "Available options are "+(t?`listed in ${e("green")}`:"marked with ?")+"."}function Nr(e,t){if(t.length===1)return t[0];let r=[...t],n=r.pop();return `${r.join(", ")} ${e} ${n}`}var Sc=3;function Ac(e,t){let r=1/0,n;for(let i of t){let o=(0, Bo.default)(e,i);o>Sc||o<r&&(r=o,n=i);}return n}var Ko=require$$0;var zt=class{modelName;name;typeName;isList;isEnum;constructor(t,r,n,i,o){this.modelName=t,this.name=r,this.typeName=n,this.isList=i,this.isEnum=o;}_toGraphQLInputType(){let t=this.isList?"List":"",r=this.isEnum?"Enum":"";return `${t}${r}${this.typeName}FieldRefInput<${this.modelName}>`}};function xt(e){return e instanceof zt}var Wo=": ",Dr=class{constructor(t,r){this.name=t;this.value=r;}hasError=false;markAsError(){this.hasError=true;}getPrintWidth(){return this.name.length+this.value.getPrintWidth()+Wo.length}write(t){let r=new ke(this.name);this.hasError&&r.underline().setColor(t.context.colors.red),t.write(r).write(Wo).write(this.value);}};var jn=class{arguments;errorMessages=[];constructor(t){this.arguments=t;}write(t){t.write(this.arguments);}addErrorMessage(t){this.errorMessages.push(t);}renderAllMessages(t){return this.errorMessages.map(r=>r(t)).join(`
`)}};function bt(e){return new jn(Zo(e))}function Zo(e){let t=new ht;for(let[r,n]of Object.entries(e)){let i=new Dr(r,Xo(n));t.addField(i);}return t}function Xo(e){if(typeof e=="string")return new Z(JSON.stringify(e));if(typeof e=="number"||typeof e=="boolean")return new Z(String(e));if(typeof e=="bigint")return new Z(`${e}n`);if(e===null)return new Z("null");if(e===void 0)return new Z("undefined");if(dt(e))return new Z(`new Prisma.Decimal("${e.toFixed()}")`);if(e instanceof Uint8Array)return Buffer.isBuffer(e)?new Z(`Buffer.alloc(${e.byteLength})`):new Z(`new Uint8Array(${e.byteLength})`);if(e instanceof Date){let t=pt(e)?e.toISOString():"Invalid Date";return new Z(`new Date("${t}")`)}return (0, Ko.isObjectEnumValue)(e)?new Z(`Prisma.${e._getName()}`):xt(e)?new Z(`prisma.${qe(e.modelName)}.$fields.${e.name}`):Array.isArray(e)?Rc(e):typeof e=="object"?Zo(e):new Z(Object.prototype.toString.call(e))}function Rc(e){let t=new yt;for(let r of e)t.addItem(Xo(r));return t}function Mr(e,t){let r=t==="pretty"?jo:Or,n=e.renderAllMessages(r),i=new ft(0,{colors:r}).write(e).toString();return {message:n,args:i}}function Fr({args:e,errors:t,errorFormat:r,callsite:n,originalMethod:i,clientVersion:o,globalOmit:s}){let a=bt(e);for(let T of t)Cr(T,a,s);let{message:u,args:m}=Mr(a,r),P=Rr({message:u,callsite:n,originalMethod:i,showColors:r==="pretty",callArguments:m});throw new Yo.PrismaClientValidationError(P,{clientVersion:o})}function Oe(e){return e.replace(/^./,t=>t.toLowerCase())}function ts(e,t,r){let n=Oe(r);return !t.result||!(t.result.$allModels||t.result[n])?e:Cc({...e,...es(t.name,e,t.result.$allModels),...es(t.name,e,t.result[n])})}function Cc(e){let t=new Ie,r=(n,i)=>t.getOrCreate(n,()=>i.has(n)?[n]:(i.add(n),e[n]?e[n].needs.flatMap(o=>r(o,i)):[n]));return vr(e,n=>({...n,needs:r(n.name,new Set)}))}function es(e,t,r){return r?vr(r,({needs:n,compute:i},o)=>({name:o,needs:n?Object.keys(n).filter(s=>n[s]):[],compute:Ic(t,o,i)})):{}}function Ic(e,t,r){let n=e?.[t]?.compute;return n?(i,o)=>r({...i,[t]:n(i,o)},o):r}function rs(e,t){if(!t)return e;let r={...e};for(let n of Object.values(t))if(e[n.name])for(let i of n.needs)r[i]=true;return r}function ns(e,t){if(!t)return e;let r={...e};for(let n of Object.values(t))if(!e[n.name])for(let i of n.needs)delete r[i];return r}var _r=class{constructor(t,r){this.extension=t;this.previous=r;}computedFieldsCache=new Ie;modelExtensionsCache=new Ie;queryCallbacksCache=new Ie;clientExtensions=Nt(()=>this.extension.client?{...this.previous?.getAllClientExtensions(),...this.extension.client}:this.previous?.getAllClientExtensions());batchCallbacks=Nt(()=>{let t=this.previous?.getAllBatchQueryCallbacks()??[],r=this.extension.query?.$__internalBatch;return r?t.concat(r):t});getAllComputedFields(t){return this.computedFieldsCache.getOrCreate(t,()=>ts(this.previous?.getAllComputedFields(t),this.extension,t))}getAllClientExtensions(){return this.clientExtensions.get()}getAllModelExtensions(t){return this.modelExtensionsCache.getOrCreate(t,()=>{let r=Oe(t);return !this.extension.model||!(this.extension.model[r]||this.extension.model.$allModels)?this.previous?.getAllModelExtensions(t):{...this.previous?.getAllModelExtensions(t),...this.extension.model.$allModels,...this.extension.model[r]}})}getAllQueryCallbacks(t,r){return this.queryCallbacksCache.getOrCreate(`${t}:${r}`,()=>{let n=this.previous?.getAllQueryCallbacks(t,r)??[],i=[],o=this.extension.query;return !o||!(o[t]||o.$allModels||o[r]||o.$allOperations)?n:(o[t]!==void 0&&(o[t][r]!==void 0&&i.push(o[t][r]),o[t].$allOperations!==void 0&&i.push(o[t].$allOperations)),t!=="$none"&&o.$allModels!==void 0&&(o.$allModels[r]!==void 0&&i.push(o.$allModels[r]),o.$allModels.$allOperations!==void 0&&i.push(o.$allModels.$allOperations)),o[r]!==void 0&&i.push(o[r]),o.$allOperations!==void 0&&i.push(o.$allOperations),n.concat(i))})}getAllBatchQueryCallbacks(){return this.batchCallbacks.get()}},Pt=class e{constructor(t){this.head=t;}static empty(){return new e}static single(t){return new e(new _r(t))}isEmpty(){return this.head===void 0}append(t){return new e(new _r(t,this.head))}getAllComputedFields(t){return this.head?.getAllComputedFields(t)}getAllClientExtensions(){return this.head?.getAllClientExtensions()}getAllModelExtensions(t){return this.head?.getAllModelExtensions(t)}getAllQueryCallbacks(t,r){return this.head?.getAllQueryCallbacks(t,r)??[]}getAllBatchQueryCallbacks(){return this.head?.getAllBatchQueryCallbacks()??[]}};var $r=class{constructor(t){this.name=t;}};function is(e){return e instanceof $r}function os(e){return new $r(e)}var ss=Symbol(),Ht=class{constructor(t){if(t!==ss)throw new Error("Skip instance can not be constructed directly")}ifUndefined(t){return t===void 0?Lr:t}},Lr=new Ht(ss);function fe(e){return e instanceof Ht}var kc={findUnique:"findUnique",findUniqueOrThrow:"findUniqueOrThrow",findFirst:"findFirst",findFirstOrThrow:"findFirstOrThrow",findMany:"findMany",count:"aggregate",create:"createOne",createMany:"createMany",createManyAndReturn:"createManyAndReturn",update:"updateOne",updateMany:"updateMany",updateManyAndReturn:"updateManyAndReturn",upsert:"upsertOne",delete:"deleteOne",deleteMany:"deleteMany",executeRaw:"executeRaw",queryRaw:"queryRaw",aggregate:"aggregate",groupBy:"groupBy",runCommandRaw:"runCommandRaw",findRaw:"findRaw",aggregateRaw:"aggregateRaw"},ls="explicitly `undefined` values are not allowed";function Vr({modelName:e,action:t,args:r,runtimeDataModel:n,extensions:i=Pt.empty(),callsite:o,clientMethod:s,errorFormat:a,clientVersion:u,previewFeatures:m,globalOmit:P,wrapRawValues:T}){let S=new Bn({runtimeDataModel:n,modelName:e,action:t,rootArgs:r,callsite:o,extensions:i,selectionPath:[],argumentPath:[],originalMethod:s,errorFormat:a,clientVersion:u,previewFeatures:m,globalOmit:P,wrapRawValues:T});return {modelName:e,action:kc[t],query:Wt(r,S)}}function Wt({select:e,include:t,...r}={},n){let i=r.omit;return delete r.omit,{arguments:cs(r,n),selection:Oc(e,t,i,n)}}function Oc(e,t,r,n){return e?(t?n.throwValidationError({kind:"MutuallyExclusiveFields",firstField:"include",secondField:"select",selectionPath:n.getSelectionPath()}):r&&n.throwValidationError({kind:"MutuallyExclusiveFields",firstField:"omit",secondField:"select",selectionPath:n.getSelectionPath()}),Fc(e,n)):Nc(n,t,r)}function Nc(e,t,r){let n={};return e.modelOrType&&!e.isRawAction()&&(n.$composites=true,n.$scalars=true),t&&Dc(n,t,e),Mc(n,r,e),n}function Dc(e,t,r){for(let[n,i]of Object.entries(t)){if(fe(i))continue;let o=r.nestSelection(n);if(Qn(i,o),i===false||i===void 0){e[n]=false;continue}let s=r.findField(n);if(s&&s.kind!=="object"&&r.throwValidationError({kind:"IncludeOnScalar",selectionPath:r.getSelectionPath().concat(n),outputType:r.getOutputTypeDescription()}),s){e[n]=Wt(i===true?{}:i,o);continue}if(i===true){e[n]=true;continue}e[n]=Wt(i,o);}}function Mc(e,t,r){let n=r.getComputedFields(),i={...r.getGlobalOmit(),...t},o=ns(i,n);for(let[s,a]of Object.entries(o)){if(fe(a))continue;Qn(a,r.nestSelection(s));let u=r.findField(s);n?.[s]&&!u||(e[s]=!a);}}function Fc(e,t){let r={},n=t.getComputedFields(),i=rs(e,n);for(let[o,s]of Object.entries(i)){if(fe(s))continue;let a=t.nestSelection(o);Qn(s,a);let u=t.findField(o);if(!(n?.[o]&&!u)){if(s===false||s===void 0||fe(s)){r[o]=false;continue}if(s===true){u?.kind==="object"?r[o]=Wt({},a):r[o]=true;continue}r[o]=Wt(s,a);}}return r}function us(e,t){if(e===null)return null;if(typeof e=="string"||typeof e=="number"||typeof e=="boolean")return e;if(typeof e=="bigint")return {$type:"BigInt",value:String(e)};if(ct(e)){if(pt(e))return {$type:"DateTime",value:e.toISOString()};t.throwValidationError({kind:"InvalidArgumentValue",selectionPath:t.getSelectionPath(),argumentPath:t.getArgumentPath(),argument:{name:t.getArgumentName(),typeNames:["Date"]},underlyingError:"Provided Date object is invalid"});}if(is(e))return {$type:"Param",value:e.name};if(xt(e))return {$type:"FieldRef",value:{_ref:e.name,_container:e.modelName}};if(Array.isArray(e))return _c(e,t);if(ArrayBuffer.isView(e)){let{buffer:r,byteOffset:n,byteLength:i}=e;return {$type:"Bytes",value:Buffer.from(r,n,i).toString("base64")}}if($c(e))return e.values;if(dt(e))return {$type:"Decimal",value:e.toFixed()};if((0, as.isObjectEnumValue)(e)){let r=e._getName();if(r!=="DbNull"&&r!=="JsonNull"&&r!=="AnyNull")throw new Error(`Invalid ObjectEnumValue: expected DbNull, JsonNull, or AnyNull, got ${r}`);return {$type:"Enum",value:r}}if(Lc(e))return e.toJSON();if(typeof e=="object")return cs(e,t);t.throwValidationError({kind:"InvalidArgumentValue",selectionPath:t.getSelectionPath(),argumentPath:t.getArgumentPath(),argument:{name:t.getArgumentName(),typeNames:[]},underlyingError:`We could not serialize ${Object.prototype.toString.call(e)} value. Serialize the object to JSON or implement a ".toJSON()" method on it`});}function cs(e,t){if(t.shouldWrapRawValues()&&e.$type)return {$type:"Raw",value:e};let r={};for(let n in e){let i=e[n],o=t.nestArgument(n);fe(i)||(i!==void 0?r[n]=us(i,o):t.isPreviewFeatureOn("strictUndefinedChecks")&&t.throwValidationError({kind:"InvalidArgumentValue",argumentPath:o.getArgumentPath(),selectionPath:t.getSelectionPath(),argument:{name:t.getArgumentName(),typeNames:[]},underlyingError:ls}));}return r}function _c(e,t){let r=[];for(let n=0;n<e.length;n++){let i=t.nestArgument(String(n)),o=e[n];if(o===void 0||fe(o)){let s=o===void 0?"undefined":"Prisma.skip";t.throwValidationError({kind:"InvalidArgumentValue",selectionPath:i.getSelectionPath(),argumentPath:i.getArgumentPath(),argument:{name:`${t.getArgumentName()}[${n}]`,typeNames:[]},underlyingError:`Can not use \`${s}\` value within array. Use \`null\` or filter out \`${s}\` values`});}r.push(us(o,i));}return r}function $c(e){return typeof e=="object"&&e!==null&&e.__prismaRawParameters__===true}function Lc(e){return typeof e=="object"&&e!==null&&typeof e.toJSON=="function"}function Qn(e,t){e===void 0&&t.isPreviewFeatureOn("strictUndefinedChecks")&&t.throwValidationError({kind:"InvalidSelectionValue",selectionPath:t.getSelectionPath(),underlyingError:ls});}var Bn=class e{constructor(t){this.params=t;this.params.modelName&&(this.modelOrType=this.params.runtimeDataModel.models[this.params.modelName]??this.params.runtimeDataModel.types[this.params.modelName]);}modelOrType;throwValidationError(t){Fr({errors:[t],originalMethod:this.params.originalMethod,args:this.params.rootArgs??{},callsite:this.params.callsite,errorFormat:this.params.errorFormat,clientVersion:this.params.clientVersion,globalOmit:this.params.globalOmit});}getSelectionPath(){return this.params.selectionPath}getArgumentPath(){return this.params.argumentPath}getArgumentName(){return this.params.argumentPath[this.params.argumentPath.length-1]}getOutputTypeDescription(){if(!(!this.params.modelName||!this.modelOrType))return {name:this.params.modelName,fields:this.modelOrType.fields.map(t=>({name:t.name,typeName:"boolean",isRelation:t.kind==="object"}))}}isRawAction(){return ["executeRaw","queryRaw","runCommandRaw","findRaw","aggregateRaw"].includes(this.params.action)}isPreviewFeatureOn(t){return this.params.previewFeatures.includes(t)}shouldWrapRawValues(){return this.params.wrapRawValues??true}getComputedFields(){if(this.params.modelName)return this.params.extensions.getAllComputedFields(this.params.modelName)}findField(t){return this.modelOrType?.fields.find(r=>r.name===t)}nestSelection(t){let r=this.findField(t),n=r?.kind==="object"?r.type:void 0;return new e({...this.params,modelName:n,selectionPath:this.params.selectionPath.concat(t)})}getGlobalOmit(){return this.params.modelName&&this.shouldApplyGlobalOmit()?this.params.globalOmit?.[qe(this.params.modelName)]??{}:{}}shouldApplyGlobalOmit(){switch(this.params.action){case "findFirst":case "findFirstOrThrow":case "findUniqueOrThrow":case "findMany":case "upsert":case "findUnique":case "createManyAndReturn":case "create":case "update":case "updateManyAndReturn":case "delete":return  true;case "executeRaw":case "aggregateRaw":case "runCommandRaw":case "findRaw":case "createMany":case "deleteMany":case "groupBy":case "updateMany":case "count":case "aggregate":case "queryRaw":return  false;default:$e(this.params.action,"Unknown action");}}nestArgument(t){return new e({...this.params,argumentPath:this.params.argumentPath.concat(t)})}};function ps(e,t){let r=Nt(()=>Vc(t));Object.defineProperty(e,"dmmf",{get:()=>r.get()});}function Vc(e){return {datamodel:{models:Jn(e.models),enums:Jn(e.enums),types:Jn(e.types)}}}function Jn(e){return Object.entries(e).map(([t,r])=>({name:t,...r}))}var Gn=new WeakMap,qr="$$PrismaTypedSql",Kt=class{constructor(t,r){Gn.set(this,{sql:t,values:r}),Object.defineProperty(this,qr,{value:qr});}get sql(){return Gn.get(this).sql}get values(){return Gn.get(this).values}};function ds(e){return (...t)=>new Kt(e,t)}function Ur(e){return e!=null&&e[qr]===qr}var nu=require$$0;var iu=require$$3,ou=require$$4;function Zt(e){return {getKeys(){return Object.keys(e)},getPropertyValue(t){return e[t]}}}function ae(e,t){return {getKeys(){return [e]},getPropertyValue(){return t()}}}function We(e){let t=new Ie;return {getKeys(){return e.getKeys()},getPropertyValue(r){return t.getOrCreate(r,()=>e.getPropertyValue(r))},getPropertyDescriptor(r){return e.getPropertyDescriptor?.(r)}}}var jr={enumerable:true,configurable:true,writable:true};function Br(e){let t=new Set(e);return {getPrototypeOf:()=>Object.prototype,getOwnPropertyDescriptor:()=>jr,has:(r,n)=>t.has(n),set:(r,n,i)=>t.add(n)&&Reflect.set(r,n,i),ownKeys:()=>[...t]}}var ms=Symbol.for("nodejs.util.inspect.custom");function ve(e,t){let r=qc(t),n=new Set,i=new Proxy(e,{get(o,s){if(n.has(s))return o[s];let a=r.get(s);return a?a.getPropertyValue(s):o[s]},has(o,s){if(n.has(s))return  true;let a=r.get(s);return a?a.has?.(s)??true:Reflect.has(o,s)},ownKeys(o){let s=fs(Reflect.ownKeys(o),r),a=fs(Array.from(r.keys()),r);return [...new Set([...s,...a,...n])]},set(o,s,a){return r.get(s)?.getPropertyDescriptor?.(s)?.writable===false?false:(n.add(s),Reflect.set(o,s,a))},getOwnPropertyDescriptor(o,s){let a=Reflect.getOwnPropertyDescriptor(o,s);if(a&&!a.configurable)return a;let u=r.get(s);return u?u.getPropertyDescriptor?{...jr,...u?.getPropertyDescriptor(s)}:jr:a},defineProperty(o,s,a){return n.add(s),Reflect.defineProperty(o,s,a)},getPrototypeOf:()=>Object.prototype});return i[ms]=function(){let o={...this};return delete o[ms],o},i}function qc(e){let t=new Map;for(let r of e){let n=r.getKeys();for(let i of n)t.set(i,r);}return t}function fs(e,t){return e.filter(r=>t.get(r)?.has?.(r)??true)}function Et(e){return {getKeys(){return e},has(){return  false},getPropertyValue(){}}}function gs(e){if(e===void 0)return "";let t=bt(e);return new ft(0,{colors:Or}).write(t).toString()}var Xt="<unknown>";function ys(e){var t=e.split(`
`);return t.reduce(function(r,n){var i=Bc(n)||Jc(n)||Hc(n)||Xc(n)||Kc(n);return i&&r.push(i),r},[])}var Uc=/^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|rsc|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,jc=/\((\S*)(?::(\d+))(?::(\d+))\)/;function Bc(e){var t=Uc.exec(e);if(!t)return null;var r=t[2]&&t[2].indexOf("native")===0,n=t[2]&&t[2].indexOf("eval")===0,i=jc.exec(t[2]);return n&&i!=null&&(t[2]=i[1],t[3]=i[2],t[4]=i[3]),{file:r?null:t[2],methodName:t[1]||Xt,arguments:r?[t[2]]:[],lineNumber:t[3]?+t[3]:null,column:t[4]?+t[4]:null}}var Qc=/^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|rsc|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;function Jc(e){var t=Qc.exec(e);return t?{file:t[2],methodName:t[1]||Xt,arguments:[],lineNumber:+t[3],column:t[4]?+t[4]:null}:null}var Gc=/^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|rsc|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i,zc=/(\S+) line (\d+)(?: > eval line \d+)* > eval/i;function Hc(e){var t=Gc.exec(e);if(!t)return null;var r=t[3]&&t[3].indexOf(" > eval")>-1,n=zc.exec(t[3]);return r&&n!=null&&(t[3]=n[1],t[4]=n[2],t[5]=null),{file:t[3],methodName:t[1]||Xt,arguments:t[2]?t[2].split(","):[],lineNumber:t[4]?+t[4]:null,column:t[5]?+t[5]:null}}var Wc=/^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;function Kc(e){var t=Wc.exec(e);return t?{file:t[3],methodName:t[1]||Xt,arguments:[],lineNumber:+t[4],column:t[5]?+t[5]:null}:null}var Zc=/^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;function Xc(e){var t=Zc.exec(e);return t?{file:t[2],methodName:t[1]||Xt,arguments:[],lineNumber:+t[3],column:t[4]?+t[4]:null}:null}var zn=class{getLocation(){return null}},Hn=class{_error;constructor(){this._error=new Error;}getLocation(){let t=this._error.stack;if(!t)return null;let n=ys(t).find(i=>{if(!i.file)return  false;let o=_n(i.file);return o!=="<anonymous>"&&!o.includes("@prisma")&&!o.includes("/packages/client/src/runtime/")&&!o.endsWith("/runtime/client.js")&&!o.startsWith("internal/")&&!i.methodName.includes("new ")&&!i.methodName.includes("getCallSite")&&!i.methodName.includes("Proxy.")&&i.methodName.split(".").length<4});return !n||!n.file?null:{fileName:n.file,lineNumber:n.lineNumber,columnNumber:n.column}}};function je(e){return e==="minimal"?typeof $EnabledCallSite=="function"&&e!=="minimal"?new $EnabledCallSite:new zn:new Hn}var hs={_avg:true,_count:true,_sum:true,_min:true,_max:true};function Tt(e={}){let t=ep(e);return Object.entries(t).reduce((n,[i,o])=>(hs[i]!==void 0?n.select[i]={select:o}:n[i]=o,n),{select:{}})}function ep(e={}){return typeof e._count=="boolean"?{...e,_count:{_all:e._count}}:e}function Qr(e={}){return t=>(typeof e._count=="boolean"&&(t._count=t._count._all),t)}function ws(e,t){let r=Qr(e);return t({action:"aggregate",unpacker:r,argsMapper:Tt})(e)}function tp(e={}){let{select:t,...r}=e;return typeof t=="object"?Tt({...r,_count:t}):Tt({...r,_count:{_all:true}})}function rp(e={}){return typeof e.select=="object"?t=>Qr(e)(t)._count:t=>Qr(e)(t)._count._all}function xs(e,t){return t({action:"count",unpacker:rp(e),argsMapper:tp})(e)}function np(e={}){let t=Tt(e);if(Array.isArray(t.by))for(let r of t.by)typeof r=="string"&&(t.select[r]=true);else typeof t.by=="string"&&(t.select[t.by]=true);return t}function ip(e={}){return t=>(typeof e?._count=="boolean"&&t.forEach(r=>{r._count=r._count._all;}),t)}function bs(e,t){return t({action:"groupBy",unpacker:ip(e),argsMapper:np})(e)}function Ps(e,t,r){if(t==="aggregate")return n=>ws(n,r);if(t==="count")return n=>xs(n,r);if(t==="groupBy")return n=>bs(n,r)}function Es(e,t){let r=t.fields.filter(i=>!i.relationName),n=oo(r,"name");return new Proxy({},{get(i,o){if(o in i||typeof o=="symbol")return i[o];let s=n[o];if(s)return new zt(e,o,s.type,s.isList,s.kind==="enum")},...Br(Object.keys(n))})}var Ts=e=>Array.isArray(e)?e:e.split("."),Wn=(e,t)=>Ts(t).reduce((r,n)=>r&&r[n],e),vs=(e,t,r)=>Ts(t).reduceRight((n,i,o,s)=>Object.assign({},Wn(e,s.slice(0,o)),{[i]:n}),r);function op(e,t){return e===void 0||t===void 0?[]:[...t,"select",e]}function sp(e,t,r){return t===void 0?e??{}:vs(t,r,e||true)}function Kn(e,t,r,n,i,o){let s=e._runtimeDataModel.models[t],a;return u=>{let m=je(e._errorFormat),P=op(n,i),T=sp(u,o,P),S=r({dataPath:P,callsite:m})(T),I=ap(e,t);return new Proxy(S,{get(A,M){if(!I.includes(M))return A[M];a??=Object.fromEntries(s.fields.map(D=>[D.name,D]));let q=[a[M].type,r,M],E=[P,T];return Kn(e,...q,...E)},...Br([...I,...Object.getOwnPropertyNames(S)])})}}function ap(e,t){return e._runtimeDataModel.models[t].fields.filter(r=>r.kind==="object").map(r=>r.name)}var lp=["findUnique","findUniqueOrThrow","findFirst","findFirstOrThrow","create","update","upsert","delete"],up=["aggregate","count","groupBy"];function Zn(e,t){let r=e._extensions.getAllModelExtensions(t)??{},n=[cp(e,t),dp(e,t),Zt(r),ae("name",()=>t),ae("$name",()=>t),ae("$parent",()=>e._appliedParent)];return ve({},n)}function cp(e,t){let r=Oe(t),n=Object.keys(mt).concat("count");return {getKeys(){return n},getPropertyValue(i){let o=i,s=a=>u=>{let m=je(e._errorFormat);return e._createPrismaPromise(P=>{let T={args:u,dataPath:[],action:o,model:t,clientMethod:`${r}.${i}`,jsModelName:r,transaction:P,callsite:m};return e._request({...T,...a})},{action:o,args:u,model:t})};return lp.includes(o)?Kn(e,t,s):pp(i)?Ps(e,i,s):s({})}}}function pp(e){return up.includes(e)}function dp(e,t){return We(ae("fields",()=>{let r=e._runtimeDataModel.models[t];return Es(t,r)}))}function Ss(e){return e.replace(/^./,t=>t.toUpperCase())}var Xn=Symbol();function Yt(e){let t=[mp(e),fp(e),ae(Xn,()=>e),ae("$parent",()=>e._appliedParent)],r=e._extensions.getAllClientExtensions();return r&&t.push(Zt(r)),ve(e,t)}function mp(e){let t=Object.getPrototypeOf(e._originalClient),r=[...new Set(Object.getOwnPropertyNames(t))];return {getKeys(){return r},getPropertyValue(n){return e[n]}}}function fp(e){let t=Object.keys(e._runtimeDataModel.models),r=t.map(Oe),n=[...new Set(t.concat(r))];return We({getKeys(){return n},getPropertyValue(i){let o=Ss(i);if(e._runtimeDataModel.models[o]!==void 0)return Zn(e,o);if(e._runtimeDataModel.models[i]!==void 0)return Zn(e,i)},getPropertyDescriptor(i){if(!r.includes(i))return {enumerable:false}}})}function As(e){return e[Xn]?e[Xn]:e}function Rs(e){if(typeof e=="function")return e(this);let t=Object.create(this._originalClient,{_extensions:{value:this._extensions.append(e)},_appliedParent:{value:this,configurable:true},$on:{value:void 0}});return Yt(t)}function Cs({result:e,modelName:t,select:r,omit:n,extensions:i}){let o=i.getAllComputedFields(t);if(!o)return e;let s=[],a=[];for(let u of Object.values(o)){if(n){if(n[u.name])continue;let m=u.needs.filter(P=>n[P]);m.length>0&&a.push(Et(m));}else if(r){if(!r[u.name])continue;let m=u.needs.filter(P=>!r[P]);m.length>0&&a.push(Et(m));}gp(e,u.needs)&&s.push(yp(u,ve(e,s),t));}return s.length>0||a.length>0?ve(e,[...s,...a]):e}function gp(e,t){return t.every(r=>$n(e,r))}function yp(e,t,r){return We(ae(e.name,()=>e.compute(t,r)))}function Jr({visitor:e,result:t,args:r,runtimeDataModel:n,modelName:i}){if(Array.isArray(t)){for(let s=0;s<t.length;s++)t[s]=Jr({result:t[s],args:r,modelName:i,runtimeDataModel:n,visitor:e});return t}let o=e(t,i,r)??t;return r.include&&Is({includeOrSelect:r.include,result:o,parentModelName:i,runtimeDataModel:n,visitor:e}),r.select&&Is({includeOrSelect:r.select,result:o,parentModelName:i,runtimeDataModel:n,visitor:e}),o}function Is({includeOrSelect:e,result:t,parentModelName:r,runtimeDataModel:n,visitor:i}){for(let[o,s]of Object.entries(e)){if(!s||t[o]==null||fe(s))continue;let u=n.models[r].fields.find(P=>P.name===o);if(!u||u.kind!=="object"||!u.relationName)continue;let m=typeof s=="object"?s:{};t[o]=Jr({visitor:i,result:t[o],args:m,modelName:u.type,runtimeDataModel:n});}}function ks({result:e,modelName:t,args:r,extensions:n,runtimeDataModel:i,globalOmit:o}){return n.isEmpty()||e==null||typeof e!="object"||!i.models[t]?e:Jr({result:e,args:r??{},modelName:t,runtimeDataModel:i,visitor:(a,u,m)=>{let P=Oe(u);return Cs({result:a,modelName:P,select:m.select,omit:m.select?void 0:{...o?.[P],...m.omit},extensions:n})}})}var Ke=require$$0;var hp=["$connect","$disconnect","$on","$use","$extends"],Os=hp;function Ns(e){if(e instanceof Ke.Sql)return wp(e);if(Ur(e))return xp(e);if(Array.isArray(e)){let r=[e[0]];for(let n=1;n<e.length;n++)r[n]=er(e[n]);return r}let t={};for(let r in e)t[r]=er(e[r]);return t}function wp(e){return new Ke.Sql(e.strings,e.values)}function xp(e){return new Kt(e.sql,e.values)}function er(e){if(typeof e!="object"||e==null||(0, Ke.isObjectEnumValue)(e)||xt(e)||fe(e))return e;if(dt(e))return new Ke.Decimal(e.toFixed());if(ct(e))return new Date(+e);if(ArrayBuffer.isView(e))return e.slice(0);if(Array.isArray(e)){let t=e.length,r;for(r=Array(t);t--;)r[t]=er(e[t]);return r}if(typeof e=="object"){let t={};for(let r in e)r==="__proto__"?Object.defineProperty(t,r,{value:er(e[r]),configurable:true,enumerable:true,writable:true}):t[r]=er(e[r]);return t}$e(e,"Unknown value");}function Ms(e,t,r,n=0){return e._createPrismaPromise(i=>{let o=t.customDataProxyFetch;return "transaction"in t&&i!==void 0&&(t.transaction?.kind==="batch"&&t.transaction.lock.then(),t.transaction=i),n===r.length?e._executeRequest(t):r[n]({model:t.model,operation:t.model?t.action:t.clientMethod,args:Ns(t.args??{}),__internalParams:t,query:(s,a=t)=>{let u=a.customDataProxyFetch;return a.customDataProxyFetch=Ls(o,u),a.args=s,Ms(e,a,r,n+1)}})})}function Fs(e,t){let{jsModelName:r,action:n,clientMethod:i}=t,o=r?n:i;if(e._extensions.isEmpty())return e._executeRequest(t);let s=e._extensions.getAllQueryCallbacks(r??"$none",o);return Ms(e,t,s)}function _s(e){return t=>{let r={requests:t},n=t[0].extensions.getAllBatchQueryCallbacks();return n.length?$s(r,n,0,e):e(r)}}function $s(e,t,r,n){if(r===t.length)return n(e);let i=e.customDataProxyFetch,o=e.requests[0].transaction;return t[r]({args:{queries:e.requests.map(s=>({model:s.modelName,operation:s.action,args:s.args})),transaction:o?{isolationLevel:o.kind==="batch"?o.isolationLevel:void 0}:void 0},__internalParams:e,query(s,a=e){let u=a.customDataProxyFetch;return a.customDataProxyFetch=Ls(i,u),$s(a,t,r+1,n)}})}var Ds=e=>e;function Ls(e=Ds,t=Ds){return r=>e(t(r))}function qs({dataPath:e,modelName:t,args:r,runtimeDataModel:n}){let i={modelName:t,args:r??{}},o=bp(e);if(!o||o.length===0)return i;let s=t,a=r??{};for(let u of o){let m=n.models[s];if(!m)return i;let P=m.fields.find(T=>T.name===u);if(!P)throw new Error(`Could not resolve relation field "${u}" on model "${s}" from dataPath "${e.join(".")}"`);if(P.kind!=="object"||!P.relationName)return i;s=P.type,a=Pp(a,u);}return {modelName:s,args:a}}function bp(e){let t=[];for(let r=0;r<e.length;r+=2){let n=e[r],i=e[r+1];if(n!=="select"&&n!=="include"||i===void 0)return;t.push(i);}return t}function Pp(e,t){let r=e.select?.[t];if(Vs(r))return r;let n=e.include?.[t];return Vs(n)?n:{}}function Vs(e){return !!e&&typeof e=="object"&&!Array.isArray(e)}var Gs=require$$0;var tr=require$$0;function vt(e){return ArrayBuffer.isView(e)&&Object.prototype.toString.call(e)==="[object Uint8Array]"}function rr(e){return Object.prototype.toString.call(e)==="[object Date]"}function V(e,t){throw new Error(t)}function ei(e,t){return e===t||e!==null&&t!==null&&typeof e=="object"&&typeof t=="object"&&Object.keys(e).length===Object.keys(t).length&&Object.keys(e).every(r=>ei(e[r],t[r]))}function St(e,t){let r=Object.keys(e),n=Object.keys(t);return (r.length<n.length?r:n).every(o=>{if(typeof e[o]==typeof t[o]&&typeof e[o]!="object")return e[o]===t[o];if(tr.Decimal.isDecimal(e[o])||tr.Decimal.isDecimal(t[o])){let s=Us(e[o]),a=Us(t[o]);return s&&a&&s.equals(a)}else if(vt(e[o])||vt(t[o])){let s=js(e[o]),a=js(t[o]);return s&&a&&s.equals(a)}else {if(rr(e[o])||rr(t[o]))return Bs(e[o])?.getTime()===Bs(t[o])?.getTime();if(typeof e[o]=="bigint"||typeof t[o]=="bigint")return Qs(e[o])===Qs(t[o]);if(typeof e[o]=="number"||typeof t[o]=="number")return Js(e[o])===Js(t[o])}return ei(e[o],t[o])})}function Us(e){return tr.Decimal.isDecimal(e)?e:typeof e=="number"||typeof e=="string"?new tr.Decimal(e):void 0}function js(e){return Buffer.isBuffer(e)?e:vt(e)?Buffer.from(e.buffer,e.byteOffset,e.byteLength):typeof e=="string"?Buffer.from(e,"base64"):void 0}function Bs(e){return rr(e)?e:typeof e=="string"||typeof e=="number"?new Date(e):void 0}function Qs(e){return typeof e=="bigint"?e:typeof e=="number"||typeof e=="string"?BigInt(e):void 0}function Js(e){return typeof e=="number"?e:typeof e=="string"?Number(e):void 0}function Se(e){return JSON.stringify(e,(t,r)=>typeof r=="bigint"?r.toString():ArrayBuffer.isView(r)?Buffer.from(r.buffer,r.byteOffset,r.byteLength).toString("base64"):r)}var Yn=8192;function Gr(e,t){if(t.length<=Yn){e.push(...t);return}for(let r=0;r<t.length;r+=Yn)e.push(...t.slice(r,r+Yn));}function Ep(e){return e!==null&&typeof e=="object"&&typeof e.$type=="string"}function Tp(e,t){let r={};for(let n of Object.keys(e))r[n]=t(e[n],n);return r}function Ae(e){return e===null?e:Array.isArray(e)?e.map(Ae):typeof e=="object"?Ep(e)?vp(e):e.constructor!==null&&e.constructor.name!=="Object"?e:Tp(e,Ae):e}function vp({$type:e,value:t}){switch(e){case "BigInt":return BigInt(t);case "Bytes":return new Uint8Array(Buffer.from(t,"base64"));case "DateTime":return new Date(t);case "Decimal":return new Gs.Decimal(t);case "Json":return JSON.parse(t);case "Raw":return t;case "FieldRef":throw new Error("FieldRef tagged values cannot be deserialized to JavaScript values");case "Enum":return t;default:V(t,"Unknown tagged value");}}function zr(e){return e.name==="DriverAdapterError"&&typeof e.cause=="object"}var k={Int32:0,Int64:1,Float:2,Double:3,Numeric:4,Boolean:5,Character:6,Text:7,Date:8,Time:9,DateTime:10,Json:11,Enum:12,Bytes:13,Set:14,Uuid:15,Int32Array:64,Int64Array:65,FloatArray:66,DoubleArray:67,NumericArray:68,BooleanArray:69,CharacterArray:70,TextArray:71,DateArray:72,TimeArray:73,DateTimeArray:74,JsonArray:75,EnumArray:76,BytesArray:77,UuidArray:78,UnknownNumber:128};var X=class extends Error{name="UserFacingError";code;meta;constructor(t,r,n){super(t),this.code=r,this.meta=n??{};}toQueryResponseErrorObject(){return {error:this.message,user_facing_error:{is_panic:false,message:this.message,meta:this.meta,error_code:this.code}}}};function Be(e){if(!zr(e))throw e;let t=Cp(e),r=Hs(e);if(t!==void 0&&r!==void 0){let n={driverAdapterError:e};throw e.cause.kind==="UniqueConstraintViolation"&&e.cause.table&&(n.table=e.cause.table),new X(r,t,n)}throw Rp(e.cause.kind)?Ap(e):e}function ri(e){throw zr(e)?Sp(e):e}function Sp(e){let t=e.cause.originalCode??"N/A",r=zs(e);return new X(`Raw query failed. Code: \`${t}\`. Message: \`${r}\``,"P2010",{driverAdapterError:e})}function Ap(e){let t=e.cause.originalCode??"N/A",r=zs(e);return new X(`Database error. Code: \`${t}\`. Message: \`${r}\``,"P2039",{driverAdapterError:e})}function zs(e){return e.cause.originalMessage??Hs(e)??e.message??"N/A"}function Rp(e){switch(e){case "postgres":case "mysql":case "sqlite":case "mssql":return  true;default:return  false}}function Cp(e){switch(e.cause.kind){case "AuthenticationFailed":return "P1000";case "DatabaseNotReachable":return "P1001";case "DatabaseDoesNotExist":return "P1003";case "SocketTimeout":return "P1008";case "DatabaseAlreadyExists":return "P1009";case "DatabaseAccessDenied":return "P1010";case "TlsConnectionError":return "P1011";case "ConnectionClosed":return "P1017";case "TransactionAlreadyClosed":return "P1018";case "LengthMismatch":return "P2000";case "UniqueConstraintViolation":return "P2002";case "ForeignKeyConstraintViolation":case "RestrictViolation":return "P2003";case "InvalidInputValue":return "P2007";case "UnsupportedNativeDataType":return "P2010";case "NullConstraintViolation":return "P2011";case "ValueOutOfRange":return "P2020";case "TableDoesNotExist":return "P2021";case "ColumnNotFound":return "P2022";case "InvalidIsolationLevel":case "InconsistentColumnData":return "P2023";case "MissingFullTextSearchIndex":return "P2030";case "TransactionWriteConflict":return "P2034";case "GenericJs":return "P2036";case "TooManyConnections":return "P2037";case "postgres":case "sqlite":case "mysql":case "mssql":return;default:V(e.cause,`Unknown error: ${Se(e.cause)}`);}}function Hs(e){switch(e.cause.kind){case "AuthenticationFailed":return `Authentication failed against the database server, the provided database credentials for \`${e.cause.user??"(not available)"}\` are not valid`;case "DatabaseNotReachable":{let t=e.cause.host&&e.cause.port?`${e.cause.host}:${e.cause.port}`:e.cause.host;return `Can't reach database server${t?` at ${t}`:""}`}case "DatabaseDoesNotExist":return `Database \`${e.cause.db??"(not available)"}\` does not exist on the database server`;case "SocketTimeout":return "Operation has timed out";case "DatabaseAlreadyExists":return `Database \`${e.cause.db??"(not available)"}\` already exists on the database server`;case "DatabaseAccessDenied":return `User was denied access on the database \`${e.cause.db??"(not available)"}\``;case "TlsConnectionError":return `Error opening a TLS connection: ${e.cause.reason}`;case "ConnectionClosed":return "Server has closed the connection.";case "TransactionAlreadyClosed":return e.cause.cause;case "LengthMismatch":return `The provided value for the column is too long for the column's type. Column: ${e.cause.column??"(not available)"}`;case "UniqueConstraintViolation":return `Unique constraint failed on the ${ti(e.cause.constraint)}`;case "ForeignKeyConstraintViolation":case "RestrictViolation":return `Foreign key constraint violated on the ${ti(e.cause.constraint)}`;case "UnsupportedNativeDataType":return `Failed to deserialize column of type '${e.cause.type}'. If you're using $queryRaw and this column is explicitly marked as \`Unsupported\` in your Prisma schema, try casting this column to any supported Prisma type such as \`String\`.`;case "NullConstraintViolation":return `Null constraint violation on the ${ti(e.cause.constraint)}`;case "ValueOutOfRange":return `Value out of range for the type: ${e.cause.cause}`;case "TableDoesNotExist":return `The table \`${e.cause.table??"(not available)"}\` does not exist in the current database.`;case "ColumnNotFound":return `The column \`${e.cause.column??"(not available)"}\` does not exist in the current database.`;case "InvalidIsolationLevel":return `Error in connector: Conversion error: ${e.cause.level}`;case "InconsistentColumnData":return `Inconsistent column data: ${e.cause.cause}`;case "MissingFullTextSearchIndex":return "Cannot find a fulltext index to use for the native search, try adding a @@fulltext([Fields...]) to your schema";case "TransactionWriteConflict":return "Transaction failed due to a write conflict or a deadlock. Please retry your transaction";case "GenericJs":return `Error in external connector (id ${e.cause.id})`;case "TooManyConnections":return `Too many database connections opened: ${e.cause.cause}`;case "InvalidInputValue":return `Invalid input value: ${e.cause.message}`;case "sqlite":case "postgres":case "mysql":case "mssql":return;default:V(e.cause,`Unknown error: ${Se(e.cause)}`);}}function ti(e){return e&&"fields"in e?`fields: (${e.fields.map(t=>`\`${t}\``).join(", ")})`:e&&"index"in e?`constraint: \`${e.index}\``:e&&"foreignKey"in e?"foreign key":"(not available)"}function Ip(e){if(typeof e!="object"||e===null)return  false;let t=e;return "$type"in t&&t.$type==="Param"||"prisma__type"in t&&t.prisma__type==="param"}function kp(e){return "prisma__type"in e?e.prisma__value?.name:e.value.name}function Op(e,t){let r={};for(let[n,i]of Object.entries(e))if(r[n]=i,Ip(i)){let o=kp(i);o&&o in t&&(r[n]=t[o]);}return r}function Ws(e,t,r={}){let n=e.map(o=>t.keys.reduce((s,a)=>(s[a]=Ae(o[a]),s),{})),i=new Set(t.nestedSelection);return t.arguments.map(o=>{let s=Op(o,r),a=n.findIndex(u=>St(u,s));if(a===-1)return t.expectNonEmpty?new X("An operation failed because it depends on one or more records that were required but not found","P2025"):null;{let u=Object.entries(e[a]).filter(([m])=>i.has(m));return Object.fromEntries(u)}})}var Xs=require$$0;var Q=class extends X{name="DataMapperError";constructor(t,r){super(t,"P2023",r);}},Ks=new WeakMap;function Np(e){let t=Ks.get(e);return t||(t=Object.entries(e),Ks.set(e,t)),t}function ii(e,t,r){switch(t.type){case "affectedRows":if(typeof e!="number")throw new Q(`Expected an affected rows count, got: ${typeof e} (${e})`);return {count:e};case "object":return oi(e,t.fields,r,t.skipNulls);case "field":return ni(e,"<result>",t.fieldType,r);default:V(t,`Invalid data mapping type: '${t.type}'`);}}function oi(e,t,r,n){if(e===null)return null;if(Array.isArray(e)){let i=e;return n&&(i=i.filter(o=>o!==null)),i.map(o=>Zs(o,t,r))}if(typeof e=="object")return Zs(e,t,r);if(typeof e=="string"){let i;try{i=JSON.parse(e);}catch(o){throw new Q("Expected an array or object, got a string that is not valid JSON",{cause:o})}return oi(i,t,r,n)}throw new Q(`Expected an array or an object, got: ${typeof e}`)}function Zs(e,t,r){if(typeof e!="object")throw new Q(`Expected an object, but got '${typeof e}'`);let n={};for(let[i,o]of Np(t))switch(o.type){case "affectedRows":throw new Q(`Unexpected 'AffectedRows' node in data mapping for field '${i}'`);case "object":{let{serializedName:s,fields:a,skipNulls:u}=o;if(s!==null&&!Object.hasOwn(e,s))throw new Q(`Missing data field (Object): '${i}'; node: ${JSON.stringify(o)}; data: ${JSON.stringify(e)}`);let m=s!==null?e[s]:e;n[i]=oi(m,a,r,u);break}case "field":{let s=o.dbName;if(Object.hasOwn(e,s))n[i]=Dp(e[s],s,o.fieldType,r);else throw new Q(`Missing data field (Value): '${s}'; node: ${JSON.stringify(o)}; data: ${JSON.stringify(e)}`)}break;default:V(o,`DataMapper: Invalid data mapping node type: '${o.type}'`);}return n}function Dp(e,t,r,n){return e===null?r.arity==="list"?[]:null:r.arity==="list"?e.map((o,s)=>ni(o,`${t}[${s}]`,r,n)):ni(e,t,r,n)}function ni(e,t,r,n){switch(r.type){case "unsupported":return e;case "string":{if(typeof e!="string")throw new Q(`Expected a string in column '${t}', got ${typeof e}: ${e}`);return e}case "int":switch(typeof e){case "number":return Math.trunc(e);case "string":{let i=Math.trunc(Number(e));if(Number.isNaN(i)||!Number.isFinite(i))throw new Q(`Expected an integer in column '${t}', got string: ${e}`);if(!Number.isSafeInteger(i))throw new Q(`Integer value in column '${t}' is too large to represent as a JavaScript number without loss of precision, got: ${e}. Consider using BigInt type.`);return i}default:throw new Q(`Expected an integer in column '${t}', got ${typeof e}: ${e}`)}case "bigint":{if(typeof e!="number"&&typeof e!="string")throw new Q(`Expected a bigint in column '${t}', got ${typeof e}: ${e}`);return {$type:"BigInt",value:e}}case "float":{if(typeof e=="number")return e;if(typeof e=="string"){let i=Number(e);if(Number.isNaN(i)&&!/^[-+]?nan$/.test(e.toLowerCase()))throw new Q(`Expected a float in column '${t}', got string: ${e}`);return i}throw new Q(`Expected a float in column '${t}', got ${typeof e}: ${e}`)}case "boolean":{if(typeof e=="boolean")return e;if(typeof e=="number")return e===1;if(typeof e=="string"){if(e==="true"||e==="TRUE"||e==="1")return  true;if(e==="false"||e==="FALSE"||e==="0")return  false;throw new Q(`Expected a boolean in column '${t}', got ${typeof e}: ${e}`)}if(Array.isArray(e)||vt(e)){for(let i of e)if(i!==0)return  true;return  false}throw new Q(`Expected a boolean in column '${t}', got ${typeof e}: ${e}`)}case "decimal":if(typeof e!="number"&&typeof e!="string"&&!Xs.Decimal.isDecimal(e))throw new Q(`Expected a decimal in column '${t}', got ${typeof e}: ${e}`);return {$type:"Decimal",value:e};case "datetime":{if(typeof e=="string")return {$type:"DateTime",value:Fp(e)};if(typeof e=="number"||rr(e))return {$type:"DateTime",value:e};throw new Q(`Expected a date in column '${t}', got ${typeof e}: ${e}`)}case "object":return {$type:"Json",value:Se(e)};case "json":return {$type:"Json",value:`${e}`};case "bytes":{switch(r.encoding){case "base64":if(typeof e!="string")throw new Q(`Expected a base64-encoded byte array in column '${t}', got ${typeof e}: ${e}`);return {$type:"Bytes",value:e};case "hex":if(typeof e!="string"||!e.startsWith("\\x"))throw new Q(`Expected a hex-encoded byte array in column '${t}', got ${typeof e}: ${e}`);return {$type:"Bytes",value:Buffer.from(e.slice(2),"hex").toString("base64")};case "array":if(Array.isArray(e))return {$type:"Bytes",value:Buffer.from(e).toString("base64")};if(vt(e))return {$type:"Bytes",value:Buffer.from(e).toString("base64")};throw new Q(`Expected a byte array in column '${t}', got ${typeof e}: ${e}`);default:V(r.encoding,`DataMapper: Unknown bytes encoding: ${r.encoding}`);}break}case "enum":{let i=n[r.name];if(i===void 0)throw new Q(`Unknown enum '${r.name}'`);let o=i[`${e}`];if(o===void 0)throw new Q(`Value '${e}' not found in enum '${r.name}'`);return o}default:V(r,`DataMapper: Unknown result type: ${r.type}`);}}var Mp=/\d{2}:\d{2}:\d{2}(?:\.\d+)?(Z|[+-]\d{2}(:?\d{2})?)?$/;function Fp(e){let t=Mp.exec(e);if(t===null)return `${e}T00:00:00Z`;let r=e,[n,i,o]=t;if(i!==void 0&&i!=="Z"&&o===void 0?r=`${e}:00`:i===void 0&&(r=`${e}Z`),n.length===e.length)return `1970-01-01T${r}`;let s=t.index-1;return r[s]===" "&&(r=`${r.slice(0,s)}T${r.slice(s+1)}`),r}function ge(e){if(typeof e!="object")return e;var t,r,n=Object.prototype.toString.call(e);if(n==="[object Object]"){if(e.constructor!==Object&&typeof e.constructor=="function"){r=new e.constructor;for(t in e)e.hasOwnProperty(t)&&r[t]!==e[t]&&(r[t]=ge(e[t]));}else {r={};for(t in e)t==="__proto__"?Object.defineProperty(r,t,{value:ge(e[t]),configurable:true,enumerable:true,writable:true}):r[t]=ge(e[t]);}return r}if(n==="[object Array]"){for(t=e.length,r=Array(t);t--;)r[t]=ge(e[t]);return r}return n==="[object Set]"?(r=new Set,e.forEach(function(i){r.add(ge(i));}),r):n==="[object Map]"?(r=new Map,e.forEach(function(i,o){r.set(ge(o),ge(i));}),r):n==="[object Date]"?new Date(+e):n==="[object RegExp]"?(r=new RegExp(e.source,e.flags),r.lastIndex=e.lastIndex,r):n==="[object DataView]"?new e.constructor(ge(e.buffer)):n==="[object ArrayBuffer]"?e.slice(0):n.slice(-6)==="Array]"?new e.constructor(e):e}function _p(e){let t=Object.entries(e);return t.length===0?"":(t.sort(([n],[i])=>n.localeCompare(i)),`/*${t.map(([n,i])=>{let o=encodeURIComponent(n),s=encodeURIComponent(i).replace(/'/g,"\\'");return `${o}='${s}'`}).join(",")}*/`)}function Hr(e,t){let r={};for(let n of e){let i=n(ge(t));for(let[o,s]of Object.entries(i))s!==void 0&&(r[o]=s);}return r}function Ys(e,t){let r=Hr(e,t);return _p(r)}function ea(e,t){return t?`${e} ${t}`:e}var nr;(function(e){e[e.INTERNAL=0]="INTERNAL",e[e.SERVER=1]="SERVER",e[e.CLIENT=2]="CLIENT",e[e.PRODUCER=3]="PRODUCER",e[e.CONSUMER=4]="CONSUMER";})(nr||(nr={}));function $p(e){switch(e){case "postgresql":case "postgres":case "prisma+postgres":return "postgresql";case "sqlserver":return "mssql";case "mysql":case "sqlite":case "cockroachdb":case "mongodb":return e;default:V(e,`Unknown provider: ${e}`);}}async function Wr({query:e,tracingHelper:t,provider:r,onQuery:n,execute:i}){let o=n===void 0?i:async()=>{let s=new Date,a=performance.now(),u=await i(),m=performance.now();return n({timestamp:s,duration:m-a,query:e.sql,params:e.args}),u};return t.isEnabled()?await t.runInChildSpan({name:"db_query",kind:nr.CLIENT,attributes:{"db.query.text":e.sql,"db.system.name":$p(r)}},o):o()}function Ze(e,t){var r="000000000"+e;return r.substr(r.length-t)}var ta=Pe(require$$5,1);function Lp(){try{return ta.default.hostname()}catch{return process.env._CLUSTER_NETWORK_NAME_||process.env.COMPUTERNAME||"hostname"}}var ra=2,Vp=Ze(process.pid.toString(36),ra),na=Lp(),qp=na.length,Up=Ze(na.split("").reduce(function(e,t){return +e+t.charCodeAt(0)},+qp+36).toString(36),ra);function si(){return Vp+Up}function Kr(e){return typeof e=="string"&&/^c[a-z0-9]{20,32}$/.test(e)}function ai(e){let n=Math.pow(36,4),i=0;function o(){return Ze((Math.random()*n<<0).toString(36),4)}function s(){return i=i<n?i:0,i++,i-1}function a(){var u="c",m=new Date().getTime().toString(36),P=Ze(s().toString(36),4),T=e(),S=o()+o();return u+m+P+T+S}return a.fingerprint=e,a.isCuid=Kr,a}var jp=ai(si);var ia=jp;var Zr=BigInt(4294967295),oa=BigInt(32);function Bp(e,t=false){return t?{h:Number(e&Zr),l:Number(e>>oa&Zr)}:{h:Number(e>>oa&Zr)|0,l:Number(e&Zr)|0}}function sa(e,t=false){let r=e.length,n=new Uint32Array(r),i=new Uint32Array(r);for(let o=0;o<r;o++){let{h:s,l:a}=Bp(e[o],t);[n[o],i[o]]=[s,a];}return [n,i]}var aa=(e,t,r)=>e<<r|t>>>32-r,la=(e,t,r)=>t<<r|e>>>32-r,ua=(e,t,r)=>t<<r-32|e>>>64-r,ca=(e,t,r)=>e<<r-32|t>>>64-r;function Qp(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"&&"BYTES_PER_ELEMENT"in e&&e.BYTES_PER_ELEMENT===1}function Xr(e,t=""){if(typeof e!="number"){let r=t&&`"${t}" `;throw new TypeError(`${r}expected number, got ${typeof e}`)}if(!Number.isSafeInteger(e)||e<0){let r=t&&`"${t}" `;throw new RangeError(`${r}expected integer >= 0, got ${e}`)}}function Yr(e,t,r=""){let n=Qp(e),i=e?.length,o=t!==void 0;if(!n||o){let s=r&&`"${r}" `,a="",u=n?`length=${i}`:`type=${typeof e}`,m=s+"expected Uint8Array"+a+", got "+u;throw n?new RangeError(m):new TypeError(m)}return e}function li(e,t=true){if(e.destroyed)throw new Error("Hash instance has been destroyed");if(t&&e.finished)throw new Error("Hash#digest() has already been called")}function pa(e,t){Yr(e,void 0,"digestInto() output");let r=t.outputLen;if(e.length<r)throw new RangeError('"digestInto() output" expected to be of length >='+r)}function da(e){return new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4))}function ui(...e){for(let t=0;t<e.length;t++)e[t].fill(0);}var Jp=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68;function Gp(e){return e<<24&4278190080|e<<8&16711680|e>>>8&65280|e>>>24&255}function zp(e){for(let t=0;t<e.length;t++)e[t]=Gp(e[t]);return e}var ci=Jp?e=>e:zp;function ma(e,t={}){let r=(i,o)=>e(o).update(i).digest(),n=e(void 0);return r.outputLen=n.outputLen,r.blockLen=n.blockLen,r.canXOF=n.canXOF,r.create=i=>e(i),Object.assign(r,t),Object.freeze(r)}var fa=e=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,e])});var Hp=BigInt(0),ir=BigInt(1),Wp=BigInt(2),Kp=BigInt(7),Zp=BigInt(256),Xp=BigInt(113),ha=[],wa=[],xa=[];for(let e=0,t=ir,r=1,n=0;e<24;e++){[r,n]=[n,(2*r+3*n)%5],ha.push(2*(5*n+r)),wa.push((e+1)*(e+2)/2%64);let i=Hp;for(let o=0;o<7;o++)t=(t<<ir^(t>>Kp)*Xp)%Zp,t&Wp&&(i^=ir<<(ir<<BigInt(o))-ir);xa.push(i);}var ba=sa(xa,true),Yp=ba[0],ed=ba[1],ga=(e,t,r)=>r>32?ua(e,t,r):aa(e,t,r),ya=(e,t,r)=>r>32?ca(e,t,r):la(e,t,r);function td(e,t=24){if(Xr(t,"rounds"),t<1||t>24)throw new Error('"rounds" expected integer 1..24');let r=new Uint32Array(5*2);for(let n=24-t;n<24;n++){for(let s=0;s<10;s++)r[s]=e[s]^e[s+10]^e[s+20]^e[s+30]^e[s+40];for(let s=0;s<10;s+=2){let a=(s+8)%10,u=(s+2)%10,m=r[u],P=r[u+1],T=ga(m,P,1)^r[a],S=ya(m,P,1)^r[a+1];for(let I=0;I<50;I+=10)e[s+I]^=T,e[s+I+1]^=S;}let i=e[2],o=e[3];for(let s=0;s<24;s++){let a=wa[s],u=ga(i,o,a),m=ya(i,o,a),P=ha[s];i=e[P],o=e[P+1],e[P]=u,e[P+1]=m;}for(let s=0;s<50;s+=10){let a=e[s],u=e[s+1],m=e[s+2],P=e[s+3];e[s]^=~e[s+2]&e[s+4],e[s+1]^=~e[s+3]&e[s+5],e[s+2]^=~e[s+4]&e[s+6],e[s+3]^=~e[s+5]&e[s+7],e[s+4]^=~e[s+6]&e[s+8],e[s+5]^=~e[s+7]&e[s+9],e[s+6]^=~e[s+8]&a,e[s+7]^=~e[s+9]&u,e[s+8]^=~a&m,e[s+9]^=~u&P;}e[0]^=Yp[n],e[1]^=ed[n];}ui(r);}var pi=class e{state;pos=0;posOut=0;finished=false;state32;destroyed=false;blockLen;suffix;outputLen;canXOF;enableXOF=false;rounds;constructor(t,r,n,i=false,o=24){if(this.blockLen=t,this.suffix=r,this.outputLen=n,this.enableXOF=i,this.canXOF=i,this.rounds=o,Xr(n,"outputLen"),!(0<t&&t<200))throw new Error("only keccak-f1600 function is supported");this.state=new Uint8Array(200),this.state32=da(this.state);}clone(){return this._cloneInto()}keccak(){ci(this.state32),td(this.state32,this.rounds),ci(this.state32),this.posOut=0,this.pos=0;}update(t){li(this),Yr(t);let{blockLen:r,state:n}=this,i=t.length;for(let o=0;o<i;){let s=Math.min(r-this.pos,i-o);for(let a=0;a<s;a++)n[this.pos++]^=t[o++];this.pos===r&&this.keccak();}return this}finish(){if(this.finished)return;this.finished=true;let{state:t,suffix:r,pos:n,blockLen:i}=this;t[n]^=r,(r&128)!==0&&n===i-1&&this.keccak(),t[i-1]^=128,this.keccak();}writeInto(t){li(this,false),Yr(t),this.finish();let r=this.state,{blockLen:n}=this;for(let i=0,o=t.length;i<o;){this.posOut>=n&&this.keccak();let s=Math.min(n-this.posOut,o-i);t.set(r.subarray(this.posOut,this.posOut+s),i),this.posOut+=s,i+=s;}return t}xofInto(t){if(!this.enableXOF)throw new Error("XOF is not possible for this instance");return this.writeInto(t)}xof(t){return Xr(t),this.xofInto(new Uint8Array(t))}digestInto(t){if(pa(t,this),this.finished)throw new Error("digest() was already called");this.writeInto(t.subarray(0,this.outputLen)),this.destroy();}digest(){let t=new Uint8Array(this.outputLen);return this.digestInto(t),t}destroy(){this.destroyed=true,ui(this.state);}_cloneInto(t){let{blockLen:r,suffix:n,outputLen:i,rounds:o,enableXOF:s}=this;return t||=new e(r,n,i,s,o),t.blockLen=r,t.state32.set(this.state32),t.pos=this.pos,t.posOut=this.posOut,t.finished=this.finished,t.rounds=o,t.suffix=n,t.outputLen=i,t.enableXOF=s,t.canXOF=this.canXOF,t.destroyed=this.destroyed,t}},rd=(e,t,r,n={})=>ma(()=>new pi(t,e,r),n);var Pa=rd(6,72,64,fa(10));var nd=/^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,di=Math.ceil,he=Math.floor,le="[BigNumber Error] ",Ea=le+"Number primitive has more than 15 significant digits: ",Re=1e14,N=14,mi=9007199254740991,fi=[1,10,100,1e3,1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11,1e12,1e13],Qe=1e7,Y=1e9;function Ta(e){var t,r,n,i=E.prototype={constructor:E,toString:null,valueOf:null},o=new E(1),s=20,a=4,u=-7,m=21,P=-1e7,T=1e7,S=false,I=1,A=0,M={prefix:"",groupSize:3,secondaryGroupSize:0,groupSeparator:",",decimalSeparator:".",fractionGroupSize:0,fractionGroupSeparator:"\xA0",suffix:""},L="0123456789abcdefghijklmnopqrstuvwxyz",q=true;function E(l,c){var p,h,f,y,b,d,g,x,w=this;if(!(w instanceof E))return new E(l,c);if(c==null){if(l&&l._isBigNumber===true){w.s=l.s,!l.c||l.e>T?w.c=w.e=null:l.e<P?w.c=[w.e=0]:(w.e=l.e,w.c=l.c.slice());return}if((d=typeof l=="number")&&l*0==0){if(w.s=1/l<0?(l=-l,-1):1,l===~~l){for(y=0,b=l;b>=10;b/=10,y++);y>T?w.c=w.e=null:(w.e=y,w.c=[l]);return}x=String(l);}else {if(!nd.test(x=String(l)))return n(w,x,d);w.s=x.charCodeAt(0)==45?(x=x.slice(1),-1):1;}(y=x.indexOf("."))>-1&&(x=x.replace(".","")),(b=x.search(/e/i))>0?(y<0&&(y=b),y+=+x.slice(b+1),x=x.substring(0,b)):y<0&&(y=x.length);}else {if(J(c,2,L.length,"Base"),c==10&&q)return w=new E(l),ie(w,s+w.e+1,a);if(x=String(l),d=typeof l=="number"){if(l*0!=0)return n(w,x,d,c);if(w.s=1/l<0?(x=x.slice(1),-1):1,E.DEBUG&&x.replace(/^0\.0*|\./,"").length>15)throw Error(Ea+l)}else w.s=x.charCodeAt(0)===45?(x=x.slice(1),-1):1;for(p=L.slice(0,c),y=b=0,g=x.length;b<g;b++)if(p.indexOf(h=x.charAt(b))<0){if(h=="."){if(b>y){y=g;continue}}else if(!f&&(x==x.toUpperCase()&&(x=x.toLowerCase())||x==x.toLowerCase()&&(x=x.toUpperCase()))){f=true,b=-1,y=0;continue}return n(w,String(l),d,c)}d=false,x=r(x,c,10,w.s),(y=x.indexOf("."))>-1?x=x.replace(".",""):y=x.length;}for(b=0;x.charCodeAt(b)===48;b++);for(g=x.length;x.charCodeAt(--g)===48;);if(x=x.slice(b,++g)){if(g-=b,d&&E.DEBUG&&g>15&&(l>mi||l!==he(l)))throw Error(Ea+w.s*l);if((y=y-b-1)>T)w.c=w.e=null;else if(y<P)w.c=[w.e=0];else {if(w.e=y,w.c=[],b=(y+1)%N,y<0&&(b+=N),b<g){for(b&&w.c.push(+x.slice(0,b)),g-=N;b<g;)w.c.push(+x.slice(b,b+=N));b=N-(x=x.slice(b)).length;}else b-=g;for(;b--;x+="0");w.c.push(+x);}}else w.c=[w.e=0];}E.clone=Ta,E.ROUND_UP=0,E.ROUND_DOWN=1,E.ROUND_CEIL=2,E.ROUND_FLOOR=3,E.ROUND_HALF_UP=4,E.ROUND_HALF_DOWN=5,E.ROUND_HALF_EVEN=6,E.ROUND_HALF_CEIL=7,E.ROUND_HALF_FLOOR=8,E.EUCLID=9,E.config=E.set=function(l){var c,p;if(l!=null)if(typeof l=="object"){if(l.hasOwnProperty(c="DECIMAL_PLACES")&&(p=l[c],J(p,0,Y,c),s=p),l.hasOwnProperty(c="ROUNDING_MODE")&&(p=l[c],J(p,0,8,c),a=p),l.hasOwnProperty(c="EXPONENTIAL_AT")&&(p=l[c],p&&p.pop?(J(p[0],-Y,0,c),J(p[1],0,Y,c),u=p[0],m=p[1]):(J(p,-Y,Y,c),u=-(m=p<0?-p:p))),l.hasOwnProperty(c="RANGE"))if(p=l[c],p&&p.pop)J(p[0],-Y,-1,c),J(p[1],1,Y,c),P=p[0],T=p[1];else if(J(p,-Y,Y,c),p)P=-(T=p<0?-p:p);else throw Error(le+c+" cannot be zero: "+p);if(l.hasOwnProperty(c="CRYPTO"))if(p=l[c],p===!!p)if(p)if(typeof crypto<"u"&&crypto&&(crypto.getRandomValues||crypto.randomBytes))S=p;else throw S=!p,Error(le+"crypto unavailable");else S=p;else throw Error(le+c+" not true or false: "+p);if(l.hasOwnProperty(c="MODULO_MODE")&&(p=l[c],J(p,0,9,c),I=p),l.hasOwnProperty(c="POW_PRECISION")&&(p=l[c],J(p,0,Y,c),A=p),l.hasOwnProperty(c="FORMAT"))if(p=l[c],typeof p=="object")M=p;else throw Error(le+c+" not an object: "+p);if(l.hasOwnProperty(c="ALPHABET"))if(p=l[c],typeof p=="string"&&!/^.?$|[+\-.\s]|(.).*\1/.test(p))q=p.slice(0,10)=="0123456789",L=p;else throw Error(le+c+" invalid: "+p)}else throw Error(le+"Object expected: "+l);return {DECIMAL_PLACES:s,ROUNDING_MODE:a,EXPONENTIAL_AT:[u,m],RANGE:[P,T],CRYPTO:S,MODULO_MODE:I,POW_PRECISION:A,FORMAT:M,ALPHABET:L}},E.isBigNumber=function(l){if(!l||l._isBigNumber!==true)return  false;if(!E.DEBUG)return  true;var c,p,h=l.c,f=l.e,y=l.s;e:if({}.toString.call(h)=="[object Array]"){if((y===1||y===-1)&&f>=-Y&&f<=Y&&f===he(f)){if(h[0]===0){if(f===0&&h.length===1)return  true;break e}if(c=(f+1)%N,c<1&&(c+=N),String(h[0]).length==c){for(c=0;c<h.length;c++)if(p=h[c],p<0||p>=Re||p!==he(p))break e;if(p!==0)return  true}}}else if(h===null&&f===null&&(y===null||y===1||y===-1))return  true;throw Error(le+"Invalid BigNumber: "+l)},E.maximum=E.max=function(){return H(arguments,-1)},E.minimum=E.min=function(){return H(arguments,1)},E.random=function(){var l=9007199254740992,c=Math.random()*l&2097151?function(){return he(Math.random()*l)}:function(){return (Math.random()*1073741824|0)*8388608+(Math.random()*8388608|0)};return function(p){var h,f,y,b,d,g=0,x=[],w=new E(o);if(p==null?p=s:J(p,0,Y),b=di(p/N),S)if(crypto.getRandomValues){for(h=crypto.getRandomValues(new Uint32Array(b*=2));g<b;)d=h[g]*131072+(h[g+1]>>>11),d>=9e15?(f=crypto.getRandomValues(new Uint32Array(2)),h[g]=f[0],h[g+1]=f[1]):(x.push(d%1e14),g+=2);g=b/2;}else if(crypto.randomBytes){for(h=crypto.randomBytes(b*=7);g<b;)d=(h[g]&31)*281474976710656+h[g+1]*1099511627776+h[g+2]*4294967296+h[g+3]*16777216+(h[g+4]<<16)+(h[g+5]<<8)+h[g+6],d>=9e15?crypto.randomBytes(7).copy(h,g):(x.push(d%1e14),g+=7);g=b/7;}else throw S=false,Error(le+"crypto unavailable");if(!S)for(;g<b;)d=c(),d<9e15&&(x[g++]=d%1e14);for(b=x[--g],p%=N,b&&p&&(d=fi[N-p],x[g]=he(b/d)*d);x[g]===0;x.pop(),g--);if(g<0)x=[y=0];else {for(y=-1;x[0]===0;x.splice(0,1),y-=N);for(g=1,d=x[0];d>=10;d/=10,g++);g<N&&(y-=N-g);}return w.e=y,w.c=x,w}}(),E.sum=function(){for(var l=1,c=arguments,p=new E(c[0]);l<c.length;)p=p.plus(c[l++]);return p},r=function(){var l="0123456789";function c(p,h,f,y){for(var b,d=[0],g,x=0,w=p.length;x<w;){for(g=d.length;g--;d[g]*=h);for(d[0]+=y.indexOf(p.charAt(x++)),b=0;b<d.length;b++)d[b]>f-1&&(d[b+1]==null&&(d[b+1]=0),d[b+1]+=d[b]/f|0,d[b]%=f);}return d.reverse()}return function(p,h,f,y,b){var d,g,x,w,v,R,C,$,G=p.indexOf("."),W=s,F=a;for(G>=0&&(w=A,A=0,p=p.replace(".",""),$=new E(h),R=$.pow(p.length-G),A=w,$.c=c(Le(ye(R.c),R.e,"0"),10,f,l),$.e=$.c.length),C=c(p,h,f,b?(d=L,l):(d=l,L)),x=w=C.length;C[--w]==0;C.pop());if(!C[0])return d.charAt(0);if(G<0?--x:(R.c=C,R.e=x,R.s=y,R=t(R,$,W,F,f),C=R.c,v=R.r,x=R.e),g=x+W+1,G=C[g],w=f/2,v=v||g<0||C[g+1]!=null,v=F<4?(G!=null||v)&&(F==0||F==(R.s<0?3:2)):G>w||G==w&&(F==4||v||F==6&&C[g-1]&1||F==(R.s<0?8:7)),g<1||!C[0])p=v?Le(d.charAt(1),-W,d.charAt(0)):d.charAt(0);else {if(C.length=g,v)for(--f;++C[--g]>f;)C[g]=0,g||(++x,C=[1].concat(C));for(w=C.length;!C[--w];);for(G=0,p="";G<=w;p+=d.charAt(C[G++]));p=Le(p,x,d.charAt(0));}return p}}(),t=function(){function l(h,f,y){var b,d,g,x,w=0,v=h.length,R=f%Qe,C=f/Qe|0;for(h=h.slice();v--;)g=h[v]%Qe,x=h[v]/Qe|0,b=C*g+x*R,d=R*g+b%Qe*Qe+w,w=(d/y|0)+(b/Qe|0)+C*x,h[v]=d%y;return w&&(h=[w].concat(h)),h}function c(h,f,y,b){var d,g;if(y!=b)g=y>b?1:-1;else for(d=g=0;d<y;d++)if(h[d]!=f[d]){g=h[d]>f[d]?1:-1;break}return g}function p(h,f,y,b){for(var d=0;y--;)h[y]-=d,d=h[y]<f[y]?1:0,h[y]=d*b+h[y]-f[y];for(;!h[0]&&h.length>1;h.splice(0,1));}return function(h,f,y,b,d){var g,x,w,v,R,C,$,G,W,F,U,oe,wr,Sn,An,Ce,Ot,me=h.s==f.s?1:-1,se=h.c,z=f.c;if(!se||!se[0]||!z||!z[0])return new E(!h.s||!f.s||(se?z&&se[0]==z[0]:!z)?NaN:se&&se[0]==0||!z?me*0:me/0);for(G=new E(me),W=G.c=[],x=h.e-f.e,me=y+x+1,d||(d=Re,x=we(h.e/N)-we(f.e/N),me=me/N|0),w=0;z[w]==(se[w]||0);w++);if(z[w]>(se[w]||0)&&x--,me<0)W.push(1),v=true;else {for(Sn=se.length,Ce=z.length,w=0,me+=2,R=he(d/(z[0]+1)),R>1&&(z=l(z,R,d),se=l(se,R,d),Ce=z.length,Sn=se.length),wr=Ce,F=se.slice(0,Ce),U=F.length;U<Ce;F[U++]=0);Ot=z.slice(),Ot=[0].concat(Ot),An=z[0],z[1]>=d/2&&An++;do{if(R=0,g=c(z,F,Ce,U),g<0){if(oe=F[0],Ce!=U&&(oe=oe*d+(F[1]||0)),R=he(oe/An),R>1)for(R>=d&&(R=d-1),C=l(z,R,d),$=C.length,U=F.length;c(C,F,$,U)==1;)R--,p(C,Ce<$?Ot:z,$,d),$=C.length,g=1;else R==0&&(g=R=1),C=z.slice(),$=C.length;if($<U&&(C=[0].concat(C)),p(F,C,U,d),U=F.length,g==-1)for(;c(z,F,Ce,U)<1;)R++,p(F,Ce<U?Ot:z,U,d),U=F.length;}else g===0&&(R++,F=[0]);W[w++]=R,F[0]?F[U++]=se[wr]||0:(F=[se[wr]],U=1);}while((wr++<Sn||F[0]!=null)&&me--);v=F[0]!=null,W[0]||W.splice(0,1);}if(d==Re){for(w=1,me=W[0];me>=10;me/=10,w++);ie(G,y+(G.e=w+x*N-1)+1,b,v);}else G.e=x,G.r=+v;return G}}();function D(l,c,p,h){var f,y,b,d,g;if(p==null?p=a:J(p,0,8),!l.c)return l.toString();if(f=l.c[0],b=l.e,c==null)g=ye(l.c),g=h==1||h==2&&(b<=u||b>=m)?tn(g,b):Le(g,b,"0");else if(l=ie(new E(l),c,p),y=l.e,g=ye(l.c),d=g.length,h==1||h==2&&(c<=y||y<=u)){for(;d<c;g+="0",d++);g=tn(g,y);}else if(c-=b+(h===2&&y>b),g=Le(g,y,"0"),y+1>d){if(--c>0)for(g+=".";c--;g+="0");}else if(c+=y-d,c>0)for(y+1==d&&(g+=".");c--;g+="0");return l.s<0&&f?"-"+g:g}function H(l,c){for(var p,h,f=1,y=new E(l[0]);f<l.length;f++)h=new E(l[f]),(!h.s||(p=Xe(y,h))===c||p===0&&y.s===c)&&(y=h);return y}function ce(l,c,p){for(var h=1,f=c.length;!c[--f];c.pop());for(f=c[0];f>=10;f/=10,h++);return (p=h+p*N-1)>T?l.c=l.e=null:p<P?l.c=[l.e=0]:(l.e=p,l.c=c),l}n=function(){var l=/^(-?)0([xbo])(?=\w[\w.]*$)/i,c=/^([^.]+)\.$/,p=/^\.([^.]+)$/,h=/^-?(Infinity|NaN)$/,f=/^\s*\+(?=[\w.])|^\s+|\s+$/g;return function(y,b,d,g){var x,w=d?b:b.replace(f,"");if(h.test(w))y.s=isNaN(w)?null:w<0?-1:1;else {if(!d&&(w=w.replace(l,function(v,R,C){return x=(C=C.toLowerCase())=="x"?16:C=="b"?2:8,!g||g==x?R:v}),g&&(x=g,w=w.replace(c,"$1").replace(p,"0.$1")),b!=w))return new E(w,x);if(E.DEBUG)throw Error(le+"Not a"+(g?" base "+g:"")+" number: "+b);y.s=null;}y.c=y.e=null;}}();function ie(l,c,p,h){var f,y,b,d,g,x,w,v=l.c,R=fi;if(v){e:{for(f=1,d=v[0];d>=10;d/=10,f++);if(y=c-f,y<0)y+=N,b=c,g=v[x=0],w=he(g/R[f-b-1]%10);else if(x=di((y+1)/N),x>=v.length)if(h){for(;v.length<=x;v.push(0));g=w=0,f=1,y%=N,b=y-N+1;}else break e;else {for(g=d=v[x],f=1;d>=10;d/=10,f++);y%=N,b=y-N+f,w=b<0?0:he(g/R[f-b-1]%10);}if(h=h||c<0||v[x+1]!=null||(b<0?g:g%R[f-b-1]),h=p<4?(w||h)&&(p==0||p==(l.s<0?3:2)):w>5||w==5&&(p==4||h||p==6&&(y>0?b>0?g/R[f-b]:0:v[x-1])%10&1||p==(l.s<0?8:7)),c<1||!v[0])return v.length=0,h?(c-=l.e+1,v[0]=R[(N-c%N)%N],l.e=-c||0):v[0]=l.e=0,l;if(y==0?(v.length=x,d=1,x--):(v.length=x+1,d=R[N-y],v[x]=b>0?he(g/R[f-b]%R[b])*d:0),h)for(;;)if(x==0){for(y=1,b=v[0];b>=10;b/=10,y++);for(b=v[0]+=d,d=1;b>=10;b/=10,d++);y!=d&&(l.e++,v[0]==Re&&(v[0]=1));break}else {if(v[x]+=d,v[x]!=Re)break;v[x--]=0,d=1;}for(y=v.length;v[--y]===0;v.pop());}l.e>T?l.c=l.e=null:l.e<P&&(l.c=[l.e=0]);}return l}function be(l){var c,p=l.e;return p===null?l.toString():(c=ye(l.c),c=p<=u||p>=m?tn(c,p):Le(c,p,"0"),l.s<0?"-"+c:c)}return i.absoluteValue=i.abs=function(){var l=new E(this);return l.s<0&&(l.s=1),l},i.comparedTo=function(l,c){return Xe(this,new E(l,c))},i.decimalPlaces=i.dp=function(l,c){var p,h,f,y=this;if(l!=null)return J(l,0,Y),c==null?c=a:J(c,0,8),ie(new E(y),l+y.e+1,c);if(!(p=y.c))return null;if(h=((f=p.length-1)-we(this.e/N))*N,f=p[f])for(;f%10==0;f/=10,h--);return h<0&&(h=0),h},i.dividedBy=i.div=function(l,c){return t(this,new E(l,c),s,a)},i.dividedToIntegerBy=i.idiv=function(l,c){return t(this,new E(l,c),0,1)},i.exponentiatedBy=i.pow=function(l,c){var p,h,f,y,b,d,g,x,w,v=this;if(l=new E(l),l.c&&!l.isInteger())throw Error(le+"Exponent not an integer: "+be(l));if(c!=null&&(c=new E(c)),d=l.e>14,!v.c||!v.c[0]||v.c[0]==1&&!v.e&&v.c.length==1||!l.c||!l.c[0])return w=new E(Math.pow(+be(v),d?l.s*(2-en(l)):+be(l))),c?w.mod(c):w;if(g=l.s<0,c){if(c.c?!c.c[0]:!c.s)return new E(NaN);h=!g&&v.isInteger()&&c.isInteger(),h&&(v=v.mod(c));}else {if(l.e>9&&(v.e>0||v.e<-1||(v.e==0?v.c[0]>1||d&&v.c[1]>=24e7:v.c[0]<8e13||d&&v.c[0]<=9999975e7)))return y=v.s<0&&en(l)?-0:0,v.e>-1&&(y=1/y),new E(g?1/y:y);A&&(y=di(A/N+2));}for(d?(p=new E(.5),g&&(l.s=1),x=en(l)):(f=Math.abs(+be(l)),x=f%2),w=new E(o);;){if(x){if(w=w.times(v),!w.c)break;y?w.c.length>y&&(w.c.length=y):h&&(w=w.mod(c));}if(f){if(f=he(f/2),f===0)break;x=f%2;}else if(l=l.times(p),ie(l,l.e+1,1),l.e>14)x=en(l);else {if(f=+be(l),f===0)break;x=f%2;}v=v.times(v),y?v.c&&v.c.length>y&&(v.c.length=y):h&&(v=v.mod(c));}return h?w:(g&&(w=o.div(w)),c?w.mod(c):y?ie(w,A,a,b):w)},i.integerValue=function(l){var c=new E(this);return l==null?l=a:J(l,0,8),ie(c,c.e+1,l)},i.isEqualTo=i.eq=function(l,c){return Xe(this,new E(l,c))===0},i.isFinite=function(){return !!this.c},i.isGreaterThan=i.gt=function(l,c){return Xe(this,new E(l,c))>0},i.isGreaterThanOrEqualTo=i.gte=function(l,c){return (c=Xe(this,new E(l,c)))===1||c===0},i.isInteger=function(){return !!this.c&&we(this.e/N)>this.c.length-2},i.isLessThan=i.lt=function(l,c){return Xe(this,new E(l,c))<0},i.isLessThanOrEqualTo=i.lte=function(l,c){return (c=Xe(this,new E(l,c)))===-1||c===0},i.isNaN=function(){return !this.s},i.isNegative=function(){return this.s<0},i.isPositive=function(){return this.s>0},i.isZero=function(){return !!this.c&&this.c[0]==0},i.minus=function(l,c){var p,h,f,y,b=this,d=b.s;if(l=new E(l,c),c=l.s,!d||!c)return new E(NaN);if(d!=c)return l.s=-c,b.plus(l);var g=b.e/N,x=l.e/N,w=b.c,v=l.c;if(!g||!x){if(!w||!v)return w?(l.s=-c,l):new E(v?b:NaN);if(!w[0]||!v[0])return v[0]?(l.s=-c,l):new E(w[0]?b:a==3?-0:0)}if(g=we(g),x=we(x),w=w.slice(),d=g-x){for((y=d<0)?(d=-d,f=w):(x=g,f=v),f.reverse(),c=d;c--;f.push(0));f.reverse();}else for(h=(y=(d=w.length)<(c=v.length))?d:c,d=c=0;c<h;c++)if(w[c]!=v[c]){y=w[c]<v[c];break}if(y&&(f=w,w=v,v=f,l.s=-l.s),c=(h=v.length)-(p=w.length),c>0)for(;c--;w[p++]=0);for(c=Re-1;h>d;){if(w[--h]<v[h]){for(p=h;p&&!w[--p];w[p]=c);--w[p],w[h]+=Re;}w[h]-=v[h];}for(;w[0]==0;w.splice(0,1),--x);return w[0]?ce(l,w,x):(l.s=a==3?-1:1,l.c=[l.e=0],l)},i.modulo=i.mod=function(l,c){var p,h,f=this;return l=new E(l,c),!f.c||!l.s||l.c&&!l.c[0]?new E(NaN):!l.c||f.c&&!f.c[0]?new E(f):(I==9?(h=l.s,l.s=1,p=t(f,l,0,3),l.s=h,p.s*=h):p=t(f,l,0,I),l=f.minus(p.times(l)),!l.c[0]&&I==1&&(l.s=f.s),l)},i.multipliedBy=i.times=function(l,c){var p,h,f,y,b,d,g,x,w,v,R,C,$,G,W,F=this,U=F.c,oe=(l=new E(l,c)).c;if(!U||!oe||!U[0]||!oe[0])return !F.s||!l.s||U&&!U[0]&&!oe||oe&&!oe[0]&&!U?l.c=l.e=l.s=null:(l.s*=F.s,!U||!oe?l.c=l.e=null:(l.c=[0],l.e=0)),l;for(h=we(F.e/N)+we(l.e/N),l.s*=F.s,g=U.length,v=oe.length,g<v&&($=U,U=oe,oe=$,f=g,g=v,v=f),f=g+v,$=[];f--;$.push(0));for(G=Re,W=Qe,f=v;--f>=0;){for(p=0,R=oe[f]%W,C=oe[f]/W|0,b=g,y=f+b;y>f;)x=U[--b]%W,w=U[b]/W|0,d=C*x+w*R,x=R*x+d%W*W+$[y]+p,p=(x/G|0)+(d/W|0)+C*w,$[y--]=x%G;$[y]=p;}return p?++h:$.splice(0,1),ce(l,$,h)},i.negated=function(){var l=new E(this);return l.s=-l.s||null,l},i.plus=function(l,c){var p,h=this,f=h.s;if(l=new E(l,c),c=l.s,!f||!c)return new E(NaN);if(f!=c)return l.s=-c,h.minus(l);var y=h.e/N,b=l.e/N,d=h.c,g=l.c;if(!y||!b){if(!d||!g)return new E(f/0);if(!d[0]||!g[0])return g[0]?l:new E(d[0]?h:f*0)}if(y=we(y),b=we(b),d=d.slice(),f=y-b){for(f>0?(b=y,p=g):(f=-f,p=d),p.reverse();f--;p.push(0));p.reverse();}for(f=d.length,c=g.length,f-c<0&&(p=g,g=d,d=p,c=f),f=0;c;)f=(d[--c]=d[c]+g[c]+f)/Re|0,d[c]=Re===d[c]?0:d[c]%Re;return f&&(d=[f].concat(d),++b),ce(l,d,b)},i.precision=i.sd=function(l,c){var p,h,f,y=this;if(l!=null&&l!==!!l)return J(l,1,Y),c==null?c=a:J(c,0,8),ie(new E(y),l,c);if(!(p=y.c))return null;if(f=p.length-1,h=f*N+1,f=p[f]){for(;f%10==0;f/=10,h--);for(f=p[0];f>=10;f/=10,h++);}return l&&y.e+1>h&&(h=y.e+1),h},i.shiftedBy=function(l){return J(l,-mi,mi),this.times("1e"+l)},i.squareRoot=i.sqrt=function(){var l,c,p,h,f,y=this,b=y.c,d=y.s,g=y.e,x=s+4,w=new E("0.5");if(d!==1||!b||!b[0])return new E(!d||d<0&&(!b||b[0])?NaN:b?y:1/0);if(d=Math.sqrt(+be(y)),d==0||d==1/0?(c=ye(b),(c.length+g)%2==0&&(c+="0"),d=Math.sqrt(+c),g=we((g+1)/2)-(g<0||g%2),d==1/0?c="5e"+g:(c=d.toExponential(),c=c.slice(0,c.indexOf("e")+1)+g),p=new E(c)):p=new E(d+""),p.c[0]){for(g=p.e,d=g+x,d<3&&(d=0);;)if(f=p,p=w.times(f.plus(t(y,f,x,1))),ye(f.c).slice(0,d)===(c=ye(p.c)).slice(0,d))if(p.e<g&&--d,c=c.slice(d-3,d+1),c=="9999"||!h&&c=="4999"){if(!h&&(ie(f,f.e+s+2,0),f.times(f).eq(y))){p=f;break}x+=4,d+=4,h=1;}else {(!+c||!+c.slice(1)&&c.charAt(0)=="5")&&(ie(p,p.e+s+2,1),l=!p.times(p).eq(y));break}}return ie(p,p.e+s+1,a,l)},i.toExponential=function(l,c){return l!=null&&(J(l,0,Y),l++),D(this,l,c,1)},i.toFixed=function(l,c){return l!=null&&(J(l,0,Y),l=l+this.e+1),D(this,l,c)},i.toFormat=function(l,c,p){var h,f=this;if(p==null)l!=null&&c&&typeof c=="object"?(p=c,c=null):l&&typeof l=="object"?(p=l,l=c=null):p=M;else if(typeof p!="object")throw Error(le+"Argument not an object: "+p);if(h=f.toFixed(l,c),f.c){var y,b=h.split("."),d=+p.groupSize,g=+p.secondaryGroupSize,x=p.groupSeparator||"",w=b[0],v=b[1],R=f.s<0,C=R?w.slice(1):w,$=C.length;if(g&&(y=d,d=g,g=y,$-=y),d>0&&$>0){for(y=$%d||d,w=C.substr(0,y);y<$;y+=d)w+=x+C.substr(y,d);g>0&&(w+=x+C.slice(y)),R&&(w="-"+w);}h=v?w+(p.decimalSeparator||"")+((g=+p.fractionGroupSize)?v.replace(new RegExp("\\d{"+g+"}\\B","g"),"$&"+(p.fractionGroupSeparator||"")):v):w;}return (p.prefix||"")+h+(p.suffix||"")},i.toFraction=function(l){var c,p,h,f,y,b,d,g,x,w,v,R,C=this,$=C.c;if(l!=null&&(d=new E(l),!d.isInteger()&&(d.c||d.s!==1)||d.lt(o)))throw Error(le+"Argument "+(d.isInteger()?"out of range: ":"not an integer: ")+be(d));if(!$)return new E(C);for(c=new E(o),x=p=new E(o),h=g=new E(o),R=ye($),y=c.e=R.length-C.e-1,c.c[0]=fi[(b=y%N)<0?N+b:b],l=!l||d.comparedTo(c)>0?y>0?c:x:d,b=T,T=1/0,d=new E(R),g.c[0]=0;w=t(d,c,0,1),f=p.plus(w.times(h)),f.comparedTo(l)!=1;)p=h,h=f,x=g.plus(w.times(f=x)),g=f,c=d.minus(w.times(f=c)),d=f;return f=t(l.minus(p),h,0,1),g=g.plus(f.times(x)),p=p.plus(f.times(h)),g.s=x.s=C.s,y=y*2,v=t(x,h,y,a).minus(C).abs().comparedTo(t(g,p,y,a).minus(C).abs())<1?[x,h]:[g,p],T=b,v},i.toNumber=function(){return +be(this)},i.toPrecision=function(l,c){return l!=null&&J(l,1,Y),D(this,l,c,2)},i.toString=function(l){var c,p=this,h=p.s,f=p.e;return f===null?h?(c="Infinity",h<0&&(c="-"+c)):c="NaN":(l==null?c=f<=u||f>=m?tn(ye(p.c),f):Le(ye(p.c),f,"0"):l===10&&q?(p=ie(new E(p),s+f+1,a),c=Le(ye(p.c),p.e,"0")):(J(l,2,L.length,"Base"),c=r(Le(ye(p.c),f,"0"),10,l,h,true)),h<0&&p.c[0]&&(c="-"+c)),c},i.valueOf=i.toJSON=function(){return be(this)},i._isBigNumber=true,i[Symbol.toStringTag]="BigNumber",i[Symbol.for("nodejs.util.inspect.custom")]=i.valueOf,e!=null&&E.set(e),E}function we(e){var t=e|0;return e>0||e===t?t:t-1}function ye(e){for(var t,r,n=1,i=e.length,o=e[0]+"";n<i;){for(t=e[n++]+"",r=N-t.length;r--;t="0"+t);o+=t;}for(i=o.length;o.charCodeAt(--i)===48;);return o.slice(0,i+1||1)}function Xe(e,t){var r,n,i=e.c,o=t.c,s=e.s,a=t.s,u=e.e,m=t.e;if(!s||!a)return null;if(r=i&&!i[0],n=o&&!o[0],r||n)return r?n?0:-a:s;if(s!=a)return s;if(r=s<0,n=u==m,!i||!o)return n?0:!i^r?1:-1;if(!n)return u>m^r?1:-1;for(a=(u=i.length)<(m=o.length)?u:m,s=0;s<a;s++)if(i[s]!=o[s])return i[s]>o[s]^r?1:-1;return u==m?0:u>m^r?1:-1}function J(e,t,r,n){if(e<t||e>r||e!==he(e))throw Error(le+(n||"Argument")+(typeof e=="number"?e<t||e>r?" out of range: ":" not an integer: ":" not a primitive number: ")+String(e))}function en(e){var t=e.c.length-1;return we(e.e/N)==t&&e.c[t]%2!=0}function tn(e,t){return (e.length>1?e.charAt(0)+"."+e.slice(1):e)+(t<0?"e":"e+")+t}function Le(e,t,r){var n,i;if(t<0){for(i=r+".";++t;i+=r);e=i+e;}else if(n=e.length,++t>n){for(i=r,t-=n;--t;i+=r);e+=i;}else t<n&&(e=e.slice(0,t)+"."+e.slice(t));return e}var id=Ta(),va=id;var od=24,or=32,sd=()=>typeof globalThis<"u"&&globalThis.crypto&&typeof globalThis.crypto.getRandomValues=="function"?()=>{let e=new Uint32Array(1);return globalThis.crypto.getRandomValues(e),e[0]/4294967296}:Math.random,yi=sd(),gi=(e=4,t=yi)=>{let r="";for(;r.length<e;)r=r+Math.floor(t()*36).toString(36);return r};function ad(e){let t=new va(0);for(let r of e.values())t=t.multipliedBy(256).plus(r);return t}var Aa=(e="")=>{let t=new TextEncoder;return ad(Pa(t.encode(e))).toString(36).slice(1)},Sa=Array.from({length:26},(e,t)=>String.fromCharCode(t+97)),ld=e=>Sa[Math.floor(e()*Sa.length)],ud=({globalObj:e=typeof commonjsGlobal<"u"?commonjsGlobal:{},random:t=yi}={})=>{let r=Object.keys(e).toString(),n=r.length?r+gi(or,t):gi(or,t);return Aa(n).substring(0,or)},cd=e=>()=>e++,pd=476782367,Ra=({random:e=yi,counter:t=cd(Math.floor(e()*pd)),length:r=od,fingerprint:n=ud({random:e})}={})=>{if(r>or)throw new Error(`Length must be between 2 and ${or}. Received: ${r}`);return function(){let o=ld(e),s=Date.now().toString(36),a=t().toString(36),u=gi(r,e),m=`${s+u+a+n}`;return `${o+Aa(m).substring(1,r)}`}},hi=dd(Ra);function dd(e){let t;return ()=>(t||(t=e()),t())}var wi=require$$6;var Ca="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";var md=128,Je,At;function fd(e){if(e<0)throw new RangeError("Wrong ID size");try{!Je||Je.length<e?(Je=Buffer.allocUnsafe(e*md),wi.webcrypto.getRandomValues(Je),At=0):At+e>Je.length&&(wi.webcrypto.getRandomValues(Je),At=0);}catch(t){throw Je=void 0,t}At+=e;}function xi(e=21){fd(e|=0);let t="";for(let r=At-e;r<At;r++)t+=Ca[Je[r]&63];return t}var sr=Pe(require$$6,1);var ka="0123456789ABCDEFGHJKMNPQRSTVWXYZ",ar=32;var gd=16,Oa=10,Ia=0xffffffffffff;var Ye;(function(e){e.Base32IncorrectEncoding="B32_ENC_INVALID",e.DecodeTimeInvalidCharacter="DEC_TIME_CHAR",e.DecodeTimeValueMalformed="DEC_TIME_MALFORMED",e.EncodeTimeNegative="ENC_TIME_NEG",e.EncodeTimeSizeExceeded="ENC_TIME_SIZE_EXCEED",e.EncodeTimeValueMalformed="ENC_TIME_MALFORMED",e.PRNGDetectFailure="PRNG_DETECT",e.ULIDInvalid="ULID_INVALID",e.Unexpected="UNEXPECTED",e.UUIDInvalid="UUID_INVALID";})(Ye||(Ye={}));var et=class extends Error{constructor(t,r){super(`${r} (${t})`),this.name="ULIDError",this.code=t;}};function yd(e){let t=Math.floor(e()*ar);return t===ar&&(t=ar-1),ka.charAt(t)}function hd(e){let t=wd(),r=t&&(t.crypto||t.msCrypto)||(typeof sr.default<"u"?sr.default:null);if(typeof r?.getRandomValues=="function")return ()=>{let n=new Uint8Array(1);return r.getRandomValues(n),n[0]/255};if(typeof r?.randomBytes=="function")return ()=>r.randomBytes(1).readUInt8()/255;if(sr.default?.randomBytes)return ()=>sr.default.randomBytes(1).readUInt8()/255;throw new et(Ye.PRNGDetectFailure,"Failed to find a reliable PRNG")}function wd(){return Pd()?self:typeof commonjsGlobal<"u"?commonjsGlobal:typeof globalThis<"u"?globalThis:null}function xd(e,t){let r="";for(;e>0;e--)r=yd(t)+r;return r}function bd(e,t=Oa){if(isNaN(e))throw new et(Ye.EncodeTimeValueMalformed,`Time must be a number: ${e}`);if(e>Ia)throw new et(Ye.EncodeTimeSizeExceeded,`Cannot encode a time larger than ${Ia}: ${e}`);if(e<0)throw new et(Ye.EncodeTimeNegative,`Time must be positive: ${e}`);if(Number.isInteger(e)===false)throw new et(Ye.EncodeTimeValueMalformed,`Time must be an integer: ${e}`);let r,n="";for(let i=t;i>0;i--)r=e%ar,n=ka.charAt(r)+n,e=(e-r)/ar;return n}function Pd(){return typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope}function Na(e,t){let r=hd(),n=Date.now();return bd(n,Oa)+xd(gd,r)}var te=[];for(let e=0;e<256;++e)te.push((e+256).toString(16).slice(1));function rn(e,t=0){return (te[e[t+0]]+te[e[t+1]]+te[e[t+2]]+te[e[t+3]]+"-"+te[e[t+4]]+te[e[t+5]]+"-"+te[e[t+6]]+te[e[t+7]]+"-"+te[e[t+8]]+te[e[t+9]]+"-"+te[e[t+10]]+te[e[t+11]]+te[e[t+12]]+te[e[t+13]]+te[e[t+14]]+te[e[t+15]]).toLowerCase()}var Ed=new Uint8Array(16);function Rt(){return crypto.getRandomValues(Ed)}function Td(e,t,r){return !t&&!e&&crypto.randomUUID?crypto.randomUUID():vd(e,t,r)}function vd(e,t,r){e=e||{};let n=e.random??e.rng?.()??Rt();if(n.length<16)throw new Error("Random bytes length must be >= 16");if(n[6]=n[6]&15|64,n[8]=n[8]&63|128,t){if(r=r||0,r<0||r+16>t.length)throw new RangeError(`UUID byte range ${r}:${r+15} is out of buffer bounds`);for(let i=0;i<16;++i)t[r+i]=n[i];return t}return rn(n)}var bi=Td;var Pi={};function Sd(e,t,r){let n;if(e)n=Da(e.random??e.rng?.()??Rt(),e.msecs,e.seq,t,r);else {let i=Date.now(),o=Rt();Ad(Pi,i,o),n=Da(o,Pi.msecs,Pi.seq,t,r);}return t??rn(n)}function Ad(e,t,r){return e.msecs??=-1/0,e.seq??=0,t>e.msecs?(e.seq=r[6]<<23|r[7]<<16|r[8]<<8|r[9],e.msecs=t):(e.seq=e.seq+1|0,e.seq===0&&e.msecs++),e}function Da(e,t,r,n,i=0){if(e.length<16)throw new Error("Random bytes length must be >= 16");if(!n)n=new Uint8Array(16),i=0;else if(i<0||i+16>n.length)throw new RangeError(`UUID byte range ${i}:${i+15} is out of buffer bounds`);return t??=Date.now(),r??=e[6]*127<<24|e[7]<<16|e[8]<<8|e[9],n[i++]=t/1099511627776&255,n[i++]=t/4294967296&255,n[i++]=t/16777216&255,n[i++]=t/65536&255,n[i++]=t/256&255,n[i++]=t&255,n[i++]=112|r>>>28&15,n[i++]=r>>>20&255,n[i++]=128|r>>>14&63,n[i++]=r>>>6&255,n[i++]=r<<2&255|e[10]&3,n[i++]=e[11],n[i++]=e[12],n[i++]=e[13],n[i++]=e[14],n[i++]=e[15],n}var Ei=Sd;var nn=class{#e={};constructor(){this.register("uuid",new vi),this.register("cuid",new Si),this.register("ulid",new Ai),this.register("nanoid",new Ri),this.register("product",new Ci);}snapshot(){return Object.create(this.#e,{now:{value:new Ti}})}register(t,r){this.#e[t]=r;}},Ti=class{#e;generate(){return this.#e===void 0&&(this.#e=new Date),this.#e.toISOString()}},vi=class{generate(t){if(t===4)return bi();if(t===7)return Ei();throw new Error("Invalid UUID generator arguments")}},Si=class{generate(t){if(t===1)return ia();if(t===2)return hi();throw new Error("Invalid CUID generator arguments")}},Ai=class{generate(){return Na()}},Ri=class{generate(t){if(typeof t=="number")return xi(t);if(t===void 0)return xi();throw new Error("Invalid Nanoid generator arguments")}},Ci=class{generate(t,r){if(t===void 0||r===void 0)throw new Error("Invalid Product generator arguments");return Array.isArray(t)&&Array.isArray(r)?t.flatMap(n=>r.map(i=>[n,i])):Array.isArray(t)?t.map(n=>[n,r]):Array.isArray(r)?r.map(n=>[t,n]):[[t,r]]}};function lr(e,t){return e==null?e:typeof e=="string"?lr(JSON.parse(e),t):Array.isArray(e)?Cd(e,t):Rd(e,t)}function Rd(e,t){if(t.pagination){let{skip:r,take:n,cursor:i}=t.pagination;if(r!==null&&r>0||n===0||i!==null&&!St(e,i))return null}return Fa(e,t.nested)}function Fa(e,t){for(let[r,n]of Object.entries(t))e[r]=lr(e[r],n);return e}function Cd(e,t){if(t.distinct!==null){let r=t.linkingFields!==null?[...t.distinct,...t.linkingFields]:t.distinct;e=Id(e,r);}return t.pagination&&(e=kd(e,t.pagination,t.linkingFields)),t.reverse&&e.reverse(),Object.keys(t.nested).length===0?e:e.map(r=>Fa(r,t.nested))}function Id(e,t){let r=new Set,n=[];for(let i of e){let o=tt(i,t);r.has(o)||(r.add(o),n.push(i));}return n}function kd(e,t,r){if(r===null)return Ma(e,t);let n=new Map;for(let o of e){let s=tt(o,r);n.has(s)||n.set(s,[]),n.get(s).push(o);}let i=Array.from(n.entries());return i.sort(([o],[s])=>o<s?-1:o>s?1:0),i.flatMap(([,o])=>Ma(o,t))}function Ma(e,{cursor:t,skip:r,take:n}){let i=t!==null?e.findIndex(a=>St(a,t)):0;if(i===-1)return [];let o=i+(r??0),s=n!==null?o+n:e.length;return e.slice(o,s)}function tt(e,t,r){let n=t.map((i,o)=>r?.[o]?e[i]!==null?r[o](e[i]):null:e[i]);return JSON.stringify(n)}function Ii(e){return typeof e=="object"&&e!==null&&e.prisma__type==="param"}function ki(e){return typeof e=="object"&&e!==null&&e.prisma__type==="generatorCall"}function Di(e,t,r,n){let i=e.args.map(o=>de(o,t,r));switch(e.type){case "rawSql":return [Dd(e.sql,i,e.argTypes)];case "templateSql":return (e.chunkable?Fd(e.fragments,i,n):[i]).map(s=>{let a=Od(e.fragments,e.placeholderFormat,s,e.argTypes);if(n!==void 0&&a.args.length>n)throw new X("The query parameter limit supported by your database is exceeded.","P2029");return a});default:V(e.type,"Invalid query type");}}function de(e,t,r){for(;Md(e);)if(Ii(e)){let n=t[e.prisma__value.name];if(n===void 0)throw new Error(`Missing value for query variable ${e.prisma__value.name}`);e.prisma__value.type==="DateTime"&&typeof n=="string"?e=new Date(n):e=n;}else if(ki(e)){let{name:n,args:i}=e.prisma__value,o=r[n];if(!o)throw new Error(`Encountered an unknown generator '${n}'`);e=o.generate(...i.map(s=>de(s,t,r)));}else V(e,`Unexpected unevaluated value type: ${e}`);return Array.isArray(e)&&(e=e.map(n=>de(n,t,r))),e}function Od(e,t,r,n){let i="",o={placeholderNumber:1},s=[],a=[];for(let u of Ni(e,r,n)){if(i+=Nd(u,t,o),u.type==="stringChunk")continue;let m=Array.from(_a(u)),P=m.length;if(Gr(s,m),u.argType.arity==="tuple"){if(P%u.argType.elements.length!==0)throw new Error(`Malformed query template. Expected the number of parameters to match the tuple arity, but got ${P} parameters for a tuple of arity ${u.argType.elements.length}.`);for(let T=0;T<P/u.argType.elements.length;T++)a.push(...u.argType.elements);}else for(let T=0;T<P;T++)a.push(u.argType);}return {sql:i,args:s,argTypes:a}}function Nd(e,t,r){let n=e.type;switch(n){case "parameter":return Oi(t,r.placeholderNumber++);case "stringChunk":return e.chunk;case "parameterTuple":return `(${e.value.length==0?"NULL":e.value.map(()=>{let o=Oi(t,r.placeholderNumber++);return `${e.itemPrefix}${o}${e.itemSuffix}`}).join(e.itemSeparator)})`;case "parameterTupleList":return e.value.map(i=>{let o=i.map(()=>Oi(t,r.placeholderNumber++)).join(e.itemSeparator);return `${e.itemPrefix}${o}${e.itemSuffix}`}).join(e.groupSeparator);default:V(n,"Invalid fragment type");}}function Oi(e,t){return e.hasNumbering?`${e.prefix}${t}`:e.prefix}function Dd(e,t,r){return {sql:e,args:t,argTypes:r}}function Md(e){return Ii(e)||ki(e)}function*Ni(e,t,r){let n=0;for(let i of e)switch(i.type){case "parameter":{if(n>=t.length)throw new Error(`Malformed query template. Fragments attempt to read over ${t.length} parameters.`);yield {...i,value:t[n],argType:r?.[n]},n++;break}case "stringChunk":{yield i;break}case "parameterTuple":{if(n>=t.length)throw new Error(`Malformed query template. Fragments attempt to read over ${t.length} parameters.`);let o=t[n];yield {...i,value:Array.isArray(o)?o:[o],argType:r?.[n]},n++;break}case "parameterTupleList":{if(n>=t.length)throw new Error(`Malformed query template. Fragments attempt to read over ${t.length} parameters.`);let o=t[n];if(!Array.isArray(o))throw new Error("Malformed query template. Tuple list expected.");if(o.length===0)throw new Error("Malformed query template. Tuple list cannot be empty.");for(let s of o)if(!Array.isArray(s))throw new Error("Malformed query template. Tuple expected.");yield {...i,value:o,argType:r?.[n]},n++;break}}}function*_a(e){switch(e.type){case "parameter":yield e.value;break;case "stringChunk":break;case "parameterTuple":yield*e.value;break;case "parameterTupleList":for(let t of e.value)yield*t;break}}function Fd(e,t,r){let n=0,i=0;for(let s of Ni(e,t,void 0)){let a=0;for(let u of _a(s))a++;i=Math.max(i,a),n+=a;}let o=[[]];for(let s of Ni(e,t,void 0))switch(s.type){case "parameter":{for(let a of o)a.push(s.value);break}case "stringChunk":break;case "parameterTuple":{let a=s.value.length,u=[];if(r&&o.length===1&&a===i&&n>r&&n-a<r){let m=r-(n-a);u=_d(s.value,m);}else u=[s.value];o=o.flatMap(m=>u.map(P=>[...m,P]));break}case "parameterTupleList":{let a=s.value.reduce((T,S)=>T+S.length,0),u=[],m=[],P=0;for(let T of s.value)r&&o.length===1&&a===i&&m.length>0&&n-a+P+T.length>r&&(u.push(m),m=[],P=0),m.push(T),P+=T.length;m.length>0&&u.push(m),o=o.flatMap(T=>u.map(S=>[...T,S]));break}}return o}function _d(e,t){let r=[];for(let n=0;n<e.length;n+=t)r.push(e.slice(n,n+t));return r}function $a(e){return e.rows.map(t=>t.reduce((r,n,i)=>(r[e.columnNames[i]]=n,r),{}))}function La(e){return {columns:e.columnNames,types:e.columnTypes.map(t=>$d(t)),rows:e.rows.map(t=>t.map((r,n)=>ur(r,e.columnTypes[n])))}}function ur(e,t){if(e===null)return null;switch(t){case k.Int32:switch(typeof e){case "number":return Math.trunc(e);case "string":return Math.trunc(Number(e));default:throw new Error(`Cannot serialize value of type ${typeof e} as Int32`)}case k.Int32Array:if(!Array.isArray(e))throw new Error(`Cannot serialize value of type ${typeof e} as Int32Array`);return e.map(r=>ur(r,k.Int32));case k.Int64:switch(typeof e){case "number":return BigInt(Math.trunc(e));case "string":return e;default:throw new Error(`Cannot serialize value of type ${typeof e} as Int64`)}case k.Int64Array:if(!Array.isArray(e))throw new Error(`Cannot serialize value of type ${typeof e} as Int64Array`);return e.map(r=>ur(r,k.Int64));case k.Json:switch(typeof e){case "string":return JSON.parse(e);default:throw new Error(`Cannot serialize value of type ${typeof e} as Json`)}case k.JsonArray:if(!Array.isArray(e))throw new Error(`Cannot serialize value of type ${typeof e} as JsonArray`);return e.map(r=>ur(r,k.Json));case k.Boolean:switch(typeof e){case "boolean":return e;case "string":return e==="true"||e==="1";case "number":return e===1;default:throw new Error(`Cannot serialize value of type ${typeof e} as Boolean`)}case k.BooleanArray:if(!Array.isArray(e))throw new Error(`Cannot serialize value of type ${typeof e} as BooleanArray`);return e.map(r=>ur(r,k.Boolean));default:return e}}function $d(e){switch(e){case k.Int32:return "int";case k.Int64:return "bigint";case k.Float:return "float";case k.Double:return "double";case k.Text:return "string";case k.Enum:return "enum";case k.Bytes:return "bytes";case k.Boolean:return "bool";case k.Character:return "char";case k.Numeric:return "decimal";case k.Json:return "json";case k.Uuid:return "uuid";case k.DateTime:return "datetime";case k.Date:return "date";case k.Time:return "time";case k.Int32Array:return "int-array";case k.Int64Array:return "bigint-array";case k.FloatArray:return "float-array";case k.DoubleArray:return "double-array";case k.TextArray:return "string-array";case k.EnumArray:return "string-array";case k.BytesArray:return "bytes-array";case k.BooleanArray:return "bool-array";case k.CharacterArray:return "char-array";case k.NumericArray:return "decimal-array";case k.JsonArray:return "json-array";case k.UuidArray:return "uuid-array";case k.DateTimeArray:return "datetime-array";case k.DateArray:return "date-array";case k.TimeArray:return "time-array";case k.UnknownNumber:return "unknown";case k.Set:return "string";default:V(e,`Unexpected column type: ${e}`);}}function Mi(e,t,r){if(!t.every(n=>on(e,n))){let n=Ld(e,r),i=Vd(r);throw new X(n,i,r.context)}}function on(e,t){switch(t.type){case "rowCountEq":return Array.isArray(e)?e.length===t.args:e===null?t.args===0:t.args===1;case "rowCountNeq":return Array.isArray(e)?e.length!==t.args:e===null?t.args!==0:t.args!==1;case "affectedRowCountEq":return e===t.args;case "never":return  false;default:V(t,`Unknown rule type: ${t.type}`);}}function Ld(e,t){switch(t.errorIdentifier){case "RELATION_VIOLATION":return `The change you are trying to make would violate the required relation '${t.context.relation}' between the \`${t.context.modelA}\` and \`${t.context.modelB}\` models.`;case "MISSING_RECORD":return `An operation failed because it depends on one or more records that were required but not found. No record was found for ${t.context.operation}.`;case "MISSING_RELATED_RECORD":{let r=t.context.neededFor?` (needed to ${t.context.neededFor})`:"";return `An operation failed because it depends on one or more records that were required but not found. No '${t.context.model}' record${r} was found for ${t.context.operation} on ${t.context.relationType} relation '${t.context.relation}'.`}case "INCOMPLETE_CONNECT_INPUT":return `An operation failed because it depends on one or more records that were required but not found. Expected ${t.context.expectedRows} records to be connected, found only ${Array.isArray(e)?e.length:e}.`;case "INCOMPLETE_CONNECT_OUTPUT":return `The required connected records were not found. Expected ${t.context.expectedRows} records to be connected after connect operation on ${t.context.relationType} relation '${t.context.relation}', found ${Array.isArray(e)?e.length:e}.`;case "RECORDS_NOT_CONNECTED":return `The records for relation \`${t.context.relation}\` between the \`${t.context.parent}\` and \`${t.context.child}\` models are not connected.`;default:V(t,`Unknown error identifier: ${t}`);}}function Vd(e){switch(e.errorIdentifier){case "RELATION_VIOLATION":return "P2014";case "RECORDS_NOT_CONNECTED":return "P2017";case "INCOMPLETE_CONNECT_OUTPUT":return "P2018";case "MISSING_RECORD":case "MISSING_RELATED_RECORD":case "INCOMPLETE_CONNECT_INPUT":return "P2025";default:V(e,`Unknown error identifier: ${e}`);}}var qd=K("prisma:client:queryInterpreter"),dr=class e{#e;#t=new nn;#r;#i;#o;#s;#a;constructor({onQuery:t,tracingHelper:r,serializer:n,rawSerializer:i,provider:o,connectionInfo:s}){this.#e=t,this.#r=r,this.#i=n,this.#o=i??n,this.#s=o,this.#a=s;}static forSql(t){return new e({onQuery:t.onQuery,tracingHelper:t.tracingHelper,serializer:$a,rawSerializer:La,provider:t.provider,connectionInfo:t.connectionInfo})}async run(t,r){let n=this.#t.snapshot(),i={...r,generators:n},o=jd(t,a=>this.interpretNode(a,i))?.catch(a=>Be(a));if(o)try{return this.#n(await o,i.scope,n).value}catch(a){Be(a);}let{value:s}=await this.interpretNode(t,i).catch(a=>Be(a));return s}async interpretNode(t,r){switch(t.type){case "value":return {value:de(t.args,r.scope,r.generators),lastInsertId:t.lastInsertId};case "seq":{let n;for(let i of t.args)n=await this.interpretNode(i,r);return n??{value:void 0}}case "let":{let n=Object.create(r.scope);for(let i of t.args.bindings){let{value:o}=await this.interpretNode(i.expr,{...r,scope:n});n[i.name]=o;}return this.interpretNode(t.args.expr,{...r,scope:n})}case "concat":{let n=await Promise.all(t.args.map(i=>this.interpretNode(i,r).then(o=>o.value)));return {value:n.length>0?n.reduce((i,o)=>i.concat(Ct(o)),[]):[]}}case "sum":{let n=await Promise.all(t.args.map(i=>this.interpretNode(i,r).then(o=>o.value)));return {value:n.length>0?n.reduce((i,o)=>xe(i)+xe(o)):0}}case "execute":{let n=Di(t.args,r.scope,r.generators,this.#p());return this.#u(n.length,r,async i=>{let o=0;for(let s of n){let a=ja(s,i.sqlCommenter);o+=await this.#d(a,i.queryable,()=>i.queryable.executeRaw(sn(a)).catch(u=>t.args.type==="rawSql"?ri(u):Be(u)));}return {value:o}})}case "query":{let n=Di(t.args,r.scope,r.generators,this.#p());return this.#u(n.length,r,async i=>{let o;for(let s of n){let a=ja(s,i.sqlCommenter),u=await this.#d(a,i.queryable,()=>i.queryable.queryRaw(sn(a)).catch(m=>t.args.type==="rawSql"?ri(m):Be(m)));o===void 0?o=u:(Gr(o.rows,u.rows),o.lastInsertId=u.lastInsertId);}return {value:t.args.type==="rawSql"?this.#o(o):this.#i(o),lastInsertId:o?.lastInsertId}})}case "reverse":{let{value:n,lastInsertId:i}=await this.interpretNode(t.args,r);return {value:Array.isArray(n)?n.reverse():n,lastInsertId:i}}case "unique":{let{value:n,lastInsertId:i}=await this.interpretNode(t.args,r);if(!Array.isArray(n))return {value:n,lastInsertId:i};if(n.length>1)throw new Error(`Expected zero or one element, got ${n.length}`);return {value:n[0]??null,lastInsertId:i}}case "required":{let{value:n,lastInsertId:i}=await this.interpretNode(t.args,r);if(Fi(n))throw new Error("Required value is empty");return {value:n,lastInsertId:i}}case "mapField":{let{value:n,lastInsertId:i}=await this.interpretNode(t.args.records,r);return {value:_i(n,t.args.field),lastInsertId:i}}case "join":{let{value:n,lastInsertId:i}=await this.interpretNode(t.args.parent,r);if(n===null)return {value:null,lastInsertId:i};let o=await Promise.all(t.args.children.map(async s=>({joinExpr:s,childRecords:(await this.interpretNode(s.child,r)).value})));return {value:Va(n,o,t.args.canAssumeStrictEquality),lastInsertId:i}}case "transaction":return this.#l(r,n=>this.interpretNode(t.args,n));case "dataMap":{let{value:n,lastInsertId:i}=await this.interpretNode(t.args.expr,r);return {value:ii(n,t.args.structure,t.args.enums),lastInsertId:i}}case "validate":{let{value:n,lastInsertId:i}=await this.interpretNode(t.args.expr,r);return Mi(n,t.args.rules,t.args),{value:n,lastInsertId:i}}case "if":{let{value:n}=await this.interpretNode(t.args.value,r);return on(n,t.args.rule)?await this.interpretNode(t.args.then,r):await this.interpretNode(t.args.else,r)}case "diff":{let{value:n}=await this.interpretNode(t.args.from,r),{value:i}=await this.interpretNode(t.args.to,r),o=a=>a!==null?tt(rt(a),t.args.fields):null,s=new Set(Ct(i).map(o));return {value:Ct(n).filter(a=>!s.has(o(a)))}}case "process":{let{value:n,lastInsertId:i}=await this.interpretNode(t.args.expr,r),o=sn(t.args.operations);return $i(o,r.scope,r.generators),{value:lr(n,o),lastInsertId:i}}case "initializeRecord":{let{lastInsertId:n}=await this.interpretNode(t.args.expr,r),i={};for(let[o,s]of Object.entries(t.args.fields))i[o]=qa(s,n,r.scope,r.generators);return {value:i,lastInsertId:n}}case "mapRecord":{let{value:n,lastInsertId:i}=await this.interpretNode(t.args.expr,r),o=n===null?{}:rt(n);for(let[s,a]of Object.entries(t.args.fields))o[s]=Ua(a,o[s],r.scope,r.generators);return {value:o,lastInsertId:i}}default:return this.#n(t,r.scope,r.generators)}}#n(t,r,n){switch(t.type){case "value":return {value:de(t.args,r,n),lastInsertId:t.lastInsertId};case "seq":{let i;for(let o of t.args)i=this.#n(o,r,n);return i??{value:void 0}}case "get":return {value:r[t.args.name]};case "let":{let i=Object.create(r);for(let o of t.args.bindings){let{value:s}=this.#n(o.expr,i,n);i[o.name]=s;}return this.#n(t.args.expr,i,n)}case "getFirstNonEmpty":{for(let i of t.args.names){let o=r[i];if(!Fi(o))return {value:o}}return {value:[]}}case "concat":{let i=t.args.map(o=>this.#n(o,r,n).value);return {value:i.length>0?i.reduce((o,s)=>o.concat(Ct(s)),[]):[]}}case "sum":{let i=t.args.map(o=>this.#n(o,r,n).value);return {value:i.length>0?i.reduce((o,s)=>xe(o)+xe(s)):0}}case "reverse":{let{value:i,lastInsertId:o}=this.#n(t.args,r,n);return {value:Array.isArray(i)?i.reverse():i,lastInsertId:o}}case "unique":{let{value:i,lastInsertId:o}=this.#n(t.args,r,n);if(!Array.isArray(i))return {value:i,lastInsertId:o};if(i.length>1)throw new Error(`Expected zero or one element, got ${i.length}`);return {value:i[0]??null,lastInsertId:o}}case "required":{let{value:i,lastInsertId:o}=this.#n(t.args,r,n);if(Fi(i))throw new Error("Required value is empty");return {value:i,lastInsertId:o}}case "mapField":{let{value:i,lastInsertId:o}=this.#n(t.args.records,r,n);return {value:_i(i,t.args.field),lastInsertId:o}}case "join":{let{value:i,lastInsertId:o}=this.#n(t.args.parent,r,n);if(i===null)return {value:null,lastInsertId:o};let s=t.args.children.map(a=>({joinExpr:a,childRecords:this.#n(a.child,r,n).value}));return {value:Va(i,s,t.args.canAssumeStrictEquality),lastInsertId:o}}case "dataMap":{let{value:i,lastInsertId:o}=this.#n(t.args.expr,r,n);return {value:ii(i,t.args.structure,t.args.enums),lastInsertId:o}}case "validate":{let{value:i,lastInsertId:o}=this.#n(t.args.expr,r,n);return Mi(i,t.args.rules,t.args),{value:i,lastInsertId:o}}case "if":{let{value:i}=this.#n(t.args.value,r,n);return on(i,t.args.rule)?this.#n(t.args.then,r,n):this.#n(t.args.else,r,n)}case "unit":return {value:void 0};case "diff":{let{value:i}=this.#n(t.args.from,r,n),{value:o}=this.#n(t.args.to,r,n),s=u=>u!==null?tt(rt(u),t.args.fields):null,a=new Set(Ct(o).map(s));return {value:Ct(i).filter(u=>!a.has(s(u)))}}case "process":{let{value:i,lastInsertId:o}=this.#n(t.args.expr,r,n),s=sn(t.args.operations);return $i(s,r,n),{value:lr(i,s),lastInsertId:o}}case "initializeRecord":{let{lastInsertId:i}=this.#n(t.args.expr,r,n),o={};for(let[s,a]of Object.entries(t.args.fields))o[s]=qa(a,i,r,n);return {value:o,lastInsertId:i}}case "mapRecord":{let{value:i,lastInsertId:o}=this.#n(t.args.expr,r,n),s=i===null?{}:rt(i);for(let[a,u]of Object.entries(t.args.fields))s[a]=Ua(u,s[a],r,n);return {value:s,lastInsertId:o}}default:V(t,`Unexpected node type: ${t.type}`);}}#u(t,r,n){return t<=1?n(r):this.#l(r,n)}async#l(t,r){if(!t.transactionManager.enabled)return r(t);let n=t.transactionManager.manager,i=await n.startInternalTransaction(),o=await n.getTransaction(i,"query");try{let s=await r({...t,queryable:o,transactionManager:{enabled:!1}});return await n.commitTransaction(i.id),s}catch(s){try{await n.rollbackTransaction(i.id);}catch(a){qd("failed to roll back an internal transaction",a);}throw s}}#p(){return this.#a?.maxBindValues!==void 0?this.#a.maxBindValues:this.#c()}#c(){if(this.#s!==void 0)switch(this.#s){case "cockroachdb":case "postgres":case "postgresql":case "prisma+postgres":return 32766;case "mysql":return 65535;case "sqlite":return 999;case "sqlserver":return 2098;case "mongodb":return;default:V(this.#s,`Unexpected provider: ${this.#s}`);}}#d(t,r,n){return Wr({query:t,execute:n,provider:this.#s??r.provider,tracingHelper:this.#r,onQuery:this.#e})}};function Fi(e){return Array.isArray(e)?e.length===0:e==null}function Ct(e){return Array.isArray(e)?e:[e]}function xe(e){if(typeof e=="number")return e;if(typeof e=="string")return Number(e);throw new Error(`Expected number, got ${typeof e}`)}function rt(e){if(typeof e=="object"&&e!==null)return e;throw new Error(`Expected object, got ${typeof e}`)}function _i(e,t){return Array.isArray(e)?e.map(r=>_i(r,t)):typeof e=="object"&&e!==null?e[t]??null:e}function Va(e,t,r){for(let{joinExpr:n,childRecords:i}of t){let o=n.on.map(([P])=>P),s=n.on.map(([,P])=>P),a={},u=Array.isArray(e)?e:[e];for(let P of u){let T=rt(P),S=tt(T,o);a[S]||(a[S]=[]),a[S].push(T),n.isRelationUnique?T[n.parentField]=null:T[n.parentField]=[];}let m=r?void 0:Ud(u,o);for(let P of Array.isArray(i)?i:[i]){if(P===null)continue;let T=tt(rt(P),s,m);for(let S of a[T]??[])n.isRelationUnique?S[n.parentField]=P:S[n.parentField].push(P);}}return e}function Ud(e,t){function r(o){switch(o){case "number":return Number;case "string":return String;case "boolean":return Boolean;case "bigint":return BigInt;default:return}}let n=Array.from({length:t.length}),i=0;for(let o of e){let s=rt(o);for(let[a,u]of t.entries())if(s[u]!==null&&n[a]===void 0){let m=r(typeof s[u]);m!==void 0&&(n[a]=m),i++;}if(i===t.length)break}return n}function qa(e,t,r,n){switch(e.type){case "value":return de(e.value,r,n);case "lastInsertId":return t;default:V(e,`Unexpected field initializer type: ${e.type}`);}}function Ua(e,t,r,n){switch(e.type){case "set":return de(e.value,r,n);case "add":return xe(t)+xe(de(e.value,r,n));case "subtract":return xe(t)-xe(de(e.value,r,n));case "multiply":return xe(t)*xe(de(e.value,r,n));case "divide":{let i=xe(t),o=xe(de(e.value,r,n));return o===0?null:i/o}default:V(e,`Unexpected field operation type: ${e.type}`);}}function jd(e,t){let r=pr(e);if(r)return t(r).then(n=>{let i={type:"value",args:n.value,lastInsertId:n.lastInsertId},o=cr(e,r,i);if(!o)throw new Error("Could not substitute the evaluated impure node into the query plan");return o})}function cr(e,t,r){if(e===t)return r;switch(e.type){case "seq":case "sum":case "concat":{for(let n=0;n<e.args.length;n++){let i=cr(e.args[n],t,r);if(i)return {...e,args:e.args.map((o,s)=>s===n?i:o)}}return}case "dataMap":case "validate":case "initializeRecord":case "mapRecord":case "process":{let n=cr(e.args.expr,t,r);return n&&{...e,args:{...e.args,expr:n}}}case "mapField":{let n=cr(e.args.records,t,r);return n&&{...e,args:{...e.args,records:n}}}case "reverse":case "unique":case "required":{let n=cr(e.args,t,r);return n&&{...e,args:n}}default:return}}function pr(e){switch(e.type){case "query":case "execute":return e;case "seq":case "sum":case "concat":{let t;for(let r of e.args){let n=pr(r);if(n===null)return null;if(n){if(t)return null;t=n;}}return t}case "dataMap":case "validate":case "initializeRecord":case "mapRecord":case "process":return pr(e.args.expr);case "mapField":return pr(e.args.records);case "reverse":case "unique":case "required":return pr(e.args);case "let":case "join":case "diff":case "if":case "transaction":return null;case "value":case "get":case "getFirstNonEmpty":case "unit":return;default:V(e,`Unexpected node type: ${e.type}`);}}function ja(e,t){if(!t||t.plugins.length===0)return e;let r=Ys(t.plugins,{query:t.queryInfo,sql:e.sql});return r?{...e,sql:ea(e.sql,r)}:e}function $i(e,t,r){let n=e.pagination?.cursor;if(n)for(let[i,o]of Object.entries(n))n[i]=de(o,t,r);for(let i of Object.values(e.nested))$i(i,t,r);}function sn(e){return ge(e)}function Ba(e){return new Li(e).deserialize()}function Bd(e){return Buffer.from(e,"base64url")}var Li=class{#e;#t;#r=0;constructor(t){this.#e=t;let r=Bd(t.graph);this.#t=new DataView(r.buffer,r.byteOffset,r.byteLength);}deserialize(){let{inputNodeCount:t,outputNodeCount:r,rootCount:n}=this.#n(),i=this.#u(t),o=this.#l(r),s=this.#p(n);return {strings:this.#e.strings,inputNodes:i,outputNodes:o,roots:s}}#i(){let t=0,r=0,n;do n=this.#t.getUint8(this.#r++),t|=(n&127)<<r,r+=7;while(n>=128);return t}#o(){let t=this.#i();return t===0?void 0:t-1}#s(){let t=this.#t.getUint8(this.#r);return this.#r+=1,t}#a(){let t=this.#t.getUint16(this.#r,true);return this.#r+=2,t}#n(){let t=this.#i(),r=this.#i(),n=this.#i();return {inputNodeCount:t,outputNodeCount:r,rootCount:n}}#u(t){let r=[];for(let n=0;n<t;n++){let i=this.#i(),o={};for(let s=0;s<i;s++){let a=this.#i(),u=this.#a(),m=this.#o(),P=this.#o(),S={flags:this.#s()};u!==0&&(S.scalarMask=u),m!==void 0&&(S.childNodeId=m),P!==void 0&&(S.enumNameIndex=P),o[a]=S;}r.push({edges:o});}return r}#l(t){let r=[];for(let n=0;n<t;n++){let i=this.#i(),o={};for(let s=0;s<i;s++){let a=this.#i(),u=this.#o(),m=this.#o(),P={};u!==void 0&&(P.argsNodeId=u),m!==void 0&&(P.outputNodeId=m),o[a]=P;}r.push({edges:o});}return r}#p(t){let r={};for(let n=0;n<t;n++){let i=this.#i(),o=this.#o(),s=this.#o(),a=this.#e.strings[i],u={};o!==void 0&&(u.argsNodeId=o),s!==void 0&&(u.outputNodeId=s),r[a]=u;}return r}};var mr=class e{#e;#t;#r;constructor(t,r){this.#e=t,this.#r=r,this.#t=new Map;for(let n=0;n<t.strings.length;n++)this.#t.set(t.strings[n],n);}static deserialize(t,r){let n=Ba(t);return new e(n,r)}static fromData(t,r){return new e(t,r)}root(t){let r=this.#e.roots[t];if(r)return {argsNodeId:r.argsNodeId,outputNodeId:r.outputNodeId}}inputNode(t){if(!(t===void 0||t<0||t>=this.#e.inputNodes.length))return {id:t}}outputNode(t){if(!(t===void 0||t<0||t>=this.#e.outputNodes.length))return {id:t}}inputEdge(t,r){if(!t)return;let n=this.#e.inputNodes[t.id];if(!n)return;let i=this.#t.get(r);if(i===void 0)return;let o=n.edges[i];if(o)return {flags:o.flags,childNodeId:o.childNodeId,scalarMask:o.scalarMask??0,enumNameIndex:o.enumNameIndex}}outputEdge(t,r){if(!t)return;let n=this.#e.outputNodes[t.id];if(!n)return;let i=this.#t.get(r);if(i===void 0)return;let o=n.edges[i];if(o)return {argsNodeId:o.argsNodeId,outputNodeId:o.outputNodeId}}enumValues(t){if(t?.enumNameIndex===void 0)return;let r=this.#e.strings[t.enumNameIndex];if(r)return this.#r(r)}getString(t){return this.#e.strings[t]}},Ne={ParamScalar:1,ParamEnum:2,ParamListScalar:4,ListObject:16,Object:32},re={String:1,Int:2,BigInt:4,Float:8,Decimal:16,Boolean:32,DateTime:64,Json:128,Bytes:256};function De(e,t){return (e.flags&t)!==0}function Ge(e){return e.scalarMask}var Qd=new Set(["DateTime","Decimal","BigInt","Bytes","Json","Raw"]);function an(e){if(e==null)return {kind:"null"};if(typeof e=="string")return {kind:"primitive",value:e};if(typeof e=="number")return {kind:"primitive",value:e};if(typeof e=="boolean")return {kind:"primitive",value:e};if(Array.isArray(e))return {kind:"array",items:e};if(typeof e=="object"){let t=e;if("$type"in t&&typeof t.$type=="string"){let r=t.$type;return Qd.has(r)?{kind:"taggedScalar",tag:r,value:t.value}:{kind:"structural",value:t.value}}return {kind:"object",entries:t}}return {kind:"structural",value:e}}function Qa(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)&&!("$type"in e)}function Ja(e){return typeof e=="object"&&e!==null&&"$type"in e&&typeof e.$type=="string"}function Vi(e,t){let r=new ln(t),n=e.modelName?`${e.modelName}.${e.action}`:e.action,i=t.root(n);return {parameterizedQuery:{...e,query:r.parameterizeFieldSelection(e.query,i?.argsNodeId,i?.outputNodeId)},placeholderValues:r.getPlaceholderValues()}}function qi(e,t){let r=new ln(t),n=[];for(let i=0;i<e.batch.length;i++){let o=e.batch[i],s=o.modelName?`${o.modelName}.${o.action}`:o.action,a=t.root(s);n.push({...o,query:r.parameterizeFieldSelection(o.query,a?.argsNodeId,a?.outputNodeId)});}return {parameterizedBatch:{...e,batch:n},placeholderValues:r.getPlaceholderValues()}}var ln=class{#e;#t=new Map;#r=new Map;#i=1;constructor(t){this.#e=t;}getPlaceholderValues(){return Object.fromEntries(this.#t)}#o(t,r){let n=Gd(t,r),i=this.#r.get(n);if(i!==void 0)return Ga(i,r);let o=`%${this.#i++}`;return this.#r.set(n,o),this.#t.set(o,t),Ga(o,r)}parameterizeFieldSelection(t,r,n){let i=this.#e.inputNode(r),o=this.#e.outputNode(n),s={...t};return t.arguments&&t.arguments.$type!=="Raw"&&(s.arguments=this.#s(t.arguments,i)),t.selection&&(s.selection=this.#c(t.selection,o)),s}#s(t,r){if(!r)return t;let n={};for(let[i,o]of Object.entries(t)){let s=this.#e.inputEdge(r,i);s?n[i]=this.#a(o,s):n[i]=o;}return n}#a(t,r){let n=an(t);switch(n.kind){case "null":return t;case "structural":return t;case "primitive":return this.#n(n.value,r);case "taggedScalar":return this.#u(t,n.tag,r);case "array":return this.#l(n.items,t,r);case "object":return this.#p(n.entries,r);default:throw new Error(`Unknown value kind ${n.kind}`)}}#n(t,r){if(De(r,Ne.ParamEnum)&&r.enumNameIndex!==void 0&&typeof t=="string"){let o=this.#e.enumValues(r);if(o&&Object.hasOwn(o,t)){let s={type:"Enum"};return this.#o(o[t],s)}}if(!De(r,Ne.ParamScalar))return t;let n=Ge(r);if(n===0)return t;let i=Ui(t);return Ha(i,n)?(n&re.Json&&(t=JSON.stringify(t)),this.#o(t,i)):t}#u(t,r,n){if(!De(n,Ne.ParamScalar))return t;let i=Ge(n);if(i===0||!Ka(r,i))return t;let o=Wa(t.$type),s=Za(t);return this.#o(s,o)}#l(t,r,n){if(De(n,Ne.ParamScalar)&&Ge(n)&re.Json){let i=Se(Ae(t)),o={type:"Json"};return this.#o(i,o)}if(De(n,Ne.ParamEnum)){let i=this.#e.enumValues(n);if(i&&t.every(o=>typeof o=="string"&&Object.hasOwn(i,o))){let o={type:"List",inner:{type:"Enum"}};return this.#o(t,o)}}if(De(n,Ne.ParamListScalar)&&t.every(o=>Zd(o,n))&&t.length>0){let o=t.map(u=>Xd(u)),a={type:"List",inner:Wd(t)};return this.#o(o,a)}if(De(n,Ne.ListObject)){let i=this.#e.inputNode(n.childNodeId);if(i)return t.map(o=>Qa(o)?this.#s(o,i):o)}return r}#p(t,r){if(De(r,Ne.Object)){let i=this.#e.inputNode(r.childNodeId);if(i)return this.#s(t,i)}if(Ge(r)&re.Json){let i=Se(Ae(t)),o={type:"Json"};return this.#o(i,o)}return t}#c(t,r){if(!t||!r)return t;let n={};for(let[i,o]of Object.entries(t)){if(i==="$scalars"||i==="$composites"||typeof o=="boolean"){n[i]=o;continue}let s=this.#e.outputEdge(r,i);if(s){let a=o,u=this.#e.inputNode(s.argsNodeId),m=this.#e.outputNode(s.outputNodeId),P={selection:a.selection?this.#c(a.selection,m):{}};a.arguments&&(P.arguments=this.#s(a.arguments,u)),n[i]=P;}else n[i]=o;}return n}};function Ga(e,t){return {$type:"Param",value:{name:e,...t}}}function za(e){return e.type==="List"?`List<${za(e.inner)}>`:e.type}function Jd(e){return ArrayBuffer.isView(e)?Buffer.from(e.buffer,e.byteOffset,e.byteLength).toString("base64"):JSON.stringify(e)}function Gd(e,t){let r=za(t),n=Jd(e);return `${r}:${n}`}var zd=2**31-1,Hd=-2147483648;function Ui(e){switch(typeof e){case "boolean":return {type:"Boolean"};case "number":return Number.isInteger(e)?Hd<=e&&e<=zd?{type:"Int"}:{type:"BigInt"}:{type:"Float"};case "string":return {type:"String"};default:throw new Error("unreachable")}}function Ha({type:e},t){switch(e){case "Boolean":return (t&re.Boolean)!==0;case "Int":return (t&(re.Int|re.BigInt|re.Float))!==0;case "BigInt":return (t&re.BigInt)!==0;case "Float":return (t&re.Float)!==0;case "String":return (t&re.String)!==0;default:return  false}}function Wa(e){switch(e){case "BigInt":case "Bytes":case "DateTime":case "Json":return {type:e};case "Decimal":return {type:"Float"};default:return}}function Wd(e){let t={type:"Any"};for(let r of e){let n=an(r),i;switch(n.kind){case "primitive":i=Ui(n.value);break;case "taggedScalar":i=Wa(n.tag)??{type:"Any"};break;default:return {type:"Any"}}t=Kd(t,i);}return t}function Kd(e,t){if(e.type==="Any")return t;if(t.type==="Any"||e.type===t.type)return e;let r={Int:0,BigInt:1,Float:2},n=r[e.type],i=r[t.type];return n!==void 0&&i!==void 0?n>=i?e:t:{type:"Any"}}function Ka(e,t){switch(e){case "DateTime":return (t&re.DateTime)!==0;case "Decimal":return (t&re.Decimal)!==0;case "BigInt":return (t&re.BigInt)!==0;case "Bytes":return (t&re.Bytes)!==0;case "Json":return (t&re.Json)!==0;default:return  false}}function Zd(e,t){let r=an(e);switch(r.kind){case "structural":return  false;case "null":return  false;case "primitive":{let n=Ui(r.value),i=Ge(t);return i!==0&&Ha(n,i)}case "taggedScalar":{let n=Ge(t);return n!==0&&Ka(r.tag,n)}default:return  false}}function Xd(e){return Ja(e)?Za(e):e}function Za(e){return e.value}async function Yd(){return globalThis.crypto??await import('node:crypto')}async function Xa(){return (await Yd()).randomUUID()}async function Ya(e,t){return new Promise(r=>{e.addEventListener(t,r,{once:true});})}var ue=class extends X{name="TransactionManagerError";constructor(t,r){super("Transaction API error: "+t,"P2028",r);}},nt=class extends ue{constructor(){super("Transaction not found. Transaction ID is invalid, refers to an old closed transaction Prisma doesn't have information about anymore, or was obtained before disconnecting.");}},un=class extends ue{constructor(t){super(`Transaction already closed: A ${t} cannot be executed on a committed transaction.`);}},cn=class extends ue{constructor(t){super(`Transaction already closed: A ${t} cannot be executed on a transaction that was rolled back.`);}},fr=class extends ue{constructor(){super("Unable to start a transaction in the given time.");}},pn=class extends ue{constructor(t,{timeout:r,timeTaken:n}){super(`A ${t} cannot be executed on an expired transaction. The timeout for this transaction was ${r} ms, however ${n} ms passed since the start of the transaction. Consider increasing the interactive transaction timeout or doing less work in the transaction.`,{operation:t,timeout:r,timeTaken:n});}},Me=class extends ue{constructor(t){super(`Internal Consistency Error: ${t}`);}},dn=class extends ue{constructor(t){super(`Invalid isolation level: ${t}`,{isolationLevel:t});}};var em=100,tm=2e3;function rm(){let e,t=new Promise(r=>{e=r;});return {abortController:new AbortController,settled:t,markSettled:e}}var it=K("prisma:client:transactionManager"),nm=()=>({sql:"COMMIT",args:[],argTypes:[]}),el=()=>({sql:"ROLLBACK",args:[],argTypes:[]}),im=()=>({sql:'-- Implicit "COMMIT" query via underlying driver',args:[],argTypes:[]}),om=()=>({sql:'-- Implicit "ROLLBACK" query via underlying driver',args:[],argTypes:[]}),gr=class{transactions=new Map;closedTransactions=[];#e=new Set;driverAdapter;transactionOptions;tracingHelper;#t;#r;constructor({driverAdapter:t,transactionOptions:r,tracingHelper:n,onQuery:i,provider:o}){this.driverAdapter=t,this.transactionOptions=r,this.tracingHelper=n,this.#t=i,this.#r=o;}async startInternalTransaction(t){let r=t!==void 0?this.#y(t):{};return await this.tracingHelper.runInChildSpan("start_transaction",()=>this.#i(r))}async startTransaction(t){let r=t!==void 0?this.#y(t):this.transactionOptions;return await this.tracingHelper.runInChildSpan("start_transaction",()=>this.#i(r))}async#i(t){if(t.newTxId)return await this.#d(t.newTxId,"start",async o=>{if(o.status!=="running")throw new Me(`Transaction in invalid state ${o.status} when starting a nested transaction.`);if(!o.transaction)throw new Me("Transaction missing underlying driver transaction when starting a nested transaction.");o.depth+=1;let s=this.#a(o);o.savepoints.push(s);try{await this.#n(o.transaction)(s);}catch(a){throw o.depth-=1,o.savepoints.pop(),a}return {id:o.id}});let r=rm(),{abortController:n}=r;this.#e.add(r);let i;try{let o={id:await Xa(),status:"waiting",timer:void 0,timeout:t.timeout,startedAt:Date.now(),transaction:void 0,operationQueue:Promise.resolve(),depth:1,savepoints:[],savepointCounter:0};if(n.signal.aborted)throw new fr;let s=tl(()=>n.abort(),t.maxWait);s?.unref?.();let a=this.driverAdapter.startTransaction(t.isolationLevel).catch(Be);switch(o.transaction=await Promise.race([a.finally(()=>clearTimeout(s)),Ya(n.signal,"abort").then(()=>{})]),this.transactions.set(o.id,o),o.status){case "waiting":if(n.signal.aborted)throw o.transaction=void 0,i=this.#o(a),await this.#f(o,"timed_out"),new fr;return o.status="running",o.startedAt=Date.now(),o.timer=this.#c(o.id,t.timeout),{id:o.id};case "timed_out":case "running":case "committed":case "rolled_back":throw new Me(`Transaction in invalid state ${o.status} although it just finished startup.`);default:return V(o.status,"Unknown transaction status.")}}finally{this.#e.delete(r),i?i.finally(r.markSettled):r.markSettled();}}async#o(t){try{let r=await t;if(r.options.usePhantomQuery)await r.rollback();else try{await r.executeRaw(el());}finally{await r.rollback();}}catch(r){it("error in discarded transaction:",r);}}async commitTransaction(t){return await this.tracingHelper.runInChildSpan("commit_transaction",async()=>{await this.#d(t,"commit",async r=>{if(r.depth>1){if(!r.transaction)throw new nt;let n=r.savepoints.at(-1);if(!n)throw new Me(`Missing savepoint for nested commit. Depth: ${r.depth}, transactionId: ${r.id}`);try{await this.#l(r.transaction,n);}finally{r.savepoints.pop(),r.depth-=1;}return}await this.#f(r,"committed");});})}async rollbackTransaction(t){return await this.tracingHelper.runInChildSpan("rollback_transaction",async()=>{await this.#d(t,"rollback",async r=>{if(r.depth>1){if(!r.transaction)throw new nt;let n=r.savepoints.at(-1);if(!n)throw new Me(`Missing savepoint for nested rollback. Depth: ${r.depth}, transactionId: ${r.id}`);try{await this.#u(r.transaction)(n),await this.#l(r.transaction,n);}finally{r.savepoints.pop(),r.depth-=1;}return}await this.#f(r,"rolled_back");});})}async getTransaction(t,r){let n=this.#s(t.id,r);if(n.status==="closing"&&(await n.closing,n=this.#s(t.id,r)),!n.transaction)throw new nt;return n.transaction}#s(t,r){let n=this.transactions.get(t);if(!n){let i=this.closedTransactions.find(o=>o.id===t);if(i)switch(it("Transaction already closed.",{transactionId:t,status:i.status}),i.status){case "closing":case "waiting":case "running":throw new Me("Active transaction found in closed transactions list.");case "committed":throw new un(r);case "rolled_back":throw new cn(r);case "timed_out":throw new pn(r,{timeout:i.timeout,timeTaken:Date.now()-i.startedAt})}else throw it("Transaction not found.",t),new nt}if(["committed","rolled_back","timed_out"].includes(n.status))throw new Me("Closed transaction found in active transactions map.");return n}async cancelAllTransactions(){let t=[...this.#e];for(let{abortController:r}of t)r.abort();await Promise.allSettled([...[...this.transactions.values()].map(r=>this.#m(r,async()=>{let n=this.transactions.get(r.id);n&&await this.#f(n,"rolled_back");})),...t.map(({settled:r})=>sm(r,tm))]);}#a(t){return `prisma_sp_${t.savepointCounter++}`}#n(t){if(t.createSavepoint)return t.createSavepoint.bind(t);throw new ue(`Nested transactions are not supported by adapter "${t.adapterName}" (${t.provider}): createSavepoint is not implemented.`)}#u(t){if(t.rollbackToSavepoint)return t.rollbackToSavepoint.bind(t);throw new ue(`Nested transactions are not supported by adapter "${t.adapterName}" (${t.provider}): rollbackToSavepoint is not implemented.`)}async#l(t,r){t.releaseSavepoint&&await t.releaseSavepoint(r);}#p(t){it("Transaction already committed or rolled back when timeout happened.",t);}#c(t,r){let n=Date.now(),i=tl(async()=>{try{it("Transaction timed out.",{transactionId:t,timeoutStartedAt:n,timeout:r});let o=this.transactions.get(t);if(!o){this.#p(t);return}await this.#m(o,async()=>{let s=this.transactions.get(t);s&&["running","waiting"].includes(s.status)?await this.#f(s,"timed_out"):this.#p(t);});}catch(o){it("Error while closing timed-out transaction.",{transactionId:t,error:o});}},r);return i?.unref?.(),i}async#d(t,r,n){let i=this.#s(t,r);return await this.#m(i,async()=>{let o=this.#s(t,r);return await n(o)})}async#m(t,r){let n=t.operationQueue,i;t.operationQueue=new Promise(o=>{i=o;}),await n;try{return await r()}finally{i();}}async#f(t,r){let n=async()=>{it("Closing transaction.",{transactionId:t.id,status:r});try{if(t.transaction&&r==="committed")if(t.transaction.options.usePhantomQuery)await this.#g(im(),t.transaction,()=>t.transaction.commit());else {let i=nm();await this.#g(i,t.transaction,()=>t.transaction.executeRaw(i)).then(()=>t.transaction.commit(),o=>{let s=()=>Promise.reject(o);return t.transaction.rollback().then(s,s)});}else if(t.transaction)if(t.transaction.options.usePhantomQuery)await this.#g(om(),t.transaction,()=>t.transaction.rollback());else {let i=el();try{await this.#g(i,t.transaction,()=>t.transaction.executeRaw(i));}finally{await t.transaction.rollback();}}}finally{t.status=r,clearTimeout(t.timer),t.timer=void 0,this.transactions.delete(t.id),this.closedTransactions.push(t),this.closedTransactions.length>em&&this.closedTransactions.shift();}};t.status==="closing"?(await t.closing,this.#s(t.id,r==="committed"?"commit":"rollback")):await Object.assign(t,{status:"closing",reason:r,closing:n()}).closing;}#y(t){if(!t.timeout)throw new ue("timeout is required");if(!t.maxWait)throw new ue("maxWait is required");if(t.isolationLevel==="SNAPSHOT")throw new dn(t.isolationLevel);return {...t,timeout:t.timeout,maxWait:t.maxWait}}#g(t,r,n){return Wr({query:t,execute:n,provider:this.#r??r.provider,tracingHelper:this.tracingHelper,onQuery:this.#t})}};function tl(e,t){return t!==void 0?setTimeout(e,t):void 0}function sm(e,t){let r,n=new Promise(i=>{r=setTimeout(i,t),r?.unref?.();});return Promise.race([e,n]).finally(()=>clearTimeout(r))}var ne=require$$0;var mn="7.10.0";var rl={bigint:"bigint",date:"datetime",decimal:"decimal",bytes:"bytes"};function il(e){let t;try{t=JSON.parse(e);}catch(i){throw new Error(`Received invalid serialized parameters: ${i.message}`)}if(!Array.isArray(t))throw new Error("Received invalid serialized parameters: expected an array");let r=t.map(i=>ol(i)),n=t.map(i=>lm(i));return {args:r,argTypes:n}}function ol(e){if(Array.isArray(e))return e.map(t=>ol(t));if(typeof e=="object"&&e!==null&&"prisma__value"in e){if(!("prisma__type"in e))throw new Error("Invalid serialized parameter, prisma__type should be present when prisma__value is present");return `${e.prisma__value}`}return typeof e=="object"&&e!==null?JSON.stringify(e):e}function lm(e){return Array.isArray(e)?{scalarType:e.length>0?nl(e[0]):"unknown",arity:"list"}:{scalarType:nl(e),arity:"scalar"}}function nl(e){return typeof e=="object"&&e!==null&&"prisma__type"in e&&typeof e.prisma__type=="string"&&e.prisma__type in rl?rl[e.prisma__type]:typeof e=="number"?"decimal":typeof e=="string"?"string":"unknown"}function sl(e,t){return {batch:e,transaction:t?.kind==="batch"?{isolationLevel:t.options.isolationLevel}:void 0}}function al(e){return e?e.replace(/"(?:[^"\\]|\\.)*"/g,'"X"').replace(/[\s:\[]([+-]?([0-9]*[.])?[0-9]+)/g,t=>`${t[0]}5`):""}function ll(e){return e.split(`
`).map(t=>t.replace(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)\s*/,"").replace(/\+\d+\s*ms$/,"")).join(`
`)}var ul=Pe(Ro());function cl({title:e,user:t="prisma",repo:r="prisma",template:n="bug_report.yml",body:i}){return (0, ul.default)({user:t,repo:r,template:n,title:e,body:i})}function pl({version:e,binaryTarget:t,title:r,description:n,engineVersion:i,database:o,query:s}){let a=go(6e3-(s?.length??0)),u=ll(ut(a)),m=n?`# Description
\`\`\`
${n}
\`\`\``:"",P=ut(`Hi Prisma Team! My Prisma Client just crashed. This is the report:
## Versions

| Name            | Version            |
|-----------------|--------------------|
| Node            | ${process.version?.padEnd(19)}| 
| OS              | ${t?.padEnd(19)}|
| Prisma Client   | ${e?.padEnd(19)}|
| Query Engine    | ${i?.padEnd(19)}|
| Database        | ${o?.padEnd(19)}|

${m}

## Logs
\`\`\`
${u}
\`\`\`

## Client Snippet
\`\`\`ts
// PLEASE FILL YOUR CODE SNIPPET HERE
\`\`\`

## Schema
\`\`\`prisma
// PLEASE ADD YOUR SCHEMA HERE IF POSSIBLE
\`\`\`

## Prisma Engine Query
\`\`\`
${s?al(s):""}
\`\`\`
`),T=cl({title:r,body:P});return `${r}

This is a non-recoverable error which probably happens when the Prisma Query Engine has a panic.

${Mt(T)}

If you want the Prisma team to look into it, please open the link above \u{1F64F}
To increase the chance of success, please post your schema and a snippet of
how you used Prisma Client in the issue. 
`}var fn=class e{#e;#t;#r;#i;#o;constructor(t,r,n){this.#e=t,this.#t=r,this.#r=n,this.#i=r.getConnectionInfo?.(),this.#o=dr.forSql({onQuery:this.#e.onQuery,tracingHelper:this.#e.tracingHelper,provider:this.#e.provider,connectionInfo:this.#i});}static async connect(t){let r,n;try{r=await t.driverAdapterFactory.connect(),n=new gr({driverAdapter:r,transactionOptions:t.transactionOptions,tracingHelper:t.tracingHelper,onQuery:t.onQuery,provider:t.provider});}catch(i){throw await r?.dispose(),i}return new e(t,r,n)}getConnectionInfo(){let t=this.#i??{supportsRelationJoins:false};return Promise.resolve({provider:this.#t.provider,connectionInfo:t})}async execute({plan:t,placeholderValues:r,transaction:n,batchIndex:i,queryInfo:o}){let s=n?await this.#r.getTransaction(n,i!==void 0?"batch query":"query"):this.#t;return await this.#o.run(t,{queryable:s,transactionManager:n?{enabled:false}:{enabled:true,manager:this.#r},scope:r,sqlCommenter:this.#e.sqlCommenters&&{plugins:this.#e.sqlCommenters,queryInfo:o}})}async startTransaction(t){return {...await this.#r.startTransaction(t),payload:void 0}}async commitTransaction(t){await this.#r.commitTransaction(t.id);}async rollbackTransaction(t){await this.#r.rollbackTransaction(t.id);}async disconnect(){try{await this.#r.cancelAllTransactions();}finally{await this.#t.dispose();}}apiKey(){return null}};var gn=class{#e;#t;#r;constructor(t=1e3){this.#e=new Map,this.#t=new Map,this.#r=t;}getSingle(t){let r=this.#e.get(t);return r&&(this.#e.delete(t),this.#e.set(t,r)),r}setSingle(t,r){if(this.#e.has(t)){this.#e.delete(t),this.#e.set(t,r);return}if(this.#e.size>=this.#r){let n=this.#e.keys().next().value;n!==void 0&&this.#e.delete(n);}this.#e.set(t,r);}getBatch(t){let r=this.#t.get(t);return r&&(this.#t.delete(t),this.#t.set(t,r)),r}setBatch(t,r){if(this.#t.has(t)){this.#t.delete(t),this.#t.set(t,r);return}if(this.#t.size>=this.#r){let n=this.#t.keys().next().value;n!==void 0&&this.#t.delete(n);}this.#t.set(t,r);}clear(){this.#e.clear(),this.#t.clear();}get size(){return this.#e.size+this.#t.size}get singleCacheSize(){return this.#e.size}get batchCacheSize(){return this.#t.size}};var hl=require$$0;var yn=/^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;function dl(e,t,r){let n={},i=n.encode||encodeURIComponent;if(typeof i!="function")throw new TypeError("option encode is invalid");if(!yn.test(e))throw new TypeError("argument name is invalid");let o=i(t);if(o&&!yn.test(o))throw new TypeError("argument val is invalid");let s=e+"="+o;if(n.maxAge!==void 0&&n.maxAge!==null){let a=n.maxAge-0;if(Number.isNaN(a)||!Number.isFinite(a))throw new TypeError("option maxAge is invalid");s+="; Max-Age="+Math.floor(a);}if(n.domain){if(!yn.test(n.domain))throw new TypeError("option domain is invalid");s+="; Domain="+n.domain;}if(n.path){if(!yn.test(n.path))throw new TypeError("option path is invalid");s+="; Path="+n.path;}if(n.expires){if(!um(n.expires)||Number.isNaN(n.expires.valueOf()))throw new TypeError("option expires is invalid");s+="; Expires="+n.expires.toUTCString();}if(n.httpOnly&&(s+="; HttpOnly"),n.secure&&(s+="; Secure"),n.priority)switch(typeof n.priority=="string"?n.priority.toLowerCase():n.priority){case "low":{s+="; Priority=Low";break}case "medium":{s+="; Priority=Medium";break}case "high":{s+="; Priority=High";break}default:throw new TypeError("option priority is invalid")}if(n.sameSite)switch(typeof n.sameSite=="string"?n.sameSite.toLowerCase():n.sameSite){case  true:{s+="; SameSite=Strict";break}case "lax":{s+="; SameSite=Lax";break}case "strict":{s+="; SameSite=Strict";break}case "none":{s+="; SameSite=None";break}default:throw new TypeError("option sameSite is invalid")}return n.partitioned&&(s+="; Partitioned"),s}function um(e){return Object.prototype.toString.call(e)==="[object Date]"||e instanceof Date}function ml(e,t){let r=(e||"").split(";").filter(u=>typeof u=="string"&&!!u.trim()),n=r.shift()||"",i=cm(n),o=i.name,s=i.value;try{s=t?.decode===!1?s:(t?.decode||decodeURIComponent)(s);}catch{}let a={name:o,value:s};for(let u of r){let m=u.split("="),P=(m.shift()||"").trimStart().toLowerCase(),T=m.join("=");switch(P){case "expires":{a.expires=new Date(T);break}case "max-age":{a.maxAge=Number.parseInt(T,10);break}case "secure":{a.secure=true;break}case "httponly":{a.httpOnly=true;break}case "samesite":{a.sameSite=T;break}default:a[P]=T;}}return a}function cm(e){let t="",r="",n=e.split("=");return n.length>1?(t=n.shift(),r=n.join("=")):r=e,{name:t,value:r}}var hn=class extends Error{clientVersion;cause;constructor(t,r){super(t),this.clientVersion=r.clientVersion,this.cause=r.cause;}get[Symbol.toStringTag](){return this.name}};var wn=class extends hn{isRetryable;constructor(t,r){super(t,r),this.isRetryable=r.isRetryable??true;}};function fl(e,t){return {...e,isRetryable:t}}var ot=class extends wn{name="InvalidDatasourceError";code="P6001";constructor(t,r){super(t,fl(r,false));}};Bt(ot,"InvalidDatasourceError");function gl(e){let t={clientVersion:e.clientVersion},r;try{r=new URL(e.accelerateUrl);}catch(u){let m=u.message;throw new ot(`Error validating \`accelerateUrl\`, the URL cannot be parsed, reason: ${m}`,t)}let{protocol:n,searchParams:i}=r;if(n!=="prisma:"&&n!==Er)throw new ot("Error validating `accelerateUrl`: the URL must start with the protocol `prisma://` or `prisma+postgres://`",t);let o=i.get("api_key");if(o===null||o.length<1)throw new ot("Error validating `accelerateUrl`: the URL must contain a valid API key",t);let s=Dn(r)?"http:":"https:";process.env.TEST_CLIENT_ENGINE_REMOTE_EXECUTOR&&r.searchParams.has("use_http")&&(s="http:");let a=new URL(r.href.replace(n,s));return {apiKey:o,url:a}}var yl=Pe(wo()),xn=class{apiKey;tracingHelper;logLevel;logQueries;engineHash;constructor({apiKey:t,tracingHelper:r,logLevel:n,logQueries:i,engineHash:o}){this.apiKey=t,this.tracingHelper=r,this.logLevel=n,this.logQueries=i,this.engineHash=o;}build({traceparent:t,transactionId:r}={}){let n={Accept:"application/json",Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json","Prisma-Engine-Hash":this.engineHash,"Prisma-Engine-Version":yl.enginesVersion};this.tracingHelper.isEnabled()&&(n.traceparent=t??this.tracingHelper.getTraceParent()),r&&(n["X-Transaction-Id"]=r);let i=this.#e();return i.length>0&&(n["X-Capture-Telemetry"]=i.join(", ")),n}#e(){let t=[];return this.tracingHelper.isEnabled()&&t.push("tracing"),this.logLevel&&t.push(this.logLevel),this.logQueries&&t.push("query"),t}};function pm(e){return e[0]*1e3+e[1]/1e6}function ji(e){return new Date(pm(e))}var wl=K("prisma:client:clientEngine:remoteExecutor"),bn=class{#e;#t;#r;#i;#o;#s;constructor(t){this.#e=t.clientVersion,this.#i=t.logEmitter,this.#o=t.tracingHelper,this.#s=t.sqlCommenters;let{url:r,apiKey:n}=gl({clientVersion:t.clientVersion,accelerateUrl:t.accelerateUrl});this.#r=new Bi(r),this.#t=new xn({apiKey:n,engineHash:t.clientVersion,logLevel:t.logLevel,logQueries:t.logQueries,tracingHelper:t.tracingHelper});}async getConnectionInfo(){return await this.#a({path:"/connection-info",method:"GET"})}async execute({plan:t,placeholderValues:r,batchIndex:n,model:i,operation:o,transaction:s,customFetch:a,queryInfo:u}){let m=u&&this.#s?.length?Hr(this.#s,{query:u}):void 0;return (await this.#a({path:s?`/transaction/${s.id}/query`:"/query",method:"POST",body:{model:i,operation:o,plan:t,params:r,comments:m&&Object.keys(m).length>0?m:void 0},batchRequestIdx:n,fetch:a})).data}async startTransaction(t){return {...await this.#a({path:"/transaction/start",method:"POST",body:t}),payload:void 0}}async commitTransaction(t){await this.#a({path:`/transaction/${t.id}/commit`,method:"POST"});}async rollbackTransaction(t){await this.#a({path:`/transaction/${t.id}/rollback`,method:"POST"});}disconnect(){return Promise.resolve()}apiKey(){return this.#t.apiKey}async#a({path:t,method:r,body:n,fetch:i=globalThis.fetch,batchRequestIdx:o}){let s=await this.#r.request({method:r,path:t,headers:this.#t.build(),body:n,fetch:i});s.ok||await this.#n(s,o);let a=await s.json();return typeof a.extensions=="object"&&a.extensions!==null&&this.#u(a.extensions),a}async#n(t,r){let n=t.headers.get("Prisma-Error-Code"),i=await t.text(),o,s=i;try{o=JSON.parse(i);}catch{o={};}typeof o.code=="string"&&(n=o.code),typeof o.error=="string"?s=o.error:typeof o.message=="string"?s=o.message:typeof o.InvalidRequestError=="object"&&o.InvalidRequestError!==null&&typeof o.InvalidRequestError.reason=="string"&&(s=o.InvalidRequestError.reason),s=s||`HTTP ${t.status}: ${t.statusText}`;let a=typeof o.meta=="object"&&o.meta!==null?o.meta:o;throw new hl.PrismaClientKnownRequestError(s,{clientVersion:this.#e,code:n??"P6000",batchRequestIdx:r,meta:a})}#u(t){let r=t.logs??[];if(t.spans)this.#o.dispatchEngineSpans(t.spans,r,n=>this.#l(n));else for(let n of r)this.#l(n);}#l(t){switch(t.level){case "debug":case "trace":wl(t);break;case "error":case "warn":case "info":{this.#i.emit(t.level,{timestamp:ji(t.timestamp),message:t.attributes.message??"",target:t.target??"RemoteExecutor"});break}case "query":{this.#i.emit("query",{query:t.attributes.query??"",timestamp:ji(t.timestamp),duration:t.attributes.duration_ms??0,params:t.attributes.params??"",target:t.target??"RemoteExecutor"});break}default:throw new Error(`Unexpected log level: ${t.level}`)}}},Bi=class{#e;#t;#r;constructor(t){this.#e=t,this.#t=new Map;}async request({method:t,path:r,headers:n,body:i,fetch:o}){let s=new URL(r,this.#e),a=this.#i(s);a&&(n.Cookie=a),this.#r&&(n["Accelerate-Query-Engine-Jwt"]=this.#r);let u=await o(s.href,{method:t,body:i!==void 0?JSON.stringify(i):void 0,headers:n});return wl(t,s,u.status,u.statusText),this.#r=u.headers.get("Accelerate-Query-Engine-Jwt")??void 0,this.#o(s,u),u}#i(t){let r=[],n=new Date;for(let[i,o]of this.#t){if(o.expires&&o.expires<n){this.#t.delete(i);continue}let s=o.domain??t.hostname,a=o.path??"/";t.hostname.endsWith(s)&&t.pathname.startsWith(a)&&r.push(dl(o.name,o.value));}return r.length>0?r.join("; "):void 0}#o(t,r){let n=r.headers.getSetCookie?.()||[];if(n.length===0){let i=r.headers.get("Set-Cookie");i&&n.push(i);}for(let i of n){let o=ml(i),s=o.domain??t.hostname,a=o.path??"/",u=`${s}:${a}:${o.name}`;this.#t.set(u,{name:o.name,value:o.value,domain:s,path:a,expires:o.expires});}}};var Ji=require$$0,Qi={},xl={async loadQueryCompiler(e){let{clientVersion:t,compilerWasm:r}=e;if(r===void 0)throw new Ji.PrismaClientInitializationError("WASM query compiler was unexpectedly `undefined`",t);let n;return e.activeProvider===void 0||Qi[e.activeProvider]===void 0?(n=(async()=>{let i=await r.getRuntime(),o=await r.getQueryCompilerWasmModule();if(o==null)throw new Ji.PrismaClientInitializationError("The loaded wasm module was unexpectedly `undefined` or `null` once loaded",t);let s={[r.importName]:i},a=new WebAssembly.Instance(o,s),u=a.exports.__wbindgen_start;return i.__wbg_set_wasm(a.exports),u(),i.QueryCompiler})(),e.activeProvider!==void 0&&(Qi[e.activeProvider]=n)):n=Qi[e.activeProvider],await n}};var dm="P2038",Ve=K("prisma:client:clientEngine"),Tl=globalThis;Tl.PRISMA_WASM_PANIC_REGISTRY={set_message(e){throw new ne.PrismaClientRustPanicError(e,mn)}};var yr=class{name="ClientEngine";#e;#t={type:"disconnected"};#r;#i;#o;#s;config;datamodel;logEmitter;logQueries;logLevel;tracingHelper;#a;constructor(t,r){if(t.accelerateUrl!==void 0)this.#i={remote:true,accelerateUrl:t.accelerateUrl};else if(t.adapter)this.#i={remote:false,driverAdapterFactory:t.adapter},Ve("Using driver adapter: %O",t.adapter);else throw new ne.PrismaClientInitializationError("PrismaClient requires a driver adapter to connect to your database, but none was provided. Pass one to the PrismaClient constructor, e.g. `new PrismaClient({ adapter })`. Learn more: https://pris.ly/d/driver-adapters",t.clientVersion,dm);this.#r=r??xl,this.config=t,this.logQueries=t.logQueries??false,this.logLevel=t.logLevel??"error",this.logEmitter=t.logEmitter,this.datamodel=t.inlineSchema,this.tracingHelper=t.tracingHelper,this.#o=t.queryPlanCacheMaxSize===0?void 0:new gn(t.queryPlanCacheMaxSize),this.#s=mr.deserialize(t.parameterizationSchema,n=>{if(!Object.hasOwn(t.runtimeDataModel.enums,n))return;let i={};for(let o of t.runtimeDataModel.enums[n].values)i[o.name]=o.dbName??o.name;return i}),t.enableDebugLogs&&(this.logLevel="debug"),this.logQueries&&(this.#a=n=>{this.logEmitter.emit("query",{...n,params:Se(n.params),target:"ClientEngine"});});}async#n(){switch(this.#t.type){case "disconnected":{let t=this.tracingHelper.runInChildSpan("connect",async()=>{let r,n;try{r=await this.#u(),n=await this.#l(r);}catch(o){throw this.#t={type:"disconnected"},n?.free(),await r?.disconnect(),o}let i={executor:r,queryCompiler:n};return this.#t={type:"connected",engine:i},i});return this.#t={type:"connecting",promise:t},await t}case "connecting":return await this.#t.promise;case "connected":return this.#t.engine;case "disconnecting":return await this.#t.promise,await this.#n()}}async#u(){return this.#i.remote?new bn({clientVersion:this.config.clientVersion,accelerateUrl:this.#i.accelerateUrl,logEmitter:this.logEmitter,logLevel:this.logLevel,logQueries:this.logQueries,tracingHelper:this.tracingHelper,sqlCommenters:this.config.sqlCommenters}):await fn.connect({driverAdapterFactory:this.#i.driverAdapterFactory,tracingHelper:this.tracingHelper,transactionOptions:{...this.config.transactionOptions,isolationLevel:this.#g(this.config.transactionOptions.isolationLevel)},onQuery:this.#a,provider:this.config.activeProvider,sqlCommenters:this.config.sqlCommenters})}async#l(t){let r=this.#e;r===void 0&&(r=await this.#r.loadQueryCompiler(this.config),this.#e=r);let{provider:n,connectionInfo:i}=await t.getConnectionInfo();try{return this.#m(()=>new r({datamodel:this.datamodel,provider:n,connectionInfo:i}),void 0,!1)}catch(o){throw this.#p(o)}}#p(t){if(t instanceof ne.PrismaClientRustPanicError)return t;try{let r=JSON.parse(t.message);return new ne.PrismaClientInitializationError(r.message,this.config.clientVersion,r.error_code)}catch{return t}}#c(t,r){if(t instanceof ne.PrismaClientInitializationError)return t;if(t.code==="GenericFailure"&&t.message?.startsWith("PANIC:"))return new ne.PrismaClientRustPanicError(bl(this,t.message,r),this.config.clientVersion);if(t instanceof X)return new ne.PrismaClientKnownRequestError(t.message,{code:t.code,meta:t.meta,clientVersion:this.config.clientVersion});try{let n=JSON.parse(t);return new ne.PrismaClientUnknownRequestError(`${n.message}
${n.backtrace}`,{clientVersion:this.config.clientVersion})}catch{return t}}#d(t){return t instanceof ne.PrismaClientRustPanicError?t:typeof t.message=="string"&&typeof t.code=="string"?new ne.PrismaClientKnownRequestError(t.message,{code:t.code,meta:t.meta,clientVersion:this.config.clientVersion}):typeof t.message=="string"?new ne.PrismaClientUnknownRequestError(t.message,{clientVersion:this.config.clientVersion}):t}#m(t,r,n=true){let i=Tl.PRISMA_WASM_PANIC_REGISTRY.set_message,o;commonjsGlobal.PRISMA_WASM_PANIC_REGISTRY.set_message=s=>{o=s;};try{return t()}finally{if(commonjsGlobal.PRISMA_WASM_PANIC_REGISTRY.set_message=i,o)throw this.#e=void 0,n&&this.stop().catch(s=>Ve("failed to disconnect:",s)),new ne.PrismaClientRustPanicError(bl(this,o,r),this.config.clientVersion)}}onBeforeExit(){throw new Error('"beforeExit" hook is not applicable to the client engine, it is only relevant and implemented for the binary engine. Please add your event listener to the `process` object directly instead.')}async start(){await this.#n();}async stop(){switch(this.#t.type){case "disconnected":return;case "connecting":return await this.#t.promise,await this.stop();case "connected":{let t=this.#t.engine,r=this.tracingHelper.runInChildSpan("disconnect",async()=>{try{await t.executor.disconnect(),t.queryCompiler.free();}finally{this.#t={type:"disconnected"};}});return this.#t={type:"disconnecting",promise:r},await r}case "disconnecting":return await this.#t.promise}}version(){return "unknown"}async transaction(t,r,n){let i,{executor:o}=await this.#n();try{if(t==="start"){let s=n;i=await o.startTransaction({...s,isolationLevel:this.#g(s.isolationLevel)});}else if(t==="commit"){let s=n;await o.commitTransaction(s);}else if(t==="rollback"){let s=n;await o.rollbackTransaction(s);}else $e(t,"Invalid transaction action.");}catch(s){throw this.#c(s)}return i?{id:i.id,payload:void 0}:void 0}async request(t,{interactiveTransaction:r,customDataProxyFetch:n}){Ve("sending request");let{executor:i,queryCompiler:o}=await this.#n().catch(m=>{throw this.#c(m,JSON.stringify(t))}),s,a={},u=t.query;if(Pl(t))s=El(t);else {let{parameterizedQuery:m,placeholderValues:P}=Vi(t,this.#s),T=JSON.stringify(m);a=P,u=m.query;let S=t.action!=="createMany"&&t.action!=="createManyAndReturn",I=S?this.#o?.getSingle(T):void 0;I?(Ve("query plan cache hit"),s=I):(Ve("query plan cache miss"),s=this.#f(m,T,o),S&&this.#o?.setSingle(T,s));}try{Ve("query plan created",s);let m=await i.execute({plan:s,model:t.modelName,operation:t.action,placeholderValues:a,transaction:r,batchIndex:void 0,customFetch:n?.(globalThis.fetch),queryInfo:{type:"single",modelName:t.modelName,action:t.action,query:u}});return Ve("query plan executed"),{data:{[t.action]:m}}}catch(m){throw this.#c(m,JSON.stringify(t))}}async requestBatch(t,{transaction:r,customDataProxyFetch:n}){if(t.length===0)return [];let i=t[0].action,o=t[0].modelName,s=sl(t,r),a=JSON.stringify(s),{executor:u,queryCompiler:m}=await this.#n().catch(A=>{throw this.#c(A,a)}),P=o===void 0,T,S={},I=t.map(A=>A.query);if(P)T=this.#y(t,a,m);else {let{parameterizedBatch:A,placeholderValues:M}=qi(s,this.#s),L=JSON.stringify(A);S=M,I=A.batch.map(E=>E.query);let q=this.#o?.getBatch(L);if(q)Ve("batch query plan cache hit"),T=q;else {Ve("batch query plan cache miss");try{T=this.#y(A.batch,L,m),this.#o?.setBatch(L,T);}catch(E){throw this.#d(E)}}}try{let A;switch(r?.kind==="itx"&&(A=r.options),T.type){case "multi":{if(r?.kind!=="itx"){let E=r?.options,D={maxWait:E?.maxWait??this.config.transactionOptions.maxWait,timeout:E?.timeout??this.config.transactionOptions.timeout,isolationLevel:E?.isolationLevel??this.config.transactionOptions.isolationLevel};A=await this.transaction("start",{},D);}let M=[],L=!1,q;for(let[E,D]of T.plans.entries())try{let H=await u.execute({plan:D,placeholderValues:S,model:t[E].modelName,operation:t[E].action,batchIndex:E,transaction:A,customFetch:n?.(globalThis.fetch),queryInfo:{type:"single",modelName:t[E].modelName,action:t[E].action,query:I[E]}});M.push({data:{[t[E].action]:H}});}catch(H){if(q??=r?.kind!=="batch"&&t.every(ce=>ce.action==="findUnique"||ce.action==="findUniqueOrThrow"),M.push(H),L=!0,!q)break}return A!==void 0&&r?.kind!=="itx"&&(L?await this.transaction("rollback",{},A):await this.transaction("commit",{},A)),M}case "compacted":{if(!t.every(q=>q.action===i&&q.modelName===o)){let q=t.map(D=>D.action).join(", "),E=t.map(D=>D.modelName).join(", ");throw new Error(`Internal error: All queries in a compacted batch must have the same action and model name, but received actions: [${q}] and model names: [${E}]. This indicates a bug in the client. Please report this issue to the Prisma team with your query details.`)}if(o===void 0)throw new Error("Internal error: A compacted batch cannot contain raw queries. This indicates a bug in the client. Please report this issue to the Prisma team with your query details.");let M=await u.execute({plan:T.plan,placeholderValues:S,model:o,operation:i,batchIndex:void 0,transaction:A,customFetch:n?.(globalThis.fetch),queryInfo:{type:"compacted",action:i,modelName:o,queries:I}});return Ws(M,T,S).map(q=>({data:{[i]:q}}))}}}catch(A){throw this.#c(A,a)}}async apiKey(){let{executor:t}=await this.#n();return t.apiKey()}#f(t,r,n){try{return this.#m(()=>this.#h({queries:[t],execute:()=>n.compile(r)}))}catch(i){throw this.#d(i)}}#y(t,r,n){if(t.every(Pl))return {type:"multi",plans:t.map(i=>El(i))};try{return this.#m(()=>this.#h({queries:t,execute:()=>n.compileBatch(r)}))}catch(i){throw this.#d(i)}}#g(t){switch(t){case void 0:return;case "ReadUncommitted":return "READ UNCOMMITTED";case "ReadCommitted":return "READ COMMITTED";case "RepeatableRead":return "REPEATABLE READ";case "Serializable":return "SERIALIZABLE";case "Snapshot":return "SNAPSHOT";default:throw new ne.PrismaClientKnownRequestError(`Inconsistent column data: Conversion failed: Invalid isolation level \`${t}\``,{code:"P2023",clientVersion:this.config.clientVersion,meta:{providedIsolationLevel:t}})}}#h({queries:t,execute:r}){return this.tracingHelper.runInChildSpan({name:"compile",attributes:{models:t.map(n=>n.modelName).filter(n=>n!==void 0),actions:t.map(n=>n.action)}},r)}};function bl(e,t,r){return pl({binaryTarget:void 0,title:t,version:e.config.clientVersion,engineVersion:"unknown",database:e.config.activeProvider,query:r})}function Pl(e){return e.action==="queryRaw"||e.action==="executeRaw"}function El(e){let t=e.query.arguments.query,{args:r,argTypes:n}=il(e.query.arguments.parameters);return {type:e.action==="queryRaw"?"query":"execute",args:{type:"rawSql",sql:t,args:r,argTypes:n}}}function vl(e){return new yr(e)}var Sl=e=>({command:e});var Nl=require$$0;var Al=e=>e.strings.reduce((t,r,n)=>`${t}@P${n}${r}`);var Pn=require$$0;function It(e,t){try{return Rl(e,"fast",t)}catch(r){if(r instanceof TypeError)return Rl(e,"slow",t);throw r}}function Rl(e,t,r){return JSON.stringify(e.map(n=>Il(n,t,r)))}function Il(e,t,r){if(Array.isArray(e))return e.map(n=>Il(n,t,r));if(typeof e=="bigint")return {prisma__type:"bigint",prisma__value:e.toString()};if(ct(e)){if(!pt(e))throw new Pn.PrismaClientValidationError("Provided Date object is invalid",{clientVersion:r});return {prisma__type:"date",prisma__value:e.toJSON()}}if(Pn.Decimal.isDecimal(e))return {prisma__type:"decimal",prisma__value:e.toJSON()};if(Buffer.isBuffer(e))return {prisma__type:"bytes",prisma__value:e.toString("base64")};if(mm(e))return {prisma__type:"bytes",prisma__value:Buffer.from(e).toString("base64")};if(ArrayBuffer.isView(e)){let{buffer:n,byteOffset:i,byteLength:o}=e;return {prisma__type:"bytes",prisma__value:Buffer.from(n,i,o).toString("base64")}}return typeof e=="object"&&t==="slow"?kl(e):e}function mm(e){return e instanceof ArrayBuffer||e instanceof SharedArrayBuffer?true:typeof e=="object"&&e!==null?e[Symbol.toStringTag]==="ArrayBuffer"||e[Symbol.toStringTag]==="SharedArrayBuffer":false}function kl(e){if(typeof e!="object"||e===null)return e;if(typeof e.toJSON=="function")return e.toJSON();if(Array.isArray(e))return e.map(Cl);let t={};for(let r of Object.keys(e))t[r]=Cl(e[r]);return t}function Cl(e){return typeof e=="bigint"?e.toString():kl(e)}var fm=/^(\s*alter\s)/i,Ol=K("prisma:client");function Gi(e,t,r,n){if(!(e!=="postgresql"&&e!=="cockroachdb")&&r.length>0&&fm.exec(t))throw new Error(`Running ALTER using ${n} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`)}var zi=({clientMethod:e,activeProvider:t,clientVersion:r})=>n=>{let i="",o;if(Ur(n))i=n.sql,o={values:It(n.values,r),__prismaRawParameters__:true};else if(Array.isArray(n)){let[s,...a]=n;i=s,o={values:It(a||[],r),__prismaRawParameters__:true};}else switch(t){case "sqlite":case "mysql":{i=n.sql,o={values:It(n.values,r),__prismaRawParameters__:true};break}case "cockroachdb":case "postgresql":case "postgres":{i=n.text,o={values:It(n.values,r),__prismaRawParameters__:true};break}case "sqlserver":{i=Al(n),o={values:It(n.values,r),__prismaRawParameters__:true};break}default:throw new Error(`The ${t} provider does not support ${e}`)}return o?.values?Ol(`prisma.${e}(${i}, ${o.values})`):Ol(`prisma.${e}(${i})`),{query:i,parameters:o}},Dl={requestArgsToMiddlewareArgs(e){return [e.strings,...e.values]},middlewareArgsToRequestArgs(e){let[t,...r]=e;return new Nl.Sql(t,r)}},Ml={requestArgsToMiddlewareArgs(e){return [e]},middlewareArgsToRequestArgs(e){return e[0]}};function Hi(e){return function(r,n){let i,o=(s=e)=>{try{return s===void 0||s?.kind==="itx"?i??=Fl(r(s)):Fl(r(s))}catch(a){return Promise.reject(a)}};return {get spec(){return n},then(s,a){return o().then(s,a)},catch(s){return o().catch(s)},finally(s){return o().finally(s)},requestTransaction(s){let a=o(s);return a.requestTransaction?a.requestTransaction(s):a},[Symbol.toStringTag]:"PrismaPromise"}}}function Fl(e){return typeof e.then=="function"?e:Promise.resolve(e)}var _l={version:"7.10.0"};var ym=_l.version.split(".")[0],hm="PRISMA_INSTRUMENTATION",wm=`V${ym}_PRISMA_INSTRUMENTATION`,$l=globalThis;function Ll(){let e=$l[wm];return e?.helper?e.helper:$l[hm]?.helper}var xm={isEnabled(){return  false},getTraceParent(){return "00-10-10-00"},dispatchEngineSpans(e,t,r){for(let n of t)r(n);},getActiveContext(){},runInChildSpan(e,t){return t()}},Wi=class{isEnabled(){return this.getTracingHelper().isEnabled()}getTraceParent(t){return this.getTracingHelper().getTraceParent(t)}dispatchEngineSpans(t,r,n){return this.getTracingHelper().dispatchEngineSpans(t,r,n)}getActiveContext(){return this.getTracingHelper().getActiveContext()}runInChildSpan(t,r){return this.getTracingHelper().runInChildSpan(t,r)}getTracingHelper(){return Ll()??xm}};function Vl(){return new Wi}function ql(e,t=()=>{}){let r,n=new Promise(i=>r=i);return {then(i){return --e===0&&r(t()),i?.(n)}}}function Ul(e){return typeof e=="string"?e:e.reduce((t,r)=>{let n=typeof r=="string"?r:r.level;return n==="query"?t:t&&(r==="info"||t==="info")?"info":n},void 0)}var Ql=require$$0;function Zi(e){if(e.action!=="findUnique"&&e.action!=="findUniqueOrThrow")return;let t=[];return e.modelName&&t.push(e.modelName),e.query.arguments&&t.push(Ki(e.query.arguments)),t.push(Ki(e.query.selection)),t.join("")}function Ki(e){return `(${Object.keys(e).sort().map(r=>{let n=e[r];return typeof n=="object"&&n!==null?`(${r} ${Ki(n)})`:r}).join(" ")})`}var bm={aggregate:false,aggregateRaw:false,createMany:true,createManyAndReturn:true,createOne:true,deleteMany:true,deleteOne:true,executeRaw:true,findFirst:false,findFirstOrThrow:false,findMany:false,findRaw:false,findUnique:false,findUniqueOrThrow:false,groupBy:false,queryRaw:false,runCommandRaw:true,updateMany:true,updateManyAndReturn:true,updateOne:true,upsertOne:true};function Xi(e){return bm[e]}var En=class{constructor(t){this.options=t;this.batches={};}batches;tickActive=false;request(t){let r=this.options.batchBy(t);return r?(this.batches[r]||(this.batches[r]=[],this.tickActive||(this.tickActive=true,process.nextTick(()=>{this.dispatchBatches(),this.tickActive=false;}))),new Promise((n,i)=>{this.batches[r].push({request:t,resolve:n,reject:i});})):this.options.singleLoader(t)}dispatchBatches(){for(let t in this.batches){let r=this.batches[t];delete this.batches[t],r.length===1?this.options.singleLoader(r[0].request).then(n=>{n instanceof Error?r[0].reject(n):r[0].resolve(n);}).catch(n=>{r[0].reject(n);}):(r.sort((n,i)=>this.options.batchOrder(n.request,i.request)),this.options.batchLoader(r.map(n=>n.request)).then(n=>{if(n instanceof Error)for(let i=0;i<r.length;i++)r[i].reject(n);else for(let i=0;i<r.length;i++){let o=n[i];o instanceof Error?r[i].reject(o):r[i].resolve(o);}}).catch(n=>{for(let i=0;i<r.length;i++)r[i].reject(n);}));}}get[Symbol.toStringTag](){return "DataLoader"}};var jl=require$$0;function st(e,t){if(t===null)return t;switch(e){case "bigint":return BigInt(t);case "bytes":return new Uint8Array(Buffer.from(t,"base64"));case "decimal":return new jl.Decimal(t);case "datetime":case "date":return new Date(t);case "time":return new Date(`1970-01-01T${t}Z`);case "bigint-array":return t.map(r=>st("bigint",r));case "bytes-array":return t.map(r=>st("bytes",r));case "decimal-array":return t.map(r=>st("decimal",r));case "datetime-array":return t.map(r=>st("datetime",r));case "date-array":return t.map(r=>st("date",r));case "time-array":return t.map(r=>st("time",r));default:return t}}function Tn(e){let t=[],r=Pm(e);for(let n=0;n<e.rows.length;n++){let i=e.rows[n],o={...r};for(let s=0;s<i.length;s++)o[e.columns[s]]=st(e.types[s],i[s]);t.push(o);}return t}function Pm(e){let t={};for(let r=0;r<e.columns.length;r++)t[e.columns[r]]=null;return t}function Bl(e,t){let{schema:r,name:n}=Em(t),i=Object.entries(e.models).filter(([o,s])=>(s.dbName??o)===n);if(i.length<=1)return i[0]?.[0];if(r!==void 0){let o=i.filter(([,s])=>s.schema===r);if(o.length===1)return o[0][0]}}function Em(e){let t=e.lastIndexOf(".");return t===-1?{schema:void 0,name:e}:{schema:e.slice(0,t),name:e.slice(t+1)}}var Tm=K("prisma:client:request_handler"),vn=class{client;dataloader;logEmitter;constructor(t,r){this.logEmitter=r,this.client=t,this.dataloader=new En({batchLoader:_s(async({requests:n,customDataProxyFetch:i})=>{let{transaction:o,otelParentCtx:s}=n[0],a=n.map(T=>T.protocolQuery),u=this.client._tracingHelper.getTraceParent(s),m=n.some(T=>Xi(T.protocolQuery.action));return (await this.client._engine.requestBatch(a,{traceparent:u,transaction:vm(o),containsWrite:m,customDataProxyFetch:i})).map((T,S)=>{if(T instanceof Error)return T;try{return this.mapQueryEngineResult(n[S],T)}catch(I){return I}})}),singleLoader:async n=>{let i=n.transaction?.kind==="itx"?Jl(n.transaction):void 0,o=await this.client._engine.request(n.protocolQuery,{traceparent:this.client._tracingHelper.getTraceParent(),interactiveTransaction:i,isWrite:Xi(n.protocolQuery.action),customDataProxyFetch:n.customDataProxyFetch});return this.mapQueryEngineResult(n,o)},batchBy:n=>{if(n.transaction?.kind==="itx"){let i=Zi(n.protocolQuery);return `itx-${n.transaction.id}${i?`-${i}`:""}`}return n.transaction?.id?`transaction-${n.transaction.id}`:Zi(n.protocolQuery)},batchOrder(n,i){return n.transaction?.kind==="batch"&&i.transaction?.kind==="batch"?n.transaction.index-i.transaction.index:0}});}async request(t){try{return await this.dataloader.request(t)}catch(r){let{clientMethod:n,callsite:i,transaction:o,args:s,modelName:a}=t;this.handleAndLogRequestError({error:r,clientMethod:n,callsite:i,transaction:o,args:s,modelName:a,globalOmit:t.globalOmit});}}mapQueryEngineResult({dataPath:t,unpacker:r},n){let i=n?.data,o=this.unpack(i,t,r);return process.env.PRISMA_CLIENT_GET_TIME?{data:o}:o}handleAndLogRequestError(t){try{this.handleRequestError(t);}catch(r){throw this.logEmitter&&this.logEmitter.emit("error",{message:r.message,target:t.clientMethod,timestamp:new Date}),r}}handleRequestError({error:t,clientMethod:r,callsite:n,transaction:i,args:o,modelName:s,globalOmit:a}){if(Tm(t),Sm(t,i))throw t;if(t instanceof _.PrismaClientKnownRequestError&&Am(t)){let m=Gl(t.meta);Fr({args:o,errors:[m],callsite:n,errorFormat:this.client._errorFormat,originalMethod:r,clientVersion:this.client._clientVersion,globalOmit:a});}let u=t.message;if(n&&(u=Rr({callsite:n,originalMethod:r,isPanic:t.isPanic,showColors:this.client._errorFormat==="pretty",message:u})),u=this.sanitizeMessage(u),t.code){let m=this.resolveErrorMeta(t.meta,t.code,s);throw new _.PrismaClientKnownRequestError(u,{code:t.code,clientVersion:this.client._clientVersion,meta:m,batchRequestIdx:t.batchRequestIdx})}else {if(t.isPanic)throw new _.PrismaClientRustPanicError(u,this.client._clientVersion);if(t instanceof _.PrismaClientUnknownRequestError)throw new _.PrismaClientUnknownRequestError(u,{clientVersion:this.client._clientVersion,batchRequestIdx:t.batchRequestIdx});if(t instanceof _.PrismaClientInitializationError)throw new _.PrismaClientInitializationError(u,this.client._clientVersion);if(t instanceof _.PrismaClientRustPanicError)throw new _.PrismaClientRustPanicError(u,this.client._clientVersion)}throw t.clientVersion=this.client._clientVersion,t}resolveErrorMeta(t,r,n){if(r!=="P2002"||typeof t?.table!="string")return n?{modelName:n,...t}:t;let i={...t};delete i.table;let o=Bl(this.client._runtimeDataModel,t.table)??(typeof i.modelName=="string"?i.modelName:n);return o!==void 0?{...i,modelName:o}:i}sanitizeMessage(t){return this.client._errorFormat&&this.client._errorFormat!=="pretty"?ut(t):t}unpack(t,r,n){if(!t||(t.data&&(t=t.data),!t))return t;let i=Object.keys(t)[0],o=Object.values(t)[0],s=Rm(r),a=Wn(o,s),u=i==="queryRaw"?Tn(a):Ae(a);return n?n(u):u}get[Symbol.toStringTag](){return "RequestHandler"}};function vm(e){if(e){if(e.kind==="batch")return {kind:"batch",options:{isolationLevel:e.isolationLevel,maxWait:e.maxWait,timeout:e.timeout}};if(e.kind==="itx")return {kind:"itx",options:Jl(e)};$e(e,"Unknown transaction kind");}}function Jl(e){return {id:e.id,payload:e.payload}}function Sm(e,t){return (0, Ql.hasBatchIndex)(e)&&t?.kind==="batch"&&e.batchRequestIdx!==t.index}function Am(e){return e.code==="P2009"||e.code==="P2012"}function Gl(e){if(e.kind==="Union")return {kind:"Union",errors:e.errors.map(Gl)};if(Array.isArray(e.selectionPath)){let[,...t]=e.selectionPath;return {...e,selectionPath:t}}return e}function Rm(e){let t=[];for(let r=1;r<e.length;r+=2)t.push(e[r]);return t}var Yi=mn;var Zl=Pe(qn());var j=class extends Error{constructor(t){super(t+`
Read more at https://pris.ly/d/client-constructor`),this.name="PrismaClientConstructorValidationError";}get[Symbol.toStringTag](){return "PrismaClientConstructorValidationError"}};Bt(j,"PrismaClientConstructorValidationError");var zl=["errorFormat","adapter","accelerateUrl","log","transactionOptions","omit","comments","queryPlanCacheMaxSize","__internal"],Hl=["pretty","colorless","minimal"],Wl=["info","query","warn","error"],Cm={adapter:()=>{},accelerateUrl:e=>{if(e!==void 0){if(typeof e!="string")throw new j(`Invalid value ${JSON.stringify(e)} for "accelerateUrl" provided to PrismaClient constructor.`);if(e.trim().length===0)throw new j('"accelerateUrl" provided to PrismaClient constructor must be a non-empty string.')}},errorFormat:e=>{if(e){if(typeof e!="string")throw new j(`Invalid value ${JSON.stringify(e)} for "errorFormat" provided to PrismaClient constructor.`);if(!Hl.includes(e)){let t=hr(e,Hl);throw new j(`Invalid errorFormat ${e} provided to PrismaClient constructor.${t}`)}}},log:e=>{if(!e)return;if(!Array.isArray(e))throw new j(`Invalid value ${JSON.stringify(e)} for "log" provided to PrismaClient constructor.`);function t(r){if(typeof r=="string"&&!Wl.includes(r)){let n=hr(r,Wl);throw new j(`Invalid log level "${r}" provided to PrismaClient constructor.${n}`)}}for(let r of e){t(r);let n={level:t,emit:i=>{let o=["stdout","event"];if(!o.includes(i)){let s=hr(i,o);throw new j(`Invalid value ${JSON.stringify(i)} for "emit" in logLevel provided to PrismaClient constructor.${s}`)}}};if(r&&typeof r=="object")for(let[i,o]of Object.entries(r))if(n[i])n[i](o);else throw new j(`Invalid property ${i} for "log" provided to PrismaClient constructor`)}},transactionOptions:e=>{if(!e)return;let t=e.maxWait;if(t!=null&&t<=0)throw new j(`Invalid value ${t} for maxWait in "transactionOptions" provided to PrismaClient constructor. maxWait needs to be greater than 0`);let r=e.timeout;if(r!=null&&r<=0)throw new j(`Invalid value ${r} for timeout in "transactionOptions" provided to PrismaClient constructor. timeout needs to be greater than 0`)},omit:(e,t)=>{if(typeof e!="object")throw new j('"omit" option is expected to be an object.');if(e===null)throw new j('"omit" option can not be `null`');let r=[];for(let[n,i]of Object.entries(e)){let o=Om(n,t.runtimeDataModel);if(!o){r.push({kind:"UnknownModel",modelKey:n});continue}for(let[s,a]of Object.entries(i)){let u=o.fields.find(m=>m.name===s);if(!u){r.push({kind:"UnknownField",modelKey:n,fieldName:s});continue}if(u.relationName){r.push({kind:"RelationInOmit",modelKey:n,fieldName:s});continue}typeof a!="boolean"&&r.push({kind:"InvalidFieldValue",modelKey:n,fieldName:s});}}if(r.length>0)throw new j(Nm(e,r))},queryPlanCacheMaxSize:e=>{if(e!==void 0){if(typeof e!="number")throw new j(`Invalid value ${JSON.stringify(e)} for "queryPlanCacheMaxSize" provided to PrismaClient constructor. Expected a number.`);if(!Number.isInteger(e))throw new j(`Invalid value ${e} for "queryPlanCacheMaxSize" provided to PrismaClient constructor. Expected an integer.`);if(e<0)throw new j(`Invalid value ${e} for "queryPlanCacheMaxSize" provided to PrismaClient constructor. Cache size needs to be greater or equal to 0.`)}},comments:e=>{if(e!==void 0){if(!Array.isArray(e))throw new j(`Invalid value ${JSON.stringify(e)} for "comments" provided to PrismaClient constructor. Expected an array of SQL commenter plugins.`);for(let t=0;t<e.length;t++)if(typeof e[t]!="function")throw new j(`Invalid value at index ${t} for "comments" provided to PrismaClient constructor. Each plugin must be a function.`)}},__internal:e=>{if(!e)return;let t=["debug","engine","configOverride"];if(typeof e!="object")throw new j(`Invalid value ${JSON.stringify(e)} for "__internal" to PrismaClient constructor`);for(let[r]of Object.entries(e))if(!t.includes(r)){let n=hr(r,t);throw new j(`Invalid property ${JSON.stringify(r)} for "__internal" provided to PrismaClient constructor.${n}`)}}};function Im(e){let t=e.adapter!==void 0,r=e.accelerateUrl!==void 0;if(t&&r)throw new j('The "adapter" and "accelerateUrl" options are mutually exclusive. Please provide only one of them.');if(!t&&!r)throw new j(`PrismaClient requires a driver adapter to connect to your database, but none was provided.

Pass a driver adapter to the PrismaClient constructor, for example:

  import { PrismaPg } from '@prisma/adapter-pg'
  import { PrismaClient } from './generated/prisma/client'

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

Learn more about driver adapters: https://pris.ly/d/driver-adapters

If you use Prisma Accelerate instead of connecting to your database directly, pass \`accelerateUrl\` to the PrismaClient constructor instead of \`adapter\`.`)}function Xl(e,t){for(let[r,n]of Object.entries(e)){if(!zl.includes(r)){let i=hr(r,zl);throw new j(`Unknown property ${r} provided to PrismaClient constructor.${i}`)}Cm[r](n,t);}Im(e);}function hr(e,t){if(t.length===0||typeof e!="string")return "";let r=km(e,t);return r?` Did you mean "${r}"?`:""}function km(e,t){if(t.length===0)return null;let r=t.map(i=>({value:i,distance:(0, Zl.default)(e,i)}));r.sort((i,o)=>i.distance<o.distance?-1:1);let n=r[0];return n.distance<3?n.value:null}function Om(e,t){return Kl(t.models,e)??Kl(t.types,e)}function Kl(e,t){let r=Object.keys(e).find(n=>qe(n)===t);if(r)return e[r]}function Nm(e,t){let r=bt(e);for(let o of t)switch(o.kind){case "UnknownModel":r.arguments.getField(o.modelKey)?.markAsError(),r.addErrorMessage(()=>`Unknown model name: ${o.modelKey}.`);break;case "UnknownField":r.arguments.getDeepField([o.modelKey,o.fieldName])?.markAsError(),r.addErrorMessage(()=>`Model "${o.modelKey}" does not have a field named "${o.fieldName}".`);break;case "RelationInOmit":r.arguments.getDeepField([o.modelKey,o.fieldName])?.markAsError(),r.addErrorMessage(()=>'Relations are already excluded by default and can not be specified in "omit".');break;case "InvalidFieldValue":r.arguments.getDeepFieldValue([o.modelKey,o.fieldName])?.markAsError(),r.addErrorMessage(()=>"Omit field option value must be a boolean.");break}let{message:n,args:i}=Mr(r,"colorless");return `Error validating "omit" option:

${i}

${n}`}var Yl=require$$0;function eu(e){return e.length===0?Promise.resolve([]):new Promise((t,r)=>{let n=new Array(e.length),i=null,o=false,s=0,a=()=>{o||(s++,s===e.length&&(o=true,i?r(i):t(n)));},u=m=>{o||(o=true,r(m));};for(let m=0;m<e.length;m++)e[m].then(P=>{n[m]=P,a();},P=>{if(!(0, Yl.hasBatchIndex)(P)){u(P);return}P.batchRequestIdx===m?u(P):(i||(i=P),a());});})}var kt=K("prisma:client");typeof globalThis=="object"&&(globalThis.NODE_CLIENT=true);var Dm={requestArgsToMiddlewareArgs:e=>e,middlewareArgsToRequestArgs:e=>e},su=Symbol.for("prisma.client.transaction.scope_context");function tu(e){let r=e[su];if(r===void 0)return {kind:"top-level"};if(Mm(r))return r;throw new Error("Internal error: inconsistent transaction scope context.")}function Mm(e){if(typeof e!="object"||e===null)return  false;let t=e;return t.kind==="nested"&&typeof t.txId=="string"&&typeof t.scopeId=="string"&&Fm(t.scopeState)}function Fm(e){return typeof e!="object"||e===null?false:Array.isArray(e.stack)}function _m(){return typeof globalThis.crypto?.randomUUID=="function"?globalThis.crypto.randomUUID():`${Date.now()}-${Math.random().toString(16).slice(2)}`}var $m={id:0,nextId(){return ++this.id}};function au(e){class t{_originalClient=this;_runtimeDataModel;_requestHandler;_connectionPromise;_disconnectionPromise;_engineConfig;_accelerateEngineConfig;_clientVersion;_errorFormat;_tracingHelper;_previewFeatures;_activeProvider;_globalOmit;_extensions;_engine;_appliedParent;_createPrismaPromise=Hi();constructor(n){if(!n)throw new _.PrismaClientInitializationError(`PrismaClient was instantiated without any options. A driver adapter is required to connect to your database.

Pass a driver adapter to the PrismaClient constructor, for example:

  import { PrismaPg } from '@prisma/adapter-pg'
  import { PrismaClient } from './generated/prisma/client'

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

Learn more about driver adapters: https://pris.ly/d/driver-adapters

If you use Prisma Accelerate instead of connecting to your database directly, pass \`accelerateUrl\` to the PrismaClient constructor instead of \`adapter\`.`,Yi);e=n.__internal?.configOverride?.(e)??e,Xl(n,e);let i=new ou.EventEmitter().on("error",()=>{});this._extensions=Pt.empty(),this._previewFeatures=e.previewFeatures,this._clientVersion=e.clientVersion??Yi,this._activeProvider=e.activeProvider,this._globalOmit=n?.omit,this._tracingHelper=Vl();let o;if(n.adapter){o=n.adapter;let s=e.activeProvider==="postgresql"||e.activeProvider==="cockroachdb"?"postgres":e.activeProvider;if(o.provider!==s)throw new _.PrismaClientInitializationError(`The Driver Adapter \`${o.adapterName}\`, based on \`${o.provider}\`, is not compatible with the provider \`${s}\` specified in the Prisma schema.`,this._clientVersion)}try{let s=n??{},u=(s.__internal??{}).debug===!0;if(u&&K.enable("prisma:client"),s.errorFormat?this._errorFormat=s.errorFormat:"development"==="production"?this._errorFormat="minimal":process.env.NO_COLOR?this._errorFormat="colorless":this._errorFormat="colorless",this._runtimeDataModel=e.runtimeDataModel,this._engineConfig={enableDebugLogs:u,logLevel:s.log&&Ul(s.log),logQueries:s.log&&!!(typeof s.log=="string"?s.log==="query":s.log.find(m=>typeof m=="string"?m==="query":m.level==="query")),compilerWasm:e.compilerWasm,clientVersion:e.clientVersion,previewFeatures:this._previewFeatures,activeProvider:e.activeProvider,inlineSchema:e.inlineSchema,tracingHelper:this._tracingHelper,transactionOptions:{maxWait:s.transactionOptions?.maxWait??2e3,timeout:s.transactionOptions?.timeout??5e3,isolationLevel:s.transactionOptions?.isolationLevel},logEmitter:i,adapter:o,accelerateUrl:s.accelerateUrl,sqlCommenters:s.comments,parameterizationSchema:e.parameterizationSchema,runtimeDataModel:e.runtimeDataModel,queryPlanCacheMaxSize:n.queryPlanCacheMaxSize},this._accelerateEngineConfig=Object.create(this._engineConfig),this._accelerateEngineConfig.accelerateUtils={resolveDatasourceUrl:()=>{if(s.accelerateUrl)return s.accelerateUrl;throw new _.PrismaClientInitializationError(`\`accelerateUrl\` is required when using \`@prisma/extension-accelerate\`:

new PrismaClient({
  accelerateUrl: "prisma://...",
}).$extends(withAccelerate())
`,e.clientVersion)}},kt("clientVersion",e.clientVersion),this._engine=vl(this._engineConfig),this._requestHandler=new vn(this,i),s.log)for(let m of s.log){let P=typeof m=="string"?m:m.emit==="stdout"?m.level:null;P&&this.$on(P,T=>{Ut.log(`${Ut.tags[P]??""}`,T.message||T.query);});}}catch(s){throw s.clientVersion=this._clientVersion,s}return this._appliedParent=Yt(this)}get[Symbol.toStringTag](){return "PrismaClient"}$on(n,i){return n==="beforeExit"?this._engine.onBeforeExit(i):n&&this._engineConfig.logEmitter.on(n,i),this}$connect(){try{return this._engine.start()}catch(n){throw n.clientVersion=this._clientVersion,n}}async $disconnect(){try{await this._engine.stop();}catch(n){throw n.clientVersion=this._clientVersion,n}finally{yo();}}$executeRawInternal(n,i,o,s){let a=this._activeProvider;return this._request({action:"executeRaw",args:o,transaction:n,clientMethod:i,argsMapper:zi({clientMethod:i,activeProvider:a,clientVersion:this._clientVersion}),callsite:je(this._errorFormat),dataPath:[],middlewareArgsMapper:s})}$executeRaw(n,...i){return this._createPrismaPromise(o=>{if(n.raw!==void 0||n.sql!==void 0){let[s,a]=ru(n,i);return Gi(this._activeProvider,s.text,s.values,Array.isArray(n)?"prisma.$executeRaw`<SQL>`":"prisma.$executeRaw(sql`<SQL>`)"),this.$executeRawInternal(o,"$executeRaw",s,a)}throw new _.PrismaClientValidationError("`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n",{clientVersion:this._clientVersion})})}$executeRawUnsafe(n,...i){return this._createPrismaPromise(o=>(Gi(this._activeProvider,n,i,"prisma.$executeRawUnsafe(<SQL>, [...values])"),this.$executeRawInternal(o,"$executeRawUnsafe",[n,...i])))}$runCommandRaw(n){if(e.activeProvider!=="mongodb")throw new _.PrismaClientValidationError(`The ${e.activeProvider} provider does not support $runCommandRaw. Use the mongodb provider.`,{clientVersion:this._clientVersion});return this._createPrismaPromise(i=>this._request({args:n,clientMethod:"$runCommandRaw",dataPath:[],action:"runCommandRaw",argsMapper:Sl,callsite:je(this._errorFormat),transaction:i}))}async $queryRawInternal(n,i,o,s){let a=this._activeProvider;return this._request({action:"queryRaw",args:o,transaction:n,clientMethod:i,argsMapper:zi({clientMethod:i,activeProvider:a,clientVersion:this._clientVersion}),callsite:je(this._errorFormat),dataPath:[],middlewareArgsMapper:s})}$queryRaw(n,...i){return this._createPrismaPromise(o=>{if(n.raw!==void 0||n.sql!==void 0)return this.$queryRawInternal(o,"$queryRaw",...ru(n,i));throw new _.PrismaClientValidationError("`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n",{clientVersion:this._clientVersion})})}$queryRawTyped(n){return this._createPrismaPromise(i=>{if(!this._hasPreviewFlag("typedSql"))throw new _.PrismaClientValidationError("`typedSql` preview feature must be enabled in order to access $queryRawTyped API",{clientVersion:this._clientVersion});return this.$queryRawInternal(i,"$queryRawTyped",n)})}$queryRawUnsafe(n,...i){return this._createPrismaPromise(o=>this.$queryRawInternal(o,"$queryRawUnsafe",[n,...i]))}_transactionWithArray({promises:n,options:i}){let o=$m.nextId(),s=ql(n.length),a=n.map((u,m)=>{if(u?.[Symbol.toStringTag]!=="PrismaPromise")throw new Error("All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function.");let P=i?.isolationLevel??this._engineConfig.transactionOptions.isolationLevel,T={kind:"batch",id:o,index:m,isolationLevel:P,maxWait:i?.maxWait??this._engineConfig.transactionOptions.maxWait,timeout:i?.timeout??this._engineConfig.transactionOptions.timeout,lock:s};return u.requestTransaction?.(T)??u});return eu(a)}async _transactionWithCallback({callback:n,options:i={}}){let o=tu(this),s=o.kind==="nested",a=s?o.scopeState:{stack:[]},u=a.stack,m=_m();if(s){if(u.at(-1)!==o.scopeId)throw new Error("Concurrent nested transactions are not supported");i.newTxId=o.txId;}u.push(m);let P={traceparent:this._tracingHelper.getTraceParent()},T={maxWait:i?.maxWait??this._engineConfig.transactionOptions.maxWait,timeout:i?.timeout??this._engineConfig.transactionOptions.timeout,isolationLevel:i?.isolationLevel??this._engineConfig.transactionOptions.isolationLevel,newTxId:i.newTxId},S;try{S=await this._engine.transaction("start",P,T);}catch(A){throw u.at(-1)===m&&u.pop(),A}let I;try{let A={kind:"itx",...S};if(I=await n(this._createItxClient(A,m,a)),s){if(u.at(-1)!==m)throw new Error("Nested transactions must be closed in reverse order of creation.")}else if(u.length!==1)throw new Error("Cannot close transaction while a nested transaction is still active.");await this._engine.transaction("commit",P,S);}catch(A){let L=u.at(-1)!==m?Math.max(1,u.length):1;for(let q=0;q<L;q++)await this._engine.transaction("rollback",P,S).catch(E=>{kt("rollback attempt %d/%d failed: %O",q+1,L,E);});throw A}finally{u.at(-1)===m?u.pop():u.length=0;}return I}_createItxClient(n,i,o){let s={kind:"nested",txId:n.id,scopeId:i,scopeState:o};return ve(Yt(ve(As(this),[ae("_appliedParent",()=>this._appliedParent._createItxClient(n,i,o)),ae("_createPrismaPromise",()=>Hi(n)),ae(su,()=>s)])),[Et(Os)])}$transaction(n,i){let o;typeof n=="function"?this._engineConfig.adapter?.adapterName==="@prisma/adapter-d1"?o=()=>{throw new Error("Cloudflare D1 does not support interactive transactions. We recommend you to refactor your queries with that limitation in mind, and use batch transactions with `prisma.$transactions([])` where applicable.")}:e.activeProvider==="mongodb"&&tu(this).kind==="nested"?o=()=>{throw new _.PrismaClientValidationError(`The ${e.activeProvider} provider does not support nested transactions`,{clientVersion:this._clientVersion})}:o=()=>this._transactionWithCallback({callback:n,options:i}):o=()=>this._transactionWithArray({promises:n,options:i});let s={name:"transaction",attributes:{method:"$transaction"}};return this._tracingHelper.runInChildSpan(s,o)}_request(n){n.otelParentCtx=this._tracingHelper.getActiveContext();let i=n.middlewareArgsMapper??Dm,o={args:i.requestArgsToMiddlewareArgs(n.args),dataPath:n.dataPath,runInTransaction:!!n.transaction,action:n.action,model:n.model},s={operation:{name:"operation",attributes:{method:o.action,model:o.model,name:o.model?`${o.model}.${o.action}`:o.action}}},a=async u=>{let{runInTransaction:m,args:P,...T}=u,S={...n,...T};P&&(S.args=i.middlewareArgsToRequestArgs(P)),n.transaction!==void 0&&m===false&&delete S.transaction;let I=await Fs(this,S);if(!S.model)return I;let A=qs({dataPath:S.dataPath,modelName:S.model,args:S.args,runtimeDataModel:this._runtimeDataModel});return ks({result:I,modelName:A.modelName,args:A.args,extensions:this._extensions,runtimeDataModel:this._runtimeDataModel,globalOmit:this._globalOmit})};return this._tracingHelper.runInChildSpan(s.operation,()=>new iu.AsyncResource("prisma-client-request").runInAsyncScope(()=>a(o)))}async _executeRequest({args:n,clientMethod:i,dataPath:o,callsite:s,action:a,model:u,argsMapper:m,transaction:P,unpacker:T,otelParentCtx:S,customDataProxyFetch:I}){try{n=m?m(n):n;let A={name:"serialize"},M=this._tracingHelper.runInChildSpan(A,()=>Vr({modelName:u,runtimeDataModel:this._runtimeDataModel,action:a,args:n,clientMethod:i,callsite:s,extensions:this._extensions,errorFormat:this._errorFormat,clientVersion:this._clientVersion,previewFeatures:this._previewFeatures,globalOmit:this._globalOmit}));return K.enabled("prisma:client")&&(kt("Prisma Client call:"),kt(`prisma.${i}(${gs(n)})`),kt("Generated request:"),kt(JSON.stringify(M,null,2)+`
`)),P?.kind==="batch"&&await P.lock,this._requestHandler.request({protocolQuery:M,modelName:u,action:a,clientMethod:i,dataPath:o,callsite:s,args:n,extensions:this._extensions,transaction:P,unpacker:T,otelParentCtx:S,otelChildCtx:this._tracingHelper.getActiveContext(),globalOmit:this._globalOmit,customDataProxyFetch:I})}catch(A){throw A.clientVersion=this._clientVersion,A}}_hasPreviewFlag(n){return !!this._engineConfig.previewFeatures?.includes(n)}$extends=Rs}return t}function ru(e,t){return Lm(e)?[new nu.Sql(e,t),Dl]:[e,Ml]}function Lm(e){return Array.isArray(e)&&Array.isArray(e.raw)}var Vm=new Set(["toJSON","$$typeof","asymmetricMatch",Symbol.iterator,Symbol.toStringTag,Symbol.isConcatSpreadable,Symbol.toPrimitive]);function lu(e){return new Proxy(e,{get(t,r){if(r in t)return t[r];if(!Vm.has(r))throw new TypeError(`Invalid enum value: ${String(r)}`)}})}var qm=()=>globalThis.process?.release?.name==="node",Um=()=>!!globalThis.Bun||!!globalThis.process?.versions?.bun,jm=()=>!!globalThis.Deno,Bm=()=>typeof globalThis.Netlify=="object",Qm=()=>typeof globalThis.EdgeRuntime=="object",Jm=()=>globalThis.navigator?.userAgent==="Cloudflare-Workers";function Gm(){return [[Bm,"netlify"],[Qm,"edge-light"],[Jm,"workerd"],[jm,"deno"],[Um,"bun"],[qm,"node"]].flatMap(r=>r[0]()?[r[1]]:[]).at(0)??""}var zm={node:"Node.js",workerd:"Cloudflare Workers",deno:"Deno and Deno Deploy",netlify:"Netlify Edge Functions","edge-light":"Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)"};function uu(){let e=Gm();return {id:e,prettyName:zm[e]||e,isEdge:["workerd","deno","netlify","edge-light"].includes(e)}}var _=require$$0,Fe=require$$0,ee=require$$0,cu=require$$0;

const config = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": '// ---------------------------------------------------------------------------\n// WorkQuest domain schema.\n//\n// Conventions\n// -----------\n// * Every tenant-owned model carries `companyId` and is listed in\n//   `server/utils/tenant.ts` so the tenant-scoped Prisma client can enforce\n//   isolation automatically (see `createTenantClient`).\n// * Ids are UUIDv7 (`uuid(7)`) so they sort chronologically and shard well.\n// * Timestamps are `createdAt` / `updatedAt`; soft state is modelled with\n//   explicit status enums rather than deleted flags for now.\n// * Counters that drive the gamification loop (XP, coins, streaks) live in\n//   `UserProgress`, and every mutation is accompanied by an immutable ledger\n//   row (`XpTransaction` / `CoinTransaction`) for auditing.\n// ---------------------------------------------------------------------------\n\ngenerator client {\n  provider               = "prisma-client"\n  output                 = "./generated/prisma"\n  runtime                = "nodejs"\n  moduleFormat           = "esm"\n  generatedFileExtension = "ts"\n  importFileExtension    = "ts"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// ---------------------------------------------------------------------------\n// Enums\n// ---------------------------------------------------------------------------\n\nenum UserRole {\n  OWNER\n  ADMIN\n  MANAGER\n  EMPLOYEE\n}\n\n/// Why an OTP was requested. A code issued for registration cannot be replayed\n/// to sign in to an existing account, and vice versa.\nenum OtpPurpose {\n  LOGIN\n  REGISTER\n}\n\nenum InvitationStatus {\n  PENDING\n  ACCEPTED\n  REVOKED\n  EXPIRED\n}\n\nenum UserStatus {\n  INVITED\n  ACTIVE\n  SUSPENDED\n  DEACTIVATED\n}\n\nenum TeamRole {\n  LEAD\n  MEMBER\n}\n\n/// Task lifecycle.\n///\n///   TODO \u2192 IN_PROGRESS \u2192 SUBMITTED \u2192 APPROVED\n///                            \u2193\n///                     NEEDS_REVISION \u2192 IN_PROGRESS \u2192 SUBMITTED\n///\n/// The legal edges live in `shared/utils/task.ts` (`TASK_TRANSITIONS`) and are\n/// enforced on every mutation, so a client can never post a status directly.\nenum TaskStatus {\n  TODO\n  IN_PROGRESS\n  SUBMITTED\n  NEEDS_REVISION\n  APPROVED\n}\n\nenum TaskPriority {\n  LOW\n  MEDIUM\n  HIGH\n}\n\n/// A reviewer either accepts the work or sends it back for revision.\nenum ReviewDecision {\n  APPROVED\n  CHANGES_REQUESTED\n}\n\nenum LedgerSource {\n  TASK_REVIEW\n  ACHIEVEMENT\n  CHALLENGE\n  STREAK\n  RECOGNITION\n  REWARD_REDEMPTION\n  REFUND\n  MANUAL_ADJUSTMENT\n}\n\nenum AchievementType {\n  MILESTONE\n  STREAK\n  SKILL\n  TEAM\n  SPECIAL\n}\n\nenum CatalogStatus {\n  DRAFT\n  ACTIVE\n  PAUSED\n  ARCHIVED\n}\n\nenum RewardType {\n  PHYSICAL\n  VOUCHER\n  TIME_OFF\n  DONATION\n  CUSTOM\n}\n\nenum RedemptionStatus {\n  REQUESTED\n  APPROVED\n  REJECTED\n  FULFILLED\n  CANCELLED\n}\n\nenum ChallengeStatus {\n  DRAFT\n  ACTIVE\n  COMPLETED\n  ENDED\n  CANCELLED\n}\n\nenum ParticipantStatus {\n  NOT_STARTED\n  IN_PROGRESS\n  COMPLETED\n  CLAIMED\n}\n\nenum RecognitionType {\n  PEER\n  MANAGER\n  COMPANY\n  SYSTEM\n}\n\nenum NotificationType {\n  TASK_ASSIGNED\n  TASK_SUBMITTED\n  TASK_REVIEWED\n  ACHIEVEMENT_UNLOCKED\n  LEVEL_UP\n  REWARD_AVAILABLE\n  REDEMPTION_UPDATE\n  RECOGNITION_RECEIVED\n  CHALLENGE_UPDATE\n  INVITATION\n  TEAM_UPDATE\n  SYSTEM\n}\n\nenum NotificationStatus {\n  UNREAD\n  READ\n  ARCHIVED\n}\n\n// ---------------------------------------------------------------------------\n// Tenancy\n// ---------------------------------------------------------------------------\n\n/// A tenant. Every other resource in the system belongs to exactly one company.\nmodel Company {\n  id        String   @id @default(uuid(7)) @db.Uuid\n  name      String\n  slug      String   @unique\n  logoUrl   String?\n  industry  String?\n  /// Default locale for the tenant\'s UI and digests.\n  locale    String   @default("fa")\n  /// IANA timezone used for streaks, digests and due-date math.\n  timezone  String   @default("Asia/Tehran")\n  isActive  Boolean  @default(true)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  users            User[]\n  teams            Team[]\n  teamMembers      TeamMember[]\n  levels           Level[]\n  userProgress     UserProgress[]\n  xpLedger         XpTransaction[]\n  coinLedger       CoinTransaction[]\n  tasks            Task[]\n  taskReviews      TaskReview[]\n  taskComments     TaskComment[]\n  taskAttachments  TaskAttachment[]\n  taskEvents       TaskEvent[]\n  achievements     Achievement[]\n  userAchievements UserAchievement[]\n  badges           Badge[]\n  userBadges       UserBadge[]\n  recognitions     Recognition[]\n  rewards          Reward[]\n  redemptions      RewardRedemption[]\n  challenges       Challenge[]\n  participants     ChallengeParticipant[]\n  notifications    Notification[]\n  auditLogs        AuditLog[]\n  invitations      Invitation[]\n}\n\n/// A person inside a company. One user row == one company membership.\n/// (Cross-company membership would be introduced as a `Membership` join model.)\nmodel User {\n  id          String     @id @default(uuid(7)) @db.Uuid\n  companyId   String     @db.Uuid\n  company     Company    @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  email       String?\n  /// Iranian mobile number in E.164 form, e.g. +989121234567 \u2014 the primary login handle.\n  phone       String?\n  fullName    String\n  avatarUrl   String?\n  jobTitle    String?\n  role        UserRole   @default(EMPLOYEE)\n  status      UserStatus @default(ACTIVE)\n  locale      String     @default("fa")\n  timezone    String?\n  lastLoginAt DateTime?\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n\n  progress             UserProgress?\n  teamMemberships      TeamMember[]\n  managedTeams         TeamMember[]           @relation("TeamMemberManager")\n  ownedTeams           Team[]\n  assignedTasks        Task[]                 @relation("TaskAssignee")\n  createdTasks         Task[]                 @relation("TaskAssigner")\n  taskComments         TaskComment[]\n  taskAttachments      TaskAttachment[]\n  taskEvents           TaskEvent[]\n  reviews              TaskReview[]\n  achievements         UserAchievement[]\n  badges               UserBadge[]\n  xpLedger             XpTransaction[]\n  coinLedger           CoinTransaction[]\n  recognitionsGiven    Recognition[]          @relation("RecognitionFrom")\n  recognitionsReceived Recognition[]          @relation("RecognitionTo")\n  redemptions          RewardRedemption[]\n  participations       ChallengeParticipant[]\n  notifications        Notification[]\n  sessions             Session[]\n  auditLogs            AuditLog[]\n  invitationsSent      Invitation[]           @relation("InvitationInviter")\n  invitationsAccepted  Invitation[]           @relation("InvitationAccepted")\n\n  @@unique([companyId, email])\n  @@unique([companyId, phone])\n  /// Login resolves an account from the phone number across companies, so the\n  /// composite unique index above cannot serve that lookup.\n  @@index([phone])\n  @@index([companyId, role])\n  @@index([companyId, status])\n}\n\n/// Short-lived, pre-authentication one-time password. Deliberately not tenant-scoped:\n/// the company is resolved only after the phone number is verified.\nmodel OtpCode {\n  id          String     @id @default(uuid(7)) @db.Uuid\n  phone       String\n  purpose     OtpPurpose @default(LOGIN)\n  /// scrypt digest \u2014 the plaintext code is never stored.\n  codeHash    String\n  expiresAt   DateTime\n  attempts    Int        @default(0)\n  maxAttempts Int        @default(5)\n  consumedAt  DateTime?\n  requestIp   String?\n  userAgent   String?\n  createdAt   DateTime   @default(now())\n\n  /// Lookup used by verification: newest unconsumed code for a phone+purpose.\n  @@index([phone, purpose, createdAt])\n  /// Housekeeping / abuse review: find codes that expired unused.\n  @@index([expiresAt])\n}\n\n///\n/// Single-use authorisation to finish self-service registration.\n///\n/// Issued after a phone number is OTP-verified but no account exists yet. It\n/// lives in an httpOnly cookie (the browser never sees the id) and is backed by\n/// this row so it can be revoked and is genuinely single-use \u2014 a stateless\n/// ticket could otherwise create unlimited companies within its TTL.\n///\nmodel OnboardingTicket {\n  id         String    @id @default(uuid(7)) @db.Uuid\n  phone      String\n  expiresAt  DateTime\n  consumedAt DateTime?\n  ip         String?\n  userAgent  String?\n  createdAt  DateTime  @default(now())\n\n  @@index([phone, consumedAt])\n  @@index([expiresAt])\n}\n\n/// Server-side session record. The cookie holds a signed JWT carrying `sid`,\n/// which makes sessions revocable without giving up stateless verification.\nmodel Session {\n  id        String    @id @default(uuid(7)) @db.Uuid\n  userId    String    @db.Uuid\n  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  expiresAt DateTime\n  ip        String?\n  userAgent String?\n  revokedAt DateTime?\n  createdAt DateTime  @default(now())\n\n  @@index([userId, expiresAt])\n}\n\n// ---------------------------------------------------------------------------\n// Structure\n// ---------------------------------------------------------------------------\n\nmodel Team {\n  id          String   @id @default(uuid(7)) @db.Uuid\n  companyId   String   @db.Uuid\n  company     Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  name        String\n  slug        String\n  description String?\n  leadId      String?  @db.Uuid\n  lead        User?    @relation(fields: [leadId], references: [id], onDelete: SetNull)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  members     TeamMember[]\n  tasks       Task[]\n  invitations Invitation[]\n\n  @@unique([companyId, slug])\n  @@index([companyId])\n}\n\nmodel TeamMember {\n  id        String   @id @default(uuid(7)) @db.Uuid\n  companyId String   @db.Uuid\n  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  teamId    String   @db.Uuid\n  team      Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)\n  userId    String   @db.Uuid\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  /// Direct manager for this membership \u2014 the edge used for manager-scoped access.\n  managerId String?  @db.Uuid\n  manager   User?    @relation("TeamMemberManager", fields: [managerId], references: [id], onDelete: SetNull)\n  role      TeamRole @default(MEMBER)\n  joinedAt  DateTime @default(now())\n\n  @@unique([teamId, userId])\n  /// One primary team per employee: a second membership in the same company is\n  /// a data error, not a feature.\n  @@unique([companyId, userId])\n  @@index([companyId, userId])\n  @@index([companyId, managerId])\n}\n\n// ---------------------------------------------------------------------------\n// Gamification\n// ---------------------------------------------------------------------------\n\n/// Level ladder for a tenant. `minXp` is the inclusive lower bound of the level.\nmodel Level {\n  id        String  @id @default(uuid(7)) @db.Uuid\n  companyId String  @db.Uuid\n  company   Company @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  level     Int\n  minXp     Int\n  /// Human friendly Persian title, e.g. \xAB\u06A9\u0627\u0648\u0634\u06AF\u0631\xBB or \xAB\u0631\u0627\u0647\u0628\u0631\xBB.\n  title     String?\n  iconKey   String?\n\n  @@unique([companyId, level])\n  @@index([companyId, minXp])\n}\n\n/// Denormalised counters for a user. Mutations must always be paired with a\n/// ledger row so the numbers stay explainable.\n///\n/// A pending employee invitation.\n///\n/// Invitations are deliberately **not** `User` rows: the invitee has no account\n/// yet, may be invited by several companies at once, and the invitation must be\n/// revocable and expirable without touching the user table. Accepting one is\n/// what creates the `User`.\n///\n/// `pendingPhone` carries the phone only while the invitation is open, and is\n/// nulled when it is accepted/revoked/expired. PostgreSQL treats NULLs as\n/// distinct in unique indexes, so this enforces "at most one open invitation per\n/// company + phone" while keeping the full history of closed ones.\n///\nmodel Invitation {\n  id           String           @id @default(uuid(7)) @db.Uuid\n  companyId    String           @db.Uuid\n  company      Company          @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  phone        String\n  /// Set while PENDING, cleared afterwards \u2014 see the note above.\n  pendingPhone String?\n  fullName     String\n  jobTitle     String?\n  teamId       String?          @db.Uuid\n  team         Team?            @relation(fields: [teamId], references: [id], onDelete: SetNull)\n  /// The role the invitee receives on acceptance. Never client-controlled for\n  /// anyone below ADMIN.\n  role         UserRole         @default(EMPLOYEE)\n  status       InvitationStatus @default(PENDING)\n  invitedById  String           @db.Uuid\n  invitedBy    User             @relation("InvitationInviter", fields: [invitedById], references: [id], onDelete: Cascade)\n  /// The user created when the invitation was accepted.\n  acceptedById String?          @db.Uuid\n  acceptedBy   User?            @relation("InvitationAccepted", fields: [acceptedById], references: [id], onDelete: SetNull)\n  expiresAt    DateTime\n  acceptedAt   DateTime?\n  revokedAt    DateTime?\n  createdAt    DateTime         @default(now())\n\n  @@unique([companyId, pendingPhone])\n  @@index([companyId, status])\n  @@index([phone, status])\n  @@index([expiresAt])\n}\n\nmodel UserProgress {\n  id             String    @id @default(uuid(7)) @db.Uuid\n  companyId      String    @db.Uuid\n  company        Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  userId         String    @unique @db.Uuid\n  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  xp             Int       @default(0)\n  coins          Int       @default(0)\n  levelId        String?   @db.Uuid\n  currentStreak  Int       @default(0)\n  longestStreak  Int       @default(0)\n  /// Calendar date (in the user\'s timezone) of the last activity that fed the streak.\n  lastActiveDate DateTime? @db.Date\n  updatedAt      DateTime  @updatedAt\n\n  @@index([companyId, xp])\n}\n\n/// Immutable XP ledger.\nmodel XpTransaction {\n  id            String       @id @default(uuid(7)) @db.Uuid\n  companyId     String       @db.Uuid\n  company       Company      @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  userId        String       @db.Uuid\n  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  amount        Int\n  source        LedgerSource\n  reason        String?\n  referenceType String?\n  referenceId   String?      @db.Uuid\n  createdAt     DateTime     @default(now())\n\n  @@index([companyId, userId, createdAt])\n  @@index([companyId, source])\n}\n\n/// Immutable coin ledger.\nmodel CoinTransaction {\n  id            String       @id @default(uuid(7)) @db.Uuid\n  companyId     String       @db.Uuid\n  company       Company      @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  userId        String       @db.Uuid\n  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  amount        Int\n  source        LedgerSource\n  reason        String?\n  referenceType String?\n  referenceId   String?      @db.Uuid\n  createdAt     DateTime     @default(now())\n\n  @@index([companyId, userId, createdAt])\n  @@index([companyId, source])\n}\n\nmodel Achievement {\n  id          String          @id @default(uuid(7)) @db.Uuid\n  companyId   String          @db.Uuid\n  company     Company         @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  /// Stable machine key, e.g. `first_approved_task`.\n  key         String\n  title       String\n  description String?\n  type        AchievementType @default(MILESTONE)\n  /// Declarative rule evaluated by the Phase 1 rule engine.\n  criteria    Json            @default("{}")\n  xpReward    Int             @default(0)\n  coinReward  Int             @default(0)\n  iconKey     String?\n  status      CatalogStatus   @default(ACTIVE)\n  createdAt   DateTime        @default(now())\n  updatedAt   DateTime        @updatedAt\n\n  unlocks UserAchievement[]\n  badges  Badge[]\n\n  @@unique([companyId, key])\n  @@index([companyId, status])\n}\n\nmodel UserAchievement {\n  id            String      @id @default(uuid(7)) @db.Uuid\n  companyId     String      @db.Uuid\n  company       Company     @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  userId        String      @db.Uuid\n  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)\n  achievementId String      @db.Uuid\n  achievement   Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)\n  progress      Json        @default("{}")\n  unlockedAt    DateTime    @default(now())\n\n  @@unique([userId, achievementId])\n  @@index([companyId, userId])\n}\n\nmodel Badge {\n  id            String       @id @default(uuid(7)) @db.Uuid\n  companyId     String       @db.Uuid\n  company       Company      @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  name          String\n  description   String?\n  imageUrl      String?\n  achievementId String?      @db.Uuid\n  achievement   Achievement? @relation(fields: [achievementId], references: [id], onDelete: SetNull)\n  createdAt     DateTime     @default(now())\n\n  holders UserBadge[]\n\n  @@index([companyId])\n}\n\nmodel UserBadge {\n  id        String   @id @default(uuid(7)) @db.Uuid\n  companyId String   @db.Uuid\n  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  userId    String   @db.Uuid\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  badgeId   String   @db.Uuid\n  badge     Badge    @relation(fields: [badgeId], references: [id], onDelete: Cascade)\n  awardedAt DateTime @default(now())\n\n  @@unique([userId, badgeId])\n  @@index([companyId, userId])\n}\n\n/// Kudos sent between colleagues.\nmodel Recognition {\n  id         String          @id @default(uuid(7)) @db.Uuid\n  companyId  String          @db.Uuid\n  company    Company         @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  fromUserId String          @db.Uuid\n  fromUser   User            @relation("RecognitionFrom", fields: [fromUserId], references: [id], onDelete: Cascade)\n  toUserId   String          @db.Uuid\n  toUser     User            @relation("RecognitionTo", fields: [toUserId], references: [id], onDelete: Cascade)\n  taskId     String?         @db.Uuid\n  task       Task?           @relation(fields: [taskId], references: [id], onDelete: SetNull)\n  type       RecognitionType @default(PEER)\n  message    String\n  xpAwarded  Int             @default(0)\n  createdAt  DateTime        @default(now())\n\n  @@index([companyId, toUserId, createdAt])\n}\n\n// ---------------------------------------------------------------------------\n// Work\n// ---------------------------------------------------------------------------\n\n/// A unit of work. The lifecycle is `TODO \u2192 IN_PROGRESS \u2192 SUBMITTED \u2192\n/// APPROVED`, with `SUBMITTED \u2192 NEEDS_REVISION \u2192 IN_PROGRESS` as the rework\n/// loop. Status is never written directly by a client: every change goes\n/// through a transition endpoint that validates the edge and the actor\'s role.\nmodel Task {\n  id             String       @id @default(uuid(7)) @db.Uuid\n  companyId      String       @db.Uuid\n  company        Company      @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  title          String\n  description    String?\n  status         TaskStatus   @default(TODO)\n  priority       TaskPriority @default(MEDIUM)\n  teamId         String?      @db.Uuid\n  team           Team?        @relation(fields: [teamId], references: [id], onDelete: SetNull)\n  assigneeId     String?      @db.Uuid\n  assignee       User?        @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)\n  assignerId     String?      @db.Uuid\n  assigner       User?        @relation("TaskAssigner", fields: [assignerId], references: [id], onDelete: SetNull)\n  xpReward       Int          @default(0)\n  coinReward     Int          @default(0)\n  /// Planned effort in hours, as estimated by the manager at creation time.\n  estimatedHours Decimal?     @db.Decimal(6, 2)\n  /// Self-reported completion, 0-100. Employees move it while working.\n  progress       Int          @default(0)\n  dueDate        DateTime?\n  assignedAt     DateTime?\n  startedAt      DateTime?\n  submittedAt    DateTime?\n  completedAt    DateTime?\n  /// How many times the task has come back from review. Drives the\n  /// "needs attention" surfaces on the manager dashboard.\n  revisionCount  Int          @default(0)\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n\n  reviews      TaskReview[]\n  comments     TaskComment[]\n  attachments  TaskAttachment[]\n  events       TaskEvent[]\n  recognitions Recognition[]\n\n  @@index([companyId, status])\n  @@index([companyId, assigneeId, status])\n  @@index([companyId, teamId, status])\n  @@index([companyId, dueDate])\n  @@index([companyId, status, dueDate])\n  @@index([companyId, assigneeId, dueDate])\n  @@index([companyId, priority, dueDate])\n}\n\n/// Discussion thread on a task. Visible to the assignee, the assigner and\n/// anyone who can review the task.\nmodel TaskComment {\n  id        String   @id @default(uuid(7)) @db.Uuid\n  companyId String   @db.Uuid\n  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  taskId    String   @db.Uuid\n  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  authorId  String   @db.Uuid\n  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  body      String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([companyId, taskId, createdAt])\n  @@index([companyId, authorId])\n}\n\n/// A file linked to a task. Storage is out of scope for this phase, so the row\n/// records a URL plus its metadata \u2014 an uploader can be swapped in later\n/// without touching the task endpoints.\nmodel TaskAttachment {\n  id           String   @id @default(uuid(7)) @db.Uuid\n  companyId    String   @db.Uuid\n  company      Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  taskId       String   @db.Uuid\n  task         Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  uploadedById String   @db.Uuid\n  uploadedBy   User     @relation(fields: [uploadedById], references: [id], onDelete: Cascade)\n  fileName     String\n  url          String\n  mimeType     String?\n  sizeBytes    Int?\n  createdAt    DateTime @default(now())\n\n  @@index([companyId, taskId, createdAt])\n}\n\n/// Append-only lifecycle trail: who moved the task, from what, to what.\n/// Kept separate from `AuditLog` because it is user-facing (the activity feed\n/// on the task page) rather than a security record.\nmodel TaskEvent {\n  id         String      @id @default(uuid(7)) @db.Uuid\n  companyId  String      @db.Uuid\n  company    Company     @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  taskId     String      @db.Uuid\n  task       Task        @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  actorId    String?     @db.Uuid\n  actor      User?       @relation(fields: [actorId], references: [id], onDelete: SetNull)\n  /// Machine key, e.g. `task.created`, `task.started`, `task.approved`.\n  action     String\n  fromStatus TaskStatus?\n  toStatus   TaskStatus?\n  note       String?\n  createdAt  DateTime    @default(now())\n\n  @@index([companyId, taskId, createdAt])\n}\n\nmodel TaskReview {\n  id           String         @id @default(uuid(7)) @db.Uuid\n  companyId    String         @db.Uuid\n  company      Company        @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  taskId       String         @db.Uuid\n  task         Task           @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  reviewerId   String         @db.Uuid\n  reviewer     User           @relation(fields: [reviewerId], references: [id], onDelete: Cascade)\n  decision     ReviewDecision\n  /// 0-100 quality score driving XP/coin awards. Null when the reviewer sent\n  /// the task back without grading it.\n  score        Int?\n  feedback     String?\n  xpAwarded    Int            @default(0)\n  coinsAwarded Int            @default(0)\n  createdAt    DateTime       @default(now())\n\n  @@index([companyId, taskId])\n  @@index([companyId, reviewerId, createdAt])\n}\n\n// ---------------------------------------------------------------------------\n// Rewards & challenges\n// ---------------------------------------------------------------------------\n\nmodel Reward {\n  id          String        @id @default(uuid(7)) @db.Uuid\n  companyId   String        @db.Uuid\n  company     Company       @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  title       String\n  description String?\n  type        RewardType    @default(CUSTOM)\n  cost        Int\n  stock       Int?\n  imageUrl    String?\n  status      CatalogStatus @default(ACTIVE)\n  createdAt   DateTime      @default(now())\n  updatedAt   DateTime      @updatedAt\n\n  redemptions RewardRedemption[]\n\n  @@index([companyId, status])\n}\n\nmodel RewardRedemption {\n  id          String           @id @default(uuid(7)) @db.Uuid\n  companyId   String           @db.Uuid\n  company     Company          @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  rewardId    String           @db.Uuid\n  reward      Reward           @relation(fields: [rewardId], references: [id], onDelete: Cascade)\n  userId      String           @db.Uuid\n  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)\n  status      RedemptionStatus @default(REQUESTED)\n  cost        Int\n  note        String?\n  decidedBy   String?\n  decidedAt   DateTime?\n  requestedAt DateTime         @default(now())\n\n  @@index([companyId, userId, status])\n  @@index([companyId, status])\n}\n\nmodel Challenge {\n  id          String          @id @default(uuid(7)) @db.Uuid\n  companyId   String          @db.Uuid\n  company     Company         @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  title       String\n  description String?\n  /// Machine key of the tracked metric, e.g. `tasks_approved`.\n  goalKey     String\n  goalValue   Int             @default(1)\n  xpReward    Int             @default(0)\n  coinReward  Int             @default(0)\n  startsAt    DateTime\n  endsAt      DateTime\n  status      ChallengeStatus @default(DRAFT)\n  badgeId     String?         @db.Uuid\n  createdAt   DateTime        @default(now())\n  updatedAt   DateTime        @updatedAt\n\n  participants ChallengeParticipant[]\n\n  @@index([companyId, status])\n}\n\nmodel ChallengeParticipant {\n  id          String            @id @default(uuid(7)) @db.Uuid\n  companyId   String            @db.Uuid\n  company     Company           @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  challengeId String            @db.Uuid\n  challenge   Challenge         @relation(fields: [challengeId], references: [id], onDelete: Cascade)\n  userId      String            @db.Uuid\n  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)\n  progress    Int               @default(0)\n  status      ParticipantStatus @default(NOT_STARTED)\n  completedAt DateTime?\n  joinedAt    DateTime          @default(now())\n\n  @@unique([challengeId, userId])\n  @@index([companyId, userId])\n}\n\n// ---------------------------------------------------------------------------\n// Messaging & audit\n// ---------------------------------------------------------------------------\n\nmodel Notification {\n  id        String             @id @default(uuid(7)) @db.Uuid\n  companyId String             @db.Uuid\n  company   Company            @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  userId    String             @db.Uuid\n  user      User               @relation(fields: [userId], references: [id], onDelete: Cascade)\n  type      NotificationType\n  title     String\n  body      String?\n  data      Json               @default("{}")\n  status    NotificationStatus @default(UNREAD)\n  readAt    DateTime?\n  createdAt DateTime           @default(now())\n\n  @@index([companyId, userId, status])\n  @@index([companyId, userId, createdAt])\n}\n\n/// Append-only audit trail for security-relevant and gamification events.\nmodel AuditLog {\n  id         String   @id @default(uuid(7)) @db.Uuid\n  companyId  String   @db.Uuid\n  company    Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  actorId    String?  @db.Uuid\n  actor      User?    @relation(fields: [actorId], references: [id], onDelete: SetNull)\n  action     String\n  targetType String?\n  targetId   String?\n  data       Json     @default("{}")\n  ip         String?\n  createdAt  DateTime @default(now())\n\n  @@index([companyId, action, createdAt])\n  @@index([companyId, actorId])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Company":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"industry","kind":"scalar","type":"String"},{"name":"locale","kind":"scalar","type":"String"},{"name":"timezone","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"CompanyToUser"},{"name":"teams","kind":"object","type":"Team","relationName":"CompanyToTeam"},{"name":"teamMembers","kind":"object","type":"TeamMember","relationName":"CompanyToTeamMember"},{"name":"levels","kind":"object","type":"Level","relationName":"CompanyToLevel"},{"name":"userProgress","kind":"object","type":"UserProgress","relationName":"CompanyToUserProgress"},{"name":"xpLedger","kind":"object","type":"XpTransaction","relationName":"CompanyToXpTransaction"},{"name":"coinLedger","kind":"object","type":"CoinTransaction","relationName":"CoinTransactionToCompany"},{"name":"tasks","kind":"object","type":"Task","relationName":"CompanyToTask"},{"name":"taskReviews","kind":"object","type":"TaskReview","relationName":"CompanyToTaskReview"},{"name":"taskComments","kind":"object","type":"TaskComment","relationName":"CompanyToTaskComment"},{"name":"taskAttachments","kind":"object","type":"TaskAttachment","relationName":"CompanyToTaskAttachment"},{"name":"taskEvents","kind":"object","type":"TaskEvent","relationName":"CompanyToTaskEvent"},{"name":"achievements","kind":"object","type":"Achievement","relationName":"AchievementToCompany"},{"name":"userAchievements","kind":"object","type":"UserAchievement","relationName":"CompanyToUserAchievement"},{"name":"badges","kind":"object","type":"Badge","relationName":"BadgeToCompany"},{"name":"userBadges","kind":"object","type":"UserBadge","relationName":"CompanyToUserBadge"},{"name":"recognitions","kind":"object","type":"Recognition","relationName":"CompanyToRecognition"},{"name":"rewards","kind":"object","type":"Reward","relationName":"CompanyToReward"},{"name":"redemptions","kind":"object","type":"RewardRedemption","relationName":"CompanyToRewardRedemption"},{"name":"challenges","kind":"object","type":"Challenge","relationName":"ChallengeToCompany"},{"name":"participants","kind":"object","type":"ChallengeParticipant","relationName":"ChallengeParticipantToCompany"},{"name":"notifications","kind":"object","type":"Notification","relationName":"CompanyToNotification"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToCompany"},{"name":"invitations","kind":"object","type":"Invitation","relationName":"CompanyToInvitation"}],"dbName":null,"schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToUser"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"jobTitle","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"locale","kind":"scalar","type":"String"},{"name":"timezone","kind":"scalar","type":"String"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"progress","kind":"object","type":"UserProgress","relationName":"UserToUserProgress"},{"name":"teamMemberships","kind":"object","type":"TeamMember","relationName":"TeamMemberToUser"},{"name":"managedTeams","kind":"object","type":"TeamMember","relationName":"TeamMemberManager"},{"name":"ownedTeams","kind":"object","type":"Team","relationName":"TeamToUser"},{"name":"assignedTasks","kind":"object","type":"Task","relationName":"TaskAssignee"},{"name":"createdTasks","kind":"object","type":"Task","relationName":"TaskAssigner"},{"name":"taskComments","kind":"object","type":"TaskComment","relationName":"TaskCommentToUser"},{"name":"taskAttachments","kind":"object","type":"TaskAttachment","relationName":"TaskAttachmentToUser"},{"name":"taskEvents","kind":"object","type":"TaskEvent","relationName":"TaskEventToUser"},{"name":"reviews","kind":"object","type":"TaskReview","relationName":"TaskReviewToUser"},{"name":"achievements","kind":"object","type":"UserAchievement","relationName":"UserToUserAchievement"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"UserToUserBadge"},{"name":"xpLedger","kind":"object","type":"XpTransaction","relationName":"UserToXpTransaction"},{"name":"coinLedger","kind":"object","type":"CoinTransaction","relationName":"CoinTransactionToUser"},{"name":"recognitionsGiven","kind":"object","type":"Recognition","relationName":"RecognitionFrom"},{"name":"recognitionsReceived","kind":"object","type":"Recognition","relationName":"RecognitionTo"},{"name":"redemptions","kind":"object","type":"RewardRedemption","relationName":"RewardRedemptionToUser"},{"name":"participations","kind":"object","type":"ChallengeParticipant","relationName":"ChallengeParticipantToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"invitationsSent","kind":"object","type":"Invitation","relationName":"InvitationInviter"},{"name":"invitationsAccepted","kind":"object","type":"Invitation","relationName":"InvitationAccepted"}],"dbName":null,"schema":null},"OtpCode":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"purpose","kind":"enum","type":"OtpPurpose"},{"name":"codeHash","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"attempts","kind":"scalar","type":"Int"},{"name":"maxAttempts","kind":"scalar","type":"Int"},{"name":"consumedAt","kind":"scalar","type":"DateTime"},{"name":"requestIp","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"OnboardingTicket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"consumedAt","kind":"scalar","type":"DateTime"},{"name":"ip","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"ip","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"revokedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Team":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToTeam"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"leadId","kind":"scalar","type":"String"},{"name":"lead","kind":"object","type":"User","relationName":"TeamToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"members","kind":"object","type":"TeamMember","relationName":"TeamToTeamMember"},{"name":"tasks","kind":"object","type":"Task","relationName":"TaskToTeam"},{"name":"invitations","kind":"object","type":"Invitation","relationName":"InvitationToTeam"}],"dbName":null,"schema":null},"TeamMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToTeamMember"},{"name":"teamId","kind":"scalar","type":"String"},{"name":"team","kind":"object","type":"Team","relationName":"TeamToTeamMember"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeamMemberToUser"},{"name":"managerId","kind":"scalar","type":"String"},{"name":"manager","kind":"object","type":"User","relationName":"TeamMemberManager"},{"name":"role","kind":"enum","type":"TeamRole"},{"name":"joinedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Level":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToLevel"},{"name":"level","kind":"scalar","type":"Int"},{"name":"minXp","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"iconKey","kind":"scalar","type":"String"}],"dbName":null,"schema":null},"Invitation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToInvitation"},{"name":"phone","kind":"scalar","type":"String"},{"name":"pendingPhone","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"jobTitle","kind":"scalar","type":"String"},{"name":"teamId","kind":"scalar","type":"String"},{"name":"team","kind":"object","type":"Team","relationName":"InvitationToTeam"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"InvitationStatus"},{"name":"invitedById","kind":"scalar","type":"String"},{"name":"invitedBy","kind":"object","type":"User","relationName":"InvitationInviter"},{"name":"acceptedById","kind":"scalar","type":"String"},{"name":"acceptedBy","kind":"object","type":"User","relationName":"InvitationAccepted"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"acceptedAt","kind":"scalar","type":"DateTime"},{"name":"revokedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"UserProgress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToUserProgress"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserProgress"},{"name":"xp","kind":"scalar","type":"Int"},{"name":"coins","kind":"scalar","type":"Int"},{"name":"levelId","kind":"scalar","type":"String"},{"name":"currentStreak","kind":"scalar","type":"Int"},{"name":"longestStreak","kind":"scalar","type":"Int"},{"name":"lastActiveDate","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"XpTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToXpTransaction"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToXpTransaction"},{"name":"amount","kind":"scalar","type":"Int"},{"name":"source","kind":"enum","type":"LedgerSource"},{"name":"reason","kind":"scalar","type":"String"},{"name":"referenceType","kind":"scalar","type":"String"},{"name":"referenceId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"CoinTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CoinTransactionToCompany"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CoinTransactionToUser"},{"name":"amount","kind":"scalar","type":"Int"},{"name":"source","kind":"enum","type":"LedgerSource"},{"name":"reason","kind":"scalar","type":"String"},{"name":"referenceType","kind":"scalar","type":"String"},{"name":"referenceId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Achievement":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"AchievementToCompany"},{"name":"key","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"AchievementType"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"xpReward","kind":"scalar","type":"Int"},{"name":"coinReward","kind":"scalar","type":"Int"},{"name":"iconKey","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"CatalogStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"unlocks","kind":"object","type":"UserAchievement","relationName":"AchievementToUserAchievement"},{"name":"badges","kind":"object","type":"Badge","relationName":"AchievementToBadge"}],"dbName":null,"schema":null},"UserAchievement":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToUserAchievement"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserAchievement"},{"name":"achievementId","kind":"scalar","type":"String"},{"name":"achievement","kind":"object","type":"Achievement","relationName":"AchievementToUserAchievement"},{"name":"progress","kind":"scalar","type":"Json"},{"name":"unlockedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Badge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"BadgeToCompany"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"achievementId","kind":"scalar","type":"String"},{"name":"achievement","kind":"object","type":"Achievement","relationName":"AchievementToBadge"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"holders","kind":"object","type":"UserBadge","relationName":"BadgeToUserBadge"}],"dbName":null,"schema":null},"UserBadge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToUserBadge"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserBadge"},{"name":"badgeId","kind":"scalar","type":"String"},{"name":"badge","kind":"object","type":"Badge","relationName":"BadgeToUserBadge"},{"name":"awardedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Recognition":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToRecognition"},{"name":"fromUserId","kind":"scalar","type":"String"},{"name":"fromUser","kind":"object","type":"User","relationName":"RecognitionFrom"},{"name":"toUserId","kind":"scalar","type":"String"},{"name":"toUser","kind":"object","type":"User","relationName":"RecognitionTo"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"task","kind":"object","type":"Task","relationName":"RecognitionToTask"},{"name":"type","kind":"enum","type":"RecognitionType"},{"name":"message","kind":"scalar","type":"String"},{"name":"xpAwarded","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToTask"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"priority","kind":"enum","type":"TaskPriority"},{"name":"teamId","kind":"scalar","type":"String"},{"name":"team","kind":"object","type":"Team","relationName":"TaskToTeam"},{"name":"assigneeId","kind":"scalar","type":"String"},{"name":"assignee","kind":"object","type":"User","relationName":"TaskAssignee"},{"name":"assignerId","kind":"scalar","type":"String"},{"name":"assigner","kind":"object","type":"User","relationName":"TaskAssigner"},{"name":"xpReward","kind":"scalar","type":"Int"},{"name":"coinReward","kind":"scalar","type":"Int"},{"name":"estimatedHours","kind":"scalar","type":"Decimal"},{"name":"progress","kind":"scalar","type":"Int"},{"name":"dueDate","kind":"scalar","type":"DateTime"},{"name":"assignedAt","kind":"scalar","type":"DateTime"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"revisionCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"reviews","kind":"object","type":"TaskReview","relationName":"TaskToTaskReview"},{"name":"comments","kind":"object","type":"TaskComment","relationName":"TaskToTaskComment"},{"name":"attachments","kind":"object","type":"TaskAttachment","relationName":"TaskToTaskAttachment"},{"name":"events","kind":"object","type":"TaskEvent","relationName":"TaskToTaskEvent"},{"name":"recognitions","kind":"object","type":"Recognition","relationName":"RecognitionToTask"}],"dbName":null,"schema":null},"TaskComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToTaskComment"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskComment"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"author","kind":"object","type":"User","relationName":"TaskCommentToUser"},{"name":"body","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"TaskAttachment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToTaskAttachment"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskAttachment"},{"name":"uploadedById","kind":"scalar","type":"String"},{"name":"uploadedBy","kind":"object","type":"User","relationName":"TaskAttachmentToUser"},{"name":"fileName","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"mimeType","kind":"scalar","type":"String"},{"name":"sizeBytes","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"TaskEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToTaskEvent"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskEvent"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"actor","kind":"object","type":"User","relationName":"TaskEventToUser"},{"name":"action","kind":"scalar","type":"String"},{"name":"fromStatus","kind":"enum","type":"TaskStatus"},{"name":"toStatus","kind":"enum","type":"TaskStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"TaskReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToTaskReview"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskReview"},{"name":"reviewerId","kind":"scalar","type":"String"},{"name":"reviewer","kind":"object","type":"User","relationName":"TaskReviewToUser"},{"name":"decision","kind":"enum","type":"ReviewDecision"},{"name":"score","kind":"scalar","type":"Int"},{"name":"feedback","kind":"scalar","type":"String"},{"name":"xpAwarded","kind":"scalar","type":"Int"},{"name":"coinsAwarded","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Reward":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToReward"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"RewardType"},{"name":"cost","kind":"scalar","type":"Int"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"CatalogStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"redemptions","kind":"object","type":"RewardRedemption","relationName":"RewardToRewardRedemption"}],"dbName":null,"schema":null},"RewardRedemption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToRewardRedemption"},{"name":"rewardId","kind":"scalar","type":"String"},{"name":"reward","kind":"object","type":"Reward","relationName":"RewardToRewardRedemption"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"RewardRedemptionToUser"},{"name":"status","kind":"enum","type":"RedemptionStatus"},{"name":"cost","kind":"scalar","type":"Int"},{"name":"note","kind":"scalar","type":"String"},{"name":"decidedBy","kind":"scalar","type":"String"},{"name":"decidedAt","kind":"scalar","type":"DateTime"},{"name":"requestedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Challenge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"ChallengeToCompany"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"goalKey","kind":"scalar","type":"String"},{"name":"goalValue","kind":"scalar","type":"Int"},{"name":"xpReward","kind":"scalar","type":"Int"},{"name":"coinReward","kind":"scalar","type":"Int"},{"name":"startsAt","kind":"scalar","type":"DateTime"},{"name":"endsAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"ChallengeStatus"},{"name":"badgeId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"participants","kind":"object","type":"ChallengeParticipant","relationName":"ChallengeToChallengeParticipant"}],"dbName":null,"schema":null},"ChallengeParticipant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"ChallengeParticipantToCompany"},{"name":"challengeId","kind":"scalar","type":"String"},{"name":"challenge","kind":"object","type":"Challenge","relationName":"ChallengeToChallengeParticipant"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ChallengeParticipantToUser"},{"name":"progress","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"ParticipantStatus"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"joinedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToNotification"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"data","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"NotificationStatus"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"AuditLogToCompany"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"actor","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"action","kind":"scalar","type":"String"},{"name":"targetType","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"data","kind":"scalar","type":"Json"},{"name":"ip","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","company","user","progress","lead","members","team","assignee","assigner","task","reviewer","reviews","author","comments","uploadedBy","attachments","actor","events","fromUser","toUser","recognitions","_count","tasks","invitedBy","acceptedBy","invitations","manager","teamMemberships","managedTeams","ownedTeams","assignedTasks","createdTasks","taskComments","taskAttachments","taskEvents","unlocks","achievement","badge","holders","badges","achievements","xpLedger","coinLedger","recognitionsGiven","recognitionsReceived","redemptions","reward","participants","challenge","participations","notifications","sessions","auditLogs","invitationsSent","invitationsAccepted","users","teams","teamMembers","levels","userProgress","taskReviews","userAchievements","userBadges","rewards","challenges","Company.findUnique","Company.findUniqueOrThrow","Company.findFirst","Company.findFirstOrThrow","Company.findMany","data","Company.createOne","Company.createMany","Company.createManyAndReturn","Company.updateOne","Company.updateMany","Company.updateManyAndReturn","create","update","Company.upsertOne","Company.deleteOne","Company.deleteMany","having","_min","_max","Company.groupBy","Company.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","OtpCode.findUnique","OtpCode.findUniqueOrThrow","OtpCode.findFirst","OtpCode.findFirstOrThrow","OtpCode.findMany","OtpCode.createOne","OtpCode.createMany","OtpCode.createManyAndReturn","OtpCode.updateOne","OtpCode.updateMany","OtpCode.updateManyAndReturn","OtpCode.upsertOne","OtpCode.deleteOne","OtpCode.deleteMany","_avg","_sum","OtpCode.groupBy","OtpCode.aggregate","OnboardingTicket.findUnique","OnboardingTicket.findUniqueOrThrow","OnboardingTicket.findFirst","OnboardingTicket.findFirstOrThrow","OnboardingTicket.findMany","OnboardingTicket.createOne","OnboardingTicket.createMany","OnboardingTicket.createManyAndReturn","OnboardingTicket.updateOne","OnboardingTicket.updateMany","OnboardingTicket.updateManyAndReturn","OnboardingTicket.upsertOne","OnboardingTicket.deleteOne","OnboardingTicket.deleteMany","OnboardingTicket.groupBy","OnboardingTicket.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Team.findUnique","Team.findUniqueOrThrow","Team.findFirst","Team.findFirstOrThrow","Team.findMany","Team.createOne","Team.createMany","Team.createManyAndReturn","Team.updateOne","Team.updateMany","Team.updateManyAndReturn","Team.upsertOne","Team.deleteOne","Team.deleteMany","Team.groupBy","Team.aggregate","TeamMember.findUnique","TeamMember.findUniqueOrThrow","TeamMember.findFirst","TeamMember.findFirstOrThrow","TeamMember.findMany","TeamMember.createOne","TeamMember.createMany","TeamMember.createManyAndReturn","TeamMember.updateOne","TeamMember.updateMany","TeamMember.updateManyAndReturn","TeamMember.upsertOne","TeamMember.deleteOne","TeamMember.deleteMany","TeamMember.groupBy","TeamMember.aggregate","Level.findUnique","Level.findUniqueOrThrow","Level.findFirst","Level.findFirstOrThrow","Level.findMany","Level.createOne","Level.createMany","Level.createManyAndReturn","Level.updateOne","Level.updateMany","Level.updateManyAndReturn","Level.upsertOne","Level.deleteOne","Level.deleteMany","Level.groupBy","Level.aggregate","Invitation.findUnique","Invitation.findUniqueOrThrow","Invitation.findFirst","Invitation.findFirstOrThrow","Invitation.findMany","Invitation.createOne","Invitation.createMany","Invitation.createManyAndReturn","Invitation.updateOne","Invitation.updateMany","Invitation.updateManyAndReturn","Invitation.upsertOne","Invitation.deleteOne","Invitation.deleteMany","Invitation.groupBy","Invitation.aggregate","UserProgress.findUnique","UserProgress.findUniqueOrThrow","UserProgress.findFirst","UserProgress.findFirstOrThrow","UserProgress.findMany","UserProgress.createOne","UserProgress.createMany","UserProgress.createManyAndReturn","UserProgress.updateOne","UserProgress.updateMany","UserProgress.updateManyAndReturn","UserProgress.upsertOne","UserProgress.deleteOne","UserProgress.deleteMany","UserProgress.groupBy","UserProgress.aggregate","XpTransaction.findUnique","XpTransaction.findUniqueOrThrow","XpTransaction.findFirst","XpTransaction.findFirstOrThrow","XpTransaction.findMany","XpTransaction.createOne","XpTransaction.createMany","XpTransaction.createManyAndReturn","XpTransaction.updateOne","XpTransaction.updateMany","XpTransaction.updateManyAndReturn","XpTransaction.upsertOne","XpTransaction.deleteOne","XpTransaction.deleteMany","XpTransaction.groupBy","XpTransaction.aggregate","CoinTransaction.findUnique","CoinTransaction.findUniqueOrThrow","CoinTransaction.findFirst","CoinTransaction.findFirstOrThrow","CoinTransaction.findMany","CoinTransaction.createOne","CoinTransaction.createMany","CoinTransaction.createManyAndReturn","CoinTransaction.updateOne","CoinTransaction.updateMany","CoinTransaction.updateManyAndReturn","CoinTransaction.upsertOne","CoinTransaction.deleteOne","CoinTransaction.deleteMany","CoinTransaction.groupBy","CoinTransaction.aggregate","Achievement.findUnique","Achievement.findUniqueOrThrow","Achievement.findFirst","Achievement.findFirstOrThrow","Achievement.findMany","Achievement.createOne","Achievement.createMany","Achievement.createManyAndReturn","Achievement.updateOne","Achievement.updateMany","Achievement.updateManyAndReturn","Achievement.upsertOne","Achievement.deleteOne","Achievement.deleteMany","Achievement.groupBy","Achievement.aggregate","UserAchievement.findUnique","UserAchievement.findUniqueOrThrow","UserAchievement.findFirst","UserAchievement.findFirstOrThrow","UserAchievement.findMany","UserAchievement.createOne","UserAchievement.createMany","UserAchievement.createManyAndReturn","UserAchievement.updateOne","UserAchievement.updateMany","UserAchievement.updateManyAndReturn","UserAchievement.upsertOne","UserAchievement.deleteOne","UserAchievement.deleteMany","UserAchievement.groupBy","UserAchievement.aggregate","Badge.findUnique","Badge.findUniqueOrThrow","Badge.findFirst","Badge.findFirstOrThrow","Badge.findMany","Badge.createOne","Badge.createMany","Badge.createManyAndReturn","Badge.updateOne","Badge.updateMany","Badge.updateManyAndReturn","Badge.upsertOne","Badge.deleteOne","Badge.deleteMany","Badge.groupBy","Badge.aggregate","UserBadge.findUnique","UserBadge.findUniqueOrThrow","UserBadge.findFirst","UserBadge.findFirstOrThrow","UserBadge.findMany","UserBadge.createOne","UserBadge.createMany","UserBadge.createManyAndReturn","UserBadge.updateOne","UserBadge.updateMany","UserBadge.updateManyAndReturn","UserBadge.upsertOne","UserBadge.deleteOne","UserBadge.deleteMany","UserBadge.groupBy","UserBadge.aggregate","Recognition.findUnique","Recognition.findUniqueOrThrow","Recognition.findFirst","Recognition.findFirstOrThrow","Recognition.findMany","Recognition.createOne","Recognition.createMany","Recognition.createManyAndReturn","Recognition.updateOne","Recognition.updateMany","Recognition.updateManyAndReturn","Recognition.upsertOne","Recognition.deleteOne","Recognition.deleteMany","Recognition.groupBy","Recognition.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskComment.findUnique","TaskComment.findUniqueOrThrow","TaskComment.findFirst","TaskComment.findFirstOrThrow","TaskComment.findMany","TaskComment.createOne","TaskComment.createMany","TaskComment.createManyAndReturn","TaskComment.updateOne","TaskComment.updateMany","TaskComment.updateManyAndReturn","TaskComment.upsertOne","TaskComment.deleteOne","TaskComment.deleteMany","TaskComment.groupBy","TaskComment.aggregate","TaskAttachment.findUnique","TaskAttachment.findUniqueOrThrow","TaskAttachment.findFirst","TaskAttachment.findFirstOrThrow","TaskAttachment.findMany","TaskAttachment.createOne","TaskAttachment.createMany","TaskAttachment.createManyAndReturn","TaskAttachment.updateOne","TaskAttachment.updateMany","TaskAttachment.updateManyAndReturn","TaskAttachment.upsertOne","TaskAttachment.deleteOne","TaskAttachment.deleteMany","TaskAttachment.groupBy","TaskAttachment.aggregate","TaskEvent.findUnique","TaskEvent.findUniqueOrThrow","TaskEvent.findFirst","TaskEvent.findFirstOrThrow","TaskEvent.findMany","TaskEvent.createOne","TaskEvent.createMany","TaskEvent.createManyAndReturn","TaskEvent.updateOne","TaskEvent.updateMany","TaskEvent.updateManyAndReturn","TaskEvent.upsertOne","TaskEvent.deleteOne","TaskEvent.deleteMany","TaskEvent.groupBy","TaskEvent.aggregate","TaskReview.findUnique","TaskReview.findUniqueOrThrow","TaskReview.findFirst","TaskReview.findFirstOrThrow","TaskReview.findMany","TaskReview.createOne","TaskReview.createMany","TaskReview.createManyAndReturn","TaskReview.updateOne","TaskReview.updateMany","TaskReview.updateManyAndReturn","TaskReview.upsertOne","TaskReview.deleteOne","TaskReview.deleteMany","TaskReview.groupBy","TaskReview.aggregate","Reward.findUnique","Reward.findUniqueOrThrow","Reward.findFirst","Reward.findFirstOrThrow","Reward.findMany","Reward.createOne","Reward.createMany","Reward.createManyAndReturn","Reward.updateOne","Reward.updateMany","Reward.updateManyAndReturn","Reward.upsertOne","Reward.deleteOne","Reward.deleteMany","Reward.groupBy","Reward.aggregate","RewardRedemption.findUnique","RewardRedemption.findUniqueOrThrow","RewardRedemption.findFirst","RewardRedemption.findFirstOrThrow","RewardRedemption.findMany","RewardRedemption.createOne","RewardRedemption.createMany","RewardRedemption.createManyAndReturn","RewardRedemption.updateOne","RewardRedemption.updateMany","RewardRedemption.updateManyAndReturn","RewardRedemption.upsertOne","RewardRedemption.deleteOne","RewardRedemption.deleteMany","RewardRedemption.groupBy","RewardRedemption.aggregate","Challenge.findUnique","Challenge.findUniqueOrThrow","Challenge.findFirst","Challenge.findFirstOrThrow","Challenge.findMany","Challenge.createOne","Challenge.createMany","Challenge.createManyAndReturn","Challenge.updateOne","Challenge.updateMany","Challenge.updateManyAndReturn","Challenge.upsertOne","Challenge.deleteOne","Challenge.deleteMany","Challenge.groupBy","Challenge.aggregate","ChallengeParticipant.findUnique","ChallengeParticipant.findUniqueOrThrow","ChallengeParticipant.findFirst","ChallengeParticipant.findFirstOrThrow","ChallengeParticipant.findMany","ChallengeParticipant.createOne","ChallengeParticipant.createMany","ChallengeParticipant.createManyAndReturn","ChallengeParticipant.updateOne","ChallengeParticipant.updateMany","ChallengeParticipant.updateManyAndReturn","ChallengeParticipant.upsertOne","ChallengeParticipant.deleteOne","ChallengeParticipant.deleteMany","ChallengeParticipant.groupBy","ChallengeParticipant.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","AND","OR","NOT","id","companyId","actorId","action","targetType","targetId","ip","createdAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","userId","NotificationType","type","title","body","NotificationStatus","status","readAt","challengeId","ParticipantStatus","completedAt","joinedAt","description","goalKey","goalValue","xpReward","coinReward","startsAt","endsAt","ChallengeStatus","badgeId","updatedAt","rewardId","RedemptionStatus","cost","note","decidedBy","decidedAt","requestedAt","RewardType","stock","imageUrl","CatalogStatus","taskId","reviewerId","ReviewDecision","decision","score","feedback","xpAwarded","coinsAwarded","TaskStatus","fromStatus","toStatus","uploadedById","fileName","url","mimeType","sizeBytes","authorId","TaskPriority","priority","teamId","assigneeId","assignerId","estimatedHours","dueDate","assignedAt","startedAt","submittedAt","revisionCount","fromUserId","toUserId","RecognitionType","message","awardedAt","name","achievementId","unlockedAt","key","AchievementType","criteria","iconKey","amount","LedgerSource","source","reason","referenceType","referenceId","xp","coins","levelId","currentStreak","longestStreak","lastActiveDate","phone","pendingPhone","fullName","jobTitle","UserRole","role","InvitationStatus","invitedById","acceptedById","expiresAt","acceptedAt","revokedAt","level","minXp","managerId","TeamRole","slug","leadId","userAgent","consumedAt","OtpPurpose","purpose","codeHash","attempts","maxAttempts","requestIp","email","avatarUrl","UserStatus","locale","timezone","lastLoginAt","logoUrl","industry","isActive","every","some","none","companyId_key","companyId_level","challengeId_userId","userId_badgeId","userId_achievementId","companyId_slug","companyId_pendingPhone","teamId_userId","companyId_userId","companyId_email","companyId_phone","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "nhOFAsADJRYAAOYHACAYAADdBwAgGwAA7QcAICIAAN8HACAjAADgBwAgJAAA4QcAICkAAOQHACAqAADiBwAgKwAA2wcAICwAANwHACAvAADoBwAgMQAA6gcAIDQAAOsHACA2AADsBwAgOQAA1gcAIDoAANcHACA7AADYBwAgPAAA2QcAID0AANoHACA-AADeBwAgPwAA4wcAIEAAAOUHACBBAADnBwAgQgAA6QcAIIsEAADUBwAwjAQAANEBABCNBAAA1AcAMI4EAQAAAAGVBEAAwQcAIbwEQADBBwAh6QQBAMAHACGMBQEAAAABmQUBAMAHACGaBQEAwAcAIZwFAQDDBwAhnQUBAMMHACGeBSAA1QcAIQEAAAABACApAwAA8QcAIAUAALUIACANAADeBwAgHQAA2AcAIB4AANgHACAfAADXBwAgIAAA3QcAICEAAN0HACAiAADfBwAgIwAA4AcAICQAAOEHACApAADlBwAgKgAA4wcAICsAANsHACAsAADcBwAgLQAA5gcAIC4AAOYHACAvAADoBwAgMwAA6gcAIDQAAOsHACA1AAC2CAAgNgAA7AcAIDcAAO0HACA4AADtBwAgiwQAALMIADCMBAAAAwAQjQQAALMIADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGtBAAAtAiZBSK8BEAAwQcAIfwEAQDDBwAh_gQBAMAHACH_BAEAwwcAIYEFAACbCIEFIpYFAQDDBwAhlwUBAMMHACGZBQEAwAcAIZoFAQDDBwAhmwVAAMIHACEeAwAArhAAIAUAALYQACANAACeEAAgHQAAmBAAIB4AAJgQACAfAACXEAAgIAAAnRAAICEAAJ0QACAiAACfEAAgIwAAoBAAICQAAKEQACApAAClEAAgKgAAoxAAICsAAJsQACAsAACcEAAgLQAAphAAIC4AAKYQACAvAACoEAAgMwAAqhAAIDQAAKsQACA1AAC3EAAgNgAArBAAIDcAAK0QACA4AACtEAAg_AQAALcIACD_BAAAtwgAIJYFAAC3CAAglwUAALcIACCaBQAAtwgAIJsFAAC3CAAgKwMAAPEHACAFAAC1CAAgDQAA3gcAIB0AANgHACAeAADYBwAgHwAA1wcAICAAAN0HACAhAADdBwAgIgAA3wcAICMAAOAHACAkAADhBwAgKQAA5QcAICoAAOMHACArAADbBwAgLAAA3AcAIC0AAOYHACAuAADmBwAgLwAA6AcAIDMAAOoHACA0AADrBwAgNQAAtggAIDYAAOwHACA3AADtBwAgOAAA7QcAIIsEAACzCAAwjAQAAAMAEI0EAACzCAAwjgQBAAAAAY8EAQC_BwAhlQRAAMEHACGtBAAAtAiZBSK8BEAAwQcAIfwEAQDDBwAh_gQBAMAHACH_BAEAwwcAIYEFAACbCIEFIpYFAQDDBwAhlwUBAMMHACGZBQEAwAcAIZoFAQDDBwAhmwVAAMIHACGrBQAAsQgAIKwFAACyCAAgAwAAAAMAIAEAAAQAMAIAAAUAIA8DAADxBwAgBAAA_AcAIIsEAAD7BwAwjAQAAAcAEI0EAAD7BwAwjgQBAL8HACGPBAEAvwcAIacEAQC_BwAhvARAAMEHACH2BAIAywcAIfcEAgDLBwAh-AQBAPAHACH5BAIAywcAIfoEAgDLBwAh-wRAAMIHACEBAAAABwAgDgMAAPEHACAEAAD8BwAgCAAAsAgAIBwAAIAIACCLBAAArggAMIwEAAAJABCNBAAArggAMI4EAQC_BwAhjwQBAL8HACGnBAEAvwcAIbIEQADBBwAh2wQBAL8HACGBBQAArwiMBSKKBQEA8AcAIQUDAACuEAAgBAAArxAAIAgAALQQACAcAACvEAAgigUAALcIACAQAwAA8QcAIAQAAPwHACAIAACwCAAgHAAAgAgAIIsEAACuCAAwjAQAAAkAEI0EAACuCAAwjgQBAAAAAY8EAQC_BwAhpwQBAL8HACGyBEAAwQcAIdsEAQC_BwAhgQUAAK8IjAUiigUBAPAHACGpBQAArAgAIKoFAACtCAAgAwAAAAkAIAEAAAoAMAIAAAsAIAEAAAADACADAAAACQAgAQAACgAwAgAACwAgIQMAAPEHACAFAgDLBwAhCAAAnQgAIAkAAIAIACAKAACACAAgDQAA3gcAIA8AAN8HACARAADgBwAgEwAA4QcAIBYAAOYHACCLBAAAqAgAMIwEAAAPABCNBAAAqAgAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIaoEAQDABwAhrQQAAKkI0QQisQRAAMIHACGzBAEAwwcAIbYEAgDLBwAhtwQCAMsHACG8BEAAwQcAIdoEAACqCNoEItsEAQDwBwAh3AQBAPAHACHdBAEA8AcAId4EEACrCAAh3wRAAMIHACHgBEAAwgcAIeEEQADCBwAh4gRAAMIHACHjBAIAywcAIRMDAACuEAAgCAAAtBAAIAkAAK8QACAKAACvEAAgDQAAnhAAIA8AAJ8QACARAACgEAAgEwAAoRAAIBYAAKYQACCxBAAAtwgAILMEAAC3CAAg2wQAALcIACDcBAAAtwgAIN0EAAC3CAAg3gQAALcIACDfBAAAtwgAIOAEAAC3CAAg4QQAALcIACDiBAAAtwgAICEDAADxBwAgBQIAywcAIQgAAJ0IACAJAACACAAgCgAAgAgAIA0AAN4HACAPAADfBwAgEQAA4AcAIBMAAOEHACAWAADmBwAgiwQAAKgIADCMBAAADwAQjQQAAKgIADCOBAEAAAABjwQBAL8HACGVBEAAwQcAIaoEAQDABwAhrQQAAKkI0QQisQRAAMIHACGzBAEAwwcAIbYEAgDLBwAhtwQCAMsHACG8BEAAwQcAIdoEAACqCNoEItsEAQDwBwAh3AQBAPAHACHdBAEA8AcAId4EEACrCAAh3wRAAMIHACHgBEAAwgcAIeEEQADCBwAh4gRAAMIHACHjBAIAywcAIQMAAAAPACABAAAQADACAAARACAQAwAA8QcAIAYAAIAIACAHAADYBwAgGAAA3QcAIBsAAO0HACCLBAAAmAgAMIwEAAATABCNBAAAmAgAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIbMEAQDDBwAhvARAAMEHACHpBAEAwAcAIYwFAQDABwAhjQUBAPAHACEBAAAAEwAgAQAAAAMAIAEAAAADACAQAwAA8QcAIAsAAKMIACAMAAD8BwAgiwQAAKYIADCMBAAAFwAQjQQAAKYIADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACHIBAEAvwcAIckEAQC_BwAhywQAAKcIywQizAQCAPUHACHNBAEAwwcAIc4EAgDLBwAhzwQCAMsHACEFAwAArhAAIAsAALUQACAMAACvEAAgzAQAALcIACDNBAAAtwgAIBADAADxBwAgCwAAowgAIAwAAPwHACCLBAAApggAMIwEAAAXABCNBAAApggAMI4EAQAAAAGPBAEAvwcAIZUEQADBBwAhyAQBAL8HACHJBAEAvwcAIcsEAACnCMsEIswEAgD1BwAhzQQBAMMHACHOBAIAywcAIc8EAgDLBwAhAwAAABcAIAEAABgAMAIAABkAIA0DAADxBwAgCwAAowgAIA4AAPwHACCLBAAApQgAMIwEAAAbABCNBAAApQgAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIasEAQDABwAhvARAAMEHACHIBAEAvwcAIdgEAQC_BwAhAwMAAK4QACALAAC1EAAgDgAArxAAIA0DAADxBwAgCwAAowgAIA4AAPwHACCLBAAApQgAMIwEAAAbABCNBAAApQgAMI4EAQAAAAGPBAEAvwcAIZUEQADBBwAhqwQBAMAHACG8BEAAwQcAIcgEAQC_BwAh2AQBAL8HACEDAAAAGwAgAQAAHAAwAgAAHQAgDwMAAPEHACALAACjCAAgEAAA_AcAIIsEAACkCAAwjAQAAB8AEI0EAACkCAAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhyAQBAL8HACHTBAEAvwcAIdQEAQDABwAh1QQBAMAHACHWBAEAwwcAIdcEAgD1BwAhBQMAAK4QACALAAC1EAAgEAAArxAAINYEAAC3CAAg1wQAALcIACAPAwAA8QcAIAsAAKMIACAQAAD8BwAgiwQAAKQIADCMBAAAHwAQjQQAAKQIADCOBAEAAAABjwQBAL8HACGVBEAAwQcAIcgEAQC_BwAh0wQBAL8HACHUBAEAwAcAIdUEAQDABwAh1gQBAMMHACHXBAIA9QcAIQMAAAAfACABAAAgADACAAAhACAPAwAA8QcAIAsAAKMIACASAACACAAgiwQAAKEIADCMBAAAIwAQjQQAAKEIADCOBAEAvwcAIY8EAQC_BwAhkAQBAPAHACGRBAEAwAcAIZUEQADBBwAhwAQBAMMHACHIBAEAvwcAIdEEAACiCNEEI9IEAACiCNEEIwcDAACuEAAgCwAAtRAAIBIAAK8QACCQBAAAtwgAIMAEAAC3CAAg0QQAALcIACDSBAAAtwgAIA8DAADxBwAgCwAAowgAIBIAAIAIACCLBAAAoQgAMIwEAAAjABCNBAAAoQgAMI4EAQAAAAGPBAEAvwcAIZAEAQDwBwAhkQQBAMAHACGVBEAAwQcAIcAEAQDDBwAhyAQBAL8HACHRBAAAogjRBCPSBAAAogjRBCMDAAAAIwAgAQAAJAAwAgAAJQAgAQAAAAMAIBADAADxBwAgCwAAoAgAIBQAAPwHACAVAAD8BwAgiwQAAJ4IADCMBAAAKAAQjQQAAJ4IADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGpBAAAnwjnBCLIBAEA8AcAIc4EAgDLBwAh5AQBAL8HACHlBAEAvwcAIecEAQDABwAhBQMAAK4QACALAAC1EAAgFAAArxAAIBUAAK8QACDIBAAAtwgAIBADAADxBwAgCwAAoAgAIBQAAPwHACAVAAD8BwAgiwQAAJ4IADCMBAAAKAAQjQQAAJ4IADCOBAEAAAABjwQBAL8HACGVBEAAwQcAIakEAACfCOcEIsgEAQDwBwAhzgQCAMsHACHkBAEAvwcAIeUEAQC_BwAh5wQBAMAHACEDAAAAKAAgAQAAKQAwAgAAKgAgAQAAAA8AIAEAAAAXACABAAAAGwAgAQAAAB8AIAEAAAAjACABAAAAKAAgFgMAAPEHACAIAACdCAAgGQAA_AcAIBoAAIAIACCLBAAAmggAMIwEAAAyABCNBAAAmggAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIa0EAACcCIMFItsEAQDwBwAh_AQBAMAHACH9BAEAwwcAIf4EAQDABwAh_wQBAMMHACGBBQAAmwiBBSKDBQEAvwcAIYQFAQDwBwAhhQVAAMEHACGGBUAAwgcAIYcFQADCBwAhCgMAAK4QACAIAAC0EAAgGQAArxAAIBoAAK8QACDbBAAAtwgAIP0EAAC3CAAg_wQAALcIACCEBQAAtwgAIIYFAAC3CAAghwUAALcIACAXAwAA8QcAIAgAAJ0IACAZAAD8BwAgGgAAgAgAIIsEAACaCAAwjAQAADIAEI0EAACaCAAwjgQBAAAAAY8EAQC_BwAhlQRAAMEHACGtBAAAnAiDBSLbBAEA8AcAIfwEAQDABwAh_QQBAMMHACH-BAEAwAcAIf8EAQDDBwAhgQUAAJsIgQUigwUBAL8HACGEBQEA8AcAIYUFQADBBwAhhgVAAMIHACGHBUAAwgcAIagFAACZCAAgAwAAADIAIAEAADMAMAIAADQAIAEAAAATACABAAAAAwAgAQAAAAkAIAEAAAAPACABAAAAMgAgAQAAAAMAIAMAAAAJACABAAAKADACAAALACAHAwAArhAAIAYAAK8QACAHAACYEAAgGAAAnRAAIBsAAK0QACCzBAAAtwgAII0FAAC3CAAgEQMAAPEHACAGAACACAAgBwAA2AcAIBgAAN0HACAbAADtBwAgiwQAAJgIADCMBAAAEwAQjQQAAJgIADCOBAEAAAABjwQBAL8HACGVBEAAwQcAIbMEAQDDBwAhvARAAMEHACHpBAEAwAcAIYwFAQDABwAhjQUBAPAHACGnBQAAlwgAIAMAAAATACABAAA9ADACAAA-ACADAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAMAAAAbACABAAAcADACAAAdACADAAAAHwAgAQAAIAAwAgAAIQAgAwAAACMAIAEAACQAMAIAACUAIAMAAAAXACABAAAYADACAAAZACAMAwAA8QcAIAQAAPwHACAFAAD6BwAgJgAAlggAIIsEAACVCAAwjAQAAEYAEI0EAACVCAAwjgQBAL8HACGPBAEAvwcAIacEAQC_BwAh6gQBAL8HACHrBEAAwQcAIQMDAACuEAAgBAAArxAAICYAALMQACANAwAA8QcAIAQAAPwHACAFAAD6BwAgJgAAlggAIIsEAACVCAAwjAQAAEYAEI0EAACVCAAwjgQBAAAAAY8EAQC_BwAhpwQBAL8HACHqBAEAvwcAIesEQADBBwAhpgUAAJQIACADAAAARgAgAQAARwAwAgAASAAgAwAAAEYAIAEAAEcAMAIAAEgAIA0DAADxBwAgJgAAkwgAICgAAOUHACCLBAAAkggAMIwEAABLABCNBAAAkggAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIbMEAQDDBwAhxgQBAMMHACHpBAEAwAcAIeoEAQDwBwAhBgMAAK4QACAmAACzEAAgKAAApRAAILMEAAC3CAAgxgQAALcIACDqBAAAtwgAIA0DAADxBwAgJgAAkwgAICgAAOUHACCLBAAAkggAMIwEAABLABCNBAAAkggAMI4EAQAAAAGPBAEAvwcAIZUEQADBBwAhswQBAMMHACHGBAEAwwcAIekEAQDABwAh6gQBAPAHACEDAAAASwAgAQAATAAwAgAATQAgEwMAAPEHACAlAADjBwAgKQAA5AcAIIsEAAD4BwAwjAQAAE8AEI0EAAD4BwAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhqQQAAPkH7gQiqgQBAMAHACGtBAAA9gfIBCKzBAEAwwcAIbYEAgDLBwAhtwQCAMsHACG8BEAAwQcAIewEAQDABwAh7gQAAPoHACDvBAEAwwcAIQEAAABPACALAwAA8QcAIAQAAPwHACAnAACRCAAgiwQAAJAIADCMBAAAUQAQjQQAAJAIADCOBAEAvwcAIY8EAQC_BwAhpwQBAL8HACG7BAEAvwcAIegEQADBBwAhAwMAAK4QACAEAACvEAAgJwAAshAAIAwDAADxBwAgBAAA_AcAICcAAJEIACCLBAAAkAgAMIwEAABRABCNBAAAkAgAMI4EAQAAAAGPBAEAvwcAIacEAQC_BwAhuwQBAL8HACHoBEAAwQcAIaUFAACPCAAgAwAAAFEAIAEAAFIAMAIAAFMAIAEAAABRACABAAAARgAgAQAAAEsAIAMAAABRACABAABSADACAABTACAOAwAA8QcAIAQAAPwHACCLBAAAjggAMIwEAABZABCNBAAAjggAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIacEAQC_BwAh8AQCAMsHACHyBAAAjQjyBCLzBAEAwwcAIfQEAQDDBwAh9QQBAPAHACEFAwAArhAAIAQAAK8QACDzBAAAtwgAIPQEAAC3CAAg9QQAALcIACAOAwAA8QcAIAQAAPwHACCLBAAAjggAMIwEAABZABCNBAAAjggAMI4EAQAAAAGPBAEAvwcAIZUEQADBBwAhpwQBAL8HACHwBAIAywcAIfIEAACNCPIEIvMEAQDDBwAh9AQBAMMHACH1BAEA8AcAIQMAAABZACABAABaADACAABbACAOAwAA8QcAIAQAAPwHACCLBAAAjAgAMIwEAABdABCNBAAAjAgAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIacEAQC_BwAh8AQCAMsHACHyBAAAjQjyBCLzBAEAwwcAIfQEAQDDBwAh9QQBAPAHACEFAwAArhAAIAQAAK8QACDzBAAAtwgAIPQEAAC3CAAg9QQAALcIACAOAwAA8QcAIAQAAPwHACCLBAAAjAgAMIwEAABdABCNBAAAjAgAMI4EAQAAAAGPBAEAvwcAIZUEQADBBwAhpwQBAL8HACHwBAIAywcAIfIEAACNCPIEIvMEAQDDBwAh9AQBAMMHACH1BAEA8AcAIQMAAABdACABAABeADACAABfACADAAAAKAAgAQAAKQAwAgAAKgAgAwAAACgAIAEAACkAMAIAACoAIBADAADxBwAgBAAA_AcAIDAAAIsIACCLBAAAiQgAMIwEAABjABCNBAAAiQgAMI4EAQC_BwAhjwQBAL8HACGnBAEAvwcAIa0EAACKCL8EIr0EAQC_BwAhvwQCAMsHACHABAEAwwcAIcEEAQDDBwAhwgRAAMIHACHDBEAAwQcAIQYDAACuEAAgBAAArxAAIDAAALEQACDABAAAtwgAIMEEAAC3CAAgwgQAALcIACAQAwAA8QcAIAQAAPwHACAwAACLCAAgiwQAAIkIADCMBAAAYwAQjQQAAIkIADCOBAEAAAABjwQBAL8HACGnBAEAvwcAIa0EAACKCL8EIr0EAQC_BwAhvwQCAMsHACHABAEAwwcAIcEEAQDDBwAhwgRAAMIHACHDBEAAwQcAIQMAAABjACABAABkADACAABlACADAAAAYwAgAQAAZAAwAgAAZQAgAQAAAGMAIA4DAADxBwAgBAAA_AcAIAUCAMsHACEyAACICAAgiwQAAIYIADCMBAAAaQAQjQQAAIYIADCOBAEAvwcAIY8EAQC_BwAhpwQBAL8HACGtBAAAhwixBCKvBAEAvwcAIbEEQADCBwAhsgRAAMEHACEEAwAArhAAIAQAAK8QACAyAACwEAAgsQQAALcIACAPAwAA8QcAIAQAAPwHACAFAgDLBwAhMgAAiAgAIIsEAACGCAAwjAQAAGkAEI0EAACGCAAwjgQBAAAAAY8EAQC_BwAhpwQBAL8HACGtBAAAhwixBCKvBAEAvwcAIbEEQADCBwAhsgRAAMEHACGkBQAAhQgAIAMAAABpACABAABqADACAABrACADAAAAaQAgAQAAagAwAgAAawAgAQAAAGkAIA8DAADxBwAgBAAA_AcAIEgAAPoHACCLBAAAgggAMIwEAABvABCNBAAAgggAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIacEAQC_BwAhqQQAAIMIqQQiqgQBAMAHACGrBAEAwwcAIa0EAACECK0EIq4EQADCBwAhBAMAAK4QACAEAACvEAAgqwQAALcIACCuBAAAtwgAIA8DAADxBwAgBAAA_AcAIEgAAPoHACCLBAAAgggAMIwEAABvABCNBAAAgggAMI4EAQAAAAGPBAEAvwcAIZUEQADBBwAhpwQBAL8HACGpBAAAgwipBCKqBAEAwAcAIasEAQDDBwAhrQQAAIQIrQQirgRAAMIHACEDAAAAbwAgAQAAcAAwAgAAcQAgCwQAAPwHACCLBAAAgQgAMIwEAABzABCNBAAAgQgAMI4EAQC_BwAhlAQBAMMHACGVBEAAwQcAIacEAQC_BwAhhQVAAMEHACGHBUAAwgcAIY4FAQDDBwAhBAQAAK8QACCUBAAAtwgAIIcFAAC3CAAgjgUAALcIACALBAAA_AcAIIsEAACBCAAwjAQAAHMAEI0EAACBCAAwjgQBAAAAAZQEAQDDBwAhlQRAAMEHACGnBAEAvwcAIYUFQADBBwAhhwVAAMIHACGOBQEAwwcAIQMAAABzACABAAB0ADACAAB1ACAOAwAA8QcAIBIAAIAIACBIAAD6BwAgiwQAAP8HADCMBAAAdwAQjQQAAP8HADCOBAEAvwcAIY8EAQC_BwAhkAQBAPAHACGRBAEAwAcAIZIEAQDDBwAhkwQBAMMHACGUBAEAwwcAIZUEQADBBwAhBgMAAK4QACASAACvEAAgkAQAALcIACCSBAAAtwgAIJMEAAC3CAAglAQAALcIACAOAwAA8QcAIBIAAIAIACBIAAD6BwAgiwQAAP8HADCMBAAAdwAQjQQAAP8HADCOBAEAAAABjwQBAL8HACGQBAEA8AcAIZEEAQDABwAhkgQBAMMHACGTBAEAwwcAIZQEAQDDBwAhlQRAAMEHACEDAAAAdwAgAQAAeAAwAgAAeQAgAQAAAAMAIAMAAAAyACABAAAzADACAAA0ACADAAAAMgAgAQAAMwAwAgAANAAgAQAAAAkAIAEAAAAJACABAAAAEwAgAQAAAA8AIAEAAAAPACABAAAAGwAgAQAAAB8AIAEAAAAjACABAAAAFwAgAQAAAEYAIAEAAABRACABAAAAWQAgAQAAAF0AIAEAAAAoACABAAAAKAAgAQAAAGMAIAEAAABpACABAAAAbwAgAQAAAHMAIAEAAAB3ACABAAAAMgAgAQAAADIAIAMAAAATACABAAA9ADACAAA-ACADAAAACQAgAQAACgAwAgAACwAgCgMAAPEHACCLBAAA_gcAMIwEAACWAQAQjQQAAP4HADCOBAEAvwcAIY8EAQC_BwAhqgQBAMMHACHvBAEAwwcAIYgFAgDLBwAhiQUCAMsHACEDAwAArhAAIKoEAAC3CAAg7wQAALcIACALAwAA8QcAIIsEAAD-BwAwjAQAAJYBABCNBAAA_gcAMI4EAQAAAAGPBAEAvwcAIaoEAQDDBwAh7wQBAMMHACGIBQIAywcAIYkFAgDLBwAhowUAAP0HACADAAAAlgEAIAEAAJcBADACAACYAQAgBAMAAK4QACAEAACvEAAg-AQAALcIACD7BAAAtwgAIA8DAADxBwAgBAAA_AcAIIsEAAD7BwAwjAQAAAcAEI0EAAD7BwAwjgQBAAAAAY8EAQC_BwAhpwQBAAAAAbwEQADBBwAh9gQCAMsHACH3BAIAywcAIfgEAQDwBwAh-QQCAMsHACH6BAIAywcAIfsEQADCBwAhAwAAAAcAIAEAAJoBADACAACbAQAgAwAAAFkAIAEAAFoAMAIAAFsAIAMAAABdACABAABeADACAABfACADAAAADwAgAQAAEAAwAgAAEQAgAwAAABcAIAEAABgAMAIAABkAIAMAAAAbACABAAAcADACAAAdACADAAAAHwAgAQAAIAAwAgAAIQAgAwAAACMAIAEAACQAMAIAACUAIAUDAACuEAAgJQAAoxAAICkAAKQQACCzBAAAtwgAIO8EAAC3CAAgFAMAAPEHACAlAADjBwAgKQAA5AcAIIsEAAD4BwAwjAQAAE8AEI0EAAD4BwAwjgQBAAAAAY8EAQC_BwAhlQRAAMEHACGpBAAA-QfuBCKqBAEAwAcAIa0EAAD2B8gEIrMEAQDDBwAhtgQCAMsHACG3BAIAywcAIbwEQADBBwAh7AQBAMAHACHuBAAA-gcAIO8EAQDDBwAhogUAAPcHACADAAAATwAgAQAApAEAMAIAAKUBACADAAAARgAgAQAARwAwAgAASAAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABRACABAABSADACAABTACADAAAAKAAgAQAAKQAwAgAAKgAgEAMAAPEHACAvAADoBwAgiwQAAPMHADCMBAAAqwEAEI0EAADzBwAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhqQQAAPQHxQQiqgQBAMAHACGtBAAA9gfIBCKzBAEAwwcAIbwEQADBBwAhvwQCAMsHACHFBAIA9QcAIcYEAQDDBwAhBQMAAK4QACAvAACoEAAgswQAALcIACDFBAAAtwgAIMYEAAC3CAAgEAMAAPEHACAvAADoBwAgiwQAAPMHADCMBAAAqwEAEI0EAADzBwAwjgQBAAAAAY8EAQC_BwAhlQRAAMEHACGpBAAA9AfFBCKqBAEAwAcAIa0EAAD2B8gEIrMEAQDDBwAhvARAAMEHACG_BAIAywcAIcUEAgD1BwAhxgQBAMMHACEDAAAAqwEAIAEAAKwBADACAACtAQAgAwAAAGMAIAEAAGQAMAIAAGUAIBMDAADxBwAgMQAA6gcAIIsEAADuBwAwjAQAALABABCNBAAA7gcAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIaoEAQDABwAhrQQAAO8HuwQiswQBAMMHACG0BAEAwAcAIbUEAgDLBwAhtgQCAMsHACG3BAIAywcAIbgEQADBBwAhuQRAAMEHACG7BAEA8AcAIbwEQADBBwAhBAMAAK4QACAxAACqEAAgswQAALcIACC7BAAAtwgAIBMDAADxBwAgMQAA6gcAIIsEAADuBwAwjAQAALABABCNBAAA7gcAMI4EAQAAAAGPBAEAvwcAIZUEQADBBwAhqgQBAMAHACGtBAAA7we7BCKzBAEAwwcAIbQEAQDABwAhtQQCAMsHACG2BAIAywcAIbcEAgDLBwAhuARAAMEHACG5BEAAwQcAIbsEAQDwBwAhvARAAMEHACEDAAAAsAEAIAEAALEBADACAACyAQAgAwAAAGkAIAEAAGoAMAIAAGsAIAMAAABvACABAABwADACAABxACADAAAAdwAgAQAAeAAwAgAAeQAgAwAAADIAIAEAADMAMAIAADQAIAEAAAADACABAAAAEwAgAQAAAAkAIAEAAACWAQAgAQAAAAcAIAEAAABZACABAAAAXQAgAQAAAA8AIAEAAAAXACABAAAAGwAgAQAAAB8AIAEAAAAjACABAAAATwAgAQAAAEYAIAEAAABLACABAAAAUQAgAQAAACgAIAEAAACrAQAgAQAAAGMAIAEAAACwAQAgAQAAAGkAIAEAAABvACABAAAAdwAgAQAAADIAIAEAAAABACAlFgAA5gcAIBgAAN0HACAbAADtBwAgIgAA3wcAICMAAOAHACAkAADhBwAgKQAA5AcAICoAAOIHACArAADbBwAgLAAA3AcAIC8AAOgHACAxAADqBwAgNAAA6wcAIDYAAOwHACA5AADWBwAgOgAA1wcAIDsAANgHACA8AADZBwAgPQAA2gcAID4AAN4HACA_AADjBwAgQAAA5QcAIEEAAOcHACBCAADpBwAgiwQAANQHADCMBAAA0QEAEI0EAADUBwAwjgQBAL8HACGVBEAAwQcAIbwEQADBBwAh6QQBAMAHACGMBQEAwAcAIZkFAQDABwAhmgUBAMAHACGcBQEAwwcAIZ0FAQDDBwAhngUgANUHACEaFgAAphAAIBgAAJ0QACAbAACtEAAgIgAAnxAAICMAAKAQACAkAAChEAAgKQAApBAAICoAAKIQACArAACbEAAgLAAAnBAAIC8AAKgQACAxAACqEAAgNAAAqxAAIDYAAKwQACA5AACWEAAgOgAAlxAAIDsAAJgQACA8AACZEAAgPQAAmhAAID4AAJ4QACA_AACjEAAgQAAApRAAIEEAAKcQACBCAACpEAAgnAUAALcIACCdBQAAtwgAIAMAAADRAQAgAQAA0gEAMAIAAAEAIAMAAADRAQAgAQAA0gEAMAIAAAEAIAMAAADRAQAgAQAA0gEAMAIAAAEAICIWAACOEAAgGAAAhRAAIBsAAJUQACAiAACHEAAgIwAAiBAAICQAAIkQACApAACMEAAgKgAAihAAICsAAIMQACAsAACEEAAgLwAAkBAAIDEAAJIQACA0AACTEAAgNgAAlBAAIDkAAP4PACA6AAD_DwAgOwAAgBAAIDwAAIEQACA9AACCEAAgPgAAhhAAID8AAIsQACBAAACNEAAgQQAAjxAAIEIAAJEQACCOBAEAAAABlQRAAAAAAbwEQAAAAAHpBAEAAAABjAUBAAAAAZkFAQAAAAGaBQEAAAABnAUBAAAAAZ0FAQAAAAGeBSAAAAABAUgAANYBACAKjgQBAAAAAZUEQAAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAGZBQEAAAABmgUBAAAAAZwFAQAAAAGdBQEAAAABngUgAAAAAQFIAADYAQAwAUgAANgBADAiFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDYAAJIOACA5AAD8DQAgOgAA_Q0AIDsAAP4NACA8AAD_DQAgPQAAgA4AID4AAIQOACA_AACJDgAgQAAAiw4AIEEAAI0OACBCAACPDgAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACECAAAAAQAgSAAA2wEAIAqOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AIQIAAADRAQAgSAAA3QEAIAIAAADRAQAgSAAA3QEAIAMAAAABACBPAADWAQAgUAAA2wEAIAEAAAABACABAAAA0QEAIAUXAAD4DQAgVQAA-g0AIFYAAPkNACCcBQAAtwgAIJ0FAAC3CAAgDYsEAADQBwAwjAQAAOQBABCNBAAA0AcAMI4EAQDWBgAhlQRAANsGACG8BEAA2wYAIekEAQDYBgAhjAUBANgGACGZBQEA2AYAIZoFAQDYBgAhnAUBANkGACGdBQEA2QYAIZ4FIADRBwAhAwAAANEBACABAADjAQAwVAAA5AEAIAMAAADRAQAgAQAA0gEAMAIAAAEAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgJgMAAOANACAFAADhDQAgDQAA6g0AIB0AAOINACAeAADjDQAgHwAA5A0AICAAAOUNACAhAADmDQAgIgAA5w0AICMAAOgNACAkAADpDQAgKQAA7A0AICoAAOsNACArAADtDQAgLAAA7g0AIC0AAO8NACAuAADwDQAgLwAA8Q0AIDMAAPINACA0AADzDQAgNQAA9A0AIDYAAPUNACA3AAD2DQAgOAAA9w0AII4EAQAAAAGPBAEAAAABlQRAAAAAAa0EAAAAmQUCvARAAAAAAfwEAQAAAAH-BAEAAAAB_wQBAAAAAYEFAAAAgQUClgUBAAAAAZcFAQAAAAGZBQEAAAABmgUBAAAAAZsFQAAAAAEBSAAA7AEAIA6OBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAJkFArwEQAAAAAH8BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFApYFAQAAAAGXBQEAAAABmQUBAAAAAZoFAQAAAAGbBUAAAAABAUgAAO4BADABSAAA7gEAMCYDAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIQAA8QsAICIAAPILACAjAADzCwAgJAAA9AsAICkAAPcLACAqAAD2CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACECAAAABQAgSAAA8QEAIA6OBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACECAAAAAwAgSAAA8wEAIAIAAAADACBIAADzAQAgAwAAAAUAIE8AAOwBACBQAADxAQAgAQAAAAUAIAEAAAADACAJFwAA5wsAIFUAAOkLACBWAADoCwAg_AQAALcIACD_BAAAtwgAIJYFAAC3CAAglwUAALcIACCaBQAAtwgAIJsFAAC3CAAgEYsEAADMBwAwjAQAAPoBABCNBAAAzAcAMI4EAQDWBgAhjwQBANYGACGVBEAA2wYAIa0EAADNB5kFIrwEQADbBgAh_AQBANkGACH-BAEA2AYAIf8EAQDZBgAhgQUAALAHgQUilgUBANkGACGXBQEA2QYAIZkFAQDYBgAhmgUBANkGACGbBUAA6gYAIQMAAAADACABAAD5AQAwVAAA-gEAIAMAAAADACABAAAEADACAAAFACAOiwQAAMkHADCMBAAAgAIAEI0EAADJBwAwjgQBAAAAAZUEQADBBwAh_AQBAMAHACGFBUAAwQcAIY4FAQDDBwAhjwVAAMIHACGRBQAAygeRBSKSBQEAwAcAIZMFAgDLBwAhlAUCAMsHACGVBQEAwwcAIQEAAAD9AQAgAQAAAP0BACAOiwQAAMkHADCMBAAAgAIAEI0EAADJBwAwjgQBAL8HACGVBEAAwQcAIfwEAQDABwAhhQVAAMEHACGOBQEAwwcAIY8FQADCBwAhkQUAAMoHkQUikgUBAMAHACGTBQIAywcAIZQFAgDLBwAhlQUBAMMHACEDjgUAALcIACCPBQAAtwgAIJUFAAC3CAAgAwAAAIACACABAACBAgAwAgAA_QEAIAMAAACAAgAgAQAAgQIAMAIAAP0BACADAAAAgAIAIAEAAIECADACAAD9AQAgC44EAQAAAAGVBEAAAAAB_AQBAAAAAYUFQAAAAAGOBQEAAAABjwVAAAAAAZEFAAAAkQUCkgUBAAAAAZMFAgAAAAGUBQIAAAABlQUBAAAAAQFIAACFAgAgC44EAQAAAAGVBEAAAAAB_AQBAAAAAYUFQAAAAAGOBQEAAAABjwVAAAAAAZEFAAAAkQUCkgUBAAAAAZMFAgAAAAGUBQIAAAABlQUBAAAAAQFIAACHAgAwAUgAAIcCADALjgQBALsIACGVBEAAvQgAIfwEAQC7CAAhhQVAAL0IACGOBQEAvAgAIY8FQADHCAAhkQUAAOYLkQUikgUBALsIACGTBQIA0QgAIZQFAgDRCAAhlQUBALwIACECAAAA_QEAIEgAAIoCACALjgQBALsIACGVBEAAvQgAIfwEAQC7CAAhhQVAAL0IACGOBQEAvAgAIY8FQADHCAAhkQUAAOYLkQUikgUBALsIACGTBQIA0QgAIZQFAgDRCAAhlQUBALwIACECAAAAgAIAIEgAAIwCACACAAAAgAIAIEgAAIwCACADAAAA_QEAIE8AAIUCACBQAACKAgAgAQAAAP0BACABAAAAgAIAIAgXAADhCwAgVQAA5AsAIFYAAOMLACB3AADiCwAgeAAA5QsAII4FAAC3CAAgjwUAALcIACCVBQAAtwgAIA6LBAAAxQcAMIwEAACTAgAQjQQAAMUHADCOBAEA1gYAIZUEQADbBgAh_AQBANgGACGFBUAA2wYAIY4FAQDZBgAhjwVAAOoGACGRBQAAxgeRBSKSBQEA2AYAIZMFAgDyBgAhlAUCAPIGACGVBQEA2QYAIQMAAACAAgAgAQAAkgIAMFQAAJMCACADAAAAgAIAIAEAAIECADACAAD9AQAgCosEAAC-BwAwjAQAAJkCABCNBAAAvgcAMI4EAQAAAAGUBAEAwwcAIZUEQADBBwAh_AQBAMAHACGFBUAAwQcAIY4FAQDDBwAhjwVAAMIHACEBAAAAlgIAIAEAAACWAgAgCosEAAC-BwAwjAQAAJkCABCNBAAAvgcAMI4EAQC_BwAhlAQBAMMHACGVBEAAwQcAIfwEAQDABwAhhQVAAMEHACGOBQEAwwcAIY8FQADCBwAhA5QEAAC3CAAgjgUAALcIACCPBQAAtwgAIAMAAACZAgAgAQAAmgIAMAIAAJYCACADAAAAmQIAIAEAAJoCADACAACWAgAgAwAAAJkCACABAACaAgAwAgAAlgIAIAeOBAEAAAABlAQBAAAAAZUEQAAAAAH8BAEAAAABhQVAAAAAAY4FAQAAAAGPBUAAAAABAUgAAJ4CACAHjgQBAAAAAZQEAQAAAAGVBEAAAAAB_AQBAAAAAYUFQAAAAAGOBQEAAAABjwVAAAAAAQFIAACgAgAwAUgAAKACADAHjgQBALsIACGUBAEAvAgAIZUEQAC9CAAh_AQBALsIACGFBUAAvQgAIY4FAQC8CAAhjwVAAMcIACECAAAAlgIAIEgAAKMCACAHjgQBALsIACGUBAEAvAgAIZUEQAC9CAAh_AQBALsIACGFBUAAvQgAIY4FAQC8CAAhjwVAAMcIACECAAAAmQIAIEgAAKUCACACAAAAmQIAIEgAAKUCACADAAAAlgIAIE8AAJ4CACBQAACjAgAgAQAAAJYCACABAAAAmQIAIAYXAADeCwAgVQAA4AsAIFYAAN8LACCUBAAAtwgAII4FAAC3CAAgjwUAALcIACAKiwQAAL0HADCMBAAArAIAEI0EAAC9BwAwjgQBANYGACGUBAEA2QYAIZUEQADbBgAh_AQBANgGACGFBUAA2wYAIY4FAQDZBgAhjwVAAOoGACEDAAAAmQIAIAEAAKsCADBUAACsAgAgAwAAAJkCACABAACaAgAwAgAAlgIAIAEAAAB1ACABAAAAdQAgAwAAAHMAIAEAAHQAMAIAAHUAIAMAAABzACABAAB0ADACAAB1ACADAAAAcwAgAQAAdAAwAgAAdQAgCAQAAN0LACCOBAEAAAABlAQBAAAAAZUEQAAAAAGnBAEAAAABhQVAAAAAAYcFQAAAAAGOBQEAAAABAUgAALQCACAHjgQBAAAAAZQEAQAAAAGVBEAAAAABpwQBAAAAAYUFQAAAAAGHBUAAAAABjgUBAAAAAQFIAAC2AgAwAUgAALYCADAIBAAA3AsAII4EAQC7CAAhlAQBALwIACGVBEAAvQgAIacEAQC7CAAhhQVAAL0IACGHBUAAxwgAIY4FAQC8CAAhAgAAAHUAIEgAALkCACAHjgQBALsIACGUBAEAvAgAIZUEQAC9CAAhpwQBALsIACGFBUAAvQgAIYcFQADHCAAhjgUBALwIACECAAAAcwAgSAAAuwIAIAIAAABzACBIAAC7AgAgAwAAAHUAIE8AALQCACBQAAC5AgAgAQAAAHUAIAEAAABzACAGFwAA2QsAIFUAANsLACBWAADaCwAglAQAALcIACCHBQAAtwgAII4FAAC3CAAgCosEAAC8BwAwjAQAAMICABCNBAAAvAcAMI4EAQDWBgAhlAQBANkGACGVBEAA2wYAIacEAQDWBgAhhQVAANsGACGHBUAA6gYAIY4FAQDZBgAhAwAAAHMAIAEAAMECADBUAADCAgAgAwAAAHMAIAEAAHQAMAIAAHUAIAEAAAA-ACABAAAAPgAgAwAAABMAIAEAAD0AMAIAAD4AIAMAAAATACABAAA9ADACAAA-ACADAAAAEwAgAQAAPQAwAgAAPgAgDQMAANQLACAGAADVCwAgBwAA1gsAIBgAANcLACAbAADYCwAgjgQBAAAAAY8EAQAAAAGVBEAAAAABswQBAAAAAbwEQAAAAAHpBAEAAAABjAUBAAAAAY0FAQAAAAEBSAAAygIAIAiOBAEAAAABjwQBAAAAAZUEQAAAAAGzBAEAAAABvARAAAAAAekEAQAAAAGMBQEAAAABjQUBAAAAAQFIAADMAgAwAUgAAMwCADABAAAAAwAgDQMAAKsLACAGAACsCwAgBwAArQsAIBgAAK4LACAbAACvCwAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhswQBALwIACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGNBQEAvAgAIQIAAAA-ACBIAADQAgAgCI4EAQC7CAAhjwQBALsIACGVBEAAvQgAIbMEAQC8CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhjQUBALwIACECAAAAEwAgSAAA0gIAIAIAAAATACBIAADSAgAgAQAAAAMAIAMAAAA-ACBPAADKAgAgUAAA0AIAIAEAAAA-ACABAAAAEwAgBRcAAKgLACBVAACqCwAgVgAAqQsAILMEAAC3CAAgjQUAALcIACALiwQAALsHADCMBAAA2gIAEI0EAAC7BwAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhswQBANkGACG8BEAA2wYAIekEAQDYBgAhjAUBANgGACGNBQEA1wYAIQMAAAATACABAADZAgAwVAAA2gIAIAMAAAATACABAAA9ADACAAA-ACABAAAACwAgAQAAAAsAIAMAAAAJACABAAAKADACAAALACADAAAACQAgAQAACgAwAgAACwAgAwAAAAkAIAEAAAoAMAIAAAsAIAsDAACkCwAgBAAApgsAIAgAAKULACAcAACnCwAgjgQBAAAAAY8EAQAAAAGnBAEAAAABsgRAAAAAAdsEAQAAAAGBBQAAAIwFAooFAQAAAAEBSAAA4gIAIAeOBAEAAAABjwQBAAAAAacEAQAAAAGyBEAAAAAB2wQBAAAAAYEFAAAAjAUCigUBAAAAAQFIAADkAgAwAUgAAOQCADABAAAAAwAgCwMAAKALACAEAACiCwAgCAAAoQsAIBwAAKMLACCOBAEAuwgAIY8EAQC7CAAhpwQBALsIACGyBEAAvQgAIdsEAQC7CAAhgQUAAJ8LjAUiigUBALwIACECAAAACwAgSAAA6AIAIAeOBAEAuwgAIY8EAQC7CAAhpwQBALsIACGyBEAAvQgAIdsEAQC7CAAhgQUAAJ8LjAUiigUBALwIACECAAAACQAgSAAA6gIAIAIAAAAJACBIAADqAgAgAQAAAAMAIAMAAAALACBPAADiAgAgUAAA6AIAIAEAAAALACABAAAACQAgBBcAAJwLACBVAACeCwAgVgAAnQsAIIoFAAC3CAAgCosEAAC3BwAwjAQAAPICABCNBAAAtwcAMI4EAQDWBgAhjwQBANYGACGnBAEA1gYAIbIEQADbBgAh2wQBANYGACGBBQAAuAeMBSKKBQEA1wYAIQMAAAAJACABAADxAgAwVAAA8gIAIAMAAAAJACABAAAKADACAAALACABAAAAmAEAIAEAAACYAQAgAwAAAJYBACABAACXAQAwAgAAmAEAIAMAAACWAQAgAQAAlwEAMAIAAJgBACADAAAAlgEAIAEAAJcBADACAACYAQAgBwMAAJsLACCOBAEAAAABjwQBAAAAAaoEAQAAAAHvBAEAAAABiAUCAAAAAYkFAgAAAAEBSAAA-gIAIAaOBAEAAAABjwQBAAAAAaoEAQAAAAHvBAEAAAABiAUCAAAAAYkFAgAAAAEBSAAA_AIAMAFIAAD8AgAwBwMAAJoLACCOBAEAuwgAIY8EAQC7CAAhqgQBALwIACHvBAEAvAgAIYgFAgDRCAAhiQUCANEIACECAAAAmAEAIEgAAP8CACAGjgQBALsIACGPBAEAuwgAIaoEAQC8CAAh7wQBALwIACGIBQIA0QgAIYkFAgDRCAAhAgAAAJYBACBIAACBAwAgAgAAAJYBACBIAACBAwAgAwAAAJgBACBPAAD6AgAgUAAA_wIAIAEAAACYAQAgAQAAAJYBACAHFwAAlQsAIFUAAJgLACBWAACXCwAgdwAAlgsAIHgAAJkLACCqBAAAtwgAIO8EAAC3CAAgCYsEAAC2BwAwjAQAAIgDABCNBAAAtgcAMI4EAQDWBgAhjwQBANYGACGqBAEA2QYAIe8EAQDZBgAhiAUCAPIGACGJBQIA8gYAIQMAAACWAQAgAQAAhwMAMFQAAIgDACADAAAAlgEAIAEAAJcBADACAACYAQAgAQAAADQAIAEAAAA0ACADAAAAMgAgAQAAMwAwAgAANAAgAwAAADIAIAEAADMAMAIAADQAIAMAAAAyACABAAAzADACAAA0ACATAwAAkQsAIAgAAJILACAZAACTCwAgGgAAlAsAII4EAQAAAAGPBAEAAAABlQRAAAAAAa0EAAAAgwUC2wQBAAAAAfwEAQAAAAH9BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFAoMFAQAAAAGEBQEAAAABhQVAAAAAAYYFQAAAAAGHBUAAAAABAUgAAJADACAPjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACDBQLbBAEAAAAB_AQBAAAAAf0EAQAAAAH-BAEAAAAB_wQBAAAAAYEFAAAAgQUCgwUBAAAAAYQFAQAAAAGFBUAAAAABhgVAAAAAAYcFQAAAAAEBSAAAkgMAMAFIAACSAwAwAQAAABMAIAEAAAADACATAwAAjQsAIAgAAI4LACAZAACPCwAgGgAAkAsAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAACMC4MFItsEAQC8CAAh_AQBALsIACH9BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKDBQEAuwgAIYQFAQC8CAAhhQVAAL0IACGGBUAAxwgAIYcFQADHCAAhAgAAADQAIEgAAJcDACAPjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAIwLgwUi2wQBALwIACH8BAEAuwgAIf0EAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIoMFAQC7CAAhhAUBALwIACGFBUAAvQgAIYYFQADHCAAhhwVAAMcIACECAAAAMgAgSAAAmQMAIAIAAAAyACBIAACZAwAgAQAAABMAIAEAAAADACADAAAANAAgTwAAkAMAIFAAAJcDACABAAAANAAgAQAAADIAIAkXAACICwAgVQAAigsAIFYAAIkLACDbBAAAtwgAIP0EAAC3CAAg_wQAALcIACCEBQAAtwgAIIYFAAC3CAAghwUAALcIACASiwQAAK8HADCMBAAAogMAEI0EAACvBwAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhrQQAALEHgwUi2wQBANcGACH8BAEA2AYAIf0EAQDZBgAh_gQBANgGACH_BAEA2QYAIYEFAACwB4EFIoMFAQDWBgAhhAUBANcGACGFBUAA2wYAIYYFQADqBgAhhwVAAOoGACEDAAAAMgAgAQAAoQMAMFQAAKIDACADAAAAMgAgAQAAMwAwAgAANAAgAQAAAJsBACABAAAAmwEAIAMAAAAHACABAACaAQAwAgAAmwEAIAMAAAAHACABAACaAQAwAgAAmwEAIAMAAAAHACABAACaAQAwAgAAmwEAIAwDAACGCwAgBAAAhwsAII4EAQAAAAGPBAEAAAABpwQBAAAAAbwEQAAAAAH2BAIAAAAB9wQCAAAAAfgEAQAAAAH5BAIAAAAB-gQCAAAAAfsEQAAAAAEBSAAAqgMAIAqOBAEAAAABjwQBAAAAAacEAQAAAAG8BEAAAAAB9gQCAAAAAfcEAgAAAAH4BAEAAAAB-QQCAAAAAfoEAgAAAAH7BEAAAAABAUgAAKwDADABSAAArAMAMAwDAACECwAgBAAAhQsAII4EAQC7CAAhjwQBALsIACGnBAEAuwgAIbwEQAC9CAAh9gQCANEIACH3BAIA0QgAIfgEAQC8CAAh-QQCANEIACH6BAIA0QgAIfsEQADHCAAhAgAAAJsBACBIAACvAwAgCo4EAQC7CAAhjwQBALsIACGnBAEAuwgAIbwEQAC9CAAh9gQCANEIACH3BAIA0QgAIfgEAQC8CAAh-QQCANEIACH6BAIA0QgAIfsEQADHCAAhAgAAAAcAIEgAALEDACACAAAABwAgSAAAsQMAIAMAAACbAQAgTwAAqgMAIFAAAK8DACABAAAAmwEAIAEAAAAHACAHFwAA_woAIFUAAIILACBWAACBCwAgdwAAgAsAIHgAAIMLACD4BAAAtwgAIPsEAAC3CAAgDYsEAACuBwAwjAQAALgDABCNBAAArgcAMI4EAQDWBgAhjwQBANYGACGnBAEA1gYAIbwEQADbBgAh9gQCAPIGACH3BAIA8gYAIfgEAQDXBgAh-QQCAPIGACH6BAIA8gYAIfsEQADqBgAhAwAAAAcAIAEAALcDADBUAAC4AwAgAwAAAAcAIAEAAJoBADACAACbAQAgAQAAAFsAIAEAAABbACADAAAAWQAgAQAAWgAwAgAAWwAgAwAAAFkAIAEAAFoAMAIAAFsAIAMAAABZACABAABaADACAABbACALAwAA_QoAIAQAAP4KACCOBAEAAAABjwQBAAAAAZUEQAAAAAGnBAEAAAAB8AQCAAAAAfIEAAAA8gQC8wQBAAAAAfQEAQAAAAH1BAEAAAABAUgAAMADACAJjgQBAAAAAY8EAQAAAAGVBEAAAAABpwQBAAAAAfAEAgAAAAHyBAAAAPIEAvMEAQAAAAH0BAEAAAAB9QQBAAAAAQFIAADCAwAwAUgAAMIDADALAwAA-woAIAQAAPwKACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGnBAEAuwgAIfAEAgDRCAAh8gQAAPEK8gQi8wQBALwIACH0BAEAvAgAIfUEAQC8CAAhAgAAAFsAIEgAAMUDACAJjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhpwQBALsIACHwBAIA0QgAIfIEAADxCvIEIvMEAQC8CAAh9AQBALwIACH1BAEAvAgAIQIAAABZACBIAADHAwAgAgAAAFkAIEgAAMcDACADAAAAWwAgTwAAwAMAIFAAAMUDACABAAAAWwAgAQAAAFkAIAgXAAD2CgAgVQAA-QoAIFYAAPgKACB3AAD3CgAgeAAA-goAIPMEAAC3CAAg9AQAALcIACD1BAAAtwgAIAyLBAAArQcAMIwEAADOAwAQjQQAAK0HADCOBAEA1gYAIY8EAQDWBgAhlQRAANsGACGnBAEA1gYAIfAEAgDyBgAh8gQAAKoH8gQi8wQBANkGACH0BAEA2QYAIfUEAQDXBgAhAwAAAFkAIAEAAM0DADBUAADOAwAgAwAAAFkAIAEAAFoAMAIAAFsAIAEAAABfACABAAAAXwAgAwAAAF0AIAEAAF4AMAIAAF8AIAMAAABdACABAABeADACAABfACADAAAAXQAgAQAAXgAwAgAAXwAgCwMAAPQKACAEAAD1CgAgjgQBAAAAAY8EAQAAAAGVBEAAAAABpwQBAAAAAfAEAgAAAAHyBAAAAPIEAvMEAQAAAAH0BAEAAAAB9QQBAAAAAQFIAADWAwAgCY4EAQAAAAGPBAEAAAABlQRAAAAAAacEAQAAAAHwBAIAAAAB8gQAAADyBALzBAEAAAAB9AQBAAAAAfUEAQAAAAEBSAAA2AMAMAFIAADYAwAwCwMAAPIKACAEAADzCgAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhpwQBALsIACHwBAIA0QgAIfIEAADxCvIEIvMEAQC8CAAh9AQBALwIACH1BAEAvAgAIQIAAABfACBIAADbAwAgCY4EAQC7CAAhjwQBALsIACGVBEAAvQgAIacEAQC7CAAh8AQCANEIACHyBAAA8QryBCLzBAEAvAgAIfQEAQC8CAAh9QQBALwIACECAAAAXQAgSAAA3QMAIAIAAABdACBIAADdAwAgAwAAAF8AIE8AANYDACBQAADbAwAgAQAAAF8AIAEAAABdACAIFwAA7AoAIFUAAO8KACBWAADuCgAgdwAA7QoAIHgAAPAKACDzBAAAtwgAIPQEAAC3CAAg9QQAALcIACAMiwQAAKkHADCMBAAA5AMAEI0EAACpBwAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhpwQBANYGACHwBAIA8gYAIfIEAACqB_IEIvMEAQDZBgAh9AQBANkGACH1BAEA1wYAIQMAAABdACABAADjAwAwVAAA5AMAIAMAAABdACABAABeADACAABfACABAAAApQEAIAEAAAClAQAgAwAAAE8AIAEAAKQBADACAAClAQAgAwAAAE8AIAEAAKQBADACAAClAQAgAwAAAE8AIAEAAKQBADACAAClAQAgEAMAAOkKACAlAADqCgAgKQAA6woAII4EAQAAAAGPBAEAAAABlQRAAAAAAakEAAAA7gQCqgQBAAAAAa0EAAAAyAQCswQBAAAAAbYEAgAAAAG3BAIAAAABvARAAAAAAewEAQAAAAHuBIAAAAAB7wQBAAAAAQFIAADsAwAgDY4EAQAAAAGPBAEAAAABlQRAAAAAAakEAAAA7gQCqgQBAAAAAa0EAAAAyAQCswQBAAAAAbYEAgAAAAG3BAIAAAABvARAAAAAAewEAQAAAAHuBIAAAAAB7wQBAAAAAQFIAADuAwAwAUgAAO4DADAQAwAAzgoAICUAAM8KACApAADQCgAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqQQAAM0K7gQiqgQBALsIACGtBAAAggnIBCKzBAEAvAgAIbYEAgDRCAAhtwQCANEIACG8BEAAvQgAIewEAQC7CAAh7gSAAAAAAe8EAQC8CAAhAgAAAKUBACBIAADxAwAgDY4EAQC7CAAhjwQBALsIACGVBEAAvQgAIakEAADNCu4EIqoEAQC7CAAhrQQAAIIJyAQiswQBALwIACG2BAIA0QgAIbcEAgDRCAAhvARAAL0IACHsBAEAuwgAIe4EgAAAAAHvBAEAvAgAIQIAAABPACBIAADzAwAgAgAAAE8AIEgAAPMDACADAAAApQEAIE8AAOwDACBQAADxAwAgAQAAAKUBACABAAAATwAgBxcAAMgKACBVAADLCgAgVgAAygoAIHcAAMkKACB4AADMCgAgswQAALcIACDvBAAAtwgAIBCLBAAApQcAMIwEAAD6AwAQjQQAAKUHADCOBAEA1gYAIY8EAQDWBgAhlQRAANsGACGpBAAApgfuBCKqBAEA2AYAIa0EAACDB8gEIrMEAQDZBgAhtgQCAPIGACG3BAIA8gYAIbwEQADbBgAh7AQBANgGACHuBAAA2gYAIO8EAQDZBgAhAwAAAE8AIAEAAPkDADBUAAD6AwAgAwAAAE8AIAEAAKQBADACAAClAQAgAQAAAEgAIAEAAABIACADAAAARgAgAQAARwAwAgAASAAgAwAAAEYAIAEAAEcAMAIAAEgAIAMAAABGACABAABHADACAABIACAJAwAAxQoAIAQAAMYKACAFgAAAAAEmAADHCgAgjgQBAAAAAY8EAQAAAAGnBAEAAAAB6gQBAAAAAesEQAAAAAEBSAAAggQAIAYFgAAAAAGOBAEAAAABjwQBAAAAAacEAQAAAAHqBAEAAAAB6wRAAAAAAQFIAACEBAAwAUgAAIQEADAJAwAAwgoAIAQAAMMKACAFgAAAAAEmAADECgAgjgQBALsIACGPBAEAuwgAIacEAQC7CAAh6gQBALsIACHrBEAAvQgAIQIAAABIACBIAACHBAAgBgWAAAAAAY4EAQC7CAAhjwQBALsIACGnBAEAuwgAIeoEAQC7CAAh6wRAAL0IACECAAAARgAgSAAAiQQAIAIAAABGACBIAACJBAAgAwAAAEgAIE8AAIIEACBQAACHBAAgAQAAAEgAIAEAAABGACADFwAAvwoAIFUAAMEKACBWAADACgAgCQUAANoGACCLBAAApAcAMIwEAACQBAAQjQQAAKQHADCOBAEA1gYAIY8EAQDWBgAhpwQBANYGACHqBAEA1gYAIesEQADbBgAhAwAAAEYAIAEAAI8EADBUAACQBAAgAwAAAEYAIAEAAEcAMAIAAEgAIAEAAABNACABAAAATQAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACADAAAASwAgAQAATAAwAgAATQAgCgMAALwKACAmAAC9CgAgKAAAvgoAII4EAQAAAAGPBAEAAAABlQRAAAAAAbMEAQAAAAHGBAEAAAAB6QQBAAAAAeoEAQAAAAEBSAAAmAQAIAeOBAEAAAABjwQBAAAAAZUEQAAAAAGzBAEAAAABxgQBAAAAAekEAQAAAAHqBAEAAAABAUgAAJoEADABSAAAmgQAMAEAAABPACAKAwAArQoAICYAAK4KACAoAACvCgAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhswQBALwIACHGBAEAvAgAIekEAQC7CAAh6gQBALwIACECAAAATQAgSAAAngQAIAeOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGzBAEAvAgAIcYEAQC8CAAh6QQBALsIACHqBAEAvAgAIQIAAABLACBIAACgBAAgAgAAAEsAIEgAAKAEACABAAAATwAgAwAAAE0AIE8AAJgEACBQAACeBAAgAQAAAE0AIAEAAABLACAGFwAAqgoAIFUAAKwKACBWAACrCgAgswQAALcIACDGBAAAtwgAIOoEAAC3CAAgCosEAACjBwAwjAQAAKgEABCNBAAAowcAMI4EAQDWBgAhjwQBANYGACGVBEAA2wYAIbMEAQDZBgAhxgQBANkGACHpBAEA2AYAIeoEAQDXBgAhAwAAAEsAIAEAAKcEADBUAACoBAAgAwAAAEsAIAEAAEwAMAIAAE0AIAEAAABTACABAAAAUwAgAwAAAFEAIAEAAFIAMAIAAFMAIAMAAABRACABAABSADACAABTACADAAAAUQAgAQAAUgAwAgAAUwAgCAMAAKcKACAEAACoCgAgJwAAqQoAII4EAQAAAAGPBAEAAAABpwQBAAAAAbsEAQAAAAHoBEAAAAABAUgAALAEACAFjgQBAAAAAY8EAQAAAAGnBAEAAAABuwQBAAAAAegEQAAAAAEBSAAAsgQAMAFIAACyBAAwCAMAAKQKACAEAAClCgAgJwAApgoAII4EAQC7CAAhjwQBALsIACGnBAEAuwgAIbsEAQC7CAAh6ARAAL0IACECAAAAUwAgSAAAtQQAIAWOBAEAuwgAIY8EAQC7CAAhpwQBALsIACG7BAEAuwgAIegEQAC9CAAhAgAAAFEAIEgAALcEACACAAAAUQAgSAAAtwQAIAMAAABTACBPAACwBAAgUAAAtQQAIAEAAABTACABAAAAUQAgAxcAAKEKACBVAACjCgAgVgAAogoAIAiLBAAAogcAMIwEAAC-BAAQjQQAAKIHADCOBAEA1gYAIY8EAQDWBgAhpwQBANYGACG7BAEA1gYAIegEQADbBgAhAwAAAFEAIAEAAL0EADBUAAC-BAAgAwAAAFEAIAEAAFIAMAIAAFMAIAEAAAAqACABAAAAKgAgAwAAACgAIAEAACkAMAIAACoAIAMAAAAoACABAAApADACAAAqACADAAAAKAAgAQAAKQAwAgAAKgAgDQMAAN4JACALAACgCgAgFAAA3wkAIBUAAOAJACCOBAEAAAABjwQBAAAAAZUEQAAAAAGpBAAAAOcEAsgEAQAAAAHOBAIAAAAB5AQBAAAAAeUEAQAAAAHnBAEAAAABAUgAAMYEACAJjgQBAAAAAY8EAQAAAAGVBEAAAAABqQQAAADnBALIBAEAAAABzgQCAAAAAeQEAQAAAAHlBAEAAAAB5wQBAAAAAQFIAADIBAAwAUgAAMgEADABAAAADwAgDQMAANoJACALAACfCgAgFAAA2wkAIBUAANwJACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGpBAAA2AnnBCLIBAEAvAgAIc4EAgDRCAAh5AQBALsIACHlBAEAuwgAIecEAQC7CAAhAgAAACoAIEgAAMwEACAJjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqQQAANgJ5wQiyAQBALwIACHOBAIA0QgAIeQEAQC7CAAh5QQBALsIACHnBAEAuwgAIQIAAAAoACBIAADOBAAgAgAAACgAIEgAAM4EACABAAAADwAgAwAAACoAIE8AAMYEACBQAADMBAAgAQAAACoAIAEAAAAoACAGFwAAmgoAIFUAAJ0KACBWAACcCgAgdwAAmwoAIHgAAJ4KACDIBAAAtwgAIAyLBAAAngcAMIwEAADWBAAQjQQAAJ4HADCOBAEA1gYAIY8EAQDWBgAhlQRAANsGACGpBAAAnwfnBCLIBAEA1wYAIc4EAgDyBgAh5AQBANYGACHlBAEA1gYAIecEAQDYBgAhAwAAACgAIAEAANUEADBUAADWBAAgAwAAACgAIAEAACkAMAIAACoAIAEAAAARACABAAAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAMAAAAPACABAAAQADACAAARACADAAAADwAgAQAAEAAwAgAAEQAgHgMAAJEKACAFAgAAAAEIAACSCgAgCQAAkwoAIAoAAJQKACANAACVCgAgDwAAlgoAIBEAAJcKACATAACYCgAgFgAAmQoAII4EAQAAAAGPBAEAAAABlQRAAAAAAaoEAQAAAAGtBAAAANEEArEEQAAAAAGzBAEAAAABtgQCAAAAAbcEAgAAAAG8BEAAAAAB2gQAAADaBALbBAEAAAAB3AQBAAAAAd0EAQAAAAHeBBAAAAAB3wRAAAAAAeAEQAAAAAHhBEAAAAAB4gRAAAAAAeMEAgAAAAEBSAAA3gQAIBUFAgAAAAGOBAEAAAABjwQBAAAAAZUEQAAAAAGqBAEAAAABrQQAAADRBAKxBEAAAAABswQBAAAAAbYEAgAAAAG3BAIAAAABvARAAAAAAdoEAAAA2gQC2wQBAAAAAdwEAQAAAAHdBAEAAAAB3gQQAAAAAd8EQAAAAAHgBEAAAAAB4QRAAAAAAeIEQAAAAAHjBAIAAAABAUgAAOAEADABSAAA4AQAMAEAAAATACABAAAAAwAgAQAAAAMAIB4DAADFCQAgBQIA0QgAIQgAAMYJACAJAADHCQAgCgAAyAkAIA0AAMkJACAPAADKCQAgEQAAywkAIBMAAMwJACAWAADNCQAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqgQBALsIACGtBAAAwgnRBCKxBEAAxwgAIbMEAQC8CAAhtgQCANEIACG3BAIA0QgAIbwEQAC9CAAh2gQAAMMJ2gQi2wQBALwIACHcBAEAvAgAId0EAQC8CAAh3gQQAMQJACHfBEAAxwgAIeAEQADHCAAh4QRAAMcIACHiBEAAxwgAIeMEAgDRCAAhAgAAABEAIEgAAOYEACAVBQIA0QgAIY4EAQC7CAAhjwQBALsIACGVBEAAvQgAIaoEAQC7CAAhrQQAAMIJ0QQisQRAAMcIACGzBAEAvAgAIbYEAgDRCAAhtwQCANEIACG8BEAAvQgAIdoEAADDCdoEItsEAQC8CAAh3AQBALwIACHdBAEAvAgAId4EEADECQAh3wRAAMcIACHgBEAAxwgAIeEEQADHCAAh4gRAAMcIACHjBAIA0QgAIQIAAAAPACBIAADoBAAgAgAAAA8AIEgAAOgEACABAAAAEwAgAQAAAAMAIAEAAAADACADAAAAEQAgTwAA3gQAIFAAAOYEACABAAAAEQAgAQAAAA8AIA8XAAC9CQAgVQAAwAkAIFYAAL8JACB3AAC-CQAgeAAAwQkAILEEAAC3CAAgswQAALcIACDbBAAAtwgAINwEAAC3CAAg3QQAALcIACDeBAAAtwgAIN8EAAC3CAAg4AQAALcIACDhBAAAtwgAIOIEAAC3CAAgGAUCAPIGACGLBAAAlAcAMIwEAADyBAAQjQQAAJQHADCOBAEA1gYAIY8EAQDWBgAhlQRAANsGACGqBAEA2AYAIa0EAACVB9EEIrEEQADqBgAhswQBANkGACG2BAIA8gYAIbcEAgDyBgAhvARAANsGACHaBAAAlgfaBCLbBAEA1wYAIdwEAQDXBgAh3QQBANcGACHeBBAAlwcAId8EQADqBgAh4ARAAOoGACHhBEAA6gYAIeIEQADqBgAh4wQCAPIGACEDAAAADwAgAQAA8QQAMFQAAPIEACADAAAADwAgAQAAEAAwAgAAEQAgAQAAAB0AIAEAAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgAwAAABsAIAEAABwAMAIAAB0AIAMAAAAbACABAAAcADACAAAdACAKAwAAugkAIAsAALsJACAOAAC8CQAgjgQBAAAAAY8EAQAAAAGVBEAAAAABqwQBAAAAAbwEQAAAAAHIBAEAAAAB2AQBAAAAAQFIAAD6BAAgB44EAQAAAAGPBAEAAAABlQRAAAAAAasEAQAAAAG8BEAAAAAByAQBAAAAAdgEAQAAAAEBSAAA_AQAMAFIAAD8BAAwCgMAALcJACALAAC4CQAgDgAAuQkAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIasEAQC7CAAhvARAAL0IACHIBAEAuwgAIdgEAQC7CAAhAgAAAB0AIEgAAP8EACAHjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqwQBALsIACG8BEAAvQgAIcgEAQC7CAAh2AQBALsIACECAAAAGwAgSAAAgQUAIAIAAAAbACBIAACBBQAgAwAAAB0AIE8AAPoEACBQAAD_BAAgAQAAAB0AIAEAAAAbACADFwAAtAkAIFUAALYJACBWAAC1CQAgCosEAACTBwAwjAQAAIgFABCNBAAAkwcAMI4EAQDWBgAhjwQBANYGACGVBEAA2wYAIasEAQDYBgAhvARAANsGACHIBAEA1gYAIdgEAQDWBgAhAwAAABsAIAEAAIcFADBUAACIBQAgAwAAABsAIAEAABwAMAIAAB0AIAEAAAAhACABAAAAIQAgAwAAAB8AIAEAACAAMAIAACEAIAMAAAAfACABAAAgADACAAAhACADAAAAHwAgAQAAIAAwAgAAIQAgDAMAALEJACALAACyCQAgEAAAswkAII4EAQAAAAGPBAEAAAABlQRAAAAAAcgEAQAAAAHTBAEAAAAB1AQBAAAAAdUEAQAAAAHWBAEAAAAB1wQCAAAAAQFIAACQBQAgCY4EAQAAAAGPBAEAAAABlQRAAAAAAcgEAQAAAAHTBAEAAAAB1AQBAAAAAdUEAQAAAAHWBAEAAAAB1wQCAAAAAQFIAACSBQAwAUgAAJIFADAMAwAArgkAIAsAAK8JACAQAACwCQAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhyAQBALsIACHTBAEAuwgAIdQEAQC7CAAh1QQBALsIACHWBAEAvAgAIdcEAgCBCQAhAgAAACEAIEgAAJUFACAJjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhyAQBALsIACHTBAEAuwgAIdQEAQC7CAAh1QQBALsIACHWBAEAvAgAIdcEAgCBCQAhAgAAAB8AIEgAAJcFACACAAAAHwAgSAAAlwUAIAMAAAAhACBPAACQBQAgUAAAlQUAIAEAAAAhACABAAAAHwAgBxcAAKkJACBVAACsCQAgVgAAqwkAIHcAAKoJACB4AACtCQAg1gQAALcIACDXBAAAtwgAIAyLBAAAkgcAMIwEAACeBQAQjQQAAJIHADCOBAEA1gYAIY8EAQDWBgAhlQRAANsGACHIBAEA1gYAIdMEAQDWBgAh1AQBANgGACHVBAEA2AYAIdYEAQDZBgAh1wQCAIIHACEDAAAAHwAgAQAAnQUAMFQAAJ4FACADAAAAHwAgAQAAIAAwAgAAIQAgAQAAACUAIAEAAAAlACADAAAAIwAgAQAAJAAwAgAAJQAgAwAAACMAIAEAACQAMAIAACUAIAMAAAAjACABAAAkADACAAAlACAMAwAApgkAIAsAAKcJACASAACoCQAgjgQBAAAAAY8EAQAAAAGQBAEAAAABkQQBAAAAAZUEQAAAAAHABAEAAAAByAQBAAAAAdEEAAAA0QQD0gQAAADRBAMBSAAApgUAIAmOBAEAAAABjwQBAAAAAZAEAQAAAAGRBAEAAAABlQRAAAAAAcAEAQAAAAHIBAEAAAAB0QQAAADRBAPSBAAAANEEAwFIAACoBQAwAUgAAKgFADABAAAAAwAgDAMAAKMJACALAACkCQAgEgAApQkAII4EAQC7CAAhjwQBALsIACGQBAEAvAgAIZEEAQC7CAAhlQRAAL0IACHABAEAvAgAIcgEAQC7CAAh0QQAAKIJ0QQj0gQAAKIJ0QQjAgAAACUAIEgAAKwFACAJjgQBALsIACGPBAEAuwgAIZAEAQC8CAAhkQQBALsIACGVBEAAvQgAIcAEAQC8CAAhyAQBALsIACHRBAAAognRBCPSBAAAognRBCMCAAAAIwAgSAAArgUAIAIAAAAjACBIAACuBQAgAQAAAAMAIAMAAAAlACBPAACmBQAgUAAArAUAIAEAAAAlACABAAAAIwAgBxcAAJ8JACBVAAChCQAgVgAAoAkAIJAEAAC3CAAgwAQAALcIACDRBAAAtwgAINIEAAC3CAAgDIsEAACOBwAwjAQAALYFABCNBAAAjgcAMI4EAQDWBgAhjwQBANYGACGQBAEA1wYAIZEEAQDYBgAhlQRAANsGACHABAEA2QYAIcgEAQDWBgAh0QQAAI8H0QQj0gQAAI8H0QQjAwAAACMAIAEAALUFADBUAAC2BQAgAwAAACMAIAEAACQAMAIAACUAIAEAAAAZACABAAAAGQAgAwAAABcAIAEAABgAMAIAABkAIAMAAAAXACABAAAYADACAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgDQMAAJwJACALAACdCQAgDAAAngkAII4EAQAAAAGPBAEAAAABlQRAAAAAAcgEAQAAAAHJBAEAAAABywQAAADLBALMBAIAAAABzQQBAAAAAc4EAgAAAAHPBAIAAAABAUgAAL4FACAKjgQBAAAAAY8EAQAAAAGVBEAAAAAByAQBAAAAAckEAQAAAAHLBAAAAMsEAswEAgAAAAHNBAEAAAABzgQCAAAAAc8EAgAAAAEBSAAAwAUAMAFIAADABQAwDQMAAJkJACALAACaCQAgDAAAmwkAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIcgEAQC7CAAhyQQBALsIACHLBAAAmAnLBCLMBAIAgQkAIc0EAQC8CAAhzgQCANEIACHPBAIA0QgAIQIAAAAZACBIAADDBQAgCo4EAQC7CAAhjwQBALsIACGVBEAAvQgAIcgEAQC7CAAhyQQBALsIACHLBAAAmAnLBCLMBAIAgQkAIc0EAQC8CAAhzgQCANEIACHPBAIA0QgAIQIAAAAXACBIAADFBQAgAgAAABcAIEgAAMUFACADAAAAGQAgTwAAvgUAIFAAAMMFACABAAAAGQAgAQAAABcAIAcXAACTCQAgVQAAlgkAIFYAAJUJACB3AACUCQAgeAAAlwkAIMwEAAC3CAAgzQQAALcIACANiwQAAIoHADCMBAAAzAUAEI0EAACKBwAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhyAQBANYGACHJBAEA1gYAIcsEAACLB8sEIswEAgCCBwAhzQQBANkGACHOBAIA8gYAIc8EAgDyBgAhAwAAABcAIAEAAMsFADBUAADMBQAgAwAAABcAIAEAABgAMAIAABkAIAEAAACtAQAgAQAAAK0BACADAAAAqwEAIAEAAKwBADACAACtAQAgAwAAAKsBACABAACsAQAwAgAArQEAIAMAAACrAQAgAQAArAEAMAIAAK0BACANAwAAkQkAIC8AAJIJACCOBAEAAAABjwQBAAAAAZUEQAAAAAGpBAAAAMUEAqoEAQAAAAGtBAAAAMgEArMEAQAAAAG8BEAAAAABvwQCAAAAAcUEAgAAAAHGBAEAAAABAUgAANQFACALjgQBAAAAAY8EAQAAAAGVBEAAAAABqQQAAADFBAKqBAEAAAABrQQAAADIBAKzBAEAAAABvARAAAAAAb8EAgAAAAHFBAIAAAABxgQBAAAAAQFIAADWBQAwAUgAANYFADANAwAAgwkAIC8AAIQJACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGpBAAAgAnFBCKqBAEAuwgAIa0EAACCCcgEIrMEAQC8CAAhvARAAL0IACG_BAIA0QgAIcUEAgCBCQAhxgQBALwIACECAAAArQEAIEgAANkFACALjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqQQAAIAJxQQiqgQBALsIACGtBAAAggnIBCKzBAEAvAgAIbwEQAC9CAAhvwQCANEIACHFBAIAgQkAIcYEAQC8CAAhAgAAAKsBACBIAADbBQAgAgAAAKsBACBIAADbBQAgAwAAAK0BACBPAADUBQAgUAAA2QUAIAEAAACtAQAgAQAAAKsBACAIFwAA-wgAIFUAAP4IACBWAAD9CAAgdwAA_AgAIHgAAP8IACCzBAAAtwgAIMUEAAC3CAAgxgQAALcIACAOiwQAAIAHADCMBAAA4gUAEI0EAACABwAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhqQQAAIEHxQQiqgQBANgGACGtBAAAgwfIBCKzBAEA2QYAIbwEQADbBgAhvwQCAPIGACHFBAIAggcAIcYEAQDZBgAhAwAAAKsBACABAADhBQAwVAAA4gUAIAMAAACrAQAgAQAArAEAMAIAAK0BACABAAAAZQAgAQAAAGUAIAMAAABjACABAABkADACAABlACADAAAAYwAgAQAAZAAwAgAAZQAgAwAAAGMAIAEAAGQAMAIAAGUAIA0DAAD4CAAgBAAA-ggAIDAAAPkIACCOBAEAAAABjwQBAAAAAacEAQAAAAGtBAAAAL8EAr0EAQAAAAG_BAIAAAABwAQBAAAAAcEEAQAAAAHCBEAAAAABwwRAAAAAAQFIAADqBQAgCo4EAQAAAAGPBAEAAAABpwQBAAAAAa0EAAAAvwQCvQQBAAAAAb8EAgAAAAHABAEAAAABwQQBAAAAAcIEQAAAAAHDBEAAAAABAUgAAOwFADABSAAA7AUAMA0DAAD1CAAgBAAA9wgAIDAAAPYIACCOBAEAuwgAIY8EAQC7CAAhpwQBALsIACGtBAAA9Ai_BCK9BAEAuwgAIb8EAgDRCAAhwAQBALwIACHBBAEAvAgAIcIEQADHCAAhwwRAAL0IACECAAAAZQAgSAAA7wUAIAqOBAEAuwgAIY8EAQC7CAAhpwQBALsIACGtBAAA9Ai_BCK9BAEAuwgAIb8EAgDRCAAhwAQBALwIACHBBAEAvAgAIcIEQADHCAAhwwRAAL0IACECAAAAYwAgSAAA8QUAIAIAAABjACBIAADxBQAgAwAAAGUAIE8AAOoFACBQAADvBQAgAQAAAGUAIAEAAABjACAIFwAA7wgAIFUAAPIIACBWAADxCAAgdwAA8AgAIHgAAPMIACDABAAAtwgAIMEEAAC3CAAgwgQAALcIACANiwQAAPwGADCMBAAA-AUAEI0EAAD8BgAwjgQBANYGACGPBAEA1gYAIacEAQDWBgAhrQQAAP0GvwQivQQBANYGACG_BAIA8gYAIcAEAQDZBgAhwQQBANkGACHCBEAA6gYAIcMEQADbBgAhAwAAAGMAIAEAAPcFADBUAAD4BQAgAwAAAGMAIAEAAGQAMAIAAGUAIAEAAACyAQAgAQAAALIBACADAAAAsAEAIAEAALEBADACAACyAQAgAwAAALABACABAACxAQAwAgAAsgEAIAMAAACwAQAgAQAAsQEAMAIAALIBACAQAwAA7QgAIDEAAO4IACCOBAEAAAABjwQBAAAAAZUEQAAAAAGqBAEAAAABrQQAAAC7BAKzBAEAAAABtAQBAAAAAbUEAgAAAAG2BAIAAAABtwQCAAAAAbgEQAAAAAG5BEAAAAABuwQBAAAAAbwEQAAAAAEBSAAAgAYAIA6OBAEAAAABjwQBAAAAAZUEQAAAAAGqBAEAAAABrQQAAAC7BAKzBAEAAAABtAQBAAAAAbUEAgAAAAG2BAIAAAABtwQCAAAAAbgEQAAAAAG5BEAAAAABuwQBAAAAAbwEQAAAAAEBSAAAggYAMAFIAACCBgAwEAMAAN8IACAxAADgCAAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqgQBALsIACGtBAAA3gi7BCKzBAEAvAgAIbQEAQC7CAAhtQQCANEIACG2BAIA0QgAIbcEAgDRCAAhuARAAL0IACG5BEAAvQgAIbsEAQC8CAAhvARAAL0IACECAAAAsgEAIEgAAIUGACAOjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqgQBALsIACGtBAAA3gi7BCKzBAEAvAgAIbQEAQC7CAAhtQQCANEIACG2BAIA0QgAIbcEAgDRCAAhuARAAL0IACG5BEAAvQgAIbsEAQC8CAAhvARAAL0IACECAAAAsAEAIEgAAIcGACACAAAAsAEAIEgAAIcGACADAAAAsgEAIE8AAIAGACBQAACFBgAgAQAAALIBACABAAAAsAEAIAcXAADZCAAgVQAA3AgAIFYAANsIACB3AADaCAAgeAAA3QgAILMEAAC3CAAguwQAALcIACARiwQAAPgGADCMBAAAjgYAEI0EAAD4BgAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhqgQBANgGACGtBAAA-Qa7BCKzBAEA2QYAIbQEAQDYBgAhtQQCAPIGACG2BAIA8gYAIbcEAgDyBgAhuARAANsGACG5BEAA2wYAIbsEAQDXBgAhvARAANsGACEDAAAAsAEAIAEAAI0GADBUAACOBgAgAwAAALABACABAACxAQAwAgAAsgEAIAEAAABrACABAAAAawAgAwAAAGkAIAEAAGoAMAIAAGsAIAMAAABpACABAABqADACAABrACADAAAAaQAgAQAAagAwAgAAawAgCwMAANYIACAEAADYCAAgBQIAAAABMgAA1wgAII4EAQAAAAGPBAEAAAABpwQBAAAAAa0EAAAAsQQCrwQBAAAAAbEEQAAAAAGyBEAAAAABAUgAAJYGACAIBQIAAAABjgQBAAAAAY8EAQAAAAGnBAEAAAABrQQAAACxBAKvBAEAAAABsQRAAAAAAbIEQAAAAAEBSAAAmAYAMAFIAACYBgAwCwMAANMIACAEAADVCAAgBQIA0QgAITIAANQIACCOBAEAuwgAIY8EAQC7CAAhpwQBALsIACGtBAAA0gixBCKvBAEAuwgAIbEEQADHCAAhsgRAAL0IACECAAAAawAgSAAAmwYAIAgFAgDRCAAhjgQBALsIACGPBAEAuwgAIacEAQC7CAAhrQQAANIIsQQirwQBALsIACGxBEAAxwgAIbIEQAC9CAAhAgAAAGkAIEgAAJ0GACACAAAAaQAgSAAAnQYAIAMAAABrACBPAACWBgAgUAAAmwYAIAEAAABrACABAAAAaQAgBhcAAMwIACBVAADPCAAgVgAAzggAIHcAAM0IACB4AADQCAAgsQQAALcIACALBQIA8gYAIYsEAADxBgAwjAQAAKQGABCNBAAA8QYAMI4EAQDWBgAhjwQBANYGACGnBAEA1gYAIa0EAADzBrEEIq8EAQDWBgAhsQRAAOoGACGyBEAA2wYAIQMAAABpACABAACjBgAwVAAApAYAIAMAAABpACABAABqADACAABrACABAAAAcQAgAQAAAHEAIAMAAABvACABAABwADACAABxACADAAAAbwAgAQAAcAAwAgAAcQAgAwAAAG8AIAEAAHAAMAIAAHEAIAwDAADKCAAgBAAAywgAIEiAAAAAAY4EAQAAAAGPBAEAAAABlQRAAAAAAacEAQAAAAGpBAAAAKkEAqoEAQAAAAGrBAEAAAABrQQAAACtBAKuBEAAAAABAUgAAKwGACAKSIAAAAABjgQBAAAAAY8EAQAAAAGVBEAAAAABpwQBAAAAAakEAAAAqQQCqgQBAAAAAasEAQAAAAGtBAAAAK0EAq4EQAAAAAEBSAAArgYAMAFIAACuBgAwDAMAAMgIACAEAADJCAAgSIAAAAABjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhpwQBALsIACGpBAAAxQipBCKqBAEAuwgAIasEAQC8CAAhrQQAAMYIrQQirgRAAMcIACECAAAAcQAgSAAAsQYAIApIgAAAAAGOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGnBAEAuwgAIakEAADFCKkEIqoEAQC7CAAhqwQBALwIACGtBAAAxgitBCKuBEAAxwgAIQIAAABvACBIAACzBgAgAgAAAG8AIEgAALMGACADAAAAcQAgTwAArAYAIFAAALEGACABAAAAcQAgAQAAAG8AIAUXAADCCAAgVQAAxAgAIFYAAMMIACCrBAAAtwgAIK4EAAC3CAAgDUgAANoGACCLBAAA5wYAMIwEAAC6BgAQjQQAAOcGADCOBAEA1gYAIY8EAQDWBgAhlQRAANsGACGnBAEA1gYAIakEAADoBqkEIqoEAQDYBgAhqwQBANkGACGtBAAA6QatBCKuBEAA6gYAIQMAAABvACABAAC5BgAwVAAAugYAIAMAAABvACABAABwADACAABxACABAAAAeQAgAQAAAHkAIAMAAAB3ACABAAB4ADACAAB5ACADAAAAdwAgAQAAeAAwAgAAeQAgAwAAAHcAIAEAAHgAMAIAAHkAIAsDAADACAAgEgAAwQgAIEiAAAAAAY4EAQAAAAGPBAEAAAABkAQBAAAAAZEEAQAAAAGSBAEAAAABkwQBAAAAAZQEAQAAAAGVBEAAAAABAUgAAMIGACAJSIAAAAABjgQBAAAAAY8EAQAAAAGQBAEAAAABkQQBAAAAAZIEAQAAAAGTBAEAAAABlAQBAAAAAZUEQAAAAAEBSAAAxAYAMAFIAADEBgAwAQAAAAMAIAsDAAC-CAAgEgAAvwgAIEiAAAAAAY4EAQC7CAAhjwQBALsIACGQBAEAvAgAIZEEAQC7CAAhkgQBALwIACGTBAEAvAgAIZQEAQC8CAAhlQRAAL0IACECAAAAeQAgSAAAyAYAIAlIgAAAAAGOBAEAuwgAIY8EAQC7CAAhkAQBALwIACGRBAEAuwgAIZIEAQC8CAAhkwQBALwIACGUBAEAvAgAIZUEQAC9CAAhAgAAAHcAIEgAAMoGACACAAAAdwAgSAAAygYAIAEAAAADACADAAAAeQAgTwAAwgYAIFAAAMgGACABAAAAeQAgAQAAAHcAIAcXAAC4CAAgVQAAuggAIFYAALkIACCQBAAAtwgAIJIEAAC3CAAgkwQAALcIACCUBAAAtwgAIAxIAADaBgAgiwQAANUGADCMBAAA0gYAEI0EAADVBgAwjgQBANYGACGPBAEA1gYAIZAEAQDXBgAhkQQBANgGACGSBAEA2QYAIZMEAQDZBgAhlAQBANkGACGVBEAA2wYAIQMAAAB3ACABAADRBgAwVAAA0gYAIAMAAAB3ACABAAB4ADACAAB5ACAMSAAA2gYAIIsEAADVBgAwjAQAANIGABCNBAAA1QYAMI4EAQDWBgAhjwQBANYGACGQBAEA1wYAIZEEAQDYBgAhkgQBANkGACGTBAEA2QYAIZQEAQDZBgAhlQRAANsGACELFwAA3QYAIFUAAOQGACBWAADkBgAglgQBAAAAAZcEAQAAAASYBAEAAAAEmQQBAAAAAZoEAQAAAAGbBAEAAAABnAQBAAAAAZ0EAQDmBgAhCxcAAOEGACBVAADiBgAgVgAA4gYAIJYEAQAAAAGXBAEAAAAFmAQBAAAABZkEAQAAAAGaBAEAAAABmwQBAAAAAZwEAQAAAAGdBAEA5QYAIQ4XAADdBgAgVQAA5AYAIFYAAOQGACCWBAEAAAABlwQBAAAABJgEAQAAAASZBAEAAAABmgQBAAAAAZsEAQAAAAGcBAEAAAABnQQBAOMGACGkBAEAAAABpQQBAAAAAaYEAQAAAAEOFwAA4QYAIFUAAOIGACBWAADiBgAglgQBAAAAAZcEAQAAAAWYBAEAAAAFmQQBAAAAAZoEAQAAAAGbBAEAAAABnAQBAAAAAZ0EAQDgBgAhpAQBAAAAAaUEAQAAAAGmBAEAAAABDxcAAN0GACBVAADfBgAgVgAA3wYAIJYEgAAAAAGZBIAAAAABmgSAAAAAAZsEgAAAAAGcBIAAAAABnQSAAAAAAZ4EAQAAAAGfBAEAAAABoAQBAAAAAaEEgAAAAAGiBIAAAAABowSAAAAAAQsXAADdBgAgVQAA3gYAIFYAAN4GACCWBEAAAAABlwRAAAAABJgEQAAAAASZBEAAAAABmgRAAAAAAZsEQAAAAAGcBEAAAAABnQRAANwGACELFwAA3QYAIFUAAN4GACBWAADeBgAglgRAAAAAAZcEQAAAAASYBEAAAAAEmQRAAAAAAZoEQAAAAAGbBEAAAAABnARAAAAAAZ0EQADcBgAhCJYEAgAAAAGXBAIAAAAEmAQCAAAABJkEAgAAAAGaBAIAAAABmwQCAAAAAZwEAgAAAAGdBAIA3QYAIQiWBEAAAAABlwRAAAAABJgEQAAAAASZBEAAAAABmgRAAAAAAZsEQAAAAAGcBEAAAAABnQRAAN4GACEMlgSAAAAAAZkEgAAAAAGaBIAAAAABmwSAAAAAAZwEgAAAAAGdBIAAAAABngQBAAAAAZ8EAQAAAAGgBAEAAAABoQSAAAAAAaIEgAAAAAGjBIAAAAABDhcAAOEGACBVAADiBgAgVgAA4gYAIJYEAQAAAAGXBAEAAAAFmAQBAAAABZkEAQAAAAGaBAEAAAABmwQBAAAAAZwEAQAAAAGdBAEA4AYAIaQEAQAAAAGlBAEAAAABpgQBAAAAAQiWBAIAAAABlwQCAAAABZgEAgAAAAWZBAIAAAABmgQCAAAAAZsEAgAAAAGcBAIAAAABnQQCAOEGACELlgQBAAAAAZcEAQAAAAWYBAEAAAAFmQQBAAAAAZoEAQAAAAGbBAEAAAABnAQBAAAAAZ0EAQDiBgAhpAQBAAAAAaUEAQAAAAGmBAEAAAABDhcAAN0GACBVAADkBgAgVgAA5AYAIJYEAQAAAAGXBAEAAAAEmAQBAAAABJkEAQAAAAGaBAEAAAABmwQBAAAAAZwEAQAAAAGdBAEA4wYAIaQEAQAAAAGlBAEAAAABpgQBAAAAAQuWBAEAAAABlwQBAAAABJgEAQAAAASZBAEAAAABmgQBAAAAAZsEAQAAAAGcBAEAAAABnQQBAOQGACGkBAEAAAABpQQBAAAAAaYEAQAAAAELFwAA4QYAIFUAAOIGACBWAADiBgAglgQBAAAAAZcEAQAAAAWYBAEAAAAFmQQBAAAAAZoEAQAAAAGbBAEAAAABnAQBAAAAAZ0EAQDlBgAhCxcAAN0GACBVAADkBgAgVgAA5AYAIJYEAQAAAAGXBAEAAAAEmAQBAAAABJkEAQAAAAGaBAEAAAABmwQBAAAAAZwEAQAAAAGdBAEA5gYAIQ1IAADaBgAgiwQAAOcGADCMBAAAugYAEI0EAADnBgAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhpwQBANYGACGpBAAA6AapBCKqBAEA2AYAIasEAQDZBgAhrQQAAOkGrQQirgRAAOoGACEHFwAA3QYAIFUAAPAGACBWAADwBgAglgQAAACpBAKXBAAAAKkECJgEAAAAqQQInQQAAO8GqQQiBxcAAN0GACBVAADuBgAgVgAA7gYAIJYEAAAArQQClwQAAACtBAiYBAAAAK0ECJ0EAADtBq0EIgsXAADhBgAgVQAA7AYAIFYAAOwGACCWBEAAAAABlwRAAAAABZgEQAAAAAWZBEAAAAABmgRAAAAAAZsEQAAAAAGcBEAAAAABnQRAAOsGACELFwAA4QYAIFUAAOwGACBWAADsBgAglgRAAAAAAZcEQAAAAAWYBEAAAAAFmQRAAAAAAZoEQAAAAAGbBEAAAAABnARAAAAAAZ0EQADrBgAhCJYEQAAAAAGXBEAAAAAFmARAAAAABZkEQAAAAAGaBEAAAAABmwRAAAAAAZwEQAAAAAGdBEAA7AYAIQcXAADdBgAgVQAA7gYAIFYAAO4GACCWBAAAAK0EApcEAAAArQQImAQAAACtBAidBAAA7QatBCIElgQAAACtBAKXBAAAAK0ECJgEAAAArQQInQQAAO4GrQQiBxcAAN0GACBVAADwBgAgVgAA8AYAIJYEAAAAqQQClwQAAACpBAiYBAAAAKkECJ0EAADvBqkEIgSWBAAAAKkEApcEAAAAqQQImAQAAACpBAidBAAA8AapBCILBQIA8gYAIYsEAADxBgAwjAQAAKQGABCNBAAA8QYAMI4EAQDWBgAhjwQBANYGACGnBAEA1gYAIa0EAADzBrEEIq8EAQDWBgAhsQRAAOoGACGyBEAA2wYAIQ0XAADdBgAgVQAA3QYAIFYAAN0GACB3AAD3BgAgeAAA3QYAIJYEAgAAAAGXBAIAAAAEmAQCAAAABJkEAgAAAAGaBAIAAAABmwQCAAAAAZwEAgAAAAGdBAIA9gYAIQcXAADdBgAgVQAA9QYAIFYAAPUGACCWBAAAALEEApcEAAAAsQQImAQAAACxBAidBAAA9AaxBCIHFwAA3QYAIFUAAPUGACBWAAD1BgAglgQAAACxBAKXBAAAALEECJgEAAAAsQQInQQAAPQGsQQiBJYEAAAAsQQClwQAAACxBAiYBAAAALEECJ0EAAD1BrEEIg0XAADdBgAgVQAA3QYAIFYAAN0GACB3AAD3BgAgeAAA3QYAIJYEAgAAAAGXBAIAAAAEmAQCAAAABJkEAgAAAAGaBAIAAAABmwQCAAAAAZwEAgAAAAGdBAIA9gYAIQiWBAgAAAABlwQIAAAABJgECAAAAASZBAgAAAABmgQIAAAAAZsECAAAAAGcBAgAAAABnQQIAPcGACERiwQAAPgGADCMBAAAjgYAEI0EAAD4BgAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhqgQBANgGACGtBAAA-Qa7BCKzBAEA2QYAIbQEAQDYBgAhtQQCAPIGACG2BAIA8gYAIbcEAgDyBgAhuARAANsGACG5BEAA2wYAIbsEAQDXBgAhvARAANsGACEHFwAA3QYAIFUAAPsGACBWAAD7BgAglgQAAAC7BAKXBAAAALsECJgEAAAAuwQInQQAAPoGuwQiBxcAAN0GACBVAAD7BgAgVgAA-wYAIJYEAAAAuwQClwQAAAC7BAiYBAAAALsECJ0EAAD6BrsEIgSWBAAAALsEApcEAAAAuwQImAQAAAC7BAidBAAA-wa7BCINiwQAAPwGADCMBAAA-AUAEI0EAAD8BgAwjgQBANYGACGPBAEA1gYAIacEAQDWBgAhrQQAAP0GvwQivQQBANYGACG_BAIA8gYAIcAEAQDZBgAhwQQBANkGACHCBEAA6gYAIcMEQADbBgAhBxcAAN0GACBVAAD_BgAgVgAA_wYAIJYEAAAAvwQClwQAAAC_BAiYBAAAAL8ECJ0EAAD-Br8EIgcXAADdBgAgVQAA_wYAIFYAAP8GACCWBAAAAL8EApcEAAAAvwQImAQAAAC_BAidBAAA_ga_BCIElgQAAAC_BAKXBAAAAL8ECJgEAAAAvwQInQQAAP8GvwQiDosEAACABwAwjAQAAOIFABCNBAAAgAcAMI4EAQDWBgAhjwQBANYGACGVBEAA2wYAIakEAACBB8UEIqoEAQDYBgAhrQQAAIMHyAQiswQBANkGACG8BEAA2wYAIb8EAgDyBgAhxQQCAIIHACHGBAEA2QYAIQcXAADdBgAgVQAAiQcAIFYAAIkHACCWBAAAAMUEApcEAAAAxQQImAQAAADFBAidBAAAiAfFBCINFwAA4QYAIFUAAOEGACBWAADhBgAgdwAAhwcAIHgAAOEGACCWBAIAAAABlwQCAAAABZgEAgAAAAWZBAIAAAABmgQCAAAAAZsEAgAAAAGcBAIAAAABnQQCAIYHACEHFwAA3QYAIFUAAIUHACBWAACFBwAglgQAAADIBAKXBAAAAMgECJgEAAAAyAQInQQAAIQHyAQiBxcAAN0GACBVAACFBwAgVgAAhQcAIJYEAAAAyAQClwQAAADIBAiYBAAAAMgECJ0EAACEB8gEIgSWBAAAAMgEApcEAAAAyAQImAQAAADIBAidBAAAhQfIBCINFwAA4QYAIFUAAOEGACBWAADhBgAgdwAAhwcAIHgAAOEGACCWBAIAAAABlwQCAAAABZgEAgAAAAWZBAIAAAABmgQCAAAAAZsEAgAAAAGcBAIAAAABnQQCAIYHACEIlgQIAAAAAZcECAAAAAWYBAgAAAAFmQQIAAAAAZoECAAAAAGbBAgAAAABnAQIAAAAAZ0ECACHBwAhBxcAAN0GACBVAACJBwAgVgAAiQcAIJYEAAAAxQQClwQAAADFBAiYBAAAAMUECJ0EAACIB8UEIgSWBAAAAMUEApcEAAAAxQQImAQAAADFBAidBAAAiQfFBCINiwQAAIoHADCMBAAAzAUAEI0EAACKBwAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhyAQBANYGACHJBAEA1gYAIcsEAACLB8sEIswEAgCCBwAhzQQBANkGACHOBAIA8gYAIc8EAgDyBgAhBxcAAN0GACBVAACNBwAgVgAAjQcAIJYEAAAAywQClwQAAADLBAiYBAAAAMsECJ0EAACMB8sEIgcXAADdBgAgVQAAjQcAIFYAAI0HACCWBAAAAMsEApcEAAAAywQImAQAAADLBAidBAAAjAfLBCIElgQAAADLBAKXBAAAAMsECJgEAAAAywQInQQAAI0HywQiDIsEAACOBwAwjAQAALYFABCNBAAAjgcAMI4EAQDWBgAhjwQBANYGACGQBAEA1wYAIZEEAQDYBgAhlQRAANsGACHABAEA2QYAIcgEAQDWBgAh0QQAAI8H0QQj0gQAAI8H0QQjBxcAAOEGACBVAACRBwAgVgAAkQcAIJYEAAAA0QQDlwQAAADRBAmYBAAAANEECZ0EAACQB9EEIwcXAADhBgAgVQAAkQcAIFYAAJEHACCWBAAAANEEA5cEAAAA0QQJmAQAAADRBAmdBAAAkAfRBCMElgQAAADRBAOXBAAAANEECZgEAAAA0QQJnQQAAJEH0QQjDIsEAACSBwAwjAQAAJ4FABCNBAAAkgcAMI4EAQDWBgAhjwQBANYGACGVBEAA2wYAIcgEAQDWBgAh0wQBANYGACHUBAEA2AYAIdUEAQDYBgAh1gQBANkGACHXBAIAggcAIQqLBAAAkwcAMIwEAACIBQAQjQQAAJMHADCOBAEA1gYAIY8EAQDWBgAhlQRAANsGACGrBAEA2AYAIbwEQADbBgAhyAQBANYGACHYBAEA1gYAIRgFAgDyBgAhiwQAAJQHADCMBAAA8gQAEI0EAACUBwAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhqgQBANgGACGtBAAAlQfRBCKxBEAA6gYAIbMEAQDZBgAhtgQCAPIGACG3BAIA8gYAIbwEQADbBgAh2gQAAJYH2gQi2wQBANcGACHcBAEA1wYAId0EAQDXBgAh3gQQAJcHACHfBEAA6gYAIeAEQADqBgAh4QRAAOoGACHiBEAA6gYAIeMEAgDyBgAhBxcAAN0GACBVAACdBwAgVgAAnQcAIJYEAAAA0QQClwQAAADRBAiYBAAAANEECJ0EAACcB9EEIgcXAADdBgAgVQAAmwcAIFYAAJsHACCWBAAAANoEApcEAAAA2gQImAQAAADaBAidBAAAmgfaBCINFwAA4QYAIFUAAJkHACBWAACZBwAgdwAAmQcAIHgAAJkHACCWBBAAAAABlwQQAAAABZgEEAAAAAWZBBAAAAABmgQQAAAAAZsEEAAAAAGcBBAAAAABnQQQAJgHACENFwAA4QYAIFUAAJkHACBWAACZBwAgdwAAmQcAIHgAAJkHACCWBBAAAAABlwQQAAAABZgEEAAAAAWZBBAAAAABmgQQAAAAAZsEEAAAAAGcBBAAAAABnQQQAJgHACEIlgQQAAAAAZcEEAAAAAWYBBAAAAAFmQQQAAAAAZoEEAAAAAGbBBAAAAABnAQQAAAAAZ0EEACZBwAhBxcAAN0GACBVAACbBwAgVgAAmwcAIJYEAAAA2gQClwQAAADaBAiYBAAAANoECJ0EAACaB9oEIgSWBAAAANoEApcEAAAA2gQImAQAAADaBAidBAAAmwfaBCIHFwAA3QYAIFUAAJ0HACBWAACdBwAglgQAAADRBAKXBAAAANEECJgEAAAA0QQInQQAAJwH0QQiBJYEAAAA0QQClwQAAADRBAiYBAAAANEECJ0EAACdB9EEIgyLBAAAngcAMIwEAADWBAAQjQQAAJ4HADCOBAEA1gYAIY8EAQDWBgAhlQRAANsGACGpBAAAnwfnBCLIBAEA1wYAIc4EAgDyBgAh5AQBANYGACHlBAEA1gYAIecEAQDYBgAhBxcAAN0GACBVAAChBwAgVgAAoQcAIJYEAAAA5wQClwQAAADnBAiYBAAAAOcECJ0EAACgB-cEIgcXAADdBgAgVQAAoQcAIFYAAKEHACCWBAAAAOcEApcEAAAA5wQImAQAAADnBAidBAAAoAfnBCIElgQAAADnBAKXBAAAAOcECJgEAAAA5wQInQQAAKEH5wQiCIsEAACiBwAwjAQAAL4EABCNBAAAogcAMI4EAQDWBgAhjwQBANYGACGnBAEA1gYAIbsEAQDWBgAh6ARAANsGACEKiwQAAKMHADCMBAAAqAQAEI0EAACjBwAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhswQBANkGACHGBAEA2QYAIekEAQDYBgAh6gQBANcGACEJBQAA2gYAIIsEAACkBwAwjAQAAJAEABCNBAAApAcAMI4EAQDWBgAhjwQBANYGACGnBAEA1gYAIeoEAQDWBgAh6wRAANsGACEQiwQAAKUHADCMBAAA-gMAEI0EAAClBwAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhqQQAAKYH7gQiqgQBANgGACGtBAAAgwfIBCKzBAEA2QYAIbYEAgDyBgAhtwQCAPIGACG8BEAA2wYAIewEAQDYBgAh7gQAANoGACDvBAEA2QYAIQcXAADdBgAgVQAAqAcAIFYAAKgHACCWBAAAAO4EApcEAAAA7gQImAQAAADuBAidBAAApwfuBCIHFwAA3QYAIFUAAKgHACBWAACoBwAglgQAAADuBAKXBAAAAO4ECJgEAAAA7gQInQQAAKcH7gQiBJYEAAAA7gQClwQAAADuBAiYBAAAAO4ECJ0EAACoB-4EIgyLBAAAqQcAMIwEAADkAwAQjQQAAKkHADCOBAEA1gYAIY8EAQDWBgAhlQRAANsGACGnBAEA1gYAIfAEAgDyBgAh8gQAAKoH8gQi8wQBANkGACH0BAEA2QYAIfUEAQDXBgAhBxcAAN0GACBVAACsBwAgVgAArAcAIJYEAAAA8gQClwQAAADyBAiYBAAAAPIECJ0EAACrB_IEIgcXAADdBgAgVQAArAcAIFYAAKwHACCWBAAAAPIEApcEAAAA8gQImAQAAADyBAidBAAAqwfyBCIElgQAAADyBAKXBAAAAPIECJgEAAAA8gQInQQAAKwH8gQiDIsEAACtBwAwjAQAAM4DABCNBAAArQcAMI4EAQDWBgAhjwQBANYGACGVBEAA2wYAIacEAQDWBgAh8AQCAPIGACHyBAAAqgfyBCLzBAEA2QYAIfQEAQDZBgAh9QQBANcGACENiwQAAK4HADCMBAAAuAMAEI0EAACuBwAwjgQBANYGACGPBAEA1gYAIacEAQDWBgAhvARAANsGACH2BAIA8gYAIfcEAgDyBgAh-AQBANcGACH5BAIA8gYAIfoEAgDyBgAh-wRAAOoGACESiwQAAK8HADCMBAAAogMAEI0EAACvBwAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhrQQAALEHgwUi2wQBANcGACH8BAEA2AYAIf0EAQDZBgAh_gQBANgGACH_BAEA2QYAIYEFAACwB4EFIoMFAQDWBgAhhAUBANcGACGFBUAA2wYAIYYFQADqBgAhhwVAAOoGACEHFwAA3QYAIFUAALUHACBWAAC1BwAglgQAAACBBQKXBAAAAIEFCJgEAAAAgQUInQQAALQHgQUiBxcAAN0GACBVAACzBwAgVgAAswcAIJYEAAAAgwUClwQAAACDBQiYBAAAAIMFCJ0EAACyB4MFIgcXAADdBgAgVQAAswcAIFYAALMHACCWBAAAAIMFApcEAAAAgwUImAQAAACDBQidBAAAsgeDBSIElgQAAACDBQKXBAAAAIMFCJgEAAAAgwUInQQAALMHgwUiBxcAAN0GACBVAAC1BwAgVgAAtQcAIJYEAAAAgQUClwQAAACBBQiYBAAAAIEFCJ0EAAC0B4EFIgSWBAAAAIEFApcEAAAAgQUImAQAAACBBQidBAAAtQeBBSIJiwQAALYHADCMBAAAiAMAEI0EAAC2BwAwjgQBANYGACGPBAEA1gYAIaoEAQDZBgAh7wQBANkGACGIBQIA8gYAIYkFAgDyBgAhCosEAAC3BwAwjAQAAPICABCNBAAAtwcAMI4EAQDWBgAhjwQBANYGACGnBAEA1gYAIbIEQADbBgAh2wQBANYGACGBBQAAuAeMBSKKBQEA1wYAIQcXAADdBgAgVQAAugcAIFYAALoHACCWBAAAAIwFApcEAAAAjAUImAQAAACMBQidBAAAuQeMBSIHFwAA3QYAIFUAALoHACBWAAC6BwAglgQAAACMBQKXBAAAAIwFCJgEAAAAjAUInQQAALkHjAUiBJYEAAAAjAUClwQAAACMBQiYBAAAAIwFCJ0EAAC6B4wFIguLBAAAuwcAMIwEAADaAgAQjQQAALsHADCOBAEA1gYAIY8EAQDWBgAhlQRAANsGACGzBAEA2QYAIbwEQADbBgAh6QQBANgGACGMBQEA2AYAIY0FAQDXBgAhCosEAAC8BwAwjAQAAMICABCNBAAAvAcAMI4EAQDWBgAhlAQBANkGACGVBEAA2wYAIacEAQDWBgAhhQVAANsGACGHBUAA6gYAIY4FAQDZBgAhCosEAAC9BwAwjAQAAKwCABCNBAAAvQcAMI4EAQDWBgAhlAQBANkGACGVBEAA2wYAIfwEAQDYBgAhhQVAANsGACGOBQEA2QYAIY8FQADqBgAhCosEAAC-BwAwjAQAAJkCABCNBAAAvgcAMI4EAQC_BwAhlAQBAMMHACGVBEAAwQcAIfwEAQDABwAhhQVAAMEHACGOBQEAwwcAIY8FQADCBwAhCJYEAQAAAAGXBAEAAAAEmAQBAAAABJkEAQAAAAGaBAEAAAABmwQBAAAAAZwEAQAAAAGdBAEAxAcAIQuWBAEAAAABlwQBAAAABJgEAQAAAASZBAEAAAABmgQBAAAAAZsEAQAAAAGcBAEAAAABnQQBAOQGACGkBAEAAAABpQQBAAAAAaYEAQAAAAEIlgRAAAAAAZcEQAAAAASYBEAAAAAEmQRAAAAAAZoEQAAAAAGbBEAAAAABnARAAAAAAZ0EQADeBgAhCJYEQAAAAAGXBEAAAAAFmARAAAAABZkEQAAAAAGaBEAAAAABmwRAAAAAAZwEQAAAAAGdBEAA7AYAIQuWBAEAAAABlwQBAAAABZgEAQAAAAWZBAEAAAABmgQBAAAAAZsEAQAAAAGcBAEAAAABnQQBAOIGACGkBAEAAAABpQQBAAAAAaYEAQAAAAEIlgQBAAAAAZcEAQAAAASYBAEAAAAEmQQBAAAAAZoEAQAAAAGbBAEAAAABnAQBAAAAAZ0EAQDEBwAhDosEAADFBwAwjAQAAJMCABCNBAAAxQcAMI4EAQDWBgAhlQRAANsGACH8BAEA2AYAIYUFQADbBgAhjgUBANkGACGPBUAA6gYAIZEFAADGB5EFIpIFAQDYBgAhkwUCAPIGACGUBQIA8gYAIZUFAQDZBgAhBxcAAN0GACBVAADIBwAgVgAAyAcAIJYEAAAAkQUClwQAAACRBQiYBAAAAJEFCJ0EAADHB5EFIgcXAADdBgAgVQAAyAcAIFYAAMgHACCWBAAAAJEFApcEAAAAkQUImAQAAACRBQidBAAAxweRBSIElgQAAACRBQKXBAAAAJEFCJgEAAAAkQUInQQAAMgHkQUiDosEAADJBwAwjAQAAIACABCNBAAAyQcAMI4EAQC_BwAhlQRAAMEHACH8BAEAwAcAIYUFQADBBwAhjgUBAMMHACGPBUAAwgcAIZEFAADKB5EFIpIFAQDABwAhkwUCAMsHACGUBQIAywcAIZUFAQDDBwAhBJYEAAAAkQUClwQAAACRBQiYBAAAAJEFCJ0EAADIB5EFIgiWBAIAAAABlwQCAAAABJgEAgAAAASZBAIAAAABmgQCAAAAAZsEAgAAAAGcBAIAAAABnQQCAN0GACERiwQAAMwHADCMBAAA-gEAEI0EAADMBwAwjgQBANYGACGPBAEA1gYAIZUEQADbBgAhrQQAAM0HmQUivARAANsGACH8BAEA2QYAIf4EAQDYBgAh_wQBANkGACGBBQAAsAeBBSKWBQEA2QYAIZcFAQDZBgAhmQUBANgGACGaBQEA2QYAIZsFQADqBgAhBxcAAN0GACBVAADPBwAgVgAAzwcAIJYEAAAAmQUClwQAAACZBQiYBAAAAJkFCJ0EAADOB5kFIgcXAADdBgAgVQAAzwcAIFYAAM8HACCWBAAAAJkFApcEAAAAmQUImAQAAACZBQidBAAAzgeZBSIElgQAAACZBQKXBAAAAJkFCJgEAAAAmQUInQQAAM8HmQUiDYsEAADQBwAwjAQAAOQBABCNBAAA0AcAMI4EAQDWBgAhlQRAANsGACG8BEAA2wYAIekEAQDYBgAhjAUBANgGACGZBQEA2AYAIZoFAQDYBgAhnAUBANkGACGdBQEA2QYAIZ4FIADRBwAhBRcAAN0GACBVAADTBwAgVgAA0wcAIJYEIAAAAAGdBCAA0gcAIQUXAADdBgAgVQAA0wcAIFYAANMHACCWBCAAAAABnQQgANIHACEClgQgAAAAAZ0EIADTBwAhJRYAAOYHACAYAADdBwAgGwAA7QcAICIAAN8HACAjAADgBwAgJAAA4QcAICkAAOQHACAqAADiBwAgKwAA2wcAICwAANwHACAvAADoBwAgMQAA6gcAIDQAAOsHACA2AADsBwAgOQAA1gcAIDoAANcHACA7AADYBwAgPAAA2QcAID0AANoHACA-AADeBwAgPwAA4wcAIEAAAOUHACBBAADnBwAgQgAA6QcAIIsEAADUBwAwjAQAANEBABCNBAAA1AcAMI4EAQC_BwAhlQRAAMEHACG8BEAAwQcAIekEAQDABwAhjAUBAMAHACGZBQEAwAcAIZoFAQDABwAhnAUBAMMHACGdBQEAwwcAIZ4FIADVBwAhApYEIAAAAAGdBCAA0wcAIQOfBQAAAwAgoAUAAAMAIKEFAAADACADnwUAABMAIKAFAAATACChBQAAEwAgA58FAAAJACCgBQAACQAgoQUAAAkAIAOfBQAAlgEAIKAFAACWAQAgoQUAAJYBACADnwUAAAcAIKAFAAAHACChBQAABwAgA58FAABZACCgBQAAWQAgoQUAAFkAIAOfBQAAXQAgoAUAAF0AIKEFAABdACADnwUAAA8AIKAFAAAPACChBQAADwAgA58FAAAXACCgBQAAFwAgoQUAABcAIAOfBQAAGwAgoAUAABsAIKEFAAAbACADnwUAAB8AIKAFAAAfACChBQAAHwAgA58FAAAjACCgBQAAIwAgoQUAACMAIAOfBQAATwAgoAUAAE8AIKEFAABPACADnwUAAEYAIKAFAABGACChBQAARgAgA58FAABLACCgBQAASwAgoQUAAEsAIAOfBQAAUQAgoAUAAFEAIKEFAABRACADnwUAACgAIKAFAAAoACChBQAAKAAgA58FAACrAQAgoAUAAKsBACChBQAAqwEAIAOfBQAAYwAgoAUAAGMAIKEFAABjACADnwUAALABACCgBQAAsAEAIKEFAACwAQAgA58FAABpACCgBQAAaQAgoQUAAGkAIAOfBQAAbwAgoAUAAG8AIKEFAABvACADnwUAAHcAIKAFAAB3ACChBQAAdwAgA58FAAAyACCgBQAAMgAgoQUAADIAIBMDAADxBwAgMQAA6gcAIIsEAADuBwAwjAQAALABABCNBAAA7gcAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIaoEAQDABwAhrQQAAO8HuwQiswQBAMMHACG0BAEAwAcAIbUEAgDLBwAhtgQCAMsHACG3BAIAywcAIbgEQADBBwAhuQRAAMEHACG7BAEA8AcAIbwEQADBBwAhBJYEAAAAuwQClwQAAAC7BAiYBAAAALsECJ0EAAD7BrsEIgiWBAEAAAABlwQBAAAABZgEAQAAAAWZBAEAAAABmgQBAAAAAZsEAQAAAAGcBAEAAAABnQQBAPIHACEnFgAA5gcAIBgAAN0HACAbAADtBwAgIgAA3wcAICMAAOAHACAkAADhBwAgKQAA5AcAICoAAOIHACArAADbBwAgLAAA3AcAIC8AAOgHACAxAADqBwAgNAAA6wcAIDYAAOwHACA5AADWBwAgOgAA1wcAIDsAANgHACA8AADZBwAgPQAA2gcAID4AAN4HACA_AADjBwAgQAAA5QcAIEEAAOcHACBCAADpBwAgiwQAANQHADCMBAAA0QEAEI0EAADUBwAwjgQBAL8HACGVBEAAwQcAIbwEQADBBwAh6QQBAMAHACGMBQEAwAcAIZkFAQDABwAhmgUBAMAHACGcBQEAwwcAIZ0FAQDDBwAhngUgANUHACGtBQAA0QEAIK4FAADRAQAgCJYEAQAAAAGXBAEAAAAFmAQBAAAABZkEAQAAAAGaBAEAAAABmwQBAAAAAZwEAQAAAAGdBAEA8gcAIRADAADxBwAgLwAA6AcAIIsEAADzBwAwjAQAAKsBABCNBAAA8wcAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIakEAAD0B8UEIqoEAQDABwAhrQQAAPYHyAQiswQBAMMHACG8BEAAwQcAIb8EAgDLBwAhxQQCAPUHACHGBAEAwwcAIQSWBAAAAMUEApcEAAAAxQQImAQAAADFBAidBAAAiQfFBCIIlgQCAAAAAZcEAgAAAAWYBAIAAAAFmQQCAAAAAZoEAgAAAAGbBAIAAAABnAQCAAAAAZ0EAgDhBgAhBJYEAAAAyAQClwQAAADIBAiYBAAAAMgECJ0EAACFB8gEIgKPBAEAAAAB7AQBAAAAARMDAADxBwAgJQAA4wcAICkAAOQHACCLBAAA-AcAMIwEAABPABCNBAAA-AcAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIakEAAD5B-4EIqoEAQDABwAhrQQAAPYHyAQiswQBAMMHACG2BAIAywcAIbcEAgDLBwAhvARAAMEHACHsBAEAwAcAIe4EAAD6BwAg7wQBAMMHACEElgQAAADuBAKXBAAAAO4ECJgEAAAA7gQInQQAAKgH7gQiDJYEgAAAAAGZBIAAAAABmgSAAAAAAZsEgAAAAAGcBIAAAAABnQSAAAAAAZ4EAQAAAAGfBAEAAAABoAQBAAAAAaEEgAAAAAGiBIAAAAABowSAAAAAAQ8DAADxBwAgBAAA_AcAIIsEAAD7BwAwjAQAAAcAEI0EAAD7BwAwjgQBAL8HACGPBAEAvwcAIacEAQC_BwAhvARAAMEHACH2BAIAywcAIfcEAgDLBwAh-AQBAPAHACH5BAIAywcAIfoEAgDLBwAh-wRAAMIHACErAwAA8QcAIAUAALUIACANAADeBwAgHQAA2AcAIB4AANgHACAfAADXBwAgIAAA3QcAICEAAN0HACAiAADfBwAgIwAA4AcAICQAAOEHACApAADlBwAgKgAA4wcAICsAANsHACAsAADcBwAgLQAA5gcAIC4AAOYHACAvAADoBwAgMwAA6gcAIDQAAOsHACA1AAC2CAAgNgAA7AcAIDcAAO0HACA4AADtBwAgiwQAALMIADCMBAAAAwAQjQQAALMIADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGtBAAAtAiZBSK8BEAAwQcAIfwEAQDDBwAh_gQBAMAHACH_BAEAwwcAIYEFAACbCIEFIpYFAQDDBwAhlwUBAMMHACGZBQEAwAcAIZoFAQDDBwAhmwVAAMIHACGtBQAAAwAgrgUAAAMAIAKPBAEAAAABiAUCAAAAAQoDAADxBwAgiwQAAP4HADCMBAAAlgEAEI0EAAD-BwAwjgQBAL8HACGPBAEAvwcAIaoEAQDDBwAh7wQBAMMHACGIBQIAywcAIYkFAgDLBwAhDgMAAPEHACASAACACAAgSAAA-gcAIIsEAAD_BwAwjAQAAHcAEI0EAAD_BwAwjgQBAL8HACGPBAEAvwcAIZAEAQDwBwAhkQQBAMAHACGSBAEAwwcAIZMEAQDDBwAhlAQBAMMHACGVBEAAwQcAISsDAADxBwAgBQAAtQgAIA0AAN4HACAdAADYBwAgHgAA2AcAIB8AANcHACAgAADdBwAgIQAA3QcAICIAAN8HACAjAADgBwAgJAAA4QcAICkAAOUHACAqAADjBwAgKwAA2wcAICwAANwHACAtAADmBwAgLgAA5gcAIC8AAOgHACAzAADqBwAgNAAA6wcAIDUAALYIACA2AADsBwAgNwAA7QcAIDgAAO0HACCLBAAAswgAMIwEAAADABCNBAAAswgAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIa0EAAC0CJkFIrwEQADBBwAh_AQBAMMHACH-BAEAwAcAIf8EAQDDBwAhgQUAAJsIgQUilgUBAMMHACGXBQEAwwcAIZkFAQDABwAhmgUBAMMHACGbBUAAwgcAIa0FAAADACCuBQAAAwAgCwQAAPwHACCLBAAAgQgAMIwEAABzABCNBAAAgQgAMI4EAQC_BwAhlAQBAMMHACGVBEAAwQcAIacEAQC_BwAhhQVAAMEHACGHBUAAwgcAIY4FAQDDBwAhDwMAAPEHACAEAAD8BwAgSAAA-gcAIIsEAACCCAAwjAQAAG8AEI0EAACCCAAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhpwQBAL8HACGpBAAAgwipBCKqBAEAwAcAIasEAQDDBwAhrQQAAIQIrQQirgRAAMIHACEElgQAAACpBAKXBAAAAKkECJgEAAAAqQQInQQAAPAGqQQiBJYEAAAArQQClwQAAACtBAiYBAAAAK0ECJ0EAADuBq0EIgKnBAEAAAABrwQBAAAAAQ4DAADxBwAgBAAA_AcAIAUCAMsHACEyAACICAAgiwQAAIYIADCMBAAAaQAQjQQAAIYIADCOBAEAvwcAIY8EAQC_BwAhpwQBAL8HACGtBAAAhwixBCKvBAEAvwcAIbEEQADCBwAhsgRAAMEHACEElgQAAACxBAKXBAAAALEECJgEAAAAsQQInQQAAPUGsQQiFQMAAPEHACAxAADqBwAgiwQAAO4HADCMBAAAsAEAEI0EAADuBwAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhqgQBAMAHACGtBAAA7we7BCKzBAEAwwcAIbQEAQDABwAhtQQCAMsHACG2BAIAywcAIbcEAgDLBwAhuARAAMEHACG5BEAAwQcAIbsEAQDwBwAhvARAAMEHACGtBQAAsAEAIK4FAACwAQAgEAMAAPEHACAEAAD8BwAgMAAAiwgAIIsEAACJCAAwjAQAAGMAEI0EAACJCAAwjgQBAL8HACGPBAEAvwcAIacEAQC_BwAhrQQAAIoIvwQivQQBAL8HACG_BAIAywcAIcAEAQDDBwAhwQQBAMMHACHCBEAAwgcAIcMEQADBBwAhBJYEAAAAvwQClwQAAAC_BAiYBAAAAL8ECJ0EAAD_Br8EIhIDAADxBwAgLwAA6AcAIIsEAADzBwAwjAQAAKsBABCNBAAA8wcAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIakEAAD0B8UEIqoEAQDABwAhrQQAAPYHyAQiswQBAMMHACG8BEAAwQcAIb8EAgDLBwAhxQQCAPUHACHGBAEAwwcAIa0FAACrAQAgrgUAAKsBACAOAwAA8QcAIAQAAPwHACCLBAAAjAgAMIwEAABdABCNBAAAjAgAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIacEAQC_BwAh8AQCAMsHACHyBAAAjQjyBCLzBAEAwwcAIfQEAQDDBwAh9QQBAPAHACEElgQAAADyBAKXBAAAAPIECJgEAAAA8gQInQQAAKwH8gQiDgMAAPEHACAEAAD8BwAgiwQAAI4IADCMBAAAWQAQjQQAAI4IADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGnBAEAvwcAIfAEAgDLBwAh8gQAAI0I8gQi8wQBAMMHACH0BAEAwwcAIfUEAQDwBwAhAqcEAQAAAAG7BAEAAAABCwMAAPEHACAEAAD8BwAgJwAAkQgAIIsEAACQCAAwjAQAAFEAEI0EAACQCAAwjgQBAL8HACGPBAEAvwcAIacEAQC_BwAhuwQBAL8HACHoBEAAwQcAIQ8DAADxBwAgJgAAkwgAICgAAOUHACCLBAAAkggAMIwEAABLABCNBAAAkggAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIbMEAQDDBwAhxgQBAMMHACHpBAEAwAcAIeoEAQDwBwAhrQUAAEsAIK4FAABLACANAwAA8QcAICYAAJMIACAoAADlBwAgiwQAAJIIADCMBAAASwAQjQQAAJIIADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGzBAEAwwcAIcYEAQDDBwAh6QQBAMAHACHqBAEA8AcAIRUDAADxBwAgJQAA4wcAICkAAOQHACCLBAAA-AcAMIwEAABPABCNBAAA-AcAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIakEAAD5B-4EIqoEAQDABwAhrQQAAPYHyAQiswQBAMMHACG2BAIAywcAIbcEAgDLBwAhvARAAMEHACHsBAEAwAcAIe4EAAD6BwAg7wQBAMMHACGtBQAATwAgrgUAAE8AIAKnBAEAAAAB6gQBAAAAAQwDAADxBwAgBAAA_AcAIAUAAPoHACAmAACWCAAgiwQAAJUIADCMBAAARgAQjQQAAJUIADCOBAEAvwcAIY8EAQC_BwAhpwQBAL8HACHqBAEAvwcAIesEQADBBwAhFQMAAPEHACAlAADjBwAgKQAA5AcAIIsEAAD4BwAwjAQAAE8AEI0EAAD4BwAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhqQQAAPkH7gQiqgQBAMAHACGtBAAA9gfIBCKzBAEAwwcAIbYEAgDLBwAhtwQCAMsHACG8BEAAwQcAIewEAQDABwAh7gQAAPoHACDvBAEAwwcAIa0FAABPACCuBQAATwAgAo8EAQAAAAGMBQEAAAABEAMAAPEHACAGAACACAAgBwAA2AcAIBgAAN0HACAbAADtBwAgiwQAAJgIADCMBAAAEwAQjQQAAJgIADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGzBAEAwwcAIbwEQADBBwAh6QQBAMAHACGMBQEAwAcAIY0FAQDwBwAhAo8EAQAAAAH9BAEAAAABFgMAAPEHACAIAACdCAAgGQAA_AcAIBoAAIAIACCLBAAAmggAMIwEAAAyABCNBAAAmggAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIa0EAACcCIMFItsEAQDwBwAh_AQBAMAHACH9BAEAwwcAIf4EAQDABwAh_wQBAMMHACGBBQAAmwiBBSKDBQEAvwcAIYQFAQDwBwAhhQVAAMEHACGGBUAAwgcAIYcFQADCBwAhBJYEAAAAgQUClwQAAACBBQiYBAAAAIEFCJ0EAAC1B4EFIgSWBAAAAIMFApcEAAAAgwUImAQAAACDBQidBAAAsweDBSISAwAA8QcAIAYAAIAIACAHAADYBwAgGAAA3QcAIBsAAO0HACCLBAAAmAgAMIwEAAATABCNBAAAmAgAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIbMEAQDDBwAhvARAAMEHACHpBAEAwAcAIYwFAQDABwAhjQUBAPAHACGtBQAAEwAgrgUAABMAIBADAADxBwAgCwAAoAgAIBQAAPwHACAVAAD8BwAgiwQAAJ4IADCMBAAAKAAQjQQAAJ4IADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGpBAAAnwjnBCLIBAEA8AcAIc4EAgDLBwAh5AQBAL8HACHlBAEAvwcAIecEAQDABwAhBJYEAAAA5wQClwQAAADnBAiYBAAAAOcECJ0EAAChB-cEIiMDAADxBwAgBQIAywcAIQgAAJ0IACAJAACACAAgCgAAgAgAIA0AAN4HACAPAADfBwAgEQAA4AcAIBMAAOEHACAWAADmBwAgiwQAAKgIADCMBAAADwAQjQQAAKgIADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGqBAEAwAcAIa0EAACpCNEEIrEEQADCBwAhswQBAMMHACG2BAIAywcAIbcEAgDLBwAhvARAAMEHACHaBAAAqgjaBCLbBAEA8AcAIdwEAQDwBwAh3QQBAPAHACHeBBAAqwgAId8EQADCBwAh4ARAAMIHACHhBEAAwgcAIeIEQADCBwAh4wQCAMsHACGtBQAADwAgrgUAAA8AIA8DAADxBwAgCwAAowgAIBIAAIAIACCLBAAAoQgAMIwEAAAjABCNBAAAoQgAMI4EAQC_BwAhjwQBAL8HACGQBAEA8AcAIZEEAQDABwAhlQRAAMEHACHABAEAwwcAIcgEAQC_BwAh0QQAAKII0QQj0gQAAKII0QQjBJYEAAAA0QQDlwQAAADRBAmYBAAAANEECZ0EAACRB9EEIyMDAADxBwAgBQIAywcAIQgAAJ0IACAJAACACAAgCgAAgAgAIA0AAN4HACAPAADfBwAgEQAA4AcAIBMAAOEHACAWAADmBwAgiwQAAKgIADCMBAAADwAQjQQAAKgIADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGqBAEAwAcAIa0EAACpCNEEIrEEQADCBwAhswQBAMMHACG2BAIAywcAIbcEAgDLBwAhvARAAMEHACHaBAAAqgjaBCLbBAEA8AcAIdwEAQDwBwAh3QQBAPAHACHeBBAAqwgAId8EQADCBwAh4ARAAMIHACHhBEAAwgcAIeIEQADCBwAh4wQCAMsHACGtBQAADwAgrgUAAA8AIA8DAADxBwAgCwAAowgAIBAAAPwHACCLBAAApAgAMIwEAAAfABCNBAAApAgAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIcgEAQC_BwAh0wQBAL8HACHUBAEAwAcAIdUEAQDABwAh1gQBAMMHACHXBAIA9QcAIQ0DAADxBwAgCwAAowgAIA4AAPwHACCLBAAApQgAMIwEAAAbABCNBAAApQgAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIasEAQDABwAhvARAAMEHACHIBAEAvwcAIdgEAQC_BwAhEAMAAPEHACALAACjCAAgDAAA_AcAIIsEAACmCAAwjAQAABcAEI0EAACmCAAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhyAQBAL8HACHJBAEAvwcAIcsEAACnCMsEIswEAgD1BwAhzQQBAMMHACHOBAIAywcAIc8EAgDLBwAhBJYEAAAAywQClwQAAADLBAiYBAAAAMsECJ0EAACNB8sEIiEDAADxBwAgBQIAywcAIQgAAJ0IACAJAACACAAgCgAAgAgAIA0AAN4HACAPAADfBwAgEQAA4AcAIBMAAOEHACAWAADmBwAgiwQAAKgIADCMBAAADwAQjQQAAKgIADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGqBAEAwAcAIa0EAACpCNEEIrEEQADCBwAhswQBAMMHACG2BAIAywcAIbcEAgDLBwAhvARAAMEHACHaBAAAqgjaBCLbBAEA8AcAIdwEAQDwBwAh3QQBAPAHACHeBBAAqwgAId8EQADCBwAh4ARAAMIHACHhBEAAwgcAIeIEQADCBwAh4wQCAMsHACEElgQAAADRBAKXBAAAANEECJgEAAAA0QQInQQAAJ0H0QQiBJYEAAAA2gQClwQAAADaBAiYBAAAANoECJ0EAACbB9oEIgiWBBAAAAABlwQQAAAABZgEEAAAAAWZBBAAAAABmgQQAAAAAZsEEAAAAAGcBBAAAAABnQQQAJkHACECpwQBAAAAAdsEAQAAAAECjwQBAAAAAacEAQAAAAEOAwAA8QcAIAQAAPwHACAIAACwCAAgHAAAgAgAIIsEAACuCAAwjAQAAAkAEI0EAACuCAAwjgQBAL8HACGPBAEAvwcAIacEAQC_BwAhsgRAAMEHACHbBAEAvwcAIYEFAACvCIwFIooFAQDwBwAhBJYEAAAAjAUClwQAAACMBQiYBAAAAIwFCJ0EAAC6B4wFIhIDAADxBwAgBgAAgAgAIAcAANgHACAYAADdBwAgGwAA7QcAIIsEAACYCAAwjAQAABMAEI0EAACYCAAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhswQBAMMHACG8BEAAwQcAIekEAQDABwAhjAUBAMAHACGNBQEA8AcAIa0FAAATACCuBQAAEwAgAo8EAQAAAAGWBQEAAAABAo8EAQAAAAH8BAEAAAABKQMAAPEHACAFAAC1CAAgDQAA3gcAIB0AANgHACAeAADYBwAgHwAA1wcAICAAAN0HACAhAADdBwAgIgAA3wcAICMAAOAHACAkAADhBwAgKQAA5QcAICoAAOMHACArAADbBwAgLAAA3AcAIC0AAOYHACAuAADmBwAgLwAA6AcAIDMAAOoHACA0AADrBwAgNQAAtggAIDYAAOwHACA3AADtBwAgOAAA7QcAIIsEAACzCAAwjAQAAAMAEI0EAACzCAAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhrQQAALQImQUivARAAMEHACH8BAEAwwcAIf4EAQDABwAh_wQBAMMHACGBBQAAmwiBBSKWBQEAwwcAIZcFAQDDBwAhmQUBAMAHACGaBQEAwwcAIZsFQADCBwAhBJYEAAAAmQUClwQAAACZBQiYBAAAAJkFCJ0EAADPB5kFIhEDAADxBwAgBAAA_AcAIIsEAAD7BwAwjAQAAAcAEI0EAAD7BwAwjgQBAL8HACGPBAEAvwcAIacEAQC_BwAhvARAAMEHACH2BAIAywcAIfcEAgDLBwAh-AQBAPAHACH5BAIAywcAIfoEAgDLBwAh-wRAAMIHACGtBQAABwAgrgUAAAcAIAOfBQAAcwAgoAUAAHMAIKEFAABzACAAAAAAAbIFAQAAAAEBsgUBAAAAAQGyBUAAAAABBU8AAJcTACBQAACdEwAgrwUAAJgTACCwBQAAnBMAILUFAAABACAHTwAAlRMAIFAAAJoTACCvBQAAlhMAILAFAACZEwAgswUAAAMAILQFAAADACC1BQAABQAgA08AAJcTACCvBQAAmBMAILUFAAABACADTwAAlRMAIK8FAACWEwAgtQUAAAUAIAAAAAGyBQAAAKkEAgGyBQAAAK0EAgGyBUAAAAABBU8AAI0TACBQAACTEwAgrwUAAI4TACCwBQAAkhMAILUFAAABACAFTwAAixMAIFAAAJATACCvBQAAjBMAILAFAACPEwAgtQUAAAUAIANPAACNEwAgrwUAAI4TACC1BQAAAQAgA08AAIsTACCvBQAAjBMAILUFAAAFACAAAAAAAAWyBQIAAAABuAUCAAAAAbkFAgAAAAG6BQIAAAABuwUCAAAAAQGyBQAAALEEAgVPAACAEwAgUAAAiRMAIK8FAACBEwAgsAUAAIgTACC1BQAAAQAgBU8AAP4SACBQAACGEwAgrwUAAP8SACCwBQAAhRMAILUFAACyAQAgBU8AAPwSACBQAACDEwAgrwUAAP0SACCwBQAAghMAILUFAAAFACADTwAAgBMAIK8FAACBEwAgtQUAAAEAIANPAAD-EgAgrwUAAP8SACC1BQAAsgEAIANPAAD8EgAgrwUAAP0SACC1BQAABQAgAAAAAAABsgUAAAC7BAIFTwAA9hIAIFAAAPoSACCvBQAA9xIAILAFAAD5EgAgtQUAAAEAIAtPAADhCAAwUAAA5ggAMK8FAADiCAAwsAUAAOMIADCxBQAA5AgAILIFAADlCAAwswUAAOUIADC0BQAA5QgAMLUFAADlCAAwtgUAAOcIADC3BQAA6AgAMAkDAADWCAAgBAAA2AgAIAUCAAAAAY4EAQAAAAGPBAEAAAABpwQBAAAAAa0EAAAAsQQCsQRAAAAAAbIEQAAAAAECAAAAawAgTwAA7AgAIAMAAABrACBPAADsCAAgUAAA6wgAIAFIAAD4EgAwDwMAAPEHACAEAAD8BwAgBQIAywcAITIAAIgIACCLBAAAhggAMIwEAABpABCNBAAAhggAMI4EAQAAAAGPBAEAvwcAIacEAQC_BwAhrQQAAIcIsQQirwQBAL8HACGxBEAAwgcAIbIEQADBBwAhpAUAAIUIACACAAAAawAgSAAA6wgAIAIAAADpCAAgSAAA6ggAIAsFAgDLBwAhiwQAAOgIADCMBAAA6QgAEI0EAADoCAAwjgQBAL8HACGPBAEAvwcAIacEAQC_BwAhrQQAAIcIsQQirwQBAL8HACGxBEAAwgcAIbIEQADBBwAhCwUCAMsHACGLBAAA6AgAMIwEAADpCAAQjQQAAOgIADCOBAEAvwcAIY8EAQC_BwAhpwQBAL8HACGtBAAAhwixBCKvBAEAvwcAIbEEQADCBwAhsgRAAMEHACEHBQIA0QgAIY4EAQC7CAAhjwQBALsIACGnBAEAuwgAIa0EAADSCLEEIrEEQADHCAAhsgRAAL0IACEJAwAA0wgAIAQAANUIACAFAgDRCAAhjgQBALsIACGPBAEAuwgAIacEAQC7CAAhrQQAANIIsQQisQRAAMcIACGyBEAAvQgAIQkDAADWCAAgBAAA2AgAIAUCAAAAAY4EAQAAAAGPBAEAAAABpwQBAAAAAa0EAAAAsQQCsQRAAAAAAbIEQAAAAAEDTwAA9hIAIK8FAAD3EgAgtQUAAAEAIARPAADhCAAwrwUAAOIIADCxBQAA5AgAILUFAADlCAAwAAAAAAABsgUAAAC_BAIFTwAA6xIAIFAAAPQSACCvBQAA7BIAILAFAADzEgAgtQUAAAEAIAVPAADpEgAgUAAA8RIAIK8FAADqEgAgsAUAAPASACC1BQAArQEAIAVPAADnEgAgUAAA7hIAIK8FAADoEgAgsAUAAO0SACC1BQAABQAgA08AAOsSACCvBQAA7BIAILUFAAABACADTwAA6RIAIK8FAADqEgAgtQUAAK0BACADTwAA5xIAIK8FAADoEgAgtQUAAAUAIAAAAAAAAbIFAAAAxQQCBbIFAgAAAAG4BQIAAAABuQUCAAAAAboFAgAAAAG7BQIAAAABAbIFAAAAyAQCBU8AAOESACBQAADlEgAgrwUAAOISACCwBQAA5BIAILUFAAABACALTwAAhQkAMFAAAIoJADCvBQAAhgkAMLAFAACHCQAwsQUAAIgJACCyBQAAiQkAMLMFAACJCQAwtAUAAIkJADC1BQAAiQkAMLYFAACLCQAwtwUAAIwJADALAwAA-AgAIAQAAPoIACCOBAEAAAABjwQBAAAAAacEAQAAAAGtBAAAAL8EAr8EAgAAAAHABAEAAAABwQQBAAAAAcIEQAAAAAHDBEAAAAABAgAAAGUAIE8AAJAJACADAAAAZQAgTwAAkAkAIFAAAI8JACABSAAA4xIAMBADAADxBwAgBAAA_AcAIDAAAIsIACCLBAAAiQgAMIwEAABjABCNBAAAiQgAMI4EAQAAAAGPBAEAvwcAIacEAQC_BwAhrQQAAIoIvwQivQQBAL8HACG_BAIAywcAIcAEAQDDBwAhwQQBAMMHACHCBEAAwgcAIcMEQADBBwAhAgAAAGUAIEgAAI8JACACAAAAjQkAIEgAAI4JACANiwQAAIwJADCMBAAAjQkAEI0EAACMCQAwjgQBAL8HACGPBAEAvwcAIacEAQC_BwAhrQQAAIoIvwQivQQBAL8HACG_BAIAywcAIcAEAQDDBwAhwQQBAMMHACHCBEAAwgcAIcMEQADBBwAhDYsEAACMCQAwjAQAAI0JABCNBAAAjAkAMI4EAQC_BwAhjwQBAL8HACGnBAEAvwcAIa0EAACKCL8EIr0EAQC_BwAhvwQCAMsHACHABAEAwwcAIcEEAQDDBwAhwgRAAMIHACHDBEAAwQcAIQmOBAEAuwgAIY8EAQC7CAAhpwQBALsIACGtBAAA9Ai_BCK_BAIA0QgAIcAEAQC8CAAhwQQBALwIACHCBEAAxwgAIcMEQAC9CAAhCwMAAPUIACAEAAD3CAAgjgQBALsIACGPBAEAuwgAIacEAQC7CAAhrQQAAPQIvwQivwQCANEIACHABAEAvAgAIcEEAQC8CAAhwgRAAMcIACHDBEAAvQgAIQsDAAD4CAAgBAAA-ggAII4EAQAAAAGPBAEAAAABpwQBAAAAAa0EAAAAvwQCvwQCAAAAAcAEAQAAAAHBBAEAAAABwgRAAAAAAcMEQAAAAAEDTwAA4RIAIK8FAADiEgAgtQUAAAEAIARPAACFCQAwrwUAAIYJADCxBQAAiAkAILUFAACJCQAwAAAAAAABsgUAAADLBAIFTwAA1hIAIFAAAN8SACCvBQAA1xIAILAFAADeEgAgtQUAAAEAIAVPAADUEgAgUAAA3BIAIK8FAADVEgAgsAUAANsSACC1BQAAEQAgBU8AANISACBQAADZEgAgrwUAANMSACCwBQAA2BIAILUFAAAFACADTwAA1hIAIK8FAADXEgAgtQUAAAEAIANPAADUEgAgrwUAANUSACC1BQAAEQAgA08AANISACCvBQAA0xIAILUFAAAFACAAAAABsgUAAADRBAMFTwAAxxIAIFAAANASACCvBQAAyBIAILAFAADPEgAgtQUAAAEAIAVPAADFEgAgUAAAzRIAIK8FAADGEgAgsAUAAMwSACC1BQAAEQAgB08AAMMSACBQAADKEgAgrwUAAMQSACCwBQAAyRIAILMFAAADACC0BQAAAwAgtQUAAAUAIANPAADHEgAgrwUAAMgSACC1BQAAAQAgA08AAMUSACCvBQAAxhIAILUFAAARACADTwAAwxIAIK8FAADEEgAgtQUAAAUAIAAAAAAABU8AALgSACBQAADBEgAgrwUAALkSACCwBQAAwBIAILUFAAABACAFTwAAthIAIFAAAL4SACCvBQAAtxIAILAFAAC9EgAgtQUAABEAIAVPAAC0EgAgUAAAuxIAIK8FAAC1EgAgsAUAALoSACC1BQAABQAgA08AALgSACCvBQAAuRIAILUFAAABACADTwAAthIAIK8FAAC3EgAgtQUAABEAIANPAAC0EgAgrwUAALUSACC1BQAABQAgAAAABU8AAKkSACBQAACyEgAgrwUAAKoSACCwBQAAsRIAILUFAAABACAFTwAApxIAIFAAAK8SACCvBQAAqBIAILAFAACuEgAgtQUAABEAIAVPAAClEgAgUAAArBIAIK8FAACmEgAgsAUAAKsSACC1BQAABQAgA08AAKkSACCvBQAAqhIAILUFAAABACADTwAApxIAIK8FAACoEgAgtQUAABEAIANPAAClEgAgrwUAAKYSACC1BQAABQAgAAAAAAABsgUAAADRBAIBsgUAAADaBAIFsgUQAAAAAbgFEAAAAAG5BRAAAAABugUQAAAAAbsFEAAAAAEFTwAAgxIAIFAAAKMSACCvBQAAhBIAILAFAACiEgAgtQUAAAEAIAdPAACBEgAgUAAAoBIAIK8FAACCEgAgsAUAAJ8SACCzBQAAEwAgtAUAABMAILUFAAA-ACAHTwAA_xEAIFAAAJ0SACCvBQAAgBIAILAFAACcEgAgswUAAAMAILQFAAADACC1BQAABQAgB08AAP0RACBQAACaEgAgrwUAAP4RACCwBQAAmRIAILMFAAADACC0BQAAAwAgtQUAAAUAIAtPAACFCgAwUAAAigoAMK8FAACGCgAwsAUAAIcKADCxBQAAiAoAILIFAACJCgAwswUAAIkKADC0BQAAiQoAMLUFAACJCgAwtgUAAIsKADC3BQAAjAoAMAtPAAD5CQAwUAAA_gkAMK8FAAD6CQAwsAUAAPsJADCxBQAA_AkAILIFAAD9CQAwswUAAP0JADC0BQAA_QkAMLUFAAD9CQAwtgUAAP8JADC3BQAAgAoAMAtPAADtCQAwUAAA8gkAMK8FAADuCQAwsAUAAO8JADCxBQAA8AkAILIFAADxCQAwswUAAPEJADC0BQAA8QkAMLUFAADxCQAwtgUAAPMJADC3BQAA9AkAMAtPAADhCQAwUAAA5gkAMK8FAADiCQAwsAUAAOMJADCxBQAA5AkAILIFAADlCQAwswUAAOUJADC0BQAA5QkAMLUFAADlCQAwtgUAAOcJADC3BQAA6AkAMAtPAADOCQAwUAAA0wkAMK8FAADPCQAwsAUAANAJADCxBQAA0QkAILIFAADSCQAwswUAANIJADC0BQAA0gkAMLUFAADSCQAwtgUAANQJADC3BQAA1QkAMAsDAADeCQAgFAAA3wkAIBUAAOAJACCOBAEAAAABjwQBAAAAAZUEQAAAAAGpBAAAAOcEAs4EAgAAAAHkBAEAAAAB5QQBAAAAAecEAQAAAAECAAAAKgAgTwAA3QkAIAMAAAAqACBPAADdCQAgUAAA2QkAIAFIAACYEgAwEAMAAPEHACALAACgCAAgFAAA_AcAIBUAAPwHACCLBAAAnggAMIwEAAAoABCNBAAAnggAMI4EAQAAAAGPBAEAvwcAIZUEQADBBwAhqQQAAJ8I5wQiyAQBAPAHACHOBAIAywcAIeQEAQC_BwAh5QQBAL8HACHnBAEAwAcAIQIAAAAqACBIAADZCQAgAgAAANYJACBIAADXCQAgDIsEAADVCQAwjAQAANYJABCNBAAA1QkAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIakEAACfCOcEIsgEAQDwBwAhzgQCAMsHACHkBAEAvwcAIeUEAQC_BwAh5wQBAMAHACEMiwQAANUJADCMBAAA1gkAEI0EAADVCQAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhqQQAAJ8I5wQiyAQBAPAHACHOBAIAywcAIeQEAQC_BwAh5QQBAL8HACHnBAEAwAcAIQiOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGpBAAA2AnnBCLOBAIA0QgAIeQEAQC7CAAh5QQBALsIACHnBAEAuwgAIQGyBQAAAOcEAgsDAADaCQAgFAAA2wkAIBUAANwJACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGpBAAA2AnnBCLOBAIA0QgAIeQEAQC7CAAh5QQBALsIACHnBAEAuwgAIQVPAACNEgAgUAAAlhIAIK8FAACOEgAgsAUAAJUSACC1BQAAAQAgBU8AAIsSACBQAACTEgAgrwUAAIwSACCwBQAAkhIAILUFAAAFACAFTwAAiRIAIFAAAJASACCvBQAAihIAILAFAACPEgAgtQUAAAUAIAsDAADeCQAgFAAA3wkAIBUAAOAJACCOBAEAAAABjwQBAAAAAZUEQAAAAAGpBAAAAOcEAs4EAgAAAAHkBAEAAAAB5QQBAAAAAecEAQAAAAEDTwAAjRIAIK8FAACOEgAgtQUAAAEAIANPAACLEgAgrwUAAIwSACC1BQAABQAgA08AAIkSACCvBQAAihIAILUFAAAFACAKAwAApgkAIBIAAKgJACCOBAEAAAABjwQBAAAAAZAEAQAAAAGRBAEAAAABlQRAAAAAAcAEAQAAAAHRBAAAANEEA9IEAAAA0QQDAgAAACUAIE8AAOwJACADAAAAJQAgTwAA7AkAIFAAAOsJACABSAAAiBIAMA8DAADxBwAgCwAAowgAIBIAAIAIACCLBAAAoQgAMIwEAAAjABCNBAAAoQgAMI4EAQAAAAGPBAEAvwcAIZAEAQDwBwAhkQQBAMAHACGVBEAAwQcAIcAEAQDDBwAhyAQBAL8HACHRBAAAogjRBCPSBAAAogjRBCMCAAAAJQAgSAAA6wkAIAIAAADpCQAgSAAA6gkAIAyLBAAA6AkAMIwEAADpCQAQjQQAAOgJADCOBAEAvwcAIY8EAQC_BwAhkAQBAPAHACGRBAEAwAcAIZUEQADBBwAhwAQBAMMHACHIBAEAvwcAIdEEAACiCNEEI9IEAACiCNEEIwyLBAAA6AkAMIwEAADpCQAQjQQAAOgJADCOBAEAvwcAIY8EAQC_BwAhkAQBAPAHACGRBAEAwAcAIZUEQADBBwAhwAQBAMMHACHIBAEAvwcAIdEEAACiCNEEI9IEAACiCNEEIwiOBAEAuwgAIY8EAQC7CAAhkAQBALwIACGRBAEAuwgAIZUEQAC9CAAhwAQBALwIACHRBAAAognRBCPSBAAAognRBCMKAwAAowkAIBIAAKUJACCOBAEAuwgAIY8EAQC7CAAhkAQBALwIACGRBAEAuwgAIZUEQAC9CAAhwAQBALwIACHRBAAAognRBCPSBAAAognRBCMKAwAApgkAIBIAAKgJACCOBAEAAAABjwQBAAAAAZAEAQAAAAGRBAEAAAABlQRAAAAAAcAEAQAAAAHRBAAAANEEA9IEAAAA0QQDCgMAALEJACAQAACzCQAgjgQBAAAAAY8EAQAAAAGVBEAAAAAB0wQBAAAAAdQEAQAAAAHVBAEAAAAB1gQBAAAAAdcEAgAAAAECAAAAIQAgTwAA-AkAIAMAAAAhACBPAAD4CQAgUAAA9wkAIAFIAACHEgAwDwMAAPEHACALAACjCAAgEAAA_AcAIIsEAACkCAAwjAQAAB8AEI0EAACkCAAwjgQBAAAAAY8EAQC_BwAhlQRAAMEHACHIBAEAvwcAIdMEAQC_BwAh1AQBAMAHACHVBAEAwAcAIdYEAQDDBwAh1wQCAPUHACECAAAAIQAgSAAA9wkAIAIAAAD1CQAgSAAA9gkAIAyLBAAA9AkAMIwEAAD1CQAQjQQAAPQJADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACHIBAEAvwcAIdMEAQC_BwAh1AQBAMAHACHVBAEAwAcAIdYEAQDDBwAh1wQCAPUHACEMiwQAAPQJADCMBAAA9QkAEI0EAAD0CQAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhyAQBAL8HACHTBAEAvwcAIdQEAQDABwAh1QQBAMAHACHWBAEAwwcAIdcEAgD1BwAhCI4EAQC7CAAhjwQBALsIACGVBEAAvQgAIdMEAQC7CAAh1AQBALsIACHVBAEAuwgAIdYEAQC8CAAh1wQCAIEJACEKAwAArgkAIBAAALAJACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACHTBAEAuwgAIdQEAQC7CAAh1QQBALsIACHWBAEAvAgAIdcEAgCBCQAhCgMAALEJACAQAACzCQAgjgQBAAAAAY8EAQAAAAGVBEAAAAAB0wQBAAAAAdQEAQAAAAHVBAEAAAAB1gQBAAAAAdcEAgAAAAEIAwAAugkAIA4AALwJACCOBAEAAAABjwQBAAAAAZUEQAAAAAGrBAEAAAABvARAAAAAAdgEAQAAAAECAAAAHQAgTwAAhAoAIAMAAAAdACBPAACECgAgUAAAgwoAIAFIAACGEgAwDQMAAPEHACALAACjCAAgDgAA_AcAIIsEAAClCAAwjAQAABsAEI0EAAClCAAwjgQBAAAAAY8EAQC_BwAhlQRAAMEHACGrBAEAwAcAIbwEQADBBwAhyAQBAL8HACHYBAEAvwcAIQIAAAAdACBIAACDCgAgAgAAAIEKACBIAACCCgAgCosEAACACgAwjAQAAIEKABCNBAAAgAoAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIasEAQDABwAhvARAAMEHACHIBAEAvwcAIdgEAQC_BwAhCosEAACACgAwjAQAAIEKABCNBAAAgAoAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIasEAQDABwAhvARAAMEHACHIBAEAvwcAIdgEAQC_BwAhBo4EAQC7CAAhjwQBALsIACGVBEAAvQgAIasEAQC7CAAhvARAAL0IACHYBAEAuwgAIQgDAAC3CQAgDgAAuQkAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIasEAQC7CAAhvARAAL0IACHYBAEAuwgAIQgDAAC6CQAgDgAAvAkAII4EAQAAAAGPBAEAAAABlQRAAAAAAasEAQAAAAG8BEAAAAAB2AQBAAAAAQsDAACcCQAgDAAAngkAII4EAQAAAAGPBAEAAAABlQRAAAAAAckEAQAAAAHLBAAAAMsEAswEAgAAAAHNBAEAAAABzgQCAAAAAc8EAgAAAAECAAAAGQAgTwAAkAoAIAMAAAAZACBPAACQCgAgUAAAjwoAIAFIAACFEgAwEAMAAPEHACALAACjCAAgDAAA_AcAIIsEAACmCAAwjAQAABcAEI0EAACmCAAwjgQBAAAAAY8EAQC_BwAhlQRAAMEHACHIBAEAvwcAIckEAQC_BwAhywQAAKcIywQizAQCAPUHACHNBAEAwwcAIc4EAgDLBwAhzwQCAMsHACECAAAAGQAgSAAAjwoAIAIAAACNCgAgSAAAjgoAIA2LBAAAjAoAMIwEAACNCgAQjQQAAIwKADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACHIBAEAvwcAIckEAQC_BwAhywQAAKcIywQizAQCAPUHACHNBAEAwwcAIc4EAgDLBwAhzwQCAMsHACENiwQAAIwKADCMBAAAjQoAEI0EAACMCgAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhyAQBAL8HACHJBAEAvwcAIcsEAACnCMsEIswEAgD1BwAhzQQBAMMHACHOBAIAywcAIc8EAgDLBwAhCY4EAQC7CAAhjwQBALsIACGVBEAAvQgAIckEAQC7CAAhywQAAJgJywQizAQCAIEJACHNBAEAvAgAIc4EAgDRCAAhzwQCANEIACELAwAAmQkAIAwAAJsJACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACHJBAEAuwgAIcsEAACYCcsEIswEAgCBCQAhzQQBALwIACHOBAIA0QgAIc8EAgDRCAAhCwMAAJwJACAMAACeCQAgjgQBAAAAAY8EAQAAAAGVBEAAAAAByQQBAAAAAcsEAAAAywQCzAQCAAAAAc0EAQAAAAHOBAIAAAABzwQCAAAAAQNPAACDEgAgrwUAAIQSACC1BQAAAQAgA08AAIESACCvBQAAghIAILUFAAA-ACADTwAA_xEAIK8FAACAEgAgtQUAAAUAIANPAAD9EQAgrwUAAP4RACC1BQAABQAgBE8AAIUKADCvBQAAhgoAMLEFAACICgAgtQUAAIkKADAETwAA-QkAMK8FAAD6CQAwsQUAAPwJACC1BQAA_QkAMARPAADtCQAwrwUAAO4JADCxBQAA8AkAILUFAADxCQAwBE8AAOEJADCvBQAA4gkAMLEFAADkCQAgtQUAAOUJADAETwAAzgkAMK8FAADPCQAwsQUAANEJACC1BQAA0gkAMAAAAAAAB08AAPgRACBQAAD7EQAgrwUAAPkRACCwBQAA-hEAILMFAAAPACC0BQAADwAgtQUAABEAIANPAAD4EQAgrwUAAPkRACC1BQAAEQAgAAAABU8AAO0RACBQAAD2EQAgrwUAAO4RACCwBQAA9REAILUFAAABACAFTwAA6xEAIFAAAPMRACCvBQAA7BEAILAFAADyEQAgtQUAAAUAIAVPAADpEQAgUAAA8BEAIK8FAADqEQAgsAUAAO8RACC1BQAATQAgA08AAO0RACCvBQAA7hEAILUFAAABACADTwAA6xEAIK8FAADsEQAgtQUAAAUAIANPAADpEQAgrwUAAOoRACC1BQAATQAgAAAABU8AAOARACBQAADnEQAgrwUAAOERACCwBQAA5hEAILUFAAABACAHTwAA3hEAIFAAAOQRACCvBQAA3xEAILAFAADjEQAgswUAAE8AILQFAABPACC1BQAApQEAIAtPAACwCgAwUAAAtQoAMK8FAACxCgAwsAUAALIKADCxBQAAswoAILIFAAC0CgAwswUAALQKADC0BQAAtAoAMLUFAAC0CgAwtgUAALYKADC3BQAAtwoAMAYDAACnCgAgBAAAqAoAII4EAQAAAAGPBAEAAAABpwQBAAAAAegEQAAAAAECAAAAUwAgTwAAuwoAIAMAAABTACBPAAC7CgAgUAAAugoAIAFIAADiEQAwDAMAAPEHACAEAAD8BwAgJwAAkQgAIIsEAACQCAAwjAQAAFEAEI0EAACQCAAwjgQBAAAAAY8EAQC_BwAhpwQBAL8HACG7BAEAvwcAIegEQADBBwAhpQUAAI8IACACAAAAUwAgSAAAugoAIAIAAAC4CgAgSAAAuQoAIAiLBAAAtwoAMIwEAAC4CgAQjQQAALcKADCOBAEAvwcAIY8EAQC_BwAhpwQBAL8HACG7BAEAvwcAIegEQADBBwAhCIsEAAC3CgAwjAQAALgKABCNBAAAtwoAMI4EAQC_BwAhjwQBAL8HACGnBAEAvwcAIbsEAQC_BwAh6ARAAMEHACEEjgQBALsIACGPBAEAuwgAIacEAQC7CAAh6ARAAL0IACEGAwAApAoAIAQAAKUKACCOBAEAuwgAIY8EAQC7CAAhpwQBALsIACHoBEAAvQgAIQYDAACnCgAgBAAAqAoAII4EAQAAAAGPBAEAAAABpwQBAAAAAegEQAAAAAEDTwAA4BEAIK8FAADhEQAgtQUAAAEAIANPAADeEQAgrwUAAN8RACC1BQAApQEAIARPAACwCgAwrwUAALEKADCxBQAAswoAILUFAAC0CgAwAAAABU8AANMRACBQAADcEQAgrwUAANQRACCwBQAA2xEAILUFAAABACAFTwAA0REAIFAAANkRACCvBQAA0hEAILAFAADYEQAgtQUAAAUAIAVPAADPEQAgUAAA1hEAIK8FAADQEQAgsAUAANURACC1BQAApQEAIANPAADTEQAgrwUAANQRACC1BQAAAQAgA08AANERACCvBQAA0hEAILUFAAAFACADTwAAzxEAIK8FAADQEQAgtQUAAKUBACAAAAAAAAGyBQAAAO4EAgVPAADIEQAgUAAAzREAIK8FAADJEQAgsAUAAMwRACC1BQAAAQAgC08AAN0KADBQAADiCgAwrwUAAN4KADCwBQAA3woAMLEFAADgCgAgsgUAAOEKADCzBQAA4QoAMLQFAADhCgAwtQUAAOEKADC2BQAA4woAMLcFAADkCgAwC08AANEKADBQAADWCgAwrwUAANIKADCwBQAA0woAMLEFAADUCgAgsgUAANUKADCzBQAA1QoAMLQFAADVCgAwtQUAANUKADC2BQAA1woAMLcFAADYCgAwCAMAALwKACAoAAC-CgAgjgQBAAAAAY8EAQAAAAGVBEAAAAABswQBAAAAAcYEAQAAAAHpBAEAAAABAgAAAE0AIE8AANwKACADAAAATQAgTwAA3AoAIFAAANsKACABSAAAyxEAMA0DAADxBwAgJgAAkwgAICgAAOUHACCLBAAAkggAMIwEAABLABCNBAAAkggAMI4EAQAAAAGPBAEAvwcAIZUEQADBBwAhswQBAMMHACHGBAEAwwcAIekEAQDABwAh6gQBAPAHACECAAAATQAgSAAA2woAIAIAAADZCgAgSAAA2goAIAqLBAAA2AoAMIwEAADZCgAQjQQAANgKADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGzBAEAwwcAIcYEAQDDBwAh6QQBAMAHACHqBAEA8AcAIQqLBAAA2AoAMIwEAADZCgAQjQQAANgKADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGzBAEAwwcAIcYEAQDDBwAh6QQBAMAHACHqBAEA8AcAIQaOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGzBAEAvAgAIcYEAQC8CAAh6QQBALsIACEIAwAArQoAICgAAK8KACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGzBAEAvAgAIcYEAQC8CAAh6QQBALsIACEIAwAAvAoAICgAAL4KACCOBAEAAAABjwQBAAAAAZUEQAAAAAGzBAEAAAABxgQBAAAAAekEAQAAAAEHAwAAxQoAIAQAAMYKACAFgAAAAAGOBAEAAAABjwQBAAAAAacEAQAAAAHrBEAAAAABAgAAAEgAIE8AAOgKACADAAAASAAgTwAA6AoAIFAAAOcKACABSAAAyhEAMA0DAADxBwAgBAAA_AcAIAUAAPoHACAmAACWCAAgiwQAAJUIADCMBAAARgAQjQQAAJUIADCOBAEAAAABjwQBAL8HACGnBAEAvwcAIeoEAQC_BwAh6wRAAMEHACGmBQAAlAgAIAIAAABIACBIAADnCgAgAgAAAOUKACBIAADmCgAgCQUAAPoHACCLBAAA5AoAMIwEAADlCgAQjQQAAOQKADCOBAEAvwcAIY8EAQC_BwAhpwQBAL8HACHqBAEAvwcAIesEQADBBwAhCQUAAPoHACCLBAAA5AoAMIwEAADlCgAQjQQAAOQKADCOBAEAvwcAIY8EAQC_BwAhpwQBAL8HACHqBAEAvwcAIesEQADBBwAhBQWAAAAAAY4EAQC7CAAhjwQBALsIACGnBAEAuwgAIesEQAC9CAAhBwMAAMIKACAEAADDCgAgBYAAAAABjgQBALsIACGPBAEAuwgAIacEAQC7CAAh6wRAAL0IACEHAwAAxQoAIAQAAMYKACAFgAAAAAGOBAEAAAABjwQBAAAAAacEAQAAAAHrBEAAAAABA08AAMgRACCvBQAAyREAILUFAAABACAETwAA3QoAMK8FAADeCgAwsQUAAOAKACC1BQAA4QoAMARPAADRCgAwrwUAANIKADCxBQAA1AoAILUFAADVCgAwAAAAAAABsgUAAADyBAIFTwAAwBEAIFAAAMYRACCvBQAAwREAILAFAADFEQAgtQUAAAEAIAVPAAC-EQAgUAAAwxEAIK8FAAC_EQAgsAUAAMIRACC1BQAABQAgA08AAMARACCvBQAAwREAILUFAAABACADTwAAvhEAIK8FAAC_EQAgtQUAAAUAIAAAAAAABU8AALYRACBQAAC8EQAgrwUAALcRACCwBQAAuxEAILUFAAABACAFTwAAtBEAIFAAALkRACCvBQAAtREAILAFAAC4EQAgtQUAAAUAIANPAAC2EQAgrwUAALcRACC1BQAAAQAgA08AALQRACCvBQAAtREAILUFAAAFACAAAAAAAAVPAACsEQAgUAAAshEAIK8FAACtEQAgsAUAALERACC1BQAAAQAgBU8AAKoRACBQAACvEQAgrwUAAKsRACCwBQAArhEAILUFAAAFACADTwAArBEAIK8FAACtEQAgtQUAAAEAIANPAACqEQAgrwUAAKsRACC1BQAABQAgAAAAAbIFAAAAgQUCAbIFAAAAgwUCBU8AAJwRACBQAACoEQAgrwUAAJ0RACCwBQAApxEAILUFAAABACAHTwAAmhEAIFAAAKURACCvBQAAmxEAILAFAACkEQAgswUAABMAILQFAAATACC1BQAAPgAgBU8AAJgRACBQAACiEQAgrwUAAJkRACCwBQAAoREAILUFAAAFACAHTwAAlhEAIFAAAJ8RACCvBQAAlxEAILAFAACeEQAgswUAAAMAILQFAAADACC1BQAABQAgA08AAJwRACCvBQAAnREAILUFAAABACADTwAAmhEAIK8FAACbEQAgtQUAAD4AIANPAACYEQAgrwUAAJkRACC1BQAABQAgA08AAJYRACCvBQAAlxEAILUFAAAFACAAAAAAAAVPAACREQAgUAAAlBEAIK8FAACSEQAgsAUAAJMRACC1BQAAAQAgA08AAJERACCvBQAAkhEAILUFAAABACAAAAABsgUAAACMBQIFTwAAgxEAIFAAAI8RACCvBQAAhBEAILAFAACOEQAgtQUAAAEAIAVPAACBEQAgUAAAjBEAIK8FAACCEQAgsAUAAIsRACC1BQAAPgAgBU8AAP8QACBQAACJEQAgrwUAAIARACCwBQAAiBEAILUFAAAFACAHTwAA_RAAIFAAAIYRACCvBQAA_hAAILAFAACFEQAgswUAAAMAILQFAAADACC1BQAABQAgA08AAIMRACCvBQAAhBEAILUFAAABACADTwAAgREAIK8FAACCEQAgtQUAAD4AIANPAAD_EAAgrwUAAIARACC1BQAABQAgA08AAP0QACCvBQAA_hAAILUFAAAFACAAAAAFTwAA8hAAIFAAAPsQACCvBQAA8xAAILAFAAD6EAAgtQUAAAEAIAdPAADwEAAgUAAA-BAAIK8FAADxEAAgsAUAAPcQACCzBQAAAwAgtAUAAAMAILUFAAAFACALTwAAyAsAMFAAAM0LADCvBQAAyQsAMLAFAADKCwAwsQUAAMsLACCyBQAAzAsAMLMFAADMCwAwtAUAAMwLADC1BQAAzAsAMLYFAADOCwAwtwUAAM8LADALTwAAvAsAMFAAAMELADCvBQAAvQsAMLAFAAC-CwAwsQUAAL8LACCyBQAAwAsAMLMFAADACwAwtAUAAMALADC1BQAAwAsAMLYFAADCCwAwtwUAAMMLADALTwAAsAsAMFAAALULADCvBQAAsQsAMLAFAACyCwAwsQUAALMLACCyBQAAtAsAMLMFAAC0CwAwtAUAALQLADC1BQAAtAsAMLYFAAC2CwAwtwUAALcLADARAwAAkQsAIBkAAJMLACAaAACUCwAgjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACDBQL8BAEAAAAB_QQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKDBQEAAAABhAUBAAAAAYUFQAAAAAGGBUAAAAABhwVAAAAAAQIAAAA0ACBPAAC7CwAgAwAAADQAIE8AALsLACBQAAC6CwAgAUgAAPYQADAXAwAA8QcAIAgAAJ0IACAZAAD8BwAgGgAAgAgAIIsEAACaCAAwjAQAADIAEI0EAACaCAAwjgQBAAAAAY8EAQC_BwAhlQRAAMEHACGtBAAAnAiDBSLbBAEA8AcAIfwEAQDABwAh_QQBAMMHACH-BAEAwAcAIf8EAQDDBwAhgQUAAJsIgQUigwUBAL8HACGEBQEA8AcAIYUFQADBBwAhhgVAAMIHACGHBUAAwgcAIagFAACZCAAgAgAAADQAIEgAALoLACACAAAAuAsAIEgAALkLACASiwQAALcLADCMBAAAuAsAEI0EAAC3CwAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhrQQAAJwIgwUi2wQBAPAHACH8BAEAwAcAIf0EAQDDBwAh_gQBAMAHACH_BAEAwwcAIYEFAACbCIEFIoMFAQC_BwAhhAUBAPAHACGFBUAAwQcAIYYFQADCBwAhhwVAAMIHACESiwQAALcLADCMBAAAuAsAEI0EAAC3CwAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhrQQAAJwIgwUi2wQBAPAHACH8BAEAwAcAIf0EAQDDBwAh_gQBAMAHACH_BAEAwwcAIYEFAACbCIEFIoMFAQC_BwAhhAUBAPAHACGFBUAAwQcAIYYFQADCBwAhhwVAAMIHACEOjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAIwLgwUi_AQBALsIACH9BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKDBQEAuwgAIYQFAQC8CAAhhQVAAL0IACGGBUAAxwgAIYcFQADHCAAhEQMAAI0LACAZAACPCwAgGgAAkAsAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAACMC4MFIvwEAQC7CAAh_QQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUigwUBALsIACGEBQEAvAgAIYUFQAC9CAAhhgVAAMcIACGHBUAAxwgAIREDAACRCwAgGQAAkwsAIBoAAJQLACCOBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAIMFAvwEAQAAAAH9BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFAoMFAQAAAAGEBQEAAAABhQVAAAAAAYYFQAAAAAGHBUAAAAABHAMAAJEKACAFAgAAAAEJAACTCgAgCgAAlAoAIA0AAJUKACAPAACWCgAgEQAAlwoAIBMAAJgKACAWAACZCgAgjgQBAAAAAY8EAQAAAAGVBEAAAAABqgQBAAAAAa0EAAAA0QQCsQRAAAAAAbMEAQAAAAG2BAIAAAABtwQCAAAAAbwEQAAAAAHaBAAAANoEAtwEAQAAAAHdBAEAAAAB3gQQAAAAAd8EQAAAAAHgBEAAAAAB4QRAAAAAAeIEQAAAAAHjBAIAAAABAgAAABEAIE8AAMcLACADAAAAEQAgTwAAxwsAIFAAAMYLACABSAAA9RAAMCEDAADxBwAgBQIAywcAIQgAAJ0IACAJAACACAAgCgAAgAgAIA0AAN4HACAPAADfBwAgEQAA4AcAIBMAAOEHACAWAADmBwAgiwQAAKgIADCMBAAADwAQjQQAAKgIADCOBAEAAAABjwQBAL8HACGVBEAAwQcAIaoEAQDABwAhrQQAAKkI0QQisQRAAMIHACGzBAEAwwcAIbYEAgDLBwAhtwQCAMsHACG8BEAAwQcAIdoEAACqCNoEItsEAQDwBwAh3AQBAPAHACHdBAEA8AcAId4EEACrCAAh3wRAAMIHACHgBEAAwgcAIeEEQADCBwAh4gRAAMIHACHjBAIAywcAIQIAAAARACBIAADGCwAgAgAAAMQLACBIAADFCwAgGAUCAMsHACGLBAAAwwsAMIwEAADECwAQjQQAAMMLADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGqBAEAwAcAIa0EAACpCNEEIrEEQADCBwAhswQBAMMHACG2BAIAywcAIbcEAgDLBwAhvARAAMEHACHaBAAAqgjaBCLbBAEA8AcAIdwEAQDwBwAh3QQBAPAHACHeBBAAqwgAId8EQADCBwAh4ARAAMIHACHhBEAAwgcAIeIEQADCBwAh4wQCAMsHACEYBQIAywcAIYsEAADDCwAwjAQAAMQLABCNBAAAwwsAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIaoEAQDABwAhrQQAAKkI0QQisQRAAMIHACGzBAEAwwcAIbYEAgDLBwAhtwQCAMsHACG8BEAAwQcAIdoEAACqCNoEItsEAQDwBwAh3AQBAPAHACHdBAEA8AcAId4EEACrCAAh3wRAAMIHACHgBEAAwgcAIeEEQADCBwAh4gRAAMIHACHjBAIAywcAIRQFAgDRCAAhjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqgQBALsIACGtBAAAwgnRBCKxBEAAxwgAIbMEAQC8CAAhtgQCANEIACG3BAIA0QgAIbwEQAC9CAAh2gQAAMMJ2gQi3AQBALwIACHdBAEAvAgAId4EEADECQAh3wRAAMcIACHgBEAAxwgAIeEEQADHCAAh4gRAAMcIACHjBAIA0QgAIRwDAADFCQAgBQIA0QgAIQkAAMcJACAKAADICQAgDQAAyQkAIA8AAMoJACARAADLCQAgEwAAzAkAIBYAAM0JACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGqBAEAuwgAIa0EAADCCdEEIrEEQADHCAAhswQBALwIACG2BAIA0QgAIbcEAgDRCAAhvARAAL0IACHaBAAAwwnaBCLcBAEAvAgAId0EAQC8CAAh3gQQAMQJACHfBEAAxwgAIeAEQADHCAAh4QRAAMcIACHiBEAAxwgAIeMEAgDRCAAhHAMAAJEKACAFAgAAAAEJAACTCgAgCgAAlAoAIA0AAJUKACAPAACWCgAgEQAAlwoAIBMAAJgKACAWAACZCgAgjgQBAAAAAY8EAQAAAAGVBEAAAAABqgQBAAAAAa0EAAAA0QQCsQRAAAAAAbMEAQAAAAG2BAIAAAABtwQCAAAAAbwEQAAAAAHaBAAAANoEAtwEAQAAAAHdBAEAAAAB3gQQAAAAAd8EQAAAAAHgBEAAAAAB4QRAAAAAAeIEQAAAAAHjBAIAAAABCQMAAKQLACAEAACmCwAgHAAApwsAII4EAQAAAAGPBAEAAAABpwQBAAAAAbIEQAAAAAGBBQAAAIwFAooFAQAAAAECAAAACwAgTwAA0wsAIAMAAAALACBPAADTCwAgUAAA0gsAIAFIAAD0EAAwEAMAAPEHACAEAAD8BwAgCAAAsAgAIBwAAIAIACCLBAAArggAMIwEAAAJABCNBAAArggAMI4EAQAAAAGPBAEAvwcAIacEAQC_BwAhsgRAAMEHACHbBAEAvwcAIYEFAACvCIwFIooFAQDwBwAhqQUAAKwIACCqBQAArQgAIAIAAAALACBIAADSCwAgAgAAANALACBIAADRCwAgCosEAADPCwAwjAQAANALABCNBAAAzwsAMI4EAQC_BwAhjwQBAL8HACGnBAEAvwcAIbIEQADBBwAh2wQBAL8HACGBBQAArwiMBSKKBQEA8AcAIQqLBAAAzwsAMIwEAADQCwAQjQQAAM8LADCOBAEAvwcAIY8EAQC_BwAhpwQBAL8HACGyBEAAwQcAIdsEAQC_BwAhgQUAAK8IjAUiigUBAPAHACEGjgQBALsIACGPBAEAuwgAIacEAQC7CAAhsgRAAL0IACGBBQAAnwuMBSKKBQEAvAgAIQkDAACgCwAgBAAAogsAIBwAAKMLACCOBAEAuwgAIY8EAQC7CAAhpwQBALsIACGyBEAAvQgAIYEFAACfC4wFIooFAQC8CAAhCQMAAKQLACAEAACmCwAgHAAApwsAII4EAQAAAAGPBAEAAAABpwQBAAAAAbIEQAAAAAGBBQAAAIwFAooFAQAAAAEDTwAA8hAAIK8FAADzEAAgtQUAAAEAIANPAADwEAAgrwUAAPEQACC1BQAABQAgBE8AAMgLADCvBQAAyQsAMLEFAADLCwAgtQUAAMwLADAETwAAvAsAMK8FAAC9CwAwsQUAAL8LACC1BQAAwAsAMARPAACwCwAwrwUAALELADCxBQAAswsAILUFAAC0CwAwAAAABU8AAOsQACBQAADuEAAgrwUAAOwQACCwBQAA7RAAILUFAAAFACADTwAA6xAAIK8FAADsEAAgtQUAAAUAIAAAAAAAAAAAAbIFAAAAkQUCAAAAAbIFAAAAmQUCBU8AANAQACBQAADpEAAgrwUAANEQACCwBQAA6BAAILUFAAABACAHTwAA2w0AIFAAAN4NACCvBQAA3A0AILAFAADdDQAgswUAAAcAILQFAAAHACC1BQAAmwEAIAtPAADSDQAwUAAA1g0AMK8FAADTDQAwsAUAANQNADCxBQAA1Q0AILIFAADMCwAwswUAAMwLADC0BQAAzAsAMLUFAADMCwAwtgUAANcNADC3BQAAzwsAMAtPAADJDQAwUAAAzQ0AMK8FAADKDQAwsAUAAMsNADCxBQAAzA0AILIFAADMCwAwswUAAMwLADC0BQAAzAsAMLUFAADMCwAwtgUAAM4NADC3BQAAzwsAMAtPAAC9DQAwUAAAwg0AMK8FAAC-DQAwsAUAAL8NADCxBQAAwA0AILIFAADBDQAwswUAAMENADC0BQAAwQ0AMLUFAADBDQAwtgUAAMMNADC3BQAAxA0AMAtPAAC0DQAwUAAAuA0AMK8FAAC1DQAwsAUAALYNADCxBQAAtw0AILIFAADACwAwswUAAMALADC0BQAAwAsAMLUFAADACwAwtgUAALkNADC3BQAAwwsAMAtPAACrDQAwUAAArw0AMK8FAACsDQAwsAUAAK0NADCxBQAArg0AILIFAADACwAwswUAAMALADC0BQAAwAsAMLUFAADACwAwtgUAALANADC3BQAAwwsAMAtPAACiDQAwUAAApg0AMK8FAACjDQAwsAUAAKQNADCxBQAApQ0AILIFAAD9CQAwswUAAP0JADC0BQAA_QkAMLUFAAD9CQAwtgUAAKcNADC3BQAAgAoAMAtPAACZDQAwUAAAnQ0AMK8FAACaDQAwsAUAAJsNADCxBQAAnA0AILIFAADxCQAwswUAAPEJADC0BQAA8QkAMLUFAADxCQAwtgUAAJ4NADC3BQAA9AkAMAtPAACQDQAwUAAAlA0AMK8FAACRDQAwsAUAAJINADCxBQAAkw0AILIFAADlCQAwswUAAOUJADC0BQAA5QkAMLUFAADlCQAwtgUAAJUNADC3BQAA6AkAMAtPAACHDQAwUAAAiw0AMK8FAACIDQAwsAUAAIkNADCxBQAAig0AILIFAACJCgAwswUAAIkKADC0BQAAiQoAMLUFAACJCgAwtgUAAIwNADC3BQAAjAoAMAtPAAD-DAAwUAAAgg0AMK8FAAD_DAAwsAUAAIANADCxBQAAgQ0AILIFAADhCgAwswUAAOEKADC0BQAA4QoAMLUFAADhCgAwtgUAAIMNADC3BQAA5AoAMAtPAAD1DAAwUAAA-QwAMK8FAAD2DAAwsAUAAPcMADCxBQAA-AwAILIFAAC0CgAwswUAALQKADC0BQAAtAoAMLUFAAC0CgAwtgUAAPoMADC3BQAAtwoAMAtPAADpDAAwUAAA7gwAMK8FAADqDAAwsAUAAOsMADCxBQAA7AwAILIFAADtDAAwswUAAO0MADC0BQAA7QwAMLUFAADtDAAwtgUAAO8MADC3BQAA8AwAMAtPAADdDAAwUAAA4gwAMK8FAADeDAAwsAUAAN8MADCxBQAA4AwAILIFAADhDAAwswUAAOEMADC0BQAA4QwAMLUFAADhDAAwtgUAAOMMADC3BQAA5AwAMAtPAADUDAAwUAAA2AwAMK8FAADVDAAwsAUAANYMADCxBQAA1wwAILIFAADSCQAwswUAANIJADC0BQAA0gkAMLUFAADSCQAwtgUAANkMADC3BQAA1QkAMAtPAADLDAAwUAAAzwwAMK8FAADMDAAwsAUAAM0MADCxBQAAzgwAILIFAADSCQAwswUAANIJADC0BQAA0gkAMLUFAADSCQAwtgUAANAMADC3BQAA1QkAMAtPAADCDAAwUAAAxgwAMK8FAADDDAAwsAUAAMQMADCxBQAAxQwAILIFAACJCQAwswUAAIkJADC0BQAAiQkAMLUFAACJCQAwtgUAAMcMADC3BQAAjAkAMAtPAAC5DAAwUAAAvQwAMK8FAAC6DAAwsAUAALsMADCxBQAAvAwAILIFAADlCAAwswUAAOUIADC0BQAA5QgAMLUFAADlCAAwtgUAAL4MADC3BQAA6AgAMAtPAACtDAAwUAAAsgwAMK8FAACuDAAwsAUAAK8MADCxBQAAsAwAILIFAACxDAAwswUAALEMADC0BQAAsQwAMLUFAACxDAAwtgUAALMMADC3BQAAtAwAMAtPAAChDAAwUAAApgwAMK8FAACiDAAwsAUAAKMMADCxBQAApAwAILIFAAClDAAwswUAAKUMADC0BQAApQwAMLUFAAClDAAwtgUAAKcMADC3BQAAqAwAMAtPAACVDAAwUAAAmgwAMK8FAACWDAAwsAUAAJcMADCxBQAAmAwAILIFAACZDAAwswUAAJkMADC0BQAAmQwAMLUFAACZDAAwtgUAAJsMADC3BQAAnAwAMAtPAACMDAAwUAAAkAwAMK8FAACNDAAwsAUAAI4MADCxBQAAjwwAILIFAAC0CwAwswUAALQLADC0BQAAtAsAMLUFAAC0CwAwtgUAAJEMADC3BQAAtwsAMAtPAACDDAAwUAAAhwwAMK8FAACEDAAwsAUAAIUMADCxBQAAhgwAILIFAAC0CwAwswUAALQLADC0BQAAtAsAMLUFAAC0CwAwtgUAAIgMADC3BQAAtwsAMBEDAACRCwAgCAAAkgsAIBkAAJMLACCOBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAIMFAtsEAQAAAAH8BAEAAAAB_QQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKDBQEAAAABhQVAAAAAAYYFQAAAAAGHBUAAAAABAgAAADQAIE8AAIsMACADAAAANAAgTwAAiwwAIFAAAIoMACABSAAA5xAAMAIAAAA0ACBIAACKDAAgAgAAALgLACBIAACJDAAgDo4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAACMC4MFItsEAQC8CAAh_AQBALsIACH9BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKDBQEAuwgAIYUFQAC9CAAhhgVAAMcIACGHBUAAxwgAIREDAACNCwAgCAAAjgsAIBkAAI8LACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAAjAuDBSLbBAEAvAgAIfwEAQC7CAAh_QQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUigwUBALsIACGFBUAAvQgAIYYFQADHCAAhhwVAAMcIACERAwAAkQsAIAgAAJILACAZAACTCwAgjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACDBQLbBAEAAAAB_AQBAAAAAf0EAQAAAAH-BAEAAAAB_wQBAAAAAYEFAAAAgQUCgwUBAAAAAYUFQAAAAAGGBUAAAAABhwVAAAAAAREDAACRCwAgCAAAkgsAIBoAAJQLACCOBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAIMFAtsEAQAAAAH8BAEAAAAB_QQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKEBQEAAAABhQVAAAAAAYYFQAAAAAGHBUAAAAABAgAAADQAIE8AAJQMACADAAAANAAgTwAAlAwAIFAAAJMMACABSAAA5hAAMAIAAAA0ACBIAACTDAAgAgAAALgLACBIAACSDAAgDo4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAACMC4MFItsEAQC8CAAh_AQBALsIACH9BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKEBQEAvAgAIYUFQAC9CAAhhgVAAMcIACGHBUAAxwgAIREDAACNCwAgCAAAjgsAIBoAAJALACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAAjAuDBSLbBAEAvAgAIfwEAQC7CAAh_QQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUihAUBALwIACGFBUAAvQgAIYYFQADHCAAhhwVAAMcIACERAwAAkQsAIAgAAJILACAaAACUCwAgjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACDBQLbBAEAAAAB_AQBAAAAAf0EAQAAAAH-BAEAAAAB_wQBAAAAAYEFAAAAgQUChAUBAAAAAYUFQAAAAAGGBUAAAAABhwVAAAAAAQkDAADACAAgSIAAAAABjgQBAAAAAY8EAQAAAAGRBAEAAAABkgQBAAAAAZMEAQAAAAGUBAEAAAABlQRAAAAAAQIAAAB5ACBPAACgDAAgAwAAAHkAIE8AAKAMACBQAACfDAAgAUgAAOUQADAOAwAA8QcAIBIAAIAIACBIAAD6BwAgiwQAAP8HADCMBAAAdwAQjQQAAP8HADCOBAEAAAABjwQBAL8HACGQBAEA8AcAIZEEAQDABwAhkgQBAMMHACGTBAEAwwcAIZQEAQDDBwAhlQRAAMEHACECAAAAeQAgSAAAnwwAIAIAAACdDAAgSAAAngwAIAxIAAD6BwAgiwQAAJwMADCMBAAAnQwAEI0EAACcDAAwjgQBAL8HACGPBAEAvwcAIZAEAQDwBwAhkQQBAMAHACGSBAEAwwcAIZMEAQDDBwAhlAQBAMMHACGVBEAAwQcAIQxIAAD6BwAgiwQAAJwMADCMBAAAnQwAEI0EAACcDAAwjgQBAL8HACGPBAEAvwcAIZAEAQDwBwAhkQQBAMAHACGSBAEAwwcAIZMEAQDDBwAhlAQBAMMHACGVBEAAwQcAIQhIgAAAAAGOBAEAuwgAIY8EAQC7CAAhkQQBALsIACGSBAEAvAgAIZMEAQC8CAAhlAQBALwIACGVBEAAvQgAIQkDAAC-CAAgSIAAAAABjgQBALsIACGPBAEAuwgAIZEEAQC7CAAhkgQBALwIACGTBAEAvAgAIZQEAQC8CAAhlQRAAL0IACEJAwAAwAgAIEiAAAAAAY4EAQAAAAGPBAEAAAABkQQBAAAAAZIEAQAAAAGTBAEAAAABlAQBAAAAAZUEQAAAAAEGjgQBAAAAAZQEAQAAAAGVBEAAAAABhQVAAAAAAYcFQAAAAAGOBQEAAAABAgAAAHUAIE8AAKwMACADAAAAdQAgTwAArAwAIFAAAKsMACABSAAA5BAAMAsEAAD8BwAgiwQAAIEIADCMBAAAcwAQjQQAAIEIADCOBAEAAAABlAQBAMMHACGVBEAAwQcAIacEAQC_BwAhhQVAAMEHACGHBUAAwgcAIY4FAQDDBwAhAgAAAHUAIEgAAKsMACACAAAAqQwAIEgAAKoMACAKiwQAAKgMADCMBAAAqQwAEI0EAACoDAAwjgQBAL8HACGUBAEAwwcAIZUEQADBBwAhpwQBAL8HACGFBUAAwQcAIYcFQADCBwAhjgUBAMMHACEKiwQAAKgMADCMBAAAqQwAEI0EAACoDAAwjgQBAL8HACGUBAEAwwcAIZUEQADBBwAhpwQBAL8HACGFBUAAwQcAIYcFQADCBwAhjgUBAMMHACEGjgQBALsIACGUBAEAvAgAIZUEQAC9CAAhhQVAAL0IACGHBUAAxwgAIY4FAQC8CAAhBo4EAQC7CAAhlAQBALwIACGVBEAAvQgAIYUFQAC9CAAhhwVAAMcIACGOBQEAvAgAIQaOBAEAAAABlAQBAAAAAZUEQAAAAAGFBUAAAAABhwVAAAAAAY4FAQAAAAEKAwAAyggAIEiAAAAAAY4EAQAAAAGPBAEAAAABlQRAAAAAAakEAAAAqQQCqgQBAAAAAasEAQAAAAGtBAAAAK0EAq4EQAAAAAECAAAAcQAgTwAAuAwAIAMAAABxACBPAAC4DAAgUAAAtwwAIAFIAADjEAAwDwMAAPEHACAEAAD8BwAgSAAA-gcAIIsEAACCCAAwjAQAAG8AEI0EAACCCAAwjgQBAAAAAY8EAQC_BwAhlQRAAMEHACGnBAEAvwcAIakEAACDCKkEIqoEAQDABwAhqwQBAMMHACGtBAAAhAitBCKuBEAAwgcAIQIAAABxACBIAAC3DAAgAgAAALUMACBIAAC2DAAgDUgAAPoHACCLBAAAtAwAMIwEAAC1DAAQjQQAALQMADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGnBAEAvwcAIakEAACDCKkEIqoEAQDABwAhqwQBAMMHACGtBAAAhAitBCKuBEAAwgcAIQ1IAAD6BwAgiwQAALQMADCMBAAAtQwAEI0EAAC0DAAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhpwQBAL8HACGpBAAAgwipBCKqBAEAwAcAIasEAQDDBwAhrQQAAIQIrQQirgRAAMIHACEJSIAAAAABjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqQQAAMUIqQQiqgQBALsIACGrBAEAvAgAIa0EAADGCK0EIq4EQADHCAAhCgMAAMgIACBIgAAAAAGOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGpBAAAxQipBCKqBAEAuwgAIasEAQC8CAAhrQQAAMYIrQQirgRAAMcIACEKAwAAyggAIEiAAAAAAY4EAQAAAAGPBAEAAAABlQRAAAAAAakEAAAAqQQCqgQBAAAAAasEAQAAAAGtBAAAAK0EAq4EQAAAAAEJAwAA1ggAIAUCAAAAATIAANcIACCOBAEAAAABjwQBAAAAAa0EAAAAsQQCrwQBAAAAAbEEQAAAAAGyBEAAAAABAgAAAGsAIE8AAMEMACADAAAAawAgTwAAwQwAIFAAAMAMACABSAAA4hAAMAIAAABrACBIAADADAAgAgAAAOkIACBIAAC_DAAgBwUCANEIACGOBAEAuwgAIY8EAQC7CAAhrQQAANIIsQQirwQBALsIACGxBEAAxwgAIbIEQAC9CAAhCQMAANMIACAFAgDRCAAhMgAA1AgAII4EAQC7CAAhjwQBALsIACGtBAAA0gixBCKvBAEAuwgAIbEEQADHCAAhsgRAAL0IACEJAwAA1ggAIAUCAAAAATIAANcIACCOBAEAAAABjwQBAAAAAa0EAAAAsQQCrwQBAAAAAbEEQAAAAAGyBEAAAAABCwMAAPgIACAwAAD5CAAgjgQBAAAAAY8EAQAAAAGtBAAAAL8EAr0EAQAAAAG_BAIAAAABwAQBAAAAAcEEAQAAAAHCBEAAAAABwwRAAAAAAQIAAABlACBPAADKDAAgAwAAAGUAIE8AAMoMACBQAADJDAAgAUgAAOEQADACAAAAZQAgSAAAyQwAIAIAAACNCQAgSAAAyAwAIAmOBAEAuwgAIY8EAQC7CAAhrQQAAPQIvwQivQQBALsIACG_BAIA0QgAIcAEAQC8CAAhwQQBALwIACHCBEAAxwgAIcMEQAC9CAAhCwMAAPUIACAwAAD2CAAgjgQBALsIACGPBAEAuwgAIa0EAAD0CL8EIr0EAQC7CAAhvwQCANEIACHABAEAvAgAIcEEAQC8CAAhwgRAAMcIACHDBEAAvQgAIQsDAAD4CAAgMAAA-QgAII4EAQAAAAGPBAEAAAABrQQAAAC_BAK9BAEAAAABvwQCAAAAAcAEAQAAAAHBBAEAAAABwgRAAAAAAcMEQAAAAAELAwAA3gkAIAsAAKAKACAUAADfCQAgjgQBAAAAAY8EAQAAAAGVBEAAAAABqQQAAADnBALIBAEAAAABzgQCAAAAAeQEAQAAAAHnBAEAAAABAgAAACoAIE8AANMMACADAAAAKgAgTwAA0wwAIFAAANIMACABSAAA4BAAMAIAAAAqACBIAADSDAAgAgAAANYJACBIAADRDAAgCI4EAQC7CAAhjwQBALsIACGVBEAAvQgAIakEAADYCecEIsgEAQC8CAAhzgQCANEIACHkBAEAuwgAIecEAQC7CAAhCwMAANoJACALAACfCgAgFAAA2wkAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIakEAADYCecEIsgEAQC8CAAhzgQCANEIACHkBAEAuwgAIecEAQC7CAAhCwMAAN4JACALAACgCgAgFAAA3wkAII4EAQAAAAGPBAEAAAABlQRAAAAAAakEAAAA5wQCyAQBAAAAAc4EAgAAAAHkBAEAAAAB5wQBAAAAAQsDAADeCQAgCwAAoAoAIBUAAOAJACCOBAEAAAABjwQBAAAAAZUEQAAAAAGpBAAAAOcEAsgEAQAAAAHOBAIAAAAB5QQBAAAAAecEAQAAAAECAAAAKgAgTwAA3AwAIAMAAAAqACBPAADcDAAgUAAA2wwAIAFIAADfEAAwAgAAACoAIEgAANsMACACAAAA1gkAIEgAANoMACAIjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqQQAANgJ5wQiyAQBALwIACHOBAIA0QgAIeUEAQC7CAAh5wQBALsIACELAwAA2gkAIAsAAJ8KACAVAADcCQAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqQQAANgJ5wQiyAQBALwIACHOBAIA0QgAIeUEAQC7CAAh5wQBALsIACELAwAA3gkAIAsAAKAKACAVAADgCQAgjgQBAAAAAY8EAQAAAAGVBEAAAAABqQQAAADnBALIBAEAAAABzgQCAAAAAeUEAQAAAAHnBAEAAAABCQMAAPQKACCOBAEAAAABjwQBAAAAAZUEQAAAAAHwBAIAAAAB8gQAAADyBALzBAEAAAAB9AQBAAAAAfUEAQAAAAECAAAAXwAgTwAA6AwAIAMAAABfACBPAADoDAAgUAAA5wwAIAFIAADeEAAwDgMAAPEHACAEAAD8BwAgiwQAAIwIADCMBAAAXQAQjQQAAIwIADCOBAEAAAABjwQBAL8HACGVBEAAwQcAIacEAQC_BwAh8AQCAMsHACHyBAAAjQjyBCLzBAEAwwcAIfQEAQDDBwAh9QQBAPAHACECAAAAXwAgSAAA5wwAIAIAAADlDAAgSAAA5gwAIAyLBAAA5AwAMIwEAADlDAAQjQQAAOQMADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGnBAEAvwcAIfAEAgDLBwAh8gQAAI0I8gQi8wQBAMMHACH0BAEAwwcAIfUEAQDwBwAhDIsEAADkDAAwjAQAAOUMABCNBAAA5AwAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIacEAQC_BwAh8AQCAMsHACHyBAAAjQjyBCLzBAEAwwcAIfQEAQDDBwAh9QQBAPAHACEIjgQBALsIACGPBAEAuwgAIZUEQAC9CAAh8AQCANEIACHyBAAA8QryBCLzBAEAvAgAIfQEAQC8CAAh9QQBALwIACEJAwAA8goAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIfAEAgDRCAAh8gQAAPEK8gQi8wQBALwIACH0BAEAvAgAIfUEAQC8CAAhCQMAAPQKACCOBAEAAAABjwQBAAAAAZUEQAAAAAHwBAIAAAAB8gQAAADyBALzBAEAAAAB9AQBAAAAAfUEAQAAAAEJAwAA_QoAII4EAQAAAAGPBAEAAAABlQRAAAAAAfAEAgAAAAHyBAAAAPIEAvMEAQAAAAH0BAEAAAAB9QQBAAAAAQIAAABbACBPAAD0DAAgAwAAAFsAIE8AAPQMACBQAADzDAAgAUgAAN0QADAOAwAA8QcAIAQAAPwHACCLBAAAjggAMIwEAABZABCNBAAAjggAMI4EAQAAAAGPBAEAvwcAIZUEQADBBwAhpwQBAL8HACHwBAIAywcAIfIEAACNCPIEIvMEAQDDBwAh9AQBAMMHACH1BAEA8AcAIQIAAABbACBIAADzDAAgAgAAAPEMACBIAADyDAAgDIsEAADwDAAwjAQAAPEMABCNBAAA8AwAMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIacEAQC_BwAh8AQCAMsHACHyBAAAjQjyBCLzBAEAwwcAIfQEAQDDBwAh9QQBAPAHACEMiwQAAPAMADCMBAAA8QwAEI0EAADwDAAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhpwQBAL8HACHwBAIAywcAIfIEAACNCPIEIvMEAQDDBwAh9AQBAMMHACH1BAEA8AcAIQiOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACHwBAIA0QgAIfIEAADxCvIEIvMEAQC8CAAh9AQBALwIACH1BAEAvAgAIQkDAAD7CgAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAh8AQCANEIACHyBAAA8QryBCLzBAEAvAgAIfQEAQC8CAAh9QQBALwIACEJAwAA_QoAII4EAQAAAAGPBAEAAAABlQRAAAAAAfAEAgAAAAHyBAAAAPIEAvMEAQAAAAH0BAEAAAAB9QQBAAAAAQYDAACnCgAgJwAAqQoAII4EAQAAAAGPBAEAAAABuwQBAAAAAegEQAAAAAECAAAAUwAgTwAA_QwAIAMAAABTACBPAAD9DAAgUAAA_AwAIAFIAADcEAAwAgAAAFMAIEgAAPwMACACAAAAuAoAIEgAAPsMACAEjgQBALsIACGPBAEAuwgAIbsEAQC7CAAh6ARAAL0IACEGAwAApAoAICcAAKYKACCOBAEAuwgAIY8EAQC7CAAhuwQBALsIACHoBEAAvQgAIQYDAACnCgAgJwAAqQoAII4EAQAAAAGPBAEAAAABuwQBAAAAAegEQAAAAAEHAwAAxQoAIAWAAAAAASYAAMcKACCOBAEAAAABjwQBAAAAAeoEAQAAAAHrBEAAAAABAgAAAEgAIE8AAIYNACADAAAASAAgTwAAhg0AIFAAAIUNACABSAAA2xAAMAIAAABIACBIAACFDQAgAgAAAOUKACBIAACEDQAgBQWAAAAAAY4EAQC7CAAhjwQBALsIACHqBAEAuwgAIesEQAC9CAAhBwMAAMIKACAFgAAAAAEmAADECgAgjgQBALsIACGPBAEAuwgAIeoEAQC7CAAh6wRAAL0IACEHAwAAxQoAIAWAAAAAASYAAMcKACCOBAEAAAABjwQBAAAAAeoEAQAAAAHrBEAAAAABCwMAAJwJACALAACdCQAgjgQBAAAAAY8EAQAAAAGVBEAAAAAByAQBAAAAAcsEAAAAywQCzAQCAAAAAc0EAQAAAAHOBAIAAAABzwQCAAAAAQIAAAAZACBPAACPDQAgAwAAABkAIE8AAI8NACBQAACODQAgAUgAANoQADACAAAAGQAgSAAAjg0AIAIAAACNCgAgSAAAjQ0AIAmOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACHIBAEAuwgAIcsEAACYCcsEIswEAgCBCQAhzQQBALwIACHOBAIA0QgAIc8EAgDRCAAhCwMAAJkJACALAACaCQAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhyAQBALsIACHLBAAAmAnLBCLMBAIAgQkAIc0EAQC8CAAhzgQCANEIACHPBAIA0QgAIQsDAACcCQAgCwAAnQkAII4EAQAAAAGPBAEAAAABlQRAAAAAAcgEAQAAAAHLBAAAAMsEAswEAgAAAAHNBAEAAAABzgQCAAAAAc8EAgAAAAEKAwAApgkAIAsAAKcJACCOBAEAAAABjwQBAAAAAZEEAQAAAAGVBEAAAAABwAQBAAAAAcgEAQAAAAHRBAAAANEEA9IEAAAA0QQDAgAAACUAIE8AAJgNACADAAAAJQAgTwAAmA0AIFAAAJcNACABSAAA2RAAMAIAAAAlACBIAACXDQAgAgAAAOkJACBIAACWDQAgCI4EAQC7CAAhjwQBALsIACGRBAEAuwgAIZUEQAC9CAAhwAQBALwIACHIBAEAuwgAIdEEAACiCdEEI9IEAACiCdEEIwoDAACjCQAgCwAApAkAII4EAQC7CAAhjwQBALsIACGRBAEAuwgAIZUEQAC9CAAhwAQBALwIACHIBAEAuwgAIdEEAACiCdEEI9IEAACiCdEEIwoDAACmCQAgCwAApwkAII4EAQAAAAGPBAEAAAABkQQBAAAAAZUEQAAAAAHABAEAAAAByAQBAAAAAdEEAAAA0QQD0gQAAADRBAMKAwAAsQkAIAsAALIJACCOBAEAAAABjwQBAAAAAZUEQAAAAAHIBAEAAAAB1AQBAAAAAdUEAQAAAAHWBAEAAAAB1wQCAAAAAQIAAAAhACBPAAChDQAgAwAAACEAIE8AAKENACBQAACgDQAgAUgAANgQADACAAAAIQAgSAAAoA0AIAIAAAD1CQAgSAAAnw0AIAiOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACHIBAEAuwgAIdQEAQC7CAAh1QQBALsIACHWBAEAvAgAIdcEAgCBCQAhCgMAAK4JACALAACvCQAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhyAQBALsIACHUBAEAuwgAIdUEAQC7CAAh1gQBALwIACHXBAIAgQkAIQoDAACxCQAgCwAAsgkAII4EAQAAAAGPBAEAAAABlQRAAAAAAcgEAQAAAAHUBAEAAAAB1QQBAAAAAdYEAQAAAAHXBAIAAAABCAMAALoJACALAAC7CQAgjgQBAAAAAY8EAQAAAAGVBEAAAAABqwQBAAAAAbwEQAAAAAHIBAEAAAABAgAAAB0AIE8AAKoNACADAAAAHQAgTwAAqg0AIFAAAKkNACABSAAA1xAAMAIAAAAdACBIAACpDQAgAgAAAIEKACBIAACoDQAgBo4EAQC7CAAhjwQBALsIACGVBEAAvQgAIasEAQC7CAAhvARAAL0IACHIBAEAuwgAIQgDAAC3CQAgCwAAuAkAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIasEAQC7CAAhvARAAL0IACHIBAEAuwgAIQgDAAC6CQAgCwAAuwkAII4EAQAAAAGPBAEAAAABlQRAAAAAAasEAQAAAAG8BEAAAAAByAQBAAAAARwDAACRCgAgBQIAAAABCAAAkgoAIAkAAJMKACANAACVCgAgDwAAlgoAIBEAAJcKACATAACYCgAgFgAAmQoAII4EAQAAAAGPBAEAAAABlQRAAAAAAaoEAQAAAAGtBAAAANEEArEEQAAAAAGzBAEAAAABtgQCAAAAAbcEAgAAAAG8BEAAAAAB2gQAAADaBALbBAEAAAAB3AQBAAAAAd4EEAAAAAHfBEAAAAAB4ARAAAAAAeEEQAAAAAHiBEAAAAAB4wQCAAAAAQIAAAARACBPAACzDQAgAwAAABEAIE8AALMNACBQAACyDQAgAUgAANYQADACAAAAEQAgSAAAsg0AIAIAAADECwAgSAAAsQ0AIBQFAgDRCAAhjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqgQBALsIACGtBAAAwgnRBCKxBEAAxwgAIbMEAQC8CAAhtgQCANEIACG3BAIA0QgAIbwEQAC9CAAh2gQAAMMJ2gQi2wQBALwIACHcBAEAvAgAId4EEADECQAh3wRAAMcIACHgBEAAxwgAIeEEQADHCAAh4gRAAMcIACHjBAIA0QgAIRwDAADFCQAgBQIA0QgAIQgAAMYJACAJAADHCQAgDQAAyQkAIA8AAMoJACARAADLCQAgEwAAzAkAIBYAAM0JACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGqBAEAuwgAIa0EAADCCdEEIrEEQADHCAAhswQBALwIACG2BAIA0QgAIbcEAgDRCAAhvARAAL0IACHaBAAAwwnaBCLbBAEAvAgAIdwEAQC8CAAh3gQQAMQJACHfBEAAxwgAIeAEQADHCAAh4QRAAMcIACHiBEAAxwgAIeMEAgDRCAAhHAMAAJEKACAFAgAAAAEIAACSCgAgCQAAkwoAIA0AAJUKACAPAACWCgAgEQAAlwoAIBMAAJgKACAWAACZCgAgjgQBAAAAAY8EAQAAAAGVBEAAAAABqgQBAAAAAa0EAAAA0QQCsQRAAAAAAbMEAQAAAAG2BAIAAAABtwQCAAAAAbwEQAAAAAHaBAAAANoEAtsEAQAAAAHcBAEAAAAB3gQQAAAAAd8EQAAAAAHgBEAAAAAB4QRAAAAAAeIEQAAAAAHjBAIAAAABHAMAAJEKACAFAgAAAAEIAACSCgAgCgAAlAoAIA0AAJUKACAPAACWCgAgEQAAlwoAIBMAAJgKACAWAACZCgAgjgQBAAAAAY8EAQAAAAGVBEAAAAABqgQBAAAAAa0EAAAA0QQCsQRAAAAAAbMEAQAAAAG2BAIAAAABtwQCAAAAAbwEQAAAAAHaBAAAANoEAtsEAQAAAAHdBAEAAAAB3gQQAAAAAd8EQAAAAAHgBEAAAAAB4QRAAAAAAeIEQAAAAAHjBAIAAAABAgAAABEAIE8AALwNACADAAAAEQAgTwAAvA0AIFAAALsNACABSAAA1RAAMAIAAAARACBIAAC7DQAgAgAAAMQLACBIAAC6DQAgFAUCANEIACGOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGqBAEAuwgAIa0EAADCCdEEIrEEQADHCAAhswQBALwIACG2BAIA0QgAIbcEAgDRCAAhvARAAL0IACHaBAAAwwnaBCLbBAEAvAgAId0EAQC8CAAh3gQQAMQJACHfBEAAxwgAIeAEQADHCAAh4QRAAMcIACHiBEAAxwgAIeMEAgDRCAAhHAMAAMUJACAFAgDRCAAhCAAAxgkAIAoAAMgJACANAADJCQAgDwAAygkAIBEAAMsJACATAADMCQAgFgAAzQkAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIaoEAQC7CAAhrQQAAMIJ0QQisQRAAMcIACGzBAEAvAgAIbYEAgDRCAAhtwQCANEIACG8BEAAvQgAIdoEAADDCdoEItsEAQC8CAAh3QQBALwIACHeBBAAxAkAId8EQADHCAAh4ARAAMcIACHhBEAAxwgAIeIEQADHCAAh4wQCANEIACEcAwAAkQoAIAUCAAAAAQgAAJIKACAKAACUCgAgDQAAlQoAIA8AAJYKACARAACXCgAgEwAAmAoAIBYAAJkKACCOBAEAAAABjwQBAAAAAZUEQAAAAAGqBAEAAAABrQQAAADRBAKxBEAAAAABswQBAAAAAbYEAgAAAAG3BAIAAAABvARAAAAAAdoEAAAA2gQC2wQBAAAAAd0EAQAAAAHeBBAAAAAB3wRAAAAAAeAEQAAAAAHhBEAAAAAB4gRAAAAAAeMEAgAAAAELAwAA1AsAIAcAANYLACAYAADXCwAgGwAA2AsAII4EAQAAAAGPBAEAAAABlQRAAAAAAbMEAQAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAECAAAAPgAgTwAAyA0AIAMAAAA-ACBPAADIDQAgUAAAxw0AIAFIAADUEAAwEQMAAPEHACAGAACACAAgBwAA2AcAIBgAAN0HACAbAADtBwAgiwQAAJgIADCMBAAAEwAQjQQAAJgIADCOBAEAAAABjwQBAL8HACGVBEAAwQcAIbMEAQDDBwAhvARAAMEHACHpBAEAwAcAIYwFAQDABwAhjQUBAPAHACGnBQAAlwgAIAIAAAA-ACBIAADHDQAgAgAAAMUNACBIAADGDQAgC4sEAADEDQAwjAQAAMUNABCNBAAAxA0AMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIbMEAQDDBwAhvARAAMEHACHpBAEAwAcAIYwFAQDABwAhjQUBAPAHACELiwQAAMQNADCMBAAAxQ0AEI0EAADEDQAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhswQBAMMHACG8BEAAwQcAIekEAQDABwAhjAUBAMAHACGNBQEA8AcAIQeOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGzBAEAvAgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIQsDAACrCwAgBwAArQsAIBgAAK4LACAbAACvCwAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhswQBALwIACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACELAwAA1AsAIAcAANYLACAYAADXCwAgGwAA2AsAII4EAQAAAAGPBAEAAAABlQRAAAAAAbMEAQAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAEJAwAApAsAIAQAAKYLACAIAAClCwAgjgQBAAAAAY8EAQAAAAGnBAEAAAABsgRAAAAAAdsEAQAAAAGBBQAAAIwFAgIAAAALACBPAADRDQAgAwAAAAsAIE8AANENACBQAADQDQAgAUgAANMQADACAAAACwAgSAAA0A0AIAIAAADQCwAgSAAAzw0AIAaOBAEAuwgAIY8EAQC7CAAhpwQBALsIACGyBEAAvQgAIdsEAQC7CAAhgQUAAJ8LjAUiCQMAAKALACAEAACiCwAgCAAAoQsAII4EAQC7CAAhjwQBALsIACGnBAEAuwgAIbIEQAC9CAAh2wQBALsIACGBBQAAnwuMBSIJAwAApAsAIAQAAKYLACAIAAClCwAgjgQBAAAAAY8EAQAAAAGnBAEAAAABsgRAAAAAAdsEAQAAAAGBBQAAAIwFAgkDAACkCwAgCAAApQsAIBwAAKcLACCOBAEAAAABjwQBAAAAAbIEQAAAAAHbBAEAAAABgQUAAACMBQKKBQEAAAABAgAAAAsAIE8AANoNACADAAAACwAgTwAA2g0AIFAAANkNACABSAAA0hAAMAIAAAALACBIAADZDQAgAgAAANALACBIAADYDQAgBo4EAQC7CAAhjwQBALsIACGyBEAAvQgAIdsEAQC7CAAhgQUAAJ8LjAUiigUBALwIACEJAwAAoAsAIAgAAKELACAcAACjCwAgjgQBALsIACGPBAEAuwgAIbIEQAC9CAAh2wQBALsIACGBBQAAnwuMBSKKBQEAvAgAIQkDAACkCwAgCAAApQsAIBwAAKcLACCOBAEAAAABjwQBAAAAAbIEQAAAAAHbBAEAAAABgQUAAACMBQKKBQEAAAABCgMAAIYLACCOBAEAAAABjwQBAAAAAbwEQAAAAAH2BAIAAAAB9wQCAAAAAfgEAQAAAAH5BAIAAAAB-gQCAAAAAfsEQAAAAAECAAAAmwEAIE8AANsNACADAAAABwAgTwAA2w0AIFAAAN8NACAMAAAABwAgAwAAhAsAIEgAAN8NACCOBAEAuwgAIY8EAQC7CAAhvARAAL0IACH2BAIA0QgAIfcEAgDRCAAh-AQBALwIACH5BAIA0QgAIfoEAgDRCAAh-wRAAMcIACEKAwAAhAsAII4EAQC7CAAhjwQBALsIACG8BEAAvQgAIfYEAgDRCAAh9wQCANEIACH4BAEAvAgAIfkEAgDRCAAh-gQCANEIACH7BEAAxwgAIQNPAADQEAAgrwUAANEQACC1BQAAAQAgA08AANsNACCvBQAA3A0AILUFAACbAQAgBE8AANINADCvBQAA0w0AMLEFAADVDQAgtQUAAMwLADAETwAAyQ0AMK8FAADKDQAwsQUAAMwNACC1BQAAzAsAMARPAAC9DQAwrwUAAL4NADCxBQAAwA0AILUFAADBDQAwBE8AALQNADCvBQAAtQ0AMLEFAAC3DQAgtQUAAMALADAETwAAqw0AMK8FAACsDQAwsQUAAK4NACC1BQAAwAsAMARPAACiDQAwrwUAAKMNADCxBQAApQ0AILUFAAD9CQAwBE8AAJkNADCvBQAAmg0AMLEFAACcDQAgtQUAAPEJADAETwAAkA0AMK8FAACRDQAwsQUAAJMNACC1BQAA5QkAMARPAACHDQAwrwUAAIgNADCxBQAAig0AILUFAACJCgAwBE8AAP4MADCvBQAA_wwAMLEFAACBDQAgtQUAAOEKADAETwAA9QwAMK8FAAD2DAAwsQUAAPgMACC1BQAAtAoAMARPAADpDAAwrwUAAOoMADCxBQAA7AwAILUFAADtDAAwBE8AAN0MADCvBQAA3gwAMLEFAADgDAAgtQUAAOEMADAETwAA1AwAMK8FAADVDAAwsQUAANcMACC1BQAA0gkAMARPAADLDAAwrwUAAMwMADCxBQAAzgwAILUFAADSCQAwBE8AAMIMADCvBQAAwwwAMLEFAADFDAAgtQUAAIkJADAETwAAuQwAMK8FAAC6DAAwsQUAALwMACC1BQAA5QgAMARPAACtDAAwrwUAAK4MADCxBQAAsAwAILUFAACxDAAwBE8AAKEMADCvBQAAogwAMLEFAACkDAAgtQUAAKUMADAETwAAlQwAMK8FAACWDAAwsQUAAJgMACC1BQAAmQwAMARPAACMDAAwrwUAAI0MADCxBQAAjwwAILUFAAC0CwAwBE8AAIMMADCvBQAAhAwAMLEFAACGDAAgtQUAALQLADAAAAABsgUgAAAAAQtPAADyDwAwUAAA9w8AMK8FAADzDwAwsAUAAPQPADCxBQAA9Q8AILIFAAD2DwAwswUAAPYPADC0BQAA9g8AMLUFAAD2DwAwtgUAAPgPADC3BQAA-Q8AMAtPAADpDwAwUAAA7Q8AMK8FAADqDwAwsAUAAOsPADCxBQAA7A8AILIFAADBDQAwswUAAMENADC0BQAAwQ0AMLUFAADBDQAwtgUAAO4PADC3BQAAxA0AMAtPAADgDwAwUAAA5A8AMK8FAADhDwAwsAUAAOIPADCxBQAA4w8AILIFAADMCwAwswUAAMwLADC0BQAAzAsAMLUFAADMCwAwtgUAAOUPADC3BQAAzwsAMAtPAADUDwAwUAAA2Q8AMK8FAADVDwAwsAUAANYPADCxBQAA1w8AILIFAADYDwAwswUAANgPADC0BQAA2A8AMLUFAADYDwAwtgUAANoPADC3BQAA2w8AMAtPAADIDwAwUAAAzQ8AMK8FAADJDwAwsAUAAMoPADCxBQAAyw8AILIFAADMDwAwswUAAMwPADC0BQAAzA8AMLUFAADMDwAwtgUAAM4PADC3BQAAzw8AMAtPAAC_DwAwUAAAww8AMK8FAADADwAwsAUAAMEPADCxBQAAwg8AILIFAADtDAAwswUAAO0MADC0BQAA7QwAMLUFAADtDAAwtgUAAMQPADC3BQAA8AwAMAtPAAC2DwAwUAAAug8AMK8FAAC3DwAwsAUAALgPADCxBQAAuQ8AILIFAADhDAAwswUAAOEMADC0BQAA4QwAMLUFAADhDAAwtgUAALsPADC3BQAA5AwAMAtPAACtDwAwUAAAsQ8AMK8FAACuDwAwsAUAAK8PADCxBQAAsA8AILIFAADACwAwswUAAMALADC0BQAAwAsAMLUFAADACwAwtgUAALIPADC3BQAAwwsAMAtPAACkDwAwUAAAqA8AMK8FAAClDwAwsAUAAKYPADCxBQAApw8AILIFAACJCgAwswUAAIkKADC0BQAAiQoAMLUFAACJCgAwtgUAAKkPADC3BQAAjAoAMAtPAACbDwAwUAAAnw8AMK8FAACcDwAwsAUAAJ0PADCxBQAAng8AILIFAAD9CQAwswUAAP0JADC0BQAA_QkAMLUFAAD9CQAwtgUAAKAPADC3BQAAgAoAMAtPAACSDwAwUAAAlg8AMK8FAACTDwAwsAUAAJQPADCxBQAAlQ8AILIFAADxCQAwswUAAPEJADC0BQAA8QkAMLUFAADxCQAwtgUAAJcPADC3BQAA9AkAMAtPAACJDwAwUAAAjQ8AMK8FAACKDwAwsAUAAIsPADCxBQAAjA8AILIFAADlCQAwswUAAOUJADC0BQAA5QkAMLUFAADlCQAwtgUAAI4PADC3BQAA6AkAMAtPAAD9DgAwUAAAgg8AMK8FAAD-DgAwsAUAAP8OADCxBQAAgA8AILIFAACBDwAwswUAAIEPADC0BQAAgQ8AMLUFAACBDwAwtgUAAIMPADC3BQAAhA8AMAtPAAD0DgAwUAAA-A4AMK8FAAD1DgAwsAUAAPYOADCxBQAA9w4AILIFAADhCgAwswUAAOEKADC0BQAA4QoAMLUFAADhCgAwtgUAAPkOADC3BQAA5AoAMAtPAADrDgAwUAAA7w4AMK8FAADsDgAwsAUAAO0OADCxBQAA7g4AILIFAADVCgAwswUAANUKADC0BQAA1QoAMLUFAADVCgAwtgUAAPAOADC3BQAA2AoAMAtPAADiDgAwUAAA5g4AMK8FAADjDgAwsAUAAOQOADCxBQAA5Q4AILIFAAC0CgAwswUAALQKADC0BQAAtAoAMLUFAAC0CgAwtgUAAOcOADC3BQAAtwoAMAtPAADZDgAwUAAA3Q4AMK8FAADaDgAwsAUAANsOADCxBQAA3A4AILIFAADSCQAwswUAANIJADC0BQAA0gkAMLUFAADSCQAwtgUAAN4OADC3BQAA1QkAMAtPAADNDgAwUAAA0g4AMK8FAADODgAwsAUAAM8OADCxBQAA0A4AILIFAADRDgAwswUAANEOADC0BQAA0Q4AMLUFAADRDgAwtgUAANMOADC3BQAA1A4AMAtPAADEDgAwUAAAyA4AMK8FAADFDgAwsAUAAMYOADCxBQAAxw4AILIFAACJCQAwswUAAIkJADC0BQAAiQkAMLUFAACJCQAwtgUAAMkOADC3BQAAjAkAMAtPAAC4DgAwUAAAvQ4AMK8FAAC5DgAwsAUAALoOADCxBQAAuw4AILIFAAC8DgAwswUAALwOADC0BQAAvA4AMLUFAAC8DgAwtgUAAL4OADC3BQAAvw4AMAtPAACvDgAwUAAAsw4AMK8FAACwDgAwsAUAALEOADCxBQAAsg4AILIFAADlCAAwswUAAOUIADC0BQAA5QgAMLUFAADlCAAwtgUAALQOADC3BQAA6AgAMAtPAACmDgAwUAAAqg4AMK8FAACnDgAwsAUAAKgOADCxBQAAqQ4AILIFAACxDAAwswUAALEMADC0BQAAsQwAMLUFAACxDAAwtgUAAKsOADC3BQAAtAwAMAtPAACdDgAwUAAAoQ4AMK8FAACeDgAwsAUAAJ8OADCxBQAAoA4AILIFAACZDAAwswUAAJkMADC0BQAAmQwAMLUFAACZDAAwtgUAAKIOADC3BQAAnAwAMAtPAACUDgAwUAAAmA4AMK8FAACVDgAwsAUAAJYOADCxBQAAlw4AILIFAAC0CwAwswUAALQLADC0BQAAtAsAMLUFAAC0CwAwtgUAAJkOADC3BQAAtwsAMBEIAACSCwAgGQAAkwsAIBoAAJQLACCOBAEAAAABlQRAAAAAAa0EAAAAgwUC2wQBAAAAAfwEAQAAAAH9BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFAoMFAQAAAAGEBQEAAAABhQVAAAAAAYYFQAAAAAGHBUAAAAABAgAAADQAIE8AAJwOACADAAAANAAgTwAAnA4AIFAAAJsOACABSAAAzxAAMAIAAAA0ACBIAACbDgAgAgAAALgLACBIAACaDgAgDo4EAQC7CAAhlQRAAL0IACGtBAAAjAuDBSLbBAEAvAgAIfwEAQC7CAAh_QQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUigwUBALsIACGEBQEAvAgAIYUFQAC9CAAhhgVAAMcIACGHBUAAxwgAIREIAACOCwAgGQAAjwsAIBoAAJALACCOBAEAuwgAIZUEQAC9CAAhrQQAAIwLgwUi2wQBALwIACH8BAEAuwgAIf0EAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIoMFAQC7CAAhhAUBALwIACGFBUAAvQgAIYYFQADHCAAhhwVAAMcIACERCAAAkgsAIBkAAJMLACAaAACUCwAgjgQBAAAAAZUEQAAAAAGtBAAAAIMFAtsEAQAAAAH8BAEAAAAB_QQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKDBQEAAAABhAUBAAAAAYUFQAAAAAGGBUAAAAABhwVAAAAAAQkSAADBCAAgSIAAAAABjgQBAAAAAZAEAQAAAAGRBAEAAAABkgQBAAAAAZMEAQAAAAGUBAEAAAABlQRAAAAAAQIAAAB5ACBPAAClDgAgAwAAAHkAIE8AAKUOACBQAACkDgAgAUgAAM4QADACAAAAeQAgSAAApA4AIAIAAACdDAAgSAAAow4AIAhIgAAAAAGOBAEAuwgAIZAEAQC8CAAhkQQBALsIACGSBAEAvAgAIZMEAQC8CAAhlAQBALwIACGVBEAAvQgAIQkSAAC_CAAgSIAAAAABjgQBALsIACGQBAEAvAgAIZEEAQC7CAAhkgQBALwIACGTBAEAvAgAIZQEAQC8CAAhlQRAAL0IACEJEgAAwQgAIEiAAAAAAY4EAQAAAAGQBAEAAAABkQQBAAAAAZIEAQAAAAGTBAEAAAABlAQBAAAAAZUEQAAAAAEKBAAAywgAIEiAAAAAAY4EAQAAAAGVBEAAAAABpwQBAAAAAakEAAAAqQQCqgQBAAAAAasEAQAAAAGtBAAAAK0EAq4EQAAAAAECAAAAcQAgTwAArg4AIAMAAABxACBPAACuDgAgUAAArQ4AIAFIAADNEAAwAgAAAHEAIEgAAK0OACACAAAAtQwAIEgAAKwOACAJSIAAAAABjgQBALsIACGVBEAAvQgAIacEAQC7CAAhqQQAAMUIqQQiqgQBALsIACGrBAEAvAgAIa0EAADGCK0EIq4EQADHCAAhCgQAAMkIACBIgAAAAAGOBAEAuwgAIZUEQAC9CAAhpwQBALsIACGpBAAAxQipBCKqBAEAuwgAIasEAQC8CAAhrQQAAMYIrQQirgRAAMcIACEKBAAAywgAIEiAAAAAAY4EAQAAAAGVBEAAAAABpwQBAAAAAakEAAAAqQQCqgQBAAAAAasEAQAAAAGtBAAAAK0EAq4EQAAAAAEJBAAA2AgAIAUCAAAAATIAANcIACCOBAEAAAABpwQBAAAAAa0EAAAAsQQCrwQBAAAAAbEEQAAAAAGyBEAAAAABAgAAAGsAIE8AALcOACADAAAAawAgTwAAtw4AIFAAALYOACABSAAAzBAAMAIAAABrACBIAAC2DgAgAgAAAOkIACBIAAC1DgAgBwUCANEIACGOBAEAuwgAIacEAQC7CAAhrQQAANIIsQQirwQBALsIACGxBEAAxwgAIbIEQAC9CAAhCQQAANUIACAFAgDRCAAhMgAA1AgAII4EAQC7CAAhpwQBALsIACGtBAAA0gixBCKvBAEAuwgAIbEEQADHCAAhsgRAAL0IACEJBAAA2AgAIAUCAAAAATIAANcIACCOBAEAAAABpwQBAAAAAa0EAAAAsQQCrwQBAAAAAbEEQAAAAAGyBEAAAAABDjEAAO4IACCOBAEAAAABlQRAAAAAAaoEAQAAAAGtBAAAALsEArMEAQAAAAG0BAEAAAABtQQCAAAAAbYEAgAAAAG3BAIAAAABuARAAAAAAbkEQAAAAAG7BAEAAAABvARAAAAAAQIAAACyAQAgTwAAww4AIAMAAACyAQAgTwAAww4AIFAAAMIOACABSAAAyxAAMBMDAADxBwAgMQAA6gcAIIsEAADuBwAwjAQAALABABCNBAAA7gcAMI4EAQAAAAGPBAEAvwcAIZUEQADBBwAhqgQBAMAHACGtBAAA7we7BCKzBAEAwwcAIbQEAQDABwAhtQQCAMsHACG2BAIAywcAIbcEAgDLBwAhuARAAMEHACG5BEAAwQcAIbsEAQDwBwAhvARAAMEHACECAAAAsgEAIEgAAMIOACACAAAAwA4AIEgAAMEOACARiwQAAL8OADCMBAAAwA4AEI0EAAC_DgAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhqgQBAMAHACGtBAAA7we7BCKzBAEAwwcAIbQEAQDABwAhtQQCAMsHACG2BAIAywcAIbcEAgDLBwAhuARAAMEHACG5BEAAwQcAIbsEAQDwBwAhvARAAMEHACERiwQAAL8OADCMBAAAwA4AEI0EAAC_DgAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhqgQBAMAHACGtBAAA7we7BCKzBAEAwwcAIbQEAQDABwAhtQQCAMsHACG2BAIAywcAIbcEAgDLBwAhuARAAMEHACG5BEAAwQcAIbsEAQDwBwAhvARAAMEHACENjgQBALsIACGVBEAAvQgAIaoEAQC7CAAhrQQAAN4IuwQiswQBALwIACG0BAEAuwgAIbUEAgDRCAAhtgQCANEIACG3BAIA0QgAIbgEQAC9CAAhuQRAAL0IACG7BAEAvAgAIbwEQAC9CAAhDjEAAOAIACCOBAEAuwgAIZUEQAC9CAAhqgQBALsIACGtBAAA3gi7BCKzBAEAvAgAIbQEAQC7CAAhtQQCANEIACG2BAIA0QgAIbcEAgDRCAAhuARAAL0IACG5BEAAvQgAIbsEAQC8CAAhvARAAL0IACEOMQAA7ggAII4EAQAAAAGVBEAAAAABqgQBAAAAAa0EAAAAuwQCswQBAAAAAbQEAQAAAAG1BAIAAAABtgQCAAAAAbcEAgAAAAG4BEAAAAABuQRAAAAAAbsEAQAAAAG8BEAAAAABCwQAAPoIACAwAAD5CAAgjgQBAAAAAacEAQAAAAGtBAAAAL8EAr0EAQAAAAG_BAIAAAABwAQBAAAAAcEEAQAAAAHCBEAAAAABwwRAAAAAAQIAAABlACBPAADMDgAgAwAAAGUAIE8AAMwOACBQAADLDgAgAUgAAMoQADACAAAAZQAgSAAAyw4AIAIAAACNCQAgSAAAyg4AIAmOBAEAuwgAIacEAQC7CAAhrQQAAPQIvwQivQQBALsIACG_BAIA0QgAIcAEAQC8CAAhwQQBALwIACHCBEAAxwgAIcMEQAC9CAAhCwQAAPcIACAwAAD2CAAgjgQBALsIACGnBAEAuwgAIa0EAAD0CL8EIr0EAQC7CAAhvwQCANEIACHABAEAvAgAIcEEAQC8CAAhwgRAAMcIACHDBEAAvQgAIQsEAAD6CAAgMAAA-QgAII4EAQAAAAGnBAEAAAABrQQAAAC_BAK9BAEAAAABvwQCAAAAAcAEAQAAAAHBBAEAAAABwgRAAAAAAcMEQAAAAAELLwAAkgkAII4EAQAAAAGVBEAAAAABqQQAAADFBAKqBAEAAAABrQQAAADIBAKzBAEAAAABvARAAAAAAb8EAgAAAAHFBAIAAAABxgQBAAAAAQIAAACtAQAgTwAA2A4AIAMAAACtAQAgTwAA2A4AIFAAANcOACABSAAAyRAAMBADAADxBwAgLwAA6AcAIIsEAADzBwAwjAQAAKsBABCNBAAA8wcAMI4EAQAAAAGPBAEAvwcAIZUEQADBBwAhqQQAAPQHxQQiqgQBAMAHACGtBAAA9gfIBCKzBAEAwwcAIbwEQADBBwAhvwQCAMsHACHFBAIA9QcAIcYEAQDDBwAhAgAAAK0BACBIAADXDgAgAgAAANUOACBIAADWDgAgDosEAADUDgAwjAQAANUOABCNBAAA1A4AMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIakEAAD0B8UEIqoEAQDABwAhrQQAAPYHyAQiswQBAMMHACG8BEAAwQcAIb8EAgDLBwAhxQQCAPUHACHGBAEAwwcAIQ6LBAAA1A4AMIwEAADVDgAQjQQAANQOADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGpBAAA9AfFBCKqBAEAwAcAIa0EAAD2B8gEIrMEAQDDBwAhvARAAMEHACG_BAIAywcAIcUEAgD1BwAhxgQBAMMHACEKjgQBALsIACGVBEAAvQgAIakEAACACcUEIqoEAQC7CAAhrQQAAIIJyAQiswQBALwIACG8BEAAvQgAIb8EAgDRCAAhxQQCAIEJACHGBAEAvAgAIQsvAACECQAgjgQBALsIACGVBEAAvQgAIakEAACACcUEIqoEAQC7CAAhrQQAAIIJyAQiswQBALwIACG8BEAAvQgAIb8EAgDRCAAhxQQCAIEJACHGBAEAvAgAIQsvAACSCQAgjgQBAAAAAZUEQAAAAAGpBAAAAMUEAqoEAQAAAAGtBAAAAMgEArMEAQAAAAG8BEAAAAABvwQCAAAAAcUEAgAAAAHGBAEAAAABCwsAAKAKACAUAADfCQAgFQAA4AkAII4EAQAAAAGVBEAAAAABqQQAAADnBALIBAEAAAABzgQCAAAAAeQEAQAAAAHlBAEAAAAB5wQBAAAAAQIAAAAqACBPAADhDgAgAwAAACoAIE8AAOEOACBQAADgDgAgAUgAAMgQADACAAAAKgAgSAAA4A4AIAIAAADWCQAgSAAA3w4AIAiOBAEAuwgAIZUEQAC9CAAhqQQAANgJ5wQiyAQBALwIACHOBAIA0QgAIeQEAQC7CAAh5QQBALsIACHnBAEAuwgAIQsLAACfCgAgFAAA2wkAIBUAANwJACCOBAEAuwgAIZUEQAC9CAAhqQQAANgJ5wQiyAQBALwIACHOBAIA0QgAIeQEAQC7CAAh5QQBALsIACHnBAEAuwgAIQsLAACgCgAgFAAA3wkAIBUAAOAJACCOBAEAAAABlQRAAAAAAakEAAAA5wQCyAQBAAAAAc4EAgAAAAHkBAEAAAAB5QQBAAAAAecEAQAAAAEGBAAAqAoAICcAAKkKACCOBAEAAAABpwQBAAAAAbsEAQAAAAHoBEAAAAABAgAAAFMAIE8AAOoOACADAAAAUwAgTwAA6g4AIFAAAOkOACABSAAAxxAAMAIAAABTACBIAADpDgAgAgAAALgKACBIAADoDgAgBI4EAQC7CAAhpwQBALsIACG7BAEAuwgAIegEQAC9CAAhBgQAAKUKACAnAACmCgAgjgQBALsIACGnBAEAuwgAIbsEAQC7CAAh6ARAAL0IACEGBAAAqAoAICcAAKkKACCOBAEAAAABpwQBAAAAAbsEAQAAAAHoBEAAAAABCCYAAL0KACAoAAC-CgAgjgQBAAAAAZUEQAAAAAGzBAEAAAABxgQBAAAAAekEAQAAAAHqBAEAAAABAgAAAE0AIE8AAPMOACADAAAATQAgTwAA8w4AIFAAAPIOACABSAAAxhAAMAIAAABNACBIAADyDgAgAgAAANkKACBIAADxDgAgBo4EAQC7CAAhlQRAAL0IACGzBAEAvAgAIcYEAQC8CAAh6QQBALsIACHqBAEAvAgAIQgmAACuCgAgKAAArwoAII4EAQC7CAAhlQRAAL0IACGzBAEAvAgAIcYEAQC8CAAh6QQBALsIACHqBAEAvAgAIQgmAAC9CgAgKAAAvgoAII4EAQAAAAGVBEAAAAABswQBAAAAAcYEAQAAAAHpBAEAAAAB6gQBAAAAAQcEAADGCgAgBYAAAAABJgAAxwoAII4EAQAAAAGnBAEAAAAB6gQBAAAAAesEQAAAAAECAAAASAAgTwAA_A4AIAMAAABIACBPAAD8DgAgUAAA-w4AIAFIAADFEAAwAgAAAEgAIEgAAPsOACACAAAA5QoAIEgAAPoOACAFBYAAAAABjgQBALsIACGnBAEAuwgAIeoEAQC7CAAh6wRAAL0IACEHBAAAwwoAIAWAAAAAASYAAMQKACCOBAEAuwgAIacEAQC7CAAh6gQBALsIACHrBEAAvQgAIQcEAADGCgAgBYAAAAABJgAAxwoAII4EAQAAAAGnBAEAAAAB6gQBAAAAAesEQAAAAAEOJQAA6goAICkAAOsKACCOBAEAAAABlQRAAAAAAakEAAAA7gQCqgQBAAAAAa0EAAAAyAQCswQBAAAAAbYEAgAAAAG3BAIAAAABvARAAAAAAewEAQAAAAHuBIAAAAAB7wQBAAAAAQIAAAClAQAgTwAAiA8AIAMAAAClAQAgTwAAiA8AIFAAAIcPACABSAAAxBAAMBQDAADxBwAgJQAA4wcAICkAAOQHACCLBAAA-AcAMIwEAABPABCNBAAA-AcAMI4EAQAAAAGPBAEAvwcAIZUEQADBBwAhqQQAAPkH7gQiqgQBAMAHACGtBAAA9gfIBCKzBAEAwwcAIbYEAgDLBwAhtwQCAMsHACG8BEAAwQcAIewEAQDABwAh7gQAAPoHACDvBAEAwwcAIaIFAAD3BwAgAgAAAKUBACBIAACHDwAgAgAAAIUPACBIAACGDwAgEIsEAACEDwAwjAQAAIUPABCNBAAAhA8AMI4EAQC_BwAhjwQBAL8HACGVBEAAwQcAIakEAAD5B-4EIqoEAQDABwAhrQQAAPYHyAQiswQBAMMHACG2BAIAywcAIbcEAgDLBwAhvARAAMEHACHsBAEAwAcAIe4EAAD6BwAg7wQBAMMHACEQiwQAAIQPADCMBAAAhQ8AEI0EAACEDwAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhqQQAAPkH7gQiqgQBAMAHACGtBAAA9gfIBCKzBAEAwwcAIbYEAgDLBwAhtwQCAMsHACG8BEAAwQcAIewEAQDABwAh7gQAAPoHACDvBAEAwwcAIQyOBAEAuwgAIZUEQAC9CAAhqQQAAM0K7gQiqgQBALsIACGtBAAAggnIBCKzBAEAvAgAIbYEAgDRCAAhtwQCANEIACG8BEAAvQgAIewEAQC7CAAh7gSAAAAAAe8EAQC8CAAhDiUAAM8KACApAADQCgAgjgQBALsIACGVBEAAvQgAIakEAADNCu4EIqoEAQC7CAAhrQQAAIIJyAQiswQBALwIACG2BAIA0QgAIbcEAgDRCAAhvARAAL0IACHsBAEAuwgAIe4EgAAAAAHvBAEAvAgAIQ4lAADqCgAgKQAA6woAII4EAQAAAAGVBEAAAAABqQQAAADuBAKqBAEAAAABrQQAAADIBAKzBAEAAAABtgQCAAAAAbcEAgAAAAG8BEAAAAAB7AQBAAAAAe4EgAAAAAHvBAEAAAABCgsAAKcJACASAACoCQAgjgQBAAAAAZAEAQAAAAGRBAEAAAABlQRAAAAAAcAEAQAAAAHIBAEAAAAB0QQAAADRBAPSBAAAANEEAwIAAAAlACBPAACRDwAgAwAAACUAIE8AAJEPACBQAACQDwAgAUgAAMMQADACAAAAJQAgSAAAkA8AIAIAAADpCQAgSAAAjw8AIAiOBAEAuwgAIZAEAQC8CAAhkQQBALsIACGVBEAAvQgAIcAEAQC8CAAhyAQBALsIACHRBAAAognRBCPSBAAAognRBCMKCwAApAkAIBIAAKUJACCOBAEAuwgAIZAEAQC8CAAhkQQBALsIACGVBEAAvQgAIcAEAQC8CAAhyAQBALsIACHRBAAAognRBCPSBAAAognRBCMKCwAApwkAIBIAAKgJACCOBAEAAAABkAQBAAAAAZEEAQAAAAGVBEAAAAABwAQBAAAAAcgEAQAAAAHRBAAAANEEA9IEAAAA0QQDCgsAALIJACAQAACzCQAgjgQBAAAAAZUEQAAAAAHIBAEAAAAB0wQBAAAAAdQEAQAAAAHVBAEAAAAB1gQBAAAAAdcEAgAAAAECAAAAIQAgTwAAmg8AIAMAAAAhACBPAACaDwAgUAAAmQ8AIAFIAADCEAAwAgAAACEAIEgAAJkPACACAAAA9QkAIEgAAJgPACAIjgQBALsIACGVBEAAvQgAIcgEAQC7CAAh0wQBALsIACHUBAEAuwgAIdUEAQC7CAAh1gQBALwIACHXBAIAgQkAIQoLAACvCQAgEAAAsAkAII4EAQC7CAAhlQRAAL0IACHIBAEAuwgAIdMEAQC7CAAh1AQBALsIACHVBAEAuwgAIdYEAQC8CAAh1wQCAIEJACEKCwAAsgkAIBAAALMJACCOBAEAAAABlQRAAAAAAcgEAQAAAAHTBAEAAAAB1AQBAAAAAdUEAQAAAAHWBAEAAAAB1wQCAAAAAQgLAAC7CQAgDgAAvAkAII4EAQAAAAGVBEAAAAABqwQBAAAAAbwEQAAAAAHIBAEAAAAB2AQBAAAAAQIAAAAdACBPAACjDwAgAwAAAB0AIE8AAKMPACBQAACiDwAgAUgAAMEQADACAAAAHQAgSAAAog8AIAIAAACBCgAgSAAAoQ8AIAaOBAEAuwgAIZUEQAC9CAAhqwQBALsIACG8BEAAvQgAIcgEAQC7CAAh2AQBALsIACEICwAAuAkAIA4AALkJACCOBAEAuwgAIZUEQAC9CAAhqwQBALsIACG8BEAAvQgAIcgEAQC7CAAh2AQBALsIACEICwAAuwkAIA4AALwJACCOBAEAAAABlQRAAAAAAasEAQAAAAG8BEAAAAAByAQBAAAAAdgEAQAAAAELCwAAnQkAIAwAAJ4JACCOBAEAAAABlQRAAAAAAcgEAQAAAAHJBAEAAAABywQAAADLBALMBAIAAAABzQQBAAAAAc4EAgAAAAHPBAIAAAABAgAAABkAIE8AAKwPACADAAAAGQAgTwAArA8AIFAAAKsPACABSAAAwBAAMAIAAAAZACBIAACrDwAgAgAAAI0KACBIAACqDwAgCY4EAQC7CAAhlQRAAL0IACHIBAEAuwgAIckEAQC7CAAhywQAAJgJywQizAQCAIEJACHNBAEAvAgAIc4EAgDRCAAhzwQCANEIACELCwAAmgkAIAwAAJsJACCOBAEAuwgAIZUEQAC9CAAhyAQBALsIACHJBAEAuwgAIcsEAACYCcsEIswEAgCBCQAhzQQBALwIACHOBAIA0QgAIc8EAgDRCAAhCwsAAJ0JACAMAACeCQAgjgQBAAAAAZUEQAAAAAHIBAEAAAAByQQBAAAAAcsEAAAAywQCzAQCAAAAAc0EAQAAAAHOBAIAAAABzwQCAAAAARwFAgAAAAEIAACSCgAgCQAAkwoAIAoAAJQKACANAACVCgAgDwAAlgoAIBEAAJcKACATAACYCgAgFgAAmQoAII4EAQAAAAGVBEAAAAABqgQBAAAAAa0EAAAA0QQCsQRAAAAAAbMEAQAAAAG2BAIAAAABtwQCAAAAAbwEQAAAAAHaBAAAANoEAtsEAQAAAAHcBAEAAAAB3QQBAAAAAd4EEAAAAAHfBEAAAAAB4ARAAAAAAeEEQAAAAAHiBEAAAAAB4wQCAAAAAQIAAAARACBPAAC1DwAgAwAAABEAIE8AALUPACBQAAC0DwAgAUgAAL8QADACAAAAEQAgSAAAtA8AIAIAAADECwAgSAAAsw8AIBQFAgDRCAAhjgQBALsIACGVBEAAvQgAIaoEAQC7CAAhrQQAAMIJ0QQisQRAAMcIACGzBAEAvAgAIbYEAgDRCAAhtwQCANEIACG8BEAAvQgAIdoEAADDCdoEItsEAQC8CAAh3AQBALwIACHdBAEAvAgAId4EEADECQAh3wRAAMcIACHgBEAAxwgAIeEEQADHCAAh4gRAAMcIACHjBAIA0QgAIRwFAgDRCAAhCAAAxgkAIAkAAMcJACAKAADICQAgDQAAyQkAIA8AAMoJACARAADLCQAgEwAAzAkAIBYAAM0JACCOBAEAuwgAIZUEQAC9CAAhqgQBALsIACGtBAAAwgnRBCKxBEAAxwgAIbMEAQC8CAAhtgQCANEIACG3BAIA0QgAIbwEQAC9CAAh2gQAAMMJ2gQi2wQBALwIACHcBAEAvAgAId0EAQC8CAAh3gQQAMQJACHfBEAAxwgAIeAEQADHCAAh4QRAAMcIACHiBEAAxwgAIeMEAgDRCAAhHAUCAAAAAQgAAJIKACAJAACTCgAgCgAAlAoAIA0AAJUKACAPAACWCgAgEQAAlwoAIBMAAJgKACAWAACZCgAgjgQBAAAAAZUEQAAAAAGqBAEAAAABrQQAAADRBAKxBEAAAAABswQBAAAAAbYEAgAAAAG3BAIAAAABvARAAAAAAdoEAAAA2gQC2wQBAAAAAdwEAQAAAAHdBAEAAAAB3gQQAAAAAd8EQAAAAAHgBEAAAAAB4QRAAAAAAeIEQAAAAAHjBAIAAAABCQQAAPUKACCOBAEAAAABlQRAAAAAAacEAQAAAAHwBAIAAAAB8gQAAADyBALzBAEAAAAB9AQBAAAAAfUEAQAAAAECAAAAXwAgTwAAvg8AIAMAAABfACBPAAC-DwAgUAAAvQ8AIAFIAAC-EAAwAgAAAF8AIEgAAL0PACACAAAA5QwAIEgAALwPACAIjgQBALsIACGVBEAAvQgAIacEAQC7CAAh8AQCANEIACHyBAAA8QryBCLzBAEAvAgAIfQEAQC8CAAh9QQBALwIACEJBAAA8woAII4EAQC7CAAhlQRAAL0IACGnBAEAuwgAIfAEAgDRCAAh8gQAAPEK8gQi8wQBALwIACH0BAEAvAgAIfUEAQC8CAAhCQQAAPUKACCOBAEAAAABlQRAAAAAAacEAQAAAAHwBAIAAAAB8gQAAADyBALzBAEAAAAB9AQBAAAAAfUEAQAAAAEJBAAA_goAII4EAQAAAAGVBEAAAAABpwQBAAAAAfAEAgAAAAHyBAAAAPIEAvMEAQAAAAH0BAEAAAAB9QQBAAAAAQIAAABbACBPAADHDwAgAwAAAFsAIE8AAMcPACBQAADGDwAgAUgAAL0QADACAAAAWwAgSAAAxg8AIAIAAADxDAAgSAAAxQ8AIAiOBAEAuwgAIZUEQAC9CAAhpwQBALsIACHwBAIA0QgAIfIEAADxCvIEIvMEAQC8CAAh9AQBALwIACH1BAEAvAgAIQkEAAD8CgAgjgQBALsIACGVBEAAvQgAIacEAQC7CAAh8AQCANEIACHyBAAA8QryBCLzBAEAvAgAIfQEAQC8CAAh9QQBALwIACEJBAAA_goAII4EAQAAAAGVBEAAAAABpwQBAAAAAfAEAgAAAAHyBAAAAPIEAvMEAQAAAAH0BAEAAAAB9QQBAAAAAQoEAACHCwAgjgQBAAAAAacEAQAAAAG8BEAAAAAB9gQCAAAAAfcEAgAAAAH4BAEAAAAB-QQCAAAAAfoEAgAAAAH7BEAAAAABAgAAAJsBACBPAADTDwAgAwAAAJsBACBPAADTDwAgUAAA0g8AIAFIAAC8EAAwDwMAAPEHACAEAAD8BwAgiwQAAPsHADCMBAAABwAQjQQAAPsHADCOBAEAAAABjwQBAL8HACGnBAEAAAABvARAAMEHACH2BAIAywcAIfcEAgDLBwAh-AQBAPAHACH5BAIAywcAIfoEAgDLBwAh-wRAAMIHACECAAAAmwEAIEgAANIPACACAAAA0A8AIEgAANEPACANiwQAAM8PADCMBAAA0A8AEI0EAADPDwAwjgQBAL8HACGPBAEAvwcAIacEAQC_BwAhvARAAMEHACH2BAIAywcAIfcEAgDLBwAh-AQBAPAHACH5BAIAywcAIfoEAgDLBwAh-wRAAMIHACENiwQAAM8PADCMBAAA0A8AEI0EAADPDwAwjgQBAL8HACGPBAEAvwcAIacEAQC_BwAhvARAAMEHACH2BAIAywcAIfcEAgDLBwAh-AQBAPAHACH5BAIAywcAIfoEAgDLBwAh-wRAAMIHACEJjgQBALsIACGnBAEAuwgAIbwEQAC9CAAh9gQCANEIACH3BAIA0QgAIfgEAQC8CAAh-QQCANEIACH6BAIA0QgAIfsEQADHCAAhCgQAAIULACCOBAEAuwgAIacEAQC7CAAhvARAAL0IACH2BAIA0QgAIfcEAgDRCAAh-AQBALwIACH5BAIA0QgAIfoEAgDRCAAh-wRAAMcIACEKBAAAhwsAII4EAQAAAAGnBAEAAAABvARAAAAAAfYEAgAAAAH3BAIAAAAB-AQBAAAAAfkEAgAAAAH6BAIAAAAB-wRAAAAAAQWOBAEAAAABqgQBAAAAAe8EAQAAAAGIBQIAAAABiQUCAAAAAQIAAACYAQAgTwAA3w8AIAMAAACYAQAgTwAA3w8AIFAAAN4PACABSAAAuxAAMAsDAADxBwAgiwQAAP4HADCMBAAAlgEAEI0EAAD-BwAwjgQBAAAAAY8EAQC_BwAhqgQBAMMHACHvBAEAwwcAIYgFAgDLBwAhiQUCAMsHACGjBQAA_QcAIAIAAACYAQAgSAAA3g8AIAIAAADcDwAgSAAA3Q8AIAmLBAAA2w8AMIwEAADcDwAQjQQAANsPADCOBAEAvwcAIY8EAQC_BwAhqgQBAMMHACHvBAEAwwcAIYgFAgDLBwAhiQUCAMsHACEJiwQAANsPADCMBAAA3A8AEI0EAADbDwAwjgQBAL8HACGPBAEAvwcAIaoEAQDDBwAh7wQBAMMHACGIBQIAywcAIYkFAgDLBwAhBY4EAQC7CAAhqgQBALwIACHvBAEAvAgAIYgFAgDRCAAhiQUCANEIACEFjgQBALsIACGqBAEAvAgAIe8EAQC8CAAhiAUCANEIACGJBQIA0QgAIQWOBAEAAAABqgQBAAAAAe8EAQAAAAGIBQIAAAABiQUCAAAAAQkEAACmCwAgCAAApQsAIBwAAKcLACCOBAEAAAABpwQBAAAAAbIEQAAAAAHbBAEAAAABgQUAAACMBQKKBQEAAAABAgAAAAsAIE8AAOgPACADAAAACwAgTwAA6A8AIFAAAOcPACABSAAAuhAAMAIAAAALACBIAADnDwAgAgAAANALACBIAADmDwAgBo4EAQC7CAAhpwQBALsIACGyBEAAvQgAIdsEAQC7CAAhgQUAAJ8LjAUiigUBALwIACEJBAAAogsAIAgAAKELACAcAACjCwAgjgQBALsIACGnBAEAuwgAIbIEQAC9CAAh2wQBALsIACGBBQAAnwuMBSKKBQEAvAgAIQkEAACmCwAgCAAApQsAIBwAAKcLACCOBAEAAAABpwQBAAAAAbIEQAAAAAHbBAEAAAABgQUAAACMBQKKBQEAAAABCwYAANULACAHAADWCwAgGAAA1wsAIBsAANgLACCOBAEAAAABlQRAAAAAAbMEAQAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAGNBQEAAAABAgAAAD4AIE8AAPEPACADAAAAPgAgTwAA8Q8AIFAAAPAPACABSAAAuRAAMAIAAAA-ACBIAADwDwAgAgAAAMUNACBIAADvDwAgB44EAQC7CAAhlQRAAL0IACGzBAEAvAgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIY0FAQC8CAAhCwYAAKwLACAHAACtCwAgGAAArgsAIBsAAK8LACCOBAEAuwgAIZUEQAC9CAAhswQBALwIACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGNBQEAvAgAIQsGAADVCwAgBwAA1gsAIBgAANcLACAbAADYCwAgjgQBAAAAAZUEQAAAAAGzBAEAAAABvARAAAAAAekEAQAAAAGMBQEAAAABjQUBAAAAASQFAADhDQAgDQAA6g0AIB0AAOINACAeAADjDQAgHwAA5A0AICAAAOUNACAhAADmDQAgIgAA5w0AICMAAOgNACAkAADpDQAgKQAA7A0AICoAAOsNACArAADtDQAgLAAA7g0AIC0AAO8NACAuAADwDQAgLwAA8Q0AIDMAAPINACA0AADzDQAgNQAA9A0AIDYAAPUNACA3AAD2DQAgOAAA9w0AII4EAQAAAAGVBEAAAAABrQQAAACZBQK8BEAAAAAB_AQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKWBQEAAAABlwUBAAAAAZkFAQAAAAGaBQEAAAABmwVAAAAAAQIAAAAFACBPAAD9DwAgAwAAAAUAIE8AAP0PACBQAAD8DwAgAUgAALgQADArAwAA8QcAIAUAALUIACANAADeBwAgHQAA2AcAIB4AANgHACAfAADXBwAgIAAA3QcAICEAAN0HACAiAADfBwAgIwAA4AcAICQAAOEHACApAADlBwAgKgAA4wcAICsAANsHACAsAADcBwAgLQAA5gcAIC4AAOYHACAvAADoBwAgMwAA6gcAIDQAAOsHACA1AAC2CAAgNgAA7AcAIDcAAO0HACA4AADtBwAgiwQAALMIADCMBAAAAwAQjQQAALMIADCOBAEAAAABjwQBAL8HACGVBEAAwQcAIa0EAAC0CJkFIrwEQADBBwAh_AQBAMMHACH-BAEAwAcAIf8EAQDDBwAhgQUAAJsIgQUilgUBAMMHACGXBQEAwwcAIZkFAQDABwAhmgUBAMMHACGbBUAAwgcAIasFAACxCAAgrAUAALIIACACAAAABQAgSAAA_A8AIAIAAAD6DwAgSAAA-w8AIBGLBAAA-Q8AMIwEAAD6DwAQjQQAAPkPADCOBAEAvwcAIY8EAQC_BwAhlQRAAMEHACGtBAAAtAiZBSK8BEAAwQcAIfwEAQDDBwAh_gQBAMAHACH_BAEAwwcAIYEFAACbCIEFIpYFAQDDBwAhlwUBAMMHACGZBQEAwAcAIZoFAQDDBwAhmwVAAMIHACERiwQAAPkPADCMBAAA-g8AEI0EAAD5DwAwjgQBAL8HACGPBAEAvwcAIZUEQADBBwAhrQQAALQImQUivARAAMEHACH8BAEAwwcAIf4EAQDABwAh_wQBAMMHACGBBQAAmwiBBSKWBQEAwwcAIZcFAQDDBwAhmQUBAMAHACGaBQEAwwcAIZsFQADCBwAhDY4EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACEkBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIQAA8QsAICIAAPILACAjAADzCwAgJAAA9AsAICkAAPcLACAqAAD2CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACCOBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhJAUAAOENACANAADqDQAgHQAA4g0AIB4AAOMNACAfAADkDQAgIAAA5Q0AICEAAOYNACAiAADnDQAgIwAA6A0AICQAAOkNACApAADsDQAgKgAA6w0AICsAAO0NACAsAADuDQAgLQAA7w0AIC4AAPANACAvAADxDQAgMwAA8g0AIDQAAPMNACA1AAD0DQAgNgAA9Q0AIDcAAPYNACA4AAD3DQAgjgQBAAAAAZUEQAAAAAGtBAAAAJkFArwEQAAAAAH8BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFApYFAQAAAAGXBQEAAAABmQUBAAAAAZoFAQAAAAGbBUAAAAABBE8AAPIPADCvBQAA8w8AMLEFAAD1DwAgtQUAAPYPADAETwAA6Q8AMK8FAADqDwAwsQUAAOwPACC1BQAAwQ0AMARPAADgDwAwrwUAAOEPADCxBQAA4w8AILUFAADMCwAwBE8AANQPADCvBQAA1Q8AMLEFAADXDwAgtQUAANgPADAETwAAyA8AMK8FAADJDwAwsQUAAMsPACC1BQAAzA8AMARPAAC_DwAwrwUAAMAPADCxBQAAwg8AILUFAADtDAAwBE8AALYPADCvBQAAtw8AMLEFAAC5DwAgtQUAAOEMADAETwAArQ8AMK8FAACuDwAwsQUAALAPACC1BQAAwAsAMARPAACkDwAwrwUAAKUPADCxBQAApw8AILUFAACJCgAwBE8AAJsPADCvBQAAnA8AMLEFAACeDwAgtQUAAP0JADAETwAAkg8AMK8FAACTDwAwsQUAAJUPACC1BQAA8QkAMARPAACJDwAwrwUAAIoPADCxBQAAjA8AILUFAADlCQAwBE8AAP0OADCvBQAA_g4AMLEFAACADwAgtQUAAIEPADAETwAA9A4AMK8FAAD1DgAwsQUAAPcOACC1BQAA4QoAMARPAADrDgAwrwUAAOwOADCxBQAA7g4AILUFAADVCgAwBE8AAOIOADCvBQAA4w4AMLEFAADlDgAgtQUAALQKADAETwAA2Q4AMK8FAADaDgAwsQUAANwOACC1BQAA0gkAMARPAADNDgAwrwUAAM4OADCxBQAA0A4AILUFAADRDgAwBE8AAMQOADCvBQAAxQ4AMLEFAADHDgAgtQUAAIkJADAETwAAuA4AMK8FAAC5DgAwsQUAALsOACC1BQAAvA4AMARPAACvDgAwrwUAALAOADCxBQAAsg4AILUFAADlCAAwBE8AAKYOADCvBQAApw4AMLEFAACpDgAgtQUAALEMADAETwAAnQ4AMK8FAACeDgAwsQUAAKAOACC1BQAAmQwAMARPAACUDgAwrwUAAJUOADCxBQAAlw4AILUFAAC0CwAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhYAAKYQACAYAACdEAAgGwAArRAAICIAAJ8QACAjAACgEAAgJAAAoRAAICkAAKQQACAqAACiEAAgKwAAmxAAICwAAJwQACAvAACoEAAgMQAAqhAAIDQAAKsQACA2AACsEAAgOQAAlhAAIDoAAJcQACA7AACYEAAgPAAAmRAAID0AAJoQACA-AACeEAAgPwAAoxAAIEAAAKUQACBBAACnEAAgQgAAqRAAIJwFAAC3CAAgnQUAALcIACAeAwAArhAAIAUAALYQACANAACeEAAgHQAAmBAAIB4AAJgQACAfAACXEAAgIAAAnRAAICEAAJ0QACAiAACfEAAgIwAAoBAAICQAAKEQACApAAClEAAgKgAAoxAAICsAAJsQACAsAACcEAAgLQAAphAAIC4AAKYQACAvAACoEAAgMwAAqhAAIDQAAKsQACA1AAC3EAAgNgAArBAAIDcAAK0QACA4AACtEAAg_AQAALcIACD_BAAAtwgAIJYFAAC3CAAglwUAALcIACCaBQAAtwgAIJsFAAC3CAAgBAMAAK4QACAxAACqEAAgswQAALcIACC7BAAAtwgAIAUDAACuEAAgLwAAqBAAILMEAAC3CAAgxQQAALcIACDGBAAAtwgAIAYDAACuEAAgJgAAsxAAICgAAKUQACCzBAAAtwgAIMYEAAC3CAAg6gQAALcIACAFAwAArhAAICUAAKMQACApAACkEAAgswQAALcIACDvBAAAtwgAIAcDAACuEAAgBgAArxAAIAcAAJgQACAYAACdEAAgGwAArRAAILMEAAC3CAAgjQUAALcIACATAwAArhAAIAgAALQQACAJAACvEAAgCgAArxAAIA0AAJ4QACAPAACfEAAgEQAAoBAAIBMAAKEQACAWAACmEAAgsQQAALcIACCzBAAAtwgAINsEAAC3CAAg3AQAALcIACDdBAAAtwgAIN4EAAC3CAAg3wQAALcIACDgBAAAtwgAIOEEAAC3CAAg4gQAALcIACAEAwAArhAAIAQAAK8QACD4BAAAtwgAIPsEAAC3CAAgAA2OBAEAAAABlQRAAAAAAa0EAAAAmQUCvARAAAAAAfwEAQAAAAH-BAEAAAAB_wQBAAAAAYEFAAAAgQUClgUBAAAAAZcFAQAAAAGZBQEAAAABmgUBAAAAAZsFQAAAAAEHjgQBAAAAAZUEQAAAAAGzBAEAAAABvARAAAAAAekEAQAAAAGMBQEAAAABjQUBAAAAAQaOBAEAAAABpwQBAAAAAbIEQAAAAAHbBAEAAAABgQUAAACMBQKKBQEAAAABBY4EAQAAAAGqBAEAAAAB7wQBAAAAAYgFAgAAAAGJBQIAAAABCY4EAQAAAAGnBAEAAAABvARAAAAAAfYEAgAAAAH3BAIAAAAB-AQBAAAAAfkEAgAAAAH6BAIAAAAB-wRAAAAAAQiOBAEAAAABlQRAAAAAAacEAQAAAAHwBAIAAAAB8gQAAADyBALzBAEAAAAB9AQBAAAAAfUEAQAAAAEIjgQBAAAAAZUEQAAAAAGnBAEAAAAB8AQCAAAAAfIEAAAA8gQC8wQBAAAAAfQEAQAAAAH1BAEAAAABFAUCAAAAAY4EAQAAAAGVBEAAAAABqgQBAAAAAa0EAAAA0QQCsQRAAAAAAbMEAQAAAAG2BAIAAAABtwQCAAAAAbwEQAAAAAHaBAAAANoEAtsEAQAAAAHcBAEAAAAB3QQBAAAAAd4EEAAAAAHfBEAAAAAB4ARAAAAAAeEEQAAAAAHiBEAAAAAB4wQCAAAAAQmOBAEAAAABlQRAAAAAAcgEAQAAAAHJBAEAAAABywQAAADLBALMBAIAAAABzQQBAAAAAc4EAgAAAAHPBAIAAAABBo4EAQAAAAGVBEAAAAABqwQBAAAAAbwEQAAAAAHIBAEAAAAB2AQBAAAAAQiOBAEAAAABlQRAAAAAAcgEAQAAAAHTBAEAAAAB1AQBAAAAAdUEAQAAAAHWBAEAAAAB1wQCAAAAAQiOBAEAAAABkAQBAAAAAZEEAQAAAAGVBEAAAAABwAQBAAAAAcgEAQAAAAHRBAAAANEEA9IEAAAA0QQDDI4EAQAAAAGVBEAAAAABqQQAAADuBAKqBAEAAAABrQQAAADIBAKzBAEAAAABtgQCAAAAAbcEAgAAAAG8BEAAAAAB7AQBAAAAAe4EgAAAAAHvBAEAAAABBQWAAAAAAY4EAQAAAAGnBAEAAAAB6gQBAAAAAesEQAAAAAEGjgQBAAAAAZUEQAAAAAGzBAEAAAABxgQBAAAAAekEAQAAAAHqBAEAAAABBI4EAQAAAAGnBAEAAAABuwQBAAAAAegEQAAAAAEIjgQBAAAAAZUEQAAAAAGpBAAAAOcEAsgEAQAAAAHOBAIAAAAB5AQBAAAAAeUEAQAAAAHnBAEAAAABCo4EAQAAAAGVBEAAAAABqQQAAADFBAKqBAEAAAABrQQAAADIBAKzBAEAAAABvARAAAAAAb8EAgAAAAHFBAIAAAABxgQBAAAAAQmOBAEAAAABpwQBAAAAAa0EAAAAvwQCvQQBAAAAAb8EAgAAAAHABAEAAAABwQQBAAAAAcIEQAAAAAHDBEAAAAABDY4EAQAAAAGVBEAAAAABqgQBAAAAAa0EAAAAuwQCswQBAAAAAbQEAQAAAAG1BAIAAAABtgQCAAAAAbcEAgAAAAG4BEAAAAABuQRAAAAAAbsEAQAAAAG8BEAAAAABBwUCAAAAAY4EAQAAAAGnBAEAAAABrQQAAACxBAKvBAEAAAABsQRAAAAAAbIEQAAAAAEJSIAAAAABjgQBAAAAAZUEQAAAAAGnBAEAAAABqQQAAACpBAKqBAEAAAABqwQBAAAAAa0EAAAArQQCrgRAAAAAAQhIgAAAAAGOBAEAAAABkAQBAAAAAZEEAQAAAAGSBAEAAAABkwQBAAAAAZQEAQAAAAGVBEAAAAABDo4EAQAAAAGVBEAAAAABrQQAAACDBQLbBAEAAAAB_AQBAAAAAf0EAQAAAAH-BAEAAAAB_wQBAAAAAYEFAAAAgQUCgwUBAAAAAYQFAQAAAAGFBUAAAAABhgVAAAAAAYcFQAAAAAEhFgAAjhAAIBgAAIUQACAbAACVEAAgIgAAhxAAICMAAIgQACAkAACJEAAgKQAAjBAAICoAAIoQACArAACDEAAgLAAAhBAAIC8AAJAQACAxAACSEAAgNAAAkxAAIDYAAJQQACA6AAD_DwAgOwAAgBAAIDwAAIEQACA9AACCEAAgPgAAhhAAID8AAIsQACBAAACNEAAgQQAAjxAAIEIAAJEQACCOBAEAAAABlQRAAAAAAbwEQAAAAAHpBAEAAAABjAUBAAAAAZkFAQAAAAGaBQEAAAABnAUBAAAAAZ0FAQAAAAGeBSAAAAABAgAAAAEAIE8AANAQACAGjgQBAAAAAY8EAQAAAAGyBEAAAAAB2wQBAAAAAYEFAAAAjAUCigUBAAAAAQaOBAEAAAABjwQBAAAAAacEAQAAAAGyBEAAAAAB2wQBAAAAAYEFAAAAjAUCB44EAQAAAAGPBAEAAAABlQRAAAAAAbMEAQAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAEUBQIAAAABjgQBAAAAAY8EAQAAAAGVBEAAAAABqgQBAAAAAa0EAAAA0QQCsQRAAAAAAbMEAQAAAAG2BAIAAAABtwQCAAAAAbwEQAAAAAHaBAAAANoEAtsEAQAAAAHdBAEAAAAB3gQQAAAAAd8EQAAAAAHgBEAAAAAB4QRAAAAAAeIEQAAAAAHjBAIAAAABFAUCAAAAAY4EAQAAAAGPBAEAAAABlQRAAAAAAaoEAQAAAAGtBAAAANEEArEEQAAAAAGzBAEAAAABtgQCAAAAAbcEAgAAAAG8BEAAAAAB2gQAAADaBALbBAEAAAAB3AQBAAAAAd4EEAAAAAHfBEAAAAAB4ARAAAAAAeEEQAAAAAHiBEAAAAAB4wQCAAAAAQaOBAEAAAABjwQBAAAAAZUEQAAAAAGrBAEAAAABvARAAAAAAcgEAQAAAAEIjgQBAAAAAY8EAQAAAAGVBEAAAAAByAQBAAAAAdQEAQAAAAHVBAEAAAAB1gQBAAAAAdcEAgAAAAEIjgQBAAAAAY8EAQAAAAGRBAEAAAABlQRAAAAAAcAEAQAAAAHIBAEAAAAB0QQAAADRBAPSBAAAANEEAwmOBAEAAAABjwQBAAAAAZUEQAAAAAHIBAEAAAABywQAAADLBALMBAIAAAABzQQBAAAAAc4EAgAAAAHPBAIAAAABBQWAAAAAAY4EAQAAAAGPBAEAAAAB6gQBAAAAAesEQAAAAAEEjgQBAAAAAY8EAQAAAAG7BAEAAAAB6ARAAAAAAQiOBAEAAAABjwQBAAAAAZUEQAAAAAHwBAIAAAAB8gQAAADyBALzBAEAAAAB9AQBAAAAAfUEAQAAAAEIjgQBAAAAAY8EAQAAAAGVBEAAAAAB8AQCAAAAAfIEAAAA8gQC8wQBAAAAAfQEAQAAAAH1BAEAAAABCI4EAQAAAAGPBAEAAAABlQRAAAAAAakEAAAA5wQCyAQBAAAAAc4EAgAAAAHlBAEAAAAB5wQBAAAAAQiOBAEAAAABjwQBAAAAAZUEQAAAAAGpBAAAAOcEAsgEAQAAAAHOBAIAAAAB5AQBAAAAAecEAQAAAAEJjgQBAAAAAY8EAQAAAAGtBAAAAL8EAr0EAQAAAAG_BAIAAAABwAQBAAAAAcEEAQAAAAHCBEAAAAABwwRAAAAAAQcFAgAAAAGOBAEAAAABjwQBAAAAAa0EAAAAsQQCrwQBAAAAAbEEQAAAAAGyBEAAAAABCUiAAAAAAY4EAQAAAAGPBAEAAAABlQRAAAAAAakEAAAAqQQCqgQBAAAAAasEAQAAAAGtBAAAAK0EAq4EQAAAAAEGjgQBAAAAAZQEAQAAAAGVBEAAAAABhQVAAAAAAYcFQAAAAAGOBQEAAAABCEiAAAAAAY4EAQAAAAGPBAEAAAABkQQBAAAAAZIEAQAAAAGTBAEAAAABlAQBAAAAAZUEQAAAAAEOjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACDBQLbBAEAAAAB_AQBAAAAAf0EAQAAAAH-BAEAAAAB_wQBAAAAAYEFAAAAgQUChAUBAAAAAYUFQAAAAAGGBUAAAAABhwVAAAAAAQ6OBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAIMFAtsEAQAAAAH8BAEAAAAB_QQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKDBQEAAAABhQVAAAAAAYYFQAAAAAGHBUAAAAABAwAAANEBACBPAADQEAAgUAAA6hAAICMAAADRAQAgFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDYAAJIOACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACBIAADqEAAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACEhFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDYAAJIOACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISUDAADgDQAgBQAA4Q0AIA0AAOoNACAdAADiDQAgHgAA4w0AIB8AAOQNACAgAADlDQAgIQAA5g0AICIAAOcNACAjAADoDQAgJAAA6Q0AICkAAOwNACAqAADrDQAgKwAA7Q0AICwAAO4NACAtAADvDQAgLgAA8A0AIC8AAPENACAzAADyDQAgNAAA8w0AIDYAAPUNACA3AAD2DQAgOAAA9w0AII4EAQAAAAGPBAEAAAABlQRAAAAAAa0EAAAAmQUCvARAAAAAAfwEAQAAAAH-BAEAAAAB_wQBAAAAAYEFAAAAgQUClgUBAAAAAZcFAQAAAAGZBQEAAAABmgUBAAAAAZsFQAAAAAECAAAABQAgTwAA6xAAIAMAAAADACBPAADrEAAgUAAA7xAAICcAAAADACADAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIQAA8QsAICIAAPILACAjAADzCwAgJAAA9AsAICkAAPcLACAqAAD2CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDYAAIAMACA3AACBDAAgOAAAggwAIEgAAO8QACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACElAwAA6wsAIAUAAOwLACANAAD1CwAgHQAA7QsAIB4AAO4LACAfAADvCwAgIAAA8AsAICEAAPELACAiAADyCwAgIwAA8wsAICQAAPQLACApAAD3CwAgKgAA9gsAICsAAPgLACAsAAD5CwAgLQAA-gsAIC4AAPsLACAvAAD8CwAgMwAA_QsAIDQAAP4LACA2AACADAAgNwAAgQwAIDgAAIIMACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACElAwAA4A0AIAUAAOENACANAADqDQAgHQAA4g0AIB4AAOMNACAgAADlDQAgIQAA5g0AICIAAOcNACAjAADoDQAgJAAA6Q0AICkAAOwNACAqAADrDQAgKwAA7Q0AICwAAO4NACAtAADvDQAgLgAA8A0AIC8AAPENACAzAADyDQAgNAAA8w0AIDUAAPQNACA2AAD1DQAgNwAA9g0AIDgAAPcNACCOBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAJkFArwEQAAAAAH8BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFApYFAQAAAAGXBQEAAAABmQUBAAAAAZoFAQAAAAGbBUAAAAABAgAAAAUAIE8AAPAQACAhFgAAjhAAIBgAAIUQACAbAACVEAAgIgAAhxAAICMAAIgQACAkAACJEAAgKQAAjBAAICoAAIoQACArAACDEAAgLAAAhBAAIC8AAJAQACAxAACSEAAgNAAAkxAAIDYAAJQQACA5AAD-DwAgOwAAgBAAIDwAAIEQACA9AACCEAAgPgAAhhAAID8AAIsQACBAAACNEAAgQQAAjxAAIEIAAJEQACCOBAEAAAABlQRAAAAAAbwEQAAAAAHpBAEAAAABjAUBAAAAAZkFAQAAAAGaBQEAAAABnAUBAAAAAZ0FAQAAAAGeBSAAAAABAgAAAAEAIE8AAPIQACAGjgQBAAAAAY8EAQAAAAGnBAEAAAABsgRAAAAAAYEFAAAAjAUCigUBAAAAARQFAgAAAAGOBAEAAAABjwQBAAAAAZUEQAAAAAGqBAEAAAABrQQAAADRBAKxBEAAAAABswQBAAAAAbYEAgAAAAG3BAIAAAABvARAAAAAAdoEAAAA2gQC3AQBAAAAAd0EAQAAAAHeBBAAAAAB3wRAAAAAAeAEQAAAAAHhBEAAAAAB4gRAAAAAAeMEAgAAAAEOjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACDBQL8BAEAAAAB_QQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKDBQEAAAABhAUBAAAAAYUFQAAAAAGGBUAAAAABhwVAAAAAAQMAAAADACBPAADwEAAgUAAA-RAAICcAAAADACADAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAIEgAAPkQACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACElAwAA6wsAIAUAAOwLACANAAD1CwAgHQAA7QsAIB4AAO4LACAgAADwCwAgIQAA8QsAICIAAPILACAjAADzCwAgJAAA9AsAICkAAPcLACAqAAD2CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACEDAAAA0QEAIE8AAPIQACBQAAD8EAAgIwAAANEBACAWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA7AAD-DQAgPAAA_w0AID0AAIAOACA-AACEDgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AIEgAAPwQACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISEWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA7AAD-DQAgPAAA_w0AID0AAIAOACA-AACEDgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhJQMAAOANACAFAADhDQAgDQAA6g0AIB0AAOINACAfAADkDQAgIAAA5Q0AICEAAOYNACAiAADnDQAgIwAA6A0AICQAAOkNACApAADsDQAgKgAA6w0AICsAAO0NACAsAADuDQAgLQAA7w0AIC4AAPANACAvAADxDQAgMwAA8g0AIDQAAPMNACA1AAD0DQAgNgAA9Q0AIDcAAPYNACA4AAD3DQAgjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACZBQK8BEAAAAAB_AQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKWBQEAAAABlwUBAAAAAZkFAQAAAAGaBQEAAAABmwVAAAAAAQIAAAAFACBPAAD9EAAgJQMAAOANACAFAADhDQAgDQAA6g0AIB4AAOMNACAfAADkDQAgIAAA5Q0AICEAAOYNACAiAADnDQAgIwAA6A0AICQAAOkNACApAADsDQAgKgAA6w0AICsAAO0NACAsAADuDQAgLQAA7w0AIC4AAPANACAvAADxDQAgMwAA8g0AIDQAAPMNACA1AAD0DQAgNgAA9Q0AIDcAAPYNACA4AAD3DQAgjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACZBQK8BEAAAAAB_AQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKWBQEAAAABlwUBAAAAAZkFAQAAAAGaBQEAAAABmwVAAAAAAQIAAAAFACBPAAD_EAAgDAMAANQLACAGAADVCwAgGAAA1wsAIBsAANgLACCOBAEAAAABjwQBAAAAAZUEQAAAAAGzBAEAAAABvARAAAAAAekEAQAAAAGMBQEAAAABjQUBAAAAAQIAAAA-ACBPAACBEQAgIRYAAI4QACAYAACFEAAgGwAAlRAAICIAAIcQACAjAACIEAAgJAAAiRAAICkAAIwQACAqAACKEAAgKwAAgxAAICwAAIQQACAvAACQEAAgMQAAkhAAIDQAAJMQACA2AACUEAAgOQAA_g8AIDoAAP8PACA8AACBEAAgPQAAghAAID4AAIYQACA_AACLEAAgQAAAjRAAIEEAAI8QACBCAACREAAgjgQBAAAAAZUEQAAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAGZBQEAAAABmgUBAAAAAZwFAQAAAAGdBQEAAAABngUgAAAAAQIAAAABACBPAACDEQAgAwAAAAMAIE8AAP0QACBQAACHEQAgJwAAAAMAIAMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAfAADvCwAgIAAA8AsAICEAAPELACAiAADyCwAgIwAA8wsAICQAAPQLACApAAD3CwAgKgAA9gsAICsAAPgLACAsAAD5CwAgLQAA-gsAIC4AAPsLACAvAAD8CwAgMwAA_QsAIDQAAP4LACA1AAD_CwAgNgAAgAwAIDcAAIEMACA4AACCDAAgSAAAhxEAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAISUDAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAIQMAAAADACBPAAD_EAAgUAAAihEAICcAAAADACADAADrCwAgBQAA7AsAIA0AAPULACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAIEgAAIoRACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACElAwAA6wsAIAUAAOwLACANAAD1CwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIQAA8QsAICIAAPILACAjAADzCwAgJAAA9AsAICkAAPcLACAqAAD2CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACEDAAAAEwAgTwAAgREAIFAAAI0RACAOAAAAEwAgAwAAqwsAIAYAAKwLACAYAACuCwAgGwAArwsAIEgAAI0RACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGzBAEAvAgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIY0FAQC8CAAhDAMAAKsLACAGAACsCwAgGAAArgsAIBsAAK8LACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGzBAEAvAgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIY0FAQC8CAAhAwAAANEBACBPAACDEQAgUAAAkBEAICMAAADRAQAgFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDYAAJIOACA5AAD8DQAgOgAA_Q0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACBIAACQEQAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACEhFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDYAAJIOACA5AAD8DQAgOgAA_Q0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISEWAACOEAAgGAAAhRAAIBsAAJUQACAiAACHEAAgIwAAiBAAICQAAIkQACApAACMEAAgKgAAihAAICsAAIMQACAsAACEEAAgLwAAkBAAIDEAAJIQACA0AACTEAAgNgAAlBAAIDkAAP4PACA6AAD_DwAgOwAAgBAAID0AAIIQACA-AACGEAAgPwAAixAAIEAAAI0QACBBAACPEAAgQgAAkRAAII4EAQAAAAGVBEAAAAABvARAAAAAAekEAQAAAAGMBQEAAAABmQUBAAAAAZoFAQAAAAGcBQEAAAABnQUBAAAAAZ4FIAAAAAECAAAAAQAgTwAAkREAIAMAAADRAQAgTwAAkREAIFAAAJURACAjAAAA0QEAIBYAAIwOACAYAACDDgAgGwAAkw4AICIAAIUOACAjAACGDgAgJAAAhw4AICkAAIoOACAqAACIDgAgKwAAgQ4AICwAAIIOACAvAACODgAgMQAAkA4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPQAAgA4AID4AAIQOACA_AACJDgAgQAAAiw4AIEEAAI0OACBCAACPDgAgSAAAlREAII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhIRYAAIwOACAYAACDDgAgGwAAkw4AICIAAIUOACAjAACGDgAgJAAAhw4AICkAAIoOACAqAACIDgAgKwAAgQ4AICwAAIIOACAvAACODgAgMQAAkA4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPQAAgA4AID4AAIQOACA_AACJDgAgQAAAiw4AIEEAAI0OACBCAACPDgAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACElAwAA4A0AIAUAAOENACANAADqDQAgHQAA4g0AIB4AAOMNACAfAADkDQAgIAAA5Q0AICEAAOYNACAiAADnDQAgIwAA6A0AICQAAOkNACApAADsDQAgKgAA6w0AICsAAO0NACAsAADuDQAgLQAA7w0AIC4AAPANACAvAADxDQAgMwAA8g0AIDQAAPMNACA1AAD0DQAgNgAA9Q0AIDcAAPYNACCOBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAJkFArwEQAAAAAH8BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFApYFAQAAAAGXBQEAAAABmQUBAAAAAZoFAQAAAAGbBUAAAAABAgAAAAUAIE8AAJYRACAlAwAA4A0AIAUAAOENACANAADqDQAgHQAA4g0AIB4AAOMNACAfAADkDQAgIAAA5Q0AICEAAOYNACAiAADnDQAgIwAA6A0AICQAAOkNACApAADsDQAgKgAA6w0AICsAAO0NACAsAADuDQAgLQAA7w0AIC4AAPANACAvAADxDQAgMwAA8g0AIDQAAPMNACA1AAD0DQAgNgAA9Q0AIDgAAPcNACCOBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAJkFArwEQAAAAAH8BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFApYFAQAAAAGXBQEAAAABmQUBAAAAAZoFAQAAAAGbBUAAAAABAgAAAAUAIE8AAJgRACAMAwAA1AsAIAYAANULACAHAADWCwAgGAAA1wsAII4EAQAAAAGPBAEAAAABlQRAAAAAAbMEAQAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAGNBQEAAAABAgAAAD4AIE8AAJoRACAhFgAAjhAAIBgAAIUQACAiAACHEAAgIwAAiBAAICQAAIkQACApAACMEAAgKgAAihAAICsAAIMQACAsAACEEAAgLwAAkBAAIDEAAJIQACA0AACTEAAgNgAAlBAAIDkAAP4PACA6AAD_DwAgOwAAgBAAIDwAAIEQACA9AACCEAAgPgAAhhAAID8AAIsQACBAAACNEAAgQQAAjxAAIEIAAJEQACCOBAEAAAABlQRAAAAAAbwEQAAAAAHpBAEAAAABjAUBAAAAAZkFAQAAAAGaBQEAAAABnAUBAAAAAZ0FAQAAAAGeBSAAAAABAgAAAAEAIE8AAJwRACADAAAAAwAgTwAAlhEAIFAAAKARACAnAAAAAwAgAwAA6wsAIAUAAOwLACANAAD1CwAgHQAA7QsAIB4AAO4LACAfAADvCwAgIAAA8AsAICEAAPELACAiAADyCwAgIwAA8wsAICQAAPQLACApAAD3CwAgKgAA9gsAICsAAPgLACAsAAD5CwAgLQAA-gsAIC4AAPsLACAvAAD8CwAgMwAA_QsAIDQAAP4LACA1AAD_CwAgNgAAgAwAIDcAAIEMACBIAACgEQAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhJQMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhAwAAAAMAIE8AAJgRACBQAACjEQAgJwAAAAMAIAMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA4AACCDAAgSAAAoxEAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAISUDAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIQAA8QsAICIAAPILACAjAADzCwAgJAAA9AsAICkAAPcLACAqAAD2CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgOAAAggwAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAIQMAAAATACBPAACaEQAgUAAAphEAIA4AAAATACADAACrCwAgBgAArAsAIAcAAK0LACAYAACuCwAgSAAAphEAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIbMEAQC8CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhjQUBALwIACEMAwAAqwsAIAYAAKwLACAHAACtCwAgGAAArgsAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIbMEAQC8CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhjQUBALwIACEDAAAA0QEAIE8AAJwRACBQAACpEQAgIwAAANEBACAWAACMDgAgGAAAgw4AICIAAIUOACAjAACGDgAgJAAAhw4AICkAAIoOACAqAACIDgAgKwAAgQ4AICwAAIIOACAvAACODgAgMQAAkA4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPAAA_w0AID0AAIAOACA-AACEDgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AIEgAAKkRACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISEWAACMDgAgGAAAgw4AICIAAIUOACAjAACGDgAgJAAAhw4AICkAAIoOACAqAACIDgAgKwAAgQ4AICwAAIIOACAvAACODgAgMQAAkA4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPAAA_w0AID0AAIAOACA-AACEDgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhJQMAAOANACANAADqDQAgHQAA4g0AIB4AAOMNACAfAADkDQAgIAAA5Q0AICEAAOYNACAiAADnDQAgIwAA6A0AICQAAOkNACApAADsDQAgKgAA6w0AICsAAO0NACAsAADuDQAgLQAA7w0AIC4AAPANACAvAADxDQAgMwAA8g0AIDQAAPMNACA1AAD0DQAgNgAA9Q0AIDcAAPYNACA4AAD3DQAgjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACZBQK8BEAAAAAB_AQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKWBQEAAAABlwUBAAAAAZkFAQAAAAGaBQEAAAABmwVAAAAAAQIAAAAFACBPAACqEQAgIRYAAI4QACAYAACFEAAgGwAAlRAAICIAAIcQACAjAACIEAAgJAAAiRAAICkAAIwQACAqAACKEAAgKwAAgxAAICwAAIQQACAvAACQEAAgMQAAkhAAIDQAAJMQACA2AACUEAAgOQAA_g8AIDoAAP8PACA7AACAEAAgPAAAgRAAID4AAIYQACA_AACLEAAgQAAAjRAAIEEAAI8QACBCAACREAAgjgQBAAAAAZUEQAAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAGZBQEAAAABmgUBAAAAAZwFAQAAAAGdBQEAAAABngUgAAAAAQIAAAABACBPAACsEQAgAwAAAAMAIE8AAKoRACBQAACwEQAgJwAAAAMAIAMAAOsLACANAAD1CwAgHQAA7QsAIB4AAO4LACAfAADvCwAgIAAA8AsAICEAAPELACAiAADyCwAgIwAA8wsAICQAAPQLACApAAD3CwAgKgAA9gsAICsAAPgLACAsAAD5CwAgLQAA-gsAIC4AAPsLACAvAAD8CwAgMwAA_QsAIDQAAP4LACA1AAD_CwAgNgAAgAwAIDcAAIEMACA4AACCDAAgSAAAsBEAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAISUDAADrCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAIQMAAADRAQAgTwAArBEAIFAAALMRACAjAAAA0QEAIBYAAIwOACAYAACDDgAgGwAAkw4AICIAAIUOACAjAACGDgAgJAAAhw4AICkAAIoOACAqAACIDgAgKwAAgQ4AICwAAIIOACAvAACODgAgMQAAkA4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPAAA_w0AID4AAIQOACA_AACJDgAgQAAAiw4AIEEAAI0OACBCAACPDgAgSAAAsxEAII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhIRYAAIwOACAYAACDDgAgGwAAkw4AICIAAIUOACAjAACGDgAgJAAAhw4AICkAAIoOACAqAACIDgAgKwAAgQ4AICwAAIIOACAvAACODgAgMQAAkA4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPAAA_w0AID4AAIQOACA_AACJDgAgQAAAiw4AIEEAAI0OACBCAACPDgAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACElAwAA4A0AIAUAAOENACANAADqDQAgHQAA4g0AIB4AAOMNACAfAADkDQAgIAAA5Q0AICEAAOYNACAiAADnDQAgIwAA6A0AICQAAOkNACApAADsDQAgKgAA6w0AICwAAO4NACAtAADvDQAgLgAA8A0AIC8AAPENACAzAADyDQAgNAAA8w0AIDUAAPQNACA2AAD1DQAgNwAA9g0AIDgAAPcNACCOBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAJkFArwEQAAAAAH8BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFApYFAQAAAAGXBQEAAAABmQUBAAAAAZoFAQAAAAGbBUAAAAABAgAAAAUAIE8AALQRACAhFgAAjhAAIBgAAIUQACAbAACVEAAgIgAAhxAAICMAAIgQACAkAACJEAAgKQAAjBAAICoAAIoQACAsAACEEAAgLwAAkBAAIDEAAJIQACA0AACTEAAgNgAAlBAAIDkAAP4PACA6AAD_DwAgOwAAgBAAIDwAAIEQACA9AACCEAAgPgAAhhAAID8AAIsQACBAAACNEAAgQQAAjxAAIEIAAJEQACCOBAEAAAABlQRAAAAAAbwEQAAAAAHpBAEAAAABjAUBAAAAAZkFAQAAAAGaBQEAAAABnAUBAAAAAZ0FAQAAAAGeBSAAAAABAgAAAAEAIE8AALYRACADAAAAAwAgTwAAtBEAIFAAALoRACAnAAAAAwAgAwAA6wsAIAUAAOwLACANAAD1CwAgHQAA7QsAIB4AAO4LACAfAADvCwAgIAAA8AsAICEAAPELACAiAADyCwAgIwAA8wsAICQAAPQLACApAAD3CwAgKgAA9gsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACBIAAC6EQAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhJQMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACAsAAD5CwAgLQAA-gsAIC4AAPsLACAvAAD8CwAgMwAA_QsAIDQAAP4LACA1AAD_CwAgNgAAgAwAIDcAAIEMACA4AACCDAAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhAwAAANEBACBPAAC2EQAgUAAAvREAICMAAADRAQAgFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICoAAIgOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACBIAAC9EQAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACEhFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICoAAIgOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISUDAADgDQAgBQAA4Q0AIA0AAOoNACAdAADiDQAgHgAA4w0AIB8AAOQNACAgAADlDQAgIQAA5g0AICIAAOcNACAjAADoDQAgJAAA6Q0AICkAAOwNACAqAADrDQAgKwAA7Q0AIC0AAO8NACAuAADwDQAgLwAA8Q0AIDMAAPINACA0AADzDQAgNQAA9A0AIDYAAPUNACA3AAD2DQAgOAAA9w0AII4EAQAAAAGPBAEAAAABlQRAAAAAAa0EAAAAmQUCvARAAAAAAfwEAQAAAAH-BAEAAAAB_wQBAAAAAYEFAAAAgQUClgUBAAAAAZcFAQAAAAGZBQEAAAABmgUBAAAAAZsFQAAAAAECAAAABQAgTwAAvhEAICEWAACOEAAgGAAAhRAAIBsAAJUQACAiAACHEAAgIwAAiBAAICQAAIkQACApAACMEAAgKgAAihAAICsAAIMQACAvAACQEAAgMQAAkhAAIDQAAJMQACA2AACUEAAgOQAA_g8AIDoAAP8PACA7AACAEAAgPAAAgRAAID0AAIIQACA-AACGEAAgPwAAixAAIEAAAI0QACBBAACPEAAgQgAAkRAAII4EAQAAAAGVBEAAAAABvARAAAAAAekEAQAAAAGMBQEAAAABmQUBAAAAAZoFAQAAAAGcBQEAAAABnQUBAAAAAZ4FIAAAAAECAAAAAQAgTwAAwBEAIAMAAAADACBPAAC-EQAgUAAAxBEAICcAAAADACADAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIQAA8QsAICIAAPILACAjAADzCwAgJAAA9AsAICkAAPcLACAqAAD2CwAgKwAA-AsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAIEgAAMQRACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACElAwAA6wsAIAUAAOwLACANAAD1CwAgHQAA7QsAIB4AAO4LACAfAADvCwAgIAAA8AsAICEAAPELACAiAADyCwAgIwAA8wsAICQAAPQLACApAAD3CwAgKgAA9gsAICsAAPgLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACEDAAAA0QEAIE8AAMARACBQAADHEQAgIwAAANEBACAWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAvAACODgAgMQAAkA4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPAAA_w0AID0AAIAOACA-AACEDgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AIEgAAMcRACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISEWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAvAACODgAgMQAAkA4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPAAA_w0AID0AAIAOACA-AACEDgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhIRYAAI4QACAYAACFEAAgGwAAlRAAICIAAIcQACAjAACIEAAgJAAAiRAAICkAAIwQACArAACDEAAgLAAAhBAAIC8AAJAQACAxAACSEAAgNAAAkxAAIDYAAJQQACA5AAD-DwAgOgAA_w8AIDsAAIAQACA8AACBEAAgPQAAghAAID4AAIYQACA_AACLEAAgQAAAjRAAIEEAAI8QACBCAACREAAgjgQBAAAAAZUEQAAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAGZBQEAAAABmgUBAAAAAZwFAQAAAAGdBQEAAAABngUgAAAAAQIAAAABACBPAADIEQAgBQWAAAAAAY4EAQAAAAGPBAEAAAABpwQBAAAAAesEQAAAAAEGjgQBAAAAAY8EAQAAAAGVBEAAAAABswQBAAAAAcYEAQAAAAHpBAEAAAABAwAAANEBACBPAADIEQAgUAAAzhEAICMAAADRAQAgFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACBIAADOEQAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACEhFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AIQ8DAADpCgAgKQAA6woAII4EAQAAAAGPBAEAAAABlQRAAAAAAakEAAAA7gQCqgQBAAAAAa0EAAAAyAQCswQBAAAAAbYEAgAAAAG3BAIAAAABvARAAAAAAewEAQAAAAHuBIAAAAAB7wQBAAAAAQIAAAClAQAgTwAAzxEAICUDAADgDQAgBQAA4Q0AIA0AAOoNACAdAADiDQAgHgAA4w0AIB8AAOQNACAgAADlDQAgIQAA5g0AICIAAOcNACAjAADoDQAgJAAA6Q0AICkAAOwNACArAADtDQAgLAAA7g0AIC0AAO8NACAuAADwDQAgLwAA8Q0AIDMAAPINACA0AADzDQAgNQAA9A0AIDYAAPUNACA3AAD2DQAgOAAA9w0AII4EAQAAAAGPBAEAAAABlQRAAAAAAa0EAAAAmQUCvARAAAAAAfwEAQAAAAH-BAEAAAAB_wQBAAAAAYEFAAAAgQUClgUBAAAAAZcFAQAAAAGZBQEAAAABmgUBAAAAAZsFQAAAAAECAAAABQAgTwAA0REAICEWAACOEAAgGAAAhRAAIBsAAJUQACAiAACHEAAgIwAAiBAAICQAAIkQACApAACMEAAgKgAAihAAICsAAIMQACAsAACEEAAgLwAAkBAAIDEAAJIQACA0AACTEAAgNgAAlBAAIDkAAP4PACA6AAD_DwAgOwAAgBAAIDwAAIEQACA9AACCEAAgPgAAhhAAIEAAAI0QACBBAACPEAAgQgAAkRAAII4EAQAAAAGVBEAAAAABvARAAAAAAekEAQAAAAGMBQEAAAABmQUBAAAAAZoFAQAAAAGcBQEAAAABnQUBAAAAAZ4FIAAAAAECAAAAAQAgTwAA0xEAIAMAAABPACBPAADPEQAgUAAA1xEAIBEAAABPACADAADOCgAgKQAA0AoAIEgAANcRACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGpBAAAzQruBCKqBAEAuwgAIa0EAACCCcgEIrMEAQC8CAAhtgQCANEIACG3BAIA0QgAIbwEQAC9CAAh7AQBALsIACHuBIAAAAAB7wQBALwIACEPAwAAzgoAICkAANAKACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGpBAAAzQruBCKqBAEAuwgAIa0EAACCCcgEIrMEAQC8CAAhtgQCANEIACG3BAIA0QgAIbwEQAC9CAAh7AQBALsIACHuBIAAAAAB7wQBALwIACEDAAAAAwAgTwAA0REAIFAAANoRACAnAAAAAwAgAwAA6wsAIAUAAOwLACANAAD1CwAgHQAA7QsAIB4AAO4LACAfAADvCwAgIAAA8AsAICEAAPELACAiAADyCwAgIwAA8wsAICQAAPQLACApAAD3CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACBIAADaEQAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhJQMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICsAAPgLACAsAAD5CwAgLQAA-gsAIC4AAPsLACAvAAD8CwAgMwAA_QsAIDQAAP4LACA1AAD_CwAgNgAAgAwAIDcAAIEMACA4AACCDAAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhAwAAANEBACBPAADTEQAgUAAA3REAICMAAADRAQAgFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDYAAJIOACA5AAD8DQAgOgAA_Q0AIDsAAP4NACA8AAD_DQAgPQAAgA4AID4AAIQOACBAAACLDgAgQQAAjQ4AIEIAAI8OACBIAADdEQAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACEhFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDYAAJIOACA5AAD8DQAgOgAA_Q0AIDsAAP4NACA8AAD_DQAgPQAAgA4AID4AAIQOACBAAACLDgAgQQAAjQ4AIEIAAI8OACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AIQ8DAADpCgAgJQAA6goAII4EAQAAAAGPBAEAAAABlQRAAAAAAakEAAAA7gQCqgQBAAAAAa0EAAAAyAQCswQBAAAAAbYEAgAAAAG3BAIAAAABvARAAAAAAewEAQAAAAHuBIAAAAAB7wQBAAAAAQIAAAClAQAgTwAA3hEAICEWAACOEAAgGAAAhRAAIBsAAJUQACAiAACHEAAgIwAAiBAAICQAAIkQACAqAACKEAAgKwAAgxAAICwAAIQQACAvAACQEAAgMQAAkhAAIDQAAJMQACA2AACUEAAgOQAA_g8AIDoAAP8PACA7AACAEAAgPAAAgRAAID0AAIIQACA-AACGEAAgPwAAixAAIEAAAI0QACBBAACPEAAgQgAAkRAAII4EAQAAAAGVBEAAAAABvARAAAAAAekEAQAAAAGMBQEAAAABmQUBAAAAAZoFAQAAAAGcBQEAAAABnQUBAAAAAZ4FIAAAAAECAAAAAQAgTwAA4BEAIASOBAEAAAABjwQBAAAAAacEAQAAAAHoBEAAAAABAwAAAE8AIE8AAN4RACBQAADlEQAgEQAAAE8AIAMAAM4KACAlAADPCgAgSAAA5REAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIakEAADNCu4EIqoEAQC7CAAhrQQAAIIJyAQiswQBALwIACG2BAIA0QgAIbcEAgDRCAAhvARAAL0IACHsBAEAuwgAIe4EgAAAAAHvBAEAvAgAIQ8DAADOCgAgJQAAzwoAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIakEAADNCu4EIqoEAQC7CAAhrQQAAIIJyAQiswQBALwIACG2BAIA0QgAIbcEAgDRCAAhvARAAL0IACHsBAEAuwgAIe4EgAAAAAHvBAEAvAgAIQMAAADRAQAgTwAA4BEAIFAAAOgRACAjAAAA0QEAIBYAAIwOACAYAACDDgAgGwAAkw4AICIAAIUOACAjAACGDgAgJAAAhw4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDYAAJIOACA5AAD8DQAgOgAA_Q0AIDsAAP4NACA8AAD_DQAgPQAAgA4AID4AAIQOACA_AACJDgAgQAAAiw4AIEEAAI0OACBCAACPDgAgSAAA6BEAII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhIRYAAIwOACAYAACDDgAgGwAAkw4AICIAAIUOACAjAACGDgAgJAAAhw4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDYAAJIOACA5AAD8DQAgOgAA_Q0AIDsAAP4NACA8AAD_DQAgPQAAgA4AID4AAIQOACA_AACJDgAgQAAAiw4AIEEAAI0OACBCAACPDgAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACEJAwAAvAoAICYAAL0KACCOBAEAAAABjwQBAAAAAZUEQAAAAAGzBAEAAAABxgQBAAAAAekEAQAAAAHqBAEAAAABAgAAAE0AIE8AAOkRACAlAwAA4A0AIAUAAOENACANAADqDQAgHQAA4g0AIB4AAOMNACAfAADkDQAgIAAA5Q0AICEAAOYNACAiAADnDQAgIwAA6A0AICQAAOkNACAqAADrDQAgKwAA7Q0AICwAAO4NACAtAADvDQAgLgAA8A0AIC8AAPENACAzAADyDQAgNAAA8w0AIDUAAPQNACA2AAD1DQAgNwAA9g0AIDgAAPcNACCOBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAJkFArwEQAAAAAH8BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFApYFAQAAAAGXBQEAAAABmQUBAAAAAZoFAQAAAAGbBUAAAAABAgAAAAUAIE8AAOsRACAhFgAAjhAAIBgAAIUQACAbAACVEAAgIgAAhxAAICMAAIgQACAkAACJEAAgKQAAjBAAICoAAIoQACArAACDEAAgLAAAhBAAIC8AAJAQACAxAACSEAAgNAAAkxAAIDYAAJQQACA5AAD-DwAgOgAA_w8AIDsAAIAQACA8AACBEAAgPQAAghAAID4AAIYQACA_AACLEAAgQQAAjxAAIEIAAJEQACCOBAEAAAABlQRAAAAAAbwEQAAAAAHpBAEAAAABjAUBAAAAAZkFAQAAAAGaBQEAAAABnAUBAAAAAZ0FAQAAAAGeBSAAAAABAgAAAAEAIE8AAO0RACADAAAASwAgTwAA6REAIFAAAPERACALAAAASwAgAwAArQoAICYAAK4KACBIAADxEQAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhswQBALwIACHGBAEAvAgAIekEAQC7CAAh6gQBALwIACEJAwAArQoAICYAAK4KACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGzBAEAvAgAIcYEAQC8CAAh6QQBALsIACHqBAEAvAgAIQMAAAADACBPAADrEQAgUAAA9BEAICcAAAADACADAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIQAA8QsAICIAAPILACAjAADzCwAgJAAA9AsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAIEgAAPQRACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACElAwAA6wsAIAUAAOwLACANAAD1CwAgHQAA7QsAIB4AAO4LACAfAADvCwAgIAAA8AsAICEAAPELACAiAADyCwAgIwAA8wsAICQAAPQLACAqAAD2CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACEDAAAA0QEAIE8AAO0RACBQAAD3EQAgIwAAANEBACAWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBBAACNDgAgQgAAjw4AIEgAAPcRACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISEWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBBAACNDgAgQgAAjw4AII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhHQMAAJEKACAFAgAAAAEIAACSCgAgCQAAkwoAIAoAAJQKACANAACVCgAgDwAAlgoAIBEAAJcKACATAACYCgAgjgQBAAAAAY8EAQAAAAGVBEAAAAABqgQBAAAAAa0EAAAA0QQCsQRAAAAAAbMEAQAAAAG2BAIAAAABtwQCAAAAAbwEQAAAAAHaBAAAANoEAtsEAQAAAAHcBAEAAAAB3QQBAAAAAd4EEAAAAAHfBEAAAAAB4ARAAAAAAeEEQAAAAAHiBEAAAAAB4wQCAAAAAQIAAAARACBPAAD4EQAgAwAAAA8AIE8AAPgRACBQAAD8EQAgHwAAAA8AIAMAAMUJACAFAgDRCAAhCAAAxgkAIAkAAMcJACAKAADICQAgDQAAyQkAIA8AAMoJACARAADLCQAgEwAAzAkAIEgAAPwRACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGqBAEAuwgAIa0EAADCCdEEIrEEQADHCAAhswQBALwIACG2BAIA0QgAIbcEAgDRCAAhvARAAL0IACHaBAAAwwnaBCLbBAEAvAgAIdwEAQC8CAAh3QQBALwIACHeBBAAxAkAId8EQADHCAAh4ARAAMcIACHhBEAAxwgAIeIEQADHCAAh4wQCANEIACEdAwAAxQkAIAUCANEIACEIAADGCQAgCQAAxwkAIAoAAMgJACANAADJCQAgDwAAygkAIBEAAMsJACATAADMCQAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqgQBALsIACGtBAAAwgnRBCKxBEAAxwgAIbMEAQC8CAAhtgQCANEIACG3BAIA0QgAIbwEQAC9CAAh2gQAAMMJ2gQi2wQBALwIACHcBAEAvAgAId0EAQC8CAAh3gQQAMQJACHfBEAAxwgAIeAEQADHCAAh4QRAAMcIACHiBEAAxwgAIeMEAgDRCAAhJQMAAOANACAFAADhDQAgDQAA6g0AIB0AAOINACAeAADjDQAgHwAA5A0AICAAAOUNACAiAADnDQAgIwAA6A0AICQAAOkNACApAADsDQAgKgAA6w0AICsAAO0NACAsAADuDQAgLQAA7w0AIC4AAPANACAvAADxDQAgMwAA8g0AIDQAAPMNACA1AAD0DQAgNgAA9Q0AIDcAAPYNACA4AAD3DQAgjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACZBQK8BEAAAAAB_AQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKWBQEAAAABlwUBAAAAAZkFAQAAAAGaBQEAAAABmwVAAAAAAQIAAAAFACBPAAD9EQAgJQMAAOANACAFAADhDQAgDQAA6g0AIB0AAOINACAeAADjDQAgHwAA5A0AICEAAOYNACAiAADnDQAgIwAA6A0AICQAAOkNACApAADsDQAgKgAA6w0AICsAAO0NACAsAADuDQAgLQAA7w0AIC4AAPANACAvAADxDQAgMwAA8g0AIDQAAPMNACA1AAD0DQAgNgAA9Q0AIDcAAPYNACA4AAD3DQAgjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACZBQK8BEAAAAAB_AQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKWBQEAAAABlwUBAAAAAZkFAQAAAAGaBQEAAAABmwVAAAAAAQIAAAAFACBPAAD_EQAgDAMAANQLACAGAADVCwAgBwAA1gsAIBsAANgLACCOBAEAAAABjwQBAAAAAZUEQAAAAAGzBAEAAAABvARAAAAAAekEAQAAAAGMBQEAAAABjQUBAAAAAQIAAAA-ACBPAACBEgAgIRYAAI4QACAbAACVEAAgIgAAhxAAICMAAIgQACAkAACJEAAgKQAAjBAAICoAAIoQACArAACDEAAgLAAAhBAAIC8AAJAQACAxAACSEAAgNAAAkxAAIDYAAJQQACA5AAD-DwAgOgAA_w8AIDsAAIAQACA8AACBEAAgPQAAghAAID4AAIYQACA_AACLEAAgQAAAjRAAIEEAAI8QACBCAACREAAgjgQBAAAAAZUEQAAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAGZBQEAAAABmgUBAAAAAZwFAQAAAAGdBQEAAAABngUgAAAAAQIAAAABACBPAACDEgAgCY4EAQAAAAGPBAEAAAABlQRAAAAAAckEAQAAAAHLBAAAAMsEAswEAgAAAAHNBAEAAAABzgQCAAAAAc8EAgAAAAEGjgQBAAAAAY8EAQAAAAGVBEAAAAABqwQBAAAAAbwEQAAAAAHYBAEAAAABCI4EAQAAAAGPBAEAAAABlQRAAAAAAdMEAQAAAAHUBAEAAAAB1QQBAAAAAdYEAQAAAAHXBAIAAAABCI4EAQAAAAGPBAEAAAABkAQBAAAAAZEEAQAAAAGVBEAAAAABwAQBAAAAAdEEAAAA0QQD0gQAAADRBAMlAwAA4A0AIAUAAOENACANAADqDQAgHQAA4g0AIB4AAOMNACAfAADkDQAgIAAA5Q0AICEAAOYNACAiAADnDQAgIwAA6A0AICQAAOkNACApAADsDQAgKgAA6w0AICsAAO0NACAsAADuDQAgLQAA7w0AIC8AAPENACAzAADyDQAgNAAA8w0AIDUAAPQNACA2AAD1DQAgNwAA9g0AIDgAAPcNACCOBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAJkFArwEQAAAAAH8BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFApYFAQAAAAGXBQEAAAABmQUBAAAAAZoFAQAAAAGbBUAAAAABAgAAAAUAIE8AAIkSACAlAwAA4A0AIAUAAOENACANAADqDQAgHQAA4g0AIB4AAOMNACAfAADkDQAgIAAA5Q0AICEAAOYNACAiAADnDQAgIwAA6A0AICQAAOkNACApAADsDQAgKgAA6w0AICsAAO0NACAsAADuDQAgLgAA8A0AIC8AAPENACAzAADyDQAgNAAA8w0AIDUAAPQNACA2AAD1DQAgNwAA9g0AIDgAAPcNACCOBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAJkFArwEQAAAAAH8BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFApYFAQAAAAGXBQEAAAABmQUBAAAAAZoFAQAAAAGbBUAAAAABAgAAAAUAIE8AAIsSACAhGAAAhRAAIBsAAJUQACAiAACHEAAgIwAAiBAAICQAAIkQACApAACMEAAgKgAAihAAICsAAIMQACAsAACEEAAgLwAAkBAAIDEAAJIQACA0AACTEAAgNgAAlBAAIDkAAP4PACA6AAD_DwAgOwAAgBAAIDwAAIEQACA9AACCEAAgPgAAhhAAID8AAIsQACBAAACNEAAgQQAAjxAAIEIAAJEQACCOBAEAAAABlQRAAAAAAbwEQAAAAAHpBAEAAAABjAUBAAAAAZkFAQAAAAGaBQEAAAABnAUBAAAAAZ0FAQAAAAGeBSAAAAABAgAAAAEAIE8AAI0SACADAAAAAwAgTwAAiRIAIFAAAJESACAnAAAAAwAgAwAA6wsAIAUAAOwLACANAAD1CwAgHQAA7QsAIB4AAO4LACAfAADvCwAgIAAA8AsAICEAAPELACAiAADyCwAgIwAA8wsAICQAAPQLACApAAD3CwAgKgAA9gsAICsAAPgLACAsAAD5CwAgLQAA-gsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACBIAACREgAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhJQMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAvAAD8CwAgMwAA_QsAIDQAAP4LACA1AAD_CwAgNgAAgAwAIDcAAIEMACA4AACCDAAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhAwAAAAMAIE8AAIsSACBQAACUEgAgJwAAAAMAIAMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC4AAPsLACAvAAD8CwAgMwAA_QsAIDQAAP4LACA1AAD_CwAgNgAAgAwAIDcAAIEMACA4AACCDAAgSAAAlBIAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAISUDAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIQAA8QsAICIAAPILACAjAADzCwAgJAAA9AsAICkAAPcLACAqAAD2CwAgKwAA-AsAICwAAPkLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAIQMAAADRAQAgTwAAjRIAIFAAAJcSACAjAAAA0QEAIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDYAAJIOACA5AAD8DQAgOgAA_Q0AIDsAAP4NACA8AAD_DQAgPQAAgA4AID4AAIQOACA_AACJDgAgQAAAiw4AIEEAAI0OACBCAACPDgAgSAAAlxIAII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhIRgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDYAAJIOACA5AAD8DQAgOgAA_Q0AIDsAAP4NACA8AAD_DQAgPQAAgA4AID4AAIQOACA_AACJDgAgQAAAiw4AIEEAAI0OACBCAACPDgAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACEIjgQBAAAAAY8EAQAAAAGVBEAAAAABqQQAAADnBALOBAIAAAAB5AQBAAAAAeUEAQAAAAHnBAEAAAABAwAAAAMAIE8AAP0RACBQAACbEgAgJwAAAAMAIAMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAiAADyCwAgIwAA8wsAICQAAPQLACApAAD3CwAgKgAA9gsAICsAAPgLACAsAAD5CwAgLQAA-gsAIC4AAPsLACAvAAD8CwAgMwAA_QsAIDQAAP4LACA1AAD_CwAgNgAAgAwAIDcAAIEMACA4AACCDAAgSAAAmxIAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAISUDAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAIQMAAAADACBPAAD_EQAgUAAAnhIAICcAAAADACADAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAIB8AAO8LACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAIEgAAJ4SACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACElAwAA6wsAIAUAAOwLACANAAD1CwAgHQAA7QsAIB4AAO4LACAfAADvCwAgIQAA8QsAICIAAPILACAjAADzCwAgJAAA9AsAICkAAPcLACAqAAD2CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACEDAAAAEwAgTwAAgRIAIFAAAKESACAOAAAAEwAgAwAAqwsAIAYAAKwLACAHAACtCwAgGwAArwsAIEgAAKESACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGzBAEAvAgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIY0FAQC8CAAhDAMAAKsLACAGAACsCwAgBwAArQsAIBsAAK8LACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGzBAEAvAgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIY0FAQC8CAAhAwAAANEBACBPAACDEgAgUAAApBIAICMAAADRAQAgFgAAjA4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACBIAACkEgAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACEhFgAAjA4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISUDAADgDQAgBQAA4Q0AIA0AAOoNACAdAADiDQAgHgAA4w0AIB8AAOQNACAgAADlDQAgIQAA5g0AICMAAOgNACAkAADpDQAgKQAA7A0AICoAAOsNACArAADtDQAgLAAA7g0AIC0AAO8NACAuAADwDQAgLwAA8Q0AIDMAAPINACA0AADzDQAgNQAA9A0AIDYAAPUNACA3AAD2DQAgOAAA9w0AII4EAQAAAAGPBAEAAAABlQRAAAAAAa0EAAAAmQUCvARAAAAAAfwEAQAAAAH-BAEAAAAB_wQBAAAAAYEFAAAAgQUClgUBAAAAAZcFAQAAAAGZBQEAAAABmgUBAAAAAZsFQAAAAAECAAAABQAgTwAApRIAIB0DAACRCgAgBQIAAAABCAAAkgoAIAkAAJMKACAKAACUCgAgDQAAlQoAIBEAAJcKACATAACYCgAgFgAAmQoAII4EAQAAAAGPBAEAAAABlQRAAAAAAaoEAQAAAAGtBAAAANEEArEEQAAAAAGzBAEAAAABtgQCAAAAAbcEAgAAAAG8BEAAAAAB2gQAAADaBALbBAEAAAAB3AQBAAAAAd0EAQAAAAHeBBAAAAAB3wRAAAAAAeAEQAAAAAHhBEAAAAAB4gRAAAAAAeMEAgAAAAECAAAAEQAgTwAApxIAICEWAACOEAAgGAAAhRAAIBsAAJUQACAjAACIEAAgJAAAiRAAICkAAIwQACAqAACKEAAgKwAAgxAAICwAAIQQACAvAACQEAAgMQAAkhAAIDQAAJMQACA2AACUEAAgOQAA_g8AIDoAAP8PACA7AACAEAAgPAAAgRAAID0AAIIQACA-AACGEAAgPwAAixAAIEAAAI0QACBBAACPEAAgQgAAkRAAII4EAQAAAAGVBEAAAAABvARAAAAAAekEAQAAAAGMBQEAAAABmQUBAAAAAZoFAQAAAAGcBQEAAAABnQUBAAAAAZ4FIAAAAAECAAAAAQAgTwAAqRIAIAMAAAADACBPAAClEgAgUAAArRIAICcAAAADACADAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIQAA8QsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAIEgAAK0SACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACElAwAA6wsAIAUAAOwLACANAAD1CwAgHQAA7QsAIB4AAO4LACAfAADvCwAgIAAA8AsAICEAAPELACAjAADzCwAgJAAA9AsAICkAAPcLACAqAAD2CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACEDAAAADwAgTwAApxIAIFAAALASACAfAAAADwAgAwAAxQkAIAUCANEIACEIAADGCQAgCQAAxwkAIAoAAMgJACANAADJCQAgEQAAywkAIBMAAMwJACAWAADNCQAgSAAAsBIAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIaoEAQC7CAAhrQQAAMIJ0QQisQRAAMcIACGzBAEAvAgAIbYEAgDRCAAhtwQCANEIACG8BEAAvQgAIdoEAADDCdoEItsEAQC8CAAh3AQBALwIACHdBAEAvAgAId4EEADECQAh3wRAAMcIACHgBEAAxwgAIeEEQADHCAAh4gRAAMcIACHjBAIA0QgAIR0DAADFCQAgBQIA0QgAIQgAAMYJACAJAADHCQAgCgAAyAkAIA0AAMkJACARAADLCQAgEwAAzAkAIBYAAM0JACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGqBAEAuwgAIa0EAADCCdEEIrEEQADHCAAhswQBALwIACG2BAIA0QgAIbcEAgDRCAAhvARAAL0IACHaBAAAwwnaBCLbBAEAvAgAIdwEAQC8CAAh3QQBALwIACHeBBAAxAkAId8EQADHCAAh4ARAAMcIACHhBEAAxwgAIeIEQADHCAAh4wQCANEIACEDAAAA0QEAIE8AAKkSACBQAACzEgAgIwAAANEBACAWAACMDgAgGAAAgw4AIBsAAJMOACAjAACGDgAgJAAAhw4AICkAAIoOACAqAACIDgAgKwAAgQ4AICwAAIIOACAvAACODgAgMQAAkA4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPAAA_w0AID0AAIAOACA-AACEDgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AIEgAALMSACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISEWAACMDgAgGAAAgw4AIBsAAJMOACAjAACGDgAgJAAAhw4AICkAAIoOACAqAACIDgAgKwAAgQ4AICwAAIIOACAvAACODgAgMQAAkA4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPAAA_w0AID0AAIAOACA-AACEDgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhJQMAAOANACAFAADhDQAgDQAA6g0AIB0AAOINACAeAADjDQAgHwAA5A0AICAAAOUNACAhAADmDQAgIgAA5w0AICQAAOkNACApAADsDQAgKgAA6w0AICsAAO0NACAsAADuDQAgLQAA7w0AIC4AAPANACAvAADxDQAgMwAA8g0AIDQAAPMNACA1AAD0DQAgNgAA9Q0AIDcAAPYNACA4AAD3DQAgjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACZBQK8BEAAAAAB_AQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKWBQEAAAABlwUBAAAAAZkFAQAAAAGaBQEAAAABmwVAAAAAAQIAAAAFACBPAAC0EgAgHQMAAJEKACAFAgAAAAEIAACSCgAgCQAAkwoAIAoAAJQKACANAACVCgAgDwAAlgoAIBMAAJgKACAWAACZCgAgjgQBAAAAAY8EAQAAAAGVBEAAAAABqgQBAAAAAa0EAAAA0QQCsQRAAAAAAbMEAQAAAAG2BAIAAAABtwQCAAAAAbwEQAAAAAHaBAAAANoEAtsEAQAAAAHcBAEAAAAB3QQBAAAAAd4EEAAAAAHfBEAAAAAB4ARAAAAAAeEEQAAAAAHiBEAAAAAB4wQCAAAAAQIAAAARACBPAAC2EgAgIRYAAI4QACAYAACFEAAgGwAAlRAAICIAAIcQACAkAACJEAAgKQAAjBAAICoAAIoQACArAACDEAAgLAAAhBAAIC8AAJAQACAxAACSEAAgNAAAkxAAIDYAAJQQACA5AAD-DwAgOgAA_w8AIDsAAIAQACA8AACBEAAgPQAAghAAID4AAIYQACA_AACLEAAgQAAAjRAAIEEAAI8QACBCAACREAAgjgQBAAAAAZUEQAAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAGZBQEAAAABmgUBAAAAAZwFAQAAAAGdBQEAAAABngUgAAAAAQIAAAABACBPAAC4EgAgAwAAAAMAIE8AALQSACBQAAC8EgAgJwAAAAMAIAMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICQAAPQLACApAAD3CwAgKgAA9gsAICsAAPgLACAsAAD5CwAgLQAA-gsAIC4AAPsLACAvAAD8CwAgMwAA_QsAIDQAAP4LACA1AAD_CwAgNgAAgAwAIDcAAIEMACA4AACCDAAgSAAAvBIAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAISUDAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIQAA8QsAICIAAPILACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAIQMAAAAPACBPAAC2EgAgUAAAvxIAIB8AAAAPACADAADFCQAgBQIA0QgAIQgAAMYJACAJAADHCQAgCgAAyAkAIA0AAMkJACAPAADKCQAgEwAAzAkAIBYAAM0JACBIAAC_EgAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqgQBALsIACGtBAAAwgnRBCKxBEAAxwgAIbMEAQC8CAAhtgQCANEIACG3BAIA0QgAIbwEQAC9CAAh2gQAAMMJ2gQi2wQBALwIACHcBAEAvAgAId0EAQC8CAAh3gQQAMQJACHfBEAAxwgAIeAEQADHCAAh4QRAAMcIACHiBEAAxwgAIeMEAgDRCAAhHQMAAMUJACAFAgDRCAAhCAAAxgkAIAkAAMcJACAKAADICQAgDQAAyQkAIA8AAMoJACATAADMCQAgFgAAzQkAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIaoEAQC7CAAhrQQAAMIJ0QQisQRAAMcIACGzBAEAvAgAIbYEAgDRCAAhtwQCANEIACG8BEAAvQgAIdoEAADDCdoEItsEAQC8CAAh3AQBALwIACHdBAEAvAgAId4EEADECQAh3wRAAMcIACHgBEAAxwgAIeEEQADHCAAh4gRAAMcIACHjBAIA0QgAIQMAAADRAQAgTwAAuBIAIFAAAMISACAjAAAA0QEAIBYAAIwOACAYAACDDgAgGwAAkw4AICIAAIUOACAkAACHDgAgKQAAig4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDYAAJIOACA5AAD8DQAgOgAA_Q0AIDsAAP4NACA8AAD_DQAgPQAAgA4AID4AAIQOACA_AACJDgAgQAAAiw4AIEEAAI0OACBCAACPDgAgSAAAwhIAII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhIRYAAIwOACAYAACDDgAgGwAAkw4AICIAAIUOACAkAACHDgAgKQAAig4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDYAAJIOACA5AAD8DQAgOgAA_Q0AIDsAAP4NACA8AAD_DQAgPQAAgA4AID4AAIQOACA_AACJDgAgQAAAiw4AIEEAAI0OACBCAACPDgAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACElAwAA4A0AIAUAAOENACANAADqDQAgHQAA4g0AIB4AAOMNACAfAADkDQAgIAAA5Q0AICEAAOYNACAiAADnDQAgIwAA6A0AICkAAOwNACAqAADrDQAgKwAA7Q0AICwAAO4NACAtAADvDQAgLgAA8A0AIC8AAPENACAzAADyDQAgNAAA8w0AIDUAAPQNACA2AAD1DQAgNwAA9g0AIDgAAPcNACCOBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAJkFArwEQAAAAAH8BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFApYFAQAAAAGXBQEAAAABmQUBAAAAAZoFAQAAAAGbBUAAAAABAgAAAAUAIE8AAMMSACAdAwAAkQoAIAUCAAAAAQgAAJIKACAJAACTCgAgCgAAlAoAIA0AAJUKACAPAACWCgAgEQAAlwoAIBYAAJkKACCOBAEAAAABjwQBAAAAAZUEQAAAAAGqBAEAAAABrQQAAADRBAKxBEAAAAABswQBAAAAAbYEAgAAAAG3BAIAAAABvARAAAAAAdoEAAAA2gQC2wQBAAAAAdwEAQAAAAHdBAEAAAAB3gQQAAAAAd8EQAAAAAHgBEAAAAAB4QRAAAAAAeIEQAAAAAHjBAIAAAABAgAAABEAIE8AAMUSACAhFgAAjhAAIBgAAIUQACAbAACVEAAgIgAAhxAAICMAAIgQACApAACMEAAgKgAAihAAICsAAIMQACAsAACEEAAgLwAAkBAAIDEAAJIQACA0AACTEAAgNgAAlBAAIDkAAP4PACA6AAD_DwAgOwAAgBAAIDwAAIEQACA9AACCEAAgPgAAhhAAID8AAIsQACBAAACNEAAgQQAAjxAAIEIAAJEQACCOBAEAAAABlQRAAAAAAbwEQAAAAAHpBAEAAAABjAUBAAAAAZkFAQAAAAGaBQEAAAABnAUBAAAAAZ0FAQAAAAGeBSAAAAABAgAAAAEAIE8AAMcSACADAAAAAwAgTwAAwxIAIFAAAMsSACAnAAAAAwAgAwAA6wsAIAUAAOwLACANAAD1CwAgHQAA7QsAIB4AAO4LACAfAADvCwAgIAAA8AsAICEAAPELACAiAADyCwAgIwAA8wsAICkAAPcLACAqAAD2CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACBIAADLEgAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhJQMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACApAAD3CwAgKgAA9gsAICsAAPgLACAsAAD5CwAgLQAA-gsAIC4AAPsLACAvAAD8CwAgMwAA_QsAIDQAAP4LACA1AAD_CwAgNgAAgAwAIDcAAIEMACA4AACCDAAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhAwAAAA8AIE8AAMUSACBQAADOEgAgHwAAAA8AIAMAAMUJACAFAgDRCAAhCAAAxgkAIAkAAMcJACAKAADICQAgDQAAyQkAIA8AAMoJACARAADLCQAgFgAAzQkAIEgAAM4SACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGqBAEAuwgAIa0EAADCCdEEIrEEQADHCAAhswQBALwIACG2BAIA0QgAIbcEAgDRCAAhvARAAL0IACHaBAAAwwnaBCLbBAEAvAgAIdwEAQC8CAAh3QQBALwIACHeBBAAxAkAId8EQADHCAAh4ARAAMcIACHhBEAAxwgAIeIEQADHCAAh4wQCANEIACEdAwAAxQkAIAUCANEIACEIAADGCQAgCQAAxwkAIAoAAMgJACANAADJCQAgDwAAygkAIBEAAMsJACAWAADNCQAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqgQBALsIACGtBAAAwgnRBCKxBEAAxwgAIbMEAQC8CAAhtgQCANEIACG3BAIA0QgAIbwEQAC9CAAh2gQAAMMJ2gQi2wQBALwIACHcBAEAvAgAId0EAQC8CAAh3gQQAMQJACHfBEAAxwgAIeAEQADHCAAh4QRAAMcIACHiBEAAxwgAIeMEAgDRCAAhAwAAANEBACBPAADHEgAgUAAA0RIAICMAAADRAQAgFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACBIAADREgAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACEhFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISUDAADgDQAgBQAA4Q0AIB0AAOINACAeAADjDQAgHwAA5A0AICAAAOUNACAhAADmDQAgIgAA5w0AICMAAOgNACAkAADpDQAgKQAA7A0AICoAAOsNACArAADtDQAgLAAA7g0AIC0AAO8NACAuAADwDQAgLwAA8Q0AIDMAAPINACA0AADzDQAgNQAA9A0AIDYAAPUNACA3AAD2DQAgOAAA9w0AII4EAQAAAAGPBAEAAAABlQRAAAAAAa0EAAAAmQUCvARAAAAAAfwEAQAAAAH-BAEAAAAB_wQBAAAAAYEFAAAAgQUClgUBAAAAAZcFAQAAAAGZBQEAAAABmgUBAAAAAZsFQAAAAAECAAAABQAgTwAA0hIAIB0DAACRCgAgBQIAAAABCAAAkgoAIAkAAJMKACAKAACUCgAgDwAAlgoAIBEAAJcKACATAACYCgAgFgAAmQoAII4EAQAAAAGPBAEAAAABlQRAAAAAAaoEAQAAAAGtBAAAANEEArEEQAAAAAGzBAEAAAABtgQCAAAAAbcEAgAAAAG8BEAAAAAB2gQAAADaBALbBAEAAAAB3AQBAAAAAd0EAQAAAAHeBBAAAAAB3wRAAAAAAeAEQAAAAAHhBEAAAAAB4gRAAAAAAeMEAgAAAAECAAAAEQAgTwAA1BIAICEWAACOEAAgGAAAhRAAIBsAAJUQACAiAACHEAAgIwAAiBAAICQAAIkQACApAACMEAAgKgAAihAAICsAAIMQACAsAACEEAAgLwAAkBAAIDEAAJIQACA0AACTEAAgNgAAlBAAIDkAAP4PACA6AAD_DwAgOwAAgBAAIDwAAIEQACA9AACCEAAgPwAAixAAIEAAAI0QACBBAACPEAAgQgAAkRAAII4EAQAAAAGVBEAAAAABvARAAAAAAekEAQAAAAGMBQEAAAABmQUBAAAAAZoFAQAAAAGcBQEAAAABnQUBAAAAAZ4FIAAAAAECAAAAAQAgTwAA1hIAIAMAAAADACBPAADSEgAgUAAA2hIAICcAAAADACADAADrCwAgBQAA7AsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAIEgAANoSACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACElAwAA6wsAIAUAAOwLACAdAADtCwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIQAA8QsAICIAAPILACAjAADzCwAgJAAA9AsAICkAAPcLACAqAAD2CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGtBAAA6guZBSK8BEAAvQgAIfwEAQC8CAAh_gQBALsIACH_BAEAvAgAIYEFAACLC4EFIpYFAQC8CAAhlwUBALwIACGZBQEAuwgAIZoFAQC8CAAhmwVAAMcIACEDAAAADwAgTwAA1BIAIFAAAN0SACAfAAAADwAgAwAAxQkAIAUCANEIACEIAADGCQAgCQAAxwkAIAoAAMgJACAPAADKCQAgEQAAywkAIBMAAMwJACAWAADNCQAgSAAA3RIAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIaoEAQC7CAAhrQQAAMIJ0QQisQRAAMcIACGzBAEAvAgAIbYEAgDRCAAhtwQCANEIACG8BEAAvQgAIdoEAADDCdoEItsEAQC8CAAh3AQBALwIACHdBAEAvAgAId4EEADECQAh3wRAAMcIACHgBEAAxwgAIeEEQADHCAAh4gRAAMcIACHjBAIA0QgAIR0DAADFCQAgBQIA0QgAIQgAAMYJACAJAADHCQAgCgAAyAkAIA8AAMoJACARAADLCQAgEwAAzAkAIBYAAM0JACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGqBAEAuwgAIa0EAADCCdEEIrEEQADHCAAhswQBALwIACG2BAIA0QgAIbcEAgDRCAAhvARAAL0IACHaBAAAwwnaBCLbBAEAvAgAIdwEAQC8CAAh3QQBALwIACHeBBAAxAkAId8EQADHCAAh4ARAAMcIACHhBEAAxwgAIeIEQADHCAAh4wQCANEIACEDAAAA0QEAIE8AANYSACBQAADgEgAgIwAAANEBACAWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AIEgAAOASACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISEWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhIRYAAI4QACAYAACFEAAgGwAAlRAAICIAAIcQACAjAACIEAAgJAAAiRAAICkAAIwQACAqAACKEAAgKwAAgxAAICwAAIQQACAvAACQEAAgMQAAkhAAIDQAAJMQACA2AACUEAAgOQAA_g8AIDoAAP8PACA7AACAEAAgPAAAgRAAID0AAIIQACA-AACGEAAgPwAAixAAIEAAAI0QACBCAACREAAgjgQBAAAAAZUEQAAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAGZBQEAAAABmgUBAAAAAZwFAQAAAAGdBQEAAAABngUgAAAAAQIAAAABACBPAADhEgAgCY4EAQAAAAGPBAEAAAABpwQBAAAAAa0EAAAAvwQCvwQCAAAAAcAEAQAAAAHBBAEAAAABwgRAAAAAAcMEQAAAAAEDAAAA0QEAIE8AAOESACBQAADmEgAgIwAAANEBACAWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQgAAjw4AIEgAAOYSACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISEWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQgAAjw4AII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhJQMAAOANACAFAADhDQAgDQAA6g0AIB0AAOINACAeAADjDQAgHwAA5A0AICAAAOUNACAhAADmDQAgIgAA5w0AICMAAOgNACAkAADpDQAgKQAA7A0AICoAAOsNACArAADtDQAgLAAA7g0AIC0AAO8NACAuAADwDQAgMwAA8g0AIDQAAPMNACA1AAD0DQAgNgAA9Q0AIDcAAPYNACA4AAD3DQAgjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACZBQK8BEAAAAAB_AQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKWBQEAAAABlwUBAAAAAZkFAQAAAAGaBQEAAAABmwVAAAAAAQIAAAAFACBPAADnEgAgDAMAAJEJACCOBAEAAAABjwQBAAAAAZUEQAAAAAGpBAAAAMUEAqoEAQAAAAGtBAAAAMgEArMEAQAAAAG8BEAAAAABvwQCAAAAAcUEAgAAAAHGBAEAAAABAgAAAK0BACBPAADpEgAgIRYAAI4QACAYAACFEAAgGwAAlRAAICIAAIcQACAjAACIEAAgJAAAiRAAICkAAIwQACAqAACKEAAgKwAAgxAAICwAAIQQACAxAACSEAAgNAAAkxAAIDYAAJQQACA5AAD-DwAgOgAA_w8AIDsAAIAQACA8AACBEAAgPQAAghAAID4AAIYQACA_AACLEAAgQAAAjRAAIEEAAI8QACBCAACREAAgjgQBAAAAAZUEQAAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAGZBQEAAAABmgUBAAAAAZwFAQAAAAGdBQEAAAABngUgAAAAAQIAAAABACBPAADrEgAgAwAAAAMAIE8AAOcSACBQAADvEgAgJwAAAAMAIAMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgMwAA_QsAIDQAAP4LACA1AAD_CwAgNgAAgAwAIDcAAIEMACA4AACCDAAgSAAA7xIAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAISUDAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIQAA8QsAICIAAPILACAjAADzCwAgJAAA9AsAICkAAPcLACAqAAD2CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAIQMAAACrAQAgTwAA6RIAIFAAAPISACAOAAAAqwEAIAMAAIMJACBIAADyEgAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqQQAAIAJxQQiqgQBALsIACGtBAAAggnIBCKzBAEAvAgAIbwEQAC9CAAhvwQCANEIACHFBAIAgQkAIcYEAQC8CAAhDAMAAIMJACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGpBAAAgAnFBCKqBAEAuwgAIa0EAACCCcgEIrMEAQC8CAAhvARAAL0IACG_BAIA0QgAIcUEAgCBCQAhxgQBALwIACEDAAAA0QEAIE8AAOsSACBQAAD1EgAgIwAAANEBACAWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgMQAAkA4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPAAA_w0AID0AAIAOACA-AACEDgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AIEgAAPUSACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISEWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgMQAAkA4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPAAA_w0AID0AAIAOACA-AACEDgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhIRYAAI4QACAYAACFEAAgGwAAlRAAICIAAIcQACAjAACIEAAgJAAAiRAAICkAAIwQACAqAACKEAAgKwAAgxAAICwAAIQQACAvAACQEAAgMQAAkhAAIDQAAJMQACA2AACUEAAgOQAA_g8AIDoAAP8PACA7AACAEAAgPAAAgRAAID0AAIIQACA-AACGEAAgPwAAixAAIEAAAI0QACBBAACPEAAgjgQBAAAAAZUEQAAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAGZBQEAAAABmgUBAAAAAZwFAQAAAAGdBQEAAAABngUgAAAAAQIAAAABACBPAAD2EgAgBwUCAAAAAY4EAQAAAAGPBAEAAAABpwQBAAAAAa0EAAAAsQQCsQRAAAAAAbIEQAAAAAEDAAAA0QEAIE8AAPYSACBQAAD7EgAgIwAAANEBACAWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEgAAPsSACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISEWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDEAAJAOACA0AACRDgAgNgAAkg4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhJQMAAOANACAFAADhDQAgDQAA6g0AIB0AAOINACAeAADjDQAgHwAA5A0AICAAAOUNACAhAADmDQAgIgAA5w0AICMAAOgNACAkAADpDQAgKQAA7A0AICoAAOsNACArAADtDQAgLAAA7g0AIC0AAO8NACAuAADwDQAgLwAA8Q0AIDQAAPMNACA1AAD0DQAgNgAA9Q0AIDcAAPYNACA4AAD3DQAgjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACZBQK8BEAAAAAB_AQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKWBQEAAAABlwUBAAAAAZkFAQAAAAGaBQEAAAABmwVAAAAAAQIAAAAFACBPAAD8EgAgDwMAAO0IACCOBAEAAAABjwQBAAAAAZUEQAAAAAGqBAEAAAABrQQAAAC7BAKzBAEAAAABtAQBAAAAAbUEAgAAAAG2BAIAAAABtwQCAAAAAbgEQAAAAAG5BEAAAAABuwQBAAAAAbwEQAAAAAECAAAAsgEAIE8AAP4SACAhFgAAjhAAIBgAAIUQACAbAACVEAAgIgAAhxAAICMAAIgQACAkAACJEAAgKQAAjBAAICoAAIoQACArAACDEAAgLAAAhBAAIC8AAJAQACA0AACTEAAgNgAAlBAAIDkAAP4PACA6AAD_DwAgOwAAgBAAIDwAAIEQACA9AACCEAAgPgAAhhAAID8AAIsQACBAAACNEAAgQQAAjxAAIEIAAJEQACCOBAEAAAABlQRAAAAAAbwEQAAAAAHpBAEAAAABjAUBAAAAAZkFAQAAAAGaBQEAAAABnAUBAAAAAZ0FAQAAAAGeBSAAAAABAgAAAAEAIE8AAIATACADAAAAAwAgTwAA_BIAIFAAAIQTACAnAAAAAwAgAwAA6wsAIAUAAOwLACANAAD1CwAgHQAA7QsAIB4AAO4LACAfAADvCwAgIAAA8AsAICEAAPELACAiAADyCwAgIwAA8wsAICQAAPQLACApAAD3CwAgKgAA9gsAICsAAPgLACAsAAD5CwAgLQAA-gsAIC4AAPsLACAvAAD8CwAgNAAA_gsAIDUAAP8LACA2AACADAAgNwAAgQwAIDgAAIIMACBIAACEEwAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhJQMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDQAAP4LACA1AAD_CwAgNgAAgAwAIDcAAIEMACA4AACCDAAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhAwAAALABACBPAAD-EgAgUAAAhxMAIBEAAACwAQAgAwAA3wgAIEgAAIcTACCOBAEAuwgAIY8EAQC7CAAhlQRAAL0IACGqBAEAuwgAIa0EAADeCLsEIrMEAQC8CAAhtAQBALsIACG1BAIA0QgAIbYEAgDRCAAhtwQCANEIACG4BEAAvQgAIbkEQAC9CAAhuwQBALwIACG8BEAAvQgAIQ8DAADfCAAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhqgQBALsIACGtBAAA3gi7BCKzBAEAvAgAIbQEAQC7CAAhtQQCANEIACG2BAIA0QgAIbcEAgDRCAAhuARAAL0IACG5BEAAvQgAIbsEAQC8CAAhvARAAL0IACEDAAAA0QEAIE8AAIATACBQAACKEwAgIwAAANEBACAWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPAAA_w0AID0AAIAOACA-AACEDgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AIEgAAIoTACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AISEWAACMDgAgGAAAgw4AIBsAAJMOACAiAACFDgAgIwAAhg4AICQAAIcOACApAACKDgAgKgAAiA4AICsAAIEOACAsAACCDgAgLwAAjg4AIDQAAJEOACA2AACSDgAgOQAA_A0AIDoAAP0NACA7AAD-DQAgPAAA_w0AID0AAIAOACA-AACEDgAgPwAAiQ4AIEAAAIsOACBBAACNDgAgQgAAjw4AII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhJQMAAOANACAFAADhDQAgDQAA6g0AIB0AAOINACAeAADjDQAgHwAA5A0AICAAAOUNACAhAADmDQAgIgAA5w0AICMAAOgNACAkAADpDQAgKQAA7A0AICoAAOsNACArAADtDQAgLAAA7g0AIC0AAO8NACAuAADwDQAgLwAA8Q0AIDMAAPINACA1AAD0DQAgNgAA9Q0AIDcAAPYNACA4AAD3DQAgjgQBAAAAAY8EAQAAAAGVBEAAAAABrQQAAACZBQK8BEAAAAAB_AQBAAAAAf4EAQAAAAH_BAEAAAABgQUAAACBBQKWBQEAAAABlwUBAAAAAZkFAQAAAAGaBQEAAAABmwVAAAAAAQIAAAAFACBPAACLEwAgIRYAAI4QACAYAACFEAAgGwAAlRAAICIAAIcQACAjAACIEAAgJAAAiRAAICkAAIwQACAqAACKEAAgKwAAgxAAICwAAIQQACAvAACQEAAgMQAAkhAAIDYAAJQQACA5AAD-DwAgOgAA_w8AIDsAAIAQACA8AACBEAAgPQAAghAAID4AAIYQACA_AACLEAAgQAAAjRAAIEEAAI8QACBCAACREAAgjgQBAAAAAZUEQAAAAAG8BEAAAAAB6QQBAAAAAYwFAQAAAAGZBQEAAAABmgUBAAAAAZwFAQAAAAGdBQEAAAABngUgAAAAAQIAAAABACBPAACNEwAgAwAAAAMAIE8AAIsTACBQAACREwAgJwAAAAMAIAMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA1AAD_CwAgNgAAgAwAIDcAAIEMACA4AACCDAAgSAAAkRMAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAISUDAADrCwAgBQAA7AsAIA0AAPULACAdAADtCwAgHgAA7gsAIB8AAO8LACAgAADwCwAgIQAA8QsAICIAAPILACAjAADzCwAgJAAA9AsAICkAAPcLACAqAAD2CwAgKwAA-AsAICwAAPkLACAtAAD6CwAgLgAA-wsAIC8AAPwLACAzAAD9CwAgNQAA_wsAIDYAAIAMACA3AACBDAAgOAAAggwAII4EAQC7CAAhjwQBALsIACGVBEAAvQgAIa0EAADqC5kFIrwEQAC9CAAh_AQBALwIACH-BAEAuwgAIf8EAQC8CAAhgQUAAIsLgQUilgUBALwIACGXBQEAvAgAIZkFAQC7CAAhmgUBALwIACGbBUAAxwgAIQMAAADRAQAgTwAAjRMAIFAAAJQTACAjAAAA0QEAIBYAAIwOACAYAACDDgAgGwAAkw4AICIAAIUOACAjAACGDgAgJAAAhw4AICkAAIoOACAqAACIDgAgKwAAgQ4AICwAAIIOACAvAACODgAgMQAAkA4AIDYAAJIOACA5AAD8DQAgOgAA_Q0AIDsAAP4NACA8AAD_DQAgPQAAgA4AID4AAIQOACA_AACJDgAgQAAAiw4AIEEAAI0OACBCAACPDgAgSAAAlBMAII4EAQC7CAAhlQRAAL0IACG8BEAAvQgAIekEAQC7CAAhjAUBALsIACGZBQEAuwgAIZoFAQC7CAAhnAUBALwIACGdBQEAvAgAIZ4FIAD7DQAhIRYAAIwOACAYAACDDgAgGwAAkw4AICIAAIUOACAjAACGDgAgJAAAhw4AICkAAIoOACAqAACIDgAgKwAAgQ4AICwAAIIOACAvAACODgAgMQAAkA4AIDYAAJIOACA5AAD8DQAgOgAA_Q0AIDsAAP4NACA8AAD_DQAgPQAAgA4AID4AAIQOACA_AACJDgAgQAAAiw4AIEEAAI0OACBCAACPDgAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACElAwAA4A0AIAUAAOENACANAADqDQAgHQAA4g0AIB4AAOMNACAfAADkDQAgIAAA5Q0AICEAAOYNACAiAADnDQAgIwAA6A0AICQAAOkNACApAADsDQAgKgAA6w0AICsAAO0NACAsAADuDQAgLQAA7w0AIC4AAPANACAvAADxDQAgMwAA8g0AIDQAAPMNACA1AAD0DQAgNwAA9g0AIDgAAPcNACCOBAEAAAABjwQBAAAAAZUEQAAAAAGtBAAAAJkFArwEQAAAAAH8BAEAAAAB_gQBAAAAAf8EAQAAAAGBBQAAAIEFApYFAQAAAAGXBQEAAAABmQUBAAAAAZoFAQAAAAGbBUAAAAABAgAAAAUAIE8AAJUTACAhFgAAjhAAIBgAAIUQACAbAACVEAAgIgAAhxAAICMAAIgQACAkAACJEAAgKQAAjBAAICoAAIoQACArAACDEAAgLAAAhBAAIC8AAJAQACAxAACSEAAgNAAAkxAAIDkAAP4PACA6AAD_DwAgOwAAgBAAIDwAAIEQACA9AACCEAAgPgAAhhAAID8AAIsQACBAAACNEAAgQQAAjxAAIEIAAJEQACCOBAEAAAABlQRAAAAAAbwEQAAAAAHpBAEAAAABjAUBAAAAAZkFAQAAAAGaBQEAAAABnAUBAAAAAZ0FAQAAAAGeBSAAAAABAgAAAAEAIE8AAJcTACADAAAAAwAgTwAAlRMAIFAAAJsTACAnAAAAAwAgAwAA6wsAIAUAAOwLACANAAD1CwAgHQAA7QsAIB4AAO4LACAfAADvCwAgIAAA8AsAICEAAPELACAiAADyCwAgIwAA8wsAICQAAPQLACApAAD3CwAgKgAA9gsAICsAAPgLACAsAAD5CwAgLQAA-gsAIC4AAPsLACAvAAD8CwAgMwAA_QsAIDQAAP4LACA1AAD_CwAgNwAAgQwAIDgAAIIMACBIAACbEwAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhJQMAAOsLACAFAADsCwAgDQAA9QsAIB0AAO0LACAeAADuCwAgHwAA7wsAICAAAPALACAhAADxCwAgIgAA8gsAICMAAPMLACAkAAD0CwAgKQAA9wsAICoAAPYLACArAAD4CwAgLAAA-QsAIC0AAPoLACAuAAD7CwAgLwAA_AsAIDMAAP0LACA0AAD-CwAgNQAA_wsAIDcAAIEMACA4AACCDAAgjgQBALsIACGPBAEAuwgAIZUEQAC9CAAhrQQAAOoLmQUivARAAL0IACH8BAEAvAgAIf4EAQC7CAAh_wQBALwIACGBBQAAiwuBBSKWBQEAvAgAIZcFAQC8CAAhmQUBALsIACGaBQEAvAgAIZsFQADHCAAhAwAAANEBACBPAACXEwAgUAAAnhMAICMAAADRAQAgFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACBIAACeEwAgjgQBALsIACGVBEAAvQgAIbwEQAC9CAAh6QQBALsIACGMBQEAuwgAIZkFAQC7CAAhmgUBALsIACGcBQEAvAgAIZ0FAQC8CAAhngUgAPsNACEhFgAAjA4AIBgAAIMOACAbAACTDgAgIgAAhQ4AICMAAIYOACAkAACHDgAgKQAAig4AICoAAIgOACArAACBDgAgLAAAgg4AIC8AAI4OACAxAACQDgAgNAAAkQ4AIDkAAPwNACA6AAD9DQAgOwAA_g0AIDwAAP8NACA9AACADgAgPgAAhA4AID8AAIkOACBAAACLDgAgQQAAjQ4AIEIAAI8OACCOBAEAuwgAIZUEQAC9CAAhvARAAL0IACHpBAEAuwgAIYwFAQC7CAAhmQUBALsIACGaBQEAuwgAIZwFAQC8CAAhnQUBALwIACGeBSAA-w0AIRkWqgELFwAiGJ8BBhu3AQ0ioQEII6IBCSSjAQopqAERKqYBECudARUsngEWL68BFzG0ARo0tQEdNrYBHzkGAjqUAQU7lQEEPJkBIT2cAQM-oAEHP6cBD0CpARJBrgEYQrMBGxkDAAEFCAMNRQcXACAdDAQePAQfPwUgQAYhQQYiQggjQwkkRAopWBIqSQ8rXBUsYBYtYQsuYgsvZhczbBo0ch01dh42eh83fA04fQ0CAwABBAACBAMAAQQAAggABRw7AgYDAAEGDQIHDgQXAA4YEgYbNQ0KAwABCBQFCRUCChYCDRoHDx4IESIJEyYKFisLFwAMAwMAAQsABgwAAgMDAAELAAYOAAIDAwABCwAGEAACAwMAAQsABhInAgQDAAELLAYUAAIVAAIFDS0ADy4AES8AEzAAFjEABAMAAQg2BRkAAho3AgMHOAAYOQAbOgADAwABBAACJgAQBAMAARcAFCVKDylOEQQDAAEXABMmUBAoVBIDAwABBAACJwARAShVAAIlVgApVwACAwABBAACAgMAAQQAAgMDAAEEAAIwABgDAwABFwAZL2cXAS9oAAMDAAEEAAIyABsDAwABFwAcMW0aATFuAAIDAAEEAAIBBAACAgMAARJ7AhYNhgEAHX4AHn8AH4ABACCBAQAhggEAIoMBACOEAQAkhQEAKYgBACqHAQAriQEALIoBAC2LAQAujAEAL40BADOOAQA0jwEANZABADaRAQA3kgEAOJMBAAEDAAEYFsgBABi_AQAbzwEAIsEBACPCAQAkwwEAKcYBACrEAQArvQEALL4BAC_KAQAxzAEANM0BADbOAQA5uAEAOrkBADu6AQA8uwEAPbwBAD7AAQA_xQEAQMcBAEHJAQBCywEAAAAAAxcAJ1UAKFYAKQAAAAMXACdVAChWACkBAwABAQMAAQMXAC5VAC9WADAAAAADFwAuVQAvVgAwAAAABRcANlUAOVYAOncAN3gAOAAAAAAABRcANlUAOVYAOncAN3gAOAAAAAMXAEBVAEFWAEIAAAADFwBAVQBBVgBCAQQAAgEEAAIDFwBHVQBIVgBJAAAAAxcAR1UASFYASQIDAAEGzwICAgMAAQbVAgIDFwBOVQBPVgBQAAAAAxcATlUAT1YAUAQDAAEEAAIIAAUc5wICBAMAAQQAAggABRztAgIDFwBVVQBWVgBXAAAAAxcAVVUAVlYAVwEDAAEBAwABBRcAXFUAX1YAYHcAXXgAXgAAAAAABRcAXFUAX1YAYHcAXXgAXgQDAAEIlQMFGQACGpYDAgQDAAEInAMFGQACGp0DAgMXAGVVAGZWAGcAAAADFwBlVQBmVgBnAgMAAQQAAgIDAAEEAAIFFwBsVQBvVgBwdwBteABuAAAAAAAFFwBsVQBvVgBwdwBteABuAgMAAQQAAgIDAAEEAAIFFwB1VQB4VgB5dwB2eAB3AAAAAAAFFwB1VQB4VgB5dwB2eAB3AgMAAQQAAgIDAAEEAAIFFwB-VQCBAVYAggF3AH94AIABAAAAAAAFFwB-VQCBAVYAggF3AH94AIABAQMAAQEDAAEFFwCHAVUAigFWAIsBdwCIAXgAiQEAAAAAAAUXAIcBVQCKAVYAiwF3AIgBeACJAQMDAAEEAAImABADAwABBAACJgAQAxcAkAFVAJEBVgCSAQAAAAMXAJABVQCRAVYAkgECAwABJp0EEAIDAAEmowQQAxcAlwFVAJgBVgCZAQAAAAMXAJcBVQCYAVYAmQEDAwABBAACJwARAwMAAQQAAicAEQMXAJ4BVQCfAVYAoAEAAAADFwCeAVUAnwFWAKABBAMAAQvLBAYUAAIVAAIEAwABC9EEBhQAAhUAAgUXAKUBVQCoAVYAqQF3AKYBeACnAQAAAAAABRcApQFVAKgBVgCpAXcApgF4AKcBBAMAAQjjBAUJ5AQCCuUEAgQDAAEI6wQFCewEAgrtBAIFFwCuAVUAsQFWALIBdwCvAXgAsAEAAAAAAAUXAK4BVQCxAVYAsgF3AK8BeACwAQMDAAELAAYOAAIDAwABCwAGDgACAxcAtwFVALgBVgC5AQAAAAMXALcBVQC4AVYAuQEDAwABCwAGEAACAwMAAQsABhAAAgUXAL4BVQDBAVYAwgF3AL8BeADAAQAAAAAABRcAvgFVAMEBVgDCAXcAvwF4AMABAwMAAQsABhKrBQIDAwABCwAGErEFAgMXAMcBVQDIAVYAyQEAAAADFwDHAVUAyAFWAMkBAwMAAQsABgwAAgMDAAELAAYMAAIFFwDOAVUA0QFWANIBdwDPAXgA0AEAAAAAAAUXAM4BVQDRAVYA0gF3AM8BeADQAQEDAAEBAwABBRcA1wFVANoBVgDbAXcA2AF4ANkBAAAAAAAFFwDXAVUA2gFWANsBdwDYAXgA2QEDAwABBAACMAAYAwMAAQQAAjAAGAUXAOABVQDjAVYA5AF3AOEBeADiAQAAAAAABRcA4AFVAOMBVgDkAXcA4QF4AOIBAQMAAQEDAAEFFwDpAVUA7AFWAO0BdwDqAXgA6wEAAAAAAAUXAOkBVQDsAVYA7QF3AOoBeADrAQMDAAEEAAIyABsDAwABBAACMgAbBRcA8gFVAPUBVgD2AXcA8wF4APQBAAAAAAAFFwDyAVUA9QFWAPYBdwDzAXgA9AECAwABBAACAgMAAQQAAgMXAPsBVQD8AVYA_QEAAAADFwD7AVUA_AFWAP0BAgMAARLHBgICAwABEs0GAgMXAIICVQCDAlYAhAIAAAADFwCCAlUAgwJWAIQCQwIBRNABAUXTAQFG1AEBR9UBAUnXAQFK2QEjS9oBJEzcAQFN3gEjTt8BJVHgAQFS4QEBU-IBI1flASZY5gEqWecBAlroAQJb6QECXOoBAl3rAQJe7QECX-8BI2DwASth8gECYvQBI2P1ASxk9gECZfcBAmb4ASNn-wEtaPwBMWn-ATJq_wEya4ICMmyDAjJthAIyboYCMm-IAiNwiQIzcYsCMnKNAiNzjgI0dI8CMnWQAjJ2kQIjeZQCNXqVAjt7lwI8fJgCPH2bAjx-nAI8f50CPIABnwI8gQGhAiOCAaICPYMBpAI8hAGmAiOFAacCPoYBqAI8hwGpAjyIAaoCI4kBrQI_igGuAkOLAa8CHowBsAIejQGxAh6OAbICHo8BswIekAG1Ah6RAbcCI5IBuAJEkwG6Ah6UAbwCI5UBvQJFlgG-Ah6XAb8CHpgBwAIjmQHDAkaaAcQCSpsBxQIFnAHGAgWdAccCBZ4ByAIFnwHJAgWgAcsCBaEBzQIjogHOAkujAdECBaQB0wIjpQHUAkymAdYCBacB1wIFqAHYAiOpAdsCTaoB3AJRqwHdAgSsAd4CBK0B3wIErgHgAgSvAeECBLAB4wIEsQHlAiOyAeYCUrMB6QIEtAHrAiO1AewCU7YB7gIEtwHvAgS4AfACI7kB8wJUugH0Ali7AfUCIbwB9gIhvQH3AiG-AfgCIb8B-QIhwAH7AiHBAf0CI8IB_gJZwwGAAyHEAYIDI8UBgwNaxgGEAyHHAYUDIcgBhgMjyQGJA1vKAYoDYcsBiwMNzAGMAw3NAY0DDc4BjgMNzwGPAw3QAZEDDdEBkwMj0gGUA2LTAZgDDdQBmgMj1QGbA2PWAZ4DDdcBnwMN2AGgAyPZAaMDZNoBpANo2wGlAwPcAaYDA90BpwMD3gGoAwPfAakDA-ABqwMD4QGtAyPiAa4DaeMBsAMD5AGyAyPlAbMDauYBtAMD5wG1AwPoAbYDI-kBuQNr6gG6A3HrAbsDFewBvAMV7QG9AxXuAb4DFe8BvwMV8AHBAxXxAcMDI_IBxANy8wHGAxX0AcgDI_UByQNz9gHKAxX3AcsDFfgBzAMj-QHPA3T6AdADevsB0QMW_AHSAxb9AdMDFv4B1AMW_wHVAxaAAtcDFoEC2QMjggLaA3uDAtwDFoQC3gMjhQLfA3yGAuADFocC4QMWiALiAyOJAuUDfYoC5gODAYsC5wMQjALoAxCNAukDEI4C6gMQjwLrAxCQAu0DEJEC7wMjkgLwA4QBkwLyAxCUAvQDI5UC9QOFAZYC9gMQlwL3AxCYAvgDI5kC-wOGAZoC_AOMAZsC_QMPnAL-Aw-dAv8DD54CgAQPnwKBBA-gAoMED6EChQQjogKGBI0BowKIBA-kAooEI6UCiwSOAaYCjAQPpwKNBA-oAo4EI6kCkQSPAaoCkgSTAasCkwQRrAKUBBGtApUEEa4ClgQRrwKXBBGwApkEEbECmwQjsgKcBJQBswKfBBG0AqEEI7UCogSVAbYCpAQRtwKlBBG4AqYEI7kCqQSWAboCqgSaAbsCqwQSvAKsBBK9Aq0EEr4CrgQSvwKvBBLAArEEEsECswQjwgK0BJsBwwK2BBLEArgEI8UCuQScAcYCugQSxwK7BBLIArwEI8kCvwSdAcoCwAShAcsCwQQLzALCBAvNAsMEC84CxAQLzwLFBAvQAscEC9ECyQQj0gLKBKIB0wLNBAvUAs8EI9UC0ASjAdYC0gQL1wLTBAvYAtQEI9kC1wSkAdoC2ASqAdsC2QQG3ALaBAbdAtsEBt4C3AQG3wLdBAbgAt8EBuEC4QQj4gLiBKsB4wLnBAbkAukEI-UC6gSsAeYC7gQG5wLvBAboAvAEI-kC8wStAeoC9ASzAesC9QQI7AL2BAjtAvcECO4C-AQI7wL5BAjwAvsECPEC_QQj8gL-BLQB8wKABQj0AoIFI_UCgwW1AfYChAUI9wKFBQj4AoYFI_kCiQW2AfoCigW6AfsCiwUJ_AKMBQn9Ao0FCf4CjgUJ_wKPBQmAA5EFCYEDkwUjggOUBbsBgwOWBQmEA5gFI4UDmQW8AYYDmgUJhwObBQmIA5wFI4kDnwW9AYoDoAXDAYsDoQUKjAOiBQqNA6MFCo4DpAUKjwOlBQqQA6cFCpEDqQUjkgOqBcQBkwOtBQqUA68FI5UDsAXFAZYDsgUKlwOzBQqYA7QFI5kDtwXGAZoDuAXKAZsDuQUHnAO6BQedA7sFB54DvAUHnwO9BQegA78FB6EDwQUjogPCBcsBowPEBQekA8YFI6UDxwXMAaYDyAUHpwPJBQeoA8oFI6kDzQXNAaoDzgXTAasDzwUYrAPQBRitA9EFGK4D0gUYrwPTBRiwA9UFGLED1wUjsgPYBdQBswPaBRi0A9wFI7UD3QXVAbYD3gUYtwPfBRi4A-AFI7kD4wXWAboD5AXcAbsD5QUXvAPmBRe9A-cFF74D6AUXvwPpBRfAA-sFF8ED7QUjwgPuBd0BwwPwBRfEA_IFI8UD8wXeAcYD9AUXxwP1BRfIA_YFI8kD-QXfAcoD-gXlAcsD-wUbzAP8BRvNA_0FG84D_gUbzwP_BRvQA4EGG9EDgwYj0gOEBuYB0wOGBhvUA4gGI9UDiQbnAdYDigYb1wOLBhvYA4wGI9kDjwboAdoDkAbuAdsDkQYa3AOSBhrdA5MGGt4DlAYa3wOVBhrgA5cGGuEDmQYj4gOaBu8B4wOcBhrkA54GI-UDnwbwAeYDoAYa5wOhBhroA6IGI-kDpQbxAeoDpgb3AesDpwYd7AOoBh3tA6kGHe4DqgYd7wOrBh3wA60GHfEDrwYj8gOwBvgB8wOyBh30A7QGI_UDtQb5AfYDtgYd9wO3Bh34A7gGI_kDuwb6AfoDvAb-AfsDvQYf_AO-Bh_9A78GH_4DwAYf_wPBBh-ABMMGH4EExQYjggTGBv8BgwTJBh-EBMsGI4UEzAaAAoYEzgYfhwTPBh-IBNAGI4kE0waBAooE1AaFAg"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import('node:buffer');
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import('file:///home/user/WorkQuest/node_modules/@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs'),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import('file:///home/user/WorkQuest/node_modules/@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs');
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return client.getPrismaClient(config);
}

globalThis["__dirname"] = node_path.dirname(fileURLToPath(globalThis._importMeta_.url));
const PrismaClient = getPrismaClientClass();

let cachedClient;
function databaseUrl() {
  var _a;
  const config = useRuntimeConfig();
  const fromConfig = typeof config.databaseUrl === "string" ? config.databaseUrl.trim() : "";
  const fromEnv = ((_a = process.env.DATABASE_URL) != null ? _a : "").trim();
  return fromConfig || fromEnv || void 0;
}
function usePrisma() {
  if (cachedClient) return cachedClient;
  const url = databaseUrl();
  if (!url) {
    throw new Error(
      "WorkQuest: DATABASE_URL is not set. Copy .env.example to .env and configure a PostgreSQL connection."
    );
  }
  cachedClient = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: url,
      max: 10,
      connectionTimeoutMillis: 5e3,
      idleTimeoutMillis: 3e4
    }),
    log: [
      { emit: "stdout", level: "warn" },
      { emit: "stdout", level: "error" }
    ] 
  });
  return cachedClient;
}

function sessionConfig() {
  var _a, _b, _c, _d, _e, _f;
  const config = useRuntimeConfig();
  return {
    secret: String((_a = config.sessionSecret) != null ? _a : ""),
    issuer: String((_b = config.sessionIssuer) != null ? _b : "workquest"),
    cookieName: String((_c = config.sessionCookieName) != null ? _c : "workquest_session"),
    maxAgeSeconds: Number((_d = config.sessionMaxAgeSeconds) != null ? _d : 60 * 60 * 24 * 7),
    renewThresholdSeconds: Number((_e = config.sessionRenewThresholdSeconds) != null ? _e : 60 * 60 * 24),
    secure: String((_f = config.secureCookies) != null ? _f : "true") !== "false"
  };
}
function signingKey() {
  const { secret } = sessionConfig();
  if (secret.length < 32) {
    throw new Error(
      "WorkQuest: NUXT_SESSION_SECRET must be at least 32 characters. Generate one with `openssl rand -base64 48`."
    );
  }
  return new TextEncoder().encode(secret);
}
async function signSessionToken(claims) {
  const { issuer, maxAgeSeconds } = sessionConfig();
  const now = Math.floor(Date.now() / 1e3);
  return new SignJWT({ cid: claims.cid, role: claims.role }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setSubject(claims.sub).setJti(claims.sid).setIssuer(issuer).setIssuedAt(now).setNotBefore(now).setExpirationTime(now + maxAgeSeconds).sign(signingKey());
}
async function verifySessionToken(token) {
  var _a, _b;
  const { issuer } = sessionConfig();
  try {
    const { payload } = await jwtVerify(token, signingKey(), { issuer });
    if (!payload.sub || !payload.jti) return null;
    return {
      sub: payload.sub,
      sid: payload.jti,
      cid: String((_a = payload.cid) != null ? _a : ""),
      role: String((_b = payload.role) != null ? _b : "EMPLOYEE")
    };
  } catch {
    return null;
  }
}
function readSessionToken(event) {
  const { cookieName } = sessionConfig();
  const value = getCookie(event, cookieName);
  return value && value.length > 0 ? value : void 0;
}
function setSessionCookie(event, token) {
  const { cookieName, maxAgeSeconds, secure } = sessionConfig();
  setCookie(event, cookieName, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds
  });
}
function clearSessionCookie(event) {
  const { cookieName, secure } = sessionConfig();
  deleteCookie(event, cookieName, { httpOnly: true, secure, sameSite: "lax", path: "/" });
}
function tokenNeedsRenewal(token) {
  const { renewThresholdSeconds } = sessionConfig();
  const payload = token.split(".")[1];
  if (!payload) return false;
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!claims.exp) return true;
    return claims.exp - Date.now() / 1e3 < renewThresholdSeconds;
  } catch {
    return false;
  }
}

function getAuth(event) {
  return event.context.auth;
}
function requireAuth(event) {
  const auth = getAuth(event);
  if (!auth) throw errors.unauthorized();
  return auth;
}
function requirePermission(event, permission) {
  const auth = requireAuth(event);
  if (!can(auth.role, permission)) throw errors.forbidden();
  return auth;
}
async function getManagedUserIds(companyId, managerId) {
  var _a, _b, _c;
  const db = usePrisma();
  const rows = await db.teamMember.findMany({
    where: { companyId },
    select: { userId: true, managerId: true }
  });
  const reportsByManager = /* @__PURE__ */ new Map();
  for (const row of rows) {
    if (!row.managerId) continue;
    const list = (_a = reportsByManager.get(row.managerId)) != null ? _a : [];
    list.push(row.userId);
    reportsByManager.set(row.managerId, list);
  }
  const seen = /* @__PURE__ */ new Set();
  const queue = [...(_b = reportsByManager.get(managerId)) != null ? _b : []];
  while (queue.length > 0) {
    const id = queue.shift();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    for (const next of (_c = reportsByManager.get(id)) != null ? _c : []) {
      if (!seen.has(next)) queue.push(next);
    }
  }
  return [...seen];
}
async function issueSession(event, subject, tx) {
  const db = tx != null ? tx : usePrisma();
  const ip = getRequestIP(event, { xForwardedFor: true });
  const userAgent = getHeader(event, "user-agent");
  const expiresAt = new Date(Date.now() + Number(useRuntimeConfig().sessionMaxAgeSeconds) * 1e3);
  const session = await db.session.create({
    data: { userId: subject.id, expiresAt, ip, userAgent }
  });
  await db.user.update({ where: { id: subject.id }, data: { lastLoginAt: /* @__PURE__ */ new Date() } });
  await db.auditLog.create({
    data: {
      companyId: subject.companyId,
      actorId: subject.id,
      action: "auth.login",
      targetType: "Session",
      targetId: session.id,
      ip
    }
  });
  const token = await signSessionToken({
    sub: subject.id,
    sid: session.id,
    cid: subject.companyId,
    role: subject.role
  });
  return { sessionId: session.id, token, expiresAt };
}
function startSession(event, issued) {
  setSessionCookie(event, issued.token);
}
function toUserSummary(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatarUrl: user.avatarUrl,
    locale: user.locale,
    jobTitle: user.jobTitle
  };
}
function toCompanySummary(company) {
  return {
    id: company.id,
    name: company.name,
    slug: company.slug,
    logoUrl: company.logoUrl,
    locale: company.locale,
    timezone: company.timezone
  };
}

function generateOtpCode(length) {
  const safeLength = Math.min(8, Math.max(4, Math.floor(length) || 6));
  const max = 10 ** safeLength;
  return String(randomInt(0, max)).padStart(safeLength, "0");
}
function hashOtpCode(code) {
  const salt = randomBytes(16).toString("hex");
  const digest = scryptSync(code, salt, 64).toString("hex");
  return `${salt}:${digest}`;
}
function verifyOtpCode(code, stored) {
  const [salt, digest] = stored.split(":");
  if (!salt || !digest) return false;
  const candidate = scryptSync(code, salt, 64);
  const expected = Buffer.from(digest, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

const TENANT_MODELS = [
  "User",
  "Team",
  "TeamMember",
  "Invitation",
  "Level",
  "UserProgress",
  "XpTransaction",
  "CoinTransaction",
  "Task",
  "TaskReview",
  "Achievement",
  "UserAchievement",
  "Badge",
  "UserBadge",
  "Recognition",
  "Reward",
  "RewardRedemption",
  "Challenge",
  "ChallengeParticipant",
  "Notification",
  "AuditLog"
];
const TENANT_MODEL_SET = new Set(TENANT_MODELS);
const READ_OPERATIONS = /* @__PURE__ */ new Set([
  "findUnique",
  "findUniqueOrThrow",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
  "update",
  "updateMany",
  "delete",
  "deleteMany",
  "upsert"
]);
const CREATE_OPERATIONS = /* @__PURE__ */ new Set(["create", "createMany", "upsert"]);
function isTenantModel(model) {
  return typeof model === "string" && TENANT_MODEL_SET.has(model);
}
function scopedWhere(where, companyId) {
  if (where === void 0 || where === null) return { companyId };
  if (typeof where !== "object") return { companyId };
  const record = where;
  assertSameTenant(record.companyId, companyId);
  return { ...record, companyId };
}
function assertSameTenant(value, companyId) {
  if (typeof value === "string" && value !== companyId) {
    throw new Error("WorkQuest: cross-tenant query blocked by the tenant-scoped client.");
  }
}
function createTenantClient(auth) {
  const db = usePrisma();
  return db.$extends({
    name: "tenantScope",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!isTenantModel(model)) return query(args);
          const input = args;
          if (READ_OPERATIONS.has(operation)) {
            input.where = scopedWhere(input.where, auth.companyId);
          }
          if (CREATE_OPERATIONS.has(operation)) {
            if (operation === "createMany") {
              const data = input.data;
              if (Array.isArray(data)) {
                input.data = data.map((row) => {
                  const record = row;
                  assertSameTenant(record.companyId, auth.companyId);
                  return { ...record, companyId: auth.companyId };
                });
              }
            } else {
              const data = input.data;
              if (data && typeof data === "object") {
                assertSameTenant(data.companyId, auth.companyId);
                input.data = { ...data, companyId: auth.companyId };
              }
            }
          }
          return query(input);
        }
      }
    }
  });
}

const COOKIE_NAME$1 = "workquest_invitation";
function invitationConfig() {
  var _a, _b;
  const config = useRuntimeConfig();
  return {
    // Reuses the onboarding TTL: both are "finish this join now" windows.
    ttlSeconds: Number((_a = config.onboardingTicketTtlSeconds) != null ? _a : 60 * 15),
    secure: String((_b = config.secureCookies) != null ? _b : "true") !== "false"
  };
}
async function issueInvitationTicket(event, phone) {
  const db = usePrisma();
  const { ttlSeconds, secure } = invitationConfig();
  const expiresAt = new Date(Date.now() + ttlSeconds * 1e3);
  await db.onboardingTicket.updateMany({
    where: { phone, consumedAt: null },
    data: { consumedAt: /* @__PURE__ */ new Date() }
  });
  const ticket = await db.onboardingTicket.create({
    data: {
      phone,
      expiresAt,
      ip: getRequestIP(event, { xForwardedFor: true }),
      userAgent: getHeader(event, "user-agent")
    }
  });
  setCookie(event, COOKIE_NAME$1, ticket.id, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: ttlSeconds
  });
  return { id: ticket.id, phone: ticket.phone, expiresAt: ticket.expiresAt };
}
function readInvitationCookie(event) {
  const value = getCookie(event, COOKIE_NAME$1);
  return value && value.length > 0 ? value : void 0;
}
function clearInvitationCookie(event) {
  const { secure } = invitationConfig();
  deleteCookie(event, COOKIE_NAME$1, { httpOnly: true, secure, sameSite: "lax", path: "/" });
}
async function findInvitationTicket(event) {
  const id = readInvitationCookie(event);
  if (!id) return null;
  const ticket = await usePrisma().onboardingTicket.findUnique({ where: { id } });
  if (!ticket || ticket.consumedAt || ticket.expiresAt.getTime() < Date.now()) return null;
  return { id: ticket.id, phone: ticket.phone, expiresAt: ticket.expiresAt };
}
async function requireInvitationTicket(event) {
  const ticket = await findInvitationTicket(event);
  if (!ticket) {
    throw errors.unauthorized("\u0646\u0634\u0633\u062A \u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A\u061B \u0644\u0637\u0641\u0627\u064B \u062F\u0648\u0628\u0627\u0631\u0647 \u06A9\u062F \u0648\u0631\u0648\u062F \u0628\u06AF\u06CC\u0631\u06CC\u062F");
  }
  return ticket;
}
async function consumeInvitationTicket(tx, ticketId) {
  const { count } = await tx.onboardingTicket.updateMany({
    where: { id: ticketId, consumedAt: null },
    data: { consumedAt: /* @__PURE__ */ new Date() }
  });
  if (count === 0) {
    throw errors.conflict("\u0627\u06CC\u0646 \u0646\u0634\u0633\u062A \u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u0642\u0628\u0644\u0627\u064B \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A");
  }
}
async function listPendingInvitationsForPhone(phone) {
  const db = usePrisma();
  const now = /* @__PURE__ */ new Date();
  const rows = await db.invitation.findMany({
    where: { phone, status: "PENDING", expiresAt: { gt: now } },
    include: {
      company: { select: { id: true, name: true, slug: true, logoUrl: true } },
      team: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return rows.map(toInvitationDetail);
}
function toInvitationDetail(invitation) {
  return {
    id: invitation.id,
    company: invitation.company,
    fullName: invitation.fullName,
    jobTitle: invitation.jobTitle,
    phone: invitation.phone,
    role: invitation.role,
    team: invitation.team,
    expiresAt: invitation.expiresAt.toISOString(),
    status: invitation.status
  };
}
async function expireStaleInvitations(auth) {
  const { count } = await createTenantClient(auth).invitation.updateMany({
    where: { status: "PENDING", expiresAt: { lte: /* @__PURE__ */ new Date() } },
    data: { status: "EXPIRED", pendingPhone: null }
  });
  return count;
}

const MEMBER_SELECT = {
  id: true,
  fullName: true,
  phone: true,
  email: true,
  avatarUrl: true,
  jobTitle: true,
  role: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
  teamMemberships: {
    select: {
      id: true,
      teamId: true,
      role: true,
      managerId: true,
      joinedAt: true,
      manager: { select: { id: true, fullName: true } },
      team: { select: { id: true, name: true, slug: true } }
    }
  }
};
function assertCanLead(role) {
  if (!canLeadRole(role)) {
    throw errors.badRequest(
      "LEAD_ROLE_TOO_LOW",
      "\u0633\u0631\u067E\u0631\u0633\u062A \u062A\u06CC\u0645 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u0646\u0642\u0634 \xAB\u0645\u062F\u06CC\u0631 \u062A\u06CC\u0645\xBB \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F\u061B \u0627\u0628\u062A\u062F\u0627 \u0646\u0642\u0634 \u0627\u06CC\u0646 \u06A9\u0627\u0631\u0628\u0631 \u0631\u0627 \u0627\u0631\u062A\u0642\u0627 \u062F\u0647\u06CC\u062F"
    );
  }
}
function rejectSecondMembership(existing) {
  if (existing) {
    throw errors.conflict(
      `\u0627\u06CC\u0646 \u06A9\u0627\u0631\u0628\u0631 \u0639\u0636\u0648 \u062A\u06CC\u0645 \xAB${existing.team.name}\xBB \u0627\u0633\u062A\u061B \u0627\u0628\u062A\u062F\u0627 \u0639\u0636\u0648\u06CC\u062A \u0641\u0639\u0644\u06CC \u0631\u0627 \u062A\u063A\u06CC\u06CC\u0631 \u062F\u0647\u06CC\u062F`
    );
  }
}
async function ledTeamIds(auth) {
  const teams = await createTenantClient(auth).team.findMany({
    where: { leadId: auth.userId },
    select: { id: true }
  });
  return teams.map((team) => team.id);
}
async function teamDetail(db, teamId) {
  const team = await db.team.findUnique({
    where: { id: teamId },
    include: {
      lead: { select: { id: true, fullName: true } },
      members: {
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true, role: true } },
          manager: { select: { id: true, fullName: true } }
        },
        orderBy: { joinedAt: "asc" }
      }
    }
  });
  if (!team) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  return {
    team: {
      id: team.id,
      name: team.name,
      slug: team.slug,
      description: team.description,
      lead: team.lead,
      members: team.members.map((member) => ({
        id: member.id,
        userId: member.user.id,
        fullName: member.user.fullName,
        jobTitle: member.user.jobTitle,
        avatarUrl: member.user.avatarUrl,
        role: member.role,
        companyRole: member.user.role,
        manager: member.manager,
        joinedAt: member.joinedAt.toISOString()
      })),
      createdAt: team.createdAt.toISOString()
    },
    canEdit: true,
    candidates: []
  };
}

const DEFAULT_LEVELS = [
  { level: 1, minXp: 0, title: "\u062C\u0648\u0627\u0646\u0647", iconKey: "i-heroicons-sparkles" },
  { level: 2, minXp: 500, title: "\u06A9\u0627\u0648\u0634\u06AF\u0631", iconKey: "i-heroicons-bolt" },
  { level: 3, minXp: 1500, title: "\u0633\u0627\u0632\u0646\u062F\u0647", iconKey: "i-heroicons-wrench-screwdriver" },
  { level: 4, minXp: 3e3, title: "\u0631\u0627\u0647\u0628\u0631", iconKey: "i-heroicons-rocket-launch" },
  { level: 5, minXp: 5e3, title: "\u0627\u0633\u062A\u0627\u062F", iconKey: "i-heroicons-academic-cap" },
  { level: 6, minXp: 8e3, title: "\u067E\u06CC\u0634\u0631\u0648", iconKey: "i-heroicons-star" }
];
const SUPPORTED_TIMEZONES = ["Asia/Tehran", "Asia/Dubai", "Europe/Berlin", "UTC"];
const SUPPORTED_LOCALES = ["fa", "en"];

const COOKIE_NAME = "workquest_onboarding";
function onboardingConfig() {
  var _a, _b;
  const config = useRuntimeConfig();
  return {
    ttlSeconds: Number((_a = config.onboardingTicketTtlSeconds) != null ? _a : 60 * 15),
    secure: String((_b = config.secureCookies) != null ? _b : "true") !== "false"
  };
}
async function issueOnboardingTicket(event, phone) {
  const db = usePrisma();
  const { ttlSeconds, secure } = onboardingConfig();
  const expiresAt = new Date(Date.now() + ttlSeconds * 1e3);
  await db.onboardingTicket.updateMany({
    where: { phone, consumedAt: null },
    data: { consumedAt: /* @__PURE__ */ new Date() }
  });
  const ticket = await db.onboardingTicket.create({
    data: {
      phone,
      expiresAt,
      ip: getRequestIP(event, { xForwardedFor: true }),
      userAgent: getHeader(event, "user-agent")
    }
  });
  setCookie(event, COOKIE_NAME, ticket.id, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: ttlSeconds
  });
  return { id: ticket.id, phone: ticket.phone, expiresAt: ticket.expiresAt };
}
function readOnboardingCookie(event) {
  const value = getCookie(event, COOKIE_NAME);
  return value && value.length > 0 ? value : void 0;
}
function clearOnboardingCookie(event) {
  const { secure } = onboardingConfig();
  deleteCookie(event, COOKIE_NAME, { httpOnly: true, secure, sameSite: "lax", path: "/" });
}
async function findOnboardingTicket(event) {
  const id = readOnboardingCookie(event);
  if (!id) return null;
  const ticket = await usePrisma().onboardingTicket.findUnique({ where: { id } });
  if (!ticket || ticket.consumedAt || ticket.expiresAt.getTime() < Date.now()) return null;
  return { id: ticket.id, phone: ticket.phone, expiresAt: ticket.expiresAt };
}
async function requireOnboardingTicket(event) {
  const ticket = await findOnboardingTicket(event);
  if (!ticket) {
    throw errors.unauthorized("\u0646\u0634\u0633\u062A \u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A\u061B \u0644\u0637\u0641\u0627\u064B \u062F\u0648\u0628\u0627\u0631\u0647 \u06A9\u062F \u0648\u0631\u0648\u062F \u0628\u06AF\u06CC\u0631\u06CC\u062F");
  }
  return ticket;
}
async function consumeOnboardingTicket(tx, ticketId) {
  const { count } = await tx.onboardingTicket.updateMany({
    where: { id: ticketId, consumedAt: null },
    data: { consumedAt: /* @__PURE__ */ new Date() }
  });
  if (count === 0) {
    throw errors.conflict("\u0627\u06CC\u0646 \u0646\u0634\u0633\u062A \u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u0642\u0628\u0644\u0627\u064B \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A");
  }
}
async function reserveCompanySlug(db, requested) {
  const base = requested.slice(0, 50);
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const existing = await db.company.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing) return candidate;
  }
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}
async function bootstrapCompanyDefaults(tx, companyId, ownerId) {
  var _a;
  await tx.level.createMany({
    data: DEFAULT_LEVELS.map((level) => ({ companyId, ...level }))
  });
  const firstLevel = await tx.level.findFirst({
    where: { companyId },
    orderBy: { level: "asc" },
    select: { id: true }
  });
  await tx.userProgress.create({
    data: {
      companyId,
      userId: ownerId,
      xp: 0,
      coins: 0,
      levelId: (_a = firstLevel == null ? void 0 : firstLevel.id) != null ? _a : null
    }
  });
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class OtpDeliveryError extends Error {
  constructor(message, code = "OTP_DELIVERY_FAILED") {
    super(message);
    __publicField(this, "code", code);
    this.name = "OtpDeliveryError";
  }
}
function otpConfig() {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const config = useRuntimeConfig();
  return {
    provider: String((_a = config.otpProvider) != null ? _a : "console"),
    codeLength: Number((_b = config.otpCodeLength) != null ? _b : 6),
    ttlSeconds: Number((_c = config.otpTtlSeconds) != null ? _c : 120),
    maxAttempts: Number((_d = config.otpMaxAttempts) != null ? _d : 5),
    resendCooldownSeconds: Number((_e = config.otpResendCooldownSeconds) != null ? _e : 90),
    httpUrl: String((_f = config.otpHttpUrl) != null ? _f : ""),
    httpApiKey: String((_g = config.otpHttpApiKey) != null ? _g : ""),
    httpTemplate: String(
      (_h = config.otpHttpTemplate) != null ? _h : "\u06A9\u062F \u0648\u0631\u0648\u062F \u0634\u0645\u0627 \u0628\u0647 {app_name}: {code} (\u0627\u0639\u062A\u0628\u0627\u0631: {ttl} \u062B\u0627\u0646\u06CC\u0647)"
    )
  };
}
const consoleOtpProvider = {
  id: "console",
  isConfigured: () => true,
  async send({ to, code, ttlSeconds }) {
    console.warn(`[workquest:otp] code for ${to} is ${code} (valid ${ttlSeconds}s)`);
  }
};
const httpOtpProvider = {
  id: "http",
  isConfigured: () => otpConfig().httpUrl.length > 0,
  async send({ to, code, ttlSeconds, appName }) {
    const { httpUrl, httpApiKey, httpTemplate } = otpConfig();
    if (!httpUrl) {
      throw new OtpDeliveryError(
        "NUXT_OTP_HTTP_URL is not configured; the http OTP provider cannot deliver codes.",
        "OTP_PROVIDER_UNCONFIGURED"
      );
    }
    const message = httpTemplate.replaceAll("{code}", code).replaceAll("{ttl}", String(ttlSeconds)).replaceAll("{app_name}", appName);
    await $fetch(httpUrl, {
      method: "POST",
      timeout: 1e4,
      headers: {
        "content-type": "application/json",
        ...httpApiKey ? { authorization: `Bearer ${httpApiKey}` } : {}
      },
      body: { to, message, code, ttlSeconds }
    }).catch((error) => {
      throw new OtpDeliveryError(
        `OTP gateway request failed: ${error instanceof Error ? error.message : String(error)}`
      );
    });
  }
};
const providers = {
  console: consoleOtpProvider,
  http: httpOtpProvider
};
function resolveOtpProvider() {
  const { provider } = otpConfig();
  const resolved = providers[provider];
  if (!resolved) {
    throw new OtpDeliveryError(
      `Unknown OTP provider "${provider}". Available: ${Object.keys(providers).join(", ")}.`,
      "OTP_PROVIDER_UNKNOWN"
    );
  }
  return resolved;
}
function otpSettings() {
  return otpConfig();
}

const TASK_SELECT = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  progress: true,
  estimatedHours: true,
  dueDate: true,
  xpReward: true,
  coinReward: true,
  revisionCount: true,
  assignedAt: true,
  startedAt: true,
  submittedAt: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
  assignee: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true } },
  assigner: { select: { id: true, fullName: true, avatarUrl: true } },
  team: { select: { id: true, name: true, slug: true } },
  _count: { select: { comments: true, attachments: true } }
};
function toTaskSummary(task, now = /* @__PURE__ */ new Date()) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    progress: task.progress,
    estimatedHours: task.estimatedHours === null || task.estimatedHours === void 0 ? null : Number(task.estimatedHours),
    dueDate: (_b = (_a = task.dueDate) == null ? void 0 : _a.toISOString()) != null ? _b : null,
    isOverdue: isOverdue({ status: task.status, dueDate: task.dueDate }, now),
    xpReward: task.xpReward,
    coinReward: task.coinReward,
    revisionCount: task.revisionCount,
    assignedAt: (_d = (_c = task.assignedAt) == null ? void 0 : _c.toISOString()) != null ? _d : null,
    startedAt: (_f = (_e = task.startedAt) == null ? void 0 : _e.toISOString()) != null ? _f : null,
    submittedAt: (_h = (_g = task.submittedAt) == null ? void 0 : _g.toISOString()) != null ? _h : null,
    completedAt: (_j = (_i = task.completedAt) == null ? void 0 : _i.toISOString()) != null ? _j : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    assignee: task.assignee,
    assigner: task.assigner,
    team: task.team,
    commentCount: (_l = (_k = task._count) == null ? void 0 : _k.comments) != null ? _l : 0,
    attachmentCount: (_n = (_m = task._count) == null ? void 0 : _m.attachments) != null ? _n : 0
  };
}
async function taskVisibleUserIds(auth) {
  if (can(auth.role, "task:read:all")) return null;
  if (can(auth.role, "task:read:team")) {
    const reports = await getManagedUserIds(auth.companyId, auth.userId);
    return [.../* @__PURE__ */ new Set([auth.userId, ...reports])];
  }
  return [auth.userId];
}
async function ledTeamIdsFor(auth) {
  if (!can(auth.role, "task:read:team")) return [];
  const teams = await createTenantClient(auth).team.findMany({
    where: { leadId: auth.userId },
    select: { id: true }
  });
  return teams.map((team) => team.id);
}
async function loadVisibleTask(auth, taskId) {
  var _a, _b, _c;
  const db = createTenantClient(auth);
  const task = await db.task.findUnique({ where: { id: taskId }, select: TASK_SELECT });
  if (!task) throw errors.notFound("\u062A\u0633\u06A9 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const visible = await taskVisibleUserIds(auth);
  if (visible === null) return task;
  const assigneeId = (_b = (_a = task.assignee) == null ? void 0 : _a.id) != null ? _b : null;
  if (assigneeId && visible.includes(assigneeId)) return task;
  if (((_c = task.assigner) == null ? void 0 : _c.id) === auth.userId) return task;
  if (!assigneeId && task.team) {
    const led = await ledTeamIdsFor(auth);
    if (led.includes(task.team.id)) return task;
  }
  throw errors.notFound("\u062A\u0633\u06A9 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
}
async function canManageTask(auth, task) {
  var _a;
  if (!can(auth.role, "task:assign")) return false;
  if (can(auth.role, "task:read:all")) return true;
  if (((_a = task.assigner) == null ? void 0 : _a.id) === auth.userId) return true;
  const reports = await getManagedUserIds(auth.companyId, auth.userId);
  if (task.assignee && reports.includes(task.assignee.id)) return true;
  if (task.team) {
    const led = await ledTeamIdsFor(auth);
    if (led.includes(task.team.id)) return true;
  }
  return false;
}
async function assertAssignable(auth, assigneeId) {
  const db = createTenantClient(auth);
  const assignee = await db.user.findUnique({
    where: { id: assigneeId },
    select: { id: true, fullName: true, status: true }
  });
  if (!assignee) throw errors.badRequest("ASSIGNEE_NOT_FOUND", "\u0627\u0646\u062C\u0627\u0645\u200C\u062F\u0647\u0646\u062F\u0647 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u062F\u0631 \u0627\u06CC\u0646 \u0634\u0631\u06A9\u062A \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  if (assignee.status !== "ACTIVE") {
    throw errors.badRequest("ASSIGNEE_INACTIVE", "\u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646 \u0628\u0647 \u06A9\u0627\u0631\u0628\u0631 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u062A\u0633\u06A9 \u0645\u062D\u0648\u0644 \u06A9\u0631\u062F");
  }
  if (can(auth.role, "task:read:all")) return assignee;
  if (assignee.id === auth.userId) return assignee;
  const reports = await getManagedUserIds(auth.companyId, auth.userId);
  if (!reports.includes(assignee.id)) {
    throw errors.forbidden("\u0641\u0642\u0637 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0628\u0647 \u0627\u0639\u0636\u0627\u06CC \u062A\u06CC\u0645 \u062E\u0648\u062F\u062A\u0627\u0646 \u062A\u0633\u06A9 \u0628\u062F\u0647\u06CC\u062F");
  }
  return assignee;
}
async function assertUsableTeam(auth, teamId) {
  const db = createTenantClient(auth);
  const team = await db.team.findUnique({ where: { id: teamId }, select: { id: true, name: true } });
  if (!team) throw errors.badRequest("TEAM_NOT_FOUND", "\u062A\u06CC\u0645 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u062F\u0631 \u0627\u06CC\u0646 \u0634\u0631\u06A9\u062A \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  return team;
}
const TRANSITION_ERRORS = {
  UNKNOWN_ACTION: { code: "UNKNOWN_ACTION", message: "\u0627\u06CC\u0646 \u0639\u0645\u0644\u06CC\u0627\u062A \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0646\u0645\u06CC\u200C\u0634\u0648\u062F" },
  INVALID_TRANSITION: {
    code: "INVALID_TRANSITION",
    message: "\u0627\u06CC\u0646 \u062A\u063A\u06CC\u06CC\u0631 \u0648\u0636\u0639\u06CC\u062A \u0628\u0627 \u0648\u0636\u0639\u06CC\u062A \u0641\u0639\u0644\u06CC \u062A\u0633\u06A9 \u0633\u0627\u0632\u06AF\u0627\u0631 \u0646\u06CC\u0633\u062A"
  },
  NOT_ASSIGNEE: {
    code: "NOT_ASSIGNEE",
    message: "\u0641\u0642\u0637 \u0627\u0646\u062C\u0627\u0645\u200C\u062F\u0647\u0646\u062F\u0647\u0654 \u062A\u0633\u06A9 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0627\u06CC\u0646 \u06A9\u0627\u0631 \u0631\u0627 \u0627\u0646\u062C\u0627\u0645 \u062F\u0647\u062F"
  },
  SELF_REVIEW: {
    code: "SELF_REVIEW",
    message: "\u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u062A\u0633\u06A9 \u062E\u0648\u062F\u062A\u0627\u0646 \u0631\u0627 \u0628\u0627\u0632\u0628\u06CC\u0646\u06CC \u06CC\u0627 \u062A\u0623\u06CC\u06CC\u062F \u06A9\u0646\u06CC\u062F"
  },
  NOT_REVIEWER: {
    code: "NOT_REVIEWER",
    message: "\u0628\u0631\u0627\u06CC \u0628\u0627\u0632\u0628\u06CC\u0646\u06CC \u062A\u0633\u06A9 \u0628\u0627\u06CC\u062F \u0646\u0642\u0634 \u0645\u062F\u06CC\u0631 \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u06CC\u062F"
  }
};
function assertTransitionAllowed(auth, task, action) {
  var _a, _b;
  const result = checkTransition(task.status, action, {
    isAssignee: ((_a = task.assignee) == null ? void 0 : _a.id) === auth.userId,
    canReview: can(auth.role, "task:review")
  });
  if (result.allowed) return;
  const reason = (_b = result.reason) != null ? _b : "INVALID_TRANSITION";
  const detail = TRANSITION_ERRORS[reason];
  const statusCode = reason === "INVALID_TRANSITION" || reason === "UNKNOWN_ACTION" ? 409 : 403;
  throw apiError(statusCode, detail.code, detail.message);
}
async function recordTaskEvent(db, input) {
  var _a, _b, _c;
  await db.taskEvent.create({
    data: {
      companyId: input.companyId,
      taskId: input.taskId,
      actorId: input.actorId,
      action: input.action,
      fromStatus: (_a = input.fromStatus) != null ? _a : null,
      toStatus: (_b = input.toStatus) != null ? _b : null,
      note: ((_c = input.note) == null ? void 0 : _c.trim()) || null
    }
  });
}
async function notifyTask(db, input) {
  var _a;
  if (!input.userId || input.userId === input.actorId) return;
  await db.notification.create({
    data: {
      companyId: input.companyId,
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: (_a = input.body) != null ? _a : null,
      data: { taskId: input.taskId }
    }
  });
}

function useRuntimeI18n(nuxtApp, event) {
  {
    const getRuntimeConfig = useRuntimeConfig;
    return getRuntimeConfig(event).public.i18n;
  }
}
function useI18nDetection(nuxtApp) {
  const detectBrowserLanguage = useRuntimeI18n().detectBrowserLanguage;
  const detect = detectBrowserLanguage || {};
  return {
    ...detect,
    enabled: !!detectBrowserLanguage,
    cookieKey: detect.cookieKey || "i18n_redirected"
  };
}
function resolveRootRedirect(config) {
  if (!config) {
    return void 0;
  }
  return {
    path: "/" + (isString(config) ? config : config.path).replace(/^\//, ""),
    code: !isString(config) && config.statusCode || 302
  };
}

const normalizeDomain = (domain = "") => domain.replace(/^https?:\/\//i, "").toLowerCase();
function isLocaleOnHost(locale, host) {
  return !!locale?.domains.some((x) => normalizeDomain(x) === host);
}
function resolveLocaleReach(locales, host, locale) {
  const target = locales.find((l) => l.code === locale);
  if (!target?.domains.length || isLocaleOnHost(target, host)) {
    return "here";
  }
  return locales.some((l) => isLocaleOnHost(l, host)) ? "other-domain" : "off-host";
}
function isLocaleServedOnHost(locales, host, locale) {
  return resolveLocaleReach(locales, host, locale) !== "other-domain";
}
function matchDomainLocale(locales, host, pathLocale) {
  const matches = locales.filter((locale) => isLocaleOnHost(locale, host));
  return (
    // match by current path locale
    (matches.find((l) => l.code === pathLocale) || matches.find((l) => l.defaultForDomains.some((domain) => normalizeDomain(domain) === host)) || matches[0])?.code
  );
}
function cookieSpansDomains(locales, cookieDomain) {
  const scope = cookieDomain.replace(/^\./, "").replace(/:\d+$/, "").toLowerCase();
  return locales.every(
    (l) => l.domains.concat(l.domain || []).every((domain) => {
      const host = normalizeDomain(domain).replace(/:\d+$/, "");
      return host === scope || host.endsWith("." + scope);
    })
  );
}
function withRuntimeDomain(locale, domainLocales) {
  if (typeof locale === "string") {
    return locale;
  }
  const properties = locale;
  const domain = domainLocales[properties.code]?.domain;
  if (!domain || domain === properties.domain) {
    return locale;
  }
  return {
    ...properties,
    domain,
    domains: [domain],
    defaultForDomains: properties.defaultForDomains.length ? [domain] : []
  };
}

function createLocaleConfigs(fallbackLocale) {
  const localeConfigs = {};
  for (const locale of localeCodes) {
    const fallbacks = getFallbackLocaleCodes(fallbackLocale, [locale]);
    const cacheable = isLocaleWithFallbacksCacheable(locale, fallbacks);
    localeConfigs[locale] = { fallbacks, cacheable };
  }
  return localeConfigs;
}
function getFallbackLocaleCodes(fallback, locales) {
  if (fallback === false) {
    return [];
  }
  if (isArray(fallback)) {
    return fallback;
  }
  let fallbackLocales = [];
  if (isString(fallback)) {
    if (locales.every((locale) => locale !== fallback)) {
      fallbackLocales.push(fallback);
    }
    return fallbackLocales;
  }
  const targets = [...locales, "default"];
  for (const locale of targets) {
    if (locale in fallback == false) {
      continue;
    }
    fallbackLocales = [...fallbackLocales, ...fallback[locale].filter(Boolean)];
  }
  return fallbackLocales;
}
function isLocaleCacheable(locale) {
  return localeLoaders[locale] != null && localeLoaders[locale].every((loader) => loader.cache !== false);
}
function isLocaleWithFallbacksCacheable(locale, fallbackLocales) {
  return isLocaleCacheable(locale) && fallbackLocales.every((fallbackLocale) => isLocaleCacheable(fallbackLocale));
}
function getDefaultLocaleForDomain(host, locales = normalizedLocales) {
  return locales.find((l) => l.defaultForDomains.some((domain) => normalizeDomain(domain) === host))?.code;
}
function resolveDefaultLocale(host, defaultLocale, locales = normalizedLocales) {
  const resolved = getDefaultLocaleForDomain(host, locales) || defaultLocale;
  if (resolved) {
    return resolved;
  }
  return (locales.some((l) => l.domains.length) ? locales[0]?.code : "") || "";
}
const isSupportedLocale = (locale) => localeCodes.includes(locale || "");

const storage = prefixStorage(useStorage(), "i18n");
function deepFreeze(value) {
  if (value == null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }
  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }
  return Object.freeze(value);
}
function cachedFunctionI18n(fn, opts) {
  opts = { maxAge: 1, ...opts };
  const pending = {};
  async function get(key, resolver) {
    const isPending = pending[key];
    if (!isPending) {
      pending[key] = Promise.resolve(resolver());
    }
    try {
      return await pending[key];
    } finally {
      delete pending[key];
    }
  }
  return async (...args) => {
    const key = [opts.name, opts.getKey(...args)].join(":").replace(/:\/$/, ":index");
    const maxAge = opts.maxAge ?? 1;
    const isCacheable = !opts.shouldBypassCache(...args) && maxAge >= 0;
    const cache = isCacheable && await storage.getItemRaw(key);
    if (!cache || cache.ttl < Date.now()) {
      pending[key] = Promise.resolve(fn(...args));
      const value = await get(key, () => fn(...args));
      if (isCacheable) {
        deepFreeze(value);
        await storage.setItemRaw(key, { ttl: Date.now() + maxAge * 1e3, value, mtime: Date.now() });
      }
      return value;
    }
    return cache.value;
  };
}

const _getMessages = async (locale) => {
  return { [locale]: await getLocaleMessagesMerged(locale, localeLoaders[locale]) };
};
cachedFunctionI18n(_getMessages, {
  name: "messages",
  maxAge: -1 ,
  getKey: (locale) => locale,
  shouldBypassCache: (locale) => !isLocaleCacheable(locale)
});
const getMessages = _getMessages ;
function appContextHint(e) {
  if (!/ is not defined|Nuxt instance unavailable/.test(e.message)) {
    return "";
  }
  return ". Locale loaders run outside the Nuxt app when the server produces messages, so Nuxt app composables (`useNuxtApp`, `useState`, `useCookie`, ...) are unavailable - call them in the locale file itself to have the build keep that locale in the app instead.";
}
const _getMergedMessages = async (locale, fallbackLocales) => {
  try {
    if (fallbackLocales.length === 0) {
      return await getMessages(locale) ?? {};
    }
    const merged = {};
    const messages = await Promise.all(fallbackLocales.map(getMessages));
    for (const message of messages) {
      deepCopy(message, merged);
    }
    deepCopy(await getMessages(locale), merged);
    return merged;
  } catch (e) {
    throw new Error("Failed to merge messages: " + e.message + appContextHint(e), { cause: e });
  }
};
const getMergedMessages = cachedFunctionI18n(_getMergedMessages, {
  name: "merged-single",
  maxAge: -1 ,
  getKey: (locale, fallbackLocales) => `${locale}-[${[...new Set(fallbackLocales)].sort().join("-")}]`,
  shouldBypassCache: (locale, fallbackLocales) => !isLocaleWithFallbacksCacheable(locale, fallbackLocales)
});

function useI18nContext(event) {
  if (event.context.nuxtI18n == null) {
    throw new Error("Nuxt I18n server context has not been set up yet.");
  }
  return event.context.nuxtI18n;
}
function tryUseI18nContext(event) {
  return event.context.nuxtI18n;
}
const getHost = (event) => getRequestURL(event, { xForwardedHost: true }).host;
async function initializeI18nContext(event) {
  const runtimeI18n = useRuntimeI18n(void 0, event);
  const defaultLocale = runtimeI18n.defaultLocale || "";
  const options = await setupVueI18nOptions(resolveDefaultLocale(getHost(event), defaultLocale));
  const localeConfigs = createLocaleConfigs(options.fallbackLocale);
  const ctx = createI18nContext();
  ctx.vueI18nOptions = options;
  ctx.localeConfigs = localeConfigs;
  event.context.nuxtI18n = ctx;
  return ctx;
}
function createI18nContext() {
  return {
    messages: {},
    slp: {},
    localeConfigs: {},
    trackMap: {},
    vueI18nOptions: void 0,
    trackKey(key, locale) {
      this.trackMap[locale] ??= /* @__PURE__ */ new Set();
      this.trackMap[locale].add(key);
    },
    async loadMessages(locale) {
      const messages = await getMergedMessages(locale, this.localeConfigs?.[locale]?.fallbacks ?? []) ?? {};
      return this.vueI18nOptions?.flatJson ? cloneDeep(messages) : messages;
    }
  };
}

const appHead = {"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1, viewport-fit=cover"},{"name":"theme-color","content":"#4f46e5"},{"name":"color-scheme","content":"light dark"},{"name":"description","content":"ورک‌کوئست؛ پلتفرم مدیریت عملکرد کارکنان با لایه‌ی بازی‌وارسازی"}],"link":[{"rel":"icon","type":"image/svg+xml","href":"/favicon.svg"}],"style":[],"script":[],"noscript":[],"htmlAttrs":{"lang":"fa","dir":"rtl"},"titleTemplate":"%s — ورک‌کوئست"};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt","class":"isolate"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appSpaLoaderTag = "div";

const appSpaLoaderAttrs = {"id":"__nuxt-loader"};

const appId = "nuxt-app";

const separator = "___";
const createTrailingSlashFormatter = (trailingSlash) => trailingSlash ? withTrailingSlash : withoutTrailingSlash;
function prefixable(currentLocale, defaultLocale, options) {
  return (currentLocale !== defaultLocale || options.strategy === "prefix");
}
const pathLanguageParser = createPathIndexLanguageParser(0);
const getLocaleFromRoutePath = (path) => pathLanguageParser(path);
const getLocaleFromRouteName = (name) => name.split(separator).at(1) ?? "";
function normalizeInput(input) {
  return typeof input !== "object" ? String(input) : String(input?.name || input?.path || "");
}
function getLocaleFromRoute(route) {
  const input = normalizeInput(route);
  if (input[0] === "/") {
    return getLocaleFromRoutePath(input);
  }
  const fromName = getLocaleFromRouteName(input);
  if (fromName) {
    return fromName;
  }
  if (typeof route === "object" && route?.path) {
    return getLocaleFromRoutePath(String(route.path));
  }
  return "";
}

function matchBrowserLocale(locales, browserLocales) {
  const matchedLocales = [];
  for (const [index, browserCode] of browserLocales.entries()) {
    const matchedLocale = locales.find((l) => l.language?.toLowerCase() === browserCode.toLowerCase());
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 1 - index / browserLocales.length });
      break;
    }
  }
  for (const [index, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split("-")[0].toLowerCase();
    const matchedLocale = locales.find((l) => l.language?.split("-")[0].toLowerCase() === languageCode);
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 0.999 - index / browserLocales.length });
      break;
    }
  }
  return matchedLocales;
}
function compareBrowserLocale(a, b) {
  if (a.score === b.score) {
    return b.code.length - a.code.length;
  }
  return b.score - a.score;
}
function findBrowserLocale(locales, browserLocales) {
  const matchedLocales = matchBrowserLocale(
    locales.map((l) => ({ code: l.code, language: l.language || l.code })),
    browserLocales
  );
  return matchedLocales.sort(compareBrowserLocale).at(0)?.code ?? "";
}

const getCookieLocale = (event, cookieName) => (getCookie(event, cookieName)) || void 0;
const getRouteLocale = (event, route) => getLocaleFromRoute(route);
const getHeaderLocale = (event) => findBrowserLocale(normalizedLocales, parseAcceptLanguage(getRequestHeader(event, "accept-language") || ""));
const getRequestHost = (event) => getRequestURL(event, { xForwardedHost: true }).host;
const getRefererHost = (event) => {
  const referer = getRequestHeader(event, "referer");
  try {
    return referer && new URL(referer).host || void 0;
  } catch {
    return void 0;
  }
};
const getDomainLocales = (domainLocales) => normalizedLocales.map((l) => withRuntimeDomain(l, domainLocales));
const useDetectors = (event, config, nuxtApp) => {
  if (!event) {
    throw new Error("H3Event is required for server-side locale detection");
  }
  const runtimeI18n = useRuntimeI18n();
  let host;
  let locales;
  const getHost = () => host ??= getRequestHost(event);
  const getLocales = () => locales ??= getDomainLocales(runtimeI18n.domainLocales);
  return {
    cookie: () => getCookieLocale(event, config.cookieKey),
    header: () => getHeaderLocale(event) ,
    navigator: () => void 0,
    host: (path) => matchDomainLocale(getLocales(), getHost(), getLocaleFromRoutePath(path)),
    route: (path) => getRouteLocale(event, path),
    /** Passes the locale through when the current host serves it, `undefined` otherwise */
    onHost: (locale) => !locale || isLocaleServedOnHost(getLocales(), getHost(), locale) ? locale : void 0,
    /** Whether the visitor arrived from one of the configured domains */
    fromOwnDomain: () => {
      const referer = getRefererHost(event);
      return !!referer && getLocales().some((l) => isLocaleOnHost(l, referer));
    },
    /** Whether a cookie scoped to the configured `cookieDomain` is readable on every domain */
    cookieSpans: () => !!config.cookieDomain && cookieSpansDomains(getLocales(), config.cookieDomain)
  };
};
function createLocaleDetector(config) {
  const { detection} = config;
  const isSupported = config.isSupportedLocale ?? isSupportedLocale;
  function skipDetect(path, pathLocale) {
    if (detection.redirectOn === "root" && path !== "/") {
      return true;
    }
    if (detection.redirectOn === "no prefix" && !detection.alwaysRedirect && isSupported(pathLocale)) {
      return true;
    }
    return false;
  }
  return function detectLocale(detectors, route, initial) {
    const path = isString(route) ? parsePath(route).pathname : route.path;
    const pass = (locale) => locale;
    const onHost = pass;
    function* detect() {
      const detecting = initial && detection.enabled && !skipDetect(path, detectors.route(path));
      if (detecting) {
        const cookie = onHost;
        const browser = onHost;
        yield cookie(detectors.cookie());
        yield browser(detectors.header());
        yield browser(detectors.navigator());
      }
      {
        yield detectors.route(route);
      }
      if (detecting) {
        yield onHost(detection.fallbackLocale);
      }
    }
    for (const detected of detect()) {
      if (detected && isSupported(detected)) {
        return detected;
      }
    }
    return "";
  };
}

// Generated by @nuxtjs/i18n
const localizedPaths = [
  "/invitations/join",
  "/login/verify",
  "/onboarding/company",
  "/onboarding/profile",
  "/members/:id()",
  "/tasks/:id()",
  "/team/:id()",
  "/achievements",
  "/dashboard",
  "/invitations",
  "/leaderboard",
  "/login",
  "/members",
  "/notifications",
  "/rewards",
  "/settings",
  "/tasks",
  "/team",
  "/"
];
const pathToI18nConfig = {};
const i18nPathToPath = {};
const disabledPaths = [];

const emptyRoute = { path: "/", name: "", matched: [], params: {}, meta: {} };
function createPathMatcher(resources, config) {
  const matcher = createRouterMatcher([], {});
  for (const path of [...resources.localizedPaths, ...Object.keys(resources.i18nPathToPath)]) {
    matcher.addRoute({ path, component: () => "", meta: {} });
  }
  const disabledI18nMatcher = createRouterMatcher([], {});
  for (const path of resources.disabledPaths) {
    disabledI18nMatcher.addRoute({ path, component: () => "", meta: {} });
  }
  const formatTrailingSlash = createTrailingSlashFormatter(config.trailingSlash);
  const getI18nPathToI18nPath = (path, locale) => {
    if (!path || !locale) {
      return;
    }
    const plainPath = resources.i18nPathToPath[path] ?? path;
    const i18nConfig = resources.pathToI18nConfig[plainPath];
    if (i18nConfig == null || !(locale in i18nConfig)) {
      return plainPath;
    }
    return i18nConfig[locale] || void 0;
  };
  function isExistingNuxtRoute2(path) {
    if (path === "") {
      return;
    }
    if (path.endsWith("/__nuxt_error")) {
      return;
    }
    if (disabledI18nMatcher.resolve({ path }, emptyRoute).matched.length > 0) {
      return;
    }
    const resolvedMatch = matcher.resolve({ path }, emptyRoute);
    return resolvedMatch.matched.length > 0 ? resolvedMatch : void 0;
  }
  function matchLocalized2(path, locale, defaultLocale) {
    if (path === "") {
      return;
    }
    const parsed = parsePath(path);
    const resolvedMatch = matcher.resolve({ path: parsed.pathname || "/" }, emptyRoute);
    if (resolvedMatch.matched.length === 0) {
      return;
    }
    const alternate = getI18nPathToI18nPath(resolvedMatch.matched[0].path, locale);
    if (!alternate) {
      return;
    }
    const match = matcher.resolve({ params: resolvedMatch.params }, { ...emptyRoute, path: alternate });
    const isPrefixable = prefixable(locale, defaultLocale, config);
    return formatTrailingSlash(withLeadingSlash(joinURL(isPrefixable ? locale : "", match.path)), true);
  }
  return { isExistingNuxtRoute: isExistingNuxtRoute2, matchLocalized: matchLocalized2 };
}
const { isExistingNuxtRoute, matchLocalized } = createPathMatcher(
  { localizedPaths, i18nPathToPath, pathToI18nConfig, disabledPaths },
  { strategy: "prefix_except_default", trailingSlash: false }
);

function createRedirectResolver(config) {
  const { detection, rootRedirect, matchLocalized} = config;
  const isSupported = config.isSupportedLocale ?? isSupportedLocale;
  const detectLocale = createLocaleDetector({ detection, isSupportedLocale: isSupported});
  return function resolveRedirectPath(fullPath, path, pathLocale, defaultLocale, detectors, relocate) {
    let locale = detectLocale(detectors, fullPath, true) || defaultLocale;
    function getLocalizedMatch(locale2) {
      const res = matchLocalized(path || "/", locale2, defaultLocale);
      if (res && res !== fullPath) {
        return res;
      }
    }
    let resolvedPath = void 0;
    let redirectCode = 302;
    const pathname = parsePath(fullPath).pathname;
    if (rootRedirect && pathname === "/") {
      locale = detection.enabled && locale || defaultLocale;
      resolvedPath = isSupported(detectors.route(rootRedirect.path)) && rootRedirect.path || matchLocalized(rootRedirect.path, locale, defaultLocale);
      redirectCode = rootRedirect.code;
    } else if (config.redirectStatusCode) {
      redirectCode = config.redirectStatusCode;
    }
    switch (detection.redirectOn) {
      case "root":
        if (pathname !== "/") {
          break;
        }
      // fallthrough (root has no prefix)
      case "no prefix":
        if (pathLocale) {
          break;
        }
      // fallthrough to resolve
      case "all":
        resolvedPath ??= getLocalizedMatch(locale);
        break;
    }
    return { path: resolvedPath, code: redirectCode, locale };
  };
}

function createRedirectResponse(event, dest, code) {
  event.node.res.setHeader("location", dest);
  event.node.res.statusCode = sanitizeStatusCode(code, event.node.res.statusCode);
  return {
    headers: event.node.res.getHeaders(),
    statusCode: event.node.res.statusCode,
    body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${dest.replace(/"/g, "%22")}"></head></html>`
  };
}
const _iriEbAI6bnBUmMWqNfB4cV0aaBcbSAyKNwkjRullXQ = defineNitroPlugin(async (nitro) => {
  const runtimeI18n = useRuntimeI18n();
  const rootRedirect = resolveRootRedirect(runtimeI18n.rootRedirect);
  runtimeI18n.defaultLocale || "";
  try {
    const cacheStorage = useStorage("cache");
    const cachedKeys = await cacheStorage.getKeys("nitro:handlers:i18n");
    await Promise.all(cachedKeys.map((key) => cacheStorage.removeItem(key)));
  } catch {
  }
  const detection = useI18nDetection();
  const cookieOptions = {
    path: "/",
    domain: detection.cookieDomain || void 0,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: detection.cookieSecure
  };
  const legacyBaseUrl = isFunction(runtimeI18n.baseUrl);
  if (legacyBaseUrl) {
    console.warn("[nuxt-i18n] Configuring baseUrl as a function is deprecated and will be removed in v11.");
  }
  const baseUrlGetter = (event) => {
    return "";
  };
  const resolveRedirectPath = createRedirectResolver({
    detection,
    rootRedirect,
    redirectStatusCode: runtimeI18n.redirectStatusCode,
    matchLocalized});
  nitro.hooks.hook("request", async (event) => {
    await initializeI18nContext(event);
  });
  nitro.hooks.hook("render:before", async (context) => {
    const { event } = context;
    const ctx = useI18nContext(event);
    const url = getRequestURL(event);
    const detector = useDetectors(event, detection);
    const localeSegment = detector.route(event.path);
    const pathLocale = isSupportedLocale(localeSegment) && localeSegment || void 0;
    const { pathname } = parsePath(event.path);
    const path = pathLocale ? pathname.slice(pathLocale.length + 1) || "/" : pathname;
    if (!url.pathname.includes("/_i18n") && !isExistingNuxtRoute(path)) {
      return;
    }
    const resolved = resolveRedirectPath(
      event.path,
      path,
      pathLocale,
      ctx.vueI18nOptions.defaultLocale,
      detector,
      void 0
    );
    if (resolved.path && (resolved.origin || resolved.path !== pathname)) {
      ctx.detectLocale = resolved.locale;
      detection.useCookie && (!resolved.origin || detection.cookieDomain) && setCookie(event, detection.cookieKey, resolved.locale, cookieOptions);
      context.response = createRedirectResponse(
        event,
        // the resolved path is base-free (matched against base-free routes), re-add `app.baseURL`
        joinURL(
          resolved.origin || baseUrlGetter(),
          useRuntimeConfig(event).app.baseURL,
          resolved.path + url.search
        ),
        resolved.code
      );
      return;
    }
  });
  nitro.hooks.hook("render:html", (htmlContext, { event }) => {
    tryUseI18nContext(event);
  });
});

//#region src/runtime/diagnostics.ts
const ansi = (open, close) => (s) => `\x1B[${open}m${s}\x1B[${close}m`;
const colors = {
	red: ansi(31, 39),
	yellow: ansi(33, 39),
	cyan: ansi(36, 39),
	gray: ansi(90, 39),
	bold: ansi(1, 22),
	dim: ansi(2, 22)
};
/**
* E8xxx
* Nitro server runtime (SSR rendering / dev server) diagnostics.
*/
const docsBase = (code) => `https://nuxt.com/docs/4.x/errors/${code.replace("NUXT_", "").toLowerCase()}`;
const serverDiagnostics = /* #__PURE__ */ defineDiagnostics({
	docsBase,
	reporters: [/* @__PURE__ */ createConsoleReporter({ formatter: ansiFormatter(colors) } )],
	codes: {
		NUXT_E8001: {
			why: (p) => `\`render:html\` mutated \`body\`/\`bodyAppend\` while streaming (\`${p.path}\`). These fields are silently dropped because the body is about to stream.`,
			fix: "Use the `render:html:close` hook instead.",
			docs: false
		},
		NUXT_E8002: {
			why: (p) => `SSR streaming committed the response before render completed (\`${p.path}\`). The following mutations did not reach the client and were dropped:\n  - ${p.mutations}`,
			fix: (p) => `Move the mutation into a plugin (which runs before the shell is flushed), or opt this route out of streaming with \`routeRules: { '${p.path}': { streaming: false } }\` or the \`render:route\` hook.`,
			docs: false
		},
		NUXT_E8003: {
			why: (p) => `Failed to stringify dev server logs.${p.error ? ` Received \`${p.error}\`.` : ""}`,
			fix: "You can define your own reducer/reviver for rich types following the instructions in `https://nuxt.com/docs/4.x/api/composables/use-nuxt-app#payload`.",
			docs: false
		},
		NUXT_E8004: {
			why: "The server bundle is not available.",
			fix: "Ensure the Nuxt build completed successfully and the server entry was emitted by your builder.",
			docs: false
		},
		NUXT_E8005: {
			why: "Island props cannot contain a `template` key, which the Vue runtime compiler would compile and execute.",
			fix: "Rename the prop (e.g. `templateName`), or disable `vue.runtimeCompiler` if you do not need runtime template compilation.",
			docs: false
		}
	}
});

const rootDir = "/home/user/WorkQuest";

//#region src/runtime/plugins/dev-server-logs.ts
const devReducers = {
	VNode: (data) => isVNode(data) ? {
		type: data.type,
		props: data.props
	} : void 0,
	URL: (data) => data instanceof URL ? data.toString() : void 0,
	Symbol: (data) => typeof data === "symbol" ? data.description ?? "" : void 0
};
const asyncContext = getContext$1("nuxt-dev", {
	asyncContext: true,
	AsyncLocalStorage
});
var dev_server_logs_default = (nitroApp) => {
	const handler = nitroApp.h3App.handler;
	nitroApp.h3App.handler = (event) => {
		return asyncContext.callAsync({
			logs: [],
			event
		}, () => handler(event));
	};
	onConsoleLog((_log) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) return;
		const rawStack = captureRawStackTrace();
		if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) return;
		const trace = [];
		let filename = "";
		for (const entry of parseRawStackTrace(rawStack)) {
			if (entry.source === globalThis._importMeta_.url) continue;
			if (EXCLUDE_TRACE_RE.test(entry.source)) continue;
			filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
			trace.push({
				...entry,
				source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
			});
		}
		const log = {
			..._log,
			filename,
			stack: trace
		};
		ctx.logs.push(log);
	});
	nitroApp.hooks.hook("afterResponse", () => {
		const ctx = asyncContext.tryUse();
		if (!ctx) return;
		return nitroApp.hooks.callHook("dev:ssr-logs", {
			logs: ctx.logs,
			path: ctx.event.path
		});
	});
	nitroApp.hooks.hook("render:html", (htmlContext) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) return;
		try {
			const reducers = Object.assign(Object.create(null), devReducers, ctx.event.context["~payloadReducers"]);
			htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
		} catch (e) {
			serverDiagnostics.NUXT_E8003({
				error: e instanceof Error ? e.toString() : void 0,
				cause: e
			});
		}
	});
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
	consola$1.addReporter({ log(logObj) {
		callback(logObj);
	} });
	consola$1.wrapConsole();
}

const script = "\"use strict\";(()=>{const o=window,e=document.documentElement,c=[\"dark\",\"light\"],s=getStorageValue(\"localStorage\",\"nuxt-color-mode\")||\"system\";let r=s===\"system\"?f():s;const l=e.getAttribute(\"data-color-mode-forced\");l&&(r=l),i(r),o[\"__NUXT_COLOR_MODE__\"]={preference:s,value:r,getColorScheme:f,addColorScheme:i,removeColorScheme:d};function i(t){const a=\"\"+t+\"\",n=\"\";e.classList?e.classList.add(a):e.className+=\" \"+a,n&&e.setAttribute(\"data-\"+n,t)}function d(t){const a=\"\"+t+\"\",n=\"\";e.classList?e.classList.remove(a):e.className=e.className.replace(new RegExp(a,\"g\"),\"\"),n&&e.removeAttribute(\"data-\"+n)}function u(t){return o.matchMedia(\"(prefers-color-scheme\"+t+\")\")}function f(){if(o.matchMedia&&u(\"\").media!==\"not all\"){for(const t of c)if(u(\":\"+t).matches)return t}return\"light\"}})();function getStorageValue(o,e){switch(o){case\"localStorage\":try{return window.localStorage.getItem(e)}catch{return null}case\"sessionStorage\":try{return window.sessionStorage.getItem(e)}catch{return null}case\"cookie\":try{return getCookie(e)}catch{return null}default:return null}}function getCookie(o){const c=(\"; \"+window.document.cookie).split(\"; \"+o+\"=\");if(c.length===2){const s=c.pop();return s?s.split(\";\").shift():null}}";

const _sXMGCUclCAgYLiHS_iQ_PdMvY7s37PPSHtOgpk5DB8 = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _g38J_PZTdlVRc3hHqdKruKdHJca90h4oXiwheBlNWA,
_iriEbAI6bnBUmMWqNfB4cV0aaBcbSAyKNwkjRullXQ,
dev_server_logs_default,
_sXMGCUclCAgYLiHS_iQ_PdMvY7s37PPSHtOgpk5DB8,
_wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw
];

const assets = {};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _XUlAU5 = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const PUBLIC_API_ROUTES = [
  "/api/auth/otp/request",
  "/api/auth/otp/verify",
  "/api/auth/onboarding",
  "/api/auth/onboarding/complete",
  "/api/auth/invitations",
  "/api/auth/invitations/accept",
  "/api/companies/slug",
  "/api/health"
];
function isPublicApiRoute(path) {
  var _a;
  const pathname = (_a = path.split("?")[0]) != null ? _a : path;
  return PUBLIC_API_ROUTES.includes(pathname.replace(/\/$/, ""));
}
const _aLrtwO = defineEventHandler(async (event) => {
  var _a;
  const path = (_a = event.path) != null ? _a : "/";
  if (!path.startsWith("/api/")) return;
  if (isPublicApiRoute(path)) return;
  const token = readSessionToken(event);
  if (!token) throw errors.unauthorized();
  const claims = await verifySessionToken(token);
  if (!claims) throw errors.unauthorized("\u0646\u0634\u0633\u062A \u0634\u0645\u0627 \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647 \u0627\u0633\u062A");
  const db = usePrisma();
  const [user, session] = await Promise.all([
    db.user.findFirst({
      where: { id: claims.sub, status: "ACTIVE" },
      include: { company: true }
    }),
    db.session.findFirst({ where: { id: claims.sid, revokedAt: null } })
  ]);
  if (!user || !user.company.isActive || !session) {
    throw errors.unauthorized("\u0646\u0634\u0633\u062A \u0634\u0645\u0627 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A");
  }
  if (!isRole(claims.role) || claims.role !== user.role) {
    throw errors.unauthorized("\u0646\u0642\u0634 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0634\u0645\u0627 \u062A\u063A\u06CC\u06CC\u0631 \u06A9\u0631\u062F\u0647 \u0627\u0633\u062A");
  }
  const auth = {
    userId: user.id,
    sessionId: session.id,
    companyId: user.companyId,
    role: user.role,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    locale: user.locale,
    avatarUrl: user.avatarUrl,
    company: {
      id: user.company.id,
      name: user.company.name,
      slug: user.company.slug,
      locale: user.company.locale,
      timezone: user.company.timezone
    }
  };
  event.context.auth = auth;
  if (tokenNeedsRenewal(token)) {
    const renewed = await signSessionToken({
      sub: auth.userId,
      sid: auth.sessionId,
      cid: auth.companyId,
      role: auth.role
    });
    setSessionCookie(event, renewed);
  }
});

const options = {"iconifyApiEndpoint":"https://api.iconify.design"};

const warnOnceSet = /* @__PURE__ */ new Set();
const DEFAULT_ENDPOINT = "https://api.iconify.design";
function getInstallCommand(pkg) {
  const ua = process.env.npm_config_user_agent || "";
  if (ua.startsWith("pnpm")) return `pnpm add -D ${pkg}`;
  if (ua.startsWith("yarn")) return `yarn add -D ${pkg}`;
  if (ua.startsWith("bun")) return `bun add -D ${pkg}`;
  return `npm i -D ${pkg}`;
}
const _DuJdd3 = defineCachedEventHandler(async (event) => {
  const collectionName = event.context.params?.collection?.replace(/\.json$/, "");
  const collection = collectionName && Object.hasOwn(collections, collectionName) ? await collections[collectionName]?.() : null;
  const apiEndPoint = options.iconifyApiEndpoint;
  const icons = String(parseQuery(parsePath(event.path).search).icons || "").split(",");
  if (!collectionName) return createError({ status: 400, message: "No collection specified" });
  if (!icons.length) return createError({ status: 400, message: "No icons specified" });
  if (!collection && true && !warnOnceSet.has(collectionName) && apiEndPoint === DEFAULT_ENDPOINT) {
    consola$1.warn([
      `[Icon] Collection \`${collectionName}\` is not found locally`,
      `We suggest to install it via \`${getInstallCommand(`@iconify-json/${collectionName}`)}\` to provide the best end-user experience.`
    ].join("\n"));
    warnOnceSet.add(collectionName);
  }
  if (collection) {
    const data = getIcons(
      collection,
      icons
    );
    consola$1.debug(`[Icon] serving ${icons.map((i) => "`" + collectionName + ":" + i + "`").join(",")} from bundled collection`);
    return data;
  }
  {
    const apiUrl = new URL(`./${collectionName}.json?icons=${icons.join(",")}`, apiEndPoint);
    consola$1.debug(`[Icon] fetching ${icons.map((i) => "`" + collectionName + ":" + i + "`").join(",")} from iconify api`);
    if (apiUrl.host !== new URL(apiEndPoint).host) {
      return createError({ status: 400, message: "Invalid icon request" });
    }
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        return response.status === 404 ? createError({ status: 404 }) : createError({ status: 500, message: "Failed to fetch fallback icon" });
      }
      return response.json();
    } catch (e) {
      consola$1.error(e);
      return createError({ status: 500, message: "Failed to fetch fallback icon" });
    }
  }
  return createError({ status: 404 });
}, {
  group: "nuxt",
  name: "icon",
  getKey(event) {
    const collection = event.context.params?.collection?.replace(/\.json$/, "") || "unknown";
    const icons = String(parseQuery(parsePath(event.path).search).icons || "").split(",");
    return `${collection}_${icons[0]}_${icons.length}_${hash$1(icons.join(","))}`;
  },
  swr: true,
  maxAge: 60 * 60 * 24 * 7
  // 1 week
});

const _messagesHandler = defineEventHandler(async (event) => {
  const locale = getRouterParam(event, "locale");
  if (!locale) {
    throw createError({ status: 400, message: "Locale not specified." });
  }
  const ctx = useI18nContext(event);
  if (ctx.localeConfigs && locale in ctx.localeConfigs === false) {
    throw createError({ status: 404, message: `Locale '${locale}' not found.` });
  }
  const messages = await ctx.loadMessages(locale);
  {
    for (const k of Object.keys(messages)) {
      warnMissedMessageFunctions(k, messages[k]);
    }
  }
  return messages;
});
const getCacheKey = (event) => [getRouterParam(event, "locale") ?? "null", getRouterParam(event, "hash") ?? "null"].join("-");
async function shouldBypassCache(event) {
  const locale = getRouterParam(event, "locale");
  if (locale == null) {
    return false;
  }
  const ctx = tryUseI18nContext(event) || await initializeI18nContext(event);
  return !ctx.localeConfigs?.[locale]?.cacheable;
}
const _cachedMessageLoader = defineCachedFunction(_messagesHandler, {
  name: "i18n:messages-internal",
  maxAge: -1 ,
  getKey: getCacheKey,
  shouldBypassCache
});
defineCachedEventHandler(_cachedMessageLoader, {
  name: "i18n:messages",
  maxAge: -1 ,
  swr: false,
  getKey: getCacheKey,
  shouldBypassCache
});
const _OIYs8c = _messagesHandler ;

//#region ../nuxt/src/app/island-hash.ts
/**
* Strip Vue scoped-style attributes (`data-v-*`) from island props before hashing
* or rendering. Scoped-id markers leak in from parent components and are not part
* of the logical island input.
*
* Used before island props are serialized and sent to the island handler.
*
* @internal
*/
function filterIslandProps(props) {
	if (!props) return {};
	const out = {};
	for (const key in props) if (!key.startsWith("data-v-")) out[key] = props[key];
	return out;
}
/**
* Compute the `hashId` segment embedded in an island URL (`/__nuxt_island/<Name>_<hashId>.json`).
*
* The hash binds the response to the requested `(name, props, context, source)` tuple, so the
* server can reject requests whose URL hash does not match the supplied query/body. Use this
* from island clients if you need to ensure a hash stays in step with Nuxt's implementation.
*
* `props` may be passed either as the raw props object or as the JSON string that will be sent
* over the wire; the two produce the same hash when the round-trip is identity.
*
* @since 4.5.0
*/
function getIslandHash(input) {
	const props = typeof input.props === "string" ? parseSerializedProps(input.props) : input.props ?? {};
	return hash$1([
		input.name,
		props,
		input.context ?? {},
		input.source
	]).replace(/[-_]/g, "");
}
function parseSerializedProps(serializedProps) {
	try {
		return JSON.parse(serializedProps);
	} catch {
		return serializedProps;
	}
}

//#region src/runtime/utils/island-props.ts
/** @internal */
const MAX_ISLAND_BODY_BYTES = 65536;
/**
* Whether the bracket nesting of a JSON-ish string exceeds `maxDepth`, in a single linear
* pass. Brackets inside string values are ignored.
*
* @internal
*/
function exceedsMaxDepth(raw, maxDepth = 64) {
	let depth = 0;
	let inString = false;
	let escaped = false;
	for (let i = 0; i < raw.length; i++) {
		const ch = raw[i];
		if (inString) {
			if (escaped) escaped = false;
			else if (ch === "\\") escaped = true;
			else if (ch === "\"") inString = false;
			continue;
		}
		if (ch === "\"") inString = true;
		else if (ch === "{" || ch === "[") {
			if (++depth > maxDepth) return true;
		} else if (ch === "}" || ch === "]") {
			if (depth > 0) depth--;
		}
	}
	return false;
}
/** @internal */
function exceedsMaxBytes(raw, maxBytes = MAX_ISLAND_BODY_BYTES) {
	return Buffer.byteLength(raw, "utf8") > maxBytes;
}

const NUXT_RUNTIME_PAYLOAD_EXTRACTION = false;
const NUXT_SSR_STREAMING = false;

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

const VueResolver = /* @__PURE__ */ Object.assign(
  (_, value) => isRef(value) ? toValue(value) : value,
  // identity for plain non-reactive values, so the SSR default init entry
  // keeps its precomputed fast path (see unhead/server createHead)
  { _static: true }
);

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const legacyPlugins = [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin];

const unheadOptions = {
  disableDefaults: true,
  plugins: legacyPlugins,
};

function encodeEventPath(path) {
	const queryIndex = path.indexOf("?");
	if (queryIndex === -1) return encodePath(path);
	return encodePath(path.slice(0, queryIndex)) + path.slice(queryIndex);
}
function createSSRContext(event) {
	const url = encodeEventPath(event.path);
	const ssrContext = {
		url,
		event,
		runtimeConfig: useRuntimeConfig(event),
		noSSR: event.context.nuxt?.noSSR || (false),
		head: createHead(unheadOptions),
		error: false,
		nuxt: void 0,
		payload: {},
		["~payloadReducers"]: Object.create(null),
		modules: /* @__PURE__ */ new Set()
	};
	return ssrContext;
}
function setSSRError(ssrContext, error) {
	ssrContext.error = true;
	ssrContext.payload = { error };
	ssrContext.url = error.url;
}

//#region src/runtime/utils/renderer/cache.ts
function lazyCachedFunction(fn) {
	let res = null;
	return () => {
		if (res === null) res = fn().catch((err) => {
			res = null;
			throw err;
		});
		return res;
	};
}

//#region src/runtime/utils/renderer/build-files.ts
globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getServerEntry = () => Promise.resolve().then(function () { return entry; }).then((r) => r.default || r);
const getClientManifest = () => Promise.resolve().then(function () { return manifest$1; }).then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRRenderer = lazyCachedFunction(async () => {
	const createSSRApp = await getServerEntry();
	if (!createSSRApp) throw serverDiagnostics.NUXT_E8004();
	const precomputed = void 0 ;
	const renderer = createRenderer(createSSRApp, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: renderToString$1,
		buildAssetsURL
	});
	async function renderToString$1(input, context) {
		const html = await renderToString(input, context);
		if (process.env.NUXT_VITE_NODE_OPTIONS) renderer.rendererContext.updateManifest(await getClientManifest());
		return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
	}
	return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
	const precomputed = void 0 ;
	const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
		{
			const APP_SPA_LOADER_OPEN_TAG = `<${appSpaLoaderTag}${propsToString(appSpaLoaderAttrs)}>`;
			const APP_SPA_LOADER_CLOSE_TAG = `</${appSpaLoaderTag}>`;
			return APP_ROOT_OPEN_TAG + APP_ROOT_CLOSE_TAG + (r ? APP_SPA_LOADER_OPEN_TAG + r + APP_SPA_LOADER_CLOSE_TAG : "");
		}
	});
	const renderer = createRenderer(() => () => {}, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: () => spaTemplate,
		buildAssetsURL
	});
	const result = await renderer.renderToString({});
	const renderToString = (ssrContext) => {
		const config = useRuntimeConfig(ssrContext.event);
		ssrContext.modules ||= /* @__PURE__ */ new Set();
		ssrContext.payload.serverRendered = false;
		ssrContext.config = {
			public: config.public,
			app: config.app
		};
		return Promise.resolve(result);
	};
	return {
		rendererContext: renderer.rendererContext,
		renderToString
	};
});
function getRenderer(ssrContext) {
	return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

//#region src/runtime/utils/renderer/inline-styles.ts
async function renderInlineStyles(usedModules) {
	const styleMap = await getSSRStyles();
	const inlinedStyles = /* @__PURE__ */ new Set();
	const promises = [];
	for (const mod of usedModules) if (mod in styleMap && styleMap[mod]) promises.push(styleMap[mod]());
	for (const styles of await Promise.all(promises)) for (const style of styles) inlinedStyles.add(style);
	return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

//#region src/runtime/utils/renderer/islands.ts
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
/**
* remove the root node from the html body
*/
function getServerComponentHTML(body) {
	return body.match(ROOT_NODE_REGEX)?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) return;
	const response = {};
	for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) response[name] = {
		...slot,
		fallback: ssrContext.teleports?.[`island-fallback=${name}`]
	};
	return response;
}
function getClientIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) return;
	const response = {};
	for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
		let html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
		if (!html && ssrContext.teleports) for (const [key, value] of Object.entries(ssrContext.teleports)) {
			const [, , componentUid] = key.match(SSR_CLIENT_TELEPORT_MARKER) ?? [];
			if (componentUid === clientUid) {
				html = value.replaceAll("<!--teleport start anchor-->", "");
				break;
			}
		}
		response[clientUid] = {
			...component,
			html,
			slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
		};
	}
	return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
	const entries = Object.entries(teleports);
	const slots = {};
	for (const [key, value] of entries) {
		const match = key.match(SSR_CLIENT_SLOT_MARKER);
		if (match) {
			const [, id, slot] = match;
			if (!slot || clientUid !== id) continue;
			slots[slot] = value;
		}
	}
	return slots;
}
const ISLAND_TELEPORT_ANCHOR_RE = / data-island-uid="([^"]*)" data-island-(component|slot)="([^"]*)"[^>]*>/g;
function replaceIslandTeleports(ssrContext, html) {
	const { teleports, islandContext } = ssrContext;
	if (islandContext || !teleports) return html;
	const contentsByAnchor = /* @__PURE__ */ new Map();
	const uids = /* @__PURE__ */ new Set();
	for (const key in teleports) {
		const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
		if (matchClientComp) {
			const [, uid, clientId] = matchClientComp;
			if (!uid || !clientId) continue;
			contentsByAnchor.set(`${uid};component;${clientId}`, teleports[key]);
			uids.add(uid);
			continue;
		}
		const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
		if (matchSlot) {
			const [, uid, slot] = matchSlot;
			if (!uid || !slot) continue;
			contentsByAnchor.set(`${uid};slot;${slot}`, teleports[key]);
			uids.add(uid);
		}
	}
	if (!contentsByAnchor.size) return html;
	const stitch = (html) => {
		const anchorRE = new RegExp(ISLAND_TELEPORT_ANCHOR_RE);
		let out = "";
		let cursor = 0;
		let m;
		while (contentsByAnchor.size && (m = anchorRE.exec(html))) {
			if (!uids.has(m[1])) continue;
			const anchor = `${m[1]};${m[2]};${m[3]}`;
			const content = contentsByAnchor.get(anchor);
			if (content === void 0) continue;
			contentsByAnchor.delete(anchor);
			const end = m.index + m[0].length;
			out += html.slice(cursor, end) + stitch(content);
			cursor = end;
		}
		return cursor ? out + html.slice(cursor) : html;
	};
	return stitch(html);
}

//#region src/runtime/handlers/island.ts
const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const handler$1 = defineEventHandler(async (event) => {
	setResponseHeaders(event, {
		"content-type": "application/json;charset=utf-8",
		"x-powered-by": "Nuxt"
	});
	return toResponse(event, await renderIsland(event));
});
function toResponse(event, result) {
	return "raw" in result ? returnIslandResponse(event, result.raw) : result;
}
async function renderIsland(event) {
	const nitroApp = useNitroApp();
	const islandContext = await getIslandContext(event);
	const ssrContext = {
		...createSSRContext(event),
		islandContext,
		noSSR: false,
		url: islandContext.url
	};
	const renderer = await getSSRRenderer();
	const renderResult = await (renderer.renderToString(ssrContext)).catch(async (err) => {
		if (ssrContext["~renderResponse"] && err?.message === "skipping render") return {};
		await ssrContext.nuxt?.hooks.callHook("app:error", err);
		throw err;
	});
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult
	});
	if (ssrContext["~renderResponse"]) {
		const response = ssrContext["~renderResponse"];
		if (response.statusCode && response.statusCode >= 400) throw createError({
			statusCode: response.statusCode,
			statusMessage: response.statusMessage
		});
		return { raw: response };
	}
	if (ssrContext.payload?.error) throw ssrContext.payload.error;
	const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
	if (inlinedStyles.length) ssrContext.head.push({ style: inlinedStyles });
	{
		const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
		const link = [];
		for (const resource of Object.values(styles)) {
			if ("inline" in getQuery(resource.file)) continue;
			if (resource.file.includes("scoped") && !resource.file.includes("pages/")) link.push({
				rel: "stylesheet",
				href: renderer.rendererContext.buildAssetsURL(resource.file),
				crossorigin: ""
			});
		}
		if (link.length) ssrContext.head.push({ link });
	}
	const islandHead = {};
	for (const entry of ssrContext.head.entries.values()) for (const [key, value] of Object.entries(walkResolver(entry.input, VueResolver))) {
		const currentValue = islandHead[key];
		if (Array.isArray(currentValue)) currentValue.push(...value);
		else islandHead[key] = value;
	}
	const islandResponse = {
		id: islandContext.id,
		head: islandHead,
		html: getServerComponentHTML(renderResult.html),
		components: getClientIslandResponse(ssrContext),
		slots: getSlotIslandResponse(ssrContext)
	};
	await nitroApp.hooks.callHook("render:island", islandResponse, {
		event,
		islandContext
	});
	return islandResponse;
}
function returnIslandResponse(event, response) {
	for (const header in response.headers || {}) setResponseHeader(event, header, response.headers[header]);
	if (response.statusCode) setResponseStatus(event, response.statusCode, response.statusMessage);
	return response.body;
}
const ISLAND_PATH_PREFIX = "/__nuxt_island/";
const VALID_COMPONENT_NAME_RE = /^[a-z][\w.-]*$/i;
async function readGuardedIslandBody(event) {
	if (Number(getRequestHeader(event, "content-length")) > 65536) throw createError({
		statusCode: 413,
		statusMessage: "Island request body too large"
	});
	let received = 0;
	let raw = "";
	let overflowed = false;
	const stream = getRequestWebStream(event);
	if (stream) {
		const decoder = new TextDecoder();
		const reader = stream.getReader();
		try {
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				received += value.byteLength;
				if (received > 65536) {
					overflowed = true;
					continue;
				}
				raw += decoder.decode(value, { stream: true });
			}
		} finally {
			reader.releaseLock();
		}
		raw += decoder.decode();
	}
	if (overflowed) throw createError({
		statusCode: 413,
		statusMessage: "Island request body too large"
	});
	if (!raw) return {};
	if (exceedsMaxDepth(raw)) throw createError({
		statusCode: 400,
		statusMessage: "Island request body too deeply nested"
	});
	return destr$1(raw) || {};
}
async function getIslandContext(event) {
	let url = event.path || "";
	url.replace(/\?.*$/, "");
	if (!url.startsWith(ISLAND_PATH_PREFIX)) throw createError({
		statusCode: 400,
		statusMessage: "Invalid island request path"
	});
	const componentParts = url.substring(15).replace(ISLAND_SUFFIX_RE, "").split("_");
	const hashId = componentParts.length > 1 ? componentParts.pop() : void 0;
	const componentName = componentParts.join("_");
	if (!componentName || !VALID_COMPONENT_NAME_RE.test(componentName)) throw createError({
		statusCode: 400,
		statusMessage: "Invalid island component name"
	});
	const rawContext = event.method === "GET" ? getQuery$1(event) : await readGuardedIslandBody(event);
	const serializedProps = typeof rawContext?.props === "string" ? rawContext.props : "{}";
	if (exceedsMaxBytes(serializedProps)) throw createError({
		statusCode: 413,
		statusMessage: "Island request props too large"
	});
	if (exceedsMaxDepth(serializedProps)) throw createError({
		statusCode: 400,
		statusMessage: "Island request props too deeply nested"
	});
	const clientContext = {};
	if (rawContext && typeof rawContext === "object") {
		for (const key in rawContext) if (key !== "props") clientContext[key] = rawContext[key];
	}
	const parsed = destr$1(serializedProps);
	if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) throw createError({
		statusCode: 400,
		statusMessage: "Invalid island request props"
	});
	const parsedProps = filterIslandProps(parsed);
	const expectedHash = getIslandHash({
		name: componentName,
		props: parsedProps,
		context: clientContext
	});
	if (!hashId || hashId !== expectedHash) throw createError({
		statusCode: 400,
		statusMessage: "Invalid island request hash"
	});
	return {
		url: typeof rawContext?.url === "string" ? rawContext.url : "/",
		id: hashId,
		name: componentName,
		props: parsedProps,
		slots: {},
		components: {}
	};
}

const _lazy_MQ4E1m = () => Promise.resolve().then(function () { return index_get$h; });
const _lazy_qoX4Mm = () => Promise.resolve().then(function () { return accept_post$1; });
const _lazy_HhImqh = () => Promise.resolve().then(function () { return index_get$f; });
const _lazy_YQfeDn = () => Promise.resolve().then(function () { return complete_post$1; });
const _lazy_AEJ3oc = () => Promise.resolve().then(function () { return index_get$d; });
const _lazy_ngD5FH = () => Promise.resolve().then(function () { return request_post$1; });
const _lazy_6w1vjM = () => Promise.resolve().then(function () { return verify_post$1; });
const _lazy_tIqe6N = () => Promise.resolve().then(function () { return session_delete$1; });
const _lazy_qrCBlw = () => Promise.resolve().then(function () { return slug_get$1; });
const _lazy_FYsoPj = () => Promise.resolve().then(function () { return summary_get$1; });
const _lazy_BB5FXO = () => Promise.resolve().then(function () { return health_get$1; });
const _lazy_aNnllr = () => Promise.resolve().then(function () { return _id__delete$5; });
const _lazy_19zRUG = () => Promise.resolve().then(function () { return index_get$b; });
const _lazy_XV3cyl = () => Promise.resolve().then(function () { return leaderboard_get$1; });
const _lazy_hlOgZb = () => Promise.resolve().then(function () { return me_get$1; });
const _lazy__xbmmt = () => Promise.resolve().then(function () { return _id__delete$3; });
const _lazy_txuJqc = () => Promise.resolve().then(function () { return _id__get$5; });
const _lazy_U6dfU2 = () => Promise.resolve().then(function () { return _id__patch$5; });
const _lazy_w8dPVg = () => Promise.resolve().then(function () { return index_get$9; });
const _lazy_wvJxhu = () => Promise.resolve().then(function () { return invite_post$1; });
const _lazy_c328Pv = () => Promise.resolve().then(function () { return index_get$7; });
const _lazy_76v3_i = () => Promise.resolve().then(function () { return index_get$5; });
const _lazy_fEpXnL = () => Promise.resolve().then(function () { return _id__get$3; });
const _lazy_f5nRKU = () => Promise.resolve().then(function () { return _id__patch$3; });
const _lazy_wvAVx7 = () => Promise.resolve().then(function () { return attachments_post$1; });
const _lazy_19LC5L = () => Promise.resolve().then(function () { return comments_post$1; });
const _lazy_XoCxIM = () => Promise.resolve().then(function () { return progress_patch$1; });
const _lazy_1LTjSv = () => Promise.resolve().then(function () { return transition_post$1; });
const _lazy_zmi97k = () => Promise.resolve().then(function () { return dashboard_get$1; });
const _lazy_W59UMb = () => Promise.resolve().then(function () { return index_get$3; });
const _lazy_3ZXEAm = () => Promise.resolve().then(function () { return index_post$3; });
const _lazy_o3K999 = () => Promise.resolve().then(function () { return _id__delete$1; });
const _lazy_NRp8lk = () => Promise.resolve().then(function () { return _id__get$1; });
const _lazy_tn7atE = () => Promise.resolve().then(function () { return _id__patch$1; });
const _lazy_wWqoYR = () => Promise.resolve().then(function () { return members_post$1; });
const _lazy_WPAD5U = () => Promise.resolve().then(function () { return _userId__delete$1; });
const _lazy_z8VI8G = () => Promise.resolve().then(function () { return _userId__patch$1; });
const _lazy_p9AayA = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_dHXH8b = () => Promise.resolve().then(function () { return index_post$1; });
const _lazy_IjuBCq = () => Promise.resolve().then(function () { return renderer; });

const handlers = [
  { route: '', handler: _XUlAU5, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _aLrtwO, lazy: false, middleware: true, method: undefined },
  { route: '/api/achievements', handler: _lazy_MQ4E1m, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/invitations/accept', handler: _lazy_qoX4Mm, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/invitations', handler: _lazy_HhImqh, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/onboarding/complete', handler: _lazy_YQfeDn, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/onboarding', handler: _lazy_AEJ3oc, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/otp/request', handler: _lazy_ngD5FH, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/otp/verify', handler: _lazy_6w1vjM, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/session', handler: _lazy_tIqe6N, lazy: true, middleware: false, method: "delete" },
  { route: '/api/companies/slug', handler: _lazy_qrCBlw, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/summary', handler: _lazy_FYsoPj, lazy: true, middleware: false, method: "get" },
  { route: '/api/health', handler: _lazy_BB5FXO, lazy: true, middleware: false, method: "get" },
  { route: '/api/invitations/:id', handler: _lazy_aNnllr, lazy: true, middleware: false, method: "delete" },
  { route: '/api/invitations', handler: _lazy_19zRUG, lazy: true, middleware: false, method: "get" },
  { route: '/api/leaderboard', handler: _lazy_XV3cyl, lazy: true, middleware: false, method: "get" },
  { route: '/api/me', handler: _lazy_hlOgZb, lazy: true, middleware: false, method: "get" },
  { route: '/api/members/:id', handler: _lazy__xbmmt, lazy: true, middleware: false, method: "delete" },
  { route: '/api/members/:id', handler: _lazy_txuJqc, lazy: true, middleware: false, method: "get" },
  { route: '/api/members/:id', handler: _lazy_U6dfU2, lazy: true, middleware: false, method: "patch" },
  { route: '/api/members', handler: _lazy_w8dPVg, lazy: true, middleware: false, method: "get" },
  { route: '/api/members/invite', handler: _lazy_wvJxhu, lazy: true, middleware: false, method: "post" },
  { route: '/api/notifications', handler: _lazy_c328Pv, lazy: true, middleware: false, method: "get" },
  { route: '/api/rewards', handler: _lazy_76v3_i, lazy: true, middleware: false, method: "get" },
  { route: '/api/tasks/:id', handler: _lazy_fEpXnL, lazy: true, middleware: false, method: "get" },
  { route: '/api/tasks/:id', handler: _lazy_f5nRKU, lazy: true, middleware: false, method: "patch" },
  { route: '/api/tasks/:id/attachments', handler: _lazy_wvAVx7, lazy: true, middleware: false, method: "post" },
  { route: '/api/tasks/:id/comments', handler: _lazy_19LC5L, lazy: true, middleware: false, method: "post" },
  { route: '/api/tasks/:id/progress', handler: _lazy_XoCxIM, lazy: true, middleware: false, method: "patch" },
  { route: '/api/tasks/:id/transition', handler: _lazy_1LTjSv, lazy: true, middleware: false, method: "post" },
  { route: '/api/tasks/dashboard', handler: _lazy_zmi97k, lazy: true, middleware: false, method: "get" },
  { route: '/api/tasks', handler: _lazy_W59UMb, lazy: true, middleware: false, method: "get" },
  { route: '/api/tasks', handler: _lazy_3ZXEAm, lazy: true, middleware: false, method: "post" },
  { route: '/api/teams/:id', handler: _lazy_o3K999, lazy: true, middleware: false, method: "delete" },
  { route: '/api/teams/:id', handler: _lazy_NRp8lk, lazy: true, middleware: false, method: "get" },
  { route: '/api/teams/:id', handler: _lazy_tn7atE, lazy: true, middleware: false, method: "patch" },
  { route: '/api/teams/:id/members', handler: _lazy_wWqoYR, lazy: true, middleware: false, method: "post" },
  { route: '/api/teams/:id/members/:userId', handler: _lazy_WPAD5U, lazy: true, middleware: false, method: "delete" },
  { route: '/api/teams/:id/members/:userId', handler: _lazy_z8VI8G, lazy: true, middleware: false, method: "patch" },
  { route: '/api/teams', handler: _lazy_p9AayA, lazy: true, middleware: false, method: "get" },
  { route: '/api/teams', handler: _lazy_dHXH8b, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_IjuBCq, lazy: true, middleware: false, method: undefined },
  { route: '/api/_nuxt_icon/:collection', handler: _DuJdd3, lazy: false, middleware: false, method: undefined },
  { route: '/_i18n/:hash/:locale/messages.json', handler: _OIYs8c, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: handler$1, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_IjuBCq, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  {
    const _handler = h3App.handler;
    h3App.handler = (event) => {
      const ctx = { event };
      return nitroAsyncContext.callAsync(ctx, () => _handler(event));
    };
  }
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

if (!globalThis.crypto) {
  globalThis.crypto = node_crypto__default.webcrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const entry = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: viteNodeEntry_mjs
}, Symbol.toStringTag, { value: 'Module' }));

const manifest = () => viteNodeFetch.getManifest();

const manifest$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: manifest
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$g = defineEventHandler(async (event) => {
  const auth = requireAuth(event);
  const db = createTenantClient(auth);
  const [achievements, unlocked, badges] = await Promise.all([
    db.achievement.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        key: true,
        title: true,
        description: true,
        type: true,
        xpReward: true,
        coinReward: true,
        iconKey: true
      }
    }),
    db.userAchievement.findMany({
      where: { userId: auth.userId },
      select: { achievementId: true, unlockedAt: true }
    }),
    db.userBadge.findMany({
      where: { userId: auth.userId },
      select: { awardedAt: true, badge: { select: { id: true, name: true, description: true, imageUrl: true } } }
    })
  ]);
  const unlockedById = new Map(unlocked.map((row) => [row.achievementId, row.unlockedAt]));
  return {
    achievements: achievements.map((achievement) => {
      var _a, _b;
      return {
        ...achievement,
        unlocked: unlockedById.has(achievement.id),
        unlockedAt: (_b = (_a = unlockedById.get(achievement.id)) == null ? void 0 : _a.toISOString()) != null ? _b : null
      };
    }),
    badges: badges.map((row) => ({ ...row.badge, awardedAt: row.awardedAt.toISOString() })),
    totals: {
      unlocked: unlocked.length,
      available: achievements.length,
      badges: badges.length
    }
  };
});

const index_get$h = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$g
}, Symbol.toStringTag, { value: 'Module' }));

const phoneSchema = z.string().trim().min(10).max(20).refine((value) => /^\+?[0-9]{10,15}$/.test(value.replace(/[\s\-()]/g, "")), {
  message: "\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A"
});
const otpPurposeSchema = z.enum(["LOGIN", "REGISTER"]);
const requestOtpSchema = z.object({
  phone: phoneSchema,
  purpose: otpPurposeSchema.default("LOGIN")
});
const verifyOtpSchema = z.object({
  phone: phoneSchema,
  /** 4-8 digit numeric code; length is enforced again by config on the server. */
  code: z.string().trim().regex(/^\d{4,8}$/, "\u06A9\u062F \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A")
});
const onboardingProfileSchema = z.object({
  fullName: z.string().trim().min(3, "\u0646\u0627\u0645 \u0648 \u0646\u0627\u0645 \u062E\u0627\u0646\u0648\u0627\u062F\u06AF\u06CC \u0631\u0627 \u06A9\u0627\u0645\u0644 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F").max(80),
  jobTitle: z.string().trim().max(80).optional().or(z.literal(""))
});
const onboardingCompanySchema = z.object({
  companyName: z.string().trim().min(2, "\u0646\u0627\u0645 \u0634\u0631\u06A9\u062A \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F").max(120),
  slug: z.string().trim().max(60).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "\u0622\u062F\u0631\u0633 \u0634\u0631\u06A9\u062A \u0641\u0642\u0637 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0634\u0627\u0645\u0644 \u062D\u0631\u0648\u0641 \u06A9\u0648\u0686\u06A9 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC\u060C \u0639\u062F\u062F \u0648 \u062E\u0637 \u062A\u06CC\u0631\u0647 \u0628\u0627\u0634\u062F").optional().or(z.literal("")),
  industry: z.string().trim().max(80).optional().or(z.literal("")),
  logoUrl: z.string().trim().url("\u0622\u062F\u0631\u0633 \u0644\u0648\u06AF\u0648 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A").max(500).optional().or(z.literal("")),
  timezone: z.enum(SUPPORTED_TIMEZONES).default("Asia/Tehran"),
  locale: z.enum(SUPPORTED_LOCALES).default("fa")
});
const completeOnboardingSchema = onboardingProfileSchema.merge(onboardingCompanySchema);
const slugQuerySchema = z.object({
  slug: z.string().trim().min(1).max(60)
});
const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
});
const taskFilterSchema = paginationSchema.extend({
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  teamId: z.string().uuid("\u062A\u06CC\u0645 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A").optional(),
  assigneeId: z.string().uuid("\u06A9\u0627\u0631\u0628\u0631 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A").optional(),
  search: z.string().trim().max(120).optional(),
  /** Narrow to work that is late — the manager dashboard's headline filter. */
  overdue: z.union([z.boolean(), z.enum(["true", "false"])]).transform((value) => value === true || value === "true").optional(),
  scope: z.enum(["mine", "team", "all"]).default("mine"),
  sort: z.enum(["dueDate", "priority", "createdAt", "status"]).default("dueDate")
});
const leaderboardRangeSchema = z.object({
  range: z.enum(["week", "month", "all"]).default("month"),
  limit: z.coerce.number().int().min(1).max(50).default(10)
});
const jobTitleSchema = z.string().trim().max(80).optional().or(z.literal(""));
const inviteMemberSchema = z.object({
  phone: phoneSchema,
  fullName: z.string().trim().min(3, "\u0646\u0627\u0645 \u0648 \u0646\u0627\u0645 \u062E\u0627\u0646\u0648\u0627\u062F\u06AF\u06CC \u0631\u0627 \u06A9\u0627\u0645\u0644 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F").max(80),
  jobTitle: jobTitleSchema,
  teamId: z.string().uuid("\u062A\u06CC\u0645 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A").optional().or(z.literal("")),
  role: z.enum(["ADMIN", "MANAGER", "EMPLOYEE"]).default("EMPLOYEE"),
  /** Days the invitation stays open; capped again on the server. */
  expiresInDays: z.coerce.number().int().min(1).max(30).default(7)
});
const updateMemberSchema = z.object({
  fullName: z.string().trim().min(3).max(80).optional(),
  jobTitle: jobTitleSchema,
  role: z.enum(["OWNER", "ADMIN", "MANAGER", "EMPLOYEE"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "DEACTIVATED"]).optional(),
  teamId: z.string().uuid("\u062A\u06CC\u0645 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A").optional().or(z.literal("")),
  /** Direct manager inside the team — the manager-scope edge. */
  managerId: z.string().uuid("\u0645\u062F\u06CC\u0631 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A").optional().or(z.literal(""))
});
const memberListSchema = paginationSchema.extend({
  search: z.string().trim().max(80).optional(),
  teamId: z.string().uuid().optional(),
  role: z.enum(["OWNER", "ADMIN", "MANAGER", "EMPLOYEE"]).optional(),
  /** `mine` = the caller plus their subordinates, `all` = the whole company. */
  scope: z.enum(["mine", "team", "all"]).default("mine")
});
const createTeamSchema = z.object({
  name: z.string().trim().min(2, "\u0646\u0627\u0645 \u062A\u06CC\u0645 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F").max(80),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  slug: z.string().trim().max(60).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "\u0622\u062F\u0631\u0633 \u062A\u06CC\u0645 \u0641\u0642\u0637 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0634\u0627\u0645\u0644 \u062D\u0631\u0648\u0641 \u06A9\u0648\u0686\u06A9 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC\u060C \u0639\u062F\u062F \u0648 \u062E\u0637 \u062A\u06CC\u0631\u0647 \u0628\u0627\u0634\u062F").optional().or(z.literal("")),
  leadId: z.string().uuid("\u0633\u0631\u067E\u0631\u0633\u062A \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A").optional().or(z.literal(""))
});
const updateTeamSchema = createTeamSchema.partial();
const addTeamMemberSchema = z.object({
  userId: z.string().uuid("\u06A9\u0627\u0631\u0628\u0631 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A"),
  role: z.enum(["LEAD", "MEMBER"]).default("MEMBER"),
  managerId: z.string().uuid().optional().or(z.literal(""))
});
const updateTeamMemberSchema = z.object({
  role: z.enum(["LEAD", "MEMBER"]).optional(),
  managerId: z.string().uuid().optional().or(z.literal(""))
});
const invitationListSchema = paginationSchema.extend({
  status: z.enum(["PENDING", "ACCEPTED", "REVOKED", "EXPIRED"]).default("PENDING")
});
const acceptInvitationSchema = z.object({
  invitationId: z.string().uuid("\u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A")
});
const taskAttachmentSchema = z.object({
  fileName: z.string().trim().min(1, "\u0646\u0627\u0645 \u0641\u0627\u06CC\u0644 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F").max(200),
  url: z.string().trim().max(1e3).refine((value) => /^https?:\/\//i.test(value), "\u0622\u062F\u0631\u0633 \u0641\u0627\u06CC\u0644 \u0628\u0627\u06CC\u062F \u0628\u0627 http \u06CC\u0627 https \u0634\u0631\u0648\u0639 \u0634\u0648\u062F"),
  mimeType: z.string().trim().max(120).optional().or(z.literal("")),
  sizeBytes: z.coerce.number().int().min(0).max(100 * 1024 * 1024).optional()
});
const createTaskSchema = z.object({
  title: z.string().trim().min(3, "\u0639\u0646\u0648\u0627\u0646 \u062A\u0633\u06A9 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F").max(160),
  description: z.string().trim().max(5e3).optional().or(z.literal("")),
  assigneeId: z.string().uuid("\u0627\u0646\u062C\u0627\u0645\u200C\u062F\u0647\u0646\u062F\u0647 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A"),
  teamId: z.string().uuid("\u062A\u06CC\u0645 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A").optional().or(z.literal("")),
  priority: z.enum(TASK_PRIORITIES).default("MEDIUM"),
  dueDate: z.union([z.string().trim(), z.date()]).optional().transform((value) => value === void 0 || value === "" ? void 0 : new Date(value)).refine((value) => value === void 0 || !Number.isNaN(value.getTime()), "\u062A\u0627\u0631\u06CC\u062E \u0633\u0631\u0631\u0633\u06CC\u062F \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A"),
  /** Planned effort in hours. Quarter-hour granularity is plenty. */
  estimatedHours: z.coerce.number().min(0.25, "\u0628\u0631\u0622\u0648\u0631\u062F \u0632\u0645\u0627\u0646 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06F1\u06F5 \u062F\u0642\u06CC\u0642\u0647 \u0628\u0627\u0634\u062F").max(1e3, "\u0628\u0631\u0622\u0648\u0631\u062F \u0632\u0645\u0627\u0646 \u0628\u06CC\u0634 \u0627\u0632 \u062D\u062F \u0628\u0632\u0631\u06AF \u0627\u0633\u062A").optional(),
  xpReward: z.coerce.number().int().min(0).max(1e4).default(100),
  coinReward: z.coerce.number().int().min(0).max(1e4).default(50),
  attachments: z.array(taskAttachmentSchema).max(10, "\u062D\u062F\u0627\u06A9\u062B\u0631 \u06F1\u06F0 \u067E\u06CC\u0648\u0633\u062A \u0645\u062C\u0627\u0632 \u0627\u0633\u062A").default([])
});
const updateTaskSchema = createTaskSchema.omit({ attachments: true }).partial().refine((value) => Object.keys(value).length > 0, "\u062A\u063A\u06CC\u06CC\u0631\u06CC \u0628\u0631\u0627\u06CC \u0630\u062E\u06CC\u0631\u0647 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F");
const taskTransitionSchema = z.object({
  action: z.enum(TASK_ACTIONS),
  note: z.string().trim().max(2e3).optional().or(z.literal("")),
  /** 0-100 quality score, reviewers only. */
  score: z.coerce.number().int().min(0).max(100).optional(),
  /** Self-reported completion the employee submits alongside the transition. */
  progress: z.coerce.number().int().min(0).max(100).optional()
});
const taskProgressSchema = z.object({
  progress: z.coerce.number().int().min(0, "\u062F\u0631\u0635\u062F \u067E\u06CC\u0634\u0631\u0641\u062A \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A").max(100, "\u062F\u0631\u0635\u062F \u067E\u06CC\u0634\u0631\u0641\u062A \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A")
});
const createTaskCommentSchema = z.object({
  body: z.string().trim().min(1, "\u0645\u062A\u0646 \u06CC\u0627\u062F\u062F\u0627\u0634\u062A \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F").max(2e3)
});
const createTaskAttachmentSchema = taskAttachmentSchema;

const accept_post = defineEventHandler(async (event) => {
  if (getAuth(event)) {
    throw errors.conflict("\u0634\u0645\u0627 \u067E\u06CC\u0634\u200C\u062A\u0631 \u0648\u0627\u0631\u062F \u0634\u062F\u0647\u200C\u0627\u06CC\u062F");
  }
  const ticket = await requireInvitationTicket(event);
  const input = await readValidated(event, acceptInvitationSchema);
  const db = usePrisma();
  const invitation = await db.invitation.findUnique({
    where: { id: input.invitationId },
    include: {
      company: true,
      team: { select: { id: true, name: true } }
    }
  });
  if (!invitation || invitation.phone !== ticket.phone) {
    throw errors.notFound("\u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  }
  if (invitation.status !== "PENDING") {
    throw errors.conflict("\u0627\u06CC\u0646 \u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u0642\u0628\u0644\u0627\u064B \u0628\u0633\u062A\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A");
  }
  if (invitation.expiresAt.getTime() < Date.now()) {
    throw errors.conflict("\u0645\u0647\u0644\u062A \u0627\u06CC\u0646 \u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u0628\u0647 \u067E\u0627\u06CC\u0627\u0646 \u0631\u0633\u06CC\u062F\u0647 \u0627\u0633\u062A");
  }
  if (!invitation.company.isActive) {
    throw errors.conflict("\u0634\u0631\u06A9\u062A \u062F\u0639\u0648\u062A\u200C\u06A9\u0646\u0646\u062F\u0647 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062A");
  }
  const existing = await db.user.findFirst({
    where: { companyId: invitation.companyId, phone: ticket.phone },
    select: { id: true, fullName: true, role: true }
  });
  if (existing) {
    throw errors.conflict("\u0627\u06CC\u0646 \u0634\u0645\u0627\u0631\u0647 \u067E\u06CC\u0634\u200C\u062A\u0631 \u0639\u0636\u0648 \u0627\u06CC\u0646 \u0634\u0631\u06A9\u062A \u0634\u062F\u0647 \u0627\u0633\u062A\u061B \u0644\u0637\u0641\u0627\u064B \u0648\u0627\u0631\u062F \u0634\u0648\u06CC\u062F");
  }
  const ip = getRequestIP(event, { xForwardedFor: true });
  const { user, company, team } = await db.$transaction(async (tx) => {
    var _a;
    await consumeInvitationTicket(tx, ticket.id);
    const claimed = await tx.invitation.updateMany({
      where: { id: invitation.id, status: "PENDING", phone: ticket.phone },
      data: { status: "ACCEPTED", acceptedAt: /* @__PURE__ */ new Date(), pendingPhone: null }
    });
    if (claimed.count === 0) {
      throw errors.conflict("\u0627\u06CC\u0646 \u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u0642\u0628\u0644\u0627\u064B \u0628\u0633\u062A\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A");
    }
    const newUser = await tx.user.create({
      data: {
        companyId: invitation.companyId,
        phone: ticket.phone,
        fullName: invitation.fullName,
        jobTitle: invitation.jobTitle,
        role: invitation.role,
        status: "ACTIVE",
        locale: invitation.company.locale,
        timezone: invitation.company.timezone
      }
    });
    const firstLevel = await tx.level.findFirst({
      where: { companyId: invitation.companyId },
      orderBy: { level: "asc" },
      select: { id: true }
    });
    await tx.userProgress.create({
      data: {
        companyId: invitation.companyId,
        userId: newUser.id,
        xp: 0,
        coins: 0,
        levelId: (_a = firstLevel == null ? void 0 : firstLevel.id) != null ? _a : null
      }
    });
    if (invitation.teamId) {
      await tx.teamMember.create({
        data: {
          companyId: invitation.companyId,
          teamId: invitation.teamId,
          userId: newUser.id
        }
      });
    }
    await tx.notification.create({
      data: {
        companyId: invitation.companyId,
        userId: invitation.invitedById,
        type: "INVITATION",
        title: `${invitation.fullName} \u0628\u0647 \u0634\u0631\u06A9\u062A \u067E\u06CC\u0648\u0633\u062A`,
        body: invitation.jobTitle ? `\u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u067E\u0630\u06CC\u0631\u0641\u062A\u0647 \u0634\u062F \u0648 ${invitation.fullName} \u0628\u0627 \u0639\u0646\u0648\u0627\u0646 \xAB${invitation.jobTitle}\xBB \u0639\u0636\u0648 \u0634\u062F.` : `\u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u067E\u0630\u06CC\u0631\u0641\u062A\u0647 \u0634\u062F \u0648 ${invitation.fullName} \u0639\u0636\u0648 \u0634\u0631\u06A9\u062A \u0634\u062F.`,
        data: { invitationId: invitation.id, userId: newUser.id }
      }
    });
    await tx.invitation.update({
      where: { id: invitation.id },
      data: { acceptedById: newUser.id }
    });
    await tx.auditLog.create({
      data: {
        companyId: invitation.companyId,
        actorId: newUser.id,
        action: "member.joined",
        targetType: "User",
        targetId: newUser.id,
        ip,
        data: { invitationId: invitation.id, role: invitation.role }
      }
    });
    return { user: newUser, company: invitation.company, team: invitation.team };
  });
  const session = await issueSession(event, user);
  startSession(event, session);
  clearInvitationCookie(event);
  return {
    status: "authenticated",
    user: toUserSummary(user),
    company: toCompanySummary(company),
    invitation: {
      id: invitation.id,
      fullName: invitation.fullName,
      jobTitle: invitation.jobTitle,
      role: invitation.role,
      team
    }
  };
});

const accept_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: accept_post
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$e = defineEventHandler(async (event) => {
  const ticket = await requireInvitationTicket(event);
  const db = usePrisma();
  const existing = await db.user.findFirst({
    where: { phone: ticket.phone, status: "ACTIVE" },
    select: { id: true }
  });
  if (existing) {
    throw errors.conflict("\u0627\u06CC\u0646 \u0634\u0645\u0627\u0631\u0647 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u0634\u062F\u0647 \u0627\u0633\u062A\u061B \u0644\u0637\u0641\u0627\u064B \u0648\u0627\u0631\u062F \u0634\u0648\u06CC\u062F");
  }
  const invitations = await listPendingInvitationsForPhone(ticket.phone);
  if (invitations.length === 0) {
    throw errors.notFound("\u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u0645\u0639\u062A\u0628\u0631\u06CC \u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u0634\u0645\u0627\u0631\u0647 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F");
  }
  return {
    status: "invitation_pending",
    invitations,
    expiresAt: ticket.expiresAt.toISOString()
  };
});

const index_get$f = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$e
}, Symbol.toStringTag, { value: 'Module' }));

const complete_post = defineEventHandler(async (event) => {
  var _a;
  if (getAuth(event)) {
    throw errors.conflict("\u0634\u0645\u0627 \u067E\u06CC\u0634\u200C\u062A\u0631 \u0648\u0627\u0631\u062F \u0634\u062F\u0647\u200C\u0627\u06CC\u062F");
  }
  const ticket = await requireOnboardingTicket(event);
  const input = await readValidated(event, completeOnboardingSchema);
  const requestedSlug = ((_a = input.slug) == null ? void 0 : _a.trim()) || slugify(input.companyName);
  if (!requestedSlug) {
    throw errors.badRequest("COMPANY_SLUG_REQUIRED", "\u0646\u0627\u0645 \u0634\u0631\u06A9\u062A \u0628\u0627\u06CC\u062F \u0634\u0627\u0645\u0644 \u062D\u0631\u0648\u0641 \u06CC\u0627 \u0627\u0639\u062F\u0627\u062F \u0628\u0627\u0634\u062F");
  }
  const db = usePrisma();
  const { user, company } = await db.$transaction(async (tx) => {
    var _a2, _b, _c;
    await consumeOnboardingTicket(tx, ticket.id);
    const slug = await reserveCompanySlug(tx, requestedSlug);
    const createdCompany = await tx.company.create({
      data: {
        name: input.companyName.trim(),
        slug,
        industry: ((_a2 = input.industry) == null ? void 0 : _a2.trim()) || null,
        logoUrl: ((_b = input.logoUrl) == null ? void 0 : _b.trim()) || null,
        locale: input.locale,
        timezone: input.timezone
      }
    });
    const owner = await tx.user.create({
      data: {
        companyId: createdCompany.id,
        phone: ticket.phone,
        fullName: input.fullName.trim(),
        jobTitle: ((_c = input.jobTitle) == null ? void 0 : _c.trim()) || "\u0645\u062F\u06CC\u0631\u0639\u0627\u0645\u0644",
        role: "OWNER",
        status: "ACTIVE",
        locale: input.locale,
        timezone: input.timezone
      }
    });
    await bootstrapCompanyDefaults(tx, createdCompany.id, owner.id);
    await tx.auditLog.create({
      data: {
        companyId: createdCompany.id,
        actorId: owner.id,
        action: "company.created",
        targetType: "Company",
        targetId: createdCompany.id,
        ip: getRequestIP(event, { xForwardedFor: true })
      }
    });
    return { user: owner, company: createdCompany };
  });
  const session = await issueSession(event, user);
  startSession(event, session);
  clearOnboardingCookie(event);
  return {
    status: "authenticated",
    user: toUserSummary(user),
    company: toCompanySummary(company)
  };
});

const complete_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: complete_post
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$c = defineEventHandler(async (event) => {
  if (getAuth(event)) {
    throw errors.conflict("\u0634\u0645\u0627 \u067E\u06CC\u0634\u200C\u062A\u0631 \u0648\u0627\u0631\u062F \u0634\u062F\u0647\u200C\u0627\u06CC\u062F");
  }
  const ticket = await findOnboardingTicket(event);
  if (!ticket) {
    throw errors.unauthorized("\u0646\u0634\u0633\u062A \u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A\u061B \u0644\u0637\u0641\u0627\u064B \u062F\u0648\u0628\u0627\u0631\u0647 \u06A9\u062F \u0648\u0631\u0648\u062F \u0628\u06AF\u06CC\u0631\u06CC\u062F");
  }
  const expiresIn = Math.max(0, Math.floor((ticket.expiresAt.getTime() - Date.now()) / 1e3));
  return {
    phone: ticket.phone,
    expiresAt: ticket.expiresAt.toISOString(),
    expiresIn
  };
});

const index_get$d = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$c
}, Symbol.toStringTag, { value: 'Module' }));

const request_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const { phone, purpose } = await readValidated(event, requestOtpSchema);
  const normalized = normalizeIranianPhone(phone);
  if (!normalized) throw errors.badRequest("AUTH_INVALID_PHONE", "\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A");
  const db = usePrisma();
  const { codeLength, ttlSeconds, maxAttempts, resendCooldownSeconds } = otpSettings();
  const ip = (_a = getRequestIP(event, { xForwardedFor: true })) != null ? _a : null;
  await enforceIpRateLimit(ip);
  const existingUser = await db.user.findFirst({
    where: { phone: normalized, status: "ACTIVE" },
    select: { id: true, companyId: true },
    orderBy: { createdAt: "asc" }
  });
  if (purpose === "REGISTER" && existingUser) {
    throw errors.conflict("\u0627\u06CC\u0646 \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0634\u062F\u0647 \u0627\u0633\u062A. \u0644\u0637\u0641\u0627\u064B \u0648\u0627\u0631\u062F \u0634\u0648\u06CC\u062F.");
  }
  const cooldownStartedAt = new Date(Date.now() - resendCooldownSeconds * 1e3);
  const latest = await db.otpCode.findFirst({
    where: { phone: normalized, purpose },
    orderBy: { createdAt: "desc" }
  });
  if (latest && latest.createdAt > cooldownStartedAt) {
    const waitSeconds = Math.ceil(
      (latest.createdAt.getTime() + resendCooldownSeconds * 1e3 - Date.now()) / 1e3
    );
    throw errors.tooManyRequests(
      `\u0644\u0637\u0641\u0627\u064B ${toPersianDigits(Math.max(waitSeconds, 1))} \u062B\u0627\u0646\u06CC\u0647 \u062F\u06CC\u06AF\u0631 \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F`
    );
  }
  const code = generateOtpCode(codeLength);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1e3);
  await db.otpCode.updateMany({
    where: { phone: normalized, consumedAt: null },
    data: { consumedAt: /* @__PURE__ */ new Date() }
  });
  await db.otpCode.create({
    data: {
      phone: normalized,
      purpose,
      codeHash: hashOtpCode(code),
      expiresAt,
      maxAttempts,
      requestIp: ip,
      userAgent: (_b = getHeader(event, "user-agent")) != null ? _b : null
    }
  });
  const provider = resolveOtpProvider();
  try {
    await provider.send({
      to: normalized,
      code,
      ttlSeconds,
      locale: "fa",
      appName: String((_c = useRuntimeConfig().public.appName) != null ? _c : "\u0648\u0631\u06A9\u200C\u06A9\u0648\u0626\u0633\u062A")
    });
  } catch (error) {
    if (error instanceof OtpDeliveryError) {
      throw errors.serviceUnavailable(error.message);
    }
    throw error;
  }
  return {
    phone: normalized,
    codeLength,
    expiresAt: expiresAt.toISOString(),
    resendAfterSeconds: resendCooldownSeconds,
    provider: provider.id,
    purpose,
    accountExists: Boolean(existingUser)
  };
});
function toPersianDigits(value) {
  return value.toLocaleString("fa-IR");
}
async function enforceIpRateLimit(ip) {
  var _a;
  if (!ip) return;
  const config = useRuntimeConfig();
  const limit = Number((_a = config.otpMaxRequestsPerIpPerHour) != null ? _a : 30);
  if (limit <= 0) return;
  const since = new Date(Date.now() - 60 * 60 * 1e3);
  const requests = await usePrisma().otpCode.count({
    where: { requestIp: ip, createdAt: { gte: since } }
  });
  if (requests >= limit) {
    throw errors.tooManyRequests("\u062A\u0639\u062F\u0627\u062F \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u200C\u0647\u0627\u06CC \u0634\u0645\u0627 \u0627\u0632 \u0627\u06CC\u0646 \u0627\u062A\u0635\u0627\u0644 \u0628\u06CC\u0634 \u0627\u0632 \u062D\u062F \u0645\u062C\u0627\u0632 \u0627\u0633\u062A");
  }
}

const request_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: request_post
}, Symbol.toStringTag, { value: 'Module' }));

const verify_post = defineEventHandler(async (event) => {
  const { phone, code } = await readValidated(event, verifyOtpSchema);
  const normalized = normalizeIranianPhone(phone);
  if (!normalized) throw errors.badRequest("AUTH_INVALID_PHONE", "\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A");
  const db = usePrisma();
  const otp = await db.otpCode.findFirst({
    where: { phone: normalized, consumedAt: null },
    orderBy: { createdAt: "desc" }
  });
  if (!otp) {
    throw errors.badRequest("AUTH_CODE_EXPIRED", "\u06A9\u062F \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647 \u0627\u0633\u062A");
  }
  if (otp.expiresAt.getTime() < Date.now()) {
    await db.otpCode.update({ where: { id: otp.id }, data: { consumedAt: /* @__PURE__ */ new Date() } });
    throw errors.badRequest("AUTH_CODE_EXPIRED", "\u06A9\u062F \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647 \u0627\u0633\u062A\u061B \u06A9\u062F \u062C\u062F\u06CC\u062F \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062F\u0647\u06CC\u062F");
  }
  if (otp.attempts >= otp.maxAttempts) {
    await db.otpCode.update({ where: { id: otp.id }, data: { consumedAt: /* @__PURE__ */ new Date() } });
    throw errors.tooManyRequests("\u062A\u0639\u062F\u0627\u062F \u062A\u0644\u0627\u0634\u200C\u0647\u0627\u06CC \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u06CC\u0634 \u0627\u0632 \u062D\u062F \u0645\u062C\u0627\u0632 \u0627\u0633\u062A\u061B \u06A9\u062F \u062C\u062F\u06CC\u062F \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062F\u0647\u06CC\u062F");
  }
  if (!verifyOtpCode(code, otp.codeHash)) {
    await db.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    const remaining = Math.max(0, otp.maxAttempts - otp.attempts - 1);
    throw errors.badRequest(
      "AUTH_INVALID_CODE",
      remaining > 0 ? `\u06A9\u062F \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0633\u062A (${remaining.toLocaleString("fa-IR")} \u062A\u0644\u0627\u0634 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647)` : "\u06A9\u062F \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0633\u062A"
    );
  }
  const user = await db.user.findFirst({
    where: { phone: normalized, status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
    include: { company: true }
  });
  await db.otpCode.update({ where: { id: otp.id }, data: { consumedAt: /* @__PURE__ */ new Date() } });
  if (otp.purpose === "REGISTER" && user) {
    throw errors.conflict("\u0627\u06CC\u0646 \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0634\u062F\u0647 \u0627\u0633\u062A. \u0644\u0637\u0641\u0627\u064B \u0648\u0627\u0631\u062F \u0634\u0648\u06CC\u062F.");
  }
  if (!user) {
    const invitations = await listPendingInvitationsForPhone(normalized);
    if (invitations.length > 0) {
      const ticket2 = await issueInvitationTicket(event, normalized);
      return {
        status: "invitation_pending",
        phone: normalized,
        expiresAt: ticket2.expiresAt.toISOString(),
        invitationCount: invitations.length
      };
    }
    const ticket = await issueOnboardingTicket(event, normalized);
    return {
      status: "onboarding_required",
      phone: normalized,
      expiresAt: ticket.expiresAt.toISOString()
    };
  }
  if (!user.company.isActive) {
    throw errors.forbidden("\u062D\u0633\u0627\u0628 \u0633\u0627\u0632\u0645\u0627\u0646\u06CC \u0634\u0645\u0627 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062A. \u0628\u0627 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u062A\u0645\u0627\u0633 \u0628\u06AF\u06CC\u0631\u06CC\u062F.");
  }
  const session = await issueSession(event, user);
  startSession(event, session);
  return {
    status: "authenticated",
    user: toUserSummary(user),
    company: toCompanySummary(user.company)
  };
});

const verify_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: verify_post
}, Symbol.toStringTag, { value: 'Module' }));

const session_delete = defineEventHandler(async (event) => {
  const auth = requireAuth(event);
  const db = usePrisma();
  await db.session.updateMany({
    where: { id: auth.sessionId, userId: auth.userId },
    data: { revokedAt: /* @__PURE__ */ new Date() }
  });
  clearSessionCookie(event);
  return { ok: true };
});

const session_delete$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: session_delete
}, Symbol.toStringTag, { value: 'Module' }));

const slug_get = defineEventHandler(async (event) => {
  const { slug } = readValidatedQuery(event, slugQuerySchema);
  const normalized = slugify(slug);
  if (!normalized) {
    return { slug, available: false, suggestion: "" };
  }
  const db = usePrisma();
  const existing = await db.company.findUnique({ where: { slug: normalized }, select: { id: true } });
  if (!existing) {
    return { slug: normalized, available: true };
  }
  const suggestion = await reserveCompanySlug(db, normalized);
  return { slug: normalized, available: false, suggestion };
});

const slug_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: slug_get
}, Symbol.toStringTag, { value: 'Module' }));

const summary_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const auth = requireAuth(event);
  const db = createTenantClient(auth);
  const since = new Date(Date.now() - 30 * 864e5);
  const [progress, boundaries, taskCounts, leaderboard, recognitions, achievements, challenge] = await Promise.all([
    db.userProgress.findUnique({ where: { userId: auth.userId } }),
    db.level.findMany({ orderBy: { level: "asc" }, select: { level: true, minXp: true, title: true, iconKey: true } }),
    db.task.groupBy({
      by: ["status"],
      where: { assigneeId: auth.userId },
      _count: { _all: true }
    }),
    db.userProgress.findMany({
      orderBy: { xp: "desc" },
      take: 5,
      select: { xp: true, user: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true } } }
    }),
    db.recognition.findMany({
      where: { toUserId: auth.userId, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        message: true,
        type: true,
        createdAt: true,
        fromUser: { select: { fullName: true, avatarUrl: true } }
      }
    }),
    db.userAchievement.count({ where: { userId: auth.userId } }),
    db.challenge.findFirst({
      where: { status: "ACTIVE" },
      orderBy: { endsAt: "asc" },
      select: { id: true, title: true, goalKey: true, goalValue: true, xpReward: true, coinReward: true, endsAt: true }
    })
  ]);
  const xp = (_a = progress == null ? void 0 : progress.xp) != null ? _a : 0;
  const level = computeLevelProgress(xp, boundaries);
  const counts = Object.fromEntries(taskCounts.map((row) => [row.status, row._count._all]));
  const myRankRow = await db.userProgress.count({
    where: { xp: { gt: xp } }
  });
  return {
    gamification: {
      xp,
      coins: (_b = progress == null ? void 0 : progress.coins) != null ? _b : 0,
      level: level.level,
      levelTitle: level.title,
      levelPercent: level.percent,
      levelCurrentXp: level.currentXp,
      levelNeededXp: level.neededXp,
      currentStreak: (_c = progress == null ? void 0 : progress.currentStreak) != null ? _c : 0,
      longestStreak: (_d = progress == null ? void 0 : progress.longestStreak) != null ? _d : 0,
      rank: myRankRow + 1,
      achievementsUnlocked: achievements
    },
    // Counts only: the task *lists* are served by `/api/tasks/dashboard`, which
    // owns every task surface and applies the lifecycle rules.
    tasks: { counts },
    leaderboard: leaderboard.map((row, index) => ({
      rank: index + 1,
      xp: row.xp,
      user: row.user
    })),
    recognitions,
    activeChallenge: challenge
  };
});

const summary_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: summary_get
}, Symbol.toStringTag, { value: 'Module' }));

const health_get = defineEventHandler(async () => {
  var _a;
  const startedAt = Date.now();
  let database = "down";
  let databaseError;
  if (!databaseUrl()) {
    databaseError = "DATABASE_URL is not set";
  } else {
    try {
      const db = usePrisma();
      await db.$queryRaw`SELECT 1`;
      database = "up";
    } catch (error) {
      databaseError = error instanceof Error ? error.message : "unknown database error";
    }
  }
  return {
    status: database === "up" ? "ok" : "degraded",
    service: "workquest",
    version: (_a = useRuntimeConfig().public.appVersion) != null ? _a : "0.1.0",
    database,
    databaseError,
    latencyMs: Date.now() - startedAt,
    time: (/* @__PURE__ */ new Date()).toISOString()
  };
});

const health_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: health_get
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$4 = defineEventHandler(async (event) => {
  const auth = requirePermission(event, "member:invite");
  const id = getRouterParam(event, "id");
  if (!id) throw errors.notFound("\u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const db = createTenantClient(auth);
  const invitation = await db.invitation.findUnique({
    where: { id },
    select: { id: true, status: true, invitedById: true, phone: true }
  });
  if (!invitation) throw errors.notFound("\u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const isAdmin = auth.role === "OWNER" || auth.role === "ADMIN";
  if (!isAdmin && invitation.invitedById !== auth.userId) {
    throw errors.forbidden("\u0641\u0642\u0637 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647\u200C\u0647\u0627\u06CC \u062E\u0648\u062F\u062A\u0627\u0646 \u0631\u0627 \u0644\u063A\u0648 \u06A9\u0646\u06CC\u062F");
  }
  if (invitation.status !== "PENDING") {
    throw errors.conflict("\u0627\u06CC\u0646 \u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u0642\u0628\u0644\u0627\u064B \u0628\u0633\u062A\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A");
  }
  const { count } = await db.invitation.updateMany({
    where: { id: invitation.id, status: "PENDING" },
    data: { status: "REVOKED", revokedAt: /* @__PURE__ */ new Date(), pendingPhone: null }
  });
  if (count === 0) throw errors.conflict("\u0627\u06CC\u0646 \u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u0642\u0628\u0644\u0627\u064B \u0628\u0633\u062A\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A");
  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: "member.invitation_revoke",
      targetType: "Invitation",
      targetId: invitation.id,
      ip: getRequestIP(event, { xForwardedFor: true })
    }
  });
  return { ok: true };
});

const _id__delete$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$4
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$a = defineEventHandler(async (event) => {
  const auth = requirePermission(event, "member:invite");
  const query = readValidatedQuery(event, invitationListSchema);
  const db = createTenantClient(auth);
  await expireStaleInvitations(auth);
  const companyWide = can(auth.role, "member:manage");
  const where = { status: query.status };
  if (!companyWide) where.invitedById = auth.userId;
  const [rows, total] = await Promise.all([
    db.invitation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      include: {
        team: { select: { id: true, name: true } },
        invitedBy: { select: { id: true, fullName: true } },
        acceptedBy: { select: { id: true, fullName: true } }
      }
    }),
    db.invitation.count({ where })
  ]);
  const invitations = rows.map((row) => {
    var _a, _b;
    return {
      id: row.id,
      fullName: row.fullName,
      phone: row.phone,
      jobTitle: row.jobTitle,
      role: row.role,
      status: row.status,
      team: row.team,
      invitedBy: row.invitedBy,
      expiresAt: row.expiresAt.toISOString(),
      acceptedAt: (_b = (_a = row.acceptedAt) == null ? void 0 : _a.toISOString()) != null ? _b : null,
      acceptedBy: row.acceptedBy,
      createdAt: row.createdAt.toISOString()
    };
  });
  return {
    invitations,
    total,
    page: query.page,
    pageSize: query.pageSize,
    // Revoking is an admin action; a manager can withdraw their own invite,
    // which the detail check in the revoke route allows explicitly.
    canRevoke: companyWide
  };
});

const index_get$b = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$a
}, Symbol.toStringTag, { value: 'Module' }));

const leaderboard_get = defineEventHandler(async (event) => {
  var _a, _b;
  const auth = requireAuth(event);
  const query = readValidatedQuery(event, leaderboardRangeSchema);
  const db = createTenantClient(auth);
  const rows = await db.userProgress.findMany({
    orderBy: [{ xp: "desc" }, { updatedAt: "asc" }],
    take: query.limit,
    select: {
      xp: true,
      coins: true,
      currentStreak: true,
      user: {
        select: { id: true, fullName: true, avatarUrl: true, jobTitle: true, role: true }
      }
    }
  });
  const me = await db.userProgress.findUnique({
    where: { userId: auth.userId },
    select: { xp: true }
  });
  const higher = await db.userProgress.count({ where: { xp: { gt: (_a = me == null ? void 0 : me.xp) != null ? _a : 0 } } });
  return {
    range: query.range,
    items: rows.map((row, index) => ({
      rank: index + 1,
      xp: row.xp,
      coins: row.coins,
      currentStreak: row.currentStreak,
      isMe: row.user.id === auth.userId,
      user: row.user
    })),
    me: { userId: auth.userId, rank: higher + 1, xp: (_b = me == null ? void 0 : me.xp) != null ? _b : 0 }
  };
});

const leaderboard_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: leaderboard_get
}, Symbol.toStringTag, { value: 'Module' }));

const me_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const auth = requireAuth(event);
  const db = createTenantClient(auth);
  const progress = await db.userProgress.findUnique({ where: { userId: auth.userId } });
  const boundaries = await db.level.findMany({
    orderBy: { level: "asc" },
    select: { level: true, minXp: true, title: true, iconKey: true }
  });
  const xp = (_a = progress == null ? void 0 : progress.xp) != null ? _a : 0;
  const level = computeLevelProgress(xp, boundaries);
  const unreadNotifications = await db.notification.count({
    where: { userId: auth.userId, status: "UNREAD" }
  });
  return {
    user: {
      id: auth.userId,
      fullName: auth.fullName,
      email: auth.email,
      phone: auth.phone,
      role: auth.role,
      avatarUrl: auth.avatarUrl,
      locale: auth.locale
    },
    company: auth.company,
    gamification: {
      xp,
      coins: (_b = progress == null ? void 0 : progress.coins) != null ? _b : 0,
      level: level.level,
      levelTitle: level.title,
      levelPercent: level.percent,
      currentStreak: (_c = progress == null ? void 0 : progress.currentStreak) != null ? _c : 0,
      longestStreak: (_d = progress == null ? void 0 : progress.longestStreak) != null ? _d : 0
    },
    unreadNotifications
  };
});

const me_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: me_get
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$2 = defineEventHandler(async (event) => {
  const auth = requirePermission(event, "member:manage");
  const id = getRouterParam(event, "id");
  if (!id) throw errors.notFound("\u06A9\u0627\u0631\u0628\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  if (id === auth.userId) throw errors.conflict("\u0627\u0645\u06A9\u0627\u0646 \u062D\u0630\u0641 \u062D\u0633\u0627\u0628 \u062E\u0648\u062F\u062A\u0627\u0646 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F");
  const db = createTenantClient(auth);
  const target = await db.user.findUnique({
    where: { id },
    select: { id: true, role: true, status: true, fullName: true }
  });
  if (!target) throw errors.notFound("\u06A9\u0627\u0631\u0628\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  if (target.role === "OWNER") {
    const owners = await db.user.count({ where: { role: "OWNER", status: { not: "DEACTIVATED" } } });
    if (owners <= 1) throw errors.conflict("\u0634\u0631\u06A9\u062A \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06CC\u06A9 \u0645\u0627\u0644\u06A9 \u0641\u0639\u0627\u0644 \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F");
  }
  await db.$transaction(async (tx) => {
    await tx.teamMember.deleteMany({ where: { userId: target.id } });
    await tx.session.updateMany({
      where: { userId: target.id, revokedAt: null },
      data: { revokedAt: /* @__PURE__ */ new Date() }
    });
    await tx.user.update({ where: { id: target.id }, data: { status: "DEACTIVATED" } });
    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: "member.remove",
        targetType: "User",
        targetId: target.id,
        ip: getRequestIP(event, { xForwardedFor: true }),
        data: { fullName: target.fullName }
      }
    });
  });
  return { ok: true };
});

const _id__delete$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$2
}, Symbol.toStringTag, { value: 'Module' }));

const _id__get$4 = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const auth = requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) throw errors.notFound("\u06A9\u0627\u0631\u0628\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const db = createTenantClient(auth);
  const managedUserIds = can(auth.role, "member:manage") ? [] : await getManagedUserIds(auth.companyId, auth.userId);
  const visible = new Set(managedUserIds).has(id) || id === auth.userId || can(auth.role, "member:manage");
  if (!visible) throw errors.notFound("\u06A9\u0627\u0631\u0628\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const user = await db.user.findUnique({
    where: { id },
    select: MEMBER_SELECT
  });
  if (!user) throw errors.notFound("\u06A9\u0627\u0631\u0628\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const membership = (_a = user.teamMemberships[0]) != null ? _a : null;
  const [progress, achievements, taskCounts, openTasks] = await Promise.all([
    db.userProgress.findUnique({
      where: { userId: user.id },
      select: {
        xp: true,
        coins: true,
        currentStreak: true,
        longestStreak: true
        // `UserProgress` has no relation to `Level`, so the ladder position is
        // resolved from `minXp` below.
      }
    }),
    db.userAchievement.findMany({
      where: { userId: user.id },
      select: {
        unlockedAt: true,
        achievement: { select: { title: true, description: true, iconKey: true } }
      },
      orderBy: { unlockedAt: "desc" },
      take: 12
    }),
    db.task.groupBy({
      by: ["status"],
      where: { assigneeId: user.id },
      _count: { _all: true }
    }),
    db.task.count({
      where: {
        assigneeId: user.id,
        dueDate: { lt: /* @__PURE__ */ new Date() },
        status: { notIn: [...CLOSED_TASK_STATUSES] }
      }
    })
  ]);
  const countOf = (status) => {
    var _a2, _b2;
    return (_b2 = (_a2 = taskCounts.find((row) => row.status === status)) == null ? void 0 : _a2._count._all) != null ? _b2 : 0;
  };
  const level = progress ? await db.level.findFirst({
    where: { minXp: { lte: progress.xp } },
    orderBy: { level: "desc" },
    select: { title: true, level: true, iconKey: true }
  }) : null;
  const permissions = memberPermissions(
    auth,
    { id: user.id, role: user.role, status: user.status },
    managedUserIds
  );
  const member = {
    id: user.id,
    fullName: user.fullName,
    phone: (_b = user.phone) != null ? _b : "",
    email: user.email,
    avatarUrl: user.avatarUrl,
    jobTitle: user.jobTitle,
    role: user.role,
    status: user.status,
    lastLoginAt: (_d = (_c = user.lastLoginAt) == null ? void 0 : _c.toISOString()) != null ? _d : null,
    team: (_e = membership == null ? void 0 : membership.team) != null ? _e : null,
    manager: (_f = membership == null ? void 0 : membership.manager) != null ? _f : null,
    teamRole: (_g = membership == null ? void 0 : membership.role) != null ? _g : null,
    subordinateCount: 0,
    createdAt: user.createdAt.toISOString(),
    progress: progress ? {
      xp: progress.xp,
      coins: progress.coins,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      level: level ? { name: (_h = level.title) != null ? _h : `\u0633\u0637\u062D ${level.level}`, level: level.level, iconKey: level.iconKey } : null
    } : null,
    achievements: achievements.map((row) => ({
      name: row.achievement.title,
      description: row.achievement.description,
      iconKey: row.achievement.iconKey,
      unlockedAt: row.unlockedAt.toISOString()
    })),
    performance: {
      // "Assigned" for the profile means open work, i.e. everything not yet
      // approved and not yet handed in.
      assigned: countOf("TODO") + countOf("IN_PROGRESS") + countOf("NEEDS_REVISION"),
      completed: countOf("APPROVED"),
      inReview: countOf("SUBMITTED"),
      overdue: openTasks
    },
    permissions
  };
  if (permissions.canEdit || can(auth.role, "member:manage")) {
    const reports = await db.teamMember.count({ where: { managerId: user.id } });
    member.subordinateCount = reports;
  }
  return { member };
});

const _id__get$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__get$4
}, Symbol.toStringTag, { value: 'Module' }));

const _id__patch$4 = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const auth = requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) throw errors.notFound("\u06A9\u0627\u0631\u0628\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const input = await readValidated(event, updateMemberSchema);
  const db = createTenantClient(auth);
  const managedUserIds = can(auth.role, "member:manage") ? [] : await getManagedUserIds(auth.companyId, auth.userId);
  const target = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      role: true,
      status: true,
      teamMemberships: { select: { id: true, teamId: true } }
    }
  });
  if (!target) throw errors.notFound("\u06A9\u0627\u0631\u0628\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const permissions = memberPermissions(
    auth,
    { id: target.id, role: target.role, status: target.status },
    managedUserIds
  );
  if (!permissions.canEdit) throw errors.notFound("\u06A9\u0627\u0631\u0628\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const isAdmin = can(auth.role, "member:manage");
  const wantsRole = input.role !== void 0;
  const wantsStatus = input.status !== void 0;
  const wantsTeam = input.teamId !== void 0;
  const wantsManager = input.managerId !== void 0;
  const wantsName = input.fullName !== void 0;
  const wantsTitle = input.jobTitle !== void 0;
  if ((wantsRole || wantsStatus) && !isAdmin) {
    throw errors.forbidden("\u062A\u063A\u06CC\u06CC\u0631 \u0646\u0642\u0634 \u06CC\u0627 \u0648\u0636\u0639\u06CC\u062A \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u062F\u0631 \u0627\u062E\u062A\u06CC\u0627\u0631 \u0645\u062F\u06CC\u0631\u0627\u0646 \u0634\u0631\u06A9\u062A \u0627\u0633\u062A");
  }
  if (wantsRole && !permissions.canChangeRole) {
    throw errors.forbidden("\u0627\u0645\u06A9\u0627\u0646 \u062A\u063A\u06CC\u06CC\u0631 \u0646\u0642\u0634 \u0627\u06CC\u0646 \u06A9\u0627\u0631\u0628\u0631 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F");
  }
  if (wantsRole) {
    const ceiling = maxAssignableRole(auth.role);
    if (!roleAtMost(input.role, ceiling)) {
      throw errors.forbidden("\u0627\u062C\u0627\u0632\u0647 \u062A\u0639\u06CC\u06CC\u0646 \u0627\u06CC\u0646 \u0646\u0642\u0634 \u0631\u0627 \u0646\u062F\u0627\u0631\u06CC\u062F");
    }
  }
  if (wantsStatus) {
    if (target.role === "OWNER" && input.status !== "ACTIVE") {
      const owners = await db.user.count({ where: { role: "OWNER", status: "ACTIVE" } });
      if (owners <= 1) {
        throw errors.conflict("\u0634\u0631\u06A9\u062A \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06CC\u06A9 \u0645\u0627\u0644\u06A9 \u0641\u0639\u0627\u0644 \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F");
      }
    }
    if (input.status !== "ACTIVE" && target.id === auth.userId) {
      throw errors.conflict("\u0627\u0645\u06A9\u0627\u0646 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u06A9\u0631\u062F\u0646 \u062D\u0633\u0627\u0628 \u062E\u0648\u062F\u062A\u0627\u0646 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F");
    }
  }
  const led = await ledTeamIds(auth);
  const nextTeamId = wantsTeam ? input.teamId || null : void 0;
  if (nextTeamId !== void 0 && nextTeamId !== null) {
    const team = await db.team.findUnique({ where: { id: nextTeamId }, select: { id: true } });
    if (!team) throw errors.notFound("\u062A\u06CC\u0645 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
    if (!canEditTeam(auth, nextTeamId, led)) {
      throw errors.forbidden("\u0641\u0642\u0637 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0627\u0639\u0636\u0627 \u0631\u0627 \u0628\u06CC\u0646 \u062A\u06CC\u0645\u200C\u0647\u0627\u06CC \u0632\u06CC\u0631 \u0646\u0638\u0631 \u062E\u0648\u062F\u062A\u0627\u0646 \u062C\u0627\u0628\u0647\u200C\u062C\u0627 \u06A9\u0646\u06CC\u062F");
    }
  } else if (nextTeamId === null && !isAdmin) {
    throw errors.forbidden("\u062D\u0630\u0641 \u0639\u0636\u0648\u06CC\u062A \u062A\u06CC\u0645\u06CC \u062F\u0631 \u0627\u062E\u062A\u06CC\u0627\u0631 \u0645\u062F\u06CC\u0631\u0627\u0646 \u0634\u0631\u06A9\u062A \u0627\u0633\u062A");
  }
  const nextManagerId = wantsManager ? input.managerId || null : void 0;
  if (nextManagerId) {
    if (nextManagerId === target.id) {
      throw errors.badRequest("MANAGER_SELF", "\u0645\u062F\u06CC\u0631 \u0645\u0633\u062A\u0642\u06CC\u0645 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u062E\u0648\u062F \u0641\u0631\u062F \u0628\u0627\u0634\u062F");
    }
    const manager = await db.user.findUnique({ where: { id: nextManagerId }, select: { id: true } });
    if (!manager) throw errors.notFound("\u0645\u062F\u06CC\u0631 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
    const teamId = (_b = nextTeamId != null ? nextTeamId : (_a = target.teamMemberships[0]) == null ? void 0 : _a.teamId) != null ? _b : null;
    if (teamId) {
      const inTeam = await db.teamMember.findFirst({
        where: { teamId, userId: nextManagerId },
        select: { id: true }
      });
      if (!inTeam) throw errors.badRequest("MANAGER_NOT_IN_TEAM", "\u0645\u062F\u06CC\u0631 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0639\u0636\u0648 \u0627\u06CC\u0646 \u062A\u06CC\u0645 \u0646\u06CC\u0633\u062A");
    }
  }
  const userData = {};
  if (wantsName) userData.fullName = input.fullName;
  if (wantsTitle) userData.jobTitle = input.jobTitle || null;
  if (wantsRole) userData.role = input.role;
  if (wantsStatus) userData.status = input.status;
  const updated = await db.$transaction(async (tx) => {
    if (Object.keys(userData).length > 0) {
      await tx.user.update({ where: { id: target.id }, data: userData });
    }
    if (nextTeamId !== void 0) {
      const current = target.teamMemberships[0];
      if (nextTeamId === null) {
        if (current) await tx.teamMember.delete({ where: { id: current.id } });
      } else if (!current) {
        await tx.teamMember.create({
          data: {
            companyId: auth.companyId,
            teamId: nextTeamId,
            userId: target.id,
            managerId: nextManagerId != null ? nextManagerId : null
          }
        });
      } else if (current.teamId !== nextTeamId) {
        await tx.teamMember.update({
          where: { id: current.id },
          data: { teamId: nextTeamId, managerId: nextManagerId != null ? nextManagerId : null }
        });
      } else if (wantsManager) {
        await tx.teamMember.update({
          where: { id: current.id },
          data: { managerId: nextManagerId }
        });
      }
    }
    if (wantsStatus && input.status !== "ACTIVE" || wantsRole && input.role !== target.role) {
      await tx.session.updateMany({
        where: { userId: target.id, revokedAt: null },
        data: { revokedAt: /* @__PURE__ */ new Date() }
      });
    }
    return tx.user.findUnique({
      where: { id: target.id },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        avatarUrl: true,
        jobTitle: true,
        role: true,
        status: true,
        lastLoginAt: true,
        teamMemberships: {
          select: {
            role: true,
            manager: { select: { id: true, fullName: true } },
            team: { select: { id: true, name: true, slug: true } }
          }
        }
      }
    });
  });
  if (!updated) throw errors.notFound("\u06A9\u0627\u0631\u0628\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: "member.update",
      targetType: "User",
      targetId: target.id,
      ip: getRequestIP(event, { xForwardedFor: true }),
      data: { fields: Object.keys(input) }
    }
  });
  const membership = (_c = updated.teamMemberships[0]) != null ? _c : null;
  return {
    member: {
      id: updated.id,
      fullName: updated.fullName,
      phone: (_d = updated.phone) != null ? _d : "",
      email: updated.email,
      avatarUrl: updated.avatarUrl,
      jobTitle: updated.jobTitle,
      role: updated.role,
      status: updated.status,
      lastLoginAt: (_f = (_e = updated.lastLoginAt) == null ? void 0 : _e.toISOString()) != null ? _f : null,
      team: (_g = membership == null ? void 0 : membership.team) != null ? _g : null,
      manager: (_h = membership == null ? void 0 : membership.manager) != null ? _h : null,
      teamRole: (_i = membership == null ? void 0 : membership.role) != null ? _i : null,
      subordinateCount: 0
    }
  };
});

const _id__patch$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__patch$4
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$8 = defineEventHandler(async (event) => {
  var _a;
  const auth = requireAuth(event);
  const query = readValidatedQuery(event, memberListSchema);
  const db = createTenantClient(auth);
  const isCompanyWide = can(auth.role, "member:manage");
  const managedUserIds = isCompanyWide ? [] : await getManagedUserIds(auth.companyId, auth.userId);
  const allowedIds = visibleMemberScope(auth, managedUserIds);
  if (query.scope === "all" && allowedIds !== null) {
    throw errors.forbidden("\u062F\u0633\u062A\u0631\u0633\u06CC \u0644\u0627\u0632\u0645 \u0628\u0631\u0627\u06CC \u0645\u0634\u0627\u0647\u062F\u0647 \u0647\u0645\u0647 \u0627\u0639\u0636\u0627\u06CC \u0634\u0631\u06A9\u062A \u0631\u0627 \u0646\u062F\u0627\u0631\u06CC\u062F");
  }
  const and = [];
  const effectiveIds = query.scope === "all" ? null : allowedIds;
  if (effectiveIds !== null) and.push({ id: { in: effectiveIds } });
  if (query.role) and.push({ role: query.role });
  if (query.teamId) and.push({ teamMemberships: { some: { teamId: query.teamId } } });
  if (query.scope === "team") {
    if (isCompanyWide) {
      and.push({ teamMemberships: { some: {} } });
    } else {
      const teams = await db.team.findMany({
        where: {
          OR: [{ leadId: auth.userId }, { members: { some: { userId: auth.userId } } }]
        },
        select: { id: true }
      });
      and.push({ teamMemberships: { some: { teamId: { in: teams.map((t) => t.id) } } } });
    }
  }
  if (query.search) {
    const term = query.search.trim();
    and.push({
      OR: [
        { fullName: { contains: term, mode: "insensitive" } },
        { jobTitle: { contains: term, mode: "insensitive" } },
        { phone: { contains: term } }
      ]
    });
  }
  const where = and.length > 0 ? { AND: and } : {};
  if (effectiveIds !== null && effectiveIds.length === 0) {
    return {
      members: [],
      total: 0,
      page: query.page,
      pageSize: query.pageSize,
      scope: "mine",
      canManageRoles: isCompanyWide
    };
  }
  const [rows, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { fullName: "asc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: MEMBER_SELECT
    }),
    db.user.count({ where })
  ]);
  const managerRows = await db.teamMember.findMany({
    where: { managerId: { in: rows.map((row) => row.id) } },
    select: { managerId: true, userId: true }
  });
  const reportCounts = /* @__PURE__ */ new Map();
  for (const row of managerRows) {
    if (!row.managerId) continue;
    const set = (_a = reportCounts.get(row.managerId)) != null ? _a : /* @__PURE__ */ new Set();
    set.add(row.userId);
    reportCounts.set(row.managerId, set);
  }
  const members = rows.map((user) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    const membership = (_a2 = user.teamMemberships[0]) != null ? _a2 : null;
    return {
      id: user.id,
      fullName: user.fullName,
      phone: (_b = user.phone) != null ? _b : "",
      email: user.email,
      avatarUrl: user.avatarUrl,
      jobTitle: user.jobTitle,
      role: user.role,
      status: user.status,
      lastLoginAt: (_d = (_c = user.lastLoginAt) == null ? void 0 : _c.toISOString()) != null ? _d : null,
      team: (_e = membership == null ? void 0 : membership.team) != null ? _e : null,
      manager: (_f = membership == null ? void 0 : membership.manager) != null ? _f : null,
      teamRole: (_g = membership == null ? void 0 : membership.role) != null ? _g : null,
      subordinateCount: (_i = (_h = reportCounts.get(user.id)) == null ? void 0 : _h.size) != null ? _i : 0
    };
  });
  return {
    members,
    total,
    page: query.page,
    pageSize: query.pageSize,
    scope: effectiveIds === null ? "all" : "mine",
    canManageRoles: isCompanyWide
  };
});

const index_get$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$8
}, Symbol.toStringTag, { value: 'Module' }));

const MAX_INVITATION_DAYS = 30;
const invite_post = defineEventHandler(async (event) => {
  const auth = requirePermission(event, "member:invite");
  const input = await readValidated(event, inviteMemberSchema);
  const db = createTenantClient(auth);
  const ceiling = maxAssignableRole(auth.role);
  if (!roleAtMost(input.role, ceiling)) {
    throw errors.forbidden("\u0627\u062C\u0627\u0632\u0647 \u062A\u0639\u06CC\u06CC\u0646 \u0627\u06CC\u0646 \u0646\u0642\u0634 \u0631\u0627 \u0646\u062F\u0627\u0631\u06CC\u062F");
  }
  const led = await ledTeamIds(auth);
  const teamId = input.teamId || null;
  if (teamId) {
    const team = await db.team.findUnique({ where: { id: teamId }, select: { id: true, name: true } });
    if (!team) throw errors.notFound("\u062A\u06CC\u0645 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
    if (!canEditTeam(auth, teamId, led)) {
      throw errors.forbidden("\u0641\u0642\u0637 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0628\u0647 \u062A\u06CC\u0645\u200C\u0647\u0627\u06CC \u0632\u06CC\u0631 \u0646\u0638\u0631 \u062E\u0648\u062F\u062A\u0627\u0646 \u0646\u06CC\u0631\u0648 \u062F\u0639\u0648\u062A \u06A9\u0646\u06CC\u062F");
    }
  }
  const phone = input.phone;
  const existing = await db.user.findFirst({
    where: { phone },
    select: { id: true, fullName: true, status: true }
  });
  if (existing && existing.status !== "DEACTIVATED") {
    throw errors.conflict("\u0627\u06CC\u0646 \u0634\u0645\u0627\u0631\u0647 \u0642\u0628\u0644\u0627\u064B \u0639\u0636\u0648 \u0634\u0631\u06A9\u062A \u0627\u0633\u062A");
  }
  const duplicate = await db.invitation.findFirst({
    where: { pendingPhone: phone },
    select: { id: true, fullName: true }
  });
  if (duplicate) {
    throw errors.conflict("\u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u0634\u0645\u0627\u0631\u0647 \u062F\u0639\u0648\u062A\u200C\u0646\u0627\u0645\u0647 \u0628\u0627\u0632 \u0648\u062C\u0648\u062F \u062F\u0627\u0631\u062F");
  }
  const days = Math.min(Math.max(input.expiresInDays, 1), MAX_INVITATION_DAYS);
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1e3);
  const invitation = await db.invitation.create({
    data: {
      // Explicit even though the tenant client would inject it: Prisma's
      // checked-input type needs either this or a `company` connect.
      companyId: auth.companyId,
      phone,
      pendingPhone: phone,
      fullName: input.fullName,
      jobTitle: input.jobTitle || null,
      teamId,
      role: input.role,
      invitedById: auth.userId,
      expiresAt
    },
    include: {
      team: { select: { id: true, name: true } },
      invitedBy: { select: { id: true, fullName: true } }
    }
  });
  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: "member.invite",
      targetType: "Invitation",
      targetId: invitation.id,
      ip: getRequestIP(event, { xForwardedFor: true }),
      data: { phone, role: invitation.role, teamId }
    }
  });
  return {
    invitation: {
      id: invitation.id,
      fullName: invitation.fullName,
      phone: invitation.phone,
      jobTitle: invitation.jobTitle,
      role: invitation.role,
      status: invitation.status,
      team: invitation.team,
      invitedBy: invitation.invitedBy,
      expiresAt: invitation.expiresAt.toISOString(),
      acceptedAt: null,
      acceptedBy: null,
      createdAt: invitation.createdAt.toISOString()
    }
  };
});

const invite_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: invite_post
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$6 = defineEventHandler(async (event) => {
  const auth = requireAuth(event);
  const query = readValidatedQuery(event, paginationSchema);
  const db = createTenantClient(auth);
  const visibleStatuses = ["UNREAD", "READ"];
  const where = { userId: auth.userId, status: { in: visibleStatuses } };
  const [items, total, unread] = await Promise.all([
    db.notification.findMany({
      where,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: { id: true, type: true, title: true, body: true, data: true, status: true, createdAt: true }
    }),
    db.notification.count({ where }),
    db.notification.count({ where: { userId: auth.userId, status: "UNREAD" } })
  ]);
  return { items, total, unread, page: query.page, pageSize: query.pageSize };
});

const index_get$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$6
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$4 = defineEventHandler(async (event) => {
  var _a;
  const auth = requireAuth(event);
  const db = createTenantClient(auth);
  const [rewards, progress, redemptions] = await Promise.all([
    db.reward.findMany({
      where: { status: "ACTIVE" },
      orderBy: { cost: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        cost: true,
        stock: true,
        imageUrl: true
      }
    }),
    db.userProgress.findUnique({ where: { userId: auth.userId }, select: { coins: true } }),
    db.rewardRedemption.findMany({
      where: { userId: auth.userId },
      orderBy: { requestedAt: "desc" },
      take: 10,
      select: {
        id: true,
        status: true,
        cost: true,
        requestedAt: true,
        decidedAt: true,
        note: true,
        reward: { select: { id: true, title: true, type: true, imageUrl: true } }
      }
    })
  ]);
  const coins = (_a = progress == null ? void 0 : progress.coins) != null ? _a : 0;
  return {
    balance: coins,
    rewards: rewards.map((reward) => ({
      ...reward,
      affordable: reward.cost <= coins,
      available: reward.stock === null || reward.stock > 0
    })),
    redemptions: redemptions.map((row) => {
      var _a2, _b;
      return {
        id: row.id,
        status: row.status,
        cost: row.cost,
        note: row.note,
        requestedAt: row.requestedAt.toISOString(),
        decidedAt: (_b = (_a2 = row.decidedAt) == null ? void 0 : _a2.toISOString()) != null ? _b : null,
        reward: row.reward
      };
    })
  };
});

const index_get$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$4
}, Symbol.toStringTag, { value: 'Module' }));

const _id__get$2 = defineEventHandler(async (event) => {
  var _a;
  const auth = requireAuth(event);
  const taskId = getRouterParam(event, "id");
  if (!taskId) throw errors.notFound("\u062A\u0633\u06A9 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const task = await loadVisibleTask(auth, taskId);
  const db = createTenantClient(auth);
  const now = /* @__PURE__ */ new Date();
  const [comments, attachments, reviews, events, canManage] = await Promise.all([
    db.taskComment.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: { select: { id: true, fullName: true, avatarUrl: true } }
      }
    }),
    db.taskAttachment.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fileName: true,
        url: true,
        mimeType: true,
        sizeBytes: true,
        createdAt: true,
        uploadedBy: { select: { id: true, fullName: true } }
      }
    }),
    db.taskReview.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        decision: true,
        score: true,
        feedback: true,
        xpAwarded: true,
        coinsAwarded: true,
        createdAt: true,
        reviewer: { select: { id: true, fullName: true, avatarUrl: true } }
      }
    }),
    db.taskEvent.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        action: true,
        fromStatus: true,
        toStatus: true,
        note: true,
        createdAt: true,
        actor: { select: { id: true, fullName: true, avatarUrl: true } }
      }
    }),
    canManageTask(auth, task)
  ]);
  return {
    task: toTaskSummary(task, now),
    comments: comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString()
    })),
    attachments: attachments.map((file) => ({
      ...file,
      createdAt: file.createdAt.toISOString()
    })),
    reviews: reviews.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString()
    })),
    events: events.map((entry) => ({
      ...entry,
      createdAt: entry.createdAt.toISOString()
    })),
    permissions: {
      canManage,
      isAssignee: ((_a = task.assignee) == null ? void 0 : _a.id) === auth.userId
    }
  };
});

const _id__get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__get$2
}, Symbol.toStringTag, { value: 'Module' }));

const _id__patch$2 = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const auth = requirePermission(event, "task:assign");
  const taskId = getRouterParam(event, "id");
  if (!taskId) throw errors.notFound("\u062A\u0633\u06A9 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const input = await readValidated(event, updateTaskSchema);
  const task = await loadVisibleTask(auth, taskId);
  if (!await canManageTask(auth, task)) {
    throw errors.forbidden("\u0627\u062C\u0627\u0632\u0647\u0654 \u0648\u06CC\u0631\u0627\u06CC\u0634 \u0627\u06CC\u0646 \u062A\u0633\u06A9 \u0631\u0627 \u0646\u062F\u0627\u0631\u06CC\u062F");
  }
  const db = createTenantClient(auth);
  const data = {};
  const previousAssigneeId = (_b = (_a = task.assignee) == null ? void 0 : _a.id) != null ? _b : null;
  let reassignedTo = null;
  if (input.title !== void 0) data.title = input.title;
  if (input.description !== void 0) data.description = input.description || null;
  if (input.priority !== void 0) data.priority = input.priority;
  if (input.dueDate !== void 0) data.dueDate = (_c = input.dueDate) != null ? _c : null;
  if (input.estimatedHours !== void 0) data.estimatedHours = (_d = input.estimatedHours) != null ? _d : null;
  if (input.xpReward !== void 0) data.xpReward = input.xpReward;
  if (input.coinReward !== void 0) data.coinReward = input.coinReward;
  if (input.teamId !== void 0) {
    const teamId = input.teamId || null;
    if (teamId) await assertUsableTeam(auth, teamId);
    data.team = teamId ? { connect: { id: teamId } } : { disconnect: true };
  }
  if (input.assigneeId !== void 0 && input.assigneeId !== previousAssigneeId) {
    const assignee = await assertAssignable(auth, input.assigneeId);
    data.assignee = { connect: { id: assignee.id } };
    data.assignedAt = /* @__PURE__ */ new Date();
    reassignedTo = assignee.id;
  }
  const updated = await db.$transaction(async (tx) => {
    var _a2;
    await tx.task.update({ where: { id: taskId }, data });
    if (reassignedTo) {
      await recordTaskEvent(tx, {
        companyId: auth.companyId,
        taskId,
        actorId: auth.userId,
        action: "task.reassigned",
        fromStatus: task.status,
        toStatus: task.status
      });
      await notifyTask(tx, {
        companyId: auth.companyId,
        userId: reassignedTo,
        actorId: auth.userId,
        type: "TASK_ASSIGNED",
        title: "\u062A\u0633\u06A9\u06CC \u0628\u0647 \u0634\u0645\u0627 \u0645\u062D\u0648\u0644 \u0634\u062F",
        body: (_a2 = input.title) != null ? _a2 : task.title,
        taskId
      });
    } else {
      await recordTaskEvent(tx, {
        companyId: auth.companyId,
        taskId,
        actorId: auth.userId,
        action: "task.updated",
        fromStatus: task.status,
        toStatus: task.status
      });
    }
    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: "task.update",
        targetType: "Task",
        targetId: taskId,
        data: { fields: Object.keys(data) }
      }
    });
    return tx.task.findUniqueOrThrow({ where: { id: taskId }, select: TASK_SELECT });
  });
  return { task: toTaskSummary(updated, /* @__PURE__ */ new Date()) };
});

const _id__patch$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__patch$2
}, Symbol.toStringTag, { value: 'Module' }));

const attachments_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const auth = requireAuth(event);
  const taskId = getRouterParam(event, "id");
  if (!taskId) throw errors.notFound("\u062A\u0633\u06A9 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const input = await readValidated(event, createTaskAttachmentSchema);
  const task = await loadVisibleTask(auth, taskId);
  const mayAttach = ((_a = task.assignee) == null ? void 0 : _a.id) === auth.userId || ((_b = task.assigner) == null ? void 0 : _b.id) === auth.userId || can(auth.role, "task:review");
  if (!mayAttach) throw errors.forbidden("\u0627\u062C\u0627\u0632\u0647\u0654 \u0627\u0641\u0632\u0648\u062F\u0646 \u067E\u06CC\u0648\u0633\u062A \u0628\u0647 \u0627\u06CC\u0646 \u062A\u0633\u06A9 \u0631\u0627 \u0646\u062F\u0627\u0631\u06CC\u062F");
  const db = createTenantClient(auth);
  const attachment = await db.taskAttachment.create({
    data: {
      companyId: auth.companyId,
      taskId,
      uploadedById: auth.userId,
      fileName: input.fileName,
      url: input.url,
      mimeType: input.mimeType || null,
      sizeBytes: (_c = input.sizeBytes) != null ? _c : null
    },
    select: {
      id: true,
      fileName: true,
      url: true,
      mimeType: true,
      sizeBytes: true,
      createdAt: true,
      uploadedBy: { select: { id: true, fullName: true } }
    }
  });
  await recordTaskEvent(db, {
    companyId: auth.companyId,
    taskId,
    actorId: auth.userId,
    action: "task.attachment_added",
    note: input.fileName
  });
  setResponseStatus(event, 201);
  return { attachment: { ...attachment, createdAt: attachment.createdAt.toISOString() } };
});

const attachments_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: attachments_post
}, Symbol.toStringTag, { value: 'Module' }));

const comments_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  const auth = requireAuth(event);
  const taskId = getRouterParam(event, "id");
  if (!taskId) throw errors.notFound("\u062A\u0633\u06A9 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const input = await readValidated(event, createTaskCommentSchema);
  const task = await loadVisibleTask(auth, taskId);
  const db = createTenantClient(auth);
  const comment = await db.taskComment.create({
    data: { companyId: auth.companyId, taskId, authorId: auth.userId, body: input.body },
    select: {
      id: true,
      body: true,
      createdAt: true,
      author: { select: { id: true, fullName: true, avatarUrl: true } }
    }
  });
  const counterpart = auth.userId === ((_a = task.assignee) == null ? void 0 : _a.id) ? (_c = (_b = task.assigner) == null ? void 0 : _b.id) != null ? _c : null : (_e = (_d = task.assignee) == null ? void 0 : _d.id) != null ? _e : null;
  await notifyTask(db, {
    companyId: auth.companyId,
    userId: counterpart,
    actorId: auth.userId,
    type: "TASK_REVIEWED",
    title: "\u06CC\u0627\u062F\u062F\u0627\u0634\u062A \u062C\u062F\u06CC\u062F \u0631\u0648\u06CC \u062A\u0633\u06A9",
    body: task.title,
    taskId
  });
  setResponseStatus(event, 201);
  return { comment: { ...comment, createdAt: comment.createdAt.toISOString() } };
});

const comments_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: comments_post
}, Symbol.toStringTag, { value: 'Module' }));

const progress_patch = defineEventHandler(async (event) => {
  var _a;
  const auth = requireAuth(event);
  const taskId = getRouterParam(event, "id");
  if (!taskId) throw errors.notFound("\u062A\u0633\u06A9 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const input = await readValidated(event, taskProgressSchema);
  const task = await loadVisibleTask(auth, taskId);
  if (((_a = task.assignee) == null ? void 0 : _a.id) !== auth.userId) {
    throw errors.forbidden("\u0641\u0642\u0637 \u0627\u0646\u062C\u0627\u0645\u200C\u062F\u0647\u0646\u062F\u0647\u0654 \u062A\u0633\u06A9 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u062F\u0631\u0635\u062F \u067E\u06CC\u0634\u0631\u0641\u062A \u0631\u0627 \u062A\u063A\u06CC\u06CC\u0631 \u062F\u0647\u062F");
  }
  if (!ACTIVE_TASK_STATUSES.includes(task.status)) {
    throw errors.conflict("\u0628\u0631\u0627\u06CC \u062B\u0628\u062A \u067E\u06CC\u0634\u0631\u0641\u062A\u060C \u0627\u0628\u062A\u062F\u0627 \u062A\u0633\u06A9 \u0631\u0627 \u0634\u0631\u0648\u0639 \u06A9\u0646\u06CC\u062F");
  }
  const db = createTenantClient(auth);
  const updated = await db.task.update({
    where: { id: taskId },
    data: { progress: input.progress },
    select: TASK_SELECT
  });
  return { task: toTaskSummary(updated, /* @__PURE__ */ new Date()) };
});

const progress_patch$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: progress_patch
}, Symbol.toStringTag, { value: 'Module' }));

const transition_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const auth = requireAuth(event);
  const taskId = getRouterParam(event, "id");
  if (!taskId) throw errors.notFound("\u062A\u0633\u06A9 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const input = await readValidated(event, taskTransitionSchema);
  const task = await loadVisibleTask(auth, taskId);
  assertTransitionAllowed(auth, task, input.action);
  const target = nextStatus(task.status, input.action);
  if (!target) throw errors.conflict("\u0627\u06CC\u0646 \u062A\u063A\u06CC\u06CC\u0631 \u0648\u0636\u0639\u06CC\u062A \u0628\u0627 \u0648\u0636\u0639\u06CC\u062A \u0641\u0639\u0644\u06CC \u062A\u0633\u06A9 \u0633\u0627\u0632\u06AF\u0627\u0631 \u0646\u06CC\u0633\u062A");
  const note = ((_a = input.note) == null ? void 0 : _a.trim()) || null;
  if (input.action === "request_revision" && !note) {
    throw errors.badRequest("REVISION_NOTE_REQUIRED", "\u0628\u0631\u0627\u06CC \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0627\u0635\u0644\u0627\u062D\u060C \u062A\u0648\u0636\u06CC\u062D \u0628\u0646\u0648\u06CC\u0633\u06CC\u062F");
  }
  const db = createTenantClient(auth);
  const now = /* @__PURE__ */ new Date();
  const assigneeId = (_c = (_b = task.assignee) == null ? void 0 : _b.id) != null ? _c : null;
  const updated = await db.$transaction(async (tx) => {
    var _a2, _b2, _c2;
    await tx.task.update({
      where: { id: taskId },
      data: buildData(task.status, target, input.action, input.progress, now)
    });
    await recordTaskEvent(tx, {
      companyId: auth.companyId,
      taskId,
      actorId: auth.userId,
      action: `task.${input.action}`,
      fromStatus: task.status,
      toStatus: target,
      note
    });
    if (input.action === "approve" || input.action === "request_revision") {
      await tx.taskReview.create({
        data: {
          companyId: auth.companyId,
          taskId,
          reviewerId: auth.userId,
          decision: input.action === "approve" ? "APPROVED" : "CHANGES_REQUESTED",
          score: (_a2 = input.score) != null ? _a2 : null,
          feedback: note,
          xpAwarded: input.action === "approve" ? task.xpReward : 0,
          coinsAwarded: input.action === "approve" ? task.coinReward : 0
        }
      });
      await notifyTask(tx, {
        companyId: auth.companyId,
        userId: assigneeId,
        actorId: auth.userId,
        type: "TASK_REVIEWED",
        title: input.action === "approve" ? "\u062A\u0633\u06A9 \u0634\u0645\u0627 \u062A\u0623\u06CC\u06CC\u062F \u0634\u062F" : "\u062A\u0633\u06A9 \u0634\u0645\u0627 \u0646\u06CC\u0627\u0632 \u0628\u0647 \u0627\u0635\u0644\u0627\u062D \u062F\u0627\u0631\u062F",
        body: task.title,
        taskId
      });
    }
    if (input.action === "approve" && assigneeId) {
      await awardTaskRewards(tx, {
        companyId: auth.companyId,
        userId: assigneeId,
        taskId,
        title: task.title,
        xp: task.xpReward,
        coins: task.coinReward
      });
    }
    if (input.action === "submit") {
      await notifyTask(tx, {
        companyId: auth.companyId,
        userId: (_c2 = (_b2 = task.assigner) == null ? void 0 : _b2.id) != null ? _c2 : null,
        actorId: auth.userId,
        type: "TASK_SUBMITTED",
        title: "\u062A\u0633\u06A9\u06CC \u0628\u0631\u0627\u06CC \u0628\u0627\u0632\u0628\u06CC\u0646\u06CC \u0627\u0631\u0633\u0627\u0644 \u0634\u062F",
        body: task.title,
        taskId
      });
    }
    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: `task.${input.action}`,
        targetType: "Task",
        targetId: taskId,
        data: { from: task.status, to: target }
      }
    });
    return tx.task.findUniqueOrThrow({ where: { id: taskId }, select: TASK_SELECT });
  });
  return { task: toTaskSummary(updated, now) };
});
function buildData(from, to, action, progress, now) {
  const data = { status: to };
  if (progress !== void 0) data.progress = progress;
  switch (action) {
    case "start":
      data.startedAt = void 0;
      if (from === "TODO") data.startedAt = now;
      break;
    case "submit":
      data.submittedAt = now;
      if (progress === void 0) data.progress = 100;
      break;
    case "approve":
      data.completedAt = now;
      data.progress = 100;
      break;
    case "request_revision":
      data.revisionCount = { increment: 1 };
      break;
    case "reopen":
      data.submittedAt = null;
      data.completedAt = null;
      break;
  }
  return data;
}
async function awardTaskRewards(tx, input) {
  if (input.xp <= 0 && input.coins <= 0) return;
  if (input.xp > 0) {
    await tx.xpTransaction.create({
      data: {
        companyId: input.companyId,
        userId: input.userId,
        amount: input.xp,
        source: "TASK_REVIEW",
        reason: input.title,
        referenceType: "Task",
        referenceId: input.taskId
      }
    });
  }
  if (input.coins > 0) {
    await tx.coinTransaction.create({
      data: {
        companyId: input.companyId,
        userId: input.userId,
        amount: input.coins,
        source: "TASK_REVIEW",
        reason: input.title,
        referenceType: "Task",
        referenceId: input.taskId
      }
    });
  }
  await tx.userProgress.upsert({
    where: { userId: input.userId },
    create: { companyId: input.companyId, userId: input.userId, xp: input.xp, coins: input.coins },
    update: { xp: { increment: input.xp }, coins: { increment: input.coins } }
  });
}

const transition_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: transition_post
}, Symbol.toStringTag, { value: 'Module' }));

const dashboard_get = defineEventHandler(async (event) => {
  const auth = requireAuth(event);
  const db = createTenantClient(auth);
  const now = /* @__PURE__ */ new Date();
  const timeZone = auth.company.timezone || "Asia/Tehran";
  const todayEnd = endOfDayUtc(now, timeZone);
  const weekEnd = new Date(todayEnd.getTime() + 7 * 864e5);
  const openStatuses = { notIn: [...CLOSED_TASK_STATUSES] };
  const mine = { assigneeId: auth.userId };
  const [
    todaysTasks,
    activeTasks,
    pendingSubmissions,
    completedTasks,
    upcoming,
    myOverdue,
    myTotal,
    myApproved
  ] = await Promise.all([
    // Due today, still open — the "what must happen before I go home" list.
    db.task.findMany({
      where: { ...mine, status: openStatuses, dueDate: { lte: todayEnd } },
      orderBy: [{ dueDate: "asc" }, { priority: "desc" }],
      take: 20,
      select: TASK_SELECT
    }),
    db.task.findMany({
      where: { ...mine, status: { in: [...ACTIVE_TASK_STATUSES] } },
      orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }, { priority: "desc" }],
      take: 20,
      select: TASK_SELECT
    }),
    // Handed in, waiting on someone else.
    db.task.findMany({
      where: { ...mine, status: "SUBMITTED" },
      orderBy: { submittedAt: "desc" },
      take: 20,
      select: TASK_SELECT
    }),
    db.task.findMany({
      where: { ...mine, status: "APPROVED" },
      orderBy: { completedAt: "desc" },
      take: 10,
      select: TASK_SELECT
    }),
    // Deadlines inside the next week that are not already today's problem.
    db.task.findMany({
      where: {
        ...mine,
        status: openStatuses,
        dueDate: { gt: todayEnd, lte: weekEnd }
      },
      orderBy: { dueDate: "asc" },
      take: 10,
      select: TASK_SELECT
    }),
    db.task.count({ where: { ...mine, status: openStatuses, dueDate: { lt: now } } }),
    db.task.count({ where: mine }),
    db.task.count({ where: { ...mine, status: "APPROVED" } })
  ]);
  const employee = {
    today: todaysTasks.map((row) => toTaskSummary(row, now)),
    active: activeTasks.map((row) => toTaskSummary(row, now)),
    pendingSubmissions: pendingSubmissions.map((row) => toTaskSummary(row, now)),
    completed: completedTasks.map((row) => toTaskSummary(row, now)),
    upcomingDeadlines: upcoming.map((row) => toTaskSummary(row, now)),
    counts: {
      today: todaysTasks.length,
      active: activeTasks.length,
      pendingSubmissions: pendingSubmissions.length,
      completed: myApproved,
      overdue: myOverdue,
      total: myTotal,
      completionRate: completionRate(myApproved, myTotal)
    }
  };
  if (!can(auth.role, "task:review")) return { employee, manager: null };
  const visible = await taskVisibleUserIds(auth);
  const led = await ledTeamIdsFor(auth);
  const remit = visible === null ? {} : {
    OR: [
      { assigneeId: { in: visible } },
      { assignerId: auth.userId },
      ...led.length > 0 ? [{ teamId: { in: led } }] : []
    ]
  };
  const [
    managerActive,
    pendingReviews,
    overdueTasks,
    remitTotal,
    remitApproved,
    perTeamTotals,
    perTeamApproved
  ] = await Promise.all([
    db.task.findMany({
      where: { AND: [remit, { status: { in: [...ACTIVE_TASK_STATUSES] } }] },
      orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }, { priority: "desc" }],
      take: 20,
      select: TASK_SELECT
    }),
    // Submissions the caller may act on. Their own submitted work is excluded:
    // they cannot review it, so listing it as a to-do would be a dead end.
    db.task.findMany({
      where: {
        AND: [remit, { status: "SUBMITTED" }, { NOT: { assigneeId: auth.userId } }]
      },
      orderBy: { submittedAt: "asc" },
      take: 20,
      select: TASK_SELECT
    }),
    db.task.findMany({
      where: { AND: [remit, { status: openStatuses, dueDate: { lt: now } }] },
      orderBy: { dueDate: "asc" },
      take: 20,
      select: TASK_SELECT
    }),
    db.task.count({ where: remit }),
    db.task.count({ where: { AND: [remit, { status: "APPROVED" }] } }),
    db.task.groupBy({ by: ["teamId"], where: remit, _count: { _all: true } }),
    db.task.groupBy({
      by: ["teamId"],
      where: { AND: [remit, { status: "APPROVED" }] },
      _count: { _all: true }
    })
  ]);
  const teamIds = [...new Set(perTeamTotals.map((row) => row.teamId).filter((id) => Boolean(id)))];
  const teams = teamIds.length > 0 ? await db.team.findMany({ where: { id: { in: teamIds } }, select: { id: true, name: true } }) : [];
  const teamNames = new Map(teams.map((team) => [team.id, team.name]));
  const approvedByTeam = new Map(perTeamApproved.map((row) => {
    var _a;
    return [(_a = row.teamId) != null ? _a : "", row._count._all];
  }));
  const manager = {
    active: managerActive.map((row) => toTaskSummary(row, now)),
    pendingReviews: pendingReviews.map((row) => toTaskSummary(row, now)),
    overdue: overdueTasks.map((row) => toTaskSummary(row, now)),
    counts: {
      active: managerActive.length,
      pendingReviews: pendingReviews.length,
      overdue: overdueTasks.length,
      total: remitTotal,
      approved: remitApproved,
      completionRate: completionRate(remitApproved, remitTotal)
    },
    teamCompletion: perTeamTotals.filter((row) => row.teamId).map((row) => {
      var _a, _b, _c;
      return {
        teamId: row.teamId,
        teamName: (_a = teamNames.get(row.teamId)) != null ? _a : "\u2014",
        total: row._count._all,
        approved: (_b = approvedByTeam.get(row.teamId)) != null ? _b : 0,
        rate: completionRate((_c = approvedByTeam.get(row.teamId)) != null ? _c : 0, row._count._all)
      };
    }).sort((a, b) => b.total - a.total)
  };
  return { employee, manager };
});
function endOfDayUtc(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).formatToParts(date);
  const get = (type) => {
    var _a, _b;
    return Number((_b = (_a = parts.find((part) => part.type === type)) == null ? void 0 : _a.value) != null ? _b : "0");
  };
  const wallClock = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"), get("second"));
  const offsetMs = wallClock - Math.floor(date.getTime() / 1e3) * 1e3;
  const localMidnight = Date.UTC(get("year"), get("month") - 1, get("day"));
  return new Date(localMidnight - offsetMs + 864e5 - 1);
}

const dashboard_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: dashboard_get
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$2 = defineEventHandler(async (event) => {
  const auth = requireAuth(event);
  const query = readValidatedQuery(event, taskFilterSchema);
  const db = createTenantClient(auth);
  const now = /* @__PURE__ */ new Date();
  if (query.scope === "all" && !can(auth.role, "task:read:all")) throw errors.forbidden();
  if (query.scope === "team" && !can(auth.role, "task:read:team")) throw errors.forbidden();
  const where = await buildWhere();
  const [rows, total] = await Promise.all([
    db.task.findMany({
      where,
      orderBy: orderBy(query.sort),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: TASK_SELECT
    }),
    db.task.count({ where })
  ]);
  return {
    items: rows.map((row) => toTaskSummary(row, now)),
    total,
    page: query.page,
    pageSize: query.pageSize
  };
  async function buildWhere() {
    const filters = [];
    if (query.scope === "mine") {
      filters.push({ assigneeId: auth.userId });
    } else {
      const visible = await taskVisibleUserIds(auth);
      if (visible !== null) {
        const led = await ledTeamIdsFor(auth);
        filters.push({
          OR: [
            { assigneeId: { in: visible } },
            { assignerId: auth.userId },
            // Unassigned work parked in a team the caller leads.
            ...led.length > 0 ? [{ assigneeId: null, teamId: { in: led } }] : []
          ]
        });
      }
    }
    if (query.status) filters.push({ status: query.status });
    if (query.priority) filters.push({ priority: query.priority });
    if (query.teamId) filters.push({ teamId: query.teamId });
    if (query.assigneeId) filters.push({ assigneeId: query.assigneeId });
    if (query.search) {
      filters.push({
        OR: [
          { title: { contains: query.search, mode: "insensitive" } },
          { description: { contains: query.search, mode: "insensitive" } }
        ]
      });
    }
    if (query.overdue) {
      filters.push({ dueDate: { lt: now }, status: { notIn: [...CLOSED_TASK_STATUSES] } });
    }
    return filters.length > 0 ? { AND: filters } : {};
  }
});
function orderBy(sort) {
  switch (sort) {
    case "priority":
      return [{ priority: "desc" }, { dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }];
    case "status":
      return [{ status: "asc" }, { dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }];
    case "createdAt":
      return [{ createdAt: "desc" }];
    case "dueDate":
    default:
      return [{ dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }];
  }
}

const index_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const index_post$2 = defineEventHandler(async (event) => {
  const auth = requirePermission(event, "task:assign");
  const input = await readValidated(event, createTaskSchema);
  const db = createTenantClient(auth);
  const assignee = await assertAssignable(auth, input.assigneeId);
  const teamId = input.teamId || null;
  if (teamId) await assertUsableTeam(auth, teamId);
  const now = /* @__PURE__ */ new Date();
  const task = await db.$transaction(async (tx) => {
    var _a, _b;
    const created = await tx.task.create({
      data: {
        companyId: auth.companyId,
        title: input.title,
        description: input.description || null,
        status: "TODO",
        priority: input.priority,
        assigneeId: assignee.id,
        assignerId: auth.userId,
        teamId,
        dueDate: (_a = input.dueDate) != null ? _a : null,
        estimatedHours: (_b = input.estimatedHours) != null ? _b : null,
        xpReward: input.xpReward,
        coinReward: input.coinReward,
        assignedAt: now
      },
      select: { id: true }
    });
    if (input.attachments.length > 0) {
      await tx.taskAttachment.createMany({
        data: input.attachments.map((file) => {
          var _a2;
          return {
            companyId: auth.companyId,
            taskId: created.id,
            uploadedById: auth.userId,
            fileName: file.fileName,
            url: file.url,
            mimeType: file.mimeType || null,
            sizeBytes: (_a2 = file.sizeBytes) != null ? _a2 : null
          };
        })
      });
    }
    await recordTaskEvent(tx, {
      companyId: auth.companyId,
      taskId: created.id,
      actorId: auth.userId,
      action: "task.created",
      toStatus: "TODO"
    });
    await notifyTask(tx, {
      companyId: auth.companyId,
      userId: assignee.id,
      actorId: auth.userId,
      type: "TASK_ASSIGNED",
      title: "\u062A\u0633\u06A9 \u062C\u062F\u06CC\u062F\u06CC \u0628\u0647 \u0634\u0645\u0627 \u0645\u062D\u0648\u0644 \u0634\u062F",
      body: input.title,
      taskId: created.id
    });
    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: "task.create",
        targetType: "Task",
        targetId: created.id,
        data: { title: input.title, assigneeId: assignee.id }
      }
    });
    return tx.task.findUniqueOrThrow({ where: { id: created.id }, select: TASK_SELECT });
  });
  setResponseStatus(event, 201);
  return { task: toTaskSummary(task, now) };
});

const index_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete = defineEventHandler(async (event) => {
  const auth = requirePermission(event, "team:manage");
  const id = getRouterParam(event, "id");
  if (!id) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const db = createTenantClient(auth);
  const team = await db.team.findUnique({
    where: { id },
    select: { id: true, name: true, _count: { select: { members: true, tasks: true } } }
  });
  if (!team) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  await db.$transaction(async (tx) => {
    await tx.team.delete({ where: { id: team.id } });
    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: "team.delete",
        targetType: "Team",
        targetId: team.id,
        ip: getRequestIP(event, { xForwardedFor: true }),
        data: { name: team.name, members: team._count.members, tasks: team._count.tasks }
      }
    });
  });
  return { ok: true };
});

const _id__delete$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete
}, Symbol.toStringTag, { value: 'Module' }));

const _id__get = defineEventHandler(async (event) => {
  const auth = requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const db = createTenantClient(auth);
  const team = await db.team.findUnique({
    where: { id },
    include: {
      lead: { select: { id: true, fullName: true } },
      members: {
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true, role: true } },
          manager: { select: { id: true, fullName: true } }
        },
        orderBy: { joinedAt: "asc" }
      }
    }
  });
  if (!team) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const led = await ledTeamIds(auth);
  const isMember = team.members.some((member) => member.userId === auth.userId);
  const managesHere = can(auth.role, "team:manage") || team.members.some((member) => member.managerId === auth.userId);
  if (!can(auth.role, "team:manage") && !led.includes(team.id) && !isMember && !managesHere) {
    throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  }
  const edit = canEditTeam(auth, team.id, led);
  let candidates = [];
  if (edit) {
    const managedIds = can(auth.role, "member:manage") ? null : await getManagedUserIds(auth.companyId, auth.userId);
    const rows = await db.user.findMany({
      where: {
        status: "ACTIVE",
        teamMemberships: { none: {} },
        // A manager may only pull from people they can already see.
        ...managedIds ? { id: { in: [...managedIds, auth.userId] } } : {}
      },
      select: { id: true, fullName: true, jobTitle: true },
      orderBy: { fullName: "asc" }
    });
    candidates = rows;
  }
  return {
    team: {
      id: team.id,
      name: team.name,
      slug: team.slug,
      description: team.description,
      lead: team.lead,
      members: team.members.map((member) => ({
        id: member.id,
        userId: member.user.id,
        fullName: member.user.fullName,
        jobTitle: member.user.jobTitle,
        avatarUrl: member.user.avatarUrl,
        role: member.role,
        companyRole: member.user.role,
        manager: member.manager,
        joinedAt: member.joinedAt.toISOString()
      })),
      createdAt: team.createdAt.toISOString()
    },
    canEdit: edit,
    candidates
  };
});

const _id__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__get
}, Symbol.toStringTag, { value: 'Module' }));

const _id__patch = defineEventHandler(async (event) => {
  var _a;
  const auth = requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const input = await readValidated(event, updateTeamSchema);
  const db = createTenantClient(auth);
  const team = await db.team.findUnique({ where: { id }, select: { id: true, leadId: true, slug: true } });
  if (!team) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const led = await ledTeamIds(auth);
  if (!canEditTeam(auth, team.id, led)) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const isAdmin = can(auth.role, "team:manage");
  const wantsLead = input.leadId !== void 0;
  const wantsSlug = input.slug !== void 0;
  if ((wantsLead || wantsSlug) && !isAdmin) {
    throw errors.forbidden("\u062A\u0639\u06CC\u06CC\u0646 \u0633\u0631\u067E\u0631\u0633\u062A \u06CC\u0627 \u0622\u062F\u0631\u0633 \u062A\u06CC\u0645 \u062F\u0631 \u0627\u062E\u062A\u06CC\u0627\u0631 \u0645\u062F\u06CC\u0631\u0627\u0646 \u0634\u0631\u06A9\u062A \u0627\u0633\u062A");
  }
  if (wantsLead && input.leadId) {
    const lead = await db.user.findUnique({
      where: { id: input.leadId },
      select: { id: true, role: true }
    });
    if (!lead) throw errors.notFound("\u0633\u0631\u067E\u0631\u0633\u062A \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
    assertCanLead(lead.role);
  }
  const data = {};
  if (input.name !== void 0) data.name = input.name.trim();
  if (input.description !== void 0) data.description = ((_a = input.description) == null ? void 0 : _a.trim()) || null;
  if (wantsSlug && input.slug) data.slug = input.slug.trim();
  if (wantsLead) data.leadId = input.leadId || null;
  const updated = await db.$transaction(async (tx) => {
    const row = await tx.team.update({ where: { id: team.id }, data });
    if (wantsLead) {
      if (team.leadId && team.leadId !== input.leadId) {
        const previous = await tx.teamMember.findFirst({
          where: { teamId: team.id, userId: team.leadId },
          select: { id: true }
        });
        if (previous) {
          await tx.teamMember.update({ where: { id: previous.id }, data: { role: "MEMBER" } });
        }
      }
      if (input.leadId) {
        const existing = await tx.teamMember.findFirst({
          where: { teamId: team.id, userId: input.leadId },
          select: { id: true }
        });
        if (existing) {
          await tx.teamMember.update({ where: { id: existing.id }, data: { role: "LEAD" } });
        } else {
          const elsewhere = await tx.teamMember.findFirst({
            where: { userId: input.leadId, teamId: { not: team.id } },
            select: { team: { select: { name: true } } }
          });
          rejectSecondMembership(elsewhere);
          await tx.teamMember.create({
            data: {
              companyId: auth.companyId,
              teamId: team.id,
              userId: input.leadId,
              role: "LEAD"
            }
          });
        }
      }
    }
    return row;
  });
  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: "team.update",
      targetType: "Team",
      targetId: team.id,
      ip: getRequestIP(event, { xForwardedFor: true }),
      data: { fields: Object.keys(input) }
    }
  });
  return teamDetail(db, updated.id);
});

const _id__patch$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__patch
}, Symbol.toStringTag, { value: 'Module' }));

const members_post = defineEventHandler(async (event) => {
  const auth = requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const input = await readValidated(event, addTeamMemberSchema);
  const db = createTenantClient(auth);
  const team = await db.team.findUnique({ where: { id }, select: { id: true } });
  if (!team) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const led = await ledTeamIds(auth);
  if (!canEditTeam(auth, team.id, led)) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  if (input.role === "LEAD" && !can(auth.role, "team:manage")) {
    throw errors.forbidden("\u062A\u0639\u06CC\u06CC\u0646 \u0633\u0631\u067E\u0631\u0633\u062A \u062A\u06CC\u0645 \u062F\u0631 \u0627\u062E\u062A\u06CC\u0627\u0631 \u0645\u062F\u06CC\u0631\u0627\u0646 \u0634\u0631\u06A9\u062A \u0627\u0633\u062A");
  }
  const user = await db.user.findUnique({
    where: { id: input.userId },
    select: { id: true, fullName: true, status: true }
  });
  if (!user) throw errors.notFound("\u06A9\u0627\u0631\u0628\u0631 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  if (user.status !== "ACTIVE") throw errors.conflict("\u0627\u06CC\u0646 \u06A9\u0627\u0631\u0628\u0631 \u0641\u0639\u0627\u0644 \u0646\u06CC\u0633\u062A");
  if (!can(auth.role, "member:manage")) {
    const managed = await getManagedUserIds(auth.companyId, auth.userId);
    if (!managed.includes(user.id) && user.id !== auth.userId) {
      throw errors.forbidden("\u0641\u0642\u0637 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0627\u0639\u0636\u0627\u06CC \u062A\u06CC\u0645 \u062E\u0648\u062F\u062A\u0627\u0646 \u0631\u0627 \u0628\u0647 \u062A\u06CC\u0645 \u0627\u0636\u0627\u0641\u0647 \u06A9\u0646\u06CC\u062F");
    }
  }
  const existing = await db.teamMember.findFirst({
    where: { userId: user.id },
    select: { id: true, teamId: true, team: { select: { name: true } } }
  });
  if ((existing == null ? void 0 : existing.teamId) === team.id) {
    throw errors.conflict("\u0627\u06CC\u0646 \u06A9\u0627\u0631\u0628\u0631 \u0639\u0636\u0648 \u0647\u0645\u06CC\u0646 \u062A\u06CC\u0645 \u0627\u0633\u062A");
  }
  rejectSecondMembership(existing);
  const managerId = input.managerId || null;
  if (managerId) {
    if (managerId === user.id) {
      throw errors.badRequest("MANAGER_SELF", "\u0645\u062F\u06CC\u0631 \u0645\u0633\u062A\u0642\u06CC\u0645 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u062E\u0648\u062F \u0641\u0631\u062F \u0628\u0627\u0634\u062F");
    }
    const inTeam = await db.teamMember.findFirst({
      where: { teamId: team.id, userId: managerId },
      select: { id: true }
    });
    if (!inTeam) throw errors.badRequest("MANAGER_NOT_IN_TEAM", "\u0645\u062F\u06CC\u0631 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0639\u0636\u0648 \u0627\u06CC\u0646 \u062A\u06CC\u0645 \u0646\u06CC\u0633\u062A");
  }
  await db.teamMember.create({
    data: {
      companyId: auth.companyId,
      teamId: team.id,
      userId: user.id,
      role: input.role,
      managerId
    }
  });
  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: "team.member_add",
      targetType: "Team",
      targetId: team.id,
      ip: getRequestIP(event, { xForwardedFor: true }),
      data: { userId: user.id, role: input.role }
    }
  });
  return teamDetail(db, team.id);
});

const members_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: members_post
}, Symbol.toStringTag, { value: 'Module' }));

const _userId__delete = defineEventHandler(async (event) => {
  const auth = requireAuth(event);
  const id = getRouterParam(event, "id");
  const userId = getRouterParam(event, "userId");
  if (!id || !userId) throw errors.notFound("\u0639\u0636\u0648 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const db = createTenantClient(auth);
  const team = await db.team.findUnique({ where: { id }, select: { id: true, leadId: true } });
  if (!team) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const led = await ledTeamIds(auth);
  if (!canEditTeam(auth, team.id, led)) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const membership = await db.teamMember.findFirst({
    where: { teamId: team.id, userId },
    select: { id: true, userId: true }
  });
  if (!membership) throw errors.notFound("\u0639\u0636\u0648 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  await db.$transaction(async (tx) => {
    if (team.leadId === membership.userId) {
      await tx.team.update({ where: { id: team.id }, data: { leadId: null } });
    }
    await tx.teamMember.updateMany({
      where: { teamId: team.id, managerId: membership.userId },
      data: { managerId: null }
    });
    await tx.teamMember.delete({ where: { id: membership.id } });
    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: "team.member_remove",
        targetType: "Team",
        targetId: team.id,
        ip: getRequestIP(event, { xForwardedFor: true }),
        data: { userId: membership.userId }
      }
    });
  });
  return teamDetail(db, team.id);
});

const _userId__delete$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _userId__delete
}, Symbol.toStringTag, { value: 'Module' }));

const _userId__patch = defineEventHandler(async (event) => {
  const auth = requireAuth(event);
  const id = getRouterParam(event, "id");
  const userId = getRouterParam(event, "userId");
  if (!id || !userId) throw errors.notFound("\u0639\u0636\u0648 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const input = await readValidated(event, updateTeamMemberSchema);
  const db = createTenantClient(auth);
  const team = await db.team.findUnique({ where: { id }, select: { id: true, leadId: true } });
  if (!team) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const led = await ledTeamIds(auth);
  if (!canEditTeam(auth, team.id, led)) throw errors.notFound("\u062A\u06CC\u0645 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  const membership = await db.teamMember.findFirst({
    where: { teamId: team.id, userId },
    select: { id: true, userId: true, role: true }
  });
  if (!membership) throw errors.notFound("\u0639\u0636\u0648 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
  if (input.role === "LEAD" && !can(auth.role, "team:manage")) {
    throw errors.forbidden("\u062A\u0639\u06CC\u06CC\u0646 \u0633\u0631\u067E\u0631\u0633\u062A \u062A\u06CC\u0645 \u062F\u0631 \u0627\u062E\u062A\u06CC\u0627\u0631 \u0645\u062F\u06CC\u0631\u0627\u0646 \u0634\u0631\u06A9\u062A \u0627\u0633\u062A");
  }
  const data = {};
  if (input.role !== void 0) data.role = input.role;
  if (input.managerId !== void 0) {
    const managerId = input.managerId || null;
    if (managerId === membership.userId) {
      throw errors.badRequest("MANAGER_SELF", "\u0645\u062F\u06CC\u0631 \u0645\u0633\u062A\u0642\u06CC\u0645 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u062E\u0648\u062F \u0641\u0631\u062F \u0628\u0627\u0634\u062F");
    }
    if (managerId) {
      const inTeam = await db.teamMember.findFirst({
        where: { teamId: team.id, userId: managerId },
        select: { id: true }
      });
      if (!inTeam) throw errors.badRequest("MANAGER_NOT_IN_TEAM", "\u0645\u062F\u06CC\u0631 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0639\u0636\u0648 \u0627\u06CC\u0646 \u062A\u06CC\u0645 \u0646\u06CC\u0633\u062A");
    }
    data.managerId = managerId;
  }
  await db.$transaction(async (tx) => {
    await tx.teamMember.update({ where: { id: membership.id }, data });
    if (input.role === "LEAD" && team.leadId !== membership.userId) {
      if (team.leadId) {
        const previous = await tx.teamMember.findFirst({
          where: { teamId: team.id, userId: team.leadId },
          select: { id: true }
        });
        if (previous) await tx.teamMember.update({ where: { id: previous.id }, data: { role: "MEMBER" } });
      }
      await tx.team.update({ where: { id: team.id }, data: { leadId: membership.userId } });
    }
    if (input.role === "MEMBER" && team.leadId === membership.userId) {
      await tx.team.update({ where: { id: team.id }, data: { leadId: null } });
    }
    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: "team.member_update",
        targetType: "Team",
        targetId: team.id,
        ip: getRequestIP(event, { xForwardedFor: true }),
        data: { userId: membership.userId, fields: Object.keys(input) }
      }
    });
  });
  return teamDetail(db, team.id);
});

const _userId__patch$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _userId__patch
}, Symbol.toStringTag, { value: 'Module' }));

const index_get = defineEventHandler(async (event) => {
  const auth = requireAuth(event);
  const db = createTenantClient(auth);
  const where = can(auth.role, "team:manage") ? {} : {
    OR: [
      { leadId: auth.userId },
      { members: { some: { userId: auth.userId } } },
      { members: { some: { managerId: auth.userId } } }
    ]
  };
  const teams = await db.team.findMany({
    where,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      lead: { select: { id: true, fullName: true, avatarUrl: true } },
      members: {
        select: {
          id: true,
          role: true,
          joinedAt: true,
          user: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true, role: true } },
          manager: { select: { id: true, fullName: true } }
        }
      },
      _count: { select: { tasks: true } }
    }
  });
  const managedUserIds = can(auth.role, "team:manage") ? null : await getManagedUserIds(auth.companyId, auth.userId);
  return {
    teams: teams.map((team) => ({
      id: team.id,
      name: team.name,
      slug: team.slug,
      description: team.description,
      lead: team.lead,
      taskCount: team._count.tasks,
      memberCount: team.members.length,
      members: team.members.map((member) => {
        var _a, _b;
        return {
          id: member.user.id,
          fullName: member.user.fullName,
          avatarUrl: member.user.avatarUrl,
          jobTitle: member.user.jobTitle,
          role: member.user.role,
          teamRole: member.role,
          managerName: (_b = (_a = member.manager) == null ? void 0 : _a.fullName) != null ? _b : null,
          joinedAt: member.joinedAt.toISOString()
        };
      })
    })),
    managedUserIds
  };
});

const index_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get
}, Symbol.toStringTag, { value: 'Module' }));

const index_post = defineEventHandler(async (event) => {
  var _a, _b;
  const auth = requirePermission(event, "team:manage");
  const input = await readValidated(event, createTeamSchema);
  const db = createTenantClient(auth);
  const requested = (((_a = input.slug) == null ? void 0 : _a.trim()) || slugify(input.name)).toLowerCase();
  if (!requested) {
    throw errors.badRequest("TEAM_SLUG_REQUIRED", "\u0646\u0627\u0645 \u062A\u06CC\u0645 \u0628\u0627\u06CC\u062F \u0634\u0627\u0645\u0644 \u062D\u0631\u0648\u0641 \u06CC\u0627 \u0627\u0639\u062F\u0627\u062F \u0628\u0627\u0634\u062F");
  }
  if (input.leadId) {
    const lead = await db.user.findUnique({
      where: { id: input.leadId },
      select: { id: true, role: true }
    });
    if (!lead) throw errors.notFound("\u0633\u0631\u067E\u0631\u0633\u062A \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
    assertCanLead(lead.role);
  }
  let slug = requested.slice(0, 60);
  for (let attempt = 1; ; attempt += 1) {
    const candidate = attempt === 1 ? slug : `${requested.slice(0, 55)}-${attempt}`;
    const clash = await db.team.findUnique({ where: { companyId_slug: { companyId: auth.companyId, slug: candidate } }, select: { id: true } });
    if (!clash) {
      slug = candidate;
      break;
    }
    if (attempt > 20) {
      throw errors.conflict("\u0646\u0627\u0645 \u062A\u06CC\u0645 \u062A\u06A9\u0631\u0627\u0631\u06CC \u0627\u0633\u062A\u061B \u0646\u0627\u0645 \u062F\u06CC\u06AF\u0631\u06CC \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F");
    }
  }
  if (input.leadId) {
    const existing = await db.teamMember.findFirst({
      where: { userId: input.leadId },
      select: { team: { select: { name: true } } }
    });
    if (existing) {
      throw errors.conflict(
        `\u0633\u0631\u067E\u0631\u0633\u062A \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0639\u0636\u0648 \u062A\u06CC\u0645 \xAB${existing.team.name}\xBB \u0627\u0633\u062A\u061B \u0627\u0628\u062A\u062F\u0627 \u0639\u0636\u0648\u06CC\u062A \u0641\u0639\u0644\u06CC \u0631\u0627 \u062A\u063A\u06CC\u06CC\u0631 \u062F\u0647\u06CC\u062F`
      );
    }
  }
  const team = await db.team.create({
    data: {
      companyId: auth.companyId,
      name: input.name.trim(),
      slug,
      description: ((_b = input.description) == null ? void 0 : _b.trim()) || null,
      leadId: input.leadId || null
    }
  });
  if (team.leadId) {
    await db.teamMember.create({
      data: {
        companyId: auth.companyId,
        teamId: team.id,
        userId: team.leadId,
        role: "LEAD"
      }
    });
  }
  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: "team.create",
      targetType: "Team",
      targetId: team.id,
      ip: getRequestIP(event, { xForwardedFor: true })
    }
  });
  return {
    team: {
      id: team.id,
      name: team.name,
      slug: team.slug,
      description: team.description,
      lead: null,
      members: [],
      createdAt: team.createdAt.toISOString()
    },
    canEdit: true,
    candidates: []
  };
});

const index_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post
}, Symbol.toStringTag, { value: 'Module' }));

//#region src/runtime/utils/renderer/payload.ts
function renderPayloadResponse(ssrContext) {
	return {
		body: encodeForwardSlashes(stringify(splitPayload(ssrContext).payload, ssrContext["~payloadReducers"])) ,
		statusCode: getResponseStatus(ssrContext.event),
		statusMessage: getResponseStatusText(ssrContext.event),
		headers: {
			"content-type": "application/json;charset=utf-8" ,
			"x-powered-by": "Nuxt"
		}
	};
}
function renderPayloadJsonScript(opts) {
	const payload = {
		"type": "application/json",
		"innerHTML": opts.data ? encodeForwardSlashes(stringify(opts.data, opts.ssrContext["~payloadReducers"])) : "",
		"data-nuxt-data": appId,
		"data-ssr": !(opts.ssrContext.noSSR)
	};
	payload.id = "__NUXT_DATA__";
	if (opts.src) payload["data-src"] = opts.src;
	const config = uneval(opts.ssrContext.config);
	return [payload, { innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}` }];
}
/**
* Encode forward slashes as unicode escape sequences to prevent
* Google from treating them as internal links and trying to crawl them.
* @see https://github.com/nuxt/nuxt/issues/24175
*/
function encodeForwardSlashes(str) {
	return str.replaceAll("/", "\\u002F");
}
function splitPayload(ssrContext) {
	const { data, prerenderedAt, prefetchLinks, ...initial } = ssrContext.payload;
	const payload = {
		data,
		prerenderedAt
	};
	if (prefetchLinks?.length) payload.prefetchLinks = prefetchLinks;
	return {
		initial: {
			...initial,
			prerenderedAt
		},
		payload
	};
}

const renderSSRHeadOptions = {"omitLineBreaks":true};

//#region src/runtime/handlers/renderer.ts
globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const PAYLOAD_FILENAME = "_payload.json" ;
const PAYLOAD_BUILD_ID_PARAM = "_b";
const handler = defineRenderHandler((event) => {
	const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
	if (ssrError && !("__unenv__" in event.node.req)) throw createError({
		status: 404,
		statusText: "Page Not Found: /__nuxt_error",
		message: "Page Not Found: /__nuxt_error"
	});
	return renderRoute(event, ssrError);
});
async function renderRoute(event, ssrError) {
	const nitroApp = useNitroApp();
	const ssrContext = createSSRContext(event);
	ssrContext.head.push(appHead);
	if (ssrError) {
		const status = ssrError.status || ssrError.statusCode;
		if (status) ssrError.status = ssrError.statusCode = Number.parseInt(status);
		if (typeof ssrError.data === "string") try {
			ssrError.data = destr(ssrError.data);
		} catch {}
		setSSRError(ssrContext, ssrError);
	}
	const routeOptions = getRouteRules(event);
	if (routeOptions.ssr === false) ssrContext.noSSR = true;
	!ssrContext.noSSR && (NUXT_RUNTIME_PAYLOAD_EXTRACTION);
	const isRenderingPayload = (routeOptions.prerender) && PAYLOAD_URL_RE.test(ssrContext.url);
	if (isRenderingPayload) {
		const payloadURL = new URL(ssrContext.url, "http://localhost");
		const url = payloadURL.pathname.slice(0, -`/${PAYLOAD_FILENAME}`.length) || "/";
		payloadURL.searchParams.delete(PAYLOAD_BUILD_ID_PARAM);
		ssrContext.url = url + payloadURL.search;
		event._path = event.node.req.url = ssrContext.url;
		getPayloadCacheKey(ssrContext.url);
	}
	const renderer = await getRenderer(ssrContext);
	const canStream = NUXT_SSR_STREAMING;
	const renderRouteContext = {
		canStream,
		prefersStream: false
	};
	await nitroApp.hooks.callHook("render:route", renderRouteContext, { event });
	const _rendered = await (renderer.renderToString(ssrContext)).catch(async (error) => {
		if ((ssrContext["~renderResponse"] || ssrContext._renderResponse) && error.message === "skipping render") return {};
		const _err = !ssrError && ssrContext.payload?.error || error;
		await ssrContext.nuxt?.hooks.callHook("app:error", _err);
		throw _err;
	});
	const inlinedStyles = [];
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult: _rendered
	});
	if (ssrContext["~renderResponse"] || ssrContext._renderResponse) return ssrContext["~renderResponse"] || ssrContext._renderResponse;
	if (ssrContext.payload?.error && !ssrError) throw ssrContext.payload.error;
	if (isRenderingPayload) {
		const response = renderPayloadResponse(ssrContext);
		return response;
	}
	const NO_SCRIPTS = routeOptions.noScripts;
	const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
	if (inlinedStyles.length) ssrContext.head.push({ style: inlinedStyles });
	const link = [];
	for (const resource of Object.values(styles)) {
		if ("inline" in getQuery(resource.file)) continue;
		link.push({
			rel: "stylesheet",
			href: renderer.rendererContext.buildAssetsURL(resource.file),
			crossorigin: ""
		});
	}
	if (link.length) ssrContext.head.push({ link });
	if (!NO_SCRIPTS) {
		const dependencyOptions = ssrContext["~lazyHydratedModules"]?.size ? { exclude: ssrContext["~lazyHydratedModules"] } : void 0;
		const excludeHrefs = new Set(link.map((l) => l.href));
		for (const id of ssrContext["~neverHydratedModules"] ?? []) {
			const file = renderer.rendererContext.manifest?.[id]?.file;
			if (file) excludeHrefs.add(renderer.rendererContext.buildAssetsURL(file));
		}
		const hints = [];
		for (const l of getPreloadLinks(ssrContext, renderer.rendererContext, dependencyOptions)) if (!excludeHrefs.has(l.href)) hints.push(l);
		for (const l of getPrefetchLinks(ssrContext, renderer.rendererContext, dependencyOptions)) if (!excludeHrefs.has(l.href)) hints.push(l);
		ssrContext.head.push({ link: hints });
		ssrContext.head.push({ script: renderPayloadJsonScript({
			ssrContext,
			data: stripInlineOnlyPayloadFields(ssrContext.payload)
		})   }, {
			tagPosition: "bodyClose",
			tagPriority: "high"
		});
	}
	if (!routeOptions.noScripts) {
		const tagPosition = "head";
		ssrContext.head.push({ script: Object.values(scripts).map((resource) => ({
			type: resource.module ? "module" : null,
			src: renderer.rendererContext.buildAssetsURL(resource.file),
			defer: resource.module ? null : true,
			tagPosition,
			crossorigin: ""
		})) });
	}
	const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = renderSSRHead(ssrContext.head, renderSSRHeadOptions);
	const htmlContext = {
		htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
		head: normalizeChunks([headTags]),
		bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
		bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
		body: [replaceIslandTeleports(ssrContext, _rendered.html) , APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG],
		bodyAppend: [bodyTags]
	};
	await nitroApp.hooks.callHook("render:html", htmlContext, { event });
	return {
		body: renderHTMLDocument(htmlContext),
		statusCode: getResponseStatus(event),
		statusMessage: getResponseStatusText(event),
		headers: {
			"content-type": "text/html;charset=utf-8",
			"x-powered-by": "Nuxt"
		}
	};
}
function getPayloadCacheKey(url) {
	const { pathname, search } = new URL(url, "http://localhost");
	return (pathname === "/" ? "/" : pathname.replace(/\/$/, "")) + (search ? encodeURIComponent(search) : "") + ".json";
}
function normalizeChunks(chunks) {
	const result = [];
	for (const _chunk of chunks) {
		const chunk = _chunk?.trim();
		if (chunk) result.push(chunk);
	}
	return result;
}
function joinTags(tags) {
	return tags.join("");
}
function joinAttrs(chunks) {
	if (chunks.length === 0) return "";
	return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
	return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}
function stripInlineOnlyPayloadFields(payload) {
	if (!payload.prefetchLinks) return payload;
	const { prefetchLinks: _, ...rest } = payload;
	return rest;
}

const renderer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handler
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
