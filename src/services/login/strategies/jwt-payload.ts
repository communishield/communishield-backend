import { type LoginService } from "../interfaces/login-service";
import { type Repository } from "@/repositories/interfaces/repository";
import { type UserData, type User } from "@/models/user";

export type JwtPayloadParams = {
  username: string;
};

export class JwtPayloadService implements LoginService<JwtPayloadParams> {
  constructor(private readonly userRepository: Repository<User>) {}

  async login({ username }: JwtPayloadParams): Promise<UserData | undefined> {
    let user: User;
    try {
      user = await this.userRepository.fetchBy({ username });

      return user.toObject();
    } catch (error) {
      return undefined;
    }
  }
}
