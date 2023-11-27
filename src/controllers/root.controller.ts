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
import { Group } from "@/models/group.model";
import { EntityAlreadyExistsError } from "@/errors/entity-already-exists.error";
import { EntityNotFoundError } from "@/errors/entity-not-found.error";
import { File } from "@/models/file.model";
import { FileDescriptor } from "@/models/file-descriptor.model";
import { Directory } from "@/models/directory.model";
import { Permission } from "@/models/permission.model";

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
    @inject("NewGroupEndpoint") newGroupEndpoint: Endpoint<any>,
    @inject("ListGroupsEndpoint") listGroupsEndpoint: Endpoint<any>,
    @inject("GetGroupEndpoint") getGroupEndpoint: Endpoint<any>,
    @inject("UpdateGroupEndpoint") updateGroupEndpoint: Endpoint<any>,
    @inject("DeleteGroupEndpoint") deleteGroupEndpoint: Endpoint<any>,
    @inject("AddUserToGroupEndpoint") addUserToGroupEndpoint: Endpoint<any>,
    @inject("RemoveUserFromGroupEndpoint")
    removeUserFromGroupEndpoint: Endpoint<any>,
    @inject("NewFileEndpoint") newFileEndpoint: Endpoint<any>,
    @inject("GetFileEndpoint") getFileEndpoint: Endpoint<any>,
    @inject("UpdateFileEndpoint") updateFileEndpoint: Endpoint<any>,
    @inject("DeleteFileEndpoint") deleteFileEndpoint: Endpoint<any>,
  ) {
    super("/", [
      loginEndpoint,
      newUserEndpoint,
      listUsersEndpoint,
      getUserEndpoint,
      deleteUserEndpoint,
      changeUserPasswordEndpoint,
      newGroupEndpoint,
      listGroupsEndpoint,
      getGroupEndpoint,
      updateGroupEndpoint,
      deleteGroupEndpoint,
      addUserToGroupEndpoint,
      removeUserFromGroupEndpoint,
      newFileEndpoint,
      getFileEndpoint,
      updateFileEndpoint,
      deleteFileEndpoint,
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

    const hashedPassword = await this.hashUtils.hash(password);

    const user = em.create(User, {
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

/* NewGroupEndpoint */

const newGroupSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
});

@bind("NewGroupEndpoint")
export class NewGroupEndpoint implements Endpoint<typeof newGroupSchema> {
  public get path() {
    return "/api/v1/groups";
  }

  public get method() {
    return "POST" as const;
  }

  public schema = newGroupSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof newGroupSchema>) {
    const { name } = ctx.state.parsed.body;
    const em = await this.mikroOrmLoader.load();

    const group = em.create(Group, { name });

    try {
      await em.persistAndFlush(group);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new EntityAlreadyExistsError("Group");
      }

      throw error;
    }

    ctx.status = 201;
    ctx.body = group;
  }
}

/* ListGroupsEndpoint */

const listGroupsSchema = z.object({});

@bind("ListGroupsEndpoint")
export class ListGroupsEndpoint implements Endpoint<typeof listGroupsSchema> {
  public get path() {
    return "/api/v1/groups";
  }

  public get method() {
    return "GET" as const;
  }

  public schema = listGroupsSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof listGroupsSchema>) {
    const em = await this.mikroOrmLoader.load();

    const groups = await em.getRepository(Group).findAll();

    ctx.status = 200;
    ctx.body = groups;
  }
}

/* GetGroupEndpoint */

const getGroupSchema = z.object({
  params: z.object({
    name: z.string(),
  }),
});

@bind("GetGroupEndpoint")
export class GetGroupEndpoint implements Endpoint<typeof getGroupSchema> {
  public get path() {
    return "/api/v1/groups/:name";
  }

  public get method() {
    return "GET" as const;
  }

