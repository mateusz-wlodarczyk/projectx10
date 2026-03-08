"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const tsoa_1 = require("tsoa");
const DashboardService_1 = require("../services/DashboardService");
const index_1 = require("../index");
let DashboardController = class DashboardController extends tsoa_1.Controller {
    dashboardService;
    constructor() {
        super();
        this.dashboardService = new DashboardService_1.DashboardService(index_1.supabaseService);
    }
    /**
     * Get dashboard summary data
     * @param boat_type Boat type filter (default: catamaran)
     * @param date_from Start date for data filtering
     * @param date_to End date for data filtering
     * @returns Dashboard summary with key metrics
     */
    async getDashboardSummary(boat_type, date_from, date_to) {
        try {
            const request = {
                boat_type: boat_type || "catamaran",
                date_from,
                date_to,
            };
            const summary = await this.dashboardService.getDashboardSummary(request.boat_type);
            const response = {
                summary,
                lastUpdate: new Date(),
                dataSource: "boats_list",
            };
            this.setStatus(200);
            return response;
        }
        catch (error) {
            console.error("Error in getDashboardSummary:", error);
            this.setStatus(500);
            return {
                error: "Internal Server Error",
                message: "Failed to fetch dashboard summary",
            };
        }
    }
    /**
     * Get key performance metrics
     * @param boat_type Boat type filter (default: catamaran)
     * @param period Time period for metrics (week, month, quarter, year)
     * @param metrics Specific metrics to retrieve
     * @returns Key performance metrics with trends
     */
    async getKeyMetrics(boat_type, period, metrics) {
        try {
            const request = {
                boat_type: boat_type || "catamaran",
                period: period || "month",
                metrics: metrics ? metrics.split(",") : undefined,
            };
            const keyMetrics = await this.dashboardService.getKeyMetrics(request.boat_type, request.period);
            const response = {
                metrics: keyMetrics,
                period: request.period || "month",
                comparison: {
                    previous: [], // Mock previous period data
                    change: {}, // Mock change calculations
                },
            };
            this.setStatus(200);
            return response;
        }
        catch (error) {
            console.error("Error in getKeyMetrics:", error);
            this.setStatus(500);
            return {
                error: "Internal Server Error",
                message: "Failed to fetch key metrics",
            };
        }
    }
    /**
     * Get weekly price trends
     * @param boat_type Boat type filter (default: catamaran)
     * @param weeks Specific weeks to retrieve
     * @param year Year for price trends (default: current year)
     * @returns Weekly price trends with averages
     */
    async getPriceTrends(boat_type, weeks, year) {
        try {
            const request = {
                boat_type: boat_type || "catamaran",
                weeks: weeks ? weeks.split(",").map(Number) : undefined,
                year: year || new Date().getFullYear(),
            };
            const priceData = await this.dashboardService.getWeeklyPriceTrends(request.boat_type, request.year);
            const response = {
                priceData,
                trends: {
                    weekly: 2.5, // Mock trend data
                    monthly: 5.8,
                    yearly: 12.3,
                },
            };
            this.setStatus(200);
            return response;
        }
        catch (error) {
            console.error("Error in getPriceTrends:", error);
            this.setStatus(500);
            return {
                error: "Internal Server Error",
                message: "Failed to fetch price trends",
            };
        }
    }
    /**
     * Get discount trends
     * @param boat_type Boat type filter (default: catamaran)
     * @param time_range Time range for trends (week, month, quarter, year)
     * @param date_from Start date for data filtering
     * @param date_to End date for data filtering
     * @returns Discount trends with averages
     */
    async getDiscountTrends(boat_type, time_range, date_from, date_to) {
        try {
            const request = {
                boat_type: boat_type || "catamaran",
                time_range: time_range || "month",
                date_from,
                date_to,
            };
            const discountData = await this.dashboardService.getDiscountTrends(request.boat_type, request.time_range);
            const response = {
                discountData,
                trends: {
                    average: discountData.averageDiscount,
                    trend: "down", // Mock trend
                    change: -1.2, // Mock change
                },
            };
            this.setStatus(200);
            return response;
        }
        catch (error) {
            console.error("Error in getDiscountTrends:", error);
            this.setStatus(500);
            return {
                error: "Internal Server Error",
                message: "Failed to fetch discount trends",
            };
        }
    }
    /**
     * Get availability trends
     * @param boat_type Boat type filter (default: catamaran)
     * @param time_range Time range for trends (week, month, quarter, year)
     * @param date_from Start date for data filtering
     * @param date_to End date for data filtering
     * @returns Availability trends with insights
     */
    async getAvailabilityTrends(boat_type, time_range, date_from, date_to) {
        try {
            const request = {
                boat_type: boat_type || "catamaran",
                time_range: time_range || "month",
                date_from,
                date_to,
            };
            const availabilityData = await this.dashboardService.getAvailabilityTrends(request.boat_type, request.time_range);
            const response = {
                availabilityData,
                insights: {
                    peakSeason: "Summer (Weeks 25-35)",
                    lowSeason: "Winter (Weeks 1-10, 45-52)",
                    averageOccupancy: availabilityData.averageOccupancy,
                },
            };
            this.setStatus(200);
            return response;
        }
        catch (error) {
            console.error("Error in getAvailabilityTrends:", error);
            this.setStatus(500);
            return {
                error: "Internal Server Error",
                message: "Failed to fetch availability trends",
            };
        }
    }
    /**
     * Get revenue trends
     * @param boat_type Boat type filter (default: catamaran)
     * @param time_range Time range for trends (week, month, quarter, year)
     * @param date_from Start date for data filtering
     * @param date_to End date for data filtering
     * @returns Revenue trends with projections
     */
    async getRevenueTrends(boat_type, time_range, date_from, date_to) {
        try {
            const request = {
                boat_type: boat_type || "catamaran",
                time_range: time_range || "month",
                date_from,
                date_to,
            };
            const revenueData = await this.dashboardService.getRevenueTrends(request.boat_type, request.time_range);
            const response = {
                revenueData,
                projections: {
                    nextMonth: Math.round(revenueData.averageRevenue * 1.1), // Mock projection
                    nextQuarter: Math.round(revenueData.averageRevenue * 3.2),
                    confidence: 85, // Mock confidence
                },
            };
            this.setStatus(200);
            return response;
        }
        catch (error) {
            console.error("Error in getRevenueTrends:", error);
            this.setStatus(500);
            return {
                error: "Internal Server Error",
                message: "Failed to fetch revenue trends",
            };
        }
    }
    /**
     * Get summary statistics and insights
     * @param boat_type Boat type filter (default: catamaran)
     * @param category Specific categories to retrieve
     * @param limit Maximum number of stats to return
     * @returns Summary statistics with insights
     */
    async getSummaryStats(boat_type, category, limit) {
        try {
            const request = {
                boat_type: boat_type || "catamaran",
                category: category ? category.split(",") : undefined,
                limit: limit || 10,
            };
            const stats = await this.dashboardService.getSummaryStats(request.boat_type);
            const response = {
                stats: stats.slice(0, request.limit),
                categories: {
                    performance: stats.filter((s) => s.category === "performance").length,
                    market: stats.filter((s) => s.category === "market").length,
                    seasonal: stats.filter((s) => s.category === "seasonal").length,
                    insight: stats.filter((s) => s.category === "insight").length,
                },
            };
            this.setStatus(200);
            return response;
        }
        catch (error) {
            console.error("Error in getSummaryStats:", error);
            this.setStatus(500);
            return {
                error: "Internal Server Error",
                message: "Failed to fetch summary stats",
            };
        }
    }
    /**
     * Health check endpoint for dashboard
     * @returns Simple health status
     */
    async healthCheck() {
        return {
            success: true,
            message: "Dashboard API is running",
            timestamp: new Date().toISOString(),
        };
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, tsoa_1.Get)("/summary"),
    (0, tsoa_1.Response)(200, "Dashboard summary retrieved successfully"),
    (0, tsoa_1.Response)(500, "Internal server error"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboardSummary", null);
__decorate([
    (0, tsoa_1.Get)("/metrics"),
    (0, tsoa_1.Response)(200, "Metrics retrieved successfully"),
    (0, tsoa_1.Response)(500, "Internal server error"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getKeyMetrics", null);
__decorate([
    (0, tsoa_1.Get)("/price-trends"),
    (0, tsoa_1.Response)(200, "Price trends retrieved successfully"),
    (0, tsoa_1.Response)(500, "Internal server error"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPriceTrends", null);
__decorate([
    (0, tsoa_1.Get)("/discount-trends"),
    (0, tsoa_1.Response)(200, "Discount trends retrieved successfully"),
    (0, tsoa_1.Response)(500, "Internal server error"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDiscountTrends", null);
__decorate([
    (0, tsoa_1.Get)("/availability"),
    (0, tsoa_1.Response)(200, "Availability trends retrieved successfully"),
    (0, tsoa_1.Response)(500, "Internal server error"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAvailabilityTrends", null);
__decorate([
    (0, tsoa_1.Get)("/revenue"),
    (0, tsoa_1.Response)(200, "Revenue trends retrieved successfully"),
    (0, tsoa_1.Response)(500, "Internal server error"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getRevenueTrends", null);
__decorate([
    (0, tsoa_1.Get)("/stats"),
    (0, tsoa_1.Response)(200, "Summary stats retrieved successfully"),
    (0, tsoa_1.Response)(500, "Internal server error"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSummaryStats", null);
__decorate([
    (0, tsoa_1.Get)("/health"),
    (0, tsoa_1.Response)(200, "Dashboard API is healthy"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "healthCheck", null);
exports.DashboardController = DashboardController = __decorate([
    (0, tsoa_1.Route)("dashboard"),
    (0, tsoa_1.Tags)("Dashboard"),
    __metadata("design:paramtypes", [])
], DashboardController);
try {
    const data = await getDashboardData(); // Funkcja pobierająca dane z bazy
    console.log('Dashboard data:', data);
    res.json(data);
}
catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
