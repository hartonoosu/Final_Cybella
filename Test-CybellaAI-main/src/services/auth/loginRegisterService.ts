// import axios from "axios";
// import { LoginCredentials, RegisterData, AuthResponse } from "./authServiceTypes";
// import { API_URL, setAuthInStorage } from "./authApiUtils";

// export const loginService = {
//   async login(credentials: LoginCredentials): Promise<AuthResponse> {
//     try {
//       console.log("Attempting login to:", `${API_URL}/auth-login`);
//       const response = await axios.post(`${API_URL}/auth-login`, credentials);
//       const data = response.data;
      
//       if (data.token) {
//         // Store auth data in localStorage
//         const authData = {
//           success: true,
//           token: data.token,
//           user: data.user
//         };
//         setAuthInStorage(authData);
//         return authData;
//       } else {
//         return {
//           success: false,
//           message: "Login failed"
//         };
//       }
//     } catch (error: any) {
//       console.error("Login error:", error);
//       return {
//         success: false,
//         message: error.response?.data?.message || "Invalid email or password"
//       };
//     }
//   },

//   async register(data: RegisterData): Promise<AuthResponse> {
//     try {
//       console.log("Attempting registration to:", `${API_URL}/auth-register`);
//       console.log("Registration data:", data);
//       const response = await axios.post(`${API_URL}/auth-register`, data);
//       const responseData = response.data;
      
//       return {
//         success: true,
//         user: responseData.user
//       };
//     } catch (error: any) {
//       console.error("Registration error:", error);
//       return {
//         success: false,
//         message: error.response?.data?.message || "Registration failed"
//       };
//     }
//   }
// };


import axios from "axios";
import { LoginCredentials, RegisterData, AuthResponse } from "./authServiceTypes";
import { API_URL, setAuthInStorage } from "./authApiUtils";
import { User } from "@/types/authTypes";

export const loginService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth-login`, credentials);
      const data = response.data;

      if (data.token && data.user) {
        const authData = {
          success: true,
          token: data.token,
          user: data.user,
        };
        setAuthInStorage(authData); // ✅ Save full user data to localStorage
        return authData;
      } else {
        return {
          success: false,
          message: "Login failed",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid email or password",
      };
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth-register`, data);
      const responseData = response.data;
  
      // ✅ FIX: Only check for responseData.success and responseData.user
      if (response.status === 200 || response.status === 201) {
        if (responseData.success && responseData.user) {
          const authData = {
            success: true,
            user: responseData.user,
          };
          setAuthInStorage(authData); // optional: remove if you don't want to auto-login
          return authData;
        }
      }
  
      return {
        success: false,
        message: responseData.message || "Registration failed",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  },  
};

// ✅ Utility to retrieve user from localStorage
export function getCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}
