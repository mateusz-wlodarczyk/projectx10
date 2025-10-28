"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/urls";

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (profileData: {
    firstName: string;
    lastName: string;
  }) => Promise<any>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state on mount - optimized to reduce re-renders
  useEffect(() => {
    console.log("AuthProvider - useEffect triggered");

    const initializeAuth = async () => {
      console.log("AuthProvider - initializeAuth called");
      try {
        // Check for existing session/token
        if (typeof window !== "undefined") {
          console.log("AuthProvider - window is defined");
          const storedUser = localStorage.getItem("user");
          console.log("AuthProvider - storedUser:", storedUser);

          if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log("AuthProvider - setting authenticated user:", user);
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            console.log(
              "AuthProvider - no stored user, setting unauthenticated"
            );
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } else {
          console.log(
            "AuthProvider - window undefined, setting unauthenticated"
          );
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Failed to initialize authentication",
        });
      }
    };

    // Initialize immediately without delay to reduce re-renders
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          throw new Error(data.message || "Login failed");
        } else {
          throw new Error("Login failed");
        }
      }

      const data = await response.json();

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        emailVerified: data.user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      // Store session data
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("session", JSON.stringify(data.session));
      }

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          throw new Error(data.message || "Registration failed");
        } else {
          throw new Error("Registration failed");
        }
      }

      const data = await response.json();

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        emailVerified: data.user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store session data if available (some auth flows return session immediately)
      if (data.session && typeof window !== "undefined") {
        sessionStorage.setItem("session", JSON.stringify(data.session));
      }

      setAuthState({
        user,
        isAuthenticated: !!data.session, // Authenticated if session is returned
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      }));
      throw error;
    }
  };

  const logout = async () => {
    console.log("AuthProvider - logout called");
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Call backend logout endpoint
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Clear stored user data
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("session");
        sessionStorage.removeItem("session");
        console.log("AuthProvider - cleared localStorage and sessionStorage");
      }

      console.log("AuthProvider - setting unauthenticated state");
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      // Even if logout fails, clear local state
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("session");
        sessionStorage.removeItem("session");
      }

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const forgotPassword = async (email: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to send reset email",
      }));
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to reset password",
      }));
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Implement actual Supabase Auth email verification
      console.log("Verifying email with token:", token);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (authState.user) {
        setAuthState((prev) => ({
          ...prev,
          user: { ...prev.user!, emailVerified: true },
          isLoading: false,
        }));
      }
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to verify email",
      }));
      throw error;
    }
  };

  const resendVerification = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Implement actual Supabase Auth resend verification
      console.log("Resending verification email");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to resend verification",
      }));
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      // Implement actual token refresh
      console.log("Refreshing token");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Token refresh failed:", error);
      // If refresh fails, logout the user
      await logout();
    }
  };

  const updateProfile = async (profileData: {
    firstName: string;
    lastName: string;
  }) => {
    try {
      // Get stored session token
      if (typeof window === "undefined") {
        throw new Error("No authentication session found");
      }

      const storedSession =
        localStorage.getItem("session") || sessionStorage.getItem("session");
      if (!storedSession) {
        throw new Error("No authentication session found");
      }

      const session = JSON.parse(storedSession);
      if (!session.access_token) {
        throw new Error("No access token found in session");
      }

      const response = await fetch(
        API_ENDPOINTS.AUTH.PROFILE ||
          `${API_ENDPOINTS.AUTH.LOGIN.replace("/login", "/profile")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update local user data
      if (authState.user) {
        const updatedUser = {
          ...authState.user,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
        };

        setAuthState((prev) => ({
          ...prev,
          user: updatedUser,
        }));

        // Update stored user data
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    refreshToken,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthProvider;
