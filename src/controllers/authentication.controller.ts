import { bind } from "@/di/container";
import { inject } from "inversify";
import { Endpoint } from "./types/endpoint";
import { BaseController } from "./base.controller";

@bind("AuthenticationController")
export class AuthenticationController extends BaseController {
  constructor(@inject("LoginEndpoint") loginEndpoint: Endpoint<any>) {
    super("/api/v1/auth", [loginEndpoint]);
  }
}
