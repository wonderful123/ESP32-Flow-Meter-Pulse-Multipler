// CalibrationRecords/Table/utils.js
export const calibrationFactor = (targetOilVolume, observedOilVolume) => {
  return (observedOilVolume / targetOilVolume * 100).toFixed(1) + '%';
};

export const pulsesPerLiter = (pulseCount, targetOilVolume) => {
  return (pulseCount / targetOilVolume).toFixed(0);
};