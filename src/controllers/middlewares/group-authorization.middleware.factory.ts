import { type AuthenticatedContext } from "../types/context";
import { type Middleware } from "../types/middleware";
import type Koa from "koa";
import { inject } from "inversify";
import { AuthorizationService } from "@/services/authorization.service";
import { InsufficientPermissionsError } from "@/errors/insufficient-permissions.error";
import { bind } from "@/di/container";
import { type MiddlewareFactory } from "./types/middleware-factory";

@bind("GroupAuthorizationMiddlewareFactory")
export class GroupAuthorizationMiddlewareFactory
  implements MiddlewareFactory<{ group: string }>
{
  constructor(
    @inject("AuthorizationService")
    private readonly authorizationService: AuthorizationService,
  ) {
    this.createMiddleware = this.createMiddleware.bind(this);
  }

  public createMiddleware(provider: () => { group: string }): Middleware {
    return {
      handler: async (ctx: AuthenticatedContext<any>, next: Koa.Next) => {
        const { username } = ctx.state.user;

        if (
          !(await this.authorizationService.checkGroupMembership(
            username,
            provider().group,
          ))
        ) {
          throw new InsufficientPermissionsError();
        }

        await next();
      },
    };
  }
}
