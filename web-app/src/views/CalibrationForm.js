var m = require("mithril");

var CalibrationForm = {
  view: function () {
    return m("form.calibration-form", [
      m("label.label", "Target Volume"),
      m("input.input[type=number][placeholder=Target Volume]"),
      m("label.label", "Observed Volume"),
      m("input.input[type=number][placeholder=Observed Volume]"),
      m("button.button[type=submit]", "Add Calibration Record"),
    ]);
  }
};

module.exports = CalibrationForm;