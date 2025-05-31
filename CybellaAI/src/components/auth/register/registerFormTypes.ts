import { z } from "zod";

// Define form validation schema
export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .refine(
    (password) => /[A-Z]/.test(password),
    "Password must include at least one uppercase letter"
  )
  .refine(
    (password) => /[0-9]/.test(password),
    "Password must include at least one number"
  )
  .refine(
    (password) => /[^a-zA-Z0-9]/.test(password),
    "Password must include at least one special character"
  );

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.string({
    required_error: "Please select your gender",
  }).optional(),
  dateOfBirth: z.string({
    required_error: "Date of birth is required",
  }).optional(),
  // ageRange: z.string({
  //   required_error: "Please select your age range",
  // }).optional(),
  aiName: z.string().min(1, "AI assistant name is required").default("Cybella"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
