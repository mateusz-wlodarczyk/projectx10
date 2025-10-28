# Boat Detail View Implementation Plan

## 1. Overview

The Boat Detail View provides comprehensive information about a specific boat with a two-panel layout:

- **Left Panel**: Boat details from `boats_list` table (SingleBoatDetails) - showing only fields that have values
- **Right Panel**: Price charts and availability data from `boats_availability_2025` table for the given slug

## 2. View Routing

- **Path**: `/boats/[id]` (where `[id]` is the boat slug)
- **Route Component**: `BoatDetailPage`
- **Layout**: Uses `DashboardLayout` with sidebar and main content area
- **Authentication**: Required for all users
- **Data Sources**:
  - `boats_list` table for boat details
  - `boats_availability_2025` table for price history and charts

## 3. Component Structure

```
DashboardLayout
├── NavigationBar
├── Sidebar
│   └── QuickActions (Back to boats list)
└── MainContent
    ├── BoatDetailHeader
    └── TwoPanelLayout
        ├── LeftPanel
        │   ├── BoatBasicInfo
        │   ├── BoatParameters
        │   ├── BoatSpecifications
        │   └── BoatFeatures
        └── RightPanel
            ├── PriceChartHeader
            ├── WeeklyPriceChart
            ├── DiscountChart
            └── AvailabilityTimeline
```

## 4. Component Details

### BoatDetailHeader

- **Component description**: Header section with boat title, basic info, and navigation
- **Main elements**: Boat title, manufacturer, model, location, back button
- **Handled interactions**: Navigation back to boats list
- **Types**: `BoatDetailHeaderProps`
- **Props**: `boat: SingleBoatDetails`, `onBack: () => void`

### BoatBasicInfo

- **Component description**: Displays basic boat information from boats_list
- **Main elements**: Title, manufacturer, model, category, location, price, reviews
- **Handled interactions**: None (display only)
- **Handled validation**: Show only fields with values
- **Types**: `BoatBasicInfoProps`
- **Props**: `boat: SingleBoatDetails`

### BoatParameters

- **Component description**: Displays boat parameters from SingleBoatParameters
- **Main elements**: Capacity, cabins, toilets, dimensions, engine specs
- **Handled interactions**: None (display only)
- **Handled validation**: Show only parameters with values
- **Types**: `BoatParametersProps`
- **Props**: `parameters: SingleBoatParameters`

### BoatSpecifications

- **Component description**: Displays technical specifications
- **Main elements**: Length, beam, draft, year, engine details
- **Handled interactions**: None (display only)
- **Handled validation**: Show only specifications with values
- **Types**: `BoatSpecificationsProps`
- **Props**: `boat: SingleBoatDetails`, `parameters: SingleBoatParameters`

### BoatFeatures

- **Component description**: Displays boat features and amenities
- **Main elements**: USP features, equipment, services
- **Handled interactions**: None (display only)
- **Handled validation**: Show only features with values
- **Types**: `BoatFeaturesProps`
- **Props**: `boat: SingleBoatDetails`

### WeeklyPriceChart

- **Component description**: Chart showing price evolution over weeks
- **Main elements**: Line chart with price data, week selector, price range
- **Handled interactions**: Week selection, chart zoom, data point hover
- **Handled validation**: Price data validation, week range validation
- **Types**: `WeeklyPriceChartProps`
- **Props**: `priceData: WeekData`, `selectedWeek: number`, `onWeekChange: (week: number) => void`

### DiscountChart

- **Component description**: Chart showing discount percentages over time
- **Main elements**: Bar chart with discount data, time range selector
- **Handled interactions**: Time range selection, chart interactions
- **Handled validation**: Discount data validation
- **Types**: `DiscountChartProps`
- **Props**: `discountData: WeekData`, `timeRange: string`, `onTimeRangeChange: (range: string) => void`

### AvailabilityTimeline

- **Component description**: Timeline showing availability and price changes
- **Main elements**: Timeline with price points, availability indicators
- **Handled interactions**: Timeline navigation, data point selection
- **Handled validation**: Timeline data validation
- **Types**: `AvailabilityTimelineProps`
- **Props**: `availabilityData: WeekData`, `onDataPointSelect: (point: any) => void`

## 5. Types

### Core Types

