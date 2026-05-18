"use client";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { BookingDetails, Profile } from "@/lib/types/api";

import { FormEvent, useState } from "react";

import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  Clock,
  Globe,
  MapPin,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cancelBooking } from "@/lib/api-client";
import { formatDuration } from "@/lib/utils";
import { formatPlatformName } from "@/lib/utils/platform";

interface CancelFormProps {
  bookingId: string;
  booking: BookingDetails;
  profile: Profile;
  lang?: string;
  dict: Dictionary;
}

export function CancelForm({
  bookingId,
  booking,
  profile,
  lang = "en",
  dict,
}: CancelFormProps) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const guestTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const startDate = parseISO(booking.start_time);
  const formattedDate = new Intl.DateTimeFormat(lang, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: guestTimezone,
  }).format(startDate);
  const formattedTime = formatInTimeZone(startDate, guestTimezone, "h:mm a");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setError(dict.cancel.reason_required);
      return;
    }

    setIsSubmitting(true);

    const cancelPromise = (async () => {
      const result = await cancelBooking({
        bookingId,
        reason: trimmedReason,
      });

      if (!result.success) {
        throw new Error(result.message || dict.cancel.toast_error);
      }

      return result;
    })();

    toast.promise(cancelPromise, {
      loading: dict.cancel.toast_loading,
      success: () => {
        const dateStr = formatInTimeZone(
          startDate,
          guestTimezone,
          "yyyy-MM-dd",
        );

        const params = new URLSearchParams({
          date: dateStr,
          time: formattedTime,
          type: booking.schedule_appointment.slug,
          title: booking.schedule_appointment.name,
          timezone: guestTimezone,
          hostName: profile.name,
          integration: booking.schedule_appointment.integration,
          action: "cancelled",
        });

        if (booking.schedule_appointment.location) {
          params.set("location", booking.schedule_appointment.location);
        }

        setTimeout(() => {
          const successUrl = lang ? `/${lang}/success` : `/success`;
          router.push(`${successUrl}?${params.toString()}`);
        }, 1500);
        return dict.cancel.toast_success;
      },
      error: (err) => err.message || dict.cancel.toast_error,
    });

    try {
      await cancelPromise;
    } catch {
      // Error handled by toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col p-3 pr-1 md:overflow-visible xl:h-full xl:min-h-0 xl:flex-row xl:overflow-hidden">
      <div className="bg-background dark:bg-secondary relative z-10 flex shrink-0 flex-col rounded-xl p-4 shadow-xl shadow-slate-300/30 md:p-6 xl:w-1/4 dark:shadow-none">
        <div className="mb-3 flex items-center gap-3 xl:mb-0 xl:block">
          <div className="bg-destructive/10 flex size-10 items-center justify-center rounded-full">
            <AlertTriangle className="text-destructive size-5" />
          </div>
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
            {booking.schedule_appointment.name}
          </h1>

          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 xl:flex-col xl:gap-3">
            <div className="text-muted-foreground flex items-center text-sm">
              <Clock className="text-muted-foreground mr-2 size-4" />
              <span>
                {formatDuration(
                  booking.schedule_appointment.duration_minutes,
                  dict.booking_form,
                )}
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
              <span>
                {formatPlatformName(
                  booking.schedule_appointment.integration,
                  dict.platforms,
                )}
              </span>
            </div>
            {booking.schedule_appointment.location && (
              <div className="text-muted-foreground flex items-center text-sm">
                <MapPin className="text-muted-foreground mr-2 size-4" />
                <span>{booking.schedule_appointment.location}</span>
              </div>
            )}
            <div className="text-muted-foreground flex items-center text-sm">
              <Globe className="text-muted-foreground mr-2 size-4" />
              <span>{guestTimezone.replace(/_/g, " ")}</span>
            </div>
          </div>

          <p className="text-muted-foreground hidden text-sm leading-relaxed xl:block">
            {booking.schedule_appointment.description}
          </p>
        </div>
      </div>

      <div className="flex grow overflow-visible rounded-b-3xl xl:min-h-0 xl:w-3/4 xl:min-w-0 xl:overflow-y-auto xl:rounded-r-3xl xl:rounded-bl-none">
        <div className="p-5 md:p-8 xl:p-12">
          <form onSubmit={onSubmit} className="w-full space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reason">{dict.cancel.reason_label} *</Label>
              <Textarea
                id="reason"
                placeholder={dict.cancel.reason_placeholder}
                className="min-h-[150px] resize-none"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                aria-invalid={!!error}
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting}
                className="w-full rounded-full px-8 py-4 font-bold shadow-lg hover:shadow-xl active:scale-95 sm:w-auto"
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
                    ? dict.cancel.submitting_button
                    : dict.cancel.submit_button}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
