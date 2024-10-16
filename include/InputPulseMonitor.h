// InputPulseMonitor.h

// Purpose:
// Monitors and counts the input pulses from the flow meter, and
// measures the input pulse frequency.

// Responsibilities:
// Detect input pulses.
// Increment pulse count.
// Calculate input pulse frequency.
// Provide access to current pulse count and frequency.

#pragma once

#include <Arduino.h>

class InputPulseMonitor {
 public:
  InputPulseMonitor(uint8_t pulsePin);
  void begin();
  static void IRAM_ATTR handleInterrupt(void* arg);
  unsigned long getPulseCount();
  float getPulseFrequency();
  void resetPulseCount();
  void startCounting();
  void stopCounting();

 private:
  uint8_t _pulsePin;
  volatile unsigned long _pulseCount;
  unsigned long _lastFrequencyCalcTime;
  unsigned long _lastPulseCount;
};