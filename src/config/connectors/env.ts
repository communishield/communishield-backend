import { type LogLevel } from "@/logger/enums/log-level";
import { type ConfigLoaderConnector } from "../interfaces/connector";
import dotenv from "dotenv";

dotenv.config();

export class EnvConfigLoader implements ConfigLoaderConnector {
  load() {
    return {
      production: process.env.NODE_ENV === "production",
      mongoUsername: process.env.MONGO_USERNAME,
      mongoPassword: process.env.MONGO_PASSWORD,
      mongoDatabase: process.env.MONGO_DATABASE,
      mongoHost: process.env.MONGO_HOST,
      mongoPort: this.parsePort(process.env.MONGO_PORT),
      redisUsername: process.env.REDIS_USERNAME,
      redisPassword: process.env.REDIS_PASSWORD,
      redisDatabase: process.env.REDIS_DATABASE,
      redisHost: process.env.REDIS_HOST,
      redisPort: this.parsePort(process.env.REDIS_PORT),
      communishieldHost: process.env.COMMUNISHIELD_HOST,
      communishieldPort: this.parsePort(process.env.COMMUNISHIELD_PORT),
      logLevel: process.env.COMMUNISHIELD_LOG_LEVEL as LogLevel,
    };
  }

  private parsePort(port: string | undefined) {
    if (!port) {
      return undefined;
    }

    try {
      return parseInt(port, 10);
    } catch (error) {
      return undefined;
    }
  }
}
