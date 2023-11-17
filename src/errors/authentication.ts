import { CommunishieldError } from "./communishield";

export class AuthenticationError extends CommunishieldError {
  constructor() {
    super("Authentication error");
  }
}
