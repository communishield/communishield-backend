import { z } from "zod";
import { type ContextSchema } from "../types/context-schema";
import { type Middleware } from "../types/middleware";
import type Koa from "koa";
import { SchemaValidationError } from "@/errors/schema-validation.error";
import { type Context } from "../types/context";

export class ValidateSchemaMiddleware<S extends ContextSchema = ContextSchema>
  implements Middleware<S>
{
  constructor(private readonly schema: S) {
    this.handler = this.handler.bind(this);
  }

  public async handler(ctx: Context<S>, next: Koa.Next) {
    const {
      request: { body },
      params,
      query,
      header,
    } = ctx;

    try {
      const parsed = this.schema.parse({
        body,
        params,
        query,
        header,
      });

      ctx.state.parsed = {
        body: parsed.body,
        params: parsed.params,
        query: parsed.query,
        header: parsed.header,
      };

      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw SchemaValidationError.fromZodError(error);
      }

      throw error;
    }
  }
}
