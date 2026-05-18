import type { Dictionary } from "@/lib/copy";

import { useState } from "react";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameDay,
  startOfMonth,
  startOfToday,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  unavailableDays?: number[]; // Array of day indices (0-6) that are unavailable
  unavailableDates?: Date[]; // Array of specific dates that are unavailable
  fullyBookedDates?: Date[]; // Array of specific dates that are fully booked
  onMonthChange?: (month: Date) => void; // Callback when month changes
  dict: Dictionary["calendar"];
}

export function Calendar({
  selectedDate,
  onSelectDate,
  unavailableDays = [],
  unavailableDates = [],
  fullyBookedDates = [],
  onMonthChange,
  dict,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfToday());
  const today = startOfToday();

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const firstDayOfMonth = getDay(startOfMonth(currentMonth)); // 0 = Sunday

  const formattedMonthYear = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

  return (
    <div className="mx-auto w-full max-w-[380px] select-none">
      {/* Header with safer flex layout instead of absolute positioning */}
      <div className="mb-6 flex items-center justify-between px-2">
        <Button
          onClick={() => handleMonthChange(subMonths(currentMonth, 1))}
          disabled={isBefore(subMonths(currentMonth, 1), startOfMonth(today))}
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full"
          title={dict.prev_month}
        >
          <ChevronLeft className="text-muted-foreground size-5" />
          <span className="sr-only">{dict.prev_month}</span>
        </Button>

        <h2 className="text-foreground mx-2 truncate text-center text-base font-bold capitalize">
          {formattedMonthYear}
        </h2>

        <Button
          onClick={() => handleMonthChange(addMonths(currentMonth, 1))}
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full"
          title={dict.next_month}
        >
          <ChevronRight className="text-muted-foreground size-5" />
          <span className="sr-only">{dict.next_month}</span>
        </Button>
      </div>

      <div className="text-muted-foreground mb-4 grid grid-cols-7 text-center text-[10px] font-bold tracking-widest uppercase sm:text-[11px]">
        {dict.days.map((day) => (
          <div key={day} className="flex h-8 items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const isPast = isBefore(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const dayOfWeek = getDay(day);
          const isUnavailable =
            unavailableDays.includes(dayOfWeek) ||
            unavailableDates.some((d) => isSameDay(d, day));
          const isFullyBooked = fullyBookedDates.some((date) =>
            isSameDay(date, day),
          );
          const isDisabled = isPast || isUnavailable || isFullyBooked;

          const buttonProps = {
            onClick: () => !isDisabled && onSelectDate(day),
            disabled: isDisabled,
            variant: "ghost" as const,
            className: cn(
              "group relative flex aspect-square size-full items-center justify-center rounded-md text-center text-sm font-medium transition",
              isDisabled &&
                "text-muted-foreground cursor-not-allowed bg-transparent",
              !isDisabled &&
                !isSelected &&
                "hover:text-brand bg-secondary border hover:scale-105 active:scale-95",
              isSelected &&
                "text-primary-foreground border border-blue-600 bg-blue-500 shadow-md inset-shadow-2xs inset-shadow-white/30 hover:scale-105 hover:border-blue-700 hover:bg-blue-600 hover:text-white",
              isSelected &&
                isToday &&
                "after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-white after:content-[''] sm:after:bottom-1.5",
              !isSelected &&
                isToday &&
                "text-primary font-bold after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-blue-500 after:content-[''] sm:after:bottom-1.5",
            ),
          };

          const button = (
            <Button {...buttonProps}>
              <span
                className={cn(isDisabled && isFullyBooked && "line-through")}
              >
                {format(day, "d")}
              </span>
            </Button>
          );

          // Wrap fully booked dates with tooltip
          // Use a wrapper div for disabled buttons so tooltip can receive hover events
          // The wrapper needs pointer-events to work with disabled buttons
          if (isUnavailable && !isPast) {
            return (
              <Tooltip key={day.toISOString()}>
                <TooltipTrigger asChild>
                  <div className="flex aspect-square cursor-not-allowed items-center justify-center">
                    {button}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="pointer-events-none">
                  <p>{dict.unavailable}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          if (isFullyBooked && !isPast) {
            return (
              <Tooltip key={day.toISOString()}>
                <TooltipTrigger asChild>
                  <div className="flex aspect-square cursor-not-allowed items-center justify-center">
                    {button}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="pointer-events-none">
                  <p>{dict.fully_booked}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Button key={day.toISOString()} {...buttonProps} size="icon-xl">
              <span
                className={cn(isDisabled && isFullyBooked && "line-through")}
              >
                {format(day, "d")}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
