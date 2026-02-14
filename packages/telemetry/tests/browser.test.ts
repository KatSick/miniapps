import { describe, expect, it } from "vitest";

import { createWebSdkLayer, initTracing } from "@/browser";

describe("browser entry point", () => {
  it("exports createWebSdkLayer", () => {
    expect(createWebSdkLayer).toBeTypeOf("function");
  });

  it("exports initTracing", () => {
    expect(initTracing).toBeTypeOf("function");
  });

  it("createWebSdkLayer returns an Effect Layer", () => {
    const layer = createWebSdkLayer({
      serviceName: "test",
      serviceVersion: "1.0.0",
    });

    expect(layer).toBeDefined();
  });
});
