import { ApplicationError } from "./application.error";

export class EntityAlreadyExistsError extends ApplicationError {
  constructor(entityName: string) {
    super(`${entityName} already exists`, 409);
  }
}
