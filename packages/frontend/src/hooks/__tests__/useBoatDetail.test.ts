import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useBoatDetail } from "../useBoatDetail";

// Mock fetch globally for this test file
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock console methods to avoid noise in tests (commented out for debugging)
// const mockConsole = {
//   log: vi.fn(),
//   error: vi.fn(),
//   warn: vi.fn(),
//   info: vi.fn(),
// };

// Object.assign(console, mockConsole);

describe("useBoatDetail Hook", () => {
  const mockSlug = "test-boat-1";
  const mockBoatDetails = {
    id: "boat-1",
    name: "Test Boat",
    type: "catamaran",
    length: 40,
    capacity: 8,
    price: 1000,
    location: "Test Location",
    description: "Test Description",
    amenities: ["wifi", "ac"],
    images: ["image1.jpg", "image2.jpg"],
  };

  const mockAvailabilityData = {
    id: 1,
    slug: "test-boat-1",
    week_1: {
      "2025-01-01T00:00:00Z": {
        price: 1000,
        discount: 0,
        createdAt: "2025-01-01T00:00:00Z",
      },
    },
    week_2: {
      "2025-01-08T00:00:00Z": {
        price: 1000,
        discount: 0,
        createdAt: "2025-01-08T00:00:00Z",
      },
    },
    week_3: null,
    week_4: null,
    week_5: null,
    week_6: null,
    week_7: null,
    week_8: null,
    week_9: null,
    week_10: null,
    week_11: null,
    week_12: null,
    week_13: null,
    week_14: null,
    week_15: null,
    week_16: null,
    week_17: null,
    week_18: null,
    week_19: null,
    week_20: null,
    week_21: null,
    week_22: null,
    week_23: null,
    week_24: null,
    week_25: null,
    week_26: null,
    week_27: null,
    week_28: null,
    week_29: null,
    week_30: null,
    week_31: null,
    week_32: null,
    week_33: null,
    week_34: null,
    week_35: null,
    week_36: null,
    week_37: null,
    week_38: null,
    week_39: null,
    week_40: null,
    week_41: null,
    week_42: null,
    week_43: null,
    week_44: null,
    week_45: null,
    week_46: null,
    week_47: null,
    week_48: null,
    week_49: null,
    week_50: null,
    week_51: null,
    week_52: null,
    week_53: null,
  };

  const mockChartData = {
    priceChart: {
      labels: ["Week 1", "Week 2"],
      datasets: [
        {
          label: "Price",
          data: [1000, 1000],
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.1)",
        },
      ],
    },
    discountChart: {
      labels: ["Week 1", "Week 2"],
      datasets: [
        {
          label: "Discount",
          data: [0, 0],
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
        },
      ],
    },
    timelineData: {
      labels: ["Week 1", "Week 2"],
      datasets: [
        {
          label: "Availability",
          data: [1, 0],
          backgroundColor: ["green", "red"],
        },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
    // mockConsole.log.mockClear();
    // mockConsole.error.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("should initialize with correct default state", () => {
      // Arrange & Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      // Assert
      expect(result.current.boatDetails).toBeNull();
      expect(result.current.availabilityData).toBeNull();
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.chartData.priceChart).toBeNull();
      expect(result.current.chartData.discountChart).toBeNull();
      expect(result.current.chartData.timelineData).toBeNull();
      expect(result.current.selectedWeek).toBeNull();
      expect(result.current.selectedTimeRange).toBe("all");
    });
  });

  describe("Data Fetching", () => {
    it("should fetch boat details successfully", async () => {
      // Arrange
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockBoatDetails,
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockAvailabilityData,
          }),
        } as Response);

      // Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      // Assert
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          console.log("Boat details:", result.current.boatDetails);
          console.log("Loading:", result.current.loading);
          console.log("Error:", result.current.error);
          expect(result.current.boatDetails).toEqual(mockBoatDetails);
        },
        { timeout: 3000 }
      );

      expect(result.current.error).toBeNull();
    });

    it("should fetch availability data successfully", async () => {
      // Arrange
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockBoatDetails,
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockAvailabilityData,
          }),
        } as Response);

      // Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      // Assert
      await waitFor(
        () => {
          expect(result.current.availabilityData).toEqual(mockAvailabilityData);
        },
        { timeout: 3000 }
      );
    });

    it("should handle API errors gracefully", async () => {
      // Arrange
      vi.mocked(fetch).mockRejectedValueOnce(new Error("API Error"));

      // Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

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

      expect(result.current.boatDetails).toBeNull();
    });

    it("should handle non-successful API responses", async () => {
      // Arrange
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      } as Response);

      // Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      // Assert
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(result.current.error).toContain(
            "Failed to fetch boat details"
          );
        },
        { timeout: 3000 }
      );
    });

    it("should handle API response with success: false", async () => {
      // Arrange
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: false,
            message: "Boat not found",
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockAvailabilityData,
          }),
        } as Response);

      // Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      // Assert
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(result.current.error).toBe("Boat not found");
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Chart Data Processing", () => {
    it("should process chart data correctly", async () => {
      // Arrange
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockBoatDetails,
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockAvailabilityData,
          }),
        } as Response);

      // Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      // Assert
      await waitFor(
        () => {
          expect(result.current.chartData.priceChart).toBeDefined();
          expect(result.current.chartData.discountChart).toBeDefined();
          expect(result.current.chartData.timelineData).toBeDefined();
        },
        { timeout: 3000 }
      );

      expect(result.current.chartData.priceChart?.weeks).toHaveLength(2);
      expect(result.current.chartData.priceChart?.weeks[0].week).toBe(1);
      expect(result.current.chartData.priceChart?.weeks[1].week).toBe(2);
      expect(result.current.chartData.priceChart?.weeks[0].price).toBe(1000);
      expect(result.current.chartData.priceChart?.weeks[1].price).toBe(1000);
    });

    it("should handle empty availability data", async () => {
      // Arrange
      const emptyAvailabilityData = { weeks: [] };

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockBoatDetails,
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: emptyAvailabilityData,
          }),
        } as Response);

      // Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      // Assert
      await waitFor(
        () => {
          expect(result.current.chartData.priceChart).toBeNull();
          expect(result.current.chartData.discountChart).toBeNull();
          expect(result.current.chartData.timelineData).toBeNull();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Week Selection", () => {
    it("should update selected week", async () => {
      // Arrange
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockBoatDetails,
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockAvailabilityData,
          }),
        } as Response);

      // Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      act(() => {
        result.current.setSelectedWeek(1);
      });

      // Assert
      expect(result.current.selectedWeek).toBe(1);
    });

    it("should clear selected week when set to null", async () => {
      // Arrange
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockBoatDetails,
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockAvailabilityData,
          }),
        } as Response);

      // Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      act(() => {
        result.current.setSelectedWeek(1);
      });

      act(() => {
        result.current.setSelectedWeek(null);
      });

      // Assert
      expect(result.current.selectedWeek).toBeNull();
    });
  });

  describe("Time Range Selection", () => {
    it("should update selected time range", async () => {
      // Arrange
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockBoatDetails,
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockAvailabilityData,
          }),
        } as Response);

      // Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      act(() => {
        result.current.setSelectedTimeRange("month");
      });

      // Assert
      expect(result.current.selectedTimeRange).toBe("month");
    });
  });

  describe("Data Refresh", () => {
    it("should refresh data when refreshData is called", async () => {
      // Arrange
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockBoatDetails,
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockAvailabilityData,
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: { ...mockBoatDetails, name: "Updated Boat" },
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockAvailabilityData,
          }),
        } as Response);

      // Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 3000 }
      );

      act(() => {
        result.current.refreshData();
      });

      // Assert
      await waitFor(
        () => {
          expect(result.current.boatDetails?.name).toBe("Updated Boat");
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Data Validation", () => {
    it("should handle hasData correctly", async () => {
      // Arrange
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockBoatDetails,
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockAvailabilityData,
          }),
        } as Response);

      // Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      // Assert
      await waitFor(
        () => {
          expect(result.current.hasData).toBe(true);
        },
        { timeout: 3000 }
      );
    });

    it("should handle hasChartData correctly", async () => {
      // Arrange
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockBoatDetails,
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockAvailabilityData,
          }),
        } as Response);

      // Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      // Assert
      await waitFor(
        () => {
          expect(result.current.hasChartData).toBe(true);
        },
        { timeout: 3000 }
      );
    });

    it("should return false for hasData when no data is available", () => {
      // Arrange & Act
      const { result } = renderHook(() => useBoatDetail(mockSlug));

      // Assert
      expect(result.current.hasData).toBe(false);
      expect(result.current.hasChartData).toBe(false);
    });
  });
});
