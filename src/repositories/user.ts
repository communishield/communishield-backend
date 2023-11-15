import { type User, UserFactory, UserSchema } from "@/models/user";
import { BaseMongooseRepository } from "./base/mongoose-repository";

export class UserRepository extends BaseMongooseRepository<User> {
  constructor() {
    super("users", new UserSchema(), new UserFactory());
  }
}
