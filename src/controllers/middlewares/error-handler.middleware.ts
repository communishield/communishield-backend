import { type Context } from "../types/context";
import { type Middleware } from "../types/middleware";
import type Koa from "koa";
import { ApplicationError } from "@/errors/application.error";
import { bind } from "@/di/container";
import { Logger } from "@/types/logger";
import { inject } from "inversify";

@bind("ErrorHandlerMiddleware")
export class ErrorHandlerMiddleware implements Middleware<any> {
  constructor(@inject("Logger") private readonly logger: Logger) {
    this.handler = this.handler.bind(this);
  }

  public async handler(ctx: Context<any>, next: Koa.Next) {
    try {
      await next();
    } catch (error) {
      if (error instanceof ApplicationError) {
        ctx.status = error.statusCode;
        ctx.body = { message: error.message };
      } else {
        this.logUnhandledError(error);

        ctx.status = 500;
        ctx.body = { message: "Internal Server Error" };
      }
    }
  }

  private logUnhandledError(error: unknown) {
    if (error instanceof Error) {
      this.logger.error(
        `Unhandled error: ${error.name} | ${JSON.stringify(error)}`,
      );
      return;
    }

    this.logger.error(`Unhandled error: ${JSON.stringify(error)}`);
  }
}
