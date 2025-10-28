# Dashboard View Implementation Plan - Main Analytics Dashboard

## 1. Overview

The Main Dashboard View provides comprehensive analytics and insights for all boats in the system, specifically focusing on catamaran boats. It displays aggregated data with weekly averages, total boat counts, and various charts similar to individual boat views but with summarized data across all boats. The dashboard shows last update information, key metrics, and visual analytics without displaying individual boat information on the left sidebar.

## 2. View Routing

- **Path**: `/dashboard`
- **Route Component**: `DashboardPage`
- **Layout**: Uses `DashboardLayout` with navigation bar and main content area
- **Authentication**: Required for all users
- **Focus**: Catamaran boats analytics and insights

## 3. Component Structure

```
DashboardLayout
├── NavigationBar
└── MainContent
    ├── DashboardHeader
    ├── KeyMetricsCards
    ├── AnalyticsCharts
    │   ├── WeeklyPriceChart
    │   ├── DiscountChart
    │   ├── AvailabilityChart
    │   └── RevenueChart
    ├── SummaryStats
    └── LoadingState
```

## 4. Component Details

### DashboardHeader

- **Component description**: Header section with last update timestamp, total boats count, and boat type filter
- **Main elements**: Last update date/time, total boats count, boat type selector (catamaran focus), refresh button
- **Handled interactions**: Refresh data, boat type changes, update timestamp display
- **Handled validation**: Date format validation, boat count validation
- **Types**: `DashboardHeaderProps`, `DashboardSummary`
- **Props**: `summary: DashboardSummary`, `onRefresh: () => void`, `onBoatTypeChange: (type: string) => void`

### KeyMetricsCards

- **Component description**: Cards displaying key performance indicators and metrics
- **Main elements**: Total boats, average price, total revenue, booking rate, availability rate
- **Handled interactions**: Card hover effects, metric drill-down, period selection
- **Handled validation**: Metric value validation, period validation
- **Types**: `KeyMetricsCardsProps`, `KeyMetric`
- **Props**: `metrics: KeyMetric[]`, `onMetricClick: (metric: KeyMetric) => void`, `loading: boolean`

### WeeklyPriceChart

- **Component description**: Chart showing weekly price trends averaged across all catamaran boats
- **Main elements**: Line/bar chart, week selector, price trend indicators, average calculations
- **Handled interactions**: Week selection, chart zoom, trend analysis
- **Handled validation**: Price data validation, week range validation
- **Types**: `WeeklyPriceChartProps`, `WeeklyPriceData`
- **Props**: `priceData: WeeklyPriceData`, `selectedWeek: number`, `onWeekChange: (week: number) => void`, `loading: boolean`

### DiscountChart

- **Component description**: Chart showing discount trends averaged across all boats
- **Main elements**: Discount percentage chart, time range selector, trend indicators
- **Handled interactions**: Time range changes, chart interactions, trend analysis
- **Handled validation**: Discount data validation, time range validation
- **Types**: `DiscountChartProps`, `DiscountChartData`
- **Props**: `discountData: DiscountChartData`, `timeRange: string`, `onTimeRangeChange: (range: string) => void`, `loading: boolean`

### AvailabilityChart

- **Component description**: Chart showing boat availability trends over time
- **Main elements**: Availability percentage chart, booking trends, occupancy rates
- **Handled interactions**: Time period selection, availability drill-down
- **Handled validation**: Availability data validation, date range validation
- **Types**: `AvailabilityChartProps`, `AvailabilityData`
- **Props**: `availabilityData: AvailabilityData`, `timeRange: string`, `onTimeRangeChange: (range: string) => void`, `loading: boolean`

### RevenueChart

- **Component description**: Chart showing revenue trends and projections
- **Main elements**: Revenue line chart, profit margins, seasonal trends
- **Handled interactions**: Period selection, revenue drill-down, trend analysis
- **Handled validation**: Revenue data validation, currency validation
- **Types**: `RevenueChartProps`, `RevenueData`
- **Props**: `revenueData: RevenueData`, `timeRange: string`, `onTimeRangeChange: (range: string) => void`, `loading: boolean`

### SummaryStats

