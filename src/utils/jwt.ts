import { Config } from "@/config/schemas";
import { types } from "@/types";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";

@injectable()
export class JwtUtils {
  private readonly jwtSecretKey: string;
  private readonly jwtIssuer: string;
  private readonly jwtTtl: number;
  private readonly jwtAudience: string;
  private readonly jwtAlgorithm: string;

  constructor(@inject(types.config) config: Config) {
    this.jwtSecretKey = config.jwtSecretKey;
    this.jwtIssuer = config.jwtIssuer;
    this.jwtTtl = config.jwtTtl;
    this.jwtAudience = config.jwtAudience;
    this.jwtAlgorithm = config.jwtAlgorithm;
  }

  sign(payload: Record<string, unknown>) {
    return jwt.sign(payload, this.jwtSecretKey, {
      issuer: this.jwtIssuer,
      expiresIn: this.jwtTtl,
      audience: this.jwtAudience,
      algorithm: this.jwtAlgorithm as jwt.Algorithm,
    });
  }
}
