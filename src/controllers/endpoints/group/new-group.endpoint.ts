import { MiddlewareFactory } from "@/controllers/middlewares/types/middleware-factory";
import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { Middleware } from "@/controllers/types/middleware";
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

  async handler(ctx: AuthenticatedContext<typeof newGroupSchema>) {
    const { name } = ctx.state.parsed.body;

    await this.groupService.createGroup({ name });

    ctx.status = 201;
    ctx.body = { message: "Group created successfully" };
  }
}
