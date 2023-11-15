import mongoose from "mongoose";
import { type Model } from "../interfaces/model";
import { type ModelMongooseSchema } from "../interfaces/model-mongoose-schema";
import { BaseModelSchema } from "./base-schema";
import { type z } from "zod";
import { Mutex } from "async-mutex";
import { ParameterNotInitializedError } from "@/errors/parameter-not-initialized";

export abstract class BaseMongooseSchema<T extends Model>
  extends BaseModelSchema<T>
  implements ModelMongooseSchema<T>
{
  static mutex = new Mutex();

  static modelCache: Record<string, mongoose.Model<Record<string, unknown>>> =
    {};

  public readonly mongooseSchema: mongoose.Schema;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private _MongooseModel?: mongoose.Model<T["data"]>;

  constructor(
    schema: z.ZodRawShape,
    mongooseSchema: mongoose.Schema | mongoose.SchemaDefinition,
  ) {
    super(schema);

    this.mongooseSchema = this.createDefaultSchema().add(mongooseSchema);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  get MongooseModel() {
    if (!this._MongooseModel) {
      throw new ParameterNotInitializedError("MongooseModel");
    }

    return this._MongooseModel;
  }

  async initialize(collectionName: string) {
    this._MongooseModel = (await this.ensureCacheModel(
      collectionName,
      this.mongooseSchema,
    )) as mongoose.Model<T["data"]>;
  }

  private createDefaultSchema() {
    return new mongoose.Schema({
      deleted: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
        required: true,
        index: true,
      },
      deletedAt: {
        type: mongoose.Schema.Types.Date,
        default: null,
        required: false,
      },
      createdAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
        required: true,
      },
      updatedAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
        required: true,
      },
    });
  }

  private async ensureCacheModel(
    collectionName: string,
    schema: mongoose.Schema,
  ) {
    return BaseMongooseSchema.mutex.runExclusive(async () => {
      if (!BaseMongooseSchema.modelCache[collectionName]) {
        BaseMongooseSchema.modelCache[collectionName] = mongoose.model(
          collectionName,
          schema,
        );
      }

      return BaseMongooseSchema.modelCache[collectionName];
    });
  }
}
