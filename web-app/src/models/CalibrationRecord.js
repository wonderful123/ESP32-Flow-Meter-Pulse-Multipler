// CalibrationRecord.js
const CalibrationRecord = {
  id: '',
  timestamp: '',
  temperature: 0,
  pulseCount: 0,
  oilVolume: 0,
  calibrationFactor: 0,

  fromJSON: function (json) {
    this.id = json.id;
    this.timestamp = json.timestamp;
    this.oilTemperature = json.oilTemperature;
    this.oilVolume = json.oilVolume;
    this.pulseCount = json.pulseCount;
    this.calibrationFactor = json.calibrationFactor;
  },

  toJSON: function () {
    return {
      id: this.id,
      timestamp: this.timestamp,
      oilTemperature: this.oilTemperature,
      oilVolume: this.oilVolume,
      pulseCount: this.pulseCount,
      calibrationFactor: this.calibrationFactor,
    };
  },
};

export default CalibrationRecord;