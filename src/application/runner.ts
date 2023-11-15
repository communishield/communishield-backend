import { type Config } from "@/config/schemas";
import { type ApplicationRunner } from "./interfaces/runner";
import { type Logger } from "@/logger/interfaces/logger";
import { ApiLoader } from "@/api/loader";

export class ApplicationRunnerImpl implements ApplicationRunner {
  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
  ) {}

  async run() {
    this.logger.info("Starting application");

    await this.startApi();

    this.logger.info("Application started");
  }

  private async startApi() {
    this.logger.info("Starting API");

    await new ApiLoader(
      this.config.communishieldHost,
      this.config.communishieldPort,
    ).load();

    this.logger.info(
      `API started on ${this.config.communishieldHost}:${this.config.communishieldPort}`,
    );
  }
}
