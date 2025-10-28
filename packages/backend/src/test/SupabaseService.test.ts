import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SupabaseService } from "../services/SupabaseService";
import { RepositoryService } from "../api/RepositoryService";

// Mock the RepositoryService
vi.mock("../api/RepositoryService");

describe("SupabaseService", () => {
  let supabaseService: SupabaseService;
  let mockRepositoryService: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock RepositoryService
    mockRepositoryService = {
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      upsert: vi.fn().mockResolvedValue({ data: [], error: null }),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      then: vi.fn(),
      supabase: {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      },
      auth: {
        signUp: vi.fn().mockResolvedValue({ data: null, error: null }),
        signInWithPassword: vi.fn().mockResolvedValue({ data: null, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
    };

    vi.mocked(RepositoryService).mockImplementation(() => mockRepositoryService);

    // Mock environment variables
    vi.stubGlobal("process", {
      ...process,
      env: {
        ...process.env,
        SUPABASE_URL: "https://test.supabase.co",
        SUPABASE_KEY: "test-anon-key",
        SUPABASE_SERVICE_ROLE_KEY: "test-service-key",
      },
    });

    supabaseService = new SupabaseService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize successfully with valid credentials", () => {
      // Arrange & Act
      const service = new SupabaseService();

      // Assert
      expect(service.isConfigured).toBe(true);
      expect(service.client).toBeDefined();
      expect(service.adminClient).toBeDefined();
    });

    it("should handle missing credentials gracefully", () => {
      // Arrange
      vi.stubGlobal("process", {
        ...process,
        env: {
          ...process.env,
          SUPABASE_URL: undefined,
          SUPABASE_KEY: undefined,
        },
      });

      // Act
      const service = new SupabaseService();

      // Assert
      expect(service.isConfigured).toBe(false);
      expect(service.client).toBeNull();
      expect(service.adminClient).toBeNull();
    });
  });

  describe("Database Operations", () => {
    beforeEach(() => {
      // Ensure service is configured
      supabaseService.isConfigured = true;
      supabaseService.client = mockRepositoryService;
    });

    describe("selectData", () => {
      it("should select data successfully", async () => {
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
        expect(result).toEqual({
          data: mockData,
          error: null,
        });
        expect(mockRepositoryService.select).toHaveBeenCalledWith("boats_list", "*", []);
      });

      it("should select data with filters", async () => {
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
        expect(result).toEqual({
          data: mockData,
          error: null,
        });
        expect(mockRepositoryService.select).toHaveBeenCalledWith("boats_list", "*", filters);
      });

      it("should handle database errors", async () => {
        // Arrange
        const dbError = new Error("Database connection failed");
        mockRepositoryService.select.mockResolvedValue({
          data: null,
          error: dbError,
        });

        // Act
        const result = await supabaseService.selectData("boats_list", "*", []);

        // Assert
        expect(result).toEqual({
          data: null,
          error: dbError,
        });
        expect(mockRepositoryService.select).toHaveBeenCalledWith("boats_list", "*", []);
      });

      it("should handle service not configured", async () => {
        // Arrange
        supabaseService.isConfigured = false;
        supabaseService.client = null;

        // Act
        const result = await supabaseService.selectData("boats_list", "*", []);

        // Assert
        expect(result).toEqual({ data: null, error: null });
      });
    });

    describe("upsertData", () => {
      it("should upsert data successfully", async () => {
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
        expect(result).toEqual({
          data: mockResponse,
          error: null,
        });
        expect(mockRepositoryService.upsert).toHaveBeenCalledWith("boats_list", mockData);
      });

      it("should handle upsert errors", async () => {
        // Arrange
        const upsertError = new Error("Upsert failed");
        mockRepositoryService.upsert.mockResolvedValue({
          data: null,
          error: upsertError,
        });

        // Act
        const result = await supabaseService.upsertData("boats_list", {});

        // Assert
        expect(result).toEqual({
          data: null,
          error: upsertError,
        });
        expect(mockRepositoryService.upsert).toHaveBeenCalledWith("boats_list", {});
      });

      it("should handle service not configured", async () => {
        // Arrange
        supabaseService.isConfigured = false;
        supabaseService.client = null;

        // Act & Assert
        await expect(supabaseService.upsertData("boats_list", {})).rejects.toThrow("Supabase client not initialized");
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle network timeouts", async () => {
      // Arrange
      supabaseService.isConfigured = true;
      supabaseService.client = mockRepositoryService;
      mockRepositoryService.select.mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: null, error: new Error("Timeout") }), 6000)),
      );

      // Act
      const result = await supabaseService.selectData("test_table", "*", []);

      // Assert
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe("Timeout");
    });

    it("should handle malformed responses", async () => {
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
      expect(result.data).toBe("malformed");
      expect(result.error).toBeNull();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty filter arrays", async () => {
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
      expect(result.data).toEqual([]);
      expect(result.error).toBeNull();
    });

    it("should handle null values in filters", async () => {
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
      expect(result.data).toEqual([]);
      expect(result.error).toBeNull();
      expect(mockRepositoryService.select).toHaveBeenCalledWith("boats_list", "*", filters);
    });

    it("should handle very large datasets", async () => {
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
      expect(result.data).toHaveLength(1000);
      expect(result.error).toBeNull();
      expect(mockRepositoryService.select).toHaveBeenCalledWith("large_table", "*", []);
    });
  });
});
