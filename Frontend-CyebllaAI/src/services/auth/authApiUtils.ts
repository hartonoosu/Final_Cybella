import axios from "axios";

// API URL for serverless functions
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8888/.netlify/functions";

// Helper function to check if an endpoint exists
export const checkEndpointExists = async (endpoint: string): Promise<boolean> => {
  try {
    await axios.options(`${API_URL}/${endpoint}`);
    return true;
  } catch (error: any) {
    // If we get a 404, the endpoint doesn't exist
    if (error.response && error.response.status === 404) {
      return false;
    }
    // For any other error, assume the endpoint might exist but there's another issue
    return true;
  }
};

// Local storage helpers
export const getAuthFromStorage = () => {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;
  
  try {
    return JSON.parse(auth);
  } catch (error) {
    localStorage.removeItem("auth");
    return null;
  }
};

export const setAuthInStorage = (authData: any) => {
  localStorage.setItem("auth", JSON.stringify(authData));
};

export const removeAuthFromStorage = () => {
  localStorage.removeItem("auth");
};
