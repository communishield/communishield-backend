import { type RouterContext } from "@koa/router";
import { type Next } from "koa";

export type Middleware = {
  handler(ctx: RouterContext, next: Next): Promise<void>;
};
