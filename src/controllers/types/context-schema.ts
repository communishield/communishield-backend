import { type z } from "zod";

export type ContextSchema = z.ZodType<
  {
    body?: Record<string, unknown>;
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
  },
  any,
  {
    body?: Record<string, unknown>;
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
  }
>;
