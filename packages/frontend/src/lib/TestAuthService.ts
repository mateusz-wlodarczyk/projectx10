/**
 * Test authentication service for development and testing
 * This should only be used in development environments
 */
export class TestAuthService {
  private static readonly MOCK_USER = {
    id: "test-user-1",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
  };

  private static readonly MOCK_SESSION = {
    access_token: "test-token",
    refresh_token: "test-refresh-token",
    expires_at: Date.now() + 3600000, // 1 hour from now
  };

  /**
   * Creates a test user session for development
   */
  static createTestSession(): void {
    if (typeof window === "undefined") {
      console.warn("TestAuthService: Cannot create session on server side");
      return;
    }

    try {
      localStorage.setItem("user", JSON.stringify(this.MOCK_USER));
      localStorage.setItem("session", JSON.stringify(this.MOCK_SESSION));
    } catch (error) {}
  }

  /**
   * Creates a debug user session with custom data
   */
  static createDebugSession(customData?: Partial<typeof this.MOCK_USER>): void {
    if (typeof window === "undefined") {
      console.warn("TestAuthService: Cannot create session on server side");
      return;
    }

    try {
      const debugUser = { ...this.MOCK_USER, ...customData };
      const debugSession = {
        ...this.MOCK_SESSION,
        access_token: "debug-token",
        refresh_token: "debug-refresh-token",
      };

      localStorage.setItem("user", JSON.stringify(debugUser));
      localStorage.setItem("session", JSON.stringify(debugSession));
    } catch (error) {}
  }

  /**
   * Clears all authentication data
   */
  static clearAuthData(): void {
    if (typeof window === "undefined") {
      console.warn("TestAuthService: Cannot clear session on server side");
      return;
    }

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("session");
      sessionStorage.removeItem("session");
    } catch (error) {}
  }

  /**
   * Checks if test authentication is available
   */
  static isTestAuthAvailable(): boolean {
    return (
      typeof window !== "undefined" && process.env.NODE_ENV === "development"
    );
  }

  /**
   * Gets the mock user data
   */
  static getMockUser() {
    return { ...this.MOCK_USER };
  }

  /**
   * Gets the mock session data
   */
  static getMockSession() {
    return { ...this.MOCK_SESSION };
  }

  /**
   * Creates a mock user for testing
   */
  static createMockUser() {
    return { ...this.MOCK_USER };
  }

  /**
   * Creates a mock session for testing
   */
  static createMockSession() {
    return { ...this.MOCK_SESSION };
  }

  /**
   * Stores a test session in localStorage
   */
  static storeTestSession(userData?: Partial<typeof this.MOCK_USER>) {
    if (typeof window === "undefined") {
      console.warn("TestAuthService: Cannot store session on server side");
      return;
    }

    try {
      const user = { ...this.MOCK_USER, ...userData };
      const session = { ...this.MOCK_SESSION };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("session", JSON.stringify(session));
    } catch (error) {
      console.error("Error storing test session:", error);
    }
  }

  /**
   * Clears test session data
   */
  static clearTestSession() {
    if (typeof window === "undefined") {
      console.warn("TestAuthService: Cannot clear session on server side");
      return;
    }

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("session");
      sessionStorage.removeItem("session");
    } catch (error) {
      console.error("Error clearing test session:", error);
    }
  }
}
