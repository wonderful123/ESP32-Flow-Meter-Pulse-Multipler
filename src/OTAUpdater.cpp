// OTAUpdater.cpp
#include "OTAUpdater.h"

#include <ArduinoJson.h>
#include <ESP8266httpUpdate.h>

#include "Settings.h"

void OTAUpdater::begin() {
  ArduinoOTA.onStart([this]() {
    const char* commandType =
        ArduinoOTA.getCommand() == U_FLASH ? "sketch" : "filesystem";
    Serial.println("Start OTA updating " + String(commandType));

    JsonDocument doc;
    String type = "status";
    doc["message"] = "Start OTA updating " + String(type);
    _webSocketServer.broadcastMessage(type, doc);
  });

  ArduinoOTA.onEnd([this]() {
    Serial.println("\nEnd");

    JsonDocument doc;
    String type = "status";
    doc["message"] = "Update complete";
    _webSocketServer.broadcastMessage(type, doc);
  });

  ArduinoOTA.onProgress([this](unsigned int progress, unsigned int total) {
    Serial.printf("OTA Progress: %u%%\r", (progress * 100) / total);

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
    Serial.printf("OTA Error[%u]: %s\n", error, errorMsg);

    JsonDocument doc;
    String type = "error";
    doc["message"] = String("OTA Error: ") + errorMsg;
    _webSocketServer.broadcastMessage(type, doc);
  });

  ArduinoOTA.begin();
}

void OTAUpdater::handle() { ArduinoOTA.handle(); }

String OTAUpdater::checkForUpdate() {
  HTTPClient http;
  WiFiClient client;
  http.begin(client, OTA_FIRMWARE_VERSION_URL);  // Defined in Settings.h
  int httpCode = http.GET();

  JsonDocument doc;
  if (httpCode == HTTP_CODE_OK) {
    String payload = http.getString();
    http.end();

    DeserializationError error = deserializeJson(doc, payload);
    if (error) {
      Serial.println("Failed to parse JSON");
      return "ERROR: Failed to parse JSON";
    }

    String newVersion = doc["version"].as<String>();
    String changes = doc["changes"].as<String>();

    Serial.println("Current firmware version: " + String(FIRMWARE_VERSION));
    Serial.println("Available firmware version: " + newVersion);
    if (newVersion != FIRMWARE_VERSION) {
      return newVersion + "|" + changes;
    }
    return "NO_UPDATE";
  } else {
    Serial.printf("Failed to check for firmware updates, HTTP code: %d\n",
                  httpCode);
    http.end();
    return "ERROR: HTTP request failed";
  }
}

void OTAUpdater::performOTAUpdate() {
  WiFiClient client;
  auto ret = ESPhttpUpdate.update(client, OTA_FIRMWARE_URL);

  String messageType;
  JsonDocument doc;
  switch (ret) {
    case HTTP_UPDATE_FAILED:
      Serial.printf("HTTP_UPDATE_FAILED Error (%d): %s\n",
                    ESPhttpUpdate.getLastError(),
                    ESPhttpUpdate.getLastErrorString().c_str());
      messageType = "error";
      doc["message"] =
          "HTTP_UPDATE_FAILED: " + ESPhttpUpdate.getLastErrorString();
      break;
    case HTTP_UPDATE_NO_UPDATES:
      Serial.println("HTTP_UPDATE_NO_UPDATES");
      messageType = "status";
      doc["message"] = "No updates available";
      break;
    case HTTP_UPDATE_OK:
      Serial.println("HTTP_UPDATE_OK");
      messageType = "status";
      doc["message"] = "Update successful";
      break;
  }
  _webSocketServer.broadcastMessage(messageType, doc);
}