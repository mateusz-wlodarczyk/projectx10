# View Implementation Plan - Search View

## 1. Overview

The Search View provides comprehensive boat search functionality with advanced filtering capabilities. Users can search for boats by name, date range, location, and various other criteria. The view includes real-time search suggestions, filter management, and detailed search results with sorting and pagination options.

## 2. View Routing

- **Path**: `/search`
- **Route Component**: `SearchPage`
- **Layout**: Uses `DashboardLayout` with sidebar and main content area
- **Authentication**: Required for all users

## 3. Component Structure

```
DashboardLayout
├── NavigationBar
├── Sidebar
│   ├── SearchFilters
│   ├── SearchHistory
│   └── SavedSearches
└── MainContent
    ├── SearchHeader
    ├── SearchResults
    ├── SearchPagination
    └── SearchSuggestions
```

## 4. Component Details

### SearchHeader

- **Component description**: Search input with autocomplete and advanced search toggle
- **Main elements**: Search input field, search button, advanced search toggle, search suggestions dropdown
- **Handled interactions**: Text input, search suggestions selection, search execution, advanced search toggle
- **Handled validation**: Search term validation, minimum character requirements
- **Types**: `SearchHeaderProps`, `SearchSuggestion`
- **Props**: `onSearch: (query: SearchQuery) => void`, `suggestions: SearchSuggestion[]`, `loading: boolean`

### SearchFilters

- **Component description**: Comprehensive filter panel for boat search with date range, location, and boat specifications
- **Main elements**: Date range picker, location filters, boat type filters, price range slider, capacity filters
- **Handled interactions**: Filter value changes, filter reset, filter application, filter persistence
- **Handled validation**: Date range validation, filter combination validation
- **Types**: `SearchFiltersProps`, `SearchFilterState`
- **Props**: `filters: SearchFilterState`, `onFilterChange: (filters: SearchFilterState) => void`, `availableOptions: FilterOption[]`

### SearchResults

- **Component description**: Grid/list view of search results with boat cards and detailed information
- **Main elements**: Boat cards with images, basic info, pricing, availability indicators, action buttons
- **Handled interactions**: Card clicks for details, favorite/bookmark actions, quick availability check
- **Handled validation**: Result data validation, image loading error handling
- **Types**: `SearchResultsProps`, `BoatSearchResult`
- **Props**: `results: BoatSearchResult[]`, `loading: boolean`, `onBoatClick: (boat: BoatSearchResult) => void`

### SearchPagination

- **Component description**: Pagination controls for navigating through search results
- **Main elements**: Page navigation buttons, page size selector, results count display
- **Handled interactions**: Page changes, page size changes, results per page selection
- **Handled validation**: Page number validation, page size limits
- **Types**: `SearchPaginationProps`, `PaginationConfig`
- **Props**: `pagination: PaginationConfig`, `onPageChange: (page: number) => void`, `onPageSizeChange: (size: number) => void`

### SearchSuggestions

- **Component description**: Real-time search suggestions based on user input
- **Main elements**: Suggestion dropdown, suggestion categories, recent searches
- **Handled interactions**: Suggestion selection, suggestion hover, keyboard navigation
- **Handled validation**: Suggestion data validation, debounced input handling
- **Types**: `SearchSuggestionsProps`, `SearchSuggestion`
- **Props**: `suggestions: SearchSuggestion[]`, `onSuggestionSelect: (suggestion: SearchSuggestion) => void`, `visible: boolean`

### SearchHistory

- **Component description**: Recent search history with quick access to previous searches
- **Main elements**: History list, clear history button, search replay functionality
- **Handled interactions**: History item clicks, history clearing, search replay
- **Handled validation**: History data persistence, history item validation
- **Types**: `SearchHistoryProps`, `SearchHistoryItem`
- **Props**: `history: SearchHistoryItem[]`, `onHistorySelect: (item: SearchHistoryItem) => void`, `onClearHistory: () => void`

### SavedSearches

- **Component description**: User's saved searches with management capabilities
- **Main elements**: Saved search list, save/unsave buttons, search naming
- **Handled interactions**: Save search, load saved search, delete saved search, rename search
- **Handled validation**: Saved search naming validation, duplicate search prevention
- **Types**: `SavedSearchesProps`, `SavedSearch`
- **Props**: `savedSearches: SavedSearch[]`, `onSaveSearch: (search: SearchQuery) => void`, `onLoadSearch: (search: SavedSearch) => void`

## 5. Types

### Core Search Types

