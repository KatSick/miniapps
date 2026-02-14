import { FetchHttpClient, HttpApiClient } from "@effect/platform";
import { BlogApi } from "@miniapps/blog-api-contracts";
import { Effect } from "effect";

const makeClient = HttpApiClient.make(BlogApi, { baseUrl: "/api" });

export const blogApiClient = makeClient.pipe(Effect.provide(FetchHttpClient.layer));
