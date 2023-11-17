import { type Group, GroupFactory, GroupSchema } from "@/models/group";
import { BaseMongooseRepository } from "./base/mongoose-repository";

export class GroupRepository extends BaseMongooseRepository<Group> {
  constructor() {
    super("Group", new GroupSchema(), new GroupFactory());
  }
}
