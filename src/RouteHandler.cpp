// RouteHandler.cpp
#include "RouteHandler.h"

#include <ArduinoJson.h>
#include <AsyncJson.h>
#include <LittleFS.h>
#include <Logger.h>

#include "Settings.h"
#include "WebServerManager.h"

RouteHandler::RouteHandler(CalibrationManager& calibrationManager,
                           InputPulseMonitor& inputPulseMonitor,
                           OTAUpdater& otaUpdater,
                           WebServerManager& webServerManager)
    : _calibrationManager(calibrationManager),
      _inputPulseMonitor(inputPulseMonitor),
      _otaUpdater(otaUpdater),
      _webServerManager(webServerManager) {}

// Helper function to build full path
String RouteHandler::buildFullPath(const char* path) const {
  return String(API_PREFIX) + "/" + API_VERSION + path;
}

// Register routes using a data structure and loop
void RouteHandler::registerRoutes(AsyncWebServer& server) {
  // GET /calibration/mode
  server.on(
      buildFullPath("/calibration/mode").c_str(), HTTP_GET,
      [this](AsyncWebServerRequest* request) { getCalibrationMode(request); });

  // PUT /calibration/mode
  server.addHandler(new AsyncCallbackJsonWebHandler(
      buildFullPath("/calibration/mode").c_str(),
      [this](AsyncWebServerRequest* request, JsonVariant& json) {
        setCalibrationMode(request, json);
      }));

  // GET /calibration/fixed-factor
  server.on(
      buildFullPath("/calibration/fixed-factor").c_str(), HTTP_GET,
      [this](AsyncWebServerRequest* request) { getFixedFactor(request); });

  // PUT /calibration/fixed-factor
  server.addHandler(new AsyncCallbackJsonWebHandler(
      buildFullPath("/calibration/fixed-factor").c_str(),
      [this](AsyncWebServerRequest* request, JsonVariant& json) {
        setFixedFactor(request, json);
      }));

  // GET /calibration-records
  server.on(buildFullPath("/calibration-records").c_str(), HTTP_GET,
            [this](AsyncWebServerRequest* request) {
              getCalibrationRecords(request);
            });

  // POST /calibration-records
  server.addHandler(new AsyncCallbackJsonWebHandler(
      buildFullPath("/calibration-records").c_str(),
      [this](AsyncWebServerRequest* request, JsonVariant& json) {
        addCalibrationRecord(request, json);
      }));

  // GET /calibration-records/{id}
  server.on(
      ("^" + buildFullPath("/calibration-records/") + "([0-9]+)$").c_str(),
      HTTP_GET, [this](AsyncWebServerRequest* request) {
        getCalibrationRecord(request);
      });

  // PUT /calibration-records/{id}
  server.addHandler(new AsyncCallbackJsonWebHandler(
      ("^" + buildFullPath("/calibration-records/") + "([0-9]+)$").c_str(),
      [this](AsyncWebServerRequest* request, JsonVariant& json) {
        editCalibrationRecord(request, json);
      }));

  // DELETE /calibration-records/{id}
  server.on(
      ("^" + buildFullPath("/calibration-records/") + "([0-9]+)$").c_str(),
      HTTP_DELETE, [this](AsyncWebServerRequest* request) {
        deleteCalibrationRecord(request);
      });

  // GET /calibration/start
  server.on(
      buildFullPath("/calibration/start").c_str(), HTTP_GET,
      [this](AsyncWebServerRequest* request) { startCalibration(request); });

  // GET /calibration/stop
  server.on(
      buildFullPath("/calibration/stop").c_str(), HTTP_GET,
      [this](AsyncWebServerRequest* request) { stopCalibration(request); });

  // GET /calibration/reset
  server.on(
      buildFullPath("/calibration/reset").c_str(), HTTP_GET,
      [this](AsyncWebServerRequest* request) { resetCalibration(request); });

  // GET /firmware-version
  server.on(
      buildFullPath("/firmware-version").c_str(), HTTP_GET,
      [this](AsyncWebServerRequest* request) { getFirmwareVersion(request); });

  // POST /firmware-update
  server.addHandler(new AsyncCallbackJsonWebHandler(
      buildFullPath("/firmware-update").c_str(),
      [this](AsyncWebServerRequest* request, JsonVariant& json) {
        handleOTAUpdate(request, json);
      }));

  // Not found handler
  server.onNotFound(
      [this](AsyncWebServerRequest* request) { handleNotFound(request); });

  // Serve static files
  server.serveStatic("/", LittleFS, "/www/")
      .setDefaultFile("index.html")
      .setCacheControl("max-age=3600");

  LOG_INFO("Routes registered");
}

