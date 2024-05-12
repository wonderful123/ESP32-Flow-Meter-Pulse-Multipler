// CalibrationUtils.js

export function calculatePulsesPerLiter(pulseCount, observedVolume) {
  if (observedVolume > 0) {
    return pulseCount / observedVolume;
  }
  return 0;
}

export function calculateCalibrationFactor(targetVolume, observedVolume) {
  if (targetVolume > 0 && observedVolume > 0) {
    return (targetVolume / observedVolume) * 100;
  }
  return 0;
}