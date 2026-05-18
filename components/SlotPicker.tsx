"use client";

import type { Dictionary } from "@/lib/copy";
import type { EventType, Profile } from "@/lib/types/api";

import { useMemo, useState } from "react";

import {
  eachDayOfInterval,
  endOfMonth,
  isSameMonth,
  startOfMonth,
  startOfToday,
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  ArrowUpDown,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
} from "lucide-react";
import Image from "next/image";

import { Calendar } from "@/components/Calendar";
import { TimeSlots } from "@/components/TimeSlots";
import { TimezoneSelector } from "@/components/TimezoneSelector";
import TwentyFourHourToggle from "@/components/TwentyFourHourToggle";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAvailableSlots } from "@/hooks/use-available-slots";
import { cn, formatDuration } from "@/lib/utils";
import { formatPlatformName } from "@/lib/utils/platform";

interface SlotPickerProps {
  // Data
  username: string;
  eventType: EventType;
  profile: Profile;
  meetingPlatform: string;
  hostTimezone?: string;

  // Actions
  onConfirm: (startTimeISO: string, timezone: string) => void;

  // Customization
  renderHeader?: () => React.ReactNode;
  renderExtraInfo?: () => React.ReactNode;
  calendarTitle?: React.ReactNode;
  confirmLabel?: string;
  className?: string;
  dict: Dictionary;
}

