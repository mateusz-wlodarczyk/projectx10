# Testing Environment Setup

This project is now configured with comprehensive testing tools following the established testing guidelines.

## Testing Stack

### Unit Testing
- **Frontend**: Vitest + React Testing Library + jsdom
- **Backend**: Vitest + Node.js environment

### E2E Testing
- **Playwright**: Chromium-only configuration with Page Object Model

## Test Scripts

### Root Level Commands
```bash
# Run all tests (unit + e2e)
npm run test:all

# E2E tests only
npm run test:e2e
npm run test:e2e:ui        # Interactive UI mode
npm run test:e2e:headed   # Run with browser visible
npm run test:e2e:debug    # Debug mode

# Unit tests by package
npm run test:unit:frontend
npm run test:unit:backend
```

### Frontend Package Commands
```bash
cd packages/frontend

npm run test              # Run tests in watch mode
npm run test:ui           # Interactive UI mode
npm run test:watch        # Watch mode (default)
npm run test:coverage     # Run with coverage report
npm run test:run          # Run once and exit
```

### Backend Package Commands
```bash
cd packages/backend

npm run test              # Run tests in watch mode
npm run test:ui           # Interactive UI mode
npm run test:watch        # Watch mode (default)
npm run test:coverage     # Run with coverage report
npm run test:run          # Run once and exit
```

## Test Structure

### Unit Tests
- **Frontend**: `packages/frontend/src/test/`
- **Backend**: `packages/backend/src/test/`
- Setup files: `setup.ts` in each test directory

### E2E Tests
- **Tests**: `e2e/*.spec.ts`
- **Page Objects**: `e2e/page-objects/`
- **Screenshots**: `e2e/screenshots/` (auto-generated)

## Configuration Files

- `packages/frontend/vitest.config.ts` - Frontend Vitest configuration
- `packages/backend/vitest.config.ts` - Backend Vitest configuration
- `playwright.config.ts` - Playwright E2E configuration

## Testing Guidelines

### Unit Testing (Vitest)
- Use `vi` object for mocks and spies
- Follow Arrange-Act-Assert pattern
- Use inline snapshots for readable assertions
- Configure coverage thresholds (80% minimum)
- Use watch mode during development
- Leverage TypeScript type checking

### E2E Testing (Playwright)
- Use Page Object Model for maintainable tests
- Use locators for resilient element selection
- Implement visual comparison with screenshots
- Use browser contexts for test isolation
- Follow Arrange-Act-Assert pattern
- Leverage parallel execution

## Example Test Files

- `packages/frontend/src/test/LoginForm.test.tsx` - React component test
- `packages/backend/src/test/BoatsController.test.ts` - Controller test
- `e2e/auth.spec.ts` - Authentication flow E2E test

## Coverage Requirements

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Getting Started

1. Install dependencies: `npm install`
2. Run frontend unit tests: `npm run test:unit:frontend`
3. Run backend unit tests: `npm run test:unit:backend`
4. Run E2E tests: `npm run test:e2e`
5. Run all tests: `npm run test:all`

## Debugging

- Use `vitest --ui` for interactive unit test debugging
- Use `playwright test --debug` for E2E test debugging
- Use `playwright test --ui` for E2E test exploration
- Check `e2e/screenshots/` for visual test failures
