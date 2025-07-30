/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from "@tsoa/runtime";
import { fetchMiddlewares, ExpressTemplateService } from "@tsoa/runtime";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BaseController } from "./../controllers/BaseController";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BoatsController } from "./../controllers/BoatsController";
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from "express";

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  PriceEntry: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        createdAt: { dataType: "string", required: true },
        discount: { dataType: "double", required: true },
        price: { dataType: "double", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  PriceHistory: {
    dataType: "refAlias",
    type: { dataType: "nestedObjectLiteral", nestedProperties: {}, additionalProperties: { ref: "PriceEntry" }, validators: {} },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  WeeklyPriceHistory: {
    dataType: "refAlias",
    type: { dataType: "nestedObjectLiteral", nestedProperties: {}, additionalProperties: { ref: "PriceHistory" }, validators: {} },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, { noImplicitAdditionalProperties: "throw-on-extras", bodyCoercion: true });

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################

  const argsBaseController_getWelcome: Record<string, TsoaRoute.ParameterSchema> = {};
  app.get(
    "/",
    ...fetchMiddlewares<RequestHandler>(BaseController),
    ...fetchMiddlewares<RequestHandler>(BaseController.prototype.getWelcome),

    async function BaseController_getWelcome(request: ExRequest, response: ExResponse, next: any) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({ args: argsBaseController_getWelcome, request, response });

        const controller = new BaseController();

        await templateService.apiHandler({
          methodName: "getWelcome",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsBoatsController_getBoatData: Record<string, TsoaRoute.ParameterSchema> = {
    slug: { in: "query", name: "slug", required: true, dataType: "string" },
    week: { in: "query", name: "week", required: true, dataType: "string" },
    year: { in: "query", name: "year", required: true, dataType: "string" },
  };
  app.get(
    "/boat",
    ...fetchMiddlewares<RequestHandler>(BoatsController),
    ...fetchMiddlewares<RequestHandler>(BoatsController.prototype.getBoatData),

    async function BoatsController_getBoatData(request: ExRequest, response: ExResponse, next: any) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({ args: argsBoatsController_getBoatData, request, response });

        const controller = new BoatsController();

        await templateService.apiHandler({
          methodName: "getBoatData",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