// Helper function to create a JSON response
void RouteHandler::sendJsonResponse(AsyncWebServerRequest* request,
                                    int statusCode, const char* message,
                                    const JsonObject& data) const {
  JsonDocument jsonResponse;
  jsonResponse["status"] = (statusCode == 200) ? "success" : "error";
  jsonResponse["message"] = message;

  if (!data.isNull()) {
    jsonResponse["data"] = data;  // Directly set data
  }

  String responseString;
  serializeJson(jsonResponse, responseString);
  request->send(statusCode, "application/json", responseString);
}

void RouteHandler::getCalibrationMode(AsyncWebServerRequest* request) const {
  CalibrationMode mode = _calibrationManager.getCalibrationMode();
  const char* modeString =
      (mode == CalibrationMode::Fixed) ? "fixed" : "temperature";

  JsonDocument data;
  data["mode"] = modeString;

  sendJsonResponse(request, 200, "Fetched calibration mode.",
                   data.as<JsonObject>());
  LOG_INFO("Fetched calibration mode: {}", modeString);
}

void RouteHandler::setCalibrationMode(AsyncWebServerRequest* request,
                                      JsonVariant& json) {
  JsonObject jsonObj = json.as<JsonObject>();

  if (!jsonObj["mode"].is<const char*>()) {
    LOG_WARN("Missing 'mode' parameter in request body");
    sendJsonResponse(request, 400, "Missing 'mode' parameter.");
    return;
  }

  String modeParam = jsonObj["mode"].as<String>();
  CalibrationMode mode;

  if (modeParam == "fixed") {
    mode = CalibrationMode::Fixed;
  } else if (modeParam == "temperature") {
    mode = CalibrationMode::TemperatureCompensated;
  } else {
    LOG_WARN("Invalid calibration mode: {}", modeParam.c_str());
    sendJsonResponse(request, 400, "Invalid calibration mode.");
    return;
  }

  _calibrationManager.setCalibrationMode(mode);
  LOG_INFO("Calibration mode set to: {}", modeParam.c_str());
  sendJsonResponse(request, 200, "Calibration mode updated successfully.");
}

void RouteHandler::getFixedFactor(AsyncWebServerRequest* request) const {
  float fixedFactor = _calibrationManager.getFixedCalibrationFactor();

  JsonDocument data;
  data["fixedCalibrationFactor"] = fixedFactor;

  sendJsonResponse(request, 200, "Fetched fixed calibration factor.",
                   data.as<JsonObject>());
  LOG_INFO("Fetched fixed calibration factor: {}", fixedFactor);
}

void RouteHandler::setFixedFactor(AsyncWebServerRequest* request,
                                  JsonVariant& json) {
  JsonObject jsonObj = json.as<JsonObject>();

  if (!jsonObj["fixedFactor"].is<float>()) {
    LOG_WARN("Missing 'fixedFactor' parameter in request body");
    sendJsonResponse(request, 400, "Missing 'fixedFactor' parameter.");
    return;
  }

  float factor = jsonObj["fixedFactor"].as<float>();

  if (factor <= 0) {
    LOG_WARN("Invalid fixed calibration factor: {}", factor);
    sendJsonResponse(request, 400, "Invalid fixed calibration factor.");
    return;
  }

  _calibrationManager.setFixedCalibrationFactor(factor);
  LOG_INFO("Fixed calibration factor set to: {}", factor);

  JsonDocument data;
  data["fixedCalibrationFactor"] = factor;

  sendJsonResponse(request, 200,
                   "Fixed calibration factor updated successfully.",
                   data.as<JsonObject>());
}

