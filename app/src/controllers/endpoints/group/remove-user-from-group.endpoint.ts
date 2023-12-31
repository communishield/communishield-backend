import { MiddlewareFactory } from "@/controllers/middlewares/types/middleware-factory";
import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { Middleware } from "@/controllers/types/middleware";
import { bind } from "@/di/container";
import { GroupService } from "@/services/group.service";
import { inject } from "inversify";
import { z } from "zod";

const removeUserToGroupSchema = z.object({
  params: z.object({
    name: z.string(),
    username: z.string(),
  }),
});

@bind("RemoveUserFromGroupEndpoint")
export class RemoveUserFromGroupEndpoint
  implements Endpoint<typeof removeUserToGroupSchema>
{
  public get path() {
    return "/:name/users/:username";
  }

  public get method() {
    return "DELETE" as const;
  }

  public schema = removeUserToGroupSchema;

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

  async handler(ctx: AuthenticatedContext<typeof removeUserToGroupSchema>) {
    const { name, username } = ctx.state.parsed.params;

    await this.groupService.removeUserFromGroup(name, username);

    ctx.status = 204;
    ctx.body = "";
  }
}
