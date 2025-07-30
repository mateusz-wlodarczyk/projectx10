import { Controller, Get, Route, Tags } from "tsoa";
import { SWAGGER_TAGS } from "../config/constans";

@Route(SWAGGER_TAGS.home.url)
@Tags(SWAGGER_TAGS.home.tag)
export class BaseController extends Controller {
  /**
   * @returns
   */
  @Get(SWAGGER_TAGS.home.url)
  public async getWelcome(): Promise<string> {
    return "Hello World";
  }
}
