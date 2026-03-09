import { Controller, Get, Route, Tags, Query, Response } from "tsoa";
import { DashboardService } from "../services/DashboardService";
import { supabaseService } from "../index";
import {
  DashboardSummaryResponse,
  DashboardSummaryRequest,
  DashboardMetricsResponse,
  DashboardMetricsRequest,
  PriceTrendsResponse,
  PriceTrendsRequest,
  DiscountTrendsResponse,
  DiscountTrendsRequest,
  AvailabilityResponse,
  AvailabilityRequest,
  RevenueResponse,
  RevenueRequest,
  DashboardStatsResponse,
  DashboardStatsRequest,
} from "../types/dashboard";

@Route("dashboard")
@Tags("Dashboard")
export class DashboardController extends Controller {
  private dashboardService: DashboardService;

  constructor() {
    super();
    this.dashboardService = new DashboardService(supabaseService);
  }

  /**
   * Get dashboard summary data
   * @param boat_type Boat type filter (default: catamaran)
   * @param date_from Start date for data filtering
   * @param date_to End date for data filtering
   * @returns Dashboard summary with key metrics
   */
  @Get("/summary")
  @Response<DashboardSummaryResponse>(200, "Dashboard summary retrieved successfully")
  @Response<{ error: string; message: string }>(500, "Internal server error")
  public async getDashboardSummary(
    @Query() boat_type?: string,
    @Query() date_from?: string,
    @Query() date_to?: string,
  ): Promise<DashboardSummaryResponse | { error: string; message: string }> {
    try {
      const request: DashboardSummaryRequest = {
        boat_type: boat_type || "catamaran",
        date_from,
        date_to,
      };

      const summary = await this.dashboardService.getDashboardSummary(request.boat_type);

      const response: DashboardSummaryResponse = {
        summary,
        lastUpdate: new Date(),
        dataSource: "boats_list",
      };

      this.setStatus(200);
      return response;
    } catch (error) {
      console.error("Error in getDashboardSummary:", error);
      this.setStatus(200);
      const boatType = boat_type || "catamaran";
      return {
        summary: {
          lastUpdate: new Date(),
          totalBoats: 0,
          boatType,
          totalRevenue: 0,
          averagePrice: 0,
          totalBookings: 0,
          availabilityRate: 0,
        },
        lastUpdate: new Date(),
        dataSource: "boats_list (fallback)",
      };
    }
  }

  /**
   * Get key performance metrics
   * @param boat_type Boat type filter (default: catamaran)
   * @param period Time period for metrics (week, month, quarter, year)
   * @param metrics Specific metrics to retrieve
   * @returns Key performance metrics with trends
   */
  @Get("/metrics")
  @Response<DashboardMetricsResponse>(200, "Metrics retrieved successfully")
  @Response<{ error: string; message: string }>(500, "Internal server error")
  public async getKeyMetrics(
    @Query() boat_type?: string,
    @Query() period?: "week" | "month" | "quarter" | "year",
    @Query() metrics?: string,
  ): Promise<DashboardMetricsResponse | { error: string; message: string }> {
    try {
      const request: DashboardMetricsRequest = {
        boat_type: boat_type || "catamaran",
        period: period || "month",
        metrics: metrics ? metrics.split(",") : undefined,
      };

      const keyMetrics = await this.dashboardService.getKeyMetrics(request.boat_type, request.period);

      const response: DashboardMetricsResponse = {
        metrics: keyMetrics,
        period: request.period || "month",
        comparison: {
          previous: [], // Mock previous period data
          change: {}, // Mock change calculations
        },
      };

      this.setStatus(200);
      return response;
    } catch (error) {
      console.error("Error in getKeyMetrics:", error);
      this.setStatus(200);
      const emptyMetric = (id: string, title: string, unit: string, icon: string, color: string) => ({
        id,
        title,
        value: 0,
        unit,
        change: 0,
        changeType: "neutral" as const,
        trend: "stable" as const,
        icon,
        color,
      });
      return {
        metrics: [
          emptyMetric("total-boats", "Total Boats", "boats", "anchor", "blue"),
          emptyMetric("average-price", "Average Price", "€", "euro", "green"),
          emptyMetric("total-revenue", "Total Revenue", "€", "trending-up", "purple"),
          emptyMetric("availability-rate", "Availability Rate", "%", "calendar", "orange"),
          emptyMetric("average-discount", "Average Discount", "%", "percent", "red"),
          emptyMetric("occupancy-rate", "Occupancy Rate", "%", "users", "teal"),
        ],
        period: period || "month",
        comparison: { previous: [], change: {} },
      };
    }
  }

