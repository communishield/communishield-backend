import { type Config } from "@/config/schemas";
import { type ApplicationRunner } from "./interfaces/runner";
import { type Logger } from "@/logger/interfaces/logger";
import { inject, injectable } from "inversify";
import { types } from "@/types";
import { type MongooseLoader } from "@/third-parties/mongoose/loader";
import { type PassportLoader } from "@/third-parties/passport/loader";
import { ApiLoader } from "@/api/interfaces/api-loader";

@injectable()
export class ApplicationRunnerImpl implements ApplicationRunner {
  // eslint-disable-next-line max-params
  constructor(
    @inject(types.config) private readonly config: Config,
    @inject(types.logger) private readonly logger: Logger,
    @inject(types.mongooseLoader)
    private readonly mongooseLoader: MongooseLoader,
    @inject(types.passportLoader)
    private readonly passportLoader: PassportLoader,
    @inject(types.apiLoader)
    private readonly apiLoader: ApiLoader,
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

    await this.apiLoader.load();

    this.logger.info(
      `API started on ${this.config.communishieldHost}:${this.config.communishieldPort}`,
    );
  }
}
