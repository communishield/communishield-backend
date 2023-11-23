import { bind } from "@/di/container";
import { inject } from "inversify";
import { type LoginUserDto, type RegisterUserDto } from "./types/users.dto";
import { HashUtils } from "@/utils/hash";
import { UserNotFoundError } from "@/errors/user-not-found.error";
import { LoginFailedError } from "@/errors/login-failed.error";
import { JwtUtils } from "@/utils/jwt";
import { User } from "@/models/user.model";
import { type UserRepository } from "@/repositories/user.repository";
import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { UserAlreadyExistsError } from "@/errors/user-already-exists.error";

@bind("UsersService")
export class UsersService {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
    @inject("HashUtils") private readonly hashUtils: HashUtils,
    @inject("JwtUtils") private readonly jwtUtils: JwtUtils,
  ) {}

  async registerUser({ username, password }: RegisterUserDto): Promise<void> {
    const hashedPassword = await this.hashUtils.hash(password);

    const user = new User();
    Object.assign(user, {
      username,
      password: hashedPassword,
    });

    try {
      await this.userRepository.create(user);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new UserAlreadyExistsError();
      }

      throw error;
    }
  }

  async loginUser({ username, password }: LoginUserDto): Promise<User> {
    const user = await this.userRepository
      .findOneBy({ username })
      .catch(() => null);
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
}
