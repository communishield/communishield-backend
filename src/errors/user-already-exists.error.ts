import { ApplicationError } from "./application.error";

export class UserAlreadyExistsError extends ApplicationError {
  constructor() {
    super("User already exists", 409);
  }
}
