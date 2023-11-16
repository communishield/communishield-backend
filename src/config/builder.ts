import { z } from "zod";
import { type ConfigBuilder } from "./interfaces/builder";
import { configSchema, partialConfigSchema } from "./schemas";
import { SchemaValidationError } from "@/errors/schema-validation";

export class ConfigBuilderImpl implements ConfigBuilder {
  private partialConfig: z.infer<typeof partialConfigSchema>;

  constructor() {
    try {
      this.partialConfig = partialConfigSchema.parse({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw SchemaValidationError.fromZodError(error);
      }

      throw error;
    }
  }

  merge(partialConfig: z.infer<typeof partialConfigSchema>) {
    try {
      this.partialConfig = partialConfigSchema.parse({
        ...this.partialConfig,
        ...partialConfig,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw SchemaValidationError.fromZodError(error);
      }

      throw error;
    }

    return this;
  }

  build() {
    try {
      return configSchema.parse({
        ...this.partialConfig,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw SchemaValidationError.fromZodError(error);
      }

      throw error;
    }
  }
}
