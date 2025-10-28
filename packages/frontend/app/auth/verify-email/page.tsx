"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [isVerified, setIsVerified] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      // Implement resend verification email
      console.log("Resending verification email...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error resending verification:", error);
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl font-bold tracking-tight">
            {isVerified ? "Email verified!" : "Verify your email"}
          </h1>
          <p className="text-muted-foreground">
            {isVerified
              ? "Your email has been successfully verified. You can now access all features."
              : "We've sent a verification link to your email address. Please check your inbox and click the link to verify your account."}
          </p>
        </div>

        {/* Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Email Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isVerified ? (
              <div className="text-center space-y-4">
                <div className="text-green-600 text-sm">
                  Your email has been verified successfully!
                </div>
                <Link href="/dashboard">
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or resend the
                  verification email.
                </div>

                <Button
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? "Sending..." : "Resend verification email"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Actions */}
        {!isVerified && (
          <div className="text-center space-y-4">
            <div className="flex items-center space-x-2">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Need to sign in?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
                >
                  Sign in
                </Link>
              </div>

              <div className="text-sm text-muted-foreground">
                Wrong email?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:underline"
                >
                  Sign up again
                </Link>
              </div>
            </div>
          </div>
        )}

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
