# View Implementation Plan - Boats View

## 1. Overview

The Boats View provides a comprehensive listing of all boats in the system with pagination and grid layout. It displays boats as cards with images and names, allowing users to browse through the collection with 20 items per page. The view includes search functionality, filtering options, and navigation to detailed boat views.

## 2. View Routing

- **Path**: `/boats`
- **Route Component**: `BoatsPage`
- **Layout**: Uses `DashboardLayout` with sidebar and main content area
- **Authentication**: Required for all users
- **Pagination**: 20 items per page

## 3. Component Structure

```
DashboardLayout
├── NavigationBar
├── Sidebar
│   ├── BoatsFilters
│   ├── SearchBox
│   └── QuickActions
└── MainContent
    ├── BoatsHeader
    ├── BoatsGrid
    ├── BoatsPagination
    └── LoadingState
```

## 4. Component Details

### BoatsHeader

- **Component description**: Header section with boats count, search summary, and view options
- **Main elements**: Total boats count, search results summary, view toggle (grid/list), sort options
- **Handled interactions**: Sort changes, view toggle, search summary display
- **Handled validation**: Sort parameter validation, view mode validation
- **Types**: `BoatsHeaderProps`, `BoatsSummary`
- **Props**: `summary: BoatsSummary`, `onSortChange: (sort: string) => void`, `onViewToggle: (view: 'grid' | 'list') => void`

### BoatsGrid

- **Component description**: Grid layout displaying boat cards with images and names
- **Main elements**: Responsive grid of boat cards, loading skeletons, empty state
- **Handled interactions**: Card clicks for navigation, hover effects, image loading
- **Handled validation**: Boat data validation, image loading error handling
- **Types**: `BoatsGridProps`, `BoatCard`
- **Props**: `boats: BoatCard[]`, `onBoatClick: (boat: BoatCard) => void`, `loading: boolean`, `error: string | null`

### BoatCard

- **Component description**: Individual boat card displaying image and basic information
- **Main elements**: Boat image, boat name, basic details, hover effects
- **Handled interactions**: Card click navigation, image hover effects, loading states
- **Handled validation**: Image loading validation, data completeness validation
- **Types**: `BoatCardProps`, `BoatData`
- **Props**: `boat: BoatData`, `onClick: (boat: BoatData) => void`, `loading: boolean`

### BoatsPagination

- **Component description**: Pagination controls for navigating through boat pages
- **Main elements**: Page navigation buttons, page size selector, results count, page info
- **Handled interactions**: Page changes, page size changes, navigation controls
- **Handled validation**: Page number validation, page size limits
- **Types**: `BoatsPaginationProps`, `PaginationConfig`
- **Props**: `pagination: PaginationConfig`, `onPageChange: (page: number) => void`, `onPageSizeChange: (size: number) => void`

### BoatsFilters

- **Component description**: Sidebar filter panel for boats with various criteria
- **Main elements**: Filter categories, filter options, clear filters button
- **Handled interactions**: Filter selection, filter clearing, filter application
- **Handled validation**: Filter value validation, filter combination validation
- **Types**: `BoatsFiltersProps`, `BoatsFilterState`
- **Props**: `filters: BoatsFilterState`, `onFilterChange: (filters: BoatsFilterState) => void`, `availableOptions: FilterOption[]`

### SearchBox

- **Component description**: Search input for filtering boats by name or description
- **Main elements**: Search input field, search suggestions, clear search button
- **Handled interactions**: Search input, search suggestions, search execution
- **Handled validation**: Search term validation, suggestion validation
- **Types**: `SearchBoxProps`, `SearchSuggestion`
- **Props**: `onSearch: (query: string) => void`, `suggestions: SearchSuggestion[]`, `loading: boolean`

## 5. Types

### Core Boats Types

