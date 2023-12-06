import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { bind } from "@/di/container";
import { type Logger } from "@/types/logger";
import { type Controller } from "@/types/controller";
import { type Loader } from "@/types/loader";
import { type Middleware } from "@/controllers/types/middleware";
import { type Client } from "@/types/client";
import { inject } from "inversify";
import { type Config } from "@/config/schemas";
import cors from '@koa/cors';

@bind("ServerClient")
export class ServerClient implements Client {
  // eslint-disable-next-line max-params
  constructor(
    @inject("ConfigLoader") private readonly config: Loader<Config>,
    @inject("Logger") private readonly logger: Logger,
    @inject("ErrorHandlerMiddleware")
    private readonly errorHandlerMiddleware: Middleware<any>,
    @inject("SwaggerLoader")
    private readonly swaggerLoader: Loader<Middleware<any>>,
    @inject("PassportLoader")
    private readonly passportLoader: Loader<Middleware<any>>,
    @inject("FileController") private readonly fileController: Controller,
    @inject("DirectoryController")
    private readonly directoryController: Controller,
    @inject("GroupController") private readonly groupController: Controller,
    @inject("UserController") private readonly userController: Controller,
    @inject("AuthenticationController")
    private readonly authenticationController: Controller,
  ) { }

  async run() {
    const { communishieldPort, communishieldHost } = this.config.load();

    const app = this.setupServer();
    await this.listen(app, communishieldPort, communishieldHost);
    this.logger.info(`Listening on ${communishieldHost}:${communishieldPort}`);
  }

  private setupServer() {
    const app = new Koa();

    app.use(cors());
    app.use(this.errorHandlerMiddleware.handler);
    app.use(this.swaggerLoader.load().handler);
    app.use(bodyParser());
    app.use(this.passportLoader.load().handler);
    app.use(this.fileController.router.routes());
    app.use(this.fileController.router.allowedMethods());
    app.use(this.directoryController.router.routes());
    app.use(this.directoryController.router.allowedMethods());
    app.use(this.groupController.router.routes());
    app.use(this.groupController.router.allowedMethods());
    app.use(this.userController.router.routes());
    app.use(this.userController.router.allowedMethods());
    app.use(this.authenticationController.router.routes());
    app.use(this.authenticationController.router.allowedMethods());

    return app;
  }

  private async listen(app: Koa, port: number, host: string) {
    return new Promise<void>((resolve, reject) => {
      app
        .listen(port, host)
        .on("listening", () => {
          resolve();
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }
}
