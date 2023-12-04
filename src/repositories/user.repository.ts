import { inject } from "inversify";
import { MikroOrmLoader } from "@/third-parties/mikro-orm/loader";
import { User } from "@/models/user.model";
import { EntityNotFoundError } from "@/errors/entity-not-found.error";
import { EntityAlreadyExistsError } from "@/errors/entity-already-exists.error";
import { bind } from "@/di/container";
import { ForeignKeyConstraintViolationException } from "@mikro-orm/core";
import { EntityIsUsedError } from "@/errors/entity-is-used.error";

@bind("UserRepository")
export class UserRepository {
  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {}

  /**
   * Creates a new user in the database.
   */
  async createUser({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<void> {
    const em = await this.mikroOrmLoader.load();

    const userExists = await em.getRepository(User).findOne({ username });
    if (userExists) {
      throw new EntityAlreadyExistsError("User");
    }

    const user = em.create(User, { username, password });
    await em.persistAndFlush(user);
  }

  /**
   * Retrieves a user by username.
   */
  async getUserByUsername(username: string): Promise<User> {
    const em = await this.mikroOrmLoader.load();

    const user = await em
      .getRepository(User)
      .findOne({ username }, { populate: ["groups"] });
    if (!user) {
      throw new EntityNotFoundError("User");
    }

    return user;
  }

  /**
   * Retrieves a list of all users.
   */
  async listAllUsers(): Promise<User[]> {
    const em = await this.mikroOrmLoader.load();

    return em.getRepository(User).findAll();
  }

  /**
   * Updates a user's information.
   */
  async updateUser(
    username: string,
    { password }: { password: string },
  ): Promise<void> {
    const em = await this.mikroOrmLoader.load();

    const user = await this.getUserByUsername(username);
    em.assign(user, { password });

    await em.persistAndFlush(user);
  }

  /**
   * Deletes a user by username.
   */
  async deleteUserByUsername(username: string): Promise<void> {
    const em = await this.mikroOrmLoader.load();

    const user = await this.getUserByUsername(username);
    try {
      await em.removeAndFlush(user);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintViolationException) {
        throw new EntityIsUsedError("User");
      }

      throw error;
    }
  }
}
