import {
  CharterRank,
  EmptyObjectCancellationInsurance,
  EmptyObjectFreeBerths,
  EmptyObjectRestrictions_covered,
  USP,
} from "./searchedBoatSingleTypes";
export type PriceForBoatPerWeek = {
  data: {
    _id: string | null;
    totalResults: number;
    data: PriceForBoatPerWeekData[];
  }[];
  statusCode: number;
  status: string;
};
export type FilteredAvailabilityWithPrices = { price: number; discount: number; chin: string; chout: string } | null;

export type SaveAvailabilityData = { [key: string]: { price: number; discount: number; createdAt: string } };

export type PriceForBoatPerWeekData = {
  _id: string;
  slug: string;
  title: string;
  thumb: string;
  main_img: string;
  boataroundExtra: boolean;
  marina: string;
  country: string;
  region: string;
  city: string;
  flag: string;
  license: string[];
  charter: string;
  charter_id: string;
  coordinates: [number, number];
  views: number;
  usp: USP[];
  reviewsScore: number;
  currency: string;
  price: number;
  totalPrice: number;
  discount: number;
  period: number;
  deal_of_the_day: string;
  restrictions_covered: EmptyObjectRestrictions_covered;
  cancellationInsurance: EmptyObjectCancellationInsurance;
  freeBerths: EmptyObjectFreeBerths;
  charter_rank: CharterRank;
  isSmartDeal: boolean;
};

export type PriceForBoatPerWeekDataResponse = {
  price: number;
};
