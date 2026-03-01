"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoatData = getBoatData;
const __1 = require("..");
async function getBoatData(slug, week) {
    try {
        // Use current year for boat data
        const currentYear = new Date().getFullYear();
        const { data: boat, error } = await __1.supabaseService.selectData(`boat_availability_${currentYear}`, `week_${week}`, [{ column: "slug", value: slug }]);
        if (error || !boat) {
            throw new Error("Boat not found");
        }
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
