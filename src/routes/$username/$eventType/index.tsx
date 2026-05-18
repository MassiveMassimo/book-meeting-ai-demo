import type { Profile, PublicAppointment } from "@/lib/types/api";

import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";

import { dict } from "@/lib/copy";
import { BookingInterface } from "@/components/BookingInterface";
import { fetchSingleAppointment, fetchUserAppointments } from "@/lib/api-helpers";
import { mapSingleAppointmentResponse } from "@/lib/api-mappers";
import { formatDuration } from "@/lib/utils";
import { devError } from "@/lib/utils/dev-log";

const siteUrl = import.meta.env.VITE_SITE_URL || "https://book-meeting-prototype.netlify.app";

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

function buildEventMeta(
  params: { username: string; eventType: string },
  data: { eventDetails: PublicAppointment | null; profile: Profile | null },
) {
  if (!data.eventDetails) return [{ title: params.eventType }];
  const { username, eventType: eventSlug } = params;
  const host: Profile = data.profile || { name: username, image: "" };

  const profileImageAbsolute =
    host.image &&
    (host.image.startsWith("http://") || host.image.startsWith("https://"))
      ? host.image
      : host.image
        ? `${siteUrl}${host.image.startsWith("/") ? "" : "/"}${host.image}`
        : "";

  const ogImage =
    `${siteUrl}/api/og?name=${encodeURIComponent(host.name)}` +
    `${profileImageAbsolute ? `&avatar=${encodeURIComponent(profileImageAbsolute)}` : ""}` +
    `&title=${encodeURIComponent(data.eventDetails.title)}`;

  const durationStr = formatDuration(data.eventDetails.duration_minutes, dict.booking_form);

  const description =
    data.eventDetails.description ||
    dict.metadata.event_description
      .replace("{duration}", durationStr)
      .replace("{name}", host.name);

  const title = `${data.eventDetails.title} — ${host.name}`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `${siteUrl}/${username}/${eventSlug}` },
    { property: "og:site_name", content: "Meeting.ai" },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: title },
    { property: "og:locale", content: "en_US" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
}

export const Route = createFileRoute("/$username/$eventType/")({
  loader: async ({ context, params }) => {
    const [eventDetails, profile] = await Promise.all([
      context.queryClient.ensureQueryData(eventQuery(params.username, params.eventType)),
      context.queryClient.ensureQueryData(profileQuery(params.username)),
    ]);
    if (eventDetails == null) {
      throw redirect({
        to: "/$username",
        params: { username: params.username },
        search: { error: "event_not_found" } as any,
      });
    }
    return { eventDetails, profile };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? buildEventMeta(params, loaderData)
      : [{ title: params.eventType }],
  }),
  component: EventTypePage,
});

function EventTypePage() {
  const { username } = Route.useParams();
  const { eventDetails, profile } = Route.useLoaderData();

  const eventType = {
    id: eventDetails.slug,
    title: eventDetails.title,
    duration: eventDetails.duration_minutes,
    description: eventDetails.description,
    color: "bg-blue-500",
    integration: eventDetails.integration,
    location: eventDetails.location,
  };

  const userProfile: Profile = profile || { name: username, image: "" };

  return (
    <BookingInterface
      username={username}
      eventType={eventType}
      profile={userProfile}
      meetingPlatform={eventDetails.integration}
      hostTimezone={eventDetails.host_timezone}
      dict={dict}
    />
  );
}
