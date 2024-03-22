// EpochTimeManager.h
#pragma once

#include <NTPClient.h>
#include <WiFiUdp.h>

class EpochTimeManager {
 public:
  EpochTimeManager();
  void begin();
  void update();
  unsigned long getEpochTime();

 private:
  WiFiUDP ntpUDP;
  NTPClient timeClient;
};