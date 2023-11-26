import { bind } from "@/di/container";
import { BaseController } from "./base.controller";
import { type Endpoint } from "./types/endpoint";
import { z } from "zod";
import { LocalAuthenticationMiddleware } from "./middlewares/local-authentication.middleware";
import { inject } from "inversify";
import { JwtUtils } from "@/utils/jwt";
import { type AuthenticatedContext } from "./types/context";
import { MikroOrmLoader } from "@/third-parties/mikro-orm/loader";
import { HashUtils } from "@/utils/hash";
import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { UserAlreadyExistsError } from "@/errors/user-already-exists.error";
import { UserNotFoundError } from "@/errors/user-not-found.error";
import { User } from "@/models/user.model";

@bind("RootController")
export class RootController extends BaseController {
  // eslint-disable-next-line max-params
  constructor(
    @inject("LoginEndpoint") loginEndpoint: Endpoint<any>,
    @inject("NewUserEndpoint") newUserEndpoint: Endpoint<any>,
    @inject("ListUsersEndpoint") listUsersEndpoint: Endpoint<any>,
    @inject("GetUserEndpoint") getUserEndpoint: Endpoint<any>,
    @inject("DeleteUserEndpoint") deleteUserEndpoint: Endpoint<any>,
    @inject("ChangeUserPasswordEndpoint")
    changeUserPasswordEndpoint: Endpoint<any>,
  ) {
    super("/", [
      loginEndpoint,
      newUserEndpoint,
      listUsersEndpoint,
      getUserEndpoint,
      deleteUserEndpoint,
      changeUserPasswordEndpoint,
    ]);
  }
}

/* LoginEndpoint */

const loginSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
});

@bind("LoginEndpoint")
export class LoginEndpoint implements Endpoint<typeof loginSchema> {
  public get path() {
    return "/api/v1/auth/login";
  }

  public get method() {
    return "POST" as const;
  }

  public schema = loginSchema;

  public middlewares = [new LocalAuthenticationMiddleware()];

  constructor(@inject("JwtUtils") private readonly jwtUtils: JwtUtils) {
    this.handler = this.handler.bind(this);
  }

  handler(ctx: AuthenticatedContext<typeof loginSchema>) {
    const { username } = ctx.state.user;

    const token = this.jwtUtils.sign({ username });

    ctx.status = 200;
    ctx.body = { message: "Login successful", token };
  }
}

/* NewUserEndpoint */

const newUserSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
});

@bind("NewUserEndpoint")
export class NewUserEndpoint implements Endpoint<typeof newUserSchema> {
  public get path() {
    return "/api/v1/users";
  }

  public get method() {
    return "POST" as const;
  }

  public schema = newUserSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
    @inject("HashUtils") private readonly hashUtils: HashUtils,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof newUserSchema>) {
    const { username, password } = ctx.state.parsed.body;
    const em = await this.mikroOrmLoader.load();

    const hashedPassword = this.hashUtils.hash(password);

    const user = em.create("User", {
      username,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new UserAlreadyExistsError();
      }

      throw error;
    }

    ctx.status = 201;
    ctx.body = { message: "User created successfully" };
  }
}

/* ListUsersEndpoint */

const listUsersSchema = z.object({});

@bind("ListUsersEndpoint")
export class ListUsersEndpoint implements Endpoint<typeof listUsersSchema> {
  public get path() {
    return "/api/v1/users";
  }

  public get method() {
    return "GET" as const;
  }

  public schema = listUsersSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof listUsersSchema>) {
    const em = await this.mikroOrmLoader.load();

    const users = await em.getRepository("User").findAll();

    ctx.status = 200;
    ctx.body = users;
  }
}

/* GetUserEndpoint */

const getUserSchema = z.object({
  params: z.object({
    username: z.string(),
  }),
});

@bind("GetUserEndpoint")
export class GetUserEndpoint implements Endpoint<typeof getUserSchema> {
  public get path() {
    return "/api/v1/users/:username";
  }

  public get method() {
    return "GET" as const;
  }

  public schema = getUserSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof getUserSchema>) {
    const { username } = ctx.state.parsed.params;
    const em = await this.mikroOrmLoader.load();

    const user = await em
      .getRepository("User")
      .findOne({ username }, { populate: ["groups"] as never[] });

    if (!user) {
      throw new UserNotFoundError();
    }

    ctx.status = 200;
    ctx.body = user;
  }
}

/* DeleteUserEndpoint */

const deleteUserSchema = z.object({
  params: z.object({
    username: z.string(),
  }),
});

@bind("DeleteUserEndpoint")
export class DeleteUserEndpoint implements Endpoint<typeof deleteUserSchema> {
  public get path() {
    return "/api/v1/users/:username";
  }

  public get method() {
    return "DELETE" as const;
  }

  public schema = deleteUserSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof deleteUserSchema>) {
    const { username } = ctx.state.parsed.params;
    const em = await this.mikroOrmLoader.load();

    const user = await em.getRepository(User).findOne({ username });

    if (!user) {
      throw new UserNotFoundError();
    }

    const reference = em.getRepository(User).getReference(user.id);
    await em.removeAndFlush(reference);

    ctx.status = 204;
    ctx.body = "";
  }
}

/* ChangeUserPasswordEndpoint */

const changeUserPasswordSchema = z.object({
  params: z.object({
    username: z.string(),
  }),
  body: z.object({
    password: z.string(),
  }),
});

@bind("ChangeUserPasswordEndpoint")
export class ChangeUserPasswordEndpoint
  implements Endpoint<typeof changeUserPasswordSchema>
{
  public get path() {
    return "/api/v1/users/:username/password";
  }

  public get method() {
    return "PUT" as const;
  }

  public schema = changeUserPasswordSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
    @inject("HashUtils") private readonly hashUtils: HashUtils,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof changeUserPasswordSchema>) {
    const {
      params: { username },
      body: { password },
    } = ctx.state.parsed;
    const em = await this.mikroOrmLoader.load();

    const user = await em.getRepository(User).findOne({ username });

    if (!user) {
      throw new UserNotFoundError();
    }

    const hashedPassword = await this.hashUtils.hash(password);
    user.password = hashedPassword;

    await em.persistAndFlush(user);

    ctx.status = 204;
    ctx.body = "";
  }
}
