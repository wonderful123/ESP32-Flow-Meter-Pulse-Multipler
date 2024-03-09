// WebServerManager.cpp
#include "WebServerManager.h"

#include <FS.h>
#include <LittleFS.h>

#include "CalibrationManager.h"
#include "Settings.h"

WebServerManager::WebServerManager(CalibrationManager& calibrationManager,
                                   PulseCounter& pulseCounter)
    : _server(80),
      _calibrationManager(calibrationManager),
      _pulseCounter(pulseCounter),
      _webSocketServer(WEBSOCKET_PORT) {}

void WebServerManager::begin() {
  mountFileSystem();
  setupRoutes();
  _webSocketServer.begin(&_server);
  _server.begin();
  Serial.println("HTTP server started at IP address: " +
                 WiFi.localIP().toString());
  startMDNS();
  _otaUpdater.begin();
}

void WebServerManager::update() {
  MDNS.update();
  _otaUpdater.handle();
}

void WebServerManager::broadcastPulseCount(unsigned long pulseCount) {
  _webSocketServer.broadcastPulseCount(pulseCount);
}

void WebServerManager::mountFileSystem() {
  if (!LittleFS.begin()) {
    Serial.println("Error: Failed to mount LittleFS");
    return;
  }
  Serial.println("LittleFS mounted successfully");
}

void WebServerManager::startMDNS() {
  if (!MDNS.begin("pulse-scaler")) {
    Serial.println("Error setting up MDNS responder");
  }
  MDNS.addService("http", "tcp", 80);
  Serial.println("mDNS responder started at http://pulse-scaler.local");
}

void WebServerManager::setupRoutes() {
  // Dynamic content and action routes
  _server.on("/get-scaling-factor", HTTP_GET,
             [this](AsyncWebServerRequest* request) {
               float scalingFactor = _calibrationManager.getScalingFactor();
               char buffer[32];
               snprintf(buffer, sizeof(buffer), "{\"scalingFactor\": %.2f}",
                        scalingFactor);
               request->send(200, "application/json", buffer);
             });

  _server.on(
      "/set-scaling-factor", HTTP_POST, [this](AsyncWebServerRequest* request) {
        if (request->hasArg("scalingFactor")) {
          float scalingFactor = request->arg("scalingFactor").toFloat();
          _calibrationManager.setScalingFactor(scalingFactor);
          request->send(200, "text/plain",
                        "Scaling factor updated successfully.");
        } else {
          request->send(400, "text/plain", "Missing scalingFactor parameter.");
        }
      });

  _server.on("/calibration-records", HTTP_GET,
             [this](AsyncWebServerRequest* request) {
               Serial.println("Fetching calibration records...");
               String json = _calibrationManager.getCalibrationRecordsJson();
               Serial.println("Calibration records JSON:" + json);
               request->send(200, "application/json", json);
             });

  _server.on("/calibration-record", HTTP_GET,
             [this](AsyncWebServerRequest* request) {
               if (!request->hasArg("id")) {
                 request->send(400, "text/plain", "Missing ID parameter");
                 return;
               }

               int id = request->arg("id").toInt();
               String json = _calibrationManager.getCalibrationRecordJson(id);
               request->send(200, "application/json", json);
             });

  _server.on(
      "/update-calibration", HTTP_POST,
      [this](AsyncWebServerRequest* request) { this->handleEdit(request); });

  _server.on(
      "/delete-calibration", HTTP_POST,
      [this](AsyncWebServerRequest* request) { this->handleDelete(request); });

  _server.on("/start-calibration", HTTP_GET,
             [this](AsyncWebServerRequest* request) {
               _pulseCounter.resetPulseCount();  // Reset the pulse count to 0
               _pulseCounter.startCounting();    // Begin counting pulses
               request->send(200, "text/plain",
                             "Calibration started. Please start your flow.");
             });

  _server.on(
      "/stop-calibration", HTTP_GET, [this](AsyncWebServerRequest* request) {
        _pulseCounter.stopCounting();  // Stop counting pulses
        unsigned long pulseCount =
            _pulseCounter.getPulseCount();  // Retrieve the pulse count
        _pulseCounter.resetPulseCount();    // Reset for the next calibration

        // Prepare JSON response with pulse count
        String jsonResponse = "{\"pulseCount\":" + String(pulseCount) + "}";
        request->send(200, "application/json", jsonResponse);
      });

  _server.on("/add-calibration-record", HTTP_POST,
             [this](AsyncWebServerRequest* request) {
               if (request->hasArg("targetVolume") &&
                   request->hasArg("observedVolume") &&
                   request->hasArg("pulseCount")) {
                 float targetVolume = request->arg("targetVolume").toFloat();
                 float observedVolume =
                     request->arg("observedVolume").toFloat();
                 unsigned long pulseCount =
                     request->arg("pulseCount")
                         .toInt();  // Directly use provided pulseCount

                 _calibrationManager.addCalibrationRecord(
                     targetVolume, observedVolume, pulseCount);

                 request->send(200, "text/plain", "Calibration record added");
               } else {
                 request->send(400, "text/plain", "Missing data");
               }
             });

  _server.on("/firmware-version", HTTP_GET,
             [this](AsyncWebServerRequest* request) {
               request->send(200, "text/plain", FIRMWARE_VERSION);
             });

  _server.on(
      "/perform-ota-update", HTTP_GET,
      [this](AsyncWebServerRequest* request) { handleOTAUpdate(request); });

  // Fallback for not found routes
  _server.onNotFound([this](AsyncWebServerRequest* request) {
    this->handleNotFound(request);
  });

  // Serve static files from LittleFS
  _server.serveStatic("/", LittleFS, "/").setDefaultFile("index.html");
}

void WebServerManager::handleEdit(AsyncWebServerRequest* request) {
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

void WebServerManager::handleDelete(AsyncWebServerRequest* request) {
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

void WebServerManager::handleNotFound(AsyncWebServerRequest* request) {
  request->send(404, "text/html", "<h1>404: Not Found</h1>");
}

void WebServerManager::handleOTAUpdate(AsyncWebServerRequest* request) {
  if (request->hasArg("url")) {
    _otaUpdater.performOTAUpdate(
        OTA_FIRMWARE_URL);  // Trigger the OTA update with the URL
    request->send(200, "text/plain", "Attempting to perform OTA update...");
  } else {
    request->send(400, "text/plain", "Missing URL parameter for OTA update.");
  }
}