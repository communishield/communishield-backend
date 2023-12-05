import { ApplicationError } from "./application.error";
import { type z } from "zod";

export class SchemaValidationError extends ApplicationError {
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
    super(`Schema validation failed: ${reason}`, 400);
  }
}
