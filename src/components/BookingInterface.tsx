"use client";

import type { Dictionary } from "@/lib/copy";
import type { EventType, Profile } from "@/lib/types/api";

import { useRouter } from "@tanstack/react-router";

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
    // TODO: typed link — route params/search types resolve after Phase B route registration
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (router.navigate as any)({
      to: "/$username/$eventType/book",
      params: { username, eventType: eventType.id },
      search: { start: startTimeISO, timezone },
    });
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
