// WebServerManager.cpp
#include "WebServerManager.h"

#include <ArduinoJson.h>

#include "Arduino.h"
#include "ESPmDNS.h"
#include "Settings.h"
#include "logger.h"

WebServerManager::WebServerManager(AsyncWebServer& server,
                                   CalibrationManager& calibrationManager,
                                   PulseCounter& pulseCounter)
    : _calibrationManager(calibrationManager),
      _pulseCounter(pulseCounter),
      _routeHandler(calibrationManager, pulseCounter, _otaUpdater, *this),
      _server(server),
      _webSocketServer(WEBSOCKET_PORT),
      _otaUpdater(_webSocketServer),
      _fsManager() {}

void WebServerManager::begin() {
  _server.begin();
  _webSocketServer.begin(&_server);
  if (_fsManager.mountFileSystem()) {
    _routeHandler.registerRoutes(_server);
  }
  LOG_INFO("HTTP server started at IP address: {} ***",
           WiFi.localIP().toString().c_str());
  startMDNS();
  _otaUpdater.begin();
}

void WebServerManager::update() {}

void WebServerManager::broadcastWebsocketMessage(String& type,
                                                 String& message) {
  _webSocketServer.broadcastMessage(type, message);
}

void WebServerManager::startMDNS() {
  if (!MDNS.begin(MDNS_DOMAIN_NAME)) {
    LOG_ERROR("Error setting up MDNS responder");
  }
  MDNS.addService("http", "tcp", 80);
  LOG_INFO("=================================");
  LOG_INFO("mDNS responder started at:");
  LOG_INFO("http://{}.local", MDNS_DOMAIN_NAME);
  LOG_INFO("=================================");
}