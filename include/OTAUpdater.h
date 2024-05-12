// OTAUpdater.h
#pragma once

#include <Arduino.h>

#define DISABLE_ALL_LIBRARY_WARNINGS  // Disable pragma debug messages from the
                                      // esp32FOTA library
#include <esp32FOTA.hpp>

#include "WebSocketServer.h"

class OTAUpdater {
 public:
  OTAUpdater(WebSocketServer& webSocketServer);

  void begin();
  void performOTAUpdate();
  void checkForUpdate();

 private:
  esp32FOTA _esp32FOTA;
  WebSocketServer& _webSocketServer;

  void logAndBroadcast(const String& type, const String& message);
  void broadcastUpdateAvailable(const String& newVersion,
                                const String& changes);
  void parseManifest(const String& jsonPayload);

  void setProgressCallback();
  void setUpdateBeginFailCallback();
  void setUpdateEndCallback();
  void setUpdateCheckFailCallback();
  void setUpdateFinishedCallback();
};
