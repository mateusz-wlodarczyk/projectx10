import dotenv from "dotenv";
dotenv.config();

import { processBoats, sendBoatToServer } from "./utils/processBoats.ts";
import { handleError } from "./utils/handleErrors.ts";
import { CALCULATE_FREEWEEKS_TILL_YEAR } from "./config/constans.ts";
import { BoatAroundService } from "./services/BoatAroundService.ts";
import { SupabaseService } from "./services/SupabaseService.ts";

export const boatServiceCatamaran = new BoatAroundService();
export const supabaseService = new SupabaseService();

export async function main() {
  //Running weekly task:

  // try {
  //   sendBoatToServer("croatia", "catamaran");
  // } catch (error) {
  //   handleError(error);
  // }

  //Running daily task:

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
