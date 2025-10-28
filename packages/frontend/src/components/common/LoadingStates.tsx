import React from "react";
import { RefreshCw } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

/**
 * Standardized loading state component
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  className = "min-h-[400px]",
}) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="text-center space-y-4">
      <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/**
 * Standardized error state component
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  retryLabel = "Try Again",
  className = "min-h-[400px]",
}) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="text-center">
      <div className="text-red-600 mb-4 text-xl">Error Loading Content</div>
      <div className="text-gray-600 mb-4">{error}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {retryLabel}
        </button>
      )}
    </div>
  </div>
);

interface EmptyStateProps {
  message: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Standardized empty state component
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  action,
  className = "min-h-[400px]",
}) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="text-center space-y-4">
      <p className="text-gray-600">{message}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {action}
    </div>
  </div>
);

/**
 * Page-level loading state with consistent styling
 */
export const PageLoadingState: React.FC<{ message?: string }> = ({
  message = "Loading page...",
}) => <LoadingState message={message} className="min-h-[60vh]" />;

/**
 * Page-level error state with consistent styling
 */
export const PageErrorState: React.FC<{
  error: string;
  onRetry?: () => void;
}> = ({ error, onRetry }) => (
  <ErrorState error={error} onRetry={onRetry} className="min-h-[60vh]" />
);
