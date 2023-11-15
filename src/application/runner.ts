import { type Config } from "@/config/schemas";
import { type ApplicationRunner } from "./interfaces/runner";
import { type Logger } from "@/logger/interfaces/logger";
import { UserRepository } from "@/repositories/user";

export class ApplicationRunnerImpl implements ApplicationRunner {
  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
  ) {}

  async run() {
    this.logger.info("Starting application");

    console.log(
      await (
        await new UserRepository().initialize()
      ).create({
        username: "André",
        password: "123",
      }),
    );
  }
}
