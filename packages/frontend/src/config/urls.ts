/**
 * URL configuration constants
 */

export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://yourbackend.com"
    : "http://localhost:8080";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BACKEND_URL}/auth/login`,
    REGISTER: `${BACKEND_URL}/auth/register`,
    LOGOUT: `${BACKEND_URL}/auth/logout`,
    FORGOT_PASSWORD: `${BACKEND_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${BACKEND_URL}/auth/reset-password`,
    PROFILE: `${BACKEND_URL}/auth/profile`,
  },
  BOATS: {
    LIST: `${BACKEND_URL}/boat/list`,
    SEARCH: `${BACKEND_URL}/boat/search`,
    DETAILS: `${BACKEND_URL}/boat`,
  },
  DASHBOARD: {
    SUMMARY: `${BACKEND_URL}/dashboard/summary`,
    METRICS: `${BACKEND_URL}/dashboard/metrics`,
    PRICE_TRENDS: `${BACKEND_URL}/dashboard/price-trends`,
    DISCOUNT_TRENDS: `${BACKEND_URL}/dashboard/discount-trends`,
    AVAILABILITY: `${BACKEND_URL}/dashboard/availability`,
    REVENUE: `${BACKEND_URL}/dashboard/revenue`,
    STATS: `${BACKEND_URL}/dashboard/stats`,
    HEALTH: `${BACKEND_URL}/dashboard/health`,
  },
};
