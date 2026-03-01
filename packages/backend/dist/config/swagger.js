"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const typesZod_1 = require("../types/typesZod");
const constans_1 = require("./constans");
const registry = new zod_to_openapi_1.OpenAPIRegistry();
registry.register("PriceEntry", typesZod_1.PriceEntrySchema);
registry.register("PriceHistory", typesZod_1.PriceHistorySchema);
registry.register("WeeklyPriceHistory", typesZod_1.WeeklyPriceHistorySchema);
registry.register("BoatQuery", typesZod_1.BoatQuerySchema);
registry.registerPath({
    method: "get",
    path: "/boat",
    description: "Retrieve price history for a boat in a specific week and year.",
    summary: "Get boat pricing",
    request: {
        query: typesZod_1.BoatQuerySchema,
    },
    responses: {
        200: {
            description: "Price history data",
            content: {
                "application/json": {
                    schema: typesZod_1.WeeklyPriceHistorySchema,
                },
            },
        },
        400: {
            description: "Invalid request",
        },
        404: {
            description: "Boat not found",
        },
    },
});
const generator = new zod_to_openapi_1.OpenApiGeneratorV3(registry.definitions);
const swaggerDocument = generator.generateDocument({
    openapi: "3.0.0",
    info: {
        title: "BoatsStats API",
        version: constans_1.SWAGGER_VERSION,
        description: "Swagger UI for BoatsStats API",
    },
    servers: [
        {
            url: constans_1.SWAGGER_URL,
        },
    ],
});
const setupSwagger = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
};
exports.setupSwagger = setupSwagger;
