// ApplicationManager.cpp
#include "ApplicationManager.h"

#include "Settings.h"

ApplicationManager::ApplicationManager()
    : pulseCounter(PULSE_PIN),
      calibrationManager(),
      server(80),
      wiFiSetup(&server, &dns),
      webServerManager(calibrationManager, pulseCounter),
      scaledPulseGenerator(SCALED_OUTPUT_PIN, BASE_PULSE_DURATION_MICROS) {}

void ApplicationManager::begin() {
  Serial.begin(115200);
#ifdef FIRMWARE_VERSION
  Serial.println("Firmware version: " FIRMWARE_VERSION);
#endif

  wiFiSetup.begin();
  pulseCounter.begin();
  calibrationManager.begin();
  webServerManager.begin();
}

void ApplicationManager::loop() {
  float outputScalingFactor = calibrationManager.getScalingFactor();
  scaledPulseGenerator.updateScalingFactor(outputScalingFactor);

  broadcastPulseCountAtInterval(PULSE_BROADCAST_INTERVAL);
  webServerManager.update();
}

void ApplicationManager::broadcastPulseCountAtInterval(
    const unsigned long interval) {
  static unsigned long lastBroadcastTime = 0;
  unsigned long currentTime = millis();
  if (currentTime - lastBroadcastTime >= interval) {
    lastBroadcastTime = currentTime;
    webServerManager.broadcastPulseCount(pulseCounter.getPulseCount());
  }
}
