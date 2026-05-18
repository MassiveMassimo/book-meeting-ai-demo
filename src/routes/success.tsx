import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { dict } from "@/lib/copy";

import { SuccessContent } from "./-components/success-content";

const successSearchSchema = z.object({
  bookingId: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  type: z.string().optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  timezone: z.string().optional(),
  hostName: z.string().optional(),
  username: z.string().optional(),
  integration: z.string().optional(),
  location: z.string().optional(),
  action: z.enum(["rescheduled", "cancelled"]).optional(),
});

export const Route = createFileRoute("/success")({
  validateSearch: successSearchSchema,
  component: SuccessPage,
});

function SuccessPage() {
  // Route.useSearch() is synchronous — no Suspense wrapper needed.
  return <SuccessContent dict={dict} />;
}
