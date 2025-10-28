"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function RegisterForm({
  onSubmit,
  isLoading = false,
  error,
}: RegisterFormProps) {
  const [formData, setFormData] = React.useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

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

    // Terms acceptance validation
    if (!formData.acceptTerms) {
      errors.acceptTerms = "You must accept the terms and conditions";
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
    field: keyof RegisterFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            disabled={isLoading}
            className={validationErrors.firstName ? "border-destructive" : ""}
          />
          {validationErrors.firstName && (
            <div className="flex items-center space-x-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{validationErrors.firstName}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            disabled={isLoading}
            className={validationErrors.lastName ? "border-destructive" : ""}
          />
          {validationErrors.lastName && (
            <div className="flex items-center space-x-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{validationErrors.lastName}</span>
            </div>
          )}
        </div>
      </div>

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
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
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

      {/* Terms Acceptance */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="acceptTerms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked) =>
            handleInputChange("acceptTerms", checked as boolean)
          }
          disabled={isLoading}
          className={validationErrors.acceptTerms ? "border-destructive" : ""}
        />
        <div className="space-y-1">
          <Label htmlFor="acceptTerms" className="text-sm">
            I agree to the{" "}
            <a
              href="/terms"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </Label>
          {validationErrors.acceptTerms && (
            <div className="flex items-center space-x-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{validationErrors.acceptTerms}</span>
            </div>
          )}
        </div>
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
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
