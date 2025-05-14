export interface User {
    id: string;
    email: string;
    name?: string;
    gender?: string;
    dateOfBirth?: string;
    emailVerified?: boolean;
    ageRange?: string;
    aiName?: string;
  }
  
  export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (fullName: string, email: string, password: string, gender?: string, dateOfBirth?: string, ageRange?: string, aiName?: string) => Promise<boolean>;
    logout: () => void;
    updateProfile: (updates: Partial<RegisterData>) => Promise<boolean>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
    requestEmailVerification: () => Promise<boolean>;
    loading: boolean;
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