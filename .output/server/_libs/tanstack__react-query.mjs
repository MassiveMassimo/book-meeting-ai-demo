import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./@radix-ui/react-arrow+[...].mjs";
//#region node_modules/.pnpm/@tanstack+react-query@5.100.10_react@19.2.4/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var QueryClientContext = import_react.createContext(void 0);
var QueryClientProvider = ({ client, children }) => {
	import_react.useEffect(() => {
		client.mount();
		return () => {
			client.unmount();
		};
	}, [client]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientContext.Provider, {
		value: client,
		children
	});
};
//#endregion
//#region node_modules/.pnpm/@tanstack+react-query@5.100.10_react@19.2.4/node_modules/@tanstack/react-query/build/modern/queryOptions.js
function queryOptions(options) {
	return options;
}
//#endregion
export { QueryClientProvider as n, queryOptions as t };
