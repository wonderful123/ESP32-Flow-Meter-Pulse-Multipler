// WiFiUtils.h
#pragma once

#include <Arduino.h>

// Forward declarations
class AsyncWebServer;
class AsyncDNSServer;

#include <ESPAsync_WiFiManager.hpp>

class WiFiUtils {
 public:
  WiFiUtils(AsyncWebServer& server, AsyncDNSServer& dns);
  void begin();
  String getCurrentTimestamp();

 private:
  AsyncWebServer& _server;
  AsyncDNSServer& _dns;
  ESPAsync_WiFiManager* _wifiManager;

  time_t _lastNtpTime = 0;  // Stores the last known NTP time
  unsigned long _lastMillis =
      0;  // Stores the millis() value at the last NTP sync

  void initializeTime();
};
