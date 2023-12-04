import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { bind } from "@/di/container";
import { UserService } from "@/services/user.service";
import { inject } from "inversify";
import { z } from "zod";

const newUserSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
});

@bind("NewUserEndpoint")
export class NewUserEndpoint implements Endpoint<typeof newUserSchema> {
  public get path() {
    return "/";
  }

  public get method() {
    return "POST" as const;
  }

  public schema = newUserSchema;

  constructor(
    @inject("UserService") private readonly userService: UserService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof newUserSchema>) {
    const { username, password } = ctx.state.parsed.body;

    await this.userService.createUser({ username, password });

    ctx.status = 200;
    ctx.body = "";
  }
}
