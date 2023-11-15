import { z } from "zod";
import { type Model } from "../interfaces/model";
import { type ModelFactory } from "../interfaces/model-factory";
import { type ModelSchema } from "../interfaces/model-schema";
import { SchemaValidationError } from "@/errors/schema-validation";

export class BaseModelFactory<T extends Model> implements ModelFactory<T> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private readonly ClassConstructor: new (data: T["data"]) => T,
    private readonly schema: ModelSchema<T>,
  ) {}

  create(data: T["data"]) {
    try {
      const parsed = this.schema.zodSchema.parse(data);

      return new this.ClassConstructor(parsed);
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw SchemaValidationError.fromZodError(err);
      }

      throw err;
    }
  }
}
