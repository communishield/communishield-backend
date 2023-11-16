import { type RouterContext } from "@koa/router";
import { type Middleware } from "./interfaces/middleware";
import { type Next } from "koa";
import { SchemaValidationError } from "@/errors/schema-validation";
import { type Schema } from "../schemas/interfaces/schema";
import { z } from "zod";

export class ValidateSchemaMiddleware implements Middleware {
  constructor(private readonly schema: Schema) {
    this.handler = this.handler.bind(this);
  }

  public async handler(ctx: RouterContext, next: Next) {
    const { body } = ctx.request;
    const { params } = ctx;
    const { query } = ctx;

    try {
      const parsed = this.schema.parse({
        body,
        params,
        query,
      });

      ctx.state.body = parsed.body;
      ctx.state.params = parsed.params;
      ctx.state.query = parsed.query;

      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw SchemaValidationError.fromZodError(error);
      }

      throw error;
    }
  }
}
