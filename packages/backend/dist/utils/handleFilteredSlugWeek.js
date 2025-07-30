"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFilteredSlugWeek = handleFilteredSlugWeek;
const __1 = require("..");
const selectDataArrayChecking_1 = require("./selectDataArrayChecking");
//example: http://localhost:8080/boat?slug=bali-41-avaler&year=2025&week=1
async function handleFilteredSlugWeek(req, res) {
    const { slug, week, year } = req.query;
    if (!slug || !week || !year) {
        res.status(400).json({ error: "Missing 'slug', 'week' or 'year' query parameters." });
        return;
    }
    try {
        const { data: boat, error } = await __1.supabaseService.selectData(`boat_availability_${year}`, `week_${week}`, [{ column: "slug", value: slug }]);
        if (error || !boat) {
            res.status(404).json({ error: "Boat not found" });
            return;
        }
        if (!(0, selectDataArrayChecking_1.isWeeklyPriceHistory)(boat)) {
            res.status(400).json({ error: "Invalid data format. Expected PriceHistory." });
            return;
        }
        if (Object.keys(boat).length === 0) {
            res.status(404).json({ error: "No data found for the specified boat, week, and year." });
            return;
        }
        res.json({ slug, boat });
        return;
    }
    catch (err) {
        __1.loggerMain.error("Error in /boat endpoint", err);
        res.status(500).json({ error: "Server error" });
    }
}
