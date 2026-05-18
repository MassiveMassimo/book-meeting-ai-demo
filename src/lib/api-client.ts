import type {
  BookingDetails,
  BookingResult,
  CancelBookingResult,
  RescheduleBookingResult,
} from "@/lib/types/api";

import { z } from "zod";

import {
  cancelMockBooking,
  createMockBooking,
  getMockBookingDetails,
  rescheduleMockBooking,
} from "@/lib/mocks";

// Client-side stubs. All operations are simulated against an in-memory
// + localStorage store. No external backend is contacted.

const bookingSchema = z.object({
  username: z.string(),
  eventTypeId: z.string(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .trim(),
  phone: z
    .string()
    .max(20, "Phone number must be less than 20 characters")
    .optional()
    .refine(
      (val) => !val || /^[+]?[\d\s-().]{7,}$/.test(val),
      "Invalid phone number format",
    ),
  notes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .trim()
    .optional(),
  startTime: z.string(),
  guestTimezone: z.string(),
});

export async function createBooking(
  data: z.infer<typeof bookingSchema>,
): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Simulate latency.
  await new Promise((r) => setTimeout(r, 400));

  const { id } = createMockBooking({
    username: parsed.data.username,
    slug: parsed.data.eventTypeId,
    startTime: parsed.data.startTime,
    guestName: parsed.data.name,
    guestEmail: parsed.data.email,
    guestPhone: parsed.data.phone,
    guestTimezone: parsed.data.guestTimezone,
    notes: parsed.data.notes,
  });

  return {
    success: true,
    booking: {
      id,
      status: "confirmed",
    },
  };
}

const cancelBookingSchema = z.object({
  bookingId: z.string(),
  reason: z
    .string()
    .min(1, "Please provide a reason for cancellation")
    .max(1000, "Reason must be less than 1000 characters")
    .trim(),
});

export async function cancelBooking(
  data: z.infer<typeof cancelBookingSchema>,
): Promise<CancelBookingResult> {
  const parsed = cancelBookingSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }
  await new Promise((r) => setTimeout(r, 300));
  const ok = cancelMockBooking(parsed.data.bookingId);
  return ok
    ? { success: true }
    : { success: false, message: "Booking not found" };
}

export async function fetchBookingDetailsClient(
  bookingId: string,
): Promise<BookingDetails | null> {
  return getMockBookingDetails(bookingId);
}

const rescheduleBookingSchema = z.object({
  bookingId: z.string(),
  newStartTime: z.string(),
  timezone: z.string(),
  notes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .trim()
    .optional(),
  reason: z
    .string()
    .max(1000, "Reason must be less than 1000 characters")
    .trim()
    .optional(),
});

export async function rescheduleBooking(
  data: z.infer<typeof rescheduleBookingSchema>,
): Promise<RescheduleBookingResult> {
  const parsed = rescheduleBookingSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }
  await new Promise((r) => setTimeout(r, 400));
  const updated = rescheduleMockBooking(
    parsed.data.bookingId,
    parsed.data.newStartTime,
    parsed.data.timezone,
  );
  return updated
    ? { success: true, booking: updated }
    : { success: false, message: "Booking not found" };
}
