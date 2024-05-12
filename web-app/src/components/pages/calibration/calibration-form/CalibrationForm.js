// CalibrationForm.js
import m from "mithril";
import VolumeInput from "./VolumeInput";
import CalibrationButtons from "./CalibrationButtons";
import PulseMetrics from "./PulseMetrics";
import CalibrationService from "services/CalibrationService";
import PulseCountService from "services/PulseCountService";
import {
  calculatePulsesPerLiter,
  calculateCalibrationFactor
} from './CalibrationUtils';

const CalibrationForm = {
  formState: {
    targetVolume: '',
    observedVolume: '',
    pulseCount: 0,
    pulsesPerLiter: 0,
    calibrationFactor: null,
    isCalibrationStarted: false,
    canSaveCalibration: false,
  },

  oninit() {
    PulseCountService.pulseCount.map(this.updatePulseCount.bind(this));
  },

  updatePulseCount(pulseCount) {
    this.formState.pulseCount = pulseCount;
    this.calculateMetrics();
  },

  calculateMetrics() {
    const {
      targetVolume,
      observedVolume,
      pulseCount
    } = this.formState;
    const parsedTargetVolume = parseFloat(targetVolume);
    const parsedObservedVolume = parseFloat(observedVolume);

    if (isNaN(parsedTargetVolume) || isNaN(parsedObservedVolume) || parsedObservedVolume === 0) {
      this.formState.pulsesPerLiter = 0;
      this.formState.calibrationFactor = 'N/A';
    } else {
      this.formState.pulsesPerLiter = calculatePulsesPerLiter(pulseCount, parsedObservedVolume);
      this.formState.calibrationFactor = calculateCalibrationFactor(parsedTargetVolume, parsedObservedVolume);
    }
  },

  clearForm() {
    Object.assign(this.formState, {
      targetVolume: '',
      observedVolume: '',
      pulseCount: 0,
      pulsesPerLiter: 0,
      calibrationFactor: null,
      isCalibrationStarted: false,
      canSaveCalibration: false,
    });

    CalibrationService.resetCounter();
  },

  validateTargetVolume() {
    const targetVolume = parseFloat(this.formState.targetVolume);
    return !isNaN(targetVolume) && targetVolume > 0;
  },

  saveCalibration() {
    const {
      targetVolume,
      observedVolume,
      pulseCount
    } = this.formState;
    const record = {
      targetVolume: parseFloat(targetVolume),
      observedVolume: parseFloat(observedVolume),
      pulseCount: parseInt(pulseCount, 10)
    };

    CalibrationRecordsModel.saveRecord(record).then(this.clearForm.bind(this));
  },

  view() {
    const {
      targetVolume,
      observedVolume,
      pulseCount,
      pulsesPerLiter,
      calibrationFactor,
      isCalibrationStarted,
      canSaveCalibration,
    } = this.formState;

    return m("div.box#calibration-form", [
      this.renderTitle(),
      this.renderTargetVolumeInput(),
      this.renderCalibrationButtons(),
      this.renderObservedVolumeInput(),
      this.renderPulseMetrics(),
      this.renderButtons(),
    ]);
  },

  renderTitle() {
    return m("h2.title", "Calibration Process:");
  },

  renderTargetVolumeInput() {
    return m(VolumeInput, {
      id: "target-volume",
      label: "Step 1: Enter Target Volume",
      units: "Liters",
      tooltip: "Enter the desired target volume for calibration.",
      name: "targetVolume",
      placeholder: "Enter target volume",
      value: this.formState.targetVolume,
      oninput: (e) => {
        this.formState.targetVolume = e.target.value;
        this.calculateMetrics();
      }
    });
  },

  renderCalibrationButtons() {
    return m(CalibrationButtons, {
      onStart: () => {
        this.formState.isCalibrationStarted = true;
        this.formState.pulseCount = 0;
        CalibrationService.startCounter();
      },
      onStop: () => {
        this.formState.isCalibrationStarted = false;
        this.formState.canSaveCalibration = true;
        CalibrationService.stopCounter();
      },
      startDisabled: !this.validateTargetVolume(),
      stopDisabled: !this.formState.isCalibrationStarted,
    });
  },

  renderObservedVolumeInput() {
    return m(VolumeInput, {
      id: "observed-volume",
      label: "Step 3: Enter Observed Volume (Liters)",
      name: "observedVolume",
      placeholder: "Enter observed volume in liters",
      value: this.formState.observedVolume,
      oninput: (e) => {
        this.formState.observedVolume = e.target.value;
        this.calculateMetrics();
      },
    });
  },

  renderPulseMetrics() {
    return m(PulseMetrics, {
      pulseCount: this.formState.pulseCount,
      pulsesPerLiter: this.formState.pulsesPerLiter,
      calibrationFactor: this.formState.calibrationFactor !== null ? this.formState.calibrationFactor : 'N/A',
    });
  },

  renderButtons() {
    return m("div.buttons", [
      m("button.button.is-success.is-fullwidth", {
        id: "submit-calibration",
        disabled: !this.formState.canSaveCalibration,
        onclick: this.saveCalibration.bind(this)
      }, "Save Calibration"),
      m("button.button.is-link.is-fullwidth", {
        onclick: this.clearForm.bind(this)
      }, "Reset Counter/Form"),
    ]);
  },
};

export default CalibrationForm;