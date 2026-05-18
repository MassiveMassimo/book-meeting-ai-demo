# TanStack Start Port Plan — `book-meeting-ai-demo` (V2)

A second, independent take. Written without reading V1. Target reference: `neo-meeting-ai/apps/book/`. The goal is a 1:1 port of the public booking surface to TanStack Start while removing every Next-specific seam (App Router, middleware, `next/*`, OpenNext/Cloudflare wrangler, `@vercel/og` Next route handler).

---

## 1. Route mapping

TanStack Start uses file-based routing under `src/routes/`. Folder syntax mirrors URL segments; `$param` is the path parameter token; layouts come from `route.tsx` files (pathless prefixes use a leading `_`); root shell lives at `src/routes/__root.tsx`.

The current Next routes all live under `app/[lang]/...`. In TanStack Start this collapses to a `_lang` pathless layout that owns `$lang` validation + locale priming, with concrete routes below it.

| Next.js (App Router) | TanStack Start file | Route id |
| --- | --- | --- |
| `app/layout.tsx` (root html) | `src/routes/__root.tsx` | `/` |
| `app/[lang]/layout.tsx` | `src/routes/$lang/route.tsx` | `/$lang` |
| `app/[lang]/page.tsx` (root redirect) | `src/routes/$lang/index.tsx` | `/$lang/` |
| `app/[lang]/[username]/page.tsx` | `src/routes/$lang/$username/index.tsx` | `/$lang/$username/` |
| `app/[lang]/[username]/[eventType]/page.tsx` | `src/routes/$lang/$username/$eventType/index.tsx` | `/$lang/$username/$eventType/` |
| `app/[lang]/[username]/[eventType]/book/page.tsx` | `src/routes/$lang/$username/$eventType/book.tsx` | `/$lang/$username/$eventType/book` |
| `app/[lang]/cancellations/[bookingId]/page.tsx` | `src/routes/$lang/cancellations/$bookingId.tsx` | `/$lang/cancellations/$bookingId` |
| `app/[lang]/reschedulings/[bookingId]/page.tsx` | `src/routes/$lang/reschedulings/$bookingId.tsx` | `/$lang/reschedulings/$bookingId` |
| `app/[lang]/success/page.tsx` | `src/routes/$lang/success.tsx` | `/$lang/success` |
| `app/api/og/route.tsx` | `src/routes/api/og.tsx` (server route, via `createServerFileRoute`) | `/api/og` |
| `middleware.ts` (locale redirect) | `src/routes/index.tsx` `beforeLoad` redirect + `$lang` validator | n/a |

Route-id alias: I prefer the concrete `book.tsx` over a nested `book/index.tsx` folder — one file is easier than two, the `[eventType]` segment already needs its own folder for sibling `index.tsx`.

Pathless wrapping (`_lang`) was considered and rejected: the locale needs to appear in the URL, so a real `$lang` segment is required. The pathless variant would only make sense if locale moved to a cookie-only model.

---

## 2. Dependencies — add / drop

Use the neo-book lockfile as the spec; pin to the same majors so vendor primitives compose.

**Add** (runtime):

```
@tanstack/react-router            latest
@tanstack/react-start             latest
@tanstack/react-router-with-query ^1.130
@tanstack/react-query             ^5.100
@tanstack/react-router-devtools   latest
@tailwindcss/vite                 ^4.2
nitro                             3.0.260429-beta
i18next                           ^26
react-i18next                     ^17
i18next-browser-languagedetector  ^8.2
jotai                             ^2.19
@fontsource-variable/plus-jakarta-sans ^5.2
@vercel/og                        ^0.6  (kept — usable in a server route)
```

**Add** (dev):

```
vite                              ^8
@vitejs/plugin-react              ^6
@tanstack/devtools-vite           latest
oxlint, oxfmt                     (replace ESLint stack)
```

**Drop**:

```
next
eslint-config-next
@opennextjs/cloudflare
wrangler
@formatjs/intl-localematcher
negotiator
@types/negotiator
next/font   (replaced by @fontsource-variable)
```

