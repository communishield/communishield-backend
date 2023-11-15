import { type Config } from "@/config/schemas";
import { type ApplicationLoader } from "./interfaces/loader";
import { MongooseLoader } from "@/third-parties/mongoose/loader";
import { ApplicationRunnerImpl } from "./runner";
import { ConfigLoaderImpl } from "@/config/loader";
import { ConfigBuilderImpl } from "@/config/builder";
import { EnvConfigLoader } from "@/config/connectors/env";
import { type LogLevel } from "@/logger/enums/log-level";
import { PinoLogger } from "@/logger/pino-logger";
import { PassportLoader } from "@/third-parties/passport/loader";
import { UserRepository } from "@/repositories/user";

export class ApplicationLoaderImpl implements ApplicationLoader {
  async load() {
    const config = await this.loadConfig();
    const logger = await this.loadLogger(config.logLevel);

    await this.loadMongoose(config);
    await this.loadPassport();

    return new ApplicationRunnerImpl(config, logger);
  }

  private async loadConfig() {
    const config = new ConfigLoaderImpl(new ConfigBuilderImpl(), [
      new EnvConfigLoader(),
    ]).load();

    return config;
  }

  private async loadLogger(loglevel: LogLevel) {
    return new PinoLogger(loglevel);
  }

  private async loadMongoose(config: Config) {
    return new MongooseLoader({
      username: config.mongoUsername,
      password: config.mongoPassword,
      database: config.mongoDatabase,
      host: config.mongoHost,
      port: config.mongoPort,
    }).load();
  }

  private async loadPassport() {
    return new PassportLoader(await new UserRepository().initialize()).load();
  }
}
