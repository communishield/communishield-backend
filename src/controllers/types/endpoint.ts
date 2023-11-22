import { type ContextSchema } from "./context-schema";
import { type Middleware } from "./middleware";

export type Endpoint<S extends ContextSchema = ContextSchema> = {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  schema: S;
  middlewares?: Array<Middleware<any>>;
} & Middleware<S>;
