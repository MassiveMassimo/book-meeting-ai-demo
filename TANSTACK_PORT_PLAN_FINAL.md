# TanStack Start Port Plan — FINAL

Merged from V1 (`TANSTACK_PORT_PLAN.md`) and V2 (`TANSTACK_PORT_PLAN_V2.md`), updated for current repo state (i18n already removed — flat routes, `lib/copy.ts` static dict).

Reference implementation: `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/`.

## 0. Current state (post-i18n-removal)

- Flat routes under `app/` — no `[lang]` segment.
- `lib/copy.ts` exports static `dict` (re-exports `lib/copy.en.json`). Used as `dict.foo.bar` everywhere.
- No `middleware.ts`, no `app/dictionaries/`, no `@formatjs/intl-localematcher` / `negotiator`.
- Existing files preserved verbatim during port: `lib/mocks.ts`, `lib/api-helpers.ts`, `lib/api-client.ts`, `lib/api-mappers.ts`, `lib/types/*`, `lib/utils*`, `lib/constants.ts`, `lib/timezone-flags.ts`, `lib/copy.ts`, `lib/copy.en.json`, all `components/*` (except need `next/image`/`next/link` swaps), all `hooks/*`.

## 1. Route mapping (no `$lang`)

| Next.js source | TanStack Start target |
|---|---|
| `app/layout.tsx` | `src/routes/__root.tsx` |
| `app/page.tsx` | `src/routes/index.tsx` |
| `app/[username]/page.tsx` | `src/routes/$username/index.tsx` |
| `app/[username]/[eventType]/page.tsx` | `src/routes/$username/$eventType/index.tsx` |
| `app/[username]/[eventType]/book/page.tsx` + `BookingForm.tsx` | `src/routes/$username/$eventType/book.tsx` + `src/routes/$username/$eventType/-components/booking-form.tsx` |
| `app/success/page.tsx` + `SuccessContent.tsx` | `src/routes/success.tsx` + `src/routes/-components/success-content.tsx` |
| `app/cancellations/[bookingId]/page.tsx` + `CancelForm.tsx` | `src/routes/cancellations/$bookingId.tsx` + `-components/cancel-form.tsx` |
| `app/reschedulings/[bookingId]/{page,RescheduleInterface,RescheduleForm}.tsx` | `src/routes/reschedulings/$bookingId.tsx` + `-components/{reschedule-interface,reschedule-form}.tsx` |
| `app/api/ping/route.ts` | `src/routes/api/ping.ts` (server route) |
| `app/api/app/version/route.ts` | `src/routes/api/app/version.ts` |
| `app/api/og/route.tsx` | `src/routes/api/og.tsx` |
| `app/globals.css` | `src/styles.css` |
| `app/icon.svg` | `public/icon.svg` |
| `components/*`, `hooks/*`, `lib/*` | `src/components/*`, `src/hooks/*`, `src/lib/*` (verbatim except `next/*` imports) |

Subfolder convention: `-components/`, `-lib/` for non-route siblings (TanStack convention).

V2 preference adopted: prefer concrete `book.tsx` / `$bookingId.tsx` over `book/index.tsx` folders when there are no children.

## 2. Dependency diff

**Add (runtime):**

```
@tanstack/react-router               latest
@tanstack/react-start                latest
@tanstack/react-router-with-query    ^1.130
@tanstack/react-query                ^5.100
@fontsource-variable/plus-jakarta-sans ^5.2
```

**Add (dev):**

```
@tanstack/react-router-devtools      latest
@tanstack/devtools-vite              latest
@tailwindcss/vite                    ^4.2
@vitejs/plugin-react                 ^6
nitro                                3.0.260429-beta
vite                                 ^8
oxlint                               (replaces eslint)
oxfmt                                (replaces prettier)
```

**Drop:**

```
next
eslint-config-next
@opennextjs/cloudflare
wrangler
@tailwindcss/postcss
eslint, prettier, prettier-plugin-tailwindcss, @ianvs/prettier-plugin-sort-imports
```

**Keep:** `@vercel/og`, all `@radix-ui/*`, `next-themes` (framework-agnostic), `motion`, `vaul`, `cmdk`, `sonner`, `swr` (audit — may migrate to TanStack Query later), `react-hook-form`, `zod`, `date-fns`, `date-fns-tz`, `countries-and-timezones`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `tailwindcss` v4, `react`/`react-dom` 19.

Set `"type": "module"` in `package.json`.

**Scripts:**

```
"dev":       "vite dev"
"build":     "vite build"
"start":     "node dist/nitro/server/index.mjs"
"typecheck": "tsc --noEmit"
"lint":      "oxlint"
"fmt":       "oxfmt"
```

## 3. No i18n

