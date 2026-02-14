import { createWebSdkLayer } from "@miniapps/telemetry/browser";
import { ManagedRuntime } from "effect";

import { name, version } from "@/package.json";

export const customRuntime = ManagedRuntime.make(
  createWebSdkLayer({ serviceName: name, serviceVersion: version }),
);
