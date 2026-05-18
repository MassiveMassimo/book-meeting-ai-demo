# LLM Context: book.meeting.ai

> This document provides context for AI/LLM models operating on this codebase.

---

## 📋 Project Overview

**book.meeting.ai** is a Calendly-clone scheduling application built as a free feature for Meeting.ai (an AI note-taker app). Users can schedule meetings with the default host by selecting an event type, date, time, and filling out a booking form.

### Live URL

- Production: `https://book-meeting-prototype.netlify.app`
- Custom domain (planned): `https://book.meeting.ai`

---

## 🛠 Tech Stack

| Technology        | Version | Purpose                                               |
| ----------------- | ------- | ----------------------------------------------------- |
| **Next.js**       | 16.0.7  | React framework with App Router                       |
| **React**         | 19.2.0  | UI library                                            |
| **TypeScript**    | 5.x     | Type safety                                           |
| **Tailwind CSS**  | 4.x     | Styling (uses new v4 syntax)                          |
| **date-fns**      | 4.x     | Date manipulation                                     |
| **date-fns-tz**   | 3.x     | Timezone handling                                     |
| **Lucide React**  | Latest  | Icons                                                 |
| **Framer Motion** | 12.x    | Animations (installed but mostly unused - prefer CSS) |

### Deployment

- **Platform**: Netlify
- **Config**: `netlify.toml`
- **Build command**: `pnpm run build`

---

## 📁 Project Structure

```
app/
├── page.tsx                    # Landing page - event type selection
├── layout.tsx                  # Root layout with metadata
├── globals.css                 # Global styles + animations
├── loading.tsx                 # Loading skeleton
├── [eventType]/
│   ├── page.tsx               # Calendar + time slot selection
│   ├── loading.tsx
│   └── book/
│       ├── page.tsx           # Booking form
│       └── loading.tsx
├── success/
│   ├── page.tsx               # Confirmation page with confetti
│   └── loading.tsx
├── components/
│   ├── BookingInterface.tsx   # Main booking layout
│   ├── Calendar.tsx           # Date picker
│   ├── TimeSlots.tsx          # Time slot grid
│   ├── TimezoneSelector.tsx   # Timezone dropdown with search
│   └── PageTransition.tsx     # Route transition animation
└── lib/
    └── constants.ts           # Event types data

public/
├── favicon.svg
├── og-image.jpg               # 1200x630 for social sharing
├── meeting.ai-logo-white.svg  # Footer logo
├── meeting.ai-logo-black.svg
├── background-landscape.jpeg  # Desktop background (16:9)
└── background-portrait.jpeg   # Mobile background (9:16)
```

---

## 👤 User Preferences

### Code Style

- **Prefer CSS over JS animations** - Use Tailwind's `animate-in`, `transition`, or custom CSS keyframes over Framer Motion
- **Simple solutions first** - Avoid over-engineering
- **Responsive design** - Mobile-first, test on small screens ("1x1 screen" mentioned)

### UI/UX Preferences

- **Clean, minimal aesthetic** - No "AI slop" generic look
- **Beautiful backgrounds** - Currently using green hills nature photos
- **White footer** - "Powered by meeting.ai" logo at 100% opacity, always white
- **Centered modals** - All content cards centered both horizontally and vertically on desktop
- **Smooth transitions** - Subtle fade-in on page changes (0.25s)
- **No excessive scrolling** - Reduce padding when content fits

### Layout Rules

- **Desktop (xl: 1280px+)**: Side-by-side layout (sidebar + content)
- **Below xl**: Stacked vertical layout (details on top, content below)
- **Mobile**: Full-width cards with rounded corners, compact metadata

### Component Conventions

- Time/Confirm buttons stack **vertically** (not side-by-side) to prevent overflow
- Timezone selector opens as **full-screen modal on mobile**
- Profile photo appears in sidebar header on all relevant pages

---

## 🎨 Design System

### Colors

- **Primary**: Blue (`bg-blue-600`, `text-blue-600`)
- **Success**: Green (`bg-green-100`, `text-green-600`)
- **Neutral**: Gray scale (`slate-50` to `slate-900`)
- **Backgrounds**: Nature photos (hills) with gradient overlay

### Typography

- **Font**: Geist Sans (via `next/font/google`)
- **Headings**: `font-bold`, sizes vary by context
- **Body**: `text-slate-600`, `text-sm` to `text-base`

### Animations (in globals.css)

- `fadeIn` - Page transitions
- `confetti-fall` - Success page celebration
- `success-pop` - Checkmark icon animation
- `fade-up` - Staggered content reveal (`.stagger-1` to `.stagger-4`)

---

## ⚡ Key Implementation Details

### Timezone Handling

- Auto-detects user timezone on mount
- Stores in state and passes via URL params
- Displays as `(GMT+07:00) Asia/Jakarta` format

### Event Types

Defined in `app/lib/constants.ts`:

- `15min` - 15 Minute Meeting (purple)
- `30min` - 30 Minute Meeting (blue)
- `growth-hacking` - Growth Hacking Discussion, 60 min (green)

### URL Flow

1. `/` → Select event type
2. `/[eventType]` → Select date & time
3. `/[eventType]/book?date=...&time=...&timezone=...` → Fill form
4. `/success?date=...&time=...&type=...&name=...&timezone=...` → Confirmation

### Background Images

```css
/* Portrait for mobile (aspect-ratio < 1) */
body {
  background: url("/background-portrait.jpeg")...;
}

/* Landscape for desktop (aspect-ratio >= 1) */
@media (min-aspect-ratio: 1/1) {
  body {
    background-image: url("/background-landscape.jpeg");
  }
}
```

---

## 🚀 Running Locally

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm run build

# The app runs on http://localhost:3000
```

### Environment Variables (optional)

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## 📝 Common Tasks

### Adding a new event type

1. Add to `EVENT_TYPES` in `app/lib/constants.ts`
2. That's it - routing is dynamic via `[eventType]`

### Changing the profile

- Update `profile` defaults in `app/api/booking/route.ts`
- Swap the logo in `public/meeting.ai-logo-black.svg` or point `profile.image` to your asset

### Updating OG image

- Replace `public/og-image.jpg`
- Optimal size: **1200×630** pixels
- Keep under 300KB for fast loading

### Modifying animations

- Global animations in `app/globals.css`
- Page transition in `app/components/PageTransition.tsx`

---

## ⚠️ Known Quirks

1. **Next.js 16 + Tailwind v4**: Uses new Tailwind syntax (`@import "tailwindcss"`)
2. **Dynamic routes need server**: `/[eventType]/book` uses `useSearchParams()`, can't static export
3. **WhatsApp OG caching**: May take hours to refresh; append `?v=X` to URL to force refresh
4. **Framer Motion installed but barely used**: Prefer CSS animations per user preference

---

## 🔗 Related Links

- **GitHub**: `bahasa-ai/book-meeting-prototype`
- **Netlify**: Connected via Git, auto-deploys on push
- **Parent product**: Meeting.ai (AI note-taker)

---

_Last updated: December 5, 2025_
