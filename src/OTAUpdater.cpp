// OTAUpdater.cpp
#include "OTAUpdater.h"

#include <ArduinoJson.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <HTTPClient.h>
#include <HTTPUpdate.h>
#include <Update.h>

#include "Logger.h"
#include "Settings.h"

void OTAUpdater::begin() {
  ArduinoOTA.onStart([this]() {
    const char* commandType =
        ArduinoOTA.getCommand() == U_FLASH ? "sketch" : "filesystem";
    LOG_INFO("Start OTA updating " + String(commandType));

    JsonDocument doc;
    String type = "status";
    doc["message"] = "Start OTA updating " + String(type);
    _webSocketServer.broadcastMessage(type, doc);
  });

  ArduinoOTA.onEnd([this]() {
    LOG_INFO("OTA Update completed");
    JsonDocument doc;
    String type = "status";
    doc["message"] = "Update complete";
    _webSocketServer.broadcastMessage(type, doc);
  });

  ArduinoOTA.onProgress([this](unsigned int progress, unsigned int total) {
    float progressPercentage = (float)progress / (float)total * 100.0f;
    LOG_INFO("OTA Progress: " + String(progressPercentage, 2) + "%");
    JsonDocument doc;
    String type = "progress";
    doc["percentage"] = (progress * 100) / total;
    _webSocketServer.broadcastMessage(type, doc);
  });

  ArduinoOTA.onError([this](ota_error_t error) {
    const char* errorMsg = "";
    switch (error) {
      case OTA_AUTH_ERROR:
        errorMsg = "Auth Failed";
        break;
      case OTA_BEGIN_ERROR:
        errorMsg = "Begin Failed";
        break;
      case OTA_CONNECT_ERROR:
        errorMsg = "Connect Failed";
        break;
      case OTA_RECEIVE_ERROR:
        errorMsg = "Receive Failed";
        break;
      case OTA_END_ERROR:
        errorMsg = "End Failed";
        break;
      default:
        errorMsg = "Unknown Error";
        break;
    }
    String errorMessage =
        "OTA Error[" + String(error) + "]: " + String(errorMsg);
    LOG_ERROR(errorMessage);

    JsonDocument doc;
    String type = "error";
    doc["message"] = String("OTA Error: ") + errorMsg;
    _webSocketServer.broadcastMessage(type, doc);
  });

  ArduinoOTA.begin();
}

void OTAUpdater::handle() { ArduinoOTA.handle(); }

void OTAUpdater::checkForUpdate() {
  // Log the start of the update check
  LOG_INFO("Checking for OTA updates...");
  JsonDocument docStart;
  docStart["message"] = "Checking for OTA updates...";
  _webSocketServer.broadcastMessage("status", docStart);

  HTTPClient http;
  WiFiClient client;
  http.begin(client, OTA_FIRMWARE_VERSION_URL);
  int httpCodex = http.GET();  // This might take time, especially if the server
                               // is slow to respond.

  if (httpCodex > 0) {
    if (httpCodex == HTTP_CODE_OK) {
      String payload = http.getString();
      LOG_DEBUG(payload);
    }
  } else {
    LOG_ERROR("Error on HTTP request");
  }

  while (client.available()) {
    char ch = static_cast<char>(client.read());
  }
  int httpCode = http.GET();

  if (httpCode == HTTP_CODE_OK) {
    String payload = http.getString();
    http.end();

    // Print the raw payload for debugging
    LOG_DEBUG("Raw payload from server:");
    LOG_DEBUG(payload);

    JsonDocument payloadDoc;
    DeserializationError error = deserializeJson(payloadDoc, payload);
    if (error) {
      LOG_ERROR(String("Failed to parse JSON payload: ") + error.c_str());
      broadcastError("Failed to parse JSON");
    } else {
      String newVersion = payloadDoc["version"].as<String>();
      String changes = payloadDoc["changes"].as<String>();
      LOG_INFO("Current firmware version: " FIRMWARE_VERSION);
      LOG_INFO(String("Available firmware version: ") + newVersion);
      if (newVersion != FIRMWARE_VERSION) {
        broadcastUpdateAvailable(newVersion, changes);
      } else {
        broadcastNoUpdate();
      }
    }
  } else {
    LOG_ERROR("Failed to check for firmware updates, HTTP code: " +
              std::to_string(httpCode));
    broadcastError("HTTP request failed with code: " + String(httpCode));
  }
}

void OTAUpdater::broadcastError(const String& message) {
  JsonDocument responseDoc;
  responseDoc["type"] = "error";
  responseDoc["data"]["message"] = message;
  _webSocketServer.broadcastMessage(responseDoc["type"], responseDoc["data"]);
}

void OTAUpdater::broadcastUpdateAvailable(const String& newVersion,
                                          const String& changes) {
  JsonDocument responseDoc;
  responseDoc["type"] = "updateAvailable";
  responseDoc["data"]["newVersion"] = newVersion;
  responseDoc["data"]["changes"] = changes;
  _webSocketServer.broadcastMessage(responseDoc["type"], responseDoc["data"]);
}

void OTAUpdater::broadcastNoUpdate() {
  JsonDocument responseDoc;
  responseDoc["type"] = "noUpdate";
  responseDoc["data"]["message"] = "Your firmware is up to date.";
  _webSocketServer.broadcastMessage(responseDoc["type"], responseDoc["data"]);
}

void OTAUpdater::performOTAUpdate() {
  WiFiClient client;
  auto ret = httpUpdate.update(client, OTA_FIRMWARE_URL);

  String messageType;
  JsonDocument doc;
  switch (ret) {
    case HTTP_UPDATE_FAILED:
      LOG_ERROR("HTTP_UPDATE_FAILED Error (" +
                String(httpUpdate.getLastError()) +
                "): " + httpUpdate.getLastErrorString());
      messageType = "error";
      doc["message"] = "HTTP_UPDATE_FAILED: " + httpUpdate.getLastErrorString();
      break;
    case HTTP_UPDATE_NO_UPDATES:
      LOG_INFO("HTTP_UPDATE_NO_UPDATES - No updates available");
      messageType = "status";
      doc["message"] = "No updates available";
      break;
    case HTTP_UPDATE_OK:
      LOG_INFO("HTTP_UPDATE_OK - Update successful");
      messageType = "status";
      doc["message"] = "Update successful";
      break;
  }
  _webSocketServer.broadcastMessage(messageType, doc);
}
