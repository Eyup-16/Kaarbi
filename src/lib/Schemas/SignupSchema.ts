import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(1,'First name is required'),
  lastName: z.string().min(1,'Last name is required'),
  email: z.string().email('Invalid email'), // or z.string().email('Invalid email'),
  password: z.string().min(8,'Password must be at least 8 characters'),
  passwordConfirmation: z.string().min(8,'Password confirmation must match the password'),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords don't match",
  path: ["passwordConfirmation"], // path of the error
});