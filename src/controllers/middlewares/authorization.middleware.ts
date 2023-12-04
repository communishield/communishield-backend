import { type AuthenticatedContext } from "../types/context";
import { type Middleware } from "../types/middleware";
import type Koa from "koa";
import { z } from "zod";
import { bind } from "@/di/container";
import { inject } from "inversify";
import { AuthorizationService } from "@/services/authorization.service";
import { InsufficientPermissionsError } from "@/errors/insufficient-permissions.error";

const authorizeSchema = z.object({});

@bind("AuthorizationMiddlewareBuilder", false)
export class LocalAuthenticationMiddleware
  implements Middleware<typeof authorizeSchema>
{
  constructor(
    @inject("AuthorizationService")
    private readonly authorizationService: AuthorizationService,
    private readonly resourcePath: string[],
    private readonly needsWrite: boolean,
    private readonly needsRead: boolean,
  ) {
    this.handler = this.handler.bind(this);
  }

  public async handler(
    ctx: AuthenticatedContext<typeof authorizeSchema>,
    next: Koa.Next,
  ) {
    const { username } = ctx.state.user;

    const permissions = await this.authorizationService.checkPermissions(
      username,
      this.resourcePath,
    );
    if (
      (this.needsRead && !permissions.read) ||
      (this.needsWrite && !permissions.write)
    ) {
      throw new InsufficientPermissionsError();
    }

    await next();
  }
}
