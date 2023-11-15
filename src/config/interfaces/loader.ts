import { type Config } from "../schemas";

export type ConfigLoader = {
  load(): Config;
};
