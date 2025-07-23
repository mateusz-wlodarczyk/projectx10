import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const PriceEntrySchema = z.object({
  price: z.number().openapi({ description: "Price of the boat" }),
  discount: z.number().openapi({ description: "Discount on the price" }),
  createdAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, { message: "Invalid ISO datetime format" })
    .openapi({ description: "Creation date in ISO format" }),
});

export const PriceHistorySchema = z.record(z.string(), PriceEntrySchema).openapi({ description: "History of prices for a specific timestamp" });

export const WeeklyPriceHistorySchema = z.record(z.string(), PriceHistorySchema).openapi({ description: "Weekly price history for a boat" });

export const BoatQuerySchema = z.object({
  slug: z.string().openapi({ description: "Slug of the boat" }),
  week: z.string().openapi({ description: "Week number" }),
  year: z.string().openapi({ description: "Year" }),
});
