"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerSupabaseService = exports.loggerBoatService = exports.loggerMain = exports.supabaseService = exports.boatServiceCatamaran = void 0;
// server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_cron_1 = __importDefault(require("node-cron"));
dotenv_1.default.config();
const routes_1 = require("./routes/routes");
const processBoats_1 = require("./utils/processBoats");
const handleErrors_1 = require("./utils/handleErrors");
const constans_1 = require("./config/constans");
const urls_1 = require("./config/urls");
const BoatAroundService_1 = require("./services/BoatAroundService");
const SupabaseService_1 = require("./services/SupabaseService");
const Logger_1 = require("./services/Logger");
const selectDataArrayChecking_1 = require("./utils/selectDataArrayChecking");
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
// Services & loggers
exports.boatServiceCatamaran = new BoatAroundService_1.BoatAroundService();
exports.supabaseService = new SupabaseService_1.SupabaseService();
exports.loggerMain = new Logger_1.Logger("MainLogger");
exports.loggerBoatService = new Logger_1.Logger("BoatServiceLogger");
exports.loggerSupabaseService = new Logger_1.Logger("SupabaseServiceLogger");
// ----- CORS SETUP -----
const corsOrigins = (0, urls_1.getCorsOrigins)().map((o) => o.replace(/\/+$/, "").trim());
const normalizeOrigin = (o) => o.replace(/\/+$/, "").trim();
const isAllowedOrigin = (origin) => corsOrigins.some((a) => normalizeOrigin(a) === normalizeOrigin(origin));
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
app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        if (!origin)
            return cb(null, true);
        if (isAllowedOrigin(origin))
            return cb(null, true);
        return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
}));
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
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
// ----- BODY PARSING -----
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// ----- TRUST PROXY -----
app.set("trust proxy", 1);
// ----- Kto tu w ogóle działa (żeby odróżnić backend od frontendu na Renderze) -----
app.get("/who-is-running", (_req, res) => {
    res.json({ service: "boats-stats-api", cors: true, ok: true });
});
// ----- Debug: co zwraca Supabase (żeby zobaczyć surową odpowiedź) -----
// Użyj GET /who-is-running – jeśli dostaniesz { "service": "boats-stats-api" }, to działa backend; wtedy /debug/supabase-response też.
const debugSupabaseHandler = (req, res) => {
    const out = {
        configured: exports.supabaseService.isConfigured,
        table: "boats_list",
        data: null,
        error: null,
    };
    if (!exports.supabaseService.isConfigured || !exports.supabaseService.client) {
        res.json(out);
        return;
    }
    const q = exports.supabaseService.supabase
        .from("boats_list")
        .select("slug, id, title")
        .limit(5);
    Promise.resolve(q)
        .then(({ data, error }) => {
        out.data = data;
        out.error = error ? { message: error.message, code: error.code, details: error.details } : null;
        out.count = Array.isArray(data) ? data.length : undefined;
        res.json(out);
    })
        .catch((e) => {
        out.rawError = e instanceof Error ? e.message : String(e);
        res.json(out);
    });
};
app.get("/debug/supabase-response", debugSupabaseHandler);
app.get("/api/debug/supabase-response", debugSupabaseHandler);
// ----- REGISTER ROUTES -----
(0, routes_1.RegisterRoutes)(app);
// ----- DASHBOARD REDIRECT -----
const dashboardRedirectUrl = process.env.CORS_ORIGIN?.split(",")
    .map((o) => o.trim())
    .filter(Boolean)[0] || (process.env.NODE_ENV === "production" ? urls_1.FRONTEND_URLS.PRODUCTION[0] : urls_1.FRONTEND_URLS.DEVELOPMENT[0]);
app.get("/dashboard", (_req, res) => {
    res.redirect(302, `${dashboardRedirectUrl}/dashboard`);
});
// ----- WEEKLY CRON -----
node_cron_1.default.schedule("0 0 * * 0", async () => {
    await exports.loggerMain.info("Running weekly task");
    try {
        await (0, processBoats_1.sendBoatToServer)("croatia", "catamaran");
        await exports.loggerMain.info("Weekly task completed successfully.");
    }
    catch (error) {
        await exports.loggerMain.error("Error during weekly task", error);
        (0, handleErrors_1.handleError)(error);
    }
});
// ----- DAILY CRON -----
node_cron_1.default.schedule("0 0 * * *", async () => {
    await exports.loggerMain.info("Running daily task");
    try {
        const { data: downloadedBoats, error } = await exports.supabaseService.selectData("boats_list", "slug");
        if (error) {
            await exports.loggerMain.error("Error fetching boats", error);
            return;
        }
        if (downloadedBoats !== null && (0, selectDataArrayChecking_1.isSlugArray)(downloadedBoats)) {
            await (0, processBoats_1.processBoats)(downloadedBoats, constans_1.CALCULATE_FREEWEEKS_TILL_YEAR);
            await exports.loggerMain.info("Daily task completed successfully.");
        }
        else {
            await exports.loggerMain.warn("No boats found to process.");
        }
    }
    catch (error) {
        await exports.loggerMain.error("Error during daily task", error);
        (0, handleErrors_1.handleError)(error);
    }
});
// ----- START SERVER -----
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`[CORS] Allowed origins: ${corsOrigins.join(", ")}`);
});
exports.default = app;
