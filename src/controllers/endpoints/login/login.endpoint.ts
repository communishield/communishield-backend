import { type Context } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { Middleware } from "@/controllers/types/middleware";
import { bind } from "@/di/container";
import { AuthenticationService } from "@/services/authentication.service";
import { inject } from "inversify";
import { z } from "zod";

const loginSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
});

@bind("LoginEndpoint")
export class LoginEndpoint implements Endpoint<typeof loginSchema> {
  public get path() {
    return "/login";
  }

  public get method() {
    return "POST" as const;
  }

  public schema = loginSchema;

  public get middlewares() {
    return [this.localAuthenticationMiddleware];
  }

  constructor(
    @inject("LocalAuthenticationMiddleware")
    private readonly localAuthenticationMiddleware: Middleware,
    @inject("AuthenticationService")
    private readonly authenticationService: AuthenticationService,
  ) {
    this.handler = this.handler.bind(this);
  }

  public async handler(ctx: Context<typeof loginSchema>) {
    const { username } = ctx.state.parsed.body;

    const token = this.authenticationService.generateToken(username);

    ctx.status = 200;
    ctx.body = {
      token,
    };
  }
}