  /**
   * Get weekly price trends
   * @param boat_type Boat type filter (default: catamaran)
   * @param weeks Specific weeks to retrieve
   * @param year Year for price trends (default: current year)
   * @returns Weekly price trends with averages
   */
  @Get("/price-trends")
  @Response<PriceTrendsResponse>(200, "Price trends retrieved successfully")
  @Response<{ error: string; message: string }>(500, "Internal server error")
  public async getPriceTrends(
    @Query() boat_type?: string,
    @Query() weeks?: string,
    @Query() year?: number,
  ): Promise<PriceTrendsResponse | { error: string; message: string }> {
    try {
      const request: PriceTrendsRequest = {
        boat_type: boat_type || "catamaran",
        weeks: weeks ? weeks.split(",").map(Number) : undefined,
        year: year || new Date().getFullYear(),
      };

      const priceData = await this.dashboardService.getWeeklyPriceTrends(request.boat_type, request.year);

      const response: PriceTrendsResponse = {
        priceData,
        trends: {
          weekly: 2.5, // Mock trend data
          monthly: 5.8,
          yearly: 12.3,
        },
      };

      this.setStatus(200);
      return response;
    } catch (error) {
      console.error("Error in getPriceTrends:", error);
      this.setStatus(200);
      return {
        priceData: { weeks: [], minPrice: 0, maxPrice: 0, averagePrice: 0, totalBoats: 0 },
        trends: { weekly: 0, monthly: 0, yearly: 0 },
      };
    }
  }

  /**
   * Get discount trends
   * @param boat_type Boat type filter (default: catamaran)
   * @param time_range Time range for trends (week, month, quarter, year)
   * @param date_from Start date for data filtering
   * @param date_to End date for data filtering
   * @returns Discount trends with averages
   */
  @Get("/discount-trends")
  @Response<DiscountTrendsResponse>(200, "Discount trends retrieved successfully")
  @Response<{ error: string; message: string }>(500, "Internal server error")
  public async getDiscountTrends(
    @Query() boat_type?: string,
    @Query() time_range?: "week" | "month" | "quarter" | "year",
    @Query() date_from?: string,
    @Query() date_to?: string,
  ): Promise<DiscountTrendsResponse | { error: string; message: string }> {
    try {
      const request: DiscountTrendsRequest = {
        boat_type: boat_type || "catamaran",
        time_range: time_range || "month",
        date_from,
        date_to,
      };

      const discountData = await this.dashboardService.getDiscountTrends(request.boat_type, request.time_range);

      const response: DiscountTrendsResponse = {
        discountData,
        trends: {
          average: discountData.averageDiscount,
          trend: "down", // Mock trend
          change: -1.2, // Mock change
        },
      };

      this.setStatus(200);
      return response;
    } catch (error) {
      console.error("Error in getDiscountTrends:", error);
      this.setStatus(200);
      return {
        discountData: { dataPoints: [], minDiscount: 0, maxDiscount: 0, averageDiscount: 0, totalBoats: 0 },
        trends: { average: 0, trend: "stable" as const, change: 0 },
      };
    }
  }

