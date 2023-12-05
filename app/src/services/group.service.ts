import { inject } from "inversify";
import { GroupRepository } from "@/repositories/group.repository";
import { bind } from "@/di/container";
import { type Group } from "@/models/group.model";
import { UserRepository } from "@/repositories/user.repository";
import { type GroupDto } from "./types/group.dto";
import { UserAlreadyInGroupError } from "@/errors/user-already-in-group.error";
import { UserNotInGroupError } from "@/errors/user-not-in-group.error";

@bind("GroupService")
export class GroupService {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
    @inject("GroupRepository")
    private readonly groupRepository: GroupRepository,
  ) {}

  /**
   * Creates a new group.
   */
  async createGroup({ name }: Omit<GroupDto, "users">): Promise<void> {
    await this.groupRepository.createGroup({ name });
  }

  /**
   * Gets a list of all groups.
   */
  async listGroups(): Promise<Array<Omit<GroupDto, "users">>> {
    const groups = await this.groupRepository.listAllGroups();

    return groups.map((group) => this.mapGroupToDto(group));
  }

  /**
   * Retrieves a specific group by name.
   */
  async getGroup(name: string): Promise<GroupDto> {
    const group = await this.groupRepository.getGroupByName(name);

    return this.mapGroupToDto(group) as GroupDto;
  }

  /**
   * Deletes a group by name.
   */
  async deleteGroup(name: string): Promise<void> {
    await this.groupRepository.deleteGroupByName(name);
  }

  /**
   * Adds a user to a group.
   */
  async addUserToGroup(groupName: string, username: string): Promise<void> {
    const group = await this.groupRepository.getGroupByName(groupName);
    if (
      group.users.getItems().findIndex((user) => user.username === username) !==
      -1
    ) {
      throw new UserAlreadyInGroupError();
    }

    const user = await this.userRepository.getUserByUsername(username);

    group.users.add(user);
    await this.groupRepository.updateGroup(group);
  }

  /**
   * Removes a user from a group.
   */
  async removeUserFromGroup(
    groupName: string,
    username: string,
  ): Promise<void> {
    const group = await this.groupRepository.getGroupByName(groupName);
    const user = group.users
      .getItems()
      .find((user) => user.username === username);
    if (!user) {
      throw new UserNotInGroupError();
    }

    group.users.remove(user);

    await this.groupRepository.updateGroup(group);
  }

  private mapGroupToDto(group: Group): GroupDto | Omit<GroupDto, "users"> {
    if (group.users.isInitialized()) {
      return {
        name: group.name,
        users: group.users.getItems().map((u) => u.username),
      };
    }

    return {
      name: group.name,
    };
  }
}
