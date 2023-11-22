import Router from "@koa/router";
import { type Endpoint } from "./types/endpoint";
import { ValidateSchemaMiddleware } from "./middlewares/validate-schema.middleware";
import { joinUrl } from "@/utils/join-url";
import { injectable, unmanaged } from "inversify";
import { type Controller } from "@/types/controller";

@injectable()
export abstract class BaseController implements Controller {
  public readonly router = new Router();

  constructor(
    @unmanaged() public readonly path: string,
    @unmanaged() public readonly endpoints: Array<Endpoint<any>>,
  ) {
    endpoints.forEach(this.registerEndpoint.bind(this));
  }

  private registerEndpoint(endpoint: Endpoint) {
    const params = [
      joinUrl(this.path, endpoint.path),
      new ValidateSchemaMiddleware(endpoint.schema).handler,
      ...((endpoint.middlewares ?? []).map((m) => m.handler) ?? []),
      endpoint.handler,
    ] as const;

    switch (endpoint.method) {
      case "GET":
        this.router.get(...params);
        break;
      case "POST":
        this.router.post(...params);
        break;
      case "PUT":
        this.router.put(...params);
        break;
      case "DELETE":
        this.router.delete(...params);
        break;
      default:
        throw new Error(`Unsupported method: ${endpoint.method as string}`);
    }
  }
}
