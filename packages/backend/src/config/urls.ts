/**
 * URL configuration constants
 */

export const FRONTEND_URLS = {
  DEVELOPMENT: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
  PRODUCTION: ["https://boats-filter.netlify.app"],
};

export const BACKEND_PORT = process.env.PORT || 8080;
export const BACKEND_URL = process.env.NODE_ENV === "production" ? "https://boats-filter.netlify.app" : `http://localhost:${BACKEND_PORT}`;

/** CORS: use CORS_ORIGIN env (comma-separated) or default frontend origins. No trailing slashes. */
export const getCorsOrigins = (): string[] => {
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);
  }
  // Render/Netlify often don't set NODE_ENV=production; allow production frontend unless explicitly dev
  if (process.env.NODE_ENV === "development") {
    return FRONTEND_URLS.DEVELOPMENT;
  }
  return [...FRONTEND_URLS.PRODUCTION, ...FRONTEND_URLS.DEVELOPMENT];
};
