// CalibrationFactor.js
import m from "mithril";
import CalibrationFactorModel from "models/CalibrationFactorModel";

const CalibrationFactor = {
  oninit: CalibrationFactorModel.loadCalibrationFactor,
  view: function () {
    const currentCalibrationFactor = (CalibrationFactorModel.factor !== null && CalibrationFactorModel.factor !== undefined) ?
      CalibrationFactorModel.factor.toFixed(2) :
      "Loading...";

    return m("div.box#calibration-factor-container", {
      class: "is-flex is-justify-content-space-between p-0"
    }, [
      // Subtitle on the left half of the box
      m("div", {
        class: "flex-grow-1 is-align-self-center"
      }, [
        m("h4.subtitle.p-5", "Current Device Output Calibration Factor:")
      ]),
      // Calibration factor on the right half of the box
      m("div", {
        class: "flex-grow-1 is-align-self-center"
      }, [
        m("div.notification#current-calibration-factor.px-6.py-5", [m("h4.subtitle", currentCalibrationFactor)])
      ])
    ])
  }
};

export default CalibrationFactor;