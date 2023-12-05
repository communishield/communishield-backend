import { ApplicationError } from "./application.error";

export class EntityNotFoundError extends ApplicationError {
  constructor(entityName: string) {
    super(`${entityName} not found`, 404);
  }
}
