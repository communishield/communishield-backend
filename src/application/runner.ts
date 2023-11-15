import { type Config } from "@/config/schemas";
import { type ApplicationRunner } from "./interfaces/runner";
import { type Logger } from "@/logger/interfaces/logger";

export class ApplicationRunnerImpl implements ApplicationRunner {
  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
  ) {}

  async run() {
    this.logger.info("Starting application");
  }
}
