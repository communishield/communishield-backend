import { EntityNotFoundError } from "@/errors/entity-not-found.error";
import { type Repository } from "@/types/repository";
import { injectable, unmanaged } from "inversify";

@injectable()
export class BaseRepository<T extends Record<string, unknown>>
  implements Repository<T>
{
  private readonly mockDb: T[] = [];

  constructor(@unmanaged() private readonly entityName: string) {}

  async create(data: T): Promise<void> {
    this.mockDb.push(data);
  }

  async findOneBy(query: Partial<T>): Promise<T> {
    const entity = this.mockDb.find((entity) =>
      Object.entries(query).every(([key, value]) => entity[key] === value),
    );

    if (!entity) {
      throw new EntityNotFoundError(this.entityName);
    }

    return entity;
  }

  async findBy(query: Partial<T>): Promise<T[]> {
    return this.mockDb.filter((entity) =>
      Object.entries(query).every(([key, value]) => entity[key] === value),
    );
  }

  async updateOneBy(query: Partial<T>, data: T): Promise<void> {
    const entityIndex = this.mockDb.findIndex((entity) =>
      Object.entries(query).every(([key, value]) => entity[key] === value),
    );

    if (entityIndex === -1) {
      throw new EntityNotFoundError(this.entityName);
    }

    this.mockDb[entityIndex] = data;
  }

  async updateBy(query: Partial<T>, data: T): Promise<void> {
    this.mockDb.forEach((entity, index) => {
      if (
        Object.entries(query).every(([key, value]) => entity[key] === value)
      ) {
        this.mockDb[index] = data;
      }
    });
  }

  async deleteOneBy(query: Partial<T>): Promise<void> {
    const entityIndex = this.mockDb.findIndex((entity) =>
      Object.entries(query).every(([key, value]) => entity[key] === value),
    );

    if (entityIndex === -1) {
      throw new EntityNotFoundError(this.entityName);
    }

    this.mockDb.splice(entityIndex, 1);
  }

  async deleteBy(query: Partial<T>): Promise<void> {
    this.mockDb.forEach((entity, index) => {
      if (
        Object.entries(query).every(([key, value]) => entity[key] === value)
      ) {
        this.mockDb.splice(index, 1);
      }
    });
  }
}
