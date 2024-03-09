// WebServerManager.h
#pragma once

#include <ESP8266mDNS.h>
#include <ESPAsyncWebServer.h>
#include <WebSocketServer.h>

#include "CalibrationManager.h"
#include "FS.h"
#include "LittleFS.h"
#include "OTAUpdater.h"
#include "PulseCounter.h"

#define WEBSOCKET_PORT 80

class WebServerManager {
 public:
  WebServerManager(CalibrationManager& calibrationManager,
                   PulseCounter& pulseCounter);
  void begin();
  void update();
  void broadcastPulseCount(unsigned long pulseCount);

 private:
  AsyncWebServer _server{80};
  CalibrationManager& _calibrationManager;
  PulseCounter& _pulseCounter;
  WebSocketServer _webSocketServer;
  OTAUpdater _otaUpdater;

  void setupRoutes();
  void mountFileSystem();
  void startMDNS();
  void handleNotFound(AsyncWebServerRequest* request);
  void handleOTAUpdate(AsyncWebServerRequest* request);
  void handleEdit(AsyncWebServerRequest* request);
  void handleDelete(AsyncWebServerRequest* request);
};
