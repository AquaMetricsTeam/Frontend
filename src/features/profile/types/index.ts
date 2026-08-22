export interface UpdateProfilePayload {
  phoneNumber: string;
  medicalNotes?: string | null;
  emergencyContact?: string | null;
  dateOfBirth?: string | null;
  gender?: number | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UploadProfilePictureResponse {
  profilePictureUrl?: string;
  message?: string;
}
