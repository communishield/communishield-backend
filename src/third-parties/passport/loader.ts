import { type Context } from "@/controllers/types/context";
import { type Middleware } from "@/controllers/types/middleware";
import { bind } from "@/di/container";
import { type Loader } from "@/types/loader";
import { inject } from "inversify";
import passport from "koa-passport";
import { Strategy as LocalStrategy } from "passport-local";
import type Koa from "koa";
import { UsersService } from "@/services/users.service";

@bind("PassportLoader")
export class PassportLoader implements Loader<Middleware<any>> {
  constructor(
    @inject("UsersService") private readonly usersService: UsersService,
  ) {}

  load() {
    this.setupSerialization();
    this.setupLocalStrategy();

    return new (class PassportMiddleware implements Middleware<any> {
      async handler(ctx: Context<any>, next: Koa.Next) {
        await passport.initialize()(ctx, next);
      }
    })();
  }

  private setupSerialization() {
    passport.serializeUser((user: any, done) => {
      done(null, user.username);
    });

    passport.deserializeUser((username, done) => {
      done(null, { username });
    });
  }

  private setupLocalStrategy() {
    passport.use(
      new LocalStrategy(async (username, password, done) => {
        try {
          const user = await this.usersService.loginUser({
            username,
            password,
          });

          done(null, user);
        } catch (err) {
          done(err);
        }
      }),
    );
  }
}
