import { o as __toESM } from "../../_runtime.mjs";
import { u as require_react } from "../@floating-ui/react-dom+[...].mjs";
import { p as isRedirect } from "./react-router+[...].mjs";
import { c as require_jsx_runtime } from "../@radix-ui/react-arrow+[...].mjs";
import { n as dehydrate, r as hydrate } from "../tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../tanstack__react-query.mjs";
//#region node_modules/.pnpm/@tanstack+react-router-with-query@1.130.17_@tanstack+react-query@5.100.10_react@19.2.4__50b97ee6e4e4d02779ba89428eb35c31/node_modules/@tanstack/react-router-with-query/dist/esm/index.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function routerWithQueryClient(router, queryClient, additionalOpts) {
	const ogOptions = router.options;
	router.options = {
		...router.options,
		context: {
			...ogOptions.context,
			queryClient
		},
		Wrap: ({ children }) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)((additionalOpts == null ? void 0 : additionalOpts.WrapProvider) || import_react.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
				client: queryClient,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ogOptions.Wrap || import_react.Fragment, { children })
			}) });
		}
	};
	if (router.isServer) {
		const queryStream = createPushableStream();
		router.options.dehydrate = async () => {
			var _a;
			const ogDehydrated = await ((_a = ogOptions.dehydrate) == null ? void 0 : _a.call(ogOptions));
			const dehydratedQueryClient = dehydrate(queryClient);
			router.serverSsr.onRenderFinished(() => queryStream.close());
			return {
				...ogDehydrated,
				dehydratedQueryClient,
				queryStream: queryStream.stream
			};
		};
		const ogClientOptions = queryClient.getDefaultOptions();
		queryClient.setDefaultOptions({
			...ogClientOptions,
			dehydrate: {
				shouldDehydrateQuery: () => true,
				...ogClientOptions.dehydrate
			}
		});
		queryClient.getQueryCache().subscribe((event) => {
			if (event.type === "added") {
				if (!router.serverSsr.isDehydrated()) return;
				if (queryStream.isClosed()) {
					console.warn(`tried to stream query ${event.query.queryHash} after stream was already closed`);
					return;
				}
				queryStream.enqueue(dehydrate(queryClient, { shouldDehydrateQuery: (query) => {
					var _a, _b;
					if (query.queryHash === event.query.queryHash) return ((_b = (_a = ogClientOptions.dehydrate) == null ? void 0 : _a.shouldDehydrateQuery) == null ? void 0 : _b.call(_a, query)) ?? true;
					return false;
				} }));
			}
		});
	} else {
		router.options.hydrate = async (dehydrated) => {
			var _a;
			await ((_a = ogOptions.hydrate) == null ? void 0 : _a.call(ogOptions, dehydrated));
			hydrate(queryClient, dehydrated.dehydratedQueryClient);
			const reader = dehydrated.queryStream.getReader();
			reader.read().then(async function handle({ done, value }) {
				hydrate(queryClient, value);
				if (done) return;
				return handle(await reader.read());
			}).catch((err) => {
				console.error("Error reading query stream:", err);
			});
		};
		if ((additionalOpts == null ? void 0 : additionalOpts.handleRedirects) ?? true) {
			const ogMutationCacheConfig = queryClient.getMutationCache().config;
			queryClient.getMutationCache().config = {
				...ogMutationCacheConfig,
				onError: (error, _variables, _context, _mutation) => {
					var _a;
					if (isRedirect(error)) {
						error.options._fromLocation = router.state.location;
						return router.navigate(router.resolveRedirect(error).options);
					}
					return (_a = ogMutationCacheConfig.onError) == null ? void 0 : _a.call(ogMutationCacheConfig, error, _variables, _context, _mutation);
				}
			};
			const ogQueryCacheConfig = queryClient.getQueryCache().config;
			queryClient.getQueryCache().config = {
				...ogQueryCacheConfig,
				onError: (error, _query) => {
					var _a;
					if (isRedirect(error)) {
						error.options._fromLocation = router.state.location;
						return router.navigate(router.resolveRedirect(error).options);
					}
					return (_a = ogQueryCacheConfig.onError) == null ? void 0 : _a.call(ogQueryCacheConfig, error, _query);
				}
			};
		}
	}
	return router;
}
function createPushableStream() {
	let controllerRef;
	const stream = new ReadableStream({ start(controller) {
		controllerRef = controller;
	} });
	let _isClosed = false;
	return {
		stream,
		enqueue: (chunk) => controllerRef.enqueue(chunk),
		close: () => {
			controllerRef.close();
			_isClosed = true;
		},
		isClosed: () => _isClosed,
		error: (err) => controllerRef.error(err)
	};
}
//#endregion
export { routerWithQueryClient as t };
