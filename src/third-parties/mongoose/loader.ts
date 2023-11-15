import mongoose from "mongoose";

export class MongooseLoader {
  static createUrl(opts: {
    username: string;
    password: string;
    database: string;
    host: string;
    port: string;
  }) {
    if (opts.username && opts.password) {
      return `mongodb://${opts.username}:${opts.password}@${opts.host}:${opts.port}/${opts.database}`;
    }

    return `mongodb://${opts.host}:${opts.port}/${opts.database}`;
  }

  private readonly username: string;

  private readonly password: string;

  private readonly database: string;

  private readonly host: string;

  private readonly port: string;

  constructor(opts: {
    username: string;
    password: string;
    database: string;
    host: string;
    port: string;
  }) {
    this.username = opts.username;
    this.password = opts.password;
    this.database = opts.database;
    this.host = opts.host;
    this.port = opts.port;
  }

  async load() {
    const url = MongooseLoader.createUrl({
      username: this.username,
      password: this.password,
      database: this.database,
      host: this.host,
      port: this.port,
    });

    await mongoose.connect(url);
  }
}
