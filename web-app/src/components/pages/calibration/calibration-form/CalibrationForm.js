// CalibrationForm.js
import m from 'mithril';
import StatusMessageService from 'services/StatusMessageService';
import Button from 'components/common/Button';

import VolumeInputField from './VolumeInputField';
import ButtonManager from './ButtonManager';

const CalibrationForm = {
  formState: {
    startEnabled: false,
    stopEnabled: false,
    saveEnabled: false,
    targetVolume: 0,
    observedVolume: 0,
    isCalibrating: false,
  },

  resetForm: function () {
    this.formState = {
      startEnabled: false,
      stopEnabled: false,
      saveEnabled: false,
      targetVolume: 0,
      observedVolume: 0,
      isCalibrating: false,
    };
  },

  oninit: function (vnode) {
    this.resetForm();
    ButtonManager.init(this.formState);
  },

  handleTargetVolumeChange: function (value) {
    this.formState.targetVolume = value;
    ButtonManager.updateButtonStates();
  },

  handleStartClick: function () {
    this.formState.isCalibrating = true;
    ButtonManager.updateButtonStates();
  },

  handleStopClick: function () {
    this.formState.isCalibrating = false;
    ButtonManager.updateButtonStates();
  },

  handleSaveClick: function () {
    // Perform save action
    console.log('Save button clicked');
  },

  view: function () {
    const buttonStates = ButtonManager.getButtonStates();

    return [
      m("h2.title", "Calibration Process:"),
      m("h3.subtitle", "Step 1: Enter Target Volume"),
      this.renderTargetVolumeInputField(),

      m("label.label", "Step 2: Run Calibration"),
      m(Button, {
        text: "Start Calibration",
        onclick: this.handleStartClick,
        enabled: buttonStates.startEnabled
      }),
      m(Button, {
        text: "Stop Calibration",
        onclick: this.handleStopClick,
        enabled: buttonStates.stopEnabled
      }),

      m("h3.subtitle", "Step 3: Enter Observed Volume"),
      this.renderObservedVolumeInput(),
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
        this.ButtonManager.updateButtonStates();
      }
    });
  },

  renderObservedVolumeInput() {
    return m(VolumeInput, {
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
        this.ButtonManager.updateButtonStates();
      },
    });
  }
};

export default CalibrationForm;