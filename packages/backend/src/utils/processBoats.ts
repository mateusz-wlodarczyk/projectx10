import { DownloadedBoats, FreeWeeks, WeekData } from "../types/savedBoatsResults.ts";
import { handleError } from "./handleErrors.ts";
import { API_REQUEST_PRICE_DELAY_MS } from "../config/constans.ts";
import { SingleAvailability } from "../types/availabilityBoat.ts";
import { FilteredAvailabilityWithPrices, SaveAvailabilityData } from "../types/priceBoat.ts";
import { sleep } from "./sleep.ts";
import { boatServiceCatamaran, supabaseService } from "../index.ts";
import { addDays, endOfYear, format, getDay, getISOWeek } from "date-fns";

export async function processBoats(downloadedBoats: DownloadedBoats[], endYear: number) {
  const today = new Date();
  //todo zmienic na format yyyy-mm-dd - obecnie uzywany do spr zapisu w supabase
  const todayData = new Date().toISOString();
  const todayYear = today.getFullYear();

  for (const singleBoatSlug of downloadedBoats) {
    try {
      const bookedForSingleSlug = await boatServiceCatamaran.getAvailabilitySingleBoat(singleBoatSlug.slug);
      if (bookedForSingleSlug !== null) {
        for (let year = todayYear; year <= endYear; year++) {
          const freeWeeks: FreeWeeks[] = getFreeWeeksInYear(bookedForSingleSlug.availabilities, year);
          const availabilityWithPrices = await getAvailabilityWithPrices(singleBoatSlug.slug, freeWeeks);
          const filteredAvailabilityWithPrices = availabilityWithPrices.filter(Boolean);
          const { data: weekData } = await supabaseService.selectSpecificData<WeekData>(
            `boat_availability_${year}`,
            "slug",
            `${singleBoatSlug.slug}`,
          );
          if (weekData !== null) {
            await processAvailabilityData(filteredAvailabilityWithPrices, weekData, singleBoatSlug.slug, todayData, year);
          }
        }
      }
    } catch (error) {
      handleError(error);
    }

    await sleep(API_REQUEST_PRICE_DELAY_MS);
  }
}

export async function processAvailabilityData(
  filteredAvailabilityWithPrices: FilteredAvailabilityWithPrices[],
  weekData: WeekData[],
  slug: string,
  todayData: string,
  year: number,
) {
  for (const el of filteredAvailabilityWithPrices) {
    if (el !== null) {
      try {
        const week = getISOWeek(new Date(`${el?.chout}`).toISOString());
        const chinYear = new Date(el?.chin).getFullYear();
        const choutYear = new Date(el?.chout).getFullYear();

        if ((chinYear < year && choutYear === year) || (chinYear === year && choutYear === year) || (chinYear === year && choutYear > year)) {
          const weekKey = `week_${week}` as keyof WeekData;

          const objToSaved = {
            [todayData]: {
              price: el.price,
              discount: el.discount,
              createdAt: new Date().toISOString(),
            },
          };
          await saveAvailabilityData(weekData, slug, weekKey, objToSaved, todayData, chinYear);
        }
      } catch (error) {
        handleError(error);
      }
    }
  }
}

export async function getAvailabilityWithPrices(singleBoatSlug: string, freeWeeks: FreeWeeks[]) {
  return await Promise.all(
    freeWeeks.map(async (singleAvailability) => {
      try {
        const result = await boatServiceCatamaran.getPriceForSingleAvailability(singleBoatSlug, singleAvailability);
        if (result !== null) {
          return {
            price: result.price,
            discount: result.discount,
            chin: singleAvailability.chin,
            chout: singleAvailability.chout,
          };
        }
      } catch (error) {
        handleError(error);
      }
      return null;
    }),
  );
}
export async function saveAvailabilityData(
  weekData: WeekData[] | null,
  singleBoatSlug: string,
  weekKey: keyof WeekData,
  objToSaved: SaveAvailabilityData,
  todayData: string,
  year: number,
) {
  try {
    if (weekData === null || weekData === undefined || weekData[0] === undefined || weekData[0][weekKey] === undefined) {
      await supabaseService.insertWeekDataIfNotExist(`boat_availability_${year}`, objToSaved, singleBoatSlug, weekKey);
    } else if (weekData[0][weekKey] === null) {
      await supabaseService.updateWeekData(`boat_availability_${year}`, weekKey, objToSaved, "slug", singleBoatSlug);
    } else {
      const existingData = weekData[0][weekKey];
      if (existingData && typeof existingData !== "string" && typeof existingData !== "number") {
        if (existingData[todayData] !== objToSaved[todayData]) {
          const updatedObj = { ...existingData, ...objToSaved };
          await supabaseService.updateWeekData(`boat_availability_${year}`, weekKey, updatedObj, "slug", singleBoatSlug);
        }
      }
    }
  } catch (error) {
    handleError(error);
  }
}

