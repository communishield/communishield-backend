import mongoose from "mongoose";
import bcrypt from "bcrypt";
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
  static mongooseSchema() {
    const schema = new mongoose.Schema({
      username: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
    });

    schema.pre("save", async function (next) {
      if (!this.isModified("password")) {
        next();
        return;
      }

      this.password = await bcrypt.hash(this.password, 10);
      next();
    });

    return schema;
  }

  constructor() {
    super(
      {
        username: z.string(),
        password: z.string(),
      },
      UserSchema.mongooseSchema(),
    );
  }
}

export class UserFactory extends BaseModelFactory<User> {
  constructor() {
    super(User, new UserSchema());
  }
}