```typescript
interface BoatDetailViewProps {
  slug: string;
}

interface BoatDetailData {
  boatDetails: SingleBoatDetails;
  availabilityData: WeekData;
  loading: boolean;
  error: string | null;
}

interface WeekData {
  id: number;
  slug: string;
  week_1: BoatPrice | null;
  week_2: BoatPrice | null;
  // ... week_3 to week_53
  [key: `week_${number}`]: BoatPrice | null;
}

interface BoatPrice {
  [timestamp: string]: {
    price: number;
    discount: number;
    createdAt: string;
  };
}

interface ChartDataPoint {
  week: number;
  date: string;
  price: number;
  discount: number;
  timestamp: string;
}

interface PriceChartData {
  weeks: ChartDataPoint[];
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  totalDataPoints: number;
}

interface DiscountChartData {
  dataPoints: ChartDataPoint[];
  avgDiscount: number;
  maxDiscount: number;
  minDiscount: number;
}

interface AvailabilityTimelineData {
  timeline: ChartDataPoint[];
  availabilityPeriods: AvailabilityPeriod[];
}

interface AvailabilityPeriod {
  startWeek: number;
  endWeek: number;
  avgPrice: number;
  avgDiscount: number;
  dataPoints: number;
}
```

### Component Interface Types

```typescript
interface BoatDetailHeaderProps {
  boat: SingleBoatDetails;
  onBack: () => void;
  loading: boolean;
}

interface BoatBasicInfoProps {
  boat: SingleBoatDetails;
  loading: boolean;
}

interface BoatParametersProps {
  parameters: SingleBoatParameters;
  loading: boolean;
}

interface BoatSpecificationsProps {
  boat: SingleBoatDetails;
  parameters: SingleBoatParameters;
  loading: boolean;
}

interface BoatFeaturesProps {
  boat: SingleBoatDetails;
  loading: boolean;
}

interface WeeklyPriceChartProps {
  priceData: PriceChartData;
  selectedWeek: number;
  onWeekChange: (week: number) => void;
  loading: boolean;
}

interface DiscountChartProps {
  discountData: DiscountChartData;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  loading: boolean;
}

interface AvailabilityTimelineProps {
  timelineData: AvailabilityTimelineData;
  onDataPointSelect: (point: ChartDataPoint) => void;
  loading: boolean;
}
```

## 6. State Management

### Custom Hooks

- **useBoatDetail**: Manages boat detail data fetching and state
- **useBoatAvailability**: Handles availability data fetching and processing
- **useBoatCharts**: Manages chart data processing and visualization state

### State Variables

- `boatDetails: SingleBoatDetails | null`
- `availabilityData: WeekData | null`
- `chartData: PriceChartData | null`
- `selectedWeek: number`
- `selectedTimeRange: string`
- `loading: boolean`
- `error: string | null`

## 7. API Integration

### Primary Endpoints

- **GET /boat/search/{slug}**: Get boat details from boats_list
- **GET /boat/availability/{slug}**: Get availability data from boats_availability_2025
- **GET /boat/availability/{slug}/week/{week}**: Get specific week data

### Request/Response Types

```typescript
// GET /boat/search/{slug} request
interface BoatSearchRequest {
  slug: string;
}

// GET /boat/search/{slug} response
interface BoatSearchResponse {
  success: boolean;
  data: SingleBoatDetails;
  message?: string;
}

// GET /boat/availability/{slug} request
interface BoatAvailabilityRequest {
  slug: string;
  year?: number;
}

// GET /boat/availability/{slug} response
interface BoatAvailabilityResponse {
  success: boolean;
  data: WeekData;
  message?: string;
}

// GET /boat/availability/{slug}/week/{week} request
interface BoatWeekRequest {
  slug: string;
  week: number;
  year?: number;
}

// GET /boat/availability/{slug}/week/{week} response
interface BoatWeekResponse {
  success: boolean;
  data: BoatPrice;
  message?: string;
}
```

## 8. Data Processing

### Boat Details Processing

- Filter out empty/null fields from SingleBoatDetails
- Group fields by category (basic info, parameters, specifications, features)
- Format display values (currency, dates, measurements)

### Availability Data Processing

- Parse WeekData structure
- Extract price and discount data from BoatPrice objects
- Group data by weeks and create chart data points
- Calculate statistics (min, max, average prices/discounts)

### Chart Data Processing

- Transform raw data into chart-friendly format
- Handle multiple price entries per day (take latest)
- Calculate trends and patterns
- Generate timeline data for availability view

## 9. User Interactions

### Navigation Interactions

- **Back Button**: Navigate back to boats list
- **Week Selection**: Change selected week in charts
- **Time Range Selection**: Change time range for discount chart

### Chart Interactions

- **Chart Hover**: Show detailed information on hover
- **Chart Zoom**: Zoom into specific time periods
- **Data Point Click**: Show detailed price information
- **Legend Toggle**: Show/hide chart series

