import type { Dictionary } from "@/lib/copy";
import type { BookingDetails, EventType, Profile } from "@/lib/types/api";

import { FormEvent, useState } from "react";

import { formatInTimeZone } from "date-fns-tz";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Video,
} from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { rescheduleBooking } from "@/lib/api-client";
import { formatPlatformName } from "@/lib/utils/platform";

interface RescheduleFormProps {
  bookingId: string;
  booking: BookingDetails;
  eventType: EventType;
  profile: Profile;
  meetingPlatform: string;
  selectedDate: Date;
  selectedSlot: string; // ISO string
  timezone: string;
  hostTimezone?: string;
  dict: Dictionary;
  onBack: () => void;
}

export function RescheduleForm({
  bookingId,
  booking,
  eventType,
  profile,
  meetingPlatform,
  selectedDate,
  selectedSlot,
  timezone,
  hostTimezone,
  dict,
  onBack,
}: RescheduleFormProps) {
  const router = useRouter();

  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: timezone,
  }).format(selectedDate);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reschedulePromise = (async () => {
      const scheduleTimezone = hostTimezone || timezone;
      const slotDate = new Date(selectedSlot);
      const formattedStartTime = formatInTimeZone(
        slotDate,
        scheduleTimezone,
        "yyyy-MM-dd'T'HH:mm:ssXXX",
      );

      const result = await rescheduleBooking({
        bookingId,
        newStartTime: formattedStartTime,
        timezone: scheduleTimezone,
        notes,
        reason,
      });

      if (!result.success) {
        throw new Error(result.message || dict.reschedule.toast_error);
      }

      return result;
    })();

    toast.promise(reschedulePromise, {
      loading: dict.reschedule.toast_loading,
      success: () => {
        const dateInTimezone = formatInTimeZone(
          selectedSlot,
          timezone,
          "yyyy-MM-dd",
        );
        const timeInTimezone = formatInTimeZone(
          selectedSlot,
          timezone,
          "HH:mm",
        );

        const params = new URLSearchParams({
          date: dateInTimezone,
          time: timeInTimezone,
          type: eventType.id,
          title: eventType.title,
          timezone: timezone,
          hostName: profile.name,
          username: booking.username,
          integration: meetingPlatform,
          action: "rescheduled",
        });

        if (eventType.location) {
          params.set("location", eventType.location);
        }

        setTimeout(() => {
          router.navigate({
            to: "/success" as any,
            search: Object.fromEntries(params.entries()) as any,
          });
        }, 1500);
        return dict.reschedule.toast_success;
      },
      error: (error) => error.message || dict.reschedule.toast_error,
    });

    try {
      await reschedulePromise;
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <>
      <h2 className="text-foreground mb-6 text-xl font-bold">
        {dict.reschedule.details_title}
      </h2>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div>
          <Label
            htmlFor="reason"
            className="text-foreground mb-2 block text-sm font-bold"
          >
            {dict.reschedule.reason_label}{" "}
            <span className="text-muted-foreground font-normal">
              {dict.booking_form.optional}
            </span>
          </Label>
          <Textarea
            id="reason"
            className="min-h-[80px] resize-none"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={dict.reschedule.reason_placeholder}
          />
        </div>

        <div>
          <Label
            htmlFor="notes"
            className="text-foreground mb-2 block text-sm font-bold"
          >
            {dict.reschedule.additional_notes_label}{" "}
            <span className="text-muted-foreground font-normal">
              {dict.booking_form.optional}
            </span>
          </Label>
          <Textarea
            id="notes"
            className="min-h-[120px] resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={dict.reschedule.notes_placeholder}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting}
            className="bg-brand w-auto rounded-full px-8 py-4 font-bold shadow-lg hover:shadow-xl active:scale-95"
            aria-busy={isSubmitting}
          >
            {isSubmitting && (
              <span
                className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden="true"
              />
            )}
            <span>
              {isSubmitting
                ? dict.reschedule.submitting_button
                : dict.reschedule.submit_button}
            </span>
          </Button>
        </div>
      </form>
    </>
  );

  const slotDate = new Date(selectedSlot);
  const displayTime = formatInTimeZone(
    slotDate,
    timezone,
    "h:mma",
  ).toLowerCase();

  return (
    <div className="flex flex-col p-3 pr-1 md:overflow-visible xl:h-full xl:min-h-0 xl:flex-row xl:overflow-hidden">
      <div className="bg-background dark:bg-secondary relative z-10 flex shrink-0 flex-col rounded-xl p-4 shadow-xl shadow-slate-300/30 md:p-6 xl:w-1/4 dark:shadow-none">
        <div className="mb-3 flex items-center gap-3 xl:mb-0 xl:block">
          <Button onClick={onBack} variant="secondary" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-2 xl:hidden">
            <span className="text-muted-foreground text-sm font-medium">
              {profile.name}
            </span>
          </div>
        </div>

        <div className="flex grow flex-col xl:mt-12">
          <div className="mb-2 hidden items-center gap-2 xl:flex">
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
                {dict.booking_form.duration.replace(
                  "{min}",
                  String(eventType.duration),
                )}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center text-sm">
              <CalendarIcon className="text-muted-foreground mr-2 size-4" />
              <span className="capitalize">
                {displayTime} - {formattedDate}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center text-sm">
              <Video className="text-muted-foreground mr-2 size-4" />
              <span>{formatPlatformName(meetingPlatform)}</span>
            </div>
            <div className="text-muted-foreground flex items-center text-sm">
              <Globe className="text-muted-foreground mr-2 size-4" />
              <span>{timezone.replace(/_/g, " ")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex grow overflow-visible rounded-b-3xl xl:min-h-0 xl:w-3/4 xl:min-w-0 xl:rounded-r-3xl xl:rounded-bl-none">
        <ScrollArea className="hidden h-full w-full xl:block">
          <div className="w-full grow p-5 md:p-8 xl:p-12">{formContent}</div>
        </ScrollArea>
        <div className="w-full grow p-5 md:p-8 xl:hidden">{formContent}</div>
      </div>
    </div>
  );
}
