// WebServerManager.h
#pragma once

#include <ESP8266mDNS.h>
#include <ESPAsyncWebServer.h>

#include "CalibrationManager.h"
#include "EpochTimeManager.h"
#include "FileSystemManager.h"
#include "OTAUpdater.h"
#include "PulseCounter.h"
#include "RouteHandler.h"
#include "WebSocketServer.h"

#define WEBSOCKET_PORT 80

class WebServerManager {
 public:
  WebServerManager(CalibrationManager& calibrationManager,
                   PulseCounter& pulseCounter);
  void begin();
  void update();
  void broadcastPulseCount(unsigned long pulseCount);
  EpochTimeManager& getEpochTimeManager();

 private:
  CalibrationManager& _calibrationManager;
  PulseCounter& _pulseCounter;

  RouteHandler _routeHandler;
  AsyncWebServer _server;
  WebSocketServer _webSocketServer;
  OTAUpdater _otaUpdater;
  FileSystemManager _fsManager;
  EpochTimeManager _epochTimeManager;

  void startMDNS();
};
