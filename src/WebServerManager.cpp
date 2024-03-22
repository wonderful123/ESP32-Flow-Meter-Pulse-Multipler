// WebServerManager.cpp
#include "WebServerManager.h"

#include "Settings.h"

WebServerManager::WebServerManager(CalibrationManager& calibrationManager,
                                   PulseCounter& pulseCounter)
    : _calibrationManager(calibrationManager),
      _pulseCounter(pulseCounter),
      _routeHandler(calibrationManager, pulseCounter, _otaUpdater, *this),
      _server(80),
      _webSocketServer(WEBSOCKET_PORT),
      _otaUpdater(),
      _fsManager() {}

void WebServerManager::begin() {
  if (_fsManager.mountFileSystem()) {
    _routeHandler.registerRoutes(_server);
  }

  _webSocketServer.begin(&_server);
  _server.begin();
  Serial.println("HTTP server started at IP address: " +
                 WiFi.localIP().toString());
  startMDNS();
  _epochTimeManager.begin();
  _otaUpdater.begin();
}

void WebServerManager::update() {
  MDNS.update();
  _otaUpdater.handle();
  _epochTimeManager.update();
}

void WebServerManager::broadcastPulseCount(unsigned long pulseCount) {
  _webSocketServer.broadcastPulseCount(pulseCount);
}

void WebServerManager::startMDNS() {
  if (!MDNS.begin(MDNS_DOMAIN_NAME)) {
    Serial.println("Error setting up MDNS responder");
  }
  MDNS.addService("http", "tcp", 80);
  Serial.println("mDNS responder started at http://pulse-scaler.local");
}

EpochTimeManager& WebServerManager::getEpochTimeManager() {
  return _epochTimeManager;
}