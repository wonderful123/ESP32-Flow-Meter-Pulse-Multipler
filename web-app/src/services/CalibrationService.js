// CalibrationService.js
import APIService from "./APIService";

const CalibrationService = {
  getCalibrationMode: async () => {
    try {
      const response = await APIService.get("/calibration/mode");

      if (!response || !response.data) {
        console.error("Invalid response structure:", response);
        throw new Error("Unexpected response format when fetching calibration mode.");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching calibration mode:", error);
      throw new Error("Failed to fetch calibration mode.");
    }
  },

  setCalibrationMode: async mode => {
    try {
      await APIService.put("/calibration/mode", { mode });
      console.log(`Calibration mode set to ${mode}`);
    } catch (error) {
      console.error("Error setting calibration mode:", error);
      throw new Error("Failed to set calibration mode.");
    }
  },

  getFixedCalibrationFactor: async () => {
    try {
      const response = await APIService.get("/calibration/fixed-factor");
      console.debug("Fixed calibration factor response fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching fixed calibration factor:", error);
      throw new Error("Failed to fetch fixed calibration factor.");
    }
  },

  setFixedCalibrationFactor: async factor => {
    try {
      await APIService.put("/calibration/fixed-factor", { factor });
      console.log(`Fixed calibration factor set to ${factor}`);
      return { message: `Fixed calibration factor saved as ${factor}.` };
    } catch (error) {
      console.error("Error setting fixed calibration factor:", error);
      throw new Error("Failed to set fixed calibration factor.");
    }
  },
};

const handleCalibrationRequest = async endpoint => {
  try {
    const response = await APIService.get(`/calibration/${endpoint}`);

    // Check if the response has a status and if it's not 'success'
    if (response.status !== "success") {
      console.error(`Calibration request failed: ${response.message || "Unknown error"}`);
      throw new Error(`Calibration request failed: ${response.message || "Unknown error"}`);
    }

    console.log(`${endpoint} calibration request successful`);
    return response; // Return the parsed response directly
  } catch (error) {
    console.error(`Error during ${endpoint} calibration:`, error);
    throw error; // Let the caller handle the error
  }
};

// Export calibration actions using the handleCalibrationRequest method
export const startCalibration = () => handleCalibrationRequest("start");
export const stopCalibration = () => handleCalibrationRequest("stop");
export const resetCalibration = () => handleCalibrationRequest("reset");
export const getCalibrationMode = CalibrationService.getCalibrationMode; // Export getCalibrationMode
export const setCalibrationMode = CalibrationService.setCalibrationMode; // Export setCalibrationMode

export default CalibrationService;
