"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  BoatData,
  FilterState,
  PaginationConfig,
  BoatsResponse,
} from "@/types/dashboard";

// Default filter state
const defaultFilters: FilterState = {
  search: undefined,
  dateRange: {
    start: new Date(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  yachtTypes: [],
  regions: [],
  promotions: [],
  priceRange: {
    min: 0,
    max: 10000,
  },
  countries: [],
};

// Default pagination state
const defaultPagination: PaginationConfig = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 20,
  hasNextPage: false,
  hasPreviousPage: false,
};

// State interface
interface BoatsDataState {
  boats: BoatData[];
  loading: boolean;
  backgroundLoading: boolean;
  error: string | null;
  filters: FilterState;
  pagination: PaginationConfig;
  lastUpdated: Date | null;
}

// API service for boats data
class BoatsApiService {
  private baseUrl = "http://localhost:8080/boat";
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retryCount: number = 0
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isRetryable =
        errorMessage.includes("timeout") ||
        errorMessage.includes("Network") ||
        errorMessage.includes("Failed to fetch") ||
        (errorMessage.includes("HTTP error") && errorMessage.includes("5"));

      if (isRetryable && retryCount < this.maxRetries) {
        console.warn(
          `[BoatsApiService] Retry ${retryCount + 1}/${this.maxRetries} after error:`,
          errorMessage
        );
        await this.sleep(this.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
        return this.retryRequest(requestFn, retryCount + 1);
      }

      throw error;
    }
  }

  async getBoats(
    filters: FilterState,
    pagination: PaginationConfig
  ): Promise<BoatsResponse> {
    return this.retryRequest(async () => {
      console.log("BoatsApiService.getBoats called with:", {
        filters,
        pagination,
      });

      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
      });

      // Add search filter if present
      if (filters.search && filters.search.trim()) {
        params.append("search", filters.search.trim());
      }

      // Year filter removed

      // Add other filters if present
      if (filters.countries && filters.countries.length > 0) {
        params.append("country", filters.countries[0]); // Take first country for now
      }
      if (filters.yachtTypes && filters.yachtTypes.length > 0) {
        params.append("category", filters.yachtTypes[0]); // Take first category for now
      }
      if (filters.priceRange && filters.priceRange.min > 0) {
        params.append("minPrice", filters.priceRange.min.toString());
      }
      if (filters.priceRange && filters.priceRange.max < 10000) {
        params.append("maxPrice", filters.priceRange.max.toString());
      }

      const url = `${this.baseUrl}/list?${params}`;
      console.log("Making fetch request to:", url);
      console.log("Search parameter in URL:", params.get("search"));

      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);
        console.log("Response status:", response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `HTTP error! status: ${response.status}, body:`,
            errorText
          );
          throw new Error(
            `HTTP error! status: ${response.status} - ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log("Response data:", result);

        // Debug the response structure
        console.log("Response structure analysis:", {
          hasSuccess: "success" in result,
          hasData: "data" in result,
          dataType: typeof result.data,
          dataKeys: result.data ? Object.keys(result.data) : "no data",
          hasBoats: result.data && "boats" in result.data,
          boatsType: result.data?.boats ? typeof result.data.boats : "no boats",
          boatsIsArray: Array.isArray(result.data?.boats),
          boatsLength: result.data?.boats?.length,
        });

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch boats");
        }

        // Check if search results contain the search term in titles
        if (filters.search && filters.search.trim()) {
          const searchTerm = filters.search.trim().toLowerCase();
          const boats = result.data?.boats || result.boats || [];
          console.log(
            `SEARCH VERIFICATION: Looking for "${searchTerm}" in ${boats.length} boats`
          );

          const matchingBoats = boats.filter(
            (boat: any) =>
              boat.title && boat.title.toLowerCase().includes(searchTerm)
          );

          console.log(
            `SEARCH RESULTS: Found ${matchingBoats.length} boats with "${searchTerm}" in title:`
          );
          matchingBoats.forEach((boat: any, index: number) => {
            console.log(
              `  ${index + 1}. "${boat.title}" (ID: ${boat.id || boat.slug})`
            );
          });

          if (matchingBoats.length === 0) {
            console.warn(
              `NO MATCHES: No boats found with "${searchTerm}" in title`
            );
            console.log(
              "Available boat titles:",
              boats.map((b: any) => b.title)
            );
          }
        }

        // Transform the response to match expected format
        // Debug the data structure before transformation
        console.log("Transformation input:", {
          resultData: result.data,
          resultDataType: typeof result.data,
          resultDataKeys: result.data ? Object.keys(result.data) : "no data",
          boatsFromData: result.data?.boats,
          boatsType: typeof result.data?.boats,
          boatsIsArray: Array.isArray(result.data?.boats),
        });

        // Handle both response formats:
        // 1. Wrapped format: { success: true, data: { boats: [...], ... } }
        // 2. Direct format: { boats: [...], total: ..., page: ..., ... }
        let boatsArray: any[] = [];
        let paginationData: any = {};

        if (result.data && result.data.boats) {
          // Wrapped format
          boatsArray = result.data.boats || [];
          paginationData = {
            page: result.data.page || 1,
            totalPages: result.data.totalPages || 1,
            total: result.data.total || 0,
            limit: result.data.limit || 20,
          };
        } else if (result.boats) {
          // Direct format (fallback)
          boatsArray = result.boats || [];
          paginationData = {
            page: result.page || 1,
            totalPages: result.totalPages || 1,
            total: result.total || 0,
            limit: result.limit || 20,
          };
        }

        console.log("Extracted boats array:", {
          boatsArray,
          boatsLength: boatsArray.length,
          boatsIsArray: Array.isArray(boatsArray),
          paginationData,
        });

        return {
          data: boatsArray,
          pagination: {
            currentPage: paginationData.page || 1,
            totalPages: paginationData.totalPages || 1,
            totalItems: paginationData.total || 0,
            itemsPerPage: paginationData.limit || 20,
            hasNextPage:
              (paginationData.page || 1) < (paginationData.totalPages || 1),
            hasPreviousPage: (paginationData.page || 1) > 1,
          },
          summary: {
            total: paginationData.total || 0,
            filtered: boatsArray.length || 0,
            hasFilters: Object.keys(filters).length > 0,
          },
          filters: {
            countries: [
              {
                label: "Croatia",
                value: "croatia",
                count: 45,
                category: "location",
              },
              {
                label: "Greece",
                value: "greece",
                count: 32,
                category: "location",
              },
              {
                label: "Italy",
                value: "italy",
                count: 28,
                category: "location",
              },
            ],
            categories: [
              {
                label: "Catamaran",
                value: "catamaran",
                count: 25,
                category: "type",
              },
              {
                label: "Sailboat",
                value: "sailboat",
                count: 18,
                category: "type",
              },
              {
                label: "Motorboat",
                value: "motorboat",
                count: 12,
                category: "type",
              },
            ],
            regions: [
              {
                label: "Dalmatia",
                value: "dalmatia",
                count: 25,
                category: "region",
              },
              {
                label: "Istria",
                value: "istria",
                count: 15,
                category: "region",
              },
            ],
            cities: [
              { label: "Split", value: "split", count: 20, category: "city" },
              {
                label: "Dubrovnik",
                value: "dubrovnik",
                count: 15,
                category: "city",
              },
            ],
            marinas: [
              {
                label: "Marina Split",
                value: "marina-split",
                count: 10,
                category: "marina",
              },
              {
                label: "Marina Dubrovnik",
                value: "marina-dubrovnik",
                count: 8,
                category: "marina",
              },
            ],
            manufacturers: [
              {
                label: "Lagoon",
                value: "lagoon",
                count: 15,
                category: "manufacturer",
              },
              {
                label: "Bavaria",
                value: "bavaria",
                count: 12,
                category: "manufacturer",
              },
            ],
            priceRange: {
              min: 500,
              max: 5000,
            },
            yearRange: {
              min: 2010,
              max: 2024,
            },
            lengthRange: {
              min: 10,
              max: 50,
            },
            capacityRange: {
              min: 2,
              max: 12,
            },
          },
        };
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === "AbortError") {
          console.error("Request timed out after 30 seconds");
          throw new Error("Request timed out. Please try again.");
        }
        throw error;
      }
    });
  }

  async searchBoatInBoatsList(boatId: string): Promise<any> {
    try {
      console.log(
        `Frontend: Searching for boat with ID: "${boatId}" in boats_list`
      );

      const response = await fetch(`${this.baseUrl}/search/${boatId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log(`Frontend: Found boat "${boatId}" in boats_list:`, {
          slug: result.data.slug,
          title: result.data.title,
          country: result.data.country,
          city: result.data.city,
          totalPrice: result.data.totalPrice,
          currency: result.data.currency,
          fortka: result.data.fortka,
        });
        return result.data;
      } else {
        console.log(
          `Frontend: Boat "${boatId}" not found in boats_list:`,
          result.message
        );
        return null;
      }
    } catch (error) {
      console.error(`Frontend: Error searching for boat "${boatId}":`, error);
      throw error;
    }
  }

  async getBoatDetails(slug: string): Promise<BoatData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/?slug=${slug}&week=1`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        return null;
      }

      // Transform the response to match expected format
      const boatData = result.data;
      if (boatData && boatData.boat) {
        return {
          id: boatData.slug,
          slug: boatData.slug,
          title: boatData.slug
            .split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          manufacturer:
            boatData.slug.split("-")[0]?.charAt(0).toUpperCase() +
              boatData.slug.split("-")[0]?.slice(1) || "Unknown",
          model:
            boatData.slug
              .split("-")
              .slice(1)
              .join(" ")
              .charAt(0)
              .toUpperCase() +
            boatData.slug.split("-").slice(1).join(" ").slice(1),
          category: "Sailboat",
          category_slug: "sailboat",
          marina: "Unknown Marina",
          country: "Unknown Country",
          region: "Unknown Region",
          city: "Unknown City",
          coordinates: [0, 0],
          price: boatData.boat.price || 0,
          currency: "EUR",
          discount: 0,
          originalPrice: boatData.boat.price || 0,
          reviewsScore: 4.0,
          totalReviews: 0,
          views: Math.floor(Math.random() * 1000),
          thumb: "",
          main_img: "",
          year: 2025,
          length: 40,
          capacity: 8,
          cabins: 3,
          isAvailable: true,
          isFeatured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching boat details:", error);
      return null;
    }
  }
}

// Create singleton instance
const boatsApi = new BoatsApiService();

// Global counters to track hook initializations and API calls
let hookInitCounter = 0;
let apiCallCounter = 0;

// Cache for boats data - key: "year_page_limit", value: { data, timestamp }
const boatsCache = new Map<
  string,
  { data: any[]; pagination: any; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Helper functions for cache management
const generateCacheKey = (
  filters: FilterState,
  pagination: PaginationConfig
) => {
  // Include search parameter in cache key to ensure different searches are cached separately
  const searchKey = filters.search ? `_search_${filters.search.trim()}` : "";
  return `${pagination.currentPage}_${pagination.itemsPerPage}${searchKey}`;
};

const isCacheValid = (cacheKey: string) => {
  const cached = boatsCache.get(cacheKey);
  if (!cached) return false;

  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
  if (isExpired) {
    boatsCache.delete(cacheKey);
    return false;
  }

  return true;
};

export function useBoatsData() {
  hookInitCounter++;
  console.log(`🚀 useBoatsData hook initialized (${hookInitCounter})`);
  const [state, setState] = useState<BoatsDataState>({
    boats: [],
    loading: true, // Start with loading true to show loading state initially
    backgroundLoading: false,
    error: null,
    filters: defaultFilters,
    pagination: defaultPagination,
    lastUpdated: null,
  });

  console.log("🚀 Initial state:", state);

  const prevFiltersRef = useRef<FilterState | null>(null);
  const prevPaginationRef = useRef<PaginationConfig | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  console.log("🚀 prevFiltersRef.current:", prevFiltersRef.current);
  console.log("🚀 prevPaginationRef.current:", prevPaginationRef.current);

  const fetchBoats = useCallback(
    async (filters: FilterState, pagination: PaginationConfig) => {
      const cacheKey = generateCacheKey(filters, pagination);

      // Check cache first
      if (isCacheValid(cacheKey)) {
        console.log(`📦 Using cached data for key: ${cacheKey}`);
        const cached = boatsCache.get(cacheKey)!;

        // Ensure pagination exists and has required properties
        const cachedPagination = cached.pagination || defaultPagination;

        setState((currentState) => ({
          ...currentState,
          boats: cached.data || [],
          pagination: {
            ...cachedPagination,
            hasNextPage:
              cachedPagination.currentPage < cachedPagination.totalPages,
            hasPreviousPage: cachedPagination.currentPage > 1,
          },
          loading: false,
          backgroundLoading: false,
          lastUpdated: new Date(),
        }));
        return;
      }

      apiCallCounter++;
      console.log(
        `fetchBoats called (API call #${apiCallCounter}) - Cache miss for key: ${cacheKey}`
      );

      // Console log the selected filters
      console.log("Selected filters:", {
        search: filters.search,
        countries: filters.countries,
        yachtTypes: filters.yachtTypes,
        priceRange: filters.priceRange,
      });

      console.log("Search parameter value:", filters.search);
      console.log("Search parameter type:", typeof filters.search);

      // Set loading state - always show loading for API calls
      setState((prev) => ({
        ...prev,
        loading: true,
        backgroundLoading: false,
        error: null,
      }));

      // Start the async operation
      console.log(
        "Making API call to:",
        `http://localhost:8080/boat/list?page=${pagination.currentPage}&limit=${pagination.itemsPerPage}`
      );

      try {
        const response = await boatsApi.getBoats(filters, pagination);

        // Console log the fetched boats with new fields
        console.log("=== FRONTEND: BOATS RECEIVED FROM BACKEND ===");
        console.log(
          `Frontend: Fetched ${response.data.length} boats from backend`
        );
        console.log("Frontend: RAW RESPONSE from backend:", response);

        // Show first boat with ALL fields
        if (response.data.length > 0) {
          console.log("Frontend: FIRST BOAT - ALL FIELDS:");
          console.log("Complete boat object:", response.data[0]);

          console.log("Frontend: FIRST BOAT - FIELD NAMES:");
          console.log("Available fields:", Object.keys(response.data[0]));

          console.log("Frontend: FIRST BOAT - PRICE FIELDS:");
          const boat = response.data[0];
          const priceFields = Object.keys(boat).filter(
            (key) =>
              key.toLowerCase().includes("price") ||
              key.toLowerCase().includes("cost") ||
              key.toLowerCase().includes("rate") ||
              key.toLowerCase().includes("fee")
          );
          console.log("Price-related fields:", priceFields);
          priceFields.forEach((field) => {
            console.log(`${field}:`, (boat as any)[field]);
          });

          // Log first 3 boats with all their fields
          console.log("Frontend: First 3 boats received from backend:");
          response.data.slice(0, 3).forEach((boat, index) => {
            console.log(`Frontend Boat ${index + 1} (${boat.slug}):`, {
              id: boat.id,
              slug: boat.slug,
              title: boat.title,
              manufacturer: boat.manufacturer,
              model: boat.model,
              category: boat.category,
              country: boat.country,
              city: boat.city,
              price: boat.price,
              currency: boat.currency,
              thumb: boat.thumb,
              main_img: boat.main_img,
              year: boat.year,
              length: boat.length,
              capacity: boat.capacity,
              cabins: boat.cabins,
              isAvailable: boat.isAvailable,
              isFeatured: boat.isFeatured,
              reviewsScore: boat.reviewsScore,
              totalReviews: boat.totalReviews,
              views: boat.views,
              discount: boat.discount,
              originalPrice: boat.originalPrice,
              coordinates: boat.coordinates,
              marina: boat.marina,
              region: boat.region,
              category_slug: boat.category_slug,
              createdAt: boat.createdAt,
              updatedAt: boat.updatedAt,
            });
          });
        } else {
          console.log("Frontend: No boats received from backend");
        }
        console.log("=== END FRONTEND BOATS LOG ===");

        // Save to cache with fallback pagination
        boatsCache.set(cacheKey, {
          data: response.data || [],
          pagination: response.pagination || defaultPagination,
          timestamp: Date.now(),
        });
        console.log(`💾 Cached data for key: ${cacheKey}`);

        // Ensure pagination is valid before setting state
        const validPagination = response.pagination || defaultPagination;

        // Ensure boats is an array
        const boatsArray = Array.isArray(response.data) ? response.data : [];
        console.log("Setting state with boats:", {
          boatsArray,
          boatsLength: boatsArray.length,
          boatsIsArray: Array.isArray(boatsArray),
        });

        setState((currentState) => ({
          ...currentState,
          boats: boatsArray,
          pagination: {
            ...validPagination,
            hasNextPage:
              validPagination.currentPage < validPagination.totalPages,
            hasPreviousPage: validPagination.currentPage > 1,
          },
          loading: false,
          backgroundLoading: false,
          lastUpdated: new Date(),
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch boats";

        console.error("Error fetching boats:", errorMessage);

        setState((currentState) => ({
          ...currentState,
          error: errorMessage,
          loading: false,
          backgroundLoading: false,
        }));
      }
    },
    []
  );

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    console.log("useBoatsData: updateFilters called with:", newFilters);
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
      pagination: { ...prev.pagination, currentPage: 1 }, // Reset to first page
    }));
  }, []);

  const updatePagination = useCallback(
    (newPagination: Partial<PaginationConfig>) => {
      setState((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, ...newPagination },
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: defaultFilters,
      pagination: { ...prev.pagination, currentPage: 1 },
    }));
  }, []);

  const refreshData = useCallback(() => {
    // Clear cache before refreshing
    boatsCache.clear();
    console.log("Frontend: Cache cleared, fetching fresh data");
    fetchBoats(state.filters, state.pagination);
  }, [fetchBoats, state.filters, state.pagination]);

  // Smart auto-fetch when important parameters change (with cache support)
  useEffect(() => {
    console.log("useEffect triggered");

    // Only check for changes if we've already initialized AND have previous values
    if (
      !hasInitializedRef.current ||
      !prevFiltersRef.current ||
      !prevPaginationRef.current
    ) {
      console.log("Skipping change detection - not fully initialized");
      return;
    }

    const prevFilters = prevFiltersRef.current;
    const prevPagination = prevPaginationRef.current;

    // Check if important parameters changed
    const pageChanged =
      prevPagination?.currentPage !== state.pagination.currentPage;
    const pageSizeChanged =
      prevPagination?.itemsPerPage !== state.pagination.itemsPerPage;
    const searchChanged = prevFilters?.search !== state.filters.search;

    const importantChange = pageChanged || pageSizeChanged || searchChanged;

    console.log("Changes detected:", {
      pageChanged,
      pageSizeChanged,
      searchChanged,
      importantChange,
    });

    if (importantChange) {
      console.log("Important changes detected, debouncing API call");

      // Debounce API calls to prevent excessive requests
      const timeoutId = setTimeout(() => {
        console.log("Debounced API call executing");
        prevFiltersRef.current = state.filters;
        prevPaginationRef.current = state.pagination;
        fetchBoats(state.filters, state.pagination);
      }, 300); // 300ms debounce

      // Cleanup timeout on unmount or dependency change
      return () => {
        console.log("Cleaning up debounced API call");
        clearTimeout(timeoutId);
      };
    } else {
      console.log("No important changes detected, skipping fetchBoats");
    }
  }, [
    state.filters.search,
    state.pagination.currentPage,
    state.pagination.itemsPerPage,
    fetchBoats,
  ]);

  // Initial fetch on mount - run only once
  useEffect(() => {
    if (!hasInitializedRef.current) {
      console.log("🚀 Initial fetch on mount (first time only)");
      hasInitializedRef.current = true;

      // Set initial refs to prevent false change detection
      prevFiltersRef.current = defaultFilters;
      prevPaginationRef.current = defaultPagination;

      fetchBoats(defaultFilters, defaultPagination);
    }
  }, []); // Empty dependency array - run only once on mount

  const clearCache = useCallback(() => {
    boatsCache.clear();
    console.log("Frontend: Cache cleared manually");
  }, []);

  return {
    // State
    boats: state.boats,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    lastUpdated: state.lastUpdated,

    // Actions
    updateFilters,
    updatePagination,
    resetFilters,
    refreshData,
    fetchBoats,
    clearCache,
  };
}

// Hook for single boat details
export function useBoatDetails(slug: string) {
  const [boat, setBoat] = useState<BoatData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoatDetails = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      const boatData = await boatsApi.getBoatDetails(slug);
      setBoat(boatData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch boat details"
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBoatDetails();
  }, [fetchBoatDetails]);

  return {
    boat,
    loading,
    error,
    refetch: fetchBoatDetails,
  };
}

// Hook for boats search
export function useBoatsSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BoatData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBoats = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await boatsApi.getBoats(
        { ...defaultFilters, search: query },
        { ...defaultPagination, itemsPerPage: 50 }
      );

      setSearchResults(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    error,
    searchBoats,
    clearSearch,
  };
}

// Hook for searching specific boat in boats_list
export function useBoatSearchById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBoatById = useCallback(async (boatId: string) => {
    if (!boatId.trim()) {
      console.log("Frontend: Empty boat ID provided");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await boatsApi.searchBoatInBoatsList(boatId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Search failed";
      setError(errorMessage);
      console.error(`Frontend: Error in searchBoatById:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchBoatById,
    loading,
    error,
  };
}
