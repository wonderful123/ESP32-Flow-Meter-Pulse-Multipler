// models/CalibrationRecord.js
class CalibrationRecord {
  constructor(data) {
    this.oilTemperature = data.oilTemperature;
    this.pulseCount = data.pulseCount;
    this.targetOilVolume = data.targetOilVolume;
    this.observedOilVolume = data.observedOilVolume;
    this.calibrationFactor = this.calculateCalibrationFactor();
    this.timestamp = new Date().toISOString();
  }

  calculateCalibrationFactor() {
    return this.observedOilVolume / this.targetOilVolume;
  }
}
export default CalibrationRecord;