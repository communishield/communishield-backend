import { type User, type UserData } from "@/models/user";
import { type Repository } from "@/repositories/interfaces/repository";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "koa-passport";
import { comparePassword } from "../bcrypt/hasher";

export class PassportLoader {
  constructor(private readonly userRepository: Repository<User>) {}

  async load() {
    passport.serializeUser((user, done) => {
      this.serializeUser(user as UserData, done);
    });

    passport.deserializeUser(async (id, done) => {
      await this.deserializeUser(id as string, done);
    });

    passport.use(
      new LocalStrategy(async (username, password, done) => {
        await this.localStrategy(username, password, done);
      }),
    );
  }

  private serializeUser(
    user: UserData,
    done: (err: any, id?: unknown) => void,
  ) {
    done(null, user._id);
  }

  private async deserializeUser(
    id: string,
    done: (err: any, user?: UserData) => void,
  ) {
    try {
      const user = await this.userRepository.fetchBy({ _id: id });

      done(null, user.toObject());
    } catch (error) {
      done(error);
    }
  }

  private async localStrategy(
    username: string,
    password: string,
    done: (err: any, user?: UserData) => void,
  ) {
    try {
      const user = await this.userRepository.fetchBy({ username });
      const userData = user.toObject();

      if (!(await comparePassword(password, userData.password))) {
        done(null);
        return;
      }

      done(null, userData);
    } catch (error) {
      done(error);
    }
  }
}
