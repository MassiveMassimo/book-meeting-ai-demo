import type {
  BookingDetails,
  SingleAppointmentResponse,
  UserAppointmentsResponse,
} from "@/lib/types/api";

import {
  getMockBookingDetails,
  getMockSingleAppointment,
  getMockUserAppointments,
} from "@/lib/mocks";

// All server-side fetchers are stubbed to return local mock data.
// No external backend is contacted in the demo build.

export async function fetchUserAppointments(
  username: string,
  _init?: unknown,
): Promise<UserAppointmentsResponse | null> {
  return getMockUserAppointments(username);
}

export async function fetchSingleAppointment(
  username: string,
  slug: string,
  _init?: unknown,
): Promise<SingleAppointmentResponse | null> {
  return getMockSingleAppointment(username, slug);
}

export async function fetchBookingDetails(
  bookingId: string,
  _init?: unknown,
): Promise<BookingDetails | null> {
  // Bookings live in localStorage; server-side render returns null and the
  // client form hydrates with fetchBookingDetailsClient.
  return getMockBookingDetails(bookingId);
}
