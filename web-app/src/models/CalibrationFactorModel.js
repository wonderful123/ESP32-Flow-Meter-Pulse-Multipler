// CalibrationFactorModel.js
import m from "mithril";
import StatusMessageService from "services/StatusMessageService";

const CalibrationFactorModel = {
  factor: null,
  errorMessage: "",
  loadCalibrationFactor: function () {
    const apiUrl = "http://localhost:3000/calibration-factor"; // Adjust URL as needed
    return m.request({
      method: "GET",
      url: apiUrl,
      withCredentials: true,
    }).then(result => {
      CalibrationFactorModel.factor = result.calibrationFactor; // Adjust based on API response structure
    }).catch(error => {
      console.error("Error loading calibration factor:", error);
      StatusMessageService.setMessage('Error loading scaling factor.', 'error');
    });
  },
  setCalibrationFactor: function (newFactor) {
    // Here you might want to make an API call to update the factor in the backend as well
    this.factor = newFactor;
    // Optionally update the status message to reflect the change
    StatusMessageService.setMessage(`Calibration factor set to ${newFactor}.`, "info");
  }
};

export default CalibrationFactorModel;
