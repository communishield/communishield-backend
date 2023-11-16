import passport from "koa-passport";
import { BaseRouter } from "./base/base-router";
import { inject, injectable } from "inversify";
import { types } from "@/types";
import { TokenGenerationService } from "@/services/token-generation/interfaces/token-generation-service";
import { type Next } from "koa";
import { registerSchema } from "../schemas/definitions/auth/register";
import { type RouterContext } from "@koa/router";
import { type Context } from "../schemas/interfaces/context";
import { RegisterService } from "@/services/register/interfaces/register-service";
import { ValidateSchemaMiddleware } from "../middlewares/validate-schema";

@injectable()
export class AuthRouter extends BaseRouter {
  constructor(
    @inject(types.tokenGenerationService)
    private readonly tokenGenerationService: TokenGenerationService,
    @inject(types.registerService)
    private readonly registerService: RegisterService,
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

    this.router.post(
      "/register",
      new ValidateSchemaMiddleware(registerSchema).handler,
      this.registerHandler.bind(this),
    );
  }

  private async loginHandler(ctx: RouterContext, next: Next) {
    ctx.body = {
      message: "Login successful",
      token: await this.tokenGenerationService.generate({
        username: ctx.state.user.username as string,
      }),
    };

    await next();
  }

  private async registerHandler(
    ctx: Context<typeof registerSchema>,
    next: Next,
  ) {
    const { username, password } = ctx.request.body;

    await this.registerService.register(username, password);
    ctx.body = {
      message: "User created successfully",
    };

    await next();
  }
}
