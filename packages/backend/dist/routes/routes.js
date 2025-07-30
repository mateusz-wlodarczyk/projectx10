"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const BaseController_1 = require("./../controllers/BaseController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const BoatsController_1 = require("./../controllers/BoatsController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "PriceEntry": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "createdAt": { "dataType": "string", "required": true }, "discount": { "dataType": "double", "required": true }, "price": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PriceHistory": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "additionalProperties": { "ref": "PriceEntry" }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WeeklyPriceHistory": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "additionalProperties": { "ref": "PriceHistory" }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    const argsBaseController_getWelcome = {};
    app.get('/', ...((0, runtime_1.fetchMiddlewares)(BaseController_1.BaseController)), ...((0, runtime_1.fetchMiddlewares)(BaseController_1.BaseController.prototype.getWelcome)), async function BaseController_getWelcome(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsBaseController_getWelcome, request, response });
            const controller = new BaseController_1.BaseController();
            await templateService.apiHandler({
                methodName: 'getWelcome',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsBoatsController_getBoatData = {
        slug: { "in": "query", "name": "slug", "required": true, "dataType": "string" },
        week: { "in": "query", "name": "week", "required": true, "dataType": "string" },
        year: { "in": "query", "name": "year", "required": true, "dataType": "string" },
    };
    app.get('/boat', ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController)), ...((0, runtime_1.fetchMiddlewares)(BoatsController_1.BoatsController.prototype.getBoatData)), async function BoatsController_getBoatData(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_getBoatData, request, response });
            const controller = new BoatsController_1.BoatsController();
            await templateService.apiHandler({
                methodName: 'getBoatData',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
