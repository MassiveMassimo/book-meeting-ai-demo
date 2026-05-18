import type { AvailableSlot } from "@/lib/types/api";

import { fromZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";

import { generateMockSlots, MOCK_EVENTS, MOCK_HOST_USERNAME } from "@/lib/mocks";

export function transformSlots(data: unknown, timezone: string): AvailableSlot[] {
  const slots: AvailableSlot[] = [];

  const isDataValid = (
    d: unknown,
  ): d is {
    days: {
      date: string;
      slots: { start: string; end: string; available?: boolean }[];
    }[];
    timezone?: string;
  } => {
    return !!(
      d &&
      typeof d === "object" &&
      "days" in d &&
      Array.isArray((d as { days: unknown }).days)
    );
  };

  if (isDataValid(data)) {
    const responseTimezone =
      (typeof data.timezone === "string" && data.timezone) || timezone || "UTC";

    for (const day of data.days) {
      const { date, slots: daySlots = [] } = day;
      for (const slot of daySlots) {
        const baseStart = `${date}T${slot.start}:00`;
        const baseEnd = `${date}T${slot.end}:00`;
        try {
          slots.push({
            start: fromZonedTime(baseStart, responseTimezone).toISOString(),
            end: fromZonedTime(baseEnd, responseTimezone).toISOString(),
            available: slot.available !== false,
            timezone: responseTimezone,
          });
        } catch {
          // skip
        }
      }
    }
  }

  return slots;
}

// Demo build: replaces remote fetch with locally generated weekday 9am-5pm
// slots in the host's timezone. SWR is no longer used.
export function useAvailableSlots(
  username: string,
  eventTypeId: string,
  startDate: string | null,
  endDate: string | null,
  timezone: string,
) {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!username || !eventTypeId || !startDate || !endDate || !timezone) {
      setSlots([]);
      return;
    }

    if (username !== MOCK_HOST_USERNAME) {
      setSlots([]);
      return;
    }

    const event = MOCK_EVENTS.find((e) => e.slug === eventTypeId);
    if (!event) {
      setSlots([]);
      return;
    }

    setIsLoading(true);
    // Simulate a brief network delay for skeleton states.
    const timer = setTimeout(() => {
      setSlots(generateMockSlots(event.duration_minutes, startDate, endDate));
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [username, eventTypeId, startDate, endDate, timezone]);

  return {
    slots,
    isLoading,
    isValidating: false,
    error: null,
    mutate: async () => undefined,
  };
}
