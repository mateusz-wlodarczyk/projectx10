# E2E Testing Guide - BoatsStats Project

## Overview

This directory contains comprehensive End-to-End (E2E) tests for the BoatsStats application using Playwright. The tests cover authentication flows, navigation between pages, and user interactions across the entire application.

## Test Structure

### Test Files

- **`auth.spec.ts`** - Authentication flow tests including login, logout, and form validation
- **`navigation.spec.ts`** - Navigation tests covering all main pages and user flows

### Page Objects

The tests use the Page Object Model pattern for maintainable and reusable test code:

- **`BasePage.ts`** - Common functionality and utilities shared across all pages
- **`LoginPage.ts`** - Login form interactions and validations
- **`DashboardPage.ts`** - Dashboard page interactions
- **`BoatsPage.ts`** - Boats listing and search functionality
- **`AdminPage.ts`** - Admin panel interactions
- **`LandingPage.ts`** - Landing page interactions

## Test Coverage

### Authentication Flow Tests

✅ **Login Functionality**

- Successful login with valid credentials
- Error handling with invalid credentials
- Empty credentials validation
- Invalid email format validation
- Form disabling during login process

✅ **Navigation from Login**

- Navigate to register page
- Navigate to forgot password page
- Navigate back to home page

✅ **Test Login Functionality**

- Test login button from landing page
- Test login button from CTA section

✅ **Session Management**

- Session persistence after page refresh
- Logout and redirect to landing page

✅ **Form Validation**

- Required fields validation
- Email format validation
- Password field type validation

✅ **Accessibility**

- Proper form labels
- Button text validation
- Page title validation

### Navigation Flow Tests

✅ **Landing Page Navigation**

- Navigate to login page
- Navigate to register page
- Test login bypass functionality

✅ **Dashboard Navigation**

- Navigate to boats page
- Navigate to admin page
- Logout functionality

✅ **Boats Page Navigation**

- Display boats page correctly
- Navigate to boat details page
- Search boats functionality
- Navigate back to dashboard

✅ **Admin Page Navigation**

- Display admin page correctly
- Refresh users data
- Navigate back to dashboard

✅ **Cross-Page Navigation**

- Navigate between all main pages
- Session maintenance across navigations

✅ **Unauthorized Access**

- Redirect to login when accessing protected pages
- Protection for dashboard, boats, and admin pages

## Data Test IDs

The following `data-testid` attributes have been added to frontend components for reliable test targeting:

### Login Page

- `email-input` - Email input field
- `password-input` - Password input field
- `login-button` - Login submit button
- `error-message` - Error message display
- `register-link` - Link to register page
- `forgot-password-link` - Link to forgot password page

### Landing Page

- `get-started-button` - Get Started button
- `sign-in-button` - Sign In button
- `test-login-button` - Test login button
- `start-trial-button` - Start trial button
- `test-login-cta-button` - Test login CTA button

### Common Elements

- `loading-spinner` - Loading indicator
- `error-message` - Error message display
- `success-message` - Success message display

## Running Tests

### Prerequisites

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Install Playwright Browsers**

   ```bash
   npx playwright install
   ```

3. **Start the Application**

   ```bash
   # Start backend
   cd packages/backend && npm run dev

   # Start frontend (in another terminal)
   cd packages/frontend && npm run dev
   ```

### Running Tests

#### Run All E2E Tests

```bash
npm run test:e2e
```

#### Run Specific Test Files

```bash
# Authentication tests only
npx playwright test e2e/auth.spec.ts

# Navigation tests only
npx playwright test e2e/navigation.spec.ts
```

#### Run with Custom Options

```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run specific test
npx playwright test --grep "should login successfully"

# Run with HTML report
npx playwright test --reporter=html
```

#### Using the E2E Test Runner

```bash
# Run all E2E tests
node e2e-test-runner.js

# Run only authentication tests
node e2e-test-runner.js --auth-only

# Run only navigation tests
node e2e-test-runner.js --nav-only

# Run specific test file
node e2e-test-runner.js --test e2e/auth.spec.ts
```

## Test Configuration

### Playwright Configuration (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

## Best Practices

### Page Object Model

- Each page has its own class with locators and actions
- Common functionality is shared in `BasePage`
- Actions are grouped logically (navigation, form interactions, assertions)

### Test Data Management

- Tests use consistent test data
- Each test clears localStorage and cookies in `beforeEach`
- Test login functionality bypasses authentication for faster testing

### Assertions

- Tests use Playwright's built-in assertions
- Wait for elements to be visible before interacting
- Verify URL changes after navigation

### Error Handling

- Tests handle loading states and error conditions
- Proper timeouts for async operations
- Clear error messages for debugging

## Debugging Tests

### View Test Results

```bash
# Open HTML report
npx playwright show-report
```

### Debug Mode

```bash
# Run in debug mode
npx playwright test --debug

# Run specific test in debug mode
npx playwright test --debug --grep "should login successfully"
```

### Screenshots and Videos

- Screenshots are automatically taken on failure
- Videos can be enabled in `playwright.config.ts`
- Trace files are generated for debugging

## Continuous Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Common Issues

1. **Tests fail with timeout**

   - Check if the application is running on `http://localhost:3000`
   - Verify backend is accessible on `http://localhost:8080`

2. **Element not found errors**

   - Ensure `data-testid` attributes are present in components
   - Check if elements are visible before interaction

3. **Navigation failures**

   - Verify routes are properly configured
   - Check authentication state

4. **Flaky tests**
   - Add proper waits for async operations
   - Use `waitFor` instead of fixed timeouts

### Debug Commands

```bash
# Check if application is running
curl http://localhost:3000

# Check backend API
curl http://localhost:8080/health

# Run tests with verbose output
npx playwright test --reporter=line
```

## Contributing

### Adding New Tests

1. **Create Page Object** (if needed)

   - Add new page object class in `page-objects/`
   - Include locators and actions
   - Extend `BasePage` for common functionality

2. **Add Data Test IDs**

   - Add `data-testid` attributes to frontend components
   - Use descriptive names for test IDs

3. **Write Test Cases**

   - Follow Arrange-Act-Assert pattern
   - Use descriptive test names
   - Include proper cleanup in `beforeEach`

4. **Update Documentation**
   - Update this README with new test coverage
   - Document new page objects and test IDs

### Test Naming Convention

- **Test files**: `*.spec.ts`
- **Test descriptions**: `should [action] [condition]`
- **Page objects**: `[PageName]Page.ts`
- **Data test IDs**: `[element]-[type]` (e.g., `login-button`, `email-input`)

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [Debugging](https://playwright.dev/docs/debug)
