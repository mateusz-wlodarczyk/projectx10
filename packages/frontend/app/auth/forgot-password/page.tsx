"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useAuth } from "@/src/components/auth/AuthProvider";

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading, error } = useAuth();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: { email: string }) => {
    try {
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (error) {
      // Error is handled by AuthProvider and displayed via error state
      console.error("Forgot password error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-primary rounded-full">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        {/* Forgot Password Form */}
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
              success={success}
            />
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
            <div className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>

            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
