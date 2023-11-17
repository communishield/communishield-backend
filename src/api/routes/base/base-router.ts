import { type Router } from "@/api/interfaces/router";
import KoaRouter from "@koa/router";
import { injectable } from "inversify";

@injectable()
export abstract class BaseRouter implements Router {
  protected readonly router: KoaRouter;

  constructor() {
    this.router = new KoaRouter();
  }

  get routes() {
    return this.router.routes();
  }

  get allowedMethods() {
    return this.router.allowedMethods();
  }

  abstract setup(): Promise<void>;
}
