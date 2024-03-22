// PulseCounter.h
#pragma once

#include <Arduino.h>

class PulseCounter {
 public:
  PulseCounter(uint8_t pulsePin);
  void begin();
  static void IRAM_ATTR handleInterrupt(void* arg);
  unsigned long getPulseCount();
  void resetPulseCount();
  void startCounting();
  void stopCounting();

 private:
  uint8_t _pulsePin;
  volatile unsigned long _pulseCount;
};