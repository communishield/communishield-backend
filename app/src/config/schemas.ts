import { LogLevel } from "@/logger/enums";
import { z } from "zod";

export const partialConfigSchema = z.object({
  logLevel: z.nativeEnum(LogLevel).optional(),
  postgresUser: z.string().optional(),
  postgresPassword: z.string().optional(),
  postgresDatabase: z.string().optional(),
  postgresHost: z.string().optional(),
  postgresPort: z.number().min(0).max(65535).optional(),
  communishieldHost: z.string().optional(),
  communishieldPort: z.number().min(0).max(65535).optional(),
  jwtSecretKey: z.string().optional(),
  jwtIssuer: z.string().optional(),
  jwtTtl: z.number().min(1).optional(),
  jwtAudience: z.string().optional(),
  jwtAlgorithm: z.string().optional(),
  bcryptSaltRounds: z.number().min(1).optional(),
  swaggerSpecsPath: z.string().optional(),
  production: z.boolean().optional(),
});

export const configSchema = z.object({
  logLevel: z.nativeEnum(LogLevel),
  postgresUser: z.string(),
  postgresPassword: z.string(),
  postgresDatabase: z.string(),
  postgresHost: z.string(),
  postgresPort: z.number().min(0).max(65535),
  communishieldHost: z.string(),
  communishieldPort: z.number().min(0).max(65535),
  jwtSecretKey: z.string(),
  jwtIssuer: z.string(),
  jwtTtl: z.number().min(1),
  jwtAudience: z.string(),
  jwtAlgorithm: z.string(),
  bcryptSaltRounds: z.number().min(1),
  swaggerSpecsPath: z.string(),
  production: z.boolean(),
});

export type PartialConfig = z.infer<typeof partialConfigSchema>;
export type Config = z.infer<typeof configSchema>;
