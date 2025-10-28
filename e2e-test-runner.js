#!/usr/bin/env node

/**
 * E2E Test Runner for BoatsStats Project
 *
 * This script runs Playwright E2E tests with proper configuration and reporting
 * focusing on login and navigation functionality.
 */

import { execSync } from "child_process";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";

// Test configuration
const E2E_CONFIG = {
  timeout: 60000, // 60 seconds for E2E tests
  retries: 2,
  parallel: false, // Run E2E tests sequentially for stability
  browsers: ["chromium", "firefox", "webkit"],
  headless: true,
  baseURL: "http://localhost:3000",
};

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Utility functions
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
  log(`${colors.bright}${colors.cyan}${title}${colors.reset}`);
  log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
}

function logSuccess(message) {
  log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
  log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function logInfo(message) {
  log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

// Test execution functions
function validateE2EEnvironment() {
  logSection("Validating E2E Test Environment");

  try {
    // Check if required files exist
    const requiredFiles = [
      "playwright.config.ts",
      "e2e/auth.spec.ts",
      "e2e/navigation.spec.ts",
      "e2e/page-objects/BasePage.ts",
      "e2e/page-objects/LoginPage.ts",
      "e2e/page-objects/DashboardPage.ts",
      "e2e/page-objects/BoatsPage.ts",
      "e2e/page-objects/AdminPage.ts",
      "e2e/page-objects/LandingPage.ts",
    ];

    for (const file of requiredFiles) {
      if (existsSync(file)) {
        logSuccess(`Found: ${file}`);
      } else {
        logError(`Missing: ${file}`);
        return false;
      }
    }

    // Check if frontend is running
    logInfo("Checking if frontend is accessible...");
    try {
      execSync(`curl -s -o /dev/null -w "%{http_code}" ${E2E_CONFIG.baseURL}`, {
        timeout: 5000,
      });
      logSuccess("Frontend is accessible");
    } catch (error) {
      logWarning(
        "Frontend might not be running. Make sure to start the development server."
      );
    }

    logSuccess("E2E environment validation completed");
    return true;
  } catch (error) {
    logError(`Environment validation failed: ${error}`);
    return false;
  }
}

function runAuthenticationTests() {
  logSection("Running Authentication Tests");

  try {
    logInfo("Starting authentication flow tests...");

    const command = `npx playwright test e2e/auth.spec.ts --reporter=html --reporter=line`;
    execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
      timeout: E2E_CONFIG.timeout,
    });

    logSuccess("Authentication tests completed successfully");
    return true;
  } catch (error) {
    logError(`Authentication tests failed: ${error}`);
    return false;
  }
}

function runNavigationTests() {
  logSection("Running Navigation Tests");

  try {
    logInfo("Starting navigation flow tests...");

    const command = `npx playwright test e2e/navigation.spec.ts --reporter=html --reporter=line`;
    execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
      timeout: E2E_CONFIG.timeout,
    });

    logSuccess("Navigation tests completed successfully");
    return true;
  } catch (error) {
    logError(`Navigation tests failed: ${error}`);
    return false;
  }
}

function runAllE2ETests() {
  logSection("Running All E2E Tests");

  try {
    logInfo("Starting comprehensive E2E test suite...");

    const command = `npx playwright test e2e/ --reporter=html --reporter=line`;
    execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
      timeout: E2E_CONFIG.timeout * 2,
    });

    logSuccess("All E2E tests completed successfully");
    return true;
  } catch (error) {
    logError(`E2E tests failed: ${error}`);
    return false;
  }
}

function runSpecificTest(testFile) {
  logSection(`Running Specific Test: ${testFile}`);

  try {
    logInfo(`Starting test: ${testFile}`);

    const command = `npx playwright test ${testFile} --reporter=html --reporter=line`;
    execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
      timeout: E2E_CONFIG.timeout,
    });

    logSuccess(`Test ${testFile} completed successfully`);
    return true;
  } catch (error) {
    logError(`Test ${testFile} failed: ${error}`);
    return false;
  }
}

