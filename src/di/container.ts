import { type Config } from "@/config/schemas";
import { types } from "@/types";
import { Container } from "inversify";
import { type Logger } from "@/logger/interfaces/logger";
import { PinoLogger } from "@/logger/pino-logger";
import { MongooseLoader } from "@/third-parties/mongoose/loader";
import { ConfigLoaderImpl } from "@/config/loader";
import { ConfigBuilderImpl } from "@/config/builder";
import { EnvConfigLoader } from "@/config/connectors/env";
import { UserRepository } from "@/repositories/user";
import { type Repository } from "@/repositories/interfaces/repository";
import { type User } from "@/models/user";
import { PassportLoader } from "@/third-parties/passport/loader";
import { ApiLoaderImpl } from "@/api/loader";
import { type ApiLoader } from "@/api/interfaces/api-loader";
import { type ApplicationRunner } from "@/application/interfaces/runner";
import { ApplicationRunnerImpl } from "@/application/runner";
import { RedisLoader } from "@/third-parties/redis/loader";
import { type Cache } from "@/cache/interfaces/cache";
import { BcryptUtils } from "@/utils/bcrypt";
import { JwtUtils } from "@/utils/jwt";
import { type LoginServiceFactory } from "@/services/login/interfaces/login-service-factory";
import { LoginServiceFactoryImpl } from "@/services/login/factory";

export class ContainerLoader {
  private readonly container: Container;

  constructor() {
    this.container = new Container();
  }

  public async load() {
    await this.bind();
    return this.container;
  }

  private async bind() {
    const config = this.loadConfig();
    const logger = this.loadLogger(config);
    const mongooseLoader = this.loadMongooseLoader(config);
    const cache = await this.loadRedis(config);
    const userRepository = await this.loadUserRepository();
    const apiLoader = this.loadApiLoader(config);

    this.container.bind<Config>(types.config).toConstantValue(config);
    this.container.bind<Logger>(types.logger).toConstantValue(logger);
    this.container
      .bind<MongooseLoader>(types.mongooseLoader)
      .toConstantValue(mongooseLoader);
    this.container.bind<Cache>(types.cache).toConstantValue(cache);
    this.container
      .bind<PassportLoader>(types.passportLoader)
      .to(PassportLoader)
      .inSingletonScope();
    this.container
      .bind<Repository<User>>(types.userRepository)
      .toConstantValue(userRepository);
    this.container.bind<ApiLoader>(types.apiLoader).toConstantValue(apiLoader);
    this.container.bind<BcryptUtils>(types.bcryptUtils).to(BcryptUtils);
    this.container.bind<JwtUtils>(types.jwtUtils).to(JwtUtils);
    this.container
      .bind<LoginServiceFactory>(types.loginServiceFactory)
      .to(LoginServiceFactoryImpl);
    this.container
      .bind<ApplicationRunner>(types.runner)
      .to(ApplicationRunnerImpl)
      .inSingletonScope();
  }

  private loadConfig() {
    const config = new ConfigLoaderImpl(new ConfigBuilderImpl(), [
      new EnvConfigLoader(),
    ]).load();

    return config;
  }

  private loadLogger(config: Config) {
    return new PinoLogger(config.logLevel);
  }

  private loadMongooseLoader(config: Config) {
    return new MongooseLoader({
      host: config.mongoHost,
      port: config.mongoPort,
      username: config.mongoUsername,
      password: config.mongoPassword,
      database: config.mongoDatabase,
    });
  }

  private async loadRedis(config: Config) {
    return new RedisLoader({
      host: config.redisHost,
      port: config.redisPort,
      username: config.redisUsername,
      password: config.redisPassword,
      database: config.redisDatabase,
    }).load();
  }

  private async loadUserRepository() {
    return new UserRepository().initialize();
  }

  private loadApiLoader(config: Config) {
    return new ApiLoaderImpl(
      config.communishieldHost,
      config.communishieldPort,
    );
  }
}
