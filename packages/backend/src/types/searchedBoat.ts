import { SingleBoatDetails, FilterBoatSearched } from "./searchedBoatSingleTypes";

export interface BoatSearchedResultsCountry {
  status: string;
  data: {
    _id: null | string;
    data: SingleBoatDetails[];
    filter: FilterBoatSearched;
    totalBoats: number;
    totalBoatsWithNearBy: number;
    totalDestinationCount: number;
    totalResults: number;
    currentPage: number;
  }[];

  statusCode: number;
}
