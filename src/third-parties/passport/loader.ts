import { type UserData } from "@/models/user";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "koa-passport";
import { inject, injectable } from "inversify";
import { types } from "@/types";
import { LoginServiceFactory } from "@/services/login/interfaces/login-service-factory";

@injectable()
export class PassportLoader {
  constructor(
    @inject(types.loginServiceFactory)
    private readonly loginServiceFactory: LoginServiceFactory,
  ) {}

  async load() {
    passport.use(
      new LocalStrategy(async (username, password, done) => {
        await this.localStrategy(username, password, done);
      }),
    );
  }

  private async localStrategy(
    username: string,
    password: string,
    done: (err: any, user?: UserData) => void,
  ) {
    try {
      done(
        null,
        await this.loginServiceFactory
          .create("user-password")
          .login({ username, password }),
      );
    } catch (error) {
      done(error);
    }
  }
}
