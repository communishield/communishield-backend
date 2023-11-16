import { inject, injectable } from "inversify";
import { type RegisterService } from "./interfaces/register-service";
import { types } from "@/types";
import { UserRepository } from "@/repositories/user";
import { BcryptUtils } from "@/utils/bcrypt";

@injectable()
export class RegisterServiceImpl implements RegisterService {
  constructor(
    @inject(types.userRepository)
    private readonly userRepository: UserRepository,
    @inject(types.bcryptUtils) private readonly bcryptUtils: BcryptUtils,
  ) {}

  async register(username: string, password: string): Promise<void> {
    const hashedPassword = await this.bcryptUtils.hash(password);

    await this.userRepository.create({
      username,
      password: hashedPassword,
    });
  }
}
