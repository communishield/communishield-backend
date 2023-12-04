import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { bind } from "@/di/container";
import { Permission } from "@/models/permission.model";
import { FileService } from "@/services/file.service";
import { inject } from "inversify";
import { z } from "zod";

const updateFileSchema = z.object({
  params: z.object({
    path: z
      .string()
      .startsWith("/")
      .transform((path) => path.split("/").filter(Boolean))
      .refine((path) => path.length > 0, { message: "Invalid path" }),
  }),
  body: z.object({
    data: z.record(z.string(), z.any()),
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

@bind("UpdateFileEndpoint")
export class UpdateFileEndpoint implements Endpoint<typeof updateFileSchema> {
  public get path() {
    return "/:path";
  }

  public get method() {
    return "PUT" as const;
  }

  public schema = updateFileSchema;

  constructor(
    @inject("FileService") private readonly fileService: FileService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof updateFileSchema>) {
    const { path } = ctx.state.parsed.params;
    const { data, owner, group, permissions } = ctx.state.parsed.body;

    await this.fileService.updateFile({
      path,
      data,
      owner,
      group,
      permissions: new Permission(
        permissions.owner,
        permissions.group,
        permissions.other,
      ),
    });

    ctx.status = 200;
    ctx.body = "";
  }
}
