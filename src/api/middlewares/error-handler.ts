import { type RouterContext } from "@koa/router";
import { type Middleware } from "./interfaces/middleware";
import { type Next } from "koa";
import { CommunishieldError } from "@/errors/communishield";
import { NotFoundError } from "@/errors/not-found";
import { ParameterNotInitializedError } from "@/errors/parameter-not-initialized";
import { UnexpectedValueError } from "@/errors/unexpected-value";
import { SchemaValidationError } from "@/errors/schema-validation";
import { inject, injectable } from "inversify";
import { AuthenticationError } from "@/errors/authentication";
import { types } from "@/types";
import { Logger } from "@/logger/interfaces/logger";

@injectable()
export class ErrorHandlerMiddleware implements Middleware {
  constructor(@inject(types.logger) private readonly logger: Logger) {
    this.handler = this.handler.bind(this);
  }

  public async handler(ctx: RouterContext, next: Next) {
    try {
      await next();
    } catch (error) {
      ctx.message =
        error instanceof CommunishieldError
          ? error.message
          : "Internal server error";

      if (error instanceof NotFoundError) {
        ctx.status = 404;
      } else if (error instanceof ParameterNotInitializedError) {
        ctx.status = 400;
      } else if (error instanceof UnexpectedValueError) {
        ctx.status = 400;
      } else if (error instanceof SchemaValidationError) {
        ctx.status = 400;
      } else if (error instanceof SyntaxError) {
        ctx.status = 400;
        ctx.message = error.message;
      } else if (error instanceof AuthenticationError) {
        ctx.status = 401;
      } else if (error instanceof Error) {
        this.logger.error(
          `Unexpected error | name: ${error.name} | message: ${
            error.message
          } | payload: ${JSON.stringify(ctx.request.body)}`,
        );
        ctx.status = 500;
      } else {
        this.logger.error(
          `Unexpected error | payload: ${JSON.stringify(ctx.request.body)}`,
        );
        ctx.status = 500;
      }

      ctx.body = {
        message: ctx.message,
      };
    }
  }
}
