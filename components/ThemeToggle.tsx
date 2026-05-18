"use client";

import * as React from "react";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const cycleTheme = () => {
    // Cycle through: light -> dark -> system -> light
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      // Handles "system" or undefined/null
      setTheme("light");
    }
  };

  const getIcon = () => {
    // Show icon based on current theme selection
    if (theme === "light") {
      return <Sun className="size-5" />;
    } else if (theme === "dark") {
      return <Moon className="size-5" />;
    } else {
      // Handles "system" or undefined/null
      return <Monitor className="size-5" />;
    }
  };

  const getTooltipText = () => {
    if (theme === "light") {
      return "Light mode";
    } else if (theme === "dark") {
      return "Dark mode";
    } else {
      return "System theme";
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={cycleTheme}
          className={cn(
            "fixed top-4 right-4 z-50",
            "hidden md:flex",
            "text-white transition-colors hover:bg-white/20 hover:text-white",
          )}
          aria-label="Toggle theme"
        >
          {getIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>{getTooltipText()}</p>
      </TooltipContent>
    </Tooltip>
  );
}
