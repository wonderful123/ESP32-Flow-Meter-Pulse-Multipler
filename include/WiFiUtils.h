// WiFiUtils.h
#pragma once

#include <DNSServer.h>
#include <ESPAsyncDNSServer.h>
#include <ESPAsyncWebServer.h>

#include <ESPAsync_WiFiManager.hpp>

class WiFiUtils {
 public:
  WiFiUtils(AsyncWebServer* server, AsyncDNSServer* dns);
  void begin();
  String getCurrentTimestamp();

 private:
  AsyncWebServer* _server;  // Use pointer
  AsyncDNSServer* _dns;     // Use pointer
  ESPAsync_WiFiManager _wifiManager;

  time_t _lastNtpTime = 0;  // Stores the last known NTP time
  unsigned long _lastMillis =
      0;  // Stores the millis() value at the last NTP sync

  void initializeTime();
};
