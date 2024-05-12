// CalibrationButtons.js
import m from "mithril";
import IconCalibrationSpinner from 'icons/IconCalibrationSpinner';

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
        onclick: onStart // Attach the onStart handler
      }, "Start Calibration"),
      m("button.button.is-danger.is-fullwidth", {
        id: "stop-calibration",
        disabled: stopDisabled,
        onclick: onStop // Attach the onStop handler
      }, "Stop Calibration"),
      isCalibrationStarted && m(IconCalibrationSpinner, {
        class: "icon-class",
        style: "width: 10px; height: auto;"
      }),
    ]);
  }
};

export default CalibrationButtons;