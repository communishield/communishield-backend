import { bind } from "@/di/container";
import { z } from "zod";
import { type Endpoint } from "../types/endpoint";
import { type AuthenticatedContext } from "../types/context";
import { inject } from "inversify";
import { GroupsService } from "@/services/groups.service";

const createGroupSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
});

@bind("CreateGroupEndpoint")
export class CreateGroupEndpoint implements Endpoint<typeof createGroupSchema> {
  public get path() {
    return "";
  }

  public get method() {
    return "POST" as const;
  }

  public schema = createGroupSchema;

  constructor(
    @inject("GroupsService")
    private readonly groupsService: GroupsService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof createGroupSchema>) {
    const { name } = ctx.request.body;

    await this.groupsService.createGroup({ name });

    ctx.status = 201;
    ctx.body = { message: "Group created" };
  }
}
