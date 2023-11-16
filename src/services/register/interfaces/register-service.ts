export type RegisterService = {
  register(username: string, password: string): Promise<void>;
};
