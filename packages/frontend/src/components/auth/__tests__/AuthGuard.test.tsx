import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import AuthGuard, { withAuthGuard } from "../AuthGuard";
import { AuthProvider } from "../AuthProvider";
import React from "react";

// Mock Next.js router
const mockPush = vi.fn();
const mockBack = vi.fn();
const mockForward = vi.fn();
const mockRefresh = vi.fn();
const mockReplace = vi.fn();
const mockPrefetch = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    forward: mockForward,
    refresh: mockRefresh,
    replace: mockReplace,
    prefetch: mockPrefetch,
  }),
}));

// Mock AuthProvider
const mockAuthContext = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  updateProfile: vi.fn(),
  clearError: vi.fn(),
};

vi.mock("../AuthProvider", () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("AuthGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.isLoading = false;
    mockAuthContext.error = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Loading State", () => {
    it("should show loading state when isLoading is true", () => {
      // Arrange
      mockAuthContext.isLoading = true;

      // Act
      render(
        <AuthGuard>
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>
      );

      // Assert
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("should show loading spinner and message", () => {
      // Arrange
      mockAuthContext.isLoading = true;

      // Act
      render(
        <AuthGuard>
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>
      );

      // Assert
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      // Loading state should not have a try again button
      expect(
        screen.queryByRole("button", { name: /try again/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should show error state when error exists", () => {
      // Arrange
      mockAuthContext.error = "Authentication failed";

      // Act
      render(
        <AuthGuard>
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>
      );

      // Assert
      expect(screen.getByText("Authentication failed")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /try again/i })
      ).toBeInTheDocument();
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("should show try again button in error state", () => {
      // Arrange
      mockAuthContext.error = "Network error";

      // Act
      render(
        <AuthGuard>
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>
      );

      // Assert
      const tryAgainButton = screen.getByRole("button", { name: /try again/i });
      expect(tryAgainButton).toBeInTheDocument();
    });
  });

  describe("Authentication Requirements", () => {
    it("should redirect to login when user is not authenticated and requireAuth is true", async () => {
      // Arrange
      mockAuthContext.isAuthenticated = false;
      mockAuthContext.isLoading = false;
      mockAuthContext.error = null;

      // Act
      render(
        <AuthGuard requireAuth={true} redirectTo="/auth/login">
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>
      );

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/auth/login");
      });
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("should allow access when user is authenticated and requireAuth is true", () => {
      // Arrange
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: "test-user-1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      // Act
      render(
        <AuthGuard requireAuth={true}>
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>
      );

      // Assert
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should allow access when user is not authenticated and requireAuth is false", () => {
      // Arrange
      mockAuthContext.isAuthenticated = false;

      // Act
      render(
        <AuthGuard requireAuth={false}>
          <div data-testid="public-content">Public Content</div>
        </AuthGuard>
      );

      // Assert
      expect(screen.getByTestId("public-content")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should redirect authenticated users away from auth pages when requireAuth is false", async () => {
      // Arrange
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: "test-user-1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      // Act
      render(
        <AuthGuard requireAuth={false}>
          <div data-testid="auth-page">Login Page</div>
        </AuthGuard>
      );

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard");
      });
    });
  });

  describe("Email Verification Requirements", () => {
    it("should redirect to email verification when user is not verified and requireEmailVerified is true", async () => {
      // Arrange
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: "test-user-1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      // Act
      render(
        <AuthGuard requireAuth={true} requireEmailVerified={true}>
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>
      );

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/auth/verify-email");
      });
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("should allow access when user is email verified and requireEmailVerified is true", () => {
      // Arrange
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: "test-user-1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      // Act
      render(
        <AuthGuard requireAuth={true} requireEmailVerified={true}>
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>
      );

      // Assert
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Fallback Component", () => {
    it("should render fallback component when user is not authenticated", () => {
      // Arrange
      mockAuthContext.isAuthenticated = false;

      // Act
      render(
        <AuthGuard
          requireAuth={true}
          fallback={<div data-testid="fallback-content">Please login</div>}
        >
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>
      );

      // Assert
      expect(screen.getByTestId("fallback-content")).toBeInTheDocument();
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("should render fallback component when email is not verified", () => {
      // Arrange
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: "test-user-1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      // Act
      render(
        <AuthGuard
          requireAuth={true}
          requireEmailVerified={true}
          fallback={
            <div data-testid="email-verification-fallback">
              Please verify your email
            </div>
          }
        >
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>
      );

      // Assert
      expect(
        screen.getByTestId("email-verification-fallback")
      ).toBeInTheDocument();
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });
  });

  describe("withAuthGuard HOC", () => {
    it("should wrap component with AuthGuard", () => {
      // Arrange
      const TestComponent = () => (
        <div data-testid="test-component">Test Component</div>
      );
      const ProtectedComponent = withAuthGuard(TestComponent, {
        requireAuth: true,
      });

      mockAuthContext.isAuthenticated = true;

      // Act
      render(<ProtectedComponent />);

      // Assert
      expect(screen.getByTestId("test-component")).toBeInTheDocument();
    });

    it("should apply AuthGuard options to wrapped component", async () => {
      // Arrange
      const TestComponent = () => (
        <div data-testid="test-component">Test Component</div>
      );
      const ProtectedComponent = withAuthGuard(TestComponent, {
        requireAuth: true,
        redirectTo: "/custom-login",
      });

      mockAuthContext.isAuthenticated = false;

      // Act
      render(<ProtectedComponent />);

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/custom-login");
      });
      expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
    });
  });

  describe("Custom Redirect Paths", () => {
    it("should use custom redirect path for authentication", async () => {
      // Arrange
      mockAuthContext.isAuthenticated = false;

      // Act
      render(
        <AuthGuard requireAuth={true} redirectTo="/custom-auth">
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>
      );

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/custom-auth");
      });
    });
  });
});
