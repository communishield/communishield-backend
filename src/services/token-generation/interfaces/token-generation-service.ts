import { type JwtPayloadParams } from "@/services/login/strategies/jwt-payload";

export type TokenGenerationService = {
  generate(data: JwtPayloadParams): Promise<string>;
};
