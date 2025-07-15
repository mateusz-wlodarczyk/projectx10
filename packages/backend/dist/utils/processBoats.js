"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processBoats = processBoats;
exports.processAvailabilityData = processAvailabilityData;
exports.getAvailabilityWithPrices = getAvailabilityWithPrices;
exports.saveAvailabilityData = saveAvailabilityData;
exports.getFreeWeeksInYear = getFreeWeeksInYear;
exports.sendBoatToServer = sendBoatToServer;
const handleErrors_1 = require("./handleErrors");
const constans_1 = require("../config/constans");
const sleep_1 = require("./sleep");
const date_fns_1 = require("date-fns");
const index_1 = require("../index");
async function processBoats(downloadedBoats, endYear) {
    const today = new Date();
    //todo zmienic na format yyyy-mm-dd - obecnie uzywany do spr zapisu w supabase
    const todayData = new Date().toISOString();
    const todayYear = today.getFullYear();
    for (const singleBoatSlug of downloadedBoats) {
        try {
            const bookedForSingleSlug = await index_1.boatServiceCatamaran.getAvailabilitySingleBoat(singleBoatSlug.slug);
            if (bookedForSingleSlug !== null) {
                for (let year = todayYear; year <= endYear; year++) {
                    const freeWeeks = getFreeWeeksInYear(bookedForSingleSlug.availabilities, year);
                    const availabilityWithPrices = await getAvailabilityWithPrices(singleBoatSlug.slug, freeWeeks);
                    const filteredAvailabilityWithPrices = availabilityWithPrices.filter(Boolean);
                    const { data: weekData } = await index_1.supabaseService.selectSpecificData(`boat_availability_${year}`, "slug", `${singleBoatSlug.slug}`);
                    if (weekData !== null) {
                        await processAvailabilityData(filteredAvailabilityWithPrices, weekData, singleBoatSlug.slug, todayData, year);
                    }
                }
            }
        }
        catch (error) {
            (0, handleErrors_1.handleError)(error);
        }
        await (0, sleep_1.sleep)(constans_1.API_REQUEST_PRICE_DELAY_MS);
    }
}
async function processAvailabilityData(filteredAvailabilityWithPrices, weekData, slug, todayData, year) {
    for (const el of filteredAvailabilityWithPrices) {
        if (el !== null) {
            try {
                const week = (0, date_fns_1.getISOWeek)(new Date(`${el?.chout}`).toISOString());
                const chinYear = new Date(el?.chin).getFullYear();
                const choutYear = new Date(el?.chout).getFullYear();
                if ((chinYear < year && choutYear === year) || (chinYear === year && choutYear === year) || (chinYear === year && choutYear > year)) {
                    const weekKey = `week_${week}`;
                    const objToSaved = {
                        [todayData]: {
                            price: el.price,
                            discount: el.discount,
                            createdAt: new Date().toISOString(),
                        },
                    };
                    await saveAvailabilityData(weekData, slug, weekKey, objToSaved, todayData, chinYear);
                }
            }
            catch (error) {
                (0, handleErrors_1.handleError)(error);
            }
        }
    }
}
async function getAvailabilityWithPrices(singleBoatSlug, freeWeeks) {
    return await Promise.all(freeWeeks.map(async (singleAvailability) => {
        try {
            const result = await index_1.boatServiceCatamaran.getPriceForSingleAvailability(singleBoatSlug, singleAvailability);
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
            (0, handleErrors_1.handleError)(error);
        }
        return null;
    }));
}
async function saveAvailabilityData(weekData, singleBoatSlug, weekKey, objToSaved, todayData, year) {
    try {
        if (weekData === null || weekData === undefined || weekData[0] === undefined || weekData[0][weekKey] === undefined) {
            await index_1.supabaseService.insertWeekDataIfNotExist(`boat_availability_${year}`, objToSaved, singleBoatSlug, weekKey);
        }
        else if (weekData[0][weekKey] === null) {
            await index_1.supabaseService.updateWeekData(`boat_availability_${year}`, weekKey, objToSaved, "slug", singleBoatSlug);
        }
        else {
            const existingData = weekData[0][weekKey];
            if (existingData && typeof existingData !== "string" && typeof existingData !== "number") {
                if (existingData[todayData] !== objToSaved[todayData]) {
                    const updatedObj = { ...existingData, ...objToSaved };
                    await index_1.supabaseService.updateWeekData(`boat_availability_${year}`, weekKey, updatedObj, "slug", singleBoatSlug);
                }
            }
        }
    }
    catch (error) {
        (0, handleErrors_1.handleError)(error);
    }
}
function getFreeWeeksInYear(reservations, year) {
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
    return allWeekends.filter((weekend) => !reservations.some((reservation) => reservation.chin <= weekend.chout && reservation.chout >= weekend.chin));
}
async function sendBoatToServer(country, category) {
    const params = { country, category };
    const fetchedboats = await index_1.boatServiceCatamaran.getBoats(params);
    await Promise.all(fetchedboats.map(async (el) => {
        if (!el || !el.slug) {
            console.log(`Skipped boat: ${JSON.stringify(el)}`);
            return;
        }
        const { error: errorUpsertData } = await index_1.supabaseService.upsertData("boats_list", el);
        if (errorUpsertData) {
            if (errorUpsertData.code === "23503" && errorUpsertData.message?.includes("violates foreign key constraint")) {
                console.log(`Skipped deleted boat: ${el.slug}`);
                return;
            }
            console.log(`errorUpsertData: ${errorUpsertData}, ${JSON.stringify(errorUpsertData, null, 2)}`);
        }
    }));
}
