/**
 * Re-export from src/hooks so that imports from "hooks/useDashboard"
 * (e.g. root-level hooks folder) use the real implementation.
 * Do not add top-level await or other code here.
 */
export {
  useDashboard,
  useDashboardMetrics,
  useDashboardCharts,
  useDashboardRefresh,
} from "../src/hooks/useDashboard";
