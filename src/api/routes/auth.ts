import passport from "koa-passport";
import { BaseRouter } from "./base/base-router";
import { inject, injectable } from "inversify";
import { types } from "@/types";
import { TokenGenerationService } from "@/services/token-generation/interfaces/token-generation-service";
import { type Next } from "koa";
import { registerSchema } from "../schemas/definitions/auth/register";
import {
  type AuthenticatedContext,
  type Context,
} from "../schemas/interfaces/context";
import { RegisterService } from "@/services/register/interfaces/register-service";
import { ValidateSchemaMiddleware } from "../middlewares/validate-schema";
import { type blankSchema } from "../schemas/definitions/blank";

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

  private async loginHandler(
    ctx: AuthenticatedContext<typeof blankSchema>,
    next: Next,
  ) {
    ctx.body = {
      message: "Login successful",
      token: await this.tokenGenerationService.generate({
        username: ctx.state.user.username,
      }),
    };

    await next();
  }

  private async registerHandler(
    ctx: Context<typeof registerSchema>,
    next: Next,
  ) {
    await this.registerService.register(ctx.request.body);
    ctx.body = {
      message: "User created successfully",
    };

    await next();
  }
}
