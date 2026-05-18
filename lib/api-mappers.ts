import type {
  AppointmentDetailsResponse,
  BookingDetails,
  Profile,
  PublicAppointment,
  SingleAppointmentResponse,
  UserAppointmentsResponse,
} from "@/lib/types/api";

/**
 * Maps location from API to integration type
 */
export function mapLocationTypeToIntegration(
  locationType: string,
): "gmeet" | "teams" | "zoom" | "in_person" {
  if (locationType === "gmeet") return "gmeet";
  if (locationType === "team") return "teams";
  if (locationType === "zoom") return "zoom";
  return "in_person";
}

/**
 * Maps a schedule appointment item from the API response to PublicAppointment format
 */
export function mapScheduleAppointmentToPublicAppointment(item: {
  slug: string;
  schedule_appointment: {
    name: string;
    description: string;
    duration_minutes: number;
    integration: string;
    location?: string;
    host_timezone?: string;
  };
}): PublicAppointment {
  return {
    id: item.slug,
    slug: item.slug,
    title: item.schedule_appointment.name,
    description: item.schedule_appointment.description,
    duration_minutes: item.schedule_appointment.duration_minutes,
    integration: mapLocationTypeToIntegration(
      item.schedule_appointment.integration,
    ),
    location: item.schedule_appointment.location,
    host_timezone: item.schedule_appointment.host_timezone,
    is_active: true,
  };
}

/**
 * Maps UserAppointmentsResponse to appointments and profile
 */
export function mapUserAppointmentsResponse(data: UserAppointmentsResponse): {
  appointments: PublicAppointment[];
  profile: Profile;
} {
  const appointments: PublicAppointment[] = data.schedule_appointments.map(
    mapScheduleAppointmentToPublicAppointment,
  );

  const profile: Profile = {
    name: data.host.name,
    image: data.host.avatar_url,
  };

  return { appointments, profile };
}

/**
 * Maps single appointment API response to PublicAppointment format
 * API returns: { host: {...}, schedule_appointment: {...} }
 */
export function mapSingleAppointmentResponse(
  data: SingleAppointmentResponse,
  slug: string,
): PublicAppointment {
  return {
    id: slug,
    slug: slug,
    title: data.schedule_appointment.name,
    description: data.schedule_appointment.description,
    duration_minutes: data.schedule_appointment.duration_minutes,
    integration: mapLocationTypeToIntegration(
      data.schedule_appointment.integration,
    ),
    location: data.schedule_appointment.location,
    host_timezone: data.schedule_appointment.host_timezone,
    is_active: true,
  };
}

/**
 * Maps AppointmentDetailsResponse to BookingDetails format
 */
export function mapAppointmentDetailsResponse(
  data: AppointmentDetailsResponse,
): BookingDetails {
  return {
    id: data.booking_id,
    status: data.status,
    start_time: data.booking_details.start_time,
    end_time: data.booking_details.end_time,
    notes: data.booking_details.notes ?? undefined,
    username: data.booking_details.host_username, // Username of the host (always provided by API)
    host: {
      name: "", // Not provided by API
      avatar_url: "", // Not provided by API
    },
    schedule_appointment: {
      name: data.booking_details.name,
      slug: data.booking_details.slug,
      description: data.booking_details.description,
      duration_minutes: data.booking_details.duration_minutes,
      integration: data.booking_details.integration,
      location: data.booking_details.location,
    },
  };
}
