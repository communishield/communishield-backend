import { type Config } from "@/config/schemas";
import { bind } from "@/di/container";
import { Getter } from "@/types/getter";
import { inject } from "inversify";
import jwt from "jsonwebtoken";

@bind("JwtUtils")
export class JwtUtils {
  private readonly ttl: number;
  private readonly issuer: string;
  private readonly audience: string;
  private readonly secretKey: string;
  private readonly algorithm: string;

  constructor(@inject("ConfigGetter") config: Getter<Config>) {
    this.ttl = config.get("jwtTtl");
    this.issuer = config.get("jwtIssuer");
    this.audience = config.get("jwtAudience");
    this.secretKey = config.get("jwtSecretKey");
    this.algorithm = config.get("jwtAlgorithm");
  }

  sign(data: Record<string, unknown>) {
    return jwt.sign(data, this.secretKey, {
      expiresIn: this.ttl,
      issuer: this.issuer,
      audience: this.audience,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      algorithm: this.algorithm as any,
    });
  }
}
