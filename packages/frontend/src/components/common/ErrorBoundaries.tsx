import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Default error fallback component for error boundaries
 */
export const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div className="min-h-[400px] flex items-center justify-center p-4">
    <div className="max-w-md mx-auto">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Something went wrong</h3>
              <p className="text-sm mt-1">
                An unexpected error occurred. Please try refreshing the page.
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              <details>
                <summary className="cursor-pointer">Error details</summary>
                <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
              </details>
            </div>
            <Button 
              onClick={resetErrorBoundary}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  </div>
);

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Page-level error boundary with consistent error handling
 */
export const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({ 
  children, 
  fallback: FallbackComponent = DefaultErrorFallback,
  onError 
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Page Error:', error, errorInfo);
    onError?.(error, errorInfo);
    // Here you could send to error reporting service
  };

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * Component-level error boundary for smaller components
 */
export const ComponentErrorBoundary: React.FC<PageErrorBoundaryProps> = ({ 
  children, 
  fallback: FallbackComponent = DefaultErrorFallback,
  onError 
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Component Error:', error, errorInfo);
    onError?.(error, errorInfo);
  };

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};
