import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.email("Enter a valid email"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username is too long")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().max(64, "Display name is too long").optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
