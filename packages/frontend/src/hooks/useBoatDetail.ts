import { useState, useEffect, useCallback, useMemo } from "react";
import {
  SingleBoatDetails,
  WeekData,
  BoatDetailData,
  PriceChartData,
  DiscountChartData,
  AvailabilityTimelineData,
  ChartDataPoint,
} from "../types/boat-detail";

// API base URL
const API_BASE_URL = "http://localhost:8080";

// Custom hook for boat detail data management
export const useBoatDetail = (slug: string) => {
  const [data, setData] = useState<BoatDetailData>({
    boatDetails: null,
    availabilityData: null,
    loading: true,
    error: null,
  });

  const [chartData, setChartData] = useState<{
    priceChart: PriceChartData | null;
    discountChart: DiscountChartData | null;
    timelineData: AvailabilityTimelineData | null;
  }>({
    priceChart: null,
    discountChart: null,
    timelineData: null,
  });

  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("all");

  // Fetch boat details from boats_list table
  const fetchBoatDetails = useCallback(
    async (boatSlug: string): Promise<SingleBoatDetails | null> => {
      try {
        console.log(`Fetching boat details for slug: ${boatSlug}`);
        const response = await fetch(
          `${API_BASE_URL}/boat/details/${boatSlug}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch boat details: ${response.statusText}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch boat details");
        }

        console.log(`Boat details fetched successfully for ${boatSlug}`);
        return result.data;
      } catch (error) {
        console.error(`Error fetching boat details for ${boatSlug}:`, error);
        throw error;
      }
    },
    []
  );

  // Fetch availability data from boat_availability_2025 table
  const fetchAvailabilityData = useCallback(
    async (boatSlug: string): Promise<WeekData | null> => {
      try {
        console.log(`Fetching availability data for slug: ${boatSlug}`);
        const response = await fetch(
          `${API_BASE_URL}/boat/availability/${boatSlug}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch availability data: ${response.statusText}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to fetch availability data"
          );
        }

        console.log(`Availability data fetched successfully for ${boatSlug}`);
        return result.data;
      } catch (error) {
        console.error(
          `Error fetching availability data for ${boatSlug}:`,
          error
        );
        throw error;
      }
    },
    []
  );

  // Fetch specific week data
  const fetchWeekData = useCallback(
    async (boatSlug: string, week: number): Promise<any> => {
      try {
        console.log(`Fetching week ${week} data for slug: ${boatSlug}`);
        const response = await fetch(
          `${API_BASE_URL}/boat/availability/${boatSlug}/week/${week}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch week ${week} data: ${response.statusText}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || `Failed to fetch week ${week} data`
          );
        }

        console.log(`Week ${week} data fetched successfully for ${boatSlug}`);
        return result.data;
      } catch (error) {
        console.error(
          `Error fetching week ${week} data for ${boatSlug}:`,
          error
        );
        throw error;
      }
    },
    []
  );

  // Process availability data into chart-friendly format
  const processChartData = useCallback(
    (
      availabilityData: WeekData
    ): {
      priceChart: PriceChartData;
      discountChart: DiscountChartData;
      timelineData: AvailabilityTimelineData;
    } => {
      const chartDataPoints: ChartDataPoint[] = [];
      const weeksWithData: number[] = [];

      // Process all weeks with data
      for (let week = 1; week <= 53; week++) {
        const weekKey = `week_${week}` as keyof WeekData;
        const weekData = availabilityData[weekKey];

        if (weekData && typeof weekData === "object") {
          weeksWithData.push(week);

          // Process each timestamp in the week
          Object.entries(weekData).forEach(([timestamp, priceData]) => {
            if (
              priceData &&
              typeof priceData === "object" &&
              "price" in priceData &&
              "discount" in priceData
            ) {
              const date = new Date(timestamp);
              const chartPoint: ChartDataPoint = {
                week,
                date: timestamp,
                price: priceData.price,
                discount: priceData.discount,
                timestamp,
                dayOfWeek: date.toLocaleDateString("en-US", {
                  weekday: "short",
                }),
                month: date.toLocaleDateString("en-US", { month: "short" }),
                year: date.getFullYear(),
              };
              chartDataPoints.push(chartPoint);
            }
          });
        }
      }

      // Sort by timestamp
      chartDataPoints.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      // Calculate price statistics
      const prices = chartDataPoints.map((point) => point.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice =
        prices.reduce((sum, price) => sum + price, 0) / prices.length;

      // Calculate price trends
      const firstPrice = prices[0];
      const lastPrice = prices[prices.length - 1];
      const changePercentage = firstPrice
        ? ((lastPrice - firstPrice) / firstPrice) * 100
        : 0;

      // Calculate discount statistics
      const discounts = chartDataPoints.map((point) => point.discount);
      const avgDiscount =
        discounts.reduce((sum, discount) => sum + discount, 0) /
        discounts.length;
      const maxDiscount = Math.max(...discounts);
      const minDiscount = Math.min(...discounts);

      // Calculate discount trends
      const firstDiscount = discounts[0];
      const lastDiscount = discounts[discounts.length - 1];
      const discountChangePercentage = firstDiscount
        ? ((lastDiscount - firstDiscount) / firstDiscount) * 100
        : 0;

      // Create price chart data
      const priceChart: PriceChartData = {
        weeks: chartDataPoints,
        minPrice,
        maxPrice,
        avgPrice,
        totalDataPoints: chartDataPoints.length,
        priceRange: { min: minPrice, max: maxPrice },
        trends: {
          isIncreasing: changePercentage > 5,
          isDecreasing: changePercentage < -5,
          isStable: Math.abs(changePercentage) <= 5,
          changePercentage,
        },
      };

      // Create discount chart data
      const discountChart: DiscountChartData = {
        dataPoints: chartDataPoints,
        avgDiscount,
        maxDiscount,
        minDiscount,
        totalDataPoints: chartDataPoints.length,
        discountRange: { min: minDiscount, max: maxDiscount },
        trends: {
          isIncreasing: discountChangePercentage > 5,
          isDecreasing: discountChangePercentage < -5,
          isStable: Math.abs(discountChangePercentage) <= 5,
          changePercentage: discountChangePercentage,
        },
      };

      // Create availability timeline data
      const availabilityPeriods = weeksWithData.map((week) => {
        const weekDataPoints = chartDataPoints.filter(
          (point) => point.week === week
        );
        const weekPrices = weekDataPoints.map((point) => point.price);
        const avgPrice =
          weekPrices.reduce((sum, price) => sum + price, 0) / weekPrices.length;
        const avgDiscount =
          weekDataPoints.reduce((sum, point) => sum + point.discount, 0) /
          weekDataPoints.length;

        return {
          startWeek: week,
          endWeek: week,
          avgPrice,
          avgDiscount,
          dataPoints: weekDataPoints.length,
          dateRange: {
            start: weekDataPoints[0]?.timestamp || "",
            end: weekDataPoints[weekDataPoints.length - 1]?.timestamp || "",
          },
          priceVariation: {
            min: Math.min(...weekPrices),
            max: Math.max(...weekPrices),
            stdDev:
              weekPrices.length > 1
                ? Math.sqrt(
                    weekPrices.reduce(
                      (sum, price) => sum + Math.pow(price - avgPrice, 2),
                      0
                    ) / weekPrices.length
                  )
                : 0,
          },
        };
      });

      const timelineData: AvailabilityTimelineData = {
        timeline: chartDataPoints,
        availabilityPeriods,
        totalWeeks: 53,
        weeksWithData: weeksWithData.length,
        dataCoverage: (weeksWithData.length / 53) * 100,
      };

      return {
        priceChart,
        discountChart,
        timelineData,
      };
    },
    []
  );

  // Filter data based on time range
  const filterDataByTimeRange = useCallback(
    (data: ChartDataPoint[], timeRange: string): ChartDataPoint[] => {
      if (timeRange === "all") return data;

      const now = new Date();
      const filterDate = new Date();

      switch (timeRange) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          return data;
      }

      return data.filter((point) => new Date(point.timestamp) >= filterDate);
    },
    []
  );

  // Load boat data
  const loadBoatData = useCallback(
    async (boatSlug: string) => {
      if (!boatSlug) return;

      setData((prev) => ({ ...prev, loading: true, error: null }));

      try {
        console.log(`Loading boat data for slug: ${boatSlug}`);

        // Fetch boat details and availability data in parallel
        const [boatDetails, availabilityData] = await Promise.all([
          fetchBoatDetails(boatSlug),
          fetchAvailabilityData(boatSlug),
        ]);

        setData({
          boatDetails,
          availabilityData,
          loading: false,
          error: null,
        });

        // Process chart data if availability data exists
        if (availabilityData) {
          const processedChartData = processChartData(availabilityData);
          setChartData(processedChartData);

          // Set default selected week to first week with data
          if (processedChartData.timelineData.availabilityPeriods.length > 0) {
            setSelectedWeek(
              processedChartData.timelineData.availabilityPeriods[0].startWeek
            );
          }
        }

        console.log(`Boat data loaded successfully for ${boatSlug}`);
      } catch (error) {
        console.error(`Error loading boat data for ${boatSlug}:`, error);
        setData((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : "Failed to load boat data",
        }));
      }
    },
    [fetchBoatDetails, fetchAvailabilityData, processChartData]
  );

  // Refresh data
  const refreshData = useCallback(() => {
    if (slug) {
      loadBoatData(slug);
    }
  }, [slug, loadBoatData]);

  // Load data when slug changes
  useEffect(() => {
    if (slug) {
      loadBoatData(slug);
    }
  }, [slug, loadBoatData]);

  // Filter chart data based on selected time range
  const filteredChartData = useMemo(() => {
    if (!chartData.priceChart) return chartData;

    const filteredPriceData = filterDataByTimeRange(
      chartData.priceChart.weeks,
      selectedTimeRange
    );
    const filteredDiscountData = filterDataByTimeRange(
      chartData.discountChart?.dataPoints || [],
      selectedTimeRange
    );

    return {
      priceChart: {
        ...chartData.priceChart,
        weeks: filteredPriceData,
        totalDataPoints: filteredPriceData.length,
      },
      discountChart: {
        ...chartData.discountChart!,
        dataPoints: filteredDiscountData,
        totalDataPoints: filteredDiscountData.length,
      },
      timelineData: {
        ...chartData.timelineData!,
        timeline: filteredPriceData,
      },
    };
  }, [chartData, selectedTimeRange, filterDataByTimeRange]);

  return {
    // Data
    boatDetails: data.boatDetails,
    availabilityData: data.availabilityData,
    loading: data.loading,
    error: data.error,

    // Chart data
    chartData: filteredChartData,
    selectedWeek,
    selectedTimeRange,

    // Actions
    setSelectedWeek,
    setSelectedTimeRange,
    refreshData,
    fetchWeekData,

    // Computed values
    hasData: !!(data.boatDetails && data.availabilityData),
    hasChartData: !!(
      chartData.priceChart &&
      chartData.discountChart &&
      chartData.timelineData
    ),
  };
};

export default useBoatDetail;
