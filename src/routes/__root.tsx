import "@fontsource-variable/plus-jakarta-sans/index.css"
import type { QueryClient } from "@tanstack/react-query"
import appCss from "../styles.css?url"
import { QueryClientProvider } from "@tanstack/react-query"
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Toaster } from "sonner"
import { GradientBackground } from "@/components/GradientBackground"
import { ThemeProvider } from "@/components/theme-provider"

const DEFAULT_TITLE = "Book a Meeting — Schedule Now"
const DEFAULT_DESCRIPTION =
	"Ready to connect? Schedule a meeting. Pick your time slot and book instantly with Meeting.ai."

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: DEFAULT_TITLE },
			{ name: "description", content: DEFAULT_DESCRIPTION },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
			{ rel: "alternate icon", href: "/favicon.ico" },
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
		],
	}),
	component: RootLayout,
	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
				{/* Prevent FOUC: apply stored theme class before first paint */}
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
					}}
				/>
			</head>
			<body className="relative flex min-h-screen flex-col antialiased">
				{children}
				<Scripts />
			</body>
		</html>
	)
}

function RootLayout() {
	const { queryClient } = Route.useRouteContext()
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<GradientBackground />
				<main className="relative z-0 flex min-h-dvh w-full flex-col items-center p-3 xl:justify-center">
					<div className="from-background to-secondary flex min-h-0 w-full max-w-6xl grow flex-col overflow-hidden rounded-3xl bg-linear-to-b inset-shadow-2xs inset-shadow-white/15 xl:h-[600px] xl:flex-none">
						<div className="flex min-h-0 grow flex-col overflow-y-auto xl:overflow-hidden">
							<Outlet />
						</div>
					</div>
					<div className="mt-3 flex shrink-0 items-center gap-1.5 pb-3 md:mt-6 md:gap-2 md:pb-4">
						<span className="text-xs text-white md:text-sm">Powered by</span>
						<img
							src="/meeting.ai-logo-white.svg"
							alt="meeting.ai"
							width={100}
							height={24}
							className="h-4 w-auto md:h-5"
						/>
					</div>
				</main>
				<Toaster richColors position="top-center" />
				{import.meta.env.DEV && <TanStackRouterDevtools />}
			</ThemeProvider>
		</QueryClientProvider>
	)
}