### Panel Interactions

- **Panel Resize**: Adjust panel widths
- **Panel Toggle**: Show/hide panels on mobile
- **Scroll Sync**: Sync scrolling between panels

## 10. Conditions and Validation

### Data Validation

- **Boat Existence**: Validate boat exists in boats_list
- **Availability Data**: Validate availability data exists
- **Price Data**: Validate price data format and values
- **Week Range**: Validate week numbers (1-53)

### UI Validation

- **Loading States**: Handle loading states for all data
- **Error States**: Handle API errors and data parsing errors
- **Empty States**: Handle cases with no data
- **Chart Validation**: Validate chart data before rendering

## 11. Error Handling

### Data Loading Errors

- **API Connection Errors**: Handle network failures
- **Data Parsing Errors**: Handle malformed responses
- **Missing Data**: Handle missing boat or availability data
- **Invalid Slug**: Handle invalid boat slugs

### UI Error States

- **Loading States**: Show skeleton loaders during data fetching
- **Error Boundaries**: Catch and display component-level errors
- **Chart Errors**: Handle chart rendering failures
- **Data Processing Errors**: Handle data transformation errors

## 12. Performance Optimizations

### Data Loading

- **Parallel Requests**: Load boat details and availability data in parallel
- **Data Caching**: Cache boat details and availability data
- **Lazy Loading**: Load chart data only when needed
- **Data Pagination**: Load availability data in chunks if needed

### UI Performance

- **Chart Optimization**: Optimize chart rendering for large datasets
- **Component Memoization**: Memoize expensive components
- **Virtual Scrolling**: Consider virtual scrolling for large timelines
- **Image Optimization**: Optimize boat images

### Caching Strategy

- **API Response Caching**: Cache API responses
- **Chart Data Caching**: Cache processed chart data
- **Image Caching**: Cache boat images
- **Browser Caching**: Use browser caching for static assets

## 13. Responsive Design

### Layout Adaptation

- **Desktop**: Two-panel layout side by side
- **Tablet**: Stacked panels with toggle
- **Mobile**: Single panel with tab navigation
- **Large Screens**: Expand panels for better visibility

### Chart Responsiveness

- **Chart Sizing**: Responsive chart dimensions
- **Touch Interactions**: Touch-friendly chart interactions
- **Mobile Navigation**: Mobile-friendly chart navigation
- **Data Density**: Adjust data density for screen size

## 14. Accessibility

### Keyboard Navigation

- **Tab Order**: Logical tab order through components
- **Keyboard Shortcuts**: Support for chart navigation
- **Focus Management**: Clear focus indicators
- **Screen Reader Support**: Proper ARIA labels

### Visual Accessibility

- **Color Contrast**: Sufficient contrast for charts and text
- **Text Scaling**: Support for text scaling
- **Chart Accessibility**: Accessible chart descriptions
- **Error States**: Clear error state indication

## 15. Implementation Steps

1. **Setup Boat Detail Page**: Create basic page structure with two panels
2. **Implement API Endpoints**: Create endpoints for boat details and availability
3. **Build Left Panel**: Create components for boat details display
4. **Build Right Panel**: Create chart components for price and availability
5. **Add Data Processing**: Implement data transformation and processing
6. **Handle Loading States**: Add loading skeletons and error states
7. **Implement Responsive Design**: Ensure mobile compatibility
8. **Add Chart Interactions**: Implement chart interactions and navigation
9. **Add Accessibility Features**: Implement keyboard navigation and screen reader support
10. **Optimize Performance**: Add caching and performance optimizations
11. **Add Error Handling**: Implement comprehensive error handling
12. **Testing**: Add unit tests and integration tests
13. **Documentation**: Create component documentation and usage examples

## 16. Example Data Flow

### Boat Details Flow

1. User navigates to `/boats/bali-42-majestic-sunset`
2. Page loads and extracts slug from URL
3. API call to `/boat/search/bali-42-majestic-sunset`
4. Response contains SingleBoatDetails
5. Left panel displays filtered boat information

### Availability Data Flow

1. API call to `/boat/availability/bali-42-majestic-sunset`
2. Response contains WeekData with all weeks
3. Data processing extracts price and discount information
4. Charts display processed data
5. User can interact with charts to explore data

### Chart Interaction Flow

1. User selects a week in WeeklyPriceChart
2. Chart updates to show detailed data for that week
3. DiscountChart updates to show discount data for the same period
4. AvailabilityTimeline highlights the selected period
5. All charts stay synchronized
