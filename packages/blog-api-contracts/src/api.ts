import { HttpApi } from "@effect/platform";

import { HealthGroup } from "@/groups/health";
import { PostsGroup } from "@/groups/posts";

export class BlogApi extends HttpApi.make("BlogApi").add(HealthGroup).add(PostsGroup) {}
