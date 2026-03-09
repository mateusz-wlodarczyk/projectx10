"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SWAGGER_TAGS = exports.SWAGGER_VERSION = exports.SWAGGER_OPENAPI = exports.RESPONSE_STATUS = exports.API_BOAT = exports.getAvailabilityYear = exports.CALCULATE_FREEWEEKS_TILL_YEAR = exports.API_REQUEST_PRICE_DELAY_MS = void 0;
exports.API_REQUEST_PRICE_DELAY_MS = 24000;
exports.CALCULATE_FREEWEEKS_TILL_YEAR = 2026;
/** Year for boat_availability_* table. Set AVAILABILITY_YEAR=2025 in env to use boat_availability_2025. */
const getAvailabilityYear = () => {
    const env = process.env.AVAILABILITY_YEAR;
    if (env) {
        const year = parseInt(env, 10);
        if (!Number.isNaN(year))
            return year;
    }
    return new Date().getFullYear();
};
exports.getAvailabilityYear = getAvailabilityYear;
exports.API_BOAT = { URL: "https://api.boataround.com", price: "/v1/price", search: "/v1/search", avaibility: "/v1/availability" };
exports.RESPONSE_STATUS = { success: "Success", error: "Error" };
exports.SWAGGER_OPENAPI = "3.0.0";
exports.SWAGGER_VERSION = "0.0.0";
exports.SWAGGER_TAGS = {
    home: {
        tag: "home",
        url: "/",
    },
    boat: {
        tag: "boat",
        url: "/boat",
    },
};
