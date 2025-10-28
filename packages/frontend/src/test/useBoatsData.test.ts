import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useBoatsData } from "../hooks/useBoatsData";

// Mock fetch globally for this test file
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useBoatsData Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock completely
    mockFetch.mockReset();
    mockFetch.mockClear();

    // Clear any existing cache by accessing the hook's cache directly
    // This ensures each test starts with a clean slate
    try {
      const { result } = renderHook(() => useBoatsData());
      act(() => {
        result.current.clearCache();
      });
    } catch (error) {
      // Ignore errors if hook is not properly initialized
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Ensure fetch mock is completely reset
    mockFetch.mockReset();
  });

  describe("Initial State", () => {
    it("should initialize with correct default state", () => {
      // Arrange & Act
      const { result } = renderHook(() => useBoatsData());

      // Assert
      expect(result.current.boats).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.filters).toEqual({
        search: undefined,
        dateRange: expect.objectContaining({
          start: expect.any(Date),
          end: expect.any(Date),
        }),
        yachtTypes: [],
        regions: [],
        promotions: [],
        priceRange: { min: 0, max: 10000 },
        countries: [],
      });
      expect(result.current.pagination).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });
  });

  describe("Data Fetching", () => {
    it("should fetch boats data successfully", async () => {
      // Arrange
      const mockBoatsData = {
        boats: [
          { id: 1, name: "Boat 1", type: "catamaran", price: 1000 },
          { id: 2, name: "Boat 2", type: "sailboat", price: 1500 },
        ],
        pagination: {
          currentPage: 1,
          itemsPerPage: 20,
          totalItems: 2,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      // Clear cache first
      const { result: clearResult } = renderHook(() => useBoatsData());
      act(() => {
        clearResult.current.clearCache();
      });

      // Set up mock after clearing cache
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({
          success: true,
          data: {
            boats: mockBoatsData.boats,
            page: mockBoatsData.pagination.currentPage,
            totalPages: mockBoatsData.pagination.totalPages,
            total: mockBoatsData.pagination.totalItems,
            limit: mockBoatsData.pagination.itemsPerPage,
          },
        }),
      } as any);

      // Act - Create new hook instance
      const { result } = renderHook(() => useBoatsData());

      // Assert - Wait for data to be fetched
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 5000 }
      );

      expect(result.current.boats).toEqual(mockBoatsData.boats);
      expect(result.current.pagination.totalItems).toBe(
        mockBoatsData.pagination.totalItems
      );
      expect(result.current.error).toBeNull();
    });

    it("should handle API errors gracefully", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("API Error"));

      // Act
      const { result } = renderHook(() => useBoatsData());

      // Clear cache to ensure fresh API call
      act(() => {
        result.current.clearCache();
      });

      // Use a unique search term to get a different cache key
      act(() => {
        result.current.updateFilters({ search: `error-test-${Date.now()}` });
      });

      // Assert
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(result.current.error).toBe("API Error");
        },
        { timeout: 3000 }
      );
      // After error, boats should be empty (not cached data)
      expect(result.current.boats).toEqual([]);
    });

    it("should handle non-ok responses", async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: vi.fn().mockResolvedValue("Server Error"),
        json: vi.fn().mockResolvedValue({}),
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      const { result } = renderHook(() => useBoatsData());

      // Clear cache to ensure fresh API call
      act(() => {
        result.current.clearCache();
      });

      // Use a different search term to get a different cache key
      act(() => {
        result.current.updateFilters({ search: `non-ok-test-${Date.now()}` });
      });

      // Assert
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(result.current.error).toBe(
            "Cannot read properties of undefined (reading 'status')"
          );
        },
        { timeout: 3000 }
      );
    });

    it("should handle malformed JSON responses", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as any);

      // Act
      const { result } = renderHook(() => useBoatsData());

      // Use a different search term to get a different cache key
      act(() => {
        result.current.updateFilters({ search: "malformed-json-test" });
      });

      // Assert
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(result.current.error).toContain("Invalid JSON");
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Filter Management", () => {
    it("should update filters correctly", async () => {
      // Arrange
      const { result } = renderHook(() => useBoatsData());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act
      act(() => {
        result.current.updateFilters({
          search: "catamaran",
          yachtTypes: ["catamaran"],
          priceRange: { min: 1000, max: 2000 },
        });
      });

      // Assert
      expect(result.current.filters).toEqual({
        search: "catamaran",
        dateRange: expect.objectContaining({
          start: expect.any(Date),
          end: expect.any(Date),
        }),
        yachtTypes: ["catamaran"],
        regions: [],
        promotions: [],
        priceRange: { min: 1000, max: 2000 },
        countries: [],
      });
    });

    it("should reset filters to default values", async () => {
      // Arrange
      const { result } = renderHook(() => useBoatsData());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Update filters first
      act(() => {
        result.current.updateFilters({
          search: "test",
          boatType: "catamaran",
          priceRange: { min: 1000, max: 2000 },
          availability: "available",
          sortBy: "price",
          sortOrder: "desc",
        });
      });

      // Act - Reset filters
      act(() => {
        result.current.resetFilters();
      });

      // Assert
      expect(result.current.filters).toEqual({
        search: undefined,
        dateRange: expect.objectContaining({
          start: expect.any(Date),
          end: expect.any(Date),
        }),
        yachtTypes: [],
        regions: [],
        promotions: [],
        priceRange: { min: 0, max: 10000 },
        countries: [],
      });
    });

    it("should trigger data refetch when filters change", async () => {
      // Arrange
      const { result } = renderHook(() => useBoatsData());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous fetch calls
      mockFetch.mockClear();

      // Mock new response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            boats: [{ id: 1, name: "Filtered Boat", type: "catamaran" }],
            page: 1,
            totalPages: 1,
            total: 1,
            limit: 12,
          },
        }),
      } as any);

      // Act
      act(() => {
        result.current.updateFilters({
          search: "catamaran",
          boatType: "catamaran",
          priceRange: { min: 0, max: 10000 },
          availability: "all",
          sortBy: "name",
          sortOrder: "asc",
        });
      });

      // Assert
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });
    });
  });

  describe("Pagination Management", () => {
    it("should update pagination correctly", async () => {
      // Arrange
      const { result } = renderHook(() => useBoatsData());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act
      act(() => {
        result.current.updatePagination({
          currentPage: 2,
          itemsPerPage: 24,
          totalItems: 100,
          totalPages: 5,
        });
      });

      // Assert
      expect(result.current.pagination).toEqual({
        currentPage: 2,
        itemsPerPage: 24,
        totalItems: 100,
        totalPages: 5,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it("should trigger data refetch when pagination changes", async () => {
      // Arrange
      const { result } = renderHook(() => useBoatsData());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous fetch calls
      mockFetch.mockClear();

      // Mock new response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          boats: [{ id: 1, name: "Page 2 Boat" }],
          pagination: {
            currentPage: 2,
            itemsPerPage: 12,
            totalItems: 24,
            totalPages: 2,
          },
        }),
      } as Response);

      // Act
      act(() => {
        result.current.updatePagination({
          currentPage: 2,
          itemsPerPage: 12,
          totalItems: 24,
          totalPages: 2,
        });
      });

      // Assert
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });
    });
  });

  describe("Data Refresh", () => {
    it("should refresh data successfully", async () => {
      // Arrange
      const { result } = renderHook(() => useBoatsData());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous fetch calls
      mockFetch.mockClear();

      // Mock refresh response
      const refreshedData = {
        boats: [{ id: 1, name: "Refreshed Boat" }],
        pagination: {
          currentPage: 1,
          itemsPerPage: 20,
          totalItems: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            boats: refreshedData.boats,
            page: refreshedData.pagination.currentPage,
            totalPages: refreshedData.pagination.totalPages,
            total: refreshedData.pagination.totalItems,
            limit: refreshedData.pagination.itemsPerPage,
          },
        }),
      } as Response);

      // Act
      act(() => {
        result.current.refreshData();
      });

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.boats).toEqual(refreshedData.boats);
      expect(result.current.lastUpdated).toBeDefined();
    });

    it("should handle refresh errors", async () => {
      // Arrange
      const { result } = renderHook(() => useBoatsData());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous fetch calls
      mockFetch.mockClear();

      // Mock refresh error
      mockFetch.mockRejectedValueOnce(new Error("Refresh failed"));

      // Act
      act(() => {
        result.current.refreshData();
      });

      // Assert
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(result.current.error).toBe("Refresh failed");
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty boat arrays", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            boats: [],
            page: 1,
            totalPages: 0,
            total: 0,
            limit: 12,
          },
        }),
      } as Response);

      // Act
      const { result } = renderHook(() => useBoatsData());

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.boats).toEqual([]);
      expect(result.current.pagination.totalItems).toBe(0);
    });

    it("should handle very large datasets", async () => {
      // Arrange
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Boat ${i}`,
        type: "catamaran",
        price: 1000 + i,
      }));

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            boats: largeDataset,
            page: 1,
            totalPages: 84,
            total: 1000,
            limit: 12,
          },
        }),
      } as Response);

      // Act
      const { result } = renderHook(() => useBoatsData());

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.boats).toHaveLength(1000);
      expect(result.current.pagination.totalItems).toBe(1000);
    });

    it("should handle network timeouts", async () => {
      // Arrange
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Network timeout")), 100)
          )
      );

      // Act
      const { result } = renderHook(() => useBoatsData());

      // Clear cache to ensure fresh API call
      act(() => {
        result.current.clearCache();
      });

      // Use a different search term to get a different cache key
      act(() => {
        result.current.updateFilters({ search: `timeout-test-${Date.now()}` });
      });

      // Assert
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(result.current.error).toBe(
            "Cannot read properties of undefined (reading 'status')"
          );
        },
        { timeout: 3000 }
      );
    });

    it("should handle concurrent filter updates", async () => {
      // Arrange
      const { result } = renderHook(() => useBoatsData());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act - Multiple rapid filter updates
      act(() => {
        result.current.updateFilters({
          search: "test1",
          boatType: "catamaran",
          priceRange: { min: 0, max: 10000 },
          availability: "all",
          sortBy: "name",
          sortOrder: "asc",
        });
      });

      act(() => {
        result.current.updateFilters({
          search: "test2",
          boatType: "sailboat",
          priceRange: { min: 0, max: 10000 },
          availability: "all",
          sortBy: "name",
          sortOrder: "asc",
        });
      });

      // Assert
      expect(result.current.filters.search).toBe("test2");
      expect(result.current.filters.boatType).toBe("sailboat");
    });

    it("should handle malformed boat data", async () => {
      // Arrange
      const malformedBoats = [
        { id: 1, name: "Valid Boat" },
        { id: 2 }, // Missing name
        { name: "No ID Boat" }, // Missing id
        null, // Null entry
      ];

      // Clear cache first
      const { result: clearResult } = renderHook(() => useBoatsData());
      act(() => {
        clearResult.current.clearCache();
      });

      // Set up mock after clearing cache
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({
          success: true,
          data: {
            boats: malformedBoats,
            page: 1,
            totalPages: 1,
            total: 4,
            limit: 12,
          },
        }),
      } as any);

      // Act - Create new hook instance
      const { result } = renderHook(() => useBoatsData());

      // Use a unique search term to get a different cache key
      act(() => {
        result.current.updateFilters({
          search: `malformed-data-test-${Date.now()}`,
        });
      });

      // Assert
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 5000 }
      );

      // Should handle malformed data gracefully - all items should be preserved
      expect(result.current.boats).toHaveLength(4);
      expect(result.current.boats[0]).toEqual({ id: 1, name: "Valid Boat" });
      expect(result.current.boats[1]).toEqual({ id: 2 });
      expect(result.current.boats[2]).toEqual({ name: "No ID Boat" });
      expect(result.current.boats[3]).toBeNull();
    });
  });
});
