import { HttpApiBuilder } from "@effect/platform";
import { BlogApi } from "@miniapps/blog-api-contracts";
import { Effect } from "effect";

export const HealthGroupLive = HttpApiBuilder.group(BlogApi, "health", (handlers) =>
  handlers.handle("healthCheck", () => Effect.succeed({ status: "ok" as const })),
);
