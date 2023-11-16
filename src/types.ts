export const types = {
  config: Symbol.for("Config"),
  logger: Symbol.for("Logger"),
  runner: Symbol.for("Runner"),

  cache: Symbol.for("Cache"),

  mongooseLoader: Symbol.for("MongooseLoader"),
  passportLoader: Symbol.for("PassportLoader"),

  apiLoader: Symbol.for("ApiLoader"),

  bcryptUtils: Symbol.for("BcryptUtils"),
  jwtUtils: Symbol.for("JwtUtils"),

  loginServiceFactory: Symbol.for("LoginServiceFactory"),
  userRepository: Symbol.for("UserRepository"),
};
