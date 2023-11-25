import { bind } from "@/di/container";
import { z } from "zod";
import { type Endpoint } from "../types/endpoint";
import { type AuthenticatedContext } from "../types/context";
import { inject } from "inversify";
import { GroupsService } from "@/services/groups.service";

const getGroupSchema = z.object({
  params: z.object({
    name: z.string(),
  }),
});

@bind("GetGroupEndpoint")
export class GetGroupEndpoint implements Endpoint<typeof getGroupSchema> {
  public get path() {
    return "/:name";
  }

  public get method() {
    return "GET" as const;
  }

  public schema = getGroupSchema;

  constructor(
    @inject("GroupsService")
    private readonly groupsService: GroupsService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof getGroupSchema>) {
    const { name } = ctx.params;

    const groups = await this.groupsService.getGroup({ name });

    ctx.status = 200;
    ctx.body = { message: "Group found", group: groups };
  }
}
