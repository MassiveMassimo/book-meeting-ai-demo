import { o as __toESM } from "../_runtime.mjs";
import { n as dict } from "./utils-CQ9QLPNX.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as createRouter, c as createFileRoute, l as createRootRouteWithContext, n as Scripts, o as Outlet, r as HeadContent, s as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Route$5 } from "../_bookingId-CzLFtf1G.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$6 } from "../_bookingId-Bdu1CaKe.mjs";
import { t as Route$7 } from "../_eventType-uzYsbkkh.mjs";
import { t as Route$8 } from "../_username-CJv5SKpy.mjs";
import { t as Route$9 } from "./book-Dkdg4E0O.mjs";
import { t as Route$10 } from "./success-Dzq0RVgD.mjs";
import { n as z, t as J } from "../_libs/next-themes.mjs";
import { t as routerWithQueryClient } from "../_libs/@tanstack/react-router-with-query+[...].mjs";
import { ImageResponse } from "@vercel/og";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DY2yrELs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Bx1OOu-s.css";
function BackgroundImage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/bg/hills-light.png",
		alt: "",
		className: "absolute inset-0 h-full w-full object-cover object-bottom dark:hidden",
		fetchPriority: "high"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/bg/hills-dark.png",
		alt: "",
		className: "absolute inset-0 hidden h-full w-full object-cover object-bottom dark:block",
		fetchPriority: "high"
	})] });
}
function useIsClient() {
	return (0, import_react.useSyncExternalStore)(() => () => {}, () => true, () => false);
}
function GradientBackground() {
	const { resolvedTheme } = z();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `fixed inset-0 bottom-0 -z-10 transition-colors duration-300 ${useIsClient() && resolvedTheme === "dark" ? "bg-linear-to-b from-[#010203] to-[#171F30]" : "bg-linear-to-b from-[#3D91E7] to-[#80BFF4]"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackgroundImage, {})
	});
}
function ThemeProvider$1({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(J, {
		...props,
		children
	});
}
var DEFAULT_TITLE = "Book a Meeting — Schedule Now";
var DEFAULT_DESCRIPTION = "Ready to connect? Schedule a meeting. Pick your time slot and book instantly with Meeting.ai.";
var Route$4 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: DEFAULT_TITLE },
			{
				name: "description",
				content: DEFAULT_DESCRIPTION
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "alternate icon",
				href: "/favicon.ico"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			}
		]
	}),
	component: RootLayout,
	shellComponent: RootDocument
});
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()` } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "relative flex min-h-screen flex-col antialiased",
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootLayout() {
	const { queryClient } = Route$4.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ThemeProvider$1, {
			attribute: "class",
			defaultTheme: "system",
			enableSystem: true,
			disableTransitionOnChange: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradientBackground, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "relative z-0 flex min-h-dvh w-full flex-col items-center p-3 xl:justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "from-background to-secondary flex min-h-0 w-full max-w-6xl grow flex-col overflow-hidden rounded-3xl bg-linear-to-b inset-shadow-2xs inset-shadow-white/15 xl:h-[600px] xl:flex-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex min-h-0 grow flex-col overflow-y-auto xl:overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex shrink-0 items-center gap-1.5 pb-3 md:mt-6 md:gap-2 md:pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-white md:text-sm",
							children: "Powered by"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/meeting.ai-logo-white.svg",
							alt: "meeting.ai",
							width: 100,
							height: 24,
							className: "h-4 w-auto md:h-5"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					richColors: true,
					position: "top-center"
				}),
				false
			]
		})
	});
}
var $$splitComponentImporter = () => import("./routes-aqA3RkXO.mjs");
var Route$3 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route$2 = createFileRoute("/api/ping")({ server: { handlers: { GET: async () => Response.json({ pong: 1 }) } } });
var FALLBACK_LOGO_URL = "https://book.meeting.ai/meeting.ai-logo-black.svg";
async function fetchFont(url) {
	try {
		const res = await fetch(url);
		if (!res.ok) return null;
		return await res.arrayBuffer();
	} catch {
		return null;
	}
}
var Route$1 = createFileRoute("/api/og")({ server: { handlers: { GET: async ({ request }) => {
	const { searchParams } = new URL(request.url);
	const eventTitleParam = searchParams.get("title")?.trim() || "";
	const avatarParam = searchParams.get("avatar")?.trim() || "";
	const name = (searchParams.get("name")?.trim() || dict.metadata.og_book_with).slice(0, 80);
	const eventTitle = eventTitleParam ? eventTitleParam.slice(0, 120) : "";
	const ogBookWith = dict.metadata.og_book_with;
	const OG_HILLS_URL = `https://assets.meeting.ai/opengraph/og-hills.jpg`;
	const fontSemiBold = await fetchFont("https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_d0nNSg.ttf");
	console.log("[og] fontSemiBold firstByte", fontSemiBold ? new Uint8Array(fontSemiBold)[0] : null);
	const fonts = [];
	if (fontSemiBold) fonts.push({
		name: "Plus Jakarta Sans",
		data: fontSemiBold,
		style: "normal",
		weight: 600
	});
	return new ImageResponse(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			height: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			position: "relative",
			fontFamily: "Plus Jakarta Sans, system-ui, -apple-system"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: OG_HILLS_URL,
			alt: "OG Background",
			width: 1200,
			height: 630,
			style: {
				position: "absolute",
				width: "100%",
				height: "100%",
				objectFit: "cover",
				objectPosition: "center"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "relative",
				zIndex: 1,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 32,
				padding: "48px 56px",
				textAlign: "center"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					textAlign: "center",
					gap: 12,
					maxWidth: 820
				},
				children: [eventTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						fontSize: 46,
						fontWeight: 600,
						color: "#FFFFFF",
						lineHeight: 1.1,
						textShadow: "0 2px 12px rgba(0,0,0,0.4)"
					},
					children: eventTitle
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						fontSize: 34,
						fontWeight: 600,
						color: "#FFFFFF",
						opacity: .95,
						textShadow: "0 2px 8px rgba(0,0,0,0.3)"
					},
					children: ogBookWith
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						fontSize: 64,
						fontWeight: 600,
						color: "#FFFFFF",
						lineHeight: 1.05,
						textShadow: "0 2px 12px rgba(0,0,0,0.4)"
					},
					children: name
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					width: 220,
					height: 220,
					borderRadius: "9999px",
					overflow: "hidden",
					border: "10px solid rgba(255,255,255,0.9)",
					boxShadow: "0 18px 60px rgba(12, 74, 110, 0.35)",
					background: "#e2e8f0",
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: avatarParam ? avatarParam : FALLBACK_LOGO_URL,
					alt: name,
					width: 100,
					height: 100,
					style: {
						width: "100%",
						height: "100%",
						objectFit: "cover"
					}
				})
			})]
		})]
	}), {
		width: 1200,
		height: 630,
		fonts: fonts.length > 0 ? fonts : void 0
	});
} } } });
var package_default = {
	name: "book-meeting-ai",
	version: "1.1.0",
	"private": true,
	type: "module",
	scripts: {
		"dev": "vite dev",
		"build": "vite build",
		"start": "node .output/server/index.mjs",
		"typecheck": "tsc --noEmit",
		"lint": "oxlint",
		"fmt": "oxfmt"
	},
	dependencies: {
		"@fontsource-variable/plus-jakarta-sans": "^5.2.8",
		"@radix-ui/react-dialog": "^1.1.15",
		"@radix-ui/react-dropdown-menu": "^2.1.16",
		"@radix-ui/react-label": "^2.1.8",
		"@radix-ui/react-popover": "^1.1.15",
		"@radix-ui/react-scroll-area": "^1.2.10",
		"@radix-ui/react-slider": "^1.3.6",
		"@radix-ui/react-slot": "^1.2.4",
		"@radix-ui/react-switch": "^1.2.6",
		"@radix-ui/react-tooltip": "^1.2.8",
		"@tanstack/react-query": "^5.100.10",
		"@tanstack/react-router": "^1.170.3",
		"@tanstack/react-router-with-query": "^1.130.17",
		"@tanstack/react-start": "^1.168.5",
		"@vercel/og": "^0.8.6",
		"class-variance-authority": "^0.7.1",
		"clsx": "^2.1.1",
		"cmdk": "^1.1.1",
		"countries-and-timezones": "^3.8.0",
		"date-fns": "^4.1.0",
		"date-fns-tz": "^3.2.0",
		"lucide-react": "^0.563.0",
		"motion": "^12.29.2",
		"next-themes": "^0.4.6",
		"react": "19.2.4",
		"react-dom": "19.2.4",
		"react-hook-form": "^7.71.1",
		"sonner": "^2.0.7",
		"swr": "^2.3.8",
		"tailwind-merge": "^3.4.0",
		"vaul": "^1.1.2",
		"zod": "^4.3.6"
	},
	devDependencies: {
		"@tailwindcss/vite": "^4.3.0",
		"@tanstack/devtools-vite": "^0.7.0",
		"@tanstack/react-router-devtools": "^1.167.0",
		"@types/node": "^22.19.3",
		"@types/react": "^19.2.10",
		"@types/react-dom": "^19.2.3",
		"@vitejs/plugin-react": "^6.0.2",
		"dotenv": "^17.2.3",
		"nitro": "3.0.260429-beta",
		"oxfmt": "^0.50.0",
		"oxlint": "^1.65.0",
		"tailwindcss": "^4.1.18",
		"tw-animate-css": "^1.4.0",
		"typescript": "^5.9.3",
		"vite": "^8.0.13"
	}
};
var Route = createFileRoute("/api/app/version")({ server: { handlers: { GET: async () => Response.json({ version: package_default.version }) } } });
var SuccessRoute = Route$10.update({
	id: "/success",
	path: "/success",
	getParentRoute: () => Route$4
});
var IndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$4
});
var UsernameIndexRoute = Route$8.update({
	id: "/$username/",
	path: "/$username/",
	getParentRoute: () => Route$4
});
var ReschedulingsBookingIdRoute = Route$5.update({
	id: "/reschedulings/$bookingId",
	path: "/reschedulings/$bookingId",
	getParentRoute: () => Route$4
});
var CancellationsBookingIdRoute = Route$6.update({
	id: "/cancellations/$bookingId",
	path: "/cancellations/$bookingId",
	getParentRoute: () => Route$4
});
var ApiPingRoute = Route$2.update({
	id: "/api/ping",
	path: "/api/ping",
	getParentRoute: () => Route$4
});
var ApiOgRoute = Route$1.update({
	id: "/api/og",
	path: "/api/og",
	getParentRoute: () => Route$4
});
var UsernameEventTypeIndexRoute = Route$7.update({
	id: "/$username/$eventType/",
	path: "/$username/$eventType/",
	getParentRoute: () => Route$4
});
var ApiAppVersionRoute = Route.update({
	id: "/api/app/version",
	path: "/api/app/version",
	getParentRoute: () => Route$4
});
var rootRouteChildren = {
	IndexRoute,
	SuccessRoute,
	ApiOgRoute,
	ApiPingRoute,
	CancellationsBookingIdRoute,
	ReschedulingsBookingIdRoute,
	UsernameIndexRoute,
	UsernameEventTypeBookRoute: Route$9.update({
		id: "/$username/$eventType/book",
		path: "/$username/$eventType/book",
		getParentRoute: () => Route$4
	}),
	ApiAppVersionRoute,
	UsernameEventTypeIndexRoute
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	const queryClient = new QueryClient({ defaultOptions: { queries: {
		staleTime: 60 * 1e3,
		refetchOnWindowFocus: false
	} } });
	return routerWithQueryClient(createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultViewTransition: true
	}), queryClient);
}
//#endregion
export { getRouter };
