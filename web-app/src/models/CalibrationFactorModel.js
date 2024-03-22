var m = require("mithril");

var CalibrationFactorModel = {
  factor: null,
  loadCalibrationFactor: function () {
    var apiUrl = "http://localhost:3000/calibration-factor"; // Adjust URL as needed
    return m.request({
      method: "GET",
      url: apiUrl,
      withCredentials: true,
    }).then(result => {
      console.log("Result", result)
      CalibrationFactorModel.factor = result.calibrationFactor // Adjust based on API response structure
    });
  }
};

module.exports = CalibrationFactorModel;