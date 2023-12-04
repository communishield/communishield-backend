import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { bind } from "@/di/container";
import { DirectoryService } from "@/services/directory.service";
import { inject } from "inversify";
import { z } from "zod";

const deleteDirectorySchema = z.object({
  params: z.object({
    path: z
      .string()
      .startsWith("/")
      .transform((path) => path.split("/").filter(Boolean))
      .refine((path) => path.length > 0, { message: "Invalid path" }),
  }),
});

@bind("DeleteDirectoryEndpoint")
export class DeleteDirectoryEndpoint
  implements Endpoint<typeof deleteDirectorySchema>
{
  public get path() {
    return "/:path";
  }

  public get method() {
    return "DELETE" as const;
  }

  public schema = deleteDirectorySchema;

  constructor(
    @inject("DirectoryService")
    private readonly directoryService: DirectoryService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof deleteDirectorySchema>) {
    const { path } = ctx.state.parsed.params;

    await this.directoryService.deleteDirectoryByPath(path);

    ctx.status = 204;
    ctx.body = "";
  }
}