  public schema = getGroupSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof getGroupSchema>) {
    const { name } = ctx.state.parsed.params;
    const em = await this.mikroOrmLoader.load();

    const group = await em.getRepository(Group).findOne(
      { name },
      {
        populate: ["users"] as const,
      },
    );

    if (!group) {
      throw new EntityNotFoundError("Group");
    }

    ctx.status = 200;
    ctx.body = group;
  }
}

/* UpdateGroupEndpoint */

const updateGroupSchema = z.object({
  params: z.object({
    name: z.string(),
  }),
  body: z.object({
    name: z.string(),
  }),
});

@bind("UpdateGroupEndpoint")
export class UpdateGroupEndpoint implements Endpoint<typeof updateGroupSchema> {
  public get path() {
    return "/api/v1/groups/:name";
  }

  public get method() {
    return "PUT" as const;
  }

  public schema = updateGroupSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof updateGroupSchema>) {
    const { name } = ctx.state.parsed.params;
    const { name: newName } = ctx.state.parsed.body;

    const em = await this.mikroOrmLoader.load();

    const group = await em.getRepository(Group).findOne({ name });

    if (!group) {
      throw new EntityNotFoundError("Group");
    }

    group.name = newName;

    await em.persistAndFlush(group);

    ctx.status = 204;
    ctx.body = "";
  }
}

/* DeleteGroupEndpoint */

const deleteGroupSchema = z.object({
  params: z.object({
    name: z.string(),
  }),
});

@bind("DeleteGroupEndpoint")
export class DeleteGroupEndpoint implements Endpoint<typeof deleteGroupSchema> {
  public get path() {
    return "/api/v1/groups/:name";
  }

  public get method() {
    return "DELETE" as const;
  }

  public schema = deleteGroupSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof deleteGroupSchema>) {
    const { name } = ctx.state.parsed.params;
    const em = await this.mikroOrmLoader.load();

    const group = await em.getRepository(Group).findOne({ name });

    if (!group) {
      throw new EntityNotFoundError("Group");
    }

    const reference = em.getRepository(Group).getReference(group.id);
    await em.removeAndFlush(reference);

    ctx.status = 204;
    ctx.body = "";
  }
}

/* AddUserToGroupEndpoint */

const addUserToGroupSchema = z.object({
  params: z.object({
    name: z.string(),
  }),
  body: z.object({
    username: z.string(),
  }),
});

@bind("AddUserToGroupEndpoint")
export class AddUserToGroupEndpoint
  implements Endpoint<typeof addUserToGroupSchema>
{
  public get path() {
    return "/api/v1/groups/:name/users";
  }

  public get method() {
    return "POST" as const;
  }

  public schema = addUserToGroupSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof addUserToGroupSchema>) {
    const { name } = ctx.state.parsed.params;
    const { username } = ctx.state.parsed.body;

    const em = await this.mikroOrmLoader.load();

    const group = await em.getRepository(Group).findOne({ name });

    if (!group) {
      throw new EntityNotFoundError("Group");
    }

    const user = await em.getRepository(User).findOne({ username });

    if (!user) {
      throw new EntityNotFoundError("User");
    }

    group.users.add(user);

    try {
      await em.persistAndFlush(group);
    } catch (err) {
      throw new EntityAlreadyExistsError("User");
    }

    ctx.status = 204;
    ctx.body = "";
  }
}

/* RemoveUserFromGroupEndpoint */

const removeUserFromGroupSchema = z.object({
  params: z.object({
    name: z.string(),
    username: z.string(),
  }),
});

@bind("RemoveUserFromGroupEndpoint")
export class RemoveUserFromGroupEndpoint
  implements Endpoint<typeof removeUserFromGroupSchema>
{
  public get path() {
    return "/api/v1/groups/:name/users/:username";
  }

  public get method() {
    return "DELETE" as const;
  }

  public schema = removeUserFromGroupSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof removeUserFromGroupSchema>) {
    const { name, username } = ctx.state.parsed.params;

    const em = await this.mikroOrmLoader.load();

    const group = await em.getRepository(Group).findOne(
      { name },
      {
        populate: ["users"] as const,
      },
    );

    if (!group) {
      throw new EntityNotFoundError("Group");
    }

    const user = await em.getRepository(User).findOne({ username });

    if (!user) {
      throw new EntityNotFoundError("User");
    }

    group.users.remove(user);

    await em.persistAndFlush(group);

    ctx.status = 204;
    ctx.body = "";
  }
}

