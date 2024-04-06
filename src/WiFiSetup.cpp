// WiFiSetup.cpp
#include "WiFiSetup.h"

#include "Logger.h"

WiFiSetup::WiFiSetup(AsyncWebServer* server, DNSServer* dns)
    : _server(server), _dns(dns), _wifiManager(server, dns) {
  // Constructor now correctly initializes member pointers
  // and passes them to _wifiManager
}

void WiFiSetup::begin() {
  // Uncomment and modify to set custom AP name and password
  // _wifiManager.autoConnect("AP-NAME", "AP-PASSWORD");
  _wifiManager.autoConnect("pulse-scaler");
  // Optionally, reset settings if needed (e.g., for testing)
  // _wifiManager.resetSettings();

  if (WiFi.status() == WL_CONNECTED) {
    LOG_INFO("Connected to WiFi");
  } else {
    LOG_ERROR("Failed to connect to WiFi");
  }
}
