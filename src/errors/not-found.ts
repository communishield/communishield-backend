import { CommunishieldError } from "./communishield";

export class NotFoundError extends CommunishieldError {
  constructor(entityName: string) {
    super(`${entityName} not found`);
  }
}