export function SlotPicker({
  username,
  eventType,
  profile,
  meetingPlatform,
  hostTimezone,
  onConfirm,
  renderHeader,
  renderExtraInfo,
  calendarTitle,
  confirmLabel,
  className,
  dict,
}: SlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(() =>
    startOfMonth(startOfToday()),
  );

  const [timezone, setTimezone] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selected-timezone");
      if (stored) {
        return stored;
      }
    }
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  });

  // Persist timezone changes to localStorage
  const handleTimezoneChange = (newTimezone: string) => {
    setTimezone(newTimezone);
    if (typeof window !== "undefined") {
      localStorage.setItem("selected-timezone", newTimezone);
    }
  };
  const [showHostTimezone, setShowHostTimezone] = useState(false);
  const [use24Hour, setUse24Hour] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const today = startOfToday();
  const effectiveStart = isSameMonth(currentMonth, today) ? today : monthStart;
  const scheduleTimezone = hostTimezone || timezone;
  const startDateStr = formatInTimeZone(
    effectiveStart,
    scheduleTimezone,
    "yyyy-MM-dd",
  );
  const endDateStr = formatInTimeZone(monthEnd, scheduleTimezone, "yyyy-MM-dd");

  const { slots: fetchedSlots, isLoading: isLoadingSlots } = useAvailableSlots(
    username,
    eventType.id,
    startDateStr,
    endDateStr,
    scheduleTimezone,
  );

  const canToggleTimezone = Boolean(hostTimezone) && hostTimezone !== timezone;
  const activeTimezone =
    canToggleTimezone && showHostTimezone ? hostTimezone! : timezone;
  const formatTimezoneLabel = (tz: string) => {
    try {
      const offset =
        new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          timeZoneName: "longOffset",
        })
          .formatToParts(new Date())
          .find((part) => part.type === "timeZoneName")?.value || "";
      const gmt = offset === "GMT" ? "GMT+00:00" : offset;
      return `${gmt ? `(${gmt}) ` : ""} ${tz.replace(/_/g, " ")}`;
    } catch {
      return tz.replace(/_/g, " ");
    }
  };
  const viewerTimezoneLabel = formatTimezoneLabel(timezone);
  const hostTimezoneLabel = hostTimezone
    ? formatTimezoneLabel(hostTimezone)
    : "";

  const availableSlots = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    // IMPORTANT: Filter slots based on the host schedule timezone (where availability is defined).
    // The selectedDate represents a calendar day, and we want all slots that fall on that day
    // in the host's timezone, regardless of how they appear in the viewer's timezone.
    const dateKeyInScheduleTz = formatInTimeZone(
      selectedDate,
      scheduleTimezone,
      "yyyy-MM-dd",
    );

    const slotsForDate = fetchedSlots.filter((slot) => {
      return (
        formatInTimeZone(slot.start, scheduleTimezone, "yyyy-MM-dd") ===
        dateKeyInScheduleTz
      );
    });

    return slotsForDate.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );
  }, [selectedDate, fetchedSlots, scheduleTimezone]);

  const { unavailableDates, fullyBookedDates } = useMemo(() => {
    const unavail: Date[] = [];
    const booked: Date[] = [];

    if (isLoadingSlots)
      return { unavailableDates: unavail, fullyBookedDates: booked };

    const monthDays = eachDayOfInterval({
      start: effectiveStart,
      end: monthEnd,
    });

    // Group fetched slots by date string in schedule timezone for easy lookup
    const slotsByDate = new Map<string, (typeof fetchedSlots)[0][]>();
    for (const slot of fetchedSlots) {
      const dateKey = formatInTimeZone(
        slot.start,
        scheduleTimezone,
        "yyyy-MM-dd",
      );
      if (!slotsByDate.has(dateKey)) {
        slotsByDate.set(dateKey, []);
      }
      slotsByDate.get(dateKey)!.push(slot);
    }

    for (const day of monthDays) {
      const dateKey = formatInTimeZone(day, scheduleTimezone, "yyyy-MM-dd");
      const slotsForDay = slotsByDate.get(dateKey);

      if (!slotsForDay || slotsForDay.length === 0) {
        // Not in API response -> Unavailable
        unavail.push(day);
      } else {
        // In API response -> Check if any slot is available
        const hasAvailable = slotsForDay.some((s) => s.available !== false);
        if (!hasAvailable) {
          booked.push(day);
        }
      }
    }

    return { unavailableDates: unavail, fullyBookedDates: booked };
  }, [
    fetchedSlots,
    isLoadingSlots,
    effectiveStart,
    monthEnd,
    scheduleTimezone,
  ]);

  const handleConfirm = () => {
    if (selectedSlot) {
      onConfirm(selectedSlot, activeTimezone);
    }
  };

  return (
    <div
      className={cn(
        "animate-in fade-in fill-mode-both flex h-full flex-col overflow-hidden p-3 pr-1 duration-1000 md:overflow-visible xl:flex-row",
        className,
      )}
    >
      <div className="bg-background dark:bg-secondary animate-in fade-in slide-in-from-bottom-4 fill-mode-both relative z-10 flex shrink-0 flex-col rounded-xl p-4 shadow-xl shadow-slate-300/30 duration-1000 md:p-6 xl:w-1/4 dark:shadow-none">
        <div className="mb-3 flex items-center gap-3 xl:mb-0 xl:block">
          {renderHeader ? renderHeader() : null}
          <div className="flex items-center gap-2 xl:hidden">
            <div className="bg-muted relative size-5 overflow-hidden rounded-full">
              <Image
                src={profile.image}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-muted-foreground text-sm font-medium">
              {profile.name}
            </span>
          </div>
        </div>

        <div className="flex grow flex-col xl:mt-12">
          <div className="mb-2 hidden items-center gap-2 xl:flex">
            <div className="bg-muted relative size-5 overflow-hidden rounded-full">
              <Image
                src={profile.image}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-muted-foreground text-sm font-medium">
              {profile.name}
            </span>
          </div>

          <h1 className="text-foreground mb-3 text-lg leading-tight font-bold wrap-break-word md:text-xl">
            {eventType.title}
          </h1>

          {renderExtraInfo ? renderExtraInfo() : null}

          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 xl:flex-col xl:gap-3">
            <div className="text-muted-foreground flex items-center text-sm">
              <Clock className="text-muted-foreground mr-2 size-4" />
              <span>
                {formatDuration(eventType.duration, dict.booking_form)}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center text-sm">
              <Video className="text-muted-foreground mr-2 size-4" />
              <span>{formatPlatformName(meetingPlatform, dict.platforms)}</span>
            </div>
            {eventType.location && (
              <div className="text-muted-foreground flex items-center text-sm">
                <MapPin className="text-muted-foreground mr-2 size-4" />
                <span>{eventType.location}</span>
              </div>
            )}
          </div>

          <p className="text-muted-foreground hidden text-sm leading-relaxed xl:block">
            {eventType.description}
          </p>
        </div>

        <TimezoneSelector
          value={timezone}
          onChange={handleTimezoneChange}
          dict={dict.timezone_selector}
        />
        {canToggleTimezone ? (
          <div className="text-muted-foreground mt-2 flex items-center text-xs leading-tight">
            <div className="flex grow flex-col gap-0.5">
              <div>
                {showHostTimezone
                  ? dict.slot_picker.host_tz_prefix
                  : dict.slot_picker.viewer_tz_prefix}
              </div>
              <span className="text-foreground/70 min-w-0 truncate font-medium">
                {showHostTimezone ? hostTimezoneLabel : viewerTimezoneLabel}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              onClick={() => setShowHostTimezone((prev) => !prev)}
              title={
                showHostTimezone
                  ? dict.slot_picker.show_your_tz.replace("{tz}", timezone)
                  : dict.slot_picker.show_host_tz.replace(
                      "{tz}",
                      hostTimezone || "",
                    )
              }
              aria-label={
                showHostTimezone
                  ? dict.slot_picker.switch_to_your_tz
                  : dict.slot_picker.switch_to_host_tz
              }
            >
              <ArrowUpDown className="size-3.5" />
            </Button>
          </div>
        ) : null}
      </div>

      <div className="border-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both flex flex-col p-4 delay-150 duration-1000 md:p-8 xl:min-w-0 xl:grow xl:border-r">
        {calendarTitle && <div className="mb-4">{calendarTitle}</div>}
        <Calendar
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setSelectedSlot(null);
            if (window.innerWidth < 1280) {
              setDrawerOpen(true);
            }
          }}
          onMonthChange={(month) => {
            setCurrentMonth(startOfMonth(month));
          }}
          unavailableDates={unavailableDates}
          fullyBookedDates={fullyBookedDates}
          dict={dict.calendar}
        />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both hidden shrink-0 flex-col delay-300 duration-1000 xl:flex xl:w-1/5 xl:min-w-0 xl:grow">
        {selectedDate ? (
          <div className="border-border/50 flex h-full flex-col pt-4 pr-4 pl-4">
            <TimeSlots
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              onConfirm={handleConfirm}
              availableTimes={availableSlots}
              bookedTimes={[]}
              isLoading={isLoadingSlots}
              timezone={activeTimezone}
              use24Hour={use24Hour}
              onUse24HourChange={setUse24Hour}
              confirmLabel={confirmLabel}
              dict={dict.slot_picker}
            />
          </div>
        ) : (
          <div className="border-border/50 flex grow flex-col items-center justify-center gap-4 pt-4 pr-4 pl-4">
            <div className="bg-muted flex size-16 items-center justify-center rounded-full">
              <CalendarIcon className="text-muted-foreground size-8" />
            </div>
            <p className="text-center text-sm font-medium text-balance">
              {calendarTitle
                ? dict.slot_picker.select_date_see_times
                : dict.slot_picker.select_date_check_times}
            </p>
          </div>
        )}
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="flex max-h-[85vh] flex-col">
          <DrawerHeader className="shrink-0">
            {selectedDate ? (
              <div className="flex items-center justify-between">
                <DrawerTitle>
                  {availableSlots.length > 0 &&
                  formatInTimeZone(
                    availableSlots[0].start,
                    activeTimezone,
                    "yyyy-MM-dd",
                  ) !==
                    formatInTimeZone(
                      availableSlots[availableSlots.length - 1].start,
                      activeTimezone,
                      "yyyy-MM-dd",
                    ) ? (
                    <span className="flex items-center gap-1">
                      <span className="font-semibold">
                        {new Intl.DateTimeFormat("en-US", {
                          weekday: "short",
                          day: "numeric",
                          month:
                            formatInTimeZone(
                              availableSlots[0].start,
                              activeTimezone,
                              "yyyy-MM",
                            ) !==
                            formatInTimeZone(
                              availableSlots[availableSlots.length - 1].start,
                              activeTimezone,
                              "yyyy-MM",
                            )
                              ? "short"
                              : undefined,
                          timeZone: activeTimezone,
                        }).format(new Date(availableSlots[0].start))}
                      </span>
                      <span className="text-muted-foreground px-1">-</span>
                      <span className="font-semibold">
                        {new Intl.DateTimeFormat("en-US", {
                          weekday: "short",
                          day: "numeric",
                          month:
                            formatInTimeZone(
                              availableSlots[0].start,
                              activeTimezone,
                              "yyyy-MM",
                            ) !==
                            formatInTimeZone(
                              availableSlots[availableSlots.length - 1].start,
                              activeTimezone,
                              "yyyy-MM",
                            )
                              ? "short"
                              : undefined,
                          timeZone: activeTimezone,
                        }).format(
                          new Date(
                            availableSlots[availableSlots.length - 1].start,
                          ),
                        )}
                      </span>
                    </span>
                  ) : (
                    new Intl.DateTimeFormat("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: activeTimezone,
                    }).format(
                      availableSlots.length > 0
                        ? new Date(availableSlots[0].start)
                        : selectedDate,
                    )
                  )}
                </DrawerTitle>
                <TwentyFourHourToggle
                  value={use24Hour}
                  onChange={setUse24Hour}
                />
              </div>
            ) : (
              <DrawerTitle>{dict.slot_picker.select_time}</DrawerTitle>
            )}
          </DrawerHeader>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4">
            <TimeSlots
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onSelectSlot={(slot) => {
                setSelectedSlot(slot);
              }}
              onConfirm={() => {
                handleConfirm();
                setDrawerOpen(false);
              }}
              availableTimes={availableSlots}
              bookedTimes={[]}
              showDateLabel={false}
              showTimeFormatToggle={false}
              isLoading={isLoadingSlots}
              timezone={activeTimezone}
              use24Hour={use24Hour}
              onUse24HourChange={setUse24Hour}
              inDrawer
              confirmLabel={confirmLabel}
              dict={dict.slot_picker}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
