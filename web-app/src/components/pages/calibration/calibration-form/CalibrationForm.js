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
  oninit: function (vnode) {
    vnode.state.formState = {};
    this.resetForm(vnode);

    vnode.state.pulseCount = PulseCountService.getPulseCount(); // Returns a mithril Stream with the current pulse count
    PulseCountService.pulseCount.map(() => m.redraw()); // Trigger redraw when the stream updates
  },
  resetForm: function (vnode) {
    vnode.state.formState = {
      startEnabled: false,
      stopEnabled: false,
      saveEnabled: false,
      targetVolume: 0,
      observedVolume: 0,
      isCalibrating: false,
      pulsesPerLiter: 0,
      calibrationFactor: 0,
      startButtonText: 'Start Calibration',
    };
  },
  handleTargetVolumeChange: function (vnode, value) {
    vnode.state.formState.targetVolume = value;
    if (value > 0) {
      vnode.state.formState.startEnabled = true;
      this.calculateMetrics(vnode);
    }
  },
  handleObservedVolumeChange: function (vnode, value) {
    vnode.state.formState.observedVolume = value;
    this.calculateMetrics(vnode);
  },
  handleStartClick: function (vnode) {
    vnode.state.formState.isCalibrating = true;
    vnode.state.formState.startEnabled = false;
    vnode.state.formState.stopEnabled = true;
    vnode.state.formState.startButtonText = 'Calibration Running...';
    CalibrationService.startCounter();
  },
  handleStopClick: function (vnode) {
    vnode.state.formState.isCalibrating = false;
    vnode.state.formState.startEnabled = true;
    vnode.state.formState.stopEnabled = false;
    if (vnode.state.formState.targetVolume > 0) {
      vnode.state.formState.startButtonText = 'Restart Calibration';
    } else {
      vnode.state.formState.startButtonText = 'Start Calibration';
    }
    CalibrationService.stopCounter();
    this.calculateMetrics(vnode);
  },
  handleSaveClick: function (vnode) {
    // Perform save action
    console.log('Save button clicked');
  },
  calculateMetrics: function (vnode) {
    const {
      targetVolume,
      observedVolume,
    } = vnode.state.formState;
    const pulseCount = vnode.state.pulseCount();
    vnode.state.formState.pulsesPerLiter = calculatePulsesPerLiter(pulseCount, observedVolume);
    vnode.state.formState.calibrationFactor = calculateCalibrationFactor(targetVolume, observedVolume);
  },
  view: function (vnode) {
    const {
      formState,
      pulseCount
    } = vnode.state;
    return [
      m("h2.title.is-spaced", "Calibration Process:"),
      m("h3.subtitle.is-4.has-text-weight-semibold", "Step 1: Enter Target Volume"),
      this.renderTargetVolumeInputField(vnode),
      m("h3.subtitle.is-4.has-text-weight-bold", "Step 2: Run Calibration"),
      m(Button, {
        text: formState.startButtonText,
        onclick: () => this.handleStartClick(vnode),
        enabled: formState.startEnabled,
        classes: 'is-info'
      }),
      m(Button, {
        text: "Stop Calibration",
        onclick: () => this.handleStopClick(vnode),
        enabled: formState.stopEnabled,
        classes: 'is-danger'
      }),
      m("h3.subtitle.is-4.has-text-weight-semibold", "Step 3: Enter Observed Volume"),
      this.renderObservedVolumeInput(vnode),
      m(PulseMetrics, {
        pulseCount: pulseCount(),
        pulsesPerLiter: formState.pulsesPerLiter,
        calibrationFactor: formState.calibrationFactor,
      }),
    ];
  },
  renderTargetVolumeInputField(vnode) {
    const {
      formState
    } = vnode.state;
    return m(VolumeInputField, {
      id: "target-volume",
      label: "Step 1: Enter Target Volume (Liters)",
      units: "Liters",
      tooltip: "Enter the desired target volume for calibration.",
      name: "targetVolume",
      placeholder: "Enter target volume",
      value: formState.targetVolume,
      oninput: (e) => this.handleTargetVolumeChange(vnode, e.target.value),
    });
  },

  renderObservedVolumeInput(vnode) {
    const {
      formState
    } = vnode.state;
    return m(VolumeInputField, {
      id: "observed-volume",
      label: "Step 3: Enter Observed Volume (Liters)",
      units: "Liters",
      tooltip: "Enter the observed volume in liters.",
      name: "observedVolume",
      placeholder: "Enter observed volume",
      value: formState.observedVolume,
      oninput: (e) => this.handleObservedVolumeChange(vnode, e.target.value),
    });
  },
};

export default CalibrationForm;