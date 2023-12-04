import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { bind } from "@/di/container";
import { GroupService } from "@/services/group.service";
import { inject } from "inversify";
import { z } from "zod";

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
    @inject("GroupService") private readonly groupService: GroupService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof getGroupSchema>) {
    const { name } = ctx.state.parsed.params;

    const group = await this.groupService.getGroup(name);

    ctx.status = 200;
    ctx.body = group;
  }
}
