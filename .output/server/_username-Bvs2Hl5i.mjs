import { o as __toESM } from "./_runtime.mjs";
import { n as dict, r as formatDuration, t as cn } from "./_ssr/utils-CQ9QLPNX.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { d as useSearch, f as useRouter, u as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BFsbexGs.mjs";
import { f as ChevronRight } from "./_libs/lucide-react.mjs";
import { n as motion, t as useAnimation } from "./_libs/framer-motion.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as Img } from "./_ssr/img-OzT0R8lN.mjs";
import { t as Route } from "./_username-CJv5SKpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_username-Bvs2Hl5i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var handTransition = {
	duration: .6,
	ease: [
		.4,
		0,
		.2,
		1
	]
};
var handVariants = {
	normal: {
		rotate: 0,
		originX: "0%",
		originY: "100%"
	},
	animate: {
		rotate: 360,
		originX: "0%",
		originY: "100%"
	}
};
var minuteHandTransition = {
	duration: .5,
	ease: "easeInOut"
};
var minuteHandVariants = {
	normal: {
		rotate: 0,
		originX: "0%",
		originY: "100%"
	},
	animate: {
		rotate: 45,
		originX: "0%",
		originY: "100%"
	}
};
var ClockIcon = (0, import_react.forwardRef)(({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
	const controls = useAnimation();
	const isControlledRef = (0, import_react.useRef)(false);
	(0, import_react.useImperativeHandle)(ref, () => {
		isControlledRef.current = true;
		return {
			startAnimation: () => controls.start("animate"),
			stopAnimation: () => controls.start("normal")
		};
	});
	const handleMouseEnter = (0, import_react.useCallback)((e) => {
		if (!isControlledRef.current) controls.start("animate");
		else onMouseEnter?.(e);
	}, [controls, onMouseEnter]);
	const handleMouseLeave = (0, import_react.useCallback)((e) => {
		if (!isControlledRef.current) controls.start("normal");
		else onMouseLeave?.(e);
	}, [controls, onMouseLeave]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(className),
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			width: size,
			height: size,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.line, {
					x1: "12",
					y1: "12",
					x2: "12",
					y2: "6",
					variants: handVariants,
					animate: controls,
					initial: "normal",
					transition: handTransition
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.line, {
					x1: "12",
					y1: "12",
					x2: "16",
					y2: "12",
					variants: minuteHandVariants,
					animate: controls,
					initial: "normal",
					transition: minuteHandTransition
				})
			]
		})
	});
});
ClockIcon.displayName = "ClockIcon";
function EventCard({ event, username, hasMoreThanThree = false, isInLastRow = false, dict, delay = 0 }) {
	const clockRef = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		variant: "ghost",
		className: cn("hover:bg-muted group border-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both relative flex h-auto flex-col items-start justify-start rounded-none border-r p-4 px-5! duration-1000 last:border-r md:h-full md:w-1/3 md:p-8", hasMoreThanThree && !isInLastRow && "md:border-b", hasMoreThanThree && "md:h-[240px]", delay > 0 && `delay-[${delay}ms]`),
		onMouseEnter: () => clockRef.current?.startAnimation(),
		onMouseLeave: () => clockRef.current?.stopAnimation(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/$username/$eventType",
			params: {
				username: username ?? "",
				eventType: event.id
			},
			className: "relative flex h-full w-full flex-col justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("mb-2.5 size-2.5 rounded-full md:mb-6 md:size-3", event.color) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-foreground group-hover:text-brand mb-1.5 line-clamp-2 w-full text-base font-bold transition-colors md:mb-2 md:text-lg",
					children: event.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-muted-foreground mb-3 flex items-center text-xs font-medium md:mb-4 md:text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClockIcon, {
						ref: clockRef,
						size: 14,
						className: "mr-1.5 shrink-0 md:mr-2"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDuration(event.duration, dict.booking_form) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-brand hidden grow translate-y-0 transform items-end text-xs font-semibold opacity-100 transition duration-300 group-hover:opacity-100 md:flex md:translate-y-2 md:text-sm md:opacity-0 md:group-hover:translate-y-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dict.user_page.book_now }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-1 size-3.5 md:size-4" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "text-brand absolute top-1/2 right-4 size-4 -translate-y-1/2 opacity-100 transition duration-300 md:hidden" })
			]
		})
	});
}
function EventCardSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "presentation",
		className: "border-border/50 relative flex h-auto flex-col items-start justify-start rounded-none border-r p-4 opacity-70 last:border-r md:h-full md:w-1/3 md:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-muted mb-2.5 size-2.5 rounded-full md:mb-6 md:size-3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-muted/70 mb-1.5 h-5 w-3/4 rounded md:mb-2 md:h-6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2 md:mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-muted/60 size-4 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-muted/60 h-3 w-16 rounded" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-brand bg-muted/50 hidden h-4 w-24 rounded md:mt-auto md:flex" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-muted/40 absolute top-1/2 right-4 size-4 -translate-y-1/2 rounded-full md:hidden" })
		]
	});
}
function ToastListenerContent() {
	const { error } = useSearch({ strict: false });
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		if (error === "event_not_found") {
			toast.error("Event type not found");
			router.navigate({
				search: (prev) => {
					const next = { ...prev };
					delete next["error"];
					return next;
				},
				replace: true
			});
		}
	}, [error, router]);
	return null;
}
function ToastListener() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastListenerContent, {});
}
function mapAppointmentToEventType(appointment) {
	return {
		id: appointment.slug,
		title: appointment.title,
		duration: appointment.duration_minutes,
		description: appointment.description || "",
		integration: appointment.integration,
		location: appointment.location,
		color: "bg-blue-500"
	};
}
function UserPage() {
	const { username } = Route.useParams();
	const { appointments, profile: apiProfile } = Route.useLoaderData();
	const eventTypes = appointments.map(mapAppointmentToEventType);
	const isUsernameNotFound = !apiProfile && appointments.length === 0;
	const profile = apiProfile || {
		name: username,
		image: ""
	};
	if (isUsernameNotFound) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex grow flex-col items-center justify-center px-6 py-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground mb-4 text-4xl",
				children: "🔍"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-foreground mb-2 text-xl font-bold md:text-2xl",
				children: dict.user_page.not_found
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground max-w-md text-sm leading-relaxed md:text-base",
				children: dict.user_page.not_found_desc.replace("{username}", username)
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastListener, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col xl:h-full xl:min-h-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("border-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both flex flex-col items-center border-b px-3 py-8 text-center duration-1000 md:p-10"),
			children: [
				profile.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mb-4 flex size-20 items-center justify-center overflow-hidden rounded-full text-2xl font-bold md:mb-5 md:size-24 md:text-3xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
						src: profile.image,
						alt: profile.name,
						className: "absolute inset-0 h-full w-full object-cover"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-foreground mb-2 text-xl font-bold md:text-2xl",
					children: profile.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground max-w-lg px-4 text-sm leading-relaxed text-balance md:text-base",
					children: dict.user_page.welcome
				})
			]
		}), eventTypes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grow overflow-visible xl:min-h-0 xl:overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-border/50 flex flex-col items-stretch divide-y md:flex-row md:flex-wrap md:divide-x md:divide-y-0",
				children: eventTypes.map((event, index) => {
					const itemsPerRow = 3;
					const isInLastRow = index >= (Math.ceil(eventTypes.length / itemsPerRow) - 1) * itemsPerRow;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCard, {
						event,
						username,
						hasMoreThanThree: eventTypes.length > 3,
						isInLastRow,
						dict,
						delay: 150 + index * 100
					}, event.id);
				})
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex grow flex-col overflow-visible xl:min-h-0 xl:overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-sm font-medium md:text-base",
				children: dict.user_page.no_events.replace("{name}", profile.name)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-border/50 flex flex-col items-stretch divide-y md:flex-row md:flex-wrap md:divide-x md:divide-y-0",
				children: Array.from({ length: 3 }).map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCardSkeleton, {}, idx))
			})]
		})]
	})] });
}
//#endregion
export { UserPage as component };
