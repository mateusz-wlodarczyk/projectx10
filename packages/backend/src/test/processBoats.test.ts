import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock external dependencies
vi.mock("../index", () => ({
  boatServiceCatamaran: {
    getAvailabilitySingleBoat: vi.fn(),
  },
  loggerBoatService: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  loggerSupabaseService: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  supabaseService: {
    selectData: vi.fn(),
    upsertData: vi.fn(),
  },
}));
vi.mock("../utils/sleep");
vi.mock("../utils/selectDataArrayChecking");

describe("processBoats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Basic Functionality", () => {
    it("should handle empty boat array", async () => {
      // Arrange
      const mockDownloadedBoats: any[] = [];

      // Act
      const { processBoats } = await import("../utils/processBoats");
      await processBoats(mockDownloadedBoats, 2025);

      // Assert
      // Should not throw error and complete successfully
      expect(true).toBe(true);
    });

    it("should handle boats with valid data structure", async () => {
      // Arrange
      const mockDownloadedBoats = [
        { slug: "boat-1", name: "Test Boat 1" },
        { slug: "boat-2", name: "Test Boat 2" },
      ];

      // Mock the external dependencies
      const { boatServiceCatamaran, loggerBoatService, supabaseService } = await import("../index");

      vi.mocked(boatServiceCatamaran.getAvailabilitySingleBoat).mockResolvedValue({
        slug: "test-boat",
        availabilities: [
          {
            chin: "2025-01-01",
            chout: "2025-01-07",
          },
        ],
      });

      vi.mocked(supabaseService.selectData).mockResolvedValue({
        data: [],
        error: null,
      });

      vi.mocked(supabaseService.upsertData).mockResolvedValue({
        data: null,
        error: null,
      });

      // Act
      const { processBoats } = await import("../utils/processBoats");
      await processBoats(mockDownloadedBoats, 2025);

      // Assert
      expect(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledTimes(2);
      expect(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledWith("boat-1");
      expect(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledWith("boat-2");
    });

    it("should handle boats with null availability data", async () => {
      // Arrange
      const mockDownloadedBoats = [{ slug: "boat-1", name: "Test Boat 1" }];

      const { boatServiceCatamaran, loggerBoatService } = await import("../index");

      vi.mocked(boatServiceCatamaran.getAvailabilitySingleBoat).mockResolvedValue(null);

      // Act
      const { processBoats } = await import("../utils/processBoats");
      await processBoats(mockDownloadedBoats, 2025);

      // Assert
      expect(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledWith("boat-1");
      expect(loggerBoatService.warn).toHaveBeenCalledWith(expect.stringContaining("No availability data found for boat-1"));
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      // Arrange
      const mockDownloadedBoats = [{ slug: "boat-1", name: "Test Boat 1" }];

      const { boatServiceCatamaran, loggerBoatService } = await import("../index");

      vi.mocked(boatServiceCatamaran.getAvailabilitySingleBoat).mockRejectedValue(new Error("API Error"));

      // Act
      const { processBoats } = await import("../utils/processBoats");
      await processBoats(mockDownloadedBoats, 2025);

      // Assert
      expect(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledWith("boat-1");
      expect(loggerBoatService.error).toHaveBeenCalledWith(expect.stringContaining("Error processing boat boat-1:"), expect.any(Error));
    });

    it("should continue processing other boats when one fails", async () => {
      // Arrange
      const mockDownloadedBoats = [
        { slug: "boat-1", name: "Test Boat 1" },
        { slug: "boat-2", name: "Test Boat 2" },
      ];

      const { boatServiceCatamaran, loggerBoatService } = await import("../index");

      vi.mocked(boatServiceCatamaran.getAvailabilitySingleBoat)
        .mockRejectedValueOnce(new Error("API Error"))
        .mockResolvedValueOnce({
          slug: "test-boat",
          availabilities: [
            {
              chin: "2025-01-01",
              chout: "2025-01-07",
            },
          ],
        });

      // Act
      const { processBoats } = await import("../utils/processBoats");
      await processBoats(mockDownloadedBoats, 2025);

      // Assert
      expect(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledTimes(2);
      expect(loggerBoatService.error).toHaveBeenCalledWith(expect.stringContaining("Error processing boat boat-1:"), expect.any(Error));
    });
  });

  describe("Edge Cases", () => {
    it("should handle boats with malformed availability data", async () => {
      // Arrange
      const mockDownloadedBoats = [{ slug: "boat-1", name: "Test Boat 1" }];

      const { boatServiceCatamaran } = await import("../index");

      vi.mocked(boatServiceCatamaran.getAvailabilitySingleBoat).mockResolvedValue({
        slug: "test-boat",
        availabilities: [
          {
            chin: "invalid-date",
            chout: "invalid-date",
          },
        ],
      });

      // Act
      const { processBoats } = await import("../utils/processBoats");
      await processBoats(mockDownloadedBoats, 2025);

      // Assert
      expect(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledWith("boat-1");
      // Should not throw error, but handle gracefully
    });

    it("should handle very large boat arrays", async () => {
      // Arrange
      const mockDownloadedBoats = Array.from({ length: 1000 }, (_, i) => ({
        slug: `boat-${i + 1}`,
        name: `Test Boat ${i + 1}`,
      }));

      const { boatServiceCatamaran } = await import("../index");

      vi.mocked(boatServiceCatamaran.getAvailabilitySingleBoat).mockResolvedValue({
        slug: "test-boat",
        availabilities: [
          {
            chin: "2025-01-01",
            chout: "2025-01-07",
          },
        ],
      });

      // Act
      const { processBoats } = await import("../utils/processBoats");
      await processBoats(mockDownloadedBoats, 2025);

      // Assert
      expect(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledTimes(1000);
    });
  });
});
