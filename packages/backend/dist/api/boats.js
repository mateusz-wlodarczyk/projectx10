"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handleFilteredSlugWeek_1 = require("../utils/handleFilteredSlugWeek");
const app = (0, express_1.default)();
// Welcome endpoint
app.get("/", (req, res) => {
    res.send("Hello World");
});
// Boat endpoint using existing logic
app.get("/boat", handleFilteredSlugWeek_1.handleFilteredSlugWeek);
exports.default = app;
