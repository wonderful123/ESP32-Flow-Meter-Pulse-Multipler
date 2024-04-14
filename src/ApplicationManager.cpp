// ApplicationManager.cpp
#include "ApplicationManager.h"

#include <ArduinoJson.h>

#include "DebugUtils.h"
#include "Logger.h"
#include "Settings.h"

ApplicationManager::ApplicationManager()
    : pulseCounter(PULSE_PIN),
      calibrationManager(),
      server(80),
      wiFiUtils(&server, &dns),
      webServerManager(calibrationManager, pulseCounter),
      scaledPulseGenerator(SCALED_OUTPUT_PIN, BASE_PULSE_DURATION_MICROS) {}

void ApplicationManager::begin() {
// Macro to convert the definition into a string literal
#ifdef FIRMWARE_VERSION
  LOG_INFO("Firmware version: " FIRMWARE_VERSION);
#endif

  wiFiUtils.begin();
  pulseCounter.begin();
  calibrationManager.begin();
  float outputScalingFactor = calibrationManager.getCalibrationFactor();
  scaledPulseGenerator.updateScalingFactor(outputScalingFactor);
  webServerManager.begin();

  DebugUtils::logResetReason();
  DebugUtils::logMemoryUsage();
  LOG_INFO("===========================================");
  LOG_INFO("STARTUP COMPLETE: System is now operational");
  LOG_INFO("===========================================");
}

void ApplicationManager::loop() {
  // Broadcast pulse count at defined interval
  broadcastPulseCountAtInterval(PULSE_BROADCAST_INTERVAL);

  // Update web server manager
  webServerManager.update();

  scaledPulseGenerator.loop();
}

void ApplicationManager::broadcastPulseCountAtInterval(
    const unsigned long interval) {
  static unsigned long lastBroadcastTime = 0;
  unsigned long currentTime = millis();
  if (currentTime - lastBroadcastTime >= interval) {
    lastBroadcastTime = currentTime;
    String type = "pulseCount";
    JsonVariant doc;
    doc["data"] = pulseCounter.getPulseCount();
    webServerManager.broadcastWebsocketMessage(type, doc);
  }
}