```typescript
interface SearchQuery {
  term: string;
  filters: SearchFilterState;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

interface SearchFilterState {
  dateRange: {
    start: Date;
    end: Date;
  };
  boatName: string;
  locations: {
    countries: string[];
    regions: string[];
    cities: string[];
    marinas: string[];
  };
  boatSpecs: {
    types: string[];
    minLength: number;
    maxLength: number;
    minCapacity: number;
    maxCapacity: number;
    minCabins: number;
    maxCabins: number;
  };
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  availability: {
    availableOnly: boolean;
    flexibleDates: boolean;
  };
  amenities: string[];
}

interface BoatSearchResult {
  id: string;
  slug: string;
  title: string;
  manufacturer: string;
  model: string;
  category: string;
  marina: string;
  country: string;
  region: string;
  city: string;
  coordinates: [number, number];
  price: number;
  currency: string;
  discount: number;
  originalPrice: number;
  thumb: string;
  main_img: string;
  views: number;
  reviewsScore: number;
  totalReviews: number;
  availability: {
    available: boolean;
    nextAvailableDate?: Date;
  };
  specifications: {
    length: number;
    capacity: number;
    cabins: number;
    year: number;
  };
  isFavorite: boolean;
  isBookmarked: boolean;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: "boat_name" | "location" | "manufacturer" | "model";
  count?: number;
  category: string;
}

interface SearchHistoryItem {
  id: string;
  query: SearchQuery;
  timestamp: Date;
  resultCount: number;
}

interface SavedSearch {
  id: string;
  name: string;
  query: SearchQuery;
  createdAt: Date;
  lastUsed: Date;
  resultCount: number;
}
```

### Component Interface Types

```typescript
interface SearchHeaderProps {
  onSearch: (query: SearchQuery) => void;
  suggestions: SearchSuggestion[];
  loading: boolean;
  initialQuery?: string;
}

interface SearchFiltersProps {
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  availableOptions: FilterOption[];
  loading: boolean;
}

interface SearchResultsProps {
  results: BoatSearchResult[];
  loading: boolean;
  error: string | null;
  onBoatClick: (boat: BoatSearchResult) => void;
  onToggleFavorite: (boatId: string) => void;
  onToggleBookmark: (boatId: string) => void;
}

interface SearchPaginationProps {
  pagination: PaginationConfig;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  visible: boolean;
  loading: boolean;
}

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onHistorySelect: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
  maxItems: number;
}

interface SavedSearchesProps {
  savedSearches: SavedSearch[];
  onSaveSearch: (search: SearchQuery) => void;
  onLoadSearch: (search: SavedSearch) => void;
  onDeleteSearch: (searchId: string) => void;
  onRenameSearch: (searchId: string, newName: string) => void;
}
```

## 6. State Management

### Custom Hooks

- **useSearch**: Manages search state, query execution, and result handling
- **useSearchFilters**: Handles filter state and validation
- **useSearchSuggestions**: Manages autocomplete suggestions and debounced input
- **useSearchHistory**: Handles search history persistence and management
- **useSavedSearches**: Manages saved searches CRUD operations

### State Variables

- `searchQuery: SearchQuery`
- `searchResults: BoatSearchResult[]`
- `searchFilters: SearchFilterState`
- `suggestions: SearchSuggestion[]`
- `searchHistory: SearchHistoryItem[]`
- `savedSearches: SavedSearch[]`
- `loading: boolean`
- `error: string | null`
- `pagination: PaginationConfig`

## 7. API Integration

### Primary Endpoints

- **GET /boats/search**: Advanced boat search with multiple criteria
- **GET /boats/suggestions**: Get search suggestions based on input
- **GET /boats/availability**: Check boat availability for date range
- **POST /user/search-history**: Save search to user history
- **GET /user/search-history**: Get user's search history
- **POST /user/saved-searches**: Save a search query
- **GET /user/saved-searches**: Get user's saved searches
- **PUT /user/saved-searches/{id}**: Update saved search
- **DELETE /user/saved-searches/{id}**: Delete saved search

### Request/Response Types

```typescript
// GET /boats/search request
interface SearchRequest {
  q?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  date_start?: string;
  date_end?: string;
  boat_name?: string;
  countries?: string[];
  regions?: string[];
  cities?: string[];
  marinas?: string[];
  boat_types?: string[];
  min_length?: number;
  max_length?: number;
  min_capacity?: number;
  max_capacity?: number;
  min_cabins?: number;
  max_cabins?: number;
  min_price?: number;
  max_price?: number;
  currency?: string;
  available_only?: boolean;
  amenities?: string[];
}

// GET /boats/search response
interface SearchResponse {
  data: BoatSearchResult[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: {
    countries: string[];
    regions: string[];
    cities: string[];
    marinas: string[];
    boatTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
    capacityRange: {
      min: number;
      max: number;
    };
  };
  searchMetadata: {
    query: string;
    executionTime: number;
    suggestions: SearchSuggestion[];
  };
}

// GET /boats/suggestions request
interface SuggestionsRequest {
  q: string;
  limit?: number;
  types?: string[];
}

// GET /boats/suggestions response
interface SuggestionsResponse {
  suggestions: SearchSuggestion[];
  categories: {
    [key: string]: number;
  };
}
```

