import axios from "axios";
import { AuthResponse } from "./authServiceTypes";
import { API_URL, checkEndpointExists, getAuthFromStorage, setAuthInStorage } from "./authApiUtils";

export const emailVerificationService = {
  // Request email verification - with simulation capability
  async requestEmailVerification(email: string): Promise<AuthResponse> {
    try {
      // Check if the endpoint exists first
      const endpointExists = await checkEndpointExists("request-verification");
      
      if (!endpointExists) {
        console.log("The request-verification endpoint is not available - simulating success");
        
        // Simulate a successful email verification request
        return {
          success: true,
          simulation: true,
          message: "Verification email sent (development mode)"
        };
      }

      const response = await axios.post(`${API_URL}/request-verification`, { email });
      
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error: any) {
      console.error("Request verification error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send verification email"
      };
    }
  },
  
  // Verify email
  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      // Check if the endpoint exists
      const endpointExists = await checkEndpointExists("verify-email");
      
      if (!endpointExists) {
        console.log("The verify-email endpoint is not available - simulating success");
        
        // Simulate a successful email verification
        const auth = getAuthFromStorage();
        if (auth && auth.user) {
          auth.user.emailVerified = true;
          setAuthInStorage(auth);
        }
        
        return {
          success: true,
          simulation: true,
          message: "Email verified successfully (development mode)"
        };
      }
      
      const response = await axios.post(`${API_URL}/verify-email`, { token });
      
      // Update user in localStorage if successful
      if (response.data.success) {
        const auth = getAuthFromStorage();
        if (auth && auth.user) {
          auth.user.emailVerified = true;
          setAuthInStorage(auth);
        }
      }
      
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error: any) {
      console.error("Verify email error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to verify email"
      };
    }
  }
};
