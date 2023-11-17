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
import { type LoginServiceFactory } from "@/services/login/interfaces/login-service-factory";
import { LoginServiceFactoryImpl } from "@/services/login/factory";
import { JwtUtils } from "@/utils/jwt";
import { type TokenGenerationService } from "@/services/token-generation/interfaces/token-generation-service";
import { TokenGenerationServiceImpl } from "@/services/token-generation/service";
import { type Router } from "@/api/interfaces/router";
import { AuthRouter } from "@/api/routes/auth";
import { type RegisterService } from "@/services/register/interfaces/register-service";
import { RegisterServiceImpl } from "@/services/register/service";
import { DirectoryRepository } from "@/repositories/directory";
import { GroupRepository } from "@/repositories/group";
import { FileRepository } from "@/repositories/file";
import { type Middleware } from "@/api/middlewares/interfaces/middleware";
import { ErrorHandlerMiddleware } from "@/api/middlewares/error-handler";
import bodyParser from "koa-bodyparser";
import passport from "koa-passport";
import { SwaggerLoader } from "@/third-parties/swagger/loader";
import { koaSwagger } from "koa2-swagger-ui";

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
    const directoryRepository = await this.loadDirectoryRepository();
    const fileRepository = await this.loadFileRepository();
    const groupRepository = await this.loadGroupRepository();
    const userRepository = await this.loadUserRepository();

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
    this.container.bind<SwaggerLoader>(types.swaggerLoader).to(SwaggerLoader);
    this.container
      .bind<DirectoryRepository>(types.directoryRepository)
      .toConstantValue(directoryRepository);
    this.container
      .bind<FileRepository>(types.fileRepository)
      .toConstantValue(fileRepository);
    this.container
      .bind<GroupRepository>(types.groupRepository)
      .toConstantValue(groupRepository);
    this.container
      .bind<Repository<User>>(types.userRepository)
      .toConstantValue(userRepository);
    this.container.bind<BcryptUtils>(types.bcryptUtils).to(BcryptUtils);
    this.container.bind<JwtUtils>(types.jwtUtils).to(JwtUtils);
    this.container
      .bind<LoginServiceFactory>(types.loginServiceFactory)
      .to(LoginServiceFactoryImpl);
    this.container
      .bind<TokenGenerationService>(types.tokenGenerationService)
      .to(TokenGenerationServiceImpl);
    this.container
      .bind<RegisterService>(types.registerService)
      .to(RegisterServiceImpl);
    this.container
      .bind<ApplicationRunner>(types.runner)
      .to(ApplicationRunnerImpl)
      .inSingletonScope();
    this.container.bind<Router>(types.authRouter).to(AuthRouter);
    this.container
      .bind<Middleware>(types.errorHandlerMiddleware)
      .to(ErrorHandlerMiddleware);

    const apiLoader = await this.loadApiLoader(config);
    this.container.bind<ApiLoader>(types.apiLoader).toConstantValue(apiLoader);
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

  private async loadDirectoryRepository() {
    return new DirectoryRepository().initialize();
  }

  private async loadFileRepository() {
    return new FileRepository().initialize();
  }

  private async loadGroupRepository() {
    return new GroupRepository().initialize();
  }

  private async loadUserRepository() {
    return new UserRepository().initialize();
  }

  private async loadApiLoader(config: Config) {
    const spec = await this.container
      .get<SwaggerLoader>(types.swaggerLoader)
      .load();

    const routers = [this.container.get<Router>(types.authRouter)];
    const middlewares = [
      this.container.get<Middleware>(types.errorHandlerMiddleware).handler,
      bodyParser(),
      passport.initialize(),
      koaSwagger({
        swaggerOptions: {
          spec,
        },
      }),
    ];

    return new ApiLoaderImpl(
      config.communishieldHost,
      config.communishieldPort,
      routers,
      middlewares,
    );
  }
}
