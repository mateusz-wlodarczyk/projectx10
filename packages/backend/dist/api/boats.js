"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handleFilteredSlugWeek_1 = require("../utils/handleFilteredSlugWeek");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app = (0, express_1.default)();
const swagger_1 = require("../swagger/swagger");
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/boat", handleFilteredSlugWeek_1.handleFilteredSlugWeek);
//example: http://localhost:8080/boat?slug=bali-41-avaler&year=2025&week=1
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerDocument));
exports.default = app;
