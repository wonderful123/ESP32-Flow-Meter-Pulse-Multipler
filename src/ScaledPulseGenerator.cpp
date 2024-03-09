#include "ScaledPulseGenerator.h"

ScaledPulseGenerator::ScaledPulseGenerator(uint8_t outputPin,
                                           unsigned long baseDurationMicros)
    : _outputPin(outputPin), _baseDurationMicros(baseDurationMicros) {
  pinMode(_outputPin, OUTPUT);
  digitalWrite(_outputPin, LOW);  // Start with the pulse OFF
}

void ScaledPulseGenerator::updateScalingFactor(float scalingFactor) {
  _scalingFactor = scalingFactor;  // Update the scaling factor
}

unsigned long ScaledPulseGenerator::calculateEffectiveDuration() {
  // Adjust the base duration based on the current scaling factor
  return static_cast<unsigned long>(_baseDurationMicros / _scalingFactor);
}

void ScaledPulseGenerator::loop() {
  unsigned long now = micros();
  unsigned long durationSinceLastToggle = now - _lastToggleTime;
  unsigned long effectiveDuration = calculateEffectiveDuration();

  if (durationSinceLastToggle >=
      effectiveDuration / 2) {  // Divide by 2 for each ON/OFF phase duration
    togglePulse();
  }
}

void ScaledPulseGenerator::togglePulse() {
  _isPulseOn = !_isPulseOn;
  digitalWrite(_outputPin, _isPulseOn ? HIGH : LOW);
  _lastToggleTime = micros();  // Reset the timer for the next toggle
}
