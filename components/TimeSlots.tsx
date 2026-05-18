import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { AvailableSlot } from "@/lib/types/api";

import { useEffect, useMemo, useRef, useState } from "react";

import { formatInTimeZone } from "date-fns-tz";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import TwentyFourHourToggle from "./TwentyFourHourToggle";

interface TimeSlotsProps {
  selectedDate: Date | null;
  selectedSlot: string | null; // ISO timestamp of the selected slot
  onSelectSlot: (slot: string) => void;
  onConfirm: () => void;
  availableTimes: AvailableSlot[] | string[]; // Accept both formats for backward compatibility
  bookedTimes?: string[]; // Times that are already booked for the selected date
  className?: string;
  id?: string;
  showDateLabel?: boolean; // Control whether to show the date label (Fri 19)
  showTimeFormatToggle?: boolean;
  use24Hour?: boolean;
  onUse24HourChange?: (next: boolean) => void;
  isLoading?: boolean;
  confirmDisabled?: boolean; // Disable confirm button externally (for reschedule flow)
  /**
   * IANA timezone identifier (e.g., "America/New_York")
   * used to display slot times in the user's preferred timezone.
   */
  timezone?: string;
  /** When true, applies a max-height constraint for use in mobile drawers */
  inDrawer?: boolean;
  /** Label for the confirm button (default: "Book") */
  confirmLabel?: string;
  dict: Dictionary["slot_picker"];
  lang?: string;
}

// Convert 24-hour time to 12-hour format with AM/PM
function formatTime(time24: string, dict: { am: string; pm: string }) {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? dict.pm : dict.am;
  const hours12 = hours % 12 || 12;
  return {
    time: `${hours12}:${minutes.toString().padStart(2, "0")}`,
    period,
  };
}

