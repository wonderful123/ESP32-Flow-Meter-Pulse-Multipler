// index.js
import m from "mithril";
import CalibrationRecordsModel from "models/CalibrationRecordsModel";
import CalibrationTable from "./CalibrationTable"; // Import the CalibrationTable component

const CalibrationRecords = {
  oninit: function (vnode) {
    CalibrationRecordsModel.loadRecords(); // Load the calibration records
  },
  view: function (vnode) {
    return m("div.box", [
      m("h3.title", "Calibration Records", [
        m("h6.subtitle.has-text-grey", "Click on a calibration record or the average summary below to select the scaling factor for your system.")
      ]),
      CalibrationRecordsModel.records.length > 0 ?
      m(CalibrationTable, {
        calibrations: CalibrationRecordsModel.records
      }) :
      m("p", "No calibration records available.")
    ]);
  }
};

export default CalibrationRecords;