import { HttpApiBuilder, HttpApiSwagger, HttpMiddleware, HttpServer } from "@effect/platform";
import { BlogApi } from "@miniapps/blog-api-contracts";
import { Layer } from "effect";

import { HealthGroupLive } from "@/handlers/health";
import { PostsGroupLive } from "@/handlers/posts";

const BlogApiImplementation = HttpApiBuilder.api(BlogApi).pipe(
  Layer.provide(HealthGroupLive),
  Layer.provide(PostsGroupLive),
);

export const BlogApiLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(BlogApiImplementation),
  HttpServer.withLogAddress,
);
