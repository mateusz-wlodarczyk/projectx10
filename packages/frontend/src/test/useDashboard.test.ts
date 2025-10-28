import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useDashboard } from "../hooks/useDashboard";

// Mock fetch globally for this test file
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useDashboard Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("should initialize with correct default state", () => {
      // Arrange & Act
      const { result } = renderHook(() => useDashboard());

      // Assert
      expect(result.current.summary).toBeNull();
      expect(result.current.metrics).toEqual([]);
      expect(result.current.priceData).toBeNull();
      expect(result.current.discountData).toBeNull();
      expect(result.current.availabilityData).toBeNull();
      expect(result.current.revenueData).toBeNull();
      expect(result.current.summaryStats).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.lastRefresh).toBeNull();
    });

    it("should initialize with custom boat type", () => {
      // Arrange & Act
      const { result } = renderHook(() => useDashboard("sailboat"));

      // Assert
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  describe("Data Fetching", () => {
    it("should fetch all dashboard data successfully", async () => {
      // Arrange
      const mockSummaryData = {
        totalBoats: 100,
        averagePrice: 1500,
        totalRevenue: 150000,
        averageDiscount: 15,
        availabilityRate: 75,
        occupancyRate: 25,
        priceTrend: 2.5,
        discountTrend: -1.2,
      };

      const mockMetricsData = [
        { id: "total-boats", label: "Total Boats", value: 100, trend: 5 },
        { id: "revenue", label: "Revenue", value: 150000, trend: 12 },
      ];

      const mockPriceData = {
        labels: ["Week 1", "Week 2"],
        datasets: [{ data: [1000, 1200] }],
      };

      const mockDiscountData = {
        labels: ["Week 1", "Week 2"],
        datasets: [{ data: [10, 15] }],
      };

      const mockAvailabilityData = {
        labels: ["Week 1", "Week 2"],
        datasets: [{ data: [75, 80] }],
      };

      const mockRevenueData = {
        labels: ["Week 1", "Week 2"],
        datasets: [{ data: [10000, 12000] }],
      };

      const mockSummaryStats = [
        { label: "Active Boats", value: 100, change: 5 },
        { label: "Bookings", value: 250, change: 12 },
      ];

      // Mock all API responses
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ summary: mockSummaryData }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ metrics: mockMetricsData }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ priceData: mockPriceData }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ discountData: mockDiscountData }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ availabilityData: mockAvailabilityData }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ revenueData: mockRevenueData }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ stats: mockSummaryStats }),
        } as Response);

      // Act
      const { result } = renderHook(() => useDashboard());

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.summary).toEqual(mockSummaryData);
      expect(result.current.metrics).toEqual(mockMetricsData);
      expect(result.current.priceData).toEqual(mockPriceData);
      expect(result.current.discountData).toEqual(mockDiscountData);
      expect(result.current.availabilityData).toEqual(mockAvailabilityData);
      expect(result.current.revenueData).toEqual(mockRevenueData);
      expect(result.current.summaryStats).toEqual(mockSummaryStats);
      expect(result.current.error).toBeNull();
      expect(result.current.lastRefresh).toBeDefined();
    });

    it("should handle API errors gracefully", async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error("API Error"));

      // Act
      const { result } = renderHook(() => useDashboard());

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
      expect(result.current.summary).toBeNull();
    });

    it("should handle partial API failures", async () => {
      // Arrange
      const mockSummaryData = { totalBoats: 100 };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ summary: mockSummaryData }),
        } as Response)
        .mockRejectedValueOnce(new Error("Metrics API Error"))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ stats: [] }),
        } as Response);

      // Act
      const { result } = renderHook(() => useDashboard());

      // Assert
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(result.current.error).toBe("Metrics API Error");
        },
        { timeout: 5000 }
      );
      expect(result.current.summary).toEqual(mockSummaryData);
      expect(result.current.metrics).toEqual([]);
    });

    it("should handle non-ok responses", async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: vi.fn().mockResolvedValue("Server Error"),
      } as Response);

      // Act
      const { result } = renderHook(() => useDashboard());

      // Assert
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(result.current.error).toContain("HTTP error! status: 500");
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Data Refresh", () => {
    it("should refresh all data successfully", async () => {
      // Arrange
      const { result } = renderHook(() => useDashboard());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous fetch calls
      mockFetch.mockClear();

      // Mock refresh responses
      const refreshedData = {
        totalBoats: 150,
        averagePrice: 1800,
        totalRevenue: 200000,
        averageDiscount: 20,
        availabilityRate: 80,
        occupancyRate: 20,
        priceTrend: 3.0,
        discountTrend: -2.0,
      };

      // Mock all API responses for refresh
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ summary: refreshedData }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ metrics: [] }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ stats: [] }),
        } as Response);

      // Act
      act(() => {
        result.current.refresh();
      });

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.summary).toEqual(refreshedData);
      expect(result.current.lastRefresh).toBeDefined();
    });

    it("should handle refresh errors", async () => {
      // Arrange
      const { result } = renderHook(() => useDashboard());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous fetch calls
      mockFetch.mockClear();

      // Mock refresh error
      mockFetch.mockRejectedValue(new Error("Refresh failed"));

      // Act
      act(() => {
        result.current.refresh();
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

  describe("Discount Data Refresh", () => {
    it("should refresh discount data with custom time range", async () => {
      // Arrange
      const refreshedDiscountData = {
        labels: ["Month 1", "Month 2"],
        datasets: [{ data: [15, 20] }],
      };

      // Mock all the initial fetch calls
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ summary: { totalBoats: 100 } }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ metrics: [] }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ priceData: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ discountData: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ availabilityData: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ revenueData: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ stats: [] }),
        } as Response);

      const { result } = renderHook(() => useDashboard());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous fetch calls and mock the discount refresh
      mockFetch.mockClear();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ discountData: refreshedDiscountData }),
      } as Response);

      // Act
      act(() => {
        result.current.refreshDiscountData("month");
      });

      // Assert
      await waitFor(() => {
        expect(result.current.discountData).toEqual(refreshedDiscountData);
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("discount-trends")
      );
    });

    it("should handle discount refresh errors", async () => {
      // Arrange
      const { result } = renderHook(() => useDashboard());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous fetch calls
      mockFetch.mockClear();

      // Mock discount refresh error
      mockFetch.mockRejectedValue(new Error("Discount refresh failed"));

      // Act
      act(() => {
        result.current.refreshDiscountData("month");
      });

      // Assert
      // Should not update discount data on error
      expect(result.current.discountData).toBeNull();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty data responses", async () => {
      // Arrange
      // Mock all API responses with empty data
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ summary: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ metrics: [] }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ priceData: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ discountData: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ availabilityData: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ revenueData: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ stats: [] }),
        } as Response);

      // Act
      const { result } = renderHook(() => useDashboard());

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.summary).toBeNull();
      expect(result.current.metrics).toEqual([]);
      expect(result.current.priceData).toBeNull();
    });

    it("should handle malformed JSON responses", async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as Response);

      // Act
      const { result } = renderHook(() => useDashboard());

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

    it("should handle network timeouts", async () => {
      // Arrange
      mockFetch.mockImplementation(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Network timeout")), 100)
          )
      );

      // Act
      const { result } = renderHook(() => useDashboard());

      // Assert
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(result.current.error).toBe("Network timeout");
        },
        { timeout: 3000 }
      );
    });

    it("should handle concurrent refresh calls", async () => {
      // Arrange - Mock all initial API responses
      mockFetch
        .mockResolvedValue({
          ok: true,
          json: async () => ({ summary: { totalBoats: 100 } }),
        } as Response)
        .mockResolvedValue({
          ok: true,
          json: async () => ({ metrics: [] }),
        } as Response)
        .mockResolvedValue({
          ok: true,
          json: async () => ({ priceData: null }),
        } as Response)
        .mockResolvedValue({
          ok: true,
          json: async () => ({ discountData: null }),
        } as Response)
        .mockResolvedValue({
          ok: true,
          json: async () => ({ availabilityData: null }),
        } as Response)
        .mockResolvedValue({
          ok: true,
          json: async () => ({ revenueData: null }),
        } as Response)
        .mockResolvedValue({
          ok: true,
          json: async () => ({ stats: [] }),
        } as Response);

      const { result } = renderHook(() => useDashboard());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous fetch calls and mock for concurrent calls
      mockFetch.mockClear();
      mockFetch
        .mockResolvedValue({
          ok: true,
          json: async () => ({ summary: { totalBoats: 200 } }),
        } as Response)
        .mockResolvedValue({
          ok: true,
          json: async () => ({ metrics: [] }),
        } as Response)
        .mockResolvedValue({
          ok: true,
          json: async () => ({ priceData: null }),
        } as Response)
        .mockResolvedValue({
          ok: true,
          json: async () => ({ discountData: null }),
        } as Response)
        .mockResolvedValue({
          ok: true,
          json: async () => ({ availabilityData: null }),
        } as Response)
        .mockResolvedValue({
          ok: true,
          json: async () => ({ revenueData: null }),
        } as Response)
        .mockResolvedValue({
          ok: true,
          json: async () => ({ stats: [] }),
        } as Response);

      // Act - Multiple concurrent refresh calls
      act(() => {
        result.current.refresh();
        result.current.refresh();
        result.current.refresh();
      });

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should handle concurrent calls gracefully - no errors should occur
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it("should handle very large datasets", async () => {
      // Arrange
      const largeMetricsData = Array.from({ length: 1000 }, (_, i) => ({
        id: `metric-${i}`,
        label: `Metric ${i}`,
        value: i * 100,
        trend: i % 2 === 0 ? 5 : -3,
      }));

      // Mock all API responses with large dataset
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ summary: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ metrics: largeMetricsData }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: null }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ stats: [] }),
        } as Response);

      // Act
      const { result } = renderHook(() => useDashboard());

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.metrics).toHaveLength(1000);
    });
  });

  describe("Performance Considerations", () => {
    it("should not make unnecessary API calls on re-renders", async () => {
      // Arrange
      const { result, rerender } = renderHook(() => useDashboard());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous fetch calls
      mockFetch.mockClear();

      // Act - Re-render with same props
      rerender();

      // Assert
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should handle rapid refresh calls efficiently", async () => {
      // Arrange
      const { result } = renderHook(() => useDashboard());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous fetch calls
      mockFetch.mockClear();

      // Mock slow response for all API calls
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ summary: { totalBoats: 100 } }),
                } as Response),
              100
            )
          )
      );

      // Act - Rapid refresh calls
      act(() => {
        result.current.refresh();
      });

      act(() => {
        result.current.refresh();
      });

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should handle rapid calls without issues
      expect(result.current.summary).toBeDefined();
    });
  });
});
