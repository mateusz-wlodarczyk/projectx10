import { useState, useCallback, useMemo } from "react";
import { useDashboard } from "@/src/hooks/useDashboard";
import { devLog } from "@/src/lib/devLog";

export const useDashboardPage = () => {
  const [timeRange, setTimeRange] = useState<string>("month");
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  devLog("=== USEDASHBOARDPAGE: CALLING USEDASHBOARD ===");
  const dashboardData = useDashboard("catamaran");
  devLog("=== USEDASHBOARDPAGE: DASHBOARD DATA RECEIVED ===", dashboardData);
  devLog("=== END USEDASHBOARDPAGE DATA ===");

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
