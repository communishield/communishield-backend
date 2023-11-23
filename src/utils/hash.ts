import { type Config } from "@/config/schemas";
import { bind } from "@/di/container";
import { Loader } from "@/types/loader";
import bcrypt from "bcrypt";
import { inject } from "inversify";

@bind("HashUtils")
export class HashUtils {
  private readonly saltRounds: number;

  constructor(@inject("ConfigLoader") config: Loader<Config>) {
    const { bcryptSaltRounds } = config.load();
    this.saltRounds = bcryptSaltRounds;
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
