import { enforceUnique } from "@/utils/schemas";
import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    login: z.string(),
    password: z.string(),
    groups: enforceUnique(z.string().array()).optional(),
  }),
});
