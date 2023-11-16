import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
});
