import { Controller, Get, Route, Tags, Query } from "tsoa";
import { WeeklyPriceHistory } from "../types/priceBoat";
import { getBoatData } from "../utils/getBoatData";

@Route("boat")
@Tags("Boats")
export class BoatsController extends Controller {
  /**
   * @param slug
   * @param week
   * @param year
   * @returns
   */
  @Get("/")
  public async getBoatData(@Query() slug: string, @Query() week: string, @Query() year: string): Promise<{ slug: string; boat: WeeklyPriceHistory }> {
    return await getBoatData(slug, week, year);
  }
}
