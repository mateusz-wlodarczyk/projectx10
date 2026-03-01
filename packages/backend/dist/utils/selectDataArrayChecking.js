"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWeeklyPriceHistory = exports.isSlugArray = void 0;
exports.isWeekDataArray = isWeekDataArray;
const isSlugArray = (data) => Array.isArray(data) && data.every((item) => typeof item.slug === "string");
exports.isSlugArray = isSlugArray;
function isWeekDataArray(data) {
    return (Array.isArray(data) &&
        data.every((item) => typeof item === "object" && item !== null && typeof item.id === "number" && typeof item.slug === "string"));
}
const isWeeklyPriceHistory = (data) => {
    return (Array.isArray(data) &&
        data.every((weeklyHistory) => {
            return Object.entries(weeklyHistory).every(([key, value]) => {
                if (key.startsWith("week_")) {
                    return true;
                }
                else {
                    return false;
                }
            });
        }));
};
exports.isWeeklyPriceHistory = isWeeklyPriceHistory;
