export const API_REQUEST_PRICE_DELAY_MS = 24000;
export const CALCULATE_FREEWEEKS_TILL_YEAR = 2026;

/** Year for boat_availability_* table. Set AVAILABILITY_YEAR=2025 in env to use boat_availability_2025. */
export const getAvailabilityYear = (): number => {
  const env = process.env.AVAILABILITY_YEAR;
  if (env) {
    const year = parseInt(env, 10);
    if (!Number.isNaN(year)) return year;
  }
  return new Date().getFullYear();
};
export const API_BOAT = { URL: "https://api.boataround.com", price: "/v1/price", search: "/v1/search", avaibility: "/v1/availability" };
export const RESPONSE_STATUS = { success: "Success", error: "Error" };
export const SWAGGER_OPENAPI = "3.0.0";
export const SWAGGER_VERSION = "0.0.0";
export const SWAGGER_TAGS = {
  home: {
    tag: "home",
    url: "/",
  },
  boat: {
    tag: "boat",
    url: "/boat",
  },
};
