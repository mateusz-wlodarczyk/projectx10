// Dashboard Types for Frontend
// Based on dashboard implementation plan

export interface UserRole {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
}

export interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  requiresAuth?: boolean;
}

export interface BoatData {
  id: string;
  slug: string;
  title: string;
  manufacturer: string;
  model: string;
  category: string;
  category_slug: string;
  marina: string;
  country: string;
  region: string;
  city: string;
  coordinates: [number, number];
  price: number;
  currency: string;
  discount: number;
  originalPrice: number;
  reviewsScore: number;
  totalReviews: number;
  views: number;
  thumb: string;
  main_img: string;
  year: number;
  length: number;
  capacity: number;
  cabins: number;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterState {
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  countries?: string[];
  regions?: string[];
  cities?: string[];
  marinas?: string[];
  categories?: string[];
  manufacturers?: string[];
  yachtTypes?: string[];
  promotions?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  yearRange?: {
    min: number;
    max: number;
  };
  lengthRange?: {
    min: number;
    max: number;
  };
  capacityRange?: {
    min: number;
    max: number;
  };
  rating?: {
    min: number;
    max: number;
  };
  availability?: {
    availableOnly: boolean;
    featuredOnly: boolean;
  };
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BoatsResponse {
  data: BoatData[];
  pagination: PaginationConfig;
  summary: {
    total: number;
    filtered: number;
    hasFilters: boolean;
  };
  filters: {
    countries: FilterOption[];
    regions: FilterOption[];
    cities: FilterOption[];
    marinas: FilterOption[];
    categories: FilterOption[];
    manufacturers: FilterOption[];
    priceRange: {
      min: number;
      max: number;
    };
    yearRange: {
      min: number;
      max: number;
    };
    lengthRange: {
      min: number;
      max: number;
    };
    capacityRange: {
      min: number;
      max: number;
    };
  };
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
  category: string;
}

export interface DashboardSummary {
  lastUpdate: Date | string;
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

// API Response Types
export interface DashboardSummaryResponse {
  summary: DashboardSummary;
  lastUpdate: Date | string;
  dataSource: string;
}

export interface DashboardMetricsResponse {
  metrics: KeyMetric[];
  period: string;
  comparison: {
    previous: KeyMetric[];
    change: Record<string, number>;
  };
}

export interface PriceTrendsResponse {
  priceData: WeeklyPriceData;
  trends: {
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

export interface DiscountTrendsResponse {
  discountData: DiscountChartData;
  trends: {
    average: number;
    trend: "up" | "down" | "stable";
    change: number;
  };
}

export interface AvailabilityResponse {
  availabilityData: AvailabilityData;
  insights: {
    peakSeason: string;
    lowSeason: string;
    averageOccupancy: number;
  };
}

export interface RevenueResponse {
  revenueData: RevenueData;
  projections: {
    nextMonth: number;
    nextQuarter: number;
    confidence: number;
  };
}

export interface DashboardStatsResponse {
  stats: SummaryStat[];
  categories: {
    [key: string]: number;
  };
}

// Component Props Types
export interface DashboardHeaderProps {
  summary: DashboardSummary;
  loading: boolean;
}

export interface KeyMetricsCardsProps {
  metrics: KeyMetric[];
  onMetricClick: (metric: KeyMetric) => void;
  loading: boolean;
  error: string | null;
}

export interface WeeklyPriceChartProps {
  priceData: WeeklyPriceData;
  selectedWeek: number;
  onWeekChange: (week: number) => void;
  loading: boolean;
  error: string | null;
}

export interface DiscountChartProps {
  discountData: DiscountChartData;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  loading: boolean;
  error: string | null;
}

export interface AvailabilityChartProps {
  availabilityData: AvailabilityData;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  loading: boolean;
  error: string | null;
}

export interface RevenueChartProps {
  revenueData: RevenueData;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  loading: boolean;
  error: string | null;
}

export interface SummaryStatsProps {
  stats: SummaryStat[];
  onStatClick: (stat: SummaryStat) => void;
  loading: boolean;
  error: string | null;
}

// Hook Types
export interface UseDashboardReturn {
  summary: DashboardSummary | null;
  metrics: KeyMetric[];
  priceData: WeeklyPriceData | null;
  discountData: DiscountChartData | null;
  availabilityData: AvailabilityData | null;
  revenueData: RevenueData | null;
  summaryStats: SummaryStat[];
  loading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  refresh: () => Promise<void>;
  refreshDiscountData: (timeRange: string) => Promise<void>;
}

export interface UseDashboardMetricsReturn {
  metrics: KeyMetric[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseDashboardChartsReturn {
  priceData: WeeklyPriceData | null;
  discountData: DiscountChartData | null;
  availabilityData: AvailabilityData | null;
  revenueData: RevenueData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseDashboardRefreshReturn {
  lastRefresh: Date | null;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
}

// API Request Types
export interface DashboardSummaryRequest {
  boat_type?: string;
  date_from?: string;
  date_to?: string;
}

export interface DashboardMetricsRequest {
  boat_type?: string;
  period?: "week" | "month" | "quarter" | "year";
  metrics?: string[];
}

export interface PriceTrendsRequest {
  boat_type?: string;
  weeks?: number[];
  year?: number;
}

export interface DiscountTrendsRequest {
  boat_type?: string;
  time_range?: "week" | "month" | "quarter" | "year";
  date_from?: string;
  date_to?: string;
}

export interface AvailabilityRequest {
  boat_type?: string;
  time_range?: "week" | "month" | "quarter" | "year";
  date_from?: string;
  date_to?: string;
}

export interface RevenueRequest {
  boat_type?: string;
  time_range?: "week" | "month" | "quarter" | "year";
  date_from?: string;
  date_to?: string;
}

export interface DashboardStatsRequest {
  boat_type?: string;
  category?: string[];
  limit?: number;
}

// Chart Configuration Types
export interface ChartConfig {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
      position: "top" | "bottom" | "left" | "right";
    };
    tooltip: {
      enabled: boolean;
    };
  };
  scales?: {
    x?: {
      display: boolean;
      title: {
        display: boolean;
        text: string;
      };
    };
    y?: {
      display: boolean;
      title: {
        display: boolean;
        text: string;
      };
    };
  };
}

export interface ChartColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  light: string;
  dark: string;
}

// Error Types
export interface DashboardError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Loading States
export interface LoadingState {
  summary: boolean;
  metrics: boolean;
  priceData: boolean;
  discountData: boolean;
  availabilityData: boolean;
  revenueData: boolean;
  summaryStats: boolean;
}

// Filter Types
export interface DashboardFilters {
  boatType: string;
  timeRange: string;
  dateFrom?: Date;
  dateTo?: Date;
  period: "week" | "month" | "quarter" | "year";
}

// Time Range Options
export interface TimeRangeOption {
  value: string;
  label: string;
  days: number;
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: "week", label: "Ostatni tydzień", days: 7 },
  { value: "month", label: "Ostatni miesiąc", days: 30 },
  { value: "quarter", label: "Ostatni kwartał", days: 90 },
  { value: "year", label: "Ostatni rok", days: 365 },
];

// Boat Type Options
export interface BoatTypeOption {
  value: string;
  label: string;
}

export const BOAT_TYPE_OPTIONS: BoatTypeOption[] = [
  { value: "catamaran", label: "Catamaran" },
  { value: "sailboat", label: "Żaglówka" },
  { value: "motorboat", label: "Łódź motorowa" },
  { value: "yacht", label: "Jacht" },
];

// Chart Data Processing Types
export interface ProcessedChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }[];
}

// Utility Types
export type DashboardViewMode = "grid" | "list";
export type ChartType = "line" | "bar" | "pie" | "doughnut";
export type MetricTrend = "up" | "down" | "stable";
export type TimePeriod = "week" | "month" | "quarter" | "year";
export type BoatType = "catamaran" | "sailboat" | "motorboat" | "yacht";
export type StatCategory = "performance" | "market" | "seasonal" | "insight";
