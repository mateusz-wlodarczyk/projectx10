// import express from "express";

import { BoatAroundService } from "./services/BoatAroundService";
import { BoatSearchedResaultsCountry } from "./types/searchedBoat";
import { SingleBoatDetails } from "./types/searchedBoatSingleTypes";

const boatServiceCatamaran = new BoatAroundService();

async function fetchBoats() {
  const params = { country: "croatia", category: "catamaran" };
  const croatiaCatamarans = await boatServiceCatamaran.getBoats<SingleBoatDetails[], BoatSearchedResaultsCountry>(params);
  console.log(croatiaCatamarans);
}
async function fetchBoatsTest() {
  let allBoats: SingleBoatDetails[] = [];
  let currentPage = 1;
  let totalResults: number;
  let params = { country: "croatia", category: "catamaran", page: currentPage };
  const response = await boatServiceCatamaran.getBoatsTest<BoatSearchedResaultsCountry>(params);

  allBoats = [...allBoats, ...response.data[0].data];
  totalResults = response.data[0].totalBoats;

  while (allBoats.length < totalResults) {
    currentPage++;
    params = { ...params, page: currentPage };
    const response = await boatServiceCatamaran.getBoatsTest<BoatSearchedResaultsCountry>(params);
    allBoats = [...allBoats, ...response.data[0].data];
  }
  console.log(allBoats);

  // return allBoats
}
export function main() {
  fetchBoatsTest();
}
main();

///
///
///

// const app = express();
// const PORT = 3000;

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
