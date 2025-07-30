import { SWAGGER_OPENAPI, SWAGGER_TAGS, SWAGGER_VERSION } from "../config/constans";

export const swaggerDocument = {
  openapi: SWAGGER_OPENAPI,
  info: {
    title: "",
    version: SWAGGER_VERSION,
    description: "",
    license: {
      name: "ISC",
    },
    contact: {
      name: "Sebastian Szczepanski",
      email: "szczep.sebastian@gmail.com",
    },
  },
  servers: [{ url: SWAGGER_TAGS.home.url }],
  paths: {
    [SWAGGER_TAGS.home.url]: {
      get: {
        operationId: "HelloWorld",
        description: "HelloWorld endpoint",
        tags: [SWAGGER_TAGS.home.tag],
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
    [SWAGGER_TAGS.boat.url]: {
      get: {
        operationId: "getBoatData",
        description: "Get boat data for a specific slug, week, and year",
        tags: [SWAGGER_TAGS.boat.tag],
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
