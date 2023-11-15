import mongoose from "mongoose";
import { Entity, type EntityData } from "./base/entity";
import { BaseMongooseSchema } from "./base/base-mongoose-schema";
import { z } from "zod";
import { BaseModelFactory } from "./base/factory";
import { hashPassword } from "@/third-parties/bcrypt/hasher";

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

      this.password = await hashPassword(this.password);
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