"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Default error fallback component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg border p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Coś poszło nie tak
        </h2>
        <p className="text-gray-600 mb-6">
          Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę lub skontaktuj
          się z pomocą techniczną.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="rounded-md bg-gray-100 p-3 mb-4 text-left">
            <p className="text-sm font-mono text-gray-800">
              <strong>Error:</strong> {error.message}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  Stack Trace
                </summary>
                <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <Button onClick={resetError} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Spróbuj ponownie
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            Strona główna
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Page-specific error fallback for boats
const BoatsErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => (
  <div className="flex items-center justify-center p-8">
    <div className="w-full max-w-lg bg-white rounded-lg shadow-lg border p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <AlertCircle className="h-6 w-6 text-orange-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Błąd ładowania łodzi</h2>
        <p className="text-gray-600 mb-4">
          Nie udało się załadować listy łodzi. Sprawdź połączenie internetowe i
          spróbuj ponownie.
        </p>
        <Button onClick={resetError} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Odśwież listę
        </Button>
      </div>
    </div>
  </div>
);

// Admin-specific error fallback
const AdminErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => (
  <div className="flex items-center justify-center p-8">
    <div className="w-full max-w-lg bg-white rounded-lg shadow-lg border p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">
          Błąd panelu administracyjnego
        </h2>
        <p className="text-gray-600 mb-4">
          Wystąpił błąd w panelu administracyjnym. Sprawdź uprawnienia i spróbuj
          ponownie.
        </p>
        <Button onClick={resetError} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Odśwież panel
        </Button>
      </div>
    </div>
  </div>
);

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to a monitoring service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to Sentry, LogRocket, or custom logging service
      // logErrorToService(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// Pre-configured error boundaries for different contexts
export const BoatsErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children,
}) => <ErrorBoundary fallback={BoatsErrorFallback}>{children}</ErrorBoundary>;

export const AdminErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children,
}) => <ErrorBoundary fallback={AdminErrorFallback}>{children}</ErrorBoundary>;

// HOC for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorFallbackProps>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}
