import type { Post } from "@miniapps/blog-api-contracts";

import { Text } from "@miniapps/design-system";

import { PostCard } from "./post-card";

export const PostsContent: React.FC<{
  loading: boolean;
  posts: readonly Post[];
}> = ({ loading, posts }) => {
  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (posts.length === 0) {
    return <Text>No posts yet. Create one above!</Text>;
  }
  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
};
