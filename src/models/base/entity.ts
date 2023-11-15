import { type Model } from "../interfaces/model";

export type EntityData = {
  _id: string;
  deleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type SpecificFieldsEntity<T> = Omit<T, keyof EntityData>;

export class Entity<T extends EntityData> implements Model {
  constructor(public readonly data: T) {}

  toString(): string {
    return JSON.stringify(this.data);
  }

  toObject(): T {
    return this.data;
  }
}
