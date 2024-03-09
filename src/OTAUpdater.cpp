// OTAUpdater.cpp
#include "OTAUpdater.h"

#include <ESP8266httpUpdate.h>

#include "Settings.h"

void OTAUpdater::begin() {
  ArduinoOTA.onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH) {
      type = "sketch";
    } else {  // U_SPIFFS
      type = "filesystem";
    }
    Serial.println("Start OTA updating " + type);
  });
  ArduinoOTA.onEnd([]() { Serial.println("\nEnd"); });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("OTA Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("OTA Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR)
      Serial.println("OTA Auth Failed");
    else if (error == OTA_BEGIN_ERROR)
      Serial.println("OTA Begin Failed");
    else if (error == OTA_CONNECT_ERROR)
      Serial.println("OTA Connect Failed");
    else if (error == OTA_RECEIVE_ERROR)
      Serial.println("OTAReceive Failed");
    else if (error == OTA_END_ERROR)
      Serial.println("OTA End Failed");
  });
  ArduinoOTA.begin();
}

void OTAUpdater::handle() { ArduinoOTA.handle(); }

void OTAUpdater::performOTAUpdate(const String& updateUrl) {
  WiFiClient client;
  t_httpUpdate_return ret = ESPhttpUpdate.update(client, updateUrl);

  switch (ret) {
    case HTTP_UPDATE_FAILED:
      Serial.printf("HTTP_UPDATE_FAILED Error (%d): %s\n",
                    ESPhttpUpdate.getLastError(),
                    ESPhttpUpdate.getLastErrorString().c_str());
      break;
    case HTTP_UPDATE_NO_UPDATES:
      Serial.println("HTTP_UPDATE_NO_UPDATES");
      break;
    case HTTP_UPDATE_OK:
      Serial.println("HTTP_UPDATE_OK");
      break;
  }
}

String OTAUpdater::checkForUpdate() {
  WiFiClient client;
  HTTPClient http;
  http.begin(client,
             "http://smoothcontrol.com/embedded-firmware/"
             "flowmeter-pulse-scaler/version.txt");
  int httpCode = http.GET();

  if (httpCode == HTTP_CODE_OK) {
    String newVersion = http.getString();  // Get the version string
    newVersion.trim();  // Trim whitespace or newline characters
    Serial.println("Current firmware version: " + String(FIRMWARE_VERSION));
    Serial.println("Available firmware version: " + newVersion);

    if (newVersion != FIRMWARE_VERSION) {
      // The new version is different from the current version.
      // The webserver manager should be alerted with the new version.a
      return newVersion;
    }
  } else {
    Serial.println("Failed to check for firmware updates");
  }

  http.end();
  return "";  // Return an empty string if there's no update or an error
              // occurred
}
