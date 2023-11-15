import { LogLevel } from "./enums/log-level";
import { type Logger } from "./interfaces/logger";
import pino, {
  type Logger as PinoLoggerInstance,
  type LevelWithSilent,
} from "pino";

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

  constructor(level: LogLevel) {
    this.logger = pino({
      level: PinoLogger.getLevel(level),
      formatters: {
        level(label: string) {
          return { level: label };
        },
      },
    });
  }

  debug(message: string, extra?: Record<string, unknown>) {
    this.logger.debug(message, extra);
  }

  info(message: string, extra?: Record<string, unknown>) {
    this.logger.info(message, extra);
  }

  warn(message: string, extra?: Record<string, unknown>) {
    this.logger.warn(message, extra);
  }

  error(message: string, extra?: Record<string, unknown>) {
    this.logger.error(message, extra);
  }

  fatal(message: string, extra?: Record<string, unknown>) {
    this.logger.fatal(message, extra);
  }
}
