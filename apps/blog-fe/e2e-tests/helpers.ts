import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Helper functions for Playwright e2e tests
 */

export class AppHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to the app and wait for it to be ready
   */
  async navigateToApp() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Get the counter button element
   */
  getCounterButton() {
    return this.page.getByRole("button", { name: /count is \d+/ });
  }

  /**
   * Get the Vite logo element
   */
  getViteLogo() {
    return this.page.getByAltText("Vite logo");
  }

  /**
   * Get the React logo element
   */
  getReactLogo() {
    return this.page.getByAltText("React logo");
  }

  /**
   * Get the main heading
   */
  getMainHeading() {
    return this.page.getByRole("heading", { name: "Vite + React" });
  }

  /**
   * Click the counter button and return the new count
   */
  async clickCounter(): Promise<number> {
    const button = this.getCounterButton();
    const currentText = await button.textContent();
    const currentCount = parseInt(currentText?.match(/\d+/)?.[0] || "0");

    await button.click();
    return currentCount + 1;
  }

  /**
   * Click the counter button multiple times
   */
  async clickCounterMultiple(times: number): Promise<number> {
    for (let i = 0; i < times; i++) {
      await this.clickCounter();
    }
    return times;
  }

  /**
   * Get the current counter value
   */
  async getCounterValue(): Promise<number> {
    const button = this.getCounterButton();
    const text = await button.textContent();
    return parseInt(text?.match(/\d+/)?.[0] || "0");
  }

  /**
   * Verify the page has loaded correctly
   */
  async verifyPageLoaded() {
    await expect(this.getMainHeading()).toBeVisible();
    await expect(this.getViteLogo()).toBeVisible();
    await expect(this.getReactLogo()).toBeVisible();
    await expect(this.getCounterButton()).toBeVisible();
  }

  /**
   * Verify external links have correct attributes
   */
  async verifyExternalLinks() {
    const viteLink = this.page.getByRole("link", { name: /vite logo/i });
    const reactLink = this.page.getByRole("link", { name: /react logo/i });

    await expect(viteLink).toHaveAttribute("href", "https://vite.dev");
    await expect(viteLink).toHaveAttribute("target", "_blank");
    await expect(viteLink).toHaveAttribute("rel", "noopener");

    await expect(reactLink).toHaveAttribute("href", "https://react.dev");
    await expect(reactLink).toHaveAttribute("target", "_blank");
    await expect(reactLink).toHaveAttribute("rel", "noopener");
  }

  /**
   * Set viewport size and wait for layout to adjust
   */
  async setViewportSize(width: number, height: number) {
    await this.page.setViewportSize({ width, height });
    await this.page.waitForTimeout(100); // Allow layout to adjust
  }

  /**
   * Take a screenshot with a consistent name
   */
  async takeScreenshot(name: string) {
    await this.page.waitForLoadState("networkidle");
    await expect(this.page).toHaveScreenshot(name);
  }

  /**
   * Wait for animations to complete
   */
  async waitForAnimations() {
    await this.page.waitForTimeout(100);
  }
}

/**
 * Common test data and constants
 */
export const TestData = {
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
  },
  timeouts: {
    short: 1000,
    medium: 3000,
    long: 5000,
  },
} as const;

/**
 * Custom matchers for common assertions
 */
export const CustomMatchers = {
  /**
   * Check if an element has proper focus styling
   */
  async toBeFocusedWithStyle(element: import("@playwright/test").Locator) {
    const isFocused = await element.evaluate((el: Element) => el === document.activeElement);
    expect(isFocused).toBe(true);
  },

  /**
   * Check if counter has expected value
   */
  async toHaveCounterValue(button: import("@playwright/test").Locator, expectedValue: number) {
    await expect(button).toHaveText(`count is ${expectedValue}`);
  },
};
