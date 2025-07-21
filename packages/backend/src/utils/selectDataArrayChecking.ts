import { WeeklyPriceHistory } from "../types/priceBoat";
import { WeekData } from "../types/savedBoatsResults";

export const isSlugArray = (data: any): data is { slug: string }[] => Array.isArray(data) && data.every((item) => typeof item.slug === "string");
export function isWeekDataArray(data: any): data is WeekData[] {
  return (
    Array.isArray(data) &&
    data.every((item) => typeof item === "object" && item !== null && typeof item.id === "number" && typeof item.slug === "string")
  );
}
export const isWeeklyPriceHistory = (data: any): data is WeeklyPriceHistory[] => {
  return (
    Array.isArray(data) &&
    data.every((weeklyHistory) => {
      return Object.entries(weeklyHistory).every(([key, value]) => {
        if (key.startsWith("week_")) {
          return true;
        } else {
          return false;
        }
      });
    })
  );
};
