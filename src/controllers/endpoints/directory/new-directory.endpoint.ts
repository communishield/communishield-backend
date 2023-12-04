import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { bind } from "@/di/container";
import { Permission } from "@/models/permission.model";
import { DirectoryService } from "@/services/directory.service";
import { inject } from "inversify";
import { z } from "zod";

const newDirectorySchema = z.object({
  params: z.object({
    path: z
      .string()
      .startsWith("/")
      .transform((path) => path.split("/").filter(Boolean))
      .refine((path) => path.length > 0, { message: "Invalid path" }),
  }),
  body: z.object({
    owner: z.string(),
    group: z.string(),
    permissions: z.object({
      owner: z.object({
        read: z.boolean(),
        write: z.boolean(),
      }),
      group: z.object({
        read: z.boolean(),
        write: z.boolean(),
      }),
      other: z.object({
        read: z.boolean(),
        write: z.boolean(),
      }),
    }),
  }),
});

@bind("NewDirectoryEndpoint")
export class NewDirectoryEndpoint
  implements Endpoint<typeof newDirectorySchema>
{
  public get path() {
    return "/:path";
  }

  public get method() {
    return "POST" as const;
  }

  public schema = newDirectorySchema;

  constructor(
    @inject("DirectoryService")
    private readonly directoryService: DirectoryService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof newDirectorySchema>) {
    const { path } = ctx.state.parsed.params;
    const { owner, group, permissions } = ctx.state.parsed.body;

    await this.directoryService.createDirectory({
      path,
      owner,
      group,
      permissions: new Permission(
        permissions.owner,
        permissions.group,
        permissions.other,
      ),
    });

    ctx.status = 201;
    ctx.body = "";
  }
}
