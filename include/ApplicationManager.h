// ApplicationManager.h
#pragma once

#include <Arduino.h>
#include <ESPAsyncDNSServer.h>
#include <ESPAsyncWebServer.h>

#include "CalibrationManager.h"
#include "PulseCounter.h"
#include "ScaledPulseGenerator.h"
#include "WebServerManager.h"
#include "WiFiUtils.h"

class ApplicationManager {
 public:
  ApplicationManager();
  void begin();
  void loop();

 private:
  AsyncWebServer server{80};  // Shared server instance if needed
  AsyncDNSServer dns;         // DNS server for the captive portal
  WiFiUtils wiFiUtils;
  PulseCounter pulseCounter;
  CalibrationManager calibrationManager;
  WebServerManager webServerManager;
  ScaledPulseGenerator scaledPulseGenerator;

  float outputScalingFactor;

  void broadcastPulseCountAtInterval(const unsigned long interval);
};