export function TimeSlots({
  selectedDate,
  selectedSlot,
  onSelectSlot,
  onConfirm,
  availableTimes,
  bookedTimes = [],
  className,
  id,
  showDateLabel = true,
  showTimeFormatToggle = true,
  use24Hour: use24HourProp,
  onUse24HourChange,
  isLoading = false,
  confirmDisabled = false,
  timezone,
  inDrawer = false,
  confirmLabel,
  dict,
  lang = "en",
}: TimeSlotsProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [localUse24Hour, setLocalUse24Hour] = useState(false);
  const use24Hour = use24HourProp ?? localUse24Hour;
  const setUse24Hour = onUse24HourChange ?? setLocalUse24Hour;
  const [stuckHeaders, setStuckHeaders] = useState<Set<string>>(new Set());
  const scrollAreaRootRef = useRef<HTMLDivElement | null>(null);
  const drawerScrollRef = useRef<HTMLDivElement | null>(null);

  const displayTimezone =
    timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  const slots: AvailableSlot[] = useMemo(
    () =>
      availableTimes.map((item) =>
        typeof item === "string"
          ? { start: item, end: item, available: true }
          : item,
      ),
    [availableTimes],
  );

  const groups = useMemo(() => {
    const g: Record<string, AvailableSlot[]> = {};
    slots.forEach((slot) => {
      const dateStr = formatInTimeZone(
        slot.start,
        displayTimezone,
        "yyyy-MM-dd",
      );
      if (!g[dateStr]) g[dateStr] = [];
      g[dateStr].push(slot);
    });
    return Object.entries(g).sort((a, b) => a[0].localeCompare(b[0]));
  }, [slots, displayTimezone]);

  useEffect(() => {
    const root: HTMLElement | null = inDrawer
      ? drawerScrollRef.current
      : (scrollAreaRootRef.current?.querySelector<HTMLElement>(
          '[data-slot="scroll-area-viewport"]',
        ) ?? null);

    if (!root) return;

    const sentinels = Array.from(
      root.querySelectorAll<HTMLElement>("[data-sticky-sentinel]"),
    );
    if (sentinels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setStuckHeaders((prev) => {
          const next = new Set(prev);
          let changed = false;

          for (const entry of entries) {
            const key = entry.target
              .getAttribute("data-sticky-sentinel")
              ?.trim();
            if (!key) continue;

            const rootTop = entry.rootBounds?.top ?? 0;
            const isAboveTop = entry.boundingClientRect.top < rootTop;
            const isStuck = !entry.isIntersecting && isAboveTop;

            const had = next.has(key);
            if (isStuck && !had) {
              next.add(key);
              changed = true;
            } else if (!isStuck && had) {
              next.delete(key);
              changed = true;
            }
          }

          return changed ? next : prev;
        });
      },
      { root, threshold: 0 },
    );

    for (const el of sentinels) observer.observe(el);

    return () => observer.disconnect();
  }, [groups, inDrawer, selectedDate]);

  if (!selectedDate) return null;

  const slotsContent = (
    <div className="flex flex-col gap-4 pr-2">
      {groups.map(([dateKey, groupSlots]) => {
        const groupDateLabel = new Intl.DateTimeFormat(lang, {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: displayTimezone,
        }).format(new Date(groupSlots[0].start));
        // Show header if we have multiple groups or if the group date differs from the selected date (in display timezone)
        const showHeader =
          groups.length > 1 ||
          formatInTimeZone(selectedDate, displayTimezone, "yyyy-MM-dd") !==
            dateKey;

        return (
          <div key={dateKey} className="flex flex-col gap-2">
            {showHeader && (
              <>
                <div
                  aria-hidden="true"
                  data-sticky-sentinel={dateKey}
                  className="h-px"
                />
                <h4
                  className={cn(
                    "text-muted-foreground sticky top-0 z-10 py-1 text-xs font-medium uppercase",
                    stuckHeaders.has(dateKey) && "bg-background",
                  )}
                >
                  {groupDateLabel}
                </h4>
              </>
            )}
            <div className="flex flex-col gap-1">
              {groupSlots.map((slot) => {
                const slotDate = new Date(slot.start);
                const time24 = formatInTimeZone(
                  slotDate,
                  displayTimezone,
                  "HH:mm",
                );

                const isSelected = selectedSlot === slot.start;

                const isBooked = bookedTimes.includes(time24);
                const isUnavailable = slot.available === false;
                const { time: time12, period: period12 } = formatTime(
                  time24,
                  dict,
                );
                const timeText = use24Hour ? time24 : time12;
                const periodText = use24Hour ? null : period12;

                if (isBooked || isUnavailable) {
                  return (
                    <div
                      key={slot.start}
                      className="flex w-full items-center gap-2"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="grow">
                            <Button
                              disabled
                              variant="ghost"
                              className="h-12 w-full rounded-lg text-sm font-medium"
                            >
                              <span
                                className={
                                  isBooked || isUnavailable
                                    ? "line-through opacity-70"
                                    : "opacity-70"
                                }
                              >
                                {timeText}
                              </span>
                              {periodText ? (
                                <span className="text-muted-foreground opacity-50">
                                  {periodText}
                                </span>
                              ) : null}
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          side={inDrawer ? "top" : "left"}
                          className="pointer-events-none"
                        >
                          <p>
                            {isBooked
                              ? dict.already_booked
                              : dict.not_available}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  );
                }

                return (
                  <div
                    key={slot.start}
                    className="flex w-full items-center gap-2"
                  >
                    <Button
                      onClick={() => onSelectSlot(slot.start)}
                      variant={isSelected ? "default" : "secondary"}
                      className="h-12 grow rounded-lg text-sm font-medium transition"
                    >
                      {timeText}
                      {periodText ? <span>{periodText}</span> : null}
                    </Button>
                    {isSelected && (
                      <Button
                        onClick={() => {
                          setIsConfirming(true);
                          try {
                            onConfirm();
                          } catch (error) {
                            setIsConfirming(false);
                            throw error;
                          }
                        }}
                        variant="default"
                        className="bg-brand h-12 rounded-lg px-6 font-medium shadow-md hover:shadow-lg active:scale-95"
                        disabled={isLoading || isConfirming || confirmDisabled}
                        aria-busy={isConfirming}
                      >
                        {isConfirming ? (
                          <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : null}
                        <span>{confirmLabel || dict.book_button}</span>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      id={id}
      className={cn("flex h-full min-h-0 w-full flex-col gap-3", className)}
    >
      {(showDateLabel || showTimeFormatToggle) && (
        <>
          <div
            className={cn(
              "flex items-center",
              showDateLabel && showTimeFormatToggle
                ? "justify-between"
                : showTimeFormatToggle
                  ? "justify-end"
                  : "justify-start",
            )}
          >
            {showDateLabel && (
              <>
                {groups.length > 1 ? (
                  <h3 className="shrink-0 space-x-0.5 text-base font-medium">
                    <span className="text-foreground font-semibold">
                      {new Intl.DateTimeFormat(lang, {
                        weekday: "short",
                        timeZone: displayTimezone,
                      }).format(new Date(groups[0][1][0].start))}
                    </span>{" "}
                    <span className="text-foreground/40">
                      {new Intl.DateTimeFormat(lang, {
                        day: "numeric",
                        timeZone: displayTimezone,
                      }).format(new Date(groups[0][1][0].start))}
                    </span>
                    <span className="text-foreground/40 px-1">-</span>
                    <span className="text-foreground font-semibold">
                      {new Intl.DateTimeFormat(lang, {
                        weekday: "short",
                        timeZone: displayTimezone,
                      }).format(
                        new Date(groups[groups.length - 1][1][0].start),
                      )}
                    </span>{" "}
                    <span className="text-foreground/40">
                      {new Intl.DateTimeFormat(lang, {
                        day: "numeric",
                        timeZone: displayTimezone,
                      }).format(
                        new Date(groups[groups.length - 1][1][0].start),
                      )}
                    </span>
                  </h3>
                ) : (
                  <h3 className="shrink-0 space-x-0.5 text-base font-medium">
                    <span className="text-foreground font-semibold">
                      {new Intl.DateTimeFormat(lang, {
                        weekday: "short",
                        timeZone: displayTimezone,
                      }).format(
                        groups[0]?.[1]?.[0]
                          ? new Date(groups[0][1][0].start)
                          : selectedDate,
                      )}
                    </span>{" "}
                    <span className="text-foreground/40">
                      {new Intl.DateTimeFormat(lang, {
                        day: "numeric",
                        timeZone: displayTimezone,
                      }).format(
                        groups[0]?.[1]?.[0]
                          ? new Date(groups[0][1][0].start)
                          : selectedDate,
                      )}
                    </span>
                  </h3>
                )}
              </>
            )}
            {showTimeFormatToggle && (
              <TwentyFourHourToggle value={use24Hour} onChange={setUse24Hour} />
            )}
          </div>
        </>
      )}

      {isLoading ? (
        <div
          className={cn(
            "flex flex-col",
            inDrawer ? "h-full overflow-hidden" : "min-h-0 grow",
          )}
        >
          <div className="text-muted-foreground flex grow flex-col items-center justify-center gap-2">
            <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <p>{dict.loading_slots}</p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col",
            inDrawer ? "h-full overflow-hidden" : "min-h-0 grow",
          )}
        >
          {inDrawer ? (
            <div ref={drawerScrollRef} className="h-full overflow-y-auto">
              {slotsContent}
            </div>
          ) : (
            <ScrollArea ref={scrollAreaRootRef} className="min-h-0 grow">
              {slotsContent}
            </ScrollArea>
          )}
        </div>
      )}
    </div>
  );
}
