// CalibrationPage.js
import m from "mithril";
import SectionContainer from 'components/common/SectionContainer';
import TitleAndSubtitle from "components/common/TitleAndSubtitle";
// import CalibrationForm from "./calibration-form/CalibrationForm"
// import CalibrationRecords from "./calibration-records/CalibrationRecords";
// import CalibrationFactor from "./CalibrationFactor";

const CalibrationPage = {
  view: function () {
    return m(SectionContainer,
      [
        m(TitleAndSubtitle, {
          title: "Pulse Scaling Calibration",
          subtitle: "[Pins: Input D3 and Output D7]"
        }),
        // m(CalibrationFactor), // Display the current calibration factor
        // m(CalibrationForm), // Form for submitting new calibration records
        m("hr"),
        // m(CalibrationRecords), // List of existing calibration records
      ]);
  }
};

export default CalibrationPage;