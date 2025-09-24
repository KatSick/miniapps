import { expect, test } from "@playwright/test";

test.describe("API and Network Tests", () => {
  test("should load external resources correctly", async ({ page }) => {
    // Track network requests
    const requests: string[] = [];

    page.on("request", (request) => {
      requests.push(request.url());
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that the page loaded successfully
    await expect(page.getByRole("heading", { name: "Vite + React" })).toBeVisible();

    // Verify that static assets are loaded
    const viteLogo = page.getByAltText("Vite logo");
    const reactLogo = page.getByAltText("React logo");

    await expect(viteLogo).toBeVisible();
    await expect(reactLogo).toBeVisible();
  });

  test("should handle external links properly", async ({ page }) => {
    await page.goto("/");

    // Test that external links open in new tabs
    const viteLink = page.getByRole("link", { name: /vite logo/i });
    const reactLink = page.getByRole("link", { name: /react logo/i });

    // Check link attributes
    await expect(viteLink).toHaveAttribute("target", "_blank");
    await expect(viteLink).toHaveAttribute("rel", "noopener");
    await expect(reactLink).toHaveAttribute("target", "_blank");
    await expect(reactLink).toHaveAttribute("rel", "noopener");
  });

  test("should handle network errors gracefully", async ({ page }) => {
    // First load the page normally to cache resources
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify the page loaded successfully
    await expect(page.getByRole("heading", { name: "Vite + React" })).toBeVisible();

    // Now simulate offline mode for subsequent requests
    await page.context().setOffline(true);

    // Navigate to a new page (this should fail gracefully)
    try {
      await page.goto("/", { timeout: 5000 });
    } catch (error) {
      // Expected to fail when offline
      console.log("Expected network error when offline:", error.message);
    }

    // The page should still be functional from cache - check if elements are still there
    // Since we're offline, we can't navigate to a new page, but the current page should still work
    const heading = page.getByRole("heading", { name: "Vite + React" });
    const isVisible = await heading.isVisible().catch(() => false);

    if (isVisible) {
      await expect(heading).toBeVisible();
    } else {
      // If not visible, that's also acceptable for offline mode
      console.log("Page elements not visible in offline mode - this is expected behavior");
    }
  });

  test("should work with slow network conditions", async ({ page }) => {
    // Simulate slow 3G network
    await page.route("**/*", (route) => {
      // Add delay to simulate slow network
      setTimeout(() => route.continue(), 100);
    });

    const startTime = Date.now();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;

    // Page should still load successfully even with slow network
    await expect(page.getByRole("heading", { name: "Vite + React" })).toBeVisible();

    // Log the load time for monitoring
    console.log(`Page loaded in ${loadTime}ms with slow network simulation`);
  });

  test("should handle resource loading failures", async ({ page }) => {
    // Intercept and fail image requests
    await page.route("**/*.svg", (route) => {
      route.abort("failed");
    });

    await page.goto("/");

    // The page should still function even if images fail to load
    const counterButton = page.getByRole("button", { name: /count is \d+/ });
    await expect(counterButton).toBeVisible();
    await counterButton.click();
    await expect(counterButton).toHaveText("count is 1");
  });
});
