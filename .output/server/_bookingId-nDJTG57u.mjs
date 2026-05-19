import { o as __toESM } from "./_runtime.mjs";
import { n as dict, r as formatDuration } from "./_ssr/utils-CQ9QLPNX.mjs";
import { r as parseISO } from "./_libs/date-fns.mjs";
import { n as formatInTimeZone } from "./_libs/date-fns-tz.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { f as useRouter } from "./_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BFsbexGs.mjs";
import { n as Textarea, r as cancelBooking, t as Label } from "./_ssr/api-client-F3AbJ3dV.mjs";
import { t as formatPlatformName } from "./_ssr/platform-BRTBg_vT.mjs";
import { _ as Calendar, b as Ban, c as Globe, o as MapPin, r as TriangleAlert, t as Video, u as Clock, v as CalendarX } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as Route } from "./_bookingId-Bdu1CaKe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_bookingId-nDJTG57u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CancelForm({ bookingId, booking, profile, dict }) {
	const router = useRouter();
	const [reason, setReason] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const guestTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const startDate = parseISO(booking.start_time);
	const formattedDate = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: guestTimezone
	}).format(startDate);
	const formattedTime = formatInTimeZone(startDate, guestTimezone, "h:mm a");
	const onSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		const trimmedReason = reason.trim();
		if (!trimmedReason) {
			setError(dict.cancel.reason_required);
			return;
		}
		setIsSubmitting(true);
		const cancelPromise = (async () => {
			const result = await cancelBooking({
				bookingId,
				reason: trimmedReason
			});
			if (!result.success) throw new Error(result.message || dict.cancel.toast_error);
			return result;
		})();
		toast.promise(cancelPromise, {
			loading: dict.cancel.toast_loading,
			success: () => {
				const dateStr = formatInTimeZone(startDate, guestTimezone, "yyyy-MM-dd");
				const params = new URLSearchParams({
					date: dateStr,
					time: formattedTime,
					type: booking.schedule_appointment.slug,
					title: booking.schedule_appointment.name,
					timezone: guestTimezone,
					hostName: profile.name,
					integration: booking.schedule_appointment.integration,
					action: "cancelled"
				});
				if (booking.schedule_appointment.location) params.set("location", booking.schedule_appointment.location);
				setTimeout(() => {
					router.navigate({ to: `/success?${params.toString()}` });
				}, 1500);
				return dict.cancel.toast_success;
			},
			error: (err) => err.message || dict.cancel.toast_error
		});
		try {
			await cancelPromise;
		} catch {} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col p-3 pr-1 md:overflow-visible xl:h-full xl:min-h-0 xl:flex-row xl:overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-background dark:bg-secondary relative z-10 flex shrink-0 flex-col rounded-xl p-4 shadow-xl shadow-slate-300/30 md:p-6 xl:w-1/4 dark:shadow-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-3 xl:mb-0 xl:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-destructive/10 flex size-10 items-center justify-center rounded-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "text-destructive size-5" })
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
						children: booking.schedule_appointment.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex flex-wrap gap-x-4 gap-y-2 xl:flex-col xl:gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDuration(booking.schedule_appointment.duration_minutes, dict.booking_form) })]
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPlatformName(booking.schedule_appointment.integration, dict.platforms) })]
							}),
							booking.schedule_appointment.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: booking.schedule_appointment.location })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground flex items-center text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "text-muted-foreground mr-2 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: guestTimezone.replace(/_/g, " ") })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground hidden text-sm leading-relaxed xl:block",
						children: booking.schedule_appointment.description
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex grow overflow-visible rounded-b-3xl xl:min-h-0 xl:w-3/4 xl:min-w-0 xl:overflow-y-auto xl:rounded-r-3xl xl:rounded-bl-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-5 md:p-8 xl:p-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "w-full space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "reason",
								children: [dict.cancel.reason_label, " *"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "reason",
								placeholder: dict.cancel.reason_placeholder,
								className: "min-h-[150px] resize-none",
								value: reason,
								onChange: (e) => setReason(e.target.value),
								"aria-invalid": !!error
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-destructive text-sm",
								children: error
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-3 sm:flex-row",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							variant: "destructive",
							disabled: isSubmitting,
							className: "w-full rounded-full px-8 py-4 font-bold shadow-lg hover:shadow-xl active:scale-95 sm:w-auto",
							"aria-busy": isSubmitting,
							children: [isSubmitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? dict.cancel.submitting_button : dict.cancel.submit_button })]
						})
					})]
				})
			})
		})]
	});
}
function CancelBookingPage() {
	const { bookingId } = Route.useParams();
	const booking = Route.useLoaderData();
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
				children: dict.cancel.already_cancelled
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm leading-relaxed md:text-base",
				children: dict.cancel.already_cancelled_desc
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
				children: dict.cancel.cannot_cancel_past
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm leading-relaxed md:text-base",
				children: dict.cancel.cannot_cancel_past_desc
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CancelForm, {
		bookingId,
		booking,
		dict,
		profile: {
			name: booking.host.name,
			image: booking.host.avatar_url
		}
	});
}
//#endregion
export { CancelBookingPage as component };
