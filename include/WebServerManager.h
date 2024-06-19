// WebServerManager.h
#pragma once

#include <ESPAsyncWebServer.h>

#include "Calibration/CalibrationManager.h"
#include "FileSystemManager.h"
#include "OTAUpdater.h"
#include "PulseCounter.h"
#include "RouteHandler.h"
#include "WebSocketServer.h"

class WebServerManager {
 public:
  WebServerManager(AsyncWebServer& server,
                   CalibrationManager& calibrationManager,
                   PulseCounter& pulseCounter);
  void begin();
  void update();
  void broadcastWebsocketMessage(String& type, String& message);

 private:
  CalibrationManager& _calibrationManager;
  PulseCounter& _pulseCounter;

  RouteHandler _routeHandler;
  AsyncWebServer& _server;
  WebSocketServer _webSocketServer;
  OTAUpdater _otaUpdater;
  FileSystemManager _fsManager;

  void startMDNS();
};