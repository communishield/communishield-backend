import { inject } from "inversify";
import { FileRepository } from "@/repositories/file.repository";
import { type File } from "@/models/file.model";
import { bind } from "@/di/container";
import { type FileDto } from "./types/file";

@bind("FileService")
export class FileService {
  constructor(
    @inject("FileRepository") private readonly fileRepository: FileRepository,
  ) {}

  /**
   * Creates a new file.
   * @param {Object} params - Parameters for creating a file.
   * @returns {Promise<void>}
   */
  async createFile({
    path,
    data,
    owner,
    group,
    permissions,
  }: FileDto): Promise<void> {
    await this.fileRepository.createFile({
      path,
      data,
      owner,
      group,
      permissions,
    });
  }

  /**
   * Retrieves a file by its path.
   * @param {string[]} path - The path of the file to retrieve.
   * @returns {Promise<File>}
   */
  async getFileByPath(path: string[]): Promise<FileDto> {
    const file = this.fileRepository.findFileByPath(path);

    return this.mapFileToDto(await file);
  }

  /*
   * @param {Object} params - Parameters for creating a file.
   * @returns {Promise<void>}
   */
  async updateFile({
    path,
    data,
    owner,
    group,
    permissions,
  }: FileDto): Promise<void> {
    await this.fileRepository.updateFile({
      path,
      data,
      owner,
      group,
      permissions,
    });
  }

  /**
   * Deletes a file by its path.
   * @param {string[]} path - The path of the file to delete.
   * @returns {Promise<void>}
   */
  async deleteFileByPath(path: string[]): Promise<void> {
    await this.fileRepository.deleteFileByPath(path);
  }

  private async mapFileToDto(file: File): Promise<FileDto> {
    const path = await this.fileRepository.getFilePath(file);

    return {
      path,
      data: file.data,
      owner: file.descriptor.owner.username,
      group: file.descriptor.group.name,
      permissions: file.descriptor.permissions,
    };
  }
}
