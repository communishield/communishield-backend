import { inject } from "inversify";
import { MikroOrmLoader } from "@/third-parties/mikro-orm/loader";
import { Group } from "@/models/group.model";
import { EntityAlreadyExistsError } from "@/errors/entity-already-exists.error";
import { EntityNotFoundError } from "@/errors/entity-not-found.error";
import { bind } from "@/di/container";
import { ForeignKeyConstraintViolationException } from "@mikro-orm/core";
import { EntityIsUsedError } from "@/errors/entity-is-used.error";

@bind("GroupRepository")
export class GroupRepository {
  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {}

  /**
   * Creates a new group in the database.
   */
  async createGroup({ name }: { name: string }): Promise<void> {
    const em = await this.mikroOrmLoader.load();

    const groupExists = await em.getRepository(Group).findOne({ name });
    if (groupExists) {
      throw new EntityAlreadyExistsError("Group");
    }

    const group = em.create(Group, { name });
    await em.persistAndFlush(group);
  }

  /**
   * Lists all groups in the database.
   */
  async listAllGroups(): Promise<Group[]> {
    const em = await this.mikroOrmLoader.load();
    return em.getRepository(Group).findAll();
  }

  /**
   * Retrieves a specific group by name.
   */
  async getGroupByName(name: string): Promise<Group> {
    const em = await this.mikroOrmLoader.load();

    const group = await em
      .getRepository(Group)
      .findOne({ name }, { populate: ["users"] });
    if (!group) {
      throw new EntityNotFoundError("Group");
    }

    return group;
  }

  /**
   * Updates a group by name.
   */
  async updateGroup(group: Group) {
    const em = await this.mikroOrmLoader.load();

    await em.persistAndFlush(group);
  }

  /**
   * Deletes a group by name.
   */
  async deleteGroupByName(name: string): Promise<void> {
    const em = await this.mikroOrmLoader.load();

    const group = await this.getGroupByName(name);
    try {
      await em.removeAndFlush(group);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintViolationException) {
        throw new EntityIsUsedError("Group");
      }

      throw error;
    }
  }
}
