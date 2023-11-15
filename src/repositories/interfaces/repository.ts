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
  initialize(): Promise<Repository<M, ModelData>>;
  create(data: ModelData): Promise<M>;
  //  CreateBulk(data: ModelData[]): Promise<M[]>;
  //  list(options: ListOptions): Promise<M[]>;
  //  searchBy(query: Partial<ModelData>, options: ListOptions): Promise<M[]>;
  //  updateBy(query: Partial<ModelData>, data: Partial<ModelData>): Promise<M[]>;
  //  softDeleteBy(query: Partial<ModelData>): Promise<void>;
  //  hardDeleteBy(query: Partial<ModelData>): Promise<void>;
  //  restoreBy(query: Partial<ModelData>): Promise<void>;
  //  touchBy(query: Partial<ModelData>): Promise<void>;
};
