// Types for authentication
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
  
  export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: {
      id: string;
      email: string;
      name?: string;
      gender?: string;
      dateOfBirth?: string;
      emailVerified?: boolean;
      ageRange?: string;
      aiName?: string;
    };
    message?: string;
    simulation?: boolean;
  }
  