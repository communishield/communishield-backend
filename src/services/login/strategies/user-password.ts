import { type LoginService } from "../interfaces/login-service";
import { type Repository } from "@/repositories/interfaces/repository";
import { type User, type UserData } from "@/models/user";
import { type BcryptUtils } from "@/utils/bcrypt";

export type UserPasswordParams = {
  login: string;
  password: string;
};

export class UserPasswordService implements LoginService<UserPasswordParams> {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly bcryptUtils: BcryptUtils,
  ) {}

  async login({
    login,
    password,
  }: UserPasswordParams): Promise<UserData | undefined> {
    let user: User;
    try {
      user = await this.userRepository.fetchBy({ login });

      if (
        !(await this.bcryptUtils.compare(password, user.toObject().password))
      ) {
        return undefined;
      }

      return user.toObject();
    } catch (error) {
      await this.bcryptUtils.compare(password, ""); // Dummy call to prevent timing attacks
      return undefined;
    }
  }
}
