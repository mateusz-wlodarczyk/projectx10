export type BoatResultsToBeSaved = {
  filteredResults: FilteredResultsBoatResultsToBeSaved;
  slug: string;
};
export type DowloadedBoats = {
  slug: string;
};
export type BoatPrice = {
  [todayData: string]: {
    price: number;
    discount: number;
    createdAt: string;
  };
};
export type FilteredResultsBoatResultsToBeSaved = {
  result: ({
    price: number;
    discount: number;
    chin: string;
    chout: string;
  } | null)[];
  timestamp: string;
  data: string;
  week: number;
};

export type BoatResultsToBeInserted = {
  slug: string;
} & {
  [key: `week_${number}`]: FilteredResultsBoatResultsToBeSaved;
};
export type FreeWeeks = {
  chin: string;
  chout: string;
};
export type WeekKey =
  `week_${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53}`;

export type WeekData = {
  id: number;
  slug: string;
} & {
  [key in WeekKey]: BoatPrice | null;
};