- **Component description**: Summary statistics panel with key insights
- **Main elements**: Top performing boats, seasonal trends, market insights
- **Handled interactions**: Statistic drill-down, insight navigation
- **Handled validation**: Statistic validation, insight data validation
- **Types**: `SummaryStatsProps`, `SummaryStat`
- **Props**: `stats: SummaryStat[]`, `onStatClick: (stat: SummaryStat) => void`, `loading: boolean`

## 5. Types

### Core Dashboard Types

```typescript
interface DashboardSummary {
  lastUpdate: Date;
  totalBoats: number;
  boatType: string; // "catamaran" as default
  totalRevenue: number;
  averagePrice: number;
  totalBookings: number;
  availabilityRate: number;
}

interface KeyMetric {
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

interface WeeklyPriceData {
  weeks: Array<{
    week: number;
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    boatCount: number;
    timestamp: Date;
  }>;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  totalBoats: number;
}

interface DiscountChartData {
  dataPoints: Array<{
    timestamp: Date;
    averageDiscount: number;
    minDiscount: number;
    maxDiscount: number;
    boatCount: number;
  }>;
  minDiscount: number;
  maxDiscount: number;
  averageDiscount: number;
  totalBoats: number;
}

interface AvailabilityData {
  dataPoints: Array<{
    timestamp: Date;
    availabilityRate: number;
    bookedBoats: number;
    totalBoats: number;
    occupancyRate: number;
  }>;
  averageAvailability: number;
  averageOccupancy: number;
  totalBoats: number;
}

interface RevenueData {
  dataPoints: Array<{
    timestamp: Date;
    revenue: number;
    bookings: number;
    averageBookingValue: number;
    profitMargin: number;
  }>;
  totalRevenue: number;
  averageRevenue: number;
  totalBookings: number;
  averageProfitMargin: number;
}

interface SummaryStat {
  id: string;
  title: string;
  value: string;
  description: string;
  trend: "up" | "down" | "stable";
  category: "performance" | "market" | "seasonal" | "insight";
  actionable: boolean;
}
```

### Component Interface Types

```typescript
interface DashboardHeaderProps {
  summary: DashboardSummary;
  onRefresh: () => void;
  onBoatTypeChange: (type: string) => void;
  currentBoatType: string;
  loading: boolean;
}

interface KeyMetricsCardsProps {
  metrics: KeyMetric[];
  onMetricClick: (metric: KeyMetric) => void;
  loading: boolean;
  error: string | null;
}

interface WeeklyPriceChartProps {
  priceData: WeeklyPriceData;
  selectedWeek: number;
  onWeekChange: (week: number) => void;
  loading: boolean;
  error: string | null;
}

interface DiscountChartProps {
  discountData: DiscountChartData;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  loading: boolean;
  error: string | null;
}

interface AvailabilityChartProps {
  availabilityData: AvailabilityData;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  loading: boolean;
  error: string | null;
}

interface RevenueChartProps {
  revenueData: RevenueData;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  loading: boolean;
  error: string | null;
}

interface SummaryStatsProps {
  stats: SummaryStat[];
  onStatClick: (stat: SummaryStat) => void;
  loading: boolean;
  error: string | null;
}
```

## 6. State Management

### Custom Hooks

- **useDashboard**: Manages dashboard data fetching and state
- **useDashboardMetrics**: Handles key metrics calculation and updates
- **useDashboardCharts**: Manages chart data and interactions
- **useDashboardRefresh**: Handles data refresh and real-time updates

### State Variables

- `summary: DashboardSummary`
- `metrics: KeyMetric[]`
- `priceData: WeeklyPriceData`
- `discountData: DiscountChartData`
- `availabilityData: AvailabilityData`
- `revenueData: RevenueData`
- `summaryStats: SummaryStat[]`
- `loading: boolean`
- `error: string | null`
- `lastRefresh: Date`
- `currentBoatType: string` // "catamaran"

## 7. API Integration

### Primary Endpoints

- **GET /dashboard/summary**: Get dashboard summary data
- **GET /dashboard/metrics**: Get key performance metrics
- **GET /dashboard/price-trends**: Get weekly price trends for catamarans
- **GET /dashboard/discount-trends**: Get discount trends across boats
- **GET /dashboard/availability**: Get availability trends
- **GET /dashboard/revenue**: Get revenue trends and analytics
- **GET /dashboard/stats**: Get summary statistics and insights

