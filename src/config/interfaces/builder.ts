import { type Config, type PartialConfig } from "../schemas";

export type ConfigBuilder = {
  merge(partialConfig: PartialConfig): ConfigBuilder;
  build(): Config;
};
