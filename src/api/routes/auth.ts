import passport from "koa-passport";
import { BaseRouter } from "./base/base-router";
import { inject, injectable } from "inversify";
import { types } from "@/types";
import { TokenGenerationService } from "@/services/token-generation/interfaces/token-generation-service";
import { type Context, type Next } from "koa";

@injectable()
export class AuthRouter extends BaseRouter {
  constructor(
    @inject(types.tokenGenerationService)
    private readonly tokenGenerationService: TokenGenerationService,
  ) {
    super();
  }

  protected setupRoutes() {
    this.router.post(
      "/login",
      passport.authenticate("local", {
        session: false,
      }),
      this.loginHandler.bind(this),
    );
  }

  private async loginHandler(ctx: Context, done: Next) {
    ctx.body = {
      token: await this.tokenGenerationService.generate({
        username: ctx.state.user.username as string,
      }),
    };

    await done();
  }
}
