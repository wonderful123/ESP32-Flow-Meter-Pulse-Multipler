// CalibrationService.js
import APIService from "./APIService";

const handleCalibrationRequest = async endpoint => {
  try {
    // APIService.get already returns the parsed JSON data
    const response = await APIService.get(`/calibration/${endpoint}`);

    // Optionally, if the response includes a status or success flag, you can check it
    if (!response.status === 'success') {
      console.log(response.status)
      console.log(response.status === 'success' ? 'Calibration request successful' : 'Calibration request failed');
      // Assuming response has a `success` field
      throw new Error(`Calibration request failed: ${response.message || "Unknown error"}`);
    }

    return response; // Return the parsed response directly
  } catch (error) {
    console.error(`Error during ${endpoint} calibration:`, error);
    throw error; // Let the caller handle the error
  }
};

export const startCalibration = () => handleCalibrationRequest("start");
export const stopCalibration = () => handleCalibrationRequest("stop");
export const resetCalibration = () => handleCalibrationRequest("reset");
