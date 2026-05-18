import type { EventType, Profile, PublicAppointment } from "@/lib/types/api";

import { createFileRoute } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";

import { dict } from "@/lib/copy";
import { EventCard, EventCardSkeleton } from "@/components/EventCard";
import { ToastListener } from "@/components/ToastListener";
import { Img } from "@/components/ui/img";
import { fetchUserAppointments } from "@/lib/api-helpers";
import { mapUserAppointmentsResponse } from "@/lib/api-mappers";
import { cn } from "@/lib/utils";

function mapAppointmentToEventType(appointment: PublicAppointment): EventType {
  return {
    id: appointment.slug,
    title: appointment.title,
    duration: appointment.duration_minutes,
    description: appointment.description || "",
    integration: appointment.integration,
    location: appointment.location,
    color: "bg-blue-500", // API doesn't provide color, using default
  };
}

const userQuery = (username: string) =>
  queryOptions({
    queryKey: ["userAppointments", username],
    queryFn: async () => {
      const data = await fetchUserAppointments(username);
      if (!data?.schedule_appointments || !Array.isArray(data.schedule_appointments)) {
        return { appointments: [], profile: null };
      }
      return mapUserAppointmentsResponse(data);
    },
    staleTime: 60_000,
  });

function buildUserMeta(
  username: string,
  data: { appointments: any[]; profile: any },
) {
  const profile = data.profile || { name: username, image: "" };
  const siteUrl =
    import.meta.env.VITE_SITE_URL || "https://book-meeting-prototype.netlify.app";
  const title = dict.metadata.user_title.replace("{name}", profile.name);
  let description = dict.metadata.user_description_empty.replace("{name}", profile.name);
  if (data.appointments.length === 1) {
    description = dict.metadata.user_description_one.replace("{name}", profile.name);
  } else if (data.appointments.length > 1) {
    description = dict.metadata.user_description
      .replace("{name}", profile.name)
      .replace("{count}", String(data.appointments.length));
  }
  const profileImageAbsolute =
    profile.image &&
    (profile.image.startsWith("http://") || profile.image.startsWith("https://"))
      ? profile.image
      : profile.image
        ? `${siteUrl}${profile.image.startsWith("/") ? "" : "/"}${profile.image}`
        : "";
  const ogImage = `${siteUrl}/api/og?name=${encodeURIComponent(profile.name || username)}${profileImageAbsolute ? `&avatar=${encodeURIComponent(profileImageAbsolute)}` : ""}`;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `${siteUrl}/${username}` },
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

export const Route = createFileRoute("/$username/")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(userQuery(params.username)),
  head: ({ loaderData, params }) => ({
    meta: buildUserMeta(params.username, loaderData ?? { appointments: [], profile: null }),
  }),
  component: UserPage,
});

function UserPage() {
  const { username } = Route.useParams();
  const { appointments, profile: apiProfile } = Route.useLoaderData();

  const eventTypes: EventType[] = appointments.map(mapAppointmentToEventType);

  // Check if username was not found (no profile and no appointments)
  const isUsernameNotFound = !apiProfile && appointments.length === 0;

  const profile: Profile = apiProfile || {
    name: username,
    image: "",
  };

  // Show error state if username not found
  if (isUsernameNotFound) {
    return (
      <div className="flex grow flex-col items-center justify-center px-6 py-12 text-center">
        <div className="text-muted-foreground mb-4 text-4xl">🔍</div>
        <h1 className="text-foreground mb-2 text-xl font-bold md:text-2xl">
          {dict.user_page.not_found}
        </h1>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed md:text-base">
          {dict.user_page.not_found_desc.replace("{username}", username)}
        </p>
      </div>
    );
  }

  return (
    <>
      <ToastListener />
      <div className="flex flex-col xl:h-full xl:min-h-0">
        <div
          className={cn(
            "border-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both flex flex-col items-center border-b px-3 py-8 text-center duration-1000 md:p-10",
          )}
        >
          {profile.image && (
            <div className="relative mb-4 flex size-20 items-center justify-center overflow-hidden rounded-full text-2xl font-bold md:mb-5 md:size-24 md:text-3xl">
              <Img
                src={profile.image}
                alt={profile.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          )}
          <h1 className="text-foreground mb-2 text-xl font-bold md:text-2xl">
            {profile.name}
          </h1>
          <p className="text-muted-foreground max-w-lg px-4 text-sm leading-relaxed text-balance md:text-base">
            {dict.user_page.welcome}
          </p>
        </div>

        {eventTypes.length > 0 ? (
          <div className="grow overflow-visible xl:min-h-0 xl:overflow-y-auto">
            <div className="divide-border/50 flex flex-col items-stretch divide-y md:flex-row md:flex-wrap md:divide-x md:divide-y-0">
              {eventTypes.map((event, index) => {
                // Calculate if this card is in the last row for the 3-col desktop grid
                const itemsPerRow = 3;
                const totalRows = Math.ceil(eventTypes.length / itemsPerRow);
                const lastRowStart = (totalRows - 1) * itemsPerRow;
                const isInLastRow = index >= lastRowStart;

                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    username={username}
                    hasMoreThanThree={eventTypes.length > 3}
                    isInLastRow={isInLastRow}
                    dict={dict}
                    delay={150 + index * 100}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="relative flex grow flex-col overflow-visible xl:min-h-0 xl:overflow-y-auto">
            <div className="text-muted-foreground pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-sm font-medium md:text-base">
              {dict.user_page.no_events.replace("{name}", profile.name)}
            </div>

            <div className="divide-border/50 flex flex-col items-stretch divide-y md:flex-row md:flex-wrap md:divide-x md:divide-y-0">
              {Array.from({ length: 3 }).map((_, idx) => (
                <EventCardSkeleton key={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
