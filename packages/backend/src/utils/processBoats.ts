import { DownloadedBoats, FreeWeeks, WeekData } from "../types/savedBoatsResults";

import { API_REQUEST_PRICE_DELAY_MS } from "../config/constans";
import { SingleAvailability } from "../types/availabilityBoat";
import { FilteredAvailabilityWithPrices, SaveAvailabilityData } from "../types/priceBoat";
import { sleep } from "./sleep";
import { boatServiceCatamaran, loggerBoatService, loggerSupabaseService, supabaseService } from "../index";
import { addDays, endOfYear, format, getDay, getISOWeek } from "date-fns";
import { isWeekDataArray } from "./selectDataArrayChecking";

export async function processBoats(downloadedBoats: DownloadedBoats[], endYear: number) {
  loggerBoatService.info(`Starting processBoats for ${downloadedBoats.length} boats, endYear: ${endYear}`);
  const today = new Date();
  const todayData = new Date().toISOString();
  const todayYear = today.getFullYear();

  for (const singleBoatSlug of downloadedBoats) {
    loggerBoatService.info(`Processing boat: ${singleBoatSlug.slug}`);
    try {
      const bookedForSingleSlug = await boatServiceCatamaran.getAvailabilitySingleBoat(singleBoatSlug.slug);
      loggerBoatService.info(`Fetched availability for ${singleBoatSlug.slug}:`, bookedForSingleSlug);

      if (bookedForSingleSlug !== null) {
        for (let year = todayYear; year <= endYear; year++) {
          loggerBoatService.info(`Processing year: ${year} for boat: ${singleBoatSlug.slug}`);
          const freeWeeks: FreeWeeks[] = getFreeWeeksInYear(bookedForSingleSlug.availabilities, year);
          loggerBoatService.info(`Free weeks for ${singleBoatSlug.slug} in ${year}:`, freeWeeks);

          const availabilityWithPrices = await getAvailabilityWithPrices(singleBoatSlug.slug, freeWeeks);
          loggerBoatService.info(`Availability with prices for ${singleBoatSlug.slug}:`, availabilityWithPrices);

          const filteredAvailabilityWithPrices = availabilityWithPrices.filter(Boolean);
          loggerBoatService.info(`Filtered availability with prices for ${singleBoatSlug.slug}:`, filteredAvailabilityWithPrices);

          const { data: weekData, error } = await supabaseService.selectData(`boat_availability_${year}`, "*", [
            { column: "slug", value: singleBoatSlug.slug },
          ]);

          loggerBoatService.info(`Week data from database for ${singleBoatSlug.slug} in ${year}:`, weekData);

          if (weekData !== null && isWeekDataArray(weekData)) {
            loggerBoatService.info(`Processing availability data for ${singleBoatSlug.slug} in ${year}`);
            await processAvailabilityData(filteredAvailabilityWithPrices, weekData, singleBoatSlug.slug, todayData, year);
          } else {
            loggerBoatService.warn(`No week data found for ${singleBoatSlug.slug} in ${year}`);
          }
        }
      } else {
        loggerBoatService.warn(`No availability data found for ${singleBoatSlug.slug}`);
      }
    } catch (error) {
      loggerBoatService.error(`Error processing boat ${singleBoatSlug.slug}:`, error);
    }

    loggerBoatService.info(`Finished processing boat: ${singleBoatSlug.slug}`);
    await sleep(API_REQUEST_PRICE_DELAY_MS);
  }

  loggerBoatService.info("Finished processing all boats.");
}

export async function processAvailabilityData(
  filteredAvailabilityWithPrices: FilteredAvailabilityWithPrices[],
  weekData: WeekData[],
  slug: string,
  todayData: string,
  year: number,
) {
  loggerBoatService.info(`Starting processAvailabilityData for slug: ${slug}, year: ${year}`);
  for (const el of filteredAvailabilityWithPrices) {
    if (el !== null) {
      try {
        const week = getISOWeek(new Date(`${el?.chout}`).toISOString());
        const chinYear = new Date(el?.chin).getFullYear();
        const choutYear = new Date(el?.chout).getFullYear();

        loggerBoatService.info(`Processing week: ${week}, chinYear: ${chinYear}, choutYear: ${choutYear}`);

        if ((chinYear < year && choutYear === year) || (chinYear === year && choutYear === year) || (chinYear === year && choutYear > year)) {
          const weekKey = `week_${week}` as keyof WeekData;

          const objToSaved = {
            [todayData]: {
              price: el.price,
              discount: el.discount,
              createdAt: new Date().toISOString(),
            },
          };
          loggerBoatService.info(`Saving data for weekKey: ${weekKey}, objToSaved:`, objToSaved);
          await saveAvailabilityData(weekData, slug, weekKey, objToSaved, todayData, chinYear);
        }
      } catch (error) {
        loggerBoatService.error(`Error processing availability data for slug: ${slug}, week: ${weekData}`, error);
      }
    }
  }
  loggerBoatService.info(`Finished processAvailabilityData for slug: ${slug}, year: ${year}`);
}

