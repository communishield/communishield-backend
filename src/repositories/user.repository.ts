import { bind } from "@/di/container";
import { EntityNotFoundError } from "@/errors/entity-not-found.error";
import { User } from "@/models/user.model";
import { MikroOrmLoader } from "@/third-parties/mikro-orm/loader";
import { type MikroORM } from "@mikro-orm/core";
import { inject } from "inversify";

@bind("UserRepository")
export class UserRepository {
  private readonly em: Promise<MikroORM["em"]>;

  constructor(@inject("MikroOrmLoader") mikroOrmLoader: MikroOrmLoader) {
    this.em = mikroOrmLoader.load();
  }

  async findOneBy(where: Partial<User>): Promise<User> {
    const em = await this.em;

    const user = await em.findOne(User, where);

    if (!user) {
      throw new EntityNotFoundError("User");
    }

    return user;
  }

  async create(user: User): Promise<void> {
    const em = await this.em;

    await em.transactional(async (em) => {
      await em.persistAndFlush(user);
    });
  }
}
