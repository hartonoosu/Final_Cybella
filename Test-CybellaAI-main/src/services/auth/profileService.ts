import axios from "axios";
import { AuthResponse, RegisterData } from "./authServiceTypes";
import { API_URL, checkEndpointExists, getAuthFromStorage, setAuthInStorage } from "./authApiUtils";

export const profileService = {
  // Update user profile - with simulation capability
  async updateProfile(userId: string, updates: Partial<RegisterData>): Promise<AuthResponse> {
    try {
      // Check if the endpoint exists first
      const endpointExists = await checkEndpointExists("update-profile");
      
      if (!endpointExists) {
        console.log("The update-profile endpoint is not available - simulating success");
        
        // Create a simulated successful response for development
        // Update the user data in localStorage
        const auth = getAuthFromStorage();
        if (auth) {
          if (auth.user) {
            // Update the user data
            auth.user = { 
              ...auth.user, 
              name: updates.fullName || auth.user.name,
              gender: updates.gender || auth.user.gender,
              dateOfBirth: updates.dateOfBirth || auth.user.dateOfBirth
            };
            setAuthInStorage(auth);
            
            return {
              success: true,
              simulation: true,
              message: "Profile updated (development mode)",
              user: auth.user
            };
          }
        }
      }

      // If the endpoint exists or we couldn't simulate, attempt the real request
      const response = await axios.post(`${API_URL}/update-profile`, {
        userId,
        updates
      });
      
      const data = response.data;
      if (data.success) {
        // Update user in localStorage
        const auth = getAuthFromStorage();
        if (auth) {
          if (auth.user) {
            auth.user = { ...auth.user, ...data.user };
            setAuthInStorage(auth);
          }
        }
        
        return {
          success: true,
          user: data.user,
          message: data.message
        };
      }
      
      return {
        success: false,
        message: data.message || "Failed to update profile"
      };
    } catch (error: any) {
      console.error("Update profile error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred while updating profile"
      };
    }
  }
};
