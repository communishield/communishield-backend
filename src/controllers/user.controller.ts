import { bind } from "@/di/container";
import { inject } from "inversify";
import { Endpoint } from "./types/endpoint";
import { BaseController } from "./base.controller";

@bind("UserController")
export class UserController extends BaseController {
  // eslint-disable-next-line max-params
  constructor(
    @inject("NewUserEndpoint") newUserEndpoint: Endpoint<any>,
    @inject("ListUsersEndpoint") listUsersEndpoint: Endpoint<any>,
    @inject("GetUserEndpoint") getUserEndpoint: Endpoint<any>,
    @inject("DeleteUserEndpoint") deleteUserEndpoint: Endpoint<any>,
    @inject("UpdateUserPasswordEndpoint")
    updateUserPasswordEndpoint: Endpoint<any>,
  ) {
    super("/api/v1/users", [
      newUserEndpoint,
      listUsersEndpoint,
      getUserEndpoint,
      deleteUserEndpoint,
      updateUserPasswordEndpoint,
    ]);
  }
}
