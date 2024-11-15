// OutputPulseGenerator.cpp
#include "OutputPulseGenerator.h"

OutputPulseGenerator::OutputPulseGenerator(
    uint8_t outputPin, CalibrationManager* calibrationManager,
    InputPulseMonitor* inputPulseMonitor, TemperatureSensor* temperatureSensor)
    : _outputPin(outputPin),
      _calibrationManager(calibrationManager),
      _inputPulseMonitor(inputPulseMonitor),
      _temperatureSensor(temperatureSensor),  // Initialize temperature sensor
      _scalingFactor(1.0),
      _outputFrequency(0.0),
      _outputPulseCount(0),
      _totalOutputPulseCount(0),
      _lastUpdateTime(0),
      _pulseAccumulator(0.0),
      _lastInputPulseCount(0) {}

void OutputPulseGenerator::begin() {
  pinMode(_outputPin, OUTPUT);
  digitalWrite(_outputPin, LOW);
  _lastUpdateTime = millis();
}

void OutputPulseGenerator::update() {
  unsigned long inputPulseCount = _inputPulseMonitor->getPulseCount();
  
  // The esp32 has a maximum of 4,294,967,295 for the counter. It is very large
  // but wrap-around logic is handled.
  unsigned long pulseDifference =
      (inputPulseCount >= _lastInputPulseCount)
          ? (inputPulseCount - _lastInputPulseCount)
          : (UINT32_MAX - _lastInputPulseCount + inputPulseCount + 1);

  if (pulseDifference > 0) {
    float scalingFactor;
    if (_calibrationManager->getCalibrationMode() == CalibrationMode::Fixed) {
      scalingFactor = _calibrationManager->getFixedCalibrationFactor();
    } else {
      float temperature = _temperatureSensor->getCurrentTemperature();
      scalingFactor = _calibrationManager->getCalibrationFactor(temperature);
    }

    // Calculate the scaled number of pulses
    float scaledPulses = pulseDifference * scalingFactor + _pulseAccumulator;
    unsigned long pulsesToGenerate = static_cast<unsigned long>(scaledPulses);
    _pulseAccumulator = scaledPulses - pulsesToGenerate;

    for (unsigned long i = 0; i < pulsesToGenerate; i++) {
      generateOutputPulse();
      _outputPulseCount++;
    }

    _lastInputPulseCount = inputPulseCount;
  }
}

// Increment _totalOutputPulseCount in generateOutputPulse()
void OutputPulseGenerator::generateOutputPulse() {
  digitalWrite(_outputPin, HIGH);
  delayMicroseconds(100);  // Adjust pulse width as needed
  digitalWrite(_outputPin, LOW);
  _totalOutputPulseCount++;  // Increment total output pulse count
}

float OutputPulseGenerator::getOutputFrequency() { return _outputFrequency; }

// Implement the getter method
unsigned long OutputPulseGenerator::getTotalOutputPulseCount() const {
  return _totalOutputPulseCount;
}