import { HttpClient } from "../api/index";
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
    try {
      console.log("[BoatAroundService] Starting getBoats with params:", params);
      let allBoats: SingleBoatDetails[] = [];
      let currentPage = 1;

      const firstResponse = await this.client.get<BoatSearchedResultsCountry>(API_BOAT.search, {
        params: { ...params, page: currentPage },
      });

      if (!firstResponse.data || firstResponse.data.length === 0) {
        console.warn("[BoatAroundService] No data received from first response");
        return [];
      }

      const totalResults = firstResponse.data[0].totalBoats;
      allBoats = [...allBoats, ...firstResponse.data[0].data];

      console.log(`[BoatAroundService] First page loaded: ${allBoats.length}/${totalResults} boats`);

      for (currentPage = 2; allBoats.length < totalResults; currentPage++) {
        try {
          const pageParams = { ...params, page: currentPage };
          const response = await this.client.get<BoatSearchedResultsCountry>(API_BOAT.search, { params: pageParams });

          if (response.data && response.data.length > 0) {
            allBoats = [...allBoats, ...response.data[0].data];
            console.log(`[BoatAroundService] Page ${currentPage} loaded: ${allBoats.length}/${totalResults} boats`);
          } else {
            console.warn(`[BoatAroundService] No data received for page ${currentPage}`);
            break;
          }
        } catch (error) {
          console.error(`[BoatAroundService] Error loading page ${currentPage}:`, error);
          // Continue with available data instead of failing completely
          break;
        }
      }

      console.log(`[BoatAroundService] Successfully loaded ${allBoats.length} boats total`);
      return allBoats;
    } catch (error) {
      console.error("[BoatAroundService] Error in getBoats:", error);
      // Return empty array instead of throwing to allow graceful degradation
      return [];
    }
  }

  public async getAvailabilitySingleBoat(slug: string): Promise<SingleBoatDataAvailabilitySimple | null> {
    try {
      console.log(`[BoatAroundService] Getting availability for boat: ${slug}`);
      const response = await this.client.get<SingleBoatAvailability>(`${API_BOAT.avaibility}/${slug}`);

      if (response.status === RESPONSE_STATUS.success && response.data && response.data.length > 0) {
        const objResponse = {
          availabilities: response.data[0].availabilities,
          slug: response.data[0].slug,
        };
        console.log(`[BoatAroundService] Successfully retrieved availability for ${slug}`);
        return objResponse;
      } else {
        console.warn(`[BoatAroundService] No availability data for ${slug}, status: ${response.status}`);
        return null;
      }
    } catch (error) {
      console.error(`[BoatAroundService] Error getting availability for ${slug}:`, error);
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
    try {
      console.log(`[BoatAroundService] Getting price for ${slug} from ${timePeriod.chin} to ${timePeriod.chout}`);
      const params = { slug, checkIn: timePeriod.chin, checkOut: timePeriod.chout };
      const response = await this.client.get<PriceForBoatPerWeek>(`${API_BOAT.price}/${slug}`, { params });

      if (
        response.status === RESPONSE_STATUS.success &&
        response.data &&
        response.data.length > 0 &&
        response.data[0].data &&
        response.data[0].data.length > 0
      ) {
        const priceData = response.data[0].data[0];
        console.log(`[BoatAroundService] Successfully retrieved price for ${slug}: ${priceData.price} (${priceData.discount}% discount)`);
        return { price: priceData.price, discount: priceData.discount };
      } else {
        console.warn(`[BoatAroundService] No price data for ${slug}, status: ${response.status}`);
        return null;
      }
    } catch (error) {
      console.error(`[BoatAroundService] Error getting price for ${slug}:`, error);
      return null;
    }
  }
}
