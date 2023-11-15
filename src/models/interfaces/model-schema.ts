import { type z } from "zod";
import { type Model } from "./model";

export type ModelSchema<T extends Model> = {
  zodSchema: z.ZodSchema<T["data"]>;
};
