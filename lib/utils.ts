import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(
  minutes: number,
  dict: {
    duration: string;
    duration_hours: string;
    duration_hours_minutes: string;
  },
) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h === 0) {
    return dict.duration.replace("{min}", String(m));
  }

  if (m === 0) {
    return dict.duration_hours.replace("{hr}", String(h));
  }

  return dict.duration_hours_minutes
    .replace("{hr}", String(h))
    .replace("{min}", String(m));
}
