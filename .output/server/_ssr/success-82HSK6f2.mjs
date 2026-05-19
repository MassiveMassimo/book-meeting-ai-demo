import { o as __toESM } from "../_runtime.mjs";
import { n as dict } from "./utils-CQ9QLPNX.mjs";
import { r as parseISO } from "../_libs/date-fns.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { u as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-BFsbexGs.mjs";
import { t as formatPlatformName } from "./platform-BRTBg_vT.mjs";
import { _ as Calendar, c as Globe, d as CircleX, g as CheckCheck, h as Check, l as Copy, n as User, o as MapPin, t as Video, y as CalendarPlus } from "../_libs/lucide-react.mjs";
import { t as Route } from "./success-Dzq0RVgD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/success-82HSK6f2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuccessContent({ dict }) {
	const { date: dateParam, time: timeParam, type: eventTypeId, title: eventTitle, name, timezone: timezoneParam, hostName, username, integration, location, action, bookingId } = Route.useSearch();
	const [copied, setCopied] = (0, import_react.useState)(false);
	const eventType = eventTypeId ? {
		id: eventTypeId,
		title: eventTitle || eventTypeId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
		duration: 30,
		description: "",
		color: "bg-blue-500",
		integration: integration || "in_person",
		location: location || ""
	} : null;
	if (!dateParam || !timeParam || !eventType) return null;
	const date = parseISO(dateParam);
	const formattedDate = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	}).format(date);
	const displayPlatformName = formatPlatformName(eventType.integration, dict.platforms);
	const meetingInfo = `📅 ${eventType.title}
👤 ${name || dict.booking_form.guest}
🕐 ${timeParam} - ${formattedDate}${timezoneParam ? `\n🌍 ${timezoneParam.replace(/_/g, " ")}` : ""}
📹 ${displayPlatformName}${eventType.integration === "in_person" && eventType.location ? `\n📍 ${eventType.location}` : ""}${hostName ? `\n\n${dict.success.scheduled_with.replace("{hostName}", hostName)}` : `\n\n${dict.success.scheduled_via}`}`;
	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(meetingInfo);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const isCancelled = action === "cancelled";
	const isRescheduled = action === "rescheduled";
	const title = isCancelled ? dict.success.title_cancelled : isRescheduled ? dict.success.title_rescheduled : dict.success.title;
	const subtitle = isCancelled ? dict.success.subtitle_cancelled : isRescheduled ? dict.success.subtitle_rescheduled : dict.success.subtitle;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!isCancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "confetti-container",
		children: Array.from({ length: 20 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "confetti" }, i))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex w-full grow overflow-visible xl:h-full xl:min-h-0 xl:overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-screen-sm rounded-2xl p-8 text-center md:p-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "success-icon-animate mb-6 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `rounded-full p-4 shadow-sm ${isCancelled ? "bg-destructive/10" : "bg-accent"}`,
						children: isCancelled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, {
							className: "text-destructive size-10",
							strokeWidth: 3
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "text-primary size-10",
							strokeWidth: 3
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-foreground animate-in fade-in slide-in-from-bottom-4 fill-mode-both mb-2 text-2xl font-bold delay-150 duration-1000",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground animate-in fade-in slide-in-from-bottom-4 fill-mode-both mb-8 text-sm delay-300 duration-1000",
					children: subtitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-border animate-in fade-in slide-in-from-bottom-4 fill-mode-both mb-8 border-t border-b py-6 delay-500 duration-1000",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: `text-foreground mb-4 text-base font-bold ${isCancelled ? "line-through decoration-inherit" : ""}`,
						children: eventType.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `space-y-3 text-sm ${isCancelled ? "line-through decoration-inherit" : ""}`,
						children: [
							!isCancelled && !isRescheduled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "text-muted-foreground mr-2.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: name || dict.booking_form.guest })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "text-muted-foreground mr-2.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									timeParam,
									" · ",
									formattedDate
								] })]
							}),
							timezoneParam && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "text-muted-foreground mr-2.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: timezoneParam.replace(/_/g, " ") })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "text-muted-foreground mr-2.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: displayPlatformName })]
							}),
							eventType.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "text-muted-foreground mr-2.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: eventType.location })]
							})
						]
					})]
				}),
				!isCancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-in fade-in slide-in-from-bottom-4 fill-mode-both space-y-3 delay-700 duration-1000",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: copyToClipboard,
							variant: copied ? "secondary" : "outline",
							className: "w-full gap-2 rounded-xl font-semibold shadow-sm",
							children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "size-4" }), dict.success.copied] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), dict.success.copy] })
						}),
						bookingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "w-full gap-2 rounded-xl font-semibold shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `/reschedulings/${bookingId}`,
								children: "Reschedule"
							})
						}),
						bookingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "w-full gap-2 rounded-xl font-semibold shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `/cancellations/${bookingId}`,
								children: "Cancel"
							})
						}),
						username ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "w-full gap-2 rounded-xl font-semibold shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/$username",
								params: { username },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-4" }), "Book another meeting"]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "w-full gap-2 rounded-xl font-semibold shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-4" }), "Book another meeting"]
							})
						})
					]
				})
			]
		})
	})] });
}
function SuccessPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuccessContent, { dict });
}
//#endregion
export { SuccessPage as component };
