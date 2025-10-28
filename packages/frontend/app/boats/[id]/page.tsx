"use client";

import React from "react";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import { useAuth } from "@/src/components/auth/AuthProvider";
import AuthGuard from "@/src/components/auth/AuthGuard";
import { createDashboardUser } from "@/src/lib/user-utils";
import { useBoatDetailPage } from "@/src/hooks/useBoatDetailPage";
import BoatDetailHeader from "@/src/components/boats/BoatDetailHeader";
import BoatBasicInfo from "@/src/components/boats/BoatBasicInfo";
import BoatParameters from "@/src/components/boats/BoatParameters";
import WeeklyPriceChart from "@/src/components/boats/WeeklyPriceChart";
import DiscountChart from "@/src/components/boats/DiscountChart";
import {
  BoatDetailLoadingState,
  BoatDetailErrorState,
  BoatDetailEmptyState,
} from "@/src/components/boats/BoatDetailStates";

export default function BoatDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuth();
  const slug = params.id;

  const {
    boatDetails,
    availabilityData,
    loading,
    error,
    chartData,
    selectedWeek,
    selectedTimeRange,
    setSelectedWeek,
    setSelectedTimeRange,
    refreshData,
    hasData,
    hasChartData,
    handleBack,
  } = useBoatDetailPage({ slug });

  const currentUser = createDashboardUser(user);

  // Show loading state
  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout user={currentUser} currentPath="/boats">
          <BoatDetailLoadingState />
        </DashboardLayout>
      </AuthGuard>
    );
  }

  // Show error state
  if (error) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout user={currentUser} currentPath="/boats">
          <BoatDetailErrorState error={error} onRetry={refreshData} />
        </DashboardLayout>
      </AuthGuard>
    );
  }

  // Show no data state
  if (!hasData) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout user={currentUser} currentPath="/boats">
          <BoatDetailEmptyState slug={slug} onBack={handleBack} />
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout user={currentUser} currentPath="/boats">
        <div className="space-y-6">
          {/* Header */}
          <BoatDetailHeader
            boat={boatDetails!}
            onBack={handleBack}
            loading={loading}
          />

          {/* Two Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Boat Details */}
            <div className="space-y-6">
              {/* Basic Info */}
              <BoatBasicInfo boat={boatDetails!} loading={loading} />

              {/* Parameters */}
              {boatDetails?.parameters && (
                <BoatParameters
                  parameters={boatDetails.parameters}
                  loading={loading}
                />
              )}
            </div>

            {/* Right Panel - Charts */}
            <div className="space-y-6">
              {hasChartData && (
                <>
                  {/* Price Chart */}
                  <WeeklyPriceChart
                    priceData={chartData.priceChart!}
                    selectedWeek={selectedWeek || 1}
                    onWeekChange={setSelectedWeek}
                    loading={loading}
                    error={error}
                  />

                  {/* Discount Chart */}
                  <DiscountChart
                    discountData={chartData.discountChart!}
                    timeRange={selectedTimeRange}
                    onTimeRangeChange={setSelectedTimeRange}
                    loading={loading}
                    error={error}
                  />
                </>
              )}

              {!hasChartData && (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">Brak danych cenowych</div>
                  <div className="text-sm text-gray-400">
                    Nie znaleziono danych o cenach i rabatach dla tej łodzi
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
