import { type LoginService } from "../interfaces/login-service";
import { type Repository } from "@/repositories/interfaces/repository";
import { type UserData, type User } from "@/models/user";

export type JwtPayloadParams = {
  login: string;
};

export class JwtPayloadService implements LoginService<JwtPayloadParams> {
  constructor(private readonly userRepository: Repository<User>) {}

  async login({ login }: JwtPayloadParams): Promise<UserData | undefined> {
    let user: User;
    try {
      user = await this.userRepository.fetchBy({ login });

      return user.toObject();
    } catch (error) {
      return undefined;
    }
  }
}
