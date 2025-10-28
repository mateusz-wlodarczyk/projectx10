import cron from "node-cron";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
dotenv.config();

import { RegisterRoutes } from "./routes/routes";
import { processBoats, sendBoatToServer } from "./utils/processBoats";
import { handleError } from "./utils/handleErrors";
import { CALCULATE_FREEWEEKS_TILL_YEAR } from "./config/constans";
import { getCorsOrigins } from "./config/urls";
import { BoatAroundService } from "./services/BoatAroundService";
import { SupabaseService } from "./services/SupabaseService";
import { Logger } from "./services/Logger";
import { isSlugArray } from "./utils/selectDataArrayChecking";
import app from "./api/boats";

// Simple rate limiting middleware
const rateLimitMiddleware = (req: any, res: any, next: any) => {
  // Simple rate limiting implementation
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  // For now, just pass through - implement proper rate limiting later
  next();
};

const port = process.env.PORT || 8080;

export const boatServiceCatamaran = new BoatAroundService();
export const supabaseService = new SupabaseService();
export const loggerMain = new Logger("MainLogger");
export const loggerSupabaseService = new Logger("SupabaseServiceLogger");
export const loggerBoatService = new Logger("BoatServiceLogger");

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
);

app.use(
  cors({
    origin: getCorsOrigins(),
    credentials: true,
  }),
);

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting middleware
app.use(rateLimitMiddleware);

// Trust proxy for accurate IP addresses
app.set("trust proxy", 1);

RegisterRoutes(app);

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
    const { data: downloadedBoats, error } = await supabaseService.selectData("boats_list", "slug");

    if (error) {
      await loggerMain.error("Error fetching boats", error);
      return;
    }

    if (downloadedBoats !== null && isSlugArray(downloadedBoats)) {
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
