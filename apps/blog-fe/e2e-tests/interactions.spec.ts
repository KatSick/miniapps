import { expect, test } from "@playwright/test";

test.describe("User Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should increment counter when button is clicked", async ({ page }) => {
    const counterButton = page.getByRole("button", { name: /count is \d+/ });

    // Initial state
    await expect(counterButton).toHaveText("count is 0");

    // Click the button once
    await counterButton.click();
    await expect(counterButton).toHaveText("count is 1");

    // Click multiple times
    await counterButton.click();
    await counterButton.click();
    await counterButton.click();
    await expect(counterButton).toHaveText("count is 4");
  });

  test("should handle rapid clicking", async ({ page }) => {
    const counterButton = page.getByRole("button", { name: /count is \d+/ });

    // Click rapidly multiple times
    for (let i = 0; i < 10; i++) {
      await counterButton.click();
    }

    await expect(counterButton).toHaveText("count is 10");
  });

  test("should maintain counter state during page interactions", async ({ page }) => {
    const counterButton = page.getByRole("button", { name: /count is \d+/ });

    // Increment counter
    await counterButton.click();
    await counterButton.click();
    await expect(counterButton).toHaveText("count is 2");

    // Wait for page to be stable before hovering
    await page.waitForLoadState("networkidle");

    // Hover over other elements with more stable approach
    const viteLogo = page.getByAltText("Vite logo");
    const reactLogo = page.getByAltText("React logo");

    // Use force hover to avoid stability issues
    await viteLogo.hover({ force: true });
    await page.waitForTimeout(100);
    await reactLogo.hover({ force: true });
    await page.waitForTimeout(100);

    // Counter should still be at 2
    await expect(counterButton).toHaveText("count is 2");
  });

  test("should handle keyboard interactions", async ({ page }) => {
    const counterButton = page.getByRole("button", { name: /count is \d+/ });

    // Focus the button and press Enter
    await counterButton.focus();
    await page.keyboard.press("Enter");
    await expect(counterButton).toHaveText("count is 1");

    // Press Space
    await page.keyboard.press("Space");
    await expect(counterButton).toHaveText("count is 2");
  });

  test("should work with different viewport sizes", async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const counterButton = page.getByRole("button", { name: /count is \d+/ });
    await expect(counterButton).toBeVisible();
    await counterButton.click();
    await expect(counterButton).toHaveText("count is 1");

    // Test on tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(counterButton).toBeVisible();
    await counterButton.click();
    await expect(counterButton).toHaveText("count is 2");

    // Test on desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(counterButton).toBeVisible();
    await counterButton.click();
    await expect(counterButton).toHaveText("count is 3");
  });
});
