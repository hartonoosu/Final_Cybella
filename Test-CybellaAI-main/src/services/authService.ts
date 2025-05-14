// Re-export from the new modular structure
export * from './auth';

export async function updateProfile(userId: string, updates: Partial<RegisterData>): Promise<AuthResponse> {
    try {
      const response = await axios.put(`${API_URL}/auth-update-profile`, {
        userId,
        updates,
      });
  
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Update failed",
      };
    }
  }
  