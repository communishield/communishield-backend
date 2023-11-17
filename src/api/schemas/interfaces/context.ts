import { type RouterContext } from "@koa/router";
import { type Schema } from "./schema";

export type Context<S extends Schema> = RouterContext & {
  request: RouterContext["request"] & {
    body: S["_output"]["body"];
  };
  params: S["_output"]["params"];
  query: S["_output"]["query"];
};

export type AuthenticatedContext<S extends Schema> = Context<S> & {
  state: {
    user: {
      login: string;
    };
  };
};
