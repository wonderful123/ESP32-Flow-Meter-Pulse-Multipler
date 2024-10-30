// WebServerManager.h
#pragma once

#include <ArduinoJson.h>
#include <ESPAsyncWebServer.h>

#include "Calibration/CalibrationManager.h"
#include "FileSystemManager.h"
#include "InputPulseMonitor.h"
#include "OTAUpdater.h"
#include "RouteHandler.h"
#include "WebSocketServer.h"

class WebServerManager {
 public:
  WebServerManager(AsyncWebServer& server,
                   CalibrationManager& calibrationManager,
                   InputPulseMonitor& inputPulseMonitor);
  void begin();
  void update();
  void broadcastWebsocketMessage(String& type, String& message);
  void broadcastWebsocketJson(String& type, JsonDocument json);

 private:
  CalibrationManager& _calibrationManager;
  InputPulseMonitor& _inputPulseMonitor;

  RouteHandler _routeHandler;
  AsyncWebServer& _server;
  WebSocketServer _webSocketServer;
  OTAUpdater _otaUpdater;
  FileSystemManager _fsManager;

  void startMDNS();
};