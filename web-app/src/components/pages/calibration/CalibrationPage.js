// CalibrationPage.js

import m from "mithril";
import SectionContainer from "components/common/SectionContainer";
import TitleAndSubtitle from "components/common/TitleAndSubtitle";
import ModeSelector from "./ModeSelector";
import CalibrationForm from "./calibration-form/CalibrationForm";
import CalibrationService from "services/CalibrationService";
import FixedCalibrationDisplay from "components/common/FixedCalibrationDisplay";
import Chart from "./calibration-records/Chart";
import Table from "./calibration-records/Table";

const CalibrationPage = {
  selectedMode: "fixed",

  oninit() {
    // Optionally, initialize selectedMode from the backend
    CalibrationService.getCalibrationMode().then(data => {
      this.selectedMode = data.mode;
      m.redraw();
    });
  },

  handleModeChange(mode) {
    this.selectedMode = mode;
    CalibrationService.setCalibrationMode(mode).then(() => {
      console.log(`Calibration mode set to ${mode}`);
    });
  },

  view() {
    const hasRecords = this.selectedMode === "temperature" && this.records && this.records.length > 0;
    return m(SectionContainer, [
      m(TitleAndSubtitle, {
        title: "Pulse Scaling Calibration",
        subtitle: "[Pins: Input D3 and Output D7]",
      }),
      m(ModeSelector, {
        selectedMode: this.selectedMode,
        onModeChange: this.handleModeChange.bind(this),
      }),
      this.selectedMode === "fixed" ? m(FixedCalibrationDisplay) : null,
      this.selectedMode === "temperature"
        ? [
          m("hr"),
          m(Chart),
          m("hr"),
          m(Table),
          !hasRecords && m("div.notification is-info", "No calibration records saved.")
        ]
        : null,
      m(CalibrationForm, { selectedMode: this.selectedMode }),
    ]);
  }
};

export default CalibrationPage;
