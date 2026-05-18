import type { EventType, Profile, PublicAppointment } from "@/lib/types/api";
import type { Metadata } from "next";

import Image from "next/image";

import { getDictionary, Locale } from "@/app/[lang]/dictionaries";
import { EventCard, EventCardSkeleton } from "@/components/EventCard";
import { ToastListener } from "@/components/ToastListener";
import { fetchUserAppointments } from "@/lib/api-helpers";
import { mapUserAppointmentsResponse } from "@/lib/api-mappers";
import { cn } from "@/lib/utils";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://book-meeting-prototype.netlify.app";

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

async function getUserData(
  username: string,
): Promise<{ appointments: PublicAppointment[]; profile: Profile | null }> {
  const data = await fetchUserAppointments(username, {
    next: { revalidate: 60 },
  });

  if (
    !data ||
    !data.schedule_appointments ||
    !Array.isArray(data.schedule_appointments)
  ) {
    return { appointments: [], profile: null };
  }

  return mapUserAppointmentsResponse(data);
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/[username]">): Promise<Metadata> {
  const { username, lang } = await params;

  // Fetch user data for metadata
  const [{ appointments, profile: apiProfile }, dict] = await Promise.all([
    getUserData(username),
    getDictionary(lang as Locale),
  ]);

  const profile: Profile = apiProfile || {
    name: username,
    image: "",
  };

  // Build dynamic title
  const title = dict.metadata.user_title.replace("{name}", profile.name);
  let description = dict.metadata.user_description_empty.replace(
    "{name}",
    profile.name,
  );

  if (appointments.length > 0) {
    if (appointments.length === 1) {
      description = dict.metadata.user_description_one.replace(
        "{name}",
        profile.name,
      );
    } else {
      description = dict.metadata.user_description
        .replace("{name}", profile.name)
        .replace("{count}", String(appointments.length));
    }
  }

  // Build dynamic OG image using API route; ensure absolute URLs
  const profileImageAbsolute =
    profile.image &&
    (profile.image.startsWith("http://") ||
      profile.image.startsWith("https://"))
      ? profile.image
      : profile.image
        ? `${siteUrl}${profile.image.startsWith("/") ? "" : "/"}${profile.image}`
        : "";

  const ogImage = `${siteUrl}/api/og?name=${encodeURIComponent(
    profile.name || username,
  )}${profileImageAbsolute ? `&avatar=${encodeURIComponent(profileImageAbsolute)}` : ""}&lang=${lang}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${lang}/${username}`,
      siteName: "Meeting.ai",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: lang === "en" ? "en_US" : lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function UserPage({
  params,
}: PageProps<"/[lang]/[username]">) {
  const { username, lang } = await params;

  const [{ appointments, profile: apiProfile }, dict] = await Promise.all([
    getUserData(username),
    getDictionary(lang as Locale),
  ]);

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
              <Image
                src={profile.image}
                alt={profile.name}
                fill
                className="object-cover"
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
                    lang={lang}
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
