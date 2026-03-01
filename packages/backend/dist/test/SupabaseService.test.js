"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const SupabaseService_1 = require("../services/SupabaseService");
const RepositoryService_1 = require("../api/RepositoryService");
// Mock the RepositoryService
vitest_1.vi.mock("../api/RepositoryService");
(0, vitest_1.describe)("SupabaseService", () => {
    let supabaseService;
    let mockRepositoryService;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        // Mock RepositoryService
        mockRepositoryService = {
            select: vitest_1.vi.fn().mockResolvedValue({ data: [], error: null }),
            upsert: vitest_1.vi.fn().mockResolvedValue({ data: [], error: null }),
            eq: vitest_1.vi.fn().mockReturnThis(),
            single: vitest_1.vi.fn().mockResolvedValue({ data: null, error: null }),
            then: vitest_1.vi.fn(),
            supabase: {
                from: vitest_1.vi.fn().mockReturnThis(),
                select: vitest_1.vi.fn().mockReturnThis(),
                insert: vitest_1.vi.fn().mockReturnThis(),
                update: vitest_1.vi.fn().mockReturnThis(),
                delete: vitest_1.vi.fn().mockReturnThis(),
                eq: vitest_1.vi.fn().mockReturnThis(),
                single: vitest_1.vi.fn().mockResolvedValue({ data: null, error: null }),
            },
            auth: {
                signUp: vitest_1.vi.fn().mockResolvedValue({ data: null, error: null }),
                signInWithPassword: vitest_1.vi.fn().mockResolvedValue({ data: null, error: null }),
                signOut: vitest_1.vi.fn().mockResolvedValue({ error: null }),
            },
        };
        vitest_1.vi.mocked(RepositoryService_1.RepositoryService).mockImplementation(() => mockRepositoryService);
        // Mock environment variables
        vitest_1.vi.stubGlobal("process", {
            ...process,
            env: {
                ...process.env,
                SUPABASE_URL: "https://test.supabase.co",
                SUPABASE_KEY: "test-anon-key",
                SUPABASE_SERVICE_ROLE_KEY: "test-service-key",
            },
        });
        supabaseService = new SupabaseService_1.SupabaseService();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("Initialization", () => {
        (0, vitest_1.it)("should initialize successfully with valid credentials", () => {
            // Arrange & Act
            const service = new SupabaseService_1.SupabaseService();
            // Assert
            (0, vitest_1.expect)(service.isConfigured).toBe(true);
            (0, vitest_1.expect)(service.client).toBeDefined();
            (0, vitest_1.expect)(service.adminClient).toBeDefined();
        });
        (0, vitest_1.it)("should handle missing credentials gracefully", () => {
            // Arrange
            vitest_1.vi.stubGlobal("process", {
                ...process,
                env: {
                    ...process.env,
                    SUPABASE_URL: undefined,
                    SUPABASE_KEY: undefined,
                },
            });
            // Act
            const service = new SupabaseService_1.SupabaseService();
            // Assert
            (0, vitest_1.expect)(service.isConfigured).toBe(false);
            (0, vitest_1.expect)(service.client).toBeNull();
            (0, vitest_1.expect)(service.adminClient).toBeNull();
        });
    });
    (0, vitest_1.describe)("Database Operations", () => {
        (0, vitest_1.beforeEach)(() => {
            // Ensure service is configured
            supabaseService.isConfigured = true;
            supabaseService.client = mockRepositoryService;
        });
        (0, vitest_1.describe)("selectData", () => {
            (0, vitest_1.it)("should select data successfully", async () => {
                // Arrange
                const mockData = [
                    { id: 1, name: "Boat 1" },
                    { id: 2, name: "Boat 2" },
                ];
                mockRepositoryService.select.mockResolvedValue({
                    data: mockData,
                    error: null,
                });
                // Act
                const result = await supabaseService.selectData("boats_list", "*", []);
                // Assert
                (0, vitest_1.expect)(result).toEqual({
                    data: mockData,
                    error: null,
                });
                (0, vitest_1.expect)(mockRepositoryService.select).toHaveBeenCalledWith("boats_list", "*", []);
            });
            (0, vitest_1.it)("should select data with filters", async () => {
                // Arrange
                const mockData = [{ id: 1, name: "Boat 1" }];
                const filters = [
                    { column: "type", value: "catamaran" },
                    { column: "is_available", value: "true" },
                ];
                mockRepositoryService.select.mockResolvedValue({
                    data: mockData,
                    error: null,
                });
                // Act
                const result = await supabaseService.selectData("boats_list", "*", filters);
                // Assert
                (0, vitest_1.expect)(result).toEqual({
                    data: mockData,
                    error: null,
                });
                (0, vitest_1.expect)(mockRepositoryService.select).toHaveBeenCalledWith("boats_list", "*", filters);
            });
            (0, vitest_1.it)("should handle database errors", async () => {
                // Arrange
                const dbError = new Error("Database connection failed");
                mockRepositoryService.select.mockResolvedValue({
                    data: null,
                    error: dbError,
                });
                // Act
                const result = await supabaseService.selectData("boats_list", "*", []);
                // Assert
                (0, vitest_1.expect)(result).toEqual({
                    data: null,
                    error: dbError,
                });
                (0, vitest_1.expect)(mockRepositoryService.select).toHaveBeenCalledWith("boats_list", "*", []);
            });
            (0, vitest_1.it)("should handle service not configured", async () => {
                // Arrange
                supabaseService.isConfigured = false;
                supabaseService.client = null;
                // Act
                const result = await supabaseService.selectData("boats_list", "*", []);
                // Assert
                (0, vitest_1.expect)(result).toEqual({ data: null, error: null });
            });
        });
        (0, vitest_1.describe)("upsertData", () => {
            (0, vitest_1.it)("should upsert data successfully", async () => {
                // Arrange
                const mockData = { name: "New Boat", type: "catamaran" };
                const mockResponse = { id: 1, ...mockData };
                mockRepositoryService.upsert.mockResolvedValue({
                    data: mockResponse,
                    error: null,
                });
                // Act
                const result = await supabaseService.upsertData("boats_list", mockData);
                // Assert
                (0, vitest_1.expect)(result).toEqual({
                    data: mockResponse,
                    error: null,
                });
                (0, vitest_1.expect)(mockRepositoryService.upsert).toHaveBeenCalledWith("boats_list", mockData);
            });
            (0, vitest_1.it)("should handle upsert errors", async () => {
                // Arrange
                const upsertError = new Error("Upsert failed");
                mockRepositoryService.upsert.mockResolvedValue({
                    data: null,
                    error: upsertError,
                });
                // Act
                const result = await supabaseService.upsertData("boats_list", {});
                // Assert
                (0, vitest_1.expect)(result).toEqual({
                    data: null,
                    error: upsertError,
                });
                (0, vitest_1.expect)(mockRepositoryService.upsert).toHaveBeenCalledWith("boats_list", {});
            });
            (0, vitest_1.it)("should handle service not configured", async () => {
                // Arrange
                supabaseService.isConfigured = false;
                supabaseService.client = null;
                // Act & Assert
                await (0, vitest_1.expect)(supabaseService.upsertData("boats_list", {})).rejects.toThrow("Supabase client not initialized");
            });
        });
    });
    (0, vitest_1.describe)("Error Handling", () => {
        (0, vitest_1.it)("should handle network timeouts", async () => {
            // Arrange
            supabaseService.isConfigured = true;
            supabaseService.client = mockRepositoryService;
            mockRepositoryService.select.mockImplementationOnce(() => new Promise((resolve) => setTimeout(() => resolve({ data: null, error: new Error("Timeout") }), 6000)));
            // Act
            const result = await supabaseService.selectData("test_table", "*", []);
            // Assert
            (0, vitest_1.expect)(result.error).toBeInstanceOf(Error);
            (0, vitest_1.expect)(result.error?.message).toBe("Timeout");
        });
        (0, vitest_1.it)("should handle malformed responses", async () => {
            // Arrange
            supabaseService.isConfigured = true;
            supabaseService.client = mockRepositoryService;
            mockRepositoryService.select.mockResolvedValue({
                data: "malformed",
                error: null,
            });
            // Act
            const result = await supabaseService.selectData("test_table", "*", []);
            // Assert
            (0, vitest_1.expect)(result.data).toBe("malformed");
            (0, vitest_1.expect)(result.error).toBeNull();
        });
    });
    (0, vitest_1.describe)("Edge Cases", () => {
        (0, vitest_1.it)("should handle empty filter arrays", async () => {
            // Arrange
            supabaseService.isConfigured = true;
            supabaseService.client = mockRepositoryService;
            mockRepositoryService.select.mockResolvedValue({
                data: [],
                error: null,
            });
            // Act
            const result = await supabaseService.selectData("boats_list", "*", []);
            // Assert
            (0, vitest_1.expect)(result.data).toEqual([]);
            (0, vitest_1.expect)(result.error).toBeNull();
        });
        (0, vitest_1.it)("should handle null values in filters", async () => {
            // Arrange
            supabaseService.isConfigured = true;
            supabaseService.client = mockRepositoryService;
            const filters = [
                { column: "name", value: "" },
                { column: "type", value: "catamaran" },
            ];
            mockRepositoryService.select.mockResolvedValue({
                data: [],
                error: null,
            });
            // Act
            const result = await supabaseService.selectData("boats_list", "*", filters);
            // Assert
            (0, vitest_1.expect)(result.data).toEqual([]);
            (0, vitest_1.expect)(result.error).toBeNull();
            (0, vitest_1.expect)(mockRepositoryService.select).toHaveBeenCalledWith("boats_list", "*", filters);
        });
        (0, vitest_1.it)("should handle very large datasets", async () => {
            // Arrange
            supabaseService.isConfigured = true;
            supabaseService.client = mockRepositoryService;
            const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
                id: i + 1,
                name: `Boat ${i + 1}`,
            }));
            mockRepositoryService.select.mockResolvedValue({
                data: largeDataset,
                error: null,
            });
            // Act
            const result = await supabaseService.selectData("large_table", "*", []);
            // Assert
            (0, vitest_1.expect)(result.data).toHaveLength(1000);
            (0, vitest_1.expect)(result.error).toBeNull();
            (0, vitest_1.expect)(mockRepositoryService.select).toHaveBeenCalledWith("large_table", "*", []);
        });
    });
});
