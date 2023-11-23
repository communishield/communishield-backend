import dotenv from "dotenv";
import { type LogLevel } from "@/logger/enums";
import { bind } from "@/di/container";
import { type PartialConfigLoader } from "../types/partial-config-loader";

dotenv.config();

@bind("EnvPartialConfigLoader")
export class EnvPartialConfigLoader implements PartialConfigLoader {
  load() {
    return {
      production: process.env.NODE_ENV === "production",
      postgresUser: process.env.POSTGRES_USER,
      postgresPassword: process.env.POSTGRES_PASSWORD,
      postgresDatabase: process.env.POSTGRES_DB,
      postgresHost: process.env.POSTGRES_HOST,
      postgresPort: this.parseInt(process.env.POSTGRES_PORT),
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
