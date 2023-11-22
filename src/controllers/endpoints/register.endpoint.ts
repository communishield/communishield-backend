import { z } from "zod";
import { type Endpoint } from "../types/endpoint";
import { type AuthenticatedContext } from "../types/context";
import { bind } from "@/di/container";
import { inject } from "inversify";
import { UsersService } from "@/services/users.service";

const registerSchema = z.object({
  body: z.object({
    login: z.string(),
    password: z.string(),
  }),
});

@bind("RegisterEndpoint")
export class RegisterEndpoint implements Endpoint<typeof registerSchema> {
  public get path() {
    return "/register";
  }

  public get method() {
    return "POST" as const;
  }

  public schema = registerSchema;

  constructor(
    @inject("UsersService")
    private readonly usersService: UsersService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof registerSchema>) {
    const { login, password } = ctx.request.body;

    await this.usersService.registerUser({
      login,
      password,
    });

    ctx.status = 201;
    ctx.body = { message: "User registered successfully" };
  }
}
