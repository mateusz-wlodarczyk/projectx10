"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerBoatService = exports.loggerSupabaseService = exports.loggerMain = exports.supabaseService = exports.boatServiceCatamaran = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
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
const boats_1 = __importDefault(require("./api/boats"));
// Simple rate limiting middleware
const rateLimitMiddleware = (req, res, next) => {
    // Simple rate limiting implementation
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 100;
    // For now, just pass through - implement proper rate limiting later
    next();
};
const port = process.env.PORT || 8080;
exports.boatServiceCatamaran = new BoatAroundService_1.BoatAroundService();
exports.supabaseService = new SupabaseService_1.SupabaseService();
exports.loggerMain = new Logger_1.Logger("MainLogger");
exports.loggerSupabaseService = new Logger_1.Logger("SupabaseServiceLogger");
exports.loggerBoatService = new Logger_1.Logger("BoatServiceLogger");
// Security middleware
boats_1.default.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
boats_1.default.use((0, cors_1.default)({
    origin: (0, urls_1.getCorsOrigins)(),
    credentials: true,
}));
// Body parsing middleware
boats_1.default.use(body_parser_1.default.json());
boats_1.default.use(body_parser_1.default.urlencoded({ extended: true }));
// Rate limiting middleware
boats_1.default.use(rateLimitMiddleware);
// Trust proxy for accurate IP addresses
boats_1.default.set("trust proxy", 1);
(0, routes_1.RegisterRoutes)(boats_1.default);
// Running weekly task
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
// Running daily task
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
boats_1.default.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
