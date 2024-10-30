import m from "mithril";
import CalibrationButton from "./CalibrationButton";
import { resetCalibration, startCalibration, stopCalibration, getCalibrationMode } from "services/CalibrationService";
import PulseCountService from "services/PulseCountService";

const setStatus = (message, statusClass) => {
  CalibrationControl.statusMessage = message;
  CalibrationControl.statusClass = statusClass;
  m.redraw();
};

const handleError = (error, defaultMessage) => {
  console.error("Error:", error);
  setStatus(error.message || defaultMessage, "is-danger");
};

const handleResponse = (response, onSuccess, onError) => {
  if (response.status === "success") {
    onSuccess(response);
  } else {
    onError(response.message || "Unknown error occurred");
  }
};

const handleCalibrationAction = async (action, onSuccess, defaultErrorMessage, isLoadingKey) => {
  if (CalibrationControl.isLoading[isLoadingKey]) return;
  CalibrationControl.isLoading[isLoadingKey] = true;
  try {
    const response = await action();
    handleResponse(response, onSuccess, msg => handleError(new Error(msg), defaultErrorMessage));
  } catch (error) {
    handleError(error, defaultErrorMessage);
  } finally {
    CalibrationControl.isLoading[isLoadingKey] = false;
  }
};

const CalibrationControl = {
  pulseCount: 0,
  statusMessage: "Ready to calibrate.",
  statusClass: "notification is-dark",
  isLoading: { start: false, stop: false, reset: false },
  isCalibrating: false,
  calibrationMode: "fixed",

  oninit() {
    // Fetch the current mode when the component initializes
    getCalibrationMode().then(mode => {
      this.calibrationMode = mode;
      m.redraw();
    });
  },

  handleStartCalibration() {
    handleCalibrationAction(
      startCalibration,
      this.startCalibrationSuccess.bind(this),
      "Failed to start calibration.",
      "start"
    );
  },

  handleStopCalibration() {
    handleCalibrationAction(
      stopCalibration,
      this.stopCalibrationSuccess.bind(this),
      "Failed to stop calibration.",
      "stop"
    );
  },

  handleResetCalibration() {
    handleCalibrationAction(
      resetCalibration,
      this.resetCalibrationSuccess.bind(this),
      "Failed to reset calibration.",
      "reset"
    );
  },

  startCalibrationSuccess(response) {
    this.pulseCount = response.pulseCount || this.pulseCount;
    this.isCalibrating = true;
    setStatus(response.message, "is-success");
  },

  stopCalibrationSuccess(response) {
    this.pulseCount = response.pulseCount || PulseCountService.getInputPulseCount();
    this.isCalibrating = false;
    setStatus(response.message, "is-link");
  },

  resetCalibrationSuccess(response) {
    this.pulseCount = 0;
    setStatus(response.message, "is-link");
  },

  view() {
    return m("div", { class: "calibration-controls container" }, [
      m("div", { class: "buttons mb-0" }, [
        m(CalibrationButton, {
          className: "is-link",
          label: "Start Calibration",
          action: this.handleStartCalibration.bind(this),
          isLoading: this.isLoading.start,
          isDisabled: this.isLoading.start || this.isCalibrating,
        }),

        m(CalibrationButton, {
          className: "is-link",
          label: "Stop Calibration",
          action: this.handleStopCalibration.bind(this),
          isLoading: this.isLoading.stop,
          isDisabled: this.isLoading.stop || !this.isCalibrating,
        }),

        m(CalibrationButton, {
          className: "is-danger",
          label: "Reset Calibration",
          action: this.handleResetCalibration.bind(this),
          isLoading: this.isLoading.reset,
          isDisabled: this.isLoading.reset,
        }),
      ]),

      this.statusMessage ? m("div", { class: `notification mb-5 ${this.statusClass}` }, this.statusMessage) : null
    ]);
  },
};

export default CalibrationControl;
