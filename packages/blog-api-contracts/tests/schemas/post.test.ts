import { Schema } from "effect";
import { describe, expect, it } from "vitest";

import { CreatePost, Post } from "@/schemas/post";

describe("Post schema", () => {
  it("decodes a valid Post", () => {
    const input = {
      content: "Some content",
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "abc-123",
      title: "Hello World",
    };

    const result = Schema.decodeUnknownSync(Post)(input);
    expect(result.id).toBe("abc-123");
    expect(result.title).toBe("Hello World");
  });

  it("rejects a Post missing required fields", () => {
    const input = { id: "abc-123" };
    expect(() => Schema.decodeUnknownSync(Post)(input)).toThrow();
  });
});

describe("CreatePost schema", () => {
  it("decodes a valid CreatePost", () => {
    const input = { content: "World", title: "Hello" };
    const result = Schema.decodeUnknownSync(CreatePost)(input);
    expect(result.title).toBe("Hello");
    expect(result.content).toBe("World");
  });
});
