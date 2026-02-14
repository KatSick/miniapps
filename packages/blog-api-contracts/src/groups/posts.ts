import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "@effect/platform";
import { Schema } from "effect";

import { NotFound } from "@/schemas/common";
import { CreatePost, Post } from "@/schemas/post";

const listPosts = HttpApiEndpoint.get("listPosts", "/posts").addSuccess(Schema.Array(Post));

const getPost = HttpApiEndpoint.get("getPost")`/posts/${HttpApiSchema.param("id", Schema.String)}`
  .addSuccess(Post)
  .addError(NotFound, { status: 404 });

const createPost = HttpApiEndpoint.post("createPost", "/posts")
  .setPayload(CreatePost)
  .addSuccess(Post);

export class PostsGroup extends HttpApiGroup.make("posts")
  .add(listPosts)
  .add(getPost)
  .add(createPost) {}
