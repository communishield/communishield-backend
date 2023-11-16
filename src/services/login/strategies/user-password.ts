import { type LoginService } from "../interfaces/login-service";
import { type Repository } from "@/repositories/interfaces/repository";
import { type User, type UserData } from "@/models/user";
import { type BcryptUtils } from "@/utils/bcrypt";

export type UserPasswordParams = {
  username: string;
  password: string;
};

export class UserPasswordService implements LoginService<UserPasswordParams> {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly bcryptUtils: BcryptUtils,
  ) {}

  async login({
    username,
    password,
  }: UserPasswordParams): Promise<UserData | undefined> {
    let user: User;
    try {
      user = await this.userRepository.fetchBy({ username });

      if (
        !(await this.bcryptUtils.comparePassword(
          password,
          user.toObject().password,
        ))
      ) {
        return undefined;
      }

      return user.toObject();
    } catch (error) {
      await this.bcryptUtils.comparePassword(password, ""); // Dummy call to prevent timing attacks
      return undefined;
    }
  }
}