// Handle GET /api/calibration-records
void RouteHandler::getCalibrationRecords(AsyncWebServerRequest* request) const {
  LOG_INFO("Fetching calibration records...");

  JsonDocument data = _calibrationManager.getCalibrationRecordsJson();

  sendJsonResponse(request, 200, "Fetched calibration records.",
                   data.as<JsonObject>());
}

// Handle GET /api/calibration-records/{id}
void RouteHandler::getCalibrationRecord(AsyncWebServerRequest* request) const {
  if (!request->hasParam("id")) {
    LOG_WARN("Missing ID parameter in getCalibrationRecord request");
    sendJsonResponse(request, 400, "Missing ID parameter.");
    return;
  }

  size_t id = request->getParam("id")->value().toInt();
  JsonDocument doc = _calibrationManager.getCalibrationRecordJson(id);

  if (!doc.isNull()) {
    LOG_INFO("Calibration record found for ID: {}", id);
    sendJsonResponse(request, 200, "Fetched calibration record.",
                     doc.as<JsonObject>());
  } else {
    LOG_WARN("Calibration record not found for ID: {}", id);
    sendJsonResponse(request, 404, "Calibration record not found.");
  }
}

void RouteHandler::addCalibrationRecord(AsyncWebServerRequest* request,
                                        JsonVariant& json) {
  JsonObject jsonObj = json.as<JsonObject>();

  const char* requiredFields[] = {"oilTemperature", "pulseCount",
                                  "targetOilVolume", "observedOilVolume",
                                  "timestamp"};
  for (const char* field : requiredFields) {
    if (!jsonObj[field].is<const char*>()) {
      LOG_WARN("Missing '{}' parameter in request body", field);
      sendJsonResponse(request, 400,
                       ("Missing '" + String(field) + "' parameter.").c_str());
      return;
    }
  }

  float oilTemperature = jsonObj["oilTemperature"].as<float>();
  unsigned long pulseCount = jsonObj["pulseCount"].as<unsigned long>();
  float targetOilVolume = jsonObj["targetOilVolume"].as<float>();
  float observedOilVolume = jsonObj["observedOilVolume"].as<float>();
  unsigned long timestamp = jsonObj["timestamp"].as<unsigned long>();

  _calibrationManager.addCalibrationRecord(oilTemperature, pulseCount,
                                           targetOilVolume, observedOilVolume,
                                           timestamp);

  LOG_INFO("Calibration record added successfully.");
  sendJsonResponse(request, 201, "Calibration record added successfully.");

  _inputPulseMonitor.resetPulseCount();  // Reset for the next calibration
}

// Handle PUT /api/calibration-records/{id}
void RouteHandler::editCalibrationRecord(AsyncWebServerRequest* request,
                                         JsonVariant& json) {
  if (!request->hasParam("id")) {
    LOG_WARN("Missing ID parameter in editCalibrationRecord request");
    sendJsonResponse(request, 400, "Missing ID parameter.");
    return;
  }

  size_t id = request->getParam("id")->value().toInt();
  JsonObject jsonObj = json.as<JsonObject>();

  const char* requiredFields[] = {"oilTemperature", "pulseCount",
                                  "targetOilVolume", "observedOilVolume",
                                  "timestamp"};
  for (const char* field : requiredFields) {
    if (!jsonObj[field].is<const char*>()) {
      LOG_WARN("Missing '{}' parameter in request body", field);
      sendJsonResponse(request, 400,
                       ("Missing '" + String(field) + "' parameter.").c_str());
      return;
    }
  }

  float oilTemperature = jsonObj["oilTemperature"].as<float>();
  unsigned long pulseCount = jsonObj["pulseCount"].as<unsigned long>();
  float targetOilVolume = jsonObj["targetOilVolume"].as<float>();
  float observedOilVolume = jsonObj["observedOilVolume"].as<float>();
  unsigned long timestamp = jsonObj["timestamp"].as<unsigned long>();

  if (_calibrationManager.updateCalibrationRecord(
          id, oilTemperature, pulseCount, targetOilVolume, observedOilVolume,
          timestamp)) {
    LOG_INFO("Calibration record updated successfully for ID: {}", id);
    sendJsonResponse(request, 200, "Calibration record updated successfully.");
  } else {
    LOG_WARN("Calibration record not found for ID: {}", id);
    sendJsonResponse(request, 404, "Calibration record not found.");
  }
}

