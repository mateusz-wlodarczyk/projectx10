"use strict";
/**
 * URL configuration constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorsOrigins = exports.BACKEND_URL = exports.BACKEND_PORT = exports.FRONTEND_URLS = void 0;
exports.FRONTEND_URLS = {
    DEVELOPMENT: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    PRODUCTION: ["https://boats-filter.netlify.app"],
};
exports.BACKEND_PORT = process.env.PORT || 8080;
exports.BACKEND_URL = process.env.NODE_ENV === "production" ? "https://boats-filter.netlify.app" : `http://localhost:${exports.BACKEND_PORT}`;
function normalizeOrigin(url) {
    return url.trim().replace(/\/+$/, "") || url;
}
/** CORS: always include production frontend (Netlify) even if NODE_ENV is wrong on Render; merge with CORS_ORIGIN. */
const getCorsOrigins = () => {
    const fromEnv = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",").map((o) => normalizeOrigin(o)).filter(Boolean)
        : [];
    // Always allow PRODUCTION (boats-filter.netlify.app) so env mix-up on Render never blocks it
    return [...new Set([...exports.FRONTEND_URLS.PRODUCTION, ...exports.FRONTEND_URLS.DEVELOPMENT, ...fromEnv])];
};
exports.getCorsOrigins = getCorsOrigins;
