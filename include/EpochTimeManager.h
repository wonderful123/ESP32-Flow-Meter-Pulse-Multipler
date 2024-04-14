// EpochTimeManager.h
#pragma once

#include <NTPClient.h>
#include <WiFiUdp.h>

class EpochTimeManager {
 public:
  EpochTimeManager() : timeClient(ntpUDP, "pool.ntp.org", 0, 60000) {}
  void begin() { timeClient.begin(); }
  void update() { timeClient.update(); }
  unsigned long getEpochTime() { return timeClient.getEpochTime(); }

 private:
  WiFiUDP ntpUDP;
  NTPClient timeClient;
};