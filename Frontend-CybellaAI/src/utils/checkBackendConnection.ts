import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const checkBackendConnection = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/ping`);
    console.log("Backend Connection:", response.data.message);
  } catch (error) {
    console.error("Backend Connection Error:", error);
  }
};
