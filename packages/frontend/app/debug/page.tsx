"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DebugPage() {
  const { user, isAuthenticated, isLoading, error } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [storedUser, setStoredUser] = useState<string | null>(null);
  const [storedSession, setStoredSession] = useState<string | null>(null);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setStoredUser(localStorage.getItem("user"));
      setStoredSession(localStorage.getItem("session"));
    }
  }, []);

  const handleTestLogin = async () => {
    try {
      // Test with a mock user for debugging
      const mockUser = {
        id: "debug-user-1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem(
          "session",
          JSON.stringify({
            access_token: "debug-token",
            refresh_token: "debug-refresh-token",
            expires_at: Date.now() + 3600000, // 1 hour from now
          })
        );

        // Update local state
        setStoredUser(JSON.stringify(mockUser));
        setStoredSession(
          JSON.stringify({
            access_token: "debug-token",
            refresh_token: "debug-refresh-token",
            expires_at: Date.now() + 3600000,
          })
        );

        // Reload the page to trigger auth state update
        window.location.reload();
      }
    } catch (error) {
      console.error("Test login failed:", error);
    }
  };

  const handleClearAuth = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("session");
      sessionStorage.removeItem("session");

      // Update local state
      setStoredUser(null);
      setStoredSession(null);

      window.location.reload();
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Debug Authentication State</h1>
        <div className="flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Debug Authentication State</h1>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Authentication State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Is Loading:</strong> {isLoading ? "Yes" : "No"}
              </p>
              <p>
                <strong>Is Authenticated:</strong>{" "}
                {isAuthenticated ? "Yes" : "No"}
              </p>
              <p>
                <strong>Error:</strong> {error || "None"}
              </p>
              <p>
                <strong>User:</strong>
              </p>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {user ? JSON.stringify(user, null, 2) : "null"}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Stored User:</strong>
              </p>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {storedUser || "null"}
              </pre>
              <p>
                <strong>Stored Session:</strong>
              </p>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {storedSession || "null"}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-x-2">
              <Button onClick={handleTestLogin}>
                Set Test User (Debug Login)
              </Button>
              <Button onClick={handleClearAuth} variant="outline">
                Clear Authentication
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-x-2">
              <Button onClick={() => (window.location.href = "/admin")}>
                Go to Admin
              </Button>
              <Button onClick={() => (window.location.href = "/settings")}>
                Go to Settings
              </Button>
              <Button onClick={() => (window.location.href = "/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
