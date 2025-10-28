"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  onErrorClear?: () => void;
}

export default function LoginForm({
  onSubmit,
  isLoading = false,
  error,
  onErrorClear,
}: LoginFormProps) {
  const [formData, setFormData] = React.useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<
    Partial<LoginFormData>
  >({});

  const validateForm = (): boolean => {
    const errors: Partial<LoginFormData> = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    console.log("Validation errors:", errors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!");

    // Always validate the form first
    const isValid = validateForm();

    if (isValid) {
      try {
        if (onSubmit) {
          onSubmit(formData);
        } else {
          // If no onSubmit prop provided, we need to import and use the real auth hook
          // For now, we'll just log an error since this should be handled by the parent
          console.error(
            "No onSubmit prop provided and no auth context available"
          );
        }
      } catch (error) {
        // Error handling is done by the auth context
        console.error("Login error:", error);
      }
    }
  };

  const handleFormReset = () => {
    setFormData({ email: "", password: "" });
    setValidationErrors({});
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Clear external error when user starts typing
    if (error && onErrorClear) {
      onErrorClear();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleFormReset}
      className="space-y-4"
      role="form"
    >
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={isLoading}
          className={validationErrors.email ? "border-destructive" : ""}
          data-testid="email-input"
        />
        {validationErrors.email && (
          <div className="flex items-center space-x-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{validationErrors.email}</span>
          </div>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            disabled={isLoading}
            className={
              validationErrors.password ? "border-destructive pr-10" : "pr-10"
            }
            data-testid="password-input"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {validationErrors.password && (
          <div className="flex items-center space-x-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{validationErrors.password}</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md"
          data-testid="error-message"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        data-testid="login-button"
      >
        {isLoading ? (
          <>
            <div
              data-testid="loading-spinner"
              className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
            />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      {/* Navigation Links */}
      <div className="text-center space-y-2">
        <a
          href="/auth/register"
          data-testid="register-link"
          className="text-sm text-blue-600 hover:underline"
        >
          Don't have an account? Register here
        </a>
        <br />
        <a
          href="/auth/forgot-password"
          data-testid="forgot-password-link"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot your password?
        </a>
      </div>
    </form>
  );
}
