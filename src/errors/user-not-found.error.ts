import { ApplicationError } from "./application.error";

export class UserNotFoundError extends ApplicationError {
  constructor() {
    super("User not found", 404);
  }
}
