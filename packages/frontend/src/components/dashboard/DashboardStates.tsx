import React from "react";
import Link from "next/link";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import {
  PageLoadingState,
  PageErrorState,
} from "@/src/components/common/LoadingStates";
import { BACKEND_URL } from "@/src/config/urls";

interface DashboardLoadingStateProps {
  message?: string;
}

export const DashboardLoadingState: React.FC<DashboardLoadingStateProps> = ({
  message = "Ładowanie danych z serwera...",
}) => (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-32 bg-gray-200 rounded animate-pulse"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-64 bg-gray-200 rounded animate-pulse"
          ></div>
        ))}
      </div>
      <div className="text-center text-sm text-gray-500 py-4">
        <p>{message}</p>
        <p className="mt-2">
          Jeśli strona się nie ładuje, sprawdź połączenie z backendem
        </p>
      </div>
    </div>
  </DashboardLayout>
);

interface DashboardErrorStateProps {
  error: string;
}

const supabaseCheckUrl = `${BACKEND_URL}/dashboard/supabase-check`;

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({
  error,
}) => (
  <DashboardLayout>
    <div className="space-y-4">
      <PageErrorState error={error} onRetry={() => window.location.reload()} />
      <p className="text-center text-sm text-gray-500">
        Sprawdź odpowiedź Supabase:{" "}
        <Link
          href={supabaseCheckUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {supabaseCheckUrl}
        </Link>
      </p>
    </div>
  </DashboardLayout>
);
