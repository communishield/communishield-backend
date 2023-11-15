import { type SpecificFieldsEntity } from "@/models/base/entity";
import { type Model } from "@/models/interfaces/model";

export type ListOptions = {
  query?: Record<string, unknown>;
  limit?: number;
  page?: number;
  sort?: Record<string, unknown>;
  showDeleted?: boolean;
};

export type Repository<
  M extends Model,
  ModelData extends Model["data"] = M["data"],
> = {
  initialize(): Promise<ThisType<Repository<M, ModelData>>>;
  create(data: SpecificFieldsEntity<ModelData>): Promise<M>;
  //  CreateBulk(data: ModelData[]): Promise<M[]>;
  //  list(options: ListOptions): Promise<M[]>;
  fetchBy(query: Partial<ModelData>): Promise<M>;
  //  UpdateBy(query: Partial<ModelData>, data: Partial<ModelData>): Promise<M[]>;
  //  softDeleteBy(query: Partial<ModelData>): Promise<void>;
  //  hardDeleteBy(query: Partial<ModelData>): Promise<void>;
  //  restoreBy(query: Partial<ModelData>): Promise<void>;
  //  touchBy(query: Partial<ModelData>): Promise<void>;
};
