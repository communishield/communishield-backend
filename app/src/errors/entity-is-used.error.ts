import { ApplicationError } from "./application.error";

export class EntityIsUsedError extends ApplicationError {
  constructor(entity: string) {
    super(`The ${entity} is used`, 409);
  }
}
