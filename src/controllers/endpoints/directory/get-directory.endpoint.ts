import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { bind } from "@/di/container";
import { DirectoryService } from "@/services/directory.service";
import { inject } from "inversify";
import { z } from "zod";

const getDirectorySchema = z.object({
  params: z.object({
    path: z
      .string()
      .startsWith("/")
      .transform((path) => path.split("/").filter(Boolean))
      .refine((path) => path.length > 0, { message: "Invalid path" }),
  }),
});

@bind("GetDirectoryEndpoint")
export class GetDirectoryEndpoint
  implements Endpoint<typeof getDirectorySchema>
{
  public get path() {
    return "/:path";
  }

  public get method() {
    return "GET" as const;
  }

  public schema = getDirectorySchema;

  constructor(
    @inject("DirectoryService")
    private readonly directoryService: DirectoryService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof getDirectorySchema>) {
    const { path } = ctx.state.parsed.params;

    const directory = await this.directoryService.getDirectoryByPath(path);
    (directory as any).path = `/${directory.path.join("/")}`;
    (directory as any).permissions = directory.permissions.asObject();

    ctx.status = 200;
    ctx.body = directory;
  }
}