/* NewFileEndpoint */

const newFileSchema = z.object({
  params: z.object({
    path: z
      .string()
      .startsWith("/")
      .transform((path) => path.split("/").filter(Boolean))
      .refine((path) => path.length > 0, { message: "Invalid path" }),
  }),
  body: z.object({
    data: z.record(z.string(), z.any()),
    owner: z.string(),
    group: z.string(),
    permissions: z.object({
      owner: z.object({
        read: z.boolean(),
        write: z.boolean(),
      }),
      group: z.object({
        read: z.boolean(),
        write: z.boolean(),
      }),
      other: z.object({
        read: z.boolean(),
        write: z.boolean(),
      }),
    }),
  }),
});

@bind("NewFileEndpoint")
export class NewFileEndpoint implements Endpoint<typeof newFileSchema> {
  public get path() {
    return "/api/v1/files/:path";
  }

  public get method() {
    return "POST" as const;
  }

  public schema = newFileSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof newFileSchema>) {
    const { path } = ctx.state.parsed.params;
    const { data, owner, group, permissions } = ctx.state.parsed.body;

    const em = await this.mikroOrmLoader.load();

    const ownerEntity = await em
      .getRepository(User)
      .findOne({ username: owner });
    const groupEntity = await em.getRepository(Group).findOne({ name: group });

    if (!ownerEntity) {
      throw new EntityNotFoundError("User");
    }

    if (!groupEntity) {
      throw new EntityNotFoundError("Group");
    }

    const filename = path.pop()!;
    const query = path.reduce<Record<string, unknown>>(
      (acc, part) => ({
        descriptor: { name: part, parentDirectory: acc },
      }),
      { descriptor: { name: "root", parentDirectory: null } },
    );

    const parentDirectoryEntity = await em
      .getRepository(Directory)
      .findOne(query);

    if (!parentDirectoryEntity) {
      throw new EntityNotFoundError("Directory");
    }

    const fileDescriptor = em.create(FileDescriptor, {
      name: filename,
      parentDirectory: parentDirectoryEntity,
      owner: ownerEntity,
      group: groupEntity,
      permissions: new Permission(
        permissions.owner,
        permissions.group,
        permissions.other,
      ),
    });

    const file = em.create(File, {
      data,
      descriptor: fileDescriptor,
    });

    try {
      await em.persistAndFlush(file);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new EntityAlreadyExistsError("File");
      }

      throw error;
    }

    ctx.status = 201;
    ctx.body = file;
  }
}

/* GetFileEndpoint */

const getFileSchema = z.object({
  params: z.object({
    path: z
      .string()
      .startsWith("/")
      .transform((path) => path.split("/").filter(Boolean))
      .refine((path) => path.length > 0, { message: "Invalid path" }),
  }),
});

@bind("GetFileEndpoint")
export class GetFileEndpoint implements Endpoint<typeof getFileSchema> {
  public get path() {
    return "/api/v1/files/:path";
  }

  public get method() {
    return "GET" as const;
  }

  public schema = getFileSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof getFileSchema>) {
    const { path } = ctx.state.parsed.params;
    const em = await this.mikroOrmLoader.load();

    const filename = path.pop()!;
    const query = {
      descriptor: {
        name: filename,
        parentDirectory: path.reduce<Record<string, unknown>>(
          (acc, part) => ({
            descriptor: { name: part, parentDirectory: acc },
          }),
          { descriptor: { name: "root", parentDirectory: null } },
        ),
      },
    };

    const file = await em
      .getRepository(File)
      .findOne(query, { populate: ["descriptor.owner", "descriptor.group"] });

    if (!file) {
      throw new EntityNotFoundError("File");
    }

    ctx.status = 200;
    ctx.body = file;
  }
}