The repo already lost i18n. Skip every i18n step from V1/V2. `dict` from `@/lib/copy` stays as the sole copy source. Components read `dict.foo.bar` synchronously — no `useTranslation`, no `setLocale`, no `Accept-Language` negotiation, no `$lang` route.

## 4. Data loading: server components → route loaders

The mock layer in `lib/api-helpers.ts` is isomorphic — runs identically on server or client. Two acceptable patterns:

**Option A (simple — chosen for this port):** Call mock functions directly inside loaders. No `createServerFn` wrapping. Keeps the demo trivially swappable for real fetchers later.

```ts
// src/routes/$username/$eventType/index.tsx
const apptQuery = (username: string, slug: string) =>
  queryOptions({
    queryKey: ["singleAppointment", username, slug],
    queryFn: () => fetchSingleAppointment(username, slug),
    staleTime: 60_000,
  });

export const Route = createFileRoute("/$username/$eventType/")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(apptQuery(params.username, params.eventType)),
  head: ({ loaderData, params }) => ({ meta: buildMeta({ ... }) }),
  component: EventTypeRoute,
});
```

Components read via `Route.useLoaderData()` or `useSuspenseQuery(apptQuery(...))`.

**Client-only reads** (`fetchBookingDetailsClient` — localStorage): skip loader; use `useQuery` with `enabled: typeof window !== "undefined"`. Today's "server returns null, client hydrates" pattern is preserved.

**Mutations** (cancel / reschedule / create booking): `useMutation` → invalidate keys on success → `router.navigate({ to: "/success", search: { bookingId } })`.

## 5. Next API → TanStack Start replacements

| Next | TanStack Start |
|---|---|
| `useSearchParams()` | `Route.useSearch()` with `validateSearch: z.object({...})` |
| `useRouter().push()` | `useRouter().navigate({ to, params, search })` |
| `useRouter().refresh()` | `router.invalidate()` |
| `next/link` | `import { Link } from "@tanstack/react-router"` |
| `next/image` | `<Img>` wrapper at `src/components/ui/img.tsx` (sets `loading="lazy"` + `decoding="async"`; `priority` opts into `fetchpriority="high"`) |
| `next/font` (`Plus_Jakarta_Sans`) | `@fontsource-variable/plus-jakarta-sans` imported once in `__root.tsx` |
| `Metadata` / `generateMetadata` | `head: ({ loaderData, params }) => ({ meta: [...], links: [...] })` |
| `cookies()` / `next/headers` | `getRequestHeaders()` from `@tanstack/react-start/server` |
| `redirect()` from `next/navigation` | `throw redirect({ to })` inside `beforeLoad`/`loader` |
| `notFound()` | `throw notFound()`; render via route `notFoundComponent` |
| `usePathname()` | `useLocation().pathname` from `@tanstack/react-router` |
| `revalidate: 60` on fetch | `staleTime: 60_000` on the query |
| `useFormStatus` / `useActionState` / Server Actions | Audit — should be zero usage; if any, rewrite as `useMutation` |

## 6. OG image route

`@vercel/og`'s `ImageResponse` works in a TanStack Start server route (Nitro Node preset has Web Streams + fetch). Port `app/api/og/route.tsx`:

```ts
// src/routes/api/og.tsx
import { createServerFileRoute } from "@tanstack/react-start/server";
import { ImageResponse } from "@vercel/og";

export const ServerRoute = createServerFileRoute("/api/og").methods({
  GET: async ({ request }) => {
    // ... existing fetchAsDataUrl + render logic from app/api/og/route.tsx
    return new ImageResponse(<OgCard ... />, { width: 1200, height: 630 });
  },
});
```

Current OG route uses `dict` from `@/lib/copy` — that import stays.

## 7. Build / config

**`vite.config.ts`** (new):

```ts
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import { devtools } from "@tanstack/devtools-vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: Number(process.env.PORT) || 3000 },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({ router: { tmpDir: "./dist/tmp" } }),
    nitro(),
    viteReact(),
  ],
  nitro: { output: { dir: "dist/nitro" } },
});
```

**`src/router.tsx`** — copy neo's, drop Sentry. Wraps router with TanStack Query.

**`src/routes/__root.tsx`** — copy neo's structurally. Drop i18n init import. Drop Sentry. Include:
- `@fontsource-variable/plus-jakarta-sans` import
- `next-themes` provider (port to client-only mount; inline the FOUC-prevention script in `shellComponent`)
- `<Toaster>` from sonner
- All chrome currently in `app/layout.tsx` (GradientBackground, footer logo) minus `LanguageSwitcher`
- `?url` import for `src/styles.css`

**`tsconfig.json`** — `module: "ESNext"`, `moduleResolution: "Bundler"`, keep `"@/*": ["./src/*"]` path. Remove Next plugin block.