```typescript
interface BoatData {
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

interface BoatsFilterState {
  search: string;
  countries: string[];
  regions: string[];
  cities: string[];
  marinas: string[];
  categories: string[];
  manufacturers: string[];
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
  rating: {
    min: number;
    max: number;
  };
  availability: {
    availableOnly: boolean;
    featuredOnly: boolean;
  };
}

interface BoatsSummary {
  total: number;
  filtered: number;
  currentPage: number;
  totalPages: number;
  hasFilters: boolean;
  searchQuery?: string;
}

interface BoatCard {
  id: string;
  title: string;
  manufacturer: string;
  model: string;
  thumb: string;
  main_img: string;
  price: number;
  currency: string;
  discount: number;
  reviewsScore: number;
  totalReviews: number;
  isAvailable: boolean;
  isFeatured: boolean;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: "boat_name" | "manufacturer" | "model" | "location";
  count?: number;
}

interface FilterOption {
  label: string;
  value: string;
  count?: number;
  category: string;
}
```

### Component Interface Types

```typescript
interface BoatsHeaderProps {
  summary: BoatsSummary;
  onSortChange: (sort: string) => void;
  onViewToggle: (view: 'grid' | 'list') => void;
  currentSort: string;
  currentView: 'grid' | 'list';
  loading: boolean;
}

interface BoatsGridProps {
  boats: BoatCard[];
  onBoatClick: (boat: BoatCard) => void;
  loading: boolean;
  error: string | null;
  view: 'grid' | 'list';
}

interface BoatCardProps {
  boat: BoatData;
  onClick: (boat: BoatData) => void;
  loading: boolean;
  view: 'grid' | 'list';
}

interface BoatsPaginationProps {
  pagination: PaginationConfig;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions: number[];
}

interface BoatsFiltersProps {
  filters: BoatsFilterState;
  onFilterChange: (filters: BoatsFilterState) => void;
  availableOptions: FilterOption[];
  loading: boolean;
}

interface SearchBoxProps {
  onSearch: (query: string) => void;
  suggestions: SearchSuggestion[];
  loading: boolean;
  placeholder: string;
  currentQuery: string;
}

interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

## 6. State Management

### Custom Hooks

- **useBoats**: Manages boats data fetching and state
- **useBoatsFilters**: Handles filter state and application
- **useBoatsPagination**: Manages pagination state and navigation
- **useBoatsSearch**: Handles search functionality and suggestions

### State Variables

- `boats: BoatCard[]`
- `filters: BoatsFilterState`
- `pagination: PaginationConfig`
- `summary: BoatsSummary`
- `loading: boolean`
- `error: string | null`
- `searchQuery: string`
- `currentView: 'grid' | 'list'`
- `currentSort: string`

## 7. API Integration

### Primary Endpoints

- **GET /boats**: Get paginated boats list with filtering
- **GET /boats/suggestions**: Get search suggestions for boats
- **GET /boats/filters**: Get available filter options
- **GET /boats/{id}**: Get individual boat details (for navigation)

### Request/Response Types

```typescript
// GET /boats request
interface BoatsRequest {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  countries?: string[];
  regions?: string[];
  cities?: string[];
  marinas?: string[];
  categories?: string[];
  manufacturers?: string[];
  min_price?: number;
  max_price?: number;
  min_year?: number;
  max_year?: number;
  min_length?: number;
  max_length?: number;
  min_capacity?: number;
  max_capacity?: number;
  min_rating?: number;
  max_rating?: number;
  available_only?: boolean;
  featured_only?: boolean;
}

