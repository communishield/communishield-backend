import { type ApplicationRunner } from "./runner";

export type ApplicationLoader = {
  load(): Promise<ApplicationRunner>;
};
