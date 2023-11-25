import { bind } from "@/di/container";
import { z } from "zod";
import { type Endpoint } from "../types/endpoint";
import { type AuthenticatedContext } from "../types/context";
import { inject } from "inversify";
import { GroupsService } from "@/services/groups.service";

const removeUserFromGroupSchema = z.object({
  params: z.object({
    name: z.string(),
    username: z.string(),
  }),
});

@bind("RemoveUserFromGroupEndpoint")
export class RemoveUserFromGroupEndpoint
  implements Endpoint<typeof removeUserFromGroupSchema>
{
  public get path() {
    return "/:name/users/:username";
  }

  public get method() {
    return "DELETE" as const;
  }

  public schema = removeUserFromGroupSchema;

  constructor(
    @inject("GroupsService")
    private readonly groupsService: GroupsService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof removeUserFromGroupSchema>) {
    const {
      params: { name, username },
    } = ctx;

    await this.groupsService.removeUserFromGroup({ groupName: name, username });

    ctx.status = 200;
    ctx.body = { message: "User removed from group" };
  }
}
