import { inject } from "inversify";
import { MikroOrmLoader } from "@/third-parties/mikro-orm/loader";
import { FileDescriptor } from "@/models/file-descriptor.model";
import { EntityNotFoundError } from "@/errors/entity-not-found.error";
import { bind } from "@/di/container";

@bind("FileDescriptorRepository")
export class FileDescriptorRepository {
  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {}

  /**
   * Finds a file descriptor by its path.
   */
  async findFileDescriptorByPath(path: string[]): Promise<FileDescriptor> {
    const em = await this.mikroOrmLoader.load();

    const name = path.at(-1);
    const parentPath = path.slice(0, -1);

    const fd = await em.getRepository(FileDescriptor).findOne(
      {
        name,
        parentDirectory: parentPath.reduce<Record<string, unknown>>(
          (acc, part) => ({
            descriptor: { name: part, parentDirectory: acc },
          }),
          { descriptor: { name: "root", parentDirectory: null } },
        ),
      },
      { populate: ["owner", "group", "file", "directory"] },
    );

    if (!fd) {
      throw new EntityNotFoundError("File Descriptor");
    }

    return fd;
  }

  // TODO: Improve database queries
  /**
   * Retrieves the full path of a given file.
   */
  async getFileDescriptorPath(fd: FileDescriptor): Promise<string[]> {
    const em = await this.mikroOrmLoader.load();

    let currentDescriptor: FileDescriptor | undefined = fd;
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
