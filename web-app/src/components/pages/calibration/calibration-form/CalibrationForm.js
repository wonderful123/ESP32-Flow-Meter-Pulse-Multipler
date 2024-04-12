// CalibrationForm.js
import m from "mithril";
import VolumeInput from "./VolumeInput";
import CalibrationButtons from "./CalibrationButtons";
import PulseInfoDisplay from "./PulseInfoDisplay";

const CalibrationForm = {
  formState: {
    targetVolume: '',
    observedVolume: '',
    pulseCount: '0',
    pulsesPerLiter: '0.00',
    calibrationFactor: 'N/A',
    isCalibrationStarted: false,
    canSaveCalibration: false,
  },

  clearForm: function () {
    this.formState.targetVolume = '';
    this.formState.observedVolume = '';
    this.formState.pulseCount = '0';
    this.formState.pulsesPerLiter = '0.00';
    this.formState.calibrationFactor = 'N/A';
    this.formState.isCalibrationStarted = false;
    this.formState.canSaveCalibration = false;
  },

  calculateMetrics: function () {
    const targetVolume = parseFloat(this.formState.targetVolume);
    const observedVolume = parseFloat(this.formState.observedVolume);
    const pulseCount = parseInt(this.formState.pulseCount, 10);

    if (!isNaN(observedVolume) && observedVolume > 0) {
      const pulsesPerLitre = pulseCount / observedVolume;
      this.formState.pulsesPerLitre = pulsesPerLitre.toFixed(2);

      if (!isNaN(targetVolume) && targetVolume > 0) {
        const scalingFactor = (targetVolume / observedVolume) * 100;
        this.formState.calibrationFactor = `${scalingFactor.toFixed(2)}%`;
      } else {
        this.formState.calibrationFactor = 'N/A';
      }
    } else {
      this.formState.pulsesPerLiter = 'N/A';
      this.formState.calibrationFactor = 'N/A';
    }
  },

  view: function () {
    return m("div.box#calibration-form", [
      m("h2.title", "Calibration Process:"),
      // Pass in form state and methods as attributes to child components
      m(VolumeInput, {
        id: "target-volume",
        label: "Step 1: Enter Target Volume (Liters)",
        name: "targetVolume",
        placeholder: "Enter target volume in liters",
        value: this.formState.targetVolume,
        onInput: (value) => this.formState.targetVolume = value // Assuming VolumeInput handles this
      }),
      m(CalibrationButtons, {
        onStart: () => this.formState.isCalibrationStarted = true,
        onStop: () => this.formState.isCalibrationStarted = false,
        startDisabled: !this.formState.isCalibrationStarted,
        stopDisabled: this.formState.isCalibrationStarted,
      }),
      m(VolumeInput, {
        id: "observed-volume",
        label: "Step 3: Enter Observed Volume (Liters)",
        name: "observedVolume",
        placeholder: "Enter observed volume in liters",
        value: this.formState.observedVolume,
        oninput: (e) => {
          this.formState.observedVolume = e.target.value;
          this.calculateMetrics();
        },
      }),
      m(PulseInfoDisplay, {
        label: "Pulse Count",
        value: this.formState.pulseCount
      }),
      m(PulseInfoDisplay, {
        label: "Pulses/Liter",
        value: this.formState.pulsesPerLiter
      }),
      m(PulseInfoDisplay, {
        label: "Output Calibration Factor (%)",
        value: this.formState.calibrationFactor
      }),
      m("div.buttons", [
        m("button.button.is-success.is-fullwidth", {
          id: "submit-calibration",
          disabled: !this.formState.canSaveCalibration,
          onclick: () => {
            /* handle save */
          }
        }, "Save Calibration"),
        m("button.button.is-link.is-fullwidth", {
          onclick: () => {
            onclick: () => this.clearForm()
          }
        }, "Clear Form"),
      ])
    ]);
  }
};

export default CalibrationForm;