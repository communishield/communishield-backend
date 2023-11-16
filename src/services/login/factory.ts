import { type Repository } from "@/repositories/interfaces/repository";
import { type LoginServiceFactory } from "./interfaces/login-service-factory";
import { type User } from "@/models/user";
import { type BcryptUtils } from "@/utils/bcrypt";
import {
  type UserPasswordParams,
  UserPasswordService,
} from "./strategies/user-password";
import {
  type JwtPayloadParams,
  JwtPayloadService,
} from "./strategies/jwt-payload";
import { UnexpectedValueError } from "@/errors/unexpected-value";
import { type LoginService } from "./interfaces/login-service";
import { inject, injectable } from "inversify";
import { types } from "@/types";

@injectable()
export class LoginServiceFactoryImpl implements LoginServiceFactory {
  constructor(
    @inject(types.userRepository)
    private readonly userRepository: Repository<User>,
    @inject(types.bcryptUtils) private readonly bcryptUtils: BcryptUtils,
  ) {}

  create(strategy: "user-password"): LoginService<UserPasswordParams>;
  create(strategy: "jwt-payload"): LoginService<JwtPayloadParams>;
  create(strategy: string): LoginService<Record<string, unknown>> {
    switch (strategy) {
      case "user-password":
        return new UserPasswordService(this.userRepository, this.bcryptUtils);
      case "jwt-payload":
        return new JwtPayloadService(this.userRepository);
      default:
        throw new UnexpectedValueError(strategy, "Login strategy");
    }
  }
}
