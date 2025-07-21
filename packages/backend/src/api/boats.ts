import express, { Request, Response } from "express";
import { handleFilteredSlugWeek } from "../utils/handleFilteredSlugWeek";
import { BoatQuery, WeeklyPriceHistory } from "../types/priceBoat";

const app: express.Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.get<{}, { slug: string; boat: WeeklyPriceHistory }, {}, BoatQuery>("/boat", handleFilteredSlugWeek);

export default app;