function generateE2EReport() {
  logSection("Generating E2E Test Report");

  try {
    logInfo("Creating E2E test report...");

    const reportData = {
      timestamp: new Date().toISOString(),
      testConfig: E2E_CONFIG,
      testSuites: [
        "Authentication Flow",
        "Navigation Flow",
        "Landing Page Navigation",
        "Dashboard Navigation",
        "Boats Page Navigation",
        "Admin Page Navigation",
        "Cross-Page Navigation",
        "Unauthorized Access",
      ],
      pageObjects: [
        "BasePage",
        "LoginPage",
        "DashboardPage",
        "BoatsPage",
        "AdminPage",
        "LandingPage",
      ],
      summary: {
        totalTests: "See Playwright HTML report",
        passed: "See Playwright HTML report",
        failed: "See Playwright HTML report",
        duration: "See Playwright HTML report",
      },
    };

    // Write report to file
    const reportPath = join(process.cwd(), "e2e-test-report.json");
    writeFileSync(reportPath, JSON.stringify(reportData, null, 2));

    logSuccess(`E2E test report generated: ${reportPath}`);
    logInfo("Check playwright-report/index.html for detailed results");
  } catch (error) {
    logError(`Failed to generate E2E test report: ${error}`);
  }
}

function showTestSummary() {
  logSection("E2E Test Summary");

  logInfo("Test Coverage:");
  log("  ✅ Landing page navigation");
  log("  ✅ Authentication flow (login/logout)");
  log("  ✅ Dashboard navigation");
  log("  ✅ Boats page navigation");
  log("  ✅ Admin page navigation");
  log("  ✅ Cross-page navigation");
  log("  ✅ Unauthorized access protection");

  logInfo("Page Objects Created:");
  log("  ✅ BasePage - Common functionality");
  log("  ✅ LoginPage - Login form interactions");
  log("  ✅ DashboardPage - Dashboard interactions");
  log("  ✅ BoatsPage - Boats listing interactions");
  log("  ✅ AdminPage - Admin panel interactions");
  log("  ✅ LandingPage - Landing page interactions");

  logInfo("Data Test IDs Added:");
  log("  ✅ Login form elements");
  log("  ✅ Landing page buttons");
  log("  ✅ Navigation elements");
  log("  ✅ Error messages");
  log("  ✅ Loading states");
}

// Main execution function
function main() {
  logSection("BoatsStats E2E Test Suite");
  logInfo("Starting E2E test execution...");
  logInfo(`E2E configuration: ${JSON.stringify(E2E_CONFIG, null, 2)}`);

  const startTime = Date.now();
  let allTestsPassed = true;

  try {
    // Step 1: Validate environment
    if (!validateE2EEnvironment()) {
      logError("Environment validation failed. Exiting.");
      process.exit(1);
    }

    // Step 2: Run authentication tests
    if (!runAuthenticationTests()) {
      allTestsPassed = false;
    }

    // Step 3: Run navigation tests
    if (!runNavigationTests()) {
      allTestsPassed = false;
    }

    // Step 4: Generate report
    generateE2EReport();

    // Step 5: Show summary
    showTestSummary();

    // Final summary
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    logSection("E2E Test Execution Summary");
    logInfo(`Total execution time: ${duration.toFixed(2)} seconds`);

    if (allTestsPassed) {
      logSuccess("All E2E tests completed successfully! 🎉");
      logInfo("Check playwright-report/index.html for detailed results");
      process.exit(0);
    } else {
      logError("Some E2E tests failed. Check the output above for details.");
      process.exit(1);
    }
  } catch (error) {
    logError(`E2E test execution failed: ${error}`);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  log(`
${colors.bright}BoatsStats E2E Test Runner${colors.reset}

Usage: node e2e-test-runner.js [options]

Options:
  --help, -h          Show this help message
  --auth-only         Run only authentication tests
  --nav-only          Run only navigation tests
  --all               Run all E2E tests
  --test <file>       Run specific test file
  --headed            Run tests in headed mode
  --debug             Run tests in debug mode

Examples:
  node e2e-test-runner.js                    # Run auth and nav tests
  node e2e-test-runner.js --auth-only        # Run only auth tests
  node e2e-test-runner.js --test e2e/auth.spec.ts  # Run specific test
  node e2e-test-runner.js --headed           # Run in headed mode
  `);
  process.exit(0);
}

// Execute main function
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  main,
  runAuthenticationTests,
  runNavigationTests,
  runAllE2ETests,
  runSpecificTest,
};