// GET /boats response
interface BoatsResponse {
  data: BoatCard[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
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

// GET /boats/suggestions request
interface BoatsSuggestionsRequest {
  q: string;
  limit?: number;
  types?: string[];
}

// GET /boats/suggestions response
interface BoatsSuggestionsResponse {
  suggestions: SearchSuggestion[];
  categories: {
    [key: string]: number;
  };
}
```

## 8. User Interactions

### Navigation Interactions

- **Boat Card Clicks**: Navigate to detailed boat view (`/boats/{id}`)
- **Page Navigation**: Navigate through paginated results
- **View Toggle**: Switch between grid and list view
- **Sort Changes**: Change sorting criteria for boats

### Search and Filter Interactions

- **Search Input**: Search boats by name, manufacturer, or model
- **Filter Selection**: Apply various filters to narrow results
- **Filter Clearing**: Clear individual or all filters
- **Search Suggestions**: Select from search suggestions

### Grid Interactions

- **Card Hover**: Show hover effects and additional information
- **Image Loading**: Handle image loading states and errors
- **Responsive Layout**: Adapt grid layout to screen size
- **Infinite Scroll**: Optional infinite scroll for better UX

## 9. Conditions and Validation

### Data Validation

- **Boat Data Integrity**: Validate boat data completeness
- **Image Validation**: Handle missing or broken images
- **Price Validation**: Validate price and discount calculations
- **Availability Validation**: Validate boat availability status

### Pagination Validation

- **Page Number Validation**: Ensure valid page numbers
- **Page Size Validation**: Validate page size limits (20 items max)
- **Total Items Validation**: Validate total item counts
- **Navigation Validation**: Ensure valid navigation states

### Filter Validation

- **Filter Value Validation**: Validate filter values and ranges
- **Filter Combination Validation**: Check for conflicting filters
- **Search Query Validation**: Validate search query format
- **Filter Option Validation**: Validate available filter options

## 10. Error Handling

### Data Loading Errors

- **Network Errors**: Handle API connection failures
- **Data Parsing Errors**: Handle malformed API responses
- **Empty Results**: Display appropriate empty state
- **Partial Loading**: Handle partial data loading failures

### UI Error States

- **Loading States**: Show skeleton loaders during data fetching
- **Error Boundaries**: Catch and display component-level errors
- **Image Loading Errors**: Show placeholder for failed image loads
- **Filter Errors**: Handle filter application failures

### Pagination Errors

- **Invalid Page Numbers**: Handle invalid page navigation
- **Page Size Errors**: Handle invalid page size requests
- **Navigation Errors**: Handle pagination navigation failures
- **State Synchronization**: Handle pagination state conflicts

## 11. Performance Optimizations

### Data Loading

- **Pagination**: Load only 20 items per page
- **Image Lazy Loading**: Lazy load boat images as they come into view
- **Search Debouncing**: Debounce search input to reduce API calls
- **Filter Caching**: Cache filter options and applied filters

### UI Performance

- **Virtual Scrolling**: Consider virtual scrolling for large datasets
- **Image Optimization**: Optimize and compress boat images
- **Component Memoization**: Memoize expensive components
- **State Optimization**: Optimize state updates and re-renders

### Caching Strategy

- **API Response Caching**: Cache API responses for better performance
- **Filter Result Caching**: Cache filtered results
- **Image Caching**: Cache boat images locally
- **Search Result Caching**: Cache search results

## 12. Responsive Design

### Grid Layout

- **Mobile**: Single column layout with larger cards
- **Tablet**: Two column layout with medium cards
- **Desktop**: Three or four column layout with compact cards
- **Large Screens**: Four or five column layout

### Card Design

- **Image Aspect Ratio**: Consistent image aspect ratios
- **Text Scaling**: Responsive text sizing
- **Touch Targets**: Appropriate touch target sizes
- **Hover States**: Desktop hover effects, touch alternatives

## 13. Accessibility

### Keyboard Navigation

- **Tab Order**: Logical tab order through boat cards
- **Keyboard Shortcuts**: Support for common navigation shortcuts
- **Focus Management**: Clear focus indicators
- **Screen Reader Support**: Proper ARIA labels and descriptions

### Visual Accessibility

- **Color Contrast**: Sufficient contrast for text and images
- **Text Scaling**: Support for text scaling
- **Image Alt Text**: Descriptive alt text for boat images
- **Error States**: Clear error state indication

## 14. Implementation Steps

1. **Setup Boats Layout**: Create boats page layout with header and sidebar
2. **Implement Boats Grid**: Build responsive grid layout for boat cards
3. **Create Boat Cards**: Build individual boat card components
4. **Add Pagination**: Implement pagination controls and navigation
5. **Build Filters**: Create comprehensive filter system
6. **Add Search Functionality**: Implement search with suggestions
7. **Handle Loading States**: Add loading skeletons and error states
8. **Implement Responsive Design**: Ensure mobile compatibility
9. **Add Accessibility Features**: Implement keyboard navigation and screen reader support
10. **Optimize Performance**: Add lazy loading and caching
11. **Add Error Handling**: Implement comprehensive error handling
12. **Testing**: Add unit tests and integration tests
13. **Documentation**: Create component documentation and usage examples
