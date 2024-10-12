#pragma once

#include <ESPAsyncWebServer.h>

#include "WiFiManager.h"  // Include the WiFiManager header

class CaptivePortal {
 public:
  CaptivePortal(WiFiManager& wifiManager, AsyncWebServer& server);
  void begin();  // Start the web server and serve the captive portal
  void stop();   // Stop the captive portal (when connected to Wi-Fi)
  void handleWiFiForm(
      AsyncWebServerRequest*
          request);  // Handle form submission from captive portal
  void handleConnectionStatus(
      AsyncWebServerRequest* request);  // New endpoint for connection status
  void switchToSoftAP();                // Switch to SoftAP mode through URL

 private:
  AsyncWebServer& _server;    // Async web server instance
  WiFiManager& _wifiManager;  // Reference to the WiFiManager instance
  void setupRoutes();  // Set up the web server routes for serving the portal
};
