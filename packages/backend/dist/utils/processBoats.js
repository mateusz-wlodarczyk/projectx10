"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processBoats = processBoats;
exports.processAvailabilityData = processAvailabilityData;
exports.getAvailabilityWithPrices = getAvailabilityWithPrices;
exports.saveAvailabilityData = saveAvailabilityData;
exports.getFreeWeeksInYear = getFreeWeeksInYear;
exports.sendBoatToServer = sendBoatToServer;
const constans_1 = require("../config/constans");
const sleep_1 = require("./sleep");
const index_1 = require("../index");
const date_fns_1 = require("date-fns");
const selectDataArrayChecking_1 = require("./selectDataArrayChecking");
async function processBoats(downloadedBoats, endYear) {
    index_1.loggerBoatService.info(`Starting processBoats for ${downloadedBoats.length} boats, endYear: ${endYear}`);
    const today = new Date();
    const todayData = new Date().toISOString();
    const todayYear = today.getFullYear();
    for (const singleBoatSlug of downloadedBoats) {
        index_1.loggerBoatService.info(`Processing boat: ${singleBoatSlug.slug}`);
        try {
            const bookedForSingleSlug = await index_1.boatServiceCatamaran.getAvailabilitySingleBoat(singleBoatSlug.slug);
            index_1.loggerBoatService.info(`Fetched availability for ${singleBoatSlug.slug}:`, bookedForSingleSlug);
            if (bookedForSingleSlug !== null) {
                for (let year = todayYear; year <= endYear; year++) {
                    index_1.loggerBoatService.info(`Processing year: ${year} for boat: ${singleBoatSlug.slug}`);
                    const freeWeeks = getFreeWeeksInYear(bookedForSingleSlug.availabilities, year);
                    index_1.loggerBoatService.info(`Free weeks for ${singleBoatSlug.slug} in ${year}:`, freeWeeks);
                    const availabilityWithPrices = await getAvailabilityWithPrices(singleBoatSlug.slug, freeWeeks);
                    index_1.loggerBoatService.info(`Availability with prices for ${singleBoatSlug.slug}:`, availabilityWithPrices);
                    const filteredAvailabilityWithPrices = availabilityWithPrices.filter(Boolean);
                    index_1.loggerBoatService.info(`Filtered availability with prices for ${singleBoatSlug.slug}:`, filteredAvailabilityWithPrices);
                    const { data: weekData, error } = await index_1.supabaseService.selectData(`boat_availability_${year}`, "*", [
                        { column: "slug", value: singleBoatSlug.slug },
                    ]);
                    index_1.loggerBoatService.info(`Week data from database for ${singleBoatSlug.slug} in ${year}:`, weekData);
                    if (weekData !== null && (0, selectDataArrayChecking_1.isWeekDataArray)(weekData)) {
                        index_1.loggerBoatService.info(`Processing availability data for ${singleBoatSlug.slug} in ${year}`);
                        await processAvailabilityData(filteredAvailabilityWithPrices, weekData, singleBoatSlug.slug, todayData, year);
                    }
                    else {
                        index_1.loggerBoatService.warn(`No week data found for ${singleBoatSlug.slug} in ${year}`);
                    }
                }
            }
            else {
                index_1.loggerBoatService.warn(`No availability data found for ${singleBoatSlug.slug}`);
            }
        }
        catch (error) {
            index_1.loggerBoatService.error(`Error processing boat ${singleBoatSlug.slug}:`, error);
        }
        index_1.loggerBoatService.info(`Finished processing boat: ${singleBoatSlug.slug}`);
        await (0, sleep_1.sleep)(constans_1.API_REQUEST_PRICE_DELAY_MS);
    }
    index_1.loggerBoatService.info("Finished processing all boats.");
}
async function processAvailabilityData(filteredAvailabilityWithPrices, weekData, slug, todayData, year) {
    index_1.loggerBoatService.info(`Starting processAvailabilityData for slug: ${slug}, year: ${year}`);
    for (const el of filteredAvailabilityWithPrices) {
        if (el !== null) {
            try {
                const week = (0, date_fns_1.getISOWeek)(new Date(`${el?.chout}`).toISOString());
                const chinYear = new Date(el?.chin).getFullYear();
                const choutYear = new Date(el?.chout).getFullYear();
                index_1.loggerBoatService.info(`Processing week: ${week}, chinYear: ${chinYear}, choutYear: ${choutYear}`);
                if ((chinYear < year && choutYear === year) || (chinYear === year && choutYear === year) || (chinYear === year && choutYear > year)) {
                    const weekKey = `week_${week}`;
                    const objToSaved = {
                        [todayData]: {
                            price: el.price,
                            discount: el.discount,
                            createdAt: new Date().toISOString(),
                        },
                    };
                    index_1.loggerBoatService.info(`Saving data for weekKey: ${weekKey}, objToSaved:`, objToSaved);
                    await saveAvailabilityData(weekData, slug, weekKey, objToSaved, todayData, chinYear);
                }
            }
            catch (error) {
                index_1.loggerBoatService.error(`Error processing availability data for slug: ${slug}, week: ${weekData}`, error);
            }
        }
    }
    index_1.loggerBoatService.info(`Finished processAvailabilityData for slug: ${slug}, year: ${year}`);
}
async function getAvailabilityWithPrices(singleBoatSlug, freeWeeks) {
    index_1.loggerBoatService.info(`Starting getAvailabilityWithPrices for slug: ${singleBoatSlug}`);
    const results = await Promise.all(freeWeeks.map(async (singleAvailability) => {
        try {
            const result = await index_1.boatServiceCatamaran.getPriceForSingleAvailability(singleBoatSlug, singleAvailability);
            index_1.loggerBoatService.info(`Fetched price for availability:`, singleAvailability, result);
            if (result !== null) {
                return {
                    price: result.price,
                    discount: result.discount,
                    chin: singleAvailability.chin,
                    chout: singleAvailability.chout,
                };
            }
        }
        catch (error) {
            index_1.loggerBoatService.error(`Error fetching price for availability:`, singleAvailability, error);
        }
        return null;
    }));
    index_1.loggerBoatService.info(`Finished getAvailabilityWithPrices for slug: ${singleBoatSlug}, results:`, results);
    return results;
}
async function saveAvailabilityData(weekData, singleBoatSlug, weekKey, objToSaved, todayData, year) {
    index_1.loggerBoatService.info(`Starting saveAvailabilityData for slug: ${singleBoatSlug}, weekKey: ${weekKey}`);
    try {
        if (weekData === null || weekData === undefined || weekData[0] === undefined || weekData[0][weekKey] === undefined) {
            index_1.loggerBoatService.info(`Inserting new week data for slug: ${singleBoatSlug}, weekKey: ${weekKey}`);
            await index_1.supabaseService.insertWeekDataIfNotExist(`boat_availability_${year}`, objToSaved, singleBoatSlug, weekKey);
        }
        else if (weekData[0][weekKey] === null) {
            index_1.loggerBoatService.info(`Updating week data for slug: ${singleBoatSlug}, weekKey: ${weekKey}`);
            await index_1.supabaseService.updateWeekData(`boat_availability_${year}`, weekKey, objToSaved, "slug", singleBoatSlug);
        }
        else {
            const existingData = weekData[0][weekKey];
            if (existingData && typeof existingData !== "string" && typeof existingData !== "number") {
                if (existingData[todayData] !== objToSaved[todayData]) {
                    const updatedObj = { ...existingData, ...objToSaved };
                    index_1.loggerBoatService.info(`Merging existing data for slug: ${singleBoatSlug}, weekKey: ${weekKey}, updatedObj:`, updatedObj);
                    await index_1.supabaseService.updateWeekData(`boat_availability_${year}`, weekKey, updatedObj, "slug", singleBoatSlug);
                }
            }
        }
    }
    catch (error) {
        index_1.loggerBoatService.error(`Error saving availability data for slug: ${singleBoatSlug}, weekKey: ${weekKey}`, error);
    }
    index_1.loggerBoatService.info(`Finished saveAvailabilityData for slug: ${singleBoatSlug}, weekKey: ${weekKey}`);
}
function getFreeWeeksInYear(reservations, year) {
    index_1.loggerBoatService.info(`Starting getFreeWeeksInYear for year: ${year}`);
    let today = new Date().getFullYear() === year ? new Date() : new Date(year, 0, 1);
    const yearEnd = (0, date_fns_1.endOfYear)(today);
    if (today.getFullYear() !== year) {
        today = new Date(year, 0, 1);
    }
    const dayOfWeek = (0, date_fns_1.getDay)(today);
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    let currentSaturday = (0, date_fns_1.addDays)(today, daysUntilSaturday);
    const allWeekends = Array.from({ length: (0, date_fns_1.getISOWeek)(yearEnd) }, (_, i) => {
        const currentSaturday = (0, date_fns_1.addDays)(today, (6 - (0, date_fns_1.getDay)(today) + i * 7) % 7);
        return {
            chin: (0, date_fns_1.format)(currentSaturday, "yyyy-MM-dd"),
            chout: (0, date_fns_1.format)((0, date_fns_1.addDays)(currentSaturday, 7), "yyyy-MM-dd"),
        };
    });
    const freeWeeks = allWeekends.filter((weekend) => !reservations.some((reservation) => reservation.chin <= weekend.chout && reservation.chout >= weekend.chin));
    index_1.loggerBoatService.info(`Finished getFreeWeeksInYear for year: ${year}, freeWeeks:`, freeWeeks);
    return freeWeeks;
}
async function sendBoatToServer(country, category) {
    index_1.loggerSupabaseService.info(`Starting sendBoatToServer for country: ${country}, category: ${category}`);
    const params = { country, category };
    const fetchedboats = await index_1.boatServiceCatamaran.getBoats(params);
    await Promise.all(fetchedboats.map(async (el) => {
        if (!el || !el.slug) {
            index_1.loggerSupabaseService.warn(`Skipped boat: ${JSON.stringify(el)}`);
            return;
        }
        const { error: errorUpsertData } = await index_1.supabaseService.upsertData("boats_list", el);
        if (errorUpsertData) {
            if (errorUpsertData.code === "23503" && errorUpsertData.message?.includes("violates foreign key constraint")) {
                index_1.loggerSupabaseService.warn(`Skipped deleted boat: ${el.slug}`);
                return;
            }
            index_1.loggerSupabaseService.error(`Error upserting data for boat: ${el.slug}, error:`, errorUpsertData);
        }
    }));
    index_1.loggerSupabaseService.info(`Finished sendBoatToServer for country: ${country}, category: ${category}`);
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
