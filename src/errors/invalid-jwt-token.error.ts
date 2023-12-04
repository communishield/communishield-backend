import { ApplicationError } from "./application.error";

export class InvalidJwtTokenError extends ApplicationError {
  constructor() {
    super("Invalid JWT token", 401);
  }
}
