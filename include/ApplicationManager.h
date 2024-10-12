// ApplicationManager.h
#pragma once

#include <Arduino.h>
#include <ESPAsyncWebServer.h>

#include "Calibration/CalibrationManager.h"
#include "PulseCounter.h"
#include "ScaledPulseGenerator.h"
#include "WebServerManager.h"
#include "WiFi/WiFiManager.h"

class ApplicationManager {
 public:
  ApplicationManager();
  void begin();
  void loop();

 private:
  AsyncWebServer server;
  PulseCounter pulseCounter;
  CalibrationManager calibrationManager;
  WebServerManager webServerManager;
  WiFiManager wifiManager;
  ScaledPulseGenerator scaledPulseGenerator;

  float outputScalingFactor;

  void broadcastPulseCountAtInterval(const unsigned long interval);
};
