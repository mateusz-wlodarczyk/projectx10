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

/** CORS: always include production frontend; merge with CORS_ORIGIN env (comma-separated). No trailing slashes. */
export const getCorsOrigins = (): string[] => {
  const fromEnv = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => normalizeOrigin(o)).filter(Boolean)
    : [];
  if (process.env.NODE_ENV === "development") {
    return [...new Set([...FRONTEND_URLS.DEVELOPMENT, ...fromEnv])];
  }
  // Production: always allow known frontend + env origins (so Netlify is never blocked by wrong CORS_ORIGIN)
  return [...new Set([...FRONTEND_URLS.PRODUCTION, ...FRONTEND_URLS.DEVELOPMENT, ...fromEnv])];
};
