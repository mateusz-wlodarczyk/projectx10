// Dashboard Types for Backend
// Based on dashboard implementation plan

export interface DashboardSummary {
  lastUpdate: Date;
  totalBoats: number;
  boatType: string; // "catamaran" as default
  totalRevenue: number;
  averagePrice: number;
  totalBookings: number;
  availabilityRate: number;
}

export interface KeyMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  trend: "up" | "down" | "stable";
  icon: string;
  color: string;
}

export interface WeeklyPriceDataPoint {
  week: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  boatCount: number;
  timestamp: Date;
}

export interface WeeklyPriceData {
  weeks: WeeklyPriceDataPoint[];
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  totalBoats: number;
}

export interface DiscountDataPoint {
  timestamp: Date;
  averageDiscount: number;
  minDiscount: number;
  maxDiscount: number;
  boatCount: number;
}

export interface DiscountChartData {
  dataPoints: DiscountDataPoint[];
  minDiscount: number;
  maxDiscount: number;
  averageDiscount: number;
  totalBoats: number;
}

export interface AvailabilityDataPoint {
  timestamp: Date;
  availabilityRate: number;
  bookedBoats: number;
  totalBoats: number;
  occupancyRate: number;
}

export interface AvailabilityData {
  dataPoints: AvailabilityDataPoint[];
  averageAvailability: number;
  averageOccupancy: number;
  totalBoats: number;
}

export interface RevenueDataPoint {
  timestamp: Date;
  revenue: number;
  bookings: number;
  averageBookingValue: number;
  profitMargin: number;
}

export interface RevenueData {
  dataPoints: RevenueDataPoint[];
  totalRevenue: number;
  averageRevenue: number;
  totalBookings: number;
  averageProfitMargin: number;
}

export interface SummaryStat {
  id: string;
  title: string;
  value: string;
  description: string;
  trend: "up" | "down" | "stable";
  category: "performance" | "market" | "seasonal" | "insight";
  actionable: boolean;
}

// Request/Response Types
export interface DashboardSummaryRequest {
  boat_type?: string; // "catamaran" as default
  date_from?: string;
  date_to?: string;
}

export interface DashboardSummaryResponse {
  summary: DashboardSummary;
  lastUpdate: Date;
  dataSource: string;
}

export interface DashboardMetricsRequest {
  boat_type?: string;
  period?: "week" | "month" | "quarter" | "year";
  metrics?: string[];
}

export interface DashboardMetricsResponse {
  metrics: KeyMetric[];
  period: string;
  comparison: {
    previous: KeyMetric[];
    change: Record<string, number>;
  };
}

export interface PriceTrendsRequest {
  boat_type?: string;
  weeks?: number[];
  year?: number;
}

export interface PriceTrendsResponse {
  priceData: WeeklyPriceData;
  trends: {
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

export interface DiscountTrendsRequest {
  boat_type?: string;
  time_range?: "week" | "month" | "quarter" | "year";
  date_from?: string;
  date_to?: string;
}

export interface DiscountTrendsResponse {
  discountData: DiscountChartData;
  trends: {
    average: number;
    trend: "up" | "down" | "stable";
    change: number;
  };
}

export interface AvailabilityRequest {
  boat_type?: string;
  time_range?: "week" | "month" | "quarter" | "year";
  date_from?: string;
  date_to?: string;
}

export interface AvailabilityResponse {
  availabilityData: AvailabilityData;
  insights: {
    peakSeason: string;
    lowSeason: string;
    averageOccupancy: number;
  };
}

export interface RevenueRequest {
  boat_type?: string;
  time_range?: "week" | "month" | "quarter" | "year";
  date_from?: string;
  date_to?: string;
}

export interface RevenueResponse {
  revenueData: RevenueData;
  projections: {
    nextMonth: number;
    nextQuarter: number;
    confidence: number;
  };
}

export interface DashboardStatsRequest {
  boat_type?: string;
  category?: string[];
  limit?: number;
}

export interface DashboardStatsResponse {
  stats: SummaryStat[];
  categories: {
    [key: string]: number;
  };
}

// Aggregated boat data for dashboard calculations
export interface AggregatedBoatData {
  slug: string;
  title: string;
  category: string;
  price: number;
  discount: number;
  currency: string;
  isAvailable: boolean;
  views: number;
  reviewsScore: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard calculation helpers
export interface DashboardCalculations {
  totalBoats: number;
  averagePrice: number;
  totalRevenue: number;
  averageDiscount: number;
  availabilityRate: number;
  occupancyRate: number;
  priceTrend: number;
  discountTrend: number;
}
