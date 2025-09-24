import { expect, test } from "@playwright/test";

test.describe("Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have proper page structure and landmarks", async ({ page }) => {
    // Check for main heading
    await expect(page.getByRole("heading", { name: "Vite + React" })).toBeVisible();

    // Check that the page has proper structure
    const mainContent = page.locator("main, [role='main'], body > div");
    await expect(mainContent).toBeVisible();
  });

  test("should have accessible button with proper role and text", async ({ page }) => {
    const counterButton = page.getByRole("button", { name: /count is \d+/ });

    // Check that button is accessible
    await expect(counterButton).toBeVisible();
    await expect(counterButton).toBeEnabled();

    // Check that button has proper accessible name
    await expect(counterButton).toHaveText("count is 0");
  });

  test("should have accessible links with proper attributes", async ({ page }) => {
    // Check Vite link accessibility
    const viteLink = page.getByRole("link", { name: /vite logo/i });
    await expect(viteLink).toBeVisible();
    await expect(viteLink).toHaveAttribute("href", "https://vite.dev");
    await expect(viteLink).toHaveAttribute("target", "_blank");
    await expect(viteLink).toHaveAttribute("rel", "noopener");

    // Check React link accessibility
    const reactLink = page.getByRole("link", { name: /react logo/i });
    await expect(reactLink).toBeVisible();
    await expect(reactLink).toHaveAttribute("href", "https://react.dev");
    await expect(reactLink).toHaveAttribute("target", "_blank");
    await expect(reactLink).toHaveAttribute("rel", "noopener");
  });

  test("should have proper alt text for images", async ({ page }) => {
    // Check Vite logo alt text
    const viteLogo = page.getByAltText("Vite logo");
    await expect(viteLogo).toBeVisible();

    // Check React logo alt text
    const reactLogo = page.getByAltText("React logo");
    await expect(reactLogo).toBeVisible();
  });

  test("should be keyboard navigable", async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press("Tab");

    // First focusable element should be the Vite link
    const viteLink = page.getByRole("link", { name: /vite logo/i });
    await expect(viteLink).toBeFocused();

    // Tab to next element (React link)
    await page.keyboard.press("Tab");
    const reactLink = page.getByRole("link", { name: /react logo/i });
    await expect(reactLink).toBeFocused();

    // Tab to counter button
    await page.keyboard.press("Tab");
    const counterButton = page.getByRole("button", { name: /count is \d+/ });
    await expect(counterButton).toBeFocused();
  });

  test("should support keyboard interactions on button", async ({ page }) => {
    const counterButton = page.getByRole("button", { name: /count is \d+/ });

    // Focus the button
    await counterButton.focus();
    await expect(counterButton).toBeFocused();

    // Test Enter key
    await page.keyboard.press("Enter");
    await expect(counterButton).toHaveText("count is 1");

    // Test Space key
    await page.keyboard.press("Space");
    await expect(counterButton).toHaveText("count is 2");
  });

  test("should have proper color contrast", async ({ page }) => {
    // This test would typically use a tool like axe-core
    // For now, we'll check that text is visible and readable
    const heading = page.getByRole("heading", { name: "Vite + React" });
    await expect(heading).toBeVisible();

    const button = page.getByRole("button", { name: /count is \d+/ });
    await expect(button).toBeVisible();

    const instructionText = page.getByText("Edit src/App.tsx and save to test HMR");
    await expect(instructionText).toBeVisible();
  });

  test("should work with screen reader navigation", async ({ page }) => {
    // Test that all interactive elements are discoverable
    const interactiveElements = [
      page.getByRole("link", { name: /vite logo/i }),
      page.getByRole("link", { name: /react logo/i }),
      page.getByRole("button", { name: /count is \d+/ }),
    ];

    for (const element of interactiveElements) {
      await expect(element).toBeVisible();
    }
  });

  test("should maintain focus management", async ({ page }) => {
    const counterButton = page.getByRole("button", { name: /count is \d+/ });

    // Focus the button
    await counterButton.focus();
    await expect(counterButton).toBeFocused();

    // Click the button
    await counterButton.click();

    // Focus should remain on the button
    await expect(counterButton).toBeFocused();
    await expect(counterButton).toHaveText("count is 1");
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    // Check that there's a main heading
    const mainHeading = page.getByRole("heading", { name: "Vite + React" });
    await expect(mainHeading).toBeVisible();

    // Check that it's an h1 (or appropriate heading level)
    const headingLevel = await mainHeading.evaluate((el) => el.tagName.toLowerCase());
    expect(headingLevel).toBe("h1");
  });

  test("should work with reduced motion preferences", async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });

    // The app should still function normally
    const counterButton = page.getByRole("button", { name: /count is \d+/ });
    await expect(counterButton).toBeVisible();
    await counterButton.click();
    await expect(counterButton).toHaveText("count is 1");
  });
});
