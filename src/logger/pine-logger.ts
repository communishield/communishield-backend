import pino, {
  type Logger as PinoLoggerInstance,
  type LevelWithSilent,
} from "pino";
import { bind } from "@/di/container";
import { LogLevel } from "./enums";
import { inject } from "inversify";
import { type Logger } from "@/types/logger";
import { Getter } from "@/types/getter";
import { type Config } from "@/config/schemas";

@bind("Logger")
export class PinoLogger implements Logger {
  static getLevel(level: LogLevel): LevelWithSilent {
    switch (level) {
      case LogLevel.DEBUG:
        return "debug";
      case LogLevel.INFO:
        return "info";
      case LogLevel.WARN:
        return "warn";
      case LogLevel.ERROR:
        return "error";
      case LogLevel.FATAL:
        return "fatal";
      default:
        return "info";
    }
  }

  private readonly logger: PinoLoggerInstance;

  constructor(@inject("ConfigGetter") config: Getter<Config>) {
    this.logger = pino({
      level: PinoLogger.getLevel(config.get("logLevel")),
      formatters: {
        level(label: string) {
          return { level: label };
        },
      },
    });
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  info(message: string) {
    this.logger.info(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  fatal(message: string) {
    this.logger.fatal(message);
  }
}
