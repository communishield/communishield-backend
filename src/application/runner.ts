import { type Config } from "@/config/schemas";
import { type ApplicationRunner } from "./interfaces/runner";
import { type Logger } from "@/logger/interfaces/logger";
import { ApiLoaderImpl } from "@/api/loader";
import { inject, injectable } from "inversify";
import { types } from "@/types";
import { type MongooseLoader } from "@/third-parties/mongoose/loader";
import { type PassportLoader } from "@/third-parties/passport/loader";

@injectable()
export class ApplicationRunnerImpl implements ApplicationRunner {
  constructor(
    @inject(types.config) private readonly config: Config,
    @inject(types.logger) private readonly logger: Logger,
    @inject(types.mongooseLoader)
    private readonly mongooseLoader: MongooseLoader,
    @inject(types.passportLoader)
    private readonly passportLoader: PassportLoader,
  ) {}

  async run() {
    this.logger.info("Starting application...");

    await this.load();
    await this.startApi();

    this.logger.info("Application started!");
  }

  private async load() {
    this.logger.info("Loading dependencies...");

    await this.mongooseLoader.load();
    this.logger.debug("Mongoose loaded");

    await this.passportLoader.load();
    this.logger.debug("Passport loaded");

    this.logger.info("Dependencies loaded!");
  }

  private async startApi() {
    this.logger.info("Starting API...");

    await new ApiLoaderImpl(
      this.config.communishieldHost,
      this.config.communishieldPort,
    ).load();

    this.logger.info(
      `API started on ${this.config.communishieldHost}:${this.config.communishieldPort}`,
    );
  }
}
