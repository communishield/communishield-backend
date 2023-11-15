import { CommunishieldError } from "./communishield";

export class ParameterNotInitializedError extends CommunishieldError {
  constructor(parameterName: string) {
    super(`Parameter ${parameterName} not initialized`);
  }
}
