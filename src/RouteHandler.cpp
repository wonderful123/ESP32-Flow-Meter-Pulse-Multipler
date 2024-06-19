// RouteHandler.cpp
#include "RouteHandler.h"

#include <ArduinoJson.h>
#include <LittleFS.h>
#include <Logger.h>

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
  server.on("/api/calibration-records", HTTP_GET,
            [this](AsyncWebServerRequest* request) {
              this->getCalibrationRecords(request);
            });
  server.on("/api/calibration-records", HTTP_POST,
            [this](AsyncWebServerRequest* request) {
              this->addCalibrationRecord(request);
            });
  server.on("^/api/calibration-records/(\\d+)$", HTTP_GET,
            [this](AsyncWebServerRequest* request) {
              this->getCalibrationRecord(request);
            });
  server.on("^/api/calibration-records/(\\d+)$", HTTP_PUT,
            [this](AsyncWebServerRequest* request) {
              this->editCalibrationRecord(request);
            });
  server.on("^/api/calibration-records/(\\d+)$", HTTP_DELETE,
            [this](AsyncWebServerRequest* request) {
              this->deleteCalibrationRecord(request);
            });

  server.on("/api/calibration/start", HTTP_GET,
            [this](AsyncWebServerRequest* request) {
              this->startCalibration(request);
            });
  server.on("/api/calibration/stop", HTTP_GET,
            [this](AsyncWebServerRequest* request) {
              this->stopCalibration(request);
            });
  server.on("/api/calibration/reset", HTTP_GET,
            [this](AsyncWebServerRequest* request) {
              this->resetCalibration(request);
            });

  server.on("/api/firmware-version", HTTP_GET,
            [this](AsyncWebServerRequest* request) {
              this->getFirmwareVersion(request);
            });
  server.on("/api/firmware-update", HTTP_POST,
            [this](AsyncWebServerRequest* request) {
              this->handleOTAUpdate(request);
            });

  server.onNotFound([this](AsyncWebServerRequest* request) {
    this->handleNotFound(request);
  });

  // Serve static files from LittleFS
  server.serveStatic("/", LittleFS, "/www/")
      .setDefaultFile("index.html")
      .setCacheControl("max-age=3600")
      .setFilter([](AsyncWebServerRequest* request) {
        return !request->url().endsWith(".gz");  // Ignore direct .gz requests
      });

  LOG_INFO("Routes registered");
}

void RouteHandler::getCalibrationRecords(AsyncWebServerRequest* request) {
  LOG_INFO("Fetching calibration records...");
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
  // Log the request args
  LOG_INFO("Adding calibration record...");
  LOG_INFO("Oil temperature: {}", request->arg("oilTemperature"));
  LOG_INFO("Pulse count: {}", request->arg("pulseCount"));
  LOG_INFO("Target oil volume: {}", request->arg("targetOilVolume"));
  LOG_INFO("Observed oil volume: {}", request->arg("observedOilVolume"));
  LOG_INFO("Timestamp: {}", request->arg("timestamp"));

  if (request->hasParam("oilTemperature") && request->hasParam("pulseCount") &&
      request->hasParam("targetOilVolume") &&
      request->hasParam("observedOilVolume") &&
      request->hasParam("timestamp")) {
    float oilTemperature =
        request->getParam("oilTemperature")->value().toFloat();
    unsigned long pulseCount = request->getParam("pulseCount")->value().toInt();
    float targetOilVolume =
        request->getParam("targetOilVolume")->value().toFloat();
    float observedOilVolume =
        request->getParam("observedOilVolume")->value().toFloat();
    unsigned long timestamp = request->getParam("timestamp")->value().toInt();

    _calibrationManager.addCalibrationRecord(oilTemperature, pulseCount,
                                             targetOilVolume, observedOilVolume,
                                             timestamp);
    request->send(200, "application/json",
                  "{\"message\":\"Calibration record added successfully.\"}");
  } else {
    // Collect missing fields
    String missingFields = "";
    if (!request->hasParam("oilTemperature")) {
      missingFields += "oilTemperature ";
    }
    if (!request->hasParam("pulseCount")) {
      missingFields += "pulseCount ";
    }
    if (!request->hasParam("targetOilVolume")) {
      missingFields += "targetOilVolume ";
    }
    if (!request->hasParam("observedOilVolume")) {
      missingFields += "observedOilVolume ";
    }
    if (!request->hasParam("timestamp")) {
      missingFields += "timestamp ";
    }
    request->send(400, "application/json",
                  "{\"error\":\"Missing fields: " + missingFields + "\"}");
  }

  _pulseCounter.resetPulseCount();  // Reset for the next calibration
}

void RouteHandler::editCalibrationRecord(AsyncWebServerRequest* request) {
  LOG_INFO("Handling edit request");

  if (request->hasParam("id") && request->hasParam("oilTemperature") &&
      request->hasParam("pulseCount") && request->hasParam("targetOilVolume") &&
      request->hasParam("observedOilVolume") &&
      request->hasParam("timestamp")) {
    int id = request->pathArg(0).toInt();
    float oilTemperature =
        request->getParam("oilTemperature")->value().toFloat();
    unsigned long pulseCount = request->getParam("pulseCount")->value().toInt();
    float targetOilVolume =
        request->getParam("targetOilVolume")->value().toFloat();
    float observedOilVolume =
        request->getParam("observedOilVolume")->value().toFloat();
    unsigned long timestamp = request->getParam("timestamp")->value().toInt();

    _calibrationManager.updateCalibrationRecord(id, oilTemperature, pulseCount,
                                                targetOilVolume,
                                                observedOilVolume, timestamp);
    LOG_INFO("Calibration record updated successfully");
    request->send(200, "application/json",
                  "{\"message\":\"Calibration record updated successfully.\"}");
  } else {
    LOG_ERROR("Missing data for update.");
    request->send(400, "application/json",
                  "{\"error\":\"Missing data for update.\"}");
  }
}

void RouteHandler::deleteCalibrationRecord(AsyncWebServerRequest* request) {
  LOG_INFO("Handling delete request");

  if (request->hasArg("id")) {
    int id = request->pathArg(0).toInt();
    _calibrationManager.deleteCalibrationRecord(id);
    LOG_INFO("Calibration record deleted successfully");
    request->send(200, "application/json",
                  "{\"message\":\"Calibration record deleted successfully.\"}");
  } else {
    LOG_ERROR("Missing ID for deletion.");
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

void RouteHandler::resetCalibration(AsyncWebServerRequest* request) {
  _pulseCounter.resetPulseCount();  // Reset the pulse count to 0

  request->send(200, "text/plain", "Calibration counter reset.");
}

void RouteHandler::getFirmwareVersion(AsyncWebServerRequest* request) {
  // Directly call checkForUpdate without handling the response here.
  // OTAUpdater will broadcast the update status over WebSocket.
  _otaUpdater.checkForUpdate();

  request->send(202, "application/json",
                "{ \"message\": \"Update check initiated.\", \"firmware\": "
                "{\"currentVersion\": \"" +
                    String(FIRMWARE_VERSION) + "}}");
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
  request->send(404, "text/html",
                "<h1>404: Not Found</h1><p>The requested file:" +
                    request->url() + " was not found.</p>");
}
