import { type Model } from "./model";

export type ModelFactory<T extends Model> = {
  create(data: T["data"]): T;
};
