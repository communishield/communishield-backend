import { inject, injectable } from "inversify";
import { type JwtPayloadParams } from "../login/strategies/jwt-payload";
import { type TokenGenerationService } from "./interfaces/token-generation-service";
import { types } from "@/types";
import { JwtUtils } from "@/utils/jwt";

@injectable()
export class TokenGenerationServiceImpl implements TokenGenerationService {
  constructor(@inject(types.jwtUtils) private readonly jwtUtils: JwtUtils) {}

  async generate(data: JwtPayloadParams) {
    return this.jwtUtils.sign(data);
  }
}
