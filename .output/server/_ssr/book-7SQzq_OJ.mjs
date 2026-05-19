import { o as __toESM } from "../_runtime.mjs";
import { n as dict, r as formatDuration, t as cn } from "./utils-CQ9QLPNX.mjs";
import { n as formatInTimeZone, t as fromZonedTime } from "../_libs/date-fns-tz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as useRouter, u as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-BFsbexGs.mjs";
import { i as createBooking, n as Textarea, t as Label } from "./api-client-F3AbJ3dV.mjs";
import { n as transformSlots, r as useAvailableSlots, t as ScrollArea } from "./use-available-slots-DyTGKSzu.mjs";
import { t as formatPlatformName } from "./platform-BRTBg_vT.mjs";
import { S as ArrowLeft, _ as Calendar, c as Globe, t as Video, u as Clock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Img } from "./img-OzT0R8lN.mjs";
import { t as Route } from "./book-Dkdg4E0O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-7SQzq_OJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		"data-slot": "input",
		className: cn("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className),
		...props
	});
}
function BookingForm({ username, eventType, profile, meetingPlatform, hostTimezone, dict, startParam, dateParam, timeParam, timezoneParam }) {
	const router = useRouter();
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const displayTimezone = timezoneParam || Intl.DateTimeFormat().resolvedOptions().timeZone;
	const scheduleTimezone = hostTimezone || displayTimezone;
	const selectedStartISO = (0, import_react.useMemo)(() => {
		if (startParam) {
			const d = new Date(startParam);
			return Number.isNaN(d.getTime()) ? null : d.toISOString();
		}
		if (dateParam && timeParam) {
			const d = fromZonedTime(`${dateParam}T${timeParam}:00`, displayTimezone);
			return Number.isNaN(d.getTime()) ? null : d.toISOString();
		}
		return null;
	}, [
		startParam,
		dateParam,
		timeParam,
		displayTimezone
	]);
	const selectedStart = selectedStartISO ? new Date(selectedStartISO) : null;
	const hostDateStr = selectedStart ? formatInTimeZone(selectedStart, scheduleTimezone, "yyyy-MM-dd") : "";
	const { slots, isLoading: isLoadingSlots, isValidating, mutate } = useAvailableSlots(username, eventType.id, hostDateStr, hostDateStr, scheduleTimezone);
	const isCheckingAvailability = isLoadingSlots || isValidating;
	const [slotAvailable, setSlotAvailable] = (0, import_react.useState)(null);
	const REDIRECT_DELAY_MS = 2e3;
	const SUCCESS_REDIRECT_DELAY_MS = 1e3;
	const redirectToBookingInterface = (0, import_react.useCallback)(() => {
		setTimeout(() => {
			router.navigate({
				to: "/$username/$eventType",
				params: {
					username,
					eventType: eventType.id
				}
			});
		}, REDIRECT_DELAY_MS);
	}, [
		router,
		username,
		eventType.id
	]);
	const checkSlotAvailability = (0, import_react.useCallback)((slotsOverride) => {
		if (!selectedStartISO) return false;
		const availableSlots = (slotsOverride || slots).filter((slot) => slot.available !== false);
		if (availableSlots.length === 0) return false;
		const selectedTime = new Date(selectedStartISO).getTime();
		return availableSlots.some((slot) => {
			try {
				return new Date(slot.start).getTime() === selectedTime;
			} catch {
				return false;
			}
		});
	}, [selectedStartISO, slots]);
	(0, import_react.useEffect)(() => {
		if (!selectedStartISO) {
			setSlotAvailable(false);
			return;
		}
		if (!isLoadingSlots) {
			const isAvailable = checkSlotAvailability();
			setSlotAvailable(isAvailable);
			if (!isAvailable && !isValidating) {
				toast.error(dict.booking_form.toast_slot_unavailable, { description: dict.booking_form.toast_redirecting });
				redirectToBookingInterface();
			}
		}
	}, [
		selectedStartISO,
		checkSlotAvailability,
		redirectToBookingInterface,
		isLoadingSlots,
		isValidating,
		dict
	]);
	if (!selectedStart || !selectedStartISO) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-destructive p-8 text-center",
		children: dict.booking_form.missing_time
	});
	const formattedDate = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	}).format(selectedStart);
	const formattedTime = formatInTimeZone(selectedStart, displayTimezone, "HH:mm");
	const isActionBusy = isSubmitting || isCheckingAvailability;
	const actionLabel = isCheckingAvailability ? dict.booking_form.checking : isSubmitting ? dict.booking_form.scheduling : dict.booking_form.schedule_event;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isCheckingAvailability) return;
		setIsSubmitting(true);
		const revalidateSlots = async () => {
			for (let attempt = 1; attempt <= 2; attempt++) {
				try {
					const rawData = await mutate();
					if (rawData) return transformSlots(rawData, scheduleTimezone);
				} catch (error) {}
				if (attempt < 2) await new Promise((r) => setTimeout(r, 400));
			}
			return null;
		};
		const freshSlots = await revalidateSlots();
		if (!freshSlots) {
			setIsSubmitting(false);
			toast.error(dict.booking_form.toast_confirm_fail);
			return;
		}
		if (!checkSlotAvailability(freshSlots)) {
			setIsSubmitting(false);
			toast.error(dict.booking_form.toast_no_longer_available);
			redirectToBookingInterface();
			return;
		}
		const bookingPromise = (async () => {
			const startTime = formatInTimeZone(selectedStart, scheduleTimezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
			const result = await createBooking({
				username,
				eventTypeId: eventType.id,
				name,
				email,
				phone,
				notes,
				startTime,
				guestTimezone: scheduleTimezone
			});
			if (!result.success) {
				if (result.isConflict) redirectToBookingInterface();
				throw new Error(result.message || dict.booking_form.toast_fail);
			}
			setTimeout(() => {
				router.navigate({
					to: "/success",
					search: {
						date: formatInTimeZone(selectedStart, displayTimezone, "yyyy-MM-dd"),
						time: formatInTimeZone(selectedStart, displayTimezone, "HH:mm"),
						type: eventType.id,
						title: eventType.title,
						name,
						email,
						phone: phone || "",
						timezone: displayTimezone,
						bookingId: result.booking.id,
						hostName: profile.name,
						username,
						integration: eventType.integration || meetingPlatform || "in_person",
						...eventType.location ? { location: eventType.location } : {}
					}
				});
			}, SUCCESS_REDIRECT_DELAY_MS);
			return result.booking;
		})();
		toast.promise(bookingPromise, {
			loading: dict.booking_form.scheduling,
			success: () => dict.booking_form.toast_success,
			error: (error) => error.message || dict.booking_form.toast_fail
		});
		try {
			await bookingPromise;
		} catch {} finally {
			setIsSubmitting(false);
		}
	};
	if (slotAvailable === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex grow flex-col items-center justify-center p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-destructive mb-4 text-2xl",
				children: "⚠️"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-foreground mb-2 text-xl font-bold",
				children: dict.booking_form.slot_not_available
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mb-4",
				children: dict.booking_form.slot_not_available_desc
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/$username/$eventType",
					params: {
						username,
						eventType: eventType.id
					},
					children: dict.booking_form.back
				})
			})
		]
	});
	const formContent = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "text-foreground mb-6 text-xl font-bold",
		children: dict.booking_form.details
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "w-full space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				htmlFor: "name",
				className: "text-foreground mb-2 block text-sm font-bold",
				children: [dict.booking_form.name, " *"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "name",
				type: "text",
				required: true,
				className: "h-11",
				value: name,
				onChange: (e) => setName(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				htmlFor: "email",
				className: "text-foreground mb-2 block text-sm font-bold",
				children: [dict.booking_form.email, " *"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "email",
				type: "email",
				required: true,
				className: "h-11",
				value: email,
				onChange: (e) => setEmail(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				htmlFor: "phone",
				className: "text-foreground mb-2 block text-sm font-bold",
				children: [
					dict.booking_form.phone,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground font-normal",
						children: dict.booking_form.optional
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "phone",
				type: "tel",
				className: "h-11",
				value: phone,
				onChange: (e) => setPhone(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "notes",
				className: "text-foreground mb-2 block text-sm font-bold",
				children: dict.booking_form.notes_label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "notes",
				className: "min-h-[120px] resize-none",
				value: notes,
				onChange: (e) => setNotes(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				variant: "default",
				disabled: isActionBusy,
				className: "bg-brand w-auto rounded-full px-8 py-4 font-bold shadow-lg hover:shadow-xl active:scale-95",
				"aria-busy": isActionBusy,
				children: [isActionBusy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent",
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: actionLabel })]
			})
		]
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("animate-in fade-in fill-mode-both flex flex-col p-3 pr-1 duration-1000 md:overflow-visible xl:h-full xl:min-h-0 xl:flex-row xl:overflow-hidden"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-background dark:bg-secondary animate-in fade-in slide-in-from-bottom-4 fill-mode-both relative z-10 flex shrink-0 flex-col rounded-xl p-4 shadow-xl shadow-slate-300/30 duration-1000 md:p-6 xl:w-1/4 dark:shadow-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-3 xl:mb-0 xl:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					size: "icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/$username/$eventType",
						params: {
							username,
							eventType: eventType.id
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
						className: "text-foreground mb-3 text-lg leading-tight font-bold wrap-break-word md:text-xl xl:mb-4",
						children: eventType.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex flex-wrap gap-x-4 gap-y-2 xl:flex-col xl:gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDuration(eventType.duration, dict.booking_form) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "capitalize",
									children: [
										formattedTime,
										" - ",
										formattedDate
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPlatformName(meetingPlatform, dict.platforms) })]
							}),
							timezoneParam && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: timezoneParam.replace(/_/g, " ") })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground hidden text-sm leading-relaxed xl:block",
						children: eventType.description
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("animate-in fade-in slide-in-from-bottom-4 fill-mode-both flex grow overflow-visible rounded-b-3xl delay-150 duration-1000 xl:min-h-0 xl:w-3/4 xl:min-w-0 xl:rounded-r-3xl xl:rounded-bl-none"),
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
function BookingPage() {
	const { username } = Route.useParams();
	const { eventDetails, profile } = Route.useLoaderData();
	const { start, date, time, timezone } = Route.useSearch();
	const eventType = {
		id: eventDetails.slug,
		title: eventDetails.title,
		duration: eventDetails.duration_minutes,
		description: eventDetails.description,
		integration: eventDetails.integration,
		location: eventDetails.location,
		color: "bg-blue-500"
	};
	const userProfile = profile || {
		name: username,
		image: ""
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-muted-foreground flex grow items-center justify-center p-8 text-sm",
			children: dict.common.loading_form
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingForm, {
			username,
			eventType,
			profile: userProfile,
			meetingPlatform: eventDetails.integration,
			hostTimezone: eventDetails.host_timezone,
			dict,
			startParam: start,
			dateParam: date,
			timeParam: time,
			timezoneParam: timezone
		})
	});
}
//#endregion
export { BookingPage as component };
