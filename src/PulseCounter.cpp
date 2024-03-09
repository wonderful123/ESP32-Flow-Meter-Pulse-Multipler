// PulseCounter.cpp
#include "PulseCounter.h"

PulseCounter::PulseCounter(uint8_t pulsePin)
    : _pulsePin(pulsePin), _pulseCount(0) {}

void PulseCounter::begin() { pinMode(_pulsePin, INPUT_PULLUP); }

void IRAM_ATTR PulseCounter::handleInterrupt(void* arg) {
  PulseCounter* counter = reinterpret_cast<PulseCounter*>(arg);
  counter->_pulseCount++;
}

unsigned long PulseCounter::getPulseCount() {
  noInterrupts();
  unsigned long count = _pulseCount;
  interrupts();
  return count;
}

void PulseCounter::resetPulseCount() {
  noInterrupts();
  _pulseCount = 0;
  interrupts();
}

void PulseCounter::startCounting() {
  resetPulseCount();
  attachInterruptArg(digitalPinToInterrupt(_pulsePin), handleInterrupt, this,
                     CHANGE);
}

void PulseCounter::stopCounting() {
  detachInterrupt(digitalPinToInterrupt(_pulsePin));
}