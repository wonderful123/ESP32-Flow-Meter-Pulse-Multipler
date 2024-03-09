// ApplicationManager.h
#pragma once

#include <Arduino.h>

#include "CalibrationManager.h"
#include "PulseCounter.h"
#include "ScaledPulseGenerator.h"
#include "WebServerManager.h"
#include "WiFiSetup.h"

class ApplicationManager {
 public:
  ApplicationManager();
  void begin();
  void loop();

 private:
  PulseCounter pulseCounter;
  CalibrationManager calibrationManager;
  AsyncWebServer server{80};  // Shared server instance if needed
  DNSServer dns;              // DNS server for the captive portal
  WiFiSetup wiFiSetup;
  WebServerManager webServerManager;
  ScaledPulseGenerator scaledPulseGenerator;

  float outputScalingFactor;

  void handleScaledOutput();
  void broadcastPulseCountAtInterval(const unsigned long interval);
};
