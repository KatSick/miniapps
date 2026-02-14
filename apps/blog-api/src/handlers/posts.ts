import { HttpApiBuilder } from "@effect/platform";
import { BlogApi, NotFound, Post } from "@miniapps/blog-api-contracts";
import { Effect, Ref } from "effect";

export const PostsGroupLive = HttpApiBuilder.group(BlogApi, "posts", (handlers) =>
  Effect.gen(function* () {
    const store = yield* Ref.make(new Map<string, typeof Post.Type>());

    return handlers
      .handle("listPosts", () => Ref.get(store).pipe(Effect.map((map) => [...map.values()])))
      .handle("getPost", ({ path: { id } }) =>
        Ref.get(store).pipe(
          Effect.flatMap((map) => {
            const post = map.get(id);
            return post
              ? Effect.succeed(post)
              : Effect.fail(new NotFound({ message: `Post ${id} not found` }));
          }),
        ),
      )
      .handle("createPost", ({ payload }) =>
        Effect.gen(function* () {
          const id = crypto.randomUUID();
          const now = new Date().toISOString();
          const post = new Post({
            content: payload.content,
            createdAt: now,
            id,
            title: payload.title,
          });
          yield* Ref.update(store, (map) => new Map([...map, [id, post]]));
          return post;
        }),
      );
  }),
);
