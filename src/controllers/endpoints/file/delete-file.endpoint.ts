import { MiddlewareFactory } from "@/controllers/middlewares/types/middleware-factory";
import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { Middleware } from "@/controllers/types/middleware";
import { bind } from "@/di/container";
import { FileService } from "@/services/file.service";
import { inject } from "inversify";
import { z } from "zod";

const deleteFileSchema = z.object({
  params: z.object({
    path: z
      .string()
      .startsWith("/")
      .transform((path) => path.split("/").filter(Boolean))
      .refine((path) => path.length > 0, { message: "Invalid path" }),
  }),
});

@bind("DeleteFileEndpoint")
export class DeleteFileEndpoint implements Endpoint<typeof deleteFileSchema> {
  public get path() {
    return "/:path";
  }

  public get method() {
    return "DELETE" as const;
  }

  public schema = deleteFileSchema;

  public get middlewares() {
    return [
      this.jwtAuthenticationMiddleware,
      this.resourceAuthorizationMiddlewareFactory.createMiddleware(
        (ctx: AuthenticatedContext<typeof deleteFileSchema>) => ({
          resourcePath: ctx.state.parsed.params.path.slice(0, -1),
          needsWrite: true,
          needsRead: false,
        }),
      ),
    ];
  }

  constructor(
    @inject("JwtAuthenticationMiddleware")
    private readonly jwtAuthenticationMiddleware: Middleware,
    @inject("ResourceAuthorizationMiddlewareFactory")
    private readonly resourceAuthorizationMiddlewareFactory: MiddlewareFactory<any>,
    @inject("FileService") private readonly fileService: FileService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof deleteFileSchema>) {
    const { path } = ctx.state.parsed.params;

    await this.fileService.deleteFileByPath(path);

    ctx.status = 204;
    ctx.body = "";
  }
}
