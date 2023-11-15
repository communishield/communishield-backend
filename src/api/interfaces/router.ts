import { type Middleware } from "@koa/router";

export type Router = {
  routes: Middleware;
  allowedMethods: Middleware;
};
