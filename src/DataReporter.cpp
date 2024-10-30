// DataReporter.cpp
#include "DataReporter.h"

DataReporter::DataReporter(InputPulseMonitor* inputPulseMonitor,
                           OutputPulseGenerator* outputPulseGenerator,
                           TemperatureSensor* temperatureSensor)
    : _inputPulseMonitor(inputPulseMonitor),
      _outputPulseGenerator(outputPulseGenerator),
      _temperatureSensor(temperatureSensor) {}

void DataReporter::begin() {
  // Initialize if needed
}

JsonDocument DataReporter::getReportData() {
  unsigned long inputPulseCount = _inputPulseMonitor->getPulseCount();
  unsigned long outputPulseCount =
      _outputPulseGenerator->getTotalOutputPulseCount();
  float inputFrequency = _inputPulseMonitor->getPulseFrequency();
  float outputFrequency = _outputPulseGenerator->getOutputFrequency();
  float temperature = _temperatureSensor->getCurrentTemperature();

  JsonDocument doc;
  doc["inputPulseCount"] = inputPulseCount;
  doc["outputPulseCount"] = outputPulseCount;
  doc["inputFrequency"] = inputFrequency;
  doc["outputFrequency"] = outputFrequency;
  doc["temperature"] = temperature;

  return doc;
}