"use client";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { EventType, Profile } from "@/lib/types/api";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { transformSlots, useAvailableSlots } from "@/hooks/use-available-slots";
import { createBooking } from "@/lib/api-client";
import { cn, formatDuration } from "@/lib/utils";
import { devError } from "@/lib/utils/dev-log";
import { formatPlatformName } from "@/lib/utils/platform";

interface BookingFormProps {
  username: string;
  eventType: EventType;
  profile: Profile;
  meetingPlatform: string;
  hostTimezone?: string;
  lang?: string;
  dict: Dictionary;
}

export function BookingForm({
  username,
  eventType,
  profile,
  meetingPlatform,
  hostTimezone,
  lang,
  dict,
}: BookingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startParam = searchParams.get("start");
  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");
  const timezoneParam = searchParams.get("timezone");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayTimezone =
    timezoneParam || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const scheduleTimezone = hostTimezone || displayTimezone;

  const selectedStartISO = useMemo(() => {
    if (startParam) {
      const d = new Date(startParam);
      return Number.isNaN(d.getTime()) ? null : d.toISOString();
    }

    if (dateParam && timeParam) {
      const d = fromZonedTime(`${dateParam}T${timeParam}:00`, displayTimezone);
      return Number.isNaN(d.getTime()) ? null : d.toISOString();
    }

    return null;
  }, [startParam, dateParam, timeParam, displayTimezone]);

  const selectedStart = selectedStartISO ? new Date(selectedStartISO) : null;
  const hostDateStr = selectedStart
    ? formatInTimeZone(selectedStart, scheduleTimezone, "yyyy-MM-dd")
    : "";

  const {
    slots,
    isLoading: isLoadingSlots,
    isValidating,
    mutate,
  } = useAvailableSlots(
    username,
    eventType.id,
    hostDateStr,
    hostDateStr,
    scheduleTimezone,
  );

  const isCheckingAvailability = isLoadingSlots || isValidating;
  const [slotAvailable, setSlotAvailable] = useState<boolean | null>(null);

  const REDIRECT_DELAY_MS = 2000;
  const SUCCESS_REDIRECT_DELAY_MS = 1000;

  const redirectToBookingInterface = useCallback(() => {
    const baseUrl = lang
      ? `/${lang}/${username}/${eventType.id}`
      : `/${username}/${eventType.id}`;

    setTimeout(() => {
      router.push(baseUrl);
    }, REDIRECT_DELAY_MS);
  }, [router, username, eventType.id, lang]);

  const checkSlotAvailability = useCallback(
    (slotsOverride?: typeof slots): boolean => {
      if (!selectedStartISO) {
        return false;
      }

      const slotsToCheck = slotsOverride || slots;
      const availableSlots = slotsToCheck.filter(
        (slot) => slot.available !== false,
      );

      if (availableSlots.length === 0) {
        return false;
      }

      const selectedTime = new Date(selectedStartISO).getTime();
      return availableSlots.some((slot) => {
        try {
          return new Date(slot.start).getTime() === selectedTime;
        } catch {
          return false;
        }
      });
    },
    [selectedStartISO, slots],
  );

  useEffect(() => {
    if (!selectedStartISO) {
      setSlotAvailable(false);
      return;
    }

    if (!isLoadingSlots) {
      const isAvailable = checkSlotAvailability();
      setSlotAvailable(isAvailable);

      if (!isAvailable && !isValidating) {
        toast.error(dict.booking_form.toast_slot_unavailable, {
          description: dict.booking_form.toast_redirecting,
        });
        redirectToBookingInterface();
      }
    }
  }, [
    selectedStartISO,
    checkSlotAvailability,
    redirectToBookingInterface,
    isLoadingSlots,
    isValidating,
    dict,
  ]);

  if (!selectedStart || !selectedStartISO) {
    return (
      <div className="text-destructive p-8 text-center">
        {dict.booking_form.missing_time}
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat(lang, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(selectedStart);
  const formattedTime = formatInTimeZone(
    selectedStart,
    displayTimezone,
    "HH:mm",
  );

  const isActionBusy = isSubmitting || isCheckingAvailability;
  const actionLabel = isCheckingAvailability
    ? dict.booking_form.checking
    : isSubmitting
      ? dict.booking_form.scheduling
      : dict.booking_form.schedule_event;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isCheckingAvailability) {
      return;
    }
    setIsSubmitting(true);

    const revalidateSlots = async (): Promise<ReturnType<
      typeof transformSlots
    > | null> => {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const rawData = await mutate();
          if (rawData) return transformSlots(rawData, scheduleTimezone);
        } catch (error) {
          devError("BookingForm", "Failed to revalidate slots", {
            error,
            attempt,
          });
        }
        if (attempt < 2) await new Promise((r) => setTimeout(r, 400));
      }
      return null;
    };

    const freshSlots = await revalidateSlots();

    if (!freshSlots) {
      setIsSubmitting(false);
      toast.error(dict.booking_form.toast_confirm_fail);
      return;
    }

    const isAvailable = checkSlotAvailability(freshSlots);

    if (!isAvailable) {
      setIsSubmitting(false);
      toast.error(dict.booking_form.toast_no_longer_available);
      redirectToBookingInterface();
      return;
    }

    const bookingPromise = (async (): Promise<{ id: string }> => {
      const startTime = formatInTimeZone(
        selectedStart,
        scheduleTimezone,
        "yyyy-MM-dd'T'HH:mm:ssXXX",
      );

      const result = await createBooking({
        username,
        eventTypeId: eventType.id,
        name,
        email,
        phone,
        notes,
        startTime: startTime,
        guestTimezone: scheduleTimezone,
      });

      if (!result.success) {
        if (result.isConflict) {
          redirectToBookingInterface();
        }
        throw new Error(result.message || dict.booking_form.toast_fail);
      }

      setTimeout(() => {
        const params = new URLSearchParams({
          date: formatInTimeZone(selectedStart, displayTimezone, "yyyy-MM-dd"),
          time: formatInTimeZone(selectedStart, displayTimezone, "HH:mm"),
          type: eventType.id,
          title: eventType.title,
          name: name,
          email: email,
          phone: phone || "",
          timezone: displayTimezone,
          bookingId: result.booking.id,
          hostName: profile.name,
          username: username,
          integration: eventType.integration || meetingPlatform || "in_person",
        });
        if (eventType.location) {
          params.set("location", eventType.location);
        }

        const successUrl = lang ? `/${lang}/success` : `/success`;
        router.push(`${successUrl}?${params.toString()}`);
      }, SUCCESS_REDIRECT_DELAY_MS);

      return result.booking;
    })();

    toast.promise<{ id: string }>(bookingPromise, {
      loading: dict.booking_form.scheduling,
      success: () => dict.booking_form.toast_success,
      error: (error) => error.message || dict.booking_form.toast_fail,
    });

    try {
      await bookingPromise;
    } catch {
      // Error handled by toast.promise
    } finally {
      setIsSubmitting(false);
    }
  };

  if (slotAvailable === false) {
    const backUrl = lang
      ? `/${lang}/${username}/${eventType.id}`
      : `/${username}/${eventType.id}`;

    return (
      <div className="flex grow flex-col items-center justify-center p-8 text-center">
        <div className="text-destructive mb-4 text-2xl">⚠️</div>
        <h2 className="text-foreground mb-2 text-xl font-bold">
          {dict.booking_form.slot_not_available}
        </h2>
        <p className="text-muted-foreground mb-4">
          {dict.booking_form.slot_not_available_desc}
        </p>
        <Button asChild variant="secondary">
          <Link href={backUrl}>{dict.booking_form.back}</Link>
        </Button>
      </div>
    );
  }

  const formContent = (
    <>
      <h2 className="text-foreground mb-6 text-xl font-bold">
        {dict.booking_form.details}
      </h2>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div>
          <Label
            htmlFor="name"
            className="text-foreground mb-2 block text-sm font-bold"
          >
            {dict.booking_form.name} *
          </Label>
          <Input
            id="name"
            type="text"
            required
            className="h-11"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <Label
            htmlFor="email"
            className="text-foreground mb-2 block text-sm font-bold"
          >
            {dict.booking_form.email} *
          </Label>
          <Input
            id="email"
            type="email"
            required
            className="h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label
            htmlFor="phone"
            className="text-foreground mb-2 block text-sm font-bold"
          >
            {dict.booking_form.phone}{" "}
            <span className="text-muted-foreground font-normal">
              {dict.booking_form.optional}
            </span>
          </Label>
          <Input
            id="phone"
            type="tel"
            className="h-11"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <Label
            htmlFor="notes"
            className="text-foreground mb-2 block text-sm font-bold"
          >
            {dict.booking_form.notes_label}
          </Label>
          <Textarea
            id="notes"
            className="min-h-[120px] resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          variant="default"
          disabled={isActionBusy}
          className="bg-brand w-auto rounded-full px-8 py-4 font-bold shadow-lg hover:shadow-xl active:scale-95"
          aria-busy={isActionBusy}
        >
          {isActionBusy && (
            <span
              className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
          )}
          <span>{actionLabel}</span>
        </Button>
      </form>
    </>
  );

  const backUrl = lang
    ? `/${lang}/${username}/${eventType.id}`
    : `/${username}/${eventType.id}`;

  return (
    <div
      className={cn(
        "animate-in fade-in fill-mode-both flex flex-col p-3 pr-1 duration-1000 md:overflow-visible xl:h-full xl:min-h-0 xl:flex-row xl:overflow-hidden",
      )}
    >
      <div className="bg-background dark:bg-secondary animate-in fade-in slide-in-from-bottom-4 fill-mode-both relative z-10 flex shrink-0 flex-col rounded-xl p-4 shadow-xl shadow-slate-300/30 duration-1000 md:p-6 xl:w-1/4 dark:shadow-none">
        <div className="mb-3 flex items-center gap-3 xl:mb-0 xl:block">
          <Button asChild variant="secondary" size="icon">
            <Link href={backUrl}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
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

          <h1 className="text-foreground mb-3 text-lg leading-tight font-bold wrap-break-word md:text-xl xl:mb-4">
            {eventType.title}
          </h1>

          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 xl:flex-col xl:gap-3">
            <div className="text-muted-foreground flex items-center text-sm">
              <Clock className="text-muted-foreground mr-2 size-4" />
              <span>
                {formatDuration(eventType.duration, dict.booking_form)}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center text-sm">
              <CalendarIcon className="text-muted-foreground mr-2 size-4" />
              <span className="capitalize">
                {formattedTime} - {formattedDate}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center text-sm">
              <Video className="text-muted-foreground mr-2 size-4" />
              <span>{formatPlatformName(meetingPlatform, dict.platforms)}</span>
            </div>
            {timezoneParam && (
              <div className="text-muted-foreground flex items-center text-sm">
                <Globe className="text-muted-foreground mr-2 size-4" />
                <span>{timezoneParam.replace(/_/g, " ")}</span>
              </div>
            )}
          </div>

          <p className="text-muted-foreground hidden text-sm leading-relaxed xl:block">
            {eventType.description}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "animate-in fade-in slide-in-from-bottom-4 fill-mode-both flex grow overflow-visible rounded-b-3xl delay-150 duration-1000 xl:min-h-0 xl:w-3/4 xl:min-w-0 xl:rounded-r-3xl xl:rounded-bl-none",
        )}
      >
        <ScrollArea className="hidden h-full w-full xl:block">
          <div className="w-full grow p-5 md:p-8 xl:p-12">{formContent}</div>
        </ScrollArea>
        <div className="w-full grow p-5 md:p-8 xl:hidden">{formContent}</div>
      </div>
    </div>
  );
}
