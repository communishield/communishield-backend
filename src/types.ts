export const types = {
  config: Symbol.for("Config"),
  logger: Symbol.for("Logger"),
  runner: Symbol.for("Runner"),

  cache: Symbol.for("Cache"),

  errorHandlerMiddleware: Symbol.for("ErrorHandlerMiddleware"),

  mongooseLoader: Symbol.for("MongooseLoader"),
  passportLoader: Symbol.for("PassportLoader"),
  swaggerLoader: Symbol.for("SwaggerLoader"),

  apiLoader: Symbol.for("ApiLoader"),

  bcryptUtils: Symbol.for("BcryptUtils"),
  jwtUtils: Symbol.for("JwtUtils"),

  loginServiceFactory: Symbol.for("LoginServiceFactory"),
  tokenGenerationService: Symbol.for("TokenGenerationService"),
  registerService: Symbol.for("RegisterService"),

  directoryRepository: Symbol.for("DirectoryRepository"),
  fileRepository: Symbol.for("FileRepository"),
  groupRepository: Symbol.for("GroupRepository"),
  userRepository: Symbol.for("UserRepository"),

  authRouter: Symbol.for("AuthRouter"),
};
