// src/models/Calibration.js
var m = require("mithril")

var Calibration = {
  list: [],
  loadList: function () {
    var apiUrl = "http://localhost:3000/calibration-records"; // Target API URL
    return m.request({
        method: "GET",
        url: apiUrl,
        withCredentials: true,
      })
      .then(function (result) {
        Calibration.list = result;
      })
  },
}

module.exports = Calibration;