import { useCallback, useState } from "react";

import { submitPost } from "./api/posts";
import { customRuntime } from "./runtime";

interface UseCreatePostReturn {
  content: string;
  error: string;
  isSubmitting: boolean;
  onContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
}

export const useCreatePost = (onPostCreated: () => void): UseCreatePostReturn => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const resetForm = useCallback(() => {
    setTitle("");
    setContent("");
    onPostCreated();
  }, [onPostCreated]);

  const handleSubmit = useCallback(
    async (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (title.trim().length === 0 || content.trim().length === 0) {
        return;
      }
      setIsSubmitting(true);
      setError("");
      try {
        await customRuntime.runPromise(submitPost(title.trim(), content.trim()));
        resetForm();
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "Failed to create post");
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, content, resetForm],
  );

  const onSubmit = useCallback(
    (event: React.SyntheticEvent<HTMLFormElement>) => {
      void handleSubmit(event);
    },
    [handleSubmit],
  );

  const onTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }, []);

  const onContentChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  }, []);

  return { content, error, isSubmitting, onContentChange, onSubmit, onTitleChange, title };
};
