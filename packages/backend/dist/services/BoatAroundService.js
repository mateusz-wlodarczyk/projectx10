"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoatAroundService = void 0;
const index_1 = require("../api/index");
const constans_1 = require("../config/constans");
class BoatAroundService {
    client;
    constructor() {
        this.client = new index_1.HttpClient(constans_1.API_BOAT.URL);
    }
    async getBoats(params) {
        let allBoats = [];
        let currentPage = 1;
        const firstResponse = await this.client.get(constans_1.API_BOAT.search, {
            params: { ...params, page: currentPage },
        });
        const totalResults = firstResponse.data[0].totalBoats;
        allBoats = [...allBoats, ...firstResponse.data[0].data];
        for (currentPage = 2; allBoats.length < totalResults; currentPage++) {
            const pageParams = { ...params, page: currentPage };
            const response = await this.client.get(constans_1.API_BOAT.search, { params: pageParams });
            allBoats = [...allBoats, ...response.data[0].data];
        }
        return allBoats;
    }
    async getAvailabilitySingleBoat(slug) {
        const response = await this.client.get(`${constans_1.API_BOAT.avaibility}/${slug}`);
        if (response.status === constans_1.RESPONSE_STATUS.success) {
            const objResponse = {
                availabilities: response.data[0].availabilities,
                slug: response.data[0].slug,
            };
            return objResponse;
        }
        else {
            return null;
        }
    }
    async getPriceForSingleAvailability(slug, timePeriod) {
        const params = { slug, checkIn: timePeriod.chin, checkOut: timePeriod.chout };
        const response = await this.client.get(`${constans_1.API_BOAT.price}/${slug}`, { params });
        if (response.status === constans_1.RESPONSE_STATUS.success) {
            return { price: response.data[0].data[0].price, discount: response.data[0].data[0].discount };
        }
        else {
            return null;
        }
    }
}
exports.BoatAroundService = BoatAroundService;
