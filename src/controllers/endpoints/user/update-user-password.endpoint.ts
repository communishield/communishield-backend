import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { bind } from "@/di/container";
import { UserService } from "@/services/user.service";
import { inject } from "inversify";
import { z } from "zod";

const updateUserPasswordSchema = z.object({
  body: z.object({
    password: z.string(),
  }),
  params: z.object({
    username: z.string(),
  }),
});

@bind("UpdateUserPasswordEndpoint")
export class UpdateUserPasswordEndpoint
  implements Endpoint<typeof updateUserPasswordSchema>
{
  public get path() {
    return "/:username/password";
  }

  public get method() {
    return "PUT" as const;
  }

  public schema = updateUserPasswordSchema;

  constructor(
    @inject("UserService") private readonly userService: UserService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof updateUserPasswordSchema>) {
    const { username } = ctx.state.parsed.params;
    const { password } = ctx.state.parsed.body;

    await this.userService.updateUserPassword(username, password);

    ctx.status = 200;
    ctx.body = "";
  }
}
