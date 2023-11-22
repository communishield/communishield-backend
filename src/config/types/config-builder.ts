import { type Builder } from "@/types/builder";
import { type Config, type PartialConfig } from "../schemas";

export type ConfigBuilder = {
  merge(partialConfig: PartialConfig): ConfigBuilder;
} & Builder<Config>;
