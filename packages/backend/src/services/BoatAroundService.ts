import { HttpClient } from "../api";
import { API_BOAT, RESPONSE_STATUS } from "../config/constans";
import { SingleBoatAvailability, SingleBoatDataAvailabilitySimple } from "../types/availabilityBoat";
import { PriceForBoatPerWeek } from "../types/priceBoat";
import { BoatSearchedResultsCountry } from "../types/searchedBoat";
import { SingleBoatDetails } from "../types/searchedBoatSingleTypes";

export class BoatAroundService {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient(API_BOAT.URL);
  }

  public async getBoats(params?: Record<string, any>): Promise<SingleBoatDetails[]> {
    let allBoats: SingleBoatDetails[] = [];
    let currentPage = 1;
    const firstResponse = await this.client.get<BoatSearchedResultsCountry>(API_BOAT.search, {
      params: { ...params, page: currentPage },
    });
    const totalResults = firstResponse.data[0].totalBoats;
    allBoats = [...allBoats, ...firstResponse.data[0].data];

    for (currentPage = 2; allBoats.length < totalResults; currentPage++) {
      const pageParams = { ...params, page: currentPage };

      const response = await this.client.get<BoatSearchedResultsCountry>(API_BOAT.search, { params: pageParams });
      allBoats = [...allBoats, ...response.data[0].data];
    }
    return allBoats;
  }
  public async getAvailabilitySingleBoat(slug: string): Promise<SingleBoatDataAvailabilitySimple | null> {
    const response = await this.client.get<SingleBoatAvailability>(`${API_BOAT.avaibility}/${slug}`);

    if (response.status === RESPONSE_STATUS.success) {
      const objResponse = {
        availabilities: response.data[0].availabilities,
        slug: response.data[0].slug,
      };
      return objResponse;
    } else {
      return null;
    }
  }
  public async getPriceForSingleAvailability(
    slug: string,
    timePeriod: {
      chin: string;
      chout: string;
    },
  ): Promise<{ price: number; discount: number } | null> {
    const params = { slug, checkIn: timePeriod.chin, checkOut: timePeriod.chout };
    const response = await this.client.get<PriceForBoatPerWeek>(`${API_BOAT.price}/${slug}`, { params });
    if (response.status === RESPONSE_STATUS.success) {
      return { price: response.data[0].data[0].price, discount: response.data[0].data[0].discount };
    } else {
      return null;
    }
  }
}
