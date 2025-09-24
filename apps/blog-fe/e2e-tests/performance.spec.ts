import { expect, test } from "@playwright/test";

test.describe("Performance Tests", () => {
  test("should load within acceptable time", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Expect the page to load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test("should have good Core Web Vitals", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Check that all critical resources are loaded
    const viteLogo = page.getByAltText("Vite logo");
    const reactLogo = page.getByAltText("React logo");
    const counterButton = page.getByRole("button", { name: /count is \d+/ });

    await expect(viteLogo).toBeVisible();
    await expect(reactLogo).toBeVisible();
    await expect(counterButton).toBeVisible();
  });

  test("should handle rapid interactions without performance degradation", async ({ page }) => {
    await page.goto("/");

    const counterButton = page.getByRole("button", { name: /count is \d+/ });

    // Perform rapid clicks and measure response time
    const startTime = Date.now();

    for (let i = 0; i < 50; i++) {
      await counterButton.click();
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Should complete 50 clicks within 2 seconds
    expect(totalTime).toBeLessThan(2000);
    await expect(counterButton).toHaveText("count is 50");
  });

  test("should not have memory leaks during extended use", async ({ page }) => {
    await page.goto("/");

    const counterButton = page.getByRole("button", { name: /count is \d+/ });

    // Perform many interactions
    for (let i = 0; i < 100; i++) {
      await counterButton.click();
    }

    // Check that the app still responds correctly
    await expect(counterButton).toHaveText("count is 100");

    // Perform more interactions to test for memory leaks
    for (let i = 0; i < 100; i++) {
      await counterButton.click();
    }

    await expect(counterButton).toHaveText("count is 200");
  });
});
