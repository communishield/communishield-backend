import { MiddlewareFactory } from "@/controllers/middlewares/types/middleware-factory";
import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { Middleware } from "@/controllers/types/middleware";
import { bind } from "@/di/container";
import { GroupService } from "@/services/group.service";
import { inject } from "inversify";
import { z } from "zod";

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

  public get middlewares() {
    return [
      this.jwtAuthenticationMiddleware,
      this.groupAuthorizationMiddleware.createMiddleware(() => ({
        group: "admin",
      })),
    ];
  }

  constructor(
    @inject("JwtAuthenticationMiddleware")
    private readonly jwtAuthenticationMiddleware: Middleware,
    @inject("GroupAuthorizationMiddlewareFactory")
    private readonly groupAuthorizationMiddleware: MiddlewareFactory<{
      group: string;
    }>,
    @inject("GroupService") private readonly groupService: GroupService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof addUserToGroupSchema>) {
    const { name } = ctx.state.parsed.params;
    const { username } = ctx.state.parsed.body;

    await this.groupService.addUserToGroup(name, username);

    ctx.status = 200;
    ctx.body = "";
  }
}
