import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { bind } from "@/di/container";
import { UserService } from "@/services/user.service";
import { inject } from "inversify";
import { z } from "zod";

const getUserSchema = z.object({
  params: z.object({
    username: z.string(),
  }),
});

@bind("GetUserEndpoint")
export class GetUserEndpoint implements Endpoint<typeof getUserSchema> {
  public get path() {
    return "/:username";
  }

  public get method() {
    return "GET" as const;
  }

  public schema = getUserSchema;

  constructor(
    @inject("UserService") private readonly userService: UserService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof getUserSchema>) {
    const { username } = ctx.state.parsed.params;

    const user = await this.userService.getUser(username);

    ctx.status = 200;
    ctx.body = user;
  }
}
