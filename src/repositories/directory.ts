import {
  type Directory,
  DirectoryFactory,
  DirectorySchema,
} from "@/models/directory";
import { BaseMongooseRepository } from "./base/mongoose-repository";

export class DirectoryRepository extends BaseMongooseRepository<Directory> {
  constructor() {
    super("Directory", new DirectorySchema(), new DirectoryFactory());
  }
}
