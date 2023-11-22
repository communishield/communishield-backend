import { z } from "zod";
import { type ContextSchema } from "../types/context-schema";
import { type Middleware } from "../types/middleware";
import type Router from "@koa/router";
import type Koa from "koa";
import { SchemaValidationError } from "@/errors/schema-validation.error";

export class ValidateSchemaMiddleware<S extends ContextSchema = ContextSchema>
  implements Middleware<S>
{
  constructor(private readonly schema: S) {
    this.handler = this.handler.bind(this);
  }

  public async handler(ctx: Router.RouterContext, next: Koa.Next) {
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
