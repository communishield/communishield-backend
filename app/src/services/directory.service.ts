import { inject } from "inversify";
import { DirectoryRepository } from "@/repositories/directory.repository";
import { type Directory } from "@/models/directory.model";
import { bind } from "@/di/container";
import { type DirectoryDto } from "./types/directory";

@bind("DirectoryService")
export class DirectoryService {
  constructor(
    @inject("DirectoryRepository")
    private readonly directoryRepository: DirectoryRepository,
  ) { }

  /**
   * Creates a new directory.
   * @param {Object} params - Parameters for creating a directory.
   * @returns {Promise<void>}
   */
  async createDirectory({
    path,
    owner,
    group,
    permissions,
  }: Omit<DirectoryDto, "contents">): Promise<void> {
    await this.directoryRepository.createDirectory({
      path,
      owner,
      group,
      permissions,
    });
  }

  /**
   * Retrieves a directory by its path.
   * @param {string[]} path - The path of the directory to retrieve.
   * @returns {Promise<Directory>}
   */
  async getDirectoryByPath(path: string[]): Promise<DirectoryDto> {
    const directory = this.directoryRepository.findDirectoryByPath(path);

    return this.mapDirectoryToDto(await directory);
  }

  /*
   * @param {Object} params - Parameters for creating a directory.
   * @returns {Promise<void>}
   */
  async updateDirectory({
    path,
    owner,
    group,
    permissions,
  }: Omit<DirectoryDto, "contents">): Promise<void> {
    await this.directoryRepository.updateDirectory({
      path,
      owner,
      group,
      permissions,
    });
  }

  /**
   * Deletes a directory by its path.
   * @param {string[]} path - The path of the directory to delete.
   * @returns {Promise<void>}
   */
  async deleteDirectoryByPath(path: string[]): Promise<void> {
    await this.directoryRepository.deleteDirectoryByPath(path);
  }

  private async mapDirectoryToDto(directory: Directory): Promise<DirectoryDto> {
    const path = await this.directoryRepository.getDirectoryPath(directory);
    const contents = directory.contents.map((fd) => ({
      name: fd.name,
      type: fd.file ? ("file" as const) : ("directory" as const),
      owner: fd.owner.username,
      group: fd.group.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      permissions: fd.permissions.asObject() as any,
    }));

    return {
      path,
      contents,
      owner: directory.descriptor.owner.username,
      group: directory.descriptor.group.name,
      permissions: directory.descriptor.permissions,
    };
  }
}
