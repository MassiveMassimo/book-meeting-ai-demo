import { n as dict, t as cn } from "./utils-CQ9QLPNX.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-BFsbexGs.mjs";
import { _ as Calendar, c as Globe, s as Link2, t as Video, u as Clock } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-aqA3RkXO.js
var import_jsx_runtime = require_jsx_runtime();
function HeroIllustration({ dict }) {
	const now = /* @__PURE__ */ new Date();
	const currentMonth = now.getMonth();
	const currentYear = now.getFullYear();
	const viewerTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const monthNames = dict.hero.months;
	const firstDay = new Date(currentYear, currentMonth, 1);
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
	const startDayOfWeek = firstDay.getDay();
	const miniCalendarDays = dict.hero.mini_days;
	const miniCalendarCells = [];
	const todayDate = now.getDate();
	const todayMonth = now.getMonth();
	const todayYear = now.getFullYear();
	const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
	for (let i = startDayOfWeek; i > 0; i--) miniCalendarCells.push({
		day: prevMonthLastDay - i + 1,
		outside: true,
		selected: false,
		isAfterToday: false
	});
	for (let day = 1; day <= daysInMonth; day++) {
		const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
		const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
		const isToday = day === todayDate && currentMonth === todayMonth && currentYear === todayYear;
		const isAfterToday = !isToday && currentMonth === todayMonth && currentYear === todayYear && day > todayDate && !isWeekend;
		miniCalendarCells.push({
			day,
			outside: false,
			selected: isToday && !isWeekend,
			isAfterToday
		});
	}
	const remainingCells = (miniCalendarCells.length > 35 ? 42 : 35) - miniCalendarCells.length;
	for (let day = 1; day <= remainingCells; day++) miniCalendarCells.push({
		day,
		outside: true,
		selected: false,
		isAfterToday: false
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none pt-10 pl-10 select-none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "aspect-video w-[105%] rounded-2xl shadow-[-25px_-25px_50px_-12px] shadow-slate-300/30 dark:shadow-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "from-background to-secondary flex h-full w-full rounded-2xl bg-linear-to-b mask-b-from-20%",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-background animate-in fade-in slide-in-from-left-4 fill-mode-both m-2 flex basis-1/4 flex-col rounded-lg p-3 pt-5 shadow-xl shadow-slate-300/30 delay-1200 duration-1000 dark:shadow-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-3 rounded-full bg-linear-to-b from-blue-400 to-indigo-500 inset-shadow-2xs inset-shadow-white/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground text-[10px] font-medium",
									children: dict.hero.host_name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-foreground text-[11px] leading-tight font-bold",
										children: dict.hero.intro_title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground mt-1 flex flex-col gap-1 text-[9px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-2.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dict.hero.intro_duration })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-2.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dict.hero.intro_type })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted-foreground mt-2 text-[9px] leading-snug",
										children: dict.hero.intro_description
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-border/40 mt-auto border-t pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground text-[9px] leading-tight",
									children: dict.hero.times_shown_in
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-foreground/70 truncate text-[9px] font-medium",
									children: viewerTimezone
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "animate-in fade-in zoom-in-95 fill-mode-both flex grow justify-center pt-5 delay-1300 duration-1000",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"aria-hidden": "true",
							className: "w-full max-w-[280px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border-border/40 flex items-center justify-between border-b px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-foreground/90 text-xs font-semibold tracking-wide",
										children: [
											monthNames[currentMonth],
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground font-medium",
												children: currentYear
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-7 gap-1 px-3 pt-2",
									children: miniCalendarDays.map((d, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted-foreground flex items-center justify-center text-[10px] font-medium",
										children: d
									}, `${d}-${idx}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-7 gap-0.5 px-3 pt-2 pb-3",
									children: miniCalendarCells.map((cell, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("relative flex aspect-square items-center justify-center rounded text-[9px] leading-none", cell.outside ? "text-muted-foreground/40" : cell.selected ? "text-primary-foreground border border-blue-600 bg-blue-500 shadow-md" : cell.isAfterToday && "text-foreground/80 bg-secondary border"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "",
											children: cell.day
										})
									}, `${cell.outside ? "o" : "i"}-${cell.day}-${idx}`))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-border/30 animate-in fade-in slide-in-from-right-4 fill-mode-both flex basis-3/10 flex-col border-l p-3 pt-7 delay-1400 duration-1000",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-foreground/90 mb-2 text-[10px] font-semibold",
							children: dict.hero.available_times
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-0.5",
							children: [
								{
									time: "9:00",
									period: dict.hero.am,
									selected: false
								},
								{
									time: "10:00",
									period: dict.hero.am,
									selected: false
								},
								{
									time: "11:00",
									period: dict.hero.am,
									selected: true
								},
								{
									time: "1:00",
									period: dict.hero.pm,
									selected: false
								},
								{
									time: "2:00",
									period: dict.hero.pm,
									selected: false
								},
								{
									time: "3:00",
									period: dict.hero.pm,
									selected: false
								}
							].map((slot, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex w-full items-center gap-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("flex h-5 grow items-center justify-center rounded text-[9px] font-medium transition", slot.selected ? "text-background bg-foreground" : "bg-secondary text-foreground/80"),
									children: [
										slot.time,
										" ",
										slot.period
									]
								}), slot.selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-5 items-center justify-center rounded-lg bg-blue-500 px-3 text-[9px] font-medium text-white shadow-md",
									children: dict.hero.book_button
								})]
							}, idx))
						})]
					})
				]
			})
		})
	});
}
function IndexPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex grow flex-col overflow-hidden xl:h-full xl:min-h-0"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("divide-border/50 grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0 xl:h-full xl:min-h-0"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cn("flex flex-col justify-center gap-6 p-6 md:p-10 lg:p-16"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("space-y-4"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: cn("text-foreground animate-in fade-in slide-in-from-bottom-6 fill-mode-both text-4xl/[1.2] font-bold tracking-tight text-balance duration-1000 md:text-5xl/[1.2] lg:text-6xl/[1.2]"),
						children: dict.landing.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-muted-foreground animate-in fade-in slide-in-from-bottom-6 fill-mode-both max-w-prose leading-relaxed delay-150 duration-1000 md:text-lg"),
						children: dict.landing.subtitle
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("flex flex-col gap-3 sm:flex-row sm:items-center"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: cn("bg-brand text-primary-foreground hover:bg-brand/90 animate-in fade-in slide-in-from-bottom-6 fill-mode-both h-12 rounded-xl px-8 text-base font-semibold shadow-sm transition-shadow delay-300 duration-1000 hover:shadow-md"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `https://app.meeting.ai/auth/register`,
							children: dict.landing.cta
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cn("bg-muted/10 flex flex-col justify-between overflow-hidden xl:h-full xl:min-h-0"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex flex-col justify-end px-6 pt-10 pb-6 md:h-auto md:shrink-0 md:px-10 xl:px-16"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("text-muted-foreground animate-in fade-in slide-in-from-bottom-4 fill-mode-both text-[11px] font-semibold tracking-widest uppercase delay-500 duration-1000"),
							children: dict.landing.features.tag
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: cn("text-foreground animate-in fade-in slide-in-from-bottom-4 fill-mode-both mt-2 text-xl font-bold delay-600 duration-1000 md:text-2xl"),
							children: dict.landing.features.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("mt-6 grid gap-4 sm:grid-cols-3"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("bg-background ring-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both rounded-xl p-4 shadow-xs ring-1 delay-700 duration-1000"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("flex flex-col gap-3"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("bg-brand/10 text-brand inline-flex size-8 shrink-0 items-center justify-center rounded-full"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: cn("text-foreground text-sm font-semibold"),
											children: dict.landing.features.link.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: cn("text-muted-foreground mt-0.5 text-xs"),
											children: dict.landing.features.link.description
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("bg-background ring-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both rounded-xl p-4 shadow-xs ring-1 delay-800 duration-1000"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("flex flex-col gap-3"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("bg-brand/10 text-brand inline-flex size-8 shrink-0 items-center justify-center rounded-full"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: cn("text-foreground text-sm font-semibold"),
											children: dict.landing.features.global.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: cn("text-muted-foreground mt-0.5 text-xs"),
											children: dict.landing.features.global.description
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("bg-background ring-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both rounded-xl p-4 shadow-xs ring-1 delay-900 duration-1000"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("flex flex-col gap-3"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("bg-brand/10 text-brand inline-flex size-8 shrink-0 items-center justify-center rounded-full"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: cn("text-foreground text-sm font-semibold"),
											children: dict.landing.features.automated.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: cn("text-muted-foreground mt-0.5 text-xs"),
											children: dict.landing.features.automated.description
										})] })]
									})
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("relative flex grow items-end justify-center md:min-h-0 md:flex-1"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("animate-in fade-in slide-in-from-bottom-8 fill-mode-both w-full max-w-[600px] translate-x-4 translate-y-4 delay-1100 duration-1000 md:translate-x-6 md:translate-y-8"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroIllustration, { dict })
					})
				})]
			})]
		})
	});
}
//#endregion
export { IndexPage as component };
