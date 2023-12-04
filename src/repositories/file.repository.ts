import { inject } from "inversify";
import { MikroOrmLoader } from "@/third-parties/mikro-orm/loader";
import {
  ForeignKeyConstraintViolationException,
  type EntityManager,
} from "@mikro-orm/core";
import { File } from "@/models/file.model";
import { FileDescriptor } from "@/models/file-descriptor.model";
import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { User } from "@/models/user.model";
import { Group } from "@/models/group.model";
import { type Permission } from "@/models/permission.model";
import { Directory } from "@/models/directory.model";
import { EntityAlreadyExistsError } from "@/errors/entity-already-exists.error";
import { EntityNotFoundError } from "@/errors/entity-not-found.error";
import { bind } from "@/di/container";
import { EntityIsUsedError } from "@/errors/entity-is-used.error";

@bind("FileRepository")
export class FileRepository {
  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {}

  /**
   * Creates a new file in the database with the specified parameters.
   */
  async createFile({
    path,
    data,
    owner,
    group,
    permissions,
  }: {
    path: string[];
    data: Record<string, any>;
    owner: string;
    group: string;
    permissions: Permission;
  }): Promise<void> {
    const em = await this.mikroOrmLoader.load();

    await em.transactional(async (em: EntityManager) => {
      const filename = path.at(-1)!;
      const ownerRef = await em
        .getRepository(User)
        .findOne({ username: owner });
      const groupRef = await em.getRepository(Group).findOne({ name: group });
      const parentDirRef = await em.getRepository(Directory).findOne(
        path.slice(0, -1).reduce<Record<string, unknown>>(
          (acc, part) => ({
            descriptor: { name: part, parentDirectory: acc },
          }),
          { descriptor: { name: "root", parentDirectory: null } },
        ),
      );

      if (!ownerRef) {
        throw new EntityNotFoundError("User");
      } else if (!groupRef) {
        throw new EntityNotFoundError("Group");
      } else if (!parentDirRef) {
        throw new EntityNotFoundError("Directory");
      }

      const fileDescriptor = em.create(FileDescriptor, {
        name: filename,
        parentDirectory: parentDirRef,
        owner: ownerRef,
        group: groupRef,
        permissions,
      });

      const file = em.create(File, {
        descriptor: fileDescriptor,
        data,
      });

      try {
        await em.persistAndFlush(file);
      } catch (error) {
        if (error instanceof UniqueConstraintViolationException) {
          throw new EntityAlreadyExistsError("File");
        }

        throw error;
      }
    });
  }

  /**
   * Finds a file by its path.
   */
  async findFileByPath(path: string[]): Promise<File> {
    const em = await this.mikroOrmLoader.load();

    const filename = path.at(-1);
    const parentPath = path.slice(0, -1);

    const file = await em.getRepository(File).findOne(
      {
        descriptor: {
          name: filename,
          parentDirectory: parentPath.reduce<Record<string, unknown>>(
            (acc, part) => ({
              descriptor: { name: part, parentDirectory: acc },
            }),
            { descriptor: { name: "root", parentDirectory: null } },
          ),
        },
      },
      { populate: ["descriptor.owner", "descriptor.group"] },
    );

    if (!file) {
      throw new EntityNotFoundError("File");
    }

    return file;
  }

  /**
   * Updates a file in the database.
   */
  async updateFile({
    path,
    data,
    owner,
    group,
    permissions,
  }: {
    path: string[];
    data: Record<string, any>;
    owner: string;
    group: string;
    permissions: Permission;
  }): Promise<void> {
    const em = await this.mikroOrmLoader.load();

    await em.transactional(async (em: EntityManager) => {
      const file = await this.findFileByPath(path);

      file.data = data;

      if (owner !== file.descriptor.owner.username) {
        const ownerRef = await em
          .getRepository(User)
          .findOne({ username: owner });

        if (!ownerRef) {
          throw new EntityNotFoundError("User");
        }

        file.descriptor.owner = ownerRef;
      }

      if (group !== file.descriptor.group.name) {
        const groupRef = await em.getRepository(Group).findOne({ name: group });

        if (!groupRef) {
          throw new EntityNotFoundError("Group");
        }

        file.descriptor.group = groupRef;
      }

      file.descriptor.permissions = permissions;

      await em.persistAndFlush(file);
    });
  }

  /**
   * Deletes a file from the database.
   */
  async deleteFileByPath(path: string[]): Promise<void> {
    const em = await this.mikroOrmLoader.load();

    const file = await this.findFileByPath(path);
    try {
      await em.removeAndFlush(file);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintViolationException) {
        throw new EntityIsUsedError("File");
      }

      throw error;
    }
  }

  // TODO: Improve database queries
  /**
   * Retrieves the full path of a given file.
   */
  async getFilePath(file: File): Promise<string[]> {
    const em = await this.mikroOrmLoader.load();

    let currentDescriptor: FileDescriptor | undefined = file.descriptor;
    const pathComponents: string[] = [];

    while (currentDescriptor && currentDescriptor.name !== "root") {
      pathComponents.unshift(currentDescriptor.name);

      if (!currentDescriptor.parentDirectory) {
        break;
      }

      /* eslint-disable no-await-in-loop */
      await em.populate(currentDescriptor, ["parentDirectory"]);
      currentDescriptor =
        (await em
          .getRepository(FileDescriptor)
          .findOne(currentDescriptor.parentDirectory.id, {
            populate: ["parentDirectory"],
          })) ?? undefined;
      /* eslint-enable no-await-in-loop */
    }

    return pathComponents;
  }
}
