import { HttpClient } from "../api";
import { BoatSearchedResaultsCountry } from "../types/searchedBoat";
import { SingleBoatDetails } from "../types/searchedBoatSingleTypes";

export class BoatAroundService {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient("https://api.boataround.com");
  }

  public async getBoats(params?: Record<string, any>): Promise<SingleBoatDetails[]> {
    let allBoats: SingleBoatDetails[] = [];
    let currentPage = 1;
    const firstResponse = await this.client.get<BoatSearchedResaultsCountry>("/v1/search", {
      params: { ...params, page: currentPage },
    });
    const totalResults = firstResponse.data[0].totalBoats;
    allBoats = [...allBoats, ...firstResponse.data[0].data];

    for (currentPage = 2; allBoats.length < totalResults; currentPage++) {
      const pageParams = { ...params, page: currentPage };

      const response = await this.client.get<BoatSearchedResaultsCountry>("/v1/search", { params: pageParams });
      allBoats = [...allBoats, ...response.data[0].data];
    }
    return allBoats;
  }

  public async getAvailabilitySingleBoat<T>(slug: string): Promise<T> {
    const response = await this.client.get<T>(`/v1/availability/${slug}`);
    return response;
  }
}
