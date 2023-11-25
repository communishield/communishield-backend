import { bind } from "@/di/container";
import { inject } from "inversify";
import { Group } from "@/models/group.model";
import { User } from "@/models/user.model";
import { MikroOrmLoader } from "@/third-parties/mikro-orm/loader";
import { FileDescriptor } from "@/models/file-descriptor.model";
import { EntityNotFoundError } from "@/errors/entity-not-found.error";
import { GroupUsedInFd } from "@/errors/group-used-in-fd";
import {
  type RemoveUserFromGroupDto,
  type AddUserToGroupDto,
  type CreateGroupDto,
  type DeleteGroupDto,
  type GetGroupDto,
  type ListGroupsDto,
} from "./types/groups.dto";

@bind("GroupsService")
export class GroupsService {
  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {}

  // eslint-disable-next-line no-empty-pattern
  async listGroups({}: ListGroupsDto): Promise<Group[]> {
    const em = await this.em;
    return em.find(Group, {});
  }

  async getGroup({ name }: GetGroupDto): Promise<Group> {
    const em = await this.em;
    const group = await em.findOne(Group, { name }, { populate: ["users"] });

    if (!group) {
      throw new EntityNotFoundError("Group");
    }

    return group;
  }

  async createGroup({ name }: CreateGroupDto): Promise<Group> {
    const em = await this.em;
    const group = new Group();
    group.name = name;

    await em.persistAndFlush(group);
    return group;
  }

  async addUserToGroup({
    groupName,
    username,
  }: AddUserToGroupDto): Promise<void> {
    const em = await this.em;
    const group = await em.findOne(Group, { name: groupName });

    if (!group) {
      throw new EntityNotFoundError("Group");
    }

    const user = await em.findOne(User, { username });

    if (!user) {
      throw new EntityNotFoundError("User");
    }

    group.users.add(user);
    await em.persistAndFlush(group);
  }

  async removeUserFromGroup({
    groupName,
    username,
  }: RemoveUserFromGroupDto): Promise<void> {
    const em = await this.em;
    const group = await em.findOne(
      Group,
      { name: groupName },
      { populate: ["users"] },
    );

    if (!group) {
      throw new EntityNotFoundError("Group");
    }

    const user = group.users.getItems().find((u) => u.username === username);

    if (!user) {
      throw new EntityNotFoundError("User");
    }

    group.users.remove(user);
    await em.persistAndFlush(group);
  }

  async deleteGroup({ name }: DeleteGroupDto): Promise<void> {
    const em = await this.em;

    const group = await em.findOne(Group, { name });

    if (!group) {
      throw new EntityNotFoundError("Group");
    }

    const isGroupUsedInFileDescriptors =
      (await em.count(FileDescriptor, {
        group,
      })) > 0;

    if (isGroupUsedInFileDescriptors) {
      throw new GroupUsedInFd();
    }

    await em.removeAndFlush(group);
  }

  private get em() {
    return this.mikroOrmLoader.load();
  }
}
