// WebServerManager.cpp
#include "WebServerManager.h"

#include <ArduinoJson.h>

#include "Arduino.h"
#include "ESPmDNS.h"
#include "Settings.h"
#include "logger.h"

WebServerManager::WebServerManager(CalibrationManager& calibrationManager,
                                   PulseCounter& pulseCounter)
    : _calibrationManager(calibrationManager),
      _pulseCounter(pulseCounter),
      _routeHandler(calibrationManager, pulseCounter, _otaUpdater, *this),
      _server(80),
      _webSocketServer(WEBSOCKET_PORT),
      _otaUpdater(_webSocketServer),
      _fsManager() {}

void WebServerManager::begin() {
  if (_fsManager.mountFileSystem()) {
    LOG_DEBUG("LittleFS mounted");
    _routeHandler.registerRoutes(_server);
    LOG_DEBUG(" Routes registered");
  }

  _webSocketServer.begin(&_server);
  _server.begin();
  LOG_INFO("HTTP server started at IP address: %s ***",
           WiFi.localIP().toString());
  startMDNS();
  _epochTimeManager.begin();
  _otaUpdater.begin();
}

void WebServerManager::update() { _epochTimeManager.update(); }

void WebServerManager::broadcastPulseCount(unsigned long pulseCount) {
  _webSocketServer.broadcastPulseCount(pulseCount);
}

void WebServerManager::broadcastWebsocketMessage(String& type,
                                                 JsonVariant& data) {
  _webSocketServer.broadcastMessage(type, data);
}

void WebServerManager::startMDNS() {
  if (!MDNS.begin(MDNS_DOMAIN_NAME)) {
    LOG_ERROR("Error setting up MDNS responder");
  }
  MDNS.addService("http", "tcp", 80);
  LOG_INFO("mDNS responder started at http://pulse-scaler.local");
}

EpochTimeManager& WebServerManager::getEpochTimeManager() {
  return _epochTimeManager;
}