import { inject } from "inversify";
import { bind } from "@/di/container";
import { type User } from "@/models/user.model";
import { UserRepository } from "@/repositories/user.repository";
import { type UserDto } from "./types/user.dto";
import { HashUtils } from "@/utils/hash";

@bind("UserService")
export class UserService {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
    @inject("HashUtils") private readonly hashUtils: HashUtils,
  ) {}

  /**
   * Creates a new user.
   */
  async createUser({
    username,
    password,
  }: Omit<UserDto, "groups">): Promise<void> {
    const hashedPassword = await this.hashUtils.hash(password);

    await this.userRepository.createUser({
      username,
      password: hashedPassword,
    });
  }

  /**
   * Gets a list of all users.
   */
  async listUsers(): Promise<Array<Omit<UserDto, "password" | "groups">>> {
    const users = await this.userRepository.listAllUsers();

    return users.map((user) => this.mapUserToDto(user));
  }

  /**
   * Retrieves a specific user by username.
   */
  async getUser(username: string): Promise<UserDto> {
    const user = await this.userRepository.getUserByUsername(username);

    return this.mapUserToDto(user) as UserDto;
  }

  /**
   * Deletes a user by username.
   */
  async deleteUser(username: string): Promise<void> {
    await this.userRepository.deleteUserByUsername(username);
  }

  /**
   * Updates a user's password.
   */
  async updateUserPassword(
    username: string,
    newPassword: string,
  ): Promise<void> {
    const hashedPassword = await this.hashUtils.hash(newPassword);

    await this.userRepository.updateUser(username, {
      password: hashedPassword,
    });
  }

  private mapUserToDto(
    user: User,
  ): Omit<UserDto, "password"> | Omit<UserDto, "password" | "groups"> {
    if (user.groups.isInitialized()) {
      return {
        username: user.username,
        groups: user.groups.getItems().map((group) => group.name),
      };
    }

    return {
      username: user.username,
    };
  }
}
