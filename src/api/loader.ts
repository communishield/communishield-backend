import Koa from "koa";
import bodyParser from "koa-bodyparser";
import passport from "koa-passport";
import { type Router } from "./interfaces/router";
import { AuthRouter } from "./routes/auth";
import { type ApiLoader } from "./interfaces/api-loader";

export class ApiLoaderImpl implements ApiLoader {
  private readonly app: Koa;

  constructor(
    private readonly host: string,
    private readonly port: number,
  ) {
    this.app = new Koa();
  }

  async load() {
    this.registerMiddlewares();
    this.registerRoutes();

    return new Promise<void>((resolve) => {
      this.app.listen(this.port, this.host, () => {
        resolve();
      });
    });
  }

  private registerMiddlewares() {
    this.app.use(bodyParser());
    this.app.use(passport.initialize());
  }

  private registerRoute(router: Router) {
    this.app.use(router.routes);
    this.app.use(router.allowedMethods);
  }

  private registerRoutes() {
    this.registerRoute(new AuthRouter());
  }
}
