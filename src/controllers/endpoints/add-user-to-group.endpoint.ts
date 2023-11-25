import { bind } from "@/di/container";
import { z } from "zod";
import { type Endpoint } from "../types/endpoint";
import { type AuthenticatedContext } from "../types/context";
import { inject } from "inversify";
import { GroupsService } from "@/services/groups.service";

const addUserToGroupSchema = z.object({
  body: z.object({
    username: z.string(),
  }),
  params: z.object({
    name: z.string(),
  }),
});

@bind("AddUserToGroupEndpoint")
export class AddUserToGroupEndpoint
  implements Endpoint<typeof addUserToGroupSchema>
{
  public get path() {
    return "/:name/users";
  }

  public get method() {
    return "POST" as const;
  }

  public schema = addUserToGroupSchema;

  constructor(
    @inject("GroupsService")
    private readonly groupsService: GroupsService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof addUserToGroupSchema>) {
    const {
      params: { name },
      request: {
        body: { username },
      },
    } = ctx;

    await this.groupsService.addUserToGroup({ groupName: name, username });

    ctx.status = 200;
    ctx.body = { message: "User added to group" };
  }
}
