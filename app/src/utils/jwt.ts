import { type Config } from "@/config/schemas";
import { bind } from "@/di/container";
import { Loader } from "@/types/loader";
import { inject } from "inversify";
import jwt from "jsonwebtoken";

@bind("JwtUtils")
export class JwtUtils {
  private readonly ttl: number;
  private readonly issuer: string;
  private readonly audience: string;
  private readonly secretKey: string;
  private readonly algorithm: string;

  constructor(@inject("ConfigLoader") config: Loader<Config>) {
    const { jwtTtl, jwtIssuer, jwtAudience, jwtSecretKey, jwtAlgorithm } =
      config.load();

    this.ttl = jwtTtl;
    this.issuer = jwtIssuer;
    this.audience = jwtAudience;
    this.secretKey = jwtSecretKey;
    this.algorithm = jwtAlgorithm;
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
