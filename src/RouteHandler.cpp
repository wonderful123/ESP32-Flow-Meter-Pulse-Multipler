// RouteHandler.cpp
#include "RouteHandler.h"

#include <ArduinoJson.h>

#include "Settings.h"
#include "WebServerManager.h"

RouteHandler::RouteHandler(CalibrationManager& calibrationManager,
                           PulseCounter& pulseCounter, OTAUpdater& otaUpdater,
                           WebServerManager& webServerManager)
    : _calibrationManager(calibrationManager),
      _pulseCounter(pulseCounter),
      _otaUpdater(otaUpdater),
      _webServerManager(webServerManager) {}

void RouteHandler::registerRoutes(AsyncWebServer& server) {
  server.on("/calibration-factor", HTTP_GET,
            [this](AsyncWebServerRequest* request) {
              this->getCalibrationFactor(request);
            });
  server.on("/calibration-factor", HTTP_POST,
            [this](AsyncWebServerRequest* request) {
              this->setCalibrationFactor(request);
            });

  server.on("/calibration-records", HTTP_GET,
            [this](AsyncWebServerRequest* request) {
              this->getCalibrationRecords(request);
            });
  server.on("/calibration-records", HTTP_POST,
            [this](AsyncWebServerRequest* request) {
              this->addCalibrationRecord(request);
            });
  server.on("^/calibration-records/(\\d+)$", HTTP_GET,
            [this](AsyncWebServerRequest* request) {
              this->getCalibrationRecord(request);
            });
  server.on("^/calibration-records/(\\d+)$", HTTP_PUT,
            [this](AsyncWebServerRequest* request) {
              this->editCalibrationRecord(request);
            });
  server.on("^/calibration-records/(\\d+)$", HTTP_DELETE,
            [this](AsyncWebServerRequest* request) {
              this->deleteCalibrationRecord(request);
            });

  server.on("/start-calibration", HTTP_GET,
            [this](AsyncWebServerRequest* request) {
              this->startCalibration(request);
            });
  server.on("/stop-calibration", HTTP_GET,
            [this](AsyncWebServerRequest* request) {
              this->stopCalibration(request);
            });

  server.on("/firmware-version", HTTP_GET,
            [this](AsyncWebServerRequest* request) {
              this->getFirmwareVersion(request);
            });
  server.on("/firmware-update", HTTP_POST,
            [this](AsyncWebServerRequest* request) {
              this->handleOTAUpdate(request);
            });

  server.onNotFound([this](AsyncWebServerRequest* request) {
    this->handleNotFound(request);
  });
}

void RouteHandler::getCalibrationFactor(AsyncWebServerRequest* request) {
  float calibrationFactor = _calibrationManager.getCalibrationFactor();
  char buffer[32];
  snprintf(buffer, sizeof(buffer), "{\"calibrationFactor\": %.2f}",
           calibrationFactor);
  request->send(200, "application/json", buffer);
}

void RouteHandler::setCalibrationFactor(AsyncWebServerRequest* request) {
  if (request->hasArg("calibrationFactor")) {
    float calibrationFactor = request->arg("calibrationFactor").toFloat();
    _calibrationManager.setCalibrationFactor(calibrationFactor);
    request->send(200, "text/plain",
                  "Calibration factor updated successfully.");
  } else {
    request->send(400, "text/plain", "Missing CalibrationFactor parameter.");
  }
}

void RouteHandler::getCalibrationRecords(AsyncWebServerRequest* request) {
  Serial.println("Fetching calibration records...");
  String json = _calibrationManager.getCalibrationRecordsJson();
  request->send(200, "application/json", json);
}

void RouteHandler::getCalibrationRecord(AsyncWebServerRequest* request) {
  // Retrieve ID from URL parameter
  if (request->hasParam("id")) {
    String id = request->getParam("id")->value();
    String json = _calibrationManager.getCalibrationRecordJson(id.toInt());
    request->send(200, "application/json", json);
  } else {
    request->send(400, "text/plain", "Missing ID parameter.");
  }
}

