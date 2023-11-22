import type Router from "@koa/router";
import { type ContextSchema } from "./context-schema";

export type Context<S extends ContextSchema = ContextSchema> =
  Router.RouterContext & {
    request: Router.RouterContext["request"] & {
      body: S["_output"]["body"];
    };
    params: S["_output"]["params"];
    query: S["_output"]["query"];
  };

export type AuthenticatedContext<T extends ContextSchema> = Context<T> & {
  state: {
    user: {
      login: string;
    };
  };
};
