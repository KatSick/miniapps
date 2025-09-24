import { expect, test } from "@playwright/test";

test.describe("Blog FE App", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the homepage successfully", async ({ page }) => {
    // Check that the page loads with the correct title
    await expect(page).toHaveTitle("Vite + React + TS");

    // Check that the main heading is visible
    await expect(page.getByRole("heading", { name: "Vite + React" })).toBeVisible();
  });

  test("should display Vite and React logos", async ({ page }) => {
    // Check that both logos are present and visible
    const viteLogo = page.getByAltText("Vite logo");
    const reactLogo = page.getByAltText("React logo");

    await expect(viteLogo).toBeVisible();
    await expect(reactLogo).toBeVisible();

    // Check that logos have correct src attributes
    // Vite logo is imported as a module and converted to data URI by bundler
    await expect(viteLogo).toHaveAttribute("src", /^data:image\/svg\+xml/);
    await expect(reactLogo).toHaveAttribute("src", "/src/assets/react.svg");
  });

  test("should have working external links", async ({ page }) => {
    // Test Vite logo link
    const viteLink = page.getByRole("link", { name: /vite logo/i });
    await expect(viteLink).toHaveAttribute("href", "https://vite.dev");
    await expect(viteLink).toHaveAttribute("target", "_blank");
    await expect(viteLink).toHaveAttribute("rel", "noopener");

    // Test React logo link
    const reactLink = page.getByRole("link", { name: /react logo/i });
    await expect(reactLink).toHaveAttribute("href", "https://react.dev");
    await expect(reactLink).toHaveAttribute("target", "_blank");
    await expect(reactLink).toHaveAttribute("rel", "noopener");
  });

  test("should display the counter button", async ({ page }) => {
    const counterButton = page.getByRole("button", { name: /count is \d+/ });
    await expect(counterButton).toBeVisible();
    await expect(counterButton).toHaveText("count is 0");
  });

  test("should display instructional text", async ({ page }) => {
    // Check for the HMR instruction text
    const instructionText = page.getByText("Edit src/App.tsx and save to test HMR");
    await expect(instructionText).toBeVisible();

    // Check for the read-the-docs text
    const docsText = page.getByText("Click on the Vite and React logos to learn more");
    await expect(docsText).toBeVisible();
  });
});
