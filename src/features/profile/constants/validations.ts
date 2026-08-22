import { z } from "zod";

export const updateProfileSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  emergencyContact: z.string().optional(),
  medicalNotes: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.number().optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
