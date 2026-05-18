"use client";

import { useEffect } from "react";

import { useRouter, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";

function ToastListenerContent() {
  const { error } = useSearch({ strict: false }) as { error?: string };
  const router = useRouter();

  useEffect(() => {
    if (error === "event_not_found") {
      toast.error("Event type not found");
      // Remove the query param so the toast doesn't show again on refresh
      // TODO: typed link — search reducer types resolve after Phase B route registration
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (router.navigate as any)({
        search: (prev: Record<string, unknown>) => {
          const next = { ...prev };
          delete next["error"];
          return next;
        },
        replace: true,
      });
    }
  }, [error, router]);

  return null;
}

export function ToastListener() {
  return <ToastListenerContent />;
}
