"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register, isLoading, error } = useAuth();
  const router = useRouter();

  const handleRegister = async (formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      await register(formData);
      router.push("/auth/verify-email");
    } catch (error) {
      // Error is handled by the auth context
      console.error("Registration failed:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-primary rounded-full">
              <UserPlus className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
          <p className="text-muted-foreground">
            Sign up to get started with yacht booking analytics
          </p>
        </div>

        {/* Register Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading}
              error={error}
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

          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
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
