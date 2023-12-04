import { type Middleware } from "@/controllers/types/middleware";

export type MiddlewareFactory<T> = {
  createMiddleware: <C extends (...args: any[]) => T>(
    provider: C,
  ) => Middleware;
};
