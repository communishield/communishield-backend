import { type Context } from "../types/context";
import { type Middleware } from "../types/middleware";
import type Koa from "koa";
import { ApplicationError } from "@/errors/application.error";
import { bind } from "@/di/container";

@bind("ErrorHandlerMiddleware")
export class ErrorHandlerMiddleware implements Middleware<any> {
  public async handler(ctx: Context<any>, next: Koa.Next) {
    try {
      await next();
    } catch (error) {
      if (error instanceof ApplicationError) {
        ctx.status = error.statusCode;
        ctx.body = { message: error.message };
      } else {
        ctx.status = 500;
        ctx.body = { message: "Internal Server Error" };
      }
    }
  }
}
