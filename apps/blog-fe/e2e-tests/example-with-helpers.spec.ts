import { expect, test } from "@playwright/test";
import { AppHelpers, TestData } from "./helpers";

test.describe("Example Tests Using Helpers", () => {
  let app: AppHelpers;

  test.beforeEach(async ({ page }) => {
    app = new AppHelpers(page);
    await app.navigateToApp();
  });

  test("should work with helper functions", async () => {
    // Verify page loaded correctly using helper
    await app.verifyPageLoaded();

    // Verify external links using helper
    await app.verifyExternalLinks();

    // Test counter functionality using helpers
    const initialCount = await app.getCounterValue();
    expect(initialCount).toBe(0);

    // Click counter multiple times using helper
    const clickCount = 5;
    await app.clickCounterMultiple(clickCount);

    const finalCount = await app.getCounterValue();
    expect(finalCount).toBe(clickCount);
  });

  test("should work across different viewport sizes using helpers", async () => {
    // Test mobile viewport
    await app.setViewportSize(TestData.viewports.mobile.width, TestData.viewports.mobile.height);
    await app.verifyPageLoaded();

    // Test tablet viewport
    await app.setViewportSize(TestData.viewports.tablet.width, TestData.viewports.tablet.height);
    await app.verifyPageLoaded();

    // Test desktop viewport
    await app.setViewportSize(TestData.viewports.desktop.width, TestData.viewports.desktop.height);
    await app.verifyPageLoaded();
  });

  test("should handle rapid interactions using helpers", async () => {
    const rapidClickCount = 20;

    // Use helper to perform rapid clicks
    await app.clickCounterMultiple(rapidClickCount);

    // Verify final count
    const finalCount = await app.getCounterValue();
    expect(finalCount).toBe(rapidClickCount);
  });

  test("should work with keyboard navigation using helpers", async ({ page }) => {
    // Focus the counter button
    const counterButton = app.getCounterButton();
    await counterButton.focus();

    // Use keyboard to interact
    await page.keyboard.press("Enter");
    await expect(counterButton).toHaveText("count is 1");

    await page.keyboard.press("Space");
    await expect(counterButton).toHaveText("count is 2");
  });

  test("should take screenshots using helpers", async () => {
    // Take initial screenshot
    await app.takeScreenshot("initial-state-with-helpers.png");

    // Click counter and take another screenshot
    await app.clickCounter();
    await app.waitForAnimations();
    await app.takeScreenshot("after-click-with-helpers.png");
  });
});