void RouteHandler::addCalibrationRecord(AsyncWebServerRequest* request) {
  if (request->hasArg("targetVolume") && request->hasArg("observedVolume") &&
      request->hasArg("pulseCount")) {
    float targetVolume = request->arg("targetVolume").toFloat();
    float observedVolume = request->arg("observedVolume").toFloat();
    unsigned long pulseCount =
        request->arg("pulseCount").toInt();  // Directly use provided pulseCount
    unsigned long epochTime =
        _webServerManager.getEpochTimeManager().getEpochTime();
    float oilTemp = 0.0f;             // TODO: Get oil temperature from sensor
    const char* oilType = "unknown";  // TODO: Get oil type from user input

    _calibrationManager.addCalibrationRecord(
        targetVolume, observedVolume, pulseCount, epochTime, oilTemp, oilType);

    request->send(200, "text/plain", "Calibration record added");
  } else {
    request->send(400, "text/plain", "Missing data");
  }

  _pulseCounter.resetPulseCount();  // Reset for the next calibration
}

void RouteHandler::editCalibrationRecord(AsyncWebServerRequest* request) {
  Serial.println("Handling edit request");

  if (request->hasArg("id") && request->hasArg("targetVolume") &&
      request->hasArg("observedVolume") && request->hasArg("pulseCount")) {
    int id = request->arg("id").toInt();
    float targetVolume = request->arg("targetVolume").toFloat();
    float observedVolume = request->arg("observedVolume").toFloat();
    unsigned long pulseCount =
        request->arg("pulseCount").toInt();  // Updated to handle pulseCount

    _calibrationManager.updateCalibrationRecord(id, targetVolume,
                                                observedVolume, pulseCount);
    Serial.println("Calibration record updated successfully");
    request->send(200, "text/plain",
                  "Calibration record updated successfully.");
  } else {
    Serial.println("Missing data for update.");
    request->send(400, "text/plain", "Missing data for update.");
  }
}

void RouteHandler::deleteCalibrationRecord(AsyncWebServerRequest* request) {
  Serial.println("Handling delete request");

  if (request->hasArg("id")) {
    int id = request->arg("id").toInt();
    _calibrationManager.deleteCalibrationRecord(id);
    Serial.println("Calibration record deleted successfully");
    request->send(200, "text/plain",
                  "Calibration record deleted successfully.");
  } else {
    Serial.println("Missing ID for deletion.");
    request->send(400, "text/plain", "Missing ID for deletion.");
  }
}

void RouteHandler::startCalibration(AsyncWebServerRequest* request) {
  _pulseCounter.resetPulseCount();  // Reset the pulse count to 0
  _pulseCounter.startCounting();    // Begin counting pulses
  request->send(200, "text/plain",
                "Calibration started. Please start your flow.");
}

void RouteHandler::stopCalibration(AsyncWebServerRequest* request) {
  _pulseCounter.stopCounting();  // Stop counting pulses
  unsigned long pulseCount =
      _pulseCounter.getPulseCount();  // Retrieve the pulse count

  // Prepare JSON response with pulse count
  String jsonResponse = "{\"pulseCount\":" + String(pulseCount) + "}";
  request->send(200, "application/json", jsonResponse);
}

void RouteHandler::getFirmwareVersion(AsyncWebServerRequest* request) {
  // Directly call checkForUpdate without handling the response here.
  // OTAUpdater will broadcast the update status over WebSocket.
  _otaUpdater.checkForUpdate();

  request->send(202, "application/json",
                "{\"message\": \"Update check initiated.\"}");
}

void RouteHandler::handleOTAUpdate(AsyncWebServerRequest* request) {
  if (request->hasArg("url")) {
    _otaUpdater.performOTAUpdate();  // Trigger the OTA update with the URL
    request->send(200, "text/plain", "Attempting to perform OTA update...");
  } else {
    request->send(400, "text/plain", "Missing URL parameter for OTA update.");
  }
}

void RouteHandler::handleNotFound(AsyncWebServerRequest* request) {
  request->send(404, "text/html", "<h1>404: Not Found</h1>");
}
