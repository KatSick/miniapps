import { expect, test } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should match initial page snapshot", async ({ page }) => {
    // Wait for the page to fully load
    await page.waitForLoadState("networkidle");

    // Take a full page screenshot
    await expect(page).toHaveScreenshot("initial-page.png");
  });

  test("should match page snapshot after counter interactions", async ({ page }) => {
    const counterButton = page.getByRole("button", { name: /count is \d+/ });

    // Click the button a few times
    await counterButton.click();
    await counterButton.click();
    await counterButton.click();

    // Wait for any animations or state updates
    await page.waitForTimeout(100);

    // Take screenshot after interactions
    await expect(page).toHaveScreenshot("page-after-counter-clicks.png");
  });

  test("should match logo section snapshot", async ({ page }) => {
    // Focus on the logo section
    const logoSection = page.locator("div").filter({ hasText: "Vite + React" }).first();

    await expect(logoSection).toHaveScreenshot("logo-section.png");
  });

  test("should match counter section snapshot", async ({ page }) => {
    // Focus on the card section with the counter
    const cardSection = page.locator(".card");

    await expect(cardSection).toHaveScreenshot("counter-section.png");
  });

  test("should match mobile viewport snapshot", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for layout to adjust
    await page.waitForTimeout(100);

    await expect(page).toHaveScreenshot("mobile-view.png");
  });

  test("should match tablet viewport snapshot", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Wait for layout to adjust
    await page.waitForTimeout(100);

    await expect(page).toHaveScreenshot("tablet-view.png");
  });

  test("should match desktop viewport snapshot", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Wait for layout to adjust
    await page.waitForTimeout(100);

    await expect(page).toHaveScreenshot("desktop-view.png");
  });

  test("should match hover states", async ({ page }) => {
    // Wait for page to be stable
    await page.waitForLoadState("networkidle");

    // Test hover state on Vite logo
    await page.getByAltText("Vite logo").hover({ force: true });
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot("vite-logo-hover.png");

    // Test hover state on React logo
    await page.getByAltText("React logo").hover({ force: true });
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot("react-logo-hover.png");

    // Test hover state on counter button
    await page.getByRole("button", { name: /count is \d+/ }).hover({ force: true });
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot("counter-button-hover.png");
  });

  test("should match focus states", async ({ page }) => {
    // Focus on the counter button
    await page.getByRole("button", { name: /count is \d+/ }).focus();
    await page.waitForTimeout(100);
    await expect(page).toHaveScreenshot("counter-button-focused.png");
  });
});
