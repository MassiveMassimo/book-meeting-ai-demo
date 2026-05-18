# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This repo is **book.meeting.ai**, a small scheduling app (Calendly-style) built on the Next.js App Router. Users select an event type, pick a date and time, fill out a booking form, and see a confirmation page. There is **no backend** in this repo; booking is simulated on the client and reflected via URL parameters.

The app is deployed on **Netlify** using `pnpm run build` and the official `@netlify/plugin-nextjs` (see `netlify.toml`).

## Commands & development workflow

### Package manager

- Use **pnpm**, not npm/yarn/bun. The repo ships with `pnpm-lock.yaml` and Netlify is configured to run `pnpm run build`.

### Core scripts

From the repo root:

- **Install dependencies**: `pnpm install`
- **Dev server (Next.js App Router)**: `pnpm dev`
  - Serves the app at `http://localhost:3000`.
- **Production build**: `pnpm run build`
- **Run production server locally**: `pnpm start`
- **Lint all files**: `pnpm lint`
  - Uses `eslint.config.mjs` with `eslint-config-next` (core web vitals + TypeScript).

### Tests

- There is **no test script or test runner configured** in `package.json`. Do not assume Jest/Vitest/Playwright exists; add and wire up a test tool explicitly if you introduce tests.

## Architecture & routing

This is a **Next.js App Router** app using the `app/` directory and dynamic routes.

### Top-level layout

- `app/layout.tsx`
  - Wraps all pages in `PageTransition` for a 0.25s fade-in animation.
  - Sets up **Geist Sans/Mono** via `next/font/google`.
  - Configures SEO/OG/Twitter metadata using `NEXT_PUBLIC_SITE_URL` (defaults to the Netlify URL if unset).
  - Renders a single centered `main` area; the rest of the background is handled via `app/globals.css` (full-screen photography + gradient).

- `app/globals.css`
  - Tailwind CSS v4 entry via `@import "tailwindcss";` and `@theme inline`.
  - Sets **background images**:
    - Portrait (`background-portrait.jpeg`) for aspect ratios < 1.
    - Landscape (`background-landscape.jpeg`) for wider screens.
  - Defines custom keyframe animations:
    - `fadeIn` (page transitions, used by `.animate-fadeIn`).
    - `confetti-fall`, `success-pop`, and `fade-up` (success page staggered animations).

### Routing & pages

All pages include a bottom "Powered by meeting.ai" footer using the white logo from `public/meeting.ai-logo-white.svg`. Preserve this when adding new primary pages.

- `app/page.tsx` (`/`)
  - Landing page listing **event types** (15 min, 30 min, Growth Hacking) as cards.
  - Uses inline event-type definitions here (a simplified mirror of `EVENT_TYPES`).
  - Clicking a card navigates to `/[eventType]`.

- `app/[eventType]/page.tsx` (`/[eventType]`)
  - Dynamic route for a specific event type.
  - Uses `EVENT_TYPES` from `app/lib/constants.ts` and `generateStaticParams` to statically generate pages for valid event types.
  - Validates the `eventType` param and calls `notFound()` for unknown values.
  - Renders `<BookingInterface eventType={...} />`.

- `app/[eventType]/book/page.tsx` (`/[eventType]/book`)
  - **Client component** that reads query params with `useSearchParams`:
    - `date` (ISO string), `time` (string), `timezone` (IANA ID).
  - Uses `EVENT_TYPES` again to resolve the event metadata.
  - Shows a left sidebar with event details and a right panel with the booking form.
  - The form:
    - Collects name, email, optional guest emails, and notes.
    - Simulates submission with a `setTimeout` and then redirects to `/success` with `date`, `time`, `type`, `name`, `timezone` encoded in the query string.
  - If required params are missing or event type is invalid, shows simple inline error messages.

- `app/success/page.tsx` (`/success`)
  - **Client component** that reconstructs meeting info from query params: `date`, `time`, `type`, `name`, `timezone`.
  - Looks up the event in `EVENT_TYPES` and formats the date with `date-fns`.
  - Uses confetti elements + custom CSS keyframes for a celebratory animation.
  - Provides a "Copy meeting details" button that builds a multiline string and copies it to the clipboard.
  - Includes a link back to `/` to schedule another meeting.

