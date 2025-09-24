# Playwright E2E Tests for Blog FE

This directory contains comprehensive end-to-end tests for the blog-fe application using Playwright.

## Test Structure

### Test Files

- **`app.spec.ts`** - Basic app loading and functionality tests
- **`interactions.spec.ts`** - User interaction tests (clicks, keyboard navigation, viewport changes)
- **`visual.spec.ts`** - Visual regression tests and screenshot comparisons
- **`accessibility.spec.ts`** - Accessibility and screen reader tests
- **`performance.spec.ts`** - Performance and load time tests
- **`api.spec.ts`** - Network and API-related tests
- **`example-with-helpers.spec.ts`** - Example tests demonstrating helper usage
- **`helpers.ts`** - Reusable helper functions and utilities

### Test Categories

#### 1. Basic Functionality Tests (`app.spec.ts`)
- Page loading and title verification
- Logo display and attributes
- External link functionality
- Counter button display
- Instructional text visibility

#### 2. User Interaction Tests (`interactions.spec.ts`)
- Counter button clicking behavior
- Rapid clicking scenarios
- Keyboard interactions (Enter, Space)
- State maintenance during interactions
- Responsive design across viewport sizes

#### 3. Visual Regression Tests (`visual.spec.ts`)
- Full page screenshots
- Component-specific screenshots
- Different viewport size screenshots
- Hover and focus state screenshots
- Before/after interaction screenshots

#### 4. Accessibility Tests (`accessibility.spec.ts`)
- Proper heading hierarchy
- Keyboard navigation
- Screen reader compatibility
- Focus management
- Color contrast verification
- ARIA attributes and roles

#### 5. Performance Tests (`performance.spec.ts`)
- Page load time verification
- Core Web Vitals monitoring
- Rapid interaction performance
- Memory leak detection

#### 6. Network Tests (`api.spec.ts`)
- External resource loading
- Network error handling
- Slow network simulation
- Resource loading failure scenarios

## Running Tests

### Run All Tests
```bash
moon run blog-fe:test:e2e
```

### Run Specific Test Files
```bash
npx playwright test app.spec.ts
npx playwright test interactions.spec.ts
npx playwright test visual.spec.ts
```

### Run Tests in Headed Mode
```bash
npx playwright test --headed
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### Run Tests with Specific Browser
```bash
npx playwright test --project=chromium
```

## Test Configuration

The tests are configured in `playwright.config.ts` with the following settings:

- **Test Directory**: `e2e-tests`
- **Base URL**: `http://localhost:5173`
- **Web Server**: Automatically starts with `moon run blog-fe:dev`
- **Browsers**: Chromium (configurable for more browsers)
- **Parallel Execution**: Enabled for faster test runs
- **Retries**: 2 retries on CI, 0 locally
- **Reporter**: HTML reporter for detailed results

## Helper Functions

The `helpers.ts` file provides reusable utilities:

### AppHelpers Class
- `navigateToApp()` - Navigate and wait for app to be ready
- `getCounterButton()` - Get counter button element
- `clickCounter()` - Click counter and return new count
- `clickCounterMultiple(times)` - Click counter multiple times
- `getCounterValue()` - Get current counter value
- `verifyPageLoaded()` - Verify all main elements are visible
- `verifyExternalLinks()` - Verify external link attributes
- `setViewportSize(width, height)` - Set viewport and wait for layout
- `takeScreenshot(name)` - Take screenshot with consistent naming

### TestData Constants
- Viewport sizes for mobile, tablet, desktop
- Timeout values for different scenarios

## Best Practices

1. **Use Page Object Model**: The helper functions demonstrate a simple page object pattern
2. **Wait for Elements**: Always wait for elements to be visible before interacting
3. **Use Semantic Selectors**: Prefer role-based selectors over CSS selectors
4. **Test User Flows**: Focus on actual user interactions and workflows
5. **Handle Async Operations**: Use proper waiting strategies for dynamic content
6. **Clean Up**: Use `beforeEach` and `afterEach` hooks for test isolation
7. **Screenshot Testing**: Use visual regression tests for UI consistency
8. **Accessibility**: Include accessibility tests in your test suite

## Debugging Tests

### View Test Results
After running tests, open the HTML report:
```bash
npx playwright show-report
```

### Debug Individual Tests
```bash
npx playwright test --debug app.spec.ts
```

### Take Screenshots on Failure
Screenshots are automatically taken on test failures and saved in the `test-results` directory.

## Continuous Integration

The tests are configured to run in CI environments with:
- Automatic retries on failure
- Single worker to avoid resource conflicts
- Trace collection on first retry for debugging
- HTML report generation for test results

## Adding New Tests

1. Create a new `.spec.ts` file in the `e2e-tests` directory
2. Import necessary Playwright functions and helpers
3. Use the `AppHelpers` class for common operations
4. Follow the existing test structure and naming conventions
5. Add appropriate test descriptions and assertions
6. Run tests locally before committing
