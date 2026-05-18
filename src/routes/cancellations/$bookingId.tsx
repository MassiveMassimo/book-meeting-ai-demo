import { createFileRoute, notFound } from "@tanstack/react-router";
import { Ban, CalendarX } from "lucide-react";

import { fetchBookingDetails } from "@/lib/api-helpers";
import { dict } from "@/lib/copy";

import { CancelForm } from "./-components/cancel-form";

export const Route = createFileRoute("/cancellations/$bookingId")({
  loader: async ({ params }) => {
    const booking = await fetchBookingDetails(params.bookingId);
    // For demo_ ids, SSR returns a placeholder (localStorage unavailable server-side).
    // Only throw notFound when the id isn't a demo_ prefix — real ids that aren't
    // found in the backend should 404.
    if (!booking && !params.bookingId.startsWith("demo_")) throw notFound();
    return booking;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `Cancel Booking — ${loaderData.schedule_appointment.name}` },
            { name: "description", content: `Cancel your meeting with ${loaderData.host.name}` },
          ],
        }
      : { meta: [] },
  component: CancelBookingPage,
});

function CancelBookingPage() {
  const { bookingId } = Route.useParams();
  const booking = Route.useLoaderData();

  if (!booking) {
    // SSR returned null for a demo_ id — client will hydrate inside CancelForm.
    // Render nothing until client takes over (handled by CancelForm useEffect).
    return null;
  }

  if (booking.status === "cancelled") {
    return (
      <div className="mx-auto flex max-w-md grow flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
          <Ban className="text-muted-foreground size-8" />
        </div>
        <h2 className="text-foreground mb-3 text-xl font-bold md:text-2xl">{dict.cancel.already_cancelled}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">{dict.cancel.already_cancelled_desc}</p>
      </div>
    );
  }

  const eventStartTime = new Date(booking.start_time);
  const now = new Date();
  if (now >= eventStartTime) {
    return (
      <div className="mx-auto flex max-w-md grow flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
          <CalendarX className="text-muted-foreground size-8" />
        </div>
        <h2 className="text-foreground mb-3 text-xl font-bold md:text-2xl">{dict.cancel.cannot_cancel_past}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">{dict.cancel.cannot_cancel_past_desc}</p>
      </div>
    );
  }

  return (
    <CancelForm
      bookingId={bookingId}
      booking={booking}
      dict={dict}
      profile={{ name: booking.host.name, image: booking.host.avatar_url }}
    />
  );
}
