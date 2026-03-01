"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const DashboardService_1 = require("../services/DashboardService");
const SupabaseService_1 = require("../services/SupabaseService");
// Mock the SupabaseService
vitest_1.vi.mock("../services/SupabaseService");
(0, vitest_1.describe)("DashboardService", () => {
    let dashboardService;
    let mockSupabaseService;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        // Create mock SupabaseService
        mockSupabaseService = {
            selectData: vitest_1.vi.fn(),
            isConfigured: true,
            client: {
                supabase: {
                    from: vitest_1.vi.fn().mockReturnThis(),
                    select: vitest_1.vi.fn().mockReturnThis(),
                    eq: vitest_1.vi.fn().mockReturnThis(),
                    single: vitest_1.vi.fn(),
                    limit: vitest_1.vi.fn().mockReturnThis(),
                },
            },
        };
        // Mock the SupabaseService constructor
        vitest_1.vi.mocked(SupabaseService_1.SupabaseService).mockImplementation(() => mockSupabaseService);
        dashboardService = new DashboardService_1.DashboardService(mockSupabaseService);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("calculateDashboardMetrics", () => {
        (0, vitest_1.it)("should return zero metrics for empty boat array", async () => {
            // Arrange
            const emptyBoats = [];
            // Act
            const result = await dashboardService["calculateDashboardMetrics"](emptyBoats);
            // Assert
            (0, vitest_1.expect)(result).toEqual({
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
        (0, vitest_1.it)("should calculate metrics correctly for boats with valid data", async () => {
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
            const mockGetBoatPriceData = vitest_1.vi
                .spyOn(dashboardService, "getBoatPriceData")
                .mockResolvedValueOnce({ price: 1000, discount: 10 })
                .mockResolvedValueOnce({ price: 1500, discount: 15 })
                .mockResolvedValueOnce({ price: 2000, discount: 20 });
            // Act
            const result = await dashboardService["calculateDashboardMetrics"](mockBoats);
            // Assert
            (0, vitest_1.expect)(result.totalBoats).toBe(3);
            (0, vitest_1.expect)(result.averagePrice).toBe(1500); // (1000 + 1500 + 2000) / 3
            (0, vitest_1.expect)(result.totalRevenue).toBe(3150); // (1000 + 1500 + 2000) * 0.7
            (0, vitest_1.expect)(result.averageDiscount).toBe(15); // (10 + 15 + 20) / 3
            (0, vitest_1.expect)(result.availabilityRate).toBe(67); // 2 out of 3 boats available
            (0, vitest_1.expect)(result.occupancyRate).toBe(33); // 100 - 67
            mockGetBoatPriceData.mockRestore();
        });
        (0, vitest_1.it)("should handle boats with zero prices correctly", async () => {
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
            const mockGetBoatPriceData = vitest_1.vi
                .spyOn(dashboardService, "getBoatPriceData")
                .mockResolvedValueOnce({ price: 0, discount: 0 })
                .mockResolvedValueOnce({ price: 0, discount: 0 });
            // Act
            const result = await dashboardService["calculateDashboardMetrics"](mockBoats);
            // Assert
            (0, vitest_1.expect)(result.totalBoats).toBe(2);
            (0, vitest_1.expect)(result.averagePrice).toBe(0);
            (0, vitest_1.expect)(result.totalRevenue).toBe(0);
            (0, vitest_1.expect)(result.averageDiscount).toBe(0);
            mockGetBoatPriceData.mockRestore();
        });
        (0, vitest_1.it)("should handle mixed price data correctly", async () => {
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
            const mockGetBoatPriceData = vitest_1.vi
                .spyOn(dashboardService, "getBoatPriceData")
                .mockResolvedValueOnce({ price: 1000, discount: 10 })
                .mockResolvedValueOnce({ price: 0, discount: 0 }) // Zero price
                .mockResolvedValueOnce({ price: 2000, discount: 20 });
            // Act
            const result = await dashboardService["calculateDashboardMetrics"](mockBoats);
            // Assert
            (0, vitest_1.expect)(result.totalBoats).toBe(3);
            (0, vitest_1.expect)(result.averagePrice).toBe(1500); // Only boats with price > 0: (1000 + 2000) / 2
            (0, vitest_1.expect)(result.totalRevenue).toBe(2100); // (1000 + 2000) * 0.7
            (0, vitest_1.expect)(result.averageDiscount).toBe(15); // (10 + 20) / 2
            mockGetBoatPriceData.mockRestore();
        });
        (0, vitest_1.it)("should handle database errors gracefully", async () => {
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
            const mockGetBoatPriceData = vitest_1.vi.spyOn(dashboardService, "getBoatPriceData").mockRejectedValue(new Error("Database connection failed"));
            // Act & Assert
            await (0, vitest_1.expect)(dashboardService["calculateDashboardMetrics"](mockBoats)).rejects.toThrow("Database connection failed");
            mockGetBoatPriceData.mockRestore();
        });
    });
    (0, vitest_1.describe)("getSeasonalMultiplier", () => {
        (0, vitest_1.it)("should return 1.2 for summer weeks (20-40)", () => {
            // Arrange & Act
            const summerMultiplier = dashboardService["getSeasonalMultiplier"](25);
            // Assert
            (0, vitest_1.expect)(summerMultiplier).toBe(1.2);
        });
        (0, vitest_1.it)("should return 1.0 for non-summer weeks", () => {
            // Arrange & Act
            const winterMultiplier = dashboardService["getSeasonalMultiplier"](10);
            const springMultiplier = dashboardService["getSeasonalMultiplier"](45);
            // Assert
            (0, vitest_1.expect)(winterMultiplier).toBe(0.8);
            (0, vitest_1.expect)(springMultiplier).toBe(0.8);
        });
        (0, vitest_1.it)("should handle boundary weeks correctly", () => {
            // Arrange & Act
            const week20Multiplier = dashboardService["getSeasonalMultiplier"](20);
            const week40Multiplier = dashboardService["getSeasonalMultiplier"](40);
            const week19Multiplier = dashboardService["getSeasonalMultiplier"](19);
            const week41Multiplier = dashboardService["getSeasonalMultiplier"](41);
            // Assert
            (0, vitest_1.expect)(week20Multiplier).toBe(1.2); // Inclusive start
            (0, vitest_1.expect)(week40Multiplier).toBe(1.2); // Inclusive end
            (0, vitest_1.expect)(week19Multiplier).toBe(1.0); // Just before summer
            (0, vitest_1.expect)(week41Multiplier).toBe(1.0); // Just after summer
        });
    });
    (0, vitest_1.describe)("getBoatPriceData", () => {
        (0, vitest_1.it)("should return price data from database when available", async () => {
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
            (0, vitest_1.expect)(result).toEqual(mockPriceData);
            (0, vitest_1.expect)(mockSupabaseService.client.supabase.from).toHaveBeenCalledWith("boat_availability_2025");
        });
        (0, vitest_1.it)("should return zero values when no data found", async () => {
            // Arrange
            const mockSlug = "non-existent-boat";
            mockSupabaseService.client.supabase.single.mockResolvedValue({
                data: null,
                error: null,
            });
            // Act
            const result = await dashboardService["getBoatPriceData"](mockSlug);
            // Assert
            (0, vitest_1.expect)(result).toEqual({ price: 0, discount: 0 });
        });
        (0, vitest_1.it)("should handle database errors gracefully", async () => {
            // Arrange
            const mockSlug = "test-boat";
            mockSupabaseService.client.supabase.single.mockResolvedValue({
                data: null,
                error: new Error("Database connection failed"),
            });
            // Act
            const result = await dashboardService["getBoatPriceData"](mockSlug);
            // Assert
            (0, vitest_1.expect)(result).toEqual({ price: 0, discount: 0 });
        });
        (0, vitest_1.it)("should handle null data response", async () => {
            // Arrange
            const mockSlug = "test-boat";
            mockSupabaseService.selectData.mockResolvedValue({
                data: null,
                error: null,
            });
            // Act
            const result = await dashboardService["getBoatPriceData"](mockSlug);
            // Assert
            (0, vitest_1.expect)(result).toEqual({ price: 0, discount: 0 });
        });
    });
    (0, vitest_1.describe)("getDashboardSummary", () => {
        (0, vitest_1.it)("should return dashboard summary with correct structure", async () => {
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
            const mockGetBoatPriceData = vitest_1.vi
                .spyOn(dashboardService, "getBoatPriceData")
                .mockResolvedValueOnce({ price: 1000, discount: 10 })
                .mockResolvedValueOnce({ price: 1500, discount: 15 });
            mockSupabaseService.selectData.mockResolvedValue({
                data: mockBoats,
                error: null,
            });
            // Act
            const result = await dashboardService.getDashboardSummary("catamaran");
            // Assert
            (0, vitest_1.expect)(result).toHaveProperty("totalBoats");
            (0, vitest_1.expect)(result).toHaveProperty("averagePrice");
            (0, vitest_1.expect)(result).toHaveProperty("totalRevenue");
            (0, vitest_1.expect)(result).toHaveProperty("availabilityRate");
            (0, vitest_1.expect)(result).toHaveProperty("boatType");
            (0, vitest_1.expect)(result).toHaveProperty("totalBookings");
            (0, vitest_1.expect)(result).toHaveProperty("lastUpdate");
            mockGetBoatPriceData.mockRestore();
        });
        (0, vitest_1.it)("should handle database errors in getDashboardSummary", async () => {
            // Arrange
            mockSupabaseService.selectData.mockResolvedValue({
                data: null,
                error: new Error("Database connection failed"),
            });
            // Act
            const result = await dashboardService.getDashboardSummary("catamaran");
            // Assert
            (0, vitest_1.expect)(result).toBeDefined();
            (0, vitest_1.expect)(result.totalBoats).toBeGreaterThanOrEqual(0);
        });
    });
    (0, vitest_1.describe)("Edge Cases and Error Handling", () => {
        (0, vitest_1.it)("should handle very large numbers in calculations", async () => {
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
            const mockGetBoatPriceData = vitest_1.vi
                .spyOn(dashboardService, "getBoatPriceData")
                .mockResolvedValueOnce({ price: Number.MAX_SAFE_INTEGER, discount: 100 });
            // Act
            const result = await dashboardService["calculateDashboardMetrics"](mockBoats);
            // Assert
            (0, vitest_1.expect)(result.averagePrice).toBe(Number.MAX_SAFE_INTEGER);
            (0, vitest_1.expect)(result.totalRevenue).toBe(Math.round(Number.MAX_SAFE_INTEGER * 0.7));
            mockGetBoatPriceData.mockRestore();
        });
        (0, vitest_1.it)("should handle negative discount values", async () => {
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
            const mockGetBoatPriceData = vitest_1.vi.spyOn(dashboardService, "getBoatPriceData").mockResolvedValueOnce({ price: 1000, discount: -10 }); // Negative discount
            // Act
            const result = await dashboardService["calculateDashboardMetrics"](mockBoats);
            // Assert
            (0, vitest_1.expect)(result.averageDiscount).toBe(-10);
            mockGetBoatPriceData.mockRestore();
        });
        (0, vitest_1.it)("should handle undefined boat properties", async () => {
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
            const mockGetBoatPriceData = vitest_1.vi
                .spyOn(dashboardService, "getBoatPriceData")
                .mockResolvedValueOnce({ price: 1000, discount: 10 })
                .mockResolvedValueOnce({ price: 1500, discount: 15 });
            // Act
            const result = await dashboardService["calculateDashboardMetrics"](mockBoats);
            // Assert
            (0, vitest_1.expect)(result.totalBoats).toBe(2);
            (0, vitest_1.expect)(result.availabilityRate).toBe(0); // Both boats treated as unavailable
            mockGetBoatPriceData.mockRestore();
        });
    });
});
