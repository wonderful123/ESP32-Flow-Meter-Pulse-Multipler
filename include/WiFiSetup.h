// WiFiSetup.h
#pragma once

#include <DNSServer.h>
#include <ESPAsyncWebServer.h>
#include <ESPAsyncWiFiManager.h>  // Make sure this library is added to your dependencies

class WiFiSetup {
 public:
  WiFiSetup(AsyncWebServer* server, DNSServer* dns);
  void begin();

 private:
  AsyncWebServer* _server;  // Use pointer
  DNSServer* _dns;          // Use pointer
  AsyncWiFiManager _wifiManager;
};
