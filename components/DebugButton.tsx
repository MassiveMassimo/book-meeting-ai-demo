"use client";

import * as React from "react";

import { Bug } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function DebugButton() {
  const [open, setOpen] = React.useState(false);
  const [noTimeSlots, setNoTimeSlots] = React.useState(false);
  const [eventTypesCount, setEventTypesCount] = React.useState([3]);
  const router = useRouter();

  React.useEffect(() => {
    // Read cookies on mount
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    setNoTimeSlots(getCookie("debug_no_time_slots") === "true");
    const eventTypesCountCookie = getCookie("debug_event_types_count");
    if (eventTypesCountCookie) {
      const count = parseInt(eventTypesCountCookie, 10);
      if (!isNaN(count) && count >= 0 && count <= 3) {
        setEventTypesCount([count]);
      }
    }
  }, []);

  const handleNoTimeSlotsChange = (checked: boolean) => {
    setNoTimeSlots(checked);
    const secure = window.location.protocol === "https:" ? "; secure" : "";
    document.cookie = `debug_no_time_slots=${checked}; path=/; samesite=lax${secure}`;
    router.refresh();
  };

  const handleEventTypesCountChange = (value: number[]) => {
    const count = value[0];
    setEventTypesCount([count]);
    const secure = window.location.protocol === "https:" ? "; secure" : "";
    document.cookie = `debug_event_types_count=${count}; path=/; samesite=lax${secure}`;
    router.refresh();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "fixed top-16 right-4 z-50",
                "hidden md:flex",
                "text-white transition-colors hover:bg-white/20 hover:text-white",
              )}
              aria-label="Open debug panel"
            >
              <Bug className="size-5" />
              <span className="sr-only">Open debug panel</span>
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Debug</p>
        </TooltipContent>
      </Tooltip>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Debug Options</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 p-4">
          {/* Debug Toggles */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Debug Toggles</h3>
            <div className="flex items-center justify-between space-x-2">
              <label
                htmlFor="no-time-slots"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                No Available Time Slots
              </label>
              <Switch
                id="no-time-slots"
                checked={noTimeSlots}
                onCheckedChange={handleNoTimeSlotsChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="event-types-count"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Available Event Types
                </label>
                <span className="text-muted-foreground text-sm">
                  {eventTypesCount[0]}
                </span>
              </div>
              <Slider
                id="event-types-count"
                min={0}
                max={3}
                step={1}
                value={eventTypesCount}
                onValueChange={handleEventTypesCountChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
