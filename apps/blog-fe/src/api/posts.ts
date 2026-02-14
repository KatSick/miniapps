import { Effect } from "effect";

import { blogApiClient } from "./client";

const getPosts = Effect.fn("getPosts")(function* getPosts() {
  const client = yield* blogApiClient;

  return yield* client.posts.listPosts();
});

const submitPost = Effect.fn("submitPost")(function* submitPost(title: string, content: string) {
  const client = yield* blogApiClient;

  return yield* client.posts.createPost({ payload: { content, title } });
});

export { getPosts, submitPost };
