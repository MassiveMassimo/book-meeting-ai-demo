# TanStack Start Port Plan — `book-meeting-ai-demo`

This plan ports `/Users/imo/Documents/GitHub/book-meeting-ai-demo/` (Next.js 16 App Router, single-app repo) to TanStack Start, modeled on the conventions used in `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/`. Conventions inherited: file-based routes under `src/routes/`, file route handlers for APIs, TanStack Query for data, Jotai for client state, Vite + Nitro build, `@vercel/og` for OG images, oxlint/oxfmt tooling. One **deliberate divergence**: this demo's public URL contract is `/{lang}/...`, so the port keeps the `$lang` segment (neo's production book app strips it and uses cookies/Accept-Language). That contract must not regress.

---

## 1. File / route mapping

| Next.js source | TanStack Start target | Notes |
|---|---|---|
| `app/page.tsx` | `src/routes/index.tsx` | Redirects to `/{detectedLocale}` via `beforeLoad`. |
| `app/[lang]/layout.tsx` | `src/routes/$lang/route.tsx` (pathless layout for the `$lang` group) | Owns `<html lang>`, `GradientBackground`, footer logo, `LanguageSwitcher`, `Toaster`. `beforeLoad` validates `$lang` and calls `setLocale($lang)`. |
| `app/[lang]/page.tsx` | `src/routes/$lang/index.tsx` | Landing. |
| `app/[lang]/[username]/page.tsx` | `src/routes/$lang/$username/index.tsx` | Loader: `fetchUserAppointments(params.username)`. |
| `app/[lang]/[username]/[eventType]/page.tsx` | `src/routes/$lang/$username/$eventType/index.tsx` | Loader: `fetchSingleAppointment(params.username, params.eventType)`. `head()` builds OG meta with `ogImageUrl(...)`. |
| `app/[lang]/[username]/[eventType]/book/page.tsx` | `src/routes/$lang/$username/$eventType/book/index.tsx` | Loader pulls same single appointment. `validateSearch` (zod) for `slot`/`tz`/`date` query params currently read via `useSearchParams`. |
| `app/[lang]/[username]/[eventType]/book/BookingForm.tsx` | `src/routes/$lang/$username/$eventType/book/-components/booking-form.tsx` | Client component (no `"use client"` needed). |
| `app/[lang]/success/page.tsx` + `SuccessContent.tsx` | `src/routes/$lang/success/index.tsx` | `validateSearch` for `bookingId`, `lang`, etc. |
| `app/[lang]/cancellations/[bookingId]/page.tsx` + `CancelForm.tsx` | `src/routes/$lang/cancellations/$bookingId/index.tsx` + `-components/cancel-form.tsx` | Loader `fetchBookingDetails(params.bookingId)`. |
| `app/[lang]/reschedulings/[bookingId]/{page,RescheduleInterface,RescheduleForm}.tsx` | `src/routes/$lang/reschedulings/$bookingId/index.tsx` + `-components/{reschedule-interface,reschedule-form}.tsx` | Same pattern. |
| `app/api/ping/route.ts` | `src/routes/api/ping.ts` | File route with `server.handlers.GET`. |
| `app/api/app/version/route.ts` | `src/routes/api/app/version.ts` | Same. |
| `app/api/og/route.tsx` | `src/routes/api/og.tsx` | Lift the implementation **straight from `neo-meeting-ai/apps/book/src/routes/api/og.tsx`** — it's already a direct port of this demo's OG route. |
| `app/[lang]/dictionaries/{en,id,...}.json` (9 files) | `src/i18n/locales/{en,id,...}/booking.json` | Move dicts into i18next-compatible namespaces. |
| `app/[lang]/dictionaries.ts` | `src/i18n/index.ts` (init) + `src/i18n/resources.ts` | Replace bespoke loader with i18next. |
| `app/globals.css` | `src/styles.css` | Same content; imported via `?url` in `__root.tsx`. |
| `middleware.ts` (locale redirect) | Removed. Logic moves to `src/routes/index.tsx` `beforeLoad` (and `__root.tsx` for cookie write). |
| `app/icon.svg`, `public/*` | `public/*` (unchanged) | Move root `icon.svg` into `public/`. |
| `next.config.ts`, `open-next.config.ts`, `wrangler.jsonc`, `Dockerfile`, `entrypoint.sh`, `ecosystem.config.js` | Drop OpenNext/wrangler. Keep `Dockerfile`/`entrypoint.sh`/`ecosystem.config.js` retargeted at `node dist/nitro/server/index.mjs`. | |
| `next-env.d.ts` | Remove. Replace with `tanstack-start-env.d.ts` if any module augmentation needed. |
| `components/*`, `hooks/*`, `contexts/*`, `lib/*` | Move under `src/components`, `src/hooks`, `src/contexts`, `src/lib`. | `lib/mocks.ts`, `lib/api-helpers.ts`, `lib/api-mappers.ts`, `lib/types/*` preserved bit-for-bit. |
| `components/theme-provider.tsx` (next-themes) | `src/components/theme-provider.tsx` reusing `next-themes` package | `next-themes` works in any React app; we keep it. Listed in the "drop" candidates but **keeping it is simpler**. |