### Request/Response Types

```typescript
// GET /dashboard/summary request
interface DashboardSummaryRequest {
  boat_type?: string; // "catamaran" as default
  date_from?: string;
  date_to?: string;
}

// GET /dashboard/summary response
interface DashboardSummaryResponse {
  summary: DashboardSummary;
  lastUpdate: Date;
  dataSource: string;
}

// GET /dashboard/metrics request
interface DashboardMetricsRequest {
  boat_type?: string;
  period?: "week" | "month" | "quarter" | "year";
  metrics?: string[];
}

// GET /dashboard/metrics response
interface DashboardMetricsResponse {
  metrics: KeyMetric[];
  period: string;
  comparison: {
    previous: KeyMetric[];
    change: Record<string, number>;
  };
}

// GET /dashboard/price-trends request
interface PriceTrendsRequest {
  boat_type?: string;
  weeks?: number[];
  year?: number;
}

// GET /dashboard/price-trends response
interface PriceTrendsResponse {
  priceData: WeeklyPriceData;
  trends: {
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

// GET /dashboard/discount-trends request
interface DiscountTrendsRequest {
  boat_type?: string;
  time_range?: "week" | "month" | "quarter" | "year";
  date_from?: string;
  date_to?: string;
}

// GET /dashboard/discount-trends response
interface DiscountTrendsResponse {
  discountData: DiscountChartData;
  trends: {
    average: number;
    trend: "up" | "down" | "stable";
    change: number;
  };
}

// GET /dashboard/availability request
interface AvailabilityRequest {
  boat_type?: string;
  time_range?: "week" | "month" | "quarter" | "year";
  date_from?: string;
  date_to?: string;
}

// GET /dashboard/availability response
interface AvailabilityResponse {
  availabilityData: AvailabilityData;
  insights: {
    peakSeason: string;
    lowSeason: string;
    averageOccupancy: number;
  };
}

// GET /dashboard/revenue request
interface RevenueRequest {
  boat_type?: string;
  time_range?: "week" | "month" | "quarter" | "year";
  date_from?: string;
  date_to?: string;
}

// GET /dashboard/revenue response
interface RevenueResponse {
  revenueData: RevenueData;
  projections: {
    nextMonth: number;
    nextQuarter: number;
    confidence: number;
  };
}

// GET /dashboard/stats request
interface DashboardStatsRequest {
  boat_type?: string;
  category?: string[];
  limit?: number;
}

// GET /dashboard/stats response
interface DashboardStatsResponse {
  stats: SummaryStat[];
  categories: {
    [key: string]: number;
  };
}
```

## 8. User Interactions

### Dashboard Interactions

- **Refresh Data**: Manual refresh of all dashboard data
- **Boat Type Filter**: Switch between different boat types (focus on catamaran)
- **Time Range Selection**: Change time periods for charts and metrics
- **Chart Interactions**: Zoom, hover, click on chart elements
- **Metric Drill-down**: Click on metrics for detailed views

### Chart Interactions

- **Week Selection**: Select specific weeks in price charts
- **Time Range Changes**: Change time ranges for trend analysis
- **Chart Zoom**: Zoom in/out on chart data
- **Trend Analysis**: Click on trend indicators for detailed analysis

### Navigation Interactions

- **Metric Navigation**: Navigate to detailed metric views
- **Chart Navigation**: Navigate to detailed chart views
- **Stat Navigation**: Navigate to detailed statistics

## 9. Conditions and Validation

### Data Validation

- **Summary Data Integrity**: Validate summary data completeness
- **Metric Validation**: Validate metric calculations and values
- **Chart Data Validation**: Validate chart data structure and values
- **Date Validation**: Validate date ranges and timestamps

### Chart Validation

- **Price Data Validation**: Validate price data ranges and calculations
- **Discount Validation**: Validate discount percentages and trends
- **Availability Validation**: Validate availability rates and calculations
- **Revenue Validation**: Validate revenue calculations and trends

### Time Validation

- **Date Range Validation**: Ensure valid date ranges
- **Week Validation**: Validate week numbers and ranges
- **Timestamp Validation**: Validate timestamp formats and values
- **Period Validation**: Validate time period selections

