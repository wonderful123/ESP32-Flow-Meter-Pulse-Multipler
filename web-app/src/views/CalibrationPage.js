// CalibrationPage.js
import m from "mithril";
import SectionContainer from './components/SectionContainer';
import TitleAndSubtitle from "./components/TitleAndSubtitle";
import CalibrationForm from "./calibration-form";
import CalibrationRecords from "./calibration-records";
import CalibrationFactor from "./CalibrationFactor";
import StatusMessageBox from "./components/StatusMessageBox";
import FirmwareUpdate from "./FirmwareUpdate";

const CalibrationPage = {
  view: function () {
    return m(SectionContainer,
      [
        m(TitleAndSubtitle, {
          title: "Pulse Scaling Calibration",
          subtitle: "[Pins: Input D3 and Output D7]"
        }),
        m(CalibrationFactor), // Display the current calibration factor
        m(StatusMessageBox), // Display status messages
        m(CalibrationForm), // Form for submitting new calibration records
        m(CalibrationRecords), // List of existing calibration records
        m(FirmwareUpdate) // Display firmware update component
      ]);
  }
};

export default CalibrationPage;