Subfolders prefixed with `-` (e.g. `-components/`, `-lib/`) are TanStack's convention for "not a route" — copied from neo book.

---

## 2. Dependency diff

**Add** (versions match `apps/book/package.json` so the team's lockfile stays coherent):

```
@tanstack/react-router          latest
@tanstack/react-start           latest
@tanstack/react-router-with-query  ^1.130.17
@tanstack/react-query           ^5.100.6
@tanstack/react-router-devtools latest
@tanstack/react-devtools        latest
@tanstack/devtools-vite         latest        (devDep)
@vitejs/plugin-react            ^6.0.1        (devDep)
@tailwindcss/vite               ^4.2.4
nitro                           3.0.260429-beta
vite                            ^8.0.10       (devDep)
i18next                         ^26.0.8
react-i18next                   ^17.0.6
i18next-browser-languagedetector ^8.2.1
jotai                           ^2.19.1
@fontsource-variable/plus-jakarta-sans  ^5.2.8
oxlint, oxfmt                                 (devDep, replaces eslint+prettier)
```

`@vercel/og` is already present — keep it.

**Drop**:

```
next                            16.1.6
eslint-config-next              16.1.6
@opennextjs/cloudflare          1.16.0
wrangler                        ^4.61.0
@formatjs/intl-localematcher    0.8.0    (replaced by i18next-browser-languagedetector + resolveLocale)
negotiator + @types/negotiator           (locale detection lives in beforeLoad now)
@tailwindcss/postcss                     (replaced by @tailwindcss/vite)
eslint, prettier, prettier-plugin-tailwindcss, @ianvs/prettier-plugin-sort-imports
```

**Keep**: `next-themes` (works framework-agnostically), all Radix primitives, `motion`, `vaul`, `cmdk`, `sonner`, `swr` (or migrate `swr` callsites to `@tanstack/react-query` if any — audit first), `react-hook-form`, `zod`, `date-fns`, `date-fns-tz`, `countries-and-timezones`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `tailwindcss` v4, `react`/`react-dom` 19.

**Scripts** (replace in `package.json`):

```
"dev":       "vite dev"
"build":     "vite build"
"start":     "node dist/nitro/server/index.mjs"
"typecheck": "node scripts/generate-route-tree.mjs && tsc --noEmit"
"lint":      "oxlint"
"fmt:check": "oxfmt --check"
```

Remove `cf-build`, `cf-preview`, `cf-deploy`, `cf-typegen`.

---

## 3. i18n strategy

Locale lives in the URL: `/{lang}/...` where `lang ∈ {en, id, ms, de, es, fr, pt, ko, ja}`. Keep this contract — it's user-shareable.

1. **Package layout** (mirrors `packages/i18n` but stays in-repo since this is a single-app demo):
   - `src/i18n/locales/{lang}/booking.json` — port each dict.
   - `src/i18n/config.ts` exports `SUPPORTED_LOCALES`, `DEFAULT_LOCALE = "en"`, `NAMESPACES = ["booking"]`, `resolveLocale(input: string): Locale`.
   - `src/i18n/resources.ts` statically imports all 9 JSONs and assembles the i18next resources object.
   - `src/i18n/index.ts` — copy verbatim from `neo-meeting-ai/apps/book/src/i18n/index.ts`. Exports `setLocale(locale)`.

2. **Root route (`src/routes/__root.tsx`)** — copy neo's `__root.tsx`; remove Sentry until later; import `"@/i18n"` at top so init runs on both server and client.

3. **`src/routes/$lang/route.tsx`** (pathless layout route under the segment):

   ```ts
   export const Route = createFileRoute("/$lang")({
     beforeLoad: ({ params }) => {
       const resolved = resolveLocale(params.lang)
       if (resolved !== params.lang) throw redirect({ to: `/${resolved}` })
       setLocale(resolved)
     },
     component: LangLayout,
   })
   ```

   `LangLayout` renders the chrome currently in `app/[lang]/layout.tsx` (GradientBackground, max-width card, footer logo, LanguageSwitcher) and `<Outlet />`.

4. **Root redirect** `src/routes/index.tsx` — `beforeLoad` reads `Accept-Language` (server: from the request via TanStack Start's `getRequestHeaders()`; client: `navigator.language`) and the `locale` cookie, picks a locale with the same algorithm as today's `middleware.ts`, then `throw redirect({ to: `/${locale}` })`. This collapses the Next middleware into a route hook — no middleware needed.

5. **In-component usage** — replace every `dict.foo.bar` lookup with `const { t } = useTranslation("booking"); t("foo.bar")`. The Next.js dictionary JSON shape can be preserved (nested keys); i18next handles `.`-separated paths natively. Interpolation tokens currently use `{name}` style — match this by configuring i18next with `interpolation: { prefix: "{", suffix: "}" }` exactly as neo book does (line 16 of its `src/i18n/index.ts`).

6. **`generateStaticParams` for langs** has no TanStack equivalent and is unnecessary at runtime (no prerender required for the demo). If pre-rendering is wanted later, use TanStack Start's `prerender` plugin option per route.

---

## 4. Data loading: server components → route loaders

Today every `app/.../page.tsx` is an async server component that calls `lib/api-helpers.ts` (already mocked) and passes data to a client child. The replacement pattern, per route:

```ts
// src/routes/$lang/$username/$eventType/index.tsx
const apptQuery = (username: string, slug: string) =>
  queryOptions({
    queryKey: ["singleAppointment", username, slug],
    queryFn: () => fetchSingleAppointment(username, slug),
  })

export const Route = createFileRoute("/$lang/$username/$eventType/")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(apptQuery(params.username, params.eventType)),
  head: ({ loaderData, params }) => ({ meta: buildMeta({ ... }) }),
  component: EventTypeRoute,
})
```

`lib/api-helpers.ts`, `lib/mocks.ts`, `lib/api-mappers.ts` are **preserved unchanged**. The loader runs on the server during SSR and on the client during navigation — exactly what the team wants for a demo with mock data (no real network).

Each leaf component uses `Route.useLoaderData()` instead of receiving props from a server component. For client-only mock writes (e.g. `localStorage`-backed booking creation), call mocks directly inside the form's `onSubmit` — they're already isomorphic.

**Mutations** (cancel, reschedule, create booking) become `useMutation` from TanStack Query, invalidating `["singleAppointment", ...]` or `["bookingDetails", id]` on success and using `router.navigate({ to: "/$lang/success", params, search: { bookingId } })` for post-submit redirects.

---

## 5. Next API replacements

| Next API | TanStack Start replacement |
|---|---|
| `useSearchParams()` | `Route.useSearch()` after declaring `validateSearch: z.object({...})` on the route. Strongly typed; the runtime parser also normalizes. |
| `useRouter().push(...)` | `useRouter().navigate({ to, params, search })` or `useNavigate()`. |
| `useRouter().refresh()` | `router.invalidate()` (or refetch the specific query). |
| `next/link` | `import { Link } from "@tanstack/react-router"` — same `to`/`params`/`search` API. |
| `next/image` | Replace each `<Image>` with `<Img>` from `src/components/ui/img.tsx` (port from neo book — sets `loading="lazy"` + `decoding="async"`, accepts `priority`). The Next image optimizer pipeline is dropped; `public/` assets are served directly by Nitro. Re-export sizes as plain width/height attributes. |
| `next/font/google` (`Plus_Jakarta_Sans`) | `@fontsource-variable/plus-jakarta-sans` imported once in `__root.tsx` (`import "@fontsource-variable/plus-jakarta-sans/index.css"`). The CSS variable `--font-sans` is set in `src/styles.css` (`@theme { --font-sans: 'Plus Jakarta Sans Variable', ... }`). |
| `Metadata` / `generateMetadata` | Per-route `head: ({ loaderData, params, match }) => ({ meta: [...], links: [...] })`. Build helpers (`buildMeta`, `metadataString`, `ogImageUrl`) — copy from `neo-meeting-ai/apps/book/src/seo/build-meta.ts` verbatim. |
| `cookies()` / server cookies | TanStack Start's `getRequestHeaders()` / `getEvent()` inside a loader, or `document.cookie` on the client (already used for locale persistence in neo's `setLocale`). |
| `redirect()` from `next/navigation` | `throw redirect({ to, params })` from `@tanstack/react-router` inside `beforeLoad` / `loader`. |
| Edge runtime middleware | Inline into `beforeLoad` on `src/routes/index.tsx` (locale detection) and `src/routes/$lang/route.tsx` (validation). No global middleware. |

---

## 6. OG image route

`@vercel/og`'s `ImageResponse` runs unmodified inside a TanStack Start file-route handler — neo book proves this. Copy `neo-meeting-ai/apps/book/src/routes/api/og.tsx` directly into the demo. Only changes:

- Replace the import `resources, resolveLocale` from `@meetingai/i18n` with `from "@/i18n/resources"` and `from "@/i18n/config"`.
- Update `OG_HILLS_URL` / `FALLBACK_LOGO_URL` if the demo wants self-hosted assets in `public/` instead of `assets.meeting.ai`.

No Satori-direct fallback needed. No edge runtime requirement; Nitro Node serves it fine.

---

## 7. Build / deploy changes

**`vite.config.ts`** (new file; can shrink neo's version since no Sentry yet):

```ts
import { defineConfig } from "vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import { nitro } from "nitro/vite"
import { devtools } from "@tanstack/devtools-vite"

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
})
```

**`src/router.tsx`** — copy neo's, drop the Sentry call.

**`tsconfig.json`** — change `module` to `ESNext`, set `moduleResolution: "Bundler"`, add `"@/*": ["./src/*"]` path. Remove Next plugin block.

**Delete** (no longer needed):

- `next.config.ts`
- `open-next.config.ts`
- `wrangler.jsonc`
- `next-env.d.ts`
- `middleware.ts`
- `eslint.config.mjs` (oxlint config replaces it: `oxlint.config.ts` + `oxfmt.config.ts` cribbed from neo)
- `postcss.config.mjs` (Tailwind v4 vite plugin handles PCSS)

**Keep but retarget**:

- `Dockerfile` — base image stays Node; replace `next build && next start` with `pnpm build && node dist/nitro/server/index.mjs`.
- `entrypoint.sh` — same Nitro entry.
- `ecosystem.config.js` — point PM2 at `dist/nitro/server/index.mjs`.
- `generate-changelog.sh`, `CHANGELOG.md`, `README.md`, `WARP.md` — content-only.

Dev server: `pnpm dev` on port 3000 (auto-increments). Production: `pnpm build` emits `dist/nitro/server/index.mjs`; `pnpm start` runs it.

---

## 8. Risk list

1. **`next/image` removal regresses LCP.** The demo's hero illustration and logo rely on next/image's `priority` hoisting + automatic AVIF/WebP. The `<Img>` wrapper from neo book doesn't optimize — it only sets loading hints. **Mitigation**: pre-generate WebP variants for assets that matter (hero, logo, `og-image.jpg`) and serve from `public/`. Measure LCP on a representative route before/after.

2. **Suspense boundaries around `useSearchParams`.** Several client components in the demo currently wrap their search-param-consuming children in `<Suspense>` because Next 16 requires it. After the port, `Route.useSearch()` is synchronous and the `<Suspense>` boundaries become dead weight (harmless but worth removing in cleanup pass — `LanguageSwitcher`, `SuccessContent`).

3. **`generateStaticParams` had implicit prefetch semantics.** Next was statically generating one HTML per locale × event type at build time when params were known. TanStack Start defaults to on-demand SSR. If perf-sensitive, enable per-route prerender via the start config later — but it's not required for the demo.

4. **Middleware → `beforeLoad` is per-route, not global.** The current middleware matcher excludes `_next`, `api`, and a hardcoded list of public files. After the port, the only routes that *can* be visited without a locale prefix are `/` (handled by the redirect in `src/routes/index.tsx`) and `/api/*` (no locale needed). Deep links like `/foo` (no locale, no match) need a 404 handler that detects "missing locale" and redirects — add a `NotFoundComponent` in `__root.tsx` that inspects the URL.

5. **`useRouter` semantics differ.** Next's `router.push` does shallow client-side navigation; TanStack's `navigate` revalidates loaders by default. Forms that currently `router.push("/success?bookingId=X")` will trigger the success route's loader — that's correct, but anywhere the demo relies on *not* re-running data fetches on navigation needs explicit `loaderDeps` discipline.

6. **`next-themes` SSR flash.** Without Next's automatic `<script>` injection for the `class` attribute, the theme provider may flash on first paint. **Mitigation**: in `__root.tsx` `shellComponent`, inline a 3-line script that reads `localStorage.theme` and sets `<html class>` before hydration (`next-themes` ships this snippet — just paste it manually).

7. **Edge runtime features (`experimental-edge`).** The middleware declares `runtime = "experimental-edge"`. None of its current logic (cookie read, Negotiator, intl-localematcher) requires edge — it all runs fine in Nitro Node. **Mitigation**: nothing to do; just confirm no callsite expects edge-only globals.

8. **`useFormStatus` / `useActionState` / Server Actions.** Quick grep needed — if any form uses Next/React server actions, they need rewriting as `useMutation` against the mock layer. Likely zero usage given the mock-only architecture, but verify before merging.

9. **Route tree generation race.** TanStack's `routeTree.gen.ts` is generated at dev/build time. CI must run `vite build` (or the dedicated `scripts/generate-route-tree.mjs` from neo book) **before** `tsc --noEmit`. Copy neo's `package.json` typecheck script verbatim.

10. **Search param schemas.** Several routes today read params without validation (`?slot=...`, `?bookingId=...`). Adding `validateSearch` with zod is *better*, but if a current external link uses an unexpected query string the route will throw. Use `.passthrough()` or mark fields optional during the port; tighten in a follow-up.

---

## Suggested execution order

1. Land toolchain: `vite.config.ts`, `tsconfig.json`, new `package.json`, `src/styles.css`, `src/router.tsx`, `src/routes/__root.tsx`, `src/i18n/*`.
2. Port `lib/` and `components/` unchanged into `src/lib`, `src/components`.
3. Port routes in dependency order: `__root` → `$lang/route` → `$lang/index` → `$lang/$username/index` → `$lang/$username/$eventType/index` → `book/` → `success/` → `cancellations/` → `reschedulings/` → `api/{og,ping,version}`.
4. Add root `index.tsx` with locale-detect redirect.
5. Delete Next config files + middleware in the same commit that flips `dev` script to vite.
6. Run `pnpm typecheck && pnpm lint && pnpm dev`, click through every route on every locale, then update `Dockerfile` + PM2 config.

---

### Critical files for implementation

- `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/vite.config.ts`
- `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/src/routes/__root.tsx`
- `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/src/routes/api/og.tsx`
- `/Users/imo/Documents/GitHub/neo-meeting-ai/apps/book/src/i18n/index.ts`
- `/Users/imo/Documents/GitHub/book-meeting-ai-demo/middleware.ts` (the logic to be inlined into `src/routes/index.tsx` `beforeLoad`)
- `/Users/imo/Documents/GitHub/book-meeting-ai-demo/lib/api-helpers.ts` (preserved as-is; consumed by loaders)
