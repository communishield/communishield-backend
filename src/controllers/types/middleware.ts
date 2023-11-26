import { type Context } from "./context";
import { type ContextSchema } from "./context-schema";
import type Koa from "koa";

export type Middleware<S extends ContextSchema = ContextSchema> = {
  handler:
    | ((ctx: Context<S, any>, next: Koa.Next) => Promise<void> | void)
    | ((ctx: Context<S, any>) => Promise<void> | void);
};
