// src/views/CalibrationList.js
var m = require("mithril")
var Calibration = require("../models/Calibration")

module.exports = {
  oninit: Calibration.loadList,
  view: function () {
    return m(".calibration-list", Calibration.list.map(function (item) {
      const pulsesPerLitre = item.observedVolume > 0 ? (item.pulseCount / item.observedVolume).toFixed(0) : "N/A";

      return m(".calibration-list-item", item.id + " " + item.targetVolume + " " + item.observedVolume + " " +
        item.pulseCount + " " + pulsesPerLitre);
    }))
  }
}