import type { Post } from "@miniapps/blog-api-contracts";

import { Heading, Text } from "@miniapps/design-system";
import { Effect } from "effect";
import { useCallback, useEffect, useState } from "react";

import { blogApiClient } from "./api/client";
import { CreatePostForm } from "./create-post-form";
import { PostsList } from "./posts-list";

export const App: React.FC = () => {
  const [posts, setPosts] = useState<readonly (typeof Post.Type)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const client = await Effect.runPromise(blogApiClient);
      const result = await Effect.runPromise(client.posts.listPosts());
      setPosts(result);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const onPostCreated = useCallback(() => {
    void fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 p-8">
      <Heading level={1}>Blog</Heading>
      <CreatePostForm onPostCreated={onPostCreated} />
      {error.length > 0 ? <Text className="text-red-500">{error}</Text> : false}
      <PostsList loading={loading} posts={posts} />
    </div>
  );
};
