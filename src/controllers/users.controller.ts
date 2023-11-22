import { bind } from "@/di/container";
import { BaseController } from "./base.controller";
import { inject } from "inversify";
import { Endpoint } from "./types/endpoint";

@bind("UsersController")
export class UsersController extends BaseController {
  constructor(
    @inject("RegisterEndpoint") registerEndpoint: Endpoint<any>,
    @inject("LoginEndpoint") loginEndpoint: Endpoint<any>,
  ) {
    super("/users", [registerEndpoint, loginEndpoint]);
  }
}
