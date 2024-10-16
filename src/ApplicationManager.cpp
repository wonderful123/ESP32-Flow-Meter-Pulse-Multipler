// ApplicationManager.cpp
#include "ApplicationManager.h"

#include "DebugUtils.h"
#include "Logger.h"
#include "Settings.h"

ApplicationManager::ApplicationManager()
    : server(80),
      calibrationManager(),
      inputPulseMonitor(PULSE_INPUT_PIN),
      outputPulseGenerator(SCALED_OUTPUT_PIN, &calibrationManager,
                           &inputPulseMonitor),
      temperatureSensor(TEMP_SENSOR_PIN),
      dataReporter(&inputPulseMonitor, &outputPulseGenerator,
                   &temperatureSensor),
      webServerManager(server, calibrationManager, inputPulseMonitor),
      captivePortal(server) {}

void ApplicationManager::begin() {
  inputPulseMonitor.begin();
  inputPulseMonitor.startCounting();
  temperatureSensor.begin();
  calibrationManager.begin();
  outputPulseGenerator.begin();
  dataReporter.begin();
  webServerManager.begin();
  captivePortal.begin();

  DebugUtils::logResetReason();
  DebugUtils::logMemoryUsage();
  LOG_INFO("===========================================");
  LOG_INFO("STARTUP COMPLETE: System is now operational");
#ifdef FIRMWARE_VERSION
  LOG_INFO("Firmware version: " FIRMWARE_VERSION);
#endif
  LOG_INFO("===========================================");
  // DebugUtils::listFiles();
}

void ApplicationManager::loop() {
  outputPulseGenerator.update();

  // Broadcast pulse count at defined interval
  broadcastPulseCountAtInterval(PULSE_BROADCAST_INTERVAL);

  // Update web server manager
  webServerManager.update();
  captivePortal.loop();
}

void ApplicationManager::broadcastPulseCountAtInterval(
    const unsigned long interval) {
  static unsigned long lastBroadcastTime = 0;
  unsigned long currentTime = millis();
  if (currentTime - lastBroadcastTime >= interval) {
    lastBroadcastTime = currentTime;
    String type = "pulseCount";
    String message = dataReporter.getReportData();
    // LOG_DEBUG("Broadcasting pulse count: " +
    //           String(pulseCounter.getPulseCount()));
    webServerManager.broadcastWebsocketMessage(type, message);
  }
}
