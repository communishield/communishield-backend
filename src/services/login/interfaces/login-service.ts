import { type UserData } from "@/models/user";

export type LoginService<T extends Record<string, unknown>> = {
  login(params: T): Promise<UserData | undefined>;
};
