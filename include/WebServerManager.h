// WebServerManager.h
#pragma once

#include <ESPAsyncWebServer.h>

#include "CalibrationManager.h"
#include "EpochTimeManager.h"
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
  EpochTimeManager& getEpochTimeManager();

 private:
  CalibrationManager& _calibrationManager;
  PulseCounter& _pulseCounter;

  RouteHandler _routeHandler;
  AsyncWebServer& _server;
  WebSocketServer _webSocketServer;
  OTAUpdater _otaUpdater;
  FileSystemManager _fsManager;
  EpochTimeManager _epochTimeManager;

  void startMDNS();
};
