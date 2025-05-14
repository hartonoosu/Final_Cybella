import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const sendAudioToBackend = async (audioBlob: Blob) => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    const response = await axios.post(`${BASE_URL}/predict/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error sending audio to backend:", error);
    throw error;
  }
};
