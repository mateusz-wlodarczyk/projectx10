import dotenv from "dotenv";
dotenv.config();
import { BoatAroundService } from "./services/BoatAroundService";
import { SupabaseService } from "./services/SupabaseService";
import { processBoats, sendBoatToServer } from "./utils/processBoats";

import { handleError } from "./utils/handleErrors";
import { CALCULATE_FREEWEEKS_TILL_YEAR } from "./config/constans";

export const boatServiceCatamaran = new BoatAroundService();
export const supabaseService = new SupabaseService();

export async function main() {
  try {
    sendBoatToServer("croatia", "catamaran");
  } catch (error) {
    handleError(error);
  }

  try {
    const { data: downloadedBoats } = await supabaseService.selectData<{ slug: string }>("boats_list", "slug");
    if (downloadedBoats !== null) {
      await processBoats(downloadedBoats, CALCULATE_FREEWEEKS_TILL_YEAR);
    }
  } catch (error) {
    handleError(error);
  }
}
main();
