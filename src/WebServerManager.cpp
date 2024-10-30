// WebServerManager.cpp
#include "WebServerManager.h"

#include <ArduinoJson.h>

#include "Arduino.h"
#include "ESPmDNS.h"
#include "Logger.h"
#include "Settings.h"
#include "WiFi.h"

WebServerManager::WebServerManager(AsyncWebServer& server,
                                   CalibrationManager& calibrationManager,
                                   InputPulseMonitor& inputPulseMonitor)
    : _calibrationManager(calibrationManager),
      _inputPulseMonitor(inputPulseMonitor),
      _routeHandler(calibrationManager, inputPulseMonitor, _otaUpdater, *this),
      _server(server),
      _webSocketServer(WEBSOCKET_PORT),
      _otaUpdater(_webSocketServer),
      _fsManager() {}

void WebServerManager::begin() {
  _webSocketServer.begin(&_server);
  if (_fsManager.mountFileSystem()) {
    _routeHandler.registerRoutes(_server);
  }
  LOG_INFO("HTTP server started at IP address: {} ***",
           WiFi.localIP().toString().c_str());
  startMDNS();
  // _server.begin();
  _otaUpdater.begin();
}

void WebServerManager::update() {}

void WebServerManager::broadcastWebsocketMessage(String& type,
                                                 String& message) {
  _webSocketServer.broadcastMessage(type, message);
}

void WebServerManager::broadcastWebsocketJson(String& type, JsonDocument json) {
  _webSocketServer.broadcastJsonData(type, json);
}

void WebServerManager::startMDNS() {
  WiFi.begin("GretaThurnberg", "trump2020");
  WiFi.mode(WIFI_AP_STA);
  if (!MDNS.begin("test")) {
    LOG_ERROR("Error setting up MDNS responder");
  }
  bool result = MDNS.addService("http", "tcp", 80);
  if (result) {
    LOG_INFO("=================================");
    LOG_INFO("mDNS responder started at:");
    LOG_INFO("http://{}.local", MDNS_DOMAIN_NAME);
    LOG_INFO("=================================");
  } else {
    LOG_ERROR("Error setting up MDNS responder. Result: {}", result);
  }
}