// DebugUtils.cpp
#include "DebugUtils.h"

#if defined(ESP32)

#include "Esp.h"

void DebugUtils::logMemoryUsage() {
  Logger::debug("Total heap: " + std::to_string(ESP.getHeapSize()), __FILE__);
  Logger::debug("Free heap: " + std::to_string(ESP.getFreeHeap()), __FILE__);
  Logger::debug("Total PSRAM: " + std::to_string(ESP.getPsramSize()), __FILE__);
  Logger::debug("Free PSRAM: " + std::to_string(ESP.getFreePsram()), __FILE__);
  Logger::debug(
      "Used PSRAM: " + std::to_string(ESP.getPsramSize() - ESP.getFreePsram()),
      __FILE__);
}
#else
// Fallback or mock implementation for non-ESP32 environments
void DebugUtils::logMemoryUsage() {
  Logger::debug("Memory logging not supported on this platform", __FILE__);
}
#endif
