import { ApplicationError } from "./application.error";

export class LoginFailedError extends ApplicationError {
  constructor() {
    super("Login failed", 401);
  }
}
