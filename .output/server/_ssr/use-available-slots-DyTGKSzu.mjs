import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-CQ9QLPNX.mjs";
import { t as fromZonedTime } from "../_libs/date-fns-tz.mjs";
import { s as generateMockSlotsRaw, t as MOCK_EVENTS } from "./api-helpers-DDaAbPUv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-available-slots-DyTGKSzu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
		ref,
		"data-slot": "scroll-area",
		className: cn("relative", className),
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
				"data-slot": "scroll-area-viewport",
				className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
		]
	});
});
ScrollArea.displayName = "ScrollArea";
function ScrollBar({ className, orientation = "vertical", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
		"data-slot": "scroll-area-scrollbar",
		orientation,
		className: cn("flex touch-none p-px transition-colors select-none", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, {
			"data-slot": "scroll-area-thumb",
			className: "bg-border relative grow rounded-full"
		})
	});
}
function transformSlots(data, timezone) {
	const slots = [];
	const isDataValid = (d) => {
		return !!(d && typeof d === "object" && "days" in d && Array.isArray(d.days));
	};
	if (isDataValid(data)) {
		const responseTimezone = typeof data.timezone === "string" && data.timezone || timezone || "UTC";
		for (const day of data.days) {
			const { date, slots: daySlots = [] } = day;
			for (const slot of daySlots) try {
				slots.push({
					start: fromZonedTime(`${date}T${slot.start}:00`, responseTimezone).toISOString(),
					end: fromZonedTime(`${date}T${slot.end}:00`, responseTimezone).toISOString(),
					available: slot.available !== false,
					timezone: responseTimezone
				});
			} catch {}
		}
	}
	return slots;
}
function useAvailableSlots(username, eventTypeId, startDate, endDate, timezone) {
	const [slots, setSlots] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const rawRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!username || !eventTypeId || !startDate || !endDate || !timezone) {
			rawRef.current = null;
			setSlots([]);
			setIsLoading(false);
			return;
		}
		if (username !== "imo") {
			rawRef.current = null;
			setSlots([]);
			setIsLoading(false);
			return;
		}
		const event = MOCK_EVENTS.find((e) => e.slug === eventTypeId);
		if (!event) {
			rawRef.current = null;
			setSlots([]);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		const timer = setTimeout(() => {
			const raw = generateMockSlotsRaw(event.duration_minutes, startDate, endDate);
			rawRef.current = raw;
			setSlots(transformSlots(raw, timezone));
			setIsLoading(false);
		}, 150);
		return () => clearTimeout(timer);
	}, [
		username,
		eventTypeId,
		startDate,
		endDate,
		timezone
	]);
	return {
		slots,
		isLoading,
		isValidating: false,
		error: null,
		mutate: async () => rawRef.current ?? void 0
	};
}
//#endregion
export { transformSlots as n, useAvailableSlots as r, ScrollArea as t };
