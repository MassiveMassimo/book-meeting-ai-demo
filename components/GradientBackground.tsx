"use client";

import { useSyncExternalStore } from "react";

import { useTheme } from "next-themes";

import { BackgroundImage } from "./BackgroundImage";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function GradientBackground() {
  const { resolvedTheme } = useTheme();
  const mounted = useIsClient();

  const gradientClass =
    mounted && resolvedTheme === "dark"
      ? "bg-linear-to-b from-[#010203] to-[#171F30]"
      : "bg-linear-to-b from-[#3D91E7] to-[#80BFF4]";

  return (
    <div
      className={`fixed inset-0 bottom-0 -z-10 transition-colors duration-300 ${gradientClass}`}
    >
      <BackgroundImage />
    </div>
  );
}
