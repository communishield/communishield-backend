import { bind } from "@/di/container";
import { inject } from "inversify";
import { Endpoint } from "./types/endpoint";
import { BaseController } from "./base.controller";

@bind("DirectoryController")
export class RootController extends BaseController {
  constructor(
    @inject("NewDirectoryEndpoint") newDirectoryEndpoint: Endpoint<any>,
    @inject("GetDirectoryEndpoint") getDirectoryEndpoint: Endpoint<any>,
    @inject("UpdateDirectoryEndpoint") updateDirectoryEndpoint: Endpoint<any>,
    @inject("DeleteDirectoryEndpoint") deleteDirectoryEndpoint: Endpoint<any>,
  ) {
    super("/api/v1/directories", [
      newDirectoryEndpoint,
      getDirectoryEndpoint,
      updateDirectoryEndpoint,
      deleteDirectoryEndpoint,
    ]);
  }
}
