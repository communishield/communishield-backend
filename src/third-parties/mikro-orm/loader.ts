import { type Config } from "@/config/schemas";
import { bind } from "@/di/container";
import { Directory } from "@/models/directory.model";
import { FileDescriptor } from "@/models/file-descriptor.model";
import { File } from "@/models/file.model";
import { Group } from "@/models/group.model";
import { User } from "@/models/user.model";
import { type Loader } from "@/types/loader";
import { MikroORM } from "@mikro-orm/core";
import { inject } from "inversify";

@bind("MikroOrmLoader")
export class MikroOrmLoader implements Loader<Promise<MikroORM["em"]>> {
  private readonly _orm: Promise<MikroORM>;

  constructor(@inject("ConfigLoader") config: Loader<Config>) {
    const {
      postgresDatabase,
      postgresUser,
      postgresPassword,
      postgresHost,
      postgresPort,
    } = config.load();

    this._orm = MikroORM.init({
      entities: [Directory, FileDescriptor, File, Group, User],
      dbName: postgresDatabase,
      user: postgresUser,
      password: postgresPassword,
      host: postgresHost,
      port: postgresPort,
      type: "postgresql",
    });
  }

  async load() {
    const orm = await this._orm;
    const em = orm.em.fork();

    return em;
  }
}
