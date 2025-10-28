import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TestAuthService } from "../TestAuthService";
import { User, Session } from "../user-utils";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
});

describe("TestAuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    mockSessionStorage.removeItem.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Mock User Creation", () => {
    it("should create a valid mock user", () => {
      // Act
      const mockUser = TestAuthService.createMockUser();

      // Assert
      expect(mockUser).toEqual({
        id: "test-user-1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        emailVerified: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        lastLoginAt: expect.any(Date),
      });

      expect(mockUser.id).toBe("test-user-1");
      expect(mockUser.email).toBe("test@example.com");
      expect(mockUser.firstName).toBe("Test");
      expect(mockUser.lastName).toBe("User");
      expect(mockUser.emailVerified).toBe(true);
    });

    it("should create user with valid date strings", () => {
      // Act
      const mockUser = TestAuthService.createMockUser();

      // Assert
      expect(() => new Date(mockUser.createdAt)).not.toThrow();
      expect(() => new Date(mockUser.updatedAt)).not.toThrow();
      expect(() => new Date(mockUser.lastLoginAt)).not.toThrow();
    });
  });

  describe("Mock Session Creation", () => {
    it("should create a valid mock session", () => {
      // Act
      const mockSession = TestAuthService.createMockSession();

      // Assert
      expect(mockSession).toEqual({
        access_token: "test-token",
        refresh_token: "test-refresh-token",
        expires_at: expect.any(Number),
      });

      expect(mockSession.access_token).toBe("test-token");
      expect(mockSession.refresh_token).toBe("test-refresh-token");
      expect(mockSession.expires_at).toBeGreaterThan(Date.now());
    });

    it("should create session with future expiration time", () => {
      // Act
      const mockSession = TestAuthService.createMockSession();

      // Assert
      const now = Date.now();
      const oneHourFromNow = now + 3600000;

      expect(mockSession.expires_at).toBeGreaterThan(now);
      expect(mockSession.expires_at).toBeLessThanOrEqual(oneHourFromNow);
    });

    it("should create session with future expiration time", () => {
      // Act
      const mockSession = TestAuthService.createMockSession();

      // Assert
      expect(mockSession.expires_at).toBeGreaterThan(Date.now());
    });
  });

  describe("Test Session Storage", () => {
    it("should store test session in localStorage", () => {
      // Act
      TestAuthService.storeTestSession();

      // Assert
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "user",
        expect.stringContaining("test-user-1")
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "session",
        expect.stringContaining("test-token")
      );
    });

    it("should store valid JSON in localStorage", () => {
      // Act
      TestAuthService.storeTestSession();

      // Assert
      const userCall = mockLocalStorage.setItem.mock.calls.find(
        (call) => call[0] === "user"
      );
      const sessionCall = mockLocalStorage.setItem.mock.calls.find(
        (call) => call[0] === "session"
      );

      expect(userCall).toBeDefined();
      expect(sessionCall).toBeDefined();

      // Verify JSON is valid
      expect(() => JSON.parse(userCall![1])).not.toThrow();
      expect(() => JSON.parse(sessionCall![1])).not.toThrow();

      const storedUser = JSON.parse(userCall![1]);
      const storedSession = JSON.parse(sessionCall![1]);

      expect(storedUser.id).toBe("test-user-1");
      expect(storedSession.access_token).toBe("test-token");
    });

    it("should handle localStorage errors gracefully", () => {
      // Arrange
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      // Act & Assert - Should not throw
      expect(() => TestAuthService.storeTestSession()).not.toThrow();
    });
  });

  describe("Debug Session Creation", () => {
    it("should create debug session with custom data", () => {
      // Arrange
      const customUserData = {
        email: "debug@example.com",
        firstName: "Debug",
        lastName: "User",
      };

      // Act
      TestAuthService.createDebugSession(customUserData);

      // Assert
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);

      const userCall = mockLocalStorage.setItem.mock.calls.find(
        (call) => call[0] === "user"
      );

      expect(userCall).toBeDefined();

      const storedUser = JSON.parse(userCall![1]);
      expect(storedUser.email).toBe("debug@example.com");
      expect(storedUser.firstName).toBe("Debug");
      expect(storedUser.lastName).toBe("User");
    });

    it("should create debug session with default values for missing fields", () => {
      // Arrange
      const partialUserData = {
        email: "partial@example.com",
      };

      // Act
      TestAuthService.createDebugSession(partialUserData);

      // Assert
      const userCall = mockLocalStorage.setItem.mock.calls.find(
        (call) => call[0] === "user"
      );

      const storedUser = JSON.parse(userCall![1]);
      expect(storedUser.email).toBe("partial@example.com");
      expect(storedUser.firstName).toBe("Test"); // Default value
      expect(storedUser.lastName).toBe("User"); // Default value
      expect(storedUser.id).toBe("test-user-1");
    });

    it("should handle localStorage errors in debug session creation", () => {
      // Arrange
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      // Act & Assert - Should not throw
      expect(() => TestAuthService.createDebugSession({})).not.toThrow();
    });
  });

  describe("Clear Test Session", () => {
    it("should clear all authentication data from localStorage and sessionStorage", () => {
      // Act
      TestAuthService.clearTestSession();

      // Assert
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user");
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("session");
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("session");
    });

    it("should handle localStorage errors when clearing", () => {
      // Arrange
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      // Act & Assert - Should not throw
      expect(() => TestAuthService.clearTestSession()).not.toThrow();
    });

    it("should handle sessionStorage errors when clearing", () => {
      // Arrange
      mockSessionStorage.removeItem.mockImplementation(() => {
        throw new Error("sessionStorage error");
      });

      // Act & Assert - Should not throw
      expect(() => TestAuthService.clearTestSession()).not.toThrow();
    });
  });

  describe("Test Availability Check", () => {
    it("should return true when window is defined", () => {
      // Arrange
      vi.stubGlobal("process", {
        env: { NODE_ENV: "development" },
      });

      // Act
      const isAvailable = TestAuthService.isTestAuthAvailable();

      // Assert
      expect(isAvailable).toBe(true);
    });

    it("should return false when window is undefined", () => {
      // Arrange
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      // Act
      const isAvailable = TestAuthService.isTestAuthAvailable();

      // Assert
      expect(isAvailable).toBe(false);

      // Cleanup
      global.window = originalWindow;
    });
  });

  describe("Integration Tests", () => {
    it("should create and store a complete test session", () => {
      // Act
      TestAuthService.storeTestSession();

      // Assert
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);

      // Verify user data
      const userCall = mockLocalStorage.setItem.mock.calls.find(
        (call) => call[0] === "user"
      );
      expect(userCall).toBeDefined();
      const storedUser = JSON.parse(userCall![1]);
      expect(storedUser.id).toBe("test-user-1");
      expect(storedUser.email).toBe("test@example.com");

      // Verify session data
      const sessionCall = mockLocalStorage.setItem.mock.calls.find(
        (call) => call[0] === "session"
      );
      const storedSession = JSON.parse(sessionCall![1]);
      expect(storedSession.access_token).toBe("test-token");
    });

    it("should clear test session completely", () => {
      // Arrange - First store a session
      TestAuthService.storeTestSession();
      expect(mockLocalStorage.setItem).toHaveBeenCalled();

      // Act - Clear the session
      TestAuthService.clearTestSession();

      // Assert
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user");
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("session");
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("session");
    });
  });
});
