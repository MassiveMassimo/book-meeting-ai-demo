"use client";

import type { Dictionary } from "@/lib/copy";
import type { EventType, Profile } from "@/lib/types/api";

import { useRouter } from "next/navigation";

import { SlotPicker } from "@/components/SlotPicker";

interface BookingInterfaceProps {
  username: string;
  eventType: EventType;
  profile: Profile;
  meetingPlatform: string;
  hostTimezone?: string;
  dict: Dictionary;
}

export function BookingInterface({
  username,
  eventType,
  profile,
  meetingPlatform,
  hostTimezone,
  dict,
}: BookingInterfaceProps) {
  const router = useRouter();

  const handleConfirm = (startTimeISO: string, timezone: string) => {
    const baseUrl = `/${username}/${eventType.id}/book`;

    router.push(
      `${baseUrl}?start=${encodeURIComponent(
        startTimeISO,
      )}&timezone=${encodeURIComponent(timezone)}`,
    );
  };

  return (
    <SlotPicker
      username={username}
      eventType={eventType}
      profile={profile}
      meetingPlatform={meetingPlatform}
      hostTimezone={hostTimezone}
      onConfirm={handleConfirm}
      dict={dict}
    />
  );
}
