import { type JwtPayloadParams } from "../strategies/jwt-payload";
import { type UserPasswordParams } from "../strategies/user-password";
import { type LoginService } from "./login-service";

export type LoginServiceFactory = {
  create(strategy: "user-password"): LoginService<UserPasswordParams>;
  create(strategy: "jwt-payload"): LoginService<JwtPayloadParams>;
};
