import KoaRouter from "@koa/router";
import passport from "koa-passport";
import { BaseRouter } from "./base/base-router";

export class AuthRouter extends BaseRouter {
  protected setupRoutes() {
    this.router.post(
      "/login",
      passport.authenticate("local", {
        session: false,
      }),
    );
  }
}
