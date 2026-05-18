# book-meeting-ai-demo

A backend-free clone of [book.meeting.ai](https://book.meeting.ai) — a Calendly-style scheduling UI built with Next.js 16, React 19, and Tailwind v4.

This repo replaces every API call with local mock data. There is no database, no auth, and no external service. Everything renders against an in-memory user profile plus a `localStorage`-backed booking store.

## Demo user

- Username: `imo`
- Profile: `/imo`
- Sample events: `quick-1-on-1` (30 min), `intro-chat` (15 min), `deep-dive` (60 min)
- Try: <http://localhost:3000/imo/quick-1-on-1>

Any other username returns the "not found" state.

## What's mocked

| Real backend call | Demo replacement |
| --- | --- |
| `GET /api/v1/book/{username}` | `lib/mocks.ts` → `getMockUserAppointments` |
| `GET /api/v1/book/{username}/{slug}` | `getMockSingleAppointment` |
| `GET /api/v1/book/{username}/{slug}/slots` | `generateMockSlots` (weekdays, 9am–5pm Asia/Jakarta) |
| `POST /api/v1/book/{username}/{slug}` | `createMockBooking` → writes to `localStorage` |
| `POST /api/v1/book/appointment/{id}/cancel` | `cancelMockBooking` |
| `POST /api/v1/book/appointment/{id}/reschedule` | `rescheduleMockBooking` |
| `GET /api/v1/book/appointment/{id}` | `getMockBookingDetails` |

Server-side renders of the cancel and reschedule pages return a placeholder booking (localStorage is browser-only); the client form re-hydrates with the real stored booking on mount.

## Running locally

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Editing the demo data

All dummy data lives in `lib/mocks.ts` — change the host name, avatar, timezone, or events list there.

## Credit

Cloned from `bahasa-ai/book-meeting-ai`. Strictly a personal learning fork; no production data or credentials are present.
