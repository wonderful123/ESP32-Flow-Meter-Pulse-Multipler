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

// Helper function to create a JSON response
void RouteHandler::sendJsonResponse(AsyncWebServerRequest* request,
                                    int statusCode, const char* message,
                                    JsonDocument data = JsonDocument()) {
  JsonDocument jsonResponse;
  jsonResponse["status"] = (statusCode == 200) ? "success" : "error";
  jsonResponse["message"] = message;

  if (!data.isNull()) {
    jsonResponse["data"] = data;  // Directly set data
  }

  String responseString;
  serializeJson(jsonResponse, responseString);
  // request->send(statusCode, "application/json", responseString);
}

// Handle GET /api/calibration-records
void RouteHandler::getCalibrationRecords(AsyncWebServerRequest* request) {
  LOG_INFO("Fetching calibration records...");
  JsonDocument recordData = _calibrationManager.getCalibrationRecordsJson();
  sendJsonResponse(request, 200, "Fetched calibration records.", recordData);
}

// Handle GET /api/calibration-records/{id}
void RouteHandler::getCalibrationRecord(AsyncWebServerRequest* request) {
  // Check if "id" parameter is present
  if (!request->hasParam("id")) {
    LOG_INFO("Missing ID parameter in getCalibrationRecord request");
    sendJsonResponse(request, 400, "Missing ID parameter.");
    return;
  }
  
  int id = request->getParam("id")->value().toInt();
  JsonDocument doc = _calibrationManager.getCalibrationRecordJson(id);
  
  // Handle case where the calibration record exists
  if (!doc.isNull()) {
    LOG_INFO("Calibration record found for ID: {}", id);
    sendJsonResponse(request, 200, "Fetched calibration record.", doc);
  } else {
    LOG_INFO("Calibration record not found for ID: {}", id);
    sendJsonResponse(request, 404, "Calibration record not found.");
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

    sendJsonResponse(request, 201, "Calibration record added successfully.");
    _pulseCounter.resetPulseCount();  // Reset for the next calibration
  } else {
    String missingFields = "";
    if (!request->hasParam("oilTemperature"))
      missingFields += "oilTemperature ";
    if (!request->hasParam("pulseCount")) missingFields += "pulseCount ";
    if (!request->hasParam("targetOilVolume"))
      missingFields += "targetOilVolume ";
    if (!request->hasParam("observedOilVolume"))
      missingFields += "observedOilVolume ";
    if (!request->hasParam("timestamp")) missingFields += "timestamp ";

    JsonDocument data;
    data["missingFields"] = missingFields;
    sendJsonResponse(request, 400, "Missing required parameters.", data);
  }
}

// Handle PUT /api/calibration-records/{id}
void RouteHandler::editCalibrationRecord(AsyncWebServerRequest* request) {
  LOG_INFO("Handling edit request");

  if (request->hasParam("id") && request->hasParam("oilTemperature") &&
      request->hasParam("pulseCount") && request->hasParam("targetOilVolume") &&
      request->hasParam("observedOilVolume") &&
      request->hasParam("timestamp")) {
    int id = request->getParam("id")->value().toInt();
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

    sendJsonResponse(request, 200, "Calibration record updated successfully.");
  } else {
    sendJsonResponse(request, 400, "Missing data for update.");
  }
}

// Handle DELETE /api/calibration-records/{id}
void RouteHandler::deleteCalibrationRecord(AsyncWebServerRequest* request) {
  LOG_INFO("Handling delete request");

  if (request->hasParam("id")) {
    int id = request->getParam("id")->value().toInt();
    _calibrationManager.deleteCalibrationRecord(id);
    sendJsonResponse(request, 200, "Calibration record deleted successfully.");
  } else {
    sendJsonResponse(request, 400, "Missing ID for deletion.");
  }
}

// Handle GET /api/calibration/start
void RouteHandler::startCalibration(AsyncWebServerRequest* request) {
  _pulseCounter.resetPulseCount();  // Reset the pulse count
  _pulseCounter.startCounting();    // Start counting pulses

  JsonDocument data;
  data["pulseCount"] = 0;
  sendJsonResponse(request, 200, "Calibration started. Please start your flow.",
                   data);
}

// Handle GET /api/calibration/stop
void RouteHandler::stopCalibration(AsyncWebServerRequest* request) {
  _pulseCounter.stopCounting();
  unsigned long pulseCount = _pulseCounter.getPulseCount();

  JsonDocument data;
  data["pulseCount"] = pulseCount;
  sendJsonResponse(request, 200, "Calibration stopped.", data);
}

// Handle GET /api/calibration/reset
void RouteHandler::resetCalibration(AsyncWebServerRequest* request) {
  _pulseCounter.resetPulseCount();
  request->send(200, "text/plain", "Calibration counter reset.");
}

// Handle GET /api/firmware-version
void RouteHandler::getFirmwareVersion(AsyncWebServerRequest* request) {
  _otaUpdater.checkForUpdate();

  JsonDocument data;
  data["currentVersion"] = FIRMWARE_VERSION;
  sendJsonResponse(request, 202, "Update check initiated.", data);
}

// Handle POST /api/firmware-update
void RouteHandler::handleOTAUpdate(AsyncWebServerRequest* request) {
  if (request->hasArg("url")) {
    _otaUpdater.performOTAUpdate();
    request->send(200, "text/plain", "Attempting to perform OTA update...");
  } else {
    request->send(400, "text/plain", "Missing URL parameter for OTA update.");
  }
}

// Handle 404 errors
void RouteHandler::handleNotFound(AsyncWebServerRequest* request) {
  request->send(404, "text/html",
                "<h1>404: Not Found</h1><p>The requested file: " +
                    request->url() + " was not found.</p>");
}