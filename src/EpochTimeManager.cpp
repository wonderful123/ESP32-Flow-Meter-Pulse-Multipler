// EpochTimeManager.cpp
#include "EpochTimeManager.h"

EpochTimeManager::EpochTimeManager()
    : timeClient(ntpUDP, "pool.ntp.org", 0, 60000) {}

void EpochTimeManager::begin() { timeClient.begin(); }

void EpochTimeManager::update() { timeClient.update(); }

unsigned long EpochTimeManager::getEpochTime() {
  return timeClient.getEpochTime();
}