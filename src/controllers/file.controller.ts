import { bind } from "@/di/container";
import { inject } from "inversify";
import { Endpoint } from "./types/endpoint";
import { BaseController } from "./base.controller";

@bind("FileController")
export class FileController extends BaseController {
  constructor(
    @inject("NewFileEndpoint") newFileEndpoint: Endpoint<any>,
    @inject("GetFileEndpoint") getFileEndpoint: Endpoint<any>,
    @inject("UpdateFileEndpoint") updateFileEndpoint: Endpoint<any>,
    @inject("DeleteFileEndpoint") deleteFileEndpoint: Endpoint<any>,
  ) {
    super("/api/v1/files", [
      newFileEndpoint,
      getFileEndpoint,
      updateFileEndpoint,
      deleteFileEndpoint,
    ]);
  }
}
