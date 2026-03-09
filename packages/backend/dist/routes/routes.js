"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const BaseController_1 = require("./../controllers/BaseController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const AuthController_1 = require("./../controllers/AuthController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const AdminController_1 = require("./../controllers/AdminController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const BoatsController_1 = require("./../controllers/BoatsController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const DashboardController_1 = require("./../controllers/DashboardController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "AuthResponse": {
        "dataType": "refObject",
        "properties": {
            "user": { "dataType": "nestedObjectLiteral", "nestedProperties": { "emailVerified": { "dataType": "boolean", "required": true }, "lastName": { "dataType": "string", "required": true }, "firstName": { "dataType": "string", "required": true }, "email": { "dataType": "string", "required": true }, "id": { "dataType": "string", "required": true } }, "required": true },
            "session": { "dataType": "nestedObjectLiteral", "nestedProperties": { "expires_at": { "dataType": "double", "required": true }, "refresh_token": { "dataType": "string", "required": true }, "access_token": { "dataType": "string", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "error": { "dataType": "string", "required": true },
            "message": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterRequest": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PriceEntry": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "createdAt": { "dataType": "string", "required": true }, "discount": { "dataType": "double", "required": true }, "price": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PriceHistory": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "additionalProperties": { "ref": "PriceEntry" }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WeeklyPriceHistory": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "additionalProperties": { "ref": "PriceHistory" }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DashboardSummary": {
        "dataType": "refObject",
        "properties": {
            "lastUpdate": { "dataType": "datetime", "required": true },
            "totalBoats": { "dataType": "double", "required": true },
            "boatType": { "dataType": "string", "required": true },
            "totalRevenue": { "dataType": "double", "required": true },
            "averagePrice": { "dataType": "double", "required": true },
            "totalBookings": { "dataType": "double", "required": true },
            "availabilityRate": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DashboardSummaryResponse": {
        "dataType": "refObject",
        "properties": {
            "summary": { "ref": "DashboardSummary", "required": true },
            "lastUpdate": { "dataType": "datetime", "required": true },
            "dataSource": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "KeyMetric": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "value": { "dataType": "double", "required": true },
            "unit": { "dataType": "string", "required": true },
            "change": { "dataType": "double", "required": true },
            "changeType": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["increase"] }, { "dataType": "enum", "enums": ["decrease"] }, { "dataType": "enum", "enums": ["neutral"] }], "required": true },
            "trend": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["up"] }, { "dataType": "enum", "enums": ["down"] }, { "dataType": "enum", "enums": ["stable"] }], "required": true },
            "icon": { "dataType": "string", "required": true },
            "color": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.number_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "additionalProperties": { "dataType": "double" }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DashboardMetricsResponse": {
        "dataType": "refObject",
        "properties": {
            "metrics": { "dataType": "array", "array": { "dataType": "refObject", "ref": "KeyMetric" }, "required": true },
            "period": { "dataType": "string", "required": true },
            "comparison": { "dataType": "nestedObjectLiteral", "nestedProperties": { "change": { "ref": "Record_string.number_", "required": true }, "previous": { "dataType": "array", "array": { "dataType": "refObject", "ref": "KeyMetric" }, "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WeeklyPriceDataPoint": {
        "dataType": "refObject",
        "properties": {
            "week": { "dataType": "double", "required": true },
            "averagePrice": { "dataType": "double", "required": true },
            "minPrice": { "dataType": "double", "required": true },
            "maxPrice": { "dataType": "double", "required": true },
            "boatCount": { "dataType": "double", "required": true },
            "timestamp": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WeeklyPriceData": {
        "dataType": "refObject",
        "properties": {
            "weeks": { "dataType": "array", "array": { "dataType": "refObject", "ref": "WeeklyPriceDataPoint" }, "required": true },
            "minPrice": { "dataType": "double", "required": true },
            "maxPrice": { "dataType": "double", "required": true },
            "averagePrice": { "dataType": "double", "required": true },
            "totalBoats": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PriceTrendsResponse": {
        "dataType": "refObject",
        "properties": {
            "priceData": { "ref": "WeeklyPriceData", "required": true },
            "trends": { "dataType": "nestedObjectLiteral", "nestedProperties": { "yearly": { "dataType": "double", "required": true }, "monthly": { "dataType": "double", "required": true }, "weekly": { "dataType": "double", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DiscountDataPoint": {
        "dataType": "refObject",
        "properties": {
            "timestamp": { "dataType": "datetime", "required": true },
            "averageDiscount": { "dataType": "double", "required": true },
            "minDiscount": { "dataType": "double", "required": true },
            "maxDiscount": { "dataType": "double", "required": true },
            "boatCount": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DiscountChartData": {
        "dataType": "refObject",
        "properties": {
            "dataPoints": { "dataType": "array", "array": { "dataType": "refObject", "ref": "DiscountDataPoint" }, "required": true },
            "minDiscount": { "dataType": "double", "required": true },
            "maxDiscount": { "dataType": "double", "required": true },
            "averageDiscount": { "dataType": "double", "required": true },
            "totalBoats": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DiscountTrendsResponse": {
        "dataType": "refObject",
        "properties": {
            "discountData": { "ref": "DiscountChartData", "required": true },
            "trends": { "dataType": "nestedObjectLiteral", "nestedProperties": { "change": { "dataType": "double", "required": true }, "trend": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["up"] }, { "dataType": "enum", "enums": ["down"] }, { "dataType": "enum", "enums": ["stable"] }], "required": true }, "average": { "dataType": "double", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailabilityDataPoint": {
        "dataType": "refObject",
        "properties": {
            "timestamp": { "dataType": "datetime", "required": true },
            "availabilityRate": { "dataType": "double", "required": true },
            "bookedBoats": { "dataType": "double", "required": true },
            "totalBoats": { "dataType": "double", "required": true },
            "occupancyRate": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailabilityData": {
        "dataType": "refObject",
        "properties": {
            "dataPoints": { "dataType": "array", "array": { "dataType": "refObject", "ref": "AvailabilityDataPoint" }, "required": true },
            "averageAvailability": { "dataType": "double", "required": true },
            "averageOccupancy": { "dataType": "double", "required": true },
            "totalBoats": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailabilityResponse": {
        "dataType": "refObject",
        "properties": {
            "availabilityData": { "ref": "AvailabilityData", "required": true },
            "insights": { "dataType": "nestedObjectLiteral", "nestedProperties": { "averageOccupancy": { "dataType": "double", "required": true }, "lowSeason": { "dataType": "string", "required": true }, "peakSeason": { "dataType": "string", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RevenueDataPoint": {
        "dataType": "refObject",
        "properties": {
            "timestamp": { "dataType": "datetime", "required": true },
            "revenue": { "dataType": "double", "required": true },
            "bookings": { "dataType": "double", "required": true },
            "averageBookingValue": { "dataType": "double", "required": true },
            "profitMargin": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RevenueData": {
        "dataType": "refObject",
        "properties": {
            "dataPoints": { "dataType": "array", "array": { "dataType": "refObject", "ref": "RevenueDataPoint" }, "required": true },
            "totalRevenue": { "dataType": "double", "required": true },
            "averageRevenue": { "dataType": "double", "required": true },
            "totalBookings": { "dataType": "double", "required": true },
            "averageProfitMargin": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RevenueResponse": {
        "dataType": "refObject",
        "properties": {
            "revenueData": { "ref": "RevenueData", "required": true },
            "projections": { "dataType": "nestedObjectLiteral", "nestedProperties": { "confidence": { "dataType": "double", "required": true }, "nextQuarter": { "dataType": "double", "required": true }, "nextMonth": { "dataType": "double", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SummaryStat": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "value": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "trend": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["up"] }, { "dataType": "enum", "enums": ["down"] }, { "dataType": "enum", "enums": ["stable"] }], "required": true },
            "category": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["performance"] }, { "dataType": "enum", "enums": ["market"] }, { "dataType": "enum", "enums": ["seasonal"] }, { "dataType": "enum", "enums": ["insight"] }], "required": true },
            "actionable": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DashboardStatsResponse": {
        "dataType": "refObject",
        "properties": {
            "stats": { "dataType": "array", "array": { "dataType": "refObject", "ref": "SummaryStat" }, "required": true },
            "categories": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "additionalProperties": { "dataType": "double" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    const argsBaseController_getWelcome = {};
    app.get('/undefined', ...((0, runtime_1.fetchMiddlewares)(BaseController_1.BaseController)), ...((0, runtime_1.fetchMiddlewares)(BaseController_1.BaseController.prototype.getWelcome)), async function BaseController_getWelcome(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsBaseController_getWelcome, request, response });
            const controller = new BaseController_1.BaseController();
            await templateService.apiHandler({
                methodName: 'getWelcome',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAuthController_login = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "LoginRequest" },
    };
    app.post('/auth/login', ...((0, runtime_1.fetchMiddlewares)(AuthController_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(AuthController_1.AuthController.prototype.login)), async function AuthController_login(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_login, request, response });
            const controller = new AuthController_1.AuthController();
            await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAuthController_register = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "RegisterRequest" },
    };
    app.post('/auth/register', ...((0, runtime_1.fetchMiddlewares)(AuthController_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(AuthController_1.AuthController.prototype.register)), async function AuthController_register(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_register, request, response });
            const controller = new AuthController_1.AuthController();
            await templateService.apiHandler({
                methodName: 'register',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAuthController_forgotPassword = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "email": { "dataType": "string", "required": true } } },
    };
    app.post('/auth/forgot-password', ...((0, runtime_1.fetchMiddlewares)(AuthController_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(AuthController_1.AuthController.prototype.forgotPassword)), async function AuthController_forgotPassword(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_forgotPassword, request, response });
            const controller = new AuthController_1.AuthController();
            await templateService.apiHandler({
                methodName: 'forgotPassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAuthController_resetPassword = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "password": { "dataType": "string", "required": true }, "token": { "dataType": "string", "required": true } } },
    };
    app.post('/auth/reset-password', ...((0, runtime_1.fetchMiddlewares)(AuthController_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(AuthController_1.AuthController.prototype.resetPassword)), async function AuthController_resetPassword(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_resetPassword, request, response });
            const controller = new AuthController_1.AuthController();
            await templateService.apiHandler({
                methodName: 'resetPassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAuthController_logout = {};
    app.post('/auth/logout', ...((0, runtime_1.fetchMiddlewares)(AuthController_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(AuthController_1.AuthController.prototype.logout)), async function AuthController_logout(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_logout, request, response });
            const controller = new AuthController_1.AuthController();
            await templateService.apiHandler({
                methodName: 'logout',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAuthController_updateProfile = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "lastName": { "dataType": "string", "required": true }, "firstName": { "dataType": "string", "required": true } } },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    app.post('/auth/profile', ...((0, runtime_1.fetchMiddlewares)(AuthController_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(AuthController_1.AuthController.prototype.updateProfile)), async function AuthController_updateProfile(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_updateProfile, request, response });
            const controller = new AuthController_1.AuthController();
            await templateService.apiHandler({
                methodName: 'updateProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getUsers = {};
    app.get('/admin/users', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getUsers)), async function AdminController_getUsers(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getUsers, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_createUser = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "role": { "dataType": "string" }, "lastName": { "dataType": "string", "required": true }, "firstName": { "dataType": "string", "required": true }, "password": { "dataType": "string", "required": true }, "email": { "dataType": "string", "required": true } } },
    };
    app.post('/admin/users', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.createUser)), async function AdminController_createUser(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_createUser, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'createUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_updateUser = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "role": { "dataType": "string" }, "status": { "dataType": "string" }, "email": { "dataType": "string" }, "lastName": { "dataType": "string" }, "firstName": { "dataType": "string" } } },
    };
    app.put('/admin/users/:id', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.updateUser)), async function AdminController_updateUser(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_updateUser, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'updateUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_deleteUser = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
    };
    app.delete('/admin/users/:id', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.deleteUser)), async function AdminController_deleteUser(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_deleteUser, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'deleteUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getCronLogs = {};
    app.get('/admin/logs/cron', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getCronLogs)), async function AdminController_getCronLogs(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getCronLogs, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getCronLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getSystemLogs = {};
    app.get('/admin/logs/system', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getSystemLogs)), async function AdminController_getSystemLogs(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getSystemLogs, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getSystemLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getCronJobs = {};
    app.get('/admin/cron/jobs', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getCronJobs)), async function AdminController_getCronJobs(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getCronJobs, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getCronJobs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getAllSupabaseLogs = {};
    app.get('/admin/logs/all', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getAllSupabaseLogs)), async function AdminController_getAllSupabaseLogs(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getAllSupabaseLogs, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getAllSupabaseLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getEdgeLogs = {};
    app.get('/admin/logs/edge', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getEdgeLogs)), async function AdminController_getEdgeLogs(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getEdgeLogs, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getEdgeLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getPostgresLogs = {};
    app.get('/admin/logs/postgres', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getPostgresLogs)), async function AdminController_getPostgresLogs(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getPostgresLogs, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getPostgresLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getPostgrestLogs = {};
    app.get('/admin/logs/postgrest', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getPostgrestLogs)), async function AdminController_getPostgrestLogs(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getPostgrestLogs, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getPostgrestLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getPoolerLogs = {};
    app.get('/admin/logs/pooler', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getPoolerLogs)), async function AdminController_getPoolerLogs(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getPoolerLogs, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getPoolerLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getAuthLogs = {};
    app.get('/admin/logs/auth', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getAuthLogs)), async function AdminController_getAuthLogs(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getAuthLogs, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getAuthLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getStorageLogs = {};
    app.get('/admin/logs/storage', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getStorageLogs)), async function AdminController_getStorageLogs(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getStorageLogs, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getStorageLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getRealtimeLogs = {};
    app.get('/admin/logs/realtime', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getRealtimeLogs)), async function AdminController_getRealtimeLogs(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getRealtimeLogs, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getRealtimeLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getEdgeFunctionsLogs = {};
    app.get('/admin/logs/edge-functions', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getEdgeFunctionsLogs)), async function AdminController_getEdgeFunctionsLogs(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getEdgeFunctionsLogs, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getEdgeFunctionsLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getPgcronLogs = {};
    app.get('/admin/logs/pgcron', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getPgcronLogs)), async function AdminController_getPgcronLogs(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getPgcronLogs, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getPgcronLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getNotes = {};
    app.get('/admin/notes', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getNotes)), async function AdminController_getNotes(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getNotes, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getNotes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_createNote = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "notes": { "dataType": "string", "required": true } } },
    };
    app.post('/admin/notes', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.createNote)), async function AdminController_createNote(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_createNote, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'createNote',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_updateNote = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "notes": { "dataType": "string", "required": true } } },
    };
    app.put('/admin/notes/:id', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.updateNote)), async function AdminController_updateNote(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_updateNote, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'updateNote',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_deleteNote = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
    };
    app.delete('/admin/notes/:id', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.deleteNote)), async function AdminController_deleteNote(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_deleteNote, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'deleteNote',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsBoatsController_healthCheck = {};
    app.get('/boat/health', ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController)), ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController.prototype.healthCheck)), async function BoatsController_healthCheck(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_healthCheck, request, response });
            const controller = new BoatsController_1.BoatsController();
            await templateService.apiHandler({
                methodName: 'healthCheck',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsBoatsController_getBoatData = {
        slug: { "in": "query", "name": "slug", "required": true, "dataType": "string" },
        week: { "in": "query", "name": "week", "required": true, "dataType": "string" },
    };
    app.get('/boat', ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController)), ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController.prototype.getBoatData)), async function BoatsController_getBoatData(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_getBoatData, request, response });
            const controller = new BoatsController_1.BoatsController();
            await templateService.apiHandler({
                methodName: 'getBoatData',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsBoatsController_searchBoatInBoatsList = {
        boatId: { "in": "query", "name": "boatId", "required": true, "dataType": "string" },
    };
    app.get('/boat/search/:boatId', ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController)), ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController.prototype.searchBoatInBoatsList)), async function BoatsController_searchBoatInBoatsList(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_searchBoatInBoatsList, request, response });
            const controller = new BoatsController_1.BoatsController();
            await templateService.apiHandler({
                methodName: 'searchBoatInBoatsList',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsBoatsController_getBoatDetails = {
        slug: { "in": "path", "name": "slug", "required": true, "dataType": "string" },
    };
    app.get('/boat/details/:slug', ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController)), ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController.prototype.getBoatDetails)), async function BoatsController_getBoatDetails(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_getBoatDetails, request, response });
            const controller = new BoatsController_1.BoatsController();
            await templateService.apiHandler({
                methodName: 'getBoatDetails',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsBoatsController_getBoatAvailability = {
        slug: { "in": "path", "name": "slug", "required": true, "dataType": "string" },
        year: { "in": "query", "name": "year", "dataType": "string" },
    };
    app.get('/boat/availability/:slug', ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController)), ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController.prototype.getBoatAvailability)), async function BoatsController_getBoatAvailability(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_getBoatAvailability, request, response });
            const controller = new BoatsController_1.BoatsController();
            await templateService.apiHandler({
                methodName: 'getBoatAvailability',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsBoatsController_getBoatWeekData = {
        slug: { "in": "path", "name": "slug", "required": true, "dataType": "string" },
        week: { "in": "path", "name": "week", "required": true, "dataType": "string" },
        year: { "in": "query", "name": "year", "dataType": "string" },
    };
    app.get('/boat/availability/:slug/week/:week', ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController)), ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController.prototype.getBoatWeekData)), async function BoatsController_getBoatWeekData(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_getBoatWeekData, request, response });
            const controller = new BoatsController_1.BoatsController();
            await templateService.apiHandler({
                methodName: 'getBoatWeekData',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsBoatsController_getBoatsList = {
        page: { "in": "query", "name": "page", "dataType": "double" },
        limit: { "in": "query", "name": "limit", "dataType": "double" },
        search: { "in": "query", "name": "search", "dataType": "string" },
        country: { "in": "query", "name": "country", "dataType": "string" },
        category: { "in": "query", "name": "category", "dataType": "string" },
        minPrice: { "in": "query", "name": "minPrice", "dataType": "double" },
        maxPrice: { "in": "query", "name": "maxPrice", "dataType": "double" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        order: { "in": "query", "name": "order", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
    };
    app.get('/boat/list', ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController)), ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController.prototype.getBoatsList)), async function BoatsController_getBoatsList(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_getBoatsList, request, response });
            const controller = new BoatsController_1.BoatsController();
            await templateService.apiHandler({
                methodName: 'getBoatsList',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsBoatsController_searchBoats = {
        query: { "in": "query", "name": "query", "required": true, "dataType": "string" },
        limit: { "in": "query", "name": "limit", "dataType": "double" },
    };
    app.get('/boat/search', ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController)), ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController.prototype.searchBoats)), async function BoatsController_searchBoats(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_searchBoats, request, response });
            const controller = new BoatsController_1.BoatsController();
            await templateService.apiHandler({
                methodName: 'searchBoats',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDashboardController_getDashboardSummary = {
        boat_type: { "in": "query", "name": "boat_type", "dataType": "string" },
        date_from: { "in": "query", "name": "date_from", "dataType": "string" },
        date_to: { "in": "query", "name": "date_to", "dataType": "string" },
    };
    app.get('/dashboard/summary', ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController)), ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController.prototype.getDashboardSummary)), async function DashboardController_getDashboardSummary(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getDashboardSummary, request, response });
            const controller = new DashboardController_1.DashboardController();
            await templateService.apiHandler({
                methodName: 'getDashboardSummary',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDashboardController_getKeyMetrics = {
        boat_type: { "in": "query", "name": "boat_type", "dataType": "string" },
        period: { "in": "query", "name": "period", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["week"] }, { "dataType": "enum", "enums": ["month"] }, { "dataType": "enum", "enums": ["quarter"] }, { "dataType": "enum", "enums": ["year"] }] },
        metrics: { "in": "query", "name": "metrics", "dataType": "string" },
    };
    app.get('/dashboard/metrics', ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController)), ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController.prototype.getKeyMetrics)), async function DashboardController_getKeyMetrics(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getKeyMetrics, request, response });
            const controller = new DashboardController_1.DashboardController();
            await templateService.apiHandler({
                methodName: 'getKeyMetrics',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDashboardController_getPriceTrends = {
        boat_type: { "in": "query", "name": "boat_type", "dataType": "string" },
        weeks: { "in": "query", "name": "weeks", "dataType": "string" },
        year: { "in": "query", "name": "year", "dataType": "double" },
    };
    app.get('/dashboard/price-trends', ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController)), ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController.prototype.getPriceTrends)), async function DashboardController_getPriceTrends(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getPriceTrends, request, response });
            const controller = new DashboardController_1.DashboardController();
            await templateService.apiHandler({
                methodName: 'getPriceTrends',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDashboardController_getDiscountTrends = {
        boat_type: { "in": "query", "name": "boat_type", "dataType": "string" },
        time_range: { "in": "query", "name": "time_range", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["week"] }, { "dataType": "enum", "enums": ["month"] }, { "dataType": "enum", "enums": ["quarter"] }, { "dataType": "enum", "enums": ["year"] }] },
        date_from: { "in": "query", "name": "date_from", "dataType": "string" },
        date_to: { "in": "query", "name": "date_to", "dataType": "string" },
    };
    app.get('/dashboard/discount-trends', ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController)), ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController.prototype.getDiscountTrends)), async function DashboardController_getDiscountTrends(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getDiscountTrends, request, response });
            const controller = new DashboardController_1.DashboardController();
            await templateService.apiHandler({
                methodName: 'getDiscountTrends',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDashboardController_getAvailabilityTrends = {
        boat_type: { "in": "query", "name": "boat_type", "dataType": "string" },
        time_range: { "in": "query", "name": "time_range", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["week"] }, { "dataType": "enum", "enums": ["month"] }, { "dataType": "enum", "enums": ["quarter"] }, { "dataType": "enum", "enums": ["year"] }] },
        date_from: { "in": "query", "name": "date_from", "dataType": "string" },
        date_to: { "in": "query", "name": "date_to", "dataType": "string" },
    };
    app.get('/dashboard/availability', ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController)), ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController.prototype.getAvailabilityTrends)), async function DashboardController_getAvailabilityTrends(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getAvailabilityTrends, request, response });
            const controller = new DashboardController_1.DashboardController();
            await templateService.apiHandler({
                methodName: 'getAvailabilityTrends',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDashboardController_getRevenueTrends = {
        boat_type: { "in": "query", "name": "boat_type", "dataType": "string" },
        time_range: { "in": "query", "name": "time_range", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["week"] }, { "dataType": "enum", "enums": ["month"] }, { "dataType": "enum", "enums": ["quarter"] }, { "dataType": "enum", "enums": ["year"] }] },
        date_from: { "in": "query", "name": "date_from", "dataType": "string" },
        date_to: { "in": "query", "name": "date_to", "dataType": "string" },
    };
    app.get('/dashboard/revenue', ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController)), ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController.prototype.getRevenueTrends)), async function DashboardController_getRevenueTrends(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getRevenueTrends, request, response });
            const controller = new DashboardController_1.DashboardController();
            await templateService.apiHandler({
                methodName: 'getRevenueTrends',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDashboardController_getSummaryStats = {
        boat_type: { "in": "query", "name": "boat_type", "dataType": "string" },
        category: { "in": "query", "name": "category", "dataType": "string" },
        limit: { "in": "query", "name": "limit", "dataType": "double" },
    };
    app.get('/dashboard/stats', ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController)), ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController.prototype.getSummaryStats)), async function DashboardController_getSummaryStats(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getSummaryStats, request, response });
            const controller = new DashboardController_1.DashboardController();
            await templateService.apiHandler({
                methodName: 'getSummaryStats',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDashboardController_healthCheck = {};
    app.get('/dashboard/health', ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController)), ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController.prototype.healthCheck)), async function DashboardController_healthCheck(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_healthCheck, request, response });
            const controller = new DashboardController_1.DashboardController();
            await templateService.apiHandler({
                methodName: 'healthCheck',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDashboardController_supabaseCheck = {};
    app.get('/dashboard/supabase-check', ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController)), ...((0, runtime_1.fetchMiddlewares)(DashboardController_1.DashboardController.prototype.supabaseCheck)), async function DashboardController_supabaseCheck(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_supabaseCheck, request, response });
            const controller = new DashboardController_1.DashboardController();
            await templateService.apiHandler({
                methodName: 'supabaseCheck',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
