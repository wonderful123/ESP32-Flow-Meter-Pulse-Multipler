// OTAUpdater.h
#pragma once

#include <Arduino.h>
#include <ArduinoOTA.h>

class OTAUpdater {
 public:
  void begin();
  void handle();
  void performOTAUpdate(const String& updateUrl);
  String checkForUpdate();
};
