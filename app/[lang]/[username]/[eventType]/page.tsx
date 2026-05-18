import type { Profile, PublicAppointment } from "@/lib/types/api";
import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { getDictionary, Locale } from "@/app/[lang]/dictionaries";
import { BookingInterface } from "@/components/BookingInterface";
import {
  fetchSingleAppointment,
  fetchUserAppointments,
} from "@/lib/api-helpers";
import { mapSingleAppointmentResponse } from "@/lib/api-mappers";
import { formatDuration } from "@/lib/utils";
import { devError } from "@/lib/utils/dev-log";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://book-meeting-prototype.netlify.app";

async function getUserProfile(username: string): Promise<Profile | null> {
  try {
    const data = await fetchUserAppointments(username, {
      next: { revalidate: 60 },
    });

    if (!data) {
      return null;
    }

    return {
      name: data.host.name,
      image: data.host.avatar_url,
    };
  } catch (error) {
    devError("getUserProfile", "Failed to fetch user profile", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/[username]/[eventType]">): Promise<Metadata> {
  const { username, eventType: eventSlug, lang } = await params;

  const [eventDetails, profile, dict] = await Promise.all([
    getEventDetails(username, eventSlug),
    getUserProfile(username),
    getDictionary(lang as Locale),
  ]);

  if (!eventDetails) {
    return {};
  }

  const host: Profile = profile || {
    name: username,
    image: "",
  };

  const profileImageAbsolute =
    host.image &&
    (host.image.startsWith("http://") || host.image.startsWith("https://"))
      ? host.image
      : host.image
        ? `${siteUrl}${host.image.startsWith("/") ? "" : "/"}${host.image}`
        : "";

  const ogImage = `${siteUrl}/api/og?name=${encodeURIComponent(
    host.name,
  )}${profileImageAbsolute ? `&avatar=${encodeURIComponent(profileImageAbsolute)}` : ""}&title=${encodeURIComponent(eventDetails.title)}&lang=${lang}`;

  const durationStr = formatDuration(
    eventDetails.duration_minutes,
    dict.booking_form,
  );

  const description =
    eventDetails.description ||
    dict.metadata.event_description
      .replace("{duration}", durationStr)
      .replace("{name}", host.name);

  const title = `${eventDetails.title} — ${host.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${lang}/${username}/${eventSlug}`,
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

async function getEventDetails(
  username: string,
  slug: string,
): Promise<PublicAppointment | undefined> {
  try {
    const data = await fetchSingleAppointment(username, slug, {
      next: { revalidate: 60 },
    });

    if (!data) {
      return undefined;
    }

    return mapSingleAppointmentResponse(data, slug);
  } catch (error) {
    devError("getEventDetails", "Failed to fetch event details", error);
    return undefined;
  }
}

export default async function EventTypePage({
  params,
}: PageProps<"/[lang]/[username]/[eventType]">) {
  const { username, eventType: eventSlug, lang } = await params;
  const [eventDetails, profile, dict] = await Promise.all([
    getEventDetails(username, eventSlug),
    getUserProfile(username),
    getDictionary(lang as Locale),
  ]);

  if (!eventDetails) {
    redirect(`/${lang}/${username}?error=event_not_found`);
  }

  const eventType = {
    id: eventDetails.slug,
    title: eventDetails.title,
    duration: eventDetails.duration_minutes,
    description: eventDetails.description,
    color: "bg-blue-500",
    integration: eventDetails.integration,
    location: eventDetails.location,
  };

  const userProfile: Profile = profile || {
    name: username,
    image: "",
  };

  return (
    <BookingInterface
      username={username}
      eventType={eventType}
      profile={userProfile}
      meetingPlatform={eventDetails.integration}
      hostTimezone={eventDetails.host_timezone}
      lang={lang}
      dict={dict}
    />
  );
}