export function getFreeWeeksInYear(reservations: SingleAvailability[], year: number) {
  let today = new Date().getFullYear() === year ? new Date() : new Date(year, 0, 1);
  const yearEnd = endOfYear(today);

  if (today.getFullYear() !== year) {
    today = new Date(year, 0, 1);
  }
  const dayOfWeek = getDay(today);
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
  let currentSaturday = addDays(today, daysUntilSaturday);

  const allWeekends = Array.from({ length: getISOWeek(yearEnd) }, (_, i) => {
    const currentSaturday = addDays(today, (6 - getDay(today) + i * 7) % 7);
    return {
      chin: format(currentSaturday, "yyyy-MM-dd"),
      chout: format(addDays(currentSaturday, 7), "yyyy-MM-dd"),
    };
  });
  return allWeekends.filter((weekend) => !reservations.some((reservation) => reservation.chin <= weekend.chout && reservation.chout >= weekend.chin));
}

export async function sendBoatToServer(country: string, category: string) {
  const params = { country, category };
  const fetchedboats = await boatServiceCatamaran.getBoats(params);

  await Promise.all(
    fetchedboats.map(async (el) => {
      if (!el || !el.slug) {
        console.log(`Skipped boat: ${JSON.stringify(el)}`);
        return;
      }

      const { error: errorUpsertData } = await supabaseService.upsertData("boats_list", el);

      if (errorUpsertData) {
        if (errorUpsertData.code === "23503" && errorUpsertData.message?.includes("violates foreign key constraint")) {
          console.log(`Skipped deleted boat: ${el.slug}`);
          return;
        }

        console.log(`errorUpsertData: ${errorUpsertData}, ${JSON.stringify(errorUpsertData, null, 2)}`);
      }
    }),
  );
}

const data222 = {
  "2025-04-09T19:18:01.552Z": { price: 5200, discount: 33 },
  "2025-04-10T05:01:10.103Z": { price: 5199.9997, discount: 33 },
  "2025-04-10T05:06:08.264Z": { price: 5199.9997, discount: 33 },
  "2025-04-10T05:39:35.791Z": { price: 5199.9997, discount: 33 },
  "2025-04-10T07:14:22.323Z": { price: 5200, discount: 33 },
  "2025-04-10T08:51:49.007Z": { price: 5200, discount: 33 },
  "2025-04-10T19:42:41.823Z": { price: 5200, discount: 33, createdAt: "2025-04-10T19:43:00.700Z" },
  "2025-05-02T07:47:27.823Z": { price: 5200, discount: 34, createdAt: "2025-05-02T07:47:46.714Z" },
  "2025-05-02T12:21:56.888Z": { price: 5200, discount: 34, createdAt: "2025-05-02T12:22:16.141Z" },
  "2025-05-02T18:10:21.845Z": { price: 5200, discount: 34, createdAt: "2025-05-02T18:10:48.910Z" },
  "2025-05-13T07:16:32.667Z": { price: 5200, discount: 34, createdAt: "2025-05-13T07:17:07.960Z" },
  "2025-06-29T00:00:01.702Z": { price: 5200, discount: 36, createdAt: "2025-06-29T00:00:38.941Z" },
  "2025-06-30T00:00:02.681Z": { price: 5200, discount: 36, createdAt: "2025-06-30T00:00:46.104Z" },
  "2025-06-30T19:57:25.613Z": { price: 5200, discount: 36, createdAt: "2025-06-30T19:57:59.209Z" },
  "2025-07-01T00:00:02.591Z": { price: 5200, discount: 36, createdAt: "2025-07-01T00:00:36.626Z" },
  "2025-07-01T05:22:03.817Z": { price: 5200, discount: 36, createdAt: "2025-07-01T05:22:36.822Z" },
};
