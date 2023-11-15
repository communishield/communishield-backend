import { z } from "zod";
import { type Model } from "../interfaces/model";
import { type ModelSchema } from "../interfaces/model-schema";

export abstract class BaseModelSchema<T extends Model>
  implements ModelSchema<T>
{
  static defaultZodSchema = z.object({
    _id: z.string().default(""),
    deleted: z.boolean().default(false),
    deletedAt: z.date().optional().nullable(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
  });

  public readonly zodSchema: z.ZodType<T["data"]>;

  constructor(schema: z.ZodRawShape) {
    this.zodSchema = BaseModelSchema.defaultZodSchema.extend(
      schema,
    ) as z.ZodType<T["data"]>;
  }
}
