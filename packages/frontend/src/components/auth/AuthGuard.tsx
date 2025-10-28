"use client";

import React from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireEmailVerified?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  requireEmailVerified = false,
  fallback,
  redirectTo = "/auth/login",
}: AuthGuardProps) {
  const { user, isAuthenticated, isLoading, error } = useAuth();
  const router = useRouter();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-destructive text-center">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    console.log(
      "AuthGuard: User not authenticated, redirecting to:",
      redirectTo
    );
    console.log("AuthGuard: Current auth state:", {
      user,
      isAuthenticated,
      isLoading,
      error,
    });

    if (fallback) {
      return <>{fallback}</>;
    }

    // Redirect to login page
    React.useEffect(() => {
      console.log("AuthGuard: Redirecting to login page");
      router.push(redirectTo);
    }, [router, redirectTo]);

    return null;
  }

  // Check email verification requirement
  if (requireEmailVerified && user && !user.emailVerified) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Redirect to email verification page
    React.useEffect(() => {
      router.push("/auth/verify-email");
    }, [router]);

    return null;
  }

  // If user is authenticated but trying to access auth pages, redirect to dashboard
  if (!requireAuth && isAuthenticated) {
    React.useEffect(() => {
      router.push("/dashboard");
    }, [router]);

    return null;
  }

  // Render children if all checks pass
  return <>{children}</>;
}

// Higher-order component for protecting routes
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, "children"> = {}
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
