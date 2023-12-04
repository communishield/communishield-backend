import { MiddlewareFactory } from "@/controllers/middlewares/types/middleware-factory";
import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { Middleware } from "@/controllers/types/middleware";
import { bind } from "@/di/container";
import { UserService } from "@/services/user.service";
import { inject } from "inversify";
import { z } from "zod";

const listUserSchema = z.object({});

@bind("ListUsersEndpoint")
export class ListUsersEndpoint implements Endpoint<typeof listUserSchema> {
  public get path() {
    return "/";
  }

  public get method() {
    return "GET" as const;
  }

  public schema = listUserSchema;

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
    @inject("UserService") private readonly userService: UserService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof listUserSchema>) {
    const users = await this.userService.listUsers();

    ctx.status = 200;
    ctx.body = users;
  }
}
