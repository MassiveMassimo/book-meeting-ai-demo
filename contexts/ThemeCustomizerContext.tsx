"use client";

import * as React from "react";

// Tailwind color palette
export const TAILWIND_COLORS_500 = {
  slate: "#64748b",
  gray: "#6b7280",
  zinc: "#71717a",
  neutral: "#737373",
  stone: "#78716c",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
} as const;

export const TAILWIND_COLORS_900 = {
  slate: "#0f172a",
  gray: "#111827",
  zinc: "#18181b",
  neutral: "#171717",
  stone: "#1c1917",
  red: "#7f1d1d",
  orange: "#7c2d12",
  amber: "#78350f",
  yellow: "#713f12",
  lime: "#365314",
  green: "#14532d",
  emerald: "#064e3b",
  teal: "#134e4a",
  cyan: "#164e63",
  sky: "#0c4a6e",
  blue: "#1e3a8a",
  indigo: "#312e81",
  violet: "#4c1d95",
  purple: "#581c87",
  fuchsia: "#701a75",
  pink: "#831843",
  rose: "#881337",
} as const;

export type TailwindColorName = keyof typeof TAILWIND_COLORS_500;

export const BACKGROUND_IMAGES = {
  hills: { name: "Hills", thumbnail: "/bg/hills-light.png" },
  doodle: { name: "Doodle", thumbnail: "/bg/doodle.svg" },
} as const;

export type BackgroundImageId = keyof typeof BACKGROUND_IMAGES;

// Defaults
const DEFAULTS = {
  lightColor: "sky" as TailwindColorName,
  darkColor: "slate" as TailwindColorName,
  backgroundImage: "hills" as BackgroundImageId,
};

interface ThemeCustomizerContextType {
  lightGradientColor: TailwindColorName;
  darkGradientColor: TailwindColorName;
  backgroundImage: BackgroundImageId;
  setLightGradientColor: (color: TailwindColorName) => void;
  setDarkGradientColor: (color: TailwindColorName) => void;
  setBackgroundImage: (image: BackgroundImageId) => void;
}

const ThemeCustomizerContext =
  React.createContext<ThemeCustomizerContextType | null>(null);

export function ThemeCustomizerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lightGradientColor, setLightGradientColorState] =
    React.useState<TailwindColorName>(DEFAULTS.lightColor);
  const [darkGradientColor, setDarkGradientColorState] =
    React.useState<TailwindColorName>(DEFAULTS.darkColor);
  const [backgroundImage, setBackgroundImageState] =
    React.useState<BackgroundImageId>(DEFAULTS.backgroundImage);

  // Load from localStorage on mount
  React.useEffect(() => {
    const light = localStorage.getItem("theme-gradient-light");
    const dark = localStorage.getItem("theme-gradient-dark");
    const bg = localStorage.getItem("theme-background-image");

    if (light && light in TAILWIND_COLORS_500)
      setLightGradientColorState(light as TailwindColorName);
    if (dark && dark in TAILWIND_COLORS_500)
      setDarkGradientColorState(dark as TailwindColorName);
    if (bg && bg in BACKGROUND_IMAGES)
      setBackgroundImageState(bg as BackgroundImageId);
  }, []);

  const setLightGradientColor = React.useCallback(
    (color: TailwindColorName) => {
      setLightGradientColorState(color);
      localStorage.setItem("theme-gradient-light", color);
    },
    [],
  );

  const setDarkGradientColor = React.useCallback((color: TailwindColorName) => {
    setDarkGradientColorState(color);
    localStorage.setItem("theme-gradient-dark", color);
  }, []);

  const setBackgroundImage = React.useCallback((image: BackgroundImageId) => {
    setBackgroundImageState(image);
    localStorage.setItem("theme-background-image", image);
  }, []);

  return (
    <ThemeCustomizerContext.Provider
      value={{
        lightGradientColor,
        darkGradientColor,
        backgroundImage,
        setLightGradientColor,
        setDarkGradientColor,
        setBackgroundImage,
      }}
    >
      {children}
    </ThemeCustomizerContext.Provider>
  );
}

export function useThemeCustomizer() {
  const context = React.useContext(ThemeCustomizerContext);
  if (!context) {
    throw new Error(
      "useThemeCustomizer must be used within a ThemeCustomizerProvider",
    );
  }
  return context;
}
