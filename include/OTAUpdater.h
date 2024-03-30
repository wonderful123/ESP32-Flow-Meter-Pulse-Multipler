// OTAUpdater.h
#pragma once

#include <Arduino.h>
#include <ArduinoOTA.h>

#include "WebSocketServer.h"

class OTAUpdater {
 public:
  OTAUpdater(WebSocketServer& webSocketServer)
      : _webSocketServer(webSocketServer) {}
  void begin();
  void handle();
  void performOTAUpdate();
  String checkForUpdate();

 private:
  WebSocketServer& _webSocketServer;
};
