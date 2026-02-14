import { HttpApiClient } from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { BlogApi, NotFound } from "@miniapps/blog-api-contracts";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";

import { BlogApiLive } from "@/server";

describe("posts handler", () => {
  it("returns empty list initially", async () => {
    const result = await Effect.gen(function* () {
      const client = yield* HttpApiClient.make(BlogApi);
      return yield* client.posts.listPosts();
    }).pipe(
      Effect.provide(BlogApiLive),
      Effect.provide(NodeHttpServer.layerTest),
      Effect.runPromise,
    );

    expect(result).toEqual([]);
  });

  it("creates and retrieves a post", async () => {
    await Effect.gen(function* () {
      const client = yield* HttpApiClient.make(BlogApi);

      const created = yield* client.posts.createPost({
        payload: { content: "World", title: "Hello" },
      });
      expect(created.title).toBe("Hello");
      expect(created.content).toBe("World");
      expect(created.id).toBeDefined();

      const fetched = yield* client.posts.getPost({ path: { id: created.id } });
      expect(fetched.id).toBe(created.id);

      const all = yield* client.posts.listPosts();
      expect(all).toHaveLength(1);
    }).pipe(
      Effect.provide(BlogApiLive),
      Effect.provide(NodeHttpServer.layerTest),
      Effect.runPromise,
    );
  });

  it("returns NotFound for missing post", async () => {
    const result = await Effect.gen(function* () {
      const client = yield* HttpApiClient.make(BlogApi);
      return yield* client.posts.getPost({ path: { id: "nonexistent" } }).pipe(Effect.flip);
    }).pipe(
      Effect.provide(BlogApiLive),
      Effect.provide(NodeHttpServer.layerTest),
      Effect.runPromise,
    );

    expect(result).toBeInstanceOf(NotFound);
  });
});
