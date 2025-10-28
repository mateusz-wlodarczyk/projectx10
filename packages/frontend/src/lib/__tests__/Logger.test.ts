import { describe, it, expect, beforeEach, vi } from "vitest";
import { logger, LogLevel } from "../Logger";

// Mock console methods
const mockConsole = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Replace console methods with mocks
Object.assign(console, mockConsole);

describe("Logger", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Reset logger to default state
    logger.setLogLevel(LogLevel.DEBUG);
  });

  describe("Log Level Filtering", () => {
    it("should log all levels when set to DEBUG", () => {
      logger.setLogLevel(LogLevel.DEBUG);

      logger.debug("Debug message");
      logger.info("Info message");
      logger.warn("Warn message");
      logger.error("Error message");

      expect(mockConsole.debug).toHaveBeenCalled();
      expect(mockConsole.info).toHaveBeenCalled();
      expect(mockConsole.warn).toHaveBeenCalled();
      expect(mockConsole.error).toHaveBeenCalled();
    });

    it("should only log WARN and ERROR when set to WARN", () => {
      logger.setLogLevel(LogLevel.WARN);

      logger.debug("Debug message");
      logger.info("Info message");
      logger.warn("Warn message");
      logger.error("Error message");

      expect(mockConsole.debug).not.toHaveBeenCalled();
      expect(mockConsole.info).not.toHaveBeenCalled();
      expect(mockConsole.warn).toHaveBeenCalled();
      expect(mockConsole.error).toHaveBeenCalled();
    });

    it("should only log ERROR when set to ERROR", () => {
      logger.setLogLevel(LogLevel.ERROR);

      logger.debug("Debug message");
      logger.info("Info message");
      logger.warn("Warn message");
      logger.error("Error message");

      expect(mockConsole.debug).not.toHaveBeenCalled();
      expect(mockConsole.info).not.toHaveBeenCalled();
      expect(mockConsole.warn).not.toHaveBeenCalled();
      expect(mockConsole.error).toHaveBeenCalled();
    });
  });

  describe("Message Formatting", () => {
    it("should format messages with timestamp and level", () => {
      logger.info("Test message");

      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z INFO: Test message$/
        ),
        ""
      );
    });

    it("should include context when provided", () => {
      logger.info("Test message", undefined, "TestContext");

      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[TestContext\]: Test message$/),
        ""
      );
    });

    it("should include data when provided", () => {
      const testData = { key: "value" };
      logger.info("Test message", testData);

      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringMatching(/Test message$/),
        testData
      );
    });
  });

  describe("Singleton Pattern", () => {
    it("should return the same instance", () => {
      const instance1 = logger;
      const instance2 = logger;

      expect(instance1).toBe(instance2);
    });
  });

  describe("Log Level Management", () => {
    it("should set and get log level correctly", () => {
      logger.setLogLevel(LogLevel.INFO);
      expect(logger.getLogLevel()).toBe(LogLevel.INFO);

      logger.setLogLevel(LogLevel.ERROR);
      expect(logger.getLogLevel()).toBe(LogLevel.ERROR);
    });
  });
});
