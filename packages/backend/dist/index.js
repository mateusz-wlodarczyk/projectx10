"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerBoatService = exports.loggerSupabaseService = exports.loggerMain = exports.supabaseService = exports.boatServiceCatamaran = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes/routes");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger/swagger.json"));
const processBoats_1 = require("./utils/processBoats");
const handleErrors_1 = require("./utils/handleErrors");
const constans_1 = require("./config/constans");
const BoatAroundService_1 = require("./services/BoatAroundService");
const SupabaseService_1 = require("./services/SupabaseService");
const Logger_1 = require("./services/Logger");
const selectDataArrayChecking_1 = require("./utils/selectDataArrayChecking");
const port = process.env.PORT || 8080;
exports.boatServiceCatamaran = new BoatAroundService_1.BoatAroundService();
exports.supabaseService = new SupabaseService_1.SupabaseService();
exports.loggerMain = new Logger_1.Logger("MainLogger");
exports.loggerSupabaseService = new Logger_1.Logger("SupabaseServiceLogger");
exports.loggerBoatService = new Logger_1.Logger("BoatServiceLogger");
// Create Express app
const app = (0, express_1.default)();
// Body parsing middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Register tsoa routes
(0, routes_1.RegisterRoutes)(app);
// Serve swagger docs
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
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
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
