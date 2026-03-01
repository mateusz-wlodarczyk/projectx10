"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocument = void 0;
const constans_1 = require("../config/constans");
exports.swaggerDocument = {
    openapi: constans_1.SWAGGER_OPENAPI,
    info: {
        title: "",
        version: constans_1.SWAGGER_VERSION,
        description: "",
        license: {
            name: "ISC",
        },
        contact: {
            name: "Fake Boat",
            email: "fake.boat@ph.com",
        },
    },
    servers: [{ url: constans_1.SWAGGER_TAGS.home.url }],
    paths: {
        [constans_1.SWAGGER_TAGS.home.url]: {
            get: {
                operationId: "HelloWorld",
                description: "HelloWorld endpoint",
                tags: [constans_1.SWAGGER_TAGS.home.tag],
                responses: {
                    "200": {
                        description: "A HelloWorld message",
                        content: {
                            "application/json": {
                                schema: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
        [constans_1.SWAGGER_TAGS.boat.url]: {
            get: {
                operationId: "getBoatData",
                description: "Get boat data for a specific slug, week, and year",
                tags: [constans_1.SWAGGER_TAGS.boat.tag],
                parameters: [
                    {
                        name: "slug",
                        in: "query",
                        required: true,
                        description: "The slug of the boat",
                        schema: { type: "string" },
                    },
                    {
                        name: "week",
                        in: "query",
                        required: true,
                        description: "The week number",
                        schema: { type: "string" },
                    },
                    {
                        name: "year",
                        in: "query",
                        required: true,
                        description: "The year",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "Price history data for the boat",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/BoatResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            PriceEntry: {
                type: "object",
                required: ["createdAt", "discount", "price"],
                properties: {
                    createdAt: { type: "string" },
                    discount: { type: "number", format: "double" },
                    price: { type: "number", format: "double" },
                },
            },
            PriceHistory: {
                type: "object",
                additionalProperties: {
                    $ref: "#/components/schemas/PriceEntry",
                },
            },
            WeeklyPriceHistory: {
                type: "object",
                additionalProperties: {
                    $ref: "#/components/schemas/PriceHistory",
                },
            },
            BoatResponse: {
                type: "object",
                required: ["boat", "slug"],
                properties: {
                    boat: {
                        $ref: "#/components/schemas/WeeklyPriceHistory",
                    },
                    slug: { type: "string" },
                },
            },
        },
    },
};
