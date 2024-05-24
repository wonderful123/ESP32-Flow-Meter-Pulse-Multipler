// CalibrationFactorModel.js
import m from "mithril";
import StatusMessageService from "services/StatusMessageService";

const CalibrationFactorModel = {
  factor: null,
  errorMessage: "",
  loadCalibrationFactor: function () {
    const apiUrl = "api/calibration-factor"; // Adjust URL as needed
    return m.request({
      method: "GET",
      url: apiUrl,
      withCredentials: true,
    }).then(result => {
      CalibrationFactorModel.factor = result.calibrationFactor; // Adjust based on API response structure
    }).catch(error => {
      console.error("Error loading calibration factor:", error);
      StatusMessageService.setMessage('Error loading calibration factor.', 'error');
    });
  },

  setCalibrationFactor: function (newFactor) {
    const apiUrl = "api/calibration-factor"; // Adjust URL as needed
    console.log("Calibration factor:", newFactor);
    return m.request({
      method: "POST",
      url: apiUrl,
      body: {
        CalibrationFactor: newFactor
      },
      withCredentials: true,
    }).then(response => {
      console.log("Calibration factor response:", response);
      CalibrationFactorModel.factor = newFactor;
      StatusMessageService.setMessage(response, "info");
    }).catch(error => {
      console.error("Error setting calibration factor:", error);
      StatusMessageService.setMessage('Error setting calibration factor.', 'error');
    });
  }
};

export default CalibrationFactorModel;