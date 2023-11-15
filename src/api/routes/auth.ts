import KoaRouter from "@koa/router";
import { type Router } from "../interfaces/router";
import passport from "koa-passport";

export class AuthRouter implements Router {
  private readonly router: KoaRouter;

  constructor() {
    this.router = new KoaRouter();

    this.setupRoutes();
  }

  get routes() {
    return this.router.routes();
  }

  get allowedMethods() {
    return this.router.allowedMethods();
  }

  private setupRoutes() {
    this.router.post(
      "/login",
      passport.authenticate("local", {
        session: false,
      }),
    );
  }
}
