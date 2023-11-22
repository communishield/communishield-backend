export type Repository<T extends Record<string, unknown>> = {
  create(data: T): Promise<void>;
  findOneBy(query: Partial<T>): Promise<T>;
  findBy(query: Partial<T>): Promise<T[]>;
  updateOneBy(query: Partial<T>, data: T): Promise<void>;
  updateBy(query: Partial<T>, data: T): Promise<void>;
  deleteOneBy(query: Partial<T>): Promise<void>;
};
