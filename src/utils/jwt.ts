import { Config } from "@/config/schemas";
import { types } from "@/types";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";

@injectable()
export class JwtUtils {
  private readonly secretKey: string;

  constructor(@inject(types.config) config: Config) {
    this.secretKey = config.jwtSecretKey;
  }

  verifyJwtToken(token: string): string | jwt.JwtPayload {
    try {
      const decoded = jwt.verify(token, this.secretKey);

      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
