"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoatsController = void 0;
const tsoa_1 = require("tsoa");
const boatService_1 = require("../utils/boatService");
let BoatsController = class BoatsController extends tsoa_1.Controller {
    /**
     * Get boat data for a specific slug, week, and year
     * @param slug The slug of the boat
     * @param week The week number
     * @param year The year
     * @returns Price history data for the boat
     */
    async getBoatData(slug, week, year) {
        return await (0, boatService_1.getBoatData)(slug, week, year);
    }
};
exports.BoatsController = BoatsController;
__decorate([
    (0, tsoa_1.Get)("/"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], BoatsController.prototype, "getBoatData", null);
exports.BoatsController = BoatsController = __decorate([
    (0, tsoa_1.Route)("boat"),
    (0, tsoa_1.Tags)("Boats")
], BoatsController);
