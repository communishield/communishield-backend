import { type z } from "zod";

export function enforceUnique<T extends z.ZodArray<U>, U extends z.ZodTypeAny>(
  schema: T,
): z.ZodEffects<T> {
  return schema.refine((data) => data.length === new Set(data).size, {
    message: "must be unique",
  });
}
