import { type LoginService } from "../interfaces/login-service";
import { type JwtUtils } from "@/utils/jwt";
import { type Repository } from "@/repositories/interfaces/repository";
import { type UserData, type User } from "@/models/user";

export type JwtParams = {
  token: string;
};

export class JwtService implements LoginService<JwtParams> {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly jwtUtils: JwtUtils,
  ) {}

  async login({ token }: JwtParams): Promise<UserData | undefined> {
    try {
      const { username } = this.jwtUtils.verifyJwtToken(token) as {
        username?: string;
      };
      if (!username) {
        return undefined;
      }

      const user = await this.userRepository.fetchBy({ username });

      return user.toObject();
    } catch (error) {
      return undefined;
    }
  }
}
