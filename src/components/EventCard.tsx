"use client";

import type { Dictionary } from "@/lib/copy";
import type { ClockIconHandle } from "@/components/ui/clock";
import type { EventType } from "@/lib/types/api";

import { useRef } from "react";

import { ChevronRight } from "lucide-react";
import { Link, type LinkProps } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { ClockIcon } from "@/components/ui/clock";
import { cn, formatDuration } from "@/lib/utils";

interface EventCardProps {
  event: EventType;
  username?: string;
  hasMoreThanThree?: boolean;
  isInLastRow?: boolean;
  dict: Dictionary;
  delay?: number;
}

export function EventCard({
  event,
  username,
  hasMoreThanThree = false,
  isInLastRow = false,
  dict,
  delay = 0,
}: EventCardProps) {
  const clockRef = useRef<ClockIconHandle>(null);

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "hover:bg-muted group border-border/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-both relative flex h-auto flex-col items-start justify-start rounded-none border-r p-4 px-5! duration-1000 last:border-r md:h-full md:w-1/3 md:p-8",
        hasMoreThanThree && !isInLastRow && "md:border-b",
        hasMoreThanThree && "md:h-[240px]",
        delay > 0 && `delay-[${delay}ms]`,
      )}
      onMouseEnter={() => clockRef.current?.startAnimation()}
      onMouseLeave={() => clockRef.current?.stopAnimation()}
    >
      {/* TODO: typed link — when username is absent /${event.id} has no typed route; username ?? "" is a stopgap. Params/to resolve after Phase B route registration. */}
      <Link
        {...({
          to: "/$username/$eventType",
          params: { username: username ?? "", eventType: event.id },
        } as unknown as LinkProps)}
        className="relative flex h-full w-full flex-col justify-between"
      >
        <div
          className={cn(
            "mb-2.5 size-2.5 rounded-full md:mb-6 md:size-3",
            event.color,
          )}
        />

        <h2 className="text-foreground group-hover:text-brand mb-1.5 line-clamp-2 w-full text-base font-bold transition-colors md:mb-2 md:text-lg">
          {event.title}
        </h2>

        <div className="text-muted-foreground mb-3 flex items-center text-xs font-medium md:mb-4 md:text-sm">
          <ClockIcon
            ref={clockRef}
            size={14}
            className="mr-1.5 shrink-0 md:mr-2"
          />
          <span>{formatDuration(event.duration, dict.booking_form)}</span>
        </div>

        <div className="text-brand hidden grow translate-y-0 transform items-end text-xs font-semibold opacity-100 transition duration-300 group-hover:opacity-100 md:flex md:translate-y-2 md:text-sm md:opacity-0 md:group-hover:translate-y-0">
          <span>{dict.user_page.book_now}</span>
          <ChevronRight className="ml-1 size-3.5 md:size-4" />
        </div>

        <ChevronRight className="text-brand absolute top-1/2 right-4 size-4 -translate-y-1/2 opacity-100 transition duration-300 md:hidden" />
      </Link>
    </Button>
  );
}

export function EventCardSkeleton() {
  return (
    <div
      role="presentation"
      className="border-border/50 relative flex h-auto flex-col items-start justify-start rounded-none border-r p-4 opacity-70 last:border-r md:h-full md:w-1/3 md:p-8"
    >
      <div className="bg-muted mb-2.5 size-2.5 rounded-full md:mb-6 md:size-3" />

      <div className="bg-muted/70 mb-1.5 h-5 w-3/4 rounded md:mb-2 md:h-6" />

      <div className="mb-3 flex items-center gap-2 md:mb-4">
        <div className="bg-muted/60 size-4 rounded-full" />
        <div className="bg-muted/60 h-3 w-16 rounded" />
      </div>

      <div className="text-brand bg-muted/50 hidden h-4 w-24 rounded md:mt-auto md:flex" />

      <div className="bg-muted/40 absolute top-1/2 right-4 size-4 -translate-y-1/2 rounded-full md:hidden" />
    </div>
  );
}
