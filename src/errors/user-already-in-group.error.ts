import { ApplicationError } from "./application.error";

export class UserAlreadyInGroupError extends ApplicationError {
  constructor() {
    super("User already in group", 409);
  }
}
