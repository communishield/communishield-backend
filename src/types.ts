export const types = {
  config: Symbol.for("Config"),
  logger: Symbol.for("Logger"),
  runner: Symbol.for("Runner"),

  cache: Symbol.for("Cache"),

  mongooseLoader: Symbol.for("MongooseLoader"),
  passportLoader: Symbol.for("PassportLoader"),

  apiLoader: Symbol.for("ApiLoader"),

  userRepository: Symbol.for("UserRepository"),
};
