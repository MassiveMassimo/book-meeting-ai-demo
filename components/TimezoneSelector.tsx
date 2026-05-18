"use client";

import type { Dictionary } from "@/lib/copy";

import * as React from "react";

import { Check, ChevronDown, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getTimezoneFlag } from "@/lib/timezone-flags";
import { cn } from "@/lib/utils";

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  keywords: string[];
  flag: string;
}

interface TimezoneSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  dict: Dictionary["timezone_selector"];
}

export function TimezoneSelector({
  value,
  onChange,
  dict,
}: TimezoneSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [localTimezone, setLocalTimezone] = React.useState("");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const selectedTimezone = value !== undefined ? value : localTimezone;

  const timezones = React.useMemo<TimezoneOption[]>(() => {
    const tzNames = Intl.supportedValuesOf("timeZone");
    const now = new Date();

    const formattedTzs = tzNames.map((tz) => {
      const offset =
        new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          timeZoneName: "longOffset",
        })
          .formatToParts(now)
          .find((part) => part.type === "timeZoneName")?.value || "";

      const gmtStr = offset === "GMT" ? "GMT+00:00" : offset;

      const label = `(${gmtStr}) ${tz.replace(/_/g, " ")}`;

      const keywordsSet = new Set<string>();
      const addKeyword = (raw: string) => {
        const normalized = raw.toLowerCase().trim();
        if (normalized) keywordsSet.add(normalized);
      };

      addKeyword(tz);
      const tzWithSpaces = tz.replace(/_/g, " ");
      addKeyword(tzWithSpaces);
      addKeyword(tzWithSpaces.replace(/\//g, " "));

      const tzParts = tz.split("/");
      const tzRegion = tzParts[0];
      const tzCity = tzParts[tzParts.length - 1] || tz;
      addKeyword(tzRegion);
      addKeyword(tzCity.replace(/_/g, " "));

      if (gmtStr) {
        addKeyword(gmtStr); // GMT+02:00
        addKeyword(gmtStr.replace(/^GMT/i, "UTC")); // UTC+02:00
        addKeyword(gmtStr.replace(/^GMT/i, "")); // +02:00
        addKeyword(gmtStr.replace(":", "")); // GMT+0200
        addKeyword(gmtStr.replace(/^GMT/i, "UTC").replace(":", "")); // UTC+0200
        addKeyword(gmtStr.replace(/^GMT/i, "").replace(":", "")); // +0200

        const offsetMatch = gmtStr.match(/^GMT([+-])(\d{2}):(\d{2})$/i);
        if (offsetMatch) {
          const sign = offsetMatch[1];
          const hh = offsetMatch[2];
          const mm = offsetMatch[3];
          const hhNoLeadingZero = String(parseInt(hh, 10));

          const shortOffset =
            mm === "00"
              ? `GMT${sign}${hhNoLeadingZero}`
              : `GMT${sign}${hhNoLeadingZero}:${mm}`;
          addKeyword(shortOffset);
          addKeyword(shortOffset.replace(/^GMT/i, "UTC"));
          addKeyword(shortOffset.replace(/^GMT/i, ""));

          addKeyword(
            mm === "00"
              ? `${sign}${hhNoLeadingZero}`
              : `${sign}${hhNoLeadingZero}:${mm}`,
          );
          addKeyword(
            mm === "00" ? `${hhNoLeadingZero}` : `${hhNoLeadingZero}:${mm}`,
          );
        }
      }

      return {
        value: tz,
        label: label,
        offset: gmtStr,
        keywords: Array.from(keywordsSet),
        flag: getTimezoneFlag(tz),
      };
    });

    formattedTzs.sort((a, b) => {
      if (a.offset === b.offset) return a.value.localeCompare(b.value);
      return a.offset.localeCompare(b.offset);
    });

    return formattedTzs;
  }, []);

  React.useEffect(() => {
    if (value === undefined) {
      const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setLocalTimezone(currentTz);
      if (onChange) onChange(currentTz);
    } else if (value === "" && onChange) {
      const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      onChange(currentTz);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedOption = timezones.find((tz) => tz.value === selectedTimezone);

  const handleSelect = (tzValue: string) => {
    if (onChange) {
      onChange(tzValue);
    } else {
      setLocalTimezone(tzValue);
    }
    setOpen(false);
  };

  const timezoneFilter = React.useCallback(
    (cmdkValue: string, searchQuery: string, keywords?: string[]) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return 1;

      const terms = q.split(/\s+/).filter(Boolean);
      if (terms.length === 0) return 1;

      const haystack = `${cmdkValue} ${(keywords ?? []).join(" ")}`
        .toLowerCase()
        .trim();

      return terms.every((term) => haystack.includes(term)) ? 1 : 0;
    },
    [],
  );

  const triggerButton = (
    <Button
      variant="ghost"
      className="text-muted-foreground group -ml-2 flex w-[calc(100%+1rem)] min-w-0 cursor-pointer items-center justify-start rounded-lg px-2 py-1.5 text-sm"
    >
      {selectedOption ? (
        <span className="mr-2 shrink-0 text-base">{selectedOption.flag}</span>
      ) : (
        <Globe className="text-muted-foreground group-hover:text-foreground mr-2 size-3.5 shrink-0" />
      )}
      <span className="min-w-0 grow truncate text-left text-xs">
        {selectedOption ? selectedOption.label : dict.trigger_placeholder}
      </span>
      <ChevronDown
        className={cn(
          "text-muted-foreground ml-2 size-3.5 shrink-0 transition-transform",
          open && "rotate-180",
        )}
      />
    </Button>
  );

  const commandContent = (
    <Command filter={timezoneFilter}>
      <CommandInput placeholder={dict.search_placeholder} />
      <CommandList>
        <CommandEmpty>{dict.no_results}</CommandEmpty>
        <CommandGroup>
          {timezones.map((tz) => (
            <CommandItem
              key={tz.value}
              value={tz.value}
              keywords={tz.keywords}
              onSelect={() => handleSelect(tz.value)}
              className="cursor-pointer py-3"
            >
              <Check
                className={cn(
                  "mr-2 size-4",
                  selectedTimezone === tz.value ? "opacity-100" : "opacity-0",
                )}
              />
              <span className="mr-2 text-base">{tz.flag}</span>
              {tz.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (isDesktop) {
    return (
      <div className="border-border relative mt-auto w-full min-w-0 border-t pt-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
          <PopoverContent className="w-[320px] p-0" align="start">
            {commandContent}
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="border-border relative mt-auto w-full min-w-0 border-t pt-3">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{dict.title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">{commandContent}</div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
