import { type z } from "zod";
import { type ConfigBuilder } from "./interfaces/builder";
import { configSchema, partialConfigSchema } from "./schemas";

export class ConfigBuilderImpl implements ConfigBuilder {
  private partialConfig: z.infer<typeof partialConfigSchema>;

  constructor() {
    this.partialConfig = partialConfigSchema.parse({});
  }

  merge(partialConfig: z.infer<typeof partialConfigSchema>) {
    this.partialConfig = partialConfigSchema.parse({
      ...this.partialConfig,
      ...partialConfig,
    });

    return this;
  }

  build() {
    return configSchema.parse({
      ...this.partialConfig,
    });
  }
}
