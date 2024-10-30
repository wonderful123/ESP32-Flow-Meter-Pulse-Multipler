// OutputPulseGenerator.h

// Purpose:
// Generates the output pulses, adjusting the timing dynamically based on the
// scaling factor derived from the calibration factor and temperature.

// Responsibilities:
// Calculate the scaling factor.
// Schedule output pulses with dynamic intervals.
// Ensure smooth scaling between pulse rates.
// Handle long pauses when there's no activity.

// Methods:
// generateOutputPulse()
// adjustOutputPulseTiming(scalingFactor)

#pragma once

#include <Arduino.h>

#include "Calibration/CalibrationManager.h"
#include "InputPulseMonitor.h"
#include "TemperatureSensor.h"

class OutputPulseGenerator {
 public:
  OutputPulseGenerator(uint8_t outputPin,
                       CalibrationManager* calibrationManager,
                       InputPulseMonitor* inputPulseMonitor,
                       TemperatureSensor* temperatureSensor);
  void begin();
  void update();
  float getOutputFrequency();
  unsigned long getTotalOutputPulseCount() const;

 private:
  uint8_t _outputPin;
  CalibrationManager* _calibrationManager;
  InputPulseMonitor* _inputPulseMonitor;
  TemperatureSensor* _temperatureSensor;
  float _scalingFactor;
  float _outputFrequency;  // Variable to store output frequency
  volatile unsigned long _outputPulseCount;
  unsigned long _totalOutputPulseCount;
  unsigned long _lastUpdateTime;
  float _pulseAccumulator;
  unsigned long _lastInputPulseCount;

  void generateOutputPulse();
};