## 10. Error Handling

### Data Loading Errors

- **API Connection Errors**: Handle API connection failures
- **Data Parsing Errors**: Handle malformed API responses
- **Empty Data States**: Display appropriate empty states
- **Partial Loading**: Handle partial data loading failures

### Chart Error States

- **Chart Rendering Errors**: Handle chart rendering failures
- **Data Visualization Errors**: Handle data visualization issues
- **Chart Interaction Errors**: Handle chart interaction failures
- **Chart Loading Errors**: Handle chart loading failures

### Metric Error States

- **Metric Calculation Errors**: Handle metric calculation failures
- **Metric Display Errors**: Handle metric display issues
- **Metric Update Errors**: Handle metric update failures
- **Metric Validation Errors**: Handle metric validation failures

## 11. Performance Optimizations

### Data Loading

- **Aggregated Data**: Load pre-aggregated data for better performance
- **Caching Strategy**: Cache dashboard data for faster loading
- **Lazy Loading**: Lazy load chart components
- **Data Compression**: Compress large datasets

### Chart Performance

- **Chart Optimization**: Optimize chart rendering performance
- **Data Sampling**: Sample large datasets for better performance
- **Chart Caching**: Cache chart data and configurations
- **Virtual Scrolling**: Use virtual scrolling for large datasets

### Real-time Updates

- **WebSocket Integration**: Real-time data updates
- **Incremental Updates**: Update only changed data
- **Update Batching**: Batch multiple updates together
- **Update Prioritization**: Prioritize critical updates

## 12. Responsive Design

### Layout Adaptation

- **Mobile**: Single column layout with stacked cards
- **Tablet**: Two column layout with side-by-side charts
- **Desktop**: Multi-column layout with full chart visibility
- **Large Screens**: Expanded layout with additional metrics

### Chart Responsiveness

- **Chart Scaling**: Responsive chart scaling
- **Chart Layout**: Adaptive chart layouts
- **Chart Interactions**: Touch-friendly chart interactions
- **Chart Legends**: Responsive chart legends

## 13. Accessibility

### Keyboard Navigation

- **Tab Order**: Logical tab order through dashboard elements
- **Keyboard Shortcuts**: Support for common navigation shortcuts
- **Focus Management**: Clear focus indicators
- **Screen Reader Support**: Proper ARIA labels and descriptions

### Visual Accessibility

- **Color Contrast**: Sufficient contrast for charts and text
- **Chart Accessibility**: Accessible chart representations
- **Text Scaling**: Support for text scaling
- **Error States**: Clear error state indication

## 14. Implementation Steps

1. **Setup Dashboard Layout**: Create dashboard page layout with header and main content
2. **Implement Dashboard Header**: Build header with last update, boat count, and type selector
3. **Create Key Metrics Cards**: Build key performance indicator cards
4. **Implement Weekly Price Chart**: Build aggregated price trend chart
5. **Create Discount Chart**: Build aggregated discount trend chart
6. **Add Availability Chart**: Build availability trend chart
7. **Implement Revenue Chart**: Build revenue trend chart
8. **Create Summary Stats**: Build summary statistics panel
9. **Handle Loading States**: Add loading skeletons and error states
10. **Implement Responsive Design**: Ensure mobile compatibility
11. **Add Real-time Updates**: Implement data refresh functionality
12. **Add Accessibility Features**: Implement keyboard navigation and screen reader support
13. **Optimize Performance**: Add caching and performance optimizations
14. **Add Error Handling**: Implement comprehensive error handling
15. **Testing**: Add unit tests and integration tests
16. **Documentation**: Create component documentation and usage examples

## 15. Key Features

### Last Update Display

- Format: DD-MM-YYYY HH:MM
- Real-time updates
- Data source indication

### Total Boats Count

- Focus on catamaran boats
- Real-time count updates
- Filter by boat type

### Aggregated Charts

- Weekly price averages across all boats
- Discount trend averages
- Availability rate calculations
- Revenue trend analysis

### No Left Sidebar Info

- Clean dashboard layout
- Focus on charts and metrics
- Streamlined user experience

### Weekly Averages

- Sum and average calculations per week
- Trend analysis across all boats
- Comparative metrics
- Seasonal insights
