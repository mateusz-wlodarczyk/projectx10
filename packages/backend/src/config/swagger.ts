import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { BoatQuerySchema, PriceEntrySchema, PriceHistorySchema, WeeklyPriceHistorySchema } from "../types/typesZod";
import { SWAGGER_URL, SWAGGER_VERSION } from "./constans";

const registry = new OpenAPIRegistry();

registry.register("PriceEntry", PriceEntrySchema);
registry.register("PriceHistory", PriceHistorySchema);
registry.register("WeeklyPriceHistory", WeeklyPriceHistorySchema);
registry.register("BoatQuery", BoatQuerySchema);

registry.registerPath({
  method: "get",
  path: "/boat",
  description: "Retrieve price history for a boat in a specific week and year.",
  summary: "Get boat pricing",
  request: {
    query: BoatQuerySchema,
  },
  responses: {
    200: {
      description: "Price history data",
      content: {
        "application/json": {
          schema: WeeklyPriceHistorySchema,
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

const generator = new OpenApiGeneratorV3(registry.definitions);
const swaggerDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "BoatsStats API",
    version: SWAGGER_VERSION,
    description: "Swagger UI for BoatsStats API",
  },
  servers: [
    {
      url: SWAGGER_URL,
    },
  ],
});

export const setupSwagger = (app: Application): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
