import { inject } from "inversify";
import { MikroOrmLoader } from "@/third-parties/mikro-orm/loader";
import {
  ForeignKeyConstraintViolationException,
  type EntityManager,
} from "@mikro-orm/core";
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
import { FileDescriptorRepository } from "./file-descriptor.repository";

@bind("DirectoryRepository")
export class DirectoryRepository {
  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
    @inject("FileDescriptorRepository")
    private readonly fileDescriptorRepository: FileDescriptorRepository,
  ) { }

  /**
   * Creates a new directory in the database with the specified parameters.
   */
  async createDirectory({
    path,
    owner,
    group,
    permissions,
  }: {
    path: string[];
    owner: string;
    group: string;
    permissions: Permission;
  }): Promise<void> {
    const em = await this.mikroOrmLoader.load();

    await em.transactional(async (em: EntityManager) => {
      const directoryname = path.at(-1)!;
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

      const directoryDescriptor = em.create(FileDescriptor, {
        name: directoryname,
        parentDirectory: parentDirRef,
        owner: ownerRef,
        group: groupRef,
        permissions,
      });

      const directory = em.create(Directory, {
        descriptor: directoryDescriptor,
      });

      try {
        await em.persistAndFlush(directory);
      } catch (error) {
        if (error instanceof UniqueConstraintViolationException) {
          throw new EntityAlreadyExistsError("Directory");
        }

        throw error;
      }
    });
  }

  /**
   * Finds a directory by its path.
   */
  async findDirectoryByPath(path: string[]): Promise<Directory> {
    const em = await this.mikroOrmLoader.load();
    const fd = await this.fileDescriptorRepository
      .findFileDescriptorByPath(path)
      .catch(() => {
        throw new EntityNotFoundError("Directory");
      });

    if (!fd.directory) {
      throw new EntityNotFoundError("Directory");
    }

    await em.populate(fd, [
      "directory.contents",
      "directory.contents.owner",
      "directory.contents.group",
    ]);

    return fd.directory;
  }

  /**
   * Updates a directory in the database.
   */
  async updateDirectory({
    path,
    owner,
    group,
    permissions,
  }: {
    path: string[];
    owner: string;
    group: string;
    permissions: Permission;
  }): Promise<void> {
    const em = await this.mikroOrmLoader.load();

    await em.transactional(async (em: EntityManager) => {
      const directory = await this.findDirectoryByPath(path);

      if (owner !== directory.descriptor.owner.username) {
        const ownerRef = await em
          .getRepository(User)
          .findOne({ username: owner });

        if (!ownerRef) {
          throw new EntityNotFoundError("User");
        }

        directory.descriptor.owner = ownerRef;
      }

      if (group !== directory.descriptor.group.name) {
        const groupRef = await em.getRepository(Group).findOne({ name: group });

        if (!groupRef) {
          throw new EntityNotFoundError("Group");
        }

        directory.descriptor.group = groupRef;
      }

      directory.descriptor.permissions = permissions;

      await em.persistAndFlush(directory);
    });
  }

  /**
   * Deletes a directory from the database.
   */
  async deleteDirectoryByPath(path: string[]): Promise<void> {
    const em = await this.mikroOrmLoader.load();

    const directory = await this.findDirectoryByPath(path);
    try {
      await em.removeAndFlush(directory);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintViolationException) {
        throw new EntityIsUsedError("Directory");
      }

      throw error;
    }
  }

  // TODO: Improve database queries
  /**
   * Retrieves the full path of a given directory.
   */
  async getDirectoryPath(directory: Directory): Promise<string[]> {
    const em = await this.mikroOrmLoader.load();

    let currentDescriptor: FileDescriptor | undefined = directory.descriptor;
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
