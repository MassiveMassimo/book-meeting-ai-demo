import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-CQ9QLPNX.mjs";
import { a as isBefore, c as format, d as endOfMonth, f as isSameDay, l as startOfMonth, m as addMonths, n as startOfToday, s as getDay, t as subMonths, u as eachDayOfInterval } from "../_libs/date-fns.mjs";
import { n as formatInTimeZone } from "../_libs/date-fns-tz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-BFsbexGs.mjs";
import { t as ScrollArea } from "./use-available-slots-DyTGKSzu.mjs";
import { c as Globe, f as ChevronRight, h as Check, i as Search, m as ChevronDown, p as ChevronLeft } from "../_libs/lucide-react.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
import { a as Root3, i as Provider, n as Content2$1, o as Trigger$1, r as Portal$1, t as Arrow2 } from "../_libs/@radix-ui/react-tooltip+[...].mjs";
import { n as motion } from "../_libs/framer-motion.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
import { t as getTimezone } from "../_libs/countries-and-timezones.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TimezoneSelector-DkqmkcuJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TooltipProvider({ delayDuration = 0, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		"data-slot": "tooltip-provider",
		delayDuration,
		...props
	});
}
function Tooltip({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root3, {
		"data-slot": "tooltip",
		...props
	}) });
}
function TooltipTrigger({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$1, {
		"data-slot": "tooltip-trigger",
		...props
	});
}
function TooltipContent({ className, sideOffset = 0, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$1, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content2$1, {
		"data-slot": "tooltip-content",
		sideOffset,
		className: cn("bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow2, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })]
	}) });
}
function Calendar$1({ selectedDate, onSelectDate, unavailableDays = [], unavailableDates = [], fullyBookedDates = [], onMonthChange, dict }) {
	const [currentMonth, setCurrentMonth] = (0, import_react.useState)(startOfToday());
	const today = startOfToday();
	const handleMonthChange = (newMonth) => {
		setCurrentMonth(newMonth);
		onMonthChange?.(newMonth);
	};
	const days = eachDayOfInterval({
		start: startOfMonth(currentMonth),
		end: endOfMonth(currentMonth)
	});
	const firstDayOfMonth = getDay(startOfMonth(currentMonth));
	const formattedMonthYear = new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric"
	}).format(currentMonth);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-[380px] select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between px-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => handleMonthChange(subMonths(currentMonth, 1)),
						disabled: isBefore(subMonths(currentMonth, 1), startOfMonth(today)),
						variant: "ghost",
						size: "icon",
						className: "shrink-0 rounded-full",
						title: dict.prev_month,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "text-muted-foreground size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: dict.prev_month
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-foreground mx-2 truncate text-center text-base font-bold capitalize",
						children: formattedMonthYear
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => handleMonthChange(addMonths(currentMonth, 1)),
						variant: "ghost",
						size: "icon",
						className: "shrink-0 rounded-full",
						title: dict.next_month,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "text-muted-foreground size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: dict.next_month
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground mb-4 grid grid-cols-7 text-center text-[10px] font-bold tracking-widest uppercase sm:text-[11px]",
				children: dict.days.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-8 items-center justify-center",
					children: day
				}, day))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-7 gap-1",
				children: [Array.from({ length: firstDayOfMonth }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square" }, `empty-${i}`)), days.map((day) => {
					const isPast = isBefore(day, today);
					const isSelected = selectedDate && isSameDay(day, selectedDate);
					const isToday = isSameDay(day, today);
					const dayOfWeek = getDay(day);
					const isUnavailable = unavailableDays.includes(dayOfWeek) || unavailableDates.some((d) => isSameDay(d, day));
					const isFullyBooked = fullyBookedDates.some((date) => isSameDay(date, day));
					const isDisabled = isPast || isUnavailable || isFullyBooked;
					const buttonProps = {
						onClick: () => !isDisabled && onSelectDate(day),
						disabled: isDisabled,
						variant: "ghost",
						className: cn("group relative flex aspect-square size-full items-center justify-center rounded-md text-center text-sm font-medium transition", isDisabled && "text-muted-foreground cursor-not-allowed bg-transparent", !isDisabled && !isSelected && "hover:text-brand bg-secondary border hover:scale-105 active:scale-95", isSelected && "text-primary-foreground border border-blue-600 bg-blue-500 shadow-md inset-shadow-2xs inset-shadow-white/30 hover:scale-105 hover:border-blue-700 hover:bg-blue-600 hover:text-white", isSelected && isToday && "after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-white after:content-[''] sm:after:bottom-1.5", !isSelected && isToday && "text-primary font-bold after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-blue-500 after:content-[''] sm:after:bottom-1.5")
					};
					const button = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						...buttonProps,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn(isDisabled && isFullyBooked && "line-through"),
							children: format(day, "d")
						})
					});
					if (isUnavailable && !isPast) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex aspect-square cursor-not-allowed items-center justify-center",
							children: button
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
						side: "top",
						className: "pointer-events-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: dict.unavailable })
					})] }, day.toISOString());
					if (isFullyBooked && !isPast) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex aspect-square cursor-not-allowed items-center justify-center",
							children: button
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
						side: "top",
						className: "pointer-events-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: dict.fully_booked })
					})] }, day.toISOString());
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						...buttonProps,
						size: "icon-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn(isDisabled && isFullyBooked && "line-through"),
							children: format(day, "d")
						})
					}, day.toISOString());
				})]
			})
		]
	});
}
function TwentyFourHourToggle({ value, onChange, className }) {
	const [uncontrolledValue, setUncontrolledValue] = (0, import_react.useState)(false);
	const is24Hour = value ?? uncontrolledValue;
	const setIs24Hour = (next) => {
		onChange?.(next);
		if (value === void 0) setUncontrolledValue(next);
	};
	const handleKeyDown = (e) => {
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault();
			setIs24Hour(!is24Hour);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		layout: true,
		role: "switch",
		"aria-label": "Time format",
		"aria-checked": is24Hour,
		tabIndex: 0,
		className: cn("bg-secondary relative flex h-9 w-28 cursor-pointer items-center rounded-md p-1", is24Hour ? "justify-end" : "justify-start", className),
		onClick: () => setIs24Hour(!is24Hour),
		onKeyDown: handleKeyDown,
		transition: { layout: {
			type: "spring",
			stiffness: 400,
			damping: 30
		} },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0 flex h-full w-full items-center justify-around px-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("text-sm font-semibold transition-colors", !is24Hour ? "text-foreground" : "text-muted-foreground"),
				children: "12h"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("text-sm font-semibold transition-colors", is24Hour ? "text-foreground" : "text-muted-foreground"),
				children: "24h"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			layout: true,
			className: "bg-background relative z-10 flex h-full w-[calc(50%-4px)] items-center justify-center rounded shadow-xs select-none",
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 30
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-foreground text-sm font-semibold",
				children: !is24Hour ? "12h" : "24h"
			})
		})]
	});
}
function formatTime(time24, dict) {
	const [hours, minutes] = time24.split(":").map(Number);
	const period = hours >= 12 ? dict.pm : dict.am;
	return {
		time: `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")}`,
		period
	};
}
function TimeSlots({ selectedDate, selectedSlot, onSelectSlot, onConfirm, availableTimes, bookedTimes = [], className, id, showDateLabel = true, showTimeFormatToggle = true, use24Hour: use24HourProp, onUse24HourChange, isLoading = false, confirmDisabled = false, timezone, inDrawer = false, confirmLabel, dict }) {
	const [isConfirming, setIsConfirming] = (0, import_react.useState)(false);
	const [localUse24Hour, setLocalUse24Hour] = (0, import_react.useState)(false);
	const use24Hour = use24HourProp ?? localUse24Hour;
	const setUse24Hour = onUse24HourChange ?? setLocalUse24Hour;
	const [stuckHeaders, setStuckHeaders] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const scrollAreaRootRef = (0, import_react.useRef)(null);
	const drawerScrollRef = (0, import_react.useRef)(null);
	const displayTimezone = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
	const slots = (0, import_react.useMemo)(() => availableTimes.map((item) => typeof item === "string" ? {
		start: item,
		end: item,
		available: true
	} : item), [availableTimes]);
	const groups = (0, import_react.useMemo)(() => {
		const g = {};
		slots.forEach((slot) => {
			const dateStr = formatInTimeZone(slot.start, displayTimezone, "yyyy-MM-dd");
			if (!g[dateStr]) g[dateStr] = [];
			g[dateStr].push(slot);
		});
		return Object.entries(g).sort((a, b) => a[0].localeCompare(b[0]));
	}, [slots, displayTimezone]);
	(0, import_react.useEffect)(() => {
		const root = inDrawer ? drawerScrollRef.current : scrollAreaRootRef.current?.querySelector("[data-slot=\"scroll-area-viewport\"]") ?? null;
		if (!root) return;
		const sentinels = Array.from(root.querySelectorAll("[data-sticky-sentinel]"));
		if (sentinels.length === 0) return;
		const observer = new IntersectionObserver((entries) => {
			setStuckHeaders((prev) => {
				const next = new Set(prev);
				let changed = false;
				for (const entry of entries) {
					const key = entry.target.getAttribute("data-sticky-sentinel")?.trim();
					if (!key) continue;
					const rootTop = entry.rootBounds?.top ?? 0;
					const isAboveTop = entry.boundingClientRect.top < rootTop;
					const isStuck = !entry.isIntersecting && isAboveTop;
					const had = next.has(key);
					if (isStuck && !had) {
						next.add(key);
						changed = true;
					} else if (!isStuck && had) {
						next.delete(key);
						changed = true;
					}
				}
				return changed ? next : prev;
			});
		}, {
			root,
			threshold: 0
		});
		for (const el of sentinels) observer.observe(el);
		return () => observer.disconnect();
	}, [
		groups,
		inDrawer,
		selectedDate
	]);
	if (!selectedDate) return null;
	const slotsContent = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-4 pr-2",
		children: groups.map(([dateKey, groupSlots]) => {
			const groupDateLabel = new Intl.DateTimeFormat("en-US", {
				weekday: "short",
				month: "short",
				day: "numeric",
				timeZone: displayTimezone
			}).format(new Date(groupSlots[0].start));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [(groups.length > 1 || formatInTimeZone(selectedDate, displayTimezone, "yyyy-MM-dd") !== dateKey) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": "true",
					"data-sticky-sentinel": dateKey,
					className: "h-px"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: cn("text-muted-foreground sticky top-0 z-10 py-1 text-xs font-medium uppercase", stuckHeaders.has(dateKey) && "bg-background"),
					children: groupDateLabel
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-1",
					children: groupSlots.map((slot) => {
						const time24 = formatInTimeZone(new Date(slot.start), displayTimezone, "HH:mm");
						const isSelected = selectedSlot === slot.start;
						const isBooked = bookedTimes.includes(time24);
						const isUnavailable = slot.available === false;
						const { time: time12, period: period12 } = formatTime(time24, dict);
						const timeText = use24Hour ? time24 : time12;
						const periodText = use24Hour ? null : period12;
						if (isBooked || isUnavailable) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex w-full items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grow",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										disabled: true,
										variant: "ghost",
										className: "h-12 w-full rounded-lg text-sm font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: isBooked || isUnavailable ? "line-through opacity-70" : "opacity-70",
											children: timeText
										}), periodText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground opacity-50",
											children: periodText
										}) : null]
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
								side: inDrawer ? "top" : "left",
								className: "pointer-events-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: isBooked ? dict.already_booked : dict.not_available })
							})] })
						}, slot.start);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => onSelectSlot(slot.start),
								variant: isSelected ? "default" : "secondary",
								className: "h-12 grow rounded-lg text-sm font-medium transition",
								children: [timeText, periodText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: periodText }) : null]
							}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => {
									setIsConfirming(true);
									try {
										onConfirm();
									} catch (error) {
										setIsConfirming(false);
										throw error;
									}
								},
								variant: "default",
								className: "bg-brand h-12 rounded-lg px-6 font-medium shadow-md hover:shadow-lg active:scale-95",
								disabled: isLoading || isConfirming || confirmDisabled,
								"aria-busy": isConfirming,
								children: [isConfirming ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: confirmLabel || dict.book_button })]
							})]
						}, slot.start);
					})
				})]
			}, dateKey);
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id,
		className: cn("flex h-full min-h-0 w-full flex-col gap-3", className),
		children: [(showDateLabel || showTimeFormatToggle) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex items-center", showDateLabel && showTimeFormatToggle ? "justify-between" : showTimeFormatToggle ? "justify-end" : "justify-start"),
			children: [showDateLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: groups.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "shrink-0 space-x-0.5 text-base font-medium",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground font-semibold",
						children: new Intl.DateTimeFormat("en-US", {
							weekday: "short",
							timeZone: displayTimezone
						}).format(new Date(groups[0][1][0].start))
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground/40",
						children: new Intl.DateTimeFormat("en-US", {
							day: "numeric",
							timeZone: displayTimezone
						}).format(new Date(groups[0][1][0].start))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground/40 px-1",
						children: "-"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground font-semibold",
						children: new Intl.DateTimeFormat("en-US", {
							weekday: "short",
							timeZone: displayTimezone
						}).format(new Date(groups[groups.length - 1][1][0].start))
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground/40",
						children: new Intl.DateTimeFormat("en-US", {
							day: "numeric",
							timeZone: displayTimezone
						}).format(new Date(groups[groups.length - 1][1][0].start))
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "shrink-0 space-x-0.5 text-base font-medium",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground font-semibold",
						children: new Intl.DateTimeFormat("en-US", {
							weekday: "short",
							timeZone: displayTimezone
						}).format(groups[0]?.[1]?.[0] ? new Date(groups[0][1][0].start) : selectedDate)
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground/40",
						children: new Intl.DateTimeFormat("en-US", {
							day: "numeric",
							timeZone: displayTimezone
						}).format(groups[0]?.[1]?.[0] ? new Date(groups[0][1][0].start) : selectedDate)
					})
				]
			}) }), showTimeFormatToggle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TwentyFourHourToggle, {
				value: use24Hour,
				onChange: setUse24Hour
			})]
		}) }), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("flex flex-col", inDrawer ? "h-full overflow-hidden" : "min-h-0 grow"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-muted-foreground flex grow flex-col items-center justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-4 animate-spin rounded-full border-2 border-current border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: dict.loading_slots })]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("flex flex-col", inDrawer ? "h-full overflow-hidden" : "min-h-0 grow"),
			children: inDrawer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: drawerScrollRef,
				className: "h-full overflow-y-auto",
				children: slotsContent
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				ref: scrollAreaRootRef,
				className: "min-h-0 grow",
				children: slotsContent
			})
		})]
	});
}
function Command$1({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
		"data-slot": "command",
		className: cn("bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md", className),
		...props
	});
}
function CommandInput({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-slot": "command-input-wrapper",
		className: "flex h-9 items-center gap-2 border-b px-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
			"data-slot": "command-input",
			className: cn("placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50", className),
			...props
		})]
	});
}
function CommandList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
		"data-slot": "command-list",
		className: cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className),
		...props
	});
}
function CommandEmpty({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
		"data-slot": "command-empty",
		className: "py-6 text-center text-sm",
		...props
	});
}
function CommandGroup({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
		"data-slot": "command-group",
		className: cn("text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium", className),
		...props
	});
}
function CommandItem({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
		"data-slot": "command-item",
		className: cn("data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
		...props
	});
}
function Drawer$1({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
		"data-slot": "drawer",
		...props
	});
}
function DrawerTrigger({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Trigger, {
		"data-slot": "drawer-trigger",
		...props
	});
}
function DrawerPortal({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Portal, {
		"data-slot": "drawer-portal",
		...props
	});
}
function DrawerOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, {
		"data-slot": "drawer-overlay",
		className: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
		...props
	});
}
function DrawerContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerPortal, {
		"data-slot": "drawer-portal",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Content, {
			"data-slot": "drawer-content",
			className: cn("group/drawer-content bg-background fixed z-50 flex h-auto flex-col", "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b", "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t", "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm", "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm", className),
			...props,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" }), children]
		})]
	});
}
function DrawerHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "drawer-header",
		className: cn("flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left", className),
		...props
	});
}
function DrawerTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Title, {
		"data-slot": "drawer-title",
		className: cn("text-foreground font-semibold", className),
		...props
	});
}
function Popover({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
		"data-slot": "popover",
		...props
	});
}
function PopoverTrigger({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		"data-slot": "popover-trigger",
		...props
	});
}
function PopoverContent({ className, align = "center", sideOffset = 4, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		"data-slot": "popover-content",
		align,
		sideOffset,
		className: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden", className),
		...props
	}) });
}
function useMediaQuery(query) {
	const [value, setValue] = import_react.useState(false);
	import_react.useEffect(() => {
		function onChange(event) {
			setValue(event.matches);
		}
		const result = matchMedia(query);
		result.addEventListener("change", onChange);
		setValue(result.matches);
		return () => result.removeEventListener("change", onChange);
	}, [query]);
	return value;
}
/**
* Converts an ISO country code to a flag emoji
*/
function countryCodeToFlagEmoji(countryCode) {
	if (!countryCode || countryCode.length !== 2) return "🌐";
	const codePoints = countryCode.toUpperCase().split("").map((char) => 127397 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
}
/**
* Gets the country code for a timezone identifier
* Uses countries-and-timezones library
*/
function getCountryCodeFromTimezone(timezone) {
	if (timezone === "Etc/UTC" || timezone === "Etc/GMT" || timezone.startsWith("Etc/")) return null;
	const tzInfo = getTimezone(timezone);
	if (tzInfo && tzInfo.countries && tzInfo.countries.length > 0) return tzInfo.countries[0];
	return null;
}
/**
* Gets the flag emoji for a timezone identifier
*/
function getTimezoneFlag(timezone) {
	const countryCode = getCountryCodeFromTimezone(timezone);
	if (!countryCode) return "🌐";
	return countryCodeToFlagEmoji(countryCode);
}
function TimezoneSelector({ value, onChange, dict }) {
	const [open, setOpen] = import_react.useState(false);
	const [localTimezone, setLocalTimezone] = import_react.useState("");
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const selectedTimezone = value !== void 0 ? value : localTimezone;
	const timezones = import_react.useMemo(() => {
		const tzNames = Intl.supportedValuesOf("timeZone");
		const now = /* @__PURE__ */ new Date();
		const formattedTzs = tzNames.map((tz) => {
			const offset = new Intl.DateTimeFormat("en-US", {
				timeZone: tz,
				timeZoneName: "longOffset"
			}).formatToParts(now).find((part) => part.type === "timeZoneName")?.value || "";
			const gmtStr = offset === "GMT" ? "GMT+00:00" : offset;
			const label = `(${gmtStr}) ${tz.replace(/_/g, " ")}`;
			const keywordsSet = /* @__PURE__ */ new Set();
			const addKeyword = (raw) => {
				const normalized = raw.toLowerCase().trim();
				if (normalized) keywordsSet.add(normalized);
			};
			addKeyword(tz);
			const tzWithSpaces = tz.replace(/_/g, " ");
			addKeyword(tzWithSpaces);
			addKeyword(tzWithSpaces.replace(/\//g, " "));
			const tzParts = tz.split("/");
			const tzRegion = tzParts[0];
			const tzCity = tzParts[tzParts.length - 1] || tz;
			addKeyword(tzRegion);
			addKeyword(tzCity.replace(/_/g, " "));
			if (gmtStr) {
				addKeyword(gmtStr);
				addKeyword(gmtStr.replace(/^GMT/i, "UTC"));
				addKeyword(gmtStr.replace(/^GMT/i, ""));
				addKeyword(gmtStr.replace(":", ""));
				addKeyword(gmtStr.replace(/^GMT/i, "UTC").replace(":", ""));
				addKeyword(gmtStr.replace(/^GMT/i, "").replace(":", ""));
				const offsetMatch = gmtStr.match(/^GMT([+-])(\d{2}):(\d{2})$/i);
				if (offsetMatch) {
					const sign = offsetMatch[1];
					const hh = offsetMatch[2];
					const mm = offsetMatch[3];
					const hhNoLeadingZero = String(parseInt(hh, 10));
					const shortOffset = mm === "00" ? `GMT${sign}${hhNoLeadingZero}` : `GMT${sign}${hhNoLeadingZero}:${mm}`;
					addKeyword(shortOffset);
					addKeyword(shortOffset.replace(/^GMT/i, "UTC"));
					addKeyword(shortOffset.replace(/^GMT/i, ""));
					addKeyword(mm === "00" ? `${sign}${hhNoLeadingZero}` : `${sign}${hhNoLeadingZero}:${mm}`);
					addKeyword(mm === "00" ? `${hhNoLeadingZero}` : `${hhNoLeadingZero}:${mm}`);
				}
			}
			return {
				value: tz,
				label,
				offset: gmtStr,
				keywords: Array.from(keywordsSet),
				flag: getTimezoneFlag(tz)
			};
		});
		formattedTzs.sort((a, b) => {
			if (a.offset === b.offset) return a.value.localeCompare(b.value);
			return a.offset.localeCompare(b.offset);
		});
		return formattedTzs;
	}, []);
	import_react.useEffect(() => {
		if (value === void 0) {
			const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
			setLocalTimezone(currentTz);
			if (onChange) onChange(currentTz);
		} else if (value === "" && onChange) {
			const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
			onChange(currentTz);
		}
	}, []);
	const selectedOption = timezones.find((tz) => tz.value === selectedTimezone);
	const handleSelect = (tzValue) => {
		if (onChange) onChange(tzValue);
		else setLocalTimezone(tzValue);
		setOpen(false);
	};
	const timezoneFilter = import_react.useCallback((cmdkValue, searchQuery, keywords) => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return 1;
		const terms = q.split(/\s+/).filter(Boolean);
		if (terms.length === 0) return 1;
		const haystack = `${cmdkValue} ${(keywords ?? []).join(" ")}`.toLowerCase().trim();
		return terms.every((term) => haystack.includes(term)) ? 1 : 0;
	}, []);
	const triggerButton = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "ghost",
		className: "text-muted-foreground group -ml-2 flex w-[calc(100%+1rem)] min-w-0 cursor-pointer items-center justify-start rounded-lg px-2 py-1.5 text-sm",
		children: [
			selectedOption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mr-2 shrink-0 text-base",
				children: selectedOption.flag
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "text-muted-foreground group-hover:text-foreground mr-2 size-3.5 shrink-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0 grow truncate text-left text-xs",
				children: selectedOption ? selectedOption.label : dict.trigger_placeholder
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("text-muted-foreground ml-2 size-3.5 shrink-0 transition-transform", open && "rotate-180") })
		]
	});
	const commandContent = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command$1, {
		filter: timezoneFilter,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, { placeholder: dict.search_placeholder }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: dict.no_results }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, { children: timezones.map((tz) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
			value: tz.value,
			keywords: tz.keywords,
			onSelect: () => handleSelect(tz.value),
			className: "cursor-pointer py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("mr-2 size-4", selectedTimezone === tz.value ? "opacity-100" : "opacity-0") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mr-2 text-base",
					children: tz.flag
				}),
				tz.label
			]
		}, tz.value)) })] })]
	});
	if (isDesktop) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-border relative mt-auto w-full min-w-0 border-t pt-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
				asChild: true,
				children: triggerButton
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
				className: "w-[320px] p-0",
				align: "start",
				children: commandContent
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-border relative mt-auto w-full min-w-0 border-t pt-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer$1, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTrigger, {
				asChild: true,
				children: triggerButton
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerHeader, {
				className: "text-left",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, { children: dict.title })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-4",
				children: commandContent
			})] })]
		})
	});
}
//#endregion
export { DrawerTitle as a, TwentyFourHourToggle as c, DrawerHeader as i, Drawer$1 as n, TimeSlots as o, DrawerContent as r, TimezoneSelector as s, Calendar$1 as t };
