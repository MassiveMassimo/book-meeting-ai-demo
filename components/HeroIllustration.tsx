"use client";

import type { Dictionary } from "@/lib/copy";

import { Clock, Video } from "lucide-react";

import { cn } from "@/lib/utils";

interface HeroIllustrationProps {
  dict: Dictionary;
}

export default function HeroIllustration({ dict }: HeroIllustrationProps) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const viewerTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const monthNames = dict.hero.months;

  // Generate calendar cells for current month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  const miniCalendarDays = dict.hero.mini_days;
  const miniCalendarCells: Array<{
    day: number;
    outside: boolean;
    selected: boolean;
    isAfterToday?: boolean;
  }> = [];

  const todayDate = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  // Add days from previous month
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = startDayOfWeek; i > 0; i--) {
    miniCalendarCells.push({
      day: prevMonthLastDay - i + 1,
      outside: true,
      selected: false,
      isAfterToday: false,
    });
  }

  // Add days from current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const isToday =
      day === todayDate &&
      currentMonth === todayMonth &&
      currentYear === todayYear;
    const isAfterToday =
      !isToday &&
      currentMonth === todayMonth &&
      currentYear === todayYear &&
      day > todayDate &&
      !isWeekend;

    miniCalendarCells.push({
      day,
      outside: false,
      selected: isToday && !isWeekend,
      isAfterToday,
    });
  }

  // Add days from next month to fill the grid (always full weeks; some months need 6 rows)
  const totalCells = miniCalendarCells.length > 35 ? 42 : 35;
  const remainingCells = totalCells - miniCalendarCells.length;
  for (let day = 1; day <= remainingCells; day++) {
    miniCalendarCells.push({
      day,
      outside: true,
      selected: false,
      isAfterToday: false,
    });
  }

  return (
    <div className="pointer-events-none pt-10 pl-10 select-none">
      <div className="aspect-video w-[105%] rounded-2xl shadow-[-25px_-25px_50px_-12px] shadow-slate-300/30 dark:shadow-none">
        <div className="from-background to-secondary flex h-full w-full rounded-2xl bg-linear-to-b mask-b-from-20%">
          {/* Left Details Sidebar */}
          <div className="bg-background animate-in fade-in slide-in-from-left-4 fill-mode-both m-2 flex basis-1/4 flex-col rounded-lg p-3 pt-5 shadow-xl shadow-slate-300/30 delay-1200 duration-1000 dark:shadow-none">
            <div className="flex items-center gap-1">
              <div className="size-3 rounded-full bg-linear-to-b from-blue-400 to-indigo-500 inset-shadow-2xs inset-shadow-white/30" />
              <span className="text-muted-foreground text-[10px] font-medium">
                {dict.hero.host_name}
              </span>
            </div>

            <div className="pt-2">
              <div className="text-foreground text-[11px] leading-tight font-bold">
                {dict.hero.intro_title}
              </div>
              <div className="text-muted-foreground mt-1 flex flex-col gap-1 text-[9px]">
                <div className="flex items-center gap-1">
                  <Clock className="size-2.5 shrink-0" />
                  <span>{dict.hero.intro_duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="size-2.5 shrink-0" />
                  <span>{dict.hero.intro_type}</span>
                </div>
              </div>

              <div className="text-muted-foreground mt-2 text-[9px] leading-snug">
                {dict.hero.intro_description}
              </div>
            </div>

            <div className="border-border/40 mt-auto border-t pt-2">
              <div className="text-muted-foreground text-[9px] leading-tight">
                {dict.hero.times_shown_in}
              </div>
              <div className="text-foreground/70 truncate text-[9px] font-medium">
                {viewerTimezone}
              </div>
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="animate-in fade-in zoom-in-95 fill-mode-both flex grow justify-center pt-5 delay-1300 duration-1000">
            <div aria-hidden="true" className="w-full max-w-[280px]">
              <div className="border-border/40 flex items-center justify-between border-b px-3 py-2">
                <div className="text-foreground/90 text-xs font-semibold tracking-wide">
                  {monthNames[currentMonth]}{" "}
                  <span className="text-muted-foreground font-medium">
                    {currentYear}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 px-3 pt-2">
                {miniCalendarDays.map((d, idx) => (
                  <div
                    key={`${d}-${idx}`}
                    className="text-muted-foreground flex items-center justify-center text-[10px] font-medium"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5 px-3 pt-2 pb-3">
                {miniCalendarCells.map((cell, idx) => (
                  <div
                    key={`${cell.outside ? "o" : "i"}-${cell.day}-${idx}`}
                    className={cn(
                      "relative flex aspect-square items-center justify-center rounded text-[9px] leading-none",
                      cell.outside
                        ? "text-muted-foreground/40"
                        : cell.selected
                          ? "text-primary-foreground border border-blue-600 bg-blue-500 shadow-md"
                          : cell.isAfterToday &&
                            "text-foreground/80 bg-secondary border",
                    )}
                  >
                    <span className="">{cell.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Slots Panel */}
          <div className="border-border/30 animate-in fade-in slide-in-from-right-4 fill-mode-both flex basis-3/10 flex-col border-l p-3 pt-7 delay-1400 duration-1000">
            <div className="text-foreground/90 mb-2 text-[10px] font-semibold">
              {dict.hero.available_times}
            </div>
            <div className="flex flex-col gap-0.5">
              {[
                { time: "9:00", period: dict.hero.am, selected: false },
                { time: "10:00", period: dict.hero.am, selected: false },
                { time: "11:00", period: dict.hero.am, selected: true },
                { time: "1:00", period: dict.hero.pm, selected: false },
                { time: "2:00", period: dict.hero.pm, selected: false },
                { time: "3:00", period: dict.hero.pm, selected: false },
              ].map((slot, idx) => (
                <div key={idx} className="flex w-full items-center gap-0.5">
                  <div
                    className={cn(
                      "flex h-5 grow items-center justify-center rounded text-[9px] font-medium transition",
                      slot.selected
                        ? "text-background bg-foreground"
                        : "bg-secondary text-foreground/80",
                    )}
                  >
                    {slot.time} {slot.period}
                  </div>
                  {slot.selected && (
                    <div className="flex h-5 items-center justify-center rounded-lg bg-blue-500 px-3 text-[9px] font-medium text-white shadow-md">
                      {dict.hero.book_button}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