  /**
   * Get availability trends
   * @param boat_type Boat type filter (default: catamaran)
   * @param time_range Time range for trends (week, month, quarter, year)
   * @param date_from Start date for data filtering
   * @param date_to End date for data filtering
   * @returns Availability trends with insights
   */
  @Get("/availability")
  @Response<AvailabilityResponse>(200, "Availability trends retrieved successfully")
  @Response<{ error: string; message: string }>(500, "Internal server error")
  public async getAvailabilityTrends(
    @Query() boat_type?: string,
    @Query() time_range?: "week" | "month" | "quarter" | "year",
    @Query() date_from?: string,
    @Query() date_to?: string,
  ): Promise<AvailabilityResponse | { error: string; message: string }> {
    try {
      const request: AvailabilityRequest = {
        boat_type: boat_type || "catamaran",
        time_range: time_range || "month",
        date_from,
        date_to,
      };

      const availabilityData = await this.dashboardService.getAvailabilityTrends(request.boat_type, request.time_range);

      const response: AvailabilityResponse = {
        availabilityData,
        insights: {
          peakSeason: "Summer (Weeks 25-35)",
          lowSeason: "Winter (Weeks 1-10, 45-52)",
          averageOccupancy: availabilityData.averageOccupancy,
        },
      };

      this.setStatus(200);
      return response;
    } catch (error) {
      console.error("Error in getAvailabilityTrends:", error);
      this.setStatus(200);
      return {
        availabilityData: { dataPoints: [], averageAvailability: 0, averageOccupancy: 0, totalBoats: 0 },
        insights: { peakSeason: "-", lowSeason: "-", averageOccupancy: 0 },
      };
    }
  }

  /**
   * Get revenue trends
   * @param boat_type Boat type filter (default: catamaran)
   * @param time_range Time range for trends (week, month, quarter, year)
   * @param date_from Start date for data filtering
   * @param date_to End date for data filtering
   * @returns Revenue trends with projections
   */
  @Get("/revenue")
  @Response<RevenueResponse>(200, "Revenue trends retrieved successfully")
  @Response<{ error: string; message: string }>(500, "Internal server error")
  public async getRevenueTrends(
    @Query() boat_type?: string,
    @Query() time_range?: "week" | "month" | "quarter" | "year",
    @Query() date_from?: string,
    @Query() date_to?: string,
  ): Promise<RevenueResponse | { error: string; message: string }> {
    try {
      const request: RevenueRequest = {
        boat_type: boat_type || "catamaran",
        time_range: time_range || "month",
        date_from,
        date_to,
      };

      const revenueData = await this.dashboardService.getRevenueTrends(request.boat_type, request.time_range);

      const response: RevenueResponse = {
        revenueData,
        projections: {
          nextMonth: Math.round(revenueData.averageRevenue * 1.1), // Mock projection
          nextQuarter: Math.round(revenueData.averageRevenue * 3.2),
          confidence: 85, // Mock confidence
        },
      };

      this.setStatus(200);
      return response;
    } catch (error) {
      console.error("Error in getRevenueTrends:", error);
      this.setStatus(200);
      return {
        revenueData: { dataPoints: [], totalRevenue: 0, averageRevenue: 0, totalBookings: 0, averageProfitMargin: 0 },
        projections: { nextMonth: 0, nextQuarter: 0, confidence: 0 },
      };
    }
  }

  /**
   * Get summary statistics and insights
   * @param boat_type Boat type filter (default: catamaran)
   * @param category Specific categories to retrieve
   * @param limit Maximum number of stats to return
   * @returns Summary statistics with insights
   */
  @Get("/stats")
  @Response<DashboardStatsResponse>(200, "Summary stats retrieved successfully")
  @Response<{ error: string; message: string }>(500, "Internal server error")
  public async getSummaryStats(
    @Query() boat_type?: string,
    @Query() category?: string,
    @Query() limit?: number,
  ): Promise<DashboardStatsResponse | { error: string; message: string }> {
    try {
      const request: DashboardStatsRequest = {
        boat_type: boat_type || "catamaran",
        category: category ? category.split(",") : undefined,
        limit: limit || 10,
      };

      const stats = await this.dashboardService.getSummaryStats(request.boat_type);

      const response: DashboardStatsResponse = {
        stats: stats.slice(0, request.limit),
        categories: {
          performance: stats.filter((s) => s.category === "performance").length,
          market: stats.filter((s) => s.category === "market").length,
          seasonal: stats.filter((s) => s.category === "seasonal").length,
          insight: stats.filter((s) => s.category === "insight").length,
        },
      };

      this.setStatus(200);
      return response;
    } catch (error) {
      console.error("Error in getSummaryStats:", error);
      this.setStatus(200);
      return {
        stats: [],
        categories: { performance: 0, market: 0, seasonal: 0, insight: 0 },
      };
    }
  }