// Handle DELETE /api/calibration-records/{id}
void RouteHandler::deleteCalibrationRecord(AsyncWebServerRequest* request) {
  if (!request->hasParam("id")) {
    LOG_WARN("Missing ID parameter in deleteCalibrationRecord request");
    sendJsonResponse(request, 400, "Missing ID parameter.");
    return;
  }

  size_t id = request->getParam("id")->value().toInt();

  if (_calibrationManager.deleteCalibrationRecord(id)) {
    LOG_INFO("Calibration record deleted successfully for ID: {}", id);
    sendJsonResponse(request, 200, "Calibration record deleted successfully.");
  } else {
    LOG_WARN("Calibration record not found for ID: {}", id);
    sendJsonResponse(request, 404, "Calibration record not found.");
  }
}

// Handle GET /api/calibration/start
void RouteHandler::startCalibration(AsyncWebServerRequest* request) {
  LOG_INFO("Starting calibration...");
  _inputPulseMonitor.resetPulseCount();  // Reset the pulse count
  _inputPulseMonitor.startCounting();    // Start counting pulses

  JsonDocument data;
  data["pulseCount"] = 0;

  sendJsonResponse(request, 200, "Calibration started. Please start your flow.",
                   data.as<JsonObject>());
}

// Handle GET /api/calibration/stop
void RouteHandler::stopCalibration(AsyncWebServerRequest* request) {
  LOG_INFO("Stopping calibration...");
  _inputPulseMonitor.stopCounting();
  unsigned long pulseCount = _inputPulseMonitor.getPulseCount();

  JsonDocument data;
  data["pulseCount"] = pulseCount;

  sendJsonResponse(request, 200, "Calibration stopped.", data.as<JsonObject>());
}

// Handle GET /api/calibration/reset
void RouteHandler::resetCalibration(AsyncWebServerRequest* request) {
  LOG_INFO("Resetting calibration...");
  _inputPulseMonitor.resetPulseCount();
  request->send(200, "text/plain", "Calibration counter reset.");
}

// Handle GET /api/firmware-version
void RouteHandler::getFirmwareVersion(AsyncWebServerRequest* request) {
  LOG_INFO("Fetching firmware version...");
  _otaUpdater.checkForUpdate();

  JsonDocument data;
  data["currentVersion"] = FIRMWARE_VERSION;

  sendJsonResponse(request, 202, "Update check initiated.",
                   data.as<JsonObject>());
}

// Handle POST /api/firmware-update
void RouteHandler::handleOTAUpdate(AsyncWebServerRequest* request,
                                   JsonVariant& json) {
  JsonObject jsonObj = json.as<JsonObject>();

  if (!jsonObj["url"].is<const char*>()) {
    LOG_WARN("Missing 'url' parameter in OTA update request");
    sendJsonResponse(request, 400, "Missing 'url' parameter for OTA update.");
    return;
  }

  String url = jsonObj["url"].as<String>();
  LOG_INFO("Performing OTA update from URL: {}", url.c_str());
  _otaUpdater.performOTAUpdate();
  sendJsonResponse(request, 200, "Attempting to perform OTA update...");
}

// Handle 404 errors
void RouteHandler::handleNotFound(AsyncWebServerRequest* request) {
  LOG_DEBUG("Request not found: {}", request->url().c_str());
  request->send(404, "text/html",
                "<h1>404: Not Found</h1><p>The requested file: " +
                    request->url() + " was not found.</p>");
}