import { HttpClient } from "../api";
import { BoatSearchedResaultsCountry } from "../types/searchedBoat";
import { SingleBoatDetails } from "../types/searchedBoatSingleTypes";

export class BoatAroundService {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient("https://api.boataround.com");
  }

  public async getBoats<T, K>(params?: Record<string, any>): Promise<SingleBoatDetails[]> {
    // let allBoats: T[] = [];
    let allBoats: SingleBoatDetails[] = [];
    let currentPage = 1;
    let totalResults: number;

    // const firstResponse = await this.client.get<K>("/v1/search", {
    //   params: { ...params, page: currentPage },
    // });

    const firstResponse = await this.client.get<BoatSearchedResaultsCountry>("/v1/search", {
      params: { ...params, page: currentPage },
    });

    allBoats = [...allBoats, ...firstResponse.data[0].data];
    totalResults = firstResponse.data[0].totalBoats;

    while (allBoats.length < totalResults) {
      currentPage++;
      const pageParams = { ...params, page: currentPage };

      // const response = await this.client.get<K>("/v1/search", { params: pageParams });
      const response = await this.client.get<BoatSearchedResaultsCountry>("/v1/search", { params: pageParams });
      allBoats = [...allBoats, ...response.data[0].data];
    }
    return allBoats;
  }
  public async getBoatsTest<T>(params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>("/v1/search", {
      params,
    });
    return response;
  }
}
