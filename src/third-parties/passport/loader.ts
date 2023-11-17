import { type UserData } from "@/models/user";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import passport from "koa-passport";
import { inject, injectable } from "inversify";
import { types } from "@/types";
import { LoginServiceFactory } from "@/services/login/interfaces/login-service-factory";
import { Config } from "@/config/schemas";
import { type UserPasswordParams } from "@/services/login/strategies/user-password";

@injectable()
export class PassportLoader {
  private readonly jwtSecretKey: string;
  private readonly jwtIssuer: string;
  private readonly jwtAudience: string;
  private readonly jwtAlgorithm: string;

  constructor(
    @inject(types.loginServiceFactory)
    private readonly loginServiceFactory: LoginServiceFactory,
    @inject(types.config) config: Config,
  ) {
    this.jwtSecretKey = config.jwtSecretKey;
    this.jwtIssuer = config.jwtIssuer;
    this.jwtAudience = config.jwtAudience;
    this.jwtAlgorithm = config.jwtAlgorithm;
  }

  async load() {
    passport.use(
      new LocalStrategy(this.lcoalOptions(), async (login, password, done) => {
        await this.localStrategy(login, password, done);
      }),
    );
    passport.use(
      new JwtStrategy(this.jwtOptions(), async (tokenPayload, done) => {
        await this.jwtStrategy(tokenPayload as UserPasswordParams, done);
      }),
    );
  }

  private lcoalOptions() {
    return {
      usernameField: "login",
      passwordField: "password",
    };
  }

  private async localStrategy(
    login: string,
    password: string,
    done: (err: any, user?: UserData) => void,
  ) {
    console.log(login, password);
    try {
      done(
        null,
        await this.loginServiceFactory
          .create("user-password")
          .login({ login, password }),
      );
    } catch (error) {
      done(error);
    }
  }

  private jwtOptions() {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.jwtSecretKey,
      issuer: this.jwtIssuer,
      audience: this.jwtAudience,
      algorithms: [this.jwtAlgorithm],
    };
  }

  private async jwtStrategy(
    tokenPayload: UserPasswordParams,
    done: (err: any, user?: UserData) => void,
  ) {
    try {
      done(
        null,
        await this.loginServiceFactory
          .create("jwt-payload")
          .login(tokenPayload),
      );
    } catch (error) {
      done(error);
    }
  }
}
