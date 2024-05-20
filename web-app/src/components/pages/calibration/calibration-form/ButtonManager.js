// ButtonManager.js
const ButtonManager = {
  buttonStates: {
    startEnabled: false,
    stopEnabled: false,
    saveEnabled: false,
  },
  updateButtonStates: function (formState) {
    this.buttonStates = {
      startEnabled: this.isInputValid(formState),
      stopEnabled: formState.isCalibrating,
      saveEnabled: formState.isStopped,
    };
  },
  isInputValid: function (formState) {
    return formState.targetVolume > 0;
  },
  getButtonStates: function () {
    return this.buttonStates;
  },
};

export default ButtonManager;