import type {
  AppointmentDetailsResponse,
  AvailableSlot,
  BookingDetails,
  SingleAppointmentResponse,
  UserAppointmentsResponse,
} from "@/lib/types/api";

import { addMinutes, format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

// Static demo host. Single hardcoded user for the demo build.
export const MOCK_HOST_USERNAME = "imo";
export const MOCK_HOST_TIMEZONE = "Asia/Jakarta";
export const MOCK_HOST = {
  name: "Imo Madjid",
  avatar_url:
    "https://lh3.googleusercontent.com/a/ACg8ocKPog_puTxJRjeHn-YydKU4LRPXvik0sAeL6N-6wYc1WIp48g=s100",
};

type MockEvent = {
  slug: string;
  name: string;
  description: string;
  duration_minutes: number;
  integration: "gmeet" | "teams" | "zoom" | "in_person";
  location?: string;
};

export const MOCK_EVENTS: MockEvent[] = [
  {
    slug: "quick-1-on-1",
    name: "Quick 1-on-1",
    description: "Have a quick chat with me!",
    duration_minutes: 30,
    integration: "gmeet",
  },
  {
    slug: "intro-chat",
    name: "Intro chat",
    description: "A quick intro to align on goals and next steps.",
    duration_minutes: 15,
    integration: "gmeet",
  },
  {
    slug: "deep-dive",
    name: "Deep dive",
    description: "Long-form session to dig into something specific.",
    duration_minutes: 60,
    integration: "gmeet",
  },
];

function eventBySlug(slug: string): MockEvent | undefined {
  return MOCK_EVENTS.find((e) => e.slug === slug);
}

export function getMockUserAppointments(
  username: string,
): UserAppointmentsResponse | null {
  if (username !== MOCK_HOST_USERNAME) return null;
  return {
    host: MOCK_HOST,
    schedule_appointments: MOCK_EVENTS.map((e) => ({
      slug: e.slug,
      schedule_appointment: {
        name: e.name,
        description: e.description,
        duration_minutes: e.duration_minutes,
        integration: e.integration,
        location: e.location,
        host_timezone: MOCK_HOST_TIMEZONE,
      },
    })),
  };
}

export function getMockSingleAppointment(
  username: string,
  slug: string,
): SingleAppointmentResponse | null {
  if (username !== MOCK_HOST_USERNAME) return null;
  const event = eventBySlug(slug);
  if (!event) return null;
  return {
    host: MOCK_HOST,
    schedule_appointment: {
      name: event.name,
      description: event.description,
      duration_minutes: event.duration_minutes,
      integration: event.integration,
      location: event.location,
      host_timezone: MOCK_HOST_TIMEZONE,
    },
  };
}

// Generate weekday 9am-5pm slots in the host's timezone.
export function generateMockSlots(
  durationMinutes: number,
  startDate: string,
  endDate: string,
): AvailableSlot[] {
  const slots: AvailableSlot[] = [];
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59`);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue; // weekends off

    const dateStr = format(d, "yyyy-MM-dd");
    let cursor = new Date(`${dateStr}T09:00:00`);
    const dayEnd = new Date(`${dateStr}T17:00:00`);

    while (addMinutes(cursor, durationMinutes) <= dayEnd) {
      const startLocal = format(cursor, "yyyy-MM-dd'T'HH:mm:ss");
      const endLocal = format(
        addMinutes(cursor, durationMinutes),
        "yyyy-MM-dd'T'HH:mm:ss",
      );
      try {
        slots.push({
          start: fromZonedTime(startLocal, MOCK_HOST_TIMEZONE).toISOString(),
          end: fromZonedTime(endLocal, MOCK_HOST_TIMEZONE).toISOString(),
          available: true,
          timezone: MOCK_HOST_TIMEZONE,
        });
      } catch {
        // skip
      }
      cursor = addMinutes(cursor, durationMinutes);
    }
  }
  return slots;
}

// Bookings live in localStorage on the client. Server-side returns null.
const BOOKINGS_KEY = "demo-bookings-v1";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

type StoredBooking = {
  id: string;
  username: string;
  slug: string;
  start_time: string;
  end_time: string;
  guest_name: string;
  guest_email: string;
  guest_phone_number?: string;
  guest_timezone: string;
  notes?: string;
  status: "scheduled" | "cancelled" | "rescheduled";
};

function readBookings(): StoredBooking[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeBookings(bookings: StoredBooking[]) {
  if (!isBrowser()) return;
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function createMockBooking(input: {
  username: string;
  slug: string;
  startTime: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  guestTimezone: string;
  notes?: string;
}): { id: string } {
  const event = eventBySlug(input.slug);
  const duration = event?.duration_minutes ?? 30;
  const endTime = addMinutes(new Date(input.startTime), duration).toISOString();
  const id = `demo_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const booking: StoredBooking = {
    id,
    username: input.username,
    slug: input.slug,
    start_time: input.startTime,
    end_time: endTime,
    guest_name: input.guestName,
    guest_email: input.guestEmail,
    guest_phone_number: input.guestPhone,
    guest_timezone: input.guestTimezone,
    notes: input.notes,
    status: "scheduled",
  };
  const all = readBookings();
  all.push(booking);
  writeBookings(all);
  return { id };
}

export function getMockBookingDetails(bookingId: string): BookingDetails | null {
  if (!isBrowser()) {
    // Server-side: localStorage unavailable. Return a placeholder so the
    // cancel/reschedule pages render; the client form rehydrates with the
    // real stored booking on mount.
    if (!bookingId.startsWith("demo_")) return null;
    const event = MOCK_EVENTS[0];
    const start = addMinutes(new Date(), 60).toISOString();
    const end = addMinutes(new Date(), 60 + event.duration_minutes).toISOString();
    return {
      id: bookingId,
      status: "scheduled",
      start_time: start,
      end_time: end,
      username: MOCK_HOST_USERNAME,
      host: MOCK_HOST,
      schedule_appointment: {
        name: event.name,
        slug: event.slug,
        description: event.description,
        duration_minutes: event.duration_minutes,
        integration: event.integration,
        location: event.location,
      },
    };
  }
  const b = readBookings().find((x) => x.id === bookingId);
  if (!b) return null;
  const event = eventBySlug(b.slug);
  return {
    id: b.id,
    status: b.status,
    start_time: b.start_time,
    end_time: b.end_time,
    notes: b.notes,
    username: b.username,
    host: MOCK_HOST,
    schedule_appointment: {
      name: event?.name ?? b.slug,
      slug: b.slug,
      description: event?.description ?? "",
      duration_minutes: event?.duration_minutes ?? 30,
      integration: event?.integration ?? "gmeet",
      location: event?.location,
    },
  };
}

export function getMockAppointmentDetailsResponse(
  bookingId: string,
): AppointmentDetailsResponse | null {
  if (!isBrowser()) return null;
  const b = readBookings().find((x) => x.id === bookingId);
  if (!b) return null;
  const event = eventBySlug(b.slug);
  return {
    booking_id: b.id,
    booking_details: {
      slug: b.slug,
      name: event?.name ?? b.slug,
      description: event?.description ?? "",
      duration_minutes: event?.duration_minutes ?? 30,
      location: event?.location,
      integration: event?.integration ?? "gmeet",
      start_time: b.start_time,
      end_time: b.end_time,
      notes: b.notes,
      host_username: b.username,
      host_timezone: MOCK_HOST_TIMEZONE,
      guest_timezone: b.guest_timezone,
    },
    meeting_details: {
      meeting_url: b.status === "scheduled" ? "https://meet.google.com/demo-link" : null,
      integration: event?.integration ?? "gmeet",
    },
    status: b.status,
  };
}

export function cancelMockBooking(bookingId: string): boolean {
  if (!isBrowser()) return false;
  const all = readBookings();
  const idx = all.findIndex((x) => x.id === bookingId);
  if (idx === -1) return false;
  all[idx].status = "cancelled";
  writeBookings(all);
  return true;
}

export function rescheduleMockBooking(
  bookingId: string,
  newStartTime: string,
  newTimezone: string,
): BookingDetails | null {
  if (!isBrowser()) return null;
  const all = readBookings();
  const idx = all.findIndex((x) => x.id === bookingId);
  if (idx === -1) return null;
  const event = eventBySlug(all[idx].slug);
  const duration = event?.duration_minutes ?? 30;
  all[idx].start_time = newStartTime;
  all[idx].end_time = addMinutes(new Date(newStartTime), duration).toISOString();
  all[idx].guest_timezone = newTimezone;
  all[idx].status = "rescheduled";
  writeBookings(all);
  return getMockBookingDetails(bookingId);
}
