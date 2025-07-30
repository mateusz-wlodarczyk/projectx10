"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoatData = getBoatData;
const __1 = require("..");
async function getBoatData(slug, week, year) {
    if (!slug || !week || !year) {
        throw new Error("Missing 'slug', 'week' or 'year' query parameters.");
    }
    try {
        const { data: boat, error } = await __1.supabaseService.selectData(`boat_availability_${year}`, `week_${week}`, [{ column: "slug", value: slug }]);
        if (error || !boat) {
            throw new Error("Boat not found");
        }
        // Check if boat is an array and take the first element
        const boatData = Array.isArray(boat) ? boat[0] : boat;
        if (!boatData || typeof boatData !== "object") {
            throw new Error("Invalid data format. Expected PriceHistory.");
        }
        if (Object.keys(boatData).length === 0) {
            throw new Error("No data found for the specified boat, week, and year.");
        }
        return { slug, boat: boatData };
    }
    catch (err) {
        __1.loggerMain.error("Error in boat endpoint", err);
        throw err;
    }
}
