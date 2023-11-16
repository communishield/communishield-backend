import { type RedisClientType, createClient } from "redis";
import { RedisCache } from "./cache";

export class RedisLoader {
  static createUrl(opts: {
    host: string;
    port: number;
    username: string;
    password: string;
    database?: string;
  }) {
    if (opts.username && opts.password) {
      return `redis://${opts.username}:${opts.password}@${opts.host}:${
        opts.port
      }/${opts.database ?? 0}`;
    }

    return `redis://${opts.host}:${opts.port}/${opts.database ?? 0}`;
  }

  private readonly username: string;

  private readonly password: string;

  private readonly database: string;

  private readonly host: string;

  private readonly port: number;

  constructor(opts: {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
  }) {
    this.username = opts.username;
    this.password = opts.password;
    this.database = opts.database;
    this.host = opts.host;
    this.port = opts.port;
  }

  async load() {
    const url = RedisLoader.createUrl({
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      database: this.database,
    });

    const client = await createClient({ url }).connect();

    return new RedisCache(client as RedisClientType);
  }
}
