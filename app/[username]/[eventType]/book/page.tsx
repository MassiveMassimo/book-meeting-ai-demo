import type { Profile, PublicAppointment } from "@/lib/types/api";

import { Suspense } from "react";

import { redirect } from "next/navigation";

import { dict } from "@/lib/copy";
import {
  fetchSingleAppointment,
  fetchUserAppointments,
} from "@/lib/api-helpers";
import { mapSingleAppointmentResponse } from "@/lib/api-mappers";
import { devError } from "@/lib/utils/dev-log";
import { BookingForm } from "./BookingForm";

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

export default async function BookingPage({
  params,
}: PageProps<"/[username]/[eventType]/book">) {
  const { username, eventType: eventSlug } = await params;
  const [eventDetails, profile] = await Promise.all([
    getEventDetails(username, eventSlug),
    getUserProfile(username),
  ]);

  if (!eventDetails) {
    redirect(`/${username}?error=event_not_found`);
  }

  const eventType = {
    id: eventDetails.slug,
    title: eventDetails.title,
    duration: eventDetails.duration_minutes,
    description: eventDetails.description,
    integration: eventDetails.integration,
    location: eventDetails.location,
    color: "bg-blue-500",
  };

  // Use profile from API or fallback to username
  const userProfile: Profile = profile || {
    name: username,
    image: "",
  };

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
      />
    </Suspense>
  );
}
