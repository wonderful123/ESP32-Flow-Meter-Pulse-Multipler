// CalibrationButtons.js
import m from "mithril";

const CalibrationButtons = {
  view: function () {
    return m("div.buttons", [
      m("label.label", "Step 2: Run Calibration"),
      m("button.button.is-info.is-fullwidth", {
        id: "start-calibration"
      }, "Start Calibration"),
      m("button.button.is-danger.is-fullwidth", {
        id: "stop-calibration"
      }, "Stop Calibration")
    ]);
  }
};

export default CalibrationButtons;
