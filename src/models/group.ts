import { z } from "zod";
import { Entity, type EntityData } from "./base/entity";
import { BaseMongooseSchema } from "./base/base-mongoose-schema";
import { BaseModelFactory } from "./base/factory";

export type GroupData = {
  name: string;
  _membersId: string[];
} & EntityData;

export class Group extends Entity<GroupData> {}

export class GroupSchema extends BaseMongooseSchema<Group> {
  constructor() {
    super(
      {
        name: z.string(),
      },
      {
        name: {
          type: String,
          required: true,
          unique: true,
        },
      },
    );
  }
}

export class GroupFactory extends BaseModelFactory<Group> {
  constructor() {
    super(Group, new GroupSchema());
  }
}