**Delete:**
- `next.config.ts`
- `open-next.config.ts` (if present)
- `wrangler.jsonc` (if present)
- `next-env.d.ts`
- `eslint.config.mjs`
- `postcss.config.mjs`
- `.prettierrc*`

**Retarget:** `Dockerfile` (if present) → `node dist/nitro/server/index.mjs`. `entrypoint.sh`, `ecosystem.config.js` (if present) — same target.

## 8. Risk list (post-i18n-strip)

1. **`next/image` removal** — pre-generate WebP for hero/logo/`og-image.jpg` if LCP regresses. Likely fine for this demo.
2. **`next-themes` SSR flash** — paste the 3-line localStorage-read script into `shellComponent` to set `<html class>` before hydration.
3. **`useSearchParams` Suspense boundaries** — `Route.useSearch()` is synchronous; suspense wrappers in `LanguageSwitcher` (deleted) and `SuccessContent` become dead. Drop them.
4. **`useRouter` semantics** — TanStack's `navigate` revalidates loaders by default; Next's `push` was shallow. Forms that `router.push("/success?bookingId=X")` will re-run the success loader. Verify.
5. **`useSuspenseQuery` keys must match loader keys** exactly — extract `queryOptions(...)` helpers per route to avoid drift.
6. **localStorage during SSR** — `fetchBookingDetailsClient` reads `window.localStorage`. Already gated today; keep the gate.
7. **Route tree generation** (`routeTree.gen.ts`) — generated at dev/build. Gitignore it. CI: run `vite build` (or `scripts/generate-route-tree.mjs` from neo) before `tsc --noEmit`.
8. **Search-param schemas are load-bearing** — every `useSearchParams` call site needs a matching `validateSearch` zod schema or routes throw. Use `.optional()` / `.passthrough()` during port, tighten later.
9. **Public URL stability** — `/$username/$eventType/book` is the externally-shared shape. Don't rename.
10. **`@vercel/og` font** — current OG route uses system font (no custom font load). Stays that way.

## 9. Execution order — discrete tasks

Each task is independent-ish; intended for sequential subagent dispatch.

### Phase A — Toolchain bootstrap (no behavior change yet)

**Task A1 — Project scaffolding**
- Create `src/` directory.
- Move `lib/`, `components/`, `hooks/` → `src/lib/`, `src/components/`, `src/hooks/` (verbatim; do not yet rewrite `next/*` imports).
- Move `app/globals.css` → `src/styles.css`.
- Move `app/icon.svg` → `public/icon.svg`.
- Update `tsconfig.json` paths: `"@/*": ["./src/*"]`, `module: "ESNext"`, `moduleResolution: "Bundler"`. Remove `plugins: [{ name: "next" }]` if present.
- Set `"type": "module"` in `package.json`.

**Task A2 — Install/remove deps & scripts**
- Drop: `next`, `eslint-config-next`, `@opennextjs/cloudflare`, `wrangler`, `@tailwindcss/postcss`, `eslint`, `prettier`, `prettier-plugin-tailwindcss`, `@ianvs/prettier-plugin-sort-imports`.
- Add runtime: `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/react-router-with-query`, `@tanstack/react-query`, `@fontsource-variable/plus-jakarta-sans`.
- Add dev: `@tanstack/react-router-devtools`, `@tanstack/devtools-vite`, `@tailwindcss/vite`, `@vitejs/plugin-react`, `nitro@3.0.260429-beta`, `vite@^8`, `oxlint`, `oxfmt`.
- Replace scripts as in §2.
- Run `pnpm install`; verify lockfile resolves.

**Task A3 — Vite config & router shell**
- Write `vite.config.ts` (§7).
- Write `src/router.tsx` — adapt from `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/src/router.tsx`, drop Sentry.
- Write `src/routes/__root.tsx` — adapt from neo-book's `__root.tsx`:
  - Drop i18n init imports.
  - Drop Sentry.
  - Keep `@fontsource-variable/plus-jakarta-sans` import.
  - Include `ThemeProvider` from `next-themes` (paste the FOUC-prevention `<script>` inline in `shellComponent`).
  - Render the chrome from current `app/layout.tsx` (GradientBackground, footer logo) but NOT `LanguageSwitcher` (already removed).
  - Include `<Toaster>` from sonner.
  - Mount `<Outlet />` and devtools.
  - Import `?url` `src/styles.css`.
- Delete `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.prettierrc*` (if exist).
- Add `routeTree.gen.ts` to `.gitignore`.

