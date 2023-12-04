import { type AuthenticatedContext } from "@/controllers/types/context";
import { type Endpoint } from "@/controllers/types/endpoint";
import { bind } from "@/di/container";
import { UserService } from "@/services/user.service";
import { inject } from "inversify";
import { z } from "zod";

const deleteUserSchema = z.object({
  params: z.object({
    username: z.string(),
  }),
});

@bind("DeleteUserEndpoint")
export class DeleteUserEndpoint implements Endpoint<typeof deleteUserSchema> {
  public get path() {
    return "/:username";
  }

  public get method() {
    return "DELETE" as const;
  }

  public schema = deleteUserSchema;

  constructor(
    @inject("UserService") private readonly userService: UserService,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof deleteUserSchema>) {
    const { username } = ctx.state.parsed.params;

    await this.userService.deleteUser(username);

    ctx.status = 204;
    ctx.body = "";
  }
}
