import type { Post } from "@miniapps/blog-api-contracts";

import { Heading } from "@miniapps/design-system";

import { PostsContent } from "./posts-content";

export const PostsList: React.FC<{
  loading: boolean;
  posts: readonly Post[];
}> = ({ loading, posts }) => (
  <div className="flex flex-col gap-4">
    <Heading level={2}>Posts</Heading>
    <PostsContent loading={loading} posts={posts} />
  </div>
);
