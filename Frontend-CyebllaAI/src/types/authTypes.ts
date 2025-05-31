
export interface User {
  id: string;
  email: string;
  fullName?: string;
  name?: string; // optional: keep this if some API returns 'name'
  gender?: string;
  dateOfBirth?: string;
  emailVerified?: boolean;
  ageRange?: string;
  aiName?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  gender?: string;
  dateOfBirth?: string;
  ageRange?: string;
  aiName?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    fullName: string,
    email: string,
    password: string,
    gender?: string,
    dateOfBirth?: string,
    ageRange?: string,
    aiName?: string
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<RegisterData>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  requestEmailVerification: () => Promise<boolean>;
  loading: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}