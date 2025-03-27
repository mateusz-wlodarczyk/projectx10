import { SingleBoatDetails, FilterBoatSearched } from "./searchedBoatSingleTypes";

export interface BoatSearchedResaultsCountry {
  status: string;
  data: [
    {
      _id: null | string;
      data: SingleBoatDetails[];
      filter: FilterBoatSearched;
      totalBoats: number;
      totalBoatsWithNearBy: number;
      totalDestinationCount: number;
      totalResults: number;
      currentPage: number;
    },
  ];
  statusCode: number;
}
