import dotenv from "dotenv";
dotenv.config();
import { BoatAroundService } from "./services/BoatAroundService";
import { SupabaseService } from "./services/supabaseService";
import { SingleBoatAvability, SingleBoatDataAvability } from "./types/avabilityBoat";

const boatServiceCatamaran = new BoatAroundService();
const supabaseService = new SupabaseService();
//pewnie wywalic do innego pliku? //utils?
export async function fetchBoats() {
  const params = { country: "croatia", category: "catamaran" };
  const response = await boatServiceCatamaran.getBoats(params);
  return response;
}
//pewnie wywalic do innego pliku? //utils?
export async function fetchAvabilitySingleBoat(slug: string) {
  const response = await boatServiceCatamaran.getAvailabilitySingleBoat<SingleBoatAvability>(slug);
  return response;
}
export async function main() {
  const catamarans = await fetchBoats();
  await Promise.all(
    catamarans.map(async (el) => {
      const { error: errorUpsertData } = await supabaseService.upsertData("boat_catamarans", el);
      const avabilityBoat = await fetchAvabilitySingleBoat(el.slug);
      const { error: errorInsertData } = await supabaseService.insertData<SingleBoatDataAvability>("boat_avability", avabilityBoat.data[0]);
      if (errorUpsertData || errorInsertData) {
        console.log(`errorUpsertData: ${errorUpsertData}, ${JSON.stringify(errorUpsertData, null, 2)}`);
        console.log(`errorInsertData: ${errorInsertData}, ${JSON.stringify(errorInsertData, null, 2)}`);
      }
    }),
  );
}
main();
