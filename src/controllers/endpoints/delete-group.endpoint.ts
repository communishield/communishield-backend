import { bind } from "@/di/container";
import { z } from "zod";
import { type Endpoint } from "../types/endpoint";
import { type AuthenticatedContext } from "../types/context";
import { inject } from "inversify";
import { GroupsService } from "@/services/groups.service";

const deleteGroupSchema = z.object({
  params: z.object({
    name: z.string(),
  }),
});

@bind("DeleteGroupEndpoint")
export class DeleteGroupEndpoint implements Endpoint<typeof deleteGroupSchema> {
  public get path() {
    return "/:name";
  }

  public get method() {
    return "DELETE" as const;
  }

  public schema = deleteGroupSchema;

  constructor(
    @inject("GroupsService")
    private readonly groupsService: GroupsService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof deleteGroupSchema>) {
    const { name } = ctx.params;

    await this.groupsService.deleteGroup({ name });

    ctx.status = 200;
    ctx.body = { message: "Group deleted" };
  }
}
