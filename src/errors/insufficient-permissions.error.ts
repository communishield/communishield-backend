import { AccessDeniedError } from "./access-denied.error";

export class InsufficientPermissionsError extends AccessDeniedError {
  constructor() {
    super("Insufficient permissions");
  }
}
