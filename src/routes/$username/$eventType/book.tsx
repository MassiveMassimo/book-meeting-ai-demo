import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { Suspense } from "react";
import { fetchSingleAppointment, fetchUserAppointments } from "@/lib/api-helpers";
import { mapSingleAppointmentResponse } from "@/lib/api-mappers";
import { dict } from "@/lib/copy";
import { devError } from "@/lib/utils/dev-log";
import { BookingForm } from "./-components/booking-form";
import type { Profile, PublicAppointment } from "@/lib/types/api";

const bookingSearchSchema = z.object({
  start: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  timezone: z.string().optional(),
});

// Use SAME query keys as B3 so cache hits cross-route
const eventQuery = (username: string, slug: string) =>
  queryOptions({
    queryKey: ["singleAppointment", username, slug],
    queryFn: async (): Promise<PublicAppointment | null> => {
      try {
        const data = await fetchSingleAppointment(username, slug);
        if (!data) return null;
        return mapSingleAppointmentResponse(data, slug);
      } catch (error) {
        devError("getEventDetails", "Failed to fetch event details", error);
        return null;
      }
    },
    staleTime: 60_000,
  });

const profileQuery = (username: string) =>
  queryOptions({
    queryKey: ["userProfile", username],
    queryFn: async (): Promise<Profile | null> => {
      try {
        const data = await fetchUserAppointments(username);
        if (!data) return null;
        return { name: data.host.name, image: data.host.avatar_url };
      } catch (error) {
        devError("getUserProfile", "Failed to fetch user profile", error);
        return null;
      }
    },
    staleTime: 60_000,
  });

export const Route = createFileRoute("/$username/$eventType/book")({
  validateSearch: bookingSearchSchema,
  loader: async ({ context, params }) => {
    const [eventDetails, profile] = await Promise.all([
      context.queryClient.ensureQueryData(eventQuery(params.username, params.eventType)),
      context.queryClient.ensureQueryData(profileQuery(params.username)),
    ]);
    if (!eventDetails) {
      throw redirect({
        to: "/$username",
        params: { username: params.username },
        search: { error: "event_not_found" } as any,
      });
    }
    return { eventDetails, profile };
  },
  component: BookingPage,
});

function BookingPage() {
  const { username } = Route.useParams();
  const { eventDetails, profile } = Route.useLoaderData();
  const { start, date, time, timezone } = Route.useSearch();

  const eventType = {
    id: eventDetails.slug,
    title: eventDetails.title,
    duration: eventDetails.duration_minutes,
    description: eventDetails.description,
    integration: eventDetails.integration,
    location: eventDetails.location,
    color: "bg-blue-500",
  };
  const userProfile: Profile = profile || { name: username, image: "" };

  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground flex grow items-center justify-center p-8 text-sm">
          {dict.common.loading_form}
        </div>
      }
    >
      <BookingForm
        username={username}
        eventType={eventType}
        profile={userProfile}
        meetingPlatform={eventDetails.integration}
        hostTimezone={eventDetails.host_timezone}
        dict={dict}
        startParam={start}
        dateParam={date}
        timeParam={time}
        timezoneParam={timezone}
      />
    </Suspense>
  );
}
