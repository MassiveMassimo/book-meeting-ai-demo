import { createFileRoute } from "@tanstack/react-router";

import packageJson from "../../../../package.json";

export const Route = createFileRoute("/api/app/version")({
  server: {
    handlers: {
      GET: async () => Response.json({ version: packageJson.version }),
    },
  },
});
