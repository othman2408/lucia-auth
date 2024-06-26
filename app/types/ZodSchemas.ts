import { z } from "zod";

// SignUp zod schema
export const SingUpSchema = z
  .object({
    username: z.string().min(2).max(50),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

// SignIn zod schema
export const SingInSchema = z.object({
  username: z.string({ message: "Username cannot be empty" }).min(2),
  password: z.string({ message: "Password cannot be empty" }),
});
