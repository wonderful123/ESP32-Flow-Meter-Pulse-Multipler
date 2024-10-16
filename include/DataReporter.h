// DataReporter.h

#pragma once

#include <Arduino.h>

#include "InputPulseMonitor.h"
#include "OutputPulseGenerator.h"
#include "TemperatureSensor.h"

class DataReporter {
 public:
  DataReporter(InputPulseMonitor* inputPulseMonitor,
               OutputPulseGenerator* outputPulseGenerator,
               TemperatureSensor* temperatureSensor);
  void begin();
  String getReportData();

 private:
  InputPulseMonitor* _inputPulseMonitor;
  OutputPulseGenerator* _outputPulseGenerator;
  TemperatureSensor* _temperatureSensor;
};