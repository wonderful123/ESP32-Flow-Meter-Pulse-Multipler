// OTAUpdater.cpp
#include "OTAUpdater.h"

#include <ArduinoJson.h>
#include <HTTPClient.h>

#include "Logger.h"
#include "Settings.h"

OTAUpdater::OTAUpdater(WebSocketServer& webSocketServer)
    : _esp32FOTA("pulse-scaler-fota", FIRMWARE_VERSION),
      _webSocketServer(webSocketServer) {}

void OTAUpdater::begin() {
  _esp32FOTA.setManifestURL(OTA_FIRMWARE_URL);
  setProgressCallback();
  setUpdateBeginFailCallback();
  setUpdateEndCallback();
  setUpdateCheckFailCallback();
  setUpdateFinishedCallback();
}

void OTAUpdater::setProgressCallback() {
  _esp32FOTA.setProgressCb([this](size_t progress, size_t size) {
    if (progress == size || progress == 0) Serial.println();
    Serial.print(".");
  });
}

void OTAUpdater::setUpdateBeginFailCallback() {
  _esp32FOTA.setUpdateBeginFailCb([this](int partition) {
    String partitionID = partition == U_SPIFFS ? "spiffs" : "firmware";
    logAndBroadcast(
        "error", "Update could not begin with " + partitionID + " partition");
  });
}

void OTAUpdater::setUpdateEndCallback() {
  _esp32FOTA.setUpdateEndCb([this](int partition) {
    String partitionID = partition == U_SPIFFS ? "spiffs" : "firmware";
    logAndBroadcast(
        "error", "Update could not finish with " + partitionID + " partition");
  });
}

void OTAUpdater::setUpdateCheckFailCallback() {
  _esp32FOTA.setUpdateCheckFailCb([this](int partition, int errorCode) {
    switch (errorCode) {
      case -1:
        logAndBroadcast("error", "OTA Error - Partition not found");
      case -2:
        logAndBroadcast("error",
                        "OTA Error - Validation signature check failed");
    }
  });
}

void OTAUpdater::setUpdateFinishedCallback() {
  _esp32FOTA.setUpdateFinishedCb([this](int partition, bool restart_after) {
    logAndBroadcast("status", "Firmware update finished successfully");

    if (restart_after) {
      ESP.restart();
    }
  });
}

void OTAUpdater::checkForUpdate() {
  if (!WiFi.isConnected()) {
    logAndBroadcast("error", "WiFi is not connected");
    return;
  }

  // Log the start of the update check
  logAndBroadcast("status", "Checking firmware for update...");

  HTTPClient http;
  WiFiClient client;
  http.begin(client, OTA_FIRMWARE_MANIFEST_URL);

  int httpCode = http.GET();
  if (httpCode == HTTP_CODE_OK) {
    String payload = http.getString();
    parseManifest(payload);
  } else {
    logAndBroadcast("error", "Failed to fetch firmware update manifest");
  }
  http.end();
}

void OTAUpdater::parseManifest(const String& jsonPayload) {
  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, jsonPayload);

  if (error) {
    logAndBroadcast("error", "Failed to parse JSON payload");
    return;
  }

  String newVersion = doc["version"].as<String>();
  String changes = doc["changes"].as<String>();

  if (newVersion != FIRMWARE_VERSION) {
    broadcastUpdateAvailable(newVersion, changes);
  } else {
    logAndBroadcast("status", "Firmware is up to date");
  }
}

void OTAUpdater::logAndBroadcast(const String& type, const String& message) {
  if (type == "error") {
    LOG_ERROR(message);
  } else if (type == "status") {
    LOG_INFO(message);
  }

  _webSocketServer.broadcastMessage(type, message);
}

void OTAUpdater::broadcastUpdateAvailable(const String& newVersion,
                                          const String& changes) {
  LOG_INFO("New firmware version available");
  LOG_INFO("Current version: " FIRMWARE_VERSION);
  LOG_INFO("Available version: ", newVersion);
  LOG_INFO("Changes: ", changes);

  JsonDocument responseDoc;
  responseDoc["currentVersion"] = FIRMWARE_VERSION;
  responseDoc["newVersion"] = newVersion;
  responseDoc["changes"] = changes;
  _webSocketServer.broadcastJsonData("updateAvailable", responseDoc);
}

void OTAUpdater::performOTAUpdate() {
  _webSocketServer.broadcastMessage("status", "Starting OTA update...");
  bool updateNeeded = _esp32FOTA.execHTTPcheck();
  if (updateNeeded) {
    _esp32FOTA.execOTA();
  }
}
