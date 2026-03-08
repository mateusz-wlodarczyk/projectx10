"use client";

import React from "react";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import WeeklyPriceChart from "@/src/components/dashboard/WeeklyPriceChart";
import DiscountChart from "@/src/components/dashboard/DiscountChart";
import { useDashboardPage } from "@/src/hooks/useDashboardPage";
import {
  DashboardLoadingState,
  DashboardErrorState,
} from "@/src/components/dashboard/DashboardStates";
import AuthGuard from "@/src/components/auth/AuthGuard";
import { devLog } from "@/src/lib/devLog";

const DashboardPage: React.FC = () => {
  const {
    summary,
    priceData,
    discountData,
    loading,
    error,
    lastRefresh,
    timeRange,
    selectedWeek,
    isLoading,
    hasError,
    handleWeekChange,
    handleTimeRangeChange,
  } = useDashboardPage();

  devLog("=== DASHBOARD PAGE: BACKEND DATA ===", { summary, priceData, discountData, loading, error, lastRefresh, timeRange, selectedWeek, isLoading, hasError });
  devLog("=== END DASHBOARD PAGE DATA ===");

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  if (hasError) {
    return <DashboardErrorState error={error!} />;
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
            <h1
              className="text-2xl font-bold text-gray-900 mb-2"
              data-testid="welcome-message"
            >
              Welcome back!
            </h1>
            <p className="text-gray-600">
              Here's your dashboard overview with the latest analytics and
              insights.
            </p>
          </div>

          {/* Dashboard Header */}
          <DashboardHeader summary={summary!} loading={loading} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Price Chart */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Trendy cen tygodniowych
              </h2>
              <WeeklyPriceChart
                priceData={priceData!}
                selectedWeek={selectedWeek}
                onWeekChange={handleWeekChange}
                loading={loading}
                error={error}
              />
            </div>

            {/* Discount Chart */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Trendy rabatów</h2>
              <DiscountChart
                discountData={discountData!}
                timeRange={timeRange}
                onTimeRangeChange={handleTimeRangeChange}
                loading={loading}
                error={error}
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center text-sm text-gray-500 py-4">
            {lastRefresh && (
              <p>
                Ostatnia aktualizacja: {lastRefresh.toLocaleString("pl-PL")} |
                Okres: {timeRange}
              </p>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
};

export default DashboardPage;