## 8. User Interactions

### Search Interactions

- **Text Input**: Real-time search suggestions with debounced API calls
- **Search Execution**: Execute search with current filters and sorting
- **Suggestion Selection**: Select from autocomplete suggestions
- **Search History**: Click on previous searches to replay them

### Filter Interactions

- **Date Range Selection**: Select available date ranges for boat bookings
- **Location Filters**: Multi-select countries, regions, cities, and marinas
- **Boat Specifications**: Set ranges for length, capacity, and cabin count
- **Price Range**: Set minimum and maximum price with currency selection
- **Filter Reset**: Clear all filters and reset to default state

### Result Interactions

- **Boat Card Clicks**: Navigate to detailed boat view
- **Favorite/Bookmark**: Toggle boat favorites and bookmarks
- **Availability Check**: Quick availability check for selected dates
- **Sorting**: Sort results by price, rating, availability, etc.
- **Pagination**: Navigate through search result pages

### Saved Search Management

- **Save Search**: Save current search with custom name
- **Load Saved Search**: Apply saved search filters and execute
- **Rename Search**: Update saved search name
- **Delete Search**: Remove saved search from user's collection

## 9. Conditions and Validation

### Search Input Validation

- **Minimum Characters**: Require minimum 2 characters for search suggestions
- **Maximum Length**: Limit search query length to prevent abuse
- **Special Characters**: Handle special characters and search operators
- **Empty Search**: Handle empty search queries gracefully

### Filter Validation

- **Date Range**: Start date must be before end date and not in the past
- **Price Range**: Minimum price must be less than maximum price
- **Capacity Range**: Minimum capacity must be less than maximum capacity
- **Location Filters**: Validate location hierarchy (country > region > city)

### API Parameter Validation

- **Pagination Limits**: Maximum 100 results per page
- **Filter Combinations**: Validate compatible filter combinations
- **Rate Limiting**: Implement search rate limiting to prevent abuse

## 10. Error Handling

### Search Error Scenarios

- **No Results**: Display appropriate message when no boats match search criteria
- **Network Timeouts**: Show retry options for failed search requests
- **Invalid Search Terms**: Handle and suggest corrections for invalid searches
- **Filter Conflicts**: Display warnings for conflicting filter combinations

### API Error Handling

- **Authentication Failures**: Redirect to login for expired sessions
- **Rate Limiting**: Display rate limit warnings and implement request queuing
- **Server Errors**: Show user-friendly error messages with retry options
- **Partial Results**: Handle cases where some search results fail to load

### UI Error States

- **Loading States**: Show skeleton loaders during search execution
- **Empty States**: Display appropriate messages for empty search results
- **Error Boundaries**: Catch and display component-level errors
- **Network Issues**: Handle offline scenarios gracefully

## 11. Performance Optimizations

### Search Performance

- **Debounced Input**: Implement 300ms debounce for search suggestions
- **Result Caching**: Cache search results for quick re-access
- **Lazy Loading**: Load boat images and details on demand
- **Virtual Scrolling**: Implement virtual scrolling for large result sets

### Filter Performance

- **Filter Debouncing**: Debounce filter changes to prevent excessive API calls
- **Progressive Loading**: Load filter options progressively as needed
- **Filter Caching**: Cache filter options and available values
- **Optimistic Updates**: Update UI optimistically for better perceived performance

## 12. Implementation Steps

1. **Setup Base Components**: Create SearchPage layout with header and sidebar structure
2. **Implement Search Header**: Build search input with autocomplete functionality
3. **Create Filter System**: Build comprehensive filter panel with validation
4. **Add Search Results**: Implement boat card grid with sorting and pagination
5. **Implement Suggestions**: Add real-time search suggestions with debouncing
6. **Add Search History**: Build search history management and persistence
7. **Create Saved Searches**: Implement saved search CRUD operations
8. **Add Error Handling**: Implement comprehensive error boundaries and fallback states
9. **Optimize Performance**: Add caching, debouncing, and lazy loading
10. **Implement Responsive Design**: Ensure mobile compatibility and touch interactions
11. **Add Accessibility**: Implement keyboard navigation and screen reader support
12. **Testing**: Add unit tests, integration tests, and accessibility testing
13. **Documentation**: Create component documentation and usage examples
