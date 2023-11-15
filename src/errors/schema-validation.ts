import { type z } from "zod";
import { CommunishieldError } from "./communishield";

export class SchemaValidationError extends CommunishieldError {
  static fromZodError(error: z.ZodError) {
    const reasons = error.errors
      .map((e) => {
        const path = e.path.join(".");
        return `${path}: ${e.message}`;
      })
      .join(", ");

    return new SchemaValidationError(reasons);
  }

  constructor(reason: string) {
    super(`Schema validation failed: ${reason}`);
  }
}