export async function getAvailabilityWithPrices(singleBoatSlug: string, freeWeeks: FreeWeeks[]) {
  loggerBoatService.info(`Starting getAvailabilityWithPrices for slug: ${singleBoatSlug}`);
  const results = await Promise.all(
    freeWeeks.map(async (singleAvailability) => {
      try {
        const result = await boatServiceCatamaran.getPriceForSingleAvailability(singleBoatSlug, singleAvailability);
        loggerBoatService.info(`Fetched price for availability:`, singleAvailability, result);
        if (result !== null) {
          return {
            price: result.price,
            discount: result.discount,
            chin: singleAvailability.chin,
            chout: singleAvailability.chout,
          };
        }
      } catch (error) {
        loggerBoatService.error(`Error fetching price for availability:`, singleAvailability, error);
      }
      return null;
    }),
  );
  loggerBoatService.info(`Finished getAvailabilityWithPrices for slug: ${singleBoatSlug}, results:`, results);
  return results;
}

export async function saveAvailabilityData(
  weekData: WeekData[] | null,
  singleBoatSlug: string,
  weekKey: keyof WeekData,
  objToSaved: SaveAvailabilityData,
  todayData: string,
  year: number,
) {
  loggerBoatService.info(`Starting saveAvailabilityData for slug: ${singleBoatSlug}, weekKey: ${weekKey}`);
  try {
    if (weekData === null || weekData === undefined || weekData[0] === undefined || weekData[0][weekKey] === undefined) {
      loggerBoatService.info(`Inserting new week data for slug: ${singleBoatSlug}, weekKey: ${weekKey}`);
      await supabaseService.insertWeekDataIfNotExist(`boat_availability_${year}`, objToSaved, singleBoatSlug, weekKey);
    } else if (weekData[0][weekKey] === null) {
      loggerBoatService.info(`Updating week data for slug: ${singleBoatSlug}, weekKey: ${weekKey}`);
      await supabaseService.updateWeekData(`boat_availability_${year}`, weekKey, objToSaved, "slug", singleBoatSlug);
    } else {
      const existingData = weekData[0][weekKey];
      if (existingData && typeof existingData !== "string" && typeof existingData !== "number") {
        if (existingData[todayData] !== objToSaved[todayData]) {
          const updatedObj = { ...existingData, ...objToSaved };
          loggerBoatService.info(`Merging existing data for slug: ${singleBoatSlug}, weekKey: ${weekKey}, updatedObj:`, updatedObj);
          await supabaseService.updateWeekData(`boat_availability_${year}`, weekKey, updatedObj, "slug", singleBoatSlug);
        }
      }
    }
  } catch (error) {
    loggerBoatService.error(`Error saving availability data for slug: ${singleBoatSlug}, weekKey: ${weekKey}`, error);
  }
  loggerBoatService.info(`Finished saveAvailabilityData for slug: ${singleBoatSlug}, weekKey: ${weekKey}`);
}

export function getFreeWeeksInYear(reservations: SingleAvailability[], year: number) {
  loggerBoatService.info(`Starting getFreeWeeksInYear for year: ${year}`);
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
  const freeWeeks = allWeekends.filter(
    (weekend) => !reservations.some((reservation) => reservation.chin <= weekend.chout && reservation.chout >= weekend.chin),
  );
  loggerBoatService.info(`Finished getFreeWeeksInYear for year: ${year}, freeWeeks:`, freeWeeks);
  return freeWeeks;
}

export async function sendBoatToServer(country: string, category: string) {
  loggerSupabaseService.info(`Starting sendBoatToServer for country: ${country}, category: ${category}`);
  const params = { country, category };
  const fetchedboats = await boatServiceCatamaran.getBoats(params);

  await Promise.all(
    fetchedboats.map(async (el) => {
      if (!el || !el.slug) {
        loggerSupabaseService.warn(`Skipped boat: ${JSON.stringify(el)}`);
        return;
      }

      const { error: errorUpsertData } = await supabaseService.upsertData("boats_list", el);

      if (errorUpsertData) {
        if (errorUpsertData.code === "23503" && errorUpsertData.message?.includes("violates foreign key constraint")) {
          loggerSupabaseService.warn(`Skipped deleted boat: ${el.slug}`);
          return;
        }

        loggerSupabaseService.error(`Error upserting data for boat: ${el.slug}, error:`, errorUpsertData);
      }
    }),
  );
  loggerSupabaseService.info(`Finished sendBoatToServer for country: ${country}, category: ${category}`);
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
