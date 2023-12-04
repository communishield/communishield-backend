import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { bind } from "@/di/container";
import { GroupService } from "@/services/group.service";
import { inject } from "inversify";
import { z } from "zod";

const newGroupSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
});

@bind("NewGroupEndpoint")
export class NewGroupEndpoint implements Endpoint<typeof newGroupSchema> {
  public get path() {
    return "/";
  }

  public get method() {
    return "POST" as const;
  }

  public schema = newGroupSchema;

  constructor(
    @inject("GroupService") private readonly groupService: GroupService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof newGroupSchema>) {
    const { name } = ctx.state.parsed.body;

    await this.groupService.createGroup({ name });

    ctx.status = 200;
    ctx.body = "";
  }
}
