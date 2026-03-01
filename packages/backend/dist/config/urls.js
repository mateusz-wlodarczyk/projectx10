"use strict";
/**
 * URL configuration constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorsOrigins = exports.BACKEND_URL = exports.BACKEND_PORT = exports.FRONTEND_URLS = void 0;
exports.FRONTEND_URLS = {
    DEVELOPMENT: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    PRODUCTION: ["https://yourdomain.com"],
};
exports.BACKEND_PORT = process.env.PORT || 8080;
exports.BACKEND_URL = process.env.NODE_ENV === "production" ? "https://yourbackend.com" : `http://localhost:${exports.BACKEND_PORT}`;
const getCorsOrigins = () => {
    return process.env.NODE_ENV === "production" ? exports.FRONTEND_URLS.PRODUCTION : exports.FRONTEND_URLS.DEVELOPMENT;
};
exports.getCorsOrigins = getCorsOrigins;
