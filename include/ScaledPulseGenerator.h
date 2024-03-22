// ScaledPulseGenerator.h
#pragma once

#include <Arduino.h>

class ScaledPulseGenerator {
 public:
  ScaledPulseGenerator(uint8_t outputPin, unsigned long baseDurationMicros);
  void updateScalingFactor(float scalingFactor);
  void loop();

 private:
  uint8_t _outputPin;
  unsigned long _baseDurationMicros;  // Base duration for a complete ON/OFF
                                      // cycle at 1x scaling
  float _scalingFactor = 1.0;         // Initialize to 1x scaling
  unsigned long _lastToggleTime = 0;
  bool _isPulseOn = false;

  unsigned long calculateEffectiveDuration();
  void togglePulse();
};
