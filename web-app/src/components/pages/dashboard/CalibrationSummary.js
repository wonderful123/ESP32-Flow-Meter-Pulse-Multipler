import m from "mithril";

const CalibrationSummary = {
  data: {
    mode: "Multi-Temperature Calibration", // Sample data
    targetAmount: 500, // Target in liters
    observedAmount: 495, // Observed in liters
    calibrationFactor: 0.99, // Calculated factor
  },

  view: function () {
    return m("div.content", [
      m("h3.title.is-5", "Calibration Summary"),
      m("div.content", [
        m("p", [m("strong", "Mode: "), m("span", CalibrationSummary.data.mode)]),
        m("p", [m("strong", "Target Amount: "), m("span", CalibrationSummary.data.targetAmount + " liters")]),
        m("p", [m("strong", "Observed Amount: "), m("span", CalibrationSummary.data.observedAmount + " liters")]),
        m("p", [m("strong", "Calibration Factor: "), m("span", CalibrationSummary.data.calibrationFactor)]),
      ]),
    ]);
  },
};

export default CalibrationSummary;
