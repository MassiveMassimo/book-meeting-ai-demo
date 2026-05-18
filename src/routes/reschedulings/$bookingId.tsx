import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { Ban, CalendarX } from "lucide-react";

import { fetchBookingDetails, fetchSingleAppointment } from "@/lib/api-helpers";
import { dict } from "@/lib/copy";
import type { Profile } from "@/lib/types/api";

import { RescheduleInterface } from "./-components/reschedule-interface";

const appointmentQuery = (username: string, slug: string) =>
  queryOptions({
    queryKey: ["singleAppointmentRaw", username, slug],
    queryFn: () => fetchSingleAppointment(username, slug),
    staleTime: 60_000,
  });

export const Route = createFileRoute("/reschedulings/$bookingId")({
  loader: async ({ context, params }) => {
    const booking = await fetchBookingDetails(params.bookingId);
    if (!booking && !params.bookingId.startsWith("demo_")) throw notFound();
    if (!booking) return { booking: null, appointment: null };
    const appointment = await context.queryClient.ensureQueryData(
      appointmentQuery(booking.username, booking.schedule_appointment.slug),
    );
    return { booking, appointment };
  },
  head: ({ loaderData }) =>
    loaderData?.booking
      ? {
          meta: [
            {
              title: `Reschedule Booking — ${loaderData.booking.schedule_appointment.name}`,
            },
            {
              name: "description",
              content: `Reschedule your meeting with ${loaderData.booking.host.name}`,
            },
          ],
        }
      : { meta: [] },
  component: RescheduleBookingPage,
});

function RescheduleBookingPage() {
  const { bookingId } = Route.useParams();
  const { booking, appointment } = Route.useLoaderData();

  if (!booking) {
    // SSR returned null for a demo_ id — client will hydrate inside RescheduleInterface.
    return null;
  }

  if (booking.status === "cancelled") {
    return (
      <div className="mx-auto flex max-w-md grow flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
          <Ban className="text-muted-foreground size-8" />
        </div>
        <h2 className="text-foreground mb-3 text-xl font-bold md:text-2xl">
          {dict.reschedule.already_cancelled}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {dict.reschedule.already_cancelled_desc}
        </p>
      </div>
    );
  }

  const eventStartTime = new Date(booking.start_time);
  if (new Date() >= eventStartTime) {
    return (
      <div className="mx-auto flex max-w-md grow flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
          <CalendarX className="text-muted-foreground size-8" />
        </div>
        <h2 className="text-foreground mb-3 text-xl font-bold md:text-2xl">
          {dict.reschedule.cannot_reschedule_past}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {dict.reschedule.cannot_reschedule_past_desc}
        </p>
      </div>
    );
  }

  const profile: Profile = {
    name: booking.host.name,
    image: booking.host.avatar_url,
  };

  const eventType = {
    id: booking.schedule_appointment.slug,
    title: booking.schedule_appointment.name,
    duration: booking.schedule_appointment.duration_minutes,
    description: booking.schedule_appointment.description,
    color: "bg-blue-500",
    integration: booking.schedule_appointment.integration,
    location: booking.schedule_appointment.location,
  };

  const hostTimezone = appointment?.schedule_appointment?.host_timezone;

  return (
    <RescheduleInterface
      bookingId={bookingId}
      booking={booking}
      eventType={eventType}
      profile={profile}
      meetingPlatform={booking.schedule_appointment.integration}
      hostTimezone={hostTimezone}
      dict={dict}
    />
  );
}
