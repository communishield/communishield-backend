import { bind } from "@/di/container";
import { LoginFailedError } from "@/errors/login-failed.error";
import { UserRepository } from "@/repositories/user.repository";
import { Logger } from "@/types/logger";
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
    @inject("Logger") private readonly logger: Logger,
  ) {
    this.dummyHash = this.hashUtils.hash(randomString(16));
    this.logger.debug("AuthenticationService initialized");
  }

  /**
   * Authenticates a user.
   */
  async authenticate(username: string, password: string): Promise<void> {
    this.logger.info(`Authenticating user: ${username}`);
    let userPassword;
    try {
      const user = await this.userRepository.getUserByUsername(username, {
        loadPassword: true,
      });

      userPassword = user.password;
      this.logger.debug(`User found: ${username}`);
    } catch (error) {
      this.logger.warn(
        `Failed to find user: ${username}, ${JSON.stringify(error)}`,
      );
      await this.hashUtils.compare(password, await this.dummyHash);
      this.logger.error(`Login failed for user: ${username}`);
      throw new LoginFailedError();
    }

    if (!(await this.hashUtils.compare(password, userPassword))) {
      this.logger.error(`Password mismatch for user: ${username}`);
      throw new LoginFailedError();
    }

    this.logger.info(`User authenticated successfully: ${username}`);
  }

  /**
   * Generate JWT token.
   */
  generateToken(username: string): string {
    this.logger.info(`Generating token for user: ${username}`);
    return this.jwtUtils.sign({ username });
  }
}
