import { addDays, endOfYear, format, getDay, getISOWeek } from "date-fns";
import { boatServiceCatamaran, supabaseService } from "..";
import { DownloadedBoats, FreeWeeks, WeekData } from "../types/savedBoatsResults";
import { handleError } from "./handleErrors";
import { API_REQUEST_PRICE_DELAY_MS } from "../config/constans";
import { SingleAvailability } from "../types/availabilityBoat";
import { FilteredAvailabilityWithPrices, SaveAvailabilityData } from "../types/priceBoat";
import { sleep } from "./sleep";

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
