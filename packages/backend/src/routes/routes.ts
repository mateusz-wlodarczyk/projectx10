/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BaseController } from './../controllers/BaseController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../controllers/AuthController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminController } from './../controllers/AdminController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BoatsController } from './../controllers/BoatsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DashboardController } from './../controllers/DashboardController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "AuthResponse": {
        "dataType": "refObject",
        "properties": {
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"emailVerified":{"dataType":"boolean","required":true},"lastName":{"dataType":"string","required":true},"firstName":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},
            "session": {"dataType":"nestedObjectLiteral","nestedProperties":{"expires_at":{"dataType":"double","required":true},"refresh_token":{"dataType":"string","required":true},"access_token":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PriceEntry": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"createdAt":{"dataType":"string","required":true},"discount":{"dataType":"double","required":true},"price":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PriceHistory": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"ref":"PriceEntry"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WeeklyPriceHistory": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"ref":"PriceHistory"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DashboardSummary": {
        "dataType": "refObject",
        "properties": {
            "lastUpdate": {"dataType":"datetime","required":true},
            "totalBoats": {"dataType":"double","required":true},
            "boatType": {"dataType":"string","required":true},
            "totalRevenue": {"dataType":"double","required":true},
            "averagePrice": {"dataType":"double","required":true},
            "totalBookings": {"dataType":"double","required":true},
            "availabilityRate": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DashboardSummaryResponse": {
        "dataType": "refObject",
        "properties": {
            "summary": {"ref":"DashboardSummary","required":true},
            "lastUpdate": {"dataType":"datetime","required":true},
            "dataSource": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "KeyMetric": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "value": {"dataType":"double","required":true},
            "unit": {"dataType":"string","required":true},
            "change": {"dataType":"double","required":true},
            "changeType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["increase"]},{"dataType":"enum","enums":["decrease"]},{"dataType":"enum","enums":["neutral"]}],"required":true},
            "trend": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["up"]},{"dataType":"enum","enums":["down"]},{"dataType":"enum","enums":["stable"]}],"required":true},
            "icon": {"dataType":"string","required":true},
            "color": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.number_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"double"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DashboardMetricsResponse": {
        "dataType": "refObject",
        "properties": {
            "metrics": {"dataType":"array","array":{"dataType":"refObject","ref":"KeyMetric"},"required":true},
            "period": {"dataType":"string","required":true},
            "comparison": {"dataType":"nestedObjectLiteral","nestedProperties":{"change":{"ref":"Record_string.number_","required":true},"previous":{"dataType":"array","array":{"dataType":"refObject","ref":"KeyMetric"},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WeeklyPriceDataPoint": {
        "dataType": "refObject",
        "properties": {
            "week": {"dataType":"double","required":true},
            "averagePrice": {"dataType":"double","required":true},
            "minPrice": {"dataType":"double","required":true},
            "maxPrice": {"dataType":"double","required":true},
            "boatCount": {"dataType":"double","required":true},
            "timestamp": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WeeklyPriceData": {
        "dataType": "refObject",
        "properties": {
            "weeks": {"dataType":"array","array":{"dataType":"refObject","ref":"WeeklyPriceDataPoint"},"required":true},
            "minPrice": {"dataType":"double","required":true},
            "maxPrice": {"dataType":"double","required":true},
            "averagePrice": {"dataType":"double","required":true},
            "totalBoats": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PriceTrendsResponse": {
        "dataType": "refObject",
        "properties": {
            "priceData": {"ref":"WeeklyPriceData","required":true},
            "trends": {"dataType":"nestedObjectLiteral","nestedProperties":{"yearly":{"dataType":"double","required":true},"monthly":{"dataType":"double","required":true},"weekly":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DiscountDataPoint": {
        "dataType": "refObject",
        "properties": {
            "timestamp": {"dataType":"datetime","required":true},
            "averageDiscount": {"dataType":"double","required":true},
            "minDiscount": {"dataType":"double","required":true},
            "maxDiscount": {"dataType":"double","required":true},
            "boatCount": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DiscountChartData": {
        "dataType": "refObject",
        "properties": {
            "dataPoints": {"dataType":"array","array":{"dataType":"refObject","ref":"DiscountDataPoint"},"required":true},
            "minDiscount": {"dataType":"double","required":true},
            "maxDiscount": {"dataType":"double","required":true},
            "averageDiscount": {"dataType":"double","required":true},
            "totalBoats": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DiscountTrendsResponse": {
        "dataType": "refObject",
        "properties": {
            "discountData": {"ref":"DiscountChartData","required":true},
            "trends": {"dataType":"nestedObjectLiteral","nestedProperties":{"change":{"dataType":"double","required":true},"trend":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["up"]},{"dataType":"enum","enums":["down"]},{"dataType":"enum","enums":["stable"]}],"required":true},"average":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailabilityDataPoint": {
        "dataType": "refObject",
        "properties": {
            "timestamp": {"dataType":"datetime","required":true},
            "availabilityRate": {"dataType":"double","required":true},
            "bookedBoats": {"dataType":"double","required":true},
            "totalBoats": {"dataType":"double","required":true},
            "occupancyRate": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailabilityData": {
        "dataType": "refObject",
        "properties": {
            "dataPoints": {"dataType":"array","array":{"dataType":"refObject","ref":"AvailabilityDataPoint"},"required":true},
            "averageAvailability": {"dataType":"double","required":true},
            "averageOccupancy": {"dataType":"double","required":true},
            "totalBoats": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailabilityResponse": {
        "dataType": "refObject",
        "properties": {
            "availabilityData": {"ref":"AvailabilityData","required":true},
            "insights": {"dataType":"nestedObjectLiteral","nestedProperties":{"averageOccupancy":{"dataType":"double","required":true},"lowSeason":{"dataType":"string","required":true},"peakSeason":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RevenueDataPoint": {
        "dataType": "refObject",
        "properties": {
            "timestamp": {"dataType":"datetime","required":true},
            "revenue": {"dataType":"double","required":true},
            "bookings": {"dataType":"double","required":true},
            "averageBookingValue": {"dataType":"double","required":true},
            "profitMargin": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RevenueData": {
        "dataType": "refObject",
        "properties": {
            "dataPoints": {"dataType":"array","array":{"dataType":"refObject","ref":"RevenueDataPoint"},"required":true},
            "totalRevenue": {"dataType":"double","required":true},
            "averageRevenue": {"dataType":"double","required":true},
            "totalBookings": {"dataType":"double","required":true},
            "averageProfitMargin": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RevenueResponse": {
        "dataType": "refObject",
        "properties": {
            "revenueData": {"ref":"RevenueData","required":true},
            "projections": {"dataType":"nestedObjectLiteral","nestedProperties":{"confidence":{"dataType":"double","required":true},"nextQuarter":{"dataType":"double","required":true},"nextMonth":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SummaryStat": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "value": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "trend": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["up"]},{"dataType":"enum","enums":["down"]},{"dataType":"enum","enums":["stable"]}],"required":true},
            "category": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["performance"]},{"dataType":"enum","enums":["market"]},{"dataType":"enum","enums":["seasonal"]},{"dataType":"enum","enums":["insight"]}],"required":true},
            "actionable": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DashboardStatsResponse": {
        "dataType": "refObject",
        "properties": {
            "stats": {"dataType":"array","array":{"dataType":"refObject","ref":"SummaryStat"},"required":true},
            "categories": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"double"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsBaseController_getWelcome: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/undefined',
            ...(fetchMiddlewares<RequestHandler>(BaseController)),
            ...(fetchMiddlewares<RequestHandler>(BaseController.prototype.getWelcome)),

            async function BaseController_getWelcome(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBaseController_getWelcome, request, response });

                const controller = new BaseController();

              await templateService.apiHandler({
                methodName: 'getWelcome',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_login: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LoginRequest"},
        };
        app.post('/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_login, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_register: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"RegisterRequest"},
        };
        app.post('/auth/register',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.register)),

            async function AuthController_register(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_register, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'register',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_forgotPassword: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true}}},
        };
        app.post('/auth/forgot-password',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.forgotPassword)),

            async function AuthController_forgotPassword(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_forgotPassword, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'forgotPassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_resetPassword: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"password":{"dataType":"string","required":true},"token":{"dataType":"string","required":true}}},
        };
        app.post('/auth/reset-password',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.resetPassword)),

            async function AuthController_resetPassword(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_resetPassword, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'resetPassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_logout: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.post('/auth/logout',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.logout)),

            async function AuthController_logout(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_logout, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'logout',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_updateProfile: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"lastName":{"dataType":"string","required":true},"firstName":{"dataType":"string","required":true}}},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/auth/profile',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.updateProfile)),

            async function AuthController_updateProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_updateProfile, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'updateProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getUsers: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/users',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getUsers)),

            async function AdminController_getUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getUsers, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_createUser: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"role":{"dataType":"string"},"lastName":{"dataType":"string","required":true},"firstName":{"dataType":"string","required":true},"password":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}}},
        };
        app.post('/admin/users',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.createUser)),

            async function AdminController_createUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_createUser, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'createUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_updateUser: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"role":{"dataType":"string"},"status":{"dataType":"string"},"email":{"dataType":"string"},"lastName":{"dataType":"string"},"firstName":{"dataType":"string"}}},
        };
        app.put('/admin/users/:id',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.updateUser)),

            async function AdminController_updateUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_updateUser, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'updateUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_deleteUser: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/admin/users/:id',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.deleteUser)),

            async function AdminController_deleteUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_deleteUser, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'deleteUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getCronLogs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/logs/cron',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getCronLogs)),

            async function AdminController_getCronLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getCronLogs, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getCronLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getSystemLogs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/logs/system',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getSystemLogs)),

            async function AdminController_getSystemLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getSystemLogs, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getSystemLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getCronJobs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/cron/jobs',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getCronJobs)),

            async function AdminController_getCronJobs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getCronJobs, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getCronJobs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getAllSupabaseLogs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/logs/all',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getAllSupabaseLogs)),

            async function AdminController_getAllSupabaseLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getAllSupabaseLogs, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getAllSupabaseLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getEdgeLogs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/logs/edge',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getEdgeLogs)),

            async function AdminController_getEdgeLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getEdgeLogs, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getEdgeLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getPostgresLogs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/logs/postgres',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getPostgresLogs)),

            async function AdminController_getPostgresLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getPostgresLogs, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getPostgresLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getPostgrestLogs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/logs/postgrest',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getPostgrestLogs)),

            async function AdminController_getPostgrestLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getPostgrestLogs, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getPostgrestLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getPoolerLogs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/logs/pooler',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getPoolerLogs)),

            async function AdminController_getPoolerLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getPoolerLogs, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getPoolerLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getAuthLogs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/logs/auth',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getAuthLogs)),

            async function AdminController_getAuthLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getAuthLogs, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getAuthLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getStorageLogs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/logs/storage',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getStorageLogs)),

            async function AdminController_getStorageLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getStorageLogs, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getStorageLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getRealtimeLogs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/logs/realtime',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getRealtimeLogs)),

            async function AdminController_getRealtimeLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getRealtimeLogs, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getRealtimeLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getEdgeFunctionsLogs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/logs/edge-functions',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getEdgeFunctionsLogs)),

            async function AdminController_getEdgeFunctionsLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getEdgeFunctionsLogs, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getEdgeFunctionsLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getPgcronLogs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/logs/pgcron',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getPgcronLogs)),

            async function AdminController_getPgcronLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getPgcronLogs, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getPgcronLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_getNotes: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/notes',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getNotes)),

            async function AdminController_getNotes(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getNotes, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getNotes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_createNote: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"notes":{"dataType":"string","required":true}}},
        };
        app.post('/admin/notes',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.createNote)),

            async function AdminController_createNote(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_createNote, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'createNote',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_updateNote: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"notes":{"dataType":"string","required":true}}},
        };
        app.put('/admin/notes/:id',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.updateNote)),

            async function AdminController_updateNote(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_updateNote, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'updateNote',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminController_deleteNote: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/admin/notes/:id',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.deleteNote)),

            async function AdminController_deleteNote(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_deleteNote, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'deleteNote',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBoatsController_healthCheck: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/boat/health',
            ...(fetchMiddlewares<RequestHandler>(BoatsController)),
            ...(fetchMiddlewares<RequestHandler>(BoatsController.prototype.healthCheck)),

            async function BoatsController_healthCheck(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_healthCheck, request, response });

                const controller = new BoatsController();

              await templateService.apiHandler({
                methodName: 'healthCheck',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBoatsController_getBoatData: Record<string, TsoaRoute.ParameterSchema> = {
                slug: {"in":"query","name":"slug","required":true,"dataType":"string"},
                week: {"in":"query","name":"week","required":true,"dataType":"string"},
        };
        app.get('/boat',
            ...(fetchMiddlewares<RequestHandler>(BoatsController)),
            ...(fetchMiddlewares<RequestHandler>(BoatsController.prototype.getBoatData)),

            async function BoatsController_getBoatData(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_getBoatData, request, response });

                const controller = new BoatsController();

              await templateService.apiHandler({
                methodName: 'getBoatData',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBoatsController_searchBoatInBoatsList: Record<string, TsoaRoute.ParameterSchema> = {
                boatId: {"in":"query","name":"boatId","required":true,"dataType":"string"},
        };
        app.get('/boat/search/:boatId',
            ...(fetchMiddlewares<RequestHandler>(BoatsController)),
            ...(fetchMiddlewares<RequestHandler>(BoatsController.prototype.searchBoatInBoatsList)),

            async function BoatsController_searchBoatInBoatsList(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_searchBoatInBoatsList, request, response });

                const controller = new BoatsController();

              await templateService.apiHandler({
                methodName: 'searchBoatInBoatsList',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBoatsController_getBoatDetails: Record<string, TsoaRoute.ParameterSchema> = {
                slug: {"in":"path","name":"slug","required":true,"dataType":"string"},
        };
        app.get('/boat/details/:slug',
            ...(fetchMiddlewares<RequestHandler>(BoatsController)),
            ...(fetchMiddlewares<RequestHandler>(BoatsController.prototype.getBoatDetails)),

            async function BoatsController_getBoatDetails(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_getBoatDetails, request, response });

                const controller = new BoatsController();

              await templateService.apiHandler({
                methodName: 'getBoatDetails',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBoatsController_getBoatAvailability: Record<string, TsoaRoute.ParameterSchema> = {
                slug: {"in":"path","name":"slug","required":true,"dataType":"string"},
                year: {"in":"query","name":"year","dataType":"string"},
        };
        app.get('/boat/availability/:slug',
            ...(fetchMiddlewares<RequestHandler>(BoatsController)),
            ...(fetchMiddlewares<RequestHandler>(BoatsController.prototype.getBoatAvailability)),

            async function BoatsController_getBoatAvailability(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_getBoatAvailability, request, response });

                const controller = new BoatsController();

              await templateService.apiHandler({
                methodName: 'getBoatAvailability',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBoatsController_getBoatWeekData: Record<string, TsoaRoute.ParameterSchema> = {
                slug: {"in":"path","name":"slug","required":true,"dataType":"string"},
                week: {"in":"path","name":"week","required":true,"dataType":"string"},
                year: {"in":"query","name":"year","dataType":"string"},
        };
        app.get('/boat/availability/:slug/week/:week',
            ...(fetchMiddlewares<RequestHandler>(BoatsController)),
            ...(fetchMiddlewares<RequestHandler>(BoatsController.prototype.getBoatWeekData)),

            async function BoatsController_getBoatWeekData(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_getBoatWeekData, request, response });

                const controller = new BoatsController();

              await templateService.apiHandler({
                methodName: 'getBoatWeekData',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBoatsController_getBoatsList: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
                search: {"in":"query","name":"search","dataType":"string"},
                country: {"in":"query","name":"country","dataType":"string"},
                category: {"in":"query","name":"category","dataType":"string"},
                minPrice: {"in":"query","name":"minPrice","dataType":"double"},
                maxPrice: {"in":"query","name":"maxPrice","dataType":"double"},
                sort: {"in":"query","name":"sort","dataType":"string"},
                order: {"in":"query","name":"order","dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
        };
        app.get('/boat/list',
            ...(fetchMiddlewares<RequestHandler>(BoatsController)),
            ...(fetchMiddlewares<RequestHandler>(BoatsController.prototype.getBoatsList)),

            async function BoatsController_getBoatsList(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_getBoatsList, request, response });

                const controller = new BoatsController();

              await templateService.apiHandler({
                methodName: 'getBoatsList',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBoatsController_searchBoats: Record<string, TsoaRoute.ParameterSchema> = {
                query: {"in":"query","name":"query","required":true,"dataType":"string"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/boat/search',
            ...(fetchMiddlewares<RequestHandler>(BoatsController)),
            ...(fetchMiddlewares<RequestHandler>(BoatsController.prototype.searchBoats)),

            async function BoatsController_searchBoats(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_searchBoats, request, response });

                const controller = new BoatsController();

              await templateService.apiHandler({
                methodName: 'searchBoats',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDashboardController_getDashboardSummary: Record<string, TsoaRoute.ParameterSchema> = {
                boat_type: {"in":"query","name":"boat_type","dataType":"string"},
                date_from: {"in":"query","name":"date_from","dataType":"string"},
                date_to: {"in":"query","name":"date_to","dataType":"string"},
        };
        app.get('/dashboard/summary',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.getDashboardSummary)),

            async function DashboardController_getDashboardSummary(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getDashboardSummary, request, response });

                const controller = new DashboardController();

              await templateService.apiHandler({
                methodName: 'getDashboardSummary',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDashboardController_getKeyMetrics: Record<string, TsoaRoute.ParameterSchema> = {
                boat_type: {"in":"query","name":"boat_type","dataType":"string"},
                period: {"in":"query","name":"period","dataType":"union","subSchemas":[{"dataType":"enum","enums":["week"]},{"dataType":"enum","enums":["month"]},{"dataType":"enum","enums":["quarter"]},{"dataType":"enum","enums":["year"]}]},
                metrics: {"in":"query","name":"metrics","dataType":"string"},
        };
        app.get('/dashboard/metrics',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.getKeyMetrics)),

            async function DashboardController_getKeyMetrics(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getKeyMetrics, request, response });

                const controller = new DashboardController();

              await templateService.apiHandler({
                methodName: 'getKeyMetrics',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDashboardController_getPriceTrends: Record<string, TsoaRoute.ParameterSchema> = {
                boat_type: {"in":"query","name":"boat_type","dataType":"string"},
                weeks: {"in":"query","name":"weeks","dataType":"string"},
                year: {"in":"query","name":"year","dataType":"double"},
        };
        app.get('/dashboard/price-trends',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.getPriceTrends)),

            async function DashboardController_getPriceTrends(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getPriceTrends, request, response });

                const controller = new DashboardController();

              await templateService.apiHandler({
                methodName: 'getPriceTrends',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDashboardController_getDiscountTrends: Record<string, TsoaRoute.ParameterSchema> = {
                boat_type: {"in":"query","name":"boat_type","dataType":"string"},
                time_range: {"in":"query","name":"time_range","dataType":"union","subSchemas":[{"dataType":"enum","enums":["week"]},{"dataType":"enum","enums":["month"]},{"dataType":"enum","enums":["quarter"]},{"dataType":"enum","enums":["year"]}]},
                date_from: {"in":"query","name":"date_from","dataType":"string"},
                date_to: {"in":"query","name":"date_to","dataType":"string"},
        };
        app.get('/dashboard/discount-trends',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.getDiscountTrends)),

            async function DashboardController_getDiscountTrends(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getDiscountTrends, request, response });

                const controller = new DashboardController();

              await templateService.apiHandler({
                methodName: 'getDiscountTrends',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDashboardController_getAvailabilityTrends: Record<string, TsoaRoute.ParameterSchema> = {
                boat_type: {"in":"query","name":"boat_type","dataType":"string"},
                time_range: {"in":"query","name":"time_range","dataType":"union","subSchemas":[{"dataType":"enum","enums":["week"]},{"dataType":"enum","enums":["month"]},{"dataType":"enum","enums":["quarter"]},{"dataType":"enum","enums":["year"]}]},
                date_from: {"in":"query","name":"date_from","dataType":"string"},
                date_to: {"in":"query","name":"date_to","dataType":"string"},
        };
        app.get('/dashboard/availability',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.getAvailabilityTrends)),

            async function DashboardController_getAvailabilityTrends(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getAvailabilityTrends, request, response });

                const controller = new DashboardController();

              await templateService.apiHandler({
                methodName: 'getAvailabilityTrends',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDashboardController_getRevenueTrends: Record<string, TsoaRoute.ParameterSchema> = {
                boat_type: {"in":"query","name":"boat_type","dataType":"string"},
                time_range: {"in":"query","name":"time_range","dataType":"union","subSchemas":[{"dataType":"enum","enums":["week"]},{"dataType":"enum","enums":["month"]},{"dataType":"enum","enums":["quarter"]},{"dataType":"enum","enums":["year"]}]},
                date_from: {"in":"query","name":"date_from","dataType":"string"},
                date_to: {"in":"query","name":"date_to","dataType":"string"},
        };
        app.get('/dashboard/revenue',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.getRevenueTrends)),

            async function DashboardController_getRevenueTrends(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getRevenueTrends, request, response });

                const controller = new DashboardController();

              await templateService.apiHandler({
                methodName: 'getRevenueTrends',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDashboardController_getSummaryStats: Record<string, TsoaRoute.ParameterSchema> = {
                boat_type: {"in":"query","name":"boat_type","dataType":"string"},
                category: {"in":"query","name":"category","dataType":"string"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/dashboard/stats',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.getSummaryStats)),

            async function DashboardController_getSummaryStats(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_getSummaryStats, request, response });

                const controller = new DashboardController();

              await templateService.apiHandler({
                methodName: 'getSummaryStats',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDashboardController_healthCheck: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/dashboard/health',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.healthCheck)),

            async function DashboardController_healthCheck(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDashboardController_healthCheck, request, response });

                const controller = new DashboardController();

              await templateService.apiHandler({
                methodName: 'healthCheck',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