/* UpdateFileEndpoint */

const updateFileSchema = z.object({
  params: z.object({
    path: z
      .string()
      .startsWith("/")
      .transform((path) => path.split("/").filter(Boolean))
      .refine((path) => path.length > 0, { message: "Invalid path" }),
  }),
  body: z.object({
    data: z.record(z.string(), z.any()),
    owner: z.string(),
    group: z.string(),
    permissions: z.object({
      owner: z.object({
        read: z.boolean(),
        write: z.boolean(),
      }),
      group: z.object({
        read: z.boolean(),
        write: z.boolean(),
      }),
      other: z.object({
        read: z.boolean(),
        write: z.boolean(),
      }),
    }),
  }),
});

@bind("UpdateFileEndpoint")
export class UpdateFileEndpoint implements Endpoint<typeof updateFileSchema> {
  public get path() {
    return "/api/v1/files/:path";
  }

  public get method() {
    return "PUT" as const;
  }

  public schema = updateFileSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof updateFileSchema>) {
    const { path } = ctx.state.parsed.params;
    const { data, owner, group, permissions } = ctx.state.parsed.body;
    const em = await this.mikroOrmLoader.load();

    const ownerEntity = await em
      .getRepository(User)
      .findOne({ username: owner });
    const groupEntity = await em.getRepository(Group).findOne({ name: group });

    if (!ownerEntity) {
      throw new EntityNotFoundError("User");
    }

    if (!groupEntity) {
      throw new EntityNotFoundError("Group");
    }

    const filename = path.pop()!;
    const query = {
      descriptor: {
        name: filename,
        parentDirectory: path.reduce<Record<string, unknown>>(
          (acc, part) => ({
            descriptor: { name: part, parentDirectory: acc },
          }),
          { descriptor: { name: "root", parentDirectory: null } },
        ),
      },
    };

    const file = await em.getRepository(File).findOne(query, {
      populate: ["descriptor.owner", "descriptor.group"],
    });

    if (!file) {
      throw new EntityNotFoundError("File");
    }

    file.data = data;
    file.descriptor.owner = ownerEntity;
    file.descriptor.group = groupEntity;
    file.descriptor.permissions = Permission.fromJson(permissions);

    await em.persistAndFlush(file);

    ctx.status = 204;
    ctx.body = "";
  }
}

/* DeleteFileEndpoint */

const deleteFileSchema = z.object({
  params: z.object({
    path: z
      .string()
      .startsWith("/")
      .transform((path) => path.split("/").filter(Boolean))
      .refine((path) => path.length > 0, { message: "Invalid path" }),
  }),
});

@bind("DeleteFileEndpoint")
export class DeleteFileEndpoint implements Endpoint<typeof deleteFileSchema> {
  public get path() {
    return "/api/v1/files/:path";
  }

  public get method() {
    return "DELETE" as const;
  }

  public schema = deleteFileSchema;

  constructor(
    @inject("MikroOrmLoader") private readonly mikroOrmLoader: MikroOrmLoader,
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(ctx: AuthenticatedContext<typeof deleteFileSchema>) {
    const { path } = ctx.state.parsed.params;
    const em = await this.mikroOrmLoader.load();

    const filename = path.pop()!;
    const query = {
      descriptor: {
        name: filename,
        parentDirectory: path.reduce<Record<string, unknown>>(
          (acc, part) => ({
            descriptor: { name: part, parentDirectory: acc },
          }),
          { descriptor: { name: "root", parentDirectory: null } },
        ),
      },
    };

    const file = await em.getRepository(File).findOne(query);

    if (!file) {
      throw new EntityNotFoundError("File");
    }

    await em.removeAndFlush(file);

    ctx.status = 204;
    ctx.body = "";
  }
}
