// ButtonManager.js
const ButtonManager = {
  init: function (formState) {
    this.formState = formState;
  },

  updateButtonStates: function () {
    this.buttonStates = {
      startDisabled: this.isInputValid(),
      stopEnabled: this.formState.isCalibrating,
      saveEnabled: this.formState.isStopped,
    };
  },

  isInputValid: function () {
    return this.formState.targetVolume.trim() !== '';
  },

  getButtonStates: function () {
    return this.buttonStates;
  },
};

export default ButtonManager;