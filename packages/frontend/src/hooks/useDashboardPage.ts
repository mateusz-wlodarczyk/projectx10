import { useState, useCallback, useMemo } from "react";
import { useDashboard } from "@/src/hooks/useDashboard";

export const useDashboardPage = () => {
  const [timeRange, setTimeRange] = useState<string>("month");
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  console.log("=== USEDASHBOARDPAGE: CALLING USEDASHBOARD ===");
  const dashboardData = useDashboard("catamaran");
  console.log("=== USEDASHBOARDPAGE: DASHBOARD DATA RECEIVED ===");
  console.log("DashboardData:", dashboardData);
  console.log("DashboardData.loading:", dashboardData.loading);
  console.log("DashboardData.summary:", dashboardData.summary);
  console.log("DashboardData.error:", dashboardData.error);
  console.log("=== END USEDASHBOARDPAGE DATA ===");

  const handleWeekChange = useCallback((week: number) => {
    setSelectedWeek(week);
  }, []);

  const handleTimeRangeChange = useCallback(
    (range: string) => {
      setTimeRange(range);
      dashboardData.refreshDiscountData(range);
    },
    [dashboardData]
  );

  const isLoading = dashboardData.loading && !dashboardData.summary;
  const hasError = dashboardData.error && !dashboardData.summary;

  return {
    // Data
    summary: dashboardData.summary,
    priceData: dashboardData.priceData,
    discountData: dashboardData.discountData,
    loading: dashboardData.loading,
    error: dashboardData.error,
    lastRefresh: dashboardData.lastRefresh,
    timeRange,
    selectedWeek,

    // State flags
    isLoading,
    hasError,

    // Actions
    handleWeekChange,
    handleTimeRangeChange,
  };
};
