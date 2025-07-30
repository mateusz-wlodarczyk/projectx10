import express, { Request, Response } from "express";
import { handleFilteredSlugWeek } from "../utils/handleFilteredSlugWeek";
import { BoatQuery, WeeklyPriceHistory } from "../types/priceBoat";
import swaggerUi from "swagger-ui-express";
const app: express.Application = express();
import { swaggerDocument } from "../swagger/swagger";

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.get<{}, { slug: string; boat: WeeklyPriceHistory }, {}, BoatQuery>("/boat", handleFilteredSlugWeek);
//example: http://localhost:8080/boat?slug=bali-41-avaler&year=2025&week=1
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
export default app;
