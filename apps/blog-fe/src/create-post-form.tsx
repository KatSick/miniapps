import { Button, Heading, Text } from "@miniapps/design-system";

import { useCreatePost } from "./use-create-post";

export const CreatePostForm: React.FC<{ onPostCreated: () => void }> = ({ onPostCreated }) => {
  const { content, error, isSubmitting, onContentChange, onSubmit, onTitleChange, title } =
    useCreatePost(onPostCreated);

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <Heading level={2} className="mb-4">
        New Post
      </Heading>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={onTitleChange}
          className="rounded border border-gray-300 px-3 py-2"
          disabled={isSubmitting}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={onContentChange}
          rows={4}
          className="rounded border border-gray-300 px-3 py-2"
          disabled={isSubmitting}
        />
        {error.length > 0 ? <Text className="text-red-500">{error}</Text> : false}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Post"}
        </Button>
      </form>
    </div>
  );
};
