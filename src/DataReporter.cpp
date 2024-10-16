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

String DataReporter::getReportData() {
  unsigned long pulseCount = _inputPulseMonitor->getPulseCount();
  float inputFrequency = _inputPulseMonitor->getPulseFrequency();
  float temperature = _temperatureSensor->getCurrentTemperature();
  float outputFrequency = _outputPulseGenerator->getOutputFrequency();

  String data = "{";
  data += "\"pulseCount\":" + String(pulseCount) + ",";
  data += "\"inputFrequency\":" + String(inputFrequency, 2) + ",";
  data += "\"outputFrequency\":" + String(outputFrequency, 2) + ",";
  data += "\"temperature\":" + String(temperature, 2);
  data += "}";
  return data;
}