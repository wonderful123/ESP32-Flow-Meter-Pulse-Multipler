// InputPulseMonitor.cpp
#include "InputPulseMonitor.h"

#include "Logger.h"

InputPulseMonitor::InputPulseMonitor(uint8_t pulsePin)
    : _pulsePin(pulsePin),
      _pulseCount(0),
      _lastFrequencyCalcTime(0),
      _lastPulseCount(0) {}

void InputPulseMonitor::begin() {
  pinMode(_pulsePin, INPUT_PULLUP);
  startCounting();
  _lastFrequencyCalcTime = micros();
  LOG_INFO("Pulse counter initialized");
}

void IRAM_ATTR InputPulseMonitor::handleInterrupt(void* arg) {
  InputPulseMonitor* counter = reinterpret_cast<InputPulseMonitor*>(arg);
  counter->_pulseCount++;
}

unsigned long InputPulseMonitor::getPulseCount() {
  noInterrupts();
  unsigned long count = _pulseCount;
  interrupts();
  return count;
}

float InputPulseMonitor::getPulseFrequency() {
  unsigned long currentTime = millis();
  unsigned long timeElapsed = currentTime - _lastFrequencyCalcTime;

  if (timeElapsed == 0) {
    return 0.0f;
  }

  noInterrupts();
  unsigned long currentPulseCount = _pulseCount;
  interrupts();

  // The esp32 has a maximum of 4,294,967,295 for the counter. It is very large
  // but wrap-around logic is handled.
  unsigned long pulseDiff =
      (currentPulseCount >= _lastPulseCount)
          ? (currentPulseCount - _lastPulseCount)
          : (UINT32_MAX - _lastPulseCount + currentPulseCount + 1);

  float frequency = (pulseDiff * 1000.0f) / timeElapsed;  // pulses per second

  // Update for next calculation
  _lastFrequencyCalcTime = currentTime;
  _lastPulseCount = currentPulseCount;

  return frequency;
}

void InputPulseMonitor::resetPulseCount() {
  noInterrupts();
  _pulseCount = 0;
  interrupts();
}

void InputPulseMonitor::startCounting() {
  resetPulseCount();
  attachInterruptArg(digitalPinToInterrupt(_pulsePin), handleInterrupt, this,
                     CHANGE);
}

void InputPulseMonitor::stopCounting() {
  detachInterrupt(digitalPinToInterrupt(_pulsePin));
}