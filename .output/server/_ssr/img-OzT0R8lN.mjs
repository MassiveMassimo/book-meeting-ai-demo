import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/img-OzT0R8lN.js
var import_jsx_runtime = require_jsx_runtime();
function Img({ priority, loading, decoding, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		loading: loading ?? (priority ? "eager" : "lazy"),
		decoding: decoding ?? "async",
		fetchPriority: priority ? "high" : void 0,
		...rest
	});
}
//#endregion
export { Img as t };
