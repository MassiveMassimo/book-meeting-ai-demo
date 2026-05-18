export interface PublicAppointment {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration_minutes: number;
  integration: "gmeet" | "teams" | "zoom" | "in_person";
  location?: string;
  /**
   * Host's IANA timezone identifier (e.g., "Asia/Jakarta").
   * Returned by the booking details API for a specific appointment slug.
   */
  host_timezone?: string;
  price?: number;
  currency?: string;
  is_active?: boolean;
}

export interface UserAppointmentsResponse {
  host: {
    name: string;
    avatar_url: string;
  };
  schedule_appointments: Array<{
    slug: string;
    schedule_appointment: {
      name: string;
      description: string;
      duration_minutes: number;
      integration: string;
      location?: string;
      host_timezone?: string;
    };
  }>;
}

export interface SingleAppointmentResponse {
  host: {
    name: string;
    avatar_url: string;
  };
  schedule_appointment: {
    name: string;
    description: string;
    duration_minutes: number;
    integration: string;
    location?: string;
    host_timezone?: string;
  };
}

export interface AvailableSlot {
  start: string; // ISO string
  end: string; // ISO string
  available?: boolean; // Whether the slot is available (defaults to true if not specified)
  timezone?: string; // IANA timezone identifier for the slot
}

export interface BookingRequest {
  guest_name: string;
  guest_email: string;
  guest_phone_number?: string;
  guest_timezone: string;
  start_time: string; // ISO string
  notes?: string;
  guests?: string[]; // Optional, based on prototype needs
}

export interface BookingResponse {
  id: string;
  status: "confirmed" | "pending";
  calendar_event?: {
    ics_download_url: string;
  };
}

export interface EventType {
  id: string;
  title: string;
  duration: number;
  description: string;
  color: string;
  integration: string;
  location?: string;
}

export interface Profile {
  name: string;
  image: string;
}

// Booking details for cancel/reschedule pages
export interface BookingDetails {
  id: string;
  status: "cancelled" | "rescheduled" | "scheduled";
  start_time: string; // ISO string
  end_time: string; // ISO string
  notes?: string;
  username: string; // Username of the host (always provided by API)
  host: {
    name: string;
    avatar_url: string;
  };
  schedule_appointment: {
    name: string;
    slug: string;
    description: string;
    duration_minutes: number;
    integration: string;
    location?: string;
  };
}

export interface CancelBookingRequest {
  reason: string;
}

export interface RescheduleBookingRequest {
  new_start_time: string; // ISO string
  new_timezone: string;
  notes?: string;
  reason?: string;
}

// API response for GET /api/v1/book/appointment/{appointment_id}
export interface AppointmentDetailsResponse {
  booking_id: string;
  booking_details: {
    slug: string;
    name: string;
    description: string;
    duration_minutes: number;
    location?: string;
    integration: string;
    start_time: string; // ISO string
    end_time: string; // ISO string
    notes?: string;
    host_username: string; // Username of the host (always provided by API)
    host_timezone?: string; // Host's IANA timezone identifier (e.g., "Asia/Jakarta")
    guest_timezone?: string; // Guest's IANA timezone identifier (e.g., "America/New_York")
  };
  meeting_details: {
    meeting_url: string | null;
    integration: string;
  };
  status: "cancelled" | "rescheduled" | "scheduled";
}

export type BookingResult =
  | {
      success: true;
      booking: BookingResponse;
      message?: never;
      errors?: never;
      isConflict?: never;
    }
  | {
      success: false;
      message?: string;
      errors?: Record<string, string[]>;
      isConflict?: boolean;
      booking?: never;
    };

export type CancelBookingResult =
  | {
      success: true;
      message?: never;
      errors?: never;
    }
  | {
      success: false;
      message?: string;
      errors?: Record<string, string[]>;
    };

export type RescheduleBookingResult =
  | {
      success: true;
      booking: BookingDetails;
      message?: never;
      errors?: never;
    }
  | {
      success: false;
      message?: string;
      errors?: Record<string, string[]>;
      isConflict?: boolean;
      booking?: never;
    };