Keep: `react`/`react-dom` 19, `zod`, `date-fns`, `date-fns-tz`, `sonner`, `tailwind-merge`, `clsx`, `canvas-confetti`, `@tabler/icons-react`, `tailwindcss` v4, `tw-animate-css`, `countries-and-timezones`. Switch `package.json` to `"type": "module"`.

---

## 3. i18n strategy — replacing Negotiator middleware

The current `middleware.ts` does two jobs: (1) accept a cookie override; (2) negotiate from `Accept-Language` against a 9-locale allowlist using `intl-localematcher`. Neither survives a Vite/Nitro world unchanged — TanStack Start doesn't have App Router middleware, but it has equivalents that are actually nicer.

**Allowlist** lives in one place: `src/i18n/config.ts`.

```ts
export const SUPPORTED_LOCALES = ["en","id","ms","de","es","fr","pt","ko","ja"] as const;
export const DEFAULT_LOCALE = "en";
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const isLocale = (s: string): s is Locale =>
  (SUPPORTED_LOCALES as readonly string[]).includes(s);
```

**Layer 1 — root redirect for the locale-less case.** A server route at `src/routes/index.tsx` whose `beforeLoad` runs on the server, reads `Accept-Language` + cookie, picks a locale, and throws `redirect({ to: "/$lang", params: { lang } })`. No Negotiator needed for nine locales — a 30-line scorer (parse `Accept-Language`, split `;q=`, dedupe by primary subtag, match against allowlist) does it without a dependency. If you'd rather keep `intl-localematcher`, it's framework-agnostic and works fine in a Nitro handler.

```ts
// src/routes/index.tsx
export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const headers = getRequestHeaders();           // from @tanstack/react-start/server
    const cookie  = parseCookie(headers.cookie)?.locale;
    const lang    = (cookie && isLocale(cookie)) ? cookie : pickFromAcceptLang(headers["accept-language"]);
    throw redirect({ to: "/$lang", params: { lang } });
  },
});
```

**Layer 2 — `$lang` validator + i18n hydration.** `src/routes/$lang/route.tsx` validates the param and seeds i18next for both SSR and client. Invalid lang → throw `notFound()` (better than the silent-coerce middleware does today).

```ts
export const Route = createFileRoute("/$lang")({
  params: { parse: ({ lang }) => isLocale(lang) ? { lang } : (() => { throw notFound(); })() },
  beforeLoad: async ({ params }) => {
    await i18n.changeLanguage(params.lang);        // SSR-aware; also primes the client
    return { lang: params.lang };
  },
  component: LangLayout,
});
```

**Library**: `i18next` + `react-i18next`, configured once in `src/i18n/index.ts` (imported by `__root.tsx`). Replaces the hand-rolled `dictionaries.ts` setup. Translation JSON moves from `app/[lang]/dictionaries.ts` static imports to `src/i18n/locales/<lang>/*.json` with `resources` baked in at build time — no per-route dynamic import overhead, since nine locales × small JSON is trivial. The neo-book convention is one namespace per surface (`common`, `booking`, `metadata`).

**Manual locale switching**: a small client helper sets `document.cookie = "locale=xx; path=/; max-age=31536000"` and navigates to the new `$lang` route. The existing `LanguageSwitcher` component ports almost unchanged.

---

## 4. Data loading — `async Page` → loaders + Query

Today every page is an `async function` that awaits `fetchUserAppointments`, `fetchSingleAppointment`, `getDictionary`, etc. The pattern maps cleanly to TanStack Start route loaders, which run on the server during SSR and on the client during navigation. Pair them with `@tanstack/react-router-with-query` so the loader can `queryClient.ensureQueryData(...)` and components later re-read the same key with `useSuspenseQuery`.

**Server functions** for the mocked fetchers. The `lib/api-helpers.ts` functions become server functions so the mock layer stays server-only (and is trivially swappable for a real fetch later):

```ts
// src/server/booking.ts
import { createServerFn } from "@tanstack/react-start";
export const fetchUserAppointments = createServerFn({ method: "GET" })
  .validator(z.object({ username: z.string() }))
  .handler(async ({ data }) => getMockUserAppointments(data.username));
```

**Query keys** live in `src/api/booking/keys.ts`:

