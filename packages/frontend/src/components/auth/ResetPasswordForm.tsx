"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
  token: string;
}

interface ResetPasswordFormProps {
  onSubmit?: (data: ResetPasswordFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  token?: string;
}

export default function ResetPasswordForm({
  onSubmit,
  isLoading = false,
  error,
  token,
}: ResetPasswordFormProps) {
  const [formData, setFormData] = React.useState<ResetPasswordFormData>({
    password: "",
    confirmPassword: "",
    token: token || "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<
    Partial<ResetPasswordFormData>
  >({});

  const validateForm = (): boolean => {
    const errors: Partial<ResetPasswordFormData> = {};

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        formData.password
      )
    ) {
      errors.password =
        "Password must contain uppercase, lowercase, number, and special character";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  const handleInputChange = (
    field: keyof ResetPasswordFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            disabled={isLoading}
            className={
              validationErrors.password ? "border-destructive pr-10" : "pr-10"
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
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

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            disabled={isLoading}
            className={
              validationErrors.confirmPassword
                ? "border-destructive pr-10"
                : "pr-10"
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {validationErrors.confirmPassword && (
          <div className="flex items-center space-x-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{validationErrors.confirmPassword}</span>
          </div>
        )}
      </div>

      {/* Password Requirements */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">Password requirements:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>At least 8 characters long</li>
          <li>Contains uppercase and lowercase letters</li>
          <li>Contains at least one number</li>
          <li>Contains at least one special character (@$!%*?&)</li>
        </ul>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Resetting password..." : "Reset password"}
      </Button>
    </form>
  );
}
