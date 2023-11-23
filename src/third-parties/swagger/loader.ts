import { type Config } from "@/config/schemas";
import { type Middleware } from "@/controllers/types/middleware";
import { bind } from "@/di/container";
import { type Loader } from "@/types/loader";
import { inject } from "inversify";
import { koaSwagger } from "koa2-swagger-ui";
import yaml from "yaml";
import fs from "fs";
import { type Context } from "@/controllers/types/context";
import type Koa from "koa";

@bind("SwaggerLoader")
export class SwaggerLoader implements Loader<Middleware<any>> {
  private readonly specsPath: string;

  constructor(@inject("ConfigLoader") config: Loader<Config>) {
    const { swaggerSpecsPath } = config.load();

    this.specsPath = swaggerSpecsPath;
  }

  public load() {
    const spec = yaml.parse(fs.readFileSync(this.specsPath, "utf8")) as Record<
      string,
      unknown
    >;

    return new (class SwaggerMiddleware implements Middleware<any> {
      async handler(ctx: Context<any>, next: Koa.Next) {
        await koaSwagger({
          swaggerOptions: {
            spec,
          },
        })(ctx, next);
      }
    })();
  }
}
