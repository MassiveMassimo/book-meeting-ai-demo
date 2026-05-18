"use client";

import type { Dictionary } from "@/lib/copy";
import type { EventType } from "@/lib/types/api";

import { useState } from "react";

import { parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  CalendarPlus,
  Check,
  CheckCheck,
  Copy,
  Globe,
  MapPin,
  User,
  Video,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { formatPlatformName } from "@/lib/utils/platform";

export function SuccessContent({ dict }: { dict: Dictionary }) {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");
  const eventTypeId = searchParams.get("type");
  const eventTitle = searchParams.get("title");
  const name = searchParams.get("name");
  const timezoneParam = searchParams.get("timezone");
  const hostName = searchParams.get("hostName");
  const username = searchParams.get("username");
  const integration = searchParams.get("integration");
  const location = searchParams.get("location");
  const action = searchParams.get("action"); // "rescheduled" | "cancelled" | undefined
  const [copied, setCopied] = useState(false);

  // Get event type details from URL params or booking response
  const eventType: EventType | null = eventTypeId
    ? {
        id: eventTypeId,
        title:
          eventTitle ||
          eventTypeId
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        duration: 30, // Default duration
        description: "",
        color: "bg-blue-500",
        integration: integration || "in_person",
        location: location || "",
      }
    : null;

  if (!dateParam || !timeParam || !eventType) return null;

  const date = parseISO(dateParam);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  const displayPlatformName = formatPlatformName(
    eventType.integration,
    dict.platforms,
  );
  const meetingInfo = `📅 ${eventType.title}
👤 ${name || dict.booking_form.guest}
🕐 ${timeParam} - ${formattedDate}${
    timezoneParam ? `\n🌍 ${timezoneParam.replace(/_/g, " ")}` : ""
  }
📹 ${displayPlatformName}${
    eventType.integration === "in_person" && eventType.location
      ? `\n📍 ${eventType.location}`
      : ""
  }${
    hostName
      ? `\n\n${dict.success.scheduled_with.replace("{hostName}", hostName)}`
      : `\n\n${dict.success.scheduled_via}`
  }`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(meetingInfo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCancelled = action === "cancelled";
  const isRescheduled = action === "rescheduled";

  const title = isCancelled
    ? dict.success.title_cancelled
    : isRescheduled
      ? dict.success.title_rescheduled
      : dict.success.title;

  const subtitle = isCancelled
    ? dict.success.subtitle_cancelled
    : isRescheduled
      ? dict.success.subtitle_rescheduled
      : dict.success.subtitle;

  return (
    <>
      {/* Confetti - only show if not cancelled */}
      {!isCancelled && (
        <div className="confetti-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="confetti" />
          ))}
        </div>
      )}

      <div className="flex w-full grow overflow-visible xl:h-full xl:min-h-0 xl:overflow-y-auto">
        <div className="mx-auto w-full max-w-screen-sm rounded-2xl p-8 text-center md:p-12">
          {/* Animated success icon */}
          <div className="success-icon-animate mb-6 flex justify-center">
            <div
              className={`rounded-full p-4 shadow-sm ${
                isCancelled ? "bg-destructive/10" : "bg-accent"
              }`}
            >
              {isCancelled ? (
                <XCircle className="text-destructive size-10" strokeWidth={3} />
              ) : (
                <Check className="text-primary size-10" strokeWidth={3} />
              )}
            </div>
          </div>

          <h1 className="text-foreground animate-in fade-in slide-in-from-bottom-4 fill-mode-both mb-2 text-2xl font-bold delay-150 duration-1000">
            {title}
          </h1>
          <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-4 fill-mode-both mb-8 text-sm delay-300 duration-1000">
            {subtitle}
          </p>

          {/* Meeting Details List */}
          <div className="border-border animate-in fade-in slide-in-from-bottom-4 fill-mode-both mb-8 border-t border-b py-6 delay-500 duration-1000">
            <h3
              className={`text-foreground mb-4 text-base font-bold ${
                isCancelled ? "line-through decoration-inherit" : ""
              }`}
            >
              {eventType.title}
            </h3>

            <div
              className={`space-y-3 text-sm ${
                isCancelled ? "line-through decoration-inherit" : ""
              }`}
            >
              {!isCancelled && !isRescheduled && (
                <div className="text-muted-foreground flex items-center justify-center">
                  <User className="text-muted-foreground mr-2.5 size-4 shrink-0" />
                  <span>{name || dict.booking_form.guest}</span>
                </div>
              )}

              <div className="text-muted-foreground flex items-center justify-center">
                <CalendarIcon className="text-muted-foreground mr-2.5 size-4 shrink-0" />
                <span>
                  {timeParam} · {formattedDate}
                </span>
              </div>

              {timezoneParam && (
                <div className="text-muted-foreground flex items-center justify-center">
                  <Globe className="text-muted-foreground mr-2.5 size-4 shrink-0" />
                  <span>{timezoneParam.replace(/_/g, " ")}</span>
                </div>
              )}

              <div className="text-muted-foreground flex items-center justify-center">
                <Video className="text-muted-foreground mr-2.5 size-4 shrink-0" />
                <span>{displayPlatformName}</span>
              </div>

              {eventType.location && (
                <div className="text-muted-foreground flex items-center justify-center">
                  <MapPin className="text-muted-foreground mr-2.5 size-4 shrink-0" />
                  <span>{eventType.location}</span>
                </div>
              )}
            </div>
          </div>

          {!isCancelled && (
            <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both space-y-3 delay-700 duration-1000">
              <Button
                onClick={copyToClipboard}
                variant={copied ? "secondary" : "outline"}
                className="w-full gap-2 rounded-xl font-semibold shadow-sm"
              >
                {copied ? (
                  <>
                    <CheckCheck className="size-4" />
                    {dict.success.copied}
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    {dict.success.copy}
                  </>
                )}
              </Button>
              {username && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full gap-2 rounded-xl font-semibold shadow-sm"
                >
                  <Link href={`/${username}`}>
                    <CalendarPlus className="size-4" />
                    Book another meeting
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
