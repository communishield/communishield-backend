export type RegisterDto = {
  email: string;
  login: string;
  password: string;
  groups?: string[];
};

export type RegisterService = {
  register(dto: RegisterDto): Promise<void>;
};
