import { describe, expect, it } from "vitest";

import { createNodeSdkLayer } from "@/node";

describe("node entry point", () => {
  it("exports createNodeSdkLayer", () => {
    expect(createNodeSdkLayer).toBeTypeOf("function");
  });

  it("createNodeSdkLayer returns an Effect Layer", () => {
    const layer = createNodeSdkLayer({
      serviceName: "test",
      serviceVersion: "1.0.0",
    });

    expect(layer).toBeDefined();
  });
});
