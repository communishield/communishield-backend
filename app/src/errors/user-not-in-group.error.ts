import { ApplicationError } from "./application.error";

export class UserNotInGroupError extends ApplicationError {
  constructor() {
    super("User not in group", 404);
  }
}
