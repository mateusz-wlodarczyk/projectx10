// import { Request, Response } from "express";
// import { BoatQuery, WeeklyPriceHistory } from "../types/priceBoat";
// import { loggerMain, supabaseService } from "..";
// import { isWeeklyPriceHistory } from "./selectDataArrayChecking";

// export async function handleFilteredSlugWeek(
//   req: Request<{}, { slug: string; boat: WeeklyPriceHistory }, {}, BoatQuery>,
//   res: Response,
// ): Promise<void> {
//   const { slug, week, year } = req.query;

//   if (!slug || !week || !year) {
//     res.status(400).json({ error: "Missing 'slug', 'week' or 'year' query parameters." });
//     return;
//   }

//   try {
//     const { data: boat, error } = await supabaseService.selectData(`boat_availability_${year}`, `week_${week}`, [{ column: "slug", value: slug }]);
//     if (error || !boat) {
//       res.status(404).json({ error: "Boat not found" });
//       return;
//     }

//     if (!isWeeklyPriceHistory(boat)) {
//       res.status(400).json({ error: "Invalid data format. Expected PriceHistory." });
//       return;
//     }

//     if (Object.keys(boat).length === 0) {
//       res.status(404).json({ error: "No data found for the specified boat, week, and year." });
//       return;
//     }

//     res.json({ slug, boat });
//     return;
//   } catch (err) {
//     loggerMain.error("Error in /boat endpoint", err);
//     res.status(500).json({ error: "Server error" });
//   }
// }
import { Request, Response } from "express";
import { BoatQuery } from "../types/priceBoat";
import { getBoatData } from "./getBoatData";
import { loggerMain } from "..";

export async function handleFilteredSlugWeek(req: Request<{}, {}, {}, BoatQuery>, res: Response): Promise<void> {
  const { slug, week, year } = req.query;

  if (!slug || !week || !year) {
    res.status(400).json({ error: "Missing 'slug', 'week' or 'year' query parameters." });
    return;
  }

  try {
    const result = await getBoatData(slug, week, year);
    res.json(result);
    return;
  } catch (err: any) {
    loggerMain.error("Error in /boat endpoint", err);
    res.status(500).json({ error: "Server error" });
  }
}
