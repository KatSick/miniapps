import { ATTR_DEPLOYMENT_ENVIRONMENT_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { describe, expect, it } from "vitest";

import { createOtlpConfig } from "@/config";

const TEST_ENDPOINT = "http://localhost:4318";

describe(createOtlpConfig, () => {
  it("returns spanProcessor, metricReader, logRecordProcessor, and resource", () => {
    const config = createOtlpConfig({
      endpoint: TEST_ENDPOINT,
      serviceName: "test-service",
      serviceVersion: "1.0.0",
    });

    expect(config).toHaveProperty("spanProcessor");
    expect(config).toHaveProperty("metricReader");
    expect(config).toHaveProperty("logRecordProcessor");
    expect(config).toHaveProperty("resource");
    expect(config.resource.serviceName).toBe("test-service");
    expect(config.resource.serviceVersion).toBe("1.0.0");
    expect(config.resource[ATTR_DEPLOYMENT_ENVIRONMENT_NAME]).toBe("local");
  });

  it("populates resource with provided service name and version", () => {
    const config = createOtlpConfig({
      endpoint: TEST_ENDPOINT,
      serviceName: "my-app",
      serviceVersion: "2.0.0",
    });

    expect(config.resource.serviceName).toBe("my-app");
    expect(config.resource.serviceVersion).toBe("2.0.0");
  });

  it("uses custom endpoint when specified", () => {
    const config = createOtlpConfig({
      endpoint: "http://collector.example.com:4318",
      serviceName: "test",
      serviceVersion: "1.0.0",
    });

    expect(config.resource.serviceName).toBe("test");
  });
});
