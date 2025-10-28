import { useState, useCallback } from "react";
import { AuthService } from "@/src/lib/AuthService";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.handleLogin(credentials.email, credentials.password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    handleLogin,
    isLoading,
    error,
    clearError,
  };
};
