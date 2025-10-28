"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Anchor, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLogin } from "@/src/hooks/useLogin";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { handleLogin, isLoading, error } = useLogin();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleLogin({ email, password });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-primary rounded-full">
              <LogIn className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  data-testid="email-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  data-testid="password-input"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="text-sm text-red-600 bg-red-50 p-3 rounded-md"
                  data-testid="error-message"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="login-button"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Actions */}
        <div className="text-center space-y-4">
          <div className="flex items-center space-x-2">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-2">
            <Link href="/auth/forgot-password">
              <Button
                variant="link"
                className="text-sm"
                data-testid="forgot-password-link"
              >
                <Anchor className="h-4 w-4 mr-2" />
                Forgot your password?
              </Button>
            </Link>

            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:underline"
                data-testid="register-link"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="back-to-home-button">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
