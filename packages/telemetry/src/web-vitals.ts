// oxlint-disable no-magic-numbers
import type { Metric as WebVitalMetric } from "web-vitals";
import type { Layer } from "effect/Layer";

import { Effect, Fiber, Match, Metric, MetricBoundaries } from "effect";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

const lcpMetric = Metric.histogram("lcp", MetricBoundaries.fromIterable([0, 2500, 4000, 6000]));
const inpMetric = Metric.histogram("inp", MetricBoundaries.fromIterable([0, 200, 500, 1000]));
const ttfbMetric = Metric.histogram("ttfb", MetricBoundaries.fromIterable([0, 200, 500, 1000]));
const fcpMetric = Metric.histogram("fcp", MetricBoundaries.fromIterable([0, 1800, 3000, 5000]));

const clsMetric = Metric.gauge("cls");

const reportMetric = Effect.fn("reportMetric")(function* reportMetric(metric: WebVitalMetric) {
  yield* Match.value(metric.name).pipe(
    Match.when("LCP", () => lcpMetric(Effect.succeed(metric.value))),
    Match.when("INP", () => inpMetric(Effect.succeed(metric.value))),
    Match.when("TTFB", () => ttfbMetric(Effect.succeed(metric.value))),
    Match.when("FCP", () => fcpMetric(Effect.succeed(metric.value))),
    Match.when("CLS", () => clsMetric(Effect.succeed(metric.value))),
    Match.exhaustive,
  );
});

const createWebVitalEffect = (
  callback: (onReport: (metric: WebVitalMetric) => void) => void,
): Effect.Effect<void> =>
  Effect.async((resume) => {
    callback((value) => {
      resume(reportMetric(value));
    });
  });

const grabWebVitals = Effect.fn("grabWebVitals")(function* grabWebVitals() {
  yield* Effect.log("Grabbing web vitals");

  const metrics = [
    createWebVitalEffect(onCLS),
    createWebVitalEffect(onLCP),
    createWebVitalEffect(onINP),
    createWebVitalEffect(onTTFB),
    createWebVitalEffect(onFCP),
  ];

  const fiber = yield* Effect.forkAll(metrics);
  yield* Fiber.await(fiber);
  yield* Effect.log("Web vitals completed");
});

// oxlint-disable-next-line no-explicit-any
export const reportWebVitals = async (layer: Layer<any>): Promise<void> => {
  // oxlint-disable-next-line no-unsafe-argument
  await Effect.runPromise(grabWebVitals().pipe(Effect.provide(layer)));
};
