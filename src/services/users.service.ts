import { bind } from "@/di/container";
import { Repository } from "@/types/repository";
import { inject } from "inversify";
import { type LoginUserDto, type RegisterUserDto } from "./types/users.dto";
import { UserAlreadyExistsError } from "@/errors/user-already-exists.error";
import { HashUtils } from "@/utils/hash";
import { UserNotFoundError } from "@/errors/user-not-found.error";
import { LoginFailedError } from "@/errors/login-failed.error";
import { JwtUtils } from "@/utils/jwt";
import { type User } from "@/models/user.model";

@bind("UsersService")
export class UsersService {
  constructor(
    @inject("UserRepository") private readonly userRepository: Repository<User>,
    @inject("HashUtils") private readonly hashUtils: HashUtils,
    @inject("JwtUtils") private readonly jwtUtils: JwtUtils,
  ) {}

  async registerUser({ login, password }: RegisterUserDto): Promise<void> {
    const user = await this.userRepository
      .findOneBy({ login })
      .catch(() => null);
    if (user) {
      throw new UserAlreadyExistsError();
    }

    const hashedPassword = await this.hashUtils.hash(password);

    await this.userRepository.create({
      login,
      password: hashedPassword,
    });
  }

  async loginUser({ login, password }: LoginUserDto): Promise<User> {
    const user = await this.userRepository
      .findOneBy({ login })
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

  async generateToken(login: string): Promise<string> {
    return this.jwtUtils.sign({ login });
  }
}
