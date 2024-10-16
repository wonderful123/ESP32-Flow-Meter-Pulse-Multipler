// ApplicationManager.h
#pragma once

#include <Arduino.h>

#include "Calibration/CalibrationManager.h"
#include "CaptivePortal.h"
#include "DataReporter.h"
#include "InputPulseMonitor.h"
#include "OutputPulseGenerator.h"
#include "TemperatureSensor.h"
#include "WebServerManager.h"

class ApplicationManager {
 public:
  ApplicationManager();
  void begin();
  void loop();

 private:
  CalibrationManager calibrationManager;
  InputPulseMonitor inputPulseMonitor;
  OutputPulseGenerator outputPulseGenerator;
  TemperatureSensor temperatureSensor;
  DataReporter dataReporter;
  AsyncWebServer server;
  WebServerManager webServerManager;
  CaptivePortal captivePortal;

  void broadcastPulseCountAtInterval(const unsigned long interval);
};
