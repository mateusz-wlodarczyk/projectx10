import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";

interface BoatDetailLoadingStateProps {
  message?: string;
}

export const BoatDetailLoadingState: React.FC<BoatDetailLoadingStateProps> = ({
  message = "Ładowanie szczegółów łodzi...",
}) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center space-y-4">
      <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

interface BoatDetailErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const BoatDetailErrorState: React.FC<BoatDetailErrorStateProps> = ({
  error,
  onRetry,
}) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="max-w-md mx-auto">
      <Alert variant="destructive">
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Błąd ładowania danych łodzi</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={onRetry}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Spróbuj ponownie
            </button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  </div>
);

interface BoatDetailEmptyStateProps {
  slug: string;
  onBack: () => void;
}

export const BoatDetailEmptyState: React.FC<BoatDetailEmptyStateProps> = ({
  slug,
  onBack,
}) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center space-y-4">
      <p className="text-gray-600">Nie znaleziono danych dla tej łodzi</p>
      <p className="text-sm text-gray-500">ID łodzi: {slug}</p>
      <button
        onClick={onBack}
        className="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Wróć do listy łodzi
      </button>
    </div>
  </div>
);