```ts
export const bookingKeys = {
  user: (u: string)              => ["booking","user", u] as const,
  event: (u: string, slug: string) => ["booking","event", u, slug] as const,
  details: (id: string)            => ["booking","details", id] as const,
};
```

**Loader pattern** for the booking page:

```ts
// src/routes/$lang/$username/$eventType/book.tsx
export const Route = createFileRoute("/$lang/$username/$eventType/book")({
  loader: async ({ params, context: { queryClient } }) => {
    const [event, profile] = await Promise.all([
      queryClient.ensureQueryData({
        queryKey: bookingKeys.event(params.username, params.eventType),
        queryFn:  () => fetchSingleAppointment({ data: { username: params.username, slug: params.eventType } }),
        staleTime: 60_000,                       // mirrors `next: { revalidate: 60 }`
      }),
      queryClient.ensureQueryData({
        queryKey: bookingKeys.user(params.username),
        queryFn:  () => fetchUserAppointments({ data: { username: params.username } }),
        staleTime: 60_000,
      }),
    ]);
    if (!event) throw redirect({ to: "/$lang/$username", params, search: { error: "event_not_found" } });
    return { event, profile };
  },
  component: BookingPage,
});
```

`BookingForm` then reads via `useSuspenseQuery(bookingKeys.event(...))` so client-side cache stays warm across in-app navigation. Suspense boundaries that were Next `<Suspense>` wrappers stay as-is — TanStack Router renders the `pendingComponent` instead of (or alongside) React Suspense.

`fetchBookingDetails` (which reads from localStorage on the client) skips the loader entirely and runs in a client `useQuery` with `enabled: typeof window !== "undefined"`.

---

## 5. Next API replacements

| Next | TanStack Start replacement |
| --- | --- |
| `next/link` (`<Link href>`) | `@tanstack/react-router` `<Link to="/$lang/$username" params={{ lang, username }}>`. Typed params, no template strings. |
| `useRouter()` + `router.push()` | `useRouter()` from `@tanstack/react-router`, then `router.navigate({ to, params, search })`, or call `router.invalidate()` for re-fetch. |
| `useSearchParams()` | `Route.useSearch()` for the typed search of the current route, or `useSearch({ from: "/..." })` for siblings. Declare schema with `validateSearch: z.object({ error: z.enum(["event_not_found"]).optional() })`. |
| `useParams()` | `Route.useParams()` — typed off the param tokens in the file path. |
| `redirect("/x")` (server) | `throw redirect({ to: "/x" })` inside `beforeLoad` / `loader`. Status defaults to 307. |
| `notFound()` | `throw notFound()` in `beforeLoad` / `loader`; render via route `notFoundComponent`. |
| `cookies()` | Server: `getRequestHeaders()` + parse, or use Nitro's `getCookie()` inside server functions / server routes. Client: `document.cookie` (same as today). |
| `generateMetadata` | Route option `head: ({ loaderData, params }) => ({ meta: [...], links: [...] })`. Per-locale title/description pulled from `i18n.t("metadata.default_title", { lng: params.lang })` inside the loader and returned as `loaderData`, then read in `head`. |
| `generateStaticParams` | Not needed — TanStack Start is SSR by default. If you want prerender, configure Nitro's `prerender.routes` with the nine locales. |
| `next/font` (`Plus_Jakarta_Sans`) | `@fontsource-variable/plus-jakarta-sans` imported once in `__root.tsx`. Drop the `--font-sans` CSS variable trick — Tailwind v4 `@theme` reads the font family directly. |
| `next/image` | A small `<Img>` wrapper at `src/components/ui/img.tsx` (per neo-book convention) that defaults `loading="lazy"` + `decoding="async"`; pass `priority` to opt-in to `fetchpriority="high"`. No automatic responsive `srcset` — booking has six static images, all under 50KB; not worth the build complexity. If you want it later, drop in `unpic` or `@unpic/react`. |
| `next/headers` | `getRequestHeaders()` from `@tanstack/react-start/server`. |
| `next/navigation` `usePathname()` | `useLocation()` from `@tanstack/react-router` (`.pathname`). |
| `revalidate: 60` on fetch | `staleTime: 60_000` on the matching query. For hard server-side caching, use Nitro `defineCachedFunction` around the mock fetcher. |
| `metadataBase` / OG resolution | Set `head.links` to absolute `og:image` URLs computed from `import.meta.env.VITE_SITE_URL`. |

