"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoatQuerySchema = exports.WeeklyPriceHistorySchema = exports.PriceHistorySchema = exports.PriceEntrySchema = void 0;
const zod_1 = require("zod");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
exports.PriceEntrySchema = zod_1.z.object({
    price: zod_1.z.number().openapi({ description: "Price of the boat" }),
    discount: zod_1.z.number().openapi({ description: "Discount on the price" }),
    createdAt: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, { message: "Invalid ISO datetime format" })
        .openapi({ description: "Creation date in ISO format" }),
});
exports.PriceHistorySchema = zod_1.z.record(zod_1.z.string(), exports.PriceEntrySchema).openapi({ description: "History of prices for a specific timestamp" });
exports.WeeklyPriceHistorySchema = zod_1.z.record(zod_1.z.string(), exports.PriceHistorySchema).openapi({ description: "Weekly price history for a boat" });
exports.BoatQuerySchema = zod_1.z.object({
    slug: zod_1.z.string().openapi({ description: "Slug of the boat" }),
    week: zod_1.z.string().openapi({ description: "Week number" }),
    year: zod_1.z.string().openapi({ description: "Year" }),
});
