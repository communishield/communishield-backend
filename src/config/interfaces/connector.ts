import { type PartialConfig } from "../schemas";

export type ConfigLoaderConnector = {
  load(): PartialConfig;
};
