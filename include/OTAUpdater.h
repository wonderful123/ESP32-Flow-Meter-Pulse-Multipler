// OTAUpdater.h
#pragma once

#include <Arduino.h>

#include "WebSocketServer.h"

class OTAUpdater {
 public:
  OTAUpdater(WebSocketServer& webSocketServer)
      : _webSocketServer(webSocketServer) {}
  void begin();
  void handle();
  void performOTAUpdate();
  void checkForUpdate();

 private:
  WebSocketServer& _webSocketServer;

  void broadcastError(const String& message);
  void broadcastUpdateAvailable(const String& newVersion,
                                const String& changes);
  void broadcastNoUpdate();
};
