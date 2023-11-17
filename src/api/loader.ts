import Koa from "koa";
import { type Router } from "./interfaces/router";
import { type ApiLoader } from "./interfaces/api-loader";
import { type Middleware } from "./middlewares/interfaces/middleware";

export class ApiLoaderImpl implements ApiLoader {
  private readonly app: Koa;

  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly routers: Router[],
    private readonly middlewares: Array<Middleware["handler"]>,
  ) {
    this.app = new Koa();
  }

  async load() {
    this.registerMiddlewares();
    await this.registerRoutes();

    return new Promise<void>((resolve) => {
      this.app.listen(this.port, this.host, () => {
        resolve();
      });
    });
  }

  private registerMiddlewares() {
    this.middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  private registerRoute(router: Router) {
    this.app.use(router.routes);
    this.app.use(router.allowedMethods);
  }

  private async registerRoutes() {
    await Promise.all(
      this.routers.map(async (router) => {
        await router.setup();
        this.registerRoute(router);
      }),
    );
  }
}
