import { z } from "zod";
import { type Endpoint } from "../types/endpoint";
import { type AuthenticatedContext } from "../types/context";
import { bind } from "@/di/container";
import { LocalAuthenticationMiddleware } from "../middlewares/local-authentication.middleware";
import { UsersService } from "@/services/users.service";
import { inject } from "inversify";

const loginSchema = z.object({
  body: z.object({
    login: z.string(),
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

  public middlewares = [new LocalAuthenticationMiddleware()];

  constructor(
    @inject("UsersService")
    private readonly usersService: UsersService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof loginSchema>) {
    const { login } = ctx.state.user as { login: string };

    const token = await this.usersService.generateToken(login);

    ctx.status = 200;
    ctx.body = { message: "Login successful", token };
  }
}
