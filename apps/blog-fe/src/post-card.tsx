import type { Post } from "@miniapps/blog-api-contracts";

import { Heading, Text } from "@miniapps/design-system";

export const PostCard: React.FC<{ post: Post }> = ({ post }) => (
  <div className="rounded-lg bg-white p-6 shadow">
    <Heading level={3} className="mb-2">
      {post.title}
    </Heading>
    <Text className="mb-2">{post.content}</Text>
    <Text className="text-sm text-gray-500">{post.createdAt}</Text>
  </div>
);
