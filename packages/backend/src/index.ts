// server.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

import { RegisterRoutes } from "./routes/routes";
import { processBoats, sendBoatToServer } from "./utils/processBoats";
import { handleError } from "./utils/handleErrors";
import { CALCULATE_FREEWEEKS_TILL_YEAR } from "./config/constans";
import { FRONTEND_URLS, getCorsOrigins } from "./config/urls";
import { BoatAroundService } from "./services/BoatAroundService";
import { SupabaseService } from "./services/SupabaseService";
import { Logger } from "./services/Logger";
import { isSlugArray } from "./utils/selectDataArrayChecking";

const app = express();
const port = process.env.PORT || 8080;

// Services & loggers
export const boatServiceCatamaran = new BoatAroundService();
export const supabaseService = new SupabaseService();
export const loggerMain = new Logger("MainLogger");

// ----- CORS SETUP -----
const corsOrigins = getCorsOrigins().map((o) => o.replace(/\/+$/, "").trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow server-to-server or curl requests
      const normalized = origin.replace(/\/+$/, "").trim();
      if (corsOrigins.includes(normalized)) return cb(null, true);
      return cb(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ----- HELMET SECURITY -----
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

// ----- BODY PARSING -----
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ----- TRUST PROXY -----
app.set("trust proxy", 1);

// ----- REGISTER ROUTES -----
RegisterRoutes(app);

// ----- DASHBOARD REDIRECT -----
const dashboardRedirectUrl =
  process.env.CORS_ORIGIN?.split(",")
    .map((o) => o.trim())
    .filter(Boolean)[0] || (process.env.NODE_ENV === "production" ? FRONTEND_URLS.PRODUCTION[0] : FRONTEND_URLS.DEVELOPMENT[0]);

app.get("/dashboard", (_req, res) => {
  res.redirect(302, `${dashboardRedirectUrl}/dashboard`);
});

// ----- WEEKLY CRON -----
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

// ----- DAILY CRON -----
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

// ----- START SERVER -----
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
