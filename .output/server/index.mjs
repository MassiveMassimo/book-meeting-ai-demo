globalThis.__nitro_main__ = import.meta.url;
import { a as toEventHandler, c as serve, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, s as NodeResponse, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import "./_libs/hookable.mjs";
import { t as getContext } from "./_libs/unctx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import "node:async_hooks";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
getContext("nitro-app", {
	asyncContext: void 0,
	AsyncLocalStorage: void 0
});
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260429-beta_dotenv@17.2.3_jiti@2.7.0_vite@8.0.13_@types+node@22.19.7_jiti@2.7.0_/node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260429-beta_dotenv@17.2.3_jiti@2.7.0_vite@8.0.13_@types+node@22.19.7_jiti@2.7.0_/node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.svg": {
		"type": "image/svg+xml",
		"etag": "\"1c2e-rAV2EyHDnKY3rgeFxnoa/jz1HJ0\"",
		"mtime": "2026-05-18T10:23:11.541Z",
		"size": 7214,
		"path": "../public/favicon.svg"
	},
	"/file.svg": {
		"type": "image/svg+xml",
		"etag": "\"187-+zgO7/6H1QtZc4NmTAKYKWTQ0ow\"",
		"mtime": "2026-05-18T10:23:11.541Z",
		"size": 391,
		"path": "../public/file.svg"
	},
	"/globe.svg": {
		"type": "image/svg+xml",
		"etag": "\"40b-LrojsBpGczu4Qj5tOOv19+lavsU\"",
		"mtime": "2026-05-18T10:23:11.541Z",
		"size": 1035,
		"path": "../public/globe.svg"
	},
	"/meeting.ai-logo-black.svg": {
		"type": "image/svg+xml",
		"etag": "\"2b12-uRwPUXHi3Hz7GPcmOLlKgBlGcb8\"",
		"mtime": "2026-05-18T10:23:11.541Z",
		"size": 11026,
		"path": "../public/meeting.ai-logo-black.svg"
	},
	"/icon.svg": {
		"type": "image/svg+xml",
		"etag": "\"1c2e-rAV2EyHDnKY3rgeFxnoa/jz1HJ0\"",
		"mtime": "2026-05-18T10:23:11.541Z",
		"size": 7214,
		"path": "../public/icon.svg"
	},
	"/meeting.ai-logo-white.svg": {
		"type": "image/svg+xml",
		"etag": "\"2c66-U5W52M0PBXFX1+wqcN/5ZCdKX/I\"",
		"mtime": "2026-05-18T10:23:11.541Z",
		"size": 11366,
		"path": "../public/meeting.ai-logo-white.svg"
	},
	"/vercel.svg": {
		"type": "image/svg+xml",
		"etag": "\"80-zruIUtWMiIa+PpBRomlX9Cu4Lxo\"",
		"mtime": "2026-05-18T10:23:11.542Z",
		"size": 128,
		"path": "../public/vercel.svg"
	},
	"/window.svg": {
		"type": "image/svg+xml",
		"etag": "\"181-VMSODapsqjF/4bTEGQB/2T6Ujbk\"",
		"mtime": "2026-05-18T10:23:11.542Z",
		"size": 385,
		"path": "../public/window.svg"
	},
	"/next.svg": {
		"type": "image/svg+xml",
		"etag": "\"55f-Pz6VYiYSuYnFvWoDKZowjG88fms\"",
		"mtime": "2026-05-18T10:23:11.541Z",
		"size": 1375,
		"path": "../public/next.svg"
	},
	"/bg/og-hills.jpg": {
		"type": "image/jpeg",
		"etag": "\"a81b-iKNJtjD29+ZlWPhpnC2GeJlsHTs\"",
		"mtime": "2026-05-18T10:23:11.538Z",
		"size": 43035,
		"path": "../public/bg/og-hills.jpg"
	},
	"/bg/doodle.svg": {
		"type": "image/svg+xml",
		"etag": "\"43ddb-PmnF6m2V6jitjKevmuhMxTnCvOc\"",
		"mtime": "2026-05-18T10:23:11.538Z",
		"size": 277979,
		"path": "../public/bg/doodle.svg"
	},
	"/assets/_bookingId-BVq6qASh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e72-kvmn2EBfrpriDl00zElAElhSnZ0\"",
		"mtime": "2026-05-18T10:23:11.317Z",
		"size": 15986,
		"path": "../public/assets/_bookingId-BVq6qASh.js"
	},
	"/assets/_bookingId-CgsNGFWR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ac7-6vSg9cku9CjfvdBjxOvmdyT9LNo\"",
		"mtime": "2026-05-18T10:23:11.318Z",
		"size": 6855,
		"path": "../public/assets/_bookingId-CgsNGFWR.js"
	},
	"/assets/TimezoneSelector-DWSYXj-7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"265f1-0d6d+TAmnxXTtvhwl2eFPE57NoE\"",
		"mtime": "2026-05-18T10:23:11.317Z",
		"size": 157169,
		"path": "../public/assets/TimezoneSelector-DWSYXj-7.js"
	},
	"/assets/_eventType-BV2ME68D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22f1-I1s1cjdV5dMde+fDhNVYT8PAoFs\"",
		"mtime": "2026-05-18T10:23:11.318Z",
		"size": 8945,
		"path": "../public/assets/_eventType-BV2ME68D.js"
	},
	"/assets/_username-CK4RpXhI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e56-QSmfYigOz6/w3m68JlyC8wdeUDA\"",
		"mtime": "2026-05-18T10:23:11.318Z",
		"size": 7766,
		"path": "../public/assets/_username-CK4RpXhI.js"
	},
	"/assets/api-client-C50GxOdv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c58-8jmjzZx2HHM3Go8B19JfzjE3iWY\"",
		"mtime": "2026-05-18T10:23:11.318Z",
		"size": 3160,
		"path": "../public/assets/api-client-C50GxOdv.js"
	},
	"/assets/arrow-left-D9eM80Ey.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-CYcuK3lug1B0bCHY/90aPZDbJvI\"",
		"mtime": "2026-05-18T10:23:11.318Z",
		"size": 155,
		"path": "../public/assets/arrow-left-D9eM80Ey.js"
	},
	"/assets/book-CuuptM8t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2752-haicFgGqbIH+BQu5HRXsUiwDVLQ\"",
		"mtime": "2026-05-18T10:23:11.318Z",
		"size": 10066,
		"path": "../public/assets/book-CuuptM8t.js"
	},
	"/assets/button-D0rlrG8a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14f3-NtWhxPpmri/htTZK/zuMsaBJ6U8\"",
		"mtime": "2026-05-18T10:23:11.318Z",
		"size": 5363,
		"path": "../public/assets/button-D0rlrG8a.js"
	},
	"/assets/calendar-x-ByxZ5oqu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c7-dn/fkfqmX7XpoGJZ7VNIVs5KSJk\"",
		"mtime": "2026-05-18T10:23:11.318Z",
		"size": 455,
		"path": "../public/assets/calendar-x-ByxZ5oqu.js"
	},
	"/background-portrait.jpeg": {
		"type": "image/jpeg",
		"etag": "\"a9b99-7+YlGI0Z5MyOppFFjQFblJS2E3c\"",
		"mtime": "2026-05-18T10:23:11.541Z",
		"size": 695193,
		"path": "../public/background-portrait.jpeg"
	},
	"/background-landscape.jpeg": {
		"type": "image/jpeg",
		"etag": "\"d716a-btNakJfrvuwLAtUyz/v507894fM\"",
		"mtime": "2026-05-18T10:23:11.541Z",
		"size": 881002,
		"path": "../public/background-landscape.jpeg"
	},
	"/assets/check-C4jKjXMf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72-OrRRp/PZQ1otQ7q2+g8+tQyWjIc\"",
		"mtime": "2026-05-18T10:23:11.318Z",
		"size": 114,
		"path": "../public/assets/check-C4jKjXMf.js"
	},
	"/assets/clock-Co9p1YBv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f-/jR3jgd+H23jqbkvIx0IKQbR82I\"",
		"mtime": "2026-05-18T10:23:11.318Z",
		"size": 159,
		"path": "../public/assets/clock-Co9p1YBv.js"
	},
	"/assets/dist-CyYVsZrw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6e0f-i9p3cHMRhYveB1CcJ/iAaAOuS+s\"",
		"mtime": "2026-05-18T10:23:11.319Z",
		"size": 28175,
		"path": "../public/assets/dist-CyYVsZrw.js"
	},
	"/assets/img-DJz0KgOO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e2-X4Gi3KTK9sTiirTsUqgPide8Dy4\"",
		"mtime": "2026-05-18T10:23:11.319Z",
		"size": 226,
		"path": "../public/assets/img-DJz0KgOO.js"
	},
	"/assets/index-zaQG1mQc.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"e16-0PXmzB3ZQq1Jin5l9EGgDN0PsvE\"",
		"mtime": "2026-05-18T10:23:11.319Z",
		"size": 3606,
		"path": "../public/assets/index-zaQG1mQc.css"
	},
	"/assets/map-pin-DXTcSZj2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f9-ci87DrOjyLV9uBV/bK2X7sJZ2DE\"",
		"mtime": "2026-05-18T10:23:11.319Z",
		"size": 249,
		"path": "../public/assets/map-pin-DXTcSZj2.js"
	},
	"/assets/parseISO-D0sYJ0b2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a3f-eoYyAN59mxFqM2EsK50Awd8rQDc\"",
		"mtime": "2026-05-18T10:23:11.319Z",
		"size": 2623,
		"path": "../public/assets/parseISO-D0sYJ0b2.js"
	},
	"/assets/platform-CuKqCcoZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103-b2BWS1azCQ19/BJEivyFve5OKQg\"",
		"mtime": "2026-05-18T10:23:11.319Z",
		"size": 259,
		"path": "../public/assets/platform-CuKqCcoZ.js"
	},
	"/assets/plus-jakarta-sans-latin-ext-wght-normal-DmpS2jIq.woff2": {
		"type": "font/woff2",
		"etag": "\"54e0-QvPpAYEn4Ol5O2FiDUNqprR4Zyg\"",
		"mtime": "2026-05-18T10:23:11.319Z",
		"size": 21728,
		"path": "../public/assets/plus-jakarta-sans-latin-ext-wght-normal-DmpS2jIq.woff2"
	},
	"/assets/plus-jakarta-sans-vietnamese-wght-normal-qRpaaN48.woff2": {
		"type": "font/woff2",
		"etag": "\"20a0-C/LCoE0Ze4d2+M75EzjTyDMuymc\"",
		"mtime": "2026-05-18T10:23:11.320Z",
		"size": 8352,
		"path": "../public/assets/plus-jakarta-sans-vietnamese-wght-normal-qRpaaN48.woff2"
	},
	"/assets/proxy-9YvC7Pa2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1be9d-nf0jxatO4wp1fkSEL7/rR5xlr4M\"",
		"mtime": "2026-05-18T10:23:11.319Z",
		"size": 114333,
		"path": "../public/assets/proxy-9YvC7Pa2.js"
	},
	"/assets/plus-jakarta-sans-latin-wght-normal-eXO_dkmS.woff2": {
		"type": "font/woff2",
		"etag": "\"6ad4-o4nZfeWAotajcjESI0vSs4Oc4Ns\"",
		"mtime": "2026-05-18T10:23:11.320Z",
		"size": 27348,
		"path": "../public/assets/plus-jakarta-sans-latin-wght-normal-eXO_dkmS.woff2"
	},
	"/assets/routes-wsQ_1PK5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2608-Hekw+q4gavqvdHZEiK7LiX0kkx0\"",
		"mtime": "2026-05-18T10:23:11.319Z",
		"size": 9736,
		"path": "../public/assets/routes-wsQ_1PK5.js"
	},
	"/assets/styles-J5chrJN8.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1343a-YGQmppg5/yKh8EbhcYqA/pyC4HY\"",
		"mtime": "2026-05-18T10:23:11.320Z",
		"size": 78906,
		"path": "../public/assets/styles-J5chrJN8.css"
	},
	"/assets/success-DlMxIJKa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17fd-3enmzJ3CHTeIiXFqK/FVKoX2Jws\"",
		"mtime": "2026-05-18T10:23:11.319Z",
		"size": 6141,
		"path": "../public/assets/success-DlMxIJKa.js"
	},
	"/bg/hills-dark.png": {
		"type": "image/png",
		"etag": "\"1e6b8f-TCMntfOHM33HriKIBAXZglGgeY4\"",
		"mtime": "2026-05-18T10:23:11.540Z",
		"size": 1993615,
		"path": "../public/bg/hills-dark.png"
	},
	"/assets/use-available-slots-CMFFb6i9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4bdb-ggM0t0zIlOiQ66a84vFXIO2hNlg\"",
		"mtime": "2026-05-18T10:23:11.319Z",
		"size": 19419,
		"path": "../public/assets/use-available-slots-CMFFb6i9.js"
	},
	"/assets/video-C9roeipY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26d-XH0YFIiJaccf5xJUGEmnCuMAjnU\"",
		"mtime": "2026-05-18T10:23:11.319Z",
		"size": 621,
		"path": "../public/assets/video-C9roeipY.js"
	},
	"/assets/index-D5bL16Np.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"765d2-8YN03C+g5e0jGrKLCtwgK3i7iUE\"",
		"mtime": "2026-05-18T10:23:11.316Z",
		"size": 484818,
		"path": "../public/assets/index-D5bL16Np.js"
	},
	"/bg/hills-light.png": {
		"type": "image/png",
		"etag": "\"2a5515-LY4N2hDz+Rh/C7QfRtKSu16Rb8s\"",
		"mtime": "2026-05-18T10:23:11.543Z",
		"size": 2774293,
		"path": "../public/bg/hills-light.png"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260429-beta_dotenv@17.2.3_jiti@2.7.0_vite@8.0.13_@types+node@22.19.7_jiti@2.7.0_/node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_sf_cMk = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_sf_cMk
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260429-beta_dotenv@17.2.3_jiti@2.7.0_vite@8.0.13_@types+node@22.19.7_jiti@2.7.0_/node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function createNitroApp() {
	const hooks = void 0;
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		{
			const routeRules = getRouteRules(method, pathname);
			event.context.routeRules = routeRules?.routeRules;
			if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		}
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260429-beta_dotenv@17.2.3_jiti@2.7.0_vite@8.0.13_@types+node@22.19.7_jiti@2.7.0_/node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260429-beta_dotenv@17.2.3_jiti@2.7.0_vite@8.0.13_@types+node@22.19.7_jiti@2.7.0_/node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
