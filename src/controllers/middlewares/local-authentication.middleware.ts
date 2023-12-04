import { LoginFailedError } from "@/errors/login-failed.error";
import { type Context } from "../types/context";
import { type Middleware } from "../types/middleware";
import type Koa from "koa";
import passport from "koa-passport";
import { z } from "zod";
import { bind } from "@/di/container";

const loginSchema = z.object({
  body: z.object({
    login: z.string(),
    password: z.string(),
  }),
});

@bind("LocalAuthenticationMiddleware")
export class LocalAuthenticationMiddleware
  implements Middleware<typeof loginSchema>
{
  public async handler(ctx: Context<typeof loginSchema>, next: Koa.Next) {
    try {
      await passport.authenticate("local", {
        session: false,
        failWithError: true,
      })(ctx, next);
    } catch (error) {
      console.log(error);
      throw new LoginFailedError();
    }
  }
}
