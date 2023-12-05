import { inject } from "inversify";
import { UserRepository } from "@/repositories/user.repository";
import { Logger } from "@/types/logger";
import { bind } from "@/di/container";
import { FileDescriptorRepository } from "@/repositories/file-descriptor.repository";

@bind("AuthorizationService")
export class AuthorizationService {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
    @inject("FileDescriptorRepository")
    private readonly fileDescriptorRepository: FileDescriptorRepository,
    @inject("Logger") private readonly logger: Logger,
  ) {
    this.logger.debug("AuthorizationService initialized");
  }

  /**
   * Checks if a user has read and write permissions on a given resource.
   */
  async checkPermissions(
    username: string,
    resourcePath: string[],
  ): Promise<{ read: boolean; write: boolean }> {
    this.logger.info(
      `Checking permissions for user: ${username} on resource: /${resourcePath.join(
        "/",
      )}`,
    );

    const user = await this.userRepository.getUserByUsername(username);
    if (user.id === 0) {
      this.logger.info(
        `Root user bypassing permissions check for /${resourcePath.join("/")}`,
      );
      return { read: true, write: true };
    }

    const fd =
      await this.fileDescriptorRepository.findFileDescriptorByPath(
        resourcePath,
      );

    const fdPermissions = fd.permissions.asObject();
    const permissions = { read: false, write: false };

    if (fd.owner.id === user.id) {
      this.logger.debug(
        `User ${username} owns the resource /${resourcePath.join("/")}`,
      );
      permissions.read ||= fdPermissions.owner.read;
      permissions.write ||= fdPermissions.owner.write;
    }

    if (user.groups.getItems().some((group) => group.id === fd.group.id)) {
      this.logger.debug(`User ${username} belongs to group ${fd.group.name}`);
      permissions.read ||= fdPermissions.group.read;
      permissions.write ||= fdPermissions.group.write;
    }

    permissions.read ||= fdPermissions.other.read;
    permissions.write ||= fdPermissions.other.write;

    this.logger.info(
      `User ${username} has${
        permissions.read ? "" : " not"
      } read permissions on /${resourcePath.join("/")} ` +
        `| User ${username} has${
          permissions.write ? "" : " not"
        } write permissions on /${resourcePath.join("/")}`,
    );

    return permissions;
  }

  /**
   * Checks if a user belongs to a group.
   */
  async checkGroupMembership(
    username: string,
    groupName: string,
  ): Promise<boolean> {
    const user = await this.userRepository.getUserByUsername(username);

    if (user.id === 0) {
      this.logger.info(
        `Root user bypassing group membership check for group ${groupName}`,
      );
      return true;
    }

    return user.groups.getItems().some((group) => group.name === groupName);
  }
}
