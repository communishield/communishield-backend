import { bind } from "@/di/container";
import { type Group } from "@/models/group.model";
import { BaseRepository } from "./base.repository";

@bind("GroupRepository")
export class GroupRepository extends BaseRepository<Group> {}
