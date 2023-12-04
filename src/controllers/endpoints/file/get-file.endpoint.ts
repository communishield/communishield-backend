import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { Middleware } from "@/controllers/types/middleware";
import { bind } from "@/di/container";
import { FileService } from "@/services/file.service";
import { inject } from "inversify";
import { z } from "zod";

const getFileSchema = z.object({
  params: z.object({
    path: z
      .string()
      .startsWith("/")
      .transform((path) => path.split("/").filter(Boolean))
      .refine((path) => path.length > 0, { message: "Invalid path" }),
  }),
});

@bind("GetFileEndpoint")
export class GetFileEndpoint implements Endpoint<typeof getFileSchema> {
  public get path() {
    return "/:path";
  }

  public get method() {
    return "GET" as const;
  }

  public schema = getFileSchema;

  public get middlewares() {
    return [this.jwtAuthenticationMiddleware];
  }

  constructor(
    @inject("JwtAuthenticationMiddleware")
    private readonly jwtAuthenticationMiddleware: Middleware,
    @inject("FileService") private readonly fileService: FileService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof getFileSchema>) {
    const { path } = ctx.state.parsed.params;

    const file = await this.fileService.getFileByPath(path);
    (file as any).path = `/${file.path.join("/")}`;
    (file as any).permissions = file.permissions.asObject();

    ctx.status = 200;
    ctx.body = file;
  }
}
