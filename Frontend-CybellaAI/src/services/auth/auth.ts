import axios from "axios";
import { API_URL, setAuthInStorage } from "./authApiUtils";
import { RegisterData, AuthResponse, User } from "@/types/authTypes";

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth-login`, credentials);
    const data = response.data;

    if (data.token && data.user) {
      setAuthInStorage({ success: true, token: data.token, user: data.user });
      return { success: true, token: data.token, user: data.user };
    }

    return { success: false, message: "Login failed" };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth-register`, data);
    const responseData = response.data;

    if (responseData.user) {
      return { success: true, user: responseData.user };
    }

    return { success: false, message: "Registration failed" };
  },

  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  // You can also define updateProfile, changePassword, etc.
};
