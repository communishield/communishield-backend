import { ApplicationError } from "./application.error";

export class GroupUsedInFd extends ApplicationError {
  constructor() {
    super("Group is being used in File Descriptors", 400);
  }
}
