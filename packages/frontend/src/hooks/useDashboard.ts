import { useState, useEffect, useCallback, useRef } from "react";
import { API_ENDPOINTS } from "../config/urls";
import {
  DashboardSummary,
  KeyMetric,
  WeeklyPriceData,
  DiscountChartData,
  AvailabilityData,
  RevenueData,
  SummaryStat,
  UseDashboardReturn,
  UseDashboardMetricsReturn,
  UseDashboardChartsReturn,
  UseDashboardRefreshReturn,
  DashboardSummaryRequest,
  DashboardMetricsRequest,
  PriceTrendsRequest,
  DiscountTrendsRequest,
  AvailabilityRequest,
  RevenueRequest,
  DashboardStatsRequest,
} from "../types/dashboard";

export const useDashboard = (
  boatType: string = "catamaran"
): UseDashboardReturn => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [metrics, setMetrics] = useState<KeyMetric[]>([]);
  const [priceData, setPriceData] = useState<WeeklyPriceData | null>(null);
  const [discountData, setDiscountData] = useState<DiscountChartData | null>(
    null
  );
  const [availabilityData, setAvailabilityData] =
    useState<AvailabilityData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [summaryStats, setSummaryStats] = useState<SummaryStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Use refs to track AbortControllers for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDashboardSummary =
    useCallback(async (): Promise<DashboardSummary | null> => {
      try {
        console.log(
          "[useDashboard] Fetching dashboard summary for boatType:",
          boatType
        );
        const params = new URLSearchParams({
          boat_type: boatType,
        });

        const url = `${API_ENDPOINTS.DASHBOARD.SUMMARY}?${params}`;
        console.log("[useDashboard] Making request to:", url);
        console.log("[useDashboard] Full URL:", url);
        console.log(
          "[useDashboard] API_ENDPOINTS.DASHBOARD.SUMMARY:",
          API_ENDPOINTS.DASHBOARD.SUMMARY
        );

        const controller = new AbortController();
        abortControllerRef.current = controller;
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        console.log("[useDashboard] About to make fetch request...");
        const response = await fetch(url, { signal: controller.signal });
        console.log("[useDashboard] Fetch request completed");

        clearTimeout(timeoutId);

        console.log(
          "[useDashboard] Response status:",
          response.status,
          response.statusText
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[useDashboard] Error response body:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("[useDashboard] Dashboard summary data received:", data);
        return data.summary;
      } catch (error) {
        // Only log error if it's not an abort error
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(
            "[useDashboard] Error fetching dashboard summary:",
            error
          );
        }
        throw error;
      }
    }, [boatType]);

  const fetchKeyMetrics = useCallback(async (): Promise<KeyMetric[]> => {
    try {
      const params = new URLSearchParams({
        boat_type: boatType,
        period: "month",
      });

      const controller = new AbortController();
      abortControllerRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(
        `${API_ENDPOINTS.DASHBOARD.METRICS}?${params}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.metrics || [];
    } catch (error) {
      // Only log error if it's not an abort error
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error fetching key metrics:", error);
      }
      throw error;
    }
  }, [boatType]);

  const fetchPriceTrends =
    useCallback(async (): Promise<WeeklyPriceData | null> => {
      try {
        const params = new URLSearchParams({
          boat_type: boatType,
          year: new Date().getFullYear().toString(),
        });

        const response = await fetch(
          `${API_ENDPOINTS.DASHBOARD.PRICE_TRENDS}?${params}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.priceData;
      } catch (error) {
        console.error("Error fetching price trends:", error);
        throw error;
      }
    }, [boatType]);

  const fetchDiscountTrends = useCallback(
    async (timeRange: string = "month"): Promise<DiscountChartData | null> => {
      try {
        const params = new URLSearchParams({
          boat_type: boatType,
          time_range: timeRange,
        });

        const response = await fetch(
          `${API_ENDPOINTS.DASHBOARD.DISCOUNT_TRENDS}?${params}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.discountData;
      } catch (error) {
        console.error("Error fetching discount trends:", error);
        throw error;
      }
    },
    [boatType]
  );

  const fetchAvailabilityTrends =
    useCallback(async (): Promise<AvailabilityData | null> => {
      try {
        const params = new URLSearchParams({
          boat_type: boatType,
          time_range: "month",
        });

        const response = await fetch(
          `${API_ENDPOINTS.DASHBOARD.AVAILABILITY}?${params}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.availabilityData;
      } catch (error) {
        console.error("Error fetching availability trends:", error);
        throw error;
      }
    }, [boatType]);

  const fetchRevenueTrends =
    useCallback(async (): Promise<RevenueData | null> => {
      try {
        const params = new URLSearchParams({
          boat_type: boatType,
          time_range: "month",
        });

        const response = await fetch(
          `${API_ENDPOINTS.DASHBOARD.REVENUE}?${params}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.revenueData;
      } catch (error) {
        console.error("Error fetching revenue trends:", error);
        throw error;
      }
    }, [boatType]);

  const fetchSummaryStats = useCallback(async (): Promise<SummaryStat[]> => {
    try {
      const params = new URLSearchParams({
        boat_type: boatType,
        limit: "10",
      });

      const response = await fetch(
        `${API_ENDPOINTS.DASHBOARD.STATS}?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.stats || [];
    } catch (error) {
      console.error("Error fetching summary stats:", error);
      throw error;
    }
  }, [boatType]);

  const refresh = useCallback(async () => {
    console.log("[useDashboard] Starting refresh...");
    setLoading(true);
    setError(null);

    try {
      console.log("[useDashboard] Calling all fetch functions...");
      const results = await Promise.allSettled([
        fetchDashboardSummary(),
        fetchKeyMetrics(),
        fetchPriceTrends(),
        fetchDiscountTrends(),
        fetchAvailabilityTrends(),
        fetchRevenueTrends(),
        fetchSummaryStats(),
      ]);

      console.log("[useDashboard] All fetch results:", results);

      // Process results and handle partial failures
      const [
        summaryResult,
        metricsResult,
        priceResult,
        discountResult,
        availabilityResult,
        revenueResult,
        summaryStatsResult,
      ] = results;

      // Set data for successful requests
      if (summaryResult.status === "fulfilled") {
        setSummary(summaryResult.value);
      }
      if (metricsResult.status === "fulfilled") {
        setMetrics(metricsResult.value);
      }
      if (priceResult.status === "fulfilled") {
        setPriceData(priceResult.value);
      }
      if (discountResult.status === "fulfilled") {
        setDiscountData(discountResult.value);
      }
      if (availabilityResult.status === "fulfilled") {
        setAvailabilityData(availabilityResult.value);
      }
      if (revenueResult.status === "fulfilled") {
        setRevenueData(revenueResult.value);
      }
      if (summaryStatsResult.status === "fulfilled") {
        setSummaryStats(summaryStatsResult.value);
      }

      // Check if any requests failed and set error (excluding AbortErrors)
      const failedResults = results.filter(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected" &&
          !(
            result.reason instanceof Error &&
            result.reason.name === "AbortError"
          )
      );
      if (failedResults.length > 0) {
        const firstError = failedResults[0].reason;
        setError(
          firstError instanceof Error
            ? firstError.message
            : "Some dashboard data failed to load"
        );
      }

      setLastRefresh(new Date());
    } catch (error) {
      // Only set error if it's not an AbortError
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error refreshing dashboard data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to refresh dashboard data"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [boatType]);

  useEffect(() => {
    console.log("[useDashboard] useEffect triggered, calling refresh...");
    refresh();

    // Cleanup function to abort any pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [refresh]);

  const refreshDiscountData = useCallback(
    async (timeRange: string) => {
      try {
        const newDiscountData = await fetchDiscountTrends(timeRange);
        setDiscountData(newDiscountData);
      } catch (error) {
        console.error("Error refreshing discount data:", error);
      }
    },
    [fetchDiscountTrends]
  );

  return {
    summary,
    metrics,
    priceData,
    discountData,
    availabilityData,
    revenueData,
    summaryStats,
    loading,
    error,
    lastRefresh,
    refresh,
    refreshDiscountData,
  };
};

export const useDashboardMetrics = (
  boatType: string = "catamaran",
  period: string = "month"
): UseDashboardMetricsReturn => {
  const [metrics, setMetrics] = useState<KeyMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        boat_type: boatType,
        period: period,
      });

      const response = await fetch(
        `${API_ENDPOINTS.DASHBOARD.METRICS}?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMetrics(data.metrics || []);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch metrics"
      );
    } finally {
      setLoading(false);
    }
  }, [boatType, period]);

  const refresh = useCallback(async () => {
    await fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refresh,
  };
};

export const useDashboardCharts = (
  boatType: string = "catamaran",
  timeRange: string = "month"
): UseDashboardChartsReturn => {
  const [priceData, setPriceData] = useState<WeeklyPriceData | null>(null);
  const [discountData, setDiscountData] = useState<DiscountChartData | null>(
    null
  );
  const [availabilityData, setAvailabilityData] =
    useState<AvailabilityData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        priceDataResult,
        discountDataResult,
        availabilityDataResult,
        revenueDataResult,
      ] = await Promise.all([
        fetch(
          `${API_ENDPOINTS.DASHBOARD.PRICE_TRENDS}?boat_type=${boatType}&year=${new Date().getFullYear()}`
        )
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => data?.priceData || null),
        fetch(
          `${API_ENDPOINTS.DASHBOARD.DISCOUNT_TRENDS}?boat_type=${boatType}&time_range=${timeRange}`
        )
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => data?.discountData || null),
        fetch(
          `${API_ENDPOINTS.DASHBOARD.AVAILABILITY}?boat_type=${boatType}&time_range=${timeRange}`
        )
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => data?.availabilityData || null),
        fetch(
          `${API_ENDPOINTS.DASHBOARD.REVENUE}?boat_type=${boatType}&time_range=${timeRange}`
        )
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => data?.revenueData || null),
      ]);

      setPriceData(priceDataResult);
      setDiscountData(discountDataResult);
      setAvailabilityData(availabilityDataResult);
      setRevenueData(revenueDataResult);
    } catch (error) {
      console.error("Error fetching charts:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch charts"
      );
    } finally {
      setLoading(false);
    }
  }, [boatType, timeRange]);

  const refresh = useCallback(async () => {
    await fetchCharts();
  }, [fetchCharts]);

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  return {
    priceData,
    discountData,
    availabilityData,
    revenueData,
    loading,
    error,
    refresh,
  };
};

export const useDashboardRefresh = (): UseDashboardRefreshReturn => {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return {
    lastRefresh,
    isRefreshing,
    refresh,
  };
};
