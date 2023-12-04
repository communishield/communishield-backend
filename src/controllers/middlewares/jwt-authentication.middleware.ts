import { type Context } from "../types/context";
import { type Middleware } from "../types/middleware";
import type Koa from "koa";
import passport from "koa-passport";
import { z } from "zod";
import { bind } from "@/di/container";
import { InvalidJwtTokenError } from "@/errors/invalid-jwt-token.error";

const loginSchema = z.object({});

@bind("JwtAuthenticationMiddleware")
export class JwtAuthenticationMiddleware
  implements Middleware<typeof loginSchema>
{
  public async handler(ctx: Context<typeof loginSchema>, next: Koa.Next) {
    try {
      await passport.authenticate("jwt", {
        session: false,
        failWithError: true,
      })(ctx, next);
    } catch (error) {
      throw new InvalidJwtTokenError();
    }
  }
}
