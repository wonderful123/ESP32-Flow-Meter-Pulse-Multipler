// RouteHandler.h
#pragma once

#include <ESPAsyncWebServer.h>

#include "Calibration/CalibrationManager.h"
#include "InputPulseMonitor.h"
#include "OTAUpdater.h"

// Forward declaration
class WebServerManager;

class RouteHandler {
 public:
  RouteHandler(CalibrationManager& calibrationManager,
               InputPulseMonitor& inputPulseMonitor, OTAUpdater& otaUpdater,
               WebServerManager& webServerManager);
  void registerRoutes(AsyncWebServer& server);

 private:
  CalibrationManager& _calibrationManager;
  InputPulseMonitor& _inputPulseMonitor;
  OTAUpdater& _otaUpdater;
  WebServerManager& _webServerManager;

  // Helper functions
  void sendJsonResponse(AsyncWebServerRequest* request, int statusCode,
                        const char* message,
                        const JsonObject& data = JsonObject()) const;
  String buildFullPath(const char* path) const;

  // Route handling methods
  void getCalibrationMode(AsyncWebServerRequest* request) const;
  void setCalibrationMode(AsyncWebServerRequest* request, JsonVariant& json);
  void getFixedFactor(AsyncWebServerRequest* request) const;
  void setFixedFactor(AsyncWebServerRequest* request, JsonVariant& json);
  void getCalibrationRecords(AsyncWebServerRequest* request) const;
  void getCalibrationRecord(AsyncWebServerRequest* request) const;
  void addCalibrationRecord(AsyncWebServerRequest* request, JsonVariant& json);
  void editCalibrationRecord(AsyncWebServerRequest* request, JsonVariant& json);
  void deleteCalibrationRecord(AsyncWebServerRequest* request);
  void startCalibration(AsyncWebServerRequest* request);
  void stopCalibration(AsyncWebServerRequest* request);
  void resetCalibration(AsyncWebServerRequest* request);
  void getFirmwareVersion(AsyncWebServerRequest* request);
  void handleOTAUpdate(AsyncWebServerRequest* request, JsonVariant& json);
  void handleNotFound(AsyncWebServerRequest* request);
};