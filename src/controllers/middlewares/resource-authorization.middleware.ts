import { type AuthenticatedContext } from "../types/context";
import { type Middleware } from "../types/middleware";
import type Koa from "koa";
import { bind } from "@/di/container";
import { inject } from "inversify";
import { AuthorizationService } from "@/services/authorization.service";
import { InsufficientPermissionsError } from "@/errors/insufficient-permissions.error";
import { type MiddlewareFactory } from "./types/middleware-factory";

@bind("ResourceAuthorizationMiddlewareFactory")
export class ResourceAuthorizationMiddlewarefactory
  implements
    MiddlewareFactory<{
      resourcePath: string[];
      needsWrite: boolean;
      needsRead: boolean;
    }>
{
  constructor(
    @inject("AuthorizationService")
    private readonly authorizationService: AuthorizationService,
  ) {
    this.createMiddleware = this.createMiddleware.bind(this);
  }

  createMiddleware(
    provider: (ctx: AuthenticatedContext<any>) => {
      resourcePath: string[];
      needsWrite: boolean;
      needsRead: boolean;
    },
  ): Middleware {
    return {
      handler: async (ctx: AuthenticatedContext<any>, next: Koa.Next) => {
        const { username } = ctx.state.user;
        const data = provider(ctx);

        const permissions = await this.authorizationService.checkPermissions(
          username,
          data.resourcePath,
        );

        if (
          (data.needsRead && !permissions.read) ||
          (data.needsWrite && !permissions.write)
        ) {
          throw new InsufficientPermissionsError();
        }

        await next();
      },
    };
  }
}
