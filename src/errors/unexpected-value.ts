import { CommunishieldError } from "./communishield";

export class UnexpectedValueError extends CommunishieldError {
  constructor(value: any, context: string) {
    const message = `Unexpected value: ${value} in ${context}`;

    super(message);
  }
}
