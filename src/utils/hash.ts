import { type Config } from "@/config/schemas";
import { bind } from "@/di/container";
import { Getter } from "@/types/getter";
import bcrypt from "bcrypt";
import { inject } from "inversify";

@bind("HashUtils")
export class HashUtils {
  private readonly saltRounds: number;

  constructor(@inject("ConfigGetter") config: Getter<Config>) {
    this.saltRounds = config.get("bcryptSaltRounds");
  }

  async hash(password: string): Promise<string> {
    const { saltRounds } = this;
    return bcrypt.hash(password, saltRounds);
  }

  async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
