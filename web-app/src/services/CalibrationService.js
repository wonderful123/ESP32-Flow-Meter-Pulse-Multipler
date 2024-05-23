// CalibrationService.js
import m from "mithril";
import StatusMessageService from "services/StatusMessageService";

const CalibrationService = {
  startCounter: () => {
    // Send request to /calibration/start
    m.request({
      method: "GET",
      url: "api/calibration/start"
    }).then(response => {
      StatusMessageService.setMessage(response.message, "success");
    }).catch(error => {
      console.error("Error starting calibration:", error);
    });
  },
  stopCounter: () => {
    // Send request to /calibration/stop
    m.request({
      method: "GET",
      url: "api/calibration/stop"
    }).then(response => {
      StatusMessageService.setMessage(response.message, "info");
    }).catch(error => {
      console.error("Error stopping calibration:", error);
    });;
  },
  resetCounter: () => {
    // Send reset request to /calibration/reset
    m.request({
      method: "GET",
      url: "api/calibration/reset"
    }).then(response => {
      StatusMessageService.setMessage(response.message, "info");
    }).catch(error => {
      console.error("Error stopping calibration:", error);
    });
  },
};

export default CalibrationService;