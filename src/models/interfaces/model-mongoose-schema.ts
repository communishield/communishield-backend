import type mongoose from "mongoose";
import { type Model } from "./model";
import { type ModelSchema } from "./model-schema";

export type ModelMongooseSchema<T extends Model> = {
  mongooseSchema: mongoose.Schema;
  MongooseModel: mongoose.Model<T["data"]>;
  initialize: (collectionName: string) => Promise<void>;
} & ModelSchema<T>;
