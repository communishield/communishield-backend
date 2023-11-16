import { Entity, type EntityData } from "./base/entity";
import { BaseMongooseSchema } from "./base/base-mongoose-schema";
import { z } from "zod";
import { BaseModelFactory } from "./base/factory";

export type UserData = {
  username: string;
  password: string;
} & EntityData;

export class User extends Entity<UserData> {}

export class UserSchema extends BaseMongooseSchema<User> {
  constructor() {
    super(
      {
        username: z.string(),
        password: z.string(),
      },
      {
        username: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
      },
    );
  }
}

export class UserFactory extends BaseModelFactory<User> {
  constructor() {
    super(User, new UserSchema());
  }
}
