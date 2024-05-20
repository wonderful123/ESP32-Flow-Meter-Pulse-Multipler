// CalibrationForm.js
import m from 'mithril';
import StatusMessageService from 'services/StatusMessageService';
import Button from 'components/common/Button';
import VolumeInputField from './VolumeInputField';
import ButtonManager from './ButtonManager';
import PulseMetrics from './PulseMetrics';
import {
  calculatePulsesPerLiter,
  calculateCalibrationFactor
} from './CalibrationUtils';
import CalibrationService from 'services/CalibrationService';
import PulseCountService from 'services/PulseCountService';

const CalibrationForm = {
  formState: {
    startEnabled: true,
    stopEnabled: false,
    saveEnabled: false,
    targetVolume: 0,
    observedVolume: 0,
    isCalibrating: false,
    pulseCount: 0,
    pulsesPerLiter: 0,
    calibrationFactor: 0,
  },
  resetForm: function () {
    this.formState = {
      startEnabled: true,
      stopEnabled: false,
      saveEnabled: false,
      targetVolume: 0,
      observedVolume: 0,
      isCalibrating: false,
      pulseCount: 0,
      pulsesPerLiter: 0,
      calibrationFactor: 0,
    };
  },
  oninit: function (vnode) {
    this.resetForm();
    this.pulseCountSubscription = PulseCountService.getPulseCount().subscribe((pulseCount) => {
      this.formState.pulseCount = pulseCount;
      m.redraw(); // Trigger a redraw to update the view
    });
  },
  onremove: function (vnode) {
    this.pulseCountSubscription.unsubscribe();
  },
  handleTargetVolumeChange: function (value) {
    this.formState.targetVolume = value;
  },
  handleStartClick: function () {
    this.formState.isCalibrating = true;
    this.formState.startEnabled = false;
    this.formState.stopEnabled = true;
    CalibrationService.startCounter();
  },
  handleStopClick: function () {
    this.formState.isCalibrating = false;
    this.formState.startEnabled = true;
    this.formState.stopEnabled = false;
    CalibrationService.stopCounter();
    this.calculateMetrics(); // Calculate metrics when calibration is stopped
  },
  handleSaveClick: function () {
    // Perform save action
    console.log('Save button clicked');
  },
  calculateMetrics: function () {
    const {
      targetVolume,
      observedVolume,
      pulseCount
    } = this.formState;
    this.formState.pulsesPerLiter = calculatePulsesPerLiter(pulseCount, observedVolume);
    this.formState.calibrationFactor = calculateCalibrationFactor(targetVolume, observedVolume);
  },
  view: function () {
    return [
      m("h2.title", "Calibration Process:"),
      m("h3.subtitle", "Step 1: Enter Target Volume"),
      this.renderTargetVolumeInputField(),
      m("label.label", "Step 2: Run Calibration"),
      m(Button, {
        text: "Start Calibration",
        onclick: () => this.handleStartClick(),
        enabled: this.formState.startEnabled,
        classes: 'is-info'
      }),
      m(Button, {
        text: "Stop Calibration",
        onclick: () => this.handleStopClick(),
        enabled: this.formState.stopEnabled,
        classes: 'is-danger'
      }),
      m("h3.subtitle", "Step 3: Enter Observed Volume"),
      this.renderObservedVolumeInput(),
      m(PulseMetrics, {
        pulseCount: this.formState.pulseCount,
        pulsesPerLiter: this.formState.pulsesPerLiter,
        calibrationFactor: this.formState.calibrationFactor,
      }),
    ];
  },
  renderTargetVolumeInputField() {
    return m(VolumeInputField, {
      id: "target-volume",
      label: "Step 1: Enter Target Volume (Liters)",
      units: "Liters",
      tooltip: "Enter the desired target volume for calibration.",
      name: "targetVolume",
      placeholder: "Enter target volume",
      value: this.formState.targetVolume,
      oninput: (e) => {
        this.formState.targetVolume = e.target.value;
        this.calculateMetrics();
      },
    });
  },
  renderObservedVolumeInput() {
    return m(VolumeInputField, {
      id: "observed-volume",
      label: "Step 3: Enter Observed Volume (Liters)",
      units: "Liters",
      tooltip: "Enter the observed volume in liters.",
      name: "observedVolume",
      placeholder: "Enter observed volume",
      value: this.formState.observedVolume,
      oninput: (e) => {
        this.formState.observedVolume = e.target.value;
        this.calculateMetrics();
      },
    });
  },
};

export default CalibrationForm;