import { inject, injectable } from "inversify";
import {
  type RegisterDto,
  type RegisterService,
} from "./interfaces/register-service";
import { types } from "@/types";
import { BcryptUtils } from "@/utils/bcrypt";
import { Repository } from "@/repositories/interfaces/repository";
import { type User } from "@/models/user";
import { type Group } from "@/models/group";

@injectable()
export class RegisterServiceImpl implements RegisterService {
  constructor(
    @inject(types.userRepository)
    private readonly userRepository: Repository<User>,
    @inject(types.groupRepository)
    private readonly groupRepository: Repository<Group>,
    @inject(types.bcryptUtils) private readonly bcryptUtils: BcryptUtils,
  ) {}

  async register({
    email,
    login,
    password,
    groups,
  }: RegisterDto): Promise<void> {
    const hashedPassword = await this.bcryptUtils.hash(password);
    const resolvedGroups = await this.resolveGroups(groups);

    await this.userRepository.create({
      email,
      login,
      password: hashedPassword,
      _groupsId: resolvedGroups,
    });
  }

  private async resolveGroups(groups?: string[]): Promise<string[]> {
    if (!groups) return [];

    const resolvedGroups = await Promise.all(
      groups.map(async (group) => {
        const foundGroup = await this.groupRepository.fetchBy({ name: group });

        return foundGroup.toObject()._id;
      }),
    );

    return resolvedGroups;
  }
}
