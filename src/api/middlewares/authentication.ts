import { type RouterContext } from "@koa/router";
import { type Middleware } from "./interfaces/middleware";
import { type Next } from "koa";
import passport from "koa-passport";
import { AuthenticationError } from "@/errors/authentication";

export class AuthenticationMiddleware implements Middleware {
  constructor() {
    this.handler = this.handler.bind(this);
  }

  public async handler(ctx: RouterContext, next: Next) {
    try {
      await passport.authenticate("local", {
        session: false,
        failWithError: true,
      })(ctx, next);
    } catch (error) {
      throw new AuthenticationError();
    }
  }
}
