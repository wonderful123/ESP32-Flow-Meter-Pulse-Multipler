// ApplicationManager.cpp
#include "ApplicationManager.h"

#include <ArduinoJson.h>

#include "DebugUtils.h"
#include "Logger.h"
#include "Settings.h"

ApplicationManager::ApplicationManager()
    : server(80),
      dns(),
      wiFiUtils(server, dns),
      pulseCounter(PULSE_PIN),
      calibrationManager(),
      webServerManager(server, calibrationManager, pulseCounter),
      scaledPulseGenerator(SCALED_OUTPUT_PIN, BASE_PULSE_DURATION_MICROS) {}

void ApplicationManager::begin() {
  wiFiUtils.begin();
  pulseCounter.begin();
  pulseCounter.startCounting();
  calibrationManager.begin();
  calibrationManager.registerCalibrationFactorUpdateCallback(
      std::bind(&ApplicationManager::onCalibrationFactorUpdated, this,
                std::placeholders::_1));
  float outputScalingFactor = calibrationManager.getCalibrationFactor();
  scaledPulseGenerator.updateScalingFactor(outputScalingFactor);
  webServerManager.begin();

  DebugUtils::logResetReason();
  DebugUtils::logMemoryUsage();
  LOG_INFO("===========================================");
  LOG_INFO("STARTUP COMPLETE: System is now operational");
#ifdef FIRMWARE_VERSION
  LOG_INFO("Firmware version: " FIRMWARE_VERSION);
#endif
  LOG_INFO("===========================================");
  DebugUtils::listFiles();
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
    String message = String(pulseCounter.getPulseCount());
    // LOG_DEBUG("Broadcasting pulse count: " +
    //           String(pulseCounter.getPulseCount()));
    webServerManager.broadcastWebsocketMessage(type, message);
  }
}

void ApplicationManager::onCalibrationFactorUpdated(float calibrationFactor) {
  scaledPulseGenerator.updateScalingFactor(calibrationFactor);
}