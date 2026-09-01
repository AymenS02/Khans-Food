import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required.").max(50),
    lastName: z.string().trim().min(1, "Last name is required.").max(50),
    email: z.string().trim().email("Enter a valid email address."),
    phone: z
      .string()
      .trim()
      .max(30, "Phone number is too long.")
      .optional()
      .or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
