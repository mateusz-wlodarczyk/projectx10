"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mail } from "lucide-react";

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordFormProps {
  onSubmit?: (data: ForgotPasswordFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  success?: boolean;
}

export default function ForgotPasswordForm({ 
  onSubmit, 
  isLoading = false, 
  error, 
  success = false 
}: ForgotPasswordFormProps) {
  const [formData, setFormData] = React.useState<ForgotPasswordFormData>({
    email: "",
  });
  const [validationErrors, setValidationErrors] = React.useState<Partial<ForgotPasswordFormData>>({});

  const validateForm = (): boolean => {
    const errors: Partial<ForgotPasswordFormData> = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
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

  const handleInputChange = (field: keyof ForgotPasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Check your email</h3>
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to <strong>{formData.email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your inbox and follow the instructions to reset your password.
            </p>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Didn't receive the email? Check your spam folder or{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm"
            onClick={() => window.location.reload()}
          >
            try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
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

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending reset link..." : "Send reset link"}
      </Button>

      {/* Help Text */}
      <div className="text-center text-sm text-muted-foreground">
        Enter the email address associated with your account and we'll send you a link to reset your password.
      </div>
    </form>
  );
}
