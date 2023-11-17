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
      mongoPort: this.parseInt(process.env.MONGO_PORT),
      redisUsername: process.env.REDIS_USERNAME,
      redisPassword: process.env.REDIS_PASSWORD,
      redisDatabase: process.env.REDIS_DATABASE,
      redisHost: process.env.REDIS_HOST,
      redisPort: this.parseInt(process.env.REDIS_PORT),
      communishieldHost: process.env.COMMUNISHIELD_HOST,
      communishieldPort: this.parseInt(process.env.COMMUNISHIELD_PORT),
      jwtSecretKey: process.env.JWT_SECRET_KEY,
      jwtIssuer: process.env.JWT_ISSUER,
      jwtTtl: this.parseInt(process.env.JWT_TTL),
      jwtAudience: process.env.JWT_AUDIENCE,
      jwtAlgorithm: process.env.JWT_ALGORITHM,
      bcryptSaltRounds: this.parseInt(process.env.BCRYPT_SALT_ROUNDS),
      swaggerSpecsPath: process.env.SWAGGER_SPECS_PATH,
      logLevel: process.env.COMMUNISHIELD_LOG_LEVEL as LogLevel,
    };
  }

  private parseInt(value: string | undefined) {
    if (!value) {
      return undefined;
    }

    try {
      return parseInt(value, 10);
    } catch (error) {
      return undefined;
    }
  }
}
