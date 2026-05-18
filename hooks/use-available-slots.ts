import type { AvailableSlot } from "@/lib/types/api";

import { fromZonedTime } from "date-fns-tz";
import { useEffect, useRef, useState } from "react";

import {
  generateMockSlotsRaw,
  MOCK_EVENTS,
  MOCK_HOST_USERNAME,
  type RawSlotResponse,
} from "@/lib/mocks";

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
        try {
          slots.push({
            start: fromZonedTime(`${date}T${slot.start}:00`, responseTimezone).toISOString(),
            end: fromZonedTime(`${date}T${slot.end}:00`, responseTimezone).toISOString(),
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
  // Initial loading: consumers must not run availability checks against an
  // empty array on first render.
  const [isLoading, setIsLoading] = useState(true);
  const rawRef = useRef<RawSlotResponse | null>(null);

  useEffect(() => {
    if (!username || !eventTypeId || !startDate || !endDate || !timezone) {
      rawRef.current = null;
      setSlots([]);
      setIsLoading(false);
      return;
    }

    if (username !== MOCK_HOST_USERNAME) {
      rawRef.current = null;
      setSlots([]);
      setIsLoading(false);
      return;
    }

    const event = MOCK_EVENTS.find((e) => e.slug === eventTypeId);
    if (!event) {
      rawRef.current = null;
      setSlots([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const raw = generateMockSlotsRaw(event.duration_minutes, startDate, endDate);
      rawRef.current = raw;
      setSlots(transformSlots(raw, timezone));
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [username, eventTypeId, startDate, endDate, timezone]);

  return {
    slots,
    isLoading,
    isValidating: false,
    error: null,
    // Revalidation returns the same raw payload synchronously so the booking
    // form's `await mutate()` + `transformSlots(rawData, ...)` path matches
    // the real API contract.
    mutate: async () => rawRef.current ?? undefined,
  };
}
