import { bind } from "@/di/container";
import { type User } from "@/models/user.model";
import { BaseRepository } from "./base.repository";

@bind("UserRepository")
export class UserRepository extends BaseRepository<User> {}
