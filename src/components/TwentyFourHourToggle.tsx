"use client";

import { useState } from "react";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type TwentyFourHourToggleProps = {
  value?: boolean;
  onChange?: (next: boolean) => void;
  className?: string;
};

export default function TwentyFourHourToggle({
  value,
  onChange,
  className,
}: TwentyFourHourToggleProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(false);
  const is24Hour = value ?? uncontrolledValue;

  const setIs24Hour = (next: boolean) => {
    onChange?.(next);
    if (value === undefined) {
      setUncontrolledValue(next);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setIs24Hour(!is24Hour);
    }
  };

  return (
    <motion.div
      layout
      role="switch"
      aria-label="Time format"
      aria-checked={is24Hour}
      tabIndex={0}
      className={cn(
        "bg-secondary relative flex h-9 w-28 cursor-pointer items-center rounded-md p-1",
        is24Hour ? "justify-end" : "justify-start",
        className,
      )}
      onClick={() => setIs24Hour(!is24Hour)}
      onKeyDown={handleKeyDown}
      transition={{
        layout: {
          type: "spring",
          stiffness: 400,
          damping: 30,
        },
      }}
    >
      {/* Background text labels */}
      <div className="pointer-events-none absolute inset-0 flex h-full w-full items-center justify-around px-2">
        <span
          className={cn(
            "text-sm font-semibold transition-colors",
            !is24Hour ? "text-foreground" : "text-muted-foreground",
          )}
        >
          12h
        </span>
        <span
          className={cn(
            "text-sm font-semibold transition-colors",
            is24Hour ? "text-foreground" : "text-muted-foreground",
          )}
        >
          24h
        </span>
      </div>

      {/* Animated handle */}
      <motion.div
        layout
        className="bg-background relative z-10 flex h-full w-[calc(50%-4px)] items-center justify-center rounded shadow-xs select-none"
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        <span className="text-foreground text-sm font-semibold">
          {!is24Hour ? "12h" : "24h"}
        </span>
      </motion.div>
    </motion.div>
  );
}
