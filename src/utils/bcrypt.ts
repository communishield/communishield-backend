import { Config } from "@/config/schemas";
import { types } from "@/types";
import bcrypt from "bcrypt";
import { inject, injectable } from "inversify";

@injectable()
export class BcryptUtils {
  private readonly saltRounds: number;

  constructor(@inject(types.config) config: Config) {
    this.saltRounds = config.bcryptSaltRounds;
  }

  async hash(password: string) {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
