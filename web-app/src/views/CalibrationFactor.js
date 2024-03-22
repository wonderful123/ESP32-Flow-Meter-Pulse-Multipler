var m = require("mithril");
var CalibrationFactorModel = require("../models/CalibrationFactorModel");

var CalibrationFactor = {
  oninit: CalibrationFactorModel.loadCalibrationFactor,
  view: function () {
    return m("div.calibration-factor", [
      m("h3", "Current Calibration Factor"),
      CalibrationFactorModel.factor !== null ? m("p", CalibrationFactorModel.factor) : m("p", "Loading...")
    ]);
  }
};

module.exports = CalibrationFactor;