### Components & domain logic

- `app/lib/constants.ts`
  - Single source of truth for **event type metadata** (`EVENT_TYPES`): `id`, title, duration, description, and color.
  - When adding or changing event types, update this file and keep `app/page.tsx` in sync if needed.

- `app/components/BookingInterface.tsx`
  - Main layout for the `/[eventType]` page.
  - Manages **booking state**:
    - `selectedDate`, `selectedTime`, and `timezone`.
  - On mount, initializes `timezone` from `Intl.DateTimeFormat().resolvedOptions().timeZone`.
  - On confirmation, pushes a route to `/${eventType.id}/book` with `date`, `time`, and `timezone` encoded as query params.
  - Layout rules:
    - Side-by-side card layout on desktop (`xl:`) with a sidebar and content region.
    - Stacked vertically on smaller breakpoints.

- `app/components/Calendar.tsx`
  - Pure client-side monthly calendar using `date-fns`.
  - Computes days for the current month, disables past dates, and highlights today and the selected date.
  - Emits the chosen `Date` via `onSelectDate`.

- `app/components/TimeSlots.tsx`
  - Renders a grid of pre-defined **time slots** for the selected date.
  - When the user selects a time:
    - The selected slot expands into a vertical stack: one non-clickable selected-time button and a **separate Confirm button below it**.
    - This vertical stacking pattern is important for mobile layout; preserve it when changing the design.

- `app/components/TimezoneSelector.tsx`
  - Client-only timezone picker component.
  - Uses `Intl.supportedValuesOf('timeZone')` and `Intl.DateTimeFormat` to compute a list of time zones with `(GMT±HH:MM) Region/City` labels and a searchable string.
  - Supports both **controlled** (`value`/`onChange`) and internal state modes (`localTimezone`).
  - For small viewports, renders as a **full-screen modal** using `createPortal`; on larger screens, it is a dropdown anchored to the sidebar footer.
  - Emits IANA time zone IDs like `Asia/Jakarta`; downstream components (booking and success pages) convert underscores in the label back to spaces when displaying.

- `app/components/PageTransition.tsx`
  - Wraps children in a `div` keyed by `usePathname()` with the `.animate-fadeIn` class from `globals.css`.
  - This is the **only animation wrapper** around page transitions. Prefer extending the CSS keyframes rather than reintroducing Framer Motion.

## Styling & UX conventions

These preferences are important when modifying or extending the UI.

- **Animations**
  - Tailwind + custom CSS animations are preferred over Motion. The `motion` package is used in some components (e.g., `ClockIcon`, `AnimatedGroup`).
  - Use subtle durations (~0.25s) for page transitions and element fades.

- **Layout**
  - Desktop (`xl` and up): prefer **side-by-side** card layouts with a left sidebar (profile + metadata) and right content.
  - Below `xl`: stack sections vertically with centered cards.
  - Mobile: full-width cards with rounded corners and compact metadata. Time/confirm buttons stack vertically.

- **Branding**
  - Backgrounds use nature photography with light overlays; avoid replacing with generic gradient-only "AI" styles unless explicitly requested.
  - The **"Powered by meeting.ai"** white footer appears at the bottom of key pages; keep this intact and on a white logo.

## Environment & configuration

- **Next.js**: 16.0.7 (`next` in `dependencies`) using App Router (`app/` directory) and TypeScript.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss` and `tailwindcss` devDependencies; configured solely through `globals.css` and Tailwind utility classes.
- **Linting**: ESLint 9 with `eslint-config-next` (`core-web-vitals` + TypeScript). The config explicitly ignores `.next/**`, `out/**`, `build/**`, and `next-env.d.ts` only.
- **Images**: `next.config.ts` sets `images.unoptimized = true` so Next.js image optimization is disabled; image assets live under `public/`.

## LLM- / agent-specific notes

- Additional, LLM-focused context (including design system details, layout rules, and known quirks) lives in `readme-llm.md`. When making non-trivial UI or flow changes, consult and update that file alongside the code.
- When introducing new features, preserve the **four-step URL flow**:
  1. `/` → select event type.
  2. `/[eventType]` → pick date & time.
  3. `/[eventType]/book` → booking form using query params.
  4. `/success` → confirmation derived from query params.
