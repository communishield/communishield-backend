import type Router from "@koa/router";
import { type ContextSchema } from "./context-schema";

export type Context<
  S extends ContextSchema = ContextSchema,
  ExtraState extends Record<string, unknown> = Record<string, unknown>,
> = {
  state: {
    parsed: {
      body: S["_output"]["body"];
      params: S["_output"]["params"];
      query: S["_output"]["query"];
      header: S["_output"]["header"];
    };
  } & ExtraState;
} & Router.RouterContext;

export type AuthenticatedContext<S extends ContextSchema> = Context<
  S,
  {
    user: {
      username: string;
    };
  }
>;
