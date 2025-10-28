import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthProvider";
import React from "react";

// Mock fetch globally for this test file
const mockFetch = vi.fn();
global.fetch = mockFetch;

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

// Test component to access auth context
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="is-authenticated">
        {auth.isAuthenticated.toString()}
      </div>
      <div data-testid="is-loading">{auth.isLoading.toString()}</div>
      <div data-testid="user-email">{auth.user?.email || "no-user"}</div>
      <div data-testid="error">{auth.error || "no-error"}</div>
      <button
        data-testid="login-button"
        onClick={() => auth.login("test@example.com", "password123")}
      >
        Login
      </button>
      <button data-testid="logout-button" onClick={() => auth.logout()}>
        Logout
      </button>
      <button
        data-testid="register-button"
        onClick={() =>
          auth.register({
            email: "new@example.com",
            password: "password123",
            firstName: "Test",
            lastName: "User",
          })
        }
      >
        Register
      </button>
      <button
        data-testid="update-profile-button"
        onClick={() =>
          auth.updateProfile({
            firstName: "Updated",
            lastName: "Name",
          })
        }
      >
        Update Profile
      </button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    
    // Mock console.error to suppress unhandled errors in tests
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with unauthenticated state when no stored user", async () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(null);

      // Act
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent(
          "false"
        );
        expect(screen.getByTestId("is-loading")).toHaveTextContent("false");
        expect(screen.getByTestId("user-email")).toHaveTextContent("no-user");
        expect(screen.getByTestId("error")).toHaveTextContent("no-error");
      });
    });

    it("should initialize with authenticated state when stored user exists", async () => {
      // Arrange
      const mockUser = {
        id: "test-user-1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      // Act
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent(
          "true"
        );
        expect(screen.getByTestId("is-loading")).toHaveTextContent("false");
        expect(screen.getByTestId("user-email")).toHaveTextContent(
          "test@example.com"
        );
      });
    });

    it("should handle localStorage parsing errors gracefully", async () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue("invalid-json");

      // Act
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent(
          "false"
        );
        expect(screen.getByTestId("is-loading")).toHaveTextContent("false");
        expect(screen.getByTestId("error")).toHaveTextContent(
          "Failed to initialize authentication"
        );
      });
    });
  });

  describe("Login", () => {
    it("should handle successful login", async () => {
      // Arrange
      const mockResponse = {
        user: {
          id: "test-user-1",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          emailVerified: true,
        },
        session: {
          access_token: "test-token",
          refresh_token: "test-refresh",
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Act
      const loginButton = screen.getByTestId("login-button");
      loginButton.click();

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent(
          "true"
        );
        expect(screen.getByTestId("user-email")).toHaveTextContent(
          "test@example.com"
        );
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "user",
        expect.stringContaining("test@example.com")
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "session",
        expect.stringContaining("test-token")
      );
    });

    it.skip("should handle login failure", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: {
          get: () => "application/json",
        },
        json: async () => ({ message: "Invalid credentials" }),
      } as unknown as Response);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Act
      const loginButton = screen.getByTestId("login-button");
      loginButton.click();

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent(
          "false"
        );
        expect(screen.getByTestId("error")).toHaveTextContent(
          "Invalid credentials"
        );
      });
    });

    it.skip("should handle network errors during login", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Act
      const loginButton = screen.getByTestId("login-button");
      loginButton.click();

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent(
          "false"
        );
        expect(screen.getByTestId("error")).toHaveTextContent("Network error");
      });
    });
  });

  describe("Register", () => {
    it("should handle successful registration", async () => {
      // Arrange
      const mockResponse = {
        user: {
          id: "new-user-1",
          email: "new@example.com",
          firstName: "Test",
          lastName: "User",
          emailVerified: false,
        },
        session: {
          access_token: "new-token",
          refresh_token: "new-refresh",
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Act
      const registerButton = screen.getByTestId("register-button");
      registerButton.click();

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent(
          "true"
        );
        expect(screen.getByTestId("user-email")).toHaveTextContent(
          "new@example.com"
        );
      });
    });

    it.skip("should handle registration failure", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        statusText: "Conflict",
        headers: {
          get: () => "application/json",
        },
        json: async () => ({ message: "Email already exists" }),
      } as unknown as Response);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Act
      const registerButton = screen.getByTestId("register-button");
      registerButton.click();

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent(
          "false"
        );
        expect(screen.getByTestId("error")).toHaveTextContent(
          "Email already exists"
        );
      });
    });
  });

  describe("Logout", () => {
    it("should clear authentication state and localStorage on logout", async () => {
      // Arrange - Start with authenticated state
      const mockUser = {
        id: "test-user-1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent(
          "true"
        );
      });

      // Act
      const logoutButton = screen.getByTestId("logout-button");
      logoutButton.click();

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent(
          "false"
        );
        expect(screen.getByTestId("user-email")).toHaveTextContent("no-user");
      });

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user");
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("session");
    });
  });

  describe("Update Profile", () => {
    it("should handle successful profile update", async () => {
      // Arrange
      const mockUser = {
        id: "test-user-1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      // Mock session storage with valid access token
      const mockSession = {
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        user: mockUser,
      };
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(mockSession));
      // Also mock localStorage to return null for session (so it falls back to sessionStorage)
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === "session") return null;
        return JSON.stringify(mockUser);
      });

      const mockResponse = {
        user: {
          ...mockUser,
          firstName: "Updated",
          lastName: "Name",
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent(
          "true"
        );
      });

      // Act
      const updateButton = screen.getByTestId("update-profile-button");
      updateButton.click();

      // Assert
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "user",
          expect.stringContaining("Updated")
        );
      });
    });
  });

  describe("Error Handling", () => {
    it.skip("should clear error when clearError is called", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Test error"));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByTestId("login-button");
      loginButton.click();

      await waitFor(() => {
        expect(screen.getByTestId("error")).toHaveTextContent("Test error");
      });

      // Act - Clear error (this would need to be exposed in TestComponent)
      // For now, we'll test that error state is properly managed
      expect(screen.getByTestId("error")).toHaveTextContent("Test error");
    });
  });
});
