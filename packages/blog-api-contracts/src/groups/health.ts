import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema } from "effect";

const HealthStatus = Schema.Struct({
  status: Schema.Literal("ok"),
});

const healthCheck = HttpApiEndpoint.get("healthCheck", "/health").addSuccess(HealthStatus);

export class HealthGroup extends HttpApiGroup.make("health").add(healthCheck) {}
