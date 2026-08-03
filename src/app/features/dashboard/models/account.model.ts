export interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RequestEmailChangeRequest {
  newEmail: string;
}

export interface ConfirmEmailChangeRequest {
  newEmail: string;
  otp: string;
}

export interface DeleteAccountRequest {
  password: string;
}