  /**
   * Health check endpoint for dashboard
   * @returns Simple health status
   */
  @Get("/health")
  @Response<{ success: boolean; message: string; timestamp: string }>(200, "Dashboard API is healthy")
  public async healthCheck(): Promise<{ success: boolean; message: string; timestamp: string }> {
    return {
      success: true,
      message: "Dashboard API is running",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Debug: what Supabase returns for boat_availability and boats_list.
   * GET /dashboard/supabase-check — open in browser to see Supabase status.
   */
  @Get("/supabase-check")
  @Response<{
    configured: boolean;
    tableName: string;
    hasData: boolean;
    rowCount: number;
    error: string | null;
    rawError: { code?: string; message?: string; details?: string } | null;
    sampleSlugs: string[];
    boatsListCheck: { ok: boolean; error: string | null; rowCount: number };
  }>(200, "Supabase check result")
  public async supabaseCheck(): Promise<{
    configured: boolean;
    tableName: string;
    hasData: boolean;
    rowCount: number;
    error: string | null;
    rawError: { code?: string; message?: string; details?: string } | null;
    sampleSlugs: string[];
    boatsListCheck: { ok: boolean; error: string | null; rowCount: number };
  }> {
    const { getAvailabilityYear } = await import("../config/constans");
    const tableName = `boat_availability_${getAvailabilityYear()}`;
    const out: {
      configured: boolean;
      tableName: string;
      hasData: boolean;
      rowCount: number;
      error: string | null;
      rawError: { code?: string; message?: string; details?: string } | null;
      sampleSlugs: string[];
      boatsListCheck: { ok: boolean; error: string | null; rowCount: number };
    } = {
      configured: !!supabaseService?.client,
      tableName,
      hasData: false,
      rowCount: 0,
      error: null,
      rawError: null,
      sampleSlugs: [],
      boatsListCheck: { ok: false, error: null, rowCount: 0 },
    };

    if (!out.configured || !supabaseService.client) {
      out.error = "Supabase client not configured (missing SUPABASE_URL/SUPABASE_KEY?)";
      return out;
    }

    try {
      const { data, error } = await supabaseService.client.supabase
        .from(tableName)
        .select("slug")
        .limit(10);

      if (error) {
        out.error = error.message;
        out.rawError = { code: error.code, message: error.message, details: error.details };
        return out;
      }
      out.hasData = Array.isArray(data) && data.length > 0;
      out.rowCount = data?.length ?? 0;
      out.sampleSlugs = (data ?? []).map((r: { slug?: string }) => r?.slug ?? "").filter(Boolean);
    } catch (e) {
      out.error = e instanceof Error ? e.message : String(e);
      out.rawError = out.error ? { message: out.error } : null;
    }

    try {
      const { data: boatsData, error: boatsError } = await supabaseService.client.supabase
        .from("boats_list")
        .select("slug")
        .limit(5);
      out.boatsListCheck = {
        ok: !boatsError,
        error: boatsError?.message ?? null,
        rowCount: Array.isArray(boatsData) ? boatsData.length : 0,
      };
    } catch (e) {
      out.boatsListCheck = { ok: false, error: e instanceof Error ? e.message : String(e), rowCount: 0 };
    }

    return out;
  }
}
