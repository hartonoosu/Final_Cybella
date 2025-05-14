import { loginService } from "./loginRegisterService";
import { profileService } from "./profileService";
import { passwordService } from "./passwordService";
import { emailVerificationService } from "./emailVerificationService";
import { getAuthFromStorage, removeAuthFromStorage } from "./authApiUtils";
import { RegisterData, AuthResponse } from "./authServiceTypes";

// Compose all authentication services into a single export
export const authService = {
  // Login functions
  login: loginService.login,
  register: loginService.register,
  
  // Profile functions
  updateProfile: profileService.updateProfile,
  
  // Password functions
  changePassword: passwordService.changePassword,
  
  // Email verification functions
  requestEmailVerification: emailVerificationService.requestEmailVerification,
  verifyEmail: emailVerificationService.verifyEmail,
  
  // Local authentication state management
  isAuthenticated(): boolean {
    return !!getAuthFromStorage();
  },
  
  getCurrentUser() {
    const auth = getAuthFromStorage();
    return auth ? auth.user : null;
  },
  
  logout() {
    removeAuthFromStorage();
  }
};

// Export types for other modules to use
export type { RegisterData, AuthResponse };

