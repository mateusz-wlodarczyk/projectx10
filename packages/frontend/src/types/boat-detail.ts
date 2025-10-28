// Boat Detail View Types
// Based on SingleBoatDetails from backend and availability data structure

export interface BoatDetailViewProps {
  slug: string;
}

export interface BoatDetailData {
  boatDetails: SingleBoatDetails | null;
  availabilityData: WeekData | null;
  loading: boolean;
  error: string | null;
}

// Core boat data from boats_list table
export interface SingleBoatDetails {
  _id: string;
  slug: string;
  parameters: SingleBoatParameters;
  vat_excluded: boolean;
  old_id: number;
  views: number;
  title: string;
  manufacturer: string;
  model: string;
  category: string;
  category_slug: string;
  illustrated: boolean;
  marina: string;
  coordinates: [number, number];
  country: string;
  region: string;
  city: string;
  flag: string;
  captain: string;
  sail: string;
  engineType: string;
  usp: USP[];
  cancellationInsurance: EmptyObjectCancellationInsurance | null;
  noLicense: NoLicenseType | null;
  totalReviews: number;
  lastCustomer: string;
  rank: number;
  newboat: boolean;
  reviewsScore: number;
  cancellations: string | null;
  thumb: string;
  main_img: string;
  boataroundExtra: boolean;
  charterLoyalty: boolean;
  additional_specials: any[];
  featuredUsp: USP;
  restrictions_covered: EmptyObjectRestrictions_covered | null;
  freeBerths: EmptyObjectFreeBerths;
  charter: string;
  charter_logo: string | null;
  charter_id: string;
  charter_rank: CharterRank;
  prepayment: number;
  guarantee_date: string | null;
  priceFrom: number;
  discount: number | null;
  loyaltyDiscount: number;
  currency: string;
  isSmartDeal: boolean;
  preferred_program: boolean;
}

// Boat parameters from SingleBoatParameters
export interface SingleBoatParameters {
  max_sleeps: number;
  max_people: number;
  allowed_people: number;
  single_cabins: number;
  double_cabins: number;
  triple_cabins: number;
  quadruple_cabins: number;
  cabins: number;
  cabins_with_bunk_bed: number;
  saloon_sleeps: number;
  crew_sleeps: number;
  toilets: number;
  electric_toilets: number;
  length: number;
  beam: number;
  draft: number;
  year: number;
  renovated_year: number;
  sail_renovated_year: number;
  engine_power: number;
  number_engines: number;
  total_engine_power: number;
  engine: string;
  fuel: number;
  cruising_consumption: number;
  maximum_speed: number;
  water_tank: number;
  waste_tank: number;
  single_cabins_outdoor_entrance: boolean;
  single_cabins_indoor_entrance: boolean;
}

// Supporting types
export interface USP {
  name: string;
  icon: string;
  provider: string;
}

export interface CharterRank {
  place: number;
  country: string;
  score: number;
  out_of: number;
  count: number;
}

export interface NoLicenseType {
  _id: string;
  slug: string;
  name: string;
}

export type EmptyObjectCancellationInsurance = Record<string, any>;
export type EmptyObjectRestrictions_covered = Record<string, any>;
export type EmptyObjectFreeBerths = Record<string, any>;

// Availability data from boats_availability_2025 table
export interface WeekData {
  id: number;
  slug: string;
  week_1: BoatPrice | null;
  week_2: BoatPrice | null;
  week_3: BoatPrice | null;
  week_4: BoatPrice | null;
  week_5: BoatPrice | null;
  week_6: BoatPrice | null;
  week_7: BoatPrice | null;
  week_8: BoatPrice | null;
  week_9: BoatPrice | null;
  week_10: BoatPrice | null;
  week_11: BoatPrice | null;
  week_12: BoatPrice | null;
  week_13: BoatPrice | null;
  week_14: BoatPrice | null;
  week_15: BoatPrice | null;
  week_16: BoatPrice | null;
  week_17: BoatPrice | null;
  week_18: BoatPrice | null;
  week_19: BoatPrice | null;
  week_20: BoatPrice | null;
  week_21: BoatPrice | null;
  week_22: BoatPrice | null;
  week_23: BoatPrice | null;
  week_24: BoatPrice | null;
  week_25: BoatPrice | null;
  week_26: BoatPrice | null;
  week_27: BoatPrice | null;
  week_28: BoatPrice | null;
  week_29: BoatPrice | null;
  week_30: BoatPrice | null;
  week_31: BoatPrice | null;
  week_32: BoatPrice | null;
  week_33: BoatPrice | null;
  week_34: BoatPrice | null;
  week_35: BoatPrice | null;
  week_36: BoatPrice | null;
  week_37: BoatPrice | null;
  week_38: BoatPrice | null;
  week_39: BoatPrice | null;
  week_40: BoatPrice | null;
  week_41: BoatPrice | null;
  week_42: BoatPrice | null;
  week_43: BoatPrice | null;
  week_44: BoatPrice | null;
  week_45: BoatPrice | null;
  week_46: BoatPrice | null;
  week_47: BoatPrice | null;
  week_48: BoatPrice | null;
  week_49: BoatPrice | null;
  week_50: BoatPrice | null;
  week_51: BoatPrice | null;
  week_52: BoatPrice | null;
  week_53: BoatPrice | null;
}

export interface BoatPrice {
  [timestamp: string]: {
    price: number;
    discount: number;
    createdAt: string;
  };
}

// Chart data types
export interface ChartDataPoint {
  week: number;
  date: string;
  price: number;
  discount: number;
  timestamp: string;
  dayOfWeek: string;
  month: string;
  year: number;
}

