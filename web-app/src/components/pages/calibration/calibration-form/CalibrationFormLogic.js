import PulseCountService from "services/PulseCountService";
import CalibrationRecordsService from "services/CalibrationRecordsService";
import CalibrationService from "services/CalibrationService";

const CalibrationFormLogic = {
  targetVolume: 0.0,
  observedVolume: 0.0,
  pulseCount: 0,
  isFormValid: false,
  selectedMode: "fixed", // default mode

  setSelectedMode(mode) {
    this.selectedMode = mode;
  },

  setTargetVolume(value) {
    this.targetVolume = parseFloat(value);
    this.validateForm();
  },

  setObservedVolume(value) {
    this.observedVolume = parseFloat(value);
    this.validateForm();
  },

  setPulseCount(value) {
    this.pulseCount = parseInt(value, 10); // Assuming pulse count should be an integer
    this.validateForm();
  },

  getTargetVolume() {
    return this.targetVolume;
  },

  getObservedVolume() {
    return this.observedVolume;
  },

  getPulseCount() {
    return this.pulseCount;
  },

  validateForm() {
    const pulseCount = PulseCountService.getInputPulseCount();
    this.isFormValid = this.targetVolume > 0 && this.observedVolume > 0; //&& pulseCount > 0;
  },

  async saveCalibration() {
    if (!this.isFormValid) {
      throw new Error("Form is not valid. Please check the input values.");
    }

    try {
      const pulseCount = PulseCountService.getInputPulseCount();
      const data = {
        targetOilVolume: this.targetVolume,
        observedOilVolume: this.observedVolume,
        pulseCount,
        oilTemperature: 25.0, // Example value; adjust as needed
      };

      let response;

      if (this.selectedMode === "fixed") {
        // For fixed mode, calculate the fixed calibration factor
        const calibrationFactor = this.observedVolume / this.targetVolume;

        // Use CalibrationService to set the fixed calibration factor
        await CalibrationService.setFixedCalibrationFactor(calibrationFactor);
        response = { message: "Fixed calibration factor saved successfully." };
      } else if (this.selectedMode === "temperature") {
        // For temperature mode, create a calibration record
        response = await CalibrationRecordsService.createCalibrationRecord(data);
      } else {
        throw new Error(`Unknown calibration mode: ${this.selectedMode}`);
      }

      this.resetForm(); // Reset form fields upon successful save
      return { status: "success", message: response.message };
    } catch (error) {
      throw new Error(error.message || "Failed to save calibration.");
    }
  },

  resetForm() {
    this.targetVolume = 0.0;
    this.observedVolume = 0.0;
    this.pulseCount = 0;
    this.isFormValid = false;
  },
};

export default CalibrationFormLogic;