`LayoutProps<"/[lang]">` and `PageProps<...>` typed-route props disappear — params/search are read from the route's `useParams()` / `useSearch()` hooks instead. Less magic, more grep-able.

---

## 6. OG image strategy

`@vercel/og` works fine outside Next; the `ImageResponse` class is portable as long as the runtime supports `Web Streams` + `fetch` (Nitro does in the Node preset). Port the existing `app/api/og/route.tsx` to a TanStack Start server route:

```ts
// src/routes/api/og.tsx
import { createServerFileRoute } from "@tanstack/react-start/server";
import { ImageResponse } from "@vercel/og";

export const ServerRoute = createServerFileRoute("/api/og").methods({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const title = url.searchParams.get("title") ?? "Book a meeting";
    return new ImageResponse(<OgCard title={title} />, { width: 1200, height: 630 });
  },
});
```

Two gotchas to plan for:

1. **Font loading**: `@vercel/og` needs the font as an `ArrayBuffer`. In a Vite/Nitro world, do `import jakartaUrl from "@fontsource-variable/plus-jakarta-sans/files/...woff?url"` then `fetch(new URL(jakartaUrl, request.url)).then(r => r.arrayBuffer())`. Cache the buffer on globalThis so cold-start cost is paid once.
2. **JSX in server routes**: configure Vite's React plugin to include `src/routes/api/**` in its JSX scope (default already does — just confirm).

If `@vercel/og` ever drags in Next-only deps in a future version, the escape hatch is `satori` + `@resvg/resvg-js` directly — both are what `@vercel/og` wraps anyway.

---

## 7. Build & deploy

Drop OpenNext/Cloudflare + Wrangler entirely. Adopt the neo-book setup:

**`vite.config.ts`** (mirroring `apps/book/vite.config.ts`, minus Sentry until needed):

```ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: Number(process.env.PORT) || 3000 },
  plugins: [
    tailwindcss(),
    tanstackStart({ router: { tmpDir: "./dist/tmp" } }),
    nitro(),
    viteReact(),
  ],
  nitro: { output: { dir: "dist/nitro" } },
});
```

**`package.json` scripts**:

```
"dev":       "vite dev",
"build":     "vite build",
"start":     "node dist/nitro/server/index.mjs",
"typecheck": "tsc --noEmit",
"lint":      "oxlint",
"fmt":       "oxfmt"
```

**Tailwind v4**: CSS-first config. Move `app/globals.css` to `src/styles.css`, keep the `@import "tailwindcss"` line, drop `tailwind.config.ts` (already absent in v4). Import once in `__root.tsx` via `?url`.

**Linting**: replace `eslint-config-next` with `oxlint`. Faster, no plugin churn.

**Hosting target**:

- Netlify today → swap to Netlify's Nitro preset (`NITRO_PRESET=netlify`) or to a plain Node host. Both work because Nitro emits a portable server bundle. Netlify Edge isn't needed — there's no per-edge-region requirement and the booking surface is fine on a regional Node lambda.
- If you want to keep Cloudflare: Nitro's `cloudflare-pages` / `cloudflare` preset replaces OpenNext entirely — fewer moving parts than the current `@opennextjs/cloudflare` adapter.

**Env**: `NEXT_PUBLIC_SITE_URL` → `VITE_SITE_URL` (build-time) plus a server-only `SITE_URL` for the OG route. Update `.env.example`.

**Generated artifacts**: TanStack Router writes a `routeTree.gen.ts` next to `__root.tsx`. Gitignore it; the dev server regenerates on file changes. Typecheck CI runs `tsc --noEmit` after the dev server has produced the file (or runs a one-shot generator script — neo-book uses `scripts/generate-route-tree.mjs` before `tsc`).

---

## 8. Risks & gotchas

