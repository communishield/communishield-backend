import { bind } from "@/di/container";
import { z } from "zod";
import { type Endpoint } from "../types/endpoint";
import { type AuthenticatedContext } from "../types/context";
import { inject } from "inversify";
import { GroupsService } from "@/services/groups.service";

const listGroupsSchema = z.object({});

@bind("ListGroupsEndpoint")
export class ListGroupsEndpoint implements Endpoint<typeof listGroupsSchema> {
  public get path() {
    return "";
  }

  public get method() {
    return "GET" as const;
  }

  public schema = listGroupsSchema;

  constructor(
    @inject("GroupsService")
    private readonly groupsService: GroupsService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof listGroupsSchema>) {
    const groups = await this.groupsService.listGroups({});

    ctx.status = 200;
    ctx.body = { message: "List of groups", groups };
  }
}
