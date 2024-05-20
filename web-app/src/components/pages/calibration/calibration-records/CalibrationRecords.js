// CalibrationRecords.js
import m from "mithril";
import CalibrationRecordsModel from "models/CalibrationRecordsModel";
import CalibrationTable from "./CalibrationTable";
import IconSpinner from "components/icons/IconSpinner";

const CalibrationRecords = {
  oncreate: function (vnode) {
    CalibrationRecordsModel.loadRecords(); // Load the calibration records
  },

  view: function (vnode) {
    const {
      records,
      isLoading,
      error
    } = CalibrationRecordsModel;
    console.debug("Records: ", records, "isLoading: ", isLoading, "error: ", error, "CalibrationRecordsModel: ", CalibrationRecordsModel);


    return m("div.box", [
      m("h3.title", "Calibration Records"),
      m("h6.subtitle.has-text-grey", "Click on a calibration record or the average summary below to select the scaling factor for your system."),
      isLoading ? m(IconSpinner, {
        isSpinning: true,
        class: "is-large"
      }) : error ? m("p.has-text-danger", error) : records && records.length > 0 ? m(CalibrationTable, {
        calibrations: records
      }) : m("p", "No calibration records found.")
    ]);
  }
};

export default CalibrationRecords;