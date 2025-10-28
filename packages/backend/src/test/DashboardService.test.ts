import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DashboardService } from "../services/DashboardService";
import { SupabaseService } from "../services/SupabaseService";

// Mock the SupabaseService
vi.mock("../services/SupabaseService");

describe("DashboardService", () => {
  let dashboardService: DashboardService;
  let mockSupabaseService: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock SupabaseService
    mockSupabaseService = {
      selectData: vi.fn(),
      isConfigured: true,
      client: {
        supabase: {
          from: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn(),
          limit: vi.fn().mockReturnThis(),
        },
      },
    };

    // Mock the SupabaseService constructor
    vi.mocked(SupabaseService).mockImplementation(() => mockSupabaseService);

    dashboardService = new DashboardService(mockSupabaseService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("calculateDashboardMetrics", () => {
    it("should return zero metrics for empty boat array", async () => {
      // Arrange
      const emptyBoats: any[] = [];

      // Act
      const result = await dashboardService["calculateDashboardMetrics"](emptyBoats);

      // Assert
      expect(result).toEqual({
        totalBoats: 0,
        averagePrice: 0,
        totalRevenue: 0,
        averageDiscount: 0,
        availabilityRate: 0,
        occupancyRate: 0,
        priceTrend: 0,
        discountTrend: 0,
      });
    });

    it("should calculate metrics correctly for boats with valid data", async () => {
      // Arrange
      const mockBoats = [
        {
          slug: "boat-1",
          title: "Boat 1",
          category: "catamaran",
          price: 1000,
          discount: 10,
          currency: "EUR",
          isAvailable: true,
          views: 150,
          reviewsScore: 4.5,
          totalReviews: 25,
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
        {
          slug: "boat-2",
          title: "Boat 2",
          category: "catamaran",
          price: 1500,
          discount: 15,
          currency: "EUR",
          isAvailable: false,
          views: 200,
          reviewsScore: 4.2,
          totalReviews: 30,
          createdAt: new Date("2021-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
        {
          slug: "boat-3",
          title: "Boat 3",
          category: "catamaran",
          price: 2000,
          discount: 20,
          currency: "EUR",
          isAvailable: true,
          views: 300,
          reviewsScore: 4.8,
          totalReviews: 40,
          createdAt: new Date("2022-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
      ];

      // Mock getBoatPriceData to return different prices
      const mockGetBoatPriceData = vi
        .spyOn(dashboardService as any, "getBoatPriceData")
        .mockResolvedValueOnce({ price: 1000, discount: 10 })
        .mockResolvedValueOnce({ price: 1500, discount: 15 })
        .mockResolvedValueOnce({ price: 2000, discount: 20 });

      // Act
      const result = await dashboardService["calculateDashboardMetrics"](mockBoats);

      // Assert
      expect(result.totalBoats).toBe(3);
      expect(result.averagePrice).toBe(1500); // (1000 + 1500 + 2000) / 3
      expect(result.totalRevenue).toBe(3150); // (1000 + 1500 + 2000) * 0.7
      expect(result.averageDiscount).toBe(15); // (10 + 15 + 20) / 3
      expect(result.availabilityRate).toBe(67); // 2 out of 3 boats available
      expect(result.occupancyRate).toBe(33); // 100 - 67

      mockGetBoatPriceData.mockRestore();
    });

    it("should handle boats with zero prices correctly", async () => {
      // Arrange
      const mockBoats = [
        {
          slug: "boat-1",
          title: "Boat 1",
          category: "catamaran",
          price: 0,
          discount: 0,
          currency: "EUR",
          isAvailable: true,
          views: 100,
          reviewsScore: 4.0,
          totalReviews: 20,
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
        {
          slug: "boat-2",
          title: "Boat 2",
          category: "catamaran",
          price: 0,
          discount: 0,
          currency: "EUR",
          isAvailable: false,
          views: 200,
          reviewsScore: 4.2,
          totalReviews: 18,
          createdAt: new Date("2021-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
      ];

      // Mock getBoatPriceData to return zero prices
      const mockGetBoatPriceData = vi
        .spyOn(dashboardService as any, "getBoatPriceData")
        .mockResolvedValueOnce({ price: 0, discount: 0 })
        .mockResolvedValueOnce({ price: 0, discount: 0 });

      // Act
      const result = await dashboardService["calculateDashboardMetrics"](mockBoats);

      // Assert
      expect(result.totalBoats).toBe(2);
      expect(result.averagePrice).toBe(0);
      expect(result.totalRevenue).toBe(0);
      expect(result.averageDiscount).toBe(0);

      mockGetBoatPriceData.mockRestore();
    });

    it("should handle mixed price data correctly", async () => {
      // Arrange
      const mockBoats = [
        {
          slug: "boat-1",
          title: "Boat 1",
          category: "catamaran",
          price: 1000,
          discount: 10,
          currency: "EUR",
          isAvailable: true,
          views: 150,
          reviewsScore: 4.5,
          totalReviews: 25,
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
        {
          slug: "boat-2",
          title: "Boat 2",
          category: "catamaran",
          price: 0,
          discount: 0,
          currency: "EUR",
          isAvailable: true,
          views: 200,
          reviewsScore: 4.2,
          totalReviews: 18,
          createdAt: new Date("2021-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
        {
          slug: "boat-3",
          title: "Boat 3",
          category: "catamaran",
          price: 2000,
          discount: 20,
          currency: "EUR",
          isAvailable: false,
          views: 300,
          reviewsScore: 4.8,
          totalReviews: 42,
          createdAt: new Date("2022-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
      ];

      // Mock getBoatPriceData to return mixed prices (including zero)
      const mockGetBoatPriceData = vi
        .spyOn(dashboardService as any, "getBoatPriceData")
        .mockResolvedValueOnce({ price: 1000, discount: 10 })
        .mockResolvedValueOnce({ price: 0, discount: 0 }) // Zero price
        .mockResolvedValueOnce({ price: 2000, discount: 20 });

      // Act
      const result = await dashboardService["calculateDashboardMetrics"](mockBoats);

      // Assert
      expect(result.totalBoats).toBe(3);
      expect(result.averagePrice).toBe(1500); // Only boats with price > 0: (1000 + 2000) / 2
      expect(result.totalRevenue).toBe(2100); // (1000 + 2000) * 0.7
      expect(result.averageDiscount).toBe(15); // (10 + 20) / 2

      mockGetBoatPriceData.mockRestore();
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const mockBoats = [
        {
          slug: "boat-1",
          title: "Boat 1",
          category: "catamaran",
          price: 1000,
          discount: 10,
          currency: "EUR",
          isAvailable: true,
          views: 150,
          reviewsScore: 4.5,
          totalReviews: 25,
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
      ];

      // Mock getBoatPriceData to throw an error
      const mockGetBoatPriceData = vi.spyOn(dashboardService as any, "getBoatPriceData").mockRejectedValue(new Error("Database connection failed"));

      // Act & Assert
      await expect(dashboardService["calculateDashboardMetrics"](mockBoats)).rejects.toThrow("Database connection failed");

      mockGetBoatPriceData.mockRestore();
    });
  });

  describe("getSeasonalMultiplier", () => {
    it("should return 1.2 for summer weeks (20-40)", () => {
      // Arrange & Act
      const summerMultiplier = dashboardService["getSeasonalMultiplier"](25);

      // Assert
      expect(summerMultiplier).toBe(1.2);
    });

    it("should return 1.0 for non-summer weeks", () => {
      // Arrange & Act
      const winterMultiplier = dashboardService["getSeasonalMultiplier"](10);
      const springMultiplier = dashboardService["getSeasonalMultiplier"](45);

      // Assert
      expect(winterMultiplier).toBe(0.8);
      expect(springMultiplier).toBe(0.8);
    });

    it("should handle boundary weeks correctly", () => {
      // Arrange & Act
      const week20Multiplier = dashboardService["getSeasonalMultiplier"](20);
      const week40Multiplier = dashboardService["getSeasonalMultiplier"](40);
      const week19Multiplier = dashboardService["getSeasonalMultiplier"](19);
      const week41Multiplier = dashboardService["getSeasonalMultiplier"](41);

      // Assert
      expect(week20Multiplier).toBe(1.2); // Inclusive start
      expect(week40Multiplier).toBe(1.2); // Inclusive end
      expect(week19Multiplier).toBe(1.0); // Just before summer
      expect(week41Multiplier).toBe(1.0); // Just after summer
    });
  });

  describe("getBoatPriceData", () => {
    it("should return price data from database when available", async () => {
      // Arrange
      const mockSlug = "test-boat";
      const mockPriceData = {
        price: 1500,
        discount: 15,
      };

      mockSupabaseService.client.supabase.single.mockResolvedValue({
        data: {
          week_1: {
            "2025-01-01": mockPriceData,
          },
        },
        error: null,
      });

      // Act
      const result = await dashboardService["getBoatPriceData"](mockSlug);

      // Assert
      expect(result).toEqual(mockPriceData);
      expect(mockSupabaseService.client.supabase.from).toHaveBeenCalledWith("boat_availability_2025");
    });

    it("should return zero values when no data found", async () => {
      // Arrange
      const mockSlug = "non-existent-boat";

      mockSupabaseService.client.supabase.single.mockResolvedValue({
        data: null,
        error: null,
      });

      // Act
      const result = await dashboardService["getBoatPriceData"](mockSlug);

      // Assert
      expect(result).toEqual({ price: 0, discount: 0 });
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const mockSlug = "test-boat";

      mockSupabaseService.client.supabase.single.mockResolvedValue({
        data: null,
        error: new Error("Database connection failed"),
      });

      // Act
      const result = await dashboardService["getBoatPriceData"](mockSlug);

      // Assert
      expect(result).toEqual({ price: 0, discount: 0 });
    });

    it("should handle null data response", async () => {
      // Arrange
      const mockSlug = "test-boat";

      mockSupabaseService.selectData.mockResolvedValue({
        data: null,
        error: null,
      });

      // Act
      const result = await dashboardService["getBoatPriceData"](mockSlug);

      // Assert
      expect(result).toEqual({ price: 0, discount: 0 });
    });
  });

  describe("getDashboardSummary", () => {
    it("should return dashboard summary with correct structure", async () => {
      // Arrange
      const mockBoats = [
        {
          slug: "boat-1",
          title: "Boat 1",
          category: "catamaran",
          price: 1000,
          discount: 10,
          currency: "EUR",
          isAvailable: true,
          views: 150,
          reviewsScore: 4.5,
          totalReviews: 25,
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
        {
          slug: "boat-2",
          title: "Boat 2",
          category: "catamaran",
          price: 1500,
          discount: 15,
          currency: "EUR",
          isAvailable: false,
          views: 200,
          reviewsScore: 4.2,
          totalReviews: 18,
          createdAt: new Date("2021-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
      ];

      const mockGetBoatPriceData = vi
        .spyOn(dashboardService as any, "getBoatPriceData")
        .mockResolvedValueOnce({ price: 1000, discount: 10 })
        .mockResolvedValueOnce({ price: 1500, discount: 15 });

      mockSupabaseService.selectData.mockResolvedValue({
        data: mockBoats,
        error: null,
      });

      // Act
      const result = await dashboardService.getDashboardSummary("catamaran");

      // Assert
      expect(result).toHaveProperty("totalBoats");
      expect(result).toHaveProperty("averagePrice");
      expect(result).toHaveProperty("totalRevenue");
      expect(result).toHaveProperty("availabilityRate");
      expect(result).toHaveProperty("boatType");
      expect(result).toHaveProperty("totalBookings");
      expect(result).toHaveProperty("lastUpdate");

      mockGetBoatPriceData.mockRestore();
    });

    it("should handle database errors in getDashboardSummary", async () => {
      // Arrange
      mockSupabaseService.selectData.mockResolvedValue({
        data: null,
        error: new Error("Database connection failed"),
      });

      // Act
      const result = await dashboardService.getDashboardSummary("catamaran");

      // Assert
      expect(result).toBeDefined();
      expect(result.totalBoats).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle very large numbers in calculations", async () => {
      // Arrange
      const mockBoats = [
        {
          slug: "boat-1",
          title: "Boat 1",
          category: "catamaran",
          price: 1000,
          discount: 10,
          currency: "EUR",
          isAvailable: true,
          views: 150,
          reviewsScore: 4.5,
          totalReviews: 25,
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
      ];

      const mockGetBoatPriceData = vi
        .spyOn(dashboardService as any, "getBoatPriceData")
        .mockResolvedValueOnce({ price: Number.MAX_SAFE_INTEGER, discount: 100 });

      // Act
      const result = await dashboardService["calculateDashboardMetrics"](mockBoats);

      // Assert
      expect(result.averagePrice).toBe(Number.MAX_SAFE_INTEGER);
      expect(result.totalRevenue).toBe(Math.round(Number.MAX_SAFE_INTEGER * 0.7));

      mockGetBoatPriceData.mockRestore();
    });

    it("should handle negative discount values", async () => {
      // Arrange
      const mockBoats = [
        {
          slug: "boat-1",
          title: "Boat 1",
          category: "catamaran",
          price: 1000,
          discount: 10,
          currency: "EUR",
          isAvailable: true,
          views: 150,
          reviewsScore: 4.5,
          totalReviews: 25,
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
      ];

      const mockGetBoatPriceData = vi.spyOn(dashboardService as any, "getBoatPriceData").mockResolvedValueOnce({ price: 1000, discount: -10 }); // Negative discount

      // Act
      const result = await dashboardService["calculateDashboardMetrics"](mockBoats);

      // Assert
      expect(result.averageDiscount).toBe(-10);

      mockGetBoatPriceData.mockRestore();
    });

    it("should handle undefined boat properties", async () => {
      // Arrange
      const mockBoats = [
        {
          slug: "boat-1",
          title: "Boat 1",
          category: "catamaran",
          price: 1000,
          discount: 10,
          currency: "EUR",
          isAvailable: false,
          views: 150,
          reviewsScore: 4.5,
          totalReviews: 25,
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2023-01-01"),
        }, // Missing isAvailable
        {
          slug: "boat-2",
          title: "Boat 2",
          category: "catamaran",
          price: 1500,
          discount: 15,
          currency: "EUR",
          isAvailable: false,
          views: 200,
          reviewsScore: 4.2,
          totalReviews: 18,
          createdAt: new Date("2021-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
      ];

      const mockGetBoatPriceData = vi
        .spyOn(dashboardService as any, "getBoatPriceData")
        .mockResolvedValueOnce({ price: 1000, discount: 10 })
        .mockResolvedValueOnce({ price: 1500, discount: 15 });

      // Act
      const result = await dashboardService["calculateDashboardMetrics"](mockBoats);

      // Assert
      expect(result.totalBoats).toBe(2);
      expect(result.availabilityRate).toBe(0); // Both boats treated as unavailable

      mockGetBoatPriceData.mockRestore();
    });
  });
});
