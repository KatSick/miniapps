import { describe, expect, it } from "vitest";

import { BlogApi } from "@/api";
import { HealthGroup } from "@/groups/health";
import { PostsGroup } from "@/groups/posts";

describe("Blog API definition", () => {
  it("exports the API definition", () => {
    expect(BlogApi).toBeDefined();
  });

  it("exports the health group", () => {
    expect(HealthGroup).toBeDefined();
  });

  it("exports the posts group", () => {
    expect(PostsGroup).toBeDefined();
  });
});
