import { bind } from "@/di/container";
import { LoginFailedError } from "@/errors/login-failed.error";
import { UserRepository } from "@/repositories/user.repository";
import { HashUtils } from "@/utils/hash";
import { JwtUtils } from "@/utils/jwt";
import { randomString } from "@/utils/random-string";
import { inject } from "inversify";

@bind("AuthenticationService")
export class AuthenticationService {
  private readonly dummyHash: Promise<string>;

  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
    @inject("HashUtils") private readonly hashUtils: HashUtils,
    @inject("JwtUtils") private readonly jwtUtils: JwtUtils,
  ) {
    this.dummyHash = this.hashUtils.hash(randomString(16));
  }

  /**
   * Authenticates a user.
   */
  async authenticate(username: string, password: string): Promise<void> {
    let userPassword;
    try {
      const user = await this.userRepository.getUserByUsername(username, {
        loadPassword: true,
      });

      userPassword = user.password;
    } catch (error) {
      await this.hashUtils.compare(password, await this.dummyHash);
      throw new LoginFailedError();
    }

    if (!(await this.hashUtils.compare(password, userPassword))) {
      throw new LoginFailedError();
    }
  }

  /**
   * Generate JWT token.
   */
  generateToken(username: string): string {
    return this.jwtUtils.sign({
      username,
    });
  }
}
