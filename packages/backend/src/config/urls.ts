/**
 * URL configuration constants
 */

export const FRONTEND_URLS = {
  DEVELOPMENT: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
  PRODUCTION: ["https://boats-filter.netlify.app"],
};

export const BACKEND_PORT = process.env.PORT || 8080;
export const BACKEND_URL = process.env.NODE_ENV === "production" ? "https://boats-filter.netlify.app" : `http://localhost:${BACKEND_PORT}`;

function normalizeOrigin(url: string): string {
  return url.trim().replace(/\/+$/, "") || url;
}

/** CORS: always include production frontend (Netlify) even if NODE_ENV is wrong on Render; merge with CORS_ORIGIN. */
export const getCorsOrigins = (): string[] => {
  const fromEnv = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => normalizeOrigin(o)).filter(Boolean)
    : [];
  // Always allow PRODUCTION (boats-filter.netlify.app) so env mix-up on Render never blocks it
  return [...new Set([...FRONTEND_URLS.PRODUCTION, ...FRONTEND_URLS.DEVELOPMENT, ...fromEnv])];
};
