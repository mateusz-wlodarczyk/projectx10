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
export const loggerBoatService = new Logger("BoatServiceLogger");
export const loggerSupabaseService = new Logger("SupabaseServiceLogger");

// ----- CORS SETUP -----
const corsOrigins = getCorsOrigins().map((o) => o.replace(/\/+$/, "").trim());
const normalizeOrigin = (o: string) => o.replace(/\/+$/, "").trim();
const isAllowedOrigin = (origin: string) => corsOrigins.some((a) => normalizeOrigin(a) === normalizeOrigin(origin));

// 1) Preflight OPTIONS – must respond with CORS headers so browser allows actual request
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  res.sendStatus(204);
});

// 2) CORS for actual requests (do not pass Error to cb – that prevents headers from being set)
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (isAllowedOrigin(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  }),
);

// 3) Ensure CORS headers on every response (including errors) for allowed origin
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  next();
});

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

// ----- Kto tu w ogóle działa (żeby odróżnić backend od frontendu na Renderze) -----
app.get("/who-is-running", (_req, res) => {
  res.json({ service: "boats-stats-api", cors: true, ok: true });
});

// ----- Debug: co zwraca Supabase (żeby zobaczyć surową odpowiedź) -----
// Użyj GET /who-is-running – jeśli dostaniesz { "service": "boats-stats-api" }, to działa backend; wtedy /debug/supabase-response też.
const debugSupabaseHandler = (req: express.Request, res: express.Response) => {
  const out: {
    configured: boolean;
    table: string;
    data: unknown;
    error: unknown;
    count?: number;
    rawError?: unknown;
  } = {
    configured: supabaseService.isConfigured,
    table: "boats_list",
    data: null,
    error: null,
  };
  if (!supabaseService.isConfigured || !supabaseService.client) {
    res.json(out);
    return;
  }
  const q = supabaseService.supabase
    .from("boats_list")
    .select("slug, _id, title")
    .limit(5);
  Promise.resolve(q)
    .then(({ data, error }) => {
      out.data = data;
      out.error = error ? { message: error.message, code: error.code, details: error.details } : null;
      out.count = Array.isArray(data) ? data.length : undefined;
      res.json(out);
    })
    .catch((e: unknown) => {
      out.rawError = e instanceof Error ? e.message : String(e);
      res.json(out);
    });
};
app.get("/debug/supabase-response", debugSupabaseHandler);
app.get("/api/debug/supabase-response", debugSupabaseHandler);

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
  console.log(`[CORS] Allowed origins: ${corsOrigins.join(", ")}`);
});

export default app;
