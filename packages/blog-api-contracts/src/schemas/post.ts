import { Schema } from "effect";

export class Post extends Schema.Class<Post>("Post")({
  content: Schema.String,
  createdAt: Schema.String,
  id: Schema.String,
  title: Schema.String,
}) {}

export class CreatePost extends Schema.Class<CreatePost>("CreatePost")({
  content: Schema.String,
  title: Schema.String,
}) {}