export interface PriceChartData {
  weeks: ChartDataPoint[];
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  totalDataPoints: number;
  priceRange: {
    min: number;
    max: number;
  };
  trends: {
    isIncreasing: boolean;
    isDecreasing: boolean;
    isStable: boolean;
    changePercentage: number;
  };
}

export interface DiscountChartData {
  dataPoints: ChartDataPoint[];
  avgDiscount: number;
  maxDiscount: number;
  minDiscount: number;
  totalDataPoints: number;
  discountRange: {
    min: number;
    max: number;
  };
  trends: {
    isIncreasing: boolean;
    isDecreasing: boolean;
    isStable: boolean;
    changePercentage: number;
  };
}

export interface AvailabilityTimelineData {
  timeline: ChartDataPoint[];
  availabilityPeriods: AvailabilityPeriod[];
  totalWeeks: number;
  weeksWithData: number;
  dataCoverage: number; // percentage
}

export interface AvailabilityPeriod {
  startWeek: number;
  endWeek: number;
  avgPrice: number;
  avgDiscount: number;
  dataPoints: number;
  dateRange: {
    start: string;
    end: string;
  };
  priceVariation: {
    min: number;
    max: number;
    stdDev: number;
  };
}

// Component interface types
export interface BoatDetailHeaderProps {
  boat: SingleBoatDetails;
  onBack: () => void;
  loading: boolean;
}

export interface BoatBasicInfoProps {
  boat: SingleBoatDetails;
  loading: boolean;
}

export interface BoatParametersProps {
  parameters: SingleBoatParameters;
  loading: boolean;
}

export interface BoatSpecificationsProps {
  boat: SingleBoatDetails;
  parameters: SingleBoatParameters;
  loading: boolean;
}

export interface BoatFeaturesProps {
  boat: SingleBoatDetails;
  loading: boolean;
}

export interface WeeklyPriceChartProps {
  priceData: PriceChartData;
  selectedWeek: number;
  onWeekChange: (week: number) => void;
  loading: boolean;
  error: string | null;
}

export interface DiscountChartProps {
  discountData: DiscountChartData;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  loading: boolean;
  error: string | null;
}

export interface AvailabilityTimelineProps {
  timelineData: AvailabilityTimelineData;
  onDataPointSelect: (point: ChartDataPoint) => void;
  loading: boolean;
  error: string | null;
}

// API request/response types
export interface BoatSearchRequest {
  slug: string;
}

export interface BoatSearchResponse {
  success: boolean;
  data: SingleBoatDetails;
  message?: string;
  error?: string;
}

export interface BoatAvailabilityRequest {
  slug: string;
  year?: number;
}

export interface BoatAvailabilityResponse {
  success: boolean;
  data: WeekData;
  message?: string;
  error?: string;
}

export interface BoatWeekRequest {
  slug: string;
  week: number;
  year?: number;
}

export interface BoatWeekResponse {
  success: boolean;
  data: BoatPrice;
  message?: string;
  error?: string;
}

// Filtered data types for display (only showing fields with values)
export interface FilteredBoatDetails {
  basicInfo: {
    title?: string;
    manufacturer?: string;
    model?: string;
    category?: string;
    marina?: string;
    country?: string;
    region?: string;
    city?: string;
    priceFrom?: number;
    currency?: string;
    reviewsScore?: number;
    totalReviews?: number;
    thumb?: string;
    main_img?: string;
  };
  parameters: {
    capacity?: {
      max_sleeps?: number;
      max_people?: number;
      allowed_people?: number;
    };
    cabins?: {
      single_cabins?: number;
      double_cabins?: number;
      triple_cabins?: number;
      quadruple_cabins?: number;
      cabins?: number;
      cabins_with_bunk_bed?: number;
      saloon_sleeps?: number;
      crew_sleeps?: number;
    };
    facilities?: {
      toilets?: number;
      electric_toilets?: number;
    };
    dimensions?: {
      length?: number;
      beam?: number;
      draft?: number;
    };
    year?: {
      year?: number;
      renovated_year?: number;
      sail_renovated_year?: number;
    };
    engine?: {
      engine_power?: number;
      number_engines?: number;
      total_engine_power?: number;
      engine?: string;
      fuel?: number;
      cruising_consumption?: number;
      maximum_speed?: number;
    };
    tanks?: {
      water_tank?: number;
      waste_tank?: number;
    };
    cabinAccess?: {
      single_cabins_outdoor_entrance?: boolean;
      single_cabins_indoor_entrance?: boolean;
    };
  };
  features: {
    usp?: USP[];
    featuredUsp?: USP;
    additional_specials?: any[];
    charter?: string;
    charter_logo?: string;
    charter_id?: string;
    charter_rank?: CharterRank;
    captain?: string;
    sail?: string;
    engineType?: string;
    flag?: string;
    boataroundExtra?: boolean;
    charterLoyalty?: boolean;
    isSmartDeal?: boolean;
    preferred_program?: boolean;
  };
  pricing: {
    priceFrom?: number;
    discount?: number;
    loyaltyDiscount?: number;
    currency?: string;
    vat_excluded?: boolean;
    prepayment?: number;
    guarantee_date?: string;
  };
  reviews: {
    reviewsScore?: number;
    totalReviews?: number;
    lastCustomer?: string;
    rank?: number;
  };
  metadata: {
    _id?: string;
    slug?: string;
    old_id?: number;
    views?: number;
    illustrated?: boolean;
    newboat?: boolean;
    cancellations?: string;
  };
}

// Chart configuration types
export interface ChartConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
  dimensions: {
    height: number;
    width: number;
    margin: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  animations: {
    duration: number;
    easing: string;
  };
}

export interface TimeRange {
  label: string;
  value: string;
  weeks: number[];
  startWeek: number;
  endWeek: number;
}
