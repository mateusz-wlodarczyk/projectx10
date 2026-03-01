"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Mock external dependencies
vitest_1.vi.mock("../index", () => ({
    boatServiceCatamaran: {
        getAvailabilitySingleBoat: vitest_1.vi.fn(),
    },
    loggerBoatService: {
        info: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
    },
    loggerSupabaseService: {
        info: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
    },
    supabaseService: {
        selectData: vitest_1.vi.fn(),
        upsertData: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock("../utils/sleep");
vitest_1.vi.mock("../utils/selectDataArrayChecking");
(0, vitest_1.describe)("processBoats", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("Basic Functionality", () => {
        (0, vitest_1.it)("should handle empty boat array", async () => {
            // Arrange
            const mockDownloadedBoats = [];
            // Act
            const { processBoats } = await Promise.resolve().then(() => __importStar(require("../utils/processBoats")));
            await processBoats(mockDownloadedBoats, 2025);
            // Assert
            // Should not throw error and complete successfully
            (0, vitest_1.expect)(true).toBe(true);
        });
        (0, vitest_1.it)("should handle boats with valid data structure", async () => {
            // Arrange
            const mockDownloadedBoats = [
                { slug: "boat-1", name: "Test Boat 1" },
                { slug: "boat-2", name: "Test Boat 2" },
            ];
            // Mock the external dependencies
            const { boatServiceCatamaran, loggerBoatService, supabaseService } = await Promise.resolve().then(() => __importStar(require("../index")));
            vitest_1.vi.mocked(boatServiceCatamaran.getAvailabilitySingleBoat).mockResolvedValue({
                slug: "test-boat",
                availabilities: [
                    {
                        chin: "2025-01-01",
                        chout: "2025-01-07",
                    },
                ],
            });
            vitest_1.vi.mocked(supabaseService.selectData).mockResolvedValue({
                data: [],
                error: null,
            });
            vitest_1.vi.mocked(supabaseService.upsertData).mockResolvedValue({
                data: null,
                error: null,
            });
            // Act
            const { processBoats } = await Promise.resolve().then(() => __importStar(require("../utils/processBoats")));
            await processBoats(mockDownloadedBoats, 2025);
            // Assert
            (0, vitest_1.expect)(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledWith("boat-1");
            (0, vitest_1.expect)(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledWith("boat-2");
        });
        (0, vitest_1.it)("should handle boats with null availability data", async () => {
            // Arrange
            const mockDownloadedBoats = [{ slug: "boat-1", name: "Test Boat 1" }];
            const { boatServiceCatamaran, loggerBoatService } = await Promise.resolve().then(() => __importStar(require("../index")));
            vitest_1.vi.mocked(boatServiceCatamaran.getAvailabilitySingleBoat).mockResolvedValue(null);
            // Act
            const { processBoats } = await Promise.resolve().then(() => __importStar(require("../utils/processBoats")));
            await processBoats(mockDownloadedBoats, 2025);
            // Assert
            (0, vitest_1.expect)(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledWith("boat-1");
            (0, vitest_1.expect)(loggerBoatService.warn).toHaveBeenCalledWith(vitest_1.expect.stringContaining("No availability data found for boat-1"));
        });
    });
    (0, vitest_1.describe)("Error Handling", () => {
        (0, vitest_1.it)("should handle API errors gracefully", async () => {
            // Arrange
            const mockDownloadedBoats = [{ slug: "boat-1", name: "Test Boat 1" }];
            const { boatServiceCatamaran, loggerBoatService } = await Promise.resolve().then(() => __importStar(require("../index")));
            vitest_1.vi.mocked(boatServiceCatamaran.getAvailabilitySingleBoat).mockRejectedValue(new Error("API Error"));
            // Act
            const { processBoats } = await Promise.resolve().then(() => __importStar(require("../utils/processBoats")));
            await processBoats(mockDownloadedBoats, 2025);
            // Assert
            (0, vitest_1.expect)(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledWith("boat-1");
            (0, vitest_1.expect)(loggerBoatService.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Error processing boat boat-1:"), vitest_1.expect.any(Error));
        });
        (0, vitest_1.it)("should continue processing other boats when one fails", async () => {
            // Arrange
            const mockDownloadedBoats = [
                { slug: "boat-1", name: "Test Boat 1" },
                { slug: "boat-2", name: "Test Boat 2" },
            ];
            const { boatServiceCatamaran, loggerBoatService } = await Promise.resolve().then(() => __importStar(require("../index")));
            vitest_1.vi.mocked(boatServiceCatamaran.getAvailabilitySingleBoat)
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
            const { processBoats } = await Promise.resolve().then(() => __importStar(require("../utils/processBoats")));
            await processBoats(mockDownloadedBoats, 2025);
            // Assert
            (0, vitest_1.expect)(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(loggerBoatService.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Error processing boat boat-1:"), vitest_1.expect.any(Error));
        });
    });
    (0, vitest_1.describe)("Edge Cases", () => {
        (0, vitest_1.it)("should handle boats with malformed availability data", async () => {
            // Arrange
            const mockDownloadedBoats = [{ slug: "boat-1", name: "Test Boat 1" }];
            const { boatServiceCatamaran } = await Promise.resolve().then(() => __importStar(require("../index")));
            vitest_1.vi.mocked(boatServiceCatamaran.getAvailabilitySingleBoat).mockResolvedValue({
                slug: "test-boat",
                availabilities: [
                    {
                        chin: "invalid-date",
                        chout: "invalid-date",
                    },
                ],
            });
            // Act
            const { processBoats } = await Promise.resolve().then(() => __importStar(require("../utils/processBoats")));
            await processBoats(mockDownloadedBoats, 2025);
            // Assert
            (0, vitest_1.expect)(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledWith("boat-1");
            // Should not throw error, but handle gracefully
        });
        (0, vitest_1.it)("should handle very large boat arrays", async () => {
            // Arrange
            const mockDownloadedBoats = Array.from({ length: 1000 }, (_, i) => ({
                slug: `boat-${i + 1}`,
                name: `Test Boat ${i + 1}`,
            }));
            const { boatServiceCatamaran } = await Promise.resolve().then(() => __importStar(require("../index")));
            vitest_1.vi.mocked(boatServiceCatamaran.getAvailabilitySingleBoat).mockResolvedValue({
                slug: "test-boat",
                availabilities: [
                    {
                        chin: "2025-01-01",
                        chout: "2025-01-07",
                    },
                ],
            });
            // Act
            const { processBoats } = await Promise.resolve().then(() => __importStar(require("../utils/processBoats")));
            await processBoats(mockDownloadedBoats, 2025);
            // Assert
            (0, vitest_1.expect)(boatServiceCatamaran.getAvailabilitySingleBoat).toHaveBeenCalledTimes(1000);
        });
    });
});
