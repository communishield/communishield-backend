import { bind } from "@/di/container";
import { inject } from "inversify";
import { type LoginUserDto, type RegisterUserDto } from "./types/users.dto";
import { HashUtils } from "@/utils/hash";
import { UserNotFoundError } from "@/errors/user-not-found.error";
import { LoginFailedError } from "@/errors/login-failed.error";
import { JwtUtils } from "@/utils/jwt";
import { User } from "@/models/user.model";
import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { UserAlreadyExistsError } from "@/errors/user-already-exists.error";
import { MikroOrmLoader } from "@/third-parties/mikro-orm/loader";

@bind("UsersService")
export class UsersService {
  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
    @inject("HashUtils") private readonly hashUtils: HashUtils,
    @inject("JwtUtils") private readonly jwtUtils: JwtUtils,
  ) {}

  async registerUser({ username, password }: RegisterUserDto): Promise<void> {
    const em = await this.em;
    const hashedPassword = await this.hashUtils.hash(password);

    const user = new User();
    Object.assign(user, {
      username,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new UserAlreadyExistsError();
      }

      throw error;
    }
  }

  async loginUser({ username, password }: LoginUserDto): Promise<User> {
    const em = await this.em;

    const user = await em.findOne(User, {
      username,
    });
    if (!user) {
      throw new UserNotFoundError();
    }

    const isPasswordValid = await this.hashUtils.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new LoginFailedError();
    }

    return user;
  }

  async generateToken(username: string): Promise<string> {
    return this.jwtUtils.sign({ username });
  }

  private get em() {
    return this.mikroOrmLoader.load();
  }
}