**Task A4 — `<Img>` wrapper + asset moves**
- Create `src/components/ui/img.tsx` per neo-book convention.
- Find all `next/image` imports → swap to `<Img>` and inline `width`/`height` as attributes. Audit `priority` usage.
- Find all `next/link` imports → swap to `@tanstack/react-router` `<Link to=... params=...>`.
- Find all `next/font` usage → remove; rely on `@fontsource-variable/plus-jakarta-sans` global.
- Find all `next/navigation` imports (`useRouter`, `usePathname`, `useSearchParams`, `redirect`, `notFound`) — list them (don't rewrite yet; tasks B*/C* handle per-route).
- Find all `next/headers` imports — list them.

### Phase B — Routes (leaf-first)

For each route task: write `src/routes/...` per the §1 mapping; declare `validateSearch` for any `useSearchParams` reads; swap `next/*` callsites; preserve component visuals exactly. Each task ends with `pnpm typecheck && pnpm dev` smoke-test of that route via portal.

**Task B1 — Root index route + landing**
- `src/routes/index.tsx` from `app/page.tsx` (landing page content).
- No loader needed (landing is static).
- Verify portal: `/` renders landing with hero illustration + CTA.

**Task B2 — User profile route**
- `src/routes/$username/index.tsx` from `app/[username]/page.tsx`.
- `loader` calls `fetchUserAppointments(params.username)` via `ensureQueryData`.
- `head` builds title from data.
- Verify: `/imo` renders three events; `/nobody` renders not-found.

**Task B3 — Event detail route**
- `src/routes/$username/$eventType/index.tsx` from `app/[username]/[eventType]/page.tsx`.
- `loader` for single appointment.
- `head` with OG meta via `ogImageUrl()` helper.
- Verify: `/imo/quick-1-on-1` renders event card + "Book a meeting" CTA.

**Task B4 — Booking page + form**
- `src/routes/$username/$eventType/book.tsx`.
- `src/routes/$username/$eventType/-components/booking-form.tsx` from `BookingForm.tsx`.
- `validateSearch: z.object({ slot: z.string().optional(), tz: z.string().optional(), date: z.string().optional() })`.
- Loader: single appointment + user profile.
- Verify: navigate from event page → form renders with slot/date prefilled from query; submit creates `demo_*` booking in localStorage and redirects to `/success?bookingId=...`.

**Task B5 — Success page**
- `src/routes/success.tsx` + `-components/success-content.tsx` from `app/success/`.
- `validateSearch: z.object({ bookingId: z.string(), username: z.string().optional() })`.
- Verify: `/success?bookingId=demo_X` shows confirmation with copy/cancel/reschedule/"Book another" buttons.

**Task B6 — Cancellation route**
- `src/routes/cancellations/$bookingId.tsx` + `-components/cancel-form.tsx`.
- Loader: `fetchBookingDetails(params.bookingId)` (returns placeholder on SSR; client `useQuery` re-hydrates from localStorage).
- Verify: `/cancellations/demo_X` renders form; submit cancels and navigates to success/landing.

**Task B7 — Reschedule route**
- `src/routes/reschedulings/$bookingId.tsx` + `-components/{reschedule-interface,reschedule-form}.tsx`.
- Loader same as B6.
- Verify: `/reschedulings/demo_X` renders interface with calendar; submit reschedules to new slot.

**Task B8 — API routes**
- `src/routes/api/ping.ts` — port from `app/api/ping/route.ts` using `createServerFileRoute(...).methods({ GET })`.
- `src/routes/api/app/version.ts` — same.
- `src/routes/api/og.tsx` — port from `app/api/og/route.tsx`, preserving `fetchAsDataUrl` + the `<OgCard>` JSX. `dict` import from `@/lib/copy` stays.
- Verify: `curl /api/ping`, `curl /api/og` returns PNG.

### Phase C — Cleanup

**Task C1 — Delete Next residue**
- Remove `app/` directory entirely.
- Remove any stale `next-env.d.ts`, `next.config.*`, `open-next.config.ts`, `wrangler.jsonc`, `cloudflare-env.d.ts`.
- Remove old `eslint.config.mjs`, `.prettierrc*`, `postcss.config.mjs`.
- Write `oxlint.config.ts` + `oxfmt.config.ts` (crib from neo-book).
- Update `README.md` — change `pnpm dev` workflow if any commands changed; mention TanStack Start.

**Task C2 — Production smoke test**
- `pnpm build` → exit 0; `dist/nitro/server/index.mjs` exists.
- `pnpm start` on PORT=3010; curl all 7 routes; verify 200.
- Maestri portal end-to-end: pick slot → book → success → cancel.

**Task C3 — Final review**
- Spawn final code-reviewer subagent over the full diff vs `pre-tanstack-port` tag.

---

## Critical reference files

- `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/vite.config.ts`
- `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/src/router.tsx`
- `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/src/routes/__root.tsx`
- `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/src/routes/api/og.tsx`
- `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/src/components/ui/img.tsx`
- `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/tsconfig.json`
- `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/package.json` (version pins)
- `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/oxlint.config.ts` + `oxfmt.config.ts`
