import m from "mithril";
import CalibrationForm from "./CalibrationForm";
import CalibrationList from "./CalibrationList";
import CalibrationFactor from "./CalibrationFactor";
import Calibration from "../models/Calibration";

const CalibrationPage = {
  oninit: function () {
    Calibration.loadList();
  },
  view: function () {
    return m("div", [
      m("h1.title has-text-centered", "Pulse Scaling Calibration"),
      m(CalibrationFactor), // Display the current calibration factor
      m(CalibrationForm), // Form for submitting new calibration records
      m(CalibrationList), // List of existing calibration records
    ]);
  }
};

export default CalibrationPage;