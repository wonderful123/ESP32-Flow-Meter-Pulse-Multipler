// CalibrationButtons.js
import m from "mithril";

const CalibrationButtons = {
  view: function (vnode) {
    const {
      onStart,
      onStop,
      startDisabled,
      stopDisabled,
      isCalibrationStarted
    } = vnode.attrs;

    return m("div.buttons", [
      m("label.label", "Step 2: Run Calibration"),
      m("button.button.is-info.is-fullwidth", {
        id: "start-calibration",
        disabled: startDisabled,
        onclick: () => {
          onStart();
          vnode.state.startDisabled = true;
          vnode.state.stopDisabled = false;
        }
      }, "Start Calibration"),
      m("button.button.is-danger.is-fullwidth", {
        id: "stop-calibration",
        disabled: stopDisabled,
        onclick: () => {
          onStop();
          vnode.state.startDisabled = !vnode.attrs.isTargetVolumeValid;
          vnode.state.stopDisabled = true;
        }
      }, "Stop Calibration")
    ]);
  }
};

export default CalibrationButtons;