import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { createServer } from "node:http";

import { BlogApiLive } from "@/server";

// oxlint-disable-next-line node/no-process-env -- Entry point reads PORT from environment
const port = Number(process.env["PORT"] ?? 3001);

const ServerLive = BlogApiLive.pipe(Layer.provide(NodeHttpServer.layer(createServer, { port })));

Layer.launch(ServerLive).pipe(NodeRuntime.runMain);
