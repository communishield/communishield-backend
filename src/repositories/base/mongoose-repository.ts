import { type Model } from "@/models/interfaces/model";
import { type Repository } from "../interfaces/repository";
import { type SpecificFieldsEntity } from "@/models/base/entity";
import { type ModelFactory } from "@/models/interfaces/model-factory";
import { type ModelMongooseSchema } from "@/models/interfaces/model-mongoose-schema";
import mongoose from "mongoose";
import { NotFoundError } from "@/errors/not-found";

/*
Export type Repository<
  M extends Model,
  ModelData extends Model["data"] = M["data"],
> = {
  create(data: ModelData): Promise<M>;
  createBulk(data: ModelData[]): Promise<M[]>;
  list(options: ListOptions): Promise<M[]>;
  searchBy(query: Partial<ModelData>, options: ListOptions): Promise<M[]>;
  updateBy(query: Partial<ModelData>, data: Partial<ModelData>): Promise<M[]>;
  softDeleteBy(query: Partial<ModelData>): Promise<void>;
  hardDeleteBy(query: Partial<ModelData>): Promise<void>;
  restoreBy(query: Partial<ModelData>): Promise<void>;
  touchBy(query: Partial<ModelData>): Promise<void>;
};
*/

export class BaseMongooseRepository<T extends Model>
  implements Repository<T, T["data"]>
{
  static mongooseObjectToObject(data: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => {
        if (v instanceof mongoose.Types.ObjectId) {
          return [k, v.toString()];
        }

        return [k, v];
      }),
    );
  }

  static objectToMongooseObject(data: Record<string, unknown>) {
    const entity = { ...data };
    const id = data._id;

    if (id && typeof id === "string") {
      entity._id = new mongoose.Types.ObjectId(id);
    }

    return entity;
  }

  constructor(
    private readonly collectionName: string,
    private readonly schema: ModelMongooseSchema<T>,
    private readonly factory: ModelFactory<T>,
  ) {}

  async initialize() {
    await this.schema.initialize(this.collectionName);
    return this;
  }

  async create(data: SpecificFieldsEntity<T["data"]>) {
    const entity = this.factory.create(data);
    delete entity.data._id;

    const document = new this.schema.MongooseModel(entity.toObject());

    const result = await document.save();

    return this.factory.create(
      BaseMongooseRepository.mongooseObjectToObject(
        result.toObject({ flattenMaps: true }),
      ),
    );
  }

  async fetchBy(query: Partial<T["data"]>) {
    const parsedQuery = BaseMongooseRepository.objectToMongooseObject(
      query,
    ) as Partial<T["data"]>;

    const document =
      await this.schema.MongooseModel.findOne(parsedQuery).exec();

    if (!document) {
      throw new NotFoundError(this.collectionName);
    }

    return this.factory.create(
      BaseMongooseRepository.mongooseObjectToObject(
        document.toObject({ flattenMaps: true }),
      ),
    );
  }
}
