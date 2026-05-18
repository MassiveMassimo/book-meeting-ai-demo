import type { Metadata } from "next";

import { Ban, CalendarX } from "lucide-react";
import { notFound } from "next/navigation";

import { getDictionary, Locale } from "@/app/[lang]/dictionaries";
import { fetchBookingDetails } from "@/lib/api-helpers";
import { CancelForm } from "./CancelForm";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/cancellations/[bookingId]">): Promise<Metadata> {
  const { bookingId } = await params;
  const booking = await fetchBookingDetails(bookingId, {
    next: { revalidate: 60 },
  });

  if (!booking) {
    return {};
  }

  return {
    title: `Cancel Booking — ${booking.schedule_appointment.name}`,
    description: `Cancel your meeting with ${booking.host.name}`,
  };
}

export default async function CancelBookingPage({
  params,
}: PageProps<"/[lang]/cancellations/[bookingId]">) {
  const { bookingId, lang } = await params;
  const [booking, dict] = await Promise.all([
    fetchBookingDetails(bookingId, {
      next: { revalidate: 60 },
    }),
    getDictionary(lang as Locale),
  ]);

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
          {dict.cancel.already_cancelled}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {dict.cancel.already_cancelled_desc}
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
          {dict.cancel.cannot_cancel_past}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {dict.cancel.cannot_cancel_past_desc}
        </p>
      </div>
    );
  }

  return (
    <CancelForm
      bookingId={bookingId}
      booking={booking}
      lang={lang}
      dict={dict}
      profile={{
        name: booking.host.name,
        image: booking.host.avatar_url,
      }}
    />
  );
}