1. **Route tree generation is a build-time artifact, not a hand-edited file.** First-time contributors will try to edit `routeTree.gen.ts` — add a header comment and a CI check that the file is up-to-date (or regenerated from scratch on every CI run).
2. **`beforeLoad` runs on both server and client.** The Negotiator-replacement scorer must guard against `getRequestHeaders()` returning empty on client-side navigation. Cache the picked locale in route context so re-runs are free.
3. **Cookie-based locale + URL-based locale can desync.** The current middleware writes a cookie on manual switch but never on negotiation. If you keep that, document it; if not, write the cookie whenever the resolved locale differs from the cookie. Pick one — the silent-divergence behavior is a footgun.
4. **`@vercel/og` font weight**: the Next route currently doesn't load a custom font (it defaults to system). If the OG card needs Plus Jakarta Sans, plan the woff load + base64 inlining or you'll ship a system-font OG image and not notice until LinkedIn renders it.
5. **Search-param schemas are now load-bearing.** Anything reading `useSearchParams()` today gets implicit `string | null`; the typed `validateSearch` schema is stricter. Audit `error=event_not_found`, any `?tz=...`, any `?back=...` — add them all to schemas or you'll get runtime navigation errors.
6. **`Suspense` is double-counted.** The Next code wraps `BookingForm` in `<Suspense>` for the dictionary await. Under TanStack Start, the loader has already awaited the dictionary by render time, so the `<Suspense>` boundary becomes dead code — keep it only if a sub-tree uses `useSuspenseQuery` for client-only data (e.g. `fetchBookingDetailsClient`).
7. **`Promise.all` in loaders can mask one-off failures.** The current `getEventDetails` swallows errors and returns `undefined`, then redirects. Preserve that contract in the loader (`try/catch` around each `ensureQueryData`) or you'll convert "event not found" into a 500.
8. **`generateStaticParams` is gone.** If SEO ever matters here, wire Nitro `prerender.routes` to the nine `/:lang` index routes. Don't try to prerender `/$lang/$username/$eventType` — usernames are unbounded.
9. **`next/image` removal kills automatic responsive sizing.** Check Lighthouse on the two largest images (`og-image.jpg`, the host avatar) before merging. If LCP regresses, add `unpic`.
10. **Public URL stability.** The neo-book CLAUDE.md flags this explicitly — `/:lang/:username/:eventType/book` is shared externally. The port keeps the shape identical; verify before renaming any segment in flight.
11. **localStorage during SSR.** `fetchBookingDetailsClient` reads `window.localStorage`. Loaders run on the server first — gate the read on `typeof window !== "undefined"` or move it to `useEffect` / a client-only `useQuery` with `enabled`. Today's Next code already handles this via the "server returns null, client hydrates" pattern; preserve it explicitly.
12. **OpenNext-specific quirks leak into routes.** Audit for `runtime = "experimental-edge"` (currently in `middleware.ts`) and any `export const dynamic = "force-dynamic"` — all of those disappear cleanly in TanStack Start (loaders are dynamic by default unless you cache them).

---

## Order of operations (one sentence each)

1. Scaffold a sibling `app-next/` → keep Next building → stand up `app-tss/` with the Vite/Nitro/TanStack Start skeleton and `__root.tsx`.
2. Port `i18n` to `@meetingai/i18n`-style layout under `src/i18n/`, with `en` parity for all nine locales.
3. Wire the `$lang` validator + root redirect; verify in dev that `/` → `/en/` and cookie override sticks.
4. Move `lib/api-helpers.ts` + `lib/mocks.ts` behind `createServerFn` exports.
5. Port routes leaf-to-root: `success` (no loader) → `cancellations/$bookingId` → `reschedulings/$bookingId` → `$username/$eventType/book` → `$username/$eventType` → `$username`.
6. Port OG server route, verify font load.
7. Swap host (Netlify Nitro preset or Cloudflare Nitro preset), delete `@opennextjs/cloudflare`, `wrangler.toml`, `middleware.ts`, `next.config.mjs`, `eslint-config-next`.
8. Run `pnpm typecheck && pnpm lint && pnpm build` clean; smoke-test all nine locales in prod build.
