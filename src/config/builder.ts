import { z } from "zod";
import { configSchema, partialConfigSchema } from "./schemas";
import { bind } from "@/di/container";
import { SchemaValidationError } from "@/errors/schema-validation.error";
import { type ConfigBuilder } from "./types/config-builder";

@bind("ConfigBuilder")
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
