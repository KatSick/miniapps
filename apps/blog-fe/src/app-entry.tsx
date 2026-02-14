import type { Post } from "@miniapps/blog-api-contracts";

import { Heading, Text } from "@miniapps/design-system";
import { useCallback, useEffect, useState } from "react";

import { getPosts } from "./api/posts";
import { CreatePostForm } from "./create-post-form";
import { PostsList } from "./posts-list";
import { customRuntime } from "./runtime";

export const App: React.FC = () => {
  const [posts, setPosts] = useState<readonly Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await customRuntime.runPromise(getPosts());
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
