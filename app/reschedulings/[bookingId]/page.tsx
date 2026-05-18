import type { Profile } from "@/lib/types/api";
import type { Metadata } from "next";

import { Ban, CalendarX } from "lucide-react";
import { notFound } from "next/navigation";

import { dict } from "@/lib/copy";
import { fetchBookingDetails, fetchSingleAppointment } from "@/lib/api-helpers";
import { RescheduleInterface } from "./RescheduleInterface";

export async function generateMetadata({
  params,
}: PageProps<"/reschedulings/[bookingId]">): Promise<Metadata> {
  const { bookingId } = await params;
  const booking = await fetchBookingDetails(bookingId, {
    next: { revalidate: 60 },
  });

  if (!booking) {
    return {};
  }

  return {
    title: `Reschedule Booking — ${booking.schedule_appointment.name}`,
    description: `Reschedule your meeting with ${booking.host.name}`,
  };
}

export default async function RescheduleBookingPage({
  params,
}: PageProps<"/reschedulings/[bookingId]">) {
  const { bookingId } = await params;
  const booking = await fetchBookingDetails(bookingId, {
    next: { revalidate: 60 },
  });

  if (!booking) {
    notFound();
  }

  // Check if booking is already cancelled
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

  // Check if the event has already started or passed
  const eventStartTime = new Date(booking.start_time);
  const now = new Date();
  if (now >= eventStartTime) {
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

  const appointment = await fetchSingleAppointment(
    booking.username,
    booking.schedule_appointment.slug,
    { next: { revalidate: 60 } },
  );
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
