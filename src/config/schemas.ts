import { LogLevel } from "@/logger/enums/log-level";
import { z } from "zod";

export const partialConfigSchema = z.object({
  logLevel: z.nativeEnum(LogLevel).optional(),
  mongoUsername: z.string().optional(),
  mongoPassword: z.string().optional(),
  mongoDatabase: z.string().optional(),
  mongoHost: z.string().optional(),
  mongoPort: z.number().min(0).max(65535).optional(),
  redisUsername: z.string().optional(),
  redisPassword: z.string().optional(),
  redisDatabase: z.string().optional(),
  redisHost: z.string().optional(),
  redisPort: z.number().min(0).max(65535).optional(),
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
  mongoUsername: z.string(),
  mongoPassword: z.string(),
  mongoDatabase: z.string(),
  mongoHost: z.string(),
  mongoPort: z.number().min(0).max(65535),
  redisUsername: z.string(),
  redisPassword: z.string(),
  redisDatabase: z.string(),
  redisHost: z.string(),
  redisPort: z.number().min(0).max(65535),
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
