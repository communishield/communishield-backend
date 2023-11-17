import { Entity, type EntityData } from "./base/entity";
import { BaseMongooseSchema } from "./base/base-mongoose-schema";
import { z } from "zod";
import { BaseModelFactory } from "./base/factory";
import mongoose from "mongoose";

export type UserData = {
  email: string;
  login: string;
  password: string;
  _groupsId: string[];
} & EntityData;

export class User extends Entity<UserData> {}

export class UserSchema extends BaseMongooseSchema<User> {
  constructor() {
    super(
      {
        email: z.string().email(),
        login: z.string(),
        password: z.string(),
        _groupsId: z.array(z.string()),
      },
      {
        email: {
          type: String,
          required: true,
          unique: true,
        },
        login: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
        _groupsId: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Group",
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
