import { o as __toESM } from "./_runtime.mjs";
import { n as dict, r as formatDuration, t as cn } from "./_ssr/utils-CQ9QLPNX.mjs";
import { d as endOfMonth, i as isSameMonth, l as startOfMonth, n as startOfToday, u as eachDayOfInterval } from "./_libs/date-fns.mjs";
import { n as formatInTimeZone } from "./_libs/date-fns-tz.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { f as useRouter } from "./_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BFsbexGs.mjs";
import { r as useAvailableSlots } from "./_ssr/use-available-slots-DyTGKSzu.mjs";
import { t as formatPlatformName } from "./_ssr/platform-BRTBg_vT.mjs";
import { _ as Calendar, o as MapPin, t as Video, u as Clock, x as ArrowUpDown } from "./_libs/lucide-react.mjs";
import { a as DrawerTitle, c as TwentyFourHourToggle, i as DrawerHeader, n as Drawer$1, o as TimeSlots, r as DrawerContent, s as TimezoneSelector, t as Calendar$1 } from "./_ssr/TimezoneSelector-DkqmkcuJ.mjs";
import { t as Route } from "./_eventType-uzYsbkkh.mjs";
import { t as Img } from "./_ssr/img-OzT0R8lN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_eventType-Bcs_8wOZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SlotPicker({ username, eventType, profile, meetingPlatform, hostTimezone, onConfirm, renderHeader, renderExtraInfo, calendarTitle, confirmLabel, className, dict }) {
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(null);
	const [selectedSlot, setSelectedSlot] = (0, import_react.useState)(null);
	const [currentMonth, setCurrentMonth] = (0, import_react.useState)(() => startOfMonth(startOfToday()));
	const [timezone, setTimezone] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("selected-timezone");
			if (stored) return stored;
		}
		return Intl.DateTimeFormat().resolvedOptions().timeZone;
	});
	const handleTimezoneChange = (newTimezone) => {
		setTimezone(newTimezone);
		if (typeof window !== "undefined") localStorage.setItem("selected-timezone", newTimezone);
	};
	const [showHostTimezone, setShowHostTimezone] = (0, import_react.useState)(false);
	const [use24Hour, setUse24Hour] = (0, import_react.useState)(false);
	const [drawerOpen, setDrawerOpen] = (0, import_react.useState)(false);
	const monthStart = startOfMonth(currentMonth);
	const monthEnd = endOfMonth(currentMonth);
	const today = startOfToday();
	const effectiveStart = isSameMonth(currentMonth, today) ? today : monthStart;
	const scheduleTimezone = hostTimezone || timezone;
	const startDateStr = formatInTimeZone(effectiveStart, scheduleTimezone, "yyyy-MM-dd");
	const endDateStr = formatInTimeZone(monthEnd, scheduleTimezone, "yyyy-MM-dd");
	const { slots: fetchedSlots, isLoading: isLoadingSlots } = useAvailableSlots(username, eventType.id, startDateStr, endDateStr, scheduleTimezone);
	const canToggleTimezone = Boolean(hostTimezone) && hostTimezone !== timezone;
	const activeTimezone = canToggleTimezone && showHostTimezone ? hostTimezone : timezone;
	const formatTimezoneLabel = (tz) => {
		try {
			const offset = new Intl.DateTimeFormat("en-US", {
				timeZone: tz,
				timeZoneName: "longOffset"
			}).formatToParts(/* @__PURE__ */ new Date()).find((part) => part.type === "timeZoneName")?.value || "";
			const gmt = offset === "GMT" ? "GMT+00:00" : offset;
			return `${gmt ? `(${gmt}) ` : ""} ${tz.replace(/_/g, " ")}`;
		} catch {
			return tz.replace(/_/g, " ");
		}
	};
	const viewerTimezoneLabel = formatTimezoneLabel(timezone);
	const hostTimezoneLabel = hostTimezone ? formatTimezoneLabel(hostTimezone) : "";
	const availableSlots = (0, import_react.useMemo)(() => {
		if (!selectedDate) return [];
		const dateKeyInScheduleTz = formatInTimeZone(selectedDate, scheduleTimezone, "yyyy-MM-dd");
		return fetchedSlots.filter((slot) => {
			return formatInTimeZone(slot.start, scheduleTimezone, "yyyy-MM-dd") === dateKeyInScheduleTz;
		}).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
	}, [
		selectedDate,
		fetchedSlots,
		scheduleTimezone
	]);
	const { unavailableDates, fullyBookedDates } = (0, import_react.useMemo)(() => {
		const unavail = [];
		const booked = [];
		if (isLoadingSlots) return {
			unavailableDates: unavail,
			fullyBookedDates: booked
		};
		const monthDays = eachDayOfInterval({
			start: effectiveStart,
			end: monthEnd
		});
		const slotsByDate = /* @__PURE__ */ new Map();
		for (const slot of fetchedSlots) {
			const dateKey = formatInTimeZone(slot.start, scheduleTimezone, "yyyy-MM-dd");
			if (!slotsByDate.has(dateKey)) slotsByDate.set(dateKey, []);
			slotsByDate.get(dateKey).push(slot);
		}
		for (const day of monthDays) {
			const dateKey = formatInTimeZone(day, scheduleTimezone, "yyyy-MM-dd");
			const slotsForDay = slotsByDate.get(dateKey);
			if (!slotsForDay || slotsForDay.length === 0) unavail.push(day);
			else if (!slotsForDay.some((s) => s.available !== false)) booked.push(day);
		}
		return {
			unavailableDates: unavail,
			fullyBookedDates: booked
		};
	}, [
		fetchedSlots,
		isLoadingSlots,
		effectiveStart,
		monthEnd,
		scheduleTimezone
	]);
	const handleConfirm = () => {
		if (selectedSlot) onConfirm(selectedSlot, activeTimezone);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("animate-in fade-in fill-mode-both flex h-full flex-col overflow-hidden p-3 pr-1 duration-1000 md:overflow-visible xl:flex-row", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-background dark:bg-secondary animate-in fade-in slide-in-from-bottom-4 fill-mode-both relative z-10 flex shrink-0 flex-col rounded-xl p-4 shadow-xl shadow-slate-300/30 duration-1000 md:p-6 xl:w-1/4 dark:shadow-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-3 xl:mb-0 xl:block",
						children: [renderHeader ? renderHeader() : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 xl:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-muted relative size-5 overflow-hidden rounded-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
									src: profile.image,
									alt: profile.name,
									className: "absolute inset-0 h-full w-full object-cover"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-sm font-medium",
								children: profile.name
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex grow flex-col xl:mt-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 hidden items-center gap-2 xl:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-muted relative size-5 overflow-hidden rounded-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
										src: profile.image,
										alt: profile.name,
										className: "absolute inset-0 h-full w-full object-cover"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground text-sm font-medium",
									children: profile.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-foreground mb-3 text-lg leading-tight font-bold wrap-break-word md:text-xl",
								children: eventType.title
							}),
							renderExtraInfo ? renderExtraInfo() : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex flex-wrap gap-x-4 gap-y-2 xl:flex-col xl:gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground flex items-center text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDuration(eventType.duration, dict.booking_form) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground flex items-center text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPlatformName(meetingPlatform, dict.platforms) })]
									}),
									eventType.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground flex items-center text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: eventType.location })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground hidden text-sm leading-relaxed xl:block",
								children: eventType.description
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimezoneSelector, {
						value: timezone,
						onChange: handleTimezoneChange,
						dict: dict.timezone_selector
					}),
					canToggleTimezone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-muted-foreground mt-2 flex items-center text-xs leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex grow flex-col gap-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: showHostTimezone ? dict.slot_picker.host_tz_prefix : dict.slot_picker.viewer_tz_prefix }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground/70 min-w-0 truncate font-medium",
								children: showHostTimezone ? hostTimezoneLabel : viewerTimezoneLabel
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon-sm",
							className: "shrink-0",
							onClick: () => setShowHostTimezone((prev) => !prev),
							title: showHostTimezone ? dict.slot_picker.show_your_tz.replace("{tz}", timezone) : dict.slot_picker.show_host_tz.replace("{tz}", hostTimezone || ""),
							"aria-label": showHostTimezone ? dict.slot_picker.switch_to_your_tz : dict.slot_picker.switch_to_host_tz,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "size-3.5" })
						})]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both flex flex-col p-4 delay-150 duration-1000 md:p-8 xl:min-w-0 xl:grow xl:border-r",
				children: [calendarTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4",
					children: calendarTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, {
					selectedDate,
					onSelectDate: (date) => {
						setSelectedDate(date);
						setSelectedSlot(null);
						if (window.innerWidth < 1280) setDrawerOpen(true);
					},
					onMonthChange: (month) => {
						setCurrentMonth(startOfMonth(month));
					},
					unavailableDates,
					fullyBookedDates,
					dict: dict.calendar
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-in fade-in slide-in-from-bottom-4 fill-mode-both hidden shrink-0 flex-col delay-300 duration-1000 xl:flex xl:w-1/5 xl:min-w-0 xl:grow",
				children: selectedDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-border/50 flex h-full flex-col pt-4 pr-4 pl-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeSlots, {
						selectedDate,
						selectedSlot,
						onSelectSlot: setSelectedSlot,
						onConfirm: handleConfirm,
						availableTimes: availableSlots,
						bookedTimes: [],
						isLoading: isLoadingSlots,
						timezone: activeTimezone,
						use24Hour,
						onUse24HourChange: setUse24Hour,
						confirmLabel,
						dict: dict.slot_picker
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-border/50 flex grow flex-col items-center justify-center gap-4 pt-4 pr-4 pl-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-muted flex size-16 items-center justify-center rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "text-muted-foreground size-8" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm font-medium text-balance",
						children: calendarTitle ? dict.slot_picker.select_date_see_times : dict.slot_picker.select_date_check_times
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
				open: drawerOpen,
				onOpenChange: setDrawerOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerContent, {
					className: "flex max-h-[85vh] flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerHeader, {
						className: "shrink-0",
						children: selectedDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, { children: availableSlots.length > 0 && formatInTimeZone(availableSlots[0].start, activeTimezone, "yyyy-MM-dd") !== formatInTimeZone(availableSlots[availableSlots.length - 1].start, activeTimezone, "yyyy-MM-dd") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: new Intl.DateTimeFormat("en-US", {
											weekday: "short",
											day: "numeric",
											month: formatInTimeZone(availableSlots[0].start, activeTimezone, "yyyy-MM") !== formatInTimeZone(availableSlots[availableSlots.length - 1].start, activeTimezone, "yyyy-MM") ? "short" : void 0,
											timeZone: activeTimezone
										}).format(new Date(availableSlots[0].start))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground px-1",
										children: "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: new Intl.DateTimeFormat("en-US", {
											weekday: "short",
											day: "numeric",
											month: formatInTimeZone(availableSlots[0].start, activeTimezone, "yyyy-MM") !== formatInTimeZone(availableSlots[availableSlots.length - 1].start, activeTimezone, "yyyy-MM") ? "short" : void 0,
											timeZone: activeTimezone
										}).format(new Date(availableSlots[availableSlots.length - 1].start))
									})
								]
							}) : new Intl.DateTimeFormat("en-US", {
								weekday: "short",
								month: "short",
								day: "numeric",
								year: "numeric",
								timeZone: activeTimezone
							}).format(availableSlots.length > 0 ? new Date(availableSlots[0].start) : selectedDate) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TwentyFourHourToggle, {
								value: use24Hour,
								onChange: setUse24Hour
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, { children: dict.slot_picker.select_time })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeSlots, {
							selectedDate,
							selectedSlot,
							onSelectSlot: (slot) => {
								setSelectedSlot(slot);
							},
							onConfirm: () => {
								handleConfirm();
								setDrawerOpen(false);
							},
							availableTimes: availableSlots,
							bookedTimes: [],
							showDateLabel: false,
							showTimeFormatToggle: false,
							isLoading: isLoadingSlots,
							timezone: activeTimezone,
							use24Hour,
							onUse24HourChange: setUse24Hour,
							inDrawer: true,
							confirmLabel,
							dict: dict.slot_picker
						})
					})]
				})
			})
		]
	});
}
function BookingInterface({ username, eventType, profile, meetingPlatform, hostTimezone, dict }) {
	const router = useRouter();
	const handleConfirm = (startTimeISO, timezone) => {
		router.navigate({
			to: "/$username/$eventType/book",
			params: {
				username,
				eventType: eventType.id
			},
			search: {
				start: startTimeISO,
				timezone
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotPicker, {
		username,
		eventType,
		profile,
		meetingPlatform,
		hostTimezone,
		onConfirm: handleConfirm,
		dict
	});
}
function EventTypePage() {
	const { username } = Route.useParams();
	const { eventDetails, profile } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingInterface, {
		username,
		eventType: {
			id: eventDetails.slug,
			title: eventDetails.title,
			duration: eventDetails.duration_minutes,
			description: eventDetails.description,
			color: "bg-blue-500",
			integration: eventDetails.integration,
			location: eventDetails.location
		},
		profile: profile || {
			name: username,
			image: ""
		},
		meetingPlatform: eventDetails.integration,
		hostTimezone: eventDetails.host_timezone,
		dict
	});
}
//#endregion
export { EventTypePage as component };
