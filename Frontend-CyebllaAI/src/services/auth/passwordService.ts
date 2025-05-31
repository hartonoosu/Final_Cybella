import axios from "axios";
import { AuthResponse } from "./authServiceTypes";
import { API_URL, checkEndpointExists } from "./authApiUtils";

export const passwordService = {
  // Change password - with simulation capability
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      // Check if the endpoint exists first
      const endpointExists = await checkEndpointExists("change-password");
      
      if (!endpointExists) {
        console.log("The change-password endpoint is not available - simulating success");
        
        // Simulate a successful password change
        return {
          success: true,
          simulation: true,
          message: "Password changed successfully (development mode)"
        };
      }

      const response = await axios.post(`${API_URL}/change-password`, {
        userId,
        currentPassword,
        newPassword
      });
      
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error: any) {
      console.error("Change password error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to change password"
      };
    }
  }
};
