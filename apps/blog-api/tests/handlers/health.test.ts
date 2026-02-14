import { HttpApiClient } from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { BlogApi } from "@miniapps/blog-api-contracts";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";

import { BlogApiLive } from "@/server";

describe("health handler", () => {
  it("returns ok status", async () => {
    const result = await Effect.gen(function* () {
      const client = yield* HttpApiClient.make(BlogApi);
      return yield* client.health.healthCheck();
    }).pipe(
      Effect.provide(BlogApiLive),
      Effect.provide(NodeHttpServer.layerTest),
      Effect.runPromise,
    );

    expect(result).toEqual({ status: "ok" });
  });
});
