import { ApplicationError } from "./application.error";

export abstract class AccessDeniedError extends ApplicationError {
  constructor(reason: string) {
    super(reason, 403);
  }
}
