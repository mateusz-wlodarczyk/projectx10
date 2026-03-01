/**
 * URL configuration constants
 */

export const FRONTEND_URLS = {
  DEVELOPMENT: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
  PRODUCTION: ["https://https://boats-filter.netlify.app/"],
};

export const BACKEND_PORT = process.env.PORT || 8080;
export const BACKEND_URL = process.env.NODE_ENV === "production" ? "https://https://boats-filter.netlify.app/" : `http://localhost:${BACKEND_PORT}`;

export const getCorsOrigins = () => {
  return process.env.NODE_ENV === "production" ? FRONTEND_URLS.PRODUCTION : FRONTEND_URLS.DEVELOPMENT;
};
