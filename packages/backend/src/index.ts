import express from "express";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

import { processBoats, sendBoatToServer } from "./utils/processBoats";
import { handleError } from "./utils/handleErrors";
import { CALCULATE_FREEWEEKS_TILL_YEAR } from "./config/constans";
import { BoatAroundService } from "./services/BoatAroundService";
import { SupabaseService } from "./services/SupabaseService";
import { PostgrestError } from "@supabase/supabase-js";
import { Logger } from "./services/Logger";

const app = express();
const port = process.env.PORT || 8080;

export const boatServiceCatamaran = new BoatAroundService();
export const supabaseService = new SupabaseService();

export const loggerMain = new Logger("MainLogger");
export const loggerSupabaseService = new Logger("SupabaseServiceLogger");
export const loggerBoatService = new Logger("BoatServiceLogger");
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Running weekly task
cron.schedule("0 0 * * 0", async () => {
  await loggerMain.info("Running weekly task");
  try {
    await sendBoatToServer("croatia", "catamaran");
    await loggerMain.info("Weekly task completed successfully.");
  } catch (error) {
    await loggerMain.error("Error during weekly task", error);
    handleError(error);
  }
});

// Running daily task
cron.schedule("0 0 * * *", async () => {
  await loggerMain.info("Running daily task");
  try {

    const { data: downloadedBoats, error }: { data: { slug: string }[] | null; error: PostgrestError | null } = await supabaseService.selectData<{
      slug: string;
    }>("boats_list", "slug");

    if (error) {
      await loggerMain.error("Error fetching boats", error);
      return;
    }

    if (downloadedBoats !== null) {
      await processBoats(downloadedBoats, CALCULATE_FREEWEEKS_TILL_YEAR);
      await loggerMain.info("Daily task completed successfully.");
    } else {
      await loggerMain.warn("No boats found to process.");
    }
  } catch (error) {
    await loggerMain.error("Error during daily task", error);
    handleError(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
