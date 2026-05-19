import { o as __toESM } from "./_runtime.mjs";
import { n as dict } from "./_ssr/utils-CQ9QLPNX.mjs";
import { d as endOfMonth, i as isSameMonth, l as startOfMonth, n as startOfToday, r as parseISO, u as eachDayOfInterval } from "./_libs/date-fns.mjs";
import { n as formatInTimeZone } from "./_libs/date-fns-tz.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { f as useRouter } from "./_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Route } from "./_bookingId-CzLFtf1G.mjs";
import { t as Button } from "./_ssr/button-BFsbexGs.mjs";
import { a as rescheduleBooking, n as Textarea, t as Label } from "./_ssr/api-client-F3AbJ3dV.mjs";
import { r as useAvailableSlots, t as ScrollArea } from "./_ssr/use-available-slots-DyTGKSzu.mjs";
import { t as formatPlatformName } from "./_ssr/platform-BRTBg_vT.mjs";
import { S as ArrowLeft, _ as Calendar, a as RefreshCw, b as Ban, c as Globe, t as Video, u as Clock, v as CalendarX, x as ArrowUpDown } from "./_libs/lucide-react.mjs";
import { a as DrawerTitle, c as TwentyFourHourToggle, i as DrawerHeader, n as Drawer$1, o as TimeSlots, r as DrawerContent, s as TimezoneSelector, t as Calendar$1 } from "./_ssr/TimezoneSelector-DkqmkcuJ.mjs";
import { n as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_bookingId-CCOu-voe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RescheduleForm({ bookingId, booking, eventType, profile, meetingPlatform, selectedDate, selectedSlot, timezone, hostTimezone, dict, onBack }) {
	const router = useRouter();
	const [notes, setNotes] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const formattedDate = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: timezone
	}).format(selectedDate);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		const reschedulePromise = (async () => {
			const scheduleTimezone = hostTimezone || timezone;
			const result = await rescheduleBooking({
				bookingId,
				newStartTime: formatInTimeZone(new Date(selectedSlot), scheduleTimezone, "yyyy-MM-dd'T'HH:mm:ssXXX"),
				timezone: scheduleTimezone,
				notes,
				reason
			});
			if (!result.success) throw new Error(result.message || dict.reschedule.toast_error);
			return result;
		})();
		toast.promise(reschedulePromise, {
			loading: dict.reschedule.toast_loading,
			success: () => {
				const dateInTimezone = formatInTimeZone(selectedSlot, timezone, "yyyy-MM-dd");
				const timeInTimezone = formatInTimeZone(selectedSlot, timezone, "HH:mm");
				const params = new URLSearchParams({
					date: dateInTimezone,
					time: timeInTimezone,
					type: eventType.id,
					title: eventType.title,
					timezone,
					hostName: profile.name,
					username: booking.username,
					integration: meetingPlatform,
					action: "rescheduled"
				});
				if (eventType.location) params.set("location", eventType.location);
				setTimeout(() => {
					router.navigate({
						to: "/success",
						search: Object.fromEntries(params.entries())
					});
				}, 1500);
				return dict.reschedule.toast_success;
			},
			error: (error) => error.message || dict.reschedule.toast_error
		});
		try {
			await reschedulePromise;
		} finally {
			setIsSubmitting(false);
		}
	};
	const formContent = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "text-foreground mb-6 text-xl font-bold",
		children: dict.reschedule.details_title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "w-full space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				htmlFor: "reason",
				className: "text-foreground mb-2 block text-sm font-bold",
				children: [
					dict.reschedule.reason_label,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground font-normal",
						children: dict.booking_form.optional
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "reason",
				className: "min-h-[80px] resize-none",
				value: reason,
				onChange: (e) => setReason(e.target.value),
				placeholder: dict.reschedule.reason_placeholder
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				htmlFor: "notes",
				className: "text-foreground mb-2 block text-sm font-bold",
				children: [
					dict.reschedule.additional_notes_label,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground font-normal",
						children: dict.booking_form.optional
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "notes",
				className: "min-h-[120px] resize-none",
				value: notes,
				onChange: (e) => setNotes(e.target.value),
				placeholder: dict.reschedule.notes_placeholder
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					variant: "default",
					disabled: isSubmitting,
					className: "bg-brand w-auto rounded-full px-8 py-4 font-bold shadow-lg hover:shadow-xl active:scale-95",
					"aria-busy": isSubmitting,
					children: [isSubmitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? dict.reschedule.submitting_button : dict.reschedule.submit_button })]
				})
			})
		]
	})] });
	const displayTime = formatInTimeZone(new Date(selectedSlot), timezone, "h:mma").toLowerCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col p-3 pr-1 md:overflow-visible xl:h-full xl:min-h-0 xl:flex-row xl:overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-background dark:bg-secondary relative z-10 flex shrink-0 flex-col rounded-xl p-4 shadow-xl shadow-slate-300/30 md:p-6 xl:w-1/4 dark:shadow-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-3 xl:mb-0 xl:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onBack,
					variant: "secondary",
					size: "icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 xl:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground text-sm font-medium",
						children: profile.name
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex grow flex-col xl:mt-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 hidden items-center gap-2 xl:flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground text-sm font-medium",
							children: profile.name
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-foreground mb-3 text-lg leading-tight font-bold wrap-break-word md:text-xl xl:mb-4",
						children: eventType.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex flex-wrap gap-x-4 gap-y-2 xl:flex-col xl:gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dict.booking_form.duration.replace("{min}", String(eventType.duration)) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "capitalize",
									children: [
										displayTime,
										" - ",
										formattedDate
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPlatformName(meetingPlatform) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: timezone.replace(/_/g, " ") })]
							})
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex grow overflow-visible rounded-b-3xl xl:min-h-0 xl:w-3/4 xl:min-w-0 xl:rounded-r-3xl xl:rounded-bl-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "hidden h-full w-full xl:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full grow p-5 md:p-8 xl:p-12",
					children: formContent
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full grow p-5 md:p-8 xl:hidden",
				children: formContent
			})]
		})]
	});
}
function RescheduleInterface({ bookingId, booking, eventType, profile, meetingPlatform, hostTimezone, dict }) {
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(null);
	const [selectedSlot, setSelectedSlot] = (0, import_react.useState)(null);
	const [currentMonth, setCurrentMonth] = (0, import_react.useState)(() => startOfMonth(startOfToday()));
	const [step, setStep] = (0, import_react.useState)("time-slot");
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
	const router = useRouter();
	const monthStart = startOfMonth(currentMonth);
	const monthEnd = endOfMonth(currentMonth);
	const today = startOfToday();
	const effectiveStart = isSameMonth(currentMonth, today) ? today : monthStart;
	const scheduleTimezone = hostTimezone || timezone;
	const startDateStr = formatInTimeZone(effectiveStart, scheduleTimezone, "yyyy-MM-dd");
	const endDateStr = formatInTimeZone(monthEnd, scheduleTimezone, "yyyy-MM-dd");
	const { slots: fetchedSlots, isLoading: isLoadingSlots } = useAvailableSlots(booking.username, eventType.id, startDateStr, endDateStr, scheduleTimezone);
	const canToggleTimezone = Boolean(hostTimezone) && hostTimezone !== timezone;
	const activeTimezone = canToggleTimezone && showHostTimezone ? hostTimezone : timezone;
	const formatTimezoneLabel = (tz) => {
		try {
			const offset = new Intl.DateTimeFormat("en-US", {
				timeZone: tz,
				timeZoneName: "longOffset"
			}).formatToParts(/* @__PURE__ */ new Date()).find((p) => p.type === "timeZoneName")?.value || "";
			const gmt = offset === "GMT" ? "GMT+00:00" : offset;
			return `${gmt ? `(${gmt}) ` : ""}${tz.replace(/_/g, " ")}`;
		} catch {
			return tz.replace(/_/g, " ");
		}
	};
	const viewerTimezoneLabel = formatTimezoneLabel(timezone);
	const hostTimezoneLabel = hostTimezone ? formatTimezoneLabel(hostTimezone) : "";
	const currentStartDate = parseISO(booking.start_time);
	const currentEndDate = parseISO(booking.end_time);
	const currentFormattedDate = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: activeTimezone
	}).format(currentStartDate);
	const formatTimeInTz = (date) => {
		const raw = formatInTimeZone(date, activeTimezone, use24Hour ? "HH:mm" : "h:mma");
		return use24Hour ? raw : raw.toLowerCase();
	};
	const startTimeInTz = formatTimeInTz(currentStartDate);
	const endTimeInTz = formatTimeInTz(currentEndDate);
	const isDifferentDay = formatInTimeZone(currentStartDate, activeTimezone, "yyyy-MM-dd") !== formatInTimeZone(currentEndDate, activeTimezone, "yyyy-MM-dd");
	const endDateInTz = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: activeTimezone
	}).format(currentEndDate);
	const currentFormattedTimeRange = isDifferentDay ? `${startTimeInTz} on ${currentFormattedDate} to ${endTimeInTz} on ${endDateInTz}` : `${startTimeInTz} to ${endTimeInTz}`;
	(0, import_react.useEffect)(() => {
		router.invalidate();
	}, [router]);
	const availableSlots = (0, import_react.useMemo)(() => {
		if (!selectedDate) return [];
		const dateKeyInScheduleTz = formatInTimeZone(selectedDate, scheduleTimezone, "yyyy-MM-dd");
		return fetchedSlots.filter((slot) => formatInTimeZone(slot.start, scheduleTimezone, "yyyy-MM-dd") === dateKeyInScheduleTz).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
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
	const handleReschedule = () => {
		if (!selectedDate || !selectedSlot) return;
		setStep("details");
		setDrawerOpen(false);
	};
	if (step === "details" && selectedDate && selectedSlot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RescheduleForm, {
		bookingId,
		booking,
		eventType,
		profile,
		meetingPlatform,
		selectedDate,
		selectedSlot,
		timezone,
		hostTimezone,
		dict,
		onBack: () => setStep("time-slot")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col overflow-hidden p-3 pr-1 md:overflow-visible xl:min-h-0 xl:flex-row xl:overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-background dark:bg-secondary relative z-10 flex shrink-0 flex-col rounded-xl p-4 shadow-xl shadow-slate-300/30 md:p-6 xl:w-1/4 dark:shadow-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-3 xl:mb-0 xl:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-primary/10 flex size-10 items-center justify-center rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "text-primary size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2 xl:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-sm font-medium",
								children: profile.name
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex grow flex-col xl:mt-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 hidden items-center gap-2 xl:flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground text-sm font-medium",
									children: profile.name
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-foreground mb-3 text-lg leading-tight font-bold wrap-break-word md:text-xl",
								children: dict.reschedule.title.replace("{title}", eventType.title)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-muted/70 dark:bg-background/30 mb-4 rounded-lg p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground mb-1 text-xs font-medium uppercase",
									children: dict.reschedule.current_time_label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-foreground text-sm font-medium",
									children: isDifferentDay ? currentFormattedTimeRange : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										currentFormattedDate,
										" - ",
										currentFormattedTimeRange
									] })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex flex-wrap gap-x-4 gap-y-2 xl:flex-col xl:gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-muted-foreground flex items-center text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dict.booking_form.duration.replace("{min}", String(eventType.duration)) })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-muted-foreground flex items-center text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPlatformName(meetingPlatform, dict.platforms) })]
								})]
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
					canToggleTimezone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							onClick: () => setShowHostTimezone((v) => !v),
							title: showHostTimezone ? dict.slot_picker.show_your_tz.replace("{tz}", timezone) : dict.slot_picker.show_host_tz.replace("{tz}", hostTimezone || ""),
							"aria-label": showHostTimezone ? dict.slot_picker.switch_to_your_tz : dict.slot_picker.switch_to_host_tz,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "size-3.5" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-border/50 flex flex-col p-4 md:p-8 xl:min-w-0 xl:grow xl:border-r",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-foreground text-lg font-semibold",
						children: dict.reschedule.select_new_time_title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm",
						children: dict.reschedule.select_new_time_subtitle
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, {
					selectedDate,
					onSelectDate: (date) => {
						setSelectedDate(date);
						setSelectedSlot(null);
						if (window.innerWidth < 1280) setDrawerOpen(true);
					},
					onMonthChange: (month) => setCurrentMonth(startOfMonth(month)),
					unavailableDates,
					fullyBookedDates,
					dict: dict.calendar
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden shrink-0 flex-col xl:flex xl:w-1/5 xl:min-w-0 xl:grow",
				children: selectedDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-border/50 flex h-full flex-col pt-4 pr-4 pl-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeSlots, {
						selectedDate,
						selectedSlot,
						onSelectSlot: setSelectedSlot,
						onConfirm: handleReschedule,
						availableTimes: availableSlots,
						bookedTimes: [],
						isLoading: isLoadingSlots,
						timezone: activeTimezone,
						use24Hour,
						onUse24HourChange: setUse24Hour,
						dict: dict.slot_picker
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-border/50 flex grow flex-col items-center justify-center gap-4 pt-4 pr-4 pl-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-muted flex size-16 items-center justify-center rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "text-muted-foreground size-8" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm font-medium text-balance",
						children: dict.slot_picker.select_date_see_times
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
						children: selectedDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeSlots, {
							selectedDate,
							selectedSlot,
							onSelectSlot: setSelectedSlot,
							onConfirm: () => {
								handleReschedule();
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
							dict: dict.slot_picker
						})
					})]
				})
			})
		]
	});
}
function RescheduleBookingPage() {
	const { bookingId } = Route.useParams();
	const { booking, appointment } = Route.useLoaderData();
	if (!booking) return null;
	if (booking.status === "cancelled") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-md grow flex-col items-center justify-center p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-muted mx-auto mb-6 flex size-16 items-center justify-center rounded-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "text-muted-foreground size-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-foreground mb-3 text-xl font-bold md:text-2xl",
				children: dict.reschedule.already_cancelled
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm leading-relaxed md:text-base",
				children: dict.reschedule.already_cancelled_desc
			})
		]
	});
	const eventStartTime = new Date(booking.start_time);
	if (/* @__PURE__ */ new Date() >= eventStartTime) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-md grow flex-col items-center justify-center p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-muted mx-auto mb-6 flex size-16 items-center justify-center rounded-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarX, { className: "text-muted-foreground size-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-foreground mb-3 text-xl font-bold md:text-2xl",
				children: dict.reschedule.cannot_reschedule_past
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm leading-relaxed md:text-base",
				children: dict.reschedule.cannot_reschedule_past_desc
			})
		]
	});
	const profile = {
		name: booking.host.name,
		image: booking.host.avatar_url
	};
	const eventType = {
		id: booking.schedule_appointment.slug,
		title: booking.schedule_appointment.name,
		duration: booking.schedule_appointment.duration_minutes,
		description: booking.schedule_appointment.description,
		color: "bg-blue-500",
		integration: booking.schedule_appointment.integration,
		location: booking.schedule_appointment.location
	};
	const hostTimezone = appointment?.schedule_appointment?.host_timezone;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RescheduleInterface, {
		bookingId,
		booking,
		eventType,
		profile,
		meetingPlatform: booking.schedule_appointment.integration,
		hostTimezone,
		dict
	});
}
//#endregion
export { RescheduleBookingPage as component };
