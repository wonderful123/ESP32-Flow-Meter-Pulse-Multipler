#include "CaptivePortal.h"

#include "Logger.h"

CaptivePortal::CaptivePortal(AsyncWebServer& server)
    : _server(server), _espConnect(server), serverStarted(false) {}

void CaptivePortal::begin() {
  // Set up HTTP routes
  _server.on("/clear", HTTP_GET, [this](AsyncWebServerRequest* request) {
    LOG_INFO("Clearing configuration...");
    _espConnect.clearConfiguration();
    request->send(200, "text/plain", "Configuration cleared. Restarting...");
    ESP.restart();
  });

  _server.on("/restart", HTTP_GET, [this](AsyncWebServerRequest* request) {
    LOG_INFO("Restarting...");
    request->send(200, "text/plain", "Restarting...");
    ESP.restart();
  });

  // Monitor network state changes
  _espConnect.listen([this](Mycila::ESPConnect::State previous,
                            Mycila::ESPConnect::State state) {
    JsonDocument doc;
    _espConnect.toJson(doc.to<JsonObject>());
    serializeJson(doc, Serial);
    Serial.println();

    LOG_INFO("State changed: {}", stateToString(state));
    ensureServerRunning();
  });

  _espConnect.setAutoRestart(true);
  _espConnect.setBlocking(false);

  LOG_INFO("Attempting to connect to saved Wi-Fi or starting captive portal.");
  _espConnect.begin("pulse-scaler", "Captive Portal SSID");

  LOG_INFO("Captive portal setup complete.");
}

void CaptivePortal::loop() {
  _espConnect.loop();  // Maintain connection state
}

// Start the server if it's not already running
void CaptivePortal::ensureServerRunning() {
  if (!serverStarted) {
    LOG_INFO("Starting web server...");
    _server.begin();
    serverStarted = true;
  }
}

// Utility to convert state to string for logging
const char* CaptivePortal::stateToString(Mycila::ESPConnect::State state) {
  switch (state) {
    case Mycila::ESPConnect::State::NETWORK_CONNECTED:
      return "NETWORK_CONNECTED";
    case Mycila::ESPConnect::State::AP_STARTED:
      return "AP_STARTED";
    case Mycila::ESPConnect::State::NETWORK_DISCONNECTED:
      return "NETWORK_DISCONNECTED";
    case Mycila::ESPConnect::State::PORTAL_STARTED:
      return "PORTAL_STARTED";
    default:
      return "UNKNOWN_STATE";
  }
}
