// OutputPulseGenerator.cpp
#include "OutputPulseGenerator.h"

OutputPulseGenerator::OutputPulseGenerator(
    uint8_t outputPin, CalibrationManager* calibrationManager,
    InputPulseMonitor* inputPulseMonitor)
    : _outputPin(outputPin),
      _calibrationManager(calibrationManager),
      _inputPulseMonitor(inputPulseMonitor),
      _scalingFactor(1.0),
      _outputFrequency(0.0),
      _outputPulseCount(0),
      _lastUpdateTime(0),
      _pulseAccumulator(0.0),
      _lastInputPulseCount(0) {}

void OutputPulseGenerator::begin() {
  pinMode(_outputPin, OUTPUT);
  digitalWrite(_outputPin, LOW);
  _lastUpdateTime = millis();
}

void OutputPulseGenerator::update() {
  unsigned long currentTime = millis();
  unsigned long inputPulseCount = _inputPulseMonitor->getPulseCount();
  unsigned long pulseDifference = inputPulseCount - _lastInputPulseCount;

  if (pulseDifference > 0) {
    float temperature = 123; //_calibrationManager->getCurrentTemperature();
    _scalingFactor = _calibrationManager->getCalibrationFactor(temperature);

    // Calculate the scaled number of pulses
    float scaledPulses = pulseDifference * _scalingFactor + _pulseAccumulator;
    unsigned long pulsesToGenerate = static_cast<unsigned long>(scaledPulses);
    _pulseAccumulator = scaledPulses - pulsesToGenerate;

    // Generate output pulses
    for (unsigned long i = 0; i < pulsesToGenerate; i++) {
      generateOutputPulse();
      _outputPulseCount++;
    }

    _lastInputPulseCount = inputPulseCount;
  }

  // Update output frequency every second
  if (currentTime - _lastUpdateTime >= 1000) {
    _outputFrequency = _outputPulseCount;
    _outputPulseCount = 0;
    _lastUpdateTime = currentTime;
  }
}

void OutputPulseGenerator::generateOutputPulse() {
  digitalWrite(_outputPin, HIGH);
  delayMicroseconds(100);  // Adjust pulse width as needed
  digitalWrite(_outputPin, LOW);
}

float OutputPulseGenerator::getOutputFrequency() { return _outputFrequency; }
