import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { Middleware } from "@/controllers/types/middleware";
import { bind } from "@/di/container";
import { GroupService } from "@/services/group.service";
import { inject } from "inversify";
import { z } from "zod";

const listGroupSchema = z.object({});

@bind("ListGroupsEndpoint")
export class ListGroupsEndpoint implements Endpoint<typeof listGroupSchema> {
  public get path() {
    return "/";
  }

  public get method() {
    return "GET" as const;
  }

  public schema = listGroupSchema;

  public get middlewares() {
    return [this.jwtAuthenticationMiddleware];
  }

  constructor(
    @inject("JwtAuthenticationMiddleware")
    private readonly jwtAuthenticationMiddleware: Middleware,
    @inject("GroupService") private readonly groupService: GroupService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof listGroupSchema>) {
    const groups = await this.groupService.listGroups();

    ctx.status = 200;
    ctx.body = groups;
  }
}
