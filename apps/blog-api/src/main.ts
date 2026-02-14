import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { createNodeSdkLayer } from "@miniapps/telemetry/node";
import { Layer } from "effect";
import { createServer } from "node:http";

import { name, version } from "@/package.json";
import { BlogApiLive } from "@/server";

// oxlint-disable-next-line node/no-process-env -- Entry point reads PORT from environment
const port = Number(process.env["PORT"] ?? 3001);

// oxlint-disable-next-line node/no-process-env -- Entry point reads OTEL_ENDPOINT from environment
const otelEndpoint = process.env["OTEL_ENDPOINT"] ?? "http://http-otel.localhost";

const TelemetryLive = createNodeSdkLayer({
  endpoint: otelEndpoint,
  serviceName: name,
  serviceVersion: version,
});

const ServerLive = BlogApiLive.pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port })),
  Layer.provide(TelemetryLive),
);

Layer.launch(ServerLive).pipe(NodeRuntime.runMain);
