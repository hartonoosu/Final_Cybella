
export const getBackendUrl = async (): Promise<string> => {
  try {
    // Fetch the public IP address
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();
    const publicIp = data.ip;
    console.log("Detected Public IP:", publicIp);

    // Check if the backend is accessible via public IP
    try {
      const backendResponse = await fetch(`http://${publicIp}:5000/ping`);
      if (backendResponse.ok) {
        console.log("Backend accessible via Public IP:", publicIp);
        return `http://${publicIp}:5000`;
      }
    } catch (error) {
      console.warn("Public IP Backend Connection Error:", error);
    }

    // If the public IP fails, fallback to localhost
    console.warn("Falling back to localhost...");
    return "http://localhost:5000";

  } catch (error) {
    console.error("Error detecting Public IP:", error);
    console.warn("Falling back to localhost...");
    return "http://localhost:5000";
  }
};
